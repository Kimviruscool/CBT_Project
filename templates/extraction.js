const paper = document.getElementById('paper');
const statusBox = document.getElementById('processing-status');
const completionArea = document.getElementById('completion-area');
const extractBtn = document.getElementById('extract-btn');

// 1. 3D 효과 유지
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30;
    paper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// 2. 추출 시작 함수 (Workflow 반영)
function startExtraction() {
    const link = document.getElementById('youtube-link').value;

    // Validation: 링크가 비어있는지 확인
    if (!link) {
        alert("❌ 유튜브 링크를 먼저 입력해 주십시오.");
        return;
    }

    // UI 변경: 버튼 비활성화 및 로딩 표시
    extractBtn.disabled = true;
    extractBtn.style.opacity = "0.5";
    statusBox.classList.remove('hidden');
    completionArea.classList.add('hidden');

    // 시뮬레이션: 3초 후 결과 도출
    setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% 확률로 성공 시뮬레이션

        statusBox.classList.add('hidden');
        extractBtn.disabled = false;
        extractBtn.style.opacity = "1";

        if (isSuccess) {
            alert("✅ SUCCESS EXTRACTION: 지문 분석이 완료되었습니다.");
            completionArea.classList.remove('hidden'); // 하단 완료 버튼 등장
        } else {
            alert("❌ FAIL: 영상의 자막을 찾을 수 없거나 분석에 실패했습니다.");
        }
    }, 3000);
}

// 3. 최종 완료 버튼 클릭 시
function finishProcess() {
    alert("새로운 문제집이 DB에 저장되었습니다.");
    location.href = 'index.html';
}