import proxyFactory from './factory.js';
import proxyReadDeep from './read-deep.js';
import { traps as writeTraps } from './write.js';

const traps = {};

const factory = traps.factory = proxyFactory(traps, writeTraps, proxyReadDeep);

export {
	factory as default,
	traps
}
