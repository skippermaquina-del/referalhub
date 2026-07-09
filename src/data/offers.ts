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
    bonus: "Up to $50",
    description: "Mobile bank account built for fast direct deposit and fee-free overdraft.",
    requirements: "Direct deposit required within 45 days.",
    referralUrl: "REPLACE_ME",
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
    referralUrl: "REPLACE_ME",
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    category: "investing",
    emoji: "📈",
    bonus: "Free stock",
    description: "Commission-free stock, ETF, options and crypto trading.",
    requirements: "Open and fund an account to claim the free stock.",
    referralUrl: "REPLACE_ME",
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
    referralUrl: "REPLACE_ME",
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
    bonus: "$30",
    description: "Cash back on purchases at thousands of online stores, paid out quarterly.",
    requirements: "Make a qualifying purchase of $30+ within 90 days of signing up.",
    referralUrl: "REPLACE_ME",
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
    referralUrl: "REPLACE_ME",
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
