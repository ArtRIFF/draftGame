export function getRandomValue<T>(arrayValues: T[]): T
{
	const index = Math.floor(Math.random() * arrayValues.length);
	return arrayValues[index];
}
