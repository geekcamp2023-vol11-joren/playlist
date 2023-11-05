export type TMovieItem = {
  type: SupportedSites
  url: string;
  metadata: {
    title: string;
    channel: string;
    thumbnail: string;
  };
};

export type SupportedSites = "youtube"|"nicovideo";