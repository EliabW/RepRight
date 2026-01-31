import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password_input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { useState } from "react";
import ErrorMessage from "@/components/common/ErrorMessage";
import axios from "axios";
import { FancyButton } from "@/components/ui/fancybutton";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        userEmail: email,
        userPassword: password,
      });
      login(
        {
          userID: response.userID,
          userEmail: response.userEmail,
          userGivenName: response.userGivenName,
          userFamilyName: response.userFamilyName,
          darkMode: response.darkMode,
        },
        response.token,
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      let message = "Login failed. Please try again.";

      if (axios.isAxiosError<{ message: string }>(err)) {
        message = err.response?.data?.message ?? message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[700px] opacity-[0.04] dark:hidden"
        />
        <img
          src="/white-android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[520px] opacity-[0.06] hidden dark:block"
        />
      </div>

      <Card className="max-w-sm w-full mx-auto p-8 border-0 shadow-lg">
        <>
          <img
            src="/android-chrome-512x512.png"
            alt="RepRight Logo"
            className="w-40 h-40 mx-auto dark:hidden"
          />
          <img
            src="/white-android-chrome-512x512.png"
            alt="RepRight Logo"
            className="w-40 h-40 mx-auto hidden dark:block"
          />
        </>
        <h1 className="text-secondary text-3xl font-bold text-center">
          Welcome back
        </h1>
        <h2 className="text-subheading text-center mb-6">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet disabled={loading}>
              <FieldGroup>
                <FieldSeparator />
                {error && <ErrorMessage message={error} />}
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    onChange={onEmailChange}
                    value={email}
                    className="bg-neutral-secondary"
                    placeholder="Enter your email"
                    type="email"
                    id="email"
                    autoComplete="true"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="password">
                    Password
                  </FieldLabel>
                  <PasswordInput
                    onChange={onPasswordChange}
                    value={password}
                    className="bg-neutral-secondary"
                    placeholder="Enter your password"
                    id="password"
                    required
                  />
                </Field>
                <FieldSeparator />
                {/* DOESNT WORK YET */}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-2 font-medium text-sm"
                >
                  Forgot password?
                </Button>
                <Field>
                  <FancyButton type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Spinner /> Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </FancyButton>
                </Field>
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    type="button"
                    className="p-0 h-auto font-medium"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </p>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </Card>
    </div>
  );
}
export default Login;