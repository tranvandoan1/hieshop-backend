import express from "express";
import { signup, signin, signout } from "../controllers/Auth";
import { userSignupValidator } from "../validator";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const mailHost = "smtp.gmail.com";
import multer from "multer";
import fs from "fs";
import { google } from "googleapis";
import Users from "../modoles/Users";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(CLIENT_ID);
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REQUEST_URI = process.env.REQUEST_URI;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REQUEST_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
// single
const upload = multer({ storage: storage });
const router = express.Router();
// userSignupValidator
router.post("/signin", signin);
router.post("/signup", upload.single("files"), async (req, res) => {
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isPhoneNumber(input) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(input);
    }

    const email = await Users.findOne({
        email: req.body.email,
    });
    const phone = await Users.findOne({
        phone: req.body.phone,
    });

    if (phone !== null) {
        return res.json({
            message: "Số điện thoại đã được sử dụng !",
            status: false,
            data: undefined,
        });
    } else if (email !== null) {
        return res.json({
            message: "Email đã được sử dụng !",
            status: false,
            data: undefined,
        });
    } else if (isValidEmail(req.body.email) == false) {
        return res.json({
            message: "Email không đúng định dạng !",
            status: false,
            data: undefined,
        });
    } else if ((isPhoneNumber(req.body.phone) == req.body.google)) {
        return res.json({
            message: "Số điện thoại không đúng định dạng !",
            status: false,
            data: undefined,
        });
    } else {
        if (req.body.otp == 1) {
            try {
                let transporter = nodemailer.createTransport({
                    host: mailHost,
                    service: "gmail",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.PASS_EMAIL,
                    },
                    tls: {
                        rejectUnauthorized: true,
                    },
                });
                let otp = Math.floor(Math.random() * Math.pow(10, 6))
                    .toString()
                    .padStart(6, "0");
                // setup email data with unicode symbols
                let mailOptions = {
                    // from: '"Phòng QHDN" <foo@example.com>',
                    from: "OTP <your_email@gmail.com>", // sender address
                    to: req.body.email, // list of receivers
                    subject: "Thông báo", // Subject line
                    html: `<div style="color: black;font-size: 16px;">Mã OTP của bạn là</div> <div style="color: red;font-size: 30px;margin: 20px 0">${otp}</div> <div style="color: red;font-size: 14px;font-weight: 700;">Không chuyển tiếp hoặc cung cấp mã này cho bất kỳ ai.</div> `, // plain text body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.json({
                            message: "Lỗi không gửi được",
                            status: false,
                        });
                    }
                    return res.json({
                        message: "Otp đã được gửi đến email",
                        status: true,
                        otp: otp,
                    });
                });
            } catch (error) {
                return res.status(400).json("Lỗi. Xin thực hiện lại !");
            }
        } else {
            bcrypt.hash(req.body.password, 10, async function (err, password) {
                // hàm callback được gọi khi quá trình mã hóa hoàn tất
                if (err) {
                    return res.json({
                        message: "Lỗi không đăng ký được",
                        status: false,
                        data: undefined,
                    });
                } else {
                    if (req.file !== undefined) {
                        function uploadFile(fileMetadata, media) {
                            return new Promise((resolve, reject) => {
                                drive.files.create(
                                    {
                                        resource: fileMetadata,
                                        media: media,
                                        fields: "id",
                                    },
                                    (err, file) => {
                                        if (err) {
                                            reject(err);
                                            return res.json({
                                                message: "Lỗi không đăng ký được",
                                                status: false,
                                                data: undefined,
                                            });
                                        } else {
                                            resolve(file.data.id); // Trả về ID file
                                        }
                                    }
                                );
                            });
                        }

                        const fileMetadata = {
                            name: req.file.originalname,
                            parents: ["1DIgh7JYRqs6KJaOFnlhepDFlUtZeYe3c"],
                        };
                        const media = {
                            mimeType: req.file.mimetype,
                            body: fs.createReadStream(req.file.path),
                        };
                        try {
                            const fileId = await uploadFile(fileMetadata, media);

                            const newUser = {
                                name: req.body.name,
                                email: req.body.email,
                                hashed_password: password,
                                avatar: `https://drive.google.com/uc?export=view&id=${fileId}`,
                                phone: req.body.phone,
                                image_id: fileId,
                            };
                            const user = new Users(newUser);
                            user.save((error, user) => {
                                if (error) {
                                    return res.status(400).json({
                                        error: "Không thêm được",
                                        data: undefined,
                                        status: false,
                                    });
                                }
                                return res.json({
                                    message: "Đăng ký thành công",
                                    status: true,
                                    data: user,
                                });
                            });
                        } catch (err) {
                            return res.json({
                                message: "Lỗi không đăng ký được",
                                status: false,
                                data: undefined,
                            });
                        }
                    } else {
                        const newUser = {
                            name: req.body.name,
                            email: req.body.email,
                            hashed_password: password,
                            avatar: req.body.avatar,
                            phone: req.body.phone,
                            uid: req.body.uid,
                            image_id: 1,
                        };
                        const user = new Users(newUser);
                        user.save((error, user) => {
                            if (error) {
                                return res.status(400).json({
                                    error: "Không thêm được",
                                    data: undefined,
                                    status: false,
                                });
                            }
                            return res.json({
                                message: "Đăng ký thành công",
                                status: true,
                                data: user,
                            });
                        });
                    }
                }
            });
        }
    }
});
router.get("/signout", signout);

module.exports = router;
