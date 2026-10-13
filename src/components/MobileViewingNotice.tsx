import { useEffect, useRef, useState } from "react";
import { TbArrowRight, TbDeviceDesktop, TbSparkles, TbX } from "react-icons/tb";
import { assetUrl, siteConfig } from "../data/siteContent";
import "./mobileViewingNotice.css";

const mobileQuery = "(max-width: 760px), (pointer: coarse) and (max-width: 1024px) and (max-height: 500px)";
const dismissalKey = "narkis-mobile-notice-dismissed-v1";

export function MobileViewingNotice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(dismissalKey) === "true";
    } catch {
      return false;
    }
  });
  const visible = mobile && !dismissed;

  useEffect(() => {
    const query = window.matchMedia(mobileQuery);
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!visible || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    continueRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(dismissalKey, "true");
    } catch {
      // Keep the notice dismissed for this page even when storage is unavailable.
    }
  };

  return (
    <dialog
      className="mobile-viewing-notice"
      ref={dialogRef}
      aria-labelledby="mobile-notice-title"
      aria-describedby="mobile-notice-description"
      onCancel={(event) => { event.preventDefault(); dismiss(); }}
    >
      <div className="mobile-notice-brand">
        <img src={assetUrl(siteConfig.logo)} width="1875" height="839" alt="Narkis" />
        <button className="mobile-notice-close" type="button" aria-label="Close viewing notice" onClick={dismiss}>
          <TbX aria-hidden="true" />
        </button>
      </div>
      <div className="mobile-notice-content">
        <div className="mobile-notice-illustration" aria-hidden="true">
          <TbDeviceDesktop />
          <TbSparkles className="mobile-notice-sparkles" />
        </div>
        <p className="mobile-notice-eyebrow">A little heads-up</p>
        <h2 id="mobile-notice-title">Made for a <br /><span>bigger screen.</span></h2>
        <p id="mobile-notice-description">
          This portfolio is designed to be viewed on a computer. To enjoy the full experience and all the details, please open it on desktop.
        </p>
        <button className="mobile-notice-continue" ref={continueRef} type="button" onClick={dismiss}>
          Continue on mobile <TbArrowRight aria-hidden="true" />
        </button>
      </div>
    </dialog>
  );
}
