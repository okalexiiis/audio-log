export const PLATFORMS = [
  "website",
  "spotify",
  "soundcloud",
  "apple music",
  "twitter",
  "last.fm",
] as const;
export type Platforms = (typeof PLATFORMS)[number];
