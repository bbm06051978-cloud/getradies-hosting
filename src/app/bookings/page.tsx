import { redirect } from "next/navigation";
export default function BookingsPage() {
  redirect("/my-jobs?tab=inprogress");
}