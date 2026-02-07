const paper = document.getElementById('paper');
const setupView = document.getElementById('setup-view');
const quizView = document.getElementById('quiz-view');

// 1. 3D Interaction
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
    paper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// 2. 가상 문제 데이터
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

// 3. 시험 시작 함수
function startQuiz() {
    const category = document.getElementById('category-select').value;
    currentQuestions = quizData[category];
    currentIdx = 0;

    document.getElementById('display-category').innerText =
        category === 'bartender' ? '조주기능사' : '네트워크관리사 2급';

    setupView.classList.add('hidden');
    quizView.classList.remove('hidden');
    loadQuestion();
}

// 4. 문제 로드
function loadQuestion() {
    const data = currentQuestions[currentIdx];
    document.getElementById('question-text').innerText = `${currentIdx + 1}. ${data.q}`;
    document.getElementById('progress-text').innerText = `Q ${currentIdx + 1} / ${currentQuestions.length}`;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    data.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-item';
        btn.innerText = `(${idx + 1}) ${opt}`;
        btn.onclick = () => {
            document.querySelectorAll('.option-item').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
        container.appendChild(btn);
    });
}

function nextQuestion() {
    if (currentIdx < currentQuestions.length - 1) {
        currentIdx++;
        loadQuestion();
    } else {
        alert("마지막 문제입니다. 채점 페이지로 이동합니다.");
    }
}

function prevQuestion() {
    if (currentIdx > 0) {
        currentIdx--;
        loadQuestion();
    }
}