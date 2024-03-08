import Comments from "../modoles/Comments";
const cloudinary = require("cloudinary").v2;
import _ from "lodash";


async function imageAdd(imageData) {
  const fileIds = [];
  function uploadFile(fileMetadata, media) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileMetadata,
        { folder: "comments" },
        async function (error, result) {
          if (error) {
            return ({
              message: "Không thêm được ảnh. Xin thử lại !",
              data: [],
              status: false,
            });
          } else {
            resolve({
              image_id: result.public_id,
              photo: result.url,
            }); // Trả về ID file
          }
        }
      );
    });
  }
  for (let i = 0; i < imageData.length; i++) {
    try {
      const fileId = await uploadFile(imageData[i].path);
      fileIds.push(fileId); // Thêm ID file vào mảng
    } catch (err) {
      return ({
        message: "Không thêm được ảnh. Xin thử lại !",
        data: [],
        status: false,

      });
    }
  }
  return fileIds
}



export const create = async (req, res) => {
  const fileIds = [];
  if (req.files.length > 0) {
    const dataImage=await imageAdd(req.files)
    fileIds.push(...dataImage); // Thêm ID file vào mảng
  }

  if (fileIds.length > 0 || req.files.length <= 0) {
    try {
      const newComment = {
        ...req.body,
        photo: req.files.length <= 0 ? [] : fileIds,
      };
      await Comments.create(newComment);
      Comments.find((err, data) => {
        if (err) {
          return res.json({
            message: "Không tìm thấy bình luận",
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
  }
};

export const Id = (req, res, next, id) => {
  Comments.findById(id).exec((err, comment) => {
    if (err || !comment) {
      res.status(400).json({
        error: "Không tìm thấy comments",
      });
    }
    req.comment = comment;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.comment);
};

export const remove = async (req, res) => {
  try {
    if (req.body.photo.length > 0) {
      for (let i = 0; i < req.body.photo.length; i++) {
        cloudinary.uploader.destroy(req.body.photo[i].image_id);
      }
    }

    await Comments.findByIdAndRemove(req.body._id);
    Comments.find((err, data) => {
      if (err) {
        return res.json({
          message: "Không có dữ liệu",
          data: [],
          status: false,
        });
      }
      return res.json({
        message: "Tải dữ liệu thành công",
        data: data,
        status: true,
      });
    });
  } catch (erorr) {
    return res.json({
      message: "Xóa thất bại !",
      status: false,
    });
  }
};

export const list = (req, res) => {
  Comments.find((err, data) => {
    if (err) {
      return res.json({
        message: "Không tìm thấy bình luận",
        data: "data",
        status: 1,
      });
    }
    return res.json({
      message: "Lấy dữ liệu thành công",
      data: data,
      status: 1,
    });
  });
};

export const update = async (req, res) => {
  const { _id, value, image } = req.body
  const originalImage = []
  const removeImage = []
  JSON.parse(image).map(item => {
    if (item.check == 1) {
      originalImage.push({ image_id: item.image_id, photo: item.photo })
    } else if (item.check = 'remove' && item.photo !== undefined) {
      removeImage.push({ image_id: item.image_id, photo: item.photo })

    }
  })
  const fileIds = [];
  if (req.files.length > 0) {
    const dataImage=await imageAdd(req.files)
    fileIds.push(...dataImage); // Thêm ID file vào mảng
  }

  
  if (req.files.length > 0 ? fileIds.length > 0 : (fileIds.length > 0 || value)) {
    if (removeImage.length > 0) {
      for (let i = 0; i < removeImage.length; i++) {
        cloudinary.uploader.destroy(removeImage[i].image_id);
      }
    }
    const newImage = [...originalImage, ...fileIds]
    try {
      await Comments.updateMany(
        {
          _id: { $in: _id },
        },
        {
          $set: {
            comment: value,
            photo: newImage
          },
        }
      );
      Comments.find((err, data) => {
        if (err) {
          return res.json({
            message: "Không tìm thấy bình luận",
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
  }
};
