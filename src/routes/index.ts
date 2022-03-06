import * as express from "express";
import * as userController from "../controllers/auth.controller";

const router = express.Router();

router.post("/auth/signin", userController.signIn);
router.post("/auth/signout", userController.signOut);
router.post("/auth/signup", userController.signUp);

export default router;
