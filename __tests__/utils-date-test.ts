
import { DateRange } from '../src/utils/date'

import { getFirstDayOfWeek, getLastDayOfWeek } from '../src/utils/date';

import { format_date, date_add } from '../src/utils/date';

require('jest-mock-now')(new Date('2023-04-20'));

test("Date increment", () => {
    
    expect( date_add("2024-01-01", 1, 'day') ).toStrictEqual(
        new Date("2024-01-02")
    );

    expect( date_add(new Date("2024-01-01"), 1, 'day') ).toStrictEqual(
        new Date("2024-01-02")
    );

    expect( date_add(new Date("2024-01-01"), -1, 'day') ).toStrictEqual(
        new Date("2023-12-31")
    );

    expect( date_add(new Date("2024-01-01"), 2, 'week') ).toStrictEqual(
        new Date("2024-01-15")
    );

    expect( date_add(new Date("2024-01-01"), 1, 'week') ).toStrictEqual(
        new Date("2024-01-08")
    );

    expect( date_add(new Date("2024-01-10"), 1, 'month') ).toStrictEqual(
        new Date("2024-02-10")
    );

    expect( date_add(new Date("2024-01-10"), -1, 'month') ).toStrictEqual(
        new Date("2023-12-10")
    );

    expect( date_add(new Date("2024-01-31"), 1, 'month') ).toStrictEqual(
        new Date("2024-02-29")
    );

    expect( date_add(new Date("2024-03-31"), -1, 'month') ).toStrictEqual(
        new Date("2024-02-29")
    );

});

function buildDate(value: string, type: string): any {
    switch (type) {
        case 'date':      return new Date(value);
        case 'timestamp': return (new Date(value)).getTime();
        default: return value;
    }
}

const dateBuilders = {
    'string': (s: string) => s,
    'date':   (s: string) => new Date(s),
}

test.each(["string", "date", "timestamp"])
("format_date() with %s", (dateType: string) => {

    const d1 = buildDate("2020-11-28 10:35", dateType);
    const d2 = buildDate("2020-2-5 9:7",     dateType);

    expect( format_date('yyyy', d1) ).toBe('2020');

    expect( format_date('mm', d1) ).toBe('11');
    expect( format_date('mm', d2) ).toBe('02');

    expect( format_date('dd', d1) ).toBe('28');
    expect( format_date('dd', d2) ).toBe('05');

    expect( format_date('yyyy-mm', d1) ).toBe('2020-11');
    expect( format_date('yyyy-mm', d2) ).toBe('2020-02');

    expect( format_date('yyyy-mm-dd', d1) ).toBe('2020-11-28');
    expect( format_date('yyyy-mm-dd', d2) ).toBe('2020-02-05');

    expect( format_date('hh', d1) ).toBe('10');
    expect( format_date('hh', d2) ).toBe('09');

    expect( format_date('ii', d1) ).toBe('35');
    expect( format_date('ii', d2) ).toBe('07');

    expect( format_date('hh:ii', d1) ).toBe('10:35');
    expect( format_date('hh:ii', d2) ).toBe('09:07');

    expect( format_date('yyyy-mm-dd hh:ii', d1) ).toBe('2020-11-28 10:35');
    expect( format_date('yyyy-mm-dd hh:ii', d2) ).toBe('2020-02-05 09:07');

});

describe("Date utils", () => {

    test('getFirstDayOfWeek()', () => {

        expect(getFirstDayOfWeek(new Date('2023-05-24'))).toBe('2023-05-22');

        expect(getFirstDayOfWeek(new Date('2023-05-28'))).toBe('2023-05-22');

        expect(getFirstDayOfWeek(new Date('2023-05-22'))).toBe('2023-05-22');

        expect(getLastDayOfWeek(new Date('2023-05-24'))).toBe('2023-05-28');

        expect(getLastDayOfWeek(new Date('2023-05-28'))).toBe('2023-05-28');

        expect(getLastDayOfWeek(new Date('2023-05-22'))).toBe('2023-05-28');

    });

});

describe("DateRange", () => {

    test('.createMonth', () => {

        expect(DateRange.createMonth(
            new Date("2024-05-05 10:02:03.200")
        )).toStrictEqual(new DateRange(
            new Date("2024-05-01 00:00:00.000"),
            new Date("2024-05-31 23:59:59.999"),    
        ));

        expect(DateRange.createMonth(
            new Date("2024-02-05 10:02:03.200")
        )).toStrictEqual(new DateRange(
            new Date("2024-02-01 00:00:00.000"),
            new Date("2024-02-29 23:59:59.999"),    
        ));

    });

    test('.createWeek', () => {

        expect(DateRange.createWeek(
            new Date("2024-05-05 10:02:03.200")
        )).toStrictEqual(new DateRange(
            new Date("2024-04-29 00:00:00.000"),
            new Date("2024-05-05 23:59:59.999"),    
        ));

    });

    test('.createDay', () => {

        expect(DateRange.createDay(
            new Date("2024-05-05 10:02:03.200")
        )).toStrictEqual(new DateRange(
            new Date("2024-05-05 00:00:00.000"),
            new Date("2024-05-05 23:59:59.999"),    
        ));

    });

    test('.intersects()', () => {

        const dateRange = new DateRange(
            new Date("2020-01-02 10:00"),
            new Date("2020-01-02 13:59"),
        );

        expect(dateRange.intersects({
            start: new Date("2020-01-01 10:00"),
            end:   new Date("2020-01-01 13:59"),
        })).toBe(null);

        expect(dateRange.intersects({
            start: new Date("2020-01-03 10:00"),
            end:   new Date("2020-01-03 13:59"),
        })).toBe(null);
        
        expect(dateRange.intersects({
            start: new Date("2020-01-02 09:00"),
            end:   new Date("2020-01-02 13:59"),
        })).toStrictEqual(new DateRange(
            new Date("2020-01-02 10:00"),
            new Date("2020-01-02 13:59"),
        ));

        expect(dateRange.intersects({
            start: new Date("2020-01-02 09:00"),
            end:   new Date("2020-01-02 14:00"),
        })).toStrictEqual(new DateRange(
            new Date("2020-01-02 10:00"),
            new Date("2020-01-02 13:59"),
        ));

        expect(dateRange.intersects({
            start: new Date("2020-01-02 11:00"),
            end:   new Date("2020-01-02 12:00"),
        })).toStrictEqual(new DateRange(
            new Date("2020-01-02 11:00"),
            new Date("2020-01-02 12:00"),
        ));

    });

    test('.groupByPosition()', () => {

        const items = [
            {
                start: new Date("2020-01-02 11:20"),
                end:   new Date("2020-01-02 11:30")
            },
            {
                start: new Date("2020-01-01 10:00"),
                end:   new Date("2020-01-01 10:25")
            },
            {
                start: new Date("2020-01-01 10:20"),
                end:   new Date("2020-01-01 16:00")
            },
            
            {
                start: new Date("2020-01-01 14:30"),
                end:   new Date("2020-01-01 15:30")
            },
        ];
        
        expect(DateRange.groupByPosition(items)).toStrictEqual([
            [items[0], items[1], items[3]],
            [items[2]]
        ]);

    })


});

