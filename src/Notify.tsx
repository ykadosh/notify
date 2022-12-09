import React, { StrictMode, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { nanoid } from 'nanoid';
import { Transition } from './Transition';
import { Notification } from './Notification';
import { Notification as iNotification } from './Notify.types';
import { useStore } from './hooks/useStore';
import styles from './Notify.module.scss';

const MAX_NOTIFICATIONS = 5;

interface NotificationProps extends iNotification {
    id: string;
}

export const useNotifications = () => {
    const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
    const paused = useRef(-1);
    const [notifications, setNotifications] = useStore<NotificationProps[]>('notifications', [] as NotificationProps[]);

    const add = useCallback((n: NotificationProps) => {
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

interface NotificationsProps {
    notifications: NotificationProps[]
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

const App = () => {
    const { props } = useNotifications();
    return (
        <Notifications {...props} animationDuration={400}/>
    );
}

if (typeof window !== 'undefined') {
    let element = document.getElementById('notify-root');
    if (!element) {
        element = document.createElement('div');
        element.id = 'notify-root';
        document.body.appendChild(element);
    }
    const root = createRoot(element!);

    root.render(
        <StrictMode>
            <App/>
        </StrictMode>
    );
}