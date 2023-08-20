import express from 'express';
import { create, list, update, categoryById, read, remove } from '../controllers/Categoris';
import { isAdmin, isAuth, requireSignin } from './../controllers/Auth';
import Category from "../modoles/Categoris";
const router = express.Router();
import multer from "multer";
import fs from "fs";
import { google } from "googleapis";
import Users from "../modoles/Users";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(CLIENT_ID);
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REQUEST_URI = process.env.REQUEST_URI;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REQUEST_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
// single
const upload = multer({ storage: storage });

router.post("/categoris", upload.single("files"), async (req, res) => {
    function uploadFile(fileMetadata, media) {
        return new Promise((resolve, reject) => {
            drive.files.create(
                {
                    resource: fileMetadata,
                    media: media,
                    fields: "id",
                },
                (err, file) => {
                    if (err) {
                        reject(err);
                        return res.json({
                            message: "Lỗi không đăng ký được",
                            status: false,
                            data: undefined,
                        });
                    } else {
                        resolve(file.data.id); // Trả về ID file
                    }
                }
            );
        });
    }

    const fileMetadata = {
        name: req.file.originalname,
        parents: ["1pkm5iLbjdxDkRxUyu-ASEfL2FmYTQIjG"],
    };
    const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
    };
    try {
        const fileId = await uploadFile(fileMetadata, media);

        const newUser = {
            name: req.body.name,
            photo: `https://drive.google.com/uc?export=view&id=${fileId}`,
            image_id: fileId,
        };
        await Category.create(newUser)
        Category.find((err, data) => {
            if (err) {
                return res.json({
                    message: "Lỗi !",
                    status: false,
                    data: undefined,
                });
            }
            return res.json({
                message: 'Thêm thành công',
                data: data,
                status: true
            });
        });
    } catch (err) {
        return res.json({
            message: "Lỗi không thêm được !",
            status: false,
            data: undefined,
        });
    }
});
router.post("/categoris-upload", upload.single("files"), async (req, res) => {
    const { _id, name, image_id, files } = req.body;
    console.log(req.file, 'e3ewds')
    console.log(_id, name, image_id, files, '_id, name, image_id, files')
    try {
        const image = []
        function uploadFile(fileMetadata, media) {
            return new Promise((resolve, reject) => {
                drive.files.create(
                    {
                        resource: fileMetadata,
                        media: media,
                        fields: "id",
                    },
                    (err, file) => {
                        if (err) {
                            reject(err);
                            return res.json({
                                message: "Lỗi không đăng ký được",
                                status: false,
                                data: undefined,
                            });
                        } else {
                            resolve(file.data.id); // Trả về ID file
                        }
                    }
                );
            });
        }
        if (req.file !== undefined) {
            console.log('có vào')
            const fileMetadata = {
                name: req.file.originalname,
                parents: ["1pkm5iLbjdxDkRxUyu-ASEfL2FmYTQIjG"],
            };
            const media = {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path),
            };
            const fileId = await uploadFile(fileMetadata, media);
            image.push(fileId)
            await drive.files.delete({
                fileId: image_id
            })
        }
        console.log('vào đây1')
        if (image.length > 0 || req.file !== undefined || name) {
            console.log(req.file !== undefined ? '1' : '2')
            console.log('vào đây')
            console.log(image[0], 'image[0]')
            await Category.updateMany(
                {
                    _id: { $in: _id },
                },
                {
                    $set: req.file == undefined ?
                        {
                            name: name,
                        }
                        : {
                            name: name,
                            photo: `https://drive.google.com/uc?export=view&id=${image[0]}`,
                            image_id: image[0],
                        },
                }
            );
            Category.find((err, data) => {
                if (err) {
                    return res.json({
                        message: "Lỗi !",
                        status: false,
                        data: undefined,
                    });
                }
                return res.json({
                    message: 'Sửa thành công',
                    data: data,
                    status: true
                });
            });
        }

    } catch (err) {
        return res.json({
            message: "Lỗi không thêm được !",
            status: false,
            data: undefined,
        });
    }

});

router.get('/categoris', list);
router.get('/categoris/:categoryId', read);

router.put('/categoris/:categoryId', update);

router.post('/categoris-remove', async (req, res) => {
    try {
        const { _id, image_id } = req.body;
        await drive.files.delete({
            fileId: image_id
        })
        await Category.findByIdAndRemove(_id);

        Category.find((err, data) => {
            if (err) {
                return res.json(
                    {
                        message: 'Không có dữ liệu',
                        data: [],
                        status: false
                    }
                );
            }
            return res.json(
                {
                    message: 'Tải dữ liệu thành công',
                    data: data,
                    status: true
                }
            );
        });
    } catch (erorr) {
        return res.json({
            message: 'Xóa thất bại !',
            status: false
        });

    }

});

router.param('categoryId', categoryById);

module.exports = router;