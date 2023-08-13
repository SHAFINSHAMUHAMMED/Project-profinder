import bcrypt from "bcrypt";
import userModel from "../models/userSchema.js";
import proModel from "../models/professionalSchema.js";
import categoryModel from "../models/categorySchema.js";
import locationModel from "../models/locationSchema.js";
import { generateToken } from "../middleware/auth.js";
import nodemailer from "nodemailer";
import env from "dotenv";
env.config();

export const Loginpost = async (req, res) => {
  let userSignUp = {
    Status: false,
    message: null,
    token: null,
    name: null,
    id: null,
  };
  try {
    const user = req.body;
    let status = false;
    const finduser = await userModel.findOne({ email: user.email });
    if (finduser) {
      console.log(finduser._id);
      if (finduser.password) {
        const isMatch = await bcrypt.compare(user.password, finduser.password);
        if (isMatch) {
          if (finduser.isVerified) {
            const token = generateToken(finduser);
            userSignUp.message = "You are logged";
            userSignUp.Status = true;
            userSignUp.token = token;
            userSignUp.name = finduser.name;
            userSignUp.id = finduser._id;
            res.json({ userSignUp });
          } else {
            userSignUp.Status = false;
            userSignUp.message = "Please verify Your Mail";
            res.json({ userSignUp });
          }
        } else {
          userSignUp.message = " Password is wrong";
          userSignUp.Status = false;
          res.json({ userSignUp });
        }
      } else {
        userSignUp.message = " Please Register";
        userSignUp.Status = false;
        res.json({ userSignUp });
      }
    } else {
      userSignUp.message = "your Email wrong";
      userSignUp.Status = false;
      res.json({ userSignUp });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};
export const RegisterPost = async (req, res) => {
  try {
    let userDetails = req.body;
    let email = userDetails.email.toLowerCase();
    const user = await userModel.findOne({ email: email });
    const user2 = await userModel.findOne({ phone: userDetails.phone });
    if (!user && !user2) {
      console.log("get in");
      userDetails.password = await bcrypt.hash(userDetails.password, 10);
      const createUser = await userModel.create({
        name: userDetails.name,
        email: userDetails.email.toLowerCase(),
        phone: userDetails.phone,
        password: userDetails.password,
      });
      const emailResult = await sendVerifyMail(
        createUser.name,
        createUser.email,
        createUser._id
      );
      if (emailResult.result) {
        res.json({
          status: true,
          message: "Registration Success Please Verify Your Mail",
        });
      } else {
        await userModel.deleteOne({ email: createUser.email }); //for delete non send verification user details from db
        res.json({ status: false, message: "Email Not Send" });
      }
    } else {
      if (user.googleLogin && !user2) {
        let email = userDetails.email.toLowerCase();
        userDetails.password = await bcrypt.hash(userDetails.password, 10);
        await userModel.updateOne(
          { email: email },
          {
            $set: {
              name: userDetails.name,
              phone: userDetails.phone,
              password: userDetails.password,
            },
          }
        );
        res.json({
          status: true,
          message: "Registration Success",
        });
      } else {
        return res.json({ status: false, message: "User Already Exist" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendVerifyMail = async (username, email, user_id) => {
  try {
    const userUrl = process.env.UserUrl;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "codershafinsha@gmail.com",
        pass: process.env.EMAILPASS,
      },
    });

    const mailOption = {
      from: "codershafinsha@gmail.com",
      to: email,
      subject: "Email verification",
      html: `<p>Hii ${username}, please click <a href="${userUrl}/VerifyMail/${user_id}">here</a> to verify your email.</p>`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log(error.message);
          console.log("Email could not be sent");
          reject({ result: false });
        } else {
          resolve({ result: true });
        }
      });
    });
  } catch (error) {
    console.log(error);
    console.log("Error occurred while sending email");
    throw error;
  }
};

export const verifyMails = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id, 11111111111111);
    const check = await userModel.findOne({ _id: id });
    if (check) {
      if (check.isVerified === false) {
        await userModel.updateOne({ _id: id }, { $set: { isVerified: true } });
        res.json({ Verification: true, message: "Verification successful" });
      } else {
        res.json({ Verification: false, message: "Already Verified" });
      }
    } else {
      console.log("no user");
      res.json({ Verification: false, message: "No User Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Verification: false, message: "An error occurred" });
  }
};

export const googleLogin = async (req, res) => {
  let userSignUp = {
    Status: false,
    message: null,
    token: null,
    name: null,
    id: null,
  };
  const userData = req.body.payload;

  const user = await userModel.findOne({ email: userData.email });
  if (user) {
    if (!user.googleLogin) {
      await userModel.updateOne(
        { email: userData.email },
        {
          $set: {
            googleLogin: true,
            isVerified: true,
          },
        }
      );
    }
    const token = generateToken(user);
    userSignUp.message = "You are logged";
    userSignUp.Status = true;
    userSignUp.token = token;
    userSignUp.name = user.name;
    userSignUp.id = user._id;
    res.json({ userSignUp });
  } else {
    const create = await userModel.create({
      name: userData.name,
      email: userData.email,
      isVerified: true,
      googleLogin: true,
    });
    const token = generateToken(create);
    userSignUp.message = "You are logged";
    userSignUp.Status = true;
    userSignUp.token = token;
    userSignUp.name = create.name;
    userSignUp.id = create._id;
    res.json({ userSignUp });
  }
};

export const findByPhone = async (req, res) => {
  try {
    const phone = req.body.phone;
    console.log(phone);
    const userPhone = await userModel.findOne({ phone: phone });
    if (userPhone) {
      const token = generateToken(userPhone);
      res.json({
        status: true,
        message: "User Found",
        token: token,
        name: userPhone.name,
      });
    } else {
      res.json({ status: false, message: "User Not Found Please Register" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "An error occurred" });
  }
};

export const getDetails = async (req, res) => {
  try {
    const pro = await proModel.find().populate("location").populate("category");
    console.log(pro);
    res.json({ status: true, pro: pro });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.json({ status: true, category: category });
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

export const getLocation = async (req, res) => {
  try {
    const location = await locationModel.find({});
    console.log(location);
    if (location) {
      res.json({ status: true, location });
    } else {
      res.json({ staus: false });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const userDetails = async (req, res) => {
  const userId = req.query.userId;
  try {
    const userData = await userModel.findById({ _id: userId });
    if (userData) {
      res.json({ status: true, data: userData });
    }
  } catch (error) {
    res.status(500).json({ status: false });
  }
};

export const userEdit = async (req, res) => {
  const data = req.body;
  try {
    await userModel.updateOne(
      { _id: data.userId },
      { $set: { name: data.name, phone: data.phone, image: data.photo } }
    );
    res.json({ status: "success" });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
};
