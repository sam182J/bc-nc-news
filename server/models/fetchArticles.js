const db = require("../../db/connection");
function fetchArticleById(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ msg: "ID not found", status: 404 });
      }
      return result.rows[0];
    });
}

function fetchArticles() {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
}
module.exports = { fetchArticleById, fetchArticles };
