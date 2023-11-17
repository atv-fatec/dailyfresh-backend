import { Router } from "express";
import userController from "../controllers/userController";

const user = Router()

user.post('/create', userController.createUser)
user.get('/read/:id', userController.readUser)

export default user