
function groupByCols(items: any[], cols: number): any[][] {

    const results: any[][] = [];

    let row: any[];
    
    items.forEach((item: any, index) => {

        if (index % cols === 0) {
            row = [];
            results.push(row);
        }

        row.push(item);
    });

    return results;
}

function indexBy(items: any, indexResolver: any): any {

    const results: any = {}

    for (const k in items) {
        const index = indexResolver(items[k], k);
        if (index in results) {
            results[index].push(items[k]);
        } else {
            results[index] = [items[k]];
        }
    }

    return results;

}

export { groupByCols, indexBy }