export type TMovieItem = {
  url: string;
  metadata: {
    title: string;
    channel: {
      id: string;
      name: string;
    };
  };
};