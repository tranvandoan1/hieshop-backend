import TypeGroupName from '../modoles/TypeGroupName';
import formidable from 'formidable';
import _ from 'lodash';
export const create = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            error: "Bạn cần nhập đầy đủ thông tin"
        })
    }

    let Type_roup_name = new TypeGroupName(req.body);


    Type_roup_name.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: "Không thêm duoc tên loại sản phẩm"
            })
        }
        res.json(data)
    })

}

export const Id = (req, res, next, id) => {
    TypeGroupName.findById(id).exec((err, Type_roup_name) => {
        if (err || !Type_roup_name) {
            res.status(400).json({
                error: "Không tìm thấy tên loại sản phẩm"
            })
        }
        req.Type_roup_name = Type_roup_name;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.Type_roup_name);
}

export const remove = (req, res) => {
    let Type_roup_name = req.Type_roup_name;
    Type_roup_name.remove((err, Type_roup_name) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được tên loại sản phẩm"
            })
        }
        res.json({
            Type_roup_name,
            message: "tên loại sản phẩm đã được xóa thành công"
        })
    })
}

export const list = (req, res) => {
    TypeGroupName.find((error, data) => {
        if (error) {
            error: "Không tìm thấy tên loại sản phẩm"
        }
        res.json(data)
    })
}

export const update = (req, res) => {


    let Type_roup_name = req.Type_roup_name;
    const { name, pro_id } = req.body
    Type_roup_name = _.assignIn(Type_roup_name, { name, pro_id });

    Type_roup_name.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: "Không sửa được tên loại sản phẩm"
            })
        }
        res.json(data)
    })

}