//Null Parser
const nullParser = (data) => data.indexOf("null") !== 0 ? null : [null, data.slice(4)]

//Boolean Parser
const booleanParser = (data) => {
  if( data.indexOf("true") === 0 ) return ([true, data.slice(4,data.length)]);
  if( data.indexOf("false") === 0 )  return ([false, data.slice(5,data.length)]);
  return null;
}
//Number Parser
const numberParser = (data) => {
  let result = /[-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(data);
  if ( result != null && result.index === 0) return ([Number(result[0]), data.trim().slice(result[0].length)]);
  return null;
}
//String Parser
const stringParser = (data) => {
  let i = 1, internal = '', extra = 0;
  if( data[0] === '"'){
      while( i < data.length ){
    if( data[i] === '"' && data[i-1] != '\\')  return [internal, data.slice(internal.length + extra+2)];
    if( data[i] != '\\' ) internal = internal.concat(data[i]);
    else if( data[i] === '\\' ){
      switch (data[i+1]){
        case '\\' : internal += '\\'; extra++; break;
        case '"' : internal += '\"'; extra++; break;
        case '/' : internal += '\/'; extra++; break;
        case 'b' : internal += '\b'; extra++; break;
        case 'f' : internal += '\f'; extra++; break;
        case 'n' : internal += '\n'; extra++; break;
        case 'r' : internal += '\r'; extra++; break;
        case 't' : internal += '\t'; extra++; break;
        case 'u' : internal += String.fromCharCode(parseInt(data.slice(i+2,i+6), 16)); extra += 5; i += 4; break;
        default : return null;
      }//end of switch
      i++;
    }//end of elseif
    else return null;
    i++;
  }//end of while
    if( internal[internal.length-1] != '"' )  return null;
    return [internal, data.slice(internal.length + extra+2)];
  }//end of first if
  else return null;
}//end of stringParser
//Array Parser
const arrayParser = (data) => {
  let i = 0, intermediate =  [], result = [];
  while( data != '' ){
  if( data[i] === '[' ){
    if( data[i+1] === ',') return null;
    else if( data[i+1] === ']' ) return [result, data.slice(i+2)];
    else{
        intermediate =  parsingLegend(data.slice(i+1));
        if( intermediate === -1 )  return null;
        result.push(intermediate[0]);
      }
  }
  else if( data[i] === ',' ){
    if( data[i+1] === ']' )  return null;
    else if( data[i+1] === ',' ) return null;
    else{
        intermediate =  parsingLegend(data.slice(i+1));
        if( intermediate === -1 )  return null;
        result.push(intermediate[0]);
    }
  }
  else if( data[i] === ']' ) return [result, data.slice(i+1)];
  else return null;
  data = intermediate[1];
}//end of while loop
  return [result, ''];
}//end of arrayParser
//Object Parser
const objectParser = (data) => {
  let result = {}, name = [], value = [], i = 0;
  while( data != '' ){
    if( data[i] === '{' ){
      if( data[i+1] === ':' || data[i+1] === ',' )  return null;
      if( data[i+1] === '}' )  return [result, data.slice(i+2)];
      name =  stringParser(data.slice(i+1));
      if( name === null || name[1][0] != ':' ) return null;
      value =  parsingLegend(name[1].slice(1));
      if( value === -1 ) return null;
      result[name[0]] = value[0];
    }
    else if( data[i] === ',' ){
      if( data[i+1] === ':' || data[i+1] === ',' || data[i+1] === '}' )  return null;
      name =  parsingLegend(data.slice(i+1));
      if( name === null || name[1][0] != ':' ) return null;
      value =  parsingLegend(name[1].slice(1));
      if( value === -1 ) return null;
      result[name[0]] = value[0];
    }
    else if( data[i] === '}' ) return [result, data.slice(i+1)];
    else return null;
    data = value[1];
  }//end of while loop
  return [result, ''];
}//end of Object Parser
//removing all white spaces (except in string!)
function eliminatingSpace( data ){
  let array = data.split(""), quoteCount = 0;
  for( let i = 0; i < array.length; i++ ){
    if( (array[i] === ' ' || array[i] === '\n' || array[i] === '\t') && quoteCount % 2 === 0 ){
      array.splice(i,1);
      i--;
    }
    else if( array[i] === '"' && array[i-1] != '\\' ) quoteCount++;
  }//end of for loop
  data = array.join("");
  return data;
}
//Factory parser function
function  parsingLegend( data ){
  data = eliminatingSpace(data.trim()); let result;
  if( data[0] === 'n' ){
    if( (result = nullParser(data)) != null ) return result;
  }
  else if( data[0] === 't' || data[0] === 'f' ){
    if( (result = booleanParser(data)) != null ) return result;
  }
  else if( data[0] === '"' ){
    if( (result = stringParser(data)) != null ) return result;
  }
  else if( data[0] === '[' ){
    if( (result =  arrayParser(data)) != null ) return result;
  }
  else if( data[0] === '{' ){
    if( (result = objectParser(data)) != null ) return result;
  }
  else if( (result = numberParser(data)) != null ) return result;
  return -1;
}

//**********DO NOT DISTURB THE ABOVE CODE**********//
//Replace /*Your Input JSON*/ with your input - Happy Parsing ;-)
let parsedResult;
parsedResult = parsingLegend('   /*Your Input JSON*/   ');

/*
Or if you have a file to be parsed, uncomment the following lines
and
specify the path of the file in the argument below
*/

//const fs = require('fs')
//let data = fs.readFileSync('/home/vinayakrugvedi/Desktop/Geekskool-BootCamp/Parsers/twitterdata.json')
//let data = fs.readFileSync('test.txt')
//data = data.toString()
//parsedResult = parsingLegend(data);

console.log(parsedResult);

//https://github.com/VinayakRugvedi/Geekskool/blob/master/JSONParser.js
