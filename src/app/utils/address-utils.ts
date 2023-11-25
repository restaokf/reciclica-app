export function findAddressNumber(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponent, "street_number");
}
export function findCity(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponent, "administrative_area_level_2");
}
export function findNeighborhood(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponent, "sublocality") ||
        findAddressComponent(addressComponent, "sublocality_level_1");
}
export function findState(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponentShortName(addressComponent, "administrative_area_level_1");
}
export function findStateShortName(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponentShortName(addressComponent, "administrative_area_level_1");
}
export function findStreet(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    return findAddressComponent(addressComponent, "route");
}
export function findZipCode(addressComponent: {long_name: string, short_name: string, types: string[]}[]): string {
    let element = ""
    addressComponent.forEach((a: any) => {
        let hasZipCode = a.types.some((t: any) => t == "postal_code");
        if (hasZipCode) {
            element = a.long_name;
        }
    });
    return element;
}

export function findAddressComponent(
    addressComponent: {long_name: string, short_name: string, types: string[]}[],
    type: string
) : string {
    let element = addressComponent.find(a => a.types.some(t => t == type));
    return element? element.long_name: '';
}

export function findAddressComponentShortName(
    addressComponent: {long_name: string, short_name: string, types: string[]}[],
    type: string
) : string {
    let element = addressComponent.find(a => a.types.some(t => t == type));
    return element? element.short_name: '';
}

