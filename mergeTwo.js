
function getMerged(p1, p2) {
    let newEntry = {};
    newEntry.name = p1.name.substring(0, p1.name.length * 0.6) + "'" + p2.name.substring(p1.name.length * 0.4);
    newEntry.id = p1.id + "." + p2.id;;
    let url = p1.url
    newEntry.stats = p1.stats;
    for (const key in  p2.stats) {
        if (Object.hasOwnProperty.call( p2.stats, key)) {
        newEntry.stats[key] =""+  (Math.ceil(0.5 * (p1.stats[key] + p2.stats[key])));

            
        }
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
    let sql ="";
    fs.readFile('entryInfo.json', (err, data) => {
        if (err) throw err;
        let entries = JSON.parse(data);
        let original_length = entries.length;
        // original_length
        for (let a = 0; a < 20 && entries.length<9000; a++) {
            const p1 = entries[a];
            for (let b = 3; b < 20; b++) {
                if (a == b) {
                    continue;
                }
                const p2 = entries[b];
                sql +="(";
                let newEntry = getMerged(p1,p2);
                // console.log( newEntry );
                for (const key in newEntry) {
                    if (Object.hasOwnProperty.call(newEntry, key)) {
                        if(key == "stats")
                        {
                            
                            sql +="'"+ JSON.stringify(newEntry[key])+"',";
                    }
                    else if(key == "types")
                    {
                        sql +="'{"+ newEntry[key][0]
                        if(newEntry[key][0])
                        {
                            sql += ","+ newEntry[key][1];
                        }
                        sql += "}',"
                }
                       else if(key == "name" |key == "id"| key == "default_image"  ){
                        sql += "'"+newEntry[key].replace(/'/g, "-")+"',";
                       } 
                       else 
                       {
                        sql += ''+newEntry[key]+',';
                       }
                        
                    }
                }
                sql = sql.slice(0,-1)

                sql +="),"

                entries.push(newEntry);
                // console.log(getMerged(p1, p2));
            }
        }
        // console.log(sql);
        sql = sql.slice(0,-1)
        let outputSQL = `CREATE TABLE pokemonAndFusionsData (
            name TEXT,
            id TEXT PRIMARY KEY,
            stats JSON,
            types TEXT[] ,
            height Numeric  ,
            weight Numeric ,
            default_image Text 
          );
          INSERT INTO pokemonAndFusionsData(name, id, stats, types, height, weight ,default_image) 
          VALUES ` +sql + ';';
        fs.writeFileSync('pokemonSQLValues.json', outputSQL);
    });

}



