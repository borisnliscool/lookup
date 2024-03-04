import { GITHUB_TOKEN } from '$env/static/private';
import * as packageJson from '../../package.json';
import type { LayoutServerLoad } from './$types';

interface Commit {
	sha: string;
}

let commit: string | undefined;
let lastUpdate: Date | undefined;

export const load = (async () => {
	if (
		!commit ||
		commit == '' ||
		(lastUpdate && new Date().getTime() - lastUpdate.getTime() > 6 * 60 * 60 * 1000)
	) {
		try {
			const response = await fetch(
				'https://api.github.com/repos/borisnliscool/lookup/commits?per_page=1',
				{
					headers: {
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						'user-agent': 'borisnliscool - lookup'
					}
				}
			);

			const data: Commit[] = await response.json();
			commit = data?.[0]?.sha;
			lastUpdate = new Date();
		} catch (err) {
			console.error(err);
		}
	}

	return { commit, version: packageJson.version };
}) satisfies LayoutServerLoad;
