import express from 'express'

import blog from "../controllers/blog.js"

const router = express.Router();

router.route('/')
    .post(blog.addBlog)
    .get(blog.getBlog)
router.route('/:id')
    .put(blog.updateBlog)
    .get(blog.getOneBlog)
router.route('/addComment/:id/').put(blog.updateComment)

export default router