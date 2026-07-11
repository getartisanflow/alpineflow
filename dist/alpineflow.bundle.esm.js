let Io = null;
function ba(t) {
  Io = t;
}
function Le() {
  if (!Io)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Io;
}
var xa = { value: () => {
} };
function uo() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Dn(n);
}
function Dn(t) {
  this._ = t;
}
function Ea(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Dn.prototype = uo.prototype = {
  constructor: Dn,
  on: function(t, e) {
    var n = this._, o = Ea(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Ca(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Ti(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Ti(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new Dn(t);
  },
  call: function(t, e) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), o = 0, i, r; o < i; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (r = this._[t], o = 0, i = r.length; o < i; ++o) r[o].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var o = this._[t], i = 0, r = o.length; i < r; ++i) o[i].value.apply(e, n);
  }
};
function Ca(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Ti(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = xa, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Do = "http://www.w3.org/1999/xhtml";
const Ai = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Do,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function fo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Ai.hasOwnProperty(e) ? { space: Ai[e], local: t } : t;
}
function Sa(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Do && e.documentElement.namespaceURI === Do ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function ka(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Ys(t) {
  var e = fo(t);
  return (e.local ? ka : Sa)(e);
}
function La() {
}
function ii(t) {
  return t == null ? La : function() {
    return this.querySelector(t);
  };
}
function Pa(t) {
  typeof t != "function" && (t = ii(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new He(o, this._parents);
}
function Ma(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Ta() {
  return [];
}
function Ws(t) {
  return t == null ? Ta : function() {
    return this.querySelectorAll(t);
  };
}
function Aa(t) {
  return function() {
    return Ma(t.apply(this, arguments));
  };
}
function Na(t) {
  typeof t == "function" ? t = Aa(t) : t = Ws(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new He(o, i);
}
function js(t) {
  return function() {
    return this.matches(t);
  };
}
function Us(t) {
  return function(e) {
    return e.matches(t);
  };
}
var $a = Array.prototype.find;
function Ia(t) {
  return function() {
    return $a.call(this.children, t);
  };
}
function Da() {
  return this.firstElementChild;
}
function Ra(t) {
  return this.select(t == null ? Da : Ia(typeof t == "function" ? t : Us(t)));
}
var Fa = Array.prototype.filter;
function Ha() {
  return Array.from(this.children);
}
function Oa(t) {
  return function() {
    return Fa.call(this.children, t);
  };
}
function za(t) {
  return this.selectAll(t == null ? Ha : Oa(typeof t == "function" ? t : Us(t)));
}
function Va(t) {
  typeof t != "function" && (t = js(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new He(o, this._parents);
}
function Zs(t) {
  return new Array(t.length);
}
function Ba() {
  return new He(this._enter || this._groups.map(Zs), this._parents);
}
function Vn(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Vn.prototype = {
  constructor: Vn,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function qa(t) {
  return function() {
    return t;
  };
}
function Xa(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Vn(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function Ya(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, f = r.length, u = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (u[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < f; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new Vn(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(u[l]) === a && (i[l] = a);
}
function Wa(t) {
  return t.__data__;
}
function ja(t, e) {
  if (!arguments.length) return Array.from(this, Wa);
  var n = e ? Ya : Xa, o = this._parents, i = this._groups;
  typeof t != "function" && (t = qa(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], f = i[c], u = f.length, h = Ua(t.call(d, d && d.__data__, c, o)), g = h.length, p = l[c] = new Array(g), y = s[c] = new Array(g), m = a[c] = new Array(u);
    n(d, f, p, y, m, h, e);
    for (var x = 0, k = 0, v, A; x < g; ++x)
      if (v = p[x]) {
        for (x >= k && (k = x + 1); !(A = y[k]) && ++k < g; ) ;
        v._next = A || null;
      }
  }
  return s = new He(s, o), s._enter = l, s._exit = a, s;
}
function Ua(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Za() {
  return new He(this._exit || this._groups.map(Zs), this._parents);
}
function Ka(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Ga(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], f = c.length, u = l[a] = new Array(f), h, g = 0; g < f; ++g)
      (h = c[g] || d[g]) && (u[g] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new He(l, this._parents);
}
function Ja() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Qa(t) {
  t || (t = el);
  function e(f, u) {
    return f && u ? t(f.__data__, u.__data__) : !f - !u;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), c, d = 0; d < l; ++d)
      (c = s[d]) && (a[d] = c);
    a.sort(e);
  }
  return new He(i, this._parents).order();
}
function el(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function tl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function nl() {
  return Array.from(this);
}
function ol() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function il() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function sl() {
  return !this.node();
}
function rl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function al(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ll(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function cl(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function dl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function ul(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function fl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function hl(t, e) {
  var n = fo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? ll : al : typeof e == "function" ? n.local ? fl : ul : n.local ? dl : cl)(n, e));
}
function Ks(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function pl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function gl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function ml(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function yl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? pl : typeof e == "function" ? ml : gl)(t, e, n ?? "")) : zt(this.node(), t);
}
function zt(t, e) {
  return t.style.getPropertyValue(e) || Ks(t).getComputedStyle(t, null).getPropertyValue(e);
}
function wl(t) {
  return function() {
    delete this[t];
  };
}
function vl(t, e) {
  return function() {
    this[t] = e;
  };
}
function _l(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function bl(t, e) {
  return arguments.length > 1 ? this.each((e == null ? wl : typeof e == "function" ? _l : vl)(t, e)) : this.node()[t];
}
function Gs(t) {
  return t.trim().split(/^|\s+/);
}
function si(t) {
  return t.classList || new Js(t);
}
function Js(t) {
  this._node = t, this._names = Gs(t.getAttribute("class") || "");
}
Js.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function Qs(t, e) {
  for (var n = si(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function er(t, e) {
  for (var n = si(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function xl(t) {
  return function() {
    Qs(this, t);
  };
}
function El(t) {
  return function() {
    er(this, t);
  };
}
function Cl(t, e) {
  return function() {
    (e.apply(this, arguments) ? Qs : er)(this, t);
  };
}
function Sl(t, e) {
  var n = Gs(t + "");
  if (arguments.length < 2) {
    for (var o = si(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Cl : e ? xl : El)(n, e));
}
function kl() {
  this.textContent = "";
}
function Ll(t) {
  return function() {
    this.textContent = t;
  };
}
function Pl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Ml(t) {
  return arguments.length ? this.each(t == null ? kl : (typeof t == "function" ? Pl : Ll)(t)) : this.node().textContent;
}
function Tl() {
  this.innerHTML = "";
}
function Al(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Nl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function $l(t) {
  return arguments.length ? this.each(t == null ? Tl : (typeof t == "function" ? Nl : Al)(t)) : this.node().innerHTML;
}
function Il() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Dl() {
  return this.each(Il);
}
function Rl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Fl() {
  return this.each(Rl);
}
function Hl(t) {
  var e = typeof t == "function" ? t : Ys(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Ol() {
  return null;
}
function zl(t, e) {
  var n = typeof t == "function" ? t : Ys(t), o = e == null ? Ol : typeof e == "function" ? e : ii(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Vl() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Bl() {
  return this.each(Vl);
}
function ql() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Xl() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Yl(t) {
  return this.select(t ? Xl : ql);
}
function Wl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function jl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Ul(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function Zl(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Kl(t, e, n) {
  return function() {
    var o = this.__on, i, r = jl(e);
    if (o) {
      for (var s = 0, l = o.length; s < l; ++s)
        if ((i = o[s]).type === t.type && i.name === t.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = e;
          return;
        }
    }
    this.addEventListener(t.type, r, n), i = { type: t.type, name: t.name, value: e, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Gl(t, e, n) {
  var o = Ul(t + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, c = l.length, d; a < c; ++a)
        for (i = 0, d = l[a]; i < r; ++i)
          if ((s = o[i]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (l = e ? Kl : Zl, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function tr(t, e, n) {
  var o = Ks(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Jl(t, e) {
  return function() {
    return tr(this, t, e);
  };
}
function Ql(t, e) {
  return function() {
    return tr(this, t, e.apply(this, arguments));
  };
}
function ec(t, e) {
  return this.each((typeof e == "function" ? Ql : Jl)(t, e));
}
function* tc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var nr = [null];
function He(t, e) {
  this._groups = t, this._parents = e;
}
function wn() {
  return new He([[document.documentElement]], nr);
}
function nc() {
  return this;
}
He.prototype = wn.prototype = {
  constructor: He,
  select: Pa,
  selectAll: Na,
  selectChild: Ra,
  selectChildren: za,
  filter: Va,
  data: ja,
  enter: Ba,
  exit: Za,
  join: Ka,
  merge: Ga,
  selection: nc,
  order: Ja,
  sort: Qa,
  call: tl,
  nodes: nl,
  node: ol,
  size: il,
  empty: sl,
  each: rl,
  attr: hl,
  style: yl,
  property: bl,
  classed: Sl,
  text: Ml,
  html: $l,
  raise: Dl,
  lower: Fl,
  append: Hl,
  insert: zl,
  remove: Bl,
  clone: Yl,
  datum: Wl,
  on: Gl,
  dispatch: ec,
  [Symbol.iterator]: tc
};
function Ve(t) {
  return typeof t == "string" ? new He([[document.querySelector(t)]], [document.documentElement]) : new He([[t]], nr);
}
function oc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ze(t, e) {
  if (t = oc(t), e === void 0 && (e = t.currentTarget), e) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = t.clientX, o.y = t.clientY, o = o.matrixTransform(e.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (e.getBoundingClientRect) {
      var i = e.getBoundingClientRect();
      return [t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop];
    }
  }
  return [t.pageX, t.pageY];
}
const ic = { passive: !1 }, dn = { capture: !0, passive: !1 };
function yo(t) {
  t.stopImmediatePropagation();
}
function $t(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function or(t) {
  var e = t.document.documentElement, n = Ve(t).on("dragstart.drag", $t, dn);
  "onselectstart" in e ? n.on("selectstart.drag", $t, dn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function ir(t, e) {
  var n = t.document.documentElement, o = Ve(t).on("dragstart.drag", null);
  e && (o.on("click.drag", $t, dn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const En = (t) => () => t;
function Ro(t, {
  sourceEvent: e,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: l,
  dx: a,
  dy: c,
  dispatch: d
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
Ro.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function sc(t) {
  return !t.ctrlKey && !t.button;
}
function rc() {
  return this.parentNode;
}
function ac(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function lc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function cc() {
  var t = sc, e = rc, n = ac, o = lc, i = {}, r = uo("start", "drag", "end"), s = 0, l, a, c, d, f = 0;
  function u(v) {
    v.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, ic).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(v, A) {
    if (!(d || !t.call(this, v, A))) {
      var S = k(this, e.call(this, v, A), v, A, "mouse");
      S && (Ve(v.view).on("mousemove.drag", g, dn).on("mouseup.drag", p, dn), or(v.view), yo(v), c = !1, l = v.clientX, a = v.clientY, S("start", v));
    }
  }
  function g(v) {
    if ($t(v), !c) {
      var A = v.clientX - l, S = v.clientY - a;
      c = A * A + S * S > f;
    }
    i.mouse("drag", v);
  }
  function p(v) {
    Ve(v.view).on("mousemove.drag mouseup.drag", null), ir(v.view, c), $t(v), i.mouse("end", v);
  }
  function y(v, A) {
    if (t.call(this, v, A)) {
      var S = v.changedTouches, P = e.call(this, v, A), $ = S.length, b, E;
      for (b = 0; b < $; ++b)
        (E = k(this, P, v, A, S[b].identifier, S[b])) && (yo(v), E("start", v, S[b]));
    }
  }
  function m(v) {
    var A = v.changedTouches, S = A.length, P, $;
    for (P = 0; P < S; ++P)
      ($ = i[A[P].identifier]) && ($t(v), $("drag", v, A[P]));
  }
  function x(v) {
    var A = v.changedTouches, S = A.length, P, $;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), P = 0; P < S; ++P)
      ($ = i[A[P].identifier]) && (yo(v), $("end", v, A[P]));
  }
  function k(v, A, S, P, $, b) {
    var E = r.copy(), N = Ze(b || S, A), M, w, _;
    if ((_ = n.call(v, new Ro("beforestart", {
      sourceEvent: S,
      target: u,
      identifier: $,
      active: s,
      x: N[0],
      y: N[1],
      dx: 0,
      dy: 0,
      dispatch: E
    }), P)) != null)
      return M = _.x - N[0] || 0, w = _.y - N[1] || 0, function D(L, O, W) {
        var C = N, T;
        switch (L) {
          case "start":
            i[$] = D, T = s++;
            break;
          case "end":
            delete i[$], --s;
          // falls through
          case "drag":
            N = Ze(W || O, A), T = s;
            break;
        }
        E.call(
          L,
          v,
          new Ro(L, {
            sourceEvent: O,
            subject: _,
            target: u,
            identifier: $,
            active: T,
            x: N[0] + M,
            y: N[1] + w,
            dx: N[0] - C[0],
            dy: N[1] - C[1],
            dispatch: E
          }),
          P
        );
      };
  }
  return u.filter = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : En(!!v), u) : t;
  }, u.container = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : En(v), u) : e;
  }, u.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : En(v), u) : n;
  }, u.touchable = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : En(!!v), u) : o;
  }, u.on = function() {
    var v = r.on.apply(r, arguments);
    return v === r ? u : v;
  }, u.clickDistance = function(v) {
    return arguments.length ? (f = (v = +v) * v, u) : Math.sqrt(f);
  }, u;
}
function ri(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function sr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function vn() {
}
var un = 0.7, Bn = 1 / un, It = "\\s*([+-]?\\d+)\\s*", fn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", dc = /^#([0-9a-f]{3,8})$/, uc = new RegExp(`^rgb\\(${It},${It},${It}\\)$`), fc = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`), hc = new RegExp(`^rgba\\(${It},${It},${It},${fn}\\)$`), pc = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${fn}\\)$`), gc = new RegExp(`^hsl\\(${fn},${Ye},${Ye}\\)$`), mc = new RegExp(`^hsla\\(${fn},${Ye},${Ye},${fn}\\)$`), Ni = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
ri(vn, hn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: $i,
  // Deprecated! Use color.formatHex.
  formatHex: $i,
  formatHex8: yc,
  formatHsl: wc,
  formatRgb: Ii,
  toString: Ii
});
function $i() {
  return this.rgb().formatHex();
}
function yc() {
  return this.rgb().formatHex8();
}
function wc() {
  return rr(this).formatHsl();
}
function Ii() {
  return this.rgb().formatRgb();
}
function hn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = dc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Di(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Cn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Cn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = uc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = fc.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = hc.exec(t)) ? Cn(e[1], e[2], e[3], e[4]) : (e = pc.exec(t)) ? Cn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = gc.exec(t)) ? Hi(e[1], e[2] / 100, e[3] / 100, 1) : (e = mc.exec(t)) ? Hi(e[1], e[2] / 100, e[3] / 100, e[4]) : Ni.hasOwnProperty(t) ? Di(Ni[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function Di(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Cn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function vc(t) {
  return t instanceof vn || (t = hn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function Fo(t, e, n, o) {
  return arguments.length === 1 ? vc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
ri(Ne, Fo, sr(vn, {
  brighter(t) {
    return t = t == null ? Bn : Math.pow(Bn, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? un : Math.pow(un, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ne(Ct(this.r), Ct(this.g), Ct(this.b), qn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ri,
  // Deprecated! Use color.formatHex.
  formatHex: Ri,
  formatHex8: _c,
  formatRgb: Fi,
  toString: Fi
}));
function Ri() {
  return `#${xt(this.r)}${xt(this.g)}${xt(this.b)}`;
}
function _c() {
  return `#${xt(this.r)}${xt(this.g)}${xt(this.b)}${xt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Fi() {
  const t = qn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Ct(this.r)}, ${Ct(this.g)}, ${Ct(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function qn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Ct(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function xt(t) {
  return t = Ct(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Hi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Be(t, e, n, o);
}
function rr(t) {
  if (t instanceof Be) return new Be(t.h, t.s, t.l, t.opacity);
  if (t instanceof vn || (t = hn(t)), !t) return new Be();
  if (t instanceof Be) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new Be(s, l, a, t.opacity);
}
function bc(t, e, n, o) {
  return arguments.length === 1 ? rr(t) : new Be(t, e, n, o ?? 1);
}
function Be(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
ri(Be, bc, sr(vn, {
  brighter(t) {
    return t = t == null ? Bn : Math.pow(Bn, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? un : Math.pow(un, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      wo(t >= 240 ? t - 240 : t + 120, i, o),
      wo(t, i, o),
      wo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Be(Oi(this.h), Sn(this.s), Sn(this.l), qn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = qn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Oi(this.h)}, ${Sn(this.s) * 100}%, ${Sn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Oi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Sn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function wo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const ar = (t) => () => t;
function xc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Ec(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Cc(t) {
  return (t = +t) == 1 ? lr : function(e, n) {
    return n - e ? Ec(e, n, t) : ar(isNaN(e) ? n : e);
  };
}
function lr(t, e) {
  var n = e - t;
  return n ? xc(t, n) : ar(isNaN(t) ? e : t);
}
const Ho = (function t(e) {
  var n = Cc(e);
  function o(i, r) {
    var s = n((i = Fo(i)).r, (r = Fo(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = lr(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = l(d), i.b = a(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function at(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Oo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, vo = new RegExp(Oo.source, "g");
function Sc(t) {
  return function() {
    return t;
  };
}
function kc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Lc(t, e) {
  var n = Oo.lastIndex = vo.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = Oo.exec(t)) && (i = vo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: at(o, i) })), n = vo.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? kc(a[0].x) : Sc(e) : (e = a.length, function(c) {
    for (var d = 0, f; d < e; ++d) l[(f = a[d]).i] = f.x(c);
    return l.join("");
  });
}
var zi = 180 / Math.PI, zo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function cr(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * zi,
    skewX: Math.atan(a) * zi,
    scaleX: s,
    scaleY: l
  };
}
var kn;
function Pc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? zo : cr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Mc(t) {
  return t == null || (kn || (kn = document.createElementNS("http://www.w3.org/2000/svg", "g")), kn.setAttribute("transform", t), !(t = kn.transform.baseVal.consolidate())) ? zo : (t = t.matrix, cr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function dr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, f, u, h, g) {
    if (c !== f || d !== u) {
      var p = h.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: at(c, f) }, { i: p - 2, x: at(d, u) });
    } else (f || u) && h.push("translate(" + f + e + u + n);
  }
  function s(c, d, f, u) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), u.push({ i: f.push(i(f) + "rotate(", null, o) - 2, x: at(c, d) })) : d && f.push(i(f) + "rotate(" + d + o);
  }
  function l(c, d, f, u) {
    c !== d ? u.push({ i: f.push(i(f) + "skewX(", null, o) - 2, x: at(c, d) }) : d && f.push(i(f) + "skewX(" + d + o);
  }
  function a(c, d, f, u, h, g) {
    if (c !== f || d !== u) {
      var p = h.push(i(h) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: at(c, f) }, { i: p - 2, x: at(d, u) });
    } else (f !== 1 || u !== 1) && h.push(i(h) + "scale(" + f + "," + u + ")");
  }
  return function(c, d) {
    var f = [], u = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, f, u), s(c.rotate, d.rotate, f, u), l(c.skewX, d.skewX, f, u), a(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, u), c = d = null, function(h) {
      for (var g = -1, p = u.length, y; ++g < p; ) f[(y = u[g]).i] = y.x(h);
      return f.join("");
    };
  };
}
var Tc = dr(Pc, "px, ", "px)", "deg)"), Ac = dr(Mc, ", ", ")", ")"), Nc = 1e-12;
function Vi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function $c(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Ic(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Dc = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], f = s[1], u = s[2], h = d - l, g = f - a, p = h * h + g * g, y, m;
    if (p < Nc)
      m = Math.log(u / c) / e, y = function(P) {
        return [
          l + P * h,
          a + P * g,
          c * Math.exp(e * P * m)
        ];
      };
    else {
      var x = Math.sqrt(p), k = (u * u - c * c + o * p) / (2 * c * n * x), v = (u * u - c * c - o * p) / (2 * u * n * x), A = Math.log(Math.sqrt(k * k + 1) - k), S = Math.log(Math.sqrt(v * v + 1) - v);
      m = (S - A) / e, y = function(P) {
        var $ = P * m, b = Vi(A), E = c / (n * x) * (b * Ic(e * $ + A) - $c(A));
        return [
          l + E * h,
          a + E * g,
          c * b / Vi(e * $ + A)
        ];
      };
    }
    return y.duration = m * 1e3 * e / Math.SQRT2, y;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), l = s * s, a = l * l;
    return t(s, l, a);
  }, i;
})(Math.SQRT2, 2, 4);
var Vt = 0, tn = 0, Zt = 0, ur = 1e3, Xn, nn, Yn = 0, St = 0, ho = 0, pn = typeof performance == "object" && performance.now ? performance : Date, fr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ai() {
  return St || (fr(Rc), St = pn.now() + ho);
}
function Rc() {
  St = 0;
}
function Wn() {
  this._call = this._time = this._next = null;
}
Wn.prototype = hr.prototype = {
  constructor: Wn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ai() : +n) + (e == null ? 0 : +e), !this._next && nn !== this && (nn ? nn._next = this : Xn = this, nn = this), this._call = t, this._time = n, Vo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Vo());
  }
};
function hr(t, e, n) {
  var o = new Wn();
  return o.restart(t, e, n), o;
}
function Fc() {
  ai(), ++Vt;
  for (var t = Xn, e; t; )
    (e = St - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Vt;
}
function Bi() {
  St = (Yn = pn.now()) + ho, Vt = tn = 0;
  try {
    Fc();
  } finally {
    Vt = 0, Oc(), St = 0;
  }
}
function Hc() {
  var t = pn.now(), e = t - Yn;
  e > ur && (ho -= e, Yn = t);
}
function Oc() {
  for (var t, e = Xn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Xn = n);
  nn = t, Vo(o);
}
function Vo(t) {
  if (!Vt) {
    tn && (tn = clearTimeout(tn));
    var e = t - St;
    e > 24 ? (t < 1 / 0 && (tn = setTimeout(Bi, t - pn.now() - ho)), Zt && (Zt = clearInterval(Zt))) : (Zt || (Yn = pn.now(), Zt = setInterval(Hc, ur)), Vt = 1, fr(Bi));
  }
}
function qi(t, e, n) {
  var o = new Wn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var zc = uo("start", "end", "cancel", "interrupt"), Vc = [], pr = 0, Xi = 1, Bo = 2, Rn = 3, Yi = 4, qo = 5, Fn = 6;
function po(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Bc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: zc,
    tween: Vc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: pr
  });
}
function li(t, e) {
  var n = qe(t, e);
  if (n.state > pr) throw new Error("too late; already scheduled");
  return n;
}
function We(t, e) {
  var n = qe(t, e);
  if (n.state > Rn) throw new Error("too late; already running");
  return n;
}
function qe(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Bc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = hr(r, 0, n.time);
  function r(c) {
    n.state = Xi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, u, h;
    if (n.state !== Xi) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === Rn) return qi(s);
        h.state === Yi ? (h.state = Fn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Fn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (qi(function() {
      n.state === Rn && (n.state = Yi, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = Bo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Bo) {
      for (n.state = Rn, i = new Array(u = n.tween.length), d = 0, f = -1; d < u; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++f] = h);
      i.length = f + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = qo, 1), f = -1, u = i.length; ++f < u; )
      i[f].call(t, d);
    n.state === qo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = Fn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Hn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Bo && o.state < qo, o.state = Fn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function qc(t) {
  return this.each(function() {
    Hn(this, t);
  });
}
function Xc(t, e) {
  var n, o;
  return function() {
    var i = We(this, t), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, l = o.length; s < l; ++s)
        if (o[s].name === e) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Yc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = We(this, t), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var l = { name: e, value: n }, a = 0, c = i.length; a < c; ++a)
        if (i[a].name === e) {
          i[a] = l;
          break;
        }
      a === c && i.push(l);
    }
    r.tween = i;
  };
}
function Wc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = qe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Xc : Yc)(n, t, e));
}
function ci(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = We(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return qe(i, o).value[e];
  };
}
function gr(t, e) {
  var n;
  return (typeof e == "number" ? at : e instanceof hn ? Ho : (n = hn(e)) ? (e = n, Ho) : Lc)(t, e);
}
function jc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Uc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Zc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Kc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Gc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Jc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Qc(t, e) {
  var n = fo(t), o = n === "transform" ? Ac : gr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Jc : Gc)(n, o, ci(this, "attr." + t, e)) : e == null ? (n.local ? Uc : jc)(n) : (n.local ? Kc : Zc)(n, o, e));
}
function ed(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function td(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function nd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && td(t, r)), n;
  }
  return i._value = e, i;
}
function od(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && ed(t, r)), n;
  }
  return i._value = e, i;
}
function id(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = fo(t);
  return this.tween(n, (o.local ? nd : od)(o, e));
}
function sd(t, e) {
  return function() {
    li(this, t).delay = +e.apply(this, arguments);
  };
}
function rd(t, e) {
  return e = +e, function() {
    li(this, t).delay = e;
  };
}
function ad(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? sd : rd)(e, t)) : qe(this.node(), e).delay;
}
function ld(t, e) {
  return function() {
    We(this, t).duration = +e.apply(this, arguments);
  };
}
function cd(t, e) {
  return e = +e, function() {
    We(this, t).duration = e;
  };
}
function dd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ld : cd)(e, t)) : qe(this.node(), e).duration;
}
function ud(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    We(this, t).ease = e;
  };
}
function fd(t) {
  var e = this._id;
  return arguments.length ? this.each(ud(e, t)) : qe(this.node(), e).ease;
}
function hd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    We(this, t).ease = n;
  };
}
function pd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(hd(this._id, t));
}
function gd(t) {
  typeof t != "function" && (t = js(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new tt(o, this._parents, this._name, this._id);
}
function md(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, f = s[l] = new Array(d), u, h = 0; h < d; ++h)
      (u = a[h] || c[h]) && (f[h] = u);
  for (; l < o; ++l)
    s[l] = e[l];
  return new tt(s, this._parents, this._name, this._id);
}
function yd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function wd(t, e, n) {
  var o, i, r = yd(e) ? li : We;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function vd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? qe(this.node(), n).on.on(t) : this.each(wd(n, t, e));
}
function _d(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function bd() {
  return this.on("end.remove", _d(this._id));
}
function xd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ii(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, f, u = 0; u < a; ++u)
      (d = l[u]) && (f = t.call(d, d.__data__, u, l)) && ("__data__" in d && (f.__data__ = d.__data__), c[u] = f, po(c[u], e, n, u, c, qe(d, n)));
  return new tt(r, this._parents, e, n);
}
function Ed(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Ws(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, f = 0; f < c; ++f)
      if (d = a[f]) {
        for (var u = t.call(d, d.__data__, f, a), h, g = qe(d, n), p = 0, y = u.length; p < y; ++p)
          (h = u[p]) && po(h, e, n, p, u, g);
        r.push(u), s.push(d);
      }
  return new tt(r, s, e, n);
}
var Cd = wn.prototype.constructor;
function Sd() {
  return new Cd(this._groups, this._parents);
}
function kd(t, e) {
  var n, o, i;
  return function() {
    var r = zt(this, t), s = (this.style.removeProperty(t), zt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function mr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Ld(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = zt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Pd(t, e, n) {
  var o, i, r;
  return function() {
    var s = zt(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), zt(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Md(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = We(this, t), c = a.on, d = a.value[r] == null ? l || (l = mr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Td(t, e, n) {
  var o = (t += "") == "transform" ? Tc : gr;
  return e == null ? this.styleTween(t, kd(t, o)).on("end.style." + t, mr(t)) : typeof e == "function" ? this.styleTween(t, Pd(t, o, ci(this, "style." + t, e))).each(Md(this._id, t)) : this.styleTween(t, Ld(t, o, e), n).on("end.style." + t, null);
}
function Ad(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Nd(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Ad(t, s, n)), o;
  }
  return r._value = e, r;
}
function $d(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Nd(t, e, n ?? ""));
}
function Id(t) {
  return function() {
    this.textContent = t;
  };
}
function Dd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Rd(t) {
  return this.tween("text", typeof t == "function" ? Dd(ci(this, "text", t)) : Id(t == null ? "" : t + ""));
}
function Fd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Hd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Fd(i)), e;
  }
  return o._value = t, o;
}
function Od(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Hd(t));
}
function zd() {
  for (var t = this._name, e = this._id, n = yr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = qe(a, e);
        po(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new tt(o, this._parents, t, n);
}
function Vd() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = We(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(a)), c.on = e;
    }), i === 0 && r();
  });
}
var Bd = 0;
function tt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function yr() {
  return ++Bd;
}
var Ue = wn.prototype;
tt.prototype = {
  constructor: tt,
  select: xd,
  selectAll: Ed,
  selectChild: Ue.selectChild,
  selectChildren: Ue.selectChildren,
  filter: gd,
  merge: md,
  selection: Sd,
  transition: zd,
  call: Ue.call,
  nodes: Ue.nodes,
  node: Ue.node,
  size: Ue.size,
  empty: Ue.empty,
  each: Ue.each,
  on: vd,
  attr: Qc,
  attrTween: id,
  style: Td,
  styleTween: $d,
  text: Rd,
  textTween: Od,
  remove: bd,
  tween: Wc,
  delay: ad,
  duration: dd,
  ease: fd,
  easeVarying: pd,
  end: Vd,
  [Symbol.iterator]: Ue[Symbol.iterator]
};
const qd = (t) => +t;
function Xd(t) {
  return t * t;
}
function Yd(t) {
  return t * (2 - t);
}
function Wd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function jd(t) {
  return t * t * t;
}
function Ud(t) {
  return --t * t * t + 1;
}
function wr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var vr = Math.PI, _r = vr / 2;
function Zd(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * _r);
}
function Kd(t) {
  return Math.sin(t * _r);
}
function Gd(t) {
  return (1 - Math.cos(vr * t)) / 2;
}
function mt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function Jd(t) {
  return mt(1 - +t);
}
function Qd(t) {
  return 1 - mt(t);
}
function eu(t) {
  return ((t *= 2) <= 1 ? mt(1 - t) : 2 - mt(t - 1)) / 2;
}
function tu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function nu(t) {
  return Math.sqrt(1 - --t * t);
}
function ou(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Xo = 4 / 11, iu = 6 / 11, su = 8 / 11, ru = 3 / 4, au = 9 / 11, lu = 10 / 11, cu = 15 / 16, du = 21 / 22, uu = 63 / 64, Ln = 1 / Xo / Xo;
function fu(t) {
  return 1 - jn(1 - t);
}
function jn(t) {
  return (t = +t) < Xo ? Ln * t * t : t < su ? Ln * (t -= iu) * t + ru : t < lu ? Ln * (t -= au) * t + cu : Ln * (t -= du) * t + uu;
}
function hu(t) {
  return ((t *= 2) <= 1 ? 1 - jn(1 - t) : jn(t - 1) + 1) / 2;
}
var di = 1.70158, pu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(di), gu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(di), mu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(di), Bt = 2 * Math.PI, ui = 1, fi = 0.3, yu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return e * mt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(ui, fi), wu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return 1 - e * mt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(ui, fi), vu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * mt(-r) * Math.sin((o - r) / n) : 2 - e * mt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(ui, fi), _u = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: wr
};
function bu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function xu(t) {
  var e, n;
  t instanceof tt ? (e = t._id, t = t._name) : (e = yr(), (n = _u).time = ai(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && po(a, t, e, c, s, n || bu(a, e));
  return new tt(o, this._parents, t, e);
}
wn.prototype.interrupt = qc;
wn.prototype.transition = xu;
const Pn = (t) => () => t;
function Eu(t, {
  sourceEvent: e,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Je(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
Je.prototype = {
  constructor: Je,
  scale: function(t) {
    return t === 1 ? this : new Je(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new Je(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Un = new Je(1, 0, 0);
Je.prototype;
function _o(t) {
  t.stopImmediatePropagation();
}
function Kt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Cu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Su() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Wi() {
  return this.__zoom || Un;
}
function ku(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Lu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Pu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Mu() {
  var t = Cu, e = Su, n = Pu, o = ku, i = Lu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = Dc, c = uo("start", "zoom", "end"), d, f, u, h = 500, g = 150, p = 0, y = 10;
  function m(_) {
    _.property("__zoom", Wi).on("wheel.zoom", $, { passive: !1 }).on("mousedown.zoom", b).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", N).on("touchmove.zoom", M).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, D, L, O) {
    var W = _.selection ? _.selection() : _;
    W.property("__zoom", Wi), _ !== W ? A(_, D, L, O) : W.interrupt().each(function() {
      S(this, arguments).event(O).start().zoom(null, typeof D == "function" ? D.apply(this, arguments) : D).end();
    });
  }, m.scaleBy = function(_, D, L, O) {
    m.scaleTo(_, function() {
      var W = this.__zoom.k, C = typeof D == "function" ? D.apply(this, arguments) : D;
      return W * C;
    }, L, O);
  }, m.scaleTo = function(_, D, L, O) {
    m.transform(_, function() {
      var W = e.apply(this, arguments), C = this.__zoom, T = L == null ? v(W) : typeof L == "function" ? L.apply(this, arguments) : L, R = C.invert(T), X = typeof D == "function" ? D.apply(this, arguments) : D;
      return n(k(x(C, X), T, R), W, s);
    }, L, O);
  }, m.translateBy = function(_, D, L, O) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof D == "function" ? D.apply(this, arguments) : D,
        typeof L == "function" ? L.apply(this, arguments) : L
      ), e.apply(this, arguments), s);
    }, null, O);
  }, m.translateTo = function(_, D, L, O, W) {
    m.transform(_, function() {
      var C = e.apply(this, arguments), T = this.__zoom, R = O == null ? v(C) : typeof O == "function" ? O.apply(this, arguments) : O;
      return n(Un.translate(R[0], R[1]).scale(T.k).translate(
        typeof D == "function" ? -D.apply(this, arguments) : -D,
        typeof L == "function" ? -L.apply(this, arguments) : -L
      ), C, s);
    }, O, W);
  };
  function x(_, D) {
    return D = Math.max(r[0], Math.min(r[1], D)), D === _.k ? _ : new Je(D, _.x, _.y);
  }
  function k(_, D, L) {
    var O = D[0] - L[0] * _.k, W = D[1] - L[1] * _.k;
    return O === _.x && W === _.y ? _ : new Je(_.k, O, W);
  }
  function v(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function A(_, D, L, O) {
    _.on("start.zoom", function() {
      S(this, arguments).event(O).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(O).end();
    }).tween("zoom", function() {
      var W = this, C = arguments, T = S(W, C).event(O), R = e.apply(W, C), X = L == null ? v(R) : typeof L == "function" ? L.apply(W, C) : L, se = Math.max(R[1][0] - R[0][0], R[1][1] - R[0][1]), ne = W.__zoom, ie = typeof D == "function" ? D.apply(W, C) : D, le = a(ne.invert(X).concat(se / ne.k), ie.invert(X).concat(se / ie.k));
      return function(de) {
        if (de === 1) de = ie;
        else {
          var ue = le(de), J = se / ue[2];
          de = new Je(J, X[0] - ue[0] * J, X[1] - ue[1] * J);
        }
        T.zoom(null, de);
      };
    });
  }
  function S(_, D, L) {
    return !L && _.__zooming || new P(_, D);
  }
  function P(_, D) {
    this.that = _, this.args = D, this.active = 0, this.sourceEvent = null, this.extent = e.apply(_, D), this.taps = 0;
  }
  P.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, D) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = D.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = D.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = D.invert(this.touch1[0])), this.that.__zoom = D, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var D = Ve(this.that).datum();
      c.call(
        _,
        this.that,
        new Eu(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        D
      );
    }
  };
  function $(_, ...D) {
    if (!t.apply(this, arguments)) return;
    var L = S(this, D).event(_), O = this.__zoom, W = Math.max(r[0], Math.min(r[1], O.k * Math.pow(2, o.apply(this, arguments)))), C = Ze(_);
    if (L.wheel)
      (L.mouse[0][0] !== C[0] || L.mouse[0][1] !== C[1]) && (L.mouse[1] = O.invert(L.mouse[0] = C)), clearTimeout(L.wheel);
    else {
      if (O.k === W) return;
      L.mouse = [C, O.invert(C)], Hn(this), L.start();
    }
    Kt(_), L.wheel = setTimeout(T, g), L.zoom("mouse", n(k(x(O, W), L.mouse[0], L.mouse[1]), L.extent, s));
    function T() {
      L.wheel = null, L.end();
    }
  }
  function b(_, ...D) {
    if (u || !t.apply(this, arguments)) return;
    var L = _.currentTarget, O = S(this, D, !0).event(_), W = Ve(_.view).on("mousemove.zoom", X, !0).on("mouseup.zoom", se, !0), C = Ze(_, L), T = _.clientX, R = _.clientY;
    or(_.view), _o(_), O.mouse = [C, this.__zoom.invert(C)], Hn(this), O.start();
    function X(ne) {
      if (Kt(ne), !O.moved) {
        var ie = ne.clientX - T, le = ne.clientY - R;
        O.moved = ie * ie + le * le > p;
      }
      O.event(ne).zoom("mouse", n(k(O.that.__zoom, O.mouse[0] = Ze(ne, L), O.mouse[1]), O.extent, s));
    }
    function se(ne) {
      W.on("mousemove.zoom mouseup.zoom", null), ir(ne.view, O.moved), Kt(ne), O.event(ne).end();
    }
  }
  function E(_, ...D) {
    if (t.apply(this, arguments)) {
      var L = this.__zoom, O = Ze(_.changedTouches ? _.changedTouches[0] : _, this), W = L.invert(O), C = L.k * (_.shiftKey ? 0.5 : 2), T = n(k(x(L, C), O, W), e.apply(this, D), s);
      Kt(_), l > 0 ? Ve(this).transition().duration(l).call(A, T, O, _) : Ve(this).call(m.transform, T, O, _);
    }
  }
  function N(_, ...D) {
    if (t.apply(this, arguments)) {
      var L = _.touches, O = L.length, W = S(this, D, _.changedTouches.length === O).event(_), C, T, R, X;
      for (_o(_), T = 0; T < O; ++T)
        R = L[T], X = Ze(R, this), X = [X, this.__zoom.invert(X), R.identifier], W.touch0 ? !W.touch1 && W.touch0[2] !== X[2] && (W.touch1 = X, W.taps = 0) : (W.touch0 = X, C = !0, W.taps = 1 + !!d);
      d && (d = clearTimeout(d)), C && (W.taps < 2 && (f = X[0], d = setTimeout(function() {
        d = null;
      }, h)), Hn(this), W.start());
    }
  }
  function M(_, ...D) {
    if (this.__zooming) {
      var L = S(this, D).event(_), O = _.changedTouches, W = O.length, C, T, R, X;
      for (Kt(_), C = 0; C < W; ++C)
        T = O[C], R = Ze(T, this), L.touch0 && L.touch0[2] === T.identifier ? L.touch0[0] = R : L.touch1 && L.touch1[2] === T.identifier && (L.touch1[0] = R);
      if (T = L.that.__zoom, L.touch1) {
        var se = L.touch0[0], ne = L.touch0[1], ie = L.touch1[0], le = L.touch1[1], de = (de = ie[0] - se[0]) * de + (de = ie[1] - se[1]) * de, ue = (ue = le[0] - ne[0]) * ue + (ue = le[1] - ne[1]) * ue;
        T = x(T, Math.sqrt(de / ue)), R = [(se[0] + ie[0]) / 2, (se[1] + ie[1]) / 2], X = [(ne[0] + le[0]) / 2, (ne[1] + le[1]) / 2];
      } else if (L.touch0) R = L.touch0[0], X = L.touch0[1];
      else return;
      L.zoom("touch", n(k(T, R, X), L.extent, s));
    }
  }
  function w(_, ...D) {
    if (this.__zooming) {
      var L = S(this, D).event(_), O = _.changedTouches, W = O.length, C, T;
      for (_o(_), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, h), C = 0; C < W; ++C)
        T = O[C], L.touch0 && L.touch0[2] === T.identifier ? delete L.touch0 : L.touch1 && L.touch1[2] === T.identifier && delete L.touch1;
      if (L.touch1 && !L.touch0 && (L.touch0 = L.touch1, delete L.touch1), L.touch0) L.touch0[1] = this.__zoom.invert(L.touch0[0]);
      else if (L.end(), L.taps === 2 && (T = Ze(T, this), Math.hypot(f[0] - T[0], f[1] - T[1]) < y)) {
        var R = Ve(this).on("dblclick.zoom");
        R && R.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : Pn(+_), m) : o;
  }, m.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : Pn(!!_), m) : t;
  }, m.touchable = function(_) {
    return arguments.length ? (i = typeof _ == "function" ? _ : Pn(!!_), m) : i;
  }, m.extent = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : Pn([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : e;
  }, m.scaleExtent = function(_) {
    return arguments.length ? (r[0] = +_[0], r[1] = +_[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(_) {
    return arguments.length ? (s[0][0] = +_[0][0], s[1][0] = +_[1][0], s[0][1] = +_[0][1], s[1][1] = +_[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(_) {
    return arguments.length ? (n = _, m) : n;
  }, m.duration = function(_) {
    return arguments.length ? (l = +_, m) : l;
  }, m.interpolate = function(_) {
    return arguments.length ? (a = _, m) : a;
  }, m.on = function() {
    var _ = c.on.apply(c, arguments);
    return _ === c ? m : _;
  }, m.clickDistance = function(_) {
    return arguments.length ? (p = (_ = +_) * _, m) : Math.sqrt(p);
  }, m.tapDistance = function(_) {
    return arguments.length ? (y = +_, m) : y;
  }, m;
}
function ji(t) {
  const { pannable: e, zoomable: n, isLocked: o, noPanClassName: i, noWheelClassName: r, isTouchSelectionMode: s, isPanKeyHeld: l, panOnDrag: a } = t;
  return (c) => {
    if (o?.() || i && c.target?.closest?.("." + i) || c.type === "wheel" && r && c.target?.closest?.("." + r) || !n && c.type === "wheel") return !1;
    if (c.type === "touchstart") {
      const d = !c.touches || c.touches.length < 2;
      if (s?.() && d || !e && !l?.() && d || !n && !d) return !1;
    }
    if (c.type === "mousedown") {
      if (l?.()) return !0;
      if (!e) return !1;
      if (Array.isArray(a))
        return a.includes(c.button);
      if (a === !1) return !1;
    }
    return !0;
  };
}
function Tu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, l = Ve(t);
  let a = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (P) => {
    c && P.code === c && (a = !0, t.style.cursor = "grab");
  }, f = (P) => {
    c && P.code === c && (a = !1, t.style.cursor = "");
  }, u = () => {
    a = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", f), window.addEventListener("blur", u));
  const h = Mu().scaleExtent([o, i]).on("start", (P) => {
    if (!P.sourceEvent) return;
    a && (t.style.cursor = "grabbing");
    const { x: $, y: b, k: E } = P.transform;
    e.onMoveStart?.({ x: $, y: b, zoom: E });
  }).on("zoom", (P) => {
    const { x: $, y: b, k: E } = P.transform;
    n({ x: $, y: b, zoom: E }), P.sourceEvent && e.onMove?.({ x: $, y: b, zoom: E });
  }).on("end", (P) => {
    if (!P.sourceEvent) return;
    a && (t.style.cursor = "grab");
    const { x: $, y: b, k: E } = P.transform;
    e.onMoveEnd?.({ x: $, y: b, zoom: E });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(ji({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => a,
    panOnDrag: e.panOnDrag
  })), l.call(h), e.zoomOnDoubleClick === !1 && l.on("dblclick.zoom", null);
  let g = e.panOnScroll ?? !1, p = e.panOnScrollDirection ?? "both", y = e.panOnScrollSpeed ?? 1, m = !1;
  const x = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, k = (P) => {
    x && P.code === x && (m = !0);
  }, v = (P) => {
    x && P.code === x && (m = !1);
  }, A = () => {
    m = !1;
  };
  x && (window.addEventListener("keydown", k), window.addEventListener("keyup", v), window.addEventListener("blur", A));
  const S = (P) => {
    if (e.isLocked?.()) return;
    const $ = P.ctrlKey || P.metaKey || m;
    if (!(g ? !$ : P.shiftKey)) return;
    P.preventDefault(), P.stopPropagation();
    const E = y;
    let N = 0, M = 0;
    p !== "horizontal" && (M = -P.deltaY * E), p !== "vertical" && (N = -P.deltaX * E, P.shiftKey && P.deltaX === 0 && p === "both" && (N = -P.deltaY * E, M = 0)), e.onScrollPan?.(N, M);
  };
  return t.addEventListener("wheel", S, { passive: !1, capture: !0 }), {
    setViewport(P, $) {
      const b = $?.duration ?? 0, E = Un.translate(P.x ?? 0, P.y ?? 0).scale(P.zoom ?? 1);
      b > 0 ? l.transition().duration(b).call(h.transform, E) : l.call(h.transform, E);
    },
    getTransform() {
      return t.__zoom ?? Un;
    },
    update(P) {
      if ((P.minZoom !== void 0 || P.maxZoom !== void 0) && h.scaleExtent([
        P.minZoom ?? o,
        P.maxZoom ?? i
      ]), P.pannable !== void 0 || P.zoomable !== void 0) {
        const $ = P.pannable ?? r, b = P.zoomable ?? s;
        h.filter(ji({
          pannable: $,
          zoomable: b,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => a,
          panOnDrag: e.panOnDrag
        }));
      }
      P.panOnScroll !== void 0 && (g = P.panOnScroll), P.panOnScrollDirection !== void 0 && (p = P.panOnScrollDirection), P.panOnScrollSpeed !== void 0 && (y = P.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", S, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", f), window.removeEventListener("blur", u)), x && (window.removeEventListener("keydown", k), window.removeEventListener("keyup", v), window.removeEventListener("blur", A)), l.on(".zoom", null);
    }
  };
}
function br(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Au(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ve = 150, _e = 50;
function go(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, f = e + o / 2;
  return { x: d - a / 2, y: f - c / 2, width: a, height: c };
}
function qt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? ve, a = s.dimensions?.height ?? _e, c = jt(s, e), d = s.rotation ? go(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Nu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = jt(r, n), c = r.rotation ? go(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, f = c.y + c.height;
    return !(d < e.x || c.x > o || f < e.y || c.y > i);
  });
}
function $u(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = jt(r, n), c = r.rotation ? go(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Zn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, f = n / c, u = Math.min(Math.max(Math.min(d, f), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, g = e / 2 - h.x * u, p = n / 2 - h.y * u;
  return { x: g, y: p, zoom: u };
}
function Iu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
function jt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? ve, i = t.dimensions?.height ?? _e;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let xr = !1;
function Er(t) {
  xr = t;
}
function q(t, e, n) {
  if (!xr) return;
  const o = `%c[AlpineFlow:${t}]`, i = Du(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Du(t) {
  return `color: ${{
    init: "#4ade80",
    destroy: "#f87171",
    drag: "#60a5fa",
    viewport: "#a78bfa",
    edge: "#fb923c",
    connection: "#f472b6",
    selection: "#facc15",
    event: "#38bdf8",
    store: "#2dd4bf",
    resize: "#c084fc",
    collapse: "#c084fc",
    animate: "#34d399",
    layout: "#818cf8",
    particle: "#f472b6",
    history: "#fbbf24",
    clipboard: "#94a3b8"
  }[t] ?? "#94a3b8"}; font-weight: bold`;
}
const gn = "#64748b", hi = "#d4d4d8", Cr = "#ef4444", Ru = "2", Fu = "6 3", Ui = 1.2, Yo = 0.2, On = 5, Zi = 25;
class Hu {
  constructor(e = 50) {
    this.past = [], this.future = [], this._suspendDepth = 0, this.maxSize = e;
  }
  suspend() {
    this._suspendDepth++;
  }
  resume() {
    this._suspendDepth > 0 && this._suspendDepth--;
  }
  capture(e) {
    this._suspendDepth > 0 || this.commit(JSON.stringify(e));
  }
  /** Serialize without pushing — pair with commit() for deferred capture. */
  snapshot(e) {
    return JSON.stringify(e);
  }
  /** Push a snapshot taken earlier via snapshot(). Dedups against the top of the stack. */
  commit(e) {
    this._suspendDepth > 0 || this.past.length > 0 && this.past[this.past.length - 1] === e || (this.past.push(e), this.future = [], this.past.length > this.maxSize && this.past.shift());
  }
  undo(e) {
    return this.past.length === 0 ? null : (this.future.push(JSON.stringify(e)), JSON.parse(this.past.pop()));
  }
  redo(e) {
    return this.future.length === 0 ? null : (this.past.push(JSON.stringify(e)), JSON.parse(this.future.pop()));
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
const Ou = 16;
function zu() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Ou),
    cancel: (t) => clearTimeout(t)
  };
}
class Sr {
  constructor() {
    this._scheduler = zu(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
  }
  /** True when the rAF loop is running. */
  get active() {
    return this._running;
  }
  /** Replace the frame scheduler (useful for tests with fake timers). */
  setScheduler(e) {
    this._scheduler = e;
  }
  /**
   * Register a tick callback.
   * @param callback - Called each frame with elapsed ms since activation.
   * @param delay - Optional delay (ms) before first invocation, measured from rAF frames.
   * @returns Handle with a `stop()` method to unregister.
   */
  register(e, n = 0) {
    const o = {
      callback: e,
      startTime: 0,
      delay: n,
      registeredAt: performance.now(),
      activated: n <= 0,
      removed: !1
    };
    return o.activated && (o.startTime = performance.now()), this._entries.push(o), this._running || this._start(), {
      stop: () => {
        o.removed = !0;
      }
    };
  }
  /**
   * Register a post-tick callback, fired after all regular tick callbacks each frame.
   * @param callback - Called with the frame timestamp (same `now` value passed to `_tick`).
   * @param options - Optional settings. `keepAlive: true` keeps the engine loop running
   *   even when no regular callbacks are registered (useful for recorders that need every frame).
   * @returns Handle with a `stop()` method to unregister.
   */
  onPostTick(e, n) {
    const o = { callback: e, removed: !1, keepAlive: n?.keepAlive ?? !1 };
    return this._postTickCallbacks.push(o), o.keepAlive && !this._running && this._start(), {
      stop: () => {
        o.removed = !0;
      }
    };
  }
  // ── Internal: loop management ──────────────────────────────────────
  _start() {
    this._running || (this._running = !0, this._scheduleFrame());
  }
  _stop() {
    this._running && (this._running = !1, this._frameId !== null && (this._scheduler.cancel(this._frameId), this._frameId = null));
  }
  _scheduleFrame() {
    this._frameId = this._scheduler.request((e) => {
      this._tick(e);
    });
  }
  _tick(e) {
    const n = this._entries.slice();
    for (const i of n) {
      if (i.removed) continue;
      if (!i.activated) {
        if (e - i.registeredAt < i.delay) continue;
        i.activated = !0, i.startTime = e;
      }
      const r = e - i.startTime;
      i.callback(r) === !0 && (i.removed = !0);
    }
    this._entries = this._entries.filter((i) => !i.removed);
    for (const i of this._postTickCallbacks)
      i.removed || i.callback(e);
    this._postTickCallbacks = this._postTickCallbacks.filter((i) => !i.removed);
    const o = this._postTickCallbacks.some((i) => !i.removed && i.keepAlive);
    if (this._entries.length === 0 && !o) {
      this._stop();
      return;
    }
    this._scheduleFrame();
  }
}
const Kn = new Sr(), Vu = {
  linear: qd,
  easeIn: Xd,
  easeOut: Yd,
  easeInOut: Wd,
  easeCubicIn: jd,
  easeCubicOut: Ud,
  easeCubicInOut: wr,
  easeCircIn: tu,
  easeCircOut: nu,
  easeCircInOut: ou,
  easeSinIn: Zd,
  easeSinOut: Kd,
  easeSinInOut: Gd,
  easeExpoIn: Jd,
  easeExpoOut: Qd,
  easeExpoInOut: eu,
  easeBounce: jn,
  easeBounceIn: fu,
  easeBounceInOut: hu,
  easeElastic: wu,
  easeElasticIn: yu,
  easeElasticInOut: vu,
  easeBack: mu,
  easeBackIn: pu,
  easeBackOut: gu
};
function kr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Gn(t) {
  return typeof t == "function" ? t : Vu[t ?? "easeInOut"];
}
function et(t, e, n) {
  return t + (e - t) * n;
}
function pi(t, e, n) {
  return Ho(t, e)(n);
}
function mn(t) {
  if (typeof t != "string")
    return t;
  if (!t.trim())
    return {};
  const e = {};
  for (const n of t.split(";")) {
    const o = n.trim();
    if (!o) continue;
    const i = o.indexOf(":");
    if (i === -1) continue;
    const r = o.slice(0, i).trim(), s = o.slice(i + 1).trim();
    e[r] = s;
  }
  return e;
}
const Ki = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Gi = /^(#|rgb|hsl)/;
function Lr(t, e, n) {
  const o = {}, i = /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(e)]);
  for (const r of i) {
    const s = t[r], l = e[r];
    if (s === void 0) {
      o[r] = l;
      continue;
    }
    if (l === void 0) {
      o[r] = s;
      continue;
    }
    const a = Ki.exec(s), c = Ki.exec(l);
    if (a && c) {
      const d = parseFloat(a[1]), f = parseFloat(c[1]), u = c[2] ?? "", h = et(d, f, n);
      o[r] = u ? `${h}${u}` : String(h);
      continue;
    }
    if (Gi.test(s) && Gi.test(l)) {
      o[r] = pi(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function Bu(t, e, n, o) {
  let i = et(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: et(t.x, e.x, n),
    y: et(t.y, e.y, n),
    zoom: i
  };
}
class qu {
  constructor() {
    this._handles = /* @__PURE__ */ new Set();
  }
  register(e) {
    this._handles.add(e);
  }
  unregister(e) {
    this._handles.delete(e);
  }
  getHandles(e) {
    const n = [...this._handles];
    if (!e?.tag && !e?.tags?.length)
      return n;
    const o = /* @__PURE__ */ new Set();
    return e.tag && o.add(e.tag), e.tags && e.tags.forEach((i) => o.add(i)), n.filter((i) => i._tags?.some((r) => o.has(r)) ?? !1);
  }
  cancelAll(e, n) {
    for (const o of this.getHandles(e))
      o.isFinished || o.stop(n);
  }
  pauseAll(e) {
    for (const n of this.getHandles(e))
      n.isFinished || n.pause();
  }
  resumeAll(e) {
    for (const n of this.getHandles(e))
      n.resume();
  }
  clear() {
    this._handles.clear();
  }
  get size() {
    return this._handles.size;
  }
}
class Xu {
  constructor() {
    this._handles = [], this._state = "active", this._propertySnapshots = /* @__PURE__ */ new Map(), this._onAfterRollback = null, this.finished = new Promise((e) => {
      this._resolveFinished = e;
    });
  }
  /**
   * @internal
   * Register a callback fired after `rollback()` has reverted all captured
   * properties. Receives the list of keys that were reverted. Used by the
   * canvas layer to flush DOM for the affected nodes — without it, raw-state
   * writes done outside the animation rAF loop never reach the DOM.
   *
   * Not part of the public API — do not call from application code. Canvas
   * wiring is managed internally in `$flow.transaction()`.
   */
  onAfterRollback(e) {
    this._onAfterRollback = e;
  }
  get state() {
    return this._state;
  }
  get handles() {
    return this._handles;
  }
  /** Called by the Animator when a new handle is created inside this transaction. */
  trackHandle(e) {
    this._state === "active" && this._handles.push(e);
  }
  /**
   * Called by the Animator the FIRST time a property key is touched inside this transaction.
   * Captures the pre-transaction value for rollback (lazy snapshot — only first touch per key).
   */
  captureProperty(e, n, o) {
    this._state === "active" && (this._propertySnapshots.has(e) || this._propertySnapshots.set(e, { value: n, apply: o }));
  }
  commit() {
    this._state === "active" && (this._state = "committed", this._resolveFinished());
  }
  rollback() {
    if (this._state !== "active")
      return;
    for (const n of this._handles)
      n.stop({ mode: "freeze" });
    const e = [];
    for (const [n, o] of this._propertySnapshots)
      o.apply(o.value), e.push(n);
    this._state = "rolled-back", this._onAfterRollback?.(e), this._resolveFinished();
  }
}
const Gt = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Pr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Gt.stiffness, i = e.damping ?? Gt.damping, r = e.mass ?? Gt.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Gt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Gt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Ji = {
  timeConstant: 350,
  restVelocity: 0.5
};
function gi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Ji.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Ji.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function mi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Mr(t, e, n, o) {
  if (n <= 0)
    return;
  gi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? mi(o) : null;
  if (e.bounds && o) {
    const r = e.bounds[o] ?? (i ? e.bounds[i] : void 0);
    if (r) {
      const [s, l] = r, a = (e.bounceStiffness ?? 200) / 500, c = (e.bounceDamping ?? 40) / 100, d = a * (1 - c);
      t.value < s ? (t.value = s, t.velocity = Math.abs(t.velocity) * d, t.settled = !1) : t.value > l && (t.value = l, t.velocity = -Math.abs(t.velocity) * d, t.settled = !1);
    }
  }
  if (t.settled && e.snapTo?.length && o) {
    let r = t.value, s = 1 / 0;
    for (const l of e.snapTo) {
      const a = l[o] ?? (i ? l[i] : void 0);
      if (a !== void 0) {
        const c = Math.abs(t.value - a);
        c < s && (s = c, r = a);
      }
    }
    t.value = r;
  }
}
function Tr(t, e, n, o) {
  const i = mi(o), r = e.values.map(
    (g) => g[o] ?? (i ? g[i] : void 0) ?? t.value
  );
  if (r.length < 2) {
    t.value = r[0] ?? t.value, t.settled = !0;
    return;
  }
  const s = e.offsets ?? r.map((g, p) => p / (r.length - 1)), l = Math.max(0, Math.min(1, n));
  let a = 0;
  for (let g = 0; g < s.length - 1; g++)
    l >= s[g] && (a = g);
  const c = s[a], d = s[a + 1] ?? 1, f = d > c ? (l - c) / (d - c) : 1, u = r[a], h = r[a + 1] ?? r[a];
  t.value = u + (h - u) * Math.max(0, Math.min(1, f)), l >= 1 && (t.value = r[r.length - 1], t.settled = !0);
}
const Qi = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, es = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, ts = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Ar(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return Qi[n] ? { ...Qi[n] } : null;
    case "decay":
      return es[n] ? { ...es[n] } : null;
    case "inertia":
      return ts[n] ? { ...ts[n] } : null;
    default:
      return null;
  }
}
function ns(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function Yu(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? et(t, e, n) : ns(t) && ns(e) ? pi(t, e, n) : n < 0.5 ? t : e;
}
class Wu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new qu(), this._activeTransaction = null, this._engine = e;
  }
  /** Whether any animations are currently running. */
  get active() {
    return this._groups.size > 0;
  }
  /** The handle registry for tag-based animation control. */
  get registry() {
    return this._registry;
  }
  /** Begin a new transaction — all subsequent `animate()` calls will be tracked until `endTransaction()`. */
  beginTransaction() {
    const e = new Xu();
    return this._activeTransaction = e, e;
  }
  /** End the current transaction context (does NOT commit or rollback — the caller decides). */
  endTransaction() {
    this._activeTransaction = null;
  }
  /**
   * Animate a set of property entries over the given duration.
   *
   * If any entry targets a key already being animated, the current in-flight
   * value is captured as the new "from" and the property is removed from the
   * old group (blend/compose).
   */
  animate(e, n) {
    const {
      duration: o,
      easing: i,
      delay: r = 0,
      loop: s = !1,
      startAt: l,
      onStart: a,
      onProgress: c,
      onComplete: d,
      tag: f,
      tags: u,
      while: h,
      whileStopMode: g = "jump-end",
      motion: p,
      maxDuration: y = 5e3
    } = n, m = Gn(i), x = p ? Ar(p) : void 0;
    for (const _ of e) {
      const D = this._ownership.get(_.key);
      if (D && !D.stopped) {
        const L = D.currentValues.get(_.key);
        L !== void 0 && (_.from = L), D.entries = D.entries.filter((O) => O.key !== _.key), D.entries.length === 0 && this._stop(D, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const _ of e)
        this._activeTransaction.captureProperty(_.key, _.from, _.apply);
    if (o <= 0) {
      const _ = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
      for (const W of e)
        _.set(W.key, W.from), D.set(W.key, W.to);
      a?.();
      for (const W of e)
        W.apply(W.to);
      const L = [...f ? [f] : [], ...u ?? []], O = {
        _tags: L.length > 0 ? L : void 0,
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
        },
        reverse: () => {
        },
        play: () => {
        },
        playForward: () => {
        },
        playBackward: () => {
        },
        restart: () => {
        },
        get direction() {
          return "forward";
        },
        get isFinished() {
          return !0;
        },
        get currentValue() {
          return D;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return _;
        },
        get _target() {
          return D;
        }
      };
      return this._registry.register(O), queueMicrotask(() => this._registry.unregister(O)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(O), d?.(), O;
    }
    const k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
    for (const _ of e)
      k.set(_.key, _.from), v.set(_.key, _.to);
    let A;
    if (x) {
      A = /* @__PURE__ */ new Map();
      for (const _ of e) {
        if (typeof _.from != "number" || typeof _.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${_.key}" is non-numeric; snapping to target.`
          ), _.apply(_.to);
          continue;
        }
        let D = 0;
        if (x.type === "decay" || x.type === "inertia") {
          const L = x.velocity;
          if (typeof L == "number")
            D = L;
          else if (L && typeof L == "object") {
            const W = L, C = mi(_.key);
            D = W[_.key] ?? (C ? W[C] ?? 0 : 0);
          }
          const O = x.power ?? 0.8;
          D *= O;
        }
        A.set(_.key, {
          value: _.from,
          velocity: D,
          target: _.to,
          settled: !1
        });
      }
      A.size === 0 && (A = void 0);
    }
    const S = s === "ping-pong" ? "reverse" : s, P = l === "end" ? "backward" : "forward";
    let $;
    const b = new Promise((_) => {
      $ = _;
    }), E = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: P,
      duration: o,
      easingFn: m,
      loop: S,
      onStart: a,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: $,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      _lastTickWallTime: 0,
      snapshot: k,
      target: v,
      _currentFinished: b,
      whilePredicate: h,
      whileStopMode: g,
      motionConfig: A ? x : void 0,
      physicsStates: A,
      maxDuration: y,
      isPhysics: !!A,
      _prevElapsed: 0
    };
    if (l === "end")
      for (const _ of E.entries)
        _.apply(_.to), E.currentValues.set(_.key, _.to);
    else
      for (const _ of E.entries)
        E.currentValues.set(_.key, _.from);
    for (const _ of e)
      this._ownership.set(_.key, E);
    this._groups.add(E);
    const N = this._engine.register((_) => this._tick(E, _), r);
    E.engineHandle = N;
    const M = [...f ? [f] : [], ...u ?? []], w = {
      _tags: M.length > 0 ? M : void 0,
      pause: () => this._pause(E),
      resume: () => this._resume(E),
      stop: (_) => this._stop(E, _?.mode ?? "jump-end"),
      reverse: () => this._reverse(E),
      play: () => this._play(E),
      playForward: () => this._playDirection(E, "forward"),
      playBackward: () => this._playDirection(E, "backward"),
      restart: (_) => this._restart(E, _),
      get direction() {
        return E.direction;
      },
      get isFinished() {
        return E.isFinished;
      },
      get currentValue() {
        return E.currentValues;
      },
      get finished() {
        return E._currentFinished;
      },
      get _snapshot() {
        return E.snapshot;
      },
      get _target() {
        return E.target;
      }
    };
    return this._registry.register(w), E._handle = w, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(w), w;
  }
  /** Stop all active animations. */
  stopAll(e) {
    const n = e?.mode ?? "jump-end";
    for (const o of this._groups)
      o.stopped || this._stop(o, n);
    this._groups.clear(), this._ownership.clear();
  }
  // ── Internal: tick ───────────────────────────────────────────────────
  /**
   * Per-frame tick for an animation group.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  _tick(e, n) {
    if (e.stopped)
      return !0;
    if (e.pausedElapsed !== null)
      return;
    if (e.isPhysics)
      return this._tickPhysics(e, n);
    if (e.whilePredicate && !e.whilePredicate())
      return this._stop(e, e.whileStopMode), !0;
    e._resumeNeeded && (e.startTime += n - e._lastElapsed, e._resumeNeeded = !1), e.startTime === 0 && (e.startTime = n), e.startFired || (e.startFired = !0, e.onStart?.()), e._lastElapsed = n, e._lastTickWallTime = typeof performance < "u" ? performance.now() : Date.now();
    const o = n - e.startTime;
    let i = Math.min(o / e.duration, 1);
    if (e.loop && i >= 1)
      if (e.loop === "reverse") {
        const l = o / e.duration, a = Math.floor(l), c = l - a;
        i = a % 2 === 0 ? c : 1 - c;
      } else
        i = o % e.duration / e.duration;
    const r = e.direction === "backward" ? 1 - i : i, s = e.easingFn(r);
    for (const l of e.entries) {
      const a = Yu(l.from, l.to, s);
      e.currentValues.set(l.key, a), l.apply(a);
    }
    if (e.onProgress?.(r), !e.loop && i >= 1) {
      for (const l of e.entries) {
        const a = e.direction === "backward" ? l.from : l.to;
        l.apply(a), e.currentValues.set(l.key, a);
      }
      return this._completeGroup(e), !0;
    }
  }
  /**
   * Mark a group as complete: set flags, clean up, fire callbacks, resolve promise,
   * and schedule auto-deregistration. Shared by both the eased and physics paths.
   */
  _completeGroup(e) {
    if (e.stopped = !0, e.isFinished = !0, this._cleanup(e), e.onComplete?.(), e.resolve?.(), e._handle) {
      const n = e._handle;
      queueMicrotask(() => {
        e.isFinished && this._registry.unregister(n);
      });
    }
  }
  /**
   * Per-frame tick for a physics-based animation group.
   * Runs the physics integrator (spring, etc.) each frame instead of eased interpolation.
   * @returns `true` when the animation is complete (to unregister from engine).
   */
  _tickPhysics(e, n) {
    if (e.whilePredicate && !e.whilePredicate())
      return this._stop(e, e.whileStopMode), !0;
    e._resumeNeeded && (e._resumeNeeded = !1, e._prevElapsed = n, e.startTime = n - (e._lastElapsed - e.startTime)), e.startTime === 0 && (e.startTime = n), e.startFired || (e.startFired = !0, e.onStart?.());
    const o = e._prevElapsed || n, i = Math.min((n - o) / 1e3, 0.064);
    if (e._prevElapsed = n, e._lastElapsed = n, e._lastTickWallTime = typeof performance < "u" ? performance.now() : Date.now(), i <= 0)
      return;
    const r = e.physicsStates;
    let s = !0;
    for (const c of e.entries) {
      const d = r.get(c.key);
      if (d) {
        if (!d.settled) {
          switch (e.direction === "backward" ? d.target = e.snapshot.get(c.key) : d.target = e.target.get(c.key), e.motionConfig.type) {
            case "spring":
              Pr(d, e.motionConfig, i);
              break;
            case "decay":
              gi(d, e.motionConfig, i);
              break;
            case "inertia":
              Mr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const f = n - e.startTime, u = e.motionConfig.duration ?? e.maxDuration, h = Math.min(f / u, 1);
              Tr(d, e.motionConfig, h, c.key);
              break;
            }
          }
          e.currentValues.set(c.key, d.value), c.apply(d.value);
        }
        d.settled || (s = !1);
      }
    }
    const l = n - e.startTime, a = Math.min(l / e.maxDuration, 1);
    if (e.onProgress?.(a), l >= e.maxDuration) {
      for (const [c, d] of r)
        if (!d.settled) {
          d.value = d.target, d.velocity = 0, d.settled = !0;
          const f = e.entries.find((u) => u.key === c);
          f && (f.apply(d.value), e.currentValues.set(f.key, d.value));
        }
      s = !0;
    }
    if (s)
      return this._completeGroup(e), !0;
  }
  // ── Internal: handle actions ─────────────────────────────────────────
  _pause(e) {
    e.stopped || e.pausedElapsed !== null || e.startTime === 0 || (e.pausedElapsed = e._lastElapsed);
  }
  _resume(e) {
    e.stopped || e.pausedElapsed === null || (e._resumeNeeded = !0, e.pausedElapsed = null);
  }
  _stop(e, n = "jump-end") {
    if (!e.stopped) {
      if (e.stopped = !0, e.engineHandle.stop(), n === "jump-end") {
        for (const o of e.entries) {
          const i = e.direction === "backward" ? o.from : o.to;
          o.apply(i);
        }
        if (e.isPhysics && e.physicsStates)
          for (const [, o] of e.physicsStates)
            o.value = o.target, o.velocity = 0, o.settled = !0;
      } else if (n === "rollback")
        for (const o of e.entries) {
          const i = e.snapshot.get(o.key);
          i !== void 0 && o.apply(i);
        }
      if (this._cleanup(e), n !== "superseded" && e.onComplete?.(), e.resolve?.(), e._handle) {
        const o = e._handle;
        queueMicrotask(() => {
          (e.isFinished || e.stopped) && this._registry.unregister(o);
        });
      }
    }
  }
  _reverse(e) {
    if (e.isFinished) {
      if (e.direction = e.direction === "forward" ? "backward" : "forward", e.isPhysics && e.physicsStates)
        for (const [n, o] of e.physicsStates)
          e.direction === "backward" ? o.target = e.snapshot.get(n) : o.target = e.target.get(n), o.velocity = 0, o.settled = !1;
      this._revive(e);
      return;
    }
    if (!e.stopped) {
      if (e.direction = e.direction === "forward" ? "backward" : "forward", e.isPhysics && e.physicsStates) {
        for (const [n, o] of e.physicsStates)
          e.direction === "backward" ? o.target = e.snapshot.get(n) : o.target = e.target.get(n), o.velocity = 0, o.settled = !1;
        return;
      }
      if (e._lastElapsed === 0 && e.startTime === 0) {
        e.startTime = -e.duration;
        return;
      }
      if (e._lastElapsed > 0) {
        const n = this._estimatedCurrentElapsed(e), o = Math.min((n - e.startTime) / e.duration, 1);
        e.startTime = n - (1 - o) * e.duration;
      }
    }
  }
  /**
   * Best estimate of the current elapsed time for a group, accounting for
   * wall-clock time that has passed since the last engine tick. Used by
   * reverse/restart/play-direction paths that run synchronously from user
   * input between ticks — without this correction, _lastElapsed can be up
   * to 16ms stale and causes a visible direction-flip jump.
   */
  _estimatedCurrentElapsed(e) {
    if (e._lastTickWallTime <= 0) return e._lastElapsed;
    const n = typeof performance < "u" ? performance.now() : Date.now(), o = Math.max(0, n - e._lastTickWallTime);
    return e._lastElapsed + Math.min(o, 32);
  }
  _play(e) {
    if (e.isFinished) {
      this._revive(e);
      return;
    }
    e.stopped || e.pausedElapsed !== null && this._resume(e);
  }
  _playDirection(e, n) {
    const o = e.direction !== n;
    if (e.direction = n, e.isFinished) {
      this._revive(e);
      return;
    }
    if (!e.stopped) {
      if (o && e.isPhysics && e.physicsStates)
        for (const [i, r] of e.physicsStates)
          n === "backward" ? r.target = e.snapshot.get(i) : r.target = e.target.get(i), r.velocity = 0, r.settled = !1;
      else if (o && e._lastElapsed > 0) {
        const i = this._estimatedCurrentElapsed(e), r = Math.min((i - e.startTime) / e.duration, 1);
        e.startTime = i - (1 - r) * e.duration;
      }
      e.pausedElapsed !== null && this._resume(e);
    }
  }
  _restart(e, n) {
    const o = n?.direction ?? "forward";
    if (e.direction = o, o === "forward")
      for (const i of e.entries) {
        const r = e.snapshot.get(i.key);
        r !== void 0 && (i.apply(r), e.currentValues.set(i.key, r));
      }
    else
      for (const i of e.entries) {
        const r = e.target.get(i.key);
        r !== void 0 && (i.apply(r), e.currentValues.set(i.key, r));
      }
    if (e.isPhysics && e.physicsStates)
      for (const [i, r] of e.physicsStates)
        o === "forward" ? (r.value = e.snapshot.get(i), r.target = e.target.get(i)) : (r.value = e.target.get(i), r.target = e.snapshot.get(i)), r.velocity = 0, r.settled = !1;
    this._revive(e);
  }
  /** Revive a finished/stopped group: reset timing, re-register on engine, renew promise. */
  _revive(e) {
    if (e.isFinished = !1, e.stopped = !1, e.startTime = 0, e.startFired = !1, e.pausedElapsed = null, e._resumeNeeded = !1, e._lastElapsed = 0, e._prevElapsed = 0, e.isPhysics && e.physicsStates)
      for (const [o, i] of e.physicsStates)
        i.settled && (e.direction === "forward" ? (i.value = e.snapshot.get(o), i.target = e.target.get(o)) : (i.value = e.target.get(o), i.target = e.snapshot.get(o)), i.velocity = 0, i.settled = !1);
    this._renewFinished(e);
    for (const o of e.entries)
      this._ownership.set(o.key, e);
    this._groups.add(e), e._handle && this._registry.register(e._handle);
    const n = this._engine.register((o) => this._tick(e, o));
    e.engineHandle = n;
  }
  /** Create a new finished promise for the group (old one stays resolved). */
  _renewFinished(e) {
    e.resolve = null;
    const n = new Promise((o) => {
      e.resolve = o;
    });
    e._currentFinished = n;
  }
  // ── Internal: cleanup ────────────────────────────────────────────────
  _cleanup(e) {
    for (const n of e.entries) {
      const o = this._ownership.get(n.key);
      o && o._id === e._id && this._ownership.delete(n.key);
    }
    this._groups.delete(e);
  }
}
const Nr = /* @__PURE__ */ new Map();
function ju(t, e) {
  Nr.set(t, e);
}
function bo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Dt(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Rt(t, e) {
  return `${e}__${t.type}__${(t.color ?? hi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Jn(t, e) {
  const n = bo(t.color ?? hi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = bo(t.orient ?? "auto-start-reverse"), a = bo(e);
  if (t.type === "arrow")
    return `<marker
      id="${a}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${l}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${n}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="none"
        points="-5,-4 0,0 -5,4"
      />
    </marker>`;
  if (t.type === "arrowclosed")
    return `<marker
      id="${a}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${l}"
      markerUnits="strokeWidth"
      refX="0"
      refY="0"
    >
      <polyline
        stroke="${n}"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        fill="${n}"
        points="-5,-4 0,0 -5,4 -5,-4"
      />
    </marker>`;
  const c = Nr.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : Jn({ ...t, type: "arrowclosed" }, e);
}
const wt = 200, vt = 150, Uu = 1.2, Jt = "http://www.w3.org/2000/svg";
function Zu(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Jt, "svg");
  c.setAttribute("width", String(wt)), c.setAttribute("height", String(vt));
  const d = document.createElementNS(Jt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(wt)), d.setAttribute("height", String(vt));
  const f = document.createElementNS(Jt, "g");
  f.classList.add("flow-minimap-nodes");
  const u = document.createElementNS(Jt, "path");
  u.classList.add("flow-minimap-mask"), s && u.setAttribute("fill", s), u.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(f), c.appendChild(u), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const N = n();
    if (h = qt(N.nodes.filter((M) => !M.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      h.width / wt,
      h.height / vt
    ) * Uu;
  }
  function y(N) {
    return typeof l == "function" ? l(N) : l;
  }
  function m() {
    const N = n();
    p(), f.innerHTML = "";
    const M = (wt - h.width / g) / 2, w = (vt - h.height / g) / 2;
    for (const _ of N.nodes) {
      if (_.hidden) continue;
      const D = document.createElementNS(Jt, "rect"), L = (_.dimensions?.width ?? ve) / g, O = (_.dimensions?.height ?? _e) / g, W = (_.position.x - h.x) / g + M, C = (_.position.y - h.y) / g + w;
      D.setAttribute("x", String(W)), D.setAttribute("y", String(C)), D.setAttribute("width", String(L)), D.setAttribute("height", String(O)), D.setAttribute("rx", "2");
      const T = y(_);
      T && (D.style.fill = T), f.appendChild(D);
    }
    x();
  }
  function x() {
    const N = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      u.setAttribute("d", "");
      return;
    }
    const M = (wt - h.width / g) / 2, w = (vt - h.height / g) / 2, _ = (-N.viewport.x / N.viewport.zoom - h.x) / g + M, D = (-N.viewport.y / N.viewport.zoom - h.y) / g + w, L = N.containerWidth / N.viewport.zoom / g, O = N.containerHeight / N.viewport.zoom / g, W = `M0,0 H${wt} V${vt} H0 Z`, C = `M${_},${D} h${L} v${O} h${-L} Z`;
    u.setAttribute("d", `${W} ${C}`);
  }
  let k = !1;
  function v(N, M) {
    const w = (wt - h.width / g) / 2, _ = (vt - h.height / g) / 2, D = (N - w) * g + h.x, L = (M - _) * g + h.y;
    return { x: D, y: L };
  }
  function A(N) {
    const M = c.getBoundingClientRect(), w = N.clientX - M.left, _ = N.clientY - M.top, D = n(), L = v(w, _), O = -L.x * D.viewport.zoom + D.containerWidth / 2, W = -L.y * D.viewport.zoom + D.containerHeight / 2;
    o({ x: O, y: W, zoom: D.viewport.zoom });
  }
  function S(N) {
    i.minimapPannable && (k = !0, c.setPointerCapture(N.pointerId), A(N));
  }
  function P(N) {
    k && A(N);
  }
  function $(N) {
    k && (k = !1, c.releasePointerCapture(N.pointerId));
  }
  c.addEventListener("pointerdown", S), c.addEventListener("pointermove", P), c.addEventListener("pointerup", $);
  function b(N) {
    if (!i.minimapZoomable)
      return;
    N.preventDefault();
    const M = n(), w = i.minZoom ?? 0.5, _ = i.maxZoom ?? 2, D = N.deltaY > 0 ? 0.9 : 1.1, L = Math.min(Math.max(M.viewport.zoom * D, w), _);
    o({ zoom: L });
  }
  c.addEventListener("wheel", b, { passive: !1 });
  function E() {
    c.removeEventListener("pointerdown", S), c.removeEventListener("pointermove", P), c.removeEventListener("pointerup", $), c.removeEventListener("wheel", b), a.remove();
  }
  return { render: m, updateViewport: x, destroy: E };
}
const Ku = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Gu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', Ju = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', os = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Qu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', ef = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', is = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', tf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function nf(t, e) {
  const {
    position: n,
    orientation: o,
    showZoom: i,
    showFitView: r,
    showInteractive: s,
    showResetPanels: l,
    external: a,
    onZoomIn: c,
    onZoomOut: d,
    onFitView: f,
    onToggleInteractive: u,
    onResetPanels: h,
    onToggleFullscreen: g
  } = e, p = document.createElement("div"), y = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  a ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), p.className = y.join(" "), p.setAttribute("role", "toolbar"), p.setAttribute("aria-label", "Flow controls");
  let m = null, x = null;
  if (i) {
    const A = kt(Ku, "Zoom in", c), S = kt(Gu, "Zoom out", d);
    p.appendChild(A), p.appendChild(S);
  }
  if (r) {
    const A = kt(Ju, "Fit view", f);
    p.appendChild(A);
  }
  if (s && (m = kt(os, "Toggle interactivity", u), p.appendChild(m)), l) {
    const A = kt(ef, "Reset panels", h);
    p.appendChild(A);
  }
  g && (x = kt(is, "Toggle fullscreen", g), x.classList.add("flow-controls-button-fullscreen"), p.appendChild(x)), p.addEventListener("mousedown", (A) => A.stopPropagation()), p.addEventListener("pointerdown", (A) => A.stopPropagation()), p.addEventListener("wheel", (A) => A.stopPropagation(), { passive: !1 }), t.appendChild(p);
  function k(A) {
    if (m && typeof A.isInteractive == "boolean") {
      Wo(m, A.isInteractive ? os : Qu);
      const S = A.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = S, m.setAttribute("aria-label", S);
    }
    if (x && typeof A.isFullscreen == "boolean") {
      Wo(x, A.isFullscreen ? tf : is);
      const S = A.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      x.title = S, x.setAttribute("aria-label", S), x.classList.toggle("flow-controls-button-fullscreen--active", A.isFullscreen);
    }
  }
  function v() {
    p.remove();
  }
  return { update: k, destroy: v };
}
function kt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Wo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Wo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ss = 5;
function of(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function l(u, h, g = "partial") {
    o = u, i = h, r = u, s = h, n = !0, e.style.left = `${u}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${g}`);
  }
  function a(u, h) {
    if (!n)
      return;
    r = u, s = h;
    const g = Math.min(o, r), p = Math.min(i, s), y = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${g}px`, e.style.top = `${p}px`, e.style.width = `${y}px`, e.style.height = `${m}px`;
  }
  function c(u) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), g = Math.abs(s - i);
    if (h < ss && g < ss)
      return null;
    const p = Math.min(o, r), y = Math.min(i, s), m = (p - u.x) / u.zoom, x = (y - u.y) / u.zoom, k = h / u.zoom, v = g / u.zoom;
    return { x: m, y: x, width: k, height: v };
  }
  function d() {
    return n;
  }
  function f() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: f };
}
const rs = 3;
function sf(t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.classList.add("flow-lasso-svg"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), t.appendChild(e);
  const n = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  n.classList.add("flow-lasso-path"), e.appendChild(n);
  let o = !1, i = [];
  function r(d, f, u = "partial") {
    o = !0, i = [{ x: d, y: f }], e.classList.remove("flow-lasso-partial", "flow-lasso-full"), e.classList.add("flow-lasso-active", `flow-lasso-${u}`), n.setAttribute("points", `${d},${f}`);
  }
  function s(d, f) {
    if (!o)
      return;
    const u = i[i.length - 1], h = d - u.x, g = f - u.y;
    h * h + g * g < rs * rs || (i.push({ x: d, y: f }), n.setAttribute("points", i.map((p) => `${p.x},${p.y}`).join(" ")));
  }
  function l(d) {
    if (!o || (o = !1, e.classList.remove("flow-lasso-active", "flow-lasso-partial", "flow-lasso-full"), n.setAttribute("points", ""), i.length < 3))
      return null;
    const f = i.map((u) => ({
      x: (u.x - d.x) / d.zoom,
      y: (u.y - d.y) / d.zoom
    }));
    return i = [], f;
  }
  function a() {
    return o;
  }
  function c() {
    e.remove();
  }
  return { start: r, update: s, end: l, isActive: a, destroy: c };
}
function yi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function rf(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, f = l - r, u = a * f - c * d;
  if (Math.abs(u) < 1e-10) return !1;
  const h = i - t, g = r - e, p = (h * f - g * d) / u, y = (h * c - g * a) / u;
  return p >= 0 && p <= 1 && y >= 0 && y <= 1;
}
function af(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (yi(s, l, t)) return !0;
  for (const c of t)
    if (c.x >= n && c.x <= i && c.y >= o && c.y <= r) return !0;
  const a = [
    [n, o, i, o],
    // top
    [i, o, i, r],
    // right
    [i, r, n, r],
    // bottom
    [n, r, n, o]
    // left
  ];
  for (let c = 0, d = t.length - 1; c < t.length; d = c++)
    for (const [f, u, h, g] of a)
      if (rf(t[d].x, t[d].y, t[c].x, t[c].y, f, u, h, g))
        return !0;
  return !1;
}
function $r(t) {
  const e = t.dimensions?.width ?? ve, n = t.dimensions?.height ?? _e;
  return t.rotation ? go(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function lf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = $r(n);
    return af(e, o);
  });
}
function cf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = $r(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => yi(r.x, r.y, e));
  });
}
function df(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function jo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function uf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function ff(t, e, n) {
  if (t === e) return !0;
  const o = /* @__PURE__ */ new Map();
  for (const s of n) {
    let l = o.get(s.source);
    l || (l = [], o.set(s.source, l)), l.push(s.target);
  }
  const i = [e], r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const s = i.pop();
    if (s === t) return !0;
    if (r.has(s)) continue;
    r.add(s);
    const l = o.get(s);
    if (l)
      for (const a of l)
        r.has(a) || i.push(a);
  }
  return !1;
}
function hf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function pf(t, e, n) {
  const o = new Map(e.map((a) => [a.id, a])), i = new Set(
    n.map((a) => `${a.source}|${a.target}|${a.sourceHandle ?? ""}|${a.targetHandle ?? ""}`)
  ), r = [], s = /* @__PURE__ */ new Set();
  let l = 0;
  for (const a of t) {
    if (o.get(a)?.reconnectOnDelete === !1) continue;
    const d = n.filter(
      (u) => u.target === a && !t.has(u.source)
    ), f = n.filter(
      (u) => u.source === a && !t.has(u.target)
    );
    if (!(d.length === 0 || f.length === 0))
      for (const u of d)
        for (const h of f) {
          if (u.source === h.target) continue;
          const g = `${u.source}|${h.target}|${u.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(g) || s.has(g)) continue;
          const p = {
            id: `reconnect-${u.source}-${h.target}-${l++}`,
            source: u.source,
            target: h.target,
            sourceHandle: u.sourceHandle,
            targetHandle: h.targetHandle
          };
          u.type && (p.type = u.type), u.animated !== void 0 && (p.animated = u.animated), u.style && (p.style = u.style), u.class && (p.class = u.class), u.markerEnd && (p.markerEnd = u.markerEnd), u.markerStart && (p.markerStart = u.markerStart), u.label && (p.label = u.label), s.add(g), r.push(p);
        }
  }
  return r;
}
function lt(t, e, n) {
  if (!e) return !0;
  const o = n.get(t.source), i = n.get(t.target);
  if (!o || !i) return !0;
  const { byType: r } = e;
  if (r) {
    const s = o.type ?? "";
    if (Object.prototype.hasOwnProperty.call(r, s) && !r[s].includes(i.type ?? ""))
      return !1;
  }
  return !(typeof e.validate == "function" && !e.validate(t, o, i));
}
function ct(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && ff(t.source, t.target, e));
}
const dt = "_flowHandleValidate";
function gf(t) {
  t.directive(
    "flow-handle-validate",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      function s() {
        let l;
        try {
          l = o(n);
        } catch {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (l = a[n]);
        }
        typeof l == "function" ? e[dt] = l : (delete e[dt], requestAnimationFrame(() => {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (e[dt] = a[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[dt];
      });
    }
  );
}
const Et = "_flowHandleLimit";
function mf(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[Et] = s : delete e[Et];
      }), r(() => {
        delete e[Et];
      });
    }
  );
}
const Ft = "_flowHandleConnectableStart", ut = "_flowHandleConnectableEnd";
function yf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const f = n ? !!i(n) : !0;
        c && (e[Ft] = f), d && (e[ut] = f);
      }), s(() => {
        delete e[Ft], delete e[ut];
      });
    }
  );
}
function _n(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Ir(t) {
  return _n(t, t.draggable);
}
function wf(t) {
  return _n(t, t.deletable);
}
function ze(t) {
  return _n(t, t.connectable);
}
function Uo(t) {
  return _n(t, t.selectable);
}
function as(t) {
  return _n(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const f = Math.sqrt(l * l + a * a), u = Math.sqrt(c * c + d * d), h = Math.min(s, f / 2, u / 2), g = n - l / f * h, p = o - a / f * h, y = n + c / u * h, m = o + d / u * h;
  return `L${g},${p} Q${n},${o} ${y},${m}`;
}
function bn({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - t) / 2, r = Math.abs(o - e) / 2;
  return {
    x: (t + n) / 2,
    y: (e + o) / 2,
    offsetX: i,
    offsetY: r
  };
}
function Mn(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function vf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const l = n === "left" || n === "right", a = r === "left" || r === "right", c = l ? t + (n === "right" ? 1 : -1) * Mn(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = l ? e : e + (n === "bottom" ? 1 : -1) * Mn(
    n === "bottom" ? i - e : e - i,
    s
  ), f = a ? o + (r === "right" ? 1 : -1) * Mn(
    r === "right" ? t - o : o - t,
    s
  ) : o, u = a ? i : i + (r === "bottom" ? 1 : -1) * Mn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, f, u];
}
function Qn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = vf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: f, offsetX: u, offsetY: h } = bn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function iy({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: l, offsetX: a, offsetY: c } = bn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: l },
    labelOffsetX: a,
    labelOffsetY: c
  };
}
function ls(t) {
  switch (t) {
    case "top":
    case "top-left":
    case "top-right":
      return { x: 0, y: -1 };
    case "bottom":
    case "bottom-left":
    case "bottom-right":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}
function _f(t, e, n, o, i, r, s) {
  const l = ls(n), a = ls(r), c = t + l.x * s, d = e + l.y * s, f = o + a.x * s, u = i + a.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const p = (c + f) / 2, y = (d + u) / 2;
    return h ? [
      [c, e],
      [p, e],
      [p, i],
      [f, i]
    ] : [
      [t, d],
      [t, y],
      [o, y],
      [o, u]
    ];
  }
  return h ? [
    [c, e],
    [o, e],
    [o, u]
  ] : [
    [t, d],
    [t, i],
    [f, i]
  ];
}
function yn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: l = 10
}) {
  const a = _f(
    t,
    e,
    n,
    o,
    i,
    r,
    l
  );
  let c = `M${t},${e}`;
  for (let g = 0; g < a.length; g++) {
    const [p, y] = a[g];
    if (s > 0 && g > 0 && g < a.length - 1) {
      const [m, x] = g === 1 ? [t, e] : a[g - 1], [k, v] = a[g + 1];
      c += ` ${Xt(m, x, p, y, k, v, s)}`;
    } else
      c += ` L${p},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: f, offsetX: u, offsetY: h } = bn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function bf(t) {
  return yn({ ...t, borderRadius: 0 });
}
function Dr({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: l, offsetY: a } = bn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: l,
    labelOffsetY: a
  };
}
const it = 40;
function xf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < it && s >= 0 ? i = -o * (1 - s / it) : l < it && l >= 0 && (i = o * (1 - l / it)), a < it && a >= 0 ? r = -o * (1 - a / it) : c < it && c >= 0 && (r = o * (1 - c / it)), { dx: i, dy: r };
}
function Rr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: f } = xf(r, s, c, n);
    if ((d !== 0 || f !== 0) && o(d, f) === !0) {
      l = !1, i = null;
      return;
    }
    i = requestAnimationFrame(a);
  }
  return {
    start() {
      l || t.isLocked?.() || (l = !0, i = requestAnimationFrame(a));
    },
    stop() {
      l = !1, i !== null && (cancelAnimationFrame(i), i = null);
    },
    updatePointer(c, d) {
      r = c, s = d;
    },
    destroy() {
      this.stop();
    }
  };
}
function Ht(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Cr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || gn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Ru),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Fu
  }, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.setAttribute("class", "flow-connect-line"), i.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;";
  let r = null;
  function s(a) {
    const c = {
      ...a,
      connectionLineType: e,
      connectionLineStyle: o
    };
    if (t.connectionLine) {
      r && r.remove(), r = t.connectionLine(c), i.appendChild(r);
      return;
    }
    r || (r = document.createElementNS("http://www.w3.org/2000/svg", "path"), r.setAttribute("fill", "none"), i.appendChild(r)), r.setAttribute("stroke", o.stroke), r.setAttribute("stroke-width", String(o.strokeWidth)), r.setAttribute("stroke-dasharray", o.strokeDasharray);
    const { fromX: d, fromY: f, toX: u, toY: h } = a;
    let g;
    switch (e) {
      case "bezier": {
        g = Qn({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        g = yn({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      case "step": {
        g = bf({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      default: {
        g = Dr({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
    }
    r.setAttribute("d", g);
  }
  function l() {
    i.remove();
  }
  return { svg: i, update: s, destroy: l };
}
function an(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const l = s, a = l.closest("[x-flow-node]");
    if (!a || a.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && a.dataset.flowNodeId !== t.targetNodeId) return;
    const c = a.dataset.flowNodeId;
    if (c) {
      const g = t.getNode(c);
      if (g && !ze(g)) return;
    }
    const d = t.handleType === "target" ? ut : Ft;
    if (l[d] === !1) return;
    const f = l.getBoundingClientRect();
    if (f.width === 0 && f.height === 0) return;
    const u = t.toFlowPosition(
      f.left + f.width / 2,
      f.top + f.height / 2
    ), h = Math.sqrt(
      (t.cursorFlowPos.x - u.x) ** 2 + (t.cursorFlowPos.y - u.y) ** 2
    );
    h < r && (r = h, o = l, i = u);
  }), { element: o, position: i };
}
function eo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Rr({
    container: t,
    speed: e._config?.autoPanSpeed ?? 15,
    onPan(r, s) {
      const l = () => e._viewportLive ?? e.viewport, a = { x: l().x, y: l().y };
      e._panZoom?.setViewport({
        x: l().x - r,
        y: l().y - s,
        zoom: l().zoom
      });
      const c = a.x - l().x, d = a.y - l().y;
      return c === 0 && d === 0;
    }
  });
  return i.updatePointer(n, o), i.start(), i;
}
let on = 0;
const Tn = /* @__PURE__ */ new WeakMap();
function Ke(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[dt] && !r[dt](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[dt] && !r[dt](e))
      return !1;
  }
  return !0;
}
function Ge(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[Et] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[Et])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[Et] && n.filter(
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[Et])
      return !1;
  }
  return !0;
}
function ln(t, e, n, o, i) {
  const r = i ? o.edges.filter((l) => l.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const l of s) {
    const c = l.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = l.dataset.flowHandleId ?? "target";
    if (l[ut] === !1) {
      l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const f = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && ct(f, r, { preventCycles: o._config?.preventCycles }), g = h && Ge(t, f, r);
    g && Ke(t, f) && (!o._config?.isValidConnection || o._config.isValidConnection(f)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !g ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
  }
}
function Pe(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function bt(t, e) {
  t && (e ? t.classList.add("flow-connect-line--validating") : t.classList.remove("flow-connect-line--validating"));
}
function Ae(t, e) {
  const n = {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: e.reason
  };
  t && (e.reason !== void 0 ? console.warn("[alpineflow] connection rejected:", e.reason) : console.warn("[alpineflow] connection rejected"), t.dispatchEvent(new CustomEvent("flow-connect-rejected", {
    detail: n,
    bubbles: !0
  })));
}
async function to(t, e, n, o, i, r) {
  if (!t) return { allowed: !0 };
  n?.classList.add(r), o?.classList.add(r), i.dispatchEvent(new CustomEvent("flow-connect-validating", {
    detail: { connection: e },
    bubbles: !0
  }));
  let s;
  try {
    s = await t(e);
  } catch (c) {
    q("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const l = typeof s == "boolean" ? s : !!s?.allowed, a = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: l, reason: a },
    bubbles: !0
  })), { allowed: l, reason: a };
}
async function Fr(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), l = (c) => (Ae(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!ct(n, s, { preventCycles: o._config?.preventCycles }) || !lt(n, o._config?.connectionRules, o._nodeMap) || !Ge(i, n, s) || !Ke(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return l();
  const a = o._config?.connectValidator;
  if (a) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: f } = no(i, n);
    o._connectValidating = !0;
    let u;
    try {
      u = await to(
        a,
        n,
        d,
        f,
        i,
        c
      );
    } finally {
      o._connectValidating = !1;
    }
    if (!u.allowed)
      return l(u.reason);
  }
  return o._captureHistory?.(), r === "source" ? (e.source = n.source, e.sourceHandle = n.sourceHandle) : (e.target = n.target, e.targetHandle = n.targetHandle), { applied: !0 };
}
async function Hr(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ae(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !ze(s) || !ct(e, i, { preventCycles: n._config?.preventCycles }) || !lt(e, n._config?.connectionRules, n._nodeMap) || !Ge(o, e, i) || !Ke(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const l = n._config?.connectValidator;
  if (l) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: f, targetEl: u } = no(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await to(
        l,
        e,
        f,
        u,
        o,
        d
      );
    } finally {
      n._connectValidating = !1;
    }
    if (!h.allowed)
      return r(h.reason);
  }
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${on++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function no(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  ), o = e.sourceHandle ?? "source", i = n?.querySelector(
    `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="source"]`
  ) ?? n?.querySelector(`[data-flow-handle-id="${CSS.escape(o)}"]`) ?? null, r = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  ), s = e.targetHandle ?? "target", l = r?.querySelector(
    `[data-flow-handle-id="${CSS.escape(s)}"][data-flow-handle-type="target"]`
  ) ?? r?.querySelector(`[data-flow-handle-id="${CSS.escape(s)}"]`) ?? null;
  return { sourceEl: i, targetEl: l };
}
function Ef(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), f = o.includes("left"), u = o.includes("right"), h = c || d || f || u;
      let g;
      c && f ? g = "top-left" : c && u ? g = "top-right" : d && f ? g = "bottom-left" : d && u ? g = "bottom-right" : c ? g = "top" : u ? g = "right" : d ? g = "bottom" : f ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let p, y = !1;
      if (i) {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) ? (p = v.id || e.getAttribute("data-flow-handle-id") || a, v.position && (g = v.position, y = !0)) : p = v || e.getAttribute("data-flow-handle-id") || a;
      } else
        p = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) && v.position && (e.dataset.flowHandlePosition = v.position);
      })), !h && !y) {
        const v = () => {
          const S = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!S) return;
          const P = e.closest("[x-data]");
          return P ? t.$data(P)?.getNode?.(S) : void 0;
        };
        s(() => {
          const A = v();
          if (!A) return;
          const S = a === "source" ? A.sourcePosition : A.targetPosition;
          S && (e.dataset.flowHandlePosition = S);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${a}`);
      const m = () => {
        const v = e.closest("[x-flow-node]");
        return v ? v.getAttribute("data-flow-node-id") ?? null : null;
      }, x = () => {
        const v = e.closest("[x-data]");
        return v ? t.$data(v) : null;
      };
      let k = null;
      if (x()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${p}`);
        const A = ($) => {
          const b = $?._pendingKeyboardConnect;
          if (!b) return;
          const E = e.closest(".flow-container");
          E && E.querySelector(
            `[data-flow-node-id="${CSS.escape(b.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(b.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), $ && ($._pendingKeyboardConnect = null);
        }, S = ($) => {
          if (!($.key === "Enter" || $.key === " " || $.key === "Spacebar")) return;
          const E = x();
          if (!E || E._animationLocked) return;
          const N = m();
          if (N)
            if (a === "source") {
              const M = E.getNode?.(N);
              if (M && !ze(M) || e[Ft] === !1) return;
              $.preventDefault(), $.stopPropagation(), A(E), E._pendingKeyboardConnect = {
                sourceNodeId: N,
                sourceHandleId: p
              }, e.classList.add("flow-handle-connect-pending"), E._announcer?.announce?.(`Connecting from ${a} handle ${p}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!E._pendingKeyboardConnect) return;
              const M = E.getNode?.(N);
              if (M && !ze(M) || e[ut] === !1) return;
              $.preventDefault(), $.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: _ } = E._pendingKeyboardConnect, D = {
                source: w,
                sourceHandle: _,
                target: N,
                targetHandle: p
              }, L = e.closest(".flow-container");
              if (A(E), !L) return;
              Hr({ connection: D, canvas: E, containerEl: L }).then((O) => {
                O.applied && E._announcer?.announce?.(`Connected ${w} to ${N}.`);
              });
            }
        };
        e.addEventListener("keydown", S);
        const P = e.closest(".flow-container");
        if (P) {
          const $ = Tn.get(P);
          if ($)
            $.count += 1;
          else {
            const b = (E) => {
              if (E.key !== "Escape") return;
              const N = P.matches("[x-data]") ? P : P.closest("[x-data]") ?? P.querySelector("[x-data]");
              if (!N) return;
              const M = t.$data(N);
              M?._pendingKeyboardConnect && A(M);
            };
            P.addEventListener("keydown", b), Tn.set(P, { count: 1, handler: b });
          }
        }
        k = () => {
          if (e.removeEventListener("keydown", S), P) {
            const $ = Tn.get(P);
            $ && ($.count -= 1, $.count <= 0 && (P.removeEventListener("keydown", $.handler), Tn.delete(P)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let v = null;
        const A = ($) => {
          $.preventDefault(), $.stopPropagation();
          const b = x(), E = e.closest("[x-flow-node]");
          if (!b || !E || b._animationLocked) return;
          const N = E.dataset.flowNodeId;
          if (!N) return;
          const M = b.getNode(N);
          if (M && !ze(M) || e[Ft] === !1) return;
          const w = $.clientX, _ = $.clientY;
          let D = !1;
          if (b.pendingConnection && b._config?.connectOnClick !== !1) {
            b._emit("connect-end", {
              connection: null,
              source: b.pendingConnection.source,
              sourceHandle: b.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
            const F = e.closest(".flow-container");
            F && Pe(F);
          }
          let L = null, O = null, W = null, C = null, T = null;
          const R = b._config?.connectionSnapRadius ?? 20, X = e.closest(".flow-container");
          let se = 0, ne = 0, ie = !1, le = /* @__PURE__ */ new Map();
          const de = () => {
            if (D = !0, q("connection", `Connection drag started from node "${N}" handle "${p}"`), b._emit("connect-start", { source: N, sourceHandle: p }), !X) return;
            O = Ht({
              connectionLineType: b._config?.connectionLineType,
              connectionLineStyle: b._config?.connectionLineStyle,
              connectionLine: b._config?.connectionLine,
              containerEl: X
            }), L = O.svg;
            const F = e.getBoundingClientRect(), K = X.getBoundingClientRect(), U = b._viewportLive ?? b.viewport, V = U?.zoom || 1, I = U?.x || 0, re = U?.y || 0;
            se = (F.left + F.width / 2 - K.left - I) / V, ne = (F.top + F.height / 2 - K.top - re) / V, O.update({ fromX: se, fromY: ne, toX: se, toY: ne, source: N, sourceHandle: p });
            const G = X.querySelector(".flow-viewport");
            if (G && G.appendChild(L), b.pendingConnection = {
              source: N,
              sourceHandle: p,
              position: { x: se, y: ne }
            }, C = eo(X, b, w, _), ln(X, N, p, b), b._config?.onEdgeDrop) {
              const Y = b._config.edgeDropPreview, z = Y ? Y({ source: N, sourceHandle: p }) : "New Node";
              if (z !== null) {
                T = document.createElement("div"), T.className = "flow-ghost-node";
                const oe = document.createElement("div");
                if (oe.className = "flow-ghost-handle", T.appendChild(oe), typeof z == "string") {
                  const j = document.createElement("span");
                  j.textContent = z, T.appendChild(j);
                } else
                  T.appendChild(z);
                T.style.left = `${se}px`, T.style.top = `${ne}px`;
                const B = X.querySelector(".flow-viewport");
                B && B.appendChild(T);
              }
            }
          }, ue = () => {
            const F = [...b.selectedNodes], K = [], U = X.getBoundingClientRect(), V = b._viewportLive ?? b.viewport, I = V?.zoom || 1, re = V?.x || 0, G = V?.y || 0;
            for (const Y of F) {
              if (Y === N) continue;
              const z = X?.querySelector(`[data-flow-node-id="${CSS.escape(Y)}"]`)?.querySelector('[data-flow-handle-type="source"]');
              if (!z) continue;
              const oe = z.getBoundingClientRect();
              K.push({
                nodeId: Y,
                handleId: z.dataset.flowHandleId ?? "source",
                pos: {
                  x: (oe.left + oe.width / 2 - U.left - re) / I,
                  y: (oe.top + oe.height / 2 - U.top - G) / I
                }
              });
            }
            return K;
          }, J = (F) => {
            ie = !0, O && (le.set(N, {
              line: O,
              sourceNodeId: N,
              sourceHandleId: p,
              sourcePos: { x: se, y: ne },
              valid: !0
            }), O = null);
            const K = ue(), U = X.querySelector(".flow-viewport");
            for (const V of K) {
              const I = Ht({
                connectionLineType: b._config?.connectionLineType,
                connectionLineStyle: b._config?.connectionLineStyle,
                connectionLine: b._config?.connectionLine,
                containerEl: X
              });
              I.update({
                fromX: V.pos.x,
                fromY: V.pos.y,
                toX: F.x,
                toY: F.y,
                source: V.nodeId,
                sourceHandle: V.handleId
              }), U && U.appendChild(I.svg), le.set(V.nodeId, {
                line: I,
                sourceNodeId: V.nodeId,
                sourceHandleId: V.handleId,
                sourcePos: V.pos,
                valid: !0
              });
            }
          }, ce = (F) => {
            if (!D) {
              const V = F.clientX - w, I = F.clientY - _;
              if (Math.abs(V) >= On || Math.abs(I) >= On) {
                if (de(), b._config?.multiConnect && b.selectedNodes.size > 1 && b.selectedNodes.has(N)) {
                  const re = b.screenToFlowPosition(F.clientX, F.clientY);
                  J(re);
                }
              } else
                return;
            }
            const K = b.screenToFlowPosition(F.clientX, F.clientY);
            if (ie) {
              const V = an({
                containerEl: X,
                handleType: "target",
                excludeNodeId: N,
                cursorFlowPos: K,
                connectionSnapRadius: R,
                getNode: (te) => b.getNode(te),
                toFlowPosition: (te, z) => b.screenToFlowPosition(te, z),
                connectionMode: b._config?.connectionMode
              });
              V.element !== W && (W?.classList.remove("flow-handle-active"), V.element?.classList.add("flow-handle-active"), W = V.element);
              const re = V.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, G = V.element?.dataset.flowHandleId ?? "target", Y = b._config?.connectionLineStyle?.stroke ?? (getComputedStyle(X).getPropertyValue("--flow-edge-stroke-selected").trim() || gn);
              for (const te of le.values())
                if (te.line.update({
                  fromX: te.sourcePos.x,
                  fromY: te.sourcePos.y,
                  toX: V.position.x,
                  toY: V.position.y,
                  source: te.sourceNodeId,
                  sourceHandle: te.sourceHandleId
                }), V.element && re) {
                  const z = {
                    source: te.sourceNodeId,
                    sourceHandle: te.sourceHandleId,
                    target: re,
                    targetHandle: G
                  }, Z = b.getNode(re)?.connectable !== !1 && te.sourceNodeId !== re && ct(z, b.edges, { preventCycles: b._config?.preventCycles }) && lt(z, b._config?.connectionRules, b._nodeMap) && Ge(X, z, b.edges) && Ke(X, z) && (!b._config?.isValidConnection || b._config.isValidConnection(z));
                  te.valid = Z;
                  const ae = te.line.svg.querySelector("path");
                  if (ae)
                    if (Z)
                      ae.setAttribute("stroke", Y);
                    else {
                      const fe = getComputedStyle(X).getPropertyValue("--flow-connection-line-invalid").trim() || Cr;
                      ae.setAttribute("stroke", fe);
                    }
                } else {
                  te.valid = !0;
                  const z = te.line.svg.querySelector("path");
                  z && z.setAttribute("stroke", Y);
                }
              b.pendingConnection = { ...b.pendingConnection, position: V.position }, C?.updatePointer(F.clientX, F.clientY);
              return;
            }
            const U = an({
              containerEl: X,
              handleType: "target",
              excludeNodeId: N,
              cursorFlowPos: K,
              connectionSnapRadius: R,
              getNode: (V) => b.getNode(V),
              toFlowPosition: (V, I) => b.screenToFlowPosition(V, I)
            });
            U.element !== W && (W?.classList.remove("flow-handle-active"), U.element?.classList.add("flow-handle-active"), W = U.element), T ? U.element ? (T.style.display = "none", O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: N, sourceHandle: p })) : (T.style.display = "", T.style.left = `${K.x}px`, T.style.top = `${K.y}px`, O?.update({ fromX: se, fromY: ne, toX: K.x, toY: K.y, source: N, sourceHandle: p })) : O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: N, sourceHandle: p }), b.pendingConnection = { ...b.pendingConnection, position: U.position }, C?.updatePointer(F.clientX, F.clientY);
          }, ee = async (F) => {
            if (C?.stop(), C = null, document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), v = null, b._connectValidating) return;
            if (ie) {
              const I = b.screenToFlowPosition(F.clientX, F.clientY);
              let re = W;
              re || (re = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]'));
              const Y = re?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, te = re?.dataset.flowHandleId ?? "target", z = [], oe = [], B = [], j = [];
              if (re && Y) {
                const H = b.getNode(Y);
                for (const Q of le.values()) {
                  const Z = {
                    source: Q.sourceNodeId,
                    sourceHandle: Q.sourceHandleId,
                    target: Y,
                    targetHandle: te
                  };
                  if (H?.connectable !== !1 && Q.sourceNodeId !== Y && ct(Z, b.edges, { preventCycles: b._config?.preventCycles }) && lt(Z, b._config?.connectionRules, b._nodeMap) && Ge(X, Z, b.edges) && Ke(X, Z) && (!b._config?.isValidConnection || b._config.isValidConnection(Z))) {
                    const Te = `e-${Q.sourceNodeId}-${Y}-${Date.now()}-${on++}`;
                    z.push({ id: Te, ...Z }), oe.push(Z), j.push(Q);
                  } else
                    B.push(Q);
                }
              } else
                B.push(...le.values());
              for (const H of j)
                H.line.destroy();
              if (z.length > 0) {
                b.addEdges(z);
                for (const H of oe)
                  b._emit("connect", { connection: H });
                b._emit("multi-connect", { connections: oe });
              }
              B.length > 0 && setTimeout(() => {
                for (const H of B)
                  H.line.destroy();
              }, 100), W?.classList.remove("flow-handle-active"), b._emit("connect-end", {
                connection: oe.length > 0 ? oe[0] : null,
                source: N,
                sourceHandle: p,
                position: I
              }), le.clear(), ie = !1, Pe(X), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
              return;
            }
            if (!D) {
              b._config?.connectOnClick !== !1 && (q("connection", `Click-to-connect started from node "${N}" handle "${p}"`), b._emit("connect-start", { source: N, sourceHandle: p }), b.pendingConnection = {
                source: N,
                sourceHandle: p,
                position: { x: 0, y: 0 }
              }, b._container?.classList.add("flow-connecting"), ln(X, N, p, b));
              return;
            }
            const K = O?.svg ?? null;
            T?.remove(), T = null, W?.classList.remove("flow-handle-active"), Pe(X);
            const U = b.screenToFlowPosition(F.clientX, F.clientY), V = { source: N, sourceHandle: p, position: U };
            try {
              let I = W;
              if (I || (I = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]')), I) {
                const G = I.closest("[x-flow-node]")?.dataset.flowNodeId, Y = I.dataset.flowHandleId ?? "target";
                if (G) {
                  if (I[ut] === !1) {
                    q("connection", "Connection rejected (handle not connectable end)"), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                    return;
                  }
                  const te = b.getNode(G);
                  if (te && !ze(te)) {
                    q("connection", `Connection rejected (target "${G}" not connectable)`), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                    return;
                  }
                  const z = {
                    source: N,
                    sourceHandle: p,
                    target: G,
                    targetHandle: Y
                  };
                  if (ct(z, b.edges, { preventCycles: b._config?.preventCycles })) {
                    if (!lt(z, b._config?.connectionRules, b._nodeMap)) {
                      q("connection", "Connection rejected (connection rules)", z), Ae(X, z), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                      return;
                    }
                    if (!Ge(X, z, b.edges)) {
                      q("connection", "Connection rejected (handle limit)", z), Ae(X, z), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                      return;
                    }
                    if (!Ke(X, z)) {
                      q("connection", "Connection rejected (per-handle validator)", z), Ae(X, z), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                      return;
                    }
                    if (b._config?.isValidConnection && !b._config.isValidConnection(z)) {
                      q("connection", "Connection rejected (custom validator)", z), Ae(X, z), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                      return;
                    }
                    const oe = b._config?.connectValidator;
                    if (oe) {
                      const j = b._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: H, targetEl: Q } = no(X, z);
                      b._connectValidating = !0, bt(K, !0);
                      let Z;
                      try {
                        Z = await to(
                          oe,
                          z,
                          H,
                          Q,
                          X,
                          j
                        );
                      } finally {
                        b._connectValidating = !1, bt(K, !1);
                      }
                      if (!Z.allowed) {
                        q("connection", "Connection rejected (async connectValidator)", { connection: z, reason: Z.reason }), Ae(X, { ...z, reason: Z.reason }), b._emit("connect-end", { connection: null, ...V }), b.pendingConnection = null;
                        return;
                      }
                    }
                    const B = `e-${N}-${G}-${Date.now()}-${on++}`;
                    b.addEdges({ id: B, ...z }), q("connection", `Connection created: ${N} → ${G}`, z), b._emit("connect", { connection: z }), b._emit("connect-end", { connection: z, ...V });
                  } else
                    q("connection", "Connection rejected (invalid)", z), Ae(X, z), b._emit("connect-end", { connection: null, ...V });
                } else
                  b._emit("connect-end", { connection: null, ...V });
              } else if (b._config?.onEdgeDrop) {
                const re = {
                  x: U.x - ve / 2,
                  y: U.y - _e / 2
                }, G = b._config.onEdgeDrop({
                  source: N,
                  sourceHandle: p,
                  position: re
                });
                if (G) {
                  const Y = {
                    source: N,
                    sourceHandle: p,
                    target: G.id,
                    targetHandle: "target"
                  };
                  if (!Ge(X, Y, b.edges))
                    q("connection", "Edge drop: connection rejected (handle limit)"), b._emit("connect-end", { connection: null, ...V });
                  else if (!Ke(X, Y))
                    q("connection", "Edge drop: connection rejected (per-handle validator)"), b._emit("connect-end", { connection: null, ...V });
                  else if (!b._config.isValidConnection || b._config.isValidConnection(Y)) {
                    b.addNodes(G);
                    const te = `e-${N}-${G.id}-${Date.now()}-${on++}`;
                    b.addEdges({ id: te, ...Y }), q("connection", `Edge drop: created node "${G.id}" and edge`, Y), b._emit("connect", { connection: Y }), b._emit("connect-end", { connection: Y, ...V });
                  } else
                    q("connection", "Edge drop: connection rejected by validator"), b._emit("connect-end", { connection: null, ...V });
                } else
                  q("connection", "Edge drop: callback returned null"), b._emit("connect-end", { connection: null, ...V });
              } else
                q("connection", "Connection cancelled (no target)"), b._emit("connect-end", { connection: null, ...V });
            } finally {
              bt(K, !1), O?.destroy(), O = null;
            }
            b.pendingConnection = null;
          };
          document.addEventListener("pointermove", ce), document.addEventListener("pointerup", ee), document.addEventListener("pointercancel", ee), v = () => {
            document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), C?.stop(), O?.destroy(), O = null, T?.remove(), T = null;
            for (const F of le.values())
              F.line.destroy();
            le.clear(), ie = !1, W?.classList.remove("flow-handle-active"), Pe(X), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", A);
        const S = () => {
          const $ = x();
          if (!$?._pendingReconnection || $._pendingReconnection.draggedEnd !== "source") return;
          const b = m();
          if (b) {
            const E = $.getNode(b);
            if (E && !ze(E)) return;
          }
          e[Ft] !== !1 && e.classList.add("flow-handle-active");
        }, P = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", S), e.addEventListener("pointerleave", P), l(() => {
          v?.(), k?.(), e.removeEventListener("pointerdown", A), e.removeEventListener("pointerenter", S), e.removeEventListener("pointerleave", P), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const v = () => {
          const b = x();
          if (!b?.pendingConnection) return;
          const E = m();
          if (E) {
            const N = b.getNode(E);
            if (N && !ze(N)) return;
          }
          e[ut] !== !1 && e.classList.add("flow-handle-active");
        }, A = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", v), e.addEventListener("pointerleave", A);
        const S = async (b) => {
          const E = x();
          if (!E?.pendingConnection || E._config?.connectOnClick === !1 || E._connectValidating) return;
          b.preventDefault(), b.stopPropagation();
          const N = m();
          if (!N) return;
          if (e[ut] === !1) {
            q("connection", "Click-to-connect rejected (handle not connectable end)"), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Pe(L);
            return;
          }
          const M = E.getNode(N);
          if (M && !ze(M)) {
            q("connection", `Click-to-connect rejected (target "${N}" not connectable)`), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Pe(L);
            return;
          }
          const w = {
            source: E.pendingConnection.source,
            sourceHandle: E.pendingConnection.sourceHandle,
            target: N,
            targetHandle: p
          }, _ = { source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (ct(w, E.edges, { preventCycles: E._config?.preventCycles })) {
            const L = e.closest(".flow-container");
            if (!lt(w, E._config?.connectionRules, E._nodeMap)) {
              q("connection", "Click-to-connect rejected (connection rules)", w), Ae(L, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            if (L && !Ge(L, w, E.edges)) {
              q("connection", "Click-to-connect rejected (handle limit)", w), Ae(L, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(L);
              return;
            }
            if (L && !Ke(L, w)) {
              q("connection", "Click-to-connect rejected (per-handle validator)", w), Ae(L, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            if (E._config?.isValidConnection && !E._config.isValidConnection(w)) {
              q("connection", "Click-to-connect rejected (custom validator)", w), Ae(L, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            const O = E._config?.connectValidator;
            if (O && L) {
              const C = E._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: T, targetEl: R } = no(L, w);
              E._connectValidating = !0;
              let X;
              try {
                X = await to(
                  O,
                  w,
                  T,
                  R,
                  L,
                  C
                );
              } finally {
                E._connectValidating = !1;
              }
              if (!X.allowed) {
                q("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: X.reason }), Ae(L, { ...w, reason: X.reason }), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(L);
                return;
              }
            }
            const W = `e-${w.source}-${w.target}-${Date.now()}-${on++}`;
            E.addEdges({ id: W, ...w }), q("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), E._emit("connect", { connection: w }), E._emit("connect-end", { connection: w, ..._ });
          } else {
            q("connection", "Click-to-connect rejected (invalid)", w);
            const L = e.closest(".flow-container");
            Ae(L, w), E._emit("connect-end", { connection: null, ..._ });
          }
          E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
          const D = e.closest(".flow-container");
          D && Pe(D);
        };
        e.addEventListener("click", S);
        let P = null;
        const $ = (b) => {
          if (b.button !== 0) return;
          const E = x(), N = m();
          if (!E || !N || E._animationLocked || E._config?.edgesReconnectable === !1 || E._pendingReconnection) return;
          const M = E.edges.filter(
            (z) => z.target === N && (z.targetHandle ?? "target") === p
          );
          if (M.length === 0) return;
          const w = M.find((z) => z.selected) ?? (M.length === 1 ? M[0] : null);
          if (!w) return;
          const _ = w.reconnectable ?? !0;
          if (_ === !1 || _ === "source") return;
          b.preventDefault(), b.stopPropagation();
          const D = b.clientX, L = b.clientY;
          let O = !1, W = !1, C = null;
          const T = E._config?.connectionSnapRadius ?? 20, R = e.closest(".flow-container");
          if (!R) return;
          const X = R.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), se = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', ne = X?.querySelector(se), ie = R.getBoundingClientRect(), le = E._viewportLive ?? E.viewport, de = le?.zoom || 1, ue = le?.x || 0, J = le?.y || 0;
          let ce, ee;
          if (ne) {
            const z = ne.getBoundingClientRect();
            ce = (z.left + z.width / 2 - ie.left - ue) / de, ee = (z.top + z.height / 2 - ie.top - J) / de;
          } else {
            const z = E.getNode(w.source);
            if (!z) return;
            const oe = z.dimensions?.width ?? ve, B = z.dimensions?.height ?? _e;
            ce = z.position.x + oe / 2, ee = z.position.y + B;
          }
          let F = null, K = null, U = null, V = D, I = L;
          const re = () => {
            O = !0;
            const z = R.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            z && z.classList.add("flow-edge-reconnecting"), E._emit("reconnect-start", { edge: w, handleType: "target" }), q("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), K = Ht({
              connectionLineType: E._config?.connectionLineType,
              connectionLineStyle: E._config?.connectionLineStyle,
              connectionLine: E._config?.connectionLine,
              containerEl: R
            }), F = K.svg;
            const oe = E.screenToFlowPosition(D, L);
            K.update({
              fromX: ce,
              fromY: ee,
              toX: oe.x,
              toY: oe.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            });
            const B = R.querySelector(".flow-viewport");
            B && B.appendChild(F), E.pendingConnection = {
              source: w.source,
              sourceHandle: w.sourceHandle,
              position: oe
            }, E._pendingReconnection = {
              edge: w,
              draggedEnd: "target",
              anchorPosition: { x: ce, y: ee },
              position: oe
            }, U = eo(R, E, V, I), ln(R, w.source, w.sourceHandle ?? "source", E, w.id);
          }, G = (z) => {
            if (V = z.clientX, I = z.clientY, !O) {
              Math.sqrt(
                (z.clientX - D) ** 2 + (z.clientY - L) ** 2
              ) >= On && re();
              return;
            }
            const oe = E.screenToFlowPosition(z.clientX, z.clientY), B = an({
              containerEl: R,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: oe,
              connectionSnapRadius: T,
              getNode: (j) => E.getNode(j),
              toFlowPosition: (j, H) => E.screenToFlowPosition(j, H)
            });
            B.element !== C && (C?.classList.remove("flow-handle-active"), B.element?.classList.add("flow-handle-active"), C = B.element), K?.update({
              fromX: ce,
              fromY: ee,
              toX: B.position.x,
              toY: B.position.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            }), E.pendingConnection && (E.pendingConnection = {
              ...E.pendingConnection,
              position: B.position
            }), E._pendingReconnection && (E._pendingReconnection = {
              ...E._pendingReconnection,
              position: B.position
            }), U?.updatePointer(z.clientX, z.clientY);
          }, Y = () => {
            if (W) return;
            W = !0, document.removeEventListener("pointermove", G), document.removeEventListener("pointerup", te), document.removeEventListener("pointercancel", te), U?.stop(), U = null, K?.destroy(), K = null, F = null, C?.classList.remove("flow-handle-active"), P = null;
            const z = R.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            z && z.classList.remove("flow-edge-reconnecting"), Pe(R), E.pendingConnection = null, E._pendingReconnection = null;
          }, te = async (z) => {
            if (!O) {
              Y();
              return;
            }
            if (E._connectValidating) return;
            let oe = C;
            oe || (oe = document.elementFromPoint(z.clientX, z.clientY)?.closest('[data-flow-handle-type="target"]'));
            let B = !1;
            if (oe) {
              const H = oe.closest("[x-flow-node]")?.dataset.flowNodeId, Q = oe.dataset.flowHandleId;
              if (H && E.getNode(H)?.connectable !== !1) {
                const ae = {
                  source: w.source,
                  sourceHandle: w.sourceHandle,
                  target: H,
                  targetHandle: Q
                }, fe = { ...w }, pe = K?.svg ?? null;
                bt(pe, !0);
                let me;
                try {
                  me = await Fr({
                    edge: w,
                    newConnection: ae,
                    canvas: E,
                    containerEl: R,
                    endpoint: "target"
                  });
                } finally {
                  bt(pe, !1);
                }
                me.applied ? (B = !0, q("reconnect", `Edge "${w.id}" reconnected (target)`, ae), E._emit("reconnect", { oldEdge: fe, newConnection: ae })) : q("reconnect", "Reconnection rejected", { connection: ae, reason: me.reason });
              }
            }
            B || q("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), E._emit("reconnect-end", { edge: w, successful: B }), Y();
          };
          document.addEventListener("pointermove", G), document.addEventListener("pointerup", te), document.addEventListener("pointercancel", te), P = Y;
        };
        e.addEventListener("pointerdown", $), l(() => {
          P?.(), k?.(), e.removeEventListener("pointerdown", $), e.removeEventListener("pointerenter", v), e.removeEventListener("pointerleave", A), e.removeEventListener("click", S), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const cs = {
  delete: ["Delete", "Backspace"],
  selectionBox: "Shift",
  multiSelect: "Shift",
  moveNodes: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  moveStep: 5,
  moveStepModifier: "Shift",
  moveStepMultiplier: 4,
  copy: "c",
  paste: "v",
  cut: "x",
  undo: "z",
  redo: "z",
  escape: "Escape",
  selectionModeToggle: "Alt",
  selectionToolToggle: "l"
};
function Cf(t) {
  if (!t) return { ...cs };
  const e = { ...cs };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Xe(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Sf(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function ft(t, e) {
  if (e == null) return !1;
  switch (e) {
    case "Shift":
      return t.shiftKey;
    case "Control":
      return t.ctrlKey;
    case "Meta":
      return t.metaKey;
    case "Alt":
      return t.altKey;
    default:
      return !1;
  }
}
function kf(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, l = 0, a = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), a = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(u) {
    const h = u.clientX - s, g = u.clientY - l;
    h * h + g * g > i * i && c();
  }
  function f(u) {
    c(), s = u.clientX, l = u.clientY, a = u, document.addEventListener("pointermove", d), document.addEventListener("pointerup", c), document.addEventListener("pointercancel", c), r = setTimeout(() => {
      const h = a;
      c(), h && e(h);
    }, o);
  }
  return t.addEventListener("pointerdown", f), () => {
    c(), t.removeEventListener("pointerdown", f);
  };
}
const ds = 20;
function Or(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Zo(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const l = s.nodeOrigin ?? n ?? [0, 0], a = s.dimensions?.width ?? ve, c = s.dimensions?.height ?? _e;
    o += s.position.x - a * l[0], i += s.position.y - c * l[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function Ot(t, e, n) {
  if (!t.parentId)
    return t;
  const o = Zo(t, e, n);
  return { ...t, position: o };
}
function oo(t, e, n) {
  return t.map((o) => Ot(o, e, n));
}
function ht(t, e) {
  const n = /* @__PURE__ */ new Set(), o = [t], i = /* @__PURE__ */ new Map();
  for (const r of e)
    if (r.parentId) {
      const s = i.get(r.parentId);
      s ? s.push(r.id) : i.set(r.parentId, [r.id]);
    }
  for (; o.length > 0; ) {
    const r = o.shift(), s = i.get(r);
    if (s)
      for (const l of s)
        n.has(l) || (n.add(l), o.push(l));
  }
  return n;
}
function pt(t) {
  const e = Or(t), n = [], o = /* @__PURE__ */ new Set();
  function i(r) {
    if (!o.has(r.id)) {
      if (r.parentId) {
        const s = e.get(r.parentId);
        s && i(s);
      }
      o.add(r.id), n.push(r);
    }
  }
  for (const r of t)
    i(r);
  return n;
}
function zr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? zr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Vr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function xo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function An(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ve, height: _e };
  return Vr(t, o, i);
}
function Lf(t, e, n) {
  const o = t.x + e.width + ds, i = t.y + e.height + ds, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function us(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-left":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: t, y: 0 };
    case "bottom-left":
      return { x: 0, y: e };
    case "bottom-right":
      return { x: t, y: e };
  }
}
function Pf(t, e, n) {
  const o = t / 2, i = e / 2, r = t / 2, s = e / 2;
  switch (n) {
    case "top":
      return { x: o, y: 0 };
    case "right":
      return { x: t, y: i };
    case "bottom":
      return { x: o, y: e };
    case "left":
      return { x: 0, y: i };
    case "top-right": {
      const l = -Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "top-left": {
      const l = -3 * Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "bottom-right": {
      const l = Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
    case "bottom-left": {
      const l = 3 * Math.PI / 4;
      return { x: o + r * Math.cos(l), y: i + s * Math.sin(l) };
    }
  }
}
function Mf(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t * 0.75, y: e * 0.25 };
    case "top-left":
      return { x: t * 0.25, y: e * 0.25 };
    case "bottom-right":
      return { x: t * 0.75, y: e * 0.75 };
    case "bottom-left":
      return { x: t * 0.25, y: e * 0.75 };
  }
}
function Tf(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t * 0.75, y: 0 };
    case "top-left":
      return { x: t * 0.25, y: 0 };
    case "bottom-right":
      return { x: t * 0.75, y: e };
    case "bottom-left":
      return { x: t * 0.25, y: e };
  }
}
function Af(t, e, n) {
  const o = t * 0.15;
  switch (n) {
    case "top":
      return { x: t * 0.575, y: 0 };
    case "right":
      return { x: t * 0.925, y: e / 2 };
    case "bottom":
      return { x: t * 0.425, y: e };
    case "left":
      return { x: t * 0.075, y: e / 2 };
    case "top-right":
      return { x: t, y: 0 };
    case "top-left":
      return { x: o, y: 0 };
    case "bottom-right":
      return { x: t - o, y: e };
    case "bottom-left":
      return { x: 0, y: e };
  }
}
function Nf(t, e, n) {
  switch (n) {
    case "top":
      return { x: t / 2, y: 0 };
    case "right":
      return { x: t * 0.75, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e };
    case "left":
      return { x: t * 0.25, y: e / 2 };
    case "top-right":
      return { x: t * 0.625, y: e * 0.25 };
    case "top-left":
      return { x: t * 0.375, y: e * 0.25 };
    case "bottom-right":
      return { x: t, y: e };
    case "bottom-left":
      return { x: 0, y: e };
  }
}
function $f(t, e, n) {
  const o = e * 0.12;
  switch (n) {
    case "top":
      return { x: t / 2, y: o };
    case "right":
      return { x: t, y: e / 2 };
    case "bottom":
      return { x: t / 2, y: e - o };
    case "left":
      return { x: 0, y: e / 2 };
    case "top-right":
      return { x: t, y: o };
    case "top-left":
      return { x: 0, y: o };
    case "bottom-right":
      return { x: t, y: e - o };
    case "bottom-left":
      return { x: 0, y: e - o };
  }
}
function If(t, e, n) {
  const o = Math.min(t, e) / 2, i = t / 2, r = e / 2;
  switch (n) {
    case "top":
      return { x: i, y: 0 };
    case "right":
      return { x: t, y: r };
    case "bottom":
      return { x: i, y: e };
    case "left":
      return { x: 0, y: r };
    case "top-right": {
      const s = t - o, l = -Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "top-left": {
      const s = o, l = -3 * Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "bottom-right": {
      const s = t - o, l = Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
    case "bottom-left": {
      const s = o, l = 3 * Math.PI / 4;
      return { x: s + o * Math.cos(l), y: r + o * Math.sin(l) };
    }
  }
}
const Br = {
  circle: { perimeterPoint: Pf },
  diamond: { perimeterPoint: Mf },
  hexagon: { perimeterPoint: Tf },
  parallelogram: { perimeterPoint: Af },
  triangle: { perimeterPoint: Nf },
  cylinder: { perimeterPoint: $f },
  stadium: { perimeterPoint: If }
};
function qr(t, e = "light") {
  let n = e === "dark" ? "dark" : "light", o = null, i = null;
  function r(l) {
    n = l ? "dark" : "light", t.classList.toggle("dark", l);
  }
  function s(l) {
    o && i && (o.removeEventListener("change", i), o = null, i = null), l === "system" ? (o = window.matchMedia("(prefers-color-scheme: dark)"), r(o.matches), i = (a) => r(a.matches), o.addEventListener("change", i)) : r(l === "dark");
  }
  return s(e), {
    get resolved() {
      return n;
    },
    update: s,
    destroy() {
      o && i && o.removeEventListener("change", i), t.classList.remove("dark");
    }
  };
}
const Eo = "__alpineflow_collab_store__";
function Df() {
  return typeof globalThis < "u" ? (globalThis[Eo] || (globalThis[Eo] = /* @__PURE__ */ new WeakMap()), globalThis[Eo]) : /* @__PURE__ */ new WeakMap();
}
const Re = Df(), Co = "__alpineflow_registry__";
function Xr() {
  return typeof globalThis < "u" ? (globalThis[Co] || (globalThis[Co] = /* @__PURE__ */ new Map()), globalThis[Co]) : /* @__PURE__ */ new Map();
}
function At(t) {
  return Xr().get(t);
}
function Rf(t, e) {
  switch (t) {
    case "nodes-change": {
      const n = e.nodes ?? [], o = n.length === 1 ? n[0].data?.label || n[0].id : null;
      return e.type === "add" ? o ? `Added node: ${o}` : `Added ${n.length} nodes` : e.type === "remove" ? o ? `Removed node: ${o}` : `Removed ${n.length} nodes` : null;
    }
    case "edges-change": {
      const n = e.edges ?? [];
      return e.type === "add" ? n.length === 1 ? `Connected ${n[0].source} to ${n[0].target}` : `Added ${n.length} connections` : e.type === "remove" ? n.length === 1 && n[0].source && n[0].target ? `Removed connection from ${n[0].source} to ${n[0].target}` : `Removed ${n.length} connections` : null;
    }
    case "selection-change": {
      const n = e.nodes?.length ?? 0, o = e.edges?.length ?? 0;
      if (n === 0 && o === 0)
        return "Selection cleared";
      const i = [];
      return n > 0 && i.push(`${n} node${n === 1 ? "" : "s"}`), o > 0 && i.push(`${o} edge${o === 1 ? "" : "s"}`), `${i.join(" and ")} selected`;
    }
    case "viewport-move-end": {
      const n = e.viewport?.zoom ?? 1;
      return `Viewport: zoom ${Math.round(n * 100)}%`;
    }
    case "fit-view":
      return "Fitted view to content";
    case "node-reparent": {
      const n = e.node?.data?.label || e.node?.id || "node";
      return e.newParentId ? `Moved ${n} into ${e.newParentId}` : `Detached ${n} from ${e.oldParentId}`;
    }
    default:
      return null;
  }
}
const Ff = 1e3;
class Hf {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Rf, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Ff);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Of {
  constructor() {
    this._registry = /* @__PURE__ */ new Map();
  }
  registerCompute(e, n) {
    this._registry.set(e, n);
  }
  hasCompute(e) {
    return this._registry.has(e);
  }
  /**
   * Kahn's algorithm topological sort. Skips back-edges in cycles
   * by appending remaining nodes at the end.
   */
  topologicalSort(e, n) {
    const o = new Map(e.map((a) => [a.id, a])), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const a of e)
      i.set(a.id, 0), r.set(a.id, []);
    for (const a of n)
      !o.has(a.source) || !o.has(a.target) || (i.set(a.target, (i.get(a.target) ?? 0) + 1), r.get(a.source).push(a.target));
    const s = [];
    for (const [a, c] of i)
      c === 0 && s.push(a);
    const l = [];
    for (; s.length > 0; ) {
      const a = s.shift();
      l.push(o.get(a));
      for (const c of r.get(a) ?? []) {
        const d = (i.get(c) ?? 0) - 1;
        i.set(c, d), d === 0 && s.push(c);
      }
    }
    if (l.length < e.length) {
      const a = new Set(l.map((c) => c.id));
      for (const c of e)
        a.has(c.id) || l.push(c);
    }
    return l;
  }
  /**
   * Run compute propagation.
   *
   * @param nodes All nodes in the graph
   * @param edges All edges in the graph
   * @param startNodeId If provided, only compute this node and its downstream descendants
   * @returns Map of nodeId → output data for nodes that had a registered compute function
   */
  compute(e, n, o) {
    const i = this.topologicalSort(e, n), r = /* @__PURE__ */ new Map();
    if (o)
      for (const a of e)
        a.data.$outputs && r.set(a.id, a.data.$outputs);
    let s = null;
    o && (s = this._getDownstream(o, n), s.add(o));
    const l = /* @__PURE__ */ new Map();
    for (const a of i) {
      if (s && !s.has(a.id)) continue;
      const c = this._registry.get(a.type ?? "default");
      if (!c) continue;
      const d = {}, f = n.filter((h) => h.target === a.id);
      for (const h of f) {
        const g = r.get(h.source);
        if (!g) continue;
        const p = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        p in g && (d[y] = g[p]);
      }
      const u = c.compute(d, a.data);
      r.set(a.id, u), l.set(a.id, u), a.data.$inputs = d, a.data.$outputs = u;
    }
    return l;
  }
  /** Get all downstream node IDs reachable from a start node. */
  _getDownstream(e, n) {
    const o = /* @__PURE__ */ new Map();
    for (const s of n) {
      let l = o.get(s.source);
      l || (l = [], o.set(s.source, l)), l.push(s.target);
    }
    const i = /* @__PURE__ */ new Set(), r = [e];
    for (; r.length > 0; ) {
      const s = r.pop();
      if (!i.has(s)) {
        i.add(s);
        for (const l of o.get(s) ?? [])
          i.has(l) || r.push(l);
      }
    }
    return i.delete(e), i;
  }
}
const zf = {
  connect: (t) => [t.connection?.source ?? t.source, t.connection?.target ?? t.target, t.connection?.sourceHandle ?? t.sourceHandle, t.connection?.targetHandle ?? t.targetHandle],
  "connect-start": (t) => [t.source, t.sourceHandle],
  "connect-end": (t) => [t.connection, t.source, t.sourceHandle, t.position],
  "node-click": (t) => [t.node.id, t.node],
  "node-drag-start": (t) => [t.node.id],
  "node-drag-end": (t) => [t.node.id, t.position],
  "node-resize-start": (t) => [t.node.id, t.dimensions],
  "node-resize-end": (t) => [t.node.id, t.dimensions],
  "node-collapse": (t) => [t.node.id, t.descendants],
  "node-expand": (t) => [t.node.id, t.descendants],
  "node-reparent": (t) => [t.node.id, t.oldParentId, t.newParentId],
  "node-context-menu": (t) => [t.node.id, { x: t.event.clientX, y: t.event.clientY }],
  "nodes-change": (t) => [t],
  "edge-click": (t) => [t.edge.id],
  "edge-context-menu": (t) => [t.edge.id, { x: t.event.clientX, y: t.event.clientY }],
  "edges-change": (t) => [t],
  "reconnect-start": (t) => [t.edge.id, t.handleType],
  reconnect: (t) => [t.oldEdge.id, t.newConnection],
  "reconnect-end": (t) => [t.edge.id, t.successful],
  "pane-click": (t) => [t.position],
  "pane-context-menu": (t) => [t.position],
  "viewport-change": (t) => [t.viewport],
  "selection-change": (t) => [t.nodes, t.edges],
  "selection-context-menu": (t) => [t.nodes, t.edges, { x: t.event.clientX, y: t.event.clientY }],
  drop: (t) => [t.data, t.position],
  init: () => [],
  "row-select": (t) => [t.rowId, t.nodeId, t.attrId],
  "row-deselect": (t) => [t.rowId, t.nodeId, t.attrId],
  "row-selection-change": (t) => [t.selectedRows]
}, Vf = {
  "flow:addNodes": "addNodes",
  "flow:removeNodes": "removeNodes",
  "flow:addEdges": "addEdges",
  "flow:removeEdges": "removeEdges",
  "flow:update": "update",
  "flow:animate": "animate",
  // Particle emission — all five firing methods
  "flow:sendParticle": "sendParticle",
  "flow:sendParticleAlongPath": "sendParticleAlongPath",
  "flow:sendParticleBetween": "sendParticleBetween",
  "flow:sendParticleBurst": "sendParticleBurst",
  "flow:sendConverging": "sendConverging",
  // Tag-filtered bulk animation control (v0.2.0-alpha)
  "flow:cancelAll": "cancelAll",
  "flow:pauseAll": "pauseAll",
  "flow:resumeAll": "resumeAll",
  // Viewport
  "flow:fitView": "fitView",
  "flow:zoomIn": "zoomIn",
  "flow:zoomOut": "zoomOut",
  "flow:setCenter": "setCenter",
  "flow:setViewport": "setViewport",
  "flow:follow": "follow",
  "flow:unfollow": "unfollow",
  "flow:undo": "undo",
  "flow:redo": "redo",
  "flow:layout": "layout",
  "flow:fromObject": "fromObject",
  "flow:setLoading": "setLoading",
  "flow:clear": "$clear",
  "flow:toggleInteractive": "toggleInteractive",
  "flow:panBy": "panBy",
  "flow:fitBounds": "fitBounds",
  "flow:patchConfig": "patchConfig",
  "flow:deselectAll": "deselectAll",
  "flow:collapseNode": "collapseNode",
  "flow:expandNode": "expandNode",
  "flow:toggleNode": "toggleNode",
  // RunState (D2)
  "flow:setNodeState": "setNodeState",
  "flow:resetStates": "resetStates"
}, Bf = {
  "flow:addNodes": (t) => [t.nodes],
  "flow:removeNodes": (t) => [t.ids],
  "flow:addEdges": (t) => [t.edges],
  "flow:removeEdges": (t) => [t.ids],
  "flow:update": (t) => [t.targets, t.options ?? {}],
  "flow:animate": (t) => [t.targets, t.options ?? {}],
  // Particle emission — all five firing methods
  "flow:sendParticle": (t) => [t.edgeId, t.options ?? {}],
  "flow:sendParticleAlongPath": (t) => [t.path, t.options ?? {}],
  "flow:sendParticleBetween": (t) => [t.source, t.target, t.options ?? {}],
  "flow:sendParticleBurst": (t) => [t.edgeId, t.options ?? {}],
  "flow:sendConverging": (t) => [t.sources, t.options ?? {}],
  // Tag-filtered bulk animation control
  "flow:cancelAll": (t) => [t.filter ?? {}, t.options ?? {}],
  "flow:pauseAll": (t) => [t.filter ?? {}],
  "flow:resumeAll": (t) => [t.filter ?? {}],
  // Viewport
  "flow:fitView": () => [],
  "flow:zoomIn": () => [],
  "flow:zoomOut": () => [],
  "flow:setCenter": (t) => [t.x, t.y, t.zoom],
  "flow:setViewport": (t) => [t.viewport],
  "flow:follow": (t) => [t.nodeId, t.options ?? {}],
  "flow:unfollow": () => [],
  "flow:undo": () => [],
  "flow:redo": () => [],
  "flow:layout": (t) => [t.options ?? {}],
  "flow:fromObject": (t) => [t.data],
  "flow:setLoading": (t) => [t.loading],
  "flow:clear": () => [],
  "flow:toggleInteractive": () => [],
  "flow:panBy": (t) => [t.dx, t.dy],
  "flow:fitBounds": (t) => [t.rect, t.options],
  "flow:patchConfig": (t) => [t.changes],
  "flow:deselectAll": () => [],
  "flow:collapseNode": (t) => [t.id],
  "flow:expandNode": (t) => [t.id],
  "flow:toggleNode": (t) => [t.id],
  // RunState (D2)
  "flow:setNodeState": (t) => [t.ids, t.state],
  "flow:resetStates": () => []
}, fs = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function qf(t, e) {
  const n = [];
  return n.push(e.on("flow:moveNode", (o) => {
    const i = o.duration ?? 0;
    t.update(
      { nodes: { [o.id]: { position: { x: o.x, y: o.y } } } },
      { duration: i }
    );
  })), n.push(e.on("flow:updateNode", (o) => {
    const i = o.duration ?? 0;
    t.update(
      { nodes: { [o.id]: o.changes } },
      { duration: i }
    );
  })), n.push(e.on("flow:focusNode", (o) => {
    const i = t.getNode(o.id);
    if (!i) return;
    const r = i.dimensions?.width ?? 150, s = i.dimensions?.height ?? 40, l = i.parentId ? t.getAbsolutePosition(o.id) : i.position;
    t.fitBounds(
      { x: l.x, y: l.y, width: r, height: s },
      { padding: o.padding ?? 0.5, duration: o.duration ?? 300 }
    );
  })), n.push(e.on("flow:connect", (o) => {
    const r = { id: o.edgeId ?? `e-${o.source}-${o.target}`, source: o.source, target: o.target, ...o.options ?? {} };
    o.duration && o.duration > 0 ? t.timeline().step({ addEdges: [r], edgeTransition: "draw", duration: o.duration }).play() : t.addEdges(r);
  })), n.push(e.on("flow:disconnect", (o) => {
    const i = t.edges.filter((r) => r.source === o.source && r.target === o.target).map((r) => r.id);
    i.length !== 0 && (o.duration && o.duration > 0 ? t.timeline().step({ removeEdges: i, edgeTransition: "fade", duration: o.duration }).play() : t.removeEdges(i));
  })), n.push(e.on("flow:highlightNode", (o) => {
    const i = t.getNode(o.id);
    if (!i) return;
    const r = fs[o.style] ?? fs.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
    t.update({
      nodes: { [o.id]: { style: `border-color: ${r.borderColor}; box-shadow: ${r.shadow}` } }
    }, { duration: 100 }), setTimeout(() => {
      const f = c ? `border-color: ${c}; box-shadow: ${d ?? "none"}` : "";
      t.update({
        nodes: { [o.id]: { style: f } }
      }, { duration: a });
    }, 100 + l);
  })), n.push(e.on("flow:highlightPath", (o) => {
    const i = o.nodeIds, r = o.options ?? {}, { delay: s, ...l } = r, a = s ?? 200, c = {
      color: "#3b82f6",
      size: 5,
      duration: "800ms",
      ...l
    };
    for (let d = 0; d < i.length - 1; d++) {
      const f = i[d], u = i[d + 1], h = t.edges.find((g) => g.source === f && g.target === u);
      h && setTimeout(() => {
        t.sendParticle(h.id, c);
      }, d * a);
    }
  })), n.push(e.on("flow:lockNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.locked = !0);
  })), n.push(e.on("flow:unlockNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.locked = !1);
  })), n.push(e.on("flow:hideNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.hidden = !0);
  })), n.push(e.on("flow:showNode", (o) => {
    const i = t.getNode(o.id);
    i && (i.hidden = !1);
  })), n.push(e.on("flow:selectNodes", (o) => {
    t.deselectAll();
    for (const i of o.ids) {
      t.selectedNodes.add(i);
      const r = t.getNode(i);
      r && (r.selected = !0);
    }
  })), n.push(e.on("flow:run", (o) => {
    if (typeof t.run != "function") {
      console.warn("[wire-bridge] flow:run: canvas.run not available — is the workflow addon registered?");
      return;
    }
    const i = t._workflowHandlers ?? {};
    t.run(o.startId, i, o.options ?? {});
  })), n.push(e.on("flow:selectEdges", (o) => {
    t.deselectAll();
    for (const i of o.ids) {
      t.selectedEdges.add(i);
      const r = t.getEdge(i);
      r && (r.selected = !0);
    }
  })), () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
function Xf(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const Yf = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Wf = 150;
function jf(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function Uf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = Xf(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = zf[o], f = d ? d(a) : [a], u = e[i];
      return typeof u == "function" && u.call(e, ...f), c;
    };
    t[r] = Yf.has(o) ? jf(l, Wf) : l;
  }
}
function Zf(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(Vf)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = Bf[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Kf = 5;
function Gf(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const f = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, f), f > Kf && !o.has(c) && (o.add(c), console.warn(
          `[alpineflow] Auto-layout for parent "${c}" has run for ${f} consecutive frames. Suppressing to avoid an infinite loop. This usually indicates a layout that keeps changing child dimensions by more than the 1px threshold. Next user mutation will clear the suppression.`
        ));
      }
      for (const c of n.keys())
        e.has(c) || n.set(c, 0);
      r = new Set(e), e.clear();
    }));
  }
  return {
    safeLayoutChildren(c) {
      if (!o.has(c)) {
        if (s > 0) {
          l.add(c);
          return;
        }
        e.has(c) || (e.add(c), a(), t(c));
      }
    },
    resetLoopCounter(c) {
      n.delete(c), o.delete(c);
    },
    dispose() {
      i !== null && (cancelAnimationFrame(i), i = null);
    },
    suspend() {
      s++;
    },
    resume() {
      if (s !== 0 && (s--, s === 0)) {
        for (const c of l)
          o.has(c) || e.has(c) || (e.add(c), a(), t(c));
        l.clear();
      }
    }
  };
}
function Jf(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Qf(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function cn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function Yr(t, e, n, o) {
  if (!o) return { valid: !0 };
  if (o.maxChildren !== void 0 && n.length >= o.maxChildren)
    return {
      valid: !1,
      rule: "maxChildren",
      message: `Maximum ${o.maxChildren} child node(s) allowed`
    };
  if (o.allowedChildTypes) {
    const i = e.type ?? "default";
    if (!o.allowedChildTypes.includes(i))
      return {
        valid: !1,
        rule: "allowedChildTypes",
        message: `Node type "${i}" is not allowed in this group`
      };
  }
  if (o.childTypeConstraints) {
    const i = e.type ?? "default", r = o.childTypeConstraints[i];
    if (r?.max !== void 0 && n.filter(
      (l) => (l.type ?? "default") === i
    ).length >= r.max)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Maximum ${r.max} "${i}" node(s) allowed`
      };
  }
  if (o.validateChild) {
    const i = o.validateChild(e, n);
    if (i !== !0)
      return {
        valid: !1,
        rule: "validateChild",
        message: typeof i == "string" ? i : "Custom validation rejected"
      };
  }
  return { valid: !0 };
}
function io(t, e, n, o) {
  if (!o) return { valid: !0 };
  if (o.preventChildEscape)
    return {
      valid: !1,
      rule: "preventChildEscape",
      message: "Children cannot be moved out of this group"
    };
  const i = n.length - 1, r = Math.max(
    o.minChildren ?? 0,
    o.requiredChildren ? 1 : 0
  );
  if (r > 0 && i < r)
    return {
      valid: !1,
      rule: "minChildren",
      message: `Requires at least ${r} child node(s)`
    };
  if (o.childTypeConstraints) {
    const s = e.type ?? "default", l = o.childTypeConstraints[s];
    if (l?.min !== void 0 && n.filter(
      (c) => (c.type ?? "default") === s
    ).length - 1 < l.min)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Requires at least ${l.min} "${s}" node(s)`
      };
  }
  return { valid: !0 };
}
function hs(t, e, n) {
  if (!n) return [];
  const o = [], i = Math.max(
    n.minChildren ?? 0,
    n.requiredChildren ? 1 : 0
  );
  if (i > 0 && e.length < i && o.push(`Requires at least ${i} child node(s)`), n.maxChildren !== void 0 && e.length > n.maxChildren && o.push(`Maximum ${n.maxChildren} child node(s) allowed`), n.childTypeConstraints)
    for (const [r, s] of Object.entries(n.childTypeConstraints)) {
      const l = e.filter(
        (a) => (a.type ?? "default") === r
      ).length;
      s.min !== void 0 && l < s.min && o.push(`Requires at least ${s.min} "${r}" node(s)`), s.max !== void 0 && l > s.max && o.push(`Maximum ${s.max} "${r}" node(s) allowed`);
    }
  return o;
}
function Yt(t, e) {
  const n = jt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Wr(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function eh(t, e, n = !0) {
  const o = Yt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Yt(i);
    return n ? Wr(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function th(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Yt(t), i = Yt(e);
  return n ? Wr(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function nh(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const l of o) {
    const a = r + e, c = s + n, d = l.x + l.width, f = l.y + l.height;
    if (r < d + i && a > l.x - i && s < f + i && c > l.y - i) {
      const u = a - (l.x - i), h = d + i - r, g = c - (l.y - i), p = f + i - s, y = Math.min(u, h, g, p);
      y === u ? r -= u : y === h ? r += h : y === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function oh(t) {
  return {
    /**
     * Add one or more nodes to the canvas.
     *
     * - Normalizes single node or array input.
     * - When `options.center` is set, stashes intended positions off-screen
     *   so the directive can measure dimensions without a visible flash,
     *   then repositions after measurement via double-rAF.
     * - Validates child constraints before accepting each node.
     * - Captures history, sorts topologically, rebuilds node map.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Runs child layout for any layout parents that received new children.
     * - Schedules auto-layout after the mutation.
     */
    addNodes(e, n) {
      t._captureHistory();
      let o = Array.isArray(e) ? e : [e];
      q("init", `Adding ${o.length} node(s)`, o.map((c) => c.id));
      const i = /* @__PURE__ */ new Map();
      if (n?.center) {
        for (const c of o)
          i.set(c.id, { ...c.position });
        o = o.map((c) => ({ ...c, position: { x: -9999, y: -9999 } }));
      }
      const r = [];
      for (const c of o) {
        if (c.parentId) {
          const d = t._getChildValidation(c.parentId);
          if (d) {
            const f = t._nodeMap.get(c.parentId);
            if (f) {
              const u = [
                ...t.nodes.filter(
                  (g) => g.parentId === c.parentId
                ),
                ...r.filter(
                  (g) => g.parentId === c.parentId
                )
              ], h = Yr(f, c, u, d);
              if (!h.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
                  child: c,
                  operation: "add",
                  rule: h.rule,
                  message: h.message
                });
                continue;
              }
            }
          }
        }
        r.push(c);
      }
      o = r, t.nodes.push(...o);
      for (const c of o)
        c.dimensions && t._initialDimensions.set(c.id, { ...c.dimensions });
      t.nodes = pt(t.nodes), t._rebuildNodeMap();
      for (const c of o)
        if (c.childLayout) {
          const d = t._nodeMap.get(c.id);
          d && t._installChildLayoutWatchers(d);
        }
      t._emit("nodes-change", { type: "add", nodes: o });
      const s = t._container ? Re.get(t._container) : void 0;
      if (s?.bridge)
        for (const c of o)
          s.bridge.pushLocalNodeAdd(c);
      n?.center && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [c, d] of i) {
            const f = t.nodes.find((g) => g.id === c);
            if (!f) continue;
            const u = f.dimensions?.width ?? 0, h = f.dimensions?.height ?? 0;
            f.position.x = d.x - u / 2, f.position.y = d.y - h / 2;
          }
        });
      }), t._recomputeChildValidation();
      const l = /* @__PURE__ */ new Set();
      for (const c of o)
        if (c.parentId && t._nodeMap.get(c.parentId)?.childLayout) {
          if (c.order == null) {
            const f = t.nodes.filter(
              (u) => u.parentId === c.parentId && u.id !== c.id
            );
            c.order = f.length > 0 ? Math.max(...f.map((u) => u.order ?? 0)) + 1 : 0;
          }
          l.add(c.parentId);
        }
      const a = /* @__PURE__ */ new Set();
      for (const c of l) {
        let d = c, f = t._nodeMap.get(c)?.parentId;
        for (; f; ) {
          const u = t._nodeMap.get(f);
          u?.childLayout && (d = f), f = u?.parentId;
        }
        a.add(d);
      }
      for (const c of a)
        t._layoutDedup ? t._layoutDedup.safeLayoutChildren(c) : t.layoutChildren?.(c);
      t._scheduleAutoLayout();
    },
    /**
     * Remove one or more nodes by ID.
     *
     * - Normalizes single ID or array input.
     * - Validates child constraints before allowing removal.
     * - Cascades removal to all descendants.
     * - Removes connected edges and optionally creates reconnection bridges.
     * - Cleans up selection state and initial dimensions.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Re-layouts any layout parents that lost children.
     * - Schedules auto-layout after the mutation.
     */
    removeNodes(e) {
      t._captureHistory();
      const n = new Set(Array.isArray(e) ? e : [e]), o = /* @__PURE__ */ new Set();
      for (const f of [...n]) {
        const u = t._nodeMap.get(f);
        if (!u?.parentId || n.has(u.parentId)) continue;
        const h = t._getChildValidation(u.parentId);
        if (!h) continue;
        const g = t._nodeMap.get(u.parentId);
        if (!g) continue;
        const p = t.nodes.filter(
          (m) => m.parentId === u.parentId
        ), y = io(g, u, p, h);
        y.valid || (o.add(f), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
          child: u,
          operation: "remove",
          rule: y.rule,
          message: y.message
        }));
      }
      for (const f of o)
        n.delete(f);
      if (n.size === 0) return;
      const i = /* @__PURE__ */ new Map();
      for (const f of n) {
        const u = t._nodeMap.get(f);
        u?.parentId && i.set(f, u.parentId);
      }
      for (const f of [...n])
        for (const u of ht(f, t.nodes))
          n.add(u);
      q("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((f) => n.has(f.id));
      let s = [];
      t._config.reconnectOnDelete && (s = pf(n, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((f) => n.has(f.source) || n.has(f.target) ? (l.push(f.id), !1) : !0), s.length && (t.edges.push(...s), q("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((f) => !n.has(f.id)), t._rebuildNodeMap();
      for (const f of n)
        t.selectedNodes.delete(f), t._initialDimensions.delete(f), t._uninstallChildLayoutWatchers(f);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const a = t._container ? Re.get(t._container) : void 0;
      if (a?.bridge) {
        for (const f of n)
          a.bridge.pushLocalNodeRemove(f);
        for (const f of l)
          a.bridge.pushLocalEdgeRemove(f);
        for (const f of s)
          a.bridge.pushLocalEdgeAdd(f);
      }
      t._recomputeChildValidation();
      const c = /* @__PURE__ */ new Set();
      for (const f of n) {
        const u = i.get(f);
        u && t._nodeMap.get(u)?.childLayout && c.add(u);
      }
      const d = /* @__PURE__ */ new Set();
      for (const f of c) {
        let u = f, h = t._nodeMap.get(f)?.parentId;
        for (; h; ) {
          const g = t._nodeMap.get(h);
          g?.childLayout && (u = h), h = g?.parentId;
        }
        d.add(u);
      }
      for (const f of d) t.layoutChildren?.(f);
      t._scheduleAutoLayout();
    },
    /**
     * Look up a node by ID.
     */
    getNode(e) {
      return t._nodeMap.get(e);
    },
    /**
     * Get all nodes connected via outgoing edges from the given node.
     */
    getOutgoers(e) {
      return jo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return uf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return df(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return hf(e, n, t.edges, o);
    },
    /**
     * Apply a node-level filter predicate.
     * Nodes that fail the predicate get `filtered = true`.
     */
    setNodeFilter(e) {
      const n = [], o = [];
      for (const i of t.nodes) {
        const r = !e(i);
        i.filtered = r, r ? n.push(i) : o.push(i);
      }
      q("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (q("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? eh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : th(i, r, o);
    },
    /**
     * Set runState on one or more nodes by ID.
     * The x-flow-node directive reactively applies .flow-node-{state} CSS classes.
     */
    setNodeState(e, n) {
      const o = Array.isArray(e) ? e : [e];
      for (const i of o) {
        const r = t._nodeMap.get(i);
        r && (r.runState = n);
      }
    },
    /**
     * Clear all runState values, removing state CSS classes from all nodes.
     */
    resetStates() {
      for (const e of t.nodes)
        delete e.runState;
    }
  };
}
function ih(t) {
  return {
    /**
     * Add one or more edges to the canvas.
     *
     * - Normalizes single edge or array input.
     * - Merges `defaultEdgeOptions` from config (edge-specific props override defaults).
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    addEdges(e) {
      const n = t._config.defaultEdgeOptions, o = t._config.connectionRules, i = (Array.isArray(e) ? e : [e]).map((s) => n ? { ...n, ...s } : s).filter((s) => {
        if (!o) return !0;
        const l = { source: s.source, sourceHandle: s.sourceHandle, target: s.target, targetHandle: s.targetHandle };
        return lt(l, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), q("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
      const r = t._container ? Re.get(t._container) : void 0;
      if (r?.bridge)
        for (const s of i)
          r.bridge.pushLocalEdgeAdd(s);
      t._scheduleAutoLayout();
    },
    /**
     * Remove one or more edges by ID.
     *
     * - Normalizes single ID or array input.
     * - Filters edges, rebuilds edge map, deselects removed edges.
     * - Captures history before mutation.
     * - Pushes collab updates when a collaboration bridge is active.
     * - Schedules auto-layout after the mutation.
     */
    removeEdges(e) {
      t._captureHistory();
      const n = new Set(Array.isArray(e) ? e : [e]);
      q("edge", `Removing ${n.size} edge(s)`, [...n]);
      const o = t.edges.filter((r) => n.has(r.id));
      t.edges = t.edges.filter((r) => !n.has(r.id)), t._rebuildEdgeMap();
      for (const r of n)
        t.selectedEdges.delete(r);
      o.length && t._emit("edges-change", { type: "remove", edges: o });
      const i = t._container ? Re.get(t._container) : void 0;
      if (i?.bridge)
        for (const r of n)
          i.bridge.pushLocalEdgeRemove(r);
      t._scheduleAutoLayout();
    },
    /**
     * Look up an edge by ID.
     */
    getEdge(e) {
      return t._edgeMap.get(e);
    },
    /**
     * Get the visible SVG `<path>` element for an edge.
     * The visible path is the second `<path>` child (the first is the interaction hit area).
     */
    getEdgePathElement(e) {
      return t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(e)}"]`)?.querySelector("path:nth-child(2)");
    },
    /**
     * Get the container element (SVG group) for an edge.
     */
    getEdgeElement(e) {
      return t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(e)}"]`);
    },
    /**
     * Get the SVG element that hosts edge paths.
     * Returns the first `.flow-edge-svg` element inside the viewport if any edges
     * exist. When the canvas has zero edges (e.g., a particle-only canvas using
     * sendParticleAlongPath or sendParticleBetween), lazily creates and caches a
     * dedicated `.flow-particle-svg` element inside the edges container so
     * particle emission methods have a place to inject temporary paths.
     */
    getEdgeSvgElement() {
      if (!t._viewportEl) return null;
      const e = t._viewportEl.querySelector(".flow-edge-svg");
      if (e) return e;
      const n = t._viewportEl.querySelector(".flow-edges");
      if (!n) return null;
      let o = n.querySelector(".flow-particle-svg");
      return o || (o = document.createElementNS("http://www.w3.org/2000/svg", "svg"), o.setAttribute("class", "flow-particle-svg"), o.style.position = "absolute", o.style.top = "0", o.style.left = "0", o.style.width = "1px", o.style.height = "1px", o.style.overflow = "visible", o.style.pointerEvents = "none", n.appendChild(o)), o;
    }
  };
}
function sh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return br(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Au(e, n, t._viewportLive ?? t.viewport, o);
    },
    // ── Fit & Bounds ──────────────────────────────────────────────────────
    /**
     * Fit all visible nodes into the viewport.
     *
     * Defers via `requestAnimationFrame` if any node lacks measured
     * dimensions (up to 10 retries) to give the DOM time to render.
     */
    fitView(e, n = 0) {
      if (t.nodes.some((r) => !r.dimensions)) {
        n < 10 && requestAnimationFrame(() => this.fitView(e, n + 1));
        return;
      }
      const o = t.nodes.filter((r) => !r.hidden), i = qt(oo(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
      this.fitBounds(i, e), t._announcer?.handleEvent("fit-view", {});
    },
    /**
     * Fit a specific rectangle into the viewport.
     *
     * If `duration` is specified, the transition is animated via
     * `ctx.animate()` (cross-mixin dependency). Otherwise the viewport
     * is set directly via `ctx._panZoom`.
     */
    fitBounds(e, n) {
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = Zn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Yo
      );
      q("viewport", "fitBounds", { rect: e, viewport: i });
      const r = n?.duration ?? 0;
      r > 0 ? t.animate?.(
        { viewport: { pan: { x: i.x, y: i.y }, zoom: i.zoom } },
        { duration: r }
      ) : t._panZoom?.setViewport(i);
    },
    /**
     * Get the bounding rectangle of the specified nodes (or all visible
     * nodes if no IDs are provided).
     */
    getNodesBounds(e) {
      let n;
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), qt(oo(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? Zn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Yo
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      q("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Ui, o);
      q("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Ui, o);
      q("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, l = r.clientWidth / 2 - e * s, a = r.clientHeight / 2 - n * s;
      q("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: l, y: a, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      q("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, q("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
        pannable: t.isInteractive,
        zoomable: t.isInteractive
      });
    },
    // ── Color Mode ────────────────────────────────────────────────────────
    /**
     * The current resolved color mode ('light' | 'dark' | undefined).
     */
    get colorMode() {
      return t._colorModeHandle?.resolved;
    },
    // ── Container Dimensions ──────────────────────────────────────────────
    /**
     * Get the current width and height of the container element.
     */
    getContainerDimensions() {
      return {
        width: t._container?.clientWidth ?? 0,
        height: t._container?.clientHeight ?? 0
      };
    },
    // ── Panel Operations ──────────────────────────────────────────────────
    /**
     * Reset all panels by dispatching a `flow-panel-reset` CustomEvent
     * on the container and emitting a `panel-reset` event.
     */
    resetPanels() {
      q("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let _t = null;
const rh = 20;
function Ko(t) {
  return JSON.parse(JSON.stringify(t));
}
function ps(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function jr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return _t = {
    nodes: Ko(n),
    edges: Ko(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function ah() {
  if (!_t || _t.nodes.length === 0) return null;
  _t.pasteCount++;
  const t = _t.pasteCount * rh, e = /* @__PURE__ */ new Map(), n = _t.nodes.map((i) => {
    const r = ps(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Ko(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = _t.edges.map((i) => ({
    ...i,
    id: ps(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function lh(t, e) {
  const n = jr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function ch(t) {
  return {
    // ── Deselect ─────────────────────────────────────────────────────────
    /**
     * Clear all node, edge, and row selections.
     *
     * - Sets `selected = false` on each selected node/edge data object.
     * - Clears `selectedNodes`, `selectedEdges`, and `selectedRows` Sets.
     * - Removes `.flow-node-selected`, `.flow-edge-selected`, and
     *   `.flow-row-selected` CSS classes from the DOM.
     * - Emits a `selection-change` event.
     */
    deselectAll() {
      if (!(t.selectedNodes.size === 0 && t.selectedEdges.size === 0 && t.selectedRows.size === 0)) {
        q("selection", "Deselecting all");
        for (const e of t.selectedNodes) {
          const n = t.getNode(e);
          n && (n.selected = !1);
        }
        for (const e of t.selectedEdges) {
          const n = t.getEdge(e);
          n && (n.selected = !1);
        }
        t.selectedNodes.clear(), t.selectedEdges.clear(), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-node-selected, .flow-edge-selected, .flow-row-selected").forEach((e) => {
          e.classList.remove("flow-node-selected", "flow-edge-selected", "flow-row-selected");
        }), t._emitSelectionChange();
      }
    },
    // ── Deletion ─────────────────────────────────────────────────────────
    /**
     * Delete currently selected nodes and edges.
     *
     * - Filters out non-deletable nodes/edges (where `deletable === false`).
     * - Cascades edge deletion for edges connected to deleted nodes.
     * - Validates child removal constraints before deleting child nodes.
     * - Supports an async `onBeforeDelete` callback that can cancel or
     *   modify the set of items to delete.
     * - Wraps the entire operation in a single history step.
     */
    async _deleteSelected() {
      const e = [...t.selectedNodes].filter((a) => {
        const c = t.getNode(a);
        return c ? wf(c) : !1;
      }), n = [...t.selectedEdges].filter((a) => t.getEdge(a)?.deletable !== !1);
      let o = e.map((a) => t.getNode(a)).filter(Boolean);
      const i = new Set(e), r = t.edges.filter(
        (a) => i.has(a.source) || i.has(a.target)
      ), s = /* @__PURE__ */ new Map();
      for (const a of r) s.set(a.id, a);
      for (const a of n) {
        const c = t.getEdge(a);
        c && s.set(c.id, c);
      }
      const l = [...s.values()];
      if (o = o.filter((a) => {
        if (!a.parentId || o.some((h) => h.id === a.parentId)) return !0;
        const c = t._getChildValidation(a.parentId);
        if (!c) return !0;
        const d = t.getNode(a.parentId);
        if (!d) return !0;
        const f = t.nodes.filter(
          (h) => h.parentId === a.parentId
        ), u = io(d, a, f, c);
        return !u.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: d,
          child: a,
          operation: "remove",
          rule: u.rule,
          message: u.message
        }), u.valid;
      }), !(o.length === 0 && l.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const a = await t._config.onBeforeDelete({
            nodes: o,
            edges: l
          });
          if (a === !1) {
            q("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (a.nodes.length > 0 && (q("delete", `onBeforeDelete approved ${a.nodes.length} node(s)`), t.removeNodes(a.nodes.map((c) => c.id))), a.edges.length > 0) {
              const c = a.edges.map((d) => d.id).filter((d) => t.edges.some((f) => f.id === d));
              c.length > 0 && (q("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
            }
            t._recomputeChildValidation();
            for (const c of t.selectedNodes)
              t.nodes.some((d) => d.id === c) || t.selectedNodes.delete(c);
            for (const c of t.selectedEdges)
              t.edges.some((d) => d.id === c) || t.selectedEdges.delete(c);
          } finally {
            t._resumeHistory();
          }
          return;
        }
        t._captureHistory(), t._suspendHistory();
        try {
          if (o.length > 0 && (q("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((a) => a.id))), n.length > 0) {
            const a = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            a.length > 0 && (q("delete", `Deleting ${a.length} selected edge(s)`), t.removeEdges(a));
          }
          t._recomputeChildValidation();
          for (const a of t.selectedNodes)
            t.nodes.some((c) => c.id === a) || t.selectedNodes.delete(a);
          for (const a of t.selectedEdges)
            t.edges.some((c) => c.id === a) || t.selectedEdges.delete(a);
        } finally {
          t._resumeHistory();
        }
      }
    },
    // ── Clipboard Operations ─────────────────────────────────────────────
    /**
     * Copy currently selected nodes and their internal edges to the
     * module-level clipboard. Emits a `copy` event.
     */
    copy() {
      const e = jr(t.nodes, t.edges);
      e.nodeCount > 0 && (q("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
    },
    /**
     * Paste nodes/edges from the clipboard with new IDs and an
     * accumulating 20 px offset.
     *
     * - Deselects all current selection first.
     * - Pushes new nodes (topologically sorted) and edges directly.
     * - Selects all pasted items.
     * - Applies `.flow-node-selected` / `.flow-edge-selected` CSS classes
     *   after Alpine renders the new DOM elements.
     */
    paste() {
      const e = ah();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = pt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), q("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
          for (const n of e.nodes)
            t._container?.querySelector(`[data-flow-node-id="${CSS.escape(n.id)}"]`)?.classList.add("flow-node-selected");
          for (const n of e.edges)
            t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(n.id)}"]`)?.classList.add("flow-edge-selected");
        });
      }
    },
    /**
     * Copy selected nodes to the clipboard, then delete them.
     * Emits a `cut` event.
     */
    async cut() {
      if (t.selectedNodes.size === 0) return;
      const e = lh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), q("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function dh(t) {
  return {
    // ── Save / Restore ────────────────────────────────────────────
    /**
     * Serialize the current canvas state (nodes, edges, viewport) as a
     * deep-cloned plain object. Emits a `save` event with the snapshot.
     */
    toObject() {
      const e = {
        nodes: JSON.parse(JSON.stringify(t.nodes)),
        edges: JSON.parse(JSON.stringify(t.edges)),
        viewport: { ...t.viewport }
      };
      return t._emit("save", e), e;
    },
    /**
     * Restore canvas state from a saved object.
     *
     * - Deep-clones incoming nodes/edges to avoid shared references.
     * - Sorts nodes topologically for correct parent-before-child ordering.
     * - Rebuilds node and edge lookup maps.
     * - Applies viewport if provided.
     * - Deselects all, emits `restore`, and schedules auto-layout.
     */
    fromObject(e) {
      if (q("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes && (t.nodes = pt(JSON.parse(JSON.stringify(e.nodes)))), e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = new Map(t.edges.map((r) => [r.id, r])), i = [];
        for (const r of n) {
          const s = o.get(r.id);
          if (s) {
            for (const l of Object.keys(s))
              l !== "id" && !(l in r) && delete s[l];
            Object.assign(s, r), i.push(s);
          } else
            i.push(r);
        }
        t.edges = i;
      }
      if (t._rebuildNodeMap(), t._rebuildEdgeMap(), e.viewport) {
        const n = { ...t.viewport, ...e.viewport };
        t._panZoom?.setViewport(n);
      }
      t.deselectAll(), t._emit("restore", e), t._scheduleAutoLayout(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      });
    },
    /**
     * Reset the canvas to its initial configuration state.
     */
    $reset() {
      q("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      q("store", "$clear: emptying canvas"), this.fromObject({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      });
    },
    // ── Undo / Redo ────────────────────────────────────────────
    /**
     * Undo the last structural change by popping a snapshot from the
     * history past stack. Rebuilds maps and deselects all after applying.
     */
    undo() {
      if (!t._history) return;
      const e = t._history.undo({ nodes: t.nodes, edges: t.edges });
      e && (t.nodes = pt(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      }), q("history", "Undo applied", { nodes: e.nodes.length, edges: e.edges.length }));
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Rebuilds maps and deselects all after applying.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && (t.nodes = pt(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
        t._layoutAnimTick++;
      }), q("history", "Redo applied", { nodes: e.nodes.length, edges: e.edges.length }));
    },
    /**
     * Whether an undo operation is available.
     */
    get canUndo() {
      return t._history?.canUndo ?? !1;
    },
    /**
     * Whether a redo operation is available.
     */
    get canRedo() {
      return t._history?.canRedo ?? !1;
    }
  };
}
function uh(t, e) {
  return t * (1 - e);
}
function fh(t, e) {
  return t * e;
}
function hh(t, e) {
  return e === "in" ? t : 1 - t;
}
function ph(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? uh(o, e) : fh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function gh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function mh(t, e, n) {
  t.style.opacity = String(hh(e, n));
}
function yh(t) {
  t.style.removeProperty("opacity");
}
const Qe = Math.PI * 2, Qt = /* @__PURE__ */ new Map(), wh = 64;
function wi(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = Qt.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (Qt.size >= wh) {
    const r = Qt.keys().next().value;
    r !== void 0 && Qt.delete(r);
  }
  return Qt.set(t, i), i;
}
function sy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(Qe * a * l + o * Qe),
    y: n + s * Math.sin(Qe * a * l + o * Qe)
  });
}
function ry(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), f = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), g = f;
  return (p) => {
    const y = e + a * p, m = n + c * p, x = r * Math.sin(Qe * s * p + l * Qe);
    return { x: y + h * x, y: m + g * x };
  };
}
function ay(t, e) {
  const n = wi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function ly(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(Qe * l + r * Qe);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function cy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const f = d * i * Qe, u = (Math.sin(s * f) + Math.sin(l * f * 1.3)) / 2, h = (Math.sin(a * f * 0.9) + Math.sin(c * f * 1.1)) / 2;
    return { x: e + u * o, y: n + h * o };
  };
}
function dy(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let gs = !1;
function ye(t) {
  try {
    return structuredClone(t);
  } catch {
    return gs || (gs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function vh(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: ye(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function _h(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function bh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = ye(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class vi {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Sr();
  }
  // ── Public API ───────────────────────────────────────────────────────
  get state() {
    return this._state;
  }
  get locked() {
    return this._locked;
  }
  get subTimelines() {
    return this._subTimelines;
  }
  get tag() {
    return this._tag;
  }
  setTag(e) {
    return this._tag = e, this;
  }
  step(e) {
    return this._entries.push({ type: "step", config: e }), this;
  }
  parallel(e) {
    return this._entries.push({ type: "parallel", configs: e }), this;
  }
  /**
   * Create and insert a sub-timeline via a builder callback.
   * Returns the sub-timeline for individual targeting.
   */
  timeline(e, n) {
    const o = new vi(this._canvas, this._engine);
    return this._tag && !n?.independent && o.setTag(this._tag), e(o), this._entries.push({
      type: "step",
      config: { timeline: o, independent: n?.independent }
    }), o;
  }
  pause(e) {
    return this._entries.push({ type: "pause", callback: e }), this;
  }
  play() {
    return new Promise((e) => {
      this._playResolve = e, this._state = "playing", this._lockEnabled && (this._locked = !0), this._captureInitialSnapshot(), this._emit("play"), this._context = {}, this._runEntries(e);
    });
  }
  stop() {
    this._stopAll();
    for (const e of this._subTimelines)
      e.stop();
    this._subTimelines.length = 0, this._state = "stopped", this._locked = !1, this._emit("stop"), this._playResolve?.(), this._playResolve = null;
  }
  reset(e) {
    if (e)
      return console.warn("[AlpineFlow] timeline.reset(true) is deprecated. Use timeline.restart() instead."), this.restart();
    this._stopAll();
    for (const n of this._subTimelines)
      n.stop();
    this._subTimelines.length = 0, this._restoreInitialSnapshot(), this._state = "idle", this._locked = !1, this._emit("reset");
  }
  async restart(e) {
    this._stopAll();
    for (const n of this._subTimelines)
      n.stop();
    return this._subTimelines.length = 0, this._restoreInitialSnapshot(), this._state = "idle", this._locked = !1, e?.direction === "backward" ? this._reversed = !0 : e?.direction === "forward" && (this._reversed = !1), this._emit("restart"), this.play();
  }
  reverse() {
    return this._reversed = !this._reversed, this._emit("reverse"), this;
  }
  loop(e) {
    return this._loopCount = e ?? 0, this;
  }
  lock(e) {
    return this._lockEnabled = e ?? !0, this;
  }
  respectReducedMotion(e) {
    return this._respectReducedMotion = e ?? !0, this;
  }
  on(e, n) {
    return this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set()), this._listeners.get(e).add(n), this;
  }
  /** Externally pause a playing timeline. Non-independent sub-timelines are also paused. */
  pausePlayback() {
    if (this._state === "playing") {
      this._state = "paused", this._lockEnabled && (this._locked = !1);
      for (const e of this._subTimelines)
        e.state === "playing" && e.pausePlayback();
      this._emit("pause");
    }
  }
  /** Resume a paused timeline. Non-independent sub-timelines are also resumed. */
  resumePlayback() {
    if (this._state === "paused") {
      this._state = "playing", this._lockEnabled && (this._locked = !0);
      for (const e of this._subTimelines)
        e.state === "paused" && e.resumePlayback();
      this._emit("resume");
      for (const e of this._pauseWaiters) e();
      this._pauseWaiters.clear();
    }
  }
  /** Check if reduced motion is active (OS preference + not opted out). */
  _isReducedMotion() {
    return kr(this._respectReducedMotion);
  }
  // ── Internal: event emission ────────────────────────────────────────
  _emit(e, n) {
    const o = this._listeners.get(e);
    if (o)
      for (const i of o)
        i(n);
  }
  // ── Internal: snapshot management ───────────────────────────────────
  _captureInitialSnapshot() {
    if (!(this._initialSnapshot.size > 0))
      for (const e of this._entries)
        this._captureEntryTargets(e);
  }
  _captureEntryTargets(e) {
    if (e.type === "pause") return;
    const n = e.type === "parallel" ? e.configs : [e.config];
    for (const o of n) {
      const i = typeof o == "function" ? null : o;
      if (i)
        if (i.parallel)
          for (const r of i.parallel)
            this._captureStepTargets(r);
        else
          this._captureStepTargets(i);
    }
  }
  _captureStepTargets(e) {
    if (e.nodes) {
      for (const n of e.nodes)
        if (!this._initialSnapshot.has(n)) {
          const o = this._canvas.getNode(n);
          o && this._initialSnapshot.set(n, vh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, _h(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && bh(o, n);
    }
  }
  // ── Internal: handle management ─────────────────────────────────────
  _stopAll() {
    for (const e of this._activeHandles)
      e.stop();
    this._activeHandles = [];
  }
  // ── Internal: entry execution ───────────────────────────────────────
  async _runEntries(e) {
    const n = this._reversed ? [...this._entries].reverse() : this._entries;
    let o = this._loopCount;
    const i = async () => {
      for (let r = 0; r < n.length; r++) {
        if (this._state === "stopped" || this._state === "paused" && (await this._waitForResume(), this._state === "stopped"))
          return;
        const s = n[r];
        if (s.type === "pause") {
          await this._executePause(s);
          continue;
        }
        if (s.type === "parallel") {
          await this._executeParallel(s.configs, r);
          continue;
        }
        const l = s.config, a = typeof l == "function" ? l(this._makeContext(r)) : l;
        a.parallel ? await this._executeParallelSteps(a.parallel, r) : await this._executeStep(a, r);
      }
    };
    if (await i(), this._state !== "stopped" && o !== -1) {
      let r = 0;
      for (; this._state !== "stopped"; )
        if (o === 0) {
          this._restoreInitialSnapshot(), this._emit("loop", { iteration: r++ });
          try {
            await i();
          } catch {
            e();
            return;
          }
        } else if (o > 0) {
          if (o--, this._restoreInitialSnapshot(), this._emit("loop", { iteration: this._loopCount - o }), await i(), o <= 0) break;
        } else
          break;
    }
    this._state !== "stopped" && (this._state = "idle", this._locked = !1, this._emit("complete")), e();
  }
  _makeContext(e, n) {
    return {
      ...this._context,
      stepIndex: e,
      stepId: n
    };
  }
  // ── Internal: pause-playback wait ────────────────────────────────────
  /** Block until resumePlayback() is called. Used by _runEntries when externally paused. */
  _waitForResume() {
    return new Promise((e) => {
      this._pauseWaiters.add(e);
    });
  }
  // ── Internal: pause execution ───────────────────────────────────────
  _executePause(e) {
    return new Promise((n) => {
      this._state = "paused", this._lockEnabled && (this._locked = !1), this._emit("pause");
      const o = (i) => {
        i && Object.assign(this._context, i), this._state = "playing", this._lockEnabled && (this._locked = !0), this._emit("resume"), n();
      };
      e.callback?.(o);
    });
  }
  // ── Internal: parallel execution ────────────────────────────────────
  async _executeParallel(e, n) {
    const o = e.map(
      (i) => typeof i == "function" ? i(this._makeContext(n)) : i
    );
    await this._executeParallelSteps(o, n);
  }
  async _executeParallelSteps(e, n) {
    const o = e.map((i) => this._executeStep(i, n));
    await Promise.all(o);
  }
  // ── Internal: single step execution ─────────────────────────────────
  async _executeStep(e, n) {
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = Gn(e.easing), l = this._makeContext(n, e.id);
    if (e.when && !e.when(l)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const $ = e.timeline;
      if (this._tag && !e.independent && $.setTag(this._tag), e.independent || this._subTimelines.push($), this._emit("step", { index: n, id: e.id, timeline: $ }), e.onStart?.(l), await $.play(), this._state === "stopped") return;
      if (e.onComplete?.(l), this._emit("step-complete", { timeline: $ }), !e.independent) {
        const b = this._subTimelines.indexOf($);
        b >= 0 && this._subTimelines.splice(b, 1);
      }
      return;
    }
    if (this._emit("step", { index: n, id: e.id }), e.onStart?.(l), e.await && (await this._resolveAwait(e, n), this._state === "stopped"))
      return;
    if (e.await && this._isAwaitOnlyStep(e))
      return e.onProgress?.(1, l), e.onComplete?.(l), this._emit("step-complete"), Promise.resolve();
    const { validNodeIds: a, validEdgeIds: c } = this._validateStepTargets(e, n);
    if (this._isEmptyStep(e, a, c))
      return e.onProgress?.(1, l), e.onComplete?.(l), this._emit("step-complete"), Promise.resolve();
    const d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, a, d, f);
    const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, u, h);
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, x = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, x = this._resolveTargetViewport(e));
    const k = e.edgeTransition ?? "none", v = e.addEdges?.map(($) => $.id) ?? [], A = e.removeEdges?.filter(($) => this._canvas.getEdge($)).slice() ?? [], S = {
      step: e,
      ctx: l,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: a,
      validEdgeIds: c,
      resolvedPathFn: g,
      guidePathEl: p,
      nodeFromDimensions: d,
      nodeFromStyles: f,
      edgeFromStrokeWidth: u,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: x,
      transition: k,
      addEdgeIds: v,
      removeEdgeIds: A
    };
    if (i === 0)
      return this._executeInstantStep(S);
    const P = this._prepareAnimatedEdges(e, k, v);
    return P && await P, g ? this._executeFollowPathStep(S) : this._executeAnimatedStep(S);
  }
  // ── Step decomposition: target validation ──────────────────────────
  /** Filter node/edge IDs to only those present on the canvas; warn in debug mode. */
  _validateStepTargets(e, n) {
    let o, i;
    if (e.nodes) {
      o = [];
      for (const r of e.nodes)
        this._canvas.getNode(r) ? o.push(r) : this._canvas.debug && console.warn(`[AlpineFlow] Animation step "${e.id ?? n}": node "${r}" not found, skipping`);
    }
    if (e.edges) {
      i = [];
      for (const r of e.edges)
        this._canvas.getEdge(r) ? i.push(r) : this._canvas.debug && console.warn(`[AlpineFlow] Animation step "${e.id ?? n}": edge "${r}" not found, skipping`);
    }
    return { validNodeIds: o, validEdgeIds: i };
  }
  // ── Step decomposition: empty-step check ───────────────────────────
  /** Return true when the step targets nodes/edges but has zero valid targets and nothing else to do. */
  _isEmptyStep(e, n, o) {
    const i = e.nodes && e.nodes.length > 0, r = e.edges && e.edges.length > 0, s = !!(e.viewport || e.fitView || e.panTo), l = !!(e.addEdges?.length || e.removeEdges?.length), a = i && (!n || n.length === 0), c = r && (!o || o.length === 0);
    return !!(a && c && !s && !l || a && !r && !s && !l || c && !i && !s && !l);
  }
  /** Check whether a step has only an await and no animation targets. */
  _isAwaitOnlyStep(e) {
    const n = e.nodes && e.nodes.length > 0, o = e.edges && e.edges.length > 0, i = !!(e.viewport || e.fitView || e.panTo), r = !!(e.addEdges?.length || e.removeEdges?.length);
    return !n && !o && !i && !r;
  }
  // ── Step decomposition: resolve awaitable ─────────────────────────
  /** Normalize and await the step's `await` field (Promise, handle, or thunk). */
  async _resolveAwait(e, n) {
    let o = e.await;
    if (o && (typeof o == "function" && (o = o()), o && typeof o == "object" && "finished" in o && !(o instanceof Promise) && (o = o.finished), o instanceof Promise))
      if (e.timeout && e.timeout > 0) {
        let i;
        const r = new Promise((l) => {
          i = setTimeout(() => l("timeout"), e.timeout);
        }), s = await Promise.race([o.then(() => "resolved"), r]);
        i !== void 0 && clearTimeout(i), s === "timeout" && this._emit("step-timeout", { index: n, id: e.id });
      } else
        await o;
  }
  // ── Step decomposition: capture from-values ────────────────────────
  /** Capture initial node dimensions and styles for interpolation. */
  _captureNodeFromValues(e, n, o, i) {
    if (n)
      for (const r of n) {
        const s = this._canvas.getNode(r);
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, mn(s.style)));
      }
  }
  /** Capture initial edge strokeWidth and color for interpolation. */
  _captureEdgeFromValues(e, n, o, i) {
    if (n)
      for (const r of n) {
        const s = this._canvas.getEdge(r);
        s && (e.edgeStrokeWidth !== void 0 && s.strokeWidth !== void 0 && o.set(r, s.strokeWidth), e.edgeColor !== void 0 && s.color !== void 0 && i.set(r, s.color));
      }
  }
  // ── Step decomposition: followPath & guide path ────────────────────
  /** Resolve a followPath config to a callable PathFunction. */
  _resolveFollowPath(e) {
    if (!e.followPath) return null;
    if (typeof e.followPath == "function")
      return e.followPath;
    const n = wi(e.followPath);
    return !n && this._canvas.debug && console.warn("[AlpineFlow] SVG path resolution unavailable (no DOM), followPath string ignored"), n;
  }
  /** Create a visible SVG guide path overlay for string-based followPath. */
  _createGuidePath(e) {
    if (!e.guidePath?.visible || typeof e.followPath != "string" || typeof document > "u")
      return null;
    const n = this._canvas.getEdgeSvgElement?.();
    if (!n) return null;
    const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return o.setAttribute("d", e.followPath), o.classList.add("flow-guide-path"), e.guidePath.class && o.classList.add(e.guidePath.class), n.appendChild(o), o;
  }
  // ── Step decomposition: instant execution (duration: 0) ────────────
  /** Handle an instant step (duration === 0), optionally with a delay. */
  _executeInstantStep(e) {
    const { step: n, ctx: o, delay: i, resolvedPathFn: r, validNodeIds: s, guidePathEl: l } = e;
    if (i > 0)
      return new Promise((a) => {
        const c = setTimeout(() => {
          this._applyStepFinal(n), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), a();
        }, i), d = {
          stop() {
            clearTimeout(c);
          }
        };
        this._activeHandles.push(d);
      });
    if (r && s) {
      const a = r(1);
      for (const c of s) {
        const d = this._canvas.getNode(c);
        d && (d.position.x = a.x, d.position.y = a.y);
      }
    }
    return this._applyStepFinal(n), l && n.guidePath?.autoRemove !== !1 && l.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), Promise.resolve();
  }
  // ── Step decomposition: pre-animation edge setup ───────────────────
  /** Add edges to the DOM and pre-hide them for transition animations. Returns a promise only when async work is needed. */
  _prepareAnimatedEdges(e, n, o) {
    if (e.addEdges && this._addEdges(e.addEdges), n !== "none" && o.length && e.addEdges)
      return new Promise((i) => {
        queueMicrotask(() => queueMicrotask(() => {
          n === "draw" ? this._applyEdgeDrawTransition(o, 0, "in") : n === "fade" && this._applyEdgeFadeTransition(o, 0, "in"), i();
        }));
      });
  }
  // ── Step decomposition: followPath animation ───────────────────────
  /** Execute an animated step using engine-based interpolation for followPath. */
  _executeFollowPathStep(e) {
    const {
      step: n,
      ctx: o,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: l,
      validEdgeIds: a,
      nodeFromDimensions: c,
      nodeFromStyles: d,
      edgeFromStrokeWidth: f,
      edgeFromColor: u,
      viewportFrom: h,
      viewportTarget: g,
      transition: p,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: x
    } = e, k = e.resolvedPathFn;
    return new Promise((v) => {
      const A = this._engine.register((S) => {
        if (this._state === "stopped")
          return v(), !0;
        const P = Math.min(S / i, 1), $ = s(P);
        if (l) {
          const b = k($);
          for (const E of l) {
            const N = this._canvas.getNode(E);
            N && (N.position.x = b.x, N.position.y = b.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          $,
          l,
          a,
          c,
          d,
          f,
          u,
          h,
          g
        ), this._tickEdgeTransitions(p, y, m, $), n.onProgress?.(P, o), P >= 1 ? (this._cleanupEdgeTransitions(p, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), x && n.guidePath?.autoRemove !== !1 && x.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), v(), !0) : !1;
      }, r);
      this._activeHandles.push(A);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, l, a, c, d) {
    if (o && e.dimensions)
      for (const f of o) {
        const u = this._canvas.getNode(f), h = r.get(f);
        !u || !h || !u.dimensions || (e.dimensions.width !== void 0 && (u.dimensions.width = et(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (u.fixedDimensions = !0, u.dimensions.height = et(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const f = mn(e.style);
      for (const u of o) {
        const h = this._canvas.getNode(u), g = s.get(u);
        h && g && (h.style = Lr(g, f, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const f of i) {
        const u = this._canvas.getEdge(f), h = l.get(f);
        u && (h !== void 0 ? u.strokeWidth = et(h, e.edgeStrokeWidth, n) : u.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const f of i) {
        const u = this._canvas.getEdge(f), h = a.get(f);
        u && (h !== void 0 && typeof h == "string" ? u.color = pi(h, e.edgeColor, n) : u.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const f = Bu(c, d, n, {
        minZoom: this._canvas.minZoom,
        maxZoom: this._canvas.maxZoom
      });
      this._canvas.viewport.x = f.x, this._canvas.viewport.y = f.y, this._canvas.viewport.zoom = f.zoom;
    }
  }
  // ── Step decomposition: edge transition helpers ────────────────────
  /** Apply edge transitions (draw/fade) for a single animation tick. */
  _tickEdgeTransitions(e, n, o, i) {
    e === "draw" ? (n.length && this._applyEdgeDrawTransition(n, i, "in"), o.length && this._applyEdgeDrawTransition(o, i, "out")) : e === "fade" && (n.length && this._applyEdgeFadeTransition(n, i, "in"), o.length && this._applyEdgeFadeTransition(o, i, "out"));
  }
  /** Clean up edge transition styles at the end of animation. */
  _cleanupEdgeTransitions(e, n, o) {
    e === "draw" ? (this._cleanupEdgeDrawTransition(n), this._cleanupEdgeDrawTransition(o)) : e === "fade" && (this._cleanupEdgeFadeTransition(n), this._cleanupEdgeFadeTransition(o));
  }
  // ── Step decomposition: canvas.animate() execution ─────────────────
  /** Execute an animated step using canvas.animate() for standard interpolation. */
  _executeAnimatedStep(e) {
    const {
      step: n,
      ctx: o,
      duration: i,
      delay: r,
      validNodeIds: s,
      validEdgeIds: l,
      viewportFrom: a,
      viewportTarget: c,
      transition: d,
      addEdgeIds: f,
      removeEdgeIds: u,
      guidePathEl: h
    } = e;
    return new Promise((g) => {
      const p = this._buildAnimateTargets(
        n,
        s,
        l,
        a,
        c
      ), y = Object.keys(p.nodes || {}).length > 0 || Object.keys(p.edges || {}).length > 0 || p.viewport;
      if (!y && !f.length && !u.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
        return;
      }
      if (y) {
        const m = this._canvas.animate(p, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (x) => {
            if (this._state === "stopped") {
              m.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, f, u, x), n.onProgress?.(x, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, f, u), u.length && this._removeEdges(u), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
          }
        });
        this._activeHandles.push({ stop: () => m.stop() });
      } else
        this._executeEdgeLifecycleOnly(e, g);
    });
  }
  /** Build AnimateTargets from step config for canvas.animate(). */
  _buildAnimateTargets(e, n, o, i, r) {
    const s = {};
    if (n) {
      s.nodes = {};
      for (const l of n) {
        const a = {};
        e.position && (a.position = { ...e.position }), e.dimensions && (a.dimensions = { ...e.dimensions }), e.style !== void 0 && (a.style = e.style), e.class !== void 0 && (a.class = e.class), e.data !== void 0 && (a.data = e.data), e.selected !== void 0 && (a.selected = e.selected), e.zIndex !== void 0 && (a.zIndex = e.zIndex), s.nodes[l] = a;
      }
    }
    if (o) {
      s.edges = {};
      for (const l of o) {
        const a = {};
        e.edgeColor !== void 0 && (a.color = e.edgeColor), e.edgeStrokeWidth !== void 0 && (a.strokeWidth = e.edgeStrokeWidth), e.edgeLabel !== void 0 && (a.label = e.edgeLabel), e.edgeAnimated !== void 0 && (a.animated = e.edgeAnimated), e.edgeClass !== void 0 && (a.class = e.edgeClass), s.edges[l] = a;
      }
    }
    return r && i && (s.viewport = {
      pan: { x: r.x, y: r.y },
      zoom: r.zoom
    }), s;
  }
  /** Run edge lifecycle transitions (draw/fade) via the engine when there are no other animatable targets. */
  _executeEdgeLifecycleOnly(e, n) {
    const { step: o, ctx: i, duration: r, delay: s, transition: l, addEdgeIds: a, removeEdgeIds: c, guidePathEl: d } = e, f = this._engine.register((u) => {
      if (this._state === "stopped")
        return n(), !0;
      const h = Math.min(u / r, 1);
      return this._tickEdgeTransitions(l, a, c, h), o.onProgress?.(h, i), h >= 1 ? (this._cleanupEdgeTransitions(l, a, c), c.length && this._removeEdges(c), d && o.guidePath?.autoRemove !== !1 && d.remove(), o.onProgress?.(1, i), o.onComplete?.(i), this._emit("step-complete"), n(), !0) : !1;
    }, s);
    this._activeHandles.push(f);
  }
  // ── Internal: apply step properties ─────────────────────────────────
  /** Apply all properties of a step at their final values (for instant steps). */
  _applyStepFinal(e) {
    if (e.addEdges && this._addEdges(e.addEdges), e.removeEdges && this._removeEdges(e.removeEdges), e.nodes)
      for (const n of e.nodes) {
        const o = this._canvas.getNode(n);
        o && (e.position && (e.position.x !== void 0 && (o.position.x = e.position.x), e.position.y !== void 0 && (o.position.y = e.position.y)), e.class !== void 0 && (o.class = e.class), e.data !== void 0 && Object.assign(o.data, e.data), e.selected !== void 0 && (o.selected = e.selected), e.zIndex !== void 0 && (o.zIndex = e.zIndex), e.dimensions && o.dimensions && (e.dimensions.width !== void 0 && (o.dimensions.width = e.dimensions.width), e.dimensions.height !== void 0 && (o.fixedDimensions = !0, o.dimensions.height = e.dimensions.height)), e.style !== void 0 && (o.style = e.style));
      }
    this._applyViewportFinal(e), this._applyStepInstant(e);
  }
  /** Apply instant-swap edge properties (not interpolated). */
  _applyStepInstant(e) {
    if (e.edges)
      for (const n of e.edges) {
        const o = this._canvas.getEdge(n);
        o && (e.edgeAnimated !== void 0 && (o.animated = e.edgeAnimated), e.edgeClass !== void 0 && (o.class = e.edgeClass), e.edgeLabel !== void 0 && (o.label = e.edgeLabel));
      }
  }
  // ── Internal: edge lifecycle ───────────────────────────────────────
  /** Add edges to the canvas edges array. */
  _addEdges(e) {
    this._canvas.edges.push(...e), this._canvas._rebuildEdgeMap?.();
  }
  /** Remove edges from the canvas edges array by ID. */
  _removeEdges(e) {
    for (const n of e) {
      const o = this._canvas.edges.findIndex((i) => i.id === n);
      o !== -1 && this._canvas.edges.splice(o, 1);
    }
    this._canvas._rebuildEdgeMap?.();
  }
  /** Apply draw transition on each tick for added/removed edges. */
  _applyEdgeDrawTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgePathElement?.(i);
      r && ph(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && gh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && mh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && yh(o);
    }
  }
  // ── Internal: viewport helpers ──────────────────────────────────
  /** Compute the target viewport for a step (viewport, fitView, or panTo). */
  _resolveTargetViewport(e) {
    const n = this._canvas.viewport;
    return n ? e.fitView ? this._computeFitViewViewport(e) : e.panTo ? this._computePanToViewport(e.panTo) : e.viewport ? {
      x: e.viewport.x ?? n.x,
      y: e.viewport.y ?? n.y,
      zoom: e.viewport.zoom ?? n.zoom
    } : null : null;
  }
  /** Compute the viewport that fits all (or specified) nodes with padding. */
  _computeFitViewViewport(e) {
    const n = this._canvas.getContainerDimensions?.();
    if (!n) return null;
    const o = e.nodes ? e.nodes.map((s) => this._canvas.getNode(s)).filter((s) => !!s) : this._canvas.nodes;
    if (o.length === 0) return null;
    const i = qt(o), r = e.fitViewPadding ?? 0.1;
    return Zn(
      i,
      n.width,
      n.height,
      this._canvas.minZoom ?? 0.5,
      this._canvas.maxZoom ?? 2,
      r
    );
  }
  /** Compute the viewport that centers on a given node. */
  _computePanToViewport(e) {
    const n = this._canvas.getNode(e);
    if (!n) return null;
    const o = this._canvas.viewport;
    if (!o) return null;
    const i = this._canvas.getContainerDimensions?.();
    if (!i) return null;
    const r = n.dimensions?.width ?? ve, s = n.dimensions?.height ?? _e, l = n.position.x + r / 2, a = n.position.y + s / 2;
    return {
      x: i.width / 2 - l * o.zoom,
      y: i.height / 2 - a * o.zoom,
      zoom: o.zoom
    };
  }
  /** Apply viewport at final values (for instant steps). */
  _applyViewportFinal(e) {
    const n = this._resolveTargetViewport(e);
    !n || !this._canvas.viewport || (this._canvas.viewport.x = n.x, this._canvas.viewport.y = n.y, this._canvas.viewport.zoom = n.zoom);
  }
}
const Ur = /* @__PURE__ */ new Map();
function Ut(t, e) {
  Ur.set(t, e);
}
function xh(t) {
  return Ur.get(t);
}
const Fe = "http://www.w3.org/2000/svg", Eh = {
  create(t, e) {
    const n = document.createElementNS(Fe, "circle");
    if (n.setAttribute("r", String(e.size ?? 4)), n.setAttribute("fill", e.color ?? "#8B5CF6"), n.classList.add("flow-edge-particle"), e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n }) {
    t.setAttribute("cx", String(e)), t.setAttribute("cy", String(n));
  },
  destroy(t) {
    t.remove();
  }
}, Ch = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Fe, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Fe, "circle");
    if (s.setAttribute("r", String(o)), s.setAttribute("fill", i), n.appendChild(s), e.class)
      for (const l of e.class.split(" "))
        l && n.classList.add(l);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, elapsed: o }) {
    const r = 1 + 0.2 * Math.sin(o * 1e-3 * 2 * Math.PI * 2);
    t.setAttribute("transform", `translate(${e},${n}) scale(${r})`);
  },
  destroy(t) {
    t.remove();
  }
};
let Sh = 0;
const kh = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Sh}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, l = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, f = n.__gradient;
      if (!d) {
        let p = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(Fe, "defs");
          f = document.createElementNS(Fe, "linearGradient"), f.setAttribute("id", l), f.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const x = document.createElementNS(Fe, "stop");
            x.setAttribute("offset", String(m.offset)), x.setAttribute("stop-color", m.color), m.opacity !== void 0 && x.setAttribute("stop-opacity", String(m.opacity)), f.appendChild(x);
          }
          y.appendChild(f), n.appendChild(y), p = `url(#${l})`, n.__gradient = f;
        }
        d = document.createElementNS(Fe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = p, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, g = o - h;
      if (d.setAttribute("stroke-dashoffset", String(g)), f) {
        const p = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(p), x = e.pathEl.getPointAtLength(y);
        f.setAttribute("x1", String(x.x)), f.setAttribute("y1", String(x.y)), f.setAttribute("x2", String(m.x)), f.setAttribute("y2", String(m.y));
      }
      return;
    }
    let a = n.__fallbackRect;
    a || (a = document.createElementNS(Fe, "rect"), a.setAttribute("width", String(o)), a.setAttribute("height", String(i)), a.setAttribute("rx", String(i / 2)), a.setAttribute("fill", r), a.setAttribute("opacity", "0.8"), n.appendChild(a), n.__fallbackRect = a);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    a.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, Lh = {
  create(t, e) {
    const n = document.createElementNS(Fe, "circle");
    if (n.setAttribute("r", String(e.size ?? 6)), n.setAttribute("fill", "none"), n.setAttribute("stroke", e.color ?? "#8B5CF6"), n.setAttribute("stroke-width", "2"), e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, { x: e, y: n, progress: o }) {
    const r = 1 + o * 2, s = Math.max(0, 1 - o);
    t.setAttribute("cx", "0"), t.setAttribute("cy", "0"), t.setAttribute("transform", `translate(${e},${n}) scale(${r})`), t.setAttribute("opacity", String(s));
  },
  destroy(t) {
    t.remove();
  }
}, Ph = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(Fe, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(Fe, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
      for (const r of e.class.split(" "))
        r && i.classList.add(r);
    return t.appendChild(i), i;
  },
  update(t, { x: e, y: n }) {
    const o = parseFloat(t.getAttribute("width") ?? "16");
    t.setAttribute("x", String(e - o / 2)), t.setAttribute("y", String(n - o / 2));
  },
  destroy(t) {
    t.remove();
  }
};
Ut("circle", Eh);
Ut("orb", Ch);
Ut("beam", kh);
Ut("pulse", Lh);
Ut("image", Ph);
let ms = !1;
function Mh(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function ys(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Mh(o);
}
function Th(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = xh(l);
    if (!a) {
      q("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !ms && (ms = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? gn, u = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), g = ys(r, h, u), p = { ...r, size: d, color: f }, y = a.create(i, p), m = o.getPointAtLength(0), x = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, x);
    let k;
    const v = new Promise((b) => {
      k = b;
    }), A = () => {
      typeof r.onComplete == "function" && r.onComplete(), k();
    }, S = s.wrapOnComplete ? s.wrapOnComplete(A) : A, P = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: S,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(P), t._particleEngineHandle || (t._particleEngineHandle = Kn.register((b) => t._tickParticles(b))), {
      getCurrentPosition() {
        return t._activeParticles.has(P) ? { ...P.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(P) && (P.renderer.destroy(P.element), t._activeParticles.delete(P), S());
      },
      get finished() {
        return v;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      q("particle", "sendParticleAlongPath: SVG layer unavailable");
      return;
    }
    const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("d", o), s.style.display = "none", r.appendChild(s);
    const l = e(s, r, i, {
      wrapOnComplete: (a) => () => {
        a(), s.remove();
      }
    });
    if (!l) {
      s.remove();
      return;
    }
    return q("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), l;
  }
  return {
    // ── Particle tick loop ────────────────────────────────────────────────
    /**
     * Engine tick callback — processes all active particles in one pass.
     * Receives `elapsed` (ms since engine registration) from the engine.
     * Returns true to unregister from engine when all particles are done.
     */
    _tickParticles(o) {
      const i = /* @__PURE__ */ new Map();
      for (const r of t._activeParticles) {
        r.startElapsed < 0 && (r.startElapsed = o);
        const s = (o - r.startElapsed) / r.ms;
        if (s >= 1 || !r.element.parentNode) {
          r.renderer.destroy(r.element), typeof r.onComplete == "function" && r.onComplete(), t._activeParticles.delete(r);
          continue;
        }
        let l = i.get(r.pathEl);
        l === void 0 && (l = r.pathEl.getTotalLength(), i.set(r.pathEl, l));
        const a = r.pathEl.getPointAtLength(s * l), c = {
          x: a.x,
          y: a.y,
          progress: s,
          velocity: {
            x: a.x - r.currentPosition.x,
            y: a.y - r.currentPosition.y
          },
          pathLength: l,
          elapsed: o - r.startElapsed,
          pathEl: r.pathEl
        };
        r.renderer.update(r.element, c), r.currentPosition = { x: a.x, y: a.y };
      }
      return t._activeParticles.size === 0 ? (t._particleEngineHandle = null, !0) : !1;
    },
    // ── Send particle along edge ──────────────────────────────────────────
    /**
     * Fire a particle along an edge path. The particle is an SVG element
     * that follows the edge's `<path>` element using `getPointAtLength`.
     */
    sendParticle(o, i = {}) {
      const r = t._edgeSvgElements.get(o);
      if (r && r.style.display === "none") return;
      const s = t.getEdge(o);
      if (!s) {
        q("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const l = t.getEdgePathElement(o);
      if (!l) {
        q("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!l.getAttribute("d")) {
        q("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, f = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? gn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(l, c, i, {
        size: f,
        color: u,
        durationFallback: h
      });
      return g && q("particle", `sendParticle on edge "${o}"`, { size: f, color: u, duration: i.duration }), g;
    },
    // ── Send particle along arbitrary SVG path ───────────────────────────
    /**
     * Fire a particle along an arbitrary SVG path string, not tied to an
     * existing edge. A temporary invisible `<path>` element is injected
     * into the edge SVG layer and removed when the particle finishes.
     */
    sendParticleAlongPath(o, i = {}) {
      return n(o, i);
    },
    // ── Send particle between two nodes ──────────────────────────────────
    /**
     * Fire a particle along a straight line between two node centers.
     * Delegates to sendParticleAlongPath after computing the SVG path.
     */
    sendParticleBetween(o, i, r = {}) {
      const s = t.getNode(o);
      if (!s) {
        q("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const l = t.getNode(i);
      if (!l) {
        q("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const a = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = l.position.x + (l.dimensions?.width ?? 150) / 2, f = l.position.y + (l.dimensions?.height ?? 40) / 2, u = `M ${a} ${c} L ${d} ${f}`;
      return q("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: u }), n(u, r);
    },
    // ── Burst: sequenced multi-particle emission ─────────────────────────
    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(o, i) {
      const { count: r, stagger: s = 100, variant: l, ...a } = i, c = [], d = [];
      for (let u = 0; u < r; u++) {
        const h = l ? { ...a, ...l(u, r) } : { ...a };
        if (u === 0)
          c.push(this.sendParticle(o, h));
        else {
          const g = setTimeout(() => {
            c.push(this.sendParticle(o, h));
          }, u * s);
          d.push(g);
        }
      }
      const f = () => c.filter((u) => u != null);
      return {
        get handles() {
          return f();
        },
        get finished() {
          return new Promise((u) => {
            setTimeout(() => {
              Promise.all(f().map((h) => h.finished)).then(() => u());
            }, r * s + 50);
          });
        },
        stopAll() {
          for (const u of d)
            clearTimeout(u);
          for (const u of f())
            u.stop();
        }
      };
    },
    // ── Converging: fan-in particle visualization ───────────────────────
    /**
     * Fire particles from multiple edges that all arrive at (or depart from)
     * a target node simultaneously. For 'arrival' synchronization, shorter
     * paths get shorter durations and delayed starts so all particles reach
     * the target at the same time.
     */
    sendConverging(o, i) {
      const { targetNodeId: r, synchronize: s = "arrival", onAllArrived: l, ...a } = i, c = [], d = [];
      if (s === "arrival") {
        const u = o.map((p) => {
          const m = t.getEdgePathElement(p)?.getTotalLength() ?? 0;
          return { id: p, length: m };
        }).filter((p) => p.length > 0);
        if (u.length === 0) {
          const p = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: p, stopAll() {
          } };
        }
        const h = Math.max(...u.map((p) => p.length)), g = ys(a, h, "2s");
        for (const { id: p, length: y } of u) {
          const m = y / h, x = g * m, k = g - x;
          if (k <= 0) {
            const v = this.sendParticle(p, { ...a, duration: x });
            v && c.push(v);
          } else {
            const v = setTimeout(() => {
              const A = this.sendParticle(p, { ...a, duration: x });
              A && c.push(A);
            }, k);
            d.push(v);
          }
        }
      } else
        for (const u of o) {
          const h = this.sendParticle(u, a);
          h && c.push(h);
        }
      const f = new Promise((u) => {
        setTimeout(() => {
          Promise.all(c.map((g) => g.finished)).then(() => {
            l?.(), u();
          });
        }, s === "arrival" ? 100 : 0);
      });
      return {
        get handles() {
          return c;
        },
        finished: f,
        stopAll() {
          for (const u of d)
            clearTimeout(u);
          for (const u of c)
            u.stop();
        }
      };
    },
    // ── Cleanup ───────────────────────────────────────────────────────────
    /**
     * Stop the particle engine and remove all active particles from the DOM.
     * Called during canvas destroy().
     */
    destroyParticles() {
      t._particleEngineHandle?.stop(), t._particleEngineHandle = null;
      for (const o of t._activeParticles)
        o.renderer.destroy(o.element);
      t._activeParticles.clear();
    }
  };
}
class Ah {
  constructor(e, n) {
    this.name = e, this._host = n;
  }
  animate(e, n) {
    const o = [...n?.tags ?? []];
    return n?.tag && o.push(n.tag), this._host.animate(e, { ...n, tag: this.name, tags: o });
  }
  update(e, n) {
    const o = [...n?.tags ?? []];
    return n?.tag && o.push(n.tag), this._host.update(e, { ...n, tag: this.name, tags: o });
  }
  sendParticle(e, n) {
    return this._host.sendParticle?.(e, { ...n, tag: this.name });
  }
  sendParticleAlongPath(e, n) {
    return this._host.sendParticleAlongPath?.(e, { ...n, tag: this.name });
  }
  sendParticleBetween(e, n, o) {
    return this._host.sendParticleBetween?.(e, n, { ...o, tag: this.name });
  }
  sendParticleBurst(e, n) {
    return this._host.sendParticleBurst(e, { ...n, tag: this.name });
  }
  sendConverging(e, n) {
    return this._host.sendConverging(e, { ...n, tag: this.name });
  }
  timeline() {
    const e = this._host.timeline?.();
    return e && typeof e.setTag == "function" && e.setTag(this.name), e;
  }
  cancelAll(e) {
    this._host.cancelAll({ tag: this.name }, e);
  }
  pauseAll() {
    this._host.pauseAll({ tag: this.name });
  }
  resumeAll() {
    this._host.resumeAll({ tag: this.name });
  }
  get handles() {
    return this._host.getHandles({ tag: this.name });
  }
}
const Go = 1, Jo = 1 / 60;
class sn {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = ye(e);
  }
  /** Current virtual time in milliseconds. */
  get virtualTime() {
    return this._virtualTime;
  }
  /** Number of currently in-flight animations. */
  get inFlightCount() {
    return this._inFlight.size;
  }
  /** Return a deep-cloned copy of the current virtual canvas state. */
  getState() {
    return ye(this._state);
  }
  /** Advance virtual clock by `dt` seconds and step all in-flight animations. */
  advance(e) {
    if (!(e <= 0)) {
      this._virtualTime += e * 1e3;
      for (const [n, o] of this._inFlight)
        this._stepAnimation(o, e), this._isSettled(o) && this._inFlight.delete(n);
    }
  }
  /** Apply a recorded event to the virtual state. */
  applyEvent(e) {
    switch (e.type) {
      case "animate":
      case "update":
        this._applyAnimate(e);
        break;
      case "node-add": {
        const n = e.args.nodes;
        if (Array.isArray(n))
          for (const o of n)
            o?.id && (this._state.nodes[o.id] = ye(o));
        else n?.id ? this._state.nodes[n.id] = ye(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = ye(e.args.node));
        break;
      }
      case "node-remove": {
        const n = e.args.ids;
        if (Array.isArray(n))
          for (const o of n)
            delete this._state.nodes[o];
        else typeof n == "string" ? delete this._state.nodes[n] : e.args.id && delete this._state.nodes[e.args.id];
        break;
      }
      case "edge-add": {
        const n = e.args.edges;
        if (Array.isArray(n))
          for (const o of n)
            o?.id && (this._state.edges[o.id] = ye(o));
        else n?.id ? this._state.edges[n.id] = ye(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = ye(e.args.edge));
        break;
      }
      case "edge-remove": {
        const n = e.args.ids;
        if (Array.isArray(n))
          for (const o of n)
            delete this._state.edges[o];
        else typeof n == "string" ? delete this._state.edges[n] : e.args.id && delete this._state.edges[e.args.id];
        break;
      }
      case "viewport-change":
        Object.assign(this._state.viewport, e.args);
        break;
    }
  }
  /** Restore the engine from a Checkpoint. */
  restoreCheckpoint(e) {
    this._state = ye(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = ye(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: ye(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Ar(r) ?? void 0 : void 0, l = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: ye(o),
      startTime: this._virtualTime,
      duration: i.duration,
      easing: i.easing,
      motion: s,
      direction: "forward",
      currentValues: {},
      _motion: s
    };
    this._initAnim(l), this._inFlight.set(n, l);
  }
  _initAnim(e) {
    const n = {}, o = {};
    if (this._collectNumericProperties(e.targets, n, o, this._state), e._from = n, e.type === "eased")
      e._easingFn = Gn(e.easing);
    else {
      e._physicsStates = /* @__PURE__ */ new Map();
      for (const i of Object.keys(n))
        e._physicsStates.set(i, {
          value: n[i],
          velocity: 0,
          target: o[i] ?? n[i],
          settled: !1
        });
    }
  }
  _collectNumericProperties(e, n, o, i) {
    for (const [s, l] of Object.entries(e.nodes ?? {})) {
      const a = i.nodes[s];
      if (!a)
        continue;
      const c = l.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = a.position?.x ?? 0, o[`nodes.${s}.position.x`] = c.x), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = a.position?.y ?? 0, o[`nodes.${s}.position.y`] = c.y);
    }
    const r = e.viewport;
    r?.pan?.x !== void 0 && (n["viewport.x"] = i.viewport.x, o["viewport.x"] = r.pan.x), r?.pan?.y !== void 0 && (n["viewport.y"] = i.viewport.y, o["viewport.y"] = r.pan.y), r?.zoom !== void 0 && (n["viewport.zoom"] = i.viewport.zoom, o["viewport.zoom"] = r.zoom);
  }
  _rehydrateAnim(e) {
    if (e._motion = e.motion, e.type === "eased") {
      e._easingFn = Gn(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
      return;
    }
    if (e.integratorState) {
      e._physicsStates = /* @__PURE__ */ new Map();
      for (const [n, o] of Object.entries(e.integratorState))
        e._physicsStates.set(n, {
          value: o.value ?? 0,
          velocity: o.velocity ?? 0,
          target: o.target ?? 0,
          settled: o.settled ?? !1
        });
    }
  }
  _serializeAnim(e) {
    const n = {};
    if (e._physicsStates)
      for (const [o, i] of e._physicsStates)
        n[o] = {
          velocity: i.velocity,
          value: i.value,
          target: i.target,
          settled: i.settled
        };
    return ye({
      handleId: e.handleId,
      type: e.type,
      targets: e.targets,
      startTime: e.startTime,
      duration: e.duration,
      easing: e.easing,
      motion: e.motion,
      direction: e.direction,
      integratorState: e._physicsStates ? n : e.integratorState,
      currentValues: e.currentValues,
      fromValues: e.fromValues
    });
  }
  _stepAnimation(e, n) {
    e.type === "eased" ? this._stepEased(e, n) : e._physicsStates && this._stepPhysics(e, n);
  }
  _stepEased(e, n) {
    if (!e.duration || !e._easingFn || !e._from)
      return;
    const o = this._virtualTime - e.startTime, i = e.duration > 0 ? Math.min(o / e.duration, 1) : 1, r = e._easingFn(i);
    for (const s of Object.keys(e._from)) {
      const l = e._from[s], a = this._getTargetValue(s, e.targets) ?? l, c = et(l, a, r);
      e.currentValues[s] = c, this._applyValueToState(s, c);
    }
  }
  _stepPhysics(e, n) {
    if (!e._physicsStates || !e._motion)
      return;
    const o = e._motion;
    for (const [i, r] of e._physicsStates)
      if (!r.settled) {
        switch (o.type) {
          case "spring":
            Pr(r, o, n);
            break;
          case "decay":
            gi(r, o, n);
            break;
          case "inertia":
            Mr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            Tr(r, s, a, i), a >= 1 && (r.settled = !0);
            break;
          }
        }
        e.currentValues[i] = r.value, this._applyValueToState(i, r.value);
      }
  }
  _getTargetValue(e, n) {
    const o = e.split(".");
    if (o[0] === "nodes" && o.length >= 4) {
      const i = o[1], r = n.nodes?.[i];
      if (!r)
        return;
      if (o[2] === "position" && o[3] === "x")
        return r.position?.x;
      if (o[2] === "position" && o[3] === "y")
        return r.position?.y;
    }
    if (o[0] === "viewport") {
      const i = n.viewport;
      if (o[1] === "x") return i?.pan?.x;
      if (o[1] === "y") return i?.pan?.y;
      if (o[1] === "zoom") return i?.zoom;
    }
  }
  _applyValueToState(e, n) {
    const o = e.split(".");
    if (o[0] === "nodes" && o.length >= 4) {
      const i = o[1], r = this._state.nodes[i];
      if (!r)
        return;
      r.position || (r.position = { x: 0, y: 0 }), o[2] === "position" && (o[3] === "x" && (r.position.x = n), o[3] === "y" && (r.position.y = n));
      return;
    }
    o[0] === "viewport" && (o[1] === "x" && (this._state.viewport.x = n), o[1] === "y" && (this._state.viewport.y = n), o[1] === "zoom" && (this._state.viewport.zoom = n));
  }
  _isSettled(e) {
    if (e.type === "eased")
      return this._virtualTime - e.startTime >= (e.duration ?? 0);
    if (e._physicsStates) {
      for (const n of e._physicsStates.values())
        if (!n.settled)
          return !1;
      return !0;
    }
    return !0;
  }
}
const Zr = /* @__PURE__ */ new Map();
function _i(t, e) {
  Zr.set(t, e);
}
function Nh(t) {
  return Zr.get(t);
}
function bi(t, e = 20) {
  const n = Object.values(t);
  if (n.length === 0)
    return null;
  let o = 1 / 0, i = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (const l of n) {
    const a = l.position?.x ?? 0, c = l.position?.y ?? 0, d = l.dimensions?.width ?? 150, f = l.dimensions?.height ?? 40;
    o = Math.min(o, a), i = Math.min(i, c), r = Math.max(r, a + d), s = Math.max(s, c + f);
  }
  return o -= e, i -= e, r += e, s += e, { minX: o, minY: i, vbWidth: r - o, vbHeight: s - i };
}
function Kr(t) {
  let e = "";
  for (const n of Object.values(t.edges)) {
    const o = t.nodes[n.source], i = t.nodes[n.target];
    if (!o || !i)
      continue;
    const r = (o.position?.x ?? 0) + (o.dimensions?.width ?? 150) / 2, s = (o.position?.y ?? 0) + (o.dimensions?.height ?? 40) / 2, l = (i.position?.x ?? 0) + (i.dimensions?.width ?? 150) / 2, a = (i.position?.y ?? 0) + (i.dimensions?.height ?? 40) / 2;
    e += `<line x1="${r}" y1="${s}" x2="${l}" y2="${a}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
  }
  return e;
}
const $h = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = bi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += Kr(t);
    for (const d of o) {
      const f = d.position?.x ?? 0, u = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${f}" y="${u}" width="${h}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Ih = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = bi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const f = t.nodes[d.source], u = t.nodes[d.target];
      if (!f || !u)
        continue;
      const h = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, g = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2, p = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, y = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${g}" x2="${p}" y2="${y}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const f = d.position?.x ?? 0, u = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${f}" y="${u}" width="${h}" height="${g}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Dh = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = bi(t.nodes);
    if (!r)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const s = /* @__PURE__ */ new Set();
    if (o) {
      for (const u of o)
        if (u.targets?.nodes)
          for (const h of Object.keys(u.targets.nodes))
            s.add(h);
    }
    const { minX: l, minY: a, vbWidth: c, vbHeight: d } = r;
    let f = `<svg width="${e}" height="${n}" viewBox="${l} ${a} ${c} ${d}" xmlns="http://www.w3.org/2000/svg">`;
    f += Kr(t);
    for (const u of i) {
      const h = u.position?.x ?? 0, g = u.position?.y ?? 0, p = u.dimensions?.width ?? 150, y = u.dimensions?.height ?? 40;
      s.has(u.id ?? "") ? f += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : f += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return f += "</svg>", f;
  }
};
_i("faithful", $h);
_i("outline", Ih);
_i("activity", Dh);
function Qo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function ei(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Rh(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Gr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Gr(t[e]);
  }
  return t;
}
class xi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Gr(ye(e.initialState)), this.events = Object.freeze(ye(e.events)), this.checkpoints = Object.freeze(ye(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: ye(this.initialState),
      events: ye(this.events),
      checkpoints: ye(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > Go)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Go}). Please update AlpineFlow to replay this recording.`
      );
    return new xi(e);
  }
  /**
   * Returns unique subjects (nodes, edges, timelines, particles) that appeared
   * during the recording, with their first-seen and last-seen timestamps.
   */
  getSubjects() {
    const e = /* @__PURE__ */ new Map(), n = (o, i, r) => {
      const s = `${o}:${i}`, l = e.get(s);
      l ? (r < l.firstSeenT && (l.firstSeenT = r), r > l.lastSeenT && (l.lastSeenT = r)) : e.set(s, { kind: o, id: i, firstSeenT: r, lastSeenT: r });
    };
    for (const o of Object.keys(this.initialState.nodes))
      n("node", o, 0);
    for (const o of Object.keys(this.initialState.edges))
      n("edge", o, 0);
    for (const o of this.events) {
      const { t: i, type: r, args: s } = o;
      switch (r) {
        case "animate":
        case "update":
          for (const l of Object.keys(s.targets?.nodes ?? {}))
            n("node", l, i);
          for (const l of Object.keys(s.targets?.edges ?? {}))
            n("edge", l, i);
          break;
        case "particle":
        case "particle-burst":
          s.edgeId && n("edge", s.edgeId, i);
          break;
        case "particle-between":
          s.source && n("node", s.source, i), s.target && n("node", s.target, i);
          break;
        case "converging":
          if (Array.isArray(s.sources))
            for (const l of s.sources)
              n("edge", l, i);
          s.options?.targetNodeId && n("node", s.options.targetNodeId, i);
          break;
        case "node-add":
        case "node-remove":
          if (s.id && n("node", s.id, i), Array.isArray(s.nodes))
            for (const l of s.nodes)
              l.id && n("node", l.id, i);
          break;
        case "edge-add":
        case "edge-remove":
          if (s.id && n("edge", s.id, i), Array.isArray(s.edges))
            for (const l of s.edges)
              l.id && n("edge", l.id, i);
          break;
      }
    }
    return Array.from(e.values());
  }
  /**
   * Returns activity spans for a specific subject identified by `id`.
   */
  getActivityFor(e) {
    const n = [];
    for (const o of this.events) {
      const { t: i, type: r, args: s } = o;
      if ((() => {
        switch (r) {
          case "animate":
          case "update":
            return e in (s.targets?.nodes ?? {}) || e in (s.targets?.edges ?? {});
          case "particle":
          case "particle-burst":
            return s.edgeId === e;
          case "particle-between":
            return s.source === e || s.target === e;
          case "converging":
            return Array.isArray(s.sources) && s.sources.includes(e) || s.options?.targetNodeId === e;
          case "node-add":
          case "node-remove":
            return !!(s.id === e || Array.isArray(s.nodes) && s.nodes.some((a) => a.id === e));
          case "edge-add":
          case "edge-remove":
            return !!(s.id === e || Array.isArray(s.edges) && s.edges.some((a) => a.id === e));
          default:
            return !1;
        }
      })())
        switch (r) {
          case "animate": {
            const a = s.options?.duration ?? 0;
            n.push({ startT: i, endT: i + a, reason: "animate" });
            break;
          }
          case "particle":
          case "particle-burst":
          case "particle-between": {
            const a = s.options?.duration ?? s.duration ?? 1;
            n.push({ startT: i, endT: i + a, reason: r });
            break;
          }
          case "converging": {
            const a = s.options?.duration ?? 1;
            n.push({ startT: i, endT: i + a, reason: "converging" });
            break;
          }
          default:
            n.push({ startT: i, endT: i + 1, reason: r });
            break;
        }
    }
    return n;
  }
  /**
   * Returns sample points for a property's value over time, sampled from checkpoints.
   * `path` uses dot notation, e.g. `'nodes.trigger.position.x'`.
   */
  getValueTrack(e) {
    const n = [];
    for (const o of this.checkpoints) {
      const i = Rh(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new sn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const l = Jo * 1e3;
    let a = o ? Qo(r, i) : ei(r, i);
    for (; s < e; ) {
      const c = Math.min(s + l, e);
      for (; a < r.length && r[a].t <= c; )
        n.applyEvent(r[a]), a++;
      const d = (c - s) / 1e3;
      n.advance(d), s = c;
    }
    return n.getState();
  }
  /**
   * Renders a thumbnail SVG snapshot of the canvas state at virtual time `t`.
   */
  renderThumbnailAt(e, n) {
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Nh(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Fh {
  constructor(e, n = {}) {
    this._events = [], this._checkpoints = [], this._startTime = 0, this._originalMethods = {}, this._checkpointTimer = null, this._eventCounter = 0, this._activeAnims = /* @__PURE__ */ new Map(), this._canvas = e, this._checkpointInterval = n.checkpointInterval ?? 500, this._maxDuration = n.maxDuration ?? 6e4;
  }
  async record(e, n) {
    this._startTime = performance.now();
    const o = this._captureSnapshot();
    this._installHooks(), this._scheduleCheckpoints();
    try {
      const r = e();
      if (r instanceof Promise && await r, this._virtualNow() > this._maxDuration)
        throw new Error(`[AlpineFlow] Recording exceeded maxDuration (${this._maxDuration}ms)`);
    } finally {
      this._uninstallHooks(), this._checkpointTimer !== null && (clearInterval(this._checkpointTimer), this._checkpointTimer = null);
    }
    this._captureCheckpoint(), this._activeAnims.clear();
    const i = {
      version: Go,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new xi(i);
  }
  _virtualNow() {
    return performance.now() - this._startTime;
  }
  _recordEvent(e, n) {
    this._events.push({
      t: this._virtualNow(),
      type: e,
      args: this._sanitizeArgs(n)
    });
  }
  /** Strip non-serializable values (functions, etc.) and log warnings. */
  _sanitizeArgs(e) {
    const n = {};
    for (const [o, i] of Object.entries(e)) {
      if (typeof i == "function") {
        console.warn(`[AlpineFlow recorder] Stripped non-serializable option "${o}" (function)`);
        continue;
      }
      i && typeof i == "object" ? n[o] = this._sanitizeNested(i) : n[o] = i;
    }
    return n;
  }
  _sanitizeNested(e) {
    if (e === null || typeof e != "object")
      return e;
    if (Array.isArray(e))
      return e.map((o) => this._sanitizeNested(o));
    const n = {};
    for (const [o, i] of Object.entries(e)) {
      if (typeof i == "function") {
        console.warn(`[AlpineFlow recorder] Stripped nested function at key "${o}"`);
        continue;
      }
      n[o] = this._sanitizeNested(i);
    }
    return n;
  }
  /**
   * Capture the live canvas values that an animate()/update() call is about
   * to transition FROM. Keys are the same flat form VirtualEngine uses
   * (e.g. `nodes.n.position.x`) so rehydration can lerp correctly.
   */
  _snapshotFromValues(e) {
    const n = {}, o = e?.nodes ?? {}, i = /* @__PURE__ */ new Map();
    for (const s of this._canvas.nodes ?? [])
      s && typeof s == "object" && "id" in s && i.set(s.id, s);
    for (const [s, l] of Object.entries(o)) {
      const a = i.get(s);
      if (!a) continue;
      const c = l.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = a.position?.x ?? 0), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = a.position?.y ?? 0);
    }
    const r = e?.viewport;
    return r?.pan?.x !== void 0 && (n["viewport.x"] = this._canvas.viewport.x), r?.pan?.y !== void 0 && (n["viewport.y"] = this._canvas.viewport.y), r?.zoom !== void 0 && (n["viewport.zoom"] = this._canvas.viewport.zoom), n;
  }
  _captureSnapshot() {
    const e = {};
    for (const o of this._canvas.nodes ?? [])
      o && typeof o == "object" && "id" in o && (e[o.id] = ye(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = ye(o));
    return {
      nodes: e,
      edges: n,
      viewport: { ...this._canvas.viewport }
    };
  }
  _captureCheckpoint() {
    this._checkpoints.push({
      t: this._virtualNow(),
      canvas: this._captureSnapshot(),
      inFlight: this._captureInFlight(),
      tagRegistry: {}
    });
  }
  /**
   * Serialize the current in-flight animations tracked by this recorder into
   * the InFlightAnimation shape the VirtualEngine can restore from.
   * Draws data from each ActiveAnim entry's original event args + the handle's
   * live state. Finished handles are skipped (the finished promise cleanup
   * typically runs before this, but we defend anyway).
   */
  _captureInFlight() {
    const e = [];
    for (const n of this._activeAnims.values()) {
      if (n.handle?.isFinished) continue;
      const o = n.options ?? {}, i = !!o.motion;
      let r = "eased";
      if (i) {
        const a = o.motion;
        typeof a == "string" ? r = a.split(".")[0] : a && typeof a == "object" && a.type && (r = a.type);
      }
      let s = {};
      const l = n.handle?.currentValue;
      l && typeof l.forEach == "function" && l.forEach((a, c) => {
        s[c] = a;
      }), e.push({
        handleId: n.handleId,
        type: r,
        targets: ye(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? ye(o.motion) : void 0,
        direction: n.handle?.direction ?? "forward",
        currentValues: s,
        fromValues: { ...n.fromValues },
        // integratorState populated if/when handles expose physics state.
        // For now, scrubbing into mid-physics relies on rehydration via
        // walk-forward from the nearest event; direct physics state
        // capture is a planned follow-up for perfect fidelity.
        integratorState: void 0
      });
    }
    return e;
  }
  _scheduleCheckpoints() {
    this._checkpointTimer = setInterval(() => {
      this._captureCheckpoint();
    }, this._checkpointInterval);
  }
  _installHooks() {
    const e = (o, i, r) => {
      const s = this._canvas[o];
      typeof s == "function" && (this._originalMethods[o] = s, this._canvas[o] = (...l) => {
        const a = r ? r(...l) : { args: l };
        return this._recordEvent(i, a), s.apply(this._canvas, l);
      });
    }, n = (o, i) => {
      const r = this._canvas[o];
      typeof r == "function" && (this._originalMethods[o] = r, this._canvas[o] = (s, l) => {
        const a = `rec-${++this._eventCounter}`, c = this._virtualNow(), d = this._snapshotFromValues(s);
        this._recordEvent(i, { targets: s, options: l, handleId: a });
        const f = r.apply(this._canvas, [s, l]);
        if (f && typeof f == "object" && f.finished && !f.isFinished) {
          const u = { handleId: a, eventT: c, targets: s, options: l, handle: f, fromValues: d };
          this._activeAnims.set(a, u), f.finished.then(() => {
            this._activeAnims.delete(a);
          }).catch(() => {
            this._activeAnims.delete(a);
          });
        }
        return f;
      });
    };
    n("animate", "animate"), n("update", "update"), e("sendParticle", "particle", (o, i) => ({ edgeId: o, options: i })), e("sendParticleAlongPath", "particle-along-path", (o, i) => ({ path: o, options: i })), e("sendParticleBetween", "particle-between", (o, i, r) => ({ source: o, target: i, options: r })), e("sendParticleBurst", "particle-burst", (o, i) => ({ edgeId: o, options: i })), e("sendConverging", "converging", (o, i) => ({ sources: o, options: i })), e("addNodes", "node-add", (o) => ({ nodes: o })), e("removeNodes", "node-remove", (o) => ({ ids: o })), e("addEdges", "edge-add", (o) => ({ edges: o })), e("removeEdges", "edge-remove", (o) => ({ ids: o }));
  }
  _uninstallHooks() {
    for (const [e, n] of Object.entries(this._originalMethods))
      this._canvas[e] = n;
    this._originalMethods = {};
  }
}
class Hh {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new sn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
      this._resolveFinished = i;
    }), o.paused ? this._state = "paused" : this._speed !== 0 && this.play();
  }
  get duration() {
    return this.recording.duration;
  }
  get currentTime() {
    return this._currentTime;
  }
  get state() {
    return this._state;
  }
  get direction() {
    return this._direction;
  }
  get speed() {
    return this._speed;
  }
  set speed(e) {
    this._speed = e, this._direction = e < 0 ? "backward" : "forward";
  }
  play() {
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = So(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new sn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
  }
  scrubTo(e) {
    const n = this._resolveTarget(e);
    this._currentTime = n, this._seekEngineTo(n), this._applyStateToCanvas(this._virtualEngine.getState());
  }
  seek(e) {
    this.scrubTo(e);
  }
  eventsUpTo(e) {
    return this.recording.events.filter((n) => n.t <= e);
  }
  getStateAt(e) {
    const n = this._findNearestCheckpoint(e), o = new sn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const l = Jo * 1e3;
    let a = n ? Qo(r, i) : ei(r, i);
    for (; s < e; ) {
      const c = Math.min(s + l, e);
      for (; a < r.length && r[a].t <= c; )
        o.applyEvent(r[a]), a++;
      const d = (c - s) / 1e3;
      d > 0 && o.advance(d), s = c;
    }
    return o.getState();
  }
  // ── Private ─────────────────────────────────────────────────────────────
  _tick() {
    if (this._state !== "playing")
      return;
    const e = So(), n = (e - this._lastWallTime) / 1e3;
    this._lastWallTime = e;
    const o = n * this._speed * 1e3, i = this._currentTime + o;
    if (this._direction === "forward" ? i >= this._to : i <= this._from) {
      const s = this._direction === "forward" ? this._to : this._from;
      this._direction === "forward" ? this._walkTo(this._currentTime, s, !0) : this._seekEngineTo(s), this._currentTime = s, this._applyStateToCanvas(this._virtualEngine.getState()), this._handleEnd();
      return;
    }
    o > 0 ? this._walkTo(this._currentTime, i, !0) : o < 0 && this._seekEngineTo(i), this._currentTime = i, this._applyStateToCanvas(this._virtualEngine.getState()), this._scheduleTick();
  }
  _scheduleTick() {
    typeof requestAnimationFrame == "function" ? this._rafHandle = requestAnimationFrame(() => this._tick()) : this._rafHandle = setTimeout(() => this._tick(), 16);
  }
  _cancelTick() {
    this._rafHandle !== null && (typeof cancelAnimationFrame == "function" ? cancelAnimationFrame(this._rafHandle) : clearTimeout(this._rafHandle), this._rafHandle = null);
  }
  /**
   * Reset the virtual engine to reflect the canvas state at virtual time `t`
   * — either by restoring the nearest checkpoint and walking forward, or by
   * walking from the recording's initial state. Used when seeking discretely
   * (play-after-ended, loop restart, constructor with non-zero `from`);
   * scrubTo has its own inlined copy because it also updates `_currentTime`.
   */
  _seekEngineTo(e) {
    const n = this._findNearestCheckpoint(e);
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new sn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = Jo * 1e3;
    let l = e === 0 ? ei(i, 0) : Qo(i, e);
    for (; r < n; ) {
      const a = Math.min(r + s, n);
      for (; l < i.length && i[l].t <= a; ) {
        const d = i[l];
        this._virtualEngine.applyEvent(d), o && this._dispatchLiveParticle(d), l++;
      }
      const c = (a - r) / 1e3;
      c > 0 && this._virtualEngine.advance(c), r = a;
    }
  }
  /**
   * Forward a captured particle event to the live canvas so its visual
   * effect replays. Non-particle events (animate, update, structural) are
   * already driven by `_applyStateToCanvas` via the virtual engine's state
   * — particles are the one event class that only exists as a visual and
   * therefore must be re-emitted on the real canvas.
   */
  _dispatchLiveParticle(e) {
    const n = this._canvas;
    switch (e.type) {
      case "particle":
        n.sendParticle?.(e.args.edgeId, e.args.options);
        break;
      case "particle-along-path":
        n.sendParticleAlongPath?.(e.args.path, e.args.options);
        break;
      case "particle-between":
        n.sendParticleBetween?.(e.args.source, e.args.target, e.args.options);
        break;
      case "particle-burst":
        n.sendParticleBurst?.(e.args.edgeId, e.args.options);
        break;
      case "converging":
        n.sendConverging?.(e.args.sources, e.args.options);
        break;
    }
  }
  _findNearestCheckpoint(e) {
    let n = null;
    for (const o of this.recording.checkpoints)
      o.t <= e && (!n || o.t > n.t) && (n = o);
    return n;
  }
  _resolveTarget(e) {
    const n = Math.min(this._from, this._to), o = Math.max(this._from, this._to);
    if (typeof e == "number")
      return Math.max(n, Math.min(o, e));
    if (e === "start")
      return this._from;
    if (e === "end")
      return this._to;
    if (e.endsWith("%")) {
      const r = parseFloat(e) / 100;
      return this._from + r * (this._to - this._from);
    }
    const i = parseFloat(e);
    return Number.isNaN(i) ? this._from : Math.max(n, Math.min(o, i));
  }
  _handleEnd() {
    if (this._loop) {
      const e = typeof this._loop == "number" ? this._loop - 1 : 1 / 0;
      if (e > 0) {
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = So(), this._scheduleTick();
        return;
      }
    }
    this._state = "ended", this._rafHandle = null, this._resolveFinished();
  }
  _applyStateToCanvas(e) {
    this._reconcileNodes(e), this._reconcileEdges(e);
    for (const [n, o] of Object.entries(e.nodes)) {
      const i = this._canvas.nodes.find((r) => r.id === n);
      i && o.position && (i.position || (i.position = { x: 0, y: 0 }), o.position.x !== void 0 && (i.position.x = o.position.x), o.position.y !== void 0 && (i.position.y = o.position.y));
    }
    e.viewport && (this._canvas.viewport.x = e.viewport.x, this._canvas.viewport.y = e.viewport.y, this._canvas.viewport.zoom = e.viewport.zoom);
  }
  /**
   * Diff virtual vs. real node sets and apply structural changes. Prefers
   * the canvas's own addNodes/removeNodes when available so reactivity and
   * measurement hooks fire; falls back to direct array mutation otherwise.
   */
  _reconcileNodes(e) {
    const n = new Set(Object.keys(e.nodes)), o = new Set(this._canvas.nodes.map((s) => s?.id).filter(Boolean)), i = [];
    for (const s of n)
      o.has(s) || i.push(e.nodes[s]);
    const r = [];
    for (const s of o)
      n.has(s) || r.push(s);
    if (i.length > 0 && (typeof this._canvas.addNodes == "function" ? this._canvas.addNodes(i) : this._canvas.nodes.push(...i)), r.length > 0)
      if (typeof this._canvas.removeNodes == "function")
        this._canvas.removeNodes(r);
      else
        for (const s of r) {
          const l = this._canvas.nodes.findIndex((a) => a?.id === s);
          l !== -1 && this._canvas.nodes.splice(l, 1);
        }
  }
  _reconcileEdges(e) {
    const n = new Set(Object.keys(e.edges)), o = new Set(this._canvas.edges.map((s) => s?.id).filter(Boolean)), i = [];
    for (const s of n)
      o.has(s) || i.push(e.edges[s]);
    const r = [];
    for (const s of o)
      n.has(s) || r.push(s);
    if (i.length > 0 && (typeof this._canvas.addEdges == "function" ? this._canvas.addEdges(i) : this._canvas.edges.push(...i)), r.length > 0)
      if (typeof this._canvas.removeEdges == "function")
        this._canvas.removeEdges(r);
      else
        for (const s of r) {
          const l = this._canvas.edges.findIndex((a) => a?.id === s);
          l !== -1 && this._canvas.edges.splice(l, 1);
        }
  }
}
function So() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Oh(t) {
  const e = Th(t);
  return {
    // ── Internal: Sync animation lock state ───────────────────────────────
    /**
     * Synchronize the `_animationLocked` flag from active timelines and
     * manage history suspension while any timeline is playing.
     */
    _syncAnimationState() {
      const n = [...t._activeTimelines].some((o) => o.locked);
      t._animationLocked = n, t._activeTimelines.size === 0 ? t._resumeHistory() : t._suspendHistory();
    },
    // ── Timeline factory ──────────────────────────────────────────────────
    /**
     * Create a new FlowTimeline wired to this canvas. Lock flag and
     * history suspension are automatically managed via timeline events.
     */
    timeline() {
      const n = new vi(t, Kn);
      n.on("play", () => {
        t._activeTimelines.add(n), t._syncAnimationState();
      }), n.on("resume", () => {
        t._activeTimelines.add(n), t._syncAnimationState();
      });
      for (const o of ["pause", "stop", "complete"])
        n.on(o, () => {
          t._activeTimelines.delete(n), t._syncAnimationState();
        });
      return n;
    },
    // ── Named animation registry ──────────────────────────────────────────
    /**
     * Register a named animation (used by x-flow-animate directive).
     */
    registerAnimation(n, o) {
      t._animationRegistry.set(n, o);
    },
    /**
     * Unregister a named animation.
     */
    unregisterAnimation(n) {
      t._animationRegistry.delete(n);
    },
    /**
     * Play a named animation registered via x-flow-animate directive.
     */
    async playAnimation(n) {
      const o = t._animationRegistry.get(n);
      if (!o) {
        q("animation", `Named animation "${n}" not found`);
        return;
      }
      const i = t.timeline();
      for (const r of o)
        r.parallel ? i.parallel(r.parallel) : i.step(r);
      await i.play();
    },
    // ── Core update/animate API ─────────────────────────────────────────
    /**
     * Update nodes, edges, and/or the viewport.
     *
     * The core method for applying property changes. When duration is 0
     * (the default), changes are applied instantly via DOM flushing.
     * When duration > 0, transitions are delegated to the Animator for
     * frame-by-frame interpolation.
     *
     * Use `animate()` for a convenience wrapper that defaults to smooth
     * transitions (duration: 300ms).
     */
    update(n, o = {}) {
      if (o?.boundTo) {
        const h = o.boundTo;
        "node" in h ? o = {
          ...o,
          while: () => t.getNode(h.node)?.[h.property] === h.equals
        } : "edge" in h && (o = {
          ...o,
          while: () => t.getEdge(h.edge)?.[h.property] === h.equals
        });
      }
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), c = n.nodes ? Object.keys(n.nodes).length : 0, d = n.edges ? Object.keys(n.edges).length : 0;
      if (q("animate", "update() called", {
        nodes: c,
        edges: d,
        viewport: !!n.viewport,
        duration: i,
        easing: o.easing ?? "default",
        instant: i === 0
      }), n.nodes)
        for (const [h, g] of Object.entries(n.nodes)) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.followPath && !m) {
            let x = null;
            typeof g.followPath == "function" ? x = g.followPath : x = wi(g.followPath);
            let k = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const v = t.getEdgeSvgElement?.();
              v && (k = document.createElementNS("http://www.w3.org/2000/svg", "path"), k.setAttribute("d", g.followPath), k.classList.add("flow-guide-path"), g.guidePath.class && k.classList.add(g.guidePath.class), v.appendChild(k));
            }
            if (x) {
              const v = x, A = k, S = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (P) => {
                  const $ = t._nodeMap.get(h);
                  if (!$) return;
                  const b = v(P);
                  Le().raw($).position.x = b.x, Le().raw($).position.y = b.y, s.add(h), P >= 1 && A && S && A.remove();
                }
              });
            }
          } else if (g.position) {
            const k = Le().raw(p).position;
            if (g.position.x !== void 0) {
              const v = g.position.x;
              if (m)
                k.x = v;
              else {
                const A = k.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: A,
                  to: v,
                  apply: (S) => {
                    const P = t._nodeMap.get(h);
                    P && (Le().raw(P).position.x = S, s.add(h));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const v = g.position.y;
              if (m)
                k.y = v;
              else {
                const A = k.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: A,
                  to: v,
                  apply: (S) => {
                    const P = t._nodeMap.get(h);
                    P && (Le().raw(P).position.y = S), s.add(h);
                  }
                });
              }
            }
            m && s.add(h);
          }
          if (g.data !== void 0 && Object.assign(p.data, g.data), g.class !== void 0 && (p.class = g.class), g.selected !== void 0 && (p.selected = g.selected), g.zIndex !== void 0 && (p.zIndex = g.zIndex), g.style !== void 0)
            if (m)
              p.style = g.style, l.add(h);
            else {
              const x = mn(p.style || {}), k = mn(g.style), v = t._nodeElements.get(h);
              if (v) {
                const A = getComputedStyle(v);
                for (const S of Object.keys(k))
                  x[S] === void 0 && (x[S] = A.getPropertyValue(S));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (A) => {
                  const S = t._nodeMap.get(h);
                  S && (Le().raw(S).style = Lr(x, k, A), l.add(h));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (m ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (x) => {
              p.dimensions.width = x;
            }
          })), g.dimensions.height !== void 0 && (p.fixedDimensions = !0, m ? p.dimensions.height = g.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: p.dimensions.height,
            to: g.dimensions.height,
            apply: (x) => {
              p.dimensions.height = x;
            }
          })));
        }
      if (n.edges)
        for (const [h, g] of Object.entries(n.edges)) {
          const p = t._edgeMap.get(h);
          if (!p) continue;
          const m = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              p.color = g.color;
            else if (m)
              p.color = g.color, a.add(h);
            else {
              const x = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || hi;
              r.push({
                key: `edge:${h}:color`,
                from: x,
                to: g.color,
                apply: (k) => {
                  const v = t._edgeMap.get(h);
                  v && (Le().raw(v).color = k, a.add(h));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (m)
              p.strokeWidth = g.strokeWidth, a.add(h);
            else {
              const x = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: x,
                to: g.strokeWidth,
                apply: (k) => {
                  const v = t._edgeMap.get(h);
                  v && (Le().raw(v).strokeWidth = k, a.add(h));
                }
              });
            }
          g.label !== void 0 && (p.label = g.label), g.animated !== void 0 && (p.animated = g.animated), g.class !== void 0 && (p.class = g.class);
        }
      if (n.viewport) {
        const h = n.viewport, p = (h._duration ?? i) === 0, y = t.viewport;
        h.pan?.x !== void 0 && (p ? y.x = h.pan.x : r.push({
          key: "viewport:pan.x",
          from: y.x,
          to: h.pan.x,
          apply: (m) => {
            y.x = m;
          }
        })), h.pan?.y !== void 0 && (p ? y.y = h.pan.y : r.push({
          key: "viewport:pan.y",
          from: y.y,
          to: h.pan.y,
          apply: (m) => {
            y.y = m;
          }
        })), h.zoom !== void 0 && (p ? y.zoom = h.zoom : r.push({
          key: "viewport:zoom",
          from: y.zoom,
          to: h.zoom,
          apply: (m) => {
            y.zoom = m;
          }
        }));
      }
      if (r.length === 0) {
        s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s)), l.size > 0 && t._flushNodeStyles(l), a.size > 0 && t._flushEdgeStyles(a);
        const h = {
          pause: () => {
          },
          resume: () => {
          },
          stop: () => {
          },
          reverse: () => {
          },
          play: () => {
          },
          playForward: () => {
          },
          playBackward: () => {
          },
          restart: () => {
          },
          get direction() {
            return "forward";
          },
          get isFinished() {
            return !0;
          },
          get currentValue() {
            return /* @__PURE__ */ new Map();
          },
          finished: Promise.resolve(),
          _targetNodeIds: n.nodes ? Object.keys(n.nodes) : void 0
        };
        return o.onComplete?.(), h;
      }
      const u = Le().raw(t._animator).animate(r, {
        duration: i,
        easing: o.easing,
        delay: o.delay,
        loop: o.loop,
        startAt: o.startAt,
        while: o.while,
        whileStopMode: o.whileStopMode,
        tag: o.tag,
        tags: o.tags,
        motion: o.motion,
        maxDuration: o.maxDuration,
        onProgress(h) {
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), n.viewport && t._flushViewport(), o.onProgress?.(h);
        },
        onComplete() {
          if (n.nodes)
            for (const [h, g] of Object.entries(n.nodes)) {
              const p = t._nodeMap.get(h);
              if (!p) continue;
              const y = Le().raw(p);
              (g.followPath || g.position?.x !== void 0) && (p.position.x = y.position.x), (g.followPath || g.position?.y !== void 0) && (p.position.y = y.position.y), g.style !== void 0 && (p.style = y.style);
            }
          if (n.edges)
            for (const [h, g] of Object.entries(n.edges)) {
              const p = t._edgeMap.get(h);
              if (!p) continue;
              const y = Le().raw(p);
              g.color !== void 0 && typeof g.color == "string" && (p.color = y.color), g.strokeWidth !== void 0 && (p.strokeWidth = y.strokeWidth);
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), o.onComplete?.();
        }
      });
      return n.nodes && (u._targetNodeIds = Object.keys(n.nodes)), u;
    },
    /**
     * Animate nodes, edges, and/or the viewport with smooth transitions.
     *
     * Convenience wrapper around `update()` that defaults to 300ms duration.
     * Pass `duration: 0` for instant changes, or use `update()` directly.
     *
     * When `respectReducedMotion` is active (via config or OS media query),
     * the effective duration is collapsed to 0 for an instant snap.
     */
    animate(n, o = {}) {
      const i = kr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
      return this.update(n, { ...o, duration: i });
    },
    // ── Follow (viewport tracking) ────────────────────────────────────────
    /**
     * Track a target with the viewport camera. The target can be a node ID,
     * a ParticleHandle, an animation handle, or a static XYPosition.
     * The viewport smoothly follows via engine tick with linear interpolation.
     */
    follow(n, o = {}) {
      t._followHandle && t._followHandle.stop();
      let i;
      const r = new Promise((d) => {
        i = d;
      });
      let s = !1;
      const l = o.zoom, a = Kn.register(() => {
        if (s) return !0;
        let d = null;
        if (typeof n == "string") {
          const y = t._nodeMap.get(n);
          if (y) {
            d = y.parentId ? t.getAbsolutePosition(n) : { ...y.position };
            const m = y.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            y.dimensions && (d.x += y.dimensions.width * (0.5 - m[0]), d.y += y.dimensions.height * (0.5 - m[1]));
          }
        } else if ("_targetNodeIds" in n && n._targetNodeIds?.length) {
          const y = n._targetNodeIds[0], m = t._nodeMap.get(y);
          if (m) {
            d = m.parentId ? t.getAbsolutePosition(y) : { ...m.position };
            const x = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - x[0]), d.y += m.dimensions.height * (0.5 - x[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const y = n.getCurrentPosition();
          if (y)
            d = y;
          else
            return s = !0, a.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const f = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, u = l ?? t.viewport.zoom, h = f.width / 2 - d.x * u, g = f.height / 2 - d.y * u, p = 0.08;
        return t.viewport.x += (h - t.viewport.x) * p, t.viewport.y += (g - t.viewport.y) * p, l && (t.viewport.zoom += (l - t.viewport.zoom) * p), t._flushViewport(), !1;
      });
      return t._followHandle = a, typeof n == "object" && "_targetNodeIds" in n && n.finished && n.finished.then(() => {
        s || (s = !0, a.stop(), t._followHandle = null, i());
      }), {
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
          s = !0, a.stop(), t._followHandle = null, i();
        },
        reverse: () => {
        },
        play: () => {
        },
        playForward: () => {
        },
        playBackward: () => {
        },
        restart: () => {
        },
        get direction() {
          return "forward";
        },
        get isFinished() {
          return s;
        },
        get currentValue() {
          return /* @__PURE__ */ new Map();
        },
        get finished() {
          return r;
        }
      };
    },
    // ── Registry & group helpers ─────────────────────────────────────────
    /**
     * Get all tracked animation handles, optionally filtered by tag.
     */
    getHandles(n) {
      return Le().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      Le().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      Le().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      Le().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new Ah(n, {
        animate: (i, r) => o.animate(i, r),
        update: (i, r) => o.update(i, r),
        sendParticle: (i, r) => o.sendParticle(i, r),
        sendParticleAlongPath: (i, r) => o.sendParticleAlongPath(i, r),
        sendParticleBetween: (i, r, s) => o.sendParticleBetween(i, r, s),
        sendParticleBurst: (i, r) => o.sendParticleBurst(i, r),
        sendConverging: (i, r) => o.sendConverging(i, r),
        timeline: () => o.timeline(),
        getHandles: (i) => o.getHandles(i),
        cancelAll: (i, r) => o.cancelAll(i, r),
        pauseAll: (i) => o.pauseAll(i),
        resumeAll: (i) => o.resumeAll(i)
      });
    },
    /**
     * Create a transaction for grouped rollback of multiple animations.
     */
    transaction(n) {
      const o = Le().raw(t._animator), i = o.beginTransaction();
      i.onAfterRollback?.((r) => {
        const s = /* @__PURE__ */ new Set();
        for (const l of r)
          if (l.startsWith("node:")) {
            const a = l.split(":")[1];
            a && s.add(a);
          }
        s.size > 0 && (t._flushNodePositions(s), t._flushNodeStyles(s), t._refreshEdgePaths(s));
      });
      try {
        const r = n();
        r && typeof r.then == "function" ? r.then(() => o.endTransaction()).catch(() => {
          i.rollback(), o.endTransaction();
        }) : o.endTransaction();
      } catch (r) {
        throw i.rollback(), o.endTransaction(), r;
      }
      return i;
    },
    /**
     * Capture current canvas state. Call restore() to revert.
     */
    snapshot() {
      const n = structuredClone(Le().raw(t.nodes)), o = structuredClone(Le().raw(t.edges)), i = { ...t.viewport };
      return {
        restore: () => {
          t.nodes.splice(0, t.nodes.length, ...structuredClone(n)), t.edges.splice(0, t.edges.length, ...structuredClone(o)), Object.assign(t.viewport, i);
        }
      };
    },
    // ── Record & Replay ───────────────────────────────────────────────────
    /**
     * Record canvas animation events during `fn()` execution.
     * Returns a `Recording` that can be passed to `replay()`.
     */
    record(n, o) {
      const i = this, r = i.animate, s = i.update, l = i.sendParticle, a = i.sendParticleAlongPath, c = i.sendParticleBetween, d = i.sendParticleBurst, f = i.sendConverging, u = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        animate: (p, y) => {
          const m = i.update;
          i.update = s;
          try {
            return r.call(i, p, y);
          } finally {
            i.update = m;
          }
        },
        update: (p, y) => s.call(i, p, y),
        sendParticle: (p, y) => l.call(i, p, y),
        sendParticleAlongPath: (p, y) => a.call(i, p, y),
        sendParticleBetween: (p, y, m) => c.call(i, p, y, m),
        sendParticleBurst: (p, y) => d.call(i, p, y),
        sendConverging: (p, y) => f.call(i, p, y),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, h = new Fh(u, o), g = async () => {
        i.animate = (...p) => u.animate(...p), i.update = (...p) => u.update(...p), i.sendParticle = (...p) => u.sendParticle(...p), i.sendParticleAlongPath = (...p) => u.sendParticleAlongPath(...p), i.sendParticleBetween = (...p) => u.sendParticleBetween(...p), i.sendParticleBurst = (...p) => u.sendParticleBurst(...p), i.sendConverging = (...p) => u.sendConverging(...p);
        try {
          const p = n();
          p instanceof Promise && await p;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = l, i.sendParticleAlongPath = a, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = f;
        }
      };
      return h.record(g, o?.captureMetadata);
    },
    /**
     * Replay a previously recorded `Recording` on this canvas.
     * Returns a `ReplayHandle` with play/pause/stop/scrub controls.
     */
    replay(n, o) {
      const i = this, r = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        addNodes: (s) => i.addNodes(s),
        removeNodes: (s) => i.removeNodes(s),
        addEdges: (s) => i.addEdges(s),
        removeEdges: (s) => i.removeEdges(s),
        sendParticle: (s, l) => i.sendParticle(s, l),
        sendParticleAlongPath: (s, l) => i.sendParticleAlongPath(s, l),
        sendParticleBetween: (s, l, a) => i.sendParticleBetween(s, l, a),
        sendParticleBurst: (s, l) => i.sendParticleBurst(s, l),
        sendConverging: (s, l) => i.sendConverging(s, l)
      };
      return new Hh(r, n, o);
    },
    // ── Cleanup lifecycle ─────────────────────────────────────────────────
    /**
     * Stop all in-flight animations, particles, and timelines.
     * Called by the canvas destroy() lifecycle hook when the element is
     * removed from the DOM.
     */
    destroy() {
      t._animator && t._animator.stopAll(), e.destroyParticles();
      for (const n of t._activeTimelines)
        n.stop();
      t._activeTimelines.clear();
    },
    // ── Particle renderer registry ────────────────────────────────────────
    /**
     * Register a custom particle renderer by name. Once registered, pass
     * `renderer: 'your-name'` in any `sendParticle*` options to use it.
     */
    registerParticleRenderer(n, o) {
      Ut(n, o);
    },
    // ── Particle system (delegated to canvas-particles sub-mixin) ────────
    _tickParticles: e._tickParticles,
    sendParticle: e.sendParticle,
    sendParticleAlongPath: e.sendParticleAlongPath,
    sendParticleBetween: e.sendParticleBetween,
    sendParticleBurst: e.sendParticleBurst,
    sendConverging: e.sendConverging,
    destroyParticles: e.destroyParticles
  };
}
function ws(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return ht(t, e);
  const r = /* @__PURE__ */ new Set(), s = jo(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = jo(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function zh(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function ko(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function vs(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = ht(r.id, e);
        for (const l of s)
          i.add(l);
      }
  }
  for (const r of e)
    if (n.targetPositions.has(r.id)) {
      const s = n.targetPositions.get(r.id);
      r.position = { ...s }, i.has(r.id) || (r.hidden = !1);
    }
}
function Lo(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Vh(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Nn = { width: 150, height: 50 };
function Bh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = ws(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      q("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = zh(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? Nn, d = r && s ? s : c, f = {};
        for (const [h] of a.targetPositions) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const p = g.dimensions ?? Nn;
          let y, m;
          g.parentId === e ? (y = (d.width - p.width) / 2, m = (d.height - p.height) / 2) : (y = o.position.x + (d.width - p.width) / 2, m = o.position.y + (d.height - p.height) / 2), f[h] = {
            position: { x: y, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (f[e] = { dimensions: s });
        const u = [];
        for (const h of t.edges)
          if (i.has(h.source) || i.has(h.target)) {
            const g = t.getEdgeElement?.(h.id)?.closest("svg");
            g && u.push(g);
          }
        t.animate ? t.animate({ nodes: f }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (h) => {
            const g = String(1 - h);
            for (const p of u) p.style.opacity = g;
          },
          onComplete: () => {
            for (const h of u) h.style.opacity = "";
            ko(o, t.nodes, a, s), a.reroutedEdges = Lo(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (ko(o, t.nodes, a, s), a.reroutedEdges = Lo(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        ko(o, t.nodes, a, s), a.reroutedEdges = Lo(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      q("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && Vh(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? Nn;
        vs(o, t.nodes, i, r);
        const a = {};
        for (const [f, u] of i.targetPositions) {
          const h = t._nodeMap.get(f);
          if (h && !h.hidden) {
            const g = h.dimensions ?? Nn;
            let p, y;
            h.parentId === e ? (p = (l.width - g.width) / 2, y = (l.height - g.height) / 2) : (p = o.position.x + (l.width - g.width) / 2, y = o.position.y + (l.height - g.height) / 2), h.position = { x: p, y }, h.style = { ...h.style || {}, opacity: "0" }, a[f] = {
              position: u,
              style: { opacity: "1" }
            };
          }
        }
        const c = new Set(i.targetPositions.keys());
        t._flushNodeStyles(c);
        const d = [];
        for (const f of t.edges)
          if (c.has(f.source) || c.has(f.target)) {
            const u = t.getEdgeElement?.(f.id)?.closest("svg");
            u && (u.style.opacity = "0", d.push(u));
          }
        t.animate ? t.animate({ nodes: a }, {
          duration: 300,
          easing: "easeOut",
          onProgress: (f) => {
            const u = String(f);
            for (const h of d) h.style.opacity = u;
          },
          onComplete: () => {
            for (const f of d) f.style.opacity = "";
            for (const f of c) {
              const u = t._nodeMap.get(f);
              u && typeof u.style == "object" && delete u.style.opacity;
            }
            t._resumeHistory();
          }
        }) : t._resumeHistory(), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
      } else
        vs(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (q("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
    },
    /**
     * Check if a node is collapsed.
     */
    isCollapsed(e) {
      return t._nodeMap.get(e)?.collapsed === !0;
    },
    /**
     * Get the number of nodes that would be hidden when collapsing this node.
     */
    getCollapseTargetCount(e) {
      return ws(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return ht(e, t.nodes).size;
    }
  };
}
function qh(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, q("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, q("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
    },
    /**
     * Toggle condensed state of a node.
     */
    toggleCondense(e) {
      const n = t._nodeMap.get(e);
      n && (n.condensed ? this.uncondenseNode(e) : this.condenseNode(e));
    },
    /**
     * Check if a node is condensed.
     */
    isCondensed(e) {
      return t._nodeMap.get(e)?.condensed === !0;
    }
  };
}
function Xh(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      q("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      q("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    toggleRowSelect(e) {
      t.selectedRows.has(e) ? this.deselectRow(e) : this.selectRow(e);
    },
    getSelectedRows() {
      return [...t.selectedRows];
    },
    isRowSelected(e) {
      return t.selectedRows.has(e);
    },
    deselectAllRows() {
      t.selectedRows.size !== 0 && (q("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, q("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
    },
    getRowFilter(e) {
      return t._nodeMap.get(e)?.rowFilter ?? "all";
    },
    getVisibleRows(e, n) {
      const o = t._nodeMap.get(e);
      if (!o) return n;
      const i = o.rowFilter ?? "all";
      if (i === "all") return n;
      if (typeof i == "function")
        return n.filter(i);
      const r = /* @__PURE__ */ new Set();
      for (const s of t.edges) {
        if (s.sourceHandle?.startsWith(e + ".")) {
          const l = s.sourceHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          l && r.add(l);
        }
        if (s.targetHandle?.startsWith(e + ".")) {
          const l = s.targetHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          l && r.add(l);
        }
      }
      return i === "connected" ? n.filter((s) => r.has(s.id)) : n.filter((s) => !r.has(s.id));
    }
  };
}
const Yh = 8, Wh = 12, jh = 2;
function Ei(t) {
  return {
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Uh(t) {
  if (t.stretch) return t.stretch;
  switch (t.direction) {
    case "vertical":
      return "width";
    case "horizontal":
      return "height";
    case "grid":
      return "both";
  }
}
function Zh(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function _s(t, e, n) {
  const o = e.gap ?? Yh, i = e.padding ?? Wh, r = e.headerHeight ?? 0, s = Uh(e), l = Zh(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, f = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Kh(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? Gh(l, o, i, r, s, f, a, c) : Jh(l, o, i, r, s, e.columns ?? jh, d, f, a, c);
}
function Kh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((u) => Ei(u));
  for (const u of c) a = Math.max(a, u.width);
  const d = r > 0 ? r : a;
  let f = n + o;
  for (let u = 0; u < t.length; u++) {
    const h = t[u], g = c[u];
    s.set(h.id, { x: n, y: f }), (i === "width" || i === "both") && l.set(h.id, { width: d, height: g.height }), f += g.height + e;
  }
  return f -= e, f += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: d + n * 2, height: f }
  };
}
function Gh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((u) => Ei(u));
  for (const u of c) a = Math.max(a, u.height);
  const d = r > 0 ? r : a;
  let f = n;
  for (let u = 0; u < t.length; u++) {
    const h = t[u], g = c[u];
    s.set(h.id, { x: f, y: n + o }), (i === "height" || i === "both") && l.set(h.id, { width: g.width, height: d }), f += g.width + e;
  }
  return f -= e, f += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: f, height: d + n * 2 + o }
  };
}
function Jh(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), f = t.map((m) => Ei(m));
  let u = 0, h = 0;
  for (const m of f)
    u = Math.max(u, m.width), h = Math.max(h, m.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (u = g);
  const p = Math.ceil(t.length / d), y = l > 0 ? (l - (p - 1) * e) / p : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const x = m % d, k = Math.floor(m / d), v = n + x * (u + e), A = n + o + k * (h + e);
    a.set(t[m].id, { x: v, y: A }), i === "both" ? c.set(t[m].id, { width: u, height: h }) : i === "width" ? c.set(t[m].id, { width: u, height: f[m].height }) : i === "height" && c.set(t[m].id, { width: f[m].width, height: h });
  }
  return {
    positions: a,
    dimensions: c,
    parentDimensions: {
      width: d * u + (d - 1) * e + n * 2,
      height: p * h + (p - 1) * e + n * 2 + o
    }
  };
}
function Qh(t) {
  return {
    // ── Auto-layout scheduling ─────────────────────────────────────────────
    /**
     * Debounced trigger for automatic layout.
     *
     * Skips when no autoLayout config is set, dependencies haven't loaded,
     * or the auto-layout has permanently failed.
     */
    _scheduleAutoLayout() {
      const e = t._config.autoLayout;
      !e || !t._autoLayoutReady || t._autoLayoutFailed || (t._autoLayoutTimer && clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = setTimeout(() => {
        t._autoLayoutTimer = null, this._runAutoLayout();
      }, e.debounce ?? 50));
    },
    /**
     * Execute the configured auto-layout algorithm.
     *
     * Delegates to the appropriate layout engine method based on
     * `config.autoLayout.algorithm`. Catches errors and sets
     * `_autoLayoutFailed` to prevent repeated attempts.
     */
    async _runAutoLayout() {
      const e = t._config.autoLayout;
      if (!e) return;
      const n = {
        fitView: e.fitView !== !1,
        duration: e.duration ?? 300
      };
      try {
        switch (e.algorithm) {
          case "dagre":
            this.layout({
              direction: e.direction,
              nodesep: e.nodesep,
              ranksep: e.ranksep,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
          case "force":
            this.forceLayout({
              strength: e.strength,
              distance: e.distance,
              charge: e.charge,
              iterations: e.iterations,
              ...n
            });
            break;
          case "hierarchy":
            this.treeLayout({
              layoutType: e.layoutType,
              nodeWidth: e.nodeWidth,
              nodeHeight: e.nodeHeight,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
          case "elk":
            await this.elkLayout({
              algorithm: e.elkAlgorithm,
              nodeSpacing: e.nodeSpacing,
              layerSpacing: e.layerSpacing,
              adjustHandles: e.adjustHandles,
              ...n
            });
            break;
        }
      } catch (o) {
        t._autoLayoutFailed || (t._warn("AUTO_LAYOUT_FAILED", `autoLayout failed: ${o.message}`), t._autoLayoutFailed = !0);
      }
    },
    // ── Shared layout application ──────────────────────────────────────────
    /**
     * Apply computed layout positions to nodes with optional animation.
     *
     * When duration > 0, delegates to ctx.animate() for smooth transitions.
     * When duration === 0, applies positions directly (instant).
     * Calls `_adjustHandlePositions` when requested, and triggers fitView.
     */
    _applyLayout(e, n) {
      const o = n?.duration ?? 300;
      if (q("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
        duration: o,
        adjustHandles: n?.adjustHandles ?? !1,
        fitView: n?.fitView !== !1
      }), n?.adjustHandles && n.handleDirection && this._adjustHandlePositions(n.handleDirection), o > 0) {
        const i = {};
        for (const [r, s] of e)
          i[r] = { position: s };
        t.animate?.({ nodes: i }, {
          duration: o,
          easing: "easeInOut",
          onComplete: () => {
            n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: o });
          }
        });
      } else {
        for (const i of t.nodes) {
          const r = e.get(i.id);
          r && (i.position || (i.position = { x: 0, y: 0 }), i.position.x = r.x, i.position.y = r.y);
        }
        n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: 0 });
      }
    },
    /**
     * Update handle positions on nodes and DOM elements to match a layout
     * direction (TB, LR, BT, RL, DOWN, RIGHT, UP, LEFT).
     *
     * Skips handles that have an explicit position set via
     * `data-flow-handle-explicit`.
     */
    _adjustHandlePositions(e) {
      const n = {
        TB: { source: "bottom", target: "top" },
        DOWN: { source: "bottom", target: "top" },
        LR: { source: "right", target: "left" },
        RIGHT: { source: "right", target: "left" },
        BT: { source: "top", target: "bottom" },
        UP: { source: "top", target: "bottom" },
        RL: { source: "left", target: "right" },
        LEFT: { source: "left", target: "right" }
      }, o = n[e] ?? n.TB;
      for (const i of t.nodes)
        i.sourcePosition = o.source, i.targetPosition = o.target;
      t._container?.querySelectorAll('[data-flow-handle-type="source"]').forEach((i) => {
        i.dataset.flowHandleExplicit || (i.dataset.flowHandlePosition = o.source);
      }), t._container?.querySelectorAll('[data-flow-handle-type="target"]').forEach((i) => {
        i.dataset.flowHandleExplicit || (i.dataset.flowHandlePosition = o.target);
      });
    },
    // ── Child layout ───────────────────────────────────────────────────────
    /**
     * Compute and apply child layout for a parent node.
     *
     * Recursively lays out nested layout parents bottom-up (unless `shallow`
     * is true). Applies computed positions, dimension overrides with
     * min/max constraint clamping, and auto-sizes the parent.
     */
    /**
     * Compute and apply child layout for a parent node.
     *
     * Supports both the legacy positional signature and a new options object:
     *
     *   layoutChildren(parentId)                          // full layout
     *   layoutChildren(parentId, excludeId, shallow)      // legacy (backward compat)
     *   layoutChildren(parentId, { ... })                 // options object
     *
     * Options:
     *   - excludeId: skip applying position/dimensions but still count in computation
     *   - omitFromComputation: fully remove node from child list (old parent shrinks)
     *   - includeNode: add a virtual child to computation (new parent grows)
     *   - shallow: don't recurse into nested layout children
     *   - stretchedSize: externally-provided size for stretch propagation
     */
    layoutChildren(e, n, o, i) {
      let r;
      typeof n == "string" ? r = { excludeId: n, shallow: o, stretchedSize: i } : r = n ?? {};
      const { excludeId: s, omitFromComputation: l, includeNode: a, shallow: c } = r;
      let { stretchedSize: d } = r;
      const f = t.nodes.find((v) => v.id === e);
      if (!f?.childLayout) return;
      let u = t.nodes.filter((v) => v.parentId === e);
      l && (u = u.filter((v) => v.id !== l)), a && !u.some((v) => v.id === a.id) && (u = [...u, a]);
      const h = new Map(u.map((v) => [v.id, v]));
      if (f.dimensions = void 0, !d && f.maxDimensions && f.maxDimensions.width !== void 0 && f.maxDimensions.height !== void 0 && (d = { width: f.maxDimensions.width, height: f.maxDimensions.height }), !c)
        for (const v of u)
          v.childLayout && this.layoutChildren(v.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const g = f.childLayout, p = g.headerHeight !== void 0 ? g : f.data?.label ? { ...g, headerHeight: 30 } : g, y = _s(u, p, d);
      for (const [v, A] of y.positions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        S && (S.position ? (S.position.x = A.x, S.position.y = A.y) : S.position = { x: A.x, y: A.y });
      }
      for (const [v, A] of y.dimensions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        if (S) {
          let P = A.width, $ = A.height;
          S.minDimensions && (S.minDimensions.width != null && (P = Math.max(P, S.minDimensions.width)), S.minDimensions.height != null && ($ = Math.max($, S.minDimensions.height))), S.maxDimensions && (S.maxDimensions.width != null && (P = Math.min(P, S.maxDimensions.width)), S.maxDimensions.height != null && ($ = Math.min($, S.maxDimensions.height))), S.dimensions ? (S.dimensions.width = P, S.dimensions.height = $) : S.dimensions = { width: P, height: $ }, S.childLayout && !c && this.layoutChildren(v, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: S.dimensions });
        }
      }
      let m = y.parentDimensions.width, x = y.parentDimensions.height;
      if (f.minDimensions && (f.minDimensions.width != null && (m = Math.max(m, f.minDimensions.width)), f.minDimensions.height != null && (x = Math.max(x, f.minDimensions.height))), f.maxDimensions && (f.maxDimensions.width != null && (m = Math.min(m, f.maxDimensions.width)), f.maxDimensions.height != null && (x = Math.min(x, f.maxDimensions.height))), f.dimensions || (f.dimensions = { width: 0, height: 0 }), f.dimensions.width = m, f.dimensions.height = x, m !== y.parentDimensions.width || x !== y.parentDimensions.height) {
        const A = _s(u, p, { width: m, height: x });
        for (const [S, P] of A.positions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const $ = h.get(S);
          $ && ($.position ? ($.position.x = P.x, $.position.y = P.y) : $.position = { x: P.x, y: P.y });
        }
        for (const [S, P] of A.dimensions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const $ = h.get(S);
          if ($) {
            let b = P.width, E = P.height;
            $.minDimensions && ($.minDimensions.width != null && (b = Math.max(b, $.minDimensions.width)), $.minDimensions.height != null && (E = Math.max(E, $.minDimensions.height))), $.maxDimensions && ($.maxDimensions.width != null && (b = Math.min(b, $.maxDimensions.width)), $.maxDimensions.height != null && (E = Math.min(E, $.maxDimensions.height))), $.dimensions ? ($.dimensions.width = b, $.dimensions.height = E) : $.dimensions = { width: b, height: E }, $.childLayout && !c && this.layoutChildren(S, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: $.dimensions });
          }
        }
      }
    },
    /**
     * Walk up from a parent through ancestor layout parents, calling
     * layoutChildren(shallow) at each level so parent resizes propagate
     * through the hierarchy (e.g. Column grows -> Row adjusts -> Step adjusts).
     */
    propagateLayoutUp(e, n) {
      const o = n?.omitFromComputation ? { omitFromComputation: n.omitFromComputation } : void 0;
      let i = t.nodes.find(
        (r) => r.id === e
      )?.parentId;
      for (; i; ) {
        const r = t._nodeMap.get(i);
        if (!r?.childLayout) break;
        this.layoutChildren(i, { ...o, shallow: !0 }), i = r.parentId;
      }
    },
    /**
     * Reorder a child within its layout parent.
     *
     * Reassigns order values for all siblings, then runs layoutChildren
     * and emits a `child-reorder` event.
     */
    reorderChild(e, n) {
      const o = t._nodeMap.get(e);
      if (!o?.parentId || !t._nodeMap.get(o.parentId)?.childLayout) return;
      t._captureHistory();
      const s = t.nodes.filter((a) => a.parentId === o.parentId).sort((a, c) => (a.order ?? 1 / 0) - (c.order ?? 1 / 0)).filter((a) => a.id !== e), l = Math.max(0, Math.min(n, s.length));
      s.splice(l, 0, o);
      for (let a = 0; a < s.length; a++)
        s[a].order = a;
      this.layoutChildren(o.parentId), t._emit("child-reorder", { nodeId: e, parentId: o.parentId, order: l });
    },
    // ── Layout engines ─────────────────────────────────────────────────────
    /**
     * Apply Dagre (directed acyclic graph) layout.
     *
     * Requires the dagre addon to be registered via `Alpine.plugin(AlpineFlowDagre)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    layout(e) {
      const n = At("layout:dagre");
      if (!n)
        throw new Error("layout() requires the dagre plugin. Register it with: Alpine.plugin(AlpineFlowDagre)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = n(i, t.edges, {
        direction: o,
        nodesep: e?.nodesep,
        ranksep: e?.ranksep
      });
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), q("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
    },
    /**
     * Apply force-directed layout.
     *
     * Requires the force addon to be registered via `Alpine.plugin(AlpineFlowForce)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    forceLayout(e) {
      const n = At("layout:force");
      if (!n)
        throw new Error("forceLayout() requires the force plugin. Register it with: Alpine.plugin(AlpineFlowForce)");
      const o = e?.includeChildren ? t.nodes : t.nodes.filter((r) => !r.parentId), i = n(o, t.edges, {
        strength: e?.strength,
        distance: e?.distance,
        charge: e?.charge,
        iterations: e?.iterations,
        center: e?.center
      });
      this._applyLayout(i, {
        fitView: e?.fitView,
        duration: e?.duration
      }), q("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
    },
    /**
     * Apply hierarchy/tree layout.
     *
     * Requires the hierarchy addon to be registered via `Alpine.plugin(AlpineFlowHierarchy)`.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    treeLayout(e) {
      const n = At("layout:hierarchy");
      if (!n)
        throw new Error("treeLayout() requires the hierarchy plugin. Register it with: Alpine.plugin(AlpineFlowHierarchy)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = n(i, t.edges, {
        layoutType: e?.layoutType,
        direction: o,
        nodeWidth: e?.nodeWidth,
        nodeHeight: e?.nodeHeight
      });
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), q("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
    },
    /**
     * Apply ELK (Eclipse Layout Kernel) layout.
     *
     * Requires the elk addon to be registered via `Alpine.plugin(AlpineFlowElk)`.
     * Note: elkLayout is async because ELK's layout() returns a Promise.
     *
     * Nodes with `parentId` are excluded by default — their positions are managed
     * by `childLayout`, not top-level auto-layout. Pass `{ includeChildren: true }`
     * to include them.
     */
    async elkLayout(e) {
      const n = At("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (r.size === 0) {
        q("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), q("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function ep(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return cn(n, t._config.childValidationRules ?? {});
    },
    _recomputeChildValidation() {
      const e = /* @__PURE__ */ new Set(), n = t._config.childValidationRules ?? {};
      for (const o of t.nodes)
        o.parentId && e.add(o.parentId), (o.data?.childValidation || n[o.type ?? "default"]) && e.add(o.id);
      for (const [o] of t._validationErrorCache)
        e.add(o);
      for (const o of e) {
        const i = t.getNode(o);
        if (!i) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const r = cn(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((a) => a.parentId === o), l = hs(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = cn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = hs(n, i, o);
      return { valid: r.length === 0, errors: r };
    },
    validateAll() {
      const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
      for (const o of t.nodes)
        o.parentId && n.add(o.parentId);
      for (const o of n)
        e.set(o, this.validateParent(o));
      return e;
    },
    getValidationErrors(e) {
      return t._validationErrorCache.get(e) ?? [];
    },
    // ── Reparent ─────────────────────────────────────────────────────────
    /**
     * Reparent a node into a new parent (or detach from current parent).
     * Handles position conversion and child validation.
     * Returns true on success, false if validation rejects the operation.
     */
    reparentNode(e, n) {
      const o = t.getNode(e);
      if (!o) return !1;
      const i = o.parentId ?? null;
      if (i === n) return !0;
      if (n === null) {
        if (i) {
          const f = this._getChildValidation(i);
          if (f) {
            const u = t.getNode(i);
            if (u) {
              const h = t.nodes.filter(
                (p) => p.parentId === i
              ), g = io(u, o, h, f);
              if (!g.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: u,
                  child: o,
                  operation: "remove",
                  rule: g.rule,
                  message: g.message
                }), !1;
            }
          }
        }
        t._captureHistory();
        const d = t.getAbsolutePosition(e);
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = pt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
          let f, u = i;
          for (; u; ) {
            const h = t._nodeMap.get(u);
            if (!h) break;
            h.childLayout && (f = u), u = h.parentId;
          }
          f && t.layoutChildren?.(f);
        }
        return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: null }), !0;
      }
      const r = t.getNode(n);
      if (!r || ht(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (u) => u.parentId === n && u.id !== e
        ), f = Yr(r, o, d, s);
        if (!f.valid)
          return t._config.onChildValidationFail && t._config.onChildValidationFail({
            parent: r,
            child: o,
            operation: "add",
            rule: f.rule,
            message: f.message
          }), !1;
      }
      if (i) {
        const d = this._getChildValidation(i);
        if (d) {
          const f = t.getNode(i);
          if (f) {
            const u = t.nodes.filter(
              (g) => g.parentId === i
            ), h = io(f, o, u, d);
            if (!h.valid)
              return t._config.onChildValidationFail && t._config.onChildValidationFail({
                parent: f,
                child: o,
                operation: "remove",
                rule: h.rule,
                message: h.message
              }), !1;
          }
        }
      }
      t._captureHistory();
      const l = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, a = t.getAbsolutePosition(n);
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = pt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
        if (!o.childLayout) {
          const f = t._initialDimensions.get(e);
          o.dimensions = f ? { ...f } : void 0;
        }
        if (o.order == null) {
          const f = t.nodes.filter(
            (u) => u.parentId === n && u.id !== o.id
          );
          o.order = f.length > 0 ? Math.max(...f.map((u) => u.order ?? 0)) + 1 : 0;
        }
      }
      const c = /* @__PURE__ */ new Set();
      for (const d of [n, i]) {
        if (!d) continue;
        let f, u = d;
        for (; u; ) {
          const h = t._nodeMap.get(u);
          if (!h) break;
          h.childLayout && (f = u), u = h.parentId;
        }
        f && c.add(f);
      }
      for (const d of c)
        t.layoutChildren?.(d);
      return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: n }), !0;
    }
  };
}
function tp(t) {
  return {
    registerCompute(e, n) {
      t._computeEngine.registerCompute(e, n);
    },
    compute(e) {
      const n = t._computeEngine.compute(t.nodes, t.edges, e);
      return t._emit("compute-complete", { results: n }), t.$nextTick(() => {
        requestAnimationFrame(() => {
          const o = /* @__PURE__ */ new Set();
          for (const [i] of n) {
            const r = t._nodeElements.get(i), s = t._nodeMap.get(i);
            if (r && s) {
              r.style.width = "", r.style.height = "";
              const l = r.offsetWidth, a = r.offsetHeight;
              (!s.dimensions || l !== s.dimensions.width || a !== s.dimensions.height) && (s.dimensions = { width: l, height: a }, o.add(i)), s.fixedDimensions = !0, r.style.width = l + "px", r.style.height = a + "px";
            }
          }
          o.size > 0 && t._refreshEdgePaths(o);
        });
      }), n;
    }
  };
}
function zn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), l = Math.sin(r), a = t - n, c = e - o;
  return {
    x: n + a * s - c * l,
    y: o + a * l + c * s
  };
}
const ti = 20, $n = ti + 1;
function bs(t) {
  switch (t) {
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    default:
      return { x: 0, y: 1 };
  }
}
function xs(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function np(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Jr(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function Qr(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function op(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const f of i)
    r.add(f.x), r.add(f.x + f.width), s.add(f.y), s.add(f.y + f.height);
  const l = Array.from(r).sort((f, u) => f - u), a = Array.from(s).sort((f, u) => f - u), c = [];
  let d = 0;
  for (const f of l)
    for (const u of a) {
      let h = !1;
      for (const g of i)
        if (np(f, u, g)) {
          h = !0;
          break;
        }
      h || c.push({ x: f, y: u, index: d++ });
    }
  return c;
}
class ip {
  constructor(e) {
    this.dist = e, this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(e) {
    this.items.push(e);
    let n = this.items.length - 1;
    for (; n > 0; ) {
      const o = n - 1 >> 1;
      if (this.dist[this.items[o]] <= this.dist[this.items[n]]) break;
      [this.items[o], this.items[n]] = [this.items[n], this.items[o]], n = o;
    }
  }
  pop() {
    const e = this.items.length;
    if (e === 0) return;
    const n = this.items[0], o = this.items.pop();
    if (e > 1) {
      this.items[0] = o;
      let i = 0;
      for (; ; ) {
        const r = 2 * i + 1, s = r + 1;
        let l = i;
        if (r < this.items.length && this.dist[this.items[r]] < this.dist[this.items[l]] && (l = r), s < this.items.length && this.dist[this.items[s]] < this.dist[this.items[l]] && (l = s), l === i) break;
        [this.items[i], this.items[l]] = [this.items[l], this.items[i]], i = l;
      }
    }
    return n;
  }
}
function sp(t, e) {
  const n = t.map(() => []), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const r of t) {
    let s = o.get(r.x);
    s || (s = [], o.set(r.x, s)), s.push(r);
    let l = i.get(r.y);
    l || (l = [], i.set(r.y, l)), l.push(r);
  }
  for (const r of o.values()) {
    r.sort((s, l) => s.y - l.y);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Qr(l.x, l.y, a.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, l) => s.x - l.x);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Jr(l.x, a.x, l.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  return n;
}
function rp(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i), a = sp(n, o);
  r[t.index] = 0;
  const c = new ip(r);
  for (c.push(t.index); c.size > 0; ) {
    const u = c.pop();
    if (l[u]) continue;
    if (l[u] = 1, u === e.index) break;
    const h = n[u], g = r[u];
    for (const p of a[u]) {
      if (l[p]) continue;
      const y = n[p], m = Math.abs(y.x - h.x) + Math.abs(y.y - h.y), x = g + m;
      x < r[p] && (r[p] = x, s[p] = u, c.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let f = e.index;
  for (; f !== -1; )
    d.unshift(n[f]), f = s[f];
  return d;
}
function ap(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function lp(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function cp(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, l = t[r].y - t[r - 1].y, a = Math.abs(s) + Math.abs(l);
    n.push(a), e += a;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, l = t[r].x + (t[r + 1].x - t[r].x) * s, a = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: l,
        y: a,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
const In = 200;
function dp(t, e, n, o, i) {
  const r = Math.min(t, n) - In, s = Math.max(t, n) + In, l = Math.min(e, o) - In, a = Math.max(e, o) + In;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < a && c.y + c.height > l
  );
}
function up(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (Qr(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Jr(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function fp(t, e, n, o, i, r, s) {
  const l = bs(n), a = bs(r), c = t + l.x * $n, d = e + l.y * $n, f = o + a.x * $n, u = i + a.y * $n, h = (x) => {
    const k = x.map((b) => xs(b, ti)), v = op(c, d, f, u, k);
    v.length;
    const A = v.find((b) => b.x === c && b.y === d), S = v.find((b) => b.x === f && b.y === u);
    A || v.push({ x: c, y: d, index: v.length }), S || v.push({ x: f, y: u, index: v.length });
    const P = A ?? v[v.length - (S ? 1 : 2)], $ = S ?? v[v.length - 1];
    return rp(P, $, v, k);
  }, g = dp(t, e, o, i, s), p = g.length < s.length;
  let y = h(g);
  if (p) {
    const x = s.map((v) => xs(v, ti));
    (!(y !== null && y.length >= 2) || up(y, x)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return ap(m);
}
const hp = 512, st = /* @__PURE__ */ new Map();
function pp(t, e, n, o, i, r, s) {
  let l = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const a of s)
    l += `|${Math.round(a.x)},${Math.round(a.y)},${Math.round(a.width)},${Math.round(a.height)}`;
  return l;
}
function ea(t, e, n, o, i, r, s) {
  const l = pp(t, e, n, o, i, r, s);
  if (st.has(l)) {
    const c = st.get(l);
    return st.delete(l), st.set(l, c), c;
  }
  const a = fp(t, e, n, o, i, r, s);
  return st.set(l, a), st.size > hp && st.delete(st.keys().next().value), a;
}
function gp({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  borderRadius: l = 5
}) {
  if (!s || s.length === 0)
    return yn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const a = ea(t, e, n, o, i, r, s);
  if (!a)
    return yn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const c = lp(a, l), { x: d, y: f, offsetX: u, offsetY: h } = cp(a);
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function ta(t) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return `M${t[0].x},${t[0].y} L${t[1].x},${t[1].y}`;
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 0; n < t.length - 1; n++) {
    const o = t[Math.max(0, n - 1)], i = t[n], r = t[n + 1], s = t[Math.min(t.length - 1, n + 2)], l = i.x + (r.x - o.x) / 6, a = i.y + (r.y - o.y) / 6, c = r.x - (s.x - i.x) / 6, d = r.y - (s.y - i.y) / 6;
    e += ` C${l},${a} ${c},${d} ${r.x},${r.y}`;
  }
  return e;
}
function mp(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, l = t[r].y - t[r - 1].y, a = Math.sqrt(s * s + l * l);
    n.push(a), e += a;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, l = t[r].x + (t[r + 1].x - t[r].x) * s, a = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: l,
        y: a,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
function yp({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return Qn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = ea(t, e, n, o, i, r, s);
  if (!l)
    return Qn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = ta(l), { x: c, y: d, offsetX: f, offsetY: u } = mp(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: f,
    labelOffsetY: u
  };
}
function wp(t) {
  const {
    sourceX: e,
    sourceY: n,
    targetX: o,
    targetY: i,
    controlPoints: r = [],
    pathStyle: s = "bezier",
    borderRadius: l = 5
  } = t, a = [
    { x: e, y: n },
    ...r,
    { x: o, y: i }
  ];
  let c;
  switch (s) {
    case "linear":
      c = Es(a);
      break;
    case "step":
      c = vp(a, 0);
      break;
    case "smoothstep":
      c = _p(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = ta(a.map((u, h) => ({ ...u, index: h })));
      break;
    default:
      c = Es(a);
  }
  const d = bp(a), f = bn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: f.offsetX,
    labelOffsetY: f.offsetY
  };
}
function Es(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function vp(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return na(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function na(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function _p(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return na(t[0], t[1], e);
  const n = [t[0]];
  for (let r = 0; r < t.length - 1; r++) {
    const s = t[r], l = t[r + 1], a = Math.abs(l.x - s.x), c = Math.abs(l.y - s.y);
    if (a < 1 || c < 1)
      n.push(l);
    else {
      const d = (s.x + l.x) / 2;
      n.push({ x: d, y: s.y }), n.push({ x: d, y: l.y }), n.push(l);
    }
  }
  let o = `M${n[0].x},${n[0].y}`;
  for (let r = 1; r < n.length - 1; r++) {
    const s = n[r - 1], l = n[r], a = n[r + 1];
    o += Xt(s.x, s.y, l.x, l.y, a.x, a.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function bp(t) {
  if (t.length < 2) return t[0] ?? { x: 0, y: 0 };
  let e = 0;
  const n = [];
  for (let i = 0; i < t.length - 1; i++) {
    const r = t[i + 1].x - t[i].x, s = t[i + 1].y - t[i].y, l = Math.sqrt(r * r + s * s);
    n.push(l), e += l;
  }
  if (e === 0) return t[0];
  let o = e / 2;
  for (let i = 0; i < n.length; i++) {
    if (o <= n[i]) {
      const r = o / n[i];
      return {
        x: t[i].x + (t[i + 1].x - t[i].x) * r,
        y: t[i].y + (t[i + 1].y - t[i].y) * r
      };
    }
    o -= n[i];
  }
  return t[t.length - 1];
}
function Wt(t, e, n, o) {
  const i = t.dimensions?.width ?? ve, r = t.dimensions?.height ?? _e, s = jt(t, o);
  let l;
  if (t.shape) {
    const a = n?.[t.shape] ?? Br[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = us(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = us(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = zn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function Cs(t) {
  switch (t) {
    case "top-left":
    case "top-right":
      return "top";
    case "bottom-left":
    case "bottom-right":
      return "bottom";
    default:
      return t;
  }
}
function ni(t) {
  const e = Math.SQRT1_2;
  switch (t) {
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "top-left":
      return { x: -e, y: -e };
    case "top-right":
      return { x: e, y: -e };
    case "bottom-left":
      return { x: -e, y: e };
    case "bottom-right":
      return { x: e, y: e };
  }
}
const xp = 1.5, Ep = 5 / 20;
function Nt(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const f = ni(e);
    return { x: t.x + f.x * i.offset, y: t.y + f.y * i.offset };
  }
  const a = (i.width ?? 12.5) * xp * Ep * 0.4, c = r + a, d = ni(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function so(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, f) {
  const u = r ?? Wt(e, o, c, d), h = s ?? Wt(n, i, c, d), g = {
    sourceX: u.x,
    sourceY: u.y,
    sourcePosition: Cs(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Cs(i)
  }, p = t.type ?? f ?? "bezier";
  if (l?.[p])
    return l[p](g);
  switch (p === "floating" ? t.pathType ?? "bezier" : p) {
    case "editable":
      return wp({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return yp({ ...g, obstacles: a });
    case "orthogonal":
      return gp({ ...g, obstacles: a });
    case "smoothstep":
      return yn(g);
    case "straight":
      return Dr({ sourceX: u.x, sourceY: u.y, targetX: h.x, targetY: h.y });
    default:
      return Qn(g);
  }
}
function Ss(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? zn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? zn(g.x, g.y, i.x, i.y, t.rotation) : g;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), f = Math.abs(l);
  let u;
  d / a > f / c ? u = a / d : u = c / f;
  const h = {
    x: i.x + s * u,
    y: i.y + l * u
  };
  return t.rotation ? zn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function ks(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, g = e.y - r;
    return Math.abs(h) > Math.abs(g) ? h > 0 ? "right" : "left" : g > 0 ? "bottom" : "top";
  }
  const s = 1, l = t.position.x, a = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - l) <= s) return "left";
  if (Math.abs(e.x - a) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const f = e.x - i, u = e.y - r;
  return Math.abs(f) > Math.abs(u) ? f > 0 ? "right" : "left" : u > 0 ? "bottom" : "top";
}
function oa(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? ve, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = Ss(t, l), c = Ss(e, s), d = ks(t, a), f = ks(e, c);
  return {
    sx: a.x,
    sy: a.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: f
  };
}
function uy(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function ia(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function sa(t, e) {
  return `${t}__grad__${e}`;
}
function ra(t, e, n, o, i, r, s) {
  let l = t.querySelector(`#${CSS.escape(e)}`);
  if (!l) {
    l = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"), l.id = e, l.setAttribute("gradientUnits", "userSpaceOnUse"), l.classList.add("flow-edge-gradient");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    c.setAttribute("offset", "0%"), l.appendChild(c);
    const d = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    d.setAttribute("offset", "100%"), l.appendChild(d), t.appendChild(l);
  }
  l.setAttribute("x1", String(o)), l.setAttribute("y1", String(i)), l.setAttribute("x2", String(r)), l.setAttribute("y2", String(s));
  const a = l.querySelectorAll("stop");
  return a[0]?.setAttribute("stop-color", n.from), a[1]?.setAttribute("stop-color", n.to), l;
}
function Po(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Cp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Sp(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !ze(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Fr({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function kp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function aa(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Ls(t, e) {
  if (!e) return t;
  const n = ni(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function Ps(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function ro(t, e) {
  const n = Array.from(t);
  if (n.length === 0) return null;
  if (n.length === 1 || !e) return n[0];
  let o = null, i = 1 / 0;
  for (const r of n) {
    const s = r.getBoundingClientRect(), l = (s.left + s.right) / 2, a = (s.top + s.bottom) / 2, c = l - e.x, d = a - e.y, f = c * c + d * d;
    f < i && (i = f, o = r);
  }
  return o;
}
function ao(t, e, n, o, i, r, s) {
  const l = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (l) {
    if (n) {
      const c = l.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = ro(c, r);
      if (!d) {
        const f = l.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = ro(f, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = aa(n);
      if (c && l.querySelector(`[data-flow-handle-position="${c}"]`))
        return c;
    }
    const a = l.querySelector(`[data-flow-handle-type="${o}"]`);
    if (a)
      return a.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
  }
  if (i) {
    const a = o === "source" ? i.sourcePosition : i.targetPosition;
    if (a) return a;
  }
  return o === "source" ? "bottom" : "top";
}
function Ms(t, e, n, o, i, r, s, l, a) {
  const c = a ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const p = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = ro(p, l), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = ro(y, l);
    }
    if (!d) {
      const y = aa(o);
      y && (d = c.querySelector(`[data-flow-handle-position="${y}"]`));
    }
  } else
    d = c.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!d) return null;
  const f = d.getBoundingClientRect();
  if (f.width === 0 && f.height === 0) return null;
  const u = t.getBoundingClientRect(), h = f.left + f.width / 2, g = f.top + f.height / 2;
  return {
    x: (h - u.left - s.x) / r,
    y: (g - u.top - s.y) / r,
    handleWidth: f.width / r,
    handleHeight: f.height / r
  };
}
function Lp(t, e) {
  const n = t.getTotalLength(), o = t.getPointAtLength(n * Math.max(0, Math.min(1, e)));
  return { x: o.x, y: o.y };
}
function rt(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Pp(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function Mp(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("fill", "none"), l.style.stroke = "transparent", l.style.strokeWidth = "20", l.style.pointerEvents = "stroke", l.style.cursor = "pointer", s.appendChild(l);
      let a = e.querySelector("path:not(:first-child)");
      a || (a = document.createElementNS("http://www.w3.org/2000/svg", "path"), a.setAttribute("fill", "none"), a.setAttribute("stroke-width", "1.5"), a.style.pointerEvents = "none", s.appendChild(a));
      let c = null, d = null, f = null, u = null, h = "none", g = null, p = null;
      function y(C, T, R, X, se) {
        u || (u = document.createElementNS("http://www.w3.org/2000/svg", "circle"), u.classList.add("flow-edge-dot"), u.style.pointerEvents = "none", C.appendChild(u));
        const ne = R.closest(".flow-container"), ie = ne ? getComputedStyle(ne) : null, le = X.particleSize ?? (parseFloat(ie?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), de = se || ie?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        u.setAttribute("r", String(le)), X.particleColor ? u.style.fill = X.particleColor : u.style.removeProperty("fill");
        const ue = u.querySelector("animateMotion");
        ue && ue.remove();
        const J = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        J.setAttribute("dur", de), J.setAttribute("repeatCount", "indefinite"), J.setAttribute("path", T), u.appendChild(J);
      }
      function m() {
        u?.remove(), u = null;
      }
      let x = null, k = null, v = null, A = null;
      const S = (C) => {
        C.stopPropagation();
        const T = o(n);
        if (!T) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: T, event: C }), ft(C, R._shortcuts?.multiSelect) ? R.selectedEdges.has(T.id) ? (R.selectedEdges.delete(T.id), T.selected = !1, q("selection", `Edge "${T.id}" deselected (shift)`)) : (R.selectedEdges.add(T.id), T.selected = !0, q("selection", `Edge "${T.id}" selected (shift)`)) : (R.deselectAll(), R.selectedEdges.add(T.id), T.selected = !0, q("selection", `Edge "${T.id}" selected`)), R._emitSelectionChange());
      }, P = (C) => {
        C.preventDefault(), C.stopPropagation();
        const T = o(n);
        if (!T) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = C.target;
        if (X.classList.contains("flow-edge-control-point")) {
          const se = parseInt(X.dataset.pointIndex ?? "", 10);
          if (!isNaN(se)) {
            R._emit("edge-control-point-context-menu", {
              edge: T,
              pointIndex: se,
              position: { x: C.clientX, y: C.clientY },
              event: C
            });
            return;
          }
        }
        R._emit("edge-context-menu", { edge: T, event: C });
      }, $ = (C) => {
        C.stopPropagation(), C.preventDefault();
        const T = o(n), R = t.$data(e.closest("[x-data]"));
        if (!T || !R || (T.type ?? R._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const se = C.target;
        if (se.classList.contains("flow-edge-control-point")) {
          const ne = parseInt(se.dataset.pointIndex ?? "", 10);
          !isNaN(ne) && T.controlPoints && (R._captureHistory?.(), T.controlPoints.splice(ne, 1), R._emit("edge-control-point-change", { edge: T, action: "remove", index: ne }));
          return;
        }
        if (se.classList.contains("flow-edge-midpoint")) {
          const ne = parseInt(se.dataset.segmentIndex ?? "", 10);
          if (!isNaN(ne)) {
            const ie = R.screenToFlowPosition(C.clientX, C.clientY);
            T.controlPoints || (T.controlPoints = []), R._captureHistory?.(), T.controlPoints.splice(ne, 0, { x: ie.x, y: ie.y }), R._emit("edge-control-point-change", { edge: T, action: "add", index: ne });
          }
          return;
        }
        if (se.closest("path")) {
          const ne = R.screenToFlowPosition(C.clientX, C.clientY);
          T.controlPoints || (T.controlPoints = []);
          const ie = [
            x ?? { x: 0, y: 0 },
            ...T.controlPoints,
            k ?? { x: 0, y: 0 }
          ];
          let le = 0, de = 1 / 0;
          for (let ue = 0; ue < ie.length - 1; ue++) {
            const J = Pp(ne, ie[ue], ie[ue + 1]);
            J < de && (de = J, le = ue);
          }
          R._captureHistory?.(), T.controlPoints.splice(le, 0, { x: ne.x, y: ne.y }), R._emit("edge-control-point-change", { edge: T, action: "add", index: le });
        }
      }, b = (C) => {
        const T = C.target;
        if (!T.classList.contains("flow-edge-control-point") || C.button !== 0) return;
        C.stopPropagation(), C.preventDefault();
        const R = o(n);
        if (!R?.controlPoints) return;
        const X = t.$data(e.closest("[x-data]"));
        if (!X) return;
        const se = parseInt(T.dataset.pointIndex ?? "", 10);
        if (isNaN(se)) return;
        T.classList.add("dragging");
        let ne = !1;
        const ie = (de) => {
          ne || (X._captureHistory?.(), ne = !0);
          let ue = X.screenToFlowPosition(de.clientX, de.clientY);
          const J = X._config?.snapToGrid;
          J && (ue = {
            x: Math.round(ue.x / J[0]) * J[0],
            y: Math.round(ue.y / J[1]) * J[1]
          }), R.controlPoints[se] = ue;
        }, le = () => {
          document.removeEventListener("pointermove", ie), document.removeEventListener("pointerup", le), T.classList.remove("dragging"), ne && X._emit("edge-control-point-change", { edge: R, action: "move", index: se });
        };
        document.addEventListener("pointermove", ie), document.addEventListener("pointerup", le);
      };
      s.addEventListener("contextmenu", P), s.addEventListener("dblclick", $), s.addEventListener("pointerdown", b, !0);
      let E = null;
      const N = (C) => {
        if (C.button !== 0) return;
        C.stopPropagation();
        const T = o(n);
        if (!T) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = R._config?.reconnectSnapRadius ?? Zi, se = R._config?.edgesReconnectable !== !1, ne = T.reconnectable ?? !0;
        let ie = null;
        if (se && ne !== !1 && x && k) {
          const B = R.screenToFlowPosition(C.clientX, C.clientY), j = rt(B.x, B.y, x.x, x.y, X) || v && rt(B.x, B.y, v.x, v.y, X);
          (rt(B.x, B.y, k.x, k.y, X) || A && rt(B.x, B.y, A.x, A.y, X)) && (ne === !0 || ne === "target") ? ie = "target" : j && (ne === !0 || ne === "source") && (ie = "source");
        }
        if (!ie) {
          const B = (j) => {
            document.removeEventListener("pointerup", B), S(j);
          };
          document.addEventListener("pointerup", B, { once: !0 });
          return;
        }
        const le = C.clientX, de = C.clientY;
        let ue = !1, J = !1, ce = null;
        const ee = R._config?.connectionSnapRadius ?? 20;
        let F = null, K = null, U = null, V = le, I = de;
        const re = e.closest(".flow-container");
        if (!re) return;
        const G = ie === "target" ? x : k, Y = () => {
          ue = !0, s.classList.add("flow-edge-reconnecting"), R._emit("reconnect-start", { edge: T, handleType: ie }), q("reconnect", `Reconnection drag started on edge "${T.id}" (${ie} end)`), K = Ht({
            connectionLineType: R._config?.connectionLineType,
            connectionLineStyle: R._config?.connectionLineStyle,
            connectionLine: R._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), F = K.svg;
          const B = R.screenToFlowPosition(le, de);
          K.update({
            fromX: G.x,
            fromY: G.y,
            toX: B.x,
            toY: B.y,
            source: T.source,
            sourceHandle: T.sourceHandle
          });
          const j = re.querySelector(".flow-viewport");
          j && j.appendChild(F), ie === "target" && (R.pendingConnection = {
            source: T.source,
            sourceHandle: T.sourceHandle,
            position: B
          }), R._pendingReconnection = {
            edge: T,
            draggedEnd: ie,
            anchorPosition: { ...G },
            position: B
          }, U = eo(re, R, V, I), ie === "target" && ln(re, T.source, T.sourceHandle ?? "source", R, T.id);
        }, te = (B) => {
          if (V = B.clientX, I = B.clientY, !ue) {
            Math.sqrt(
              (B.clientX - le) ** 2 + (B.clientY - de) ** 2
            ) >= On && Y();
            return;
          }
          const j = R.screenToFlowPosition(B.clientX, B.clientY), H = an({
            containerEl: re,
            handleType: ie === "target" ? "target" : "source",
            excludeNodeId: ie === "target" ? T.source : T.target,
            cursorFlowPos: j,
            connectionSnapRadius: ee,
            getNode: (Z) => R.getNode(Z),
            toFlowPosition: (Z, ae) => R.screenToFlowPosition(Z, ae)
          });
          H.element !== ce && (ce?.classList.remove("flow-handle-active"), H.element?.classList.add("flow-handle-active"), ce = H.element), K?.update({
            fromX: G.x,
            fromY: G.y,
            toX: H.position.x,
            toY: H.position.y,
            source: T.source,
            sourceHandle: T.sourceHandle
          });
          const Q = H.position;
          ie === "target" && R.pendingConnection && (R.pendingConnection = {
            ...R.pendingConnection,
            position: Q
          }), R._pendingReconnection && (R._pendingReconnection = {
            ...R._pendingReconnection,
            position: Q
          }), U?.updatePointer(B.clientX, B.clientY);
        }, z = () => {
          J || (J = !0, document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", oe), U?.stop(), U = null, K?.destroy(), K = null, F = null, ce?.classList.remove("flow-handle-active"), E = null, s.classList.remove("flow-edge-reconnecting"), Pe(re), R.pendingConnection = null, R._pendingReconnection = null);
        }, oe = async (B) => {
          if (!ue) {
            z(), S(B);
            return;
          }
          if (R._connectValidating) return;
          let j = ce, H = null;
          if (!j) {
            H = document.elementFromPoint(B.clientX, B.clientY);
            const me = ie === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            j = H?.closest(me);
          }
          const Z = (j ? j.closest("[data-flow-node-id]") : H?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, ae = j?.dataset.flowHandleId, fe = K?.svg ?? null;
          bt(fe, !0);
          let pe;
          try {
            pe = await Sp({
              dropNodeId: Z,
              dropHandleId: ae,
              draggedEnd: ie,
              edge: T,
              canvas: R,
              containerEl: re
            });
          } finally {
            bt(fe, !1);
          }
          pe.applied ? q("reconnect", `Edge "${T.id}" reconnected (${ie})`, pe.newConnection) : q("reconnect", `Edge "${T.id}" reconnection cancelled — snapping back`, { reason: pe.reason }), R._emit("reconnect-end", { edge: T, successful: pe.applied }), z();
        };
        document.addEventListener("pointermove", te), document.addEventListener("pointerup", oe), E = z;
      };
      s.addEventListener("pointerdown", N);
      const M = (C) => {
        const T = o(n);
        if (!T) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = R._config?.edgesReconnectable !== !1, se = T.reconnectable ?? !0;
        if (!X || se === !1 || !x || !k) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const ne = R._config?.reconnectSnapRadius ?? Zi, ie = R.screenToFlowPosition(C.clientX, C.clientY), le = (rt(ie.x, ie.y, x.x, x.y, ne) || v && rt(ie.x, ie.y, v.x, v.y, ne)) && (se === !0 || se === "source"), de = (rt(ie.x, ie.y, k.x, k.y, ne) || A && rt(ie.x, ie.y, A.x, A.y, ne)) && (se === !0 || se === "target");
        le || de ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", M);
      const w = (C) => {
        if (C.key !== "Enter" && C.key !== " ") return;
        C.preventDefault(), C.stopPropagation();
        const T = o(n);
        if (!T) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: T, event: C }), ft(C, R._shortcuts?.multiSelect) ? R.selectedEdges.has(T.id) ? (R.selectedEdges.delete(T.id), T.selected = !1) : (R.selectedEdges.add(T.id), T.selected = !0) : (R.deselectAll(), R.selectedEdges.add(T.id), T.selected = !0), R._emitSelectionChange());
      };
      s.addEventListener("keydown", w);
      const _ = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, D = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", _), s.addEventListener("blur", D);
      const L = (C) => {
        C.stopPropagation();
      };
      s.addEventListener("mousedown", L);
      const O = () => {
        for (const C of [c, d, f])
          C && C.classList.add("flow-edge-hovered");
      }, W = () => {
        for (const C of [c, d, f])
          C && C.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", O), s.addEventListener("mouseleave", W), i(() => {
        const C = o(n);
        if (!C || !a) return;
        s.setAttribute("data-flow-edge-id", C.id);
        const T = t.$data(e.closest("[x-data]"));
        if (!T?.nodes) return;
        const R = C.type ?? T._config?.defaultEdgeType ?? "bezier";
        T._layoutAnimTick;
        const X = T.getNode(C.source), se = T.getNode(C.target);
        if (!X || !se) return;
        X.sourcePosition, se.targetPosition;
        const ne = Ot(X, T._nodeMap, T._config?.nodeOrigin), ie = Ot(se, T._nodeMap, T._config?.nodeOrigin), le = e.closest("[x-data]");
        let de, ue, J, ce;
        if (R === "floating") {
          const H = oa(ne, ie);
          de = H.sourcePos, ue = H.targetPos, J = { x: H.sx, y: H.sy, handleWidth: 0, handleHeight: 0 }, ce = { x: H.tx, y: H.ty, handleWidth: 0, handleHeight: 0 }, x = { x: H.sx, y: H.sy }, k = { x: H.tx, y: H.ty };
        } else {
          const H = T._nodeElements?.get(C.source) ?? le.querySelector(`[data-flow-node-id="${CSS.escape(C.source)}"]`), Q = T._nodeElements?.get(C.target) ?? le.querySelector(`[data-flow-node-id="${CSS.escape(C.target)}"]`), Z = H ? Ps(H.getBoundingClientRect()) : void 0, ae = Q ? Ps(Q.getBoundingClientRect()) : void 0;
          de = ao(le, C.source, C.sourceHandle, "source", X, ae, H), ue = ao(le, C.target, C.targetHandle, "target", se, Z, Q);
          const fe = t.raw(T).viewport ?? { x: 0, y: 0, zoom: 1 }, pe = fe.zoom || 1, me = X.rotation, Se = se.rotation;
          de = Ls(de, me), ue = Ls(ue, Se), J = Ms(le, C.source, ne, C.sourceHandle, "source", pe, fe, ae, H), ce = Ms(le, C.target, ie, C.targetHandle, "target", pe, fe, Z, Q);
          const Te = Wt(ne, de, T._shapeRegistry, T._config?.nodeOrigin), we = Wt(ie, ue, T._shapeRegistry, T._config?.nodeOrigin);
          x = J ?? Te, k = ce ?? we;
        }
        const ee = Nt(J ?? x, de, J, C.markerStart), F = Nt(ce ?? k, ue, ce, C.markerEnd);
        v = ee, A = F;
        let K;
        if (R === "orthogonal" || R === "avoidant") {
          const H = t.raw(T.nodes), Q = new Map(H.map((ae) => [ae.id, ae])), Z = T._config?.nodeOrigin;
          K = H.filter((ae) => ae.id !== C.source && ae.id !== C.target).map((ae) => {
            const fe = Ot(ae, Q, Z);
            return {
              x: fe.position.x,
              y: fe.position.y,
              width: fe.dimensions?.width ?? ve,
              height: fe.dimensions?.height ?? _e
            };
          });
        }
        const { path: U, labelPosition: V } = so(C, ne, ie, de, ue, ee, F, T._config?.edgeTypes, K, T._shapeRegistry, T._config?.nodeOrigin, T._config?.defaultEdgeType);
        a.setAttribute("d", U), l.setAttribute("d", U);
        const I = R === "editable", re = I && (C.showControlPoints || C.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((H) => H.remove()), re) {
          const H = C.controlPoints ?? [], Q = T.viewport?.zoom ?? 1, Z = 6 / Q, ae = 5 / Q, fe = x ?? { x: 0, y: 0 }, pe = k ?? { x: 0, y: 0 }, me = [fe, ...H, pe], Se = me.length - 1, Te = a.getTotalLength?.() ?? 0;
          if (Te > 0) {
            const we = [0], he = 200;
            let ke = 1;
            for (let Ce = 1; Ce <= he && ke < me.length; Ce++) {
              const Me = Ce / he * Te, Ie = a.getPointAtLength(Me), xe = me[ke], be = Ie.x - xe.x, ge = Ie.y - xe.y;
              be * be + ge * ge < 25 && (we.push(Me), ke++);
            }
            for (; we.length <= Se; )
              we.push(Te);
            for (let Ce = 0; Ce < Se; Ce++) {
              const Me = (we[Ce] + we[Ce + 1]) / 2, Ie = a.getPointAtLength(Me), xe = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              xe.classList.add("flow-edge-midpoint"), xe.setAttribute("cx", String(Ie.x)), xe.setAttribute("cy", String(Ie.y)), xe.setAttribute("r", String(ae)), xe.dataset.segmentIndex = String(Ce);
              const be = document.createElementNS("http://www.w3.org/2000/svg", "title");
              be.textContent = "Double-click to add control point", xe.appendChild(be), s.appendChild(xe);
            }
          }
          for (let we = 0; we < H.length; we++) {
            const he = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            he.classList.add("flow-edge-control-point"), he.setAttribute("cx", String(H[we].x)), he.setAttribute("cy", String(H[we].y)), he.setAttribute("r", String(Z)), he.dataset.pointIndex = String(we), s.appendChild(he);
          }
        }
        if (l.style.cursor = I ? "crosshair" : "pointer", l.style.strokeWidth = String(
          C.interactionWidth ?? T._config?.defaultInteractionWidth ?? 20
        ), C.markerStart != null) {
          const H = Dt(C.markerStart), Q = Rt(H, T._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else if (C._renderDualMarker && C.markerEnd) {
          const H = Dt(C.markerEnd), Q = Rt(H, T._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else
          a.removeAttribute("marker-start");
        if (C.markerEnd) {
          const H = Dt(C.markerEnd), Q = Rt(H, T._id);
          a.setAttribute("marker-end", `url(#${Q})`);
        } else
          a.removeAttribute("marker-end");
        const G = C.strokeWidth ?? 1.5, Y = kp(C.animated);
        switch (Y !== h && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), h === "dot" && m(), h = Y), Y) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            y(s, U, le, C, C.animationDuration);
            break;
        }
        if (C.animationDuration && Y !== "none" ? (Y === "dash" || Y === "pulse") && (a.style.animationDuration = C.animationDuration) : (Y === "dash" || Y === "pulse") && a.style.removeProperty("animation-duration"), p && p !== C.class && s.classList.remove(...p.split(" ").filter(Boolean)), C.class) {
          const H = Y === "dash" ? " flow-edge-animated" : Y === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", C.class + H), s.classList.add(...C.class.split(" ").filter(Boolean)), p = C.class;
        } else
          p && (s.classList.remove(...p.split(" ").filter(Boolean)), p = null);
        if (s.setAttribute("aria-selected", String(!!C.selected)), C.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(G + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + gn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(G);
          const H = T._markerDefsEl?.querySelector("defs") ?? null;
          if (ia(C.color)) {
            if (H) {
              const Q = sa(T._id, C.id), Z = C.gradientDirection === "target-source", ae = x.x, fe = x.y, pe = k.x, me = k.y;
              ra(
                H,
                Q,
                Z ? { from: C.color.to, to: C.color.from } : C.color,
                ae,
                fe,
                pe,
                me
              ), a.style.stroke = `url(#${Q})`, g = Q;
            }
          } else if (C.color) {
            if (g) {
              const Q = H;
              Q && Po(Q, g), g = null;
            }
            a.style.stroke = C.color;
          } else {
            if (g) {
              const Q = H;
              Q && Po(Q, g), g = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (!C.selected && ((C.sourceHandle ? T.selectedRows?.has(C.sourceHandle.replace(/-[lr]$/, "")) : !1) || (C.targetHandle ? T.selectedRows?.has(C.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), C.selected || (a.style.strokeWidth = String(Math.max(G + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), C.focusable ?? T._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", C.ariaRole ?? "group"), s.setAttribute("aria-label", C.ariaLabel ?? (C.label ? `Edge: ${C.label}` : `Edge from ${C.source} to ${C.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), C.domAttributes)
          for (const [H, Q] of Object.entries(C.domAttributes))
            H.startsWith("on") || Cp.has(H.toLowerCase()) || s.setAttribute(H, Q);
        const oe = (H, Q, Z, ae, fe) => {
          if (Q) {
            if (!H && ae) {
              const pe = Z.includes("flow-edge-label-start"), me = Z.includes("flow-edge-label-end");
              let Se = `[data-flow-edge-id="${fe}"].flow-edge-label`;
              pe ? Se += ".flow-edge-label-start" : me ? Se += ".flow-edge-label-end" : Se += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", H = ae.querySelector(Se);
            }
            return H || (H = document.createElement("div"), H.className = Z, H.dataset.flowEdgeId = fe, ae && ae.appendChild(H)), H.textContent = Q, H;
          }
          return H && H.remove(), null;
        }, B = e.closest(".flow-viewport"), j = C.labelVisibility ?? "always";
        if (c = oe(c, C.label, "flow-edge-label", B, C.id), c)
          if (a.getTotalLength?.()) {
            const H = C.labelPosition ?? 0.5, Q = Lp(a, H);
            c.style.left = `${Q.x}px`, c.style.top = `${Q.y}px`;
          } else
            c.style.left = `${V.x}px`, c.style.top = `${V.y}px`;
        if (d = oe(d, C.labelStart, "flow-edge-label flow-edge-label-start", B, C.id), d && a.getTotalLength?.()) {
          const H = a.getTotalLength(), Q = C.labelStartOffset ?? 30, Z = a.getPointAtLength(Math.min(Q, H / 2));
          d.style.left = `${Z.x}px`, d.style.top = `${Z.y}px`;
        }
        if (f = oe(f, C.labelEnd, "flow-edge-label flow-edge-label-end", B, C.id), f && a.getTotalLength?.()) {
          const H = a.getTotalLength(), Q = C.labelEndOffset ?? 30, Z = a.getPointAtLength(Math.max(H - Q, H / 2));
          f.style.left = `${Z.x}px`, f.style.top = `${Z.y}px`;
        }
        for (const H of [c, d, f])
          H && (H.classList.toggle("flow-edge-label-hover", j === "hover"), H.classList.toggle("flow-edge-label-on-select", j === "selected"), H.classList.toggle("flow-edge-label-selected", !!C.selected), C.class ? H.classList.add(...C.class.split(" ").filter(Boolean)) : p && H.classList.remove(...p.split(" ").filter(Boolean)));
      }), r(() => {
        if (g) {
          const T = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          T && Po(T, g);
        }
        E?.(), m(), s.removeEventListener("contextmenu", P), s.removeEventListener("dblclick", $), s.removeEventListener("pointerdown", b, !0), s.removeEventListener("pointerdown", N), s.removeEventListener("pointermove", M), s.removeEventListener("keydown", w), s.removeEventListener("focus", _), s.removeEventListener("blur", D), s.removeEventListener("mousedown", L), s.removeEventListener("mouseenter", O), s.removeEventListener("mouseleave", W), c?.remove(), d?.remove(), f?.remove();
      });
    }
  );
}
function Tp(t, e) {
  return {
    /** Write node positions directly to DOM elements (bypassing Alpine effects). */
    _flushNodePositions(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const s = e.raw(i), l = s.parentId ? t.getAbsolutePosition(o) : s.position, a = s.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0], c = s.dimensions?.width ?? 150, d = s.dimensions?.height ?? 40;
        r.style.left = l.x - c * a[0] + "px", r.style.top = l.y - d * a[1] + "px";
      }
    },
    /** Write node styles directly to DOM elements (bypassing Alpine effects). */
    _flushNodeStyles(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const l = e.raw(i).style;
        if (!l) continue;
        const a = typeof l == "string" ? mn(l) : l;
        for (const [c, d] of Object.entries(a))
          r.style.setProperty(c, d);
      }
    },
    /** Write edge color/strokeWidth directly to SVG elements (bypassing Alpine effects). */
    _flushEdgeStyles(n) {
      for (const o of n) {
        const i = t.getEdge(o);
        if (!i) continue;
        const r = e.raw(i), s = t.getEdgePathElement(o);
        s && (typeof r.color == "string" && (s.style.stroke = r.color), r.strokeWidth !== void 0 && (s.style.strokeWidth = String(r.strokeWidth)));
      }
    },
    /** Push current viewport state to the DOM (transform, background, culling). */
    _flushViewport() {
      if (t._viewportEl) {
        const n = t.viewport;
        t._viewportEl.style.transform = `translate(${n.x}px, ${n.y}px) scale(${n.zoom})`;
      }
      t._applyBackground(), t._applyCulling();
    },
    /** Recompute SVG paths, label positions, and gradients for edges connected to the given node IDs. */
    _refreshEdgePaths(n) {
      for (const o of t.edges) {
        if (!n.has(o.source) && !n.has(o.target)) continue;
        const i = e.raw(t.getNode(o.source)), r = e.raw(t.getNode(o.target));
        if (!i || !r) continue;
        const s = Ot(i, t._nodeMap, t._config.nodeOrigin), l = Ot(r, t._nodeMap, t._config.nodeOrigin);
        let a, c, d, f;
        if (o.type === "floating") {
          const h = oa(s, l);
          d = { x: h.sx, y: h.sy }, f = { x: h.tx, y: h.ty };
          const g = Nt(d, h.sourcePos, null, o.markerStart), p = Nt(f, h.targetPos, null, o.markerEnd), y = so(o, s, l, h.sourcePos, h.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let g, p;
          if (h) {
            const A = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), S = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (A) {
              const P = A.getBoundingClientRect();
              g = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
            if (S) {
              const P = S.getBoundingClientRect();
              p = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
          }
          const y = h ? ao(h, o.source, o.sourceHandle, "source", i, p) : i?.sourcePosition ?? "bottom", m = h ? ao(h, o.target, o.targetHandle, "target", r, g) : r?.targetPosition ?? "top";
          d = Wt(s, y, t._shapeRegistry, t._config.nodeOrigin), f = Wt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const x = Nt(d, y, null, o.markerStart), k = Nt(f, m, null, o.markerEnd), v = so(o, s, l, y, m, x, k, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = v.path, c = v.labelPosition;
        }
        const u = t.getEdgePathElement(o.id);
        if (u) {
          u.setAttribute("d", a);
          const g = u.parentElement?.querySelector("path:first-child");
          g && g !== u && g.setAttribute("d", a);
        }
        if (ia(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const g = sa(t._id, o.id), p = o.gradientDirection === "target-source";
            ra(
              h,
              g,
              p ? { from: o.color.to, to: o.color.from } : o.color,
              d.x,
              d.y,
              f.x,
              f.y
            );
          }
        }
        if ((o.label || o.labelStart || o.labelEnd) && t._viewportEl) {
          if (o.label) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label:not(.flow-edge-label-start):not(.flow-edge-label-end)`
            );
            h && (h.style.left = `${c.x}px`, h.style.top = `${c.y}px`);
          }
          if (o.labelStart && u) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-start`
            );
            if (h) {
              const g = u.getTotalLength(), p = o.labelStartOffset ?? 30, y = u.getPointAtLength(Math.min(p, g / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
          if (o.labelEnd && u) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const g = u.getTotalLength(), p = o.labelEndOffset ?? 30, y = u.getPointAtLength(Math.max(g - p, g / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
        }
      }
    },
    /** Return the registered DOM element for a node by ID, or undefined if not mounted. */
    getNodeElement(n) {
      return t._nodeElements.get(n);
    },
    /** Walk up from any element to find the enclosing node's ID via the data-flow-node-id attribute.
     *  Returns null if no ancestor (or the element itself) carries the attribute. */
    getNodeIdFromElement(n) {
      const o = n.closest("[data-flow-node-id]");
      return o ? o.getAttribute("data-flow-node-id") : null;
    }
  };
}
function Ap(t) {
  return {
    _applyConfigPatch(e) {
      const n = t._config;
      for (const [o, i] of Object.entries(e))
        if (i !== void 0)
          switch (n[o] = i, o) {
            case "pannable":
            case "zoomable":
            case "minZoom":
            case "maxZoom":
            case "panOnScroll":
            case "panOnScrollDirection":
            case "panOnScrollSpeed":
              t._panZoom?.update({ [o]: i });
              break;
            case "background":
              t._background = i, t._applyBackground();
              break;
            case "backgroundGap":
              t._backgroundGap = i, t._container && t._container.style.setProperty("--flow-bg-pattern-gap", String(i));
              break;
            case "patternColor":
              t._patternColorOverride = i, t._container && t._container.style.setProperty("--flow-bg-pattern-color", i);
              break;
            case "debug":
              Er(!!i);
              break;
            case "preventOverlap":
              t._config.preventOverlap = i;
              break;
            case "reconnectOnDelete":
              t._config.reconnectOnDelete = i;
              break;
            case "nodeOrigin":
              t._config.nodeOrigin = i;
              break;
            case "preventCycles":
              t._config.preventCycles = i;
              break;
            case "loading":
              t._userLoading = !!i;
              break;
            case "loadingText":
              t._loadingText = i;
              break;
            case "colorMode":
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = qr(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Np = 0;
function $p(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Ip(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Np}`,
      nodes: e.nodes ?? [],
      edges: e.edges ?? [],
      viewport: {
        x: e.viewport?.x ?? 0,
        y: e.viewport?.y ?? 0,
        zoom: e.viewport?.zoom ?? 1
      },
      /** Whether the canvas has completed initialization and first node measurement */
      ready: !1,
      /** User-controlled loading flag, initialized from config.loading */
      _userLoading: e.loading ?? !1,
      /** Custom text for the default loading indicator */
      _loadingText: e.loadingText ?? "Loading…",
      /** Auto-injected loading overlay element (when config.loading: true and no directive) */
      _autoLoadingOverlay: null,
      /** True when the canvas is still initializing OR the user has set loading */
      get isLoading() {
        return !this.ready || this._userLoading;
      },
      /** Whether interactivity (pan/zoom/drag) is enabled */
      isInteractive: !0,
      /** Whether the canvas container is currently in fullscreen mode */
      isFullscreen: !1,
      /** Fullscreen change handler (bound to document for cleanup) */
      _onFullscreenChange: null,
      /** Resolved target element while a fullscreen session is active. */
      _fullscreenTarget: null,
      /** Currently active connection drag, or null */
      pendingConnection: null,
      /** Currently active edge reconnection drag, or null */
      _pendingReconnection: null,
      /** Keyboard-armed pending connection (source handle activated via Enter/Space), or null */
      _pendingKeyboardConnect: null,
      /** Set of selected node IDs */
      selectedNodes: /* @__PURE__ */ new Set(),
      /** Set of selected edge IDs */
      selectedEdges: /* @__PURE__ */ new Set(),
      /** Set of selected row IDs (format: nodeId.attrId) */
      selectedRows: /* @__PURE__ */ new Set(),
      /** Context menu state — populated automatically by context menu events */
      contextMenu: {
        show: !1,
        type: null,
        x: 0,
        y: 0,
        node: null,
        edge: null,
        position: null,
        nodes: null,
        event: null
      },
      // ── Shape Registry ─────────────────────────────────────────────────
      _shapeRegistry: { ...Br, ...e.shapeTypes },
      // ── Background ────────────────────────────────────────────────────
      _background: e.background ?? "dots",
      _backgroundGap: e.backgroundGap ?? null,
      _patternColorOverride: e.patternColor ?? null,
      /**
       * Cached resolution of the `--flow-bg-pattern-gap` CSS variable. Reading it
       * requires `getComputedStyle`, a forced style recalc that is prohibitively
       * expensive to run on every viewport frame at schema scale. Populated on the
       * first successful read; invalidate (set `null`) on any theme/colorMode
       * change, since the active theme can redefine the variable.
       */
      _bgGapCache: null,
      /** Last backgroundImage string written to the container — lets `_applyBackground`
       * skip the (per-frame identical) gradient write. */
      _lastBgImage: null,
      _getBackgroundGap() {
        if (this._backgroundGap !== null)
          return this._backgroundGap;
        if (this._bgGapCache !== null)
          return this._bgGapCache;
        if (this._container) {
          const s = getComputedStyle(this._container).getPropertyValue("--flow-bg-pattern-gap").trim(), l = parseFloat(s);
          if (!isNaN(l))
            return this._bgGapCache = l, l;
        }
        return 20;
      },
      _resolveBackgroundLayers() {
        const s = this._background;
        if (!s || s === "none") return [];
        const l = this._getBackgroundGap(), a = this._patternColorOverride ?? "var(--flow-bg-pattern-color)";
        return Array.isArray(s) ? s.map((c) => ({
          variant: c.variant ?? "dots",
          gap: c.gap ?? l,
          color: c.color ?? a
        })) : [{ variant: s, gap: l, color: a }];
      },
      backgroundStyle() {
        const s = this._resolveBackgroundLayers();
        if (s.length === 0) return { backgroundImage: "", backgroundSize: "", backgroundPosition: "" };
        const l = this.viewport.zoom, a = this.viewport.x, c = this.viewport.y, d = [], f = [], u = [];
        for (const h of s) {
          const g = h.gap * l, p = h.variant === "cross" ? g / 2 : g;
          d.push($p(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (f.push(`${p}px ${p}px, ${p}px ${p}px`), u.push(`${a}px ${c}px, ${a}px ${c}px`)) : (f.push(`${g}px ${g}px`), u.push(`${a}px ${c}px`));
        }
        return {
          backgroundImage: d.join(", "),
          backgroundSize: f.join(", "),
          backgroundPosition: u.join(", ")
        };
      },
      // ── Internal ──────────────────────────────────────────────────────
      // Strip collab from stored config — provider objects may contain
      // circular references (e.g. InMemoryProvider.peer) that crash
      // Alpine's deep-reactive proxy walker.
      _config: (() => {
        const { collab: s, ...l } = e;
        return l;
      })(),
      _shortcuts: Cf(e.keyboardShortcuts),
      _container: null,
      _panZoom: null,
      _onKeyDown: null,
      _active: !1,
      _zoomLevel: "close",
      _onContainerPointerDown: null,
      _onCanvasClick: null,
      _onCanvasContextMenu: null,
      _contextMenuBackdrop: null,
      _markerDefsEl: null,
      _minimap: null,
      _controls: null,
      _selectionBox: null,
      _lasso: null,
      _selectionTool: "box",
      _onSelectionPointerDown: null,
      _onSelectionPointerMove: null,
      _onSelectionPointerUp: null,
      _selectionShiftHeld: !1,
      _selectionEffectiveMode: "partial",
      _suppressNextCanvasClick: !1,
      /** Cleanup function for long-press listener */
      _longPressCleanup: null,
      /** Whether touch selection mode is currently active */
      _touchSelectionMode: !1,
      /** Cleanup function for touch selection mode listeners */
      _touchSelectionCleanup: null,
      _nodeMap: /* @__PURE__ */ new Map(),
      /** Stores each node's originally configured dimensions (before layout stretch). */
      _initialDimensions: /* @__PURE__ */ new Map(),
      _edgeMap: /* @__PURE__ */ new Map(),
      _viewportEl: null,
      // ── Viewport frame coalescing ─────────────────────────────────────────
      /**
       * The most recent viewport from d3-zoom, written synchronously on every
       * transform (event rate). Reactive `viewport` and all viewport side-effects
       * are flushed from here once per animation frame; synchronous pointer-path
       * math (drag, auto-pan, coordinate transforms) must read this, not the
       * frame-lagged reactive `viewport`.
       */
      _viewportLive: null,
      /** Pending requestAnimationFrame handle for the coalesced flush, or null. */
      _vpFrame: null,
      /** True when a user-driven move happened since the last flush (gates `viewport-move`). */
      _vpMoved: !1,
      _history: null,
      _announcer: null,
      _computeEngine: new Of(),
      _computeDebounceTimer: null,
      _animationLocked: !1,
      _activeTimelines: /* @__PURE__ */ new Set(),
      _animationRegistry: /* @__PURE__ */ new Map(),
      _followHandle: null,
      _animator: null,
      /** Saved pre-collapse state per group node ID */
      _collapseState: /* @__PURE__ */ new Map(),
      /** Whether this canvas was hydrated from a pre-rendered static diagram */
      _hydratedFromStatic: !1,
      // ── Layout Dedup ─────────────────────────────────────────────────────
      _layoutDedup: null,
      // ── Shared ResizeObserver (A1) ────────────────────────────────────────
      _resizeObserver: null,
      // ── childLayout watcher cleanup fns (keyed by node id) ───────────────
      _childLayoutCleanups: /* @__PURE__ */ new Map(),
      // ── Shared Particle Loop ────────────────────────────────────────────
      _activeParticles: /* @__PURE__ */ new Set(),
      _particleEngineHandle: null,
      /** Live CSSStyleDeclaration for the container — cached to avoid per-particle getComputedStyle calls. */
      _containerStyles: null,
      // ── Color Mode ────────────────────────────────────────────────────
      _colorModeHandle: null,
      // ── Child Validation ─────────────────────────────────────────────
      _validationErrorCache: /* @__PURE__ */ new Map(),
      // ── Layout animation edge refresh ─────────────────────────────────
      /** Reactive tick bumped each frame during layout animation so edges re-measure DOM. */
      _layoutAnimTick: 0,
      _layoutAnimFrame: 0,
      // ── Auto-Layout ──────────────────────────────────────────────────
      _autoLayoutTimer: null,
      _autoLayoutReady: !1,
      _autoLayoutFailed: !1,
      // ── Viewport Culling (CSS-only, outside Alpine reactive system) ────
      _nodeElements: /* @__PURE__ */ new Map(),
      _edgeSvgElements: /* @__PURE__ */ new Map(),
      _visibleNodeIds: /* @__PURE__ */ new Set(),
      // ── Context Menu Auto-Populate ─────────────────────────────────────
      _contextMenuListeners: [],
      // ── Drop Zone ───────────────────────────────────────────────────────
      _onDropZoneDragOver: null,
      _onDropZoneDragleave: null,
      _onDropZoneDrop: null,
      // ── Event Dispatch ────────────────────────────────────────────────
      /**
       * Emit an event: debug log it, invoke the config callback, and
       * dispatch a DOM CustomEvent (flow-xxx) for Alpine @flow-xxx listeners.
       */
      _emit(s, l) {
        s !== "viewport-change" && s !== "viewport-move" && q("event", s, l);
        const a = "on" + s.split("-").map(
          (d) => d.charAt(0).toUpperCase() + d.slice(1)
        ).join(""), c = e[a];
        typeof c == "function" && c(l), this._container?.dispatchEvent(new CustomEvent(`flow-${s}`, {
          bubbles: !0,
          detail: l
        })), this._announcer?.handleEvent(s, l ?? {}), e.computeMode === "auto" && (s === "nodes-change" || s === "edges-change") && (this._computeDebounceTimer && clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = setTimeout(() => {
          this._computeDebounceTimer = null, this.compute();
        }, 16));
      },
      /** Route a warning through the onError callback (if set) and console.warn. */
      _warn(s, l) {
        typeof e.onError == "function" && e.onError(s, l), console.warn(`[AlpineFlow] ${l}`);
      },
      _emitSelectionChange() {
        this._emit("selection-change", {
          nodes: [...this.selectedNodes],
          edges: [...this.selectedEdges],
          rows: [...this.selectedRows]
        });
      },
      _rebuildNodeMap() {
        this._nodeMap = Or(this.nodes);
      },
      _rebuildEdgeMap() {
        this._edgeMap = new Map(this.edges.map((s) => [s.id, s]));
      },
      /**
       * Hydrate from a pre-rendered static diagram.
       * Reads the render plan from data-flow-plan, populates node dimensions and
       * viewport from it, then strips the static markers so normal reactivity takes over.
       */
      _hydrateFromStatic() {
        const s = this._container.getAttribute("data-flow-plan");
        if (!s) return;
        let l;
        try {
          l = JSON.parse(s);
        } catch {
          return;
        }
        const a = /* @__PURE__ */ new Map();
        for (const c of l.nodes ?? [])
          a.set(c.id, { width: c.width, height: c.height });
        for (const c of this.nodes) {
          const d = a.get(c.id);
          d && !c.dimensions && (c.dimensions = { width: d.width, height: d.height }, this._initialDimensions.set(c.id, { ...d }));
        }
        l.viewport && (this.viewport.x = l.viewport.x, this.viewport.y = l.viewport.y, this.viewport.zoom = l.viewport.zoom), this._hydratedFromStatic = !0, this._container.removeAttribute("data-flow-static"), this._container.removeAttribute("data-flow-plan"), this._container.classList.remove("flow-static");
      },
      _captureHistory() {
        this._history?.capture({ nodes: this.nodes, edges: this.edges });
      },
      _snapshotHistory() {
        return this._history ? this._history.snapshot({ nodes: this.nodes, edges: this.edges }) : null;
      },
      _commitHistory(s) {
        s !== null && this._history?.commit(s);
      },
      _suspendHistory() {
        this._history?.suspend();
      },
      _resumeHistory() {
        this._history?.resume();
      },
      _applyBackground() {
        const s = this._container;
        if (!s) return;
        const l = this.backgroundStyle();
        l.backgroundImage !== this._lastBgImage && (s.style.backgroundImage = l.backgroundImage, this._lastBgImage = l.backgroundImage), s.style.backgroundSize = l.backgroundSize, s.style.backgroundPosition = l.backgroundPosition;
      },
      /**
       * d3-zoom transform handler. Runs on every wheel/pan event (120Hz+ on
       * trackpads). Only the transform write needs event-rate latency; the reactive
       * viewport write plus every side-effect (background, culling, zoom-level,
       * context-menu, events) is coalesced to a single flush per animation frame.
       */
      _onViewportTransform(s) {
        this._viewportLive = s, this._viewportEl && (this._viewportEl.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`), this._vpFrame === null && (this._vpFrame = requestAnimationFrame(() => {
          this._vpFrame = null, this._flushViewportFrame();
        }));
      },
      /**
       * Apply the coalesced viewport state and its side-effects once per frame.
       * Reactive `viewport` is written here (not per event), so consumers watching
       * `viewport` re-run at frame rate rather than per wheel event.
       */
      _flushViewportFrame() {
        const s = this._viewportLive;
        s && (this.viewport.x = s.x, this.viewport.y = s.y, this.viewport.zoom = s.zoom, this._applyBackground(), this._applyCulling(), this._applyZoomLevel(s.zoom), this.contextMenu.show && this.closeContextMenu(), this._emit("viewport-change", { viewport: { ...s } }), this._vpMoved && (this._vpMoved = !1, this._emit("viewport-move", { viewport: { ...s } })));
      },
      /**
       * Gesture end (user released the wheel/pointer). Commit the end-state
       * synchronously so it is never a frame late, cancelling any pending frame.
       */
      _onViewportMoveEnd(s) {
        this._vpFrame !== null && (cancelAnimationFrame(this._vpFrame), this._vpFrame = null), this._flushViewportFrame(), this._emit("viewport-move-end", { viewport: { ...s } });
      },
      /**
       * Toggle CSS display on off-screen nodes and edges.
       * Called from _flushViewportFrame — entirely outside Alpine's reactive system.
       */
      _applyCulling() {
        if (e.viewportCulling !== !0 || !this._container) return;
        const s = this._container.clientWidth, l = this._container.clientHeight;
        if (s === 0 || l === 0) return;
        const a = e.cullingBuffer ?? 100, c = Iu(this.viewport, s, l, a), d = /* @__PURE__ */ new Set();
        for (const f of this.nodes) {
          if (f.hidden) continue;
          const u = f.dimensions?.width ?? 150, h = f.dimensions?.height ?? 50, g = f.parentId ? Zo(f, this._nodeMap, this._config.nodeOrigin) : f.position, p = !(g.x + u < c.minX || g.x > c.maxX || g.y + h < c.minY || g.y > c.maxY);
          p && d.add(f.id);
          const y = this._nodeElements.get(f.id);
          y && (y.style.display = p ? "" : "none");
        }
        this._visibleNodeIds = d;
      },
      _getVisibleNodeIds() {
        return this._visibleNodeIds;
      },
      _applyZoomLevel(s) {
        if (e.zoomLevels === !1) return;
        const l = e.zoomLevels?.far ?? 0.4, a = e.zoomLevels?.medium ?? 0.75, c = s < l ? "far" : s < a ? "medium" : "close";
        c !== this._zoomLevel && (this._zoomLevel = c, this._container?.setAttribute("data-zoom-level", c));
      },
      getAbsolutePosition(s) {
        const l = this._nodeMap.get(s);
        return l ? Zo(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Er(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Wu(Kn), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = qr(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = pt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new Hu(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new Hf(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = At("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: f } = s, u = e.collab, h = new a(), g = new c(h), p = new d(h, this, u.provider), y = new f(g, u.user);
          if (Re.set(l, { bridge: p, awareness: y, doc: h }), u.provider.connect(h, g), u.cursors !== !1) {
            let m = !1;
            const x = u.throttle ?? 20, k = (S) => {
              if (m) return;
              m = !0;
              const P = l.getBoundingClientRect(), $ = this._viewportLive ?? this.viewport, b = (S.clientX - P.left - $.x) / $.zoom, E = (S.clientY - P.top - $.y) / $.zoom;
              y.updateCursor({ x: b, y: E }), setTimeout(() => {
                m = !1;
              }, x);
            }, v = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", k), l.addEventListener("mouseleave", v);
            const A = Re.get(l);
            A.cursorCleanup = () => {
              l.removeEventListener("mousemove", k), l.removeEventListener("mouseleave", v);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (q("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Tu(this._container, {
          onTransformChange: (s) => {
            this._onViewportTransform(s);
          },
          onMoveStart: (s) => {
            this._emit("viewport-move-start", { viewport: { ...s } });
          },
          onMove: () => {
            this._vpMoved = !0;
          },
          onMoveEnd: (s) => {
            this._onViewportMoveEnd(s);
          },
          minZoom: e.minZoom,
          maxZoom: e.maxZoom,
          pannable: e.pannable,
          zoomable: e.zoomable,
          translateExtent: e.translateExtent,
          isLocked: () => this._animationLocked,
          noPanClassName: e.noPanClassName ?? "nopan",
          noWheelClassName: e.noWheelClassName,
          zoomOnDoubleClick: e.zoomOnDoubleClick,
          panOnDrag: e.panOnDrag,
          panActivationKeyCode: e.panActivationKeyCode,
          zoomActivationKeyCode: e.zoomActivationKeyCode,
          isTouchSelectionMode: () => this._touchSelectionMode,
          panOnScroll: e.panOnScroll,
          panOnScrollDirection: e.panOnScrollDirection,
          panOnScrollSpeed: e.panOnScrollSpeed,
          onScrollPan: (s, l) => {
            this.panBy(s, l);
          }
        }), e.viewport) {
          const s = {
            x: e.viewport.x ?? 0,
            y: e.viewport.y ?? 0,
            zoom: e.viewport.zoom ?? 1
          };
          this.viewport.x = s.x, this.viewport.y = s.y, this.viewport.zoom = s.zoom, this._panZoom.setViewport(s);
        }
        this.$nextTick(() => {
          if (this._viewportEl || (this._viewportEl = this._container?.querySelector(".flow-viewport")), this._viewportEl) {
            const s = this.viewport;
            this._viewportEl.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.zoom})`;
          }
        }), this._bgGapCache = null, this._applyBackground(), this.$store.flow.register(this._id, this), this._onContainerPointerDown = () => {
          this.$store.flow.activate(this._id);
        }, this._container.addEventListener("pointerdown", this._onContainerPointerDown), Object.keys(this.$store.flow.instances).length === 1 && this.$store.flow.activate(this._id), this._setupMarkerDefs();
      },
      /** Canvas click handler, context menu handler, long press, touch selection mode, context menu event listeners. */
      _initClickHandlers() {
        this._onCanvasClick = (a) => {
          if (this._suppressNextCanvasClick) {
            this._suppressNextCanvasClick = !1;
            return;
          }
          this.pendingConnection && (this._emit("connect-end", {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: this.screenToFlowPosition(a.clientX, a.clientY)
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container));
          const c = a.target;
          if (c === this._container || c.classList.contains("flow-viewport")) {
            const d = this.screenToFlowPosition(a.clientX, a.clientY);
            this._emit("pane-click", { event: a, position: d }), this.deselectAll();
          }
        }, this._container.addEventListener("click", this._onCanvasClick), this._onCanvasContextMenu = (a) => {
          const c = a.target;
          if (c === this._container || c.classList.contains("flow-viewport"))
            if (a.preventDefault(), this.selectedNodes.size > 1) {
              const d = this.nodes.filter((f) => this.selectedNodes.has(f.id));
              this._emit("selection-context-menu", { nodes: d, event: a });
            } else {
              const d = this.screenToFlowPosition(a.clientX, a.clientY);
              this._emit("pane-context-menu", { event: a, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = kf(
          this._container,
          (a) => {
            const c = a.target;
            if (s === "context-menu") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const u = d.getAttribute("data-flow-node-id"), h = this._nodeMap.get(u);
                if (h) {
                  this._emit("node-context-menu", { node: h, event: a });
                  return;
                }
              }
              const f = c.closest(".flow-edge-svg");
              if (f) {
                const u = f.getAttribute("data-edge-id"), h = u ? this._edgeMap.get(u) : void 0;
                if (h) {
                  this._emit("edge-context-menu", { edge: h, event: a });
                  return;
                }
              }
              if (this.selectedNodes.size > 1) {
                const u = this.nodes.filter((h) => this.selectedNodes.has(h.id));
                this._emit("selection-context-menu", { nodes: u, event: a });
              } else {
                const u = this.screenToFlowPosition(a.clientX, a.clientY);
                this._emit("pane-context-menu", { event: a, position: u });
              }
            } else if (s === "select") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const f = d.getAttribute("data-flow-node-id");
                this.selectedNodes.has(f) ? this.selectedNodes.delete(f) : this.selectedNodes.add(f);
              }
            }
          },
          { duration: e.longPressDuration ?? 500 }
        )), e.touchSelectionMode !== !1) {
          let a = 0, c = 0;
          const d = (p) => {
            p.pointerType === "touch" && (c++, c === 2 && Date.now() - a < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), a = Date.now());
          }, f = (p) => {
            p.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (a = 0));
          }, u = this._container;
          if (!u) return;
          u.addEventListener("pointerdown", d), u.addEventListener("pointerup", f), u.addEventListener("pointercancel", f);
          const h = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", h);
          const g = document.createElement("div");
          g.className = "flow-touch-selection-mode-indicator", g.textContent = "Selection Mode — tap with two fingers to exit", u.appendChild(g), this._touchSelectionCleanup = () => {
            u.removeEventListener("pointerdown", d), u.removeEventListener("pointerup", f), u.removeEventListener("pointercancel", f), document.removeEventListener("visibilitychange", h), g.remove();
          };
        }
        const l = [
          { event: "flow-node-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "node", x: a.detail.event.clientX, y: a.detail.event.clientY, node: a.detail.node, edge: null, position: null, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-edge-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "edge", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: a.detail.edge, position: null, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-pane-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "pane", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: null, position: a.detail.position, nodes: null, event: a.detail.event });
          }) },
          { event: "flow-selection-context-menu", handler: ((a) => {
            Object.assign(this.contextMenu, { show: !0, type: "selection", x: a.detail.event.clientX, y: a.detail.event.clientY, node: null, edge: null, position: null, nodes: a.detail.nodes, event: a.detail.event });
          }) }
        ];
        for (const a of l)
          this._container.addEventListener(a.event, a.handler);
        this._contextMenuListeners = l;
      },
      /** Keyboard shortcut handler (delete, arrows, undo/redo, copy/paste/cut, selection tool toggle, escape). */
      _initKeyboard() {
        this._onKeyDown = (s) => {
          if (!this._active || this._animationLocked) return;
          const l = s.target.tagName, a = this._shortcuts;
          if (Xe(s.key, a.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Xe(s.key, a.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container);
            return;
          }
          if (Xe(s.key, a.delete)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (Xe(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Xe(s.key, a.moveNodes)) {
            if (l === "INPUT" || l === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = ft(s, a.moveStepModifier) ? a.moveStep * a.moveStepMultiplier : a.moveStep;
            let d = 0, f = 0;
            switch (s.key) {
              case "ArrowUp":
                f = -c;
                break;
              case "ArrowDown":
                f = c;
                break;
              case "ArrowLeft":
                d = -c;
                break;
              case "ArrowRight":
                d = c;
                break;
              default: {
                const u = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = u.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === h);
                g === 0 ? f = -c : g === 1 ? f = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            Sf(s.repeat, this.selectedNodes.size, d, f) && this._captureHistory();
            for (const u of this.selectedNodes) {
              const h = this.getNode(u);
              if (h && Ir(h)) {
                h.position.x += d, h.position.y += f;
                const g = this._container ? Re.get(this._container) : void 0;
                g?.bridge && g.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Xe(s.key, a.undo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Xe(s.key, a.redo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            Xe(s.key, a.copy) ? (s.preventDefault(), this.copy()) : Xe(s.key, a.paste) ? (s.preventDefault(), this.paste()) : Xe(s.key, a.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = Zu(this._container, {
          getState: () => ({
            nodes: oo(this.nodes, this._nodeMap, this._config.nodeOrigin),
            viewport: this.viewport,
            containerWidth: this._container?.clientWidth ?? 0,
            containerHeight: this._container?.clientHeight ?? 0
          }),
          getViewportState: () => ({
            viewport: this.viewport,
            containerWidth: this._container?.clientWidth ?? 0,
            containerHeight: this._container?.clientHeight ?? 0
          }),
          setViewport: (s) => this._panZoom?.setViewport(s),
          config: e
        }), this._minimap.render(), this.$watch("nodes", () => this._minimap?.render()), this.$watch("viewport", () => this._minimap?.updateViewport()));
      },
      /** Create controls panel if configured. */
      _initControls() {
        if (e.controls) {
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, l = s !== this._container;
          this._controls = nf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Yo }),
            onToggleInteractive: () => this.toggleInteractive(),
            onResetPanels: () => this.resetPanels(),
            onToggleFullscreen: () => this.toggleFullscreen()
          }), this.$watch("isInteractive", (a) => {
            this._controls?.update({ isInteractive: a });
          }), this.$watch("isFullscreen", (a) => {
            this._controls?.update({ isFullscreen: a });
          });
        }
      },
      /**
       * Wire a document-level `fullscreenchange` listener so the reactive
       * `isFullscreen` flag stays accurate when the user exits via Escape
       * or any out-of-band means. Safe no-op when the Fullscreen API is
       * unavailable (e.g., restricted iframes).
       */
      _initFullscreen() {
        typeof document > "u" || !("fullscreenEnabled" in document) || (this._onFullscreenChange = () => {
          const s = this._fullscreenTarget ?? this._container, l = document.fullscreenElement === s;
          l !== this.isFullscreen && (this.isFullscreen = l, this._container?.dispatchEvent(new CustomEvent("flow-fullscreen-change", {
            bubbles: !0,
            detail: { isFullscreen: l }
          }))), l || (this._fullscreenTarget = null);
        }, document.addEventListener("fullscreenchange", this._onFullscreenChange));
      },
      /**
       * Resolve which element should enter fullscreen. Honors the optional
       * `fullscreenTarget` config (string selector / HTMLElement / function)
       * and falls back to the canvas container.
       */
      _resolveFullscreenTarget() {
        if (!this._container) return null;
        const s = this._config?.fullscreenTarget;
        if (!s) return this._container;
        if (typeof s == "string") {
          const l = this._container.closest(s);
          if (l) return l;
          const a = document.querySelector(s);
          return a || (console.warn(`[AlpineFlow] fullscreenTarget selector "${s}" did not match; falling back to canvas container.`), this._container);
        }
        if (s instanceof HTMLElement) return s;
        if (typeof s == "function")
          try {
            const l = s(this._container);
            if (l instanceof HTMLElement) return l;
          } catch (l) {
            console.warn("[AlpineFlow] fullscreenTarget resolver threw:", l);
          }
        return this._container;
      },
      /**
       * Toggle fullscreen on the canvas container (or the configured
       * `fullscreenTarget`). Requests fullscreen when not active, exits when
       * active. Warns and no-ops if the browser doesn't expose
       * `requestFullscreen` (e.g., restricted iframes).
       */
      toggleFullscreen() {
        if (!this._container || typeof document > "u") return;
        const s = this._resolveFullscreenTarget();
        if (!s) return;
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
          return;
        }
        const l = s.requestFullscreen;
        if (typeof l != "function") {
          console.warn("[AlpineFlow] requestFullscreen is not available in this context");
          return;
        }
        this._fullscreenTarget = s, Promise.resolve(l.call(s)).catch((a) => {
          console.warn("[AlpineFlow] fullscreen request rejected:", a), this._fullscreenTarget = null;
        });
      },
      /** Selection box/lasso setup (pointerdown/pointermove/pointerup handlers). */
      _initSelection() {
        this._selectionBox = of(this._container), this._lasso = sf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !ft(s, this._shortcuts.selectionBox))
            return;
          const l = s.target;
          if (l !== this._container && !l.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const a = this._config.selectionMode ?? "partial", c = ft(s, this._shortcuts.selectionModeToggle);
          if (this._selectionEffectiveMode = c ? a === "partial" ? "full" : "partial" : a, !this._container) return;
          const d = this._container.getBoundingClientRect(), f = s.clientX - d.left, u = s.clientY - d.top;
          this._selectionTool === "lasso" ? this._lasso.start(f, u, this._selectionEffectiveMode) : this._selectionBox.start(f, u, this._selectionEffectiveMode), s.target.setPointerCapture(s.pointerId);
        }, this._onSelectionPointerMove = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive()) || !this._container) return;
          const a = this._container.getBoundingClientRect(), c = s.clientX - a.left, d = s.clientY - a.top;
          this._selectionTool === "lasso" ? this._lasso.update(c, d) : this._selectionBox.update(c, d);
        }, this._onSelectionPointerUp = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive())) return;
          s.target.releasePointerCapture(s.pointerId), this._suppressNextCanvasClick = !0;
          const a = oo(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const f = this._lasso.end(this.viewport);
            if (!f) return;
            const u = this._selectionEffectiveMode === "full" ? cf(a, f) : lf(a, f), h = new Set(u.map((g) => g.id));
            if (c = this.nodes.filter((g) => h.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const y = p.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let x = 0;
                for (let v = 0; v <= m; v++) {
                  const A = p.getPointAtLength(v / m * y);
                  yi(A.x, A.y, f) && x++;
                }
                (this._selectionEffectiveMode === "full" ? x === m + 1 : x > 0) && d.push(g.id);
              }
          } else {
            const f = this._selectionBox.end(this.viewport);
            if (!f) return;
            const u = this._selectionEffectiveMode === "full" ? $u(a, f, this._config.nodeOrigin) : Nu(a, f, this._config.nodeOrigin), h = new Set(u.map((g) => g.id));
            c = this.nodes.filter((g) => h.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const f of c) {
            if (!Uo(f) || f.hidden) continue;
            f.selected = !0, this.selectedNodes.add(f.id);
            const u = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(f.id)}"]`);
            u && u.classList.add("flow-node-selected");
          }
          for (const f of d) {
            const u = this.getEdge(f);
            u && (u.selected = !0, this.selectedEdges.add(u.id));
          }
          (c.length > 0 || d.length > 0) && this._emitSelectionChange(), this._selectionShiftHeld = !1;
        }, this._container.addEventListener("pointerdown", this._onSelectionPointerDown), this._container.addEventListener("pointermove", this._onSelectionPointerMove), this._container.addEventListener("pointerup", this._onSelectionPointerUp);
      },
      /** Drop zone drag/drop handlers if onDrop configured. */
      _initDropZone() {
        if (e.onDrop) {
          const s = e.dropMimeTypes ?? ["application/alpineflow"], l = (a, c) => {
            const d = document.elementsFromPoint(a, c);
            for (const f of d) {
              const u = f.closest?.("[data-flow-node-id]");
              if (!u)
                continue;
              const h = u.getAttribute("data-flow-node-id");
              if (!h)
                continue;
              const g = this._nodeMap.get(h);
              if (g)
                return g;
            }
            return null;
          };
          this._onDropZoneDragOver = (a) => {
            !a.dataTransfer || !s.some((d) => a.dataTransfer.types.includes(d)) || (a.preventDefault(), a.dataTransfer.dropEffect = "move", this._container?.classList.add("flow-canvas-drag-over"));
          }, this._onDropZoneDragleave = (a) => {
            if (!this._container)
              return;
            const c = a.relatedTarget;
            c && this._container.contains(c) || this._container.classList.remove("flow-canvas-drag-over");
          }, this._onDropZoneDrop = (a) => {
            if (a.preventDefault(), this._container?.classList.remove("flow-canvas-drag-over"), !a.dataTransfer || !e.onDrop)
              return;
            let c = null, d = null;
            for (const p of s) {
              const y = a.dataTransfer.getData(p);
              if (y) {
                c = p, d = y;
                break;
              }
            }
            if (!c || !d)
              return;
            let f;
            try {
              f = JSON.parse(d);
            } catch {
              f = d;
            }
            if (!this._container)
              return;
            const u = br(
              a.clientX,
              a.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = l(a.clientX, a.clientY), g = e.onDrop({ data: f, position: u, targetNode: h, mimeType: c });
            g && this.addNodes(g, { center: !0 });
          }, this._container.addEventListener("dragover", this._onDropZoneDragOver), this._container.addEventListener("dragleave", this._onDropZoneDragleave), this._container.addEventListener("drop", this._onDropZoneDrop);
        }
      },
      /**
       * Return the deepest FlowNode under the given client coordinates.
       * Uses document.elementsFromPoint and walks inward to find the first
       * element carrying a data-flow-node-id attribute.
       *
       * Useful for context menus, tooltips, and custom pointer interactions
       * beyond the built-in drop zone.
       */
      getNodeAtPoint(s, l) {
        const a = document.elementsFromPoint(s, l);
        for (const c of a) {
          const d = c.closest?.("[data-flow-node-id]");
          if (!d)
            continue;
          const f = d.getAttribute("data-flow-node-id");
          if (!f)
            continue;
          const u = this._nodeMap.get(f);
          if (u)
            return u;
        }
        return null;
      },
      /**
       * Install per-property Alpine watchers on a container node's childLayout.
       *
       * Watches the six layout-affecting properties explicitly so that any
       * mutation — direct assignment or via wire-bridge — triggers a re-layout
       * through the existing safeLayoutChildren dedup (at most one call per
       * parent per frame). Unwatched props (e.g. custom user data on childLayout)
       * never cause spurious layouts.
       *
       * Uses Alpine.watch(getter, callback) — the same low-level primitive that
       * $watch delegates to — because $watch only accepts string expressions
       * evaluated in component scope, which can't address per-node sub-objects.
       */
      _installChildLayoutWatchers(s) {
        if (!s.childLayout) return;
        this._uninstallChildLayoutWatchers(s.id);
        const l = [
          "columns",
          "gap",
          "padding",
          "headerHeight",
          "direction",
          "stretch"
        ], a = s.id, c = [];
        for (const d of l) {
          const f = t.watch(
            () => s.childLayout?.[d],
            () => {
              this._layoutDedup?.safeLayoutChildren(a);
            }
          );
          c.push(f);
        }
        this._childLayoutCleanups.set(a, c);
      },
      _uninstallChildLayoutWatchers(s) {
        const l = this._childLayoutCleanups.get(s);
        if (l) {
          for (const a of l) a();
          this._childLayoutCleanups.delete(s);
        }
      },
      /** Create the shared ResizeObserver instance (A1). Called from _initChildLayout. */
      _resizeObserverInit() {
        typeof ResizeObserver > "u" || (this._resizeObserver = new ResizeObserver((s) => {
          for (const l of s) {
            const a = l.target, c = a.getAttribute("data-flow-node-id");
            if (!c) continue;
            const d = this._nodeMap.get(c);
            if (!d) continue;
            const f = l.borderBoxSize?.[0], u = f ? f.inlineSize : a.offsetWidth, h = f ? f.blockSize : a.offsetHeight;
            if (u === 0 && h === 0 || a.offsetParent === null && a.tagName !== "BODY" || d.fixedDimensions === !0) continue;
            const g = Math.round(u), p = Math.round(h), y = d.dimensions;
            if (y && Math.abs((y.width ?? 0) - g) < 1 && Math.abs((y.height ?? 0) - p) < 1)
              continue;
            const m = Qf(
              { width: g, height: p },
              d.minDimensions,
              d.maxDimensions
            );
            d.dimensions = m, d.parentId && this._layoutDedup?.safeLayoutChildren(d.parentId);
          }
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = Gf((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && Uf(e, s, e.wireEvents);
          const l = Zf(this, s), a = qf(this, s);
          this._wireCleanup = () => {
            l(), a();
          }, q("init", `wire bridge activated for "${this._id}"`);
        }
        q("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
        for (const s of this.nodes)
          s.childLayout && this._installChildLayoutWatchers(s);
        for (const s of this.nodes)
          s.childLayout && !s.parentId && this.layoutChildren(s.id);
        for (const s of this.nodes)
          s.childLayout && s.parentId && (this._nodeMap.get(s.parentId)?.childLayout || this.layoutChildren(s.id));
        e.fitViewOnInit && requestAnimationFrame(() => {
          this.fitView();
        });
      },
      /** Call setup(canvas) on any addon that provides it. */
      _initAddons() {
        for (const [, s] of Xr().entries())
          s && typeof s == "object" && typeof s.setup == "function" && s.setup(this);
      },
      /** Validate auto-layout dependency and start initial layout. */
      _initAutoLayout() {
        if (e.autoLayout) {
          const s = e.autoLayout.algorithm, l = {
            dagre: "layout:dagre",
            force: "layout:force",
            hierarchy: "layout:hierarchy",
            elk: "layout:elk"
          }, a = {
            dagre: "AlpineFlowDagre",
            force: "AlpineFlowForce",
            hierarchy: "AlpineFlowHierarchy",
            elk: "AlpineFlowElk"
          }, c = l[s];
          c && At(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${a[s]})`);
        }
      },
      /** requestAnimationFrame ready flip, loading watch, loading overlay injection. */
      _initReady() {
        const s = e.fitViewOnInit ? 2 : 1;
        let l = 0;
        const a = () => {
          if (l++, l < s) {
            requestAnimationFrame(a);
            return;
          }
          this.$nextTick(() => {
            this.ready = !0;
          });
        };
        if (requestAnimationFrame(a), this.$watch("isLoading", (c) => {
          this._container && (this._container.classList.toggle("flow-loading", c), this._container.classList.toggle("flow-ready", !c), !c && this._autoLoadingOverlay && (this._autoLoadingOverlay.remove(), this._autoLoadingOverlay = null));
        }), this._container && this._container.classList.add("flow-loading"), e.loading && this._container && !this._container.querySelector("[data-flow-loading-directive]")) {
          const c = document.createElement("div");
          c.className = "flow-loading-overlay";
          const d = document.createElement("div");
          d.className = "flow-loading-indicator";
          const f = document.createElement("div");
          f.className = "flow-loading-indicator-node";
          const u = document.createElement("div");
          u.className = "flow-loading-indicator-text", u.textContent = this._loadingText, d.appendChild(f), d.appendChild(u), c.appendChild(d), this._container.appendChild(c), this._autoLoadingOverlay = c;
        }
      },
      // ── Lifecycle ─────────────────────────────────────────────────────
      init() {
        o = this, this._initDebug(), this._initContainer(), this._initColorMode(), this._initHydration(), this._initHistory(), this._initAnnouncer(), this._initCollab(), this._initPanZoom(), this._initClickHandlers(), this._initKeyboard(), this._initMinimap(), this._initFullscreen(), this._initControls(), this._initSelection(), this._initChildLayout(), this._initAddons(), this._initDropZone(), this._initAutoLayout(), this._initReady();
      },
      _setupMarkerDefs() {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
        const l = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        s.appendChild(l), this._container?.appendChild(s), this._markerDefsEl = s, this._updateMarkerDefs(), this.$watch("edges", () => {
          this._updateMarkerDefs();
        });
      },
      _updateMarkerDefs() {
        if (!this._markerDefsEl) return;
        const s = this._markerDefsEl.querySelector("defs"), l = /* @__PURE__ */ new Map();
        for (const d of this.edges)
          for (const f of [d.markerStart, d.markerEnd]) {
            if (!f) continue;
            const u = Dt(f), h = Rt(u, this._id);
            l.has(h) || l.set(h, Jn(u, h));
          }
        const a = s.querySelectorAll("marker"), c = /* @__PURE__ */ new Set();
        a.forEach((d) => {
          l.has(d.id) ? c.add(d.id) : d.remove();
        });
        for (const [d, f] of l)
          if (!c.has(d)) {
            const h = new DOMParser().parseFromString(
              `<svg xmlns="http://www.w3.org/2000/svg">${f}</svg>`,
              "image/svg+xml"
            ).querySelector("marker");
            h && s.appendChild(document.importNode(h, !0));
          }
      },
      destroy() {
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), q("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
          for (const s of this._contextMenuListeners)
            this._container.removeEventListener(s.event, s.handler);
        if (this._contextMenuListeners = [], this._onKeyDown && document.removeEventListener("keydown", this._onKeyDown), this._onContainerPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onContainerPointerDown), this._markerDefsEl?.remove(), this._markerDefsEl = null, this._minimap?.destroy(), this._minimap = null, this._controls?.destroy(), this._controls = null, this._onFullscreenChange && typeof document < "u" && document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._onFullscreenChange = null, typeof document < "u") {
          const s = document.fullscreenElement;
          s && (s === this._container || s === this._fullscreenTarget) && document.exitFullscreen?.().catch(() => {
          });
        }
        this._fullscreenTarget = null, this._onSelectionPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onSelectionPointerDown), this._onSelectionPointerMove && this._container && this._container.removeEventListener("pointermove", this._onSelectionPointerMove), this._onSelectionPointerUp && this._container && this._container.removeEventListener("pointerup", this._onSelectionPointerUp), this._selectionBox?.destroy(), this._selectionBox = null, this._lasso?.destroy(), this._lasso = null, this._viewportEl = null, this._container && (this._container.removeEventListener("dragover", this._onDropZoneDragOver), this._container.removeEventListener("dragleave", this._onDropZoneDragleave), this._container.removeEventListener("drop", this._onDropZoneDrop)), this._followHandle?.stop(), this._followHandle = null;
        for (const s of this._activeTimelines)
          s.stop();
        if (this._activeTimelines.clear(), this._animator && (t.raw(this._animator).stopAll(), this._animator = null), this._layoutAnimFrame && (cancelAnimationFrame(this._layoutAnimFrame), this._layoutAnimFrame = 0), this._autoLayoutTimer && (clearTimeout(this._autoLayoutTimer), this._autoLayoutTimer = null), this._colorModeHandle && (this._colorModeHandle.destroy(), this._colorModeHandle = null), this._container) {
          const s = Re.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), Re.delete(this._container));
        }
        e.collab && e.collab.provider.destroy(), this._container && this._container.removeAttribute("data-flow-canvas"), this.$store.flow.unregister(this._id), this._vpFrame !== null && (cancelAnimationFrame(this._vpFrame), this._vpFrame = null), this._panZoom?.destroy(), this._panZoom = null, this._announcer?.destroy(), this._announcer = null, this._computeDebounceTimer && (clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = null);
        for (const s of [...this._childLayoutCleanups.keys()])
          this._uninstallChildLayoutWatchers(s);
        this._resizeObserver?.disconnect(), this._resizeObserver = null, this._layoutDedup?.dispose(), this._layoutDedup = null;
      },
      // ── Remaining Flat Methods ────────────────────────────────────────
      /**
       * Set a node's rotation angle in degrees.
       */
      rotateNode(s, l) {
        const a = this.nodes.find((c) => c.id === s);
        a && (this._captureHistory(), a.rotation = l);
      },
      /** Set the user-controlled loading state. */
      setLoading(s) {
        this._userLoading = s;
      },
      /** Update runtime config options. */
      patchConfig(s) {
        this._applyConfigPatch(s);
      },
      // ── Context Menu ──────────────────────────────────────────────────
      closeContextMenu() {
        this.contextMenu.show = !1, this.contextMenu.type = null, this.contextMenu.node = null, this.contextMenu.edge = null, this.contextMenu.position = null, this.contextMenu.nodes = null, this.contextMenu.event = null;
      },
      /**
       * Batch multiple canvas mutations so that layout reconciliation runs once
       * after the whole block rather than once per mutation. Nested calls join
       * the outermost batch. fn's return value is forwarded; layout still runs
       * even if fn throws.
       */
      batch(s) {
        return this._layoutDedup ? Jf(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? Re.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => am));
        } catch {
          throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
        }
        return l(
          this._container,
          this._viewportEl,
          this.nodes,
          this.viewport,
          s
        );
      }
    };
    let o = n;
    const i = new Proxy(/* @__PURE__ */ Object.create(null), {
      get(s, l) {
        return o[l];
      },
      set(s, l, a) {
        return o[l] = a, !0;
      }
    }), r = [
      oh(i),
      ih(i),
      sh(i),
      ch(i),
      dh(i),
      Oh(i),
      Bh(i),
      qh(i),
      Xh(i),
      Qh(i),
      ep(i),
      tp(i),
      Tp(i, t),
      Ap(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      ju(s, l);
    }, n;
  });
}
function Ts(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Dp(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: f, noDragClassName: u, dragThreshold: h = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(x) {
    const k = s();
    return {
      x: (x.x - k.x) / k.zoom,
      y: (x.y - k.y) / k.zoom
    };
  }
  const y = Ve(t), m = cc().subject(() => {
    const x = s(), k = l();
    return {
      x: k.x * x.zoom + x.x,
      y: k.y * x.zoom + x.y
    };
  }).on("start", (x) => {
    g = p(x), o?.({ nodeId: e, position: g, sourceEvent: x.sourceEvent });
  }).on("drag", (x) => {
    let k = p(x);
    a && (k = Ts(k, a));
    const v = {
      x: k.x - g.x,
      y: k.y - g.y
    };
    i?.({ nodeId: e, position: k, delta: v, sourceEvent: x.sourceEvent });
  }).on("end", (x) => {
    let k = p(x);
    a && (k = Ts(k, a)), r?.({ nodeId: e, position: k, sourceEvent: x.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((x) => {
    if (f?.() || u && x.target?.closest?.("." + u)) return !1;
    if (c) {
      const k = t.querySelector(c);
      return k ? k.contains(x.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Rp(t, e) {
  const n = jt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Fp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, l = 1 / 0, a = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, f = t.x + t.width, u = t.y + t.height;
  for (const h of e) {
    const g = h.x + h.width / 2, p = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, x = [
      [t.x, h.x],
      // left-left
      [f, y],
      // right-right
      [c, g],
      // center-center
      [t.x, y],
      // left-right
      [f, h.x]
      // right-left
    ];
    for (const [v, A] of x) {
      const S = A - v;
      Math.abs(S) <= n && (i.add(A), Math.abs(S) < Math.abs(l) && (l = S, r = S));
    }
    const k = [
      [t.y, h.y],
      // top-top
      [u, m],
      // bottom-bottom
      [d, p],
      // center-center
      [t.y, m],
      // top-bottom
      [u, h.y]
      // bottom-top
    ];
    for (const [v, A] of k) {
      const S = A - v;
      Math.abs(S) <= n && (o.add(A), Math.abs(S) < Math.abs(a) && (a = S, s = S));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Hp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Op(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = Hp(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const zp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Vp = 0;
function As(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Mo(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Bp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function qp(t, e, n) {
  const o = t.querySelectorAll('[data-flow-handle-type="source"]');
  if (o.length === 0) return null;
  let i = null, r = 1 / 0;
  return o.forEach((s) => {
    const l = s, a = l.getBoundingClientRect();
    if (a.width === 0 && a.height === 0) return;
    const c = a.left + a.width / 2, d = a.top + a.height / 2, f = Math.sqrt((e - c) ** 2 + (n - d) ** 2);
    f < r && (r = f, i = l);
  }), i;
}
function Xp(t, e, n) {
  let o = 1 / 0, i = -1 / 0, r = 1 / 0, s = -1 / 0;
  for (const c of n)
    o = Math.min(o, c.x), i = Math.max(i, c.x + c.width), r = Math.min(r, c.y), s = Math.max(s, c.y + c.height);
  const l = 50, a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  a.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:500;";
  for (const c of t) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(o - l)), d.setAttribute("y1", String(c)), d.setAttribute("x2", String(i + l)), d.setAttribute("y2", String(c)), d.classList.add("flow-guide-path"), a.appendChild(d);
  }
  for (const c of e) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(c)), d.setAttribute("y1", String(r - l)), d.setAttribute("x2", String(c)), d.setAttribute("y2", String(s + l)), d.classList.add("flow-guide-path"), a.appendChild(d);
  }
  return a;
}
function Yp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, f = null, u = null, h = null, g = null, p = null, y = !1, m = -1, x = null, k = !1, v = [], A = "", S = [], P = null;
      i(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        if (e.dataset.flowNodeId = M.id, M.type && (e.dataset.flowNodeType = M.type), !k) {
          const F = e.closest("[x-data]"), K = F ? t.$data(F) : null;
          let U = !1;
          if (K?._config?.nodeTypes) {
            const V = M.type ?? "default", I = K._config.nodeTypes[V] ?? K._config.nodeTypes.default;
            if (typeof I == "string") {
              const re = document.querySelector(I);
              re?.content && (e.appendChild(re.content.cloneNode(!0)), U = !0);
            } else typeof I == "function" && (I(M, e), U = !0);
          }
          if (!U && e.children.length === 0) {
            const V = document.createElement("div");
            V.setAttribute("x-flow-handle:target", "");
            const I = document.createElement("span");
            I.setAttribute("x-text", "node.data.label");
            const re = document.createElement("div");
            re.setAttribute("x-flow-handle:source", ""), e.appendChild(V), e.appendChild(I), e.appendChild(re), U = !0;
          }
          if (U)
            for (const V of Array.from(e.children))
              t.addScopeToNode(V, { node: M }), t.initTree(V);
          k = !0;
        }
        if (M.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), P !== M.id && (s?.destroy(), s = null, P = M.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        e.classList.add("flow-node", "nopan"), M.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group");
        const _ = M.parentId ? w.getAbsolutePosition(M.id) : M.position ?? { x: 0, y: 0 }, D = M.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], L = M.dimensions?.width ?? 150, O = M.dimensions?.height ?? 40;
        if (e.style.left = _.x - L * D[0] + "px", e.style.top = _.y - O * D[1] + "px", M.dimensions) {
          const F = M.childLayout, K = M.fixedDimensions, U = w.nodes.some(
            (V) => V.parentId === M.id
          );
          e.style.width = M.dimensions.width + "px", F || K || U ? e.style.height = M.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(M.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!M.selected)), M._validationErrors && M._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const W = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], C = M.runState;
        for (const F of W)
          e.classList.remove(F);
        C && C !== "pending" && e.classList.add(`flow-node-${C}`);
        for (const F of v)
          e.classList.remove(F);
        const T = M.class ? M.class.split(/\s+/).filter(Boolean) : [];
        for (const F of T)
          e.classList.add(F);
        v = T;
        const R = M.shape ? `flow-node-${M.shape}` : "";
        A !== R && (A && e.classList.remove(A), R && e.classList.add(R), A = R);
        const X = t.$data(e.closest("[data-flow-canvas]")), se = M.shape && X?._shapeRegistry?.[M.shape];
        if (se?.clipPath ? e.style.clipPath = se.clipPath : e.style.clipPath = "", M.style) {
          const F = typeof M.style == "string" ? Object.fromEntries(M.style.split(";").filter(Boolean).map((U) => U.split(":").map((V) => V.trim()))) : M.style, K = [];
          for (const [U, V] of Object.entries(F))
            U && V && (e.style.setProperty(U, V), K.push(U));
          for (const U of S)
            K.includes(U) || e.style.removeProperty(U);
          S = K;
        } else if (S.length > 0) {
          for (const F of S)
            e.style.removeProperty(F);
          S = [];
        }
        if (M.rotation ? (e.style.transform = `rotate(${M.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", M.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", M.ariaRole ?? "group"), e.setAttribute("aria-label", M.ariaLabel ?? (M.data?.label ? `Node: ${M.data.label}` : `Node ${M.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), M.domAttributes)
          for (const [F, K] of Object.entries(M.domAttributes))
            F.startsWith("on") || zp.has(F.toLowerCase()) || e.setAttribute(F, K);
        ze(M) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), M.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const ie = e.classList.contains("flow-node-condensed");
        M.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!M.condensed !== ie && requestAnimationFrame(() => {
          M.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, q("condense", `Node "${M.id}" re-measured after condense toggle`, M.dimensions);
        }), M.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const le = M.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), le !== "visible" && e.classList.add(`flow-handles-${le}`);
        let de = zr(M, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(M.id) && (de += M.type === "group" ? Math.max(1 - de, 0) : 1e3), y && (de += 1e3);
        const J = M.type === "group" ? 0 : 2;
        if (de !== J ? e.style.zIndex = String(de) : e.style.removeProperty("z-index"), !Ir(M)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const ee = e.closest(".flow-container");
        s || (s = Dp(e, M.id, {
          container: ee ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => w._animationLocked,
          noDragClassName: w._config?.noDragClassName ?? "nodrag",
          dragThreshold: w._config?.nodeDragThreshold ?? 0,
          getViewport: () => w.viewport,
          getNodePosition: () => {
            const F = w.getNode(M.id);
            return F ? F.parentId ? w.getAbsolutePosition(F.id) : { x: F.position.x, y: F.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: w._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: F, position: K, sourceEvent: U }) {
            e.classList.add("flow-node-dragging"), l = !1, c = !1, d = null;
            const V = w._container ? Re.get(w._container) : void 0;
            V?.bridge && V.bridge.setDragging(F, !0), h?.destroy(), h = null, g = null, p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null, a = w._snapshotHistory?.() ?? null, q("drag", `Node "${F}" drag start`, K);
            const I = w.getNode(F);
            if (I && (w._config?.selectNodesOnDrag !== !1 && I.selectable !== !1 && !w.selectedNodes.has(F) && (ft(U, w._shortcuts?.multiSelect) || w.deselectAll(), w.selectedNodes.add(F), I.selected = !0, w._emitSelectionChange(), c = !0), w._emit("node-drag-start", { node: I }), w.selectedNodes.has(F) && w.selectedNodes.size > 1)) {
              const re = ht(F, w.nodes);
              d = /* @__PURE__ */ new Map();
              for (const G of w.selectedNodes) {
                if (G === F || re.has(G))
                  continue;
                const Y = w.getNode(G);
                Y && Y.draggable !== !1 && d.set(G, { x: Y.position.x, y: Y.position.y });
              }
            }
            w._config?.autoPanOnNodeDrag !== !1 && ee && (f = Rr({
              container: ee,
              speed: w._config?.autoPanSpeed ?? 15,
              onPan(re, G) {
                const Y = () => w._viewportLive ?? w.viewport, te = Y().zoom || 1, z = { x: Y().x, y: Y().y };
                w._panZoom?.setViewport({
                  x: Y().x - re,
                  y: Y().y - G,
                  zoom: te
                });
                const oe = z.x - Y().x, B = z.y - Y().y, j = oe === 0 && B === 0, H = w.getNode(F);
                let Q = !1;
                if (H) {
                  const Z = H.position.x, ae = H.position.y;
                  H.position.x += oe / te, H.position.y += B / te;
                  const fe = An(H.position, H, w._config?.nodeExtent);
                  H.position.x = fe.x, H.position.y = fe.y, Q = H.position.x === Z && H.position.y === ae;
                }
                if (d)
                  for (const [Z] of d) {
                    const ae = w.getNode(Z);
                    if (ae) {
                      ae.position.x += oe / te, ae.position.y += B / te;
                      const fe = An(ae.position, ae, w._config?.nodeExtent);
                      ae.position.x = fe.x, ae.position.y = fe.y;
                    }
                  }
                return j && Q;
              }
            }), U instanceof MouseEvent && f.updatePointer(U.clientX, U.clientY), f.start());
          },
          onDrag({ nodeId: F, position: K, delta: U, sourceEvent: V }) {
            l = !0;
            const I = w.getNode(F);
            if (I) {
              if (I.parentId) {
                const Y = w.getAbsolutePosition(I.parentId);
                let te = K.x - Y.x, z = K.y - Y.y;
                const oe = I.dimensions ?? { width: 150, height: 50 }, B = w.getNode(I.parentId);
                if (B?.childLayout) {
                  y || (e.classList.add("flow-reorder-dragging"), x = I.parentId), y = !0;
                  const j = I.extent !== "parent";
                  if (I.position.x = K.x - Y.x, I.position.y = K.y - Y.y, !j && B.dimensions) {
                    const Z = xo({ x: I.position.x, y: I.position.y }, oe, B.dimensions);
                    I.position.x = Z.x, I.position.y = Z.y;
                  }
                  const H = I.dimensions?.width ?? 150, Q = I.dimensions?.height ?? 50;
                  if (j) {
                    const Z = B.dimensions?.width ?? 150, ae = B.dimensions?.height ?? 50, fe = I.position.x + H / 2, pe = I.position.y + Q / 2, me = 12, Se = x === I.parentId ? 0 : me, Te = fe >= Se && fe <= Z - Se && pe >= Se && pe <= ae - Se, we = /* @__PURE__ */ new Set();
                    let he = I.parentId;
                    for (; he; )
                      we.add(he), he = w.getNode(he)?.parentId;
                    const ke = K.x + H / 2, Ce = K.y + Q / 2, Me = ht(I.id, w.nodes);
                    let Ie = null;
                    const xe = w.nodes.filter(
                      (ge) => ge.id !== I.id && (ge.droppable || ge.childLayout) && !ge.hidden && !Me.has(ge.id) && (Te ? !we.has(ge.id) : ge.id !== I.parentId) && (!ge.acceptsDrop || ge.acceptsDrop(I))
                    );
                    for (const ge of xe) {
                      const Ee = ge.parentId ? w.getAbsolutePosition(ge.id) : ge.position, nt = ge.dimensions?.width ?? 150, yt = ge.dimensions?.height ?? 50, ot = ge.id === p ? 0 : me;
                      ke >= Ee.x + ot && ke <= Ee.x + nt - ot && Ce >= Ee.y + ot && Ce <= Ee.y + yt - ot && (Ie = ge);
                    }
                    const be = Ie?.id ?? null;
                    if (be !== p) {
                      p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), be && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(be)}"]`)?.classList.add("flow-node-drop-target"), p = be;
                      const ge = be ? w.getNode(be) : null, Ee = x;
                      if (ge?.childLayout && be !== x) {
                        Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), x = be;
                        const nt = w.nodes.filter((je) => je.parentId === be && je.id !== F).sort((je, _a) => (je.order ?? 1 / 0) - (_a.order ?? 1 / 0)), yt = nt.length, ot = [...nt];
                        ot.splice(yt, 0, I);
                        for (let je = 0; je < ot.length; je++)
                          ot[je].order = je;
                        m = yt;
                        const Pi = w._initialDimensions?.get(F), Mi = { ...I, dimensions: Pi ? { ...Pi } : void 0 };
                        w.layoutChildren(be, { excludeId: F, includeNode: Mi, shallow: !0 }), w.propagateLayoutUp(be, { includeNode: Mi });
                      } else Te && x !== I.parentId ? (Ee && Ee !== I.parentId && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), x = I.parentId, m = -1) : !be && !Te && (Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), x = null, m = -1);
                    }
                  }
                  if (x) {
                    const Z = w.getNode(x), ae = Z?.childLayout ?? B.childLayout, fe = w.nodes.filter((he) => he.parentId === x && he.id !== F).sort((he, ke) => (he.order ?? 1 / 0) - (ke.order ?? 1 / 0));
                    let pe, me;
                    if (x !== I.parentId) {
                      const he = Z?.parentId ? w.getAbsolutePosition(x) : Z?.position ?? { x: 0, y: 0 };
                      pe = K.x - he.x, me = K.y - he.y;
                    } else
                      pe = I.position.x, me = I.position.y;
                    const Se = ae.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (x === I.parentId) {
                        const he = I.order ?? 0;
                        m = fe.filter((ke) => (ke.order ?? 0) < he).length;
                      } else
                        m = fe.length;
                    const Te = m;
                    let we = fe.length;
                    for (let he = 0; he < fe.length; he++) {
                      const ke = fe[he], Ce = ke.dimensions?.width ?? 150, Me = ke.dimensions?.height ?? 50, Ie = he < Te ? 1 - Se : Se, xe = ke.position.y + Me * Ie, be = ke.position.x + Ce * Ie;
                      if (ae.direction === "grid") {
                        const ge = {
                          x: pe + H / 2,
                          y: me + Q / 2
                        }, Ee = ke.position.y + Me / 2;
                        if (ge.y < ke.position.y) {
                          we = he;
                          break;
                        }
                        if (Math.abs(ge.y - Ee) < Me / 2 && ge.x < be) {
                          we = he;
                          break;
                        }
                      } else if (ae.direction === "vertical") {
                        if ((he < Te ? me : me + Q) < xe) {
                          we = he;
                          break;
                        }
                      } else if ((he < Te ? pe : pe + H) < be) {
                        we = he;
                        break;
                      }
                    }
                    if (we !== m) {
                      m = we;
                      const he = [...fe];
                      he.splice(we, 0, I);
                      for (let xe = 0; xe < he.length; xe++)
                        he[xe].order = xe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), w._layoutAnimFrame && cancelAnimationFrame(w._layoutAnimFrame);
                      const Ce = I.id, Me = x, Ie = Me !== I.parentId;
                      w._layoutAnimFrame = requestAnimationFrame(() => {
                        if (Ie && Me) {
                          const Ee = w.getNode(Ce);
                          let nt;
                          if (Ee) {
                            const yt = w._initialDimensions?.get(Ce);
                            nt = { ...Ee, dimensions: yt ? { ...yt } : void 0 };
                          }
                          w.layoutChildren(Me, {
                            excludeId: Ce,
                            includeNode: nt,
                            shallow: !0
                          }), w.propagateLayoutUp(Me, {
                            includeNode: nt
                          });
                        } else
                          w.layoutChildren(Me, Ce, !0);
                        const xe = performance.now(), be = 300, ge = () => {
                          w._layoutAnimTick++, performance.now() - xe < be ? w._layoutAnimFrame = requestAnimationFrame(ge) : w._layoutAnimFrame = 0;
                        };
                        w._layoutAnimFrame = requestAnimationFrame(ge);
                      });
                    }
                  }
                  f && V instanceof MouseEvent && f.updatePointer(V.clientX, V.clientY);
                  return;
                }
                if (I.extent === "parent" && B?.dimensions) {
                  const j = xo(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = j.x, z = j.y;
                } else if (Array.isArray(I.extent)) {
                  const j = Vr({ x: te, y: z }, I.extent, oe);
                  te = j.x, z = j.y;
                }
                if ((!I.extent || I.extent !== "parent") && (cn(
                  B,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!B?.childLayout) && B?.dimensions) {
                  const Q = xo(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = Q.x, z = Q.y;
                }
                if (I.expandParent && B?.dimensions) {
                  const j = Lf(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  j && (B.dimensions.width = j.width, B.dimensions.height = j.height);
                }
                I.position.x = te, I.position.y = z;
              } else {
                const Y = An(K, I, w._config?.nodeExtent);
                I.position.x = Y.x, I.position.y = Y.y;
              }
              if (w._config?.snapToGrid) {
                const Y = I.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], te = I.dimensions?.width ?? 150, z = I.dimensions?.height ?? 40, oe = I.parentId ? w.getAbsolutePosition(I.id) : I.position;
                e.style.left = oe.x - te * Y[0] + "px", e.style.top = oe.y - z * Y[1] + "px", w._layoutAnimTick++;
              }
              if (w._emit("node-drag", { node: I, position: K }), d)
                for (const [Y, te] of d) {
                  const z = w.getNode(Y);
                  if (z) {
                    let oe = te.x + U.x, B = te.y + U.y;
                    const j = An({ x: oe, y: B }, z, w._config?.nodeExtent);
                    z.position.x = j.x, z.position.y = j.y;
                  }
                }
              const G = w._config?.helperLines;
              if (G) {
                const Y = typeof G == "object" ? G.snap ?? !0 : !0, te = typeof G == "object" ? G.threshold ?? 5 : 5, z = (Z) => {
                  const ae = Z.parentId ? w.getAbsolutePosition(Z.id) : Z.position;
                  return Rp({ ...Z, position: ae }, w._config?.nodeOrigin);
                }, B = (w.selectedNodes.size > 1 && w.selectedNodes.has(F) ? w.nodes.filter((Z) => w.selectedNodes.has(Z.id)) : [I]).map(z), j = {
                  x: Math.min(...B.map((Z) => Z.x)),
                  y: Math.min(...B.map((Z) => Z.y)),
                  width: Math.max(...B.map((Z) => Z.x + Z.width)) - Math.min(...B.map((Z) => Z.x)),
                  height: Math.max(...B.map((Z) => Z.y + Z.height)) - Math.min(...B.map((Z) => Z.y))
                }, H = w.nodes.filter(
                  (Z) => !w.selectedNodes.has(Z.id) && Z.id !== F && Z.hidden !== !0 && Z.filtered !== !0
                ).map(z), Q = Fp(j, H, te);
                if (Y && (Q.snapOffset.x !== 0 || Q.snapOffset.y !== 0) && (I.position.x += Q.snapOffset.x, I.position.y += Q.snapOffset.y, d))
                  for (const [Z] of d) {
                    const ae = w.getNode(Z);
                    ae && (ae.position.x += Q.snapOffset.x, ae.position.y += Q.snapOffset.y);
                  }
                if (u?.remove(), Q.horizontal.length > 0 || Q.vertical.length > 0) {
                  const Z = ee?.querySelector(".flow-viewport");
                  if (Z) {
                    const ae = w.nodes.map(z);
                    u = Xp(Q.horizontal, Q.vertical, ae), Z.appendChild(u);
                  }
                } else
                  u = null;
                w._emit("helper-lines-change", {
                  horizontal: Q.horizontal,
                  vertical: Q.vertical
                });
              }
            }
            if (w._config?.preventOverlap) {
              const G = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, Y = I.dimensions?.width ?? ve, te = I.dimensions?.height ?? _e, z = w.selectedNodes, oe = w.nodes.filter((j) => j.id !== I.id && !j.hidden && !z.has(j.id)).map((j) => Yt(j, w._config?.nodeOrigin)), B = nh(I.position, Y, te, oe, G);
              I.position.x = B.x, I.position.y = B.y;
            }
            if (!I.parentId) {
              const G = ht(I.id, w.nodes), Y = w.nodes.filter(
                (j) => j.id !== I.id && j.droppable && !j.hidden && !G.has(j.id) && (!j.acceptsDrop || j.acceptsDrop(I))
              ), te = Yt(I, w._config?.nodeOrigin);
              let z = null;
              const oe = 12;
              for (const j of Y) {
                const H = j.parentId ? w.getAbsolutePosition(j.id) : j.position, Q = j.dimensions?.width ?? ve, Z = j.dimensions?.height ?? _e, ae = te.x + te.width / 2, fe = te.y + te.height / 2, pe = j.id === p ? 0 : oe;
                ae >= H.x + pe && ae <= H.x + Q - pe && fe >= H.y + pe && fe <= H.y + Z - pe && (z = j);
              }
              const B = z?.id ?? null;
              B !== p && (p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), B && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(B)}"]`)?.classList.add("flow-node-drop-target"), p = B);
            }
            if (w._config?.proximityConnect) {
              const G = w._config.proximityConnectDistance ?? 150, Y = I.dimensions ?? { width: 150, height: 50 }, te = {
                x: I.position.x + Y.width / 2,
                y: I.position.y + Y.height / 2
              }, z = w.nodes.filter((B) => B.id !== I.id && !B.hidden).map((B) => ({
                id: B.id,
                center: {
                  x: B.position.x + (B.dimensions?.width ?? 150) / 2,
                  y: B.position.y + (B.dimensions?.height ?? 50) / 2
                }
              })), oe = Op(I.id, te, z, G);
              if (oe)
                if (w.edges.some(
                  (j) => j.source === oe.source && j.target === oe.target || j.source === oe.target && j.target === oe.source
                ))
                  h?.destroy(), h = null, g = null;
                else {
                  if (g = oe, !h) {
                    h = Ht({
                      connectionLineType: w._config?.connectionLineType,
                      connectionLineStyle: w._config?.connectionLineStyle,
                      connectionLine: w._config?.connectionLine
                    });
                    const j = ee?.querySelector(".flow-viewport");
                    j && j.appendChild(h.svg);
                  }
                  h.update({
                    fromX: te.x,
                    fromY: te.y,
                    toX: oe.targetCenter.x,
                    toY: oe.targetCenter.y,
                    source: oe.source
                  });
                }
              else
                h?.destroy(), h = null, g = null;
            }
            const re = w._container ? Re.get(w._container) : void 0;
            if (re?.bridge) {
              if (re.bridge.pushLocalNodeUpdate(F, { position: I.position }), d)
                for (const [G] of d) {
                  const Y = w.getNode(G);
                  Y && re.bridge.pushLocalNodeUpdate(G, { position: Y.position });
                }
              if (re.awareness && V instanceof MouseEvent && w._container) {
                const G = w._container.getBoundingClientRect(), Y = w._viewportLive ?? w.viewport, te = (V.clientX - G.left - Y.x) / Y.zoom, z = (V.clientY - G.top - Y.y) / Y.zoom;
                re.awareness.updateCursor({ x: te, y: z });
              }
            }
            f && V instanceof MouseEvent && f.updatePointer(V.clientX, V.clientY);
          },
          onDragEnd({ nodeId: F, position: K }) {
            e.classList.remove("flow-node-dragging"), q("drag", `Node "${F}" drag end`, K);
            const U = w._container ? Re.get(w._container) : void 0;
            U?.bridge && U.bridge.setDragging(F, !1), f?.stop(), f = null, u?.remove(), u = null, w._config?.helperLines && w._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const V = w.getNode(F);
            if (V && w._emit("node-drag-end", { node: V, position: K }), y && V?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const I = x;
              y = !1, m = -1, x = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), p ? (ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Mo(w, F, p), p = null) : I && I !== V.parentId ? (w.layoutChildren(I, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(I, { omitFromComputation: F }), w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })) : (w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })), d = null, w._layoutAnimTick++, As(w, l, a), a = null, l = !1;
              return;
            }
            if (V && p)
              ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Mo(w, F, p), p = null;
            else if (V && V.parentId && !p) {
              const I = cn(
                w.getNode(V.parentId),
                w._config?.childValidationRules ?? {}
              ), re = w.getNode(V.parentId);
              if (!I?.preventChildEscape && !re?.childLayout && re?.dimensions) {
                const G = V.position.x, Y = V.position.y, te = V.dimensions?.width ?? 150, z = V.dimensions?.height ?? 50;
                (G + te < 0 || Y + z < 0 || G > re.dimensions.width || Y > re.dimensions.height) && Mo(w, F, null);
              }
              p = null;
            } else
              p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null;
            if (w._config?.proximityConnect && g) {
              const I = g;
              h?.destroy(), h = null, g = null;
              let re = !0;
              if (w._config.onProximityConnect && w._config.onProximityConnect({
                source: I.source,
                target: I.target,
                distance: I.distance
              }) === !1 && (re = !1), re) {
                const G = {
                  source: I.source,
                  sourceHandle: "source",
                  target: I.target,
                  targetHandle: "target"
                };
                if (ct(G, w.edges, { preventCycles: w._config?.preventCycles }) && lt(G, w._config?.connectionRules, w._nodeMap) && (ee ? Ge(ee, G, w.edges) : !0) && (ee ? Ke(ee, G) : !0) && (!w._config.isValidConnection || w._config.isValidConnection(G))) {
                  if (w._config.proximityConnectConfirm) {
                    const j = ee?.querySelector(`[data-flow-node-id="${CSS.escape(I.source)}"]`), H = ee?.querySelector(`[data-flow-node-id="${CSS.escape(I.target)}"]`);
                    j?.classList.add("flow-proximity-confirm"), H?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      j?.classList.remove("flow-proximity-confirm"), H?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const B = `e-${I.source}-${I.target}-${Date.now()}-${Vp++}`;
                  w.addEdges({ id: B, ...G }), w._emit("connect", { connection: G });
                }
              }
            } else
              h?.destroy(), h = null, g = null;
            d = null, l && w._layoutAnimTick++, As(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const M = t.$data(e.closest("[x-data]"));
        if (M?._config?.easyConnect) {
          const w = M._config.easyConnectKey ?? "alt", _ = (D) => {
            if (!Bp(D, w) || D.target.closest("[data-flow-handle-type]")) return;
            const L = t.$data(e.closest("[x-data]"));
            if (!L || L._animationLocked || L._connectValidating) return;
            const O = o(n);
            if (!O) return;
            const W = L.getNode(O.id);
            if (!W || W.connectable === !1) return;
            D.preventDefault(), D.stopPropagation(), D.stopImmediatePropagation();
            const C = qp(e, D.clientX, D.clientY), T = C?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const R = e.closest(".flow-container");
            if (!R) return;
            const X = L._viewportLive ?? L.viewport, se = X?.zoom || 1, ne = X?.x || 0, ie = X?.y || 0, le = R.getBoundingClientRect();
            let de, ue;
            if (C) {
              const I = C.getBoundingClientRect();
              de = (I.left + I.width / 2 - le.left - ne) / se, ue = (I.top + I.height / 2 - le.top - ie) / se;
            } else {
              const I = e.getBoundingClientRect();
              de = (I.left + I.width / 2 - le.left - ne) / se, ue = (I.top + I.height / 2 - le.top - ie) / se;
            }
            L._emit("connect-start", { source: O.id, sourceHandle: T });
            const J = Ht({
              connectionLineType: L._config?.connectionLineType,
              connectionLineStyle: L._config?.connectionLineStyle,
              connectionLine: L._config?.connectionLine
            }), ce = R.querySelector(".flow-viewport");
            ce && ce.appendChild(J.svg), J.update({ fromX: de, fromY: ue, toX: de, toY: ue, source: O.id, sourceHandle: T }), L.pendingConnection = { source: O.id, sourceHandle: T, position: { x: de, y: ue } }, ln(R, O.id, T, L);
            let ee = eo(R, L, D.clientX, D.clientY), F = null;
            const K = L._config?.connectionSnapRadius ?? 20, U = (I) => {
              const re = L.screenToFlowPosition(I.clientX, I.clientY), G = an({
                containerEl: R,
                handleType: "target",
                excludeNodeId: O.id,
                cursorFlowPos: re,
                connectionSnapRadius: K,
                getNode: (Y) => L.getNode(Y),
                toFlowPosition: (Y, te) => L.screenToFlowPosition(Y, te)
              });
              G.element !== F && (F?.classList.remove("flow-handle-active"), G.element?.classList.add("flow-handle-active"), F = G.element), J.update({ fromX: de, fromY: ue, toX: G.position.x, toY: G.position.y, source: O.id, sourceHandle: T }), L.pendingConnection = { ...L.pendingConnection, position: G.position }, ee?.updatePointer(I.clientX, I.clientY);
            }, V = async (I) => {
              ee?.stop(), ee = null, document.removeEventListener("pointermove", U), document.removeEventListener("pointerup", V), J.destroy(), F?.classList.remove("flow-handle-active"), Pe(R), e.classList.remove("flow-easy-connecting");
              const re = L.screenToFlowPosition(I.clientX, I.clientY), G = { source: O.id, sourceHandle: T, position: re };
              L.pendingConnection = null;
              let Y = F;
              if (Y || (Y = document.elementFromPoint(I.clientX, I.clientY)?.closest('[data-flow-handle-type="target"]')), !Y) {
                L._emit("connect-end", { connection: null, ...G });
                return;
              }
              const z = Y.closest("[x-flow-node]")?.dataset.flowNodeId, oe = Y.dataset.flowHandleId ?? "target";
              if (!z) {
                L._emit("connect-end", { connection: null, ...G });
                return;
              }
              const B = { source: O.id, sourceHandle: T, target: z, targetHandle: oe }, j = await Hr({ connection: B, canvas: L, containerEl: R });
              L._emit("connect-end", {
                connection: j.applied ? B : null,
                ...G
              });
            };
            document.addEventListener("pointermove", U), document.addEventListener("pointerup", V);
          };
          e.addEventListener("pointerdown", _, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", _, { capture: !0 });
          });
        }
      }
      const $ = (M) => {
        if (M.key !== "Enter" && M.key !== " ") return;
        M.preventDefault();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        _ && (_._animationLocked || Uo(w) && (_._emit("node-click", { node: w, event: M }), M.stopPropagation(), ft(M, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1) : (_.selectedNodes.add(w.id), w.selected = !0) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0), _._emitSelectionChange()));
      };
      e.addEventListener("keydown", $);
      const b = () => {
        const M = t.$data(e.closest("[x-data]"));
        if (!M?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const _ = w.parentId ? M.getAbsolutePosition(w.id) : w.position;
        M.setCenter(
          _.x + (w.dimensions?.width ?? 150) / 2,
          _.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", b);
      const E = (M) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_ && !_._animationLocked && (_._emit("node-click", { node: w, event: M }), !!Uo(w))) {
          if (M.stopPropagation(), c) {
            c = !1;
            return;
          }
          ft(M, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), q("selection", `Node "${w.id}" deselected (shift)`)) : (_.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), q("selection", `Node "${w.id}" selected (shift)`)) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), q("selection", `Node "${w.id}" selected`)), _._emitSelectionChange();
        }
      };
      e.addEventListener("click", E);
      const N = (M) => {
        M.preventDefault(), M.stopPropagation();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_)
          if (_.selectedNodes.size > 1 && _.selectedNodes.has(w.id)) {
            const D = _.nodes.filter((L) => _.selectedNodes.has(L.id));
            _._emit("selection-context-menu", { nodes: D, event: M });
          } else
            _._emit("node-context-menu", { node: w, event: M });
      };
      e.addEventListener("contextmenu", N), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        const w = t.$data(e.closest("[x-data]"));
        M.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, q("init", `Node "${M.id}" measured`, M.dimensions), w?._nodeElements?.set(M.id, e), M.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), u?.remove(), u = null, h?.destroy(), h = null, e.removeEventListener("keydown", $), e.removeEventListener("focus", b), e.removeEventListener("click", E), e.removeEventListener("contextmenu", N);
        const M = e.dataset.flowNodeId;
        if (M) {
          const w = t.$data(e.closest("[x-data]"));
          w?._nodeElements?.delete(M), w?._resizeObserver?.unobserve(e);
        }
      });
    }
  );
}
const Lt = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function Wp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), f = t.includes("right"), u = t.includes("top"), h = t.includes("bottom");
  let g = o.width;
  f ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  h ? p = o.height + e.y : u && (p = o.height - e.y), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)));
  const y = g - o.width, m = p - o.height, x = d ? n.x - y : n.x, k = u ? n.y - m : n.y;
  return {
    position: { x, y: k },
    dimensions: { width: g, height: p }
  };
}
const la = ["top-left", "top-right", "bottom-left", "bottom-right"], ca = ["top", "right", "bottom", "left"], jp = [...la, ...ca], Up = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Zp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Kp(o);
      let a = { ...Lt };
      if (n)
        try {
          const d = i(n);
          a = { ...Lt, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const f = document.createElement("div");
        f.className = `flow-resizer-handle flow-resizer-handle-${d}`, f.style.cursor = Up[d], f.dataset.flowResizeDirection = d, e.appendChild(f), c.push(f), f.addEventListener("pointerdown", (u) => {
          u.preventDefault(), u.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const g = e.closest("[x-data]");
          if (!g) return;
          const p = t.$data(g), y = h.dataset.flowNodeId;
          if (!y || !p) return;
          const m = p.getNode(y);
          if (!m || !as(m)) return;
          m.fixedDimensions = !0;
          const x = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === Lt.minWidth && (x.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === Lt.minHeight && (x.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === Lt.maxWidth && (x.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === Lt.maxHeight && (x.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const E = p.viewport?.zoom || 1, N = h.getBoundingClientRect();
            m.dimensions = { width: N.width / E, height: N.height / E };
          }
          const k = { x: m.position.x, y: m.position.y }, v = { width: m.dimensions.width, height: m.dimensions.height }, A = p.viewport?.zoom || 1, S = u.clientX, P = u.clientY;
          p._captureHistory?.(), q("resize", `Resize start on "${y}" (${d})`, v), p._emit("node-resize-start", { node: m, dimensions: { ...v } });
          const $ = (E) => {
            const N = {
              x: (E.clientX - S) / A,
              y: (E.clientY - P) / A
            }, M = Wp(
              d,
              N,
              k,
              v,
              x,
              p._config?.snapToGrid ?? !1
            );
            if (m.position.x = M.position.x, m.position.y = M.position.y, m.dimensions.width = M.dimensions.width, m.dimensions.height = M.dimensions.height, m.parentId) {
              const w = p.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${M.position.x}px`, h.style.top = `${M.position.y}px`;
            h.style.width = `${M.dimensions.width}px`, h.style.height = `${M.dimensions.height}px`, p._layoutAnimTick++, p._emit("node-resize", { node: m, dimensions: { ...M.dimensions } });
          }, b = () => {
            document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", b), document.removeEventListener("pointercancel", b), q("resize", `Resize end on "${y}"`, m.dimensions), p._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", $), document.addEventListener("pointerup", b), document.addEventListener("pointercancel", b);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const f = e.closest("[x-data]");
        if (!f) return;
        const u = t.$data(f), h = d.dataset.flowNodeId;
        if (!h || !u) return;
        const g = u.getNode(h);
        if (!g) return;
        const p = !as(g);
        for (const y of c)
          y.style.display = p ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function Kp(t) {
  if (t.includes("corners"))
    return la;
  if (t.includes("edges"))
    return ca;
  const e = t.includes("top"), n = t.includes("bottom"), o = t.includes("left"), i = t.includes("right");
  if (e || n || o || i) {
    if (e && o) return ["top-left"];
    if (e && i) return ["top-right"];
    if (n && o) return ["bottom-left"];
    if (n && i) return ["bottom-right"];
    if (e) return ["top"];
    if (n) return ["bottom"];
    if (o) return ["left"];
    if (i) return ["right"];
  }
  return jp;
}
function Gp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function Jp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Qp(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("snap"), a = l && n && Number(i(n)) || 15;
      e.classList.add("flow-rotate-handle"), e.style.cursor = "grab";
      const c = (d) => {
        d.preventDefault(), d.stopPropagation();
        const f = e.closest("[x-flow-node]");
        if (!f) return;
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const h = t.$data(u), g = f.dataset.flowNodeId;
        if (!g || !h) return;
        const p = h.getNode(g);
        if (!p) return;
        const y = f.getBoundingClientRect(), m = y.left + y.width / 2, x = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const k = (A) => {
          let S = Gp(
            A.clientX,
            A.clientY,
            m,
            x
          );
          l && (S = Jp(S, a)), p.rotation = S;
        }, v = () => {
          document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", v), e.style.cursor = "grab", h._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", k), document.addEventListener("pointerup", v);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function eg(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const tg = "application/alpineflow";
function ng(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(tg, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function og(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (n.has(o.id) || o.source === o.target)
      continue;
    const i = t.find(
      (r) => r.id !== o.id && r.source === o.target && r.target === o.source && !n.has(r.id)
    );
    i && (e.push({ primaryId: o.id, mirrorId: i.id }), n.add(o.id), n.add(i.id));
  }
  return e;
}
function ig(t) {
  t.directive(
    "flow-viewport",
    (e, {}, { effect: n, cleanup: o }) => {
      e.classList.add("flow-viewport");
      const i = t.$data(e.closest("[x-data]"));
      if (!i?.edges) return;
      i._viewportEl = e;
      const r = i.viewport;
      r && (e.style.transform = `translate(${r.x}px, ${r.y}px) scale(${r.zoom})`);
      const s = document.createElement("div");
      s.classList.add("flow-edges"), e.insertBefore(s, e.firstChild);
      const l = /* @__PURE__ */ new Map();
      n(() => {
        const a = i.edges, c = new Set(a.map((p) => p.id));
        for (const [p, y] of l)
          c.has(p) || (t.destroyTree(y), y.remove(), l.delete(p), i._edgeSvgElements?.delete(p));
        for (const p of a) {
          if (l.has(p.id)) continue;
          const y = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          y.setAttribute("class", "flow-edge-svg");
          const m = document.createElementNS("http://www.w3.org/2000/svg", "g");
          y.appendChild(m), t.addScopeToNode(m, { edge: p }), m.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(y);
          }), l.set(p.id, y), i._edgeSvgElements?.set(p.id, y), t.initTree(m);
        }
        const f = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        f && f.remove();
        const u = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
        if (u) {
          const p = og(
            a
          );
          for (const y of p)
            h.add(y.primaryId), g.add(y.mirrorId);
        }
        for (const p of a) {
          const y = h.has(p.id), m = g.has(p.id);
          !!p._renderDualMarker !== y && (p._renderDualMarker = y ? !0 : void 0), !!p._hiddenByCollapse !== m && (p._hiddenByCollapse = m ? !0 : void 0);
        }
        for (const p of a) {
          const y = l.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), x = i.getNode?.(p.target), k = p.hidden || p._hiddenByCollapse || m?.hidden || x?.hidden;
          y.style.display = k ? "none" : "";
        }
        for (const p of a) {
          const y = l.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), x = i.getNode?.(p.target);
          m?.filtered || x?.filtered ? y.classList.add("flow-edge-filtered") : y.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [a, c] of l)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(a);
        l.clear(), s.remove();
      });
    }
  );
}
const sg = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], rg = "a, button, input, textarea, select, [contenteditable]", ag = 100, lg = 60, cg = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), dg = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), ug = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), fg = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function hg(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && sg.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function Pt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function pg(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function gg(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (cg.has(e) && (t.style.top = "0"), dg.has(e) && (t.style.bottom = "0")), o && !n && (ug.has(e) && (t.style.left = "0"), fg.has(e) && (t.style.right = "0"));
}
function mg(t) {
  t.directive(
    "flow-panel",
    (e, { value: n, modifiers: o }, { cleanup: i }) => {
      const {
        position: r,
        isStatic: s,
        isFixed: l,
        noResize: a,
        constrained: c,
        fillWidth: d,
        fillHeight: f
      } = hg(n, o), u = d || f, h = !s && !l && !u, g = !s && !a && !u;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || u) && e.classList.add("flow-panel-locked"), (a || u) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), f && e.classList.add("flow-panel-fill-height"), u && gg(e, r, d, f);
      const p = (A) => A.stopPropagation();
      e.addEventListener("mousedown", p), e.addEventListener("pointerdown", p), e.addEventListener("wheel", p);
      const y = e.parentElement, m = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, x = `flow-panel-${r}`, k = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(x) || e.classList.add(x);
      };
      y.addEventListener("flow-panel-reset", k), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let v = null;
      if (h) {
        let A = !1, S = 0, P = 0, $ = 0, b = 0;
        const E = () => {
          const _ = e.getBoundingClientRect(), D = y.getBoundingClientRect();
          return {
            x: _.left - D.left,
            y: _.top - D.top
          };
        }, N = (_) => {
          if (!A) return;
          let D = $ + (_.clientX - S), L = b + (_.clientY - P);
          if (c) {
            const O = pg(
              D,
              L,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            D = O.left, L = O.top;
          }
          e.style.left = `${D}px`, e.style.top = `${L}px`, Pt(y, "panel-drag", {
            panel: e,
            position: { x: D, y: L }
          });
        }, M = () => {
          if (!A) return;
          A = !1, document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M);
          const _ = E();
          Pt(y, "panel-drag-end", {
            panel: e,
            position: _
          });
        }, w = (_) => {
          const D = _.target;
          if (D.closest(rg) || D.closest(".flow-panel-resize-handle"))
            return;
          A = !0, S = _.clientX, P = _.clientY;
          const L = e.getBoundingClientRect(), O = y.getBoundingClientRect();
          $ = L.left - O.left, b = L.top - O.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${$}px`, e.style.top = `${b}px`, document.addEventListener("pointermove", N), document.addEventListener("pointerup", M), document.addEventListener("pointercancel", M), Pt(y, "panel-drag-start", {
            panel: e,
            position: { x: $, y: b }
          });
        };
        if (e.addEventListener("pointerdown", w), g) {
          v = document.createElement("div"), v.classList.add("flow-panel-resize-handle"), e.appendChild(v);
          let _ = !1, D = 0, L = 0, O = 0, W = 0;
          const C = (X) => {
            if (!_) return;
            const se = Math.max(ag, O + (X.clientX - D)), ne = Math.max(lg, W + (X.clientY - L));
            e.style.width = `${se}px`, e.style.height = `${ne}px`, Pt(y, "panel-resize", {
              panel: e,
              dimensions: { width: se, height: ne }
            });
          }, T = () => {
            _ && (_ = !1, document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", T), document.removeEventListener("pointercancel", T), Pt(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, R = (X) => {
            X.stopPropagation(), _ = !0, D = X.clientX, L = X.clientY, O = e.offsetWidth, W = e.offsetHeight, document.addEventListener("pointermove", C), document.addEventListener("pointerup", T), document.addEventListener("pointercancel", T), Pt(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: O, height: W }
            });
          };
          v.addEventListener("pointerdown", R), i(() => {
            e.removeEventListener("pointerdown", w), v?.removeEventListener("pointerdown", R), document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", T), document.removeEventListener("pointercancel", T), v?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", k), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", k), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", k), y.__flowPanels?.delete(e);
        });
    }
  );
}
function yg(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = wg(n), l = vg(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const a = (d) => {
        d.stopPropagation();
      }, c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("pointerdown", a), e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const f = e.closest("[x-data]");
        if (!f) return;
        const u = t.$data(f);
        if (!u?.viewport) return;
        const h = u.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, y = p ? u.getNode(p) : null, m = y?.dimensions?.width ?? d.offsetWidth, x = y?.dimensions?.height ?? d.offsetHeight, k = g / h;
        let v, A, S, P;
        s === "top" || s === "bottom" ? (A = s === "top" ? -k : x + k, P = s === "top" ? "-100%" : "0%", l === "start" ? (v = 0, S = "0%") : l === "end" ? (v = m, S = "-100%") : (v = m / 2, S = "-50%")) : (v = s === "left" ? -k : m + k, S = s === "left" ? "-100%" : "0%", l === "start" ? (A = 0, P = "0%") : l === "end" ? (A = x, P = "-100%") : (A = x / 2, P = "-50%")), e.style.left = `${v}px`, e.style.top = `${A}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${S}, ${P})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function wg(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function vg(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function _g(t) {
  t.directive(
    "flow-context-menu",
    (e, { modifiers: n, expression: o }, { effect: i, evaluate: r, cleanup: s }) => {
      const l = n[0];
      if (!l) {
        console.warn("[AlpineFlow] x-flow-context-menu requires a type modifier: .node, .edge, .pane, or .selection");
        return;
      }
      const a = e, c = a.closest("[x-data]");
      if (!c) return;
      const d = t.$data(c);
      let f = 0, u = 0;
      if (o) {
        const S = r(o);
        f = S?.offsetX ?? 0, u = S?.offsetY ?? 0;
      }
      a.setAttribute("role", "menu"), a.setAttribute("tabindex", "-1"), a.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let g = null;
      const p = 4, y = () => {
        g = document.activeElement;
        const S = d.contextMenu.x + f, P = d.contextMenu.y + u;
        a.style.display = "", a.style.position = "fixed", a.style.left = S + "px", a.style.top = P + "px", a.style.zIndex = "5000", a.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((w) => {
          w.setAttribute("role", "menuitem"), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1");
        });
        const $ = a.getBoundingClientRect(), b = window.innerWidth, E = window.innerHeight;
        let N = S, M = P;
        $.right > b - p && (N = b - $.width - p), $.bottom > E - p && (M = E - $.height - p), N < p && (N = p), M < p && (M = p), a.style.left = N + "px", a.style.top = M + "px", h.style.display = "", a.focus({ preventScroll: !0 });
      }, m = () => {
        a.style.display = "none", h.style.display = "none", g && document.contains(g) && (g.focus({ preventScroll: !0 }), g = null);
      };
      i(() => {
        const S = d.contextMenu;
        S.show && S.type === l ? y() : m();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (S) => {
        S.preventDefault(), d.closeContextMenu();
      });
      const x = () => {
        d.contextMenu.show && d.contextMenu.type === l && d.closeContextMenu();
      };
      window.addEventListener("scroll", x, !0);
      const k = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), v = (S) => Array.from(S.querySelectorAll(
        "button:not([disabled])"
      )), A = (S) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const P = document.activeElement, $ = P?.closest(".flow-context-submenu"), b = $ ? v($) : k();
        if (b.length === 0) return;
        const E = b.indexOf(P);
        switch (S.key) {
          case "ArrowDown": {
            S.preventDefault();
            const N = E < b.length - 1 ? E + 1 : 0;
            b[N].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            S.preventDefault();
            const N = E > 0 ? E - 1 : b.length - 1;
            b[N].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (S.preventDefault(), S.shiftKey) {
              const N = E > 0 ? E - 1 : b.length - 1;
              b[N].focus({ preventScroll: !0 });
            } else {
              const N = E < b.length - 1 ? E + 1 : 0;
              b[N].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            S.preventDefault(), P?.click();
            break;
          }
          case "ArrowRight": {
            if (!$) {
              const N = P?.querySelector(".flow-context-submenu");
              N && (S.preventDefault(), N.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            $ && (S.preventDefault(), $.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", A), s(() => {
        h.remove(), window.removeEventListener("scroll", x, !0), a.removeEventListener("keydown", A);
      });
    }
  );
}
const bg = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function xg(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), f = a.has("queue"), u = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let g = null, p = [], y = !1, m = !1, x = !1;
      function k() {
        const N = r(i);
        return Array.isArray(N) ? N : N && typeof N == "object" ? [N] : [];
      }
      function v() {
        const N = e.closest("[x-data]");
        return N ? t.$data(N) : null;
      }
      function A(N, M = !1) {
        const w = v();
        if (!w?.timeline) return Promise.resolve();
        const _ = w.timeline();
        if (M) {
          for (let D = N.length - 1; D >= 0; D--)
            _.step(N[D]);
          _.reverse();
        } else
          for (const D of N)
            D.parallel ? _.parallel(D.parallel) : _.step(D);
        return g = _, _.play().then(() => {
          g === _ && (g = null);
        });
      }
      function S(N = !1) {
        if (c && m) return;
        m = !0;
        const M = k();
        if (M.length === 0) return;
        const w = () => A(M, N);
        f ? (p.push(w), P()) : (g?.stop(), g = null, p = [], y = !1, w());
      }
      async function P() {
        if (!y) {
          for (y = !0; p.length > 0; )
            await p.shift()();
          y = !1;
        }
      }
      if (u) {
        s(() => {
          const N = k(), M = v();
          M?.registerAnimation && M.registerAnimation(u, N);
        }), l(() => {
          const N = v();
          N?.unregisterAnimation && N.unregisterAnimation(u);
        });
        return;
      }
      const $ = () => {
        d && h === "click" ? (S(x), x = !x) : S(!1);
      };
      e.addEventListener(h, $);
      let b = null, E = null;
      d && h !== "click" && (E = bg[h] ?? null, E && (b = () => S(!0), e.addEventListener(E, b))), l(() => {
        g?.stop(), e.removeEventListener(h, $), E && b && e.removeEventListener(E, b);
      });
    }
  );
}
function Eg(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? ve, a = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, f = (r + l) * n.zoom + n.x, u = (s + a) * n.zoom + n.y;
  return f > 0 && c < o && u > 0 && d < i;
}
function Cg(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !Eg(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function Sg(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, l = null, a = [], c = !1, d = "idle", f = 0;
      function u() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const x = u();
        if (!x?.timeline) return Promise.resolve();
        const k = x.timeline(), v = m.speed ?? 1, A = m.autoFitView === !0, S = m.fitViewPadding ?? 0.1, P = x.viewport, $ = x.getContainerDimensions?.();
        for (const b of y) {
          const E = v !== 1 ? {
            ...b,
            duration: b.duration !== void 0 ? b.duration / v : void 0,
            delay: b.delay !== void 0 ? b.delay / v : void 0
          } : b;
          if (E.parallel) {
            const N = E.parallel.map(
              (M) => v !== 1 ? {
                ...M,
                duration: M.duration !== void 0 ? M.duration / v : void 0,
                delay: M.delay !== void 0 ? M.delay / v : void 0
              } : M
            );
            k.parallel(N);
          } else if (A && P && $ && Cg(E, x, P, $.width, $.height)) {
            const N = {
              fitView: !0,
              fitViewPadding: S,
              duration: E.duration,
              easing: E.easing
            };
            k.parallel([E, N]);
          } else
            k.step(E);
        }
        if (m.lock && k.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const b = m.loop === !0 ? 0 : m.loop;
          k.loop(b);
        }
        return m.respectReducedMotion !== void 0 && k.respectReducedMotion(m.respectReducedMotion), l = k, d = "playing", c = !0, k.play().then(() => {
          l === k && (l = null, d = "idle", c = !1);
        });
      }
      async function g(y) {
        if (a.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          l?.stop(), l = null, c = !1, d = "idle";
          const x = [a[a.length - 1]];
          s += a.length, a = [], await h(x, y);
        } else {
          const x = [...a];
          s += x.length, a = [], c && await new Promise((v) => {
            l ? (l.on("complete", () => v()), l.on("stop", () => v())) : v();
          }), await h(x, y);
        }
      }
      const p = {
        async play() {
          const y = o(n), m = y.steps ?? [];
          s < m.length && (a = m.slice(s), await g(y));
        },
        stop() {
          l?.stop(), l = null, c = !1, d = "stopped", a = [];
        },
        reset(y) {
          if (l?.stop(), l = null, c = !1, d = "idle", s = 0, a = [], f = 0, y) {
            const m = o(n), x = m.steps ?? [];
            if (x.length > 0)
              return a = [...x], g(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, x = y.autoplay !== !1;
        if (m.length > f) {
          const k = m.slice(Math.max(s, f));
          f = m.length, k.length > 0 && x && (a.push(...k), g(y));
        } else
          f = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function kg(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("all"), a = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), f = () => {
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const h = t.$data(u);
        if (!h) return;
        if (l) {
          for (const p of h.nodes)
            a ? h.expandNode?.(p.id, { animate: !d }) : h.collapseNode?.(p.id, { animate: !d });
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        if (c && n) {
          const p = i(n);
          if (!p) return;
          for (const y of h.nodes)
            y.parentId === p && (a ? h.expandNode?.(y.id, { animate: !d }) : h.collapseNode?.(y.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        const g = i(n);
        !g || !h?.toggleNode || h.toggleNode(g, { animate: !d });
      };
      e.addEventListener("click", f), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !l && !c && r(() => {
        const u = i(n);
        if (!u) return;
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const g = t.$data(h);
        if (!g?.isCollapsed) return;
        const p = g.isCollapsed(u);
        e.setAttribute("aria-expanded", String(!p));
        const y = e.closest("[x-flow-node]");
        y && e.setAttribute("aria-controls", y.id || u);
      }), s(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Lg(t) {
  t.directive(
    "flow-condense",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = () => {
        const a = i(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleCondense && d.toggleCondense(a);
      };
      e.addEventListener("click", l), e.setAttribute("data-flow-condense", ""), e.style.cursor = "pointer", r(() => {
        const a = i(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        if (!d?.isCondensed) return;
        const f = d.isCondensed(a);
        e.setAttribute("aria-expanded", String(!f));
      }), s(() => {
        e.removeEventListener("click", l);
      });
    }
  );
}
function To(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Pg(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      try {
        const u = s.closest(".flow-container");
        return u ? !!t.$data?.(u)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const u = s.closest(".flow-container");
        return u ? !!t.$data?.(u)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    };
    s.classList.add("flow-schema-node");
    const d = () => {
      const u = l(), h = u?.data;
      if (!h) {
        To(s);
        return;
      }
      const g = typeof h.label == "string" ? h.label : "", p = Array.isArray(h.fields) ? h.fields : [], y = typeof u?.id == "string" ? u.id : "";
      typeof h.kind == "string" && h.kind ? s.setAttribute("data-flow-schema-kind", h.kind) : s.removeAttribute("data-flow-schema-kind"), To(s);
      const m = a(), x = c(), k = document.createElement("div");
      k.className = "flow-schema-header", k.textContent = g, s.appendChild(k);
      const v = document.createElement("div");
      v.className = "flow-schema-body";
      for (const A of p)
        v.appendChild(f(A, y, m, x));
      s.appendChild(v), t.initTree(v);
    }, f = (u, h, g, p) => {
      const y = document.createElement("div");
      y.className = "flow-schema-row", y.dataset.flowSchemaField = u.name, u.key === "primary" && y.classList.add("flow-schema-row--pk"), u.key === "foreign" && y.classList.add("flow-schema-row--fk"), u.required && y.classList.add("flow-schema-row--required"), h && y.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${h}.${u.name}`)
      ), g && y.setAttribute("x-schema-reorderable", ""), p && h && y.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${h}.${u.name}`)
      );
      const m = document.createElement("div");
      if (m.className = "flow-schema-handle flow-schema-handle--target", m.setAttribute("x-flow-handle:target.left", JSON.stringify(u.name)), y.appendChild(m), u.icon) {
        const P = document.createElement("span");
        P.className = "flow-schema-row-icon", P.textContent = u.icon, y.appendChild(P);
      }
      const x = document.createElement("span");
      x.className = "flow-schema-row-name", x.textContent = u.name, y.appendChild(x);
      const k = document.createElement("span");
      k.className = "flow-schema-row-type", k.textContent = u.type, y.appendChild(k);
      const v = document.createElement("div");
      v.className = "flow-schema-handle flow-schema-handle--source", v.setAttribute("x-flow-handle:source.right", JSON.stringify(u.name)), y.appendChild(v);
      const A = document.createElement("div");
      A.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", A.setAttribute("x-flow-handle:target.right", JSON.stringify(u.name)), y.appendChild(A);
      const S = document.createElement("div");
      return S.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", S.setAttribute("x-flow-handle:source.left", JSON.stringify(u.name)), y.appendChild(S), y;
    };
    i(() => {
      if (!s.isConnected) return;
      const u = l()?.data;
      u?.label, u?.kind;
      const h = u?.fields;
      if (Array.isArray(h))
        for (const g of h)
          g.name, g.type, g.key, g.required, g.icon;
      d();
    }), r(() => {
      To(s), s.classList.remove("flow-schema-node");
    });
  });
}
function Mg(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Ns(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Tg(t) {
  t.directive("flow-wait", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    };
    s.classList.add("flow-wait-node"), s.setAttribute("data-flow-wait", "true");
    const a = () => {
      Ns(s);
      const d = l()?.data;
      if (!d) return;
      const f = typeof d.label == "string" && d.label ? d.label : "Wait", u = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, g = document.createElement("div");
      if (g.className = "flow-wait-header", u) {
        const k = document.createElement("span");
        k.className = "flow-wait-icon", k.textContent = u, g.appendChild(k);
      }
      const p = document.createElement("span");
      p.className = "flow-wait-label", p.textContent = f, g.appendChild(p);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = Mg(h), g.appendChild(y), s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-wait-handle flow-wait-handle--target", m.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-wait-handle flow-wait-handle--source", x.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(x), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = l()?.data;
      c?.durationMs, c?.label, c?.icon, a();
    }), r(() => {
      Ns(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const $s = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function rn(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(rn).join(", ")}]` : String(t);
}
function Ag(t) {
  const { field: e, op: n, value: o } = t;
  return n in $s ? `${e} ${$s[n]} ${rn(o)}` : n === "in" ? `${e} in ${rn(o)}` : n === "notIn" ? `${e} not in ${rn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${rn(o)}`;
}
function Is(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ng(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function $g(t) {
  t.directive("flow-condition", (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      if (n)
        try {
          return o(n);
        } catch {
          return n;
        }
    };
    s.classList.add("flow-condition-node");
    const c = () => {
      const f = l()?.data ?? {}, u = Ng(a(), f.direction);
      s.setAttribute("data-flow-condition-direction", u);
      const h = f._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Is(s);
      const g = typeof f.label == "string" && f.label ? f.label : "Condition", p = document.createElement("div");
      p.className = "flow-condition-header", p.textContent = g, s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-condition-body", f.condition && typeof f.condition == "object" ? y.textContent = Ag(f.condition) : typeof f.evaluate == "function" ? y.textContent = typeof f.evaluateLabel == "string" && f.evaluateLabel ? f.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-condition-handle-source flow-condition-handle--true", x.setAttribute("data-flow-handle-direction", "source"), x.setAttribute("data-source-handle", "true"), x.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(x);
      const k = document.createElement("div");
      k.className = "flow-condition-handle-source flow-condition-handle--false", k.setAttribute("data-flow-handle-direction", "source"), k.setAttribute("data-source-handle", "false"), k.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(k), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Is(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Ig(t) {
  t.directive(
    "flow-row-select",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      e.classList.add("nodrag"), e.style.cursor = "pointer", e.setAttribute("data-flow-row-select", "");
      const s = (l) => {
        l.stopPropagation();
        const a = o(n);
        if (!a) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleRowSelect && (l.shiftKey ? d.toggleRowSelect(a) : (d.deselectAllRows(), d.selectRow(a)));
      };
      e.addEventListener("click", s), i(() => {
        const l = o(n);
        if (!l) return;
        const a = e.closest("[x-data]");
        if (!a) return;
        const c = t.$data(a);
        if (!c?.isRowSelected) return;
        const d = c.isRowSelected(l);
        e.classList.toggle("flow-row-selected", d), e.setAttribute("aria-selected", String(d));
      }), r(() => {
        e.removeEventListener("click", s);
      });
    }
  );
}
function Dg(t) {
  t.directive(
    "flow-detail",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      if (n) {
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const u = t.$data(f);
        if (!u?.viewport) return;
        const h = e.style.display;
        r(() => {
          const g = i(n), p = u.viewport.zoom, y = g.min === void 0 || p >= g.min, m = g.max === void 0 || p <= g.max;
          e.style.display = y && m ? h : "none";
        }), s(() => {
          e.style.display = h;
        });
        return;
      }
      const l = new Set(o.filter((f) => f === "far" || f === "medium" || f === "close"));
      if (l.size === 0) return;
      const a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?._zoomLevel) return;
      const d = e.style.display;
      r(() => {
        const f = c._zoomLevel;
        l.has(f) ? e.style.display = d : e.style.display = "none";
      }), s(() => {
        e.style.display = d;
      });
    }
  );
}
const Rg = ["perf", "events", "viewport", "state", "activity"], Ds = ["fps", "memory", "counts", "visible"], Rs = 30;
function Fg(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Rg.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Hg(t) {
  return t.perf ? t.perf === !0 ? [...Ds] : t.perf.filter((e) => Ds.includes(e)) : [];
}
function Og(t) {
  return t.events ? t.events === !0 ? Rs : t.events.max ?? Rs : 0;
}
function en(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function Oe(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function zg(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = Fg(l, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const f = (J) => J.stopPropagation();
      e.addEventListener("wheel", f);
      const u = document.createElement("button");
      u.className = "flow-devtools-toggle nopan", u.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(g), u.appendChild(h), e.appendChild(u);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let y = !1;
      const m = () => {
        y = !y, p.style.display = y ? "" : "none", u.title = y ? "Collapse" : "Devtools", y ? ne() : ie();
      };
      u.addEventListener("click", m);
      const x = Hg(a);
      let k = null, v = null, A = null, S = null, P = null;
      if (x.length > 0) {
        const { wrapper: J, content: ce } = en("Performance", "flow-devtools-perf");
        if (x.includes("fps")) {
          const { row: ee, valueEl: F } = Oe("FPS", "flow-devtools-fps");
          k = F, ce.appendChild(ee);
        }
        if (x.includes("memory")) {
          const { row: ee, valueEl: F } = Oe("Memory", "flow-devtools-memory");
          v = F, ce.appendChild(ee);
        }
        if (x.includes("counts")) {
          const ee = Oe("Nodes", "flow-devtools-counts");
          A = ee.valueEl, ce.appendChild(ee.row);
          const F = Oe("Edges", "flow-devtools-counts");
          S = F.valueEl, ce.appendChild(F.row);
        }
        if (x.includes("visible")) {
          const { row: ee, valueEl: F } = Oe("Visible", "flow-devtools-visible");
          P = F, ce.appendChild(ee);
        }
        p.appendChild(J);
      }
      const $ = Og(a);
      let b = null;
      if ($ > 0) {
        const { wrapper: J, content: ce } = en("Events", "flow-devtools-events"), ee = document.createElement("button");
        ee.className = "flow-devtools-clear-btn nopan", ee.textContent = "Clear", ee.addEventListener("click", () => {
          b && (b.textContent = ""), le.length = 0;
        }), J.querySelector(".flow-devtools-section-title").appendChild(ee), b = document.createElement("div"), b.className = "flow-devtools-event-list", ce.appendChild(b), p.appendChild(J);
      }
      let E = null, N = null, M = null;
      if (a.viewport) {
        const { wrapper: J, content: ce } = en("Viewport", "flow-devtools-viewport"), ee = Oe("X", "flow-devtools-vp-x");
        E = ee.valueEl, ce.appendChild(ee.row);
        const F = Oe("Y", "flow-devtools-vp-y");
        N = F.valueEl, ce.appendChild(F.row);
        const K = Oe("Zoom", "flow-devtools-vp-zoom");
        M = K.valueEl, ce.appendChild(K.row), p.appendChild(J);
      }
      let w = null;
      if (a.state) {
        const { wrapper: J, content: ce } = en("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", ce.appendChild(w), p.appendChild(J);
      }
      let _ = null, D = null, L = null, O = null;
      if (a.activity) {
        const { wrapper: J, content: ce } = en("Activity", "flow-devtools-activity"), ee = Oe("Animations", "flow-devtools-anim");
        _ = ee.valueEl, ce.appendChild(ee.row);
        const F = Oe("Particles", "flow-devtools-particles");
        D = F.valueEl, ce.appendChild(F.row);
        const K = Oe("Follow", "flow-devtools-follow");
        L = K.valueEl, ce.appendChild(K.row);
        const U = Oe("Timelines", "flow-devtools-timelines");
        O = U.valueEl, ce.appendChild(U.row), p.appendChild(J);
      }
      let W = null, C = !1, T = 0, R = performance.now();
      const X = !!(k || v), se = () => {
        if (!C) return;
        T++;
        const J = performance.now();
        J - R >= 1e3 && (k && (k.textContent = String(Math.round(T * 1e3 / (J - R)))), T = 0, R = J, v && performance.memory && (v.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), W = requestAnimationFrame(se);
      }, ne = () => {
        !X || C || (C = !0, T = 0, R = performance.now(), W = requestAnimationFrame(se));
      }, ie = () => {
        C = !1, W !== null && (cancelAnimationFrame(W), W = null);
      }, le = [], de = [
        "flow-init",
        "flow-connect",
        "flow-disconnect",
        "flow-node-add",
        "flow-node-remove",
        "flow-edge-add",
        "flow-edge-remove",
        "flow-selection-change",
        "flow-viewport-change",
        "flow-viewport-move-start",
        "flow-viewport-move",
        "flow-viewport-move-end",
        "flow-node-drag-start",
        "flow-node-drag",
        "flow-node-drag-end",
        "flow-node-click",
        "flow-edge-click",
        "flow-node-condense",
        "flow-node-uncondense",
        "flow-undo",
        "flow-redo"
      ];
      let ue = null;
      if ($ > 0 && b) {
        ue = (J) => {
          if (!y) return;
          const ce = J, ee = ce.type.replace("flow-", "");
          let F = "";
          try {
            F = ce.detail ? JSON.stringify(ce.detail).slice(0, 80) : "";
          } catch {
            F = "[circular]";
          }
          le.unshift({ name: ee, time: Date.now(), detail: F });
          const K = b, U = document.createElement("div");
          U.className = "flow-devtools-event-entry";
          const V = document.createElement("span");
          V.className = "flow-devtools-event-name", V.textContent = ee;
          const I = document.createElement("span");
          I.className = "flow-devtools-event-age", I.textContent = "now";
          const re = document.createElement("span");
          for (re.className = "flow-devtools-event-detail", re.textContent = F, U.appendChild(V), U.appendChild(I), U.appendChild(re), K.prepend(U); K.children.length > $; )
            K.removeChild(K.lastChild), le.pop();
        };
        for (const J of de)
          d.addEventListener(J, ue);
      }
      r(() => {
        const J = t.$data(c);
        !J || !J.viewport || (E && (E.textContent = Math.round(J.viewport.x).toString()), N && (N.textContent = Math.round(J.viewport.y).toString()), M && (M.textContent = J.viewport.zoom.toFixed(2)));
      }), r(() => {
        const J = t.$data(c);
        if (J) {
          if (A && (A.textContent = String(J.nodes?.length ?? 0)), S && (S.textContent = String(J.edges?.length ?? 0)), P && J._getVisibleNodeIds && (P.textContent = String(J._getVisibleNodeIds().size)), w) {
            const ce = J.selectedNodes, ee = J.selectedEdges;
            if (!((ce?.size ?? 0) > 0 || (ee?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", ce && ce.size > 0)
                for (const K of ce) {
                  const U = J.getNode?.(K);
                  if (!U) continue;
                  const V = document.createElement("pre");
                  V.className = "flow-devtools-json", V.textContent = JSON.stringify({ id: U.id, position: U.position, data: U.data }, null, 2), w.appendChild(V);
                }
              if (ee && ee.size > 0)
                for (const K of ee) {
                  const U = J.edges?.find((I) => I.id === K);
                  if (!U) continue;
                  const V = document.createElement("pre");
                  V.className = "flow-devtools-json", V.textContent = JSON.stringify({ id: U.id, source: U.source, target: U.target, type: U.type }, null, 2), w.appendChild(V);
                }
            }
          }
          if (_) {
            const ce = J._animator?._groups?.size ?? 0;
            _.textContent = String(ce);
          }
          D && (D.textContent = String(J._activeParticles?.size ?? 0)), L && (L.textContent = J._followHandle ? "Active" : "Idle"), O && (O.textContent = String(J._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ie(), u.removeEventListener("click", m), ue)
          for (const J of de)
            d.removeEventListener(J, ue);
        e.removeEventListener("wheel", f), e.textContent = "", k = null, v = null, A = null, S = null, P = null, b = null, E = null, N = null, M = null, w = null, _ = null, D = null, L = null, O = null;
      });
    }
  );
}
const Vg = {
  undo: { method: "undo", disabledWhen: (t) => !t.canUndo, aria: "disabled" },
  redo: { method: "redo", disabledWhen: (t) => !t.canRedo, aria: "disabled" },
  "fit-view": { method: "fitView", passExpression: !0 },
  "zoom-in": {
    method: "zoomIn",
    disabledWhen: (t) => t.viewport.zoom >= (t._config?.maxZoom ?? 2),
    aria: "disabled"
  },
  "zoom-out": {
    method: "zoomOut",
    disabledWhen: (t) => t.viewport.zoom <= (t._config?.minZoom ?? 0.5),
    aria: "disabled"
  },
  "toggle-interactive": { method: "toggleInteractive", aria: "pressed" },
  clear: { method: "$clear", disabledWhen: (t) => t.nodes.length === 0, aria: "disabled" },
  reset: { method: "$reset" },
  export: { method: "toImage", passExpression: !0 }
};
function Bg(t) {
  return Vg[t] ?? null;
}
function qg(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Bg(n);
      if (!a)
        return;
      const c = e.closest("[data-flow-canvas]");
      if (!c)
        return;
      const d = t.$data(c);
      if (!d)
        return;
      const f = () => {
        const u = d[a.method];
        typeof u == "function" && (a.passExpression && o ? u.call(d, i(o)) : u.call(d));
      };
      e.addEventListener("click", f), (a.disabledWhen || a.aria) && r(() => {
        if (a.disabledWhen) {
          const u = a.disabledWhen(d);
          e.disabled = u, a.aria === "disabled" && e.setAttribute("aria-disabled", String(u));
        }
        a.aria === "pressed" && e.setAttribute("aria-pressed", String(!d.isInteractive));
      }), s(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Xg(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Ao = /* @__PURE__ */ new WeakMap();
function Yg(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Xg(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let f = null;
      const u = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), Ao.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          f = r(`[${o}]`)[0], d.setNodeFilter(f), Ao.set(c, f);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", u), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = Ao.get(c) === f && f !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Wg(t) {
  if (typeof t == "string")
    return { target: t };
  if (t && typeof t == "object" && "target" in t) {
    const e = t;
    return {
      target: e.target,
      zoom: typeof e.zoom == "number" ? e.zoom : void 0,
      speed: typeof e.speed == "number" ? e.speed : void 0
    };
  }
  return null;
}
function jg(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("toggle"), a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?.follow) return;
      let d = null;
      const f = (h) => {
        e.classList.toggle("flow-following", h), e.setAttribute("aria-pressed", String(h));
      }, u = () => {
        if (!n) return;
        const h = i(n), g = Wg(h);
        if (!g) return;
        if (l && d) {
          d.stop(), d = null, f(!1);
          return;
        }
        d && d.stop();
        const p = {};
        g.zoom !== void 0 && (p.zoom = g.zoom), g.speed !== void 0 && (p.speed = g.speed), d = c.follow(g.target, p), f(!0), d?.finished && d.finished.then(() => {
          d = null, f(!1);
        });
      };
      e.addEventListener("click", u), s(() => {
        e.removeEventListener("click", u), d && (d.stop(), d = null);
      });
    }
  );
}
function Ug(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Ci = /* @__PURE__ */ new Map();
function Zg(t, e) {
  Ci.set(t, e);
}
function Kg(t) {
  return Ci.get(t) ?? null;
}
function Gg(t) {
  return Ci.has(t);
}
function No(t) {
  return `alpineflow-snapshot-${t}`;
}
function Jg(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Ug(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const f = () => {
        if (!o) return;
        const u = r(o);
        if (u)
          if (a.action === "save") {
            const h = d.toObject();
            a.persist ? localStorage.setItem(No(u), JSON.stringify(h)) : Zg(u, h);
          } else {
            let h = null;
            if (a.persist) {
              const g = localStorage.getItem(No(u));
              if (g)
                try {
                  h = JSON.parse(g);
                } catch {
                }
            } else
              h = Kg(u);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", f), a.action === "restore" && s(() => {
        if (!o) return;
        const u = r(o);
        if (!u) return;
        let h;
        a.persist ? h = localStorage.getItem(No(u)) !== null : (d.nodes.length, h = Gg(u)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Qg(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function em(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Qg(s._loadingText));
      const a = n.includes("fade");
      a && e.classList.add("flow-loading-fade"), r.setAttribute("data-flow-loading-directive", "");
      let c = null;
      o(() => {
        if (s.isLoading)
          e.style.display = "flex", a && (e.classList.remove("flow-loading-fade-out"), c && (e.removeEventListener("transitionend", c), c = null));
        else if (a) {
          c && e.removeEventListener("transitionend", c), e.classList.add("flow-loading-fade-out");
          const f = () => {
            e.style.display = "none", e.removeEventListener("transitionend", f), c = null;
          };
          c = f, e.addEventListener("transitionend", f);
        } else
          e.style.display = "none";
      }), i(() => {
        c && (e.removeEventListener("transitionend", c), c = null), r.removeAttribute("data-flow-loading-directive"), e.style.display = "", e.classList.remove("flow-loading-overlay", "flow-loading-fade", "flow-loading-fade-out");
      });
    }
  );
}
function tm(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = e.closest("[data-flow-edge-id]");
      if (!l) return;
      const a = l.dataset.flowEdgeId, c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const f = c.querySelector(".flow-viewport");
      if (!f) return;
      try {
        const y = i("edge");
        y && t.addScopeToNode(e, { edge: y });
      } catch {
      }
      f.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const u = (y) => {
        y.stopPropagation();
      }, h = (y) => {
        y.stopPropagation();
      };
      e.addEventListener("pointerdown", u), e.addEventListener("click", h);
      const g = o.includes("below"), p = 20;
      r(() => {
        if (!d.edges.some((b) => b.id === a)) {
          e.removeEventListener("pointerdown", u), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let x = 0.5;
        if (n) {
          const b = i(n);
          typeof b == "number" && (x = b);
        }
        const k = l.querySelectorAll("path"), v = k.length > 1 ? k[1] : k[0];
        if (!v) return;
        const A = v.getTotalLength?.();
        if (!A) return;
        const S = v.getPointAtLength(A * Math.max(0, Math.min(1, x))), P = m / y, $ = g ? P : -P;
        e.style.left = `${S.x}px`, e.style.top = `${S.y + $}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", u), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function nm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function om(t) {
  t.store("flow", {
    instances: {},
    activeId: null,
    register(e, n) {
      this.instances[e] = n;
    },
    unregister(e) {
      this.activeId === e && (this.activeId = null), delete this.instances[e];
    },
    get(e) {
      return this.instances[e] ?? null;
    },
    activate(e) {
      if (this.activeId === e) return;
      if (this.activeId) {
        const o = this.instances[this.activeId];
        o && (o._active = !1, o._container?.classList.remove("flow-canvas-active"));
      }
      this.activeId = e;
      const n = this.instances[e];
      n && (n._active = !0, n._container?.classList.add("flow-canvas-active"));
    }
  });
}
function fy(t, e, n) {
  const o = n?.defaultDimensions?.width ?? ve, i = n?.defaultDimensions?.height ?? _e, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", a = t.filter((m) => !m.hidden).map((m) => ({
    ...m,
    dimensions: {
      width: m.dimensions?.width ?? o,
      height: m.dimensions?.height ?? i
    }
  })), c = /* @__PURE__ */ new Map();
  for (const m of a)
    c.set(m.id, m);
  const d = a.map((m) => ({
    id: m.id,
    x: m.position.x,
    y: m.position.y,
    width: m.dimensions.width,
    height: m.dimensions.height,
    ...m.class ? { class: m.class } : {},
    ...m.style ? {
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([x, k]) => `${x}:${k}`).join(";")
    } : {},
    data: m.data ?? {}
  })), f = e.filter((m) => !m.hidden), u = [], h = /* @__PURE__ */ new Map();
  for (const m of f) {
    const x = c.get(m.source), k = c.get(m.target);
    if (!x || !k)
      continue;
    let v, A;
    try {
      const E = so(
        m,
        x,
        k,
        x.sourcePosition ?? "bottom",
        k.targetPosition ?? "top"
      );
      v = E.path, A = E.labelPosition;
    } catch {
      continue;
    }
    let S, P;
    if (m.markerStart) {
      const E = Dt(m.markerStart), N = Rt(E, s);
      h.has(N) || h.set(N, Jn(E, N)), S = `url(#${N})`;
    }
    if (m.markerEnd) {
      const E = Dt(m.markerEnd), N = Rt(E, s);
      h.has(N) || h.set(N, Jn(E, N)), P = `url(#${N})`;
    }
    let $, b;
    if (m.label)
      if (A)
        $ = A.x, b = A.y;
      else {
        const E = x.position.x + x.dimensions.width / 2, N = x.position.y + x.dimensions.height / 2, M = k.position.x + k.dimensions.width / 2, w = k.position.y + k.dimensions.height / 2;
        $ = (E + M) / 2, b = (N + w) / 2;
      }
    u.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: v,
      ...S ? { markerStart: S } : {},
      ...P ? { markerEnd: P } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...$ !== void 0 ? { labelX: $ } : {},
      ...b !== void 0 ? { labelY: b } : {}
    });
  }
  const g = Array.from(h.values()).join(`
`);
  let p, y;
  if (a.length === 0)
    p = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = qt(a);
    p = {
      x: m.x - r,
      y: m.y - r,
      width: m.width + r * 2,
      height: m.height + r * 2
    }, y = {
      x: -p.x,
      y: -p.y,
      zoom: 1
    };
  }
  return {
    nodes: d,
    edges: u,
    markers: g,
    viewBox: p,
    viewport: y
  };
}
const Fs = /* @__PURE__ */ new WeakSet();
function hy(t) {
  Fs.has(t) || (Fs.add(t), ba(t), om(t), Ip(t), Yp(t), Ef(t), gf(t), mf(t), yf(t), Mp(t), Zp(t), Qp(t), eg(t), ng(t), ig(t), mg(t), yg(t), _g(t), xg(t), Sg(t), kg(t), Lg(t), Ig(t), Dg(t), zg(t), qg(t), Yg(t), jg(t), Jg(t), em(t), tm(t), Pg(t), Tg(t), $g(t), nm(t));
}
function im(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function sm(t, e, n, o) {
  return new Promise((i, r) => {
    const s = new Image();
    s.onload = () => {
      const l = document.createElement("canvas");
      l.width = e, l.height = n;
      const a = l.getContext("2d");
      a.fillStyle = o, a.fillRect(0, 0, e, n), a.drawImage(s, 0, 0), i(l.toDataURL("image/png"));
    }, s.onerror = () => {
      r(new Error("Failed to render SVG to image"));
    }, s.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function rm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => oy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), f = e.style.transform, u = e.style.width, h = e.style.height, g = t.style.width, p = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const E = t.querySelectorAll("[data-flow-culled]");
      for (const D of E)
        D.style.display = "", m.push(D);
      const N = n.filter((D) => !D.hidden), M = qt(N), w = i.padding ?? 0.1, _ = Zn(
        M,
        a,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        w
      );
      e.style.transform = `translate(${_.x}px, ${_.y}px) scale(${_.zoom})`, e.style.width = `${a}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${a}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((E) => requestAnimationFrame(E));
    const x = i.includeOverlays, k = x === !0, v = typeof x == "object" ? x : {}, A = [
      ["canvas-overlay", k || (v.toolbar ?? !1)],
      ["flow-minimap", k || (v.minimap ?? !1)],
      ["flow-controls", k || (v.controls ?? !1)],
      ["flow-panel", k || (v.panels ?? !1)],
      ["flow-selection-box", !1]
    ], S = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (E) => {
        if (E.classList) {
          for (const [N, M] of A)
            if (E.classList.contains(N) && !M) return !1;
        }
        return !0;
      }
    }), $ = im(decodeURIComponent(S.substring("data:image/svg+xml;charset=utf-8,".length))), b = await sm($, a, c, d);
    if (i.filename) {
      const E = document.createElement("a");
      E.download = i.filename, E.href = b, E.click();
    }
    return b;
  } finally {
    e.style.transform = f, e.style.width = u, e.style.height = h, t.style.width = g, t.style.height = p, t.style.overflow = y;
    for (const x of m)
      x.style.display = "none";
  }
}
const am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: rm
}, Symbol.toStringTag, { value: "Module" }));
function lm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const cm = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function gt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Mt = null;
function da(t = {}) {
  return Mt || (t.includeStyleProperties ? (Mt = t.includeStyleProperties, Mt) : (Mt = gt(window.getComputedStyle(document.documentElement)), Mt));
}
function lo(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function dm(t) {
  const e = lo(t, "border-left-width"), n = lo(t, "border-right-width");
  return t.clientWidth + e + n;
}
function um(t) {
  const e = lo(t, "border-top-width"), n = lo(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Si(t, e = {}) {
  const n = e.width || dm(t), o = e.height || um(t);
  return { width: n, height: o };
}
function fm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const De = 16384;
function hm(t) {
  (t.width > De || t.height > De) && (t.width > De && t.height > De ? t.width > t.height ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De) : t.width > De ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De));
}
function pm(t, e = {}) {
  return t.toBlob ? new Promise((n) => {
    t.toBlob(n, e.type ? e.type : "image/png", e.quality ? e.quality : 1);
  }) : new Promise((n) => {
    const o = window.atob(t.toDataURL(e.type ? e.type : void 0, e.quality ? e.quality : void 0).split(",")[1]), i = o.length, r = new Uint8Array(i);
    for (let s = 0; s < i; s += 1)
      r[s] = o.charCodeAt(s);
    n(new Blob([r], {
      type: e.type ? e.type : "image/png"
    }));
  });
}
function co(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function gm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function mm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), gm(i);
}
const $e = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || $e(n, e);
};
function ym(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function wm(t, e) {
  return da(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function vm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? ym(n) : wm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Hs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = cm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(vm(s, n, i, o)), e.appendChild(l);
}
function _m(t, e, n) {
  Hs(t, e, ":before", n), Hs(t, e, ":after", n);
}
const Os = "application/font-woff", zs = "image/jpeg", bm = {
  woff: Os,
  woff2: Os,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: zs,
  jpeg: zs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function xm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function ki(t) {
  const e = xm(t).toLowerCase();
  return bm[e] || "";
}
function Em(t) {
  return t.split(/,/)[1];
}
function oi(t) {
  return t.search(/^(data:)/) !== -1;
}
function Cm(t, e) {
  return `data:${e};base64,${t}`;
}
async function ua(t, e, n) {
  const o = await fetch(t, e);
  if (o.status === 404)
    throw new Error(`Resource "${o.url}" not found`);
  const i = await o.blob();
  return new Promise((r, s) => {
    const l = new FileReader();
    l.onerror = s, l.onloadend = () => {
      try {
        r(n({ res: o, result: l.result }));
      } catch (a) {
        s(a);
      }
    }, l.readAsDataURL(i);
  });
}
const $o = {};
function Sm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Li(t, e, n) {
  const o = Sm(t, e, n.includeQueryParams);
  if ($o[o] != null)
    return $o[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await ua(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), Em(l)));
    i = Cm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return $o[o] = i, i;
}
async function km(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : co(e);
}
async function Lm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return co(l);
  }
  const n = t.poster, o = ki(n), i = await Li(n, o, e);
  return co(i);
}
async function Pm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await mo(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Mm(t, e) {
  return $e(t, HTMLCanvasElement) ? km(t) : $e(t, HTMLVideoElement) ? Lm(t, e) : $e(t, HTMLIFrameElement) ? Pm(t, e) : t.cloneNode(fa(t));
}
const Tm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", fa = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Am(t, e, n) {
  var o, i;
  if (fa(e))
    return e;
  let r = [];
  return Tm(t) && t.assignedNodes ? r = gt(t.assignedNodes()) : $e(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = gt(t.contentDocument.body.childNodes) : r = gt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || $e(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => mo(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Nm(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : da(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), $e(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function $m(t, e) {
  $e(t, HTMLTextAreaElement) && (e.innerHTML = t.value), $e(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Im(t, e) {
  if ($e(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Dm(t, e, n) {
  return $e(e, Element) && (Nm(t, e, n), _m(t, e, n), $m(t, e), Im(t, e)), e;
}
async function Rm(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const l = n[r].getAttribute("xlink:href");
    if (l) {
      const a = t.querySelector(l), c = document.querySelector(l);
      !a && c && !o[l] && (o[l] = await mo(c, e, !0));
    }
  }
  const i = Object.values(o);
  if (i.length) {
    const r = "http://www.w3.org/1999/xhtml", s = document.createElementNS(r, "svg");
    s.setAttribute("xmlns", r), s.style.position = "absolute", s.style.width = "0", s.style.height = "0", s.style.overflow = "hidden", s.style.display = "none";
    const l = document.createElementNS(r, "defs");
    s.appendChild(l);
    for (let a = 0; a < i.length; a++)
      l.appendChild(i[a]);
    t.appendChild(s);
  }
  return t;
}
async function mo(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Mm(o, e)).then((o) => Am(t, o, e)).then((o) => Dm(t, o, e)).then((o) => Rm(o, e));
}
const ha = /url\((['"]?)([^'"]+?)\1\)/g, Fm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Hm = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Om(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function zm(t) {
  const e = [];
  return t.replace(ha, (n, o, i) => (e.push(i), n)), e.filter((n) => !oi(n));
}
async function Vm(t, e, n, o, i) {
  try {
    const r = n ? lm(e, n) : e, s = ki(e);
    let l;
    return i || (l = await Li(r, s, o)), t.replace(Om(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function Bm(t, { preferredFontFormat: e }) {
  return e ? t.replace(Hm, (n) => {
    for (; ; ) {
      const [o, , i] = Fm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function pa(t) {
  return t.search(ha) !== -1;
}
async function ga(t, e, n) {
  if (!pa(t))
    return t;
  const o = Bm(t, n);
  return zm(o).reduce((r, s) => r.then((l) => Vm(l, s, e, n)), Promise.resolve(o));
}
async function Tt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await ga(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function qm(t, e) {
  await Tt("background", t, e) || await Tt("background-image", t, e), await Tt("mask", t, e) || await Tt("-webkit-mask", t, e) || await Tt("mask-image", t, e) || await Tt("-webkit-mask-image", t, e);
}
async function Xm(t, e) {
  const n = $e(t, HTMLImageElement);
  if (!(n && !oi(t.src)) && !($e(t, SVGImageElement) && !oi(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Li(o, ki(o), e);
  await new Promise((r, s) => {
    t.onload = r, t.onerror = e.onImageErrorHandler ? (...a) => {
      try {
        r(e.onImageErrorHandler(...a));
      } catch (c) {
        s(c);
      }
    } : s;
    const l = t;
    l.decode && (l.decode = r), l.loading === "lazy" && (l.loading = "eager"), n ? (t.srcset = "", t.src = i) : t.href.baseVal = i;
  });
}
async function Ym(t, e) {
  const o = gt(t.childNodes).map((i) => ma(i, e));
  await Promise.all(o).then(() => t);
}
async function ma(t, e) {
  $e(t, Element) && (await qm(t, e), await Xm(t, e), await Ym(t, e));
}
function Wm(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Vs = {};
async function Bs(t) {
  let e = Vs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Vs[t] = e, e;
}
async function qs(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), ua(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function Xs(t) {
  if (t == null)
    return [];
  const e = [], n = /(\/\*[\s\S]*?\*\/)/gi;
  let o = t.replace(n, "");
  const i = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const a = i.exec(o);
    if (a === null)
      break;
    e.push(a[0]);
  }
  o = o.replace(i, "");
  const r = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, s = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", l = new RegExp(s, "gi");
  for (; ; ) {
    let a = r.exec(o);
    if (a === null) {
      if (a = l.exec(o), a === null)
        break;
      r.lastIndex = l.lastIndex;
    } else
      l.lastIndex = r.lastIndex;
    e.push(a[0]);
  }
  return e;
}
async function jm(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        gt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = Bs(a).then((d) => qs(d, e)).then((d) => Xs(d).forEach((f) => {
              try {
                i.insertRule(f, f.startsWith("@import") ? l += 1 : i.cssRules.length);
              } catch (u) {
                console.error("Error inserting rule from remote css", {
                  rule: f,
                  error: u
                });
              }
            })).catch((d) => {
              console.error("Error loading remote css", d.toString());
            });
            o.push(c);
          }
        });
      } catch (r) {
        const s = t.find((l) => l.href == null) || document.styleSheets[0];
        i.href != null && o.push(Bs(i.href).then((l) => qs(l, e)).then((l) => Xs(l).forEach((a) => {
          s.insertRule(a, s.cssRules.length);
        })).catch((l) => {
          console.error("Error loading remote stylesheet", l);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        gt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function Um(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => pa(e.style.getPropertyValue("src")));
}
async function Zm(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = gt(t.ownerDocument.styleSheets), o = await jm(n, e);
  return Um(o);
}
function ya(t) {
  return t.trim().replace(/["']/g, "");
}
function Km(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(ya(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function wa(t, e) {
  const n = await Zm(t, e), o = Km(t);
  return (await Promise.all(n.filter((r) => o.has(ya(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return ga(r.cssText, s, e);
  }))).join(`
`);
}
async function Gm(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await wa(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function va(t, e = {}) {
  const { width: n, height: o } = Si(t, e), i = await mo(t, e, !0);
  return await Gm(i, e), await ma(i, e), Wm(i, e), await mm(i, n, o);
}
async function xn(t, e = {}) {
  const { width: n, height: o } = Si(t, e), i = await va(t, e), r = await co(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || fm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || hm(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function Jm(t, e = {}) {
  const { width: n, height: o } = Si(t, e);
  return (await xn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function Qm(t, e = {}) {
  return (await xn(t, e)).toDataURL();
}
async function ey(t, e = {}) {
  return (await xn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function ty(t, e = {}) {
  const n = await xn(t, e);
  return await pm(n);
}
async function ny(t, e = {}) {
  return wa(t, e);
}
const oy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: ny,
  toBlob: ty,
  toCanvas: xn,
  toJpeg: ey,
  toPixelData: Jm,
  toPng: Qm,
  toSvg: va
}, Symbol.toStringTag, { value: "Module" }));
export {
  Of as ComputeEngine,
  Hu as FlowHistory,
  cs as SHORTCUT_DEFAULTS,
  ay as along,
  hf as areNodesConnected,
  Or as buildNodeMap,
  Vr as clampToExtent,
  xo as clampToParent,
  fy as computeRenderPlan,
  hs as computeValidationErrors,
  zr as computeZIndex,
  hy as default,
  cy as drift,
  Lf as expandParentToFitChild,
  Zo as getAbsolutePosition,
  xf as getAutoPanDelta,
  Qn as getBezierPath,
  df as getConnectedEdges,
  ht as getDescendantIds,
  ks as getEdgePosition,
  oa as getFloatingEdgeParams,
  uf as getIncomers,
  Ss as getNodeIntersection,
  qt as getNodesBounds,
  cf as getNodesFullyInPolygon,
  $u as getNodesFullyInRect,
  lf as getNodesInPolygon,
  Nu as getNodesInRect,
  jo as getOutgoers,
  iy as getSimpleBezierPath,
  uy as getSimpleFloatingPosition,
  yn as getSmoothStepPath,
  bf as getStepPath,
  Dr as getStraightPath,
  Zn as getViewportForBounds,
  ze as isConnectable,
  wf as isDeletable,
  Ir as isDraggable,
  as as isResizable,
  Uo as isSelectable,
  Xe as matchesKey,
  ft as matchesModifier,
  sy as orbit,
  ly as pendulum,
  yi as pointInPolygon,
  af as polygonIntersectsAABB,
  ju as registerMarker,
  cn as resolveChildValidation,
  Cf as resolveShortcuts,
  pt as sortNodesTopological,
  dy as stagger,
  Ot as toAbsoluteNode,
  oo as toAbsoluteNodes,
  Yr as validateChildAdd,
  io as validateChildRemove,
  ry as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
