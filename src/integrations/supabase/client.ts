// Modified to work with MongoDB authentication
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

const originalClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Create a proxy to intercept auth calls and use MongoDB auth instead
const createFakeSession = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Create a fake session that looks like Supabase session
  return {
    access_token: token,
    refresh_token: token,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'mongodb-user',
      email: 'user@mongodb.com',
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated'
    }
  };
};

export const supabase = new Proxy(originalClient, {
  get(target, prop) {
    if (prop === 'auth') {
      return {
        getSession: async () => {
          const session = createFakeSession();
          return { data: { session }, error: null };
        },
        onAuthStateChange: (callback: any) => {
          // Return a fake subscription
          return {
            data: {
              subscription: {
                unsubscribe: () => {}
              }
            }
          };
        },
        signOut: async () => {
          localStorage.removeItem('token');
          return { error: null };
        },
        signInWithPassword: async () => ({ data: null, error: new Error('Use MongoDB auth') }),
        signUp: async () => ({ data: null, error: new Error('Use MongoDB auth') })
      };
    }
    return target[prop as keyof typeof target];
  }
});