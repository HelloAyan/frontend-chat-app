"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLogin } from "../hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";

// react-phone-input-2 gives back the raw digits with the dial code baked in
// (e.g. "8801711000999"), not the national number on its own, so the dial
// code has to be stripped off before checking there's an actual number left
function validate({ phone, dialCode, name }) {
  const errors = {};
  const nationalNumber = dialCode ? phone.slice(dialCode.length) : phone;

  if (!nationalNumber || nationalNumber.length < 6) {
    errors.phone = "Enter a valid phone number";
  }

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name is a bit too short";
  }

  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { login, isPending } = useLogin();

  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handlePhoneChange(value, country) {
    setPhone(value);
    setDialCode(country.dialCode);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate({ phone, dialCode, name });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const result = await login({ phone: `+${phone}`, name: name.trim() });
      toast.success(`Welcome, ${result.user.name.split(" ")[0]}`);
      router.push("/chat");
    } catch (err) {
      toast.error(err.message || "Couldn't log you in, please try again.");
    }
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
          T
        </div>
        <h1 className="text-lg font-semibold text-foreground">Log in to Threadly</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your phone number and name to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <PhoneInput
          label="Phone number"
          country="bd"
          value={phone}
          onChange={handlePhoneChange}
          error={fieldErrors.phone}
        />
        <Input
          id="name"
          type="text"
          label="Your name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={fieldErrors.name}
          autoComplete="name"
        />

        <Button type="submit" loading={isPending} className="mt-2 w-full">
          {isPending ? "Logging in..." : "Continue"}
        </Button>
      </form>

      {/* the API auto-registers on a new number, there's no separate signup
          screen, so this is here to keep first-time users from being confused
          about where the "sign up" button went */}
      <p className="mt-5 text-center text-xs text-muted-foreground">
        New here? Just enter your number and name, we&rsquo;ll set up your account automatically.
      </p>
    </div>
  );
}
