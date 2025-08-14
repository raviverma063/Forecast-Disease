'use server';

import {
  travelInsights,
  type TravelInsightsInput,
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

export async function getTravelInsights(input: TravelInsightsInput) {
  return await travelInsights(input);
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
