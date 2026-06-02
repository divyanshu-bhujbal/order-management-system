import { NavLink } from 'react-router-dom';
import { appConfig } from '@/config/app';

export function AppHeader(): JSX.Element {
    return (
        <header className='app-header'>
            <div className='app-header__inner'>
                <div>
                    <p className='app-header__eyebrow'>Operations Platform</p>
                    <h1 className='app-header__title'>{appConfig.name}</h1>
                </div>
                <div className='app-header__actions'>
                    <nav
                        className='app-nav'
                        aria-label='Primary navigation'
                    >
                        <NavLink
                            to='/dashboard'
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-nav__link app-nav__link--active'
                                    : 'app-nav__link'
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to='/products'
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-nav__link app-nav__link--active'
                                    : 'app-nav__link'
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to='/customers'
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-nav__link app-nav__link--active'
                                    : 'app-nav__link'
                            }
                        >
                            Customers
                        </NavLink>
                        <NavLink
                            to='/orders'
                            className={({ isActive }) =>
                                isActive
                                    ? 'app-nav__link app-nav__link--active'
                                    : 'app-nav__link'
                            }
                        >
                            Orders
                        </NavLink>
                    </nav>
                    <span className='app-header__status'>
                        Live overview ready
                    </span>
                </div>
            </div>
        </header>
    );
}
