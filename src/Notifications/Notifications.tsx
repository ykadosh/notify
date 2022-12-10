import { Notification as iNotification } from '../Notify.types';
import { Transition } from '../Transition';
import { Notification } from '../Notification';
import { useNotify } from '../hooks/useNotify';
import { useStore } from '../hooks/useStore';
import './Notifications.scss';

const ANIMATION_DURATION = 400;

interface NotificationProps extends iNotification {
    id: string;
}

export const Notifications = () => {
    const { remove, pause, resume } = useNotify();
    const [notifications] = useStore<NotificationProps[]>('notifications', [] as NotificationProps[]);

    return (
        // @ts-ignore
        <Transition.Group className='notify__notifications' style={{ '--duration': `${ANIMATION_DURATION}ms` as any}} onMouseEnter={pause} onMouseLeave={resume}>
            {[...notifications].reverse().map((notification, index) => (
                <Transition key={notification.id} timeout={ANIMATION_DURATION}>
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