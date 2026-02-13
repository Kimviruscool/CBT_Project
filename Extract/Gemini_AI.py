def extract_questions(cbt_name, script_chunk, chunk_num):
    """실패 시 최대 3번까지 재시도하는 로직을 추가했습니다."""
    max_retries = 3  # 최대 재시도 횟수
    retry_delay = 5  # 재시도 전 대기 시간 (초)

    prompt = f"""
    당신은 {cbt_name} 시험 전문 출제 위원입니다.
    제공된 [스크립트 조각]에서 기출문제를 찾아 JSON 배열로 추출하세요.
    [형식]
    [
      {{
        "question": "문제 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"],
        "answer": 정답번호(0-3),
        "explanation": "상세 해설"
      }}
    ]
    [스크립트 조각 {chunk_num}]: {script_chunk}
    """

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            text = response.text
            start = text.find("[")
            end = text.rfind("]") + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])

        except Exception as e:
            # 500 에러인 경우 잠시 쉬었다가 다시 시도합니다.
            if "500" in str(e) or "Internal error" in str(e):
                print(f"   ⚠️ {chunk_num}번 조각 서버 에러 발생 (시도 {attempt + 1}/{max_retries})... {retry_delay}초 후 재시도")
                time.sleep(retry_delay)
                continue
            else:
                print(f"   ❌ 예상치 못한 오류: {e}")
                break

    return []  # 모든 재시도가 실패할 경우 빈 리스트 반환