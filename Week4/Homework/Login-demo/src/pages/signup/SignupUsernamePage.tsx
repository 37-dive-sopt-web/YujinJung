import React from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface Props {
  username: string;
  onChangeUsername: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SignupUsernamePage({
  username,
  onChangeUsername,
  onNext,
  onBack,
}: Props) {
  const isEmpty = username.trim().length === 0;
  const isTooLong = username.length > 50;

  const disabled = isEmpty || isTooLong;

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
        <Input
          label="아이디"
          placeholder="아이디를 입력해 주세요"
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
          errorMessage={
            isTooLong ? "아이디는 50자 이하로 입력해 주세요." : undefined
          }
        />
      </div>

      <Button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className="mt-4 w-full"
      >
        다음
      </Button>
    </div>
  );
}
