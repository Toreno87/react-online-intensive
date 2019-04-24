//Core
import { sum, delay, getUniqueID } from './';

describe('instruments:', () => {
    test('sum function should be a function', () => {
        expect(sum).toBeInstanceOf(Function);
    });

    test('sum function should be thow, when called with not-number type as second argument', () => {
        expect(() => sum(2, 'Привет')).toThrow();
    });

    test('sum function should be thow, when called with not-number type as first argument', () => {
        expect(() => sum('Привет', 2)).toThrow();
    });

    test('sum function should return an additional two arguments passed', () => {
        expect(sum(2, 3)).toBe(5);
        expect(sum(8, 1)).toMatchSnapshot();
    });

    test('delay function should be a returned promise', async () => {
        await expect(delay()).resolves.toBeUndefined();
    });

    test('getUniqueID should be a function', () => {
        expect(getUniqueID).toBeInstanceOf(Function);
    });

    test('getUniqueID function should be thow, when called with not-number type an argument', () => {
        expect(() => getUniqueID('Привет')).toThrow();
    });

    test('getUniqueID function should produce a string of a desired a given length', () => {
        expect(typeof getUniqueID()).toBe('string');
        expect(getUniqueID(5)).toHaveLength(5);
    });
});

