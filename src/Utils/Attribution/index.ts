// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmpty(obj:any) {
    if(obj === undefined || obj === null) return true;
    return false;
}