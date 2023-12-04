type AppUrlQueryParam = {
  readonly SPOTIFY_CALLBACK_CODE: string;
  readonly SPOTIFY_CALLBACK_ERROR: string;
  readonly ACTION: string;
}

export const appUrlQueryParam: AppUrlQueryParam = {
  SPOTIFY_CALLBACK_CODE: "code",
  SPOTIFY_CALLBACK_ERROR: "error",
  ACTION: "action"
}

type ActionsFromAppUrl = {
  readonly SIGN_OUT: string;
  readonly REGISTRATION_SUCCESS: string;
  readonly PUBLICATION_SUCCESS: string;
}

export const actionsFromAppUrl: ActionsFromAppUrl = {
  SIGN_OUT: "sign_out",
  REGISTRATION_SUCCESS: "registration_success",
  PUBLICATION_SUCCESS: "publication_success"
}
