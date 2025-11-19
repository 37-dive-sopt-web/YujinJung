import { apiClient } from "./client";
import type { User } from "../types/user";

// 회원가입
export interface SignupPayload {
  username: string;
  password: string;
  name: string;
  email: string;
  age: number;
}

export async function signupUser(payload: SignupPayload): Promise<void> {
  await apiClient.post("/api/v1/users", payload);
}

 // 서버 응답에서 실제 사용자 정보가 들어있는 객체 뽑아내기
 // { id, username, ... }, { data: { ... } }, { user: { ... } } 같은 여러 경우 모두 해당되도록 하기
function extractUserPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const obj = raw as Record<string, unknown>;

  if ("user" in obj && obj.user && typeof obj.user === "object") {
    return obj.user as Record<string, unknown>;
  }

  if ("data" in obj && obj.data && typeof obj.data === "object") {
    return obj.data as Record<string, unknown>;
  }

  return obj;
}

// 아무 모양이든 User 타입으로 정규화
function normalizeUser(raw: unknown): User {
  const u = extractUserPayload(raw);

  const getNumber = (keys: string[]): number => {
    for (const key of keys) {
      const v = u[key];
      if (typeof v === "number") return v;
      if (typeof v === "string") {
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
    }
    return 0;
  };

  const getString = (keys: string[]): string => {
    for (const key of keys) {
      const v = u[key];
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
    }
    return "";
  };

  return {
    id: getNumber(["id", "userId"]),
    username: getString(["username"]),
    name: getString(["name"]),
    email: getString(["email"]),
    age: getNumber(["age"]),
    status: getString(["status"]),
  };
}

// id로 회원 정보 조회
export async function getUserById(id: number): Promise<User> {
  const { data } = await apiClient.get<unknown>(`/api/v1/users/${id}`);
  return normalizeUser(data);
}

// 회원 정보 수정
export async function updateUserById(
  id: number,
  payload: Pick<User, "name" | "email" | "age">
): Promise<void> {
  await apiClient.patch(`/api/v1/users/${id}`, payload);
}

// 회원 탈퇴
export async function deleteUserById(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/users/${id}`);
}
