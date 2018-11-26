
function createProxy(stack, ...trapChain) {
	if(!Array.isArray(stack)) {
		stack = Array.from(arguments);
		trapChain = [];
	}

	let target = stack[0];
	let handler = { stack };

	trapChain.push(...this.traps);

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

export default proxyFactory;
