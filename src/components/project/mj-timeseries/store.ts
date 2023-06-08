const SITE = 'promptry';
const SITE_SETTINGS_DATA = `${SITE}-settings-data`;
export const storeSelected = (selected: {key:string, sel: boolean}[]) => {
    localStorage.setItem(`${SITE_SETTINGS_DATA}-selected`, JSON.stringify(selected));
}
export const loadSelected = (): {key:string, sel: boolean}[] => {
    const data = localStorage.getItem(`${SITE_SETTINGS_DATA}-selected`);
    return data ? JSON.parse(data) : undefined;
}