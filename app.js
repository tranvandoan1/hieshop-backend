import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import expressValidator from "express-validator";
import cors from "cors";
import categoryRoutes from "./routes/Categoris";
import productRoutes from "./routes/Products";
import authRoutes from "./routes/Auth";
import userRoutes from "./routes/Users";
import saveoderRoutes from "./routes/SaveOder";
import InfoUserRoutes from "./routes/InfoUser";
import OderRoutes from "./routes/Oder";
import OderDetailRoutes from "./routes/OderDetail";
import CommentRoutes from "./routes/Comments";
import StatisticalRoutes from "./routes/Statistical";
import ContactRoutes from "./routes/Contacts";
import SlidesRoutes from "./routes/Slides";
import CateShopRoutes from "./routes/CateShop";
import TypeGroupNameRoutues from "./routes/TypeGroupName";
import ClassificationRoutues from "./routes/Classification";
import CommodityValueRoutues from "./routes/CommodityValue";
import ShopOwnerRoutes from "./routes/ShopOwner";
import ImageProRoutes from "./routes/ImagePro";
import PushOtpEmail from "./routes/PushOtpEmail";

const WebSocket = require('ws');

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ddnkbpdzs",
  api_key: "665144417678677",
  api_secret: "qKRYqgMn8iBBpb77LU4dxm1HpVQ",
});
const app = express();

dotenv.config();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(expressValidator());
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("thành công!");
  })
  .catch((err) => {
    console.log(`db error ${err.message}`);
    process.exit(-1);
  });
//Connection

mongoose.connection.on("error", (err) => {
  console.log(`data connect failed, ${err.message}`);
});

// routes
app.use("/api", productRoutes);
app.use("/api", ImageProRoutes);
app.use("/api", categoryRoutes);
app.use("/api", CateShopRoutes);
app.use("/api", ShopOwnerRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use("/api", saveoderRoutes);

app.use("/api", InfoUserRoutes);
app.use("/api", OderRoutes);
app.use("/api", OderDetailRoutes);
app.use("/api", CommentRoutes);
app.use("/api", StatisticalRoutes);
app.use("/api", ContactRoutes);
app.use("/api", SlidesRoutes);
app.use("/api", TypeGroupNameRoutues);
app.use("/api", CommodityValueRoutues);
app.use("/api", ClassificationRoutues);
app.use("/api", PushOtpEmail);

// listen

// const http = require('http');
// const socketIo = require('socket.io');

// const server = http.createServer(app);
// // const wss = new WebSocket.Server({ server });
// const wss = new WebSocket.Server({ port: 3000 });
// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//       // Xử lý thông điệp từ client (ví dụ: thêm sản phẩm vào cơ sở dữ liệu)
//       console.log('Received message:', message);
//       // // Gửi thông báo cho tất cả client khác về sự kiện thêm sản phẩm
//       // wss.clients.forEach((client) => {
//       //     if (client !== ws && client.readyState === WebSocket.OPEN) {
//       //         client.send(message);
//       //     }
//       // });
//   });
// });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Thanh cong", port);
});

// server.listen(port, () => {
//   console.log('Server is running on port 3001',port);
// });