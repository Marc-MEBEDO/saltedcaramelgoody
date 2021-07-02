import { actionCodes } from './actioncodes';

export const layouttypesObject = {
    HEADING: {
        _id: 'HEADING',
        active: true,
        title: 'Überschrift',
        description: 'Wird für die Hauptüberschriften verwandt',
        hasChilds: true,
        defaultValues: { title: 'X', printTitle: 'Überschrift' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-heading depth-{{depth}}">
                <div class="mbac-title">
                    <span class="mbac-position mbac-media-print">{{XparentPosition}}{{Xposition}}</span>
                    <span class="mbac-position mbac-media-screen">{{parentPosition}}{{position}}</span>
                    <span>{{printTitle}}</span>
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
            </div>
        `
    },
    TEXT: {
        _id: 'TEXT',
        active: true,
        title: 'Text',
        description: 'Wird als einfacher Textoutput herangezogen und exakt so ausgegeben wie im HTML formatiert.',
        hasChilds: false,
        defaultValues: { title: 'T', text: 'Text' },
        template: `<div id="{{_id}}" class="mbac-item-type-text depth-{{depth}}">{{text}}</div>`
    },
    QUESTION: {
        _id: 'QUESTION',
        active: true,
        title: 'Frage',
        description: 'Wird als Frage mit Handlungsbedarf genutzt.',
        hasChilds: true,
        defaultValues: { title: 'Q', printTitle:'Frage', text: 'Zusatztext', actionText: 'Maßnahmentext', actionCode: 'unset' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-question depth-{{depth}}">
                <div class="mbac-title">
                    {{printParentPosition}}{{printPosition}} {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
            </div>
        `
    },
    ANSWER : {
        _id: 'ANSWER',
        active: true,
        title: 'Antwort',
        description: 'Wird als mögliche Antwort zu einer Frage genutzt.',
        hasChilds: true,
        defaultValues: { title: 'A', printTitle:'Antwort', text: 'Antworttext', actionText:'Handlungsempfehlungstext', actionCode: 'okay' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-answer depth-{{depth}}">
                <div class="mbac-title">
                    Antwort/Ist-Zustand
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
                <div class="mbac-handlungsempfehlung {{actionCode}}">
                    <div class="mbac-action-title">
                        Handlungsempfehlung
                    </div>
                    <div class="mbac-action-text">
                        {{actionText}}
                    </div>
                    <div class="mbac-action-longtext">
                        {{actionCodeLongtext}}
                    </div>
                </div>
            </div>
        `
    },

    HINT: {
        _id: 'HINT',
        active: true,
        title: 'Hinweis',
        description: 'Hinweistext, der üblicherweise zu einer Antwort folgt',
        hasChilds: false,
        defaultValues: { title: 'H', /*printTitle:'Hinweistitel',*/ text: 'Hinweistext' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-hint depth-{{depth}}">
                <div class="mbac-fix-title">
                    Hinweis
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },
    INFO: {
        _id: 'INFO',
        active: true,
        title: 'Info',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Information" verwandt.',
        hasChilds: false,
        defaultValues: { title: 'I', /*printTitle:'Infotitel',*/ text: 'Infotext' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-info depth-{{depth}}">
                <div class="mbac-fix-title">
                    Information
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    IMPORTANT: {
        _id: 'IMPORTANT',
        active: true,
        title: 'Wichtig',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Wichtig" verwandt.',
        hasChilds: false,
        defaultValues: { title: 'IM', /*printTitle:'Titel',*/ text: 'Wichtigtext' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-important depth-{{depth}}">
                <div class="mbac-fix-title">
                    Wichtig
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    RECOMMENDATION: {
        _id: 'RECOMMENDATION',
        active: true,
        title: 'Empfehlung',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Empfehlung" verwandt.',
        hasChilds: false,
        defaultValues: { title: 'E', /*printTitle:'Empfehlungstitel',*/ text: 'Empfehlungstext' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-recommendation depth-{{depth}}">
                <div class="mbac-fix-title">
                    Empfehlung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    NOTE: { // sollte nicht mehr genutzt werden!
        _id: 'NOTE',
        active: false,
        title: 'Hinweis (old NOTE deprecated)',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Hinweis" verwandt.',
        hasChilds: false,
        defaultValues: { title: 'N', /*printTitle:'Hinweistitel',*/ text: 'Hinweistext' },
        template: `
            <div class="mbac-item-type-note depth-{{depth}}">
                <div class="mbac-fix-title">
                    Hinweis (deprecated)
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    REMARK: {
        _id: 'REMARK',
        active: true,
        title: 'Anmerkung',
        description: 'Wird als Anmerkung innerhalb einer Frage genutzt.',
        hasChilds: false,
        defaultValues: { title: 'R', /*printTitle:'Anmerkungstitel',*/ text: 'Anmerkungstext' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-remark depth-{{depth}}">
                <div class="mbac-fix-title">
                    Anmerkung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    // wird in dem Gutachten von JK aktuell nicht mehr verwandt
    ATTENTION: {
        _id: 'ATTENTION',
        active: false,
        title: 'Achtung inkl. Bild (deprecated)',
        description: 'Wird als wichtiger Hinweistext mit Stoppsymbol verwandt.',
        hasChilds: false,
        defaultValues: { title: 'AT', /*printTitle:'Achtungstitel',*/ text: 'Achtungstext' },
        template: `
            <div class="mbac-item-type-attention depth-{{depth}}">
                <div class="mbac-fix-title">
                    ACHTUNG ! (deprecated)
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },
    // Definitionen gibt es in dem Gutachten nur 2x und kann aber als Text zur Frage aufgenommen werden
    DEFINITION: {
        _id: 'DEFINITION',
        active: false,
        title: 'Definition (deprecated)',
        description: 'Wird als Begriffsdefinition verwandt.',
        hasChilds: false,
        defaultValues: { title: 'D', /*printTitle:'Definitionstitel',*/ text: 'Definitionstext' },
        template: `
            <div class="mbac-item-type-definition depth-{{depth}}">
                <div class="mbac-fix-title">
                    Definition
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    BESTIMMUNGEN: {
        _id: 'BESTIMMUNGEN',
        active: true,
        title: 'Bestimmungen',
        description: 'Wird als Aufzählung für die zu beachtenden Vorschriften und Bestimmungen verwandt',
        hasChilds: false,
        defaultValues: { title: 'B', printTitle:'Bestimmungstitel', text: 'Bestimmungen' },
        template: `
            <table id="{{_id}}" class="mbac-item-type-bestimmungen">
                <thead>
                    <tr>
                        <td>{{printTitle}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {{text}}
                        </td>
                    </tr>
                </tbody>
            </table>
        `
    },

    TODOLIST: {
        _id: 'TODOLIST',
        active: true,
        title: 'Aufstellung Maßnahmen',
        description: 'Hier wird die Liste aller Maßnahmen aufgeführt.',
        hasChilds: false,
        defaultValues: { title: 'TL', text: 'Im Nachfolgenden finden Sie eine Auflistung der einzelnen Maßnahmen.' },
        template: `
            <div id="{{_id}}" class="mbac-item-type-todolist">
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>

                <table class="mbac-item-type-todolist">
                    <thead>
                        <tr>
                            <td>Lfd.Nr.</td>
                            <td>Maßnahme</td>
                        </tr>
                    </thead>
                    <tbody>
                        {{todoitems}}
                    </tbody>
                </table>
            </div>
        `
    },

    TODOITEM: {
        _id: 'TODOITEM',
        internalUseOnly: true,
        active: true,
        title: 'Einzelnes TODO Item',
        description: '',
        hasChilds: false,
        template: `
            <tr class="mbac-item-type-todolist-item">
                <td>{{index}}</td>
                <td>{{text}}</td>
            </tr>
        `
    },

    TODOITEMACTIONHEAD: {
        _id: 'TODOITEMACTIONHEAD',
        internalUseOnly: true,
        active: true,
        title: 'Überschrift der einzelnen Maßnahme',
        description: '',
        hasChilds: false,
        template: `
            <tr class="mbac-item-type-todolist-item-head {{actionCode}}">
                <td colspan="2">{{actionText}}</td>
            </tr>
        `
    },

    PICTURECONTAINER: {
        _id: 'PICTURECONTAINER',
        active: true,
        title: 'Bildcontainer',
        description: 'Dieser Typ dient der Aufstellung/Liste einzelner Bilddokumentationen',
        hasChilds: true,
        isPictureable: true,
        defaultValues: { title: 'BC', printTitle:'Bildcontainer', text: 'Im Nachfolgenden finden Sie eine Auflistung der Bilder.' },
        template: `<div class="mbac-item-type-picture-container">
            <div class="mbac-text">
                {{text}}
            </div>
            <table class="mbac-item-type-picture-container">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>Fotodokumentation</td>
                        <td>Bemerkungen</td>
                    </tr>
                </thead>
                <tbody>
                    {{childContent}}
                </tbody>
            </table>
        </div>`
    },

    PICTURE: {
        _id: 'PICTURE',
        active: true,
        internalUseOnly: true,
        title: 'Bild(er)',
        description: 'Dieser Typ dient der Bilddokumentation und kann ein oder mehrere Bilder beinhalten',
        hasChilds: false,
        defaultValues: { printTitle: 'Bildtitel', text: 'Bildtext' },
        template: `<tr class="mbac-item-type-picture">
            <td>{{index}}</td>
            <td>{{pictures}}</td>
            <td>{{text}}</td>
        </tr>`
    },

    PAGEBREAK: {
        _id: 'PAGEBREAK',
        active: true,
        title: '> Seitenumbruch <',
        description: 'Seitenumbruch',
        hasChilds: false,
        defaultValues: { title: 'P' },
        template: `<div class="mbac-item-type-pagebreak">
            Seitenumbruch
        </div>`
    },

    UNKNOWN: {
        _id: 'UNKNOWN',
        active: false,
        title: '<nicht festgelegt>',
        description: 'Dies sollte nicht vorkommen',
        hasChilds: false,
        /*template: `
            <div style="width:100%; bgcolor:orange">
                {{title}}
                {{text}}

                {{todolist}}
            </div>
        `
        }*/
    }

}
//export const layouttypesObject = LayouttypesObject;
export const layouttypesArray = Object.keys(layouttypesObject).map( k => {return {_id:layouttypesObject[k]._id, title:layouttypesObject[k].title}} );
export const selectableLayouttypes = layouttypesArray.filter(item => {
    const { internalUseOnly, active } = layouttypesObject[item._id];
    return !internalUseOnly && active;
}).sort( (a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));

/**
 * Render the given item by it's type and returns the generated HTML-code
 * 
 * @param {Object} item Specifies the current item to render with all props
 */
export const renderTemplate = (item, depth=0) => {
    const { template } = layouttypesObject[item.type];

    if (item.depth) depth = item.depth;

    const renderedTemplate = template
        .replace( /\{\{\_id\}\}/g, (item._id || '') + '' )
        .replace( /\{\{printTitle\}\}/g, item.printTitle || '')
        .replace( /\{\{text\}\}/g, item.text || '' )
        .replace( /\{\{actionCode\}\}/g, item.actionCode || '' )
        .replace( /\{\{actionCodeText\}\}/g, (item.actionCode && actionCodes[item.actionCode].text) || '' )
        .replace( /\{\{actionCodeLongtext\}\}/g, (item.actionCode && actionCodes[item.actionCode].longtext) || '' )
        .replace( /\{\{actionText\}\}/g, item.actionText || '' )
        .replace( /\{\{parentPosition\}\}/g, (item.parentPosition || '') + '' )
        .replace( /\{\{position\}\}/g, (item.position || '') + '' )
        .replace( /\{\{depth\}\}/g, depth + '' );

    return '<div class="mbac-opinion-detail">' + renderedTemplate + '</div>';
}