import { useEffect, useState } from "react";
import { UserInfo } from "~/models/Auth";
import * as authQueries from "~/queries/auth";
import { EventHandler } from "./eventHandler";

type EventCallback = (profile: UserInfo | null) => unknown;

const ACCESS_TOKEN_KEY = "AccessToken";
const ID_TOKEN_KEY = "IdToken";
const REFRESH_TOKEN_KEY = "RefreshToken";

export default class Auth {
  private static _instance: Auth;
  private _profile: UserInfo | null = null;
  private readonly _onProfileChanged: EventHandler<EventCallback>;

  private constructor() {
    this._onProfileChanged = new EventHandler();
  }

  // singleton
  static get instance() {
    if (!Auth._instance) {
      Auth._instance = new Auth();
    }
    return Auth._instance;
  }

  // on authorization
  async initUserByCode(code: string) {
    if (!code) return Promise.reject();

    const tokens = await this.getTokensByCode(code);
    const { accessToken, refreshToken, idToken } = tokens;
    this.setLocalStorageTokens(accessToken, idToken, refreshToken);
    this.profile = await this.loadUser();
  }

  // on load
  async init() {
    this.profile = await this.loadUser().catch((error) => {
      if (error.response?.status === 401) {
        return this.refreshAccessToken()
          .then(() => this.loadUser())
          .catch((err) => {
            this.cleanTokens();
            return Promise.reject(err);
          });
      }
      return Promise.reject(error);
    });
  }

  logout() {
    if (!this.refreshToken) return;
    return authQueries
      .revokeToken(this.refreshToken)
      .then(() => this.cleanTokens())
      .then(() => (this.profile = null));
  }

  onProfileChanged(callback: EventCallback) {
    return this._onProfileChanged.on(callback);
  }

  off(callback: EventCallback) {
    return this._onProfileChanged.off(callback);
  }

  get accessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  }

  get idToken() {
    return localStorage.getItem(ID_TOKEN_KEY) || "";
  }

  get profile() {
    return this._profile;
  }

  private get refreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
  }

  private set profile(profile: UserInfo | null) {
    this._profile = profile;
    this._onProfileChanged.invoke(this._profile);
  }

  private loadUser() {
    if (!this.accessToken) return Promise.reject();
    return authQueries.getUserInfo(this.accessToken);
  }

  private async getTokensByCode(code: string) {
    const tokens = await authQueries.getTokens(code);
    const { access_token, refresh_token, id_token } = tokens;
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token,
    };
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) return Promise.reject();
    const { access_token, id_token } = await authQueries.refreshToken(
      this.refreshToken,
    );
    this.setLocalStorageTokens(access_token, id_token);
  }

  private setLocalStorageTokens(
    accessToken: string,
    idToken: string,
    refreshToken?: string,
  ) {
    this.storeToken(ACCESS_TOKEN_KEY, `Bearer ${accessToken}`);
    this.storeToken(ID_TOKEN_KEY, `Bearer ${idToken}`);
    this.storeToken(REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeToken(key: string, value?: string) {
    if (typeof value !== "string") return;
    localStorage.setItem(key, value);
  }

  private cleanTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export const useProfile = () => {
  const [profile, setProfile] = useState<null | UserInfo>(
    Auth.instance.profile,
  );
  useEffect(() => {
    const handleProfileChanged = (data: UserInfo | null) => setProfile(data);
    Auth.instance.onProfileChanged(handleProfileChanged);
    return () => {
      Auth.instance.off(handleProfileChanged);
    };
  }, []);
  const isSignedIn = !!profile;

  return [isSignedIn, profile];
};
