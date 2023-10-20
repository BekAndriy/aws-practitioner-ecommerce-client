import axios from "axios";
import API_PATHS from "~/constants/apiPaths";
import { TokensResponse, UserInfo } from "~/models/Auth";

const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

// Sign in with federate provider
// https://docs.aws.amazon.com/cognito/latest/developerguide/federation-endpoints.html
// export const getAuthorizeURL = () => {
//   return `${
//     API_PATHS.cognito
//   }/oauth2/authorize?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
//     location.origin,
//   )}%2Fsign-up`;
// };
export const getAuthorizeURL = () => {
  return `${
    API_PATHS.cognito
  }/login?response_type=code&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    location.origin,
  )}%2Fsign-up`;
};

export const getTokens = (code: string): Promise<TokensResponse> => {
  return fetch(
    `${
      API_PATHS.cognito
    }/oauth2/token?grant_type=authorization_code&client_id=${COGNITO_CLIENT_ID}&code=${code}&redirect_uri=${encodeURIComponent(
      location.origin,
    )}%2Fsign-up`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  ).then((res) => (res.status === 200 ? res.json() : Promise.reject()));
};

export const refreshToken = (
  token: string,
): Promise<Omit<TokensResponse, "refresh_token">> => {
  return fetch(
    `${API_PATHS.cognito}/oauth2/token?grant_type=refresh_token&client_id=${COGNITO_CLIENT_ID}&refresh_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  ).then((res) => res.json());
};

export const revokeToken = (token: string) => {
  return fetch(
    `${API_PATHS.cognito}/oauth2/revoke?client_id=${COGNITO_CLIENT_ID}&token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    },
  );
};

export const getUserInfo = (accessToken: string): Promise<UserInfo> => {
  return axios
    .get(`${API_PATHS.cognito}/oauth2/userInfo`, {
      headers: {
        Authorization: accessToken,
      },
    })
    .then((res) => res.data);
};
