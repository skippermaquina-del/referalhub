import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Assistant } from "@/components/Assistant";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      {children}
      <Footer />
      <Assistant />
    </div>
  );
}
