
const SITE = 'promptry-settings-data';
export const storeSelected = (selected: {key:string, sel: boolean}[]) => {
    localStorage.setItem(`${SITE}-selected`, JSON.stringify(selected));
}
export const loadSelected = (): {key:string, sel: boolean}[] => {
    const data = localStorage.getItem(`${SITE}-selected`);
    return data ? JSON.parse(data) : undefined;
}