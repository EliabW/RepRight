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
import axios from "axios";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <Card className="max-w-sm mx-auto mt-10 p-8 border-0 shadow-lg">
        <h1 className="text-secondary text-3xl font-bold text-center">
          Create an account
        </h1>
        <h2 className="text-text-subheading text-center mb-6">
          Register to use our service
        </h2>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet disabled={loading}>
              <FieldGroup className="gap-5">
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
                  <Input
                    onChange={handleChange}
                    value={formData.password}
                    className="bg-neutral-secondary"
                    id="password"
                    type="password"
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
                  <Input
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    className="bg-neutral-secondary"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </Field>
                <FieldDescription className="text-xs opacity-50 text-center">
                  Your information is completely confidential and will never be
                  shared with third parties.
                </FieldDescription>
                <FieldSeparator />
                <Field>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Spinner /> Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
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
    </>
  );
}
export default Register;
