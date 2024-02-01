
const MINUTE_LENGTH = 60 * 1000;
const DAY_LENGTH    = 24 * 60 * 60 * 1000;

interface IDateRange {
    start: Date;
    end:   Date;
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
export { getFirstDayOfWeek, getLastDayOfWeek }
export { formatters, date_add }
export { dateRangeContainsAnother, dateRangeOverlapsAnother }
export type { IDateRange }