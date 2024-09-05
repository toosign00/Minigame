// Path : script/main.js
// Last modified: 2024-06-13

let startBtn = document.querySelector('#start-btn'); // start-btn 요소를 선택하고 변수에 할당
        let infoBtn = document.querySelector('#info-btn'); // info-btn 요소를 선택하고 변수에 할당
        let backBtns = document.querySelectorAll('.back-btn'); // back-btn 클래스를 가진 모든 요소들을 선택하고 변수에 할당
        let scoreBoard = document.querySelector('#score-board'); // score-board 요소를 선택하고 변수에 할당
        let output = document.querySelector('#output'); // output 요소를 선택하고 변수에 할당
        

        startBtn.addEventListener('click', () => { // startBtn 요소에 클릭 이벤트 리스너 추가
            location.href = './game.html'; // game.html로 이동
        });


        infoBtn.addEventListener('click', () => { // infoBtn 요소에 클릭 이벤트 리스너 추가
            document.querySelector('#section-01').style.display = 'none'; // section-01 요소를 숨김
            document.querySelector('#section-02').style.display = 'flex'; // section-02 요소를 표시
            document.querySelector('#section-03').style.display = 'none'; // section-03 요소를 숨김
        });

    
        backBtns.forEach((backBtn) => { // backBtns 배열의 각 요소에 대해 반복, forEach문을 사용한 이유는 섹션-02와 섹션-03에서 뒤로가기 버튼을 공유하기 때문
            backBtn.addEventListener('click', () => { // backBtn 요소에 클릭 이벤트 리스너 추가
                document.querySelector('#section-01').style.display = 'flex'; // section-01 요소를 표시
                document.querySelector('#section-02').style.display = 'none'; // section-02 요소를 숨김
                document.querySelector('#section-03').style.display = 'none'; // section-03 요소를 숨김
            });
        });


        scoreBoard.addEventListener('click', () => { // scoreBoard 요소에 클릭 이벤트 리스너 추가
            document.querySelector('#section-01').style.display = 'none'; // section-01 요소를 숨김
            document.querySelector('#section-02').style.display = 'none'; // section-02 요소를 숨김
            document.querySelector('#section-03').style.display = 'flex'; // section-03 요소를 표시
            loadScores();
        });


        function loadScores() { // loadScores 함수 정의
            output.innerHTML = ''; // output 요소의 내용을 초기화
            let scores = []; // scores 배열 생성
            for (let i = 0; i < localStorage.length; i++) { // localStorage의 길이만큼 반복
                let key = localStorage.key(i); // localStorage의 i번째 키를 key 변수에 할당
                let value = localStorage.getItem(key); // key에 해당하는 값을 value 변수에 할당
                scores.push({ // scores 배열에 key와 value를 객체로 추가
                    key, 
                    value
                });
            }

            scores.sort((a, b) => new Date(b.key) - new Date(a.key)); // 최신 값이 먼저 오도록 역순으로 배열을 정렬

            while (scores.length > 11) { // scores 배열의 길이가 11보다 크면
                let oldest = scores.shift(); // scores 배열의 첫 번째 요소를 oldest 변수에 할당하고, scores 배열에서 제거
                localStorage.removeItem(oldest.key); // oldest의 key에 해당하는 값을 localStorage에서 제거
            } // 점수판의 공간 문제로 11개까지만 저장
            

            scores.forEach(score => { // scores 배열의 각 요소에 대해 반복
                let scoreEntry = document.createElement('h1'); // h1 요소를 생성하고 scoreEntry 변수에 할당
                scoreEntry.classList.add('scoreboard-title'); // scoreEntry 요소에 scoreboard-title 클래스 추가
                scoreEntry.textContent = `${score.key} STAGE ${score.value}`; // scoreEntry 요소의 텍스트 내용을 설정
                output.appendChild(scoreEntry); // output 요소의 자식 요소로 scoreEntry 요소 추가
            });
        }


        window.addEventListener('load', loadScores); // window에 로드 이벤트 리스너 추가, loadScores 함수 호출


        function addScore(key, value) {  // addScore 함수 정의
            localStorage.setItem(key, value); // key와 value를 localStorage에 저장
            loadScores(); // loadScores 함수 호출
        }