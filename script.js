var registerValues = [0, 0, 0, 0, 0, 0, 0, 0];
var MAX_INSTRUCTIONS = 20; // we have a max of 16 instructions, change if you'd like more
var MAX_LOOPS = 1000; // Sets an upper limit to number of loops allowed. Stops infinite loops
var pc = 0;

// Makes memory (RAM) that is 2^address width (16 for danmips)
var memoryValues = new Array(Math.pow(2, 10)).fill(0);
var inputCode = document.querySelector("#code-input");

// Get <p> elements for updating
console.log("Loaded")

var poutputs = new Array();
poutputs.push(document.querySelector('#zero'));
poutputs.push(document.querySelector('#t1'));
poutputs.push(document.querySelector('#t2'));
poutputs.push(document.querySelector('#t3'));
poutputs.push(document.querySelector('#t4'));
poutputs.push(document.querySelector('#t5'));
poutputs.push(document.querySelector('#t6'));
poutputs.push(document.querySelector('#t7'));

var get16bitBinary = function(value){
  let result = value.toString(2);
  while (result.length < 16){
    result = "0" + result;
  }
  return result;
}

// R-type operations ///////////////////////////////////////////////
var add = function(regDesIdx, reg1Idx, reg2Idx) {
  if (regDesIdx === 0) return;
  registerValues[regDesIdx] = registerValues[reg1Idx] + registerValues[reg2Idx];
}

var sub = function(regDesIdx, reg1Idx, reg2Idx) {
  if (regDesIdx === 0) return;
  registerValues[regDesIdx] = registerValues[reg1Idx] - registerValues[reg2Idx];
}

var and = function(regDesIdx, reg1Idx, reg2Idx) {
  if (regDesIdx === 0) return;
  // First get the binary repr of the numbers
  let reg1val = get16bitBinary(registerValues[reg1Idx]);
  let reg2val = get16bitBinary(registerValues[reg2Idx]);

  console.log(reg1val);
  console.log(reg2val);

  let result = '';
  for (let i = 0; i < reg1val.length; i++) {
    if (reg1val[i] === '1' && reg2val[i] === '1'){
      result += '1';
    }
    else{
      result += '0';
    }
  }
  // Convert from binary back to a base10 number
  let finalResult = parseInt(result, 2);
  registerValues[regDesIdx] = finalResult;
}

var or = function(regDesIdx, reg1Idx, reg2Idx) {
  if (regDesIdx === 0) return;
  // First get the binary repr of the numbers
  let reg1val = get16bitBinary(registerValues[reg1Idx]);
  let reg2val = get16bitBinary(registerValues[reg2Idx]);

  console.log(reg1val);
  console.log(reg2val);

  let result = '';
  for (let i = 0; i < reg1val.length; i++) {
    if (reg1val[i] === '1' || reg2val[i] === '1'){
      result += '1';
    }
    else{
      result += '0';
    }
  }
  // Convert from binary back to a base10 number
  let finalResult = parseInt(result, 2);
  registerValues[regDesIdx] = finalResult;
}

var setLessThan = function(regDesIdx, reg1Idx, reg2Idx) {
  if (regDesIdx === 0) return;
  if (registerValues[reg1Idx] < registerValues[reg2Idx]) registerValues[regDesIdx] = 1;
  else registerValues[regDesIdx] = 0;
}


// I type instructions ////////////////////////////////////////////
var loadWord = function(regDesIdx, regMemAddr, immediateVal){
  if (regDesIdx === 0) return;
  // Get the value from memory at regMemAddr with the offset of the immediate value
  value = memoryValues[regMemAddr + immediateVal];
  registerValues[regDesIdx] = value;
}

var storeWord = function(regDesAddr, regVal, immediateVal){
  // Set the value at regDesAddr with offset immediateVal to regVal
  memoryValues[regDesAddr + immediateVal] = registerValues[regVal];
}

var branchOnEqual = function(reg1Idx, reg2Idx, branchLoc, pc){
  if (registerValues[reg1Idx] === registerValues[reg2Idx]){ 
    console.log(`Branching to line ${branchLoc}`);  
    return branchLoc;
  }
  else return pc;
}

var addImmediate = function(regDesIdx, regIdx, immediateVal){
  if (regDesIdx === 0) return;
  registerValues[regDesIdx] = registerValues[regIdx] + immediateVal;
}



var updateRegisters = function(){
  // Largest 16 bit number is 6 digits
  for (const [indx, val] of poutputs.entries()) {
    val.textContent = `$${indx}: ${get16bitBinary(registerValues[indx])} | ${registerValues[indx]}`;
  }
}

