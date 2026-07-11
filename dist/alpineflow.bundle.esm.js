let Do = null;
function Ea(t) {
  Do = t;
}
function Le() {
  if (!Do)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Do;
}
var Ca = { value: () => {
} };
function fo() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Dn(n);
}
function Dn(t) {
  this._ = t;
}
function Sa(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Dn.prototype = fo.prototype = {
  constructor: Dn,
  on: function(t, e) {
    var n = this._, o = Sa(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = ka(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Ai(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Ai(n[i], t.name, null);
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
function ka(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Ai(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Ca, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Ro = "http://www.w3.org/1999/xhtml";
const Ni = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ro,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ho(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Ni.hasOwnProperty(e) ? { space: Ni[e], local: t } : t;
}
function La(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Ro && e.documentElement.namespaceURI === Ro ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Pa(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function js(t) {
  var e = ho(t);
  return (e.local ? Pa : La)(e);
}
function Ma() {
}
function si(t) {
  return t == null ? Ma : function() {
    return this.querySelector(t);
  };
}
function Ta(t) {
  typeof t != "function" && (t = si(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new He(o, this._parents);
}
function Aa(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Na() {
  return [];
}
function Us(t) {
  return t == null ? Na : function() {
    return this.querySelectorAll(t);
  };
}
function $a(t) {
  return function() {
    return Aa(t.apply(this, arguments));
  };
}
function Ia(t) {
  typeof t == "function" ? t = $a(t) : t = Us(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new He(o, i);
}
function Zs(t) {
  return function() {
    return this.matches(t);
  };
}
function Ks(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Da = Array.prototype.find;
function Ra(t) {
  return function() {
    return Da.call(this.children, t);
  };
}
function Fa() {
  return this.firstElementChild;
}
function Ha(t) {
  return this.select(t == null ? Fa : Ra(typeof t == "function" ? t : Ks(t)));
}
var Oa = Array.prototype.filter;
function za() {
  return Array.from(this.children);
}
function Va(t) {
  return function() {
    return Oa.call(this.children, t);
  };
}
function Ba(t) {
  return this.selectAll(t == null ? za : Va(typeof t == "function" ? t : Ks(t)));
}
function qa(t) {
  typeof t != "function" && (t = Zs(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new He(o, this._parents);
}
function Gs(t) {
  return new Array(t.length);
}
function Xa() {
  return new He(this._enter || this._groups.map(Gs), this._parents);
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
function Ya(t) {
  return function() {
    return t;
  };
}
function Wa(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new Vn(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function ja(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (f[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < u; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new Vn(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(f[l]) === a && (i[l] = a);
}
function Ua(t) {
  return t.__data__;
}
function Za(t, e) {
  if (!arguments.length) return Array.from(this, Ua);
  var n = e ? ja : Wa, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Ya(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = Ka(t.call(d, d && d.__data__, c, o)), g = h.length, p = l[c] = new Array(g), y = s[c] = new Array(g), m = a[c] = new Array(f);
    n(d, u, p, y, m, h, e);
    for (var v = 0, C = 0, _, k; v < g; ++v)
      if (_ = p[v]) {
        for (v >= C && (C = v + 1); !(k = y[C]) && ++C < g; ) ;
        _._next = k || null;
      }
  }
  return s = new He(s, o), s._enter = l, s._exit = a, s;
}
function Ka(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Ga() {
  return new He(this._exit || this._groups.map(Gs), this._parents);
}
function Ja(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Qa(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], u = c.length, f = l[a] = new Array(u), h, g = 0; g < u; ++g)
      (h = c[g] || d[g]) && (f[g] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new He(l, this._parents);
}
function el() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function tl(t) {
  t || (t = nl);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], l = s.length, a = i[r] = new Array(l), c, d = 0; d < l; ++d)
      (c = s[d]) && (a[d] = c);
    a.sort(e);
  }
  return new He(i, this._parents).order();
}
function nl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function ol() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function il() {
  return Array.from(this);
}
function sl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function rl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function al() {
  return !this.node();
}
function ll(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function cl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function dl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ul(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function fl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function hl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function pl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function gl(t, e) {
  var n = ho(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? dl : cl : typeof e == "function" ? n.local ? pl : hl : n.local ? fl : ul)(n, e));
}
function Js(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function ml(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function yl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function wl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function vl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? ml : typeof e == "function" ? wl : yl)(t, e, n ?? "")) : zt(this.node(), t);
}
function zt(t, e) {
  return t.style.getPropertyValue(e) || Js(t).getComputedStyle(t, null).getPropertyValue(e);
}
function _l(t) {
  return function() {
    delete this[t];
  };
}
function bl(t, e) {
  return function() {
    this[t] = e;
  };
}
function xl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function El(t, e) {
  return arguments.length > 1 ? this.each((e == null ? _l : typeof e == "function" ? xl : bl)(t, e)) : this.node()[t];
}
function Qs(t) {
  return t.trim().split(/^|\s+/);
}
function ri(t) {
  return t.classList || new er(t);
}
function er(t) {
  this._node = t, this._names = Qs(t.getAttribute("class") || "");
}
er.prototype = {
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
function tr(t, e) {
  for (var n = ri(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function nr(t, e) {
  for (var n = ri(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Cl(t) {
  return function() {
    tr(this, t);
  };
}
function Sl(t) {
  return function() {
    nr(this, t);
  };
}
function kl(t, e) {
  return function() {
    (e.apply(this, arguments) ? tr : nr)(this, t);
  };
}
function Ll(t, e) {
  var n = Qs(t + "");
  if (arguments.length < 2) {
    for (var o = ri(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? kl : e ? Cl : Sl)(n, e));
}
function Pl() {
  this.textContent = "";
}
function Ml(t) {
  return function() {
    this.textContent = t;
  };
}
function Tl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Al(t) {
  return arguments.length ? this.each(t == null ? Pl : (typeof t == "function" ? Tl : Ml)(t)) : this.node().textContent;
}
function Nl() {
  this.innerHTML = "";
}
function $l(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Il(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Dl(t) {
  return arguments.length ? this.each(t == null ? Nl : (typeof t == "function" ? Il : $l)(t)) : this.node().innerHTML;
}
function Rl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Fl() {
  return this.each(Rl);
}
function Hl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Ol() {
  return this.each(Hl);
}
function zl(t) {
  var e = typeof t == "function" ? t : js(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Vl() {
  return null;
}
function Bl(t, e) {
  var n = typeof t == "function" ? t : js(t), o = e == null ? Vl : typeof e == "function" ? e : si(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function ql() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Xl() {
  return this.each(ql);
}
function Yl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Wl() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function jl(t) {
  return this.select(t ? Wl : Yl);
}
function Ul(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Zl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Kl(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function Gl(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Jl(t, e, n) {
  return function() {
    var o = this.__on, i, r = Zl(e);
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
function Ql(t, e, n) {
  var o = Kl(t + ""), i, r = o.length, s;
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
  for (l = e ? Jl : Gl, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function or(t, e, n) {
  var o = Js(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function ec(t, e) {
  return function() {
    return or(this, t, e);
  };
}
function tc(t, e) {
  return function() {
    return or(this, t, e.apply(this, arguments));
  };
}
function nc(t, e) {
  return this.each((typeof e == "function" ? tc : ec)(t, e));
}
function* oc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var ir = [null];
function He(t, e) {
  this._groups = t, this._parents = e;
}
function wn() {
  return new He([[document.documentElement]], ir);
}
function ic() {
  return this;
}
He.prototype = wn.prototype = {
  constructor: He,
  select: Ta,
  selectAll: Ia,
  selectChild: Ha,
  selectChildren: Ba,
  filter: qa,
  data: Za,
  enter: Xa,
  exit: Ga,
  join: Ja,
  merge: Qa,
  selection: ic,
  order: el,
  sort: tl,
  call: ol,
  nodes: il,
  node: sl,
  size: rl,
  empty: al,
  each: ll,
  attr: gl,
  style: vl,
  property: El,
  classed: Ll,
  text: Al,
  html: Dl,
  raise: Fl,
  lower: Ol,
  append: zl,
  insert: Bl,
  remove: Xl,
  clone: jl,
  datum: Ul,
  on: Ql,
  dispatch: nc,
  [Symbol.iterator]: oc
};
function Ve(t) {
  return typeof t == "string" ? new He([[document.querySelector(t)]], [document.documentElement]) : new He([[t]], ir);
}
function sc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ze(t, e) {
  if (t = sc(t), e === void 0 && (e = t.currentTarget), e) {
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
const rc = { passive: !1 }, dn = { capture: !0, passive: !1 };
function wo(t) {
  t.stopImmediatePropagation();
}
function $t(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function sr(t) {
  var e = t.document.documentElement, n = Ve(t).on("dragstart.drag", $t, dn);
  "onselectstart" in e ? n.on("selectstart.drag", $t, dn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function rr(t, e) {
  var n = t.document.documentElement, o = Ve(t).on("dragstart.drag", null);
  e && (o.on("click.drag", $t, dn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const En = (t) => () => t;
function Fo(t, {
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
Fo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function ac(t) {
  return !t.ctrlKey && !t.button;
}
function lc() {
  return this.parentNode;
}
function cc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function dc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function uc() {
  var t = ac, e = lc, n = cc, o = dc, i = {}, r = fo("start", "drag", "end"), s = 0, l, a, c, d, u = 0;
  function f(_) {
    _.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, rc).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(_, k) {
    if (!(d || !t.call(this, _, k))) {
      var L = C(this, e.call(this, _, k), _, k, "mouse");
      L && (Ve(_.view).on("mousemove.drag", g, dn).on("mouseup.drag", p, dn), sr(_.view), wo(_), c = !1, l = _.clientX, a = _.clientY, L("start", _));
    }
  }
  function g(_) {
    if ($t(_), !c) {
      var k = _.clientX - l, L = _.clientY - a;
      c = k * k + L * L > u;
    }
    i.mouse("drag", _);
  }
  function p(_) {
    Ve(_.view).on("mousemove.drag mouseup.drag", null), rr(_.view, c), $t(_), i.mouse("end", _);
  }
  function y(_, k) {
    if (t.call(this, _, k)) {
      var L = _.changedTouches, P = e.call(this, _, k), $ = L.length, x, E;
      for (x = 0; x < $; ++x)
        (E = C(this, P, _, k, L[x].identifier, L[x])) && (wo(_), E("start", _, L[x]));
    }
  }
  function m(_) {
    var k = _.changedTouches, L = k.length, P, $;
    for (P = 0; P < L; ++P)
      ($ = i[k[P].identifier]) && ($t(_), $("drag", _, k[P]));
  }
  function v(_) {
    var k = _.changedTouches, L = k.length, P, $;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), P = 0; P < L; ++P)
      ($ = i[k[P].identifier]) && (wo(_), $("end", _, k[P]));
  }
  function C(_, k, L, P, $, x) {
    var E = r.copy(), A = Ze(x || L, k), M, w, b;
    if ((b = n.call(_, new Fo("beforestart", {
      sourceEvent: L,
      target: f,
      identifier: $,
      active: s,
      x: A[0],
      y: A[1],
      dx: 0,
      dy: 0,
      dispatch: E
    }), P)) != null)
      return M = b.x - A[0] || 0, w = b.y - A[1] || 0, function D(T, O, W) {
        var S = A, N;
        switch (T) {
          case "start":
            i[$] = D, N = s++;
            break;
          case "end":
            delete i[$], --s;
          // falls through
          case "drag":
            A = Ze(W || O, k), N = s;
            break;
        }
        E.call(
          T,
          _,
          new Fo(T, {
            sourceEvent: O,
            subject: b,
            target: f,
            identifier: $,
            active: N,
            x: A[0] + M,
            y: A[1] + w,
            dx: A[0] - S[0],
            dy: A[1] - S[1],
            dispatch: E
          }),
          P
        );
      };
  }
  return f.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : En(!!_), f) : t;
  }, f.container = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : En(_), f) : e;
  }, f.subject = function(_) {
    return arguments.length ? (n = typeof _ == "function" ? _ : En(_), f) : n;
  }, f.touchable = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : En(!!_), f) : o;
  }, f.on = function() {
    var _ = r.on.apply(r, arguments);
    return _ === r ? f : _;
  }, f.clickDistance = function(_) {
    return arguments.length ? (u = (_ = +_) * _, f) : Math.sqrt(u);
  }, f;
}
function ai(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function ar(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function vn() {
}
var un = 0.7, Bn = 1 / un, It = "\\s*([+-]?\\d+)\\s*", fn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", fc = /^#([0-9a-f]{3,8})$/, hc = new RegExp(`^rgb\\(${It},${It},${It}\\)$`), pc = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`), gc = new RegExp(`^rgba\\(${It},${It},${It},${fn}\\)$`), mc = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${fn}\\)$`), yc = new RegExp(`^hsl\\(${fn},${Ye},${Ye}\\)$`), wc = new RegExp(`^hsla\\(${fn},${Ye},${Ye},${fn}\\)$`), $i = {
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
ai(vn, hn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ii,
  // Deprecated! Use color.formatHex.
  formatHex: Ii,
  formatHex8: vc,
  formatHsl: _c,
  formatRgb: Di,
  toString: Di
});
function Ii() {
  return this.rgb().formatHex();
}
function vc() {
  return this.rgb().formatHex8();
}
function _c() {
  return lr(this).formatHsl();
}
function Di() {
  return this.rgb().formatRgb();
}
function hn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = fc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Ri(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Cn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Cn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = hc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = pc.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = gc.exec(t)) ? Cn(e[1], e[2], e[3], e[4]) : (e = mc.exec(t)) ? Cn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = yc.exec(t)) ? Oi(e[1], e[2] / 100, e[3] / 100, 1) : (e = wc.exec(t)) ? Oi(e[1], e[2] / 100, e[3] / 100, e[4]) : $i.hasOwnProperty(t) ? Ri($i[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function Ri(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Cn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function bc(t) {
  return t instanceof vn || (t = hn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function Ho(t, e, n, o) {
  return arguments.length === 1 ? bc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
ai(Ne, Ho, ar(vn, {
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
    return new Ne(Et(this.r), Et(this.g), Et(this.b), qn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Fi,
  // Deprecated! Use color.formatHex.
  formatHex: Fi,
  formatHex8: xc,
  formatRgb: Hi,
  toString: Hi
}));
function Fi() {
  return `#${bt(this.r)}${bt(this.g)}${bt(this.b)}`;
}
function xc() {
  return `#${bt(this.r)}${bt(this.g)}${bt(this.b)}${bt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Hi() {
  const t = qn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Et(this.r)}, ${Et(this.g)}, ${Et(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function qn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Et(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function bt(t) {
  return t = Et(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Oi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Be(t, e, n, o);
}
function lr(t) {
  if (t instanceof Be) return new Be(t.h, t.s, t.l, t.opacity);
  if (t instanceof vn || (t = hn(t)), !t) return new Be();
  if (t instanceof Be) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new Be(s, l, a, t.opacity);
}
function Ec(t, e, n, o) {
  return arguments.length === 1 ? lr(t) : new Be(t, e, n, o ?? 1);
}
function Be(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
ai(Be, Ec, ar(vn, {
  brighter(t) {
    return t = t == null ? Bn : Math.pow(Bn, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? un : Math.pow(un, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      vo(t >= 240 ? t - 240 : t + 120, i, o),
      vo(t, i, o),
      vo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Be(zi(this.h), Sn(this.s), Sn(this.l), qn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = qn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${zi(this.h)}, ${Sn(this.s) * 100}%, ${Sn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function zi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Sn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function vo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const cr = (t) => () => t;
function Cc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Sc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function kc(t) {
  return (t = +t) == 1 ? dr : function(e, n) {
    return n - e ? Sc(e, n, t) : cr(isNaN(e) ? n : e);
  };
}
function dr(t, e) {
  var n = e - t;
  return n ? Cc(t, n) : cr(isNaN(t) ? e : t);
}
const Oo = (function t(e) {
  var n = kc(e);
  function o(i, r) {
    var s = n((i = Ho(i)).r, (r = Ho(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = dr(i.opacity, r.opacity);
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
var zo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, _o = new RegExp(zo.source, "g");
function Lc(t) {
  return function() {
    return t;
  };
}
function Pc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Mc(t, e) {
  var n = zo.lastIndex = _o.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = zo.exec(t)) && (i = _o.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: at(o, i) })), n = _o.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? Pc(a[0].x) : Lc(e) : (e = a.length, function(c) {
    for (var d = 0, u; d < e; ++d) l[(u = a[d]).i] = u.x(c);
    return l.join("");
  });
}
var Vi = 180 / Math.PI, Vo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function ur(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Vi,
    skewX: Math.atan(a) * Vi,
    scaleX: s,
    scaleY: l
  };
}
var kn;
function Tc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Vo : ur(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Ac(t) {
  return t == null || (kn || (kn = document.createElementNS("http://www.w3.org/2000/svg", "g")), kn.setAttribute("transform", t), !(t = kn.transform.baseVal.consolidate())) ? Vo : (t = t.matrix, ur(t.a, t.b, t.c, t.d, t.e, t.f));
}
function fr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: at(c, u) }, { i: p - 2, x: at(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: at(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function l(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: at(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function a(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push(i(h) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: at(c, u) }, { i: p - 2, x: at(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), l(c.skewX, d.skewX, u, f), a(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var g = -1, p = f.length, y; ++g < p; ) u[(y = f[g]).i] = y.x(h);
      return u.join("");
    };
  };
}
var Nc = fr(Tc, "px, ", "px)", "deg)"), $c = fr(Ac, ", ", ")", ")"), Ic = 1e-12;
function Bi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Dc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Rc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Fc = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - l, g = u - a, p = h * h + g * g, y, m;
    if (p < Ic)
      m = Math.log(f / c) / e, y = function(P) {
        return [
          l + P * h,
          a + P * g,
          c * Math.exp(e * P * m)
        ];
      };
    else {
      var v = Math.sqrt(p), C = (f * f - c * c + o * p) / (2 * c * n * v), _ = (f * f - c * c - o * p) / (2 * f * n * v), k = Math.log(Math.sqrt(C * C + 1) - C), L = Math.log(Math.sqrt(_ * _ + 1) - _);
      m = (L - k) / e, y = function(P) {
        var $ = P * m, x = Bi(k), E = c / (n * v) * (x * Rc(e * $ + k) - Dc(k));
        return [
          l + E * h,
          a + E * g,
          c * x / Bi(e * $ + k)
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
var Vt = 0, tn = 0, Zt = 0, hr = 1e3, Xn, nn, Yn = 0, Ct = 0, po = 0, pn = typeof performance == "object" && performance.now ? performance : Date, pr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function li() {
  return Ct || (pr(Hc), Ct = pn.now() + po);
}
function Hc() {
  Ct = 0;
}
function Wn() {
  this._call = this._time = this._next = null;
}
Wn.prototype = gr.prototype = {
  constructor: Wn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? li() : +n) + (e == null ? 0 : +e), !this._next && nn !== this && (nn ? nn._next = this : Xn = this, nn = this), this._call = t, this._time = n, Bo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Bo());
  }
};
function gr(t, e, n) {
  var o = new Wn();
  return o.restart(t, e, n), o;
}
function Oc() {
  li(), ++Vt;
  for (var t = Xn, e; t; )
    (e = Ct - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Vt;
}
function qi() {
  Ct = (Yn = pn.now()) + po, Vt = tn = 0;
  try {
    Oc();
  } finally {
    Vt = 0, Vc(), Ct = 0;
  }
}
function zc() {
  var t = pn.now(), e = t - Yn;
  e > hr && (po -= e, Yn = t);
}
function Vc() {
  for (var t, e = Xn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Xn = n);
  nn = t, Bo(o);
}
function Bo(t) {
  if (!Vt) {
    tn && (tn = clearTimeout(tn));
    var e = t - Ct;
    e > 24 ? (t < 1 / 0 && (tn = setTimeout(qi, t - pn.now() - po)), Zt && (Zt = clearInterval(Zt))) : (Zt || (Yn = pn.now(), Zt = setInterval(zc, hr)), Vt = 1, pr(qi));
  }
}
function Xi(t, e, n) {
  var o = new Wn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Bc = fo("start", "end", "cancel", "interrupt"), qc = [], mr = 0, Yi = 1, qo = 2, Rn = 3, Wi = 4, Xo = 5, Fn = 6;
function go(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Xc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Bc,
    tween: qc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: mr
  });
}
function ci(t, e) {
  var n = qe(t, e);
  if (n.state > mr) throw new Error("too late; already scheduled");
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
function Xc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = gr(r, 0, n.time);
  function r(c) {
    n.state = Yi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Yi) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === Rn) return Xi(s);
        h.state === Wi ? (h.state = Fn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Fn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (Xi(function() {
      n.state === Rn && (n.state = Wi, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = qo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === qo) {
      for (n.state = Rn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = Xo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Xo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
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
      i = o.state > qo && o.state < Xo, o.state = Fn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Yc(t) {
  return this.each(function() {
    Hn(this, t);
  });
}
function Wc(t, e) {
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
function jc(t, e, n) {
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
function Uc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = qe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Wc : jc)(n, t, e));
}
function di(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = We(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return qe(i, o).value[e];
  };
}
function yr(t, e) {
  var n;
  return (typeof e == "number" ? at : e instanceof hn ? Oo : (n = hn(e)) ? (e = n, Oo) : Mc)(t, e);
}
function Zc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Kc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Gc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Jc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Qc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function ed(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function td(t, e) {
  var n = ho(t), o = n === "transform" ? $c : yr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? ed : Qc)(n, o, di(this, "attr." + t, e)) : e == null ? (n.local ? Kc : Zc)(n) : (n.local ? Jc : Gc)(n, o, e));
}
function nd(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function od(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function id(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && od(t, r)), n;
  }
  return i._value = e, i;
}
function sd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && nd(t, r)), n;
  }
  return i._value = e, i;
}
function rd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = ho(t);
  return this.tween(n, (o.local ? id : sd)(o, e));
}
function ad(t, e) {
  return function() {
    ci(this, t).delay = +e.apply(this, arguments);
  };
}
function ld(t, e) {
  return e = +e, function() {
    ci(this, t).delay = e;
  };
}
function cd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ad : ld)(e, t)) : qe(this.node(), e).delay;
}
function dd(t, e) {
  return function() {
    We(this, t).duration = +e.apply(this, arguments);
  };
}
function ud(t, e) {
  return e = +e, function() {
    We(this, t).duration = e;
  };
}
function fd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? dd : ud)(e, t)) : qe(this.node(), e).duration;
}
function hd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    We(this, t).ease = e;
  };
}
function pd(t) {
  var e = this._id;
  return arguments.length ? this.each(hd(e, t)) : qe(this.node(), e).ease;
}
function gd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    We(this, t).ease = n;
  };
}
function md(t) {
  if (typeof t != "function") throw new Error();
  return this.each(gd(this._id, t));
}
function yd(t) {
  typeof t != "function" && (t = Zs(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new tt(o, this._parents, this._name, this._id);
}
function wd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, u = s[l] = new Array(d), f, h = 0; h < d; ++h)
      (f = a[h] || c[h]) && (u[h] = f);
  for (; l < o; ++l)
    s[l] = e[l];
  return new tt(s, this._parents, this._name, this._id);
}
function vd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function _d(t, e, n) {
  var o, i, r = vd(e) ? ci : We;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function bd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? qe(this.node(), n).on.on(t) : this.each(_d(n, t, e));
}
function xd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Ed() {
  return this.on("end.remove", xd(this._id));
}
function Cd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = si(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, u, f = 0; f < a; ++f)
      (d = l[f]) && (u = t.call(d, d.__data__, f, l)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, go(c[f], e, n, f, c, qe(d, n)));
  return new tt(r, this._parents, e, n);
}
function Sd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Us(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, u = 0; u < c; ++u)
      if (d = a[u]) {
        for (var f = t.call(d, d.__data__, u, a), h, g = qe(d, n), p = 0, y = f.length; p < y; ++p)
          (h = f[p]) && go(h, e, n, p, f, g);
        r.push(f), s.push(d);
      }
  return new tt(r, s, e, n);
}
var kd = wn.prototype.constructor;
function Ld() {
  return new kd(this._groups, this._parents);
}
function Pd(t, e) {
  var n, o, i;
  return function() {
    var r = zt(this, t), s = (this.style.removeProperty(t), zt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function wr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Md(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = zt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Td(t, e, n) {
  var o, i, r;
  return function() {
    var s = zt(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), zt(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Ad(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = We(this, t), c = a.on, d = a.value[r] == null ? l || (l = wr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Nd(t, e, n) {
  var o = (t += "") == "transform" ? Nc : yr;
  return e == null ? this.styleTween(t, Pd(t, o)).on("end.style." + t, wr(t)) : typeof e == "function" ? this.styleTween(t, Td(t, o, di(this, "style." + t, e))).each(Ad(this._id, t)) : this.styleTween(t, Md(t, o, e), n).on("end.style." + t, null);
}
function $d(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Id(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && $d(t, s, n)), o;
  }
  return r._value = e, r;
}
function Dd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Id(t, e, n ?? ""));
}
function Rd(t) {
  return function() {
    this.textContent = t;
  };
}
function Fd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Hd(t) {
  return this.tween("text", typeof t == "function" ? Fd(di(this, "text", t)) : Rd(t == null ? "" : t + ""));
}
function Od(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function zd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Od(i)), e;
  }
  return o._value = t, o;
}
function Vd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, zd(t));
}
function Bd() {
  for (var t = this._name, e = this._id, n = vr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = qe(a, e);
        go(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new tt(o, this._parents, t, n);
}
function qd() {
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
var Xd = 0;
function tt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function vr() {
  return ++Xd;
}
var Ue = wn.prototype;
tt.prototype = {
  constructor: tt,
  select: Cd,
  selectAll: Sd,
  selectChild: Ue.selectChild,
  selectChildren: Ue.selectChildren,
  filter: yd,
  merge: wd,
  selection: Ld,
  transition: Bd,
  call: Ue.call,
  nodes: Ue.nodes,
  node: Ue.node,
  size: Ue.size,
  empty: Ue.empty,
  each: Ue.each,
  on: bd,
  attr: td,
  attrTween: rd,
  style: Nd,
  styleTween: Dd,
  text: Hd,
  textTween: Vd,
  remove: Ed,
  tween: Uc,
  delay: cd,
  duration: fd,
  ease: pd,
  easeVarying: md,
  end: qd,
  [Symbol.iterator]: Ue[Symbol.iterator]
};
const Yd = (t) => +t;
function Wd(t) {
  return t * t;
}
function jd(t) {
  return t * (2 - t);
}
function Ud(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Zd(t) {
  return t * t * t;
}
function Kd(t) {
  return --t * t * t + 1;
}
function _r(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var br = Math.PI, xr = br / 2;
function Gd(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * xr);
}
function Jd(t) {
  return Math.sin(t * xr);
}
function Qd(t) {
  return (1 - Math.cos(br * t)) / 2;
}
function gt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function eu(t) {
  return gt(1 - +t);
}
function tu(t) {
  return 1 - gt(t);
}
function nu(t) {
  return ((t *= 2) <= 1 ? gt(1 - t) : 2 - gt(t - 1)) / 2;
}
function ou(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function iu(t) {
  return Math.sqrt(1 - --t * t);
}
function su(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Yo = 4 / 11, ru = 6 / 11, au = 8 / 11, lu = 3 / 4, cu = 9 / 11, du = 10 / 11, uu = 15 / 16, fu = 21 / 22, hu = 63 / 64, Ln = 1 / Yo / Yo;
function pu(t) {
  return 1 - jn(1 - t);
}
function jn(t) {
  return (t = +t) < Yo ? Ln * t * t : t < au ? Ln * (t -= ru) * t + lu : t < du ? Ln * (t -= cu) * t + uu : Ln * (t -= fu) * t + hu;
}
function gu(t) {
  return ((t *= 2) <= 1 ? 1 - jn(1 - t) : jn(t - 1) + 1) / 2;
}
var ui = 1.70158, mu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(ui), yu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(ui), wu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ui), Bt = 2 * Math.PI, fi = 1, hi = 0.3, vu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return e * gt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(fi, hi), _u = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return 1 - e * gt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(fi, hi), bu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * gt(-r) * Math.sin((o - r) / n) : 2 - e * gt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(fi, hi), xu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: _r
};
function Eu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Cu(t) {
  var e, n;
  t instanceof tt ? (e = t._id, t = t._name) : (e = vr(), (n = xu).time = li(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && go(a, t, e, c, s, n || Eu(a, e));
  return new tt(o, this._parents, t, e);
}
wn.prototype.interrupt = Yc;
wn.prototype.transition = Cu;
const Pn = (t) => () => t;
function Su(t, {
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
function bo(t) {
  t.stopImmediatePropagation();
}
function Kt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function ku(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Lu() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function ji() {
  return this.__zoom || Un;
}
function Pu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Mu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Tu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Au() {
  var t = ku, e = Lu, n = Tu, o = Pu, i = Mu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = Fc, c = fo("start", "zoom", "end"), d, u, f, h = 500, g = 150, p = 0, y = 10;
  function m(b) {
    b.property("__zoom", ji).on("wheel.zoom", $, { passive: !1 }).on("mousedown.zoom", x).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", A).on("touchmove.zoom", M).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(b, D, T, O) {
    var W = b.selection ? b.selection() : b;
    W.property("__zoom", ji), b !== W ? k(b, D, T, O) : W.interrupt().each(function() {
      L(this, arguments).event(O).start().zoom(null, typeof D == "function" ? D.apply(this, arguments) : D).end();
    });
  }, m.scaleBy = function(b, D, T, O) {
    m.scaleTo(b, function() {
      var W = this.__zoom.k, S = typeof D == "function" ? D.apply(this, arguments) : D;
      return W * S;
    }, T, O);
  }, m.scaleTo = function(b, D, T, O) {
    m.transform(b, function() {
      var W = e.apply(this, arguments), S = this.__zoom, N = T == null ? _(W) : typeof T == "function" ? T.apply(this, arguments) : T, R = S.invert(N), q = typeof D == "function" ? D.apply(this, arguments) : D;
      return n(C(v(S, q), N, R), W, s);
    }, T, O);
  }, m.translateBy = function(b, D, T, O) {
    m.transform(b, function() {
      return n(this.__zoom.translate(
        typeof D == "function" ? D.apply(this, arguments) : D,
        typeof T == "function" ? T.apply(this, arguments) : T
      ), e.apply(this, arguments), s);
    }, null, O);
  }, m.translateTo = function(b, D, T, O, W) {
    m.transform(b, function() {
      var S = e.apply(this, arguments), N = this.__zoom, R = O == null ? _(S) : typeof O == "function" ? O.apply(this, arguments) : O;
      return n(Un.translate(R[0], R[1]).scale(N.k).translate(
        typeof D == "function" ? -D.apply(this, arguments) : -D,
        typeof T == "function" ? -T.apply(this, arguments) : -T
      ), S, s);
    }, O, W);
  };
  function v(b, D) {
    return D = Math.max(r[0], Math.min(r[1], D)), D === b.k ? b : new Je(D, b.x, b.y);
  }
  function C(b, D, T) {
    var O = D[0] - T[0] * b.k, W = D[1] - T[1] * b.k;
    return O === b.x && W === b.y ? b : new Je(b.k, O, W);
  }
  function _(b) {
    return [(+b[0][0] + +b[1][0]) / 2, (+b[0][1] + +b[1][1]) / 2];
  }
  function k(b, D, T, O) {
    b.on("start.zoom", function() {
      L(this, arguments).event(O).start();
    }).on("interrupt.zoom end.zoom", function() {
      L(this, arguments).event(O).end();
    }).tween("zoom", function() {
      var W = this, S = arguments, N = L(W, S).event(O), R = e.apply(W, S), q = T == null ? _(R) : typeof T == "function" ? T.apply(W, S) : T, se = Math.max(R[1][0] - R[0][0], R[1][1] - R[0][1]), ne = W.__zoom, ie = typeof D == "function" ? D.apply(W, S) : D, le = a(ne.invert(q).concat(se / ne.k), ie.invert(q).concat(se / ie.k));
      return function(de) {
        if (de === 1) de = ie;
        else {
          var ue = le(de), J = se / ue[2];
          de = new Je(J, q[0] - ue[0] * J, q[1] - ue[1] * J);
        }
        N.zoom(null, de);
      };
    });
  }
  function L(b, D, T) {
    return !T && b.__zooming || new P(b, D);
  }
  function P(b, D) {
    this.that = b, this.args = D, this.active = 0, this.sourceEvent = null, this.extent = e.apply(b, D), this.taps = 0;
  }
  P.prototype = {
    event: function(b) {
      return b && (this.sourceEvent = b), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(b, D) {
      return this.mouse && b !== "mouse" && (this.mouse[1] = D.invert(this.mouse[0])), this.touch0 && b !== "touch" && (this.touch0[1] = D.invert(this.touch0[0])), this.touch1 && b !== "touch" && (this.touch1[1] = D.invert(this.touch1[0])), this.that.__zoom = D, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(b) {
      var D = Ve(this.that).datum();
      c.call(
        b,
        this.that,
        new Su(b, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        D
      );
    }
  };
  function $(b, ...D) {
    if (!t.apply(this, arguments)) return;
    var T = L(this, D).event(b), O = this.__zoom, W = Math.max(r[0], Math.min(r[1], O.k * Math.pow(2, o.apply(this, arguments)))), S = Ze(b);
    if (T.wheel)
      (T.mouse[0][0] !== S[0] || T.mouse[0][1] !== S[1]) && (T.mouse[1] = O.invert(T.mouse[0] = S)), clearTimeout(T.wheel);
    else {
      if (O.k === W) return;
      T.mouse = [S, O.invert(S)], Hn(this), T.start();
    }
    Kt(b), T.wheel = setTimeout(N, g), T.zoom("mouse", n(C(v(O, W), T.mouse[0], T.mouse[1]), T.extent, s));
    function N() {
      T.wheel = null, T.end();
    }
  }
  function x(b, ...D) {
    if (f || !t.apply(this, arguments)) return;
    var T = b.currentTarget, O = L(this, D, !0).event(b), W = Ve(b.view).on("mousemove.zoom", q, !0).on("mouseup.zoom", se, !0), S = Ze(b, T), N = b.clientX, R = b.clientY;
    sr(b.view), bo(b), O.mouse = [S, this.__zoom.invert(S)], Hn(this), O.start();
    function q(ne) {
      if (Kt(ne), !O.moved) {
        var ie = ne.clientX - N, le = ne.clientY - R;
        O.moved = ie * ie + le * le > p;
      }
      O.event(ne).zoom("mouse", n(C(O.that.__zoom, O.mouse[0] = Ze(ne, T), O.mouse[1]), O.extent, s));
    }
    function se(ne) {
      W.on("mousemove.zoom mouseup.zoom", null), rr(ne.view, O.moved), Kt(ne), O.event(ne).end();
    }
  }
  function E(b, ...D) {
    if (t.apply(this, arguments)) {
      var T = this.__zoom, O = Ze(b.changedTouches ? b.changedTouches[0] : b, this), W = T.invert(O), S = T.k * (b.shiftKey ? 0.5 : 2), N = n(C(v(T, S), O, W), e.apply(this, D), s);
      Kt(b), l > 0 ? Ve(this).transition().duration(l).call(k, N, O, b) : Ve(this).call(m.transform, N, O, b);
    }
  }
  function A(b, ...D) {
    if (t.apply(this, arguments)) {
      var T = b.touches, O = T.length, W = L(this, D, b.changedTouches.length === O).event(b), S, N, R, q;
      for (bo(b), N = 0; N < O; ++N)
        R = T[N], q = Ze(R, this), q = [q, this.__zoom.invert(q), R.identifier], W.touch0 ? !W.touch1 && W.touch0[2] !== q[2] && (W.touch1 = q, W.taps = 0) : (W.touch0 = q, S = !0, W.taps = 1 + !!d);
      d && (d = clearTimeout(d)), S && (W.taps < 2 && (u = q[0], d = setTimeout(function() {
        d = null;
      }, h)), Hn(this), W.start());
    }
  }
  function M(b, ...D) {
    if (this.__zooming) {
      var T = L(this, D).event(b), O = b.changedTouches, W = O.length, S, N, R, q;
      for (Kt(b), S = 0; S < W; ++S)
        N = O[S], R = Ze(N, this), T.touch0 && T.touch0[2] === N.identifier ? T.touch0[0] = R : T.touch1 && T.touch1[2] === N.identifier && (T.touch1[0] = R);
      if (N = T.that.__zoom, T.touch1) {
        var se = T.touch0[0], ne = T.touch0[1], ie = T.touch1[0], le = T.touch1[1], de = (de = ie[0] - se[0]) * de + (de = ie[1] - se[1]) * de, ue = (ue = le[0] - ne[0]) * ue + (ue = le[1] - ne[1]) * ue;
        N = v(N, Math.sqrt(de / ue)), R = [(se[0] + ie[0]) / 2, (se[1] + ie[1]) / 2], q = [(ne[0] + le[0]) / 2, (ne[1] + le[1]) / 2];
      } else if (T.touch0) R = T.touch0[0], q = T.touch0[1];
      else return;
      T.zoom("touch", n(C(N, R, q), T.extent, s));
    }
  }
  function w(b, ...D) {
    if (this.__zooming) {
      var T = L(this, D).event(b), O = b.changedTouches, W = O.length, S, N;
      for (bo(b), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), S = 0; S < W; ++S)
        N = O[S], T.touch0 && T.touch0[2] === N.identifier ? delete T.touch0 : T.touch1 && T.touch1[2] === N.identifier && delete T.touch1;
      if (T.touch1 && !T.touch0 && (T.touch0 = T.touch1, delete T.touch1), T.touch0) T.touch0[1] = this.__zoom.invert(T.touch0[0]);
      else if (T.end(), T.taps === 2 && (N = Ze(N, this), Math.hypot(u[0] - N[0], u[1] - N[1]) < y)) {
        var R = Ve(this).on("dblclick.zoom");
        R && R.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Pn(+b), m) : o;
  }, m.filter = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Pn(!!b), m) : t;
  }, m.touchable = function(b) {
    return arguments.length ? (i = typeof b == "function" ? b : Pn(!!b), m) : i;
  }, m.extent = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Pn([[+b[0][0], +b[0][1]], [+b[1][0], +b[1][1]]]), m) : e;
  }, m.scaleExtent = function(b) {
    return arguments.length ? (r[0] = +b[0], r[1] = +b[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(b) {
    return arguments.length ? (s[0][0] = +b[0][0], s[1][0] = +b[1][0], s[0][1] = +b[0][1], s[1][1] = +b[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(b) {
    return arguments.length ? (n = b, m) : n;
  }, m.duration = function(b) {
    return arguments.length ? (l = +b, m) : l;
  }, m.interpolate = function(b) {
    return arguments.length ? (a = b, m) : a;
  }, m.on = function() {
    var b = c.on.apply(c, arguments);
    return b === c ? m : b;
  }, m.clickDistance = function(b) {
    return arguments.length ? (p = (b = +b) * b, m) : Math.sqrt(p);
  }, m.tapDistance = function(b) {
    return arguments.length ? (y = +b, m) : y;
  }, m;
}
function Ui(t) {
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
function Nu(t, e) {
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
  }, u = (P) => {
    c && P.code === c && (a = !1, t.style.cursor = "");
  }, f = () => {
    a = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Au().scaleExtent([o, i]).on("start", (P) => {
    if (!P.sourceEvent) return;
    a && (t.style.cursor = "grabbing");
    const { x: $, y: x, k: E } = P.transform;
    e.onMoveStart?.({ x: $, y: x, zoom: E });
  }).on("zoom", (P) => {
    const { x: $, y: x, k: E } = P.transform;
    n({ x: $, y: x, zoom: E }), P.sourceEvent && e.onMove?.({ x: $, y: x, zoom: E });
  }).on("end", (P) => {
    if (!P.sourceEvent) return;
    a && (t.style.cursor = "grab");
    const { x: $, y: x, k: E } = P.transform;
    e.onMoveEnd?.({ x: $, y: x, zoom: E });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Ui({
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
  const v = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, C = (P) => {
    v && P.code === v && (m = !0);
  }, _ = (P) => {
    v && P.code === v && (m = !1);
  }, k = () => {
    m = !1;
  };
  v && (window.addEventListener("keydown", C), window.addEventListener("keyup", _), window.addEventListener("blur", k));
  const L = (P) => {
    if (e.isLocked?.()) return;
    const $ = P.ctrlKey || P.metaKey || m;
    if (!(g ? !$ : P.shiftKey)) return;
    P.preventDefault(), P.stopPropagation();
    const E = y;
    let A = 0, M = 0;
    p !== "horizontal" && (M = -P.deltaY * E), p !== "vertical" && (A = -P.deltaX * E, P.shiftKey && P.deltaX === 0 && p === "both" && (A = -P.deltaY * E, M = 0)), e.onScrollPan?.(A, M);
  };
  return t.addEventListener("wheel", L, { passive: !1, capture: !0 }), {
    setViewport(P, $) {
      const x = $?.duration ?? 0, E = Un.translate(P.x ?? 0, P.y ?? 0).scale(P.zoom ?? 1);
      x > 0 ? l.transition().duration(x).call(h.transform, E) : l.call(h.transform, E);
    },
    getTransform() {
      return t.__zoom ?? Un;
    },
    update(P) {
      if ((P.minZoom !== void 0 || P.maxZoom !== void 0) && h.scaleExtent([
        P.minZoom ?? o,
        P.maxZoom ?? i
      ]), P.pannable !== void 0 || P.zoomable !== void 0) {
        const $ = P.pannable ?? r, x = P.zoomable ?? s;
        h.filter(Ui({
          pannable: $,
          zoomable: x,
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
      t.removeEventListener("wheel", L, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), v && (window.removeEventListener("keydown", C), window.removeEventListener("keyup", _), window.removeEventListener("blur", k)), l.on(".zoom", null);
    }
  };
}
function Er(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function $u(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ve = 150, _e = 50;
function mo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - a / 2, y: u - c / 2, width: a, height: c };
}
function qt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? ve, a = s.dimensions?.height ?? _e, c = jt(s, e), d = s.rotation ? mo(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Iu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = jt(r, n), c = r.rotation ? mo(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Du(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = jt(r, n), c = r.rotation ? mo(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Zn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, g = e / 2 - h.x * f, p = n / 2 - h.y * f;
  return { x: g, y: p, zoom: f };
}
function Ru(t, e, n, o) {
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
let Cr = !1;
function Sr(t) {
  Cr = t;
}
function X(t, e, n) {
  if (!Cr) return;
  const o = `%c[AlpineFlow:${t}]`, i = Fu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Fu(t) {
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
const gn = "#64748b", pi = "#d4d4d8", kr = "#ef4444", Hu = "2", Ou = "6 3", Zi = 1.2, Wo = 0.2, On = 5, Ki = 25;
class zu {
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
const Vu = 16;
function Bu() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Vu),
    cancel: (t) => clearTimeout(t)
  };
}
class Lr {
  constructor() {
    this._scheduler = Bu(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Kn = new Lr(), qu = {
  linear: Yd,
  easeIn: Wd,
  easeOut: jd,
  easeInOut: Ud,
  easeCubicIn: Zd,
  easeCubicOut: Kd,
  easeCubicInOut: _r,
  easeCircIn: ou,
  easeCircOut: iu,
  easeCircInOut: su,
  easeSinIn: Gd,
  easeSinOut: Jd,
  easeSinInOut: Qd,
  easeExpoIn: eu,
  easeExpoOut: tu,
  easeExpoInOut: nu,
  easeBounce: jn,
  easeBounceIn: pu,
  easeBounceInOut: gu,
  easeElastic: _u,
  easeElasticIn: vu,
  easeElasticInOut: bu,
  easeBack: wu,
  easeBackIn: mu,
  easeBackOut: yu
};
function Pr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Gn(t) {
  return typeof t == "function" ? t : qu[t ?? "easeInOut"];
}
function et(t, e, n) {
  return t + (e - t) * n;
}
function gi(t, e, n) {
  return Oo(t, e)(n);
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
const Gi = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Ji = /^(#|rgb|hsl)/;
function Mr(t, e, n) {
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
    const a = Gi.exec(s), c = Gi.exec(l);
    if (a && c) {
      const d = parseFloat(a[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = et(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (Ji.test(s) && Ji.test(l)) {
      o[r] = gi(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function Xu(t, e, n, o) {
  let i = et(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: et(t.x, e.x, n),
    y: et(t.y, e.y, n),
    zoom: i
  };
}
class Yu {
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
class Wu {
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
function Tr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Gt.stiffness, i = e.damping ?? Gt.damping, r = e.mass ?? Gt.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Gt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Gt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Qi = {
  timeConstant: 350,
  restVelocity: 0.5
};
function mi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Qi.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Qi.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function yi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Ar(t, e, n, o) {
  if (n <= 0)
    return;
  mi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? yi(o) : null;
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
function Nr(t, e, n, o) {
  const i = yi(o), r = e.values.map(
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
  const c = s[a], d = s[a + 1] ?? 1, u = d > c ? (l - c) / (d - c) : 1, f = r[a], h = r[a + 1] ?? r[a];
  t.value = f + (h - f) * Math.max(0, Math.min(1, u)), l >= 1 && (t.value = r[r.length - 1], t.settled = !0);
}
const es = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, ts = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, ns = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function $r(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return es[n] ? { ...es[n] } : null;
    case "decay":
      return ts[n] ? { ...ts[n] } : null;
    case "inertia":
      return ns[n] ? { ...ns[n] } : null;
    default:
      return null;
  }
}
function os(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function ju(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? et(t, e, n) : os(t) && os(e) ? gi(t, e, n) : n < 0.5 ? t : e;
}
class Uu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Yu(), this._activeTransaction = null, this._engine = e;
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
    const e = new Wu();
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
      whileStopMode: g = "jump-end",
      motion: p,
      maxDuration: y = 5e3
    } = n, m = Gn(i), v = p ? $r(p) : void 0;
    for (const b of e) {
      const D = this._ownership.get(b.key);
      if (D && !D.stopped) {
        const T = D.currentValues.get(b.key);
        T !== void 0 && (b.from = T), D.entries = D.entries.filter((O) => O.key !== b.key), D.entries.length === 0 && this._stop(D, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const b of e)
        this._activeTransaction.captureProperty(b.key, b.from, b.apply);
    if (o <= 0) {
      const b = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
      for (const W of e)
        b.set(W.key, W.from), D.set(W.key, W.to);
      a?.();
      for (const W of e)
        W.apply(W.to);
      const T = [...u ? [u] : [], ...f ?? []], O = {
        _tags: T.length > 0 ? T : void 0,
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
          return b;
        },
        get _target() {
          return D;
        }
      };
      return this._registry.register(O), queueMicrotask(() => this._registry.unregister(O)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(O), d?.(), O;
    }
    const C = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
    for (const b of e)
      C.set(b.key, b.from), _.set(b.key, b.to);
    let k;
    if (v) {
      k = /* @__PURE__ */ new Map();
      for (const b of e) {
        if (typeof b.from != "number" || typeof b.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${b.key}" is non-numeric; snapping to target.`
          ), b.apply(b.to);
          continue;
        }
        let D = 0;
        if (v.type === "decay" || v.type === "inertia") {
          const T = v.velocity;
          if (typeof T == "number")
            D = T;
          else if (T && typeof T == "object") {
            const W = T, S = yi(b.key);
            D = W[b.key] ?? (S ? W[S] ?? 0 : 0);
          }
          const O = v.power ?? 0.8;
          D *= O;
        }
        k.set(b.key, {
          value: b.from,
          velocity: D,
          target: b.to,
          settled: !1
        });
      }
      k.size === 0 && (k = void 0);
    }
    const L = s === "ping-pong" ? "reverse" : s, P = l === "end" ? "backward" : "forward";
    let $;
    const x = new Promise((b) => {
      $ = b;
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
      loop: L,
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
      snapshot: C,
      target: _,
      _currentFinished: x,
      whilePredicate: h,
      whileStopMode: g,
      motionConfig: k ? v : void 0,
      physicsStates: k,
      maxDuration: y,
      isPhysics: !!k,
      _prevElapsed: 0
    };
    if (l === "end")
      for (const b of E.entries)
        b.apply(b.to), E.currentValues.set(b.key, b.to);
    else
      for (const b of E.entries)
        E.currentValues.set(b.key, b.from);
    for (const b of e)
      this._ownership.set(b.key, E);
    this._groups.add(E);
    const A = this._engine.register((b) => this._tick(E, b), r);
    E.engineHandle = A;
    const M = [...u ? [u] : [], ...f ?? []], w = {
      _tags: M.length > 0 ? M : void 0,
      pause: () => this._pause(E),
      resume: () => this._resume(E),
      stop: (b) => this._stop(E, b?.mode ?? "jump-end"),
      reverse: () => this._reverse(E),
      play: () => this._play(E),
      playForward: () => this._playDirection(E, "forward"),
      playBackward: () => this._playDirection(E, "backward"),
      restart: (b) => this._restart(E, b),
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
      const a = ju(l.from, l.to, s);
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
              Tr(d, e.motionConfig, i);
              break;
            case "decay":
              mi(d, e.motionConfig, i);
              break;
            case "inertia":
              Ar(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Nr(d, e.motionConfig, h, c.key);
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
const Ir = /* @__PURE__ */ new Map();
function Zu(t, e) {
  Ir.set(t, e);
}
function xo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Dt(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Rt(t, e) {
  return `${e}__${t.type}__${(t.color ?? pi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Jn(t, e) {
  const n = xo(t.color ?? pi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = xo(t.orient ?? "auto-start-reverse"), a = xo(e);
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
  const c = Ir.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : Jn({ ...t, type: "arrowclosed" }, e);
}
const yt = 200, wt = 150, Ku = 1.2, Jt = "http://www.w3.org/2000/svg";
function Gu(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Jt, "svg");
  c.setAttribute("width", String(yt)), c.setAttribute("height", String(wt));
  const d = document.createElementNS(Jt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(yt)), d.setAttribute("height", String(wt));
  const u = document.createElementNS(Jt, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(Jt, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const A = n();
    if (h = qt(A.nodes.filter((M) => !M.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      h.width / yt,
      h.height / wt
    ) * Ku;
  }
  function y(A) {
    return typeof l == "function" ? l(A) : l;
  }
  function m() {
    const A = n();
    p(), u.innerHTML = "";
    const M = (yt - h.width / g) / 2, w = (wt - h.height / g) / 2;
    for (const b of A.nodes) {
      if (b.hidden) continue;
      const D = document.createElementNS(Jt, "rect"), T = (b.dimensions?.width ?? ve) / g, O = (b.dimensions?.height ?? _e) / g, W = (b.position.x - h.x) / g + M, S = (b.position.y - h.y) / g + w;
      D.setAttribute("x", String(W)), D.setAttribute("y", String(S)), D.setAttribute("width", String(T)), D.setAttribute("height", String(O)), D.setAttribute("rx", "2");
      const N = y(b);
      N && (D.style.fill = N), u.appendChild(D);
    }
    v();
  }
  function v() {
    const A = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const M = (yt - h.width / g) / 2, w = (wt - h.height / g) / 2, b = (-A.viewport.x / A.viewport.zoom - h.x) / g + M, D = (-A.viewport.y / A.viewport.zoom - h.y) / g + w, T = A.containerWidth / A.viewport.zoom / g, O = A.containerHeight / A.viewport.zoom / g, W = `M0,0 H${yt} V${wt} H0 Z`, S = `M${b},${D} h${T} v${O} h${-T} Z`;
    f.setAttribute("d", `${W} ${S}`);
  }
  let C = !1;
  function _(A, M) {
    const w = (yt - h.width / g) / 2, b = (wt - h.height / g) / 2, D = (A - w) * g + h.x, T = (M - b) * g + h.y;
    return { x: D, y: T };
  }
  function k(A) {
    const M = c.getBoundingClientRect(), w = A.clientX - M.left, b = A.clientY - M.top, D = n(), T = _(w, b), O = -T.x * D.viewport.zoom + D.containerWidth / 2, W = -T.y * D.viewport.zoom + D.containerHeight / 2;
    o({ x: O, y: W, zoom: D.viewport.zoom });
  }
  function L(A) {
    i.minimapPannable && (C = !0, c.setPointerCapture(A.pointerId), k(A));
  }
  function P(A) {
    C && k(A);
  }
  function $(A) {
    C && (C = !1, c.releasePointerCapture(A.pointerId));
  }
  c.addEventListener("pointerdown", L), c.addEventListener("pointermove", P), c.addEventListener("pointerup", $);
  function x(A) {
    if (!i.minimapZoomable)
      return;
    A.preventDefault();
    const M = n(), w = i.minZoom ?? 0.5, b = i.maxZoom ?? 2, D = A.deltaY > 0 ? 0.9 : 1.1, T = Math.min(Math.max(M.viewport.zoom * D, w), b);
    o({ zoom: T });
  }
  c.addEventListener("wheel", x, { passive: !1 });
  function E() {
    c.removeEventListener("pointerdown", L), c.removeEventListener("pointermove", P), c.removeEventListener("pointerup", $), c.removeEventListener("wheel", x), a.remove();
  }
  return { render: m, updateViewport: v, destroy: E };
}
const Ju = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Qu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', ef = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', is = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', tf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', nf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ss = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', of = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function sf(t, e) {
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
    onToggleFullscreen: g
  } = e, p = document.createElement("div"), y = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  a ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), p.className = y.join(" "), p.setAttribute("role", "toolbar"), p.setAttribute("aria-label", "Flow controls");
  let m = null, v = null;
  if (i) {
    const k = kt(Ju, "Zoom in", c), L = kt(Qu, "Zoom out", d);
    p.appendChild(k), p.appendChild(L);
  }
  if (r) {
    const k = kt(ef, "Fit view", u);
    p.appendChild(k);
  }
  if (s && (m = kt(is, "Toggle interactivity", f), p.appendChild(m)), l) {
    const k = kt(nf, "Reset panels", h);
    p.appendChild(k);
  }
  g && (v = kt(ss, "Toggle fullscreen", g), v.classList.add("flow-controls-button-fullscreen"), p.appendChild(v)), p.addEventListener("mousedown", (k) => k.stopPropagation()), p.addEventListener("pointerdown", (k) => k.stopPropagation()), p.addEventListener("wheel", (k) => k.stopPropagation(), { passive: !1 }), t.appendChild(p);
  function C(k) {
    if (m && typeof k.isInteractive == "boolean") {
      jo(m, k.isInteractive ? is : tf);
      const L = k.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = L, m.setAttribute("aria-label", L);
    }
    if (v && typeof k.isFullscreen == "boolean") {
      jo(v, k.isFullscreen ? of : ss);
      const L = k.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      v.title = L, v.setAttribute("aria-label", L), v.classList.toggle("flow-controls-button-fullscreen--active", k.isFullscreen);
    }
  }
  function _() {
    p.remove();
  }
  return { update: C, destroy: _ };
}
function kt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", jo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function jo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const rs = 5;
function rf(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function l(f, h, g = "partial") {
    o = f, i = h, r = f, s = h, n = !0, e.style.left = `${f}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${g}`);
  }
  function a(f, h) {
    if (!n)
      return;
    r = f, s = h;
    const g = Math.min(o, r), p = Math.min(i, s), y = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${g}px`, e.style.top = `${p}px`, e.style.width = `${y}px`, e.style.height = `${m}px`;
  }
  function c(f) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), g = Math.abs(s - i);
    if (h < rs && g < rs)
      return null;
    const p = Math.min(o, r), y = Math.min(i, s), m = (p - f.x) / f.zoom, v = (y - f.y) / f.zoom, C = h / f.zoom, _ = g / f.zoom;
    return { x: m, y: v, width: C, height: _ };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: u };
}
const as = 3;
function af(t) {
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
    const f = i[i.length - 1], h = d - f.x, g = u - f.y;
    h * h + g * g < as * as || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((p) => `${p.x},${p.y}`).join(" ")));
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
function wi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function lf(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, u = l - r, f = a * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, g = r - e, p = (h * u - g * d) / f, y = (h * c - g * a) / f;
  return p >= 0 && p <= 1 && y >= 0 && y <= 1;
}
function cf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (wi(s, l, t)) return !0;
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
    for (const [u, f, h, g] of a)
      if (lf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, g))
        return !0;
  return !1;
}
function Dr(t) {
  const e = t.dimensions?.width ?? ve, n = t.dimensions?.height ?? _e;
  return t.rotation ? mo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function df(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Dr(n);
    return cf(e, o);
  });
}
function uf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Dr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => wi(r.x, r.y, e));
  });
}
function ff(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Uo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function hf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function pf(t, e, n) {
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
function gf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function mf(t, e, n) {
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
          const g = `${f.source}|${h.target}|${f.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(g) || s.has(g)) continue;
          const p = {
            id: `reconnect-${f.source}-${h.target}-${l++}`,
            source: f.source,
            target: h.target,
            sourceHandle: f.sourceHandle,
            targetHandle: h.targetHandle
          };
          f.type && (p.type = f.type), f.animated !== void 0 && (p.animated = f.animated), f.style && (p.style = f.style), f.class && (p.class = f.class), f.markerEnd && (p.markerEnd = f.markerEnd), f.markerStart && (p.markerStart = f.markerStart), f.label && (p.label = f.label), s.add(g), r.push(p);
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
  ) || n?.preventCycles && pf(t.source, t.target, e));
}
const dt = "_flowHandleValidate";
function yf(t) {
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
const xt = "_flowHandleLimit";
function wf(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[xt] = s : delete e[xt];
      }), r(() => {
        delete e[xt];
      });
    }
  );
}
const Ft = "_flowHandleConnectableStart", ut = "_flowHandleConnectableEnd";
function vf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[Ft] = u), d && (e[ut] = u);
      }), s(() => {
        delete e[Ft], delete e[ut];
      });
    }
  );
}
function _n(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Rr(t) {
  return _n(t, t.draggable);
}
function _f(t) {
  return _n(t, t.deletable);
}
function ze(t) {
  return _n(t, t.connectable);
}
function Zo(t) {
  return _n(t, t.selectable);
}
function ls(t) {
  return _n(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(l * l + a * a), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), g = n - l / u * h, p = o - a / u * h, y = n + c / f * h, m = o + d / f * h;
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
function bf({
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
  ), u = a ? o + (r === "right" ? 1 : -1) * Mn(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = a ? i : i + (r === "bottom" ? 1 : -1) * Mn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function Qn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = bf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = bn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function ly({
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
function cs(t) {
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
function xf(t, e, n, o, i, r, s) {
  const l = cs(n), a = cs(r), c = t + l.x * s, d = e + l.y * s, u = o + a.x * s, f = i + a.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const p = (c + u) / 2, y = (d + f) / 2;
    return h ? [
      [c, e],
      [p, e],
      [p, i],
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
  const a = xf(
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
      const [m, v] = g === 1 ? [t, e] : a[g - 1], [C, _] = a[g + 1];
      c += ` ${Xt(m, v, p, y, C, _, s)}`;
    } else
      c += ` L${p},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = bn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Ef(t) {
  return yn({ ...t, borderRadius: 0 });
}
function Fr({
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
function Cf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < it && s >= 0 ? i = -o * (1 - s / it) : l < it && l >= 0 && (i = o * (1 - l / it)), a < it && a >= 0 ? r = -o * (1 - a / it) : c < it && c >= 0 && (r = o * (1 - c / it)), { dx: i, dy: r };
}
function Hr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Cf(r, s, c, n);
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
function Ht(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || kr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || gn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Hu),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Ou
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
    let g;
    switch (e) {
      case "bezier": {
        g = Qn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        g = yn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        g = Ef({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        g = Fr({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
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
function eo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Hr({
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
    if (s?.[xt] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[xt])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[xt] && n.filter(
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[xt])
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
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && ct(u, r, { preventCycles: o._config?.preventCycles }), g = h && Ge(t, u, r);
    g && Ke(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !g ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
  }
}
function Pe(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function _t(t, e) {
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
    X("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const l = typeof s == "boolean" ? s : !!s?.allowed, a = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: l, reason: a },
    bubbles: !0
  })), { allowed: l, reason: a };
}
async function Or(t) {
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
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = no(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await to(
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
async function zr(t) {
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
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = no(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await to(
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
function Sf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let g;
      c && u ? g = "top-left" : c && f ? g = "top-right" : d && u ? g = "bottom-left" : d && f ? g = "bottom-right" : c ? g = "top" : f ? g = "right" : d ? g = "bottom" : u ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let p, y = !1;
      if (i) {
        const _ = r(i);
        _ && typeof _ == "object" && !Array.isArray(_) ? (p = _.id || e.getAttribute("data-flow-handle-id") || a, _.position && (g = _.position, y = !0)) : p = _ || e.getAttribute("data-flow-handle-id") || a;
      } else
        p = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const _ = r(i);
        _ && typeof _ == "object" && !Array.isArray(_) && _.position && (e.dataset.flowHandlePosition = _.position);
      })), !h && !y) {
        const _ = () => {
          const L = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!L) return;
          const P = e.closest("[x-data]");
          return P ? t.$data(P)?.getNode?.(L) : void 0;
        };
        s(() => {
          const k = _();
          if (!k) return;
          const L = a === "source" ? k.sourcePosition : k.targetPosition;
          L && (e.dataset.flowHandlePosition = L);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${a}`);
      const m = () => {
        const _ = e.closest("[x-flow-node]");
        return _ ? _.getAttribute("data-flow-node-id") ?? null : null;
      }, v = () => {
        const _ = e.closest("[x-data]");
        return _ ? t.$data(_) : null;
      };
      let C = null;
      if (v()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${p}`);
        const k = ($) => {
          const x = $?._pendingKeyboardConnect;
          if (!x) return;
          const E = e.closest(".flow-container");
          E && E.querySelector(
            `[data-flow-node-id="${CSS.escape(x.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(x.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), $ && ($._pendingKeyboardConnect = null);
        }, L = ($) => {
          if (!($.key === "Enter" || $.key === " " || $.key === "Spacebar")) return;
          const E = v();
          if (!E || E._animationLocked) return;
          const A = m();
          if (A)
            if (a === "source") {
              const M = E.getNode?.(A);
              if (M && !ze(M) || e[Ft] === !1) return;
              $.preventDefault(), $.stopPropagation(), k(E), E._pendingKeyboardConnect = {
                sourceNodeId: A,
                sourceHandleId: p
              }, e.classList.add("flow-handle-connect-pending"), E._announcer?.announce?.(`Connecting from ${a} handle ${p}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!E._pendingKeyboardConnect) return;
              const M = E.getNode?.(A);
              if (M && !ze(M) || e[ut] === !1) return;
              $.preventDefault(), $.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: b } = E._pendingKeyboardConnect, D = {
                source: w,
                sourceHandle: b,
                target: A,
                targetHandle: p
              }, T = e.closest(".flow-container");
              if (k(E), !T) return;
              zr({ connection: D, canvas: E, containerEl: T }).then((O) => {
                O.applied && E._announcer?.announce?.(`Connected ${w} to ${A}.`);
              });
            }
        };
        e.addEventListener("keydown", L);
        const P = e.closest(".flow-container");
        if (P) {
          const $ = Tn.get(P);
          if ($)
            $.count += 1;
          else {
            const x = (E) => {
              if (E.key !== "Escape") return;
              const A = P.matches("[x-data]") ? P : P.closest("[x-data]") ?? P.querySelector("[x-data]");
              if (!A) return;
              const M = t.$data(A);
              M?._pendingKeyboardConnect && k(M);
            };
            P.addEventListener("keydown", x), Tn.set(P, { count: 1, handler: x });
          }
        }
        C = () => {
          if (e.removeEventListener("keydown", L), P) {
            const $ = Tn.get(P);
            $ && ($.count -= 1, $.count <= 0 && (P.removeEventListener("keydown", $.handler), Tn.delete(P)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let _ = null;
        const k = ($) => {
          $.preventDefault(), $.stopPropagation();
          const x = v(), E = e.closest("[x-flow-node]");
          if (!x || !E || x._animationLocked) return;
          const A = E.dataset.flowNodeId;
          if (!A) return;
          const M = x.getNode(A);
          if (M && !ze(M) || e[Ft] === !1) return;
          const w = $.clientX, b = $.clientY;
          let D = !1;
          if (x.pendingConnection && x._config?.connectOnClick !== !1) {
            x._emit("connect-end", {
              connection: null,
              source: x.pendingConnection.source,
              sourceHandle: x.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), x.pendingConnection = null, x._container?.classList.remove("flow-connecting");
            const F = e.closest(".flow-container");
            F && Pe(F);
          }
          let T = null, O = null, W = null, S = null, N = null;
          const R = x._config?.connectionSnapRadius ?? 20, q = e.closest(".flow-container");
          let se = 0, ne = 0, ie = !1, le = /* @__PURE__ */ new Map();
          const de = () => {
            if (D = !0, X("connection", `Connection drag started from node "${A}" handle "${p}"`), x._emit("connect-start", { source: A, sourceHandle: p }), !q) return;
            O = Ht({
              connectionLineType: x._config?.connectionLineType,
              connectionLineStyle: x._config?.connectionLineStyle,
              connectionLine: x._config?.connectionLine,
              containerEl: q
            }), T = O.svg;
            const F = e.getBoundingClientRect(), K = q.getBoundingClientRect(), U = x._viewportLive ?? x.viewport, V = U?.zoom || 1, I = U?.x || 0, re = U?.y || 0;
            se = (F.left + F.width / 2 - K.left - I) / V, ne = (F.top + F.height / 2 - K.top - re) / V, O.update({ fromX: se, fromY: ne, toX: se, toY: ne, source: A, sourceHandle: p });
            const G = q.querySelector(".flow-viewport");
            if (G && G.appendChild(T), x.pendingConnection = {
              source: A,
              sourceHandle: p,
              position: { x: se, y: ne }
            }, S = eo(q, x, w, b), ln(q, A, p, x), x._config?.onEdgeDrop) {
              const Y = x._config.edgeDropPreview, z = Y ? Y({ source: A, sourceHandle: p }) : "New Node";
              if (z !== null) {
                N = document.createElement("div"), N.className = "flow-ghost-node";
                const oe = document.createElement("div");
                if (oe.className = "flow-ghost-handle", N.appendChild(oe), typeof z == "string") {
                  const j = document.createElement("span");
                  j.textContent = z, N.appendChild(j);
                } else
                  N.appendChild(z);
                N.style.left = `${se}px`, N.style.top = `${ne}px`;
                const B = q.querySelector(".flow-viewport");
                B && B.appendChild(N);
              }
            }
          }, ue = () => {
            const F = [...x.selectedNodes], K = [], U = q.getBoundingClientRect(), V = x._viewportLive ?? x.viewport, I = V?.zoom || 1, re = V?.x || 0, G = V?.y || 0;
            for (const Y of F) {
              if (Y === A) continue;
              const z = q?.querySelector(`[data-flow-node-id="${CSS.escape(Y)}"]`)?.querySelector('[data-flow-handle-type="source"]');
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
            ie = !0, O && (le.set(A, {
              line: O,
              sourceNodeId: A,
              sourceHandleId: p,
              sourcePos: { x: se, y: ne },
              valid: !0
            }), O = null);
            const K = ue(), U = q.querySelector(".flow-viewport");
            for (const V of K) {
              const I = Ht({
                connectionLineType: x._config?.connectionLineType,
                connectionLineStyle: x._config?.connectionLineStyle,
                connectionLine: x._config?.connectionLine,
                containerEl: q
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
              const V = F.clientX - w, I = F.clientY - b;
              if (Math.abs(V) >= On || Math.abs(I) >= On) {
                if (de(), x._config?.multiConnect && x.selectedNodes.size > 1 && x.selectedNodes.has(A)) {
                  const re = x.screenToFlowPosition(F.clientX, F.clientY);
                  J(re);
                }
              } else
                return;
            }
            const K = x.screenToFlowPosition(F.clientX, F.clientY);
            if (ie) {
              const V = an({
                containerEl: q,
                handleType: "target",
                excludeNodeId: A,
                cursorFlowPos: K,
                connectionSnapRadius: R,
                getNode: (te) => x.getNode(te),
                toFlowPosition: (te, z) => x.screenToFlowPosition(te, z),
                connectionMode: x._config?.connectionMode
              });
              V.element !== W && (W?.classList.remove("flow-handle-active"), V.element?.classList.add("flow-handle-active"), W = V.element);
              const re = V.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, G = V.element?.dataset.flowHandleId ?? "target", Y = x._config?.connectionLineStyle?.stroke ?? (getComputedStyle(q).getPropertyValue("--flow-edge-stroke-selected").trim() || gn);
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
                  }, Z = x.getNode(re)?.connectable !== !1 && te.sourceNodeId !== re && ct(z, x.edges, { preventCycles: x._config?.preventCycles }) && lt(z, x._config?.connectionRules, x._nodeMap) && Ge(q, z, x.edges) && Ke(q, z) && (!x._config?.isValidConnection || x._config.isValidConnection(z));
                  te.valid = Z;
                  const ae = te.line.svg.querySelector("path");
                  if (ae)
                    if (Z)
                      ae.setAttribute("stroke", Y);
                    else {
                      const fe = getComputedStyle(q).getPropertyValue("--flow-connection-line-invalid").trim() || kr;
                      ae.setAttribute("stroke", fe);
                    }
                } else {
                  te.valid = !0;
                  const z = te.line.svg.querySelector("path");
                  z && z.setAttribute("stroke", Y);
                }
              x.pendingConnection = { ...x.pendingConnection, position: V.position }, S?.updatePointer(F.clientX, F.clientY);
              return;
            }
            const U = an({
              containerEl: q,
              handleType: "target",
              excludeNodeId: A,
              cursorFlowPos: K,
              connectionSnapRadius: R,
              getNode: (V) => x.getNode(V),
              toFlowPosition: (V, I) => x.screenToFlowPosition(V, I)
            });
            U.element !== W && (W?.classList.remove("flow-handle-active"), U.element?.classList.add("flow-handle-active"), W = U.element), N ? U.element ? (N.style.display = "none", O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: A, sourceHandle: p })) : (N.style.display = "", N.style.left = `${K.x}px`, N.style.top = `${K.y}px`, O?.update({ fromX: se, fromY: ne, toX: K.x, toY: K.y, source: A, sourceHandle: p })) : O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: A, sourceHandle: p }), x.pendingConnection = { ...x.pendingConnection, position: U.position }, S?.updatePointer(F.clientX, F.clientY);
          }, ee = async (F) => {
            if (S?.stop(), S = null, document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), _ = null, x._connectValidating) return;
            if (ie) {
              const I = x.screenToFlowPosition(F.clientX, F.clientY);
              let re = W;
              re || (re = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]'));
              const Y = re?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, te = re?.dataset.flowHandleId ?? "target", z = [], oe = [], B = [], j = [];
              if (re && Y) {
                const H = x.getNode(Y);
                for (const Q of le.values()) {
                  const Z = {
                    source: Q.sourceNodeId,
                    sourceHandle: Q.sourceHandleId,
                    target: Y,
                    targetHandle: te
                  };
                  if (H?.connectable !== !1 && Q.sourceNodeId !== Y && ct(Z, x.edges, { preventCycles: x._config?.preventCycles }) && lt(Z, x._config?.connectionRules, x._nodeMap) && Ge(q, Z, x.edges) && Ke(q, Z) && (!x._config?.isValidConnection || x._config.isValidConnection(Z))) {
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
                x.addEdges(z);
                for (const H of oe)
                  x._emit("connect", { connection: H });
                x._emit("multi-connect", { connections: oe });
              }
              B.length > 0 && setTimeout(() => {
                for (const H of B)
                  H.line.destroy();
              }, 100), W?.classList.remove("flow-handle-active"), x._emit("connect-end", {
                connection: oe.length > 0 ? oe[0] : null,
                source: A,
                sourceHandle: p,
                position: I
              }), le.clear(), ie = !1, Pe(q), x.pendingConnection = null, x._container?.classList.remove("flow-connecting");
              return;
            }
            if (!D) {
              x._config?.connectOnClick !== !1 && (X("connection", `Click-to-connect started from node "${A}" handle "${p}"`), x._emit("connect-start", { source: A, sourceHandle: p }), x.pendingConnection = {
                source: A,
                sourceHandle: p,
                position: { x: 0, y: 0 }
              }, x._container?.classList.add("flow-connecting"), ln(q, A, p, x));
              return;
            }
            const K = O?.svg ?? null;
            N?.remove(), N = null, W?.classList.remove("flow-handle-active"), Pe(q);
            const U = x.screenToFlowPosition(F.clientX, F.clientY), V = { source: A, sourceHandle: p, position: U };
            try {
              let I = W;
              if (I || (I = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]')), I) {
                const G = I.closest("[x-flow-node]")?.dataset.flowNodeId, Y = I.dataset.flowHandleId ?? "target";
                if (G) {
                  if (I[ut] === !1) {
                    X("connection", "Connection rejected (handle not connectable end)"), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                    return;
                  }
                  const te = x.getNode(G);
                  if (te && !ze(te)) {
                    X("connection", `Connection rejected (target "${G}" not connectable)`), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                    return;
                  }
                  const z = {
                    source: A,
                    sourceHandle: p,
                    target: G,
                    targetHandle: Y
                  };
                  if (ct(z, x.edges, { preventCycles: x._config?.preventCycles })) {
                    if (!lt(z, x._config?.connectionRules, x._nodeMap)) {
                      X("connection", "Connection rejected (connection rules)", z), Ae(q, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (!Ge(q, z, x.edges)) {
                      X("connection", "Connection rejected (handle limit)", z), Ae(q, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (!Ke(q, z)) {
                      X("connection", "Connection rejected (per-handle validator)", z), Ae(q, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (x._config?.isValidConnection && !x._config.isValidConnection(z)) {
                      X("connection", "Connection rejected (custom validator)", z), Ae(q, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    const oe = x._config?.connectValidator;
                    if (oe) {
                      const j = x._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: H, targetEl: Q } = no(q, z);
                      x._connectValidating = !0, _t(K, !0);
                      let Z;
                      try {
                        Z = await to(
                          oe,
                          z,
                          H,
                          Q,
                          q,
                          j
                        );
                      } finally {
                        x._connectValidating = !1, _t(K, !1);
                      }
                      if (!Z.allowed) {
                        X("connection", "Connection rejected (async connectValidator)", { connection: z, reason: Z.reason }), Ae(q, { ...z, reason: Z.reason }), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                        return;
                      }
                    }
                    const B = `e-${A}-${G}-${Date.now()}-${on++}`;
                    x.addEdges({ id: B, ...z }), X("connection", `Connection created: ${A} → ${G}`, z), x._emit("connect", { connection: z }), x._emit("connect-end", { connection: z, ...V });
                  } else
                    X("connection", "Connection rejected (invalid)", z), Ae(q, z), x._emit("connect-end", { connection: null, ...V });
                } else
                  x._emit("connect-end", { connection: null, ...V });
              } else if (x._config?.onEdgeDrop) {
                const re = {
                  x: U.x - ve / 2,
                  y: U.y - _e / 2
                }, G = x._config.onEdgeDrop({
                  source: A,
                  sourceHandle: p,
                  position: re
                });
                if (G) {
                  const Y = {
                    source: A,
                    sourceHandle: p,
                    target: G.id,
                    targetHandle: "target"
                  };
                  if (!Ge(q, Y, x.edges))
                    X("connection", "Edge drop: connection rejected (handle limit)"), x._emit("connect-end", { connection: null, ...V });
                  else if (!Ke(q, Y))
                    X("connection", "Edge drop: connection rejected (per-handle validator)"), x._emit("connect-end", { connection: null, ...V });
                  else if (!x._config.isValidConnection || x._config.isValidConnection(Y)) {
                    x.addNodes(G);
                    const te = `e-${A}-${G.id}-${Date.now()}-${on++}`;
                    x.addEdges({ id: te, ...Y }), X("connection", `Edge drop: created node "${G.id}" and edge`, Y), x._emit("connect", { connection: Y }), x._emit("connect-end", { connection: Y, ...V });
                  } else
                    X("connection", "Edge drop: connection rejected by validator"), x._emit("connect-end", { connection: null, ...V });
                } else
                  X("connection", "Edge drop: callback returned null"), x._emit("connect-end", { connection: null, ...V });
              } else
                X("connection", "Connection cancelled (no target)"), x._emit("connect-end", { connection: null, ...V });
            } finally {
              _t(K, !1), O?.destroy(), O = null;
            }
            x.pendingConnection = null;
          };
          document.addEventListener("pointermove", ce), document.addEventListener("pointerup", ee), document.addEventListener("pointercancel", ee), _ = () => {
            document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), S?.stop(), O?.destroy(), O = null, N?.remove(), N = null;
            for (const F of le.values())
              F.line.destroy();
            le.clear(), ie = !1, W?.classList.remove("flow-handle-active"), Pe(q), x.pendingConnection = null, x._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", k);
        const L = () => {
          const $ = v();
          if (!$?._pendingReconnection || $._pendingReconnection.draggedEnd !== "source") return;
          const x = m();
          if (x) {
            const E = $.getNode(x);
            if (E && !ze(E)) return;
          }
          e[Ft] !== !1 && e.classList.add("flow-handle-active");
        }, P = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", L), e.addEventListener("pointerleave", P), l(() => {
          _?.(), C?.(), e.removeEventListener("pointerdown", k), e.removeEventListener("pointerenter", L), e.removeEventListener("pointerleave", P), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const _ = () => {
          const x = v();
          if (!x?.pendingConnection) return;
          const E = m();
          if (E) {
            const A = x.getNode(E);
            if (A && !ze(A)) return;
          }
          e[ut] !== !1 && e.classList.add("flow-handle-active");
        }, k = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", _), e.addEventListener("pointerleave", k);
        const L = async (x) => {
          const E = v();
          if (!E?.pendingConnection || E._config?.connectOnClick === !1 || E._connectValidating) return;
          x.preventDefault(), x.stopPropagation();
          const A = m();
          if (!A) return;
          if (e[ut] === !1) {
            X("connection", "Click-to-connect rejected (handle not connectable end)"), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const T = e.closest(".flow-container");
            T && Pe(T);
            return;
          }
          const M = E.getNode(A);
          if (M && !ze(M)) {
            X("connection", `Click-to-connect rejected (target "${A}" not connectable)`), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const T = e.closest(".flow-container");
            T && Pe(T);
            return;
          }
          const w = {
            source: E.pendingConnection.source,
            sourceHandle: E.pendingConnection.sourceHandle,
            target: A,
            targetHandle: p
          }, b = { source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (ct(w, E.edges, { preventCycles: E._config?.preventCycles })) {
            const T = e.closest(".flow-container");
            if (!lt(w, E._config?.connectionRules, E._nodeMap)) {
              X("connection", "Click-to-connect rejected (connection rules)", w), Ae(T, w), E._emit("connect-end", { connection: null, ...b }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), T && Pe(T);
              return;
            }
            if (T && !Ge(T, w, E.edges)) {
              X("connection", "Click-to-connect rejected (handle limit)", w), Ae(T, w), E._emit("connect-end", { connection: null, ...b }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(T);
              return;
            }
            if (T && !Ke(T, w)) {
              X("connection", "Click-to-connect rejected (per-handle validator)", w), Ae(T, w), E._emit("connect-end", { connection: null, ...b }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), T && Pe(T);
              return;
            }
            if (E._config?.isValidConnection && !E._config.isValidConnection(w)) {
              X("connection", "Click-to-connect rejected (custom validator)", w), Ae(T, w), E._emit("connect-end", { connection: null, ...b }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), T && Pe(T);
              return;
            }
            const O = E._config?.connectValidator;
            if (O && T) {
              const S = E._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: N, targetEl: R } = no(T, w);
              E._connectValidating = !0;
              let q;
              try {
                q = await to(
                  O,
                  w,
                  N,
                  R,
                  T,
                  S
                );
              } finally {
                E._connectValidating = !1;
              }
              if (!q.allowed) {
                X("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: q.reason }), Ae(T, { ...w, reason: q.reason }), E._emit("connect-end", { connection: null, ...b }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(T);
                return;
              }
            }
            const W = `e-${w.source}-${w.target}-${Date.now()}-${on++}`;
            E.addEdges({ id: W, ...w }), X("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), E._emit("connect", { connection: w }), E._emit("connect-end", { connection: w, ...b });
          } else {
            X("connection", "Click-to-connect rejected (invalid)", w);
            const T = e.closest(".flow-container");
            Ae(T, w), E._emit("connect-end", { connection: null, ...b });
          }
          E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
          const D = e.closest(".flow-container");
          D && Pe(D);
        };
        e.addEventListener("click", L);
        let P = null;
        const $ = (x) => {
          if (x.button !== 0) return;
          const E = v(), A = m();
          if (!E || !A || E._animationLocked || E._config?.edgesReconnectable === !1 || E._pendingReconnection) return;
          const M = E.edges.filter(
            (z) => z.target === A && (z.targetHandle ?? "target") === p
          );
          if (M.length === 0) return;
          const w = M.find((z) => z.selected) ?? (M.length === 1 ? M[0] : null);
          if (!w) return;
          const b = w.reconnectable ?? !0;
          if (b === !1 || b === "source") return;
          x.preventDefault(), x.stopPropagation();
          const D = x.clientX, T = x.clientY;
          let O = !1, W = !1, S = null;
          const N = E._config?.connectionSnapRadius ?? 20, R = e.closest(".flow-container");
          if (!R) return;
          const q = R.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), se = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', ne = q?.querySelector(se), ie = R.getBoundingClientRect(), le = E._viewportLive ?? E.viewport, de = le?.zoom || 1, ue = le?.x || 0, J = le?.y || 0;
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
          let F = null, K = null, U = null, V = D, I = T;
          const re = () => {
            O = !0;
            const z = R.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            z && z.classList.add("flow-edge-reconnecting"), E._emit("reconnect-start", { edge: w, handleType: "target" }), X("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), K = Ht({
              connectionLineType: E._config?.connectionLineType,
              connectionLineStyle: E._config?.connectionLineStyle,
              connectionLine: E._config?.connectionLine,
              containerEl: R
            }), F = K.svg;
            const oe = E.screenToFlowPosition(D, T);
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
                (z.clientX - D) ** 2 + (z.clientY - T) ** 2
              ) >= On && re();
              return;
            }
            const oe = E.screenToFlowPosition(z.clientX, z.clientY), B = an({
              containerEl: R,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: oe,
              connectionSnapRadius: N,
              getNode: (j) => E.getNode(j),
              toFlowPosition: (j, H) => E.screenToFlowPosition(j, H)
            });
            B.element !== S && (S?.classList.remove("flow-handle-active"), B.element?.classList.add("flow-handle-active"), S = B.element), K?.update({
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
            W = !0, document.removeEventListener("pointermove", G), document.removeEventListener("pointerup", te), document.removeEventListener("pointercancel", te), U?.stop(), U = null, K?.destroy(), K = null, F = null, S?.classList.remove("flow-handle-active"), P = null;
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
            let oe = S;
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
                _t(pe, !0);
                let me;
                try {
                  me = await Or({
                    edge: w,
                    newConnection: ae,
                    canvas: E,
                    containerEl: R,
                    endpoint: "target"
                  });
                } finally {
                  _t(pe, !1);
                }
                me.applied ? (B = !0, X("reconnect", `Edge "${w.id}" reconnected (target)`, ae), E._emit("reconnect", { oldEdge: fe, newConnection: ae })) : X("reconnect", "Reconnection rejected", { connection: ae, reason: me.reason });
              }
            }
            B || X("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), E._emit("reconnect-end", { edge: w, successful: B }), Y();
          };
          document.addEventListener("pointermove", G), document.addEventListener("pointerup", te), document.addEventListener("pointercancel", te), P = Y;
        };
        e.addEventListener("pointerdown", $), l(() => {
          P?.(), C?.(), e.removeEventListener("pointerdown", $), e.removeEventListener("pointerenter", _), e.removeEventListener("pointerleave", k), e.removeEventListener("click", L), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const ds = {
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
function kf(t) {
  if (!t) return { ...ds };
  const e = { ...ds };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Xe(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Lf(t, e, n, o) {
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
function Pf(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, l = 0, a = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), a = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(f) {
    const h = f.clientX - s, g = f.clientY - l;
    h * h + g * g > i * i && c();
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
const us = 20;
function Vr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Mf(t, e) {
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
function Ko(t, e, n) {
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
  const o = Ko(t, e, n);
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
function St(t) {
  const e = Vr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Br(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Br(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function qr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function Eo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function An(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ve, height: _e };
  return qr(t, o, i);
}
function Tf(t, e, n) {
  const o = t.x + e.width + us, i = t.y + e.height + us, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function fs(t, e, n) {
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
function Af(t, e, n) {
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
function Nf(t, e, n) {
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
function $f(t, e, n) {
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
function If(t, e, n) {
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
function Df(t, e, n) {
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
function Rf(t, e, n) {
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
function Ff(t, e, n) {
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
const Xr = {
  circle: { perimeterPoint: Af },
  diamond: { perimeterPoint: Nf },
  hexagon: { perimeterPoint: $f },
  parallelogram: { perimeterPoint: If },
  triangle: { perimeterPoint: Df },
  cylinder: { perimeterPoint: Rf },
  stadium: { perimeterPoint: Ff }
};
function Yr(t, e = "light") {
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
const Co = "__alpineflow_collab_store__";
function Hf() {
  return typeof globalThis < "u" ? (globalThis[Co] || (globalThis[Co] = /* @__PURE__ */ new WeakMap()), globalThis[Co]) : /* @__PURE__ */ new WeakMap();
}
const Re = Hf(), So = "__alpineflow_registry__";
function Wr() {
  return typeof globalThis < "u" ? (globalThis[So] || (globalThis[So] = /* @__PURE__ */ new Map()), globalThis[So]) : /* @__PURE__ */ new Map();
}
function At(t) {
  return Wr().get(t);
}
function Of(t, e) {
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
const zf = 1e3;
class Vf {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Of, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, zf);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Bf {
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
        const g = r.get(h.source);
        if (!g) continue;
        const p = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        p in g && (d[y] = g[p]);
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
const qf = {
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
}, Xf = {
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
}, Yf = {
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
}, hs = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Wf(t, e) {
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
    const r = hs[o.style] ?? hs.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
      const u = i[d], f = i[d + 1], h = t.edges.find((g) => g.source === u && g.target === f);
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
function jf(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const Uf = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Zf = 150;
function Kf(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function Gf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = jf(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = qf[o], u = d ? d(a) : [a], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = Uf.has(o) ? Kf(l, Zf) : l;
  }
}
function Jf(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(Xf)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = Yf[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Qf = 5;
function eh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Qf && !o.has(c) && (o.add(c), console.warn(
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
function th(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function nh(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function cn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function jr(t, e, n, o) {
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
function ps(t, e, n) {
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
function Ur(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function oh(t, e, n = !0) {
  const o = Yt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Yt(i);
    return n ? Ur(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function ih(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Yt(t), i = Yt(e);
  return n ? Ur(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function sh(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const l of o) {
    const a = r + e, c = s + n, d = l.x + l.width, u = l.y + l.height;
    if (r < d + i && a > l.x - i && s < u + i && c > l.y - i) {
      const f = a - (l.x - i), h = d + i - r, g = c - (l.y - i), p = u + i - s, y = Math.min(f, h, g, p);
      y === f ? r -= f : y === h ? r += h : y === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function rh(t) {
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
      X("init", `Adding ${o.length} node(s)`, o.map((c) => c.id));
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
            const u = t._nodeMap.get(c.parentId);
            if (u) {
              const f = [
                ...t.nodes.filter(
                  (g) => g.parentId === c.parentId
                ),
                ...r.filter(
                  (g) => g.parentId === c.parentId
                )
              ], h = jr(u, c, f, d);
              if (!h.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: u,
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
      t.nodes = St(t.nodes), t._rebuildNodeMap();
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
            const u = t.nodes.find((g) => g.id === c);
            if (!u) continue;
            const f = u.dimensions?.width ?? 0, h = u.dimensions?.height ?? 0;
            u.position.x = d.x - f / 2, u.position.y = d.y - h / 2;
          }
        });
      }), t._recomputeChildValidation();
      const l = /* @__PURE__ */ new Set();
      for (const c of o)
        if (c.parentId && t._nodeMap.get(c.parentId)?.childLayout) {
          if (c.order == null) {
            const u = t.nodes.filter(
              (f) => f.parentId === c.parentId && f.id !== c.id
            );
            c.order = u.length > 0 ? Math.max(...u.map((f) => f.order ?? 0)) + 1 : 0;
          }
          l.add(c.parentId);
        }
      const a = /* @__PURE__ */ new Set();
      for (const c of l) {
        let d = c, u = t._nodeMap.get(c)?.parentId;
        for (; u; ) {
          const f = t._nodeMap.get(u);
          f?.childLayout && (d = u), u = f?.parentId;
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
      for (const u of [...n]) {
        const f = t._nodeMap.get(u);
        if (!f?.parentId || n.has(f.parentId)) continue;
        const h = t._getChildValidation(f.parentId);
        if (!h) continue;
        const g = t._nodeMap.get(f.parentId);
        if (!g) continue;
        const p = t.nodes.filter(
          (m) => m.parentId === f.parentId
        ), y = io(g, f, p, h);
        y.valid || (o.add(u), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
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
        for (const f of ht(u, t.nodes))
          n.add(f);
      X("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = mf(n, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (l.push(u.id), !1) : !0), s.length && (t.edges.push(...s), X("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const a = t._container ? Re.get(t._container) : void 0;
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
          const g = t._nodeMap.get(h);
          g?.childLayout && (f = h), h = g?.parentId;
        }
        d.add(f);
      }
      for (const u of d) t.layoutChildren?.(u);
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
      return Uo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return hf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return ff(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return gf(e, n, t.edges, o);
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
      X("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (X("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? oh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : ih(i, r, o);
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
function ah(t) {
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
      t._captureHistory(), X("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
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
      X("edge", `Removing ${n.size} edge(s)`, [...n]);
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
function lh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Er(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return $u(e, n, t._viewportLive ?? t.viewport, o);
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
        n?.padding ?? Wo
      );
      X("viewport", "fitBounds", { rect: e, viewport: i });
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
        n ?? Wo
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      X("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Zi, o);
      X("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Zi, o);
      X("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, l = r.clientWidth / 2 - e * s, a = r.clientHeight / 2 - n * s;
      X("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: l, y: a, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      X("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, X("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
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
      X("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let vt = null;
const ch = 20;
function Go(t) {
  return JSON.parse(JSON.stringify(t));
}
function gs(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function Zr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return vt = {
    nodes: Go(n),
    edges: Go(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function dh() {
  if (!vt || vt.nodes.length === 0) return null;
  vt.pasteCount++;
  const t = vt.pasteCount * ch, e = /* @__PURE__ */ new Map(), n = vt.nodes.map((i) => {
    const r = gs(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Go(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = vt.edges.map((i) => ({
    ...i,
    id: gs(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function uh(t, e) {
  const n = Zr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function fh(t) {
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
        X("selection", "Deselecting all");
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
        return c ? _f(c) : !1;
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
        ), f = io(d, a, u, c);
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
            X("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (a.nodes.length > 0 && (X("delete", `onBeforeDelete approved ${a.nodes.length} node(s)`), t.removeNodes(a.nodes.map((c) => c.id))), a.edges.length > 0) {
              const c = a.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
              c.length > 0 && (X("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
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
          if (o.length > 0 && (X("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((a) => a.id))), n.length > 0) {
            const a = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            a.length > 0 && (X("delete", `Deleting ${a.length} selected edge(s)`), t.removeEdges(a));
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
      const e = Zr(t.nodes, t.edges);
      e.nodeCount > 0 && (X("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
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
      const e = dh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = St(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), X("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
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
      const e = uh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), X("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function hh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function so(t, e, n = {}) {
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
      a === "id" || a === "__proto__" || a === "constructor" || a === "prototype" || hh(l[a], c) || (l[a] = c);
    r.push(l);
  }
  return r;
}
function ms(t, e, n) {
  const o = so(t.nodes, St(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = so(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++;
  }), X("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function ph(t) {
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
      if (X("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes) {
        const n = St(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = so(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = so(t.edges, n);
        t.edges.splice(0, t.edges.length, ...o);
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
      X("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      X("store", "$clear: emptying canvas"), this.fromObject({
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
      e && ms(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && ms(t, e, "redo");
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
function gh(t, e) {
  return t * (1 - e);
}
function mh(t, e) {
  return t * e;
}
function yh(t, e) {
  return e === "in" ? t : 1 - t;
}
function wh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? gh(o, e) : mh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function vh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function _h(t, e, n) {
  t.style.opacity = String(yh(e, n));
}
function bh(t) {
  t.style.removeProperty("opacity");
}
const Qe = Math.PI * 2, Qt = /* @__PURE__ */ new Map(), xh = 64;
function vi(t) {
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
  if (Qt.size >= xh) {
    const r = Qt.keys().next().value;
    r !== void 0 && Qt.delete(r);
  }
  return Qt.set(t, i), i;
}
function cy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(Qe * a * l + o * Qe),
    y: n + s * Math.sin(Qe * a * l + o * Qe)
  });
}
function dy(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), u = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), g = u;
  return (p) => {
    const y = e + a * p, m = n + c * p, v = r * Math.sin(Qe * s * p + l * Qe);
    return { x: y + h * v, y: m + g * v };
  };
}
function uy(t, e) {
  const n = vi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function fy(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(Qe * l + r * Qe);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function hy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * Qe, f = (Math.sin(s * u) + Math.sin(l * u * 1.3)) / 2, h = (Math.sin(a * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function py(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let ys = !1;
function ye(t) {
  try {
    return structuredClone(t);
  } catch {
    return ys || (ys = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function Eh(t) {
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
function Ch(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function Sh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = ye(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class _i {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Lr();
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
    const o = new _i(this._canvas, this._engine);
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
    return Pr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, Eh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, Ch(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && Sh(o, n);
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
        const x = this._subTimelines.indexOf($);
        x >= 0 && this._subTimelines.splice(x, 1);
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
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, v = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, v = this._resolveTargetViewport(e));
    const C = e.edgeTransition ?? "none", _ = e.addEdges?.map(($) => $.id) ?? [], k = e.removeEdges?.filter(($) => this._canvas.getEdge($)).slice() ?? [], L = {
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
      nodeFromStyles: u,
      edgeFromStrokeWidth: f,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: v,
      transition: C,
      addEdgeIds: _,
      removeEdgeIds: k
    };
    if (i === 0)
      return this._executeInstantStep(L);
    const P = this._prepareAnimatedEdges(e, C, _);
    return P && await P, g ? this._executeFollowPathStep(L) : this._executeAnimatedStep(L);
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
    const n = vi(e.followPath);
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
      viewportTarget: g,
      transition: p,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: v
    } = e, C = e.resolvedPathFn;
    return new Promise((_) => {
      const k = this._engine.register((L) => {
        if (this._state === "stopped")
          return _(), !0;
        const P = Math.min(L / i, 1), $ = s(P);
        if (l) {
          const x = C($);
          for (const E of l) {
            const A = this._canvas.getNode(E);
            A && (A.position.x = x.x, A.position.y = x.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          $,
          l,
          a,
          c,
          d,
          u,
          f,
          h,
          g
        ), this._tickEdgeTransitions(p, y, m, $), n.onProgress?.(P, o), P >= 1 ? (this._cleanupEdgeTransitions(p, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), v && n.guidePath?.autoRemove !== !1 && v.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), _(), !0) : !1;
      }, r);
      this._activeHandles.push(k);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, l, a, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = et(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = et(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = mn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), g = s.get(f);
        h && g && (h.style = Mr(g, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 ? f.strokeWidth = et(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = gi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = Xu(c, d, n, {
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
    return new Promise((g) => {
      const p = this._buildAnimateTargets(
        n,
        s,
        l,
        a,
        c
      ), y = Object.keys(p.nodes || {}).length > 0 || Object.keys(p.edges || {}).length > 0 || p.viewport;
      if (!y && !u.length && !f.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
        return;
      }
      if (y) {
        const m = this._canvas.animate(p, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (v) => {
            if (this._state === "stopped") {
              m.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, u, f, v), n.onProgress?.(v, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, u, f), f.length && this._removeEdges(f), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
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
      r && wh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && vh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && _h(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && bh(o);
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
const Kr = /* @__PURE__ */ new Map();
function Ut(t, e) {
  Kr.set(t, e);
}
function kh(t) {
  return Kr.get(t);
}
const Fe = "http://www.w3.org/2000/svg", Lh = {
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
}, Ph = {
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
let Mh = 0;
const Th = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Mh}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, l = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, u = n.__gradient;
      if (!d) {
        let p = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(Fe, "defs");
          u = document.createElementNS(Fe, "linearGradient"), u.setAttribute("id", l), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const v = document.createElementNS(Fe, "stop");
            v.setAttribute("offset", String(m.offset)), v.setAttribute("stop-color", m.color), m.opacity !== void 0 && v.setAttribute("stop-opacity", String(m.opacity)), u.appendChild(v);
          }
          y.appendChild(u), n.appendChild(y), p = `url(#${l})`, n.__gradient = u;
        }
        d = document.createElementNS(Fe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = p, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, g = o - h;
      if (d.setAttribute("stroke-dashoffset", String(g)), u) {
        const p = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(p), v = e.pathEl.getPointAtLength(y);
        u.setAttribute("x1", String(v.x)), u.setAttribute("y1", String(v.y)), u.setAttribute("x2", String(m.x)), u.setAttribute("y2", String(m.y));
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
}, Ah = {
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
}, Nh = {
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
Ut("circle", Lh);
Ut("orb", Ph);
Ut("beam", Th);
Ut("pulse", Ah);
Ut("image", Nh);
let ws = !1;
function $h(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function vs(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : $h(o);
}
function Ih(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = kh(l);
    if (!a) {
      X("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !ws && (ws = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? gn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), g = vs(r, h, f), p = { ...r, size: d, color: u }, y = a.create(i, p), m = o.getPointAtLength(0), v = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, v);
    let C;
    const _ = new Promise((x) => {
      C = x;
    }), k = () => {
      typeof r.onComplete == "function" && r.onComplete(), C();
    }, L = s.wrapOnComplete ? s.wrapOnComplete(k) : k, P = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: L,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(P), t._particleEngineHandle || (t._particleEngineHandle = Kn.register((x) => t._tickParticles(x))), {
      getCurrentPosition() {
        return t._activeParticles.has(P) ? { ...P.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(P) && (P.renderer.destroy(P.element), t._activeParticles.delete(P), L());
      },
      get finished() {
        return _;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      X("particle", "sendParticleAlongPath: SVG layer unavailable");
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
    return X("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), l;
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
        X("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const l = t.getEdgePathElement(o);
      if (!l) {
        X("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!l.getAttribute("d")) {
        X("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? gn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(l, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return g && X("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), g;
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
        X("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const l = t.getNode(i);
      if (!l) {
        X("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const a = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = l.position.x + (l.dimensions?.width ?? 150) / 2, u = l.position.y + (l.dimensions?.height ?? 40) / 2, f = `M ${a} ${c} L ${d} ${u}`;
      return X("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
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
          const g = setTimeout(() => {
            c.push(this.sendParticle(o, h));
          }, f * s);
          d.push(g);
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
        const f = o.map((p) => {
          const m = t.getEdgePathElement(p)?.getTotalLength() ?? 0;
          return { id: p, length: m };
        }).filter((p) => p.length > 0);
        if (f.length === 0) {
          const p = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: p, stopAll() {
          } };
        }
        const h = Math.max(...f.map((p) => p.length)), g = vs(a, h, "2s");
        for (const { id: p, length: y } of f) {
          const m = y / h, v = g * m, C = g - v;
          if (C <= 0) {
            const _ = this.sendParticle(p, { ...a, duration: v });
            _ && c.push(_);
          } else {
            const _ = setTimeout(() => {
              const k = this.sendParticle(p, { ...a, duration: v });
              k && c.push(k);
            }, C);
            d.push(_);
          }
        }
      } else
        for (const f of o) {
          const h = this.sendParticle(f, a);
          h && c.push(h);
        }
      const u = new Promise((f) => {
        setTimeout(() => {
          Promise.all(c.map((g) => g.finished)).then(() => {
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
class Dh {
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
const Jo = 1, Qo = 1 / 60;
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
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? $r(r) ?? void 0 : void 0, l = {
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
            Tr(r, o, n);
            break;
          case "decay":
            mi(r, o, n);
            break;
          case "inertia":
            Ar(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            Nr(r, s, a, i), a >= 1 && (r.settled = !0);
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
const Gr = /* @__PURE__ */ new Map();
function bi(t, e) {
  Gr.set(t, e);
}
function Rh(t) {
  return Gr.get(t);
}
function xi(t, e = 20) {
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
function Jr(t) {
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
const Fh = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = xi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += Jr(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Hh = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = xi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const u = t.nodes[d.source], f = t.nodes[d.target];
      if (!u || !f)
        continue;
      const h = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, g = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2, p = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, y = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${g}" x2="${p}" y2="${y}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Oh = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = xi(t.nodes);
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
    u += Jr(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, g = f.position?.y ?? 0, p = f.dimensions?.width ?? 150, y = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
bi("faithful", Fh);
bi("outline", Hh);
bi("activity", Oh);
function ei(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function ti(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function zh(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Qr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Qr(t[e]);
  }
  return t;
}
class Ei {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Qr(ye(e.initialState)), this.events = Object.freeze(ye(e.events)), this.checkpoints = Object.freeze(ye(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
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
    if (e.version > Jo)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Jo}). Please update AlpineFlow to replay this recording.`
      );
    return new Ei(e);
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
      const i = zh(o.canvas, e);
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
    const l = Qo * 1e3;
    let a = o ? ei(r, i) : ti(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Rh(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Vh {
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
      version: Jo,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Ei(i);
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
class Bh {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = ko(), this._scheduleTick());
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
    const l = Qo * 1e3;
    let a = n ? ei(r, i) : ti(r, i);
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
    const e = ko(), n = (e - this._lastWallTime) / 1e3;
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
    const s = Qo * 1e3;
    let l = e === 0 ? ti(i, 0) : ei(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = ko(), this._scheduleTick();
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
function ko() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function qh(t) {
  const e = Ih(t);
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
      const n = new _i(t, Kn);
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
        X("animation", `Named animation "${n}" not found`);
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
      if (X("animate", "update() called", {
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
            let v = null;
            typeof g.followPath == "function" ? v = g.followPath : v = vi(g.followPath);
            let C = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const _ = t.getEdgeSvgElement?.();
              _ && (C = document.createElementNS("http://www.w3.org/2000/svg", "path"), C.setAttribute("d", g.followPath), C.classList.add("flow-guide-path"), g.guidePath.class && C.classList.add(g.guidePath.class), _.appendChild(C));
            }
            if (v) {
              const _ = v, k = C, L = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (P) => {
                  const $ = t._nodeMap.get(h);
                  if (!$) return;
                  const x = _(P);
                  Le().raw($).position.x = x.x, Le().raw($).position.y = x.y, s.add(h), P >= 1 && k && L && k.remove();
                }
              });
            }
          } else if (g.position) {
            const C = Le().raw(p).position;
            if (g.position.x !== void 0) {
              const _ = g.position.x;
              if (m)
                C.x = _;
              else {
                const k = C.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: k,
                  to: _,
                  apply: (L) => {
                    const P = t._nodeMap.get(h);
                    P && (Le().raw(P).position.x = L, s.add(h));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const _ = g.position.y;
              if (m)
                C.y = _;
              else {
                const k = C.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: k,
                  to: _,
                  apply: (L) => {
                    const P = t._nodeMap.get(h);
                    P && (Le().raw(P).position.y = L), s.add(h);
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
              const v = mn(p.style || {}), C = mn(g.style), _ = t._nodeElements.get(h);
              if (_) {
                const k = getComputedStyle(_);
                for (const L of Object.keys(C))
                  v[L] === void 0 && (v[L] = k.getPropertyValue(L));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (k) => {
                  const L = t._nodeMap.get(h);
                  L && (Le().raw(L).style = Mr(v, C, k), l.add(h));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (m ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (v) => {
              p.dimensions.width = v;
            }
          })), g.dimensions.height !== void 0 && (p.fixedDimensions = !0, m ? p.dimensions.height = g.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: p.dimensions.height,
            to: g.dimensions.height,
            apply: (v) => {
              p.dimensions.height = v;
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
              const v = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || pi;
              r.push({
                key: `edge:${h}:color`,
                from: v,
                to: g.color,
                apply: (C) => {
                  const _ = t._edgeMap.get(h);
                  _ && (Le().raw(_).color = C, a.add(h));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (m)
              p.strokeWidth = g.strokeWidth, a.add(h);
            else {
              const v = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: v,
                to: g.strokeWidth,
                apply: (C) => {
                  const _ = t._edgeMap.get(h);
                  _ && (Le().raw(_).strokeWidth = C, a.add(h));
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
      const f = Le().raw(t._animator).animate(r, {
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
      const i = Pr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
            const v = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - v[0]), d.y += m.dimensions.height * (0.5 - v[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const y = n.getCurrentPosition();
          if (y)
            d = y;
          else
            return s = !0, a.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const u = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, f = l ?? t.viewport.zoom, h = u.width / 2 - d.x * f, g = u.height / 2 - d.y * f, p = 0.08;
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
      return new Dh(n, {
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
        sendConverging: (p, y) => u.call(i, p, y),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, h = new Vh(f, o), g = async () => {
        i.animate = (...p) => f.animate(...p), i.update = (...p) => f.update(...p), i.sendParticle = (...p) => f.sendParticle(...p), i.sendParticleAlongPath = (...p) => f.sendParticleAlongPath(...p), i.sendParticleBetween = (...p) => f.sendParticleBetween(...p), i.sendParticleBurst = (...p) => f.sendParticleBurst(...p), i.sendConverging = (...p) => f.sendConverging(...p);
        try {
          const p = n();
          p instanceof Promise && await p;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = l, i.sendParticleAlongPath = a, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = u;
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
      return new Bh(r, n, o);
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
function _s(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return ht(t, e);
  const r = /* @__PURE__ */ new Set(), s = Uo(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = Uo(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function Xh(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Lo(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function bs(t, e, n, o = !0) {
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
function Po(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Yh(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Nn = { width: 150, height: 50 };
function Wh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = _s(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      X("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = Xh(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? Nn, d = r && s ? s : c, u = {};
        for (const [h] of a.targetPositions) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const p = g.dimensions ?? Nn;
          let y, m;
          g.parentId === e ? (y = (d.width - p.width) / 2, m = (d.height - p.height) / 2) : (y = o.position.x + (d.width - p.width) / 2, m = o.position.y + (d.height - p.height) / 2), u[h] = {
            position: { x: y, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (u[e] = { dimensions: s });
        const f = [];
        for (const h of t.edges)
          if (i.has(h.source) || i.has(h.target)) {
            const g = t.getEdgeElement?.(h.id)?.closest("svg");
            g && f.push(g);
          }
        t.animate ? t.animate({ nodes: u }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (h) => {
            const g = String(1 - h);
            for (const p of f) p.style.opacity = g;
          },
          onComplete: () => {
            for (const h of f) h.style.opacity = "";
            Lo(o, t.nodes, a, s), a.reroutedEdges = Po(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Lo(o, t.nodes, a, s), a.reroutedEdges = Po(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Lo(o, t.nodes, a, s), a.reroutedEdges = Po(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      X("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && Yh(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? Nn;
        bs(o, t.nodes, i, r);
        const a = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const g = h.dimensions ?? Nn;
            let p, y;
            h.parentId === e ? (p = (l.width - g.width) / 2, y = (l.height - g.height) / 2) : (p = o.position.x + (l.width - g.width) / 2, y = o.position.y + (l.height - g.height) / 2), h.position = { x: p, y }, h.style = { ...h.style || {}, opacity: "0" }, a[u] = {
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
        bs(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (X("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
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
      return _s(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return ht(e, t.nodes).size;
    }
  };
}
function jh(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, X("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, X("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
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
function Uh(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      X("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      X("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
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
      t.selectedRows.size !== 0 && (X("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, X("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
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
const Zh = 8, Kh = 12, Gh = 2;
function Ci(t) {
  return {
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Jh(t) {
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
function Qh(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function xs(t, e, n) {
  const o = e.gap ?? Zh, i = e.padding ?? Kh, r = e.headerHeight ?? 0, s = Jh(e), l = Qh(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? ep(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? tp(l, o, i, r, s, u, a, c) : np(l, o, i, r, s, e.columns ?? Gh, d, u, a, c);
}
function ep(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => Ci(f));
  for (const f of c) a = Math.max(a, f.width);
  const d = r > 0 ? r : a;
  let u = n + o;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: n, y: u }), (i === "width" || i === "both") && l.set(h.id, { width: d, height: g.height }), u += g.height + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: d + n * 2, height: u }
  };
}
function tp(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => Ci(f));
  for (const f of c) a = Math.max(a, f.height);
  const d = r > 0 ? r : a;
  let u = n;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: u, y: n + o }), (i === "height" || i === "both") && l.set(h.id, { width: g.width, height: d }), u += g.width + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: u, height: d + n * 2 + o }
  };
}
function np(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), u = t.map((m) => Ci(m));
  let f = 0, h = 0;
  for (const m of u)
    f = Math.max(f, m.width), h = Math.max(h, m.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (f = g);
  const p = Math.ceil(t.length / d), y = l > 0 ? (l - (p - 1) * e) / p : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const v = m % d, C = Math.floor(m / d), _ = n + v * (f + e), k = n + o + C * (h + e);
    a.set(t[m].id, { x: _, y: k }), i === "both" ? c.set(t[m].id, { width: f, height: h }) : i === "width" ? c.set(t[m].id, { width: f, height: u[m].height }) : i === "height" && c.set(t[m].id, { width: u[m].width, height: h });
  }
  return {
    positions: a,
    dimensions: c,
    parentDimensions: {
      width: d * f + (d - 1) * e + n * 2,
      height: p * h + (p - 1) * e + n * 2 + o
    }
  };
}
function op(t) {
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
      if (X("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
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
      const u = t.nodes.find((_) => _.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((_) => _.parentId === e);
      l && (f = f.filter((_) => _.id !== l)), a && !f.some((_) => _.id === a.id) && (f = [...f, a]);
      const h = new Map(f.map((_) => [_.id, _]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const _ of f)
          _.childLayout && this.layoutChildren(_.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const g = u.childLayout, p = g.headerHeight !== void 0 ? g : u.data?.label ? { ...g, headerHeight: 30 } : g, y = xs(f, p, d);
      for (const [_, k] of y.positions) {
        if (_ === s || a && _ === a.id && !t._nodeMap.has(_)) continue;
        const L = h.get(_);
        L && (L.position ? (L.position.x = k.x, L.position.y = k.y) : L.position = { x: k.x, y: k.y });
      }
      for (const [_, k] of y.dimensions) {
        if (_ === s || a && _ === a.id && !t._nodeMap.has(_)) continue;
        const L = h.get(_);
        if (L) {
          let P = k.width, $ = k.height;
          L.minDimensions && (L.minDimensions.width != null && (P = Math.max(P, L.minDimensions.width)), L.minDimensions.height != null && ($ = Math.max($, L.minDimensions.height))), L.maxDimensions && (L.maxDimensions.width != null && (P = Math.min(P, L.maxDimensions.width)), L.maxDimensions.height != null && ($ = Math.min($, L.maxDimensions.height))), L.dimensions ? (L.dimensions.width = P, L.dimensions.height = $) : L.dimensions = { width: P, height: $ }, L.childLayout && !c && this.layoutChildren(_, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: L.dimensions });
        }
      }
      let m = y.parentDimensions.width, v = y.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (m = Math.max(m, u.minDimensions.width)), u.minDimensions.height != null && (v = Math.max(v, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (m = Math.min(m, u.maxDimensions.width)), u.maxDimensions.height != null && (v = Math.min(v, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = m, u.dimensions.height = v, m !== y.parentDimensions.width || v !== y.parentDimensions.height) {
        const k = xs(f, p, { width: m, height: v });
        for (const [L, P] of k.positions) {
          if (L === s || a && L === a.id && !t._nodeMap.has(L)) continue;
          const $ = h.get(L);
          $ && ($.position ? ($.position.x = P.x, $.position.y = P.y) : $.position = { x: P.x, y: P.y });
        }
        for (const [L, P] of k.dimensions) {
          if (L === s || a && L === a.id && !t._nodeMap.has(L)) continue;
          const $ = h.get(L);
          if ($) {
            let x = P.width, E = P.height;
            $.minDimensions && ($.minDimensions.width != null && (x = Math.max(x, $.minDimensions.width)), $.minDimensions.height != null && (E = Math.max(E, $.minDimensions.height))), $.maxDimensions && ($.maxDimensions.width != null && (x = Math.min(x, $.maxDimensions.width)), $.maxDimensions.height != null && (E = Math.min(E, $.maxDimensions.height))), $.dimensions ? ($.dimensions.width = x, $.dimensions.height = E) : $.dimensions = { width: x, height: E }, $.childLayout && !c && this.layoutChildren(L, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: $.dimensions });
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
      }), X("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
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
      }), X("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
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
      }), X("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
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
        X("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), X("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function ip(t) {
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
        const s = t.nodes.filter((a) => a.parentId === o), l = ps(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = cn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = ps(n, i, o);
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
                (p) => p.parentId === i
              ), g = io(f, o, h, u);
              if (!g.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = St(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
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
      if (!r || ht(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = jr(r, o, d, s);
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
              (g) => g.parentId === i
            ), h = io(u, o, f, d);
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
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = St(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function sp(t) {
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
const ni = 20, $n = ni + 1;
function Es(t) {
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
function Cs(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function rp(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function ea(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function ta(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function ap(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const l = Array.from(r).sort((u, f) => u - f), a = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of l)
    for (const f of a) {
      let h = !1;
      for (const g of i)
        if (rp(u, f, g)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class lp {
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
function cp(t, e) {
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
      ta(l.x, l.y, a.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, l) => s.x - l.x);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      ea(l.x, a.x, l.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  return n;
}
function dp(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i), a = cp(n, o);
  r[t.index] = 0;
  const c = new lp(r);
  for (c.push(t.index); c.size > 0; ) {
    const f = c.pop();
    if (l[f]) continue;
    if (l[f] = 1, f === e.index) break;
    const h = n[f], g = r[f];
    for (const p of a[f]) {
      if (l[p]) continue;
      const y = n[p], m = Math.abs(y.x - h.x) + Math.abs(y.y - h.y), v = g + m;
      v < r[p] && (r[p] = v, s[p] = f, c.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let u = e.index;
  for (; u !== -1; )
    d.unshift(n[u]), u = s[u];
  return d;
}
function up(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function fp(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function hp(t) {
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
function pp(t, e, n, o, i) {
  const r = Math.min(t, n) - In, s = Math.max(t, n) + In, l = Math.min(e, o) - In, a = Math.max(e, o) + In;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < a && c.y + c.height > l
  );
}
function gp(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (ta(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && ea(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function mp(t, e, n, o, i, r, s) {
  const l = Es(n), a = Es(r), c = t + l.x * $n, d = e + l.y * $n, u = o + a.x * $n, f = i + a.y * $n, h = (v) => {
    const C = v.map((x) => Cs(x, ni)), _ = ap(c, d, u, f, C);
    _.length;
    const k = _.find((x) => x.x === c && x.y === d), L = _.find((x) => x.x === u && x.y === f);
    k || _.push({ x: c, y: d, index: _.length }), L || _.push({ x: u, y: f, index: _.length });
    const P = k ?? _[_.length - (L ? 1 : 2)], $ = L ?? _[_.length - 1];
    return dp(P, $, _, C);
  }, g = pp(t, e, o, i, s), p = g.length < s.length;
  let y = h(g);
  if (p) {
    const v = s.map((_) => Cs(_, ni));
    (!(y !== null && y.length >= 2) || gp(y, v)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return up(m);
}
const yp = 512, st = /* @__PURE__ */ new Map();
function wp(t, e, n, o, i, r, s) {
  let l = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const a of s)
    l += `|${Math.round(a.x)},${Math.round(a.y)},${Math.round(a.width)},${Math.round(a.height)}`;
  return l;
}
function na(t, e, n, o, i, r, s) {
  const l = wp(t, e, n, o, i, r, s);
  if (st.has(l)) {
    const c = st.get(l);
    return st.delete(l), st.set(l, c), c;
  }
  const a = mp(t, e, n, o, i, r, s);
  return st.set(l, a), st.size > yp && st.delete(st.keys().next().value), a;
}
function vp({
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
  const a = na(t, e, n, o, i, r, s);
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
  const c = fp(a, l), { x: d, y: u, offsetX: f, offsetY: h } = hp(a);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function oa(t) {
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
function _p(t) {
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
function bp({
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
  const l = na(t, e, n, o, i, r, s);
  if (!l)
    return Qn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = oa(l), { x: c, y: d, offsetX: u, offsetY: f } = _p(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function xp(t) {
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
      c = Ss(a);
      break;
    case "step":
      c = Ep(a, 0);
      break;
    case "smoothstep":
      c = Cp(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = oa(a.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Ss(a);
  }
  const d = Sp(a), u = bn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Ss(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function Ep(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ia(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ia(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Cp(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ia(t[0], t[1], e);
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
function Sp(t) {
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
    const a = n?.[t.shape] ?? Xr[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = fs(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = fs(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = zn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function ks(t) {
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
function oi(t) {
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
const kp = 1.5, Lp = 5 / 20;
function Nt(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = oi(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const a = (i.width ?? 12.5) * kp * Lp * 0.4, c = r + a, d = oi(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function ro(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, u) {
  const f = r ?? Wt(e, o, c, d), h = s ?? Wt(n, i, c, d), g = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: ks(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: ks(i)
  }, p = t.type ?? u ?? "bezier";
  if (l?.[p])
    return l[p](g);
  switch (p === "floating" ? t.pathType ?? "bezier" : p) {
    case "editable":
      return xp({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return bp({ ...g, obstacles: a });
    case "orthogonal":
      return vp({ ...g, obstacles: a });
    case "smoothstep":
      return yn(g);
    case "straight":
      return Fr({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return Qn(g);
  }
}
function Ls(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? zn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? zn(g.x, g.y, i.x, i.y, t.rotation) : g;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(l);
  let f;
  d / a > u / c ? f = a / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + l * f
  };
  return t.rotation ? zn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Ps(t, e) {
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
  const u = e.x - i, f = e.y - r;
  return Math.abs(u) > Math.abs(f) ? u > 0 ? "right" : "left" : f > 0 ? "bottom" : "top";
}
function sa(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? ve, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = Ls(t, l), c = Ls(e, s), d = Ps(t, a), u = Ps(e, c);
  return {
    sx: a.x,
    sy: a.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function gy(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function ra(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function aa(t, e) {
  return `${t}__grad__${e}`;
}
function la(t, e, n, o, i, r, s) {
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
function Mo(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Pp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Mp(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !ze(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Or({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function Tp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ca(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Ms(t, e) {
  if (!e) return t;
  const n = oi(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function Ts(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function ao(t, e) {
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
function lo(t, e, n, o, i, r, s) {
  const l = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (l) {
    if (n) {
      const c = l.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = ao(c, r);
      if (!d) {
        const u = l.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = ao(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ca(n);
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
function As(t, e, n, o, i, r, s, l, a) {
  const c = a ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const p = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = ao(p, l), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = ao(y, l);
    }
    if (!d) {
      const y = ca(o);
      y && (d = c.querySelector(`[data-flow-handle-position="${y}"]`));
    }
  } else
    d = c.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!d) return null;
  const u = d.getBoundingClientRect();
  if (u.width === 0 && u.height === 0) return null;
  const f = t.getBoundingClientRect(), h = u.left + u.width / 2, g = u.top + u.height / 2;
  return {
    x: (h - f.left - s.x) / r,
    y: (g - f.top - s.y) / r,
    handleWidth: u.width / r,
    handleHeight: u.height / r
  };
}
function Ap(t, e) {
  const n = t.getTotalLength(), o = t.getPointAtLength(n * Math.max(0, Math.min(1, e)));
  return { x: o.x, y: o.y };
}
function rt(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Np(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function $p(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("fill", "none"), l.style.stroke = "transparent", l.style.strokeWidth = "20", l.style.pointerEvents = "stroke", l.style.cursor = "pointer", s.appendChild(l);
      let a = e.querySelector("path:not(:first-child)");
      a || (a = document.createElementNS("http://www.w3.org/2000/svg", "path"), a.setAttribute("fill", "none"), a.setAttribute("stroke-width", "1.5"), a.style.pointerEvents = "none", s.appendChild(a));
      let c = null, d = null, u = null, f = null, h = "none", g = null, p = null;
      function y(S, N, R, q, se) {
        f || (f = document.createElementNS("http://www.w3.org/2000/svg", "circle"), f.classList.add("flow-edge-dot"), f.style.pointerEvents = "none", S.appendChild(f));
        const ne = R.closest(".flow-container"), ie = ne ? getComputedStyle(ne) : null, le = q.particleSize ?? (parseFloat(ie?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), de = se || ie?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        f.setAttribute("r", String(le)), q.particleColor ? f.style.fill = q.particleColor : f.style.removeProperty("fill");
        const ue = f.querySelector("animateMotion");
        ue && ue.remove();
        const J = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        J.setAttribute("dur", de), J.setAttribute("repeatCount", "indefinite"), J.setAttribute("path", N), f.appendChild(J);
      }
      function m() {
        f?.remove(), f = null;
      }
      let v = null, C = null, _ = null, k = null;
      const L = (S) => {
        S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: N, event: S }), ft(S, R._shortcuts?.multiSelect) ? R.selectedEdges.has(N.id) ? (R.selectedEdges.delete(N.id), N.selected = !1, X("selection", `Edge "${N.id}" deselected (shift)`)) : (R.selectedEdges.add(N.id), N.selected = !0, X("selection", `Edge "${N.id}" selected (shift)`)) : (R.deselectAll(), R.selectedEdges.add(N.id), N.selected = !0, X("selection", `Edge "${N.id}" selected`)), R._emitSelectionChange());
      }, P = (S) => {
        S.preventDefault(), S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const q = S.target;
        if (q.classList.contains("flow-edge-control-point")) {
          const se = parseInt(q.dataset.pointIndex ?? "", 10);
          if (!isNaN(se)) {
            R._emit("edge-control-point-context-menu", {
              edge: N,
              pointIndex: se,
              position: { x: S.clientX, y: S.clientY },
              event: S
            });
            return;
          }
        }
        R._emit("edge-context-menu", { edge: N, event: S });
      }, $ = (S) => {
        S.stopPropagation(), S.preventDefault();
        const N = o(n), R = t.$data(e.closest("[x-data]"));
        if (!N || !R || (N.type ?? R._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const se = S.target;
        if (se.classList.contains("flow-edge-control-point")) {
          const ne = parseInt(se.dataset.pointIndex ?? "", 10);
          !isNaN(ne) && N.controlPoints && (R._captureHistory?.(), N.controlPoints.splice(ne, 1), R._emit("edge-control-point-change", { edge: N, action: "remove", index: ne }));
          return;
        }
        if (se.classList.contains("flow-edge-midpoint")) {
          const ne = parseInt(se.dataset.segmentIndex ?? "", 10);
          if (!isNaN(ne)) {
            const ie = R.screenToFlowPosition(S.clientX, S.clientY);
            N.controlPoints || (N.controlPoints = []), R._captureHistory?.(), N.controlPoints.splice(ne, 0, { x: ie.x, y: ie.y }), R._emit("edge-control-point-change", { edge: N, action: "add", index: ne });
          }
          return;
        }
        if (se.closest("path")) {
          const ne = R.screenToFlowPosition(S.clientX, S.clientY);
          N.controlPoints || (N.controlPoints = []);
          const ie = [
            v ?? { x: 0, y: 0 },
            ...N.controlPoints,
            C ?? { x: 0, y: 0 }
          ];
          let le = 0, de = 1 / 0;
          for (let ue = 0; ue < ie.length - 1; ue++) {
            const J = Np(ne, ie[ue], ie[ue + 1]);
            J < de && (de = J, le = ue);
          }
          R._captureHistory?.(), N.controlPoints.splice(le, 0, { x: ne.x, y: ne.y }), R._emit("edge-control-point-change", { edge: N, action: "add", index: le });
        }
      }, x = (S) => {
        const N = S.target;
        if (!N.classList.contains("flow-edge-control-point") || S.button !== 0) return;
        S.stopPropagation(), S.preventDefault();
        const R = o(n);
        if (!R?.controlPoints) return;
        const q = t.$data(e.closest("[x-data]"));
        if (!q) return;
        const se = parseInt(N.dataset.pointIndex ?? "", 10);
        if (isNaN(se)) return;
        N.classList.add("dragging");
        let ne = !1;
        const ie = (de) => {
          ne || (q._captureHistory?.(), ne = !0);
          let ue = q.screenToFlowPosition(de.clientX, de.clientY);
          const J = q._config?.snapToGrid;
          J && (ue = {
            x: Math.round(ue.x / J[0]) * J[0],
            y: Math.round(ue.y / J[1]) * J[1]
          }), R.controlPoints[se] = ue;
        }, le = () => {
          document.removeEventListener("pointermove", ie), document.removeEventListener("pointerup", le), N.classList.remove("dragging"), ne && q._emit("edge-control-point-change", { edge: R, action: "move", index: se });
        };
        document.addEventListener("pointermove", ie), document.addEventListener("pointerup", le);
      };
      s.addEventListener("contextmenu", P), s.addEventListener("dblclick", $), s.addEventListener("pointerdown", x, !0);
      let E = null;
      const A = (S) => {
        if (S.button !== 0) return;
        S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const q = R._config?.reconnectSnapRadius ?? Ki, se = R._config?.edgesReconnectable !== !1, ne = N.reconnectable ?? !0;
        let ie = null;
        if (se && ne !== !1 && v && C) {
          const B = R.screenToFlowPosition(S.clientX, S.clientY), j = rt(B.x, B.y, v.x, v.y, q) || _ && rt(B.x, B.y, _.x, _.y, q);
          (rt(B.x, B.y, C.x, C.y, q) || k && rt(B.x, B.y, k.x, k.y, q)) && (ne === !0 || ne === "target") ? ie = "target" : j && (ne === !0 || ne === "source") && (ie = "source");
        }
        if (!ie) {
          const B = (j) => {
            document.removeEventListener("pointerup", B), L(j);
          };
          document.addEventListener("pointerup", B, { once: !0 });
          return;
        }
        const le = S.clientX, de = S.clientY;
        let ue = !1, J = !1, ce = null;
        const ee = R._config?.connectionSnapRadius ?? 20;
        let F = null, K = null, U = null, V = le, I = de;
        const re = e.closest(".flow-container");
        if (!re) return;
        const G = ie === "target" ? v : C, Y = () => {
          ue = !0, s.classList.add("flow-edge-reconnecting"), R._emit("reconnect-start", { edge: N, handleType: ie }), X("reconnect", `Reconnection drag started on edge "${N.id}" (${ie} end)`), K = Ht({
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
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const j = re.querySelector(".flow-viewport");
          j && j.appendChild(F), ie === "target" && (R.pendingConnection = {
            source: N.source,
            sourceHandle: N.sourceHandle,
            position: B
          }), R._pendingReconnection = {
            edge: N,
            draggedEnd: ie,
            anchorPosition: { ...G },
            position: B
          }, U = eo(re, R, V, I), ie === "target" && ln(re, N.source, N.sourceHandle ?? "source", R, N.id);
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
            excludeNodeId: ie === "target" ? N.source : N.target,
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
            source: N.source,
            sourceHandle: N.sourceHandle
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
            z(), L(B);
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
          _t(fe, !0);
          let pe;
          try {
            pe = await Mp({
              dropNodeId: Z,
              dropHandleId: ae,
              draggedEnd: ie,
              edge: N,
              canvas: R,
              containerEl: re
            });
          } finally {
            _t(fe, !1);
          }
          pe.applied ? X("reconnect", `Edge "${N.id}" reconnected (${ie})`, pe.newConnection) : X("reconnect", `Edge "${N.id}" reconnection cancelled — snapping back`, { reason: pe.reason }), R._emit("reconnect-end", { edge: N, successful: pe.applied }), z();
        };
        document.addEventListener("pointermove", te), document.addEventListener("pointerup", oe), E = z;
      };
      s.addEventListener("pointerdown", A);
      const M = (S) => {
        const N = o(n);
        if (!N) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const q = R._config?.edgesReconnectable !== !1, se = N.reconnectable ?? !0;
        if (!q || se === !1 || !v || !C) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const ne = R._config?.reconnectSnapRadius ?? Ki, ie = R.screenToFlowPosition(S.clientX, S.clientY), le = (rt(ie.x, ie.y, v.x, v.y, ne) || _ && rt(ie.x, ie.y, _.x, _.y, ne)) && (se === !0 || se === "source"), de = (rt(ie.x, ie.y, C.x, C.y, ne) || k && rt(ie.x, ie.y, k.x, k.y, ne)) && (se === !0 || se === "target");
        le || de ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", M);
      const w = (S) => {
        if (S.key !== "Enter" && S.key !== " ") return;
        S.preventDefault(), S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: N, event: S }), ft(S, R._shortcuts?.multiSelect) ? R.selectedEdges.has(N.id) ? (R.selectedEdges.delete(N.id), N.selected = !1) : (R.selectedEdges.add(N.id), N.selected = !0) : (R.deselectAll(), R.selectedEdges.add(N.id), N.selected = !0), R._emitSelectionChange());
      };
      s.addEventListener("keydown", w);
      const b = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, D = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", b), s.addEventListener("blur", D);
      const T = (S) => {
        S.stopPropagation();
      };
      s.addEventListener("mousedown", T);
      const O = () => {
        for (const S of [c, d, u])
          S && S.classList.add("flow-edge-hovered");
      }, W = () => {
        for (const S of [c, d, u])
          S && S.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", O), s.addEventListener("mouseleave", W), i(() => {
        const S = o(n);
        if (!S || !a) return;
        s.setAttribute("data-flow-edge-id", S.id);
        const N = t.$data(e.closest("[x-data]"));
        if (!N?.nodes) return;
        const R = S.type ?? N._config?.defaultEdgeType ?? "bezier";
        N._layoutAnimTick;
        const q = N.getNode(S.source), se = N.getNode(S.target);
        if (!q || !se) return;
        q.sourcePosition, se.targetPosition;
        const ne = Ot(q, N._nodeMap, N._config?.nodeOrigin), ie = Ot(se, N._nodeMap, N._config?.nodeOrigin), le = e.closest("[x-data]");
        let de, ue, J, ce;
        if (R === "floating") {
          const H = sa(ne, ie);
          de = H.sourcePos, ue = H.targetPos, J = { x: H.sx, y: H.sy, handleWidth: 0, handleHeight: 0 }, ce = { x: H.tx, y: H.ty, handleWidth: 0, handleHeight: 0 }, v = { x: H.sx, y: H.sy }, C = { x: H.tx, y: H.ty };
        } else {
          const H = N._nodeElements?.get(S.source) ?? le.querySelector(`[data-flow-node-id="${CSS.escape(S.source)}"]`), Q = N._nodeElements?.get(S.target) ?? le.querySelector(`[data-flow-node-id="${CSS.escape(S.target)}"]`), Z = H ? Ts(H.getBoundingClientRect()) : void 0, ae = Q ? Ts(Q.getBoundingClientRect()) : void 0;
          de = lo(le, S.source, S.sourceHandle, "source", q, ae, H), ue = lo(le, S.target, S.targetHandle, "target", se, Z, Q);
          const fe = t.raw(N).viewport ?? { x: 0, y: 0, zoom: 1 }, pe = fe.zoom || 1, me = q.rotation, Se = se.rotation;
          de = Ms(de, me), ue = Ms(ue, Se), J = As(le, S.source, ne, S.sourceHandle, "source", pe, fe, ae, H), ce = As(le, S.target, ie, S.targetHandle, "target", pe, fe, Z, Q);
          const Te = Wt(ne, de, N._shapeRegistry, N._config?.nodeOrigin), we = Wt(ie, ue, N._shapeRegistry, N._config?.nodeOrigin);
          v = J ?? Te, C = ce ?? we;
        }
        const ee = Nt(J ?? v, de, J, S.markerStart), F = Nt(ce ?? C, ue, ce, S.markerEnd);
        _ = ee, k = F;
        let K;
        if (R === "orthogonal" || R === "avoidant") {
          const H = t.raw(N.nodes), Q = new Map(H.map((ae) => [ae.id, ae])), Z = N._config?.nodeOrigin;
          K = H.filter((ae) => ae.id !== S.source && ae.id !== S.target).map((ae) => {
            const fe = Ot(ae, Q, Z);
            return {
              x: fe.position.x,
              y: fe.position.y,
              width: fe.dimensions?.width ?? ve,
              height: fe.dimensions?.height ?? _e
            };
          });
        }
        const { path: U, labelPosition: V } = ro(S, ne, ie, de, ue, ee, F, N._config?.edgeTypes, K, N._shapeRegistry, N._config?.nodeOrigin, N._config?.defaultEdgeType);
        a.setAttribute("d", U), l.setAttribute("d", U);
        const I = R === "editable", re = I && (S.showControlPoints || S.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((H) => H.remove()), re) {
          const H = S.controlPoints ?? [], Q = N.viewport?.zoom ?? 1, Z = 6 / Q, ae = 5 / Q, fe = v ?? { x: 0, y: 0 }, pe = C ?? { x: 0, y: 0 }, me = [fe, ...H, pe], Se = me.length - 1, Te = a.getTotalLength?.() ?? 0;
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
          S.interactionWidth ?? N._config?.defaultInteractionWidth ?? 20
        ), S.markerStart != null) {
          const H = Dt(S.markerStart), Q = Rt(H, N._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else if (S._renderDualMarker && S.markerEnd) {
          const H = Dt(S.markerEnd), Q = Rt(H, N._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else
          a.removeAttribute("marker-start");
        if (S.markerEnd) {
          const H = Dt(S.markerEnd), Q = Rt(H, N._id);
          a.setAttribute("marker-end", `url(#${Q})`);
        } else
          a.removeAttribute("marker-end");
        const G = S.strokeWidth ?? 1.5, Y = Tp(S.animated);
        switch (Y !== h && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), h === "dot" && m(), h = Y), Y) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            y(s, U, le, S, S.animationDuration);
            break;
        }
        if (S.animationDuration && Y !== "none" ? (Y === "dash" || Y === "pulse") && (a.style.animationDuration = S.animationDuration) : (Y === "dash" || Y === "pulse") && a.style.removeProperty("animation-duration"), p && p !== S.class && s.classList.remove(...p.split(" ").filter(Boolean)), S.class) {
          const H = Y === "dash" ? " flow-edge-animated" : Y === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", S.class + H), s.classList.add(...S.class.split(" ").filter(Boolean)), p = S.class;
        } else
          p && (s.classList.remove(...p.split(" ").filter(Boolean)), p = null);
        if (s.setAttribute("aria-selected", String(!!S.selected)), S.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(G + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + gn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(G);
          const H = N._markerDefsEl?.querySelector("defs") ?? null;
          if (ra(S.color)) {
            if (H) {
              const Q = aa(N._id, S.id), Z = S.gradientDirection === "target-source", ae = v.x, fe = v.y, pe = C.x, me = C.y;
              la(
                H,
                Q,
                Z ? { from: S.color.to, to: S.color.from } : S.color,
                ae,
                fe,
                pe,
                me
              ), a.style.stroke = `url(#${Q})`, g = Q;
            }
          } else if (S.color) {
            if (g) {
              const Q = H;
              Q && Mo(Q, g), g = null;
            }
            a.style.stroke = S.color;
          } else {
            if (g) {
              const Q = H;
              Q && Mo(Q, g), g = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (!S.selected && ((S.sourceHandle ? N.selectedRows?.has(S.sourceHandle.replace(/-[lr]$/, "")) : !1) || (S.targetHandle ? N.selectedRows?.has(S.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), S.selected || (a.style.strokeWidth = String(Math.max(G + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), S.focusable ?? N._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", S.ariaRole ?? "group"), s.setAttribute("aria-label", S.ariaLabel ?? (S.label ? `Edge: ${S.label}` : `Edge from ${S.source} to ${S.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), S.domAttributes)
          for (const [H, Q] of Object.entries(S.domAttributes))
            H.startsWith("on") || Pp.has(H.toLowerCase()) || s.setAttribute(H, Q);
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
        }, B = e.closest(".flow-viewport"), j = S.labelVisibility ?? "always";
        if (c = oe(c, S.label, "flow-edge-label", B, S.id), c)
          if (a.getTotalLength?.()) {
            const H = S.labelPosition ?? 0.5, Q = Ap(a, H);
            c.style.left = `${Q.x}px`, c.style.top = `${Q.y}px`;
          } else
            c.style.left = `${V.x}px`, c.style.top = `${V.y}px`;
        if (d = oe(d, S.labelStart, "flow-edge-label flow-edge-label-start", B, S.id), d && a.getTotalLength?.()) {
          const H = a.getTotalLength(), Q = S.labelStartOffset ?? 30, Z = a.getPointAtLength(Math.min(Q, H / 2));
          d.style.left = `${Z.x}px`, d.style.top = `${Z.y}px`;
        }
        if (u = oe(u, S.labelEnd, "flow-edge-label flow-edge-label-end", B, S.id), u && a.getTotalLength?.()) {
          const H = a.getTotalLength(), Q = S.labelEndOffset ?? 30, Z = a.getPointAtLength(Math.max(H - Q, H / 2));
          u.style.left = `${Z.x}px`, u.style.top = `${Z.y}px`;
        }
        for (const H of [c, d, u])
          H && (H.classList.toggle("flow-edge-label-hover", j === "hover"), H.classList.toggle("flow-edge-label-on-select", j === "selected"), H.classList.toggle("flow-edge-label-selected", !!S.selected), S.class ? H.classList.add(...S.class.split(" ").filter(Boolean)) : p && H.classList.remove(...p.split(" ").filter(Boolean)));
      }), r(() => {
        if (g) {
          const N = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          N && Mo(N, g);
        }
        E?.(), m(), s.removeEventListener("contextmenu", P), s.removeEventListener("dblclick", $), s.removeEventListener("pointerdown", x, !0), s.removeEventListener("pointerdown", A), s.removeEventListener("pointermove", M), s.removeEventListener("keydown", w), s.removeEventListener("focus", b), s.removeEventListener("blur", D), s.removeEventListener("mousedown", T), s.removeEventListener("mouseenter", O), s.removeEventListener("mouseleave", W), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Ip(t, e) {
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
        let a, c, d, u;
        if (o.type === "floating") {
          const h = sa(s, l);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const g = Nt(d, h.sourcePos, null, o.markerStart), p = Nt(u, h.targetPos, null, o.markerEnd), y = ro(o, s, l, h.sourcePos, h.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let g, p;
          if (h) {
            const k = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), L = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (k) {
              const P = k.getBoundingClientRect();
              g = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
            if (L) {
              const P = L.getBoundingClientRect();
              p = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
          }
          const y = h ? lo(h, o.source, o.sourceHandle, "source", i, p) : i?.sourcePosition ?? "bottom", m = h ? lo(h, o.target, o.targetHandle, "target", r, g) : r?.targetPosition ?? "top";
          d = Wt(s, y, t._shapeRegistry, t._config.nodeOrigin), u = Wt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const v = Nt(d, y, null, o.markerStart), C = Nt(u, m, null, o.markerEnd), _ = ro(o, s, l, y, m, v, C, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = _.path, c = _.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", a);
          const g = f.parentElement?.querySelector("path:first-child");
          g && g !== f && g.setAttribute("d", a);
        }
        if (ra(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const g = aa(t._id, o.id), p = o.gradientDirection === "target-source";
            la(
              h,
              g,
              p ? { from: o.color.to, to: o.color.from } : o.color,
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
              const g = f.getTotalLength(), p = o.labelStartOffset ?? 30, y = f.getPointAtLength(Math.min(p, g / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
          if (o.labelEnd && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const g = f.getTotalLength(), p = o.labelEndOffset ?? 30, y = f.getPointAtLength(Math.max(g - p, g / 2));
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
function Dp(t) {
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
              Sr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Yr(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Rp = 0;
function Fp(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Hp(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Rp}`,
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
      _shapeRegistry: { ...Xr, ...e.shapeTypes },
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
        const l = this.viewport.zoom, a = this.viewport.x, c = this.viewport.y, d = [], u = [], f = [];
        for (const h of s) {
          const g = h.gap * l, p = h.variant === "cross" ? g / 2 : g;
          d.push(Fp(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${p}px ${p}px, ${p}px ${p}px`), f.push(`${a}px ${c}px, ${a}px ${c}px`)) : (u.push(`${g}px ${g}px`), f.push(`${a}px ${c}px`));
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
      _shortcuts: kf(e.keyboardShortcuts),
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
      _computeEngine: new Bf(),
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
        s !== "viewport-change" && s !== "viewport-move" && X("event", s, l);
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
        this._nodeMap = Vr(this.nodes), Mf(this._childrenIds, this.nodes);
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
        const a = e.cullingBuffer ?? 100, c = Ru(this.viewport, s, l, a), d = /* @__PURE__ */ new Set();
        for (const u of this.nodes) {
          if (u.hidden) continue;
          const f = u.dimensions?.width ?? 150, h = u.dimensions?.height ?? 50, g = u.parentId ? Ko(u, this._nodeMap, this._config.nodeOrigin) : u.position, p = !(g.x + f < c.minX || g.x > c.maxX || g.y + h < c.minY || g.y > c.maxY);
          p && d.add(u.id);
          const y = this._nodeElements.get(u.id);
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
        return l ? Ko(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Sr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Uu(Kn), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Yr(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = St(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new zu(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new Vf(this._container, s);
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
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new a(), g = new c(h), p = new d(h, this, f.provider), y = new u(g, f.user);
          if (Re.set(l, { bridge: p, awareness: y, doc: h }), f.provider.connect(h, g), f.cursors !== !1) {
            let m = !1;
            const v = f.throttle ?? 20, C = (L) => {
              if (m) return;
              m = !0;
              const P = l.getBoundingClientRect(), $ = this._viewportLive ?? this.viewport, x = (L.clientX - P.left - $.x) / $.zoom, E = (L.clientY - P.top - $.y) / $.zoom;
              y.updateCursor({ x, y: E }), setTimeout(() => {
                m = !1;
              }, v);
            }, _ = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", C), l.addEventListener("mouseleave", _);
            const k = Re.get(l);
            k.cursorCleanup = () => {
              l.removeEventListener("mousemove", C), l.removeEventListener("mouseleave", _);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (X("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Nu(this._container, {
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
              const d = this.nodes.filter((u) => this.selectedNodes.has(u.id));
              this._emit("selection-context-menu", { nodes: d, event: a });
            } else {
              const d = this.screenToFlowPosition(a.clientX, a.clientY);
              this._emit("pane-context-menu", { event: a, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = Pf(
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
          const d = (p) => {
            p.pointerType === "touch" && (c++, c === 2 && Date.now() - a < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), a = Date.now());
          }, u = (p) => {
            p.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (a = 0));
          }, f = this._container;
          if (!f) return;
          f.addEventListener("pointerdown", d), f.addEventListener("pointerup", u), f.addEventListener("pointercancel", u);
          const h = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", h);
          const g = document.createElement("div");
          g.className = "flow-touch-selection-mode-indicator", g.textContent = "Selection Mode — tap with two fingers to exit", f.appendChild(g), this._touchSelectionCleanup = () => {
            f.removeEventListener("pointerdown", d), f.removeEventListener("pointerup", u), f.removeEventListener("pointercancel", u), document.removeEventListener("visibilitychange", h), g.remove();
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
                const f = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = f.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === h);
                g === 0 ? u = -c : g === 1 ? u = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            Lf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && Rr(h)) {
                h.position.x += d, h.position.y += u;
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
        e.minimap && (this._minimap = Gu(this._container, {
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
          this._controls = sf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Wo }),
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
        this._selectionBox = rf(this._container), this._lasso = af(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !ft(s, this._shortcuts.selectionBox))
            return;
          const l = s.target;
          if (l !== this._container && !l.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const a = this._config.selectionMode ?? "partial", c = ft(s, this._shortcuts.selectionModeToggle);
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
          const a = oo(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? uf(a, u) : df(a, u), h = new Set(f.map((g) => g.id));
            if (c = this.nodes.filter((g) => h.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const y = p.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let v = 0;
                for (let _ = 0; _ <= m; _++) {
                  const k = p.getPointAtLength(_ / m * y);
                  wi(k.x, k.y, u) && v++;
                }
                (this._selectionEffectiveMode === "full" ? v === m + 1 : v > 0) && d.push(g.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Du(a, u, this._config.nodeOrigin) : Iu(a, u, this._config.nodeOrigin), h = new Set(f.map((g) => g.id));
            c = this.nodes.filter((g) => h.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!Zo(u) || u.hidden) continue;
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
            let u;
            try {
              u = JSON.parse(d);
            } catch {
              u = d;
            }
            if (!this._container)
              return;
            const f = Er(
              a.clientX,
              a.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = l(a.clientX, a.clientY), g = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c });
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
          for (const l of s) {
            const a = l.target, c = a.getAttribute("data-flow-node-id");
            if (!c) continue;
            const d = this._nodeMap.get(c);
            if (!d) continue;
            const u = l.borderBoxSize?.[0], f = u ? u.inlineSize : a.offsetWidth, h = u ? u.blockSize : a.offsetHeight;
            if (f === 0 && h === 0 || a.offsetParent === null && a.tagName !== "BODY" || d.fixedDimensions === !0) continue;
            const g = Math.round(f), p = Math.round(h), y = d.dimensions;
            if (y && Math.abs((y.width ?? 0) - g) < 1 && Math.abs((y.height ?? 0) - p) < 1)
              continue;
            const m = nh(
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
        if (this._layoutDedup = eh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && Gf(e, s, e.wireEvents);
          const l = Jf(this, s), a = Wf(this, s);
          this._wireCleanup = () => {
            l(), a();
          }, X("init", `wire bridge activated for "${this._id}"`);
        }
        X("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
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
        for (const [, s] of Wr().entries())
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
            const f = Dt(u), h = Rt(f, this._id);
            l.has(h) || l.set(h, Jn(f, h));
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
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), X("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
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
        return this._layoutDedup ? th(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? Re.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => um));
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
      rh(i),
      ah(i),
      lh(i),
      fh(i),
      ph(i),
      qh(i),
      Wh(i),
      jh(i),
      Uh(i),
      op(i),
      ip(i),
      sp(i),
      Ip(i, t),
      Dp(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      Zu(s, l);
    }, n;
  });
}
function Ns(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Op(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(v) {
    const C = s();
    return {
      x: (v.x - C.x) / C.zoom,
      y: (v.y - C.y) / C.zoom
    };
  }
  const y = Ve(t), m = uc().subject(() => {
    const v = s(), C = l();
    return {
      x: C.x * v.zoom + v.x,
      y: C.y * v.zoom + v.y
    };
  }).on("start", (v) => {
    g = p(v), o?.({ nodeId: e, position: g, sourceEvent: v.sourceEvent });
  }).on("drag", (v) => {
    let C = p(v);
    a && (C = Ns(C, a));
    const _ = {
      x: C.x - g.x,
      y: C.y - g.y
    };
    i?.({ nodeId: e, position: C, delta: _, sourceEvent: v.sourceEvent });
  }).on("end", (v) => {
    let C = p(v);
    a && (C = Ns(C, a)), r?.({ nodeId: e, position: C, sourceEvent: v.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((v) => {
    if (u?.() || f && v.target?.closest?.("." + f)) return !1;
    if (c) {
      const C = t.querySelector(c);
      return C ? C.contains(v.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function zp(t, e) {
  const n = jt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Vp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, l = 1 / 0, a = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const g = h.x + h.width / 2, p = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, v = [
      [t.x, h.x],
      // left-left
      [u, y],
      // right-right
      [c, g],
      // center-center
      [t.x, y],
      // left-right
      [u, h.x]
      // right-left
    ];
    for (const [_, k] of v) {
      const L = k - _;
      Math.abs(L) <= n && (i.add(k), Math.abs(L) < Math.abs(l) && (l = L, r = L));
    }
    const C = [
      [t.y, h.y],
      // top-top
      [f, m],
      // bottom-bottom
      [d, p],
      // center-center
      [t.y, m],
      // top-bottom
      [f, h.y]
      // bottom-top
    ];
    for (const [_, k] of C) {
      const L = k - _;
      Math.abs(L) <= n && (o.add(k), Math.abs(L) < Math.abs(a) && (a = L, s = L));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Bp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function qp(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = Bp(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const Xp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Yp = 0;
function $s(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function To(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Wp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function jp(t, e, n) {
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
function Up(t, e, n) {
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
function Zp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, u = null, f = null, h = null, g = null, p = null, y = !1, m = -1, v = null, C = !1, _ = [], k = "", L = [], P = null;
      i(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        if (e.dataset.flowNodeId = M.id, M.type && (e.dataset.flowNodeType = M.type), !C) {
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
          C = !0;
        }
        if (M.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), P !== M.id && (s?.destroy(), s = null, P = M.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        e.classList.add("flow-node", "nopan"), M.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group");
        const b = M.parentId ? w.getAbsolutePosition(M.id) : M.position ?? { x: 0, y: 0 }, D = M.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], T = M.dimensions?.width ?? 150, O = M.dimensions?.height ?? 40;
        if (e.style.left = b.x - T * D[0] + "px", e.style.top = b.y - O * D[1] + "px", M.dimensions) {
          const F = M.childLayout, K = M.fixedDimensions, U = (w._childrenIds?.get(M.id)?.length ?? 0) > 0;
          e.style.width = M.dimensions.width + "px", F || K || U ? e.style.height = M.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(M.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!M.selected)), M._validationErrors && M._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const W = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], S = M.runState;
        for (const F of W)
          e.classList.remove(F);
        S && S !== "pending" && e.classList.add(`flow-node-${S}`);
        for (const F of _)
          e.classList.remove(F);
        const N = M.class ? M.class.split(/\s+/).filter(Boolean) : [];
        for (const F of N)
          e.classList.add(F);
        _ = N;
        const R = M.shape ? `flow-node-${M.shape}` : "";
        k !== R && (k && e.classList.remove(k), R && e.classList.add(R), k = R);
        const q = t.$data(e.closest("[data-flow-canvas]")), se = M.shape && q?._shapeRegistry?.[M.shape];
        if (se?.clipPath ? e.style.clipPath = se.clipPath : e.style.clipPath = "", M.style) {
          const F = typeof M.style == "string" ? Object.fromEntries(M.style.split(";").filter(Boolean).map((U) => U.split(":").map((V) => V.trim()))) : M.style, K = [];
          for (const [U, V] of Object.entries(F))
            U && V && (e.style.setProperty(U, V), K.push(U));
          for (const U of L)
            K.includes(U) || e.style.removeProperty(U);
          L = K;
        } else if (L.length > 0) {
          for (const F of L)
            e.style.removeProperty(F);
          L = [];
        }
        if (M.rotation ? (e.style.transform = `rotate(${M.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", M.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", M.ariaRole ?? "group"), e.setAttribute("aria-label", M.ariaLabel ?? (M.data?.label ? `Node: ${M.data.label}` : `Node ${M.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), M.domAttributes)
          for (const [F, K] of Object.entries(M.domAttributes))
            F.startsWith("on") || Xp.has(F.toLowerCase()) || e.setAttribute(F, K);
        ze(M) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), M.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const ie = e.classList.contains("flow-node-condensed");
        M.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!M.condensed !== ie && requestAnimationFrame(() => {
          M.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, X("condense", `Node "${M.id}" re-measured after condense toggle`, M.dimensions);
        }), M.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const le = M.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), le !== "visible" && e.classList.add(`flow-handles-${le}`);
        let de = Br(M, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(M.id) && (de += M.type === "group" ? Math.max(1 - de, 0) : 1e3), y && (de += 1e3);
        const J = M.type === "group" ? 0 : 2;
        if (de !== J ? e.style.zIndex = String(de) : e.style.removeProperty("z-index"), !Rr(M)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const ee = e.closest(".flow-container");
        s || (s = Op(e, M.id, {
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
            V?.bridge && V.bridge.setDragging(F, !0), h?.destroy(), h = null, g = null, p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null, a = w._snapshotHistory?.() ?? null, X("drag", `Node "${F}" drag start`, K);
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
            w._config?.autoPanOnNodeDrag !== !1 && ee && (u = Hr({
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
            }), U instanceof MouseEvent && u.updatePointer(U.clientX, U.clientY), u.start());
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
                  y || (e.classList.add("flow-reorder-dragging"), v = I.parentId), y = !0;
                  const j = I.extent !== "parent";
                  if (I.position.x = K.x - Y.x, I.position.y = K.y - Y.y, !j && B.dimensions) {
                    const Z = Eo({ x: I.position.x, y: I.position.y }, oe, B.dimensions);
                    I.position.x = Z.x, I.position.y = Z.y;
                  }
                  const H = I.dimensions?.width ?? 150, Q = I.dimensions?.height ?? 50;
                  if (j) {
                    const Z = B.dimensions?.width ?? 150, ae = B.dimensions?.height ?? 50, fe = I.position.x + H / 2, pe = I.position.y + Q / 2, me = 12, Se = v === I.parentId ? 0 : me, Te = fe >= Se && fe <= Z - Se && pe >= Se && pe <= ae - Se, we = /* @__PURE__ */ new Set();
                    let he = I.parentId;
                    for (; he; )
                      we.add(he), he = w.getNode(he)?.parentId;
                    const ke = K.x + H / 2, Ce = K.y + Q / 2, Me = ht(I.id, w.nodes);
                    let Ie = null;
                    const xe = w.nodes.filter(
                      (ge) => ge.id !== I.id && (ge.droppable || ge.childLayout) && !ge.hidden && !Me.has(ge.id) && (Te ? !we.has(ge.id) : ge.id !== I.parentId) && (!ge.acceptsDrop || ge.acceptsDrop(I))
                    );
                    for (const ge of xe) {
                      const Ee = ge.parentId ? w.getAbsolutePosition(ge.id) : ge.position, nt = ge.dimensions?.width ?? 150, mt = ge.dimensions?.height ?? 50, ot = ge.id === p ? 0 : me;
                      ke >= Ee.x + ot && ke <= Ee.x + nt - ot && Ce >= Ee.y + ot && Ce <= Ee.y + mt - ot && (Ie = ge);
                    }
                    const be = Ie?.id ?? null;
                    if (be !== p) {
                      p && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), be && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(be)}"]`)?.classList.add("flow-node-drop-target"), p = be;
                      const ge = be ? w.getNode(be) : null, Ee = v;
                      if (ge?.childLayout && be !== v) {
                        Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), v = be;
                        const nt = w.nodes.filter((je) => je.parentId === be && je.id !== F).sort((je, xa) => (je.order ?? 1 / 0) - (xa.order ?? 1 / 0)), mt = nt.length, ot = [...nt];
                        ot.splice(mt, 0, I);
                        for (let je = 0; je < ot.length; je++)
                          ot[je].order = je;
                        m = mt;
                        const Mi = w._initialDimensions?.get(F), Ti = { ...I, dimensions: Mi ? { ...Mi } : void 0 };
                        w.layoutChildren(be, { excludeId: F, includeNode: Ti, shallow: !0 }), w.propagateLayoutUp(be, { includeNode: Ti });
                      } else Te && v !== I.parentId ? (Ee && Ee !== I.parentId && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), v = I.parentId, m = -1) : !be && !Te && (Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), v = null, m = -1);
                    }
                  }
                  if (v) {
                    const Z = w.getNode(v), ae = Z?.childLayout ?? B.childLayout, fe = w.nodes.filter((he) => he.parentId === v && he.id !== F).sort((he, ke) => (he.order ?? 1 / 0) - (ke.order ?? 1 / 0));
                    let pe, me;
                    if (v !== I.parentId) {
                      const he = Z?.parentId ? w.getAbsolutePosition(v) : Z?.position ?? { x: 0, y: 0 };
                      pe = K.x - he.x, me = K.y - he.y;
                    } else
                      pe = I.position.x, me = I.position.y;
                    const Se = ae.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (v === I.parentId) {
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
                      const Ce = I.id, Me = v, Ie = Me !== I.parentId;
                      w._layoutAnimFrame = requestAnimationFrame(() => {
                        if (Ie && Me) {
                          const Ee = w.getNode(Ce);
                          let nt;
                          if (Ee) {
                            const mt = w._initialDimensions?.get(Ce);
                            nt = { ...Ee, dimensions: mt ? { ...mt } : void 0 };
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
                  u && V instanceof MouseEvent && u.updatePointer(V.clientX, V.clientY);
                  return;
                }
                if (I.extent === "parent" && B?.dimensions) {
                  const j = Eo(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = j.x, z = j.y;
                } else if (Array.isArray(I.extent)) {
                  const j = qr({ x: te, y: z }, I.extent, oe);
                  te = j.x, z = j.y;
                }
                if ((!I.extent || I.extent !== "parent") && (cn(
                  B,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!B?.childLayout) && B?.dimensions) {
                  const Q = Eo(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = Q.x, z = Q.y;
                }
                if (I.expandParent && B?.dimensions) {
                  const j = Tf(
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
                  return zp({ ...Z, position: ae }, w._config?.nodeOrigin);
                }, B = (w.selectedNodes.size > 1 && w.selectedNodes.has(F) ? w.nodes.filter((Z) => w.selectedNodes.has(Z.id)) : [I]).map(z), j = {
                  x: Math.min(...B.map((Z) => Z.x)),
                  y: Math.min(...B.map((Z) => Z.y)),
                  width: Math.max(...B.map((Z) => Z.x + Z.width)) - Math.min(...B.map((Z) => Z.x)),
                  height: Math.max(...B.map((Z) => Z.y + Z.height)) - Math.min(...B.map((Z) => Z.y))
                }, H = w.nodes.filter(
                  (Z) => !w.selectedNodes.has(Z.id) && Z.id !== F && Z.hidden !== !0 && Z.filtered !== !0
                ).map(z), Q = Vp(j, H, te);
                if (Y && (Q.snapOffset.x !== 0 || Q.snapOffset.y !== 0) && (I.position.x += Q.snapOffset.x, I.position.y += Q.snapOffset.y, d))
                  for (const [Z] of d) {
                    const ae = w.getNode(Z);
                    ae && (ae.position.x += Q.snapOffset.x, ae.position.y += Q.snapOffset.y);
                  }
                if (f?.remove(), Q.horizontal.length > 0 || Q.vertical.length > 0) {
                  const Z = ee?.querySelector(".flow-viewport");
                  if (Z) {
                    const ae = w.nodes.map(z);
                    f = Up(Q.horizontal, Q.vertical, ae), Z.appendChild(f);
                  }
                } else
                  f = null;
                w._emit("helper-lines-change", {
                  horizontal: Q.horizontal,
                  vertical: Q.vertical
                });
              }
            }
            if (w._config?.preventOverlap) {
              const G = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, Y = I.dimensions?.width ?? ve, te = I.dimensions?.height ?? _e, z = w.selectedNodes, oe = w.nodes.filter((j) => j.id !== I.id && !j.hidden && !z.has(j.id)).map((j) => Yt(j, w._config?.nodeOrigin)), B = sh(I.position, Y, te, oe, G);
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
              })), oe = qp(I.id, te, z, G);
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
            u && V instanceof MouseEvent && u.updatePointer(V.clientX, V.clientY);
          },
          onDragEnd({ nodeId: F, position: K }) {
            e.classList.remove("flow-node-dragging"), X("drag", `Node "${F}" drag end`, K);
            const U = w._container ? Re.get(w._container) : void 0;
            U?.bridge && U.bridge.setDragging(F, !1), u?.stop(), u = null, f?.remove(), f = null, w._config?.helperLines && w._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const V = w.getNode(F);
            if (V && w._emit("node-drag-end", { node: V, position: K }), y && V?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const I = v;
              y = !1, m = -1, v = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), p ? (ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), To(w, F, p), p = null) : I && I !== V.parentId ? (w.layoutChildren(I, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(I, { omitFromComputation: F }), w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })) : (w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })), d = null, w._layoutAnimTick++, $s(w, l, a), a = null, l = !1;
              return;
            }
            if (V && p)
              ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), To(w, F, p), p = null;
            else if (V && V.parentId && !p) {
              const I = cn(
                w.getNode(V.parentId),
                w._config?.childValidationRules ?? {}
              ), re = w.getNode(V.parentId);
              if (!I?.preventChildEscape && !re?.childLayout && re?.dimensions) {
                const G = V.position.x, Y = V.position.y, te = V.dimensions?.width ?? 150, z = V.dimensions?.height ?? 50;
                (G + te < 0 || Y + z < 0 || G > re.dimensions.width || Y > re.dimensions.height) && To(w, F, null);
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
                  const B = `e-${I.source}-${I.target}-${Date.now()}-${Yp++}`;
                  w.addEdges({ id: B, ...G }), w._emit("connect", { connection: G });
                }
              }
            } else
              h?.destroy(), h = null, g = null;
            d = null, l && w._layoutAnimTick++, $s(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const M = t.$data(e.closest("[x-data]"));
        if (M?._config?.easyConnect) {
          const w = M._config.easyConnectKey ?? "alt", b = (D) => {
            if (!Wp(D, w) || D.target.closest("[data-flow-handle-type]")) return;
            const T = t.$data(e.closest("[x-data]"));
            if (!T || T._animationLocked || T._connectValidating) return;
            const O = o(n);
            if (!O) return;
            const W = T.getNode(O.id);
            if (!W || W.connectable === !1) return;
            D.preventDefault(), D.stopPropagation(), D.stopImmediatePropagation();
            const S = jp(e, D.clientX, D.clientY), N = S?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const R = e.closest(".flow-container");
            if (!R) return;
            const q = T._viewportLive ?? T.viewport, se = q?.zoom || 1, ne = q?.x || 0, ie = q?.y || 0, le = R.getBoundingClientRect();
            let de, ue;
            if (S) {
              const I = S.getBoundingClientRect();
              de = (I.left + I.width / 2 - le.left - ne) / se, ue = (I.top + I.height / 2 - le.top - ie) / se;
            } else {
              const I = e.getBoundingClientRect();
              de = (I.left + I.width / 2 - le.left - ne) / se, ue = (I.top + I.height / 2 - le.top - ie) / se;
            }
            T._emit("connect-start", { source: O.id, sourceHandle: N });
            const J = Ht({
              connectionLineType: T._config?.connectionLineType,
              connectionLineStyle: T._config?.connectionLineStyle,
              connectionLine: T._config?.connectionLine
            }), ce = R.querySelector(".flow-viewport");
            ce && ce.appendChild(J.svg), J.update({ fromX: de, fromY: ue, toX: de, toY: ue, source: O.id, sourceHandle: N }), T.pendingConnection = { source: O.id, sourceHandle: N, position: { x: de, y: ue } }, ln(R, O.id, N, T);
            let ee = eo(R, T, D.clientX, D.clientY), F = null;
            const K = T._config?.connectionSnapRadius ?? 20, U = (I) => {
              const re = T.screenToFlowPosition(I.clientX, I.clientY), G = an({
                containerEl: R,
                handleType: "target",
                excludeNodeId: O.id,
                cursorFlowPos: re,
                connectionSnapRadius: K,
                getNode: (Y) => T.getNode(Y),
                toFlowPosition: (Y, te) => T.screenToFlowPosition(Y, te)
              });
              G.element !== F && (F?.classList.remove("flow-handle-active"), G.element?.classList.add("flow-handle-active"), F = G.element), J.update({ fromX: de, fromY: ue, toX: G.position.x, toY: G.position.y, source: O.id, sourceHandle: N }), T.pendingConnection = { ...T.pendingConnection, position: G.position }, ee?.updatePointer(I.clientX, I.clientY);
            }, V = async (I) => {
              ee?.stop(), ee = null, document.removeEventListener("pointermove", U), document.removeEventListener("pointerup", V), J.destroy(), F?.classList.remove("flow-handle-active"), Pe(R), e.classList.remove("flow-easy-connecting");
              const re = T.screenToFlowPosition(I.clientX, I.clientY), G = { source: O.id, sourceHandle: N, position: re };
              T.pendingConnection = null;
              let Y = F;
              if (Y || (Y = document.elementFromPoint(I.clientX, I.clientY)?.closest('[data-flow-handle-type="target"]')), !Y) {
                T._emit("connect-end", { connection: null, ...G });
                return;
              }
              const z = Y.closest("[x-flow-node]")?.dataset.flowNodeId, oe = Y.dataset.flowHandleId ?? "target";
              if (!z) {
                T._emit("connect-end", { connection: null, ...G });
                return;
              }
              const B = { source: O.id, sourceHandle: N, target: z, targetHandle: oe }, j = await zr({ connection: B, canvas: T, containerEl: R });
              T._emit("connect-end", {
                connection: j.applied ? B : null,
                ...G
              });
            };
            document.addEventListener("pointermove", U), document.addEventListener("pointerup", V);
          };
          e.addEventListener("pointerdown", b, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", b, { capture: !0 });
          });
        }
      }
      const $ = (M) => {
        if (M.key !== "Enter" && M.key !== " ") return;
        M.preventDefault();
        const w = o(n);
        if (!w) return;
        const b = t.$data(e.closest("[x-data]"));
        b && (b._animationLocked || Zo(w) && (b._emit("node-click", { node: w, event: M }), M.stopPropagation(), ft(M, b._shortcuts?.multiSelect) ? b.selectedNodes.has(w.id) ? (b.selectedNodes.delete(w.id), w.selected = !1) : (b.selectedNodes.add(w.id), w.selected = !0) : (b.deselectAll(), b.selectedNodes.add(w.id), w.selected = !0), b._emitSelectionChange()));
      };
      e.addEventListener("keydown", $);
      const x = () => {
        const M = t.$data(e.closest("[x-data]"));
        if (!M?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const b = w.parentId ? M.getAbsolutePosition(w.id) : w.position;
        M.setCenter(
          b.x + (w.dimensions?.width ?? 150) / 2,
          b.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", x);
      const E = (M) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const b = t.$data(e.closest("[x-data]"));
        if (b && !b._animationLocked && (b._emit("node-click", { node: w, event: M }), !!Zo(w))) {
          if (M.stopPropagation(), c) {
            c = !1;
            return;
          }
          ft(M, b._shortcuts?.multiSelect) ? b.selectedNodes.has(w.id) ? (b.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), X("selection", `Node "${w.id}" deselected (shift)`)) : (b.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), X("selection", `Node "${w.id}" selected (shift)`)) : (b.deselectAll(), b.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), X("selection", `Node "${w.id}" selected`)), b._emitSelectionChange();
        }
      };
      e.addEventListener("click", E);
      const A = (M) => {
        M.preventDefault(), M.stopPropagation();
        const w = o(n);
        if (!w) return;
        const b = t.$data(e.closest("[x-data]"));
        if (b)
          if (b.selectedNodes.size > 1 && b.selectedNodes.has(w.id)) {
            const D = b.nodes.filter((T) => b.selectedNodes.has(T.id));
            b._emit("selection-context-menu", { nodes: D, event: M });
          } else
            b._emit("node-context-menu", { node: w, event: M });
      };
      e.addEventListener("contextmenu", A), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const M = o(n);
        if (!M) return;
        const w = t.$data(e.closest("[x-data]"));
        M.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, X("init", `Node "${M.id}" measured`, M.dimensions), w?._nodeElements?.set(M.id, e), M.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", $), e.removeEventListener("focus", x), e.removeEventListener("click", E), e.removeEventListener("contextmenu", A);
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
function Kp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let g = o.width;
  u ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  h ? p = o.height + e.y : f && (p = o.height - e.y), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(a, g)), p = Math.max(l, Math.min(c, p)));
  const y = g - o.width, m = p - o.height, v = d ? n.x - y : n.x, C = f ? n.y - m : n.y;
  return {
    position: { x: v, y: C },
    dimensions: { width: g, height: p }
  };
}
const da = ["top-left", "top-right", "bottom-left", "bottom-right"], ua = ["top", "right", "bottom", "left"], Gp = [...da, ...ua], Jp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Qp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = eg(o);
      let a = { ...Lt };
      if (n)
        try {
          const d = i(n);
          a = { ...Lt, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Jp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const g = e.closest("[x-data]");
          if (!g) return;
          const p = t.$data(g), y = h.dataset.flowNodeId;
          if (!y || !p) return;
          const m = p.getNode(y);
          if (!m || !ls(m)) return;
          m.fixedDimensions = !0;
          const v = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === Lt.minWidth && (v.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === Lt.minHeight && (v.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === Lt.maxWidth && (v.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === Lt.maxHeight && (v.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const E = p.viewport?.zoom || 1, A = h.getBoundingClientRect();
            m.dimensions = { width: A.width / E, height: A.height / E };
          }
          const C = { x: m.position.x, y: m.position.y }, _ = { width: m.dimensions.width, height: m.dimensions.height }, k = p.viewport?.zoom || 1, L = f.clientX, P = f.clientY;
          p._captureHistory?.(), X("resize", `Resize start on "${y}" (${d})`, _), p._emit("node-resize-start", { node: m, dimensions: { ..._ } });
          const $ = (E) => {
            const A = {
              x: (E.clientX - L) / k,
              y: (E.clientY - P) / k
            }, M = Kp(
              d,
              A,
              C,
              _,
              v,
              p._config?.snapToGrid ?? !1
            );
            if (m.position.x = M.position.x, m.position.y = M.position.y, m.dimensions.width = M.dimensions.width, m.dimensions.height = M.dimensions.height, m.parentId) {
              const w = p.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${M.position.x}px`, h.style.top = `${M.position.y}px`;
            h.style.width = `${M.dimensions.width}px`, h.style.height = `${M.dimensions.height}px`, p._layoutAnimTick++, p._emit("node-resize", { node: m, dimensions: { ...M.dimensions } });
          }, x = () => {
            document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", x), document.removeEventListener("pointercancel", x), X("resize", `Resize end on "${y}"`, m.dimensions), p._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", $), document.addEventListener("pointerup", x), document.addEventListener("pointercancel", x);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u), h = d.dataset.flowNodeId;
        if (!h || !f) return;
        const g = f.getNode(h);
        if (!g) return;
        const p = !ls(g);
        for (const y of c)
          y.style.display = p ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function eg(t) {
  if (t.includes("corners"))
    return da;
  if (t.includes("edges"))
    return ua;
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
  return Gp;
}
function tg(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function ng(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function og(t) {
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
        const h = t.$data(f), g = u.dataset.flowNodeId;
        if (!g || !h) return;
        const p = h.getNode(g);
        if (!p) return;
        const y = u.getBoundingClientRect(), m = y.left + y.width / 2, v = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const C = (k) => {
          let L = tg(
            k.clientX,
            k.clientY,
            m,
            v
          );
          l && (L = ng(L, a)), p.rotation = L;
        }, _ = () => {
          document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", _), e.style.cursor = "grab", h._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", C), document.addEventListener("pointerup", _);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function ig(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const sg = "application/alpineflow";
function rg(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(sg, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function ag(t) {
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
function lg(t) {
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
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
        if (f) {
          const p = ag(
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
          const m = i.getNode?.(p.source), v = i.getNode?.(p.target), C = p.hidden || p._hiddenByCollapse || m?.hidden || v?.hidden;
          y.style.display = C ? "none" : "";
        }
        for (const p of a) {
          const y = l.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), v = i.getNode?.(p.target);
          m?.filtered || v?.filtered ? y.classList.add("flow-edge-filtered") : y.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [a, c] of l)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(a);
        l.clear(), s.remove();
      });
    }
  );
}
const cg = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], dg = "a, button, input, textarea, select, [contenteditable]", ug = 100, fg = 60, hg = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), pg = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), gg = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), mg = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function yg(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && cg.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function Pt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function wg(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function vg(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (hg.has(e) && (t.style.top = "0"), pg.has(e) && (t.style.bottom = "0")), o && !n && (gg.has(e) && (t.style.left = "0"), mg.has(e) && (t.style.right = "0"));
}
function _g(t) {
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
      } = yg(n, o), f = d || u, h = !s && !l && !f, g = !s && !a && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || f) && e.classList.add("flow-panel-locked"), (a || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && vg(e, r, d, u);
      const p = (k) => k.stopPropagation();
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
      }, v = `flow-panel-${r}`, C = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(v) || e.classList.add(v);
      };
      y.addEventListener("flow-panel-reset", C), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let _ = null;
      if (h) {
        let k = !1, L = 0, P = 0, $ = 0, x = 0;
        const E = () => {
          const b = e.getBoundingClientRect(), D = y.getBoundingClientRect();
          return {
            x: b.left - D.left,
            y: b.top - D.top
          };
        }, A = (b) => {
          if (!k) return;
          let D = $ + (b.clientX - L), T = x + (b.clientY - P);
          if (c) {
            const O = wg(
              D,
              T,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            D = O.left, T = O.top;
          }
          e.style.left = `${D}px`, e.style.top = `${T}px`, Pt(y, "panel-drag", {
            panel: e,
            position: { x: D, y: T }
          });
        }, M = () => {
          if (!k) return;
          k = !1, document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M);
          const b = E();
          Pt(y, "panel-drag-end", {
            panel: e,
            position: b
          });
        }, w = (b) => {
          const D = b.target;
          if (D.closest(dg) || D.closest(".flow-panel-resize-handle"))
            return;
          k = !0, L = b.clientX, P = b.clientY;
          const T = e.getBoundingClientRect(), O = y.getBoundingClientRect();
          $ = T.left - O.left, x = T.top - O.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${$}px`, e.style.top = `${x}px`, document.addEventListener("pointermove", A), document.addEventListener("pointerup", M), document.addEventListener("pointercancel", M), Pt(y, "panel-drag-start", {
            panel: e,
            position: { x: $, y: x }
          });
        };
        if (e.addEventListener("pointerdown", w), g) {
          _ = document.createElement("div"), _.classList.add("flow-panel-resize-handle"), e.appendChild(_);
          let b = !1, D = 0, T = 0, O = 0, W = 0;
          const S = (q) => {
            if (!b) return;
            const se = Math.max(ug, O + (q.clientX - D)), ne = Math.max(fg, W + (q.clientY - T));
            e.style.width = `${se}px`, e.style.height = `${ne}px`, Pt(y, "panel-resize", {
              panel: e,
              dimensions: { width: se, height: ne }
            });
          }, N = () => {
            b && (b = !1, document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", N), document.removeEventListener("pointercancel", N), Pt(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, R = (q) => {
            q.stopPropagation(), b = !0, D = q.clientX, T = q.clientY, O = e.offsetWidth, W = e.offsetHeight, document.addEventListener("pointermove", S), document.addEventListener("pointerup", N), document.addEventListener("pointercancel", N), Pt(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: O, height: W }
            });
          };
          _.addEventListener("pointerdown", R), i(() => {
            e.removeEventListener("pointerdown", w), _?.removeEventListener("pointerdown", R), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", N), document.removeEventListener("pointercancel", N), _?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", C), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", C), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", C), y.__flowPanels?.delete(e);
        });
    }
  );
}
function bg(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = xg(n), l = Eg(o);
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
        const h = f.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, y = p ? f.getNode(p) : null, m = y?.dimensions?.width ?? d.offsetWidth, v = y?.dimensions?.height ?? d.offsetHeight, C = g / h;
        let _, k, L, P;
        s === "top" || s === "bottom" ? (k = s === "top" ? -C : v + C, P = s === "top" ? "-100%" : "0%", l === "start" ? (_ = 0, L = "0%") : l === "end" ? (_ = m, L = "-100%") : (_ = m / 2, L = "-50%")) : (_ = s === "left" ? -C : m + C, L = s === "left" ? "-100%" : "0%", l === "start" ? (k = 0, P = "0%") : l === "end" ? (k = v, P = "-100%") : (k = v / 2, P = "-50%")), e.style.left = `${_}px`, e.style.top = `${k}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${L}, ${P})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function xg(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Eg(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Cg(t) {
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
        const L = r(o);
        u = L?.offsetX ?? 0, f = L?.offsetY ?? 0;
      }
      a.setAttribute("role", "menu"), a.setAttribute("tabindex", "-1"), a.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let g = null;
      const p = 4, y = () => {
        g = document.activeElement;
        const L = d.contextMenu.x + u, P = d.contextMenu.y + f;
        a.style.display = "", a.style.position = "fixed", a.style.left = L + "px", a.style.top = P + "px", a.style.zIndex = "5000", a.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((w) => {
          w.setAttribute("role", "menuitem"), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1");
        });
        const $ = a.getBoundingClientRect(), x = window.innerWidth, E = window.innerHeight;
        let A = L, M = P;
        $.right > x - p && (A = x - $.width - p), $.bottom > E - p && (M = E - $.height - p), A < p && (A = p), M < p && (M = p), a.style.left = A + "px", a.style.top = M + "px", h.style.display = "", a.focus({ preventScroll: !0 });
      }, m = () => {
        a.style.display = "none", h.style.display = "none", g && document.contains(g) && (g.focus({ preventScroll: !0 }), g = null);
      };
      i(() => {
        const L = d.contextMenu;
        L.show && L.type === l ? y() : m();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (L) => {
        L.preventDefault(), d.closeContextMenu();
      });
      const v = () => {
        d.contextMenu.show && d.contextMenu.type === l && d.closeContextMenu();
      };
      window.addEventListener("scroll", v, !0);
      const C = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), _ = (L) => Array.from(L.querySelectorAll(
        "button:not([disabled])"
      )), k = (L) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const P = document.activeElement, $ = P?.closest(".flow-context-submenu"), x = $ ? _($) : C();
        if (x.length === 0) return;
        const E = x.indexOf(P);
        switch (L.key) {
          case "ArrowDown": {
            L.preventDefault();
            const A = E < x.length - 1 ? E + 1 : 0;
            x[A].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            L.preventDefault();
            const A = E > 0 ? E - 1 : x.length - 1;
            x[A].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (L.preventDefault(), L.shiftKey) {
              const A = E > 0 ? E - 1 : x.length - 1;
              x[A].focus({ preventScroll: !0 });
            } else {
              const A = E < x.length - 1 ? E + 1 : 0;
              x[A].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            L.preventDefault(), P?.click();
            break;
          }
          case "ArrowRight": {
            if (!$) {
              const A = P?.querySelector(".flow-context-submenu");
              A && (L.preventDefault(), A.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            $ && (L.preventDefault(), $.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", k), s(() => {
        h.remove(), window.removeEventListener("scroll", v, !0), a.removeEventListener("keydown", k);
      });
    }
  );
}
const Sg = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function kg(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), u = a.has("queue"), f = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let g = null, p = [], y = !1, m = !1, v = !1;
      function C() {
        const A = r(i);
        return Array.isArray(A) ? A : A && typeof A == "object" ? [A] : [];
      }
      function _() {
        const A = e.closest("[x-data]");
        return A ? t.$data(A) : null;
      }
      function k(A, M = !1) {
        const w = _();
        if (!w?.timeline) return Promise.resolve();
        const b = w.timeline();
        if (M) {
          for (let D = A.length - 1; D >= 0; D--)
            b.step(A[D]);
          b.reverse();
        } else
          for (const D of A)
            D.parallel ? b.parallel(D.parallel) : b.step(D);
        return g = b, b.play().then(() => {
          g === b && (g = null);
        });
      }
      function L(A = !1) {
        if (c && m) return;
        m = !0;
        const M = C();
        if (M.length === 0) return;
        const w = () => k(M, A);
        u ? (p.push(w), P()) : (g?.stop(), g = null, p = [], y = !1, w());
      }
      async function P() {
        if (!y) {
          for (y = !0; p.length > 0; )
            await p.shift()();
          y = !1;
        }
      }
      if (f) {
        s(() => {
          const A = C(), M = _();
          M?.registerAnimation && M.registerAnimation(f, A);
        }), l(() => {
          const A = _();
          A?.unregisterAnimation && A.unregisterAnimation(f);
        });
        return;
      }
      const $ = () => {
        d && h === "click" ? (L(v), v = !v) : L(!1);
      };
      e.addEventListener(h, $);
      let x = null, E = null;
      d && h !== "click" && (E = Sg[h] ?? null, E && (x = () => L(!0), e.addEventListener(E, x))), l(() => {
        g?.stop(), e.removeEventListener(h, $), E && x && e.removeEventListener(E, x);
      });
    }
  );
}
function Lg(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? ve, a = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + l) * n.zoom + n.x, f = (s + a) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function Pg(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !Lg(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function Mg(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, l = null, a = [], c = !1, d = "idle", u = 0;
      function f() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const v = f();
        if (!v?.timeline) return Promise.resolve();
        const C = v.timeline(), _ = m.speed ?? 1, k = m.autoFitView === !0, L = m.fitViewPadding ?? 0.1, P = v.viewport, $ = v.getContainerDimensions?.();
        for (const x of y) {
          const E = _ !== 1 ? {
            ...x,
            duration: x.duration !== void 0 ? x.duration / _ : void 0,
            delay: x.delay !== void 0 ? x.delay / _ : void 0
          } : x;
          if (E.parallel) {
            const A = E.parallel.map(
              (M) => _ !== 1 ? {
                ...M,
                duration: M.duration !== void 0 ? M.duration / _ : void 0,
                delay: M.delay !== void 0 ? M.delay / _ : void 0
              } : M
            );
            C.parallel(A);
          } else if (k && P && $ && Pg(E, v, P, $.width, $.height)) {
            const A = {
              fitView: !0,
              fitViewPadding: L,
              duration: E.duration,
              easing: E.easing
            };
            C.parallel([E, A]);
          } else
            C.step(E);
        }
        if (m.lock && C.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const x = m.loop === !0 ? 0 : m.loop;
          C.loop(x);
        }
        return m.respectReducedMotion !== void 0 && C.respectReducedMotion(m.respectReducedMotion), l = C, d = "playing", c = !0, C.play().then(() => {
          l === C && (l = null, d = "idle", c = !1);
        });
      }
      async function g(y) {
        if (a.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          l?.stop(), l = null, c = !1, d = "idle";
          const v = [a[a.length - 1]];
          s += a.length, a = [], await h(v, y);
        } else {
          const v = [...a];
          s += v.length, a = [], c && await new Promise((_) => {
            l ? (l.on("complete", () => _()), l.on("stop", () => _())) : _();
          }), await h(v, y);
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
          if (l?.stop(), l = null, c = !1, d = "idle", s = 0, a = [], u = 0, y) {
            const m = o(n), v = m.steps ?? [];
            if (v.length > 0)
              return a = [...v], g(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, v = y.autoplay !== !1;
        if (m.length > u) {
          const C = m.slice(Math.max(s, u));
          u = m.length, C.length > 0 && v && (a.push(...C), g(y));
        } else
          u = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function Tg(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("all"), a = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f);
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
      e.addEventListener("click", u), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !l && !c && r(() => {
        const f = i(n);
        if (!f) return;
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const g = t.$data(h);
        if (!g?.isCollapsed) return;
        const p = g.isCollapsed(f);
        e.setAttribute("aria-expanded", String(!p));
        const y = e.closest("[x-flow-node]");
        y && e.setAttribute("aria-controls", y.id || f);
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Ag(t) {
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
function Ao(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ng(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, l = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, a = () => {
      try {
        const m = s.closest(".flow-container");
        return m ? !!t.$data?.(m)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const m = s.closest(".flow-container");
        return m ? !!t.$data?.(m)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    };
    s.classList.add("flow-schema-node");
    let d = null, u = null;
    const f = /* @__PURE__ */ new Map(), h = () => {
      d && u || (Ao(s), f.clear(), d = document.createElement("div"), d.className = "flow-schema-header", s.appendChild(d), u = document.createElement("div"), u.className = "flow-schema-body", s.appendChild(u));
    }, g = () => {
      const m = l(), v = m?.data;
      if (!v) {
        for (const E of f.values())
          t.destroyTree(E);
        f.clear(), Ao(s), d = null, u = null;
        return;
      }
      h();
      const C = typeof v.label == "string" ? v.label : "", _ = Array.isArray(v.fields) ? v.fields : [], k = typeof m?.id == "string" ? m.id : "";
      typeof v.kind == "string" && v.kind ? s.setAttribute("data-flow-schema-kind", v.kind) : s.removeAttribute("data-flow-schema-kind"), d.textContent !== C && (d.textContent = C);
      const L = a(), P = c(), $ = /* @__PURE__ */ new Set();
      for (const E of _) {
        $.add(E.name);
        const A = f.get(E.name);
        if (A)
          p(A, E);
        else {
          const M = y(E, k, L, P);
          f.set(E.name, M), u.appendChild(M), t.initTree(M);
        }
      }
      for (const [E, A] of f)
        $.has(E) || (t.destroyTree(A), A.remove(), f.delete(E));
      let x = u.firstChild;
      for (const E of _) {
        const A = f.get(E.name);
        A && (x === A ? x = x.nextSibling : u.insertBefore(A, x));
      }
    }, p = (m, v) => {
      m.dataset.flowSchemaField !== v.name && (m.dataset.flowSchemaField = v.name), m.classList.toggle("flow-schema-row--pk", v.key === "primary"), m.classList.toggle("flow-schema-row--fk", v.key === "foreign"), m.classList.toggle("flow-schema-row--required", !!v.required);
      let C = m.querySelector(".flow-schema-row-icon");
      const _ = m.querySelector(".flow-schema-row-name");
      v.icon ? (C || (C = document.createElement("span"), C.className = "flow-schema-row-icon", m.insertBefore(C, _)), C.textContent !== v.icon && (C.textContent = v.icon)) : C && C.remove(), _ && _.textContent !== v.name && (_.textContent = v.name);
      const k = m.querySelector(".flow-schema-row-type");
      k && k.textContent !== v.type && (k.textContent = v.type);
    }, y = (m, v, C, _) => {
      const k = document.createElement("div");
      k.className = "flow-schema-row", k.dataset.flowSchemaField = m.name, m.key === "primary" && k.classList.add("flow-schema-row--pk"), m.key === "foreign" && k.classList.add("flow-schema-row--fk"), m.required && k.classList.add("flow-schema-row--required"), v && k.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${v}.${m.name}`)
      ), C && k.setAttribute("x-schema-reorderable", ""), _ && v && k.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${v}.${m.name}`)
      );
      const L = document.createElement("div");
      if (L.className = "flow-schema-handle flow-schema-handle--target", L.setAttribute("x-flow-handle:target.left", JSON.stringify(m.name)), k.appendChild(L), m.icon) {
        const M = document.createElement("span");
        M.className = "flow-schema-row-icon", M.textContent = m.icon, k.appendChild(M);
      }
      const P = document.createElement("span");
      P.className = "flow-schema-row-name", P.textContent = m.name, k.appendChild(P);
      const $ = document.createElement("span");
      $.className = "flow-schema-row-type", $.textContent = m.type, k.appendChild($);
      const x = document.createElement("div");
      x.className = "flow-schema-handle flow-schema-handle--source", x.setAttribute("x-flow-handle:source.right", JSON.stringify(m.name)), k.appendChild(x);
      const E = document.createElement("div");
      E.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", E.setAttribute("x-flow-handle:target.right", JSON.stringify(m.name)), k.appendChild(E);
      const A = document.createElement("div");
      return A.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", A.setAttribute("x-flow-handle:source.left", JSON.stringify(m.name)), k.appendChild(A), k;
    };
    i(() => {
      if (!s.isConnected) return;
      const m = l()?.data;
      m?.label, m?.kind;
      const v = m?.fields;
      if (Array.isArray(v))
        for (const C of v)
          C.name, C.type, C.key, C.required, C.icon;
      g();
    }), r(() => {
      for (const m of f.values())
        t.destroyTree(m);
      f.clear(), Ao(s), d = null, u = null, s.classList.remove("flow-schema-node");
    });
  });
}
function $g(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Is(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ig(t) {
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
      Is(s);
      const d = l()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, g = document.createElement("div");
      if (g.className = "flow-wait-header", f) {
        const C = document.createElement("span");
        C.className = "flow-wait-icon", C.textContent = f, g.appendChild(C);
      }
      const p = document.createElement("span");
      p.className = "flow-wait-label", p.textContent = u, g.appendChild(p);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = $g(h), g.appendChild(y), s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-wait-handle flow-wait-handle--target", m.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(m);
      const v = document.createElement("div");
      v.className = "flow-wait-handle flow-wait-handle--source", v.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(v), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = l()?.data;
      c?.durationMs, c?.label, c?.icon, a();
    }), r(() => {
      Is(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Ds = {
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
function Dg(t) {
  const { field: e, op: n, value: o } = t;
  return n in Ds ? `${e} ${Ds[n]} ${rn(o)}` : n === "in" ? `${e} in ${rn(o)}` : n === "notIn" ? `${e} not in ${rn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${rn(o)}`;
}
function Rs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Rg(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Fg(t) {
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
      const u = l()?.data ?? {}, f = Rg(a(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Rs(s);
      const g = typeof u.label == "string" && u.label ? u.label : "Condition", p = document.createElement("div");
      p.className = "flow-condition-header", p.textContent = g, s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? y.textContent = Dg(u.condition) : typeof u.evaluate == "function" ? y.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const v = document.createElement("div");
      v.className = "flow-condition-handle-source flow-condition-handle--true", v.setAttribute("data-flow-handle-direction", "source"), v.setAttribute("data-source-handle", "true"), v.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(v);
      const C = document.createElement("div");
      C.className = "flow-condition-handle-source flow-condition-handle--false", C.setAttribute("data-flow-handle-direction", "source"), C.setAttribute("data-source-handle", "false"), C.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(C), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Rs(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Hg(t) {
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
function Og(t) {
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
          const g = i(n), p = f.viewport.zoom, y = g.min === void 0 || p >= g.min, m = g.max === void 0 || p <= g.max;
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
const zg = ["perf", "events", "viewport", "state", "activity"], Fs = ["fps", "memory", "counts", "visible"], Hs = 30;
function Vg(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => zg.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Bg(t) {
  return t.perf ? t.perf === !0 ? [...Fs] : t.perf.filter((e) => Fs.includes(e)) : [];
}
function qg(t) {
  return t.events ? t.events === !0 ? Hs : t.events.max ?? Hs : 0;
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
function Xg(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = Vg(l, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (J) => J.stopPropagation();
      e.addEventListener("wheel", u);
      const f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(g), f.appendChild(h), e.appendChild(f);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let y = !1;
      const m = () => {
        y = !y, p.style.display = y ? "" : "none", f.title = y ? "Collapse" : "Devtools", y ? ne() : ie();
      };
      f.addEventListener("click", m);
      const v = Bg(a);
      let C = null, _ = null, k = null, L = null, P = null;
      if (v.length > 0) {
        const { wrapper: J, content: ce } = en("Performance", "flow-devtools-perf");
        if (v.includes("fps")) {
          const { row: ee, valueEl: F } = Oe("FPS", "flow-devtools-fps");
          C = F, ce.appendChild(ee);
        }
        if (v.includes("memory")) {
          const { row: ee, valueEl: F } = Oe("Memory", "flow-devtools-memory");
          _ = F, ce.appendChild(ee);
        }
        if (v.includes("counts")) {
          const ee = Oe("Nodes", "flow-devtools-counts");
          k = ee.valueEl, ce.appendChild(ee.row);
          const F = Oe("Edges", "flow-devtools-counts");
          L = F.valueEl, ce.appendChild(F.row);
        }
        if (v.includes("visible")) {
          const { row: ee, valueEl: F } = Oe("Visible", "flow-devtools-visible");
          P = F, ce.appendChild(ee);
        }
        p.appendChild(J);
      }
      const $ = qg(a);
      let x = null;
      if ($ > 0) {
        const { wrapper: J, content: ce } = en("Events", "flow-devtools-events"), ee = document.createElement("button");
        ee.className = "flow-devtools-clear-btn nopan", ee.textContent = "Clear", ee.addEventListener("click", () => {
          x && (x.textContent = ""), le.length = 0;
        }), J.querySelector(".flow-devtools-section-title").appendChild(ee), x = document.createElement("div"), x.className = "flow-devtools-event-list", ce.appendChild(x), p.appendChild(J);
      }
      let E = null, A = null, M = null;
      if (a.viewport) {
        const { wrapper: J, content: ce } = en("Viewport", "flow-devtools-viewport"), ee = Oe("X", "flow-devtools-vp-x");
        E = ee.valueEl, ce.appendChild(ee.row);
        const F = Oe("Y", "flow-devtools-vp-y");
        A = F.valueEl, ce.appendChild(F.row);
        const K = Oe("Zoom", "flow-devtools-vp-zoom");
        M = K.valueEl, ce.appendChild(K.row), p.appendChild(J);
      }
      let w = null;
      if (a.state) {
        const { wrapper: J, content: ce } = en("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", ce.appendChild(w), p.appendChild(J);
      }
      let b = null, D = null, T = null, O = null;
      if (a.activity) {
        const { wrapper: J, content: ce } = en("Activity", "flow-devtools-activity"), ee = Oe("Animations", "flow-devtools-anim");
        b = ee.valueEl, ce.appendChild(ee.row);
        const F = Oe("Particles", "flow-devtools-particles");
        D = F.valueEl, ce.appendChild(F.row);
        const K = Oe("Follow", "flow-devtools-follow");
        T = K.valueEl, ce.appendChild(K.row);
        const U = Oe("Timelines", "flow-devtools-timelines");
        O = U.valueEl, ce.appendChild(U.row), p.appendChild(J);
      }
      let W = null, S = !1, N = 0, R = performance.now();
      const q = !!(C || _), se = () => {
        if (!S) return;
        N++;
        const J = performance.now();
        J - R >= 1e3 && (C && (C.textContent = String(Math.round(N * 1e3 / (J - R)))), N = 0, R = J, _ && performance.memory && (_.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), W = requestAnimationFrame(se);
      }, ne = () => {
        !q || S || (S = !0, N = 0, R = performance.now(), W = requestAnimationFrame(se));
      }, ie = () => {
        S = !1, W !== null && (cancelAnimationFrame(W), W = null);
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
      if ($ > 0 && x) {
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
          const K = x, U = document.createElement("div");
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
        !J || !J.viewport || (E && (E.textContent = Math.round(J.viewport.x).toString()), A && (A.textContent = Math.round(J.viewport.y).toString()), M && (M.textContent = J.viewport.zoom.toFixed(2)));
      }), r(() => {
        const J = t.$data(c);
        if (J) {
          if (k && (k.textContent = String(J.nodes?.length ?? 0)), L && (L.textContent = String(J.edges?.length ?? 0)), P && J._getVisibleNodeIds && (P.textContent = String(J._getVisibleNodeIds().size)), w) {
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
          if (b) {
            const ce = J._animator?._groups?.size ?? 0;
            b.textContent = String(ce);
          }
          D && (D.textContent = String(J._activeParticles?.size ?? 0)), T && (T.textContent = J._followHandle ? "Active" : "Idle"), O && (O.textContent = String(J._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ie(), f.removeEventListener("click", m), ue)
          for (const J of de)
            d.removeEventListener(J, ue);
        e.removeEventListener("wheel", u), e.textContent = "", C = null, _ = null, k = null, L = null, P = null, x = null, E = null, A = null, M = null, w = null, b = null, D = null, T = null, O = null;
      });
    }
  );
}
const Yg = {
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
function Wg(t) {
  return Yg[t] ?? null;
}
function jg(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Wg(n);
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
function Ug(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const No = /* @__PURE__ */ new WeakMap();
function Zg(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Ug(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), No.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), No.set(c, u);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = No.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Kg(t) {
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
function Gg(t) {
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
        const h = i(n), g = Kg(h);
        if (!g) return;
        if (l && d) {
          d.stop(), d = null, u(!1);
          return;
        }
        d && d.stop();
        const p = {};
        g.zoom !== void 0 && (p.zoom = g.zoom), g.speed !== void 0 && (p.speed = g.speed), d = c.follow(g.target, p), u(!0), d?.finished && d.finished.then(() => {
          d = null, u(!1);
        });
      };
      e.addEventListener("click", f), s(() => {
        e.removeEventListener("click", f), d && (d.stop(), d = null);
      });
    }
  );
}
function Jg(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Si = /* @__PURE__ */ new Map();
function Qg(t, e) {
  Si.set(t, e);
}
function em(t) {
  return Si.get(t) ?? null;
}
function tm(t) {
  return Si.has(t);
}
function $o(t) {
  return `alpineflow-snapshot-${t}`;
}
function nm(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Jg(n, i);
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
            a.persist ? localStorage.setItem($o(f), JSON.stringify(h)) : Qg(f, h);
          } else {
            let h = null;
            if (a.persist) {
              const g = localStorage.getItem($o(f));
              if (g)
                try {
                  h = JSON.parse(g);
                } catch {
                }
            } else
              h = em(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), a.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        a.persist ? h = localStorage.getItem($o(f)) !== null : (d.nodes.length, h = tm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function om(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function im(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(om(s._loadingText));
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
function sm(t) {
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
      const g = o.includes("below"), p = 20;
      r(() => {
        if (!d.edges.some((x) => x.id === a)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let v = 0.5;
        if (n) {
          const x = i(n);
          typeof x == "number" && (v = x);
        }
        const C = l.querySelectorAll("path"), _ = C.length > 1 ? C[1] : C[0];
        if (!_) return;
        const k = _.getTotalLength?.();
        if (!k) return;
        const L = _.getPointAtLength(k * Math.max(0, Math.min(1, v))), P = m / y, $ = g ? P : -P;
        e.style.left = `${L.x}px`, e.style.top = `${L.y + $}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function rm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function am(t) {
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
function my(t, e, n) {
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
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([v, C]) => `${v}:${C}`).join(";")
    } : {},
    data: m.data ?? {}
  })), u = e.filter((m) => !m.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const m of u) {
    const v = c.get(m.source), C = c.get(m.target);
    if (!v || !C)
      continue;
    let _, k;
    try {
      const E = ro(
        m,
        v,
        C,
        v.sourcePosition ?? "bottom",
        C.targetPosition ?? "top"
      );
      _ = E.path, k = E.labelPosition;
    } catch {
      continue;
    }
    let L, P;
    if (m.markerStart) {
      const E = Dt(m.markerStart), A = Rt(E, s);
      h.has(A) || h.set(A, Jn(E, A)), L = `url(#${A})`;
    }
    if (m.markerEnd) {
      const E = Dt(m.markerEnd), A = Rt(E, s);
      h.has(A) || h.set(A, Jn(E, A)), P = `url(#${A})`;
    }
    let $, x;
    if (m.label)
      if (k)
        $ = k.x, x = k.y;
      else {
        const E = v.position.x + v.dimensions.width / 2, A = v.position.y + v.dimensions.height / 2, M = C.position.x + C.dimensions.width / 2, w = C.position.y + C.dimensions.height / 2;
        $ = (E + M) / 2, x = (A + w) / 2;
      }
    f.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: _,
      ...L ? { markerStart: L } : {},
      ...P ? { markerEnd: P } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...$ !== void 0 ? { labelX: $ } : {},
      ...x !== void 0 ? { labelY: x } : {}
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
    edges: f,
    markers: g,
    viewBox: p,
    viewport: y
  };
}
const Os = /* @__PURE__ */ new WeakSet();
function yy(t) {
  Os.has(t) || (Os.add(t), Ea(t), am(t), Hp(t), Zp(t), Sf(t), yf(t), wf(t), vf(t), $p(t), Qp(t), og(t), ig(t), rg(t), lg(t), _g(t), bg(t), Cg(t), kg(t), Mg(t), Tg(t), Ag(t), Hg(t), Og(t), Xg(t), jg(t), Zg(t), Gg(t), nm(t), im(t), sm(t), Ng(t), Ig(t), Fg(t), rm(t));
}
function lm(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function cm(t, e, n, o) {
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
async function dm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => ay));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, g = t.style.width, p = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const E = t.querySelectorAll("[data-flow-culled]");
      for (const D of E)
        D.style.display = "", m.push(D);
      const A = n.filter((D) => !D.hidden), M = qt(A), w = i.padding ?? 0.1, b = Zn(
        M,
        a,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        w
      );
      e.style.transform = `translate(${b.x}px, ${b.y}px) scale(${b.zoom})`, e.style.width = `${a}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${a}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((E) => requestAnimationFrame(E));
    const v = i.includeOverlays, C = v === !0, _ = typeof v == "object" ? v : {}, k = [
      ["canvas-overlay", C || (_.toolbar ?? !1)],
      ["flow-minimap", C || (_.minimap ?? !1)],
      ["flow-controls", C || (_.controls ?? !1)],
      ["flow-panel", C || (_.panels ?? !1)],
      ["flow-selection-box", !1]
    ], L = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (E) => {
        if (E.classList) {
          for (const [A, M] of k)
            if (E.classList.contains(A) && !M) return !1;
        }
        return !0;
      }
    }), $ = lm(decodeURIComponent(L.substring("data:image/svg+xml;charset=utf-8,".length))), x = await cm($, a, c, d);
    if (i.filename) {
      const E = document.createElement("a");
      E.download = i.filename, E.href = x, E.click();
    }
    return x;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = g, t.style.height = p, t.style.overflow = y;
    for (const v of m)
      v.style.display = "none";
  }
}
const um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: dm
}, Symbol.toStringTag, { value: "Module" }));
function fm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const hm = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function pt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Mt = null;
function fa(t = {}) {
  return Mt || (t.includeStyleProperties ? (Mt = t.includeStyleProperties, Mt) : (Mt = pt(window.getComputedStyle(document.documentElement)), Mt));
}
function co(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function pm(t) {
  const e = co(t, "border-left-width"), n = co(t, "border-right-width");
  return t.clientWidth + e + n;
}
function gm(t) {
  const e = co(t, "border-top-width"), n = co(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function ki(t, e = {}) {
  const n = e.width || pm(t), o = e.height || gm(t);
  return { width: n, height: o };
}
function mm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const De = 16384;
function ym(t) {
  (t.width > De || t.height > De) && (t.width > De && t.height > De ? t.width > t.height ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De) : t.width > De ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De));
}
function wm(t, e = {}) {
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
function uo(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function vm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function _m(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), vm(i);
}
const $e = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || $e(n, e);
};
function bm(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function xm(t, e) {
  return fa(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function Em(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? bm(n) : xm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function zs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = hm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(Em(s, n, i, o)), e.appendChild(l);
}
function Cm(t, e, n) {
  zs(t, e, ":before", n), zs(t, e, ":after", n);
}
const Vs = "application/font-woff", Bs = "image/jpeg", Sm = {
  woff: Vs,
  woff2: Vs,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Bs,
  jpeg: Bs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function km(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Li(t) {
  const e = km(t).toLowerCase();
  return Sm[e] || "";
}
function Lm(t) {
  return t.split(/,/)[1];
}
function ii(t) {
  return t.search(/^(data:)/) !== -1;
}
function Pm(t, e) {
  return `data:${e};base64,${t}`;
}
async function ha(t, e, n) {
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
const Io = {};
function Mm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Pi(t, e, n) {
  const o = Mm(t, e, n.includeQueryParams);
  if (Io[o] != null)
    return Io[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await ha(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), Lm(l)));
    i = Pm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Io[o] = i, i;
}
async function Tm(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : uo(e);
}
async function Am(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return uo(l);
  }
  const n = t.poster, o = Li(n), i = await Pi(n, o, e);
  return uo(i);
}
async function Nm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await yo(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function $m(t, e) {
  return $e(t, HTMLCanvasElement) ? Tm(t) : $e(t, HTMLVideoElement) ? Am(t, e) : $e(t, HTMLIFrameElement) ? Nm(t, e) : t.cloneNode(pa(t));
}
const Im = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", pa = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Dm(t, e, n) {
  var o, i;
  if (pa(e))
    return e;
  let r = [];
  return Im(t) && t.assignedNodes ? r = pt(t.assignedNodes()) : $e(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = pt(t.contentDocument.body.childNodes) : r = pt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || $e(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => yo(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Rm(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : fa(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), $e(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Fm(t, e) {
  $e(t, HTMLTextAreaElement) && (e.innerHTML = t.value), $e(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Hm(t, e) {
  if ($e(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Om(t, e, n) {
  return $e(e, Element) && (Rm(t, e, n), Cm(t, e, n), Fm(t, e), Hm(t, e)), e;
}
async function zm(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const l = n[r].getAttribute("xlink:href");
    if (l) {
      const a = t.querySelector(l), c = document.querySelector(l);
      !a && c && !o[l] && (o[l] = await yo(c, e, !0));
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
async function yo(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => $m(o, e)).then((o) => Dm(t, o, e)).then((o) => Om(t, o, e)).then((o) => zm(o, e));
}
const ga = /url\((['"]?)([^'"]+?)\1\)/g, Vm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Bm = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function qm(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Xm(t) {
  const e = [];
  return t.replace(ga, (n, o, i) => (e.push(i), n)), e.filter((n) => !ii(n));
}
async function Ym(t, e, n, o, i) {
  try {
    const r = n ? fm(e, n) : e, s = Li(e);
    let l;
    return i || (l = await Pi(r, s, o)), t.replace(qm(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function Wm(t, { preferredFontFormat: e }) {
  return e ? t.replace(Bm, (n) => {
    for (; ; ) {
      const [o, , i] = Vm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function ma(t) {
  return t.search(ga) !== -1;
}
async function ya(t, e, n) {
  if (!ma(t))
    return t;
  const o = Wm(t, n);
  return Xm(o).reduce((r, s) => r.then((l) => Ym(l, s, e, n)), Promise.resolve(o));
}
async function Tt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await ya(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function jm(t, e) {
  await Tt("background", t, e) || await Tt("background-image", t, e), await Tt("mask", t, e) || await Tt("-webkit-mask", t, e) || await Tt("mask-image", t, e) || await Tt("-webkit-mask-image", t, e);
}
async function Um(t, e) {
  const n = $e(t, HTMLImageElement);
  if (!(n && !ii(t.src)) && !($e(t, SVGImageElement) && !ii(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Pi(o, Li(o), e);
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
async function Zm(t, e) {
  const o = pt(t.childNodes).map((i) => wa(i, e));
  await Promise.all(o).then(() => t);
}
async function wa(t, e) {
  $e(t, Element) && (await jm(t, e), await Um(t, e), await Zm(t, e));
}
function Km(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const qs = {};
async function Xs(t) {
  let e = qs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, qs[t] = e, e;
}
async function Ys(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), ha(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function Ws(t) {
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
async function Gm(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        pt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = Xs(a).then((d) => Ys(d, e)).then((d) => Ws(d).forEach((u) => {
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
        i.href != null && o.push(Xs(i.href).then((l) => Ys(l, e)).then((l) => Ws(l).forEach((a) => {
          s.insertRule(a, s.cssRules.length);
        })).catch((l) => {
          console.error("Error loading remote stylesheet", l);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        pt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function Jm(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => ma(e.style.getPropertyValue("src")));
}
async function Qm(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = pt(t.ownerDocument.styleSheets), o = await Gm(n, e);
  return Jm(o);
}
function va(t) {
  return t.trim().replace(/["']/g, "");
}
function ey(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(va(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function _a(t, e) {
  const n = await Qm(t, e), o = ey(t);
  return (await Promise.all(n.filter((r) => o.has(va(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return ya(r.cssText, s, e);
  }))).join(`
`);
}
async function ty(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await _a(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function ba(t, e = {}) {
  const { width: n, height: o } = ki(t, e), i = await yo(t, e, !0);
  return await ty(i, e), await wa(i, e), Km(i, e), await _m(i, n, o);
}
async function xn(t, e = {}) {
  const { width: n, height: o } = ki(t, e), i = await ba(t, e), r = await uo(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || mm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || ym(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function ny(t, e = {}) {
  const { width: n, height: o } = ki(t, e);
  return (await xn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function oy(t, e = {}) {
  return (await xn(t, e)).toDataURL();
}
async function iy(t, e = {}) {
  return (await xn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function sy(t, e = {}) {
  const n = await xn(t, e);
  return await wm(n);
}
async function ry(t, e = {}) {
  return _a(t, e);
}
const ay = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: ry,
  toBlob: sy,
  toCanvas: xn,
  toJpeg: iy,
  toPixelData: ny,
  toPng: oy,
  toSvg: ba
}, Symbol.toStringTag, { value: "Module" }));
export {
  Bf as ComputeEngine,
  zu as FlowHistory,
  ds as SHORTCUT_DEFAULTS,
  uy as along,
  gf as areNodesConnected,
  Vr as buildNodeMap,
  qr as clampToExtent,
  Eo as clampToParent,
  my as computeRenderPlan,
  ps as computeValidationErrors,
  Br as computeZIndex,
  yy as default,
  hy as drift,
  Tf as expandParentToFitChild,
  Ko as getAbsolutePosition,
  Cf as getAutoPanDelta,
  Qn as getBezierPath,
  ff as getConnectedEdges,
  ht as getDescendantIds,
  Ps as getEdgePosition,
  sa as getFloatingEdgeParams,
  hf as getIncomers,
  Ls as getNodeIntersection,
  qt as getNodesBounds,
  uf as getNodesFullyInPolygon,
  Du as getNodesFullyInRect,
  df as getNodesInPolygon,
  Iu as getNodesInRect,
  Uo as getOutgoers,
  ly as getSimpleBezierPath,
  gy as getSimpleFloatingPosition,
  yn as getSmoothStepPath,
  Ef as getStepPath,
  Fr as getStraightPath,
  Zn as getViewportForBounds,
  ze as isConnectable,
  _f as isDeletable,
  Rr as isDraggable,
  ls as isResizable,
  Zo as isSelectable,
  Xe as matchesKey,
  ft as matchesModifier,
  cy as orbit,
  fy as pendulum,
  wi as pointInPolygon,
  cf as polygonIntersectsAABB,
  Zu as registerMarker,
  cn as resolveChildValidation,
  kf as resolveShortcuts,
  St as sortNodesTopological,
  py as stagger,
  Ot as toAbsoluteNode,
  oo as toAbsoluteNodes,
  jr as validateChildAdd,
  io as validateChildRemove,
  dy as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
