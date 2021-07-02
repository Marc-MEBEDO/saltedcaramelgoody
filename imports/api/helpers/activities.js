/**
 * Determine changes between old and newData object by the given propList
 * and returns an Array of changes
 * 
 * @param {Object}  param0.propList Object that lists all props to determine "propName: { what, msg }"
 *                  param0.data Dataobject with the new data to inspect
 *                  param0.oldData Dataobject with the old data
 * @returns {Array} Array of Objects { what, message, propName, oldValue, newValue }
 */
export const determineChanges = ( { propList, data, oldData } ) => {
    let changes = [];

    const properties = Object.keys(propList);
    properties.forEach( pn => {
        const { what, msg } = propList[pn];

        if (data[pn] !== undefined && data[pn] !== oldData[pn]) {
            changes.push({
                what,
                message: msg,
                propName: pn,
                oldValue: oldData[pn],
                newValue: data[pn]
            });
        }
    });

    return {
        message: "hat " + changes.map( ({ what }) => what).join(', ') + " geändert.",
        changes
    }
}