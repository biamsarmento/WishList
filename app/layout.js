import { Nerko_One, Comic_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const nerkoOne = Nerko_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nerko-one",
});

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-comic-neue",
});

export const metadata = {
  title: "Bia's Wish List",
  description: "Lista de presentes de aniversário da Bia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className={`${nerkoOne.variable} ${comicNeue.variable}`}>
      <body className="min-h-screen bg-cream text-rose">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
