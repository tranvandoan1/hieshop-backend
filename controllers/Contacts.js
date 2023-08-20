import Contact from '../modoles/Contacts';
import formidable from 'formidable';
import _ from 'lodash';

export const create = (req, res) => {

    let contact = new Contact(req.body);

    contact.save((err, data) => {
        if (err) {
            res.status(400).json({
                error: "Không gửi được"
            })
        }
        res.json(data)
    })

}


export const Id = (req, res, next, id) => {
    Contact.findById(id).exec((err, contact) => {
        if (err || !contact) {
            res.status(400).json({
                error: "Không tìm thấy "
            })
        }
        req.contact = contact;
        next();
    })
}
export const read = (req, res) => {
    return res.json(req.contact);
}

export const remove = (req, res) => {
    let contact = req.contact;
    contact.remove((err, contact) => {
        if (err) {
            return res.status(400).json({
                error: "Không xóa được "
            })
        }
        res.json({
            contact,
            message: "Thông tin của bạn đã được xóa thành công"
        })
    })
}

export const list = (req, res) => {
    Contact.find((err, data) => {
        if (err) {
            error: "Không tìm thấy thông tin"
        }
        res.json(data)
    })
}

// export const update = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "ko thành côgn"
//             })
//         }

//         let saveInF = req.saveInF;
//         saveInF = _.assignIn(saveInF, fields);

//         saveInF.save((err, data) => {
//             if (err) {
//                 res.status(400).json({
//                     error: "Không sửa được thông tin"
//                 })
//             }
//             res.json(data)
//         })
//     });
// }