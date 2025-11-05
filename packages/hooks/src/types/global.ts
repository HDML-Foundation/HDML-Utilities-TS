/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

declare global {
  const Javy: {
    IO: {
      readSync: (fd: number, buffer: Uint8Array) => number;
      writeSync: (fd: number, buffer: Uint8Array) => number;
    };
  };
}

export {};
