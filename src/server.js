import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

let app = express();

app.use(cors({origin: "http://localhost:3000", // Địa chỉ frontend 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//config app
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//
viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.port || 6969;
app.listen(port, () => {
    console.log("Backend nodejs is running on port: " + port)
})