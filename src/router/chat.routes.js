import { Router } from "express";
import { chatwithrag } from "../controllers/chat.controller.js";

const router = Router();

router.post("/chat", chatwithrag);

const chatRouter = router;
export default chatRouter;
