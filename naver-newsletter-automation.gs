
// 0_secrets :   API KEY 입력하는 부분

const NAVER_CLIENT_ID = '';
const NAVER_CLIENT_SECRET = '';
const OPENAI_API_KEY = ""

// 1_navernews : 네이버 뉴스를 검색하는 부분

/**
 * 네이버 뉴스 검색을 테스트하는 함수
 */
function testNaverNews() {
  const query = "생성형AI"
  const newsCount = 20
  const result = searchNaverNews(query, newsCount)
  console.log({ result })
}


/**
 * 주어진 키워드로 네이버 뉴스를 검색하는 함수
 * @param {string} searchKeyword - 검색할 키워드
 * @param {number} newsCount - 검색 결과로 받을 뉴스 기사 수
 * @returns {Array} 검색된 뉴스 기사 목록
 * @throws {Error} 데이터 가져오기 실패 시 에러를 던짐
 */
function searchNaverNews(searchKeyword, newsCount) {
  var client_id = NAVER_CLIENT_ID;
  var client_secret = NAVER_CLIENT_SECRET;

  var options = {
    method: 'get',
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret
    },
    muteHttpExceptions: true
  };

  var api_url = `https://openapi.naver.com/v1/search/news.json?query=${searchKeyword}&display=${newsCount}&sort=date`;
  const response = UrlFetchApp.fetch(api_url, options);

  const statusCode = response.getResponseCode();
  if (statusCode == 200) {
    const content = response.getContentText();
    const parsedResult = JSON.parse(content);

    // 네이버링크 (link)는 빼기, 어차피 원본링크(originalLink)가 있음
    const items = parsedResult.items.map(item => {
      const { link, ...rest } = item;
      return rest;
    });
    return JSON.stringify(items);

  } else {
    console.error('Error fetching data: ' + response.getContentText());
    throw new Error('Failed to fetch data. Status code: ' + statusCode);
  }
}


/**
 * ChatGPT를 사용하여 뉴스레터 생성을 테스트하는 함수
 */
