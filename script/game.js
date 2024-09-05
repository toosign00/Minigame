// Path : script/game.js
// Last modified: 2024-06-13

let gridContainer = document.querySelector('#grid-container'); // grid-container 요소를 선택하고 변수에 할당
let timer = document.querySelector('#timer'); // timer 요소를 선택하고 변수에 할당
let cards = []; // 카드 요소를 저장할 빈 배열 생성
let flippedCard = false; // 카드가 뒤집혔는지 여부를 나타내는 변수 
let firstCard, secondCard; // 첫 번째와 두 번째로 뒤집힌 카드를 저장할 변수 선언
let lockBoard = false; // 게임판이 잠겼는지 여부를 나타내는 변수 
let intervalId; // 타이머 간격을 저장할 변수
let time = 60; // 제한 시간을 저장할 변수, 초기값은 60
let matchedCards = 0; // 맞춘 카드 수를 저장할 변수, 초기값은 0
let stage = 1; // 현재 스테이지를 1
let isRevealingCards = false; // 카드 뒤집는 중인지 여부를 나타내는 변수



const images = [ // 카드 이미지 파일명을 배열로 정의
    'image_01.svg',
    'image_02.svg',
    'image_03.svg',
    'image_04.svg',
    'image_05.svg',
    'image_06.svg',
    'image_07.svg',
    'image_08.svg',
    'image_09.svg',
    'image_10.svg'
];


let retryBtn = document.querySelector('#retry'); // retry 버튼 요소를 선택하고 변수에 할당
let homeBtn = document.querySelector('#home'); // home 버튼 요소를 선택하고 변수에 할당
let sendBtn = document.querySelector('#send-btn'); // send 버튼 요소를 선택하고 변수에 할당
let nextStageBtn = document.querySelector('#next-stage'); // next-stage 버튼 요소를 선택하고 변수에 할당
let scoreBox = document.querySelector('#score-box'); // score-box 요소를 선택하고 변수에 할당

scoreBox.textContent = `YOUR SCORE : STAGE ${stage}`; // score-box 요소에 현재 스테이지 표시

function init() { // 게임 초기화 함수
    matchedCards = 0; // 맞춘 카드 수 초기화
    cards = []; // 카드 배열 초기화
    gridContainer.innerHTML = ''; // 카드 그리드 컨테이너 초기화
    time = 60 - (stage - 1) * 5; // 스테이지에 따라 제한 시간 조정
    timer.textContent = time; // 타이머 초기화

    for (let i = 0; i < 10; i++) { // 카드 이미지 배열을 두 배로 확장
        const card = createCard(images[i]); // 카드 생성
        cards.push(card); // 카드 배열에 추가
    }

    for (let i = 0; i < 10; i++) { // 카드 이미지 배열을 두 배로 확장
        const card = createCard(images[i]); // 카드 생성
        cards.push(card); // 카드 배열에 추가
    }

    cards.sort(() => Math.random() - 0.5); // 0부터 1 사이의 난수를 반환하는 함수, sort() 메서드로 배열 재배치

    cards.forEach(card => { // 카드 배열의 각 요소에 대해 반복문 실행
        gridContainer.appendChild(card); // 카드 그리드 컨테이너에 카드 추가
    });

    revealCards(); // 카드 뒤집기

}
/* 문제가 발생함. 단계가 올라갈수록 시간이 5초씩 감소가됨. 만약에 스테이지를 계속해서 클리어 하여 
제한시간이 5초인 스테이지에 도달했다고 해봄. 5초안에 모든 카드들의 짝을 맞추기란 불가능 하지만 
5초안에 그 스테이지를 클리어하여 다음 스테이지로 넘어갔다고 가정해봄.
그렇다면 다음 스테이지는 제한시간이 0초가 되는 것임. 그렇다면 게임이 시작하자마자 종료가 되어버릴 것으로 예상이됨.
예상만 하고 이것을 증명하지 못하는 이유는 제한시간이 30초 아래만 되어도 제한시간 내에 스테이지를 클리어하기 상당히 어려움.
이렇듯 사실상 불가능한 상황이라 코드를 수정하지는 않았음. 하지만 제한시간이 0초가 될 수 있다는 점이 코드의 허점이라고도 말할 수 있겠음.*/

