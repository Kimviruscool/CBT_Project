const paper = document.getElementById('paper');

// 1. 3D 효과
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
    paper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// 2. 가상 테스트 결과 데이터 (실제로는 localStorage 등에서 가져와야 함)
const testResult = {
    total: 20,
    correct: 17,
    wrongQuestions: [
        { id: 3, q: "네트워크 관리사 2급: OSI 7계층 중 데이터 전송 단위가 '프레임'인 계층은?", user: 3, answer: 2 },
        { id: 8, q: "조주기능사: 다음 중 셰이킹 기법이 반드시 필요한 칵테일은?", user: 1, answer: 4 },
        { id: 15, q: "조주기능사: 와인 보관 시 가장 적절한 온도는?", user: 4, answer: 2 }
    ]
};

// 3. 결과 페이지 초기화
function initResult() {
    document.getElementById('correct-count').innerText = testResult.correct;
    document.getElementById('total-count').innerText = testResult.total;

    const status = document.getElementById('pass-status');
    const passRate = (testResult.correct / testResult.total) * 100;

    if (passRate >= 60) {
        status.innerText = "🎉 축하합니다! 합격입니다.";
        status.style.color = "#2ecc71";
    } else {
        status.innerText = "😭 불합격입니다. 다시 도전하세요.";
        status.style.color = "#d9534f";
    }

    const container = document.getElementById('wrong-numbers-container');
    testResult.wrongQuestions.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'wrong-num-btn';
        btn.innerText = item.id;
        btn.onclick = () => showDetail(item);
        container.appendChild(btn);
    });
}

// 4. 상세 보기 모달 로직
function showDetail(item) {
    document.getElementById('modal-q-title').innerText = `제 ${item.id}번 문제 상세`;
    document.getElementById('modal-question-text').innerText = item.q;
    document.getElementById('user-selected').innerText = `${item.user}번`;
    document.getElementById('correct-answer').innerText = `${item.answer}번`;

    document.getElementById('detail-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

initResult();