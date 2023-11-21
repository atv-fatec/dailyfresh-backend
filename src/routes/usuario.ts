import { Router } from "express";
import userController from "../controllers/userController";

const user = Router()

user.post('/create', userController.createUser)
user.get('/read/:id', userController.readUser)
user.put('/update/:id', userController.updateUser)
user.put('/updateConditions/:id', userController.updateConditions)
user.delete('/delete/:id', userController.deleteUser)

export default user