import { redirect } from "next/navigation";

// middleware already routes "/" to either /login or /chat depending on the
// session cookie before this ever renders. this just covers the edge case
// of someone hitting the route in a context that skips middleware.
export default function Home() {
  redirect("/login");
}
