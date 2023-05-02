const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { logger } = require("./middleware/logger");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use("/user",userRouter)


app.listen(process.env.PORT, async()=>{
    try {
        await connection()
        console.log("connected to db")
        logger.log("info","Database connected");
    } catch (error) {
        console.log(error);
        logger.log("info","Database connection failed");
    }
    console.log("server is running");
})