function testChatGPT() {

  const initialPrompt = `
  아래 내용을 살펴봐, 제일 중요한 5가지 기사 내용을 선별하고 뉴스레터 형태로 만들어줘. 
  뉴스레터에서는 원문 기사가 꼭 들어가 있어야 해
  아주 재미있게 뉴스레터를 작성해줘.
  나는 이메일로 보낼거니까 html 형태로 이쁘게 나오게 작성해줘
  `
  const newsContent =
    `
  [ { title: '삼성·SK 바짝 추격하는 美 마이크론…&quot;6세대 HBM4 내년 상반기 공개&quot; [biz-플...',
       originallink: 'https://www.sedaily.com/NewsView/2DACXN6AH3',
       link: 'https://n.news.naver.com/mnews/article/011/0004349908?sid=101',
       description: '마이크론은 2022년 챗GPT 등 <b>생성형 AI</b>가 출현한 후 HBM이 각광을 받기 시작하자 3세대 HBM(HBM2E)에서 4세대(HBM3) 개발을 건너뛰고 곧바로 5세대 HBM3E 연구에 뛰어드는 강수를 뒀다. 이 전략은 적중했다. 2월 라이벌... ',
       pubDate: 'Thu, 06 Jun 2024 09:20:00 +0900' },
     { title: '제주시, 공직자 대상 챗GPT 업무활용 교육 실시',
       originallink: 'http://www.headlinejeju.co.kr/news/articleView.html?idxno=545395',
       link: 'http://www.headlinejeju.co.kr/news/articleView.html?idxno=545395',
       description: '제주시는 챗GPT가 공공분야에서 상당한 변화를 줄 것으로 예상됨에 따라 지난 5월부터 공직자 대상 <b>생성형AI</b> 업무활용 교육 및 유료 계정 도입을 추진하고 있다. 문정희 정보화지원과장은 &quot;이번 교육을 통해 공무원들이... ',
       pubDate: 'Thu, 06 Jun 2024 09:16:00 +0900' },
     { title: '가상인간 생태계 확장한 엔비디아…韓 업계 &quot;경쟁보다 협업 우선&quot;',
       originallink: 'https://zdnet.co.kr/view/?no=20240605140006',
       link: 'https://n.news.naver.com/mnews/article/092/0002333916?sid=105',
       description: '6일 업계에 따르면 엔비디아는 지난 2일 대만 국립타이완대에서 개최한 \'타이베이 컴퓨텍스\'에서 디지털휴먼 제작 플랫폼 \'엔비디아 ACE <b>생성형 AI</b> 마이크로서비스\'를 출시했다. 개발자는 이 서비스로 가상인간을 제작해... ',
       pubDate: 'Thu, 06 Jun 2024 09:15:00 +0900' },
     { title: '[<b>AI</b>신약社 생존전략上] <b>AI</b>로 신약개발 판 바꾸는 구글...K바이오 미래는',
       originallink: 'http://www.edaily.co.kr/news/newspath.asp?newsid=01088966638919096',
       link: 'https://n.news.naver.com/mnews/article/018/0005757248?sid=101',
       description: '이에 업계에서는 구글 딥마인드가 엔비디아 <b>생성형 AI</b> 기반 신약개발 플랫폼 바이오니모나 마이크로소프트(MS) AI 에보디프보다 앞서있다는 평가가 나왔다. 딥마인드 알파폴드3, 어디까지 진화했나 인공지능(AI)을 이용한... ',
       pubDate: 'Thu, 06 Jun 2024 09:11:00 +0900' },
     { title: '이상인 방통위 부위원장, ‘<b>AI</b>거버넌스 2024’ 참석…이용자 보호정책 발표',
       originallink: 'https://news.kbs.co.kr/news/pc/view/view.do?ncd=7981537&ref=A',
       link: 'https://n.news.naver.com/mnews/article/056/0011736027?sid=105',
       description: '이상인 방통위 부위원장은 이 자리에서 방통위가 현재 준비 중인 ‘AI 서비스 이용자 보호법(가칭)’과 ‘<b>생성형 AI</b> 이용자 보호 가이드라인’ 등 인공지능 이용자 보호를 위한 방통위의 조치 계획을 소개했습니다. 또... ',
       pubDate: 'Thu, 06 Jun 2024 09:06:00 +0900' },
     { title: '롯데뮤지엄에서 열린 특별한 전시회…장애아의 꿈에 날개 단 미드저니',
       originallink: 'https://www.sedaily.com/NewsView/2DACY2U07T',
       link: 'https://n.news.naver.com/mnews/article/011/0004349907?sid=103',
       description: '어린이들의 꿈에 날개를 달아준 건 <b>생성형AI</b>(인공지능) 프로그램 ‘미드저니’. 대홍기획에서 ‘AI 크리에이티브’ 사업을 하고 있는 크리에이티브1본부는 최근 롯데의료재단과 함께 보바스 어린이 의원의 어린이들을... ',
       pubDate: 'Thu, 06 Jun 2024 09:06:00 +0900' },
     { title: '&quot;GD도 카이스트 교수 됐는데&quot;…<b>AI</b> 변화에 뒤처진 韓',
       originallink: 'https://news.mtn.co.kr/news-detail/2024060516325977851',
       link: 'https://news.mtn.co.kr/news-detail/2024060516325977851',
       description: '다만 <b>생성형 AI</b>는 아직 엔터 분야 핵심인 저작권 문제가 해결되지 않은 상태다. AI와 엔터 산업 성장을 위해선 선결 과제부터 짚고 나가야 할 것으로 보인다.■ GD가 교수를? 엔터와 AI 접목 \'빅뱅\'6일 업계에 따르면... ',
       pubDate: 'Thu, 06 Jun 2024 09:06:00 +0900' },
     { title: '<b>AI</b> 패권 새 전쟁터 ‘데이터센터’',
       originallink: 'https://weekly.donga.com/3/all/11/4976215/1',
       link: 'https://n.news.naver.com/mnews/article/037/0000034571?sid=105',
       description: '글로벌 빅테크, <b>AI</b> 밸류체인 핵심 데이터센터 산업에 수백조 원 투자 <b>생성형</b> 인공지능(<b>AI</b>)이 3년째 글로벌 정보기술(IT) 산업의 핵심으로 자리매김하고 있다. 블록체인, 메타버스 등 한때 각광받던 다른 기술과 차이점은... ',
       pubDate: 'Thu, 06 Jun 2024 09:02:00 +0900' },
     { title: '[정책브리핑] 2024년 06월 06일 목요일 주요 정책',
       originallink: 'http://www.sisunnews.co.kr/news/articleView.html?idxno=211415',
       link: 'http://www.sisunnews.co.kr/news/articleView.html?idxno=211415',
       description: '고기동 차관은 기념사를 통해 &quot;인공지능(<b>AI</b>), 빅데이터 등 첨단기술을 적극 활용해 언제, 어디서든 국민이... 전 세계적으로 <b>생성형</b> 인공지능 개발 경쟁이 가속화되고 인공지능이 상용화되는 상황에서 인공지능은... ',
       pubDate: 'Thu, 06 Jun 2024 09:02:00 +0900' },
     { title: '엔비디아, 단숨에 시총 3조달러 돌파…거센 돌풍 이유는?',
       originallink: 'https://www.nocutnews.co.kr/news/6156782?utm_source=naver&utm_medium=article&utm_campaign=20240606090009',
       link: 'https://n.news.naver.com/mnews/article/079/0003902723?sid=104',
       description: '최근 빅테크 간 <b>생성형</b> 인공지능(<b>AI</b>) 개발 경쟁에 힘입어 <b>AI</b> 칩 선두 주자인 엔비디아 주가가 천정부지로 치솟고 있다. 5일(현지시간) 엔비디아 시가총액은 3조 달러를 돌파하며, 미 상장기업 중 두 번째로 큰 회사가... ',
       pubDate: 'Thu, 06 Jun 2024 09:01:00 +0900' },
     { title: '[Tokyo Watch] 미중 전기차 마찰과 일본의 ‘모빌리티DX 전략’ 책정',
       originallink: 'http://www.ifs.or.kr/bbs/board.php?bo_table=NewsInsight&wr_id=51646',
       link: 'http://www.ifs.or.kr/bbs/board.php?bo_table=NewsInsight&wr_id=51646',
       description: '이를 위해 자동차용 반도체 개발 강화, 시뮬레이션 모델의 구축, <b>생성형AI</b> 활용 등에 주력하기로 했다. 이와 함께 자율주행 등 모빌리티 서비스 영역의 혁신, 공급망 전체 차원에서의 데이터 활용 체제 개선, 일본의 B2B... ',
       pubDate: 'Thu, 06 Jun 2024 09:00:00 +0900' },
     { title: '탈북단체 &quot;새벽, 대북전단 20만장 살포&quot;',
       originallink: 'https://news.tvchosun.com/site/data/html_dir/2024/06/06/2024060690002.html',
       link: 'https://n.news.naver.com/mnews/article/448/0000461382?sid=100',
       description: '휴지와 오물량을 다시 집중 살포할 것&quot;이라고 협박한 바 있다. 이번 대북 전단 추가 살포에 북한이 추가로 맞대응을 할 우려가 나온다. [조선일보와 미디어DX가 공동 개발한 <b>생성형 AI</b>의 도움을 받아 작성한 기사입니다.]',
       pubDate: 'Thu, 06 Jun 2024 08:57:00 +0900' },
     { title: '[엔터프라이즈핫이슈] <b>생성형 AI</b> 겨냥 데이터 플랫폼, 테크판 격전지로',
       originallink: 'https://www.digitaltoday.co.kr/news/articleView.html?idxno=520352',
       link: 'https://www.digitaltoday.co.kr/news/articleView.html?idxno=520352',
       description: '기업들이 내부에 보유한 다양한 데이터를 챗GPT로 대표되는 <b>생성형AI</b>에 결합해 맞춤형 AI를 구현할 수 있도록 지원하기 위한 테크 기업들 간 경쟁이 거세다. 이같은 행보는 챗GPT와 같은 범용 거대언어모델(LLM)... ',
       pubDate: 'Thu, 06 Jun 2024 08:50:00 +0900' },
     { title: '네이버 &quot;올해 내 <b>생성형AI</b> vLLM 오픈소스 공개&quot;',
       originallink: 'https://www.digitaltoday.co.kr/news/articleView.html?idxno=520269',
       link: 'https://www.digitaltoday.co.kr/news/articleView.html?idxno=520269',
       description: '네이버 하이퍼클로버 LLM 기준 <b>생성형 AI</b> 출시 순서 [사진: 석대건 기자] 네이버가 올해 내 <b>생성형AI</b> 오픈소스 결과물을 공개한다. 하정우 네이버클라우드 AI 이노베이션 센터장은 \'인텔 AI 서밋 서울 2024\'에서 &quot;(인텔과의... ',
       pubDate: 'Thu, 06 Jun 2024 08:34:00 +0900' },
     { title: 'IBK투자증권, <b>AI</b> 기반 공시·매매 시그널 분석 서비스 개시',
       originallink: 'https://www.etoday.co.kr/news/view/2367367',
       link: 'https://www.etoday.co.kr/news/view/2367367',
       description: '서정학 IBK투자증권 대표이사는 “급변하는 디지털 금융환경 속에서 고객분들의 더 나은 투자 판단을 지원하기 위해 알고리즘 AI 기술을 활용한 서비스를 시작했다”며 “현재 개발 중인 <b>생성형 AI</b> 기술 기반 투자 정보... ',
       pubDate: 'Thu, 06 Jun 2024 08:32:00 +0900' },
     { title: '천덕꾸러기 가스발전에도 \'르네상스\' 올까',
       originallink: 'https://www.electimes.com/news/articleView.html?idxno=338144',
       link: 'https://www.electimes.com/news/articleView.html?idxno=338144',
       description: '챗GPT나 Gemini 등 <b>생성형 AI</b>의 발전에 힘입어 AI 산업 역시 지속 성장이 기대된다. 이를 뒷받침할 데이터센터 산업의 성장세가 크고 빠를 것이라는 얘기다. 삼성증권에 따르면 국내 데이터센터 건설 시장 역시 지난... ',
       pubDate: 'Thu, 06 Jun 2024 08:26:00 +0900' },
     { title: '반도체 업계도 에너지 대란, 서버 이어 PC로도 소비 전력 감소 경쟁',
       originallink: 'https://www.electimes.com/news/articleView.html?idxno=338189',
       link: 'https://www.electimes.com/news/articleView.html?idxno=338189',
       description: '마이크로소프트(MS)와 협력을 통해 윈도우즈 운영체제 호환성을 대폭 확대하고, <b>생성형 AI</b>인 코파일럿 플러스를 처음으로 지원하게 됐다. 인텔과 AMD가 만들던 x86 기반 CPU와 비교하면 전력 소모가 65%에 불과하다는... ',
       pubDate: 'Thu, 06 Jun 2024 08:22:00 +0900' },
     { title: '삼성화재, 국내 최초 글로벌 보험 컨퍼런스 \'KIIC\' 개최',
       originallink: 'http://www.smedaily.co.kr/news/articleView.html?idxno=293352',
       link: 'http://www.smedaily.co.kr/news/articleView.html?idxno=293352',
       description: '서울대 조성준 교수가 \'AI 비즈니스 기회\', 보험연구원 손재희 실장은 \'보험산업의 AI활용과 과제\', 뮌헨재보험 Fabian Winter 박사는 \'뮌헨재보험 <b>생성형 AI</b> 전략\'에 대해 발표했다. 이어 포스텍 정광민 교수 진행으로... ',
       pubDate: 'Thu, 06 Jun 2024 08:06:00 +0900' },
  `


  const result = getGptResponse(initialPrompt, newsContent)
  console.log({ result })
}


