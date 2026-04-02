import AlpineFlowCollab from './collab';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowCollab);
});
