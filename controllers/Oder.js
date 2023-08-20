import Oder from "../modoles/Oder";
import _ from "lodash";
import formidable from "formidable";

export const create = (req, res) => {
  let oder = new Oder(req.body);

  oder.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: "Không thêm được sản phẩm",
      });
    }
    Oder.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sản phẩm";
      }
      return res.json(data);
    });
  });
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
      error: "Không tìm thấy sản phẩm";
    }
    res.json(data);
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
