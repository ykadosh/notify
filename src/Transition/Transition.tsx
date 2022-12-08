// @ts-nocheck
import { Children, cloneElement, ReactNode, useEffect, useRef, useState } from 'react';

Transition.Group = function({ children, ...props }: { children: ReactNode[] }) {
    const timeouts = useRef({});
    const [nodes, setNodes] = useState({});
    const addNode = (key, node) => {
        setNodes(nodes => {
            if (!nodes[key]) {
                console.log(key, 'enter');
                const next = { ...nodes };
                next[key] = cloneElement(node, { className: 'enter'});
                return next;
            }
            return nodes;
        });
    }
    const refreshNode = (key, node) => {
        setNodes(nodes => {
            const next = { ...nodes };
            next[key] = cloneElement(node, { className: next[key].props.className });
            return next;
        });
    }
    const updateNodeStage = (key, stage, delay) => {
        const { timeout, target } = timeouts.current[key] || {};
        if (target !== stage) {
            clearTimeout(timeout);
            timeouts.current[key] = {
                target: stage,
                timeout: setTimeout(() => {
                    console.log(key, stage);
                    delete timeouts.current[key];
                    setNodes(nodes => {
                        const next = { ...nodes };
                        next[key] = cloneElement(next[key], { className: stage });
                        return next;
                    });
                }, delay)
            };
        }
    }
    useEffect(() => {
        children.map(child => {
            if (!nodes[child.key]) {
                addNode(child.key, child);
                updateNodeStage(child.key, 'enter enter-active', 1000/60);
            }

            if (!!nodes[child.key]) {
                // Keep child props updated
                refreshNode(child.key, child);
            }
        });
        const childKeys = children.map(child => child.key);
        Object.keys(nodes).map(key => {
            if (!childKeys.includes(key) && !nodes[key].props.className.includes('exit')) {
                updateNodeStage(key, 'exit', 0);
            }
        });
    }, [children]);

    useEffect(() => {
        Object.keys(nodes).map(key => {
            if (nodes[key].props.className === 'enter enter-active') {
                updateNodeStage(key, 'enter-done', nodes[key].props.timeout);
            }
            if (nodes[key].props.className === 'exit') {
                updateNodeStage(key, 'exit exit-active', 0);
            }
            if (nodes[key].props.className === 'exit exit-active') {
                setTimeout(() => {
                    console.log(key, 'unmounted');
                    setNodes(nodes => {
                        const next = { ...nodes };
                        delete next[key];
                        return next;
                    });
                }, nodes[key].props.timeout);
            }
        });

    }, [nodes]);

    return (
        <div {...props}>{Object.keys(nodes).map(key => nodes[key])}</div>
    );
}

export function Transition({ children, timeout, className }: { children: any, timeout: number }) {
    const child = Children.only(children);
    return cloneElement(child, { className });
}