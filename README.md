# ProxyScope

Offers a way to combine objects without copying values around. Its is usefull when using immutables or if you want to restrict object access.

> Caution this method uses [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and therefor will only work in modern Browsers. Please view [CanIUse](https://caniuse.com/#feat=proxy) for more information.


### ProxyScope(`Object level`, ...`Object parent`)

  `level` Object to use a base level
  
  `parent`at least one Object that acts as parent 

### Proxy Traps
All traps will use the level object first and then start ascending the parents. The `set` and `prototypeOf` traps will use the level object only.

### Examples

```javascript
var p1 = {
  "id" : "p1",
  "global" : "value"
};

var p2 = {
  "id" : "p2",
  "fu" : "bla"
};

var level = {
  id : "level",
  "fu" : "bar"
};

var sc1 = ProxyScope(p1, p2);
var sc2 = ProxyScope(level, sc2); //nested
var sc3 = ProxyScope(level, p1, p2); //the same as sc2

sc1.id //p1
sc1.fu //bla
sc1.global //value

sc3.fubar //bar
sc3.id //level

```

## Licence

ISC
