export interface UserAuthRequest {
  consumer_key?: string;
  redirect_uri: string;
  state?: string;
}

export interface UserAuthResponse {
  code: string;
}

export interface UserAccessTokenResponse {
  username: string;
  access_token: string;
}

export interface PocketItemAdd {
  ref_id?: string;
  tags?: string;
  time?: string;
  title?: string;
  url?: string;
  action: string;
}

export interface PocketSendResponse {
  action_results: boolean[];
  status: number;
}
