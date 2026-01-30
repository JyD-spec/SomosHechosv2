import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tztymszjnbcqemrevkfv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dHltc3pqbmJjcWVtcmV2a2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjQwOTIsImV4cCI6MjA4NDEwMDA5Mn0.br0EDFW9D68ck87EAiGvIju5ZXVUwRtjQn93tv-G2IM'

export const supabase = createClient(supabaseUrl, supabaseKey)