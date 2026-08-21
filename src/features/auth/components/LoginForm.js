"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useLogin } from "../hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function validate({ phone, name }) {
  const errors = {};

  if (!phone || phone.length < 6) {
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
  const { login, isPending } = useLogin();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // digits only, no "+", no country picker. the API stores phone numbers
  // verbatim and search matches phone exactly (not a substring), so keeping
  // this dead simple means the same digits typed here are the same digits
  // that'll find this account again later
  function handlePhoneChange(event) {
    setPhone(event.target.value.replace(/\D/g, ""));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate({ phone, name });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const result = await login({ phone, name: name.trim() });
      toast.success(`Welcome, ${result.user.name.split(" ")[0]}`);
      // a hard navigation here instead of router.push avoids a race right
      // after login: a client-side transition keeps the same React tree
      // (and RTK Query cache) alive, so the session-guard effect on /chat
      // re-evaluates while that cache is still catching up to the cookie
      // that was just set, and can bounce straight back to /login. a full
      // reload means proxy.js and every hook re-run fresh, cookie already
      // in place.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/chat";
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
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          label="Phone number"
          placeholder="01712345678"
          value={phone}
          onChange={handlePhoneChange}
          error={fieldErrors.phone}
          autoComplete="tel"
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
