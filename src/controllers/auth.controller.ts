import { Request, Response } from "express";
import * as userService from "../services/keycloak.service";
import { IAuthTokens, IKeycloakUser, IUser } from "./../models/auth.models";
import AppResult from "../errors/app-result";
import { AppErrorsMessages } from "../constants";
import { createUser, doesUserExist } from "../services/register.service";
import { log } from "../utils/utils";
import { deleteKeycloakUser } from "../services/keycloak.service";
import { AxiosResponse } from "axios";

export const signIn = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Signs the user in by credentials'
    #swagger.description  = 'Signs the user in by credentials'
    #swagger.parameters['credentials'] = {
      in: 'body',
      description: 'User email',
      required: true,
      schema: { $ref: "#/definitions/Credentials" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Token" },
      description: 'User tokens'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
  */
  const { email, password } = req.body;

  if (!email || email.length < 1 || !password || password.length < 1) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.INVALID_CREDENTIALS));
  }
  const response = await userService.getToken(email, password);

  if (response?.data) {
    const tokens: IAuthTokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };
    return res.status(200).json(tokens);
  }
  return res.status(400).json(new AppResult(AppErrorsMessages.FAIL_GET_TOKEN));
};

export const signOut = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Signs the user out'
    #swagger.description  = 'Signs the user out, ending his token'
    #swagger.parameters['refreshToken'] = {
      in: 'body',
      description: 'User refreshToken',
      required: true,
      type: 'string'
    }
    #swagger.responses[204] = {
      description: 'Successfully signed out'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
  */
  const { refreshToken } = req.body;

  if (!refreshToken || refreshToken.length < 1) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.INVALID_REFRESH_TOKEN));
  }
  const result = await userService.signOut(refreshToken);

  return res.status(result.statusCode).json(result);
};

export const signUp = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Signs the user up'
    #swagger.description  = 'Creates user access in database'
    #swagger.parameters['NewUser'] = {
      in: 'body',
      description: 'New user data',
      required: true,
      schema: { $ref: "#/definitions/NewUser" },
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Result of the request'
    }
    #swagger.responses[400] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Message of error'
    }
  */

  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    profileImageUrl,
    agreePrivacy,
    receiveCommunications,
  } = req.body;

  if (!email || email.length < 1) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.EMAIL_REQUIRED));
  }

  if (
    !password ||
    email.length < 1 ||
    !confirmPassword ||
    confirmPassword.length < 1
  ) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PASSWORDS_REQUIRED));
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.PASSWORDS_NOT_MATCH));
  }

  const userExist = await doesUserExist(email);

  if (userExist) {
    return res
      .status(400)
      .json(new AppResult(AppErrorsMessages.USER_ALREADY_EXISTS));
  }

  const keycloakUser: IKeycloakUser = {
    firstName,
    lastName,
    email,
    username: email,
    enabled: true,
    credentials: [
      {
        type: "password",
        secretData: password,
        value: password,
        credentialData: password,
      },
    ],
  };

  const result: AppResult = await userService.signUp(keycloakUser);

  if (!result.isError()) {
    const newUser: IUser = {
      firstName,
      lastName,
      email,
      profileImageUrl,
      agreePrivacy,
      receiveCommunications,
    };

    const tokenResponse: AxiosResponse | null = await userService.getToken(
      email,
      password
    );

    if (!tokenResponse?.data) {
      await deleteKeycloakUser(email);
      return res
        .status(500)
        .json(new AppResult(AppErrorsMessages.INTERNAL_ERROR, null, 500));
    }

    const isUserCreated: boolean = await createUser(
      newUser,
      tokenResponse.data.access_token
    );

    if (!isUserCreated) {
      log(
        "[AuthController:signUp]: " + AppErrorsMessages.FAIL_AUTH_AND_REGISTER
      );
      await deleteKeycloakUser(email);

      return res
        .status(500)
        .json(
          new AppResult(AppErrorsMessages.FAIL_AUTH_AND_REGISTER, null, 500)
        );
    }
  }
  return res.status(result.statusCode).json(result);
};
