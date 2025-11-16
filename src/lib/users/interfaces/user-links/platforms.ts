export const PLATFORM_BASE_URLS = {
  website: "https://",
  spotify: "https://open.spotify.com/",
  soundcloud: "https://soundcloud.com/",
  applemusic: "https://music.apple.com/",
  twitter: "https://twitter.com/",
  lastfm: "https://www.last.fm/user/",
} as const;

export type Platforms = keyof typeof PLATFORM_BASE_URLS;

export const PLATFORMS = Object.keys(PLATFORM_BASE_URLS) as Platforms[];

export type PlatformLink = {
  platform: Platforms;
  url: `${(typeof PLATFORM_BASE_URLS)[Platforms]}${string}`;
};
