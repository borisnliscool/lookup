import { redirect } from '@sveltejs/kit';
import type { CfxCitizenServerData } from '../../app';
import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const id = params.id;
	if (id.length !== 6) throw redirect(307, '/');

	const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${id}`);
	if (!response.ok || response.status !== 200) throw redirect(307, '/');

	const data = await response.json();

	return {
		serverData: data as CfxCitizenServerData
	};
}) satisfies PageLoad;
