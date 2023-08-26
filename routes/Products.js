import express from "express";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';
          

import Product from "../modoles/Products";
import Classification from "../modoles/Classification";
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

import {
    list,
    update,
    productById,
    create,
    read,
    remove,
    removes,
} from "../controllers/Products";
const router = express.Router();

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
const upload = multer({ storage: storage });
// single
router.post("/products-add", upload.array("files"),create);
router.post("/product-upload", upload.array("files"),update);

router.get("/get-products", list);
router.get("/products/:productId", read);
// router.get('/product/photo/:productId', readPhoto);


router.post("/products-remove", remove);
router.post("/products-removes", removes);

router.param("productId", productById);

module.exports = router;
// https://drive.google.com/uc?export=view&id=1HoUAvDU1B_PVl2ngAgYlQcjdvUT7Sy5C
