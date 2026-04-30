import { describe, it, expect } from 'vitest';
import { toDot } from './dot';

function makeCanvas() {
    return {
        nodes: [
            {
                id: 'user',
                data: {
                    label: 'User',
                    fields: [
                        { name: 'id', type: 'uuid', key: 'primary' },
                        { name: 'team_id', type: 'uuid', key: 'foreign' },
                    ],
                },
            },
            {
                id: 'team',
                data: {
                    label: 'Team',
                    fields: [{ name: 'id', type: 'uuid', key: 'primary' }],
                },
            },
        ],
        edges: [
            {
                id: 'e1',
                source: 'user',
                sourceHandle: 'team_id',
                target: 'team',
                targetHandle: 'id',
                label: 'belongs to',
            },
        ],
    };
}

describe('toDot', () => {
    it('emits a digraph wrapper with default graph name', () => {
        const out = toDot(makeCanvas());
        expect(out).toMatch(/^digraph "schema" \{/);
        expect(out).toMatch(/\}\s*$/);
    });

    it('emits the default rankdir=LR directive', () => {
        expect(toDot(makeCanvas())).toMatch(/rankdir=LR;/);
    });

    it('honors rankdir option', () => {
        expect(toDot(makeCanvas(), { rankdir: 'TB' })).toMatch(/rankdir=TB;/);
    });

    it('emits default node [shape=plaintext] attribute', () => {
        expect(toDot(makeCanvas())).toMatch(/node \[shape=plaintext\];/);
    });

    it('honors nodeShape option', () => {
        expect(toDot(makeCanvas(), { nodeShape: 'box' })).toMatch(
            /node \[shape=box\];/,
        );
    });

    it('emits one node block per node with HTML-like TABLE label', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain('"user" [label=');
        expect(out).toContain('"team" [label=');
        expect(out).toContain('<TABLE');
    });

    it('emits header rows containing the node label', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain('<B>User</B>');
        expect(out).toContain('<B>Team</B>');
    });

    it('emits a PORT per field', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain('PORT="id"');
        expect(out).toContain('PORT="team_id"');
    });

    it('renders PK/FK markers when includeFieldKeys is true (default)', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain('<TD>PK</TD>');
        expect(out).toContain('<TD>FK</TD>');
    });

    it('renders field type cells when includeFieldTypes is true (default)', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain('<TD>uuid</TD>');
    });

    it('hides field types when includeFieldTypes: false', () => {
        const out = toDot(makeCanvas(), { includeFieldTypes: false });
        expect(out).not.toContain('<TD>uuid</TD>');
    });

    it('hides PK/FK markers when includeFieldKeys: false', () => {
        const out = toDot(makeCanvas(), { includeFieldKeys: false });
        expect(out).not.toContain('<TD>PK</TD>');
        expect(out).not.toContain('<TD>FK</TD>');
    });

    it('adjusts header COLSPAN when optional columns are hidden', () => {
        const bothOn = toDot(makeCanvas());
        expect(bothOn).toContain('COLSPAN="3"');

        const noKeys = toDot(makeCanvas(), { includeFieldKeys: false });
        expect(noKeys).toContain('COLSPAN="2"');

        const nameOnly = toDot(makeCanvas(), {
            includeFieldKeys: false,
            includeFieldTypes: false,
        });
        expect(nameOnly).toContain('COLSPAN="1"');
    });

    it('emits edges with ported source/target and label', () => {
        const out = toDot(makeCanvas());
        expect(out).toContain(
            '"user":"team_id" -> "team":"id" [label="belongs to"];',
        );
    });

    it('emits edges without port refs when handles are absent', () => {
        const canvas = {
            nodes: [{ id: 'a', data: { label: 'A', fields: [] } }],
            edges: [{ id: 'e', source: 'a', target: 'a' }],
        };
        expect(toDot(canvas)).toContain('"a" -> "a";');
    });

    it('escapes HTML-like specials in field names and labels', () => {
        const canvas = {
            nodes: [
                {
                    id: 'weird',
                    data: {
                        label: 'Weird & Co.',
                        fields: [{ name: 'a<b>', type: 'x' }],
                    },
                },
            ],
            edges: [],
        };
        const out = toDot(canvas);
        expect(out).toContain('Weird &amp; Co.');
        expect(out).toContain('a&lt;b&gt;');
        // Port uses the same escape rule
        expect(out).toContain('PORT="a&lt;b&gt;"');
    });

    it('escapes quoted-string specials in node IDs and edge labels', () => {
        const canvas = {
            nodes: [{ id: 'q"id', data: { label: 'X', fields: [] } }],
            edges: [
                {
                    id: 'e',
                    source: 'q"id',
                    target: 'q"id',
                    label: 'has "quotes"',
                },
            ],
        };
        const out = toDot(canvas);
        expect(out).toContain('"q\\"id"');
        expect(out).toContain('[label="has \\"quotes\\""]');
    });

    it('escapes backslashes in quoted strings (doubled, not re-escaped)', () => {
        const canvas = {
            nodes: [{ id: 'a\\b', data: { label: 'X', fields: [] } }],
            edges: [],
        };
        const out = toDot(canvas);
        expect(out).toContain('"a\\\\b"');
    });

    it('handles empty canvas gracefully', () => {
        const out = toDot({ nodes: [], edges: [] });
        expect(out).toMatch(/^digraph "schema" \{/);
        expect(out).toMatch(/\}\s*$/);
        expect(out).not.toContain('[label=<');
    });

    it('tolerates a node with missing label and missing field type', () => {
        const canvas = {
            nodes: [
                {
                    id: 'n1',
                    data: { fields: [{ name: 'x' }] },
                },
            ],
            edges: [],
        };
        const out = toDot(canvas);
        expect(out).toContain('"n1" [label=');
        // Empty label cell still renders (no crash)
        expect(out).toContain('<B></B>');
        // Empty type cell still renders
        expect(out).toContain('<TD></TD>');
    });

    it('tolerates a node with non-array fields', () => {
        const canvas = {
            nodes: [{ id: 'n1', data: { label: 'N', fields: null as any } }],
            edges: [],
        };
        const out = toDot(canvas);
        expect(out).toContain('"n1" [label=');
        expect(out).toContain('<B>N</B>');
    });

    it('uses custom graphName when supplied', () => {
        expect(
            toDot({ nodes: [], edges: [] }, { graphName: 'my-graph' }),
        ).toMatch(/^digraph "my-graph"/);
    });

    it('escapes special chars in the graph name', () => {
        const out = toDot({ nodes: [], edges: [] }, { graphName: 'a"b' });
        expect(out).toMatch(/^digraph "a\\"b"/);
    });

    it('renders an edge with only a label (no handles)', () => {
        const canvas = {
            nodes: [
                { id: 'a', data: { label: 'A', fields: [] } },
                { id: 'b', data: { label: 'B', fields: [] } },
            ],
            edges: [{ id: 'e', source: 'a', target: 'b', label: 'uses' }],
        };
        expect(toDot(canvas)).toContain('"a" -> "b" [label="uses"];');
    });
});
