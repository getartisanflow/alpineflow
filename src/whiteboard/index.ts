import type { Alpine } from 'alpinejs';
import { registerFlowEraserDirective } from '../plugin/directives/flow-eraser';
import { registerFlowFreehandDirective } from '../plugin/directives/flow-freehand';
import { registerFlowHighlighterDirective } from '../plugin/directives/flow-highlighter';
import { registerFlowRectangleDrawDirective } from '../plugin/directives/flow-rectangle-draw';
import { registerFlowArrowDrawDirective } from '../plugin/directives/flow-arrow-draw';
import { registerFlowCircleDrawDirective } from '../plugin/directives/flow-circle-draw';
import { registerFlowTextToolDirective } from '../plugin/directives/flow-text-tool';

export default function AlpineFlowWhiteboard(Alpine: Alpine) {
    registerFlowEraserDirective(Alpine);
    registerFlowFreehandDirective(Alpine);
    registerFlowHighlighterDirective(Alpine);
    registerFlowRectangleDrawDirective(Alpine);
    registerFlowArrowDrawDirective(Alpine);
    registerFlowCircleDrawDirective(Alpine);
    registerFlowTextToolDirective(Alpine);
}
