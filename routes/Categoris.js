import express from 'express';
import { create, list, update, categoryById, read, remove } from '../controllers/Categoris';
import { isAdmin, isAuth, requireSignin } from './../controllers/Auth';
const router = express.Router();
import multer from "multer";
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
// single
const upload = multer({ storage: storage });
cloudinary.config({
    cloud_name: 'ddnkbpdzs',
    api_key: '665144417678677',
    api_secret: 'qKRYqgMn8iBBpb77LU4dxm1HpVQ'
});

router.post("/categoris", upload.single("files"), create);
router.post("/categoris-upload", upload.single("files"),update);

router.get('/categoris', list);
router.get('/categoris/:categoryId', read);

router.put('/categoris/:categoryId', update);

router.post('/categoris-remove', remove);

router.param('categoryId', categoryById);

module.exports = router;