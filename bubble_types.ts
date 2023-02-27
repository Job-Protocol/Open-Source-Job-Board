export interface GeographicAddress {
  address: string | null;
  lat: number | null;
  lng: number | null;
  country: string | null;
  city: string | null;
  utc_offset: number | null;
  // {address: 'Montreal, QC, Canada', lat: 45.5018869, lng: -73.5673919}
}
export function getDefaultGeographicAddress(): GeographicAddress {
  return {
    address: null,
    lat: null,
    lng: null,
    country: null,
    city: null,
    utc_offset: null,
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



export enum RoleType {
  Engineering,
  Design,
  Marketing,
  SalesBD,
  Operations,
  Product
}

export enum RoleLocationType {
  LocationList,
  TimezoneRange,
  Remote,
}
export interface RoleLocation {
  id: string;
  location_type: RoleLocationType | null;
  location_list: GeographicAddress[] | null;
  timezone_range: TimezoneRange | null;
}
export function getDefaultRoleLocation(): RoleLocation {
  return {
    id: "",
    location_type: null,
    location_list: null,
    timezone_range: null,
  };
}

///////////////

export interface CompanySocials {
  id: string;
  twitter: string | null;
  linkedin: string | null;
  website: string | null;
}
export function getDefaultCompanySocials(): CompanySocials {
  return {
    id: "",
    twitter: null,
    linkedin: null,
    website: null,
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
  mission: string | null;
  num_employees: number;
  headquarters: string;
  socials: CompanySocials | null;
  press_article_links: NamedLink[] | null;
  founding_year: number | null;
  slug: string | null;
  priority: number | null;
  keywords: string[] | null;
}
export function getDefaultCompany(): Company {
  return {
    id: "",
    name: "",
    logo: "https://static.thenounproject.com/png/88781-200.png",
    tagline: "",
    mission: null,
    num_employees: 0,
    headquarters: "",
    socials: getDefaultCompanySocials(),
    press_article_links: null,
    founding_year: null,
    slug: null,
    priority: null,
    keywords: null
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
  location: RoleLocation | null;
  salary_min: number | null;
  salary_max: number | null;
  equity_pct_min: number | null;
  equity_pct_max: number | null;
  bounty: number | null;
  requirements: Requirement[] | null;
  state: RoleState;
  type: RoleType | null;
  keywords: string[] | null;
  slug: string | null;
}
export function getDefaultRole(): Role {
  return {
    id: "",
    title: "",
    company: getDefaultCompany(),
    desc: "",
    location: null,
    salary_min: null,
    salary_max: null,
    equity_pct_min: null,
    equity_pct_max: null,
    bounty: null,
    requirements: null,
    state: RoleState.Hidden,
    type: null,
    keywords: null,
    slug: null,
  };
}
