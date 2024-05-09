import fs from 'fs';
import url from 'url';

export default async function (_, interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    await interaction.deferReply({ ephemeral: true });

    let interactions = fs.readdirSync(url.fileURLToPath(new URL('../', import.meta.url)) + 'interactions');
    let selected = interactions.filter(i => i.split('.')[0] === interaction.customId);

    if (selected) (await import(`../interactions/${selected}`)).default(interaction);
};