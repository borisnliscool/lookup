import * as packageJson from '../../package.json';
import type { LayoutServerLoad } from './$types';

interface Commit {
	sha: string;
}

export const load = (async () => {
	const response = await fetch(
		'https://api.github.com/repos/borisnliscool/lookup/commits?per_page=1'
	);
	const data: Commit[] = await response.json();

	return { commit: data[0].sha, version: packageJson.version };
}) satisfies LayoutServerLoad;
