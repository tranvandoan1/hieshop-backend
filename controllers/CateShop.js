import CateShop from "../modoles/CateShop";
import _ from "lodash";
export const create = async (req, res) => {
  try {
    await CateShop.create(req.body);
    CateShop.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sản phẩm";
      }
      return res.json(data);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const Id = (req, res, next, id) => {
  CateShop.findById(id).exec((err, cateShop) => {
    if (err || !cateShop) {
      res.status(400).json({
        error: "Không tìm thấy Danh muc",
      });
    }
    req.cateShop = cateShop;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.cateShop);
};

export const remove = (req, res) => {
  let cateShop = req.cateShop;
  cateShop.remove((err, cateShop) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được Danh muc",
      });
    }
    CateShop.find((error, data) => {
      if (error) {
        error: "Không tìm thấy Danh muc";
      }
      return res.json(data);
    });
  });
};

export const list = (req, res) => {
  CateShop.find((error, data) => {
    if (error) {
      error: "Không tìm thấy Danh muc";
    }
    res.json(data);
  });
};

export const update = async (req, res) => {
  try {
    const { _id, data } = req.body;
    await CateShop.updateMany(
      {
        _id: { $in: _id },
      },
      {
        $set: {
          categorie_id: data.categorie_id,
          name: data.name
        },
      }
    );

    CateShop.find((err, dataAll) => {
      if (err) {
        error: "Không tìm thấy danh mục của shop";
      }
      return res.json(dataAll);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
