/**
 * [result.js]
 * 3D 회전 효과가 제거된 고정형 결과 페이지 로직입니다.
 * 시험 데이터 분석, 오답 리스트 생성, 모달 상세 보기 기능을 담당합니다.
 */

// 1. 가상 테스트 결과 데이터 (실제 서비스 시 DB나 localStorage에서 연동)
const testResult = {
    total: 20,
    correct: 17,
    wrongQuestions: [
        { id: 3, q: "네트워크 관리사 2급: OSI 7계층 중 데이터 전송 단위가 '프레임'인 계층은?", user: 3, answer: 2 },
        { id: 8, q: "조주기능사: 다음 중 셰이킹 기법이 반드시 필요한 칵테일은?", user: 1, answer: 4 },
        { id: 15, q: "조주기능사: 와인 보관 시 가장 적절한 온도는?", user: 4, answer: 2 }
    ]
};

// 2. 결과 페이지 초기화 함수
function initResult() {
    // 점수 텍스트 업데이트
    document.getElementById('correct-count').innerText = testResult.correct;
    document.getElementById('total-count').innerText = testResult.total;

    // 합격 여부 계산 (60점 기준)
    const status = document.getElementById('pass-status');
    const passRate = (testResult.correct / testResult.total) * 100;

    if (passRate >= 60) {
        status.innerText = "🎉 축하합니다! 합격입니다.";
        status.style.color = "#2ecc71";
    } else {
        status.innerText = "😭 불합격입니다. 다시 도전하세요.";
        status.style.color = "#d9534f";
    }

    // 오답 번호 버튼 생성
    const container = document.getElementById('wrong-numbers-container');
    container.innerHTML = ''; // 초기화

    testResult.wrongQuestions.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'wrong-num-btn';
        btn.innerText = item.id;
        btn.title = "클릭하여 문제 상세 보기";
        btn.onclick = () => showDetail(item);
        container.appendChild(btn);
    });
}

// 3. 상세 보기 모달 로직 (오답 확인)
function showDetail(item) {
    document.getElementById('modal-q-title').innerText = `제 ${item.id}번 문제 상세 보기`;
    document.getElementById('modal-question-text').innerText = item.q;
    document.getElementById('user-selected').innerText = `${item.user}번`;
    document.getElementById('correct-answer').innerText = `${item.answer}번`;

    // 모달 표시
    document.getElementById('detail-modal').classList.remove('hidden');
}

// 4. 모달 닫기 함수
function closeModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

// 페이지 로드 시 실행
initResult();