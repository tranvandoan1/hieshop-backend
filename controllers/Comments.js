import Comments from "../modoles/Comments";
import formidable from "formidable";
import _ from "lodash";
export const create = (req, res) => {
  let comment = new Comments(req.body);
  comment.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Không bình luận được",
      });
    }
    Comments.find((err, dataAll) => {
      return res.json(dataAll);
    });
  });
};

export const Id = (req, res, next, id) => {
  Comments.findById(id).exec((err, comment) => {
    if (err || !comment) {
      res.status(400).json({
        error: "Không tìm thấy comments",
      });
    }
    req.comment = comment;
    next();
  });
};
export const read = (req, res) => {
  return res.json(req.comment);
};

export const remove = (req, res) => {
  let comment = req.comment;
  comment.remove((err, comment) => {
    if (err) {
      return res.status(400).json({
        error: "Không xóa được comment",
      });
    }
    res.json({
      comment,
      message: "comment đã được xóa thành công",
    });
  });
};

export const list = (req, res) => {
  Comments.find((err, data) => {
    if (err) {
      error: "Không tìm thấy comment";
    }
    return res.json(data);
  });
};

export const update = async (req, res) => {
  const commentst = req.body;
  console.log(commentst);
  let commentUpload = req.comment;
  commentUpload = _.assignIn(commentUpload, commentst);

  commentUpload.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: "Không sửa được comments",
      });
    }
    Comments.find((err, dataAll) => {
      return res.json(dataAll);
    });
  });
};
