const app = require("../server/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const { toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());
describe("/api/topics", () => {
  test("GET 200: Respond with topics array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET 404: When passed GET request with incorrect spelling and error message stating 'Path not found!'", () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found!");
      });
  });
});

describe("/api/article/:article_id", () => {
  test("GET 200: Respond article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual({
          title: "Living in the shadow of a great man",
          author: "butter_bridge",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        });
      });
  });
  test("GET 400: Invalid article id", () => {
    return request(app)
      .get("/api/articles/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  test("GET 404: Invalid article id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});
describe("/api/aritcles", () => {
  test("GET 200: Respond with articles array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Checks correct amount of comments for an article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((article) => {
          if (article.article_id === 3) {
            expect(article.comment_count).toBe("2");
          }
        });
      });
  });
  test("GET 200: Checks the articles are shown in date order DESC", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: Respond with articles array with only comments from article chosen", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test("GET 200: Respond with articles array that shows most recent comments first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("GET 200: Respond with an empty array if passed an article that exists with zero comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
        expect(comments).toBeInstanceOf(Array);
      });
  });
  test("GET 404: Respond with 'ID not found' if article does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("GET 400: Respond with 'ID not found' if article does not exist", () => {
    return request(app)
      .get("/api/articles/not_a_number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 200: Respond with new posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Hello test1 from seank",
        username: "lurker",
      })
      .expect(200)
      .then(({ body }) => {
        const { newComment } = body;
        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "lurker",
          body: "Hello test1 from seank",
          article_id: 3,
        });
      });
  });
  test("POST 404: Respond with 'ID not found' if article doesnt exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        body: "Hello test1 from seank",
        username: "lurker",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("POST 404: Respond with 'Username not found' if username not in the database", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Hello test1 from seank",
        username: "lurkererere",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
  test("POST 400: Respond with 'Invalid ID' if endpoint is invalid", () => {
    return request(app)
      .post("/api/articles/not_a_number/comments")
      .send({
        body: "Hello test1 from seank",
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  test("POST 400: Respond with 'Missing feilds' if a feild is missing", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing feild");
      });
  });
});
describe("200:PATCH /api/articles/:article_id", () => {
  test("patch 200: Respond with updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
        });
      });
  });
  test("patch 200: Respond with updated article, check if works for negative input", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: -1,
      })
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: -1,
        });
      });
  });
  test("patch 404: Respond with 'ID not found' if article doesnt exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({
        inc_votes: -1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("patch 400: Respond with 'Invalid ID' if article cant exist", () => {
    return request(app)
      .patch("/api/articles/not_a_number")
      .send({
        inc_votes: -1,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  test("patch 400: Respond with not valid number if passed an object with a value not a number", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: "string",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes is not a valid number");
      });
  });
  test("patch 400: Respond with not an int if not an int", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 1.1,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes is not an interger");
      });
  });
  test("patch 400: Respond with inc_votes is not a valid number if passed nothing", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes is not a valid number");
      });
  });
});
describe("204:DELETE /api/comments/comment_id", () => {
  test("204 DELETE responds with 204, checks comment is actually deleted by trying to delete again", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("ID not found");
          });
      });
  });
  test("404 DELETE responds with 404 ID not found if cant find comment id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("400 DELETE responds with 400 Invalid ID if not valid id given in endpoint", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});
describe("/api/users", () => {
  test("GET 200: Respond with users array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {});
  });
});
describe("/api/aritcles with queries", () => {
  test("GET 200: Respond with articles array, with filter by topics", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(1);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cats",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Respond with articles array, with correct sort by and order by criteria and a topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&order_by=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(11);
        expect(articles).toBeSortedBy("comment_count", {
          descending: false,
          coerce: true,
        });
      });
  });
  test("GET 400: Respond error messge if invalid sort query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=DROP&order_by=ASC")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Sort Query");
      });
  });
  test("GET 400: Respond error messge if invalid order_By query", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order_by=PERS")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order Query");
      });
  });
  test("GET 200: Respond with empty array if topic exists but no articles are about that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
  test("GET 404: Respond error messge if topic filter doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=notmitch")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});
describe("Get /api ", () => {
  it("should get an oject with key endpoints and be able to access the different endpoints ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeInstanceOf(Object);
        expect(body.endpoints["GET /api"]).toBeInstanceOf(Object);
      });
  });
});
