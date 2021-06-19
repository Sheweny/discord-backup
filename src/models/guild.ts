import { Schema, model } from 'mongoose'

const guildSchema = new Schema({
	_id: Schema.Types.ObjectId,
	backupID: String,
	backupOwner: String,
	gID: String,
	gName: String,
	gDescription: String,
	gIcon: String,
	gBans: Array,
	gCategories: Array,
	gChannels: Array,
	gEmojis: Array,
	gRoles: Array,

});

export default model("Guild", guildSchema);
