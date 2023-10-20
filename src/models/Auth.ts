export interface TokensResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserInfo {
  sub: string;
  name: string;
  email: string;
  email_verified: "true" | "false";
  phone_number_verified: "true" | "false";
}
