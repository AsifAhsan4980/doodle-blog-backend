import express from 'express'

import user from "../controllers/user.js"

const router = express.Router();

router.route('/:id')
    .get(user.getOneUser)

export default router