const V = "__alpineflow_registry__";
function ae() {
  return typeof globalThis < "u" ? (globalThis[V] || (globalThis[V] = /* @__PURE__ */ new Map()), globalThis[V]) : /* @__PURE__ */ new Map();
}
function ce(e, t) {
  ae().set(e, t);
}
function le(e, t, s, n) {
  const r = [];
  return { edges: e.map((d) => {
    let a = d;
    return d.source === t && d.sourceHandle === s && (a = { ...a, sourceHandle: n }), d.target === t && d.targetHandle === s && (a = { ...a, targetHandle: n }), a !== d && r.push(d.id), a;
  }), cascadedIds: r };
}
function fe(e, t, s) {
  const n = [];
  return { edges: e.filter((i) => {
    const d = i.source === t && i.sourceHandle === s || i.target === t && i.targetHandle === s;
    return d && n.push(i.id), !d;
  }), droppedIds: n };
}
const ue = /^[a-z][a-z0-9_]*$/, pe = 40;
function se(e) {
  return typeof e == "string" && e.length <= pe && ue.test(e);
}
function J(e, t, s) {
  const n = e?.el ?? e?._container;
  if (!n || typeof n.dispatchEvent != "function")
    return;
  const r = [], i = typeof window < "u" ? window : void 0, d = (a) => {
    r.push(a.error ?? a.message), a.preventDefault();
  };
  i && typeof i.addEventListener == "function" && i.addEventListener("error", d, !0);
  try {
    n.dispatchEvent(new CustomEvent(t, { detail: s, bubbles: !0 }));
  } catch (a) {
    r.push(a);
  } finally {
    i && typeof i.removeEventListener == "function" && i.removeEventListener("error", d, !0);
  }
  for (const a of r)
    console.error("[alpineflow/schema] listener threw while handling", t, a);
}
function z(e, t) {
  return e?.nodes?.find((s) => s.id === t) ?? null;
}
function me(e, t, s) {
  const n = z(e, t);
  return n ? se(s?.name) ? (n.data || (n.data = { label: t, fields: [] }), (n.data.fields ?? []).some((i) => i.name === s.name) ? { applied: !1, reason: "duplicate" } : (Array.isArray(n.data.fields) || (n.data.fields = []), n.data.fields.push({ ...s }), J(e, "schema:field-added", { nodeId: t, field: { ...s } }), { applied: !0 })) : { applied: !1, reason: "invalid-name" } : { applied: !1, reason: "no-node" };
}
function ge(e, t, s, n) {
  if (s === n)
    return { applied: !1, reason: "unchanged", cascadedEdgeIds: [] };
  if (!se(n))
    return { applied: !1, reason: "invalid-name", cascadedEdgeIds: [] };
  const r = z(e, t);
  if (!r)
    return { applied: !1, reason: "no-node", cascadedEdgeIds: [] };
  const i = r.data?.fields ?? [], d = i.find((u) => u.name === s);
  if (!d)
    return { applied: !1, reason: "no-field", cascadedEdgeIds: [] };
  if (i.some((u) => u.name === n))
    return { applied: !1, reason: "duplicate", cascadedEdgeIds: [] };
  d.name = n;
  const a = e.edges ?? [], { edges: o, cascadedIds: c } = le(a, t, s, n);
  return c.length > 0 && e.edges.splice(0, e.edges.length, ...o), J(e, "schema:field-renamed", {
    nodeId: t,
    oldName: s,
    newName: n,
    cascadedEdgeIds: c
  }), c.length > 0 && J(e, "schema:edges-cascaded", {
    nodeId: t,
    fieldName: n,
    edgeIds: c,
    operation: "rename"
  }), { applied: !0, cascadedEdgeIds: c };
}
function he(e, t, s) {
  const n = z(e, t);
  if (!n)
    return { applied: !1, reason: "no-node", droppedEdgeIds: [] };
  const i = (n.data?.fields ?? []).findIndex((c) => c.name === s);
  if (i === -1)
    return { applied: !1, reason: "no-field", droppedEdgeIds: [] };
  n.data.fields.splice(i, 1);
  const d = e.edges ?? [], { edges: a, droppedIds: o } = fe(d, t, s);
  return o.length > 0 && e.edges.splice(0, e.edges.length, ...a), J(e, "schema:field-removed", {
    nodeId: t,
    fieldName: s,
    droppedEdgeIds: o
  }), o.length > 0 && J(e, "schema:edges-cascaded", {
    nodeId: t,
    fieldName: s,
    edgeIds: o,
    operation: "remove"
  }), { applied: !0, droppedEdgeIds: o };
}
function ye(e, t, s) {
  if (!Array.isArray(s))
    return { applied: !1, reason: "mismatch" };
  if (new Set(s).size !== s.length)
    return { applied: !1, reason: "mismatch" };
  const n = z(e, t);
  if (!n)
    return { applied: !1, reason: "no-node" };
  const r = n.data?.fields ?? [];
  if (s.length !== r.length)
    return { applied: !1, reason: "mismatch" };
  const i = new Set(r.map((c) => c.name)), d = new Set(s);
  if (i.size !== d.size)
    return { applied: !1, reason: "mismatch" };
  for (const c of s)
    if (!i.has(c))
      return { applied: !1, reason: "mismatch" };
  const a = /* @__PURE__ */ Object.create(null);
  for (const c of r)
    a[c.name] = c;
  const o = s.map((c) => a[c]);
  return n.data.fields.splice(0, n.data.fields.length, ...o), { applied: !0 };
}
function ie(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.id, n);
  const s = [];
  for (const n of e) {
    const r = n.data?.fields ?? [];
    for (const i of r) {
      if (typeof i?.name != "string" || !i.name.endsWith("_id"))
        continue;
      const d = i.name.slice(0, -3);
      if (!d)
        continue;
      const a = t.get(d);
      if (!a || a.id === n.id)
        continue;
      const o = a.data?.fields ?? [], u = o.find((f) => f.key === "primary")?.name ?? o[0]?.name ?? "id";
      s.push({
        fromNodeId: n.id,
        fromFieldName: i.name,
        toNodeId: a.id,
        toFieldName: u,
        confidence: "exact"
      });
    }
  }
  return s;
}
function K(e) {
  const t = (e.nodes ?? []).map((n) => ({
    id: n.id,
    label: n.data?.label ?? "",
    fields: (n.data?.fields ?? []).map((r) => ({ ...r })),
    position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 }
  })), s = (e.edges ?? []).map((n) => {
    const r = { id: n.id, source: n.source, target: n.target };
    return n.sourceHandle !== void 0 && (r.sourceHandle = n.sourceHandle), n.targetHandle !== void 0 && (r.targetHandle = n.targetHandle), n.label !== void 0 && (r.label = n.label), r;
  });
  return { version: 1, nodes: t, edges: s };
}
function de(e, t) {
  if (!t || typeof t.version != "number")
    throw new Error("[alpineflow/schema] schemaFromJSON: missing or invalid version");
  if (t.version !== 1)
    throw new Error(`[alpineflow/schema] schemaFromJSON: unsupported version ${t.version}`);
  const s = (t.nodes ?? []).map((r) => ({
    id: r.id,
    position: { x: r.position?.x ?? 0, y: r.position?.y ?? 0 },
    data: {
      label: r.label,
      fields: (r.fields ?? []).map((i) => ({ ...i }))
    }
  })), n = (t.edges ?? []).map((r) => {
    const i = { id: r.id, source: r.source, target: r.target };
    return r.sourceHandle !== void 0 && (i.sourceHandle = r.sourceHandle), r.targetHandle !== void 0 && (i.targetHandle = r.targetHandle), r.label !== void 0 && (i.label = r.label), i;
  });
  e.nodes.splice(0, e.nodes.length, ...s), e.edges.splice(0, e.edges.length, ...n);
}
function Ee(e, t) {
  for (const o of t)
    if (o && typeof o.source == "string" && o.source === o.target)
      return !0;
  const s = /* @__PURE__ */ new Map(), n = (o) => {
    let c = s.get(o);
    return c || (c = [], s.set(o, c)), c;
  };
  for (const o of e)
    o && typeof o.id == "string" && n(o.id);
  for (const o of t)
    !o || typeof o.source != "string" || typeof o.target != "string" || (n(o.source).push(o.target), n(o.target));
  const r = 0, i = 1, d = 2, a = /* @__PURE__ */ new Map();
  for (const o of s.keys())
    a.set(o, r);
  for (const o of s.keys()) {
    if (a.get(o) !== r) continue;
    const c = [{ node: o, idx: 0 }];
    for (a.set(o, i); c.length > 0; ) {
      const u = c[c.length - 1], f = s.get(u.node) ?? [];
      if (u.idx < f.length) {
        const g = f[u.idx++], p = a.get(g);
        if (p === i)
          return !0;
        p === r && (a.set(g, i), c.push({ node: g, idx: 0 }));
      } else
        a.set(u.node, d), c.pop();
    }
  }
  return !1;
}
function ve(e) {
  const t = [], s = Array.isArray(e?.nodes) ? e.nodes : [], n = Array.isArray(e?.edges) ? e.edges : [], r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const o of s)
    !o || typeof o.id != "string" || (r.has(o.id) && i.add(o.id), r.add(o.id));
  for (const o of i)
    t.push({
      severity: "error",
      code: "duplicate-node-id",
      nodeId: o,
      message: `Duplicate node id "${o}".`
    });
  for (const o of s) {
    if (!o || typeof o.id != "string") continue;
    const c = Array.isArray(o.data?.fields) ? o.data.fields : [];
    if (c.length === 0) continue;
    const u = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set();
    for (const p of c)
      !p || typeof p.name != "string" || (u.has(p.name) && f.add(p.name), u.add(p.name));
    for (const p of f)
      t.push({
        severity: "error",
        code: "duplicate-field",
        nodeId: o.id,
        fieldName: p,
        message: `Duplicate field "${p}" on node "${o.id}".`
      });
    c.some((p) => p && p.key === "primary") || t.push({
      severity: "warning",
      code: "missing-primary-key",
      nodeId: o.id,
      message: `Node "${o.id}" has no primary-key field.`
    });
  }
  for (const o of n) {
    if (!o) continue;
    const c = typeof o.id == "string" ? o.id : void 0;
    (typeof o.source != "string" || !r.has(o.source)) && t.push({
      severity: "error",
      code: "dangling-edge",
      edgeId: c,
      nodeId: typeof o.source == "string" ? o.source : void 0,
      message: `Edge ${c ? `"${c}" ` : ""}references missing source node "${o.source}".`
    }), (typeof o.target != "string" || !r.has(o.target)) && t.push({
      severity: "error",
      code: "dangling-edge",
      edgeId: c,
      nodeId: typeof o.target == "string" ? o.target : void 0,
      message: `Edge ${c ? `"${c}" ` : ""}references missing target node "${o.target}".`
    });
  }
  const d = /* @__PURE__ */ new Set();
  for (const o of n)
    o && (typeof o.source == "string" && d.add(o.source), typeof o.target == "string" && d.add(o.target));
  for (const o of s)
    !o || typeof o.id != "string" || d.has(o.id) || t.push({
      severity: "warning",
      code: "disconnected-node",
      nodeId: o.id,
      message: `Node "${o.id}" has no connected edges.`
    });
  return Ee(s, n) && t.push({
    severity: "warning",
    code: "cycle",
    message: "Directed cycle detected in edge graph."
  }), { valid: !t.some((o) => o.severity === "error"), issues: t };
}
function te(e) {
  return !e || !Array.isArray(e.nodes) ? [] : e.nodes.filter((t) => !!t && typeof t.id == "string");
}
function ne(e) {
  return !e || !Array.isArray(e.edges) ? [] : e.edges.filter((t) => !!t && typeof t.id == "string");
}
function oe(e) {
  const t = /* @__PURE__ */ new Map(), s = Array.isArray(e.fields) ? e.fields : [];
  for (const n of s)
    n && typeof n.name == "string" && t.set(n.name, n);
  return t;
}
function be(e, t, s = {}) {
  const n = te(e), r = te(t), i = ne(e), d = ne(t), a = /* @__PURE__ */ new Map();
  for (const l of n)
    a.set(l.id, l);
  const o = /* @__PURE__ */ new Map();
  for (const l of r)
    o.set(l.id, l);
  const c = [], u = [];
  for (const l of o.keys())
    a.has(l) || c.push(l);
  for (const l of a.keys())
    o.has(l) || u.push(l);
  const f = [], g = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
  if (s.detectRenames) {
    const l = (h) => (Array.isArray(h.fields) ? h.fields : []).filter((T) => T && typeof T.name == "string").map((T) => T.name).sort().join("\0");
    for (const h of u) {
      const I = a.get(h);
      if (!I) continue;
      const T = l(I), D = [];
      for (const x of c) {
        if (g.has(x)) continue;
        const C = o.get(x);
        C && l(C) === T && D.push(x);
      }
      if (D.length === 1) {
        const x = D[0];
        f.push({ from: h, to: x }), g.add(x), p.add(h);
      }
    }
  }
  const b = c.filter((l) => !g.has(l)), m = u.filter((l) => !p.has(l)), y = [];
  for (const l of a.keys())
    o.has(l) && y.push({ beforeId: l, afterId: l });
  for (const l of f)
    y.push({ beforeId: l.from, afterId: l.to });
  const E = /* @__PURE__ */ new Map();
  for (const l of s.fieldRenames ?? []) {
    if (!l || typeof l.nodeId != "string" || typeof l.from != "string" || typeof l.to != "string") continue;
    let h = E.get(l.nodeId);
    h || (h = [], E.set(l.nodeId, h)), h.push({ from: l.from, to: l.to });
  }
  const S = /* @__PURE__ */ new Map();
  for (const l of f)
    S.set(l.from, l.to);
  for (const l of s.fieldRenames ?? []) {
    if (!l || typeof l.nodeId != "string") continue;
    const h = S.get(l.nodeId);
    if (h && !E.has(h)) {
      const I = E.get(l.nodeId) ?? [];
      E.set(h, I);
    }
  }
  const v = [], A = [], F = [], N = [];
  for (const { beforeId: l, afterId: h } of y) {
    const I = a.get(l), T = o.get(h);
    if (!I || !T) continue;
    const D = oe(I), x = oe(T), C = E.get(h) ?? E.get(l) ?? [], q = /* @__PURE__ */ new Set(), j = /* @__PURE__ */ new Set();
    for (const w of C) {
      const B = D.get(w.from), M = x.get(w.to);
      if (!B || !M || q.has(w.from) || j.has(w.to)) continue;
      v.push({ nodeId: h, from: w.from, to: w.to }), q.add(w.from), j.add(w.to);
      const Y = typeof B.type == "string" ? B.type : "", G = typeof M.type == "string" ? M.type : "";
      Y !== G && N.push({
        nodeId: h,
        fieldName: w.to,
        from: Y,
        to: G
      });
    }
    for (const [w] of x)
      j.has(w) || D.has(w) || A.push({ nodeId: h, fieldName: w });
    for (const [w] of D)
      q.has(w) || x.has(w) || F.push({ nodeId: h, fieldName: w });
    for (const [w, B] of D) {
      if (q.has(w)) continue;
      const M = x.get(w);
      if (!M) continue;
      const Y = typeof B.type == "string" ? B.type : "", G = typeof M.type == "string" ? M.type : "";
      Y !== G && N.push({
        nodeId: h,
        fieldName: w,
        from: Y,
        to: G
      });
    }
  }
  const R = /* @__PURE__ */ new Set();
  for (const l of i) R.add(l.id);
  const H = /* @__PURE__ */ new Set();
  for (const l of d) H.add(l.id);
  const $ = [], P = [];
  for (const l of H)
    R.has(l) || $.push(l);
  for (const l of R)
    H.has(l) || P.push(l);
  b.sort(), m.sort(), f.sort((l, h) => l.from.localeCompare(h.from));
  const L = (l) => `${l.nodeId}\0${l.fieldName}`;
  return A.sort((l, h) => L(l).localeCompare(L(h))), F.sort((l, h) => L(l).localeCompare(L(h))), v.sort((l, h) => {
    const I = l.nodeId.localeCompare(h.nodeId);
    return I !== 0 ? I : l.from.localeCompare(h.from);
  }), N.sort((l, h) => L(l).localeCompare(L(h))), $.sort(), P.sort(), {
    addedNodes: b,
    removedNodes: m,
    renamedNodes: f,
    addedFields: A,
    removedFields: F,
    renamedFields: v,
    changedFieldTypes: N,
    addedEdges: $,
    removedEdges: P
  };
}
const we = {
  rankdir: "LR",
  nodeShape: "plaintext",
  includeFieldTypes: !0,
  includeFieldKeys: !0,
  graphName: "schema"
};
function W(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function _(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function Se(e, t) {
  const s = String(e?.id ?? ""), n = String(e?.data?.label ?? ""), r = Array.isArray(e?.data?.fields) ? e.data.fields : [], i = 1 + (t.includeFieldKeys ? 1 : 0) + (t.includeFieldTypes ? 1 : 0), d = [];
  d.push(
    `      <TR><TD BGCOLOR="#f0f0f0" COLSPAN="${i}"><B>${W(n)}</B></TD></TR>`
  );
  for (const a of r) {
    const o = String(a?.name ?? ""), c = [];
    if (t.includeFieldKeys) {
      const u = a?.key === "primary" ? "PK" : a?.key === "foreign" ? "FK" : "";
      c.push(`<TD>${u}</TD>`);
    }
    c.push(`<TD PORT="${W(o)}">${W(o)}</TD>`), t.includeFieldTypes && c.push(`<TD>${W(String(a?.type ?? ""))}</TD>`), d.push(`      <TR>${c.join("")}</TR>`);
  }
  return `  "${_(s)}" [label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
${d.join(`
`)}
    </TABLE>
  >];`;
}
function Ie(e) {
  const t = `"${_(String(e?.source ?? ""))}"`, s = `"${_(String(e?.target ?? ""))}"`, n = e?.sourceHandle ? `:"${_(String(e.sourceHandle))}"` : "", r = e?.targetHandle ? `:"${_(String(e.targetHandle))}"` : "", i = e?.label ? ` [label="${_(String(e.label))}"]` : "";
  return `  ${t}${n} -> ${s}${r}${i};`;
}
function Ae(e, t = {}) {
  const s = { ...we, ...t }, n = [];
  n.push(`digraph "${_(s.graphName)}" {`), n.push(`  rankdir=${s.rankdir};`), n.push(`  node [shape=${s.nodeShape}];`);
  for (const r of e?.nodes ?? [])
    n.push(Se(r, s));
  for (const r of e?.edges ?? [])
    n.push(Ie(r));
  return n.push("}"), n.join(`
`);
}
const Ne = ["dagre", "tree", "grid"];
async function Ce(e, t = {}) {
  const s = t.direction ?? "LR", n = t.nodeSpacing ?? 80, r = t.rankSpacing ?? 160, i = Le(t.algorithm), d = t.deriveFromReferences ? xe(e) : null;
  try {
    for (const a of i) {
      if (a === "dagre" && Fe(e, s, n, r) || a === "tree" && Te(e, s, n, r))
        return;
      if (a === "grid") {
        Re(e.nodes ?? [], n, r, s);
        return;
      }
    }
    console.warn(
      '[alpineflow/schema] schemaLayout: no layout algorithm available. Register @getartisanflow/alpineflow/dagre (or hierarchy), or pass { algorithm: "grid" } for the always-available fallback.'
    );
  } finally {
    d && d.restore();
  }
}
function Le(e) {
  return e ? [e] : [...Ne];
}
function xe(e) {
  const t = e.edges;
  if (!Array.isArray(t))
    return null;
  const s = t.slice(), n = ie(e.nodes ?? []).map((r, i) => ({
    id: `schema-layout-inferred-${i}`,
    source: r.fromNodeId,
    target: r.toNodeId,
    sourceHandle: r.fromFieldName,
    targetHandle: r.toFieldName
  }));
  return t.splice(0, t.length, ...n), {
    restore: () => {
      t.splice(0, t.length, ...s);
    }
  };
}
function Fe(e, t, s, n) {
  if (typeof e.layout != "function")
    return !1;
  try {
    return e.layout({
      direction: t,
      nodesep: s,
      ranksep: n
    }), !0;
  } catch {
    return !1;
  }
}
function Te(e, t, s, n) {
  if (typeof e.treeLayout != "function")
    return !1;
  try {
    return e.treeLayout({
      direction: t,
      nodeWidth: s + 200,
      nodeHeight: n + 80
    }), !0;
  } catch {
    return !1;
  }
}
function Re(e, t, s, n) {
  const r = e.length;
  if (r === 0)
    return;
  const i = Math.max(1, Math.ceil(Math.sqrt(r))), d = Math.ceil(r / i), a = t + 300, o = s + 200;
  for (let c = 0; c < r; c++) {
    const u = c % i, f = Math.floor(c / i);
    let g = u * a, p = f * o;
    n === "BT" ? p = (d - 1 - f) * o : n === "RL" && (g = (i - 1 - u) * a), e[c].position = { x: g, y: p };
  }
}
const re = [
  "schema:field-added",
  "schema:field-renamed",
  "schema:field-removed",
  "schema:edges-cascaded"
];
function ze(e, t = {}) {
  const s = Math.max(1, t.limit ?? 50), n = [], r = [];
  let i = 0, d = 0, a = null, o = !1;
  const c = e?.el ?? e?._container ?? null;
  if (!c || typeof c.addEventListener != "function")
    return De();
  const u = () => {
    for (; n.length > s && n.length > 1; )
      n.shift();
  }, f = (y) => {
    const E = n[n.length - 1];
    E !== void 0 && JSON.stringify(E) === JSON.stringify(y) || (n.push(y), u(), r.length = 0);
  }, g = () => {
    o || i > 0 || d > 0 || f(K(e));
  };
  n.push(K(e));
  const p = () => {
    g();
  };
  for (const y of re)
    c.addEventListener(y, p);
  const b = (y) => {
    i++;
    try {
      de(e, y);
    } finally {
      i--;
    }
  };
  return {
    get canUndo() {
      return n.length > 1;
    },
    get canRedo() {
      return r.length > 0;
    },
    undo() {
      if (o || n.length <= 1)
        return !1;
      const y = n.pop();
      r.push(y);
      const E = n[n.length - 1];
      return b(E), !0;
    },
    redo() {
      if (o || r.length === 0)
        return !1;
      const y = r.pop();
      return n.push(y), b(y), !0;
    },
    clear() {
      n.length = 0, r.length = 0, o || n.push(K(e));
    },
    batch(y) {
      if (o)
        return y();
      d === 0 && (a = K(e)), d++;
      try {
        const E = y();
        return d--, d === 0 && (a = null, i === 0 && !o && f(K(e))), E;
      } catch (E) {
        if (d--, d === 0) {
          const S = a;
          a = null, S && !o && b(S);
        }
        throw E;
      }
    },
    dispose() {
      if (!o) {
        o = !0;
        for (const y of re)
          c.removeEventListener(y, p);
        n.length = 0, r.length = 0, a = null;
      }
    }
  };
}
function De() {
  return {
    get canUndo() {
      return !1;
    },
    get canRedo() {
      return !1;
    },
    undo: () => !1,
    redo: () => !1,
    clear: () => {
    },
    batch(e) {
      return e();
    },
    dispose: () => {
    }
  };
}
function k(e) {
  if (!e || e.size === 0)
    return null;
  let t = null;
  for (const s of e)
    t = s;
  return t;
}
function $e(e) {
  if (!e)
    return null;
  const t = e.indexOf(".");
  return t < 1 || t === e.length - 1 ? null : { nodeId: e.slice(0, t), fieldName: e.slice(t + 1) };
}
function X(e, t) {
  const s = t.closest(".flow-container");
  if (s)
    try {
      return e.$data(s) ?? null;
    } catch {
    }
  const n = document.querySelectorAll(".flow-container");
  if (n.length === 1)
    try {
      return e.$data(n[0]) ?? null;
    } catch {
    }
  return n.length > 1 && !window.__alpineflowSchemaMultiCanvasWarned && (window.__alpineflowSchemaMultiCanvasWarned = !0, console.warn(
    "[alpineflow/schema] inspector directive found multiple .flow-container elements on the page; place inspector inside the canvas OR scope the directive expression to a specific canvas (multi-canvas scope selector is on the v0.2.2 roadmap)."
  )), null;
}
function Q(e) {
  return e.querySelector(
    ":scope > template[x-schema-default-ui]"
  );
}
function U(e) {
  const t = e.querySelector(":scope > [data-schema-default-ui-root]");
  t && t.remove();
}
function Z(e) {
  const t = document.createElement("div");
  return t.setAttribute("data-schema-default-ui-root", ""), e.appendChild(t), t;
}
function ee(e) {
  if (!e)
    return null;
  const t = document.activeElement;
  if (!t || !(t instanceof HTMLElement) || !e.contains(t))
    return null;
  const s = t.getAttribute("data-field");
  if (!s)
    return null;
  let n = null, r = null;
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)
    try {
      n = t.selectionStart, r = t.selectionEnd;
    } catch {
    }
  return {
    field: s,
    tagName: t.tagName.toLowerCase(),
    selectionStart: n,
    selectionEnd: r
  };
}
function ke(e) {
  return typeof globalThis.CSS < "u" && typeof globalThis.CSS.escape == "function" ? globalThis.CSS.escape(e) : e.replace(/["\\]/g, "\\$&");
}
function O(e, t) {
  if (!e || !t)
    return;
  const s = e.querySelector(
    `[data-field="${ke(t.field)}"]`
  );
  if (s && s.tagName.toLowerCase() === t.tagName)
    try {
      s.focus({ preventScroll: !0 }), (s instanceof HTMLInputElement || s instanceof HTMLTextAreaElement) && t.selectionStart !== null && t.selectionEnd !== null && s.setSelectionRange(t.selectionStart, t.selectionEnd);
    } catch {
    }
}
function He(e) {
  e.directive(
    "schema-node-inspector",
    (t, s, { effect: n, cleanup: r }) => {
      const i = t, d = X(e, i);
      if (!d)
        return;
      const a = Q(i), o = {
        addField(u) {
          const f = k(d.selectedNodes);
          return f ? d.addField?.(f, u) ?? { applied: !1, reason: "no-helper" } : { applied: !1, reason: "no-selection" };
        },
        renameField(u, f) {
          const g = k(d.selectedNodes);
          return g ? d.renameField?.(g, u, f) ?? {
            applied: !1,
            reason: "no-helper",
            cascadedEdgeIds: []
          } : { applied: !1, reason: "no-selection", cascadedEdgeIds: [] };
        },
        removeField(u) {
          const f = k(d.selectedNodes);
          return f ? d.removeField?.(f, u) ?? {
            applied: !1,
            reason: "no-helper",
            droppedEdgeIds: []
          } : { applied: !1, reason: "no-selection", droppedEdgeIds: [] };
        },
        reorderFields(u) {
          const f = k(d.selectedNodes);
          return f ? d.reorderFields?.(f, u) ?? {
            applied: !1,
            reason: "no-helper"
          } : { applied: !1, reason: "no-selection" };
        }
      }, c = e.addScopeToNode(i, {
        inspector: o,
        get selectedNode() {
          const u = k(d.selectedNodes);
          return u ? d.nodes?.find((f) => f.id === u) ?? null : null;
        }
      });
      a && n(() => {
        Me(i, d);
      }), r(() => {
        U(i), c?.();
      });
    }
  );
}
function Me(e, t) {
  const s = e.querySelector(
    ":scope > [data-schema-default-ui-root]"
  ), n = ee(s);
  U(e);
  const r = Z(e), i = k(t.selectedNodes), d = i ? t.nodes?.find((m) => m.id === i) : null;
  if (!d) {
    const m = document.createElement("div");
    m.setAttribute("data-schema-inspector-empty", ""), m.textContent = "No node selected.", r.appendChild(m), O(r, n);
    return;
  }
  const a = document.createElement("header");
  a.setAttribute("data-schema-inspector-label", ""), a.textContent = String(d.data?.label ?? d.id), r.appendChild(a);
  const o = document.createElement("ul");
  o.setAttribute("data-schema-inspector-fields", "");
  const c = Array.isArray(d.data?.fields) ? d.data.fields : [];
  for (const m of c) {
    const y = document.createElement("li");
    y.setAttribute("data-schema-inspector-field", ""), y.dataset.fieldName = String(m?.name ?? "");
    const E = document.createElement("span");
    if (E.textContent = String(m?.name ?? ""), y.appendChild(E), m?.type) {
      const v = document.createElement("span");
      v.setAttribute("data-field-type", ""), v.textContent = String(m.type), y.appendChild(v);
    }
    const S = document.createElement("button");
    S.type = "button", S.setAttribute("data-action", "remove"), S.textContent = "remove", S.addEventListener("click", () => {
      t.removeField?.(d.id, m.name);
    }), y.appendChild(S), o.appendChild(y);
  }
  r.appendChild(o);
  const u = document.createElement("form");
  u.setAttribute("data-schema-inspector-add-field", "");
  const f = document.createElement("input");
  f.setAttribute("data-field", "name"), f.placeholder = "field name", u.appendChild(f);
  const g = Array.isArray(t._config?.fieldTypeRegistry) ? t._config.fieldTypeRegistry : null;
  let p;
  if (g && g.length > 0) {
    const m = document.createElement("select");
    m.setAttribute("data-field", "type");
    for (const y of g) {
      const E = document.createElement("option");
      E.value = y, E.textContent = y, m.appendChild(E);
    }
    m.value = g[0], p = m;
  } else {
    const m = document.createElement("input");
    m.setAttribute("data-field", "type"), m.placeholder = "type", m.value = "text", p = m;
  }
  u.appendChild(p);
  const b = document.createElement("button");
  b.type = "submit", b.textContent = "add", u.appendChild(b), u.addEventListener("submit", (m) => {
    m.preventDefault();
    const y = f.value.trim();
    if (!y)
      return;
    const E = p.value, S = (typeof E == "string" ? E.trim() : "") || "text";
    t.addField?.(d.id, { name: y, type: S })?.applied && (f.value = "");
  }), r.appendChild(u), O(r, n);
}
function _e(e) {
  e.directive(
    "schema-row-inspector",
    (t, s, { effect: n, cleanup: r }) => {
      const i = t, d = X(e, i);
      if (!d)
        return;
      const a = Q(i), o = () => $e(k(d.selectedRows)), c = () => {
        const g = o();
        if (!g)
          return null;
        const p = d.nodes?.find((m) => m.id === g.nodeId);
        return p ? (p.data?.fields ?? []).find((m) => m?.name === g.fieldName) ?? null : null;
      }, u = {
        renameField(g) {
          const p = o();
          return p ? d.renameField?.(p.nodeId, p.fieldName, g) ?? {
            applied: !1,
            reason: "no-helper",
            cascadedEdgeIds: []
          } : { applied: !1, reason: "no-selection", cascadedEdgeIds: [] };
        },
        removeField() {
          const g = o();
          return g ? d.removeField?.(g.nodeId, g.fieldName) ?? {
            applied: !1,
            reason: "no-helper",
            droppedEdgeIds: []
          } : { applied: !1, reason: "no-selection", droppedEdgeIds: [] };
        },
        /**
         * Patch non-name properties (type, required, …) of the selected
         * field in place. For name changes, use `renameField` so edges
         * cascade correctly.
         */
        updateField(g) {
          const p = c();
          if (!p)
            return { applied: !1, reason: "no-selection" };
          for (const [b, m] of Object.entries(g))
            b !== "name" && (p[b] = m);
          return { applied: !0 };
        }
      }, f = e.addScopeToNode(i, {
        inspector: u,
        get selectedRow() {
          return o();
        }
      });
      a && n(() => {
        Oe(i, d, o());
      }), r(() => {
        U(i), f?.();
      });
    }
  );
}
function Oe(e, t, s) {
  const n = e.querySelector(
    ":scope > [data-schema-default-ui-root]"
  ), r = ee(n);
  U(e);
  const i = Z(e);
  if (!s) {
    const m = document.createElement("div");
    m.setAttribute("data-schema-inspector-empty", ""), m.textContent = "No row selected.", i.appendChild(m), O(i, r);
    return;
  }
  const a = t.nodes?.find((m) => m.id === s.nodeId)?.data?.fields?.find((m) => m?.name === s.fieldName) ?? null;
  if (!a) {
    const m = document.createElement("div");
    m.setAttribute("data-schema-inspector-empty", ""), m.textContent = "Selected row no longer exists.", i.appendChild(m), O(i, r);
    return;
  }
  const o = document.createElement("label");
  o.textContent = "name ";
  const c = document.createElement("input");
  c.setAttribute("data-field", "name"), c.value = String(a.name ?? ""), c.addEventListener("change", () => {
    const m = c.value.trim();
    !m || m === a.name || t.renameField?.(s.nodeId, s.fieldName, m);
  }), o.appendChild(c), i.appendChild(o);
  const u = document.createElement("label");
  u.textContent = "type ";
  const f = document.createElement("input");
  f.setAttribute("data-field", "type"), f.value = String(a.type ?? ""), f.addEventListener("change", () => {
    a.type = f.value;
  }), u.appendChild(f), i.appendChild(u);
  const g = document.createElement("label");
  g.textContent = "required ";
  const p = document.createElement("input");
  p.type = "checkbox", p.setAttribute("data-field", "required"), p.checked = !!a.required, p.addEventListener("change", () => {
    a.required = p.checked;
  }), g.appendChild(p), i.appendChild(g);
  const b = document.createElement("button");
  b.type = "button", b.setAttribute("data-action", "remove"), b.textContent = "remove", b.addEventListener("click", () => {
    t.removeField?.(s.nodeId, s.fieldName);
  }), i.appendChild(b), O(i, r);
}
function Pe(e) {
  e.directive(
    "schema-edge-inspector",
    (t, s, { effect: n, cleanup: r }) => {
      const i = t, d = X(e, i);
      if (!d)
        return;
      const a = Q(i), o = () => {
        const f = k(d.selectedEdges);
        return f ? d.edges?.find((g) => g.id === f) ?? null : null;
      }, c = {
        updateEdge(f) {
          const g = o();
          if (!g)
            return { applied: !1, reason: "no-selection" };
          for (const [p, b] of Object.entries(f))
            g[p] = b;
          return { applied: !0 };
        },
        setLabel(f) {
          return this.updateEdge({ label: f });
        },
        removeEdge() {
          const f = o();
          if (!f)
            return { applied: !1, reason: "no-selection" };
          if (typeof d.removeEdges == "function")
            return d.removeEdges([f.id]), { applied: !0 };
          const g = d.edges?.findIndex((p) => p.id === f.id) ?? -1;
          return g === -1 ? { applied: !1, reason: "no-helper" } : (d.edges.splice(g, 1), { applied: !0 });
        }
      }, u = e.addScopeToNode(i, {
        inspector: c,
        get selectedEdge() {
          return o();
        }
      });
      a && n(() => {
        qe(i, d, o());
      }), r(() => {
        U(i), u?.();
      });
    }
  );
}
function qe(e, t, s) {
  const n = e.querySelector(
    ":scope > [data-schema-default-ui-root]"
  ), r = ee(n);
  U(e);
  const i = Z(e);
  if (!s) {
    const c = document.createElement("div");
    c.setAttribute("data-schema-inspector-empty", ""), c.textContent = "No edge selected.", i.appendChild(c), O(i, r);
    return;
  }
  const d = document.createElement("label");
  d.textContent = "label ";
  const a = document.createElement("input");
  a.setAttribute("data-field", "label"), a.value = String(s.label ?? ""), a.addEventListener("input", () => {
    s.label = a.value;
  }), d.appendChild(a), i.appendChild(d);
  const o = document.createElement("button");
  o.type = "button", o.setAttribute("data-action", "delete"), o.textContent = "delete", o.addEventListener("click", () => {
    if (typeof t.removeEdges == "function")
      t.removeEdges([s.id]);
    else {
      const c = t.edges?.findIndex((u) => u.id === s.id) ?? -1;
      c !== -1 && t.edges.splice(c, 1);
    }
  }), i.appendChild(o), O(i, r);
}
const Be = 4;
function Ke(e) {
  e.directive(
    "schema-reorderable",
    (t, s, { cleanup: n }) => {
      const r = t;
      r.classList.add("flow-schema-reorderable"), r.style.touchAction = "none";
      let i = !1, d = !1, a = 0, o = 0, c = 0, u = null;
      const f = () => {
        const v = r.parentElement;
        return v ? Array.from(
          v.querySelectorAll(":scope > .flow-schema-row")
        ) : [];
      }, g = () => {
        for (const v of f())
          v.classList.remove("flow-schema-row-drop-target");
      }, p = (v) => {
        const A = r.parentElement;
        if (!A) return o;
        const F = Array.from(
          A.querySelectorAll(":scope > .flow-schema-row")
        ).filter((R) => R !== r);
        if (F.length === 0) return o;
        let N = 0;
        for (const R of F) {
          const H = R.getBoundingClientRect();
          H.top + H.height / 2 < v && N++;
        }
        return N;
      }, b = (v) => {
        g();
        const A = f();
        let F = v;
        v >= o && (F = v + 1);
        const N = A[F] ?? A[v];
        N && N !== r && N.classList.add("flow-schema-row-drop-target");
      }, m = () => {
        r.style.transform = "", r.classList.remove("flow-schema-row-dragging"), g();
      }, y = (v) => {
        if (i || v.button !== void 0 && v.button !== 0) return;
        i = !0, d = !1, a = v.clientY, u = v.pointerId ?? null, o = f().indexOf(r), c = o, r.classList.add("flow-schema-row-dragging");
        try {
          u !== null && typeof r.setPointerCapture == "function" && r.setPointerCapture(u);
        } catch {
        }
        document.addEventListener("pointermove", E), document.addEventListener("pointerup", S), document.addEventListener("pointercancel", S);
      }, E = (v) => {
        if (!i) return;
        const A = v.clientY - a;
        !d && Math.abs(A) > Be && (d = !0), r.style.transform = `translateY(${A}px)`, d && (c = p(v.clientY), b(c));
      }, S = (v) => {
        if (!i) return;
        const A = d, F = c, N = o;
        try {
          u !== null && typeof r.releasePointerCapture == "function" && typeof r.hasPointerCapture == "function" && r.hasPointerCapture(u) && r.releasePointerCapture(u);
        } catch {
        }
        if (document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", S), document.removeEventListener("pointercancel", S), i = !1, u = null, m(), !A)
          return;
        const R = (C) => {
          C.stopImmediatePropagation(), C.stopPropagation(), C.preventDefault();
        };
        r.addEventListener("click", R, { capture: !0, once: !0 }), setTimeout(() => {
          r.removeEventListener("click", R, { capture: !0 });
        }, 0);
        const $ = r.closest("[data-flow-node-id]")?.getAttribute("data-flow-node-id") ?? null;
        if (!$) return;
        const P = r.closest(".flow-container");
        if (!P) return;
        let L;
        try {
          L = e.$data(P);
        } catch {
          return;
        }
        if (!L || typeof L.reorderFields != "function") return;
        const h = (L.nodes ?? []).find((C) => C?.id === $)?.data?.fields ?? [];
        if (!Array.isArray(h) || h.length < 2) return;
        const I = h.map((C) => C.name);
        if (N < 0 || N >= I.length) return;
        const [T] = I.splice(N, 1), D = Math.max(0, Math.min(F, I.length));
        I.splice(D, 0, T), !I.every(
          (C, q) => h[q]?.name === C
        ) && L.reorderFields($, I);
      };
      r.addEventListener("pointerdown", y), n(() => {
        try {
          r.removeEventListener("pointerdown", y), typeof document < "u" && (document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", S), document.removeEventListener("pointercancel", S)), r.classList.remove("flow-schema-reorderable"), r.classList.remove("flow-schema-row-dragging"), g(), r.style.transform = "", r.style.touchAction = "";
        } catch {
        }
      });
    }
  );
}
function Ue(e) {
  const t = e.parentElement;
  return t ? Array.from(
    t.querySelectorAll(":scope > .flow-schema-row")
  ) : [];
}
function Ye(e, t) {
  const s = Ue(e), n = s.indexOf(e);
  if (n === -1) return;
  const r = s[n + t];
  r && r.focus();
}
function Ge(e, t) {
  const s = e.closest("[data-flow-node-id]");
  if (!s) return !1;
  const n = e.closest(".flow-container");
  if (!n) return !1;
  const r = Array.from(
    n.querySelectorAll("[data-flow-node-id]")
  ), i = r.indexOf(s);
  if (i === -1) return !1;
  const d = r[i + t];
  if (!d) return !1;
  const a = t === 1 ? d.querySelector(".flow-schema-row") : (() => {
    const o = d.querySelectorAll(".flow-schema-row");
    return o.length > 0 ? o[o.length - 1] : null;
  })();
  return a ? (a.focus(), !0) : !1;
}
function Je(e) {
  e.click();
}
function We(e) {
  e.directive(
    "schema-keyboard-nav",
    (t, s, { effect: n, cleanup: r }) => {
      const i = t;
      i.setAttribute("tabindex", "0"), i.setAttribute("role", "row"), n(() => {
        const a = i.dataset.flowSchemaField ?? "", c = i.querySelector(".flow-schema-row-type")?.textContent ?? "";
        i.setAttribute(
          "aria-label",
          `${a}${c ? " (" + c + ")" : ""}`
        );
      });
      const d = (a) => {
        const o = a.key;
        if (o === "ArrowDown" || o === "ArrowUp") {
          a.preventDefault(), a.stopPropagation(), Ye(i, o === "ArrowDown" ? 1 : -1);
          return;
        }
        if (o === "Tab") {
          Ge(i, a.shiftKey ? -1 : 1) && a.preventDefault();
          return;
        }
        if (o === "Enter" || o === " ") {
          a.preventDefault(), Je(i);
          return;
        }
        if (o === "Escape") {
          i.blur();
          return;
        }
      };
      i.addEventListener("keydown", d), r(() => {
        try {
          i.removeEventListener("keydown", d), i.removeAttribute("tabindex"), i.removeAttribute("role"), i.removeAttribute("aria-label");
        } catch {
        }
      });
    }
  );
}
function je(e) {
  e && typeof e.directive == "function" && (He(e), _e(e), Pe(e), Ke(e), We(e)), ce("schema", {
    setup(t) {
      !t.el && t._container && (t.el = t._container), t.addField = function(s, n) {
        return me(this, s, n);
      }, t.renameField = function(s, n, r) {
        return ge(this, s, n, r);
      }, t.removeField = function(s, n) {
        return he(this, s, n);
      }, t.reorderFields = function(s, n) {
        return ye(this, s, n);
      }, t.inferReferences = function() {
        return ie(this.nodes ?? []);
      }, t.schemaToJSON = function() {
        return K(this);
      }, t.schemaFromJSON = function(s) {
        return de(this, s);
      }, t.validateSchema = function() {
        return ve(this);
      }, t.diffSchemas = function(s, n, r) {
        return be(s, n, r);
      }, t.toDot = function(s) {
        return Ae(this, s);
      }, t.schemaLayout = function(s) {
        return Ce(this, s);
      };
    }
  });
}
export {
  me as addField,
  ze as attachSchemaHistory,
  je as default,
  be as diffSchemas,
  ie as inferReferences,
  Pe as registerEdgeInspectorDirective,
  He as registerNodeInspectorDirective,
  _e as registerRowInspectorDirective,
  We as registerSchemaKeyboardNavDirective,
  Ke as registerSchemaReorderableDirective,
  he as removeField,
  ge as renameField,
  ye as reorderFields,
  de as schemaFromJSON,
  Ce as schemaLayout,
  K as schemaToJSON,
  Ae as toDot,
  ve as validateSchema
};
//# sourceMappingURL=alpineflow-schema.esm.js.map
