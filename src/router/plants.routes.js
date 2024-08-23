import { Router } from "express";
import { identifyPlant } from "../controllers/plant.controller.js";

const router = Router();

router.post("/identify-plant", identifyPlant);

const plantRouter = router;

export default plantRouter;
