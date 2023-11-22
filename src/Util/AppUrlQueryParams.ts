type AppUrlQueryParam = {
  readonly ACTION: string;
  readonly SPOTIFY_CALLBACK_ERROR: string;
  readonly SPOTIFY_PROFILE: string;
  readonly SPOTIFY_PROFILE_ERROR: string;
}

export const appUrlQueryParam: AppUrlQueryParam = {
  ACTION: "action",
  SPOTIFY_CALLBACK_ERROR: "spotify_callback_error",
  SPOTIFY_PROFILE: "spotify_profile",
  SPOTIFY_PROFILE_ERROR: "spotify_profile_error"
}

type ActionsFromAppUrl = {
  readonly SIGN_OUT: string;
}

export const actionsFromAppUrl: ActionsFromAppUrl = {
  SIGN_OUT: "sign_out"
}
