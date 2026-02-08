/**
 * [test.js]
 * 3D 효과가 제거된 고정형 문제 풀이 로직입니다.
 * 과목 선택, 문제 로드, 선택지 관리 및 페이지네이션을 담당합니다.
 */

const setupView = document.getElementById('setup-view');
const quizView = document.getElementById('quiz-view');

// 1. 가상 문제 데이터 (조주기능사, 네트워크관리사 2급)
const quizData = {
    bartender: [
        { q: "다음 중 증류주에 해당하지 않는 것은?", a: ["위스키", "진", "맥주", "보드카"], c: 2 },
        { q: "칵테일 기법 중 '플로팅(Floating)'은 무엇인가요?", a: ["섞기", "층 쌓기", "으깨기", "흔들기"], c: 1 }
    ],
    network: [
        { q: "OSI 7계층 중 3계층에 해당하는 것은?", a: ["물리", "데이터링크", "네트워크", "전송"], c: 2 },
        { q: "IPv4의 주소 길이는 몇 비트인가요?", a: ["16", "32", "64", "128"], c: 1 }
    ]
};

let currentQuestions = [];
let currentIdx = 0;
let userAnswers = []; // 사용자가 선택한 답을 저장하는 배열

// 2. 시험 시작 함수 (과목 선택 후 호출)
function startQuiz() {
    const category = document.getElementById('category-select').value;
    currentQuestions = quizData[category];
    currentIdx = 0;
    userAnswers = new Array(currentQuestions.length).fill(null); // 배열 초기화

    // 헤더 카테고리 텍스트 업데이트
    document.getElementById('display-category').innerText =
        category === 'bartender' ? '조주기능사' : '네트워크관리사 2급';

    // 화면 전환 (설정 화면 -> 문제 화면)
    setupView.classList.add('hidden');
    quizView.classList.remove('hidden');

    loadQuestion();
}

// 3. 문제 렌더링 함수
function loadQuestion() {
    const data = currentQuestions[currentIdx];

    // 지문 및 진행도 표시
    document.getElementById('question-text').innerText = `${currentIdx + 1}. ${data.q}`;
    document.getElementById('progress-text').innerText = `Q ${currentIdx + 1} / ${currentQuestions.length}`;

    // 선택지(보기) 생성
    const container = document.getElementById('options-container');
    container.innerHTML = ''; // 이전 보기 초기화

    data.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-item';

        // 이전에 선택했던 답이 있다면 강조 표시
        if (userAnswers[currentIdx] === idx) {
            btn.classList.add('selected');
        }

        btn.innerText = `(${idx + 1}) ${opt}`;

        // 보기 클릭 시 동작
        btn.onclick = () => {
            document.querySelectorAll('.option-item').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            userAnswers[currentIdx] = idx; // 선택한 번호 저장
        };

        container.appendChild(btn);
    });
}

// 4. 페이지네이션 (이전/다음 버튼)
function nextQuestion() {
    if (currentIdx < currentQuestions.length - 1) {
        currentIdx++;
        loadQuestion();
    } else {
        // 모든 문제를 다 풀었을 때
        const confirmFinish = confirm("마지막 문제입니다. 시험을 종료하고 채점하시겠습니까?");
        if (confirmFinish) {
            // 실제 환경에서는 결과를 localStorage에 담아 result.html로 이동
            alert("채점 페이지로 이동합니다.");
            location.href = 'result.html';
        }
    }
}

function prevQuestion() {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuestion();
    } else {
        alert("첫 번째 문제입나다.");
    }
}