import fs from 'fs';

let ratelimit = {};

export default {
    method: 'POST',
    path: '/v3/account',

    execute: async (req, res) => {
        if (ratelimit[req.query.key]) return res.send({
            success: false,
            error: 'Please wait before trying again.'
        });

        ratelimit[req.query.key] = true;
        setTimeout(() => delete ratelimit[req.query.key], 30000);

        let keys = JSON.parse(fs.readFileSync('./data/keys.json'));
        if (!Object.values(keys).includes(req.query.key) && !req.query.key.startsWith(keys['*'])) return res.send({
            success: false,
            error: 'You need to use a valid ShellPrint key.'
        });

        let accounts = JSON.parse(fs.readFileSync('./data/accounts.json', 'utf-8'));
        let account = accounts.find(acc => acc.verified && acc.owner === '');

        if (!account) return res.send({
            success: false,
            error: 'ShellPrint is out of stock.'
        });

        fs.writeFileSync('./data/accounts.json', JSON.stringify(accounts.map(acc => {
            if (acc.email === account.email) acc.owner = req.query.key;
            return acc;
        }), null, 4));

        res.send({
            success: true,
            email: account.email,
            password: account.password
        });
    }
};