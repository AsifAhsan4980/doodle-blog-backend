import express from 'express'

import Recurring from "../controllers/paymentUrl.js"

const router = express.Router();

router.route('/')
    .post(Recurring.post)
router.route('/:id')
    .get(Recurring.get)
    .delete(Recurring.deletes)
router.route('/conversion')
    .post(Recurring.conversion)



export default router