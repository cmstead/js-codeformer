// npm verison bump broke. This is a quick patch.
const childProcess = require('child_process');
const fs = require('fs');

const packageData = require('./package.json');

const versionTokens = packageData.version.split('.').map(value => parseInt(value, 10));

const [rawVersionType] = process.argv.slice(2);

const versionType = rawVersionType.toLowerCase();

if (versionType === 'patch') {
    versionTokens[2]++;
} else if (versionType === 'minor') {
    versionTokens[1]++;
    versionTokens[2] = 0;
} else if (versionType === 'major') {
    versionTokens[0]++;
    versionTokens[1] = 0;
    versionTokens[2] = 0;
}

const versionString = versionTokens.join('.');

packageData.version = versionString;

fs.writeFileSync(
    './package.json',
    JSON.stringify(packageData, null, 4),
    { encoding: 'utf8' });

childProcess.execSync(`git commit -am "New version, ${versionString}"`);
childProcess.execSync(`git tag v${versionString}`);
