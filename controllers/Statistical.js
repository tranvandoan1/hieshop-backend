import Statistical from '../modoles/Statistical';
import formidable from 'formidable';
import _ from 'lodash';
export const create = (req, res) => {

    let statistical = new Statistical(req.body);

    statistical.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: "Khoong them duoc thống kê"
            })
        }
        res.json(data)
    })

}

export const Id = (req, res, next, id) => {
    Statistical.findById(id).exec((err, statistical) => {
        if (err || !statistical) {
            res.status(400).json({
                error: "Không tìm thấy Danh muc"
            })
        }
        req.statistical = statistical;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.statistical);
}

export const remove = (req, res) => {
    let statistical = req.statistical;
    statistical.remove((err, statistical) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được Danh muc"
            })
        }
        res.json({
            statistical,
            message: "Danh muc đã được xóa thành công"
        })
    })
}

export const list = (req, res) => {
    Statistical.find((err, data) => {
        if (err) {
            error: "Không tìm thấy Danh muc"
        }
        res.json(data)
    })
}

export const update = (req, res) => {

    const form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        let statisticals = req.statistical;
        statisticals = _.assignIn(statisticals, fields);

        statisticals.save((err, data) => {
            if (err) {
                res.status(400).json({
                    error: "Không sửa được danh mục"
                })
            }
            res.json(data)
        })

    })


}