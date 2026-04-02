import AlpineFlowForce from './force';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowForce);
});
