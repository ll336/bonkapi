/* require('dotenv').config() */
var cors = require('cors')
const express = require('express')
const authRoutes = require("./routes/auth")
const app = express()



startServer()

   

async function startServer() {
    

    app.use(cors({origin: '*'}))
    app.use(express.json())
    app.set('trust proxy', 1)  

    app.use("/api/v1/", authRoutes);

    
  
    app.listen(process.env.PORT || 4000, () => {
        console.log('Server listening')
    })



}



