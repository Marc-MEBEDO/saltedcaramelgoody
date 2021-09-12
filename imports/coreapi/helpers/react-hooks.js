import { useEffect, useState } from "react";

export const useOnce = callback => {
    const [ firstime, setFirsttime ] = useState(true);

    if (firstime) {
        callback();
        setFirsttime(false);
    }
}

export const useOnceWhen = (condition, callback) => {
    const [ firstime, setFirsttime ] = useState(true);
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted && condition()) {
        if (firstime) {
            callback();
            setFirsttime(false);
        }
    }
}


export const useWhenChanged = (observedValue, callback) => {
    const [value, setValue] = useState(observedValue);

    if (value !== observedValue) {
        callback();
        setValue(observedValue);
    }
}