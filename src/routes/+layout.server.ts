import { GITHUB_TOKEN } from '$env/static/private';
import Cache from '$lib/Cache';
import * as packageJson from '../../package.json';
import type { LayoutServerLoad } from './$types';

interface Commit {
	sha: string;
}

const commitCache = new Cache<string>(
	async () => {
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
			return data[0].sha;
		} catch (error) {
			console.error(error);
			return 'unknown';
		}
	},
	12 * 60 * 60 * 1000 // 12 hours
);

export const load = (async () => {
	const commit = await commitCache.get();
	return { commit, version: packageJson.version };
}) satisfies LayoutServerLoad;
