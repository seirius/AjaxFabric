function isFunction(element) {
    var getType = {};
    return element && getType.toString.call(element) === '[object Function]';
}

function isUndefined(element) {
    return typeof element === "undefined";
}

function isObject(element) {
    return typeof element === "object";
}

function isBoolean(element) {
    return typeof element === "boolean";
}

function isString(element) {
    return typeof element === "string";
}

function isEmpty(element) {
    if (typeof element === "undefined" || element === null || element === "") {
            return true;
    } else {
            return false;
    }
}