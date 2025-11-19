export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8 || password.length > 64) {
    errors.push("비밀번호는 8~64자여야 합니다.");
  }

  if (/\s/.test(password)) {
    errors.push("비밀번호에는 공백을 사용할 수 없습니다.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("대문자를 최소 1자 포함해야 합니다.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("소문자를 최소 1자 포함해야 합니다.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("숫자를 최소 1자 포함해야 합니다.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("특수문자를 최소 1자 포함해야 합니다.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
