import express from "express"
import dotenv from "dotenv"
import userrouter from "./routes/userRoutes"
import postrouter from "./routes/postRoutes" 
import likerouter from "./routes/likeRoutes"
import commentrouter from "./routes/commnetsRoutes"
dotenv.config()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT=6001



app.get("/get",(req,res)=>{
    res.send("Hello this is form server")
})


app.use("/user",userrouter)
app.use("/post",postrouter)
app.use("/like",likerouter)
app.use("/comments",commentrouter)


app.listen(PORT,()=>{
    console.log(`server is running on the ${PORT}`)
})