
function getMerged(p1, p2) {
    let newEntry = {};
    newEntry.name = p1.name.substring(0, p1.name.length * 0.6) + "'" + p2.name.substring(p1.name.length * 0.4);
    newEntry.id = p1.id + "." + p2.id;;
    let url = p1.url
    newEntry.stats = p1.stats;
    for (let index = 0; index < p1.stats.length; index++) {
        let key = Object.keys(p1.stats)[index];
        newEntry.stats[index][Object.keys(p1.stats[index])[0]] = Math.ceil(0.5 * (p1.stats[key] + p2.stats[key]));
    }
    let typesArray = []
    if (p1.types[0] != p2.types[0]) {
        typesArray = [p1.types[0], p2.types[0]]
    }
    else if (p1.types[1]) {
        typesArray = [p1.types[0], p1.types[1]]
    }
    else if (p2.types[1]) {
        typesArray = [p1.types[0], p2.types[1]]
    }
    newEntry.types = typesArray;

    newEntry.height = (p1.height + p2.height) / 2;
    newEntry.weight = (p1.weight + p2.weight) / 2;
    newEntry.default_image = `https://raw.githubusercontent.com/Aegide/autogen-fusion-sprites/master/Battlers/${p1.id}/${p1.id}.${p2.id}.png`
    // console.log(newEntry);
    return newEntry;

}

const fs = require('fs');
let outputJSON = mergeAndAdd();
function mergeAndAdd() {

    fs.readFile('entryInfo.json', (err, data) => {
        if (err) throw err;
        let entries = JSON.parse(data);
        let original_length = entries.length;
        // original_length
        for (let a = 0; a < 160 && entries.length<9000; a++) {
            const p1 = entries[a];
            for (let b = 0; b < 160; b++) {
                if (a == b) {
                    continue;
                }
                const p2 = entries[b];
                entries.push(getMerged(p1,p2))
                // console.log(getMerged(p1, p2));
            }
        }
        fs.writeFileSync('pokemonAndFusionEntries.json', JSON.stringify(entries));
    });

}



