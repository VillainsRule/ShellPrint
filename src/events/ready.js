import Discord from 'discord.js';

export default async (client) => {
    client.user.setPresence({
        activities: [{
            name: 'doescolder',
            type: Discord.ActivityType.Watching
        }],
        status: 'dnd'
    });

    console.log(`Logged in as ${client.user.tag}!`);
};