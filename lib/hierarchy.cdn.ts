import AlpineFlowHierarchy from './hierarchy';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowHierarchy);
});
