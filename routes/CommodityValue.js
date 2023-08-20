import express from "express";
import {
  create,
  list,
  update,
  Id,
  readPhoto,
  read,
  remove,
} from "../controllers/CommodityValue";
const router = express.Router();

router.post("/commodityalue", create);

router.get("/commodityalue", list);
router.get("/commodityalue/:Id", read);
// router.get('/product/photo/:productId', readPhoto);

router.put("/commodityalue/:Id", update);

router.delete("/commodityalue/:Id", remove);

router.param("Id", Id);

module.exports = router;
