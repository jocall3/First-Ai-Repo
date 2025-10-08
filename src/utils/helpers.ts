```typescript
/**
 * src/utils/helpers.ts
 *
 * Contains common utility functions used across the project, primarily for string manipulation.
 */

/**
 * Converts a string to a URL-friendly slug.
 * - Converts to lowercase.
 * - Normalizes characters (e.g., 'é' to 'e').
 * - Replaces non-alphanumeric characters (except hyphens) with hyphens.
 * - Trims leading/trailing hyphens.
 * - Replaces multiple hyphens with a single hyphen.
 * @param text The input string.
 * @returns The slugified string.
 */
export function slugify(text: string): string {
    if (!text) return '';
    return text
        .toString()
        .normalize('NFD') // Normalize the string (e.g., é -> e)
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
        .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * Converts a string to camelCase.
 * E.g., "hello world" -> "helloWorld"
 *       "foo-bar-baz" -> "fooBarBaz"
 *       "Foo Bar Baz" -> "fooBarBaz"
 * @param text The input string.
 * @returns The camelCased string.
 */
export function camelCase(text: string): string {
    if (!text) return '';
    return text
        .replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^./, (match) => match.toLowerCase());
}

/**
 * Converts a string to PascalCase.
 * E.g., "hello world" -> "HelloWorld"
 *       "foo-bar-baz" -> "FooBarBaz"
 *       "Foo Bar Baz" -> "FooBarBaz"
 * @param text The input string.
 * @returns The PascalCased string.
 */
export function pascalCase(text: string): string {
    if (!text) return '';
    return text
        .replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^./, (match) => match.toUpperCase());
}

/**
 * Converts a string to kebab-case.
 * E.g., "hello world" -> "hello-world"
 *       "Foo Bar Baz" -> "foo-bar-baz"
 *       "fooBarBaz"   -> "foo-bar-baz"
 * @param text The input string.
 * @returns The kebab-cased string.
 */
export function kebabCase(text: string): string {
    if (!text) return '';
    return text
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // Add hyphen before uppercase letters (e.g., fooBar -> foo-Bar)
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .toLowerCase()
        .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
        .replace(/--+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Converts a string to snake_case.
 * E.g., "hello world" -> "hello_world"
 *       "Foo Bar Baz" -> "foo_bar_baz"
 *       "fooBarBaz"   -> "foo_bar_baz"
 * @param text The input string.
 * @returns The snake_cased string.
 */
export function snakeCase(text: string): string {
    if (!text) return '';
    return text
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2') // Add underscore before uppercase letters (e.g., fooBar -> foo_Bar)
        .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
        .toLowerCase()
        .replace(/^_|_$/g, '') // Trim leading/trailing underscores
        .replace(/__+/g, '_'); // Replace multiple underscores with single underscore
}

/**
 * Capitalizes the first letter of a string.
 * E.g., "hello" -> "Hello"
 * @param text The input string.
 * @returns The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts a string to Title Case.
 * E.g., "hello world" -> "Hello World"
 * @param text The input string.
 * @returns The title-cased string.
 */
export function titleCase(text: string): string {
    if (!text) return '';
    return text
        .toLowerCase()
        .split(' ')
        .map(word => capitalizeFirstLetter(word))
        .join(' ');
}
```