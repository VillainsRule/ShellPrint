import fs from 'fs';
import * as url from 'url';
import config from '#config';

export default async function (_, message) {
    if (!message.content.startsWith('$')) return;

    let args = message.content.slice(1).split(' ');
    let command = args.shift().toLowerCase();

    let commands = fs.readdirSync(url.fileURLToPath(new URL('../', import.meta.url)) + 'commands');
    if (!commands.find(c => c === `${command}.js`)) return;

    if (message.member.roles.cache.has(config.ownerRole)) (await import(`../commands/${command}.js`)).default(message, args);
};