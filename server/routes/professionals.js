import express from 'express'
import {RegisterPost,verifyMails,LoginPost,findByPhone,googleLogin,findCat} from '../controller/professionalsControllers.js'
import { verifyToken } from '../middleware/auth.js';



const router = express.Router();
router.post('/registerPro',RegisterPost)
router.post('/verifyMail',verifyMails)
router.post('/login',LoginPost)
router.post('/proPhone',findByPhone)
router.post('/loginGoogle',googleLogin)
router.get('/listCat',findCat)

export default router;