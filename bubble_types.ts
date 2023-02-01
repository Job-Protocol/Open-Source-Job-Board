export interface CompanySocials {
  id: string;
  twitter: string;
  linkedin: string;
  github: string;
  website: string;
}
export function getDefaultCompanySocials(): CompanySocials {
  return {
    id: "",
    twitter: "https://www.twitter.com",
    linkedin: "www.google.com",
    github: "www.google.com",
    website: "www.google.com",
  };
}

export interface NamedLink {
  display_name: string;
  link: string;
}
export function getDefaultNamedLink(): NamedLink {
  return { display_name: "", link: "" };
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  num_employees: number;
  headquarters: string;
  socials: CompanySocials | undefined;
  press_article_links: NamedLink[] | undefined;
}
export function getDefaultCompany(): Company {
  return {
    id: "",
    name: "",
    logo: "",
    tagline: "",
    num_employees: 0,
    headquarters: "",
    socials: getDefaultCompanySocials(),
    press_article_links: undefined,
  };
}

export interface Role {
  id: string;
  title: string;
  company: Company;
  desc: string;
}
export function getDefaultRole(): Role {
  return {
    id: " ",
    title: "",
    company: getDefaultCompany(),
    desc: "",
  };
}
