import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password_input";
import axios from "axios";
import { FancyButton } from "@/components/ui/fancybutton";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        userGivenName: formData.fname,
        userFamilyName: formData.lname,
        userEmail: formData.email,
        userPassword: formData.password,
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
      let message = "Registration failed. Please try again.";

      if (axios.isAxiosError<{ message: string }>(err)) {
        message = err.response?.data?.message ?? message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-8">
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
          Create an account
        </h1>
        <h2 className="text-text-subheading text-center mb-6">
          Register to use our service
        </h2>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet disabled={loading}>
              <FieldGroup className="gap-3">
                <FieldSeparator />
                {error && <ErrorMessage message={error} />}
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="fname">
                    First Name
                  </FieldLabel>
                  <Input
                    className="bg-neutral-secondary"
                    onChange={handleChange}
                    id="fname"
                    value={formData.fname}
                    placeholder="Enter your first name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="lname">
                    Last Name
                  </FieldLabel>
                  <Input
                    className="bg-neutral-secondary"
                    onChange={handleChange}
                    id="lname"
                    value={formData.lname}
                    placeholder="Enter your last name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    className="bg-neutral-secondary"
                    id="email"
                    type="email"
                    value={formData.email}
                    autoComplete="true"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="password">
                    Password
                  </FieldLabel>
                  <PasswordInput
                    onChange={handleChange}
                    value={formData.password}
                    className="bg-neutral-secondary"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel
                    className="text-subheading"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    className="bg-neutral-secondary"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </Field>
                <FieldDescription className="text-xs text-center">
                  Your information is completely confidential and will never be
                  shared with third parties.
                </FieldDescription>
                <FieldSeparator />
                <Field>
                  <FancyButton type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Spinner /> Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </FancyButton>
                </Field>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-medium text-primary"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
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
export default Register;