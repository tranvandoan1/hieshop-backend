import User from "../modoles/Users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../modoles/Users";
dotenv.config();
const expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const mailHost = "smtp.gmail.com";

export const signup = async (req, res) => {
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
            try {
              cloudinary.uploader.upload(
                req.file.path,
                { folder: "categories" },
                async function (error, result) {
                  const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    hashed_password: password,
                    avatar: result.url,
                    phone: req.body.phone,
                    image_id: result.public_id,
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


                })
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
}
export const signin = async (req, res) => {
  if (req.body.select == "google") {
    const userGoogle = await User.findOne({
      uid: req.body.uid,
    });
    if (userGoogle == null) {
      return res.json({
        message: "Tài khoản không tồn tại !",
        status: false,
      });
    } else {
      const token = jwt.sign({ _id: userGoogle._id }, process.env.JWT_SECRET);
      res.cookie("t", token, { expire: new Date() + 9999 });

      const { _id, name, avatar, email, role, phone, image_id } = userGoogle;
      return res.json({
        token,
        user: { _id, avatar, email, name, role, phone, image_id },
        message: 'Đăng nhập thành công',
        status: true
      });
    }
  } else {
    const { value, password } = req.body
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    const user = await User.findOne(
      isValidEmail(value) == true
        ? {
          email: value,
        }
        : {
          phone: value,
        }
    );
    function isPhoneNumber(input) {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(input);
    }
    if (isValidEmail(value) == false && isPhoneNumber(value) == false) {
      return res.json({
        message: 'Email hoặc số điện thoại không đúng định dạng !',
        status: false
      });
    } else {
      if (user !== null) {
        bcrypt.compare(password, user.hashed_password, function (error, result) {
          // hàm callback được gọi khi quá trình so sánh hoàn tất
          if (error) {
            return res.json({
              message: 'Lỗi xin thử lại',
              status: false
            });
          } else if (result) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            res.cookie("t", token, { expire: new Date() + 9999 });

            const { _id, name, avatar, email, role, phone, image_id } = user;
            return res.json({
              token,
              user: { _id, avatar, email, name, role, phone, image_id },
              message: 'Đăng nhập thành công',
              status: true
            });
          } else {
            return res.json({
              message: "Mật khẩu không khớp",
              status: false
            });
          }
        });
      } else {
        return res.json({
          message: "Tài khoản không tồn tại !",
          status: false
        });
      }
    }
  }
};

export const signout = (req, res) => {
  res.clearCookie("t");
  res.json({
    message: "Đăng xuất thành công",
  });
};
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

export const isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Quyền truy cập bị Từ chối",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "Admin resource! Access Denined",
    });
  }
  next();
};
