"use client";

import PhoneInputBase from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/cn";

// the library ships without a digit-grouping mask for a few countries we
// care about (Bangladesh included), so it just shows one long run of
// digits instead of something readable. filled in by hand, callers can
// still override/extend via the masks prop.
const DEFAULT_MASKS = {
  bd: "....-......",
};

// react-phone-input-2 ships its own bootstrap-ish CSS, the actual visual
// overrides live in globals.css under .phone-input so this still reads off
// the same design tokens as every other input in the app.
export function PhoneInput({ label, error, id = "phone", masks, onChange, ...props }) {
  // in E.164 form a number never carries its domestic trunk prefix, so a
  // "0" right after the dial code isn't a real digit, it's someone typing
  // the number the way they'd dial it locally (01712... instead of 1712...)
  function handleChange(value, country, event, formattedValue) {
    const nationalNumber = value.slice(country.dialCode.length).replace(/^0+/, "");
    const sanitizedValue = country.dialCode + nationalNumber;
    onChange?.(sanitizedValue, country, event, formattedValue);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <PhoneInputBase
        inputProps={{ id, name: id, autoComplete: "tel" }}
        enableSearch
        disableSearchIcon
        searchPlaceholder="Search country"
        containerClass={cn("phone-input", error && "phone-input-error")}
        masks={{ ...DEFAULT_MASKS, ...masks }}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
