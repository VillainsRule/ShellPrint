import fs from 'fs';

export default (message, args) => {
    let keys = JSON.parse(fs.readFileSync('./data/keys.json', 'utf-8'));

    if (!args[0]) return message.channel.send({
        content: message.author.toString(),
        embeds: [{ description: `**specify a subcommand.**` }]
    });

    if (args[0].toLowerCase() === 'gen') {
        if (keys[args[1].toLowerCase()]) return message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: '**That key already exists.**' }]
        });

        keys[args[1].toLowerCase()] = args[2] || crypto.randomUUID();
        fs.writeFileSync('./data/keys.json', JSON.stringify(keys, null, 4));

        message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: `**created key \`${keys[args[1].toLowerCase()]}\`**\n\`\`\`${keys[args[1].toLowerCase()]}\n\`\`\`` }]
        });
    };

    if (args[0].toLowerCase() === 'ls') message.channel.send({
        content: message.author.toString(),
        embeds: [{
            description: Object.keys(keys).length ?
                `**all keys:**\n\`\`\`${Object.entries(keys).map(s => s[0] + ': ' + s[1]).join('\n')}\`\`\`` :
                '**no keys found.**'
        }]
    });

    if (args[0].toLowerCase() === 'rm') {
        if (!keys[args[1].toLowerCase()]) return message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: `**key \`${keys[args[1].toLowerCase()]}\` doesn't exist.**` }]
        });

        delete keys[args[1].toLowerCase()];
        fs.writeFileSync('./data/keys.json', JSON.stringify(keys, null, 4));

        message.channel.send({
            content: message.author.toString(),
            embeds: [{ description: `**deleted key \`${args[1].toLowerCase()}\`!**` }]
        });
    };
};