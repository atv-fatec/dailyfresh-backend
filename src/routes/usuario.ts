import userController from "../controllers/userController";
import { Router } from "express";

const user = Router()

user.post('/create', userController.createUser)
user.get('/read/:id', userController.readUser)
user.put('/update/:id', userController.updateUser)
user.put('/updateConditions/:id', userController.updateConditions)
user.delete('/delete/:id', userController.deleteUser)
user.post('/login', userController.userLogin)

export default user