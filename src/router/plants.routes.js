import { Router } from "express";
import {
  getPlantDetail,
  identifyPlant,
  searchPlant,
} from "../controllers/plant.controller.js";

const router = Router();

router.get("/search-plant", searchPlant);
router.get("/plant-detail", getPlantDetail);
router.post("/identify-plant", identifyPlant);

const plantRouter = router;

export default plantRouter;
