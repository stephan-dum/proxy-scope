# ProxyScope

<<<<<<< HEAD
Bootstrap for combining object be reference with ES proxy, and reusing them on other proxy-factories. Which will also reflect changes made to the original objects. Proxies can also be useful when using immutables or mixins.

> Caution this method uses [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and therefor will only work in modern enviroments. Please view [CanIUse](https://caniuse.com/#feat=proxy) for more information.

## Install

`npm i @aboutweb/proxyscope`


## API

```javascript


  interface traps {/*ES proxy traps*/}

  interface target {
    stack[] : object
  }

  interface trapChain {
    [traps | factory] | traps | factory,
  }

  interface factory {
    (
      target : target | Array<object>,
      trapChain : trapChain
    ) : Proxy,
    traps? : traps,
    target? : object
  }

  exports default interface createFactory {
    (
      trapChain : trapChain,
      target : object
    ) : factory
  }

### proxyFactory(`Array<traps | factory> | traps | factory`, `Object target`)
=======
A way to aggregate objects by referances which will also reflect changes made to the original objects. This is usefull when using immutables or mixins.


> Caution this method uses [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and therefor will only work in modern enviroments. Please view [CanIUse](https://caniuse.com/#feat=proxy) for more information.


### ProxyFactory(`Array<traps | factory> | traps | factory`, ...`Object target`)
>>>>>>> origin/master
`traps` chain of traps merged for the new Proxy

`target` this will extended the proxy target created later on

returns a `factory` function


### factory(`Object target | Array<Object> target`, `Array<traps>`)
`target` an object with a stack property or an Array of levels

`traps` chain of traps tho merge

### Example
```javascript

import { default as proxyFactory } from "@aboutweb/proxyscope";
import otherFactory from "./otherfactory.js";

const traps = {
  has(target, property, receiver) {
    return target.findHost(property);
  }
}

const target = {
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
}

const factory = proxyFactory([traps, otherfactory], target);

export {
  factory as default,
  target,
  traps
}

```

## ProxyScope.read
Uses the `target.stack` to look up properties.

### Example

```javascript
import { read as proxyRead } from "@aboutweb/proxyscope";

let defaultConfig = {
  fu : "bar"
}

function someFn(config) {
  let proxy = proxyRead(config, defaultConfig);

  expect(proxy.fu).to.equal("bar");
  expect(proxy.bar).to.equal("baz");
}

someFn({
  bar : "baz"
});

```

## ProxyScope.write
  same as proxyRead but will also forward writes if they are defined somewhere in the level chain.

### Example

```javascript
const l1 = {
  some : "value"
}

const l2 = {
  fu : "bar"
}

let proxy = proxyWrite(l1, l2);

proxy.fu = "hallo";

expect(l2.fu).to.equal("hallo");

```

## ProxyScope.readDeep
<<<<<<< HEAD
  read even nested objects, extends proxy-read by returning a new proxy for every property that has multiple possible getters
=======
  read even nested objects
>>>>>>> origin/master

> Use wisely, because this will create a proxy for every property lookup that has more then one possible value. Therefor it is recommended to cache lookups when possible.

### Example
```javascript

import { readDeep as proxyReadDeep } from "@aboutweb/proxyscope";

const l1 = {
  nested : {
    some : "value",
  }
}

const l2 = {
  nested : {
    fu : "bar"
  }
}

const l3 = {
  other : true
}

let proxy = proxyReadDeep(l1, l2, l3);

//before caching or update cache afterwords
l3.nested = {
  deep : true
}

//cache the returned proxy
let nested = proxy.nested;

expect(nested.some).to.equal("value");
expect(nested.fu).to.equal("bar");
expect(nested.deep).to.equal(true);

```

## ProxyScope.writeDeep
  same as proxyReadDeep, but will also write to nested objects


### Example
```javascript

import { writeDeep as proxyWriteDeep } from "@aboutweb/proxyscope";

const l1 = {
  nested : {
    some : "value",
  }
}

const l2 = {
  nested : {
    fu : "bar"
  }
}

let proxy = proxyReadDeep(l1, l2);

//also use cache where possible
let nested = proxy.nested;

nested.some = "other";
nested.fu = "baz";

expect(l1.nested.some).to.equal("other");
expect(l2.nested.fu).to.equal("baz");

```

## Licence

ISC
