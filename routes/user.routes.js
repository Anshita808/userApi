const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {redisClient} = require("../helper/redis");
const userRouter = express.Router();


userRouter.post("/register", async(req,res)=>{
    try {
        const { name, email, password } = req.body;

        const isUserPresent = await UserModel.findOne({email});
        if(isUserPresent){
            return res.status(401).send("user already register");
        }
        const hashed = await bcrypt.hashed(password,8);

        const newUser = new UserModel({name,email,password:hashed});

        await newUser.save();
        res.status(200).send("register successfull")

    } catch (error) {
        res.status(400).send(error);
    }
})

userRouter.post("/login", async(req,res)=>{
    try {
        const {email, password} = req.body;
        const isUserPresent = await UserModel.findOne({email});
        if(!isUserPresent){
            return res.status(401).send({msg:"user is not present"});
        }
        const isPassword = await bcrypt.compare(password,isUserPresent.password);

        if(!isPassword){
            res.send({msg:"Wrong Credentials.."})}

        const token = await jwt.sign({
            userId:isUserPresent._id
        },process.env.SECRET,{expiresIn:"1hr"})
        res.send({msg:"login Successfully", token})

    } catch (error) {
        res.status(401).send(error.message)
    }
})

// logout 
 userRouter.post("/logout", async(req,res)=>{
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(403);
        await redisClient.set(token,token,{EX:30})
        res.send({msg:"Logout Sucess"});
    } catch (error) {
        res.send(error.message)
    }
 })

module.exports = {
    userRouter
}