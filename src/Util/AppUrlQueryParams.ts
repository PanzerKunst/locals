// TODO: move to session storage

type AppUrlQueryParam = {
  readonly ACTION: string;
  readonly SPOTIFY_CALLBACK_ERROR: string;
}

export const appUrlQueryParam: AppUrlQueryParam = {
  ACTION: "action",
  SPOTIFY_CALLBACK_ERROR: "spotify_callback_error"
}

type ActionsFromAppUrl = {
  readonly SIGN_OUT: string;
  readonly REGISTRATION_SUCCESS: string;
}

export const actionsFromAppUrl: ActionsFromAppUrl = {
  SIGN_OUT: "sign_out",
  REGISTRATION_SUCCESS: "registration_success"
}
