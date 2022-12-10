import { Notification as iNotification } from '../Notify.types';
import { Transition } from '../Transition';
import { Notification } from '../Notification';
import './Notifications.scss';

interface NotificationProps extends iNotification {
    id: string;
}

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
        <Transition.Group className='notify__notifications' style={{ '--duration': `${animationDuration}ms` as any}} onMouseEnter={pause} onMouseLeave={resume}>
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