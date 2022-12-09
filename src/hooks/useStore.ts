import { useCallback, useEffect, useState, SetStateAction } from 'react';

const store: { [k: string]: any } = {};

interface Listener<T> {
    (v: T): T
}


const listeners: { [K: string]: Listener<any>[] } = {};

export function useStore<T>(key: string, initialValue: T): [T, (v: SetStateAction<T>) => void] {
    const [state, _setState] = useState(store[key] as T || initialValue);
    const setState = useCallback((stateOrSetter: SetStateAction<T>) => {
        let next = stateOrSetter;
        if (typeof stateOrSetter === 'function') {
            // @ts-ignore
            next = stateOrSetter(store[key] as T);
        }
        listeners[key].forEach(l => l(next));
        store[key] = next;
    }, []);
    useEffect(() => {
        if (!store[key]) {
            store[key] = initialValue;
        }
        if (!listeners[key]) {
            listeners[key] = [];
        }

        const listener = (state: T) => _setState(state);
        listeners[key].push(listener);
        return () => {
            const index = listeners[key].indexOf(listener);
            listeners[key].splice(index, 1);
        };
    }, [])
    return [state, setState];
}