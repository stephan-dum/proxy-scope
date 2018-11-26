const { expect } = require("chai");

describe("proxy scope", function() {
  var ProxyScope = require('../dist/index.js');

  var root;
  var l2;
  var l3;

  beforeEach(function() {
    root = {
      "global" : "value",
      "obj" : {
        "1" : { "2" : 3 },
        "4" : 5
      }
    };

    l2 = {
      "fu" : "bla",
      "obj" : {
        "1" : { "3" : 2 },
        "4" : 6
      }
    };

    l3 = {
      "fu" : "bar",
      "val" : "abc",
      "deep" : true,
      "obj" : {
        "1" : { "2" : 5, 7 : 8 },
        "3" : 4
      }
    };
  });

  it("should have same keys", function() {
    var ps1 = ProxyScope.read(root, l2);
    var ps2 = ProxyScope.read(ps1, l3);
    var ps3 = ProxyScope.read(root, l2, l3);

    expect(ps1).to.deep.equal(Object.assign({}, l2, root));
    expect(ps2).to.deep.equal(Object.assign({}, l3, l2, root));
    expect(ps3).to.deep.equal(ps2);
  });

  it("should only update properties of root", function() {
    var ps = ProxyScope.read(root, l2, l3);

    var val = "hallo";

    ps.fu = ps.val = val;

    l3.someprop = "newValue";

    expect(root.fu).to.equal(val);
    expect(root.val).to.equal(val);
    expect(ps.someprop).to.equal(l3.someprop);
  });

  it("should update properties of other scopes", function() {
    var ps = ProxyScope.write(root, l2, l3);

    var val = "hallo";

    ps.val = ps.fu = val;
    delete ps.deep;

    expect(root.fu != val).to.be.true;
    expect(root.value != val).to.be.true;
    expect(l2.fu).to.equal(val);
    expect(l3.val).to.equal(val);
    expect(l3.deep).to.equal(undefined);
  });

  it("should read deep neested objects", function() {
    var ps = ProxyScope.readDeep(root, l2, l3);

    let obj = ps.obj;

    expect(obj["1"]["2"]).to.equal(3);
    expect(obj["4"]).to.equal(5);
    expect(obj["1"]["3"]).to.equal(2);
    expect(obj["3"]).to.equal(4);
    expect(obj["1"]["7"]).to.equal(8);
  });

  it("should write deep nested objects", function() {
    var ps = ProxyScope.writeDeep(root, l2, l3);

    let obj = ps.obj["1"];

    obj["4"] = 0;
    obj["2"] = 0;
    obj["3"] = 0;
    obj["7"] = 0;

    expect(root.obj["1"]["2"]).to.equal(0);
    expect(root.obj["1"]["4"]).to.equal(0);
    expect(l2.obj["1"]["3"]).to.equal(0);
    expect(l3.obj["1"]["7"]).to.equal(0);
  })

})
