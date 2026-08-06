const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jrmccglcjhokyyzhckce.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybWNjZ2xjamhva3l5emhja2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTY1OTQsImV4cCI6MjEwMTQ3MjU5NH0.Sjxl1CU2xQ6ngh6wE_QHa0OVciavfcIZ4bypkOcaW58';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase Cloud Database Connected:', SUPABASE_URL);

module.exports = supabase;
