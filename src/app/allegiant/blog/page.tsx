import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { BlogList } from "@/components/allegiant/BlogList";
import { Header } from "@/components/allegiant/Header";

export const metadata = {
  title: "Blog: Appliance repair tips & guides — Allegiant Appliances",
  description: "Learn how to maintain and troubleshoot your appliances. Tips, guides, and common issues for all major brands.",
  robots: "index, follow",
};

export default function BlogPage() {
  return (
    <div lang="en">
      <AllegiantShell lang="en">
        <Header lang="en" />
        <main>
          <BlogList lang="en" />
        </main>
      </AllegiantShell>
    </div>
  );
}
