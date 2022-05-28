import cors from "cors";
import express from "express";
import bodyparser from "body-parser";
import passport from "passport";
import errorHandler from "./middlewares/error.js";

//routes import

import blogRoutes from './routes/blogRoutes.js'



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

export default app