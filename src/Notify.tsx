import React, { useCallback, useState, useRef, memo } from 'react';
import { nanoid } from 'nanoid';
import { Transition } from './Transition';
import styles from './Notify.module.scss';

function MdClose() {
    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    )
}

function BsCheckLg() {
    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
        </svg>
    );
}

const BsXLg = BsCheckLg;
const BsInfoLg = BsCheckLg;
const BsExclamationLg = BsCheckLg;

const TIMEOUT = 5000; // Notifications will be removed automatically after 5 seconds, unless hovered over.
const ANIMATION_DURATION = 400;
const MAX_NOTIFICATIONS = 5;
const STACKING_OVERLAP = 0.9; // A range from 0 to 1 representing the percentage of the notification's height that should overlap the next notification
const NOTIFICATION_ICON = {
    success: BsCheckLg,
    error: BsXLg,
    info: BsInfoLg,
    warning: BsExclamationLg,
};

enum Type {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
}

type Notification = {
    id: string
    type: Type
    title: string
    content: string
    timeout: number
}

export const useNotifications = () => {
    const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
    const paused = useRef(-1);
    const [notifications, setNotifications] = useState([] as Notification[]);

    const add = useCallback((n: Notification) => {
        const notification = { ...n };
        notification.id = nanoid();
        notification.timeout += Date.now();
        setNotifications(n => {
            const next = [notification, ...n];
            if (n.length >= MAX_NOTIFICATIONS) {
                next.pop();
            }
            return next;
        });
        timeouts.current.push(setTimeout(() => {
            remove(notification.id);
        }, notification.timeout - Date.now()));
    }, []);

    const pause = useCallback(() => {
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
        paused.current = Date.now();
    }, []);

    const resume = useCallback(() => {
        setNotifications(n => {
            return n.map(notification => {
                notification.timeout += Date.now() - paused.current;
                timeouts.current.push(setTimeout(() => {
                    remove(notification.id);
                }, notification.timeout - Date.now()));
                return notification;
            });
        });
    }, [notifications]);

    const remove = useCallback((id: string) => {
        setNotifications(n => n.filter(n => n.id !== id));
    }, []);

    const props = { notifications, remove, pause, resume };

    return { props, add };
};

interface NotificationProps extends Notification {
    index: number
    total: number
    remove: (id: string) => void
    className?: string
}

const Notification = memo(({ id, title, content, type, index, total, remove, className }: NotificationProps) => {
    const Icon = NOTIFICATION_ICON[type];
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
                <div className={`icon ${type}`}>
                    <Icon/>
                </div>
                <div>
                    <h2>{title}</h2>
                    <p>{content}</p>
                </div>
                <button className={styles.close} onClick={() => remove(id)}><MdClose/></button>
            </div>
        </div>
    );
});

interface NotificationsProps {
    notifications: Notification[]
    remove: (id: string) => void
    pause: () => void
    resume: () => void
    animationDuration: number
}

export const Notifications = ({ notifications, remove, pause, resume, animationDuration }: NotificationsProps) => {

    return (
        // @ts-ignore
        <Transition.Group className={styles.notifications} style={{ '--duration': `${animationDuration}ms` as any}} onMouseEnter={pause} onMouseLeave={resume}>
            {[...notifications].reverse().map((notification, index) => (
                <Transition key={notification.id} timeout={animationDuration}>
                    <Notification
                        {...notification}
                        remove={remove}
                        index={index}
                        total={notifications.length}/>
                </Transition>
            ))}
        </Transition.Group>
    );
}