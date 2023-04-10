
/**
 * @jest-environment jsdom
 */

import { ILayout } from '../src/types';
import createLayout from '../src/misc/layouts';
import { ColumnLayout, CompositeLayout, MagneticLayoutDecorator } from '../src/misc/layouts'
import { getEventRect } from '../src/misc/layouts'
import { ICoordinate } from '../src/misc/layouts'

const root = document.createElement('div')
root.innerHTML = `
    <table>
        <thead>
            <tr>
                <td></td>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody id="tbody">
            <tr>
                <td colspan="7"
                    data-datemin="2023-06-05 00:00"
                    data-datemax="2023-06-11 24:00"
                >

                </td>
            </tr>
            <tr>
                <td></td>
                <td rowspan="2" 
                    data-datemin="2023-06-05 08:00"
                    data-datemax="2023-06-05 20:00"
                >
                </td>
                <td rowspan="2"
                    data-datemin="2023-06-06 08:00"
                    data-datemax="2023-06-06 20:00"
                ></td>
            <tr>
            <tr>
                <td></td>
            </tr>
        </tbody>
    </table>
`

describe("ColumnLayout", () => {

    const columns = [...root.querySelectorAll('td[rowspan]')];

    test("ColumnLayout should return element, dateMin and dateMax and children should be empty", () => {

        const layout = new ColumnLayout(columns[0]);

        expect(layout.element).toBe(columns[0]);
        expect(layout.dateMin).toStrictEqual(new Date("2023-06-05 08:00"));
        expect(layout.dateMax).toStrictEqual(new Date("2023-06-05 20:00"));
        expect(layout.children).toStrictEqual([]);

    });
    
    test.each([
        [10, 100, "2023-06-05 08:00"],
        [10, 400, "2023-06-05 20:00"],
        [10, 250, "2023-06-05 14:00"],
        [0,  250, "2023-06-05 14:00"],
        [999,250, "2023-06-05 14:00"],
        [10, 0,   "2023-06-05 8:00"],
        [10, 999, "2023-06-05 20:00"],
    ])("ColumnLayout.getValueAtPos({%s, %s}) should return %s", (clientX, clientY, expected) => {

        jest.spyOn(columns[0], 'getBoundingClientRect').mockReturnValue(
            new DOMRect(10, 100, 30, 300)
        );

        const layout = new ColumnLayout(columns[0]);

        expect(layout.getValueAtCoord({clientX, clientY})).toStrictEqual(new Date(expected));

    });

    test("CompositeLayout should return element and children", () => {

        const layout = new CompositeLayout(root, [
            { 
                element: columns[0],
                children: [],
                getValueAtCoord: pos => null,
            },
            {
                element: columns[1],
                children: [],
                getValueAtCoord: pos => null,
            }
        ]);

        expect(layout.element).toBe(root);
        expect(layout.children.length).toBe(2);
        expect(layout.children[0].element).toBe(columns[0]);
        expect(layout.children[1].element).toBe(columns[1]);

    });

    test.each([
        [20,  200, "2023-06-05 08:00"],
        [60,  200, "2023-06-05 20:00"],
        [0,   200, "2023-06-05 08:00"],
        [999, 200, "2023-06-05 20:00"],
    ])("CompositeLayout.getValueAtPos({%s, %s}) should return %s", (clientX, clientY, expected) => {

        const layout = new CompositeLayout(root, [
            { 
                element: columns[0],
                children: [],
                getValueAtCoord: pos => new Date("2023-06-05 08:00"),
            },
            {
                element: columns[1],
                children: [],
                getValueAtCoord: pos => new Date("2023-06-05 20:00"),
            }
        ]);

        const children = layout.children;

        jest.spyOn(children[0].element, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(10, 100, 30, 300)
        )
        /*
        jest.spyOn(children[0], 'getValueAtCoord').mockReturnValue(
            new Date("2023-06-05 08:00")
        )*/

        jest.spyOn(children[1].element, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(50, 100, 30, 300)
        )
        /*
        jest.spyOn(children[1], 'getValueAtCoord').mockReturnValue(
            new Date("2023-06-05 20:00")
        )
        */

        expect(layout.getValueAtCoord({clientX, clientY})).toStrictEqual(new Date(expected));

    })

    test("createLayout", () => {

        let layout = createLayout({
            type:   'columns',
            element: root
        }) as any;

        expect(layout instanceof CompositeLayout).toBe(true);

        layout = createLayout({
            type:   'columns',
            element: root,
            step: 15 * 60 * 1000

        }) as any;

        expect(layout instanceof MagneticLayoutDecorator).toBe(true);
        expect(layout.decorated instanceof CompositeLayout).toBe(true);
        
    });

});

