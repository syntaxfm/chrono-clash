const CONGRATS_MESSAGES = [
	'Got it!',
	'Nailed it!',
	'Perfect!',
	'Bullseye!',
	'Crushed it!',
	'Boom!',
	'Spot on!',
	'Nice!',
	'Sweet!',
	'Amazing!',
	'Excellent!',
	'Marvelous!',
	'Fantastic!',
	'Legendary!',
	'Flawless!',
	'Unstoppable!',
	'Right on!',
	'Bingo!',
	'Wow!',
	'Slick!'
] as const;

export function pickCongrats(seed: string): string {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) | 0;
	}
	return CONGRATS_MESSAGES[Math.abs(hash) % CONGRATS_MESSAGES.length];
}