function getGptResponse(initialPrompt, newsContent) {
  const finalPrompt = initialPrompt + newsContent
  console.log({ finalPrompt })
  const key = OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    model: 'gpt-4o',
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
    return '다시 시작해 주세요';
  }
}


function testSendEmail() {
  const recipients = ['123@naver.com', '456@naver.com']

  const subject = "AI뉴스레터"
  const body =
    `
   <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>생성형 AI 뉴스레터</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .newsletter {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .article {
            padding: 20px 0;
            border-bottom: 1px solid #ddd;
        }
        .article:last-child {
            border-bottom: none;
        }
        .article h2 {
            font-size: 20px;
            margin: 0 0 10px;
        }
        .article p {
            margin: 0 0 10px;
        }
        .original-link {
            display: inline-block;
            margin-top: 10px;
            font-size: 14px;
            color: #007BFF;
            text-decoration: none;
        }
        .original-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="newsletter">
        <div class="header">
            <h1>📰 생성형 AI 뉴스레터</h1>
            <p>최신 소식을 즐겁게 만나보세요!</p>
        </div>
        
        <div class="article">
            <h2>삼성·SK 바짝 추격하는 美 마이크론…"6세대 HBM4 내년 상반기 공개"</h2>
            <p>마이크론은 2022년 챗GPT 등 생성형 AI가 출현한 후 HBM이 각광을 받기 시작하자 3세대 HBM(HBM2E)에서 4세대(HBM3) 개발을 건너뛰고 곧바로 5세대 HBM3E 연구에 뛰어드는 강수를 뒀다. 이 전략은 적중했다.</p>
            <a class="original-link" href="https://n.news.naver.com/mnews/article/011/0004349908?sid=101" target="_blank">원문 기사 보기</a>
        </div>
        
        <div class="article">
            <h2>제주시, 공직자 대상 챗GPT 업무활용 교육 실시</h2>
            <p>제주시는 챗GPT가 공공분야에서 상당한 변화를 줄 것으로 예상됨에 따라 지난 5월부터 공직자 대상 생성형AI 업무활용 교육 및 유료 계정 도입을 추진하고 있다. 문정희 정보화지원과장은 "이번 교육을 통해 공무원들이..."</p>
            <a class="original-link" href="http://www.headlinejeju.co.kr/news/articleView.html?idxno=545395" target="_blank">원문 기사 보기</a>
        </div>
        
        <div class="article">
            <h2>가상인간 생태계 확장한 엔비디아…韓 업계 "경쟁보다 협업 우선"</h2>
            <p>엔비디아는 지난 2일 대만 국립타이완대에서 개최한 타이베이 컴퓨텍스에서 디지털휴먼 제작 플랫폼 ‘엔비디아 ACE 생성형 AI 마이크로서비스’를 출시했다. 개발자는 이 서비스로 가상인간을 제작해...</p>
            <a class="original-link" href="https://n.news.naver.com/mnews/article/092/0002333916?sid=105" target="_blank">원문 기사 보기</a>
        </div>
        
        <div class="article">
            <h2>[AI신약社 생존전략上] AI로 신약개발 판 바꾸는 구글...K바이오 미래는</h2>
            <p>업계에서는 구글 딥마인드가 엔비디아 생성형 AI 기반 신약개발 플랫폼 바이오니모나 마이크로소프트(MS) AI 에보디프보다 앞서있다는 평가가 나왔다... 인공지능(AI)을 이용한...</p>
            <a class="original-link" href="https://n.news.naver.com/mnews/article/018/0005757248?sid=101" target="_blank">원문 기사 보기</a>
        </div>
        
        <div class="article">
            <h2>이상인 방통위 부위원장, ‘AI거버넌스 2024’ 참석…이용자 보호정책 발표</h2>
            <p>이상인 방통위 부위원장은 이 자리에서 방통위가 현재 준비 중인 ‘AI 서비스 이용자 보호법(가칭)’과 ‘생성형 AI 이용자 보호 가이드라인’ 등 인공지능 이용자 보호를 위한...</p>
            <a class="original-link" href="https://n.news.naver.com/mnews/article/056/0011736027?sid=105" target="_blank">원문 기사 보기</a>
        </div>
    </div>
</body>
</html>
      `
  sendEmail(recipients, subject, body)
}





