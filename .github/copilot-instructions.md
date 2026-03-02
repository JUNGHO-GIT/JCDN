# Copilot Instructions for JCDN

---

## 1. 핵심 원칙

- **Readability > Performance > Cleverness** — 명확한 변수명, 극단적 축약 금지
- **SRP (Single Responsibility)** — 함수/클래스는 하나의 역할만 수행
- **Fail-fast** — 잘못된 입력은 즉시 에러 반환, 깊은 분기 금지
- **Flat structure** — 최대 4단계 들여쓰기 (ESLint `max-depth: 4`)
- **Never fabricate** — 모르면 모른다고 답하고, 추측 금지

---

## 2. 포매팅

- **Indentation**: 탭 (ESLint `indent: tab`)
- **Brace style**: Stroustrup — `else` / `catch` / `finally` 는 닫는 중괄호 **다음 줄**에 작성
- **Semicolons**: 항상 사용 (ESLint `semi: always`)
- **Trailing comma**: 배열·객체·import/export 는 multiline 시 trailing comma 필수, 함수 인자는 금지
- **Quotes**: 백틱 전용 (ESLint `quotes: backtick`)
- **한 줄에 하나의 statement** (ESLint `max-statements-per-line: 1`)
- **줄 끝 공백 금지**, EOL 빈 줄 0개
- **Comment 구분선**: `-----------` 스타일 사용, `=======` 금지

```js
// ✅ CORRECT
if (p1) {
  return rs;
}
else {
  f(e);
}
try {
  f1();
}
catch (e) {
  f2();
}
finally {
  f3();
}
```

```js
// ❌ INCORRECT
if (p2) {
} else { f(e); }
if (p2) return rs; else f(e);
```

---

## 3. 네이밍 컨벤션

| 대상 | 컨벤션 | 예시 |
|------|--------|------|
| 파일 (스크립트) | kebab-case.mjs | `fix.mjs`, `swc.mjs` |
| 파일 (TypeScript) | kebab-case.ts | `util-helper.ts` |
| CSS 파일 | PascalCase 또는 번호 | `Jstyle.css`, `1_height.css` |
| 클래스 / 인터페이스 | PascalCase | `class ProjectAnalyzer {}` |
| 함수 / 변수 | camelCase | `const buildProject = () => {}` |
| 상수 | UPPER_SNAKE_CASE | `const MAX_RETRIES = 3` |

---

## 4. Java 규칙

- Java 11 (LTS) 기준
- `Optional` 반환 — null 반환 대신 `Optional.ofNullable()` 사용
- 지역 변수는 가능한 `final` 선언
- 반복문보다 Stream API 우선
- 구체적 예외 catch — `catch (Exception e)` 금지, `catch (IOException e)` 등 구체 타입 사용

---

## 5. TypeScript 규칙

- **Ternary / IIFE 우선** — `if-else` 대신 삼항 연산자 또는 IIFE 사용 (JS/TS 한정)
- **Single Exit Point** — 함수 중간 return 금지, 변수에 할당 후 마지막에 return
- **`any` 금지** — ESLint `@typescript-eslint/no-explicit-any: warn`
- **Object keys**: double quotes (`"key": value`)
- **Arrow function 우선** — `function` 선언 대신 `const f = () => {}`
- **`const` 기본** — 값 변경 없으면 `let` 금지 (ESLint `prefer-const`)
- **Template literals** — 문자열은 항상 백틱
- **`=` / `:` 앞뒤 공백 1개** — 단, 매개변수 기본값은 공백 없음 `(a=1) => {}`

**삼항 체이닝 예시:**

```js
// ✅ CORRECT
!s || s === `p1` ? (
  f()
) : s === `p2` ? (
  f(s, `yy`)
) : (
  f(s)
)
```

```js
// ❌ INCORRECT
(!s || s === "p1") ? f() : (s === "p2") ? f(s, "yy") : f(s);
```

**IIFE 규칙:**
- 삼항으로 부족할 때만 IIFE 사용
- 과도한 IIFE 금지 — 변수를 먼저 추출한 뒤 최종 삼항으로 처리

```js
// ✅ CORRECT
const d = tp ? path.join(cwd, tp) : cwd;
const rs = ee && fs.existsSync(d);
return rs;
```

```js
// ❌ INCORRECT — 불필요한 IIFE
return ee ? (() => {
  const d = tp ? path.join(cwd, tp) : cwd;
  return fs.existsSync(d);
})() : false;
```

---

## 6. SQL / MyBatis 규칙

- **`#{}` 강제** — 파라미터 바인딩은 반드시 PreparedStatement 방식
- **`${}` 금지** — SQL Injection 위험, 절대 사용 금지
- **SQL 키워드 대문자** — `SELECT`, `FROM`, `WHERE`, `INSERT`, `UPDATE`, `DELETE`

```sql
-- ✅ CORRECT
SELECT user_id, user_name
FROM users
WHERE user_id = #{userId}

-- ❌ INCORRECT
select user_id from users where user_id = ${userId}
```

---

## 7. 테스트 규칙

- **Given-When-Then** 패턴 사용
- **한글 메서드명 허용** — `void 사용자_생성_성공()` 등 테스트에서는 한글 OK
- 현재 이 저장소에는 테스트 프레임워크 없음 (정적 CDN 자산 저장소)

---

## 8. 에러 핸들링

- **NEVER empty catch** — `catch` 블록에 최소 로깅 또는 재throw 필수
- **Fail-fast** — 유효하지 않은 상태는 함수 시작부에서 즉시 에러
- **Contextual message** — 에러 메시지에 어떤 값이 문제인지 포함

```js
// ✅ CORRECT
catch (e) {
  console.error(`Config load failed: ${filePath}`, e);
  throw e;
}

// ❌ INCORRECT
catch (e) {}
```

---

## 9. Commit 메시지

Conventional Commits 형식 사용:

```
<type>(<scope>): <subject>

feat(style): add responsive grid utilities
fix(build): resolve SWC path alias error
chore(deps): bump typescript to 5.9.3
docs(readme): update build instructions
```

| type | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `chore` | 빌드, 설정, 의존성 |
| `docs` | 문서만 변경 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `test` | 테스트 추가/수정 |

---

## 10. 에이전트 행동 규칙

1. **Surgical edit** — 최소한의 변경만 수행, 관련 없는 코드 수정 금지
2. **ESLint 자동 fix 금지** — `bun run fix` 는 개발자 승인 없이 실행하지 마라. 소스 파일을 직접 수정하고 export를 제거함
3. **빌드 자동 실행 금지** — 빌드 성공 여부 확인이 필요할 때만 `bun run build` 실행
4. **이 문서를 먼저 참조** — codebase 탐색은 이 문서에 없는 정보가 필요할 때만
5. **명령 실패 시 대안 시도 금지** — 실패 에러와 정확한 메시지를 보고하라
6. **생성된 자산 수정 금지** — `style/`, `styles/`, `font/`, `fonts/` 디렉토리 파일은 직접 편집하지 마라
7. **`tsconfig.default.json` 수정 금지** — 참조용 문서 파일이며, 실제 설정은 `tsconfig.json`

---

## 11. Changes 섹션

작업 완료 후 PR 본문에 변경 파일별 한 줄 요약을 반드시 포함:

```markdown
## Changes

- **파일경로** — 변경 내용 한 줄 요약
- **파일경로** — 변경 내용 한 줄 요약
```