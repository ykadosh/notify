import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useStore } from './useStore';
import { Notification as iNotification } from '../Notify.types';

const MAX_NOTIFICATIONS = 5;

interface NotificationProps extends iNotification {
    id: string;
}

let timeouts: ReturnType<typeof setTimeout>[] = [];
let paused = -1;

export const useNotify = () => {
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
        timeouts.push(setTimeout(() => {
            remove(notification.id);
        }, notification.timeout - Date.now()));
        return notification.id
    }, []);

    const pause = useCallback(() => {
        timeouts.forEach(clearTimeout);
        timeouts = [];
        paused = Date.now();
    }, []);

    const resume = useCallback(() => {
        setNotifications(n => {
            return n.map(notification => {
                notification.timeout += Date.now() - paused;
                timeouts.push(setTimeout(() => {
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