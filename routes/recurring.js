import express from 'express'

import Recurring from "../controllers/recurring.js"

const router = express.Router();

router.route('/')
    .post(Recurring.recurringPost)
router.route('/:id')
    .get(Recurring.getOrder)
    .patch(Recurring.patchOrder)
    .delete(Recurring.deleteOrder)


export default router