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
          <a
            href="https://join.slack.com/t/skipper-me72160/shared_invite/zt-42nitluao-GSnP5ixwuzlrLdSW2d23MQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-500"
          >
            Join our Slack
          </a>
        </nav>
      </div>
    </header>
  );
}
