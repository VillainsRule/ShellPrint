import fs from 'fs';
import crypto from 'crypto';

import mailbox from '#generator/mailbox';
import createAccount from '#generator/createAccount';

import config from '#config';

export default async (message, args) => {
    if (!args[0]) return message.channel.send({
        content: message.author.toString(),
        embeds: [{ description: `**specify a subcommand.**` }]
    });

    if (args[0].toLowerCase() === 'refill' || args[0].toLowerCase() === 'gen') {
        if (Number(args[1]) === NaN) return message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: `**specify a number.**` }]
        });

        message.guild.channels.cache.get(config.logChannel).send(`Generating **${Number(args[1])}** accounts...`);

        let generated = [];

        await Promise.all(new Array(Number(args[1])).fill(0).map(async () => {
            let mail = new mailbox();

            let address = await mail.createAccount();
            let password = crypto.randomBytes(20).toString('hex');

            generated.push(address);

            console.log(`Generated "${address}". Creating account...`);

            await createAccount(address, password);

            fs.writeFileSync('./data/accounts.json', JSON.stringify([...JSON.parse(fs.readFileSync('./data/accounts.json')), {
                email: address,
                password: password,
                verified: false,
                owner: ''
            }], null, 4));

            console.log(`Created account for "${address}"! Verifying...`);

            await mail.waitForEmail();

            message.guild.channels.cache.get(config.logChannel).send(`Verified **${address}**!`);
        }));

        message.guild.channels.cache.get(config.logChannel).send(`Generated **${generated.length}** accounts!`);
    };

    if (args[0].toLowerCase() === 'check' || args[0].toLowerCase() === 'ls') {
        let accounts = JSON.parse(fs.readFileSync('./data/accounts.json'));

        message.delete();

        message.channel.send({
            embeds: [{ description: `**stock:**\n- used: ${accounts.filter(a => a.owner).length}\n- usable: ${accounts.filter(a => a.verified && !a.owner).length}\n- failed: ${accounts.filter(a => !a.verified).length}` }]
        });
    };
};