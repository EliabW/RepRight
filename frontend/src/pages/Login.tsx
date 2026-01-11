import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "../components/ui/field";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <FieldSeparator />

                <Field>
                  <FieldLabel className="text-subheading" htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
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
                  <Button type="submit" className="w-full">
                    Login
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
