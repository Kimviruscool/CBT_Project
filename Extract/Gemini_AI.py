import os
import re
import json
import time
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv  # 라이브러리 불러오기

# 1. .env 파일의 환경 변수 로드
load_dotenv()

# 2. 보안 금고에서 키 가져오기
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GENAI_API_KEY:
    print("❌ 에러: .env 파일에서 API 키를 찾을 수 없습니다.")
    exit()

# Gemini 설정
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def extract_cbt_name(title):
    """파일명에서 자격증 종목 자동 추출"""
    keywords = r'\w+(기능사|기사|관리사|마스터|엔지니어)'
    match = re.search(keywords, title)
    return match.group() if match else "일반 자격증"


def generate_questions(cbt_name, script):
    """AI 문제 생성 로직"""
    prompt = f"당신은 {cbt_name} 출제 위원입니다. 다음 내용을 바탕으로 4지선다 문제 3개를 JSON으로 만들어줘: {script}"

    try:
        response = model.generate_content(prompt)
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_json)
    except Exception as e:
        return None


if __name__ == "__main__":
    # CSV 읽기 및 자동화 로직 (이전과 동일)
    df = pd.read_csv("cbt_raw_data.csv")
    final_results = []

    for index, row in df.iterrows():
        cbt_name = extract_cbt_name(row['file_name'])
        print(f"🚀 [{index + 1}/{len(df)}] {cbt_name} 문제 생성 중...")

        questions = generate_questions(cbt_name, row['script'])
        if questions:
            for q in questions:
                final_results.append({
                    "cbt_name": cbt_name,
                    "question": q['question'],
                    "options": q['options'],
                    "answer": q['answer'],
                    "explanation": q['explanation']
                })
        time.sleep(2)  # API 할당량 조절

    # 결과 저장
    pd.DataFrame(final_results).to_csv("cbt_final_database.csv", index=False, encoding="utf-8-sig")
    print("✨ 모든 보안 설정 및 문제 생성이 완료되었습니다!")