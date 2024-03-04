import formidable from "formidable";
import _ from "lodash";
import User from "../modoles/Users";
import Users from "../modoles/Users";
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const mailHost = "smtp.gmail.com";
const cloudinary = require("cloudinary").v2;

export const list = async (req, res) => {
    console.log('có vào')
    const user = await User.findOne({
        _id: req.params.userId,
    });
    return res.json({
        message: "Lấy dữ liệu thành công",
        status: 1,
        data: user,
    });
};
export const listAll = async (req, res) => {
    console.log('có vào âll')
    User.find((err, data) => {
        if (err) {
            return res.json({
                message: "Không lấy được dữ liệu",
                status: false,
                data: [],
            });
        }
        return res.json({
            message: "Lấy dữ liệu thành công",
            status: 1,
            data: data,
        });
    });
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
export const updateAdmin = async (req, res) => {
    const fileIds = [];
    function isPhoneNumber(input) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(input);
    }
    const user = await User.findOne({
        _id: req.body._id,
    });
    if (isPhoneNumber(req.body.phone) == false) {
        const user = await User.findOne({
            _id: req.body._id,
        });
        return res.json({
            data: user,
            message: "Số điện thoại không đúng !",
            status: false,
        });


    } else {
        if (req.files.length > 0) {
            function uploadFile(fileMetadata, media) {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(
                        fileMetadata,
                        { folder: "user" },
                        async function (error, result) {
                            if (error) {
                                const user = await User.findOne({
                                    _id: req.body._id,
                                });
                                return res.json({
                                    message: "Lỗi không thêm được ảnh !",
                                    status: false,
                                    data: user,
                                });
                                // User.find((err, data) => {
                                //     if (err) {
                                //         return res.json({
                                //             message: "Không lấy được dữ liệu",
                                //             status: false,
                                //             data: [],
                                //         });
                                //     }
                                //     return res.json({
                                //         message: "Lỗi không thêm được ảnh !",
                                //         status: false,
                                //         data: data,
                                //     });
                                // });
                            } else {
                                resolve({
                                    image_id: result.public_id,
                                    photo: result.url,
                                }); // Trả về ID file
                            }
                        }
                    );
                });
            }
            for (let i = 0; i < req.files.length; i++) {
                try {
                    const fileId = await uploadFile(req.files[i].path);
                    fileIds.push(fileId); // Thêm ID file vào mảng
                } catch (err) {
                    const user = await User.findOne({
                        _id: req.body._id,
                    });
                    return res.json({
                        message: "Không tìm thấy sản phẩm",
                        status: false,
                        data: user,
                    });
                }
            }
        }
        if (fileIds.length > 0) {
            const user = await User.findOne({
                _id: req.body._id,
            });
            req.body.check == 0 ? null :
                req.body.check == 1 ?
                    cloudinary.uploader.destroy(user.image_id) :
                    req.body.check == 2 ?
                        cloudinary.uploader.destroy(user.logo_id) :
                        (cloudinary.uploader.destroy(user.logo_id),
                            cloudinary.uploader.destroy(user.image_id))
            try {

                await User.updateMany(
                    {
                        _id: { $in: req.body._id },
                    },
                    {
                        $set:
                            (req.body.check == 0
                                ? {
                                    logo: user.logo,
                                    logo_id: user.logo_id,
                                    avatar: user.avatar,
                                    image_id: user.image_id,
                                    phone: req.body.phone,
                                    email: req.body.email,
                                    name: req.body.name,
                                }
                                : req.body.check == 1
                                    ? {
                                        logo: user.logo,
                                        logo_id: user.logo_id,
                                        avatar: fileIds[0].photo,
                                        image_id: fileIds[0].image_id,
                                        phone: req.body.phone,
                                        email: req.body.email,
                                        name: req.body.name,
                                    }
                                    : req.body.check == 2
                                        ? {
                                            logo: fileIds[0].photo,
                                            logo_id: fileIds[0].image_id,
                                            avatar: user.avatar,
                                            image_id: user.image_id,
                                            phone: req.body.phone,
                                            email: req.body.email,
                                            name: req.body.name,
                                        }
                                        : {
                                            logo: fileIds[req.body.imageUrlLogo == true ? 0 : 1].photo,
                                            logo_id:
                                                fileIds[req.body.imageUrlLogo == true ? 0 : 1].image_id,
                                            avatar:
                                                fileIds[req.body.imageUrlLogo == true ? 1 : 0].photo,
                                            image_id:
                                                fileIds[req.body.imageUrlLogo == true ? 1 : 0].image_id,
                                            phone: req.body.phone,
                                            email: req.body.email,
                                            name: req.body.name,
                                        }),
                    }
                );
                const userNew = await User.findOne({
                    _id: req.body._id,
                });
                return res.json({
                    message: "Cập nhật dữ liệu thành công",
                    status: true,
                    data: userNew,
                });
            } catch (err) {
                return res.json({
                    message: "Lỗi không thêm được !",
                    status: false,
                    data: undefined,
                });
            }
        } else {
            try {
                await User.updateMany(
                    {
                        _id: { $in: req.body._id },
                    },
                    {
                        $set: {
                            phone: req.body.phone,
                            email: req.body.email,
                            name: req.body.name,
                        },
                    }
                );
                const user = await User.findOne({
                    _id: req.body._id,
                });
                return res.json({
                    message: "Cập nhật dữ liệu thành công",
                    status: true,
                    data: user,
                });

            } catch (err) {
                return res.json({
                    message: "Lỗi không thêm được !",
                    status: false,
                    data: undefined,
                });
            }
        }
    }
};
export const updateUser = async (req, res) => {
    const { _id, name, email, phone, image_id } = req.body;

    function isPhoneNumber(input) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(input);
    }

    if (isPhoneNumber(phone) == false) {
        User.find((err, data) => {
            if (err) {
                return res.json({
                    message: "Không lấy được dữ liệu",
                    status: false,
                    data: [],
                });
            }
            return res.json({
                message: "Số điện thoại không đúng định dạng !",
                status: false,
                data: data,
            });
        });
    } else {
        // Upload ảnh
        if (req.file !== undefined) {
            cloudinary.uploader.upload(
                req.file.path,
                { folder: "categories" },
                async function (error, result) {
                    try {
                        if (String(image_id).lenth > 0) {
                            await cloudinary.uploader.destroy(image_id);
                        }
                        await User.updateMany(
                            {
                                _id: { $in: _id },
                            },
                            {
                                $set: {
                                    avatar: result.url,
                                    image_id: result.public_id,
                                    phone: phone,
                                    email: email,
                                    name: name,
                                },
                            }
                        );
                        User.find((err, data) => {
                            if (err) {
                                return res.json({
                                    message: "Không lấy được dữ liệu",
                                    status: false,
                                    data: [],
                                });
                            }
                            return res.json({
                                message: "Cập nhật dữ liệu thành công",
                                status: true,
                                data: data,
                            });
                        });
                    } catch (err) {
                        return res.json({
                            message: "Lỗi không thêm được !",
                            status: false,
                            data: undefined,
                        });
                    }
                }
            );
        } else {
            await User.updateMany(
                {
                    _id: { $in: _id },
                },
                {
                    $set: {
                        phone: phone,
                        email: email,
                        name: name,
                    },
                }
            );
            User.find((err, data) => {
                if (err) {
                    return res.json({
                        message: "Không lấy được dữ liệu",
                        status: false,
                        data: [],
                    });
                }
                return res.json({
                    message: "Cập nhật dữ liệu thành công",
                    status: true,
                    data: data,
                });
            });
        }

    }
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
            return res.json({ notification: "Email đã sử dụng", status: true });
        } else {
            return res.json({ notification: "Email hợp lệ", status: false });
        }
    } catch (error) {
        return res.status(400).json({
            error: "Lỗi. Hãy thử lại",
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
};
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
                                    hashed_password: password,
                                },
                            }
                        );

                        return res.json({
                            susssuc: "Cập nhật thành công",
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
                                hashed_password: password,
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
};
