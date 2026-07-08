import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-neutral-500">
        <p>
          ReferralHub may earn a commission when you sign up through links on this site. See our{" "}
          <Link href="/disclosure" className="underline hover:text-emerald-500">
            affiliate disclosure
          </Link>{" "}
          for details.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} ReferralHub</p>
      </div>
    </footer>
  );
}
