// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface CfxPlayer {
	endpoint: string;
	id: number;
	identifiers: string[];
	name: string;
	ping: number;
}

interface CfxCitizenServerDataPublicVariables extends Record<string, unknown> {
	onesync_enabled: string;
	element_club: string;
	tags: string;
	sv_projectName: string;
	sv_projectDesc: string;
}

interface CfxCitizenServerDataData {
	clients: number;
	players: CfxPlayer[];
	gametype: string;
	hostname: string;
	mapname: string;
	sv_maxclients: number;
	enhancedHostSupport: boolean;
	resources: string[];
	server: string;
	vars: CfxCitizenServerDataPublicVariables;
	selfReportedClients: number;
	ownerID: number;
	private: boolean;
	fallback: boolean;
	connectEndPoints: string[];
	upvotePower: number;
	burstPower: number;
	support_status: string;
	ownerName: string;
	ownerProfile: string;
	ownerAvatar: string;
	lastSeen: string;
	iconVersion: number;
}

interface CfxCitizenServerData {
	EndPoint: string;
	Data: CfxCitizenServerDataData;
}

interface PlayerActivityAlert {
	nameMatcher: string;
	identifiers: string[];
}

export { CfxCitizenServerData, CfxPlayer, PlayerActivityAlert };
