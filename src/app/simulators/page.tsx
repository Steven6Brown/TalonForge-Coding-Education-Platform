import { redirect } from "next/navigation";

/** The simulators grew into the Careers section. Keep old links working. */
export default function SimulatorsRedirect() {
  redirect("/careers");
}
