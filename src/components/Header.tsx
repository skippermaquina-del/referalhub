import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Referral<span className="text-emerald-500">Hub</span>
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/offers" className="hover:text-emerald-500">
            Offers
          </Link>
          <Link href="/disclosure" className="hover:text-emerald-500">
            Disclosure
          </Link>
        </nav>
      </div>
    </header>
  );
}
