
import { groupByCols, indexBy } from '../src/utils/collections';

describe("Collections utils", () => {

    test.each([
        [3, [['foo', 'bar', 'baz']]   ],
        [2, [['foo', 'bar'], ['baz']] ],
    ])('groupByCols %s', (cols, expected) => {
        
        const items = ['foo', 'bar', 'baz'];

        expect(groupByCols(items, cols)).toStrictEqual(expected);

    });

    test('indexBy()', () => {

        const items = ['bar', 'foo', 'baz'];

        let indexResolver: any = (s: string) => s[0];

        expect(indexBy(items, indexResolver)).toStrictEqual({
            'b': ['bar', 'baz'],
            'f': ['foo'],
        });

        indexResolver = (_: any, k: any) => Math.floor(k / 2)

        expect(indexBy(items, indexResolver)).toStrictEqual({
            0: ['bar', 'foo'],
            1: ['baz'],
        });

    });

});
