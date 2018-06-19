/**
 * This file should be placed at the node_modules sub-directory of the directory where you're
 * executing it.
 *
 * Written by Fernando Castor in November/2017.
 */

exports.solve = function(fileName) {
  let formula = readFormula(fileName)
  let result = doSolve(formula.clauses, formula.variables)
  return result // two fields: isSat and satisfyingAssignment
}

 

 // NAO DELETAR 
/*function nextAssignment(currentAssignment) { //Menos uso de memoria, mas aparentemente mais lento
  var valores = currentAssignment.join('');
  valores = parseInt(valores, 2)
  valores++
  valores = valores.toString(2)
  //console.log(valores)
  valores = valores.split('')
  valores.map(Number)
  //console.log(valores)
  var newAssignment = []
  newAssignment.length = currentAssignment.length - valores.length;
  newAssignment.fill(0)
  for (var i = 0; i < (currentAssignment.length -(currentAssignment.length - valores.length)); i++ ){
    newAssignment.push(parseInt(valores[i], 10))
  }
  console.log(newAssignment)
  return newAssignment
}*/

function nextAssignment(currentAssignment){ // Maior consumo de memoria, porém aparentemente mais rápido
  var index = currentAssignment.length - 1
  return somar(currentAssignment, index)
}
 
 
 
function somar(currentAssignment, index){
    if(currentAssignment[index] == 0){
      currentAssignment[index] = 1
      return currentAssignment
    }else if(index != 0){
      currentAssignment[index] = 0;
      index--;
      return somar(currentAssignment, index)
    }else if(index == 0 && currentAssignment[index] == 1){
      return currentAssignment;
    }
  }
 
 
function doSolve(clauses, assignment) {
  let isSat = false
  var p = 0
  while ((!isSat) && p < Math.pow(2, assignment.length) - 1){
      var correct = checkSat(clauses, assignment)
      if ((correct)){
          isSat = true
      }else {
        //console.log("proxima")
      assignment = nextAssignment(assignment)
      }
      p++;
  }
  let result = {'isSat': isSat, satisfyingAssignment: null}
  if (isSat) {
    result.satisfyingAssignment = assignment
  }
  return result
}
 
function readFormula(fileName) {
    var fs = require('fs')
    let textraw = fs.readFileSync(fileName,"utf8")
    var text = textraw.split('\n')
  let clauses = readClauses(text, 0, [])
  let variables = readVariables(clauses)

  let specOk = checkProblemSpecification(text, clauses, variables)

  let result = { 'clauses': [], 'variables': [] }
  if (specOk) {
    result.clauses = clauses
    result.variables = variables
  }

  return result
}
function specOk(text, clauses, variables) {
 
 
}  
function readClauses(lines, n, arrayClauses){
    if (lines.length > n){
    if (lines[n].charAt(0) == 'c'){
        return readClauses(lines, ++n, arrayClauses)
    }
    else if (lines[n].charAt(0) == 'p'){
        return readClauses(lines, ++n, arrayClauses)
    }else if(lines[n].charAt(0) != 'p' && lines[n].charAt(0) != 'c'){
        var temp = lines[n].split(' ')
        if (temp.length > 1 && temp[temp.length - 1] == 0){
        arrayClauses.push(temp)
      }
        return readClauses(lines, ++n, arrayClauses)
    }
    }
    
       arrayClauses = limpar(arrayClauses)
        return arrayClauses;
}
function readVariables(clauses){
    var o = 1;
    var arrayVariables = []
    for (var n = 0; n < clauses.length; n++){
        for (var p = 0; p < clauses[n].length; p++){
            if(Math.abs(clauses[n][p]) == o){
                o++;
                n = 0;
                p = 0;
                arrayVariables.push(0)
            }
        }
    }
    return arrayVariables
   
}
function checkProblemSpecification(text, clauses, variables){
    for (var n = 0; text.length > n; n++){
        if (text[n].charAt(0) == 'p'){
            var temp = text[n].split(' ')
            if(clauses.length == temp[3] && variables.length == temp[2]){
                return true
            }else {
                return false
            }
        }
    }
}
function checkSat(clauses, assignment){
    let p = 0;
    let checkSatSup2 = 0;
 
    while(p < clauses.length ){//Main loop
        for(let i = 0; i < (clauses[p].length - 1); i++){//Aqui é menos 1 para nao chegar no 0
            if(checkSatSup2 == 0){
            let x = parseInt(clauses[p][i], 10);
            let xAbsSlot = Math.abs(x) - 1;
            if (x < 0){
                if(assignment[xAbsSlot] == 0){//Quer dizer que é 1 ou true
                    checkSatSup2++;
                }
            }else{
                if(assignment[xAbsSlot] == 1){//Quer dizer que é 1 ou true
                    checkSatSup2++;
                }
            }
        }
    }
        if (checkSatSup2 == 0){
            return false
        }else{
        checkSatSup2 = false;
        p++
        }
    }
    return true
}
function limpar (clauses) {
  var clausesLimpas = new Array()
  for (var u = 0; u < clauses.length;u++){
    var temp = new Array()
   
  for (var p = 0; p < clauses[u].length;p++){
    if(clauses[u][p] != '')
      temp.push(clauses[u][p])
  }
  clausesLimpas.push(temp)
}
  for(let k = 0; k<clausesLimpas.length;k++){
    if(clausesLimpas[k].length == 0){
      clausesLimpas.splice(k, 1)
    }
  }
  return clausesLimpas
}