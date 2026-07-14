let Ho = null;
function La(t) {
  Ho = t;
}
function Se() {
  if (!Ho)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Ho;
}
var Pa = { value: () => {
} };
function co() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Hn(n);
}
function Hn(t) {
  this._ = t;
}
function Ma(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Hn.prototype = co.prototype = {
  constructor: Hn,
  on: function(t, e) {
    var n = this._, o = Ma(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Ta(n[i], t.name))) return i;
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
    return new Hn(t);
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
function Ta(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Ai(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Pa, t = t.slice(0, o).concat(t.slice(o + 1));
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
function uo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Ni.hasOwnProperty(e) ? { space: Ni[e], local: t } : t;
}
function Aa(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Ro && e.documentElement.namespaceURI === Ro ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Na(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Zs(t) {
  var e = uo(t);
  return (e.local ? Na : Aa)(e);
}
function Ia() {
}
function ri(t) {
  return t == null ? Ia : function() {
    return this.querySelector(t);
  };
}
function $a(t) {
  typeof t != "function" && (t = ri(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Re(o, this._parents);
}
function Da(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Ha() {
  return [];
}
function Gs(t) {
  return t == null ? Ha : function() {
    return this.querySelectorAll(t);
  };
}
function Ra(t) {
  return function() {
    return Da(t.apply(this, arguments));
  };
}
function Fa(t) {
  typeof t == "function" ? t = Ra(t) : t = Gs(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new Re(o, i);
}
function Ks(t) {
  return function() {
    return this.matches(t);
  };
}
function Js(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Oa = Array.prototype.find;
function za(t) {
  return function() {
    return Oa.call(this.children, t);
  };
}
function Va() {
  return this.firstElementChild;
}
function Ba(t) {
  return this.select(t == null ? Va : za(typeof t == "function" ? t : Js(t)));
}
var qa = Array.prototype.filter;
function Xa() {
  return Array.from(this.children);
}
function Ya(t) {
  return function() {
    return qa.call(this.children, t);
  };
}
function Wa(t) {
  return this.selectAll(t == null ? Xa : Ya(typeof t == "function" ? t : Js(t)));
}
function ja(t) {
  typeof t != "function" && (t = Ks(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Re(o, this._parents);
}
function Qs(t) {
  return new Array(t.length);
}
function Ua() {
  return new Re(this._enter || this._groups.map(Qs), this._parents);
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
function Za(t) {
  return function() {
    return t;
  };
}
function Ga(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Vn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function Ka(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (f[a] = h = s.call(l, l.__data__, a, e) + "", c.has(h) ? i[a] = l : c.set(h, l));
  for (a = 0; a < u; ++a)
    h = s.call(t, r[a], a, r) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = r[a], c.delete(h)) : n[a] = new Vn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(f[a]) === l && (i[a] = l);
}
function Ja(t) {
  return t.__data__;
}
function Qa(t, e) {
  if (!arguments.length) return Array.from(this, Ja);
  var n = e ? Ka : Ga, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Za(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = el(t.call(d, d && d.__data__, c, o)), g = h.length, p = a[c] = new Array(g), y = s[c] = new Array(g), m = l[c] = new Array(f);
    n(d, u, p, y, m, h, e);
    for (var _ = 0, E = 0, b, x; _ < g; ++_)
      if (b = p[_]) {
        for (_ >= E && (E = _ + 1); !(x = y[E]) && ++E < g; ) ;
        b._next = x || null;
      }
  }
  return s = new Re(s, o), s._enter = a, s._exit = l, s;
}
function el(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function tl() {
  return new Re(this._exit || this._groups.map(Qs), this._parents);
}
function nl(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function ol(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], u = c.length, f = a[l] = new Array(u), h, g = 0; g < u; ++g)
      (h = c[g] || d[g]) && (f[g] = h);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Re(a, this._parents);
}
function il() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function sl(t) {
  t || (t = rl);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(e);
  }
  return new Re(i, this._parents).order();
}
function rl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function al() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function ll() {
  return Array.from(this);
}
function cl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function dl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function ul() {
  return !this.node();
}
function fl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function hl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function gl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function pl(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function ml(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function yl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function wl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function vl(t, e) {
  var n = uo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? gl : hl : typeof e == "function" ? n.local ? wl : yl : n.local ? ml : pl)(n, e));
}
function er(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function _l(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function bl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function xl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function El(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? _l : typeof e == "function" ? xl : bl)(t, e, n ?? "")) : zt(this.node(), t);
}
function zt(t, e) {
  return t.style.getPropertyValue(e) || er(t).getComputedStyle(t, null).getPropertyValue(e);
}
function Cl(t) {
  return function() {
    delete this[t];
  };
}
function Sl(t, e) {
  return function() {
    this[t] = e;
  };
}
function kl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function Ll(t, e) {
  return arguments.length > 1 ? this.each((e == null ? Cl : typeof e == "function" ? kl : Sl)(t, e)) : this.node()[t];
}
function tr(t) {
  return t.trim().split(/^|\s+/);
}
function ai(t) {
  return t.classList || new nr(t);
}
function nr(t) {
  this._node = t, this._names = tr(t.getAttribute("class") || "");
}
nr.prototype = {
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
function or(t, e) {
  for (var n = ai(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function ir(t, e) {
  for (var n = ai(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Pl(t) {
  return function() {
    or(this, t);
  };
}
function Ml(t) {
  return function() {
    ir(this, t);
  };
}
function Tl(t, e) {
  return function() {
    (e.apply(this, arguments) ? or : ir)(this, t);
  };
}
function Al(t, e) {
  var n = tr(t + "");
  if (arguments.length < 2) {
    for (var o = ai(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Tl : e ? Pl : Ml)(n, e));
}
function Nl() {
  this.textContent = "";
}
function Il(t) {
  return function() {
    this.textContent = t;
  };
}
function $l(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Dl(t) {
  return arguments.length ? this.each(t == null ? Nl : (typeof t == "function" ? $l : Il)(t)) : this.node().textContent;
}
function Hl() {
  this.innerHTML = "";
}
function Rl(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Fl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Ol(t) {
  return arguments.length ? this.each(t == null ? Hl : (typeof t == "function" ? Fl : Rl)(t)) : this.node().innerHTML;
}
function zl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Vl() {
  return this.each(zl);
}
function Bl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function ql() {
  return this.each(Bl);
}
function Xl(t) {
  var e = typeof t == "function" ? t : Zs(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Yl() {
  return null;
}
function Wl(t, e) {
  var n = typeof t == "function" ? t : Zs(t), o = e == null ? Yl : typeof e == "function" ? e : ri(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function jl() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Ul() {
  return this.each(jl);
}
function Zl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Gl() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Kl(t) {
  return this.select(t ? Gl : Zl);
}
function Jl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Ql(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function ec(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function tc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function nc(t, e, n) {
  return function() {
    var o = this.__on, i, r = Ql(e);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === t.type && i.name === t.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = e;
          return;
        }
    }
    this.addEventListener(t.type, r, n), i = { type: t.type, name: t.name, value: e, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function oc(t, e, n) {
  var o = ec(t + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, c = a.length, d; l < c; ++l)
        for (i = 0, d = a[l]; i < r; ++i)
          if ((s = o[i]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (a = e ? nc : tc, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function sr(t, e, n) {
  var o = er(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function ic(t, e) {
  return function() {
    return sr(this, t, e);
  };
}
function sc(t, e) {
  return function() {
    return sr(this, t, e.apply(this, arguments));
  };
}
function rc(t, e) {
  return this.each((typeof e == "function" ? sc : ic)(t, e));
}
function* ac() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var rr = [null];
function Re(t, e) {
  this._groups = t, this._parents = e;
}
function _n() {
  return new Re([[document.documentElement]], rr);
}
function lc() {
  return this;
}
Re.prototype = _n.prototype = {
  constructor: Re,
  select: $a,
  selectAll: Fa,
  selectChild: Ba,
  selectChildren: Wa,
  filter: ja,
  data: Qa,
  enter: Ua,
  exit: tl,
  join: nl,
  merge: ol,
  selection: lc,
  order: il,
  sort: sl,
  call: al,
  nodes: ll,
  node: cl,
  size: dl,
  empty: ul,
  each: fl,
  attr: vl,
  style: El,
  property: Ll,
  classed: Al,
  text: Dl,
  html: Ol,
  raise: Vl,
  lower: ql,
  append: Xl,
  insert: Wl,
  remove: Ul,
  clone: Kl,
  datum: Jl,
  on: oc,
  dispatch: rc,
  [Symbol.iterator]: ac
};
function qe(t) {
  return typeof t == "string" ? new Re([[document.querySelector(t)]], [document.documentElement]) : new Re([[t]], rr);
}
function cc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ke(t, e) {
  if (t = cc(t), e === void 0 && (e = t.currentTarget), e) {
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
const dc = { passive: !1 }, dn = { capture: !0, passive: !1 };
function vo(t) {
  t.stopImmediatePropagation();
}
function Ht(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function ar(t) {
  var e = t.document.documentElement, n = qe(t).on("dragstart.drag", Ht, dn);
  "onselectstart" in e ? n.on("selectstart.drag", Ht, dn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function lr(t, e) {
  var n = t.document.documentElement, o = qe(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Ht, dn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Sn = (t) => () => t;
function Fo(t, {
  sourceEvent: e,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: a,
  dx: l,
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
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
Fo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function uc(t) {
  return !t.ctrlKey && !t.button;
}
function fc() {
  return this.parentNode;
}
function hc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function gc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function pc() {
  var t = uc, e = fc, n = hc, o = gc, i = {}, r = co("start", "drag", "end"), s = 0, a, l, c, d, u = 0;
  function f(b) {
    b.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, dc).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, x) {
    if (!(d || !t.call(this, b, x))) {
      var M = E(this, e.call(this, b, x), b, x, "mouse");
      M && (qe(b.view).on("mousemove.drag", g, dn).on("mouseup.drag", p, dn), ar(b.view), vo(b), c = !1, a = b.clientX, l = b.clientY, M("start", b));
    }
  }
  function g(b) {
    if (Ht(b), !c) {
      var x = b.clientX - a, M = b.clientY - l;
      c = x * x + M * M > u;
    }
    i.mouse("drag", b);
  }
  function p(b) {
    qe(b.view).on("mousemove.drag mouseup.drag", null), lr(b.view, c), Ht(b), i.mouse("end", b);
  }
  function y(b, x) {
    if (t.call(this, b, x)) {
      var M = b.changedTouches, P = e.call(this, b, x), A = M.length, $, C;
      for ($ = 0; $ < A; ++$)
        (C = E(this, P, b, x, M[$].identifier, M[$])) && (vo(b), C("start", b, M[$]));
    }
  }
  function m(b) {
    var x = b.changedTouches, M = x.length, P, A;
    for (P = 0; P < M; ++P)
      (A = i[x[P].identifier]) && (Ht(b), A("drag", b, x[P]));
  }
  function _(b) {
    var x = b.changedTouches, M = x.length, P, A;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), P = 0; P < M; ++P)
      (A = i[x[P].identifier]) && (vo(b), A("end", b, x[P]));
  }
  function E(b, x, M, P, A, $) {
    var C = r.copy(), T = Ke($ || M, x), S, v, w;
    if ((w = n.call(b, new Fo("beforestart", {
      sourceEvent: M,
      target: f,
      identifier: A,
      active: s,
      x: T[0],
      y: T[1],
      dx: 0,
      dy: 0,
      dispatch: C
    }), P)) != null)
      return S = w.x - T[0] || 0, v = w.y - T[1] || 0, function I(k, R, O) {
        var Y = T, D;
        switch (k) {
          case "start":
            i[A] = I, D = s++;
            break;
          case "end":
            delete i[A], --s;
          // falls through
          case "drag":
            T = Ke(O || R, x), D = s;
            break;
        }
        C.call(
          k,
          b,
          new Fo(k, {
            sourceEvent: R,
            subject: w,
            target: f,
            identifier: A,
            active: D,
            x: T[0] + S,
            y: T[1] + v,
            dx: T[0] - Y[0],
            dy: T[1] - Y[1],
            dispatch: C
          }),
          P
        );
      };
  }
  return f.filter = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Sn(!!b), f) : t;
  }, f.container = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Sn(b), f) : e;
  }, f.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Sn(b), f) : n;
  }, f.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Sn(!!b), f) : o;
  }, f.on = function() {
    var b = r.on.apply(r, arguments);
    return b === r ? f : b;
  }, f.clickDistance = function(b) {
    return arguments.length ? (u = (b = +b) * b, f) : Math.sqrt(u);
  }, f;
}
function li(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function cr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function bn() {
}
var un = 0.7, Bn = 1 / un, Rt = "\\s*([+-]?\\d+)\\s*", fn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ue = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", mc = /^#([0-9a-f]{3,8})$/, yc = new RegExp(`^rgb\\(${Rt},${Rt},${Rt}\\)$`), wc = new RegExp(`^rgb\\(${Ue},${Ue},${Ue}\\)$`), vc = new RegExp(`^rgba\\(${Rt},${Rt},${Rt},${fn}\\)$`), _c = new RegExp(`^rgba\\(${Ue},${Ue},${Ue},${fn}\\)$`), bc = new RegExp(`^hsl\\(${fn},${Ue},${Ue}\\)$`), xc = new RegExp(`^hsla\\(${fn},${Ue},${Ue},${fn}\\)$`), Ii = {
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
li(bn, hn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: $i,
  // Deprecated! Use color.formatHex.
  formatHex: $i,
  formatHex8: Ec,
  formatHsl: Cc,
  formatRgb: Di,
  toString: Di
});
function $i() {
  return this.rgb().formatHex();
}
function Ec() {
  return this.rgb().formatHex8();
}
function Cc() {
  return dr(this).formatHsl();
}
function Di() {
  return this.rgb().formatRgb();
}
function hn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = mc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Hi(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? kn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? kn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = yc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = wc.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = vc.exec(t)) ? kn(e[1], e[2], e[3], e[4]) : (e = _c.exec(t)) ? kn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = bc.exec(t)) ? Oi(e[1], e[2] / 100, e[3] / 100, 1) : (e = xc.exec(t)) ? Oi(e[1], e[2] / 100, e[3] / 100, e[4]) : Ii.hasOwnProperty(t) ? Hi(Ii[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function Hi(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function kn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function Sc(t) {
  return t instanceof bn || (t = hn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function Oo(t, e, n, o) {
  return arguments.length === 1 ? Sc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
li(Ne, Oo, cr(bn, {
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
  hex: Ri,
  // Deprecated! Use color.formatHex.
  formatHex: Ri,
  formatHex8: kc,
  formatRgb: Fi,
  toString: Fi
}));
function Ri() {
  return `#${xt(this.r)}${xt(this.g)}${xt(this.b)}`;
}
function kc() {
  return `#${xt(this.r)}${xt(this.g)}${xt(this.b)}${xt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Fi() {
  const t = qn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Et(this.r)}, ${Et(this.g)}, ${Et(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function qn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Et(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function xt(t) {
  return t = Et(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Oi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Xe(t, e, n, o);
}
function dr(t) {
  if (t instanceof Xe) return new Xe(t.h, t.s, t.l, t.opacity);
  if (t instanceof bn || (t = hn(t)), !t) return new Xe();
  if (t instanceof Xe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Xe(s, a, l, t.opacity);
}
function Lc(t, e, n, o) {
  return arguments.length === 1 ? dr(t) : new Xe(t, e, n, o ?? 1);
}
function Xe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
li(Xe, Lc, cr(bn, {
  brighter(t) {
    return t = t == null ? Bn : Math.pow(Bn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? un : Math.pow(un, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      _o(t >= 240 ? t - 240 : t + 120, i, o),
      _o(t, i, o),
      _o(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Xe(zi(this.h), Ln(this.s), Ln(this.l), qn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = qn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${zi(this.h)}, ${Ln(this.s) * 100}%, ${Ln(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function zi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Ln(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function _o(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const ur = (t) => () => t;
function Pc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Mc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Tc(t) {
  return (t = +t) == 1 ? fr : function(e, n) {
    return n - e ? Mc(e, n, t) : ur(isNaN(e) ? n : e);
  };
}
function fr(t, e) {
  var n = e - t;
  return n ? Pc(t, n) : ur(isNaN(t) ? e : t);
}
const zo = (function t(e) {
  var n = Tc(e);
  function o(i, r) {
    var s = n((i = Oo(i)).r, (r = Oo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = fr(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = a(d), i.b = l(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function lt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Vo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, bo = new RegExp(Vo.source, "g");
function Ac(t) {
  return function() {
    return t;
  };
}
function Nc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Ic(t, e) {
  var n = Vo.lastIndex = bo.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = Vo.exec(t)) && (i = bo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: lt(o, i) })), n = bo.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Nc(l[0].x) : Ac(e) : (e = l.length, function(c) {
    for (var d = 0, u; d < e; ++d) a[(u = l[d]).i] = u.x(c);
    return a.join("");
  });
}
var Vi = 180 / Math.PI, Bo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function hr(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Vi,
    skewX: Math.atan(l) * Vi,
    scaleX: s,
    scaleY: a
  };
}
var Pn;
function $c(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Bo : hr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Dc(t) {
  return t == null || (Pn || (Pn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Pn.setAttribute("transform", t), !(t = Pn.transform.baseVal.consolidate())) ? Bo : (t = t.matrix, hr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function gr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: lt(c, u) }, { i: p - 2, x: lt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: lt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function a(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: lt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function l(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push(i(h) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: lt(c, u) }, { i: p - 2, x: lt(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), a(c.skewX, d.skewX, u, f), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var g = -1, p = f.length, y; ++g < p; ) u[(y = f[g]).i] = y.x(h);
      return u.join("");
    };
  };
}
var Hc = gr($c, "px, ", "px)", "deg)"), Rc = gr(Dc, ", ", ")", ")"), Fc = 1e-12;
function Bi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Oc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function zc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Vc = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - a, g = u - l, p = h * h + g * g, y, m;
    if (p < Fc)
      m = Math.log(f / c) / e, y = function(P) {
        return [
          a + P * h,
          l + P * g,
          c * Math.exp(e * P * m)
        ];
      };
    else {
      var _ = Math.sqrt(p), E = (f * f - c * c + o * p) / (2 * c * n * _), b = (f * f - c * c - o * p) / (2 * f * n * _), x = Math.log(Math.sqrt(E * E + 1) - E), M = Math.log(Math.sqrt(b * b + 1) - b);
      m = (M - x) / e, y = function(P) {
        var A = P * m, $ = Bi(x), C = c / (n * _) * ($ * zc(e * A + x) - Oc(x));
        return [
          a + C * h,
          l + C * g,
          c * $ / Bi(e * A + x)
        ];
      };
    }
    return y.duration = m * 1e3 * e / Math.SQRT2, y;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return t(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var Vt = 0, on = 0, Kt = 0, pr = 1e3, Xn, sn, Yn = 0, kt = 0, fo = 0, gn = typeof performance == "object" && performance.now ? performance : Date, mr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ci() {
  return kt || (mr(Bc), kt = gn.now() + fo);
}
function Bc() {
  kt = 0;
}
function Wn() {
  this._call = this._time = this._next = null;
}
Wn.prototype = yr.prototype = {
  constructor: Wn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ci() : +n) + (e == null ? 0 : +e), !this._next && sn !== this && (sn ? sn._next = this : Xn = this, sn = this), this._call = t, this._time = n, qo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, qo());
  }
};
function yr(t, e, n) {
  var o = new Wn();
  return o.restart(t, e, n), o;
}
function qc() {
  ci(), ++Vt;
  for (var t = Xn, e; t; )
    (e = kt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Vt;
}
function qi() {
  kt = (Yn = gn.now()) + fo, Vt = on = 0;
  try {
    qc();
  } finally {
    Vt = 0, Yc(), kt = 0;
  }
}
function Xc() {
  var t = gn.now(), e = t - Yn;
  e > pr && (fo -= e, Yn = t);
}
function Yc() {
  for (var t, e = Xn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Xn = n);
  sn = t, qo(o);
}
function qo(t) {
  if (!Vt) {
    on && (on = clearTimeout(on));
    var e = t - kt;
    e > 24 ? (t < 1 / 0 && (on = setTimeout(qi, t - gn.now() - fo)), Kt && (Kt = clearInterval(Kt))) : (Kt || (Yn = gn.now(), Kt = setInterval(Xc, pr)), Vt = 1, mr(qi));
  }
}
function Xi(t, e, n) {
  var o = new Wn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Wc = co("start", "end", "cancel", "interrupt"), jc = [], wr = 0, Yi = 1, Xo = 2, Rn = 3, Wi = 4, Yo = 5, Fn = 6;
function ho(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Uc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Wc,
    tween: jc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: wr
  });
}
function di(t, e) {
  var n = We(t, e);
  if (n.state > wr) throw new Error("too late; already scheduled");
  return n;
}
function Ze(t, e) {
  var n = We(t, e);
  if (n.state > Rn) throw new Error("too late; already running");
  return n;
}
function We(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Uc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = yr(r, 0, n.time);
  function r(c) {
    n.state = Yi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Yi) return l();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === Rn) return Xi(s);
        h.state === Wi ? (h.state = Fn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Fn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (Xi(function() {
      n.state === Rn && (n.state = Wi, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Xo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Xo) {
      for (n.state = Rn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Yo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Yo && (n.on.call("end", t, t.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Fn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function On(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Xo && o.state < Yo, o.state = Fn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Zc(t) {
  return this.each(function() {
    On(this, t);
  });
}
function Gc(t, e) {
  var n, o;
  return function() {
    var i = Ze(this, t), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === e) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Kc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Ze(this, t), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: e, value: n }, l = 0, c = i.length; l < c; ++l)
        if (i[l].name === e) {
          i[l] = a;
          break;
        }
      l === c && i.push(a);
    }
    r.tween = i;
  };
}
function Jc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = We(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Gc : Kc)(n, t, e));
}
function ui(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ze(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return We(i, o).value[e];
  };
}
function vr(t, e) {
  var n;
  return (typeof e == "number" ? lt : e instanceof hn ? zo : (n = hn(e)) ? (e = n, zo) : Ic)(t, e);
}
function Qc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ed(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function td(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function nd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function od(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function id(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function sd(t, e) {
  var n = uo(t), o = n === "transform" ? Rc : vr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? id : od)(n, o, ui(this, "attr." + t, e)) : e == null ? (n.local ? ed : Qc)(n) : (n.local ? nd : td)(n, o, e));
}
function rd(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function ad(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function ld(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && ad(t, r)), n;
  }
  return i._value = e, i;
}
function cd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && rd(t, r)), n;
  }
  return i._value = e, i;
}
function dd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = uo(t);
  return this.tween(n, (o.local ? ld : cd)(o, e));
}
function ud(t, e) {
  return function() {
    di(this, t).delay = +e.apply(this, arguments);
  };
}
function fd(t, e) {
  return e = +e, function() {
    di(this, t).delay = e;
  };
}
function hd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ud : fd)(e, t)) : We(this.node(), e).delay;
}
function gd(t, e) {
  return function() {
    Ze(this, t).duration = +e.apply(this, arguments);
  };
}
function pd(t, e) {
  return e = +e, function() {
    Ze(this, t).duration = e;
  };
}
function md(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? gd : pd)(e, t)) : We(this.node(), e).duration;
}
function yd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ze(this, t).ease = e;
  };
}
function wd(t) {
  var e = this._id;
  return arguments.length ? this.each(yd(e, t)) : We(this.node(), e).ease;
}
function vd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ze(this, t).ease = n;
  };
}
function _d(t) {
  if (typeof t != "function") throw new Error();
  return this.each(vd(this._id, t));
}
function bd(t) {
  typeof t != "function" && (t = Ks(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new it(o, this._parents, this._name, this._id);
}
function xd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, u = s[a] = new Array(d), f, h = 0; h < d; ++h)
      (f = l[h] || c[h]) && (u[h] = f);
  for (; a < o; ++a)
    s[a] = e[a];
  return new it(s, this._parents, this._name, this._id);
}
function Ed(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Cd(t, e, n) {
  var o, i, r = Ed(e) ? di : Ze;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Sd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? We(this.node(), n).on.on(t) : this.each(Cd(n, t, e));
}
function kd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Ld() {
  return this.on("end.remove", kd(this._id));
}
function Pd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ri(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, u, f = 0; f < l; ++f)
      (d = a[f]) && (u = t.call(d, d.__data__, f, a)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, ho(c[f], e, n, f, c, We(d, n)));
  return new it(r, this._parents, e, n);
}
function Md(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Gs(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, u = 0; u < c; ++u)
      if (d = l[u]) {
        for (var f = t.call(d, d.__data__, u, l), h, g = We(d, n), p = 0, y = f.length; p < y; ++p)
          (h = f[p]) && ho(h, e, n, p, f, g);
        r.push(f), s.push(d);
      }
  return new it(r, s, e, n);
}
var Td = _n.prototype.constructor;
function Ad() {
  return new Td(this._groups, this._parents);
}
function Nd(t, e) {
  var n, o, i;
  return function() {
    var r = zt(this, t), s = (this.style.removeProperty(t), zt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function _r(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Id(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = zt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function $d(t, e, n) {
  var o, i, r;
  return function() {
    var s = zt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), zt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function Dd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Ze(this, t), c = l.on, d = l.value[r] == null ? a || (a = _r(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function Hd(t, e, n) {
  var o = (t += "") == "transform" ? Hc : vr;
  return e == null ? this.styleTween(t, Nd(t, o)).on("end.style." + t, _r(t)) : typeof e == "function" ? this.styleTween(t, $d(t, o, ui(this, "style." + t, e))).each(Dd(this._id, t)) : this.styleTween(t, Id(t, o, e), n).on("end.style." + t, null);
}
function Rd(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Fd(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Rd(t, s, n)), o;
  }
  return r._value = e, r;
}
function Od(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Fd(t, e, n ?? ""));
}
function zd(t) {
  return function() {
    this.textContent = t;
  };
}
function Vd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Bd(t) {
  return this.tween("text", typeof t == "function" ? Vd(ui(this, "text", t)) : zd(t == null ? "" : t + ""));
}
function qd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Xd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && qd(i)), e;
  }
  return o._value = t, o;
}
function Yd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Xd(t));
}
function Wd() {
  for (var t = this._name, e = this._id, n = br(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = We(l, e);
        ho(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new it(o, this._parents, t, n);
}
function jd() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Ze(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(l)), c.on = e;
    }), i === 0 && r();
  });
}
var Ud = 0;
function it(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function br() {
  return ++Ud;
}
var Ge = _n.prototype;
it.prototype = {
  constructor: it,
  select: Pd,
  selectAll: Md,
  selectChild: Ge.selectChild,
  selectChildren: Ge.selectChildren,
  filter: bd,
  merge: xd,
  selection: Ad,
  transition: Wd,
  call: Ge.call,
  nodes: Ge.nodes,
  node: Ge.node,
  size: Ge.size,
  empty: Ge.empty,
  each: Ge.each,
  on: Sd,
  attr: sd,
  attrTween: dd,
  style: Hd,
  styleTween: Od,
  text: Bd,
  textTween: Yd,
  remove: Ld,
  tween: Jc,
  delay: hd,
  duration: md,
  ease: wd,
  easeVarying: _d,
  end: jd,
  [Symbol.iterator]: Ge[Symbol.iterator]
};
const Zd = (t) => +t;
function Gd(t) {
  return t * t;
}
function Kd(t) {
  return t * (2 - t);
}
function Jd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Qd(t) {
  return t * t * t;
}
function eu(t) {
  return --t * t * t + 1;
}
function xr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Er = Math.PI, Cr = Er / 2;
function tu(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * Cr);
}
function nu(t) {
  return Math.sin(t * Cr);
}
function ou(t) {
  return (1 - Math.cos(Er * t)) / 2;
}
function yt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function iu(t) {
  return yt(1 - +t);
}
function su(t) {
  return 1 - yt(t);
}
function ru(t) {
  return ((t *= 2) <= 1 ? yt(1 - t) : 2 - yt(t - 1)) / 2;
}
function au(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function lu(t) {
  return Math.sqrt(1 - --t * t);
}
function cu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Wo = 4 / 11, du = 6 / 11, uu = 8 / 11, fu = 3 / 4, hu = 9 / 11, gu = 10 / 11, pu = 15 / 16, mu = 21 / 22, yu = 63 / 64, Mn = 1 / Wo / Wo;
function wu(t) {
  return 1 - jn(1 - t);
}
function jn(t) {
  return (t = +t) < Wo ? Mn * t * t : t < uu ? Mn * (t -= du) * t + fu : t < gu ? Mn * (t -= hu) * t + pu : Mn * (t -= mu) * t + yu;
}
function vu(t) {
  return ((t *= 2) <= 1 ? 1 - jn(1 - t) : jn(t - 1) + 1) / 2;
}
var fi = 1.70158, _u = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(fi), bu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(fi), xu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(fi), Bt = 2 * Math.PI, hi = 1, gi = 0.3, Eu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return e * yt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(hi, gi), Cu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return 1 - e * yt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(hi, gi), Su = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Bt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * yt(-r) * Math.sin((o - r) / n) : 2 - e * yt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Bt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(hi, gi), ku = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: xr
};
function Lu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Pu(t) {
  var e, n;
  t instanceof it ? (e = t._id, t = t._name) : (e = br(), (n = ku).time = ci(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && ho(l, t, e, c, s, n || Lu(l, e));
  return new it(o, this._parents, t, e);
}
_n.prototype.interrupt = Zc;
_n.prototype.transition = Pu;
const Tn = (t) => () => t;
function Mu(t, {
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
function xo(t) {
  t.stopImmediatePropagation();
}
function Jt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Tu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Au() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function ji() {
  return this.__zoom || Un;
}
function Nu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Iu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function $u(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Du() {
  var t = Tu, e = Au, n = $u, o = Nu, i = Iu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Vc, c = co("start", "zoom", "end"), d, u, f, h = 500, g = 150, p = 0, y = 10;
  function m(w) {
    w.property("__zoom", ji).on("wheel.zoom", A, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", C).filter(i).on("touchstart.zoom", T).on("touchmove.zoom", S).on("touchend.zoom touchcancel.zoom", v).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(w, I, k, R) {
    var O = w.selection ? w.selection() : w;
    O.property("__zoom", ji), w !== O ? x(w, I, k, R) : O.interrupt().each(function() {
      M(this, arguments).event(R).start().zoom(null, typeof I == "function" ? I.apply(this, arguments) : I).end();
    });
  }, m.scaleBy = function(w, I, k, R) {
    m.scaleTo(w, function() {
      var O = this.__zoom.k, Y = typeof I == "function" ? I.apply(this, arguments) : I;
      return O * Y;
    }, k, R);
  }, m.scaleTo = function(w, I, k, R) {
    m.transform(w, function() {
      var O = e.apply(this, arguments), Y = this.__zoom, D = k == null ? b(O) : typeof k == "function" ? k.apply(this, arguments) : k, L = Y.invert(D), N = typeof I == "function" ? I.apply(this, arguments) : I;
      return n(E(_(Y, N), D, L), O, s);
    }, k, R);
  }, m.translateBy = function(w, I, k, R) {
    m.transform(w, function() {
      return n(this.__zoom.translate(
        typeof I == "function" ? I.apply(this, arguments) : I,
        typeof k == "function" ? k.apply(this, arguments) : k
      ), e.apply(this, arguments), s);
    }, null, R);
  }, m.translateTo = function(w, I, k, R, O) {
    m.transform(w, function() {
      var Y = e.apply(this, arguments), D = this.__zoom, L = R == null ? b(Y) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Un.translate(L[0], L[1]).scale(D.k).translate(
        typeof I == "function" ? -I.apply(this, arguments) : -I,
        typeof k == "function" ? -k.apply(this, arguments) : -k
      ), Y, s);
    }, R, O);
  };
  function _(w, I) {
    return I = Math.max(r[0], Math.min(r[1], I)), I === w.k ? w : new Je(I, w.x, w.y);
  }
  function E(w, I, k) {
    var R = I[0] - k[0] * w.k, O = I[1] - k[1] * w.k;
    return R === w.x && O === w.y ? w : new Je(w.k, R, O);
  }
  function b(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function x(w, I, k, R) {
    w.on("start.zoom", function() {
      M(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      M(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var O = this, Y = arguments, D = M(O, Y).event(R), L = e.apply(O, Y), N = k == null ? b(L) : typeof k == "function" ? k.apply(O, Y) : k, F = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), J = O.__zoom, oe = typeof I == "function" ? I.apply(O, Y) : I, G = l(J.invert(N).concat(F / J.k), oe.invert(N).concat(F / oe.k));
      return function(q) {
        if (q === 1) q = oe;
        else {
          var z = G(q), X = F / z[2];
          q = new Je(X, N[0] - z[0] * X, N[1] - z[1] * X);
        }
        D.zoom(null, q);
      };
    });
  }
  function M(w, I, k) {
    return !k && w.__zooming || new P(w, I);
  }
  function P(w, I) {
    this.that = w, this.args = I, this.active = 0, this.sourceEvent = null, this.extent = e.apply(w, I), this.taps = 0;
  }
  P.prototype = {
    event: function(w) {
      return w && (this.sourceEvent = w), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(w, I) {
      return this.mouse && w !== "mouse" && (this.mouse[1] = I.invert(this.mouse[0])), this.touch0 && w !== "touch" && (this.touch0[1] = I.invert(this.touch0[0])), this.touch1 && w !== "touch" && (this.touch1[1] = I.invert(this.touch1[0])), this.that.__zoom = I, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(w) {
      var I = qe(this.that).datum();
      c.call(
        w,
        this.that,
        new Mu(w, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        I
      );
    }
  };
  function A(w, ...I) {
    if (!t.apply(this, arguments)) return;
    var k = M(this, I).event(w), R = this.__zoom, O = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), Y = Ke(w);
    if (k.wheel)
      (k.mouse[0][0] !== Y[0] || k.mouse[0][1] !== Y[1]) && (k.mouse[1] = R.invert(k.mouse[0] = Y)), clearTimeout(k.wheel);
    else {
      if (R.k === O) return;
      k.mouse = [Y, R.invert(Y)], On(this), k.start();
    }
    Jt(w), k.wheel = setTimeout(D, g), k.zoom("mouse", n(E(_(R, O), k.mouse[0], k.mouse[1]), k.extent, s));
    function D() {
      k.wheel = null, k.end();
    }
  }
  function $(w, ...I) {
    if (f || !t.apply(this, arguments)) return;
    var k = w.currentTarget, R = M(this, I, !0).event(w), O = qe(w.view).on("mousemove.zoom", N, !0).on("mouseup.zoom", F, !0), Y = Ke(w, k), D = w.clientX, L = w.clientY;
    ar(w.view), xo(w), R.mouse = [Y, this.__zoom.invert(Y)], On(this), R.start();
    function N(J) {
      if (Jt(J), !R.moved) {
        var oe = J.clientX - D, G = J.clientY - L;
        R.moved = oe * oe + G * G > p;
      }
      R.event(J).zoom("mouse", n(E(R.that.__zoom, R.mouse[0] = Ke(J, k), R.mouse[1]), R.extent, s));
    }
    function F(J) {
      O.on("mousemove.zoom mouseup.zoom", null), lr(J.view, R.moved), Jt(J), R.event(J).end();
    }
  }
  function C(w, ...I) {
    if (t.apply(this, arguments)) {
      var k = this.__zoom, R = Ke(w.changedTouches ? w.changedTouches[0] : w, this), O = k.invert(R), Y = k.k * (w.shiftKey ? 0.5 : 2), D = n(E(_(k, Y), R, O), e.apply(this, I), s);
      Jt(w), a > 0 ? qe(this).transition().duration(a).call(x, D, R, w) : qe(this).call(m.transform, D, R, w);
    }
  }
  function T(w, ...I) {
    if (t.apply(this, arguments)) {
      var k = w.touches, R = k.length, O = M(this, I, w.changedTouches.length === R).event(w), Y, D, L, N;
      for (xo(w), D = 0; D < R; ++D)
        L = k[D], N = Ke(L, this), N = [N, this.__zoom.invert(N), L.identifier], O.touch0 ? !O.touch1 && O.touch0[2] !== N[2] && (O.touch1 = N, O.taps = 0) : (O.touch0 = N, Y = !0, O.taps = 1 + !!d);
      d && (d = clearTimeout(d)), Y && (O.taps < 2 && (u = N[0], d = setTimeout(function() {
        d = null;
      }, h)), On(this), O.start());
    }
  }
  function S(w, ...I) {
    if (this.__zooming) {
      var k = M(this, I).event(w), R = w.changedTouches, O = R.length, Y, D, L, N;
      for (Jt(w), Y = 0; Y < O; ++Y)
        D = R[Y], L = Ke(D, this), k.touch0 && k.touch0[2] === D.identifier ? k.touch0[0] = L : k.touch1 && k.touch1[2] === D.identifier && (k.touch1[0] = L);
      if (D = k.that.__zoom, k.touch1) {
        var F = k.touch0[0], J = k.touch0[1], oe = k.touch1[0], G = k.touch1[1], q = (q = oe[0] - F[0]) * q + (q = oe[1] - F[1]) * q, z = (z = G[0] - J[0]) * z + (z = G[1] - J[1]) * z;
        D = _(D, Math.sqrt(q / z)), L = [(F[0] + oe[0]) / 2, (F[1] + oe[1]) / 2], N = [(J[0] + G[0]) / 2, (J[1] + G[1]) / 2];
      } else if (k.touch0) L = k.touch0[0], N = k.touch0[1];
      else return;
      k.zoom("touch", n(E(D, L, N), k.extent, s));
    }
  }
  function v(w, ...I) {
    if (this.__zooming) {
      var k = M(this, I).event(w), R = w.changedTouches, O = R.length, Y, D;
      for (xo(w), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), Y = 0; Y < O; ++Y)
        D = R[Y], k.touch0 && k.touch0[2] === D.identifier ? delete k.touch0 : k.touch1 && k.touch1[2] === D.identifier && delete k.touch1;
      if (k.touch1 && !k.touch0 && (k.touch0 = k.touch1, delete k.touch1), k.touch0) k.touch0[1] = this.__zoom.invert(k.touch0[0]);
      else if (k.end(), k.taps === 2 && (D = Ke(D, this), Math.hypot(u[0] - D[0], u[1] - D[1]) < y)) {
        var L = qe(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : Tn(+w), m) : o;
  }, m.filter = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : Tn(!!w), m) : t;
  }, m.touchable = function(w) {
    return arguments.length ? (i = typeof w == "function" ? w : Tn(!!w), m) : i;
  }, m.extent = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : Tn([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), m) : e;
  }, m.scaleExtent = function(w) {
    return arguments.length ? (r[0] = +w[0], r[1] = +w[1], m) : [r[0], r[1]];
  }, m.translateExtent = function(w) {
    return arguments.length ? (s[0][0] = +w[0][0], s[1][0] = +w[1][0], s[0][1] = +w[0][1], s[1][1] = +w[1][1], m) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, m.constrain = function(w) {
    return arguments.length ? (n = w, m) : n;
  }, m.duration = function(w) {
    return arguments.length ? (a = +w, m) : a;
  }, m.interpolate = function(w) {
    return arguments.length ? (l = w, m) : l;
  }, m.on = function() {
    var w = c.on.apply(c, arguments);
    return w === c ? m : w;
  }, m.clickDistance = function(w) {
    return arguments.length ? (p = (w = +w) * w, m) : Math.sqrt(p);
  }, m.tapDistance = function(w) {
    return arguments.length ? (y = +w, m) : y;
  }, m;
}
function Ui(t) {
  const { pannable: e, zoomable: n, isLocked: o, noPanClassName: i, noWheelClassName: r, isTouchSelectionMode: s, isPanKeyHeld: a, panOnDrag: l } = t;
  return (c) => {
    if (o?.() || i && c.target?.closest?.("." + i) || c.type === "wheel" && r && c.target?.closest?.("." + r) || !n && c.type === "wheel") return !1;
    if (c.type === "touchstart") {
      const d = !c.touches || c.touches.length < 2;
      if (s?.() && d || !e && !a?.() && d || !n && !d) return !1;
    }
    if (c.type === "mousedown") {
      if (a?.()) return !0;
      if (!e) return !1;
      if (Array.isArray(l))
        return l.includes(c.button);
      if (l === !1) return !1;
    }
    return !0;
  };
}
function Hu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = qe(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (P) => {
    c && P.code === c && (l = !0, t.style.cursor = "grab");
  }, u = (P) => {
    c && P.code === c && (l = !1, t.style.cursor = "");
  }, f = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Du().scaleExtent([o, i]).on("start", (P) => {
    if (!P.sourceEvent) return;
    l && (t.style.cursor = "grabbing");
    const { x: A, y: $, k: C } = P.transform;
    e.onMoveStart?.({ x: A, y: $, zoom: C });
  }).on("zoom", (P) => {
    const { x: A, y: $, k: C } = P.transform;
    n({ x: A, y: $, zoom: C }), P.sourceEvent && e.onMove?.({ x: A, y: $, zoom: C });
  }).on("end", (P) => {
    if (!P.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: A, y: $, k: C } = P.transform;
    e.onMoveEnd?.({ x: A, y: $, zoom: C });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Ui({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => l,
    panOnDrag: e.panOnDrag
  })), a.call(h), e.zoomOnDoubleClick === !1 && a.on("dblclick.zoom", null);
  let g = e.panOnScroll ?? !1, p = e.panOnScrollDirection ?? "both", y = e.panOnScrollSpeed ?? 1, m = !1;
  const _ = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, E = (P) => {
    _ && P.code === _ && (m = !0);
  }, b = (P) => {
    _ && P.code === _ && (m = !1);
  }, x = () => {
    m = !1;
  };
  _ && (window.addEventListener("keydown", E), window.addEventListener("keyup", b), window.addEventListener("blur", x));
  const M = (P) => {
    if (e.isLocked?.()) return;
    const A = P.ctrlKey || P.metaKey || m;
    if (!(g ? !A : P.shiftKey)) return;
    P.preventDefault(), P.stopPropagation();
    const C = y;
    let T = 0, S = 0;
    p !== "horizontal" && (S = -P.deltaY * C), p !== "vertical" && (T = -P.deltaX * C, P.shiftKey && P.deltaX === 0 && p === "both" && (T = -P.deltaY * C, S = 0)), e.onScrollPan?.(T, S);
  };
  return t.addEventListener("wheel", M, { passive: !1, capture: !0 }), {
    setViewport(P, A) {
      const $ = A?.duration ?? 0, C = Un.translate(P.x ?? 0, P.y ?? 0).scale(P.zoom ?? 1);
      $ > 0 ? a.transition().duration($).call(h.transform, C) : a.call(h.transform, C);
    },
    getTransform() {
      return t.__zoom ?? Un;
    },
    update(P) {
      if ((P.minZoom !== void 0 || P.maxZoom !== void 0) && h.scaleExtent([
        P.minZoom ?? o,
        P.maxZoom ?? i
      ]), P.pannable !== void 0 || P.zoomable !== void 0) {
        const A = P.pannable ?? r, $ = P.zoomable ?? s;
        h.filter(Ui({
          pannable: A,
          zoomable: $,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => l,
          panOnDrag: e.panOnDrag
        }));
      }
      P.panOnScroll !== void 0 && (g = P.panOnScroll), P.panOnScrollDirection !== void 0 && (p = P.panOnScrollDirection), P.panOnScrollSpeed !== void 0 && (y = P.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", M, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), _ && (window.removeEventListener("keydown", E), window.removeEventListener("keyup", b), window.removeEventListener("blur", x)), a.on(".zoom", null);
    }
  };
}
function Sr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Ru(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ve = 150, _e = 50;
function go(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - l / 2, y: u - c / 2, width: l, height: c };
}
function qt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? ve, l = s.dimensions?.height ?? _e, c = Ut(s, e), d = s.rotation ? go(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Fu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, a = r.dimensions?.height ?? _e, l = Ut(r, n), c = r.rotation ? go(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Ou(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, a = r.dimensions?.height ?? _e, l = Ut(r, n), c = r.rotation ? go(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Zn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + a / 2 }, g = e / 2 - h.x * f, p = n / 2 - h.y * f;
  return { x: g, y: p, zoom: f };
}
function zu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class Vu {
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
    const { minCX: s, minCY: a, maxCX: l, maxCY: c } = this._getCellRange(n, o, i, r), d = [];
    for (let u = s; u <= l; u++)
      for (let f = a; f <= c; f++) {
        const h = this._cellKey(u, f);
        d.push(h);
        let g = this._cells.get(h);
        g || (g = /* @__PURE__ */ new Set(), this._cells.set(h, g)), g.add(e);
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
    for (let a = n; a <= i; a++)
      for (let l = o; l <= r; l++) {
        const c = this._cells.get(this._cellKey(a, l));
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
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? ve, i = t.dimensions?.height ?? _e;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let kr = !1;
function Lr(t) {
  kr = t;
}
function B(t, e, n) {
  if (!kr) return;
  const o = `%c[AlpineFlow:${t}]`, i = Bu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Bu(t) {
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
const pn = "#64748b", pi = "#d4d4d8", Pr = "#ef4444", qu = "2", Xu = "6 3", Zi = 1.2, jo = 0.2, Gn = 5, Gi = 25;
class Yu {
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
const Wu = 16;
function ju() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Wu),
    cancel: (t) => clearTimeout(t)
  };
}
class Mr {
  constructor() {
    this._scheduler = ju(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Kn = new Mr(), Uu = {
  linear: Zd,
  easeIn: Gd,
  easeOut: Kd,
  easeInOut: Jd,
  easeCubicIn: Qd,
  easeCubicOut: eu,
  easeCubicInOut: xr,
  easeCircIn: au,
  easeCircOut: lu,
  easeCircInOut: cu,
  easeSinIn: tu,
  easeSinOut: nu,
  easeSinInOut: ou,
  easeExpoIn: iu,
  easeExpoOut: su,
  easeExpoInOut: ru,
  easeBounce: jn,
  easeBounceIn: wu,
  easeBounceInOut: vu,
  easeElastic: Cu,
  easeElasticIn: Eu,
  easeElasticInOut: Su,
  easeBack: xu,
  easeBackIn: _u,
  easeBackOut: bu
};
function Tr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Jn(t) {
  return typeof t == "function" ? t : Uu[t ?? "easeInOut"];
}
function nt(t, e, n) {
  return t + (e - t) * n;
}
function mi(t, e, n) {
  return zo(t, e)(n);
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
const Ki = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Ji = /^(#|rgb|hsl)/;
function Ar(t, e, n) {
  const o = {}, i = /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(e)]);
  for (const r of i) {
    const s = t[r], a = e[r];
    if (s === void 0) {
      o[r] = a;
      continue;
    }
    if (a === void 0) {
      o[r] = s;
      continue;
    }
    const l = Ki.exec(s), c = Ki.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = nt(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (Ji.test(s) && Ji.test(a)) {
      o[r] = mi(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function Zu(t, e, n, o) {
  let i = nt(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: nt(t.x, e.x, n),
    y: nt(t.y, e.y, n),
    zoom: i
  };
}
class Gu {
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
class Ku {
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
const Qt = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Nr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Qt.stiffness, i = e.damping ?? Qt.damping, r = e.mass ?? Qt.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Qt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Qt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Qi = {
  timeConstant: 350,
  restVelocity: 0.5
};
function yi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Qi.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Qi.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function wi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Ir(t, e, n, o) {
  if (n <= 0)
    return;
  yi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? wi(o) : null;
  if (e.bounds && o) {
    const r = e.bounds[o] ?? (i ? e.bounds[i] : void 0);
    if (r) {
      const [s, a] = r, l = (e.bounceStiffness ?? 200) / 500, c = (e.bounceDamping ?? 40) / 100, d = l * (1 - c);
      t.value < s ? (t.value = s, t.velocity = Math.abs(t.velocity) * d, t.settled = !1) : t.value > a && (t.value = a, t.velocity = -Math.abs(t.velocity) * d, t.settled = !1);
    }
  }
  if (t.settled && e.snapTo?.length && o) {
    let r = t.value, s = 1 / 0;
    for (const a of e.snapTo) {
      const l = a[o] ?? (i ? a[i] : void 0);
      if (l !== void 0) {
        const c = Math.abs(t.value - l);
        c < s && (s = c, r = l);
      }
    }
    t.value = r;
  }
}
function $r(t, e, n, o) {
  const i = wi(o), r = e.values.map(
    (g) => g[o] ?? (i ? g[i] : void 0) ?? t.value
  );
  if (r.length < 2) {
    t.value = r[0] ?? t.value, t.settled = !0;
    return;
  }
  const s = e.offsets ?? r.map((g, p) => p / (r.length - 1)), a = Math.max(0, Math.min(1, n));
  let l = 0;
  for (let g = 0; g < s.length - 1; g++)
    a >= s[g] && (l = g);
  const c = s[l], d = s[l + 1] ?? 1, u = d > c ? (a - c) / (d - c) : 1, f = r[l], h = r[l + 1] ?? r[l];
  t.value = f + (h - f) * Math.max(0, Math.min(1, u)), a >= 1 && (t.value = r[r.length - 1], t.settled = !0);
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
function Dr(t) {
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
function Ju(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? nt(t, e, n) : os(t) && os(e) ? mi(t, e, n) : n < 0.5 ? t : e;
}
class Qu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Gu(), this._activeTransaction = null, this._engine = e;
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
    const e = new Ku();
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
      startAt: a,
      onStart: l,
      onProgress: c,
      onComplete: d,
      tag: u,
      tags: f,
      while: h,
      whileStopMode: g = "jump-end",
      motion: p,
      maxDuration: y = 5e3
    } = n, m = Jn(i), _ = p ? Dr(p) : void 0;
    for (const w of e) {
      const I = this._ownership.get(w.key);
      if (I && !I.stopped) {
        const k = I.currentValues.get(w.key);
        k !== void 0 && (w.from = k), I.entries = I.entries.filter((R) => R.key !== w.key), I.entries.length === 0 && this._stop(I, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const w of e)
        this._activeTransaction.captureProperty(w.key, w.from, w.apply);
    if (o <= 0) {
      const w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (const O of e)
        w.set(O.key, O.from), I.set(O.key, O.to);
      l?.();
      for (const O of e)
        O.apply(O.to);
      const k = [...u ? [u] : [], ...f ?? []], R = {
        _tags: k.length > 0 ? k : void 0,
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
          return w;
        },
        get _target() {
          return I;
        }
      };
      return this._registry.register(R), queueMicrotask(() => this._registry.unregister(R)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(R), d?.(), R;
    }
    const E = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
    for (const w of e)
      E.set(w.key, w.from), b.set(w.key, w.to);
    let x;
    if (_) {
      x = /* @__PURE__ */ new Map();
      for (const w of e) {
        if (typeof w.from != "number" || typeof w.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${w.key}" is non-numeric; snapping to target.`
          ), w.apply(w.to);
          continue;
        }
        let I = 0;
        if (_.type === "decay" || _.type === "inertia") {
          const k = _.velocity;
          if (typeof k == "number")
            I = k;
          else if (k && typeof k == "object") {
            const O = k, Y = wi(w.key);
            I = O[w.key] ?? (Y ? O[Y] ?? 0 : 0);
          }
          const R = _.power ?? 0.8;
          I *= R;
        }
        x.set(w.key, {
          value: w.from,
          velocity: I,
          target: w.to,
          settled: !1
        });
      }
      x.size === 0 && (x = void 0);
    }
    const M = s === "ping-pong" ? "reverse" : s, P = a === "end" ? "backward" : "forward";
    let A;
    const $ = new Promise((w) => {
      A = w;
    }), C = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: P,
      duration: o,
      easingFn: m,
      loop: M,
      onStart: l,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: A,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      _lastTickWallTime: 0,
      snapshot: E,
      target: b,
      _currentFinished: $,
      whilePredicate: h,
      whileStopMode: g,
      motionConfig: x ? _ : void 0,
      physicsStates: x,
      maxDuration: y,
      isPhysics: !!x,
      _prevElapsed: 0
    };
    if (a === "end")
      for (const w of C.entries)
        w.apply(w.to), C.currentValues.set(w.key, w.to);
    else
      for (const w of C.entries)
        C.currentValues.set(w.key, w.from);
    for (const w of e)
      this._ownership.set(w.key, C);
    this._groups.add(C);
    const T = this._engine.register((w) => this._tick(C, w), r);
    C.engineHandle = T;
    const S = [...u ? [u] : [], ...f ?? []], v = {
      _tags: S.length > 0 ? S : void 0,
      pause: () => this._pause(C),
      resume: () => this._resume(C),
      stop: (w) => this._stop(C, w?.mode ?? "jump-end"),
      reverse: () => this._reverse(C),
      play: () => this._play(C),
      playForward: () => this._playDirection(C, "forward"),
      playBackward: () => this._playDirection(C, "backward"),
      restart: (w) => this._restart(C, w),
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
    return this._registry.register(v), C._handle = v, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(v), v;
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
        const a = o / e.duration, l = Math.floor(a), c = a - l;
        i = l % 2 === 0 ? c : 1 - c;
      } else
        i = o % e.duration / e.duration;
    const r = e.direction === "backward" ? 1 - i : i, s = e.easingFn(r);
    for (const a of e.entries) {
      const l = Ju(a.from, a.to, s);
      e.currentValues.set(a.key, l), a.apply(l);
    }
    if (e.onProgress?.(r), !e.loop && i >= 1) {
      for (const a of e.entries) {
        const l = e.direction === "backward" ? a.from : a.to;
        a.apply(l), e.currentValues.set(a.key, l);
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
              Nr(d, e.motionConfig, i);
              break;
            case "decay":
              yi(d, e.motionConfig, i);
              break;
            case "inertia":
              Ir(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              $r(d, e.motionConfig, h, c.key);
              break;
            }
          }
          e.currentValues.set(c.key, d.value), c.apply(d.value);
        }
        d.settled || (s = !1);
      }
    }
    const a = n - e.startTime, l = Math.min(a / e.maxDuration, 1);
    if (e.onProgress?.(l), a >= e.maxDuration) {
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
const Hr = /* @__PURE__ */ new Map();
function ef(t, e) {
  Hr.set(t, e);
}
function Eo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ft(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Ot(t, e) {
  return `${e}__${t.type}__${(t.color ?? pi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Qn(t, e) {
  const n = Eo(t.color ?? pi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = Eo(t.orient ?? "auto-start-reverse"), l = Eo(e);
  if (t.type === "arrow")
    return `<marker
      id="${l}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${a}"
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
      id="${l}"
      viewBox="-10 -10 20 20"
      markerWidth="${r}"
      markerHeight="${s}"
      orient="${a}"
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
  const c = Hr.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : Qn({ ...t, type: "arrowclosed" }, e);
}
const vt = 200, _t = 150, tf = 1.2, en = "http://www.w3.org/2000/svg";
function nf(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor, l = document.createElement("div");
  l.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(en, "svg");
  c.setAttribute("width", String(vt)), c.setAttribute("height", String(_t));
  const d = document.createElementNS(en, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(vt)), d.setAttribute("height", String(_t));
  const u = document.createElementNS(en, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(en, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), l.appendChild(c), t.appendChild(l);
  let h = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const T = n();
    if (h = qt(T.nodes.filter((S) => !S.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      h.width / vt,
      h.height / _t
    ) * tf;
  }
  function y(T) {
    return typeof a == "function" ? a(T) : a;
  }
  function m() {
    const T = n();
    p(), u.innerHTML = "";
    const S = (vt - h.width / g) / 2, v = (_t - h.height / g) / 2;
    for (const w of T.nodes) {
      if (w.hidden) continue;
      const I = document.createElementNS(en, "rect"), k = (w.dimensions?.width ?? ve) / g, R = (w.dimensions?.height ?? _e) / g, O = (w.position.x - h.x) / g + S, Y = (w.position.y - h.y) / g + v;
      I.setAttribute("x", String(O)), I.setAttribute("y", String(Y)), I.setAttribute("width", String(k)), I.setAttribute("height", String(R)), I.setAttribute("rx", "2");
      const D = y(w);
      D && (I.style.fill = D), u.appendChild(I);
    }
    _();
  }
  function _() {
    const T = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const S = (vt - h.width / g) / 2, v = (_t - h.height / g) / 2, w = (-T.viewport.x / T.viewport.zoom - h.x) / g + S, I = (-T.viewport.y / T.viewport.zoom - h.y) / g + v, k = T.containerWidth / T.viewport.zoom / g, R = T.containerHeight / T.viewport.zoom / g, O = `M0,0 H${vt} V${_t} H0 Z`, Y = `M${w},${I} h${k} v${R} h${-k} Z`;
    f.setAttribute("d", `${O} ${Y}`);
  }
  let E = !1;
  function b(T, S) {
    const v = (vt - h.width / g) / 2, w = (_t - h.height / g) / 2, I = (T - v) * g + h.x, k = (S - w) * g + h.y;
    return { x: I, y: k };
  }
  function x(T) {
    const S = c.getBoundingClientRect(), v = T.clientX - S.left, w = T.clientY - S.top, I = n(), k = b(v, w), R = -k.x * I.viewport.zoom + I.containerWidth / 2, O = -k.y * I.viewport.zoom + I.containerHeight / 2;
    o({ x: R, y: O, zoom: I.viewport.zoom });
  }
  function M(T) {
    i.minimapPannable && (E = !0, c.setPointerCapture(T.pointerId), x(T));
  }
  function P(T) {
    E && x(T);
  }
  function A(T) {
    E && (E = !1, c.releasePointerCapture(T.pointerId));
  }
  c.addEventListener("pointerdown", M), c.addEventListener("pointermove", P), c.addEventListener("pointerup", A);
  function $(T) {
    if (!i.minimapZoomable)
      return;
    T.preventDefault();
    const S = n(), v = i.minZoom ?? 0.5, w = i.maxZoom ?? 2, I = T.deltaY > 0 ? 0.9 : 1.1, k = Math.min(Math.max(S.viewport.zoom * I, v), w);
    o({ zoom: k });
  }
  c.addEventListener("wheel", $, { passive: !1 });
  function C() {
    c.removeEventListener("pointerdown", M), c.removeEventListener("pointermove", P), c.removeEventListener("pointerup", A), c.removeEventListener("wheel", $), l.remove();
  }
  return { render: m, updateViewport: _, destroy: C };
}
const of = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', sf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', rf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', is = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', af = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', lf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ss = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', cf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function df(t, e) {
  const {
    position: n,
    orientation: o,
    showZoom: i,
    showFitView: r,
    showInteractive: s,
    showResetPanels: a,
    external: l,
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
  l ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), p.className = y.join(" "), p.setAttribute("role", "toolbar"), p.setAttribute("aria-label", "Flow controls");
  let m = null, _ = null;
  if (i) {
    const x = Mt(of, "Zoom in", c), M = Mt(sf, "Zoom out", d);
    p.appendChild(x), p.appendChild(M);
  }
  if (r) {
    const x = Mt(rf, "Fit view", u);
    p.appendChild(x);
  }
  if (s && (m = Mt(is, "Toggle interactivity", f), p.appendChild(m)), a) {
    const x = Mt(lf, "Reset panels", h);
    p.appendChild(x);
  }
  g && (_ = Mt(ss, "Toggle fullscreen", g), _.classList.add("flow-controls-button-fullscreen"), p.appendChild(_)), p.addEventListener("mousedown", (x) => x.stopPropagation()), p.addEventListener("pointerdown", (x) => x.stopPropagation()), p.addEventListener("wheel", (x) => x.stopPropagation(), { passive: !1 }), t.appendChild(p);
  function E(x) {
    if (m && typeof x.isInteractive == "boolean") {
      Uo(m, x.isInteractive ? is : af);
      const M = x.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = M, m.setAttribute("aria-label", M);
    }
    if (_ && typeof x.isFullscreen == "boolean") {
      Uo(_, x.isFullscreen ? cf : ss);
      const M = x.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      _.title = M, _.setAttribute("aria-label", M), _.classList.toggle("flow-controls-button-fullscreen--active", x.isFullscreen);
    }
  }
  function b() {
    p.remove();
  }
  return { update: E, destroy: b };
}
function Mt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Uo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Uo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const rs = 5;
function uf(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function a(f, h, g = "partial") {
    o = f, i = h, r = f, s = h, n = !0, e.style.left = `${f}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${g}`);
  }
  function l(f, h) {
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
    const p = Math.min(o, r), y = Math.min(i, s), m = (p - f.x) / f.zoom, _ = (y - f.y) / f.zoom, E = h / f.zoom, b = g / f.zoom;
    return { x: m, y: _, width: E, height: b };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: u };
}
const as = 3;
function ff(t) {
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
  function a(d) {
    if (!o || (o = !1, e.classList.remove("flow-lasso-active", "flow-lasso-partial", "flow-lasso-full"), n.setAttribute("points", ""), i.length < 3))
      return null;
    const u = i.map((f) => ({
      x: (f.x - d.x) / d.zoom,
      y: (f.y - d.y) / d.zoom
    }));
    return i = [], u;
  }
  function l() {
    return o;
  }
  function c() {
    e.remove();
  }
  return { start: r, update: s, end: a, isActive: l, destroy: c };
}
function vi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function hf(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, u = a - r, f = l * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, g = r - e, p = (h * u - g * d) / f, y = (h * c - g * l) / f;
  return p >= 0 && p <= 1 && y >= 0 && y <= 1;
}
function gf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (vi(s, a, t)) return !0;
  for (const c of t)
    if (c.x >= n && c.x <= i && c.y >= o && c.y <= r) return !0;
  const l = [
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
    for (const [u, f, h, g] of l)
      if (hf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, g))
        return !0;
  return !1;
}
function Rr(t) {
  const e = t.dimensions?.width ?? ve, n = t.dimensions?.height ?? _e;
  return t.rotation ? go(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function pf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Rr(n);
    return gf(e, o);
  });
}
function mf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Rr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => vi(r.x, r.y, e));
  });
}
function yf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Zo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function wf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function vf(t, e, n) {
  if (t === e) return !0;
  const o = /* @__PURE__ */ new Map();
  for (const s of n) {
    let a = o.get(s.source);
    a || (a = [], o.set(s.source, a)), a.push(s.target);
  }
  const i = [e], r = /* @__PURE__ */ new Set();
  for (; i.length > 0; ) {
    const s = i.pop();
    if (s === t) return !0;
    if (r.has(s)) continue;
    r.add(s);
    const a = o.get(s);
    if (a)
      for (const l of a)
        r.has(l) || i.push(l);
  }
  return !1;
}
function _f(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function bf(t, e, n) {
  const o = new Map(e.map((l) => [l.id, l])), i = new Set(
    n.map((l) => `${l.source}|${l.target}|${l.sourceHandle ?? ""}|${l.targetHandle ?? ""}`)
  ), r = [], s = /* @__PURE__ */ new Set();
  let a = 0;
  for (const l of t) {
    if (o.get(l)?.reconnectOnDelete === !1) continue;
    const d = n.filter(
      (f) => f.target === l && !t.has(f.source)
    ), u = n.filter(
      (f) => f.source === l && !t.has(f.target)
    );
    if (!(d.length === 0 || u.length === 0))
      for (const f of d)
        for (const h of u) {
          if (f.source === h.target) continue;
          const g = `${f.source}|${h.target}|${f.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(g) || s.has(g)) continue;
          const p = {
            id: `reconnect-${f.source}-${h.target}-${a++}`,
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
function ft(t, e, n) {
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
function ht(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && vf(t.source, t.target, e));
}
const Ye = "_flowHandleValidate";
function xf(t) {
  t.directive(
    "flow-handle-validate",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      function s() {
        let a;
        try {
          a = o(n);
        } catch {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (a = l[n]);
        }
        typeof a == "function" ? e[Ye] = a : (delete e[Ye], requestAnimationFrame(() => {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (e[Ye] = l[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[Ye];
      });
    }
  );
}
const ct = "_flowHandleLimit";
function Ef(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[ct] = s : delete e[ct];
      }), r(() => {
        delete e[ct];
      });
    }
  );
}
const Lt = "_flowHandleConnectableStart", ot = "_flowHandleConnectableEnd";
function Cf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("start"), l = o.includes("end"), c = a || !a && !l, d = l || !a && !l;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[Lt] = u), d && (e[ot] = u);
      }), s(() => {
        delete e[Lt], delete e[ot];
      });
    }
  );
}
function xn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Fr(t) {
  return xn(t, t.draggable);
}
function Sf(t) {
  return xn(t, t.deletable);
}
function Be(t) {
  return xn(t, t.connectable);
}
function Go(t) {
  return xn(t, t.selectable);
}
function ls(t) {
  return xn(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(a * a + l * l), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), g = n - a / u * h, p = o - l / u * h, y = n + c / f * h, m = o + d / f * h;
  return `L${g},${p} Q${n},${o} ${y},${m}`;
}
function En({
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
function An(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function kf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * An(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * An(
    n === "bottom" ? i - e : e - i,
    s
  ), u = l ? o + (r === "right" ? 1 : -1) * An(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = l ? i : i + (r === "bottom" ? 1 : -1) * An(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function eo(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = kf(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = En({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function yy({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: a, offsetX: l, offsetY: c } = En({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: a },
    labelOffsetX: l,
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
function Lf(t, e, n, o, i, r, s) {
  const a = cs(n), l = cs(r), c = t + a.x * s, d = e + a.y * s, u = o + l.x * s, f = i + l.y * s, h = n === "left" || n === "right";
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
  offset: a = 10
}) {
  const l = Lf(
    t,
    e,
    n,
    o,
    i,
    r,
    a
  );
  let c = `M${t},${e}`;
  for (let g = 0; g < l.length; g++) {
    const [p, y] = l[g];
    if (s > 0 && g > 0 && g < l.length - 1) {
      const [m, _] = g === 1 ? [t, e] : l[g - 1], [E, b] = l[g + 1];
      c += ` ${Xt(m, _, p, y, E, b, s)}`;
    } else
      c += ` L${p},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = En({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Pf(t) {
  return yn({ ...t, borderRadius: 0 });
}
function Or({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: a, offsetY: l } = En({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: a,
    labelOffsetY: l
  };
}
const st = 40;
function Mf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < st && s >= 0 ? i = -o * (1 - s / st) : a < st && a >= 0 && (i = o * (1 - a / st)), l < st && l >= 0 ? r = -o * (1 - l / st) : c < st && c >= 0 && (r = o * (1 - c / st)), { dx: i, dy: r };
}
function zr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Mf(r, s, c, n);
    if ((d !== 0 || u !== 0) && o(d, u) === !0) {
      a = !1, i = null;
      return;
    }
    i = requestAnimationFrame(l);
  }
  return {
    start() {
      a || t.isLocked?.() || (a = !0, i = requestAnimationFrame(l));
    },
    stop() {
      a = !1, i !== null && (cancelAnimationFrame(i), i = null);
    },
    updatePointer(c, d) {
      r = c, s = d;
    },
    destroy() {
      this.stop();
    }
  };
}
function Yt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Pr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || pn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(qu),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Xu
  }, i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  i.setAttribute("class", "flow-connect-line"), i.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:1000;";
  let r = null;
  function s(l) {
    const c = {
      ...l,
      connectionLineType: e,
      connectionLineStyle: o
    };
    if (t.connectionLine) {
      r && r.remove(), r = t.connectionLine(c), i.appendChild(r);
      return;
    }
    r || (r = document.createElementNS("http://www.w3.org/2000/svg", "path"), r.setAttribute("fill", "none"), i.appendChild(r)), r.setAttribute("stroke", o.stroke), r.setAttribute("stroke-width", String(o.strokeWidth)), r.setAttribute("stroke-dasharray", o.strokeDasharray);
    const { fromX: d, fromY: u, toX: f, toY: h } = l;
    let g;
    switch (e) {
      case "bezier": {
        g = eo({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        g = yn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        g = Pf({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        g = Or({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
    }
    r.setAttribute("d", g);
  }
  function a() {
    i.remove();
  }
  return { svg: i, update: s, destroy: a };
}
function wn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let a = null, l = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !Be(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
      const f = t.cursorFlowPos.x - d.flowX, h = t.cursorFlowPos.y - d.flowY, g = Math.sqrt(f * f + h * h);
      g < c && (c = g, a = d.el, l = { x: d.flowX, y: d.flowY });
    }
    return { element: a, position: l };
  }
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const a = s, l = a.closest("[x-flow-node]");
    if (!l || l.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && l.dataset.flowNodeId !== t.targetNodeId) return;
    const c = l.dataset.flowNodeId;
    if (c) {
      const g = t.getNode(c);
      if (g && !Be(g)) return;
    }
    const d = t.handleType === "target" ? ot : Lt;
    if (a[d] === !1) return;
    const u = a.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) return;
    const f = t.toFlowPosition(
      u.left + u.width / 2,
      u.top + u.height / 2
    ), h = Math.sqrt(
      (t.cursorFlowPos.x - f.x) ** 2 + (t.cursorFlowPos.y - f.y) ** 2
    );
    h < r && (r = h, o = a, i = f);
  }), { element: o, position: i };
}
function po(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = zr({
    container: t,
    speed: e._config?.autoPanSpeed ?? 15,
    onPan(r, s) {
      const a = () => e._viewportLive ?? e.viewport, l = { x: a().x, y: a().y };
      e._panZoom?.setViewport({
        x: a().x - r,
        y: a().y - s,
        zoom: a().zoom
      });
      const c = l.x - a().x, d = l.y - a().y;
      return c === 0 && d === 0;
    }
  });
  return i.updatePointer(n, o), i.start(), i;
}
function Tf(t, e, n, o) {
  const i = o ? t.edges.filter((c) => c.id !== o) : t.edges, r = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const c of i) {
    const d = `${c.source}|${c.sourceHandle ?? "source"}`, u = `${c.target}|${c.targetHandle ?? "target"}`;
    s.set(d, (s.get(d) ?? 0) + 1), a.set(u, (a.get(u) ?? 0) + 1), c.source === e && c.sourceHandle === n && r.add(`${c.target}|${c.targetHandle}`);
  }
  const l = /* @__PURE__ */ new Set();
  if (t._config?.preventCycles) {
    const c = /* @__PURE__ */ new Map();
    for (const u of i) {
      let f = c.get(u.target);
      f || (f = [], c.set(u.target, f)), f.push(u.source);
    }
    const d = [e];
    for (; d.length > 0; ) {
      const u = d.pop();
      if (!l.has(u)) {
        l.add(u);
        for (const f of c.get(u) ?? [])
          d.push(f);
      }
    }
  }
  return { existingTargets: r, cycleForbidden: l, sourceCounts: s, targetCounts: a };
}
function Vr(t, e) {
  const n = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = t.querySelectorAll("[data-flow-handle-type]");
  for (const l of r) {
    const c = l.closest("[data-flow-node-id]");
    if (!c) continue;
    let d = i.get(c);
    if (d === void 0 && (d = c.dataset.flowNodeId ?? null, i.set(c, d)), !d) continue;
    const u = l.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) continue;
    const f = l.dataset.flowHandleType, h = e(u.left + u.width / 2, u.top + u.height / 2), g = {
      el: l,
      nodeId: d,
      handleId: l.dataset.flowHandleId ?? f,
      type: f,
      isMirror: l.classList.contains("flow-schema-handle--mirror"),
      flowX: h.x,
      flowY: h.y,
      connectableStart: l[Lt] !== !1,
      connectableEnd: l[ot] !== !1,
      hasValidator: l[Ye] != null,
      limit: l[ct] ?? null
    };
    n.push(g);
    const p = `${d}|${g.handleId}|${f}`, y = o.get(p);
    (!y || y.isMirror && !g.isMirror) && o.set(p, g);
  }
  const s = n.filter((l) => l.type === "source"), a = n.filter((l) => l.type === "target");
  return {
    all: n,
    byType: (l) => l === "source" ? s : a,
    get: (l, c, d) => o.get(`${l}|${c}|${d}`)
  };
}
let ln = 0;
const Nn = /* @__PURE__ */ new WeakMap();
function Qe(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[Ye] && !r[Ye](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[Ye] && !r[Ye](e))
      return !1;
  }
  return !0;
}
function et(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ct] && n.filter(
      (l) => l.source === e.source && (l.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[ct])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ct] && n.filter(
      (l) => l.target === e.target && (l.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[ct])
      return !1;
  }
  return !0;
}
function vn(t, e, n, o, i, r) {
  if (!r) {
    Af(t, e, n, o, i);
    return;
  }
  const s = Tf(o, e, n, i), a = r.get(e, n, "source"), l = a?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= a.limit, c = [];
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
    }, h = o.getNode(d.nodeId)?.connectable !== !1 && d.nodeId !== e && !s.existingTargets.has(`${d.nodeId}|${d.handleId}`) && !s.cycleForbidden.has(d.nodeId), g = r.get(d.nodeId, d.handleId, "target") ?? d;
    let p = h && !l;
    p && g.limit != null && (p = (s.targetCounts.get(`${d.nodeId}|${d.handleId}`) ?? 0) < g.limit);
    let y = p;
    y && a?.hasValidator && (y = !!a.el[Ye](u)), y && g.hasValidator && (y = !!g.el[Ye](u));
    const m = y && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: m, limitHit: h && !p });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function Af(t, e, n, o, i) {
  const r = i ? o.edges.filter((a) => a.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const a of s) {
    const c = a.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = a.dataset.flowHandleId ?? "target";
    if (a[ot] === !1) {
      a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && ht(u, r, { preventCycles: o._config?.preventCycles }), g = h && et(t, u, r);
    g && Qe(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (a.classList.add("flow-handle-valid"), a.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid"), h && !g ? a.classList.add("flow-handle-limit-reached") : a.classList.remove("flow-handle-limit-reached"));
  }
}
function Pe(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function Ct(t, e) {
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
async function mo(t, e, n, o, i, r) {
  if (!t) return { allowed: !0 };
  n?.classList.add(r), o?.classList.add(r), i.dispatchEvent(new CustomEvent("flow-connect-validating", {
    detail: { connection: e },
    bubbles: !0
  }));
  let s;
  try {
    s = await t(e);
  } catch (c) {
    B("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const a = typeof s == "boolean" ? s : !!s?.allowed, l = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: a, reason: l },
    bubbles: !0
  })), { allowed: a, reason: l };
}
async function Br(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), a = (c) => (Ae(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!ht(n, s, { preventCycles: o._config?.preventCycles }) || !ft(n, o._config?.connectionRules, o._nodeMap) || !et(i, n, s) || !Qe(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return a();
  const l = o._config?.connectValidator;
  if (l) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = yo(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await mo(
        l,
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
      return a(f.reason);
  }
  return o._captureHistory?.(), r === "source" ? (e.source = n.source, e.sourceHandle = n.sourceHandle) : (e.target = n.target, e.targetHandle = n.targetHandle), { applied: !0 };
}
async function qr(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ae(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Be(s) || !ht(e, i, { preventCycles: n._config?.preventCycles }) || !ft(e, n._config?.connectionRules, n._nodeMap) || !et(o, e, i) || !Qe(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const a = n._config?.connectValidator;
  if (a) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = yo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await mo(
        a,
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${ln++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function yo(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  ), o = e.sourceHandle ?? "source", i = n?.querySelector(
    `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="source"]`
  ) ?? n?.querySelector(`[data-flow-handle-id="${CSS.escape(o)}"]`) ?? null, r = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  ), s = e.targetHandle ?? "target", a = r?.querySelector(
    `[data-flow-handle-id="${CSS.escape(s)}"][data-flow-handle-type="target"]`
  ) ?? r?.querySelector(`[data-flow-handle-id="${CSS.escape(s)}"]`) ?? null;
  return { sourceEl: i, targetEl: a };
}
const dt = /* @__PURE__ */ new WeakMap();
function Xr(t, e, n) {
  n.preventDefault(), n.stopPropagation();
  const o = t.dataset.flowHandleId ?? "source", i = t.closest("[x-flow-node]");
  if (!e || !i || e._animationLocked) return;
  const r = i.dataset.flowNodeId;
  if (!r) return;
  const s = e.getNode(r);
  if (s && !Be(s) || t[Lt] === !1) return;
  const a = n.clientX, l = n.clientY;
  let c = !1;
  if (e.pendingConnection && e._config?.connectOnClick !== !1) {
    e._emit("connect-end", {
      connection: null,
      source: e.pendingConnection.source,
      sourceHandle: e.pendingConnection.sourceHandle,
      position: { x: 0, y: 0 }
    }), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
    const T = t.closest(".flow-container");
    T && Pe(T);
  }
  let d = null, u = null, f = null, h = null, g = null;
  const p = e._config?.connectionSnapRadius ?? 20, y = t.closest(".flow-container");
  let m = null, _ = 0, E = 0, b = !1, x = /* @__PURE__ */ new Map();
  const M = () => {
    if (c = !0, B("connection", `Connection drag started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), !y) return;
    u = Yt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: y
    }), d = u.svg;
    const T = t.getBoundingClientRect(), S = y.getBoundingClientRect(), v = e._viewportLive ?? e.viewport, w = v?.zoom || 1, I = v?.x || 0, k = v?.y || 0;
    _ = (T.left + T.width / 2 - S.left - I) / w, E = (T.top + T.height / 2 - S.top - k) / w, u.update({ fromX: _, fromY: E, toX: _, toY: E, source: r, sourceHandle: o });
    const R = y.querySelector(".flow-viewport");
    if (R && R.appendChild(d), e.pendingConnection = {
      source: r,
      sourceHandle: o,
      position: { x: _, y: E }
    }, h = po(y, e, a, l), m = Vr(
      y,
      (O, Y) => e.screenToFlowPosition(O, Y)
    ), vn(y, r, o, e, void 0, m), e._config?.onEdgeDrop) {
      const O = e._config.edgeDropPreview, D = O ? O({ source: r, sourceHandle: o }) : "New Node";
      if (D !== null) {
        g = document.createElement("div"), g.className = "flow-ghost-node";
        const L = document.createElement("div");
        if (L.className = "flow-ghost-handle", g.appendChild(L), typeof D == "string") {
          const F = document.createElement("span");
          F.textContent = D, g.appendChild(F);
        } else
          g.appendChild(D);
        g.style.left = `${_}px`, g.style.top = `${E}px`;
        const N = y.querySelector(".flow-viewport");
        N && N.appendChild(g);
      }
    }
  }, P = () => {
    const T = [...e.selectedNodes], S = [], v = y.getBoundingClientRect(), w = e._viewportLive ?? e.viewport, I = w?.zoom || 1, k = w?.x || 0, R = w?.y || 0;
    for (const O of T) {
      if (O === r) continue;
      const D = y?.querySelector(`[data-flow-node-id="${CSS.escape(O)}"]`)?.querySelector('[data-flow-handle-type="source"]');
      if (!D) continue;
      const L = D.getBoundingClientRect();
      S.push({
        nodeId: O,
        handleId: D.dataset.flowHandleId ?? "source",
        pos: {
          x: (L.left + L.width / 2 - v.left - k) / I,
          y: (L.top + L.height / 2 - v.top - R) / I
        }
      });
    }
    return S;
  }, A = (T) => {
    b = !0, u && (x.set(r, {
      line: u,
      sourceNodeId: r,
      sourceHandleId: o,
      sourcePos: { x: _, y: E },
      valid: !0
    }), u = null);
    const S = P(), v = y.querySelector(".flow-viewport");
    for (const w of S) {
      const I = Yt({
        connectionLineType: e._config?.connectionLineType,
        connectionLineStyle: e._config?.connectionLineStyle,
        connectionLine: e._config?.connectionLine,
        containerEl: y
      });
      I.update({
        fromX: w.pos.x,
        fromY: w.pos.y,
        toX: T.x,
        toY: T.y,
        source: w.nodeId,
        sourceHandle: w.handleId
      }), v && v.appendChild(I.svg), x.set(w.nodeId, {
        line: I,
        sourceNodeId: w.nodeId,
        sourceHandleId: w.handleId,
        sourcePos: w.pos,
        valid: !0
      });
    }
  }, $ = (T) => {
    if (!c) {
      const w = T.clientX - a, I = T.clientY - l;
      if (Math.abs(w) >= Gn || Math.abs(I) >= Gn) {
        if (M(), e._config?.multiConnect && e.selectedNodes.size > 1 && e.selectedNodes.has(r)) {
          const k = e.screenToFlowPosition(T.clientX, T.clientY);
          A(k);
        }
      } else
        return;
    }
    const S = e.screenToFlowPosition(T.clientX, T.clientY);
    if (b) {
      const w = wn({
        containerEl: y,
        handleType: "target",
        excludeNodeId: r,
        cursorFlowPos: S,
        connectionSnapRadius: p,
        getNode: (Y) => e.getNode(Y),
        toFlowPosition: (Y, D) => e.screenToFlowPosition(Y, D),
        connectionMode: e._config?.connectionMode,
        index: m ?? void 0
      });
      w.element !== f && (f?.classList.remove("flow-handle-active"), w.element?.classList.add("flow-handle-active"), f = w.element);
      const k = w.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, R = w.element?.dataset.flowHandleId ?? "target", O = e._config?.connectionLineStyle?.stroke ?? (getComputedStyle(y).getPropertyValue("--flow-edge-stroke-selected").trim() || pn);
      for (const Y of x.values())
        if (Y.line.update({
          fromX: Y.sourcePos.x,
          fromY: Y.sourcePos.y,
          toX: w.position.x,
          toY: w.position.y,
          source: Y.sourceNodeId,
          sourceHandle: Y.sourceHandleId
        }), w.element && k) {
          const D = {
            source: Y.sourceNodeId,
            sourceHandle: Y.sourceHandleId,
            target: k,
            targetHandle: R
          }, G = e.getNode(k)?.connectable !== !1 && Y.sourceNodeId !== k && ht(D, e.edges, { preventCycles: e._config?.preventCycles }) && ft(D, e._config?.connectionRules, e._nodeMap) && et(y, D, e.edges) && Qe(y, D) && (!e._config?.isValidConnection || e._config.isValidConnection(D));
          Y.valid = G;
          const q = Y.line.svg.querySelector("path");
          if (q)
            if (G)
              q.setAttribute("stroke", O);
            else {
              const z = getComputedStyle(y).getPropertyValue("--flow-connection-line-invalid").trim() || Pr;
              q.setAttribute("stroke", z);
            }
        } else {
          Y.valid = !0;
          const D = Y.line.svg.querySelector("path");
          D && D.setAttribute("stroke", O);
        }
      e.pendingConnection = { ...e.pendingConnection, position: w.position }, h?.updatePointer(T.clientX, T.clientY);
      return;
    }
    const v = wn({
      containerEl: y,
      handleType: "target",
      excludeNodeId: r,
      cursorFlowPos: S,
      connectionSnapRadius: p,
      getNode: (w) => e.getNode(w),
      toFlowPosition: (w, I) => e.screenToFlowPosition(w, I),
      index: m ?? void 0
    });
    v.element !== f && (f?.classList.remove("flow-handle-active"), v.element?.classList.add("flow-handle-active"), f = v.element), g ? v.element ? (g.style.display = "none", u?.update({ fromX: _, fromY: E, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o })) : (g.style.display = "", g.style.left = `${S.x}px`, g.style.top = `${S.y}px`, u?.update({ fromX: _, fromY: E, toX: S.x, toY: S.y, source: r, sourceHandle: o })) : u?.update({ fromX: _, fromY: E, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o }), e.pendingConnection = { ...e.pendingConnection, position: v.position }, h?.updatePointer(T.clientX, T.clientY);
  }, C = async (T) => {
    if (h?.stop(), h = null, document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", C), document.removeEventListener("pointercancel", C), dt.delete(t), m = null, e._connectValidating) return;
    if (b) {
      const I = e.screenToFlowPosition(T.clientX, T.clientY);
      let k = f;
      k || (k = document.elementFromPoint(T.clientX, T.clientY)?.closest('[data-flow-handle-type="target"]'));
      const O = k?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, Y = k?.dataset.flowHandleId ?? "target", D = [], L = [], N = [], F = [];
      if (k && O) {
        const J = e.getNode(O);
        for (const oe of x.values()) {
          const G = {
            source: oe.sourceNodeId,
            sourceHandle: oe.sourceHandleId,
            target: O,
            targetHandle: Y
          };
          if (J?.connectable !== !1 && oe.sourceNodeId !== O && ht(G, e.edges, { preventCycles: e._config?.preventCycles }) && ft(G, e._config?.connectionRules, e._nodeMap) && et(y, G, e.edges) && Qe(y, G) && (!e._config?.isValidConnection || e._config.isValidConnection(G))) {
            const H = `e-${oe.sourceNodeId}-${O}-${Date.now()}-${ln++}`;
            D.push({ id: H, ...G }), L.push(G), F.push(oe);
          } else
            N.push(oe);
        }
      } else
        N.push(...x.values());
      for (const J of F)
        J.line.destroy();
      if (D.length > 0) {
        e.addEdges(D);
        for (const J of L)
          e._emit("connect", { connection: J });
        e._emit("multi-connect", { connections: L });
      }
      N.length > 0 && setTimeout(() => {
        for (const J of N)
          J.line.destroy();
      }, 100), f?.classList.remove("flow-handle-active"), e._emit("connect-end", {
        connection: L.length > 0 ? L[0] : null,
        source: r,
        sourceHandle: o,
        position: I
      }), x.clear(), b = !1, Pe(y), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
      return;
    }
    if (!c) {
      e._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), e.pendingConnection = {
        source: r,
        sourceHandle: o,
        position: { x: 0, y: 0 }
      }, e._container?.classList.add("flow-connecting"), vn(y, r, o, e, void 0, m ?? void 0));
      return;
    }
    const S = u?.svg ?? null;
    g?.remove(), g = null, f?.classList.remove("flow-handle-active"), Pe(y);
    const v = e.screenToFlowPosition(T.clientX, T.clientY), w = { source: r, sourceHandle: o, position: v };
    try {
      let I = f;
      if (I || (I = document.elementFromPoint(T.clientX, T.clientY)?.closest('[data-flow-handle-type="target"]')), I) {
        const R = I.closest("[x-flow-node]")?.dataset.flowNodeId, O = I.dataset.flowHandleId ?? "target";
        if (R) {
          if (I[ot] === !1) {
            B("connection", "Connection rejected (handle not connectable end)"), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const Y = e.getNode(R);
          if (Y && !Be(Y)) {
            B("connection", `Connection rejected (target "${R}" not connectable)`), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const D = {
            source: r,
            sourceHandle: o,
            target: R,
            targetHandle: O
          };
          if (ht(D, e.edges, { preventCycles: e._config?.preventCycles })) {
            if (!ft(D, e._config?.connectionRules, e._nodeMap)) {
              B("connection", "Connection rejected (connection rules)", D), Ae(y, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!et(y, D, e.edges)) {
              B("connection", "Connection rejected (handle limit)", D), Ae(y, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!Qe(y, D)) {
              B("connection", "Connection rejected (per-handle validator)", D), Ae(y, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (e._config?.isValidConnection && !e._config.isValidConnection(D)) {
              B("connection", "Connection rejected (custom validator)", D), Ae(y, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            const L = e._config?.connectValidator;
            if (L) {
              const F = e._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: J, targetEl: oe } = yo(y, D);
              e._connectValidating = !0, Ct(S, !0);
              let G;
              try {
                G = await mo(
                  L,
                  D,
                  J,
                  oe,
                  y,
                  F
                );
              } finally {
                e._connectValidating = !1, Ct(S, !1);
              }
              if (!G.allowed) {
                B("connection", "Connection rejected (async connectValidator)", { connection: D, reason: G.reason }), Ae(y, { ...D, reason: G.reason }), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
                return;
              }
            }
            const N = `e-${r}-${R}-${Date.now()}-${ln++}`;
            e.addEdges({ id: N, ...D }), B("connection", `Connection created: ${r} → ${R}`, D), e._emit("connect", { connection: D }), e._emit("connect-end", { connection: D, ...w });
          } else
            B("connection", "Connection rejected (invalid)", D), Ae(y, D), e._emit("connect-end", { connection: null, ...w });
        } else
          e._emit("connect-end", { connection: null, ...w });
      } else if (e._config?.onEdgeDrop) {
        const k = {
          x: v.x - ve / 2,
          y: v.y - _e / 2
        }, R = e._config.onEdgeDrop({
          source: r,
          sourceHandle: o,
          position: k
        });
        if (R) {
          const O = {
            source: r,
            sourceHandle: o,
            target: R.id,
            targetHandle: "target"
          };
          if (!et(y, O, e.edges))
            B("connection", "Edge drop: connection rejected (handle limit)"), e._emit("connect-end", { connection: null, ...w });
          else if (!Qe(y, O))
            B("connection", "Edge drop: connection rejected (per-handle validator)"), e._emit("connect-end", { connection: null, ...w });
          else if (!e._config.isValidConnection || e._config.isValidConnection(O)) {
            e.addNodes(R);
            const Y = `e-${r}-${R.id}-${Date.now()}-${ln++}`;
            e.addEdges({ id: Y, ...O }), B("connection", `Edge drop: created node "${R.id}" and edge`, O), e._emit("connect", { connection: O }), e._emit("connect-end", { connection: O, ...w });
          } else
            B("connection", "Edge drop: connection rejected by validator"), e._emit("connect-end", { connection: null, ...w });
        } else
          B("connection", "Edge drop: callback returned null"), e._emit("connect-end", { connection: null, ...w });
      } else
        B("connection", "Connection cancelled (no target)"), e._emit("connect-end", { connection: null, ...w });
    } finally {
      Ct(S, !1), u?.destroy(), u = null;
    }
    e.pendingConnection = null;
  };
  document.addEventListener("pointermove", $), document.addEventListener("pointerup", C), document.addEventListener("pointercancel", C), dt.set(t, () => {
    document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", C), document.removeEventListener("pointercancel", C), h?.stop(), u?.destroy(), u = null, g?.remove(), g = null;
    for (const T of x.values())
      T.line.destroy();
    x.clear(), b = !1, f?.classList.remove("flow-handle-active"), Pe(y), m = null, e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
  });
}
function Yr(t, e, n) {
  if (n.button !== 0) return;
  const o = t.dataset.flowHandleId ?? "target", r = t.closest("[x-flow-node]")?.getAttribute("data-flow-node-id") ?? null;
  if (!e || !r || e._animationLocked || e._config?.edgesReconnectable === !1 || e._pendingReconnection) return;
  const s = e.edges.filter(
    (D) => D.target === r && (D.targetHandle ?? "target") === o
  );
  if (s.length === 0) return;
  const a = s.find((D) => D.selected) ?? (s.length === 1 ? s[0] : null);
  if (!a) return;
  const l = a.reconnectable ?? !0;
  if (l === !1 || l === "source") return;
  n.preventDefault(), n.stopPropagation();
  const c = n.clientX, d = n.clientY;
  let u = !1, f = !1, h = null;
  const g = e._config?.connectionSnapRadius ?? 20, p = t.closest(".flow-container");
  if (!p) return;
  const y = p.querySelector(
    `[data-flow-node-id="${CSS.escape(a.source)}"]`
  ), m = a.sourceHandle ? `[data-flow-handle-id="${CSS.escape(a.sourceHandle)}"]` : '[data-flow-handle-type="source"]', _ = y?.querySelector(m), E = p.getBoundingClientRect(), b = e._viewportLive ?? e.viewport, x = b?.zoom || 1, M = b?.x || 0, P = b?.y || 0;
  let A, $;
  if (_) {
    const D = _.getBoundingClientRect();
    A = (D.left + D.width / 2 - E.left - M) / x, $ = (D.top + D.height / 2 - E.top - P) / x;
  } else {
    const D = e.getNode(a.source);
    if (!D) return;
    const L = D.dimensions?.width ?? ve, N = D.dimensions?.height ?? _e;
    A = D.position.x + L / 2, $ = D.position.y + N;
  }
  let C = null, T = null, S = null, v = c, w = d, I = null;
  const k = () => {
    u = !0;
    const D = p.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.add("flow-edge-reconnecting"), e._emit("reconnect-start", { edge: a, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${a.id}"`), T = Yt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: p
    }), C = T.svg;
    const L = e.screenToFlowPosition(c, d);
    T.update({
      fromX: A,
      fromY: $,
      toX: L.x,
      toY: L.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    });
    const N = p.querySelector(".flow-viewport");
    N && N.appendChild(C), e.pendingConnection = {
      source: a.source,
      sourceHandle: a.sourceHandle,
      position: L
    }, e._pendingReconnection = {
      edge: a,
      draggedEnd: "target",
      anchorPosition: { x: A, y: $ },
      position: L
    }, S = po(p, e, v, w), I = Vr(
      p,
      (F, J) => e.screenToFlowPosition(F, J)
    ), vn(p, a.source, a.sourceHandle ?? "source", e, a.id, I);
  }, R = (D) => {
    if (v = D.clientX, w = D.clientY, !u) {
      Math.sqrt(
        (D.clientX - c) ** 2 + (D.clientY - d) ** 2
      ) >= Gn && k();
      return;
    }
    const L = e.screenToFlowPosition(D.clientX, D.clientY), N = wn({
      containerEl: p,
      handleType: "target",
      excludeNodeId: a.source,
      cursorFlowPos: L,
      connectionSnapRadius: g,
      getNode: (F) => e.getNode(F),
      toFlowPosition: (F, J) => e.screenToFlowPosition(F, J),
      index: I ?? void 0
    });
    N.element !== h && (h?.classList.remove("flow-handle-active"), N.element?.classList.add("flow-handle-active"), h = N.element), T?.update({
      fromX: A,
      fromY: $,
      toX: N.position.x,
      toY: N.position.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    }), e.pendingConnection && (e.pendingConnection = {
      ...e.pendingConnection,
      position: N.position
    }), e._pendingReconnection && (e._pendingReconnection = {
      ...e._pendingReconnection,
      position: N.position
    }), S?.updatePointer(D.clientX, D.clientY);
  }, O = () => {
    if (f) return;
    f = !0, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", Y), document.removeEventListener("pointercancel", Y), S?.stop(), S = null, T?.destroy(), T = null, C = null, I = null, h?.classList.remove("flow-handle-active"), dt.delete(t);
    const D = p.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.remove("flow-edge-reconnecting"), Pe(p), e.pendingConnection = null, e._pendingReconnection = null;
  }, Y = async (D) => {
    if (!u) {
      O();
      return;
    }
    if (e._connectValidating) return;
    let L = h;
    L || (L = document.elementFromPoint(D.clientX, D.clientY)?.closest('[data-flow-handle-type="target"]'));
    let N = !1;
    if (L) {
      const J = L.closest("[x-flow-node]")?.dataset.flowNodeId, oe = L.dataset.flowHandleId;
      if (J && e.getNode(J)?.connectable !== !1) {
        const q = {
          source: a.source,
          sourceHandle: a.sourceHandle,
          target: J,
          targetHandle: oe
        }, z = { ...a }, X = T?.svg ?? null;
        Ct(X, !0);
        let W;
        try {
          W = await Br({
            edge: a,
            newConnection: q,
            canvas: e,
            containerEl: p,
            endpoint: "target"
          });
        } finally {
          Ct(X, !1);
        }
        W.applied ? (N = !0, B("reconnect", `Edge "${a.id}" reconnected (target)`, q), e._emit("reconnect", { oldEdge: z, newConnection: q })) : B("reconnect", "Reconnection rejected", { connection: q, reason: W.reason });
      }
    }
    N || B("reconnect", `Edge "${a.id}" reconnection cancelled — snapping back`), e._emit("reconnect-end", { edge: a, successful: N }), O();
  };
  document.addEventListener("pointermove", R), document.addEventListener("pointerup", Y), document.addEventListener("pointercancel", Y), dt.set(t, O);
}
function Nf(t, e, n) {
  t.dataset.flowHandleType === "source" ? Xr(t, e, n) : Yr(t, e, n);
}
function ds(t) {
  return t?._config?.delegatedHandleEvents === !1;
}
function If(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let g;
      c && u ? g = "top-left" : c && f ? g = "top-right" : d && u ? g = "bottom-left" : d && f ? g = "bottom-right" : c ? g = "top" : f ? g = "right" : d ? g = "bottom" : u ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let p, y = !1;
      if (i) {
        const x = r(i);
        x && typeof x == "object" && !Array.isArray(x) ? (p = x.id || e.getAttribute("data-flow-handle-id") || l, x.position && (g = x.position, y = !0)) : p = x || e.getAttribute("data-flow-handle-id") || l;
      } else
        p = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const x = r(i);
        x && typeof x == "object" && !Array.isArray(x) && x.position && (e.dataset.flowHandlePosition = x.position);
      })), !h && !y) {
        const x = () => {
          const P = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!P) return;
          const A = e.closest("[x-data]");
          return A ? t.$data(A)?.getNode?.(P) : void 0;
        };
        s(() => {
          const M = x();
          if (!M) return;
          const P = l === "source" ? M.sourcePosition : M.targetPosition;
          P && (e.dataset.flowHandlePosition = P);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const m = () => {
        const x = e.closest("[x-flow-node]");
        return x ? x.getAttribute("data-flow-node-id") ?? null : null;
      }, _ = () => {
        const x = e.closest("[x-data]");
        return x ? t.$data(x) : null;
      }, E = _();
      let b = null;
      if (E?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${l} handle ${p}`);
        const x = (A) => {
          const $ = A?._pendingKeyboardConnect;
          if (!$) return;
          const C = e.closest(".flow-container");
          C && C.querySelector(
            `[data-flow-node-id="${CSS.escape($.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape($.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), A && (A._pendingKeyboardConnect = null);
        }, M = (A) => {
          if (!(A.key === "Enter" || A.key === " " || A.key === "Spacebar")) return;
          const C = _();
          if (!C || C._animationLocked) return;
          const T = m();
          if (T)
            if (l === "source") {
              const S = C.getNode?.(T);
              if (S && !Be(S) || e[Lt] === !1) return;
              A.preventDefault(), A.stopPropagation(), x(C), C._pendingKeyboardConnect = {
                sourceNodeId: T,
                sourceHandleId: p
              }, e.classList.add("flow-handle-connect-pending"), C._announcer?.announce?.(`Connecting from ${l} handle ${p}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!C._pendingKeyboardConnect) return;
              const S = C.getNode?.(T);
              if (S && !Be(S) || e[ot] === !1) return;
              A.preventDefault(), A.stopPropagation();
              const { sourceNodeId: v, sourceHandleId: w } = C._pendingKeyboardConnect, I = {
                source: v,
                sourceHandle: w,
                target: T,
                targetHandle: p
              }, k = e.closest(".flow-container");
              if (x(C), !k) return;
              qr({ connection: I, canvas: C, containerEl: k }).then((R) => {
                R.applied && C._announcer?.announce?.(`Connected ${v} to ${T}.`);
              });
            }
        };
        e.addEventListener("keydown", M);
        const P = e.closest(".flow-container");
        if (P) {
          const A = Nn.get(P);
          if (A)
            A.count += 1;
          else {
            const $ = (C) => {
              if (C.key !== "Escape") return;
              const T = P.matches("[x-data]") ? P : P.closest("[x-data]") ?? P.querySelector("[x-data]");
              if (!T) return;
              const S = t.$data(T);
              S?._pendingKeyboardConnect && x(S);
            };
            P.addEventListener("keydown", $), Nn.set(P, { count: 1, handler: $ });
          }
        }
        b = () => {
          if (e.removeEventListener("keydown", M), P) {
            const A = Nn.get(P);
            A && (A.count -= 1, A.count <= 0 && (P.removeEventListener("keydown", A.handler), Nn.delete(P)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (l === "source") {
        const x = (A) => {
          Xr(e, _(), A);
        };
        ds(E) && e.addEventListener("pointerdown", x);
        const M = () => {
          const A = _();
          if (!A?._pendingReconnection || A._pendingReconnection.draggedEnd !== "source") return;
          const $ = m();
          if ($) {
            const C = A.getNode($);
            if (C && !Be(C)) return;
          }
          e[Lt] !== !1 && e.classList.add("flow-handle-active");
        }, P = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", M), e.addEventListener("pointerleave", P), a(() => {
          dt.get(e)?.(), dt.delete(e), b?.(), e.removeEventListener("pointerdown", x), e.removeEventListener("pointerenter", M), e.removeEventListener("pointerleave", P), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const x = () => {
          const $ = _();
          if (!$?.pendingConnection) return;
          const C = m();
          if (C) {
            const T = $.getNode(C);
            if (T && !Be(T)) return;
          }
          e[ot] !== !1 && e.classList.add("flow-handle-active");
        }, M = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", x), e.addEventListener("pointerleave", M);
        const P = async ($) => {
          const C = _();
          if (!C?.pendingConnection || C._config?.connectOnClick === !1 || C._connectValidating) return;
          $.preventDefault(), $.stopPropagation();
          const T = m();
          if (!T) return;
          if (e[ot] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), C._emit("connect-end", { connection: null, source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && Pe(k);
            return;
          }
          const S = C.getNode(T);
          if (S && !Be(S)) {
            B("connection", `Click-to-connect rejected (target "${T}" not connectable)`), C._emit("connect-end", { connection: null, source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && Pe(k);
            return;
          }
          const v = {
            source: C.pendingConnection.source,
            sourceHandle: C.pendingConnection.sourceHandle,
            target: T,
            targetHandle: p
          }, w = { source: C.pendingConnection.source, sourceHandle: C.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (ht(v, C.edges, { preventCycles: C._config?.preventCycles })) {
            const k = e.closest(".flow-container");
            if (!ft(v, C._config?.connectionRules, C._nodeMap)) {
              B("connection", "Click-to-connect rejected (connection rules)", v), Ae(k, v), C._emit("connect-end", { connection: null, ...w }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            if (k && !et(k, v, C.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", v), Ae(k, v), C._emit("connect-end", { connection: null, ...w }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), Pe(k);
              return;
            }
            if (k && !Qe(k, v)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", v), Ae(k, v), C._emit("connect-end", { connection: null, ...w }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            if (C._config?.isValidConnection && !C._config.isValidConnection(v)) {
              B("connection", "Click-to-connect rejected (custom validator)", v), Ae(k, v), C._emit("connect-end", { connection: null, ...w }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            const R = C._config?.connectValidator;
            if (R && k) {
              const Y = C._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: D, targetEl: L } = yo(k, v);
              C._connectValidating = !0;
              let N;
              try {
                N = await mo(
                  R,
                  v,
                  D,
                  L,
                  k,
                  Y
                );
              } finally {
                C._connectValidating = !1;
              }
              if (!N.allowed) {
                B("connection", "Click-to-connect rejected (async connectValidator)", { connection: v, reason: N.reason }), Ae(k, { ...v, reason: N.reason }), C._emit("connect-end", { connection: null, ...w }), C.pendingConnection = null, C._container?.classList.remove("flow-connecting"), Pe(k);
                return;
              }
            }
            const O = `e-${v.source}-${v.target}-${Date.now()}-${ln++}`;
            C.addEdges({ id: O, ...v }), B("connection", `Click-to-connect: ${v.source} → ${v.target}`, v), C._emit("connect", { connection: v }), C._emit("connect-end", { connection: v, ...w });
          } else {
            B("connection", "Click-to-connect rejected (invalid)", v);
            const k = e.closest(".flow-container");
            Ae(k, v), C._emit("connect-end", { connection: null, ...w });
          }
          C.pendingConnection = null, C._container?.classList.remove("flow-connecting");
          const I = e.closest(".flow-container");
          I && Pe(I);
        };
        e.addEventListener("click", P);
        const A = ($) => {
          Yr(e, _(), $);
        };
        ds(E) && e.addEventListener("pointerdown", A), a(() => {
          dt.get(e)?.(), dt.delete(e), b?.(), e.removeEventListener("pointerdown", A), e.removeEventListener("pointerenter", x), e.removeEventListener("pointerleave", M), e.removeEventListener("click", P), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
function us(t, e) {
  const n = (o) => {
    const r = o.target?.closest?.("[data-flow-handle-type]");
    r && t.contains(r) && (e?._container && r.closest(".flow-container") !== e._container || Nf(r, e, o));
  };
  return t.addEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", n, !0);
}
const fs = {
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
function $f(t) {
  if (!t) return { ...fs };
  const e = { ...fs };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function je(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Df(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function gt(t, e) {
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
  let r = null, s = 0, a = 0, l = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), l = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(f) {
    const h = f.clientX - s, g = f.clientY - a;
    h * h + g * g > i * i && c();
  }
  function u(f) {
    c(), s = f.clientX, a = f.clientY, l = f, document.addEventListener("pointermove", d), document.addEventListener("pointerup", c), document.addEventListener("pointercancel", c), r = setTimeout(() => {
      const h = l;
      c(), h && e(h);
    }, o);
  }
  return t.addEventListener("pointerdown", u), () => {
    c(), t.removeEventListener("pointerdown", u);
  };
}
const Ko = 20, In = Ko + 1;
function hs(t) {
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
function gs(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Rf(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Wr(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function jr(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function Ff(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const a = Array.from(r).sort((u, f) => u - f), l = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of a)
    for (const f of l) {
      let h = !1;
      for (const g of i)
        if (Rf(u, f, g)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class Of {
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
        let a = i;
        if (r < this.items.length && this.dist[this.items[r]] < this.dist[this.items[a]] && (a = r), s < this.items.length && this.dist[this.items[s]] < this.dist[this.items[a]] && (a = s), a === i) break;
        [this.items[i], this.items[a]] = [this.items[a], this.items[i]], i = a;
      }
    }
    return n;
  }
}
function zf(t, e) {
  const n = t.map(() => []), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const r of t) {
    let s = o.get(r.x);
    s || (s = [], o.set(r.x, s)), s.push(r);
    let a = i.get(r.y);
    a || (a = [], i.set(r.y, a)), a.push(r);
  }
  for (const r of o.values()) {
    r.sort((s, a) => s.y - a.y);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      jr(a.x, a.y, l.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, a) => s.x - a.x);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      Wr(a.x, l.x, a.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  return n;
}
function Vf(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), a = new Uint8Array(i), l = zf(n, o);
  r[t.index] = 0;
  const c = new Of(r);
  for (c.push(t.index); c.size > 0; ) {
    const f = c.pop();
    if (a[f]) continue;
    if (a[f] = 1, f === e.index) break;
    const h = n[f], g = r[f];
    for (const p of l[f]) {
      if (a[p]) continue;
      const y = n[p], m = Math.abs(y.x - h.x) + Math.abs(y.y - h.y), _ = g + m;
      _ < r[p] && (r[p] = _, s[p] = f, c.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let u = e.index;
  for (; u !== -1; )
    d.unshift(n[u]), u = s[u];
  return d;
}
function Bf(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function qf(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
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
    const s = t[r].x - t[r - 1].x, a = t[r].y - t[r - 1].y, l = Math.abs(s) + Math.abs(a);
    n.push(l), e += l;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, a = t[r].x + (t[r + 1].x - t[r].x) * s, l = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: a,
        y: l,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
const ut = 200;
function Yf(t, e, n, o, i) {
  const r = Math.min(t, n) - ut, s = Math.max(t, n) + ut, a = Math.min(e, o) - ut, l = Math.max(e, o) + ut;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < l && c.y + c.height > a
  );
}
function Wf(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (jr(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Wr(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function jf(t, e, n, o, i, r, s) {
  const a = hs(n), l = hs(r), c = t + a.x * In, d = e + a.y * In, u = o + l.x * In, f = i + l.y * In, h = (_) => {
    const E = _.map(($) => gs($, Ko)), b = Ff(c, d, u, f, E);
    b.length;
    const x = b.find(($) => $.x === c && $.y === d), M = b.find(($) => $.x === u && $.y === f);
    x || b.push({ x: c, y: d, index: b.length }), M || b.push({ x: u, y: f, index: b.length });
    const P = x ?? b[b.length - (M ? 1 : 2)], A = M ?? b[b.length - 1];
    return Vf(P, A, b, E);
  }, g = Yf(t, e, o, i, s), p = g.length < s.length;
  let y = h(g);
  if (p) {
    const _ = s.map((b) => gs(b, Ko));
    (!(y !== null && y.length >= 2) || Wf(y, _)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return Bf(m);
}
const Uf = 512, rt = /* @__PURE__ */ new Map();
function Zf(t, e, n, o, i, r, s) {
  let a = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const l of s)
    a += `|${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.width)},${Math.round(l.height)}`;
  return a;
}
function Ur(t, e, n, o, i, r, s) {
  const a = Zf(t, e, n, o, i, r, s);
  if (rt.has(a)) {
    const c = rt.get(a);
    return rt.delete(a), rt.set(a, c), c;
  }
  const l = jf(t, e, n, o, i, r, s);
  return rt.set(a, l), rt.size > Uf && rt.delete(rt.keys().next().value), l;
}
function Gf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  borderRadius: a = 5
}) {
  if (!s || s.length === 0)
    return yn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const l = Ur(t, e, n, o, i, r, s);
  if (!l)
    return yn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const c = qf(l, a), { x: d, y: u, offsetX: f, offsetY: h } = Xf(l);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
const ps = 20;
function Zr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Kf(t, e) {
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
    (!r || r.length !== i.length || r.some((s, a) => s !== i[a])) && t.set(o, i);
  }
}
function Jo(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const a = s.nodeOrigin ?? n ?? [0, 0], l = s.dimensions?.width ?? ve, c = s.dimensions?.height ?? _e;
    o += s.position.x - l * a[0], i += s.position.y - c * a[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function St(t, e, n) {
  if (!t.parentId)
    return t;
  const o = Jo(t, e, n);
  return { ...t, position: o };
}
function to(t, e, n) {
  return t.map((o) => St(o, e, n));
}
function pt(t, e) {
  const n = /* @__PURE__ */ new Set(), o = [t], i = /* @__PURE__ */ new Map();
  for (const r of e)
    if (r.parentId) {
      const s = i.get(r.parentId);
      s ? s.push(r.id) : i.set(r.parentId, [r.id]);
    }
  for (; o.length > 0; ) {
    const r = o.shift(), s = i.get(r);
    if (s)
      for (const a of s)
        n.has(a) || (n.add(a), o.push(a));
  }
  return n;
}
function Pt(t) {
  const e = Zr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Gr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Gr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Kr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function Co(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function $n(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ve, height: _e };
  return Kr(t, o, i);
}
function Jf(t, e, n) {
  const o = t.x + e.width + ps, i = t.y + e.height + ps, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function ms(t, e, n) {
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
function Qf(t, e, n) {
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
      const a = -Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "top-left": {
      const a = -3 * Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "bottom-right": {
      const a = Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
    case "bottom-left": {
      const a = 3 * Math.PI / 4;
      return { x: o + r * Math.cos(a), y: i + s * Math.sin(a) };
    }
  }
}
function eh(t, e, n) {
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
      return { x: t * 0.75, y: 0 };
    case "top-left":
      return { x: t * 0.25, y: 0 };
    case "bottom-right":
      return { x: t * 0.75, y: e };
    case "bottom-left":
      return { x: t * 0.25, y: e };
  }
}
function nh(t, e, n) {
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
function oh(t, e, n) {
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
function ih(t, e, n) {
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
function sh(t, e, n) {
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
      const s = t - o, a = -Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "top-left": {
      const s = o, a = -3 * Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "bottom-right": {
      const s = t - o, a = Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
    case "bottom-left": {
      const s = o, a = 3 * Math.PI / 4;
      return { x: s + o * Math.cos(a), y: r + o * Math.sin(a) };
    }
  }
}
const Jr = {
  circle: { perimeterPoint: Qf },
  diamond: { perimeterPoint: eh },
  hexagon: { perimeterPoint: th },
  parallelogram: { perimeterPoint: nh },
  triangle: { perimeterPoint: oh },
  cylinder: { perimeterPoint: ih },
  stadium: { perimeterPoint: sh }
};
function Qr(t, e = "light") {
  let n = e === "dark" ? "dark" : "light", o = null, i = null;
  function r(a) {
    n = a ? "dark" : "light", t.classList.toggle("dark", a);
  }
  function s(a) {
    o && i && (o.removeEventListener("change", i), o = null, i = null), a === "system" ? (o = window.matchMedia("(prefers-color-scheme: dark)"), r(o.matches), i = (l) => r(l.matches), o.addEventListener("change", i)) : r(a === "dark");
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
const So = "__alpineflow_collab_store__";
function rh() {
  return typeof globalThis < "u" ? (globalThis[So] || (globalThis[So] = /* @__PURE__ */ new WeakMap()), globalThis[So]) : /* @__PURE__ */ new WeakMap();
}
const De = rh(), ko = "__alpineflow_registry__";
function ea() {
  return typeof globalThis < "u" ? (globalThis[ko] || (globalThis[ko] = /* @__PURE__ */ new Map()), globalThis[ko]) : /* @__PURE__ */ new Map();
}
function $t(t) {
  return ea().get(t);
}
function ah(t, e) {
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
const lh = 1e3;
class ch {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? ah, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, lh);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class dh {
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
    const o = new Map(e.map((l) => [l.id, l])), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const l of e)
      i.set(l.id, 0), r.set(l.id, []);
    for (const l of n)
      !o.has(l.source) || !o.has(l.target) || (i.set(l.target, (i.get(l.target) ?? 0) + 1), r.get(l.source).push(l.target));
    const s = [];
    for (const [l, c] of i)
      c === 0 && s.push(l);
    const a = [];
    for (; s.length > 0; ) {
      const l = s.shift();
      a.push(o.get(l));
      for (const c of r.get(l) ?? []) {
        const d = (i.get(c) ?? 0) - 1;
        i.set(c, d), d === 0 && s.push(c);
      }
    }
    if (a.length < e.length) {
      const l = new Set(a.map((c) => c.id));
      for (const c of e)
        l.has(c.id) || a.push(c);
    }
    return a;
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
      for (const l of e)
        l.data.$outputs && r.set(l.id, l.data.$outputs);
    let s = null;
    o && (s = this._getDownstream(o, n), s.add(o));
    const a = /* @__PURE__ */ new Map();
    for (const l of i) {
      if (s && !s.has(l.id)) continue;
      const c = this._registry.get(l.type ?? "default");
      if (!c) continue;
      const d = {}, u = n.filter((h) => h.target === l.id);
      for (const h of u) {
        const g = r.get(h.source);
        if (!g) continue;
        const p = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        p in g && (d[y] = g[p]);
      }
      const f = c.compute(d, l.data);
      r.set(l.id, f), a.set(l.id, f), l.data.$inputs = d, l.data.$outputs = f;
    }
    return a;
  }
  /** Get all downstream node IDs reachable from a start node. */
  _getDownstream(e, n) {
    const o = /* @__PURE__ */ new Map();
    for (const s of n) {
      let a = o.get(s.source);
      a || (a = [], o.set(s.source, a)), a.push(s.target);
    }
    const i = /* @__PURE__ */ new Set(), r = [e];
    for (; r.length > 0; ) {
      const s = r.pop();
      if (!i.has(s)) {
        i.add(s);
        for (const a of o.get(s) ?? [])
          i.has(a) || r.push(a);
      }
    }
    return i.delete(e), i;
  }
}
const uh = {
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
}, fh = {
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
}, hh = {
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
}, ys = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function gh(t, e) {
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
    const r = i.dimensions?.width ?? 150, s = i.dimensions?.height ?? 40, a = i.parentId ? t.getAbsolutePosition(o.id) : i.position;
    t.fitBounds(
      { x: a.x, y: a.y, width: r, height: s },
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
    const r = ys[o.style] ?? ys.info, s = o.duration ?? 1500, a = Math.floor(s * 0.6), l = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
    t.update({
      nodes: { [o.id]: { style: `border-color: ${r.borderColor}; box-shadow: ${r.shadow}` } }
    }, { duration: 100 }), setTimeout(() => {
      const u = c ? `border-color: ${c}; box-shadow: ${d ?? "none"}` : "";
      t.update({
        nodes: { [o.id]: { style: u } }
      }, { duration: l });
    }, 100 + a);
  })), n.push(e.on("flow:highlightPath", (o) => {
    const i = o.nodeIds, r = o.options ?? {}, { delay: s, ...a } = r, l = s ?? 200, c = {
      color: "#3b82f6",
      size: 5,
      duration: "800ms",
      ...a
    };
    for (let d = 0; d < i.length - 1; d++) {
      const u = i[d], f = i[d + 1], h = t.edges.find((g) => g.source === u && g.target === f);
      h && setTimeout(() => {
        t.sendParticle(h.id, c);
      }, d * l);
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
function ph(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const mh = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), yh = 150;
function wh(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function vh(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = ph(o), s = t[r], a = (l) => {
      let c;
      typeof s == "function" && (c = s(l));
      const d = uh[o], u = d ? d(l) : [l], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = mh.has(o) ? wh(a, yh) : a;
  }
}
function _h(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(fh)) {
    const r = e.on(o, (s) => {
      const a = t[i];
      if (typeof a != "function") return;
      const l = hh[o], c = l ? l(s) : Object.values(s);
      a.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const bh = 5;
function xh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const a = /* @__PURE__ */ new Set();
  function l() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > bh && !o.has(c) && (o.add(c), console.warn(
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
          a.add(c);
          return;
        }
        e.has(c) || (e.add(c), l(), t(c));
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
        for (const c of a)
          o.has(c) || e.has(c) || (e.add(c), l(), t(c));
        a.clear();
      }
    }
  };
}
function Eh(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Ch(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function cn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function ta(t, e, n, o) {
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
      (a) => (a.type ?? "default") === i
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
function no(t, e, n, o) {
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
    const s = e.type ?? "default", a = o.childTypeConstraints[s];
    if (a?.min !== void 0 && n.filter(
      (c) => (c.type ?? "default") === s
    ).length - 1 < a.min)
      return {
        valid: !1,
        rule: "childTypeConstraints",
        message: `Requires at least ${a.min} "${s}" node(s)`
      };
  }
  return { valid: !0 };
}
function ws(t, e, n) {
  if (!n) return [];
  const o = [], i = Math.max(
    n.minChildren ?? 0,
    n.requiredChildren ? 1 : 0
  );
  if (i > 0 && e.length < i && o.push(`Requires at least ${i} child node(s)`), n.maxChildren !== void 0 && e.length > n.maxChildren && o.push(`Maximum ${n.maxChildren} child node(s) allowed`), n.childTypeConstraints)
    for (const [r, s] of Object.entries(n.childTypeConstraints)) {
      const a = e.filter(
        (l) => (l.type ?? "default") === r
      ).length;
      s.min !== void 0 && a < s.min && o.push(`Requires at least ${s.min} "${r}" node(s)`), s.max !== void 0 && a > s.max && o.push(`Maximum ${s.max} "${r}" node(s) allowed`);
    }
  return o;
}
function Wt(t, e) {
  const n = Ut(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function na(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Sh(t, e, n = !0) {
  const o = Wt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Wt(i);
    return n ? na(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function kh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Wt(t), i = Wt(e);
  return n ? na(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function Lh(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const a of o) {
    const l = r + e, c = s + n, d = a.x + a.width, u = a.y + a.height;
    if (r < d + i && l > a.x - i && s < u + i && c > a.y - i) {
      const f = l - (a.x - i), h = d + i - r, g = c - (a.y - i), p = u + i - s, y = Math.min(f, h, g, p);
      y === f ? r -= f : y === h ? r += h : y === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function Ph(t) {
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
      B("init", `Adding ${o.length} node(s)`, o.map((d) => d.id));
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
                  (p) => p.parentId === d.parentId
                ),
                ...r.filter(
                  (p) => p.parentId === d.parentId
                )
              ], g = ta(f, d, h, u);
              if (!g.valid) {
                t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: f,
                  child: d,
                  operation: "add",
                  rule: g.rule,
                  message: g.message
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
      const a = t._container ? De.get(t._container) : void 0;
      if (a?.bridge)
        for (const d of o)
          a.bridge.pushLocalNodeAdd(d);
      n?.center && requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (const [d, u] of i) {
            const f = t.nodes.find((p) => p.id === d);
            if (!f) continue;
            const h = f.dimensions?.width ?? 0, g = f.dimensions?.height ?? 0;
            f.position.x = u.x - h / 2, f.position.y = u.y - g / 2;
          }
        });
      }), t._recomputeChildValidation();
      const l = /* @__PURE__ */ new Set();
      for (const d of o)
        if (d.parentId && t._nodeMap.get(d.parentId)?.childLayout) {
          if (d.order == null) {
            const f = t.nodes.filter(
              (h) => h.parentId === d.parentId && h.id !== d.id
            );
            d.order = f.length > 0 ? Math.max(...f.map((h) => h.order ?? 0)) + 1 : 0;
          }
          l.add(d.parentId);
        }
      const c = /* @__PURE__ */ new Set();
      for (const d of l) {
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
        const g = t._nodeMap.get(f.parentId);
        if (!g) continue;
        const p = t.nodes.filter(
          (m) => m.parentId === f.parentId
        ), y = no(g, f, p, h);
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
        for (const f of pt(u, t.nodes))
          n.add(f);
      B("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = bf(n, t.nodes, t.edges));
      const a = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (a.push(u.id), !1) : !0), s.length && (t.edges.push(...s), B("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u), t._draggingNodeIds?.delete(u);
      for (const u of a)
        t._edgeDirtyTicks?.delete(u), t._edgeCorridors?.delete(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const l = t._container ? De.get(t._container) : void 0;
      if (l?.bridge) {
        for (const u of n)
          l.bridge.pushLocalNodeRemove(u);
        for (const u of a)
          l.bridge.pushLocalEdgeRemove(u);
        for (const u of s)
          l.bridge.pushLocalEdgeAdd(u);
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
      return Zo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return wf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return yf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return _f(e, n, t.edges, o);
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
      B("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (B("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? Sh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : kh(i, r, o);
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
function Mh(t) {
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
        const a = { source: s.source, sourceHandle: s.sourceHandle, target: s.target, targetHandle: s.targetHandle };
        return ft(a, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), B("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
      const r = t._container ? De.get(t._container) : void 0;
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
      B("edge", `Removing ${n.size} edge(s)`, [...n]);
      const o = t.edges.filter((r) => n.has(r.id));
      t.edges = t.edges.filter((r) => !n.has(r.id)), t._rebuildEdgeMap();
      for (const r of n)
        t.selectedEdges.delete(r), t._edgeDirtyTicks?.delete(r), t._edgeCorridors?.delete(r);
      o.length && t._emit("edges-change", { type: "remove", edges: o });
      const i = t._container ? De.get(t._container) : void 0;
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
function Th(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Sr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Ru(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = qt(to(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n?.padding ?? jo
      );
      B("viewport", "fitBounds", { rect: e, viewport: i });
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), qt(to(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n ?? jo
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      B("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Zi, o);
      B("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Zi, o);
      B("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, a = r.clientWidth / 2 - e * s, l = r.clientHeight / 2 - n * s;
      B("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: a, y: l, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      B("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, B("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
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
      B("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let bt = null;
const Ah = 20;
function Qo(t) {
  return JSON.parse(JSON.stringify(t));
}
function vs(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function oa(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return bt = {
    nodes: Qo(n),
    edges: Qo(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function Nh() {
  if (!bt || bt.nodes.length === 0) return null;
  bt.pasteCount++;
  const t = bt.pasteCount * Ah, e = /* @__PURE__ */ new Map(), n = bt.nodes.map((i) => {
    const r = vs(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Qo(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = bt.edges.map((i) => ({
    ...i,
    id: vs(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function Ih(t, e) {
  const n = oa(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function $h(t) {
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
        B("selection", "Deselecting all");
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
      const e = [...t.selectedNodes].filter((l) => {
        const c = t.getNode(l);
        return c ? Sf(c) : !1;
      }), n = [...t.selectedEdges].filter((l) => t.getEdge(l)?.deletable !== !1);
      let o = e.map((l) => t.getNode(l)).filter(Boolean);
      const i = new Set(e), r = t.edges.filter(
        (l) => i.has(l.source) || i.has(l.target)
      ), s = /* @__PURE__ */ new Map();
      for (const l of r) s.set(l.id, l);
      for (const l of n) {
        const c = t.getEdge(l);
        c && s.set(c.id, c);
      }
      const a = [...s.values()];
      if (o = o.filter((l) => {
        if (!l.parentId || o.some((h) => h.id === l.parentId)) return !0;
        const c = t._getChildValidation(l.parentId);
        if (!c) return !0;
        const d = t.getNode(l.parentId);
        if (!d) return !0;
        const u = t.nodes.filter(
          (h) => h.parentId === l.parentId
        ), f = no(d, l, u, c);
        return !f.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: d,
          child: l,
          operation: "remove",
          rule: f.rule,
          message: f.message
        }), f.valid;
      }), !(o.length === 0 && a.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const l = await t._config.onBeforeDelete({
            nodes: o,
            edges: a
          });
          if (l === !1) {
            B("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (l.nodes.length > 0 && (B("delete", `onBeforeDelete approved ${l.nodes.length} node(s)`), t.removeNodes(l.nodes.map((c) => c.id))), l.edges.length > 0) {
              const c = l.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
              c.length > 0 && (B("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
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
          if (o.length > 0 && (B("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((l) => l.id))), n.length > 0) {
            const l = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            l.length > 0 && (B("delete", `Deleting ${l.length} selected edge(s)`), t.removeEdges(l));
          }
          t._recomputeChildValidation();
          for (const l of t.selectedNodes)
            t.nodes.some((c) => c.id === l) || t.selectedNodes.delete(l);
          for (const l of t.selectedEdges)
            t.edges.some((c) => c.id === l) || t.selectedEdges.delete(l);
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
      const e = oa(t.nodes, t.edges);
      e.nodeCount > 0 && (B("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
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
      const e = Nh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Pt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), B("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
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
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), B("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Dh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function oo(t, e, n = {}) {
  const o = n.deleteMissing ?? !0, i = new Map(t.map((s) => [s.id, s])), r = [];
  for (const s of e) {
    const a = i.get(s.id);
    if (!a) {
      r.push(s);
      continue;
    }
    if (o)
      for (const l of Object.keys(a))
        l !== "id" && !(l in s) && delete a[l];
    for (const [l, c] of Object.entries(s))
      l === "id" || l === "__proto__" || l === "constructor" || l === "prototype" || Dh(a[l], c) || (a[l] = c);
    r.push(a);
  }
  return r;
}
function _s(t, e, n) {
  const o = oo(t.nodes, Pt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = oo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), B("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
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
      if (B("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes) {
        const n = Pt(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = oo(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = oo(t.edges, n);
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
      B("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      B("store", "$clear: emptying canvas"), this.fromObject({
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
      e && _s(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && _s(t, e, "redo");
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
function Rh(t, e) {
  return t * (1 - e);
}
function Fh(t, e) {
  return t * e;
}
function Oh(t, e) {
  return e === "in" ? t : 1 - t;
}
function zh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? Rh(o, e) : Fh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function Vh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function Bh(t, e, n) {
  t.style.opacity = String(Oh(e, n));
}
function qh(t) {
  t.style.removeProperty("opacity");
}
const tt = Math.PI * 2, tn = /* @__PURE__ */ new Map(), Xh = 64;
function _i(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = tn.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (tn.size >= Xh) {
    const r = tn.keys().next().value;
    r !== void 0 && tn.delete(r);
  }
  return tn.set(t, i), i;
}
function wy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(tt * l * a + o * tt),
    y: n + s * Math.sin(tt * l * a + o * tt)
  });
}
function vy(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), u = d > 0 ? l / d : 1, h = -(d > 0 ? c / d : 0), g = u;
  return (p) => {
    const y = e + l * p, m = n + c * p, _ = r * Math.sin(tt * s * p + a * tt);
    return { x: y + h * _, y: m + g * _ };
  };
}
function _y(t, e) {
  const n = _i(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function by(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(tt * a + r * tt);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function xy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * tt, f = (Math.sin(s * u) + Math.sin(a * u * 1.3)) / 2, h = (Math.sin(l * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function Ey(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let bs = !1;
function we(t) {
  try {
    return structuredClone(t);
  } catch {
    return bs || (bs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function Yh(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: we(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function Wh(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function jh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = we(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class bi {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Mr();
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
    const o = new bi(this._canvas, this._engine);
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
    return Tr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, Yh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, Wh(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && jh(o, n);
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
        const a = s.config, l = typeof a == "function" ? a(this._makeContext(r)) : a;
        l.parallel ? await this._executeParallelSteps(l.parallel, r) : await this._executeStep(l, r);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = Jn(e.easing), a = this._makeContext(n, e.id);
    if (e.when && !e.when(a)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const A = e.timeline;
      if (this._tag && !e.independent && A.setTag(this._tag), e.independent || this._subTimelines.push(A), this._emit("step", { index: n, id: e.id, timeline: A }), e.onStart?.(a), await A.play(), this._state === "stopped") return;
      if (e.onComplete?.(a), this._emit("step-complete", { timeline: A }), !e.independent) {
        const $ = this._subTimelines.indexOf(A);
        $ >= 0 && this._subTimelines.splice($, 1);
      }
      return;
    }
    if (this._emit("step", { index: n, id: e.id }), e.onStart?.(a), e.await && (await this._resolveAwait(e, n), this._state === "stopped"))
      return;
    if (e.await && this._isAwaitOnlyStep(e))
      return e.onProgress?.(1, a), e.onComplete?.(a), this._emit("step-complete"), Promise.resolve();
    const { validNodeIds: l, validEdgeIds: c } = this._validateStepTargets(e, n);
    if (this._isEmptyStep(e, l, c))
      return e.onProgress?.(1, a), e.onComplete?.(a), this._emit("step-complete"), Promise.resolve();
    const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, l, d, u);
    const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, f, h);
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, _ = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, _ = this._resolveTargetViewport(e));
    const E = e.edgeTransition ?? "none", b = e.addEdges?.map((A) => A.id) ?? [], x = e.removeEdges?.filter((A) => this._canvas.getEdge(A)).slice() ?? [], M = {
      step: e,
      ctx: a,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: l,
      validEdgeIds: c,
      resolvedPathFn: g,
      guidePathEl: p,
      nodeFromDimensions: d,
      nodeFromStyles: u,
      edgeFromStrokeWidth: f,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: _,
      transition: E,
      addEdgeIds: b,
      removeEdgeIds: x
    };
    if (i === 0)
      return this._executeInstantStep(M);
    const P = this._prepareAnimatedEdges(e, E, b);
    return P && await P, g ? this._executeFollowPathStep(M) : this._executeAnimatedStep(M);
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
    const i = e.nodes && e.nodes.length > 0, r = e.edges && e.edges.length > 0, s = !!(e.viewport || e.fitView || e.panTo), a = !!(e.addEdges?.length || e.removeEdges?.length), l = i && (!n || n.length === 0), c = r && (!o || o.length === 0);
    return !!(l && c && !s && !a || l && !r && !s && !a || c && !i && !s && !a);
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
        const r = new Promise((a) => {
          i = setTimeout(() => a("timeout"), e.timeout);
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
    const n = _i(e.followPath);
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
    const { step: n, ctx: o, delay: i, resolvedPathFn: r, validNodeIds: s, guidePathEl: a } = e;
    if (i > 0)
      return new Promise((l) => {
        const c = setTimeout(() => {
          this._applyStepFinal(n), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), l();
        }, i), d = {
          stop() {
            clearTimeout(c);
          }
        };
        this._activeHandles.push(d);
      });
    if (r && s) {
      const l = r(1);
      for (const c of s) {
        const d = this._canvas.getNode(c);
        d && (d.position.x = l.x, d.position.y = l.y);
      }
    }
    return this._applyStepFinal(n), a && n.guidePath?.autoRemove !== !1 && a.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), Promise.resolve();
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
      validNodeIds: a,
      validEdgeIds: l,
      nodeFromDimensions: c,
      nodeFromStyles: d,
      edgeFromStrokeWidth: u,
      edgeFromColor: f,
      viewportFrom: h,
      viewportTarget: g,
      transition: p,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: _
    } = e, E = e.resolvedPathFn;
    return new Promise((b) => {
      const x = this._engine.register((M) => {
        if (this._state === "stopped")
          return b(), !0;
        const P = Math.min(M / i, 1), A = s(P);
        if (a) {
          const $ = E(A);
          for (const C of a) {
            const T = this._canvas.getNode(C);
            T && (T.position.x = $.x, T.position.y = $.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          A,
          a,
          l,
          c,
          d,
          u,
          f,
          h,
          g
        ), this._tickEdgeTransitions(p, y, m, A), n.onProgress?.(P, o), P >= 1 ? (this._cleanupEdgeTransitions(p, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), _ && n.guidePath?.autoRemove !== !1 && _.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), b(), !0) : !1;
      }, r);
      this._activeHandles.push(x);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, a, l, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = nt(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = nt(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = mn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), g = s.get(f);
        h && g && (h.style = Ar(g, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 ? f.strokeWidth = nt(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = mi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = Zu(c, d, n, {
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
      validEdgeIds: a,
      viewportFrom: l,
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
        a,
        l,
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
          onProgress: (_) => {
            if (this._state === "stopped") {
              m.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, u, f, _), n.onProgress?.(_, o);
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
      for (const a of n) {
        const l = {};
        e.position && (l.position = { ...e.position }), e.dimensions && (l.dimensions = { ...e.dimensions }), e.style !== void 0 && (l.style = e.style), e.class !== void 0 && (l.class = e.class), e.data !== void 0 && (l.data = e.data), e.selected !== void 0 && (l.selected = e.selected), e.zIndex !== void 0 && (l.zIndex = e.zIndex), s.nodes[a] = l;
      }
    }
    if (o) {
      s.edges = {};
      for (const a of o) {
        const l = {};
        e.edgeColor !== void 0 && (l.color = e.edgeColor), e.edgeStrokeWidth !== void 0 && (l.strokeWidth = e.edgeStrokeWidth), e.edgeLabel !== void 0 && (l.label = e.edgeLabel), e.edgeAnimated !== void 0 && (l.animated = e.edgeAnimated), e.edgeClass !== void 0 && (l.class = e.edgeClass), s.edges[a] = l;
      }
    }
    return r && i && (s.viewport = {
      pan: { x: r.x, y: r.y },
      zoom: r.zoom
    }), s;
  }
  /** Run edge lifecycle transitions (draw/fade) via the engine when there are no other animatable targets. */
  _executeEdgeLifecycleOnly(e, n) {
    const { step: o, ctx: i, duration: r, delay: s, transition: a, addEdgeIds: l, removeEdgeIds: c, guidePathEl: d } = e, u = this._engine.register((f) => {
      if (this._state === "stopped")
        return n(), !0;
      const h = Math.min(f / r, 1);
      return this._tickEdgeTransitions(a, l, c, h), o.onProgress?.(h, i), h >= 1 ? (this._cleanupEdgeTransitions(a, l, c), c.length && this._removeEdges(c), d && o.guidePath?.autoRemove !== !1 && d.remove(), o.onProgress?.(1, i), o.onComplete?.(i), this._emit("step-complete"), n(), !0) : !1;
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
      r && zh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && Vh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && Bh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && qh(o);
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
    const r = n.dimensions?.width ?? ve, s = n.dimensions?.height ?? _e, a = n.position.x + r / 2, l = n.position.y + s / 2;
    return {
      x: i.width / 2 - a * o.zoom,
      y: i.height / 2 - l * o.zoom,
      zoom: o.zoom
    };
  }
  /** Apply viewport at final values (for instant steps). */
  _applyViewportFinal(e) {
    const n = this._resolveTargetViewport(e);
    !n || !this._canvas.viewport || (this._canvas.viewport.x = n.x, this._canvas.viewport.y = n.y, this._canvas.viewport.zoom = n.zoom);
  }
}
const ia = /* @__PURE__ */ new Map();
function Zt(t, e) {
  ia.set(t, e);
}
function Uh(t) {
  return ia.get(t);
}
const He = "http://www.w3.org/2000/svg", Zh = {
  create(t, e) {
    const n = document.createElementNS(He, "circle");
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
}, Gh = {
  create(t, e) {
    const n = document.createElementNS(He, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(He, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(He, "circle");
    if (s.setAttribute("r", String(o)), s.setAttribute("fill", i), n.appendChild(s), e.class)
      for (const a of e.class.split(" "))
        a && n.classList.add(a);
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
let Kh = 0;
const Jh = {
  create(t, e) {
    const n = document.createElementNS(He, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Kh}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, a = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, u = n.__gradient;
      if (!d) {
        let p = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(He, "defs");
          u = document.createElementNS(He, "linearGradient"), u.setAttribute("id", a), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const _ = document.createElementNS(He, "stop");
            _.setAttribute("offset", String(m.offset)), _.setAttribute("stop-color", m.color), m.opacity !== void 0 && _.setAttribute("stop-opacity", String(m.opacity)), u.appendChild(_);
          }
          y.appendChild(u), n.appendChild(y), p = `url(#${a})`, n.__gradient = u;
        }
        d = document.createElementNS(He, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = p, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, g = o - h;
      if (d.setAttribute("stroke-dashoffset", String(g)), u) {
        const p = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(p), _ = e.pathEl.getPointAtLength(y);
        u.setAttribute("x1", String(_.x)), u.setAttribute("y1", String(_.y)), u.setAttribute("x2", String(m.x)), u.setAttribute("y2", String(m.y));
      }
      return;
    }
    let l = n.__fallbackRect;
    l || (l = document.createElementNS(He, "rect"), l.setAttribute("width", String(o)), l.setAttribute("height", String(i)), l.setAttribute("rx", String(i / 2)), l.setAttribute("fill", r), l.setAttribute("opacity", "0.8"), n.appendChild(l), n.__fallbackRect = l);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    l.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, Qh = {
  create(t, e) {
    const n = document.createElementNS(He, "circle");
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
}, eg = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(He, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(He, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
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
Zt("circle", Zh);
Zt("orb", Gh);
Zt("beam", Jh);
Zt("pulse", Qh);
Zt("image", eg);
let xs = !1;
function tg(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function Es(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : tg(o);
}
function ng(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = Uh(a);
    if (!l) {
      B("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    a === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !xs && (xs = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? pn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), g = Es(r, h, f), p = { ...r, size: d, color: u }, y = l.create(i, p), m = o.getPointAtLength(0), _ = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    l.update(y, _);
    let E;
    const b = new Promise(($) => {
      E = $;
    }), x = () => {
      typeof r.onComplete == "function" && r.onComplete(), E();
    }, M = s.wrapOnComplete ? s.wrapOnComplete(x) : x, P = {
      element: y,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: M,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(P), t._particleEngineHandle || (t._particleEngineHandle = Kn.register(($) => t._tickParticles($))), {
      getCurrentPosition() {
        return t._activeParticles.has(P) ? { ...P.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(P) && (P.renderer.destroy(P.element), t._activeParticles.delete(P), M());
      },
      get finished() {
        return b;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      B("particle", "sendParticleAlongPath: SVG layer unavailable");
      return;
    }
    const s = document.createElementNS("http://www.w3.org/2000/svg", "path");
    s.setAttribute("d", o), s.style.display = "none", r.appendChild(s);
    const a = e(s, r, i, {
      wrapOnComplete: (l) => () => {
        l(), s.remove();
      }
    });
    if (!a) {
      s.remove();
      return;
    }
    return B("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), a;
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
        let a = i.get(r.pathEl);
        a === void 0 && (a = r.pathEl.getTotalLength(), i.set(r.pathEl, a));
        const l = r.pathEl.getPointAtLength(s * a), c = {
          x: l.x,
          y: l.y,
          progress: s,
          velocity: {
            x: l.x - r.currentPosition.x,
            y: l.y - r.currentPosition.y
          },
          pathLength: a,
          elapsed: o - r.startElapsed,
          pathEl: r.pathEl
        };
        r.renderer.update(r.element, c), r.currentPosition = { x: l.x, y: l.y };
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
        B("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const a = t.getEdgePathElement(o);
      if (!a) {
        B("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!a.getAttribute("d")) {
        B("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? pn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(a, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return g && B("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), g;
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
        B("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const a = t.getNode(i);
      if (!a) {
        B("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const l = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = a.position.x + (a.dimensions?.width ?? 150) / 2, u = a.position.y + (a.dimensions?.height ?? 40) / 2, f = `M ${l} ${c} L ${d} ${u}`;
      return B("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
    },
    // ── Burst: sequenced multi-particle emission ─────────────────────────
    /**
     * Fire multiple particles along a single edge with staggered timing.
     * An optional `variant` function customizes each particle individually.
     */
    sendParticleBurst(o, i) {
      const { count: r, stagger: s = 100, variant: a, ...l } = i, c = [], d = [];
      for (let f = 0; f < r; f++) {
        const h = a ? { ...l, ...a(f, r) } : { ...l };
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
      const { targetNodeId: r, synchronize: s = "arrival", onAllArrived: a, ...l } = i, c = [], d = [];
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
        const h = Math.max(...f.map((p) => p.length)), g = Es(l, h, "2s");
        for (const { id: p, length: y } of f) {
          const m = y / h, _ = g * m, E = g - _;
          if (E <= 0) {
            const b = this.sendParticle(p, { ...l, duration: _ });
            b && c.push(b);
          } else {
            const b = setTimeout(() => {
              const x = this.sendParticle(p, { ...l, duration: _ });
              x && c.push(x);
            }, E);
            d.push(b);
          }
        }
      } else
        for (const f of o) {
          const h = this.sendParticle(f, l);
          h && c.push(h);
        }
      const u = new Promise((f) => {
        setTimeout(() => {
          Promise.all(c.map((g) => g.finished)).then(() => {
            a?.(), f();
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
class og {
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
const ei = 1, ti = 1 / 60;
class rn {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = we(e);
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
    return we(this._state);
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
            o?.id && (this._state.nodes[o.id] = we(o));
        else n?.id ? this._state.nodes[n.id] = we(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = we(e.args.node));
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
            o?.id && (this._state.edges[o.id] = we(o));
        else n?.id ? this._state.edges[n.id] = we(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = we(e.args.edge));
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
    this._state = we(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = we(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: we(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Dr(r) ?? void 0 : void 0, a = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: we(o),
      startTime: this._virtualTime,
      duration: i.duration,
      easing: i.easing,
      motion: s,
      direction: "forward",
      currentValues: {},
      _motion: s
    };
    this._initAnim(a), this._inFlight.set(n, a);
  }
  _initAnim(e) {
    const n = {}, o = {};
    if (this._collectNumericProperties(e.targets, n, o, this._state), e._from = n, e.type === "eased")
      e._easingFn = Jn(e.easing);
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
    for (const [s, a] of Object.entries(e.nodes ?? {})) {
      const l = i.nodes[s];
      if (!l)
        continue;
      const c = a.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = l.position?.x ?? 0, o[`nodes.${s}.position.x`] = c.x), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = l.position?.y ?? 0, o[`nodes.${s}.position.y`] = c.y);
    }
    const r = e.viewport;
    r?.pan?.x !== void 0 && (n["viewport.x"] = i.viewport.x, o["viewport.x"] = r.pan.x), r?.pan?.y !== void 0 && (n["viewport.y"] = i.viewport.y, o["viewport.y"] = r.pan.y), r?.zoom !== void 0 && (n["viewport.zoom"] = i.viewport.zoom, o["viewport.zoom"] = r.zoom);
  }
  _rehydrateAnim(e) {
    if (e._motion = e.motion, e.type === "eased") {
      e._easingFn = Jn(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
    return we({
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
      const a = e._from[s], l = this._getTargetValue(s, e.targets) ?? a, c = nt(a, l, r);
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
            Nr(r, o, n);
            break;
          case "decay":
            yi(r, o, n);
            break;
          case "inertia":
            Ir(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            $r(r, s, l, i), l >= 1 && (r.settled = !0);
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
const sa = /* @__PURE__ */ new Map();
function xi(t, e) {
  sa.set(t, e);
}
function ig(t) {
  return sa.get(t);
}
function Ei(t, e = 20) {
  const n = Object.values(t);
  if (n.length === 0)
    return null;
  let o = 1 / 0, i = 1 / 0, r = -1 / 0, s = -1 / 0;
  for (const a of n) {
    const l = a.position?.x ?? 0, c = a.position?.y ?? 0, d = a.dimensions?.width ?? 150, u = a.dimensions?.height ?? 40;
    o = Math.min(o, l), i = Math.min(i, c), r = Math.max(r, l + d), s = Math.max(s, c + u);
  }
  return o -= e, i -= e, r += e, s += e, { minX: o, minY: i, vbWidth: r - o, vbHeight: s - i };
}
function ra(t) {
  let e = "";
  for (const n of Object.values(t.edges)) {
    const o = t.nodes[n.source], i = t.nodes[n.target];
    if (!o || !i)
      continue;
    const r = (o.position?.x ?? 0) + (o.dimensions?.width ?? 150) / 2, s = (o.position?.y ?? 0) + (o.dimensions?.height ?? 40) / 2, a = (i.position?.x ?? 0) + (i.dimensions?.width ?? 150) / 2, l = (i.position?.y ?? 0) + (i.dimensions?.height ?? 40) / 2;
    e += `<line x1="${r}" y1="${s}" x2="${a}" y2="${l}" stroke="currentColor" stroke-width="1" opacity="0.5"/>`;
  }
  return e;
}
const sg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Ei(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += ra(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, rg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Ei(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
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
}, ag = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = Ei(t.nodes);
    if (!r)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const s = /* @__PURE__ */ new Set();
    if (o) {
      for (const f of o)
        if (f.targets?.nodes)
          for (const h of Object.keys(f.targets.nodes))
            s.add(h);
    }
    const { minX: a, minY: l, vbWidth: c, vbHeight: d } = r;
    let u = `<svg width="${e}" height="${n}" viewBox="${a} ${l} ${c} ${d}" xmlns="http://www.w3.org/2000/svg">`;
    u += ra(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, g = f.position?.y ?? 0, p = f.dimensions?.width ?? 150, y = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${g}" width="${p}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
xi("faithful", sg);
xi("outline", rg);
xi("activity", ag);
function ni(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function oi(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function lg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function aa(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      aa(t[e]);
  }
  return t;
}
class Ci {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = aa(we(e.initialState)), this.events = Object.freeze(we(e.events)), this.checkpoints = Object.freeze(we(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: we(this.initialState),
      events: we(this.events),
      checkpoints: we(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > ei)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${ei}). Please update AlpineFlow to replay this recording.`
      );
    return new Ci(e);
  }
  /**
   * Returns unique subjects (nodes, edges, timelines, particles) that appeared
   * during the recording, with their first-seen and last-seen timestamps.
   */
  getSubjects() {
    const e = /* @__PURE__ */ new Map(), n = (o, i, r) => {
      const s = `${o}:${i}`, a = e.get(s);
      a ? (r < a.firstSeenT && (a.firstSeenT = r), r > a.lastSeenT && (a.lastSeenT = r)) : e.set(s, { kind: o, id: i, firstSeenT: r, lastSeenT: r });
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
          for (const a of Object.keys(s.targets?.nodes ?? {}))
            n("node", a, i);
          for (const a of Object.keys(s.targets?.edges ?? {}))
            n("edge", a, i);
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
            for (const a of s.sources)
              n("edge", a, i);
          s.options?.targetNodeId && n("node", s.options.targetNodeId, i);
          break;
        case "node-add":
        case "node-remove":
          if (s.id && n("node", s.id, i), Array.isArray(s.nodes))
            for (const a of s.nodes)
              a.id && n("node", a.id, i);
          break;
        case "edge-add":
        case "edge-remove":
          if (s.id && n("edge", s.id, i), Array.isArray(s.edges))
            for (const a of s.edges)
              a.id && n("edge", a.id, i);
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
            return !!(s.id === e || Array.isArray(s.nodes) && s.nodes.some((l) => l.id === e));
          case "edge-add":
          case "edge-remove":
            return !!(s.id === e || Array.isArray(s.edges) && s.edges.some((l) => l.id === e));
          default:
            return !1;
        }
      })())
        switch (r) {
          case "animate": {
            const l = s.options?.duration ?? 0;
            n.push({ startT: i, endT: i + l, reason: "animate" });
            break;
          }
          case "particle":
          case "particle-burst":
          case "particle-between": {
            const l = s.options?.duration ?? s.duration ?? 1;
            n.push({ startT: i, endT: i + l, reason: r });
            break;
          }
          case "converging": {
            const l = s.options?.duration ?? 1;
            n.push({ startT: i, endT: i + l, reason: "converging" });
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
      const i = lg(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new rn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const a = ti * 1e3;
    let l = o ? ni(r, i) : oi(r, i);
    for (; s < e; ) {
      const c = Math.min(s + a, e);
      for (; l < r.length && r[l].t <= c; )
        n.applyEvent(r[l]), l++;
      const d = (c - s) / 1e3;
      n.advance(d), s = c;
    }
    return n.getState();
  }
  /**
   * Renders a thumbnail SVG snapshot of the canvas state at virtual time `t`.
   */
  renderThumbnailAt(e, n) {
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = ig(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class cg {
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
      version: ei,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Ci(i);
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
    for (const [s, a] of Object.entries(o)) {
      const l = i.get(s);
      if (!l) continue;
      const c = a.position;
      c?.x !== void 0 && (n[`nodes.${s}.position.x`] = l.position?.x ?? 0), c?.y !== void 0 && (n[`nodes.${s}.position.y`] = l.position?.y ?? 0);
    }
    const r = e?.viewport;
    return r?.pan?.x !== void 0 && (n["viewport.x"] = this._canvas.viewport.x), r?.pan?.y !== void 0 && (n["viewport.y"] = this._canvas.viewport.y), r?.zoom !== void 0 && (n["viewport.zoom"] = this._canvas.viewport.zoom), n;
  }
  _captureSnapshot() {
    const e = {};
    for (const o of this._canvas.nodes ?? [])
      o && typeof o == "object" && "id" in o && (e[o.id] = we(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = we(o));
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
        const l = o.motion;
        typeof l == "string" ? r = l.split(".")[0] : l && typeof l == "object" && l.type && (r = l.type);
      }
      let s = {};
      const a = n.handle?.currentValue;
      a && typeof a.forEach == "function" && a.forEach((l, c) => {
        s[c] = l;
      }), e.push({
        handleId: n.handleId,
        type: r,
        targets: we(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? we(o.motion) : void 0,
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
      typeof s == "function" && (this._originalMethods[o] = s, this._canvas[o] = (...a) => {
        const l = r ? r(...a) : { args: a };
        return this._recordEvent(i, l), s.apply(this._canvas, a);
      });
    }, n = (o, i) => {
      const r = this._canvas[o];
      typeof r == "function" && (this._originalMethods[o] = r, this._canvas[o] = (s, a) => {
        const l = `rec-${++this._eventCounter}`, c = this._virtualNow(), d = this._snapshotFromValues(s);
        this._recordEvent(i, { targets: s, options: a, handleId: l });
        const u = r.apply(this._canvas, [s, a]);
        if (u && typeof u == "object" && u.finished && !u.isFinished) {
          const f = { handleId: l, eventT: c, targets: s, options: a, handle: u, fromValues: d };
          this._activeAnims.set(l, f), u.finished.then(() => {
            this._activeAnims.delete(l);
          }).catch(() => {
            this._activeAnims.delete(l);
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
class dg {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new rn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Lo(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new rn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new rn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const a = ti * 1e3;
    let l = n ? ni(r, i) : oi(r, i);
    for (; s < e; ) {
      const c = Math.min(s + a, e);
      for (; l < r.length && r[l].t <= c; )
        o.applyEvent(r[l]), l++;
      const d = (c - s) / 1e3;
      d > 0 && o.advance(d), s = c;
    }
    return o.getState();
  }
  // ── Private ─────────────────────────────────────────────────────────────
  _tick() {
    if (this._state !== "playing")
      return;
    const e = Lo(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new rn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = ti * 1e3;
    let a = e === 0 ? oi(i, 0) : ni(i, e);
    for (; r < n; ) {
      const l = Math.min(r + s, n);
      for (; a < i.length && i[a].t <= l; ) {
        const d = i[a];
        this._virtualEngine.applyEvent(d), o && this._dispatchLiveParticle(d), a++;
      }
      const c = (l - r) / 1e3;
      c > 0 && this._virtualEngine.advance(c), r = l;
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Lo(), this._scheduleTick();
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
          const a = this._canvas.nodes.findIndex((l) => l?.id === s);
          a !== -1 && this._canvas.nodes.splice(a, 1);
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
          const a = this._canvas.edges.findIndex((l) => l?.id === s);
          a !== -1 && this._canvas.edges.splice(a, 1);
        }
  }
}
function Lo() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function ug(t) {
  const e = ng(t);
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
      const n = new bi(t, Kn);
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
        B("animation", `Named animation "${n}" not found`);
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
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = n.nodes ? Object.keys(n.nodes).length : 0, d = n.edges ? Object.keys(n.edges).length : 0;
      if (B("animate", "update() called", {
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
            let _ = null;
            typeof g.followPath == "function" ? _ = g.followPath : _ = _i(g.followPath);
            let E = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const b = t.getEdgeSvgElement?.();
              b && (E = document.createElementNS("http://www.w3.org/2000/svg", "path"), E.setAttribute("d", g.followPath), E.classList.add("flow-guide-path"), g.guidePath.class && E.classList.add(g.guidePath.class), b.appendChild(E));
            }
            if (_) {
              const b = _, x = E, M = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (P) => {
                  const A = t._nodeMap.get(h);
                  if (!A) return;
                  const $ = b(P);
                  Se().raw(A).position.x = $.x, Se().raw(A).position.y = $.y, s.add(h), P >= 1 && x && M && x.remove();
                }
              });
            }
          } else if (g.position) {
            const E = Se().raw(p).position;
            if (g.position.x !== void 0) {
              const b = g.position.x;
              if (m)
                E.x = b;
              else {
                const x = E.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: x,
                  to: b,
                  apply: (M) => {
                    const P = t._nodeMap.get(h);
                    P && (Se().raw(P).position.x = M, s.add(h));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const b = g.position.y;
              if (m)
                E.y = b;
              else {
                const x = E.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: x,
                  to: b,
                  apply: (M) => {
                    const P = t._nodeMap.get(h);
                    P && (Se().raw(P).position.y = M), s.add(h);
                  }
                });
              }
            }
            m && s.add(h);
          }
          if (g.data !== void 0 && Object.assign(p.data, g.data), g.class !== void 0 && (p.class = g.class), g.selected !== void 0 && (p.selected = g.selected), g.zIndex !== void 0 && (p.zIndex = g.zIndex), g.style !== void 0)
            if (m)
              p.style = g.style, a.add(h);
            else {
              const _ = mn(p.style || {}), E = mn(g.style), b = t._nodeElements.get(h);
              if (b) {
                const x = getComputedStyle(b);
                for (const M of Object.keys(E))
                  _[M] === void 0 && (_[M] = x.getPropertyValue(M));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (x) => {
                  const M = t._nodeMap.get(h);
                  M && (Se().raw(M).style = Ar(_, E, x), a.add(h));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (m ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (_) => {
              p.dimensions.width = _;
            }
          })), g.dimensions.height !== void 0 && (p.fixedDimensions = !0, m ? p.dimensions.height = g.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: p.dimensions.height,
            to: g.dimensions.height,
            apply: (_) => {
              p.dimensions.height = _;
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
              p.color = g.color, l.add(h);
            else {
              const _ = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || pi;
              r.push({
                key: `edge:${h}:color`,
                from: _,
                to: g.color,
                apply: (E) => {
                  const b = t._edgeMap.get(h);
                  b && (Se().raw(b).color = E, l.add(h));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (m)
              p.strokeWidth = g.strokeWidth, l.add(h);
            else {
              const _ = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: _,
                to: g.strokeWidth,
                apply: (E) => {
                  const b = t._edgeMap.get(h);
                  b && (Se().raw(b).strokeWidth = E, l.add(h));
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
        s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s)), a.size > 0 && t._flushNodeStyles(a), l.size > 0 && t._flushEdgeStyles(l);
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
      const f = Se().raw(t._animator).animate(r, {
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
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), n.viewport && t._flushViewport(), o.onProgress?.(h);
        },
        onComplete() {
          if (n.nodes)
            for (const [h, g] of Object.entries(n.nodes)) {
              const p = t._nodeMap.get(h);
              if (!p) continue;
              const y = Se().raw(p);
              (g.followPath || g.position?.x !== void 0) && (p.position.x = y.position.x), (g.followPath || g.position?.y !== void 0) && (p.position.y = y.position.y), g.style !== void 0 && (p.style = y.style);
            }
          if (n.edges)
            for (const [h, g] of Object.entries(n.edges)) {
              const p = t._edgeMap.get(h);
              if (!p) continue;
              const y = Se().raw(p);
              g.color !== void 0 && typeof g.color == "string" && (p.color = y.color), g.strokeWidth !== void 0 && (p.strokeWidth = y.strokeWidth);
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), o.onComplete?.();
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
      const i = Tr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const a = o.zoom, l = Kn.register(() => {
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
            const _ = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - _[0]), d.y += m.dimensions.height * (0.5 - _[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const y = n.getCurrentPosition();
          if (y)
            d = y;
          else
            return s = !0, l.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const u = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, f = a ?? t.viewport.zoom, h = u.width / 2 - d.x * f, g = u.height / 2 - d.y * f, p = 0.08;
        return t.viewport.x += (h - t.viewport.x) * p, t.viewport.y += (g - t.viewport.y) * p, a && (t.viewport.zoom += (a - t.viewport.zoom) * p), t._flushViewport(), !1;
      });
      return t._followHandle = l, typeof n == "object" && "_targetNodeIds" in n && n.finished && n.finished.then(() => {
        s || (s = !0, l.stop(), t._followHandle = null, i());
      }), {
        pause: () => {
        },
        resume: () => {
        },
        stop: () => {
          s = !0, l.stop(), t._followHandle = null, i();
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
      return Se().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      Se().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      Se().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      Se().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new og(n, {
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
      const o = Se().raw(t._animator), i = o.beginTransaction();
      i.onAfterRollback?.((r) => {
        const s = /* @__PURE__ */ new Set();
        for (const a of r)
          if (a.startsWith("node:")) {
            const l = a.split(":")[1];
            l && s.add(l);
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
      const n = structuredClone(Se().raw(t.nodes)), o = structuredClone(Se().raw(t.edges)), i = { ...t.viewport };
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
      const i = this, r = i.animate, s = i.update, a = i.sendParticle, l = i.sendParticleAlongPath, c = i.sendParticleBetween, d = i.sendParticleBurst, u = i.sendConverging, f = {
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
        sendParticle: (p, y) => a.call(i, p, y),
        sendParticleAlongPath: (p, y) => l.call(i, p, y),
        sendParticleBetween: (p, y, m) => c.call(i, p, y, m),
        sendParticleBurst: (p, y) => d.call(i, p, y),
        sendConverging: (p, y) => u.call(i, p, y),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, h = new cg(f, o), g = async () => {
        i.animate = (...p) => f.animate(...p), i.update = (...p) => f.update(...p), i.sendParticle = (...p) => f.sendParticle(...p), i.sendParticleAlongPath = (...p) => f.sendParticleAlongPath(...p), i.sendParticleBetween = (...p) => f.sendParticleBetween(...p), i.sendParticleBurst = (...p) => f.sendParticleBurst(...p), i.sendConverging = (...p) => f.sendConverging(...p);
        try {
          const p = n();
          p instanceof Promise && await p;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = a, i.sendParticleAlongPath = l, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = u;
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
        sendParticle: (s, a) => i.sendParticle(s, a),
        sendParticleAlongPath: (s, a) => i.sendParticleAlongPath(s, a),
        sendParticleBetween: (s, a, l) => i.sendParticleBetween(s, a, l),
        sendParticleBurst: (s, a) => i.sendParticleBurst(s, a),
        sendConverging: (s, a) => i.sendConverging(s, a)
      };
      return new dg(r, n, o);
    },
    // ── Cleanup lifecycle ─────────────────────────────────────────────────
    /**
     * Stop all in-flight animations, particles, and timelines.
     *
     * Called BY the canvas `destroy()` lifecycle hook when the element is removed
     * from the DOM — it must not be named `destroy()`. Mixins are applied onto the
     * canvas with `Object.defineProperties`, so a `destroy` here would OVERWRITE
     * `flowCanvas`'s own `destroy()` and silently take the entire canvas teardown
     * (listener removal, panZoom/minimap disposal, store unregistration) out of the
     * lifecycle. It did exactly that until this rename.
     */
    _destroyAnimations() {
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
function Cs(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return pt(t, e);
  const r = /* @__PURE__ */ new Set(), s = Zo(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = Zo(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function fg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Po(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Ss(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = pt(r.id, e);
        for (const a of s)
          i.add(a);
      }
  }
  for (const r of e)
    if (n.targetPositions.has(r.id)) {
      const s = n.targetPositions.get(r.id);
      r.position = { ...s }, i.has(r.id) || (r.hidden = !1);
    }
}
function Mo(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function hg(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Dn = { width: 150, height: 50 };
function gg(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = Cs(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = fg(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? Dn, d = r && s ? s : c, u = {};
        for (const [h] of l.targetPositions) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const p = g.dimensions ?? Dn;
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
            Po(o, t.nodes, l, s), l.reroutedEdges = Mo(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Po(o, t.nodes, l, s), l.reroutedEdges = Mo(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Po(o, t.nodes, l, s), l.reroutedEdges = Mo(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      B("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && hg(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? Dn;
        Ss(o, t.nodes, i, r);
        const l = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const g = h.dimensions ?? Dn;
            let p, y;
            h.parentId === e ? (p = (a.width - g.width) / 2, y = (a.height - g.height) / 2) : (p = o.position.x + (a.width - g.width) / 2, y = o.position.y + (a.height - g.height) / 2), h.position = { x: p, y }, h.style = { ...h.style || {}, opacity: "0" }, l[u] = {
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
        t.animate ? t.animate({ nodes: l }, {
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
        Ss(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (B("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
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
      return Cs(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return pt(e, t.nodes).size;
    }
  };
}
function pg(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, B("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, B("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
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
function mg(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      B("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      B("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
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
      t.selectedRows.size !== 0 && (B("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, B("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
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
          const a = s.sourceHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          a && r.add(a);
        }
        if (s.targetHandle?.startsWith(e + ".")) {
          const a = s.targetHandle.slice(e.length + 1).replace(/-[lr]$/, "");
          a && r.add(a);
        }
      }
      return i === "connected" ? n.filter((s) => r.has(s.id)) : n.filter((s) => !r.has(s.id));
    }
  };
}
const yg = 8, wg = 12, vg = 2;
function Si(t) {
  return {
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function _g(t) {
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
function bg(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function ks(t, e, n) {
  const o = e.gap ?? yg, i = e.padding ?? wg, r = e.headerHeight ?? 0, s = _g(e), a = bg(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? xg(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? Eg(a, o, i, r, s, u, l, c) : Cg(a, o, i, r, s, e.columns ?? vg, d, u, l, c);
}
function xg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Si(f));
  for (const f of c) l = Math.max(l, f.width);
  const d = r > 0 ? r : l;
  let u = n + o;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: n, y: u }), (i === "width" || i === "both") && a.set(h.id, { width: d, height: g.height }), u += g.height + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: d + n * 2, height: u }
  };
}
function Eg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Si(f));
  for (const f of c) l = Math.max(l, f.height);
  const d = r > 0 ? r : l;
  let u = n;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], g = c[f];
    s.set(h.id, { x: u, y: n + o }), (i === "height" || i === "both") && a.set(h.id, { width: g.width, height: d }), u += g.width + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: u, height: d + n * 2 + o }
  };
}
function Cg(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), u = t.map((m) => Si(m));
  let f = 0, h = 0;
  for (const m of u)
    f = Math.max(f, m.width), h = Math.max(h, m.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (f = g);
  const p = Math.ceil(t.length / d), y = a > 0 ? (a - (p - 1) * e) / p : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const _ = m % d, E = Math.floor(m / d), b = n + _ * (f + e), x = n + o + E * (h + e);
    l.set(t[m].id, { x: b, y: x }), i === "both" ? c.set(t[m].id, { width: f, height: h }) : i === "width" ? c.set(t[m].id, { width: f, height: u[m].height }) : i === "height" && c.set(t[m].id, { width: u[m].width, height: h });
  }
  return {
    positions: l,
    dimensions: c,
    parentDimensions: {
      width: d * f + (d - 1) * e + n * 2,
      height: p * h + (p - 1) * e + n * 2 + o
    }
  };
}
function Sg(t) {
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
      if (B("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
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
      const { excludeId: s, omitFromComputation: a, includeNode: l, shallow: c } = r;
      let { stretchedSize: d } = r;
      const u = t.nodes.find((b) => b.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((b) => b.parentId === e);
      a && (f = f.filter((b) => b.id !== a)), l && !f.some((b) => b.id === l.id) && (f = [...f, l]);
      const h = new Map(f.map((b) => [b.id, b]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const b of f)
          b.childLayout && this.layoutChildren(b.id, { excludeId: s, omitFromComputation: a, shallow: !1 });
      const g = u.childLayout, p = g.headerHeight !== void 0 ? g : u.data?.label ? { ...g, headerHeight: 30 } : g, y = ks(f, p, d);
      for (const [b, x] of y.positions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const M = h.get(b);
        M && (M.position ? (M.position.x = x.x, M.position.y = x.y) : M.position = { x: x.x, y: x.y });
      }
      for (const [b, x] of y.dimensions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const M = h.get(b);
        if (M) {
          let P = x.width, A = x.height;
          M.minDimensions && (M.minDimensions.width != null && (P = Math.max(P, M.minDimensions.width)), M.minDimensions.height != null && (A = Math.max(A, M.minDimensions.height))), M.maxDimensions && (M.maxDimensions.width != null && (P = Math.min(P, M.maxDimensions.width)), M.maxDimensions.height != null && (A = Math.min(A, M.maxDimensions.height))), M.dimensions ? (M.dimensions.width = P, M.dimensions.height = A) : M.dimensions = { width: P, height: A }, M.childLayout && !c && this.layoutChildren(b, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: M.dimensions });
        }
      }
      let m = y.parentDimensions.width, _ = y.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (m = Math.max(m, u.minDimensions.width)), u.minDimensions.height != null && (_ = Math.max(_, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (m = Math.min(m, u.maxDimensions.width)), u.maxDimensions.height != null && (_ = Math.min(_, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = m, u.dimensions.height = _, m !== y.parentDimensions.width || _ !== y.parentDimensions.height) {
        const x = ks(f, p, { width: m, height: _ });
        for (const [M, P] of x.positions) {
          if (M === s || l && M === l.id && !t._nodeMap.has(M)) continue;
          const A = h.get(M);
          A && (A.position ? (A.position.x = P.x, A.position.y = P.y) : A.position = { x: P.x, y: P.y });
        }
        for (const [M, P] of x.dimensions) {
          if (M === s || l && M === l.id && !t._nodeMap.has(M)) continue;
          const A = h.get(M);
          if (A) {
            let $ = P.width, C = P.height;
            A.minDimensions && (A.minDimensions.width != null && ($ = Math.max($, A.minDimensions.width)), A.minDimensions.height != null && (C = Math.max(C, A.minDimensions.height))), A.maxDimensions && (A.maxDimensions.width != null && ($ = Math.min($, A.maxDimensions.width)), A.maxDimensions.height != null && (C = Math.min(C, A.maxDimensions.height))), A.dimensions ? (A.dimensions.width = $, A.dimensions.height = C) : A.dimensions = { width: $, height: C }, A.childLayout && !c && this.layoutChildren(M, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: A.dimensions });
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
      const s = t.nodes.filter((l) => l.parentId === o.parentId).sort((l, c) => (l.order ?? 1 / 0) - (c.order ?? 1 / 0)).filter((l) => l.id !== e), a = Math.max(0, Math.min(n, s.length));
      s.splice(a, 0, o);
      for (let l = 0; l < s.length; l++)
        s[l].order = l;
      this.layoutChildren(o.parentId), t._emit("child-reorder", { nodeId: e, parentId: o.parentId, order: a });
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
      const n = $t("layout:dagre");
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
      }), B("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
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
      const n = $t("layout:force");
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
      }), B("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
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
      const n = $t("layout:hierarchy");
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
      }), B("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
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
      const n = $t("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (r.size === 0) {
        B("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), B("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function kg(t) {
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
        const s = t.nodes.filter((l) => l.parentId === o), a = ws(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = cn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = ws(n, i, o);
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
              ), g = no(f, o, h, u);
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
      if (!r || pt(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = ta(r, o, d, s);
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
            ), h = no(u, o, f, d);
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
      const a = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, l = t.getAbsolutePosition(n);
      if (o.position.x = a.x - l.x, o.position.y = a.y - l.y, o.parentId = n, t.nodes = Pt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function Lg(t) {
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
              const a = r.offsetWidth, l = r.offsetHeight;
              (!s.dimensions || a !== s.dimensions.width || l !== s.dimensions.height) && (s.dimensions = { width: a, height: l }, o.add(i)), s.fixedDimensions = !0, r.style.width = a + "px", r.style.height = l + "px";
            }
          }
          o.size > 0 && t._refreshEdgePaths(o);
        });
      }), n;
    }
  };
}
function zn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), a = Math.sin(r), l = t - n, c = e - o;
  return {
    x: n + l * s - c * a,
    y: o + l * a + c * s
  };
}
function la(t) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return `M${t[0].x},${t[0].y} L${t[1].x},${t[1].y}`;
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 0; n < t.length - 1; n++) {
    const o = t[Math.max(0, n - 1)], i = t[n], r = t[n + 1], s = t[Math.min(t.length - 1, n + 2)], a = i.x + (r.x - o.x) / 6, l = i.y + (r.y - o.y) / 6, c = r.x - (s.x - i.x) / 6, d = r.y - (s.y - i.y) / 6;
    e += ` C${a},${l} ${c},${d} ${r.x},${r.y}`;
  }
  return e;
}
function Pg(t) {
  if (t.length < 2)
    return { x: t[0]?.x ?? 0, y: t[0]?.y ?? 0, offsetX: 0, offsetY: 0 };
  let e = 0;
  const n = [];
  for (let r = 1; r < t.length; r++) {
    const s = t[r].x - t[r - 1].x, a = t[r].y - t[r - 1].y, l = Math.sqrt(s * s + a * a);
    n.push(l), e += l;
  }
  let o = e / 2;
  for (let r = 0; r < n.length; r++) {
    if (o <= n[r]) {
      const s = n[r] > 0 ? o / n[r] : 0, a = t[r].x + (t[r + 1].x - t[r].x) * s, l = t[r].y + (t[r + 1].y - t[r].y) * s;
      return {
        x: a,
        y: l,
        offsetX: Math.abs(t[t.length - 1].x - t[0].x) / 2,
        offsetY: Math.abs(t[t.length - 1].y - t[0].y) / 2
      };
    }
    o -= n[r];
  }
  const i = t[t.length - 1];
  return { x: i.x, y: i.y, offsetX: 0, offsetY: 0 };
}
function Mg({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return eo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = Ur(t, e, n, o, i, r, s);
  if (!a)
    return eo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = la(a), { x: c, y: d, offsetX: u, offsetY: f } = Pg(a);
  return {
    path: l,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Tg(t) {
  const {
    sourceX: e,
    sourceY: n,
    targetX: o,
    targetY: i,
    controlPoints: r = [],
    pathStyle: s = "bezier",
    borderRadius: a = 5
  } = t, l = [
    { x: e, y: n },
    ...r,
    { x: o, y: i }
  ];
  let c;
  switch (s) {
    case "linear":
      c = Ls(l);
      break;
    case "step":
      c = Ag(l, 0);
      break;
    case "smoothstep":
      c = Ng(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = la(l.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Ls(l);
  }
  const d = Ig(l), u = En({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Ls(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function Ag(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ca(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ca(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Ng(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ca(t[0], t[1], e);
  const n = [t[0]];
  for (let r = 0; r < t.length - 1; r++) {
    const s = t[r], a = t[r + 1], l = Math.abs(a.x - s.x), c = Math.abs(a.y - s.y);
    if (l < 1 || c < 1)
      n.push(a);
    else {
      const d = (s.x + a.x) / 2;
      n.push({ x: d, y: s.y }), n.push({ x: d, y: a.y }), n.push(a);
    }
  }
  let o = `M${n[0].x},${n[0].y}`;
  for (let r = 1; r < n.length - 1; r++) {
    const s = n[r - 1], a = n[r], l = n[r + 1];
    o += Xt(s.x, s.y, a.x, a.y, l.x, l.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function Ig(t) {
  if (t.length < 2) return t[0] ?? { x: 0, y: 0 };
  let e = 0;
  const n = [];
  for (let i = 0; i < t.length - 1; i++) {
    const r = t[i + 1].x - t[i].x, s = t[i + 1].y - t[i].y, a = Math.sqrt(r * r + s * s);
    n.push(a), e += a;
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
  const i = t.dimensions?.width ?? ve, r = t.dimensions?.height ?? _e, s = Ut(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? Jr[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = ms(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = ms(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = zn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function Ps(t) {
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
function ii(t) {
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
const $g = 1.5, Dg = 5 / 20;
function Dt(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = ii(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const l = (i.width ?? 12.5) * $g * Dg * 0.4, c = r + l, d = ii(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function io(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d, u) {
  const f = r ?? jt(e, o, c, d), h = s ?? jt(n, i, c, d), g = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: Ps(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Ps(i)
  }, p = t.type ?? u ?? "bezier";
  if (a?.[p])
    return a[p](g);
  switch (p === "floating" ? t.pathType ?? "bezier" : p) {
    case "editable":
      return Tg({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Mg({ ...g, obstacles: l });
    case "orthogonal":
      return Gf({ ...g, obstacles: l });
    case "smoothstep":
      return yn(g);
    case "straight":
      return Or({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return eo(g);
  }
}
function Ms(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? zn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? zn(g.x, g.y, i.x, i.y, t.rotation) : g;
  }
  const l = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(a);
  let f;
  d / l > u / c ? f = l / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + a * f
  };
  return t.rotation ? zn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Ts(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, g = e.y - r;
    return Math.abs(h) > Math.abs(g) ? h > 0 ? "right" : "left" : g > 0 ? "bottom" : "top";
  }
  const s = 1, a = t.position.x, l = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - a) <= s) return "left";
  if (Math.abs(e.x - l) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const u = e.x - i, f = e.y - r;
  return Math.abs(u) > Math.abs(f) ? u > 0 ? "right" : "left" : f > 0 ? "bottom" : "top";
}
function da(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? ve, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = Ms(t, a), c = Ms(e, s), d = Ts(t, l), u = Ts(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function Cy(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function ua(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function fa(t, e) {
  return `${t}__grad__${e}`;
}
function ha(t, e, n, o, i, r, s) {
  let a = t.querySelector(`#${CSS.escape(e)}`);
  if (!a) {
    a = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"), a.id = e, a.setAttribute("gradientUnits", "userSpaceOnUse"), a.classList.add("flow-edge-gradient");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    c.setAttribute("offset", "0%"), a.appendChild(c);
    const d = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    d.setAttribute("offset", "100%"), a.appendChild(d), t.appendChild(a);
  }
  a.setAttribute("x1", String(o)), a.setAttribute("y1", String(i)), a.setAttribute("x2", String(r)), a.setAttribute("y2", String(s));
  const l = a.querySelectorAll("stop");
  return l[0]?.setAttribute("stop-color", n.from), l[1]?.setAttribute("stop-color", n.to), a;
}
function To(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Hg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Rg(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const a = r.getNode(e);
  if (a && !Be(a))
    return { applied: !1 };
  const l = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Br({
    edge: i,
    newConnection: l,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: l }), { applied: !0, newConnection: l }) : { applied: !1, reason: d.reason, newConnection: l };
}
function Fg(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ga(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function As(t, e) {
  if (!e) return t;
  const n = ii(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function Ns(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function so(t, e) {
  const n = Array.from(t);
  if (n.length === 0) return null;
  if (n.length === 1 || !e) return n[0];
  let o = null, i = 1 / 0;
  for (const r of n) {
    const s = r.getBoundingClientRect(), a = (s.left + s.right) / 2, l = (s.top + s.bottom) / 2, c = a - e.x, d = l - e.y, u = c * c + d * d;
    u < i && (i = u, o = r);
  }
  return o;
}
function ro(t, e, n, o, i, r, s) {
  const a = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (a) {
    if (n) {
      const c = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = so(c, r);
      if (!d) {
        const u = a.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = so(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ga(n);
      if (c && a.querySelector(`[data-flow-handle-position="${c}"]`))
        return c;
    }
    const l = a.querySelector(`[data-flow-handle-type="${o}"]`);
    if (l)
      return l.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
  }
  if (i) {
    const l = o === "source" ? i.sourcePosition : i.targetPosition;
    if (l) return l;
  }
  return o === "source" ? "bottom" : "top";
}
function Is(t, e, n, o, i, r, s, a, l) {
  const c = l ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const p = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = so(p, a), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = so(y, a);
    }
    if (!d) {
      const y = ga(o);
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
function Og(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function at(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function zg(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function Vg(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
      a.setAttribute("fill", "none"), a.style.stroke = "transparent", a.style.strokeWidth = "20", a.style.pointerEvents = "stroke", a.style.cursor = "pointer", s.appendChild(a);
      let l = e.querySelector("path:not(:first-child)");
      l || (l = document.createElementNS("http://www.w3.org/2000/svg", "path"), l.setAttribute("fill", "none"), l.setAttribute("stroke-width", "1.5"), l.style.pointerEvents = "none", s.appendChild(l));
      let c = null, d = null, u = null, f = null, h = 0, g = null, p = "none", y = null, m = null;
      function _(L, N, F, J, oe) {
        g || (g = document.createElementNS("http://www.w3.org/2000/svg", "circle"), g.classList.add("flow-edge-dot"), g.style.pointerEvents = "none", L.appendChild(g));
        const G = F.closest(".flow-container"), q = G ? getComputedStyle(G) : null, z = J.particleSize ?? (parseFloat(q?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), X = oe || q?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        g.setAttribute("r", String(z)), J.particleColor ? g.style.fill = J.particleColor : g.style.removeProperty("fill");
        const W = g.querySelector("animateMotion");
        W && W.remove();
        const j = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        j.setAttribute("dur", X), j.setAttribute("repeatCount", "indefinite"), j.setAttribute("path", N), g.appendChild(j);
      }
      function E() {
        g?.remove(), g = null;
      }
      let b = null, x = null, M = null, P = null;
      const A = (L) => {
        L.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: L }), gt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1, B("selection", `Edge "${N.id}" deselected (shift)`)) : (F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected`)), F._emitSelectionChange());
      }, $ = (L) => {
        L.preventDefault(), L.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const J = L.target;
        if (J.classList.contains("flow-edge-control-point")) {
          const oe = parseInt(J.dataset.pointIndex ?? "", 10);
          if (!isNaN(oe)) {
            F._emit("edge-control-point-context-menu", {
              edge: N,
              pointIndex: oe,
              position: { x: L.clientX, y: L.clientY },
              event: L
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: N, event: L });
      }, C = (L) => {
        L.stopPropagation(), L.preventDefault();
        const N = o(n), F = t.$data(e.closest("[x-data]"));
        if (!N || !F || (N.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const oe = L.target;
        if (oe.classList.contains("flow-edge-control-point")) {
          const G = parseInt(oe.dataset.pointIndex ?? "", 10);
          !isNaN(G) && N.controlPoints && (F._captureHistory?.(), N.controlPoints.splice(G, 1), F._emit("edge-control-point-change", { edge: N, action: "remove", index: G }));
          return;
        }
        if (oe.classList.contains("flow-edge-midpoint")) {
          const G = parseInt(oe.dataset.segmentIndex ?? "", 10);
          if (!isNaN(G)) {
            const q = F.screenToFlowPosition(L.clientX, L.clientY);
            N.controlPoints || (N.controlPoints = []), F._captureHistory?.(), N.controlPoints.splice(G, 0, { x: q.x, y: q.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: G });
          }
          return;
        }
        if (oe.closest("path")) {
          const G = F.screenToFlowPosition(L.clientX, L.clientY);
          N.controlPoints || (N.controlPoints = []);
          const q = [
            b ?? { x: 0, y: 0 },
            ...N.controlPoints,
            x ?? { x: 0, y: 0 }
          ];
          let z = 0, X = 1 / 0;
          for (let W = 0; W < q.length - 1; W++) {
            const j = zg(G, q[W], q[W + 1]);
            j < X && (X = j, z = W);
          }
          F._captureHistory?.(), N.controlPoints.splice(z, 0, { x: G.x, y: G.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: z });
        }
      }, T = (L) => {
        const N = L.target;
        if (!N.classList.contains("flow-edge-control-point") || L.button !== 0) return;
        L.stopPropagation(), L.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const J = t.$data(e.closest("[x-data]"));
        if (!J) return;
        const oe = parseInt(N.dataset.pointIndex ?? "", 10);
        if (isNaN(oe)) return;
        N.classList.add("dragging");
        let G = !1;
        const q = (X) => {
          G || (J._captureHistory?.(), G = !0);
          let W = J.screenToFlowPosition(X.clientX, X.clientY);
          const j = J._config?.snapToGrid;
          j && (W = {
            x: Math.round(W.x / j[0]) * j[0],
            y: Math.round(W.y / j[1]) * j[1]
          }), F.controlPoints[oe] = W;
        }, z = () => {
          document.removeEventListener("pointermove", q), document.removeEventListener("pointerup", z), N.classList.remove("dragging"), G && J._emit("edge-control-point-change", { edge: F, action: "move", index: oe });
        };
        document.addEventListener("pointermove", q), document.addEventListener("pointerup", z);
      };
      s.addEventListener("contextmenu", $), s.addEventListener("dblclick", C), s.addEventListener("pointerdown", T, !0);
      let S = null;
      const v = (L) => {
        if (L.button !== 0) return;
        L.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const J = F._config?.reconnectSnapRadius ?? Gi, oe = F._config?.edgesReconnectable !== !1, G = N.reconnectable ?? !0;
        let q = null;
        if (oe && G !== !1 && b && x) {
          const re = F.screenToFlowPosition(L.clientX, L.clientY), ge = at(re.x, re.y, b.x, b.y, J) || M && at(re.x, re.y, M.x, M.y, J);
          (at(re.x, re.y, x.x, x.y, J) || P && at(re.x, re.y, P.x, P.y, J)) && (G === !0 || G === "target") ? q = "target" : ge && (G === !0 || G === "source") && (q = "source");
        }
        if (!q) {
          const re = (ge) => {
            document.removeEventListener("pointerup", re), A(ge);
          };
          document.addEventListener("pointerup", re, { once: !0 });
          return;
        }
        const z = L.clientX, X = L.clientY;
        let W = !1, j = !1, H = null;
        const te = F._config?.connectionSnapRadius ?? 20;
        let Q = null, U = null, Z = null, se = z, ae = X;
        const K = e.closest(".flow-container");
        if (!K) return;
        const ee = q === "target" ? b : x, ue = () => {
          W = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: N, handleType: q }), B("reconnect", `Reconnection drag started on edge "${N.id}" (${q} end)`), U = Yt({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), Q = U.svg;
          const re = F.screenToFlowPosition(z, X);
          U.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: re.x,
            toY: re.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const ge = K.querySelector(".flow-viewport");
          ge && ge.appendChild(Q), q === "target" && (F.pendingConnection = {
            source: N.source,
            sourceHandle: N.sourceHandle,
            position: re
          }), F._pendingReconnection = {
            edge: N,
            draggedEnd: q,
            anchorPosition: { ...ee },
            position: re
          }, Z = po(K, F, se, ae), q === "target" && vn(K, N.source, N.sourceHandle ?? "source", F, N.id);
        }, fe = (re) => {
          if (se = re.clientX, ae = re.clientY, !W) {
            Math.sqrt(
              (re.clientX - z) ** 2 + (re.clientY - X) ** 2
            ) >= Gn && ue();
            return;
          }
          const ge = F.screenToFlowPosition(re.clientX, re.clientY), be = wn({
            containerEl: K,
            handleType: q === "target" ? "target" : "source",
            excludeNodeId: q === "target" ? N.source : N.target,
            cursorFlowPos: ge,
            connectionSnapRadius: te,
            getNode: (ke) => F.getNode(ke),
            toFlowPosition: (ke, Ce) => F.screenToFlowPosition(ke, Ce)
          });
          be.element !== H && (H?.classList.remove("flow-handle-active"), be.element?.classList.add("flow-handle-active"), H = be.element), U?.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: be.position.x,
            toY: be.position.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const Me = be.position;
          q === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: Me
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: Me
          }), Z?.updatePointer(re.clientX, re.clientY);
        }, ie = () => {
          j || (j = !0, document.removeEventListener("pointermove", fe), document.removeEventListener("pointerup", le), Z?.stop(), Z = null, U?.destroy(), U = null, Q = null, H?.classList.remove("flow-handle-active"), S = null, s.classList.remove("flow-edge-reconnecting"), Pe(K), F.pendingConnection = null, F._pendingReconnection = null);
        }, le = async (re) => {
          if (!W) {
            ie(), A(re);
            return;
          }
          if (F._connectValidating) return;
          let ge = H, be = null;
          if (!ge) {
            be = document.elementFromPoint(re.clientX, re.clientY);
            const de = q === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            ge = be?.closest(de);
          }
          const ke = (ge ? ge.closest("[data-flow-node-id]") : be?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Ce = ge?.dataset.flowHandleId, V = U?.svg ?? null;
          Ct(V, !0);
          let ne;
          try {
            ne = await Rg({
              dropNodeId: ke,
              dropHandleId: Ce,
              draggedEnd: q,
              edge: N,
              canvas: F,
              containerEl: K
            });
          } finally {
            Ct(V, !1);
          }
          ne.applied ? B("reconnect", `Edge "${N.id}" reconnected (${q})`, ne.newConnection) : B("reconnect", `Edge "${N.id}" reconnection cancelled — snapping back`, { reason: ne.reason }), F._emit("reconnect-end", { edge: N, successful: ne.applied }), ie();
        };
        document.addEventListener("pointermove", fe), document.addEventListener("pointerup", le), S = ie;
      };
      s.addEventListener("pointerdown", v);
      const w = (L) => {
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const J = F._config?.edgesReconnectable !== !1, oe = N.reconnectable ?? !0;
        if (!J || oe === !1 || !b || !x) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const G = F._config?.reconnectSnapRadius ?? Gi, q = F.screenToFlowPosition(L.clientX, L.clientY), z = (at(q.x, q.y, b.x, b.y, G) || M && at(q.x, q.y, M.x, M.y, G)) && (oe === !0 || oe === "source"), X = (at(q.x, q.y, x.x, x.y, G) || P && at(q.x, q.y, P.x, P.y, G)) && (oe === !0 || oe === "target");
        z || X ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", w);
      const I = (L) => {
        if (L.key !== "Enter" && L.key !== " ") return;
        L.preventDefault(), L.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: L }), gt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1) : (F.selectedEdges.add(N.id), N.selected = !0) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0), F._emitSelectionChange());
      };
      s.addEventListener("keydown", I);
      const k = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", k), s.addEventListener("blur", R);
      const O = (L) => {
        L.stopPropagation();
      };
      s.addEventListener("mousedown", O);
      const Y = () => {
        for (const L of [c, d, u])
          L && L.classList.add("flow-edge-hovered");
      }, D = () => {
        for (const L of [c, d, u])
          L && L.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", Y), s.addEventListener("mouseleave", D), i(() => {
        const L = o(n);
        if (!L || !l) return;
        s.setAttribute("data-flow-edge-id", L.id);
        const N = t.$data(e.closest("[x-data]"));
        if (!N?.nodes) return;
        const F = L.type ?? N._config?.defaultEdgeType ?? "bezier", J = N._config?.edgeLod;
        let oe = F;
        if (J) {
          const V = N._zoomLevel;
          (J.simplifyAt === "medium" && V === "medium" || V === "far") && (oe = "straight");
        }
        N._layoutAnimTick, N._edgeDirtyTicks?.get(L.id);
        const G = N.getNode(L.source), q = N.getNode(L.target);
        if (!G || !q) return;
        G.sourcePosition, q.targetPosition;
        const z = St(G, N._nodeMap, N._config?.nodeOrigin), X = St(q, N._nodeMap, N._config?.nodeOrigin), W = e.closest("[x-data]");
        let j, H, te, Q;
        if (F === "floating") {
          const V = da(z, X);
          j = V.sourcePos, H = V.targetPos, te = { x: V.sx, y: V.sy, handleWidth: 0, handleHeight: 0 }, Q = { x: V.tx, y: V.ty, handleWidth: 0, handleHeight: 0 }, b = { x: V.sx, y: V.sy }, x = { x: V.tx, y: V.ty };
        } else {
          const V = N._nodeElements?.get(L.source) ?? W.querySelector(`[data-flow-node-id="${CSS.escape(L.source)}"]`), ne = N._nodeElements?.get(L.target) ?? W.querySelector(`[data-flow-node-id="${CSS.escape(L.target)}"]`), de = V ? Ns(V.getBoundingClientRect()) : void 0, ye = ne ? Ns(ne.getBoundingClientRect()) : void 0;
          j = ro(W, L.source, L.sourceHandle, "source", G, ye, V), H = ro(W, L.target, L.targetHandle, "target", q, de, ne);
          const Ee = t.raw(N).viewport ?? { x: 0, y: 0, zoom: 1 }, pe = Ee.zoom || 1, he = G.rotation, ce = q.rotation;
          j = As(j, he), H = As(H, ce), te = Is(W, L.source, z, L.sourceHandle, "source", pe, Ee, ye, V), Q = Is(W, L.target, X, L.targetHandle, "target", pe, Ee, de, ne);
          const me = jt(z, j, N._shapeRegistry, N._config?.nodeOrigin), xe = jt(X, H, N._shapeRegistry, N._config?.nodeOrigin);
          b = te ?? me, x = Q ?? xe;
        }
        const U = Dt(te ?? b, j, te, L.markerStart), Z = Dt(Q ?? x, H, Q, L.markerEnd);
        M = U, P = Z;
        let se;
        if (F === "orthogonal" || F === "avoidant")
          if (N._config?.avoidantSimplifyOnDrag !== !1 && (N._draggingNodeIds?.has(L.source) || N._draggingNodeIds?.has(L.target)))
            se = void 0;
          else {
            const ne = t.raw(N._obstacleSnapshot);
            if (ne)
              se = ne.filter((de) => de.id !== L.source && de.id !== L.target);
            else {
              const de = t.raw(N.nodes), ye = new Map(de.map((pe) => [pe.id, pe])), Ee = N._config?.nodeOrigin;
              se = de.filter((pe) => pe.id !== L.source && pe.id !== L.target).map((pe) => {
                const he = St(pe, ye, Ee);
                return {
                  x: he.position.x,
                  y: he.position.y,
                  width: he.dimensions?.width ?? ve,
                  height: he.dimensions?.height ?? _e
                };
              });
            }
          }
        const ae = oe === F ? L : { ...L, type: oe }, { path: K, labelPosition: ee } = io(ae, z, X, j, H, U, Z, N._config?.edgeTypes, se, N._shapeRegistry, N._config?.nodeOrigin, N._config?.defaultEdgeType);
        l.setAttribute("d", K), a.setAttribute("d", K), (F === "orthogonal" || F === "avoidant") && t.raw(N._edgeCorridors)?.set(L.id, {
          minX: Math.min(U.x, Z.x),
          minY: Math.min(U.y, Z.y),
          maxX: Math.max(U.x, Z.x),
          maxY: Math.max(U.y, Z.y)
        });
        const ue = F === "editable", fe = ue && (L.showControlPoints || L.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((V) => V.remove()), fe) {
          const V = L.controlPoints ?? [], ne = N.viewport?.zoom ?? 1, de = 6 / ne, ye = 5 / ne, Ee = b ?? { x: 0, y: 0 }, pe = x ?? { x: 0, y: 0 }, he = [Ee, ...V, pe], ce = he.length - 1, me = l.getTotalLength?.() ?? 0;
          if (me > 0) {
            const xe = [0], Le = 200;
            let Fe = 1;
            for (let Oe = 1; Oe <= Le && Fe < he.length; Oe++) {
              const wt = Oe / Le * me, Te = l.getPointAtLength(wt), ze = he[Fe], Gt = Te.x - ze.x, Ti = Te.y - ze.y;
              Gt * Gt + Ti * Ti < 25 && (xe.push(wt), Fe++);
            }
            for (; xe.length <= ce; )
              xe.push(me);
            for (let Oe = 0; Oe < ce; Oe++) {
              const wt = (xe[Oe] + xe[Oe + 1]) / 2, Te = l.getPointAtLength(wt), ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              ze.classList.add("flow-edge-midpoint"), ze.setAttribute("cx", String(Te.x)), ze.setAttribute("cy", String(Te.y)), ze.setAttribute("r", String(ye)), ze.dataset.segmentIndex = String(Oe);
              const Gt = document.createElementNS("http://www.w3.org/2000/svg", "title");
              Gt.textContent = "Double-click to add control point", ze.appendChild(Gt), s.appendChild(ze);
            }
          }
          for (let xe = 0; xe < V.length; xe++) {
            const Le = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            Le.classList.add("flow-edge-control-point"), Le.setAttribute("cx", String(V[xe].x)), Le.setAttribute("cy", String(V[xe].y)), Le.setAttribute("r", String(de)), Le.dataset.pointIndex = String(xe), s.appendChild(Le);
          }
        }
        if (a.style.cursor = ue ? "crosshair" : "pointer", a.style.strokeWidth = String(
          L.interactionWidth ?? N._config?.defaultInteractionWidth ?? 20
        ), L.markerStart != null) {
          const V = Ft(L.markerStart), ne = Ot(V, N._id);
          l.setAttribute("marker-start", `url(#${ne})`);
        } else if (L._renderDualMarker && L.markerEnd) {
          const V = Ft(L.markerEnd), ne = Ot(V, N._id);
          l.setAttribute("marker-start", `url(#${ne})`);
        } else
          l.removeAttribute("marker-start");
        if (L.markerEnd) {
          const V = Ft(L.markerEnd), ne = Ot(V, N._id);
          l.setAttribute("marker-end", `url(#${ne})`);
        } else
          l.removeAttribute("marker-end");
        const ie = L.strokeWidth ?? 1.5, le = Fg(L.animated);
        switch (le !== p && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), p === "dot" && E(), p = le), le) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            _(s, K, W, L, L.animationDuration);
            break;
        }
        if (L.animationDuration && le !== "none" ? (le === "dash" || le === "pulse") && (l.style.animationDuration = L.animationDuration) : (le === "dash" || le === "pulse") && l.style.removeProperty("animation-duration"), m && m !== L.class && s.classList.remove(...m.split(" ").filter(Boolean)), L.class) {
          const V = le === "dash" ? " flow-edge-animated" : le === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", L.class + V), s.classList.add(...L.class.split(" ").filter(Boolean)), m = L.class;
        } else
          m && (s.classList.remove(...m.split(" ").filter(Boolean)), m = null);
        if (s.setAttribute("aria-selected", String(!!L.selected)), L.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(ie + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + pn + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(ie);
          const V = N._markerDefsEl?.querySelector("defs") ?? null;
          if (ua(L.color)) {
            if (V) {
              const ne = fa(N._id, L.id), de = L.gradientDirection === "target-source", ye = b.x, Ee = b.y, pe = x.x, he = x.y;
              ha(
                V,
                ne,
                de ? { from: L.color.to, to: L.color.from } : L.color,
                ye,
                Ee,
                pe,
                he
              ), l.style.stroke = `url(#${ne})`, y = ne;
            }
          } else if (L.color) {
            if (y) {
              const ne = V;
              ne && To(ne, y), y = null;
            }
            l.style.stroke = L.color;
          } else {
            if (y) {
              const ne = V;
              ne && To(ne, y), y = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (!L.selected && ((L.sourceHandle ? N.selectedRows?.has(L.sourceHandle.replace(/-[lr]$/, "")) : !1) || (L.targetHandle ? N.selectedRows?.has(L.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), L.selected || (l.style.strokeWidth = String(Math.max(ie + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), L.focusable ?? N._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", L.ariaRole ?? "group"), s.setAttribute("aria-label", L.ariaLabel ?? (L.label ? `Edge: ${L.label}` : `Edge from ${L.source} to ${L.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), L.domAttributes)
          for (const [V, ne] of Object.entries(L.domAttributes))
            V.startsWith("on") || Hg.has(V.toLowerCase()) || s.setAttribute(V, ne);
        const be = (V, ne, de, ye, Ee) => {
          if (ne) {
            if (!V && ye) {
              const pe = de.includes("flow-edge-label-start"), he = de.includes("flow-edge-label-end");
              let ce = `[data-flow-edge-id="${Ee}"].flow-edge-label`;
              pe ? ce += ".flow-edge-label-start" : he ? ce += ".flow-edge-label-end" : ce += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", V = ye.querySelector(ce);
            }
            return V || (V = document.createElement("div"), V.className = de, V.dataset.flowEdgeId = Ee, ye && ye.appendChild(V)), V.textContent = ne, V;
          }
          return V && V.remove(), null;
        }, Me = e.closest(".flow-viewport"), ke = L.labelVisibility ?? "always", Ce = () => {
          const V = l.getAttribute("d") ?? "";
          return V !== f && (f = V, h = typeof l.getTotalLength == "function" && l.getTotalLength() || 0), h;
        };
        if (c = be(c, L.label, "flow-edge-label", Me, L.id), c) {
          const V = Ce();
          if (V > 0) {
            const ne = L.labelPosition ?? 0.5, de = Og(l, ne, V);
            c.style.left = `${de.x}px`, c.style.top = `${de.y}px`;
          } else
            c.style.left = `${ee.x}px`, c.style.top = `${ee.y}px`;
        }
        if (d = be(d, L.labelStart, "flow-edge-label flow-edge-label-start", Me, L.id), d) {
          const V = Ce();
          if (V > 0) {
            const ne = L.labelStartOffset ?? 30, de = l.getPointAtLength(Math.min(ne, V / 2));
            d.style.left = `${de.x}px`, d.style.top = `${de.y}px`;
          }
        }
        if (u = be(u, L.labelEnd, "flow-edge-label flow-edge-label-end", Me, L.id), u) {
          const V = Ce();
          if (V > 0) {
            const ne = L.labelEndOffset ?? 30, de = l.getPointAtLength(Math.max(V - ne, V / 2));
            u.style.left = `${de.x}px`, u.style.top = `${de.y}px`;
          }
        }
        for (const V of [c, d, u])
          V && (V.classList.toggle("flow-edge-label-hover", ke === "hover"), V.classList.toggle("flow-edge-label-on-select", ke === "selected"), V.classList.toggle("flow-edge-label-selected", !!L.selected), L.class ? V.classList.add(...L.class.split(" ").filter(Boolean)) : m && V.classList.remove(...m.split(" ").filter(Boolean)));
      }), r(() => {
        if (y) {
          const N = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          N && To(N, y);
        }
        S?.(), E(), s.removeEventListener("contextmenu", $), s.removeEventListener("dblclick", C), s.removeEventListener("pointerdown", T, !0), s.removeEventListener("pointerdown", v), s.removeEventListener("pointermove", w), s.removeEventListener("keydown", I), s.removeEventListener("focus", k), s.removeEventListener("blur", R), s.removeEventListener("mousedown", O), s.removeEventListener("mouseenter", Y), s.removeEventListener("mouseleave", D), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Bg(t, e) {
  return {
    /** Write node positions directly to DOM elements (bypassing Alpine effects). */
    _flushNodePositions(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const s = e.raw(i), a = s.parentId ? t.getAbsolutePosition(o) : s.position, l = s.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0], c = s.dimensions?.width ?? 150, d = s.dimensions?.height ?? 40;
        r.style.left = a.x - c * l[0] + "px", r.style.top = a.y - d * l[1] + "px";
      }
    },
    /** Write node styles directly to DOM elements (bypassing Alpine effects). */
    _flushNodeStyles(n) {
      for (const o of n) {
        const i = t.getNode(o);
        if (!i) continue;
        const r = t._nodeElements.get(o);
        if (!r) continue;
        const a = e.raw(i).style;
        if (!a) continue;
        const l = typeof a == "string" ? mn(a) : a;
        for (const [c, d] of Object.entries(l))
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
        const s = St(i, t._nodeMap, t._config.nodeOrigin), a = St(r, t._nodeMap, t._config.nodeOrigin);
        let l, c, d, u;
        if (o.type === "floating") {
          const h = da(s, a);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const g = Dt(d, h.sourcePos, null, o.markerStart), p = Dt(u, h.targetPos, null, o.markerEnd), y = io(o, s, a, h.sourcePos, h.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let g, p;
          if (h) {
            const x = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), M = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (x) {
              const P = x.getBoundingClientRect();
              g = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
            if (M) {
              const P = M.getBoundingClientRect();
              p = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
          }
          const y = h ? ro(h, o.source, o.sourceHandle, "source", i, p) : i?.sourcePosition ?? "bottom", m = h ? ro(h, o.target, o.targetHandle, "target", r, g) : r?.targetPosition ?? "top";
          d = jt(s, y, t._shapeRegistry, t._config.nodeOrigin), u = jt(a, m, t._shapeRegistry, t._config.nodeOrigin);
          const _ = Dt(d, y, null, o.markerStart), E = Dt(u, m, null, o.markerEnd), b = io(o, s, a, y, m, _, E, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = b.path, c = b.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", l);
          const g = f.parentElement?.querySelector("path:first-child");
          g && g !== f && g.setAttribute("d", l);
        }
        if (ua(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const g = fa(t._id, o.id), p = o.gradientDirection === "target-source";
            ha(
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
function qg(t) {
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
              Lr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Qr(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Xg = 0;
function Yg(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Wg(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
function jg(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Xg}`,
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
      _shapeRegistry: { ...Jr, ...e.shapeTypes },
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
          const s = getComputedStyle(this._container).getPropertyValue("--flow-bg-pattern-gap").trim(), a = parseFloat(s);
          if (!isNaN(a))
            return this._bgGapCache = a, a;
        }
        return 20;
      },
      _resolveBackgroundLayers() {
        const s = this._background;
        if (!s || s === "none") return [];
        const a = this._getBackgroundGap(), l = this._patternColorOverride ?? "var(--flow-bg-pattern-color)";
        return Array.isArray(s) ? s.map((c) => ({
          variant: c.variant ?? "dots",
          gap: c.gap ?? a,
          color: c.color ?? l
        })) : [{ variant: s, gap: a, color: l }];
      },
      backgroundStyle() {
        const s = this._resolveBackgroundLayers();
        if (s.length === 0) return { backgroundImage: "", backgroundSize: "", backgroundPosition: "" };
        const a = this.viewport.zoom, l = this.viewport.x, c = this.viewport.y, d = [], u = [], f = [];
        for (const h of s) {
          const g = h.gap * a, p = h.variant === "cross" ? g / 2 : g;
          d.push(Yg(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${p}px ${p}px, ${p}px ${p}px`), f.push(`${l}px ${c}px, ${l}px ${c}px`)) : (u.push(`${g}px ${g}px`), f.push(`${l}px ${c}px`));
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
        const { collab: s, ...a } = e;
        return a;
      })(),
      _shortcuts: $f(e.keyboardShortcuts),
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
      _handleDelegationCleanup: null,
      /**
       * The element the delegated handle listener is CURRENTLY installed on, or null
       * when nothing is installed. Tracked separately from `_viewportEl` because the
       * two can diverge: `_viewportEl` is re-pointed the instant a replacement viewport
       * registers, while the listener stays on whatever node it was attached to until
       * `_registerViewportEl()` moves it. Comparing the two is what detects the move.
       */
      _handleDelegationEl: null,
      /** Set in destroy(); read by the deferred install so a dead canvas never installs. */
      _handleDelegationTornDown: !1,
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
      _computeEngine: new dh(),
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
      _spatialGrid: new Vu(),
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
      _emit(s, a) {
        s !== "viewport-change" && s !== "viewport-move" && B("event", s, a);
        const l = "on" + s.split("-").map(
          (d) => d.charAt(0).toUpperCase() + d.slice(1)
        ).join(""), c = e[l];
        typeof c == "function" && c(a), this._container?.dispatchEvent(new CustomEvent(`flow-${s}`, {
          bubbles: !0,
          detail: a
        })), this._announcer?.handleEvent(s, a ?? {}), e.computeMode === "auto" && (s === "nodes-change" || s === "edges-change") && (this._computeDebounceTimer && clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = setTimeout(() => {
          this._computeDebounceTimer = null, this.compute();
        }, 16));
      },
      /** Route a warning through the onError callback (if set) and console.warn. */
      _warn(s, a) {
        typeof e.onError == "function" && e.onError(s, a), console.warn(`[AlpineFlow] ${a}`);
      },
      _emitSelectionChange() {
        this._emit("selection-change", {
          nodes: [...this.selectedNodes],
          edges: [...this.selectedEdges],
          rows: [...this.selectedRows]
        });
      },
      _rebuildNodeMap() {
        this._nodeMap = Zr(this.nodes), Kf(this._childrenIds, this.nodes);
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
        const a = t.raw(this._obstacleSnapshot), l = a ? a.slice() : null, c = t.raw(this.nodes), d = new Map(c.map((g) => [g.id, g])), u = this._config?.nodeOrigin, f = t.raw(this._spatialGrid);
        f.clear();
        const h = [];
        for (const g of c) {
          const p = St(g, d, u), y = {
            id: g.id,
            x: p.position.x,
            y: p.position.y,
            width: p.dimensions?.width ?? ve,
            height: p.dimensions?.height ?? _e
          };
          f.insert(g.id, y.x, y.y, y.width, y.height), !g.hidden && h.push(y);
        }
        a ? (a.length = 0, a.push(...h)) : this._obstacleSnapshot = h, this._obstacleEpoch++, this._markDirtyEdges(s, l);
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
      _markDirtyEdges(s, a) {
        const l = this._edgeDirtyTicks, c = t.raw(l), d = t.raw(this.edges), u = t.raw(this._edgeCorridors), f = t.raw(this._obstacleSnapshot), h = (y) => {
          l.set(y, (c.get(y) ?? 0) + 1);
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
        const g = new Set(s), p = [];
        for (const y of g) {
          const m = f?.find((E) => E.id === y);
          m && p.push(m);
          const _ = a?.find((E) => E.id === y);
          _ && p.push(_);
        }
        for (const y of d) {
          let m = g.has(y.source) || g.has(y.target);
          if (!m) {
            const _ = u.get(y.id);
            if (_) {
              for (const E of p)
                if (E.x < _.maxX + ut && E.x + E.width > _.minX - ut && E.y < _.maxY + ut && E.y + E.height > _.minY - ut) {
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
        let a;
        try {
          a = JSON.parse(s);
        } catch {
          return;
        }
        const l = /* @__PURE__ */ new Map();
        for (const c of a.nodes ?? [])
          l.set(c.id, { width: c.width, height: c.height });
        for (const c of this.nodes) {
          const d = l.get(c.id);
          d && !c.dimensions && (c.dimensions = { width: d.width, height: d.height }, this._initialDimensions.set(c.id, { ...d }));
        }
        a.viewport && (this.viewport.x = a.viewport.x, this.viewport.y = a.viewport.y, this.viewport.zoom = a.viewport.zoom), this._hydratedFromStatic = !0, this._container.removeAttribute("data-flow-static"), this._container.removeAttribute("data-flow-plan"), this._container.classList.remove("flow-static");
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
        const a = this.backgroundStyle();
        a.backgroundImage !== this._lastBgImage && (s.style.backgroundImage = a.backgroundImage, this._lastBgImage = a.backgroundImage), s.style.backgroundSize = a.backgroundSize, s.style.backgroundPosition = a.backgroundPosition;
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
        const l = this._container.clientWidth, c = this._container.clientHeight;
        if (l === 0 || c === 0) return;
        const d = e.cullingBuffer ?? 100, u = zu(this.viewport, l, c, d), h = t.raw(this._spatialGrid).query(u), g = this._draggingNodeIds, p = /* @__PURE__ */ new Set(), y = (E) => {
          const b = this._nodeMap.get(E);
          if (!b || b.hidden) return;
          const x = b.dimensions?.width ?? 150, M = b.dimensions?.height ?? 50, P = b.parentId ? Jo(b, this._nodeMap, this._config.nodeOrigin) : b.position;
          !(P.x + x < u.minX || P.x > u.maxX || P.y + M < u.minY || P.y > u.maxY) && p.add(E);
        };
        for (const E of h) y(E);
        if (g)
          for (const E of g)
            h.has(E) || y(E);
        for (const [E, b] of this._nodeElements) {
          const x = p.has(E) ? "" : "none";
          b.style.display !== x && (b.style.display = x);
        }
        const m = this._culledEdgeIds, _ = /* @__PURE__ */ new Set();
        for (const [E, b] of this._edgeSvgElements) {
          const x = this._edgeMap.get(E);
          if (!x) continue;
          const M = this._nodeMap.get(x.source)?.hidden, P = this._nodeMap.get(x.target)?.hidden;
          if (x.hidden || x._hiddenByCollapse || M || P)
            continue;
          const A = p.has(x.source) || p.has(x.target) || Wg(this._edgeCorridors.get(E), u), $ = !m.has(E);
          A !== $ && (b.style.display = A ? "" : "none"), A || _.add(E);
        }
        this._visibleNodeIds = p, this._culledEdgeIds = _;
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
          const a = this._edgeSvgElements.get(s);
          a && (a.style.display = "");
        }
        this._visibleNodeIds = /* @__PURE__ */ new Set(), this._culledEdgeIds = /* @__PURE__ */ new Set(), this._cullingWasActive = !1;
      },
      _getVisibleNodeIds() {
        return this._visibleNodeIds;
      },
      _applyZoomLevel(s) {
        if (e.zoomLevels === !1) return;
        const a = e.zoomLevels?.far ?? 0.4, l = e.zoomLevels?.medium ?? 0.75, c = s < a ? "far" : s < l ? "medium" : "close";
        c !== this._zoomLevel && (this._zoomLevel = c, this._container?.setAttribute("data-zoom-level", c));
      },
      getAbsolutePosition(s) {
        const a = this._nodeMap.get(s);
        return a ? Jo(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Lr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Qu(Kn), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let a = null;
          s === "fill" ? a = "100%" : typeof s == "number" && Number.isFinite(s) ? a = `${s}px` : typeof s == "string" && s.trim() && (a = s.trim()), a !== null && this._container.style.setProperty("--flow-container-height", a);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Qr(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Pt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new Yu(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new ch(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = $t("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new l(), g = new c(h), p = new d(h, this, f.provider), y = new u(g, f.user);
          if (De.set(a, { bridge: p, awareness: y, doc: h }), f.provider.connect(h, g), f.cursors !== !1) {
            let m = !1;
            const _ = f.throttle ?? 20, E = (M) => {
              if (m) return;
              m = !0;
              const P = a.getBoundingClientRect(), A = this._viewportLive ?? this.viewport, $ = (M.clientX - P.left - A.x) / A.zoom, C = (M.clientY - P.top - A.y) / A.zoom;
              y.updateCursor({ x: $, y: C }), setTimeout(() => {
                m = !1;
              }, _);
            }, b = () => {
              y.updateCursor(null);
            };
            a.addEventListener("mousemove", E), a.addEventListener("mouseleave", b);
            const x = De.get(a);
            x.cursorCleanup = () => {
              a.removeEventListener("mousemove", E), a.removeEventListener("mouseleave", b);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (B("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Hu(this._container, {
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
          onScrollPan: (s, a) => {
            this.panBy(s, a);
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
      /**
       * Install the ONE delegated `pointerdown` listener that starts the connect /
       * reconnect gesture for every handle on this canvas — instead of one listener
       * per handle, of which a large schema graph has thousands.
       *
       * Attached on `.flow-viewport` in the CAPTURE phase. That placement is
       * load-bearing (it is what keeps a handle press from also dragging the node
       * or reordering a schema row, while still yielding to an active whiteboard
       * tool) — the reasoning is in `../handle-delegation.ts`.
       */
      _initHandleDelegation() {
        this._config?.delegatedHandleEvents !== !1 && this.$nextTick(() => {
          if (this._handleDelegationTornDown) return;
          const s = this._viewportEl ?? this._container?.querySelector(".flow-viewport");
          !s && this._container && B("init", `flowCanvas "${this._id}" has no .flow-viewport — delegating handle pointerdown on the container instead; an active whiteboard tool may not suppress handle presses`);
          const a = s ?? this._container;
          a && (this._handleDelegationCleanup = us(a, this), this._handleDelegationEl = a);
        });
      },
      /**
       * Register the `.flow-viewport` element with the canvas. Called by the
       * `x-flow-viewport` directive every time it initialises — which includes a RE-init
       * on a DIFFERENT element, if the viewport node is ever replaced wholesale rather
       * than patched in place after the canvas mounted.
       *
       * INVARIANT (load-bearing): while the delegated handle listener is installed, it
       * is bound to exactly one element, and that element MUST be the current viewport.
       * Break it and the listener is left on a detached node while handles render inside
       * the new one — so every handle in the canvas goes permanently inert. That failure
       * is silent and total, and delegation removed the safety net that used to cover it:
       * pre-delegation each handle re-attached its own listener on every re-stamp, so a
       * swapped viewport repaired itself. Hence: if delegation is already installed on a
       * different element, move it to the new one.
       *
       * A canvas that never installed (delegation off via `delegatedHandleEvents: false`,
       * or the deferred install has not run yet) has a null `_handleDelegationEl` and
       * falls out at the first guard — this only ever MOVES an existing listener, it
       * never creates one that `_initHandleDelegation` decided against.
       */
      _registerViewportEl(s) {
        this._viewportEl = s;
        const a = this._handleDelegationEl;
        !a || a === s || (this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, !this._handleDelegationTornDown && (this._handleDelegationCleanup = us(s, this), this._handleDelegationEl = s, B("init", `flowCanvas "${this._id}" re-bound its delegated handle pointerdown listener to a replaced .flow-viewport`)));
      },
      /** Canvas click handler, context menu handler, long press, touch selection mode, context menu event listeners. */
      _initClickHandlers() {
        this._onCanvasClick = (l) => {
          if (this._suppressNextCanvasClick) {
            this._suppressNextCanvasClick = !1;
            return;
          }
          this.pendingConnection && (this._emit("connect-end", {
            connection: null,
            source: this.pendingConnection.source,
            sourceHandle: this.pendingConnection.sourceHandle,
            position: this.screenToFlowPosition(l.clientX, l.clientY)
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container));
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport")) {
            const d = this.screenToFlowPosition(l.clientX, l.clientY);
            this._emit("pane-click", { event: l, position: d }), this.deselectAll();
          }
        }, this._container.addEventListener("click", this._onCanvasClick), this._onCanvasContextMenu = (l) => {
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport"))
            if (l.preventDefault(), this.selectedNodes.size > 1) {
              const d = this.nodes.filter((u) => this.selectedNodes.has(u.id));
              this._emit("selection-context-menu", { nodes: d, event: l });
            } else {
              const d = this.screenToFlowPosition(l.clientX, l.clientY);
              this._emit("pane-context-menu", { event: l, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = Hf(
          this._container,
          (l) => {
            const c = l.target;
            if (s === "context-menu") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const f = d.getAttribute("data-flow-node-id"), h = this._nodeMap.get(f);
                if (h) {
                  this._emit("node-context-menu", { node: h, event: l });
                  return;
                }
              }
              const u = c.closest(".flow-edge-svg");
              if (u) {
                const f = u.getAttribute("data-edge-id"), h = f ? this._edgeMap.get(f) : void 0;
                if (h) {
                  this._emit("edge-context-menu", { edge: h, event: l });
                  return;
                }
              }
              if (this.selectedNodes.size > 1) {
                const f = this.nodes.filter((h) => this.selectedNodes.has(h.id));
                this._emit("selection-context-menu", { nodes: f, event: l });
              } else {
                const f = this.screenToFlowPosition(l.clientX, l.clientY);
                this._emit("pane-context-menu", { event: l, position: f });
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
          let l = 0, c = 0;
          const d = (p) => {
            p.pointerType === "touch" && (c++, c === 2 && Date.now() - l < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), l = Date.now());
          }, u = (p) => {
            p.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (l = 0));
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
        const a = [
          { event: "flow-node-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "node", x: l.detail.event.clientX, y: l.detail.event.clientY, node: l.detail.node, edge: null, position: null, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-edge-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "edge", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: l.detail.edge, position: null, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-pane-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "pane", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: l.detail.position, nodes: null, event: l.detail.event });
          }) },
          { event: "flow-selection-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "selection", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: null, nodes: l.detail.nodes, event: l.detail.event });
          }) }
        ];
        for (const l of a)
          this._container.addEventListener(l.event, l.handler);
        this._contextMenuListeners = a;
      },
      /** Keyboard shortcut handler (delete, arrows, undo/redo, copy/paste/cut, selection tool toggle, escape). */
      _initKeyboard() {
        this._onKeyDown = (s) => {
          if (!this._active || this._animationLocked) return;
          const a = s.target.tagName, l = this._shortcuts;
          if (je(s.key, l.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (je(s.key, l.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container);
            return;
          }
          if (je(s.key, l.delete)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (je(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (je(s.key, l.moveNodes)) {
            if (a === "INPUT" || a === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = gt(s, l.moveStepModifier) ? l.moveStep * l.moveStepMultiplier : l.moveStep;
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
                const f = Array.isArray(l.moveNodes) ? l.moveNodes : [l.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = f.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === h);
                g === 0 ? u = -c : g === 1 ? u = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            Df(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && Fr(h)) {
                h.position.x += d, h.position.y += u;
                const g = this._container ? De.get(this._container) : void 0;
                g?.bridge && g.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && je(s.key, l.undo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && je(s.key, l.redo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            je(s.key, l.copy) ? (s.preventDefault(), this.copy()) : je(s.key, l.paste) ? (s.preventDefault(), this.paste()) : je(s.key, l.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = nf(this._container, {
          getState: () => ({
            nodes: to(this.nodes, this._nodeMap, this._config.nodeOrigin),
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
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, a = s !== this._container;
          this._controls = df(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: jo }),
            onToggleInteractive: () => this.toggleInteractive(),
            onResetPanels: () => this.resetPanels(),
            onToggleFullscreen: () => this.toggleFullscreen()
          }), this.$watch("isInteractive", (l) => {
            this._controls?.update({ isInteractive: l });
          }), this.$watch("isFullscreen", (l) => {
            this._controls?.update({ isFullscreen: l });
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
          const s = this._fullscreenTarget ?? this._container, a = document.fullscreenElement === s;
          a !== this.isFullscreen && (this.isFullscreen = a, this._container?.dispatchEvent(new CustomEvent("flow-fullscreen-change", {
            bubbles: !0,
            detail: { isFullscreen: a }
          }))), a || (this._fullscreenTarget = null);
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
          const a = this._container.closest(s);
          if (a) return a;
          const l = document.querySelector(s);
          return l || (console.warn(`[AlpineFlow] fullscreenTarget selector "${s}" did not match; falling back to canvas container.`), this._container);
        }
        if (s instanceof HTMLElement) return s;
        if (typeof s == "function")
          try {
            const a = s(this._container);
            if (a instanceof HTMLElement) return a;
          } catch (a) {
            console.warn("[AlpineFlow] fullscreenTarget resolver threw:", a);
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
        const a = s.requestFullscreen;
        if (typeof a != "function") {
          console.warn("[AlpineFlow] requestFullscreen is not available in this context");
          return;
        }
        this._fullscreenTarget = s, Promise.resolve(a.call(s)).catch((l) => {
          console.warn("[AlpineFlow] fullscreen request rejected:", l), this._fullscreenTarget = null;
        });
      },
      /** Selection box/lasso setup (pointerdown/pointermove/pointerup handlers). */
      _initSelection() {
        this._selectionBox = uf(this._container), this._lasso = ff(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !gt(s, this._shortcuts.selectionBox))
            return;
          const a = s.target;
          if (a !== this._container && !a.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const l = this._config.selectionMode ?? "partial", c = gt(s, this._shortcuts.selectionModeToggle);
          if (this._selectionEffectiveMode = c ? l === "partial" ? "full" : "partial" : l, !this._container) return;
          const d = this._container.getBoundingClientRect(), u = s.clientX - d.left, f = s.clientY - d.top;
          this._selectionTool === "lasso" ? this._lasso.start(u, f, this._selectionEffectiveMode) : this._selectionBox.start(u, f, this._selectionEffectiveMode), s.target.setPointerCapture(s.pointerId);
        }, this._onSelectionPointerMove = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive()) || !this._container) return;
          const l = this._container.getBoundingClientRect(), c = s.clientX - l.left, d = s.clientY - l.top;
          this._selectionTool === "lasso" ? this._lasso.update(c, d) : this._selectionBox.update(c, d);
        }, this._onSelectionPointerUp = (s) => {
          if (!(this._selectionTool === "lasso" ? this._lasso?.isActive() : this._selectionBox?.isActive())) return;
          s.target.releasePointerCapture(s.pointerId), this._suppressNextCanvasClick = !0;
          const l = to(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? mf(l, u) : pf(l, u), h = new Set(f.map((g) => g.id));
            if (c = this.nodes.filter((g) => h.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const y = p.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let _ = 0;
                for (let b = 0; b <= m; b++) {
                  const x = p.getPointAtLength(b / m * y);
                  vi(x.x, x.y, u) && _++;
                }
                (this._selectionEffectiveMode === "full" ? _ === m + 1 : _ > 0) && d.push(g.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Ou(l, u, this._config.nodeOrigin) : Fu(l, u, this._config.nodeOrigin), h = new Set(f.map((g) => g.id));
            c = this.nodes.filter((g) => h.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!Go(u) || u.hidden) continue;
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
          const s = e.dropMimeTypes ?? ["application/alpineflow"], a = (l, c) => {
            const d = document.elementsFromPoint(l, c);
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
          this._onDropZoneDragOver = (l) => {
            !l.dataTransfer || !s.some((d) => l.dataTransfer.types.includes(d)) || (l.preventDefault(), l.dataTransfer.dropEffect = "move", this._container?.classList.add("flow-canvas-drag-over"));
          }, this._onDropZoneDragleave = (l) => {
            if (!this._container)
              return;
            const c = l.relatedTarget;
            c && this._container.contains(c) || this._container.classList.remove("flow-canvas-drag-over");
          }, this._onDropZoneDrop = (l) => {
            if (l.preventDefault(), this._container?.classList.remove("flow-canvas-drag-over"), !l.dataTransfer || !e.onDrop)
              return;
            let c = null, d = null;
            for (const p of s) {
              const y = l.dataTransfer.getData(p);
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
            const f = Sr(
              l.clientX,
              l.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = a(l.clientX, l.clientY), g = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c });
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
      getNodeAtPoint(s, a) {
        const l = document.elementsFromPoint(s, a);
        for (const c of l) {
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
        const a = [
          "columns",
          "gap",
          "padding",
          "headerHeight",
          "direction",
          "stretch"
        ], l = s.id, c = [];
        for (const d of a) {
          const u = t.watch(
            () => s.childLayout?.[d],
            () => {
              this._layoutDedup?.safeLayoutChildren(l);
            }
          );
          c.push(u);
        }
        this._childLayoutCleanups.set(l, c);
      },
      _uninstallChildLayoutWatchers(s) {
        const a = this._childLayoutCleanups.get(s);
        if (a) {
          for (const l of a) l();
          this._childLayoutCleanups.delete(s);
        }
      },
      /** Create the shared ResizeObserver instance (A1). Called from _initChildLayout. */
      _resizeObserverInit() {
        typeof ResizeObserver > "u" || (this._resizeObserver = new ResizeObserver((s) => {
          const a = /* @__PURE__ */ new Set();
          for (const l of s) {
            const c = l.target, d = c.getAttribute("data-flow-node-id");
            if (!d) continue;
            const u = this._nodeMap.get(d);
            if (!u) continue;
            const f = l.borderBoxSize?.[0], h = f ? f.inlineSize : c.offsetWidth, g = f ? f.blockSize : c.offsetHeight;
            if (h === 0 && g === 0 || c.offsetParent === null && c.tagName !== "BODY" || u.fixedDimensions === !0) continue;
            const p = Math.round(h), y = Math.round(g), m = u.dimensions;
            if (m && Math.abs((m.width ?? 0) - p) < 1 && Math.abs((m.height ?? 0) - y) < 1)
              continue;
            const _ = Ch(
              { width: p, height: y },
              u.minDimensions,
              u.maxDimensions
            );
            u.dimensions = _, a.add(d), u.parentId && this._layoutDedup?.safeLayoutChildren(u.parentId);
          }
          a.size > 0 && this._commitNodeGeometry([...a]);
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = xh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && vh(e, s, e.wireEvents);
          const a = _h(this, s), l = gh(this, s);
          this._wireCleanup = () => {
            a(), l();
          }, B("init", `wire bridge activated for "${this._id}"`);
        }
        B("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
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
        for (const [, s] of ea().entries())
          s && typeof s == "object" && typeof s.setup == "function" && s.setup(this);
      },
      /** Validate auto-layout dependency and start initial layout. */
      _initAutoLayout() {
        if (e.autoLayout) {
          const s = e.autoLayout.algorithm, a = {
            dagre: "layout:dagre",
            force: "layout:force",
            hierarchy: "layout:hierarchy",
            elk: "layout:elk"
          }, l = {
            dagre: "AlpineFlowDagre",
            force: "AlpineFlowForce",
            hierarchy: "AlpineFlowHierarchy",
            elk: "AlpineFlowElk"
          }, c = a[s];
          c && $t(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${l[s]})`);
        }
      },
      /** requestAnimationFrame ready flip, loading watch, loading overlay injection. */
      _initReady() {
        const s = e.fitViewOnInit ? 2 : 1;
        let a = 0;
        const l = () => {
          if (a++, a < s) {
            requestAnimationFrame(l);
            return;
          }
          this.$nextTick(() => {
            this.ready = !0;
          });
        };
        if (requestAnimationFrame(l), this.$watch("isLoading", (c) => {
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
        o = this, this._initDebug(), this._initContainer(), this._initColorMode(), this._initHydration(), this._initHistory(), this._initAnnouncer(), this._initCollab(), this._initPanZoom(), this._initHandleDelegation(), this._initClickHandlers(), this._initKeyboard(), this._initMinimap(), this._initFullscreen(), this._initControls(), this._initSelection(), this._initChildLayout(), this._initAddons(), this._initDropZone(), this._initAutoLayout(), this._initReady();
      },
      _setupMarkerDefs() {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
        const a = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        s.appendChild(a), this._container?.appendChild(s), this._markerDefsEl = s, this._updateMarkerDefs(), this.$watch("edges", () => {
          this._updateMarkerDefs();
        });
      },
      _updateMarkerDefs() {
        if (!this._markerDefsEl) return;
        const s = this._markerDefsEl.querySelector("defs"), a = /* @__PURE__ */ new Map();
        for (const d of this.edges)
          for (const u of [d.markerStart, d.markerEnd]) {
            if (!u) continue;
            const f = Ft(u), h = Ot(f, this._id);
            a.has(h) || a.set(h, Qn(f, h));
          }
        const l = s.querySelectorAll("marker"), c = /* @__PURE__ */ new Set();
        l.forEach((d) => {
          a.has(d.id) ? c.add(d.id) : d.remove();
        });
        for (const [d, u] of a)
          if (!c.has(d)) {
            const h = new DOMParser().parseFromString(
              `<svg xmlns="http://www.w3.org/2000/svg">${u}</svg>`,
              "image/svg+xml"
            ).querySelector("marker");
            h && s.appendChild(document.importNode(h, !0));
          }
      },
      destroy() {
        this._destroyAnimations?.(), this._wireCleanup?.(), this._wireCleanup = null, this._handleDelegationTornDown = !0, this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null;
        try {
          this._emit("destroy");
        } catch (s) {
          console.error(
            `[AlpineFlow] a destroy callback threw while destroying flowCanvas "${this._id}"; teardown continued`,
            s
          );
        }
        if (B("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
          for (const s of this._contextMenuListeners)
            this._container.removeEventListener(s.event, s.handler);
        if (this._contextMenuListeners = [], this._onKeyDown && document.removeEventListener("keydown", this._onKeyDown), this._onContainerPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onContainerPointerDown), this._markerDefsEl?.remove(), this._markerDefsEl = null, this._minimap?.destroy(), this._minimap = null, this._controls?.destroy(), this._controls = null, this._onFullscreenChange && typeof document < "u" && document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._onFullscreenChange = null, typeof document < "u") {
          const s = document.fullscreenElement;
          s && (s === this._container || s === this._fullscreenTarget) && document.exitFullscreen?.().catch(() => {
          });
        }
        if (this._fullscreenTarget = null, this._onSelectionPointerDown && this._container && this._container.removeEventListener("pointerdown", this._onSelectionPointerDown), this._onSelectionPointerMove && this._container && this._container.removeEventListener("pointermove", this._onSelectionPointerMove), this._onSelectionPointerUp && this._container && this._container.removeEventListener("pointerup", this._onSelectionPointerUp), this._selectionBox?.destroy(), this._selectionBox = null, this._lasso?.destroy(), this._lasso = null, this._viewportEl = null, this._container && (this._container.removeEventListener("dragover", this._onDropZoneDragOver), this._container.removeEventListener("dragleave", this._onDropZoneDragleave), this._container.removeEventListener("drop", this._onDropZoneDrop)), this._followHandle?.stop(), this._followHandle = null, this._animator = null, this._layoutAnimFrame && (cancelAnimationFrame(this._layoutAnimFrame), this._layoutAnimFrame = 0), this._autoLayoutTimer && (clearTimeout(this._autoLayoutTimer), this._autoLayoutTimer = null), this._colorModeHandle && (this._colorModeHandle.destroy(), this._colorModeHandle = null), this._container) {
          const s = De.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), De.delete(this._container));
        }
        this._container && this._container.removeAttribute("data-flow-canvas"), this.$store.flow.unregister(this._id), this._vpFrame !== null && (cancelAnimationFrame(this._vpFrame), this._vpFrame = null), this._panZoom?.destroy(), this._panZoom = null, this._announcer?.destroy(), this._announcer = null, this._computeDebounceTimer && (clearTimeout(this._computeDebounceTimer), this._computeDebounceTimer = null);
        for (const s of [...this._childLayoutCleanups.keys()])
          this._uninstallChildLayoutWatchers(s);
        this._resizeObserver?.disconnect(), this._resizeObserver = null, this._layoutDedup?.dispose(), this._layoutDedup = null;
      },
      // ── Remaining Flat Methods ────────────────────────────────────────
      /**
       * Set a node's rotation angle in degrees.
       */
      rotateNode(s, a) {
        const l = this.nodes.find((c) => c.id === s);
        l && (this._captureHistory(), l.rotation = a);
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
        return this._layoutDedup ? Eh(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? De.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => _m));
        } catch {
          throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
        }
        return a(
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
      get(s, a) {
        return o[a];
      },
      set(s, a, l) {
        return o[a] = l, !0;
      }
    }), r = [
      Ph(i),
      Mh(i),
      Th(i),
      $h(i),
      Hh(i),
      ug(i),
      gg(i),
      pg(i),
      mg(i),
      Sg(i),
      kg(i),
      Lg(i),
      Bg(i, t),
      qg(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      ef(s, a);
    }, n;
  });
}
function $s(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Ug(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(_) {
    const E = s();
    return {
      x: (_.x - E.x) / E.zoom,
      y: (_.y - E.y) / E.zoom
    };
  }
  const y = qe(t), m = pc().subject(() => {
    const _ = s(), E = a();
    return {
      x: E.x * _.zoom + _.x,
      y: E.y * _.zoom + _.y
    };
  }).on("start", (_) => {
    g = p(_), o?.({ nodeId: e, position: g, sourceEvent: _.sourceEvent });
  }).on("drag", (_) => {
    let E = p(_);
    l && (E = $s(E, l));
    const b = {
      x: E.x - g.x,
      y: E.y - g.y
    };
    i?.({ nodeId: e, position: E, delta: b, sourceEvent: _.sourceEvent });
  }).on("end", (_) => {
    let E = p(_);
    l && (E = $s(E, l)), r?.({ nodeId: e, position: E, sourceEvent: _.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((_) => {
    if (u?.() || f && _.target?.closest?.("." + f)) return !1;
    if (c) {
      const E = t.querySelector(c);
      return E ? E.contains(_.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Zg(t, e) {
  const n = Ut(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Gg(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, a = 1 / 0, l = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const g = h.x + h.width / 2, p = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, _ = [
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
    for (const [b, x] of _) {
      const M = x - b;
      Math.abs(M) <= n && (i.add(x), Math.abs(M) < Math.abs(a) && (a = M, r = M));
    }
    const E = [
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
    for (const [b, x] of E) {
      const M = x - b;
      Math.abs(M) <= n && (o.add(x), Math.abs(M) < Math.abs(l) && (l = M, s = M));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Kg(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Jg(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = Kg(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const Qg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let ep = 0;
function Ds(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Ao(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function tp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function np(t, e, n) {
  const o = t.querySelectorAll('[data-flow-handle-type="source"]');
  if (o.length === 0) return null;
  let i = null, r = 1 / 0;
  return o.forEach((s) => {
    const a = s, l = a.getBoundingClientRect();
    if (l.width === 0 && l.height === 0) return;
    const c = l.left + l.width / 2, d = l.top + l.height / 2, u = Math.sqrt((e - c) ** 2 + (n - d) ** 2);
    u < r && (r = u, i = a);
  }), i;
}
function op(t, e, n) {
  let o = 1 / 0, i = -1 / 0, r = 1 / 0, s = -1 / 0;
  for (const c of n)
    o = Math.min(o, c.x), i = Math.max(i, c.x + c.width), r = Math.min(r, c.y), s = Math.max(s, c.y + c.height);
  const a = 50, l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  l.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:500;";
  for (const c of t) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(o - a)), d.setAttribute("y1", String(c)), d.setAttribute("x2", String(i + a)), d.setAttribute("y2", String(c)), d.classList.add("flow-guide-path"), l.appendChild(d);
  }
  for (const c of e) {
    const d = document.createElementNS("http://www.w3.org/2000/svg", "line");
    d.setAttribute("x1", String(c)), d.setAttribute("y1", String(r - a)), d.setAttribute("x2", String(c)), d.setAttribute("y2", String(s + a)), d.classList.add("flow-guide-path"), l.appendChild(d);
  }
  return l;
}
function ip(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = null, c = !1, d = null, u = null, f = null, h = null, g = null, p = null, y = !1, m = -1, _ = null, E = !1, b = [], x = "", M = [], P = null;
      i(() => {
        if (!e.isConnected) return;
        const S = o(n);
        if (!S || S.hidden) return;
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        const w = S.parentId ? v.getAbsolutePosition(S.id) : S.position ?? { x: 0, y: 0 }, I = S.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], k = S.dimensions?.width ?? 150, R = S.dimensions?.height ?? 40;
        e.style.left = w.x - k * I[0] + "px", e.style.top = w.y - R * I[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const S = o(n);
        if (!S) return;
        if (e.dataset.flowNodeId = S.id, S.type && (e.dataset.flowNodeType = S.type), !E) {
          const z = e.closest("[x-data]"), X = z ? t.$data(z) : null;
          let W = !1;
          if (X?._config?.nodeTypes) {
            const j = S.type ?? "default", H = X._config.nodeTypes[j] ?? X._config.nodeTypes.default;
            if (typeof H == "string") {
              const te = document.querySelector(H);
              te?.content && (e.appendChild(te.content.cloneNode(!0)), W = !0);
            } else typeof H == "function" && (H(S, e), W = !0);
          }
          if (!W && e.children.length === 0) {
            const j = document.createElement("div");
            j.setAttribute("x-flow-handle:target", "");
            const H = document.createElement("span");
            H.setAttribute("x-text", "node.data.label");
            const te = document.createElement("div");
            te.setAttribute("x-flow-handle:source", ""), e.appendChild(j), e.appendChild(H), e.appendChild(te), W = !0;
          }
          if (W)
            for (const j of Array.from(e.children))
              t.addScopeToNode(j, { node: S }), t.initTree(j);
          E = !0;
        }
        if (S.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), P !== S.id && (s?.destroy(), s = null, P = S.id);
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), S.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), S.dimensions) {
          const z = S.childLayout, X = S.fixedDimensions, W = (v._childrenIds?.get(S.id)?.length ?? 0) > 0;
          e.style.width = S.dimensions.width + "px", z || X || W ? e.style.height = S.dimensions.height + "px" : e.style.height = "";
        }
        v.selectedNodes.has(S.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!S.selected)), S._validationErrors && S._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const w = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], I = S.runState;
        for (const z of w)
          e.classList.remove(z);
        I && I !== "pending" && e.classList.add(`flow-node-${I}`);
        for (const z of b)
          e.classList.remove(z);
        const k = S.class ? S.class.split(/\s+/).filter(Boolean) : [];
        for (const z of k)
          e.classList.add(z);
        b = k;
        const R = S.shape ? `flow-node-${S.shape}` : "";
        x !== R && (x && e.classList.remove(x), R && e.classList.add(R), x = R);
        const O = t.$data(e.closest("[data-flow-canvas]")), Y = S.shape && O?._shapeRegistry?.[S.shape];
        if (Y?.clipPath ? e.style.clipPath = Y.clipPath : e.style.clipPath = "", S.style) {
          const z = typeof S.style == "string" ? Object.fromEntries(S.style.split(";").filter(Boolean).map((W) => W.split(":").map((j) => j.trim()))) : S.style, X = [];
          for (const [W, j] of Object.entries(z))
            W && j && (e.style.setProperty(W, j), X.push(W));
          for (const W of M)
            X.includes(W) || e.style.removeProperty(W);
          M = X;
        } else if (M.length > 0) {
          for (const z of M)
            e.style.removeProperty(z);
          M = [];
        }
        if (S.rotation ? (e.style.transform = `rotate(${S.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", S.focusable ?? v._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", S.ariaRole ?? "group"), e.setAttribute("aria-label", S.ariaLabel ?? (S.data?.label ? `Node: ${S.data.label}` : `Node ${S.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), S.domAttributes)
          for (const [z, X] of Object.entries(S.domAttributes))
            z.startsWith("on") || Qg.has(z.toLowerCase()) || e.setAttribute(z, X);
        Be(S) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), S.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const L = e.classList.contains("flow-node-condensed");
        S.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!S.condensed !== L && requestAnimationFrame(() => {
          S.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${S.id}" re-measured after condense toggle`, S.dimensions);
        }), S.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const N = S.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), N !== "visible" && e.classList.add(`flow-handles-${N}`);
        let F = Gr(S, v._nodeMap);
        v._config?.elevateNodesOnSelect !== !1 && v.selectedNodes.has(S.id) && (F += S.type === "group" ? Math.max(1 - F, 0) : 1e3), y && (F += 1e3);
        const oe = S.type === "group" ? 0 : 2;
        if (F !== oe ? e.style.zIndex = String(F) : e.style.removeProperty("z-index"), !Fr(S)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const q = e.closest(".flow-container");
        s || (s = Ug(e, S.id, {
          container: q ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => v._animationLocked,
          noDragClassName: v._config?.noDragClassName ?? "nodrag",
          dragThreshold: v._config?.nodeDragThreshold ?? 0,
          getViewport: () => v.viewport,
          getNodePosition: () => {
            const z = v.getNode(S.id);
            return z ? z.parentId ? v.getAbsolutePosition(z.id) : { x: z.position.x, y: z.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: v._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: z, position: X, sourceEvent: W }) {
            e.classList.add("flow-node-dragging"), a = !1, c = !1, d = null;
            const j = v._container ? De.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !0), h?.destroy(), h = null, g = null, p && q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null, l = v._snapshotHistory?.() ?? null, B("drag", `Node "${z}" drag start`, X);
            const H = v.getNode(z);
            if (H) {
              if (v._config?.selectNodesOnDrag !== !1 && H.selectable !== !1 && !v.selectedNodes.has(z) && (gt(W, v._shortcuts?.multiSelect) || v.deselectAll(), v.selectedNodes.add(z), H.selected = !0, v._emitSelectionChange(), c = !0), v._emit("node-drag-start", { node: H }), v.selectedNodes.has(z) && v.selectedNodes.size > 1) {
                const te = pt(z, v.nodes);
                d = /* @__PURE__ */ new Map();
                for (const Q of v.selectedNodes) {
                  if (Q === z || te.has(Q))
                    continue;
                  const U = v.getNode(Q);
                  U && U.draggable !== !1 && d.set(Q, { x: U.position.x, y: U.position.y });
                }
              }
              if (v._draggingNodeIds.add(z), d)
                for (const te of d.keys())
                  v._draggingNodeIds.add(te);
            }
            v._config?.autoPanOnNodeDrag !== !1 && q && (u = zr({
              container: q,
              speed: v._config?.autoPanSpeed ?? 15,
              onPan(te, Q) {
                const U = () => v._viewportLive ?? v.viewport, Z = U().zoom || 1, se = { x: U().x, y: U().y };
                v._panZoom?.setViewport({
                  x: U().x - te,
                  y: U().y - Q,
                  zoom: Z
                });
                const ae = se.x - U().x, K = se.y - U().y, ee = ae === 0 && K === 0, ue = v.getNode(z);
                let fe = !1;
                if (ue) {
                  const ie = ue.position.x, le = ue.position.y;
                  ue.position.x += ae / Z, ue.position.y += K / Z;
                  const re = $n(ue.position, ue, v._config?.nodeExtent);
                  ue.position.x = re.x, ue.position.y = re.y, fe = ue.position.x === ie && ue.position.y === le;
                }
                if (d)
                  for (const [ie] of d) {
                    const le = v.getNode(ie);
                    if (le) {
                      le.position.x += ae / Z, le.position.y += K / Z;
                      const re = $n(le.position, le, v._config?.nodeExtent);
                      le.position.x = re.x, le.position.y = re.y;
                    }
                  }
                return ee && fe;
              }
            }), W instanceof MouseEvent && u.updatePointer(W.clientX, W.clientY), u.start());
          },
          onDrag({ nodeId: z, position: X, delta: W, sourceEvent: j }) {
            a = !0;
            const H = v.getNode(z);
            if (H) {
              if (H.parentId) {
                const U = v.getAbsolutePosition(H.parentId);
                let Z = X.x - U.x, se = X.y - U.y;
                const ae = H.dimensions ?? { width: 150, height: 50 }, K = v.getNode(H.parentId);
                if (K?.childLayout) {
                  y || (e.classList.add("flow-reorder-dragging"), _ = H.parentId), y = !0;
                  const ee = H.extent !== "parent";
                  if (H.position.x = X.x - U.x, H.position.y = X.y - U.y, !ee && K.dimensions) {
                    const ie = Co({ x: H.position.x, y: H.position.y }, ae, K.dimensions);
                    H.position.x = ie.x, H.position.y = ie.y;
                  }
                  const ue = H.dimensions?.width ?? 150, fe = H.dimensions?.height ?? 50;
                  if (ee) {
                    const ie = K.dimensions?.width ?? 150, le = K.dimensions?.height ?? 50, re = H.position.x + ue / 2, ge = H.position.y + fe / 2, be = 12, Me = _ === H.parentId ? 0 : be, ke = re >= Me && re <= ie - Me && ge >= Me && ge <= le - Me, Ce = /* @__PURE__ */ new Set();
                    let V = H.parentId;
                    for (; V; )
                      Ce.add(V), V = v.getNode(V)?.parentId;
                    const ne = X.x + ue / 2, de = X.y + fe / 2, ye = pt(H.id, v.nodes);
                    let Ee = null;
                    const pe = v.nodes.filter(
                      (ce) => ce.id !== H.id && (ce.droppable || ce.childLayout) && !ce.hidden && !ye.has(ce.id) && (ke ? !Ce.has(ce.id) : ce.id !== H.parentId) && (!ce.acceptsDrop || ce.acceptsDrop(H))
                    );
                    for (const ce of pe) {
                      const me = ce.parentId ? v.getAbsolutePosition(ce.id) : ce.position, xe = ce.dimensions?.width ?? 150, Le = ce.dimensions?.height ?? 50, Fe = ce.id === p ? 0 : be;
                      ne >= me.x + Fe && ne <= me.x + xe - Fe && de >= me.y + Fe && de <= me.y + Le - Fe && (Ee = ce);
                    }
                    const he = Ee?.id ?? null;
                    if (he !== p) {
                      p && q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), he && q && q.querySelector(`[data-flow-node-id="${CSS.escape(he)}"]`)?.classList.add("flow-node-drop-target"), p = he;
                      const ce = he ? v.getNode(he) : null, me = _;
                      if (ce?.childLayout && he !== _) {
                        me && (v.layoutChildren(me, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(me, { omitFromComputation: z })), _ = he;
                        const xe = v.nodes.filter((Te) => Te.parentId === he && Te.id !== z).sort((Te, ze) => (Te.order ?? 1 / 0) - (ze.order ?? 1 / 0)), Le = xe.length, Fe = [...xe];
                        Fe.splice(Le, 0, H);
                        for (let Te = 0; Te < Fe.length; Te++)
                          Fe[Te].order = Te;
                        m = Le;
                        const Oe = v._initialDimensions?.get(z), wt = { ...H, dimensions: Oe ? { ...Oe } : void 0 };
                        v.layoutChildren(he, { excludeId: z, includeNode: wt, shallow: !0 }), v.propagateLayoutUp(he, { includeNode: wt });
                      } else ke && _ !== H.parentId ? (me && me !== H.parentId && (v.layoutChildren(me, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(me, { omitFromComputation: z })), _ = H.parentId, m = -1) : !he && !ke && (me && (v.layoutChildren(me, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(me, { omitFromComputation: z })), _ = null, m = -1);
                    }
                  }
                  if (_) {
                    const ie = v.getNode(_), le = ie?.childLayout ?? K.childLayout, re = v.nodes.filter((V) => V.parentId === _ && V.id !== z).sort((V, ne) => (V.order ?? 1 / 0) - (ne.order ?? 1 / 0));
                    let ge, be;
                    if (_ !== H.parentId) {
                      const V = ie?.parentId ? v.getAbsolutePosition(_) : ie?.position ?? { x: 0, y: 0 };
                      ge = X.x - V.x, be = X.y - V.y;
                    } else
                      ge = H.position.x, be = H.position.y;
                    const Me = le.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (_ === H.parentId) {
                        const V = H.order ?? 0;
                        m = re.filter((ne) => (ne.order ?? 0) < V).length;
                      } else
                        m = re.length;
                    const ke = m;
                    let Ce = re.length;
                    for (let V = 0; V < re.length; V++) {
                      const ne = re[V], de = ne.dimensions?.width ?? 150, ye = ne.dimensions?.height ?? 50, Ee = V < ke ? 1 - Me : Me, pe = ne.position.y + ye * Ee, he = ne.position.x + de * Ee;
                      if (le.direction === "grid") {
                        const ce = {
                          x: ge + ue / 2,
                          y: be + fe / 2
                        }, me = ne.position.y + ye / 2;
                        if (ce.y < ne.position.y) {
                          Ce = V;
                          break;
                        }
                        if (Math.abs(ce.y - me) < ye / 2 && ce.x < he) {
                          Ce = V;
                          break;
                        }
                      } else if (le.direction === "vertical") {
                        if ((V < ke ? be : be + fe) < pe) {
                          Ce = V;
                          break;
                        }
                      } else if ((V < ke ? ge : ge + ue) < he) {
                        Ce = V;
                        break;
                      }
                    }
                    if (Ce !== m) {
                      m = Ce;
                      const V = [...re];
                      V.splice(Ce, 0, H);
                      for (let pe = 0; pe < V.length; pe++)
                        V[pe].order = pe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), v._layoutAnimFrame && cancelAnimationFrame(v._layoutAnimFrame);
                      const de = H.id, ye = _, Ee = ye !== H.parentId;
                      v._layoutAnimFrame = requestAnimationFrame(() => {
                        if (Ee && ye) {
                          const me = v.getNode(de);
                          let xe;
                          if (me) {
                            const Le = v._initialDimensions?.get(de);
                            xe = { ...me, dimensions: Le ? { ...Le } : void 0 };
                          }
                          v.layoutChildren(ye, {
                            excludeId: de,
                            includeNode: xe,
                            shallow: !0
                          }), v.propagateLayoutUp(ye, {
                            includeNode: xe
                          });
                        } else
                          v.layoutChildren(ye, de, !0);
                        const pe = performance.now(), he = 300, ce = () => {
                          v._layoutAnimTick++, performance.now() - pe < he ? v._layoutAnimFrame = requestAnimationFrame(ce) : v._layoutAnimFrame = 0;
                        };
                        v._layoutAnimFrame = requestAnimationFrame(ce);
                      });
                    }
                  }
                  u && j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY);
                  return;
                }
                if (H.extent === "parent" && K?.dimensions) {
                  const ee = Co(
                    { x: Z, y: se },
                    ae,
                    K.dimensions
                  );
                  Z = ee.x, se = ee.y;
                } else if (Array.isArray(H.extent)) {
                  const ee = Kr({ x: Z, y: se }, H.extent, ae);
                  Z = ee.x, se = ee.y;
                }
                if ((!H.extent || H.extent !== "parent") && (cn(
                  K,
                  v._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!K?.childLayout) && K?.dimensions) {
                  const fe = Co(
                    { x: Z, y: se },
                    ae,
                    K.dimensions
                  );
                  Z = fe.x, se = fe.y;
                }
                if (H.expandParent && K?.dimensions) {
                  const ee = Jf(
                    { x: Z, y: se },
                    ae,
                    K.dimensions
                  );
                  ee && (K.dimensions.width = ee.width, K.dimensions.height = ee.height);
                }
                H.position.x = Z, H.position.y = se;
              } else {
                const U = $n(X, H, v._config?.nodeExtent);
                H.position.x = U.x, H.position.y = U.y;
              }
              if (v._config?.snapToGrid) {
                const U = H.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], Z = H.dimensions?.width ?? 150, se = H.dimensions?.height ?? 40, ae = H.parentId ? v.getAbsolutePosition(H.id) : H.position;
                e.style.left = ae.x - Z * U[0] + "px", e.style.top = ae.y - se * U[1] + "px", v._layoutAnimTick++;
              }
              if (v._emit("node-drag", { node: H, position: X }), d)
                for (const [U, Z] of d) {
                  const se = v.getNode(U);
                  if (se) {
                    let ae = Z.x + W.x, K = Z.y + W.y;
                    const ee = $n({ x: ae, y: K }, se, v._config?.nodeExtent);
                    se.position.x = ee.x, se.position.y = ee.y;
                  }
                }
              const Q = v._config?.helperLines;
              if (Q) {
                const U = typeof Q == "object" ? Q.snap ?? !0 : !0, Z = typeof Q == "object" ? Q.threshold ?? 5 : 5, se = (ie) => {
                  const le = ie.parentId ? v.getAbsolutePosition(ie.id) : ie.position;
                  return Zg({ ...ie, position: le }, v._config?.nodeOrigin);
                }, K = (v.selectedNodes.size > 1 && v.selectedNodes.has(z) ? v.nodes.filter((ie) => v.selectedNodes.has(ie.id)) : [H]).map(se), ee = {
                  x: Math.min(...K.map((ie) => ie.x)),
                  y: Math.min(...K.map((ie) => ie.y)),
                  width: Math.max(...K.map((ie) => ie.x + ie.width)) - Math.min(...K.map((ie) => ie.x)),
                  height: Math.max(...K.map((ie) => ie.y + ie.height)) - Math.min(...K.map((ie) => ie.y))
                }, ue = v.nodes.filter(
                  (ie) => !v.selectedNodes.has(ie.id) && ie.id !== z && ie.hidden !== !0 && ie.filtered !== !0
                ).map(se), fe = Gg(ee, ue, Z);
                if (U && (fe.snapOffset.x !== 0 || fe.snapOffset.y !== 0) && (H.position.x += fe.snapOffset.x, H.position.y += fe.snapOffset.y, d))
                  for (const [ie] of d) {
                    const le = v.getNode(ie);
                    le && (le.position.x += fe.snapOffset.x, le.position.y += fe.snapOffset.y);
                  }
                if (f?.remove(), fe.horizontal.length > 0 || fe.vertical.length > 0) {
                  const ie = q?.querySelector(".flow-viewport");
                  if (ie) {
                    const le = v.nodes.map(se);
                    f = op(fe.horizontal, fe.vertical, le), ie.appendChild(f);
                  }
                } else
                  f = null;
                v._emit("helper-lines-change", {
                  horizontal: fe.horizontal,
                  vertical: fe.vertical
                });
              }
            }
            if (v._config?.preventOverlap) {
              const Q = typeof v._config.preventOverlap == "number" ? v._config.preventOverlap : 5, U = H.dimensions?.width ?? ve, Z = H.dimensions?.height ?? _e, se = v.selectedNodes, ae = v.nodes.filter((ee) => ee.id !== H.id && !ee.hidden && !se.has(ee.id)).map((ee) => Wt(ee, v._config?.nodeOrigin)), K = Lh(H.position, U, Z, ae, Q);
              H.position.x = K.x, H.position.y = K.y;
            }
            if (!H.parentId) {
              const Q = pt(H.id, v.nodes), U = v.nodes.filter(
                (ee) => ee.id !== H.id && ee.droppable && !ee.hidden && !Q.has(ee.id) && (!ee.acceptsDrop || ee.acceptsDrop(H))
              ), Z = Wt(H, v._config?.nodeOrigin);
              let se = null;
              const ae = 12;
              for (const ee of U) {
                const ue = ee.parentId ? v.getAbsolutePosition(ee.id) : ee.position, fe = ee.dimensions?.width ?? ve, ie = ee.dimensions?.height ?? _e, le = Z.x + Z.width / 2, re = Z.y + Z.height / 2, ge = ee.id === p ? 0 : ae;
                le >= ue.x + ge && le <= ue.x + fe - ge && re >= ue.y + ge && re <= ue.y + ie - ge && (se = ee);
              }
              const K = se?.id ?? null;
              K !== p && (p && q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), K && q && q.querySelector(`[data-flow-node-id="${CSS.escape(K)}"]`)?.classList.add("flow-node-drop-target"), p = K);
            }
            if (v._config?.proximityConnect) {
              const Q = v._config.proximityConnectDistance ?? 150, U = H.dimensions ?? { width: 150, height: 50 }, Z = {
                x: H.position.x + U.width / 2,
                y: H.position.y + U.height / 2
              }, se = v.nodes.filter((K) => K.id !== H.id && !K.hidden).map((K) => ({
                id: K.id,
                center: {
                  x: K.position.x + (K.dimensions?.width ?? 150) / 2,
                  y: K.position.y + (K.dimensions?.height ?? 50) / 2
                }
              })), ae = Jg(H.id, Z, se, Q);
              if (ae)
                if (v.edges.some(
                  (ee) => ee.source === ae.source && ee.target === ae.target || ee.source === ae.target && ee.target === ae.source
                ))
                  h?.destroy(), h = null, g = null;
                else {
                  if (g = ae, !h) {
                    h = Yt({
                      connectionLineType: v._config?.connectionLineType,
                      connectionLineStyle: v._config?.connectionLineStyle,
                      connectionLine: v._config?.connectionLine
                    });
                    const ee = q?.querySelector(".flow-viewport");
                    ee && ee.appendChild(h.svg);
                  }
                  h.update({
                    fromX: Z.x,
                    fromY: Z.y,
                    toX: ae.targetCenter.x,
                    toY: ae.targetCenter.y,
                    source: ae.source
                  });
                }
              else
                h?.destroy(), h = null, g = null;
            }
            const te = v._container ? De.get(v._container) : void 0;
            if (te?.bridge) {
              if (te.bridge.pushLocalNodeUpdate(z, { position: H.position }), d)
                for (const [Q] of d) {
                  const U = v.getNode(Q);
                  U && te.bridge.pushLocalNodeUpdate(Q, { position: U.position });
                }
              if (te.awareness && j instanceof MouseEvent && v._container) {
                const Q = v._container.getBoundingClientRect(), U = v._viewportLive ?? v.viewport, Z = (j.clientX - Q.left - U.x) / U.zoom, se = (j.clientY - Q.top - U.y) / U.zoom;
                te.awareness.updateCursor({ x: Z, y: se });
              }
            }
            u && j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY);
          },
          onDragEnd({ nodeId: z, position: X }) {
            const W = d ? [z, ...d.keys()] : [z];
            v._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), B("drag", `Node "${z}" drag end`, X);
            const j = v._container ? De.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !1), u?.stop(), u = null, f?.remove(), f = null, v._config?.helperLines && v._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const H = v.getNode(z);
            if (H && v._emit("node-drag-end", { node: H, position: X }), y && H?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const te = _;
              y = !1, m = -1, _ = null, v._layoutAnimFrame && (cancelAnimationFrame(v._layoutAnimFrame), v._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), p ? (q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Ao(v, z, p), p = null) : te && te !== H.parentId ? (v.layoutChildren(te, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(te, { omitFromComputation: z }), v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })) : (v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })), d = null, v._layoutAnimTick++, v._commitNodeGeometry(W), Ds(v, a, l), l = null, a = !1;
              return;
            }
            if (H && p)
              q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), Ao(v, z, p), p = null;
            else if (H && H.parentId && !p) {
              const te = cn(
                v.getNode(H.parentId),
                v._config?.childValidationRules ?? {}
              ), Q = v.getNode(H.parentId);
              if (!te?.preventChildEscape && !Q?.childLayout && Q?.dimensions) {
                const U = H.position.x, Z = H.position.y, se = H.dimensions?.width ?? 150, ae = H.dimensions?.height ?? 50;
                (U + se < 0 || Z + ae < 0 || U > Q.dimensions.width || Z > Q.dimensions.height) && Ao(v, z, null);
              }
              p = null;
            } else
              p && q && q.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null;
            if (v._config?.proximityConnect && g) {
              const te = g;
              h?.destroy(), h = null, g = null;
              let Q = !0;
              if (v._config.onProximityConnect && v._config.onProximityConnect({
                source: te.source,
                target: te.target,
                distance: te.distance
              }) === !1 && (Q = !1), Q) {
                const U = {
                  source: te.source,
                  sourceHandle: "source",
                  target: te.target,
                  targetHandle: "target"
                };
                if (ht(U, v.edges, { preventCycles: v._config?.preventCycles }) && ft(U, v._config?.connectionRules, v._nodeMap) && (q ? et(q, U, v.edges) : !0) && (q ? Qe(q, U) : !0) && (!v._config.isValidConnection || v._config.isValidConnection(U))) {
                  if (v._config.proximityConnectConfirm) {
                    const ue = q?.querySelector(`[data-flow-node-id="${CSS.escape(te.source)}"]`), fe = q?.querySelector(`[data-flow-node-id="${CSS.escape(te.target)}"]`);
                    ue?.classList.add("flow-proximity-confirm"), fe?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      ue?.classList.remove("flow-proximity-confirm"), fe?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const ee = `e-${te.source}-${te.target}-${Date.now()}-${ep++}`;
                  v.addEdges({ id: ee, ...U }), v._emit("connect", { connection: U });
                }
              }
            } else
              h?.destroy(), h = null, g = null;
            d = null, a && (v._layoutAnimTick++, v._commitNodeGeometry(W)), Ds(v, a, l), l = null, a = !1;
          }
        }));
      });
      {
        const S = t.$data(e.closest("[x-data]"));
        if (S?._config?.easyConnect) {
          const v = S._config.easyConnectKey ?? "alt", w = (I) => {
            if (!tp(I, v) || I.target.closest("[data-flow-handle-type]")) return;
            const k = t.$data(e.closest("[x-data]"));
            if (!k || k._animationLocked || k._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const O = k.getNode(R.id);
            if (!O || O.connectable === !1) return;
            I.preventDefault(), I.stopPropagation(), I.stopImmediatePropagation();
            const Y = np(e, I.clientX, I.clientY), D = Y?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const L = e.closest(".flow-container");
            if (!L) return;
            const N = k._viewportLive ?? k.viewport, F = N?.zoom || 1, J = N?.x || 0, oe = N?.y || 0, G = L.getBoundingClientRect();
            let q, z;
            if (Y) {
              const Z = Y.getBoundingClientRect();
              q = (Z.left + Z.width / 2 - G.left - J) / F, z = (Z.top + Z.height / 2 - G.top - oe) / F;
            } else {
              const Z = e.getBoundingClientRect();
              q = (Z.left + Z.width / 2 - G.left - J) / F, z = (Z.top + Z.height / 2 - G.top - oe) / F;
            }
            k._emit("connect-start", { source: R.id, sourceHandle: D });
            const X = Yt({
              connectionLineType: k._config?.connectionLineType,
              connectionLineStyle: k._config?.connectionLineStyle,
              connectionLine: k._config?.connectionLine
            }), W = L.querySelector(".flow-viewport");
            W && W.appendChild(X.svg), X.update({ fromX: q, fromY: z, toX: q, toY: z, source: R.id, sourceHandle: D }), k.pendingConnection = { source: R.id, sourceHandle: D, position: { x: q, y: z } }, vn(L, R.id, D, k);
            let j = po(L, k, I.clientX, I.clientY), H = null;
            const te = k._config?.connectionSnapRadius ?? 20, Q = (Z) => {
              const se = k.screenToFlowPosition(Z.clientX, Z.clientY), ae = wn({
                containerEl: L,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: se,
                connectionSnapRadius: te,
                getNode: (K) => k.getNode(K),
                toFlowPosition: (K, ee) => k.screenToFlowPosition(K, ee)
              });
              ae.element !== H && (H?.classList.remove("flow-handle-active"), ae.element?.classList.add("flow-handle-active"), H = ae.element), X.update({ fromX: q, fromY: z, toX: ae.position.x, toY: ae.position.y, source: R.id, sourceHandle: D }), k.pendingConnection = { ...k.pendingConnection, position: ae.position }, j?.updatePointer(Z.clientX, Z.clientY);
            }, U = async (Z) => {
              j?.stop(), j = null, document.removeEventListener("pointermove", Q), document.removeEventListener("pointerup", U), X.destroy(), H?.classList.remove("flow-handle-active"), Pe(L), e.classList.remove("flow-easy-connecting");
              const se = k.screenToFlowPosition(Z.clientX, Z.clientY), ae = { source: R.id, sourceHandle: D, position: se };
              k.pendingConnection = null;
              let K = H;
              if (K || (K = document.elementFromPoint(Z.clientX, Z.clientY)?.closest('[data-flow-handle-type="target"]')), !K) {
                k._emit("connect-end", { connection: null, ...ae });
                return;
              }
              const ue = K.closest("[x-flow-node]")?.dataset.flowNodeId, fe = K.dataset.flowHandleId ?? "target";
              if (!ue) {
                k._emit("connect-end", { connection: null, ...ae });
                return;
              }
              const ie = { source: R.id, sourceHandle: D, target: ue, targetHandle: fe }, le = await qr({ connection: ie, canvas: k, containerEl: L });
              k._emit("connect-end", {
                connection: le.applied ? ie : null,
                ...ae
              });
            };
            document.addEventListener("pointermove", Q), document.addEventListener("pointerup", U);
          };
          e.addEventListener("pointerdown", w, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", w, { capture: !0 });
          });
        }
      }
      const A = (S) => {
        if (S.key !== "Enter" && S.key !== " ") return;
        S.preventDefault();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        w && (w._animationLocked || Go(v) && (w._emit("node-click", { node: v, event: S }), S.stopPropagation(), gt(S, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1) : (w.selectedNodes.add(v.id), v.selected = !0) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0), w._emitSelectionChange()));
      };
      e.addEventListener("keydown", A);
      const $ = () => {
        const S = t.$data(e.closest("[x-data]"));
        if (!S?._config?.autoPanOnNodeFocus) return;
        const v = o(n);
        if (!v) return;
        const w = v.parentId ? S.getAbsolutePosition(v.id) : v.position;
        S.setCenter(
          w.x + (v.dimensions?.width ?? 150) / 2,
          w.y + (v.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", $);
      const C = (S) => {
        if (a) return;
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w && !w._animationLocked && (w._emit("node-click", { node: v, event: S }), !!Go(v))) {
          if (S.stopPropagation(), c) {
            c = !1;
            return;
          }
          gt(S, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${v.id}" deselected (shift)`)) : (w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${v.id}" selected (shift)`)) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${v.id}" selected`)), w._emitSelectionChange();
        }
      };
      e.addEventListener("click", C);
      const T = (S) => {
        S.preventDefault(), S.stopPropagation();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w)
          if (w.selectedNodes.size > 1 && w.selectedNodes.has(v.id)) {
            const I = w.nodes.filter((k) => w.selectedNodes.has(k.id));
            w._emit("selection-context-menu", { nodes: I, event: S });
          } else
            w._emit("node-context-menu", { node: v, event: S });
      };
      e.addEventListener("contextmenu", T), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const S = o(n);
        if (!S) return;
        const v = t.$data(e.closest("[x-data]"));
        S.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${S.id}" measured`, S.dimensions), v?._nodeElements?.set(S.id, e), S.resizeObserver !== !1 && v?._resizeObserver && v._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", A), e.removeEventListener("focus", $), e.removeEventListener("click", C), e.removeEventListener("contextmenu", T);
        const S = e.dataset.flowNodeId;
        if (S) {
          const v = t.$data(e.closest("[x-data]"));
          v?._nodeElements?.delete(S), v?._resizeObserver?.unobserve(e), v?._draggingNodeIds?.delete(S);
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
function sp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let g = o.width;
  u ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  h ? p = o.height + e.y : f && (p = o.height - e.y), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)));
  const y = g - o.width, m = p - o.height, _ = d ? n.x - y : n.x, E = f ? n.y - m : n.y;
  return {
    position: { x: _, y: E },
    dimensions: { width: g, height: p }
  };
}
const pa = ["top-left", "top-right", "bottom-left", "bottom-right"], ma = ["top", "right", "bottom", "left"], rp = [...pa, ...ma], ap = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function lp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = cp(o);
      let l = { ...Tt };
      if (n)
        try {
          const d = i(n);
          l = { ...Tt, ...d };
        } catch {
        }
      const c = [];
      for (const d of a) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = ap[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
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
          const _ = { ...l };
          if (m.minDimensions?.width != null && l.minWidth === Tt.minWidth && (_.minWidth = m.minDimensions.width), m.minDimensions?.height != null && l.minHeight === Tt.minHeight && (_.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && l.maxWidth === Tt.maxWidth && (_.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && l.maxHeight === Tt.maxHeight && (_.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const C = p.viewport?.zoom || 1, T = h.getBoundingClientRect();
            m.dimensions = { width: T.width / C, height: T.height / C };
          }
          const E = { x: m.position.x, y: m.position.y }, b = { width: m.dimensions.width, height: m.dimensions.height }, x = p.viewport?.zoom || 1, M = f.clientX, P = f.clientY;
          p._captureHistory?.(), B("resize", `Resize start on "${y}" (${d})`, b), p._emit("node-resize-start", { node: m, dimensions: { ...b } });
          const A = (C) => {
            const T = {
              x: (C.clientX - M) / x,
              y: (C.clientY - P) / x
            }, S = sp(
              d,
              T,
              E,
              b,
              _,
              p._config?.snapToGrid ?? !1
            );
            if (m.position.x = S.position.x, m.position.y = S.position.y, m.dimensions.width = S.dimensions.width, m.dimensions.height = S.dimensions.height, m.parentId) {
              const v = p.getAbsolutePosition(m.id);
              h.style.left = `${v.x}px`, h.style.top = `${v.y}px`;
            } else
              h.style.left = `${S.position.x}px`, h.style.top = `${S.position.y}px`;
            h.style.width = `${S.dimensions.width}px`, h.style.height = `${S.dimensions.height}px`, p._layoutAnimTick++, p._emit("node-resize", { node: m, dimensions: { ...S.dimensions } });
          }, $ = () => {
            document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", $), document.removeEventListener("pointercancel", $), B("resize", `Resize end on "${y}"`, m.dimensions), p._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", A), document.addEventListener("pointerup", $), document.addEventListener("pointercancel", $);
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
function cp(t) {
  if (t.includes("corners"))
    return pa;
  if (t.includes("edges"))
    return ma;
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
  return rp;
}
function dp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function up(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function fp(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("snap"), l = a && n && Number(i(n)) || 15;
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
        const y = u.getBoundingClientRect(), m = y.left + y.width / 2, _ = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const E = (x) => {
          let M = dp(
            x.clientX,
            x.clientY,
            m,
            _
          );
          a && (M = up(M, l)), p.rotation = M;
        }, b = () => {
          document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", b), e.style.cursor = "grab", h._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", E), document.addEventListener("pointerup", b);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function hp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const gp = "application/alpineflow";
function pp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(gp, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function mp(t) {
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
function yp(t) {
  t.directive(
    "flow-viewport",
    (e, {}, { effect: n, cleanup: o }) => {
      e.classList.add("flow-viewport");
      const i = t.$data(e.closest("[x-data]"));
      if (!i?.edges) return;
      typeof i._registerViewportEl == "function" ? i._registerViewportEl(e) : i._viewportEl = e;
      const r = i.viewport;
      r && (e.style.transform = `translate(${r.x}px, ${r.y}px) scale(${r.zoom})`);
      const s = document.createElement("div");
      s.classList.add("flow-edges"), e.insertBefore(s, e.firstChild);
      const a = /* @__PURE__ */ new Map();
      n(() => {
        const l = i.edges, c = new Set(l.map((p) => p.id));
        for (const [p, y] of a)
          c.has(p) || (t.destroyTree(y), y.remove(), a.delete(p), i._edgeSvgElements?.delete(p));
        for (const p of l) {
          if (a.has(p.id)) continue;
          const y = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          y.setAttribute("class", "flow-edge-svg");
          const m = document.createElementNS("http://www.w3.org/2000/svg", "g");
          y.appendChild(m), t.addScopeToNode(m, { edge: p }), m.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(y);
          }), a.set(p.id, y), i._edgeSvgElements?.set(p.id, y), t.initTree(m);
        }
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
        if (f) {
          const p = mp(
            l
          );
          for (const y of p)
            h.add(y.primaryId), g.add(y.mirrorId);
        }
        for (const p of l) {
          const y = h.has(p.id), m = g.has(p.id);
          !!p._renderDualMarker !== y && (p._renderDualMarker = y ? !0 : void 0), !!p._hiddenByCollapse !== m && (p._hiddenByCollapse = m ? !0 : void 0);
        }
        for (const p of l) {
          const y = a.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), _ = i.getNode?.(p.target), E = p.hidden || p._hiddenByCollapse || m?.hidden || _?.hidden;
          y.style.display = E ? "none" : "";
        }
        for (const p of l) {
          const y = a.get(p.id);
          if (!y) continue;
          const m = i.getNode?.(p.source), _ = i.getNode?.(p.target);
          m?.filtered || _?.filtered ? y.classList.add("flow-edge-filtered") : y.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [l, c] of a)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(l);
        a.clear(), s.remove();
      });
    }
  );
}
const wp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], vp = "a, button, input, textarea, select, [contenteditable]", _p = 100, bp = 60, xp = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), Ep = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), Cp = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), Sp = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function kp(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && wp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function At(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function Lp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function Pp(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (xp.has(e) && (t.style.top = "0"), Ep.has(e) && (t.style.bottom = "0")), o && !n && (Cp.has(e) && (t.style.left = "0"), Sp.has(e) && (t.style.right = "0"));
}
function Mp(t) {
  t.directive(
    "flow-panel",
    (e, { value: n, modifiers: o }, { cleanup: i }) => {
      const {
        position: r,
        isStatic: s,
        isFixed: a,
        noResize: l,
        constrained: c,
        fillWidth: d,
        fillHeight: u
      } = kp(n, o), f = d || u, h = !s && !a && !f, g = !s && !l && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || f) && e.classList.add("flow-panel-locked"), (l || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && Pp(e, r, d, u);
      const p = (x) => x.stopPropagation();
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
      }, _ = `flow-panel-${r}`, E = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(_) || e.classList.add(_);
      };
      y.addEventListener("flow-panel-reset", E), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let b = null;
      if (h) {
        let x = !1, M = 0, P = 0, A = 0, $ = 0;
        const C = () => {
          const w = e.getBoundingClientRect(), I = y.getBoundingClientRect();
          return {
            x: w.left - I.left,
            y: w.top - I.top
          };
        }, T = (w) => {
          if (!x) return;
          let I = A + (w.clientX - M), k = $ + (w.clientY - P);
          if (c) {
            const R = Lp(
              I,
              k,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            I = R.left, k = R.top;
          }
          e.style.left = `${I}px`, e.style.top = `${k}px`, At(y, "panel-drag", {
            panel: e,
            position: { x: I, y: k }
          });
        }, S = () => {
          if (!x) return;
          x = !1, document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", S), document.removeEventListener("pointercancel", S);
          const w = C();
          At(y, "panel-drag-end", {
            panel: e,
            position: w
          });
        }, v = (w) => {
          const I = w.target;
          if (I.closest(vp) || I.closest(".flow-panel-resize-handle"))
            return;
          x = !0, M = w.clientX, P = w.clientY;
          const k = e.getBoundingClientRect(), R = y.getBoundingClientRect();
          A = k.left - R.left, $ = k.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${A}px`, e.style.top = `${$}px`, document.addEventListener("pointermove", T), document.addEventListener("pointerup", S), document.addEventListener("pointercancel", S), At(y, "panel-drag-start", {
            panel: e,
            position: { x: A, y: $ }
          });
        };
        if (e.addEventListener("pointerdown", v), g) {
          b = document.createElement("div"), b.classList.add("flow-panel-resize-handle"), e.appendChild(b);
          let w = !1, I = 0, k = 0, R = 0, O = 0;
          const Y = (N) => {
            if (!w) return;
            const F = Math.max(_p, R + (N.clientX - I)), J = Math.max(bp, O + (N.clientY - k));
            e.style.width = `${F}px`, e.style.height = `${J}px`, At(y, "panel-resize", {
              panel: e,
              dimensions: { width: F, height: J }
            });
          }, D = () => {
            w && (w = !1, document.removeEventListener("pointermove", Y), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), At(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, L = (N) => {
            N.stopPropagation(), w = !0, I = N.clientX, k = N.clientY, R = e.offsetWidth, O = e.offsetHeight, document.addEventListener("pointermove", Y), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), At(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: O }
            });
          };
          b.addEventListener("pointerdown", L), i(() => {
            e.removeEventListener("pointerdown", v), b?.removeEventListener("pointerdown", L), document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", S), document.removeEventListener("pointercancel", S), document.removeEventListener("pointermove", Y), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), b?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", E), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", S), document.removeEventListener("pointercancel", S), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", E), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), y.removeEventListener("flow-panel-reset", E), y.__flowPanels?.delete(e);
        });
    }
  );
}
function Tp(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = Ap(n), a = Np(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const l = (d) => {
        d.stopPropagation();
      }, c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("pointerdown", l), e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = f.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, y = p ? f.getNode(p) : null, m = y?.dimensions?.width ?? d.offsetWidth, _ = y?.dimensions?.height ?? d.offsetHeight, E = g / h;
        let b, x, M, P;
        s === "top" || s === "bottom" ? (x = s === "top" ? -E : _ + E, P = s === "top" ? "-100%" : "0%", a === "start" ? (b = 0, M = "0%") : a === "end" ? (b = m, M = "-100%") : (b = m / 2, M = "-50%")) : (b = s === "left" ? -E : m + E, M = s === "left" ? "-100%" : "0%", a === "start" ? (x = 0, P = "0%") : a === "end" ? (x = _, P = "-100%") : (x = _ / 2, P = "-50%")), e.style.left = `${b}px`, e.style.top = `${x}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${M}, ${P})`;
      }), r(() => {
        e.removeEventListener("pointerdown", l), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function Ap(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Np(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Ip(t) {
  t.directive(
    "flow-context-menu",
    (e, { modifiers: n, expression: o }, { effect: i, evaluate: r, cleanup: s }) => {
      const a = n[0];
      if (!a) {
        console.warn("[AlpineFlow] x-flow-context-menu requires a type modifier: .node, .edge, .pane, or .selection");
        return;
      }
      const l = e, c = l.closest("[x-data]");
      if (!c) return;
      const d = t.$data(c);
      let u = 0, f = 0;
      if (o) {
        const M = r(o);
        u = M?.offsetX ?? 0, f = M?.offsetY ?? 0;
      }
      l.setAttribute("role", "menu"), l.setAttribute("tabindex", "-1"), l.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let g = null;
      const p = 4, y = () => {
        g = document.activeElement;
        const M = d.contextMenu.x + u, P = d.contextMenu.y + f;
        l.style.display = "", l.style.position = "fixed", l.style.left = M + "px", l.style.top = P + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((v) => {
          v.setAttribute("role", "menuitem"), v.hasAttribute("tabindex") || v.setAttribute("tabindex", "-1");
        });
        const A = l.getBoundingClientRect(), $ = window.innerWidth, C = window.innerHeight;
        let T = M, S = P;
        A.right > $ - p && (T = $ - A.width - p), A.bottom > C - p && (S = C - A.height - p), T < p && (T = p), S < p && (S = p), l.style.left = T + "px", l.style.top = S + "px", h.style.display = "", l.focus({ preventScroll: !0 });
      }, m = () => {
        l.style.display = "none", h.style.display = "none", g && document.contains(g) && (g.focus({ preventScroll: !0 }), g = null);
      };
      i(() => {
        const M = d.contextMenu;
        M.show && M.type === a ? y() : m();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (M) => {
        M.preventDefault(), d.closeContextMenu();
      });
      const _ = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", _, !0);
      const E = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), b = (M) => Array.from(M.querySelectorAll(
        "button:not([disabled])"
      )), x = (M) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const P = document.activeElement, A = P?.closest(".flow-context-submenu"), $ = A ? b(A) : E();
        if ($.length === 0) return;
        const C = $.indexOf(P);
        switch (M.key) {
          case "ArrowDown": {
            M.preventDefault();
            const T = C < $.length - 1 ? C + 1 : 0;
            $[T].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            M.preventDefault();
            const T = C > 0 ? C - 1 : $.length - 1;
            $[T].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (M.preventDefault(), M.shiftKey) {
              const T = C > 0 ? C - 1 : $.length - 1;
              $[T].focus({ preventScroll: !0 });
            } else {
              const T = C < $.length - 1 ? C + 1 : 0;
              $[T].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            M.preventDefault(), P?.click();
            break;
          }
          case "ArrowRight": {
            if (!A) {
              const T = P?.querySelector(".flow-context-submenu");
              T && (M.preventDefault(), T.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            A && (M.preventDefault(), A.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      l.addEventListener("keydown", x), s(() => {
        h.remove(), window.removeEventListener("scroll", _, !0), l.removeEventListener("keydown", x);
      });
    }
  );
}
const $p = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Dp(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), u = l.has("queue"), f = n || "";
      let h = "click";
      l.has("mouseenter") ? h = "mouseenter" : l.has("click") && (h = "click");
      let g = null, p = [], y = !1, m = !1, _ = !1;
      function E() {
        const T = r(i);
        return Array.isArray(T) ? T : T && typeof T == "object" ? [T] : [];
      }
      function b() {
        const T = e.closest("[x-data]");
        return T ? t.$data(T) : null;
      }
      function x(T, S = !1) {
        const v = b();
        if (!v?.timeline) return Promise.resolve();
        const w = v.timeline();
        if (S) {
          for (let I = T.length - 1; I >= 0; I--)
            w.step(T[I]);
          w.reverse();
        } else
          for (const I of T)
            I.parallel ? w.parallel(I.parallel) : w.step(I);
        return g = w, w.play().then(() => {
          g === w && (g = null);
        });
      }
      function M(T = !1) {
        if (c && m) return;
        m = !0;
        const S = E();
        if (S.length === 0) return;
        const v = () => x(S, T);
        u ? (p.push(v), P()) : (g?.stop(), g = null, p = [], y = !1, v());
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
          const T = E(), S = b();
          S?.registerAnimation && S.registerAnimation(f, T);
        }), a(() => {
          const T = b();
          T?.unregisterAnimation && T.unregisterAnimation(f);
        });
        return;
      }
      const A = () => {
        d && h === "click" ? (M(_), _ = !_) : M(!1);
      };
      e.addEventListener(h, A);
      let $ = null, C = null;
      d && h !== "click" && (C = $p[h] ?? null, C && ($ = () => M(!0), e.addEventListener(C, $))), a(() => {
        g?.stop(), e.removeEventListener(h, A), C && $ && e.removeEventListener(C, $);
      });
    }
  );
}
function Hp(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? ve, l = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + a) * n.zoom + n.x, f = (s + l) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function Rp(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !Hp(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function Fp(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, a = null, l = [], c = !1, d = "idle", u = 0;
      function f() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const _ = f();
        if (!_?.timeline) return Promise.resolve();
        const E = _.timeline(), b = m.speed ?? 1, x = m.autoFitView === !0, M = m.fitViewPadding ?? 0.1, P = _.viewport, A = _.getContainerDimensions?.();
        for (const $ of y) {
          const C = b !== 1 ? {
            ...$,
            duration: $.duration !== void 0 ? $.duration / b : void 0,
            delay: $.delay !== void 0 ? $.delay / b : void 0
          } : $;
          if (C.parallel) {
            const T = C.parallel.map(
              (S) => b !== 1 ? {
                ...S,
                duration: S.duration !== void 0 ? S.duration / b : void 0,
                delay: S.delay !== void 0 ? S.delay / b : void 0
              } : S
            );
            E.parallel(T);
          } else if (x && P && A && Rp(C, _, P, A.width, A.height)) {
            const T = {
              fitView: !0,
              fitViewPadding: M,
              duration: C.duration,
              easing: C.easing
            };
            E.parallel([C, T]);
          } else
            E.step(C);
        }
        if (m.lock && E.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const $ = m.loop === !0 ? 0 : m.loop;
          E.loop($);
        }
        return m.respectReducedMotion !== void 0 && E.respectReducedMotion(m.respectReducedMotion), a = E, d = "playing", c = !0, E.play().then(() => {
          a === E && (a = null, d = "idle", c = !1);
        });
      }
      async function g(y) {
        if (l.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          a?.stop(), a = null, c = !1, d = "idle";
          const _ = [l[l.length - 1]];
          s += l.length, l = [], await h(_, y);
        } else {
          const _ = [...l];
          s += _.length, l = [], c && await new Promise((b) => {
            a ? (a.on("complete", () => b()), a.on("stop", () => b())) : b();
          }), await h(_, y);
        }
      }
      const p = {
        async play() {
          const y = o(n), m = y.steps ?? [];
          s < m.length && (l = m.slice(s), await g(y));
        },
        stop() {
          a?.stop(), a = null, c = !1, d = "stopped", l = [];
        },
        reset(y) {
          if (a?.stop(), a = null, c = !1, d = "idle", s = 0, l = [], u = 0, y) {
            const m = o(n), _ = m.steps ?? [];
            if (_.length > 0)
              return l = [..._], g(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, _ = y.autoplay !== !1;
        if (m.length > u) {
          const E = m.slice(Math.max(s, u));
          u = m.length, E.length > 0 && _ && (l.push(...E), g(y));
        } else
          u = m.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function Op(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("all"), l = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = e.closest("[data-flow-canvas]");
        if (!f) return;
        const h = t.$data(f);
        if (!h) return;
        if (a) {
          for (const p of h.nodes)
            l ? h.expandNode?.(p.id, { animate: !d }) : h.collapseNode?.(p.id, { animate: !d });
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        if (c && n) {
          const p = i(n);
          if (!p) return;
          for (const y of h.nodes)
            y.parentId === p && (l ? h.expandNode?.(y.id, { animate: !d }) : h.collapseNode?.(y.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        const g = i(n);
        !g || !h?.toggleNode || h.toggleNode(g, { animate: !d });
      };
      e.addEventListener("click", u), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !a && !c && r(() => {
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
function zp(t) {
  t.directive(
    "flow-condense",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = () => {
        const l = i(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleCondense && d.toggleCondense(l);
      };
      e.addEventListener("click", a), e.setAttribute("data-flow-condense", ""), e.style.cursor = "pointer", r(() => {
        const l = i(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        if (!d?.isCondensed) return;
        const u = d.isCondensed(l);
        e.setAttribute("aria-expanded", String(!u));
      }), s(() => {
        e.removeEventListener("click", a);
      });
    }
  );
}
function No(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Vp(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
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
      d && u || (No(s), f.clear(), d = document.createElement("div"), d.className = "flow-schema-header", s.appendChild(d), u = document.createElement("div"), u.className = "flow-schema-body", s.appendChild(u));
    }, g = () => {
      const m = a(), _ = m?.data;
      if (!_) {
        for (const C of f.values())
          t.destroyTree(C);
        f.clear(), No(s), d = null, u = null;
        return;
      }
      h();
      const E = typeof _.label == "string" ? _.label : "", b = Array.isArray(_.fields) ? _.fields : [], x = typeof m?.id == "string" ? m.id : "";
      typeof _.kind == "string" && _.kind ? s.setAttribute("data-flow-schema-kind", _.kind) : s.removeAttribute("data-flow-schema-kind"), d.textContent !== E && (d.textContent = E);
      const M = l(), P = c(), A = /* @__PURE__ */ new Set();
      for (const C of b) {
        A.add(C.name);
        const T = f.get(C.name);
        if (T)
          p(T, C);
        else {
          const S = y(C, x, M, P);
          f.set(C.name, S), u.appendChild(S), t.initTree(S);
        }
      }
      for (const [C, T] of f)
        A.has(C) || (t.destroyTree(T), T.remove(), f.delete(C));
      let $ = u.firstChild;
      for (const C of b) {
        const T = f.get(C.name);
        T && ($ === T ? $ = $.nextSibling : u.insertBefore(T, $));
      }
    }, p = (m, _) => {
      m.dataset.flowSchemaField !== _.name && (m.dataset.flowSchemaField = _.name), m.classList.toggle("flow-schema-row--pk", _.key === "primary"), m.classList.toggle("flow-schema-row--fk", _.key === "foreign"), m.classList.toggle("flow-schema-row--required", !!_.required);
      let E = m.querySelector(".flow-schema-row-icon");
      const b = m.querySelector(".flow-schema-row-name");
      _.icon ? (E || (E = document.createElement("span"), E.className = "flow-schema-row-icon", m.insertBefore(E, b)), E.textContent !== _.icon && (E.textContent = _.icon)) : E && E.remove(), b && b.textContent !== _.name && (b.textContent = _.name);
      const x = m.querySelector(".flow-schema-row-type");
      x && x.textContent !== _.type && (x.textContent = _.type);
    }, y = (m, _, E, b) => {
      const x = document.createElement("div");
      x.className = "flow-schema-row", x.dataset.flowSchemaField = m.name, m.key === "primary" && x.classList.add("flow-schema-row--pk"), m.key === "foreign" && x.classList.add("flow-schema-row--fk"), m.required && x.classList.add("flow-schema-row--required"), _ && x.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${_}.${m.name}`)
      ), E && x.setAttribute("x-schema-reorderable", ""), b && _ && x.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${_}.${m.name}`)
      );
      const M = document.createElement("div");
      if (M.className = "flow-schema-handle flow-schema-handle--target", M.setAttribute("x-flow-handle:target.left", JSON.stringify(m.name)), x.appendChild(M), m.icon) {
        const S = document.createElement("span");
        S.className = "flow-schema-row-icon", S.textContent = m.icon, x.appendChild(S);
      }
      const P = document.createElement("span");
      P.className = "flow-schema-row-name", P.textContent = m.name, x.appendChild(P);
      const A = document.createElement("span");
      A.className = "flow-schema-row-type", A.textContent = m.type, x.appendChild(A);
      const $ = document.createElement("div");
      $.className = "flow-schema-handle flow-schema-handle--source", $.setAttribute("x-flow-handle:source.right", JSON.stringify(m.name)), x.appendChild($);
      const C = document.createElement("div");
      C.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", C.setAttribute("x-flow-handle:target.right", JSON.stringify(m.name)), x.appendChild(C);
      const T = document.createElement("div");
      return T.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", T.setAttribute("x-flow-handle:source.left", JSON.stringify(m.name)), x.appendChild(T), x;
    };
    i(() => {
      if (!s.isConnected) return;
      const m = a()?.data;
      m?.label, m?.kind;
      const _ = m?.fields;
      if (Array.isArray(_))
        for (const E of _)
          E.name, E.type, E.key, E.required, E.icon;
      g();
    }), r(() => {
      for (const m of f.values())
        t.destroyTree(m);
      f.clear(), No(s), d = null, u = null, s.classList.remove("flow-schema-node");
    });
  });
}
function Bp(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Hs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function qp(t) {
  t.directive("flow-wait", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    };
    s.classList.add("flow-wait-node"), s.setAttribute("data-flow-wait", "true");
    const l = () => {
      Hs(s);
      const d = a()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, g = document.createElement("div");
      if (g.className = "flow-wait-header", f) {
        const E = document.createElement("span");
        E.className = "flow-wait-icon", E.textContent = f, g.appendChild(E);
      }
      const p = document.createElement("span");
      p.className = "flow-wait-label", p.textContent = u, g.appendChild(p);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = Bp(h), g.appendChild(y), s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-wait-handle flow-wait-handle--target", m.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(m);
      const _ = document.createElement("div");
      _.className = "flow-wait-handle flow-wait-handle--source", _.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(_), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = a()?.data;
      c?.durationMs, c?.label, c?.icon, l();
    }), r(() => {
      Hs(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Rs = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function an(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(an).join(", ")}]` : String(t);
}
function Xp(t) {
  const { field: e, op: n, value: o } = t;
  return n in Rs ? `${e} ${Rs[n]} ${an(o)}` : n === "in" ? `${e} in ${an(o)}` : n === "notIn" ? `${e} not in ${an(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${an(o)}`;
}
function Fs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Yp(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Wp(t) {
  t.directive("flow-condition", (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
      if (n)
        try {
          return o(n);
        } catch {
          return n;
        }
    };
    s.classList.add("flow-condition-node");
    const c = () => {
      const u = a()?.data ?? {}, f = Yp(l(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Fs(s);
      const g = typeof u.label == "string" && u.label ? u.label : "Condition", p = document.createElement("div");
      p.className = "flow-condition-header", p.textContent = g, s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? y.textContent = Xp(u.condition) : typeof u.evaluate == "function" ? y.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const _ = document.createElement("div");
      _.className = "flow-condition-handle-source flow-condition-handle--true", _.setAttribute("data-flow-handle-direction", "source"), _.setAttribute("data-source-handle", "true"), _.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(_);
      const E = document.createElement("div");
      E.className = "flow-condition-handle-source flow-condition-handle--false", E.setAttribute("data-flow-handle-direction", "source"), E.setAttribute("data-source-handle", "false"), E.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(E), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = a()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Fs(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function jp(t) {
  t.directive(
    "flow-row-select",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      e.classList.add("nodrag"), e.style.cursor = "pointer", e.setAttribute("data-flow-row-select", "");
      const s = (a) => {
        a.stopPropagation();
        const l = o(n);
        if (!l) return;
        const c = e.closest("[x-data]");
        if (!c) return;
        const d = t.$data(c);
        d?.toggleRowSelect && (a.shiftKey ? d.toggleRowSelect(l) : (d.deselectAllRows(), d.selectRow(l)));
      };
      e.addEventListener("click", s), i(() => {
        const a = o(n);
        if (!a) return;
        const l = e.closest("[x-data]");
        if (!l) return;
        const c = t.$data(l);
        if (!c?.isRowSelected) return;
        const d = c.isRowSelected(a);
        e.classList.toggle("flow-row-selected", d), e.setAttribute("aria-selected", String(d));
      }), r(() => {
        e.removeEventListener("click", s);
      });
    }
  );
}
function Up(t) {
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
      const a = new Set(o.filter((u) => u === "far" || u === "medium" || u === "close"));
      if (a.size === 0) return;
      const l = e.closest("[data-flow-canvas]");
      if (!l) return;
      const c = t.$data(l);
      if (!c?._zoomLevel) return;
      const d = e.style.display;
      r(() => {
        const u = c._zoomLevel;
        a.has(u) ? e.style.display = d : e.style.display = "none";
      }), s(() => {
        e.style.display = d;
      });
    }
  );
}
const Zp = ["perf", "events", "viewport", "state", "activity"], Os = ["fps", "memory", "counts", "visible"], zs = 30;
function Gp(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Zp.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Kp(t) {
  return t.perf ? t.perf === !0 ? [...Os] : t.perf.filter((e) => Os.includes(e)) : [];
}
function Jp(t) {
  return t.events ? t.events === !0 ? zs : t.events.max ?? zs : 0;
}
function nn(t, e) {
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
function Qp(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = Gp(a, o), c = e.closest("[x-data]");
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
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(g), f.appendChild(h), e.appendChild(f);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let y = !1;
      const m = () => {
        y = !y, p.style.display = y ? "" : "none", f.title = y ? "Collapse" : "Devtools", y ? J() : oe();
      };
      f.addEventListener("click", m);
      const _ = Kp(l);
      let E = null, b = null, x = null, M = null, P = null;
      if (_.length > 0) {
        const { wrapper: X, content: W } = nn("Performance", "flow-devtools-perf");
        if (_.includes("fps")) {
          const { row: j, valueEl: H } = Ve("FPS", "flow-devtools-fps");
          E = H, W.appendChild(j);
        }
        if (_.includes("memory")) {
          const { row: j, valueEl: H } = Ve("Memory", "flow-devtools-memory");
          b = H, W.appendChild(j);
        }
        if (_.includes("counts")) {
          const j = Ve("Nodes", "flow-devtools-counts");
          x = j.valueEl, W.appendChild(j.row);
          const H = Ve("Edges", "flow-devtools-counts");
          M = H.valueEl, W.appendChild(H.row);
        }
        if (_.includes("visible")) {
          const { row: j, valueEl: H } = Ve("Visible", "flow-devtools-visible");
          P = H, W.appendChild(j);
        }
        p.appendChild(X);
      }
      const A = Jp(l);
      let $ = null;
      if (A > 0) {
        const { wrapper: X, content: W } = nn("Events", "flow-devtools-events"), j = document.createElement("button");
        j.className = "flow-devtools-clear-btn nopan", j.textContent = "Clear", j.addEventListener("click", () => {
          $ && ($.textContent = ""), G.length = 0;
        }), X.querySelector(".flow-devtools-section-title").appendChild(j), $ = document.createElement("div"), $.className = "flow-devtools-event-list", W.appendChild($), p.appendChild(X);
      }
      let C = null, T = null, S = null;
      if (l.viewport) {
        const { wrapper: X, content: W } = nn("Viewport", "flow-devtools-viewport"), j = Ve("X", "flow-devtools-vp-x");
        C = j.valueEl, W.appendChild(j.row);
        const H = Ve("Y", "flow-devtools-vp-y");
        T = H.valueEl, W.appendChild(H.row);
        const te = Ve("Zoom", "flow-devtools-vp-zoom");
        S = te.valueEl, W.appendChild(te.row), p.appendChild(X);
      }
      let v = null;
      if (l.state) {
        const { wrapper: X, content: W } = nn("Selection", "flow-devtools-state");
        v = document.createElement("div"), v.className = "flow-devtools-state-content", v.textContent = "No selection", W.appendChild(v), p.appendChild(X);
      }
      let w = null, I = null, k = null, R = null;
      if (l.activity) {
        const { wrapper: X, content: W } = nn("Activity", "flow-devtools-activity"), j = Ve("Animations", "flow-devtools-anim");
        w = j.valueEl, W.appendChild(j.row);
        const H = Ve("Particles", "flow-devtools-particles");
        I = H.valueEl, W.appendChild(H.row);
        const te = Ve("Follow", "flow-devtools-follow");
        k = te.valueEl, W.appendChild(te.row);
        const Q = Ve("Timelines", "flow-devtools-timelines");
        R = Q.valueEl, W.appendChild(Q.row), p.appendChild(X);
      }
      let O = null, Y = !1, D = 0, L = performance.now();
      const N = !!(E || b), F = () => {
        if (!Y) return;
        D++;
        const X = performance.now();
        X - L >= 1e3 && (E && (E.textContent = String(Math.round(D * 1e3 / (X - L)))), D = 0, L = X, b && performance.memory && (b.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), O = requestAnimationFrame(F);
      }, J = () => {
        !N || Y || (Y = !0, D = 0, L = performance.now(), O = requestAnimationFrame(F));
      }, oe = () => {
        Y = !1, O !== null && (cancelAnimationFrame(O), O = null);
      }, G = [], q = [
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
      if (A > 0 && $) {
        z = (X) => {
          if (!y) return;
          const W = X, j = W.type.replace("flow-", "");
          let H = "";
          try {
            H = W.detail ? JSON.stringify(W.detail).slice(0, 80) : "";
          } catch {
            H = "[circular]";
          }
          G.unshift({ name: j, time: Date.now(), detail: H });
          const te = $, Q = document.createElement("div");
          Q.className = "flow-devtools-event-entry";
          const U = document.createElement("span");
          U.className = "flow-devtools-event-name", U.textContent = j;
          const Z = document.createElement("span");
          Z.className = "flow-devtools-event-age", Z.textContent = "now";
          const se = document.createElement("span");
          for (se.className = "flow-devtools-event-detail", se.textContent = H, Q.appendChild(U), Q.appendChild(Z), Q.appendChild(se), te.prepend(Q); te.children.length > A; )
            te.removeChild(te.lastChild), G.pop();
        };
        for (const X of q)
          d.addEventListener(X, z);
      }
      r(() => {
        const X = t.$data(c);
        !X || !X.viewport || (C && (C.textContent = Math.round(X.viewport.x).toString()), T && (T.textContent = Math.round(X.viewport.y).toString()), S && (S.textContent = X.viewport.zoom.toFixed(2)));
      }), r(() => {
        const X = t.$data(c);
        if (X) {
          if (x && (x.textContent = String(X.nodes?.length ?? 0)), M && (M.textContent = String(X.edges?.length ?? 0)), P && X._getVisibleNodeIds && (P.textContent = String(X._getVisibleNodeIds().size)), v) {
            const W = X.selectedNodes, j = X.selectedEdges;
            if (!((W?.size ?? 0) > 0 || (j?.size ?? 0) > 0))
              v.textContent = "No selection";
            else {
              if (v.textContent = "", W && W.size > 0)
                for (const te of W) {
                  const Q = X.getNode?.(te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, position: Q.position, data: Q.data }, null, 2), v.appendChild(U);
                }
              if (j && j.size > 0)
                for (const te of j) {
                  const Q = X.edges?.find((Z) => Z.id === te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, source: Q.source, target: Q.target, type: Q.type }, null, 2), v.appendChild(U);
                }
            }
          }
          if (w) {
            const W = X._animator?._groups?.size ?? 0;
            w.textContent = String(W);
          }
          I && (I.textContent = String(X._activeParticles?.size ?? 0)), k && (k.textContent = X._followHandle ? "Active" : "Idle"), R && (R.textContent = String(X._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (oe(), f.removeEventListener("click", m), z)
          for (const X of q)
            d.removeEventListener(X, z);
        e.removeEventListener("wheel", u), e.textContent = "", E = null, b = null, x = null, M = null, P = null, $ = null, C = null, T = null, S = null, v = null, w = null, I = null, k = null, R = null;
      });
    }
  );
}
const em = {
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
function tm(t) {
  return em[t] ?? null;
}
function nm(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = tm(n);
      if (!l)
        return;
      const c = e.closest("[data-flow-canvas]");
      if (!c)
        return;
      const d = t.$data(c);
      if (!d)
        return;
      const u = () => {
        const f = d[l.method];
        typeof f == "function" && (l.passExpression && o ? f.call(d, i(o)) : f.call(d));
      };
      e.addEventListener("click", u), (l.disabledWhen || l.aria) && r(() => {
        if (l.disabledWhen) {
          const f = l.disabledWhen(d);
          e.disabled = f, l.aria === "disabled" && e.setAttribute("aria-disabled", String(f));
        }
        l.aria === "pressed" && e.setAttribute("aria-pressed", String(!d.isInteractive));
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function om(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Io = /* @__PURE__ */ new WeakMap();
function im(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = om(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), Io.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (l.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Io.set(c, u);
        else if (l.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const h = Io.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), a(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function sm(t) {
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
function rm(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("toggle"), l = e.closest("[data-flow-canvas]");
      if (!l) return;
      const c = t.$data(l);
      if (!c?.follow) return;
      let d = null;
      const u = (h) => {
        e.classList.toggle("flow-following", h), e.setAttribute("aria-pressed", String(h));
      }, f = () => {
        if (!n) return;
        const h = i(n), g = sm(h);
        if (!g) return;
        if (a && d) {
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
function am(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const ki = /* @__PURE__ */ new Map();
function lm(t, e) {
  ki.set(t, e);
}
function cm(t) {
  return ki.get(t) ?? null;
}
function dm(t) {
  return ki.has(t);
}
function $o(t) {
  return `alpineflow-snapshot-${t}`;
}
function um(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = am(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = () => {
        if (!o) return;
        const f = r(o);
        if (f)
          if (l.action === "save") {
            const h = d.toObject();
            l.persist ? localStorage.setItem($o(f), JSON.stringify(h)) : lm(f, h);
          } else {
            let h = null;
            if (l.persist) {
              const g = localStorage.getItem($o(f));
              if (g)
                try {
                  h = JSON.parse(g);
                } catch {
                }
            } else
              h = cm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), l.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        l.persist ? h = localStorage.getItem($o(f)) !== null : (d.nodes.length, h = dm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function fm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function hm(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(fm(s._loadingText));
      const l = n.includes("fade");
      l && e.classList.add("flow-loading-fade"), r.setAttribute("data-flow-loading-directive", "");
      let c = null;
      o(() => {
        if (s.isLoading)
          e.style.display = "flex", l && (e.classList.remove("flow-loading-fade-out"), c && (e.removeEventListener("transitionend", c), c = null));
        else if (l) {
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
function gm(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = e.closest("[data-flow-edge-id]");
      if (!a) return;
      const l = a.dataset.flowEdgeId, c = e.closest("[data-flow-canvas]");
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
        if (!d.edges.some(($) => $.id === l)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let _ = 0.5;
        if (n) {
          const $ = i(n);
          typeof $ == "number" && (_ = $);
        }
        const E = a.querySelectorAll("path"), b = E.length > 1 ? E[1] : E[0];
        if (!b) return;
        const x = b.getTotalLength?.();
        if (!x) return;
        const M = b.getPointAtLength(x * Math.max(0, Math.min(1, _))), P = m / y, A = g ? P : -P;
        e.style.left = `${M.x}px`, e.style.top = `${M.y + A}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function pm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function mm(t) {
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
function Sy(t, e, n) {
  const o = n?.defaultDimensions?.width ?? ve, i = n?.defaultDimensions?.height ?? _e, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", l = t.filter((m) => !m.hidden).map((m) => ({
    ...m,
    dimensions: {
      width: m.dimensions?.width ?? o,
      height: m.dimensions?.height ?? i
    }
  })), c = /* @__PURE__ */ new Map();
  for (const m of l)
    c.set(m.id, m);
  const d = l.map((m) => ({
    id: m.id,
    x: m.position.x,
    y: m.position.y,
    width: m.dimensions.width,
    height: m.dimensions.height,
    ...m.class ? { class: m.class } : {},
    ...m.style ? {
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([_, E]) => `${_}:${E}`).join(";")
    } : {},
    data: m.data ?? {}
  })), u = e.filter((m) => !m.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const m of u) {
    const _ = c.get(m.source), E = c.get(m.target);
    if (!_ || !E)
      continue;
    let b, x;
    try {
      const C = io(
        m,
        _,
        E,
        _.sourcePosition ?? "bottom",
        E.targetPosition ?? "top"
      );
      b = C.path, x = C.labelPosition;
    } catch {
      continue;
    }
    let M, P;
    if (m.markerStart) {
      const C = Ft(m.markerStart), T = Ot(C, s);
      h.has(T) || h.set(T, Qn(C, T)), M = `url(#${T})`;
    }
    if (m.markerEnd) {
      const C = Ft(m.markerEnd), T = Ot(C, s);
      h.has(T) || h.set(T, Qn(C, T)), P = `url(#${T})`;
    }
    let A, $;
    if (m.label)
      if (x)
        A = x.x, $ = x.y;
      else {
        const C = _.position.x + _.dimensions.width / 2, T = _.position.y + _.dimensions.height / 2, S = E.position.x + E.dimensions.width / 2, v = E.position.y + E.dimensions.height / 2;
        A = (C + S) / 2, $ = (T + v) / 2;
      }
    f.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: b,
      ...M ? { markerStart: M } : {},
      ...P ? { markerEnd: P } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...A !== void 0 ? { labelX: A } : {},
      ...$ !== void 0 ? { labelY: $ } : {}
    });
  }
  const g = Array.from(h.values()).join(`
`);
  let p, y;
  if (l.length === 0)
    p = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = qt(l);
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
const Vs = /* @__PURE__ */ new WeakSet();
function ky(t) {
  Vs.has(t) || (Vs.add(t), La(t), mm(t), jg(t), ip(t), If(t), xf(t), Ef(t), Cf(t), Vg(t), lp(t), fp(t), hp(t), pp(t), yp(t), Mp(t), Tp(t), Ip(t), Dp(t), Fp(t), Op(t), zp(t), jp(t), Up(t), Qp(t), nm(t), im(t), rm(t), um(t), hm(t), gm(t), Vp(t), qp(t), Wp(t), pm(t));
}
function ym(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function wm(t, e, n, o) {
  return new Promise((i, r) => {
    const s = new Image();
    s.onload = () => {
      const a = document.createElement("canvas");
      a.width = e, a.height = n;
      const l = a.getContext("2d");
      l.fillStyle = o, l.fillRect(0, 0, e, n), l.drawImage(s, 0, 0), i(a.toDataURL("image/png"));
    }, s.onerror = () => {
      r(new Error("Failed to render SVG to image"));
    }, s.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function vm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => my));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, g = t.style.width, p = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const C = t.querySelectorAll("[data-flow-culled]");
      for (const I of C)
        I.style.display = "", m.push(I);
      const T = n.filter((I) => !I.hidden), S = qt(T), v = i.padding ?? 0.1, w = Zn(
        S,
        l,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        v
      );
      e.style.transform = `translate(${w.x}px, ${w.y}px) scale(${w.zoom})`, e.style.width = `${l}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${l}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((C) => requestAnimationFrame(C));
    const _ = i.includeOverlays, E = _ === !0, b = typeof _ == "object" ? _ : {}, x = [
      ["canvas-overlay", E || (b.toolbar ?? !1)],
      ["flow-minimap", E || (b.minimap ?? !1)],
      ["flow-controls", E || (b.controls ?? !1)],
      ["flow-panel", E || (b.panels ?? !1)],
      ["flow-selection-box", !1]
    ], M = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: (C) => {
        if (C.classList) {
          for (const [T, S] of x)
            if (C.classList.contains(T) && !S) return !1;
        }
        return !0;
      }
    }), A = ym(decodeURIComponent(M.substring("data:image/svg+xml;charset=utf-8,".length))), $ = await wm(A, l, c, d);
    if (i.filename) {
      const C = document.createElement("a");
      C.download = i.filename, C.href = $, C.click();
    }
    return $;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = g, t.style.height = p, t.style.overflow = y;
    for (const _ of m)
      _.style.display = "none";
  }
}
const _m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: vm
}, Symbol.toStringTag, { value: "Module" }));
function bm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const xm = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function mt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Nt = null;
function ya(t = {}) {
  return Nt || (t.includeStyleProperties ? (Nt = t.includeStyleProperties, Nt) : (Nt = mt(window.getComputedStyle(document.documentElement)), Nt));
}
function ao(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function Em(t) {
  const e = ao(t, "border-left-width"), n = ao(t, "border-right-width");
  return t.clientWidth + e + n;
}
function Cm(t) {
  const e = ao(t, "border-top-width"), n = ao(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Li(t, e = {}) {
  const n = e.width || Em(t), o = e.height || Cm(t);
  return { width: n, height: o };
}
function Sm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const $e = 16384;
function km(t) {
  (t.width > $e || t.height > $e) && (t.width > $e && t.height > $e ? t.width > t.height ? (t.height *= $e / t.width, t.width = $e) : (t.width *= $e / t.height, t.height = $e) : t.width > $e ? (t.height *= $e / t.width, t.width = $e) : (t.width *= $e / t.height, t.height = $e));
}
function Lm(t, e = {}) {
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
function lo(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function Pm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Mm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), Pm(i);
}
const Ie = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ie(n, e);
};
function Tm(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function Am(t, e) {
  return ya(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function Nm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? Tm(n) : Am(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Bs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = xm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(Nm(s, n, i, o)), e.appendChild(a);
}
function Im(t, e, n) {
  Bs(t, e, ":before", n), Bs(t, e, ":after", n);
}
const qs = "application/font-woff", Xs = "image/jpeg", $m = {
  woff: qs,
  woff2: qs,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Xs,
  jpeg: Xs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Dm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Pi(t) {
  const e = Dm(t).toLowerCase();
  return $m[e] || "";
}
function Hm(t) {
  return t.split(/,/)[1];
}
function si(t) {
  return t.search(/^(data:)/) !== -1;
}
function Rm(t, e) {
  return `data:${e};base64,${t}`;
}
async function wa(t, e, n) {
  const o = await fetch(t, e);
  if (o.status === 404)
    throw new Error(`Resource "${o.url}" not found`);
  const i = await o.blob();
  return new Promise((r, s) => {
    const a = new FileReader();
    a.onerror = s, a.onloadend = () => {
      try {
        r(n({ res: o, result: a.result }));
      } catch (l) {
        s(l);
      }
    }, a.readAsDataURL(i);
  });
}
const Do = {};
function Fm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Mi(t, e, n) {
  const o = Fm(t, e, n.includeQueryParams);
  if (Do[o] != null)
    return Do[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await wa(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), Hm(a)));
    i = Rm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Do[o] = i, i;
}
async function Om(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : lo(e);
}
async function zm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return lo(a);
  }
  const n = t.poster, o = Pi(n), i = await Mi(n, o, e);
  return lo(i);
}
async function Vm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await wo(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Bm(t, e) {
  return Ie(t, HTMLCanvasElement) ? Om(t) : Ie(t, HTMLVideoElement) ? zm(t, e) : Ie(t, HTMLIFrameElement) ? Vm(t, e) : t.cloneNode(va(t));
}
const qm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", va = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Xm(t, e, n) {
  var o, i;
  if (va(e))
    return e;
  let r = [];
  return qm(t) && t.assignedNodes ? r = mt(t.assignedNodes()) : Ie(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = mt(t.contentDocument.body.childNodes) : r = mt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ie(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => wo(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function Ym(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : ya(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ie(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Wm(t, e) {
  Ie(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ie(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function jm(t, e) {
  if (Ie(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Um(t, e, n) {
  return Ie(e, Element) && (Ym(t, e, n), Im(t, e, n), Wm(t, e), jm(t, e)), e;
}
async function Zm(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await wo(c, e, !0));
    }
  }
  const i = Object.values(o);
  if (i.length) {
    const r = "http://www.w3.org/1999/xhtml", s = document.createElementNS(r, "svg");
    s.setAttribute("xmlns", r), s.style.position = "absolute", s.style.width = "0", s.style.height = "0", s.style.overflow = "hidden", s.style.display = "none";
    const a = document.createElementNS(r, "defs");
    s.appendChild(a);
    for (let l = 0; l < i.length; l++)
      a.appendChild(i[l]);
    t.appendChild(s);
  }
  return t;
}
async function wo(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Bm(o, e)).then((o) => Xm(t, o, e)).then((o) => Um(t, o, e)).then((o) => Zm(o, e));
}
const _a = /url\((['"]?)([^'"]+?)\1\)/g, Gm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Km = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Jm(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Qm(t) {
  const e = [];
  return t.replace(_a, (n, o, i) => (e.push(i), n)), e.filter((n) => !si(n));
}
async function ey(t, e, n, o, i) {
  try {
    const r = n ? bm(e, n) : e, s = Pi(e);
    let a;
    return i || (a = await Mi(r, s, o)), t.replace(Jm(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function ty(t, { preferredFontFormat: e }) {
  return e ? t.replace(Km, (n) => {
    for (; ; ) {
      const [o, , i] = Gm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function ba(t) {
  return t.search(_a) !== -1;
}
async function xa(t, e, n) {
  if (!ba(t))
    return t;
  const o = ty(t, n);
  return Qm(o).reduce((r, s) => r.then((a) => ey(a, s, e, n)), Promise.resolve(o));
}
async function It(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await xa(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function ny(t, e) {
  await It("background", t, e) || await It("background-image", t, e), await It("mask", t, e) || await It("-webkit-mask", t, e) || await It("mask-image", t, e) || await It("-webkit-mask-image", t, e);
}
async function oy(t, e) {
  const n = Ie(t, HTMLImageElement);
  if (!(n && !si(t.src)) && !(Ie(t, SVGImageElement) && !si(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Mi(o, Pi(o), e);
  await new Promise((r, s) => {
    t.onload = r, t.onerror = e.onImageErrorHandler ? (...l) => {
      try {
        r(e.onImageErrorHandler(...l));
      } catch (c) {
        s(c);
      }
    } : s;
    const a = t;
    a.decode && (a.decode = r), a.loading === "lazy" && (a.loading = "eager"), n ? (t.srcset = "", t.src = i) : t.href.baseVal = i;
  });
}
async function iy(t, e) {
  const o = mt(t.childNodes).map((i) => Ea(i, e));
  await Promise.all(o).then(() => t);
}
async function Ea(t, e) {
  Ie(t, Element) && (await ny(t, e), await oy(t, e), await iy(t, e));
}
function sy(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Ys = {};
async function Ws(t) {
  let e = Ys[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Ys[t] = e, e;
}
async function js(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), wa(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function Us(t) {
  if (t == null)
    return [];
  const e = [], n = /(\/\*[\s\S]*?\*\/)/gi;
  let o = t.replace(n, "");
  const i = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const l = i.exec(o);
    if (l === null)
      break;
    e.push(l[0]);
  }
  o = o.replace(i, "");
  const r = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, s = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", a = new RegExp(s, "gi");
  for (; ; ) {
    let l = r.exec(o);
    if (l === null) {
      if (l = a.exec(o), l === null)
        break;
      r.lastIndex = a.lastIndex;
    } else
      a.lastIndex = r.lastIndex;
    e.push(l[0]);
  }
  return e;
}
async function ry(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        mt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = Ws(l).then((d) => js(d, e)).then((d) => Us(d).forEach((u) => {
              try {
                i.insertRule(u, u.startsWith("@import") ? a += 1 : i.cssRules.length);
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
        const s = t.find((a) => a.href == null) || document.styleSheets[0];
        i.href != null && o.push(Ws(i.href).then((a) => js(a, e)).then((a) => Us(a).forEach((l) => {
          s.insertRule(l, s.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        mt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function ay(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => ba(e.style.getPropertyValue("src")));
}
async function ly(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = mt(t.ownerDocument.styleSheets), o = await ry(n, e);
  return ay(o);
}
function Ca(t) {
  return t.trim().replace(/["']/g, "");
}
function cy(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(Ca(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function Sa(t, e) {
  const n = await ly(t, e), o = cy(t);
  return (await Promise.all(n.filter((r) => o.has(Ca(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return xa(r.cssText, s, e);
  }))).join(`
`);
}
async function dy(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Sa(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function ka(t, e = {}) {
  const { width: n, height: o } = Li(t, e), i = await wo(t, e, !0);
  return await dy(i, e), await Ea(i, e), sy(i, e), await Mm(i, n, o);
}
async function Cn(t, e = {}) {
  const { width: n, height: o } = Li(t, e), i = await ka(t, e), r = await lo(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || Sm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || km(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function uy(t, e = {}) {
  const { width: n, height: o } = Li(t, e);
  return (await Cn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function fy(t, e = {}) {
  return (await Cn(t, e)).toDataURL();
}
async function hy(t, e = {}) {
  return (await Cn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function gy(t, e = {}) {
  const n = await Cn(t, e);
  return await Lm(n);
}
async function py(t, e = {}) {
  return Sa(t, e);
}
const my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: py,
  toBlob: gy,
  toCanvas: Cn,
  toJpeg: hy,
  toPixelData: uy,
  toPng: fy,
  toSvg: ka
}, Symbol.toStringTag, { value: "Module" }));
export {
  dh as ComputeEngine,
  Yu as FlowHistory,
  fs as SHORTCUT_DEFAULTS,
  _y as along,
  _f as areNodesConnected,
  Zr as buildNodeMap,
  Kr as clampToExtent,
  Co as clampToParent,
  Sy as computeRenderPlan,
  ws as computeValidationErrors,
  Gr as computeZIndex,
  ky as default,
  xy as drift,
  Jf as expandParentToFitChild,
  Jo as getAbsolutePosition,
  Mf as getAutoPanDelta,
  eo as getBezierPath,
  yf as getConnectedEdges,
  pt as getDescendantIds,
  Ts as getEdgePosition,
  da as getFloatingEdgeParams,
  wf as getIncomers,
  Ms as getNodeIntersection,
  qt as getNodesBounds,
  mf as getNodesFullyInPolygon,
  Ou as getNodesFullyInRect,
  pf as getNodesInPolygon,
  Fu as getNodesInRect,
  Zo as getOutgoers,
  yy as getSimpleBezierPath,
  Cy as getSimpleFloatingPosition,
  yn as getSmoothStepPath,
  Pf as getStepPath,
  Or as getStraightPath,
  Zn as getViewportForBounds,
  Be as isConnectable,
  Sf as isDeletable,
  Fr as isDraggable,
  ls as isResizable,
  Go as isSelectable,
  je as matchesKey,
  gt as matchesModifier,
  wy as orbit,
  by as pendulum,
  vi as pointInPolygon,
  gf as polygonIntersectsAABB,
  ef as registerMarker,
  cn as resolveChildValidation,
  $f as resolveShortcuts,
  Pt as sortNodesTopological,
  Ey as stagger,
  St as toAbsoluteNode,
  to as toAbsoluteNodes,
  ta as validateChildAdd,
  no as validateChildRemove,
  vy as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
