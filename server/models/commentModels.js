const db = require("../../db/connection");
function removeCommentById(id) {
  return db
    .query(
      `DELETE FROM comments WHERE comment_id = $1
RETURNING *;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          msg: "ID not found",
          status: 404,
        });
      }
    });
}

module.exports = removeCommentById;
