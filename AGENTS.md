# 프로젝트 작업 규칙

코드 작업을 시작하기 전에 기존 파일과 설정을 확인하고, 필요한 부분만 수정한다.

- HTML, CSS, JavaScript 코드는 각각 분리된 파일에 작성한다.
- `index.html`은 프로젝트 루트에 둔다. 애플리케이션 CSS와 JavaScript 파일은 `src` 폴더에 두고, `vite.config.js` 등 설정 파일은 프로젝트 루트에 둔다.
- JavaScript는 `index.html`에서 모듈 방식으로 연결한다. CSS는 JavaScript 진입 파일에서 import하여 Vite 빌드에 포함한다.
- 외부 JavaScript 라이브러리는 `npm install`로 설치한 뒤 import하여 사용한다. CDN 방식은 사용하지 않는다.
- 배포 전 `npm run build`로 빌드 결과를 확인한다.

Netlify 배포 설정: Build command는 `npm run build`, Publish directory는 `dist`를 사용한다.
