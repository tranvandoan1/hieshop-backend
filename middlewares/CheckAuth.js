const jwt = require("jsonwebtoken");
import User from '../modoles/Users';

export const isAuthenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const accessToken = (req.body.check == 1||req.body.check == 2) ? req.body.token : (authHeader && authHeader.split(" ")[1]);
    if (!accessToken) {
      return res.status(401).json({ message: "Vui lòng đăng nhập tài khoản" });
    }
    const userToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: userToken._id,
    });
    (user.role == 0 || req.body.check == 1 || req.body.check == 2)
      ? next()
      : res.status(401).json({
        msg: "Không có quyền truy cập",
      });
  } catch (error) {
    res.json({
      message: error,
      error: "Lỗi ",
    });
  }
};
