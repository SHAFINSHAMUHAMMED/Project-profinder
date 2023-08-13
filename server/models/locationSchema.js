import mongoose  from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        location:{
            type:String,
            trim:true,
            uppercase:true,
        }
    },
    )
    const locationModel = mongoose.model('location',locationSchema)
    
    export default  locationModel