function createCard(image) { // 카드 생성 함수
    const card = document.createElement('div'); // div 요소를 생성하고 card 변수에 할당
    card.classList.add('card'); // card 요소에 card 클래스 추가
    card.dataset.image = image; // card 요소에 image 데이터 속성 추가

    const front = document.createElement('div'); // div 요소를 생성하고 front 변수에 할당
    front.classList.add('front'); // front 요소에 front 클래스 추가
    front.style.backgroundImage = 'url(./image/question.svg)'; // front 요소에 이미지 추가

    const back = document.createElement('div'); // div 요소를 생성하고 back 변수에 할당
    back.classList.add('back'); // back 요소에 back 클래스 추가
    back.style.backgroundImage = `url(./image/${image})`; // back 요소에 이미지 추가

    card.appendChild(front); // card 요소에 front 요소 추가
    card.appendChild(back); // card 요소에 back 요소 추가

    card.addEventListener('click', flipCard); // card 요소에 click 이벤트 리스너 추가

    return card; // card 반환
}


function revealCards() { // 카드 뒤집기 함수
    isRevealingCards = true; // 카드 뒤집는 중임을 나타내는 변수 true로 변경, 카드가 뒤집히는 중에는 다른 카드를 클릭할 수 없도록 함
    let revealedCards = 0; // 뒤집힌 카드 수를 0으로 초기화
    const intervalId = setInterval(() => { // 일정 시간마다 반복 실행, 카드가 순차적으로 뒤집히도록 하기 위함
        if (revealedCards >= cards.length) { // 뒤집힌 카드 수가 카드 배열의 길이보다 크거나 같으면
            clearInterval(intervalId); // 타이머 정지
            setTimeout(() => { // 3초 후에
                cards.forEach(card => { // 카드 배열의 각 요소에 대해 반복문 실행
                    card.classList.remove('flipped'); // card 요소에 flipped 클래스 제거, 뒷면이 보이도록 함.
                });
                startTimer(); // 타이머 시작
                isRevealingCards = false; // 카드 뒤집는 중임을 나타내는 변수 false로 변경, 카드가 모두 뒤집히고 게임이 시작되어서 다른 카드를 클릭할 수 있도록 함
            }, 3000);
        } else { // 뒤집힌 카드 수가 카드 배열의 길이보다 크거나 같지 않으면
            cards[revealedCards].classList.add('flipped'); // 뒤집히지 않은 카드를 뒤집음
            revealedCards++; // 뒤집힌 카드 수 증가
        }
    }, 300); // 0.3초마다 실행, 0.3초마다 순차적으로 카드가 뒤집힘.
}


function startTimer() { // 타이머 시작 함수
    clearInterval(intervalId); // 이전 타이머 정지
    intervalId = setInterval(() => { // 일정 시간마다 반복 실행
        time--; // 시간 감소
        timer.textContent = time; // 타이머 업데이트
        if (time === 0) { // 시간이 0이 되면
            clearInterval(intervalId); // 타이머 정지
            document.querySelector('.modal').style.display = 'flex'; // 게임오버 모달창 표시
        }
    }, 1000); // 1초마다 실행
}


function flipCard() { // 카드 뒤집기 함수
    if (lockBoard || isRevealingCards) return; // 게임판이 잠겨있거나 카드가 뒤집히는 중이면 함수 종료
    if (this === firstCard) return; // 첫 번째 카드를 다시 클릭하면 함수 종료

    this.classList.add('flipped'); // 클릭한 카드에 flipped 클래스 추가

    if (!flippedCard) { // 카드가 뒤집힌 상태가 아니면
        flippedCard = true; // 카드를 뒤집은 상태로 변경
        firstCard = this; // 첫 번째 카드를 this로 설정
        return; // 함수 종료
    }

    secondCard = this; // 두 번째 카드를 this로 설정
    checkForMatch(); // 카드 매칭 확인
}


