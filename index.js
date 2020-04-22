'use strict'  // 
let config = require('./config');
let express = require('express');
let app = express();
app.set('view engine','ejs');

let flg = 0; // 支払い方法を管理するフラグ
let resultTexts = {}; // 購入処理での結果を格納するオブジェクト
let wallet = {}; // 財布の中身を格納するオブジェクト
let amount = 0; // お釣りを格納する変数(表示用)
let resultTotalFee = 0; // お釣りを格納する変数
let resultMoneyType = {}; // お釣りの金種を格納するオブジェクト
let price = 0; // 購入金額を格納する変数

// 電子マネー処理サーバ
function electServer(card, price) {
  let result = {};
  if(card - price >= 0) {
    result.amount = card - price;
    result.price = price;
    result.judge = '引去成功';
  } else {
    result.amount = -1;
    result.price = price;
    result.judge = '引去失敗';
  }
  return result;
}

// viewsまでのパスを指定
app.use(express.static(__dirname + '/views', { index: false })); // index:falseで初期でindexファイルが開かれないようにする。
// publicまでのパスを指定
app.use(express.static(__dirname + '/public', { index: false }));
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// 購入処理(現金)
app.post('/purchase', function (req, res) {
  let totalFee = 0;
  // 投入金額
  for (let item in req.body.change) {
    if (req.body.change[item] > 0) {
      switch (item) {
        case 'ten':
          resultTexts.ten = '10円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 10;
          break;
        case 'fif':
          resultTexts.fif = '50円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 50;
          break;
        case 'oneHnd':
          resultTexts.oneHnd = '100円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 100;
          break;
        case 'fivHnd':
          resultTexts.fivHnd = '500円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 500;
          break;
        case 'oneThs':
          resultTexts.oneThs = '1,000円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 1000;
          break;
        case 'fivThs':
          resultTexts.fivThs = '5,000円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 5000;
          break;
        case 'tenThs':
          resultTexts.tenThs = '10,000円 × ' + req.body.change[item] + '枚';
          totalFee = totalFee + 10000;
          break;
        default:
          break;
      }
    }
  }
  // お釣り計算
  if (totalFee - req.body.amount > 0) {
    resultTotalFee = totalFee - req.body.amount;
    amount = resultTotalFee;
    while (resultTotalFee > 0) {
      // 金種判定
      if (resultTotalFee >= 5000) {
        // 何枚になるか計算
        let moneyAmount = Math.floor(resultTotalFee / 5000);
        // お釣りから金種分を引く
        resultTotalFee = resultTotalFee - (moneyAmount * 5000);
        // 結果表示する用のオブジェクトに格納
        resultMoneyType.fivThs = '5,000円 × ' + moneyAmount + '枚';
      } else if (resultTotalFee >= 1000) {
        let moneyAmount = Math.floor(resultTotalFee / 1000);
        resultTotalFee = resultTotalFee - (moneyAmount * 1000);
        resultMoneyType.oneThs = '1,000円 × ' + moneyAmount + '枚';
      } else if (resultTotalFee >= 500) {
        let moneyAmount = Math.floor(resultTotalFee / 500);
        resultTotalFee = resultTotalFee - (moneyAmount * 500);
        resultMoneyType.fivHnd = '500円 × ' + moneyAmount + '枚';
      } else if (resultTotalFee >= 100) {
        let moneyAmount = Math.floor(resultTotalFee / 100);
        resultTotalFee = resultTotalFee - (moneyAmount * 100);
        resultMoneyType.oneHnd = '100円 × ' + moneyAmount + '枚';
      } else if (resultTotalFee >= 50) {
        let moneyAmount = Math.floor(resultTotalFee / 50);
        resultTotalFee = resultTotalFee - (moneyAmount * 50);
        resultMoneyType.fif = '50円 × ' + moneyAmount + '枚';
      } else if (resultTotalFee >= 10) {
        let moneyAmount = Math.floor(resultTotalFee / 10);
        resultTotalFee = resultTotalFee - (moneyAmount * 10);
        resultMoneyType.ten = '10円 × ' + moneyAmount + '枚';
      }
    }
  } else if(totalFee - req.body.amount == 0) {
    resultTotalFee = 0;
  }
  // 財布の中身
  for (let key in req.body.wallet_remain) {
    switch (key) {
      case 'ten_yen':
        wallet.ten = '10円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'fif_yen':
        wallet.fif = '50円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'oneHnd_yen':
        wallet.oneHnd = '100円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'fivHnd_yen':
        wallet.fivHnd = '500円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'oneThs_yen':
        wallet.oneThs = '1,000円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'fivThs_yen':
        wallet.fivThs = '5,000円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      case 'tenThs_yen':
        wallet.tenThs = '10,000円 × ' + req.body.wallet_remain[key] + '枚'
        break;
      default:
        break;
    }
  }

  if(totalFee - req.body.amount < 0) {
    flg = 1; 
    // 結果表示
    res.send({value: 'fail'});
  } else {
    // 結果表示
    flg = 1;  
    res.send({value: 'success'});
  }
});

// 購入処理(電子マネー)
app.post('/purchase_card', function (req, res) {
  // 計算処理
  let result = electServer(req.body.card, req.body.amount);

  amount = result.amount; // 電子マネーに返却する金額を格納する変数
  price = result.price; // 購入金額を格納する変数
  
  if (result.judge == '引去失敗') {
    // 結果表示
    flg = 2;
    res.send({value: 'fail'});
  } else {
    // 結果表示
    flg = 2;
    res.send({value: 'success'});
  }
});

console.log('------------------------');

// get
app.get('/', function (req, res) {
  resultTexts = {}; // 購入処理での結果を格納するオブジェクト
  wallet = {}; // 財布の中身を格納するオブジェクト
  resultMoneyType = {}; // お釣りの金種を格納するオブジェクト
  amount = 0; // お釣りを格納する変数(表示用)
  price = 0; // 購入金額を格納する変数
  res.render('index.ejs');
});
app.get('/result', function (req, res) {
  if (flg == 1) {
    flg = 0;
    res.render('result.ejs',{result: resultTexts,wallet: wallet,moneyType: resultMoneyType,amount: amount});
  } else if (flg == 2) {
    flg = 0;
    res.render('result_card.ejs',{amount: amount,price: price});
  } else {
    res.redirect('/');
  }
});
app.get('/fail', function (req, res) {
  if (flg == 1) {
    flg = 0;
    res.render('fail.ejs',{result: '現金'});
  } else if (flg == 2) {
    flg = 0;
    res.render('fail.ejs',{result: '電子マネー残高'});
  } else {
    res.redirect('/');
  }
});

// Not Found時
app.use(function(req,res,next) {
  res.render('error.ejs');
});
app.listen(config.port);
console.log('ポート' + config.port + 'を起動します...');