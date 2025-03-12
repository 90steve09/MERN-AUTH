import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
  
      user: '86c890001@smtp-brevo.com', // generated ethereal user
      pass: 'I2nCDjax7vBOMSbs', // generated ethereal password


      // cant work using .env
      // user: process.env.SMTP_USER, // generated ethereal user
      // pass: process.env.SMTP_PASSWORD, // generated ethereal password

    },
})


export default transporter;