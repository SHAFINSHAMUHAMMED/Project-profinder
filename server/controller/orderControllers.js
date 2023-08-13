import orderSchema from '../models/orderSchema.js'
import env from "dotenv";
env.config();
import stripePackage  from 'stripe';
import Razorpay from 'razorpay'
import crypto from 'crypto'
const stripe = stripePackage(process.env.stripeKey)


export const getBookings = async (req,res)=>{
    const proId = req.query.proId;
    const userId = req.query.userId;
    const selectedDate = new Date(req.query.selectedDate);
    
    try {
      if(proId){
      const orders = await orderSchema.find({ proId: proId });
      
      if (orders) {
        const bookingsWithDate = orders.filter(order => {
          const orderDate = new Date(order.date);
          return (
            orderDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
            orderDate.getUTCMonth() === selectedDate.getUTCMonth() &&
            orderDate.getUTCDate() === selectedDate.getUTCDate()
          );
        });
        if (bookingsWithDate.length > 0) {
          console.log(1111111);
            res.status(200).json({status:true,bookingsWithDate});
          } else {
            console.log(2222222);
            res.status(200).json({ status:false, message: 'No bookings found for the given date and proId.' });
          }
        }else{
          res.status(500).json({ status:false, message: 'Error' });

        }
      }else if(userId){
      const orders = await orderSchema.find({ userID: userId }).populate('proId')

        if(orders){
          console.log(orders);
          res.status(200).json({status:true,orders});
        }else{
          res.status(200).json({ status:false, message: 'No bookings found.' });
        }
      }

    }catch(error){
        res.status(500).json({ message: 'An error occurred while fetching bookings.' });
    }
  }

  export const stripePayment = async (req,res) => {
    const { amount, id } = req.body;
    try{
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'INR',
        description: 'Profinder',
        payment_method: id,
        confirm: true
      })
      console.log('payment', payment);
      res.status(200).json({ message: 'payment success', success: true });
    }catch(error){
      console.error('Error creating payment intent:', error);
      res.status(500).json({ message: 'payment failed', success: false });
    }

  }

  //Razorpay
  export const razorpay = async (req, res) => {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_PASS,
    });
  
    var options = {
      amount: req.body.selectedPayment * 100, // amount in the smallest currency unit
      currency: "INR",
    };
  
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ status: false });
      } else {
        console.log("Razorpay order created:", order);
        return res.json({ status: true, data: order });
      }
    });
  };

  export const verifyrzpay = async (req,res) => {
    const razorpayId = req.body.response.razorpay_order_id;
    const razorpayPaymentId = req.body.response.razorpay_payment_id;
    const { proData, date, time, formData, userId } = req.body.requestData;
    console.log(proData);
    const parsedDate = new Date(date);
  parsedDate.setDate(parsedDate.getDate() + 1);
  parsedDate.setUTCHours(0, 0, 0, 0);
  const newDate = parsedDate.toISOString();
  console.log(newDate,'dddddddddddddddddddd');
    const body = `${razorpayId}|${razorpayPaymentId}`;
    try{
      const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_PASS)
      .update(body, 'utf-8')
      .digest('hex')
      if(expectedSignature === req.body.response.razorpay_signature){
        const orderData = await orderSchema.create({
          userID: userId,
          proId:proData._id,
          orderId:razorpayId.substring(6),
          date:newDate,
          work_type:time,  //full/part
          category:proData.category.name,
          payment:formData.selectedPayment,
          address:{
            name:formData.firstName+' '+formData.lastName,
            location:formData.city+' '+formData.landmark+' '+formData.district,
            contact: formData.phone,
            zip: formData.zip
          }
        })
        res.json({status:true, message: 'Payment success',orderData})
      }else{
        console.log('invalid signature');
        res.json({status:false, message:'Invalid signature'})
      }
    }catch(error){
      console.log(error);
      res.status(500).json({message:'Server Failed'})
    }
  }

  //cancell Booking

  export const cancellJob = async (req,res) => {
    const id = req.body.id
    console.log(id);
    try{
      const cancell = await orderSchema.updateOne ({_id:id},
        {$set:{work_status:'cancelled'}})
        
        if(cancell.modifiedCount>0){
          res.json({status:true, message: "cancelled"})
        }else{
          res.json({status:false,message:"some error occured"})
        }

    }catch(error){
      res.status(500).json({staus:false, message:"Error"})
    }
  }