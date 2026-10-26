const dismissalKey = "narkis-mobile-notice-dismissed-v1";
export const MOBILE_NOTICE_DISMISSED = "narkis:mobile-notice-dismissed";
let dismissedThisPage = false;

export function isMobileNoticeDismissed() {
  if (dismissedThisPage) return true;
  try {
    return sessionStorage.getItem(dismissalKey) === "true";
  } catch {
    return false;
  }
}

export function dismissMobileNotice() {
  dismissedThisPage = true;
  try {
    sessionStorage.setItem(dismissalKey, "true");
  } catch {
    // The in-page state and event also work when session storage is unavailable.
  }
  window.dispatchEvent(new Event(MOBILE_NOTICE_DISMISSED));
}
