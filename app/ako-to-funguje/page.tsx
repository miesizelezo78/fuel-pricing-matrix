import { redirect } from "next/navigation";

export const metadata = {
  title: "Ako to predávame",
};

export default function HowItWorksRedirect() {
  redirect("/ako-to-predavame");
}
