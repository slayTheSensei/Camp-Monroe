import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import RequestClient from "./RequestClient";

export const metadata = {
  title: "Request an invitation — Cambridge Gun & Rod Club",
};

export default function RequestPage() {
  return (
    <>
      <Nav />
      <RequestClient />
      <Footer />
    </>
  );
}
