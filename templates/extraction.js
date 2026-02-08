// 3D 효과를 위한 변수와 이벤트 리스너가 모두 제거되었습니다.

const statusBox = document.getElementById('processing-status');
const completionArea = document.getElementById('completion-area');
const extractBtn = document.getElementById('extract-btn');

// 1. 추출 시작 함수 (워크플로우 반영)
function startExtraction() {
    const link = document.getElementById('youtube-link').value;

    // [Validation] 링크 입력 여부 확인
    if (!link) {
        alert("❌ 유튜브 링크를 먼저 입력해 주십시오.");
        return;
    }

    // [UI 전환] 처리 중 상태로 변경
    extractBtn.disabled = true;
    extractBtn.style.opacity = "0.5";
    statusBox.classList.remove('hidden');
    completionArea.classList.add('hidden');

    // [Processing] 시뮬레이션: 3초 후 결과 도출 (실제 환경에서는 fetch API 사용)
    setTimeout(() => {
        const isSuccess = Math.random() > 0.2; // 80% 확률로 성공 시뮬레이션

        statusBox.classList.add('hidden');
        extractBtn.disabled = false;
        extractBtn.style.opacity = "1";

        if (isSuccess) {
            // [Alert] 성공 알림 및 완료 버튼 활성화
            alert("✅ SUCCESS EXTRACTION: 지문 분석 및 문제 생성이 완료되었습니다.");
            completionArea.classList.remove('hidden');
        } else {
            // [Alert] 실패 알림
            alert("❌ FAIL: 해당 영상에서 자막을 추출할 수 없거나 분석 중 오류가 발생했습니다.");
        }
    }, 3000);
}

// 2. 최종 완료 버튼 클릭 시 (프로세스 종료)
function finishProcess() {
    alert("새로운 문제집이 DB에 성공적으로 저장되었습니다.");
    location.href = 'index.html';
}