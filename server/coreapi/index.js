import { Products } from '../../imports/coreapi/collections/products';
import { Mods } from "../../imports/coreapi/collections/mods";
import { Reports } from "../../imports/coreapi/collections/reports";

import { FieldSchema } from '../../imports/coreapi/collections/fields';
import { ActionSchema } from '../../imports/coreapi/collections/actions';
import { moduleStores } from '../../imports/coreapi';

import { Mongo } from 'meteor/mongo';
import { LayoutElementsSchema, LayoutSchema } from '../../imports/coreapi/collections/layout';
import { isFunction } from '../../imports/coreapi/helpers/basics';


/**
 * 
 * @param {*} artikel 
 * @param {*} nameSingular 
 * @param {*} artikelPlural 
 * @param {*} _namePlural 
 * @param {*} param4 
 * @returns 
 */
export const FieldNamesAndMessages = (artikel, nameSingular, artikelPlural, namePlural, { title, onUpdate } = { title: null, onUpdate: null }) => {
    //const namePlural = _namePlural || nameSingular;

    let nam = {
        title: title || nameSingular,

        namesAndMessages: {
            singular: { ohneArtikel: nameSingular, mitArtikel: artikel + ' ' + nameSingular},
            plural: { ohneArtikel: namePlural, mitArtikel: artikelPlural || artikel + ' ' + namePlural},

            messages: {
                onUpdate: onUpdate || (artikel + ' ' + nameSingular)
            }
        }
    }

    return nam;
}

/***
 * Registrieren eines neuen oder bestehenden Reports
 * 
 * @param {Object} r Entsprechender Report, der erstellt/aktualisiert werden soll
 */
export const registerReport = r => {
    const reportId = r._id;
    console.log('Register Report', reportId);
    
    let report = r;

    if (r.columns) {
        r.columns = r.columns.map( col => {
            if (col.render && typeof col.render === 'function') col.render = col.render.toString()
            return col;
        });
    }

    if (r.actions) {
        r.actions = r.actions.map( ac => {
            if (ac.disabled && isFunction(ac.disabled)) ac.disabled = ac.disabled.toString();
            if (ac.visible && isFunction(ac.visible)) ac.visible = ac.visible.toString();

            if (ac.visible && isFunction(ac.visible)) ac.visible = ac.visible.toString();
            if (ac.onExecute && isFunction(ac.onExecute.runScript)) {
                ac.onExecute.runScript = ac.onExecute.runScript.toString();
            }

            return ac;
        })
    }

    if (report.datasource) {
        const methodName = 'reports.' + reportId;
        console.log('Register method for static report', methodName);
        const fnDatasource = report.datasource;

        Meteor.methods({ [methodName]: function(param) {
            param = param || {};
            param.isServer = true
            param.datasource = this;
            param.record = param.record || {};

            const currentUser = Meteor.users.findOne(this.userId);
            param.currentUser = currentUser;

            return fnDatasource.apply(this, [param]);
        }})
        
        r.datasource = report.datasource.toString();
    }

    if (report.liveData) {
        const subscriptionName = 'reports.' + reportId;
        console.log('Register subscription for realtime-report', subscriptionName);
        const fnLiveData = report.liveData;
        Meteor.publish(subscriptionName, function(param) {
            param = param || {};
            param.isServer = true
            param.publication = this;
            param.record = param.record || {};

            const currentUser = Meteor.users.findOne(this.userId);
            param.currentUser = currentUser;

            return fnLiveData.apply(this, [param]);
        });
        
        r.liveData = report.liveData.toString();
    }

    const old = Reports.findOne(reportId);
    if (old) {
        //delete r._id;
        Reports.update(reportId, {
            $set: r
        });
    } else {
        Reports.insert(report);
    }

    // der update/insert löschen das property und somit steht dies an aufrufender stelle nicht
    // mehr zur verfügung obwohl es im Weiteren innerhalb des dashboard-property benötigt wird
    r._id = reportId;
    report._id = reportId;

    console.log(`done. (register Report ${reportId})`);
}


/**
 * Registrieren eines neuen Moduls für diese App
 * 
 * @param {Object} m Entsprechendes Modul, welches registriert werden soll
 */
