
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NVDVulnerability {
  cve: {
    id: string;
    descriptions: Array<{ lang: string; value: string }>;
    published: string;
    lastModified: string;
    metrics?: {
      cvssMetricV31?: Array<{
        cvssData: {
          baseScore: number;
          baseSeverity: string;
        }
      }>;
      cvssMetricV2?: Array<{
        cvssData: {
          baseScore: number;
          baseSeverity: string;
        }
      }>;
    };
    configurations?: Array<{
      nodes: Array<{
        cpeMatch: Array<{
          criteria: string;
          vulnerable: boolean;
        }>
      }>
    }>;
  };
}

interface ProcessedVulnerability {
  cveId: string;
  vendor: string;
  product: string;
  severity: string;
  cvssScore: number | null;
  description: string;
}

interface EmailSettings {
  authMethod: string;
  fromEmail?: string;
  fromName?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPassword?: string;
  smtpProtocol?: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

interface Customer {
  id: string;
  company_name: string;
  email: string;
  monitored_products: Array<{ product_name: string; vendor_name: string }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting NVD sync...');

    // Get NVD API key from request body
    const { nvdApiKey, emailSettings, emailTemplate } = await req.json();
    
    if (!nvdApiKey) {
      throw new Error('NVD API key is required');
    }

    // Fetch recent vulnerabilities from NVD API with correct date format
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Format date as YYYY-MM-DDTHH:MM:SS.sss (ISO format without timezone)
    const startDate = thirtyDaysAgo.toISOString();
    
