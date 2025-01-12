
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

-- Table for author.js create artiole draft
CREATE TABLE IF NOT EXISTS blogArticle (
    blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    article_title TEXT NOT NULL, 
    article_content TEXT NOT NULL
    -- createdDate TEXT DEFAULT strftime('%d/%m/%Y', 'now'),
    -- modifiedDate TEXT DEFAULT strftime('%d/%m/%Y', 'now')
);
 
--Table for author.js published article draft and list it to rader.js
CREATE TABLE IF NOT EXISTS publishedArticle(
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    published_article_title TEXT NOT NULL, 
    published_article_content TEXT NOT NULL
);

--Table for comment in reader.js
CREATE TABLE IF NOT EXISTS comment(
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES publishedArticle(article_id)
);


COMMIT;

