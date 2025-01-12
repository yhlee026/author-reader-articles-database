const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const { error } = require("console");
const { resolveSoa } = require("dns");

router.get("/list-articles", (req, res, next) => {
  query = "SELECT * FROM blogArticle";

  global.db.all(query, function (err, rows) {
    if (err) {
      next(err);
    } else {
      res.json(rows);
    }
  });
});

//database for author draft article from blogArticle database
router.get("/author-home-page", (req, res, next) => {
  draftQuery = "SELECT * FROM blogArticle";
  publishedQuery = "SELECT * FROM publishedArticle";

  global.db.all(draftQuery, function (err, drafts) {
    if (err) {
      next(err);
    } else {
      global.db.all(publishedQuery, function (err, publishedArticles) {
        if (err) {
          next(err);
        } else {
          res.render("author-home-page.ejs", {
            articles: drafts,
            publishedArticles: publishedArticles,
          });
        }
      });
    }
  });
});

router.get("/create-draft", (req, res) => {
  res.render("create-draft.ejs");
});

router.post("/create-draft", (req, res) => {
  const { userName, articleTitle, articleContent } = req.body;

  query =
    "INSERT INTO blogArticle(user_name, article_title, article_content) VALUES (?, ?, ?)";
  values = [userName, articleTitle, articleContent];

  global.db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("FAIL TO CREATE DRAFT");
    } else {
      console.log("Draft created with ID: ${this.lastID}");
      res.redirect("/author/author-home-page");
    }
  });
});

//from blogArticle to edit the draft article
router.get("/edit-article/:id", (req, res, next) => {
  const query = "SELECT * FROM blogArticle WHERE blog_id = ?";
  const id = req.params.id;

  global.db.get(query, [id], function (err, row) {
    if (err) {
      next(err);
    } else {
      if (row) {
        res.render("edit-article.ejs", { article: row });
      } else {
        res.status(404).send("Article not found");
      }
    }
  });
});

router.post("/author-home-page/:id", (req, res) => {
  const { userName, articleTitle, articleContent } = req.body;
  const id = req.params.id;
  const query =
    "UPDATE blogArticle SET user_name = ?, article_title = ?, article_content = ? WHERE blog_id = ?";
  const values = [userName, articleTitle, articleContent, id];

  global.db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to update");
    } else {
      console.log("Draft upated with ID: ${req.params.id}");
      res.redirect("/author/author-home-page");
    }
  });
});

//publish article from blogArticle to publishedArticle
router.post("/publish/:id", (req, res) => {
  const id = req.params.id;
  const getQuery = "SELECT * FROM blogArticle WHERE blog_id = ?";
  global.db.get(getQuery, [id], function (err, row) {
    if (err) {
      console.error(err);
      res.status(500).send("Fail to capture article");
    } else {
      if (row) {
        const insertQuery =
          "INSERT INTO publishedArticle(user_name, published_article_title, published_article_content) VALUES (?, ?, ?)";
        const value = [row.user_name, row.article_title, row.article_content];
        global.db.run(insertQuery, value, function (err) {
          if (err) {
            console.error(err);
            res.status(500).send("Fail to publish");
          } else {
            console.log("Article published with ID: ${this.lastID}");
            res.redirect("/author/author-home-page");
          }
        });
      } else {
        res.status(404).send("Article not found");
      }
    }
  });
});

//delete article draft from blogArticle
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = "DELETE FROM blogArticle where blog_id =?";

  global.db.run(deleteQuery, [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("failed to delete");
    } else {
      console.log("Draft Deleted with ID: ${id}");
      res.redirect("/author/author-home-page");
    }
  });
});

module.exports = router;
