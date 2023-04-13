
  // 配列シャッフル関数　Fisher–Yates shuffleアルゴリズム
  function shuffle(array){
    for (var i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// // POSTリクエストの設定
// function post(xhr, name, score) {
//   xhr.open('POST', '/', true);
//   xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
//   // フォームに入力した値をパラメータとして設定
//   var request = "name=" + name + "&score=" + score;
//   xhr.send(request);
// }

// ユーザ名とスコアをPOSTする
function userdata_setter(name, score){
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/', true);
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');

  // フォームに入力した値をパラメータとして設定
  var request = "name=" + name + "&score=" + score;
  xhr.send(request);
}

// 得点上位5名のデータを取得する
function ranking_getter(){
  fetch('/ranking').then((res) => {
    if (!res.ok) {
      throw new Error();
    }
    return res.text(); 
  }).then((text) => {
    results = JSON.parse(text);
    ranking_set(results);
  });
}

// ランキング表示を最新化する
function ranking_set(results){
  ranking_elements = document.getElementById('ranking_list');  //ランキングのDOM要素
  ranking_elements.innerHTML = '';  //ランキングをdocumentごとクリア

  // 取得したユーザー情報をスコアの降順にソート
  results = results.sort((a,b) =>{
    return (a.score > b.score) ? -1 : 1;
  });
  // ランキング情報を最新化
  ranking_text = '';
  for(i=0; i < results.length; i++){
    ranking_text += '<li style="display:inline;">' + (i+1) + '位：' + results[i].user_name + '</li><br>';
  }
  ranking_elements.innerHTML = ranking_text;

}


// 成績管理クラス
class UserResult{
  // 回答
  answer = [];
  // 正解数
  correct = 0;
  // 不正解数
  incorrect = 0;
  // 総正解数
  total = 9;
  
  // 正解の時
  result_add(){
    this.correct++;
  }
  // 不正解の時
  result_sub(){
    this.incorrect;
  }
  // 正解率算出
  result_rate(){
    return Math.floor(this.correct / this.total * 100);
  }
}
  

// クイズデータ管理クラス
class QuestionData{
  // 正解の人物
  correct = {answer_person:""};
  // 現在何問目か
  question_count = {count:1};
  // 現在何問正解したか
  correct_count = {count:0};

  init(){
    document.getElementById('correct_count').textContent = "正解数：0/3";
  }


  start_click(resolve){
    // 質問データオブジェクト
    var questions_data = {"j":"ジョンカビラは？"
                          ,"k":"川平慈英は？"
                          ,"h":"博多華丸は？"};
    // 現在の質問データを格納
    var question_now = [];     
    // 表示されている画像一覧
    var disp_image_list = [];
    // 正解の人物
    var who = this.correct;
    // 現在何問目か
    var question_count = this.question_count;
    // 現在何問正解したか
    var correct_count = this.correct_count;

    // 最初の質問を生成
    question_shuffle();
    // 最初の表示画像を生成
    image_shuffle();

    var counter = 0;
    var delim = 0;
    var limit = 5;
    var const_lim = 5;

    var timerId = setInterval(function(){
                                limit = const_lim - delim;
                                document.getElementById('timer').textContent = "残り" + limit + "秒";
                                counter++;
                                delim++;
                                correct_set(question_now[0]);

                                // 問題更新
                                if(delim > 5){
                                  delim = 0;
                                  limit = 5;
                                  // 画像と質問の初期化
                                  correct_count_reset();
                                  question_count_set();
                                  question_shuffle();
                                  image_shuffle();
                                  correct_set(question_now[0]);
                                }
                                // 終了処理
                                if(counter == 18){
                                  clearInterval(timerId);
                                  document.getElementById("judge_txt").textContent = "終了";
                                  document.getElementById('correct_count').textContent = "";
                                  image_all_coverd();
                                  resolve();
                                }
    }, 1000);

    // 5秒ごとに画像をシャッフルして再表示
    function image_shuffle(){
      // 表示画像リストを初期化
      disp_image_list = [];
      // j,k,hにそれぞれ1～6のうち3の数字を割り振る
      var person = ["j", "k", "h"];
      var num = [1, 2, 3, 4, 5, 6];
      shuffle(num);     
      for(var i = 0; i < person.length; i++){
        for(var j = 0; j < 3; j++){
          var image_name = person[i] + '-' + num[j];
          disp_image_list.push(image_name);
        }
      }
      shuffle(disp_image_list);

      for(var i = 0; i < 9; i++){
        document.getElementById('img_' + (i + 1)).setAttribute('name', disp_image_list[i]);
        document.getElementById('img_' + (i + 1)).setAttribute('src', './images/' + disp_image_list[i] + '.jpg');
        document.getElementById('img_' + (i + 1)).parentNode.parentNode.classList.remove('clicked');
      }
      
    }
    
    // 5秒ごとに質問をシャッフルして再表示
    function question_shuffle(){
      // 質問オブジェクトのキーを配列化
      var arr_keys = Object.keys(questions_data);
      shuffle(arr_keys);
      // 現在の質問を決定
      question_now = [arr_keys[0], questions_data[arr_keys[0]]];
      document.getElementById('question_txt').textContent = "Q" + question_count.count + "." + question_now[1];
    }

    // 正解の人物を設定
    function correct_set(now_person){
      who.answer_person = now_person;
    }

    // 現在何問目かをカウント
    function question_count_set(){
      question_count.count++;
    }

    // 現在の質問に対する正解数をリセット
    function correct_count_reset(){
      correct_count.count = 0;
      document.getElementById('correct_count').textContent = "正解数：" + correct_count.count + "/3";
    }

    // 画像を全てクリック不可にする
    function image_all_coverd(){
      for(var i = 0; i < 9; i++){
        document.getElementById('img_' + (i + 1)).parentNode.parentNode.classList.add('clicked');
      }      
    }
  }

  // 正誤判定。正解であればtrueを、不正解であればfalseを返す。
  judge(answer){
      if(answer.substring(0,1) == this.correct.answer_person){
          document.getElementById("judge_txt").textContent = "くぅ～～！！";
          this.correct_count.count++;
          document.getElementById('correct_count').textContent = "正解数：" + this.correct_count.count + "/3";
          return true;
      }
      document.getElementById("judge_txt").textContent = "ムムッ！！";
      return false;
  }  
}

var userObj = new UserResult;
var questionObj = new QuestionData;

// jQueryによる待ち受け関数
$(function(){
    $("#start_button").click(function(e){
      // ユーザー名をcookieに保存
      name_element = document.getElementById("name");
      document.cookie = "johnkabiragame_name=" + name_element.value;
      $("#start_button").css({"display":"none"});
      $("#user_name").css({"display":"none"});

      questionObj.init();
      quiz_time = new Promise(function(resolve){
        questionObj.start_click(resolve);
      });

      // ゲーム終了時処理
      quiz_time.then(function(){
        document.getElementById('limit_message').textContent = "あなたの総正解数は"+ userObj.correct +"です。";
        document.getElementById('question_txt').textContent = "終了！";
        document.getElementById('judge_txt').textContent = "";
        document.getElementById('restart_button').style.display = "block";
        rate = userObj.result_rate();
        document.getElementById('accuracy_rate').textContent = "正解率:" + rate + "%";
        document.getElementById('accuracy_rate').style.display = "block";

        // チェーンメソッドの各then()でPromise型を返す手法 https://qiita.com/hikarut/items/6c236b6d6ff6ec10cd7a
        Promise.resolve()
          .then(function(){
            return new Promise(function (resolve, reject) {
              var cookie_data = document.cookie.split(';');//split(';')を使用しデータを1つずつに分ける
              var key_value = [];
              var name_txt = '';

              // cookieからユーザー名を取得
              for(i=0; i < cookie_data.length; i++){
                key_value = cookie_data[i].split('=');
                // 前後空白削除
                key_value[0] = key_value[0].trim();
                if(key_value[0] == 'johnkabiragame_name'){
                  name_txt = key_value[1];
                }
              }
              if(name_txt){
                resolve(userdata_setter(name_txt, userObj.correct));
              }
            });
          })
          .then(function(){
            return new Promise(function (resolve, reject) {
              ranking_getter();
            })
          });  
      });
    });

    $("#restart_button").click(function(e){
      window.location.reload();
    });

    // 画像クリック時処理
    $("img").click(function(e){
      // 正誤判定と成績記入
      var answer = this.name;
      // クリックされた画像にカバーをかける jQueryの場合はメソッドで指定
      $(this).parent().parent().addClass("clicked");
      if(questionObj.judge(answer)){
        userObj.result_add();
      }else{
        // userObj.result_sub();
      }
    });


})
