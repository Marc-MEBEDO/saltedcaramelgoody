import { Roles } from '/imports/api/collections/roles';

//if (Roles.find().count() != 1) {
    Roles.remove({});

    Roles.insert({
        _id: 'EVERYBODY',
        rolename: 'Jeder',
        score: 0,
        description: 'Zugriff für jeden Benutzer',
        permissions: {
            opinion: {                
                create: 0,
                edit: 0,
                remove: 0,
                admin: 0,
                canPostMessage: 0,
                manageTemplate: 0
            },
            shareWith: 0,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 0,
        },
        invitableRoles: [{ roleId:'EVERYBODY', displayName: 'Jeder' }],
        selectable: true 
    });

    Roles.insert({
        _id: 'EXTERNAL',
        rolename: 'Externer',
        score: 100,
        description: 'Zugriff nur für externe - Kunden, Projektleiter, etc.',
        permissions: {
            opinion: {                
                create: 0,
                edit: 0,
                remove: 0,
                admin: 0,
                canPostMessage: 1,
                manageTemplate: 0
            },
            shareWith: 1,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 0,
        },
        invitableRoles: [
            { roleId:'EVERYBODY', displayName: 'Jeder' }, 
            { roleId:'EXTERNAL', displayName: 'Externer' }
        ],
        selectable: true
    });

    Roles.insert({
        _id: 'EMPLOYEE',
        rolename: 'Mitarbeiter',
        score: 200,
        description: 'Zugriff nur für Mitarbeiter',
        permissions: {
            opinion: {                
                create: 1,
                edit: 1,
                remove: 0,
                admin: 0,
                canPostMessage: 1,
                manageTemplate: 0
            },
            shareWith: 1,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 1,
        },
        invitableRoles: [
            { roleId:'EVERYBODY', displayName: 'Jeder' }, 
            { roleId:'EXTERNAL', displayName: 'Externer' },
            { roleId:'EMPLOYEE', displayName: 'Mitarbeiter' }, 
        ],
        selectable: true
    });

    // special role, that permits a user with mostly all permissions on
    // the created item, that he creates
    Roles.insert({
        _id: 'OWNER',
        rolename: 'Besitzer, Ersteller',
        score: 800,
        description: 'Benutzer, der das Dokument erstellt hat',
        permissions: {
            opinion: {
                create: 0,
                edit: 1,
                remove: 1,
                admin: 0,
                canPostMessage: 1,
                manageTemplate: 0
            },
            shareWith: 1,
            cancelSharedWith: 1,
            cancelOwnSharedWith: 1,
        },
        invitableRoles: [
            { roleId:'EVERYBODY', displayName: 'Jeder' }, 
            { roleId:'EXTERNAL', displayName: 'Externer' },
        ],
        selectable: false
    });

    Roles.insert({
        _id: 'ADMIN',
        rolename: 'Administrator',
        score: 99999,
        description: 'Admin darf alles',
        permissions: {
            opinion: {                
                create: 1,
                edit: 1,
                remove: 1,
                admin: 1,
                canPostMessage: 1,
                manageTemplate: 1
            },
            shareWith: 1,
            cancelSharedWith: 1,
            cancelOwnSharedWith: 1,
        },
        invitableRoles: [
            { roleId:'EVERYBODY', displayName: 'Jeder' }, 
            { roleId:'EXTERNAL', displayName: 'Externer' },
            { roleId:'EMPLOYEE', displayName: 'Mitarbeiter' }, 
            { roleId:'ADMIN', displayName: 'Administrator' },
        ],
        selectable: true
    });
//}