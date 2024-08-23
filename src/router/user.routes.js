import Router from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/usuario.controller.js';

const userRoutes = Router();

userRoutes.post("/", createUser)
userRoutes.get("/", getUsers)
userRoutes.get("/:id", getUser)
userRoutes.put("/:id", updateUser)
userRoutes.delete("/:id", deleteUser)

export default userRoutes