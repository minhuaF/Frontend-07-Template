var assert = require('assert');

import { parseHTML } from '../src/parser.js';

describe('parse html:', function() {
  it('<br />', function() {
    let tree = parseHTML('<br />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<div></div>', function() {
    let tree = parseHTML('<div></div>');
    assert.equal(tree.children[0].tagName, 'div');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<a href="//time.geekbang.org"></a>', function() {
    let tree = parseHTML('<a href="//time.geekbang.org"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<a href="//time.geekbang.org" target="_block"></a>', function() {
    let tree = parseHTML('<a href="//time.geekbang.org" target="_block"></a>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div data-id="123" data-order="1"></div>', function() {
    let tree = parseHTML('<div data-id="123" data-order="1"></div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  // it('<div id=\'123\' />', function() {
  //   let tree = parseHTML('<div id=\'123\' />');
  //   console.log('tree', tree)
  //   assert.equal(tree.children.length, 1);
  //   assert.equal(tree.children[0].children.length, 0);
  // })
  it('<div id=123 />', function() {
    let tree = parseHTML('<div id=123 />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div id=123/>', function() {
    let tree = parseHTML('<div id=123/>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div id=123></div>', function() {
    let tree = parseHTML('<div id=123></div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div data-copy-plugin></div>', function() {
    let tree = parseHTML('<div data-copy-plugin></div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div data-copy-plugin data-name></div>', function() {
    let tree = parseHTML('<div data-copy-plugin data-name></div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div><p>children</p></div>', function() {
    let tree = parseHTML('<div><p>children</p></div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 1);
  })
  it('<div /> name', function() {
    let tree = parseHTML('<div /> name');
    assert.equal(tree.children.length, 2);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<DIV />', function() {
    let tree = parseHTML('<DIV />');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
  it('<div class="main" >xxx</div>', function() {
    let tree = parseHTML('<div class="main" >xxx</div>');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 1);
  })
  it('<>', function() {
    let tree = parseHTML('<> ');
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, 'text');
  })
  it("<a id='abc'/>", function() {
    let tree = parseHTML("<a id='abc'/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  })
})