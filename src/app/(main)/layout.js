import { Outfit } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
// Font customization
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (<>
    <Header />
    {children}
    <Footer />
  </>
  );
}
