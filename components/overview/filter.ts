import { GeographicAddress } from "@/bubble_types";
import { Role, Company, RoleLocationType, TimezoneRange, RoleType } from "@/bubble_types";


class RoleFilter {
    // remoteOnly: boolean | null;
    // userAddress: GeographicAddress | null;
    roles: Role[] = [];

    constructor(unfilteredRoles: Role[]
    ) {
        // this.remoteOnly = false;
        // this.userAddress = null;
        this.roles = unfilteredRoles;
    }

    private hasCountry(country: string, location_list: GeographicAddress[]) {
        return location_list.map(addr => addr.country).includes(country);
    }
    private hasCity(city: string, location_list: GeographicAddress[]) {
        return location_list.map(addr => addr.city).includes(city);
    }
    private addressMatches(location: GeographicAddress, role_addresses: GeographicAddress[]) {
        return (location.country && this.hasCountry(location.country, role_addresses)) ||
            (location.city && this.hasCity(location.city, role_addresses));
    }
    private timezoneMatches(utc_offset: number | null, timezone_range: TimezoneRange | null) {
        if (!timezone_range) {
            return false;
        }
        if (!utc_offset) {
            return false;
        }
        return utc_offset / 60 >= timezone_range.min && utc_offset / 60 <= timezone_range.max;
    }

    private isRemoteMatch(role: Role, userAddress: GeographicAddress | null) {
        if (!role.location) {
            return true;
        }
        if (role.location.location_type == RoleLocationType.LocationList) {
            return false;
        }
        //If role is remote and we want remote role, keep
        if (role.location?.location_type == RoleLocationType.Remote) {
            return true;
        }
        if (role.location?.location_type == RoleLocationType.TimezoneRange) {
            return !userAddress || this.timezoneMatches(userAddress.utc_offset, role.location.timezone_range);
        }

        return true;
    }
    private isNonRemoteMatch(role: Role, userAddress: GeographicAddress | null) {
        if (!role.location || !userAddress) {
            return true;
        }
        if (role.location.location_type == RoleLocationType.LocationList) {
            const role_addresses: GeographicAddress[] = role.location?.location_list ? role.location.location_list : [];
            return this.addressMatches(userAddress, role_addresses);
        }
        if (role.location.location_type == RoleLocationType.Remote) {
            return true;
        }
        if (role.location.location_type == RoleLocationType.TimezoneRange) {
            return this.timezoneMatches(userAddress.utc_offset, role.location.timezone_range);
        }

        return true;
    }

    private isRoleTypeMatch(role: Role, roleType: RoleType | null) {
        if (!roleType) {
            return true;
        }
        return role.type == roleType;
    }

    private isSearchTermMatch(role: Role, searchterm: string | null): boolean {
        if (!searchterm || searchterm.length < 4) {
            return true;
        }
        if (!role.keywords) {
            return false;
        }
        return role.keywords.map(keyword => keyword.toLowerCase().includes(searchterm.toLowerCase())).includes(true);
    }

    private roleFilter(
        role: Role,
        userAddress: GeographicAddress | null,
        remoteOnly: boolean | null,
        roleType: RoleType | null,
        searchterm: string | null) {
        // If remote only, filter the roles

        var result = false;

        if (remoteOnly) {
            return this.isRemoteMatch(role, userAddress) &&
                this.isRoleTypeMatch(role, roleType) &&
                this.isSearchTermMatch(role, searchterm);
        }
        return this.isNonRemoteMatch(role, userAddress) &&
            this.isRoleTypeMatch(role, roleType) &&
            this.isSearchTermMatch(role, searchterm);
    }


    getFilteredRoles(
        userAddress: GeographicAddress | null,
        remoteOnly: boolean | null,
        roleType: RoleType | null,
        searchterm: string | null) {
        if (!this.roles) {
            return [];
        }
        return this.roles.filter((role) => this.roleFilter(role, userAddress, remoteOnly, roleType, searchterm));
    }

}


export class CompanyFilter {
    // remoteOnly: boolean | null;
    // userAddress: GeographicAddress | null;
    companies: Company[] = [];

    constructor(unfilteredCompanies: Company[]
    ) {
        // this.remoteOnly = false;
        // this.userAddress = null;
        this.companies = unfilteredCompanies;
    }

    private isSearchTermMatch(company: Company, searchterm: string | null): boolean {
        if (!searchterm || searchterm.length < 4) {
            return true;
        }
        if (!company.keywords) {
            return false;
        }
        return company.keywords.map(keyword => keyword.toLowerCase().includes(searchterm.toLowerCase())).includes(true);
    }

    private companyFilter(
        company: Company,
        searchterm: string | null) {
        // If remote only, filter the roles

        var result = false;

        return this.isSearchTermMatch(company, searchterm);
    }


    getFilteredCompanies(
        searchterm: string | null) {
        if (!this.companies) {
            return [];
        }
        return this.companies.filter((company) => this.companyFilter(company, searchterm));
    }

}


export default RoleFilter;
