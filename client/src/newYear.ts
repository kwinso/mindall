const newYearDate = Date.parse("01 Jan 2022 00:00:00 GMT");


export function timeToNewYear(): number {
    return newYearDate - Date.now();
}

export function isMidnightTime(): boolean {
    const newYearOffset = newYearDate - Date.now();
    return newYearOffset <= 0 && newYearOffset >= -(1000 * 60 * 10);
}