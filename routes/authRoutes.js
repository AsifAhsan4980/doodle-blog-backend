import express from 'express'

import auth from "../controllers/auth.js"

const router = express.Router();

router.route('/')
    .post(auth.login)
router.route('/register/')
    .post(auth.register)

export default router