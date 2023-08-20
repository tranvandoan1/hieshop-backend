import express from 'express';
import { create, list, update, Id, readPhoto, read, removes } from '../controllers/classification';
const router = express.Router();

router.post('/classifies', create);

router.get('/classifies', list);
router.get('/classifies/:id', read);
// router.get('/product/photo/:productId', readPhoto);

router.put('/classifies/:id', update);

router.post('/removes-classifies', removes);

router.param('id', Id);


module.exports = router;