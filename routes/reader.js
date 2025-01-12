const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const { error } = require("console");
const { resolveSoa } = require("dns");

router.get("/reader-home-page", (req, res, next) => {
  const query = "SELECT * FROM publishedArticle";

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.render("reader-home-page.ejs", { publishedArticles: rows });
    }
  });
});

//list article from publishedArticle and add comment from Comment database
router.get("/article/:id", (req, res, next) => {
  const articleQuery = "SELECT * FROM publishedArticle WHERE article_id = ?";
  const commentQuery = "SELECT * FROM comment WHERE article_id = ?";
  const id = req.params.id;

  global.db.get(articleQuery, [id], function (err, article) {
    if (err) {
      next(err);
    } else {
      if (article) {
        global.db.all(commentQuery, [id], function (err, comments) {
          if (err) {
            next(err);
          } else {
            res.render("reader-article.ejs", {
              article: article,
              comments: comments,
            });
          }
        });
      } else {
        res.status(404).send("Article not found");
      }
    }
  });
});

router.post("/article/:id/comment", (req, res, next) => {
  const article_id = req.params.id;
  const { userName, comment } = req.body;

  // Example SQL query to insert comment into the database
  const query =
    "INSERT INTO comment (article_id, user_name, comment) VALUES (?, ?, ?)";
  const values = [article_id, userName, comment];

  // Execute the query
  global.db.run(query, values, function (err) {
    if (err) {
      next(err); // Handle database insertion error
    } else {
      res.redirect(`/reader/article/${article_id}`); // Redirect to the article page after successful submission
    }
  });
});

module.exports = router;
