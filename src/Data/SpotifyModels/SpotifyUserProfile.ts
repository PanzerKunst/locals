import { SpotifyExternalUrls } from "./SpotifyExternalUrls.ts"
import { SpotifyFollowers } from "./SpotifyFollowers.ts"
import { SpotifyMedia } from "./SpotifyMedia.ts"

export type SpotifyUserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content?: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: SpotifyMedia[];
  product: string;
  type: string;
  uri: string;
}
