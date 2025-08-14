'use server';

import {
  travelInsights,
  type TripInput,
} from '@/ai/flows/travel-insights';
import {
  riskFactorSummary,
  type RiskFactorSummaryInput,
} from '@/ai/flows/risk-factor-summary';
import {
  interactiveDataInsights,
  type InteractiveDataInsightsInput,
} from '@/ai/flows/interactive-data-insights';
import {
  preventativeMeasures,
  type PreventativeMeasuresInput,
} from '@/ai/flows/preventative-measures';

// This is a mock implementation. In a real app, you'd fetch this data.
const MOCK_USER_PROFILE = {
    age: 30,
    sex: 'M' as const,
    conditions: ["none"],
    allergies: [],
    pregnant: false,
    vaccinations: ["JE", "COVID"],
    medications: []
};

const MOCK_LIVE_DATA = {
    disease: {
        to: { dengue_weekly_cases: 46, typhoid_cluster: true, flu_trend: "stable" },
        from: { dengue_weekly_cases: 12 }
    },
    weather: {
        to: { rain_mm_24h: 82, heat_index: 31, alerts: ["heavy_rain"] },
        route: { flood_prone_segments: ["NH28-Barabanki-km52-60"] }
    },
    aqi: { to: 88, from: 92, route_max: 110 },
    infrastructure: {
        hospitals_to: [
            { name: "KGMU Emergency", phone: "0522-225-8800", is_24x7: true, eta_min: 12 }
        ],
        pharmacies_to: [
            { name: "Apollo Pharmacy, Hazratganj", phone: "0522-233-4444", is_24x7: true }
        ],
        ambulance: "108"
    }
};


export async function getTravelInsights(input: TripInput) {
  return await travelInsights(input, MOCK_USER_PROFILE, MOCK_LIVE_DATA);
}

export async function getRiskFactorSummary(input: RiskFactorSummaryInput) {
  return await riskFactorSummary(input);
}

export async function getInteractiveDataInsights(
  input: InteractiveDataInsightsInput
) {
  return await interactiveDataInsights(input);
}

export async function getPreventativeMeasures(
  input: PreventativeMeasuresInput
) {
  return await preventativeMeasures(input);
}
