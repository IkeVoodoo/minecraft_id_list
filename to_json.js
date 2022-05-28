const fs = require('fs');
const readline = require('readline');

// loop over all folders in the current directory
fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }
    files.forEach(file => {
        // check if file is a folder
        fs.stat(__dirname + '/' + file, (err, stats) => {
            if (err) {
                console.log(err);
                return;
            }
            const main = file;
            if (stats.isDirectory()) {
                // check if the folder has a folder named "plain"
                fs.stat(__dirname + '/' + file + '/plain', (err, stats) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    if(stats.isDirectory()) {
                        // structure:
                        // "filename": [
                        //   "line1",
                        //   "line2",
                        //   ...
                        //]
                        const fileData = []
                        // loop over all files in the plain folder,
                        // and add them to the fileData array
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
                                    // add the fileData to the json
                                    fileData.push({
                                        file,
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
                                            fs.writeFile(dir + data.file, JSON.stringify(json, null, 2), (err) => {
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