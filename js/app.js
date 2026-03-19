import { hasUser, getUser, setUser } from './storage.js';
import { router, navigate } from './router.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = hasUser();
    
    if (!user) {
        const savedUser = localStorage.getItem('pending_user');
        if (!savedUser) {
            await navigate('name');
        }
    }
});

window.addEventListener('hashchange', router);

window.navigateTo = (route, params = {}) => {
    navigate(route, params);
};

window.setPendingUser = (name) => {
    const user = {
        id: Date.now(),
        name: name,
        createdAt: new Date().toISOString()
    };
    setUser(user);
};

window.getUserName = () => {
    const user = getUser();
    return user?.name || 'Jugador';
};
