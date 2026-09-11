import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CivicReport {
  id?: string;
  ticket_id: string;
  category: string;
  description: string;
  location_address: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  status: 'Reported' | 'Verified' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  department: string;
  ai_confidence?: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
  return data as CivicReport[];
}

export async function fetchReportByTicket(ticketId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (error) {
    console.error('Error fetching report:', error);
    return null;
  }
  return data as CivicReport;
}

export async function createReport(report: Omit<CivicReport, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('reports')
    .insert([report])
    .select()
    .single();

  if (error) {
    console.error('Error creating report:', error);
    throw error;
  }
  return data as CivicReport;
}

export async function updateReport(id: string, updates: Partial<CivicReport>) {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating report:', error);
    throw error;
  }
  return data as CivicReport;
}

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('photos').getPublicUrl(filePath);
  return data.publicUrl;
}
