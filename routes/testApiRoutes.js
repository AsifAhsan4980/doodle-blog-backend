import express from 'express'

import All from "../controllers/testApi.js"

const router = express.Router();

router.route('/')
    .post(All.verifyUser)
router.route('/:TransactionId')
    .patch(All.patchUser)
router.route('/3ds/:id')
    .post(All.TreeDS)
router.route('/:TransactionId')
    .get(All.getData)
router.route('/recurring/')
    .post(All.recurringPost)
router.route('/data/')
    .post(All.recurringPost)

export default router