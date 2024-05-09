import Discord from 'discord.js';
import config from '#config';

export default async (interaction) => {
    let threads = await interaction.channel.threads.fetch();
    let openThread = threads.threads.find((thread) => thread.name === `ticket-${interaction.user.username}`);
    if (openThread) return interaction.editReply({ embeds: [{ description: `**ticket already opened @ <#${openThread.id}>!**` }] });

    let thread = await interaction.channel.threads.create({
        name: 'ticket-' + interaction.user.username,
        type: Discord.ChannelType.PrivateThread
    });

    interaction.editReply({ embeds: [{ description: `**ticket opened @ <#${thread.id}>!**` }] });

    await thread.members.add(config.ownerId);
    await thread.members.add(interaction.user.id);
};