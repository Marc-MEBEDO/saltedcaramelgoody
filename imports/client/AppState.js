import { useEffect, useState } from "react"

export var AppState = {};

var callbacksByState = {};

export const setAppState = newState => {
    Object.keys(newState).forEach( propName => {
        const newValue = newState[propName];

        AppState[propName] = newValue;
        
        if (!callbacksByState[propName]) return;
        callbacksByState[propName].forEach( updateRev => updateRev() );
    });
}

export const useAppState = (propName, dependencies) => {
    // revision-counter
    const [ revison, setRevision ] = useState(0);

    const updateRevision = () => {
        setRevision(revison + 1);
    }

    const stateSetter = newValue => {
        setAppState({[propName]: newValue});
    }

    useEffect( () => {
        callbacksByState[propName] = callbacksByState[propName] || [];
        callbacksByState[propName].push(updateRevision);
            
        return cleanup = () => {
            callbacksByState[propName] = callbacksByState[propName].filter( cb => cb !== updateRevision );
        }
    }, dependencies);

    return [ AppState[propName], stateSetter ];
}