export const registerModule = m => {
    const moduleId = m._id;

    console.log(`register module ${moduleId}...`);

    // eigenständige Validierung der Felder eines Moduls
    // da dies nicht ohne weiteres per definition im Module-Schema möglich war
    // hierbei wird auch der title gebildet, falls nicht vorhanden
    let fields = Object.keys(m.fields);
    fields.forEach( fieldName => {
        console.log('Validate field ', fieldName);

        let f = m.fields[fieldName];
        // generiere den Titel anhand des Property-Namen
        if (!f.title) {
            let result = fieldName.replace( /([A-Z])/g, ' $1' );
            f.title = result.charAt(0).toUpperCase() + result.slice(1);
        }

        if (f.rules) {
            f.rules = f.rules.map( r => {
                if (r.customValidator) {
                    r.customValidator = r.customValidator.toString();
                }
                return r;
            })
        }
        
        if (f.moduleDetails) {
            if (f.moduleDetails.description) f.moduleDetails.description = f.moduleDetails.description.toString();
            if (f.moduleDetails.imageUrl) f.moduleDetails.imageUrl = f.moduleDetails.imageUrl.toString();
            if (f.moduleDetails.link) f.moduleDetails.link = f.moduleDetails.link.toString();
        }

        if (f.autoValue) f.autoValue = f.autoValue.toString();

        try {
            FieldSchema.validate(f);
        } catch (err) {
            console.log(f);
            console.log(err.message);

            process.exit(1);
        }

        fields[fieldName] = f;
    });

    if (m.actions) {
        let actions = Object.keys(m.actions);
        actions.forEach( actionName => {
            console.log('Validate action ', actionName); 

            let a = m.actions[actionName];
            // generiere den Titel anhand des Property-Namen
            if (!a.title) {
                let result = actionName.replace( /([A-Z])/g, ' $1' );
                a.title = result.charAt(0).toUpperCase() + result.slice(1);
            }
            try {
                ActionSchema.validate(a);
            } catch (err) {
                console.log(a);
                console.log(err.message);

                process.exit(1);
            }

            actions[actionName] = a;
        });
    }

    if (m.layouts) {
        let layouts = Object.keys(m.layouts);
        layouts.forEach( layoutName => {
            console.log('Validate layout ', layoutName);

            let l = m.layouts[layoutName];
            
            if (!l.title) {
                let result = actionName.replace( /([A-Z])/g, ' $1' );
                l.title = result.charAt(0).toUpperCase() + result.slice(1);
            }

            const validateLayoutElements = elements => {
                elements = elements.map( elem => {
                    if (!elem.title && elem.field) {
                        // wenn kein Titel vorhanden, dann nehmen wir den Feldtitel
                        if (!m.fields[elem.field]) {
                            throw new Error(`Das Feld '${elem.field}' ist in der fields-Auflistung nicht vorhanden.`);
                            process.exit(1);
                        }
                        elem.title = m.fields[elem.field].title; 
                    }

                    if (elem.columns) {
                        elem.columns = elem.columns.map( col => {
                            col.elements = validateLayoutElements(col.elements);
                            return col;
                        })
                    }
                    
                    if (elem.googleMapDetails && elem.googleMapDetails.location) {
                        elem.googleMapDetails.location = elem.googleMapDetails.location.toString();
                    }
                    
                    if (elem.enabled) {
                        elem.enabled = elem.enabled.toString();
                    }

                    if (elem.visible) {
                        elem.visible = elem.visible.toString();
                    }

                    LayoutElementsSchema.validate(elem);

                    if (elem.elements) 
                        elem.elements = validateLayoutElements(elem.elements);
                    
                        return elem;
                })

                return elements;
            }

            if (l.elements)
            l.elements = validateLayoutElements(l.elements);

            try {
                LayoutSchema.validate(l);
            } catch (err) {
                console.log(l);
                console.log(err.message);

                process.exit(1);
            } 

            m.layouts[layoutName] = l;
        })
    }


    if (m.methods) {
        if (typeof m.methods.defaults === 'function') m.methods.defaults = m.methods.defaults.toString();
        if (typeof m.methods.onBeforeInsert === 'function') m.methods.onBeforeInsert = m.methods.onBeforeInsert.toString();
        if (typeof m.methods.onBeforeUpdate === 'function') m.methods.onBeforeUpdate = m.methods.onBeforeUpdate.toString();
        if (typeof m.methods.onBeforeRemove === 'function') m.methods.onBeforeRemove = m.methods.onBeforeRemove.toString();

        if (typeof m.methods.onAfterInsert === 'function') m.methods.onAfterInsert = m.methods.onAfterInsert.toString();
        if (typeof m.methods.onAfterUpdate === 'function') m.methods.onAfterUpdate = m.methods.onAfterUpdate.toString();
        if (typeof m.methods.onAfterRemove === 'function') m.methods.onAfterRemove = m.methods.onAfterRemove.toString();
    }

    if (m.dashboards && typeof m.dashboards.dashboardPicker === 'function') {
        m.dashboards.dashboardPicker = m.dashboards.dashboardPicker.toString();
    }

    if (m.reports) {
        m.reports.forEach( r => {
            r.productId = m.productId;
            r.moduleId = moduleId;

            registerReport(r)
        });
    }

    let mod = Mods.findOne(moduleId);    
    if (mod) {
        Mods.update({_id: moduleId},  {
            $set: m
        });
        console.log('update module', moduleId);
    } else {
        m.sharedWith = [];
        m.sharedWithRoles = ['ADMIN'];
        
        console.log('insert module', moduleId);
        Mods.insert(m);
    }

    // registrieren der Mongo-Collection
    console.log('create Module-Store', moduleId);
    moduleStores[moduleId] = new Mongo.Collection(moduleId);

    console.log(`done. (register module ${moduleId})`);
}

/**
 * Registriert ein neues Produkt in der Datenbank
 * 
 * @param {Object} p, Produkt welches registriert wereden soll
 */
export const registerProduct = (p, index) => {
    console.log(`register product ${p._id}...`);
    
    let product = Products.findOne(p._id);

    // module extrahieren
    const mods = p.modules;
    delete p.modules;

    if (product) {
        Products.update(p._id,  {
            $set: p
        });
    } else {
        p.sharedWith = [];
        p.sharedWithRoles = ['ADMIN'];

        Products.insert(p);
        product = p;
    }

    if (mods) {
        // nach dem Erstellen des Produkts nun noch die zugehörigen Module
        // registrieren und den Verweis setzen
        mods.forEach( (m, i) => {
            
            // richtigen Verweis auf das Modul setzen
            m.productId = product._id;
            m.position = i;
            
            registerModule(m);
        });
    } else {
        // es gibt wohl keine module
        // ggf. gab es vorher welche, diese nun löschen
        Mods.remove({ productId: product._id });
    }

    console.log(`done. (register product ${product._id})`);
}


/**
 * Registrieren der kompletten Applikation
 * 
 * @param {Object} app Gesamte Applikation, die registriert werden soll
 */
export const registerApplication = app => {
    app.products.forEach( (p, i) => {
        // Position für die Darstellung festlegen
        p.position = i;

        registerProduct(p);
    });
}