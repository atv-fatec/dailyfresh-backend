import { Router } from "express";
import termController from "../controllers/termController";

const term = Router()

term.post('/create', termController.createTerm)
term.get('/read/:id', termController.readTerm)
term.get('/readLatest', termController.readLatestTerm);

export default term