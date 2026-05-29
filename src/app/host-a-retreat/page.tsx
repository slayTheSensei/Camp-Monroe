import { redirect } from "next/navigation";

export default function HostARetreatRedirect() {
  redirect("/visit?mode=host");
}
