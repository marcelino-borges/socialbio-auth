import axios, { AxiosResponse } from "axios";
import AppResult from "../errors/app-result";
import { AppErrorsMessages } from "../constants";
import { IUser } from "../models/auth.models";
import { log } from "../utils/utils";

export const doesUserExist = async (email: string, token: string) => {
  const endpoint = process.env.REGISTER_ENDPOINT;

  if (!endpoint)
    return new AppResult(AppErrorsMessages.ERROR_SIGNUP, null, 500);

  const registerApi = axios.create({
    baseURL: endpoint,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return registerApi
    .get(`/user?email=${email}`)
    .then(() => true)
    .catch((e: AxiosResponse) => {
      log(
        "[RegisterService:doesUserExist]: ",
        "ERROR: Verifying if user exists in Registration. Token: " + token,
        e
      );
      return false;
    });
};

export const createUser = async (user: any, token: string) => {
  const endpoint = process.env.REGISTER_ENDPOINT;

  if (!endpoint) return false;

  const registerApi = axios.create({
    baseURL: endpoint,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return registerApi
    .post("/user", user)
    .then(() => true)
    .catch((e: AxiosResponse) => {
      log(
        "[RegisterService:createUser]: ",
        AppErrorsMessages.ERROR_DELETE_KEYCLOAK_USER,
        e
      );
      return false;
    });
};
