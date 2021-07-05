export var moduleStores = {};

/**
 * Gibt den Store/Collection für das angegebene Modul zurück
 * 
 * @param {String} mod Name des Modul, für den der Store (Collection) ermittelt werden soll
 * @returns {Object} Mongo.Collection
 */
const getModuleStore = mod => {
    return moduleStores[modName];
}