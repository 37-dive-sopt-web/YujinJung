import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { getUserById } from "../../api/users";
import type { User } from "../../types/user";

export function MemberLookupPage() {
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = memberId.trim().length === 0 || loading;

  const handleLookup = async () => {
    setError(null);
    setMember(null);
    try {
      setLoading(true);
      const idNumber = Number(memberId);
      const data = await getUserById(idNumber);
      setMember(data);
    } catch (e) {
      console.error(e);
      setError("해당 ID의 회원을 찾을 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl bg-white px-10 py-10 shadow-sm">
      <div className="mx-auto max-w-md">
        {/* 제목 */}
        <h2 className="mb-8 text-xl font-semibold text-slate-900">
          회원 조회
        </h2>

        {/* 입력 영역 */}
        <div className="flex flex-col gap-4">
          <Input
            label="회원 ID"
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />

          <Button
            type="button"
            onClick={handleLookup}
            disabled={disabled}
            className={`mt-2 h-12 w-full rounded-xl text-base font-semibold border transition-all duration-200
              ${
                disabled
                  ? "bg-emerald-300/40 border-emerald-300 text-emerald-700/50 cursor-not-allowed"
                  : "bg-emerald-300 border-emerald-300 text-white hover:bg-emerald-400"
              }
            `}
          >
            {loading ? "조회 중..." : "확인"}
          </Button>

          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* 결과 영역 */}
        {member && (
          <div className="mt-8 text-sm">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">이름</span>
              <span className="font-semibold text-slate-800">
                {member.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">아이디</span>
              <span className="font-semibold text-slate-800">
                {member.username}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">이메일</span>
              <span className="font-semibold text-slate-800">
                {member.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">나이</span>
              <span className="font-semibold text-slate-800">
                {member.age}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">상태</span>
              <span className="font-semibold text-slate-800">
                {member.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
