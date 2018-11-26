import proxyFactory from './factory.js';
import proxyReadDeep from './read-deep.js';
import { traps as writeTraps } from './write.js';

const traps = {};
const target = {};

const factory = target.factory = proxyFactory([traps, writeTraps, proxyReadDeep], target);

Object.freeze(traps);

export {
	factory as default,
	target,
	traps
}
