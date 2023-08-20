import express from 'express';
import { create, list, update, Id, readPhoto, read, remove } from '../controllers/TypeGroupName';
const router = express.Router();

router.post('/type-group-name', create);

router.get('/type-group-name', list);
router.get('/type-group-name/:Id', read);
// router.get('/product/photo/:productId', readPhoto);

router.put('/type-group-name/:Id', update);

router.delete('/type-group-name/:Id', remove);

router.param('Id', Id);


module.exports = router;