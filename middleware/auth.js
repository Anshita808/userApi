const jwt = require("jsonwebtoken");
const { redisClient } = require("../helper/redis");

const authenticator = async(req,res,next)=>{
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(401).send({msg:"Please login again"});
        
        const isTokenValid = await jwt.verify(token, process.env.SECRET);

        if(!isTokenValid) return res.send("Autentication failed, please login again");

        const isTokenBlacklisted = await redisClient.get(token);

        if(isTokenBlacklisted) return res.send("Unauthorized");

        req.body.userId = isTokenValid.userId;
        next();

    } catch (error) {
        res.send(error.message);
    }
};

module.exports = {
    authenticator,
}