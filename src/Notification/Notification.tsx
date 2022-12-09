import React, { memo } from 'react';
import styles from '../Notify.module.scss';
import styles1 from './Notification.module.scss';
import { Notification as iNotification } from '../Notify.types';
import { Icon } from '../Icon';

const STACKING_OVERLAP = 0.9; // A range from 0 to 1 representing the percentage of the notification's height that should overlap the next notification

const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button className={styles1.close} onClick={onClick}>
            <svg viewBox='0 0 24 24'>
                <path fill='none' d='M0 0h24v24H0z'/>
                <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/>
            </svg>
        </button>
    );
}

interface Props extends iNotification {
    id: string
    index: number
    total: number
    remove: (id: string) => void
    className?: string
}

export const Notification = memo(({ id, title, content, type, index, total, remove, className }: Props) => {
    const inverseIndex = total - index - 1;
    const scale = 1 - inverseIndex * 0.05;
    const opacity = 1 - (inverseIndex / total) * 0.1;
    const bg = `hsl(0 0% ${100 - inverseIndex * 15}% / 40%)`;
    const y = inverseIndex * 100 * STACKING_OVERLAP;
    return (
        <div
            className={`${styles.notification} ${className}`}
            style={{'--bg': bg, '--opacity': opacity, '--scale': scale, '--y': `${y}%`} as any }>
            <div className={styles.notificationInner}>
                {type && <Icon type={type}/>}
                <div>
                    <h2>{title}</h2>
                    <p>{content}</p>
                </div>
                <CloseButton onClick={() => remove(id)}/>
            </div>
        </div>
    );
});