// doPost 함수는 웹훅으로부터 데이터를 받아 처리합니다.
function doPost(e) {
  if (!e.postData || !e.postData.contents) {
    return;
  }

  // 받은 데이터를 JSON으로 파싱
  const update = JSON.parse(e.postData.contents);
  const chatId = update.message.chat.id;  // 채팅 ID 추출
  const updateText = update.message.text; // 메시지 텍스트 추출

  // 메시지 텍스트가 없는 경우 응답 후 함수 종료
  if (!updateText || updateText.toString().trim().length === 0) {
    sendMessage(`저에게는 텍스트로 보내주세요`, chatId);
    return;
  }

  // 메시지 처리 후 응답
  const message = processUpdate(updateText); // 주석 해제시 사용자 정의 메시지 처리 가능
  sendMessage(message, chatId); 
}


// processUpdate 함수는 받은 메시지를 처리합니다.
function processUpdate(prompt) {
  const baseUrl = `https://dart.fss.or.kr/navi/searchNavi.do?naviCrpNm=${prompt}&naviCode=A002`
  return baseUrl; // 받은 메시지를 그대로 반환
}

// sendMessage 함수는 메시지를 Telegram API를 통해 전송합니다.
function sendMessage(text, chat_id) {
  const scriptProps = PropertiesService.getScriptProperties();
  const key = scriptProps.getProperty('telegramApiKey'); // Telegram API 키
  const url = `https://api.telegram.org/bot${key}/sendMessage`; // 메시지 전송 URL
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      text,
      chat_id,
    }),
  };

  // HTTP 요청을 통해 메시지 전송
  const response = UrlFetchApp.fetch(url, options);
  const content = response.getContentText();
  if (!response.getResponseCode().toString().startsWith('2')) {
    console.log(content);
  }
  
}


// https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}

// 만약 토큰 = mytoken123, 
// url =  https://script.google.com/macros/s/AKfycbxOtiONsPmmDJEuwbSGKYEjegi7wRVlmLkR2mIrZoUqlQ-c1SEKA615dTa1qarWmzBC/exec
//==> 아래와 같은 링크를 브라우저에 입력하고 엔터
// https://api.telegram.org/botmytoken123/setWebhook?url=https://script.google.com/macros/s/AKfycbxOtiONsPmmDJEuwbSGKYEjegi7wRVlmLkR2mIrZoUqlQ-c1SEKA615dTa1qarWmzBC/exec
