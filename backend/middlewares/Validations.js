const regularExpressions = {
    whiteSpaces: /\s/,
}

export const isInputEmpty = (input) =>{
    if(input.length == 0){
        return true;
    }
    return false;
}

export const isInputWithWhiteSpaces = (input) =>{
    const {whiteSpaces} = regularExpressions;

    if(whiteSpaces.test(input)){
        return true;
    } else{
        false;
    }
}
