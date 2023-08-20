import Product from "../modoles/Products";
import Classification from "../modoles/Classification";
import Saveoder from "../modoles/SaveOder";
import express from "express";

const app = express();
const nodemailer = require('nodemailer');
const http = require('http').createServer(app);

import formidable from "formidable";
import _, { filter } from "lodash";
import { ObjectID } from "mongodb";
import { google } from "googleapis";
import fs from 'fs'
import path from "path";
import axios from "axios";
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const REQUEST_URI = process.env.REQUEST_URI


const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REQUEST_URI)
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})
// const socketIo = require("socket.io")(http, {
//     cors: {
//         origin: "*",
//     }
// });
// export const create = async (data) => {
//     try {
//         await Product.create(data.product);
//         await Classification.create(data.classifies);
//         Product.find((err, data) => {
//             if (err) {
//                 error: "Không tìm thấy sản phẩm";
//             }
//             return (data);
//         });
//     } catch (error) {
//         return ({ error: 'Không thêm được' });
//     }
// };

export const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            res.status(400).json({
                error: "Không tìm thấy sản phẩm",
            });
        }
        req.product = product;
        next();
    });
};
export const read = (req, res) => {
    return res.json(req.product);
};

export const remove = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.productId);
        await drive.files.delete({
            fileId: req.product.image_id
        })
        Product.find((err, data) => {
            if (err) {
                error: "Không tìm thấy sản phẩm";
            }
            return res.json(data);
        });

    } catch (error) {
        return res.status(400).json(error);
    }
};
export const removes = async (req, res) => {
    try {
        let id = req.body;
        for (let i = 0; i < id.length; i++) {
            id[i] = ObjectID(id[i]);
        }
        await Product.deleteMany({ _id: { $in: id } });
        Product.find((err, data) => {
            if (err) {
                error: "Không tìm thấy sp oder";
            }
            return res.json(data);
        });
    } catch (error) {
        return res.status(400).json(error);
    }

};

export const list = (req, res) => {
    Product.find((err, data) => {
        if (err) {
            return res.json({
                message: 'Không tìm thấy sản phẩm',
                data: data,
                status: true
            });
        }
        return res.json({
            message: 'Thêm  thành công',
            data: data,
            status: true
        });
    });
};

export const update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        let product = req.product;
        product = _.assignIn(product, fields);

        product.save((err, data) => {
            if (err) {
                res.status(400).json({
                    error: "Không sửa được sản phẩm",
                });
            }
            res.json(data);
        });
    });
};

