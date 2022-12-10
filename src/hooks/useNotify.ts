import { useCallback, useRef } from 'react';
import { useStore } from './useStore';
import { nanoid } from 'nanoid';
import { Notification as iNotification } from '../Notify.types';

const MAX_NOTIFICATIONS = 5;

interface NotificationProps extends iNotification {
    id: string;
}

export const useNotify = () => {
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

    const remove = useCallback((...ids: string[]) => {
        if (ids.length === 0) {
            setNotifications([]);
            return;
        }
        setNotifications(n => n.filter(n => !ids.includes(n.id)));
    }, []);

    return { add, remove, pause, resume };
};