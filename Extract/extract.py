import youtube_transcript_api as youtube_api

extract_link = input()
# print(extract_link,'링크 입력')

b = youtube_api.YouTubeTranscriptApi.get_transcript(extract_link, languages=['ko', 'en'])