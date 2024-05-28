const regularExpressions = {
    whiteSpaces: /\s/,
    onlyNumbers: /^\d+(\.\d+)?$/,
    aToZ: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
    isDate: /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/
}

export const isInputEmpty = (input) => {
    if (input.length == 0) {
        return true;
    }
    return false;
}

export const isInputWithWhiteSpaces = (input) => {
    const { whiteSpaces } = regularExpressions;

    if (whiteSpaces.test(input)) {
        return true;
    } else {
        false;
    }
}

export const isNotNumber = (input) => {
    const { onlyNumbers } = regularExpressions;

    if (!onlyNumbers.test(input)) {
        return true;
    } else {
        return false;
    }
}

export const isNotAToZ = (input) => {
    const { aToZ } = regularExpressions;

    if (!aToZ.test(input)) {
        return true;
    } else {
        return false;
    }
}

export const isNotDate = (input) => {
    const { isDate } = regularExpressions;

    if (!isDate.test(input)) {
        return true
    } else {
        return false;
    }
}
