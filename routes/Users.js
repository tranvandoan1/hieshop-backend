import express from "express";
const router = express.Router();

import {
    userById,
    list,
    remove,
    read,
    forgotPassword,
    uploadEmail,
    checkEmailUpload,
    uploadPassword,
    listAll,
    updateAdmin,
    updateUser
} from "../controllers/Users";
import { requireSignin, isAdmin, isAuth } from "../controllers/Auth";
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
router.get("/user/:userId", read);
router.get("/get-user-all", isAuthenticateUser, listAll);
router.post("/select-shop", isAuthenticateUser, listAll);
const upload = multer({ storage: storage });
router.post("/upload-admin", upload.array("files"), updateAdmin);
// chưa dùng
router.post("/upload-user", upload.single("files"), updateUser);
router.get("/get-user/:userId", list);
router.delete("/user/:userId", remove);

router.post("/upload/email", uploadEmail);
router.post("/forgot-password", forgotPassword);
router.post("/user/upload/password", uploadPassword);
// chưa dùng
// kiểm tra email thay đổi có đúng và đã tồn tại chưa
router.post("/check-email-upload", checkEmailUpload);

router.param("userId", userById);

module.exports = router;
