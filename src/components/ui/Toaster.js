import { Toaster as HotToaster } from "react-hot-toast";

// react-hot-toast doesn't know about our design tokens either, so its look
// gets wired up here once instead of passing a style object at every call
// site. same reasoning as the color tokens in globals.css: one place to
// change if the toast styling needs to move later.
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 12px 32px -12px rgb(0 0 0 / 0.18)",
          padding: "0.75rem 1rem",
          fontSize: "0.875rem",
          maxWidth: "380px",
        },
        success: {
          iconTheme: {
            primary: "var(--success)",
            secondary: "var(--success-foreground)",
          },
          style: {
            borderLeft: "3px solid var(--success)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--destructive-foreground)",
          },
          style: {
            borderLeft: "3px solid var(--destructive)",
          },
        },
        loading: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--primary-foreground)",
          },
        },
      }}
    />
  );
}
