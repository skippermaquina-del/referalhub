export type Category = "banking" | "cards" | "investing" | "apps";

export interface Offer {
  slug: string;
  name: string;
  category: Category;
  emoji: string;
  /** Brand's website domain, used to pull its official logo from Brandfetch. */
  domain: string;
  bonus: string;
  description: string;
  requirements: string;
  /** Your referral link. Only add offers here once you have one. */
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
    slug: "current",
    name: "Current",
    category: "banking",
    emoji: "🏦",
    domain: "current.com",
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
    domain: "sofi.com",
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
    domain: "sofi.com",
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
    domain: "sofi.com",
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
    domain: "sofi.com",
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
    domain: "mercury.com",
    bonus: "Referral reward (check current terms)",
    description:
      "Business banking for startups and LLCs — no monthly fees, free ACH/wire transfers, and virtual cards.",
    requirements: "For business accounts (LLC/corp) only, not personal banking.",
    referralUrl: "https://mercury.com/r/gftc-llc",
    featured: true,
  },
  {
    slug: "capital-one-quicksilver",
    name: "Capital One Quicksilver",
    category: "cards",
    emoji: "💳",
    domain: "capitalone.com",
    bonus: "$200",
    description: "Flat 1.5% cash back on every purchase, no annual fee.",
    requirements: "Meet the minimum spend requirement within the first 3 months.",
    referralUrl: "https://i.capitalone.com/Jn3CIL3YT",
  },
  {
    slug: "robinhood-gold-card",
    name: "Robinhood Gold Card",
    category: "cards",
    emoji: "💳",
    domain: "robinhood.com",
    bonus: "3% cash back",
    description:
      "Stainless steel Visa Signature card earning 3% cash back on every purchase for Robinhood Gold members.",
    requirements: "Requires a Robinhood Gold subscription; apply and get approved using the link below.",
    referralUrl: "https://join.robinhood.com/andriys-b7e824",
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    category: "investing",
    emoji: "📈",
    domain: "robinhood.com",
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
    domain: "coinbase.com",
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
    domain: "coinbase.com",
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
    domain: "webull.com",
    bonus: "Free stocks",
    description: "Commission-free trading platform with free stock promos for new accounts.",
    requirements: "Open an account and make a qualifying deposit.",
    referralUrl: "https://www.webull.com/s/3KhusCJYE5cJEnp6dX",
  },
  {
    slug: "rakuten",
    name: "Rakuten",
    category: "apps",
    emoji: "🛍️",
    domain: "rakuten.com",
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
    domain: "ibotta.com",
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
    domain: "upside.com",
    bonus: "Extra cents/gallon",
    description: "Cash back on gas, groceries, and restaurants near you.",
    requirements: "Claim and complete a qualifying offer.",
    referralUrl: "https://upside.app.link/4PPUKQ",
  },
  {
    slug: "airtable",
    name: "Airtable",
    category: "apps",
    emoji: "🗂️",
    domain: "airtable.com",
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
    domain: "capitaloneshopping.com",
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
    domain: "replit.com",
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
    domain: "marathonarcorewards.com",
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
    domain: "claude.ai",
    bonus: "Account credit",
    description: "AI assistant from Anthropic for writing, coding, research, and more.",
    requirements: "Sign up using the referral link to trigger the credit.",
    referralUrl: "https://claude.ai/referral/u655IQCi2w?s=ios",
  },
  {
    slug: "axos-bank",
    name: "Axos Bank",
    category: "banking",
    emoji: "🏦",
    domain: "axosbank.com",
    bonus: "Referral reward (uncapped)",
    description: "Online bank with checking, savings, and no monthly fees. One of the few referral programs with no limit on referrals.",
    requirements: "Referred friend must open and fund an account.",
    referralUrl: "https://share.axosbank.com/andriy!2ff1a65fbc!a",
  },
  {
    slug: "fetch-rewards",
    name: "Fetch Rewards",
    category: "apps",
    emoji: "🧾",
    domain: "fetch.com",
    bonus: "Points redeemable for gift cards",
    description: "Cash back by scanning grocery and shopping receipts — one of the easiest apps to get started with.",
    requirements: "Scan your first receipt after signing up with the referral link.",
    referralUrl: "https://referral.fetch.com/vvv3/referralqr?code=8FFMQG",
  },
  {
    slug: "uber-driver",
    name: "Uber (Drive/Deliver)",
    category: "apps",
    emoji: "🚗",
    domain: "uber.com",
    bonus: "$1,750",
    description: "Earn money driving passengers or delivering with Uber, on your own schedule.",
    requirements: "Complete your first 153 passenger trips within 30 days of signing up.",
    referralUrl: "https://www.uber.com/signup/drive/deliver/?invite_code=dj7bng",
    featured: true,
  },
  {
    slug: "capital-one-savor-student",
    name: "Capital One Savor Student",
    category: "cards",
    emoji: "🍽️",
    domain: "capitalone.com",
    bonus: "No sign-up bonus",
    description: "3% cash back on dining, entertainment, popular streaming services, and grocery stores, with no annual fee — built for students building credit.",
    requirements: "Apply and get approved for the card using the link below.",
    referralUrl: "https://www.capitalone.com/credit-cards/savor-student/?external_id=EASEAPP_CMA_CSXM_EASE_CSX_3399550_PDP_1013_CTA00_20240709",
  },
  {
    slug: "kashkick",
    name: "KashKick",
    category: "apps",
    emoji: "💰",
    domain: "kashkick.com",
    bonus: "Cash payouts",
    description: "Get-paid-to site — earn cash for surveys, offers, and playing games, paid via PayPal.",
    requirements: "Sign up and complete a qualifying survey or offer.",
    referralUrl: "https://app.kashkick.com?ref=JtyYN7hmfGda",
  },
  {
    slug: "libertex",
    name: "Libertex",
    category: "investing",
    emoji: "📈",
    domain: "libertex.com",
    bonus: "Free stock up to $200",
    description: "Online trading platform for stocks, crypto, and CFDs — gift a free share to new users you refer.",
    requirements: "Sign up and complete your first investment of any amount using promo code \"GIFT\".",
    referralUrl: "https://app.libertex.org/goto/raf2?rid=51158472",
  },
  {
    slug: "lemon",
    name: "Lemon",
    category: "investing",
    emoji: "🍋",
    domain: "lemon.me",
    bonus: "Free Bitcoin",
    description: "Crypto app where you can buy, sell, and earn Bitcoin — both you and the person you refer earn a reward.",
    requirements: "Download the app and complete the sign-up steps using code \"andsams17\". Valid until September 15, 2026.",
    referralUrl: "https://lemon.go.link/9TbV8",
  },
  {
    slug: "bitso",
    name: "Bitso",
    category: "investing",
    emoji: "🪙",
    domain: "bitso.com",
    bonus: "Weekly yield rewards",
    description: "Invest in crypto or 5,000+ global stocks from one app, with weekly yield on your holdings.",
    requirements: "Download the app and make your first purchase within 7 days using code \"erwlx\".",
    referralUrl: "https://bitso.go.link/23Q19?adj_label=erwlx",
  },
  {
    slug: "instacart",
    name: "Instacart",
    category: "apps",
    emoji: "🛒",
    domain: "instacart.com",
    bonus: "$10 off",
    description: "Grocery delivery app — get your order from local stores brought to your door.",
    requirements: "Use code \"G909CC6\" at checkout or sign up through the link. Terms apply.",
    referralUrl: "https://inst.cr/t/3b9de9410",
  },
  {
    slug: "instacart-shopper",
    name: "Instacart Shopper",
    category: "apps",
    emoji: "🛍️",
    domain: "instacart.com",
    bonus: "Referral reward (check current terms)",
    description: "Earn money shopping and delivering Instacart orders on your own schedule.",
    requirements: "Sign up to become a shopper through the link. Terms apply.",
    referralUrl:
      "https://shoppers.instacart.com/?referral=SAD4859AF&utm_medium=other&utm_source=instacart_referral&utm_campaign=supply_referral",
  },
  {
    slug: "instawork",
    name: "Instawork",
    category: "apps",
    emoji: "🧰",
    domain: "instawork.com",
    bonus: "Referral reward (check current terms)",
    description: "Flexible work platform — pick up shifts at nearby businesses on your own schedule.",
    requirements: "Sign up through the link and complete your first shift. Terms apply.",
    referralUrl: "https://app.instawork.com/worker?ref_code=qg711vv&utm_source=refer-copy-button",
  },
  {
    slug: "paypal",
    name: "PayPal",
    category: "apps",
    emoji: "💸",
    domain: "paypal.com",
    bonus: "$10 per friend (up to $100/year)",
    description: "Widely-used payment app for sending, receiving, and shopping online.",
    requirements: "Sign up with the link, link a bank or card, verify your phone, and complete a $5+ transaction within 30 days.",
    referralUrl: "https://py.pl/8KhV5fuHiz",
  },
];

// Brandfetch Logo CDN. The `c` param is Brandfetch's public client ID for
// browser embeds (hotlinking is their intended use; server-side fetches are
// blocked), so these load straight in the visitor's browser via <img>.
const BRANDFETCH_CLIENT_ID = "1idCSZcCK3yPBuFDVWi";

export function getOfferLogoUrl(offer: Offer, size = 128): string {
  return `https://cdn.brandfetch.io/domain/${offer.domain}/w/${size}/h/${size}/fallback/lettermark?c=${BRANDFETCH_CLIENT_ID}`;
}

export function getOffersByCategory(category: Category): Offer[] {
  return offers.filter((offer) => offer.category === category);
}

export function getFeaturedOffers(): Offer[] {
  return offers.filter((offer) => offer.featured);
}

export function getOfferBySlug(slug: string): Offer | undefined {
  return offers.find((offer) => offer.slug === slug);
}
