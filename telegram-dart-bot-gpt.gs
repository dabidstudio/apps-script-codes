
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


//기존 processUpdate
// function processUpdate(prompt) {
//   const baseUrl = `https://dart.fss.or.kr/navi/searchNavi.do?naviCrpNm=${prompt}&naviCode=A002`;
//   return baseUrl; // 받은 메시지를 그대로 반환
// }


// processUpdate 함수는 받은 메시지를 처리합니다.
function processUpdate(prompt) {
  const baseUrl = `https://dart.fss.or.kr/navi/searchNavi.do?naviCrpNm=${prompt}&naviCode=A002`;

  const contentUrl = getActualURL(prompt)
  const promptContent = getHTMLDetails(contentUrl)
  console.log({promptContent})

  const gptResponse = getGptResponse(promptContent)
  const fullResponse = baseUrl + "\n\n" + gptResponse
  return fullResponse;
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


// 1단계) NAVER => NAVER의 사업개요가 실제로 있는 URL를 반환
function getActualURL(prompt) {
  const baseUrl = `https://dart.fss.or.kr/navi/searchNavi.do?naviCrpNm=${prompt}&naviCode=A002`;

  // UrlFetchApp을 사용하여 URL의 HTML 내용을 가져옵니다.
  const response = UrlFetchApp.fetch(baseUrl);
  const htmlContent = response.getContentText();

  // Cheerio를 사용하여 HTML을 파싱합니다.
  const $ = Cheerio.load(htmlContent);

  // 'naviIfrm_1' ID를 가진 iframe의 src 속성을 추출합니다.
  const iframeSrc = $('iframe#naviIfrm_1').attr('src');
  const domain = "https://dart.fss.or.kr"
  console.log(domain + iframeSrc)
  return domain + iframeSrc; // iframe의 src 속성을 반환
}

//2단계) NAVER 사업개요 URL => 처음부터 3,000자까지 내용 반환
function getHTMLDetails(url) {
  const response = UrlFetchApp.fetch(url);
  const htmlContent = response.getContentText();

  // Cheerio를 사용하여 HTML을 파싱합니다.
  const $ = Cheerio.load(htmlContent);
  let bodyText = $('body').text();
  // 줄 바꿈 및 기타 공백 제거하기
  bodyText = bodyText.replace(/\s+/g, ' ').trim();

  // 출력을 처음 3,000자로 제한
  bodyText = bodyText.substring(0, 3000);

  return bodyText
}

//3단계) 3,000자 => 이 정보를 요약한 GPT의 결과 반환
function getGptResponse(contentPrompt) {
  const initialPrompt = "아래 내용을 10줄 이내로 요약해줘. 무조건 300자 이내로 해줘 "
  const finalPrompt = initialPrompt + contentPrompt
  const scriptProps = PropertiesService.getScriptProperties();
  const key = scriptProps.getProperty('chatGptApiKey');
  const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: finalPrompt }],
    temperature: 1,
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    muteHttpExceptions: true,
    payload: JSON.stringify(payload),
  };

  const response = UrlFetchApp.fetch(url, options);
  const content = response.getContentText();
  const jsn = JSON.parse(content);
  console.log({ jsn })
  if (jsn.choices && jsn.choices[0] && jsn.choices[0].message) {
    console.log(jsn.choices[0].message.content);
    return jsn.choices[0].message.content;
  } else {
    return 'Please try again';
  }
}