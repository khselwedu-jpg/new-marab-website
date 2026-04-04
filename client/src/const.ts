export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Redirect to local admin login page - no Manus OAuth dependency
export const getLoginUrl = () => {
  return "/login";
};
