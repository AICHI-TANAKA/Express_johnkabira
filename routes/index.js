
var express = require('express');
var router = express.Router();
const { JSDOM } = require('jsdom');
// const url = 'http://localhost:3000/';
// const http = require('http');
var logger = require('../logger');


const connection = require("../env/dbconnect.js");

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return
  }
  console.log('success');
});




/* GET home page. */
router.get('/', function (req, res, next) {

    // スコアトップ10のユーザー情報を取得
    connection.query(
      `SELECT * FROM user ORDER BY score DESC LIMIT 5;`,
      (error, results) => {
        if (error) throw error;
        res.render('index', { lists: results });
      }
    );
    // connection.end();
    // res.render('index', { title: "test" });
});

router.post('/', function (req, res, next) {
  
  // idの最大値を格納
  var max_id;
  // スコアトップ10のユーザー情報
  var top10_users = {};
  var user_name = req.body.name;
  var score = req.body.score;

    Promise.resolve()
    .then(function(){
      return new Promise(function (resolve, reject) {
        logger.access.info("POSTED!");
        // idの最大値を採番
        connection.query(
          `SELECT MAX(id) as max_id FROM user;`,
          (error, results) => {
            // max_id = JSON.parse(JSON.stringify(results[0]).ID) + 1;
            max_id = results[0].max_id + 1;
            if (error) { 
              console.log("id採番エラー");
              logger.error.info("id採番エラー");
            }else{
              resolve(max_id);
            }
          }
        );
      });
    }).then(function(max_id){
      return new Promise(function (resolve, reject) {
        // ユーザー情報をINSERT
        if (user_name && score){
          connection.query(
            `INSERT INTO user (id, user_name, score) VALUES (${max_id}, '${user_name}', ${score});`,
            (error, results) => {
              if (error) { 
                console.log("INSERTエラー");
                logger.error.info("INSERTエラー");
              }else{
                resolve('INSERTED!')
              }
            }
          );
        }
      });
    }).then(function(result){
      return new Promise(function (resolve, reject) {
        // スコアトップ10のユーザー情報を取得
        connection.query(
          `SELECT * FROM user ORDER BY score DESC LIMIT 5;`,
          (error, results) => {
            top10_users = results;
            res.render('index', { lists: top10_users });
            if (error) { 
              console.log("取得エラー");
              logger.error.info("取得エラー");
            }
          }
        );
      });
    });
});

module.exports = router;