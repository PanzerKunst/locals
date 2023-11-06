import { SpotifyExternalUrls } from "./SpotifyExternalUrls.ts"
import { SpotifyFollowers } from "./SpotifyFollowers.ts"
import { SpotifyMedia } from "./SpotifyMedia.ts"

export type SpotifyArtist = {
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyMedia[];
  name: string;
  popularity: number;
  uri: string;
}
