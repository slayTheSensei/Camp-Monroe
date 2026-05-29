import { redirect } from "next/navigation";

export default function StayAtCampRedirect() {
  redirect("/visit?mode=buyout");
}
