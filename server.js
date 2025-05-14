import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine.js";
import initWebRoutes from "./route/web.js";
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

const port = process.env.PORT || 4000 
if (!port) {
    console.error("❌ PORT is not defined in environment variables.");
    process.exit(1);
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
