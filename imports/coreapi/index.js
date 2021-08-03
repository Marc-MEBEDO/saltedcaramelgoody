export var moduleStores = {};

/**
 * Gibt den Store/Collection für das angegebene Modul zurück
 * 
 * @param {String} mod Name des Modul, für den der Store (Collection) ermittelt werden soll
 * @returns {Object} Mongo.Collection
 */
export const getModuleStore = moduleId => {
    let moduleStore = moduleStores[moduleId];
        
    if (!moduleStore) {
        moduleStores[moduleId] = new Mongo.Collection(moduleId);
        moduleStore = moduleStores[moduleId];
    }

    return moduleStore;
}