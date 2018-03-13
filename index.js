export function ProxyScope(level, ...parents) {
	return new Proxy(level, {
		get(target, property) {
			if(property in level) {
				return level[property];
			}
			
			for(var i = 0; i < parents.length; i++) {
				if(parents[i][property]) {
					return parents[i][property];
				}
			}
		},
		getOwnPropertyDescriptor(target, prop) {
			var desc = (
				Object.getOwnPropertyDescriptor(target, prop)
			);
			
			if(desc) {
				return desc;
			}
			
			var obj = parents.find(function(obj) {
				return prop in obj;
			});
			
			if(obj) {
				var desc = Object.getOwnPropertyDescriptor(obj, prop);
	  
				if(desc) {
					return desc;
				}

				if(obj = Object.getPrototypeOf(obj)) {
					return Object.getOwnPropertyDescriptor(obj, prop);
				}
			}
		},
		ownKeys(target) {
			return Reflect.ownKeys(target).concat(
				...(parents.map(function(parent) {
					return Reflect.ownKeys(parent);
				}))
			);
		},
		set(target, property, value, receiver) {
			return Reflect.set(target, property, value, receiver);
		},
		has(target, property) {
			return property in level || parents.some(function(parent) {
				return property in parent;
			});
		},
		getPrototypeOf(target) {
			return Object.getPrototypeOf(level);
		}
	});
}