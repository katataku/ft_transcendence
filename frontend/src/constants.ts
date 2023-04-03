export const BaseURL: string = process.env
  .REACT_APP_BACKEND_HTTP_BASE_URL as string

export const chatListKickAlertLocalStorageKey: string =
  'ft_trans_chat_list_kick_alert'

export const localStorageKey: string = 'ft_trans_user'

export const initUser: User = { id: 0, name: '' }
