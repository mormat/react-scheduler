
import { groupByCols } from '../src/utils/template';

describe("Template utils", () => {

    test.each([
        [3, [['foo', 'bar', 'baz']]   ],
        [2, [['foo', 'bar'], ['baz']] ],
    ])('groupByCols %s', (cols, expected) => {
        
        const items = ['foo', 'bar', 'baz'];

        expect(groupByCols(items, cols)).toStrictEqual(expected);

    });

});
