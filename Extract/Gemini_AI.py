import os
import re
import json
import time
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv

# 1. 보안 및 환경 설정
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("❌ 에러: .env 파일에서 API 키를 찾을 수 없습니다.")
    exit()

genai.configure(api_key=API_KEY)


def get_best_model():
    """내 계정에서 사용 가능한 모델을 자동 탐색하여 404 에러를 방지합니다."""
    try:
        available_models = [
            m.name for m in genai.list_models()
            if 'generateContent' in m.supported_generation_methods and 'flash' in m.name.lower()
        ]
        if available_models:
            print(f"🤖 선택된 AI 모델: {available_models[0]}")
            return genai.GenerativeModel(available_models[0])
    except Exception:
        pass
    return genai.GenerativeModel('gemini-1.5-flash')


model = get_best_model()


# --- 도우미 함수들 ---

def extract_cbt_name(title):
    """파일명에서 자격증 종목 자동 추출"""
    pattern = r'\w+(기능사|기사|관리사|마스터|엔지니어)'
    match = re.search(pattern, title)
    return match.group() if match else "기출문제"


def split_script(text, chunk_size=1200):
    """AI가 지치지 않게 텍스트를 약 1200자 단위로 쪼갭니다."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


def get_questions_with_retry(cbt_name, chunk, chunk_num, max_retries=3):
    """500 에러 발생 시 최대 3번까지 다시 시도합니다."""
    prompt = f"""
    당신은 {cbt_name} 시험 전문 데이터 엔지니어입니다.
    제공된 [스크립트 조각]에서 발견되는 모든 기출문제를 문맥에 맞게 수정하여 JSON으로 추출하세요.
    (예: '조 죽이는 사' -> '조주기능사'로 교정)

    [형식]
    [
      {{
        "question": "문제 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"],
        "answer": 정답인덱스(0-3),
        "explanation": "상세 해설"
      }}
    ]

    [스크립트 조각 {chunk_num}]: {chunk}
    """

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            text = response.text
            # JSON 부분만 정밀하게 추출
            start = text.find("[")
            end = text.rfind("]") + 1
            if start != -1 and end != -1:
                return json.loads(text[start:end])
        except Exception as e:
            if "500" in str(e) or "Internal" in str(e):
                print(f"      ⚠️ {chunk_num}번 조각 서버 지연 (시도 {attempt + 1}/{max_retries})... 5초 후 재시도")
                time.sleep(5)
                continue
            print(f"      ❌ 오류 발생: {e}")
            break
    return []


# --- 메인 실행 로직 ---

if __name__ == "__main__":
    input_file = "cbt_raw_data.csv"
    output_file = "cbt_final_database.csv"

    if not os.path.exists(input_file):
        print(f"❌ {input_file} 파일이 없습니다.")
        exit()

    df = pd.read_csv(input_file)
    final_db = []

    print(f"🚀 총 {len(df)}개 파일에 대한 전 문항 추출을 시작합니다.")

    for _, row in df.iterrows():
        cbt_name = extract_cbt_name(row['file_name'])
        full_script = row['script']

        # 1. 스크립트 쪼개기
        chunks = split_script(full_script)
        print(f"📂 [{cbt_name}] 분석 시작 - 총 {len(chunks)}개 구간 분할")

        for i, chunk in enumerate(chunks):
            print(f"   📦 {i + 1}/{len(chunks)} 구간 처리 중...")

            # 2. 재시도 로직이 포함된 문제 추출
            questions = get_questions_with_retry(cbt_name, chunk, i + 1)

            if questions:
                for q in questions:
                    q['cbt_name'] = cbt_name
                    q['source_file'] = row['file_name']
                    final_db.append(q)
                print(f"      ✅ {len(questions)}개 문항 추가 완료")

            # 3. API 속도 제한 방지 (무료 버전은 필수)
            time.sleep(3)

    # 4. 최종 결과 저장
    if final_db:
        result_df = pd.DataFrame(final_db)
        result_df.to_csv(output_file, index=False, encoding="utf-8-sig")
        print(f"\n✨ 대작업 완료! 총 {len(final_df)}개의 문제가 '{output_file}'에 저장되었습니다.")
    else:
        print("\n❌ 추출된 데이터가 없습니다.")