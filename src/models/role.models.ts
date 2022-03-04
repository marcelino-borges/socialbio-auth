import { Schema, model } from "mongoose";

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IRole {
  name: string;
}

export enum Roles {
  USER = "user",
  ADMIN = "admin",
}

const authSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: false,
  }
);

export default model<IRole>("Roles", authSchema);
