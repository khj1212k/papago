const testAreaArray = document.getElementsByClassName('Card__body__content');

// 변수 네이밍 컨벤션, 도메인과 관련된 용어를 미리 정의
// sourse 번역할 텍스트와 관련된 명칭. (안녕하세요 를 번역하고싶으면, 안녕하세요가 sourse)
// target : 번역된 결과와 관련된 명칭 (Hello)

const [sourceTextArea , targetTextArea] = testAreaArray;
const [sourceSelect,targetSelect] = document.getElementsByClassName('form-select');

//번역하고자 하는 언어타입(한국어 일본어 영어)
let targetLanguage = 'en' // 기본값으로 영어 en

//어떤 언어로 번역할지 선택하는 target selectBox의 선택지의 값이 바뀔때마다 이벤트를 발생하도록
//, 지정한 언어의 타임값을 targetLanguage변수에 할당 출력.
// change 이벤트사용, selectbox 객체가 가지고있는 프로퍼티 활용

targetSelect.addEventListener('change', ()=>{
    const targetValue = targetSelect.value;
    targetLanguage = targetValue;

    // // 제가 한 방법
    // const selectedIndex = targetSelect.selectedIndex;
    // targetLanguage = targetSelect.options[selectedIndex].value;
});

let debouncer;
sourceTextArea.addEventListener('input', (event) => {
    if(debouncer) { // debouncer 변수에 값이 있으면 true, 없으면 false
        clearTimeout(debouncer);
    }
    
    //setTimeout(콜백함수, 지연시킬 시간(ms)) 비동기적으로 움직임
    //콜백함수 : 지연시간이후 동작할 코드
    debouncer = setTimeout(() => {
        const text = event.target.value; // sourceTextArea에 입력한 값

        // ajax 활용하여 비동기http요청 전송
        const xhr = new XMLHttpRequest();
        
        const url = '/detectLangs'; // node서버의 특정 url 주소

        xhr.onreadystatechange = () =>{
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 최종적으로 파파고가 번역해준 텍스트 결과를 받는 부분 ==> 서버의 응답결과 확인하는 부분
                const parsedData = JSON.parse(xhr.responseText);
                console.log(parsedData);
                
                const result = parsedData.message.result;

                const options = sourceSelect.options;
                
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === result.srcLangType) {
                        sourceSelect.SelectedIndex = i;
                    }
                    
                }

                targetTextArea.value = result.translatedText;
                
            }
        }

        // 요청준비
        xhr.open('POST',url);

        //요청보낼때 동봉할 객체object
        const requestData = {
            // text: text, // 프로퍼티와 변수명이 동일한경우 하나만 쓰면 된다.
            text,
            targetLanguage, // targetLanguage : targetLanguage,와 같음

        };

        //클라이언트가 서버에 보내는 요청 데이터의 형식이 json 형식임을 명시
        xhr.setRequestHeader('Content-type','application/json'); // text/html 등 여러가지있음 header : 제품은 설명서정도

        // 보내기 전에 해야할 일,js object를 json으로 변환(직렬화)
        const jsonData = JSON.stringify(requestData);

        //실제 요청 전송
        xhr.send(jsonData);

    },3000)
});



