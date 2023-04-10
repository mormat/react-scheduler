import { Rectangle } from '../src/utils/geom'

describe("Rectangle class", () => {


    test('create Rectangle with {x: 10, y: 20, width: 30, 40}', () => {

        const rect = new Rectangle({x: 10, y: 20, width: 30, height: 40});

        expect(rect.x).toBe(10)
        expect(rect.y).toBe(20)
        expect(rect.width).toBe(30)
        expect(rect.height).toBe(40)

    });

    test.each([
        [{x: 1,  y: 1,  width: 1,  height: 1}, false],
        [{x: 15, y: 25, width: 20, height: 20}, true],
        [{x: 10, y: 20, width: 31, height: 40}, false],
        [{x: 10, y: 20, width: 30, height: 41}, false],
    ])("check if a Rectangle contains %s", (anotherRect, expected) => {

        const rect = new Rectangle({x: 10, y: 20, width: 30, height: 40});

        expect(rect.contains(anotherRect)).toBe(expected);

    });

    test.each([
        ["a", "b", false],
        ["b", "a", false],
        ["a", "c", false],
        ["c", "a", false],
        ["a", "d", true],
    ])("check if Rectangle '%s' intersects with Rectangle '%s'", (key1, key2, expected) => {

        const rects: any = {
            "a": {x: 10, y: 10, width: 20, height: 20},
            "b": {x: 50, y: 10, width: 20, height: 20},
            "c": {x: 10, y: 50, width: 20, height: 20},
            "d": {x: 20, y: 20, width: 20, height: 20}
        }

        const actual = (new Rectangle(rects[key1])).intersectsWith(rects[key2]);

        expect(actual).toBe(expected);

    });

    test("create bounding Rectangle from multiple ones", () => {

        const actual = Rectangle.createBounding([
            {x: 10, y: 20, width: 30, height: 40},
            {x: 5,  y: 10, width: 30, height: 40}
        ])

        expect(actual.x).toBe(5);
        expect(actual.y).toBe(10);
        expect(actual.width).toBe(35);
        expect(actual.height).toBe(50);

    });

});
