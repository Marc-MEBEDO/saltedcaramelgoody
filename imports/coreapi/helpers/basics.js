/**
 * Tests if given Value is an Object or not
 * 
 * @param {Any} val Value to test
 * @returns {Boolean} True if given Value is an Object otherwise false
 */
export const isObject = val => {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

/**
 * Tests if given Value is a Boolean or not
 * 
 * @param {Any} val Value to test
 * @returns {Boolean} True if given Value is an Object otherwise false
 */
export const isBoolean = val => {
    return (val === true || val === false);
}


/**
 * Tests if given Value is a Numeric value or not
 * 
 * @param {Any} val Value to test
 * @returns {Boolean} True if given Value is Numeric otherwise false
 */
export const isNumeric = val => {
    return (typeof val === 'number');
}


/**
 * Will debounce the give function
 * 
 * @param {Function} func callback that will be called after debounce is over
 * @param {Interger} wait Time to wait in ms
 * @param {Boolean} immediate If true the callback will be immediate called
 */
export const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


/**
 * Replaces all regexp reserved chars
 * 
 * @param {String} text Text to escape
 * @returns {String} Escaped text
 */
export const escapeRegExp = text => {
	return text.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}