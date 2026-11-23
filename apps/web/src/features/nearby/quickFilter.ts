export type QuickFilterKey = "tribes" | "lookingFor";

export type QuickFilter = { key: QuickFilterKey; value: string };

export type NearbyNavigationState = { quickFilter: QuickFilter } | { nearbyEntry: string } | null;

export const QUICK_FILTER_LABEL: Record<QuickFilterKey, (value: string) => string> = {
  tribes: (tribe) => `Ver gente de la tribu ${tribe}`,
  lookingFor: (lookingFor) => `Ver gente que busca ${lookingFor}`,
};
