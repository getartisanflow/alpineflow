import AlpineFlowSchema from './schema';

document.addEventListener('alpine:init', () => {
    (window as any).Alpine.plugin(AlpineFlowSchema);
});
