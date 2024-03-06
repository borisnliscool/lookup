type RefreshFunction<T> = () => T | Promise<T>;

export default class Cache<T> {
	private data: T | null = null;
	private lastRefreshed: Date | null = null;

	private readonly refreshFunction: RefreshFunction<T>;
	private readonly expirationTimeMs: number;

	constructor(refreshFunction: RefreshFunction<T>, expirationTimeMs: number) {
		this.refreshFunction = refreshFunction;
		this.expirationTimeMs = expirationTimeMs;
	}

	async get(): Promise<T> {
		if (!this.isCacheValid()) await this.refresh();
		return this.data!;
	}

	private isCacheValid(): boolean {
		return (
			!!this.data &&
			!!this.lastRefreshed &&
			Date.now() - this.lastRefreshed.getTime() < this.expirationTimeMs
		);
	}

	private async refresh(): Promise<void> {
		this.data = await this.refreshFunction();
		this.lastRefreshed = new Date();
	}
}
