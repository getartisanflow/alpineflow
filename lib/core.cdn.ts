import AlpineFlow from './core';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlow);
});
