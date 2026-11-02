import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, MapPin, Phone, ShoppingCart, Store, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login, signup } from "@/Redux Toolkit/features/Auth/AuthThunk";
import { getUserProfile } from "@/Redux Toolkit/features/User/userThunk";
import { startShift } from "@/Redux Toolkit/features/ShiftReport/shiftReportThunk";
import ThemeSelector from "@/components/ThemeSelector";

const initialRegistration = {
  fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  role: "ROLE_STORE_ADMIN", businessName: "", businessType: "Retail Store",
  businessAddress: "", businessWebsite: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registration, setRegistration] = useState(initialRegistration);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const redirectForRole = (user) => {
    if (user.role === "ROLE_BRANCH_CASHIER") {
      navigate("/cashier");
      if (user.branchId) dispatch(startShift(user.branchId));
    } else if (["ROLE_STORE_MANAGER", "ROLE_STORE_ADMIN"].includes(user.role)) navigate("/store");
    else if (["ROLE_BRANCH_MANAGER", "ROLE_BRANCH_ADMIN"].includes(user.role)) navigate("/branch");
    else if (user.role === "ROLE_ADMIN") navigate("/super-admin");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginData.email || !loginData.password) return setError("Enter your email and password.");
    setIsSubmitting(true);
    try {
      const result = await dispatch(login(loginData)).unwrap();
      dispatch(getUserProfile(result.jwt));
      toast.success("Welcome back to Cartify.");
      redirectForRole(result.userDto);
    } catch (requestError) {
      setError(requestError || "Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (registration.password !== registration.confirmPassword) return setError("Passwords do not match.");
    if (registration.password.length < 6) return setError("Password must contain at least 6 characters.");
    setIsSubmitting(true);
    try {
      const result = await dispatch(signup({
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        password: registration.password,
        role: registration.role,
        businessName: registration.businessName,
        businessType: registration.businessType,
        businessAddress: registration.businessAddress,
        businessWebsite: registration.businessWebsite,
      })).unwrap();
      dispatch(getUserProfile(result.jwt));
      toast.success("Business account created.");
      redirectForRole(result.userDto);
    } catch (requestError) {
      setError(requestError || "Registration failed. Please review your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRegistering = mode === "register";
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground sm:px-8 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_30%),radial-gradient(circle_at_90%_85%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_32%)]" />
      <div className="absolute right-4 top-4 z-10"><ThemeSelector compact /></div>
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20">
        <section className="hidden min-w-0 space-y-10 lg:block">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><ShoppingCart /></div><span className="text-3xl font-bold tracking-tight">Cartify <span className="text-primary">Central</span></span></div>
          <div className="space-y-5">
            <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.25em] text-primary">One workspace. Every business.</p>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight xl:text-6xl">Run your stores, branches, teams, and sales from one centralized system.</h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">Create a business workspace, invite your team, and give every role the tools they need to operate confidently.</p>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3">
            {[["Multi-business", Store], ["Role-based", Users], ["Secure access", LockKeyhole]].map(([label, Icon]) => <div key={label} className="rounded-2xl border bg-card p-4 shadow-sm"><Icon className="mb-3 h-5 w-5 text-primary" /><p className="text-sm font-semibold">{label}</p></div>)}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[460px] rounded-[1.75rem] border bg-card p-6 shadow-2xl sm:p-8">
          <div className="mb-8 flex rounded-xl bg-muted p-1">
            <button type="button" onClick={() => { setMode("login"); setError(""); }} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${!isRegistering ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Sign in</button>
            <button type="button" onClick={() => { setMode("register"); setError(""); }} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${isRegistering ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>Create business</button>
          </div>
          <div className="mb-7"><h2 className="text-2xl font-bold tracking-tight">{isRegistering ? "Start your workspace" : "Welcome back"}</h2><p className="mt-2 text-sm text-muted-foreground">{isRegistering ? "Tell us about you and your business to get started." : "Access your centralized business operations."}</p></div>
          {error && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}
          {!isRegistering ? (
            <form className="space-y-5" onSubmit={handleLogin}>
              <Field icon={Mail} id="login-email" label="Work email" name="email" type="email" value={loginData.email} onChange={update(setLoginData)} placeholder="Enter your work email" required />
              <PasswordField id="login-password" label="Password" name="password" value={loginData.password} onChange={update(setLoginData)} show={showPassword} toggle={() => setShowPassword((value) => !value)} />
              <Button className="h-11 w-full font-semibold" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in to Cartify"}<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegistration}>
              <div className="grid gap-4 sm:grid-cols-2"><Field icon={Users} id="fullName" label="Full name" name="fullName" value={registration.fullName} onChange={update(setRegistration)} placeholder="Enter your full name" /><Field icon={Mail} id="register-email" label="Business email" name="email" type="email" value={registration.email} onChange={update(setRegistration)} placeholder="Enter your business email" /></div>
              <div className="grid gap-4 sm:grid-cols-2"><Field icon={Phone} id="phone" label="Phone number" name="phone" value={registration.phone} onChange={update(setRegistration)} placeholder="Enter your phone number" /><div><Label className="text-sm font-medium" htmlFor="role">Primary role</Label><select required id="role" name="role" value={registration.role} onChange={update(setRegistration)} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm focus:border-primary focus:outline-none"><option value="ROLE_STORE_ADMIN">Store Admin</option><option value="ROLE_STORE_MANAGER">Store Manager</option><option value="ROLE_BRANCH_ADMIN">Branch Admin</option><option value="ROLE_BRANCH_MANAGER">Branch Manager</option><option value="ROLE_BRANCH_CASHIER">Cashier</option></select></div></div>
              <div className="border-t pt-5"><p className="mb-3 text-sm font-semibold">Business details</p><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field icon={Store} id="businessName" label="Business name" name="businessName" value={registration.businessName} onChange={update(setRegistration)} placeholder="Enter your business name" /></div><div><Label className="text-sm font-medium" htmlFor="businessType">Business type</Label><select required id="businessType" name="businessType" value={registration.businessType} onChange={update(setRegistration)} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm focus:border-primary focus:outline-none"><option>Retail Store</option><option>Supermarket</option><option>Restaurant</option><option>Wholesale</option><option>Service Business</option></select></div><Field icon={MapPin} id="businessAddress" label="Business address" name="businessAddress" value={registration.businessAddress} onChange={update(setRegistration)} placeholder="Enter your business address" /></div></div>
              <div className="grid gap-4 sm:grid-cols-2"><PasswordField id="register-password" label="Password" name="password" value={registration.password} onChange={update(setRegistration)} show={showPassword} toggle={() => setShowPassword((value) => !value)} /><PasswordField id="confirm-password" label="Confirm password" name="confirmPassword" value={registration.confirmPassword} onChange={update(setRegistration)} show={showPassword} toggle={() => setShowPassword((value) => !value)} /></div>
              <Button className="h-11 w-full font-semibold" disabled={isSubmitting}>{isSubmitting ? "Creating workspace..." : "Create business account"}<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          )}
          <p className="mt-6 text-center text-xs leading-5 text-slate-500">By continuing, you agree to Cartify Central’s terms and secure access policy.</p>
        </section>
      </div>
    </div>
  );
};

const Field = ({ icon: Icon, id, label, name, onChange, value, type = "text", placeholder }) => <div><Label className="text-sm font-medium" htmlFor={id}>{label}</Label><div className="relative mt-2"><Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="h-10 bg-background pl-9 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20" required /></div></div>;
const PasswordField = ({ id, label, name, onChange, value, show, toggle }) => <div><Label className="text-sm font-medium" htmlFor={id}>{label}</Label><div className="relative mt-2"><LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id={id} name={name} type={show ? "text" : "password"} value={value} onChange={onChange} className="h-10 bg-background pr-10 pl-9 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20" required /><button type="button" onClick={toggle} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>;

export default Login;
