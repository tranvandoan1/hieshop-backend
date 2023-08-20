import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/ShopOwner';
import ShopOwner from '../modoles/ShopOwner';
import multer from 'multer';
import fs from "fs";
import { google } from 'googleapis';
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

const router = express.Router();
// const upload = multer({ dest: 'uploads/' });
router.post('/shopowner-add', upload.single("files"), async (req, res) => {
    const fileIds = []; // Khởi tạo mảng rỗng để lưu trữ các ID file
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
        parents: ["1hFZCESvr8P-RaVX1q2IlvYkabBk2f2O_"],
    };
    const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
    };
    try {
        const fileId = await uploadFile(fileMetadata, media);
        fileIds.push(fileId); // Thêm ID file vào mảng
    } catch (err) {
        console.error(err);
    }

    try {
        const product = {
            name: req.body.name,
            photo: `https://drive.google.com/uc?export=view&id=${fileIds[0]}`,
            image_id: fileIds[0],
            user_id: req.body.user_id

        }
        const data = await ShopOwner.create(product);
        console.log(data,'data')
        return res.json(data);

    } catch (error) {
        return res.json({ error: 'Không thêm được' });
    }

});
router.get('/shopowner', list);
router.get('/shopowner/:Id', read);

router.put('/shopowner/:Id', update);

router.delete('/shopowner/:Id', remove);

router.param('Id', Id);

module.exports = router;