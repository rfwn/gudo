import { ChannelType, DMChannel, Message, TextChannel, ThreadAutoArchiveDuration } from 'discord.js';
import Event from '../../structures/Event';
import Client from '../../structures/Client';
import Chat from '../../structures/Chat';
import { fetchAllMessagesFromThread, sendLongMessage } from '../../util/Discord';

export default class MessageCreate extends Event {
	override async run(message: Message, client: Client) {
		if (message.author.bot) return;
		const content = message.content;
		if (message.channel.id === client.config.channelId) {
			await message.delete();
			const thread = await (message.channel as TextChannel).threads.create({
				name: 'untitled',
				autoArchiveDuration: ThreadAutoArchiveDuration.OneHour
			});
			const chat = new Chat(message.author, thread, client);
			client.chats.set(thread.id, chat);
			const reply = await chat.textPrompt(content);
			if (reply) {
				await thread.send(`Replying to: ${content}`);
				await sendLongMessage(reply as string, thread)
			}
			await chat.setSlug();
		}
		if (message.channel.isThread()) {
			let chat = client.chats.get(message.channel.id);
			if(!chat) chat = new Chat(message.author, message.channel, client);;
			const messages = await fetchAllMessagesFromThread(message.channel)
			messages.reverse().forEach((message: Message) => {
				chat.addHistory(message.content, message.author.bot ? 'model' : 'user')
			})
			const reply = await chat.textPrompt(content);
			if (reply) {
				await sendLongMessage(reply as string, message.channel)
			}
		}
	}
}