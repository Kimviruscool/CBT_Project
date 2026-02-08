// 3D 회전 및 마우스 추적 로직이 모두 제거되었습니다.

document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 클릭된 버튼의 클래스를 확인하여 목적지 설정
        const isSolvePage = e.currentTarget.classList.contains('solve');

        if (isSolvePage) {
            // 01. 실전 문제 풀이 클릭 시
            location.href = 'test.html';
        } else {
            // 02. 새로운 문제 추출 클릭 시
            location.href = 'extraction.html';
        }
    });
});