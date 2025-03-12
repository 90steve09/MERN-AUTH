import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import { authRouter } from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'



dotenv.config();


const app = express()

const PORT = process.env.PORT || 5001

app.use(express.json());
app.use(cookieParser())
app.use(cors({credentials:true}))


app.get("/",( req, res)=>{
    res.send("WELCOME TO MOBILE ssss ")
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


app.listen(PORT, ()=>{
    console.log(`Server Running at port:${PORT}`);
    connectDB();
})




