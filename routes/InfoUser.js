import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/InfoUser';
const router = express.Router();

router.post('/info-user', create);

router.get('/info-user', list);
router.get('/info-user/:id', read);

router.post('/info-user-upload-addres', update);

router.delete('/info-user/:id', remove);

router.param('id', Id);


module.exports = router;