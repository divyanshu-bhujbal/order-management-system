import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/navigation/AppHeader';

export function AppShell(): JSX.Element {
    return (
        <div className='app-shell'>
            <AppHeader />
            <main className='app-content'>
                <Outlet />
            </main>
        </div>
    );
}
