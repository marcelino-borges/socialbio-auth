import AppResult from "../errors/app-result";
import { log } from "../utils/utils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { keycloakConfig } from "../config/keycloak";
import { AppErrorsMessages, AppSuccessMessages } from "../constants";
import { IKeycloakUser } from "../models/auth.models";

export const getToken = async (email: string, password: string) => {
  try {
    const keycloakApi = axios.create({
      baseURL: `${keycloakConfig.user.authServerUrl}/realms/${keycloakConfig.user.realm}/protocol/openid-connect/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("client_id", keycloakConfig.user.clientId);
    data.append("client_secret", keycloakConfig.user.secret);
    data.append("username", email);
    data.append("password", password);

    return await keycloakApi.post("/", data);
  } catch (error: any) {
    log("[getToken] EXCEPTION: ", error);
    return null;
  }
};

export const signOut = async (refreshToken: string) => {
  try {
    const keycloakApi = axios.create({
      baseURL: `${keycloakConfig.user.authServerUrl}/realms/${keycloakConfig.user.realm}/protocol/openid-connect/logout`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = new URLSearchParams();
    data.append("client_id", keycloakConfig.user.clientId);
    data.append("client_secret", keycloakConfig.user.secret);
    data.append("refresh_token", refreshToken);

    return await keycloakApi
      .post("/", data)
      .then((response: AxiosResponse) => {
        if (response.status === 204) {
          return new AppResult(AppSuccessMessages.KEYCLOAK_REGISTER, null, 204);
        }
        return new AppResult(AppErrorsMessages.SIGNOUT);
      })
      .catch((e: any) => {
        log("[signOut] EXCEPTION keycloakApi.post: ", e);
        return new AppResult(AppErrorsMessages.SIGNOUT, e.message, 500);
      });
  } catch (e: any) {
    log("[signOut] EXCEPTION: ", e.message);
    return new AppResult(AppErrorsMessages.SIGNOUT, e.message, 500);
  }
};

const getMasterAdminToken = async () => {
  const keycloakApi = axios.create({
    baseURL: `${keycloakConfig.masterAdmin.authServerUrl}/realms/${keycloakConfig.masterAdmin.realm}/protocol/openid-connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = new URLSearchParams();
  data.append("grant_type", "password");
  data.append("client_id", keycloakConfig.masterAdmin.clientId);
  data.append("client_secret", keycloakConfig.masterAdmin.secret);
  data.append("username", keycloakConfig.masterAdmin.username);
  data.append("password", keycloakConfig.masterAdmin.password);

  const resultData: AxiosResponse = await keycloakApi.post("/", data);
  return resultData;
};

export const signUp = async (keycloakUser: IKeycloakUser) => {
  try {
    const response: AxiosResponse | null = await getMasterAdminToken();

    if (!response || !response.data || response.status !== 200) {
      return new AppResult(
        AppErrorsMessages.ERROR_SIGNUP,
        response?.data.errorMessage,
        response?.status || 500
      );
    }

    const keycloakApi = axios.create({
      baseURL: `${keycloakConfig.user.authServerUrl}/admin/realms/${keycloakConfig.user.realm}/users`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + response.data["access_token"],
      },
    });

    return await keycloakApi
      .post("/", keycloakUser)
      .then((response: AxiosResponse) => {
        if (response.status === 201) {
          return new AppResult(AppSuccessMessages.KEYCLOAK_REGISTER, null, 201);
        }
        return new AppResult(AppErrorsMessages.ERROR_SIGNUP);
      })
      .catch((e: AxiosError) => {
        log("[signUp] EXCEPTION keycloakApi.post: ", e);
        return new AppResult(
          AppErrorsMessages.ERROR_SIGNUP,
          e.response?.data.errorMessage || null,
          400
        );
      });
  } catch (e: any) {
    log("[signUp] EXCEPTION: ", e.message);
    return new AppResult(AppErrorsMessages.ERROR_SIGNUP, e.message, 500);
  }
};
