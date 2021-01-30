/**
 * 在一个字符串中，找到字符串“a"
 */
function findA(input) {
 for(let str of input) {
   if(str === 'a'){
     return true;
   }
 }
 return false
}
console.log('===findA', findA('dsfd'))


function findAB(input) {
  let findA = false;
  for(let str of input) {
    if(str === 'a') {
      findA = true;
    } else if(findA === true && str === 'b') {
      return true;
    } else {
      findA = false;
    }
  }
  return false;
}

console.log('===findAB', findAB('I am ab'))

function findABCDEF(input) {
  let findA = false;
  let findB = false;
  let findC = false;
  let findD = false;
  let findE = false;
  for( let str of input) {
    if(str === 'a') {
      findA = true;
    } else if(findA && str === 'b'){
      findB = true;
    } else if(findB && str === 'c') {
      findC = true;
    } else if(findC && str === 'd') {
      findD = true;
    } else if(findD && str === 'e') {
      findE = true;
    } else if(findE && str === 'f') {
      return true;
    } else {
      findA = false;
      findB = false;
      findC = false;
      findD = false;
      findE = false;
    }
  }

  return false;
}

console.log('===findABCDEF', findABCDEF('I am abcdef'));

function demo3(input) {

  function find(input) {
    let state = start;
    for (let str of input) {
      state = state(str)
    }
    return state === end;
  }
  
  function start(str){
    if(str === 'a') {
      return findA
    }
    return start(c);
  }

  function findA(str) {
    if(str === 'b') {
      return findB
    }
    return start(c);
  }
  function findB(str) {
    if(str === 'c') {
      return findC
    }
    return start(c);
  }
  function findC(str) {
    if(str === 'd') {
      return findD
    }
    return start(c);
  }
  function findD(str) {
    if(str === 'e') {
      return findE
    }
    return start(c);
  }
  function findE(str) {
    if(str === 'f') {
      return findF
    }
    return start(c);
  }
  function findF(str) {
    if(str === 'f') {
      return end
    }
    return start(c);
  }
  
  function end() {
    return end;
  }

  find(input)
}


function findABCABX(input) {
  function find(input) {
    let state = start;
    for(let str of input) {
      state = state(str)
    }
    return state === end;
  }

  function start(str) {
    if(start === 'a') {
      return findA
    } else {
      return start(str)
    }
  }

  function findA(str) {
    if(str === 'b') {
      return findB
    } else {
      return start(str)
    }
  }

  function findB(str) {
    if(str === 'c') {
      return findC
    } else {
      return start(str)
    }
  }

  function findC(str) {
    if(str === 'a') {
      return findA2
    } else {
      return start(str)
    }
  }

  function findA2(str) {
    if(str === 'b') {
      return findB2
    } else {
      return start(str)
    }
  }

  function findB2(str) {
    if(str === 'x') {
      return end
    } else {
      return findB(c)
    }
  }

  function end() {
    return end;
  }
}


function findABABABX(strings) {
  function find(input) {
    let state = start;
    for (let str of input) {
      state = state(str)
    }
    return state === end;
  }

  function start(str) {
    if(str === 'a') {
      return findB
    } else {
      return start
    }
  }

  function findB(str) {
    if(str === 'b') {
      return findA2
    } else {
      return start(str)
    }
  }

  function findA2(str) {
    if(str === 'a') {
      return findB2
    } else {
      return start(str)
    }
  }

  function findB2(str) {
    if(str === 'b') {
      return findA3
    } else {
      return start(str)
    }
  }

  function findA3(str) {
    if(str === 'a') {
      return findB3
    } else {
      return start(str)
    }
  }

  function findB3(str) {
    if(str === 'b') {
      return findX
    } else {
      return start(str)
    }
  }

  function findX(str) {
    if(str === 'x') {
      return end
    } else {
      return findA2(str)
    }
  }

  function end() {
    return end;
  }

  return find(strings)
}

console.log('====findABABABX', findABABABX('adababc'))
