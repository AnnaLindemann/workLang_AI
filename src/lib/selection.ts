// Presentation metadata and URL-slug conversion for the language and
// career-track pickers in the Phase 3 lesson UI.
//
// This is framework-agnostic data: it maps the domain enums (Language,
// CareerTrack) to human labels, short descriptions, and URL-safe slugs used by
// the `/learn` routes. It is navigation chrome, not lesson content (which lives
// in src/data), and it holds no user data.

import { CareerTrack, Language } from "@/types";

export interface LanguageMeta {
  value: Language;
  slug: string;
  label: string;
  /** How this language's target level reads (German → C1, English → B2). */
  targetLabel: string;
  tagline: string;
}

export interface TrackMeta {
  value: CareerTrack;
  slug: string;
  label: string;
  description: string;
}

export const languageCatalog: readonly LanguageMeta[] = [
  {
    value: Language.German,
    slug: "german",
    label: "German",
    targetLabel: "towards C1",
    tagline: "Professional German for real work contexts.",
  },
  {
    value: Language.English,
    slug: "english",
    label: "English",
    targetLabel: "towards B2",
    tagline: "Professional English for real work contexts.",
  },
];

export const trackCatalog: readonly TrackMeta[] = [
  {
    value: CareerTrack.AiConsultant,
    slug: "ai-consultant",
    label: "AI Consultant",
    description:
      "Professional vocabulary, business writing, and reading for AI advisory work.",
  },
  {
    value: CareerTrack.CustomerSuccessHospitality,
    slug: "customer-success",
    label: "Customer Success / Hospitality",
    description:
      "Written communication and professional language for client-facing " +
      "roles with an AI component.",
  },
];

/** Resolve a URL slug to its language metadata, or `undefined` if unknown. */
export function languageBySlug(slug: string): LanguageMeta | undefined {
  return languageCatalog.find((entry) => entry.slug === slug);
}

/** Resolve a URL slug to its career-track metadata, or `undefined` if unknown. */
export function trackBySlug(slug: string): TrackMeta | undefined {
  return trackCatalog.find((entry) => entry.slug === slug);
}

/** Look up the metadata for a `Language` enum value. */
export function languageMeta(value: Language): LanguageMeta {
  const entry = languageCatalog.find((item) => item.value === value);
  if (!entry) {
    throw new Error(`No language metadata for "${value}"`);
  }
  return entry;
}

/** Look up the metadata for a `CareerTrack` enum value. */
export function trackMeta(value: CareerTrack): TrackMeta {
  const entry = trackCatalog.find((item) => item.value === value);
  if (!entry) {
    throw new Error(`No career-track metadata for "${value}"`);
  }
  return entry;
}
