/**
 * Supabase Configuration
 * Replace these values with your actual Supabase project credentials
 * Get them from: https://app.supabase.com/project/Business-Website/settings/api
 */

const browserEnv = typeof process !== 'undefined' && process?.env ? process.env : {};
const SUPABASE_URL = browserEnv.VITE_SUPABASE_URL || browserEnv.SUPABASE_URL || 'https://ewaoxjcuzoxgurywyexy.supabase.co';
const SUPABASE_ANON_KEY = browserEnv.VITE_SUPABASE_ANON_KEY || browserEnv.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YW94amN1em94Z3VyeXd5ZXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzg1MzAsImV4cCI6MjEwMTg1NDUzMH0.uKEfw9tnbBlfXBuzYjqqMK_xo0hVNFwZwJkGTORUw3w';

// Initialize Supabase client (CDN import)
// Add this to your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

async function initSupabase() {
  if (typeof window === 'undefined') return null;
  
  if (!window.supabase) {
    console.error('Supabase client not loaded. Add to HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  
  return supabaseClient;
}

function getSupabase() {
  return supabaseClient;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSupabase, getSupabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
