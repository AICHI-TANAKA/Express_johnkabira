var express = require('express');
var router = express.Router();
const mysql = require('mysql');

const connection = require(”../env/dbconnect.js”);


/* GET users listing. */
router.get('/', function(req, res, next) {
  // スコアトップ10のユーザー情報を取得
  connection.query(
    `SELECT * FROM user ORDER BY score DESC LIMIT 5;`,
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
  // res.send('respond with a resource');
});

module.exports = router;
