import { members } from "./data.js";

export const STORAGE_KEY = "membersData";

export const loadData = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

export const saveData = (arr) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

export function ensureSeed() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }
}