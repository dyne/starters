import { greet, foo } from './main';

test('the data is peanut butter', () => {
	expect(1).toBe(1);
});

test('greeting', async () => {
	expect(greet('Foo')).toBe('Hello Foo');
	expect(await foo()).toBe(true);
});
