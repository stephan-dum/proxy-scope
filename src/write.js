import proxyFactory from './factory.js';
import proxyRead from './read.js';

const traps = Object.freeze({
	set(target, property, value) {
		return Reflect.set(target.findHost(property, true), property, value);
	},
	defineProperty(target, property, descriptor) {
		return Reflect.defineProperty(target.findHost(property, true), property, descriptor);
	},
	deleteProperty(target, property) {
		return Reflect.deleteProperty(target.findHost(property, true), property);
	}
});

const factory = proxyFactory([traps, proxyRead]);

export {
	factory as default,
	traps
};
