import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { useState } from "react";
import ErrorMessage from "@/components/common/ErrorMessage";
import axios from "axios";

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
        },
        response.token
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
    <>
      <Card className="max-w-sm mx-auto mt-10 p-8 border-0 shadow-lg">
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
                  <Input
                    onChange={onPasswordChange}
                    value={password}
                    className="bg-neutral-secondary"
                    type="password"
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
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Spinner /> Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
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
    </>
  );
}
export default Login;
