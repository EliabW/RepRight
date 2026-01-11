import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "../components/ui/field";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  return (
    <>
      <Card className="max-w-sm mx-auto mt-10 p-8 border-0 shadow-lg">
        <h1 className="text-secondary text-3xl font-bold text-center">
          Create an account
        </h1>
        <h2 className="text-text-subheading text-center mb-6">
          Register to use our service
        </h2>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldGroup className="gap-5">
                <FieldSeparator />
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="fname">
                    First Name
                  </FieldLabel>
                  <Input
                    className="bg-neutral-secondary"
                    id="fname"
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
                    id="lname"
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
                    autoComplete="true"
                    placeholder="Enter your email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-subheading" htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
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
                  <Button type="submit" className="w-full">
                    Register
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
