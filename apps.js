var execSync = require('child_process').execSync;

execSync('pm2 kill');
execSync('npm link', {cwd: 'tool-bootstrap'});
['pmtool/tp', 'codetool/github', 'buildtool/travis'].forEach(item=> {

    execSync("npm install", {cwd: item});
    execSync("npm link tool-bootstrap");
    execSync("npm start", {cwd: item});
});