import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trại Cai Nghiện — Làm chủ sự tập trung, sống có chủ đích",
  description: "Chúng tôi ở đây để cùng bạn đối diện và vượt qua xao nhãng số, giành lại quyền làm chủ tâm trí — làm chủ sự tập trung, sống có chủ đích.",
  keywords: ["trại cai nghiện", "sự tập trung", "làm chủ sự tập trung", "sống có chủ đích", "cai nghiện dopamine", "deep work", "trị não phân tâm", "sương mù não", "kaizen", "ikigai"],
  icons: {
    icon: "/images/logo-totem.webp",
    apple: "/images/logo-totem.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${lora.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && supportDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] font-sans antialiased selection:bg-[#3A5A40] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
