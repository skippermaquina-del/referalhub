export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: August 26, 2026</p>
      <div className="mt-6 space-y-4 text-neutral-600 dark:text-neutral-400">
        <p>
          ReferralHub (&quot;we&quot;, &quot;us&quot;) publishes this site to list referral and
          cashback offers. This policy explains what little data we collect and how it&apos;s
          used.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Information we collect
        </h2>
        <p>
          We do not require accounts, and we do not collect names, emails, or other personal
          information through this site. When you click an offer, our redirect (
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm dark:bg-neutral-900">
            /go/[offer]
          </code>
          ) may increment an anonymous click counter for that offer so we can see which offers are
          popular. This counter is a plain number tied to the offer, not to you — we don&apos;t
          store your IP address, cookies, or any other identifier alongside it.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Third-party sites
        </h2>
        <p>
          Clicking an offer takes you to the company&apos;s own website (bank, card issuer,
          brokerage, or app) to sign up. Once you leave ReferralHub, that company&apos;s own
          privacy policy applies — we don&apos;t see or control what happens on their site.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Analytics &amp; hosting
        </h2>
        <p>
          This site is hosted on Vercel, which may log standard server request data (such as IP
          address and request path) for infrastructure and security purposes, per{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="underline hover:text-emerald-500"
            target="_blank"
            rel="noreferrer"
          >
            Vercel&apos;s privacy policy
          </a>
          . We don&apos;t layer any additional visitor tracking or advertising pixels on top of
          that.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Contact
        </h2>
        <p>
          Questions about this policy? Reach out at{" "}
          <a href="mailto:skippermaquina@gmail.com" className="underline hover:text-emerald-500">
            skippermaquina@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
