import axios, { AxiosResponse } from "axios";
import { AppErrorsMessages } from "../constants";
import { log } from "../utils/utils";

export const doesUserExist = async (email: string) => {
  const endpoint = process.env.REGISTER_ENDPOINT;

  if (!endpoint) return true;

  const registerApi = axios.create({
    baseURL: endpoint,
  });

  return registerApi
    .get(`/user/exists?email=${email}`)
    .then((res: AxiosResponse) => res.data as boolean)
    .catch((e: AxiosResponse) => {
      log(
        "[RegisterService:doesUserExist]: ",
        "ERROR: Verifying if user exists in Registration.",
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
        AppErrorsMessages.FAIL_AUTH_AND_REGISTER,
        e
      );
      return false;
    });
};
