import useVolunteerInterestApp from "../application/use-volunteer-interest-app";

export default function useVolunteerInterest() {
  return useVolunteerInterestApp({ deps: useHomeDeps() });
}
