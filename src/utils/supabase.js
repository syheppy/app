import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wiwigmrdddykgfawphtm.supabase.co'
const supabaseAnonKey = 'sb_publishable_UEQ6GVeznIvZOneFgcYBlQ_sPwSstLh'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
