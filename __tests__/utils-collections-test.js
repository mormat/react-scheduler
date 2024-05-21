
import { groupBy, indexBy } from '../src/utils/collections';

describe("indexBy()", () => {
 
    test('using numeric index', () => {

        const items = [2, 3];

        const actual = indexBy(items, n => n % 2);
        
        expect(actual).toStrictEqual({
            0: 2,
            1: 3,
        });

    });
 
    test('using string index', () => {

        const items = ['bar', 'foo'];

        const actual = indexBy(items, s => s[0]);
        
        expect(actual).toStrictEqual({
            'b': 'bar',
            'f': 'foo',
        });

    });
    
})

describe("groupBy()", () => {
    
    test('using numeric index', () => {

        const items = [1, 2, 3, 4, 5, 6];

        const actual = groupBy(items, n => n % 2);

        expect(actual).toStrictEqual({
            0: [2, 4, 6],
            1: [1, 3, 5],
        });

    });
    
    test('using string index', () => {

        const items = ['foo', 'bar', 'baz'];

        const actual = groupBy(items, s => s[0]);

        expect(actual).toStrictEqual({
            "f": ["foo"],
            "b": ["bar", "baz"]
        });

    });
    
});

/*

describe("Collections utils", () => {
   

    test('indexBy()', () => {

        const items = ['bar', 'foo', 'baz'];

        let indexResolver = (s) => s[0];

        expect(indexBy(items, indexResolver)).toStrictEqual({
            'b': ['bar', 'baz'],
            'f': ['foo'],
        });

        indexResolver = (_, k) => Math.floor(k / 2)

        expect(indexBy(items, indexResolver)).toStrictEqual({
            0: ['bar', 'foo'],
            1: ['baz'],
        });

    });

});
*/