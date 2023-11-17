import { Router } from "express";
import user from "./usuario";
import term from "./termo";

const router = Router()

router.use('/user', user)
router.use('/term', term)

export default router