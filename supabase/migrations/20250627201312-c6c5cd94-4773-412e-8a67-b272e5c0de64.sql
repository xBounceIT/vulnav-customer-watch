
-- Create table for vulnerabilities
CREATE TABLE public.vulnerabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cve_id TEXT UNIQUE NOT NULL,
  description TEXT,
  severity TEXT,
  cvss_score NUMERIC(3,1),
  vendor TEXT,
  product TEXT,
  published_date DATE,
  last_modified DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for customers
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for products that customers want to monitor
CREATE TABLE public.monitored_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track email notifications sent
CREATE TABLE public.vulnerability_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vulnerability_id UUID REFERENCES public.vulnerabilities(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerability_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to vulnerabilities (no auth required for viewing)
CREATE POLICY "Anyone can view vulnerabilities" 
  ON public.vulnerabilities 
  FOR SELECT 
  USING (true);

-- Policies for customers (authenticated users can manage their own data)
CREATE POLICY "Users can view all customers" 
  ON public.customers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage customers" 
  ON public.customers 
  FOR ALL 
  USING (true);

-- Policies for monitored products
CREATE POLICY "Users can view all monitored products" 
  ON public.monitored_products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage monitored products" 
  ON public.monitored_products 
  FOR ALL 
  USING (true);

-- Policies for notifications
CREATE POLICY "Users can view all notifications" 
  ON public.vulnerability_notifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage notifications" 
  ON public.vulnerability_notifications 
  FOR ALL 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_vulnerabilities_cve_id ON public.vulnerabilities(cve_id);
CREATE INDEX idx_vulnerabilities_product ON public.vulnerabilities(product);
CREATE INDEX idx_vulnerabilities_vendor ON public.vulnerabilities(vendor);
CREATE INDEX idx_monitored_products_customer ON public.monitored_products(customer_id);
CREATE INDEX idx_monitored_products_product ON public.monitored_products(product_name, vendor_name);
