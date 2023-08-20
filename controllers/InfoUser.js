import InfoUser from "../modoles/InfoUser";
import formidable from "formidable";
import _ from "lodash";

export const create = async (req, res) => {
  try {
    await InfoUser.create(req.body);
    InfoUser.find((err, data) => {
      if (err) {
        error: "Không tìm thấy thông tin";
      }
      return res.json(data);
    });
  } catch (error) {
    return res.status(400).json(error);
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

export const remove = async (req, res) => {
  try {
    await InfoUser.findByIdAndRemove(req.infoUser._id);
    InfoUser.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sản phẩm";
      }
      return res.json(data);
    });
  } catch (error) {
    return res.status(400).json(error);
  }

};

export const list = (req, res) => {
  InfoUser.find((err, data) => {
    if (err) {
      error: "Không tìm thấy thông tin";
    }
    res.json(data);
  });
};

export const update = async (req, res) => {
  try {
    const { _idUpload, _idInfoTrue } = req.body;
    await InfoUser.updateMany(
      {
        _id: { $in: _idUpload },
      },
      {
        $set: {
          status: true
        },
      }
    );
    if (_idInfoTrue !== undefined) {
      await InfoUser.updateMany(
        {
          _id: { $in: _idInfoTrue },
        },
        {
          $set: {
            status: false

          },
        }
      );
    }
    InfoUser.find((err, dataAll) => {
      if (err) {
        error: "Không tìm thấy sp oder";
      }
      return res.json(dataAll);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

