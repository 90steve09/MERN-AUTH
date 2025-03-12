import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from './nodemailer.js';
import { json } from 'express';



export const register = async (req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Deatails'})
    }

    try {

        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({success: false, message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({name,email, password: hashedPassword })
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender address
        to: email, // list of receivers
        subject: "WELCOME TO MY WORLD ✔", // Subject line
        text: `Your Account has been created ${email}`, // plain text body
        });

        await transporter.sendMail(info);


        return res.json({success: true, message:"User Created Successfully"})

    
        
    } catch (error) {
        res.json({success: false, message: "wewe"})
    }
}

export const login = async (req, res) =>{
    const { email, password} = req.body

    if(!email || !password){
        return res.json({success: false, message: " Email and Password is required"})
    }

    try {

        const user  = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "Invalid Email"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch ){
            return res.json({success: false, message: "Invalid Password"})
        }


        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        return res.json({success: true})

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}


export const logout = async (req, res) =>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success:true , message: "Logged Out"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}



//send verfification otp to the users Email
export const sendVerifyOtp = async (req, res) =>{
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId)

        if(user.isAccountVefified){
            return res.json({success:false , message: "Account is Already Verified"})
        }

        const otp  = String(Math.floor(100000 + Math.random() * 900000))
        
        user.verifyOtp = otp;
        // expiration in 24hours
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Account Verification OTP ✔", // Subject line
            text: `Your OTP is ${otp}. Verify your account using this OTP`, // plain text body
        }

        await transporter.sendMail(mailOption);
        res.json({success: true, message: "Verification OTP sent on Email"})


    } catch (error) {
        res.json({success: false, message: "VERFIY OFTP ERROR"})
    }
}

export const verifyEmail = async (req, res) =>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false , message: "MISSING DETAILS"})
    }
    console.log(userId, otp);
    


    try {
        const user = await userModel.findById(userId)

        if(!user){
            return res.json({success: false , message: "Invalid email"})
        }

        if(user.verifyOtp !== otp || user.verifyOtp === "" ){
            return res.json({success: false , message: "Invalid OTP ---"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP EXPIRED"})
        }

        user.isAccountVefified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save()

        return res.json({success: true , message: "Email  has been verified Successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}