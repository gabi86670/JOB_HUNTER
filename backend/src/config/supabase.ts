import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET_KEY } from '@/config/env.js';

// A server-side Supabase client (used by both the middleware and, later, storage)
// wraps Supabase's REST, Auth, and Storage APIs behind convenient JS method calls, 
// so you're not hand-writing raw HTTP requests with headers, retries, and error
//  parsing yourself every time you need to talk to Supabase.

// only one instance of it cause its just config + connection info so no need to recreate it

export const supabaseClient = new createClient({
    env.SUPABASE_URL, env.SUPABASE_SECRET_KEY
});