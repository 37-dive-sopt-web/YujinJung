export interface AuthInfo {
  userId: number;
  username: string;
  name: string;
}

const STORAGE_KEY = "login-demo:auth:v2";

export function saveAuthInfo(info: AuthInfo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}

export function getAuthInfo(): AuthInfo | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthInfo>;

    // null / undefined만 잘못된 값으로 처리
    if (parsed.userId == null) {
      return null;
    }

    return {
      userId: Number(parsed.userId),
      username: parsed.username ?? "",
      name: parsed.name ?? "",
    };
  } catch {
    return null;
  }
}

export function clearAuthInfo(): void {
  localStorage.removeItem(STORAGE_KEY);
}
