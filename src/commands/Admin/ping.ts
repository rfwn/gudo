import { CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import Client from "../../structures/Client";
import Command from "../../structures/Command";
import { SlashCommandBuilder } from 'discord.js'
export default class PingCommand extends Command {
    constructor(
        client: Client,
    ) {
        super(
            new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Shows bot\'s ping'),
            client
        );
    }

    override async run(interaction: CommandInteraction) {
        const m = await (interaction.channel! as TextChannel).send('.');
		const messageTimestamp = m.createdTimestamp;
        m.delete();
        const embed = new EmbedBuilder()
            .addFields(
                { name: '🏓 Ping', value: `> \`${messageTimestamp - interaction.createdTimestamp}ms\``, inline: true },
                { name: '⌛ API Latency', value: `> \`${Math.round(this.client.ws.ping)}ms\``, inline: true },
                { name: '📂 Database', value: `> \`${Math.round(await this.client.database.ping())}ms\``, inline: true },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
}