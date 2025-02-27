import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: process.env.SMPTP_USER,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER_EMAIL, // generated ethereal user
      pass: process.env.SMPTP_PASSWORD, // generated ethereal password
    },
})


export default transporter;