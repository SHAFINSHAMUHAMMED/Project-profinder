import express from 'express'
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

// Configure specific origins, methods, and headers
const corsOptions = {
    origin: ['http://localhost:5173','http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
  };
  
  // Enable CORS with the custom options
  app.use(cors(corsOptions));

import adminRouter from "./routes/admin.js";
import professionalsRouter from './routes/professionals.js'
import userRouter from './routes/user.js'

app.use("/admin", adminRouter);
app.use("/professionals", professionalsRouter);
app.use("/", userRouter);

const PORT = 4000;
mongoose
    .connect('mongodb://127.0.0.1:27017/profinder', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
