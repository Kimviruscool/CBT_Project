from google import genai
import os

# 1. 클라이언트 설정 (복사한 API 키를 입력하세요)
client = genai.Client(api_key=".")

# 2. 모델 설정 (현재 가장 안정적인 최신 모델 사용)
MODEL_NAME = "gemini-2.5-flash"


def start_chat():
    print(f"--- Gemini AI ({MODEL_NAME}) 테스팅 시작 ---")
    print("(종료하려면 'exit' 입력)")

    while True:
        user_input = input("나: ")

        if user_input.lower() in ['exit', 'quit', '종료']:
            print("프로그램을 종료합니다.")
            break

        try:
            # 3. 답변 생성 요청 (최신 SDK 문법)
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=user_input
            )

            print(f"Gemini: {response.text}")
            print("-" * 30)

        except Exception as e:
            print(f"에러 발생: {e}")


if __name__ == "__main__":
    start_chat()