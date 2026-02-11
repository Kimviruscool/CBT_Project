import whisper
import os
import pandas as pd

# 1. 모델 로드 (루프 밖에서 한 번만 로드하여 속도 향상)
print("⏳ Whisper 모델을 로드 중입니다...")
model = whisper.load_model("base")


def transcribe_audio(file_path):
    try:
        print(f"🔄 변환 중: {os.path.basename(file_path)}")
        # fp16=False 옵션으로 경고 방지 및 CPU 최적화
        result = model.transcribe(file_path, language="ko", fp16=False)
        return result["text"]
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    audio_dir = "downloads"
    data_list = []

    # 2. 폴더 내의 모든 mp3 파일 목록 가져오기
    audio_files = [f for f in os.listdir(audio_dir) if f.endswith(".mp3")]

    print(f"📂 총 {len(audio_files)}개의 파일을 발견했습니다.")

    for file_name in audio_files:
        file_path = os.path.join(audio_dir, file_name)

        # 텍스트 추출 실행
        script_text = transcribe_audio(file_path)

        # 3. 데이터 수집 (파일명과 추출된 텍스트)
        data_list.append({
            "file_name": file_name,
            "script": script_text,
            "status": "extracted"  # 나중에 AI 처리가 완료되면 'completed'로 바꿀 용도
        })

    # 4. Pandas DataFrame 생성
    df = pd.DataFrame(data_list)

    # 5. 저장 (CSV 형식 - txt처럼 텍스트 기반이면서 구조화됨)
    # utf-8-sig로 저장해야 엑셀이나 메모장에서 한글이 깨지지 않습니다.
    output_file = "cbt_raw_data.csv"
    df.to_csv(output_file, index=False, encoding="utf-8-sig")

    print(f"\n✅ 모든 변환이 완료되었습니다!")
    print(f"📄 저장된 파일: {os.getcwd()}\\{output_file}")