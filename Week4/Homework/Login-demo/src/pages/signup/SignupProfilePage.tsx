import React from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface Props {
  name: string;
  email: string;
  age: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeAge: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  onBack: () => void;
}

export function SignupProfilePage({
  name,
  email,
  age,
  onChangeName,
  onChangeEmail,
  onChangeAge,
  onSubmit,
  submitting,
  onBack,
}: Props) {
  const isEmpty =
    name.trim().length === 0 ||
    email.trim().length === 0 ||
    age.trim().length === 0;

  const disabled = isEmpty || submitting;

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
          label="이름"
          value={name}
          placeholder="이름을 입력해 주세요"
          onChange={(e) => onChangeName(e.target.value)}
        />
        <Input
          label="이메일"
          type="email"
          value={email}
          placeholder="test@test.com"
          onChange={(e) => onChangeEmail(e.target.value)}
        />
        <Input
          label="나이"
          type="number"
          value={age}
          placeholder="나이를 숫자로 입력해 주세요"
          onChange={(e) => onChangeAge(e.target.value)}
        />
      </div>

      <Button
        type="button"
        className="mt-4 w-full"
        onClick={onSubmit}
        disabled={disabled}
      >
        {submitting ? "회원가입 중..." : "회원가입"}
      </Button>
    </div>
  );
}
