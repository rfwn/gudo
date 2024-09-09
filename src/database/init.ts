import Client from '../structures/Client';
import db from 'mongoose';

export default {
	init: async (client: Client) => {
		const dbOptions = {
			autoIndex: false,
			maxPoolSize: 5,
			connectTimeoutMS: 10000,
			family: 4,
		};
		db.connect(client.config.mongoUrl, dbOptions);
		db.Promise = global.Promise;
		db.connection.on('connected', () => {
			client.logger.info('[+] Database connection initialized.');
		});
		db.connection.on('err', (err) => {
			client.logger.error(`[!] Database has encountered an error: \n ${err.stack}.`);
		});
		db.connection.on('disconnected', () => {
			client.logger.error('[-] Database disconnected.');
		});
	},
	async ping() {
		const currentNano = process.hrtime();
		await db.connection.db!.command({ ping: 1 });
		const time = process.hrtime(currentNano);
		return (time[0] * 1e9 + time[1]) * 1e-6;
	},
};