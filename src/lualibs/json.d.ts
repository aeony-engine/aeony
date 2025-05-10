/**
 * Encode an object into a json string.
 * @param value The object to encode.
 * @returns The encoded json string.
 * @noSelf
 */
export function encode<T>(value: T): string;

/**
 * Decode a json string into an object.
 * @param value The json string to decode.
 * @returns The decoded object.
 * @noSelf */
export function decode<T>(value: string): T;
