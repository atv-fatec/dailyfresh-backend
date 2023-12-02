import termController from "../controllers/termController";
import { Router } from "express";

const term = Router()

term.post('/create', termController.createTerm)
term.get('/read/:id', termController.readTerm)
term.get('/readLatest', termController.readLatestTerm);
term.get('/teste', termController.teste);

export default term