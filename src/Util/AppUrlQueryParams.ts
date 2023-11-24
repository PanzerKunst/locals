type AppUrlQueryParam = {
  readonly ACTION: string;
}

export const appUrlQueryParam: AppUrlQueryParam = {
  ACTION: "action",
}

type ActionsFromAppUrl = {
  readonly SIGN_OUT: string;
  readonly REGISTRATION_SUCCESS: string;
}

export const actionsFromAppUrl: ActionsFromAppUrl = {
  SIGN_OUT: "sign_out",
  REGISTRATION_SUCCESS: "registration_success"
}
