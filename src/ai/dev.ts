import { config } from 'dotenv';
config(); // This must be the first thing to run.

import '@/lib/firebase/admin'; // This will initialize firebase-admin
import '@/ai/flows/suggest-tags.ts';
