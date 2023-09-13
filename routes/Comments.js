import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/Comments';
const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
const upload = multer({ storage: storage });

router.post('/comments-add', upload.array("files"), create);
router.post('/comments-upload', upload.array("files"), update);

router.get('/comments', list);
router.get('/comments/:id', read);


router.post('/comments-remove', remove);

router.param('id', Id);


module.exports = router;