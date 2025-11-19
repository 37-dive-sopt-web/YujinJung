import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMyInfo } from "../../hooks/useMyInfo";
import { clearAuthInfo, getAuthInfo } from "../../utils/auth-storage";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/Modal";
import { deleteUserById } from "../../api/users";

const activeClass =
  "border-b-2 border-white text-white font-semibold";
const inactiveClass =
  "text-emerald-50/80 hover:text-white border-b-2 border-transparent";

export function MyPageLayout() {
  const { user } = useMyInfo();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const auth = getAuthInfo();
    if (!auth) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthInfo();
    navigate("/login");
  };

  const handleOpenWithdrawModal = () => {
    setMenuOpen(false);
    setWithdrawOpen(true);
  };

  // 회원탈퇴 처리
  const handleConfirmWithdraw = async () => {
    const auth = getAuthInfo();
    if (!auth) return;

    try {
      setWithdrawing(true);
      await deleteUserById(auth.userId);
      clearAuthInfo();
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("회원탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setWithdrawing(false);
      setWithdrawOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b border-emerald-200 bg-emerald-400 text-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-5">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold leading-none">
              마이페이지
            </span>
            <span className="mt-2 text-sm">
              안녕하세요, {user?.name ?? "회원"}님
            </span>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/mypage"
              end
              className={({ isActive }) =>
                `text-base ${isActive ? activeClass : inactiveClass}`
              }
            >
              내 정보
            </NavLink>
            <NavLink
              to="/mypage/members"
              className={({ isActive }) =>
                `text-base ${isActive ? activeClass : inactiveClass}`
              }
            >
              회원 조회
            </NavLink>
            <button
              type="button"
              className={`text-base ${inactiveClass}`}
              onClick={handleLogout}
            >
              로그아웃
            </button>

            {/* 모달 열기 */}
            <button
              type="button"
              className={`text-base ${inactiveClass}`}
              onClick={handleOpenWithdrawModal}
            >
              회원탈퇴
            </button>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full px-4 py-2 text-xs"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              메뉴
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div
          className={`md:hidden transform-gpu border-t border-emerald-300 bg-emerald-50/90 text-emerald-800 transition-all duration-200 ${
            menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="mx-auto flex max-w-5xl flex-col px-6 py-3 text-sm">
            <Link
              to="/mypage"
              onClick={() => setMenuOpen(false)}
              className="py-1.5"
            >
              내 정보
            </Link>
            <Link
              to="/mypage/members"
              onClick={() => setMenuOpen(false)}
              className="py-1.5"
            >
              회원조회
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="py-1.5 text-left"
            >
              로그아웃
            </button>

            {/* 모바일 메뉴 모달 열기 */}
            <button
              type="button"
              onClick={handleOpenWithdrawModal}
              className="py-1.5 text-left"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="mx-auto max-w-5xl px-8 py-10">
        <Outlet />
      </main>

      {/* 회원탈퇴 모달 */}
      <Modal
        open={withdrawOpen}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴 후에는 모든 정보가 삭제돼요"
        confirmText={withdrawing ? "처리 중..." : "회원탈퇴"}
        cancelText="취소"
        onCancel={() => setWithdrawOpen(false)}
        onConfirm={handleConfirmWithdraw}
      />
    </div>
  );
}
