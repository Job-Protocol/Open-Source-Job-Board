export interface GeographicAddress {
  address: string;
  lat: number;
  lng: number;
  // {address: 'Montreal, QC, Canada', lat: 45.5018869, lng: -73.5673919}
}

export interface TimezoneRange {
  min: number;
  max: number;
}
export enum RoleLocationType {
  TimezoneRange,
  LocationList,
  Remote,
}
export interface RoleLocation {
  id: string;
  location_type: RoleLocationType | undefined;
  location_list: GeographicAddress[] | undefined;
  timezone_range: TimezoneRange | undefined;
}
export function getDefaultRoleLocation(): RoleLocation {
  return {
    id: "",
    location_type: undefined,
    location_list: undefined,
    timezone_range: undefined,
  };
}

///////////////

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
  location: RoleLocation | undefined;
  salary_min: number | undefined;
  salary_max: number | undefined;
  equity_pct_min: number | undefined;
  equity_pct_max: number | undefined;
}
export function getDefaultRole(): Role {
  return {
    id: " ",
    title: "",
    company: getDefaultCompany(),
    desc: "",
    location: undefined,
    salary_min: undefined,
    salary_max: undefined,
    equity_pct_min: undefined,
    equity_pct_max: undefined,
  };
}
