// Site Configuration
export const SITE_CONFIG = {
  name: "Patience Fero",
  title: "Patience Fero - Scholar, Leader, Social Entrepreneur",
  description:
    "Patience Fero's professional portfolio and Her Promise Fulfilled nonprofit organization",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  author: {
    name: "Patience Fero",
    email: "feropatience@gmail.com",
    phone: "+86 1955-811-1273",
    location: "Hangzhou, China",
    linkedin: "https://linkedin.com/in/patiefero",
    wechat: "Patieyannah30",
  },
  organization: {
    name: "Her Promise Fulfilled",
    mission:
      "Empowering single mothers, widows, children, and disadvantaged families through education, economic support, and community development.",
  },
};

// EKD Digital Assets Configuration
export const EKD_ASSETS_CONFIG = {
  baseUrl: "https://www.assets.andgroupco.com",
  apiKey: process.env.EKD_API_KEY || "",
  apiSecret: process.env.EKD_API_SECRET || "",
  clientId: "herpromiseforfilled",
  projectName: "patience-fero",
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const POSTS_PER_PAGE = 10;

// Program Categories
export const PROGRAM_CATEGORIES = [
  "Education Support",
  "Economic Empowerment",
  "Community Development",
  "Youth Empowerment",
] as const;

// Social Links
export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/patiefero",
  email: "mailto:feropatience@gmail.com",
};
