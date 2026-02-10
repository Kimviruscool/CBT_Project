import yt_dlp
import os


def download_youtube_audio(url, output_dir='downloads'):
    """
    유튜브 링크에서 오디오만 추출하여 mp3로 저장합니다.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # yt-dlp 설정 옵션
    ydl_opts = {
        'format': 'bestaudio/best',  # 최상의 오디오 품질 선택
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',  # mp3 포맷으로 변환
            'preferredquality': '192',  # 비트레이트 설정
        }],
        'outtmpl': f'{output_dir}/%(title)s.%(ext)s',  # 파일명 저장 규칙
        'quiet': False,  # 진행 상황 표시
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            # 다운로드된 파일 경로 반환
            file_path = ydl.prepare_filename(info).replace('.webm', '.mp3').replace('.m4a', '.mp3')
            return {"success": True, "file_path": file_path, "title": info['title']}
    except Exception as e:
        return {"success": False, "message": str(e)}


# --- 실행 테스트 ---
if __name__ == "__main__":
    youtube_url = "https://www.youtube.com/watch?v=Xi7-7vcMeMg"
    result = download_youtube_audio(youtube_url)

    if result["success"]:
        print(f"✅ 다운로드 성공: {result['title']}")
        print(f"📁 저장 경로: {result['file_path']}")
    else:
        print(f"❌ 다운로드 실패: {result['message']}")