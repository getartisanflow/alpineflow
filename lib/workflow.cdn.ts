import AlpineFlowWorkflow from './workflow';

document.addEventListener('alpine:init', () => {
    (window as any).Alpine.plugin(AlpineFlowWorkflow);
});
