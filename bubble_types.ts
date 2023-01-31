export interface CompanySocials {
  id: string;
  linkedin: string;
  github: string;
  website: string;
}
export function getDefaultCompanySocials(): CompanySocials {
  return {
    id: "",
    linkedin: "",
    github: "",
    website: "",
  };
}

export interface NamedLink {
  id: string;
}
export function getDefaultNamedLink(): NamedLink {
  return { id: "" };
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  socials: CompanySocials;
  press_article_links: NamedLink[];
}
export function getDefaultCompany(): Company {
  return {
    id: "",
    name: "",
    logo: "",
    tagline: "",
    socials: getDefaultCompanySocials(),
    press_article_links: [],
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
