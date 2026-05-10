const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Service role key bypasses RLS — correct for server-side microservices.
// Auth is enforced at the application layer (gateway JWT + roles middleware).
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('[supabase] SUPABASE_SERVICE_ROLE_KEY is not set — DB writes will be blocked by RLS');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;