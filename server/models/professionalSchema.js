import mongoose  from "mongoose";

const professionalSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            uppercase: true,
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'category',
            type: String
        },
        phone:{
            type:Number,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        location:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'location',
            type:String
        },
        charge:{
            partime:{
                type:Number,
            },
            fulltime:{
                type:Number,
            }
        },
        password:{
            type:String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        googleLogin: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default:'Active'
        },
        orders: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "orders",
            },
          ],

    },
    )
    const professionalsModel = mongoose.model('professionals',professionalSchema)
    
    export default  professionalsModel