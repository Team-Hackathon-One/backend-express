import { Router } from "express";

import { signIn, signUp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", signIn);
router.post("/register", signUp);

const authRouter = router;
export default authRouter;
