import OderDetail from "../modoles/OderDetail";
import _ from "lodash";

export const create = (req, res) => {
  let oderdetail = new OderDetail(req.body);
  oderdetail.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: "Không thêm được sản phẩm",
      });
    }
    OderDetail.find((err, data) => {
      if (err) {
        error: "Không tìm thấy sản phẩm";
      }
      return res.json(data);
    });
  });
};
// User.findOne({ _id }, async (error, user) => {
//   console.log('Vào 1')
//   try {
//     if (user.authenticate(current_password) == false) {
//       console.log('Vào 2')
//       return res.json({ error: 'Mật khẩu không đúng !' })
//     } else {
//       console.log('Vào 3')

//       await User.updateMany(
//         {
//           _id: { $in: _id },
//         },
//         {
//           $set: { ...user, hashed_password: user.encrytPassword(password) },
//         }
//       );
  
//       return res.json({susssuc:'Thay đổi thành công'})
//     }
//   } catch (error) {
//     console.log('lỗi', error)
//     return res.status(400).json(error);
//   }

//   // salt: 'd0fb87b0-ed29-11ec-86b8-351cb2e74ed6',
//   // hashed_password: 'e4d486d16bc4bf4a334054b6aeb80fea05ba58fb',
// });
export const Id = (req, res, next, id) => {
  OderDetail.findById(id).exec((err, oderdetail) => {
    if (err || !oderdetail) {
      res.status(400).json({
        error: "Không tìm thấy sản phẩm",
      });
    }
    req.oderdetail = oderdetail;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.oderdetail);
};

export const remove = (req, res) => {
  let oderdetail = req.oderdetail;
  oderdetail.remove((err, oder) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được sản phẩm",
      });
    }
    res.json({
      oderdetail,
      message: "Sản phẩm đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  OderDetail.find((err, data) => {
    if (err) {
      error: "Không tìm thấy sản phẩm";
    }
    res.json(data);
  });
};
