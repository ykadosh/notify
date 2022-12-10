import React from 'react';
import { NotificationType } from '../Notify.types';
import './Icon.scss';

const Success = () => (
    <svg viewBox='0 0 16 16'>
        <path d='M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z'/>
    </svg>
);

const Info = () => (
    <svg viewBox='0 0 16 16'>
        <path d='m10.277 5.433-4.031.505-.145.67.794.145c.516.123.619.309.505.824L6.101 13.68c-.34 1.578.186 2.32 1.423 2.32.959 0 2.072-.443 2.577-1.052l.155-.732c-.35.31-.866.434-1.206.434-.485 0-.66-.34-.536-.939l1.763-8.278zm.122-3.673a1.76 1.76 0 1 1-3.52 0 1.76 1.76 0 0 1 3.52 0z'/>
    </svg>
);

const Error = () => (
    <svg viewBox='0 0 16 16'>
        <path d='M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z'/>
    </svg>
);

const Warning = () => (
    <svg viewBox='0 0 16 16'>
        <path d='M6.002 14a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm.195-12.01a1.81 1.81 0 1 1 3.602 0l-.701 7.015a1.105 1.105 0 0 1-2.2 0l-.7-7.015z'/>
    </svg>
);

const NOTIFICATION_ICON = {
    success: Success,
    error: Error,
    info: Info,
    warning: Warning,
};

interface Props {
    type: NotificationType;
}

export const Icon = ({ type }: Props) => {
    const SVG = NOTIFICATION_ICON[type];
    return (
        <div className={`notify__icon notify__icon--${type}`}>
            <SVG/>
        </div>
    );
}