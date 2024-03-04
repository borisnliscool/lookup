import { GITHUB_TOKEN } from '$env/static/private';
import * as packageJson from '../../package.json';
import type { LayoutServerLoad } from './$types';

interface Commit {
	sha: string;
}

export const load = (async () => {
	let commit = null;

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
	} catch (err) {
		console.error(err);
	}

	return { commit, version: packageJson.version };
}) satisfies LayoutServerLoad;
