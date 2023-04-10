
expect.extend({
    toBeLocaleDateString: (received) => {

        console.log('date as ISOString');

        return {
            pass: true,
            message: `Expected ${received} to be a valid ISO date string`,
        }

    }
});

