import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageContainer } from "../components/ui/PageContainer";
import { SignupUsernamePage } from "./signup/SignupUsernamePage";
import { SignupPasswordPage } from "./signup/SignupPasswordPage";
import { SignupProfilePage } from "./signup/SignupProfilePage";
import { signupUser } from "../api/users";
import axios from "axios";

export function SignupFullPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmitSignup = async () => {
    try {
      setSubmitting(true);
      const ageNumber = Number(age);
      await signupUser({
        username,
        password,
        name,
        email,
        age: ageNumber,
      });
      alert(`${name}님, 회원가입이 완료되었습니다!`);
      navigate("/login");
    } catch (e: unknown) {
      console.error(e);

      if (axios.isAxiosError(e) && e.response?.status === 409) {
        alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해 주세요.");
      } else {
        alert("회원가입에 실패했습니다. 입력 내용을 확인해 주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 상단 뒤로가기 버튼 동작
  const handleBack = () => {
    if (step === 1) {
      navigate("/login");
      return;
    }

    setStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      return 1;
    });
  };

  return (
    <PageContainer>
      <div className="w-full max-w-md">
        {step === 1 && (
          <SignupUsernamePage
            username={username}
            onChangeUsername={setUsername}
            onNext={() => setStep(2)}
            onBack={handleBack}
          />
        )}

        {step === 2 && (
          <SignupPasswordPage
            password={password}
            passwordConfirm={passwordConfirm}
            onChangePassword={setPassword}
            onChangePasswordConfirm={setPasswordConfirm}
            onNext={() => setStep(3)}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <SignupProfilePage
            name={name}
            email={email}
            age={age}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onChangeAge={setAge}
            onSubmit={handleSubmitSignup}
            submitting={submitting}
            onBack={handleBack}
          />
        )}

        <div className="mt-8 text-center text-sm text-slate-500">
          이미 계정이 있나요?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:underline"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
