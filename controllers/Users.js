import formidable from "formidable";
import _ from "lodash";
import User from "../modoles/Users";
import Users from "../modoles/Users";
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const mailHost = "smtp.gmail.com";
export const listUser = (req, res) => {
    User.find((err, data) => {
        if (err) {
            res.status(400).json({
                err: " Không có tài khoản nào !",
            });
        }
        res.json(data);
    });
};
export const list = async (req, res) => {
    const user = await User.findOne({
        _id: req.params.userId,
    });
    return res.json(user);
};
export const userById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    });
};
export const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
};
export const update = async (req, res) => {
    await User.updateMany(
        {
            _id: { $in: req.body._id },
        },
        {
            $set: req.body,
        }
    );
    const user = await User.findOne({
        _id: req.body._id,
    });
    return res.json(user);
};

export const remove = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được sản phẩm",
            });
        }
        res.json({
            user,
            message: "Sản phẩm đã được xóa thành công",
        });
    });
};
export const checkEmailUpload = async (req, res, text) => {
    try {
        const { _id, email } = req.body;
        const user = await User.findOne({
            email: email,
        });
        if (user) {
            return res.json({ notification: 'Email đã sử dụng', status: true });
        } else {
            return res.json({ notification: 'Email hợp lệ', status: false });

        }
    } catch (error) {
        return res.status(400).json({
            error: 'Lỗi. Hãy thử lại'
        });
    }
};
export const uploadEmail = async (req, res) => {
    await User.updateMany(
        {
            _id: { $in: req.body._id },
        },
        {
            $set: {
                email: req.body.email,
            },
        }
    );

    const user = await User.findOne({
        _id: req.body._id,
    });
    return res.json(user);


}
export const uploadPassword = async (req, res) => {
    const { _id, current_password, newPassword, confirm } = req.body;
    const user = await User.findOne({
        _id: _id,
    });

    bcrypt.compare(
        current_password,
        user.hashed_password,
        function (error, result) {
            // hàm callback được gọi khi quá trình so sánh hoàn tất
            if (error) {
                return res.status(400).json({ error: "Lỗi 400" });
            } else if (result) {
                const saltRounds = 10; // số lần lặp lại để tạo salt
                bcrypt.hash(newPassword, saltRounds, async function (err, password) {
                    // hàm callback được gọi khi quá trình mã hóa hoàn tất
                    if (err) {
                        return res.json({ error: "Lỗi 400" });
                    } else {
                        await User.updateMany(
                            {
                                _id: { $in: _id },
                            },
                            {
                                $set: {
                                    hashed_password: password
                                },
                            }
                        );

                        return res.json({
                            susssuc: 'Cập nhật thành công'
                        });
                    }
                });
            } else {
                return res.json({
                    error: "Mật khẩu không khớp",
                });
            }
        }
    );
};
export const forgotPassword = async (req, res) => {
    const { value, newPassword, check } = req.body;
    function isEmail(str) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(str);
    }
    const emailValide = await Users.findOne({
        email: value,
    });
    if (isEmail(value) == false) {
        return res.json({
            message: "Email không đúng định dạng !",
            status: false,
        });
    } else if (emailValide == null) {
        return res.json({
            message: "Email không tồn tại !",
            status: false,
        });
    } else {
        if (check == 1) {
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
                    to: value, // list of receivers
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
            const saltRounds = 10; // số lần lặp lại để tạo salt
            bcrypt.hash(newPassword, saltRounds, async function (err, password) {
                // hàm callback được gọi khi quá trình mã hóa hoàn tất
                if (err) {
                    return res.json({
                        message: "Lỗi không thực hiện thay đổi được !",
                        status: false,
                    });
                } else {
                    await User.updateMany(
                        {
                            _id: { $in: emailValide._id },
                        },
                        {
                            $set: {
                                hashed_password: password
                            },
                        }
                    );

                    return res.json({
                        message: "Mật khẩu đã được cập nhật !",
                        status: true,
                    });
                }
            });
        }

    }





}
