import { config } from 'dotenv';
config();

import '@/ai/flows/travel-insights.ts';
import '@/ai/flows/interactive-data-insights.ts';
import '@/ai/flows/risk-factor-summary.ts';
import '@/ai/flows/preventative-measures.ts';
import '@/app/services/location-service.ts';
