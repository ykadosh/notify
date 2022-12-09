import { ReactNode } from 'react';

export enum NotificationType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
}

export type Notification = {
    /**
     * The notification's type. Leave empty for no icon.
     */
    type: NotificationType

    /**
     * The notification's title. Leave empty for no title.
     */
    title: string

    /**
     * The notification's message. Can be a string or any custom component.
     */
    content: ReactNode

    /**
     * The notification's duration in milliseconds. Defaults to 5000.
     */
    timeout: number
}