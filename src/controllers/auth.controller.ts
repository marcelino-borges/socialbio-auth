import { Request, Response } from "express";
import * as userService from "../services/player.service";
import { IUserCredentials } from "./../models/auth.models";
import AppError from "./../errors/app-error";
import { AppErrorsMessages } from "../constants";
import { Roles } from "../models/role.models";
import bcrypt from "bcryptjs";

export const signIn = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Signs the user in by credentials'
    #swagger.description  = 'Signs the user in by credentials'
    #swagger.parameters['email'] = {
      in: 'body',
      description: 'User email',
      required: true,
      type: 'object'
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'object'
    } 
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Token" }
      description: 'User tokens'
    }
    #swagger.responses[400] = {
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      description: 'Message of error'
    }
  */
  return userService.getPlayer(req, res);
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
      type: 'object'
    }
    #swagger.parameters['password'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'object'
    }
    #swagger.parameters['confirmPassword'] = {
      in: 'body',
      description: 'User password',
      required: true,
      type: 'object'
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Token" }
      description: 'User tokens'
    }
    #swagger.responses[400] = {
      description: 'Message of error'
    }
    #swagger.responses[500] = {
      description: 'Message of error'
    }
  */

  const { email, password, confirmPassword } = req.body;

  if (!email || email.length < 1) {
    return res
      .status(400)
      .json(new AppError(AppErrorsMessages.EMAIL_REQUIRED, 400));
  }

  if (
    !password ||
    email.length < 1 ||
    !confirmPassword ||
    confirmPassword.length < 1
  ) {
    return res
      .status(400)
      .json(new AppError(AppErrorsMessages.PASSWORDS_REQUIRED, 400));
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new AppError(AppErrorsMessages.PASSWORDS_NOT_MATCH, 400));
  }

  const user: IUserCredentials = {
    email,
    password: bcrypt.hashSync(password, 8),
    roles: [Roles.USER],
  };

  return userService.getPlayer(req, res);
};