/**
 * 여러 수신자에게 이메일을 보내는 함수
 * 
 * @param {string[]} recipients - 이메일 수신자의 배열
 * @param {string} subject - 이메일 제목
 * @param {string} body - 이메일 본문 (HTML 가능)
 */
function sendEmail(recipients, subject, body) {
  // 수신자 배열을 쉼표로 구분된 문자열로 결합합니다.
  var recipientString = recipients.join(",");
  const cleanedBody = cleanHtmlString(body);

  // 이메일을 보냅니다.
  MailApp.sendEmail({
    to: recipientString,
    subject: subject,
    htmlBody: cleanedBody
  });
}


/**
 * HTML 문자열에서 불필요한 텍스트를 제거하는 함수
 * 
 * @param {string} str - 원본 문자열
 * @return {string} - 정리된 HTML 문자열
 */
function cleanHtmlString(str) {
  const htmlMatch = str.match(/<!DOCTYPE html>[\s\S]*<\/html>/);
  return htmlMatch ? htmlMatch[0] : str;
}



function sendNewsletter() {


  const keyword = "생성형AI"
  const newsCount = 20
  const prompt = `
  아래 내용을 살펴봐, 제일 중요한 5가지 기사 내용을 선별하고 뉴스레터 형태로 만들어줘. 
  뉴스레터에서는 원문 기사가 꼭 들어가 있어야 해
  아주 재미있게 뉴스레터를 작성해줘.
  나는 이메일로 보낼거니까 html 형태로 예쁘게 나오게 작성해줘
  `

  const newsletterTitle = `AI뉴스레터 (${new Date().toISOString().slice(2, 10).replaceAll('-', '.')})`;
  const recipients = ['123@naver.com', '456@naver.com']


  ///////// 전체 동작들을 합쳐주기 ////////

  // 1. 뉴스 가져오기
  const news = searchNaverNews(keyword, newsCount)

  // 2. gpt 뉴스레터 응답 가져오기
  const gptResponse = getGptResponse(prompt, news)

  // 3. 뉴스레터 메일 보내기
  sendEmail(recipients, newsletterTitle, gptResponse)



}



