import Discord from 'discord.js';

export default async (client) => {
    client.user.setPresence({
        activities: [{
            name: 'with doescolder 😏',
            type: Discord.ActivityType.Playing
        }],
        status: 'dnd'
    });

    console.log(`[ DISCORD ] Logged in as ${client.user.tag}!`);
};