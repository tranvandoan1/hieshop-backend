import Category from "../modoles/Categoris";
import _ from "lodash";
import formidable from "formidable";
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

export const create = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Bạn cần nhập đầy đủ thông tin",
    });
  }

  let category = new Category(req.body);

  category.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Không thêm duoc danh muc",
      });
    }
    res.json(data);
  });
};

export const categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "Không tìm thấy Danh muc",
      });
    }
    req.category = category;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.category);
};
const removeImage = (async item => {
  console.log(item, 'e3wfded')
  await drive.files.delete({
    fileId: item
  })
  console.log(item, '1212312')
})
export const remove = async (req, res) => {
  try {
    const { _id, image_id } = req.body;
    await drive.files.delete({
      fileId: image_id
    })
    await Category.findByIdAndRemove(_id);

    Category.find((err, data) => {
      if (err) {
        return res.json(
          {
            message: 'Không có dữ liệu',
            data: [],
            status: false
          }
        );
      }
      return res.json(
        {
          message: 'Tải dữ liệu thành công',
          data: data,
          status: true
        }
      );
    });
  } catch (erorr) {
    return res.json({
      message: 'Xóa thất bại !',
      status: false
    });

  }
};

export const list = (req, res) => {
  Category.find((error, data) => {
    if (error) {
      error: "Không tìm thấy Danh muc";
    }
    return res.json({
      message: 'Tải dữ liệu thành công',
      data: data,
      status: true,
      getdata: true
    });
  });
};

export const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let cate = req.category;

    cate = _.assignIn(cate, fields);

    cate.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Không sửa được danh mục",
        });
      }
      res.json(data);
    });
  });
};
