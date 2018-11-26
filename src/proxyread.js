import proxyFactory from './proxyfactory.js';

const traps = Object.freeze({
	set(target, property, value) {
		return target.stack[0][property] = value;
	},
	get(target, property) {
		var host = target.findHost(property);

		if(host) {
			return host[property];
		}
	},
	getOwnPropertyDescriptor(target, property, receiver) {
		var host = target.findHost(property);

		if(host) {
			var desc = Object.getOwnPropertyDescriptor(host, property);

			if(desc) {
				return desc;
			}

			if(host = Object.getPrototypeOf(host)) {
				return Object.getOwnPropertyDescriptor(host, property);
			}
		}
	},
	ownKeys(target) {
		let set = new Set();

		target.stack.forEach(function(level) {
				Reflect.ownKeys(level).forEach(set.add, set);
		});

		return Array.from(set);
	},
	has(target, property) { return target.findHost(property); }
});

const target = {
	/**
	returns the first object in stack that has the property
	if none matches and root is set the top of the stack will be returned
	*/

	findHost(property, root) {
		let host = this.stack.find(function(level) {
			return property in level;
		});

		if(host) {
			return host;
		}

		if(root === true) {
			return this.stack[0];
		}
	}
};

const factory = proxyFactory(traps, target);

export {
	factory as default,
	target,
	traps
}
