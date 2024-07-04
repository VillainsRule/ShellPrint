import express from 'express';
import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import config from '#config';

const resolve = (p) => path.join(import.meta.dirname, p);
const exists = (p) => fs.existsSync(p);

if (!exists(resolve('../data/'))) fs.mkdirSync(resolve('../data/'));
if (!exists(resolve('../data/accounts.json'))) fs.writeFileSync(resolve('../data/accounts.json'), '[]');
if (!exists(resolve('../data/keys.json'))) fs.writeFileSync(resolve('../data/keys.json'), '{}');

const app = express();

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const client = new Discord.Client({ intents: Object.values(Discord.GatewayIntentBits).filter(i => typeof i === 'number') });

for (const file of fs.readdirSync(url.fileURLToPath(new URL('.', import.meta.url)) + 'events').filter(file => file.endsWith('.js'))) {
    const event = (await import(`./events/${file}`)).default;
    client.on(file.split('.')[0], (...args) => event(client, ...args));
};

for (const file of fs.readdirSync(url.fileURLToPath(new URL('.', import.meta.url)) + 'endpoints')) {
    let endpoint = (await import(`./endpoints/${file}`)).default;
    app[endpoint.method.toLowerCase()](endpoint.path, (req, res) => endpoint.execute(req, res));
};

app.listen(3333, () => console.log('[ EXPRESS ] ShellPrint has started!'));

client.login(config.token);