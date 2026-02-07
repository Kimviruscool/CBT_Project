const paper = document.getElementById('paper');

document.addEventListener('mousemove', (e) => {
    // 화면 중앙 기준 마우스 위치 계산
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

    // 종이 카드에 회전 효과 적용
    paper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// 마우스가 화면을 벗어날 때 원래대로 복구
document.addEventListener('mouseleave', () => {
    paper.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

// 버튼 클릭 시 콘솔 로그 (추후 페이지 이동 연결)
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.currentTarget.classList.contains('solve') ? '시험 시작' : '문제 추출';
        console.log(`${type} 메뉴로 이동합니다.`);
    });
});