import express from "express";
import {
  create,
  list,
  update,
  Id,
  readPhoto,
  read,
  remove,
} from "../controllers/ImagePro";
const router = express.Router();

router.post("/image-pro", create);

router.get("/image-pro", list);
router.get("/image-pro/:Id", read);
// router.get('/product/photo/:productId', readPhoto);

router.put("/image-pro/:Id", update);

router.delete("/image-pro/:Id", remove);

router.param("Id", Id);

module.exports = router;
