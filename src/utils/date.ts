
const MINUTE_LENGTH = 60 * 1000;
const DAY_LENGTH    = 24 * 60 * 60 * 1000;

interface IDateRange {
    start: Date;
    end:   Date;
}

class DateRange implements IDateRange {
    
    start: Date;
    end:   Date;

    constructor(start: Date, end: Date) {
        this.start = start;
        this.end   = end;
    }

    public *iterDays() {
        
        let current = this.start;
        do {
            yield current;
            current = date_add(current, 1, 'day');
        } while (current < this.end)

    }

    overlapsWith(dateRange: IDateRange): boolean {
        if ( !(dateRange.end.getTime() - 1 < this.start.getTime() || this.end.getTime() - 1 < dateRange.start.getTime()) ) {
            return true;
        }

        return false;
    }

    contains(another: IDateRange)
    {
        return this.start <= another.start && another.end <= this.end;
    }

    static createWeek(date: Date): DateRange {
        return new DateRange(
            new Date(getFirstDayOfWeek(date) + ' 00:00'),
            new Date(getLastDayOfWeek(date) + ' 23:59')
        );
    }

}

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


const getFirstDayOfWeek = (date: Date) => {

    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + (d.getDay() == 0 ? -6 : 1) );

    return formatters['yyyy-mm-dd'](d);

}

const getLastDayOfWeek = (date: Date) => {

    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + (d.getDay() == 0 ? 0 : 7) );

    return formatters['yyyy-mm-dd'](d);

}

// @todo missing unit test
function getFirstDayOfMonth(date: Date|string) {

    const d = new Date(date);
    d.setDate(1);

    return formatters['yyyy-mm-dd'](d);
}

// @todo missing unit test
function getLastDayOfMonth(date: Date|string) {

    const d = new Date(date);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate( d.getDate()  - 1);

    return formatters['yyyy-mm-dd'](d);

}

// @todo rename to dateRangeOverlapAnother
function dateRangeOverlapsAnother(dateRange: IDateRange, another: IDateRange): boolean
{
    if ( !(another.end.getTime() - 1 < dateRange.start.getTime() || dateRange.end.getTime() - 1 < another.start.getTime()) ) {
        return true;
    }

    return false;
}

function dateRangeContainsAnother(dateRange: IDateRange, another: IDateRange)
{
    return dateRange.start <= another.start && another.end <= dateRange.end;
}

const formatters = {
    'yyyy': (d: Date) => String(d.getFullYear()),
    'mm':   (d: Date) => ('0' + (d.getMonth() + 1)).slice(-2),
    'dd':   (d: Date) => ('0' + d.getDate()).slice(-2),
    'yyyy-mm': (d: Date) => formatters['yyyy'](d) + '-' + formatters['mm'](d),
    'yyyy-mm-dd': (d: Date) => formatters['yyyy-mm'](d) + '-' + formatters['dd'](d),
    'hh':   (d: Date) => ('0' + d.getHours()).slice(-2),
    'ii':   (d: Date) => ('0' + d.getMinutes()).slice(-2),
    'hh:ii': (d: Date) => formatters['hh'](d) + ':' + formatters['ii'](d),
    'yyyy-mm-dd hh:ii': (d: Date) => formatters['yyyy-mm-dd'](d) + ' ' + formatters['hh:ii'](d)
}

function format_date(format: string, value: Date|string): string {
    const date = value instanceof Date ? value : new Date(value);
    // @ts-ignore
    return formatters[format](date);
}

function date_add(d: Date|string, num: number, type: string): Date
{
    const input:  Date = new Date(d);
    const output: Date = new Date(input);

    if (type === 'day') {
        output.setDate(input.getDate() + num)
    }

    if (type === 'week') {
        output.setDate(input.getDate() + 7 * num)
    }

    if (type === 'month') {
        output.setDate(1);
        output.setMonth(input.getMonth() + num);

        const lastDayOfMonth = new Date(output);
        lastDayOfMonth.setMonth(output.getMonth() + 1);
        lastDayOfMonth.setDate(0);

        output.setDate(Math.min(lastDayOfMonth.getDate(), input.getDate()))
    }
    
    return output
}

function getPercentInDateRange(value: Date, dateRange: IDateRange): number {
    const { start, end } = dateRange;
    const length = end.getTime() - start.getTime();

    return (value.getTime() - start.getTime()) / length;
}


export { getDaysBetween, getPercentInDateRange }
export { getFirstDayOfWeek,  getLastDayOfWeek }
export { getFirstDayOfMonth, getLastDayOfMonth }
export { formatters, date_add, format_date }
export { dateRangeContainsAnother, dateRangeOverlapsAnother }
export { DateRange }
export type { IDateRange }