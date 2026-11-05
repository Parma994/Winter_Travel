# 배경 사진 폴더

메인 화면과 각 여행 탭 맨 위 배너에 쓰는 사진이에요.

| 파일 | 쓰는 곳 |
|---|---|
| Tampere.jpg | 메인 탭 맨 위 |
| TampereHome.jpg | 일상 탭 배너 |
| Helsinki.jpg | 헬싱키 탭 배너 |
| Stockholm.jpg | 스톡홀름 탭 배너 |
| London.jpg | 런던 탭 배너 |
| Lapland.jpg | 북극권 탭 배너 |
| Copenhagen.jpg | 귀국 전 코펜하겐 탭 배너 |

- 같은 이름으로 덮어쓰면 바로 바뀌어요.
- 이름을 바꾸거나 사진을 새로 추가하면 두 군데를 고쳐야 해요.
  - `index.html`의 `src`
  - `sw.js`의 `APP_FILES` 목록 (그리고 `CACHE_VERSION`을 하나 올리기)
