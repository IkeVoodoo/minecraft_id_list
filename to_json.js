const fs = require('fs');
const readline = require('readline');

fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
    files.forEach(file => {
        fs.stat(__dirname + '/' + file, (err, stats) => {
            if (err) {
                console.log(err);
                return;
            }
            const main = file;
            if (stats.isDirectory()) {
                fs.stat(__dirname + '/' + file + '/plain', (err, stats) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    if(stats.isDirectory()) {
                        const fileData = []
                        fs.readdir(__dirname + '/' + file + '/plain', (err, files) => {
                            if(err) {
                                console.log(err);
                                return;
                            }
                            var finished = 0;
                            files.forEach(file => {
                                const lines = []
                                readline.createInterface({
                                    input: fs.createReadStream(__dirname + '/' + main + '/plain/' + file),
                                    terminal: false
                                }).on('line', line => {
                                    lines.push(line);
                                }).on('close', () => {
                                    const name = file.split(".")[0];
                                    fileData.push({
                                        name,
                                        lines
                                    })
                                    finished++;
                                    if(finished === files.length) {
                                        // get directory dir/file/json/
                                        const dir = __dirname + '/' + main + '/json/';
                                        // create the directory if it doesn't exist
                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir);
                                        }
                                        // write the json file
                                        for(let data of fileData) {
                                            const json = {
                                                "entries": data.lines
                                            }
                                            fs.writeFile(dir + data.file + ".json", JSON.stringify(json, null, 2), (err) => {
                                                if(err) {
                                                    console.log(err);
                                                    return;
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    });
});