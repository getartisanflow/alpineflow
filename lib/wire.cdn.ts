import AlpineFlowWire from './wire';

document.addEventListener('alpine:init', () => {
    (window as any).Alpine.plugin(AlpineFlowWire);
});
