import ShopOwner from '../modoles/ShopOwner';
import formidable from 'formidable';
import _ from 'lodash';
export const create = (req, res) => {
    const { nameShop } = req.body;
    console.log(req.body, 'req.body')
    // if (!nameShop) {
    //     return res.status(400).json({
    //         error: "Bạn cần nhập đầy đủ thông tin"
    //     })
    // }

    // let shopowner = new ShopOwner(req.body);


    // shopowner.save((error, data) => {
    //     if (error) {
    //         return res.status(400).json({
    //             error: "Không thêm duoc danh muc"
    //         })
    //     }
    //     res.json(data)
    // })

}

export const Id = (req, res, next, id) => {
    ShopOwner.findById(id).exec((err, shopowner) => {
        if (err || !shopowner) {
            res.status(400).json({
                error: "Không tìm thấy Danh muc"
            })
        }
        req.shopowner = shopowner;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.shopowner);
}

export const remove = (req, res) => {
    let shopowner = req.shopowner;
    shopowner.remove((err, shopowner) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được Danh muc"
            })
        }
        res.json({
            shopowner,
            message: "Danh muc đã được xóa thành công"
        })
    })
}

export const list = (req, res) => {
    ShopOwner.find((error, data) => {
        if (error) {
            error: "Không tìm thấy Danh muc"
        }
        res.json(data)
    })
}

export const update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Không thêm được thông tin"
            })
        }
        let shopowner = req.shopowner;
        shopowner = _.assignIn(shopowner, fields);

        shopowner.save((err, data) => {
            if (err) {
                res.status(400).json({
                    error: "Không sửa được danh mục"
                })
            }
            res.json(data)
        })

    });



}