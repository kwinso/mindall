const newYearDate = Date.parse("01 Jan 2022 00:00:00 GMT");


export function timeToNewYear(): number {
    return newYearDate - Date.now();
}

export function isNewYear(): boolean {
    return newYearDate - Date.now() <= 0
}