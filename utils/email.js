const nodemailer = require('nodemailer');
const sendEmail = async     options =>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from:'Biley <hello@biley.io>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.send(mailOptions);

}
module.exports = sendEmail;