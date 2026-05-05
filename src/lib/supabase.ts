/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Lazy initialization to prevent app crash if keys are missing
export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Check your environment variables.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};
