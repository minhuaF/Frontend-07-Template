const CSSParser = require('./CSSParser');
const layout = require('./layout.js');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

// 从标签构建DOM树使用的数据结构是栈
let stack = [{
  type: 'document',
  children: []
}]

function emit(token) {
  console.log('===token',token)

  let top = stack[stack.length - 1];

  if(token.type === 'startTag') {
    // 遇到开始标签 创建元素并入栈
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName;

    for(let p in token) {
      if(p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    // 当创建一个元素后，立刻计算css规则
    // 1. stack.slice() stack是动态的，.slice() 直接复制出来
    // 2. .reverse() 是由于要找的父级元素，从后往前找比较高效
    CSSParser.computeCSS(stack.slice().reverse(), element)

    // 建立父子关系，任何元素父元素是它入栈前的栈顶
    top.children.push(element);
    element.parent = top;

    if(!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if(token.type === 'endTag') {
    // 遇到结束标签出栈
    if(top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // ++++++++ 遇到style标签时，执行添加css规则的操作++++++++ //
      if(top.tagName === 'style') {
        CSSParser.addCSSRules(top.children[0].content)
      }
      layout(top);
      stack.pop()
    }

    currentTextNode = null;
  } else if( token.type === 'text'){
    // 多个文本节点需要合并
    if(currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode)
    }

    currentTextNode.content += token.content;
  }

}

/**
 * 使用FSM来实现HTML的分析
 */
const EOF = Symbol('EOF');

function data(str){
  if(str === '<') {
    return tagOpen
  } else if(str === EOF) {
    emit({
      type: "EOF"
    })
    return;
  } else {
    emit({
      type: "text",
      content: str
    })
    return data
  }
} 

/**
 * 解析标签
 * 1. 开始标签
 * 2. 结束标签
 * 3. 自封闭标签
 */

function tagOpen(str) {
  if(str === '/') {
    return endTagOpen;
  } else if(str.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(str)
  } else {
    return ;
  }
}

function endTagOpen(str) {
  if(str.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(str)
  } else if(str === '>') {
    // error
  } else if(str === EOF) {
    // error
  } else {

  }
}

function tagName(str) {
  if(str.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(str === '/') {
    return selfClosingStartTag
  } else if(str.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += str
    return tagName
  } else if( str === '>') {
    emit(currentToken)
    // 解析下一个标签
    return data
  } else {
    return tagName
  }
}

/**
 * 处理标签属性
 */
function beforeAttributeName(str) {
  if(str.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(str === '>' || str === '/' || str === EOF) {
    return afterAttributeName(str)
  } else if(str === '=') {

  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(str)
  }
}

function afterAttributeName(str) {
  if(str.match(/^[\t\n\f ]/)) {
    return beforeAttributeName
  } else if( str === '/') {
    return selfClosingStartTag
  } else if(str === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken);
    return data
  } else if(str === EOF) {

  } else {
    currentAttribute.value += str;
    return beforeAttributeValue
  }
}

function attributeName(str){
  // 1. <div class="main" >xxx</div>
  // 2. <div class="main">xxx</div>
  // 3. <div class="main"/>
  if(str.match(/^[\t\n\f ]$/) || str === '/' || str === '>' || str === EOF) {
    return afterAttributeName(str)
  } else if(str === '=') {
    return beforeAttributeValue
  } else if(str === "\u0000") {

  } else if(str === "\"" || str === "'" || str === '<') {

  } else {
    currentAttribute.name += str;
    return attributeName;
  }
}

function beforeAttributeValue(str) {
  if(str.match(/^[\t\n\f ]$/) || str === "/" || str === ">" || str === EOF) {
    return beforeAttributeValue;
  } else if(str === '\"') {
    return singleQuotedAttributeValue;
  } else if(str === '\"') {
    return doubleQuotedAttributeValue;
  } else if(str === '>') {
    
  } else {
    return UnquotedAttributeValue(str)
  }
}

function UnquotedAttributeValue(str) {
  if(str.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName
  } else if(str === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if(str === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if( str === "\u0000") {

  } else if(str === '\"' || str ==="'" || str === "<" || str === "=") {

  } else if( str === EOF) {

  } else {
    currentAttribute.value += str;
    return UnquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(str) {
  if(str === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if(str === "\u0000") {

  } else if(str === EOF) {

  } else {
    currentAttribute.value += str;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(str) {
  if(str.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if(str === '/') {
    return selfClosingStartTag
  } else if(str === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data
  } else if (str === EOF) {

  } else {
    currentAttribute.value += str;
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(str) {
  if(str === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue
  } else if(str === "\u0000") {

  } else if(str === EOF) {

  } else {
    currentAttribute.value += str;
    return doubleQuotedAttributeValue
  }
}

function selfClosingStartTag(str) {
  if(str === '>') {
    currentToken.isSelfClosing = true; 
    emit(currentToken)
    return data;
  } else if(str === 'EOF') {
    // error
  } else {
    
  }
}


module.exports.parserHTML = function parseHTML(html) {
  console.log('====html', html)
  let state = data
  for(let str of html) {
    state = state(str)
  }
  state = state(EOF);
  console.log('===stack', stack[0])
}