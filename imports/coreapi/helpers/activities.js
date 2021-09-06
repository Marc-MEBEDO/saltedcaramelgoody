function arrayToText(a) {
    if (a.length <= 2) {
        return a.join(' und ');
    } else {
        return a.slice(0, -1).join(', ') + ' und ' + a[a.length-1];
    }
}

/**
 * Determine changes between old and newData object by the given propList
 * and returns an Array of changes
 * 
 * @param {Object}  param0.propList Object that lists all props to determine "propName: { what, msg }"
 *                  param0.data Dataobject with the new data to inspect
 *                  param0.oldData Dataobject with the old data
 * @returns {Array} Array of Objects { what, message, propName, oldValue, newValue }
 */
export const determineChanges = ( fieldList, data, oldData ) => {
    let changes = [];

    const fields = Object.keys(fieldList);
    fields.forEach( pn => {
        const { namesAndMessages } = fieldList[pn];
        //const { mitArtikel, messages } = namesAndMessages.singular;

        if (data[pn] !== undefined && data[pn] !== oldData[pn]) {
            changes.push({
                what: namesAndMessages.messages.onUpdate,
                message: `${namesAndMessages.singular.mitArtikel} wurde geändert.`,
                propName: pn,
                oldValue: oldData[pn],
                newValue: data[pn]
            });
        }
    });

    if (changes.length == 0) 
        return null;

    return {
        message: "hat " + arrayToText(changes.map( ({ what }) => what)) + " geändert.",
        changes
    }
}