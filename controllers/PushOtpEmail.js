
const nodemailer = require('nodemailer');
const mailHost = "smtp.gmail.com";
export const getOtpEmail = (req, res, text) => {
    try {
        let transporter = nodemailer.createTransport({
            host: mailHost,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS_EMAIL,
            },
            tls: {
                rejectUnauthorized: true
            },

        });
        let otp = Math.floor(Math.random() * Math.pow(10, 6)).toString().padStart(6, '0');
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'OTP Shopee <your_email@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Thông báo', // Subject line
            text: `Mã OTP của bạn là ${otp}`, // plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                // return console.log(error);
            }
            return res.json(otp);

        });
    } catch (error) {
        return res.status(400).json('Lỗi. Xin thực hiện lại !');
    }

};
