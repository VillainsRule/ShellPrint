import Discord from 'discord.js';

export default async (message) => {
    message.delete();

    message.channel.send({
        ephemeral: true,
        components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('openTicket')
                    .setLabel('Open Ticket')
                    .setStyle(Discord.ButtonStyle.Primary)
            )
        ]
    });
};