
function indexBy(items, indexer) {

    const results  = {}

    for (const item of items) {
        const index = indexer(item);
        results[index] = item;
    }

    return results;

}

function groupBy(items, grouper) {

    const results = {}

    for (const item of items) {
        const index = grouper(item);
        if (index in results) {
            results[index].push(item);
        } else {
            results[index] = [item]
        }
    }

    return results

}

export { indexBy, groupBy }