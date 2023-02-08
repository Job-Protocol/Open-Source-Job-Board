export interface GeographicAddress {
  address: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
  country: string | undefined;
  city: string | undefined;
  utc_offset: number | undefined;
  // {address: 'Montreal, QC, Canada', lat: 45.5018869, lng: -73.5673919}
}
export function getDefaultGeographicAddress(): GeographicAddress {
  return {
    address: undefined,
    lat: undefined,
    lng: undefined,
    country: undefined,
    city: undefined,
    utc_offset: undefined,
  };
}


export interface RequirementArgument {
  argument: string;
  requirement: Requirement;
  is_required: boolean;
  is_requirement_satisfied: boolean;
  rank_nb: number;
}
export interface Requirement {
  id: string;
  desc: string;
  is_required: boolean;
  rank_nb: number;
}
export function getDefaultRequirement(): Requirement {
  return {
    id: "",
    desc: "",
    is_required: false,
    rank_nb: 0
  };
}



export interface TimezoneRange {
  min: number;
  max: number;
}
export enum RoleLocationType {
  LocationList,
  TimezoneRange,
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
  founding_year: number | undefined;
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
    founding_year: undefined
  };
}


export enum RoleState {
  Live,
  Hidden,
  Closed,
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
  requirements: Requirement[] | undefined;
  state: RoleState;
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
    requirements: undefined,
    state: RoleState.Hidden,
  };
}
