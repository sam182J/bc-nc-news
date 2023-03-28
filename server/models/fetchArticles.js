const db = require("../../db/connection");
function fetchAricles(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ msg: "ID not found", status: 404 });
      }
      return result.rows[0];
    });
}
module.exports = fetchAricles;
