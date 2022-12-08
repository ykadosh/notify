import React, { useCallback, useState, useRef, memo } from 'react';
import { nanoid } from 'nanoid';
import { Transition } from './Transition';
import { NotificationType } from './Notify.types';
import { Icon } from './Icon';
import styles from './Notify.module.scss';

function MdClose() {
    return (
        <svg viewBox='0 0 24 24'>
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    )
}

const ANIMATION_DURATION = 400;
const MAX_NOTIFICATIONS = 5;
const STACKING_OVERLAP = 0.9; // A range from 0 to 1 representing the percentage of the notification's height that should overlap the next notification


type Notification = {
    id: string
    type: NotificationType
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