import { Router } from "express";
import {
  createUsuario,
  deleteUsuario,
  getUsuario,
  getUsuarios,
  updateUsuario,
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/", createUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

const userRouter = router;
export default userRouter;
