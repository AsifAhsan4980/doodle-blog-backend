import mongoose from 'mongoose'

const BlogsSchema = new mongoose.Schema({
        title: {
            type: String,
            required: [true, 'Please provide a title name'],
        },
        description: [{
            paragraph : {
                type: String,
                required: [true, 'Please provide a title name'],
            },
            comment : []
        }]
        ,
        authorName: {
            type: String,
            require : true
        },
        deleted: {
            type: Boolean,
            default: false,
            require : true
        }
    },

    {
        timestamps: true
    })

const Blogs = mongoose.model("Blogs", BlogsSchema)
export default Blogs
