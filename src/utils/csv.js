function parseString(value)
{
    const cleanedValue = (value || '').trim().replace("\r", "");
    
    const lines  = cleanedValue.split("\n").map(t => t.split("\t"));
    const header = lines.shift();

    const items = [];
    for (const line of lines) {
        const entries = header.map((name, k) => [name, line[k]]);
        items.push(Object.fromEntries(entries));
    }
     
    return items;
}

export { parseString }