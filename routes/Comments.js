import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/Comments';
const router = express.Router();

router.post('/comments', create);

router.get('/comments', list);
router.get('/comments/:id', read);

router.put('/comments/:id', update);

router.delete('/comments/:id', remove);

router.param('id', Id);


module.exports = router;