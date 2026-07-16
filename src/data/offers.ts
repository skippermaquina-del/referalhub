export type Category = "banking" | "cards" | "investing" | "apps";

export interface Offer {
  slug: string;
  name: string;
  category: Category;
  emoji: string;
  bonus: string;
  description: string;
  requirements: string;
  /**
   * Replace this with your real referral link once you sign up for the program.
   * Anything still set to "REPLACE_ME" is flagged on the site so you know
   * which offers still need your link.
   */
  referralUrl: string;
  featured?: boolean;
}

export const categories: { id: Category; label: string; blurb: string }[] = [
  {
    id: "banking",
    label: "Banking & Neobanks",
    blurb: "Digital banks and checking accounts with sign-up bonuses",
  },
  {
    id: "cards",
    label: "Credit Cards",
    blurb: "Cards with cash or points bonuses for new applicants",
  },
  {
    id: "investing",
    label: "Investing & Crypto",
    blurb: "Brokerages and exchanges that pay for new accounts",
  },
  {
    id: "apps",
    label: "Cashback Apps",
    blurb: "Apps that pay you back on everyday purchases",
  },
];

export const offers: Offer[] = [
  {
    slug: "chime",
    name: "Chime",
    category: "banking",
    emoji: "🏦",
    bonus: "Up to $100",
    description:
      "No-fee mobile banking with early direct deposit and an optional secured credit builder card.",
    requirements: "Set up direct deposit within the first weeks of opening the account.",
    referralUrl: "REPLACE_ME",
    featured: true,
  },
  {
    slug: "sofi-checking",
    name: "SoFi Checking & Savings",
    category: "banking",
    emoji: "🏦",
    bonus: "Up to $300",
    description:
      "Combined checking + savings with a competitive APY on savings and no monthly fees.",
    requirements: "Bonus tiers depend on the amount of direct deposit set up.",
    referralUrl: "REPLACE_ME",
    featured: true,
  },
  {
    slug: "current",
    name: "Current",
    category: "banking",
    emoji: "🏦",
    bonus: "$100",
    description: "Mobile bank account built for fast direct deposit and fee-free overdraft.",
    requirements: "Receive a qualifying direct deposit after signing up. Terms apply.",
    referralUrl: "https://current.com/get-started/?creator_code=ANDRIYS384&impression_id=9aeb37c4-55f2-4c88-acdd-dfb33d255a3a",
  },
  {
    slug: "sofi-personal-loan",
    name: "SoFi Personal Loan",
    category: "banking",
    emoji: "💵",
    bonus: "$300",
    description: "Fixed-rate personal loans with no fees, used for debt consolidation or big expenses.",
    requirements: "Bonus paid out after your loan funds.",
    referralUrl:
      "https://www.sofi.com/invite/personal-loans?gcp=e3b9eef6-70e1-42b1-829d-90d635636a69&isAliasGcp=false",
  },
  {
    slug: "sofi-student-loan-refi",
    name: "SoFi Student Loan Refinance",
    category: "banking",
    emoji: "🎓",
    bonus: "$300",
    description: "Refinance student loans for a lower rate, with no origination or prepayment fees.",
    requirements: "Welcome bonus paid out after your refinanced loan funds.",
    referralUrl:
      "https://www.sofi.com/invite/student-loans?gcp=4468b8a1-4488-4ec2-922a-42661870c2f6&isAliasGcp=false",
  },
  {
    slug: "sofi-medical-student-loan-refi",
    name: "SoFi Medical Student Loan Refinance",
    category: "banking",
    emoji: "🩺",
    bonus: "$1,000",
    description: "Special low rates on student loan refinancing for doctors and dentists.",
    requirements: "For medical/dental professionals only. Bonus paid out after your refinanced loan funds.",
    referralUrl:
      "https://www.sofi.com/invite/medical-student-loans?gcp=8c279c9e-7bf0-4ef6-a4fb-7d32031e570a&isAliasGcp=false",
  },
  {
    slug: "sofi-private-student-loan",
    name: "SoFi Private Student Loan",
    category: "banking",
    emoji: "📚",
    bonus: "$300",
    description: "Private student loans with competitive rates and flexible repayment options.",
    requirements: "Bonus paid out after your loan funds.",
    referralUrl:
      "https://www.sofi.com/invite/private-student-loans?gcp=ba3bcca9-30ed-4686-9329-bdaf70930ea3&isAliasGcp=false",
  },
  {
    slug: "mercury",
    name: "Mercury",
    category: "banking",
    emoji: "🏢",
    bonus: "Referral reward (check current terms)",
    description:
      "Business banking for startups and LLCs — no monthly fees, free ACH/wire transfers, and virtual cards.",
    requirements: "For business accounts (LLC/corp) only, not personal banking.",
    referralUrl: "https://mercury.com/r/gftc-llc",
    featured: true,
  },
  {
    slug: "chase-sapphire-preferred",
    name: "Chase Sapphire Preferred",
    category: "cards",
    emoji: "💳",
    bonus: "60,000+ points",
    description: "Travel rewards card with strong points earning on dining and travel.",
    requirements: "Meet the minimum spend requirement within the first 3 months.",
    referralUrl: "REPLACE_ME",
    featured: true,
  },
  {
    slug: "discover-it",
    name: "Discover it Cash Back",
    category: "cards",
    emoji: "💳",
    bonus: "Cashback match (1st year)",
    description: "No annual fee card that matches all cash back earned in your first year.",
    requirements: "Approval and normal card usage; no minimum spend for the match.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "capital-one-quicksilver",
    name: "Capital One Quicksilver",
    category: "cards",
    emoji: "💳",
    bonus: "$200",
    description: "Flat 1.5% cash back on every purchase, no annual fee.",
    requirements: "Meet the minimum spend requirement within the first 3 months.",
    referralUrl: "https://i.capitalone.com/Jn3CIL3YT",
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    category: "investing",
    emoji: "📈",
    bonus: "Free stock",
    description: "Commission-free stock, ETF, options and crypto trading.",
    requirements: "Open and fund an account to claim the free stock.",
    referralUrl: "https://join.robinhood.com/andriys-b7e824",
    featured: true,
  },
  {
    slug: "coinbase",
    name: "Coinbase",
    category: "investing",
    emoji: "🪙",
    bonus: "Up to $10 in crypto",
    description: "Popular crypto exchange, easiest on-ramp for first-time crypto buyers.",
    requirements: "Complete identity verification and trade or hold a qualifying amount.",
    referralUrl: "https://coinbase.com/join/THJ3KDP?src=ios-link",
    featured: true,
  },
  {
    slug: "coinbase-advanced",
    name: "Coinbase Advanced",
    category: "investing",
    emoji: "📊",
    bonus: "Lower trading fees",
    description: "Coinbase's advanced trading interface — order types and lower fees for active traders.",
    requirements: "Complete identity verification to start trading.",
    referralUrl: "https://advanced.coinbase.com/join/RRPS6FB",
  },
  {
    slug: "webull",
    name: "Webull",
    category: "investing",
    emoji: "📈",
    bonus: "Free stocks",
    description: "Commission-free trading platform with free stock promos for new accounts.",
    requirements: "Open an account and make a qualifying deposit.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "rakuten",
    name: "Rakuten",
    category: "apps",
    emoji: "🛍️",
    bonus: "$50",
    description: "Cash back on purchases at thousands of online stores, paid out quarterly.",
    requirements: "Spend $50 within 90 days of signing up to get the $50 bonus.",
    referralUrl: "https://www.rakuten.com/r/GFTCLL?eeid=44971",
    featured: true,
  },
  {
    slug: "ibotta",
    name: "Ibotta",
    category: "apps",
    emoji: "🛒",
    bonus: "$10-$20",
    description: "Cash back on groceries and everyday shopping, in-store and online.",
    requirements: "Redeem a qualifying offer after signing up.",
    referralUrl: "https://ibotta.onelink.me/iUfE/8cc13c64?friend_code=vlwpwqn",
  },
  {
    slug: "upside",
    name: "Upside",
    category: "apps",
    emoji: "⛽",
    bonus: "Extra cents/gallon",
    description: "Cash back on gas, groceries, and restaurants near you.",
    requirements: "Claim and complete a qualifying offer.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "airtable",
    name: "Airtable",
    category: "apps",
    emoji: "🗂️",
    bonus: "Account credit",
    description:
      "Flexible spreadsheet-database hybrid for organizing projects, content calendars, and workflows.",
    requirements: "Sign up and start a workspace to trigger the referral credit.",
    referralUrl: "https://airtable.com/invite/r/7TlWU5Vu",
  },
  {
    slug: "capital-one-shopping",
    name: "Capital One Shopping",
    category: "apps",
    emoji: "🛍️",
    bonus: "Automatic price comparison + rewards",
    description:
      "Free browser extension that auto-applies coupon codes and compares prices while you shop online.",
    requirements: "Install the extension and shop as usual — rewards accrue automatically.",
    referralUrl: "https://capitaloneshopping.com/r/475bc1e4-9488-40a0-96ba-1cb6bde381b1?e=ezi2m",
    featured: true,
  },
  {
    slug: "replit",
    name: "Replit",
    category: "apps",
    emoji: "💻",
    bonus: "Account credit",
    description: "Cloud-based coding platform for building, deploying, and hosting apps from the browser.",
    requirements: "Sign up using the referral link to trigger the credit.",
    referralUrl: "https://replit.com/refer/skippermaquina",
  },
  {
    slug: "marathon-arco-rewards",
    name: "Marathon ARCO Rewards",
    category: "apps",
    emoji: "⛽",
    bonus: "Rewards on gas purchases",
    description: "Loyalty rewards program for Marathon and ARCO gas stations — earn points on fuel purchases.",
    requirements: "Sign up with the referral link or code DLU0KAV5 to start earning.",
    referralUrl: "https://app.marathonarcorewards.com/r/DLU0KAV5",
  },
  {
    slug: "claude",
    name: "Claude",
    category: "apps",
    emoji: "🤖",
    bonus: "Account credit",
    description: "AI assistant from Anthropic for writing, coding, research, and more.",
    requirements: "Sign up using the referral link to trigger the credit.",
    referralUrl: "https://claude.ai/referral/u655IQCi2w?s=ios",
  },
  {
    slug: "chase",
    name: "Chase",
    category: "banking",
    emoji: "🏦",
    bonus: "$50 (referrer) / up to $400 (referred)",
    description: "Major bank with checking and savings accounts and a well-known referral program.",
    requirements: "Referred friend must complete qualifying activities (e.g. direct deposit) to trigger the bonus.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "axos-bank",
    name: "Axos Bank",
    category: "banking",
    emoji: "🏦",
    bonus: "Referral reward (uncapped)",
    description: "Online bank with checking, savings, and no monthly fees. One of the few referral programs with no limit on referrals.",
    requirements: "Referred friend must open and fund an account.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "acorns",
    name: "Acorns",
    category: "investing",
    emoji: "🌰",
    bonus: "Up to $1,200 (tiered by referrals)",
    description: "Micro-investing app that rounds up purchases and invests the spare change.",
    requirements: "Bonus tiers scale with number of friends referred (e.g. $300 for 2, up to $1,200 for 4).",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "fetch-rewards",
    name: "Fetch Rewards",
    category: "apps",
    emoji: "🧾",
    bonus: "Points redeemable for gift cards",
    description: "Cash back by scanning grocery and shopping receipts — one of the easiest apps to get started with.",
    requirements: "Scan your first receipt after signing up with the referral link.",
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "shopkick",
    name: "Shopkick",
    category: "apps",
    emoji: "🛍️",
    bonus: "Points redeemable for gift cards",
    description: "Earn rewards for walking into stores, scanning items, and shopping online.",
    requirements: "Complete a qualifying in-app action after signing up with the referral link.",
    referralUrl: "REPLACE_ME",
  },
];

export function getOffersByCategory(category: Category): Offer[] {
  return offers.filter((offer) => offer.category === category);
}

export function getFeaturedOffers(): Offer[] {
  return offers.filter((offer) => offer.featured);
}

export function getOfferBySlug(slug: string): Offer | undefined {
  return offers.find((offer) => offer.slug === slug);
}
