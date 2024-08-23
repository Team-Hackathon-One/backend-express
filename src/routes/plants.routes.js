import { Router } from "express";
import {
  getChatbotConversation,
  identifyPlant,
} from "../controllers/plant.controller";

const router = Router();

router.post("/identify", identifyPlant);
router.get("/get-chat", getChatbotConversation);

const plantsRouter = router;
export default plantsRouter;
