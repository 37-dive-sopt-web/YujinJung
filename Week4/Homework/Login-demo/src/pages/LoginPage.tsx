import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/ui/PageContainer";
import { Button } from "../components/ui/Button";
import { login } from "../api/auth";
import { saveAuthInfo } from "../utils/auth-storage";
import type { LoginResponse } from "../types/auth";
import eyeOnIcon from "../assets/eye_on_icon.svg";
import eyeOffIcon from "../assets/eye_off_icon.svg";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const disabled =
    username.trim().length === 0 || password.trim().length === 0;

  // 응답(raw)에서 userId / id / userID / data.userId / user.id 등 가능한 모든 경우를 검사해 userId를 추출하는 함수
  const extractUserId = (raw: LoginResponse): number | null => {
    const candidates: unknown[] = [];

    // 최상단 필드 검사
    if ("userId" in raw)
      candidates.push((raw as Record<string, unknown>).userId);
    if ("id" in raw) candidates.push((raw as Record<string, unknown>).id);
    if ("userID" in raw)
      candidates.push((raw as Record<string, unknown>).userID);

    // data 내부 검사
    if ("data" in raw && typeof raw.data === "object" && raw.data !== null) {
      const d = raw.data as Record<string, unknown>;
      if ("userId" in d) candidates.push(d.userId);
      if ("id" in d) candidates.push(d.id);
      if ("userID" in d) candidates.push(d.userID);
    }

    // user 내부 검사
    if ("user" in raw && typeof raw.user === "object" && raw.user !== null) {
      const u = raw.user as Record<string, unknown>;
      if ("userId" in u) candidates.push(u.userId);
      if ("id" in u) candidates.push(u.id);
      if ("userID" in u) candidates.push(u.userID);
    }

    // 후보들 중 숫자 또는 숫자로 변환 가능한 문자열 찾기
    for (const c of candidates) {
      if (typeof c === "number") return c;
      if (typeof c === "string") {
        const n = Number(c);
        if (!Number.isNaN(n)) return n;
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const result = await login({ username, password });
      const userId = extractUserId(result);

      if (userId == null) {
        setErrorMessage(
          "로그인 응답에서 사용자 ID를 찾을 수 없습니다. 담당자에게 문의해 주세요."
        );
        return;
      }

      // 로그인 정보 저장
      saveAuthInfo({
        userId,
        username,
        name: "",
      });

      navigate("/mypage", { replace: true });
    } catch (error) {
      console.error("[LoginPage] 로그인 실패:", error);
      setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="w-full max-w-xl">
        <h1 className="mb-10 text-3xl font-semibold text-slate-900">
          로그인
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력해 주세요"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-md border border-emerald-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full rounded-md border border-emerald-300 bg-white px-4 py-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeOnIcon}
                  alt=""
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <p className="text-sm text-red-500">
              {errorMessage}
            </p>
          )}

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            disabled={disabled || submitting}
            className="mt-2 h-12 w-full rounded-md bg-emerald-200 text-base font-semibold text-white hover:bg-emerald-300 disabled:bg-emerald-100 disabled:text-white"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        {/* 회원가입 링크 표시 */}
        <div className="mt-6 text-center">
          <Link
            to="/signup"
            className="text-sm font-medium text-emerald-500 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
