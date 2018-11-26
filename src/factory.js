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

export default proxyFactory;
