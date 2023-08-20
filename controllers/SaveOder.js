import Saveoder from "../modoles/SaveOder";
import _ from "lodash";
import formidable from "formidable";
import { ObjectID } from "mongodb";

export const create = async (req, res) => {
  try {
    await Saveoder.create(req.body);
    Saveoder.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sản phẩm";
      }
      return res.json(data);
    });
  } catch (error) {
    return res.status(400).json(error);
  }

};

export const saveoderId = (req, res, next, id) => {
  Saveoder.findById(id).exec((err, saveoder) => {
    if (err || !saveoder) {
      res.status(400).json({
        error: "Không tìm thấy sp oder",
      });
    }
    req.saveoder = saveoder;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.saveoder);
};

export const remove =async (req, res) => {
  let saveoder = req.saveoder;
  console.log(saveoder,'saveoder')
  // await Product.findByIdAndRemove(req.params.productId);
  // Saveoder.find((err, dataAll) => {
  //   console.log(dataAll.length, "sau");

  //   return res.json(dataAll);
  // });
};
export const removes = async (req, res) => {
  try {

    let id = req.body;
    for (let i = 0; i < id.length; i++) {
      id[i] = ObjectID(id[i]);
    }
    await Saveoder.deleteMany({ _id: { $in: id } });
    Saveoder.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sp oder";
      }
      return res.json(data);
    });
  } catch (error) {
    return res.status(400).json(error);
  }

};

export const list = (req, res) => {
  Saveoder.find((err, data) => {
    if (err) {
      error: "Không tìm thấy sp oder";
    }
    return res.json(data);
  });
};

export const update = async (req, res) => {
  try {
    const { _id, amount } = req.body;
    await Saveoder.updateMany(
      {
        _id: { $in: _id },
      },
      {
        $set: {
          amount: amount,
        },
      }
    );

    Saveoder.find((err, dataAll) => {
      if (err) {
        error: "Không tìm thấy sp oder";
      }
      return res.json(dataAll);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const updateProOrder = async (req, res) => {
  try {
    const { _id, data } = req.body;
    await Saveoder.updateMany(
      {
        _id: { $in: _id },
      },
      {
        $set: {
          commodity_value: data.commodity_value,
          commodity_value_id: data.commodity_value_id,
          classification: data.classification,
          classification_id: data.classification_id,
        },
      }
    );

    Saveoder.find((err, dataAll) => {
      if (err) {
        error: "Không tìm thấy sp oder";
      }
      return res.json(dataAll);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const uploadSaveOrders = async (req, res) => {
  const { idSelect, check } = req.body;
  const listIdStudents = await idSelect.map((id) => ObjectID(id));

  await Saveoder.updateMany(
    {
      _id: { $in: listIdStudents },
    },
    {
      $set: {
        check: check,
      },
    }
  );

  Saveoder.find((err, dataAll) => {
    if (err) {
      error: "Không tìm thấy sp oder";
    }
    return res.json(dataAll);
  });
};
