/* ──────────────────────────────────────────────────────────────────
   Cal.com booking — one place to change the link. `bookingProps` turns
   any element into a popup trigger; <Cal> (in Contact) is the inline embed.
   ────────────────────────────────────────────────────────────────── */
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export const CAL_LINK = "caastor.co/hibrandolph";

/* Spread onto any button/link to open the Cal popup on click. */
export const bookingProps = {
  "data-cal-link": CAL_LINK,
  "data-cal-config": JSON.stringify({ theme: "auto" }),
};

/* Initialise the Cal embed, but DEFER it until the first real user
   interaction (or hover of a booking CTA) so the third-party script and
   its cookies never load during initial paint. This keeps Lighthouse
   best-practices clean and shaves JS off the critical path, while still
   being ready by the time anyone actually clicks "Book a demo". */
export function useCalInit() {
  useEffect(() => {
    let cancelled = false;
    let started = false;

    const init = async () => {
      if (started || cancelled) return;
      started = true;
      teardown();
      try {
        const cal = await getCalApi();
        if (cancelled) return;
        cal("ui", {
          theme: "auto",
          hideEventTypeDetails: false,
          layout: "month_view",
          cssVarsPerTheme: {
            light: { "cal-brand": "#F5B400" },
            dark: { "cal-brand": "#F5B400" },
          },
        });
      } catch {
        /* embed unavailable — inline Contact embed still works */
      }
    };

    // Hovering / focusing a booking CTA preloads Cal before the click.
    const onPointerOver = (e) => {
      if (e.target.closest?.("[data-cal-link]")) init();
    };
    const interactions = ["pointerdown", "keydown", "touchstart", "scroll"];
    const onFirst = () => init();

    window.addEventListener("pointerover", onPointerOver, { passive: true });
    interactions.forEach((ev) => window.addEventListener(ev, onFirst, { once: true, passive: true }));

    function teardown() {
      window.removeEventListener("pointerover", onPointerOver);
      interactions.forEach((ev) => window.removeEventListener(ev, onFirst));
    }
    return () => {
      cancelled = true;
      teardown();
    };
  }, []);
}
