
import { getDateRangeOfMonth, getDateRangeOfWeek } from '../src/utils/date'

import { getDaysBetween, getHoursBetween } from '../src/utils/date'

import { dateToString, hourToString } from '../src/utils/date';

require('jest-mock-now')(new Date('2023-04-20'));

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

    test.each([
        ['2023-12-10', '12/1/2023', '12/31/2023'],
        ['2024-02-10', '2/1/2024' , '2/29/2024'],
    ])('getDateRangeOfMonth(%s)', (month, expectedStart, expectedEnd) => {

        const {start, end} = getDateRangeOfMonth(
            new Date(month + ' 00:00')
        );
        
        expect(start.toLocaleDateString('en')).toBe(expectedStart);

        expect(end.toLocaleDateString('en')).toBe(expectedEnd);

    });

    test.each([
        ['2023-05-24', '5/22/2023', '5/28/2023'],
        ['2023-05-28', '5/22/2023', '5/28/2023'],
        ['2023-05-22', '5/22/2023', '5/28/2023']
    ])("getDateRangeOfWeek(%s)", (day, expectedStart, expectedEnd) => {

        const {start, end} = getDateRangeOfWeek(
            new Date(day + ' 00:00')
        );

        expect(start.toLocaleDateString('en')).toBe(expectedStart);
        
        expect(end.toLocaleDateString('en')).toBe(expectedEnd);

    });

    test.each([
        [
            0, 24, [
                '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', 
                '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
                '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
                '21:00', '22:00', '23:00', '24:00'
            ],
            8, 20, [
                '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
                '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
            ]
        ]
    ])("getHoursBetween(min=%s,max=%s)", (minHour, maxHour, hours) => {

        const min = "1970-01-01 " + minHour + ':00';
        const max = "1970-01-01 " + maxHour + ':00';

        const expected = hours.map(h => new Date("1970-01-01 " + h));

        expect(getHoursBetween(min, max)).toStrictEqual(expected);
        expect(getHoursBetween(new Date(min), new Date(max)))
            .toStrictEqual(expected);

    });

    test.each([
        ['2023-11-15 00:00', '2023-11-15'],
        ['2023-01-01 00:00', '2023-01-01'],
    ])("dateAsString(%s) -> %s", (d, string) => {    
        expect(dateToString(new Date(d))).toBe(string);
    });
    
    test.each([
        ["2023-11-15 15:20", "15:20"],
        ["2023-11-15 8:5",   "08:05"],
    ])("hourToString(%s) -> %s", (h, string) => {
        expect(hourToString(new Date(h))).toBe(string);
    });

});
