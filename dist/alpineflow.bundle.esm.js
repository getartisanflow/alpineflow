let Fo = null;
function Ma(t) {
  Fo = t;
}
function ke() {
  if (!Fo)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Fo;
}
var Ta = { value: () => {
} };
function po() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Fn(n);
}
function Fn(t) {
  this._ = t;
}
function Aa(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Fn.prototype = po.prototype = {
  constructor: Fn,
  on: function(t, e) {
    var n = this._, o = Aa(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Na(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = $i(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = $i(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new Fn(t);
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
function Na(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function $i(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Ta, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Oo = "http://www.w3.org/1999/xhtml";
const Ii = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Oo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function mo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Ii.hasOwnProperty(e) ? { space: Ii[e], local: t } : t;
}
function $a(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Oo && e.documentElement.namespaceURI === Oo ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Ia(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function er(t) {
  var e = mo(t);
  return (e.local ? Ia : $a)(e);
}
function Da() {
}
function li(t) {
  return t == null ? Da : function() {
    return this.querySelector(t);
  };
}
function Ra(t) {
  typeof t != "function" && (t = li(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new Oe(o, this._parents);
}
function Ha(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Fa() {
  return [];
}
function tr(t) {
  return t == null ? Fa : function() {
    return this.querySelectorAll(t);
  };
}
function Oa(t) {
  return function() {
    return Ha(t.apply(this, arguments));
  };
}
function za(t) {
  typeof t == "function" ? t = Oa(t) : t = tr(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new Oe(o, i);
}
function nr(t) {
  return function() {
    return this.matches(t);
  };
}
function or(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Va = Array.prototype.find;
function Ba(t) {
  return function() {
    return Va.call(this.children, t);
  };
}
function qa() {
  return this.firstElementChild;
}
function Ya(t) {
  return this.select(t == null ? qa : Ba(typeof t == "function" ? t : or(t)));
}
var Xa = Array.prototype.filter;
function Wa() {
  return Array.from(this.children);
}
function ja(t) {
  return function() {
    return Xa.call(this.children, t);
  };
}
function Ua(t) {
  return this.selectAll(t == null ? Wa : ja(typeof t == "function" ? t : or(t)));
}
function Za(t) {
  typeof t != "function" && (t = nr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new Oe(o, this._parents);
}
function ir(t) {
  return new Array(t.length);
}
function Ga() {
  return new Oe(this._enter || this._groups.map(ir), this._parents);
}
function Yn(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Yn.prototype = {
  constructor: Yn,
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
function Ka(t) {
  return function() {
    return t;
  };
}
function Ja(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Yn(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function Qa(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (f[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < u; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new Yn(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(f[l]) === a && (i[l] = a);
}
function el(t) {
  return t.__data__;
}
function tl(t, e) {
  if (!arguments.length) return Array.from(this, el);
  var n = e ? Qa : Ja, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Ka(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = nl(t.call(d, d && d.__data__, c, o)), p = h.length, g = l[c] = new Array(p), y = s[c] = new Array(p), m = a[c] = new Array(f);
    n(d, u, g, y, m, h, e);
    for (var x = 0, P = 0, b, E; x < p; ++x)
      if (b = g[x]) {
        for (x >= P && (P = x + 1); !(E = y[P]) && ++P < p; ) ;
        b._next = E || null;
      }
  }
  return s = new Oe(s, o), s._enter = l, s._exit = a, s;
}
function nl(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ol() {
  return new Oe(this._exit || this._groups.map(ir), this._parents);
}
function il(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function sl(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], u = c.length, f = l[a] = new Array(u), h, p = 0; p < u; ++p)
      (h = c[p] || d[p]) && (f[p] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new Oe(l, this._parents);
}
function rl() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function al(t) {
  t || (t = ll);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), c, d = 0; d < l; ++d)
      (c = s[d]) && (a[d] = c);
    a.sort(e);
  }
  return new Oe(i, this._parents).order();
}
function ll(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function cl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function dl() {
  return Array.from(this);
}
function ul() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function fl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function hl() {
  return !this.node();
}
function gl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function pl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ml(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function yl(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function wl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function vl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function _l(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function bl(t, e) {
  var n = mo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? ml : pl : typeof e == "function" ? n.local ? _l : vl : n.local ? wl : yl)(n, e));
}
function sr(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function xl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function El(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Cl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Sl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? xl : typeof e == "function" ? Cl : El)(t, e, n ?? "")) : Vt(this.node(), t);
}
function Vt(t, e) {
  return t.style.getPropertyValue(e) || sr(t).getComputedStyle(t, null).getPropertyValue(e);
}
function kl(t) {
  return function() {
    delete this[t];
  };
}
function Ll(t, e) {
  return function() {
    this[t] = e;
  };
}
function Pl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function Ml(t, e) {
  return arguments.length > 1 ? this.each((e == null ? kl : typeof e == "function" ? Pl : Ll)(t, e)) : this.node()[t];
}
function rr(t) {
  return t.trim().split(/^|\s+/);
}
function ci(t) {
  return t.classList || new ar(t);
}
function ar(t) {
  this._node = t, this._names = rr(t.getAttribute("class") || "");
}
ar.prototype = {
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
function lr(t, e) {
  for (var n = ci(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function cr(t, e) {
  for (var n = ci(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Tl(t) {
  return function() {
    lr(this, t);
  };
}
function Al(t) {
  return function() {
    cr(this, t);
  };
}
function Nl(t, e) {
  return function() {
    (e.apply(this, arguments) ? lr : cr)(this, t);
  };
}
function $l(t, e) {
  var n = rr(t + "");
  if (arguments.length < 2) {
    for (var o = ci(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Nl : e ? Tl : Al)(n, e));
}
function Il() {
  this.textContent = "";
}
function Dl(t) {
  return function() {
    this.textContent = t;
  };
}
function Rl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Hl(t) {
  return arguments.length ? this.each(t == null ? Il : (typeof t == "function" ? Rl : Dl)(t)) : this.node().textContent;
}
function Fl() {
  this.innerHTML = "";
}
function Ol(t) {
  return function() {
    this.innerHTML = t;
  };
}
function zl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Vl(t) {
  return arguments.length ? this.each(t == null ? Fl : (typeof t == "function" ? zl : Ol)(t)) : this.node().innerHTML;
}
function Bl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function ql() {
  return this.each(Bl);
}
function Yl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Xl() {
  return this.each(Yl);
}
function Wl(t) {
  var e = typeof t == "function" ? t : er(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function jl() {
  return null;
}
function Ul(t, e) {
  var n = typeof t == "function" ? t : er(t), o = e == null ? jl : typeof e == "function" ? e : li(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Zl() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Gl() {
  return this.each(Zl);
}
function Kl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Jl() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Ql(t) {
  return this.select(t ? Jl : Kl);
}
function ec(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function tc(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function nc(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function oc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function ic(t, e, n) {
  return function() {
    var o = this.__on, i, r = tc(e);
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
function sc(t, e, n) {
  var o = nc(t + ""), i, r = o.length, s;
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
  for (l = e ? ic : oc, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function dr(t, e, n) {
  var o = sr(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function rc(t, e) {
  return function() {
    return dr(this, t, e);
  };
}
function ac(t, e) {
  return function() {
    return dr(this, t, e.apply(this, arguments));
  };
}
function lc(t, e) {
  return this.each((typeof e == "function" ? ac : rc)(t, e));
}
function* cc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var ur = [null];
function Oe(t, e) {
  this._groups = t, this._parents = e;
}
function bn() {
  return new Oe([[document.documentElement]], ur);
}
function dc() {
  return this;
}
Oe.prototype = bn.prototype = {
  constructor: Oe,
  select: Ra,
  selectAll: za,
  selectChild: Ya,
  selectChildren: Ua,
  filter: Za,
  data: tl,
  enter: Ga,
  exit: ol,
  join: il,
  merge: sl,
  selection: dc,
  order: rl,
  sort: al,
  call: cl,
  nodes: dl,
  node: ul,
  size: fl,
  empty: hl,
  each: gl,
  attr: bl,
  style: Sl,
  property: Ml,
  classed: $l,
  text: Hl,
  html: Vl,
  raise: ql,
  lower: Xl,
  append: Wl,
  insert: Ul,
  remove: Gl,
  clone: Ql,
  datum: ec,
  on: sc,
  dispatch: lc,
  [Symbol.iterator]: cc
};
function Ye(t) {
  return typeof t == "string" ? new Oe([[document.querySelector(t)]], [document.documentElement]) : new Oe([[t]], ur);
}
function uc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Qe(t, e) {
  if (t = uc(t), e === void 0 && (e = t.currentTarget), e) {
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
const fc = { passive: !1 }, hn = { capture: !0, passive: !1 };
function bo(t) {
  t.stopImmediatePropagation();
}
function Rt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function fr(t) {
  var e = t.document.documentElement, n = Ye(t).on("dragstart.drag", Rt, hn);
  "onselectstart" in e ? n.on("selectstart.drag", Rt, hn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function hr(t, e) {
  var n = t.document.documentElement, o = Ye(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Rt, hn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Ln = (t) => () => t;
function zo(t, {
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
zo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function hc(t) {
  return !t.ctrlKey && !t.button;
}
function gc() {
  return this.parentNode;
}
function pc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function mc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function yc() {
  var t = hc, e = gc, n = pc, o = mc, i = {}, r = po("start", "drag", "end"), s = 0, l, a, c, d, u = 0;
  function f(b) {
    b.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, fc).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, E) {
    if (!(d || !t.call(this, b, E))) {
      var S = P(this, e.call(this, b, E), b, E, "mouse");
      S && (Ye(b.view).on("mousemove.drag", p, hn).on("mouseup.drag", g, hn), fr(b.view), bo(b), c = !1, l = b.clientX, a = b.clientY, S("start", b));
    }
  }
  function p(b) {
    if (Rt(b), !c) {
      var E = b.clientX - l, S = b.clientY - a;
      c = E * E + S * S > u;
    }
    i.mouse("drag", b);
  }
  function g(b) {
    Ye(b.view).on("mousemove.drag mouseup.drag", null), hr(b.view, c), Rt(b), i.mouse("end", b);
  }
  function y(b, E) {
    if (t.call(this, b, E)) {
      var S = b.changedTouches, k = e.call(this, b, E), N = S.length, _, C;
      for (_ = 0; _ < N; ++_)
        (C = P(this, k, b, E, S[_].identifier, S[_])) && (bo(b), C("start", b, S[_]));
    }
  }
  function m(b) {
    var E = b.changedTouches, S = E.length, k, N;
    for (k = 0; k < S; ++k)
      (N = i[E[k].identifier]) && (Rt(b), N("drag", b, E[k]));
  }
  function x(b) {
    var E = b.changedTouches, S = E.length, k, N;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), k = 0; k < S; ++k)
      (N = i[E[k].identifier]) && (bo(b), N("end", b, E[k]));
  }
  function P(b, E, S, k, N, _) {
    var C = r.copy(), $ = Qe(_ || S, E), M, w, v;
    if ((v = n.call(b, new zo("beforestart", {
      sourceEvent: S,
      target: f,
      identifier: N,
      active: s,
      x: $[0],
      y: $[1],
      dx: 0,
      dy: 0,
      dispatch: C
    }), k)) != null)
      return M = v.x - $[0] || 0, w = v.y - $[1] || 0, function I(L, R, U) {
        var te = $, K;
        switch (L) {
          case "start":
            i[N] = I, K = s++;
            break;
          case "end":
            delete i[N], --s;
          // falls through
          case "drag":
            $ = Qe(U || R, E), K = s;
            break;
        }
        C.call(
          L,
          b,
          new zo(L, {
            sourceEvent: R,
            subject: v,
            target: f,
            identifier: N,
            active: K,
            x: $[0] + M,
            y: $[1] + w,
            dx: $[0] - te[0],
            dy: $[1] - te[1],
            dispatch: C
          }),
          k
        );
      };
  }
  return f.filter = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Ln(!!b), f) : t;
  }, f.container = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Ln(b), f) : e;
  }, f.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Ln(b), f) : n;
  }, f.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Ln(!!b), f) : o;
  }, f.on = function() {
    var b = r.on.apply(r, arguments);
    return b === r ? f : b;
  }, f.clickDistance = function(b) {
    return arguments.length ? (u = (b = +b) * b, f) : Math.sqrt(u);
  }, f;
}
function di(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function gr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function xn() {
}
var gn = 0.7, Xn = 1 / gn, Ht = "\\s*([+-]?\\d+)\\s*", pn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ge = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", wc = /^#([0-9a-f]{3,8})$/, vc = new RegExp(`^rgb\\(${Ht},${Ht},${Ht}\\)$`), _c = new RegExp(`^rgb\\(${Ge},${Ge},${Ge}\\)$`), bc = new RegExp(`^rgba\\(${Ht},${Ht},${Ht},${pn}\\)$`), xc = new RegExp(`^rgba\\(${Ge},${Ge},${Ge},${pn}\\)$`), Ec = new RegExp(`^hsl\\(${pn},${Ge},${Ge}\\)$`), Cc = new RegExp(`^hsla\\(${pn},${Ge},${Ge},${pn}\\)$`), Di = {
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
di(xn, mn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ri,
  // Deprecated! Use color.formatHex.
  formatHex: Ri,
  formatHex8: Sc,
  formatHsl: kc,
  formatRgb: Hi,
  toString: Hi
});
function Ri() {
  return this.rgb().formatHex();
}
function Sc() {
  return this.rgb().formatHex8();
}
function kc() {
  return pr(this).formatHsl();
}
function Hi() {
  return this.rgb().formatRgb();
}
function mn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = wc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Fi(e) : n === 3 ? new $e(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Pn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Pn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = vc.exec(t)) ? new $e(e[1], e[2], e[3], 1) : (e = _c.exec(t)) ? new $e(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = bc.exec(t)) ? Pn(e[1], e[2], e[3], e[4]) : (e = xc.exec(t)) ? Pn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Ec.exec(t)) ? Vi(e[1], e[2] / 100, e[3] / 100, 1) : (e = Cc.exec(t)) ? Vi(e[1], e[2] / 100, e[3] / 100, e[4]) : Di.hasOwnProperty(t) ? Fi(Di[t]) : t === "transparent" ? new $e(NaN, NaN, NaN, 0) : null;
}
function Fi(t) {
  return new $e(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Pn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new $e(t, e, n, o);
}
function Lc(t) {
  return t instanceof xn || (t = mn(t)), t ? (t = t.rgb(), new $e(t.r, t.g, t.b, t.opacity)) : new $e();
}
function Vo(t, e, n, o) {
  return arguments.length === 1 ? Lc(t) : new $e(t, e, n, o ?? 1);
}
function $e(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
di($e, Vo, gr(xn, {
  brighter(t) {
    return t = t == null ? Xn : Math.pow(Xn, t), new $e(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? gn : Math.pow(gn, t), new $e(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new $e(Ct(this.r), Ct(this.g), Ct(this.b), Wn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Oi,
  // Deprecated! Use color.formatHex.
  formatHex: Oi,
  formatHex8: Pc,
  formatRgb: zi,
  toString: zi
}));
function Oi() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}`;
}
function Pc() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}${Et((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function zi() {
  const t = Wn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Ct(this.r)}, ${Ct(this.g)}, ${Ct(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Wn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Ct(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Et(t) {
  return t = Ct(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Vi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Xe(t, e, n, o);
}
function pr(t) {
  if (t instanceof Xe) return new Xe(t.h, t.s, t.l, t.opacity);
  if (t instanceof xn || (t = mn(t)), !t) return new Xe();
  if (t instanceof Xe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new Xe(s, l, a, t.opacity);
}
function Mc(t, e, n, o) {
  return arguments.length === 1 ? pr(t) : new Xe(t, e, n, o ?? 1);
}
function Xe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
di(Xe, Mc, gr(xn, {
  brighter(t) {
    return t = t == null ? Xn : Math.pow(Xn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? gn : Math.pow(gn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new $e(
      xo(t >= 240 ? t - 240 : t + 120, i, o),
      xo(t, i, o),
      xo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Xe(Bi(this.h), Mn(this.s), Mn(this.l), Wn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Wn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Bi(this.h)}, ${Mn(this.s) * 100}%, ${Mn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Bi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Mn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function xo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const mr = (t) => () => t;
function Tc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Ac(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Nc(t) {
  return (t = +t) == 1 ? yr : function(e, n) {
    return n - e ? Ac(e, n, t) : mr(isNaN(e) ? n : e);
  };
}
function yr(t, e) {
  var n = e - t;
  return n ? Tc(t, n) : mr(isNaN(t) ? e : t);
}
const Bo = (function t(e) {
  var n = Nc(e);
  function o(i, r) {
    var s = n((i = Vo(i)).r, (r = Vo(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = yr(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = l(d), i.b = a(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function dt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var qo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Eo = new RegExp(qo.source, "g");
function $c(t) {
  return function() {
    return t;
  };
}
function Ic(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Dc(t, e) {
  var n = qo.lastIndex = Eo.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = qo.exec(t)) && (i = Eo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: dt(o, i) })), n = Eo.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? Ic(a[0].x) : $c(e) : (e = a.length, function(c) {
    for (var d = 0, u; d < e; ++d) l[(u = a[d]).i] = u.x(c);
    return l.join("");
  });
}
var qi = 180 / Math.PI, Yo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function wr(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * qi,
    skewX: Math.atan(a) * qi,
    scaleX: s,
    scaleY: l
  };
}
var Tn;
function Rc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Yo : wr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Hc(t) {
  return t == null || (Tn || (Tn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Tn.setAttribute("transform", t), !(t = Tn.transform.baseVal.consolidate())) ? Yo : (t = t.matrix, wr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function vr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: dt(c, u) }, { i: g - 2, x: dt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: dt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function l(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: dt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function a(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push(i(h) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: dt(c, u) }, { i: g - 2, x: dt(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), l(c.skewX, d.skewX, u, f), a(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var p = -1, g = f.length, y; ++p < g; ) u[(y = f[p]).i] = y.x(h);
      return u.join("");
    };
  };
}
var Fc = vr(Rc, "px, ", "px)", "deg)"), Oc = vr(Hc, ", ", ")", ")"), zc = 1e-12;
function Yi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Vc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Bc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const qc = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - l, p = u - a, g = h * h + p * p, y, m;
    if (g < zc)
      m = Math.log(f / c) / e, y = function(k) {
        return [
          l + k * h,
          a + k * p,
          c * Math.exp(e * k * m)
        ];
      };
    else {
      var x = Math.sqrt(g), P = (f * f - c * c + o * g) / (2 * c * n * x), b = (f * f - c * c - o * g) / (2 * f * n * x), E = Math.log(Math.sqrt(P * P + 1) - P), S = Math.log(Math.sqrt(b * b + 1) - b);
      m = (S - E) / e, y = function(k) {
        var N = k * m, _ = Yi(E), C = c / (n * x) * (_ * Bc(e * N + E) - Vc(E));
        return [
          l + C * h,
          a + C * p,
          c * _ / Yi(e * N + E)
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
var Bt = 0, sn = 0, Jt = 0, _r = 1e3, jn, rn, Un = 0, Lt = 0, yo = 0, yn = typeof performance == "object" && performance.now ? performance : Date, br = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ui() {
  return Lt || (br(Yc), Lt = yn.now() + yo);
}
function Yc() {
  Lt = 0;
}
function Zn() {
  this._call = this._time = this._next = null;
}
Zn.prototype = xr.prototype = {
  constructor: Zn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ui() : +n) + (e == null ? 0 : +e), !this._next && rn !== this && (rn ? rn._next = this : jn = this, rn = this), this._call = t, this._time = n, Xo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Xo());
  }
};
function xr(t, e, n) {
  var o = new Zn();
  return o.restart(t, e, n), o;
}
function Xc() {
  ui(), ++Bt;
  for (var t = jn, e; t; )
    (e = Lt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Bt;
}
function Xi() {
  Lt = (Un = yn.now()) + yo, Bt = sn = 0;
  try {
    Xc();
  } finally {
    Bt = 0, jc(), Lt = 0;
  }
}
function Wc() {
  var t = yn.now(), e = t - Un;
  e > _r && (yo -= e, Un = t);
}
function jc() {
  for (var t, e = jn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : jn = n);
  rn = t, Xo(o);
}
function Xo(t) {
  if (!Bt) {
    sn && (sn = clearTimeout(sn));
    var e = t - Lt;
    e > 24 ? (t < 1 / 0 && (sn = setTimeout(Xi, t - yn.now() - yo)), Jt && (Jt = clearInterval(Jt))) : (Jt || (Un = yn.now(), Jt = setInterval(Wc, _r)), Bt = 1, br(Xi));
  }
}
function Wi(t, e, n) {
  var o = new Zn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Uc = po("start", "end", "cancel", "interrupt"), Zc = [], Er = 0, ji = 1, Wo = 2, On = 3, Ui = 4, jo = 5, zn = 6;
function wo(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Gc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Uc,
    tween: Zc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Er
  });
}
function fi(t, e) {
  var n = je(t, e);
  if (n.state > Er) throw new Error("too late; already scheduled");
  return n;
}
function Ke(t, e) {
  var n = je(t, e);
  if (n.state > On) throw new Error("too late; already running");
  return n;
}
function je(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Gc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = xr(r, 0, n.time);
  function r(c) {
    n.state = ji, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== ji) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === On) return Wi(s);
        h.state === Ui ? (h.state = zn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = zn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (Wi(function() {
      n.state === On && (n.state = Ui, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = Wo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Wo) {
      for (n.state = On, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = jo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === jo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = zn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Vn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Wo && o.state < jo, o.state = zn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Kc(t) {
  return this.each(function() {
    Vn(this, t);
  });
}
function Jc(t, e) {
  var n, o;
  return function() {
    var i = Ke(this, t), r = i.tween;
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
function Qc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Ke(this, t), s = r.tween;
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
function ed(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = je(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Jc : Qc)(n, t, e));
}
function hi(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ke(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return je(i, o).value[e];
  };
}
function Cr(t, e) {
  var n;
  return (typeof e == "number" ? dt : e instanceof mn ? Bo : (n = mn(e)) ? (e = n, Bo) : Dc)(t, e);
}
function td(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function nd(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function od(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function id(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function sd(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function rd(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function ad(t, e) {
  var n = mo(t), o = n === "transform" ? Oc : Cr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? rd : sd)(n, o, hi(this, "attr." + t, e)) : e == null ? (n.local ? nd : td)(n) : (n.local ? id : od)(n, o, e));
}
function ld(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function cd(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function dd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && cd(t, r)), n;
  }
  return i._value = e, i;
}
function ud(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && ld(t, r)), n;
  }
  return i._value = e, i;
}
function fd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = mo(t);
  return this.tween(n, (o.local ? dd : ud)(o, e));
}
function hd(t, e) {
  return function() {
    fi(this, t).delay = +e.apply(this, arguments);
  };
}
function gd(t, e) {
  return e = +e, function() {
    fi(this, t).delay = e;
  };
}
function pd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? hd : gd)(e, t)) : je(this.node(), e).delay;
}
function md(t, e) {
  return function() {
    Ke(this, t).duration = +e.apply(this, arguments);
  };
}
function yd(t, e) {
  return e = +e, function() {
    Ke(this, t).duration = e;
  };
}
function wd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? md : yd)(e, t)) : je(this.node(), e).duration;
}
function vd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ke(this, t).ease = e;
  };
}
function _d(t) {
  var e = this._id;
  return arguments.length ? this.each(vd(e, t)) : je(this.node(), e).ease;
}
function bd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ke(this, t).ease = n;
  };
}
function xd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(bd(this._id, t));
}
function Ed(t) {
  typeof t != "function" && (t = nr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new rt(o, this._parents, this._name, this._id);
}
function Cd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, u = s[l] = new Array(d), f, h = 0; h < d; ++h)
      (f = a[h] || c[h]) && (u[h] = f);
  for (; l < o; ++l)
    s[l] = e[l];
  return new rt(s, this._parents, this._name, this._id);
}
function Sd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function kd(t, e, n) {
  var o, i, r = Sd(e) ? fi : Ke;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function Ld(t, e) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(t) : this.each(kd(n, t, e));
}
function Pd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Md() {
  return this.on("end.remove", Pd(this._id));
}
function Td(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = li(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, u, f = 0; f < a; ++f)
      (d = l[f]) && (u = t.call(d, d.__data__, f, l)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, wo(c[f], e, n, f, c, je(d, n)));
  return new rt(r, this._parents, e, n);
}
function Ad(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = tr(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, u = 0; u < c; ++u)
      if (d = a[u]) {
        for (var f = t.call(d, d.__data__, u, a), h, p = je(d, n), g = 0, y = f.length; g < y; ++g)
          (h = f[g]) && wo(h, e, n, g, f, p);
        r.push(f), s.push(d);
      }
  return new rt(r, s, e, n);
}
var Nd = bn.prototype.constructor;
function $d() {
  return new Nd(this._groups, this._parents);
}
function Id(t, e) {
  var n, o, i;
  return function() {
    var r = Vt(this, t), s = (this.style.removeProperty(t), Vt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function Sr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Dd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Vt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Rd(t, e, n) {
  var o, i, r;
  return function() {
    var s = Vt(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), Vt(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Hd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = Ke(this, t), c = a.on, d = a.value[r] == null ? l || (l = Sr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Fd(t, e, n) {
  var o = (t += "") == "transform" ? Fc : Cr;
  return e == null ? this.styleTween(t, Id(t, o)).on("end.style." + t, Sr(t)) : typeof e == "function" ? this.styleTween(t, Rd(t, o, hi(this, "style." + t, e))).each(Hd(this._id, t)) : this.styleTween(t, Dd(t, o, e), n).on("end.style." + t, null);
}
function Od(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function zd(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Od(t, s, n)), o;
  }
  return r._value = e, r;
}
function Vd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, zd(t, e, n ?? ""));
}
function Bd(t) {
  return function() {
    this.textContent = t;
  };
}
function qd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Yd(t) {
  return this.tween("text", typeof t == "function" ? qd(hi(this, "text", t)) : Bd(t == null ? "" : t + ""));
}
function Xd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Wd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Xd(i)), e;
  }
  return o._value = t, o;
}
function jd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Wd(t));
}
function Ud() {
  for (var t = this._name, e = this._id, n = kr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = je(a, e);
        wo(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new rt(o, this._parents, t, n);
}
function Zd() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Ke(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(a)), c.on = e;
    }), i === 0 && r();
  });
}
var Gd = 0;
function rt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function kr() {
  return ++Gd;
}
var Je = bn.prototype;
rt.prototype = {
  constructor: rt,
  select: Td,
  selectAll: Ad,
  selectChild: Je.selectChild,
  selectChildren: Je.selectChildren,
  filter: Ed,
  merge: Cd,
  selection: $d,
  transition: Ud,
  call: Je.call,
  nodes: Je.nodes,
  node: Je.node,
  size: Je.size,
  empty: Je.empty,
  each: Je.each,
  on: Ld,
  attr: ad,
  attrTween: fd,
  style: Fd,
  styleTween: Vd,
  text: Yd,
  textTween: jd,
  remove: Md,
  tween: ed,
  delay: pd,
  duration: wd,
  ease: _d,
  easeVarying: xd,
  end: Zd,
  [Symbol.iterator]: Je[Symbol.iterator]
};
const Kd = (t) => +t;
function Jd(t) {
  return t * t;
}
function Qd(t) {
  return t * (2 - t);
}
function eu(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function tu(t) {
  return t * t * t;
}
function nu(t) {
  return --t * t * t + 1;
}
function Lr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Pr = Math.PI, Mr = Pr / 2;
function ou(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * Mr);
}
function iu(t) {
  return Math.sin(t * Mr);
}
function su(t) {
  return (1 - Math.cos(Pr * t)) / 2;
}
function wt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function ru(t) {
  return wt(1 - +t);
}
function au(t) {
  return 1 - wt(t);
}
function lu(t) {
  return ((t *= 2) <= 1 ? wt(1 - t) : 2 - wt(t - 1)) / 2;
}
function cu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function du(t) {
  return Math.sqrt(1 - --t * t);
}
function uu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Uo = 4 / 11, fu = 6 / 11, hu = 8 / 11, gu = 3 / 4, pu = 9 / 11, mu = 10 / 11, yu = 15 / 16, wu = 21 / 22, vu = 63 / 64, An = 1 / Uo / Uo;
function _u(t) {
  return 1 - Gn(1 - t);
}
function Gn(t) {
  return (t = +t) < Uo ? An * t * t : t < hu ? An * (t -= fu) * t + gu : t < mu ? An * (t -= pu) * t + yu : An * (t -= wu) * t + vu;
}
function bu(t) {
  return ((t *= 2) <= 1 ? 1 - Gn(1 - t) : Gn(t - 1) + 1) / 2;
}
var gi = 1.70158, xu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(gi), Eu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(gi), Cu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(gi), qt = 2 * Math.PI, pi = 1, mi = 0.3, Su = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return e * wt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(pi, mi), ku = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return 1 - e * wt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(pi, mi), Lu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * wt(-r) * Math.sin((o - r) / n) : 2 - e * wt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(pi, mi), Pu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Lr
};
function Mu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Tu(t) {
  var e, n;
  t instanceof rt ? (e = t._id, t = t._name) : (e = kr(), (n = Pu).time = ui(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && wo(a, t, e, c, s, n || Mu(a, e));
  return new rt(o, this._parents, t, e);
}
bn.prototype.interrupt = Kc;
bn.prototype.transition = Tu;
const Nn = (t) => () => t;
function Au(t, {
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
function nt(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
nt.prototype = {
  constructor: nt,
  scale: function(t) {
    return t === 1 ? this : new nt(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new nt(this.k, this.x + this.k * t, this.y + this.k * e);
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
var Kn = new nt(1, 0, 0);
nt.prototype;
function Co(t) {
  t.stopImmediatePropagation();
}
function Qt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Nu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function $u() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Zi() {
  return this.__zoom || Kn;
}
function Iu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Du() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ru(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Hu() {
  var t = Nu, e = $u, n = Ru, o = Iu, i = Du, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = qc, c = po("start", "zoom", "end"), d, u, f, h = 500, p = 150, g = 0, y = 10;
  function m(v) {
    v.property("__zoom", Zi).on("wheel.zoom", N, { passive: !1 }).on("mousedown.zoom", _).on("dblclick.zoom", C).filter(i).on("touchstart.zoom", $).on("touchmove.zoom", M).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(v, I, L, R) {
    var U = v.selection ? v.selection() : v;
    U.property("__zoom", Zi), v !== U ? E(v, I, L, R) : U.interrupt().each(function() {
      S(this, arguments).event(R).start().zoom(null, typeof I == "function" ? I.apply(this, arguments) : I).end();
    });
  }, m.scaleBy = function(v, I, L, R) {
    m.scaleTo(v, function() {
      var U = this.__zoom.k, te = typeof I == "function" ? I.apply(this, arguments) : I;
      return U * te;
    }, L, R);
  }, m.scaleTo = function(v, I, L, R) {
    m.transform(v, function() {
      var U = e.apply(this, arguments), te = this.__zoom, K = L == null ? b(U) : typeof L == "function" ? L.apply(this, arguments) : L, T = te.invert(K), A = typeof I == "function" ? I.apply(this, arguments) : I;
      return n(P(x(te, A), K, T), U, s);
    }, L, R);
  }, m.translateBy = function(v, I, L, R) {
    m.transform(v, function() {
      return n(this.__zoom.translate(
        typeof I == "function" ? I.apply(this, arguments) : I,
        typeof L == "function" ? L.apply(this, arguments) : L
      ), e.apply(this, arguments), s);
    }, null, R);
  }, m.translateTo = function(v, I, L, R, U) {
    m.transform(v, function() {
      var te = e.apply(this, arguments), K = this.__zoom, T = R == null ? b(te) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Kn.translate(T[0], T[1]).scale(K.k).translate(
        typeof I == "function" ? -I.apply(this, arguments) : -I,
        typeof L == "function" ? -L.apply(this, arguments) : -L
      ), te, s);
    }, R, U);
  };
  function x(v, I) {
    return I = Math.max(r[0], Math.min(r[1], I)), I === v.k ? v : new nt(I, v.x, v.y);
  }
  function P(v, I, L) {
    var R = I[0] - L[0] * v.k, U = I[1] - L[1] * v.k;
    return R === v.x && U === v.y ? v : new nt(v.k, R, U);
  }
  function b(v) {
    return [(+v[0][0] + +v[1][0]) / 2, (+v[0][1] + +v[1][1]) / 2];
  }
  function E(v, I, L, R) {
    v.on("start.zoom", function() {
      S(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var U = this, te = arguments, K = S(U, te).event(R), T = e.apply(U, te), A = L == null ? b(T) : typeof L == "function" ? L.apply(U, te) : L, H = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), ae = U.__zoom, le = typeof I == "function" ? I.apply(U, te) : I, ie = a(ae.invert(A).concat(H / ae.k), le.invert(A).concat(H / le.k));
      return function(V) {
        if (V === 1) V = le;
        else {
          var z = ie(V), X = H / z[2];
          V = new nt(X, A[0] - z[0] * X, A[1] - z[1] * X);
        }
        K.zoom(null, V);
      };
    });
  }
  function S(v, I, L) {
    return !L && v.__zooming || new k(v, I);
  }
  function k(v, I) {
    this.that = v, this.args = I, this.active = 0, this.sourceEvent = null, this.extent = e.apply(v, I), this.taps = 0;
  }
  k.prototype = {
    event: function(v) {
      return v && (this.sourceEvent = v), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(v, I) {
      return this.mouse && v !== "mouse" && (this.mouse[1] = I.invert(this.mouse[0])), this.touch0 && v !== "touch" && (this.touch0[1] = I.invert(this.touch0[0])), this.touch1 && v !== "touch" && (this.touch1[1] = I.invert(this.touch1[0])), this.that.__zoom = I, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(v) {
      var I = Ye(this.that).datum();
      c.call(
        v,
        this.that,
        new Au(v, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        I
      );
    }
  };
  function N(v, ...I) {
    if (!t.apply(this, arguments)) return;
    var L = S(this, I).event(v), R = this.__zoom, U = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), te = Qe(v);
    if (L.wheel)
      (L.mouse[0][0] !== te[0] || L.mouse[0][1] !== te[1]) && (L.mouse[1] = R.invert(L.mouse[0] = te)), clearTimeout(L.wheel);
    else {
      if (R.k === U) return;
      L.mouse = [te, R.invert(te)], Vn(this), L.start();
    }
    Qt(v), L.wheel = setTimeout(K, p), L.zoom("mouse", n(P(x(R, U), L.mouse[0], L.mouse[1]), L.extent, s));
    function K() {
      L.wheel = null, L.end();
    }
  }
  function _(v, ...I) {
    if (f || !t.apply(this, arguments)) return;
    var L = v.currentTarget, R = S(this, I, !0).event(v), U = Ye(v.view).on("mousemove.zoom", A, !0).on("mouseup.zoom", H, !0), te = Qe(v, L), K = v.clientX, T = v.clientY;
    fr(v.view), Co(v), R.mouse = [te, this.__zoom.invert(te)], Vn(this), R.start();
    function A(ae) {
      if (Qt(ae), !R.moved) {
        var le = ae.clientX - K, ie = ae.clientY - T;
        R.moved = le * le + ie * ie > g;
      }
      R.event(ae).zoom("mouse", n(P(R.that.__zoom, R.mouse[0] = Qe(ae, L), R.mouse[1]), R.extent, s));
    }
    function H(ae) {
      U.on("mousemove.zoom mouseup.zoom", null), hr(ae.view, R.moved), Qt(ae), R.event(ae).end();
    }
  }
  function C(v, ...I) {
    if (t.apply(this, arguments)) {
      var L = this.__zoom, R = Qe(v.changedTouches ? v.changedTouches[0] : v, this), U = L.invert(R), te = L.k * (v.shiftKey ? 0.5 : 2), K = n(P(x(L, te), R, U), e.apply(this, I), s);
      Qt(v), l > 0 ? Ye(this).transition().duration(l).call(E, K, R, v) : Ye(this).call(m.transform, K, R, v);
    }
  }
  function $(v, ...I) {
    if (t.apply(this, arguments)) {
      var L = v.touches, R = L.length, U = S(this, I, v.changedTouches.length === R).event(v), te, K, T, A;
      for (Co(v), K = 0; K < R; ++K)
        T = L[K], A = Qe(T, this), A = [A, this.__zoom.invert(A), T.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== A[2] && (U.touch1 = A, U.taps = 0) : (U.touch0 = A, te = !0, U.taps = 1 + !!d);
      d && (d = clearTimeout(d)), te && (U.taps < 2 && (u = A[0], d = setTimeout(function() {
        d = null;
      }, h)), Vn(this), U.start());
    }
  }
  function M(v, ...I) {
    if (this.__zooming) {
      var L = S(this, I).event(v), R = v.changedTouches, U = R.length, te, K, T, A;
      for (Qt(v), te = 0; te < U; ++te)
        K = R[te], T = Qe(K, this), L.touch0 && L.touch0[2] === K.identifier ? L.touch0[0] = T : L.touch1 && L.touch1[2] === K.identifier && (L.touch1[0] = T);
      if (K = L.that.__zoom, L.touch1) {
        var H = L.touch0[0], ae = L.touch0[1], le = L.touch1[0], ie = L.touch1[1], V = (V = le[0] - H[0]) * V + (V = le[1] - H[1]) * V, z = (z = ie[0] - ae[0]) * z + (z = ie[1] - ae[1]) * z;
        K = x(K, Math.sqrt(V / z)), T = [(H[0] + le[0]) / 2, (H[1] + le[1]) / 2], A = [(ae[0] + ie[0]) / 2, (ae[1] + ie[1]) / 2];
      } else if (L.touch0) T = L.touch0[0], A = L.touch0[1];
      else return;
      L.zoom("touch", n(P(K, T, A), L.extent, s));
    }
  }
  function w(v, ...I) {
    if (this.__zooming) {
      var L = S(this, I).event(v), R = v.changedTouches, U = R.length, te, K;
      for (Co(v), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), te = 0; te < U; ++te)
        K = R[te], L.touch0 && L.touch0[2] === K.identifier ? delete L.touch0 : L.touch1 && L.touch1[2] === K.identifier && delete L.touch1;
      if (L.touch1 && !L.touch0 && (L.touch0 = L.touch1, delete L.touch1), L.touch0) L.touch0[1] = this.__zoom.invert(L.touch0[0]);
      else if (L.end(), L.taps === 2 && (K = Qe(K, this), Math.hypot(u[0] - K[0], u[1] - K[1]) < y)) {
        var T = Ye(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : Nn(+v), m) : o;
  }, m.filter = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : Nn(!!v), m) : t;
  }, m.touchable = function(v) {
    return arguments.length ? (i = typeof v == "function" ? v : Nn(!!v), m) : i;
  }, m.extent = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : Nn([[+v[0][0], +v[0][1]], [+v[1][0], +v[1][1]]]), m) : e;
  }, m.scaleExtent = function(v) {
    return arguments.length ? (r[0] = +v[0], r[1] = +v[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(v) {
    return arguments.length ? (s[0][0] = +v[0][0], s[1][0] = +v[1][0], s[0][1] = +v[0][1], s[1][1] = +v[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(v) {
    return arguments.length ? (n = v, m) : n;
  }, m.duration = function(v) {
    return arguments.length ? (l = +v, m) : l;
  }, m.interpolate = function(v) {
    return arguments.length ? (a = v, m) : a;
  }, m.on = function() {
    var v = c.on.apply(c, arguments);
    return v === c ? m : v;
  }, m.clickDistance = function(v) {
    return arguments.length ? (g = (v = +v) * v, m) : Math.sqrt(g);
  }, m.tapDistance = function(v) {
    return arguments.length ? (y = +v, m) : y;
  }, m;
}
function Gi(t) {
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
function Fu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, l = Ye(t);
  let a = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (k) => {
    c && k.code === c && (a = !0, t.style.cursor = "grab");
  }, u = (k) => {
    c && k.code === c && (a = !1, t.style.cursor = "");
  }, f = () => {
    a = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Hu().scaleExtent([o, i]).on("start", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grabbing");
    const { x: N, y: _, k: C } = k.transform;
    e.onMoveStart?.({ x: N, y: _, zoom: C });
  }).on("zoom", (k) => {
    const { x: N, y: _, k: C } = k.transform;
    n({ x: N, y: _, zoom: C }), k.sourceEvent && e.onMove?.({ x: N, y: _, zoom: C });
  }).on("end", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grab");
    const { x: N, y: _, k: C } = k.transform;
    e.onMoveEnd?.({ x: N, y: _, zoom: C });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Gi({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => a,
    panOnDrag: e.panOnDrag
  })), l.call(h), e.zoomOnDoubleClick === !1 && l.on("dblclick.zoom", null);
  let p = e.panOnScroll ?? !1, g = e.panOnScrollDirection ?? "both", y = e.panOnScrollSpeed ?? 1, m = !1;
  const x = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, P = (k) => {
    x && k.code === x && (m = !0);
  }, b = (k) => {
    x && k.code === x && (m = !1);
  }, E = () => {
    m = !1;
  };
  x && (window.addEventListener("keydown", P), window.addEventListener("keyup", b), window.addEventListener("blur", E));
  const S = (k) => {
    if (e.isLocked?.()) return;
    const N = k.ctrlKey || k.metaKey || m;
    if (!(p ? !N : k.shiftKey)) return;
    k.preventDefault(), k.stopPropagation();
    const C = y;
    let $ = 0, M = 0;
    g !== "horizontal" && (M = -k.deltaY * C), g !== "vertical" && ($ = -k.deltaX * C, k.shiftKey && k.deltaX === 0 && g === "both" && ($ = -k.deltaY * C, M = 0)), e.onScrollPan?.($, M);
  };
  return t.addEventListener("wheel", S, { passive: !1, capture: !0 }), {
    setViewport(k, N) {
      const _ = N?.duration ?? 0, C = Kn.translate(k.x ?? 0, k.y ?? 0).scale(k.zoom ?? 1);
      _ > 0 ? l.transition().duration(_).call(h.transform, C) : l.call(h.transform, C);
    },
    getTransform() {
      return t.__zoom ?? Kn;
    },
    update(k) {
      if ((k.minZoom !== void 0 || k.maxZoom !== void 0) && h.scaleExtent([
        k.minZoom ?? o,
        k.maxZoom ?? i
      ]), k.pannable !== void 0 || k.zoomable !== void 0) {
        const N = k.pannable ?? r, _ = k.zoomable ?? s;
        h.filter(Gi({
          pannable: N,
          zoomable: _,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => a,
          panOnDrag: e.panOnDrag
        }));
      }
      k.panOnScroll !== void 0 && (p = k.panOnScroll), k.panOnScrollDirection !== void 0 && (g = k.panOnScrollDirection), k.panOnScrollSpeed !== void 0 && (y = k.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", S, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), x && (window.removeEventListener("keydown", P), window.removeEventListener("keyup", b), window.removeEventListener("blur", E)), l.on(".zoom", null);
    }
  };
}
function Tr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Ou(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const _e = 150, Ee = 50;
function vo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - a / 2, y: u - c / 2, width: a, height: c };
}
function Yt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? _e, a = s.dimensions?.height ?? Ee, c = Ut(s, e), d = s.rotation ? vo(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function zu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? Ee, a = Ut(r, n), c = r.rotation ? vo(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Vu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? Ee, a = Ut(r, n), c = r.rotation ? vo(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, p = e / 2 - h.x * f, g = n / 2 - h.y * f;
  return { x: p, y: g, zoom: f };
}
function Bu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class qu {
  constructor(e = 300) {
    this._cells = /* @__PURE__ */ new Map(), this._nodeCells = /* @__PURE__ */ new Map(), this._cellSize = e;
  }
  _cellKey(e, n) {
    return `${e},${n}`;
  }
  _getCellRange(e, n, o, i) {
    return {
      minCX: Math.floor(e / this._cellSize),
      minCY: Math.floor(n / this._cellSize),
      maxCX: Math.floor((e + o) / this._cellSize),
      maxCY: Math.floor((n + i) / this._cellSize)
    };
  }
  insert(e, n, o, i, r) {
    this.remove(e);
    const { minCX: s, minCY: l, maxCX: a, maxCY: c } = this._getCellRange(n, o, i, r), d = [];
    for (let u = s; u <= a; u++)
      for (let f = l; f <= c; f++) {
        const h = this._cellKey(u, f);
        d.push(h);
        let p = this._cells.get(h);
        p || (p = /* @__PURE__ */ new Set(), this._cells.set(h, p)), p.add(e);
      }
    this._nodeCells.set(e, d);
  }
  remove(e) {
    const n = this._nodeCells.get(e);
    if (n) {
      for (const o of n) {
        const i = this._cells.get(o);
        i && (i.delete(e), i.size === 0 && this._cells.delete(o));
      }
      this._nodeCells.delete(e);
    }
  }
  update(e, n, o, i, r) {
    this.insert(e, n, o, i, r);
  }
  query(e) {
    const { minCX: n, minCY: o, maxCX: i, maxCY: r } = this._getCellRange(
      e.minX,
      e.minY,
      e.maxX - e.minX,
      e.maxY - e.minY
    ), s = /* @__PURE__ */ new Set();
    for (let l = n; l <= i; l++)
      for (let a = o; a <= r; a++) {
        const c = this._cells.get(this._cellKey(l, a));
        if (c)
          for (const d of c)
            s.add(d);
      }
    return s;
  }
  clear() {
    this._cells.clear(), this._nodeCells.clear();
  }
  get size() {
    return this._nodeCells.size;
  }
}
function Ut(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? _e, i = t.dimensions?.height ?? Ee;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let Ar = !1;
function Nr(t) {
  Ar = t;
}
function Y(t, e, n) {
  if (!Ar) return;
  const o = `%c[AlpineFlow:${t}]`, i = Yu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Yu(t) {
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
const wn = "#64748b", yi = "#d4d4d8", $r = "#ef4444", Xu = "2", Wu = "6 3", Ki = 1.2, Zo = 0.2, Bn = 5, Ji = 25;
class ju {
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
const Uu = 16;
function Zu() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Uu),
    cancel: (t) => clearTimeout(t)
  };
}
class Ir {
  constructor() {
    this._scheduler = Zu(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Qn = new Ir(), Gu = {
  linear: Kd,
  easeIn: Jd,
  easeOut: Qd,
  easeInOut: eu,
  easeCubicIn: tu,
  easeCubicOut: nu,
  easeCubicInOut: Lr,
  easeCircIn: cu,
  easeCircOut: du,
  easeCircInOut: uu,
  easeSinIn: ou,
  easeSinOut: iu,
  easeSinInOut: su,
  easeExpoIn: ru,
  easeExpoOut: au,
  easeExpoInOut: lu,
  easeBounce: Gn,
  easeBounceIn: _u,
  easeBounceInOut: bu,
  easeElastic: ku,
  easeElasticIn: Su,
  easeElasticInOut: Lu,
  easeBack: Cu,
  easeBackIn: xu,
  easeBackOut: Eu
};
function Dr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function eo(t) {
  return typeof t == "function" ? t : Gu[t ?? "easeInOut"];
}
function st(t, e, n) {
  return t + (e - t) * n;
}
function wi(t, e, n) {
  return Bo(t, e)(n);
}
function vn(t) {
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
const Qi = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, es = /^(#|rgb|hsl)/;
function Rr(t, e, n) {
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
    const a = Qi.exec(s), c = Qi.exec(l);
    if (a && c) {
      const d = parseFloat(a[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = st(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (es.test(s) && es.test(l)) {
      o[r] = wi(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function Ku(t, e, n, o) {
  let i = st(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: st(t.x, e.x, n),
    y: st(t.y, e.y, n),
    zoom: i
  };
}
class Ju {
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
class Qu {
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
const en = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Hr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? en.stiffness, i = e.damping ?? en.damping, r = e.mass ?? en.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? en.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? en.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const ts = {
  timeConstant: 350,
  restVelocity: 0.5
};
function vi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? ts.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < ts.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function _i(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Fr(t, e, n, o) {
  if (n <= 0)
    return;
  vi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? _i(o) : null;
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
function Or(t, e, n, o) {
  const i = _i(o), r = e.values.map(
    (p) => p[o] ?? (i ? p[i] : void 0) ?? t.value
  );
  if (r.length < 2) {
    t.value = r[0] ?? t.value, t.settled = !0;
    return;
  }
  const s = e.offsets ?? r.map((p, g) => g / (r.length - 1)), l = Math.max(0, Math.min(1, n));
  let a = 0;
  for (let p = 0; p < s.length - 1; p++)
    l >= s[p] && (a = p);
  const c = s[a], d = s[a + 1] ?? 1, u = d > c ? (l - c) / (d - c) : 1, f = r[a], h = r[a + 1] ?? r[a];
  t.value = f + (h - f) * Math.max(0, Math.min(1, u)), l >= 1 && (t.value = r[r.length - 1], t.settled = !0);
}
const ns = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, os = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, is = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function zr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return ns[n] ? { ...ns[n] } : null;
    case "decay":
      return os[n] ? { ...os[n] } : null;
    case "inertia":
      return is[n] ? { ...is[n] } : null;
    default:
      return null;
  }
}
function ss(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function ef(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? st(t, e, n) : ss(t) && ss(e) ? wi(t, e, n) : n < 0.5 ? t : e;
}
class tf {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Ju(), this._activeTransaction = null, this._engine = e;
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
    const e = new Qu();
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
      tag: u,
      tags: f,
      while: h,
      whileStopMode: p = "jump-end",
      motion: g,
      maxDuration: y = 5e3
    } = n, m = eo(i), x = g ? zr(g) : void 0;
    for (const v of e) {
      const I = this._ownership.get(v.key);
      if (I && !I.stopped) {
        const L = I.currentValues.get(v.key);
        L !== void 0 && (v.from = L), I.entries = I.entries.filter((R) => R.key !== v.key), I.entries.length === 0 && this._stop(I, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const v of e)
        this._activeTransaction.captureProperty(v.key, v.from, v.apply);
    if (o <= 0) {
      const v = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (const U of e)
        v.set(U.key, U.from), I.set(U.key, U.to);
      a?.();
      for (const U of e)
        U.apply(U.to);
      const L = [...u ? [u] : [], ...f ?? []], R = {
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
          return I;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return v;
        },
        get _target() {
          return I;
        }
      };
      return this._registry.register(R), queueMicrotask(() => this._registry.unregister(R)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(R), d?.(), R;
    }
    const P = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
    for (const v of e)
      P.set(v.key, v.from), b.set(v.key, v.to);
    let E;
    if (x) {
      E = /* @__PURE__ */ new Map();
      for (const v of e) {
        if (typeof v.from != "number" || typeof v.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${v.key}" is non-numeric; snapping to target.`
          ), v.apply(v.to);
          continue;
        }
        let I = 0;
        if (x.type === "decay" || x.type === "inertia") {
          const L = x.velocity;
          if (typeof L == "number")
            I = L;
          else if (L && typeof L == "object") {
            const U = L, te = _i(v.key);
            I = U[v.key] ?? (te ? U[te] ?? 0 : 0);
          }
          const R = x.power ?? 0.8;
          I *= R;
        }
        E.set(v.key, {
          value: v.from,
          velocity: I,
          target: v.to,
          settled: !1
        });
      }
      E.size === 0 && (E = void 0);
    }
    const S = s === "ping-pong" ? "reverse" : s, k = l === "end" ? "backward" : "forward";
    let N;
    const _ = new Promise((v) => {
      N = v;
    }), C = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: k,
      duration: o,
      easingFn: m,
      loop: S,
      onStart: a,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: N,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      _lastTickWallTime: 0,
      snapshot: P,
      target: b,
      _currentFinished: _,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: E ? x : void 0,
      physicsStates: E,
      maxDuration: y,
      isPhysics: !!E,
      _prevElapsed: 0
    };
    if (l === "end")
      for (const v of C.entries)
        v.apply(v.to), C.currentValues.set(v.key, v.to);
    else
      for (const v of C.entries)
        C.currentValues.set(v.key, v.from);
    for (const v of e)
      this._ownership.set(v.key, C);
    this._groups.add(C);
    const $ = this._engine.register((v) => this._tick(C, v), r);
    C.engineHandle = $;
    const M = [...u ? [u] : [], ...f ?? []], w = {
      _tags: M.length > 0 ? M : void 0,
      pause: () => this._pause(C),
      resume: () => this._resume(C),
      stop: (v) => this._stop(C, v?.mode ?? "jump-end"),
      reverse: () => this._reverse(C),
      play: () => this._play(C),
      playForward: () => this._playDirection(C, "forward"),
      playBackward: () => this._playDirection(C, "backward"),
      restart: (v) => this._restart(C, v),
      get direction() {
        return C.direction;
      },
      get isFinished() {
        return C.isFinished;
      },
      get currentValue() {
        return C.currentValues;
      },
      get finished() {
        return C._currentFinished;
      },
      get _snapshot() {
        return C.snapshot;
      },
      get _target() {
        return C.target;
      }
    };
    return this._registry.register(w), C._handle = w, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(w), w;
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
      const a = ef(l.from, l.to, s);
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
              Hr(d, e.motionConfig, i);
              break;
            case "decay":
              vi(d, e.motionConfig, i);
              break;
            case "inertia":
              Fr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Or(d, e.motionConfig, h, c.key);
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
          const u = e.entries.find((f) => f.key === c);
          u && (u.apply(d.value), e.currentValues.set(u.key, d.value));
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
const Vr = /* @__PURE__ */ new Map();
function nf(t, e) {
  Vr.set(t, e);
}
function So(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ft(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Ot(t, e) {
  return `${e}__${t.type}__${(t.color ?? yi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function to(t, e) {
  const n = So(t.color ?? yi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = So(t.orient ?? "auto-start-reverse"), a = So(e);
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
  const c = Vr.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : to({ ...t, type: "arrowclosed" }, e);
}
const vt = 200, _t = 150, of = 1.2, tn = "http://www.w3.org/2000/svg";
function sf(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(tn, "svg");
  c.setAttribute("width", String(vt)), c.setAttribute("height", String(_t));
  const d = document.createElementNS(tn, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(vt)), d.setAttribute("height", String(_t));
  const u = document.createElementNS(tn, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(tn, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, p = 1;
  function g() {
    const $ = n();
    if (h = Yt($.nodes.filter((M) => !M.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      p = 1;
      return;
    }
    p = Math.max(
      h.width / vt,
      h.height / _t
    ) * of;
  }
  function y($) {
    return typeof l == "function" ? l($) : l;
  }
  function m() {
    const $ = n();
    g(), u.innerHTML = "";
    const M = (vt - h.width / p) / 2, w = (_t - h.height / p) / 2;
    for (const v of $.nodes) {
      if (v.hidden) continue;
      const I = document.createElementNS(tn, "rect"), L = (v.dimensions?.width ?? _e) / p, R = (v.dimensions?.height ?? Ee) / p, U = (v.position.x - h.x) / p + M, te = (v.position.y - h.y) / p + w;
      I.setAttribute("x", String(U)), I.setAttribute("y", String(te)), I.setAttribute("width", String(L)), I.setAttribute("height", String(R)), I.setAttribute("rx", "2");
      const K = y(v);
      K && (I.style.fill = K), u.appendChild(I);
    }
    x();
  }
  function x() {
    const $ = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const M = (vt - h.width / p) / 2, w = (_t - h.height / p) / 2, v = (-$.viewport.x / $.viewport.zoom - h.x) / p + M, I = (-$.viewport.y / $.viewport.zoom - h.y) / p + w, L = $.containerWidth / $.viewport.zoom / p, R = $.containerHeight / $.viewport.zoom / p, U = `M0,0 H${vt} V${_t} H0 Z`, te = `M${v},${I} h${L} v${R} h${-L} Z`;
    f.setAttribute("d", `${U} ${te}`);
  }
  let P = !1;
  function b($, M) {
    const w = (vt - h.width / p) / 2, v = (_t - h.height / p) / 2, I = ($ - w) * p + h.x, L = (M - v) * p + h.y;
    return { x: I, y: L };
  }
  function E($) {
    const M = c.getBoundingClientRect(), w = $.clientX - M.left, v = $.clientY - M.top, I = n(), L = b(w, v), R = -L.x * I.viewport.zoom + I.containerWidth / 2, U = -L.y * I.viewport.zoom + I.containerHeight / 2;
    o({ x: R, y: U, zoom: I.viewport.zoom });
  }
  function S($) {
    i.minimapPannable && (P = !0, c.setPointerCapture($.pointerId), E($));
  }
  function k($) {
    P && E($);
  }
  function N($) {
    P && (P = !1, c.releasePointerCapture($.pointerId));
  }
  c.addEventListener("pointerdown", S), c.addEventListener("pointermove", k), c.addEventListener("pointerup", N);
  function _($) {
    if (!i.minimapZoomable)
      return;
    $.preventDefault();
    const M = n(), w = i.minZoom ?? 0.5, v = i.maxZoom ?? 2, I = $.deltaY > 0 ? 0.9 : 1.1, L = Math.min(Math.max(M.viewport.zoom * I, w), v);
    o({ zoom: L });
  }
  c.addEventListener("wheel", _, { passive: !1 });
  function C() {
    c.removeEventListener("pointerdown", S), c.removeEventListener("pointermove", k), c.removeEventListener("pointerup", N), c.removeEventListener("wheel", _), a.remove();
  }
  return { render: m, updateViewport: x, destroy: C };
}
const rf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', af = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', lf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', rs = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', cf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', df = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', as = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', uf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function ff(t, e) {
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
    onFitView: u,
    onToggleInteractive: f,
    onResetPanels: h,
    onToggleFullscreen: p
  } = e, g = document.createElement("div"), y = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  a ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), g.className = y.join(" "), g.setAttribute("role", "toolbar"), g.setAttribute("aria-label", "Flow controls");
  let m = null, x = null;
  if (i) {
    const E = Mt(rf, "Zoom in", c), S = Mt(af, "Zoom out", d);
    g.appendChild(E), g.appendChild(S);
  }
  if (r) {
    const E = Mt(lf, "Fit view", u);
    g.appendChild(E);
  }
  if (s && (m = Mt(rs, "Toggle interactivity", f), g.appendChild(m)), l) {
    const E = Mt(df, "Reset panels", h);
    g.appendChild(E);
  }
  p && (x = Mt(as, "Toggle fullscreen", p), x.classList.add("flow-controls-button-fullscreen"), g.appendChild(x)), g.addEventListener("mousedown", (E) => E.stopPropagation()), g.addEventListener("pointerdown", (E) => E.stopPropagation()), g.addEventListener("wheel", (E) => E.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function P(E) {
    if (m && typeof E.isInteractive == "boolean") {
      Go(m, E.isInteractive ? rs : cf);
      const S = E.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = S, m.setAttribute("aria-label", S);
    }
    if (x && typeof E.isFullscreen == "boolean") {
      Go(x, E.isFullscreen ? uf : as);
      const S = E.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      x.title = S, x.setAttribute("aria-label", S), x.classList.toggle("flow-controls-button-fullscreen--active", E.isFullscreen);
    }
  }
  function b() {
    g.remove();
  }
  return { update: P, destroy: b };
}
function Mt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Go(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Go(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ls = 5;
function hf(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function l(f, h, p = "partial") {
    o = f, i = h, r = f, s = h, n = !0, e.style.left = `${f}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${p}`);
  }
  function a(f, h) {
    if (!n)
      return;
    r = f, s = h;
    const p = Math.min(o, r), g = Math.min(i, s), y = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${p}px`, e.style.top = `${g}px`, e.style.width = `${y}px`, e.style.height = `${m}px`;
  }
  function c(f) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), p = Math.abs(s - i);
    if (h < ls && p < ls)
      return null;
    const g = Math.min(o, r), y = Math.min(i, s), m = (g - f.x) / f.zoom, x = (y - f.y) / f.zoom, P = h / f.zoom, b = p / f.zoom;
    return { x: m, y: x, width: P, height: b };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: u };
}
const cs = 3;
function gf(t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.classList.add("flow-lasso-svg"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), t.appendChild(e);
  const n = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  n.classList.add("flow-lasso-path"), e.appendChild(n);
  let o = !1, i = [];
  function r(d, u, f = "partial") {
    o = !0, i = [{ x: d, y: u }], e.classList.remove("flow-lasso-partial", "flow-lasso-full"), e.classList.add("flow-lasso-active", `flow-lasso-${f}`), n.setAttribute("points", `${d},${u}`);
  }
  function s(d, u) {
    if (!o)
      return;
    const f = i[i.length - 1], h = d - f.x, p = u - f.y;
    h * h + p * p < cs * cs || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
  }
  function l(d) {
    if (!o || (o = !1, e.classList.remove("flow-lasso-active", "flow-lasso-partial", "flow-lasso-full"), n.setAttribute("points", ""), i.length < 3))
      return null;
    const u = i.map((f) => ({
      x: (f.x - d.x) / d.zoom,
      y: (f.y - d.y) / d.zoom
    }));
    return i = [], u;
  }
  function a() {
    return o;
  }
  function c() {
    e.remove();
  }
  return { start: r, update: s, end: l, isActive: a, destroy: c };
}
function bi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function pf(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, u = l - r, f = a * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * u - p * d) / f, y = (h * c - p * a) / f;
  return g >= 0 && g <= 1 && y >= 0 && y <= 1;
}
function mf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (bi(s, l, t)) return !0;
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
    for (const [u, f, h, p] of a)
      if (pf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, p))
        return !0;
  return !1;
}
function Br(t) {
  const e = t.dimensions?.width ?? _e, n = t.dimensions?.height ?? Ee;
  return t.rotation ? vo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function yf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Br(n);
    return mf(e, o);
  });
}
function wf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Br(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => bi(r.x, r.y, e));
  });
}
function vf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Ko(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function _f(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function bf(t, e, n) {
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
function xf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function Ef(t, e, n) {
  const o = new Map(e.map((a) => [a.id, a])), i = new Set(
    n.map((a) => `${a.source}|${a.target}|${a.sourceHandle ?? ""}|${a.targetHandle ?? ""}`)
  ), r = [], s = /* @__PURE__ */ new Set();
  let l = 0;
  for (const a of t) {
    if (o.get(a)?.reconnectOnDelete === !1) continue;
    const d = n.filter(
      (f) => f.target === a && !t.has(f.source)
    ), u = n.filter(
      (f) => f.source === a && !t.has(f.target)
    );
    if (!(d.length === 0 || u.length === 0))
      for (const f of d)
        for (const h of u) {
          if (f.source === h.target) continue;
          const p = `${f.source}|${h.target}|${f.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(p) || s.has(p)) continue;
          const g = {
            id: `reconnect-${f.source}-${h.target}-${l++}`,
            source: f.source,
            target: h.target,
            sourceHandle: f.sourceHandle,
            targetHandle: h.targetHandle
          };
          f.type && (g.type = f.type), f.animated !== void 0 && (g.animated = f.animated), f.style && (g.style = f.style), f.class && (g.class = f.class), f.markerEnd && (g.markerEnd = f.markerEnd), f.markerStart && (g.markerStart = f.markerStart), f.label && (g.label = f.label), s.add(p), r.push(g);
        }
  }
  return r;
}
function ut(t, e, n) {
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
function ft(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && bf(t.source, t.target, e));
}
const We = "_flowHandleValidate";
function Cf(t) {
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
        typeof l == "function" ? e[We] = l : (delete e[We], requestAnimationFrame(() => {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (e[We] = a[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[We];
      });
    }
  );
}
const ht = "_flowHandleLimit";
function Sf(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[ht] = s : delete e[ht];
      }), r(() => {
        delete e[ht];
      });
    }
  );
}
const St = "_flowHandleConnectableStart", ot = "_flowHandleConnectableEnd";
function kf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[St] = u), d && (e[ot] = u);
      }), s(() => {
        delete e[St], delete e[ot];
      });
    }
  );
}
function En(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function qr(t) {
  return En(t, t.draggable);
}
function Lf(t) {
  return En(t, t.deletable);
}
function Be(t) {
  return En(t, t.connectable);
}
function Jo(t) {
  return En(t, t.selectable);
}
function ds(t) {
  return En(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(l * l + a * a), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), p = n - l / u * h, g = o - a / u * h, y = n + c / f * h, m = o + d / f * h;
  return `L${p},${g} Q${n},${o} ${y},${m}`;
}
function Cn({
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
function $n(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function Pf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const l = n === "left" || n === "right", a = r === "left" || r === "right", c = l ? t + (n === "right" ? 1 : -1) * $n(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = l ? e : e + (n === "bottom" ? 1 : -1) * $n(
    n === "bottom" ? i - e : e - i,
    s
  ), u = a ? o + (r === "right" ? 1 : -1) * $n(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = a ? i : i + (r === "bottom" ? 1 : -1) * $n(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function no(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = Pf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = Cn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function _y({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: l, offsetX: a, offsetY: c } = Cn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: l },
    labelOffsetX: a,
    labelOffsetY: c
  };
}
function us(t) {
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
function Mf(t, e, n, o, i, r, s) {
  const l = us(n), a = us(r), c = t + l.x * s, d = e + l.y * s, u = o + a.x * s, f = i + a.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const g = (c + u) / 2, y = (d + f) / 2;
    return h ? [
      [c, e],
      [g, e],
      [g, i],
      [u, i]
    ] : [
      [t, d],
      [t, y],
      [o, y],
      [o, f]
    ];
  }
  return h ? [
    [c, e],
    [o, e],
    [o, f]
  ] : [
    [t, d],
    [t, i],
    [u, i]
  ];
}
function _n({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: l = 10
}) {
  const a = Mf(
    t,
    e,
    n,
    o,
    i,
    r,
    l
  );
  let c = `M${t},${e}`;
  for (let p = 0; p < a.length; p++) {
    const [g, y] = a[p];
    if (s > 0 && p > 0 && p < a.length - 1) {
      const [m, x] = p === 1 ? [t, e] : a[p - 1], [P, b] = a[p + 1];
      c += ` ${Xt(m, x, g, y, P, b, s)}`;
    } else
      c += ` L${g},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = Cn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Tf(t) {
  return _n({ ...t, borderRadius: 0 });
}
function Yr({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: l, offsetY: a } = Cn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: l,
    labelOffsetY: a
  };
}
const at = 40;
function Af(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < at && s >= 0 ? i = -o * (1 - s / at) : l < at && l >= 0 && (i = o * (1 - l / at)), a < at && a >= 0 ? r = -o * (1 - a / at) : c < at && c >= 0 && (r = o * (1 - c / at)), { dx: i, dy: r };
}
function Xr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Af(r, s, c, n);
    if ((d !== 0 || u !== 0) && o(d, u) === !0) {
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
function zt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || $r : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || wn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Xu),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Wu
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
    const { fromX: d, fromY: u, toX: f, toY: h } = a;
    let p;
    switch (e) {
      case "bezier": {
        p = no({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = _n({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        p = Tf({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        p = Yr({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
    }
    r.setAttribute("d", p);
  }
  function l() {
    i.remove();
  }
  return { svg: i, update: s, destroy: l };
}
function dn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let l = null, a = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !Be(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
      const f = t.cursorFlowPos.x - d.flowX, h = t.cursorFlowPos.y - d.flowY, p = Math.sqrt(f * f + h * h);
      p < c && (c = p, l = d.el, a = { x: d.flowX, y: d.flowY });
    }
    return { element: l, position: a };
  }
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const l = s, a = l.closest("[x-flow-node]");
    if (!a || a.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && a.dataset.flowNodeId !== t.targetNodeId) return;
    const c = a.dataset.flowNodeId;
    if (c) {
      const p = t.getNode(c);
      if (p && !Be(p)) return;
    }
    const d = t.handleType === "target" ? ot : St;
    if (l[d] === !1) return;
    const u = l.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) return;
    const f = t.toFlowPosition(
      u.left + u.width / 2,
      u.top + u.height / 2
    ), h = Math.sqrt(
      (t.cursorFlowPos.x - f.x) ** 2 + (t.cursorFlowPos.y - f.y) ** 2
    );
    h < r && (r = h, o = l, i = f);
  }), { element: o, position: i };
}
function oo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Xr({
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
function Nf(t, e, n, o) {
  const i = o ? t.edges.filter((c) => c.id !== o) : t.edges, r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  for (const c of i) {
    const d = `${c.source}|${c.sourceHandle ?? "source"}`, u = `${c.target}|${c.targetHandle ?? "target"}`;
    s.set(d, (s.get(d) ?? 0) + 1), l.set(u, (l.get(u) ?? 0) + 1), c.source === e && c.sourceHandle === n && r.add(`${c.target}|${c.targetHandle}`);
  }
  const a = /* @__PURE__ */ new Set();
  if (t._config?.preventCycles) {
    const c = /* @__PURE__ */ new Map();
    for (const u of i) {
      let f = c.get(u.target);
      f || (f = [], c.set(u.target, f)), f.push(u.source);
    }
    const d = [e];
    for (; d.length > 0; ) {
      const u = d.pop();
      if (!a.has(u)) {
        a.add(u);
        for (const f of c.get(u) ?? [])
          d.push(f);
      }
    }
  }
  return { existingTargets: r, cycleForbidden: a, sourceCounts: s, targetCounts: l };
}
function fs(t, e) {
  const n = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = t.querySelectorAll("[data-flow-handle-type]");
  for (const a of r) {
    const c = a.closest("[data-flow-node-id]");
    if (!c) continue;
    let d = i.get(c);
    if (d === void 0 && (d = c.dataset.flowNodeId ?? null, i.set(c, d)), !d) continue;
    const u = a.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) continue;
    const f = a.dataset.flowHandleType, h = e(u.left + u.width / 2, u.top + u.height / 2), p = {
      el: a,
      nodeId: d,
      handleId: a.dataset.flowHandleId ?? f,
      type: f,
      isMirror: a.classList.contains("flow-schema-handle--mirror"),
      flowX: h.x,
      flowY: h.y,
      connectableStart: a[St] !== !1,
      connectableEnd: a[ot] !== !1,
      hasValidator: a[We] != null,
      limit: a[ht] ?? null
    };
    n.push(p);
    const g = `${d}|${p.handleId}|${f}`, y = o.get(g);
    (!y || y.isMirror && !p.isMirror) && o.set(g, p);
  }
  const s = n.filter((a) => a.type === "source"), l = n.filter((a) => a.type === "target");
  return {
    all: n,
    byType: (a) => a === "source" ? s : l,
    get: (a, c, d) => o.get(`${a}|${c}|${d}`)
  };
}
let an = 0;
const In = /* @__PURE__ */ new WeakMap();
function et(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[We] && !r[We](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[We] && !r[We](e))
      return !1;
  }
  return !0;
}
function tt(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ht] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[ht])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ht] && n.filter(
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[ht])
      return !1;
  }
  return !0;
}
function un(t, e, n, o, i, r) {
  if (!r) {
    $f(t, e, n, o, i);
    return;
  }
  const s = Nf(o, e, n, i), l = r.get(e, n, "source"), a = l?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= l.limit, c = [];
  for (const d of r.byType("target")) {
    if (!d.connectableEnd) {
      c.push({ el: d.el, valid: !1, limitHit: !1 });
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: d.nodeId,
      targetHandle: d.handleId
    }, h = o.getNode(d.nodeId)?.connectable !== !1 && d.nodeId !== e && !s.existingTargets.has(`${d.nodeId}|${d.handleId}`) && !s.cycleForbidden.has(d.nodeId), p = r.get(d.nodeId, d.handleId, "target") ?? d;
    let g = h && !a;
    g && p.limit != null && (g = (s.targetCounts.get(`${d.nodeId}|${d.handleId}`) ?? 0) < p.limit);
    let y = g;
    y && l?.hasValidator && (y = !!l.el[We](u)), y && p.hasValidator && (y = !!p.el[We](u));
    const m = y && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: m, limitHit: h && !g });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function $f(t, e, n, o, i) {
  const r = i ? o.edges.filter((l) => l.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const l of s) {
    const c = l.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = l.dataset.flowHandleId ?? "target";
    if (l[ot] === !1) {
      l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && ft(u, r, { preventCycles: o._config?.preventCycles }), p = h && tt(t, u, r);
    p && et(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !p ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
  }
}
function Pe(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function xt(t, e) {
  t && (e ? t.classList.add("flow-connect-line--validating") : t.classList.remove("flow-connect-line--validating"));
}
function Ne(t, e) {
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
async function io(t, e, n, o, i, r) {
  if (!t) return { allowed: !0 };
  n?.classList.add(r), o?.classList.add(r), i.dispatchEvent(new CustomEvent("flow-connect-validating", {
    detail: { connection: e },
    bubbles: !0
  }));
  let s;
  try {
    s = await t(e);
  } catch (c) {
    Y("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const l = typeof s == "boolean" ? s : !!s?.allowed, a = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: l, reason: a },
    bubbles: !0
  })), { allowed: l, reason: a };
}
async function Wr(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), l = (c) => (Ne(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!ft(n, s, { preventCycles: o._config?.preventCycles }) || !ut(n, o._config?.connectionRules, o._nodeMap) || !tt(i, n, s) || !et(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return l();
  const a = o._config?.connectValidator;
  if (a) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = so(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await io(
        a,
        n,
        d,
        u,
        i,
        c
      );
    } finally {
      o._connectValidating = !1;
    }
    if (!f.allowed)
      return l(f.reason);
  }
  return o._captureHistory?.(), r === "source" ? (e.source = n.source, e.sourceHandle = n.sourceHandle) : (e.target = n.target, e.targetHandle = n.targetHandle), { applied: !0 };
}
async function jr(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ne(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Be(s) || !ft(e, i, { preventCycles: n._config?.preventCycles }) || !ut(e, n._config?.connectionRules, n._nodeMap) || !tt(o, e, i) || !et(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const l = n._config?.connectValidator;
  if (l) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = so(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await io(
        l,
        e,
        u,
        f,
        o,
        d
      );
    } finally {
      n._connectValidating = !1;
    }
    if (!h.allowed)
      return r(h.reason);
  }
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${an++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function so(t, e) {
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
function If(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let p;
      c && u ? p = "top-left" : c && f ? p = "top-right" : d && u ? p = "bottom-left" : d && f ? p = "bottom-right" : c ? p = "top" : f ? p = "right" : d ? p = "bottom" : u ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let g, y = !1;
      if (i) {
        const b = r(i);
        b && typeof b == "object" && !Array.isArray(b) ? (g = b.id || e.getAttribute("data-flow-handle-id") || a, b.position && (p = b.position, y = !0)) : g = b || e.getAttribute("data-flow-handle-id") || a;
      } else
        g = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const b = r(i);
        b && typeof b == "object" && !Array.isArray(b) && b.position && (e.dataset.flowHandlePosition = b.position);
      })), !h && !y) {
        const b = () => {
          const S = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!S) return;
          const k = e.closest("[x-data]");
          return k ? t.$data(k)?.getNode?.(S) : void 0;
        };
        s(() => {
          const E = b();
          if (!E) return;
          const S = a === "source" ? E.sourcePosition : E.targetPosition;
          S && (e.dataset.flowHandlePosition = S);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${a}`);
      const m = () => {
        const b = e.closest("[x-flow-node]");
        return b ? b.getAttribute("data-flow-node-id") ?? null : null;
      }, x = () => {
        const b = e.closest("[x-data]");
        return b ? t.$data(b) : null;
      };
      let P = null;
      if (x()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${g}`);
        const E = (N) => {
          const _ = N?._pendingKeyboardConnect;
          if (!_) return;
          const C = e.closest(".flow-container");
          C && C.querySelector(
            `[data-flow-node-id="${CSS.escape(_.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(_.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), N && (N._pendingKeyboardConnect = null);
        }, S = (N) => {
          if (!(N.key === "Enter" || N.key === " " || N.key === "Spacebar")) return;
          const C = x();
          if (!C || C._animationLocked) return;
          const $ = m();
          if ($)
            if (a === "source") {
              const M = C.getNode?.($);
              if (M && !Be(M) || e[St] === !1) return;
              N.preventDefault(), N.stopPropagation(), E(C), C._pendingKeyboardConnect = {
                sourceNodeId: $,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), C._announcer?.announce?.(`Connecting from ${a} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!C._pendingKeyboardConnect) return;
              const M = C.getNode?.($);
              if (M && !Be(M) || e[ot] === !1) return;
              N.preventDefault(), N.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: v } = C._pendingKeyboardConnect, I = {
                source: w,
                sourceHandle: v,
                target: $,
                targetHandle: g
              }, L = e.closest(".flow-container");
              if (E(C), !L) return;
              jr({ connection: I, canvas: C, containerEl: L }).then((R) => {
                R.applied && C._announcer?.announce?.(`Connected ${w} to ${$}.`);
              });
            }
        };
        e.addEventListener("keydown", S);
        const k = e.closest(".flow-container");
        if (k) {
          const N = In.get(k);
          if (N)
            N.count += 1;
          else {
            const _ = (C) => {
              if (C.key !== "Escape") return;
              const $ = k.matches("[x-data]") ? k : k.closest("[x-data]") ?? k.querySelector("[x-data]");
              if (!$) return;
              const M = t.$data($);
              M?._pendingKeyboardConnect && E(M);
            };
            k.addEventListener("keydown", _), In.set(k, { count: 1, handler: _ });
          }
        }
        P = () => {
          if (e.removeEventListener("keydown", S), k) {
            const N = In.get(k);
            N && (N.count -= 1, N.count <= 0 && (k.removeEventListener("keydown", N.handler), In.delete(k)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let b = null;
        const E = (N) => {
          N.preventDefault(), N.stopPropagation();
          const _ = x(), C = e.closest("[x-flow-node]");
          if (!_ || !C || _._animationLocked) return;
          const $ = C.dataset.flowNodeId;
          if (!$) return;
          const M = _.getNode($);
          if (M && !Be(M) || e[St] === !1) return;
          const w = N.clientX, v = N.clientY;
          let I = !1;
          if (_.pendingConnection && _._config?.connectOnClick !== !1) {
            _._emit("connect-end", {
              connection: null,
              source: _.pendingConnection.source,
              sourceHandle: _.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), _.pendingConnection = null, _._container?.classList.remove("flow-connecting");
            const B = e.closest(".flow-container");
            B && Pe(B);
          }
          let L = null, R = null, U = null, te = null, K = null;
          const T = _._config?.connectionSnapRadius ?? 20, A = e.closest(".flow-container");
          let H = null, ae = 0, le = 0, ie = !1, V = /* @__PURE__ */ new Map();
          const z = () => {
            if (I = !0, Y("connection", `Connection drag started from node "${$}" handle "${g}"`), _._emit("connect-start", { source: $, sourceHandle: g }), !A) return;
            R = zt({
              connectionLineType: _._config?.connectionLineType,
              connectionLineStyle: _._config?.connectionLineStyle,
              connectionLine: _._config?.connectionLine,
              containerEl: A
            }), L = R.svg;
            const B = e.getBoundingClientRect(), J = A.getBoundingClientRect(), q = _._viewportLive ?? _.viewport, F = q?.zoom || 1, ne = q?.x || 0, oe = q?.y || 0;
            ae = (B.left + B.width / 2 - J.left - ne) / F, le = (B.top + B.height / 2 - J.top - oe) / F, R.update({ fromX: ae, fromY: le, toX: ae, toY: le, source: $, sourceHandle: g });
            const j = A.querySelector(".flow-viewport");
            if (j && j.appendChild(L), _.pendingConnection = {
              source: $,
              sourceHandle: g,
              position: { x: ae, y: le }
            }, te = oo(A, _, w, v), H = fs(
              A,
              (W, re) => _.screenToFlowPosition(W, re)
            ), un(A, $, g, _, void 0, H), _._config?.onEdgeDrop) {
              const W = _._config.edgeDropPreview, O = W ? W({ source: $, sourceHandle: g }) : "New Node";
              if (O !== null) {
                K = document.createElement("div"), K.className = "flow-ghost-node";
                const ee = document.createElement("div");
                if (ee.className = "flow-ghost-handle", K.appendChild(ee), typeof O == "string") {
                  const se = document.createElement("span");
                  se.textContent = O, K.appendChild(se);
                } else
                  K.appendChild(O);
                K.style.left = `${ae}px`, K.style.top = `${le}px`;
                const ce = A.querySelector(".flow-viewport");
                ce && ce.appendChild(K);
              }
            }
          }, X = () => {
            const B = [..._.selectedNodes], J = [], q = A.getBoundingClientRect(), F = _._viewportLive ?? _.viewport, ne = F?.zoom || 1, oe = F?.x || 0, j = F?.y || 0;
            for (const W of B) {
              if (W === $) continue;
              const O = A?.querySelector(`[data-flow-node-id="${CSS.escape(W)}"]`)?.querySelector('[data-flow-handle-type="source"]');
              if (!O) continue;
              const ee = O.getBoundingClientRect();
              J.push({
                nodeId: W,
                handleId: O.dataset.flowHandleId ?? "source",
                pos: {
                  x: (ee.left + ee.width / 2 - q.left - oe) / ne,
                  y: (ee.top + ee.height / 2 - q.top - j) / ne
                }
              });
            }
            return J;
          }, G = (B) => {
            ie = !0, R && (V.set($, {
              line: R,
              sourceNodeId: $,
              sourceHandleId: g,
              sourcePos: { x: ae, y: le },
              valid: !0
            }), R = null);
            const J = X(), q = A.querySelector(".flow-viewport");
            for (const F of J) {
              const ne = zt({
                connectionLineType: _._config?.connectionLineType,
                connectionLineStyle: _._config?.connectionLineStyle,
                connectionLine: _._config?.connectionLine,
                containerEl: A
              });
              ne.update({
                fromX: F.pos.x,
                fromY: F.pos.y,
                toX: B.x,
                toY: B.y,
                source: F.nodeId,
                sourceHandle: F.handleId
              }), q && q.appendChild(ne.svg), V.set(F.nodeId, {
                line: ne,
                sourceNodeId: F.nodeId,
                sourceHandleId: F.handleId,
                sourcePos: F.pos,
                valid: !0
              });
            }
          }, Z = (B) => {
            if (!I) {
              const F = B.clientX - w, ne = B.clientY - v;
              if (Math.abs(F) >= Bn || Math.abs(ne) >= Bn) {
                if (z(), _._config?.multiConnect && _.selectedNodes.size > 1 && _.selectedNodes.has($)) {
                  const oe = _.screenToFlowPosition(B.clientX, B.clientY);
                  G(oe);
                }
              } else
                return;
            }
            const J = _.screenToFlowPosition(B.clientX, B.clientY);
            if (ie) {
              const F = dn({
                containerEl: A,
                handleType: "target",
                excludeNodeId: $,
                cursorFlowPos: J,
                connectionSnapRadius: T,
                getNode: (re) => _.getNode(re),
                toFlowPosition: (re, O) => _.screenToFlowPosition(re, O),
                connectionMode: _._config?.connectionMode,
                index: H ?? void 0
              });
              F.element !== U && (U?.classList.remove("flow-handle-active"), F.element?.classList.add("flow-handle-active"), U = F.element);
              const oe = F.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, j = F.element?.dataset.flowHandleId ?? "target", W = _._config?.connectionLineStyle?.stroke ?? (getComputedStyle(A).getPropertyValue("--flow-edge-stroke-selected").trim() || wn);
              for (const re of V.values())
                if (re.line.update({
                  fromX: re.sourcePos.x,
                  fromY: re.sourcePos.y,
                  toX: F.position.x,
                  toY: F.position.y,
                  source: re.sourceNodeId,
                  sourceHandle: re.sourceHandleId
                }), F.element && oe) {
                  const O = {
                    source: re.sourceNodeId,
                    sourceHandle: re.sourceHandleId,
                    target: oe,
                    targetHandle: j
                  }, we = _.getNode(oe)?.connectable !== !1 && re.sourceNodeId !== oe && ft(O, _.edges, { preventCycles: _._config?.preventCycles }) && ut(O, _._config?.connectionRules, _._nodeMap) && tt(A, O, _.edges) && et(A, O) && (!_._config?.isValidConnection || _._config.isValidConnection(O));
                  re.valid = we;
                  const be = re.line.svg.querySelector("path");
                  if (be)
                    if (we)
                      be.setAttribute("stroke", W);
                    else {
                      const Ce = getComputedStyle(A).getPropertyValue("--flow-connection-line-invalid").trim() || $r;
                      be.setAttribute("stroke", Ce);
                    }
                } else {
                  re.valid = !0;
                  const O = re.line.svg.querySelector("path");
                  O && O.setAttribute("stroke", W);
                }
              _.pendingConnection = { ..._.pendingConnection, position: F.position }, te?.updatePointer(B.clientX, B.clientY);
              return;
            }
            const q = dn({
              containerEl: A,
              handleType: "target",
              excludeNodeId: $,
              cursorFlowPos: J,
              connectionSnapRadius: T,
              getNode: (F) => _.getNode(F),
              toFlowPosition: (F, ne) => _.screenToFlowPosition(F, ne),
              index: H ?? void 0
            });
            q.element !== U && (U?.classList.remove("flow-handle-active"), q.element?.classList.add("flow-handle-active"), U = q.element), K ? q.element ? (K.style.display = "none", R?.update({ fromX: ae, fromY: le, toX: q.position.x, toY: q.position.y, source: $, sourceHandle: g })) : (K.style.display = "", K.style.left = `${J.x}px`, K.style.top = `${J.y}px`, R?.update({ fromX: ae, fromY: le, toX: J.x, toY: J.y, source: $, sourceHandle: g })) : R?.update({ fromX: ae, fromY: le, toX: q.position.x, toY: q.position.y, source: $, sourceHandle: g }), _.pendingConnection = { ..._.pendingConnection, position: q.position }, te?.updatePointer(B.clientX, B.clientY);
          }, D = async (B) => {
            if (te?.stop(), te = null, document.removeEventListener("pointermove", Z), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), b = null, H = null, _._connectValidating) return;
            if (ie) {
              const ne = _.screenToFlowPosition(B.clientX, B.clientY);
              let oe = U;
              oe || (oe = document.elementFromPoint(B.clientX, B.clientY)?.closest('[data-flow-handle-type="target"]'));
              const W = oe?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, re = oe?.dataset.flowHandleId ?? "target", O = [], ee = [], ce = [], se = [];
              if (oe && W) {
                const de = _.getNode(W);
                for (const fe of V.values()) {
                  const we = {
                    source: fe.sourceNodeId,
                    sourceHandle: fe.sourceHandleId,
                    target: W,
                    targetHandle: re
                  };
                  if (de?.connectable !== !1 && fe.sourceNodeId !== W && ft(we, _.edges, { preventCycles: _._config?.preventCycles }) && ut(we, _._config?.connectionRules, _._nodeMap) && tt(A, we, _.edges) && et(A, we) && (!_._config?.isValidConnection || _._config.isValidConnection(we))) {
                    const Q = `e-${fe.sourceNodeId}-${W}-${Date.now()}-${an++}`;
                    O.push({ id: Q, ...we }), ee.push(we), se.push(fe);
                  } else
                    ce.push(fe);
                }
              } else
                ce.push(...V.values());
              for (const de of se)
                de.line.destroy();
              if (O.length > 0) {
                _.addEdges(O);
                for (const de of ee)
                  _._emit("connect", { connection: de });
                _._emit("multi-connect", { connections: ee });
              }
              ce.length > 0 && setTimeout(() => {
                for (const de of ce)
                  de.line.destroy();
              }, 100), U?.classList.remove("flow-handle-active"), _._emit("connect-end", {
                connection: ee.length > 0 ? ee[0] : null,
                source: $,
                sourceHandle: g,
                position: ne
              }), V.clear(), ie = !1, Pe(A), _.pendingConnection = null, _._container?.classList.remove("flow-connecting");
              return;
            }
            if (!I) {
              _._config?.connectOnClick !== !1 && (Y("connection", `Click-to-connect started from node "${$}" handle "${g}"`), _._emit("connect-start", { source: $, sourceHandle: g }), _.pendingConnection = {
                source: $,
                sourceHandle: g,
                position: { x: 0, y: 0 }
              }, _._container?.classList.add("flow-connecting"), un(A, $, g, _, void 0, H ?? void 0));
              return;
            }
            const J = R?.svg ?? null;
            K?.remove(), K = null, U?.classList.remove("flow-handle-active"), Pe(A);
            const q = _.screenToFlowPosition(B.clientX, B.clientY), F = { source: $, sourceHandle: g, position: q };
            try {
              let ne = U;
              if (ne || (ne = document.elementFromPoint(B.clientX, B.clientY)?.closest('[data-flow-handle-type="target"]')), ne) {
                const j = ne.closest("[x-flow-node]")?.dataset.flowNodeId, W = ne.dataset.flowHandleId ?? "target";
                if (j) {
                  if (ne[ot] === !1) {
                    Y("connection", "Connection rejected (handle not connectable end)"), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                    return;
                  }
                  const re = _.getNode(j);
                  if (re && !Be(re)) {
                    Y("connection", `Connection rejected (target "${j}" not connectable)`), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                    return;
                  }
                  const O = {
                    source: $,
                    sourceHandle: g,
                    target: j,
                    targetHandle: W
                  };
                  if (ft(O, _.edges, { preventCycles: _._config?.preventCycles })) {
                    if (!ut(O, _._config?.connectionRules, _._nodeMap)) {
                      Y("connection", "Connection rejected (connection rules)", O), Ne(A, O), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                      return;
                    }
                    if (!tt(A, O, _.edges)) {
                      Y("connection", "Connection rejected (handle limit)", O), Ne(A, O), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                      return;
                    }
                    if (!et(A, O)) {
                      Y("connection", "Connection rejected (per-handle validator)", O), Ne(A, O), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                      return;
                    }
                    if (_._config?.isValidConnection && !_._config.isValidConnection(O)) {
                      Y("connection", "Connection rejected (custom validator)", O), Ne(A, O), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                      return;
                    }
                    const ee = _._config?.connectValidator;
                    if (ee) {
                      const se = _._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: de, targetEl: fe } = so(A, O);
                      _._connectValidating = !0, xt(J, !0);
                      let we;
                      try {
                        we = await io(
                          ee,
                          O,
                          de,
                          fe,
                          A,
                          se
                        );
                      } finally {
                        _._connectValidating = !1, xt(J, !1);
                      }
                      if (!we.allowed) {
                        Y("connection", "Connection rejected (async connectValidator)", { connection: O, reason: we.reason }), Ne(A, { ...O, reason: we.reason }), _._emit("connect-end", { connection: null, ...F }), _.pendingConnection = null;
                        return;
                      }
                    }
                    const ce = `e-${$}-${j}-${Date.now()}-${an++}`;
                    _.addEdges({ id: ce, ...O }), Y("connection", `Connection created: ${$} → ${j}`, O), _._emit("connect", { connection: O }), _._emit("connect-end", { connection: O, ...F });
                  } else
                    Y("connection", "Connection rejected (invalid)", O), Ne(A, O), _._emit("connect-end", { connection: null, ...F });
                } else
                  _._emit("connect-end", { connection: null, ...F });
              } else if (_._config?.onEdgeDrop) {
                const oe = {
                  x: q.x - _e / 2,
                  y: q.y - Ee / 2
                }, j = _._config.onEdgeDrop({
                  source: $,
                  sourceHandle: g,
                  position: oe
                });
                if (j) {
                  const W = {
                    source: $,
                    sourceHandle: g,
                    target: j.id,
                    targetHandle: "target"
                  };
                  if (!tt(A, W, _.edges))
                    Y("connection", "Edge drop: connection rejected (handle limit)"), _._emit("connect-end", { connection: null, ...F });
                  else if (!et(A, W))
                    Y("connection", "Edge drop: connection rejected (per-handle validator)"), _._emit("connect-end", { connection: null, ...F });
                  else if (!_._config.isValidConnection || _._config.isValidConnection(W)) {
                    _.addNodes(j);
                    const re = `e-${$}-${j.id}-${Date.now()}-${an++}`;
                    _.addEdges({ id: re, ...W }), Y("connection", `Edge drop: created node "${j.id}" and edge`, W), _._emit("connect", { connection: W }), _._emit("connect-end", { connection: W, ...F });
                  } else
                    Y("connection", "Edge drop: connection rejected by validator"), _._emit("connect-end", { connection: null, ...F });
                } else
                  Y("connection", "Edge drop: callback returned null"), _._emit("connect-end", { connection: null, ...F });
              } else
                Y("connection", "Connection cancelled (no target)"), _._emit("connect-end", { connection: null, ...F });
            } finally {
              xt(J, !1), R?.destroy(), R = null;
            }
            _.pendingConnection = null;
          };
          document.addEventListener("pointermove", Z), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), b = () => {
            document.removeEventListener("pointermove", Z), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), te?.stop(), R?.destroy(), R = null, K?.remove(), K = null;
            for (const B of V.values())
              B.line.destroy();
            V.clear(), ie = !1, U?.classList.remove("flow-handle-active"), Pe(A), H = null, _.pendingConnection = null, _._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", E);
        const S = () => {
          const N = x();
          if (!N?._pendingReconnection || N._pendingReconnection.draggedEnd !== "source") return;
          const _ = m();
          if (_) {
            const C = N.getNode(_);
            if (C && !Be(C)) return;
          }
          e[St] !== !1 && e.classList.add("flow-handle-active");
        }, k = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", S), e.addEventListener("pointerleave", k), l(() => {
          b?.(), P?.(), e.removeEventListener("pointerdown", E), e.removeEventListener("pointerenter", S), e.removeEventListener("pointerleave", k), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const b = () => {
          const _ = x();
          if (!_?.pendingConnection) return;
          const C = m();
          if (C) {
            const $ = _.getNode(C);
            if ($ && !Be($)) return;
          }
          e[ot] !== !1 && e.classList.add("flow-handle-active");
        }, E = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", b), e.addEventListener("pointerleave", E);
        const S = async (_) => {
          const C = x();
          if (!C?.pendingConnection || C._config?.connectOnClick === !1 || C._connectValidating) return;
          _.preventDefault(), _.stopPropagation();
          const $ = m();
          if (!$) return;
          if (e[ot] === !1) {
            Y("connection", "Click-to-connect rejected (handle not connectable end)"), C._emit("connect-end", { connection: null, source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Pe(L);
            return;
          }
          const M = C.getNode($);
          if (M && !Be(M)) {
            Y("connection", `Click-to-connect rejected (target "${$}" not connectable)`), C._emit("connect-end", { connection: null, source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
            const L = e.closest(".flow-container");
            L && Pe(L);
            return;
          }
          const w = {
            source: C.pendingConnection.source,
            sourceHandle: C.pendingConnection.sourceHandle,
            target: $,
            targetHandle: g
          }, v = { source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (ft(w, C.edges, { preventCycles: C._config?.preventCycles })) {
            const L = e.closest(".flow-container");
            if (!ut(w, C._config?.connectionRules, C._nodeMap)) {
              Y("connection", "Click-to-connect rejected (connection rules)", w), Ne(L, w), C._emit("connect-end", { connection: null, ...v }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            if (L && !tt(L, w, C.edges)) {
              Y("connection", "Click-to-connect rejected (handle limit)", w), Ne(L, w), C._emit("connect-end", { connection: null, ...v }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), Pe(L);
              return;
            }
            if (L && !et(L, w)) {
              Y("connection", "Click-to-connect rejected (per-handle validator)", w), Ne(L, w), C._emit("connect-end", { connection: null, ...v }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            if (C._config?.isValidConnection && !C._config.isValidConnection(w)) {
              Y("connection", "Click-to-connect rejected (custom validator)", w), Ne(L, w), C._emit("connect-end", { connection: null, ...v }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), L && Pe(L);
              return;
            }
            const R = C._config?.connectValidator;
            if (R && L) {
              const te = C._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: K, targetEl: T } = so(L, w);
              C._connectValidating = !0;
              let A;
              try {
                A = await io(
                  R,
                  w,
                  K,
                  T,
                  L,
                  te
                );
              } finally {
                C._connectValidating = !1;
              }
              if (!A.allowed) {
                Y("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: A.reason }), Ne(L, { ...w, reason: A.reason }), C._emit("connect-end", { connection: null, ...v }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), Pe(L);
                return;
              }
            }
            const U = `e-${w.source}-${w.target}-${Date.now()}-${an++}`;
            C.addEdges({ id: U, ...w }), Y("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), C._emit("connect", { connection: w }), C._emit("connect-end", { connection: w, ...v });
          } else {
            Y("connection", "Click-to-connect rejected (invalid)", w);
            const L = e.closest(".flow-container");
            Ne(L, w), C._emit("connect-end", { connection: null, ...v });
          }
          C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
          const I = e.closest(".flow-container");
          I && Pe(I);
        };
        e.addEventListener("click", S);
        let k = null;
        const N = (_) => {
          if (_.button !== 0) return;
          const C = x(), $ = m();
          if (!C || !$ || C._animationLocked || C._config?.edgesReconnectable === !1 || C._pendingReconnection) return;
          const M = C.edges.filter(
            (O) => O.target === $ && (O.targetHandle ?? "target") === g
          );
          if (M.length === 0) return;
          const w = M.find((O) => O.selected) ?? (M.length === 1 ? M[0] : null);
          if (!w) return;
          const v = w.reconnectable ?? !0;
          if (v === !1 || v === "source") return;
          _.preventDefault(), _.stopPropagation();
          const I = _.clientX, L = _.clientY;
          let R = !1, U = !1, te = null;
          const K = C._config?.connectionSnapRadius ?? 20, T = e.closest(".flow-container");
          if (!T) return;
          const A = T.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), H = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', ae = A?.querySelector(H), le = T.getBoundingClientRect(), ie = C._viewportLive ?? C.viewport, V = ie?.zoom || 1, z = ie?.x || 0, X = ie?.y || 0;
          let G, Z;
          if (ae) {
            const O = ae.getBoundingClientRect();
            G = (O.left + O.width / 2 - le.left - z) / V, Z = (O.top + O.height / 2 - le.top - X) / V;
          } else {
            const O = C.getNode(w.source);
            if (!O) return;
            const ee = O.dimensions?.width ?? _e, ce = O.dimensions?.height ?? Ee;
            G = O.position.x + ee / 2, Z = O.position.y + ce;
          }
          let D = null, B = null, J = null, q = I, F = L, ne = null;
          const oe = () => {
            R = !0;
            const O = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            O && O.classList.add("flow-edge-reconnecting"), C._emit("reconnect-start", { edge: w, handleType: "target" }), Y("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), B = zt({
              connectionLineType: C._config?.connectionLineType,
              connectionLineStyle: C._config?.connectionLineStyle,
              connectionLine: C._config?.connectionLine,
              containerEl: T
            }), D = B.svg;
            const ee = C.screenToFlowPosition(I, L);
            B.update({
              fromX: G,
              fromY: Z,
              toX: ee.x,
              toY: ee.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            });
            const ce = T.querySelector(".flow-viewport");
            ce && ce.appendChild(D), C.pendingConnection = {
              source: w.source,
              sourceHandle: w.sourceHandle,
              position: ee
            }, C._pendingReconnection = {
              edge: w,
              draggedEnd: "target",
              anchorPosition: { x: G, y: Z },
              position: ee
            }, J = oo(T, C, q, F), ne = fs(
              T,
              (se, de) => C.screenToFlowPosition(se, de)
            ), un(T, w.source, w.sourceHandle ?? "source", C, w.id, ne);
          }, j = (O) => {
            if (q = O.clientX, F = O.clientY, !R) {
              Math.sqrt(
                (O.clientX - I) ** 2 + (O.clientY - L) ** 2
              ) >= Bn && oe();
              return;
            }
            const ee = C.screenToFlowPosition(O.clientX, O.clientY), ce = dn({
              containerEl: T,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: ee,
              connectionSnapRadius: K,
              getNode: (se) => C.getNode(se),
              toFlowPosition: (se, de) => C.screenToFlowPosition(se, de),
              index: ne ?? void 0
            });
            ce.element !== te && (te?.classList.remove("flow-handle-active"), ce.element?.classList.add("flow-handle-active"), te = ce.element), B?.update({
              fromX: G,
              fromY: Z,
              toX: ce.position.x,
              toY: ce.position.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            }), C.pendingConnection && (C.pendingConnection = {
              ...C.pendingConnection,
              position: ce.position
            }), C._pendingReconnection && (C._pendingReconnection = {
              ...C._pendingReconnection,
              position: ce.position
            }), J?.updatePointer(O.clientX, O.clientY);
          }, W = () => {
            if (U) return;
            U = !0, document.removeEventListener("pointermove", j), document.removeEventListener("pointerup", re), document.removeEventListener("pointercancel", re), J?.stop(), J = null, B?.destroy(), B = null, D = null, ne = null, te?.classList.remove("flow-handle-active"), k = null;
            const O = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            O && O.classList.remove("flow-edge-reconnecting"), Pe(T), C.pendingConnection = null, C._pendingReconnection = null;
          }, re = async (O) => {
            if (!R) {
              W();
              return;
            }
            if (C._connectValidating) return;
            let ee = te;
            ee || (ee = document.elementFromPoint(O.clientX, O.clientY)?.closest('[data-flow-handle-type="target"]'));
            let ce = !1;
            if (ee) {
              const de = ee.closest("[x-flow-node]")?.dataset.flowNodeId, fe = ee.dataset.flowHandleId;
              if (de && C.getNode(de)?.connectable !== !1) {
                const be = {
                  source: w.source,
                  sourceHandle: w.sourceHandle,
                  target: de,
                  targetHandle: fe
                }, Ce = { ...w }, ge = B?.svg ?? null;
                xt(ge, !0);
                let ve;
                try {
                  ve = await Wr({
                    edge: w,
                    newConnection: be,
                    canvas: C,
                    containerEl: T,
                    endpoint: "target"
                  });
                } finally {
                  xt(ge, !1);
                }
                ve.applied ? (ce = !0, Y("reconnect", `Edge "${w.id}" reconnected (target)`, be), C._emit("reconnect", { oldEdge: Ce, newConnection: be })) : Y("reconnect", "Reconnection rejected", { connection: be, reason: ve.reason });
              }
            }
            ce || Y("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), C._emit("reconnect-end", { edge: w, successful: ce }), W();
          };
          document.addEventListener("pointermove", j), document.addEventListener("pointerup", re), document.addEventListener("pointercancel", re), k = W;
        };
        e.addEventListener("pointerdown", N), l(() => {
          k?.(), P?.(), e.removeEventListener("pointerdown", N), e.removeEventListener("pointerenter", b), e.removeEventListener("pointerleave", E), e.removeEventListener("click", S), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const hs = {
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
function Df(t) {
  if (!t) return { ...hs };
  const e = { ...hs };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ze(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Rf(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function pt(t, e) {
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
function Hf(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, l = 0, a = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), a = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(f) {
    const h = f.clientX - s, p = f.clientY - l;
    h * h + p * p > i * i && c();
  }
  function u(f) {
    c(), s = f.clientX, l = f.clientY, a = f, document.addEventListener("pointermove", d), document.addEventListener("pointerup", c), document.addEventListener("pointercancel", c), r = setTimeout(() => {
      const h = a;
      c(), h && e(h);
    }, o);
  }
  return t.addEventListener("pointerdown", u), () => {
    c(), t.removeEventListener("pointerdown", u);
  };
}
const Qo = 20, Dn = Qo + 1;
function gs(t) {
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
function ps(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Ff(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Ur(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function Zr(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function Of(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const l = Array.from(r).sort((u, f) => u - f), a = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of l)
    for (const f of a) {
      let h = !1;
      for (const p of i)
        if (Ff(u, f, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class zf {
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
function Vf(t, e) {
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
      Zr(l.x, l.y, a.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, l) => s.x - l.x);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Ur(l.x, a.x, l.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  return n;
}
function Bf(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i), a = Vf(n, o);
  r[t.index] = 0;
  const c = new zf(r);
  for (c.push(t.index); c.size > 0; ) {
    const f = c.pop();
    if (l[f]) continue;
    if (l[f] = 1, f === e.index) break;
    const h = n[f], p = r[f];
    for (const g of a[f]) {
      if (l[g]) continue;
      const y = n[g], m = Math.abs(y.x - h.x) + Math.abs(y.y - h.y), x = p + m;
      x < r[g] && (r[g] = x, s[g] = f, c.push(g));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let u = e.index;
  for (; u !== -1; )
    d.unshift(n[u]), u = s[u];
  return d;
}
function qf(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function Yf(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function Xf(t) {
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
const gt = 200;
function Wf(t, e, n, o, i) {
  const r = Math.min(t, n) - gt, s = Math.max(t, n) + gt, l = Math.min(e, o) - gt, a = Math.max(e, o) + gt;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < a && c.y + c.height > l
  );
}
function jf(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (Zr(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Ur(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function Uf(t, e, n, o, i, r, s) {
  const l = gs(n), a = gs(r), c = t + l.x * Dn, d = e + l.y * Dn, u = o + a.x * Dn, f = i + a.y * Dn, h = (x) => {
    const P = x.map((_) => ps(_, Qo)), b = Of(c, d, u, f, P);
    b.length;
    const E = b.find((_) => _.x === c && _.y === d), S = b.find((_) => _.x === u && _.y === f);
    E || b.push({ x: c, y: d, index: b.length }), S || b.push({ x: u, y: f, index: b.length });
    const k = E ?? b[b.length - (S ? 1 : 2)], N = S ?? b[b.length - 1];
    return Bf(k, N, b, P);
  }, p = Wf(t, e, o, i, s), g = p.length < s.length;
  let y = h(p);
  if (g) {
    const x = s.map((b) => ps(b, Qo));
    (!(y !== null && y.length >= 2) || jf(y, x)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return qf(m);
}
const Zf = 512, lt = /* @__PURE__ */ new Map();
function Gf(t, e, n, o, i, r, s) {
  let l = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const a of s)
    l += `|${Math.round(a.x)},${Math.round(a.y)},${Math.round(a.width)},${Math.round(a.height)}`;
  return l;
}
function Gr(t, e, n, o, i, r, s) {
  const l = Gf(t, e, n, o, i, r, s);
  if (lt.has(l)) {
    const c = lt.get(l);
    return lt.delete(l), lt.set(l, c), c;
  }
  const a = Uf(t, e, n, o, i, r, s);
  return lt.set(l, a), lt.size > Zf && lt.delete(lt.keys().next().value), a;
}
function Kf({
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
    return _n({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const a = Gr(t, e, n, o, i, r, s);
  if (!a)
    return _n({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const c = Yf(a, l), { x: d, y: u, offsetX: f, offsetY: h } = Xf(a);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
const ms = 20;
function Kr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Jf(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e)
    if (o.parentId) {
      const i = n.get(o.parentId);
      i ? i.push(o.id) : n.set(o.parentId, [o.id]);
    }
  for (const o of t.keys())
    n.has(o) || t.delete(o);
  for (const [o, i] of n) {
    const r = t.get(o);
    (!r || r.length !== i.length || r.some((s, l) => s !== i[l])) && t.set(o, i);
  }
}
function ei(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const l = s.nodeOrigin ?? n ?? [0, 0], a = s.dimensions?.width ?? _e, c = s.dimensions?.height ?? Ee;
    o += s.position.x - a * l[0], i += s.position.y - c * l[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function kt(t, e, n) {
  if (!t.parentId)
    return t;
  const o = ei(t, e, n);
  return { ...t, position: o };
}
function ro(t, e, n) {
  return t.map((o) => kt(o, e, n));
}
function mt(t, e) {
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
function Pt(t) {
  const e = Kr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Jr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Jr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Qr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function ko(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Rn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: _e, height: Ee };
  return Qr(t, o, i);
}
function Qf(t, e, n) {
  const o = t.x + e.width + ms, i = t.y + e.height + ms, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function ys(t, e, n) {
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
function eh(t, e, n) {
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
function th(t, e, n) {
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
function nh(t, e, n) {
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
function oh(t, e, n) {
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
function ih(t, e, n) {
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
function sh(t, e, n) {
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
function rh(t, e, n) {
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
const ea = {
  circle: { perimeterPoint: eh },
  diamond: { perimeterPoint: th },
  hexagon: { perimeterPoint: nh },
  parallelogram: { perimeterPoint: oh },
  triangle: { perimeterPoint: ih },
  cylinder: { perimeterPoint: sh },
  stadium: { perimeterPoint: rh }
};
function ta(t, e = "light") {
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
const Lo = "__alpineflow_collab_store__";
function ah() {
  return typeof globalThis < "u" ? (globalThis[Lo] || (globalThis[Lo] = /* @__PURE__ */ new WeakMap()), globalThis[Lo]) : /* @__PURE__ */ new WeakMap();
}
const He = ah(), Po = "__alpineflow_registry__";
function na() {
  return typeof globalThis < "u" ? (globalThis[Po] || (globalThis[Po] = /* @__PURE__ */ new Map()), globalThis[Po]) : /* @__PURE__ */ new Map();
}
function It(t) {
  return na().get(t);
}
function lh(t, e) {
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
const ch = 1e3;
class dh {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? lh, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, ch);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class uh {
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
      const d = {}, u = n.filter((h) => h.target === a.id);
      for (const h of u) {
        const p = r.get(h.source);
        if (!p) continue;
        const g = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        g in p && (d[y] = p[g]);
      }
      const f = c.compute(d, a.data);
      r.set(a.id, f), l.set(a.id, f), a.data.$inputs = d, a.data.$outputs = f;
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
const fh = {
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
}, hh = {
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
}, gh = {
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
}, ws = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function ph(t, e) {
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
    const r = ws[o.style] ?? ws.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
    t.update({
      nodes: { [o.id]: { style: `border-color: ${r.borderColor}; box-shadow: ${r.shadow}` } }
    }, { duration: 100 }), setTimeout(() => {
      const u = c ? `border-color: ${c}; box-shadow: ${d ?? "none"}` : "";
      t.update({
        nodes: { [o.id]: { style: u } }
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
      const u = i[d], f = i[d + 1], h = t.edges.find((p) => p.source === u && p.target === f);
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
function mh(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const yh = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), wh = 150;
function vh(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function _h(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = mh(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = fh[o], u = d ? d(a) : [a], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = yh.has(o) ? vh(l, wh) : l;
  }
}
function bh(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(hh)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = gh[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const xh = 5;
function Eh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > xh && !o.has(c) && (o.add(c), console.warn(
          `[alpineflow] Auto-layout for parent "${c}" has run for ${u} consecutive frames. Suppressing to avoid an infinite loop. This usually indicates a layout that keeps changing child dimensions by more than the 1px threshold. Next user mutation will clear the suppression.`
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
function Ch(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Sh(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function fn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function oa(t, e, n, o) {
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
function ao(t, e, n, o) {
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
function vs(t, e, n) {
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
function Wt(t, e) {
  const n = Ut(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? Ee
  };
}
function ia(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function kh(t, e, n = !0) {
  const o = Wt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Wt(i);
    return n ? ia(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function Lh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Wt(t), i = Wt(e);
  return n ? ia(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function Ph(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const l of o) {
    const a = r + e, c = s + n, d = l.x + l.width, u = l.y + l.height;
    if (r < d + i && a > l.x - i && s < u + i && c > l.y - i) {
      const f = a - (l.x - i), h = d + i - r, p = c - (l.y - i), g = u + i - s, y = Math.min(f, h, p, g);
      y === f ? r -= f : y === h ? r += h : y === p ? s -= p : s += g;
    }
  }
  return { x: r, y: s };
}
function Mh(t) {
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
      Y("init", `Adding ${o.length} node(s)`, o.map((d) => d.id));
      const i = /* @__PURE__ */ new Map();
      if (n?.center) {
        for (const d of o)
          i.set(d.id, { ...d.position });
        o = o.map((d) => ({ ...d, position: { x: -9999, y: -9999 } }));
      }
      const r = [];
      for (const d of o) {
        if (d.parentId) {
          const u = t._getChildValidation(d.parentId);
          if (u) {
            const f = t._nodeMap.get(d.parentId);
            if (f) {
              const h = [
                ...t.nodes.filter(
                  (g) => g.parentId === d.parentId
                ),
                ...r.filter(
                  (g) => g.parentId === d.parentId
                )
              ], p = oa(f, d, h, u);
              if (!p.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
                  child: d,
                  operation: "add",
                  rule: p.rule,
                  message: p.message
                });
                continue;
              }
            }
          }
        }
        r.push(d);
      }
      o = r, t.nodes.push(...o);
      for (const d of o)
        d.dimensions && t._initialDimensions.set(d.id, { ...d.dimensions });
      let s = o.some((d) => d.parentId);
      if (!s) {
        const d = new Set(o.map((u) => u.id));
        s = t.nodes.some(
          (u) => u.parentId && d.has(u.parentId)
        );
      }
      if (s) {
        const d = Pt(t.nodes);
        t.nodes.splice(0, t.nodes.length, ...d);
      }
      t._rebuildNodeMap();
      for (const d of o)
        if (d.childLayout) {
          const u = t._nodeMap.get(d.id);
          u && t._installChildLayoutWatchers(u);
        }
      t._emit("nodes-change", { type: "add", nodes: o });
      const l = t._container ? He.get(t._container) : void 0;
      if (l?.bridge)
        for (const d of o)
          l.bridge.pushLocalNodeAdd(d);
      n?.center && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [d, u] of i) {
            const f = t.nodes.find((g) => g.id === d);
            if (!f) continue;
            const h = f.dimensions?.width ?? 0, p = f.dimensions?.height ?? 0;
            f.position.x = u.x - h / 2, f.position.y = u.y - p / 2;
          }
        });
      }), t._recomputeChildValidation();
      const a = /* @__PURE__ */ new Set();
      for (const d of o)
        if (d.parentId && t._nodeMap.get(d.parentId)?.childLayout) {
          if (d.order == null) {
            const f = t.nodes.filter(
              (h) => h.parentId === d.parentId && h.id !== d.id
            );
            d.order = f.length > 0 ? Math.max(...f.map((h) => h.order ?? 0)) + 1 : 0;
          }
          a.add(d.parentId);
        }
      const c = /* @__PURE__ */ new Set();
      for (const d of a) {
        let u = d, f = t._nodeMap.get(d)?.parentId;
        for (; f; ) {
          const h = t._nodeMap.get(f);
          h?.childLayout && (u = f), f = h?.parentId;
        }
        c.add(u);
      }
      for (const d of c)
        t._layoutDedup ? t._layoutDedup.safeLayoutChildren(d) : t.layoutChildren?.(d);
      t._scheduleAutoLayout(), t._commitNodeGeometry?.(o.map((d) => d.id));
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
      for (const u of [...n]) {
        const f = t._nodeMap.get(u);
        if (!f?.parentId || n.has(f.parentId)) continue;
        const h = t._getChildValidation(f.parentId);
        if (!h) continue;
        const p = t._nodeMap.get(f.parentId);
        if (!p) continue;
        const g = t.nodes.filter(
          (m) => m.parentId === f.parentId
        ), y = ao(p, f, g, h);
        y.valid || (o.add(u), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: p,
          child: f,
          operation: "remove",
          rule: y.rule,
          message: y.message
        }));
      }
      for (const u of o)
        n.delete(u);
      if (n.size === 0) return;
      const i = /* @__PURE__ */ new Map();
      for (const u of n) {
        const f = t._nodeMap.get(u);
        f?.parentId && i.set(u, f.parentId);
      }
      for (const u of [...n])
        for (const f of mt(u, t.nodes))
          n.add(f);
      Y("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = Ef(n, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (l.push(u.id), !1) : !0), s.length && (t.edges.push(...s), Y("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u), t._draggingNodeIds?.delete(u);
      for (const u of l)
        t._edgeDirtyTicks?.delete(u), t._edgeCorridors?.delete(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const a = t._container ? He.get(t._container) : void 0;
      if (a?.bridge) {
        for (const u of n)
          a.bridge.pushLocalNodeRemove(u);
        for (const u of l)
          a.bridge.pushLocalEdgeRemove(u);
        for (const u of s)
          a.bridge.pushLocalEdgeAdd(u);
      }
      t._recomputeChildValidation();
      const c = /* @__PURE__ */ new Set();
      for (const u of n) {
        const f = i.get(u);
        f && t._nodeMap.get(f)?.childLayout && c.add(f);
      }
      const d = /* @__PURE__ */ new Set();
      for (const u of c) {
        let f = u, h = t._nodeMap.get(u)?.parentId;
        for (; h; ) {
          const p = t._nodeMap.get(h);
          p?.childLayout && (f = h), h = p?.parentId;
        }
        d.add(f);
      }
      for (const u of d) t.layoutChildren?.(u);
      t._scheduleAutoLayout(), t._commitNodeGeometry?.([...n]);
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
      return Ko(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return _f(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return vf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return xf(e, n, t.edges, o);
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
      Y("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (Y("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? kh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : Lh(i, r, o);
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
function Th(t) {
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
        return ut(l, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), Y("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
      const r = t._container ? He.get(t._container) : void 0;
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
      Y("edge", `Removing ${n.size} edge(s)`, [...n]);
      const o = t.edges.filter((r) => n.has(r.id));
      t.edges = t.edges.filter((r) => !n.has(r.id)), t._rebuildEdgeMap();
      for (const r of n)
        t.selectedEdges.delete(r), t._edgeDirtyTicks?.delete(r), t._edgeCorridors?.delete(r);
      o.length && t._emit("edges-change", { type: "remove", edges: o });
      const i = t._container ? He.get(t._container) : void 0;
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
function Ah(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Tr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Ou(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Yt(ro(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = Jn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Zo
      );
      Y("viewport", "fitBounds", { rect: e, viewport: i });
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Yt(ro(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? Jn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Zo
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      Y("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Ki, o);
      Y("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Ki, o);
      Y("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, l = r.clientWidth / 2 - e * s, a = r.clientHeight / 2 - n * s;
      Y("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: l, y: a, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      Y("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, Y("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
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
      Y("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let bt = null;
const Nh = 20;
function ti(t) {
  return JSON.parse(JSON.stringify(t));
}
function _s(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function sa(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return bt = {
    nodes: ti(n),
    edges: ti(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function $h() {
  if (!bt || bt.nodes.length === 0) return null;
  bt.pasteCount++;
  const t = bt.pasteCount * Nh, e = /* @__PURE__ */ new Map(), n = bt.nodes.map((i) => {
    const r = _s(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: ti(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = bt.edges.map((i) => ({
    ...i,
    id: _s(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function Ih(t, e) {
  const n = sa(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function Dh(t) {
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
        Y("selection", "Deselecting all");
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
        return c ? Lf(c) : !1;
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
        const u = t.nodes.filter(
          (h) => h.parentId === a.parentId
        ), f = ao(d, a, u, c);
        return !f.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: d,
          child: a,
          operation: "remove",
          rule: f.rule,
          message: f.message
        }), f.valid;
      }), !(o.length === 0 && l.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const a = await t._config.onBeforeDelete({
            nodes: o,
            edges: l
          });
          if (a === !1) {
            Y("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (a.nodes.length > 0 && (Y("delete", `onBeforeDelete approved ${a.nodes.length} node(s)`), t.removeNodes(a.nodes.map((c) => c.id))), a.edges.length > 0) {
              const c = a.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
              c.length > 0 && (Y("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
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
          if (o.length > 0 && (Y("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((a) => a.id))), n.length > 0) {
            const a = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            a.length > 0 && (Y("delete", `Deleting ${a.length} selected edge(s)`), t.removeEdges(a));
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
      const e = sa(t.nodes, t.edges);
      e.nodeCount > 0 && (Y("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
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
      const e = $h();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Pt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), Y("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
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
      const e = Ih(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), Y("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Rh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function lo(t, e, n = {}) {
  const o = n.deleteMissing ?? !0, i = new Map(t.map((s) => [s.id, s])), r = [];
  for (const s of e) {
    const l = i.get(s.id);
    if (!l) {
      r.push(s);
      continue;
    }
    if (o)
      for (const a of Object.keys(l))
        a !== "id" && !(a in s) && delete l[a];
    for (const [a, c] of Object.entries(s))
      a === "id" || a === "__proto__" || a === "constructor" || a === "prototype" || Rh(l[a], c) || (l[a] = c);
    r.push(l);
  }
  return r;
}
function bs(t, e, n) {
  const o = lo(t.nodes, Pt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = lo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), Y("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function Hh(t) {
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
      if (Y("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes) {
        const n = Pt(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = lo(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = lo(t.edges, n);
        t.edges.splice(0, t.edges.length, ...o);
      }
      if (t._rebuildNodeMap(), t._rebuildEdgeMap(), e.viewport) {
        const n = { ...t.viewport, ...e.viewport };
        t._panZoom?.setViewport(n);
      }
      t.deselectAll(), t._emit("restore", e), t._scheduleAutoLayout(), requestAnimationFrame(() => {
        t._layoutAnimTick++, t._commitNodeGeometry?.();
      });
    },
    /**
     * Reset the canvas to its initial configuration state.
     */
    $reset() {
      Y("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      Y("store", "$clear: emptying canvas"), this.fromObject({
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
      e && bs(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && bs(t, e, "redo");
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
function Fh(t, e) {
  return t * (1 - e);
}
function Oh(t, e) {
  return t * e;
}
function zh(t, e) {
  return e === "in" ? t : 1 - t;
}
function Vh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? Fh(o, e) : Oh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function Bh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function qh(t, e, n) {
  t.style.opacity = String(zh(e, n));
}
function Yh(t) {
  t.style.removeProperty("opacity");
}
const it = Math.PI * 2, nn = /* @__PURE__ */ new Map(), Xh = 64;
function xi(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = nn.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (nn.size >= Xh) {
    const r = nn.keys().next().value;
    r !== void 0 && nn.delete(r);
  }
  return nn.set(t, i), i;
}
function by(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(it * a * l + o * it),
    y: n + s * Math.sin(it * a * l + o * it)
  });
}
function xy(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), u = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), p = u;
  return (g) => {
    const y = e + a * g, m = n + c * g, x = r * Math.sin(it * s * g + l * it);
    return { x: y + h * x, y: m + p * x };
  };
}
function Ey(t, e) {
  const n = xi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function Cy(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(it * l + r * it);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function Sy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * it, f = (Math.sin(s * u) + Math.sin(l * u * 1.3)) / 2, h = (Math.sin(a * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function ky(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let xs = !1;
function xe(t) {
  try {
    return structuredClone(t);
  } catch {
    return xs || (xs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function Wh(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: xe(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function jh(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function Uh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = xe(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Ei {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Ir();
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
    const o = new Ei(this._canvas, this._engine);
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
    return Dr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, Wh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, jh(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && Uh(o, n);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = eo(e.easing), l = this._makeContext(n, e.id);
    if (e.when && !e.when(l)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const N = e.timeline;
      if (this._tag && !e.independent && N.setTag(this._tag), e.independent || this._subTimelines.push(N), this._emit("step", { index: n, id: e.id, timeline: N }), e.onStart?.(l), await N.play(), this._state === "stopped") return;
      if (e.onComplete?.(l), this._emit("step-complete", { timeline: N }), !e.independent) {
        const _ = this._subTimelines.indexOf(N);
        _ >= 0 && this._subTimelines.splice(_, 1);
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
    const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, a, d, u);
    const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, f, h);
    const p = this._resolveFollowPath(e), g = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, x = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, x = this._resolveTargetViewport(e));
    const P = e.edgeTransition ?? "none", b = e.addEdges?.map((N) => N.id) ?? [], E = e.removeEdges?.filter((N) => this._canvas.getEdge(N)).slice() ?? [], S = {
      step: e,
      ctx: l,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: a,
      validEdgeIds: c,
      resolvedPathFn: p,
      guidePathEl: g,
      nodeFromDimensions: d,
      nodeFromStyles: u,
      edgeFromStrokeWidth: f,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: x,
      transition: P,
      addEdgeIds: b,
      removeEdgeIds: E
    };
    if (i === 0)
      return this._executeInstantStep(S);
    const k = this._prepareAnimatedEdges(e, P, b);
    return k && await k, p ? this._executeFollowPathStep(S) : this._executeAnimatedStep(S);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, vn(s.style)));
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
    const n = xi(e.followPath);
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
      edgeFromStrokeWidth: u,
      edgeFromColor: f,
      viewportFrom: h,
      viewportTarget: p,
      transition: g,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: x
    } = e, P = e.resolvedPathFn;
    return new Promise((b) => {
      const E = this._engine.register((S) => {
        if (this._state === "stopped")
          return b(), !0;
        const k = Math.min(S / i, 1), N = s(k);
        if (l) {
          const _ = P(N);
          for (const C of l) {
            const $ = this._canvas.getNode(C);
            $ && ($.position.x = _.x, $.position.y = _.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          N,
          l,
          a,
          c,
          d,
          u,
          f,
          h,
          p
        ), this._tickEdgeTransitions(g, y, m, N), n.onProgress?.(k, o), k >= 1 ? (this._cleanupEdgeTransitions(g, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), x && n.guidePath?.autoRemove !== !1 && x.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), b(), !0) : !1;
      }, r);
      this._activeHandles.push(E);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, l, a, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = st(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = st(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = vn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), p = s.get(f);
        h && p && (h.style = Rr(p, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 ? f.strokeWidth = st(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = wi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = Ku(c, d, n, {
        minZoom: this._canvas.minZoom,
        maxZoom: this._canvas.maxZoom
      });
      this._canvas.viewport.x = u.x, this._canvas.viewport.y = u.y, this._canvas.viewport.zoom = u.zoom;
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
      addEdgeIds: u,
      removeEdgeIds: f,
      guidePathEl: h
    } = e;
    return new Promise((p) => {
      const g = this._buildAnimateTargets(
        n,
        s,
        l,
        a,
        c
      ), y = Object.keys(g.nodes || {}).length > 0 || Object.keys(g.edges || {}).length > 0 || g.viewport;
      if (!y && !u.length && !f.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
        return;
      }
      if (y) {
        const m = this._canvas.animate(g, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (x) => {
            if (this._state === "stopped") {
              m.stop(), p();
              return;
            }
            this._tickEdgeTransitions(d, u, f, x), n.onProgress?.(x, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, u, f), f.length && this._removeEdges(f), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
          }
        });
        this._activeHandles.push({ stop: () => m.stop() });
      } else
        this._executeEdgeLifecycleOnly(e, p);
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
    const { step: o, ctx: i, duration: r, delay: s, transition: l, addEdgeIds: a, removeEdgeIds: c, guidePathEl: d } = e, u = this._engine.register((f) => {
      if (this._state === "stopped")
        return n(), !0;
      const h = Math.min(f / r, 1);
      return this._tickEdgeTransitions(l, a, c, h), o.onProgress?.(h, i), h >= 1 ? (this._cleanupEdgeTransitions(l, a, c), c.length && this._removeEdges(c), d && o.guidePath?.autoRemove !== !1 && d.remove(), o.onProgress?.(1, i), o.onComplete?.(i), this._emit("step-complete"), n(), !0) : !1;
    }, s);
    this._activeHandles.push(u);
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
      r && Vh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && Bh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && qh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && Yh(o);
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
    const i = Yt(o), r = e.fitViewPadding ?? 0.1;
    return Jn(
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
    const r = n.dimensions?.width ?? _e, s = n.dimensions?.height ?? Ee, l = n.position.x + r / 2, a = n.position.y + s / 2;
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
const ra = /* @__PURE__ */ new Map();
function Zt(t, e) {
  ra.set(t, e);
}
function Zh(t) {
  return ra.get(t);
}
const Fe = "http://www.w3.org/2000/svg", Gh = {
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
}, Kh = {
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
let Jh = 0;
const Qh = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Jh}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, l = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, u = n.__gradient;
      if (!d) {
        let g = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(Fe, "defs");
          u = document.createElementNS(Fe, "linearGradient"), u.setAttribute("id", l), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const x = document.createElementNS(Fe, "stop");
            x.setAttribute("offset", String(m.offset)), x.setAttribute("stop-color", m.color), m.opacity !== void 0 && x.setAttribute("stop-opacity", String(m.opacity)), u.appendChild(x);
          }
          y.appendChild(u), n.appendChild(y), g = `url(#${l})`, n.__gradient = u;
        }
        d = document.createElementNS(Fe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), u) {
        const g = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(g), x = e.pathEl.getPointAtLength(y);
        u.setAttribute("x1", String(x.x)), u.setAttribute("y1", String(x.y)), u.setAttribute("x2", String(m.x)), u.setAttribute("y2", String(m.y));
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
}, eg = {
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
}, tg = {
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
Zt("circle", Gh);
Zt("orb", Kh);
Zt("beam", Qh);
Zt("pulse", eg);
Zt("image", tg);
let Es = !1;
function ng(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function Cs(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : ng(o);
}
function og(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = Zh(l);
    if (!a) {
      Y("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !Es && (Es = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? wn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = Cs(r, h, f), g = { ...r, size: d, color: u }, y = a.create(i, g), m = o.getPointAtLength(0), x = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, x);
    let P;
    const b = new Promise((_) => {
      P = _;
    }), E = () => {
      typeof r.onComplete == "function" && r.onComplete(), P();
    }, S = s.wrapOnComplete ? s.wrapOnComplete(E) : E, k = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: S,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(k), t._particleEngineHandle || (t._particleEngineHandle = Qn.register((_) => t._tickParticles(_))), {
      getCurrentPosition() {
        return t._activeParticles.has(k) ? { ...k.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(k) && (k.renderer.destroy(k.element), t._activeParticles.delete(k), S());
      },
      get finished() {
        return b;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      Y("particle", "sendParticleAlongPath: SVG layer unavailable");
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
    return Y("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), l;
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
        Y("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const l = t.getEdgePathElement(o);
      if (!l) {
        Y("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!l.getAttribute("d")) {
        Y("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? wn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(l, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return p && Y("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), p;
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
        Y("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const l = t.getNode(i);
      if (!l) {
        Y("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const a = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = l.position.x + (l.dimensions?.width ?? 150) / 2, u = l.position.y + (l.dimensions?.height ?? 40) / 2, f = `M ${a} ${c} L ${d} ${u}`;
      return Y("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
    },
    // ── Burst: sequenced multi-particle emission ─────────────────────────
    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(o, i) {
      const { count: r, stagger: s = 100, variant: l, ...a } = i, c = [], d = [];
      for (let f = 0; f < r; f++) {
        const h = l ? { ...a, ...l(f, r) } : { ...a };
        if (f === 0)
          c.push(this.sendParticle(o, h));
        else {
          const p = setTimeout(() => {
            c.push(this.sendParticle(o, h));
          }, f * s);
          d.push(p);
        }
      }
      const u = () => c.filter((f) => f != null);
      return {
        get handles() {
          return u();
        },
        get finished() {
          return new Promise((f) => {
            setTimeout(() => {
              Promise.all(u().map((h) => h.finished)).then(() => f());
            }, r * s + 50);
          });
        },
        stopAll() {
          for (const f of d)
            clearTimeout(f);
          for (const f of u())
            f.stop();
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
        const f = o.map((g) => {
          const m = t.getEdgePathElement(g)?.getTotalLength() ?? 0;
          return { id: g, length: m };
        }).filter((g) => g.length > 0);
        if (f.length === 0) {
          const g = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: g, stopAll() {
          } };
        }
        const h = Math.max(...f.map((g) => g.length)), p = Cs(a, h, "2s");
        for (const { id: g, length: y } of f) {
          const m = y / h, x = p * m, P = p - x;
          if (P <= 0) {
            const b = this.sendParticle(g, { ...a, duration: x });
            b && c.push(b);
          } else {
            const b = setTimeout(() => {
              const E = this.sendParticle(g, { ...a, duration: x });
              E && c.push(E);
            }, P);
            d.push(b);
          }
        }
      } else
        for (const f of o) {
          const h = this.sendParticle(f, a);
          h && c.push(h);
        }
      const u = new Promise((f) => {
        setTimeout(() => {
          Promise.all(c.map((p) => p.finished)).then(() => {
            l?.(), f();
          });
        }, s === "arrival" ? 100 : 0);
      });
      return {
        get handles() {
          return c;
        },
        finished: u,
        stopAll() {
          for (const f of d)
            clearTimeout(f);
          for (const f of c)
            f.stop();
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
class ig {
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
const ni = 1, oi = 1 / 60;
class ln {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = xe(e);
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
    return xe(this._state);
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
            o?.id && (this._state.nodes[o.id] = xe(o));
        else n?.id ? this._state.nodes[n.id] = xe(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = xe(e.args.node));
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
            o?.id && (this._state.edges[o.id] = xe(o));
        else n?.id ? this._state.edges[n.id] = xe(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = xe(e.args.edge));
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
    this._state = xe(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = xe(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: xe(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? zr(r) ?? void 0 : void 0, l = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: xe(o),
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
      e._easingFn = eo(e.easing);
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
      e._easingFn = eo(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
    return xe({
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
      const l = e._from[s], a = this._getTargetValue(s, e.targets) ?? l, c = st(l, a, r);
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
            Hr(r, o, n);
            break;
          case "decay":
            vi(r, o, n);
            break;
          case "inertia":
            Fr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            Or(r, s, a, i), a >= 1 && (r.settled = !0);
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
const aa = /* @__PURE__ */ new Map();
function Ci(t, e) {
  aa.set(t, e);
}
function sg(t) {
  return aa.get(t);
}
function Si(t, e = 20) {
  const n = Object.values(t);
  if (n.length === 0)
    return null;
  let o = 1 / 0, i = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (const l of n) {
    const a = l.position?.x ?? 0, c = l.position?.y ?? 0, d = l.dimensions?.width ?? 150, u = l.dimensions?.height ?? 40;
    o = Math.min(o, a), i = Math.min(i, c), r = Math.max(r, a + d), s = Math.max(s, c + u);
  }
  return o -= e, i -= e, r += e, s += e, { minX: o, minY: i, vbWidth: r - o, vbHeight: s - i };
}
function la(t) {
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
const rg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Si(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += la(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, ag = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Si(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const u = t.nodes[d.source], f = t.nodes[d.target];
      if (!u || !f)
        continue;
      const h = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, p = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2, g = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, y = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${p}" x2="${g}" y2="${y}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, lg = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = Si(t.nodes);
    if (!r)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const s = /* @__PURE__ */ new Set();
    if (o) {
      for (const f of o)
        if (f.targets?.nodes)
          for (const h of Object.keys(f.targets.nodes))
            s.add(h);
    }
    const { minX: l, minY: a, vbWidth: c, vbHeight: d } = r;
    let u = `<svg width="${e}" height="${n}" viewBox="${l} ${a} ${c} ${d}" xmlns="http://www.w3.org/2000/svg">`;
    u += la(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, p = f.position?.y ?? 0, g = f.dimensions?.width ?? 150, y = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
Ci("faithful", rg);
Ci("outline", ag);
Ci("activity", lg);
function ii(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function si(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function cg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function ca(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      ca(t[e]);
  }
  return t;
}
class ki {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = ca(xe(e.initialState)), this.events = Object.freeze(xe(e.events)), this.checkpoints = Object.freeze(xe(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: xe(this.initialState),
      events: xe(this.events),
      checkpoints: xe(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > ni)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${ni}). Please update AlpineFlow to replay this recording.`
      );
    return new ki(e);
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
      const i = cg(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new ln(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const l = oi * 1e3;
    let a = o ? ii(r, i) : si(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = sg(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class dg {
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
      version: ni,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new ki(i);
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
      o && typeof o == "object" && "id" in o && (e[o.id] = xe(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = xe(o));
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
        targets: xe(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? xe(o.motion) : void 0,
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
        const u = r.apply(this._canvas, [s, l]);
        if (u && typeof u == "object" && u.finished && !u.isFinished) {
          const f = { handleId: a, eventT: c, targets: s, options: l, handle: u, fromValues: d };
          this._activeAnims.set(a, f), u.finished.then(() => {
            this._activeAnims.delete(a);
          }).catch(() => {
            this._activeAnims.delete(a);
          });
        }
        return u;
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
class ug {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new ln(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Mo(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new ln(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new ln(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const l = oi * 1e3;
    let a = n ? ii(r, i) : si(r, i);
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
    const e = Mo(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new ln(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = oi * 1e3;
    let l = e === 0 ? si(i, 0) : ii(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Mo(), this._scheduleTick();
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
function Mo() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function fg(t) {
  const e = og(t);
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
      const n = new Ei(t, Qn);
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
        Y("animation", `Named animation "${n}" not found`);
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
      if (Y("animate", "update() called", {
        nodes: c,
        edges: d,
        viewport: !!n.viewport,
        duration: i,
        easing: o.easing ?? "default",
        instant: i === 0
      }), n.nodes)
        for (const [h, p] of Object.entries(n.nodes)) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const m = (p._duration ?? i) === 0;
          if (p.followPath && !m) {
            let x = null;
            typeof p.followPath == "function" ? x = p.followPath : x = xi(p.followPath);
            let P = null;
            if (p.guidePath?.visible && typeof p.followPath == "string" && typeof document < "u") {
              const b = t.getEdgeSvgElement?.();
              b && (P = document.createElementNS("http://www.w3.org/2000/svg", "path"), P.setAttribute("d", p.followPath), P.classList.add("flow-guide-path"), p.guidePath.class && P.classList.add(p.guidePath.class), b.appendChild(P));
            }
            if (x) {
              const b = x, E = P, S = p.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (k) => {
                  const N = t._nodeMap.get(h);
                  if (!N) return;
                  const _ = b(k);
                  ke().raw(N).position.x = _.x, ke().raw(N).position.y = _.y, s.add(h), k >= 1 && E && S && E.remove();
                }
              });
            }
          } else if (p.position) {
            const P = ke().raw(g).position;
            if (p.position.x !== void 0) {
              const b = p.position.x;
              if (m)
                P.x = b;
              else {
                const E = P.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: E,
                  to: b,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (ke().raw(k).position.x = S, s.add(h));
                  }
                });
              }
            }
            if (p.position.y !== void 0) {
              const b = p.position.y;
              if (m)
                P.y = b;
              else {
                const E = P.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: E,
                  to: b,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (ke().raw(k).position.y = S), s.add(h);
                  }
                });
              }
            }
            m && s.add(h);
          }
          if (p.data !== void 0 && Object.assign(g.data, p.data), p.class !== void 0 && (g.class = p.class), p.selected !== void 0 && (g.selected = p.selected), p.zIndex !== void 0 && (g.zIndex = p.zIndex), p.style !== void 0)
            if (m)
              g.style = p.style, l.add(h);
            else {
              const x = vn(g.style || {}), P = vn(p.style), b = t._nodeElements.get(h);
              if (b) {
                const E = getComputedStyle(b);
                for (const S of Object.keys(P))
                  x[S] === void 0 && (x[S] = E.getPropertyValue(S));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (E) => {
                  const S = t._nodeMap.get(h);
                  S && (ke().raw(S).style = Rr(x, P, E), l.add(h));
                }
              });
            }
          p.dimensions && g.dimensions && (p.dimensions.width !== void 0 && (m ? g.dimensions.width = p.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: g.dimensions.width,
            to: p.dimensions.width,
            apply: (x) => {
              g.dimensions.width = x;
            }
          })), p.dimensions.height !== void 0 && (g.fixedDimensions = !0, m ? g.dimensions.height = p.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: g.dimensions.height,
            to: p.dimensions.height,
            apply: (x) => {
              g.dimensions.height = x;
            }
          })));
        }
      if (n.edges)
        for (const [h, p] of Object.entries(n.edges)) {
          const g = t._edgeMap.get(h);
          if (!g) continue;
          const m = (p._duration ?? i) === 0;
          if (p.color !== void 0)
            if (typeof p.color == "object")
              g.color = p.color;
            else if (m)
              g.color = p.color, a.add(h);
            else {
              const x = typeof g.color == "string" && g.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || yi;
              r.push({
                key: `edge:${h}:color`,
                from: x,
                to: p.color,
                apply: (P) => {
                  const b = t._edgeMap.get(h);
                  b && (ke().raw(b).color = P, a.add(h));
                }
              });
            }
          if (p.strokeWidth !== void 0)
            if (m)
              g.strokeWidth = p.strokeWidth, a.add(h);
            else {
              const x = g.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: x,
                to: p.strokeWidth,
                apply: (P) => {
                  const b = t._edgeMap.get(h);
                  b && (ke().raw(b).strokeWidth = P, a.add(h));
                }
              });
            }
          p.label !== void 0 && (g.label = p.label), p.animated !== void 0 && (g.animated = p.animated), p.class !== void 0 && (g.class = p.class);
        }
      if (n.viewport) {
        const h = n.viewport, g = (h._duration ?? i) === 0, y = t.viewport;
        h.pan?.x !== void 0 && (g ? y.x = h.pan.x : r.push({
          key: "viewport:pan.x",
          from: y.x,
          to: h.pan.x,
          apply: (m) => {
            y.x = m;
          }
        })), h.pan?.y !== void 0 && (g ? y.y = h.pan.y : r.push({
          key: "viewport:pan.y",
          from: y.y,
          to: h.pan.y,
          apply: (m) => {
            y.y = m;
          }
        })), h.zoom !== void 0 && (g ? y.zoom = h.zoom : r.push({
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
      const f = ke().raw(t._animator).animate(r, {
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
            for (const [h, p] of Object.entries(n.nodes)) {
              const g = t._nodeMap.get(h);
              if (!g) continue;
              const y = ke().raw(g);
              (p.followPath || p.position?.x !== void 0) && (g.position.x = y.position.x), (p.followPath || p.position?.y !== void 0) && (g.position.y = y.position.y), p.style !== void 0 && (g.style = y.style);
            }
          if (n.edges)
            for (const [h, p] of Object.entries(n.edges)) {
              const g = t._edgeMap.get(h);
              if (!g) continue;
              const y = ke().raw(g);
              p.color !== void 0 && typeof p.color == "string" && (g.color = y.color), p.strokeWidth !== void 0 && (g.strokeWidth = y.strokeWidth);
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), o.onComplete?.();
        }
      });
      return n.nodes && (f._targetNodeIds = Object.keys(n.nodes)), f;
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
      const i = Dr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const l = o.zoom, a = Qn.register(() => {
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
        const u = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, f = l ?? t.viewport.zoom, h = u.width / 2 - d.x * f, p = u.height / 2 - d.y * f, g = 0.08;
        return t.viewport.x += (h - t.viewport.x) * g, t.viewport.y += (p - t.viewport.y) * g, l && (t.viewport.zoom += (l - t.viewport.zoom) * g), t._flushViewport(), !1;
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
      return ke().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      ke().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      ke().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      ke().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new ig(n, {
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
      const o = ke().raw(t._animator), i = o.beginTransaction();
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
      const n = structuredClone(ke().raw(t.nodes)), o = structuredClone(ke().raw(t.edges)), i = { ...t.viewport };
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
      const i = this, r = i.animate, s = i.update, l = i.sendParticle, a = i.sendParticleAlongPath, c = i.sendParticleBetween, d = i.sendParticleBurst, u = i.sendConverging, f = {
        get nodes() {
          return t.nodes;
        },
        get edges() {
          return t.edges;
        },
        get viewport() {
          return t.viewport;
        },
        animate: (g, y) => {
          const m = i.update;
          i.update = s;
          try {
            return r.call(i, g, y);
          } finally {
            i.update = m;
          }
        },
        update: (g, y) => s.call(i, g, y),
        sendParticle: (g, y) => l.call(i, g, y),
        sendParticleAlongPath: (g, y) => a.call(i, g, y),
        sendParticleBetween: (g, y, m) => c.call(i, g, y, m),
        sendParticleBurst: (g, y) => d.call(i, g, y),
        sendConverging: (g, y) => u.call(i, g, y),
        addNodes: (g) => t.addNodes(g),
        removeNodes: (g) => t.removeNodes(g),
        addEdges: (g) => t.addEdges(g),
        removeEdges: (g) => t.removeEdges(g)
      }, h = new dg(f, o), p = async () => {
        i.animate = (...g) => f.animate(...g), i.update = (...g) => f.update(...g), i.sendParticle = (...g) => f.sendParticle(...g), i.sendParticleAlongPath = (...g) => f.sendParticleAlongPath(...g), i.sendParticleBetween = (...g) => f.sendParticleBetween(...g), i.sendParticleBurst = (...g) => f.sendParticleBurst(...g), i.sendConverging = (...g) => f.sendConverging(...g);
        try {
          const g = n();
          g instanceof Promise && await g;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = l, i.sendParticleAlongPath = a, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = u;
        }
      };
      return h.record(p, o?.captureMetadata);
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
      return new ug(r, n, o);
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
      Zt(n, o);
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
function Ss(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return mt(t, e);
  const r = /* @__PURE__ */ new Set(), s = Ko(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = Ko(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function hg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function To(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function ks(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = mt(r.id, e);
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
function Ao(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function gg(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Hn = { width: 150, height: 50 };
function pg(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = Ss(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      Y("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = hg(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? Hn, d = r && s ? s : c, u = {};
        for (const [h] of a.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? Hn;
          let y, m;
          p.parentId === e ? (y = (d.width - g.width) / 2, m = (d.height - g.height) / 2) : (y = o.position.x + (d.width - g.width) / 2, m = o.position.y + (d.height - g.height) / 2), u[h] = {
            position: { x: y, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (u[e] = { dimensions: s });
        const f = [];
        for (const h of t.edges)
          if (i.has(h.source) || i.has(h.target)) {
            const p = t.getEdgeElement?.(h.id)?.closest("svg");
            p && f.push(p);
          }
        t.animate ? t.animate({ nodes: u }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (h) => {
            const p = String(1 - h);
            for (const g of f) g.style.opacity = p;
          },
          onComplete: () => {
            for (const h of f) h.style.opacity = "";
            To(o, t.nodes, a, s), a.reroutedEdges = Ao(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (To(o, t.nodes, a, s), a.reroutedEdges = Ao(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        To(o, t.nodes, a, s), a.reroutedEdges = Ao(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      Y("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && gg(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? Hn;
        ks(o, t.nodes, i, r);
        const a = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const p = h.dimensions ?? Hn;
            let g, y;
            h.parentId === e ? (g = (l.width - p.width) / 2, y = (l.height - p.height) / 2) : (g = o.position.x + (l.width - p.width) / 2, y = o.position.y + (l.height - p.height) / 2), h.position = { x: g, y }, h.style = { ...h.style || {}, opacity: "0" }, a[u] = {
              position: f,
              style: { opacity: "1" }
            };
          }
        }
        const c = new Set(i.targetPositions.keys());
        t._flushNodeStyles(c);
        const d = [];
        for (const u of t.edges)
          if (c.has(u.source) || c.has(u.target)) {
            const f = t.getEdgeElement?.(u.id)?.closest("svg");
            f && (f.style.opacity = "0", d.push(f));
          }
        t.animate ? t.animate({ nodes: a }, {
          duration: 300,
          easing: "easeOut",
          onProgress: (u) => {
            const f = String(u);
            for (const h of d) h.style.opacity = f;
          },
          onComplete: () => {
            for (const u of d) u.style.opacity = "";
            for (const u of c) {
              const f = t._nodeMap.get(u);
              f && typeof f.style == "object" && delete f.style.opacity;
            }
            t._resumeHistory();
          }
        }) : t._resumeHistory(), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
      } else
        ks(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (Y("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
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
      return Ss(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return mt(e, t.nodes).size;
    }
  };
}
function mg(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, Y("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, Y("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
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
function yg(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      Y("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      Y("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
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
      t.selectedRows.size !== 0 && (Y("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, Y("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
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
const wg = 8, vg = 12, _g = 2;
function Li(t) {
  return {
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? Ee
  };
}
function bg(t) {
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
function xg(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function Ls(t, e, n) {
  const o = e.gap ?? wg, i = e.padding ?? vg, r = e.headerHeight ?? 0, s = bg(e), l = xg(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Eg(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? Cg(l, o, i, r, s, u, a, c) : Sg(l, o, i, r, s, e.columns ?? _g, d, u, a, c);
}
function Eg(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => Li(f));
  for (const f of c) a = Math.max(a, f.width);
  const d = r > 0 ? r : a;
  let u = n + o;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], p = c[f];
    s.set(h.id, { x: n, y: u }), (i === "width" || i === "both") && l.set(h.id, { width: d, height: p.height }), u += p.height + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: d + n * 2, height: u }
  };
}
function Cg(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => Li(f));
  for (const f of c) a = Math.max(a, f.height);
  const d = r > 0 ? r : a;
  let u = n;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], p = c[f];
    s.set(h.id, { x: u, y: n + o }), (i === "height" || i === "both") && l.set(h.id, { width: p.width, height: d }), u += p.width + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: u, height: d + n * 2 + o }
  };
}
function Sg(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), u = t.map((m) => Li(m));
  let f = 0, h = 0;
  for (const m of u)
    f = Math.max(f, m.width), h = Math.max(h, m.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (f = p);
  const g = Math.ceil(t.length / d), y = l > 0 ? (l - (g - 1) * e) / g : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const x = m % d, P = Math.floor(m / d), b = n + x * (f + e), E = n + o + P * (h + e);
    a.set(t[m].id, { x: b, y: E }), i === "both" ? c.set(t[m].id, { width: f, height: h }) : i === "width" ? c.set(t[m].id, { width: f, height: u[m].height }) : i === "height" && c.set(t[m].id, { width: u[m].width, height: h });
  }
  return {
    positions: a,
    dimensions: c,
    parentDimensions: {
      width: d * f + (d - 1) * e + n * 2,
      height: g * h + (g - 1) * e + n * 2 + o
    }
  };
}
function kg(t) {
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
      if (Y("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
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
      const u = t.nodes.find((b) => b.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((b) => b.parentId === e);
      l && (f = f.filter((b) => b.id !== l)), a && !f.some((b) => b.id === a.id) && (f = [...f, a]);
      const h = new Map(f.map((b) => [b.id, b]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const b of f)
          b.childLayout && this.layoutChildren(b.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const p = u.childLayout, g = p.headerHeight !== void 0 ? p : u.data?.label ? { ...p, headerHeight: 30 } : p, y = Ls(f, g, d);
      for (const [b, E] of y.positions) {
        if (b === s || a && b === a.id && !t._nodeMap.has(b)) continue;
        const S = h.get(b);
        S && (S.position ? (S.position.x = E.x, S.position.y = E.y) : S.position = { x: E.x, y: E.y });
      }
      for (const [b, E] of y.dimensions) {
        if (b === s || a && b === a.id && !t._nodeMap.has(b)) continue;
        const S = h.get(b);
        if (S) {
          let k = E.width, N = E.height;
          S.minDimensions && (S.minDimensions.width != null && (k = Math.max(k, S.minDimensions.width)), S.minDimensions.height != null && (N = Math.max(N, S.minDimensions.height))), S.maxDimensions && (S.maxDimensions.width != null && (k = Math.min(k, S.maxDimensions.width)), S.maxDimensions.height != null && (N = Math.min(N, S.maxDimensions.height))), S.dimensions ? (S.dimensions.width = k, S.dimensions.height = N) : S.dimensions = { width: k, height: N }, S.childLayout && !c && this.layoutChildren(b, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: S.dimensions });
        }
      }
      let m = y.parentDimensions.width, x = y.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (m = Math.max(m, u.minDimensions.width)), u.minDimensions.height != null && (x = Math.max(x, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (m = Math.min(m, u.maxDimensions.width)), u.maxDimensions.height != null && (x = Math.min(x, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = m, u.dimensions.height = x, m !== y.parentDimensions.width || x !== y.parentDimensions.height) {
        const E = Ls(f, g, { width: m, height: x });
        for (const [S, k] of E.positions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const N = h.get(S);
          N && (N.position ? (N.position.x = k.x, N.position.y = k.y) : N.position = { x: k.x, y: k.y });
        }
        for (const [S, k] of E.dimensions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const N = h.get(S);
          if (N) {
            let _ = k.width, C = k.height;
            N.minDimensions && (N.minDimensions.width != null && (_ = Math.max(_, N.minDimensions.width)), N.minDimensions.height != null && (C = Math.max(C, N.minDimensions.height))), N.maxDimensions && (N.maxDimensions.width != null && (_ = Math.min(_, N.maxDimensions.width)), N.maxDimensions.height != null && (C = Math.min(C, N.maxDimensions.height))), N.dimensions ? (N.dimensions.width = _, N.dimensions.height = C) : N.dimensions = { width: _, height: C }, N.childLayout && !c && this.layoutChildren(S, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: N.dimensions });
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
      const n = It("layout:dagre");
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
      }), Y("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
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
      const n = It("layout:force");
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
      }), Y("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
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
      const n = It("layout:hierarchy");
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
      }), Y("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
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
      const n = It("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (r.size === 0) {
        Y("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), Y("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function Lg(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return fn(n, t._config.childValidationRules ?? {});
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
        const r = fn(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((a) => a.parentId === o), l = vs(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = fn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = vs(n, i, o);
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
          const u = this._getChildValidation(i);
          if (u) {
            const f = t.getNode(i);
            if (f) {
              const h = t.nodes.filter(
                (g) => g.parentId === i
              ), p = ao(f, o, h, u);
              if (!p.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
                  child: o,
                  operation: "remove",
                  rule: p.rule,
                  message: p.message
                }), !1;
            }
          }
        }
        t._captureHistory();
        const d = t.getAbsolutePosition(e);
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = Pt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
          let u, f = i;
          for (; f; ) {
            const h = t._nodeMap.get(f);
            if (!h) break;
            h.childLayout && (u = f), f = h.parentId;
          }
          u && t.layoutChildren?.(u);
        }
        return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: null }), !0;
      }
      const r = t.getNode(n);
      if (!r || mt(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = oa(r, o, d, s);
        if (!u.valid)
          return t._config.onChildValidationFail && t._config.onChildValidationFail({
            parent: r,
            child: o,
            operation: "add",
            rule: u.rule,
            message: u.message
          }), !1;
      }
      if (i) {
        const d = this._getChildValidation(i);
        if (d) {
          const u = t.getNode(i);
          if (u) {
            const f = t.nodes.filter(
              (p) => p.parentId === i
            ), h = ao(u, o, f, d);
            if (!h.valid)
              return t._config.onChildValidationFail && t._config.onChildValidationFail({
                parent: u,
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
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = Pt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
        if (!o.childLayout) {
          const u = t._initialDimensions.get(e);
          o.dimensions = u ? { ...u } : void 0;
        }
        if (o.order == null) {
          const u = t.nodes.filter(
            (f) => f.parentId === n && f.id !== o.id
          );
          o.order = u.length > 0 ? Math.max(...u.map((f) => f.order ?? 0)) + 1 : 0;
        }
      }
      const c = /* @__PURE__ */ new Set();
      for (const d of [n, i]) {
        if (!d) continue;
        let u, f = d;
        for (; f; ) {
          const h = t._nodeMap.get(f);
          if (!h) break;
          h.childLayout && (u = f), f = h.parentId;
        }
        u && c.add(u);
      }
      for (const d of c)
        t.layoutChildren?.(d);
      return t._emit("node-reparent", { node: o, oldParentId: i, newParentId: n }), !0;
    }
  };
}
function Pg(t) {
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
function qn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), l = Math.sin(r), a = t - n, c = e - o;
  return {
    x: n + a * s - c * l,
    y: o + a * l + c * s
  };
}
function da(t) {
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
function Mg(t) {
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
function Tg({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return no({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = Gr(t, e, n, o, i, r, s);
  if (!l)
    return no({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = da(l), { x: c, y: d, offsetX: u, offsetY: f } = Mg(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Ag(t) {
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
      c = Ps(a);
      break;
    case "step":
      c = Ng(a, 0);
      break;
    case "smoothstep":
      c = $g(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = da(a.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Ps(a);
  }
  const d = Ig(a), u = Cn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Ps(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function Ng(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ua(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ua(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function $g(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ua(t[0], t[1], e);
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
function Ig(t) {
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
function jt(t, e, n, o) {
  const i = t.dimensions?.width ?? _e, r = t.dimensions?.height ?? Ee, s = Ut(t, o);
  let l;
  if (t.shape) {
    const a = n?.[t.shape] ?? ea[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = ys(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = ys(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = qn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function Ms(t) {
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
function ri(t) {
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
const Dg = 1.5, Rg = 5 / 20;
function Dt(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = ri(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const a = (i.width ?? 12.5) * Dg * Rg * 0.4, c = r + a, d = ri(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function co(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, u) {
  const f = r ?? jt(e, o, c, d), h = s ?? jt(n, i, c, d), p = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: Ms(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Ms(i)
  }, g = t.type ?? u ?? "bezier";
  if (l?.[g])
    return l[g](p);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return Ag({
        ...p,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Tg({ ...p, obstacles: a });
    case "orthogonal":
      return Kf({ ...p, obstacles: a });
    case "smoothstep":
      return _n(p);
    case "straight":
      return Yr({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return no(p);
  }
}
function Ts(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? Ee, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? qn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? qn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(l);
  let f;
  d / a > u / c ? f = a / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + l * f
  };
  return t.rotation ? qn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function As(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? Ee, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, p = e.y - r;
    return Math.abs(h) > Math.abs(p) ? h > 0 ? "right" : "left" : p > 0 ? "bottom" : "top";
  }
  const s = 1, l = t.position.x, a = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - l) <= s) return "left";
  if (Math.abs(e.x - a) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const u = e.x - i, f = e.y - r;
  return Math.abs(u) > Math.abs(f) ? u > 0 ? "right" : "left" : f > 0 ? "bottom" : "top";
}
function fa(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? Ee, i = e.dimensions?.width ?? _e, r = e.dimensions?.height ?? Ee, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = Ts(t, l), c = Ts(e, s), d = As(t, a), u = As(e, c);
  return {
    sx: a.x,
    sy: a.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function Ly(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function ha(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function ga(t, e) {
  return `${t}__grad__${e}`;
}
function pa(t, e, n, o, i, r, s) {
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
function No(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
function Hg(t, e) {
  return Array.isArray(t) ? t.findIndex((n) => n?.name === e) : -1;
}
function Ns(t, e, n, o, i) {
  const r = t.data?.fields;
  if (!Array.isArray(r) || !Number.isInteger(n) || n < 0 || n >= r.length) return null;
  const { width: s, height: l } = t.dimensions ?? {};
  if (typeof s != "number" || !Number.isFinite(s) || typeof l != "number" || !Number.isFinite(l)) return null;
  const { headerHeight: a, rowHeight: c, handleOffsetY: d, handleOffsetYLast: u, insetLeft: f, insetRight: h, insetTop: p } = i;
  if (!Number.isFinite(a) || !Number.isFinite(c) || !Number.isFinite(d) || !Number.isFinite(u) || !Number.isFinite(f) || !Number.isFinite(h) || !Number.isFinite(p))
    return null;
  const g = n === r.length - 1 ? u : d, y = e.y + p + a + n * c + g;
  return { x: o === "left" ? e.x + f : e.x + s - h, y, position: o };
}
const Fg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Og(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !Be(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Wr({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function zg(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ma(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function $s(t, e) {
  if (!e) return t;
  const n = ri(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function Is(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function uo(t, e) {
  const n = Array.from(t);
  if (n.length === 0) return null;
  if (n.length === 1 || !e) return n[0];
  let o = null, i = 1 / 0;
  for (const r of n) {
    const s = r.getBoundingClientRect(), l = (s.left + s.right) / 2, a = (s.top + s.bottom) / 2, c = l - e.x, d = a - e.y, u = c * c + d * d;
    u < i && (i = u, o = r);
  }
  return o;
}
function fo(t, e, n, o, i, r, s) {
  const l = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (l) {
    if (n) {
      const c = l.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = uo(c, r);
      if (!d) {
        const u = l.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = uo(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ma(n);
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
function Ds(t, e, n, o) {
  if (!t || !e || t.hidden || t.collapsed || t.condensed || t.rotation) return -1;
  const i = t.nodeOrigin;
  if (i && (i[0] !== 0 || i[1] !== 0) || !n?.hasAttribute("data-flow-schema-node") || n.style.display === "none") return -1;
  const r = t.dimensions?.width, s = t.dimensions?.height;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s)) return -1;
  const l = t.data?.fields;
  if (!Array.isArray(l) || l.length === 0) return -1;
  const a = o.insetTop + o.headerHeight + (l.length - 1) * o.rowHeight + o.rowHeightLast + o.insetBottom;
  return Math.abs(a - s) > 0.5 ? -1 : Hg(l, e);
}
function Rs(t, e, n, o, i) {
  const r = t.dimensions?.width ?? _e, s = e.x + (i.insetLeft + (r - i.insetRight)) / 2;
  return n === "source" ? o >= s ? "right" : "left" : o > s ? "right" : "left";
}
function Hs(t) {
  return t.position.x + (t.dimensions?.width ?? _e) / 2;
}
function Vg(t, e, n, o, i, r, s, l) {
  const a = Ds(t, i, s?.get(t.id), l);
  if (a < 0) return null;
  const c = Ds(e, r, s?.get(e.id), l);
  if (c < 0) return null;
  const d = Rs(t, n.position, "source", Hs(o), l), u = Rs(e, o.position, "target", Hs(n), l), f = Ns(t, n.position, a, d, l), h = Ns(e, o.position, c, u, l);
  if (!f || !h) return null;
  const p = { handleWidth: l.handleWidth, handleHeight: l.handleHeight };
  return {
    sourcePos: f.position,
    targetPos: h.position,
    srcMeasurement: { x: f.x, y: f.y, ...p },
    tgtMeasurement: { x: h.x, y: h.y, ...p }
  };
}
function Fs(t, e, n, o, i, r, s, l, a) {
  const c = a ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const g = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = uo(g, l), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = uo(y, l);
    }
    if (!d) {
      const y = ma(o);
      y && (d = c.querySelector(`[data-flow-handle-position="${y}"]`));
    }
  } else
    d = c.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!d) return null;
  const u = d.getBoundingClientRect();
  if (u.width === 0 && u.height === 0) return null;
  const f = t.getBoundingClientRect(), h = u.left + u.width / 2, p = u.top + u.height / 2;
  return {
    x: (h - f.left - s.x) / r,
    y: (p - f.top - s.y) / r,
    handleWidth: u.width / r,
    handleHeight: u.height / r
  };
}
function Bg(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function ct(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function qg(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function Yg(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("fill", "none"), l.style.stroke = "transparent", l.style.strokeWidth = "20", l.style.pointerEvents = "stroke", l.style.cursor = "pointer", s.appendChild(l);
      let a = e.querySelector("path:not(:first-child)");
      a || (a = document.createElementNS("http://www.w3.org/2000/svg", "path"), a.setAttribute("fill", "none"), a.setAttribute("stroke-width", "1.5"), a.style.pointerEvents = "none", s.appendChild(a));
      let c = null, d = null, u = null, f = null, h = 0, p = null, g = "none", y = null, m = null;
      function x(T, A, H, ae, le) {
        p || (p = document.createElementNS("http://www.w3.org/2000/svg", "circle"), p.classList.add("flow-edge-dot"), p.style.pointerEvents = "none", T.appendChild(p));
        const ie = H.closest(".flow-container"), V = ie ? getComputedStyle(ie) : null, z = ae.particleSize ?? (parseFloat(V?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), X = le || V?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        p.setAttribute("r", String(z)), ae.particleColor ? p.style.fill = ae.particleColor : p.style.removeProperty("fill");
        const G = p.querySelector("animateMotion");
        G && G.remove();
        const Z = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        Z.setAttribute("dur", X), Z.setAttribute("repeatCount", "indefinite"), Z.setAttribute("path", A), p.appendChild(Z);
      }
      function P() {
        p?.remove(), p = null;
      }
      let b = null, E = null, S = null, k = null;
      const N = (T) => {
        T.stopPropagation();
        const A = o(n);
        if (!A) return;
        const H = t.$data(e.closest("[x-data]"));
        H && (H._emit("edge-click", { edge: A, event: T }), pt(T, H._shortcuts?.multiSelect) ? H.selectedEdges.has(A.id) ? (H.selectedEdges.delete(A.id), A.selected = !1, Y("selection", `Edge "${A.id}" deselected (shift)`)) : (H.selectedEdges.add(A.id), A.selected = !0, Y("selection", `Edge "${A.id}" selected (shift)`)) : (H.deselectAll(), H.selectedEdges.add(A.id), A.selected = !0, Y("selection", `Edge "${A.id}" selected`)), H._emitSelectionChange());
      }, _ = (T) => {
        T.preventDefault(), T.stopPropagation();
        const A = o(n);
        if (!A) return;
        const H = t.$data(e.closest("[x-data]"));
        if (!H) return;
        const ae = T.target;
        if (ae.classList.contains("flow-edge-control-point")) {
          const le = parseInt(ae.dataset.pointIndex ?? "", 10);
          if (!isNaN(le)) {
            H._emit("edge-control-point-context-menu", {
              edge: A,
              pointIndex: le,
              position: { x: T.clientX, y: T.clientY },
              event: T
            });
            return;
          }
        }
        H._emit("edge-context-menu", { edge: A, event: T });
      }, C = (T) => {
        T.stopPropagation(), T.preventDefault();
        const A = o(n), H = t.$data(e.closest("[x-data]"));
        if (!A || !H || (A.type ?? H._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const le = T.target;
        if (le.classList.contains("flow-edge-control-point")) {
          const ie = parseInt(le.dataset.pointIndex ?? "", 10);
          !isNaN(ie) && A.controlPoints && (H._captureHistory?.(), A.controlPoints.splice(ie, 1), H._emit("edge-control-point-change", { edge: A, action: "remove", index: ie }));
          return;
        }
        if (le.classList.contains("flow-edge-midpoint")) {
          const ie = parseInt(le.dataset.segmentIndex ?? "", 10);
          if (!isNaN(ie)) {
            const V = H.screenToFlowPosition(T.clientX, T.clientY);
            A.controlPoints || (A.controlPoints = []), H._captureHistory?.(), A.controlPoints.splice(ie, 0, { x: V.x, y: V.y }), H._emit("edge-control-point-change", { edge: A, action: "add", index: ie });
          }
          return;
        }
        if (le.closest("path")) {
          const ie = H.screenToFlowPosition(T.clientX, T.clientY);
          A.controlPoints || (A.controlPoints = []);
          const V = [
            b ?? { x: 0, y: 0 },
            ...A.controlPoints,
            E ?? { x: 0, y: 0 }
          ];
          let z = 0, X = 1 / 0;
          for (let G = 0; G < V.length - 1; G++) {
            const Z = qg(ie, V[G], V[G + 1]);
            Z < X && (X = Z, z = G);
          }
          H._captureHistory?.(), A.controlPoints.splice(z, 0, { x: ie.x, y: ie.y }), H._emit("edge-control-point-change", { edge: A, action: "add", index: z });
        }
      }, $ = (T) => {
        const A = T.target;
        if (!A.classList.contains("flow-edge-control-point") || T.button !== 0) return;
        T.stopPropagation(), T.preventDefault();
        const H = o(n);
        if (!H?.controlPoints) return;
        const ae = t.$data(e.closest("[x-data]"));
        if (!ae) return;
        const le = parseInt(A.dataset.pointIndex ?? "", 10);
        if (isNaN(le)) return;
        A.classList.add("dragging");
        let ie = !1;
        const V = (X) => {
          ie || (ae._captureHistory?.(), ie = !0);
          let G = ae.screenToFlowPosition(X.clientX, X.clientY);
          const Z = ae._config?.snapToGrid;
          Z && (G = {
            x: Math.round(G.x / Z[0]) * Z[0],
            y: Math.round(G.y / Z[1]) * Z[1]
          }), H.controlPoints[le] = G;
        }, z = () => {
          document.removeEventListener("pointermove", V), document.removeEventListener("pointerup", z), A.classList.remove("dragging"), ie && ae._emit("edge-control-point-change", { edge: H, action: "move", index: le });
        };
        document.addEventListener("pointermove", V), document.addEventListener("pointerup", z);
      };
      s.addEventListener("contextmenu", _), s.addEventListener("dblclick", C), s.addEventListener("pointerdown", $, !0);
      let M = null;
      const w = (T) => {
        if (T.button !== 0) return;
        T.stopPropagation();
        const A = o(n);
        if (!A) return;
        const H = t.$data(e.closest("[x-data]"));
        if (!H) return;
        const ae = H._config?.reconnectSnapRadius ?? Ji, le = H._config?.edgesReconnectable !== !1, ie = A.reconnectable ?? !0;
        let V = null;
        if (le && ie !== !1 && b && E) {
          const se = H.screenToFlowPosition(T.clientX, T.clientY), de = ct(se.x, se.y, b.x, b.y, ae) || S && ct(se.x, se.y, S.x, S.y, ae);
          (ct(se.x, se.y, E.x, E.y, ae) || k && ct(se.x, se.y, k.x, k.y, ae)) && (ie === !0 || ie === "target") ? V = "target" : de && (ie === !0 || ie === "source") && (V = "source");
        }
        if (!V) {
          const se = (de) => {
            document.removeEventListener("pointerup", se), N(de);
          };
          document.addEventListener("pointerup", se, { once: !0 });
          return;
        }
        const z = T.clientX, X = T.clientY;
        let G = !1, Z = !1, D = null;
        const B = H._config?.connectionSnapRadius ?? 20;
        let J = null, q = null, F = null, ne = z, oe = X;
        const j = e.closest(".flow-container");
        if (!j) return;
        const W = V === "target" ? b : E, re = () => {
          G = !0, s.classList.add("flow-edge-reconnecting"), H._emit("reconnect-start", { edge: A, handleType: V }), Y("reconnect", `Reconnection drag started on edge "${A.id}" (${V} end)`), q = zt({
            connectionLineType: H._config?.connectionLineType,
            connectionLineStyle: H._config?.connectionLineStyle,
            connectionLine: H._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), J = q.svg;
          const se = H.screenToFlowPosition(z, X);
          q.update({
            fromX: W.x,
            fromY: W.y,
            toX: se.x,
            toY: se.y,
            source: A.source,
            sourceHandle: A.sourceHandle
          });
          const de = j.querySelector(".flow-viewport");
          de && de.appendChild(J), V === "target" && (H.pendingConnection = {
            source: A.source,
            sourceHandle: A.sourceHandle,
            position: se
          }), H._pendingReconnection = {
            edge: A,
            draggedEnd: V,
            anchorPosition: { ...W },
            position: se
          }, F = oo(j, H, ne, oe), V === "target" && un(j, A.source, A.sourceHandle ?? "source", H, A.id);
        }, O = (se) => {
          if (ne = se.clientX, oe = se.clientY, !G) {
            Math.sqrt(
              (se.clientX - z) ** 2 + (se.clientY - X) ** 2
            ) >= Bn && re();
            return;
          }
          const de = H.screenToFlowPosition(se.clientX, se.clientY), fe = dn({
            containerEl: j,
            handleType: V === "target" ? "target" : "source",
            excludeNodeId: V === "target" ? A.source : A.target,
            cursorFlowPos: de,
            connectionSnapRadius: B,
            getNode: (be) => H.getNode(be),
            toFlowPosition: (be, Ce) => H.screenToFlowPosition(be, Ce)
          });
          fe.element !== D && (D?.classList.remove("flow-handle-active"), fe.element?.classList.add("flow-handle-active"), D = fe.element), q?.update({
            fromX: W.x,
            fromY: W.y,
            toX: fe.position.x,
            toY: fe.position.y,
            source: A.source,
            sourceHandle: A.sourceHandle
          });
          const we = fe.position;
          V === "target" && H.pendingConnection && (H.pendingConnection = {
            ...H.pendingConnection,
            position: we
          }), H._pendingReconnection && (H._pendingReconnection = {
            ...H._pendingReconnection,
            position: we
          }), F?.updatePointer(se.clientX, se.clientY);
        }, ee = () => {
          Z || (Z = !0, document.removeEventListener("pointermove", O), document.removeEventListener("pointerup", ce), F?.stop(), F = null, q?.destroy(), q = null, J = null, D?.classList.remove("flow-handle-active"), M = null, s.classList.remove("flow-edge-reconnecting"), Pe(j), H.pendingConnection = null, H._pendingReconnection = null);
        }, ce = async (se) => {
          if (!G) {
            ee(), N(se);
            return;
          }
          if (H._connectValidating) return;
          let de = D, fe = null;
          if (!de) {
            fe = document.elementFromPoint(se.clientX, se.clientY);
            const Me = V === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            de = fe?.closest(Me);
          }
          const be = (de ? de.closest("[data-flow-node-id]") : fe?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Ce = de?.dataset.flowHandleId, ge = q?.svg ?? null;
          xt(ge, !0);
          let ve;
          try {
            ve = await Og({
              dropNodeId: be,
              dropHandleId: Ce,
              draggedEnd: V,
              edge: A,
              canvas: H,
              containerEl: j
            });
          } finally {
            xt(ge, !1);
          }
          ve.applied ? Y("reconnect", `Edge "${A.id}" reconnected (${V})`, ve.newConnection) : Y("reconnect", `Edge "${A.id}" reconnection cancelled — snapping back`, { reason: ve.reason }), H._emit("reconnect-end", { edge: A, successful: ve.applied }), ee();
        };
        document.addEventListener("pointermove", O), document.addEventListener("pointerup", ce), M = ee;
      };
      s.addEventListener("pointerdown", w);
      const v = (T) => {
        const A = o(n);
        if (!A) return;
        const H = t.$data(e.closest("[x-data]"));
        if (!H) return;
        const ae = H._config?.edgesReconnectable !== !1, le = A.reconnectable ?? !0;
        if (!ae || le === !1 || !b || !E) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const ie = H._config?.reconnectSnapRadius ?? Ji, V = H.screenToFlowPosition(T.clientX, T.clientY), z = (ct(V.x, V.y, b.x, b.y, ie) || S && ct(V.x, V.y, S.x, S.y, ie)) && (le === !0 || le === "source"), X = (ct(V.x, V.y, E.x, E.y, ie) || k && ct(V.x, V.y, k.x, k.y, ie)) && (le === !0 || le === "target");
        z || X ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", v);
      const I = (T) => {
        if (T.key !== "Enter" && T.key !== " ") return;
        T.preventDefault(), T.stopPropagation();
        const A = o(n);
        if (!A) return;
        const H = t.$data(e.closest("[x-data]"));
        H && (H._emit("edge-click", { edge: A, event: T }), pt(T, H._shortcuts?.multiSelect) ? H.selectedEdges.has(A.id) ? (H.selectedEdges.delete(A.id), A.selected = !1) : (H.selectedEdges.add(A.id), A.selected = !0) : (H.deselectAll(), H.selectedEdges.add(A.id), A.selected = !0), H._emitSelectionChange());
      };
      s.addEventListener("keydown", I);
      const L = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", L), s.addEventListener("blur", R);
      const U = (T) => {
        T.stopPropagation();
      };
      s.addEventListener("mousedown", U);
      const te = () => {
        for (const T of [c, d, u])
          T && T.classList.add("flow-edge-hovered");
      }, K = () => {
        for (const T of [c, d, u])
          T && T.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", te), s.addEventListener("mouseleave", K), i(() => {
        const T = o(n);
        if (!T || !a) return;
        s.setAttribute("data-flow-edge-id", T.id);
        const A = t.$data(e.closest("[x-data]"));
        if (!A?.nodes) return;
        const H = T.type ?? A._config?.defaultEdgeType ?? "bezier", ae = A._config?.edgeLod;
        let le = H;
        if (ae) {
          const Q = A._zoomLevel;
          (ae.simplifyAt === "medium" && Q === "medium" || Q === "far") && (le = "straight");
        }
        A._layoutAnimTick, A._edgeDirtyTicks?.get(T.id);
        const ie = A.getNode(T.source), V = A.getNode(T.target);
        if (!ie || !V) return;
        ie.sourcePosition, V.targetPosition;
        const z = kt(ie, A._nodeMap, A._config?.nodeOrigin), X = kt(V, A._nodeMap, A._config?.nodeOrigin), G = e.closest("[x-data]");
        let Z, D, B, J;
        const q = A._schemaMetrics, F = A._config?.nodeOrigin, ne = H !== "floating" && A._config?.schemaHandleGeometry !== "dom" && q && (!F || F[0] === 0 && F[1] === 0) ? Vg(
          ie,
          V,
          z,
          X,
          T.sourceHandle,
          T.targetHandle,
          A._nodeElements,
          q
        ) : null;
        if (H === "floating") {
          const Q = fa(z, X);
          Z = Q.sourcePos, D = Q.targetPos, B = { x: Q.sx, y: Q.sy, handleWidth: 0, handleHeight: 0 }, J = { x: Q.tx, y: Q.ty, handleWidth: 0, handleHeight: 0 }, b = { x: Q.sx, y: Q.sy }, E = { x: Q.tx, y: Q.ty };
        } else if (ne)
          Z = ne.sourcePos, D = ne.targetPos, B = ne.srcMeasurement, J = ne.tgtMeasurement, b = { x: B.x, y: B.y }, E = { x: J.x, y: J.y };
        else {
          const Q = A._nodeElements?.get(T.source) ?? G.querySelector(`[data-flow-node-id="${CSS.escape(T.source)}"]`), ue = A._nodeElements?.get(T.target) ?? G.querySelector(`[data-flow-node-id="${CSS.escape(T.target)}"]`), me = Q ? Is(Q.getBoundingClientRect()) : void 0, ye = ue ? Is(ue.getBoundingClientRect()) : void 0;
          Z = fo(G, T.source, T.sourceHandle, "source", ie, ye, Q), D = fo(G, T.target, T.targetHandle, "target", V, me, ue);
          const he = t.raw(A).viewport ?? { x: 0, y: 0, zoom: 1 }, pe = he.zoom || 1, Se = ie.rotation, Le = V.rotation;
          Z = $s(Z, Se), D = $s(D, Le), B = Fs(G, T.source, z, T.sourceHandle, "source", pe, he, ye, Q), J = Fs(G, T.target, X, T.targetHandle, "target", pe, he, me, ue);
          const Ae = jt(z, Z, A._shapeRegistry, A._config?.nodeOrigin), Te = jt(X, D, A._shapeRegistry, A._config?.nodeOrigin);
          b = B ?? Ae, E = J ?? Te;
        }
        const oe = Dt(B ?? b, Z, B, T.markerStart), j = Dt(J ?? E, D, J, T.markerEnd);
        S = oe, k = j;
        let W;
        if (H === "orthogonal" || H === "avoidant")
          if (A._config?.avoidantSimplifyOnDrag !== !1 && (A._draggingNodeIds?.has(T.source) || A._draggingNodeIds?.has(T.target)))
            W = void 0;
          else {
            const ue = t.raw(A._obstacleSnapshot);
            if (ue)
              W = ue.filter((me) => me.id !== T.source && me.id !== T.target);
            else {
              const me = t.raw(A.nodes), ye = new Map(me.map((pe) => [pe.id, pe])), he = A._config?.nodeOrigin;
              W = me.filter((pe) => pe.id !== T.source && pe.id !== T.target).map((pe) => {
                const Se = kt(pe, ye, he);
                return {
                  x: Se.position.x,
                  y: Se.position.y,
                  width: Se.dimensions?.width ?? _e,
                  height: Se.dimensions?.height ?? Ee
                };
              });
            }
          }
        const re = le === H ? T : { ...T, type: le }, { path: O, labelPosition: ee } = co(re, z, X, Z, D, oe, j, A._config?.edgeTypes, W, A._shapeRegistry, A._config?.nodeOrigin, A._config?.defaultEdgeType);
        a.setAttribute("d", O), l.setAttribute("d", O), (H === "orthogonal" || H === "avoidant") && t.raw(A._edgeCorridors)?.set(T.id, {
          minX: Math.min(oe.x, j.x),
          minY: Math.min(oe.y, j.y),
          maxX: Math.max(oe.x, j.x),
          maxY: Math.max(oe.y, j.y)
        });
        const ce = H === "editable", se = ce && (T.showControlPoints || T.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((Q) => Q.remove()), se) {
          const Q = T.controlPoints ?? [], ue = A.viewport?.zoom ?? 1, me = 6 / ue, ye = 5 / ue, he = b ?? { x: 0, y: 0 }, pe = E ?? { x: 0, y: 0 }, Se = [he, ...Q, pe], Le = Se.length - 1, Ae = a.getTotalLength?.() ?? 0;
          if (Ae > 0) {
            const Te = [0], ze = 200;
            let De = 1;
            for (let qe = 1; qe <= ze && De < Se.length; qe++) {
              const kn = qe / ze * Ae, Gt = a.getPointAtLength(kn), Ue = Se[De], Kt = Gt.x - Ue.x, Ni = Gt.y - Ue.y;
              Kt * Kt + Ni * Ni < 25 && (Te.push(kn), De++);
            }
            for (; Te.length <= Le; )
              Te.push(Ae);
            for (let qe = 0; qe < Le; qe++) {
              const kn = (Te[qe] + Te[qe + 1]) / 2, Gt = a.getPointAtLength(kn), Ue = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              Ue.classList.add("flow-edge-midpoint"), Ue.setAttribute("cx", String(Gt.x)), Ue.setAttribute("cy", String(Gt.y)), Ue.setAttribute("r", String(ye)), Ue.dataset.segmentIndex = String(qe);
              const Kt = document.createElementNS("http://www.w3.org/2000/svg", "title");
              Kt.textContent = "Double-click to add control point", Ue.appendChild(Kt), s.appendChild(Ue);
            }
          }
          for (let Te = 0; Te < Q.length; Te++) {
            const ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ze.classList.add("flow-edge-control-point"), ze.setAttribute("cx", String(Q[Te].x)), ze.setAttribute("cy", String(Q[Te].y)), ze.setAttribute("r", String(me)), ze.dataset.pointIndex = String(Te), s.appendChild(ze);
          }
        }
        if (l.style.cursor = ce ? "crosshair" : "pointer", l.style.strokeWidth = String(
          T.interactionWidth ?? A._config?.defaultInteractionWidth ?? 20
        ), T.markerStart != null) {
          const Q = Ft(T.markerStart), ue = Ot(Q, A._id);
          a.setAttribute("marker-start", `url(#${ue})`);
        } else if (T._renderDualMarker && T.markerEnd) {
          const Q = Ft(T.markerEnd), ue = Ot(Q, A._id);
          a.setAttribute("marker-start", `url(#${ue})`);
        } else
          a.removeAttribute("marker-start");
        if (T.markerEnd) {
          const Q = Ft(T.markerEnd), ue = Ot(Q, A._id);
          a.setAttribute("marker-end", `url(#${ue})`);
        } else
          a.removeAttribute("marker-end");
        const de = T.strokeWidth ?? 1.5, fe = zg(T.animated);
        switch (fe !== g && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), g === "dot" && P(), g = fe), fe) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            x(s, O, G, T, T.animationDuration);
            break;
        }
        if (T.animationDuration && fe !== "none" ? (fe === "dash" || fe === "pulse") && (a.style.animationDuration = T.animationDuration) : (fe === "dash" || fe === "pulse") && a.style.removeProperty("animation-duration"), m && m !== T.class && s.classList.remove(...m.split(" ").filter(Boolean)), T.class) {
          const Q = fe === "dash" ? " flow-edge-animated" : fe === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", T.class + Q), s.classList.add(...T.class.split(" ").filter(Boolean)), m = T.class;
        } else
          m && (s.classList.remove(...m.split(" ").filter(Boolean)), m = null);
        if (s.setAttribute("aria-selected", String(!!T.selected)), T.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(de + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + wn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(de);
          const Q = A._markerDefsEl?.querySelector("defs") ?? null;
          if (ha(T.color)) {
            if (Q) {
              const ue = ga(A._id, T.id), me = T.gradientDirection === "target-source", ye = b.x, he = b.y, pe = E.x, Se = E.y;
              pa(
                Q,
                ue,
                me ? { from: T.color.to, to: T.color.from } : T.color,
                ye,
                he,
                pe,
                Se
              ), a.style.stroke = `url(#${ue})`, y = ue;
            }
          } else if (T.color) {
            if (y) {
              const ue = Q;
              ue && No(ue, y), y = null;
            }
            a.style.stroke = T.color;
          } else {
            if (y) {
              const ue = Q;
              ue && No(ue, y), y = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (!T.selected && ((T.sourceHandle ? A.selectedRows?.has(T.sourceHandle.replace(/-[lr]$/, "")) : !1) || (T.targetHandle ? A.selectedRows?.has(T.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), T.selected || (a.style.strokeWidth = String(Math.max(de + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), T.focusable ?? A._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", T.ariaRole ?? "group"), s.setAttribute("aria-label", T.ariaLabel ?? (T.label ? `Edge: ${T.label}` : `Edge from ${T.source} to ${T.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), T.domAttributes)
          for (const [Q, ue] of Object.entries(T.domAttributes))
            Q.startsWith("on") || Fg.has(Q.toLowerCase()) || s.setAttribute(Q, ue);
        const Ce = (Q, ue, me, ye, he) => {
          if (ue) {
            if (!Q && ye) {
              const pe = me.includes("flow-edge-label-start"), Se = me.includes("flow-edge-label-end");
              let Le = `[data-flow-edge-id="${he}"].flow-edge-label`;
              pe ? Le += ".flow-edge-label-start" : Se ? Le += ".flow-edge-label-end" : Le += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", Q = ye.querySelector(Le);
            }
            return Q || (Q = document.createElement("div"), Q.className = me, Q.dataset.flowEdgeId = he, ye && ye.appendChild(Q)), Q.textContent = ue, Q;
          }
          return Q && Q.remove(), null;
        }, ge = e.closest(".flow-viewport"), ve = T.labelVisibility ?? "always", Me = () => {
          const Q = a.getAttribute("d") ?? "";
          return Q !== f && (f = Q, h = typeof a.getTotalLength == "function" && a.getTotalLength() || 0), h;
        };
        if (c = Ce(c, T.label, "flow-edge-label", ge, T.id), c) {
          const Q = Me();
          if (Q > 0) {
            const ue = T.labelPosition ?? 0.5, me = Bg(a, ue, Q);
            c.style.left = `${me.x}px`, c.style.top = `${me.y}px`;
          } else
            c.style.left = `${ee.x}px`, c.style.top = `${ee.y}px`;
        }
        if (d = Ce(d, T.labelStart, "flow-edge-label flow-edge-label-start", ge, T.id), d) {
          const Q = Me();
          if (Q > 0) {
            const ue = T.labelStartOffset ?? 30, me = a.getPointAtLength(Math.min(ue, Q / 2));
            d.style.left = `${me.x}px`, d.style.top = `${me.y}px`;
          }
        }
        if (u = Ce(u, T.labelEnd, "flow-edge-label flow-edge-label-end", ge, T.id), u) {
          const Q = Me();
          if (Q > 0) {
            const ue = T.labelEndOffset ?? 30, me = a.getPointAtLength(Math.max(Q - ue, Q / 2));
            u.style.left = `${me.x}px`, u.style.top = `${me.y}px`;
          }
        }
        for (const Q of [c, d, u])
          Q && (Q.classList.toggle("flow-edge-label-hover", ve === "hover"), Q.classList.toggle("flow-edge-label-on-select", ve === "selected"), Q.classList.toggle("flow-edge-label-selected", !!T.selected), T.class ? Q.classList.add(...T.class.split(" ").filter(Boolean)) : m && Q.classList.remove(...m.split(" ").filter(Boolean)));
      }), r(() => {
        if (y) {
          const A = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          A && No(A, y);
        }
        M?.(), P(), s.removeEventListener("contextmenu", _), s.removeEventListener("dblclick", C), s.removeEventListener("pointerdown", $, !0), s.removeEventListener("pointerdown", w), s.removeEventListener("pointermove", v), s.removeEventListener("keydown", I), s.removeEventListener("focus", L), s.removeEventListener("blur", R), s.removeEventListener("mousedown", U), s.removeEventListener("mouseenter", te), s.removeEventListener("mouseleave", K), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Xg(t, e) {
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
        const a = typeof l == "string" ? vn(l) : l;
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
        const s = kt(i, t._nodeMap, t._config.nodeOrigin), l = kt(r, t._nodeMap, t._config.nodeOrigin);
        let a, c, d, u;
        if (o.type === "floating") {
          const h = fa(s, l);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const p = Dt(d, h.sourcePos, null, o.markerStart), g = Dt(u, h.targetPos, null, o.markerEnd), y = co(o, s, l, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const E = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), S = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (E) {
              const k = E.getBoundingClientRect();
              p = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
            if (S) {
              const k = S.getBoundingClientRect();
              g = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
          }
          const y = h ? fo(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", m = h ? fo(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = jt(s, y, t._shapeRegistry, t._config.nodeOrigin), u = jt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const x = Dt(d, y, null, o.markerStart), P = Dt(u, m, null, o.markerEnd), b = co(o, s, l, y, m, x, P, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = b.path, c = b.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", a);
          const p = f.parentElement?.querySelector("path:first-child");
          p && p !== f && p.setAttribute("d", a);
        }
        if (ha(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = ga(t._id, o.id), g = o.gradientDirection === "target-source";
            pa(
              h,
              p,
              g ? { from: o.color.to, to: o.color.from } : o.color,
              d.x,
              d.y,
              u.x,
              u.y
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
          if (o.labelStart && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-start`
            );
            if (h) {
              const p = f.getTotalLength(), g = o.labelStartOffset ?? 30, y = f.getPointAtLength(Math.min(g, p / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
          if (o.labelEnd && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const p = f.getTotalLength(), g = o.labelEndOffset ?? 30, y = f.getPointAtLength(Math.max(p - g, p / 2));
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
function Wg(t) {
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
              Nr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = ta(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let jg = 0;
function Ug(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Zg(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
function Gg(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++jg}`,
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
      _shapeRegistry: { ...ea, ...e.shapeTypes },
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
      /**
       * Cached header/row/handle geometry for `x-flow-schema` nodes, measured
       * once by the first schema node's `render()` (see flow-schema.ts). Plain
       * (non-reactive) field. `Alpine.raw(canvas)` does NOT unwrap Alpine's
       * merge-scope proxy, so a GET/SET through it still tracks/triggers the
       * underlying reactive object inside an active effect — this field is
       * safe only because flow-schema.ts reads and writes it OUTSIDE the
       * directive's `effect()` (deferred via `Alpine.nextTick`), not because of
       * `Alpine.raw()` itself. Invalidate (set `null`) on any theme/colorMode
       * change, same contract as `_bgGapCache` above.
       */
      _schemaMetrics: null,
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
        const l = this.viewport.zoom, a = this.viewport.x, c = this.viewport.y, d = [], u = [], f = [];
        for (const h of s) {
          const p = h.gap * l, g = h.variant === "cross" ? p / 2 : p;
          d.push(Ug(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${g}px ${g}px, ${g}px ${g}px`), f.push(`${a}px ${c}px, ${a}px ${c}px`)) : (u.push(`${p}px ${p}px`), f.push(`${a}px ${c}px`));
        }
        return {
          backgroundImage: d.join(", "),
          backgroundSize: u.join(", "),
          backgroundPosition: f.join(", ")
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
      _shortcuts: Df(e.keyboardShortcuts),
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
      /**
       * Reactive parent-id → child-ids index, reconciled in `_rebuildNodeMap`.
       * Lets each node effect ask "do I have children?" via an O(1) keyed lookup
       * instead of scanning the whole nodes array (which subscribed every node
       * effect to the entire array — O(N²) on any array change).
       */
      _childrenIds: /* @__PURE__ */ new Map(),
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
      _computeEngine: new uh(),
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
      // ── Shared obstacle cache (Workstream C) ─────────────────────────────
      /** Spatial index of node id → flow-space rect cells (committed geometry). Non-reactive: operate on it via `Alpine.raw(canvas._spatialGrid)` (raw the NESTED property — `Alpine.raw(canvas)` does NOT unwrap Alpine's merge-scope proxy; see flow-edge.ts). Also maintained for the viewport-culling overhaul (WS E), which will consume it — do not delete as dead code even though only WS C currently reads it. */
      _spatialGrid: new qu(),
      /** Obstacle rects rebuilt once per commit. In the edge effect read it via `Alpine.raw(canvas._obstacleSnapshot)` (nested-raw) so the edge does NOT subscribe to every node's reactive state. */
      _obstacleSnapshot: null,
      /** Reactive epoch bumped by _commitNodeGeometry (internal signal; edges must NOT subscribe to it). Reserved for the interaction-degradation/LOD workstream (WS D), which will consume it — do not delete as dead code even though only WS C currently reads it. */
      _obstacleEpoch: 0,
      /** REACTIVE Map edge id → tick. Edge effects read key-scoped `.get(edge.id)`; bumped by _markDirtyEdges. */
      _edgeDirtyTicks: /* @__PURE__ */ new Map(),
      /** PLAIN Map edge id → endpoint-bbox corridor {minX,minY,maxX,maxY}. Written by edges post-route; read via Alpine.raw. */
      _edgeCorridors: /* @__PURE__ */ new Map(),
      // ── Interaction degradation (Workstream D) ───────────────────────────
      /** REACTIVE Set of node ids currently being dragged. Edge effects read
       * key-scoped `.has(edge.source)` / `.has(edge.target)`, so ONLY edges
       * touching a dragged node re-run when the set changes. Populated in
       * flow-node `onDragStart` (incl. group-drag members), cleared on drag end.
       * Drives `avoidantSimplifyOnDrag` bezier degradation. */
      _draggingNodeIds: /* @__PURE__ */ new Set(),
      // ── Auto-Layout ──────────────────────────────────────────────────
      _autoLayoutTimer: null,
      _autoLayoutReady: !1,
      _autoLayoutFailed: !1,
      // ── Viewport Culling (CSS-only, outside Alpine reactive system) ────
      _nodeElements: /* @__PURE__ */ new Map(),
      _edgeSvgElements: /* @__PURE__ */ new Map(),
      _visibleNodeIds: /* @__PURE__ */ new Set(),
      /** PLAIN Set of edge ids currently culled (display:none). Used to gate display writes to visibility transitions only. */
      _culledEdgeIds: /* @__PURE__ */ new Set(),
      /** Whether `_applyCulling` was active on the previous call — used to detect threshold-crossing-down / config-off so `_uncullEverything` can restore display exactly once. */
      _cullingWasActive: !1,
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
        s !== "viewport-change" && s !== "viewport-move" && Y("event", s, l);
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
        this._nodeMap = Kr(this.nodes), Jf(this._childrenIds, this.nodes);
      },
      _rebuildEdgeMap() {
        this._edgeMap = new Map(this.edges.map((s) => [s.id, s]));
      },
      /**
       * Rebuild the shared obstacle snapshot + SpatialGrid from committed node
       * geometry. Called imperatively at discrete geometry commit points (drag
       * end, resize, add/remove nodes, undo/redo, restore) — never inside a
       * reactive effect.
       *
       * `Alpine.raw(this)` does NOT unwrap Alpine's merge-scope proxy (it returns
       * the same proxy back), so reads go through the NESTED reactive property
       * instead — `Alpine.raw(this.nodes)` and `Alpine.raw(this._spatialGrid)` —
       * mirroring the precedent in flow-edge.ts's obstacle-rect computation.
       * The parent-lookup map is rebuilt from those raw nodes rather than reusing
       * `_nodeMap`, whose stored node values would still be reactive proxies even
       * once the Map container is raw. Rebuilds the grid from scratch each commit
       * (O(nodes); commit points are discrete user actions, not frames), which
       * also prunes entries for removed/hidden nodes.
       */
      _commitNodeGeometry(s) {
        const l = t.raw(this._obstacleSnapshot), a = l ? l.slice() : null, c = t.raw(this.nodes), d = new Map(c.map((p) => [p.id, p])), u = this._config?.nodeOrigin, f = t.raw(this._spatialGrid);
        f.clear();
        const h = [];
        for (const p of c) {
          const g = kt(p, d, u), y = {
            id: p.id,
            x: g.position.x,
            y: g.position.y,
            width: g.dimensions?.width ?? _e,
            height: g.dimensions?.height ?? Ee
          };
          f.insert(p.id, y.x, y.y, y.width, y.height), !p.hidden && h.push(y);
        }
        l ? (l.length = 0, l.push(...h)) : this._obstacleSnapshot = h, this._obstacleEpoch++, this._markDirtyEdges(s, a);
      },
      /**
       * Dirty exactly the edges whose ROUTE could have changed as a result of
       * `changedNodeIds` moving/resizing — instead of every avoidant/orthogonal
       * edge re-routing on every geometry commit.
       *
       * An edge is dirtied when either:
       *  - it directly touches a changed node (source or target), or
       *  - a changed node's rect (new OR old — see prevSnapshot) intersects
       *    that edge's last-recorded corridor, expanded by `CORRIDOR_MARGIN`.
       *    This mirrors `corridorObstacles()` in orthogonal.ts exactly: an
       *    obstacle outside endpoint-bbox±CORRIDOR_MARGIN is pruned by the
       *    router itself, so it provably cannot change that edge's route.
       *
       * Edges with no recorded corridor yet (never routed, or non-obstacle
       * edge types that never write one) are dirtied conservatively so routes
       * never go stale.
       *
       * `_edgeDirtyTicks` is bumped via `.set()` on the REACTIVE map (`this`,
       * not raw) so edge effects reading `_edgeDirtyTicks.get(edge.id)` are
       * notified; all other reads here go through nested-`Alpine.raw()` so
       * this method does not itself subscribe to node/edge state.
       */
      _markDirtyEdges(s, l) {
        const a = this._edgeDirtyTicks, c = t.raw(a), d = t.raw(this.edges), u = t.raw(this._edgeCorridors), f = t.raw(this._obstacleSnapshot), h = (y) => {
          a.set(y, (c.get(y) ?? 0) + 1);
        };
        if (!s || s.length === 0) {
          const y = /* @__PURE__ */ new Set();
          for (const m of d)
            y.add(m.id), h(m.id);
          for (const m of [...c.keys()])
            y.has(m) || c.delete(m);
          for (const m of [...u.keys()])
            y.has(m) || u.delete(m);
          return;
        }
        const p = new Set(s), g = [];
        for (const y of p) {
          const m = f?.find((P) => P.id === y);
          m && g.push(m);
          const x = l?.find((P) => P.id === y);
          x && g.push(x);
        }
        for (const y of d) {
          let m = p.has(y.source) || p.has(y.target);
          if (!m) {
            const x = u.get(y.id);
            if (x) {
              for (const P of g)
                if (P.x < x.maxX + gt && P.x + P.width > x.minX - gt && P.y < x.maxY + gt && P.y + P.height > x.minY - gt) {
                  m = !0;
                  break;
                }
            } else
              m = !0;
          }
          m && h(y.id);
        }
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
       * Writes are gated to visibility TRANSITIONS only (comparing against the
       * previous frame's `_visibleNodeIds`/`_culledEdgeIds`) to avoid unconditional
       * per-frame style writes, which devtools amplifies into mutation-record churn.
       */
      _applyCulling() {
        const s = e.viewportCulling ?? "auto";
        if (!(s === !0 || s === "auto" && this.nodes.length >= (e.cullingAutoThreshold ?? 150))) {
          this._cullingWasActive && this._uncullEverything();
          return;
        }
        if (this._cullingWasActive = !0, !this._container) return;
        const a = this._container.clientWidth, c = this._container.clientHeight;
        if (a === 0 || c === 0) return;
        const d = e.cullingBuffer ?? 100, u = Bu(this.viewport, a, c, d), h = t.raw(this._spatialGrid).query(u), p = this._draggingNodeIds, g = /* @__PURE__ */ new Set(), y = (P) => {
          const b = this._nodeMap.get(P);
          if (!b || b.hidden) return;
          const E = b.dimensions?.width ?? 150, S = b.dimensions?.height ?? 50, k = b.parentId ? ei(b, this._nodeMap, this._config.nodeOrigin) : b.position;
          !(k.x + E < u.minX || k.x > u.maxX || k.y + S < u.minY || k.y > u.maxY) && g.add(P);
        };
        for (const P of h) y(P);
        if (p)
          for (const P of p)
            h.has(P) || y(P);
        for (const [P, b] of this._nodeElements) {
          const E = g.has(P) ? "" : "none";
          b.style.display !== E && (b.style.display = E);
        }
        const m = this._culledEdgeIds, x = /* @__PURE__ */ new Set();
        for (const [P, b] of this._edgeSvgElements) {
          const E = this._edgeMap.get(P);
          if (!E) continue;
          const S = this._nodeMap.get(E.source)?.hidden, k = this._nodeMap.get(E.target)?.hidden;
          if (E.hidden || E._hiddenByCollapse || S || k)
            continue;
          const N = g.has(E.source) || g.has(E.target) || Zg(this._edgeCorridors.get(P), u), _ = !m.has(P);
          N !== _ && (b.style.display = N ? "" : "none"), N || x.add(P);
        }
        this._visibleNodeIds = g, this._culledEdgeIds = x;
      },
      /**
       * Restore CSS display on every element culling could have hidden and
       * reset the tracking sets, so a future re-activation of `_applyCulling`
       * starts clean. Called when the `viewportCulling: 'auto'` gate
       * deactivates (node count drops back below `cullingAutoThreshold`) after
       * having been active, or when culling is otherwise turned off.
       */
      _uncullEverything() {
        for (const s of this._nodeElements.values()) s.style.display = "";
        for (const s of this._culledEdgeIds) {
          const l = this._edgeSvgElements.get(s);
          l && (l.style.display = "");
        }
        this._visibleNodeIds = /* @__PURE__ */ new Set(), this._culledEdgeIds = /* @__PURE__ */ new Set(), this._cullingWasActive = !1;
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
        return l ? ei(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Nr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new tf(Qn), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = ta(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Pt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new ju(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new dh(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = It("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new a(), p = new c(h), g = new d(h, this, f.provider), y = new u(p, f.user);
          if (He.set(l, { bridge: g, awareness: y, doc: h }), f.provider.connect(h, p), f.cursors !== !1) {
            let m = !1;
            const x = f.throttle ?? 20, P = (S) => {
              if (m) return;
              m = !0;
              const k = l.getBoundingClientRect(), N = this._viewportLive ?? this.viewport, _ = (S.clientX - k.left - N.x) / N.zoom, C = (S.clientY - k.top - N.y) / N.zoom;
              y.updateCursor({ x: _, y: C }), setTimeout(() => {
                m = !1;
              }, x);
            }, b = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", P), l.addEventListener("mouseleave", b);
            const E = He.get(l);
            E.cursorCleanup = () => {
              l.removeEventListener("mousemove", P), l.removeEventListener("mouseleave", b);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (Y("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Fu(this._container, {
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
        }), this._bgGapCache = null, this._schemaMetrics = null, this._applyBackground(), this.$store.flow.register(this._id, this), this._onContainerPointerDown = () => {
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
              const d = this.nodes.filter((u) => this.selectedNodes.has(u.id));
              this._emit("selection-context-menu", { nodes: d, event: a });
            } else {
              const d = this.screenToFlowPosition(a.clientX, a.clientY);
              this._emit("pane-context-menu", { event: a, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = Hf(
          this._container,
          (a) => {
            const c = a.target;
            if (s === "context-menu") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const f = d.getAttribute("data-flow-node-id"), h = this._nodeMap.get(f);
                if (h) {
                  this._emit("node-context-menu", { node: h, event: a });
                  return;
                }
              }
              const u = c.closest(".flow-edge-svg");
              if (u) {
                const f = u.getAttribute("data-edge-id"), h = f ? this._edgeMap.get(f) : void 0;
                if (h) {
                  this._emit("edge-context-menu", { edge: h, event: a });
                  return;
                }
              }
              if (this.selectedNodes.size > 1) {
                const f = this.nodes.filter((h) => this.selectedNodes.has(h.id));
                this._emit("selection-context-menu", { nodes: f, event: a });
              } else {
                const f = this.screenToFlowPosition(a.clientX, a.clientY);
                this._emit("pane-context-menu", { event: a, position: f });
              }
            } else if (s === "select") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const u = d.getAttribute("data-flow-node-id");
                this.selectedNodes.has(u) ? this.selectedNodes.delete(u) : this.selectedNodes.add(u);
              }
            }
          },
          { duration: e.longPressDuration ?? 500 }
        )), e.touchSelectionMode !== !1) {
          let a = 0, c = 0;
          const d = (g) => {
            g.pointerType === "touch" && (c++, c === 2 && Date.now() - a < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), a = Date.now());
          }, u = (g) => {
            g.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (a = 0));
          }, f = this._container;
          if (!f) return;
          f.addEventListener("pointerdown", d), f.addEventListener("pointerup", u), f.addEventListener("pointercancel", u);
          const h = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", h);
          const p = document.createElement("div");
          p.className = "flow-touch-selection-mode-indicator", p.textContent = "Selection Mode — tap with two fingers to exit", f.appendChild(p), this._touchSelectionCleanup = () => {
            f.removeEventListener("pointerdown", d), f.removeEventListener("pointerup", u), f.removeEventListener("pointercancel", u), document.removeEventListener("visibilitychange", h), p.remove();
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
          if (Ze(s.key, a.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Ze(s.key, a.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container);
            return;
          }
          if (Ze(s.key, a.delete)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (Ze(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Ze(s.key, a.moveNodes)) {
            if (l === "INPUT" || l === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = pt(s, a.moveStepModifier) ? a.moveStep * a.moveStepMultiplier : a.moveStep;
            let d = 0, u = 0;
            switch (s.key) {
              case "ArrowUp":
                u = -c;
                break;
              case "ArrowDown":
                u = c;
                break;
              case "ArrowLeft":
                d = -c;
                break;
              case "ArrowRight":
                d = c;
                break;
              default: {
                const f = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, p = f.findIndex((g) => (g.length === 1 ? g.toLowerCase() : g) === h);
                p === 0 ? u = -c : p === 1 ? u = c : p === 2 ? d = -c : p === 3 && (d = c);
              }
            }
            Rf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && qr(h)) {
                h.position.x += d, h.position.y += u;
                const p = this._container ? He.get(this._container) : void 0;
                p?.bridge && p.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Ze(s.key, a.undo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Ze(s.key, a.redo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            Ze(s.key, a.copy) ? (s.preventDefault(), this.copy()) : Ze(s.key, a.paste) ? (s.preventDefault(), this.paste()) : Ze(s.key, a.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = sf(this._container, {
          getState: () => ({
            nodes: ro(this.nodes, this._nodeMap, this._config.nodeOrigin),
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
          this._controls = ff(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Zo }),
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
        this._selectionBox = hf(this._container), this._lasso = gf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !pt(s, this._shortcuts.selectionBox))
            return;
          const l = s.target;
          if (l !== this._container && !l.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const a = this._config.selectionMode ?? "partial", c = pt(s, this._shortcuts.selectionModeToggle);
          if (this._selectionEffectiveMode = c ? a === "partial" ? "full" : "partial" : a, !this._container) return;
          const d = this._container.getBoundingClientRect(), u = s.clientX - d.left, f = s.clientY - d.top;
          this._selectionTool === "lasso" ? this._lasso.start(u, f, this._selectionEffectiveMode) : this._selectionBox.start(u, f, this._selectionEffectiveMode), s.target.setPointerCapture(s.pointerId);
        }, this._onSelectionPointerMove = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive()) || !this._container) return;
          const a = this._container.getBoundingClientRect(), c = s.clientX - a.left, d = s.clientY - a.top;
          this._selectionTool === "lasso" ? this._lasso.update(c, d) : this._selectionBox.update(c, d);
        }, this._onSelectionPointerUp = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive())) return;
          s.target.releasePointerCapture(s.pointerId), this._suppressNextCanvasClick = !0;
          const a = ro(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? wf(a, u) : yf(a, u), h = new Set(f.map((p) => p.id));
            if (c = this.nodes.filter((p) => h.has(p.id)), this._config.lassoSelectsEdges)
              for (const p of this.edges) {
                if (p.hidden) continue;
                const g = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(p.id)}"] path`
                );
                if (!g) continue;
                const y = g.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let x = 0;
                for (let b = 0; b <= m; b++) {
                  const E = g.getPointAtLength(b / m * y);
                  bi(E.x, E.y, u) && x++;
                }
                (this._selectionEffectiveMode === "full" ? x === m + 1 : x > 0) && d.push(p.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Vu(a, u, this._config.nodeOrigin) : zu(a, u, this._config.nodeOrigin), h = new Set(f.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!Jo(u) || u.hidden) continue;
            u.selected = !0, this.selectedNodes.add(u.id);
            const f = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(u.id)}"]`);
            f && f.classList.add("flow-node-selected");
          }
          for (const u of d) {
            const f = this.getEdge(u);
            f && (f.selected = !0, this.selectedEdges.add(f.id));
          }
          (c.length > 0 || d.length > 0) && this._emitSelectionChange(), this._selectionShiftHeld = !1;
        }, this._container.addEventListener("pointerdown", this._onSelectionPointerDown), this._container.addEventListener("pointermove", this._onSelectionPointerMove), this._container.addEventListener("pointerup", this._onSelectionPointerUp);
      },
      /** Drop zone drag/drop handlers if onDrop configured. */
      _initDropZone() {
        if (e.onDrop) {
          const s = e.dropMimeTypes ?? ["application/alpineflow"], l = (a, c) => {
            const d = document.elementsFromPoint(a, c);
            for (const u of d) {
              const f = u.closest?.("[data-flow-node-id]");
              if (!f)
                continue;
              const h = f.getAttribute("data-flow-node-id");
              if (!h)
                continue;
              const p = this._nodeMap.get(h);
              if (p)
                return p;
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
            for (const g of s) {
              const y = a.dataTransfer.getData(g);
              if (y) {
                c = g, d = y;
                break;
              }
            }
            if (!c || !d)
              return;
            let u;
            try {
              u = JSON.parse(d);
            } catch {
              u = d;
            }
            if (!this._container)
              return;
            const f = Tr(
              a.clientX,
              a.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = l(a.clientX, a.clientY), p = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c });
            p && this.addNodes(p, { center: !0 });
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
          const u = d.getAttribute("data-flow-node-id");
          if (!u)
            continue;
          const f = this._nodeMap.get(u);
          if (f)
            return f;
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
          const u = t.watch(
            () => s.childLayout?.[d],
            () => {
              this._layoutDedup?.safeLayoutChildren(a);
            }
          );
          c.push(u);
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
          const l = /* @__PURE__ */ new Set();
          for (const a of s) {
            const c = a.target, d = c.getAttribute("data-flow-node-id");
            if (!d) continue;
            const u = this._nodeMap.get(d);
            if (!u) continue;
            const f = a.borderBoxSize?.[0], h = f ? f.inlineSize : c.offsetWidth, p = f ? f.blockSize : c.offsetHeight;
            if (h === 0 && p === 0 || c.offsetParent === null && c.tagName !== "BODY" || u.fixedDimensions === !0) continue;
            const g = Math.round(h), y = Math.round(p), m = u.dimensions;
            if (m && Math.abs((m.width ?? 0) - g) < 1 && Math.abs((m.height ?? 0) - y) < 1)
              continue;
            const x = Sh(
              { width: g, height: y },
              u.minDimensions,
              u.maxDimensions
            );
            u.dimensions = x, l.add(d), u.parentId && this._layoutDedup?.safeLayoutChildren(u.parentId);
          }
          l.size > 0 && this._commitNodeGeometry([...l]);
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = Eh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && _h(e, s, e.wireEvents);
          const l = bh(this, s), a = ph(this, s);
          this._wireCleanup = () => {
            l(), a();
          }, Y("init", `wire bridge activated for "${this._id}"`);
        }
        Y("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
        for (const s of this.nodes)
          s.childLayout && this._installChildLayoutWatchers(s);
        for (const s of this.nodes)
          s.childLayout && !s.parentId && this.layoutChildren(s.id);
        for (const s of this.nodes)
          s.childLayout && s.parentId && (this._nodeMap.get(s.parentId)?.childLayout || this.layoutChildren(s.id));
        e.fitViewOnInit && requestAnimationFrame(() => {
          this.fitView();
        }), this._commitNodeGeometry();
      },
      /** Call setup(canvas) on any addon that provides it. */
      _initAddons() {
        for (const [, s] of na().entries())
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
          c && It(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${a[s]})`);
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
          const u = document.createElement("div");
          u.className = "flow-loading-indicator-node";
          const f = document.createElement("div");
          f.className = "flow-loading-indicator-text", f.textContent = this._loadingText, d.appendChild(u), d.appendChild(f), c.appendChild(d), this._container.appendChild(c), this._autoLoadingOverlay = c;
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
          for (const u of [d.markerStart, d.markerEnd]) {
            if (!u) continue;
            const f = Ft(u), h = Ot(f, this._id);
            l.has(h) || l.set(h, to(f, h));
          }
        const a = s.querySelectorAll("marker"), c = /* @__PURE__ */ new Set();
        a.forEach((d) => {
          l.has(d.id) ? c.add(d.id) : d.remove();
        });
        for (const [d, u] of l)
          if (!c.has(d)) {
            const h = new DOMParser().parseFromString(
              `<svg xmlns="http://www.w3.org/2000/svg">${u}</svg>`,
              "image/svg+xml"
            ).querySelector("marker");
            h && s.appendChild(document.importNode(h, !0));
          }
      },
      destroy() {
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), Y("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
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
          const s = He.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), He.delete(this._container));
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
        return this._layoutDedup ? Ch(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? He.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => Em));
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
      Mh(i),
      Th(i),
      Ah(i),
      Dh(i),
      Hh(i),
      fg(i),
      pg(i),
      mg(i),
      yg(i),
      kg(i),
      Lg(i),
      Pg(i),
      Xg(i, t),
      Wg(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      nf(s, l);
    }, n;
  });
}
function Os(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Kg(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(x) {
    const P = s();
    return {
      x: (x.x - P.x) / P.zoom,
      y: (x.y - P.y) / P.zoom
    };
  }
  const y = Ye(t), m = yc().subject(() => {
    const x = s(), P = l();
    return {
      x: P.x * x.zoom + x.x,
      y: P.y * x.zoom + x.y
    };
  }).on("start", (x) => {
    p = g(x), o?.({ nodeId: e, position: p, sourceEvent: x.sourceEvent });
  }).on("drag", (x) => {
    let P = g(x);
    a && (P = Os(P, a));
    const b = {
      x: P.x - p.x,
      y: P.y - p.y
    };
    i?.({ nodeId: e, position: P, delta: b, sourceEvent: x.sourceEvent });
  }).on("end", (x) => {
    let P = g(x);
    a && (P = Os(P, a)), r?.({ nodeId: e, position: P, sourceEvent: x.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((x) => {
    if (u?.() || f && x.target?.closest?.("." + f)) return !1;
    if (c) {
      const P = t.querySelector(c);
      return P ? P.contains(x.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Jg(t, e) {
  const n = Ut(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? Ee
  };
}
function Qg(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, l = 1 / 0, a = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const p = h.x + h.width / 2, g = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, x = [
      [t.x, h.x],
      // left-left
      [u, y],
      // right-right
      [c, p],
      // center-center
      [t.x, y],
      // left-right
      [u, h.x]
      // right-left
    ];
    for (const [b, E] of x) {
      const S = E - b;
      Math.abs(S) <= n && (i.add(E), Math.abs(S) < Math.abs(l) && (l = S, r = S));
    }
    const P = [
      [t.y, h.y],
      // top-top
      [f, m],
      // bottom-bottom
      [d, g],
      // center-center
      [t.y, m],
      // top-bottom
      [f, h.y]
      // bottom-top
    ];
    for (const [b, E] of P) {
      const S = E - b;
      Math.abs(S) <= n && (o.add(E), Math.abs(S) < Math.abs(a) && (a = S, s = S));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function ep(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function tp(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = ep(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const np = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let op = 0;
function zs(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function $o(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function ip(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function sp(t, e, n) {
  const o = t.querySelectorAll('[data-flow-handle-type="source"]');
  if (o.length === 0) return null;
  let i = null, r = 1 / 0;
  return o.forEach((s) => {
    const l = s, a = l.getBoundingClientRect();
    if (a.width === 0 && a.height === 0) return;
    const c = a.left + a.width / 2, d = a.top + a.height / 2, u = Math.sqrt((e - c) ** 2 + (n - d) ** 2);
    u < r && (r = u, i = l);
  }), i;
}
function rp(t, e, n) {
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
function ap(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, u = null, f = null, h = null, p = null, g = null, y = !1, m = -1, x = null, P = !1, b = [], E = "", S = [], k = null;
      i(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M || M.hidden) return;
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        const v = M.parentId ? w.getAbsolutePosition(M.id) : M.position ?? { x: 0, y: 0 }, I = M.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], L = M.dimensions?.width ?? 150, R = M.dimensions?.height ?? 40;
        e.style.left = v.x - L * I[0] + "px", e.style.top = v.y - R * I[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        if (e.dataset.flowNodeId = M.id, M.type && (e.dataset.flowNodeType = M.type), !P) {
          const z = e.closest("[x-data]"), X = z ? t.$data(z) : null;
          let G = !1;
          if (X?._config?.nodeTypes) {
            const Z = M.type ?? "default", D = X._config.nodeTypes[Z] ?? X._config.nodeTypes.default;
            if (typeof D == "string") {
              const B = document.querySelector(D);
              B?.content && (e.appendChild(B.content.cloneNode(!0)), G = !0);
            } else typeof D == "function" && (D(M, e), G = !0);
          }
          if (!G && e.children.length === 0) {
            const Z = document.createElement("div");
            Z.setAttribute("x-flow-handle:target", "");
            const D = document.createElement("span");
            D.setAttribute("x-text", "node.data.label");
            const B = document.createElement("div");
            B.setAttribute("x-flow-handle:source", ""), e.appendChild(Z), e.appendChild(D), e.appendChild(B), G = !0;
          }
          if (G)
            for (const Z of Array.from(e.children))
              t.addScopeToNode(Z, { node: M }), t.initTree(Z);
          P = !0;
        }
        if (M.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), k !== M.id && (s?.destroy(), s = null, k = M.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), M.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), M.dimensions) {
          const z = M.childLayout, X = M.fixedDimensions, G = (w._childrenIds?.get(M.id)?.length ?? 0) > 0;
          e.style.width = M.dimensions.width + "px", z || X || G ? e.style.height = M.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(M.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!M.selected)), M._validationErrors && M._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const v = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], I = M.runState;
        for (const z of v)
          e.classList.remove(z);
        I && I !== "pending" && e.classList.add(`flow-node-${I}`);
        for (const z of b)
          e.classList.remove(z);
        const L = M.class ? M.class.split(/\s+/).filter(Boolean) : [];
        for (const z of L)
          e.classList.add(z);
        b = L;
        const R = M.shape ? `flow-node-${M.shape}` : "";
        E !== R && (E && e.classList.remove(E), R && e.classList.add(R), E = R);
        const U = t.$data(e.closest("[data-flow-canvas]")), te = M.shape && U?._shapeRegistry?.[M.shape];
        if (te?.clipPath ? e.style.clipPath = te.clipPath : e.style.clipPath = "", M.style) {
          const z = typeof M.style == "string" ? Object.fromEntries(M.style.split(";").filter(Boolean).map((G) => G.split(":").map((Z) => Z.trim()))) : M.style, X = [];
          for (const [G, Z] of Object.entries(z))
            G && Z && (e.style.setProperty(G, Z), X.push(G));
          for (const G of S)
            X.includes(G) || e.style.removeProperty(G);
          S = X;
        } else if (S.length > 0) {
          for (const z of S)
            e.style.removeProperty(z);
          S = [];
        }
        if (M.rotation ? (e.style.transform = `rotate(${M.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", M.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", M.ariaRole ?? "group"), e.setAttribute("aria-label", M.ariaLabel ?? (M.data?.label ? `Node: ${M.data.label}` : `Node ${M.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), M.domAttributes)
          for (const [z, X] of Object.entries(M.domAttributes))
            z.startsWith("on") || np.has(z.toLowerCase()) || e.setAttribute(z, X);
        Be(M) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), M.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const T = e.classList.contains("flow-node-condensed");
        M.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!M.condensed !== T && requestAnimationFrame(() => {
          M.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, Y("condense", `Node "${M.id}" re-measured after condense toggle`, M.dimensions);
        }), M.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const A = M.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), A !== "visible" && e.classList.add(`flow-handles-${A}`);
        let H = Jr(M, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(M.id) && (H += M.type === "group" ? Math.max(1 - H, 0) : 1e3), y && (H += 1e3);
        const le = M.type === "group" ? 0 : 2;
        if (H !== le ? e.style.zIndex = String(H) : e.style.removeProperty("z-index"), !qr(M)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const V = e.closest(".flow-container");
        s || (s = Kg(e, M.id, {
          container: V ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => w._animationLocked,
          noDragClassName: w._config?.noDragClassName ?? "nodrag",
          dragThreshold: w._config?.nodeDragThreshold ?? 0,
          getViewport: () => w.viewport,
          getNodePosition: () => {
            const z = w.getNode(M.id);
            return z ? z.parentId ? w.getAbsolutePosition(z.id) : { x: z.position.x, y: z.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: w._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: z, position: X, sourceEvent: G }) {
            e.classList.add("flow-node-dragging"), l = !1, c = !1, d = null;
            const Z = w._container ? He.get(w._container) : void 0;
            Z?.bridge && Z.bridge.setDragging(z, !0), h?.destroy(), h = null, p = null, g && V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, a = w._snapshotHistory?.() ?? null, Y("drag", `Node "${z}" drag start`, X);
            const D = w.getNode(z);
            if (D) {
              if (w._config?.selectNodesOnDrag !== !1 && D.selectable !== !1 && !w.selectedNodes.has(z) && (pt(G, w._shortcuts?.multiSelect) || w.deselectAll(), w.selectedNodes.add(z), D.selected = !0, w._emitSelectionChange(), c = !0), w._emit("node-drag-start", { node: D }), w.selectedNodes.has(z) && w.selectedNodes.size > 1) {
                const B = mt(z, w.nodes);
                d = /* @__PURE__ */ new Map();
                for (const J of w.selectedNodes) {
                  if (J === z || B.has(J))
                    continue;
                  const q = w.getNode(J);
                  q && q.draggable !== !1 && d.set(J, { x: q.position.x, y: q.position.y });
                }
              }
              if (w._draggingNodeIds.add(z), d)
                for (const B of d.keys())
                  w._draggingNodeIds.add(B);
            }
            w._config?.autoPanOnNodeDrag !== !1 && V && (u = Xr({
              container: V,
              speed: w._config?.autoPanSpeed ?? 15,
              onPan(B, J) {
                const q = () => w._viewportLive ?? w.viewport, F = q().zoom || 1, ne = { x: q().x, y: q().y };
                w._panZoom?.setViewport({
                  x: q().x - B,
                  y: q().y - J,
                  zoom: F
                });
                const oe = ne.x - q().x, j = ne.y - q().y, W = oe === 0 && j === 0, re = w.getNode(z);
                let O = !1;
                if (re) {
                  const ee = re.position.x, ce = re.position.y;
                  re.position.x += oe / F, re.position.y += j / F;
                  const se = Rn(re.position, re, w._config?.nodeExtent);
                  re.position.x = se.x, re.position.y = se.y, O = re.position.x === ee && re.position.y === ce;
                }
                if (d)
                  for (const [ee] of d) {
                    const ce = w.getNode(ee);
                    if (ce) {
                      ce.position.x += oe / F, ce.position.y += j / F;
                      const se = Rn(ce.position, ce, w._config?.nodeExtent);
                      ce.position.x = se.x, ce.position.y = se.y;
                    }
                  }
                return W && O;
              }
            }), G instanceof MouseEvent && u.updatePointer(G.clientX, G.clientY), u.start());
          },
          onDrag({ nodeId: z, position: X, delta: G, sourceEvent: Z }) {
            l = !0;
            const D = w.getNode(z);
            if (D) {
              if (D.parentId) {
                const q = w.getAbsolutePosition(D.parentId);
                let F = X.x - q.x, ne = X.y - q.y;
                const oe = D.dimensions ?? { width: 150, height: 50 }, j = w.getNode(D.parentId);
                if (j?.childLayout) {
                  y || (e.classList.add("flow-reorder-dragging"), x = D.parentId), y = !0;
                  const W = D.extent !== "parent";
                  if (D.position.x = X.x - q.x, D.position.y = X.y - q.y, !W && j.dimensions) {
                    const ee = ko({ x: D.position.x, y: D.position.y }, oe, j.dimensions);
                    D.position.x = ee.x, D.position.y = ee.y;
                  }
                  const re = D.dimensions?.width ?? 150, O = D.dimensions?.height ?? 50;
                  if (W) {
                    const ee = j.dimensions?.width ?? 150, ce = j.dimensions?.height ?? 50, se = D.position.x + re / 2, de = D.position.y + O / 2, fe = 12, we = x === D.parentId ? 0 : fe, be = se >= we && se <= ee - we && de >= we && de <= ce - we, Ce = /* @__PURE__ */ new Set();
                    let ge = D.parentId;
                    for (; ge; )
                      Ce.add(ge), ge = w.getNode(ge)?.parentId;
                    const ve = X.x + re / 2, Me = X.y + O / 2, Q = mt(D.id, w.nodes);
                    let ue = null;
                    const me = w.nodes.filter(
                      (he) => he.id !== D.id && (he.droppable || he.childLayout) && !he.hidden && !Q.has(he.id) && (be ? !Ce.has(he.id) : he.id !== D.parentId) && (!he.acceptsDrop || he.acceptsDrop(D))
                    );
                    for (const he of me) {
                      const pe = he.parentId ? w.getAbsolutePosition(he.id) : he.position, Se = he.dimensions?.width ?? 150, Le = he.dimensions?.height ?? 50, Ae = he.id === g ? 0 : fe;
                      ve >= pe.x + Ae && ve <= pe.x + Se - Ae && Me >= pe.y + Ae && Me <= pe.y + Le - Ae && (ue = he);
                    }
                    const ye = ue?.id ?? null;
                    if (ye !== g) {
                      g && V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), ye && V && V.querySelector(`[data-flow-node-id="${CSS.escape(ye)}"]`)?.classList.add("flow-node-drop-target"), g = ye;
                      const he = ye ? w.getNode(ye) : null, pe = x;
                      if (he?.childLayout && ye !== x) {
                        pe && (w.layoutChildren(pe, { omitFromComputation: z, shallow: !0 }), w.propagateLayoutUp(pe, { omitFromComputation: z })), x = ye;
                        const Se = w.nodes.filter((De) => De.parentId === ye && De.id !== z).sort((De, qe) => (De.order ?? 1 / 0) - (qe.order ?? 1 / 0)), Le = Se.length, Ae = [...Se];
                        Ae.splice(Le, 0, D);
                        for (let De = 0; De < Ae.length; De++)
                          Ae[De].order = De;
                        m = Le;
                        const Te = w._initialDimensions?.get(z), ze = { ...D, dimensions: Te ? { ...Te } : void 0 };
                        w.layoutChildren(ye, { excludeId: z, includeNode: ze, shallow: !0 }), w.propagateLayoutUp(ye, { includeNode: ze });
                      } else be && x !== D.parentId ? (pe && pe !== D.parentId && (w.layoutChildren(pe, { omitFromComputation: z, shallow: !0 }), w.propagateLayoutUp(pe, { omitFromComputation: z })), x = D.parentId, m = -1) : !ye && !be && (pe && (w.layoutChildren(pe, { omitFromComputation: z, shallow: !0 }), w.propagateLayoutUp(pe, { omitFromComputation: z })), x = null, m = -1);
                    }
                  }
                  if (x) {
                    const ee = w.getNode(x), ce = ee?.childLayout ?? j.childLayout, se = w.nodes.filter((ge) => ge.parentId === x && ge.id !== z).sort((ge, ve) => (ge.order ?? 1 / 0) - (ve.order ?? 1 / 0));
                    let de, fe;
                    if (x !== D.parentId) {
                      const ge = ee?.parentId ? w.getAbsolutePosition(x) : ee?.position ?? { x: 0, y: 0 };
                      de = X.x - ge.x, fe = X.y - ge.y;
                    } else
                      de = D.position.x, fe = D.position.y;
                    const we = ce.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (x === D.parentId) {
                        const ge = D.order ?? 0;
                        m = se.filter((ve) => (ve.order ?? 0) < ge).length;
                      } else
                        m = se.length;
                    const be = m;
                    let Ce = se.length;
                    for (let ge = 0; ge < se.length; ge++) {
                      const ve = se[ge], Me = ve.dimensions?.width ?? 150, Q = ve.dimensions?.height ?? 50, ue = ge < be ? 1 - we : we, me = ve.position.y + Q * ue, ye = ve.position.x + Me * ue;
                      if (ce.direction === "grid") {
                        const he = {
                          x: de + re / 2,
                          y: fe + O / 2
                        }, pe = ve.position.y + Q / 2;
                        if (he.y < ve.position.y) {
                          Ce = ge;
                          break;
                        }
                        if (Math.abs(he.y - pe) < Q / 2 && he.x < ye) {
                          Ce = ge;
                          break;
                        }
                      } else if (ce.direction === "vertical") {
                        if ((ge < be ? fe : fe + O) < me) {
                          Ce = ge;
                          break;
                        }
                      } else if ((ge < be ? de : de + re) < ye) {
                        Ce = ge;
                        break;
                      }
                    }
                    if (Ce !== m) {
                      m = Ce;
                      const ge = [...se];
                      ge.splice(Ce, 0, D);
                      for (let me = 0; me < ge.length; me++)
                        ge[me].order = me;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), w._layoutAnimFrame && cancelAnimationFrame(w._layoutAnimFrame);
                      const Me = D.id, Q = x, ue = Q !== D.parentId;
                      w._layoutAnimFrame = requestAnimationFrame(() => {
                        if (ue && Q) {
                          const pe = w.getNode(Me);
                          let Se;
                          if (pe) {
                            const Le = w._initialDimensions?.get(Me);
                            Se = { ...pe, dimensions: Le ? { ...Le } : void 0 };
                          }
                          w.layoutChildren(Q, {
                            excludeId: Me,
                            includeNode: Se,
                            shallow: !0
                          }), w.propagateLayoutUp(Q, {
                            includeNode: Se
                          });
                        } else
                          w.layoutChildren(Q, Me, !0);
                        const me = performance.now(), ye = 300, he = () => {
                          w._layoutAnimTick++, performance.now() - me < ye ? w._layoutAnimFrame = requestAnimationFrame(he) : w._layoutAnimFrame = 0;
                        };
                        w._layoutAnimFrame = requestAnimationFrame(he);
                      });
                    }
                  }
                  u && Z instanceof MouseEvent && u.updatePointer(Z.clientX, Z.clientY);
                  return;
                }
                if (D.extent === "parent" && j?.dimensions) {
                  const W = ko(
                    { x: F, y: ne },
                    oe,
                    j.dimensions
                  );
                  F = W.x, ne = W.y;
                } else if (Array.isArray(D.extent)) {
                  const W = Qr({ x: F, y: ne }, D.extent, oe);
                  F = W.x, ne = W.y;
                }
                if ((!D.extent || D.extent !== "parent") && (fn(
                  j,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!j?.childLayout) && j?.dimensions) {
                  const O = ko(
                    { x: F, y: ne },
                    oe,
                    j.dimensions
                  );
                  F = O.x, ne = O.y;
                }
                if (D.expandParent && j?.dimensions) {
                  const W = Qf(
                    { x: F, y: ne },
                    oe,
                    j.dimensions
                  );
                  W && (j.dimensions.width = W.width, j.dimensions.height = W.height);
                }
                D.position.x = F, D.position.y = ne;
              } else {
                const q = Rn(X, D, w._config?.nodeExtent);
                D.position.x = q.x, D.position.y = q.y;
              }
              if (w._config?.snapToGrid) {
                const q = D.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], F = D.dimensions?.width ?? 150, ne = D.dimensions?.height ?? 40, oe = D.parentId ? w.getAbsolutePosition(D.id) : D.position;
                e.style.left = oe.x - F * q[0] + "px", e.style.top = oe.y - ne * q[1] + "px", w._layoutAnimTick++;
              }
              if (w._emit("node-drag", { node: D, position: X }), d)
                for (const [q, F] of d) {
                  const ne = w.getNode(q);
                  if (ne) {
                    let oe = F.x + G.x, j = F.y + G.y;
                    const W = Rn({ x: oe, y: j }, ne, w._config?.nodeExtent);
                    ne.position.x = W.x, ne.position.y = W.y;
                  }
                }
              const J = w._config?.helperLines;
              if (J) {
                const q = typeof J == "object" ? J.snap ?? !0 : !0, F = typeof J == "object" ? J.threshold ?? 5 : 5, ne = (ee) => {
                  const ce = ee.parentId ? w.getAbsolutePosition(ee.id) : ee.position;
                  return Jg({ ...ee, position: ce }, w._config?.nodeOrigin);
                }, j = (w.selectedNodes.size > 1 && w.selectedNodes.has(z) ? w.nodes.filter((ee) => w.selectedNodes.has(ee.id)) : [D]).map(ne), W = {
                  x: Math.min(...j.map((ee) => ee.x)),
                  y: Math.min(...j.map((ee) => ee.y)),
                  width: Math.max(...j.map((ee) => ee.x + ee.width)) - Math.min(...j.map((ee) => ee.x)),
                  height: Math.max(...j.map((ee) => ee.y + ee.height)) - Math.min(...j.map((ee) => ee.y))
                }, re = w.nodes.filter(
                  (ee) => !w.selectedNodes.has(ee.id) && ee.id !== z && ee.hidden !== !0 && ee.filtered !== !0
                ).map(ne), O = Qg(W, re, F);
                if (q && (O.snapOffset.x !== 0 || O.snapOffset.y !== 0) && (D.position.x += O.snapOffset.x, D.position.y += O.snapOffset.y, d))
                  for (const [ee] of d) {
                    const ce = w.getNode(ee);
                    ce && (ce.position.x += O.snapOffset.x, ce.position.y += O.snapOffset.y);
                  }
                if (f?.remove(), O.horizontal.length > 0 || O.vertical.length > 0) {
                  const ee = V?.querySelector(".flow-viewport");
                  if (ee) {
                    const ce = w.nodes.map(ne);
                    f = rp(O.horizontal, O.vertical, ce), ee.appendChild(f);
                  }
                } else
                  f = null;
                w._emit("helper-lines-change", {
                  horizontal: O.horizontal,
                  vertical: O.vertical
                });
              }
            }
            if (w._config?.preventOverlap) {
              const J = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, q = D.dimensions?.width ?? _e, F = D.dimensions?.height ?? Ee, ne = w.selectedNodes, oe = w.nodes.filter((W) => W.id !== D.id && !W.hidden && !ne.has(W.id)).map((W) => Wt(W, w._config?.nodeOrigin)), j = Ph(D.position, q, F, oe, J);
              D.position.x = j.x, D.position.y = j.y;
            }
            if (!D.parentId) {
              const J = mt(D.id, w.nodes), q = w.nodes.filter(
                (W) => W.id !== D.id && W.droppable && !W.hidden && !J.has(W.id) && (!W.acceptsDrop || W.acceptsDrop(D))
              ), F = Wt(D, w._config?.nodeOrigin);
              let ne = null;
              const oe = 12;
              for (const W of q) {
                const re = W.parentId ? w.getAbsolutePosition(W.id) : W.position, O = W.dimensions?.width ?? _e, ee = W.dimensions?.height ?? Ee, ce = F.x + F.width / 2, se = F.y + F.height / 2, de = W.id === g ? 0 : oe;
                ce >= re.x + de && ce <= re.x + O - de && se >= re.y + de && se <= re.y + ee - de && (ne = W);
              }
              const j = ne?.id ?? null;
              j !== g && (g && V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), j && V && V.querySelector(`[data-flow-node-id="${CSS.escape(j)}"]`)?.classList.add("flow-node-drop-target"), g = j);
            }
            if (w._config?.proximityConnect) {
              const J = w._config.proximityConnectDistance ?? 150, q = D.dimensions ?? { width: 150, height: 50 }, F = {
                x: D.position.x + q.width / 2,
                y: D.position.y + q.height / 2
              }, ne = w.nodes.filter((j) => j.id !== D.id && !j.hidden).map((j) => ({
                id: j.id,
                center: {
                  x: j.position.x + (j.dimensions?.width ?? 150) / 2,
                  y: j.position.y + (j.dimensions?.height ?? 50) / 2
                }
              })), oe = tp(D.id, F, ne, J);
              if (oe)
                if (w.edges.some(
                  (W) => W.source === oe.source && W.target === oe.target || W.source === oe.target && W.target === oe.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = oe, !h) {
                    h = zt({
                      connectionLineType: w._config?.connectionLineType,
                      connectionLineStyle: w._config?.connectionLineStyle,
                      connectionLine: w._config?.connectionLine
                    });
                    const W = V?.querySelector(".flow-viewport");
                    W && W.appendChild(h.svg);
                  }
                  h.update({
                    fromX: F.x,
                    fromY: F.y,
                    toX: oe.targetCenter.x,
                    toY: oe.targetCenter.y,
                    source: oe.source
                  });
                }
              else
                h?.destroy(), h = null, p = null;
            }
            const B = w._container ? He.get(w._container) : void 0;
            if (B?.bridge) {
              if (B.bridge.pushLocalNodeUpdate(z, { position: D.position }), d)
                for (const [J] of d) {
                  const q = w.getNode(J);
                  q && B.bridge.pushLocalNodeUpdate(J, { position: q.position });
                }
              if (B.awareness && Z instanceof MouseEvent && w._container) {
                const J = w._container.getBoundingClientRect(), q = w._viewportLive ?? w.viewport, F = (Z.clientX - J.left - q.x) / q.zoom, ne = (Z.clientY - J.top - q.y) / q.zoom;
                B.awareness.updateCursor({ x: F, y: ne });
              }
            }
            u && Z instanceof MouseEvent && u.updatePointer(Z.clientX, Z.clientY);
          },
          onDragEnd({ nodeId: z, position: X }) {
            const G = d ? [z, ...d.keys()] : [z];
            w._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), Y("drag", `Node "${z}" drag end`, X);
            const Z = w._container ? He.get(w._container) : void 0;
            Z?.bridge && Z.bridge.setDragging(z, !1), u?.stop(), u = null, f?.remove(), f = null, w._config?.helperLines && w._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const D = w.getNode(z);
            if (D && w._emit("node-drag-end", { node: D, position: X }), y && D?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const B = x;
              y = !1, m = -1, x = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), $o(w, z, g), g = null) : B && B !== D.parentId ? (w.layoutChildren(B, { omitFromComputation: z, shallow: !0 }), w.propagateLayoutUp(B, { omitFromComputation: z }), w.layoutChildren(D.parentId), w._emit("child-reorder", {
                nodeId: z,
                parentId: D.parentId,
                order: D.order
              })) : (w.layoutChildren(D.parentId), w._emit("child-reorder", {
                nodeId: z,
                parentId: D.parentId,
                order: D.order
              })), d = null, w._layoutAnimTick++, w._commitNodeGeometry(G), zs(w, l, a), a = null, l = !1;
              return;
            }
            if (D && g)
              V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), $o(w, z, g), g = null;
            else if (D && D.parentId && !g) {
              const B = fn(
                w.getNode(D.parentId),
                w._config?.childValidationRules ?? {}
              ), J = w.getNode(D.parentId);
              if (!B?.preventChildEscape && !J?.childLayout && J?.dimensions) {
                const q = D.position.x, F = D.position.y, ne = D.dimensions?.width ?? 150, oe = D.dimensions?.height ?? 50;
                (q + ne < 0 || F + oe < 0 || q > J.dimensions.width || F > J.dimensions.height) && $o(w, z, null);
              }
              g = null;
            } else
              g && V && V.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (w._config?.proximityConnect && p) {
              const B = p;
              h?.destroy(), h = null, p = null;
              let J = !0;
              if (w._config.onProximityConnect && w._config.onProximityConnect({
                source: B.source,
                target: B.target,
                distance: B.distance
              }) === !1 && (J = !1), J) {
                const q = {
                  source: B.source,
                  sourceHandle: "source",
                  target: B.target,
                  targetHandle: "target"
                };
                if (ft(q, w.edges, { preventCycles: w._config?.preventCycles }) && ut(q, w._config?.connectionRules, w._nodeMap) && (V ? tt(V, q, w.edges) : !0) && (V ? et(V, q) : !0) && (!w._config.isValidConnection || w._config.isValidConnection(q))) {
                  if (w._config.proximityConnectConfirm) {
                    const re = V?.querySelector(`[data-flow-node-id="${CSS.escape(B.source)}"]`), O = V?.querySelector(`[data-flow-node-id="${CSS.escape(B.target)}"]`);
                    re?.classList.add("flow-proximity-confirm"), O?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      re?.classList.remove("flow-proximity-confirm"), O?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const W = `e-${B.source}-${B.target}-${Date.now()}-${op++}`;
                  w.addEdges({ id: W, ...q }), w._emit("connect", { connection: q });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, l && (w._layoutAnimTick++, w._commitNodeGeometry(G)), zs(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const M = t.$data(e.closest("[x-data]"));
        if (M?._config?.easyConnect) {
          const w = M._config.easyConnectKey ?? "alt", v = (I) => {
            if (!ip(I, w) || I.target.closest("[data-flow-handle-type]")) return;
            const L = t.$data(e.closest("[x-data]"));
            if (!L || L._animationLocked || L._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const U = L.getNode(R.id);
            if (!U || U.connectable === !1) return;
            I.preventDefault(), I.stopPropagation(), I.stopImmediatePropagation();
            const te = sp(e, I.clientX, I.clientY), K = te?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const T = e.closest(".flow-container");
            if (!T) return;
            const A = L._viewportLive ?? L.viewport, H = A?.zoom || 1, ae = A?.x || 0, le = A?.y || 0, ie = T.getBoundingClientRect();
            let V, z;
            if (te) {
              const F = te.getBoundingClientRect();
              V = (F.left + F.width / 2 - ie.left - ae) / H, z = (F.top + F.height / 2 - ie.top - le) / H;
            } else {
              const F = e.getBoundingClientRect();
              V = (F.left + F.width / 2 - ie.left - ae) / H, z = (F.top + F.height / 2 - ie.top - le) / H;
            }
            L._emit("connect-start", { source: R.id, sourceHandle: K });
            const X = zt({
              connectionLineType: L._config?.connectionLineType,
              connectionLineStyle: L._config?.connectionLineStyle,
              connectionLine: L._config?.connectionLine
            }), G = T.querySelector(".flow-viewport");
            G && G.appendChild(X.svg), X.update({ fromX: V, fromY: z, toX: V, toY: z, source: R.id, sourceHandle: K }), L.pendingConnection = { source: R.id, sourceHandle: K, position: { x: V, y: z } }, un(T, R.id, K, L);
            let Z = oo(T, L, I.clientX, I.clientY), D = null;
            const B = L._config?.connectionSnapRadius ?? 20, J = (F) => {
              const ne = L.screenToFlowPosition(F.clientX, F.clientY), oe = dn({
                containerEl: T,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: ne,
                connectionSnapRadius: B,
                getNode: (j) => L.getNode(j),
                toFlowPosition: (j, W) => L.screenToFlowPosition(j, W)
              });
              oe.element !== D && (D?.classList.remove("flow-handle-active"), oe.element?.classList.add("flow-handle-active"), D = oe.element), X.update({ fromX: V, fromY: z, toX: oe.position.x, toY: oe.position.y, source: R.id, sourceHandle: K }), L.pendingConnection = { ...L.pendingConnection, position: oe.position }, Z?.updatePointer(F.clientX, F.clientY);
            }, q = async (F) => {
              Z?.stop(), Z = null, document.removeEventListener("pointermove", J), document.removeEventListener("pointerup", q), X.destroy(), D?.classList.remove("flow-handle-active"), Pe(T), e.classList.remove("flow-easy-connecting");
              const ne = L.screenToFlowPosition(F.clientX, F.clientY), oe = { source: R.id, sourceHandle: K, position: ne };
              L.pendingConnection = null;
              let j = D;
              if (j || (j = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]')), !j) {
                L._emit("connect-end", { connection: null, ...oe });
                return;
              }
              const re = j.closest("[x-flow-node]")?.dataset.flowNodeId, O = j.dataset.flowHandleId ?? "target";
              if (!re) {
                L._emit("connect-end", { connection: null, ...oe });
                return;
              }
              const ee = { source: R.id, sourceHandle: K, target: re, targetHandle: O }, ce = await jr({ connection: ee, canvas: L, containerEl: T });
              L._emit("connect-end", {
                connection: ce.applied ? ee : null,
                ...oe
              });
            };
            document.addEventListener("pointermove", J), document.addEventListener("pointerup", q);
          };
          e.addEventListener("pointerdown", v, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", v, { capture: !0 });
          });
        }
      }
      const N = (M) => {
        if (M.key !== "Enter" && M.key !== " ") return;
        M.preventDefault();
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        v && (v._animationLocked || Jo(w) && (v._emit("node-click", { node: w, event: M }), M.stopPropagation(), pt(M, v._shortcuts?.multiSelect) ? v.selectedNodes.has(w.id) ? (v.selectedNodes.delete(w.id), w.selected = !1) : (v.selectedNodes.add(w.id), w.selected = !0) : (v.deselectAll(), v.selectedNodes.add(w.id), w.selected = !0), v._emitSelectionChange()));
      };
      e.addEventListener("keydown", N);
      const _ = () => {
        const M = t.$data(e.closest("[x-data]"));
        if (!M?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const v = w.parentId ? M.getAbsolutePosition(w.id) : w.position;
        M.setCenter(
          v.x + (w.dimensions?.width ?? 150) / 2,
          v.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", _);
      const C = (M) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        if (v && !v._animationLocked && (v._emit("node-click", { node: w, event: M }), !!Jo(w))) {
          if (M.stopPropagation(), c) {
            c = !1;
            return;
          }
          pt(M, v._shortcuts?.multiSelect) ? v.selectedNodes.has(w.id) ? (v.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), Y("selection", `Node "${w.id}" deselected (shift)`)) : (v.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), Y("selection", `Node "${w.id}" selected (shift)`)) : (v.deselectAll(), v.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), Y("selection", `Node "${w.id}" selected`)), v._emitSelectionChange();
        }
      };
      e.addEventListener("click", C);
      const $ = (M) => {
        M.preventDefault(), M.stopPropagation();
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        if (v)
          if (v.selectedNodes.size > 1 && v.selectedNodes.has(w.id)) {
            const I = v.nodes.filter((L) => v.selectedNodes.has(L.id));
            v._emit("selection-context-menu", { nodes: I, event: M });
          } else
            v._emit("node-context-menu", { node: w, event: M });
      };
      e.addEventListener("contextmenu", $), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        const w = t.$data(e.closest("[x-data]"));
        M.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, Y("init", `Node "${M.id}" measured`, M.dimensions), w?._nodeElements?.set(M.id, e), M.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", N), e.removeEventListener("focus", _), e.removeEventListener("click", C), e.removeEventListener("contextmenu", $);
        const M = e.dataset.flowNodeId;
        if (M) {
          const w = t.$data(e.closest("[x-data]"));
          w?._nodeElements?.delete(M), w?._resizeObserver?.unobserve(e), w?._draggingNodeIds?.delete(M);
        }
      });
    }
  );
}
const Tt = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function lp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  u ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : f && (g = o.height - e.y), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)));
  const y = p - o.width, m = g - o.height, x = d ? n.x - y : n.x, P = f ? n.y - m : n.y;
  return {
    position: { x, y: P },
    dimensions: { width: p, height: g }
  };
}
const ya = ["top-left", "top-right", "bottom-left", "bottom-right"], wa = ["top", "right", "bottom", "left"], cp = [...ya, ...wa], dp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function up(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = fp(o);
      let a = { ...Tt };
      if (n)
        try {
          const d = i(n);
          a = { ...Tt, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = dp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), y = h.dataset.flowNodeId;
          if (!y || !g) return;
          const m = g.getNode(y);
          if (!m || !ds(m)) return;
          m.fixedDimensions = !0;
          const x = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === Tt.minWidth && (x.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === Tt.minHeight && (x.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === Tt.maxWidth && (x.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === Tt.maxHeight && (x.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const C = g.viewport?.zoom || 1, $ = h.getBoundingClientRect();
            m.dimensions = { width: $.width / C, height: $.height / C };
          }
          const P = { x: m.position.x, y: m.position.y }, b = { width: m.dimensions.width, height: m.dimensions.height }, E = g.viewport?.zoom || 1, S = f.clientX, k = f.clientY;
          g._captureHistory?.(), Y("resize", `Resize start on "${y}" (${d})`, b), g._emit("node-resize-start", { node: m, dimensions: { ...b } });
          const N = (C) => {
            const $ = {
              x: (C.clientX - S) / E,
              y: (C.clientY - k) / E
            }, M = lp(
              d,
              $,
              P,
              b,
              x,
              g._config?.snapToGrid ?? !1
            );
            if (m.position.x = M.position.x, m.position.y = M.position.y, m.dimensions.width = M.dimensions.width, m.dimensions.height = M.dimensions.height, m.parentId) {
              const w = g.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${M.position.x}px`, h.style.top = `${M.position.y}px`;
            h.style.width = `${M.dimensions.width}px`, h.style.height = `${M.dimensions.height}px`, g._layoutAnimTick++, g._emit("node-resize", { node: m, dimensions: { ...M.dimensions } });
          }, _ = () => {
            document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", _), document.removeEventListener("pointercancel", _), Y("resize", `Resize end on "${y}"`, m.dimensions), g._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", N), document.addEventListener("pointerup", _), document.addEventListener("pointercancel", _);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u), h = d.dataset.flowNodeId;
        if (!h || !f) return;
        const p = f.getNode(h);
        if (!p) return;
        const g = !ds(p);
        for (const y of c)
          y.style.display = g ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function fp(t) {
  if (t.includes("corners"))
    return ya;
  if (t.includes("edges"))
    return wa;
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
  return cp;
}
function hp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function gp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function pp(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("snap"), a = l && n && Number(i(n)) || 15;
      e.classList.add("flow-rotate-handle"), e.style.cursor = "grab";
      const c = (d) => {
        d.preventDefault(), d.stopPropagation();
        const u = e.closest("[x-flow-node]");
        if (!u) return;
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f), p = u.dataset.flowNodeId;
        if (!p || !h) return;
        const g = h.getNode(p);
        if (!g) return;
        const y = u.getBoundingClientRect(), m = y.left + y.width / 2, x = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const P = (E) => {
          let S = hp(
            E.clientX,
            E.clientY,
            m,
            x
          );
          l && (S = gp(S, a)), g.rotation = S;
        }, b = () => {
          document.removeEventListener("pointermove", P), document.removeEventListener("pointerup", b), e.style.cursor = "grab", h._emit("node-rotate-end", { node: g, rotation: g.rotation });
        };
        document.addEventListener("pointermove", P), document.addEventListener("pointerup", b);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function mp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const yp = "application/alpineflow";
function wp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(yp, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function vp(t) {
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
function _p(t) {
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
        const a = i.edges, c = new Set(a.map((g) => g.id));
        for (const [g, y] of l)
          c.has(g) || (t.destroyTree(y), y.remove(), l.delete(g), i._edgeSvgElements?.delete(g));
        for (const g of a) {
          if (l.has(g.id)) continue;
          const y = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          y.setAttribute("class", "flow-edge-svg");
          const m = document.createElementNS("http://www.w3.org/2000/svg", "g");
          y.appendChild(m), t.addScopeToNode(m, { edge: g }), m.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(y);
          }), l.set(g.id, y), i._edgeSvgElements?.set(g.id, y), t.initTree(m);
        }
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
        if (f) {
          const g = vp(
            a
          );
          for (const y of g)
            h.add(y.primaryId), p.add(y.mirrorId);
        }
        for (const g of a) {
          const y = h.has(g.id), m = p.has(g.id);
          !!g._renderDualMarker !== y && (g._renderDualMarker = y ? !0 : void 0), !!g._hiddenByCollapse !== m && (g._hiddenByCollapse = m ? !0 : void 0);
        }
        for (const g of a) {
          const y = l.get(g.id);
          if (!y) continue;
          const m = i.getNode?.(g.source), x = i.getNode?.(g.target), P = g.hidden || g._hiddenByCollapse || m?.hidden || x?.hidden;
          y.style.display = P ? "none" : "";
        }
        for (const g of a) {
          const y = l.get(g.id);
          if (!y) continue;
          const m = i.getNode?.(g.source), x = i.getNode?.(g.target);
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
const bp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], xp = "a, button, input, textarea, select, [contenteditable]", Ep = 100, Cp = 60, Sp = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), kp = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), Lp = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), Pp = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function Mp(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && bp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function At(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function Tp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function Ap(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (Sp.has(e) && (t.style.top = "0"), kp.has(e) && (t.style.bottom = "0")), o && !n && (Lp.has(e) && (t.style.left = "0"), Pp.has(e) && (t.style.right = "0"));
}
function Np(t) {
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
        fillHeight: u
      } = Mp(n, o), f = d || u, h = !s && !l && !f, p = !s && !a && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || f) && e.classList.add("flow-panel-locked"), (a || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && Ap(e, r, d, u);
      const g = (E) => E.stopPropagation();
      e.addEventListener("mousedown", g), e.addEventListener("pointerdown", g), e.addEventListener("wheel", g);
      const y = e.parentElement, m = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, x = `flow-panel-${r}`, P = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(x) || e.classList.add(x);
      };
      y.addEventListener("flow-panel-reset", P), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let b = null;
      if (h) {
        let E = !1, S = 0, k = 0, N = 0, _ = 0;
        const C = () => {
          const v = e.getBoundingClientRect(), I = y.getBoundingClientRect();
          return {
            x: v.left - I.left,
            y: v.top - I.top
          };
        }, $ = (v) => {
          if (!E) return;
          let I = N + (v.clientX - S), L = _ + (v.clientY - k);
          if (c) {
            const R = Tp(
              I,
              L,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            I = R.left, L = R.top;
          }
          e.style.left = `${I}px`, e.style.top = `${L}px`, At(y, "panel-drag", {
            panel: e,
            position: { x: I, y: L }
          });
        }, M = () => {
          if (!E) return;
          E = !1, document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M);
          const v = C();
          At(y, "panel-drag-end", {
            panel: e,
            position: v
          });
        }, w = (v) => {
          const I = v.target;
          if (I.closest(xp) || I.closest(".flow-panel-resize-handle"))
            return;
          E = !0, S = v.clientX, k = v.clientY;
          const L = e.getBoundingClientRect(), R = y.getBoundingClientRect();
          N = L.left - R.left, _ = L.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${N}px`, e.style.top = `${_}px`, document.addEventListener("pointermove", $), document.addEventListener("pointerup", M), document.addEventListener("pointercancel", M), At(y, "panel-drag-start", {
            panel: e,
            position: { x: N, y: _ }
          });
        };
        if (e.addEventListener("pointerdown", w), p) {
          b = document.createElement("div"), b.classList.add("flow-panel-resize-handle"), e.appendChild(b);
          let v = !1, I = 0, L = 0, R = 0, U = 0;
          const te = (A) => {
            if (!v) return;
            const H = Math.max(Ep, R + (A.clientX - I)), ae = Math.max(Cp, U + (A.clientY - L));
            e.style.width = `${H}px`, e.style.height = `${ae}px`, At(y, "panel-resize", {
              panel: e,
              dimensions: { width: H, height: ae }
            });
          }, K = () => {
            v && (v = !1, document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", K), document.removeEventListener("pointercancel", K), At(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, T = (A) => {
            A.stopPropagation(), v = !0, I = A.clientX, L = A.clientY, R = e.offsetWidth, U = e.offsetHeight, document.addEventListener("pointermove", te), document.addEventListener("pointerup", K), document.addEventListener("pointercancel", K), At(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: U }
            });
          };
          b.addEventListener("pointerdown", T), i(() => {
            e.removeEventListener("pointerdown", w), b?.removeEventListener("pointerdown", T), document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", K), document.removeEventListener("pointercancel", K), b?.remove(), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", P), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", P), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", P), y.__flowPanels?.delete(e);
        });
    }
  );
}
function $p(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = Ip(n), l = Dp(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const a = (d) => {
        d.stopPropagation();
      }, c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("pointerdown", a), e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = f.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, y = g ? f.getNode(g) : null, m = y?.dimensions?.width ?? d.offsetWidth, x = y?.dimensions?.height ?? d.offsetHeight, P = p / h;
        let b, E, S, k;
        s === "top" || s === "bottom" ? (E = s === "top" ? -P : x + P, k = s === "top" ? "-100%" : "0%", l === "start" ? (b = 0, S = "0%") : l === "end" ? (b = m, S = "-100%") : (b = m / 2, S = "-50%")) : (b = s === "left" ? -P : m + P, S = s === "left" ? "-100%" : "0%", l === "start" ? (E = 0, k = "0%") : l === "end" ? (E = x, k = "-100%") : (E = x / 2, k = "-50%")), e.style.left = `${b}px`, e.style.top = `${E}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${S}, ${k})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function Ip(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Dp(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Rp(t) {
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
      let u = 0, f = 0;
      if (o) {
        const S = r(o);
        u = S?.offsetX ?? 0, f = S?.offsetY ?? 0;
      }
      a.setAttribute("role", "menu"), a.setAttribute("tabindex", "-1"), a.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let p = null;
      const g = 4, y = () => {
        p = document.activeElement;
        const S = d.contextMenu.x + u, k = d.contextMenu.y + f;
        a.style.display = "", a.style.position = "fixed", a.style.left = S + "px", a.style.top = k + "px", a.style.zIndex = "5000", a.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((w) => {
          w.setAttribute("role", "menuitem"), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1");
        });
        const N = a.getBoundingClientRect(), _ = window.innerWidth, C = window.innerHeight;
        let $ = S, M = k;
        N.right > _ - g && ($ = _ - N.width - g), N.bottom > C - g && (M = C - N.height - g), $ < g && ($ = g), M < g && (M = g), a.style.left = $ + "px", a.style.top = M + "px", h.style.display = "", a.focus({ preventScroll: !0 });
      }, m = () => {
        a.style.display = "none", h.style.display = "none", p && document.contains(p) && (p.focus({ preventScroll: !0 }), p = null);
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
      const P = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), b = (S) => Array.from(S.querySelectorAll(
        "button:not([disabled])"
      )), E = (S) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const k = document.activeElement, N = k?.closest(".flow-context-submenu"), _ = N ? b(N) : P();
        if (_.length === 0) return;
        const C = _.indexOf(k);
        switch (S.key) {
          case "ArrowDown": {
            S.preventDefault();
            const $ = C < _.length - 1 ? C + 1 : 0;
            _[$].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            S.preventDefault();
            const $ = C > 0 ? C - 1 : _.length - 1;
            _[$].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (S.preventDefault(), S.shiftKey) {
              const $ = C > 0 ? C - 1 : _.length - 1;
              _[$].focus({ preventScroll: !0 });
            } else {
              const $ = C < _.length - 1 ? C + 1 : 0;
              _[$].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            S.preventDefault(), k?.click();
            break;
          }
          case "ArrowRight": {
            if (!N) {
              const $ = k?.querySelector(".flow-context-submenu");
              $ && (S.preventDefault(), $.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            N && (S.preventDefault(), N.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", E), s(() => {
        h.remove(), window.removeEventListener("scroll", x, !0), a.removeEventListener("keydown", E);
      });
    }
  );
}
const Hp = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Fp(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), u = a.has("queue"), f = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let p = null, g = [], y = !1, m = !1, x = !1;
      function P() {
        const $ = r(i);
        return Array.isArray($) ? $ : $ && typeof $ == "object" ? [$] : [];
      }
      function b() {
        const $ = e.closest("[x-data]");
        return $ ? t.$data($) : null;
      }
      function E($, M = !1) {
        const w = b();
        if (!w?.timeline) return Promise.resolve();
        const v = w.timeline();
        if (M) {
          for (let I = $.length - 1; I >= 0; I--)
            v.step($[I]);
          v.reverse();
        } else
          for (const I of $)
            I.parallel ? v.parallel(I.parallel) : v.step(I);
        return p = v, v.play().then(() => {
          p === v && (p = null);
        });
      }
      function S($ = !1) {
        if (c && m) return;
        m = !0;
        const M = P();
        if (M.length === 0) return;
        const w = () => E(M, $);
        u ? (g.push(w), k()) : (p?.stop(), p = null, g = [], y = !1, w());
      }
      async function k() {
        if (!y) {
          for (y = !0; g.length > 0; )
            await g.shift()();
          y = !1;
        }
      }
      if (f) {
        s(() => {
          const $ = P(), M = b();
          M?.registerAnimation && M.registerAnimation(f, $);
        }), l(() => {
          const $ = b();
          $?.unregisterAnimation && $.unregisterAnimation(f);
        });
        return;
      }
      const N = () => {
        d && h === "click" ? (S(x), x = !x) : S(!1);
      };
      e.addEventListener(h, N);
      let _ = null, C = null;
      d && h !== "click" && (C = Hp[h] ?? null, C && (_ = () => S(!0), e.addEventListener(C, _))), l(() => {
        p?.stop(), e.removeEventListener(h, N), C && _ && e.removeEventListener(C, _);
      });
    }
  );
}
function Op(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? _e, a = t.dimensions?.height ?? Ee, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + l) * n.zoom + n.x, f = (s + a) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function zp(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !Op(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function Vp(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, l = null, a = [], c = !1, d = "idle", u = 0;
      function f() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const x = f();
        if (!x?.timeline) return Promise.resolve();
        const P = x.timeline(), b = m.speed ?? 1, E = m.autoFitView === !0, S = m.fitViewPadding ?? 0.1, k = x.viewport, N = x.getContainerDimensions?.();
        for (const _ of y) {
          const C = b !== 1 ? {
            ..._,
            duration: _.duration !== void 0 ? _.duration / b : void 0,
            delay: _.delay !== void 0 ? _.delay / b : void 0
          } : _;
          if (C.parallel) {
            const $ = C.parallel.map(
              (M) => b !== 1 ? {
                ...M,
                duration: M.duration !== void 0 ? M.duration / b : void 0,
                delay: M.delay !== void 0 ? M.delay / b : void 0
              } : M
            );
            P.parallel($);
          } else if (E && k && N && zp(C, x, k, N.width, N.height)) {
            const $ = {
              fitView: !0,
              fitViewPadding: S,
              duration: C.duration,
              easing: C.easing
            };
            P.parallel([C, $]);
          } else
            P.step(C);
        }
        if (m.lock && P.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const _ = m.loop === !0 ? 0 : m.loop;
          P.loop(_);
        }
        return m.respectReducedMotion !== void 0 && P.respectReducedMotion(m.respectReducedMotion), l = P, d = "playing", c = !0, P.play().then(() => {
          l === P && (l = null, d = "idle", c = !1);
        });
      }
      async function p(y) {
        if (a.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          l?.stop(), l = null, c = !1, d = "idle";
          const x = [a[a.length - 1]];
          s += a.length, a = [], await h(x, y);
        } else {
          const x = [...a];
          s += x.length, a = [], c && await new Promise((b) => {
            l ? (l.on("complete", () => b()), l.on("stop", () => b())) : b();
          }), await h(x, y);
        }
      }
      const g = {
        async play() {
          const y = o(n), m = y.steps ?? [];
          s < m.length && (a = m.slice(s), await p(y));
        },
        stop() {
          l?.stop(), l = null, c = !1, d = "stopped", a = [];
        },
        reset(y) {
          if (l?.stop(), l = null, c = !1, d = "idle", s = 0, a = [], u = 0, y) {
            const m = o(n), x = m.steps ?? [];
            if (x.length > 0)
              return a = [...x], p(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = g, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, x = y.autoplay !== !1;
        if (m.length > u) {
          const P = m.slice(Math.max(s, u));
          u = m.length, P.length > 0 && x && (a.push(...P), p(y));
        } else
          u = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function Bp(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("all"), a = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f);
        if (!h) return;
        if (l) {
          for (const g of h.nodes)
            a ? h.expandNode?.(g.id, { animate: !d }) : h.collapseNode?.(g.id, { animate: !d });
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        if (c && n) {
          const g = i(n);
          if (!g) return;
          for (const y of h.nodes)
            y.parentId === g && (a ? h.expandNode?.(y.id, { animate: !d }) : h.collapseNode?.(y.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(a));
          return;
        }
        const p = i(n);
        !p || !h?.toggleNode || h.toggleNode(p, { animate: !d });
      };
      e.addEventListener("click", u), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !l && !c && r(() => {
        const f = i(n);
        if (!f) return;
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const p = t.$data(h);
        if (!p?.isCollapsed) return;
        const g = p.isCollapsed(f);
        e.setAttribute("aria-expanded", String(!g));
        const y = e.closest("[x-flow-node]");
        y && e.setAttribute("aria-controls", y.id || f);
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function qp(t) {
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
        const u = d.isCondensed(a);
        e.setAttribute("aria-expanded", String(!u));
      }), s(() => {
        e.removeEventListener("click", l);
      });
    }
  );
}
function Io(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Yp(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      try {
        const E = s.closest(".flow-container");
        return E ? !!t.$data?.(E)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const E = s.closest(".flow-container");
        return E ? !!t.$data?.(E)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    }, d = () => {
      try {
        const E = s.closest(".flow-container");
        return E ? t.$data?.(E) ?? null : null;
      } catch {
        return null;
      }
    }, u = () => {
      t.nextTick(() => {
        const E = d();
        if (!E) return;
        const S = t.raw(E);
        if (S._schemaMetrics != null) return;
        const k = s.querySelector(":scope > .flow-schema-header"), N = s.querySelector(":scope > .flow-schema-body"), _ = s.querySelectorAll(".flow-schema-row");
        if (_.length < 2) return;
        const C = _[0], $ = _[1], M = _[_.length - 1], w = C.querySelector(".flow-schema-handle"), v = M.querySelector(".flow-schema-handle");
        if (!k || !N || !w || !v) return;
        const I = s.closest("[data-flow-node-id]") ?? s, L = S.viewport?.zoom || 1, R = I.getBoundingClientRect(), U = k.getBoundingClientRect(), te = N.getBoundingClientRect(), K = C.getBoundingClientRect(), T = $.getBoundingClientRect(), A = M.getBoundingClientRect(), H = w.getBoundingClientRect(), ae = v.getBoundingClientRect(), le = (T.top - K.top) / L, ie = A.height / L;
        if (le <= 0 || ie <= 0) return;
        const V = {
          headerHeight: U.height / L,
          rowHeight: le,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast: ie,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (H.top + H.height / 2 - K.top) / L,
          handleOffsetYLast: (ae.top + ae.height / 2 - A.top) / L,
          insetLeft: (K.left - R.left) / L,
          insetRight: (R.right - K.right) / L,
          insetTop: (U.top - R.top) / L,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (R.bottom - te.bottom) / L,
          handleWidth: H.width / L,
          handleHeight: H.height / L
        };
        S._schemaMetrics = V;
      });
    };
    s.classList.add("flow-schema-node");
    let f = s.closest("[data-flow-node-id]"), h = !1;
    f ? f.setAttribute("data-flow-schema-node", "") : t.nextTick(() => {
      h || !s.isConnected || (f = s.closest("[data-flow-node-id]"), f?.setAttribute("data-flow-schema-node", ""));
    });
    let p = null, g = null;
    const y = /* @__PURE__ */ new Map(), m = () => {
      p && g || (Io(s), y.clear(), p = document.createElement("div"), p.className = "flow-schema-header", s.appendChild(p), g = document.createElement("div"), g.className = "flow-schema-body", s.appendChild(g));
    }, x = () => {
      const E = l(), S = E?.data;
      if (!S) {
        for (const v of y.values())
          t.destroyTree(v);
        y.clear(), Io(s), p = null, g = null;
        return;
      }
      m();
      const k = typeof S.label == "string" ? S.label : "", N = Array.isArray(S.fields) ? S.fields : [], _ = typeof E?.id == "string" ? E.id : "";
      typeof S.kind == "string" && S.kind ? s.setAttribute("data-flow-schema-kind", S.kind) : s.removeAttribute("data-flow-schema-kind"), p.textContent !== k && (p.textContent = k);
      const C = a(), $ = c(), M = /* @__PURE__ */ new Set();
      for (const v of N) {
        M.add(v.name);
        const I = y.get(v.name);
        if (I)
          P(I, v);
        else {
          const L = b(v, _, C, $);
          y.set(v.name, L), g.appendChild(L), t.initTree(L);
        }
      }
      for (const [v, I] of y)
        M.has(v) || (t.destroyTree(I), I.remove(), y.delete(v));
      let w = g.firstChild;
      for (const v of N) {
        const I = y.get(v.name);
        I && (w === I ? w = w.nextSibling : g.insertBefore(I, w));
      }
      u();
    }, P = (E, S) => {
      E.dataset.flowSchemaField !== S.name && (E.dataset.flowSchemaField = S.name), E.classList.toggle("flow-schema-row--pk", S.key === "primary"), E.classList.toggle("flow-schema-row--fk", S.key === "foreign"), E.classList.toggle("flow-schema-row--required", !!S.required);
      let k = E.querySelector(".flow-schema-row-icon");
      const N = E.querySelector(".flow-schema-row-name");
      S.icon ? (k || (k = document.createElement("span"), k.className = "flow-schema-row-icon", E.insertBefore(k, N)), k.textContent !== S.icon && (k.textContent = S.icon)) : k && k.remove(), N && N.textContent !== S.name && (N.textContent = S.name);
      const _ = E.querySelector(".flow-schema-row-type");
      _ && _.textContent !== S.type && (_.textContent = S.type);
    }, b = (E, S, k, N) => {
      const _ = document.createElement("div");
      _.className = "flow-schema-row", _.dataset.flowSchemaField = E.name, E.key === "primary" && _.classList.add("flow-schema-row--pk"), E.key === "foreign" && _.classList.add("flow-schema-row--fk"), E.required && _.classList.add("flow-schema-row--required"), S && _.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${S}.${E.name}`)
      ), k && _.setAttribute("x-schema-reorderable", ""), N && S && _.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${S}.${E.name}`)
      );
      const C = document.createElement("div");
      if (C.className = "flow-schema-handle flow-schema-handle--target", C.setAttribute("x-flow-handle:target.left", JSON.stringify(E.name)), _.appendChild(C), E.icon) {
        const L = document.createElement("span");
        L.className = "flow-schema-row-icon", L.textContent = E.icon, _.appendChild(L);
      }
      const $ = document.createElement("span");
      $.className = "flow-schema-row-name", $.textContent = E.name, _.appendChild($);
      const M = document.createElement("span");
      M.className = "flow-schema-row-type", M.textContent = E.type, _.appendChild(M);
      const w = document.createElement("div");
      w.className = "flow-schema-handle flow-schema-handle--source", w.setAttribute("x-flow-handle:source.right", JSON.stringify(E.name)), _.appendChild(w);
      const v = document.createElement("div");
      v.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", v.setAttribute("x-flow-handle:target.right", JSON.stringify(E.name)), _.appendChild(v);
      const I = document.createElement("div");
      return I.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", I.setAttribute("x-flow-handle:source.left", JSON.stringify(E.name)), _.appendChild(I), _;
    };
    i(() => {
      if (!s.isConnected) return;
      const E = l()?.data;
      E?.label, E?.kind;
      const S = E?.fields;
      if (Array.isArray(S))
        for (const k of S)
          k.name, k.type, k.key, k.required, k.icon;
      x();
    }), r(() => {
      h = !0;
      for (const E of y.values())
        t.destroyTree(E);
      y.clear(), Io(s), p = null, g = null, s.classList.remove("flow-schema-node"), f?.removeAttribute("data-flow-schema-node");
    });
  });
}
function Xp(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Vs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Wp(t) {
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
      Vs(s);
      const d = l()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, p = document.createElement("div");
      if (p.className = "flow-wait-header", f) {
        const P = document.createElement("span");
        P.className = "flow-wait-icon", P.textContent = f, p.appendChild(P);
      }
      const g = document.createElement("span");
      g.className = "flow-wait-label", g.textContent = u, p.appendChild(g);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = Xp(h), p.appendChild(y), s.appendChild(p);
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
      Vs(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Bs = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function cn(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(cn).join(", ")}]` : String(t);
}
function jp(t) {
  const { field: e, op: n, value: o } = t;
  return n in Bs ? `${e} ${Bs[n]} ${cn(o)}` : n === "in" ? `${e} in ${cn(o)}` : n === "notIn" ? `${e} not in ${cn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${cn(o)}`;
}
function qs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Up(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Zp(t) {
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
      const u = l()?.data ?? {}, f = Up(a(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), qs(s);
      const p = typeof u.label == "string" && u.label ? u.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const y = document.createElement("div");
      y.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? y.textContent = jp(u.condition) : typeof u.evaluate == "function" ? y.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-condition-handle-source flow-condition-handle--true", x.setAttribute("data-flow-handle-direction", "source"), x.setAttribute("data-source-handle", "true"), x.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(x);
      const P = document.createElement("div");
      P.className = "flow-condition-handle-source flow-condition-handle--false", P.setAttribute("data-flow-handle-direction", "source"), P.setAttribute("data-source-handle", "false"), P.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(P), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      qs(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Gp(t) {
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
function Kp(t) {
  t.directive(
    "flow-detail",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      if (n) {
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = e.style.display;
        r(() => {
          const p = i(n), g = f.viewport.zoom, y = p.min === void 0 || g >= p.min, m = p.max === void 0 || g <= p.max;
          e.style.display = y && m ? h : "none";
        }), s(() => {
          e.style.display = h;
        });
        return;
      }
      const l = new Set(o.filter((u) => u === "far" || u === "medium" || u === "close"));
      if (l.size === 0) return;
      const a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?._zoomLevel) return;
      const d = e.style.display;
      r(() => {
        const u = c._zoomLevel;
        l.has(u) ? e.style.display = d : e.style.display = "none";
      }), s(() => {
        e.style.display = d;
      });
    }
  );
}
const Jp = ["perf", "events", "viewport", "state", "activity"], Ys = ["fps", "memory", "counts", "visible"], Xs = 30;
function Qp(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Jp.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function em(t) {
  return t.perf ? t.perf === !0 ? [...Ys] : t.perf.filter((e) => Ys.includes(e)) : [];
}
function tm(t) {
  return t.events ? t.events === !0 ? Xs : t.events.max ?? Xs : 0;
}
function on(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function Ve(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function nm(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = Qp(l, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (X) => X.stopPropagation();
      e.addEventListener("wheel", u);
      const f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      p.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(p), f.appendChild(h), e.appendChild(f);
      const g = document.createElement("div");
      g.className = "flow-devtools-panel", g.style.display = "none", g.style.userSelect = "none", e.appendChild(g);
      let y = !1;
      const m = () => {
        y = !y, g.style.display = y ? "" : "none", f.title = y ? "Collapse" : "Devtools", y ? ae() : le();
      };
      f.addEventListener("click", m);
      const x = em(a);
      let P = null, b = null, E = null, S = null, k = null;
      if (x.length > 0) {
        const { wrapper: X, content: G } = on("Performance", "flow-devtools-perf");
        if (x.includes("fps")) {
          const { row: Z, valueEl: D } = Ve("FPS", "flow-devtools-fps");
          P = D, G.appendChild(Z);
        }
        if (x.includes("memory")) {
          const { row: Z, valueEl: D } = Ve("Memory", "flow-devtools-memory");
          b = D, G.appendChild(Z);
        }
        if (x.includes("counts")) {
          const Z = Ve("Nodes", "flow-devtools-counts");
          E = Z.valueEl, G.appendChild(Z.row);
          const D = Ve("Edges", "flow-devtools-counts");
          S = D.valueEl, G.appendChild(D.row);
        }
        if (x.includes("visible")) {
          const { row: Z, valueEl: D } = Ve("Visible", "flow-devtools-visible");
          k = D, G.appendChild(Z);
        }
        g.appendChild(X);
      }
      const N = tm(a);
      let _ = null;
      if (N > 0) {
        const { wrapper: X, content: G } = on("Events", "flow-devtools-events"), Z = document.createElement("button");
        Z.className = "flow-devtools-clear-btn nopan", Z.textContent = "Clear", Z.addEventListener("click", () => {
          _ && (_.textContent = ""), ie.length = 0;
        }), X.querySelector(".flow-devtools-section-title").appendChild(Z), _ = document.createElement("div"), _.className = "flow-devtools-event-list", G.appendChild(_), g.appendChild(X);
      }
      let C = null, $ = null, M = null;
      if (a.viewport) {
        const { wrapper: X, content: G } = on("Viewport", "flow-devtools-viewport"), Z = Ve("X", "flow-devtools-vp-x");
        C = Z.valueEl, G.appendChild(Z.row);
        const D = Ve("Y", "flow-devtools-vp-y");
        $ = D.valueEl, G.appendChild(D.row);
        const B = Ve("Zoom", "flow-devtools-vp-zoom");
        M = B.valueEl, G.appendChild(B.row), g.appendChild(X);
      }
      let w = null;
      if (a.state) {
        const { wrapper: X, content: G } = on("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", G.appendChild(w), g.appendChild(X);
      }
      let v = null, I = null, L = null, R = null;
      if (a.activity) {
        const { wrapper: X, content: G } = on("Activity", "flow-devtools-activity"), Z = Ve("Animations", "flow-devtools-anim");
        v = Z.valueEl, G.appendChild(Z.row);
        const D = Ve("Particles", "flow-devtools-particles");
        I = D.valueEl, G.appendChild(D.row);
        const B = Ve("Follow", "flow-devtools-follow");
        L = B.valueEl, G.appendChild(B.row);
        const J = Ve("Timelines", "flow-devtools-timelines");
        R = J.valueEl, G.appendChild(J.row), g.appendChild(X);
      }
      let U = null, te = !1, K = 0, T = performance.now();
      const A = !!(P || b), H = () => {
        if (!te) return;
        K++;
        const X = performance.now();
        X - T >= 1e3 && (P && (P.textContent = String(Math.round(K * 1e3 / (X - T)))), K = 0, T = X, b && performance.memory && (b.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), U = requestAnimationFrame(H);
      }, ae = () => {
        !A || te || (te = !0, K = 0, T = performance.now(), U = requestAnimationFrame(H));
      }, le = () => {
        te = !1, U !== null && (cancelAnimationFrame(U), U = null);
      }, ie = [], V = [
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
      let z = null;
      if (N > 0 && _) {
        z = (X) => {
          if (!y) return;
          const G = X, Z = G.type.replace("flow-", "");
          let D = "";
          try {
            D = G.detail ? JSON.stringify(G.detail).slice(0, 80) : "";
          } catch {
            D = "[circular]";
          }
          ie.unshift({ name: Z, time: Date.now(), detail: D });
          const B = _, J = document.createElement("div");
          J.className = "flow-devtools-event-entry";
          const q = document.createElement("span");
          q.className = "flow-devtools-event-name", q.textContent = Z;
          const F = document.createElement("span");
          F.className = "flow-devtools-event-age", F.textContent = "now";
          const ne = document.createElement("span");
          for (ne.className = "flow-devtools-event-detail", ne.textContent = D, J.appendChild(q), J.appendChild(F), J.appendChild(ne), B.prepend(J); B.children.length > N; )
            B.removeChild(B.lastChild), ie.pop();
        };
        for (const X of V)
          d.addEventListener(X, z);
      }
      r(() => {
        const X = t.$data(c);
        !X || !X.viewport || (C && (C.textContent = Math.round(X.viewport.x).toString()), $ && ($.textContent = Math.round(X.viewport.y).toString()), M && (M.textContent = X.viewport.zoom.toFixed(2)));
      }), r(() => {
        const X = t.$data(c);
        if (X) {
          if (E && (E.textContent = String(X.nodes?.length ?? 0)), S && (S.textContent = String(X.edges?.length ?? 0)), k && X._getVisibleNodeIds && (k.textContent = String(X._getVisibleNodeIds().size)), w) {
            const G = X.selectedNodes, Z = X.selectedEdges;
            if (!((G?.size ?? 0) > 0 || (Z?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", G && G.size > 0)
                for (const B of G) {
                  const J = X.getNode?.(B);
                  if (!J) continue;
                  const q = document.createElement("pre");
                  q.className = "flow-devtools-json", q.textContent = JSON.stringify({ id: J.id, position: J.position, data: J.data }, null, 2), w.appendChild(q);
                }
              if (Z && Z.size > 0)
                for (const B of Z) {
                  const J = X.edges?.find((F) => F.id === B);
                  if (!J) continue;
                  const q = document.createElement("pre");
                  q.className = "flow-devtools-json", q.textContent = JSON.stringify({ id: J.id, source: J.source, target: J.target, type: J.type }, null, 2), w.appendChild(q);
                }
            }
          }
          if (v) {
            const G = X._animator?._groups?.size ?? 0;
            v.textContent = String(G);
          }
          I && (I.textContent = String(X._activeParticles?.size ?? 0)), L && (L.textContent = X._followHandle ? "Active" : "Idle"), R && (R.textContent = String(X._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (le(), f.removeEventListener("click", m), z)
          for (const X of V)
            d.removeEventListener(X, z);
        e.removeEventListener("wheel", u), e.textContent = "", P = null, b = null, E = null, S = null, k = null, _ = null, C = null, $ = null, M = null, w = null, v = null, I = null, L = null, R = null;
      });
    }
  );
}
const om = {
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
function im(t) {
  return om[t] ?? null;
}
function sm(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = im(n);
      if (!a)
        return;
      const c = e.closest("[data-flow-canvas]");
      if (!c)
        return;
      const d = t.$data(c);
      if (!d)
        return;
      const u = () => {
        const f = d[a.method];
        typeof f == "function" && (a.passExpression && o ? f.call(d, i(o)) : f.call(d));
      };
      e.addEventListener("click", u), (a.disabledWhen || a.aria) && r(() => {
        if (a.disabledWhen) {
          const f = a.disabledWhen(d);
          e.disabled = f, a.aria === "disabled" && e.setAttribute("aria-disabled", String(f));
        }
        a.aria === "pressed" && e.setAttribute("aria-pressed", String(!d.isInteractive));
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function rm(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Do = /* @__PURE__ */ new WeakMap();
function am(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = rm(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), Do.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Do.set(c, u);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = Do.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function lm(t) {
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
function cm(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("toggle"), a = e.closest("[data-flow-canvas]");
      if (!a) return;
      const c = t.$data(a);
      if (!c?.follow) return;
      let d = null;
      const u = (h) => {
        e.classList.toggle("flow-following", h), e.setAttribute("aria-pressed", String(h));
      }, f = () => {
        if (!n) return;
        const h = i(n), p = lm(h);
        if (!p) return;
        if (l && d) {
          d.stop(), d = null, u(!1);
          return;
        }
        d && d.stop();
        const g = {};
        p.zoom !== void 0 && (g.zoom = p.zoom), p.speed !== void 0 && (g.speed = p.speed), d = c.follow(p.target, g), u(!0), d?.finished && d.finished.then(() => {
          d = null, u(!1);
        });
      };
      e.addEventListener("click", f), s(() => {
        e.removeEventListener("click", f), d && (d.stop(), d = null);
      });
    }
  );
}
function dm(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Pi = /* @__PURE__ */ new Map();
function um(t, e) {
  Pi.set(t, e);
}
function fm(t) {
  return Pi.get(t) ?? null;
}
function hm(t) {
  return Pi.has(t);
}
function Ro(t) {
  return `alpineflow-snapshot-${t}`;
}
function gm(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = dm(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = () => {
        if (!o) return;
        const f = r(o);
        if (f)
          if (a.action === "save") {
            const h = d.toObject();
            a.persist ? localStorage.setItem(Ro(f), JSON.stringify(h)) : um(f, h);
          } else {
            let h = null;
            if (a.persist) {
              const p = localStorage.getItem(Ro(f));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = fm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), a.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        a.persist ? h = localStorage.getItem(Ro(f)) !== null : (d.nodes.length, h = hm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function pm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function mm(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(pm(s._loadingText));
      const a = n.includes("fade");
      a && e.classList.add("flow-loading-fade"), r.setAttribute("data-flow-loading-directive", "");
      let c = null;
      o(() => {
        if (s.isLoading)
          e.style.display = "flex", a && (e.classList.remove("flow-loading-fade-out"), c && (e.removeEventListener("transitionend", c), c = null));
        else if (a) {
          c && e.removeEventListener("transitionend", c), e.classList.add("flow-loading-fade-out");
          const u = () => {
            e.style.display = "none", e.removeEventListener("transitionend", u), c = null;
          };
          c = u, e.addEventListener("transitionend", u);
        } else
          e.style.display = "none";
      }), i(() => {
        c && (e.removeEventListener("transitionend", c), c = null), r.removeAttribute("data-flow-loading-directive"), e.style.display = "", e.classList.remove("flow-loading-overlay", "flow-loading-fade", "flow-loading-fade-out");
      });
    }
  );
}
function ym(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = e.closest("[data-flow-edge-id]");
      if (!l) return;
      const a = l.dataset.flowEdgeId, c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = c.querySelector(".flow-viewport");
      if (!u) return;
      try {
        const y = i("edge");
        y && t.addScopeToNode(e, { edge: y });
      } catch {
      }
      u.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const f = (y) => {
        y.stopPropagation();
      }, h = (y) => {
        y.stopPropagation();
      };
      e.addEventListener("pointerdown", f), e.addEventListener("click", h);
      const p = o.includes("below"), g = 20;
      r(() => {
        if (!d.edges.some((_) => _.id === a)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let x = 0.5;
        if (n) {
          const _ = i(n);
          typeof _ == "number" && (x = _);
        }
        const P = l.querySelectorAll("path"), b = P.length > 1 ? P[1] : P[0];
        if (!b) return;
        const E = b.getTotalLength?.();
        if (!E) return;
        const S = b.getPointAtLength(E * Math.max(0, Math.min(1, x))), k = m / y, N = p ? k : -k;
        e.style.left = `${S.x}px`, e.style.top = `${S.y + N}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function wm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function vm(t) {
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
function Py(t, e, n) {
  const o = n?.defaultDimensions?.width ?? _e, i = n?.defaultDimensions?.height ?? Ee, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", a = t.filter((m) => !m.hidden).map((m) => ({
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
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([x, P]) => `${x}:${P}`).join(";")
    } : {},
    data: m.data ?? {}
  })), u = e.filter((m) => !m.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const m of u) {
    const x = c.get(m.source), P = c.get(m.target);
    if (!x || !P)
      continue;
    let b, E;
    try {
      const C = co(
        m,
        x,
        P,
        x.sourcePosition ?? "bottom",
        P.targetPosition ?? "top"
      );
      b = C.path, E = C.labelPosition;
    } catch {
      continue;
    }
    let S, k;
    if (m.markerStart) {
      const C = Ft(m.markerStart), $ = Ot(C, s);
      h.has($) || h.set($, to(C, $)), S = `url(#${$})`;
    }
    if (m.markerEnd) {
      const C = Ft(m.markerEnd), $ = Ot(C, s);
      h.has($) || h.set($, to(C, $)), k = `url(#${$})`;
    }
    let N, _;
    if (m.label)
      if (E)
        N = E.x, _ = E.y;
      else {
        const C = x.position.x + x.dimensions.width / 2, $ = x.position.y + x.dimensions.height / 2, M = P.position.x + P.dimensions.width / 2, w = P.position.y + P.dimensions.height / 2;
        N = (C + M) / 2, _ = ($ + w) / 2;
      }
    f.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: b,
      ...S ? { markerStart: S } : {},
      ...k ? { markerEnd: k } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...N !== void 0 ? { labelX: N } : {},
      ..._ !== void 0 ? { labelY: _ } : {}
    });
  }
  const p = Array.from(h.values()).join(`
`);
  let g, y;
  if (a.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = Yt(a);
    g = {
      x: m.x - r,
      y: m.y - r,
      width: m.width + r * 2,
      height: m.height + r * 2
    }, y = {
      x: -g.x,
      y: -g.y,
      zoom: 1
    };
  }
  return {
    nodes: d,
    edges: f,
    markers: p,
    viewBox: g,
    viewport: y
  };
}
const Ws = /* @__PURE__ */ new WeakSet();
function My(t) {
  Ws.has(t) || (Ws.add(t), Ma(t), vm(t), Gg(t), ap(t), If(t), Cf(t), Sf(t), kf(t), Yg(t), up(t), pp(t), mp(t), wp(t), _p(t), Np(t), $p(t), Rp(t), Fp(t), Vp(t), Bp(t), qp(t), Gp(t), Kp(t), nm(t), sm(t), am(t), cm(t), gm(t), mm(t), ym(t), Yp(t), Wp(t), Zp(t), wm(t));
}
function _m(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function bm(t, e, n, o) {
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
async function xm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => vy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const C = t.querySelectorAll("[data-flow-culled]");
      for (const I of C)
        I.style.display = "", m.push(I);
      const $ = n.filter((I) => !I.hidden), M = Yt($), w = i.padding ?? 0.1, v = Jn(
        M,
        a,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        w
      );
      e.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.zoom})`, e.style.width = `${a}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${a}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((C) => requestAnimationFrame(C));
    const x = i.includeOverlays, P = x === !0, b = typeof x == "object" ? x : {}, E = [
      ["canvas-overlay", P || (b.toolbar ?? !1)],
      ["flow-minimap", P || (b.minimap ?? !1)],
      ["flow-controls", P || (b.controls ?? !1)],
      ["flow-panel", P || (b.panels ?? !1)],
      ["flow-selection-box", !1]
    ], S = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (C) => {
        if (C.classList) {
          for (const [$, M] of E)
            if (C.classList.contains($) && !M) return !1;
        }
        return !0;
      }
    }), N = _m(decodeURIComponent(S.substring("data:image/svg+xml;charset=utf-8,".length))), _ = await bm(N, a, c, d);
    if (i.filename) {
      const C = document.createElement("a");
      C.download = i.filename, C.href = _, C.click();
    }
    return _;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = y;
    for (const x of m)
      x.style.display = "none";
  }
}
const Em = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: xm
}, Symbol.toStringTag, { value: "Module" }));
function Cm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const Sm = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function yt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Nt = null;
function va(t = {}) {
  return Nt || (t.includeStyleProperties ? (Nt = t.includeStyleProperties, Nt) : (Nt = yt(window.getComputedStyle(document.documentElement)), Nt));
}
function ho(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function km(t) {
  const e = ho(t, "border-left-width"), n = ho(t, "border-right-width");
  return t.clientWidth + e + n;
}
function Lm(t) {
  const e = ho(t, "border-top-width"), n = ho(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Mi(t, e = {}) {
  const n = e.width || km(t), o = e.height || Lm(t);
  return { width: n, height: o };
}
function Pm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Re = 16384;
function Mm(t) {
  (t.width > Re || t.height > Re) && (t.width > Re && t.height > Re ? t.width > t.height ? (t.height *= Re / t.width, t.width = Re) : (t.width *= Re / t.height, t.height = Re) : t.width > Re ? (t.height *= Re / t.width, t.width = Re) : (t.width *= Re / t.height, t.height = Re));
}
function Tm(t, e = {}) {
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
function go(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function Am(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Nm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), Am(i);
}
const Ie = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ie(n, e);
};
function $m(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function Im(t, e) {
  return va(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function Dm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? $m(n) : Im(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function js(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = Sm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(Dm(s, n, i, o)), e.appendChild(l);
}
function Rm(t, e, n) {
  js(t, e, ":before", n), js(t, e, ":after", n);
}
const Us = "application/font-woff", Zs = "image/jpeg", Hm = {
  woff: Us,
  woff2: Us,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Zs,
  jpeg: Zs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Fm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Ti(t) {
  const e = Fm(t).toLowerCase();
  return Hm[e] || "";
}
function Om(t) {
  return t.split(/,/)[1];
}
function ai(t) {
  return t.search(/^(data:)/) !== -1;
}
function zm(t, e) {
  return `data:${e};base64,${t}`;
}
async function _a(t, e, n) {
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
const Ho = {};
function Vm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Ai(t, e, n) {
  const o = Vm(t, e, n.includeQueryParams);
  if (Ho[o] != null)
    return Ho[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await _a(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), Om(l)));
    i = zm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Ho[o] = i, i;
}
async function Bm(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : go(e);
}
async function qm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return go(l);
  }
  const n = t.poster, o = Ti(n), i = await Ai(n, o, e);
  return go(i);
}
async function Ym(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await _o(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Xm(t, e) {
  return Ie(t, HTMLCanvasElement) ? Bm(t) : Ie(t, HTMLVideoElement) ? qm(t, e) : Ie(t, HTMLIFrameElement) ? Ym(t, e) : t.cloneNode(ba(t));
}
const Wm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", ba = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function jm(t, e, n) {
  var o, i;
  if (ba(e))
    return e;
  let r = [];
  return Wm(t) && t.assignedNodes ? r = yt(t.assignedNodes()) : Ie(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = yt(t.contentDocument.body.childNodes) : r = yt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ie(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => _o(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Um(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : va(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ie(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Zm(t, e) {
  Ie(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ie(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Gm(t, e) {
  if (Ie(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Km(t, e, n) {
  return Ie(e, Element) && (Um(t, e, n), Rm(t, e, n), Zm(t, e), Gm(t, e)), e;
}
async function Jm(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const l = n[r].getAttribute("xlink:href");
    if (l) {
      const a = t.querySelector(l), c = document.querySelector(l);
      !a && c && !o[l] && (o[l] = await _o(c, e, !0));
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
async function _o(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Xm(o, e)).then((o) => jm(t, o, e)).then((o) => Km(t, o, e)).then((o) => Jm(o, e));
}
const xa = /url\((['"]?)([^'"]+?)\1\)/g, Qm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, ey = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function ty(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function ny(t) {
  const e = [];
  return t.replace(xa, (n, o, i) => (e.push(i), n)), e.filter((n) => !ai(n));
}
async function oy(t, e, n, o, i) {
  try {
    const r = n ? Cm(e, n) : e, s = Ti(e);
    let l;
    return i || (l = await Ai(r, s, o)), t.replace(ty(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function iy(t, { preferredFontFormat: e }) {
  return e ? t.replace(ey, (n) => {
    for (; ; ) {
      const [o, , i] = Qm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function Ea(t) {
  return t.search(xa) !== -1;
}
async function Ca(t, e, n) {
  if (!Ea(t))
    return t;
  const o = iy(t, n);
  return ny(o).reduce((r, s) => r.then((l) => oy(l, s, e, n)), Promise.resolve(o));
}
async function $t(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Ca(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function sy(t, e) {
  await $t("background", t, e) || await $t("background-image", t, e), await $t("mask", t, e) || await $t("-webkit-mask", t, e) || await $t("mask-image", t, e) || await $t("-webkit-mask-image", t, e);
}
async function ry(t, e) {
  const n = Ie(t, HTMLImageElement);
  if (!(n && !ai(t.src)) && !(Ie(t, SVGImageElement) && !ai(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Ai(o, Ti(o), e);
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
async function ay(t, e) {
  const o = yt(t.childNodes).map((i) => Sa(i, e));
  await Promise.all(o).then(() => t);
}
async function Sa(t, e) {
  Ie(t, Element) && (await sy(t, e), await ry(t, e), await ay(t, e));
}
function ly(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Gs = {};
async function Ks(t) {
  let e = Gs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Gs[t] = e, e;
}
async function Js(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), _a(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function Qs(t) {
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
async function cy(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        yt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = Ks(a).then((d) => Js(d, e)).then((d) => Qs(d).forEach((u) => {
              try {
                i.insertRule(u, u.startsWith("@import") ? l += 1 : i.cssRules.length);
              } catch (f) {
                console.error("Error inserting rule from remote css", {
                  rule: u,
                  error: f
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
        i.href != null && o.push(Ks(i.href).then((l) => Js(l, e)).then((l) => Qs(l).forEach((a) => {
          s.insertRule(a, s.cssRules.length);
        })).catch((l) => {
          console.error("Error loading remote stylesheet", l);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        yt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function dy(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Ea(e.style.getPropertyValue("src")));
}
async function uy(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = yt(t.ownerDocument.styleSheets), o = await cy(n, e);
  return dy(o);
}
function ka(t) {
  return t.trim().replace(/["']/g, "");
}
function fy(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(ka(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function La(t, e) {
  const n = await uy(t, e), o = fy(t);
  return (await Promise.all(n.filter((r) => o.has(ka(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Ca(r.cssText, s, e);
  }))).join(`
`);
}
async function hy(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await La(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function Pa(t, e = {}) {
  const { width: n, height: o } = Mi(t, e), i = await _o(t, e, !0);
  return await hy(i, e), await Sa(i, e), ly(i, e), await Nm(i, n, o);
}
async function Sn(t, e = {}) {
  const { width: n, height: o } = Mi(t, e), i = await Pa(t, e), r = await go(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || Pm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || Mm(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function gy(t, e = {}) {
  const { width: n, height: o } = Mi(t, e);
  return (await Sn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function py(t, e = {}) {
  return (await Sn(t, e)).toDataURL();
}
async function my(t, e = {}) {
  return (await Sn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function yy(t, e = {}) {
  const n = await Sn(t, e);
  return await Tm(n);
}
async function wy(t, e = {}) {
  return La(t, e);
}
const vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: wy,
  toBlob: yy,
  toCanvas: Sn,
  toJpeg: my,
  toPixelData: gy,
  toPng: py,
  toSvg: Pa
}, Symbol.toStringTag, { value: "Module" }));
export {
  uh as ComputeEngine,
  ju as FlowHistory,
  hs as SHORTCUT_DEFAULTS,
  Ey as along,
  xf as areNodesConnected,
  Kr as buildNodeMap,
  Qr as clampToExtent,
  ko as clampToParent,
  Py as computeRenderPlan,
  vs as computeValidationErrors,
  Jr as computeZIndex,
  My as default,
  Sy as drift,
  Qf as expandParentToFitChild,
  ei as getAbsolutePosition,
  Af as getAutoPanDelta,
  no as getBezierPath,
  vf as getConnectedEdges,
  mt as getDescendantIds,
  As as getEdgePosition,
  fa as getFloatingEdgeParams,
  _f as getIncomers,
  Ts as getNodeIntersection,
  Yt as getNodesBounds,
  wf as getNodesFullyInPolygon,
  Vu as getNodesFullyInRect,
  yf as getNodesInPolygon,
  zu as getNodesInRect,
  Ko as getOutgoers,
  _y as getSimpleBezierPath,
  Ly as getSimpleFloatingPosition,
  _n as getSmoothStepPath,
  Tf as getStepPath,
  Yr as getStraightPath,
  Jn as getViewportForBounds,
  Be as isConnectable,
  Lf as isDeletable,
  qr as isDraggable,
  ds as isResizable,
  Jo as isSelectable,
  Ze as matchesKey,
  pt as matchesModifier,
  by as orbit,
  Cy as pendulum,
  bi as pointInPolygon,
  mf as polygonIntersectsAABB,
  nf as registerMarker,
  fn as resolveChildValidation,
  Df as resolveShortcuts,
  Pt as sortNodesTopological,
  ky as stagger,
  kt as toAbsoluteNode,
  ro as toAbsoluteNodes,
  oa as validateChildAdd,
  ao as validateChildRemove,
  xy as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
