import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { validatePassword } from "../../utils/passwordPolicy";

import eyeOffIcon from "../../assets/eye_off_icon.svg";
import eyeOnIcon from "../../assets/eye_on_icon.svg";

interface Props {
  password: string;
  passwordConfirm: string;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirm: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SignupPasswordPage({
  password,
  passwordConfirm,
  onChangePassword,
  onChangePasswordConfirm,
  onNext,
  onBack,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const isEmpty =
    password.trim().length === 0 || passwordConfirm.trim().length === 0;
  const mismatch = password !== passwordConfirm;

  const policyResult = validatePassword(password);
  const policyValid = policyResult.valid;

  const disabled = isEmpty || mismatch || !policyValid;

  const policyMessage =
    !policyValid && password.length > 0
      ? policyResult.errors[0]
      : undefined;

  const mismatchMessage =
    !mismatch || passwordConfirm.length === 0
      ? undefined
      : "비밀번호가 일치하지 않습니다.";

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 text-emerald-500 hover:bg-emerald-50"
        aria-label="뒤로가기"
      >
        ←
      </button>

      <h1 className="text-2xl font-semibold text-slate-900">회원가입</h1>

      <div className="space-y-4">
        {/* 비밀번호 */}
        <div className="relative">
          <Input
            label="비밀번호"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            errorMessage={policyMessage}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-8 flex h-6 w-6 items-center justify-center"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <img
              src={showPassword ? eyeOffIcon : eyeOnIcon}
              alt="비밀번호 보기 토글"
              className="h-4 w-4"
            />
          </button>
        </div>

        {/* 비밀번호 확인 */}
        <div className="relative">
          <Input
            label="비밀번호 확인"
            type={showPasswordConfirm ? "text" : "password"}
            placeholder="한 번 더 입력해 주세요"
            value={passwordConfirm}
            onChange={(e) => onChangePasswordConfirm(e.target.value)}
            errorMessage={mismatchMessage}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-8 flex h-6 w-6 items-center justify-center"
            onClick={() => setShowPasswordConfirm((prev) => !prev)}
            aria-label={
              showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
            }
          >
            <img
              src={showPasswordConfirm ? eyeOffIcon : eyeOnIcon}
              alt="비밀번호 보기 토글"
              className="h-4 w-4"
            />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          비밀번호 정책: 8~64자, 대/소문자, 숫자, 특수문자 각각 1자 이상, 공백 불가
        </p>
      </div>

      <Button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="mt-2 w-full"
      >
        다음
      </Button>
    </div>
  );
}
