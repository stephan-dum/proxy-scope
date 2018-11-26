(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.proxyScope = {})));
}(this, (function (exports) { 'use strict';

	/**
		@module proxyFactory
	*/
	/**
		generates trap handlers by merging properties from trapChain to trapChain[0]
		or if the trapchain[0] is not extensible to an empty object.

		context
			traps
				default traps to push to trapChain

		@param target
			a spread or array of level objects
		@param trapChain
			a spread of traps objects
			if target is a spread this will be an empty array
	*/

	function createProxy(target, ...trapChain) {
		let stack = target.stack;

		if(!stack) {
			stack = target;
			target = {};

			if(!Array.isArray(stack)) {
				stack = Array.from(arguments);
				trapChain = [];
			}

			target.stack = stack;
		}

		Object.assign(target, this.target);

		if(this.traps) {
			trapChain.push(...this.traps);
		}

		let traps = (
			Object.isExtensible(trapChain[0])
				?trapChain.shift()
				:{}
		);

		trapChain.forEach(function(levelTraps) {
			Object.getOwnPropertyNames(levelTraps).forEach(function(property) {
				if(!traps.hasOwnProperty(property)) {
					Object.defineProperty(traps, property, Object.getOwnPropertyDescriptor(levelTraps, property));
				}
			});
		});

		return new Proxy(target, traps)
	}

	/**
		Creates factory for generation Proxies

		@param { String | String[] } trapChain
		@param { Object } [target = {}] can be used to extend the later proxy target
	*/

	function proxyFactory(trapChain, target = {}) {
		if(!Array.isArray(trapChain)) {
			trapChain = [trapChain];
		}

		let _traps = [];

		trapChain.forEach(function(factory) {
			if(factory.target) {
				Object.assign(target, factory.target);
			}
			if(factory.traps) {
				_traps.push(...factory.traps);
			} else {
				_traps.push(factory);
			}
		});

		let factory = createProxy.bind({
			traps : _traps,
			target
		});

		factory.target = target;
		factory.traps = _traps;

		return factory;
	}

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

	const traps$1 = Object.freeze({
		set(target$$1, property, value) {
			return Reflect.set(target$$1.findHost(property, true), property, value);
		},
		defineProperty(target$$1, property, descriptor) {
			return Reflect.defineProperty(target$$1.findHost(property, true), property, descriptor);
		},
		deleteProperty(target$$1, property) {
			return Reflect.deleteProperty(target$$1.findHost(property, true), property);
		}
	});

	const factory$1 = proxyFactory([traps$1, factory]);

	const objectToString = Object.prototype.toString;

	const traps$2 = {
		get(target$$1, property) {
			var hosts = target$$1.findAllHosts(property);

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

			return target$$1.factory(stack);
		}
	};

	const target$1 = {
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

	const factory$2 = target$1.factory = proxyFactory([traps$2, factory], target$1);

	Object.freeze(traps$2);

	const traps$3 = {};
	const target$2 = {};

	const factory$3 = target$2.factory = proxyFactory([traps$3, traps$1, factory$2], target$2);

	Object.freeze(traps$3);

	exports.default = proxyFactory;
	exports.read = factory;
	exports.write = factory$1;
	exports.readDeep = factory$2;
	exports.writeDeep = factory$3;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
