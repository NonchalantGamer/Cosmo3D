// supabase-config.js
// Load Supabase JS Client via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Replace these placeholders with the values from Supabase Settings -> API
const SUPABASE_URL = 'https://ewaoxjcuzoxgurywyexy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YW94amN1em94Z3VyeXd5ZXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzg1MzAsImV4cCI6MjEwMTg1NDUzMH0.uKEfw9tnbBlfXBuzYjqqMK_xo0hVNFwZwJkGTORUw3w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);