function checkForMatch() { // 카드 매칭 확인 함수
    if (firstCard.dataset.image === secondCard.dataset.image) { // 두 카드의 이미지가 같으면
        disableCards(); // 카드 비활성화
        matchedCards += 2; // 맞춘 카드 수 증가
        if (matchedCards === 20) { // 모든 카드를 맞추면
            setTimeout(() => { // 0.8초 후에
                clearInterval(intervalId); // 타이머 멈춤
                document.querySelector('.modal-2').style.display = 'flex'; // 스테이지 클리어 모달창 표시
            }, 800);
            /* 이 부분에서 문제가 있다. 굳이 모든 카드를 맞춘 이후 setTimeout으로 1초 이후에 스테이지 클리어 모달창이 표시 되도록 
            할 이유가 없다. 모든 카드를 맞춘 바로 모달창이 팝업이 되도록 해도 된다. 하지만 문제가 발생했다.
            마지막 카드의 2장의 짝을 맞추기 위해 첫 번째 카드를 클릭하고 두 번째 카드를 클릭하면 카드가 뒤집히기 전에 바로 모달창이 떠 버린다.
            이 문제를 해결하기 위해 setTimeout으로 0.8초 이후에 스테이지 클리어 모달창이 표시 되도록 했다.
            하지만 여기서 또 문제가 발생한다. setTimeout으로 0.8초 이후에 스테이지 클리어 모달창이 표시 되도록 하면
            게임 시간이 0.8초 이하가 남은 상태에서 마지막 카드를 뒤집으면, 0.8초간 타이머가 멈추지 않기 때문에 게임 오버 모달창이 떠 버린다.
            0.8초가 남은 상태에서 마지막 카드를 뒤집는 경우는 사실 거의 없기 때문에, 코드를 수정하지 않았지만, 낮은 확률로 문제가 발생 할 수 있기 때문에
            추후에 수정이 필요해 보인다. 지금은 어떻게 해야 setTimeout 지연시간 동안 타이머가 0이 되어도 게임 오버 모달창이 뜨지 않게 할 수 있는지 모르겠다.
            */
        }
        return; // 함수 종료
    }

    unflipCards(); // 두 카드가 다르면 뒤집힌 카드를 원상태로 뒤집기
}


function disableCards() { // 카드 비활성화 함수
    firstCard.removeEventListener('click', flipCard); // 첫 번째 카드에 대한 click 이벤트 리스너 제거
    secondCard.removeEventListener('click', flipCard); // 두 번째 카드에 대한 click 이벤트 리스너 제거
    resetBoard(); // 게임판 초기화
}


function unflipCards() { // 카드 뒤집기 함수
    lockBoard = true; // 게임판 잠금
    setTimeout(() => { // 1초 후에
        firstCard.classList.remove('flipped'); // 첫 번째 카드의 flipped 클래스 제거
        secondCard.classList.remove('flipped'); // 두 번째 카드의 flipped 클래스 제거
        resetBoard(); // 게임판 초기화
    }, 1000);
}


function resetBoard() { // 게임판 초기화 함수
    [flippedCard, lockBoard] = [false, false]; // flippedCard와 lockBoard 변수 초기화
    [firstCard, secondCard] = [null, null]; // firstCard와 secondCard 변수 초기화
}


init(); // 게임 초기화 함수 호출


retryBtn.addEventListener('click', () => { // retry 버튼에 click 이벤트 리스너 추가
    stage = 1; // 스테이지 초기화
    location.reload(); // 페이지 새로고침
});


homeBtn.addEventListener('click', () => { // home 버튼에 click 이벤트 리스너 추가
    stage = 1; // 스테이지 초기화
    location.href = './index.html'; // index.html로 이동
});

