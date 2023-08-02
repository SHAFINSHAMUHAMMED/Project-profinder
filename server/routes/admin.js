import express from 'express'
import {adminLogin,findPros,blockpro, findUser,blockuser,category,addCategory,editCategory,deleteCategory} from '../controller/admin.js'
import { verifyToken } from '../middleware/auth.js';



const router = express.Router();
router.post('/login',adminLogin)
router.get('/findPros',verifyToken ,findPros)
router.get('/findUser',verifyToken ,findUser)
router.post('/blockuser',verifyToken ,blockuser)
router.post('/blockpro',verifyToken ,blockpro)
router.get('/listTypes' ,verifyToken,category)
router.post('/listTypes',verifyToken , addCategory)
router.patch('/editType', verifyToken, editCategory)
router.delete('/deleteType', verifyToken ,deleteCategory)

export default router;