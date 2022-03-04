import { Request, Response } from "express";
import AppError from "../errors/app-error";
import { log } from "../utils/utils";

export const getPlayer = async (req: Request, res: Response) => {
  try {
  } catch (e: any) {
    log("[getPlayer] ERROR: ", e.message);
  }
};
