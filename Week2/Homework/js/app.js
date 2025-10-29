import { STORAGE_KEY, ensureSeed, loadData, saveData } from "./storage.js";

const tableBody = document.querySelector("#memberTable tbody");
const checkAllEl = document.querySelector("#checkAll");
const resetSeedBtn = document.getElementById("resetSeedBtn");
const deleteSelectedBtn = document.querySelector("#deleteSelectedBtn");

const filterForm = document.getElementById("filterForm");
const resetBtn = document.getElementById("resetBtn");
const activeFiltersEl = document.getElementById("activeFilters");

const openAddModalBtn = document.getElementById("openAddModalBtn");
const modal = document.getElementById("addModal");
const backdrop = document.getElementById("modalBackdrop");
const addForm = document.getElementById("addForm");
const closeModalBtn = document.getElementById("closeModalBtn");

/* 공용 유틸 ( "male"/"female" => "남자"/"여자"로 변환) */
const genderToKorean = (g) => (g === "male" ? "남자" : "여자");

/* table 렌더링 */
function renderTable(rows) {
  tableBody.innerHTML = rows
    .map(
      (m) => `
    <tr data-id="${m.id}">
      <td>
        <input
          type="checkbox"
          class="row-check"
          aria-label="${m.name} 선택"
        />
      </td>
      <td>${m.name}</td>
      <td>${m.englishName}</td>
      <td>
        <a
          href="https://github.com/${encodeURIComponent(m.github)}"
          target="_blank"
          title="깃허브로 이동"
        >
          ${m.github}
        </a>
      </td>
      <td>${genderToKorean(m.gender)}</td>
      <td>${m.role}</td>
      <td>${m.codeReviewGroup}</td>
      <td>${m.age}</td>
    </tr>
  `
    )
    .join("");

  // 새로 그릴 때마다 개별 체크박스에 리스너 부착 + 전체선택 초기화
  tableBody
    .querySelectorAll(".row-check")
    .forEach((cb) => (cb.onchange = syncCheckAll));
  checkAllEl.checked = false;
}

function renderActiveChips(v) {
  const label = {
    name: "이름",
    englishName: "영문 이름",
    github: "깃허브",
    gender: "성별",
    role: "역할",
    codeReviewGroup: "금잔디조",
    age: "나이",
  };

  // 필터 객체를 [key, value] 배열로 변환
  const html = Object.entries(v)
    // 비어있는 값 제거
    .filter(([, val]) => val !== "" && val !== null && val !== undefined)
    // 한글 라벨 붙여 chip 형태 HTML 생성
    .map(
      ([k, val]) =>
        `<span class="chip">${label[k]}: ${
          k === "gender" ? genderToKorean(val) : val
        }</span>`
    )
    .join("");

  activeFiltersEl.innerHTML = html;
}

/* 필터 */
function getFormValues() {
  const fd = new FormData(filterForm);

  return {
    name: (fd.get("name") || "").trim(),
    englishName: (fd.get("englishName") || "").trim(),
    github: (fd.get("github") || "").trim(),
    gender: fd.get("gender") || "",
    role: fd.get("role") || "",
    codeReviewGroup: (fd.get("codeReviewGroup") || "").trim(),
    age: (fd.get("age") || "").trim(),
  };
}

function applyFilter() {
  // 전체 멤버 데이터 불러오기
  const list = loadData();
  // 폼에 입력된 필터 값 읽기
  const v = getFormValues();

  const filtered = list.filter((m) => {
    if (v.name && !m.name.includes(v.name)) return false;
    if (
      v.englishName &&
      !m.englishName.toLowerCase().includes(v.englishName.toLowerCase())
    )
      return false;
    if (v.github && !m.github.toLowerCase().includes(v.github.toLowerCase()))
      return false;
    if (v.gender && m.gender !== v.gender) return false;
    if (v.role && m.role !== v.role) return false;
    if (v.codeReviewGroup && String(m.codeReviewGroup) !== String(v.codeReviewGroup))
      return false;
    if (v.age && String(m.age) !== String(v.age)) return false;
    return true;
  });

  renderActiveChips(v);
  renderTable(filtered);
}

/* 선택 (개별 선택/전체 선택 시 sync 맞추기) */
// 아래 행들 모두 선택되어 있으면 전체선택도 체크
function syncCheckAll() {
  const checks = tableBody.querySelectorAll(".row-check");
  // 전체 선택 박스를 클릭하면 모든 행의 체크 상태를 일괄 변경
  checkAllEl.checked =
    checks.length > 0 && Array.from(checks).every((c) => c.checked);
}

// 전체선택 클릭 시, 아래 행들 전부 토글
checkAllEl.addEventListener("change", (e) => {
  const checked = e.currentTarget.checked;
  tableBody
    .querySelectorAll(".row-check")
    .forEach((cb) => (cb.checked = checked));
});

/* 선택 삭제 */
deleteSelectedBtn.addEventListener("click", () => {
  const ids = Array.from(tableBody.querySelectorAll("tr"))
    .filter((tr) => tr.querySelector(".row-check")?.checked)
    .map((tr) => Number(tr.dataset.id));

  if (ids.length === 0) return alert("삭제할 항목을 선택하세요.");

  // 로컬스토리지에도 반영
  const next = loadData().filter((m) => !ids.includes(m.id));
  // 방금 필터링된 새 배열(next)을 로컬스토리지에 다시 저장
  saveData(next);
  // 현재 필터 유지한 채 리렌더링
  applyFilter();
});

/* modal */
function openModal() {
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  modal.showModal();
}

function closeModal() {
  modal.close();
  document.body.style.overflow = "";
  backdrop.hidden = true;
}

openAddModalBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

backdrop.addEventListener("click", closeModal);

// 모달 바깥 클릭(= dialog의 배경 영역)도 닫히도록 보강
modal.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!inside) closeModal();
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(addForm);
  const v = Object.fromEntries(fd.entries());

  const required = [
    "name",
    "englishName",
    "github",
    "gender",
    "role",
    "codeReviewGroup",
    "age",
  ];

  for (const k of required) {
    if (!v[k] || String(v[k]).trim() === "") {
      alert("모든 항목을 입력/선택해주세요.");
      return;
    }
  }

  // 기존 데이터 불러오기
  const list = loadData();
  const newId = list.length ? Math.max(...list.map((m) => m.id)) + 1 : 1;

  const newMember = {
    id: newId,
    name: v.name.trim(),
    englishName: v.englishName.trim(),
    github: v.github.trim(),
    gender: v.gender,
    role: v.role,
    codeReviewGroup: Number(v.codeReviewGroup),
    age: Number(v.age),
  };

  saveData([...list, newMember]);
  addForm.reset();
  closeModal();
  // 필터 유지한 채 테이블 리렌더링
  applyFilter();
});

/* 필터 이벤트 (검색/초기화) */
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilter();
});

resetBtn.addEventListener("click", () => {
  filterForm.reset();
  // 활성화된 필터chip(activeFiltersEl)도 초기화
  activeFiltersEl.innerHTML = "";
  renderTable(loadData());
});

// 멤버 데이터 초기화 기능
resetSeedBtn.addEventListener("click", () => {
  const ok = confirm(
    "멤버 데이터를 처음 상태로 다시 되돌립니다. \n현재 로컬에 저장된 목록은 삭제됩니다. 진행할까요?"
  );
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  ensureSeed();                         
  filterForm.reset();                   
  activeFiltersEl.innerHTML = "";
  renderTable(loadData());             
  alert("멤버 데이터가 초기화되었습니다!");
});

/* 초기화 */
ensureSeed();
renderTable(loadData());
