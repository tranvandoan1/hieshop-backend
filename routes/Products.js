import express from "express";
import multer from "multer";
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
