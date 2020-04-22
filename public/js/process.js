$(function(){
  // チケット購入画面
  // グローバル変数など
  // 財布の中身
  let wallet = {};
  wallet.ten_yen = 15; // 10円
  wallet.fif_yen = 3; // 50円
  wallet.oneHnd_yen = 2; // 100円
  wallet.fivHnd_yen = 1; // 500円
  wallet.oneThs_yen = 1; // 1,000円
  wallet.fivThs_yen = 1; // 5,000円
  wallet.tenThs_yen = 1; // 10,000円
  wallet.elect_card = 1000; // 電子マネー

  // 購入枚数初期化
  $('#ticket').val('0');

  // 初期枚数(電子マネーは残金)表示
  $('ten_yen-remaining').text(wallet.ten_yen);
  $('fif_yen-remaining').text(wallet.fif_yen);
  $('one-hnd_yen-remaining').text(wallet.oneHnd_yen);
  $('fiv-hnd_yen-remaining').text(wallet.fivHnd_yen);
  $('one-ths_yen-remaining').text(wallet.oneThs_yen);
  $('fiv-ths_yen-remaining').text(wallet.fivThs_yen);
  $('ten-ths_yen-remaining').text(wallet.tenThs_yen);
  $('card-remaining').text(wallet.elect_card);

  // 支払い価格
  let payPrice;
  let payPriceSubmit;

  // 投入枚数
  let result = {};

  // 残り枚数(残金)を表示する関数
  function dspRemaining(type, value) {
    $('#' + type + '-remaining').empty();
    $('#'+ type + '-remaining').append(value);
  }
  // 購入画面に表示される投入枚数(金額)を作る関数
  function inputAmount(type, value) {
    $('#' + type + '_field').val(value);
  }
  // 金額計算をする関数(現金)
  function moneyCalc(value) {
    if (payPrice - value > 0) {
      payPrice = payPrice - value;
      return payPrice;
    } else {
      payPrice = 0;
      $("#wallet_submit").prop("disabled", false);
      return payPrice;
    }
  }

  // 初めからやり直すボタンを押した時
  $('#reload').on('click',function() {
    location.reload();
  })

  // チケットの購入枚数と支払方法
  $('#ticket_amount').submit(function(event) {
    event.preventDefault();
    let ticketAmount = $('#ticket').val();  // 購入枚数
    let payType = $('input[name="pay_type"]:checked').val(); // 支払い方法
    let price; // 価格

    // 支払い方法でチケットの価格を変更
    if(payType == 'money') {
      price = 130;
    } else if(payType =='card') {
      price = 124;
    }

    // 支払い価格の計算
    payPrice = 0;
    payPriceSubmit = 0;
    payPrice = price * ticketAmount;
    payPriceSubmit = payPrice;

    // 次の画面作成
    $('#ticket_amount').addClass('hidden');
    // お財布の中身を表示
    $('.wallet').removeClass('hidden');

    // 支払い方法で次の画面を変更
    if(payType == 'money') {
      // 現金用のform表示
      $('#money_use').removeClass('hidden');
      $('#pay_price_money').empty();
      $('#pay_price_money').append(payPrice);

      // 財布から現金だけ取り出す
      $('#money').removeClass('hidden');
      dspRemaining('ten_yen',wallet.ten_yen);
      $('#ten_field').val('0');
      dspRemaining('fif_yen',wallet.fif_yen);
      $('#fif_field').val('0');
      dspRemaining('one-hnd_yen',wallet.oneHnd_yen);
      $('#oneHnd_field').val('0');
      dspRemaining('fiv-hnd_yen',wallet.fivHnd_yen);
      $('#fivHnd_field').val('0');
      dspRemaining('one-ths_yen',wallet.oneThs_yen);
      $('#oneThs_field').val('0');
      dspRemaining('fiv-ths_yen',wallet.fivThs_yen);
      $('#fivThs_field').val('0');
      dspRemaining('ten-ths_yen',wallet.tenThs_yen);
      $('#tenThs_field').val('0');
    } else if(payType =='card') {
      // 電子マネー用のform表示
      $('#card_use').removeClass('hidden');
      $('#pay_price_card').empty();
      $('#pay_price_card').append(payPrice);

      // 財布から電子マネーだけ出す
      $('#card').removeClass('hidden');
      dspRemaining('card',wallet.elect_card);
      $('#card_field').val('0');
    }

    return false;
  });

  // 財布の中のいずれかのボタンが押された時
  $('.wallet_contents_content_btn').on('click',function() {
    // ボタンが何円のボタンなのかチェック
    let amount = $(this).data('amount'); // 金種(計算用)
    let type = $(this).attr('id');  // 金種特定
    
    // 投入枚数
    result.ten = $('#ten_field').val();
    result.fif = $('#fif_field').val();
    result.oneHnd = $('#oneHnd_field').val();
    result.fivHnd = $('#fivHnd_field').val();
    result.oneThs = $('#oneThs_field').val();
    result.fivThs = $('#fivThs_field').val();
    result.tenThs = $('#tenThs_field').val();
    result.card = $('#card_field').val();

    // オブジェクトに再格納
    if (payPrice > 0) {
      // 金種の判断+計算
      // 投入した金種と枚数の表示
      switch(type) {
        case 'ten_yen':
          if(wallet.ten_yen > 0) {
            result.ten++;
            wallet.ten_yen = wallet.ten_yen - 1;
            dspRemaining('ten_yen',wallet.ten_yen);
            inputAmount('ten', result.ten);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'fif_yen':
          if(wallet.fif_yen > 0) {
            result.fif++;
            wallet.fif_yen = wallet.fif_yen - 1;
            dspRemaining('fif_yen',wallet.fif_yen);
            inputAmount('fif', result.fif);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'oneHnd_yen':
          if (wallet.oneHnd_yen > 0) {
            result.oneHnd++;
            wallet.oneHnd_yen = wallet.oneHnd_yen - 1;
            dspRemaining('one-hnd_yen',wallet.oneHnd_yen);
            inputAmount('oneHnd', result.oneHnd);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'fivHnd_yen':
          if (wallet.fivHnd_yen > 0) {
            result.fivHnd++;
            wallet.fivHnd_yen = wallet.fivHnd_yen - 1;
            dspRemaining('fiv-hnd_yen',wallet.fivHnd_yen);
            inputAmount('fivHnd', result.fivHnd);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'oneThs_yen':
          if (wallet.oneThs_yen > 0) {
            result.oneThs++;
            wallet.oneThs_yen = wallet.oneThs_yen - 1;
            dspRemaining('one-ths_yen',wallet.oneThs_yen);
            inputAmount('oneThs', result.oneThs);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'fivThs_yen':
          if (wallet.fivThs_yen > 0) {
            result.fivThs++;
            wallet.fivThs_yen = wallet.fivThs_yen - 1;
            dspRemaining('fiv-ths_yen',wallet.fivThs_yen);
            inputAmount('fivThs', result.fivThs);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'tenThs_yen':
          if (wallet.tenThs_yen > 0) {
            result.tenThs++;
            wallet.tenThs_yen = wallet.tenThs_yen - 1;
            dspRemaining('ten-ths_yen',wallet.tenThs_yen);
            inputAmount('tenThs', result.tenThs);
            $('#pay_price_money').empty();
            $('#pay_price_money').append(moneyCalc(amount));
          }
          break;
        case 'elect_card':
          if (wallet.elect_card > 124) {
            wallet.elect_card = 0;
            dspRemaining('card',wallet.elect_card);
            inputAmount('card', 1000);         
            if (1000 - payPrice > -1) {
              $("#card_submit").prop("disabled", false);
            }
          }
          break; 
        default:
          break;
      }
    }
  });
  // 現金払いの時
  $('#money_use').submit(function(event) {
    event.preventDefault();

    let submit_data = {};
    submit_data.change = {}
    submit_data.wallet_remain = wallet;
    submit_data.amount = payPriceSubmit;
    
    submit_data.change.ten = parseInt($('#ten_field').val());
    submit_data.change.fif = parseInt($('#fif_field').val());
    submit_data.change.oneHnd = parseInt($('#oneHnd_field').val());
    submit_data.change.fivHnd = parseInt($('#fivHnd_field').val());
    submit_data.change.oneThs = parseInt($('#oneThs_field').val());
    submit_data.change.fivThs = parseInt($('#fivThs_field').val());
    submit_data.change.tenThs = parseInt($('#tenThs_field').val());

    // 購入処理

    $.ajax({
      url: "/purchase",
      type: 'POST',
      dataType: 'json',
      data: submit_data,
    })
    .then(
        // 通信成功時のコールバック
        // 購入完了画面
        function (data) {
          window.location.href = '/result';
        },
        // 通信失敗時のコールバック
        function () {
            alert("処理失敗");
        }
    );

    return false;
  });
  // 電子マネー払いの時
  $('#card_use').submit(function(event) {
    event.preventDefault();

    // 投入金額を取得
    let card_amount = 0;
    card_amount = $('#card_field').val();

    // 送信用データ
    let submit_data = {};
    submit_data.card = card_amount;
    submit_data.amount = payPriceSubmit;

    // 購入処理
    $.ajax({
      url: "/purchase_card",
      type: 'POST',
      dataType: 'json',
      data: submit_data,
    })
    .then(
        // 通信成功時のコールバック
        // 購入完了画面
        function (data) {
          if (data.value == 'success') {
            // 支払い成功時
            window.location.href = '/result';
          } else {
            // 支払い失敗時
            window.location.href = '/fail';
          }
        },
        // 通信失敗時のコールバック
        function () {
            alert("処理失敗");
        }
    );

    return false;
  });
});