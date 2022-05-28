import mongoose from "mongoose"

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION_AUTH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  }, err => console.log());


};




export default connectDB;