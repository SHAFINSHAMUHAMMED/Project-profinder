import env        from 'dotenv'
env.config()
import adminSchema  from '../models/adminSchema.js'
import UserSchema  from "../models/userSchema.js";
import CategorySchema from '../models/categorySchema.js';
import ProSchema from '../models/professionalSchema.js'
import { generateToken } from "../middleware/auth.js";
import userModel from '../models/userSchema.js';


export const adminLogin = async(req,res)=>{
    try {
       const data = req.body
       console.log(data);
       const admin = await adminSchema.findOne({email:data.email})     
       if(admin){
           if(admin.password==data.rpassword){
            let adminSignUp={
                Status: false,
                message: null,
                token: null,
                name: null,
            }
            const token = generateToken(admin)
            adminSignUp.Status  = true,
            adminSignUp.message = 'you are logged in',
            adminSignUp.token   = token,
            adminSignUp.name    = admin.email
            return  res.json({adminSignUp})

           
        }else{
            res.json({status:false,message:'password dosent match'})
        }
       }else{
        res.json({status:false,message:'not an Admin'})
       }
    } catch (error) {
        console.log(error);
    }
}
export const findPros = async (req,res)=>{
    const pros = await ProSchema.find()
    res.json({status:true, pros:pros})
}

export const blockpro = async(req,res)=>{
    try {
        const id= req.body.id
        const user = await ProSchema.findOne({_id:id})
        if(user.isBlocked==false){
            const details = await ProSchema.updateOne({_id:id},{$set:{isBlocked:true,status:'Blocked'}})
           return res.status(200).json({status:1,message:'user blocked'})   
        }else{
            const details = await ProSchema.updateOne({_id:id},{$set:{isBlocked:false,status:'Active'}})
           return res.status(200).json({status:0, message:'user unblocked'})   
        }
    } catch (error) {
        console.log(error);
        }
}

export const findUser = async (req,res)=>{
    const User = await UserSchema.find()
    res.json({status:true, user:User})
}

export const blockuser = async(req,res)=>{
    try {
        const id= req.body.id
        const user = await userModel.findOne({_id:id})
        if(user.isBlocked==false){
            const details = await userModel.updateOne({_id:id},{$set:{isBlocked:true}})
           return res.status(200).json({status:1,message:'user blocked'})   
        }else{
            const details = await userModel.updateOne({_id:id},{$set:{isBlocked:false}})
           return res.status(200).json({status:0, message:'user unblocked'})   
        }
    } catch (error) {
        console.log(error);
        }
}

export const category = async (req,res)=>{
    try{
        const category = await CategorySchema.find()
        res.json({status:true,category:category})
    }catch(error){

    }
}
//Add category
export const addCategory = async (req,res)=>{
    try{
        const {typeList} = req.body
        console.log(typeList,'fghjkdfghjk');
        const duplicate = await CategorySchema.findOne({name:typeList})
        console.log(duplicate);
        if(duplicate){
            res.json({status:false,message:'Category already exists'})
        }else{
            const types = await CategorySchema.create({
                name:typeList
            })
            if(types){
                res.status(200).json({status:true,types})
            }
        }
    }catch (error){

    }
}

//Delete Type
export const deleteCategory  = async(req,res)=>{
    try {
        const type_id =req.query.id
        const exists = await ProSchema.find({types:type_id})
        console.log(exists+'jkjlklklk');
        if(exists.type==type_id){
            return res.json({status:false,message:'user Exists in this type'})
        }else{
           await CategorySchema.deleteOne({_id:type_id})
           res.json({status:true,message:'success',check:1})
        }
  
    } catch (error) {
        res.json({error})
    }
  }
  
  // Edit Type
  export const editCategory = async(req,res)=>{
    try {
     const edited = req.query
     console.log(edited.oldData);
    
     const duplicate =  await CategorySchema.findOne({name:edited.newData})
     if(duplicate){
        return res.json({status:false,message:'categort already exists'})
     }
  
     if(edited){
       const newData = await CategorySchema.updateOne({name:edited.oldData},{$set:{name:edited.editedData}})
       if(newData){
        res.status(200).json({status:true,success:newData.name})
       }else{
        res.status(500).json({status:false,message:'somethind went Wrong'})
       }
     }
    } catch (error) {
        res.status(500)
        }
      }