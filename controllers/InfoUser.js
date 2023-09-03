import InfoUser from "../modoles/InfoUser";
import formidable from "formidable";
import _ from "lodash";

export const create = async (req, res) => {
  try {
    await InfoUser.create(req.body);
    InfoUser.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không tìm thấy thông tin",
          data: data,
          status: true,
        });
      }
      return res.json({
        message: "Thêm địa chỉ thành công",
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
  InfoUser.findById(id).exec((err, infoUser) => {
    if (err || !infoUser) {
      res.status(400).json({
        error: "Không tìm thấy thông tin người dùng",
      });
    }
    req.infoUser = infoUser;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.infoUser);
};

export const removeAdress = async (req, res) => {
  try {
    await InfoUser.findByIdAndRemove(req.body._id);
    InfoUser.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không tìm thấy thông tin",
          data: data,
          status: true,
        });
      }
      return res.json({
        message: "Thêm địa chỉ thành công",
        data: data,
        status: true,
      });
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const list = (req, res) => {
  InfoUser.find((err, data) => {
    if (err) {
      return res.json({
        message: "Không tìm thấy thông tin",
        data: data,
        status: true,
      });
    }
    return res.json({
      message: "Thêm địa chỉ thành công",
      data: data,
      status: true,
    });
  });
};
// sửa địa chỉ mặc định
export const updateAdress = async (req, res) => {
  try {
    const { _idInfoFalse, _idInfoTrue } = req.body;
    await InfoUser.updateMany(
      {
        _id: { $in: _idInfoTrue },
      },
      {
        $set: {
          status: true
        },
      }
    );
    await InfoUser.updateMany(
      {
        _id: { $in: _idInfoFalse },
      },
      {
        $set: {
          status: false

        },
      }
    );
    InfoUser.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không tìm thấy thông tin",
          data: data,
          status: true,
        });
      }
      return res.json({
        message: "Thêm địa chỉ thành công",
        data: data,
        status: true,
      });
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};


// sửa địa chỉ mặc định
export const updateInfoAdress = async (req, res) => {
  try {
    const { _id, data } = req.body;
    await InfoUser.updateMany(
      {
        _id: { $in: _id },
      },
      {
        $set: data,
      }
    );
   
    InfoUser.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không tìm thấy thông tin",
          data: data,
          status: true,
        });
      }
      return res.json({
        message: "Thêm địa chỉ thành công",
        data: data,
        status: true,
      });
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

