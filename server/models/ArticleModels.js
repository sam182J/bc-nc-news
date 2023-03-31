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

function fetchArticles(topic, sort_by = "created_at", order_by = "DESC") {
  if (
    sort_by &&
    sort_by !== "author" &&
    sort_by !== "title" &&
    sort_by !== "article_id" &&
    sort_by !== "topic" &&
    sort_by !== "created_at" &&
    sort_by !== "votes" &&
    sort_by !== "comment_count"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }
  if (order_by && order_by !== "ASC" && order_by !== "DESC") {
    return Promise.reject({ status: 400, msg: "Invalid order Query" });
  }
  const queryParameters = [];

  let queryString = `SELECT articles.*, COUNT(comment_id) AS comment_count 
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
`;
  let whereString = " WHERE topic = $1 ";
  if (topic) {
    queryParameters.push(topic);
    queryString += whereString;
  }
  let sort_byString = " GROUP BY articles.article_id";
  if (sort_by) {
    sort_byString += ` ORDER BY ${sort_by}`;
  }
  if (order_by) {
    sort_byString += ` ${order_by}`;
  }

  queryString += sort_byString;
  return db.query(queryString, queryParameters).then(({ rows }) => {
    if (!rows.length) {
      return checkTopicExists(topic);
    }
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

const createArticleCommentById = (id, comment) => {
  const { body, username } = comment;
  return checkUsernameExists(username).then((result) => {
    if (result.length > 0) {
      return db
        .query(
          `
          INSERT INTO comments
          (author, body, votes,  article_id,created_at)
          VALUES($1, $2, $3, $4,$5)
          RETURNING *
      `,
          [username, body, 0, id, new Date()]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    }
  });
};
const editArticleVotes = (id, votes) => {
  const { inc_votes } = votes;
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "inc_votes is not a valid number",
    });
  }
  if (!Number.isInteger(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "inc_votes is not an interger",
    });
  }
  return db
    .query(
      `
          UPDATE articles
          SET
          votes=votes+$2
          WHERE article_id =$1
          RETURNING *
      `,
      [id, inc_votes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return checkArticleExists(id);
      }
      return rows[0];
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

const checkUsernameExists = async (username) => {
  const queryStr = "SELECT * FROM users WHERE username=$1;";
  const dbOutput = await db.query(queryStr, [username]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Username not found" });
  } else {
    return dbOutput.rows;
  }
};
const checkTopicExists = async (topic) => {
  const queryStr = "SELECT * FROM topics WHERE slug=$1;";
  const dbOutput = await db.query(queryStr, [topic]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  } else {
    return [];
  }
};
module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  checkArticleExists,
  createArticleCommentById,
  editArticleVotes,
};
