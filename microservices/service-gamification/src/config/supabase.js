const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) console.error('[supabase] SUPABASE_SERVICE_ROLE_KEY is not set');

module.exports = createClient(supabaseUrl, supabaseKey);
