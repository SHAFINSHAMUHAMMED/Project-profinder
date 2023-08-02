import express from 'express'
import {Loginpost,RegisterPost,verifyMails,googleLogin,findByPhone,getDetails} from '../controller/userControllers.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login',Loginpost)
router.post('/register', RegisterPost)
router.post('/verifyMail',verifyMails)
router.post('/loginGoogle',googleLogin)
router.post('/userPhone',findByPhone)
router.get('/getPros',verifyToken,getDetails)


export default router;