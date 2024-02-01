
import { getDaysBetween } from '../src/utils/date'

import { getFirstDayOfWeek, getLastDayOfWeek } from '../src/utils/date';

import { formatters, date_add } from '../src/utils/date';

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

test("Date formatters", () => {

    const d1 = new Date("2020-11-28 10:35")
    const d2 = new Date("2020-2-5 9:7");

    expect( formatters['yyyy'](d1) ).toBe('2020');

    expect( formatters['mm'](d1) ).toBe('11');
    expect( formatters['mm'](d2) ).toBe('02');

    expect( formatters['dd'](d1) ).toBe('28');
    expect( formatters['dd'](d2) ).toBe('05');

    expect( formatters['yyyy-mm'](d1) ).toBe('2020-11');
    expect( formatters['yyyy-mm'](d2) ).toBe('2020-02');

    expect( formatters['yyyy-mm-dd'](d1) ).toBe('2020-11-28');
    expect( formatters['yyyy-mm-dd'](d2) ).toBe('2020-02-05');

    expect( formatters['hh'](d1) ).toBe('10');
    expect( formatters['hh'](d2) ).toBe('09');

    expect( formatters['ii'](d1) ).toBe('35');
    expect( formatters['ii'](d2) ).toBe('07');

    expect( formatters['hh:ii'](d1) ).toBe('10:35');
    expect( formatters['hh:ii'](d2) ).toBe('09:07');

    expect( formatters['yyyy-mm-dd hh:ii'](d1) ).toBe('2020-11-28 10:35');
    expect( formatters['yyyy-mm-dd hh:ii'](d2) ).toBe('2020-02-05 09:07');

});


describe("Date utils", () => {

    test.each([
        ['2023-01-01', '2023-01-03', ['1/1/2023', '1/2/2023', '1/3/2023']],
        ['2023-01-04', '2023-01-01', []]
    ])("getDaysBetween from '%s', '%s'", (from, to, expected) => {

        const days = getDaysBetween({
            start: new Date(from + ' 00:00'),
            end:   new Date(to   + ' 00:00')  
        }).map( (t: Date) => t.toLocaleDateString('en'));

        expect(days).toStrictEqual(expected);
    });

    test('getFirstDayOfWeek()', () => {

        expect(getFirstDayOfWeek(new Date('2023-05-24'))).toBe('2023-05-22');

        expect(getFirstDayOfWeek(new Date('2023-05-28'))).toBe('2023-05-22');

        expect(getFirstDayOfWeek(new Date('2023-05-22'))).toBe('2023-05-22');

        expect(getLastDayOfWeek(new Date('2023-05-24'))).toBe('2023-05-28');

        expect(getLastDayOfWeek(new Date('2023-05-28'))).toBe('2023-05-28');

        expect(getLastDayOfWeek(new Date('2023-05-22'))).toBe('2023-05-28');


    });

});
