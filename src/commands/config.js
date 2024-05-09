import Discord from 'discord.js';
import axios from 'axios';
import fs from 'fs';

export default async (message, args) => {
    if (args[0] === 'export') {
        let accounts = fs.readFileSync('./data/accounts.json', 'utf-8');
        let keys = fs.readFileSync('./data/keys.json', 'utf-8');
        let config = fs.readFileSync('./config.js', 'utf-8');

        message.channel.send({
            content: btoa(JSON.stringify({ keys, config })),
            files: [new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(accounts)), { name: `accounts.json` })]
        });
    };

    if (args[0] === 'import') {
        if (!message.reference) return message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: `**specify a message to import.**` }]
        });

        let reference = await message.channel.messages.fetch(message.reference.messageId);
        let data = JSON.parse(atob(reference.content));

        fs.writeFileSync('./data/keys.json', JSON.stringify(JSON.parse(data.keys), null, 4));
        fs.writeFileSync('./config.js', data.config);

        let accountFile = await axios.get(reference.attachments.first().url);
        fs.writeFileSync('./data/accounts.json', JSON.stringify(JSON.parse(accountFile.data), null, 4));
    }
};