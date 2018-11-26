import proxyFactory from './factory.js';
import proxyRead from './read.js';

const objectToString = Object.prototype.toString;

const traps = {
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

const factory = traps.factory = proxyFactory(traps, proxyRead);

export {
	factory as default,
	traps
}
