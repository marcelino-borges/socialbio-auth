import { Schema, model } from "mongoose";

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IKeycloakUser {
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  username: string;
  credentials: IKeycloakCredential[];
  realmRoles?: string[];
  clientRoles?: Map<string, string>;
}

export interface IKeycloakCredential {
  type: string;
  secretData: string;
  value: string;
  credentialData: string;
}

export enum KeycloakRoles {
  USER = "user",
  ADMIN = "admin",
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  agreePrivacy: boolean;
  receiveCommunications: boolean;
}

const authSchema = new Schema<IUserCredentials>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Roles",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IUserCredentials>("Credentials", authSchema);
