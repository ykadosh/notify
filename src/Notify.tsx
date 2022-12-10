import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Notifications } from './Notifications';
import { useNotify } from './hooks/useNotify';
import './Notify.scss';

const App = () => {
    const { props } = useNotify();
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