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
router.post("/products", upload.array("files"),create);
router.post("/product-upload", upload.array("files"), async (req, res) => {
    try {

        const files = req.files
        const data = JSON.parse(req.body.data);
        console.log(data, '2e32dwclassifies')
        const classifiesTrue = data.classifies.filter(item => item.status == true)


        // dataDeleteImage.map(async item => {
        //     await drive.files.delete({
        //         fileId: item.image_id
        //     })
        // })
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
        console.log('chạy đến 1')
        for (let i = 0; i < req.files.length; i++) {
            const fileMetadata = {
                name: req.files[i].originalname,
                parents: ["1EyKKEdSRkiHmSiKUzmPsb2WXDSU1YCtL"],
            };
            const media = {
                mimeType: req.files[i].mimeType,
                body: fs.createReadStream(req.files[i].path),
            };
            try {
                const fileId = await uploadFile(fileMetadata, media);
                fileIds.push(fileId); // Thêm ID file vào mảng
            } catch (err) {
                console.error(err);
            }
        }
        console.log('chạy đến 2')
        if (fileIds.length > 0) {
            const product = [];
            const classifies = [];
            for (let i = 0; i < fileIds.length; i++) {
                console.log('chạy đến 3')
                if (data.product[0].status == true) {
                    if (i == 0) {
                        product.push({
                            ...data.product[0],
                            photo: `https://drive.google.com/uc?export=view&id=${fileIds[0]}`,
                            image_id: fileIds[0]
                        });
                    } else {
                        classifies.push({
                            ...classifiesTrue[i - 1],
                            image_id: i !== 0 && fileIds[i],
                            photo: `https://drive.google.com/uc?export=view&id=${i !== 0 && fileIds[i]
                                }`,
                        })

                    }
                } else {
                    classifies.push({
                        ...data.classifies[i - 1],
                        image_id: i !== 0 && fileIds[i],
                        photo: `https://drive.google.com/uc?export=view&id=${i !== 0 && fileIds[i]
                            }`,
                    })

                }
            }


            console.log(classifies, 'classifies')
            console.log(product, 'product')
            console.log(product.photo, 'product.photo')
            console.log({
                image_id: product[0].image_id,
                photo: product[0].photo,
                name: product[0].name,
                sale: product[0].sale,
                name_classification: product[0].name_classification,
                name_commodityvalue: product[0].name_commodityvalue,
                cate_id: product[0].cate_id,
                description: product[0].description,
                origin: product[0].origin,
                sent_from: product[0].sent_from,
                trademark: product[0].trademark,
                warehouse: product[0].warehouse
            }, 'e3wfd')
            // await Product.updateMany(
            //     {
            //         _id: { $in: product[0]._id },
            //     },
            //     {
            //         $set: {
            //             image_id: product[0].image_id,
            //             photo: product[0].photo,
            //             name: product[0].name,
            //             sale: product[0].sale,
            //             name_classification: product[0].name_classification,
            //             name_commodityvalue: product[0].name_commodityvalue,
            //             cate_id: product[0].cate_id,
            //             description: product[0].description,
            //             origin: product[0].origin,
            //             sent_from: product[0].sent_from,
            //             trademark: product[0].trademark,
            //             warehouse: product[0].warehouse

            //         },
            //     }
            // )

            // classifies.map(async (item) =>
            //     console.log(item.photo, 'item.photo'),
            //     await Classification.updateMany(
            //         {
            //             _id: { $in: item._id },
            //         },
            //         {
            //             $set: {
            //                 image_id: item.image_id,
            //                 photo: item.photo,
            //                 quantity: item.quantity,
            //                 price: item.price,
            //                 indexNumber: item.indexNumber,
            //                 values: item.values,
            //                 name: item.name

            //             },
            //         }
            //     )
            // )
            // Product.find((err, data) => {
            //     if (err) {
            //         error: "Không tìm thấy sản phẩm";
            //     }
            //     return res.json(data);
            // });
        }
    } catch (error) {
        return res.json({ error: 'Không sửa được' });
    }

});

router.get("/get-products", list);
router.get("/products/:productId", read);
// router.get('/product/photo/:productId', readPhoto);


router.post("/products-remove", remove);
router.post("/products-removes", removes);

router.param("productId", productById);

module.exports = router;
// https://drive.google.com/uc?export=view&id=1HoUAvDU1B_PVl2ngAgYlQcjdvUT7Sy5C
