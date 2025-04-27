import { Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import UserProvider from "@/context/userContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Font customization
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// SEO metadata customization
export const metadata = {
  title: "⨯Ᵽ Life - Gamify Your Life & Level Up",
  description:
    "⨯Ᵽ Life helps you gamify your personal growth journey with quests, rewards, and leveling up! Track habits, complete challenges, and grow your skills.",
  keywords: "gamify life, personal growth, habit tracker, level up, XP Life, RPG for real life, productivity",
  author: "XP Life Team",
  openGraph: {
    title: "XP Life - Gamify Your Life & Level Up",
    description:
      "XP Life helps you gamify your personal growth journey with quests, rewards, and leveling up! Track habits, complete challenges, and grow your skills.",
    url: "https://xplife.com", // Replace with your actual site URL
    site_name: "XP Life",
    images: [
      {
        url: "https://xplife.com/images/og-image.jpg", // Replace with a real image
        width: 1200,
        height: 630,
        alt: "XP Life - Gamify Your Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xplife", // Replace with your Twitter handle if available
    title: "XP Life - Gamify Your Life & Level Up",
    description:
      "XP Life helps you gamify your personal growth journey with quests, rewards, and leveling up! Track habits, complete challenges, and grow your skills.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <UserProvider>
          <ProtectedRoute>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >

              {children}
              <Toaster />
            </ThemeProvider>
          </ProtectedRoute>
        </UserProvider>
      </body>
    </html>
  );
}
