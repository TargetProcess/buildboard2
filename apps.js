(function () {
    var execSync = require('child_process').execSync;
    var _ = require('lodash');
    execSync('pm2 kill');

    execSync('npm install', {cwd: 'tool-bootstrap'});
    execSync('npm link', {cwd: 'tool-bootstrap'});

    var config = require('./config.json');

    _.each(config, (env, key)=> {
        console.log(`Starting ${key}`);
        execSync("npm install", {cwd: key});
        execSync("npm link tool-bootstrap");

        execSync("npm start", {cwd: key, env: env});
    });

    console.log(execSync('pm2 list').toString('utf8'));
})();