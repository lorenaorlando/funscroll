function centerCanvas() {
    const scrollX = 3000 - (window.innerWidth / 2);
    const scrollY = 3000 - (window.innerHeight / 2);
    window.scrollTo(scrollX, scrollY);
}

window.addEventListener('DOMContentLoaded', centerCanvas);
window.addEventListener('load', centerCanvas);
window.addEventListener('resize', centerCanvas);

// INYECCIÓN DE 100 ELEMENTOS ALEATORIOS PERIFÉRICOS
const glyphs = ['✦', '⚡', '🌀', '⚓', '👁', '⏳', '⛓', '🎲', '🌐', '🛠', '🎯', '📍', '🕹', '🔋', '🔌', '🔮', '🛸', '☄', '👾', '🪐', '❌', '⭕', '💾', '💻', '📣'];
const hub = document.getElementById('elementsHub');

for(let i = 0; i < 100; i++) {
    let el = document.createElement('div');
    el.className = 'scattered-element';
    el.innerHTML = glyphs[Math.floor(Math.random() * glyphs.length)];
    
    let posX = Math.floor(Math.random() * 5600) + 200;
    let posY = Math.floor(Math.random() * 5600) + 200;

    if(posX > 2300 && posX < 3700 && posY > 2500 && posY < 3500) {
        posX += (Math.random() > 0.5 ? 900 : -900);
        posY += (Math.random() > 0.5 ? 700 : -700);
    }

    el.style.left = posX + 'px';
    el.style.top = posY + 'px';
    hub.appendChild(el);
}