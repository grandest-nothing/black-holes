(() => {
  const cue = document.querySelector('.scroll-cue');
  if (!cue) return;
  cue.setAttribute('aria-label', 'Scroll to overview');
  cue.innerHTML = `<svg class="neutron-icon" viewBox="0 0 64 96" width="48" height="72" aria-hidden="true" focusable="false"><defs><radialGradient id="neutron-core"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e6fcff"/><stop offset="1" stop-color="#75d7ff"/></radialGradient><radialGradient id="neutron-aura"><stop stop-color="#66c7ff" stop-opacity=".65"/><stop offset="1" stop-color="#337bff" stop-opacity="0"/></radialGradient><linearGradient id="neutron-jet" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#47bfff" stop-opacity=".15"/><stop offset=".45" stop-color="#eaffff"/><stop offset="1" stop-color="#6bdfff"/></linearGradient></defs><circle class="neutron-aura" cx="32" cy="40" r="27" fill="url(#neutron-aura)"/><g class="neutron-axis"><path d="M32 4 L29.8 37 L34.2 37 Z M30 43 L34 43 L34.8 76 L41 74 L32 88 L23 74 L29.2 76 Z" fill="url(#neutron-jet)"/><path d="M32 8 V77 M26 77 L32 85 L38 77" fill="none" stroke="#d8ffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></g><circle cx="32" cy="40" r="8" fill="url(#neutron-core)"/><path class="neutron-surface" d="M26 38 Q32 33 38 39 M27 44 Q33 40 38 42" fill="none" stroke="#8dd9f4" stroke-opacity=".6" stroke-width="1"/></svg><span>Scroll</span>`;
  const style = document.createElement('style');
  style.textContent = `
    .hero .scroll-cue { bottom: 1.25rem; gap: .15rem; color: #9eb9cd; }
    .neutron-icon { display: block; overflow: visible; filter: drop-shadow(0 0 5px #6cd9ff) drop-shadow(0 0 12px #306dc580); }
    .neutron-axis { transform-origin: 32px 40px; animation: neutron-wobble 6s ease-in-out infinite; }
    .neutron-aura { transform-origin: 32px 40px; animation: neutron-pulse 2.8s ease-in-out infinite; }
    .neutron-surface { transform-origin: 32px 40px; animation: neutron-spin 8s linear infinite; }
    @keyframes neutron-wobble { 0%,100% { transform: rotate(-16deg); } 50% { transform: rotate(16deg); } }
    @keyframes neutron-pulse { 0%,100% { opacity: .45; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.08); } }
    @keyframes neutron-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .neutron-axis,.neutron-aura,.neutron-surface { animation: none; } }
  `;
  document.head.appendChild(style);
})();
