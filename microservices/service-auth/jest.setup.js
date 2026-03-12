// jest.setup.js
// Charge les variables d'environnement avant tous les tests
require('dotenv').config();

// Variables de fallback pour les tests si .env absent
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-key-for-ci';
process.env.NODE_ENV = 'test';