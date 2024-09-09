require('dotenv').config();

export default {
	token: process.env.TOKEN,
	clientId: process.env.CLIENT_ID,
    mongoUrl: process.env.MONGO_URL,
	ownerId: process.env.OWNER_ID,
	serverId: process.env.SERVER_ID,
	channelId: process.env.CHANNEL_ID,
	apiKey: process.env.GOOGLE_API_KEY,
	debug: true,
};