import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Cache authenticated user to avoid repeated API calls
let cachedUser: User | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCurrentUser(useCache: boolean = true) {
  const now = Date.now();
  
  // Return cached user if valid and within cache duration
  if (useCache && cachedUser && now < cacheExpiry) {
    return { user: cachedUser, error: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!error && user) {
    cachedUser = user;
    cacheExpiry = now + CACHE_DURATION;
  }

  return { user, error };
}

// Clear user cache (call on logout)
export function clearUserCache() {
  cachedUser = null;
  cacheExpiry = 0;
}

// Check if user is authenticated without making API call if cached
export function isUserAuthenticated(): boolean {
  const now = Date.now();
  return cachedUser && now < cacheExpiry;
}

// Get user ID quickly (from cache if available)
export async function getUserId(): Promise<string | null> {
  const { user } = await getCurrentUser();
  return user?.id || null;
}