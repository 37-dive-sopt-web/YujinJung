import { STORAGE_KEY, ensureSeed, loadData, saveData, clearData } from "./storage.js";

const tableBody = document.querySelector("#memberTable tbody");
const checkAllEl = document.querySelector("#checkAll");
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

/* 로컬 데이터 캐시 */
let members = [];

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
    .forEach((checkbox) => (checkbox.onchange = syncCheckAll));
  checkAllEl.checked = false;
}

function renderActiveChips(filters) {
  const label = {
    name: "이름",
    englishName: "영문 이름",
    github: "깃허브",
    gender: "성별",
    role: "역할",
    codeReviewGroup: "금잔디조",
    age: "나이",
  };

  const html = Object.entries(filters)
    .filter(([, val]) => val !== "" && val !== null && val !== undefined)
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
  // 폼에 입력된 필터 값 읽기
  const filters = getFormValues();

  const filtered = members.filter((m) => {
    if (filters.name && !m.name.includes(filters.name)) return false;
    if (
      filters.englishName &&
      !m.englishName.toLowerCase().includes(filters.englishName.toLowerCase())
    )
      return false;
    if (
      filters.github &&
      !m.github.toLowerCase().includes(filters.github.toLowerCase())
    )
      return false;
    if (filters.gender && m.gender !== filters.gender) return false;
    if (filters.role && m.role !== filters.role) return false;
    if (
      filters.codeReviewGroup &&
      String(m.codeReviewGroup) !== String(filters.codeReviewGroup)
    )
      return false;
    if (filters.age && String(m.age) !== String(filters.age)) return false;
    return true;
  });

  renderActiveChips(filters);
  renderTable(filtered);
}

/* 선택 (개별 선택/전체 선택 시 sync 맞추기) */
// 아래 행들 모두 선택되어 있으면 전체선택도 체크
function syncCheckAll() {
  const checks = tableBody.querySelectorAll(".row-check");
  checkAllEl.checked =
    checks.length > 0 && Array.from(checks).every((c) => c.checked);
}

// 전체선택 클릭 시, 아래 행들 전부 토글
checkAllEl.addEventListener("change", (e) => {
  const checked = e.currentTarget.checked;
  tableBody
    .querySelectorAll(".row-check")
    .forEach((checkbox) => (checkbox.checked = checked));
});

/* 선택 삭제 */
deleteSelectedBtn.addEventListener("click", () => {
  const ids = Array.from(tableBody.querySelectorAll("tr"))
    .filter((tr) => tr.querySelector(".row-check")?.checked)
    .map((tr) => Number(tr.dataset.id));

  if (ids.length === 0) return alert("삭제할 항목을 선택하세요.");

  // 캐시 및 로컬스토리지에 반영
  members = members.filter((m) => !ids.includes(m.id));
  saveData(members);

  // 현재 필터 유지한 채 리렌더링
  applyFilter();
});

/* modal */
function openModal() {
  backdrop.hidden = false;
  document.body.classList.add("is-locked");
  modal.showModal();
}

function closeModal() {
  modal.close();
  document.body.classList.remove("is-locked");
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
  const values = Object.fromEntries(fd.entries());

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
    if (!values[k] || String(values[k]).trim() === "") {
      alert("모든 항목을 입력/선택해주세요.");
      return;
    }
  }

  // 새 ID 생성
  const newId = members.length ? Math.max(...members.map((m) => m.id)) + 1 : 1;

  const newMember = {
    id: newId,
    name: values.name.trim(),
    englishName: values.englishName.trim(),
    github: values.github.trim(),
    gender: values.gender,
    role: values.role,
    codeReviewGroup: Number(values.codeReviewGroup),
    age: Number(values.age),
  };

  members = [...members, newMember];
  saveData(members);

  addForm.reset();
  closeModal();
  // 현재 필터 유지한 채 테이블 리렌더링
  applyFilter();
});

/* 필터 이벤트 (검색/초기화) */
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilter();
});

/* 초기화(데이터/필터) — 핸들러 통합 */
resetBtn.addEventListener("click", () => {
  const ok = confirm(
    "필터 및 멤버 데이터를 초기화할까요?\n(로컬에 저장된 현재 목록은 삭제됩니다!)"
  );
  if (!ok) return;

  clearData();     // storage.js로 분리
  ensureSeed();    // 시드 재주입
  members = loadData();

  filterForm.reset();
  activeFiltersEl.innerHTML = "";
  renderTable(members);

  alert("필터 및 멤버 데이터가 초기화되었습니다!");
});

/* 초기화 */
ensureSeed();
members = loadData();
renderTable(members);
