import { Request, Response } from "express";
import * as userService from "../services/keycloak.service";
import {
  IAuthTokens,
  IKeycloakUser,
  IUserCredentials,
} from "./../models/auth.models";
import AppResult from "../errors/app-result";
import { AppErrorsMessages, AppSuccessMessages } from "../constants";
import bcrypt from "bcryptjs";
import { log } from "../utils/utils";

export const signIn = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Signs the user in by credentials'
    #swagger.description  = 'Signs the user in by credentials'
    #swagger.parameters['email'] = {
      in: 'body',
      description: 'User email',
      required: true,
      type: 'string'
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'string'
    } 
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Token" },
      description: 'User tokens'
    }
    #swagger.responses[400] = {
      description: 'Message of error'
    }
    #swagger.responses[500] = {
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
      description: 'User email',
      required: true,
      type: 'object'
    }
    #swagger.responses[400] = {
      description: 'Message of error'
    }
    #swagger.responses[500] = {
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
    #swagger.parameters['email'] = {
      in: 'body',
      description: 'User email',
      required: true,
      type: 'string'
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'string'
    }
    #swagger.parameters['confirmPassword'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'string'
    }
    #swagger.parameters['firstName'] = {
      in: 'body',
      description: 'User first name',
      required: true,
      type: 'string'
    }
    #swagger.parameters['lastName'] = {
      in: 'body',
      description: 'User last name',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/AppResult" },
      description: 'Result of the request'
    }
    #swagger.responses[400] = {
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      description: 'Message of error'
    }
  */

  const { email, password, confirmPassword, firstName, lastName } = req.body;

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

  const result = await userService.signUp(keycloakUser);

  return res.status(result.statusCode).json(result);
};
