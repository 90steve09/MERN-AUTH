import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();


const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser())
app.use(cors({credentials:true}))

app.listen(PORT, ()=>{
    console.log(`Server Running at port:${PORT}`);
    
})