describe("Layout Decorator", () => {

    test("MagneticLayoutDecorator", () => {

        const decorated = {
            element: document.createElement('div'),
            children: [],
            getValueAtCoord: ({clientX, clientY}: ICoordinate) => {
                switch(clientX +',' + clientY) {
                    case '10,10':
                        return new Date("1970-01-01 08:00");
                    case '10,15':
                        return new Date("1970-01-01 08:05");
                    case '10,25':
                        return new Date("1970-01-01 08:15");
                }
                return null;
            }
        }

        const layout: ILayout = new MagneticLayoutDecorator(
            decorated,
            15 * 60 * 1000
        );

        expect(layout.element).toBe(decorated.element);
        expect(layout.children).toBe(decorated.children);

        expect(layout.getValueAtCoord({clientX: 10, clientY: 10}))
            .toStrictEqual(new Date("1970-01-01 08:00"));

        expect(layout.getValueAtCoord({clientX: 10, clientY: 15}))
            .toStrictEqual(new Date("1970-01-01 08:00"));

        expect(layout.getValueAtCoord({clientX: 10, clientY: 25}))
            .toStrictEqual(new Date("1970-01-01 08:15"));

        expect(layout.getValueAtCoord({clientX: 10, clientY: 35}))
            .toBe(null);

    });

});

describe("getEventRect", () => {

    beforeEach(() => {

        jest.spyOn(root, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(50, 100, 640, 480)
        )

        const banner = root.querySelector('td[colspan]')!; 
        jest.spyOn(banner, 'getBoundingClientRect').mockReturnValue(
            new DOMRect(100, 140, 168, 40)
        )

        const columns = [...root.querySelectorAll('td[rowspan]')];
        jest.spyOn(columns[0], 'getBoundingClientRect').mockReturnValue(
            new DOMRect(100, 180, 50, 120)
        )

    })

    

    test.each([
        ["2023-06-05 08:00", "2023-06-05 12:00", 50, 80,  50,  40, null],
        ["2023-06-05 10:00", "2023-06-05 20:00", 50, 100, 50, 100, null],
        ["2023-06-05 08:00", "2023-06-05 12:00", 75, 80,  25,  40, {current: 1, length: 2}],
        ["2023-06-05 10:00", "2023-06-06 20:00", 60, 40,  34,  40, null],
        ["2023-06-05 10:00", "2023-06-06 20:00", 60, 60,  34,  20, {current: 1, length: 2}],
        ["2023-06-05 10:00", "2023-06-28 20:00", 60, 40, 158,  40, null],
        ["2023-06-04 10:00", "2023-06-05 10:00", 50, 40, 10,   40, null],
        ["2023-06-04 10:00", "2023-06-12 10:00", 50, 40, 168,  40, null],
    ])("Rect from event('%s','%s') should be (%s,%s,%s,%s)", 
        (start, end, left, top, width, height, eventOffset) => {

        const event = {
            label: "...",
            start: new Date(start), 
            end:   new Date(end)
        }

        const rect = getEventRect(root, event, eventOffset);

        expect(rect).toStrictEqual({left, top, width, height});

    });

});