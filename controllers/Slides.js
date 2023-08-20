import Slides from "../modoles/Slides";
import formidable from "formidable";
import _ from "lodash";
export const create = (req, res) => {
  let slide = new Slides(req.body);

  slide.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Không thêm ảnh",
      });
    }
    res.json(data);
  });
};

export const SliderById = (req, res, next, id) => {
  Slides.findById(id).exec((err, slide) => {
    if (err || !slide) {
      res.status(400).json({
        error: "Không tìm thấy ảnh",
      });
    }
    req.slide = slide;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.slide);
};

export const remove = (req, res) => {
  let slide = req.slide;
  slide.remove((err, deletedslide) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được ảnh",
      });
    }
    res.json({
      deletedslide,
      message: "Ảnh đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  Slides.find((error, data) => {
    if (error) {
      error: "Không tìm thấy ảnh";
    }
    res.json(data);
  });
};

// export const update = (req, res) => {
//   const form = formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     let slide = req.slide;

//     slide = _.assignIn(slide, fields);

//     slide.save((err, data) => {
//       if (err) {
//         res.status(400).json({
//           error: "Không sửa được ảnh",
//         });
//       }
//       res.json(data);
//     });
//   });
// };

export const update = async (req, res) => {
  // await Slides.findByIdAndUpdate(req.params.slidesId, req.body);
  // Slides.find((err, data) => {
  //   if (err) {
  //     error: "Không tìm thấy ảnh";
  //   }
  //   res.json(data);
  // });
  console.log(req.params.slidesId, req.body,' req.body')
};