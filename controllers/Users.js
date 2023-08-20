import formidable from "formidable";
import _ from "lodash";
import User from "../modoles/Users";
const bcrypt = require("bcrypt");

export const listUser = (req, res) => {
    User.find((err, data) => {
        if (err) {
            res.status(400).json({
                err: " Không có tài khoản nào !",
            });
        }
        res.json(data);
    });
};
export const list = async (req, res) => {
    const user = await User.findOne({
        _id: req.params.userId,
    });
    return res.json(user);
};
export const userById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    });
};
export const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
};
export const update = async (req, res) => {
    await User.updateMany(
        {
            _id: { $in: req.body._id },
        },
        {
            $set: req.body,
        }
    );
    const user = await User.findOne({
        _id: req.body._id,
    });
    return res.json(user);
};

export const remove = (req, res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được sản phẩm",
            });
        }
        res.json({
            user,
            message: "Sản phẩm đã được xóa thành công",
        });
    });
};
export const checkEmailUpload = async (req, res, text) => {
    try {
        const { _id, email } = req.body;
        const user = await User.findOne({
            email: email,
        });
        if (user) {
            return res.json({ notification: 'Email đã sử dụng', status: true });
        } else {
            return res.json({ notification: 'Email hợp lệ', status: false });

        }
    } catch (error) {
        return res.status(400).json({
            error: 'Lỗi. Hãy thử lại'
        });
    }
};
export const uploadEmail = async (req, res) => {
    await User.updateMany(
        {
            _id: { $in: req.body._id },
        },
        {
            $set: {
                email: req.body.email,
            },
        }
    );

    const user = await User.findOne({
        _id: req.body._id,
    });
    return res.json(user);


}
export const uploadPassword = async (req, res) => {
    const { _id, current_password, newPassword, confirm } = req.body;
    const user = await User.findOne({
        _id: _id,
    });

    bcrypt.compare(
        current_password,
        user.hashed_password,
        function (error, result) {
            // hàm callback được gọi khi quá trình so sánh hoàn tất
            if (error) {
                return res.status(400).json({ error: "Lỗi 400" });
            } else if (result) {
                const saltRounds = 10; // số lần lặp lại để tạo salt
                bcrypt.hash(newPassword, saltRounds, async function (err, password) {
                    // hàm callback được gọi khi quá trình mã hóa hoàn tất
                    if (err) {
                        return res.json({ error: "Lỗi 400" });
                    } else {
                        await User.updateMany(
                            {
                                _id: { $in: _id },
                            },
                            {
                                $set: {
                                    hashed_password: password
                                },
                            }
                        );

                        return res.json({
                            susssuc: 'Cập nhật thành công'
                        });
                    }
                });
            } else {
                return res.json({
                    error: "Mật khẩu không khớp",
                });
            }
        }
    );
};
async function uploadImage(file) {

    const res = await axios({
        method: 'post',
        url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        headers: {
            Authorization: ``,
            'Content-Type': 'multipart/related',
        },
        data: {
            name: file.name,
            parents: ['1aW53XS6u__RLk_CJN5dtHAcnB7Ss-Vzu'],
        },
        transformRequest: [
            (data, headers) => {
                const formData = new FormData();
                formData.append('metadata', new Blob([JSON.stringify(data)], { type: 'application/json' }));
                formData.append('file', file);
                return formData;
            },
        ],
    });

    return `https://drive.google.com/uc?id=${res.data.id}`;
}