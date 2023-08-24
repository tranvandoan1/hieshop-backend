import Product from "../modoles/Products";
import Classification from "../modoles/Classification";
const cloudinary = require("cloudinary").v2;

import formidable from "formidable";
import _ from "lodash";
import { ObjectID } from "mongodb";

export const create = async (req, res) => {
    function uploadFile(fileMetadata, media) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                fileMetadata,
                { folder: "products" },
                async function (error, result) {
                    if (error) {
                        Product.find((err, data) => {
                            if (err) {
                                return res.json({
                                    message: "Không tìm thấy sản phẩm",
                                    data: data,
                                    status: true,
                                });
                            }
                            return res.json({
                                message: "Không thêm được ảnh. Xin thử lại !",
                                data: data,
                                status: true,
                            });
                        });
                    } else {
                        resolve({
                            image_id: result.public_id,
                            photo: result.url,
                        }); // Trả về ID file
                    }
                }
            );
        });
    }
    const fileIds = [];
    for (let i = 0; i < req.files.length; i++) {
        try {
            const fileId = await uploadFile(req.files[i].path);
            fileIds.push(fileId); // Thêm ID file vào mảng
        } catch (err) {
            Product.find((err, data) => {
                if (err) {
                    return res.json({
                        message: "Không tìm thấy sản phẩm",
                        data: data,
                        status: true,
                    });
                }
                return res.json({
                    message: "Không thêm được ảnh. Xin thử lại !",
                    data: data,
                    status: true,
                });
            });
        }
    }
    if (fileIds.length > 0) {
        const data = JSON.parse(req.body.data);

        const product = [];
        const classifies = [];
        for (let i = 0; i < fileIds.length; i++) {
            if (i == 0) {
                product.push({
                    ...data.product,
                    photo: fileIds[0].photo,
                    image_id: fileIds[0].image_id,
                });
            } else {
                classifies.push({
                    ...data.classifies[i - 1],
                    photo: fileIds[i].photo,
                    image_id: fileIds[i].image_id,
                });
            }
        }
        try {
            await Product.create(product);
            await Classification.create(classifies);
            Product.find((err, data) => {
                if (err) {
                    return res.json({
                        message: "Không tìm thấy sản phẩm",
                        data: data,
                        status: true,
                    });
                }
                return res.json({
                    message: "Thêm  thành công",
                    data: data,
                    status: true,
                });
            });
        } catch (error) {
            Product.find((err, data) => {
                if (err) {
                    return res.json({
                        message: "Không tìm thấy sản phẩm",
                        data: data,
                        status: true,
                    });
                }
                return res.json({
                    message: "Không thêm được. Xin thử lại !",
                    data: data,
                    status: true,
                });
            });
        }
    }
};
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
    const { product, classify } = req.body;
    try {
        cloudinary.uploader.destroy(product.image_id);
        let id = [];
        for (let i = 0; i < classify.length; i++) {
            id.push(ObjectID(classify[i]._id));
            cloudinary.uploader.destroy(classify[i].image_id);
        }
        await Classification.deleteMany({ _id: { $in: id } });
        await Product.findByIdAndRemove(product._id);

        Product.find((err, data) => {
            if (err) {
                return res.json({
                    message: "Không tìm thấy sản phẩm",
                    data: data,
                    status: true,
                });
            }
            return res.json({
                message: "Thêm  thành công",
                data: data,
                status: true,
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
                message: "Không tìm thấy sản phẩm",
                data: data,
                status: true,
            });
        }
        return res.json({
            message: "Thêm  thành công",
            data: data,
            status: true,
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
