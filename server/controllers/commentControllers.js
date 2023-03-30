const { removeCommentById } = require("../models/index");
deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => res.status(204).send())
    .catch(next);
};

module.exports = deleteCommentById;