sendBtn.addEventListener('click', () => { // send 버튼에 click 이벤트 리스너 추가
    let nameInput = document.querySelector('.name-input'); // name-input 요소를 선택하고 변수에 할당
    let userId = nameInput.value.trim(); // 사용자 입력값에서 앞뒤 공백을 제거

    if (userId === '') { // 사용자 입력값이 비어있는 경우
        alert('닉네임을 입력해주세요.'); // 경고 메시지 표시
        return; // 함수 종료
    }

    localStorage.setItem(userId, stage); // 사용자 닉네임을 키-값 쌍으로 localStorage에 저장, index.html에서 점수판에 사용자 닉네임과 클리어한 스테이지를 표시하기 위함
    sendBtn.disabled = true; // 버튼 비활성화, 중복 저장 방지를 위함
    nameInput.disabled = true; // 인풋 필드 비활성화, 중복 저장 방지를 위함
});
/* 여기서 또 문제가 발생했다. 보통의 상황에서는 잘 일어나지 않지만 예를 들어 보겠다. a 유저가 1단계에서 게임이 종료되었다.
a 유저는 input 창에 닉네임을 '노현수'로 입력하였다. 그럼 localStorage 값의 키-값의 쌍이 노현수 1로 저장이 되므로
index.html의 점수판에는 노현수 STAGE 1이 생성될 것이다.
그 이후 b 유저가 1단계에서 게임이 종료가 되었다. 우연히도 b 유저도 input 창에 닉네임을 '노현수'로 입력하였다.
이 경우 localStorage 값의 키-값의 쌍이 완벽하게 일치하므로, localStorage에 이미 존재하는 값이다.
이러한 경우에는 새로 localStorage의 키-값 쌍이 추가되지 않는다. localStorage 배열에서, 
가장 최근에 저장된 값이 점수판 상단에 오도록 정렬하는데, 이 경우에는 새로 값이 추가된게 아니므로 점수판 상단으로 위치하지 않는다.
이 문제를 해결하기 위해 많은 검색을 시도해봤으나 명확한 답을 얻지 못하였다. 키-값 쌍은 고유의 값이다 이러한 이야기만 있었다.
명백히 코드의 오류이긴 하지만, 사용자의 input 과 종료된 스테이지가 일치하는 경우는 극히 드물기 때문에, 게임의 진행에는 크게 영향이 없을 것이다.
그래서 수정을 하지 않더라도, 큰 문제는 되지 않을 것으로 예상이 된다. 물론 추후에 이 경우를 해결 할 방법을 찾을 수 있으면 좋겠다.*/

nextStageBtn.addEventListener('click', () => { // next-stage 버튼에 click 이벤트 리스너 추가
    stage++; // 스테이지 증가
    init(); // 게임 초기화 함수 호출
    document.querySelector('.modal-2').style.display = 'none'; // 스테이지 클리어 모달창 숨김
    document.querySelector('.title').textContent = `Stage ${stage}`; // title 요소에 현재 스테이지 표시
    scoreBox.textContent = `YOUR SCORE : Stage ${stage}`; // score-box 요소에 현재 스테이지 표시
});

let homeIcon = document.querySelector('#home-icon'); // home-icon 요소를 선택하고 변수에 할당

homeIcon.addEventListener('click', () => { // home-icon 요소에 click 이벤트 리스너 추가
    location.href = './index.html'; // index.html로 이동
});


/* 주석문으로 작성한 문제점들은 일어날 수 있는 문제점이긴 하지만, 그 확률이 매우 낮고, 대부분의 경우 게임 진행에 
큰 영향을 미치지 않는다. 그리고 위 세가지 문제점들을 해결하기가 나에게는 상당히 어려워서 시간문제상 해결하지 못한채 코드를 유지하였다.
혹시나 저 오류들을 겪는다면 당신은 5초만에 모든 카드들의 짝을 맞추는 실력자 이거나 운이 매우 나쁜 사람이다. ㅋㅋㅋ */


