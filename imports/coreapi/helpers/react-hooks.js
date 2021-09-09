import { useState } from "react";

export const useOnce = callback => {
    const [ firstime, setFirsttime ] = useState(true);

    if (firstime) {
        callback();
        setFirsttime(false);
    }
}