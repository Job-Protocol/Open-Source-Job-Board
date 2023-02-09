import { GeographicAddress } from "@/bubble_types";
import { Role, RoleLocationType, TimezoneRange, RoleType } from "@/bubble_types";


class Filter {
    // remoteOnly: boolean | undefined;
    // userAddress: GeographicAddress | undefined;
    roles: Role[] = [];

    constructor(unfilteredRoles: Role[]
    ) {
        // this.remoteOnly = false;
        // this.userAddress = undefined;
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
    private timezoneMatches(utc_offset: number | undefined, timezone_range: TimezoneRange | undefined) {
        if (!timezone_range) {
            return false;
        }
        if (!utc_offset) {
            return false;
        }
        return utc_offset / 60 >= timezone_range.min && utc_offset / 60 <= timezone_range.max;
    }

    private isRemoteMatch(role: Role, userAddress: GeographicAddress | undefined) {
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
    private isNonRemoteMatch(role: Role, userAddress: GeographicAddress | undefined) {
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

    private isRoleTypeMatch(role: Role, roleType: RoleType | undefined) {
        if (!roleType) {
            return true;
        }
        return role.type == roleType;
    }

    private isSearchTermMatch(role: Role, searchterm: string | undefined): boolean {
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
        userAddress: GeographicAddress | undefined,
        remoteOnly: boolean | undefined,
        roleType: RoleType | undefined,
        searchterm: string | undefined) {
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
        userAddress: GeographicAddress | undefined,
        remoteOnly: boolean | undefined,
        roleType: RoleType | undefined,
        searchterm: string | undefined) {
        return this.roles.filter((role) => this.roleFilter(role, userAddress, remoteOnly, roleType, searchterm));
    }

}


export default Filter;
