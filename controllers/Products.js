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
    const { product, classify } = req.body
    console.log(product, classify, 'product,classify')
    try {
        console.log(product.image_id,'product.image_id')
        await  drive.files.delete({
            fileId: product.image_id
        })
        let id = [];
        for (let i = 0; i < classify.length; i++) {
            id.push(ObjectID(classify[i]._id));
            console.log(classify[i].image_id, ' classify[i].image_id')
            await drive.files.delete({
                fileId: classify[i].image_id
            })
        }
        await Classification.deleteMany({ _id: { $in: id } });
        console.log('xóa đucợ rồi')
        await Product.findByIdAndRemove(product._id);

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

