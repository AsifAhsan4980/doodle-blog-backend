import Blog from "../models/blog.js";
import Blogs from "../models/blog.js";
import lodash from 'lodash'

const addBlog = async (req, res) => {
    const {title, description, authorName} = req.body

    const blog = await Blog.create({
        title, authorName, description
    });


    res.status(200).send(blog)
}

const getBlog = async (req, res) => {
    const blogs = await Blogs.find()
    res.status(200).send(blogs)
}

const getOneBlog = async (req, res) => {
    const blogId = req.params.id
    const blog = await Blogs.findById(blogId);

    res.status(200).send(blog)
}

const updateBlog = async (req, res) => {
    const blogId = req.params.id
    const blog = await Blogs.findById(blogId);

    const updatedFields = lodash.pick(req.body, ['title', 'authorName', 'description']);
    lodash.assignIn(blog, updatedFields);

    blog.save()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

const updateComment = async (req, res) => {

    const blogId = req.params.id
    const blog = await Blogs.findById(blogId);
    const updatedFields = lodash.pick(req.body, [ 'description']);
    lodash.assignIn(blog, updatedFields);


    blog.save()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

export default {
    addBlog,
    getBlog,
    getOneBlog,
    updateBlog,
    updateComment
}