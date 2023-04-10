
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

export { groupByCols }