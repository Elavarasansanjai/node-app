const express                   =  require('express')
const app                       =  express()
const bodyParser                =  require("body-parser")
//config env file
require('dotenv').config()
const router                    = require("./routes/api.router")
const cors                      = require("cors")
const PORT                      = process.env.PORT || 5000

//db connect 
require("./config/dbConnect")
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app router
app.use(cors())
app.use("/api",router)
app.listen(PORT ,()=>{
    console.log("listen on port 5000")
})
