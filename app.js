import cors from "cors";
import express from "express";
import bodyparser from "body-parser";
import passport from "passport";
import errorHandler from "./middlewares/error.js";

//routes import

import blogRoutes from './routes/blogRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testApiRoutes from "./routes/testApiRoutes.js";
import dummy from './routes/dummy.js'
import recurring from "./routes/recurring.js";
import card from "./routes/card.js";
import url from "./routes/url.js";



//cors setup
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

//express setup
const app = express()
app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

app.use(passport.initialize(undefined));



app.use(errorHandler);


//api
app.use('/media/img/',express.static('media/img'));
app.use('/blog', blogRoutes)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/test/fiserv/', testApiRoutes)
app.use('/test/fiserv/recurring/', recurring)
app.use('/test/fiserv/card/', card)
app.use('/test/fiserv/url/', url)

export default app