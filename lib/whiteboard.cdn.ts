import AlpineFlowWhiteboard from './whiteboard';

document.addEventListener('alpine:init', () => {
  (window as any).Alpine.plugin(AlpineFlowWhiteboard);
});
