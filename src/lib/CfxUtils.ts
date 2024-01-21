export default class CfxUtils {
	private static colorData = [
		'#F0F0F0',
		'#F44336',
		'#4CAF50',
		'#FFEB3B',
		'#42A5F5',
		'#03A9F4',
		'#9C27B0',
		'#F0F0F0',
		'#FF5722',
		'#9E9E9E'
	];

	static toColored(input: string): string {
		const parts = input.split('^');
		const spanArray = parts.map((part, index) => {
			if (index === 0) {
				return part; // First part is not colored
			} else {
				const colorIndex = parseInt(part.charAt(0), 10);
				const color = this.colorData[colorIndex];
				const text = part.substring(1);
				return `<span style="color: ${color}">${text}</span>`;
			}
		});

		return spanArray.join('');
	}
}
