import "./styles.css";
import { loadCurrentMember, loginWithGoogleAndLoadMember, logout, updateNickname } from "./modules/session/session-service";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("#app root element not found");
}

function renderResult(value: unknown): void {
  const output = document.querySelector<HTMLPreElement>("#session-output");
  if (output) {
    output.textContent = JSON.stringify(value, null, 2);
  }
}

function readNickname(): string {
  const input = document.querySelector<HTMLInputElement>("#nickname-input");
  return input?.value.trim() ?? "";
}

root.innerHTML = `
  <main class="app-shell">
    <h1>photo-canon</h1>
    <div class="actions">
      <button id="login-button" type="button">Google 로그인</button>
      <button id="me-button" type="button">내 멤버 확인</button>
      <button id="logout-button" type="button">로그아웃</button>
    </div>
    <form id="nickname-form" class="actions">
      <input id="nickname-input" name="nickname" maxlength="30" placeholder="username" />
      <button type="submit">닉네임 변경</button>
    </form>
    <pre id="session-output">ready</pre>
  </main>
`;

document.querySelector("#login-button")?.addEventListener("click", async () => {
  renderResult(await loginWithGoogleAndLoadMember());
});

document.querySelector("#me-button")?.addEventListener("click", async () => {
  renderResult(await loadCurrentMember());
});

document.querySelector("#logout-button")?.addEventListener("click", async () => {
  await logout();
  renderResult({ ok: true, signedOut: true });
});

document.querySelector("#nickname-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  renderResult(await updateNickname(readNickname()));
});
