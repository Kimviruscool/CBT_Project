import whisper
import os
import pandas as pd

def transcribe_audio(file_path):
    """
    오디오 파일을 읽어 텍스트로 변환합니다.
    """
    if not os.path.exists(file_path):
        return "파일을 찾을 수 없습니다."

    # 모델 로드 (base, small, medium, large 중 선택)
    # 4분 내외 100건이라면 'base' 또는 'small' 모델을 추천합니다 (속도 중심)
    model = whisper.load_model("base")

    try:
        print(f"🔄 변환 시작: {os.path.basename(file_path)}")
        # 한국어(ko)로 언어를 지정하면 더 정확합니다.
        result = model.transcribe(file_path, language="ko")
        return result["text"]
    except Exception as e:
        return f"변환 중 오류 발생: {str(e)}"


# --- 실행 테스트 ---
if __name__ == "__main__":
    # 이전에 yt-dlp로 받은 파일 경로를 넣으세요
    audio_file = "downloads/[01편]2025~2026년 조주기능사 필기시험 기출 및 예상문제.mp3"
    text_result = transcribe_audio(audio_file)

    print("\n📝 변환 결과:")
    print(text_result)
    # pandas DataFrame save