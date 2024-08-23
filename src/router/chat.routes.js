import { Router } from "express";
import { chatwithrag } from "../controllers/chat.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post("/chat", chatwithrag);

const chatRouter = router;
export default chatRouter;
