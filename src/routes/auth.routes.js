import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/logout");

const authRouter = router;
export default authRouter;
