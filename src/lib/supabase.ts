import { createClient } from '@supabase/supabase-js';
import type { TaskKey } from './schedule';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  realtime: { params: { eventsPerSecond: 5 } },
});

export type DayRow = {
  d: string;
  math: boolean;
  rowing: boolean;
  genealogy: boolean;
  ai_course: boolean;
  reading: boolean;
  walk: boolean;
  meals: boolean;
  phone_ok: boolean;
  comment: string;
  updated_at: string;
};

export type TaskColumn = Extract<TaskKey,
  'math' | 'rowing' | 'genealogy' | 'ai_course' | 'reading' | 'walk' | 'meals' | 'phone_ok'>;
