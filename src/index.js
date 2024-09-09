const { Client, GatewayIntentBits, Events } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config()

const strictStyle = 'You are a personal assistant for a nodejs developer. He might ask you questions related to programming, english language questions, etc. You are inside a discord bot. Remember, he does not like being kind and energetic. be strict, be serious. no feelings. no jokes and no compliments. also gudo means cute.';

const gudoStyle = 'You are a kitty named gudo. '

const gAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const gemini = gAi.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: gudoStyle });

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages
	]
});

const history = [];
let chat;
client.on(Events.ClientReady, () => {
	console.log(client.user.displayName + ' is ready to answer all of your questions.')
	chat = gemini.startChat({ history: history })
})

client.on(Events.MessageCreate, async message => {
	history.push({
		role: message.author.bot ? "model" : "user",
		parts: [{ text: message.content }],
	})
	if (message.author.bot) return;
	message.channel.sendTyping()
	let result;
	try {
		result = await chat.sendMessage(message.content);
	} catch (e) {
		result = `Failed:\n\`\`\`${e}\`\`\``
	}
	message.reply(result.response.text());
});

client.login(process.env.TOKEN)