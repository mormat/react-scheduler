
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

    static from(another: IDateRange): DateRange {
        return new DateRange(another.start, another.end);
    }

    public intersects(dateRange: IDateRange): DateRange|null {

        if (dateRange.end < this.start || this.end < dateRange.start) {
            return null;
        }

        return new DateRange(
            new Date(Math.max(this.start.getTime(), dateRange.start.getTime())),
            new Date(Math.min(this.end.getTime(),   dateRange.end.getTime())),
        );

        return DateRange.from(dateRange);
    }

    public contains(another: IDateRange)
    {
        return this.start <= another.start && another.end <= this.end;
    }

    public includes(date: Date) {
        return this.start <= date && date <= this.end;
    }

    public getDays(): DateRange[] {
        const days = []
        let current = new Date(this.start);
        while (current < this.end) {
            days.push(DateRange.createDay(current));
            current = date_add(current, 1, 'day')
        }
        return days;
    }

    public countDays(): number {
        return this.getDays().length;
    }

    public getWeeks(): DateRange[] {
        const weeks = []
        let week = DateRange.createWeek(this.start);
        while (week.start <= this.end) {
            weeks.push(week);
            week = DateRange.createWeek( date_add(week.end, 1, 'day') );
        }
        return weeks;
    }

    static createDay(date: Date): DateRange {
        return new DateRange(
            new Date(format_date('yyyy-mm-dd', date) + ' 00:00:00.000'),
            new Date(format_date('yyyy-mm-dd', date) + ' 23:59:59.999'),
        );
    }

    static createWeek(date: Date): DateRange {
        return new DateRange(
            new Date(getFirstDayOfWeek(date) + ' 00:00:00.000'),
            new Date(getLastDayOfWeek(date)  + ' 23:59:59.999')
        );
    }

    static createMonth(date: Date): DateRange {
        const start = new Date(date);
        const end   = new Date(date);

        start.setDate(1);
        end.setDate(1)
        end.setMonth(end.getMonth() + 1);
        end.setDate( end.getDate()  - 1);

        return new DateRange(
            new Date(format_date('yyyy-mm-dd', start) + " 00:00:00.000"), 
            new Date(format_date('yyyy-mm-dd', end)   + " 23:59:59.999"), 
        );
    }

    static groupByPosition(items: IDateRange[]) {

        const results: any = [];

        loop_items: for (const item of items) {

            const constraint = DateRange.from(item);

            for (const position in results) {

                const overlapping = results[position].find(
                    (v: IDateRange) => constraint.intersects(v)
                )

                if (!overlapping) {
                    results[position].push(item);
                    continue loop_items;
                }

            }

            results.push([item])

        }

        return results;

    }

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




export { getPercentInDateRange }
export { getFirstDayOfWeek,  getLastDayOfWeek }
export { formatters, date_add, format_date }
export { DateRange }
export type { IDateRange }