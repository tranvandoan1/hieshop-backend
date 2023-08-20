import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/Contacts';
const router = express.Router();

router.post('/contact', create);
router.get('/contact', list);
router.get('/contact/:id', read);

// router.put('/contact/:id', update);

router.delete('/contact/:id', remove);

router.param('id', Id);

module.exports = router;