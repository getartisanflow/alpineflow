import AlpineFlowDagre from './dagre';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowDagre);
});
