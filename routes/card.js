import express from 'express'

import Card from "../controllers/cardInfo.js"

const router = express.Router();

router.route('/')
    .post(Card.setCard)
router.route('/:id')
    .get(Card.getCard)
    .patch(Card.updateCard)
    .delete(Card.deleteCard)


export default router