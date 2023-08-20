import ImagePro from "../modoles/ImagePro";

import formidable from "formidable";
import _, { filter } from "lodash";

export const create = (req, res, next) => {
  let imagePro = new ImagePro(req.body);

  imagePro.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: "Không thêm được ảnh",
      });
    }
    res.json(data);
  });
};

export const Id = (req, res, next, id) => {
  ImagePro.findById(id).exec((err, imagePro) => {
    if (err || !imagePro) {
      res.status(400).json({
        error: "Không tìm thấy ảnh",
      });
    }
    req.imagePro = imagePro;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.imagePro);
};

export const remove = (req, res) => {
  let imagePro = req.imagePro;
  imagePro.remove((err, imagePro) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được ảnh",
      });
    }
    res.json({
      imagePro,
      message: "Ảnh đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  ImagePro.find((err, data) => {
    if (err) {
      error: "Không tìm thấy ảnh";
    }
    res.json(data);
  });
};

export const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let imagePro = req.imagePro;
    imagePro = _.assignIn(imagePro, fields);

    imagePro.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Không sửa được ảnh",
        });
      }
      res.json(data);
    });
  });
};
