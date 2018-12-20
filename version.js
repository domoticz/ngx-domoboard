const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
const appVersion = require('./package.json').version;
const name = require('./package.json').name;

console.log(colors.cyan('\nRunning pre-build tasks'));

const versionFilePath = path.join(__dirname + '/src/environments/version.ts');

const src = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const version = '${appVersion}';
export const name = '${name}';
/* tslint:enable */
`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
    if (err) {
        return console.log(colors.red(err));
    }
    console.log(`${colors.green('Writing version module to ')}${colors.yellow(versionFilePath)}\n`);
});
