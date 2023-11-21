type AppUrlQueryParam = {
  ACTION: string;
  SPOTIFY_CALLBACK_ERROR: string;
  SPOTIFY_PROFILE: string;
  SPOTIFY_PROFILE_ERROR: string;
}

export const appUrlQueryParam: AppUrlQueryParam = {
  ACTION: "action",
  SPOTIFY_CALLBACK_ERROR: "spotify_callback_error",
  SPOTIFY_PROFILE: "spotify_profile",
  SPOTIFY_PROFILE_ERROR: "spotify_profile_error"
}

type ActionsFromAppUrl = {
  SIGN_OUT: string;
}

export const actionsFromAppUrl: ActionsFromAppUrl = {
  SIGN_OUT: "sign_out"
}