// On Click for when we should run
var runcode = function() {
  console.log("This is running");
  // Resets register values
  registerValues.fill(0);
  let regDes, reg1, reg2, immediate, loc;
  
  // Gets each line of code, and removes commas as a convenience
  let lines = inputCode.value.split('\n');
  let loopCount = 0;
  pc = 0;
  while (pc < MAX_INSTRUCTIONS && loopCount < MAX_LOOPS && pc < lines.length){
    loopCount += 1;
    updateRegisters();
    // Get current instruction
    currentLine = lines[pc].replace(/,/g, '').trim().split(' ');
    console.log(`Executing line ${pc}`);

    switch(currentLine[0]){
      case('add'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
        add(regDes, reg1, reg2);
        break;
      case('sub'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
        sub(regDes, reg1, reg2);
        break;
      case('and'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
        and(regDes, reg1, reg2);
        break;
      case('or'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
        or(regDes, reg1, reg2);
        break;
      case('slt'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
        setLessThan(regDes, reg1, reg2);
        break;
      case('lw'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        immediate = Number.parseInt(currentLine[3].replace('$t', ''));
        loadWord(regDes, reg1, immediate/4);
        break;
      case('sw'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        immediate = Number.parseInt(currentLine[3].replace('$t', ''));
        storeWord(regDes, reg1, immediate/4);
        break;
      case('beq'):
        reg1 = Number.parseInt(currentLine[1].replace('$t', ''));
        reg2 = Number.parseInt(currentLine[2].replace('$t', ''));
        loc = lines.indexOf(currentLine[3]);
        pc = branchOnEqual(reg1, reg2, loc, pc);
        break;
      case('j'):
        pc = lines.indexOf(currentLine[1]);
        break;
      case('addi'):
        regDes = Number.parseInt(currentLine[1].replace('$t', ''));
        reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
        immediate = Number.parseInt(currentLine[3].replace('$t', ''));
        addImmediate(regDes, reg1, immediate);
        break;
      default:
        break;
    }
    pc++;
    
  }
  updateRegisters();
}

var getNbitBinary = function(num, bits){
  let result = num.toString(2);
  while (result.length < bits){
    result = "0" + result;
  }
  return result;
}

var convertLineToBinary = function(line, lineNumber){
  currentLine = line.replace(/,/g, '').trim().split(' ');
  let binaryOut = "";
  switch(currentLine[0]){
    // RTYPE
    case('add'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0000";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += "010";
      break;
    case('sub'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0000";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += "110";
      break;
    case('and'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0000";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += "000";
      break;
    case('or'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0000";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += "001";
      break;
    case('slt'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0001";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += "111";
      break;
    // I TYPE ////////////////
    case('lw'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      immediate = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0010";
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(immediate, 6);
      binaryOut += "010";
      break;
    case('sw'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      immediate = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0011";
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(immediate, 6);
      binaryOut += "010";
      break;
    case('beq'):
      reg1 = Number.parseInt(currentLine[1].replace('$t', ''));
      reg2 = Number.parseInt(currentLine[2].replace('$t', ''));
      loc = lines.indexOf(currentLine[3]);
      difference = (lineNumber - loc) // This gets the number of lines we should move back, with the modification to make it 4
      binaryOut += "0100";
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(reg2, 3);
      binaryOut += getNbitBinary(difference, 6);
      binaryOut += "110";
      break;
    case('j'):
      loc = lines.indexOf(currentLine[1]);
      difference = (lineNumber - loc);
      binaryOut += "0101";
      binaryOut += getNbitBinary(difference, 12);
      break;
    case('addi'):
      regDes = Number.parseInt(currentLine[1].replace('$t', ''));
      reg1 = Number.parseInt(currentLine[2].replace('$t', ''));
      immediate = Number.parseInt(currentLine[3].replace('$t', ''));
      binaryOut += "0111";
      binaryOut += getNbitBinary(regDes, 3);
      binaryOut += getNbitBinary(reg1, 3);
      binaryOut += getNbitBinary(immediate, 6);
      binaryOut += "010";
      break;
    default:
      break;
  }
  return binaryOut;
}

var convertCommandsToBinary = function(){
  let lines = inputCode.value.split('\n');
  let ul = document.querySelector("#binaryOutput");
  ul.innerHTML = ''; // Remove old output
  for (const [indx, val] of lines.entries()) {
    let lineBinary = convertLineToBinary(val, indx);
    if (lineBinary.length < 3) continue;
    let li = document.createElement('li');
    li.textContent = lineBinary;
    ul.appendChild(li);
    //ul.insertBefore(li, ul.firstChild);
  }
}