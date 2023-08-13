import express from 'express'
import {Loginpost,RegisterPost,verifyMails,googleLogin,findByPhone,getDetails,getCategory,getLocation,userDetails,userEdit} from '../controller/userControllers.js'
import {getBookings,stripePayment,razorpay,verifyrzpay,cancellJob} from '../controller/orderControllers.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login',Loginpost)
router.post('/register', RegisterPost)
router.post('/verifyMail',verifyMails)
router.post('/loginGoogle',googleLogin)
router.post('/userPhone',findByPhone)
router.get('/getPros',verifyToken,getDetails)
router.get('/getCategory', getCategory)
router.get('/getLocation', getLocation)
router.get('/getBookings',verifyToken,getBookings)
router.get('/userDetails',verifyToken,userDetails)
router.post('/userEdit', verifyToken,userEdit)
router.post('/payment',verifyToken,stripePayment)
router.post('/razorpay',verifyToken,razorpay)
router.post('/verifyRazorpay',verifyrzpay)
router.post('/cancellJob',verifyToken,cancellJob)



export default router;