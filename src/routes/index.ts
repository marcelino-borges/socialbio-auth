import * as express from "express";
import * as userController from "../controllers/auth.controller";

const router = express.Router();

router.get("/signin", userController.signIn);
router.get("/signup", userController.signUp);

export default router;
