(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.proxyScope = {})));
}(this, (function (exports) { 'use strict';

	function createProxy(stack, ...trapChain) {
		if(!Array.isArray(stack)) {
			stack = Array.from(arguments);
			trapChain = [];
		}

		let target = stack[0];
		let handler = { stack };

		trapChain.unshift(...this.traps);

		trapChain.forEach(function(levelTraps) {
			Object.getOwnPropertyNames(levelTraps).forEach(function(property) {
				if(!handler.hasOwnProperty(property)) {
					Object.defineProperty(handler, property, Object.getOwnPropertyDescriptor(levelTraps, property));
				}
			});
		});

		return new Proxy(target, handler)
	}

	function proxyFactory(...trapChain) {
		let traps = [];

		trapChain.forEach(function(factory) {
			if(factory.traps) {
				traps.push(...factory.traps);
			} else {
				traps.push(factory);
			}
		});

		let factory = createProxy.bind({
			traps : traps
		});

		factory.traps = traps;

		return factory;
	}

	const traps = Object.freeze({
		set(target, property, value) {
			return Reflect.set(this.stack[0], property, value);
		},
		get(target, property) {
			var host = this.findHost(property);

			if(host) {
				return host[property];
			}
		},
		getOwnPropertyDescriptor(target, property, receiver) {
			var host = this.findHost(property);

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

			this.stack.forEach(function(level) {
					Reflect.ownKeys(level).forEach(set.add, set);
			});

			return Array.from(set);
		},
		has(target, property) {
			return this.findHost(property);
		},

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
	});

	const factory = proxyFactory(traps);

	const traps$1 = Object.freeze({
		set(target, property, value) {
			return Reflect.set(this.findHost(property, true), property, value);
		},
		defineProperty(target, property, descriptor) {
			return Reflect.defineProperty(this.findHost(property, true), property, descriptor);
		},
		deleteProperty(target, property) {
			return Reflect.deleteProperty(this.findHost(property, true), property);
		}
	});

	const factory$1 = proxyFactory(traps$1, factory);

	const objectToString = Object.prototype.toString;

	const traps$2 = {
		get(target, property) {
			var hosts = this.findAllHosts(property);

			switch(hosts.length) {
				case 0:
					return undefined;
				case 1:
					return hosts[0][property];
			}

			let stack = [];

			for(let i = 0; i < hosts.length ; i++) {
				let host = hosts[i];
				let value = host[property];

				switch(objectToString.call(value)) {
					case "[object Object]":
					case "[object Array]":
						break;
					default:
						return value;
				}

				stack.push(value);
			}

			return this.factory(stack);
		},
		/**
			returns all objects in stack that have the property
			if none matches and root is set the top of the stack will be pushed
		*/
		findAllHosts(property, root) {
			let hosts = this.stack.filter(function(level) {
				return property in level;
			});

			if(hosts.length == 0 && root === true) {
				hosts.push(this.stack[0]);
			}

			return hosts;
		}
	};

	const factory$2 = traps$2.factory = proxyFactory(traps$2, factory);

	const traps$3 = {};

	const factory$3 = traps$3.factory = proxyFactory(traps$3, traps$1, factory$2);

	exports.default = proxyFactory;
	exports.read = factory;
	exports.write = factory$1;
	exports.readDeep = factory$2;
	exports.writeDeep = factory$3;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
