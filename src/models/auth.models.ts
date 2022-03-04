import { Schema, model } from "mongoose";

export interface IUserCredentials {
  email: string;
  password: string;
  roles?: string[];
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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
