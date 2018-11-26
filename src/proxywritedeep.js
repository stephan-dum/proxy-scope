import proxyFactory from './proxyfactory.js';
import proxyReadDeep from './proxyreaddeep.js';
import { traps as writeTraps } from './proxywrite.js';

const traps = {};
const target = {};

const factory = target.factory = proxyFactory([traps, writeTraps, proxyReadDeep], target);

Object.freeze(traps);

export {
	factory as default,
	target,
	traps
}
