import CommodityValue from "../modoles/CommodityValue";
import formidable from "formidable";
import _ from "lodash";
export const create = (req, res) => {
  let commodityvalue = new CommodityValue(req.body);
  commodityvalue.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Không thêm duoc tên loại sản phẩm",
      });
    }
    res.json(data);
  });
};

export const Id = (req, res, next, id) => {
    console.log(id)
  CommodityValue.findById(id).exec((err, commodityvalue) => {
    console.log(commodityvalue)
    if (err || !commodityvalue) {
      res.status(400).json({
        error: "Không tìm thấy tên loại sản phẩm",
      });
    }
    req.commodityvalue = commodityvalue;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.commodityvalue);
};

export const remove = (req, res) => {
  let commodityvalue = req.commodityvalue;
  commodityvalue.remove((err, commodityvalue) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được tên loại sản phẩm",
      });
    }
    res.json({
      commodityvalue,
      message: "tên loại sản phẩm đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  CommodityValue.find((error, data) => {
    if (error) {
      error: "Không tìm thấy tên loại sản phẩm";
    }
    res.json(data);
  });
};

export const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    let commodityvalue = req.commodityvalue;
    // const { name, condition, pro_id, quantity, price } = req.body;
    commodityvalue = _.assignIn(commodityvalue, fields);

    commodityvalue.save((err, data) => {
      if (err) {
        res.status(400).json({
          error: "Không sửa được tên loại sản phẩm",
        });
      }
      res.json(data);
    });
  });
};
