export function renderNameInput() {
    const main = document.getElementById('main-content');
    
    main.innerHTML = `
        <div class="name-view">
            <div class="mario-cloud cloud-1"></div>
            <div class="mario-cloud cloud-2"></div>
            <div class="mario-cloud cloud-3"></div>
            
            <div class="question-block">
                <h2 class="question-title">¿CÓMO TE LLAMAS?</h2>
                <p class="question-subtitle">Ingresa tu nombre para guardar tu progreso</p>
                
                <form id="name-form" class="name-form">
                    <div class="input-group">
                        <label class="input-label" for="player-name">TU NOMBRE</label>
                        <input 
                            type="text" 
                            id="player-name" 
                            class="input-field" 
                            placeholder="Escribe aquí..."
                            maxlength="20"
                            autocomplete="off"
                            autofocus
                        >
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large">
                        <span>✓</span> CONFIRMAR
                    </button>
                </form>
                
                <div class="back-link">
                    <button id="btn-back" class="btn btn-ghost">
                        ← Volver al inicio
                    </button>
                </div>
            </div>
            
            <div class="mario-ground"></div>
        </div>
    `;

    const form = document.getElementById('name-form');
    const input = document.getElementById('player-name');
    const btnBack = document.getElementById('btn-back');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = input.value.trim();
        
        if (name.length < 2) {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
            return;
        }
        
        const { setUser } = await import('../storage.js');
        const user = {
            id: Date.now(),
            name: name,
            createdAt: new Date().toISOString()
        };
        setUser(user);
        
        const { navigate } = await import('../router.js');
        navigate('home');
    });

    btnBack.addEventListener('click', async () => {
        const { navigate } = await import('../router.js');
        navigate('home');
    });

    setTimeout(() => input.focus(), 100);
}
