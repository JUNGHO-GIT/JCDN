# JCDN Architecture

---

## 1. 프로젝트 설명

JCDN은 CSS 유틸리티 라이브러리(Jstyle)와 한국어 웹폰트(Pretendard)를 CDN으로 배포하기 위한 정적 자산 저장소이다.
애플리케이션 서버 없이, SWC 기반 빌드 파이프라인으로 TypeScript를 트랜스파일하고 CSS/폰트 파일을 관리한다.

---

## 2. 기술 스택

| 항목 | 상세 |
|------|------|
| 언어 | TypeScript 5.9.3, JavaScript (ESM) |
| 런타임 | Bun (primary), Node.js 20+ (fallback) |
| 빌드 | `@swc/core` 1.15.3, `esbuild` 0.27.1, `tsc-alias` 1.8.16 |
| 린트 | ESLint 9.39.1 + `@typescript-eslint` 8.48.1 |
| CSS | `clean-css` 5.3.3 (minification) |
| 코드 정리 | `ts-morph` 27.0.2, `ts-prune` 0.10.3 |
| 패키지 | npm (jcdn v1.3.0, private, Apache-2.0) |

---

## 3. 디렉토리 구조

```
JCDN_PRIVATE/
├── .github/                   # GitHub 설정 (copilot-instructions, architecture)
├── .node/
│   ├── lib/                   # 공유 유틸 (utils.mjs, settings.mjs, env.mjs)
│   └── mjs/                   # 빌드·도구 스크립트 (swc.mjs, fix.mjs, sync.mjs 등)
├── .vscode/                   # 에디터 설정
├── font/                      # Pretendard 폰트 (legacy 경로)
│   ├── common/                # 정적 weight (.woff/.woff2)
│   └── variable/              # 가변 폰트
├── fonts/                     # Pretendard 폰트 (현행 경로)
│   ├── common/
│   └── variable/
├── style/                     # 컴파일된 CSS (legacy 경로)
│   └── jstyle/                # Jstyle 유틸리티 CSS 파셜
├── styles/                    # 컴파일된 CSS (현행 경로)
│   └── jstyle/
├── index.ts                   # 루트 엔트리포인트 (비어 있음)
├── package.json               # 프로젝트 매니페스트 + npm 스크립트
├── package.default.json       # 기본 devDependencies 템플릿
├── eslint.config.mjs          # ESLint flat config (ESM, source of truth)
├── eslint.config.js           # ESLint flat config (CJS entrypoint)
├── tsconfig.json              # TypeScript 설정 (extends tsconfig.paths.json)
├── tsconfig.default.json      # 전체 옵션 참조 문서 (수정 금지)
├── tsconfig.paths.json        # 경로 alias 정의
└── .server.swcrc              # SWC 트랜스파일러 설정
```

**수정 금지 목록:**
- `node_modules/`, `bun.lockb`, `package-lock.json` — 패키지 매니저 관리
- `font/`, `fonts/`, `style/`, `styles/` — 생성된 CDN 자산
- `tsconfig.default.json` — 참조용 문서
- `package.default.json` — 기본 의존성 템플릿

---

## 4. 빌드 / 실행 명령어

**의존성 설치:**

```shell
bun install          # 기본 (Bun)
npm install          # fallback (Node.js)
```

**빌드:**

```shell
bun run build        # SWC 빌드 (bun .node/mjs/swc.mjs --bun --build --server)
```

**개발 서버 (watch):**

```shell
bun run start        # SWC watch 모드 (bun .node/mjs/swc.mjs --bun --start --server)
```

**Node.js fallback** (Bun 미설치 환경):

```shell
node .node/mjs/swc.mjs --npm --build --server
```

**린트:**

```shell
bunx eslint .        # 린트 체크 (exit 0 = clean)
```

---

## 5. 사용 가능한 스크립트

| 명령어 | 설명 | 실제 실행 |
|--------|------|-----------|
| `bun run build` | SWC 서버 빌드 | `bun .node/mjs/swc.mjs --bun --build --server` |
| `bun run start` | SWC watch 모드 | `bun .node/mjs/swc.mjs --bun --start --server` |
| `bun run sync` | 업스트림(JNODE) 자산 동기화 | `bun .node/mjs/sync.mjs --bun --sync --server` |
| `bun run fix` | ESLint fix + 미사용 export 제거 | `bun .node/mjs/fix.mjs --bun --fix` |
| `bun run reset` | node_modules + 잠금파일 초기화 | `bun .node/mjs/reset.mjs --bun --reset` |
| `bun run vsce` | VSCode 확장 패키징 | `bun .node/mjs/vsce.mjs --bun --package` |
| `bun run git-push-y` | Git push (자동 확인) | `bun .node/mjs/git.mjs --bun --push --y` |
| `bun run git-push-n` | Git push (수동 확인) | `bun .node/mjs/git.mjs --bun --push --n` |
| `bun run merge` | 브랜치 병합 | `bun .node/mjs/merge.mjs --bun` |

> ⚠️ `bun run fix` 는 소스 파일을 직접 수정하므로 개발자 승인 없이 실행 금지.
