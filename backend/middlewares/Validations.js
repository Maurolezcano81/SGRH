const regularExpressions = {
    whiteSpaces: /\s/,
    onlyNumbers: /^\d+(\.\d+)?$/,
    aToZ: /^[A-Za-zñÑ\/]+(?: [A-Za-zñÑ\/]+)*$/,
    isDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
}

export const isInputEmpty = (input) => {
    if (input.length == 0) {
        return true;
    }
    return false;
}

export const formatDateYear = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
};

export const formatYearMonth = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}` || `-`;
};

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
