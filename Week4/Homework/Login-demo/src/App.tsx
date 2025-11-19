import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupFullPage } from "./pages/SignupFullPage";
import { MyPageLayout } from "./pages/mypage/MyPageLayout";
import { MyInfoPage } from "./pages/mypage/MyInfoPage";
import { MemberLookupPage } from "./pages/mypage/MemberLookupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupFullPage />} />

      <Route path="/mypage" element={<MyPageLayout />}>
        <Route index element={<MyInfoPage />} />
        <Route path="members" element={<MemberLookupPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
