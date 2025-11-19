import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useMyInfo } from "../../hooks/useMyInfo";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { updateUserById } from "../../api/users";
import { getAuthInfo } from "../../utils/auth-storage";
import type { User } from "../../types/user";

type FormState = {
  name: string;
  email: string;
  age: string;
};

export function MyInfoPage() {
  const { user, refetch } = useMyInfo();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    age: "",
  });

  // user 정보를 폼에 한 번만 초기 세팅하기 위한 플래그
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (initialized) return;

    const u = user as Partial<User>;

    const safeName = u.name ?? "";
    const safeEmail = u.email ?? "";
    const safeAge =
      u.age !== undefined && u.age !== null ? String(u.age) : "";

    setForm({
      name: safeName,
      email: safeEmail,
      age: safeAge,
    });
    setInitialized(true);
  }, [user, initialized]);

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const disabled =
    form.name.trim().length === 0 ||
    form.email.trim().length === 0 ||
    form.age.trim().length === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuthInfo();
    if (!auth) return;

    try {
      await updateUserById(auth.userId, {
        name: form.name,
        email: form.email,
        age: Number(form.age),
      });
      alert("내 정보가 저장되었습니다.");
      refetch();
    } catch (error) {
      console.error(error);
      alert("정보 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white px-16 py-12 shadow-sm">
      {/* 상단 제목 */}
      <h2 className="mb-12 text-2xl font-semibold text-slate-900">
        내 정보
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 레이블 / 입력 레이아웃 */}
        <div className="grid grid-cols-[90px,1fr] items-center gap-y-8 gap-x-14">
          {/* 아이디 (텍스트) */}
          <div className="text-sm font-medium text-slate-700">아이디</div>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-slate-900">
              {user?.username ?? "-"}
            </span>
          </div>

          {/* 이름 */}
          <label
            htmlFor="myinfo-name"
            className="text-sm font-medium text-slate-700"
          >
            이름
          </label>
          <Input
            id="myinfo-name"
            value={form.name}
            onChange={handleChange("name")}
            className="h-12"
          />

          {/* 이메일 */}
          <label
            htmlFor="myinfo-email"
            className="text-sm font-medium text-slate-700"
          >
            이메일
          </label>
          <Input
            id="myinfo-email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className="h-12"
          />

          {/* 나이 */}
          <label
            htmlFor="myinfo-age"
            className="text-sm font-medium text-slate-700"
          >
            나이
          </label>
          <Input
            id="myinfo-age"
            type="number"
            value={form.age}
            onChange={handleChange("age")}
            className="h-12"
          />
        </div>

        {/* 저장 버튼 */}
        <div className="mt-10">
          <Button
            type="submit"
            disabled={disabled}
            className={`
              w-full h-12 rounded-xl text-base font-semibold border transition-all duration-200
              ${disabled
                ? "bg-emerald-300/50 border-emerald-300 text-emerald-700/50"
                : "bg-emerald-300/90 border-emerald-300 text-white hover:bg-emerald-400"
              }
            `}
          >
            저장
          </Button>
        </div>
      </form>
    </section>
  );
}
