let Go = null;
function tl(t) {
  Go = t;
}
function Se() {
  if (!Go)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Go;
}
var nl = { value: () => {
} };
function xo() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Wn(n);
}
function Wn(t) {
  this._ = t;
}
function ol(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Wn.prototype = xo.prototype = {
  constructor: Wn,
  on: function(t, e) {
    var n = this._, o = ol(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = il(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Yi(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Yi(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new Wn(t);
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
function il(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Yi(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = nl, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Zo = "http://www.w3.org/1999/xhtml";
const Xi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Zo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Eo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Xi.hasOwnProperty(e) ? { space: Xi[e], local: t } : t;
}
function sl(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Zo && e.documentElement.namespaceURI === Zo ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function rl(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function xr(t) {
  var e = Eo(t);
  return (e.local ? rl : sl)(e);
}
function al() {
}
function wi(t) {
  return t == null ? al : function() {
    return this.querySelector(t);
  };
}
function ll(t) {
  typeof t != "function" && (t = wi(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new ze(o, this._parents);
}
function cl(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function dl() {
  return [];
}
function Er(t) {
  return t == null ? dl : function() {
    return this.querySelectorAll(t);
  };
}
function ul(t) {
  return function() {
    return cl(t.apply(this, arguments));
  };
}
function fl(t) {
  typeof t == "function" ? t = ul(t) : t = Er(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new ze(o, i);
}
function Cr(t) {
  return function() {
    return this.matches(t);
  };
}
function Sr(t) {
  return function(e) {
    return e.matches(t);
  };
}
var hl = Array.prototype.find;
function gl(t) {
  return function() {
    return hl.call(this.children, t);
  };
}
function pl() {
  return this.firstElementChild;
}
function ml(t) {
  return this.select(t == null ? pl : gl(typeof t == "function" ? t : Sr(t)));
}
var yl = Array.prototype.filter;
function wl() {
  return Array.from(this.children);
}
function _l(t) {
  return function() {
    return yl.call(this.children, t);
  };
}
function vl(t) {
  return this.selectAll(t == null ? wl : _l(typeof t == "function" ? t : Sr(t)));
}
function bl(t) {
  typeof t != "function" && (t = Cr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new ze(o, this._parents);
}
function kr(t) {
  return new Array(t.length);
}
function xl() {
  return new ze(this._enter || this._groups.map(kr), this._parents);
}
function Qn(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Qn.prototype = {
  constructor: Qn,
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
function El(t) {
  return function() {
    return t;
  };
}
function Cl(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Qn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function Sl(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (f[a] = h = s.call(l, l.__data__, a, e) + "", c.has(h) ? i[a] = l : c.set(h, l));
  for (a = 0; a < u; ++a)
    h = s.call(t, r[a], a, r) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = r[a], c.delete(h)) : n[a] = new Qn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(f[a]) === l && (i[a] = l);
}
function kl(t) {
  return t.__data__;
}
function Ll(t, e) {
  if (!arguments.length) return Array.from(this, kl);
  var n = e ? Sl : Cl, o = this._parents, i = this._groups;
  typeof t != "function" && (t = El(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = Ml(t.call(d, d && d.__data__, c, o)), p = h.length, g = a[c] = new Array(p), m = s[c] = new Array(p), y = l[c] = new Array(f);
    n(d, u, g, m, y, h, e);
    for (var b = 0, S = 0, x, k; b < p; ++b)
      if (x = g[b]) {
        for (b >= S && (S = b + 1); !(k = m[S]) && ++S < p; ) ;
        x._next = k || null;
      }
  }
  return s = new ze(s, o), s._enter = a, s._exit = l, s;
}
function Ml(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Pl() {
  return new ze(this._exit || this._groups.map(kr), this._parents);
}
function Tl(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Al(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], u = c.length, f = a[l] = new Array(u), h, p = 0; p < u; ++p)
      (h = c[p] || d[p]) && (f[p] = h);
  for (; l < i; ++l)
    a[l] = n[l];
  return new ze(a, this._parents);
}
function Nl() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function $l(t) {
  t || (t = Il);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(e);
  }
  return new ze(i, this._parents).order();
}
function Il(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Dl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Rl() {
  return Array.from(this);
}
function Hl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function Fl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function Ol() {
  return !this.node();
}
function zl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function Vl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Bl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ql(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Yl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Xl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Wl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function jl(t, e) {
  var n = Eo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? Bl : Vl : typeof e == "function" ? n.local ? Wl : Xl : n.local ? Yl : ql)(n, e));
}
function Lr(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Ul(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Gl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Zl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Kl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Ul : typeof e == "function" ? Zl : Gl)(t, e, n ?? "")) : Yt(this.node(), t);
}
function Yt(t, e) {
  return t.style.getPropertyValue(e) || Lr(t).getComputedStyle(t, null).getPropertyValue(e);
}
function Jl(t) {
  return function() {
    delete this[t];
  };
}
function Ql(t, e) {
  return function() {
    this[t] = e;
  };
}
function ec(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function tc(t, e) {
  return arguments.length > 1 ? this.each((e == null ? Jl : typeof e == "function" ? ec : Ql)(t, e)) : this.node()[t];
}
function Mr(t) {
  return t.trim().split(/^|\s+/);
}
function _i(t) {
  return t.classList || new Pr(t);
}
function Pr(t) {
  this._node = t, this._names = Mr(t.getAttribute("class") || "");
}
Pr.prototype = {
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
function Tr(t, e) {
  for (var n = _i(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function Ar(t, e) {
  for (var n = _i(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function nc(t) {
  return function() {
    Tr(this, t);
  };
}
function oc(t) {
  return function() {
    Ar(this, t);
  };
}
function ic(t, e) {
  return function() {
    (e.apply(this, arguments) ? Tr : Ar)(this, t);
  };
}
function sc(t, e) {
  var n = Mr(t + "");
  if (arguments.length < 2) {
    for (var o = _i(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? ic : e ? nc : oc)(n, e));
}
function rc() {
  this.textContent = "";
}
function ac(t) {
  return function() {
    this.textContent = t;
  };
}
function lc(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function cc(t) {
  return arguments.length ? this.each(t == null ? rc : (typeof t == "function" ? lc : ac)(t)) : this.node().textContent;
}
function dc() {
  this.innerHTML = "";
}
function uc(t) {
  return function() {
    this.innerHTML = t;
  };
}
function fc(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function hc(t) {
  return arguments.length ? this.each(t == null ? dc : (typeof t == "function" ? fc : uc)(t)) : this.node().innerHTML;
}
function gc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function pc() {
  return this.each(gc);
}
function mc() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function yc() {
  return this.each(mc);
}
function wc(t) {
  var e = typeof t == "function" ? t : xr(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function _c() {
  return null;
}
function vc(t, e) {
  var n = typeof t == "function" ? t : xr(t), o = e == null ? _c : typeof e == "function" ? e : wi(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function bc() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function xc() {
  return this.each(bc);
}
function Ec() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Cc() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Sc(t) {
  return this.select(t ? Cc : Ec);
}
function kc(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Lc(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function Mc(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function Pc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Tc(t, e, n) {
  return function() {
    var o = this.__on, i, r = Lc(e);
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
function Ac(t, e, n) {
  var o = Mc(t + ""), i, r = o.length, s;
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
  for (a = e ? Tc : Pc, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function Nr(t, e, n) {
  var o = Lr(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Nc(t, e) {
  return function() {
    return Nr(this, t, e);
  };
}
function $c(t, e) {
  return function() {
    return Nr(this, t, e.apply(this, arguments));
  };
}
function Ic(t, e) {
  return this.each((typeof e == "function" ? $c : Nc)(t, e));
}
function* Dc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var $r = [null];
function ze(t, e) {
  this._groups = t, this._parents = e;
}
function Mn() {
  return new ze([[document.documentElement]], $r);
}
function Rc() {
  return this;
}
ze.prototype = Mn.prototype = {
  constructor: ze,
  select: ll,
  selectAll: fl,
  selectChild: ml,
  selectChildren: vl,
  filter: bl,
  data: Ll,
  enter: xl,
  exit: Pl,
  join: Tl,
  merge: Al,
  selection: Rc,
  order: Nl,
  sort: $l,
  call: Dl,
  nodes: Rl,
  node: Hl,
  size: Fl,
  empty: Ol,
  each: zl,
  attr: jl,
  style: Kl,
  property: tc,
  classed: sc,
  text: cc,
  html: hc,
  raise: pc,
  lower: yc,
  append: wc,
  insert: vc,
  remove: xc,
  clone: Sc,
  datum: kc,
  on: Ac,
  dispatch: Ic,
  [Symbol.iterator]: Dc
};
function Xe(t) {
  return typeof t == "string" ? new ze([[document.querySelector(t)]], [document.documentElement]) : new ze([[t]], $r);
}
function Hc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function nt(t, e) {
  if (t = Hc(t), e === void 0 && (e = t.currentTarget), e) {
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
const Fc = { passive: !1 }, wn = { capture: !0, passive: !1 };
function No(t) {
  t.stopImmediatePropagation();
}
function zt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Ir(t) {
  var e = t.document.documentElement, n = Xe(t).on("dragstart.drag", zt, wn);
  "onselectstart" in e ? n.on("selectstart.drag", zt, wn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Dr(t, e) {
  var n = t.document.documentElement, o = Xe(t).on("dragstart.drag", null);
  e && (o.on("click.drag", zt, wn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const In = (t) => () => t;
function Ko(t, {
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
Ko.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function Oc(t) {
  return !t.ctrlKey && !t.button;
}
function zc() {
  return this.parentNode;
}
function Vc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function Bc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function qc() {
  var t = Oc, e = zc, n = Vc, o = Bc, i = {}, r = xo("start", "drag", "end"), s = 0, a, l, c, d, u = 0;
  function f(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", y, Fc).on("touchend.drag touchcancel.drag", b).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, k) {
    if (!(d || !t.call(this, x, k))) {
      var v = S(this, e.call(this, x, k), x, k, "mouse");
      v && (Xe(x.view).on("mousemove.drag", p, wn).on("mouseup.drag", g, wn), Ir(x.view), No(x), c = !1, a = x.clientX, l = x.clientY, v("start", x));
    }
  }
  function p(x) {
    if (zt(x), !c) {
      var k = x.clientX - a, v = x.clientY - l;
      c = k * k + v * v > u;
    }
    i.mouse("drag", x);
  }
  function g(x) {
    Xe(x.view).on("mousemove.drag mouseup.drag", null), Dr(x.view, c), zt(x), i.mouse("end", x);
  }
  function m(x, k) {
    if (t.call(this, x, k)) {
      var v = x.changedTouches, C = e.call(this, x, k), T = v.length, R, L;
      for (R = 0; R < T; ++R)
        (L = S(this, C, x, k, v[R].identifier, v[R])) && (No(x), L("start", x, v[R]));
    }
  }
  function y(x) {
    var k = x.changedTouches, v = k.length, C, T;
    for (C = 0; C < v; ++C)
      (T = i[k[C].identifier]) && (zt(x), T("drag", x, k[C]));
  }
  function b(x) {
    var k = x.changedTouches, v = k.length, C, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), C = 0; C < v; ++C)
      (T = i[k[C].identifier]) && (No(x), T("end", x, k[C]));
  }
  function S(x, k, v, C, T, R) {
    var L = r.copy(), D = nt(R || v, k), A, _, w;
    if ((w = n.call(x, new Ko("beforestart", {
      sourceEvent: v,
      target: f,
      identifier: T,
      active: s,
      x: D[0],
      y: D[1],
      dx: 0,
      dy: 0,
      dispatch: L
    }), C)) != null)
      return A = w.x - D[0] || 0, _ = w.y - D[1] || 0, function N(M, I, H) {
        var V = D, $;
        switch (M) {
          case "start":
            i[T] = N, $ = s++;
            break;
          case "end":
            delete i[T], --s;
          // falls through
          case "drag":
            D = nt(H || I, k), $ = s;
            break;
        }
        L.call(
          M,
          x,
          new Ko(M, {
            sourceEvent: I,
            subject: w,
            target: f,
            identifier: T,
            active: $,
            x: D[0] + A,
            y: D[1] + _,
            dx: D[0] - V[0],
            dy: D[1] - V[1],
            dispatch: L
          }),
          C
        );
      };
  }
  return f.filter = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : In(!!x), f) : t;
  }, f.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : In(x), f) : e;
  }, f.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : In(x), f) : n;
  }, f.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : In(!!x), f) : o;
  }, f.on = function() {
    var x = r.on.apply(r, arguments);
    return x === r ? f : x;
  }, f.clickDistance = function(x) {
    return arguments.length ? (u = (x = +x) * x, f) : Math.sqrt(u);
  }, f;
}
function vi(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Rr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function Pn() {
}
var _n = 0.7, eo = 1 / _n, Vt = "\\s*([+-]?\\d+)\\s*", vn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Je = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Yc = /^#([0-9a-f]{3,8})$/, Xc = new RegExp(`^rgb\\(${Vt},${Vt},${Vt}\\)$`), Wc = new RegExp(`^rgb\\(${Je},${Je},${Je}\\)$`), jc = new RegExp(`^rgba\\(${Vt},${Vt},${Vt},${vn}\\)$`), Uc = new RegExp(`^rgba\\(${Je},${Je},${Je},${vn}\\)$`), Gc = new RegExp(`^hsl\\(${vn},${Je},${Je}\\)$`), Zc = new RegExp(`^hsla\\(${vn},${Je},${Je},${vn}\\)$`), Wi = {
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
vi(Pn, bn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ji,
  // Deprecated! Use color.formatHex.
  formatHex: ji,
  formatHex8: Kc,
  formatHsl: Jc,
  formatRgb: Ui,
  toString: Ui
});
function ji() {
  return this.rgb().formatHex();
}
function Kc() {
  return this.rgb().formatHex8();
}
function Jc() {
  return Hr(this).formatHsl();
}
function Ui() {
  return this.rgb().formatRgb();
}
function bn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Yc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Gi(e) : n === 3 ? new $e(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Dn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Dn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = Xc.exec(t)) ? new $e(e[1], e[2], e[3], 1) : (e = Wc.exec(t)) ? new $e(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = jc.exec(t)) ? Dn(e[1], e[2], e[3], e[4]) : (e = Uc.exec(t)) ? Dn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Gc.exec(t)) ? Ji(e[1], e[2] / 100, e[3] / 100, 1) : (e = Zc.exec(t)) ? Ji(e[1], e[2] / 100, e[3] / 100, e[4]) : Wi.hasOwnProperty(t) ? Gi(Wi[t]) : t === "transparent" ? new $e(NaN, NaN, NaN, 0) : null;
}
function Gi(t) {
  return new $e(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Dn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new $e(t, e, n, o);
}
function Qc(t) {
  return t instanceof Pn || (t = bn(t)), t ? (t = t.rgb(), new $e(t.r, t.g, t.b, t.opacity)) : new $e();
}
function Jo(t, e, n, o) {
  return arguments.length === 1 ? Qc(t) : new $e(t, e, n, o ?? 1);
}
function $e(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
vi($e, Jo, Rr(Pn, {
  brighter(t) {
    return t = t == null ? eo : Math.pow(eo, t), new $e(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? _n : Math.pow(_n, t), new $e(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new $e(Mt(this.r), Mt(this.g), Mt(this.b), to(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Zi,
  // Deprecated! Use color.formatHex.
  formatHex: Zi,
  formatHex8: ed,
  formatRgb: Ki,
  toString: Ki
}));
function Zi() {
  return `#${kt(this.r)}${kt(this.g)}${kt(this.b)}`;
}
function ed() {
  return `#${kt(this.r)}${kt(this.g)}${kt(this.b)}${kt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ki() {
  const t = to(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Mt(this.r)}, ${Mt(this.g)}, ${Mt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function to(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Mt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function kt(t) {
  return t = Mt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Ji(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new We(t, e, n, o);
}
function Hr(t) {
  if (t instanceof We) return new We(t.h, t.s, t.l, t.opacity);
  if (t instanceof Pn || (t = bn(t)), !t) return new We();
  if (t instanceof We) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new We(s, a, l, t.opacity);
}
function td(t, e, n, o) {
  return arguments.length === 1 ? Hr(t) : new We(t, e, n, o ?? 1);
}
function We(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
vi(We, td, Rr(Pn, {
  brighter(t) {
    return t = t == null ? eo : Math.pow(eo, t), new We(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? _n : Math.pow(_n, t), new We(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new $e(
      $o(t >= 240 ? t - 240 : t + 120, i, o),
      $o(t, i, o),
      $o(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new We(Qi(this.h), Rn(this.s), Rn(this.l), to(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = to(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Qi(this.h)}, ${Rn(this.s) * 100}%, ${Rn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Qi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Rn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function $o(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const Fr = (t) => () => t;
function nd(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function od(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function id(t) {
  return (t = +t) == 1 ? Or : function(e, n) {
    return n - e ? od(e, n, t) : Fr(isNaN(e) ? n : e);
  };
}
function Or(t, e) {
  var n = e - t;
  return n ? nd(t, n) : Fr(isNaN(t) ? e : t);
}
const Qo = (function t(e) {
  var n = id(e);
  function o(i, r) {
    var s = n((i = Jo(i)).r, (r = Jo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = Or(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = a(d), i.b = l(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function gt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var ei = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Io = new RegExp(ei.source, "g");
function sd(t) {
  return function() {
    return t;
  };
}
function rd(t) {
  return function(e) {
    return t(e) + "";
  };
}
function ad(t, e) {
  var n = ei.lastIndex = Io.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = ei.exec(t)) && (i = Io.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: gt(o, i) })), n = Io.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? rd(l[0].x) : sd(e) : (e = l.length, function(c) {
    for (var d = 0, u; d < e; ++d) a[(u = l[d]).i] = u.x(c);
    return a.join("");
  });
}
var es = 180 / Math.PI, ti = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function zr(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * es,
    skewX: Math.atan(l) * es,
    scaleX: s,
    scaleY: a
  };
}
var Hn;
function ld(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? ti : zr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function cd(t) {
  return t == null || (Hn || (Hn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Hn.setAttribute("transform", t), !(t = Hn.transform.baseVal.consolidate())) ? ti : (t = t.matrix, zr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Vr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: gt(c, u) }, { i: g - 2, x: gt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: gt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function a(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: gt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function l(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push(i(h) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: gt(c, u) }, { i: g - 2, x: gt(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), a(c.skewX, d.skewX, u, f), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var p = -1, g = f.length, m; ++p < g; ) u[(m = f[p]).i] = m.x(h);
      return u.join("");
    };
  };
}
var dd = Vr(ld, "px, ", "px)", "deg)"), ud = Vr(cd, ", ", ")", ")"), fd = 1e-12;
function ts(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function hd(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function gd(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const pd = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - a, p = u - l, g = h * h + p * p, m, y;
    if (g < fd)
      y = Math.log(f / c) / e, m = function(C) {
        return [
          a + C * h,
          l + C * p,
          c * Math.exp(e * C * y)
        ];
      };
    else {
      var b = Math.sqrt(g), S = (f * f - c * c + o * g) / (2 * c * n * b), x = (f * f - c * c - o * g) / (2 * f * n * b), k = Math.log(Math.sqrt(S * S + 1) - S), v = Math.log(Math.sqrt(x * x + 1) - x);
      y = (v - k) / e, m = function(C) {
        var T = C * y, R = ts(k), L = c / (n * b) * (R * gd(e * T + k) - hd(k));
        return [
          a + L * h,
          l + L * p,
          c * R / ts(e * T + k)
        ];
      };
    }
    return m.duration = y * 1e3 * e / Math.SQRT2, m;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return t(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var Xt = 0, un = 0, sn = 0, Br = 1e3, no, fn, oo = 0, Tt = 0, Co = 0, xn = typeof performance == "object" && performance.now ? performance : Date, qr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function bi() {
  return Tt || (qr(md), Tt = xn.now() + Co);
}
function md() {
  Tt = 0;
}
function io() {
  this._call = this._time = this._next = null;
}
io.prototype = Yr.prototype = {
  constructor: io,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? bi() : +n) + (e == null ? 0 : +e), !this._next && fn !== this && (fn ? fn._next = this : no = this, fn = this), this._call = t, this._time = n, ni();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ni());
  }
};
function Yr(t, e, n) {
  var o = new io();
  return o.restart(t, e, n), o;
}
function yd() {
  bi(), ++Xt;
  for (var t = no, e; t; )
    (e = Tt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Xt;
}
function ns() {
  Tt = (oo = xn.now()) + Co, Xt = un = 0;
  try {
    yd();
  } finally {
    Xt = 0, _d(), Tt = 0;
  }
}
function wd() {
  var t = xn.now(), e = t - oo;
  e > Br && (Co -= e, oo = t);
}
function _d() {
  for (var t, e = no, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : no = n);
  fn = t, ni(o);
}
function ni(t) {
  if (!Xt) {
    un && (un = clearTimeout(un));
    var e = t - Tt;
    e > 24 ? (t < 1 / 0 && (un = setTimeout(ns, t - xn.now() - Co)), sn && (sn = clearInterval(sn))) : (sn || (oo = xn.now(), sn = setInterval(wd, Br)), Xt = 1, qr(ns));
  }
}
function os(t, e, n) {
  var o = new io();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var vd = xo("start", "end", "cancel", "interrupt"), bd = [], Xr = 0, is = 1, oi = 2, jn = 3, ss = 4, ii = 5, Un = 6;
function So(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  xd(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: vd,
    tween: bd,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Xr
  });
}
function xi(t, e) {
  var n = Ge(t, e);
  if (n.state > Xr) throw new Error("too late; already scheduled");
  return n;
}
function Qe(t, e) {
  var n = Ge(t, e);
  if (n.state > jn) throw new Error("too late; already running");
  return n;
}
function Ge(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function xd(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = Yr(r, 0, n.time);
  function r(c) {
    n.state = is, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== is) return l();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === jn) return os(s);
        h.state === ss ? (h.state = Un, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Un, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (os(function() {
      n.state === jn && (n.state = ss, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = oi, n.on.call("start", t, t.__data__, n.index, n.group), n.state === oi) {
      for (n.state = jn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = ii, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === ii && (n.on.call("end", t, t.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Un, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Gn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > oi && o.state < ii, o.state = Un, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Ed(t) {
  return this.each(function() {
    Gn(this, t);
  });
}
function Cd(t, e) {
  var n, o;
  return function() {
    var i = Qe(this, t), r = i.tween;
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
function Sd(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Qe(this, t), s = r.tween;
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
function kd(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = Ge(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Cd : Sd)(n, t, e));
}
function Ei(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Qe(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return Ge(i, o).value[e];
  };
}
function Wr(t, e) {
  var n;
  return (typeof e == "number" ? gt : e instanceof bn ? Qo : (n = bn(e)) ? (e = n, Qo) : ad)(t, e);
}
function Ld(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Md(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Pd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Td(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Ad(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function Nd(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function $d(t, e) {
  var n = Eo(t), o = n === "transform" ? ud : Wr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Nd : Ad)(n, o, Ei(this, "attr." + t, e)) : e == null ? (n.local ? Md : Ld)(n) : (n.local ? Td : Pd)(n, o, e));
}
function Id(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function Dd(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function Rd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Dd(t, r)), n;
  }
  return i._value = e, i;
}
function Hd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Id(t, r)), n;
  }
  return i._value = e, i;
}
function Fd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = Eo(t);
  return this.tween(n, (o.local ? Rd : Hd)(o, e));
}
function Od(t, e) {
  return function() {
    xi(this, t).delay = +e.apply(this, arguments);
  };
}
function zd(t, e) {
  return e = +e, function() {
    xi(this, t).delay = e;
  };
}
function Vd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Od : zd)(e, t)) : Ge(this.node(), e).delay;
}
function Bd(t, e) {
  return function() {
    Qe(this, t).duration = +e.apply(this, arguments);
  };
}
function qd(t, e) {
  return e = +e, function() {
    Qe(this, t).duration = e;
  };
}
function Yd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Bd : qd)(e, t)) : Ge(this.node(), e).duration;
}
function Xd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Qe(this, t).ease = e;
  };
}
function Wd(t) {
  var e = this._id;
  return arguments.length ? this.each(Xd(e, t)) : Ge(this.node(), e).ease;
}
function jd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Qe(this, t).ease = n;
  };
}
function Ud(t) {
  if (typeof t != "function") throw new Error();
  return this.each(jd(this._id, t));
}
function Gd(t) {
  typeof t != "function" && (t = Cr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new dt(o, this._parents, this._name, this._id);
}
function Zd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, u = s[a] = new Array(d), f, h = 0; h < d; ++h)
      (f = l[h] || c[h]) && (u[h] = f);
  for (; a < o; ++a)
    s[a] = e[a];
  return new dt(s, this._parents, this._name, this._id);
}
function Kd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Jd(t, e, n) {
  var o, i, r = Kd(e) ? xi : Qe;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Qd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? Ge(this.node(), n).on.on(t) : this.each(Jd(n, t, e));
}
function eu(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function tu() {
  return this.on("end.remove", eu(this._id));
}
function nu(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = wi(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, u, f = 0; f < l; ++f)
      (d = a[f]) && (u = t.call(d, d.__data__, f, a)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, So(c[f], e, n, f, c, Ge(d, n)));
  return new dt(r, this._parents, e, n);
}
function ou(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Er(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, u = 0; u < c; ++u)
      if (d = l[u]) {
        for (var f = t.call(d, d.__data__, u, l), h, p = Ge(d, n), g = 0, m = f.length; g < m; ++g)
          (h = f[g]) && So(h, e, n, g, f, p);
        r.push(f), s.push(d);
      }
  return new dt(r, s, e, n);
}
var iu = Mn.prototype.constructor;
function su() {
  return new iu(this._groups, this._parents);
}
function ru(t, e) {
  var n, o, i;
  return function() {
    var r = Yt(this, t), s = (this.style.removeProperty(t), Yt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function jr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function au(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Yt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function lu(t, e, n) {
  var o, i, r;
  return function() {
    var s = Yt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), Yt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function cu(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Qe(this, t), c = l.on, d = l.value[r] == null ? a || (a = jr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function du(t, e, n) {
  var o = (t += "") == "transform" ? dd : Wr;
  return e == null ? this.styleTween(t, ru(t, o)).on("end.style." + t, jr(t)) : typeof e == "function" ? this.styleTween(t, lu(t, o, Ei(this, "style." + t, e))).each(cu(this._id, t)) : this.styleTween(t, au(t, o, e), n).on("end.style." + t, null);
}
function uu(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function fu(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && uu(t, s, n)), o;
  }
  return r._value = e, r;
}
function hu(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, fu(t, e, n ?? ""));
}
function gu(t) {
  return function() {
    this.textContent = t;
  };
}
function pu(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function mu(t) {
  return this.tween("text", typeof t == "function" ? pu(Ei(this, "text", t)) : gu(t == null ? "" : t + ""));
}
function yu(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function wu(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && yu(i)), e;
  }
  return o._value = t, o;
}
function _u(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, wu(t));
}
function vu() {
  for (var t = this._name, e = this._id, n = Ur(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = Ge(l, e);
        So(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new dt(o, this._parents, t, n);
}
function bu() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Qe(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(l)), c.on = e;
    }), i === 0 && r();
  });
}
var xu = 0;
function dt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function Ur() {
  return ++xu;
}
var tt = Mn.prototype;
dt.prototype = {
  constructor: dt,
  select: nu,
  selectAll: ou,
  selectChild: tt.selectChild,
  selectChildren: tt.selectChildren,
  filter: Gd,
  merge: Zd,
  selection: su,
  transition: vu,
  call: tt.call,
  nodes: tt.nodes,
  node: tt.node,
  size: tt.size,
  empty: tt.empty,
  each: tt.each,
  on: Qd,
  attr: $d,
  attrTween: Fd,
  style: du,
  styleTween: hu,
  text: mu,
  textTween: _u,
  remove: tu,
  tween: kd,
  delay: Vd,
  duration: Yd,
  ease: Wd,
  easeVarying: Ud,
  end: bu,
  [Symbol.iterator]: tt[Symbol.iterator]
};
const Eu = (t) => +t;
function Cu(t) {
  return t * t;
}
function Su(t) {
  return t * (2 - t);
}
function ku(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Lu(t) {
  return t * t * t;
}
function Mu(t) {
  return --t * t * t + 1;
}
function Gr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Zr = Math.PI, Kr = Zr / 2;
function Pu(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * Kr);
}
function Tu(t) {
  return Math.sin(t * Kr);
}
function Au(t) {
  return (1 - Math.cos(Zr * t)) / 2;
}
function Ct(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function Nu(t) {
  return Ct(1 - +t);
}
function $u(t) {
  return 1 - Ct(t);
}
function Iu(t) {
  return ((t *= 2) <= 1 ? Ct(1 - t) : 2 - Ct(t - 1)) / 2;
}
function Du(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function Ru(t) {
  return Math.sqrt(1 - --t * t);
}
function Hu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var si = 4 / 11, Fu = 6 / 11, Ou = 8 / 11, zu = 3 / 4, Vu = 9 / 11, Bu = 10 / 11, qu = 15 / 16, Yu = 21 / 22, Xu = 63 / 64, Fn = 1 / si / si;
function Wu(t) {
  return 1 - so(1 - t);
}
function so(t) {
  return (t = +t) < si ? Fn * t * t : t < Ou ? Fn * (t -= Fu) * t + zu : t < Bu ? Fn * (t -= Vu) * t + qu : Fn * (t -= Yu) * t + Xu;
}
function ju(t) {
  return ((t *= 2) <= 1 ? 1 - so(1 - t) : so(t - 1) + 1) / 2;
}
var Ci = 1.70158, Uu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(Ci), Gu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(Ci), Zu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(Ci), Wt = 2 * Math.PI, Si = 1, ki = 0.3, Ku = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Wt);
  function i(r) {
    return e * Ct(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Wt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Si, ki), Ju = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Wt);
  function i(r) {
    return 1 - e * Ct(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Wt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Si, ki), Qu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Wt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * Ct(-r) * Math.sin((o - r) / n) : 2 - e * Ct(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Wt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(Si, ki), ef = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Gr
};
function tf(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function nf(t) {
  var e, n;
  t instanceof dt ? (e = t._id, t = t._name) : (e = Ur(), (n = ef).time = bi(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && So(l, t, e, c, s, n || tf(l, e));
  return new dt(o, this._parents, t, e);
}
Mn.prototype.interrupt = Ed;
Mn.prototype.transition = nf;
const On = (t) => () => t;
function of(t, {
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
function ot(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
ot.prototype = {
  constructor: ot,
  scale: function(t) {
    return t === 1 ? this : new ot(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new ot(this.k, this.x + this.k * t, this.y + this.k * e);
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
var Ft = new ot(1, 0, 0);
ot.prototype;
function Do(t) {
  t.stopImmediatePropagation();
}
function rn(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function sf(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function rf() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function rs() {
  return this.__zoom || Ft;
}
function af(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function lf() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function cf(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function df() {
  var t = sf, e = rf, n = cf, o = af, i = lf, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = pd, c = xo("start", "zoom", "end"), d, u, f, h = 500, p = 150, g = 0, m = 10;
  function y(w) {
    w.property("__zoom", rs).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", R).on("dblclick.zoom", L).filter(i).on("touchstart.zoom", D).on("touchmove.zoom", A).on("touchend.zoom touchcancel.zoom", _).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(w, N, M, I) {
    var H = w.selection ? w.selection() : w;
    H.property("__zoom", rs), w !== H ? k(w, N, M, I) : H.interrupt().each(function() {
      v(this, arguments).event(I).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, y.scaleBy = function(w, N, M, I) {
    y.scaleTo(w, function() {
      var H = this.__zoom.k, V = typeof N == "function" ? N.apply(this, arguments) : N;
      return H * V;
    }, M, I);
  }, y.scaleTo = function(w, N, M, I) {
    y.transform(w, function() {
      var H = e.apply(this, arguments), V = this.__zoom, $ = M == null ? x(H) : typeof M == "function" ? M.apply(this, arguments) : M, E = V.invert($), P = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(S(b(V, P), $, E), H, s);
    }, M, I);
  }, y.translateBy = function(w, N, M, I) {
    y.transform(w, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof M == "function" ? M.apply(this, arguments) : M
      ), e.apply(this, arguments), s);
    }, null, I);
  }, y.translateTo = function(w, N, M, I, H) {
    y.transform(w, function() {
      var V = e.apply(this, arguments), $ = this.__zoom, E = I == null ? x(V) : typeof I == "function" ? I.apply(this, arguments) : I;
      return n(Ft.translate(E[0], E[1]).scale($.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), V, s);
    }, I, H);
  };
  function b(w, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === w.k ? w : new ot(N, w.x, w.y);
  }
  function S(w, N, M) {
    var I = N[0] - M[0] * w.k, H = N[1] - M[1] * w.k;
    return I === w.x && H === w.y ? w : new ot(w.k, I, H);
  }
  function x(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function k(w, N, M, I) {
    w.on("start.zoom", function() {
      v(this, arguments).event(I).start();
    }).on("interrupt.zoom end.zoom", function() {
      v(this, arguments).event(I).end();
    }).tween("zoom", function() {
      var H = this, V = arguments, $ = v(H, V).event(I), E = e.apply(H, V), P = M == null ? x(E) : typeof M == "function" ? M.apply(H, V) : M, F = Math.max(E[1][0] - E[0][0], E[1][1] - E[0][1]), W = H.__zoom, Q = typeof N == "function" ? N.apply(H, V) : N, G = l(W.invert(P).concat(F / W.k), Q.invert(P).concat(F / Q.k));
      return function(j) {
        if (j === 1) j = Q;
        else {
          var Z = G(j), O = F / Z[2];
          j = new ot(O, P[0] - Z[0] * O, P[1] - Z[1] * O);
        }
        $.zoom(null, j);
      };
    });
  }
  function v(w, N, M) {
    return !M && w.__zooming || new C(w, N);
  }
  function C(w, N) {
    this.that = w, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = e.apply(w, N), this.taps = 0;
  }
  C.prototype = {
    event: function(w) {
      return w && (this.sourceEvent = w), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(w, N) {
      return this.mouse && w !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && w !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && w !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(w) {
      var N = Xe(this.that).datum();
      c.call(
        w,
        this.that,
        new of(w, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        N
      );
    }
  };
  function T(w, ...N) {
    if (!t.apply(this, arguments)) return;
    var M = v(this, N).event(w), I = this.__zoom, H = Math.max(r[0], Math.min(r[1], I.k * Math.pow(2, o.apply(this, arguments)))), V = nt(w);
    if (M.wheel)
      (M.mouse[0][0] !== V[0] || M.mouse[0][1] !== V[1]) && (M.mouse[1] = I.invert(M.mouse[0] = V)), clearTimeout(M.wheel);
    else {
      if (I.k === H) return;
      M.mouse = [V, I.invert(V)], Gn(this), M.start();
    }
    rn(w), M.wheel = setTimeout($, p), M.zoom("mouse", n(S(b(I, H), M.mouse[0], M.mouse[1]), M.extent, s));
    function $() {
      M.wheel = null, M.end();
    }
  }
  function R(w, ...N) {
    if (f || !t.apply(this, arguments)) return;
    var M = w.currentTarget, I = v(this, N, !0).event(w), H = Xe(w.view).on("mousemove.zoom", P, !0).on("mouseup.zoom", F, !0), V = nt(w, M), $ = w.clientX, E = w.clientY;
    Ir(w.view), Do(w), I.mouse = [V, this.__zoom.invert(V)], Gn(this), I.start();
    function P(W) {
      if (rn(W), !I.moved) {
        var Q = W.clientX - $, G = W.clientY - E;
        I.moved = Q * Q + G * G > g;
      }
      I.event(W).zoom("mouse", n(S(I.that.__zoom, I.mouse[0] = nt(W, M), I.mouse[1]), I.extent, s));
    }
    function F(W) {
      H.on("mousemove.zoom mouseup.zoom", null), Dr(W.view, I.moved), rn(W), I.event(W).end();
    }
  }
  function L(w, ...N) {
    if (t.apply(this, arguments)) {
      var M = this.__zoom, I = nt(w.changedTouches ? w.changedTouches[0] : w, this), H = M.invert(I), V = M.k * (w.shiftKey ? 0.5 : 2), $ = n(S(b(M, V), I, H), e.apply(this, N), s);
      rn(w), a > 0 ? Xe(this).transition().duration(a).call(k, $, I, w) : Xe(this).call(y.transform, $, I, w);
    }
  }
  function D(w, ...N) {
    if (t.apply(this, arguments)) {
      var M = w.touches, I = M.length, H = v(this, N, w.changedTouches.length === I).event(w), V, $, E, P;
      for (Do(w), $ = 0; $ < I; ++$)
        E = M[$], P = nt(E, this), P = [P, this.__zoom.invert(P), E.identifier], H.touch0 ? !H.touch1 && H.touch0[2] !== P[2] && (H.touch1 = P, H.taps = 0) : (H.touch0 = P, V = !0, H.taps = 1 + !!d);
      d && (d = clearTimeout(d)), V && (H.taps < 2 && (u = P[0], d = setTimeout(function() {
        d = null;
      }, h)), Gn(this), H.start());
    }
  }
  function A(w, ...N) {
    if (this.__zooming) {
      var M = v(this, N).event(w), I = w.changedTouches, H = I.length, V, $, E, P;
      for (rn(w), V = 0; V < H; ++V)
        $ = I[V], E = nt($, this), M.touch0 && M.touch0[2] === $.identifier ? M.touch0[0] = E : M.touch1 && M.touch1[2] === $.identifier && (M.touch1[0] = E);
      if ($ = M.that.__zoom, M.touch1) {
        var F = M.touch0[0], W = M.touch0[1], Q = M.touch1[0], G = M.touch1[1], j = (j = Q[0] - F[0]) * j + (j = Q[1] - F[1]) * j, Z = (Z = G[0] - W[0]) * Z + (Z = G[1] - W[1]) * Z;
        $ = b($, Math.sqrt(j / Z)), E = [(F[0] + Q[0]) / 2, (F[1] + Q[1]) / 2], P = [(W[0] + G[0]) / 2, (W[1] + G[1]) / 2];
      } else if (M.touch0) E = M.touch0[0], P = M.touch0[1];
      else return;
      M.zoom("touch", n(S($, E, P), M.extent, s));
    }
  }
  function _(w, ...N) {
    if (this.__zooming) {
      var M = v(this, N).event(w), I = w.changedTouches, H = I.length, V, $;
      for (Do(w), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), V = 0; V < H; ++V)
        $ = I[V], M.touch0 && M.touch0[2] === $.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === $.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && ($ = nt($, this), Math.hypot(u[0] - $[0], u[1] - $[1]) < m)) {
        var E = Xe(this).on("dblclick.zoom");
        E && E.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : On(+w), y) : o;
  }, y.filter = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : On(!!w), y) : t;
  }, y.touchable = function(w) {
    return arguments.length ? (i = typeof w == "function" ? w : On(!!w), y) : i;
  }, y.extent = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : On([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), y) : e;
  }, y.scaleExtent = function(w) {
    return arguments.length ? (r[0] = +w[0], r[1] = +w[1], y) : [r[0], r[1]];
  }, y.translateExtent = function(w) {
    return arguments.length ? (s[0][0] = +w[0][0], s[1][0] = +w[1][0], s[0][1] = +w[0][1], s[1][1] = +w[1][1], y) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, y.constrain = function(w) {
    return arguments.length ? (n = w, y) : n;
  }, y.duration = function(w) {
    return arguments.length ? (a = +w, y) : a;
  }, y.interpolate = function(w) {
    return arguments.length ? (l = w, y) : l;
  }, y.on = function() {
    var w = c.on.apply(c, arguments);
    return w === c ? y : w;
  }, y.clickDistance = function(w) {
    return arguments.length ? (g = (w = +w) * w, y) : Math.sqrt(g);
  }, y.tapDistance = function(w) {
    return arguments.length ? (m = +w, y) : m;
  }, y;
}
function as(t) {
  const { pannable: e, zoomable: n, isLocked: o, noPanClassName: i, noWheelClassName: r, isTouchSelectionMode: s, isPanKeyHeld: a, panOnDrag: l } = t;
  return (c) => {
    if (o?.() || c.type !== "wheel" && i && c.target?.closest?.("." + i) || c.type === "wheel" && r && c.target?.closest?.("." + r) || !n && c.type === "wheel") return !1;
    if (c.type === "touchstart") {
      const d = !c.touches || c.touches.length < 2;
      if (s?.() && d || !e && !a?.() && d || !n && !d) return !1;
    }
    return c.type === "mousedown" ? a?.() ? !0 : e ? Array.isArray(l) ? l.includes(c.button) : l === !1 ? !1 : !c.button : !1 : !0;
  };
}
const uf = 300, ff = 1.5;
function ls(t, e, n, o) {
  return {
    x: e - (e - t.x) / t.zoom * o,
    y: n - (n - t.y) / t.zoom * o,
    zoom: o
  };
}
function hf(t, e, n) {
  if (!(t.zoom >= n.level - 1e-3))
    return { next: ls(t, e.x, e.y, n.level), remember: t };
  if (n.remembered)
    return { next: n.remembered, remember: null };
  const i = n.zoomOut ?? "min", r = i === "fit" || typeof i == "number" && Number.isFinite(i) ? i : "min";
  if (r === "fit") {
    const a = n.fit?.();
    if (a && a.zoom < t.zoom - 1e-3)
      return { next: a, remember: null };
  }
  const s = Math.max(n.minZoom, r === "fit" || r === "min" ? n.minZoom : r);
  return t.zoom <= s + 1e-3 ? { next: t, remember: null } : { next: ls(t, e.x, e.y, s), remember: null };
}
function gf(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = Xe(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (N) => {
    c && N.code === c && (l = !0, t.style.cursor = "grab");
  }, u = (N) => {
    c && N.code === c && (l = !1, t.style.cursor = "");
  }, f = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  let h = null, p = s;
  const g = df().scaleExtent([o, i]).on("start", (N) => {
    if (!N.sourceEvent) return;
    h = null, l && (t.style.cursor = "grabbing");
    const { x: M, y: I, k: H } = N.transform;
    e.onMoveStart?.({ x: M, y: I, zoom: H });
  }).on("zoom", (N) => {
    const { x: M, y: I, k: H } = N.transform;
    n({ x: M, y: I, zoom: H }), N.sourceEvent && e.onMove?.({ x: M, y: I, zoom: H });
  }).on("end", (N) => {
    if (!N.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: M, y: I, k: H } = N.transform;
    e.onMoveEnd?.({ x: M, y: I, zoom: H });
  });
  e.translateExtent && g.translateExtent(e.translateExtent), g.filter(as({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => l,
    panOnDrag: e.panOnDrag
  })), a.call(g);
  const m = e.zoomOnDoubleClick === "toggle" ? "toggle" : e.zoomOnDoubleClick === !1 ? "off" : "step", y = Math.max(
    o,
    Math.min(i, e.dblClickZoomLevel ?? ff)
  ), b = typeof e.dblClickZoomOutLevel == "number" && Number.isFinite(e.dblClickZoomOutLevel) ? Math.max(o, Math.min(i, e.dblClickZoomOutLevel)) : e.dblClickZoomOutLevel === "fit" ? "fit" : "min", S = (N) => {
    if (e.isLocked?.()) return;
    const M = N.target;
    if (e.noPanClassName && M?.closest?.("." + e.noPanClassName)) return;
    N.preventDefault();
    const I = t.__zoom ?? Ft, H = t.getBoundingClientRect(), { next: V, remember: $ } = hf(
      { x: I.x, y: I.y, zoom: I.k },
      { x: N.clientX - H.left, y: N.clientY - H.top },
      {
        level: y,
        minZoom: o,
        remembered: h,
        zoomOut: b,
        fit: e.getFitViewport ?? null
      }
    );
    h = $, a.transition().duration(uf).call(g.transform, Ft.translate(V.x, V.y).scale(V.zoom));
  }, k = m === "toggle" && y > (typeof b == "number" ? b : o) + 1e-3;
  k ? (a.on("dblclick.zoom", null), t.addEventListener("dblclick", S)) : m === "off" && a.on("dblclick.zoom", null);
  let v = e.panOnScroll ?? !1, C = e.panOnScrollDirection ?? "both", T = e.panOnScrollSpeed ?? 1, R = !1;
  const L = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, D = (N) => {
    L && N.code === L && (R = !0);
  }, A = (N) => {
    L && N.code === L && (R = !1);
  }, _ = () => {
    R = !1;
  };
  L && (window.addEventListener("keydown", D), window.addEventListener("keyup", A), window.addEventListener("blur", _));
  const w = (N) => {
    if (e.isLocked?.()) return;
    const M = N.ctrlKey || N.metaKey || R;
    if (!(v ? !M : N.shiftKey)) return;
    N.preventDefault(), N.stopPropagation();
    const H = T;
    let V = 0, $ = 0;
    C !== "horizontal" && ($ = -N.deltaY * H), C !== "vertical" && (V = -N.deltaX * H, N.shiftKey && N.deltaX === 0 && C === "both" && (V = -N.deltaY * H, $ = 0)), e.onScrollPan?.(V, $);
  };
  return t.addEventListener("wheel", w, { passive: !1, capture: !0 }), {
    setViewport(N, M) {
      h = null;
      const I = M?.duration ?? 0, H = Ft.translate(N.x ?? 0, N.y ?? 0).scale(N.zoom ?? 1);
      I > 0 ? a.transition().duration(I).call(g.transform, H) : a.call(g.transform, H);
    },
    getTransform() {
      return t.__zoom ?? Ft;
    },
    update(N) {
      if ((N.minZoom !== void 0 || N.maxZoom !== void 0) && g.scaleExtent([
        N.minZoom ?? o,
        N.maxZoom ?? i
      ]), N.pannable !== void 0 || N.zoomable !== void 0) {
        const M = N.pannable ?? r, I = N.zoomable ?? p;
        p = I, g.filter(as({
          pannable: M,
          zoomable: I,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => l,
          panOnDrag: e.panOnDrag
        }));
      }
      N.panOnScroll !== void 0 && (v = N.panOnScroll), N.panOnScrollDirection !== void 0 && (C = N.panOnScrollDirection), N.panOnScrollSpeed !== void 0 && (T = N.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", w, { capture: !0 }), k && t.removeEventListener("dblclick", S), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), L && (window.removeEventListener("keydown", D), window.removeEventListener("keyup", A), window.removeEventListener("blur", _)), a.on(".zoom", null);
    }
  };
}
function Jr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function pf(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const we = 150, ve = 50;
function ko(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - l / 2, y: u - c / 2, width: l, height: c };
}
function jt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? we, l = s.dimensions?.height ?? ve, c = Jt(s, e), d = s.rotation ? ko(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function mf(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? ve, l = Jt(r, n), c = r.rotation ? ko(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function yf(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? ve, l = Jt(r, n), c = r.rotation ? ko(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function ro(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + a / 2 }, p = e / 2 - h.x * f, g = n / 2 - h.y * f;
  return { x: p, y: g, zoom: f };
}
function wf(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class _f {
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
function Jt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? we, i = t.dimensions?.height ?? ve;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let Qr = !1;
function ea(t) {
  Qr = t;
}
function B(t, e, n) {
  if (!Qr) return;
  const o = `%c[AlpineFlow:${t}]`, i = vf(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function vf(t) {
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
const En = "#64748b", Li = "#d4d4d8", ta = "#ef4444", bf = "2", xf = "6 3", cs = 1.2, Zn = 0.2, ao = 5, ds = 25;
class Ef {
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
const Cf = 16;
function Sf() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Cf),
    cancel: (t) => clearTimeout(t)
  };
}
class na {
  constructor() {
    this._scheduler = Sf(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const lo = new na(), kf = {
  linear: Eu,
  easeIn: Cu,
  easeOut: Su,
  easeInOut: ku,
  easeCubicIn: Lu,
  easeCubicOut: Mu,
  easeCubicInOut: Gr,
  easeCircIn: Du,
  easeCircOut: Ru,
  easeCircInOut: Hu,
  easeSinIn: Pu,
  easeSinOut: Tu,
  easeSinInOut: Au,
  easeExpoIn: Nu,
  easeExpoOut: $u,
  easeExpoInOut: Iu,
  easeBounce: so,
  easeBounceIn: Wu,
  easeBounceInOut: ju,
  easeElastic: Ju,
  easeElasticIn: Ku,
  easeElasticInOut: Qu,
  easeBack: Zu,
  easeBackIn: Uu,
  easeBackOut: Gu
};
function oa(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function co(t) {
  return typeof t == "function" ? t : kf[t ?? "easeInOut"];
}
function at(t, e, n) {
  return t + (e - t) * n;
}
function Mi(t, e, n) {
  return Qo(t, e)(n);
}
function Cn(t) {
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
const us = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, fs = /^(#|rgb|hsl)/;
function ia(t, e, n) {
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
    const l = us.exec(s), c = us.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = at(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (fs.test(s) && fs.test(a)) {
      o[r] = Mi(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function Lf(t, e, n, o) {
  let i = at(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: at(t.x, e.x, n),
    y: at(t.y, e.y, n),
    zoom: i
  };
}
class Mf {
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
class Pf {
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
const an = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function sa(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? an.stiffness, i = e.damping ?? an.damping, r = e.mass ?? an.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? an.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? an.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const hs = {
  timeConstant: 350,
  restVelocity: 0.5
};
function Pi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? hs.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < hs.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function Ti(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function ra(t, e, n, o) {
  if (n <= 0)
    return;
  Pi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? Ti(o) : null;
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
function aa(t, e, n, o) {
  const i = Ti(o), r = e.values.map(
    (p) => p[o] ?? (i ? p[i] : void 0) ?? t.value
  );
  if (r.length < 2) {
    t.value = r[0] ?? t.value, t.settled = !0;
    return;
  }
  const s = e.offsets ?? r.map((p, g) => g / (r.length - 1)), a = Math.max(0, Math.min(1, n));
  let l = 0;
  for (let p = 0; p < s.length - 1; p++)
    a >= s[p] && (l = p);
  const c = s[l], d = s[l + 1] ?? 1, u = d > c ? (a - c) / (d - c) : 1, f = r[l], h = r[l + 1] ?? r[l];
  t.value = f + (h - f) * Math.max(0, Math.min(1, u)), a >= 1 && (t.value = r[r.length - 1], t.settled = !0);
}
const gs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, ps = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, ms = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function la(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return gs[n] ? { ...gs[n] } : null;
    case "decay":
      return ps[n] ? { ...ps[n] } : null;
    case "inertia":
      return ms[n] ? { ...ms[n] } : null;
    default:
      return null;
  }
}
function ys(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function Tf(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? at(t, e, n) : ys(t) && ys(e) ? Mi(t, e, n) : n < 0.5 ? t : e;
}
class Af {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Mf(), this._activeTransaction = null, this._engine = e;
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
    const e = new Pf();
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
      whileStopMode: p = "jump-end",
      motion: g,
      maxDuration: m = 5e3
    } = n, y = co(i), b = g ? la(g) : void 0;
    for (const w of e) {
      const N = this._ownership.get(w.key);
      if (N && !N.stopped) {
        const M = N.currentValues.get(w.key);
        M !== void 0 && (w.from = M), N.entries = N.entries.filter((I) => I.key !== w.key), N.entries.length === 0 && this._stop(N, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const w of e)
        this._activeTransaction.captureProperty(w.key, w.from, w.apply);
    if (o <= 0) {
      const w = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
      for (const H of e)
        w.set(H.key, H.from), N.set(H.key, H.to);
      l?.();
      for (const H of e)
        H.apply(H.to);
      const M = [...u ? [u] : [], ...f ?? []], I = {
        _tags: M.length > 0 ? M : void 0,
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
          return N;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return w;
        },
        get _target() {
          return N;
        }
      };
      return this._registry.register(I), queueMicrotask(() => this._registry.unregister(I)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(I), d?.(), I;
    }
    const S = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
    for (const w of e)
      S.set(w.key, w.from), x.set(w.key, w.to);
    let k;
    if (b) {
      k = /* @__PURE__ */ new Map();
      for (const w of e) {
        if (typeof w.from != "number" || typeof w.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${w.key}" is non-numeric; snapping to target.`
          ), w.apply(w.to);
          continue;
        }
        let N = 0;
        if (b.type === "decay" || b.type === "inertia") {
          const M = b.velocity;
          if (typeof M == "number")
            N = M;
          else if (M && typeof M == "object") {
            const H = M, V = Ti(w.key);
            N = H[w.key] ?? (V ? H[V] ?? 0 : 0);
          }
          const I = b.power ?? 0.8;
          N *= I;
        }
        k.set(w.key, {
          value: w.from,
          velocity: N,
          target: w.to,
          settled: !1
        });
      }
      k.size === 0 && (k = void 0);
    }
    const v = s === "ping-pong" ? "reverse" : s, C = a === "end" ? "backward" : "forward";
    let T;
    const R = new Promise((w) => {
      T = w;
    }), L = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: C,
      duration: o,
      easingFn: y,
      loop: v,
      onStart: l,
      startFired: !1,
      onProgress: c,
      onComplete: d,
      resolve: T,
      stopped: !1,
      isFinished: !1,
      currentValues: /* @__PURE__ */ new Map(),
      _lastElapsed: 0,
      _lastTickWallTime: 0,
      snapshot: S,
      target: x,
      _currentFinished: R,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: k ? b : void 0,
      physicsStates: k,
      maxDuration: m,
      isPhysics: !!k,
      _prevElapsed: 0
    };
    if (a === "end")
      for (const w of L.entries)
        w.apply(w.to), L.currentValues.set(w.key, w.to);
    else
      for (const w of L.entries)
        L.currentValues.set(w.key, w.from);
    for (const w of e)
      this._ownership.set(w.key, L);
    this._groups.add(L);
    const D = this._engine.register((w) => this._tick(L, w), r);
    L.engineHandle = D;
    const A = [...u ? [u] : [], ...f ?? []], _ = {
      _tags: A.length > 0 ? A : void 0,
      pause: () => this._pause(L),
      resume: () => this._resume(L),
      stop: (w) => this._stop(L, w?.mode ?? "jump-end"),
      reverse: () => this._reverse(L),
      play: () => this._play(L),
      playForward: () => this._playDirection(L, "forward"),
      playBackward: () => this._playDirection(L, "backward"),
      restart: (w) => this._restart(L, w),
      get direction() {
        return L.direction;
      },
      get isFinished() {
        return L.isFinished;
      },
      get currentValue() {
        return L.currentValues;
      },
      get finished() {
        return L._currentFinished;
      },
      get _snapshot() {
        return L.snapshot;
      },
      get _target() {
        return L.target;
      }
    };
    return this._registry.register(_), L._handle = _, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(_), _;
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
      const l = Tf(a.from, a.to, s);
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
              sa(d, e.motionConfig, i);
              break;
            case "decay":
              Pi(d, e.motionConfig, i);
              break;
            case "inertia":
              ra(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              aa(d, e.motionConfig, h, c.key);
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
const ca = /* @__PURE__ */ new Map();
function Nf(t, e) {
  ca.set(t, e);
}
function Ro(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Bt(t) {
  return typeof t == "string" ? { type: t } : t;
}
function qt(t, e) {
  return `${e}__${t.type}__${(t.color ?? Li).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function uo(t, e) {
  const n = Ro(t.color ?? Li), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = Ro(t.orient ?? "auto-start-reverse"), l = Ro(e);
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
  const c = ca.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : uo({ ...t, type: "arrowclosed" }, e);
}
const $f = ["mousedown", "pointerdown", "touchstart", "wheel", "dblclick"];
function Qt(t, e = $f) {
  const n = (i) => i.stopPropagation(), o = { passive: !1 };
  for (const i of e)
    t.addEventListener(i, n, o);
  return () => {
    for (const i of e)
      t.removeEventListener(i, n, o);
  };
}
const da = 200, ua = 150, If = 1.2, ln = "http://www.w3.org/2000/svg";
function Df(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor;
  let l = i.minimapWidth ?? da, c = i.minimapHeight ?? ua;
  const d = document.createElement("div");
  d.className = `flow-minimap flow-minimap-${r}`;
  const u = document.createElementNS(ln, "svg");
  u.setAttribute("width", String(l)), u.setAttribute("height", String(c));
  const f = document.createElementNS(ln, "rect");
  f.classList.add("flow-minimap-bg"), f.setAttribute("width", String(l)), f.setAttribute("height", String(c));
  const h = document.createElementNS(ln, "g");
  h.classList.add("flow-minimap-nodes");
  const p = document.createElementNS(ln, "path");
  p.classList.add("flow-minimap-mask"), s && p.setAttribute("fill", s), p.setAttribute("fill-rule", "evenodd"), u.appendChild(f), u.appendChild(h), u.appendChild(p), d.appendChild(u), t.appendChild(d);
  let g = { x: 0, y: 0, width: 0, height: 0 }, m = 1;
  function y() {
    const I = n();
    if (g = jt(I.nodes.filter((H) => !H.hidden), i.nodeOrigin), g.width === 0 && g.height === 0) {
      m = 1;
      return;
    }
    m = Math.max(
      g.width / l,
      g.height / c
    ) * If;
  }
  function b(I) {
    return typeof a == "function" ? a(I) : a;
  }
  const S = [];
  function x(I, H, V) {
    I.getAttribute(H) !== V && I.setAttribute(H, V);
  }
  function k() {
    const I = n();
    y();
    const H = (l - g.width / m) / 2, V = (c - g.height / m) / 2;
    let $ = 0;
    for (const E of I.nodes) {
      if (E.hidden) continue;
      let P = S[$];
      P || (P = document.createElementNS(ln, "rect"), P.setAttribute("rx", "2"), S[$] = P), P.parentNode !== h && h.appendChild(P);
      const F = (E.dimensions?.width ?? we) / m, W = (E.dimensions?.height ?? ve) / m, Q = (E.position.x - g.x) / m + H, G = (E.position.y - g.y) / m + V;
      x(P, "x", String(Q)), x(P, "y", String(G)), x(P, "width", String(F)), x(P, "height", String(W));
      const j = b(E);
      j ? P.style.fill !== j && (P.style.fill = j) : P.style.fill && P.style.removeProperty("fill"), $++;
    }
    for (let E = S.length - 1; E >= $; E--)
      S[E].remove();
    S.length = $, v();
  }
  function v() {
    const I = e.getViewportState ? e.getViewportState() : n();
    if (g.width === 0 && g.height === 0) {
      p.setAttribute("d", "");
      return;
    }
    const H = (l - g.width / m) / 2, V = (c - g.height / m) / 2, $ = (-I.viewport.x / I.viewport.zoom - g.x) / m + H, E = (-I.viewport.y / I.viewport.zoom - g.y) / m + V, P = I.containerWidth / I.viewport.zoom / m, F = I.containerHeight / I.viewport.zoom / m, W = `M0,0 H${l} V${c} H0 Z`, Q = `M${$},${E} h${P} v${F} h${-P} Z`;
    p.setAttribute("d", `${W} ${Q}`);
  }
  let C = !1;
  function T(I, H) {
    const V = (l - g.width / m) / 2, $ = (c - g.height / m) / 2, E = (I - V) * m + g.x, P = (H - $) * m + g.y;
    return { x: E, y: P };
  }
  function R(I) {
    const H = u.getBoundingClientRect(), V = I.clientX - H.left, $ = I.clientY - H.top, E = n(), P = T(V, $), F = -P.x * E.viewport.zoom + E.containerWidth / 2, W = -P.y * E.viewport.zoom + E.containerHeight / 2;
    o({ x: F, y: W, zoom: E.viewport.zoom });
  }
  function L(I) {
    i.minimapPannable && (C = !0, u.setPointerCapture(I.pointerId), R(I));
  }
  function D(I) {
    C && R(I);
  }
  function A(I) {
    C && (C = !1, u.releasePointerCapture(I.pointerId));
  }
  u.addEventListener("pointerdown", L), u.addEventListener("pointermove", D), u.addEventListener("pointerup", A);
  const _ = Qt(d, ["dblclick"]);
  function w(I) {
    if (!i.minimapZoomable)
      return;
    I.preventDefault();
    const H = n(), V = i.minZoom ?? 0.5, $ = i.maxZoom ?? 2, E = I.deltaY > 0 ? 0.9 : 1.1, P = Math.min(Math.max(H.viewport.zoom * E, V), $);
    o({ zoom: P });
  }
  u.addEventListener("wheel", w, { passive: !1 });
  function N() {
    u.removeEventListener("pointerdown", L), u.removeEventListener("pointermove", D), u.removeEventListener("pointerup", A), u.removeEventListener("wheel", w), _(), S.length = 0, d.remove();
  }
  function M(I, H) {
    return !(I > 0) || !(H > 0) || I === l && H === c ? !1 : (l = I, c = H, u.setAttribute("width", String(l)), u.setAttribute("height", String(c)), f.setAttribute("width", String(l)), f.setAttribute("height", String(c)), k(), !0);
  }
  return { render: k, updateViewport: v, resize: M, destroy: N };
}
const Rf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Hf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', Ff = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', ws = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Of = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', zf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', _s = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', Vf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function Bf(t, e) {
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
    onToggleFullscreen: p
  } = e, g = document.createElement("div"), m = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  l ? m.push("flow-controls-external") : m.push(`flow-controls-${n}`), g.className = m.join(" "), g.setAttribute("role", "toolbar"), g.setAttribute("aria-label", "Flow controls");
  let y = null, b = null;
  if (i) {
    const v = $t(Rf, "Zoom in", c), C = $t(Hf, "Zoom out", d);
    g.appendChild(v), g.appendChild(C);
  }
  if (r) {
    const v = $t(Ff, "Fit view", u);
    g.appendChild(v);
  }
  if (s && (y = $t(ws, "Toggle interactivity", f), g.appendChild(y)), a) {
    const v = $t(zf, "Reset panels", h);
    g.appendChild(v);
  }
  p && (b = $t(_s, "Toggle fullscreen", p), b.classList.add("flow-controls-button-fullscreen"), g.appendChild(b));
  const S = Qt(g);
  t.appendChild(g);
  function x(v) {
    if (y && typeof v.isInteractive == "boolean") {
      ri(y, v.isInteractive ? ws : Of);
      const C = v.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      y.title = C, y.setAttribute("aria-label", C);
    }
    if (b && typeof v.isFullscreen == "boolean") {
      ri(b, v.isFullscreen ? Vf : _s);
      const C = v.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      b.title = C, b.setAttribute("aria-label", C), b.classList.toggle("flow-controls-button-fullscreen--active", v.isFullscreen);
    }
  }
  function k() {
    S(), g.remove();
  }
  return { update: x, destroy: k };
}
function $t(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", ri(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function ri(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const vs = 5;
function qf(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function a(f, h, p = "partial") {
    o = f, i = h, r = f, s = h, n = !0, e.style.left = `${f}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${p}`);
  }
  function l(f, h) {
    if (!n)
      return;
    r = f, s = h;
    const p = Math.min(o, r), g = Math.min(i, s), m = Math.abs(r - o), y = Math.abs(s - i);
    e.style.left = `${p}px`, e.style.top = `${g}px`, e.style.width = `${m}px`, e.style.height = `${y}px`;
  }
  function c(f) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), p = Math.abs(s - i);
    if (h < vs && p < vs)
      return null;
    const g = Math.min(o, r), m = Math.min(i, s), y = (g - f.x) / f.zoom, b = (m - f.y) / f.zoom, S = h / f.zoom, x = p / f.zoom;
    return { x: y, y: b, width: S, height: x };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: u };
}
const bs = 3;
function Yf(t) {
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
    h * h + p * p < bs * bs || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
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
function Ai(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function Xf(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, u = a - r, f = l * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * u - p * d) / f, m = (h * c - p * l) / f;
  return g >= 0 && g <= 1 && m >= 0 && m <= 1;
}
function Wf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (Ai(s, a, t)) return !0;
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
    for (const [u, f, h, p] of l)
      if (Xf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, p))
        return !0;
  return !1;
}
function fa(t) {
  const e = t.dimensions?.width ?? we, n = t.dimensions?.height ?? ve;
  return t.rotation ? ko(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function jf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = fa(n);
    return Wf(e, o);
  });
}
function Uf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = fa(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => Ai(r.x, r.y, e));
  });
}
function Gf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function ai(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function Zf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function Kf(t, e, n) {
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
function Jf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function Qf(t, e, n) {
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
          const p = `${f.source}|${h.target}|${f.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(p) || s.has(p)) continue;
          const g = {
            id: `reconnect-${f.source}-${h.target}-${a++}`,
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
function _t(t, e, n) {
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
function vt(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && Kf(t.source, t.target, e));
}
const je = "_flowHandleValidate";
function eh(t) {
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
        typeof a == "function" ? e[je] = a : (delete e[je], requestAnimationFrame(() => {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (e[je] = l[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[je];
      });
    }
  );
}
const mt = "_flowHandleLimit";
function th(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[mt] = s : delete e[mt];
      }), r(() => {
        delete e[mt];
      });
    }
  );
}
const At = "_flowHandleConnectableStart", lt = "_flowHandleConnectableEnd";
function nh(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("start"), l = o.includes("end"), c = a || !a && !l, d = l || !a && !l;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[At] = u), d && (e[lt] = u);
      }), s(() => {
        delete e[At], delete e[lt];
      });
    }
  );
}
function Tn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function ha(t) {
  return Tn(t, t.draggable);
}
function oh(t) {
  return Tn(t, t.deletable);
}
function Ye(t) {
  return Tn(t, t.connectable);
}
function pn(t, e = !0) {
  return Tn(t, t.selectable, e);
}
function xs(t) {
  return Tn(t, t.resizable);
}
function Ut(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(a * a + l * l), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), p = n - a / u * h, g = o - l / u * h, m = n + c / f * h, y = o + d / f * h;
  return `L${p},${g} Q${n},${o} ${m},${y}`;
}
function An({
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
function zn(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function ih({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * zn(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * zn(
    n === "bottom" ? i - e : e - i,
    s
  ), u = l ? o + (r === "right" ? 1 : -1) * zn(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = l ? i : i + (r === "bottom" ? 1 : -1) * zn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function fo(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = ih(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = An({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function hw({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: a, offsetX: l, offsetY: c } = An({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: a },
    labelOffsetX: l,
    labelOffsetY: c
  };
}
function Es(t) {
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
function sh(t, e, n, o, i, r, s) {
  const a = Es(n), l = Es(r), c = t + a.x * s, d = e + a.y * s, u = o + l.x * s, f = i + l.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const g = (c + u) / 2, m = (d + f) / 2;
    return h ? [
      [c, e],
      [g, e],
      [g, i],
      [u, i]
    ] : [
      [t, d],
      [t, m],
      [o, m],
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
function Sn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: a = 10
}) {
  const l = sh(
    t,
    e,
    n,
    o,
    i,
    r,
    a
  );
  let c = `M${t},${e}`;
  for (let p = 0; p < l.length; p++) {
    const [g, m] = l[p];
    if (s > 0 && p > 0 && p < l.length - 1) {
      const [y, b] = p === 1 ? [t, e] : l[p - 1], [S, x] = l[p + 1];
      c += ` ${Ut(y, b, g, m, S, x, s)}`;
    } else
      c += ` L${g},${m}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = An({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function rh(t) {
  return Sn({ ...t, borderRadius: 0 });
}
function ga({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: a, offsetY: l } = An({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: a,
    labelOffsetY: l
  };
}
const ut = 40;
function ah(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < ut && s >= 0 ? i = -o * (1 - s / ut) : a < ut && a >= 0 && (i = o * (1 - a / ut)), l < ut && l >= 0 ? r = -o * (1 - l / ut) : c < ut && c >= 0 && (r = o * (1 - c / ut)), { dx: i, dy: r };
}
function pa(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = ah(r, s, c, n);
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
function Gt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || ta : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || En),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(bf),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? xf
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
    let p;
    switch (e) {
      case "bezier": {
        p = fo({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = Sn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        p = rh({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        p = ga({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
    }
    r.setAttribute("d", p);
  }
  function a() {
    i.remove();
  }
  return { svg: i, update: s, destroy: a };
}
function kn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let a = null, l = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !Ye(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
      const f = t.cursorFlowPos.x - d.flowX, h = t.cursorFlowPos.y - d.flowY, p = Math.sqrt(f * f + h * h);
      p < c && (c = p, a = d.el, l = { x: d.flowX, y: d.flowY });
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
      const p = t.getNode(c);
      if (p && !Ye(p)) return;
    }
    const d = t.handleType === "target" ? lt : At;
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
function Lo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = pa({
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
function lh(t, e, n, o) {
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
function ma(t, e) {
  const n = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), r = t.querySelectorAll("[data-flow-handle-type]");
  for (const l of r) {
    const c = l.closest("[data-flow-node-id]");
    if (!c) continue;
    let d = i.get(c);
    if (d === void 0 && (d = c.dataset.flowNodeId ?? null, i.set(c, d)), !d) continue;
    const u = l.getBoundingClientRect();
    if (u.width === 0 && u.height === 0) continue;
    const f = l.dataset.flowHandleType, h = e(u.left + u.width / 2, u.top + u.height / 2), p = {
      el: l,
      nodeId: d,
      handleId: l.dataset.flowHandleId ?? f,
      type: f,
      isMirror: l.classList.contains("flow-schema-handle--mirror"),
      flowX: h.x,
      flowY: h.y,
      connectableStart: l[At] !== !1,
      connectableEnd: l[lt] !== !1,
      hasValidator: l[je] != null,
      limit: l[mt] ?? null
    };
    n.push(p);
    const g = `${d}|${p.handleId}|${f}`, m = o.get(g);
    (!m || m.isMirror && !p.isMirror) && o.set(g, p);
  }
  const s = n.filter((l) => l.type === "source"), a = n.filter((l) => l.type === "target");
  return {
    all: n,
    byType: (l) => l === "source" ? s : a,
    get: (l, c, d) => o.get(`${l}|${c}|${d}`)
  };
}
let mn = 0;
const Vn = /* @__PURE__ */ new WeakMap();
function it(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[je] && !r[je](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[je] && !r[je](e))
      return !1;
  }
  return !0;
}
function st(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[mt] && n.filter(
      (l) => l.source === e.source && (l.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[mt])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[mt] && n.filter(
      (l) => l.target === e.target && (l.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[mt])
      return !1;
  }
  return !0;
}
function Ln(t, e, n, o, i, r) {
  if (t.classList.add("flow-connecting"), !r) {
    ch(t, e, n, o, i);
    return;
  }
  const s = lh(o, e, n, i), a = r.get(e, n, "source"), l = a?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= a.limit, c = [];
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
    let g = h && !l;
    g && p.limit != null && (g = (s.targetCounts.get(`${d.nodeId}|${d.handleId}`) ?? 0) < p.limit);
    let m = g;
    m && a?.hasValidator && (m = !!a.el[je](u)), m && p.hasValidator && (m = !!p.el[je](u));
    const y = m && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: y, limitHit: h && !g });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function ch(t, e, n, o, i) {
  const r = i ? o.edges.filter((a) => a.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const a of s) {
    const c = a.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = a.dataset.flowHandleId ?? "target";
    if (a[lt] === !1) {
      a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && vt(u, r, { preventCycles: o._config?.preventCycles }), p = h && st(t, u, r);
    p && it(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (a.classList.add("flow-handle-valid"), a.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid"), h && !p ? a.classList.add("flow-handle-limit-reached") : a.classList.remove("flow-handle-limit-reached"));
  }
}
function Le(t) {
  t.classList.remove("flow-connecting");
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function Pt(t, e) {
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
async function Mo(t, e, n, o, i, r) {
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
async function ya(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), a = (c) => (Ne(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!vt(n, s, { preventCycles: o._config?.preventCycles }) || !_t(n, o._config?.connectionRules, o._nodeMap) || !st(i, n, s) || !it(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return a();
  const l = o._config?.connectValidator;
  if (l) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = Po(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await Mo(
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
async function wa(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ne(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Ye(s) || !vt(e, i, { preventCycles: n._config?.preventCycles }) || !_t(e, n._config?.connectionRules, n._nodeMap) || !st(o, e, i) || !it(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const a = n._config?.connectValidator;
  if (a) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = Po(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await Mo(
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${mn++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function Po(t, e) {
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
const yt = /* @__PURE__ */ new WeakMap();
function _a(t, e, n) {
  n.preventDefault(), n.stopPropagation();
  const o = t.dataset.flowHandleId ?? "source", i = t.closest("[x-flow-node]");
  if (!e || !i || e._animationLocked) return;
  const r = i.dataset.flowNodeId;
  if (!r) return;
  const s = e.getNode(r);
  if (s && !Ye(s) || t[At] === !1) return;
  const a = n.clientX, l = n.clientY;
  let c = !1;
  if (e.pendingConnection && e._config?.connectOnClick !== !1) {
    e._emit("connect-end", {
      connection: null,
      source: e.pendingConnection.source,
      sourceHandle: e.pendingConnection.sourceHandle,
      position: { x: 0, y: 0 }
    }), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
    const D = t.closest(".flow-container");
    D && Le(D);
  }
  let d = null, u = null, f = null, h = null, p = null;
  const g = e._config?.connectionSnapRadius ?? 20, m = t.closest(".flow-container");
  let y = null, b = 0, S = 0, x = !1, k = /* @__PURE__ */ new Map();
  const v = () => {
    if (c = !0, B("connection", `Connection drag started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), !m) return;
    u = Gt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: m
    }), d = u.svg;
    const D = t.getBoundingClientRect(), A = m.getBoundingClientRect(), _ = e._viewportLive ?? e.viewport, w = _?.zoom || 1, N = _?.x || 0, M = _?.y || 0;
    b = (D.left + D.width / 2 - A.left - N) / w, S = (D.top + D.height / 2 - A.top - M) / w, u.update({ fromX: b, fromY: S, toX: b, toY: S, source: r, sourceHandle: o });
    const I = m.querySelector(".flow-viewport");
    if (I && I.appendChild(d), e.pendingConnection = {
      source: r,
      sourceHandle: o,
      position: { x: b, y: S }
    }, h = Lo(m, e, a, l), y = ma(
      m,
      (H, V) => e.screenToFlowPosition(H, V)
    ), Ln(m, r, o, e, void 0, y), e._config?.onEdgeDrop) {
      const H = e._config.edgeDropPreview, $ = H ? H({ source: r, sourceHandle: o }) : "New Node";
      if ($ !== null) {
        p = document.createElement("div"), p.className = "flow-ghost-node";
        const E = document.createElement("div");
        if (E.className = "flow-ghost-handle", p.appendChild(E), typeof $ == "string") {
          const F = document.createElement("span");
          F.textContent = $, p.appendChild(F);
        } else
          p.appendChild($);
        p.style.left = `${b}px`, p.style.top = `${S}px`;
        const P = m.querySelector(".flow-viewport");
        P && P.appendChild(p);
      }
    }
  }, C = () => {
    const D = [...e.selectedNodes], A = [], _ = m.getBoundingClientRect(), w = e._viewportLive ?? e.viewport, N = w?.zoom || 1, M = w?.x || 0, I = w?.y || 0;
    for (const H of D) {
      if (H === r) continue;
      const $ = m?.querySelector(`[data-flow-node-id="${CSS.escape(H)}"]`)?.querySelector('[data-flow-handle-type="source"]');
      if (!$) continue;
      const E = $.getBoundingClientRect();
      A.push({
        nodeId: H,
        handleId: $.dataset.flowHandleId ?? "source",
        pos: {
          x: (E.left + E.width / 2 - _.left - M) / N,
          y: (E.top + E.height / 2 - _.top - I) / N
        }
      });
    }
    return A;
  }, T = (D) => {
    x = !0, u && (k.set(r, {
      line: u,
      sourceNodeId: r,
      sourceHandleId: o,
      sourcePos: { x: b, y: S },
      valid: !0
    }), u = null);
    const A = C(), _ = m.querySelector(".flow-viewport");
    for (const w of A) {
      const N = Gt({
        connectionLineType: e._config?.connectionLineType,
        connectionLineStyle: e._config?.connectionLineStyle,
        connectionLine: e._config?.connectionLine,
        containerEl: m
      });
      N.update({
        fromX: w.pos.x,
        fromY: w.pos.y,
        toX: D.x,
        toY: D.y,
        source: w.nodeId,
        sourceHandle: w.handleId
      }), _ && _.appendChild(N.svg), k.set(w.nodeId, {
        line: N,
        sourceNodeId: w.nodeId,
        sourceHandleId: w.handleId,
        sourcePos: w.pos,
        valid: !0
      });
    }
  }, R = (D) => {
    if (!c) {
      const w = D.clientX - a, N = D.clientY - l;
      if (Math.abs(w) >= ao || Math.abs(N) >= ao) {
        if (v(), e._config?.multiConnect && e.selectedNodes.size > 1 && e.selectedNodes.has(r)) {
          const M = e.screenToFlowPosition(D.clientX, D.clientY);
          T(M);
        }
      } else
        return;
    }
    const A = e.screenToFlowPosition(D.clientX, D.clientY);
    if (x) {
      const w = kn({
        containerEl: m,
        handleType: "target",
        excludeNodeId: r,
        cursorFlowPos: A,
        connectionSnapRadius: g,
        getNode: (V) => e.getNode(V),
        toFlowPosition: (V, $) => e.screenToFlowPosition(V, $),
        connectionMode: e._config?.connectionMode,
        index: y ?? void 0
      });
      w.element !== f && (f?.classList.remove("flow-handle-active"), w.element?.classList.add("flow-handle-active"), f = w.element);
      const M = w.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, I = w.element?.dataset.flowHandleId ?? "target", H = e._config?.connectionLineStyle?.stroke ?? (getComputedStyle(m).getPropertyValue("--flow-edge-stroke-selected").trim() || En);
      for (const V of k.values())
        if (V.line.update({
          fromX: V.sourcePos.x,
          fromY: V.sourcePos.y,
          toX: w.position.x,
          toY: w.position.y,
          source: V.sourceNodeId,
          sourceHandle: V.sourceHandleId
        }), w.element && M) {
          const $ = {
            source: V.sourceNodeId,
            sourceHandle: V.sourceHandleId,
            target: M,
            targetHandle: I
          }, G = e.getNode(M)?.connectable !== !1 && V.sourceNodeId !== M && vt($, e.edges, { preventCycles: e._config?.preventCycles }) && _t($, e._config?.connectionRules, e._nodeMap) && st(m, $, e.edges) && it(m, $) && (!e._config?.isValidConnection || e._config.isValidConnection($));
          V.valid = G;
          const j = V.line.svg.querySelector("path");
          if (j)
            if (G)
              j.setAttribute("stroke", H);
            else {
              const Z = getComputedStyle(m).getPropertyValue("--flow-connection-line-invalid").trim() || ta;
              j.setAttribute("stroke", Z);
            }
        } else {
          V.valid = !0;
          const $ = V.line.svg.querySelector("path");
          $ && $.setAttribute("stroke", H);
        }
      e.pendingConnection = { ...e.pendingConnection, position: w.position }, h?.updatePointer(D.clientX, D.clientY);
      return;
    }
    const _ = kn({
      containerEl: m,
      handleType: "target",
      excludeNodeId: r,
      cursorFlowPos: A,
      connectionSnapRadius: g,
      getNode: (w) => e.getNode(w),
      toFlowPosition: (w, N) => e.screenToFlowPosition(w, N),
      index: y ?? void 0
    });
    _.element !== f && (f?.classList.remove("flow-handle-active"), _.element?.classList.add("flow-handle-active"), f = _.element), p ? _.element ? (p.style.display = "none", u?.update({ fromX: b, fromY: S, toX: _.position.x, toY: _.position.y, source: r, sourceHandle: o })) : (p.style.display = "", p.style.left = `${A.x}px`, p.style.top = `${A.y}px`, u?.update({ fromX: b, fromY: S, toX: A.x, toY: A.y, source: r, sourceHandle: o })) : u?.update({ fromX: b, fromY: S, toX: _.position.x, toY: _.position.y, source: r, sourceHandle: o }), e.pendingConnection = { ...e.pendingConnection, position: _.position }, h?.updatePointer(D.clientX, D.clientY);
  }, L = async (D) => {
    if (h?.stop(), h = null, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), yt.delete(t), y = null, e._connectValidating) return;
    if (x) {
      const N = e.screenToFlowPosition(D.clientX, D.clientY);
      let M = f;
      M || (M = document.elementFromPoint(D.clientX, D.clientY)?.closest('[data-flow-handle-type="target"]'));
      const H = M?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, V = M?.dataset.flowHandleId ?? "target", $ = [], E = [], P = [], F = [];
      if (M && H) {
        const W = e.getNode(H);
        for (const Q of k.values()) {
          const G = {
            source: Q.sourceNodeId,
            sourceHandle: Q.sourceHandleId,
            target: H,
            targetHandle: V
          };
          if (W?.connectable !== !1 && Q.sourceNodeId !== H && vt(G, e.edges, { preventCycles: e._config?.preventCycles }) && _t(G, e._config?.connectionRules, e._nodeMap) && st(m, G, e.edges) && it(m, G) && (!e._config?.isValidConnection || e._config.isValidConnection(G))) {
            const K = `e-${Q.sourceNodeId}-${H}-${Date.now()}-${mn++}`;
            $.push({ id: K, ...G }), E.push(G), F.push(Q);
          } else
            P.push(Q);
        }
      } else
        P.push(...k.values());
      for (const W of F)
        W.line.destroy();
      if ($.length > 0) {
        e.addEdges($);
        for (const W of E)
          e._emit("connect", { connection: W });
        e._emit("multi-connect", { connections: E });
      }
      P.length > 0 && setTimeout(() => {
        for (const W of P)
          W.line.destroy();
      }, 100), f?.classList.remove("flow-handle-active"), e._emit("connect-end", {
        connection: E.length > 0 ? E[0] : null,
        source: r,
        sourceHandle: o,
        position: N
      }), k.clear(), x = !1, Le(m), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
      return;
    }
    if (!c) {
      e._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), e.pendingConnection = {
        source: r,
        sourceHandle: o,
        position: { x: 0, y: 0 }
      }, Ln(m, r, o, e, void 0, y ?? void 0));
      return;
    }
    const A = u?.svg ?? null;
    p?.remove(), p = null, f?.classList.remove("flow-handle-active"), Le(m);
    const _ = e.screenToFlowPosition(D.clientX, D.clientY), w = { source: r, sourceHandle: o, position: _ };
    try {
      let N = f;
      if (N || (N = document.elementFromPoint(D.clientX, D.clientY)?.closest('[data-flow-handle-type="target"]')), N) {
        const I = N.closest("[x-flow-node]")?.dataset.flowNodeId, H = N.dataset.flowHandleId ?? "target";
        if (I) {
          if (N[lt] === !1) {
            B("connection", "Connection rejected (handle not connectable end)"), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const V = e.getNode(I);
          if (V && !Ye(V)) {
            B("connection", `Connection rejected (target "${I}" not connectable)`), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const $ = {
            source: r,
            sourceHandle: o,
            target: I,
            targetHandle: H
          };
          if (vt($, e.edges, { preventCycles: e._config?.preventCycles })) {
            if (!_t($, e._config?.connectionRules, e._nodeMap)) {
              B("connection", "Connection rejected (connection rules)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!st(m, $, e.edges)) {
              B("connection", "Connection rejected (handle limit)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!it(m, $)) {
              B("connection", "Connection rejected (per-handle validator)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (e._config?.isValidConnection && !e._config.isValidConnection($)) {
              B("connection", "Connection rejected (custom validator)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            const E = e._config?.connectValidator;
            if (E) {
              const F = e._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: W, targetEl: Q } = Po(m, $);
              e._connectValidating = !0, Pt(A, !0);
              let G;
              try {
                G = await Mo(
                  E,
                  $,
                  W,
                  Q,
                  m,
                  F
                );
              } finally {
                e._connectValidating = !1, Pt(A, !1);
              }
              if (!G.allowed) {
                B("connection", "Connection rejected (async connectValidator)", { connection: $, reason: G.reason }), Ne(m, { ...$, reason: G.reason }), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
                return;
              }
            }
            const P = `e-${r}-${I}-${Date.now()}-${mn++}`;
            e.addEdges({ id: P, ...$ }), B("connection", `Connection created: ${r} → ${I}`, $), e._emit("connect", { connection: $ }), e._emit("connect-end", { connection: $, ...w });
          } else
            B("connection", "Connection rejected (invalid)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w });
        } else
          e._emit("connect-end", { connection: null, ...w });
      } else if (e._config?.onEdgeDrop) {
        const M = {
          x: _.x - we / 2,
          y: _.y - ve / 2
        }, I = e._config.onEdgeDrop({
          source: r,
          sourceHandle: o,
          position: M
        });
        if (I) {
          const H = {
            source: r,
            sourceHandle: o,
            target: I.id,
            targetHandle: "target"
          };
          if (!st(m, H, e.edges))
            B("connection", "Edge drop: connection rejected (handle limit)"), e._emit("connect-end", { connection: null, ...w });
          else if (!it(m, H))
            B("connection", "Edge drop: connection rejected (per-handle validator)"), e._emit("connect-end", { connection: null, ...w });
          else if (!e._config.isValidConnection || e._config.isValidConnection(H)) {
            e.addNodes(I);
            const V = `e-${r}-${I.id}-${Date.now()}-${mn++}`;
            e.addEdges({ id: V, ...H }), B("connection", `Edge drop: created node "${I.id}" and edge`, H), e._emit("connect", { connection: H }), e._emit("connect-end", { connection: H, ...w });
          } else
            B("connection", "Edge drop: connection rejected by validator"), e._emit("connect-end", { connection: null, ...w });
        } else
          B("connection", "Edge drop: callback returned null"), e._emit("connect-end", { connection: null, ...w });
      } else
        B("connection", "Connection cancelled (no target)"), e._emit("connect-end", { connection: null, ...w });
    } finally {
      Pt(A, !1), u?.destroy(), u = null;
    }
    e.pendingConnection = null;
  };
  document.addEventListener("pointermove", R), document.addEventListener("pointerup", L), document.addEventListener("pointercancel", L), yt.set(t, () => {
    document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), h?.stop(), u?.destroy(), u = null, p?.remove(), p = null;
    for (const D of k.values())
      D.line.destroy();
    k.clear(), x = !1, f?.classList.remove("flow-handle-active"), Le(m), y = null, e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
  });
}
function va(t, e, n) {
  if (n.button !== 0) return;
  const o = t.dataset.flowHandleId ?? "target", r = t.closest("[x-flow-node]")?.getAttribute("data-flow-node-id") ?? null;
  if (!e || !r || e._animationLocked || e._config?.edgesReconnectable === !1 || e._pendingReconnection) return;
  const s = e.edges.filter(
    ($) => $.target === r && ($.targetHandle ?? "target") === o
  );
  if (s.length === 0) return;
  const a = s.find(($) => $.selected) ?? (s.length === 1 ? s[0] : null);
  if (!a) return;
  const l = a.reconnectable ?? !0;
  if (l === !1 || l === "source") return;
  n.preventDefault(), n.stopPropagation();
  const c = n.clientX, d = n.clientY;
  let u = !1, f = !1, h = null;
  const p = e._config?.connectionSnapRadius ?? 20, g = t.closest(".flow-container");
  if (!g) return;
  const m = g.querySelector(
    `[data-flow-node-id="${CSS.escape(a.source)}"]`
  ), y = a.sourceHandle ? `[data-flow-handle-id="${CSS.escape(a.sourceHandle)}"]` : '[data-flow-handle-type="source"]', b = m?.querySelector(y), S = g.getBoundingClientRect(), x = e._viewportLive ?? e.viewport, k = x?.zoom || 1, v = x?.x || 0, C = x?.y || 0;
  let T, R;
  if (b) {
    const $ = b.getBoundingClientRect();
    T = ($.left + $.width / 2 - S.left - v) / k, R = ($.top + $.height / 2 - S.top - C) / k;
  } else {
    const $ = e.getNode(a.source);
    if (!$) return;
    const E = $.dimensions?.width ?? we, P = $.dimensions?.height ?? ve;
    T = $.position.x + E / 2, R = $.position.y + P;
  }
  let L = null, D = null, A = null, _ = c, w = d, N = null;
  const M = () => {
    u = !0;
    const $ = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    $ && $.classList.add("flow-edge-reconnecting"), e._emit("reconnect-start", { edge: a, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${a.id}"`), D = Gt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: g
    }), L = D.svg;
    const E = e.screenToFlowPosition(c, d);
    D.update({
      fromX: T,
      fromY: R,
      toX: E.x,
      toY: E.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    });
    const P = g.querySelector(".flow-viewport");
    P && P.appendChild(L), e.pendingConnection = {
      source: a.source,
      sourceHandle: a.sourceHandle,
      position: E
    }, e._pendingReconnection = {
      edge: a,
      draggedEnd: "target",
      anchorPosition: { x: T, y: R },
      position: E
    }, A = Lo(g, e, _, w), N = ma(
      g,
      (F, W) => e.screenToFlowPosition(F, W)
    ), Ln(g, a.source, a.sourceHandle ?? "source", e, a.id, N);
  }, I = ($) => {
    if (_ = $.clientX, w = $.clientY, !u) {
      Math.sqrt(
        ($.clientX - c) ** 2 + ($.clientY - d) ** 2
      ) >= ao && M();
      return;
    }
    const E = e.screenToFlowPosition($.clientX, $.clientY), P = kn({
      containerEl: g,
      handleType: "target",
      excludeNodeId: a.source,
      cursorFlowPos: E,
      connectionSnapRadius: p,
      getNode: (F) => e.getNode(F),
      toFlowPosition: (F, W) => e.screenToFlowPosition(F, W),
      index: N ?? void 0
    });
    P.element !== h && (h?.classList.remove("flow-handle-active"), P.element?.classList.add("flow-handle-active"), h = P.element), D?.update({
      fromX: T,
      fromY: R,
      toX: P.position.x,
      toY: P.position.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    }), e.pendingConnection && (e.pendingConnection = {
      ...e.pendingConnection,
      position: P.position
    }), e._pendingReconnection && (e._pendingReconnection = {
      ...e._pendingReconnection,
      position: P.position
    }), A?.updatePointer($.clientX, $.clientY);
  }, H = () => {
    if (f) return;
    f = !0, document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", V), document.removeEventListener("pointercancel", V), A?.stop(), A = null, D?.destroy(), D = null, L = null, N = null, h?.classList.remove("flow-handle-active"), yt.delete(t);
    const $ = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    $ && $.classList.remove("flow-edge-reconnecting"), Le(g), e.pendingConnection = null, e._pendingReconnection = null;
  }, V = async ($) => {
    if (!u) {
      H();
      return;
    }
    if (e._connectValidating) return;
    let E = h;
    E || (E = document.elementFromPoint($.clientX, $.clientY)?.closest('[data-flow-handle-type="target"]'));
    let P = !1;
    if (E) {
      const W = E.closest("[x-flow-node]")?.dataset.flowNodeId, Q = E.dataset.flowHandleId;
      if (W && e.getNode(W)?.connectable !== !1) {
        const j = {
          source: a.source,
          sourceHandle: a.sourceHandle,
          target: W,
          targetHandle: Q
        }, Z = { ...a }, O = D?.svg ?? null;
        Pt(O, !0);
        let q;
        try {
          q = await ya({
            edge: a,
            newConnection: j,
            canvas: e,
            containerEl: g,
            endpoint: "target"
          });
        } finally {
          Pt(O, !1);
        }
        q.applied ? (P = !0, B("reconnect", `Edge "${a.id}" reconnected (target)`, j), e._emit("reconnect", { oldEdge: Z, newConnection: j })) : B("reconnect", "Reconnection rejected", { connection: j, reason: q.reason });
      }
    }
    P || B("reconnect", `Edge "${a.id}" reconnection cancelled — snapping back`), e._emit("reconnect-end", { edge: a, successful: P }), H();
  };
  document.addEventListener("pointermove", I), document.addEventListener("pointerup", V), document.addEventListener("pointercancel", V), yt.set(t, H);
}
function dh(t, e, n) {
  t.dataset.flowHandleType === "source" ? _a(t, e, n) : va(t, e, n);
}
function Cs(t) {
  return t?._config?.delegatedHandleEvents === !1;
}
function uh(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let p;
      c && u ? p = "top-left" : c && f ? p = "top-right" : d && u ? p = "bottom-left" : d && f ? p = "bottom-right" : c ? p = "top" : f ? p = "right" : d ? p = "bottom" : u ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let g, m = !1;
      if (i) {
        const k = r(i);
        k && typeof k == "object" && !Array.isArray(k) ? (g = k.id || e.getAttribute("data-flow-handle-id") || l, k.position && (p = k.position, m = !0)) : g = k || e.getAttribute("data-flow-handle-id") || l;
      } else
        g = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), m && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const k = r(i);
        k && typeof k == "object" && !Array.isArray(k) && k.position && (e.dataset.flowHandlePosition = k.position);
      })), !h && !m) {
        const k = () => {
          const C = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!C) return;
          const T = e.closest("[x-data]");
          return T ? t.$data(T)?.getNode?.(C) : void 0;
        };
        s(() => {
          const v = k();
          if (!v) return;
          const C = l === "source" ? v.sourcePosition : v.targetPosition;
          C && (e.dataset.flowHandlePosition = C);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const y = () => {
        const k = e.closest("[x-flow-node]");
        return k ? k.getAttribute("data-flow-node-id") ?? null : null;
      }, b = () => {
        const k = e.closest("[x-data]");
        return k ? t.$data(k) : null;
      }, S = b();
      let x = null;
      if (S?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${l} handle ${g}`);
        const k = (T) => {
          const R = T?._pendingKeyboardConnect;
          if (!R) return;
          const L = e.closest(".flow-container");
          L && L.querySelector(
            `[data-flow-node-id="${CSS.escape(R.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(R.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), T && (T._pendingKeyboardConnect = null);
        }, v = (T) => {
          if (!(T.key === "Enter" || T.key === " " || T.key === "Spacebar")) return;
          const L = b();
          if (!L || L._animationLocked) return;
          const D = y();
          if (D)
            if (l === "source") {
              const A = L.getNode?.(D);
              if (A && !Ye(A) || e[At] === !1) return;
              T.preventDefault(), T.stopPropagation(), k(L), L._pendingKeyboardConnect = {
                sourceNodeId: D,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), L._announcer?.announce?.(`Connecting from ${l} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!L._pendingKeyboardConnect) return;
              const A = L.getNode?.(D);
              if (A && !Ye(A) || e[lt] === !1) return;
              T.preventDefault(), T.stopPropagation();
              const { sourceNodeId: _, sourceHandleId: w } = L._pendingKeyboardConnect, N = {
                source: _,
                sourceHandle: w,
                target: D,
                targetHandle: g
              }, M = e.closest(".flow-container");
              if (k(L), !M) return;
              wa({ connection: N, canvas: L, containerEl: M }).then((I) => {
                I.applied && L._announcer?.announce?.(`Connected ${_} to ${D}.`);
              });
            }
        };
        e.addEventListener("keydown", v);
        const C = e.closest(".flow-container");
        if (C) {
          const T = Vn.get(C);
          if (T)
            T.count += 1;
          else {
            const R = (L) => {
              if (L.key !== "Escape") return;
              const D = C.matches("[x-data]") ? C : C.closest("[x-data]") ?? C.querySelector("[x-data]");
              if (!D) return;
              const A = t.$data(D);
              A?._pendingKeyboardConnect && k(A);
            };
            C.addEventListener("keydown", R), Vn.set(C, { count: 1, handler: R });
          }
        }
        x = () => {
          if (e.removeEventListener("keydown", v), C) {
            const T = Vn.get(C);
            T && (T.count -= 1, T.count <= 0 && (C.removeEventListener("keydown", T.handler), Vn.delete(C)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (l === "source") {
        const k = (T) => {
          _a(e, b(), T);
        };
        Cs(S) && e.addEventListener("pointerdown", k);
        const v = () => {
          const T = b();
          if (!T?._pendingReconnection || T._pendingReconnection.draggedEnd !== "source") return;
          const R = y();
          if (R) {
            const L = T.getNode(R);
            if (L && !Ye(L)) return;
          }
          e[At] !== !1 && e.classList.add("flow-handle-active");
        }, C = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", v), e.addEventListener("pointerleave", C), a(() => {
          yt.get(e)?.(), yt.delete(e), x?.(), e.removeEventListener("pointerdown", k), e.removeEventListener("pointerenter", v), e.removeEventListener("pointerleave", C), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const k = () => {
          const R = b();
          if (!R?.pendingConnection) return;
          const L = y();
          if (L) {
            const D = R.getNode(L);
            if (D && !Ye(D)) return;
          }
          e[lt] !== !1 && e.classList.add("flow-handle-active");
        }, v = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", k), e.addEventListener("pointerleave", v);
        const C = async (R) => {
          const L = b();
          if (!L?.pendingConnection || L._config?.connectOnClick === !1 || L._connectValidating) return;
          R.preventDefault(), R.stopPropagation();
          const D = y();
          if (!D) return;
          if (e[lt] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), L._emit("connect-end", { connection: null, source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
            const M = e.closest(".flow-container");
            M && Le(M);
            return;
          }
          const A = L.getNode(D);
          if (A && !Ye(A)) {
            B("connection", `Click-to-connect rejected (target "${D}" not connectable)`), L._emit("connect-end", { connection: null, source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
            const M = e.closest(".flow-container");
            M && Le(M);
            return;
          }
          const _ = {
            source: L.pendingConnection.source,
            sourceHandle: L.pendingConnection.sourceHandle,
            target: D,
            targetHandle: g
          }, w = { source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (vt(_, L.edges, { preventCycles: L._config?.preventCycles })) {
            const M = e.closest(".flow-container");
            if (!_t(_, L._config?.connectionRules, L._nodeMap)) {
              B("connection", "Click-to-connect rejected (connection rules)", _), Ne(M, _), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Le(M);
              return;
            }
            if (M && !st(M, _, L.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", _), Ne(M, _), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), Le(M);
              return;
            }
            if (M && !it(M, _)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", _), Ne(M, _), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Le(M);
              return;
            }
            if (L._config?.isValidConnection && !L._config.isValidConnection(_)) {
              B("connection", "Click-to-connect rejected (custom validator)", _), Ne(M, _), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Le(M);
              return;
            }
            const I = L._config?.connectValidator;
            if (I && M) {
              const V = L._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: $, targetEl: E } = Po(M, _);
              L._connectValidating = !0;
              let P;
              try {
                P = await Mo(
                  I,
                  _,
                  $,
                  E,
                  M,
                  V
                );
              } finally {
                L._connectValidating = !1;
              }
              if (!P.allowed) {
                B("connection", "Click-to-connect rejected (async connectValidator)", { connection: _, reason: P.reason }), Ne(M, { ..._, reason: P.reason }), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), Le(M);
                return;
              }
            }
            const H = `e-${_.source}-${_.target}-${Date.now()}-${mn++}`;
            L.addEdges({ id: H, ..._ }), B("connection", `Click-to-connect: ${_.source} → ${_.target}`, _), L._emit("connect", { connection: _ }), L._emit("connect-end", { connection: _, ...w });
          } else {
            B("connection", "Click-to-connect rejected (invalid)", _);
            const M = e.closest(".flow-container");
            Ne(M, _), L._emit("connect-end", { connection: null, ...w });
          }
          L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
          const N = e.closest(".flow-container");
          N && Le(N);
        };
        e.addEventListener("click", C);
        const T = (R) => {
          va(e, b(), R);
        };
        Cs(S) && e.addEventListener("pointerdown", T), a(() => {
          yt.get(e)?.(), yt.delete(e), x?.(), e.removeEventListener("pointerdown", T), e.removeEventListener("pointerenter", k), e.removeEventListener("pointerleave", v), e.removeEventListener("click", C), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
function Ss(t, e) {
  const n = (o) => {
    const r = o.target?.closest?.("[data-flow-handle-type]");
    r && t.contains(r) && (e?._container && r.closest(".flow-container") !== e._container || dh(r, e, o));
  };
  return t.addEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", n, !0);
}
const ks = {
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
function fh(t) {
  if (!t) return { ...ks };
  const e = { ...ks };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ke(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function hh(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function gh(t) {
  const e = t;
  if (!e) return !1;
  if (e.isContentEditable) return !0;
  const n = e.tagName;
  return n === "INPUT" || n === "TEXTAREA" || n === "SELECT";
}
function bt(t, e) {
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
function li(t, e = !0) {
  return t.selectable ?? e;
}
function ph(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, a = 0, l = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), l = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(f) {
    const h = f.clientX - s, p = f.clientY - a;
    h * h + p * p > i * i && c();
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
const Ls = 12;
function mh(t) {
  return t ? t === !0 ? Ls : t.channelGap ?? Ls : null;
}
function ba(t) {
  let e = null, n = 0;
  for (let o = 1; o < t.length - 2; o++) {
    const i = t[o], r = t[o + 1], s = i.y === r.y, a = i.x === r.x;
    if (!s && !a) continue;
    const l = Math.abs(s ? r.x - i.x : r.y - i.y);
    l <= n || (n = l, e = s ? { axis: "h", at: i.y, from: Math.min(i.x, r.x), to: Math.max(i.x, r.x), i: o, j: o + 1 } : { axis: "v", at: i.x, from: Math.min(i.y, r.y), to: Math.max(i.y, r.y), i: o, j: o + 1 });
  }
  return e;
}
function yh(t, e, n) {
  return t.axis !== e.axis || Math.abs(t.at - e.at) > n ? !1 : t.from <= e.to && e.from <= t.to;
}
function wh(t, e) {
  const n = [], o = /* @__PURE__ */ new Set();
  for (let i = 0; i < t.length; i++) {
    if (o.has(i)) continue;
    const r = [t[i]];
    o.add(i);
    let s = !0;
    for (; s; ) {
      s = !1;
      for (let a = 0; a < t.length; a++)
        o.has(a) || r.some((l) => yh(l.run, t[a].run, e)) && (r.push(t[a]), o.add(a), s = !0);
    }
    n.push(r);
  }
  return n;
}
function _h(t, e) {
  const n = /* @__PURE__ */ new Map(), o = [...t].sort((r, s) => r.bary - s.bary || (r.edgeId < s.edgeId ? -1 : 1)), i = o.length;
  return o.forEach((r, s) => n.set(r.edgeId, (s - (i - 1) / 2) * e)), n;
}
function vh(t, e, n) {
  if (n === 0) return t.map((i) => ({ ...i }));
  const o = t.map((i) => ({ ...i }));
  return e.axis === "h" ? (o[e.i].y += n, o[e.j].y += n) : (o[e.i].x += n, o[e.j].x += n), o;
}
function xa(t, e, n) {
  if (!e) return t;
  const o = ba(t);
  if (!o) return t;
  const i = vh(t, o, e);
  return n && bh(i, n, pt) ? t : i;
}
function bh(t, e, n) {
  for (let o = 0; o < t.length - 1; o++) {
    const i = t[o], r = t[o + 1], s = Math.min(i.x, r.x), a = Math.max(i.x, r.x), l = Math.min(i.y, r.y), c = Math.max(i.y, r.y);
    for (const d of e) {
      const u = d.x - n, f = d.y - n, h = d.x + d.width + n, p = d.y + d.height + n;
      if (s < h && a > u && l < p && c > f) return !0;
    }
  }
  return !1;
}
const pt = 20, Bn = pt + 1, Ea = 1, Ca = 0.5, xh = `b${Ea}d${Ca}`;
function Ms(t) {
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
function Ps(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Eh(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Sa(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function ka(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function Ch(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const a = Array.from(r).sort((u, f) => u - f), l = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of a)
    for (const f of l) {
      let h = !1;
      for (const p of i)
        if (Eh(u, f, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class Sh {
  constructor(e) {
    this.less = e, this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(e) {
    this.items.push(e);
    let n = this.items.length - 1;
    for (; n > 0; ) {
      const o = n - 1 >> 1;
      if (!this.less(this.items[n], this.items[o])) break;
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
        if (r < this.items.length && this.less(this.items[r], this.items[a]) && (a = r), s < this.items.length && this.less(this.items[s], this.items[a]) && (a = s), a === i) break;
        [this.items[i], this.items[a]] = [this.items[a], this.items[i]], i = a;
      }
    }
    return n;
  }
}
function kh(t, e) {
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
      ka(a.x, a.y, l.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, a) => s.x - a.x);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      Sa(a.x, l.x, a.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  return n;
}
function Lh(t, e, n, o) {
  const i = n.length, r = 2 * i, s = new Float64Array(r).fill(1 / 0), a = new Float64Array(r).fill(1 / 0), l = new Int32Array(r).fill(-1), c = new Uint8Array(r), d = kh(n, o), u = Math.min(t.x, e.x), f = Math.max(t.x, e.x), h = Math.min(t.y, e.y), p = Math.max(t.y, e.y), g = (C) => Math.max(0, u - C.x) + Math.max(0, C.x - f) + Math.max(0, h - C.y) + Math.max(0, C.y - p), m = (C, T) => s[C] < s[T] || s[C] === s[T] && a[C] < a[T], y = new Sh(m);
  for (let C = 0; C < 2; C++) {
    const T = C * i + t.index;
    s[T] = 0, a[T] = 0, y.push(T);
  }
  const b = (C) => C % i, S = (C) => C < i ? 0 : 1;
  let x = -1;
  for (; y.size > 0; ) {
    const C = y.pop();
    if (c[C]) continue;
    c[C] = 1;
    const T = b(C);
    if (T === e.index) {
      x = C;
      break;
    }
    const R = S(C), L = n[T];
    for (const D of d[T]) {
      const A = n[D], _ = L.x === A.x ? 1 : 0, w = _ * i + D;
      if (c[w]) continue;
      const N = Math.abs(A.x - L.x) + Math.abs(A.y - L.y), I = Ea * (R === _ ? 0 : 1) + Ca * g(A), H = s[C] + N, V = a[C] + I;
      (H < s[w] || H === s[w] && V < a[w]) && (s[w] = H, a[w] = V, l[w] = C, y.push(w));
    }
  }
  if (x === -1) {
    const C = e.index, T = i + e.index;
    if (s[C] === 1 / 0 && s[T] === 1 / 0) return null;
    x = m(C, T) ? C : T;
  }
  const k = [];
  let v = x;
  for (; v !== -1; )
    k.unshift(n[b(v)]), v = l[v];
  return k;
}
function Mh(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function Ph(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${Ut(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function Th(t) {
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
const wt = 200;
function Ah(t, e, n, o, i) {
  const r = Math.min(t, n) - wt, s = Math.max(t, n) + wt, a = Math.min(e, o) - wt, l = Math.max(e, o) + wt;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < l && c.y + c.height > a
  );
}
function Nh(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (ka(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Sa(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function $h(t, e, n, o, i, r, s) {
  const a = Ms(n), l = Ms(r), c = t + a.x * Bn, d = e + a.y * Bn, u = o + l.x * Bn, f = i + l.y * Bn, h = (x) => {
    const k = (v, C) => v > x.x - pt && v < x.x + x.width + pt && C > x.y - pt && C < x.y + x.height + pt;
    return k(t, e) || k(c, d) || k(o, i) || k(u, f);
  }, p = s.filter((x) => !h(x)), g = (x) => {
    const k = x.map((D) => Ps(D, pt)), v = Ch(c, d, u, f, k);
    v.length;
    const C = v.find((D) => D.x === c && D.y === d), T = v.find((D) => D.x === u && D.y === f);
    C || v.push({ x: c, y: d, index: v.length }), T || v.push({ x: u, y: f, index: v.length });
    const R = C ?? v[v.length - (T ? 1 : 2)], L = T ?? v[v.length - 1];
    return Lh(R, L, v, k);
  }, m = Ah(t, e, o, i, p), y = m.length < p.length;
  let b = g(m);
  if (y) {
    const x = p.map((v) => Ps(v, pt));
    (!(b !== null && b.length >= 2) || Nh(b, x)) && (b = g(p));
  }
  if (!b || b.length < 2) return null;
  const S = [
    { x: t, y: e, index: -1 },
    ...b,
    { x: o, y: i, index: -2 }
  ];
  return Mh(S);
}
const Ih = 512, ft = /* @__PURE__ */ new Map();
function Dh(t, e, n, o, i, r, s) {
  let a = `${xh}|${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const l of s)
    a += `|${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.width)},${Math.round(l.height)}`;
  return a;
}
function Ni(t, e, n, o, i, r, s) {
  const a = Dh(t, e, n, o, i, r, s);
  if (ft.has(a)) {
    const c = ft.get(a);
    return ft.delete(a), ft.set(a, c), c;
  }
  const l = $h(t, e, n, o, i, r, s);
  return ft.set(a, l), ft.size > Ih && ft.delete(ft.keys().next().value), l;
}
function Rh({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  borderRadius: a = 5,
  channelOffset: l
}) {
  if (!s || s.length === 0)
    return Sn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const c = Ni(t, e, n, o, i, r, s);
  if (!c)
    return Sn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const d = xa(c, l, s), u = Ph(d, a), { x: f, y: h, offsetX: p, offsetY: g } = Th(d);
  return {
    path: u,
    labelPosition: { x: f, y: h },
    labelOffsetX: p,
    labelOffsetY: g
  };
}
const Ts = 5;
function ho(t) {
  return t ? t === !0 ? Ts : t.spacing ?? Ts : null;
}
function As(t, e, n, o) {
  if (e <= 1) return 0;
  const r = Math.min((e - 1) * o, Math.max(0, n)) / (e - 1);
  return (t - (e - 1) / 2) * r;
}
function Ns(t, e, n) {
  return e === "left" || e === "right" ? { x: t.x, y: t.y + n } : { x: t.x + n, y: t.y };
}
const $s = 20;
function La(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Hh(t, e) {
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
function ci(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const a = s.nodeOrigin ?? n ?? [0, 0], l = s.dimensions?.width ?? we, c = s.dimensions?.height ?? ve;
    o += s.position.x - l * a[0], i += s.position.y - c * a[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function ct(t, e, n) {
  if (!t.parentId)
    return t;
  const o = ci(t, e, n);
  return { ...t, position: o };
}
function go(t, e, n) {
  return t.map((o) => ct(o, e, n));
}
function xt(t, e) {
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
function Nt(t) {
  const e = La(t), n = [], o = /* @__PURE__ */ new Set();
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
function Ma(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Ma(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Pa(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function Ho(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function qn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: we, height: ve };
  return Pa(t, o, i);
}
function Fh(t, e, n) {
  const o = t.x + e.width + $s, i = t.y + e.height + $s, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function Is(t, e, n) {
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
function Oh(t, e, n) {
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
function zh(t, e, n) {
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
function Vh(t, e, n) {
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
function Bh(t, e, n) {
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
function qh(t, e, n) {
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
function Yh(t, e, n) {
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
function Xh(t, e, n) {
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
const Ta = {
  circle: { perimeterPoint: Oh },
  diamond: { perimeterPoint: zh },
  hexagon: { perimeterPoint: Vh },
  parallelogram: { perimeterPoint: Bh },
  triangle: { perimeterPoint: qh },
  cylinder: { perimeterPoint: Yh },
  stadium: { perimeterPoint: Xh }
};
function Aa(t, e = "light") {
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
const Fo = "__alpineflow_collab_store__";
function Wh() {
  return typeof globalThis < "u" ? (globalThis[Fo] || (globalThis[Fo] = /* @__PURE__ */ new WeakMap()), globalThis[Fo]) : /* @__PURE__ */ new WeakMap();
}
const Fe = Wh(), Oo = "__alpineflow_registry__";
function Na() {
  return typeof globalThis < "u" ? (globalThis[Oo] || (globalThis[Oo] = /* @__PURE__ */ new Map()), globalThis[Oo]) : /* @__PURE__ */ new Map();
}
function Lt(t) {
  return Na().get(t);
}
function jh(t, e) {
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
const Uh = 1e3;
class Gh {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? jh, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Uh);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Zh {
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
        const p = r.get(h.source);
        if (!p) continue;
        const g = h.sourceHandle ?? "default", m = h.targetHandle ?? "default";
        g in p && (d[m] = p[g]);
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
const Kh = 5;
function Jh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const a = /* @__PURE__ */ new Set();
  function l() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Kh && !o.has(c) && (o.add(c), console.warn(
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
function Qh(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function eg(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function yn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function $a(t, e, n, o) {
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
function po(t, e, n, o) {
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
function Ds(t, e, n) {
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
function Zt(t, e) {
  const n = Jt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? ve
  };
}
function Ia(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function tg(t, e, n = !0) {
  const o = Zt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Zt(i);
    return n ? Ia(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function ng(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Zt(t), i = Zt(e);
  return n ? Ia(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function og(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const a of o) {
    const l = r + e, c = s + n, d = a.x + a.width, u = a.y + a.height;
    if (r < d + i && l > a.x - i && s < u + i && c > a.y - i) {
      const f = l - (a.x - i), h = d + i - r, p = c - (a.y - i), g = u + i - s, m = Math.min(f, h, p, g);
      m === f ? r -= f : m === h ? r += h : m === p ? s -= p : s += g;
    }
  }
  return { x: r, y: s };
}
function ig(t) {
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
                  (g) => g.parentId === d.parentId
                ),
                ...r.filter(
                  (g) => g.parentId === d.parentId
                )
              ], p = $a(f, d, h, u);
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
        const d = Nt(t.nodes);
        t.nodes.splice(0, t.nodes.length, ...d);
      }
      t._rebuildNodeMap();
      for (const d of o)
        if (d.childLayout) {
          const u = t._nodeMap.get(d.id);
          u && t._installChildLayoutWatchers(u);
        }
      t._emit("nodes-change", { type: "add", nodes: o, origin: n?.source ?? "api" });
      const a = t._container ? Fe.get(t._container) : void 0;
      if (a?.bridge)
        for (const d of o)
          a.bridge.pushLocalNodeAdd(d);
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
    removeNodes(e, n) {
      t._captureHistory();
      const o = new Set(Array.isArray(e) ? e : [e]), i = /* @__PURE__ */ new Set();
      for (const f of [...o]) {
        const h = t._nodeMap.get(f);
        if (!h?.parentId || o.has(h.parentId)) continue;
        const p = t._getChildValidation(h.parentId);
        if (!p) continue;
        const g = t._nodeMap.get(h.parentId);
        if (!g) continue;
        const m = t.nodes.filter(
          (b) => b.parentId === h.parentId
        ), y = po(g, h, m, p);
        y.valid || (i.add(f), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
          child: h,
          operation: "remove",
          rule: y.rule,
          message: y.message
        }));
      }
      for (const f of i)
        o.delete(f);
      if (o.size === 0) return;
      const r = /* @__PURE__ */ new Map();
      for (const f of o) {
        const h = t._nodeMap.get(f);
        h?.parentId && r.set(f, h.parentId);
      }
      for (const f of [...o])
        for (const h of xt(f, t.nodes))
          o.add(h);
      B("destroy", `Removing ${o.size} node(s)`, [...o]);
      const s = t.nodes.filter((f) => o.has(f.id));
      let a = [];
      t._config.reconnectOnDelete && (a = Qf(o, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((f) => o.has(f.source) || o.has(f.target) ? (l.push(f.id), !1) : !0), a.length && (t.edges.push(...a), B("destroy", `Created ${a.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((f) => !o.has(f.id)), t._rebuildNodeMap();
      for (const f of o)
        t.selectedNodes.delete(f), t._initialDimensions.delete(f), t._uninstallChildLayoutWatchers(f), t._draggingNodeIds?.delete(f);
      for (const f of l)
        t._edgeDirtyTicks?.delete(f), t._edgeCorridors?.delete(f);
      s.length && t._emit("nodes-change", { type: "remove", nodes: s, origin: n?.source ?? "api" }), a.length && t._emit("edges-change", { type: "add", edges: a, origin: n?.source ?? "api" });
      const c = t._container ? Fe.get(t._container) : void 0;
      if (c?.bridge) {
        for (const f of o)
          c.bridge.pushLocalNodeRemove(f);
        for (const f of l)
          c.bridge.pushLocalEdgeRemove(f);
        for (const f of a)
          c.bridge.pushLocalEdgeAdd(f);
      }
      t._recomputeChildValidation();
      const d = /* @__PURE__ */ new Set();
      for (const f of o) {
        const h = r.get(f);
        h && t._nodeMap.get(h)?.childLayout && d.add(h);
      }
      const u = /* @__PURE__ */ new Set();
      for (const f of d) {
        let h = f, p = t._nodeMap.get(f)?.parentId;
        for (; p; ) {
          const g = t._nodeMap.get(p);
          g?.childLayout && (h = p), p = g?.parentId;
        }
        u.add(h);
      }
      for (const f of u) t.layoutChildren?.(f);
      t._scheduleAutoLayout(), t._commitNodeGeometry?.([...o]);
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
      return ai(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return Zf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return Gf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return Jf(e, n, t.edges, o);
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
      return o ? tg(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : ng(i, r, o);
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
function sg(t) {
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
    addEdges(e, n) {
      const o = t._config.defaultEdgeOptions, i = t._config.connectionRules, r = (Array.isArray(e) ? e : [e]).map((l) => o ? { ...o, ...l } : l).filter((l) => {
        if (!i) return !0;
        const c = { source: l.source, sourceHandle: l.sourceHandle, target: l.target, targetHandle: l.targetHandle };
        return _t(c, i, t._nodeMap);
      });
      if (r.length === 0) return;
      t._captureHistory(), B("edge", `Adding ${r.length} edge(s)`, r.map((l) => l.id)), t.edges.push(...r), t._rebuildEdgeMap();
      const s = t._computeEndpointGrouping();
      s.size > 0 && t._markEdgesDirtyById(s), t._emit("edges-change", { type: "add", edges: r, origin: n?.source ?? "api" });
      const a = t._container ? Fe.get(t._container) : void 0;
      if (a?.bridge)
        for (const l of r)
          a.bridge.pushLocalEdgeAdd(l);
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
    removeEdges(e, n) {
      t._captureHistory();
      const o = new Set(Array.isArray(e) ? e : [e]);
      B("edge", `Removing ${o.size} edge(s)`, [...o]);
      const i = t.edges.filter((a) => o.has(a.id));
      t.edges = t.edges.filter((a) => !o.has(a.id)), t._rebuildEdgeMap();
      for (const a of o)
        t.selectedEdges.delete(a), t._edgeDirtyTicks?.delete(a), t._edgeCorridors?.delete(a);
      const r = t._computeEndpointGrouping();
      r.size > 0 && t._markEdgesDirtyById(r), i.length && t._emit("edges-change", { type: "remove", edges: i, origin: n?.source ?? "api" });
      const s = t._container ? Fe.get(t._container) : void 0;
      if (s?.bridge)
        for (const a of o)
          s.bridge.pushLocalEdgeRemove(a);
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
function rg(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Jr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return pf(e, n, t._viewportLive ?? t.viewport, o);
    },
    // ── Fit & Bounds ──────────────────────────────────────────────────────
    /**
     * Resolve once every node has measured `dimensions`, deferring via
     * `requestAnimationFrame` (up to 10 retries) to give the DOM time to render.
     * Resolves `true` when all nodes are measured, or `false` when the retry
     * budget is exhausted with nodes still unmeasured.
     *
     * Shared by `fitView` and the whole-graph replace APIs so they await the
     * same measurement signal. `_retries` is an internal recursion counter.
     */
    _whenMeasured(e = 0) {
      return t.nodes.some((n) => !n.dimensions) ? e < 10 ? new Promise((n) => {
        requestAnimationFrame(() => n(this._whenMeasured(e + 1)));
      }) : Promise.resolve(!1) : Promise.resolve(!0);
    },
    /**
     * Fit all visible nodes into the viewport.
     *
     * Defers via `requestAnimationFrame` if any node lacks measured
     * dimensions (up to 10 retries) to give the DOM time to render.
     *
     * Returns a promise that resolves `true` once the fit runs, or `false`
     * if the retry budget is exhausted with nodes still unmeasured — so
     * callers can observe whether the fit actually happened. Callers that
     * ignore the return value are unaffected (the internal `fitViewOnInit`
     * path does exactly that).
     */
    fitView(e, n = 0) {
      const o = () => {
        const i = t.nodes.filter((s) => !s.hidden), r = jt(go(i, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
        return this.fitBounds(r, e), t._announcer?.handleEvent("fit-view", {}), !0;
      };
      return t.nodes.some((i) => !i.dimensions) ? this._whenMeasured(n).then((i) => i ? o() : !1) : Promise.resolve(o());
    },
    /**
     * Fit a specific rectangle into the viewport.
     *
     * If `duration` is specified, the transition is animated via
     * `ctx.animate()` (cross-mixin dependency). Otherwise the viewport
     * is set directly via `ctx._panZoom`.
     */
    fitBounds(e, n) {
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = ro(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Zn
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), jt(go(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * The viewport that frames the whole graph right now, or null when there is no
     * honest answer.
     *
     * For callers that cannot wait: `fitView()` defers through `_whenMeasured()` until
     * every node has been laid out, and a double-click has to answer within the
     * gesture. So this asks the same question and, where `fitView()` would wait, says
     * null instead and leaves the fallback to the caller.
     *
     * Null on two counts. Nothing visible to frame — and nothing MEASURED to frame it
     * by: an unmeasured node still has bounds, because `getNodesBounds` fills in the
     * 150×50 default, so framing it would frame a row of placeholder boxes at the
     * positions they were declared with rather than the graph anybody can see.
     */
    _fitViewport() {
      const e = t.nodes.filter((o) => !o.hidden);
      if (e.length === 0 || e.some((o) => !o.dimensions))
        return null;
      const n = this.getNodesBounds();
      return n.width <= 0 && n.height <= 0 ? null : this.getViewportForBounds(n, Zn);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? ro(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Zn
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * cs, o);
      B("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / cs, o);
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
        pannable: t.isInteractive && t._config?.pannable !== !1,
        zoomable: t.isInteractive && t._config?.zoomable !== !1
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
let St = null;
const ag = 20;
function di(t) {
  return JSON.parse(JSON.stringify(t));
}
function Rs(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function Da(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return St = {
    nodes: di(n),
    edges: di(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function lg() {
  if (!St || St.nodes.length === 0) return null;
  St.pasteCount++;
  const t = St.pasteCount * ag, e = /* @__PURE__ */ new Map(), n = St.nodes.map((i) => {
    const r = Rs(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: di(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = St.edges.map((i) => ({
    ...i,
    id: Rs(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function cg(t, e) {
  const n = Da(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function dg(t) {
  const e = (i, r) => {
    if (i.size !== r.size)
      return !1;
    for (const s of i)
      if (!r.has(s))
        return !1;
    return !0;
  }, n = () => {
    for (const i of t.selectedNodes) {
      const r = t.getNode(i);
      r && (r.selected = !1);
    }
    for (const i of t.selectedEdges) {
      const r = t.getEdge(i);
      r && (r.selected = !1);
    }
    t.selectedNodes.clear(), t.selectedEdges.clear(), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-node-selected, .flow-edge-selected, .flow-row-selected").forEach((i) => {
      i.classList.remove("flow-node-selected", "flow-edge-selected", "flow-row-selected");
    });
  }, o = (i) => {
    const r = new Set(t.selectedNodes), s = new Set(t.selectedEdges), a = new Set(t.selectedRows);
    n(), i(), (!e(r, t.selectedNodes) || !e(s, t.selectedEdges) || !e(a, t.selectedRows)) && t._emitSelectionChange();
  };
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
      t.selectedNodes.size === 0 && t.selectedEdges.size === 0 && t.selectedRows.size === 0 || (B("selection", "Deselecting all"), n(), t._emitSelectionChange());
    },
    /**
     * Replace the current selection with the given nodes. Unknown ids are
     * skipped. Emits `selection-change` only when the selection actually changes
     * (see replaceSelection).
     */
    selectNodes(i) {
      o(() => {
        for (const r of i) {
          const s = t.getNode(r);
          s && (t.selectedNodes.add(r), s.selected = !0);
        }
      });
    },
    /**
     * Replace the current selection with the given edges. Unknown ids are
     * skipped. Emits `selection-change` only when the selection actually changes.
     */
    selectEdges(i) {
      o(() => {
        for (const r of i) {
          const s = t.getEdge(r);
          s && (t.selectedEdges.add(r), s.selected = !0);
        }
      });
    },
    /** Set a node's locked flag (freezes interactions). No-op if the id is unknown. */
    setNodeLocked(i, r) {
      const s = t.getNode(i);
      s && (s.locked = r);
    },
    /** Set a node's hidden flag. No-op if the id is unknown. */
    setNodeHidden(i, r) {
      const s = t.getNode(i);
      s && (s.hidden = r);
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
      const i = [...t.selectedNodes].filter((u) => {
        const f = t.getNode(u);
        return f ? oh(f) : !1;
      }), r = [...t.selectedEdges].filter((u) => t.getEdge(u)?.deletable !== !1);
      let s = i.map((u) => t.getNode(u)).filter(Boolean);
      const a = new Set(i), l = t.edges.filter(
        (u) => a.has(u.source) || a.has(u.target)
      ), c = /* @__PURE__ */ new Map();
      for (const u of l) c.set(u.id, u);
      for (const u of r) {
        const f = t.getEdge(u);
        f && c.set(f.id, f);
      }
      const d = [...c.values()];
      if (s = s.filter((u) => {
        if (!u.parentId || s.some((m) => m.id === u.parentId)) return !0;
        const f = t._getChildValidation(u.parentId);
        if (!f) return !0;
        const h = t.getNode(u.parentId);
        if (!h) return !0;
        const p = t.nodes.filter(
          (m) => m.parentId === u.parentId
        ), g = po(h, u, p, f);
        return !g.valid && t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: h,
          child: u,
          operation: "remove",
          rule: g.rule,
          message: g.message
        }), g.valid;
      }), !(s.length === 0 && d.length === 0)) {
        if (t._config?.onBeforeDelete) {
          const u = await t._config.onBeforeDelete({
            nodes: s,
            edges: d
          });
          if (u === !1) {
            B("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (u.nodes.length > 0 && (B("delete", `onBeforeDelete approved ${u.nodes.length} node(s)`), t.removeNodes(u.nodes.map((f) => f.id))), u.edges.length > 0) {
              const f = u.edges.map((h) => h.id).filter((h) => t.edges.some((p) => p.id === h));
              f.length > 0 && (B("delete", `onBeforeDelete approved ${f.length} edge(s)`), t.removeEdges(f));
            }
            t._recomputeChildValidation();
            for (const f of t.selectedNodes)
              t.nodes.some((h) => h.id === f) || t.selectedNodes.delete(f);
            for (const f of t.selectedEdges)
              t.edges.some((h) => h.id === f) || t.selectedEdges.delete(f);
          } finally {
            t._resumeHistory();
          }
          return;
        }
        t._captureHistory(), t._suspendHistory();
        try {
          if (s.length > 0 && (B("delete", `Deleting ${s.length} selected node(s)`), t.removeNodes(s.map((u) => u.id))), r.length > 0) {
            const u = r.filter(
              (f) => t.edges.some((h) => h.id === f)
            );
            u.length > 0 && (B("delete", `Deleting ${u.length} selected edge(s)`), t.removeEdges(u));
          }
          t._recomputeChildValidation();
          for (const u of t.selectedNodes)
            t.nodes.some((f) => f.id === u) || t.selectedNodes.delete(u);
          for (const u of t.selectedEdges)
            t.edges.some((f) => f.id === u) || t.selectedEdges.delete(u);
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
      const i = Da(t.nodes, t.edges);
      i.nodeCount > 0 && (B("clipboard", `Copied ${i.nodeCount} node(s) and ${i.edgeCount} edge(s)`), t._emit("copy", i));
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
      const i = lg();
      if (i) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...i.nodes), t.nodes = Nt(t.nodes), t._rebuildNodeMap(), t.edges.push(...i.edges), t._rebuildEdgeMap();
        for (const r of i.nodes)
          t.selectedNodes.add(r.id);
        for (const r of i.edges)
          t.selectedEdges.add(r.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: i.nodes, origin: "paste" }), t._emit("edges-change", { type: "add", edges: i.edges, origin: "paste" }), t._emit("paste", { nodes: i.nodes, edges: i.edges }), B("clipboard", `Pasted ${i.nodes.length} node(s) and ${i.edges.length} edge(s)`), t.$nextTick(() => {
          for (const r of i.nodes)
            t._container?.querySelector(`[data-flow-node-id="${CSS.escape(r.id)}"]`)?.classList.add("flow-node-selected");
          for (const r of i.edges)
            t._container?.querySelector(`[data-flow-edge-id="${CSS.escape(r.id)}"]`)?.classList.add("flow-edge-selected");
        });
      }
    },
    /**
     * Copy selected nodes to the clipboard, then delete them.
     * Emits a `cut` event.
     */
    async cut() {
      if (t.selectedNodes.size === 0) return;
      const i = cg(t.nodes, t.edges);
      i.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: i.nodeCount, edgeCount: i.edgeCount }), B("clipboard", `Cut ${i.nodeCount} node(s)`));
    }
  };
}
function ug(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function mo(t, e, n = {}) {
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
      l === "id" || l === "__proto__" || l === "constructor" || l === "prototype" || ug(a[l], c) || (a[l] = c);
    r.push(a);
  }
  return r;
}
function Hs(t, e, n) {
  const o = mo(t.nodes, Nt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = mo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, origin: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), B("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function fg(t) {
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
        const n = Nt(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = mo(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = mo(t.edges, n);
        t.edges.splice(0, t.edges.length, ...o);
      }
      if (t._rebuildNodeMap(), t._rebuildEdgeMap(), e.viewport) {
        const n = { ...t.viewport, ...e.viewport };
        t._panZoom?.setViewport(n);
      }
      t.deselectAll(), t._emit("restore", { ...e, origin: "load" }), t._scheduleAutoLayout(), requestAnimationFrame(() => {
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
    /**
     * Replace the whole graph atomically — the first-class alternative to the
     * `$clear()` + `addNodes()` workaround. Built on the identity-preserving
     * `fromObject` path: surviving ids keep their live objects, new ids mount
     * fresh and measure, so an immediate `fitView()` actually fits (no manual
     * `await nextFrame()`). `edges` defaults to empty, so `replaceNodes(nodes)`
     * is a genuine whole-graph replace. Emits `restore` with `origin: 'load'`.
     * The returned promise resolves once the new nodes have measured dimensions.
     */
    replaceNodes(e, n) {
      return this.fromObject({ nodes: e, edges: n ?? [] }), t._whenMeasured().then(() => {
      });
    },
    /**
     * Replace just the nodes, leaving the current edges in place (the
     * react-flow-style `setNodes`). For a whole-graph swap use `replaceNodes`.
     * Resolves once the new nodes have measured dimensions.
     */
    setNodes(e) {
      return this.fromObject({ nodes: e }), t._whenMeasured().then(() => {
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
      e && Hs(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && Hs(t, e, "redo");
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
function hg(t, e) {
  return t * (1 - e);
}
function gg(t, e) {
  return t * e;
}
function pg(t, e) {
  return e === "in" ? t : 1 - t;
}
function mg(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? hg(o, e) : gg(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function yg(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function wg(t, e, n) {
  t.style.opacity = String(pg(e, n));
}
function _g(t) {
  t.style.removeProperty("opacity");
}
const rt = Math.PI * 2, cn = /* @__PURE__ */ new Map(), vg = 64;
function $i(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = cn.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (cn.size >= vg) {
    const r = cn.keys().next().value;
    r !== void 0 && cn.delete(r);
  }
  return cn.set(t, i), i;
}
function gw(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(rt * l * a + o * rt),
    y: n + s * Math.sin(rt * l * a + o * rt)
  });
}
function pw(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), u = d > 0 ? l / d : 1, h = -(d > 0 ? c / d : 0), p = u;
  return (g) => {
    const m = e + l * g, y = n + c * g, b = r * Math.sin(rt * s * g + a * rt);
    return { x: m + h * b, y: y + p * b };
  };
}
function mw(t, e) {
  const n = $i(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function yw(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(rt * a + r * rt);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function ww(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * rt, f = (Math.sin(s * u) + Math.sin(a * u * 1.3)) / 2, h = (Math.sin(l * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function _w(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let Fs = !1;
function _e(t) {
  try {
    return structuredClone(t);
  } catch {
    return Fs || (Fs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function bg(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: _e(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function xg(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function Eg(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = _e(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Ii {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new na();
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
    const o = new Ii(this._canvas, this._engine);
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
    return oa(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, bg(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, xg(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && Eg(o, n);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = co(e.easing), a = this._makeContext(n, e.id);
    if (e.when && !e.when(a)) {
      if (e.else)
        return this._executeStep(e.else, n);
      this._emit("step-skipped", { index: n, id: e.id });
      return;
    }
    if (e.timeline) {
      const T = e.timeline;
      if (this._tag && !e.independent && T.setTag(this._tag), e.independent || this._subTimelines.push(T), this._emit("step", { index: n, id: e.id, timeline: T }), e.onStart?.(a), await T.play(), this._state === "stopped") return;
      if (e.onComplete?.(a), this._emit("step-complete", { timeline: T }), !e.independent) {
        const R = this._subTimelines.indexOf(T);
        R >= 0 && this._subTimelines.splice(R, 1);
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
    const p = this._resolveFollowPath(e), g = this._createGuidePath(e), m = !!(e.viewport || e.fitView || e.panTo);
    let y = null, b = null;
    m && this._canvas.viewport && (y = { ...this._canvas.viewport }, b = this._resolveTargetViewport(e));
    const S = e.edgeTransition ?? "none", x = e.addEdges?.map((T) => T.id) ?? [], k = e.removeEdges?.filter((T) => this._canvas.getEdge(T)).slice() ?? [], v = {
      step: e,
      ctx: a,
      duration: i,
      delay: r,
      easing: s,
      validNodeIds: l,
      validEdgeIds: c,
      resolvedPathFn: p,
      guidePathEl: g,
      nodeFromDimensions: d,
      nodeFromStyles: u,
      edgeFromStrokeWidth: f,
      edgeFromColor: h,
      viewportFrom: y,
      viewportTarget: b,
      transition: S,
      addEdgeIds: x,
      removeEdgeIds: k
    };
    if (i === 0)
      return this._executeInstantStep(v);
    const C = this._prepareAnimatedEdges(e, S, x);
    return C && await C, p ? this._executeFollowPathStep(v) : this._executeAnimatedStep(v);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, Cn(s.style)));
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
    const n = $i(e.followPath);
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
      viewportTarget: p,
      transition: g,
      addEdgeIds: m,
      removeEdgeIds: y,
      guidePathEl: b
    } = e, S = e.resolvedPathFn;
    return new Promise((x) => {
      const k = this._engine.register((v) => {
        if (this._state === "stopped")
          return x(), !0;
        const C = Math.min(v / i, 1), T = s(C);
        if (a) {
          const R = S(T);
          for (const L of a) {
            const D = this._canvas.getNode(L);
            D && (D.position.x = R.x, D.position.y = R.y);
          }
        }
        return this._interpolateFollowPathTick(
          n,
          T,
          a,
          l,
          c,
          d,
          u,
          f,
          h,
          p
        ), this._tickEdgeTransitions(g, m, y, T), n.onProgress?.(C, o), C >= 1 ? (this._cleanupEdgeTransitions(g, m, y), y.length && this._removeEdges(y), this._applyStepInstant(n), b && n.guidePath?.autoRemove !== !1 && b.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), x(), !0) : !1;
      }, r);
      this._activeHandles.push(k);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, a, l, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = at(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = at(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = Cn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), p = s.get(f);
        h && p && (h.style = ia(p, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 ? f.strokeWidth = at(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = Mi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = Lf(c, d, n, {
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
    return new Promise((p) => {
      const g = this._buildAnimateTargets(
        n,
        s,
        a,
        l,
        c
      ), m = Object.keys(g.nodes || {}).length > 0 || Object.keys(g.edges || {}).length > 0 || g.viewport;
      if (!m && !u.length && !f.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
        return;
      }
      if (m) {
        const y = this._canvas.animate(g, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (b) => {
            if (this._state === "stopped") {
              y.stop(), p();
              return;
            }
            this._tickEdgeTransitions(d, u, f, b), n.onProgress?.(b, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, u, f), f.length && this._removeEdges(f), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
          }
        });
        this._activeHandles.push({ stop: () => y.stop() });
      } else
        this._executeEdgeLifecycleOnly(e, p);
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
      r && mg(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && yg(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && wg(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && _g(o);
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
    const i = jt(o), r = e.fitViewPadding ?? 0.1;
    return ro(
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
    const r = n.dimensions?.width ?? we, s = n.dimensions?.height ?? ve, a = n.position.x + r / 2, l = n.position.y + s / 2;
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
const Ra = /* @__PURE__ */ new Map();
function en(t, e) {
  Ra.set(t, e);
}
function Cg(t) {
  return Ra.get(t);
}
const Oe = "http://www.w3.org/2000/svg", Sg = {
  create(t, e) {
    const n = document.createElementNS(Oe, "circle");
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
}, kg = {
  create(t, e) {
    const n = document.createElementNS(Oe, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Oe, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Oe, "circle");
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
let Lg = 0;
const Mg = {
  create(t, e) {
    const n = document.createElementNS(Oe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Lg}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, a = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, u = n.__gradient;
      if (!d) {
        let g = r;
        if (s && s.length > 0) {
          const m = document.createElementNS(Oe, "defs");
          u = document.createElementNS(Oe, "linearGradient"), u.setAttribute("id", a), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const y of s) {
            const b = document.createElementNS(Oe, "stop");
            b.setAttribute("offset", String(y.offset)), b.setAttribute("stop-color", y.color), y.opacity !== void 0 && b.setAttribute("stop-opacity", String(y.opacity)), u.appendChild(b);
          }
          m.appendChild(u), n.appendChild(m), g = `url(#${a})`, n.__gradient = u;
        }
        d = document.createElementNS(Oe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), u) {
        const g = Math.max(0, Math.min(e.pathLength, h)), m = Math.max(0, Math.min(e.pathLength, h - o)), y = e.pathEl.getPointAtLength(g), b = e.pathEl.getPointAtLength(m);
        u.setAttribute("x1", String(b.x)), u.setAttribute("y1", String(b.y)), u.setAttribute("x2", String(y.x)), u.setAttribute("y2", String(y.y));
      }
      return;
    }
    let l = n.__fallbackRect;
    l || (l = document.createElementNS(Oe, "rect"), l.setAttribute("width", String(o)), l.setAttribute("height", String(i)), l.setAttribute("rx", String(i / 2)), l.setAttribute("fill", r), l.setAttribute("opacity", "0.8"), n.appendChild(l), n.__fallbackRect = l);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    l.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, Pg = {
  create(t, e) {
    const n = document.createElementNS(Oe, "circle");
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
}, Tg = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(Oe, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(Oe, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
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
en("circle", Sg);
en("orb", kg);
en("beam", Mg);
en("pulse", Pg);
en("image", Tg);
let Os = !1;
function Ag(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function zs(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Ag(o);
}
function Ng(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = Cg(a);
    if (!l) {
      B("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    a === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !Os && (Os = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? En, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = zs(r, h, f), g = { ...r, size: d, color: u }, m = l.create(i, g), y = o.getPointAtLength(0), b = {
      x: y.x,
      y: y.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    l.update(m, b);
    let S;
    const x = new Promise((R) => {
      S = R;
    }), k = () => {
      typeof r.onComplete == "function" && r.onComplete(), S();
    }, v = s.wrapOnComplete ? s.wrapOnComplete(k) : k, C = {
      element: m,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: v,
      currentPosition: { x: y.x, y: y.y }
    };
    return t._activeParticles.add(C), t._particleEngineHandle || (t._particleEngineHandle = lo.register((R) => t._tickParticles(R))), {
      getCurrentPosition() {
        return t._activeParticles.has(C) ? { ...C.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(C) && (C.renderer.destroy(C.element), t._activeParticles.delete(C), v());
      },
      get finished() {
        return x;
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
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? En, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(a, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return p && B("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), p;
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
      const { targetNodeId: r, synchronize: s = "arrival", onAllArrived: a, ...l } = i, c = [], d = [];
      if (s === "arrival") {
        const f = o.map((g) => {
          const y = t.getEdgePathElement(g)?.getTotalLength() ?? 0;
          return { id: g, length: y };
        }).filter((g) => g.length > 0);
        if (f.length === 0) {
          const g = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: g, stopAll() {
          } };
        }
        const h = Math.max(...f.map((g) => g.length)), p = zs(l, h, "2s");
        for (const { id: g, length: m } of f) {
          const y = m / h, b = p * y, S = p - b;
          if (S <= 0) {
            const x = this.sendParticle(g, { ...l, duration: b });
            x && c.push(x);
          } else {
            const x = setTimeout(() => {
              const k = this.sendParticle(g, { ...l, duration: b });
              k && c.push(k);
            }, S);
            d.push(x);
          }
        }
      } else
        for (const f of o) {
          const h = this.sendParticle(f, l);
          h && c.push(h);
        }
      const u = new Promise((f) => {
        setTimeout(() => {
          Promise.all(c.map((p) => p.finished)).then(() => {
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
class $g {
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
const ui = 1, fi = 1 / 60;
class hn {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = _e(e);
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
    return _e(this._state);
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
            o?.id && (this._state.nodes[o.id] = _e(o));
        else n?.id ? this._state.nodes[n.id] = _e(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = _e(e.args.node));
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
            o?.id && (this._state.edges[o.id] = _e(o));
        else n?.id ? this._state.edges[n.id] = _e(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = _e(e.args.edge));
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
    this._state = _e(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = _e(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: _e(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? la(r) ?? void 0 : void 0, a = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: _e(o),
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
      e._easingFn = co(e.easing);
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
      e._easingFn = co(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
    return _e({
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
      const a = e._from[s], l = this._getTargetValue(s, e.targets) ?? a, c = at(a, l, r);
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
            sa(r, o, n);
            break;
          case "decay":
            Pi(r, o, n);
            break;
          case "inertia":
            ra(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            aa(r, s, l, i), l >= 1 && (r.settled = !0);
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
const Ha = /* @__PURE__ */ new Map();
function Di(t, e) {
  Ha.set(t, e);
}
function Ig(t) {
  return Ha.get(t);
}
function Ri(t, e = 20) {
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
function Fa(t) {
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
const Dg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Ri(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += Fa(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Rg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Ri(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const u = t.nodes[d.source], f = t.nodes[d.target];
      if (!u || !f)
        continue;
      const h = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, p = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2, g = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, m = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${p}" x2="${g}" y2="${m}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Hg = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = Ri(t.nodes);
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
    u += Fa(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, p = f.position?.y ?? 0, g = f.dimensions?.width ?? 150, m = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
Di("faithful", Dg);
Di("outline", Rg);
Di("activity", Hg);
function hi(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function gi(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Fg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Oa(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Oa(t[e]);
  }
  return t;
}
class Hi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Oa(_e(e.initialState)), this.events = Object.freeze(_e(e.events)), this.checkpoints = Object.freeze(_e(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: _e(this.initialState),
      events: _e(this.events),
      checkpoints: _e(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > ui)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${ui}). Please update AlpineFlow to replay this recording.`
      );
    return new Hi(e);
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
      const i = Fg(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new hn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const a = fi * 1e3;
    let l = o ? hi(r, i) : gi(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Ig(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Og {
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
      version: ui,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Hi(i);
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
      o && typeof o == "object" && "id" in o && (e[o.id] = _e(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = _e(o));
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
        targets: _e(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? _e(o.motion) : void 0,
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
class zg {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new hn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = zo(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new hn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new hn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const a = fi * 1e3;
    let l = n ? hi(r, i) : gi(r, i);
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
    const e = zo(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new hn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = fi * 1e3;
    let a = e === 0 ? gi(i, 0) : hi(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = zo(), this._scheduleTick();
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
function zo() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Yn(t, e, n) {
  const o = e[n];
  e[n] = void 0, t[n] = o;
}
function Vg(t) {
  const e = Ng(t);
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
      const n = new Ii(t, lo);
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
        const p = o.boundTo;
        "node" in p ? o = {
          ...o,
          while: () => t.getNode(p.node)?.[p.property] === p.equals
        } : "edge" in p && (o = {
          ...o,
          while: () => t.getEdge(p.edge)?.[p.property] === p.equals
        });
      }
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), c = (p) => {
        if (p.size === 0)
          return;
        const g = Array.from(p);
        requestAnimationFrame(() => {
          t._layoutAnimTick++, t._commitNodeGeometry?.(g);
        });
      }, d = n.nodes ? Object.keys(n.nodes).length : 0, u = n.edges ? Object.keys(n.edges).length : 0;
      if (B("animate", "update() called", {
        nodes: d,
        edges: u,
        viewport: !!n.viewport,
        duration: i,
        easing: o.easing ?? "default",
        instant: i === 0
      }), n.nodes)
        for (const [p, g] of Object.entries(n.nodes)) {
          const m = t._nodeMap.get(p);
          if (!m) continue;
          const b = (g._duration ?? i) === 0;
          if (g.followPath && !b) {
            let S = null;
            typeof g.followPath == "function" ? S = g.followPath : S = $i(g.followPath);
            let x = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const k = t.getEdgeSvgElement?.();
              k && (x = document.createElementNS("http://www.w3.org/2000/svg", "path"), x.setAttribute("d", g.followPath), x.classList.add("flow-guide-path"), g.guidePath.class && x.classList.add(g.guidePath.class), k.appendChild(x));
            }
            if (S) {
              const k = S, v = x, C = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${p}:followPath`,
                from: 0,
                to: 1,
                apply: (T) => {
                  const R = t._nodeMap.get(p);
                  if (!R) return;
                  const L = k(T);
                  Se().raw(R).position.x = L.x, Se().raw(R).position.y = L.y, s.add(p), T >= 1 && v && C && v.remove();
                }
              });
            }
          } else if (g.position) {
            const x = Se().raw(m).position;
            if (g.position.x !== void 0) {
              const k = g.position.x;
              if (b)
                x.x = k;
              else {
                const v = x.x;
                r.push({
                  key: `node:${p}:position.x`,
                  from: v,
                  to: k,
                  apply: (C) => {
                    const T = t._nodeMap.get(p);
                    T && (Se().raw(T).position.x = C, s.add(p));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const k = g.position.y;
              if (b)
                x.y = k;
              else {
                const v = x.y;
                r.push({
                  key: `node:${p}:position.y`,
                  from: v,
                  to: k,
                  apply: (C) => {
                    const T = t._nodeMap.get(p);
                    T && (Se().raw(T).position.y = C), s.add(p);
                  }
                });
              }
            }
            b && s.add(p);
          }
          if (g.data !== void 0 && Object.assign(m.data, g.data), g.class !== void 0 && (m.class = g.class), g.selected !== void 0 && (m.selected = g.selected), g.zIndex !== void 0 && (m.zIndex = g.zIndex), g.style !== void 0)
            if (b)
              m.style = g.style, a.add(p);
            else {
              const S = Cn(m.style || {}), x = Cn(g.style), k = t._nodeElements.get(p);
              if (k) {
                const v = getComputedStyle(k);
                for (const C of Object.keys(x))
                  S[C] === void 0 && (S[C] = v.getPropertyValue(C));
              }
              r.push({
                key: `node:${p}:style`,
                from: 0,
                to: 1,
                apply: (v) => {
                  const C = t._nodeMap.get(p);
                  C && (Se().raw(C).style = ia(S, x, v), a.add(p));
                }
              });
            }
          g.dimensions && m.dimensions && (g.dimensions.width !== void 0 && (b ? m.dimensions.width = g.dimensions.width : r.push({
            key: `node:${p}:dimensions.width`,
            from: m.dimensions.width,
            to: g.dimensions.width,
            apply: (S) => {
              m.dimensions.width = S;
            }
          })), g.dimensions.height !== void 0 && (m.fixedDimensions = !0, b ? m.dimensions.height = g.dimensions.height : r.push({
            key: `node:${p}:dimensions.height`,
            from: m.dimensions.height,
            to: g.dimensions.height,
            apply: (S) => {
              m.dimensions.height = S;
            }
          })));
        }
      if (n.edges)
        for (const [p, g] of Object.entries(n.edges)) {
          const m = t._edgeMap.get(p);
          if (!m) continue;
          const b = (g._duration ?? i) === 0;
          if (g.color !== void 0 && g.color !== null)
            if (typeof g.color == "object")
              m.color = g.color, l.add(p), t._restyleEdgeGradient(p, g.color) || (s.add(m.source), s.add(m.target));
            else if (b)
              m.color = g.color, l.add(p);
            else {
              const S = typeof m.color == "string" && m.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || Li;
              r.push({
                key: `edge:${p}:color`,
                from: S,
                to: g.color,
                apply: (x) => {
                  const k = t._edgeMap.get(p);
                  k && (Se().raw(k).color = x, l.add(p));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (b)
              m.strokeWidth = g.strokeWidth, l.add(p);
            else {
              const S = m.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${p}:strokeWidth`,
                from: S,
                to: g.strokeWidth,
                apply: (x) => {
                  const k = t._edgeMap.get(p);
                  k && (Se().raw(k).strokeWidth = x, l.add(p));
                }
              });
            }
          g.label !== void 0 && (m.label = g.label), g.animated !== void 0 && (m.animated = g.animated), g.class !== void 0 && (m.class = g.class), g.type !== void 0 && (m.type = g.type);
        }
      if (n.viewport) {
        const p = n.viewport, m = (p._duration ?? i) === 0, y = t.viewport;
        p.pan?.x !== void 0 && (m ? y.x = p.pan.x : r.push({
          key: "viewport:pan.x",
          from: y.x,
          to: p.pan.x,
          apply: (b) => {
            y.x = b;
          }
        })), p.pan?.y !== void 0 && (m ? y.y = p.pan.y : r.push({
          key: "viewport:pan.y",
          from: y.y,
          to: p.pan.y,
          apply: (b) => {
            y.y = b;
          }
        })), p.zoom !== void 0 && (m ? y.zoom = p.zoom : r.push({
          key: "viewport:zoom",
          from: y.zoom,
          to: p.zoom,
          apply: (b) => {
            y.zoom = b;
          }
        }));
      }
      if (r.length === 0) {
        s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), c(s)), a.size > 0 && t._flushNodeStyles(a), l.size > 0 && t._flushEdgeStyles(l);
        const p = {
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
        return o.onComplete?.(), p;
      }
      const h = Se().raw(t._animator).animate(r, {
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
        onProgress(p) {
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), n.viewport && t._flushViewport(), o.onProgress?.(p);
        },
        onComplete() {
          if (n.nodes)
            for (const [p, g] of Object.entries(n.nodes)) {
              const m = t._nodeMap.get(p);
              if (!m) continue;
              const y = Se().raw(m);
              (g.followPath || g.position?.x !== void 0 || g.position?.y !== void 0) && Yn(m, y, "position"), g.style !== void 0 && Yn(m, y, "style");
            }
          if (n.edges)
            for (const [p, g] of Object.entries(n.edges)) {
              const m = t._edgeMap.get(p);
              if (!m) continue;
              const y = Se().raw(m);
              g.color !== void 0 && typeof g.color == "string" && Yn(m, y, "color"), g.strokeWidth !== void 0 && Yn(m, y, "strokeWidth");
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), c(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), n.viewport && t._panZoom?.setViewport({ ...t.viewport }), o.onComplete?.();
        }
      });
      return n.nodes && (h._targetNodeIds = Object.keys(n.nodes)), h;
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
      const i = oa(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const a = o.zoom, l = lo.register(() => {
        if (s) return !0;
        let d = null;
        if (typeof n == "string") {
          const m = t._nodeMap.get(n);
          if (m) {
            d = m.parentId ? t.getAbsolutePosition(n) : { ...m.position };
            const y = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - y[0]), d.y += m.dimensions.height * (0.5 - y[1]));
          }
        } else if ("_targetNodeIds" in n && n._targetNodeIds?.length) {
          const m = n._targetNodeIds[0], y = t._nodeMap.get(m);
          if (y) {
            d = y.parentId ? t.getAbsolutePosition(m) : { ...y.position };
            const b = y.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            y.dimensions && (d.x += y.dimensions.width * (0.5 - b[0]), d.y += y.dimensions.height * (0.5 - b[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const m = n.getCurrentPosition();
          if (m)
            d = m;
          else
            return s = !0, l.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const u = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, f = a ?? t.viewport.zoom, h = u.width / 2 - d.x * f, p = u.height / 2 - d.y * f, g = 0.08;
        return t.viewport.x += (h - t.viewport.x) * g, t.viewport.y += (p - t.viewport.y) * g, a && (t.viewport.zoom += (a - t.viewport.zoom) * g), t._flushViewport(), !1;
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
      return new $g(n, {
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
        animate: (g, m) => {
          const y = i.update;
          i.update = s;
          try {
            return r.call(i, g, m);
          } finally {
            i.update = y;
          }
        },
        update: (g, m) => s.call(i, g, m),
        sendParticle: (g, m) => a.call(i, g, m),
        sendParticleAlongPath: (g, m) => l.call(i, g, m),
        sendParticleBetween: (g, m, y) => c.call(i, g, m, y),
        sendParticleBurst: (g, m) => d.call(i, g, m),
        sendConverging: (g, m) => u.call(i, g, m),
        addNodes: (g) => t.addNodes(g),
        removeNodes: (g) => t.removeNodes(g),
        addEdges: (g) => t.addEdges(g),
        removeEdges: (g) => t.removeEdges(g)
      }, h = new Og(f, o), p = async () => {
        i.animate = (...g) => f.animate(...g), i.update = (...g) => f.update(...g), i.sendParticle = (...g) => f.sendParticle(...g), i.sendParticleAlongPath = (...g) => f.sendParticleAlongPath(...g), i.sendParticleBetween = (...g) => f.sendParticleBetween(...g), i.sendParticleBurst = (...g) => f.sendParticleBurst(...g), i.sendConverging = (...g) => f.sendConverging(...g);
        try {
          const g = n();
          g instanceof Promise && await g;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = a, i.sendParticleAlongPath = l, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = u;
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
        sendParticle: (s, a) => i.sendParticle(s, a),
        sendParticleAlongPath: (s, a) => i.sendParticleAlongPath(s, a),
        sendParticleBetween: (s, a, l) => i.sendParticleBetween(s, a, l),
        sendParticleBurst: (s, a) => i.sendParticleBurst(s, a),
        sendConverging: (s, a) => i.sendConverging(s, a)
      };
      return new zg(r, n, o);
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
      en(n, o);
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
function Vs(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return xt(t, e);
  const r = /* @__PURE__ */ new Set(), s = ai(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = ai(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function Bg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Vo(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Bs(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = xt(r.id, e);
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
function Bo(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function qg(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Xn = { width: 150, height: 50 };
function Yg(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = Vs(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = Bg(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? Xn, d = r && s ? s : c, u = {};
        for (const [h] of l.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? Xn;
          let m, y;
          p.parentId === e ? (m = (d.width - g.width) / 2, y = (d.height - g.height) / 2) : (m = o.position.x + (d.width - g.width) / 2, y = o.position.y + (d.height - g.height) / 2), u[h] = {
            position: { x: m, y },
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
            Vo(o, t.nodes, l, s), l.reroutedEdges = Bo(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Vo(o, t.nodes, l, s), l.reroutedEdges = Bo(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Vo(o, t.nodes, l, s), l.reroutedEdges = Bo(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && qg(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? Xn;
        Bs(o, t.nodes, i, r);
        const l = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const p = h.dimensions ?? Xn;
            let g, m;
            h.parentId === e ? (g = (a.width - p.width) / 2, m = (a.height - p.height) / 2) : (g = o.position.x + (a.width - p.width) / 2, m = o.position.y + (a.height - p.height) / 2), h.position = { x: g, y: m }, h.style = { ...h.style || {}, opacity: "0" }, l[u] = {
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
        Bs(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return Vs(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return xt(e, t.nodes).size;
    }
  };
}
function Xg(t) {
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
function Wg(t) {
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
const jg = 8, Ug = 12, Gg = 2;
function Fi(t) {
  return {
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? ve
  };
}
function Zg(t) {
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
function Kg(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function qs(t, e, n) {
  const o = e.gap ?? jg, i = e.padding ?? Ug, r = e.headerHeight ?? 0, s = Zg(e), a = Kg(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Jg(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? Qg(a, o, i, r, s, u, l, c) : ep(a, o, i, r, s, e.columns ?? Gg, d, u, l, c);
}
function Jg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Fi(f));
  for (const f of c) l = Math.max(l, f.width);
  const d = r > 0 ? r : l;
  let u = n + o;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], p = c[f];
    s.set(h.id, { x: n, y: u }), (i === "width" || i === "both") && a.set(h.id, { width: d, height: p.height }), u += p.height + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: d + n * 2, height: u }
  };
}
function Qg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Fi(f));
  for (const f of c) l = Math.max(l, f.height);
  const d = r > 0 ? r : l;
  let u = n;
  for (let f = 0; f < t.length; f++) {
    const h = t[f], p = c[f];
    s.set(h.id, { x: u, y: n + o }), (i === "height" || i === "both") && a.set(h.id, { width: p.width, height: d }), u += p.width + e;
  }
  return u -= e, u += n, {
    positions: s,
    dimensions: a,
    parentDimensions: { width: u, height: d + n * 2 + o }
  };
}
function ep(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), u = t.map((y) => Fi(y));
  let f = 0, h = 0;
  for (const y of u)
    f = Math.max(f, y.width), h = Math.max(h, y.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (f = p);
  const g = Math.ceil(t.length / d), m = a > 0 ? (a - (g - 1) * e) / g : 0;
  m > 0 && (h = m);
  for (let y = 0; y < t.length; y++) {
    const b = y % d, S = Math.floor(y / d), x = n + b * (f + e), k = n + o + S * (h + e);
    l.set(t[y].id, { x, y: k }), i === "both" ? c.set(t[y].id, { width: f, height: h }) : i === "width" ? c.set(t[y].id, { width: f, height: u[y].height }) : i === "height" && c.set(t[y].id, { width: u[y].width, height: h });
  }
  return {
    positions: l,
    dimensions: c,
    parentDimensions: {
      width: d * f + (d - 1) * e + n * 2,
      height: g * h + (g - 1) * e + n * 2 + o
    }
  };
}
function tp(t) {
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
            n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: o }), n?.onApplied?.();
          }
        });
      } else {
        for (const i of t.nodes) {
          const r = e.get(i.id);
          r && (i.position || (i.position = { x: 0, y: 0 }), i.position.x = r.x, i.position.y = r.y);
        }
        n?.fitView !== !1 && t.fitView?.({ padding: 0.2, duration: 0 }), n?.onApplied && queueMicrotask(n.onApplied);
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
      const u = t.nodes.find((x) => x.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((x) => x.parentId === e);
      a && (f = f.filter((x) => x.id !== a)), l && !f.some((x) => x.id === l.id) && (f = [...f, l]);
      const h = new Map(f.map((x) => [x.id, x]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const x of f)
          x.childLayout && this.layoutChildren(x.id, { excludeId: s, omitFromComputation: a, shallow: !1 });
      const p = u.childLayout, g = p.headerHeight !== void 0 ? p : u.data?.label ? { ...p, headerHeight: 30 } : p, m = qs(f, g, d);
      for (const [x, k] of m.positions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const v = h.get(x);
        v && (v.position ? (v.position.x = k.x, v.position.y = k.y) : v.position = { x: k.x, y: k.y });
      }
      for (const [x, k] of m.dimensions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const v = h.get(x);
        if (v) {
          let C = k.width, T = k.height;
          v.minDimensions && (v.minDimensions.width != null && (C = Math.max(C, v.minDimensions.width)), v.minDimensions.height != null && (T = Math.max(T, v.minDimensions.height))), v.maxDimensions && (v.maxDimensions.width != null && (C = Math.min(C, v.maxDimensions.width)), v.maxDimensions.height != null && (T = Math.min(T, v.maxDimensions.height))), v.dimensions ? (v.dimensions.width = C, v.dimensions.height = T) : v.dimensions = { width: C, height: T }, v.childLayout && !c && this.layoutChildren(x, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: v.dimensions });
        }
      }
      let y = m.parentDimensions.width, b = m.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (y = Math.max(y, u.minDimensions.width)), u.minDimensions.height != null && (b = Math.max(b, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (y = Math.min(y, u.maxDimensions.width)), u.maxDimensions.height != null && (b = Math.min(b, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = y, u.dimensions.height = b, y !== m.parentDimensions.width || b !== m.parentDimensions.height) {
        const k = qs(f, g, { width: y, height: b });
        for (const [v, C] of k.positions) {
          if (v === s || l && v === l.id && !t._nodeMap.has(v)) continue;
          const T = h.get(v);
          T && (T.position ? (T.position.x = C.x, T.position.y = C.y) : T.position = { x: C.x, y: C.y });
        }
        for (const [v, C] of k.dimensions) {
          if (v === s || l && v === l.id && !t._nodeMap.has(v)) continue;
          const T = h.get(v);
          if (T) {
            let R = C.width, L = C.height;
            T.minDimensions && (T.minDimensions.width != null && (R = Math.max(R, T.minDimensions.width)), T.minDimensions.height != null && (L = Math.max(L, T.minDimensions.height))), T.maxDimensions && (T.maxDimensions.width != null && (R = Math.min(R, T.maxDimensions.width)), T.maxDimensions.height != null && (L = Math.min(L, T.maxDimensions.height))), T.dimensions ? (T.dimensions.width = R, T.dimensions.height = L) : T.dimensions = { width: R, height: L }, T.childLayout && !c && this.layoutChildren(v, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: T.dimensions });
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
      const n = Lt("layout:dagre");
      if (!n)
        throw new Error("layout() requires the dagre plugin. Register it with: Alpine.plugin(AlpineFlowDagre)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((a) => !a.parentId), r = n(i, t.edges, {
        direction: o,
        nodesep: e?.nodesep,
        ranksep: e?.ranksep
      }), s = Object.fromEntries(r);
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration,
        onApplied: () => t._emit("layout-end", { type: "dagre", direction: o, positions: s })
      }), B("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o, positions: Object.fromEntries(r) });
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
      const n = Lt("layout:force");
      if (!n)
        throw new Error("forceLayout() requires the force plugin. Register it with: Alpine.plugin(AlpineFlowForce)");
      const o = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), i = n(o, t.edges, {
        strength: e?.strength,
        distance: e?.distance,
        charge: e?.charge,
        iterations: e?.iterations,
        center: e?.center
      }), r = Object.fromEntries(i);
      this._applyLayout(i, {
        fitView: e?.fitView,
        duration: e?.duration,
        onApplied: () => t._emit("layout-end", {
          type: "force",
          charge: e?.charge ?? -300,
          distance: e?.distance ?? 150,
          positions: r
        })
      }), B("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", {
        type: "force",
        charge: e?.charge ?? -300,
        distance: e?.distance ?? 150,
        positions: Object.fromEntries(i)
      });
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
      const n = Lt("layout:hierarchy");
      if (!n)
        throw new Error("treeLayout() requires the hierarchy plugin. Register it with: Alpine.plugin(AlpineFlowHierarchy)");
      const o = e?.direction ?? "TB", i = e?.includeChildren ? t.nodes : t.nodes.filter((a) => !a.parentId), r = n(i, t.edges, {
        layoutType: e?.layoutType,
        direction: o,
        nodeWidth: e?.nodeWidth,
        nodeHeight: e?.nodeHeight
      }), s = Object.fromEntries(r);
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration,
        onApplied: () => t._emit("layout-end", {
          type: "tree",
          layoutType: e?.layoutType ?? "tree",
          direction: o,
          positions: s
        })
      }), B("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", {
        type: "tree",
        layoutType: e?.layoutType ?? "tree",
        direction: o,
        positions: Object.fromEntries(r)
      });
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
      const n = Lt("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((a) => !a.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing,
        aspectRatio: e?.aspectRatio,
        layoutOptions: e?.layoutOptions
      });
      if (r.size === 0) {
        B("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      const s = Object.fromEntries(r);
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration,
        onApplied: () => t._emit("layout-end", {
          type: "elk",
          algorithm: e?.algorithm ?? "layered",
          direction: o,
          positions: s
        })
      }), B("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", {
        type: "elk",
        algorithm: e?.algorithm ?? "layered",
        direction: o,
        positions: Object.fromEntries(r)
      });
    }
  };
}
function np(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return yn(n, t._config.childValidationRules ?? {});
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
        const r = yn(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((l) => l.parentId === o), a = Ds(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = yn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = Ds(n, i, o);
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
              ), p = po(f, o, h, u);
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = Nt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
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
      if (!r || xt(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = $a(r, o, d, s);
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
            ), h = po(u, o, f, d);
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
      if (o.position.x = a.x - l.x, o.position.y = a.y - l.y, o.parentId = n, t.nodes = Nt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function op(t) {
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
function Kn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), a = Math.sin(r), l = t - n, c = e - o;
  return {
    x: n + l * s - c * a,
    y: o + l * a + c * s
  };
}
function ip(t) {
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
const sp = 40;
function rp(t, e = sp) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return `M${t[0].x},${t[0].y} L${t[1].x},${t[1].y}`;
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1], l = Math.hypot(s.x - r.x, s.y - r.y) || 1, c = Math.hypot(a.x - s.x, a.y - s.y) || 1, d = Math.min(e, l / 2, c / 2), u = s.x - d * (s.x - r.x) / l, f = s.y - d * (s.y - r.y) / l, h = s.x + d * (a.x - s.x) / c, p = s.y + d * (a.y - s.y) / c, g = 0.5;
    n += ` L${u},${f} C${u + g * (s.x - u)},${f + g * (s.y - f)} ${h + g * (s.x - h)},${p + g * (s.y - p)} ${h},${p}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ap(t) {
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
function lp({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s,
  channelOffset: a
}) {
  if (!s || s.length === 0)
    return fo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = Ni(t, e, n, o, i, r, s);
  if (!l)
    return fo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const c = xa(l, a, s), d = rp(c), { x: u, y: f, offsetX: h, offsetY: p } = ap(c);
  return {
    path: d,
    labelPosition: { x: u, y: f },
    labelOffsetX: h,
    labelOffsetY: p
  };
}
function cp(t) {
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
      c = Ys(l);
      break;
    case "step":
      c = dp(l, 0);
      break;
    case "smoothstep":
      c = up(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = ip(l.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Ys(l);
  }
  const d = fp(l), u = An({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Ys(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function dp(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return za(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += Ut(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function za(t, e, n) {
  const o = (t.x + e.x) / 2, i = Ut(t.x, t.y, o, t.y, o, e.y, n), r = Ut(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function up(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return za(t[0], t[1], e);
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
    o += Ut(s.x, s.y, a.x, a.y, l.x, l.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function fp(t) {
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
function Kt(t, e, n, o) {
  const i = t.dimensions?.width ?? we, r = t.dimensions?.height ?? ve, s = Jt(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? Ta[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = Is(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = Is(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = Kn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function Xs(t) {
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
function pi(t) {
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
const hp = 1.5, gp = 5 / 20;
function Ot(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = pi(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const l = (i.width ?? 12.5) * hp * gp * 0.4, c = r + l, d = pi(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function yo(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d, u, f) {
  const h = r ?? Kt(e, o, c, d), p = s ?? Kt(n, i, c, d), g = {
    sourceX: h.x,
    sourceY: h.y,
    sourcePosition: Xs(o),
    targetX: p.x,
    targetY: p.y,
    targetPosition: Xs(i)
  }, m = t.type ?? u ?? "bezier";
  if (a?.[m])
    return a[m](g, t);
  switch (m === "floating" ? t.pathType ?? "bezier" : m) {
    case "editable":
      return cp({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return lp({ ...g, obstacles: l, channelOffset: f });
    case "orthogonal":
      return Rh({ ...g, obstacles: l, channelOffset: f });
    case "smoothstep":
      return Sn(g);
    case "straight":
      return ga({ sourceX: h.x, sourceY: h.y, targetX: p.x, targetY: p.y });
    default:
      return fo(g);
  }
}
function Ws(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? ve, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Kn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Kn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const l = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(a);
  let f;
  d / l > u / c ? f = l / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + a * f
  };
  return t.rotation ? Kn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function js(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? ve, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, p = e.y - r;
    return Math.abs(h) > Math.abs(p) ? h > 0 ? "right" : "left" : p > 0 ? "bottom" : "top";
  }
  const s = 1, a = t.position.x, l = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - a) <= s) return "left";
  if (Math.abs(e.x - l) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const u = e.x - i, f = e.y - r;
  return Math.abs(u) > Math.abs(f) ? u > 0 ? "right" : "left" : f > 0 ? "bottom" : "top";
}
function Va(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? ve, i = e.dimensions?.width ?? we, r = e.dimensions?.height ?? ve, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = Ws(t, a), c = Ws(e, s), d = js(t, l), u = js(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function vw(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function mi(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function Jn(t, e) {
  return `${t}__grad__${e}`;
}
function pp(t, e, n) {
  const o = t.querySelector(`#${CSS.escape(e)}`);
  if (!o)
    return !1;
  const i = o.querySelectorAll("stop");
  return i.length < 2 ? !1 : (i[0]?.setAttribute("stop-color", n.from), i[1]?.setAttribute("stop-color", n.to), !0);
}
function Ba(t, e, n, o, i, r, s) {
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
function qo(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
function To(t) {
  return t.endsWith("-l") ? { field: t.slice(0, -2), side: "left" } : t.endsWith("-r") ? { field: t.slice(0, -2), side: "right" } : { field: t, side: null };
}
function mp(t, e) {
  if (!Array.isArray(t)) return -1;
  const n = t.findIndex((r) => r?.name === e);
  if (n >= 0) return n;
  const { field: o, side: i } = To(e);
  return i === null ? -1 : t.findIndex((r) => r?.name === o);
}
function Us(t, e) {
  if (!Array.isArray(t) || !e || t.some((i) => i?.name === e)) return null;
  const { field: n, side: o } = To(e);
  return o === null ? null : t.some((i) => i?.name === n) ? o : null;
}
function Gs(t, e, n, o, i) {
  const r = t.data?.fields;
  if (!Array.isArray(r) || !Number.isInteger(n) || n < 0 || n >= r.length) return null;
  const { width: s, height: a } = t.dimensions ?? {};
  if (typeof s != "number" || !Number.isFinite(s) || typeof a != "number" || !Number.isFinite(a)) return null;
  const { headerHeight: l, rowHeight: c, handleOffsetY: d, handleOffsetYLast: u, insetLeft: f, insetRight: h, insetTop: p } = i;
  if (!Number.isFinite(l) || !Number.isFinite(c) || !Number.isFinite(d) || !Number.isFinite(u) || !Number.isFinite(f) || !Number.isFinite(h) || !Number.isFinite(p))
    return null;
  const g = n === r.length - 1 ? u : d, m = e.y + p + l + n * c + g;
  return { x: o === "left" ? e.x + f : e.x + s - h, y: m, position: o };
}
const yp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function wp(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const a = r.getNode(e);
  if (a && !Ye(a))
    return { applied: !1 };
  const l = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await ya({
    edge: i,
    newConnection: l,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: l }), { applied: !0, newConnection: l }) : { applied: !1, reason: d.reason, newConnection: l };
}
function _p(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function Zs(t, e) {
  if (!e) return t;
  const n = pi(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function Ks(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function wo(t, e) {
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
function _o(t, e, n, o, i, r, s) {
  const a = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (a) {
    if (n) {
      const c = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = wo(c, r);
      if (!d) {
        const u = a.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = wo(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const { field: c, side: d } = To(n);
      if (d && (a.querySelector(
        `[data-flow-handle-id="${CSS.escape(c)}"][data-flow-handle-type="${o}"][data-flow-handle-position="${d}"]`
      ) || a.querySelector(`[data-flow-handle-position="${d}"]`)))
        return d;
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
function Js(t, e, n, o) {
  if (!t || !e || t.hidden || t.collapsed || t.condensed || t.rotation) return -1;
  const i = t.nodeOrigin;
  if (i && (i[0] !== 0 || i[1] !== 0) || !n?.hasAttribute("data-flow-schema-node") || n.style.display === "none") return -1;
  const r = t.dimensions?.width, s = t.dimensions?.height;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s)) return -1;
  const a = t.data?.fields;
  if (!Array.isArray(a) || a.length === 0) return -1;
  const l = o.insetTop + o.headerHeight + (a.length - 1) * o.rowHeight + o.rowHeightLast + o.insetBottom;
  return Math.abs(l - s) > 0.5 ? -1 : mp(a, e);
}
function Qs(t, e, n, o, i) {
  const r = t.dimensions?.width ?? we, s = e.x + (i.insetLeft + (r - i.insetRight)) / 2;
  return n === "source" ? o >= s ? "right" : "left" : o > s ? "right" : "left";
}
function er(t) {
  return t.position.x + (t.dimensions?.width ?? we) / 2;
}
function vp(t, e, n, o, i, r, s, a) {
  const l = Js(t, i, s?.get(t.id), a);
  if (l < 0) return null;
  const c = Js(e, r, s?.get(e.id), a);
  if (c < 0) return null;
  const d = t.data?.fields, u = e.data?.fields, f = Us(d, i) ?? Qs(t, n.position, "source", er(o), a), h = Us(u, r) ?? Qs(e, o.position, "target", er(n), a), p = Gs(t, n.position, l, f, a), g = Gs(e, o.position, c, h, a);
  if (!p || !g) return null;
  const m = { handleWidth: a.handleWidth, handleHeight: a.handleHeight };
  return {
    sourcePos: p.position,
    targetPos: g.position,
    srcMeasurement: { x: p.x, y: p.y, ...m },
    tgtMeasurement: { x: g.x, y: g.y, ...m }
  };
}
function tr(t, e, n, o, i, r, s, a, l) {
  const c = l ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const g = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = wo(g, a), !d) {
      const m = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = wo(m, a);
    }
    if (!d) {
      const { field: m, side: y } = To(o);
      y && (d = c.querySelector(
        `[data-flow-handle-id="${CSS.escape(m)}"][data-flow-handle-type="${i}"][data-flow-handle-position="${y}"]`
      ) ?? c.querySelector(`[data-flow-handle-position="${y}"]`));
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
function bp(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function ht(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function xp(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function Ep(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
      a.setAttribute("fill", "none"), a.style.stroke = "transparent", a.style.strokeWidth = "20", a.style.pointerEvents = "stroke", a.style.cursor = "pointer", s.appendChild(a);
      let l = e.querySelector("path:not(:first-child)");
      l || (l = document.createElementNS("http://www.w3.org/2000/svg", "path"), l.setAttribute("fill", "none"), l.setAttribute("stroke-width", "1.5"), l.style.pointerEvents = "none", s.appendChild(l));
      let c = null, d = null, u = null, f = null, h = 0, p = null, g = "none", m = null, y = null;
      function b(E, P, F, W, Q) {
        p || (p = document.createElementNS("http://www.w3.org/2000/svg", "circle"), p.classList.add("flow-edge-dot"), p.style.pointerEvents = "none", E.appendChild(p));
        const G = F.closest(".flow-container"), j = G ? getComputedStyle(G) : null, Z = W.particleSize ?? (parseFloat(j?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), O = Q || j?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        p.setAttribute("r", String(Z)), W.particleColor ? p.style.fill = W.particleColor : p.style.removeProperty("fill");
        const q = p.querySelector("animateMotion");
        q && q.remove();
        const Y = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        Y.setAttribute("dur", O), Y.setAttribute("repeatCount", "indefinite"), Y.setAttribute("path", P), p.appendChild(Y);
      }
      function S() {
        p?.remove(), p = null;
      }
      let x = null, k = null, v = null, C = null;
      const T = (E) => {
        E.stopPropagation();
        const P = o(n);
        if (!P) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: P, event: E }), li(P, F._config?.edgesSelectable !== !1) && (bt(E, F._shortcuts?.multiSelect) ? F.selectedEdges.has(P.id) ? (F.selectedEdges.delete(P.id), P.selected = !1, B("selection", `Edge "${P.id}" deselected (shift)`)) : (F.selectedEdges.add(P.id), P.selected = !0, B("selection", `Edge "${P.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add(P.id), P.selected = !0, B("selection", `Edge "${P.id}" selected`)), F._emitSelectionChange()));
      }, R = (E) => {
        E.preventDefault(), E.stopPropagation();
        const P = o(n);
        if (!P) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = E.target;
        if (W.classList.contains("flow-edge-control-point")) {
          const Q = parseInt(W.dataset.pointIndex ?? "", 10);
          if (!isNaN(Q)) {
            F._emit("edge-control-point-context-menu", {
              edge: P,
              pointIndex: Q,
              position: { x: E.clientX, y: E.clientY },
              event: E
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: P, event: E });
      }, L = (E) => {
        E.stopPropagation(), E.preventDefault();
        const P = o(n), F = t.$data(e.closest("[x-data]"));
        if (!P || !F || (P.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const Q = E.target;
        if (Q.classList.contains("flow-edge-control-point")) {
          const G = parseInt(Q.dataset.pointIndex ?? "", 10);
          !isNaN(G) && P.controlPoints && (F._captureHistory?.(), P.controlPoints.splice(G, 1), F._emit("edge-control-point-change", { edge: P, action: "remove", index: G }));
          return;
        }
        if (Q.classList.contains("flow-edge-midpoint")) {
          const G = parseInt(Q.dataset.segmentIndex ?? "", 10);
          if (!isNaN(G)) {
            const j = F.screenToFlowPosition(E.clientX, E.clientY);
            P.controlPoints || (P.controlPoints = []), F._captureHistory?.(), P.controlPoints.splice(G, 0, { x: j.x, y: j.y }), F._emit("edge-control-point-change", { edge: P, action: "add", index: G });
          }
          return;
        }
        if (Q.closest("path")) {
          const G = F.screenToFlowPosition(E.clientX, E.clientY);
          P.controlPoints || (P.controlPoints = []);
          const j = [
            x ?? { x: 0, y: 0 },
            ...P.controlPoints,
            k ?? { x: 0, y: 0 }
          ];
          let Z = 0, O = 1 / 0;
          for (let q = 0; q < j.length - 1; q++) {
            const Y = xp(G, j[q], j[q + 1]);
            Y < O && (O = Y, Z = q);
          }
          F._captureHistory?.(), P.controlPoints.splice(Z, 0, { x: G.x, y: G.y }), F._emit("edge-control-point-change", { edge: P, action: "add", index: Z });
        }
      }, D = (E) => {
        const P = E.target;
        if (!P.classList.contains("flow-edge-control-point") || E.button !== 0) return;
        E.stopPropagation(), E.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const W = t.$data(e.closest("[x-data]"));
        if (!W) return;
        const Q = parseInt(P.dataset.pointIndex ?? "", 10);
        if (isNaN(Q)) return;
        P.classList.add("dragging");
        let G = !1;
        const j = (O) => {
          G || (W._captureHistory?.(), G = !0);
          let q = W.screenToFlowPosition(O.clientX, O.clientY);
          const Y = W._config?.snapToGrid;
          Y && (q = {
            x: Math.round(q.x / Y[0]) * Y[0],
            y: Math.round(q.y / Y[1]) * Y[1]
          }), F.controlPoints[Q] = q;
        }, Z = () => {
          document.removeEventListener("pointermove", j), document.removeEventListener("pointerup", Z), P.classList.remove("dragging"), G && W._emit("edge-control-point-change", { edge: F, action: "move", index: Q });
        };
        document.addEventListener("pointermove", j), document.addEventListener("pointerup", Z);
      };
      s.addEventListener("contextmenu", R), s.addEventListener("dblclick", L), s.addEventListener("pointerdown", D, !0);
      let A = null;
      const _ = (E) => {
        if (E.button !== 0) return;
        E.stopPropagation();
        const P = o(n);
        if (!P) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = F._config?.reconnectSnapRadius ?? ds, Q = F._config?.edgesReconnectable !== !1, G = P.reconnectable ?? !0;
        let j = null;
        if (Q && G !== !1 && x && k) {
          const oe = F.screenToFlowPosition(E.clientX, E.clientY), ge = ht(oe.x, oe.y, x.x, x.y, W) || v && ht(oe.x, oe.y, v.x, v.y, W);
          (ht(oe.x, oe.y, k.x, k.y, W) || C && ht(oe.x, oe.y, C.x, C.y, W)) && (G === !0 || G === "target") ? j = "target" : ge && (G === !0 || G === "source") && (j = "source");
        }
        if (!j) {
          const oe = (ge) => {
            document.removeEventListener("pointerup", oe), T(ge);
          };
          document.addEventListener("pointerup", oe, { once: !0 });
          return;
        }
        const Z = E.clientX, O = E.clientY;
        let q = !1, Y = !1, K = null;
        const z = F._config?.connectionSnapRadius ?? 20;
        let J = null, ee = null, U = null, re = Z, se = O;
        const ie = e.closest(".flow-container");
        if (!ie) return;
        const te = j === "target" ? x : k, ne = () => {
          q = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: P, handleType: j }), B("reconnect", `Reconnection drag started on edge "${P.id}" (${j} end)`), ee = Gt({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), J = ee.svg;
          const oe = F.screenToFlowPosition(Z, O);
          ee.update({
            fromX: te.x,
            fromY: te.y,
            toX: oe.x,
            toY: oe.y,
            source: P.source,
            sourceHandle: P.sourceHandle
          });
          const ge = ie.querySelector(".flow-viewport");
          ge && ge.appendChild(J), j === "target" && (F.pendingConnection = {
            source: P.source,
            sourceHandle: P.sourceHandle,
            position: oe
          }), F._pendingReconnection = {
            edge: P,
            draggedEnd: j,
            anchorPosition: { ...te },
            position: oe
          }, U = Lo(ie, F, re, se), j === "target" && Ln(ie, P.source, P.sourceHandle ?? "source", F, P.id);
        }, pe = (oe) => {
          if (re = oe.clientX, se = oe.clientY, !q) {
            Math.sqrt(
              (oe.clientX - Z) ** 2 + (oe.clientY - O) ** 2
            ) >= ao && ne();
            return;
          }
          const ge = F.screenToFlowPosition(oe.clientX, oe.clientY), me = kn({
            containerEl: ie,
            handleType: j === "target" ? "target" : "source",
            excludeNodeId: j === "target" ? P.source : P.target,
            cursorFlowPos: ge,
            connectionSnapRadius: z,
            getNode: (Pe) => F.getNode(Pe),
            toFlowPosition: (Pe, Ve) => F.screenToFlowPosition(Pe, Ve)
          });
          me.element !== K && (K?.classList.remove("flow-handle-active"), me.element?.classList.add("flow-handle-active"), K = me.element), ee?.update({
            fromX: te.x,
            fromY: te.y,
            toX: me.position.x,
            toY: me.position.y,
            source: P.source,
            sourceHandle: P.sourceHandle
          });
          const be = me.position;
          j === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: be
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: be
          }), U?.updatePointer(oe.clientX, oe.clientY);
        }, ue = () => {
          Y || (Y = !0, document.removeEventListener("pointermove", pe), document.removeEventListener("pointerup", le), U?.stop(), U = null, ee?.destroy(), ee = null, J = null, K?.classList.remove("flow-handle-active"), A = null, s.classList.remove("flow-edge-reconnecting"), Le(ie), F.pendingConnection = null, F._pendingReconnection = null);
        }, le = async (oe) => {
          if (!q) {
            ue(), T(oe);
            return;
          }
          if (F._connectValidating) return;
          let ge = K, me = null;
          if (!ge) {
            me = document.elementFromPoint(oe.clientX, oe.clientY);
            const Ee = j === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            ge = me?.closest(Ee);
          }
          const Pe = (ge ? ge.closest("[data-flow-node-id]") : me?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Ve = ge?.dataset.flowHandleId, ke = ee?.svg ?? null;
          Pt(ke, !0);
          let fe;
          try {
            fe = await wp({
              dropNodeId: Pe,
              dropHandleId: Ve,
              draggedEnd: j,
              edge: P,
              canvas: F,
              containerEl: ie
            });
          } finally {
            Pt(ke, !1);
          }
          fe.applied ? B("reconnect", `Edge "${P.id}" reconnected (${j})`, fe.newConnection) : B("reconnect", `Edge "${P.id}" reconnection cancelled — snapping back`, { reason: fe.reason }), F._emit("reconnect-end", { edge: P, successful: fe.applied }), ue();
        };
        document.addEventListener("pointermove", pe), document.addEventListener("pointerup", le), A = ue;
      };
      s.addEventListener("pointerdown", _);
      const w = (E) => {
        const P = o(n);
        if (!P) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = F._config?.edgesReconnectable !== !1, Q = P.reconnectable ?? !0;
        if (!W || Q === !1 || !x || !k) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const G = F._config?.reconnectSnapRadius ?? ds, j = F.screenToFlowPosition(E.clientX, E.clientY), Z = (ht(j.x, j.y, x.x, x.y, G) || v && ht(j.x, j.y, v.x, v.y, G)) && (Q === !0 || Q === "source"), O = (ht(j.x, j.y, k.x, k.y, G) || C && ht(j.x, j.y, C.x, C.y, G)) && (Q === !0 || Q === "target");
        Z || O ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", w);
      const N = (E) => {
        if (E.key !== "Enter" && E.key !== " ") return;
        E.preventDefault(), E.stopPropagation();
        const P = o(n);
        if (!P) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: P, event: E }), li(P, F._config?.edgesSelectable !== !1) && (bt(E, F._shortcuts?.multiSelect) ? F.selectedEdges.has(P.id) ? (F.selectedEdges.delete(P.id), P.selected = !1) : (F.selectedEdges.add(P.id), P.selected = !0) : (F.deselectAll(), F.selectedEdges.add(P.id), P.selected = !0), F._emitSelectionChange()));
      };
      s.addEventListener("keydown", N);
      const M = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, I = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", M), s.addEventListener("blur", I);
      const H = (E) => {
        E.stopPropagation();
      };
      s.addEventListener("mousedown", H);
      const V = () => {
        for (const E of [c, d, u])
          E && E.classList.add("flow-edge-hovered");
      }, $ = () => {
        for (const E of [c, d, u])
          E && E.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", V), s.addEventListener("mouseleave", $), i(() => {
        const E = o(n);
        if (!E || !l) return;
        s.setAttribute("data-flow-edge-id", E.id);
        const P = t.$data(e.closest("[x-data]"));
        if (!P?.nodes) return;
        const F = E.type ?? P._config?.defaultEdgeType ?? "bezier", W = P._config?.edgeLod;
        let Q = F;
        if (W) {
          const X = P._zoomLevel;
          (W.simplifyAt === "medium" && X === "medium" || X === "far") && (Q = "straight");
        }
        P._layoutAnimTick, P._edgeDirtyTicks?.get(E.id);
        const G = P.getNode(E.source), j = P.getNode(E.target);
        if (!G || !j) return;
        G.sourcePosition, j.targetPosition;
        const Z = ct(G, P._nodeMap, P._config?.nodeOrigin), O = ct(j, P._nodeMap, P._config?.nodeOrigin), q = e.closest("[x-data]");
        let Y, K, z, J;
        const ee = P._schemaMetrics, U = P._config?.nodeOrigin, re = F !== "floating" && P._config?.schemaHandleGeometry !== "dom" && ee && (!U || U[0] === 0 && U[1] === 0) ? vp(
          G,
          j,
          Z,
          O,
          E.sourceHandle,
          E.targetHandle,
          P._nodeElements,
          ee
        ) : null;
        if (F === "floating") {
          const X = Va(Z, O);
          Y = X.sourcePos, K = X.targetPos, z = { x: X.sx, y: X.sy, handleWidth: 0, handleHeight: 0 }, J = { x: X.tx, y: X.ty, handleWidth: 0, handleHeight: 0 }, x = { x: X.sx, y: X.sy }, k = { x: X.tx, y: X.ty };
        } else if (re)
          Y = re.sourcePos, K = re.targetPos, z = re.srcMeasurement, J = re.tgtMeasurement, x = { x: z.x, y: z.y }, k = { x: J.x, y: J.y };
        else {
          const X = P._nodeElements?.get(E.source) ?? q.querySelector(`[data-flow-node-id="${CSS.escape(E.source)}"]`), ae = P._nodeElements?.get(E.target) ?? q.querySelector(`[data-flow-node-id="${CSS.escape(E.target)}"]`), de = X ? Ks(X.getBoundingClientRect()) : void 0, ce = ae ? Ks(ae.getBoundingClientRect()) : void 0;
          Y = _o(q, E.source, E.sourceHandle, "source", G, ce, X), K = _o(q, E.target, E.targetHandle, "target", j, de, ae);
          const he = t.raw(P).viewport ?? { x: 0, y: 0, zoom: 1 }, ye = he.zoom || 1, xe = G.rotation, Ae = j.rotation;
          Y = Zs(Y, xe), K = Zs(K, Ae), z = tr(q, E.source, Z, E.sourceHandle, "source", ye, he, ce, X), J = tr(q, E.target, O, E.targetHandle, "target", ye, he, de, ae);
          const Re = Kt(Z, Y, P._shapeRegistry, P._config?.nodeOrigin), Me = Kt(O, K, P._shapeRegistry, P._config?.nodeOrigin);
          x = z ?? Re, k = J ?? Me;
        }
        let se = Ot(z ?? x, Y, z, E.markerStart), ie = Ot(J ?? k, K, J, E.markerEnd);
        if (F === "orthogonal" || F === "avoidant") {
          const X = t.raw(P._endpointSpreadGrouping);
          if (X) {
            const ae = ho(G.endpointSpread ?? P._config?.avoidantEndpointSpread);
            if (ae !== null) {
              const ce = X.get(`${E.source}|${E.sourceHandle ?? ""}`), he = ce?.lanes.get(E.id);
              if (ce && he !== void 0 && ce.count > 1) {
                const ye = P._schemaMetrics?.rowHeight ?? z?.handleHeight ?? 0;
                se = Ns(se, Y, As(he, ce.count, ye, ae));
              }
            }
            const de = ho(j.endpointSpread ?? P._config?.avoidantEndpointSpread);
            if (de !== null) {
              const ce = X.get(`${E.target}|${E.targetHandle ?? ""}`), he = ce?.lanes.get(E.id);
              if (ce && he !== void 0 && ce.count > 1) {
                const ye = P._schemaMetrics?.rowHeight ?? J?.handleHeight ?? 0;
                ie = Ns(ie, K, As(he, ce.count, ye, de));
              }
            }
          }
        }
        v = se, C = ie;
        let te;
        if (F === "orthogonal" || F === "avoidant")
          if (P._config?.avoidantSimplifyOnDrag !== !1 && (P._draggingNodeIds?.has(E.source) || P._draggingNodeIds?.has(E.target)))
            te = void 0;
          else {
            const ae = t.raw(P._obstacleSnapshot);
            if (ae)
              te = ae.filter((de) => de.id !== E.source && de.id !== E.target);
            else {
              const de = t.raw(P.nodes), ce = new Map(de.map((ye) => [ye.id, ye])), he = P._config?.nodeOrigin;
              te = de.filter((ye) => ye.id !== E.source && ye.id !== E.target).map((ye) => {
                const xe = ct(ye, ce, he);
                return {
                  x: xe.position.x,
                  y: xe.position.y,
                  width: xe.dimensions?.width ?? we,
                  height: xe.dimensions?.height ?? ve
                };
              });
            }
          }
        let ne = 0;
        (F === "orthogonal" || F === "avoidant") && (ne = t.raw(P._crossingPlan)?.get(E.id) ?? 0);
        const pe = Q === F ? E : { ...E, type: Q }, { path: ue, labelPosition: le } = yo(pe, Z, O, Y, K, se, ie, P._config?.edgeTypes, te, P._shapeRegistry, P._config?.nodeOrigin, P._config?.defaultEdgeType, ne);
        l.setAttribute("d", ue), a.setAttribute("d", ue), (F === "orthogonal" || F === "avoidant") && t.raw(P._edgeCorridors)?.set(E.id, {
          minX: Math.min(se.x, ie.x),
          minY: Math.min(se.y, ie.y),
          maxX: Math.max(se.x, ie.x),
          maxY: Math.max(se.y, ie.y)
        });
        const oe = F === "editable", ge = oe && (E.showControlPoints || E.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((X) => X.remove()), ge) {
          const X = E.controlPoints ?? [], ae = P.viewport?.zoom ?? 1, de = 6 / ae, ce = 5 / ae, he = x ?? { x: 0, y: 0 }, ye = k ?? { x: 0, y: 0 }, xe = [he, ...X, ye], Ae = xe.length - 1, Re = l.getTotalLength?.() ?? 0;
          if (Re > 0) {
            const Me = [0], Ce = 200;
            let tn = 1;
            for (let et = 1; et <= Ce && tn < xe.length; et++) {
              const $n = et / Ce * Re, nn = l.getPointAtLength($n), Ze = xe[tn], on = nn.x - Ze.x, qi = nn.y - Ze.y;
              on * on + qi * qi < 25 && (Me.push($n), tn++);
            }
            for (; Me.length <= Ae; )
              Me.push(Re);
            for (let et = 0; et < Ae; et++) {
              const $n = (Me[et] + Me[et + 1]) / 2, nn = l.getPointAtLength($n), Ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              Ze.classList.add("flow-edge-midpoint"), Ze.setAttribute("cx", String(nn.x)), Ze.setAttribute("cy", String(nn.y)), Ze.setAttribute("r", String(ce)), Ze.dataset.segmentIndex = String(et);
              const on = document.createElementNS("http://www.w3.org/2000/svg", "title");
              on.textContent = "Double-click to add control point", Ze.appendChild(on), s.appendChild(Ze);
            }
          }
          for (let Me = 0; Me < X.length; Me++) {
            const Ce = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            Ce.classList.add("flow-edge-control-point"), Ce.setAttribute("cx", String(X[Me].x)), Ce.setAttribute("cy", String(X[Me].y)), Ce.setAttribute("r", String(de)), Ce.dataset.pointIndex = String(Me), s.appendChild(Ce);
          }
        }
        if (a.style.cursor = oe ? "crosshair" : "pointer", a.style.strokeWidth = String(
          E.interactionWidth ?? P._config?.defaultInteractionWidth ?? 20
        ), E.markerStart != null) {
          const X = Bt(E.markerStart), ae = qt(X, P._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else if (E._renderDualMarker && E.markerEnd) {
          const X = Bt(E.markerEnd), ae = qt(X, P._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else
          l.removeAttribute("marker-start");
        if (E.markerEnd) {
          const X = Bt(E.markerEnd), ae = qt(X, P._id);
          l.setAttribute("marker-end", `url(#${ae})`);
        } else
          l.removeAttribute("marker-end");
        const me = E.strokeWidth ?? 1.5, be = _p(E.animated);
        switch (be !== g && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), g === "dot" && S(), g = be), be) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            b(s, ue, q, E, E.animationDuration);
            break;
        }
        if (E.animationDuration && be !== "none" ? (be === "dash" || be === "pulse") && (l.style.animationDuration = E.animationDuration) : (be === "dash" || be === "pulse") && l.style.removeProperty("animation-duration"), y && y !== E.class && s.classList.remove(...y.split(" ").filter(Boolean)), E.class) {
          const X = be === "dash" ? " flow-edge-animated" : be === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", E.class + X), s.classList.add(...E.class.split(" ").filter(Boolean)), y = E.class;
        } else
          y && (s.classList.remove(...y.split(" ").filter(Boolean)), y = null);
        if (s.setAttribute("aria-selected", String(!!E.selected)), E.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(me + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + En + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(me);
          const X = P._markerDefsEl?.querySelector("defs") ?? null;
          if (mi(E.color)) {
            if (X) {
              const ae = Jn(P._id, E.id), de = E.gradientDirection === "target-source", ce = x.x, he = x.y, ye = k.x, xe = k.y;
              Ba(
                X,
                ae,
                de ? { from: E.color.to, to: E.color.from } : E.color,
                ce,
                he,
                ye,
                xe
              ), l.style.stroke = `url(#${ae})`, m = ae;
            }
          } else if (E.color) {
            if (m) {
              const ae = X;
              ae && qo(ae, m), m = null;
            }
            l.style.stroke = E.color;
          } else {
            if (m) {
              const ae = X;
              ae && qo(ae, m), m = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (!E.selected && ((E.sourceHandle ? P.selectedRows?.has(E.sourceHandle.replace(/-[lr]$/, "")) : !1) || (E.targetHandle ? P.selectedRows?.has(E.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), E.selected || (l.style.strokeWidth = String(Math.max(me + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), E.focusable ?? P._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", E.ariaRole ?? "group"), s.setAttribute("aria-label", E.ariaLabel ?? (E.label ? `Edge: ${E.label}` : `Edge from ${E.source} to ${E.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), E.domAttributes)
          for (const [X, ae] of Object.entries(E.domAttributes))
            X.startsWith("on") || yp.has(X.toLowerCase()) || s.setAttribute(X, ae);
        const ke = (X, ae, de, ce, he, ye) => {
          if (ae) {
            if (!X && ce) {
              const xe = de.includes("flow-edge-label-start"), Ae = de.includes("flow-edge-label-end");
              let Re = `[data-flow-edge-id="${he}"].flow-edge-label`;
              xe ? Re += ".flow-edge-label-start" : Ae ? Re += ".flow-edge-label-end" : Re += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", X = ce.querySelector(Re);
            }
            return X || (X = document.createElement("div"), X.className = de, X.dataset.flowEdgeId = he, ce && ce.appendChild(X)), ye ? X.innerHTML !== ae && (X.innerHTML = ae) : X.textContent !== ae && (X.textContent = ae), X;
          }
          return X && X.remove(), null;
        }, fe = e.closest(".flow-viewport"), Ee = E.labelVisibility ?? "always", De = E.labelHtml === !0, Te = () => {
          const X = l.getAttribute("d") ?? "";
          return X !== f && (f = X, h = typeof l.getTotalLength == "function" && l.getTotalLength() || 0), h;
        };
        if (c = ke(c, E.label, "flow-edge-label", fe, E.id, De), c) {
          const X = Te();
          if (X > 0) {
            const ae = E.labelPosition ?? 0.5, de = bp(l, ae, X);
            c.style.left = `${de.x}px`, c.style.top = `${de.y}px`;
          } else
            c.style.left = `${le.x}px`, c.style.top = `${le.y}px`;
        }
        if (d = ke(d, E.labelStart, "flow-edge-label flow-edge-label-start", fe, E.id, De), d) {
          const X = Te();
          if (X > 0) {
            const ae = E.labelStartOffset ?? 30, de = l.getPointAtLength(Math.min(ae, X / 2));
            d.style.left = `${de.x}px`, d.style.top = `${de.y}px`;
          }
        }
        if (u = ke(u, E.labelEnd, "flow-edge-label flow-edge-label-end", fe, E.id, De), u) {
          const X = Te();
          if (X > 0) {
            const ae = E.labelEndOffset ?? 30, de = l.getPointAtLength(Math.max(X - ae, X / 2));
            u.style.left = `${de.x}px`, u.style.top = `${de.y}px`;
          }
        }
        for (const X of [c, d, u])
          X && (X.classList.toggle("flow-edge-label-hover", Ee === "hover"), X.classList.toggle("flow-edge-label-on-select", Ee === "selected"), X.classList.toggle("flow-edge-label-selected", !!E.selected), E.class ? X.classList.add(...E.class.split(" ").filter(Boolean)) : y && X.classList.remove(...y.split(" ").filter(Boolean)));
      }), r(() => {
        if (m) {
          const P = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          P && qo(P, m);
        }
        A?.(), S(), s.removeEventListener("contextmenu", R), s.removeEventListener("dblclick", L), s.removeEventListener("pointerdown", D, !0), s.removeEventListener("pointerdown", _), s.removeEventListener("pointermove", w), s.removeEventListener("keydown", N), s.removeEventListener("focus", M), s.removeEventListener("blur", I), s.removeEventListener("mousedown", H), s.removeEventListener("mouseenter", V), s.removeEventListener("mouseleave", $), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Cp(t, e) {
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
        const l = typeof a == "string" ? Cn(a) : a;
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
        s && (mi(r.color) ? s.style.stroke = `url(#${Jn(t._id, o)})` : typeof r.color == "string" && (s.style.stroke = r.color), r.strokeWidth !== void 0 && (s.style.strokeWidth = String(r.strokeWidth)));
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
    /**
     * Repaint one edge's gradient, for a colour change that moved nothing.
     *
     * Answers false where the edge has no def yet — an edge given a gradient for the first time —
     * and the caller falls back to the path refresh, which is what works the coordinates out.
     *
     * Its own entry point because the refresh is driven by which NODES moved: routing a colour
     * change through it re-paths every sibling edge on both endpoints, and re-paths them the way a
     * drag does, without obstacle avoidance, until the layout settles. On a plain graph that is
     * invisible; on an obstacle-routed one it straightens neighbours through the nodes they were
     * drawn around.
     */
    _restyleEdgeGradient(n, o) {
      const i = t._markerDefsEl?.querySelector("defs");
      if (!i)
        return !1;
      const s = t._edgeMap.get(n)?.gradientDirection === "target-source";
      return pp(
        i,
        Jn(t._id, n),
        s ? { from: o.to, to: o.from } : o
      );
    },
    /** Recompute SVG paths, label positions, and gradients for edges connected to the given node IDs. */
    _refreshEdgePaths(n) {
      for (const o of t.edges) {
        if (!n.has(o.source) && !n.has(o.target)) continue;
        const i = e.raw(t.getNode(o.source)), r = e.raw(t.getNode(o.target));
        if (!i || !r) continue;
        const s = ct(i, t._nodeMap, t._config.nodeOrigin), a = ct(r, t._nodeMap, t._config.nodeOrigin);
        let l, c, d, u;
        if (o.type === "floating") {
          const h = Va(s, a);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const p = Ot(d, h.sourcePos, null, o.markerStart), g = Ot(u, h.targetPos, null, o.markerEnd), m = yo(o, s, a, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = m.path, c = m.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const k = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), v = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (k) {
              const C = k.getBoundingClientRect();
              p = { x: (C.left + C.right) / 2, y: (C.top + C.bottom) / 2 };
            }
            if (v) {
              const C = v.getBoundingClientRect();
              g = { x: (C.left + C.right) / 2, y: (C.top + C.bottom) / 2 };
            }
          }
          const m = h ? _o(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", y = h ? _o(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = Kt(s, m, t._shapeRegistry, t._config.nodeOrigin), u = Kt(a, y, t._shapeRegistry, t._config.nodeOrigin);
          const b = Ot(d, m, null, o.markerStart), S = Ot(u, y, null, o.markerEnd), x = yo(o, s, a, m, y, b, S, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = x.path, c = x.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", l);
          const p = f.parentElement?.querySelector("path:first-child");
          p && p !== f && p.setAttribute("d", l);
        }
        if (mi(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = Jn(t._id, o.id), g = o.gradientDirection === "target-source";
            Ba(
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
              const p = f.getTotalLength(), g = o.labelStartOffset ?? 30, m = f.getPointAtLength(Math.min(g, p / 2));
              h.style.left = `${m.x}px`, h.style.top = `${m.y}px`;
            }
          }
          if (o.labelEnd && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const p = f.getTotalLength(), g = o.labelEndOffset ?? 30, m = f.getPointAtLength(Math.max(p - g, p / 2));
              h.style.left = `${m.x}px`, h.style.top = `${m.y}px`;
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
function Sp(t) {
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
              ea(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Aa(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
      ("minimapWidth" in e || "minimapHeight" in e) && t.resizeMinimap(
        n.minimapWidth ?? da,
        n.minimapHeight ?? ua
      );
    }
  };
}
let kp = 0;
function Lp(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Mp(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
const Pp = ".flow-panel, .flow-controls, .flow-minimap, .canvas-overlay";
function nr(t) {
  return t != null && t.closest(Pp) != null;
}
function Tp(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++kp}`,
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
      /** Whether interactivity (pan/zoom/drag) is enabled. Seeded from
       *  `config.interactive` (default true) so a canvas can start locked. */
      isInteractive: e.interactive !== !1,
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
        /** The other half of a selection, so a menu bound to this can act on the whole of it. */
        edges: null,
        event: null
      },
      // ── Shape Registry ─────────────────────────────────────────────────
      _shapeRegistry: { ...Ta, ...e.shapeTypes },
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
          const p = h.gap * a, g = h.variant === "cross" ? p / 2 : p;
          d.push(Lp(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${g}px ${g}px, ${g}px ${g}px`), f.push(`${l}px ${c}px, ${l}px ${c}px`)) : (u.push(`${p}px ${p}px`), f.push(`${l}px ${c}px`));
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
      /**
       * Return the live closure config — the SAME object `_emit` reads callbacks
       * from. `_config` above is a one-time stripped *copy* (kept collab-free so
       * Alpine's reactive walker never touches provider cycles), so writing to it
       * would not be visible to `_emit`. Addons that need to install/override
       * event callbacks (e.g. the /wire bridge's registerWireEvents) must target
       * this object, not `_config`. Not stored as reactive data — a function's
       * return value is not deep-walked, so this stays collab-safe.
       */
      _liveConfig() {
        return e;
      },
      _shortcuts: fh(e.keyboardShortcuts),
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
      _computeEngine: new Zh(),
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
      _spatialGrid: new _f(),
      /** Obstacle rects rebuilt once per commit. In the edge effect read it via `Alpine.raw(canvas._obstacleSnapshot)` (nested-raw) so the edge does NOT subscribe to every node's reactive state. */
      _obstacleSnapshot: null,
      /** WS-2 endpoint-spread lanes; null until first computed. Mutated in place (see _obstacleSnapshot). */
      _endpointSpreadGrouping: null,
      /** WS-3 crossing-reduction lane offsets, edgeId → signed px; null until first computed. Mutated in place. */
      _crossingPlan: null,
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
        typeof c == "function" && c(a, this), this._container?.dispatchEvent(new CustomEvent(`flow-${s}`, {
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
      /**
       * The whole selection, as the objects rather than the ids.
       *
       * One place, because there is more than one way to open a menu on a selection — a right-click
       * on the pane, a right-click on one of the selected nodes, a long-press on a touch device —
       * and each of them used to gather this by hand. Three copies of two filters is how the touch
       * path came to send the nodes and forget the edges: a selection menu that can delete what the
       * author gathered, minus the half nobody told it about.
       */
      getSelectedNodesAndEdges() {
        return {
          nodes: this.nodes.filter((s) => this.selectedNodes.has(s.id)),
          edges: this.edges.filter((s) => this.selectedEdges.has(s.id))
        };
      },
      _rebuildNodeMap() {
        this._nodeMap = La(this.nodes), Hh(this._childrenIds, this.nodes);
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
        const a = t.raw(this._obstacleSnapshot), l = a ? a.slice() : null, c = t.raw(this.nodes), d = new Map(c.map((m) => [m.id, m])), u = this._config?.nodeOrigin, f = t.raw(this._spatialGrid);
        f.clear();
        const h = [];
        for (const m of c) {
          const y = ct(m, d, u), b = {
            id: m.id,
            x: y.position.x,
            y: y.position.y,
            width: y.dimensions?.width ?? we,
            height: y.dimensions?.height ?? ve
          };
          f.insert(m.id, b.x, b.y, b.width, b.height), !m.hidden && h.push(b);
        }
        a ? (a.length = 0, a.push(...h)) : this._obstacleSnapshot = h, this._obstacleEpoch++, this._markDirtyEdges(s, l);
        const p = this._computeEndpointGrouping();
        p.size > 0 && this._markEdgesDirtyById(p);
        const g = this._computeCrossingPlan();
        g.size > 0 && this._markEdgesDirtyById(g);
      },
      /**
       * WS-2: assign each avoidant/orthogonal edge a lane index per shared
       * `(node, handleId)`, ordered by the opposite endpoint's position so the
       * fan-in doesn't self-cross. No-op (empty grouping) when spread is disabled
       * everywhere. Returns the set of edge ids whose lane/group membership
       * changed since the last run, so the caller can dirty exactly those. The
       * grouping Map is mutated in place (same reference) so reading it in the
       * edge effect doesn't re-run every edge — mirrors `_obstacleSnapshot`.
       */
      _computeEndpointGrouping() {
        const s = /* @__PURE__ */ new Set(), a = ho(this._config?.avoidantEndpointSpread), l = t.raw(this.nodes), c = new Map(l.map((b) => [b.id, b])), d = this._config?.nodeOrigin, u = (b) => {
          const S = c.get(b);
          if (!S) return 0;
          const x = ct(S, c, d);
          return x.position.y + (x.dimensions?.height ?? 0) / 2;
        }, f = (b) => {
          const S = c.get(b)?.endpointSpread;
          return S !== void 0 ? ho(S) !== null : a !== null;
        }, h = /* @__PURE__ */ new Map(), p = (b, S, x, k) => {
          if (!f(b)) return;
          const v = `${b}|${S ?? ""}`;
          let C = h.get(v);
          C || (C = [], h.set(v, C)), C.push({ edgeId: x, sortKey: u(k) });
        }, g = t.raw(this.edges);
        for (const b of g) {
          const S = b.type ?? this._config?.defaultEdgeType;
          S !== "avoidant" && S !== "orthogonal" || (p(b.source, b.sourceHandle, b.id, b.target), p(b.target, b.targetHandle, b.id, b.source));
        }
        const m = t.raw(this._endpointSpreadGrouping), y = /* @__PURE__ */ new Map();
        for (const [b, S] of h) {
          S.sort((v, C) => v.sortKey - C.sortKey || (v.edgeId < C.edgeId ? -1 : 1));
          const x = /* @__PURE__ */ new Map();
          S.forEach((v, C) => x.set(v.edgeId, C)), y.set(b, { count: S.length, lanes: x });
          const k = m?.get(b);
          for (const [v, C] of x)
            (!k || k.count !== S.length || k.lanes.get(v) !== C) && s.add(v);
        }
        if (m) {
          for (const [b, S] of m)
            if (!y.has(b))
              for (const x of S.lanes.keys()) s.add(x);
        }
        if (m) {
          m.clear();
          for (const [b, S] of y) m.set(b, S);
        } else
          this._endpointSpreadGrouping = y;
        return s;
      },
      /**
       * WS-3: assign each avoidant/orthogonal edge a signed lane offset so edges
       * sharing a routing corridor separate into ordered lanes. Base-routes each
       * opted-in edge (cached findRoute) against the shared obstacle snapshot,
       * extracts its dominant interior run, groups runs into channels, orders each
       * group by endpoint barycenter, and centres signed offsets by channelGap.
       * No-op (empty plan) when the flag is off. Returns the edge ids whose offset
       * changed since the last run. Mutated in place (see _endpointSpreadGrouping).
       */
      _computeCrossingPlan() {
        const s = /* @__PURE__ */ new Set(), a = mh(this._config?.avoidantCrossingReduction), l = t.raw(this._crossingPlan), c = (S) => {
          const x = /* @__PURE__ */ new Set([...l?.keys() ?? [], ...S.keys()]);
          for (const k of x)
            (l?.get(k) ?? 0) !== (S.get(k) ?? 0) && s.add(k);
          if (l) {
            l.clear();
            for (const [k, v] of S) l.set(k, v);
          } else
            this._crossingPlan = S;
          return s;
        };
        if (a === null) return c(/* @__PURE__ */ new Map());
        const d = t.raw(this.nodes), u = new Map(d.map((S) => [S.id, S])), f = this._config?.nodeOrigin, h = t.raw(this._obstacleSnapshot) ?? [], p = (S) => {
          const x = u.get(S);
          if (!x) return { x: 0, y: 0 };
          const k = ct(x, u, f);
          return {
            x: k.position.x + (k.dimensions?.width ?? 0) / 2,
            y: k.position.y + (k.dimensions?.height ?? 0) / 2
          };
        }, g = t.raw(this.edges), m = [];
        for (const S of g) {
          const x = S.type ?? this._config?.defaultEdgeType;
          if (x !== "avoidant" && x !== "orthogonal") continue;
          const k = p(S.source), v = p(S.target), C = Math.abs(v.x - k.x) >= Math.abs(v.y - k.y) ? v.x >= k.x ? "right" : "left" : v.y >= k.y ? "bottom" : "top", T = Math.abs(v.x - k.x) >= Math.abs(v.y - k.y) ? v.x >= k.x ? "left" : "right" : v.y >= k.y ? "top" : "bottom", R = h.filter((_) => _.id !== S.source && _.id !== S.target), L = Ni(k.x, k.y, C, v.x, v.y, T, R);
          if (!L) continue;
          const D = ba(L);
          if (!D) continue;
          const A = D.axis === "h" ? (k.y + v.y) / 2 : (k.x + v.x) / 2;
          m.push({ edgeId: S.id, run: D, bary: A });
        }
        m.sort((S, x) => S.edgeId < x.edgeId ? -1 : S.edgeId > x.edgeId ? 1 : 0);
        const y = Math.max(8, a * 2), b = /* @__PURE__ */ new Map();
        for (const S of wh(m, y))
          if (!(S.length < 2))
            for (const [x, k] of _h(S, a))
              k !== 0 && b.set(x, k);
        return c(b);
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
        const l = this._edgeDirtyTicks, c = t.raw(l), d = t.raw(this.edges), u = t.raw(this._edgeCorridors), f = t.raw(this._obstacleSnapshot), h = (m) => {
          l.set(m, (c.get(m) ?? 0) + 1);
        };
        if (!s || s.length === 0) {
          const m = /* @__PURE__ */ new Set();
          for (const y of d)
            m.add(y.id), h(y.id);
          for (const y of [...c.keys()])
            m.has(y) || c.delete(y);
          for (const y of [...u.keys()])
            m.has(y) || u.delete(y);
          return;
        }
        const p = new Set(s), g = [];
        for (const m of p) {
          const y = f?.find((S) => S.id === m);
          y && g.push(y);
          const b = a?.find((S) => S.id === m);
          b && g.push(b);
        }
        for (const m of d) {
          let y = p.has(m.source) || p.has(m.target);
          if (!y) {
            const b = u.get(m.id);
            if (b) {
              for (const S of g)
                if (S.x < b.maxX + wt && S.x + S.width > b.minX - wt && S.y < b.maxY + wt && S.y + S.height > b.minY - wt) {
                  y = !0;
                  break;
                }
            } else
              y = !0;
          }
          y && h(m.id);
        }
      },
      /**
       * Bump the routing dirty tick for a specific set of edge ids (WS-2 re-lane).
       * Reuses the SAME tick-bump `_markDirtyEdges` uses: `.set()` on the REACTIVE
       * Map so edge effects reading `_edgeDirtyTicks.get(edge.id)` are notified.
       */
      _markEdgesDirtyById(s) {
        const a = this._edgeDirtyTicks, l = t.raw(a);
        for (const c of s)
          a.set(c, (l.get(c) ?? 0) + 1);
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
        const d = e.cullingBuffer ?? 100, u = wf(this.viewport, l, c, d), h = t.raw(this._spatialGrid).query(u), p = this._draggingNodeIds, g = /* @__PURE__ */ new Set(), m = (S) => {
          const x = this._nodeMap.get(S);
          if (!x || x.hidden) return;
          const k = x.dimensions?.width ?? 150, v = x.dimensions?.height ?? 50, C = x.parentId ? ci(x, this._nodeMap, this._config.nodeOrigin) : x.position;
          !(C.x + k < u.minX || C.x > u.maxX || C.y + v < u.minY || C.y > u.maxY) && g.add(S);
        };
        for (const S of h) m(S);
        if (p)
          for (const S of p)
            h.has(S) || m(S);
        for (const [S, x] of this._nodeElements) {
          const k = g.has(S) ? "" : "none";
          x.style.display !== k && (x.style.display = k);
        }
        const y = this._culledEdgeIds, b = /* @__PURE__ */ new Set();
        for (const [S, x] of this._edgeSvgElements) {
          const k = this._edgeMap.get(S);
          if (!k) continue;
          const v = this._nodeMap.get(k.source)?.hidden, C = this._nodeMap.get(k.target)?.hidden;
          if (k.hidden || k._hiddenByCollapse || v || C)
            continue;
          const T = g.has(k.source) || g.has(k.target) || Mp(this._edgeCorridors.get(S), u), R = !y.has(S);
          T !== R && (x.style.display = T ? "" : "none"), T || b.add(S);
        }
        this._visibleNodeIds = g, this._culledEdgeIds = b;
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
        return a ? ci(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && ea(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Af(lo), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let a = null;
          s === "fill" ? a = "100%" : typeof s == "number" && Number.isFinite(s) ? a = `${s}px` : typeof s == "string" && s.trim() && (a = s.trim()), a !== null && this._container.style.setProperty("--flow-container-height", a);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Aa(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Nt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new Ef(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new Gh(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Lt("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new l(), p = new c(h), g = new d(h, this, f.provider), m = new u(p, f.user);
          if (Fe.set(a, { bridge: g, awareness: m, doc: h }), f.provider.connect(h, p), f.cursors !== !1) {
            let y = !1;
            const b = f.throttle ?? 20, S = (v) => {
              if (y) return;
              y = !0;
              const C = a.getBoundingClientRect(), T = this._viewportLive ?? this.viewport, R = (v.clientX - C.left - T.x) / T.zoom, L = (v.clientY - C.top - T.y) / T.zoom;
              m.updateCursor({ x: R, y: L }), setTimeout(() => {
                y = !1;
              }, b);
            }, x = () => {
              m.updateCursor(null);
            };
            a.addEventListener("mousemove", S), a.addEventListener("mouseleave", x);
            const k = Fe.get(a);
            k.cursorCleanup = () => {
              a.removeEventListener("mousemove", S), a.removeEventListener("mouseleave", x);
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
        }), this._panZoom = gf(this._container, {
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
          // `interactive: false` is the master overlay — it forces both axes off
          // at init regardless of the per-axis pannable/zoomable intent, which
          // toggleInteractive() restores later.
          pannable: e.interactive === !1 ? !1 : e.pannable,
          zoomable: e.interactive === !1 ? !1 : e.zoomable,
          translateExtent: e.translateExtent,
          isLocked: () => this._animationLocked,
          noPanClassName: e.noPanClassName ?? "nopan",
          noWheelClassName: e.noWheelClassName ?? "nowheel",
          zoomOnDoubleClick: e.zoomOnDoubleClick,
          dblClickZoomLevel: e.dblClickZoomLevel,
          dblClickZoomOutLevel: e.dblClickZoomOutLevel,
          // Only called when a toggle double-click zooms out under
          // `dblClickZoomOutLevel: 'fit'`, so the bounds pass costs nothing otherwise.
          getFitViewport: () => this._fitViewport(),
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
        }), this._bgGapCache = null, this._schemaMetrics = null, this._applyBackground(), this.$store.flow.register(this._id, this), this._onContainerPointerDown = () => {
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
          a && (this._handleDelegationCleanup = Ss(a, this), this._handleDelegationEl = a);
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
        !a || a === s || (this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, !this._handleDelegationTornDown && (this._handleDelegationCleanup = Ss(s, this), this._handleDelegationEl = s, B("init", `flowCanvas "${this._id}" re-bound its delegated handle pointerdown listener to a replaced .flow-viewport`)));
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
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container));
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport")) {
            const d = this.screenToFlowPosition(l.clientX, l.clientY);
            this._emit("pane-click", { event: l, position: d }), this.deselectAll();
          }
        }, this._container.addEventListener("click", this._onCanvasClick), this._onCanvasContextMenu = (l) => {
          const c = l.target;
          if (c === this._container || c.classList.contains("flow-viewport"))
            if (l.preventDefault(), this.selectedNodes.size > 1) {
              const { nodes: d, edges: u } = this.getSelectedNodesAndEdges();
              this._emit("selection-context-menu", { nodes: d, edges: u, event: l });
            } else {
              const d = this.screenToFlowPosition(l.clientX, l.clientY);
              this._emit("pane-context-menu", { event: l, position: d });
            }
        }, this._container.addEventListener("contextmenu", this._onCanvasContextMenu);
        const s = e.longPressAction ?? "context-menu";
        if (s && (this._longPressCleanup = ph(
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
                const { nodes: f, edges: h } = this.getSelectedNodesAndEdges();
                this._emit("selection-context-menu", { nodes: f, edges: h, event: l });
              } else {
                const f = this.screenToFlowPosition(l.clientX, l.clientY);
                this._emit("pane-context-menu", { event: l, position: f });
              }
            } else if (s === "select") {
              const d = c.closest("[data-flow-node-id]");
              if (d) {
                const u = d.getAttribute("data-flow-node-id"), f = this.getNode(u);
                this.selectedNodes.has(u) ? this.selectedNodes.delete(u) : (!f || pn(f, this._config?.nodesSelectable !== !1)) && this.selectedNodes.add(u);
              }
            }
          },
          { duration: e.longPressDuration ?? 500 }
        )), e.touchSelectionMode !== !1) {
          let l = 0, c = 0;
          const d = (g) => {
            g.pointerType === "touch" && (c++, c === 2 && Date.now() - l < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), l = Date.now());
          }, u = (g) => {
            g.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (l = 0));
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
        const a = [
          { event: "flow-node-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "node", x: l.detail.event.clientX, y: l.detail.event.clientY, node: l.detail.node, edge: null, position: null, nodes: null, edges: null, event: l.detail.event });
          }) },
          { event: "flow-edge-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "edge", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: l.detail.edge, position: null, nodes: null, edges: null, event: l.detail.event });
          }) },
          { event: "flow-pane-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "pane", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: l.detail.position, nodes: null, edges: null, event: l.detail.event });
          }) },
          { event: "flow-selection-context-menu", handler: ((l) => {
            Object.assign(this.contextMenu, { show: !0, type: "selection", x: l.detail.event.clientX, y: l.detail.event.clientY, node: null, edge: null, position: null, nodes: l.detail.nodes, edges: l.detail.edges, event: l.detail.event });
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
          const a = gh(s.target), l = this._shortcuts;
          if (Ke(s.key, l.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Ke(s.key, l.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container);
            return;
          }
          if (Ke(s.key, l.delete)) {
            if (a) return;
            this._deleteSelected();
          }
          if (Ke(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (a) return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Ke(s.key, l.moveNodes)) {
            if (a || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = bt(s, l.moveStepModifier) ? l.moveStep * l.moveStepMultiplier : l.moveStep;
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
                const f = Array.isArray(l.moveNodes) ? l.moveNodes : [l.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, p = f.findIndex((g) => (g.length === 1 ? g.toLowerCase() : g) === h);
                p === 0 ? u = -c : p === 1 ? u = c : p === 2 ? d = -c : p === 3 && (d = c);
              }
            }
            hh(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && ha(h)) {
                h.position.x += d, h.position.y += u;
                const p = this._container ? Fe.get(this._container) : void 0;
                p?.bridge && p.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Ke(s.key, l.undo)) {
            if (a) return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Ke(s.key, l.redo)) {
            if (a) return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (a) return;
            Ke(s.key, l.copy) ? (s.preventDefault(), this.copy()) : Ke(s.key, l.paste) ? (s.preventDefault(), this.paste()) : Ke(s.key, l.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = Df(this._container, {
          getState: () => ({
            nodes: go(this.nodes, this._nodeMap, this._config.nodeOrigin),
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
      /**
       * Give the minimap another box.
       *
       * Public because the reason to want it is outside the library: a canvas that changes shape with
       * the window wants a minimap that changes shape with it, and the scale that fits the graph in —
       * along with the rectangle marking the viewport — is computed against the box. A consumer
       * watching its container calls this; nothing here watches, because what counts as "too big" is
       * the page's business rather than the canvas's.
       *
       * The new box is written back into the config, so `_config.minimapWidth/Height` keeps saying
       * what is on screen rather than what was passed at construction — the same numbers a
       * `patchConfig` from the server would set. `minimap-resize` fires only when something actually
       * changed, so a host that persists the size is not asked to save the size it already has.
       */
      resizeMinimap(s, a) {
        this._minimap?.resize(s, a) && (this._config.minimapWidth = s, this._config.minimapHeight = a, this._emit("minimap-resize", { width: s, height: a }));
      },
      /** Create controls panel if configured. */
      _initControls() {
        if (e.controls) {
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, a = s !== this._container;
          this._controls = Bf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            // Read per press, and from `_config` — the copy the rest of the canvas answers to, so a
            // duration changed at runtime reaches the buttons like every other live setting does.
            // Zero by default, which is exactly the call these three made before.
            onZoomIn: () => this.zoomIn({ duration: this._config.controlsDuration ?? 0 }),
            onZoomOut: () => this.zoomOut({ duration: this._config.controlsDuration ?? 0 }),
            onFitView: () => this.fitView({ padding: Zn, duration: this._config.controlsDuration ?? 0 }),
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
        this._selectionBox = qf(this._container), this._lasso = Yf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !bt(s, this._shortcuts.selectionBox))
            return;
          const a = s.target;
          if (a !== this._container && !a.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const l = this._config.selectionMode ?? "partial", c = bt(s, this._shortcuts.selectionModeToggle);
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
          const l = go(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Uf(l, u) : jf(l, u), h = new Set(f.map((p) => p.id));
            if (c = this.nodes.filter((p) => h.has(p.id)), this._config.lassoSelectsEdges)
              for (const p of this.edges) {
                if (p.hidden) continue;
                const g = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(p.id)}"] path`
                );
                if (!g) continue;
                const m = g.getTotalLength(), y = Math.max(10, Math.ceil(m / 20));
                let b = 0;
                for (let x = 0; x <= y; x++) {
                  const k = g.getPointAtLength(x / y * m);
                  Ai(k.x, k.y, u) && b++;
                }
                (this._selectionEffectiveMode === "full" ? b === y + 1 : b > 0) && d.push(p.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? yf(l, u, this._config.nodeOrigin) : mf(l, u, this._config.nodeOrigin), h = new Set(f.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!pn(u, this._config?.nodesSelectable !== !1) || u.hidden) continue;
            u.selected = !0, this.selectedNodes.add(u.id);
            const f = this._container?.querySelector(`[data-flow-node-id="${CSS.escape(u.id)}"]`);
            f && f.classList.add("flow-node-selected");
          }
          for (const u of d) {
            const f = this.getEdge(u);
            f && li(f, this._config?.edgesSelectable !== !1) && (f.selected = !0, this.selectedEdges.add(f.id));
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
              const p = this._nodeMap.get(h);
              if (p)
                return p;
            }
            return null;
          };
          this._onDropZoneDragOver = (l) => {
            !l.dataTransfer || nr(l.target) || !s.some((d) => l.dataTransfer.types.includes(d)) || (l.preventDefault(), l.dataTransfer.dropEffect = "move", this._container?.classList.add("flow-canvas-drag-over"));
          }, this._onDropZoneDragleave = (l) => {
            if (!this._container)
              return;
            const c = l.relatedTarget;
            c && this._container.contains(c) || this._container.classList.remove("flow-canvas-drag-over");
          }, this._onDropZoneDrop = (l) => {
            if (l.preventDefault(), this._container?.classList.remove("flow-canvas-drag-over"), nr(l.target) || !l.dataTransfer || !e.onDrop)
              return;
            let c = null, d = null;
            for (const g of s) {
              const m = l.dataTransfer.getData(g);
              if (m) {
                c = g, d = m;
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
            const f = Jr(
              l.clientX,
              l.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = a(l.clientX, l.clientY), p = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c }, this);
            p && this.addNodes(p, { center: !0, source: "drop" });
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
       * mutation — direct assignment or via the wire addon — triggers a re-layout
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
            const f = l.borderBoxSize?.[0], h = f ? f.inlineSize : c.offsetWidth, p = f ? f.blockSize : c.offsetHeight;
            if (h === 0 && p === 0 || c.offsetParent === null && c.tagName !== "BODY" || u.fixedDimensions === !0) continue;
            const g = Math.round(h), m = Math.round(p), y = u.dimensions;
            if (y && Math.abs((y.width ?? 0) - g) < 1 && Math.abs((y.height ?? 0) - m) < 1)
              continue;
            const b = eg(
              { width: g, height: m },
              u.minDimensions,
              u.maxDimensions
            );
            u.dimensions = b, a.add(d), u.parentId && this._layoutDedup?.safeLayoutChildren(u.parentId);
          }
          a.size > 0 && this._commitNodeGeometry([...a]);
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        this._layoutDedup = Jh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), B("init", `flowCanvas "${this._id}" ready`), this.$wire && !Lt("wire") && console.warn(
          `[alpineflow] flowCanvas "${this._id}" has a Livewire $wire proxy but the /wire addon is not registered — wireEvents forwarding and flow:* commands are inert. Register it with Alpine.plugin(AlpineFlowWire) from '@getartisanflow/alpineflow/wire'.`
        ), this._emit("init"), this._recomputeChildValidation();
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
      /** Call setup(canvas) on any addon that provides it, capturing any cleanup it returns. */
      _initAddons() {
        for (const [, s] of Na().entries())
          if (s && typeof s == "object" && typeof s.setup == "function") {
            const a = s.setup(this);
            typeof a == "function" && (this._addonCleanups ??= []).push(a);
          }
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
          c && Lt(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${l[s]})`);
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
            const f = Bt(u), h = qt(f, this._id);
            a.has(h) || a.set(h, uo(f, h));
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
        this._destroyAnimations?.();
        for (const s of this._addonCleanups ?? [])
          try {
            s();
          } catch {
          }
        this._addonCleanups = [], this._handleDelegationTornDown = !0, this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null;
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
          const s = Fe.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), Fe.delete(this._container));
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
      /**
       * WS-3: toggle/tune crossing reduction at runtime and re-route immediately.
       * Mutates the live config then forces a geometry recommit so the crossing
       * plan is recomputed and affected edges re-route without waiting for a node
       * move. `value`: `boolean | { channelGap?: number }`.
       */
      setCrossingReduction(s) {
        this._config && (this._config.avoidantCrossingReduction = s, this._commitNodeGeometry());
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
        return this._layoutDedup ? Qh(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? Fe.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => my));
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
      ig(i),
      sg(i),
      rg(i),
      dg(i),
      fg(i),
      Vg(i),
      Yg(i),
      Xg(i),
      Wg(i),
      tp(i),
      np(i),
      op(i),
      Cp(i, t),
      Sp(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      Nf(s, a);
    }, n;
  });
}
function or(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Ap(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(b) {
    const S = s();
    return {
      x: (b.x - S.x) / S.zoom,
      y: (b.y - S.y) / S.zoom
    };
  }
  const m = Xe(t), y = qc().subject(() => {
    const b = s(), S = a();
    return {
      x: S.x * b.zoom + b.x,
      y: S.y * b.zoom + b.y
    };
  }).on("start", (b) => {
    p = g(b), o?.({ nodeId: e, position: p, sourceEvent: b.sourceEvent });
  }).on("drag", (b) => {
    let S = g(b);
    l && (S = or(S, l));
    const x = {
      x: S.x - p.x,
      y: S.y - p.y
    };
    i?.({ nodeId: e, position: S, delta: x, sourceEvent: b.sourceEvent });
  }).on("end", (b) => {
    let S = g(b);
    l && (S = or(S, l)), r?.({ nodeId: e, position: S, sourceEvent: b.sourceEvent });
  });
  return d && y.container(() => d), h > 0 && y.clickDistance(h), y.filter((b) => {
    if (u?.() || f && b.target?.closest?.("." + f)) return !1;
    if (c) {
      const S = t.querySelector(c);
      return S ? S.contains(b.target) : !0;
    }
    return !0;
  }), m.call(y), {
    destroy() {
      m.on(".drag", null);
    }
  };
}
function Np(t, e) {
  const n = Jt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? ve
  };
}
function $p(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, a = 1 / 0, l = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const p = h.x + h.width / 2, g = h.y + h.height / 2, m = h.x + h.width, y = h.y + h.height, b = [
      [t.x, h.x],
      // left-left
      [u, m],
      // right-right
      [c, p],
      // center-center
      [t.x, m],
      // left-right
      [u, h.x]
      // right-left
    ];
    for (const [x, k] of b) {
      const v = k - x;
      Math.abs(v) <= n && (i.add(k), Math.abs(v) < Math.abs(a) && (a = v, r = v));
    }
    const S = [
      [t.y, h.y],
      // top-top
      [f, y],
      // bottom-bottom
      [d, g],
      // center-center
      [t.y, y],
      // top-bottom
      [f, h.y]
      // bottom-top
    ];
    for (const [x, k] of S) {
      const v = k - x;
      Math.abs(v) <= n && (o.add(k), Math.abs(v) < Math.abs(l) && (l = v, s = v));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Ip(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Dp(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = Ip(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const Rp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Hp = 0;
function ir(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Yo(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Fp(t, e) {
  return t.key !== "Enter" && t.key !== " " ? !1 : t.target === e;
}
function Op(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function zp(t, e, n) {
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
function Vp(t, e, n) {
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
function Bp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = null, c = !1, d = null, u = null, f = null, h = null, p = null, g = null, m = !1, y = -1, b = null, S = !1, x = [], k = "", v = [], C = null;
      i(() => {
        if (!e.isConnected) return;
        const A = o(n);
        if (!A || A.hidden) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (!_?.viewport) return;
        const w = A.parentId ? _.getAbsolutePosition(A.id) : A.position ?? { x: 0, y: 0 }, N = A.nodeOrigin ?? _._config?.nodeOrigin ?? [0, 0], M = A.dimensions?.width ?? 150, I = A.dimensions?.height ?? 40;
        e.style.left = w.x - M * N[0] + "px", e.style.top = w.y - I * N[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const A = o(n);
        if (!A) return;
        if (e.dataset.flowNodeId = A.id, A.type && (e.dataset.flowNodeType = A.type), !S) {
          const O = e.closest("[x-data]"), q = O ? t.$data(O) : null;
          let Y = !1;
          if (q?._config?.nodeTypes) {
            const K = A.type ?? "default", z = q._config.nodeTypes[K] ?? q._config.nodeTypes.default;
            if (typeof z == "string") {
              const J = document.querySelector(z);
              J?.content && (e.appendChild(J.content.cloneNode(!0)), Y = !0);
            } else typeof z == "function" && (z(A, e), Y = !0);
          }
          if (!Y && e.children.length === 0) {
            const K = document.createElement("div");
            K.setAttribute("x-flow-handle:target", "");
            const z = document.createElement("span");
            z.setAttribute("x-text", "node.data.label");
            const J = document.createElement("div");
            J.setAttribute("x-flow-handle:source", ""), e.appendChild(K), e.appendChild(z), e.appendChild(J), Y = !0;
          }
          if (Y)
            for (const K of Array.from(e.children))
              t.addScopeToNode(K, { node: A }), t.initTree(K);
          S = !0;
        }
        if (A.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), C !== A.id && (s?.destroy(), s = null, C = A.id);
        const _ = t.$data(e.closest("[x-data]"));
        if (!_?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), A.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), A.dimensions) {
          const O = A.childLayout, q = A.fixedDimensions, Y = (_._childrenIds?.get(A.id)?.length ?? 0) > 0;
          e.style.width = A.dimensions.width + "px", O || q || Y ? e.style.height = A.dimensions.height + "px" : e.style.height = "";
        }
        _.selectedNodes.has(A.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!A.selected)), A._validationErrors && A._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const w = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], N = A.runState;
        for (const O of w)
          e.classList.remove(O);
        N && N !== "pending" && e.classList.add(`flow-node-${N}`);
        for (const O of x)
          e.classList.remove(O);
        const M = A.class ? A.class.split(/\s+/).filter(Boolean) : [];
        for (const O of M)
          e.classList.add(O);
        x = M;
        const I = A.shape ? `flow-node-${A.shape}` : "";
        k !== I && (k && e.classList.remove(k), I && e.classList.add(I), k = I);
        const H = e.closest("[data-flow-canvas]"), V = H ? t.$data(H) : null, $ = A.shape && V?._shapeRegistry?.[A.shape];
        if ($?.clipPath ? e.style.clipPath = $.clipPath : e.style.clipPath = "", A.style) {
          const O = typeof A.style == "string" ? Object.fromEntries(A.style.split(";").filter(Boolean).map((Y) => Y.split(":").map((K) => K.trim()))) : A.style, q = [];
          for (const [Y, K] of Object.entries(O))
            Y && K && (e.style.setProperty(Y, K), q.push(Y));
          for (const Y of v)
            q.includes(Y) || e.style.removeProperty(Y);
          v = q;
        } else if (v.length > 0) {
          for (const O of v)
            e.style.removeProperty(O);
          v = [];
        }
        if (A.rotation ? (e.style.transform = `rotate(${A.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", A.focusable ?? _._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", A.ariaRole ?? "group"), e.setAttribute("aria-label", A.ariaLabel ?? (A.data?.label ? `Node: ${A.data.label}` : `Node ${A.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), A.domAttributes)
          for (const [O, q] of Object.entries(A.domAttributes))
            O.startsWith("on") || Rp.has(O.toLowerCase()) || e.setAttribute(O, q);
        Ye(A) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), A.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const P = e.classList.contains("flow-node-condensed");
        A.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!A.condensed !== P && requestAnimationFrame(() => {
          A.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${A.id}" re-measured after condense toggle`, A.dimensions);
        }), A.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const F = A.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), F !== "visible" && e.classList.add(`flow-handles-${F}`);
        let W = Ma(A, _._nodeMap);
        _._config?.elevateNodesOnSelect !== !1 && _.selectedNodes.has(A.id) && (W += A.type === "group" ? Math.max(1 - W, 0) : 1e3), m && (W += 1e3);
        const G = A.type === "group" ? 0 : 2;
        if (W !== G ? e.style.zIndex = String(W) : e.style.removeProperty("z-index"), !ha(A)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const Z = e.closest(".flow-container");
        s || (s = Ap(e, A.id, {
          container: Z ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => _._animationLocked,
          noDragClassName: _._config?.noDragClassName ?? "nodrag",
          dragThreshold: _._config?.nodeDragThreshold ?? 0,
          getViewport: () => _.viewport,
          getNodePosition: () => {
            const O = _.getNode(A.id);
            return O ? O.parentId ? _.getAbsolutePosition(O.id) : { x: O.position.x, y: O.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: _._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: O, position: q, sourceEvent: Y }) {
            e.classList.add("flow-node-dragging"), a = !1, c = !1, d = null;
            const K = _._container ? Fe.get(_._container) : void 0;
            K?.bridge && K.bridge.setDragging(O, !0), h?.destroy(), h = null, p = null, g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, l = _._snapshotHistory?.() ?? null, B("drag", `Node "${O}" drag start`, q);
            const z = _.getNode(O);
            if (z) {
              if (_._config?.selectNodesOnDrag !== !1 && pn(z, _._config?.nodesSelectable !== !1) && !_.selectedNodes.has(O) && (bt(Y, _._shortcuts?.multiSelect) || _.deselectAll(), _.selectedNodes.add(O), z.selected = !0, _._emitSelectionChange(), c = !0), _._emit("node-drag-start", { node: z }), _.selectedNodes.has(O) && _.selectedNodes.size > 1) {
                const J = xt(O, _.nodes);
                d = /* @__PURE__ */ new Map();
                for (const ee of _.selectedNodes) {
                  if (ee === O || J.has(ee))
                    continue;
                  const U = _.getNode(ee);
                  U && U.draggable !== !1 && d.set(ee, { x: U.position.x, y: U.position.y });
                }
              }
              if (_._draggingNodeIds.add(O), d)
                for (const J of d.keys())
                  _._draggingNodeIds.add(J);
            }
            _._config?.autoPanOnNodeDrag !== !1 && Z && (u = pa({
              container: Z,
              speed: _._config?.autoPanSpeed ?? 15,
              onPan(J, ee) {
                const U = () => _._viewportLive ?? _.viewport, re = U().zoom || 1, se = { x: U().x, y: U().y };
                _._panZoom?.setViewport({
                  x: U().x - J,
                  y: U().y - ee,
                  zoom: re
                });
                const ie = se.x - U().x, te = se.y - U().y, ne = ie === 0 && te === 0, pe = _.getNode(O);
                let ue = !1;
                if (pe) {
                  const le = pe.position.x, oe = pe.position.y;
                  pe.position.x += ie / re, pe.position.y += te / re;
                  const ge = qn(pe.position, pe, _._config?.nodeExtent);
                  pe.position.x = ge.x, pe.position.y = ge.y, ue = pe.position.x === le && pe.position.y === oe;
                }
                if (d)
                  for (const [le] of d) {
                    const oe = _.getNode(le);
                    if (oe) {
                      oe.position.x += ie / re, oe.position.y += te / re;
                      const ge = qn(oe.position, oe, _._config?.nodeExtent);
                      oe.position.x = ge.x, oe.position.y = ge.y;
                    }
                  }
                return ne && ue;
              }
            }), Y instanceof MouseEvent && u.updatePointer(Y.clientX, Y.clientY), u.start());
          },
          onDrag({ nodeId: O, position: q, delta: Y, sourceEvent: K }) {
            a = !0;
            const z = _.getNode(O);
            if (z) {
              if (z.parentId) {
                const U = _.getAbsolutePosition(z.parentId);
                let re = q.x - U.x, se = q.y - U.y;
                const ie = z.dimensions ?? { width: 150, height: 50 }, te = _.getNode(z.parentId);
                if (te?.childLayout) {
                  m || (e.classList.add("flow-reorder-dragging"), b = z.parentId), m = !0;
                  const ne = z.extent !== "parent";
                  if (z.position.x = q.x - U.x, z.position.y = q.y - U.y, !ne && te.dimensions) {
                    const le = Ho({ x: z.position.x, y: z.position.y }, ie, te.dimensions);
                    z.position.x = le.x, z.position.y = le.y;
                  }
                  const pe = z.dimensions?.width ?? 150, ue = z.dimensions?.height ?? 50;
                  if (ne) {
                    const le = te.dimensions?.width ?? 150, oe = te.dimensions?.height ?? 50, ge = z.position.x + pe / 2, me = z.position.y + ue / 2, be = 12, Pe = b === z.parentId ? 0 : be, Ve = ge >= Pe && ge <= le - Pe && me >= Pe && me <= oe - Pe, ke = /* @__PURE__ */ new Set();
                    let fe = z.parentId;
                    for (; fe; )
                      ke.add(fe), fe = _.getNode(fe)?.parentId;
                    const Ee = q.x + pe / 2, De = q.y + ue / 2, Te = xt(z.id, _.nodes);
                    let X = null;
                    const ae = _.nodes.filter(
                      (ce) => ce.id !== z.id && (ce.droppable || ce.childLayout) && !ce.hidden && !Te.has(ce.id) && (Ve ? !ke.has(ce.id) : ce.id !== z.parentId) && (!ce.acceptsDrop || ce.acceptsDrop(z))
                    );
                    for (const ce of ae) {
                      const he = ce.parentId ? _.getAbsolutePosition(ce.id) : ce.position, ye = ce.dimensions?.width ?? 150, xe = ce.dimensions?.height ?? 50, Ae = ce.id === g ? 0 : be;
                      Ee >= he.x + Ae && Ee <= he.x + ye - Ae && De >= he.y + Ae && De <= he.y + xe - Ae && (X = ce);
                    }
                    const de = X?.id ?? null;
                    if (de !== g) {
                      g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), de && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(de)}"]`)?.classList.add("flow-node-drop-target"), g = de;
                      const ce = de ? _.getNode(de) : null, he = b;
                      if (ce?.childLayout && de !== b) {
                        he && (_.layoutChildren(he, { omitFromComputation: O, shallow: !0 }), _.propagateLayoutUp(he, { omitFromComputation: O })), b = de;
                        const ye = _.nodes.filter((Ce) => Ce.parentId === de && Ce.id !== O).sort((Ce, tn) => (Ce.order ?? 1 / 0) - (tn.order ?? 1 / 0)), xe = ye.length, Ae = [...ye];
                        Ae.splice(xe, 0, z);
                        for (let Ce = 0; Ce < Ae.length; Ce++)
                          Ae[Ce].order = Ce;
                        y = xe;
                        const Re = _._initialDimensions?.get(O), Me = { ...z, dimensions: Re ? { ...Re } : void 0 };
                        _.layoutChildren(de, { excludeId: O, includeNode: Me, shallow: !0 }), _.propagateLayoutUp(de, { includeNode: Me });
                      } else Ve && b !== z.parentId ? (he && he !== z.parentId && (_.layoutChildren(he, { omitFromComputation: O, shallow: !0 }), _.propagateLayoutUp(he, { omitFromComputation: O })), b = z.parentId, y = -1) : !de && !Ve && (he && (_.layoutChildren(he, { omitFromComputation: O, shallow: !0 }), _.propagateLayoutUp(he, { omitFromComputation: O })), b = null, y = -1);
                    }
                  }
                  if (b) {
                    const le = _.getNode(b), oe = le?.childLayout ?? te.childLayout, ge = _.nodes.filter((fe) => fe.parentId === b && fe.id !== O).sort((fe, Ee) => (fe.order ?? 1 / 0) - (Ee.order ?? 1 / 0));
                    let me, be;
                    if (b !== z.parentId) {
                      const fe = le?.parentId ? _.getAbsolutePosition(b) : le?.position ?? { x: 0, y: 0 };
                      me = q.x - fe.x, be = q.y - fe.y;
                    } else
                      me = z.position.x, be = z.position.y;
                    const Pe = oe.swapThreshold ?? 0.5;
                    if (y === -1)
                      if (b === z.parentId) {
                        const fe = z.order ?? 0;
                        y = ge.filter((Ee) => (Ee.order ?? 0) < fe).length;
                      } else
                        y = ge.length;
                    const Ve = y;
                    let ke = ge.length;
                    for (let fe = 0; fe < ge.length; fe++) {
                      const Ee = ge[fe], De = Ee.dimensions?.width ?? 150, Te = Ee.dimensions?.height ?? 50, X = fe < Ve ? 1 - Pe : Pe, ae = Ee.position.y + Te * X, de = Ee.position.x + De * X;
                      if (oe.direction === "grid") {
                        const ce = {
                          x: me + pe / 2,
                          y: be + ue / 2
                        }, he = Ee.position.y + Te / 2;
                        if (ce.y < Ee.position.y) {
                          ke = fe;
                          break;
                        }
                        if (Math.abs(ce.y - he) < Te / 2 && ce.x < de) {
                          ke = fe;
                          break;
                        }
                      } else if (oe.direction === "vertical") {
                        if ((fe < Ve ? be : be + ue) < ae) {
                          ke = fe;
                          break;
                        }
                      } else if ((fe < Ve ? me : me + pe) < de) {
                        ke = fe;
                        break;
                      }
                    }
                    if (ke !== y) {
                      y = ke;
                      const fe = [...ge];
                      fe.splice(ke, 0, z);
                      for (let ae = 0; ae < fe.length; ae++)
                        fe[ae].order = ae;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), _._layoutAnimFrame && cancelAnimationFrame(_._layoutAnimFrame);
                      const De = z.id, Te = b, X = Te !== z.parentId;
                      _._layoutAnimFrame = requestAnimationFrame(() => {
                        if (X && Te) {
                          const he = _.getNode(De);
                          let ye;
                          if (he) {
                            const xe = _._initialDimensions?.get(De);
                            ye = { ...he, dimensions: xe ? { ...xe } : void 0 };
                          }
                          _.layoutChildren(Te, {
                            excludeId: De,
                            includeNode: ye,
                            shallow: !0
                          }), _.propagateLayoutUp(Te, {
                            includeNode: ye
                          });
                        } else
                          _.layoutChildren(Te, De, !0);
                        const ae = performance.now(), de = 300, ce = () => {
                          _._layoutAnimTick++, performance.now() - ae < de ? _._layoutAnimFrame = requestAnimationFrame(ce) : _._layoutAnimFrame = 0;
                        };
                        _._layoutAnimFrame = requestAnimationFrame(ce);
                      });
                    }
                  }
                  u && K instanceof MouseEvent && u.updatePointer(K.clientX, K.clientY);
                  return;
                }
                if (z.extent === "parent" && te?.dimensions) {
                  const ne = Ho(
                    { x: re, y: se },
                    ie,
                    te.dimensions
                  );
                  re = ne.x, se = ne.y;
                } else if (Array.isArray(z.extent)) {
                  const ne = Pa({ x: re, y: se }, z.extent, ie);
                  re = ne.x, se = ne.y;
                }
                if ((!z.extent || z.extent !== "parent") && (yn(
                  te,
                  _._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!te?.childLayout) && te?.dimensions) {
                  const ue = Ho(
                    { x: re, y: se },
                    ie,
                    te.dimensions
                  );
                  re = ue.x, se = ue.y;
                }
                if (z.expandParent && te?.dimensions) {
                  const ne = Fh(
                    { x: re, y: se },
                    ie,
                    te.dimensions
                  );
                  ne && (te.dimensions.width = ne.width, te.dimensions.height = ne.height);
                }
                z.position.x = re, z.position.y = se;
              } else {
                const U = qn(q, z, _._config?.nodeExtent);
                z.position.x = U.x, z.position.y = U.y;
              }
              if (_._config?.snapToGrid) {
                const U = z.nodeOrigin ?? _._config?.nodeOrigin ?? [0, 0], re = z.dimensions?.width ?? 150, se = z.dimensions?.height ?? 40, ie = z.parentId ? _.getAbsolutePosition(z.id) : z.position;
                e.style.left = ie.x - re * U[0] + "px", e.style.top = ie.y - se * U[1] + "px", _._layoutAnimTick++;
              }
              if (_._emit("node-drag", { node: z, position: q }), d)
                for (const [U, re] of d) {
                  const se = _.getNode(U);
                  if (se) {
                    let ie = re.x + Y.x, te = re.y + Y.y;
                    const ne = qn({ x: ie, y: te }, se, _._config?.nodeExtent);
                    se.position.x = ne.x, se.position.y = ne.y;
                  }
                }
              const ee = _._config?.helperLines;
              if (ee) {
                const U = typeof ee == "object" ? ee.snap ?? !0 : !0, re = typeof ee == "object" ? ee.threshold ?? 5 : 5, se = (le) => {
                  const oe = le.parentId ? _.getAbsolutePosition(le.id) : le.position;
                  return Np({ ...le, position: oe }, _._config?.nodeOrigin);
                }, te = (_.selectedNodes.size > 1 && _.selectedNodes.has(O) ? _.nodes.filter((le) => _.selectedNodes.has(le.id)) : [z]).map(se), ne = {
                  x: Math.min(...te.map((le) => le.x)),
                  y: Math.min(...te.map((le) => le.y)),
                  width: Math.max(...te.map((le) => le.x + le.width)) - Math.min(...te.map((le) => le.x)),
                  height: Math.max(...te.map((le) => le.y + le.height)) - Math.min(...te.map((le) => le.y))
                }, pe = _.nodes.filter(
                  (le) => !_.selectedNodes.has(le.id) && le.id !== O && le.hidden !== !0 && le.filtered !== !0
                ).map(se), ue = $p(ne, pe, re);
                if (U && (ue.snapOffset.x !== 0 || ue.snapOffset.y !== 0) && (z.position.x += ue.snapOffset.x, z.position.y += ue.snapOffset.y, d))
                  for (const [le] of d) {
                    const oe = _.getNode(le);
                    oe && (oe.position.x += ue.snapOffset.x, oe.position.y += ue.snapOffset.y);
                  }
                if (f?.remove(), ue.horizontal.length > 0 || ue.vertical.length > 0) {
                  const le = Z?.querySelector(".flow-viewport");
                  if (le) {
                    const oe = _.nodes.map(se);
                    f = Vp(ue.horizontal, ue.vertical, oe), le.appendChild(f);
                  }
                } else
                  f = null;
                _._emit("helper-lines-change", {
                  horizontal: ue.horizontal,
                  vertical: ue.vertical
                });
              }
            }
            if (_._config?.preventOverlap) {
              const ee = typeof _._config.preventOverlap == "number" ? _._config.preventOverlap : 5, U = z.dimensions?.width ?? we, re = z.dimensions?.height ?? ve, se = _.selectedNodes, ie = _.nodes.filter((ne) => ne.id !== z.id && !ne.hidden && !se.has(ne.id)).map((ne) => Zt(ne, _._config?.nodeOrigin)), te = og(z.position, U, re, ie, ee);
              z.position.x = te.x, z.position.y = te.y;
            }
            if (!z.parentId) {
              const ee = xt(z.id, _.nodes), U = _.nodes.filter(
                (ne) => ne.id !== z.id && ne.droppable && !ne.hidden && !ee.has(ne.id) && (!ne.acceptsDrop || ne.acceptsDrop(z))
              ), re = Zt(z, _._config?.nodeOrigin);
              let se = null;
              const ie = 12;
              for (const ne of U) {
                const pe = ne.parentId ? _.getAbsolutePosition(ne.id) : ne.position, ue = ne.dimensions?.width ?? we, le = ne.dimensions?.height ?? ve, oe = re.x + re.width / 2, ge = re.y + re.height / 2, me = ne.id === g ? 0 : ie;
                oe >= pe.x + me && oe <= pe.x + ue - me && ge >= pe.y + me && ge <= pe.y + le - me && (se = ne);
              }
              const te = se?.id ?? null;
              te !== g && (g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), te && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(te)}"]`)?.classList.add("flow-node-drop-target"), g = te);
            }
            if (_._config?.proximityConnect) {
              const ee = _._config.proximityConnectDistance ?? 150, U = z.dimensions ?? { width: 150, height: 50 }, re = {
                x: z.position.x + U.width / 2,
                y: z.position.y + U.height / 2
              }, se = _.nodes.filter((te) => te.id !== z.id && !te.hidden).map((te) => ({
                id: te.id,
                center: {
                  x: te.position.x + (te.dimensions?.width ?? 150) / 2,
                  y: te.position.y + (te.dimensions?.height ?? 50) / 2
                }
              })), ie = Dp(z.id, re, se, ee);
              if (ie)
                if (_.edges.some(
                  (ne) => ne.source === ie.source && ne.target === ie.target || ne.source === ie.target && ne.target === ie.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = ie, !h) {
                    h = Gt({
                      connectionLineType: _._config?.connectionLineType,
                      connectionLineStyle: _._config?.connectionLineStyle,
                      connectionLine: _._config?.connectionLine
                    });
                    const ne = Z?.querySelector(".flow-viewport");
                    ne && ne.appendChild(h.svg);
                  }
                  h.update({
                    fromX: re.x,
                    fromY: re.y,
                    toX: ie.targetCenter.x,
                    toY: ie.targetCenter.y,
                    source: ie.source
                  });
                }
              else
                h?.destroy(), h = null, p = null;
            }
            const J = _._container ? Fe.get(_._container) : void 0;
            if (J?.bridge) {
              if (J.bridge.pushLocalNodeUpdate(O, { position: z.position }), d)
                for (const [ee] of d) {
                  const U = _.getNode(ee);
                  U && J.bridge.pushLocalNodeUpdate(ee, { position: U.position });
                }
              if (J.awareness && K instanceof MouseEvent && _._container) {
                const ee = _._container.getBoundingClientRect(), U = _._viewportLive ?? _.viewport, re = (K.clientX - ee.left - U.x) / U.zoom, se = (K.clientY - ee.top - U.y) / U.zoom;
                J.awareness.updateCursor({ x: re, y: se });
              }
            }
            u && K instanceof MouseEvent && u.updatePointer(K.clientX, K.clientY);
          },
          onDragEnd({ nodeId: O, position: q }) {
            const Y = d ? [O, ...d.keys()] : [O];
            _._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), B("drag", `Node "${O}" drag end`, q);
            const K = _._container ? Fe.get(_._container) : void 0;
            K?.bridge && K.bridge.setDragging(O, !1), u?.stop(), u = null, f?.remove(), f = null, _._config?.helperLines && _._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const z = _.getNode(O);
            if (z && _._emit("node-drag-end", { node: z, position: q }), m && z?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const J = b;
              m = !1, y = -1, b = null, _._layoutAnimFrame && (cancelAnimationFrame(_._layoutAnimFrame), _._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Yo(_, O, g), g = null) : J && J !== z.parentId ? (_.layoutChildren(J, { omitFromComputation: O, shallow: !0 }), _.propagateLayoutUp(J, { omitFromComputation: O }), _.layoutChildren(z.parentId), _._emit("child-reorder", {
                nodeId: O,
                parentId: z.parentId,
                order: z.order
              })) : (_.layoutChildren(z.parentId), _._emit("child-reorder", {
                nodeId: O,
                parentId: z.parentId,
                order: z.order
              })), d = null, _._layoutAnimTick++, _._commitNodeGeometry(Y), ir(_, a, l), l = null, a = !1;
              return;
            }
            if (z && g)
              Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Yo(_, O, g), g = null;
            else if (z && z.parentId && !g) {
              const J = yn(
                _.getNode(z.parentId),
                _._config?.childValidationRules ?? {}
              ), ee = _.getNode(z.parentId);
              if (!J?.preventChildEscape && !ee?.childLayout && ee?.dimensions) {
                const U = z.position.x, re = z.position.y, se = z.dimensions?.width ?? 150, ie = z.dimensions?.height ?? 50;
                (U + se < 0 || re + ie < 0 || U > ee.dimensions.width || re > ee.dimensions.height) && Yo(_, O, null);
              }
              g = null;
            } else
              g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (_._config?.proximityConnect && p) {
              const J = p;
              h?.destroy(), h = null, p = null;
              let ee = !0;
              if (_._config.onProximityConnect && _._config.onProximityConnect({
                source: J.source,
                target: J.target,
                distance: J.distance
              }) === !1 && (ee = !1), ee) {
                const U = {
                  source: J.source,
                  sourceHandle: "source",
                  target: J.target,
                  targetHandle: "target"
                };
                if (vt(U, _.edges, { preventCycles: _._config?.preventCycles }) && _t(U, _._config?.connectionRules, _._nodeMap) && (Z ? st(Z, U, _.edges) : !0) && (Z ? it(Z, U) : !0) && (!_._config.isValidConnection || _._config.isValidConnection(U))) {
                  if (_._config.proximityConnectConfirm) {
                    const pe = Z?.querySelector(`[data-flow-node-id="${CSS.escape(J.source)}"]`), ue = Z?.querySelector(`[data-flow-node-id="${CSS.escape(J.target)}"]`);
                    pe?.classList.add("flow-proximity-confirm"), ue?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      pe?.classList.remove("flow-proximity-confirm"), ue?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const ne = `e-${J.source}-${J.target}-${Date.now()}-${Hp++}`;
                  _.addEdges({ id: ne, ...U }), _._emit("connect", { connection: U });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, a && (_._layoutAnimTick++, _._commitNodeGeometry(Y)), ir(_, a, l), l = null, a = !1;
          }
        }));
      });
      {
        const A = t.$data(e.closest("[x-data]"));
        if (A?._config?.easyConnect) {
          const _ = A._config.easyConnectKey ?? "alt", w = (N) => {
            if (!Op(N, _) || N.target.closest("[data-flow-handle-type]")) return;
            const M = t.$data(e.closest("[x-data]"));
            if (!M || M._animationLocked || M._connectValidating) return;
            const I = o(n);
            if (!I) return;
            const H = M.getNode(I.id);
            if (!H || H.connectable === !1) return;
            N.preventDefault(), N.stopPropagation(), N.stopImmediatePropagation();
            const V = zp(e, N.clientX, N.clientY), $ = V?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const E = e.closest(".flow-container");
            if (!E) return;
            const P = M._viewportLive ?? M.viewport, F = P?.zoom || 1, W = P?.x || 0, Q = P?.y || 0, G = E.getBoundingClientRect();
            let j, Z;
            if (V) {
              const U = V.getBoundingClientRect();
              j = (U.left + U.width / 2 - G.left - W) / F, Z = (U.top + U.height / 2 - G.top - Q) / F;
            } else {
              const U = e.getBoundingClientRect();
              j = (U.left + U.width / 2 - G.left - W) / F, Z = (U.top + U.height / 2 - G.top - Q) / F;
            }
            M._emit("connect-start", { source: I.id, sourceHandle: $ });
            const O = Gt({
              connectionLineType: M._config?.connectionLineType,
              connectionLineStyle: M._config?.connectionLineStyle,
              connectionLine: M._config?.connectionLine
            }), q = E.querySelector(".flow-viewport");
            q && q.appendChild(O.svg), O.update({ fromX: j, fromY: Z, toX: j, toY: Z, source: I.id, sourceHandle: $ }), M.pendingConnection = { source: I.id, sourceHandle: $, position: { x: j, y: Z } }, Ln(E, I.id, $, M);
            let Y = Lo(E, M, N.clientX, N.clientY), K = null;
            const z = M._config?.connectionSnapRadius ?? 20, J = (U) => {
              const re = M.screenToFlowPosition(U.clientX, U.clientY), se = kn({
                containerEl: E,
                handleType: "target",
                excludeNodeId: I.id,
                cursorFlowPos: re,
                connectionSnapRadius: z,
                getNode: (ie) => M.getNode(ie),
                toFlowPosition: (ie, te) => M.screenToFlowPosition(ie, te)
              });
              se.element !== K && (K?.classList.remove("flow-handle-active"), se.element?.classList.add("flow-handle-active"), K = se.element), O.update({ fromX: j, fromY: Z, toX: se.position.x, toY: se.position.y, source: I.id, sourceHandle: $ }), M.pendingConnection = { ...M.pendingConnection, position: se.position }, Y?.updatePointer(U.clientX, U.clientY);
            }, ee = async (U) => {
              Y?.stop(), Y = null, document.removeEventListener("pointermove", J), document.removeEventListener("pointerup", ee), O.destroy(), K?.classList.remove("flow-handle-active"), Le(E), e.classList.remove("flow-easy-connecting");
              const re = M.screenToFlowPosition(U.clientX, U.clientY), se = { source: I.id, sourceHandle: $, position: re };
              M.pendingConnection = null;
              let ie = K;
              if (ie || (ie = document.elementFromPoint(U.clientX, U.clientY)?.closest('[data-flow-handle-type="target"]')), !ie) {
                M._emit("connect-end", { connection: null, ...se });
                return;
              }
              const ne = ie.closest("[x-flow-node]")?.dataset.flowNodeId, pe = ie.dataset.flowHandleId ?? "target";
              if (!ne) {
                M._emit("connect-end", { connection: null, ...se });
                return;
              }
              const ue = { source: I.id, sourceHandle: $, target: ne, targetHandle: pe }, le = await wa({ connection: ue, canvas: M, containerEl: E });
              M._emit("connect-end", {
                connection: le.applied ? ue : null,
                ...se
              });
            };
            document.addEventListener("pointermove", J), document.addEventListener("pointerup", ee);
          };
          e.addEventListener("pointerdown", w, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", w, { capture: !0 });
          });
        }
      }
      const T = (A) => {
        if (!Fp(A, e)) return;
        A.preventDefault();
        const _ = o(n);
        if (!_) return;
        const w = t.$data(e.closest("[x-data]"));
        w && (w._animationLocked || (w._emit("node-click", { node: _, event: A }), pn(_, w._config?.nodesSelectable !== !1) && (A.stopPropagation(), bt(A, w._shortcuts?.multiSelect) ? w.selectedNodes.has(_.id) ? (w.selectedNodes.delete(_.id), _.selected = !1) : (w.selectedNodes.add(_.id), _.selected = !0) : (w.deselectAll(), w.selectedNodes.add(_.id), _.selected = !0), w._emitSelectionChange())));
      };
      e.addEventListener("keydown", T);
      const R = () => {
        const A = t.$data(e.closest("[x-data]"));
        if (!A?._config?.autoPanOnNodeFocus) return;
        const _ = o(n);
        if (!_) return;
        const w = _.parentId ? A.getAbsolutePosition(_.id) : _.position;
        A.setCenter(
          w.x + (_.dimensions?.width ?? 150) / 2,
          w.y + (_.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", R);
      const L = (A) => {
        if (a) return;
        const _ = o(n);
        if (!_) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w && !w._animationLocked && (w._emit("node-click", { node: _, event: A }), !!pn(_, w._config?.nodesSelectable !== !1))) {
          if (A.stopPropagation(), c) {
            c = !1;
            return;
          }
          bt(A, w._shortcuts?.multiSelect) ? w.selectedNodes.has(_.id) ? (w.selectedNodes.delete(_.id), _.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${_.id}" deselected (shift)`)) : (w.selectedNodes.add(_.id), _.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${_.id}" selected (shift)`)) : (w.deselectAll(), w.selectedNodes.add(_.id), _.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${_.id}" selected`)), w._emitSelectionChange();
        }
      };
      e.addEventListener("click", L);
      const D = (A) => {
        A.preventDefault(), A.stopPropagation();
        const _ = o(n);
        if (!_) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w)
          if (w.selectedNodes.size > 1 && w.selectedNodes.has(_.id)) {
            const { nodes: N, edges: M } = w.getSelectedNodesAndEdges();
            w._emit("selection-context-menu", { nodes: N, edges: M, event: A });
          } else
            w._emit("node-context-menu", { node: _, event: A });
      };
      e.addEventListener("contextmenu", D), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const A = o(n);
        if (!A) return;
        const _ = t.$data(e.closest("[x-data]"));
        A.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${A.id}" measured`, A.dimensions), _?._nodeElements?.set(A.id, e), A.resizeObserver !== !1 && _?._resizeObserver && _._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", T), e.removeEventListener("focus", R), e.removeEventListener("click", L), e.removeEventListener("contextmenu", D);
        const A = e.dataset.flowNodeId;
        if (A) {
          const _ = t.$data(e.closest("[x-data]"));
          _?._nodeElements?.delete(A), _?._resizeObserver?.unobserve(e), _?._draggingNodeIds?.delete(A);
        }
      });
    }
  );
}
const It = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function qp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  u ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : f && (g = o.height - e.y), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)));
  const m = p - o.width, y = g - o.height, b = d ? n.x - m : n.x, S = f ? n.y - y : n.y;
  return {
    position: { x: b, y: S },
    dimensions: { width: p, height: g }
  };
}
const qa = ["top-left", "top-right", "bottom-left", "bottom-right"], Ya = ["top", "right", "bottom", "left"], Yp = [...qa, ...Ya], Xp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Wp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = jp(o);
      let l = { ...It };
      if (n)
        try {
          const d = i(n);
          l = { ...It, ...d };
        } catch {
        }
      const c = [];
      for (const d of a) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Xp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), m = h.dataset.flowNodeId;
          if (!m || !g) return;
          const y = g.getNode(m);
          if (!y || !xs(y)) return;
          y.fixedDimensions = !0;
          const b = { ...l };
          if (y.minDimensions?.width != null && l.minWidth === It.minWidth && (b.minWidth = y.minDimensions.width), y.minDimensions?.height != null && l.minHeight === It.minHeight && (b.minHeight = y.minDimensions.height), y.maxDimensions?.width != null && l.maxWidth === It.maxWidth && (b.maxWidth = y.maxDimensions.width), y.maxDimensions?.height != null && l.maxHeight === It.maxHeight && (b.maxHeight = y.maxDimensions.height), !y.dimensions) {
            const L = g.viewport?.zoom || 1, D = h.getBoundingClientRect();
            y.dimensions = { width: D.width / L, height: D.height / L };
          }
          const S = { x: y.position.x, y: y.position.y }, x = { width: y.dimensions.width, height: y.dimensions.height }, k = g.viewport?.zoom || 1, v = f.clientX, C = f.clientY;
          g._captureHistory?.(), B("resize", `Resize start on "${m}" (${d})`, x), g._emit("node-resize-start", { node: y, dimensions: { ...x } });
          const T = (L) => {
            const D = {
              x: (L.clientX - v) / k,
              y: (L.clientY - C) / k
            }, A = qp(
              d,
              D,
              S,
              x,
              b,
              g._config?.snapToGrid ?? !1
            );
            if (y.position.x = A.position.x, y.position.y = A.position.y, y.dimensions.width = A.dimensions.width, y.dimensions.height = A.dimensions.height, y.parentId) {
              const _ = g.getAbsolutePosition(y.id);
              h.style.left = `${_.x}px`, h.style.top = `${_.y}px`;
            } else
              h.style.left = `${A.position.x}px`, h.style.top = `${A.position.y}px`;
            h.style.width = `${A.dimensions.width}px`, h.style.height = `${A.dimensions.height}px`, g._layoutAnimTick++, g._emit("node-resize", { node: y, dimensions: { ...A.dimensions } });
          }, R = () => {
            document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", R), document.removeEventListener("pointercancel", R), B("resize", `Resize end on "${m}"`, y.dimensions), g._emit("node-resize-end", { node: y, dimensions: { ...y.dimensions } });
          };
          document.addEventListener("pointermove", T), document.addEventListener("pointerup", R), document.addEventListener("pointercancel", R);
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
        const g = !xs(p);
        for (const m of c)
          m.style.display = g ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function jp(t) {
  if (t.includes("corners"))
    return qa;
  if (t.includes("edges"))
    return Ya;
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
  return Yp;
}
let sr = !1;
function Ue(t) {
  const e = t.closest("[data-flow-target]");
  if (e) {
    const i = e.getAttribute("data-flow-target");
    if (i) {
      const r = document.querySelector(i);
      if (r)
        return r;
    }
  }
  const n = t.closest("[data-flow-canvas]");
  if (n)
    return n;
  const o = document.querySelectorAll("[data-flow-canvas]");
  return o.length === 1 ? o[0] : (sr || (sr = !0, console.warn(
    '[alpineflow] Could not resolve a canvas for a flow directive placed outside the canvas element. Add `data-flow-target="<selector>"` pointing at the canvas, or ensure exactly one canvas is present in the document.'
  )), null);
}
function Up(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function Gp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Zp(t) {
  t.directive(
    "flow-rotate",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("snap"), l = a && n && Number(i(n)) || 15;
      e.classList.add("flow-rotate-handle"), e.style.cursor = "grab";
      const c = (d) => {
        d.preventDefault(), d.stopPropagation();
        const u = e.closest("[x-flow-node]");
        if (!u) return;
        const f = Ue(e);
        if (!f) return;
        const h = t.$data(f), p = u.dataset.flowNodeId;
        if (!p || !h) return;
        const g = h.getNode(p);
        if (!g) return;
        const m = u.getBoundingClientRect(), y = m.left + m.width / 2, b = m.top + m.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const S = (k) => {
          let v = Up(
            k.clientX,
            k.clientY,
            y,
            b
          );
          a && (v = Gp(v, l)), g.rotation = v;
        }, x = () => {
          document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", x), e.style.cursor = "grab", h._emit("node-rotate-end", { node: g, rotation: g.rotation });
        };
        document.addEventListener("pointermove", S), document.addEventListener("pointerup", x);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function Kp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const Jp = "application/alpineflow";
function Qp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(Jp, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function em(t) {
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
function tm(t) {
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
        const l = i.edges, c = new Set(l.map((g) => g.id));
        for (const [g, m] of a)
          c.has(g) || (t.destroyTree(m), m.remove(), a.delete(g), i._edgeSvgElements?.delete(g));
        for (const g of l) {
          if (a.has(g.id)) continue;
          const m = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          m.setAttribute("class", "flow-edge-svg");
          const y = document.createElementNS("http://www.w3.org/2000/svg", "g");
          m.appendChild(y), t.addScopeToNode(y, { edge: g }), y.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(m);
          }), a.set(g.id, m), i._edgeSvgElements?.set(g.id, m), t.initTree(y);
        }
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
        if (f) {
          const g = em(
            l
          );
          for (const m of g)
            h.add(m.primaryId), p.add(m.mirrorId);
        }
        for (const g of l) {
          const m = h.has(g.id), y = p.has(g.id);
          !!g._renderDualMarker !== m && (g._renderDualMarker = m ? !0 : void 0), !!g._hiddenByCollapse !== y && (g._hiddenByCollapse = y ? !0 : void 0);
        }
        for (const g of l) {
          const m = a.get(g.id);
          if (!m) continue;
          const y = i.getNode?.(g.source), b = i.getNode?.(g.target), S = g.hidden || g._hiddenByCollapse || y?.hidden || b?.hidden;
          m.style.display = S ? "none" : "";
        }
        for (const g of l) {
          const m = a.get(g.id);
          if (!m) continue;
          const y = i.getNode?.(g.source), b = i.getNode?.(g.target);
          y?.filtered || b?.filtered ? m.classList.add("flow-edge-filtered") : m.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [l, c] of a)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(l);
        a.clear(), s.remove();
      });
    }
  );
}
const nm = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], om = "a, button, input, textarea, select, [contenteditable]", im = 100, sm = 60, rm = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), am = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), lm = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), cm = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function dm(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && nm.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function Dt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function um(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function fm(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (rm.has(e) && (t.style.top = "0"), am.has(e) && (t.style.bottom = "0")), o && !n && (lm.has(e) && (t.style.left = "0"), cm.has(e) && (t.style.right = "0"));
}
function hm(t) {
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
      } = dm(n, o), f = d || u, h = !s && !a && !f, p = !s && !l && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || f) && e.classList.add("flow-panel-locked"), (l || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && fm(e, r, d, u), i(Qt(e));
      const g = e.parentElement, m = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, y = `flow-panel-${r}`, b = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(y) || e.classList.add(y);
      };
      g.addEventListener("flow-panel-reset", b), g.__flowPanels || (g.__flowPanels = /* @__PURE__ */ new Set()), g.__flowPanels.add(e);
      let S = null;
      if (h) {
        let x = !1, k = 0, v = 0, C = 0, T = 0;
        const R = () => {
          const _ = e.getBoundingClientRect(), w = g.getBoundingClientRect();
          return {
            x: _.left - w.left,
            y: _.top - w.top
          };
        }, L = (_) => {
          if (!x) return;
          let w = C + (_.clientX - k), N = T + (_.clientY - v);
          if (c) {
            const M = um(
              w,
              N,
              e.offsetWidth,
              e.offsetHeight,
              g.clientWidth,
              g.clientHeight
            );
            w = M.left, N = M.top;
          }
          e.style.left = `${w}px`, e.style.top = `${N}px`, Dt(g, "panel-drag", {
            panel: e,
            position: { x: w, y: N }
          });
        }, D = () => {
          if (!x) return;
          x = !1, document.removeEventListener("pointermove", L), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D);
          const _ = R();
          Dt(g, "panel-drag-end", {
            panel: e,
            position: _
          });
        }, A = (_) => {
          const w = _.target;
          if (w.closest(om) || w.closest(".flow-panel-resize-handle"))
            return;
          x = !0, k = _.clientX, v = _.clientY;
          const N = e.getBoundingClientRect(), M = g.getBoundingClientRect();
          C = N.left - M.left, T = N.top - M.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${C}px`, e.style.top = `${T}px`, document.addEventListener("pointermove", L), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), Dt(g, "panel-drag-start", {
            panel: e,
            position: { x: C, y: T }
          });
        };
        if (e.addEventListener("pointerdown", A), p) {
          S = document.createElement("div"), S.classList.add("flow-panel-resize-handle"), e.appendChild(S);
          let _ = !1, w = 0, N = 0, M = 0, I = 0;
          const H = (E) => {
            if (!_) return;
            const P = Math.max(im, M + (E.clientX - w)), F = Math.max(sm, I + (E.clientY - N));
            e.style.width = `${P}px`, e.style.height = `${F}px`, Dt(g, "panel-resize", {
              panel: e,
              dimensions: { width: P, height: F }
            });
          }, V = () => {
            _ && (_ = !1, document.removeEventListener("pointermove", H), document.removeEventListener("pointerup", V), document.removeEventListener("pointercancel", V), Dt(g, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, $ = (E) => {
            E.stopPropagation(), _ = !0, w = E.clientX, N = E.clientY, M = e.offsetWidth, I = e.offsetHeight, document.addEventListener("pointermove", H), document.addEventListener("pointerup", V), document.addEventListener("pointercancel", V), Dt(g, "panel-resize-start", {
              panel: e,
              dimensions: { width: M, height: I }
            });
          };
          S.addEventListener("pointerdown", $), i(() => {
            e.removeEventListener("pointerdown", A), S?.removeEventListener("pointerdown", $), document.removeEventListener("pointermove", L), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), document.removeEventListener("pointermove", H), document.removeEventListener("pointerup", V), document.removeEventListener("pointercancel", V), S?.remove(), g.removeEventListener("flow-panel-reset", b), g.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", A), document.removeEventListener("pointermove", L), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), g.removeEventListener("flow-panel-reset", b), g.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          g.removeEventListener("flow-panel-reset", b), g.__flowPanels?.delete(e);
        });
    }
  );
}
function gm(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = pm(n), a = mm(o);
      e.classList.add("flow-node-toolbar"), e.style.position = "absolute";
      const l = Qt(e), c = (d) => {
        d.stopPropagation();
      };
      e.addEventListener("click", c), i(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const u = e.closest("[x-data]");
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = f.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, m = g ? f.getNode(g) : null, y = m?.dimensions?.width ?? d.offsetWidth, b = m?.dimensions?.height ?? d.offsetHeight, S = p / h;
        let x, k, v, C;
        s === "top" || s === "bottom" ? (k = s === "top" ? -S : b + S, C = s === "top" ? "-100%" : "0%", a === "start" ? (x = 0, v = "0%") : a === "end" ? (x = y, v = "-100%") : (x = y / 2, v = "-50%")) : (x = s === "left" ? -S : y + S, v = s === "left" ? "-100%" : "0%", a === "start" ? (k = 0, C = "0%") : a === "end" ? (k = b, C = "-100%") : (k = b / 2, C = "-50%")), e.style.left = `${x}px`, e.style.top = `${k}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${v}, ${C})`;
      }), r(() => {
        l(), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function pm(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function mm(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function ym(t) {
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
        const v = r(o);
        u = v?.offsetX ?? 0, f = v?.offsetY ?? 0;
      }
      l.setAttribute("role", "menu"), l.setAttribute("tabindex", "-1"), l.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let p = null;
      const g = 4, m = () => {
        p = document.activeElement;
        const v = d.contextMenu.x + u, C = d.contextMenu.y + f;
        l.style.display = "", l.style.position = "fixed", l.style.left = v + "px", l.style.top = C + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((_) => {
          _.setAttribute("role", "menuitem"), _.hasAttribute("tabindex") || _.setAttribute("tabindex", "-1");
        });
        const T = l.getBoundingClientRect(), R = window.innerWidth, L = window.innerHeight;
        let D = v, A = C;
        T.right > R - g && (D = R - T.width - g), T.bottom > L - g && (A = L - T.height - g), D < g && (D = g), A < g && (A = g), l.style.left = D + "px", l.style.top = A + "px", h.style.display = "", l.focus({ preventScroll: !0 });
      }, y = () => {
        l.style.display = "none", h.style.display = "none", p && document.contains(p) && (p.focus({ preventScroll: !0 }), p = null);
      };
      i(() => {
        const v = d.contextMenu;
        v.show && v.type === a ? m() : y();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (v) => {
        v.preventDefault(), d.closeContextMenu();
      });
      const b = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", b, !0);
      const S = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), x = (v) => Array.from(v.querySelectorAll(
        "button:not([disabled])"
      )), k = (v) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const C = document.activeElement, T = C?.closest(".flow-context-submenu"), R = T ? x(T) : S();
        if (R.length === 0) return;
        const L = R.indexOf(C);
        switch (v.key) {
          case "ArrowDown": {
            v.preventDefault();
            const D = L < R.length - 1 ? L + 1 : 0;
            R[D].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            v.preventDefault();
            const D = L > 0 ? L - 1 : R.length - 1;
            R[D].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (v.preventDefault(), v.shiftKey) {
              const D = L > 0 ? L - 1 : R.length - 1;
              R[D].focus({ preventScroll: !0 });
            } else {
              const D = L < R.length - 1 ? L + 1 : 0;
              R[D].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            v.preventDefault(), C?.click();
            break;
          }
          case "ArrowRight": {
            if (!T) {
              const D = C?.querySelector(".flow-context-submenu");
              D && (v.preventDefault(), D.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            T && (v.preventDefault(), T.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      l.addEventListener("keydown", k), s(() => {
        h.remove(), window.removeEventListener("scroll", b, !0), l.removeEventListener("keydown", k);
      });
    }
  );
}
const wm = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function _m(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), u = l.has("queue"), f = n || "";
      let h = "click";
      l.has("mouseenter") ? h = "mouseenter" : l.has("click") && (h = "click");
      let p = null, g = [], m = !1, y = !1, b = !1;
      function S() {
        const D = r(i);
        return Array.isArray(D) ? D : D && typeof D == "object" ? [D] : [];
      }
      function x() {
        const D = e.closest("[x-data]");
        return D ? t.$data(D) : null;
      }
      function k(D, A = !1) {
        const _ = x();
        if (!_?.timeline) return Promise.resolve();
        const w = _.timeline();
        if (A) {
          for (let N = D.length - 1; N >= 0; N--)
            w.step(D[N]);
          w.reverse();
        } else
          for (const N of D)
            N.parallel ? w.parallel(N.parallel) : w.step(N);
        return p = w, w.play().then(() => {
          p === w && (p = null);
        });
      }
      function v(D = !1) {
        if (c && y) return;
        y = !0;
        const A = S();
        if (A.length === 0) return;
        const _ = () => k(A, D);
        u ? (g.push(_), C()) : (p?.stop(), p = null, g = [], m = !1, _());
      }
      async function C() {
        if (!m) {
          for (m = !0; g.length > 0; )
            await g.shift()();
          m = !1;
        }
      }
      if (f) {
        s(() => {
          const D = S(), A = x();
          A?.registerAnimation && A.registerAnimation(f, D);
        }), a(() => {
          const D = x();
          D?.unregisterAnimation && D.unregisterAnimation(f);
        });
        return;
      }
      const T = () => {
        d && h === "click" ? (v(b), b = !b) : v(!1);
      };
      e.addEventListener(h, T);
      let R = null, L = null;
      d && h !== "click" && (L = wm[h] ?? null, L && (R = () => v(!0), e.addEventListener(L, R))), a(() => {
        p?.stop(), e.removeEventListener(h, T), L && R && e.removeEventListener(L, R);
      });
    }
  );
}
function vm(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? we, l = t.dimensions?.height ?? ve, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + a) * n.zoom + n.x, f = (s + l) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function bm(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !vm(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function xm(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, a = null, l = [], c = !1, d = "idle", u = 0;
      function f() {
        const m = e.closest("[x-data]");
        return m ? t.$data(m) : null;
      }
      function h(m, y) {
        const b = f();
        if (!b?.timeline) return Promise.resolve();
        const S = b.timeline(), x = y.speed ?? 1, k = y.autoFitView === !0, v = y.fitViewPadding ?? 0.1, C = b.viewport, T = b.getContainerDimensions?.();
        for (const R of m) {
          const L = x !== 1 ? {
            ...R,
            duration: R.duration !== void 0 ? R.duration / x : void 0,
            delay: R.delay !== void 0 ? R.delay / x : void 0
          } : R;
          if (L.parallel) {
            const D = L.parallel.map(
              (A) => x !== 1 ? {
                ...A,
                duration: A.duration !== void 0 ? A.duration / x : void 0,
                delay: A.delay !== void 0 ? A.delay / x : void 0
              } : A
            );
            S.parallel(D);
          } else if (k && C && T && bm(L, b, C, T.width, T.height)) {
            const D = {
              fitView: !0,
              fitViewPadding: v,
              duration: L.duration,
              easing: L.easing
            };
            S.parallel([L, D]);
          } else
            S.step(L);
        }
        if (y.lock && S.lock(!0), y.loop !== void 0 && y.loop !== !1) {
          const R = y.loop === !0 ? 0 : y.loop;
          S.loop(R);
        }
        return y.respectReducedMotion !== void 0 && S.respectReducedMotion(y.respectReducedMotion), a = S, d = "playing", c = !0, S.play().then(() => {
          a === S && (a = null, d = "idle", c = !1);
        });
      }
      async function p(m) {
        if (l.length === 0) return;
        if ((m.overflow ?? "queue") === "latest" && c) {
          a?.stop(), a = null, c = !1, d = "idle";
          const b = [l[l.length - 1]];
          s += l.length, l = [], await h(b, m);
        } else {
          const b = [...l];
          s += b.length, l = [], c && await new Promise((x) => {
            a ? (a.on("complete", () => x()), a.on("stop", () => x())) : x();
          }), await h(b, m);
        }
      }
      const g = {
        async play() {
          const m = o(n), y = m.steps ?? [];
          s < y.length && (l = y.slice(s), await p(m));
        },
        stop() {
          a?.stop(), a = null, c = !1, d = "stopped", l = [];
        },
        reset(m) {
          if (a?.stop(), a = null, c = !1, d = "idle", s = 0, l = [], u = 0, m) {
            const y = o(n), b = y.steps ?? [];
            if (b.length > 0)
              return l = [...b], p(y);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = g, i(() => {
        const m = o(n);
        if (!m || !m.steps) return;
        const y = m.steps, b = m.autoplay !== !1;
        if (y.length > u) {
          const S = y.slice(Math.max(s, u));
          u = y.length, S.length > 0 && b && (l.push(...S), p(m));
        } else
          u = y.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function Em(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("all"), l = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = Ue(e);
        if (!f) return;
        const h = t.$data(f);
        if (!h) return;
        if (a) {
          for (const g of h.nodes)
            l ? h.expandNode?.(g.id, { animate: !d }) : h.collapseNode?.(g.id, { animate: !d });
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        if (c && n) {
          const g = i(n);
          if (!g) return;
          for (const m of h.nodes)
            m.parentId === g && (l ? h.expandNode?.(m.id, { animate: !d }) : h.collapseNode?.(m.id, { animate: !d }));
          e.setAttribute("aria-expanded", String(l));
          return;
        }
        const p = i(n);
        !p || !h?.toggleNode || h.toggleNode(p, { animate: !d });
      };
      e.addEventListener("click", u), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !a && !c && r(() => {
        const f = i(n);
        if (!f) return;
        const h = Ue(e);
        if (!h) return;
        const p = t.$data(h);
        if (!p?.isCollapsed) return;
        const g = p.isCollapsed(f);
        e.setAttribute("aria-expanded", String(!g));
        const m = e.closest("[x-flow-node]");
        m && e.setAttribute("aria-controls", m.id || f);
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Cm(t) {
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
function Xo(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Be(t, e, n) {
  const o = (Array.isArray(n) ? n : n ? [n] : []).flatMap((s) => s.split(/\s+/)).filter(Boolean), i = new Set(o), r = t.dataset[e] ? t.dataset[e].split(" ") : [];
  for (const s of r) i.has(s) || t.classList.remove(s);
  for (const s of i) t.classList.add(s);
  i.size ? t.dataset[e] = [...i].join(" ") : delete t.dataset[e];
}
function rr(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
const ar = [
  ["icon", ".flow-schema-row-icon"],
  ["name", ".flow-schema-row-name"],
  ["type", ".flow-schema-row-type"],
  ["target", ".flow-schema-handle--target:not(.flow-schema-handle--mirror)"],
  ["source", ".flow-schema-handle--source:not(.flow-schema-handle--mirror)"],
  ["mirrorTarget", ".flow-schema-handle--target.flow-schema-handle--mirror"],
  ["mirrorSource", ".flow-schema-handle--source.flow-schema-handle--mirror"]
];
function Sm(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
      try {
        const v = s.closest(".flow-container");
        return v ? !!t.$data?.(v)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const v = s.closest(".flow-container");
        return v ? !!t.$data?.(v)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    }, d = () => {
      try {
        const v = s.closest(".flow-container");
        return v ? t.$data?.(v) ?? null : null;
      } catch {
        return null;
      }
    }, u = () => {
      const v = d()?._config;
      return {
        nodeDecorator: typeof v?.schemaNodeDecorator == "function" ? v.schemaNodeDecorator : null,
        rowDecorator: typeof v?.schemaRowDecorator == "function" ? v.schemaRowDecorator : null,
        nodeClass: typeof v?.schemaNodeClass == "function" ? v.schemaNodeClass : null,
        rowClass: typeof v?.schemaRowClass == "function" ? v.schemaRowClass : null
      };
    }, f = () => {
      t.nextTick(() => {
        const v = d();
        if (!v) return;
        const C = t.raw(v);
        if (C._schemaMetrics != null) return;
        const T = s.querySelector(":scope > .flow-schema-header"), R = s.querySelector(":scope > .flow-schema-body"), L = s.querySelectorAll(".flow-schema-row");
        if (L.length < 2) return;
        const D = L[0], A = L[1], _ = L[L.length - 1], w = D.querySelector(".flow-schema-handle"), N = _.querySelector(".flow-schema-handle");
        if (!T || !R || !w || !N) return;
        const M = s.closest("[data-flow-node-id]") ?? s, I = C.viewport?.zoom || 1, H = M.getBoundingClientRect(), V = T.getBoundingClientRect(), $ = R.getBoundingClientRect(), E = D.getBoundingClientRect(), P = A.getBoundingClientRect(), F = _.getBoundingClientRect(), W = w.getBoundingClientRect(), Q = N.getBoundingClientRect(), G = (P.top - E.top) / I, j = F.height / I;
        if (G <= 0 || j <= 0) return;
        const Z = {
          headerHeight: V.height / I,
          rowHeight: G,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast: j,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (W.top + W.height / 2 - E.top) / I,
          handleOffsetYLast: (Q.top + Q.height / 2 - F.top) / I,
          insetLeft: (E.left - H.left) / I,
          insetRight: (H.right - E.right) / I,
          insetTop: (V.top - H.top) / I,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (H.bottom - $.bottom) / I,
          handleWidth: W.width / I,
          handleHeight: W.height / I
        };
        C._schemaMetrics = Z;
      });
    };
    s.classList.add("flow-schema-node");
    let h = s.closest("[data-flow-node-id]"), p = !1;
    h ? h.setAttribute("data-flow-schema-node", "") : t.nextTick(() => {
      p || !s.isConnected || (h = s.closest("[data-flow-node-id]"), h?.setAttribute("data-flow-schema-node", ""));
    });
    let g = null, m = null;
    const y = /* @__PURE__ */ new Map(), b = () => g && m ? !1 : (Xo(s), y.clear(), g = document.createElement("div"), g.className = "flow-schema-header", s.appendChild(g), m = document.createElement("div"), m.className = "flow-schema-body", s.appendChild(m), !0), S = () => {
      const v = a(), C = v?.data;
      if (!C) {
        for (const $ of y.values())
          t.destroyTree($);
        y.clear(), Xo(s), Be(s, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub, g = null, m = null;
        return;
      }
      const T = b(), R = u(), L = typeof C.label == "string" ? C.label : "", D = Array.isArray(C.fields) ? C.fields : [], A = typeof v?.id == "string" ? v.id : "", _ = ($, E, P) => {
        const F = $.dataset.flowSchemaRowSub === "1";
        if (!R.rowClass && !$.dataset.flowSchemaRowClass && !F) return;
        let W = null;
        if (R.rowClass)
          try {
            W = R.rowClass({
              field: E,
              node: v,
              nodeId: A,
              isNew: P
            });
          } catch (Q) {
            console.error("[alpineflow] schemaRowClass threw:", Q);
            return;
          }
        if (rr(W)) {
          const Q = W;
          Be($, "flowSchemaRowClass", Q.row);
          for (const [G, j] of ar) {
            const Z = $.querySelector(j);
            Z && Be(Z, "flowSchemaRowClass", Q[G]);
          }
          $.dataset.flowSchemaRowSub = "1";
        } else if (Be($, "flowSchemaRowClass", W), F) {
          for (const [, Q] of ar) {
            const G = $.querySelector(Q);
            G && Be(G, "flowSchemaRowClass", null);
          }
          delete $.dataset.flowSchemaRowSub;
        }
      }, w = ($, E, P) => {
        if (!R.rowDecorator) return;
        const F = {
          icon: $.querySelector(".flow-schema-row-icon"),
          name: $.querySelector(".flow-schema-row-name"),
          type: $.querySelector(".flow-schema-row-type"),
          target: $.querySelector(
            ".flow-schema-handle--target:not(.flow-schema-handle--mirror)"
          ),
          source: $.querySelector(
            ".flow-schema-handle--source:not(.flow-schema-handle--mirror)"
          ),
          mirrorTarget: $.querySelector(
            ".flow-schema-handle--target.flow-schema-handle--mirror"
          ),
          mirrorSource: $.querySelector(
            ".flow-schema-handle--source.flow-schema-handle--mirror"
          )
        };
        try {
          R.rowDecorator({ row: $, field: E, nodeId: A, slots: F, isNew: P });
        } catch (W) {
          console.error("[alpineflow] schemaRowDecorator threw:", W);
        }
      };
      typeof C.kind == "string" && C.kind ? s.setAttribute("data-flow-schema-kind", C.kind) : s.removeAttribute("data-flow-schema-kind"), g.textContent !== L && (g.textContent = L);
      const N = l(), M = c(), I = /* @__PURE__ */ new Set();
      for (const $ of D) {
        I.add($.name);
        const E = y.get($.name);
        if (E)
          x(E, $), _(E, $, !1), w(E, $, !1);
        else {
          const P = k($, A, N, M);
          y.set($.name, P), m.appendChild(P), t.initTree(P), _(P, $, !0), w(P, $, !0);
        }
      }
      for (const [$, E] of y)
        I.has($) || (t.destroyTree(E), E.remove(), y.delete($));
      let H = m.firstChild;
      for (const $ of D) {
        const E = y.get($.name);
        E && (H === E ? H = H.nextSibling : m.insertBefore(E, H));
      }
      const V = s.dataset.flowSchemaNodeSub === "1";
      if (R.nodeClass || s.dataset.flowSchemaNodeClass || V) {
        let $ = null, E = !1;
        if (R.nodeClass)
          try {
            $ = R.nodeClass({
              node: v,
              isNew: T
            });
          } catch (P) {
            console.error("[alpineflow] schemaNodeClass threw:", P), E = !0;
          }
        if (!E)
          if (rr($)) {
            const P = $;
            Be(s, "flowSchemaNodeClass", P.node), Be(g, "flowSchemaNodeClass", P.header), Be(m, "flowSchemaNodeClass", P.body), s.dataset.flowSchemaNodeSub = "1";
          } else
            Be(s, "flowSchemaNodeClass", $), V && (Be(g, "flowSchemaNodeClass", null), Be(m, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub);
      }
      if (R.nodeDecorator)
        try {
          R.nodeDecorator({
            host: s,
            header: g,
            body: m,
            node: v,
            isNew: T
          });
        } catch ($) {
          console.error("[alpineflow] schemaNodeDecorator threw:", $);
        }
      f();
    }, x = (v, C) => {
      v.dataset.flowSchemaField !== C.name && (v.dataset.flowSchemaField = C.name), v.classList.toggle("flow-schema-row--pk", C.key === "primary"), v.classList.toggle("flow-schema-row--fk", C.key === "foreign"), v.classList.toggle("flow-schema-row--required", !!C.required);
      let T = v.querySelector(".flow-schema-row-icon");
      const R = v.querySelector(".flow-schema-row-name");
      C.icon ? (T || (T = document.createElement("span"), T.className = "flow-schema-row-icon", v.insertBefore(T, R)), T.textContent !== C.icon && (T.textContent = C.icon)) : T && T.remove(), R && R.textContent !== C.name && (R.textContent = C.name);
      const L = v.querySelector(".flow-schema-row-type");
      L && L.textContent !== C.type && (L.textContent = C.type);
    }, k = (v, C, T, R) => {
      const L = document.createElement("div");
      L.className = "flow-schema-row", L.dataset.flowSchemaField = v.name, v.key === "primary" && L.classList.add("flow-schema-row--pk"), v.key === "foreign" && L.classList.add("flow-schema-row--fk"), v.required && L.classList.add("flow-schema-row--required"), C && L.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${C}.${v.name}`)
      ), T && L.setAttribute("x-schema-reorderable", ""), R && C && L.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${C}.${v.name}`)
      );
      const D = document.createElement("div");
      if (D.className = "flow-schema-handle flow-schema-handle--target", D.setAttribute("x-flow-handle:target.left", JSON.stringify(v.name)), L.appendChild(D), v.icon) {
        const I = document.createElement("span");
        I.className = "flow-schema-row-icon", I.textContent = v.icon, L.appendChild(I);
      }
      const A = document.createElement("span");
      A.className = "flow-schema-row-name", A.textContent = v.name, L.appendChild(A);
      const _ = document.createElement("span");
      _.className = "flow-schema-row-type", _.textContent = v.type, L.appendChild(_);
      const w = document.createElement("div");
      w.className = "flow-schema-handle flow-schema-handle--source", w.setAttribute("x-flow-handle:source.right", JSON.stringify(v.name)), L.appendChild(w);
      const N = document.createElement("div");
      N.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", N.setAttribute("x-flow-handle:target.right", JSON.stringify(v.name)), L.appendChild(N);
      const M = document.createElement("div");
      return M.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", M.setAttribute("x-flow-handle:source.left", JSON.stringify(v.name)), L.appendChild(M), L;
    };
    i(() => {
      if (!s.isConnected) return;
      const v = a()?.data;
      v?.label, v?.kind;
      const C = v?.fields;
      if (Array.isArray(C))
        for (const T of C)
          T.name, T.type, T.key, T.required, T.icon, T.description, T.deprecated, T.tags, T.defaultValue;
      S();
    }), r(() => {
      p = !0;
      for (const v of y.values())
        t.destroyTree(v);
      y.clear(), Xo(s), g = null, m = null, s.classList.remove("flow-schema-node"), Be(s, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub, h?.removeAttribute("data-flow-schema-node");
    });
  });
}
function km(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function lr(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Lm(t) {
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
      lr(s);
      const d = a()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, p = document.createElement("div");
      if (p.className = "flow-wait-header", f) {
        const S = document.createElement("span");
        S.className = "flow-wait-icon", S.textContent = f, p.appendChild(S);
      }
      const g = document.createElement("span");
      g.className = "flow-wait-label", g.textContent = u, p.appendChild(g);
      const m = document.createElement("span");
      m.className = "flow-wait-duration", m.textContent = km(h), p.appendChild(m), s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-wait-handle flow-wait-handle--target", y.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(y);
      const b = document.createElement("div");
      b.className = "flow-wait-handle flow-wait-handle--source", b.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(b), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = a()?.data;
      c?.durationMs, c?.label, c?.icon, l();
    }), r(() => {
      lr(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const cr = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function gn(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(gn).join(", ")}]` : String(t);
}
function Mm(t) {
  const { field: e, op: n, value: o } = t;
  return n in cr ? `${e} ${cr[n]} ${gn(o)}` : n === "in" ? `${e} in ${gn(o)}` : n === "notIn" ? `${e} not in ${gn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${gn(o)}`;
}
function dr(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Pm(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Tm(t) {
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
      const u = a()?.data ?? {}, f = Pm(l(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), dr(s);
      const p = typeof u.label == "string" && u.label ? u.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? m.textContent = Mm(u.condition) : typeof u.evaluate == "function" ? m.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : m.textContent = "", s.appendChild(m);
      const y = document.createElement("div");
      y.className = "flow-condition-handle-target", y.setAttribute("data-flow-handle-direction", "target"), y.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(y);
      const b = document.createElement("div");
      b.className = "flow-condition-handle-source flow-condition-handle--true", b.setAttribute("data-flow-handle-direction", "source"), b.setAttribute("data-source-handle", "true"), b.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(b);
      const S = document.createElement("div");
      S.className = "flow-condition-handle-source flow-condition-handle--false", S.setAttribute("data-flow-handle-direction", "source"), S.setAttribute("data-source-handle", "false"), S.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(S), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = a()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      dr(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Am(t) {
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
function Nm(t) {
  t.directive(
    "flow-detail",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      if (n) {
        const u = Ue(e);
        if (!u) return;
        const f = t.$data(u);
        if (!f?.viewport) return;
        const h = e.style.display;
        r(() => {
          const p = i(n), g = f.viewport.zoom, m = p.min === void 0 || g >= p.min, y = p.max === void 0 || g <= p.max;
          e.style.display = m && y ? h : "none";
        }), s(() => {
          e.style.display = h;
        });
        return;
      }
      const a = new Set(o.filter((u) => u === "far" || u === "medium" || u === "close"));
      if (a.size === 0) return;
      const l = Ue(e);
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
const ur = [
  "flow-init",
  "flow-connect",
  "flow-connect-start",
  "flow-connect-end",
  "flow-reconnect",
  "flow-nodes-change",
  "flow-edges-change",
  "flow-restore",
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
], $m = /* @__PURE__ */ new Set(["flow-viewport-move", "flow-viewport-change", "flow-node-drag"]);
function Im(t, e) {
  return e || !$m.has(t);
}
const Dm = ["perf", "events", "viewport", "state", "activity"], fr = ["fps", "memory", "counts", "visible"], hr = 30;
function Rm(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Dm.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Hm(t) {
  return t.perf ? t.perf === !0 ? [...fr] : t.perf.filter((e) => fr.includes(e)) : [];
}
function Fm(t) {
  return t.events ? t.events === !0 ? hr : t.events.max ?? hr : 0;
}
function dn(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function qe(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function Om(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = Rm(a, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = Qt(e), f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      p.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(p), f.appendChild(h), e.appendChild(f);
      const g = document.createElement("div");
      g.className = "flow-devtools-panel", g.style.display = "none", e.appendChild(g);
      let m = !1, y = null;
      const b = () => {
        m = !m, g.style.display = m ? "" : "none", f.title = m ? "Collapse" : "Devtools", m && y?.(), m ? Q() : G();
      };
      f.addEventListener("click", b);
      const S = Hm(l);
      let x = null, k = null, v = null, C = null, T = null;
      if (S.length > 0) {
        const { wrapper: O, content: q } = dn("Performance", "flow-devtools-perf");
        if (S.includes("fps")) {
          const { row: Y, valueEl: K } = qe("FPS", "flow-devtools-fps");
          x = K, q.appendChild(Y);
        }
        if (S.includes("memory")) {
          const { row: Y, valueEl: K } = qe("Memory", "flow-devtools-memory");
          k = K, q.appendChild(Y);
        }
        if (S.includes("counts")) {
          const Y = qe("Nodes", "flow-devtools-counts");
          v = Y.valueEl, q.appendChild(Y.row);
          const K = qe("Edges", "flow-devtools-counts");
          C = K.valueEl, q.appendChild(K.row);
        }
        if (S.includes("visible")) {
          const { row: Y, valueEl: K } = qe("Visible", "flow-devtools-visible");
          T = K, q.appendChild(Y);
        }
        g.appendChild(O);
      }
      const R = Fm(l);
      let L = null;
      if (R > 0) {
        const { wrapper: O, content: q } = dn("Events", "flow-devtools-events"), Y = document.createElement("button");
        Y.className = "flow-devtools-clear-btn nopan", Y.textContent = "Clear", Y.addEventListener("click", () => {
          L && (L.textContent = ""), j.length = 0;
        }), O.querySelector(".flow-devtools-section-title").appendChild(Y), L = document.createElement("div"), L.className = "flow-devtools-event-list", q.appendChild(L), g.appendChild(O);
      }
      let D = null, A = null, _ = null;
      if (l.viewport) {
        const { wrapper: O, content: q } = dn("Viewport", "flow-devtools-viewport"), Y = qe("X", "flow-devtools-vp-x");
        D = Y.valueEl, q.appendChild(Y.row);
        const K = qe("Y", "flow-devtools-vp-y");
        A = K.valueEl, q.appendChild(K.row);
        const z = qe("Zoom", "flow-devtools-vp-zoom");
        _ = z.valueEl, q.appendChild(z.row), g.appendChild(O);
      }
      let w = null;
      if (l.state) {
        const { wrapper: O, content: q } = dn("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", q.appendChild(w), g.appendChild(O);
      }
      let N = null, M = null, I = null, H = null;
      if (l.activity) {
        const { wrapper: O, content: q } = dn("Activity", "flow-devtools-activity"), Y = qe("Animations", "flow-devtools-anim");
        N = Y.valueEl, q.appendChild(Y.row);
        const K = qe("Particles", "flow-devtools-particles");
        M = K.valueEl, q.appendChild(K.row);
        const z = qe("Follow", "flow-devtools-follow");
        I = z.valueEl, q.appendChild(z.row);
        const J = qe("Timelines", "flow-devtools-timelines");
        H = J.valueEl, q.appendChild(J.row), g.appendChild(O);
      }
      let V = null, $ = !1, E = 0, P = performance.now();
      const F = !!(x || k), W = () => {
        if (!$) return;
        E++;
        const O = performance.now();
        O - P >= 1e3 && (x && (x.textContent = String(Math.round(E * 1e3 / (O - P)))), E = 0, P = O, k && performance.memory && (k.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), V = requestAnimationFrame(W);
      }, Q = () => {
        !F || $ || ($ = !0, E = 0, P = performance.now(), V = requestAnimationFrame(W));
      }, G = () => {
        $ = !1, V !== null && (cancelAnimationFrame(V), V = null);
      }, j = [];
      let Z = null;
      if (R > 0 && L) {
        Z = (O) => {
          if (!Im(O.type, m)) return;
          const q = O, Y = q.type.replace("flow-", "");
          let K = "";
          try {
            K = q.detail ? JSON.stringify(q.detail).slice(0, 80) : "";
          } catch {
            K = "[circular]";
          }
          if (j.unshift({ name: Y, time: Date.now(), detail: K }), j.length > R && j.pop(), !m) return;
          const z = L, J = document.createElement("div");
          J.className = "flow-devtools-event-entry";
          const ee = document.createElement("span");
          ee.className = "flow-devtools-event-name", ee.textContent = Y;
          const U = document.createElement("span");
          U.className = "flow-devtools-event-age", U.textContent = "now";
          const re = document.createElement("span");
          for (re.className = "flow-devtools-event-detail", re.textContent = K, J.appendChild(ee), J.appendChild(U), J.appendChild(re), z.prepend(J); z.children.length > R; )
            z.removeChild(z.lastChild);
        };
        for (const O of ur)
          d.addEventListener(O, Z);
        y = () => {
          const O = L;
          O.textContent = "";
          for (const q of j) {
            const Y = document.createElement("div");
            Y.className = "flow-devtools-event-entry";
            const K = document.createElement("span");
            K.className = "flow-devtools-event-name", K.textContent = q.name;
            const z = document.createElement("span");
            z.className = "flow-devtools-event-age";
            const J = Math.round((Date.now() - q.time) / 1e3);
            z.textContent = J < 2 ? "now" : J + "s";
            const ee = document.createElement("span");
            ee.className = "flow-devtools-event-detail", ee.textContent = q.detail, Y.appendChild(K), Y.appendChild(z), Y.appendChild(ee), O.appendChild(Y);
          }
        };
      }
      r(() => {
        const O = t.$data(c);
        !O || !O.viewport || (D && (D.textContent = Math.round(O.viewport.x).toString()), A && (A.textContent = Math.round(O.viewport.y).toString()), _ && (_.textContent = O.viewport.zoom.toFixed(2)));
      }), r(() => {
        const O = t.$data(c);
        if (O) {
          if (v && (v.textContent = String(O.nodes?.length ?? 0)), C && (C.textContent = String(O.edges?.length ?? 0)), T && O._getVisibleNodeIds && (T.textContent = String(O._getVisibleNodeIds().size)), w) {
            const q = O.selectedNodes, Y = O.selectedEdges;
            if (!((q?.size ?? 0) > 0 || (Y?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", q && q.size > 0)
                for (const z of q) {
                  const J = O.getNode?.(z);
                  if (!J) continue;
                  const ee = document.createElement("pre");
                  ee.className = "flow-devtools-json", ee.textContent = JSON.stringify({ id: J.id, position: J.position, data: J.data }, null, 2), w.appendChild(ee);
                }
              if (Y && Y.size > 0)
                for (const z of Y) {
                  const J = O.edges?.find((U) => U.id === z);
                  if (!J) continue;
                  const ee = document.createElement("pre");
                  ee.className = "flow-devtools-json", ee.textContent = JSON.stringify({ id: J.id, source: J.source, target: J.target, type: J.type }, null, 2), w.appendChild(ee);
                }
            }
          }
          if (N) {
            const q = O._animator?._groups?.size ?? 0;
            N.textContent = String(q);
          }
          M && (M.textContent = String(O._activeParticles?.size ?? 0)), I && (I.textContent = O._followHandle ? "Active" : "Idle"), H && (H.textContent = String(O._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (G(), f.removeEventListener("click", b), Z)
          for (const O of ur)
            d.removeEventListener(O, Z);
        u(), e.textContent = "", x = null, k = null, v = null, C = null, T = null, L = null, D = null, A = null, _ = null, w = null, N = null, M = null, I = null, H = null;
      });
    }
  );
}
const zm = {
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
function Vm(t) {
  return zm[t] ?? null;
}
function Bm(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Vm(n);
      if (!l)
        return;
      const c = Ue(e);
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
function qm(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Wo = /* @__PURE__ */ new WeakMap();
function Ym(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = qm(n, i);
      if (!l) return;
      const c = Ue(e);
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), Wo.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (l.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Wo.set(c, u);
        else if (l.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const h = Wo.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), a(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Xm(t) {
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
function Wm(t) {
  t.directive(
    "flow-follow",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("toggle"), l = Ue(e);
      if (!l) return;
      const c = t.$data(l);
      if (!c?.follow) return;
      let d = null;
      const u = (h) => {
        e.classList.toggle("flow-following", h), e.setAttribute("aria-pressed", String(h));
      }, f = () => {
        if (!n) return;
        const h = i(n), p = Xm(h);
        if (!p) return;
        if (a && d) {
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
function jm(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Oi = /* @__PURE__ */ new Map();
function Um(t, e) {
  Oi.set(t, e);
}
function Gm(t) {
  return Oi.get(t) ?? null;
}
function Zm(t) {
  return Oi.has(t);
}
function jo(t) {
  return `alpineflow-snapshot-${t}`;
}
function Km(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = jm(n, i);
      if (!l) return;
      const c = Ue(e);
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = () => {
        if (!o) return;
        const f = r(o);
        if (f)
          if (l.action === "save") {
            const h = d.toObject();
            l.persist ? localStorage.setItem(jo(f), JSON.stringify(h)) : Um(f, h);
          } else {
            let h = null;
            if (l.persist) {
              const p = localStorage.getItem(jo(f));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = Gm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), l.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        l.persist ? h = localStorage.getItem(jo(f)) !== null : (d.nodes.length, h = Zm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Jm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function Qm(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = Ue(e);
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Jm(s._loadingText));
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
function ey(t) {
  t.directive(
    "flow-edge-toolbar",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = e.closest("[data-flow-edge-id]");
      if (!a) return;
      const l = a.dataset.flowEdgeId, c = Ue(e);
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      const u = c.querySelector(".flow-viewport");
      if (!u) return;
      try {
        const m = i("edge");
        m && t.addScopeToNode(e, { edge: m });
      } catch {
      }
      u.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const f = Qt(e), h = (m) => {
        m.stopPropagation();
      };
      e.addEventListener("click", h);
      const p = o.includes("below"), g = 20;
      r(() => {
        if (!d.edges.some((R) => R.id === l)) {
          f(), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const m = d.viewport?.zoom || 1, y = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let b = 0.5;
        if (n) {
          const R = i(n);
          typeof R == "number" && (b = R);
        }
        const S = a.querySelectorAll("path"), x = S.length > 1 ? S[1] : S[0];
        if (!x) return;
        const k = x.getTotalLength?.();
        if (!k) return;
        const v = x.getPointAtLength(k * Math.max(0, Math.min(1, b))), C = y / m, T = p ? C : -C;
        e.style.left = `${v.x}px`, e.style.top = `${v.y + T}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / m}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        f(), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function ty(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function ny(t) {
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
function bw(t, e, n) {
  const o = n?.defaultDimensions?.width ?? we, i = n?.defaultDimensions?.height ?? ve, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", l = t.filter((y) => !y.hidden).map((y) => ({
    ...y,
    dimensions: {
      width: y.dimensions?.width ?? o,
      height: y.dimensions?.height ?? i
    }
  })), c = /* @__PURE__ */ new Map();
  for (const y of l)
    c.set(y.id, y);
  const d = l.map((y) => ({
    id: y.id,
    x: y.position.x,
    y: y.position.y,
    width: y.dimensions.width,
    height: y.dimensions.height,
    ...y.class ? { class: y.class } : {},
    ...y.style ? {
      style: typeof y.style == "string" ? y.style : Object.entries(y.style).map(([b, S]) => `${b}:${S}`).join(";")
    } : {},
    data: y.data ?? {}
  })), u = e.filter((y) => !y.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const y of u) {
    const b = c.get(y.source), S = c.get(y.target);
    if (!b || !S)
      continue;
    let x, k;
    try {
      const L = yo(
        y,
        b,
        S,
        b.sourcePosition ?? "bottom",
        S.targetPosition ?? "top"
      );
      x = L.path, k = L.labelPosition;
    } catch {
      continue;
    }
    let v, C;
    if (y.markerStart) {
      const L = Bt(y.markerStart), D = qt(L, s);
      h.has(D) || h.set(D, uo(L, D)), v = `url(#${D})`;
    }
    if (y.markerEnd) {
      const L = Bt(y.markerEnd), D = qt(L, s);
      h.has(D) || h.set(D, uo(L, D)), C = `url(#${D})`;
    }
    let T, R;
    if (y.label)
      if (k)
        T = k.x, R = k.y;
      else {
        const L = b.position.x + b.dimensions.width / 2, D = b.position.y + b.dimensions.height / 2, A = S.position.x + S.dimensions.width / 2, _ = S.position.y + S.dimensions.height / 2;
        T = (L + A) / 2, R = (D + _) / 2;
      }
    f.push({
      id: y.id,
      source: y.source,
      target: y.target,
      pathD: x,
      ...v ? { markerStart: v } : {},
      ...C ? { markerEnd: C } : {},
      ...y.class ? { class: y.class } : {},
      ...y.label ? { label: y.label } : {},
      ...T !== void 0 ? { labelX: T } : {},
      ...R !== void 0 ? { labelY: R } : {}
    });
  }
  const p = Array.from(h.values()).join(`
`);
  let g, m;
  if (l.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, m = { x: 0, y: 0, zoom: 1 };
  else {
    const y = jt(l);
    g = {
      x: y.x - r,
      y: y.y - r,
      width: y.width + r * 2,
      height: y.height + r * 2
    }, m = {
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
    viewport: m
  };
}
const gr = /* @__PURE__ */ new WeakSet();
function xw(t) {
  gr.has(t) || (gr.add(t), tl(t), ny(t), Tp(t), Bp(t), uh(t), eh(t), th(t), nh(t), Ep(t), Wp(t), Zp(t), Kp(t), Qp(t), tm(t), hm(t), gm(t), ym(t), _m(t), xm(t), Em(t), Cm(t), Am(t), Nm(t), Om(t), Bm(t), Ym(t), Wm(t), Km(t), Qm(t), ey(t), Sm(t), Lm(t), Tm(t), ty(t));
}
function oy(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
const iy = [
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "fill",
  "fill-opacity",
  "fill-rule",
  "opacity",
  "marker-start",
  "marker-mid",
  "marker-end"
];
function sy(t) {
  const e = t.querySelectorAll(
    "svg path, svg line, svg polyline, svg polygon, svg circle, svg ellipse, svg rect, svg text"
  ), n = [];
  for (const o of e) {
    const i = getComputedStyle(o), r = [];
    for (const s of iy) {
      const a = i.getPropertyValue(s);
      a && (r.push([s, o.getAttribute(s)]), o.setAttribute(s, a));
    }
    r.length > 0 && n.push(() => {
      for (const [s, a] of r)
        a === null ? o.removeAttribute(s) : o.setAttribute(s, a);
    });
  }
  return () => {
    for (const o of n) o();
  };
}
const ry = 16384, ay = 4e7, ly = 8;
function cy(t, e, n) {
  if (typeof t != "number" || !Number.isFinite(t) || t <= 0) return 1;
  const o = ry / Math.max(e, n), i = Math.sqrt(ay / Math.max(1, e * n)), r = Math.max(1, Math.min(ly, o, i));
  return Math.min(t, r);
}
const dy = 0.92;
function uy(t) {
  return typeof t != "number" || !Number.isFinite(t) ? dy : Math.min(1, Math.max(0, t));
}
function fy(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function hy(t, e) {
  const n = t.indexOf(">");
  if (n === -1) return t;
  const o = `<rect width="100%" height="100%" fill="${fy(e)}"/>`;
  return t.slice(0, n + 1) + o + t.slice(n + 1);
}
function gy(t, e, n, o, i = 1, r = "png", s) {
  return new Promise((a, l) => {
    const c = new Image();
    c.onload = () => {
      const d = document.createElement("canvas");
      d.width = Math.round(e * i), d.height = Math.round(n * i);
      const u = d.getContext("2d");
      u.scale(i, i), u.fillStyle = o, u.fillRect(0, 0, e, n), u.drawImage(c, 0, 0, e, n), a(
        r === "jpeg" ? d.toDataURL("image/jpeg", uy(s)) : d.toDataURL("image/png")
      );
    }, c.onerror = () => {
      l(new Error("Failed to render SVG to image"));
    }, c.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function py(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => fw));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, m = t.style.overflow, y = [];
  let b = null;
  try {
    if (s === "all") {
      const A = t.querySelectorAll("[data-flow-culled]");
      for (const I of A)
        I.style.display = "", y.push(I);
      const _ = n.filter((I) => !I.hidden), w = jt(_), N = i.padding ?? 0.1, M = ro(
        w,
        l,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        N
      );
      e.style.transform = `translate(${M.x}px, ${M.y}px) scale(${M.zoom})`, e.style.width = `${l}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${l}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((A) => requestAnimationFrame(A)), b = sy(t);
    const S = i.includeOverlays, x = S === !0, k = typeof S == "object" ? S : {}, v = [
      ["canvas-overlay", x || (k.toolbar ?? !1)],
      ["flow-minimap", x || (k.minimap ?? !1)],
      ["flow-controls", x || (k.controls ?? !1)],
      ["flow-panel", x || (k.panels ?? !1)],
      ["flow-selection-box", !1]
    ], C = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: (A) => {
        if (A.classList) {
          for (const [_, w] of v)
            if (A.classList.contains(_) && !w) return !1;
        }
        return !0;
      }
    }), T = "data:image/svg+xml;charset=utf-8,", R = oy(decodeURIComponent(C.substring(T.length))), L = i.format ?? "png";
    let D;
    if (L === "svg")
      D = T + encodeURIComponent(hy(R, d));
    else {
      const A = cy(i.scale, l, c);
      D = await gy(
        R,
        l,
        c,
        d,
        A,
        L,
        i.quality
      );
    }
    if (i.filename) {
      const A = document.createElement("a");
      A.download = i.filename, A.href = D, A.click();
    }
    return D;
  } finally {
    b?.(), e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = m;
    for (const S of y)
      S.style.display = "none";
  }
}
const my = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: py
}, Symbol.toStringTag, { value: "Module" }));
function yy(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const wy = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function Et(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Rt = null;
function Xa(t = {}) {
  return Rt || (t.includeStyleProperties ? (Rt = t.includeStyleProperties, Rt) : (Rt = Et(window.getComputedStyle(document.documentElement)), Rt));
}
function vo(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function _y(t) {
  const e = vo(t, "border-left-width"), n = vo(t, "border-right-width");
  return t.clientWidth + e + n;
}
function vy(t) {
  const e = vo(t, "border-top-width"), n = vo(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function zi(t, e = {}) {
  const n = e.width || _y(t), o = e.height || vy(t);
  return { width: n, height: o };
}
function by() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const He = 16384;
function xy(t) {
  (t.width > He || t.height > He) && (t.width > He && t.height > He ? t.width > t.height ? (t.height *= He / t.width, t.width = He) : (t.width *= He / t.height, t.height = He) : t.width > He ? (t.height *= He / t.width, t.width = He) : (t.width *= He / t.height, t.height = He));
}
function Ey(t, e = {}) {
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
function bo(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function Cy(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Sy(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), Cy(i);
}
const Ie = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ie(n, e);
};
function ky(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function Ly(t, e) {
  return Xa(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function My(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? ky(n) : Ly(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function pr(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = wy();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(My(s, n, i, o)), e.appendChild(a);
}
function Py(t, e, n) {
  pr(t, e, ":before", n), pr(t, e, ":after", n);
}
const mr = "application/font-woff", yr = "image/jpeg", Ty = {
  woff: mr,
  woff2: mr,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: yr,
  jpeg: yr,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Ay(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Vi(t) {
  const e = Ay(t).toLowerCase();
  return Ty[e] || "";
}
function Ny(t) {
  return t.split(/,/)[1];
}
function yi(t) {
  return t.search(/^(data:)/) !== -1;
}
function $y(t, e) {
  return `data:${e};base64,${t}`;
}
async function Wa(t, e, n) {
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
const Uo = {};
function Iy(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Bi(t, e, n) {
  const o = Iy(t, e, n.includeQueryParams);
  if (Uo[o] != null)
    return Uo[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await Wa(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), Ny(a)));
    i = $y(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Uo[o] = i, i;
}
async function Dy(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : bo(e);
}
async function Ry(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return bo(a);
  }
  const n = t.poster, o = Vi(n), i = await Bi(n, o, e);
  return bo(i);
}
async function Hy(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await Ao(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Fy(t, e) {
  return Ie(t, HTMLCanvasElement) ? Dy(t) : Ie(t, HTMLVideoElement) ? Ry(t, e) : Ie(t, HTMLIFrameElement) ? Hy(t, e) : t.cloneNode(ja(t));
}
const Oy = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", ja = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function zy(t, e, n) {
  var o, i;
  if (ja(e))
    return e;
  let r = [];
  return Oy(t) && t.assignedNodes ? r = Et(t.assignedNodes()) : Ie(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = Et(t.contentDocument.body.childNodes) : r = Et(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ie(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => Ao(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function Vy(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : Xa(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ie(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function By(t, e) {
  Ie(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ie(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function qy(t, e) {
  if (Ie(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Yy(t, e, n) {
  return Ie(e, Element) && (Vy(t, e, n), Py(t, e, n), By(t, e), qy(t, e)), e;
}
async function Xy(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await Ao(c, e, !0));
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
async function Ao(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Fy(o, e)).then((o) => zy(t, o, e)).then((o) => Yy(t, o, e)).then((o) => Xy(o, e));
}
const Ua = /url\((['"]?)([^'"]+?)\1\)/g, Wy = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, jy = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Uy(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Gy(t) {
  const e = [];
  return t.replace(Ua, (n, o, i) => (e.push(i), n)), e.filter((n) => !yi(n));
}
async function Zy(t, e, n, o, i) {
  try {
    const r = n ? yy(e, n) : e, s = Vi(e);
    let a;
    return i || (a = await Bi(r, s, o)), t.replace(Uy(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function Ky(t, { preferredFontFormat: e }) {
  return e ? t.replace(jy, (n) => {
    for (; ; ) {
      const [o, , i] = Wy.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function Ga(t) {
  return t.search(Ua) !== -1;
}
async function Za(t, e, n) {
  if (!Ga(t))
    return t;
  const o = Ky(t, n);
  return Gy(o).reduce((r, s) => r.then((a) => Zy(a, s, e, n)), Promise.resolve(o));
}
async function Ht(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Za(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function Jy(t, e) {
  await Ht("background", t, e) || await Ht("background-image", t, e), await Ht("mask", t, e) || await Ht("-webkit-mask", t, e) || await Ht("mask-image", t, e) || await Ht("-webkit-mask-image", t, e);
}
async function Qy(t, e) {
  const n = Ie(t, HTMLImageElement);
  if (!(n && !yi(t.src)) && !(Ie(t, SVGImageElement) && !yi(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Bi(o, Vi(o), e);
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
async function ew(t, e) {
  const o = Et(t.childNodes).map((i) => Ka(i, e));
  await Promise.all(o).then(() => t);
}
async function Ka(t, e) {
  Ie(t, Element) && (await Jy(t, e), await Qy(t, e), await ew(t, e));
}
function tw(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const wr = {};
async function _r(t) {
  let e = wr[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, wr[t] = e, e;
}
async function vr(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Wa(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function br(t) {
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
async function nw(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        Et(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = _r(l).then((d) => vr(d, e)).then((d) => br(d).forEach((u) => {
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
        i.href != null && o.push(_r(i.href).then((a) => vr(a, e)).then((a) => br(a).forEach((l) => {
          s.insertRule(l, s.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        Et(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function ow(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Ga(e.style.getPropertyValue("src")));
}
async function iw(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = Et(t.ownerDocument.styleSheets), o = await nw(n, e);
  return ow(o);
}
function Ja(t) {
  return t.trim().replace(/["']/g, "");
}
function sw(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(Ja(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function Qa(t, e) {
  const n = await iw(t, e), o = sw(t);
  return (await Promise.all(n.filter((r) => o.has(Ja(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Za(r.cssText, s, e);
  }))).join(`
`);
}
async function rw(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Qa(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function el(t, e = {}) {
  const { width: n, height: o } = zi(t, e), i = await Ao(t, e, !0);
  return await rw(i, e), await Ka(i, e), tw(i, e), await Sy(i, n, o);
}
async function Nn(t, e = {}) {
  const { width: n, height: o } = zi(t, e), i = await el(t, e), r = await bo(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || by(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || xy(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function aw(t, e = {}) {
  const { width: n, height: o } = zi(t, e);
  return (await Nn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function lw(t, e = {}) {
  return (await Nn(t, e)).toDataURL();
}
async function cw(t, e = {}) {
  return (await Nn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function dw(t, e = {}) {
  const n = await Nn(t, e);
  return await Ey(n);
}
async function uw(t, e = {}) {
  return Qa(t, e);
}
const fw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: uw,
  toBlob: dw,
  toCanvas: Nn,
  toJpeg: cw,
  toPixelData: aw,
  toPng: lw,
  toSvg: el
}, Symbol.toStringTag, { value: "Module" }));
export {
  Zh as ComputeEngine,
  Ef as FlowHistory,
  ks as SHORTCUT_DEFAULTS,
  mw as along,
  Jf as areNodesConnected,
  La as buildNodeMap,
  Pa as clampToExtent,
  Ho as clampToParent,
  bw as computeRenderPlan,
  Ds as computeValidationErrors,
  Ma as computeZIndex,
  xw as default,
  ww as drift,
  Fh as expandParentToFitChild,
  ci as getAbsolutePosition,
  ah as getAutoPanDelta,
  fo as getBezierPath,
  Gf as getConnectedEdges,
  xt as getDescendantIds,
  js as getEdgePosition,
  Va as getFloatingEdgeParams,
  Zf as getIncomers,
  Ws as getNodeIntersection,
  jt as getNodesBounds,
  Uf as getNodesFullyInPolygon,
  yf as getNodesFullyInRect,
  jf as getNodesInPolygon,
  mf as getNodesInRect,
  ai as getOutgoers,
  hw as getSimpleBezierPath,
  vw as getSimpleFloatingPosition,
  Sn as getSmoothStepPath,
  rh as getStepPath,
  ga as getStraightPath,
  ro as getViewportForBounds,
  Ye as isConnectable,
  oh as isDeletable,
  ha as isDraggable,
  xs as isResizable,
  pn as isSelectable,
  Ke as matchesKey,
  bt as matchesModifier,
  gw as orbit,
  yw as pendulum,
  Ai as pointInPolygon,
  Wf as polygonIntersectsAABB,
  Nf as registerMarker,
  yn as resolveChildValidation,
  fh as resolveShortcuts,
  Nt as sortNodesTopological,
  _w as stagger,
  ct as toAbsoluteNode,
  go as toAbsoluteNodes,
  $a as validateChildAdd,
  po as validateChildRemove,
  pw as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
