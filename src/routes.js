/* Every page of the site: address, design file and the title and description used for search and sharing. */
export const ROUTES = [
  {
    path: "/",
    design: "home",
    title: "GAA Group | Advisory, Compliance and Talent",
    description:
      "GAA Group brings together GAA Consulting, Filings First and Hirings First: advisory, compliance and talent for growing businesses.",
  },
  {
    path: "/about",
    design: "about",
    title: "About Us | GAA Group",
    description:
      "One group for every dimension of business growth. Learn how GAA Consulting, Filings First and Hirings First work together, plus CS articleship and careers.",
  },
  {
    path: "/team",
    design: "team",
    title: "Our Team | GAA Group",
    description:
      "Meet the professionals behind GAA Group: advisers, accountants, company secretaries and talent specialists working as one team in Bangalore.",
  },
  {
    path: "/careers",
    design: "careers",
    title: "Careers | GAA Group",
    description:
      "Careers at GAA Group: CS Articleship, CS Semi-qualified and CS Qualified roles, opportunities for lawyers, and college internship programmes in Bengaluru.",
  },
  {
    path: "/contact",
    design: "contact",
    title: "Contact Us | GAA Group",
    description:
      "Contact G Akshay & Associates and GAA Group in Bengaluru. Request a fixed-scope proposal and your enquiry goes straight to the right team.",
  },
  {
    path: "/privacy",
    design: "privacy",
    title: "Privacy, Terms and Disclaimer | GAA Group",
    description:
      "Privacy policy, cookie policy, terms of use and disclaimer for the GAA Group website, operated by G Akshay & Associates.",
  },
];

export const NOT_FOUND = {
  path: "/404",
  design: "404",
  title: "Page not found | GAA Group",
  description: "The page you are looking for could not be found.",
};

export function normalise(pathname) {
  let p = (pathname || "/").replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (p === "/home") p = "/";
  return p.toLowerCase();
}

export function findRoute(pathname) {
  const p = normalise(pathname);
  return ROUTES.find((r) => r.path === p) || null;
}
