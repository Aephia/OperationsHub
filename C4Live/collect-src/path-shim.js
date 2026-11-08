// node:path and node:url stand-ins for the browser bundle: the collector only builds "/c4/<file>" paths with these.
export const join = (...parts) => parts.join('/').replace(/\/+/g, '/');
export const dirname = p => String(p).split('/').slice(0, -1).join('/') || '/';
export const resolve = (...parts) => join(...parts);
export const fileURLToPath = u => String(u).replace(/^file:\/\//, '');
