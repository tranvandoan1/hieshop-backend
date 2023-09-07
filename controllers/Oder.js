import Oder from "../modoles/Oder";
import Saveoder from "../modoles/SaveOder";
import _ from "lodash";
import formidable from "formidable";
const nodemailer = require("nodemailer");
const mailHost = "smtp.gmail.com";
import { ObjectID } from "mongodb";

export const create = async (req, res) => {
  const { data, user, phone, sum, email_shop, adress, time } = req.body;
  try {
    const dataPro = JSON.parse(data.values)
    for (let i = 0; i < dataPro.length; i++) {
      await Saveoder.deleteMany({ _id: { $in: ObjectID(dataPro[i]._id) } });
      await Oder.create(data);
    }

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
    let mailOptions = {
      from: "Thông báo đơn hàng <your_email@gmail.com>", // sender address
      to: req.body.email_shop, // list of receivers
      subject: 'Thông báo', // Subject line
      html: `<div style="padding: 10px;box-shadow: 0 0 5px rosybrown;max-width: 720px;margin: 0 auto;">
        <h4 style="text-align: center;font-size: 25px;">Thông báo</h4>
        <div style="display: flex;align-items: center;">
          <span style="color: red;font-weight: 500;font-style: italic;text-decoration: underline;font-size: 20px;">
            ${user.name}
          </span>
          <span style="margin-left: 10px;font-size: 17px;margin-top: 8px;">vừa đặt hàng của bạn</span>
        </div>
        <div>
          <span style="font-size: 20px;font-weight: 500;">Địa chỉ : </span>
          <span style="font-size: 20px;">${adress}</span>
        </div>
        <div>
          <span style="font-size: 20px;font-weight: 500;">Số điện thoại : </span>
          <span style="font-size: 20px;">${phone}</span>
        </div>
        <div>
          <span style="font-size: 20px;font-weight: 500;">Số lượng : </span>
          <span style="font-size: 20px;">${data.values.length}</span>
        </div>
        <div>
          <span style="font-size: 20px;font-weight: 500;">Thời gian đặt : </span>
          <span style="font-size: 20px;">${time}</span>
        </div>
        <div>
          <span style="color: blue;font-weight: 500;font-size: 20px;">Tổng tiền : </span>
          <span style="color: red;font-weight: 500;font-size: 20px;">
            ${sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
          </span>
        </div>
      </div>`,
    };

    transporter.sendMail(mailOptions);

    Oder.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không tìm thấy sản phẩm",
          data: "data",
          status: true,
        });
      }
      return res.json({
        message: "Lấy dữ liệu thành công",
        data: data,
        status: true,
      });
    });
  } catch (error) {
    return res.json({
      message: "Lấy dữ liệu không thành công",
      data: [],
      status: true,
    });
  }
};

export const Id = (req, res, next, id) => {
  Oder.findById(id).exec((err, oder) => {
    if (err || !oder) {
      res.status(400).json({
        error: "Không tìm thấy sản phẩm",
      });
    }
    req.oder = oder;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.oder);
};

export const remove = (req, res) => {
  let oder = req.oder;
  oder.remove((err, oder) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được sản phẩm",
      });
    }
    res.json({
      oder,
      message: "Sản phẩm đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  Oder.find((err, data) => {
    if (err) {
      return res.json({
        message: "Không tìm thấy sản phẩm",
        data: "data",
        status: true,
      });
    }
    return res.json({
      message: "Lấy dữ liệu thành công",
      data: data,
      status: true,
    });
  });
};

export const update = (req, res) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    // if (err) {
    //     return res.status(400).json({
    //         message: "Sửa danh mục thất bại"
    //     })
    // }

    let oder = req.oder;
    oder = _.assignIn(oder, fields);

    oder.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Không sửa được oder",
        });
      }
      res.json(data);
    });
  });
};
export const readPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
