// hier drin erfolgt die Datenübernahme
//import sql from 'mssql';

//import { OpinionLayerA } from '../../imports/api/collections/opinionLayerA';

//OpinionLayerA.insert({});

// Aktualisieren aller OpinionDetails positionsnummer
import { Opinions } from '../../imports/api/collections/opinions';
import { OpinionDetails } from '../../imports/api/collections/opinionDetails';

import { renderTemplate } from '../../imports/api/constData/layouttypes';

const startRepositioning = () => {
    console.log('Start rePositioning...');
    const rePositionDetails = (refOpinion, refDetail, depth = 1, parentPosition) => {
        let positionCount = 0;

        OpinionDetails.find({
            refOpinion,
            refParentDetail: refDetail
        }, {
            sort: { orderString: 1 }
        }).forEach( ({_id, position}) => {
            positionCount++;
            parentPosition = parentPosition || '';
            rePositionDetails(refOpinion, _id, ++depth, parentPosition + positionCount + '.');

            OpinionDetails.update(_id, {
                $set: {
                    position: positionCount,
                    parentPosition,
                    depth
                }
            });
        });
    }

    Opinions.find({}).forEach( ({ _id }) => {
        rePositionDetails(_id, null);
    });

    console.log('ready');
}

//startRepositioning();

const startRerendering = () => {
    console.log('Start rerender...');

    const reRenderDetails = (refOpinion, refDetail) => {
        OpinionDetails.find({
            refOpinion,
            refParentDetail: refDetail
        }, {
            sort: { parentPosition: 1, position: 1 }
        }).forEach( item => {

            reRenderDetails(refOpinion, item._id);

            let htmlContent = renderTemplate(item);
            
            // at last update the parentDetail with the new Content
            /*const htmlChildContent = OpinionDetails.find({
                refOpinion,
                refParentDetail: item._id,
                deleted: false,
                finallyRemoved: false
            }, { fields: { htmlContent: 1 }, sort: { position: 1 } }).fetch();

            OpinionDetails.update(item._id, { 
                $set: {
                    htmlContent,
                    htmlChildContent:
                        '<ul class="mbac-child-content-list">' + 
                            htmlChildContent.map( ({htmlContent}) => {
                                return `<li>` + htmlContent + '</li>';
                            }).join('') +
                        '</ul>'
                }
            });*/         
        });
    }

    // get all opinions
    Opinions.find({}).forEach( ({ _id }) => {
        reRenderDetails(_id, null /*start at top level*/);
    });

    console.log('ready');
}
//startRerendering();