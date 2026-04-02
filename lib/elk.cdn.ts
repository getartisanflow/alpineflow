import AlpineFlowElk from './elk';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowElk);
});
