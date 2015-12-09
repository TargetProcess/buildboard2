var execSync = require('child_process').execSync;

execSync('pm2 kill');

['pmtool/tp', 'codetool/github', 'buildtool/travis'].forEach(item=> {
    execSync("npm install", {cwd: item});
    execSync("npm start", {cwd: item});
});