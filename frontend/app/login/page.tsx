"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/* ── Inline error label ── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-[fieldErrorIn_0.25s_ease-out]">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

/* ── Toast notification ── */
function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 animate-[toastIn_0.35s_cubic-bezier(.21,1.02,.73,1)]">
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-white px-5 py-3 shadow-lg shadow-red-500/8">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [toast, setToast] = useState<string | null>(null);

  const clearToast = useCallback(() => setToast(null), []);

  /* validate & submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setErrors({});
    setToast(null);
    setIsLoading(true);
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  /* clear field error on change */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 overflow-hidden">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={clearToast} />}

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-linear-to-br from-[#007BFF]/10 to-[#800000]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-linear-to-tr from-[#800000]/8 to-[#007BFF]/5 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-[fadeIn_0.6s_ease-out]">
        <Card className="border-0 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardHeader className="items-center gap-3 pb-2 pt-10">
            {/* Logo */}
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#800000] drop-shadow-sm">
                Engenius
              </h1>
              <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#800000] to-[#007BFF]" />
            </div>

            <div className="mt-4 text-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                เข้าสู่ระบบ (Admin)
              </CardTitle>
              <CardDescription className="mt-1.5 text-sm text-gray-500">
                กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบจัดการ
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4 pb-10">
            {/* noValidate prevents the ugly browser tooltip */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Email Field */}
              <div className="group relative">
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  อีเมล
                </label>
                <div className="relative">
                  <Mail
                    className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                      errors.email
                        ? "text-red-400"
                        : "text-gray-400 group-focus-within:text-[#007BFF]"
                    }`}
                  />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@engenius.co.th"
                    value={email}
                    onChange={handleEmailChange}
                    className={`h-11 pl-10 text-sm transition-all duration-200 ${
                      errors.email
                        ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400"
                        : "focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF]"
                    }`}
                  />
                </div>
                <FieldError message={errors.email} />
              </div>

              {/* Password Field */}
              <div className="group relative">
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock
                    className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                      errors.password
                        ? "text-red-400"
                        : "text-gray-400 group-focus-within:text-[#007BFF]"
                    }`}
                  />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`h-11 pl-10 pr-10 text-sm transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400"
                        : "focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError message={errors.password} />
              </div>

              {/* Submit Button */}
              <Button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 w-full bg-[#007BFF] text-white text-sm font-semibold shadow-lg shadow-[#007BFF]/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-[#007BFF]/30 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    เข้าสู่ระบบ
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Engenius — Tax Invoice Management System
        </p>
      </div>
    </div>
  );
}