    const nvdUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0/?pubStartDate=${startDate}&resultsPerPage=100`;
    
    console.log('Fetching from NVD:', nvdUrl);
    
    const nvdResponse = await fetch(nvdUrl, {
      headers: {
        'apiKey': nvdApiKey,
        'Accept': 'application/json',
        'User-Agent': 'CVEAdvisor/1.0'
      }
    });

    if (!nvdResponse.ok) {
      const errorText = await nvdResponse.text();
      console.error('NVD API Response:', errorText);
      throw new Error(`NVD API error: ${nvdResponse.status} ${nvdResponse.statusText} - ${errorText}`);
    }

    const nvdData = await nvdResponse.json();
    console.log(`Fetched ${nvdData.vulnerabilities?.length || 0} vulnerabilities from NVD`);

    let processedCount = 0;
    const newVulnerabilities: ProcessedVulnerability[] = [];

    // Process each vulnerability
    for (const vuln of nvdData.vulnerabilities || []) {
      try {
        const cveId = vuln.cve.id;
        const description = vuln.cve.descriptions?.find(d => d.lang === 'en')?.value || '';
        
        // Get CVSS score and severity
        let cvssScore = null;
        let severity = 'Unknown';
        
        const metrics = vuln.cve.metrics;
        if (metrics?.cvssMetricV31?.[0]) {
          cvssScore = metrics.cvssMetricV31[0].cvssData.baseScore;
          severity = metrics.cvssMetricV31[0].cvssData.baseSeverity;
        } else if (metrics?.cvssMetricV2?.[0]) {
          cvssScore = metrics.cvssMetricV2[0].cvssData.baseScore;
          severity = metrics.cvssMetricV2[0].cvssData.baseSeverity;
        }

        // Extract vendor and product from CPE if available
        let vendor = 'Unknown';
        let product = 'Unknown';
        
        const cpeMatch = vuln.cve.configurations?.[0]?.nodes?.[0]?.cpeMatch?.[0];
        if (cpeMatch?.criteria) {
          const cpeParts = cpeMatch.criteria.split(':');
          if (cpeParts.length > 4) {
            vendor = cpeParts[3] || 'Unknown';
            product = cpeParts[4] || 'Unknown';
          }
        }

        // Check if vulnerability already exists
        const { data: existing } = await supabase
          .from('vulnerabilities')
          .select('id')
          .eq('cve_id', cveId)
          .single();

        if (!existing) {
          // Insert new vulnerability
          const { error: insertError } = await supabase
            .from('vulnerabilities')
            .insert({
              cve_id: cveId,
              description: description.substring(0, 1000), // Truncate long descriptions
              severity: severity,
              cvss_score: cvssScore,
              vendor: vendor,
              product: product,
              published_date: vuln.cve.published?.split('T')[0],
              last_modified: vuln.cve.lastModified?.split('T')[0]
            });

          if (insertError) {
            console.error(`Error inserting ${cveId}:`, insertError);
          } else {
            newVulnerabilities.push({ cveId, vendor, product, severity, cvssScore, description });
            processedCount++;
            console.log(`Added new vulnerability: ${cveId}`);
          }
        }
      } catch (error) {
        console.error('Error processing vulnerability:', error);
      }
    }

    console.log(`Processed ${processedCount} new vulnerabilities`);

    // Send email notifications for new critical/high vulnerabilities
    if (newVulnerabilities.length > 0 && emailSettings) {
      await sendEmailNotifications(supabase, newVulnerabilities, emailSettings, emailTemplate);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: processedCount,
      newVulnerabilities: newVulnerabilities.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('NVD sync error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendEmailNotifications(
  supabase: SupabaseClient,
  vulnerabilities: ProcessedVulnerability[],
  emailSettings: EmailSettings,
  emailTemplate: EmailTemplate,
) {
  try {
    console.log('Starting email notifications...');
    
    // Get customers with monitored products
    const { data: customers } = await supabase
      .from('customers')
      .select(`
        id,
        company_name,
        email,
        monitored_products (
          product_name,
          vendor_name
        )
      `);

    console.log(`Found ${customers?.length || 0} customers`);

    for (const customer of customers || []) {
      const relevantVulns = vulnerabilities.filter(vuln =>
        customer.monitored_products.some(product =>
          vuln.product.toLowerCase().includes(product.product_name.toLowerCase()) ||
          vuln.vendor.toLowerCase().includes(product.vendor_name.toLowerCase())
        )
      );

      if (relevantVulns.length > 0) {
        console.log(`Found ${relevantVulns.length} relevant vulnerabilities for ${customer.email}`);
        
        for (const vuln of relevantVulns) {
          // Check if we already sent notification for this vulnerability to this customer
          const { data: existingNotification } = await supabase
            .from('vulnerability_notifications')
            .select('id')
            .eq('customer_id', customer.id)
            .eq('vulnerability_id', vuln.cveId)
            .single();

          if (!existingNotification) {
            await sendEmail(customer, vuln, emailSettings, emailTemplate);
            
            // Record that we sent the notification
            await supabase
              .from('vulnerability_notifications')
              .insert({
                customer_id: customer.id,
                vulnerability_id: vuln.cveId
              });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending email notifications:', error);
  }
}

async function sendEmail(
  customer: Customer,
  vulnerability: ProcessedVulnerability,
  emailSettings: EmailSettings,
  emailTemplate: EmailTemplate,
) {
  try {
    console.log(`Attempting to send email to ${customer.email} for ${vulnerability.cveId}`);
    
    // Replace template variables
    const subject = emailTemplate.subject
      .replace('$CUSTOMER', customer.company_name)
      .replace('$PRODUCT', vulnerability.product)
      .replace('$CVE_ID', vulnerability.cveId);

    const body = emailTemplate.body
      .replace('$CUSTOMER', customer.company_name)
      .replace('$PRODUCT', vulnerability.product)
      .replace('$CVE_ID', vulnerability.cveId)
      .replace('$SEVERITY', vulnerability.severity)
      .replace('$DESCRIPTION', vulnerability.description)
      .replace('$CVSS_SCORE', vulnerability.cvssScore?.toString() || 'N/A');

    if (emailSettings.authMethod === 'smtp') {
      // Use SMTP to send email
      console.log('Sending SMTP email...');
      
      const emailPayload = {
        to: customer.email,
        from: emailSettings.fromEmail || 'alerts@cveadvisor.com',
        fromName: emailSettings.fromName || 'CVEAdvisor',
        subject: subject,
        html: body.replace(/\n/g, '<br>'),
        smtpHost: emailSettings.smtpHost,
        smtpPort: parseInt(emailSettings.smtpPort) || 587,
        smtpUser: emailSettings.smtpUser,
        smtpPassword: emailSettings.smtpPassword,
        smtpProtocol: emailSettings.smtpProtocol || 'TLS'
      };

      // Call the send-email edge function
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailPayload
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        throw emailError;
      }

      console.log('Email sent successfully:', emailResult);
    } else {
      // OAuth2 method - for now just log (would need proper OAuth implementation)
      console.log(`Would send OAuth email to ${customer.email}: ${subject}`);
    }

  } catch (error) {
    console.error('Error sending individual email:', error);
    throw error;
  }
}
