import  Auth from "../models/Auth.js";

const getOneUser = async (req, res) => {

    const userId = req.params.id
    const user = await Auth.findById(userId);
    res.status(200).send(user)
}

export default {
    getOneUser
}