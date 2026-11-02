import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/Redux Toolkit/features/Auth/AuthThunk";
import { toast } from "sonner";
import { getUserProfile } from "@/Redux Toolkit/features/User/userThunk";
import { useNavigate } from "react-router-dom";
import { startShift } from "@/Redux Toolkit/features/ShiftReport/shiftReportThunk";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
 // const {branch}=useState(state=>state.branch)

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const stateKey = name === "username" ? "email" : name;
    setFormData((prev) => ({ ...prev, [stateKey]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const resultAction = await dispatch(login(formData));

      if (login.fulfilled.match(resultAction)) {
        toast("Login successful!");

        const { jwt, userDto } = resultAction.payload;
        console.log("jwt ", jwt);
        console.log("user ", userDto);

        dispatch(getUserProfile(jwt));

        const userRole = userDto.role;

        if (userRole === "ROLE_BRANCH_CASHIER") {
          navigate("/cashier");
          if (userDto.branchId) {
            dispatch(startShift(userDto.branchId));
          }
        } else if (userRole === "ROLE_STORE_MANAGER" || userRole === "ROLE_STORE_ADMIN") {
          navigate("/store");
        } else if (userRole === "ROLE_BRANCH_MANAGER" || userRole === "ROLE_BRANCH_ADMIN") {
          navigate("/branch");
        } else if (userRole === "ROLE_ADMIN") {
          navigate("/super-admin");
        } else {
          setError(`No dashboard is configured for role "${userRole}" yet.`);
        }
      } else {
        setError(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      console.log("login error", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!forgotPasswordEmail) return;

    setIsSendingReset(true);

    setTimeout(() => {
      console.log("forgot password email", forgotPasswordEmail);
      setIsSendingReset(false);
      setResetSent(true);
    }, 800);
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setForgotPasswordEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Pos Pro</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            {showForgotPassword ? "Reset Password" : "Welcome Back"}
          </h1>

          <p className="text-muted-foreground mt-2">
            {showForgotPassword
              ? "Enter your email to receive reset instructions"
              : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Login Form */}
        {!showForgotPassword && (
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <form className="space-y-5" onSubmit={handleLogin} autoComplete="on">

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  onChange={handleInputChange}
                  placeholder="Enter your email..."
                  type="email"
                  id="email"
                  name="username"
                  autoComplete="username"
                  value={formData.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    onChange={handleInputChange}
                    placeholder="Enter your password..."
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label htmlFor="remember-me" className="cursor-pointer font-normal">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  variant="ghost"
                  className="px-0 h-auto"
                >
                  Forgot Password?
                </Button>
              </div>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </Button>
            </form>
          </div>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <div className="bg-card rounded-2xl shadow-xl p-8">
            {!resetSent ? (
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email..."
                    type="email"
                    id="forgot-email"
                    name="forgot-email"
                    autoComplete="email"
                    value={forgotPasswordEmail}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={backToLogin}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSendingReset || !forgotPasswordEmail}
                    className="w-full sm:flex-1"
                  >
                    {isSendingReset ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  If an account exists for{" "}
                  <span className="font-medium text-foreground">
                    {forgotPasswordEmail}
                  </span>
                  , a reset link has been sent.
                </p>

                <Button variant="outline" onClick={backToLogin} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;