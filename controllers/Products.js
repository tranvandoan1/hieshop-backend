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
export const update = async (req, res) => {
    const { newProduct, newClassifies, product, classifies } = JSON.parse(
        req.body.data
    );

    const newClassifiesImage = newClassifies.filter(
        (item) => item.file !== undefined
    );

    const fileIds = [];
    if (req.files.length > 0) {
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
    }
    if (fileIds.length > 0 || req.files.length <= 0) {
        try {
            const productNew = [];
            const classifiesNew = [];
            for (let i = 0; i < fileIds.length; i++) {
                if (newProduct.file.stauts == false) {
                    classifiesNew.push({
                        ...newClassifiesImage[i],
                        photo: fileIds[i].photo,
                        image_id: fileIds[i].image_id,
                    });
                } else {
                    if (i == 0) {
                        productNew.push({
                            ...newProduct,
                            photo: fileIds[0].photo,
                            image_id: fileIds[0].image_id,
                        });
                    } else {
                        classifiesNew.push({
                            ...newClassifiesImage[i - 1],
                            photo: fileIds[i].photo,
                            image_id: fileIds[i].image_id,
                        });
                    }
                }
            }

            // upload giá trị mới của giá trị phân loại
            for (let i = 0; i < newClassifies.length; i++) {
                for (let j = 0; j < classifiesNew.length; j++) {
                    if (newClassifies[i]._id == classifiesNew[j]._id) {
                        newClassifies[i] = classifiesNew[j];
                    }
                }
            }
            const classifiesRemove = classifies.filter(
                (obj1) => !newClassifies.some((obj2) => obj1._id === obj2._id)
            );
            const classifiesAdd = newClassifies.filter(
                (obj1) => !classifies.some((obj2) => obj1._id === obj2._id)
            );
            const classifiesUpload = newClassifies.filter((obj1) =>
                classifies.some((obj2) => obj1._id === obj2._id)
            );
            const newclassifiesAdd = [];
            classifiesAdd.map((item) => {
                newclassifiesAdd.push({
                    photo: item.photo,
                    image_id: item.image_id,
                    values: item.values,
                    price: item.price,
                    quantity: item.quantity,
                    name: item.name,
                    linked: product.linked,
                });
            });
            const { file, ...newDataPro } =
                newProduct.file.stauts == false ? newProduct : productNew[0];
            if (newclassifiesAdd.length > 0) {
                for (let i = 0; i < newclassifiesAdd.length; i++) {
                    await Classification.create(newclassifiesAdd[i]);
                }
            }
            if (classifiesRemove.length > 0) {
                for (let i = 0; i < classifiesRemove.length; i++) {
                    cloudinary.uploader.destroy(classifiesRemove[i].image_id);
                    await Classification.deleteMany({
                        _id: { $in: ObjectID(classifiesRemove[i]._id) },
                    });
                }
            }
            if (classifiesUpload.length > 0) {
                for (let i = 0; i < classifiesUpload.length; i++) {
                    await Classification.updateMany(
                        {
                            _id: { $in: classifiesUpload[i]._id },
                        },
                        {
                            $set: classifiesUpload[i],
                        }
                    );
                }
            }
            await Product.updateMany(
                {
                    _id: { $in: product._id },
                },
                {
                    $set: {
                        ...newDataPro,
                        name_commodityvalue: newDataPro.name_commodityvalue
                    },
                }
            );
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
export const updateView = async (req, res) => {
    await Product.updateMany(
        {
            _id: { $in: req.body._id },
        },
        {
            $set: {
                view: req.body.view + 1
            },
        }
    );
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