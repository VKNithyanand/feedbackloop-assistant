
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vzvdipkijnrakicrrynk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dmRpcGtpam5yYWtpY3JyeW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzA0NjIsImV4cCI6MjA1NTYwNjQ2Mn0.vHWW_wMHCWRqQ9PpA5X_-Q5SULF_BDRDQ5DLddsRtqg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
