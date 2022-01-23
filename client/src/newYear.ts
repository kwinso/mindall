const newYearDate = Date.parse("00:00, Jan 1, 2022");

export function timeToNewYear(): number {
    return newYearDate - Date.now();
}

export function isMidnightTime(): boolean {
    const newYearOffset = newYearDate - Date.now();
    return newYearOffset <= 0 && newYearOffset >= -(1000 * 60 * 10);
}
