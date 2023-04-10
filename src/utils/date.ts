import { IDateRange } from '../types';

const MINUTE_LENGTH = 60 * 1000;
const DAY_LENGTH    = 24 * 60 * 60 * 1000;

/**
 * 
 */
const getDaysBetween = ({start, end}: IDateRange): Date[] => {
    
    const results = [];

    const current = new Date(start);
    while (current <= end) {
        results.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return results;
}

/**
 * Please note that monthIndex is zero-based value (0 for january, 1 for february, etc.) 
 */
const getDateRangeOfMonth = (month: Date): IDateRange => {

    const start = new Date(month);
    start.setDate(1);

    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    return {start, end};
    
}

const getDateRangeOfWeek = (day: Date): IDateRange => {

    const min = new Date(day);
    min.setDate(min.getDate() - min.getDay() + (min.getDay() == 0 ? -6 : 1) );
    
    const max = new Date(min);
    max.setDate(max.getDate() + 6);
    
    return {start: min, end: max};
}

function getHoursBetween(min: any, max: any, minutesGap: number = 60): Date[] {

    const results: Date[] = [];

    const current = new Date(min);
    const end     = new Date(max);

    while (current <= end) {
        results.push(new Date(current));

        current.setTime(current.getTime() + minutesGap * MINUTE_LENGTH);
    }

    return results;

}

/**
 * Converts a date to string with 'yyyy-mm-dd' format
 * renderIsoDate ?
 */
function dateToString(date: Date):string {

    return [
        date.getFullYear(),
        ('0' + (date.getMonth() + 1)).slice(-2),
        ('0' + date.getDate()).slice(-2)
    ].join('-');

}

function hourToString(date: Date): string {

    return [
        ('0' + date.getHours()).slice(-2),
        ('0' + date.getMinutes()).slice(-2)
    ].join(':');

}


export { getHoursBetween, getDaysBetween }
export { getDateRangeOfMonth, getDateRangeOfWeek }
export { dateToString, hourToString }