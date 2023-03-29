const db = require("../../db/connection");
const format = require("pg-format");
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
const fetchArticleCommentsById = (id) => {
  let queryString = `SELECT comments.*
  FROM comments
  
  LEFT JOIN articles on articles.article_id = comments.article_id
  WHERE articles.article_id=$1
  ORDER BY comments.created_at DESC`;
  return db.query(queryString, [id]).then(({ rows }) => {
    if (!rows.length) {
      return checkArticleExists(id);
    }
    return rows;
  });
};

const checkArticleExists = async (id) => {
  const queryStr = "SELECT * FROM articles WHERE article_id=$1;";
  const dbOutput = await db.query(queryStr, [id]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "ID not found" });
  } else {
    return [];
  }
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
};