// 구글시트를 나만의 관리자 화면으로 만들기
// 구글시트 안에서 수신인, 프롬프트, 기사키워드, 제목 기사 개수 설정하기

function sendNewsletterFromSheet() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('뉴스레터');
  const newsletterTitle = sheet.getRange('C5').getValue() + ` (${new Date().toISOString().slice(2, 10).replaceAll('-', '.')})`;
  const keyword = sheet.getRange('C6').getValue();
  const newsCount = sheet.getRange('C7').getValue();
  const prompt = sheet.getRange('C8').getValue();
  const recipients = sheet.getRange('C9').getValue().split(',');

  console.log(newsletterTitle, keyword, newsCount, prompt, recipients)
  ///////// 전체 동작들을 합쳐주기 ////////

  // 1. 뉴스 가져오기
  const news = searchNaverNews(keyword, newsCount)

  // 2. gpt 뉴스레터 응답 가져오기
  const gptResponse = getGptResponse(prompt, news)

  // 3. 뉴스레터 메일 보내기
  sendEmail(recipients, newsletterTitle, gptResponse)

  // 완료 표시
  SpreadsheetApp.getActiveSpreadsheet().toast('뉴스레터가 성공적으로 전송되었습니다!', '완료', 5);


}




// 구글시트에서 바로 테스트뉴스레터 보낼 수 있게 하기
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('뉴스레터')
    .addItem('뉴스레터 보내기', 'sendNewsletterFromSheet')
    .addToUi();
}
