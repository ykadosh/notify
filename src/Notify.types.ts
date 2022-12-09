import { ReactNode } from 'react';

export enum NotificationType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
}

export type Notification = {
    type: NotificationType
    title: string
    content: ReactNode
    timeout: number
}