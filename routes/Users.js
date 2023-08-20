import express from "express";
const router = express.Router();

import {
    userById,
    list,
    remove,
    read,
    update,
    uploadEmail,
    checkEmailUpload,
    uploadPassword,
} from "../controllers/Users";
import { requireSignin, isAdmin, isAuth } from "../controllers/auth";
import { isAuthenticateUser } from "../middlewares/CheckAuth";
import fs from "fs";
import multer from "multer";
import { google } from "googleapis";
import User from "../modoles/Users";

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
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});
// router.get('/get-user/:userId', isAuthenticateUser, listUser)
router.get("/user/:userId", read);
const upload = multer({ storage: storage });
router.post("/upload-user", upload.single("files"), async (req, res) => {
    const fileIds = []; // Khởi tạo mảng rỗng để lưu trữ các ID file
    if (req.file !== undefined) {
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
                        } else {
                            resolve(file.data.id); // Trả về ID file
                        }
                    }
                );
            });
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: ["1FZEPgDbFpqLjI-lzLtsL-om92FoXCG3z"],
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        try {
            const fileId = await uploadFile(fileMetadata, media);
            fileIds.push(fileId); // Thêm ID file vào mảng
            await drive.files.delete({
                fileId: req.body.image_id
            })
        } catch (err) {
            console.error(err);
        }
    }

    if (fileIds.length > 0 || req.body.name || req.body.name == undefined) {
        console.log("3e2wrew");
        try {
            await User.updateMany(
                {
                    _id: { $in: req.body._id },
                },
                {
                    $set:
                        req.body.name && fileIds.length <= 0
                            ? {
                                name: req.body.name,
                            }
                            : req.body.name && fileIds.length > 0
                                ? {
                                    avatar: `https://drive.google.com/uc?export=view&id=${fileIds[0]}`,
                                    image_id: fileIds[0],
                                    name: req.body.name,
                                }
                                : {
                                    avatar: `https://drive.google.com/uc?export=view&id=${fileIds[0]}`,
                                    image_id: fileIds[0],
                                },
                }
            );

            const user = await User.findOne({
                _id: req.body._id,
            });

            return res.json(user);
        } catch (err) {
            console.error(err);
        }
    }
});
router.get("/get-user/:userId", list);
router.delete("/user/:userId", remove);

router.post("/upload/email", uploadEmail);
router.post("/user/upload/password", uploadPassword);

// kiểm tra email thay đổi có đúng và đã tồn tại chưa
router.post("/check-email-upload", checkEmailUpload);

router.param("userId", userById);

module.exports = router;
