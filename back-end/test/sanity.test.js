const { expect } = require("chai");

describe("sanity test", function () {
  it("checks to see if mocha and chai are working", function () {
    expect(2 + 2).to.equal(4);
  });
});