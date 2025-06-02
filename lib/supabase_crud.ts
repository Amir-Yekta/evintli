import { PrismaClient } from '@prisma/client';
import { supabase } from './supabase';

const prisma = new PrismaClient();

export async function createProfile(userId: string, fullName: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{ id: userId, full_name: fullName }]);
  if (error) throw error;
  return data;
}
