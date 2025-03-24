import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzqrktlcuvkdbaytfnuh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cXJrdGxjdXZrZGJheXRmbnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTI4MDksImV4cCI6MjA1ODE2ODgwOX0.n_VkNhhEBfhTejoyP3Z9lHY6IMlk4ZZDHBp5_nCqzs8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
