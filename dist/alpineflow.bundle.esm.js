let Bo = null;
function qa(t) {
  Bo = t;
}
function ke() {
  if (!Bo)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Bo;
}
var Xa = { value: () => {
} };
function po() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new zn(n);
}
function zn(t) {
  this._ = t;
}
function Ya(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
zn.prototype = po.prototype = {
  constructor: zn,
  on: function(t, e) {
    var n = this._, o = Ya(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Wa(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Hi(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Hi(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new zn(t);
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
function Wa(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Hi(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Xa, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var qo = "http://www.w3.org/1999/xhtml";
const Fi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: qo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function mo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Fi.hasOwnProperty(e) ? { space: Fi[e], local: t } : t;
}
function ja(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === qo && e.documentElement.namespaceURI === qo ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Ua(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function ur(t) {
  var e = mo(t);
  return (e.local ? Ua : ja)(e);
}
function Ga() {
}
function fi(t) {
  return t == null ? Ga : function() {
    return this.querySelector(t);
  };
}
function Za(t) {
  typeof t != "function" && (t = fi(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Oe(o, this._parents);
}
function Ka(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Ja() {
  return [];
}
function fr(t) {
  return t == null ? Ja : function() {
    return this.querySelectorAll(t);
  };
}
function Qa(t) {
  return function() {
    return Ka(t.apply(this, arguments));
  };
}
function el(t) {
  typeof t == "function" ? t = Qa(t) : t = fr(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new Oe(o, i);
}
function hr(t) {
  return function() {
    return this.matches(t);
  };
}
function gr(t) {
  return function(e) {
    return e.matches(t);
  };
}
var tl = Array.prototype.find;
function nl(t) {
  return function() {
    return tl.call(this.children, t);
  };
}
function ol() {
  return this.firstElementChild;
}
function il(t) {
  return this.select(t == null ? ol : nl(typeof t == "function" ? t : gr(t)));
}
var sl = Array.prototype.filter;
function rl() {
  return Array.from(this.children);
}
function al(t) {
  return function() {
    return sl.call(this.children, t);
  };
}
function ll(t) {
  return this.selectAll(t == null ? rl : al(typeof t == "function" ? t : gr(t)));
}
function cl(t) {
  typeof t != "function" && (t = hr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Oe(o, this._parents);
}
function pr(t) {
  return new Array(t.length);
}
function dl() {
  return new Oe(this._enter || this._groups.map(pr), this._parents);
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
function ul(t) {
  return function() {
    return t;
  };
}
function fl(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Yn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function hl(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (f[a] = h = s.call(l, l.__data__, a, e) + "", c.has(h) ? i[a] = l : c.set(h, l));
  for (a = 0; a < u; ++a)
    h = s.call(t, r[a], a, r) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = r[a], c.delete(h)) : n[a] = new Yn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(f[a]) === l && (i[a] = l);
}
function gl(t) {
  return t.__data__;
}
function pl(t, e) {
  if (!arguments.length) return Array.from(this, gl);
  var n = e ? hl : fl, o = this._parents, i = this._groups;
  typeof t != "function" && (t = ul(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = ml(t.call(d, d && d.__data__, c, o)), p = h.length, g = a[c] = new Array(p), m = s[c] = new Array(p), y = l[c] = new Array(f);
    n(d, u, g, m, y, h, e);
    for (var _ = 0, k = 0, x, C; _ < p; ++_)
      if (x = g[_]) {
        for (_ >= k && (k = _ + 1); !(C = m[k]) && ++k < p; ) ;
        x._next = C || null;
      }
  }
  return s = new Oe(s, o), s._enter = a, s._exit = l, s;
}
function ml(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function yl() {
  return new Oe(this._exit || this._groups.map(pr), this._parents);
}
function wl(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function vl(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], u = c.length, f = a[l] = new Array(u), h, p = 0; p < u; ++p)
      (h = c[p] || d[p]) && (f[p] = h);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Oe(a, this._parents);
}
function _l() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function bl(t) {
  t || (t = xl);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(e);
  }
  return new Oe(i, this._parents).order();
}
function xl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function El() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Cl() {
  return Array.from(this);
}
function Sl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function kl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function Ll() {
  return !this.node();
}
function Pl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function Ml(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function Tl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Nl(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Al(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function $l(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Il(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function Dl(t, e) {
  var n = mo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? Tl : Ml : typeof e == "function" ? n.local ? Il : $l : n.local ? Al : Nl)(n, e));
}
function mr(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Rl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Hl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Fl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Ol(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Rl : typeof e == "function" ? Fl : Hl)(t, e, n ?? "")) : qt(this.node(), t);
}
function qt(t, e) {
  return t.style.getPropertyValue(e) || mr(t).getComputedStyle(t, null).getPropertyValue(e);
}
function zl(t) {
  return function() {
    delete this[t];
  };
}
function Vl(t, e) {
  return function() {
    this[t] = e;
  };
}
function Bl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function ql(t, e) {
  return arguments.length > 1 ? this.each((e == null ? zl : typeof e == "function" ? Bl : Vl)(t, e)) : this.node()[t];
}
function yr(t) {
  return t.trim().split(/^|\s+/);
}
function hi(t) {
  return t.classList || new wr(t);
}
function wr(t) {
  this._node = t, this._names = yr(t.getAttribute("class") || "");
}
wr.prototype = {
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
function vr(t, e) {
  for (var n = hi(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function _r(t, e) {
  for (var n = hi(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Xl(t) {
  return function() {
    vr(this, t);
  };
}
function Yl(t) {
  return function() {
    _r(this, t);
  };
}
function Wl(t, e) {
  return function() {
    (e.apply(this, arguments) ? vr : _r)(this, t);
  };
}
function jl(t, e) {
  var n = yr(t + "");
  if (arguments.length < 2) {
    for (var o = hi(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Wl : e ? Xl : Yl)(n, e));
}
function Ul() {
  this.textContent = "";
}
function Gl(t) {
  return function() {
    this.textContent = t;
  };
}
function Zl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Kl(t) {
  return arguments.length ? this.each(t == null ? Ul : (typeof t == "function" ? Zl : Gl)(t)) : this.node().textContent;
}
function Jl() {
  this.innerHTML = "";
}
function Ql(t) {
  return function() {
    this.innerHTML = t;
  };
}
function ec(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function tc(t) {
  return arguments.length ? this.each(t == null ? Jl : (typeof t == "function" ? ec : Ql)(t)) : this.node().innerHTML;
}
function nc() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function oc() {
  return this.each(nc);
}
function ic() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function sc() {
  return this.each(ic);
}
function rc(t) {
  var e = typeof t == "function" ? t : ur(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function ac() {
  return null;
}
function lc(t, e) {
  var n = typeof t == "function" ? t : ur(t), o = e == null ? ac : typeof e == "function" ? e : fi(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function cc() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function dc() {
  return this.each(cc);
}
function uc() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function fc() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function hc(t) {
  return this.select(t ? fc : uc);
}
function gc(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function pc(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function mc(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function yc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function wc(t, e, n) {
  return function() {
    var o = this.__on, i, r = pc(e);
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
function vc(t, e, n) {
  var o = mc(t + ""), i, r = o.length, s;
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
  for (a = e ? wc : yc, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function br(t, e, n) {
  var o = mr(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function _c(t, e) {
  return function() {
    return br(this, t, e);
  };
}
function bc(t, e) {
  return function() {
    return br(this, t, e.apply(this, arguments));
  };
}
function xc(t, e) {
  return this.each((typeof e == "function" ? bc : _c)(t, e));
}
function* Ec() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var xr = [null];
function Oe(t, e) {
  this._groups = t, this._parents = e;
}
function Cn() {
  return new Oe([[document.documentElement]], xr);
}
function Cc() {
  return this;
}
Oe.prototype = Cn.prototype = {
  constructor: Oe,
  select: Za,
  selectAll: el,
  selectChild: il,
  selectChildren: ll,
  filter: cl,
  data: pl,
  enter: dl,
  exit: yl,
  join: wl,
  merge: vl,
  selection: Cc,
  order: _l,
  sort: bl,
  call: El,
  nodes: Cl,
  node: Sl,
  size: kl,
  empty: Ll,
  each: Pl,
  attr: Dl,
  style: Ol,
  property: ql,
  classed: jl,
  text: Kl,
  html: tc,
  raise: oc,
  lower: sc,
  append: rc,
  insert: lc,
  remove: dc,
  clone: hc,
  datum: gc,
  on: vc,
  dispatch: xc,
  [Symbol.iterator]: Ec
};
function Xe(t) {
  return typeof t == "string" ? new Oe([[document.querySelector(t)]], [document.documentElement]) : new Oe([[t]], xr);
}
function Sc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Qe(t, e) {
  if (t = Sc(t), e === void 0 && (e = t.currentTarget), e) {
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
const kc = { passive: !1 }, gn = { capture: !0, passive: !1 };
function So(t) {
  t.stopImmediatePropagation();
}
function Ot(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Er(t) {
  var e = t.document.documentElement, n = Xe(t).on("dragstart.drag", Ot, gn);
  "onselectstart" in e ? n.on("selectstart.drag", Ot, gn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function Cr(t, e) {
  var n = t.document.documentElement, o = Xe(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Ot, gn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Mn = (t) => () => t;
function Xo(t, {
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
Xo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function Lc(t) {
  return !t.ctrlKey && !t.button;
}
function Pc() {
  return this.parentNode;
}
function Mc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function Tc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Nc() {
  var t = Lc, e = Pc, n = Mc, o = Tc, i = {}, r = po("start", "drag", "end"), s = 0, a, l, c, d, u = 0;
  function f(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", y, kc).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, C) {
    if (!(d || !t.call(this, x, C))) {
      var E = k(this, e.call(this, x, C), x, C, "mouse");
      E && (Xe(x.view).on("mousemove.drag", p, gn).on("mouseup.drag", g, gn), Er(x.view), So(x), c = !1, a = x.clientX, l = x.clientY, E("start", x));
    }
  }
  function p(x) {
    if (Ot(x), !c) {
      var C = x.clientX - a, E = x.clientY - l;
      c = C * C + E * E > u;
    }
    i.mouse("drag", x);
  }
  function g(x) {
    Xe(x.view).on("mousemove.drag mouseup.drag", null), Cr(x.view, c), Ot(x), i.mouse("end", x);
  }
  function m(x, C) {
    if (t.call(this, x, C)) {
      var E = x.changedTouches, b = e.call(this, x, C), T = E.length, D, L;
      for (D = 0; D < T; ++D)
        (L = k(this, b, x, C, E[D].identifier, E[D])) && (So(x), L("start", x, E[D]));
    }
  }
  function y(x) {
    var C = x.changedTouches, E = C.length, b, T;
    for (b = 0; b < E; ++b)
      (T = i[C[b].identifier]) && (Ot(x), T("drag", x, C[b]));
  }
  function _(x) {
    var C = x.changedTouches, E = C.length, b, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), b = 0; b < E; ++b)
      (T = i[C[b].identifier]) && (So(x), T("end", x, C[b]));
  }
  function k(x, C, E, b, T, D) {
    var L = r.copy(), A = Qe(D || E, C), P, v, w;
    if ((w = n.call(x, new Xo("beforestart", {
      sourceEvent: E,
      target: f,
      identifier: T,
      active: s,
      x: A[0],
      y: A[1],
      dx: 0,
      dy: 0,
      dispatch: L
    }), b)) != null)
      return P = w.x - A[0] || 0, v = w.y - A[1] || 0, function I(M, R, z) {
        var V = A, $;
        switch (M) {
          case "start":
            i[T] = I, $ = s++;
            break;
          case "end":
            delete i[T], --s;
          // falls through
          case "drag":
            A = Qe(z || R, C), $ = s;
            break;
        }
        L.call(
          M,
          x,
          new Xo(M, {
            sourceEvent: R,
            subject: w,
            target: f,
            identifier: T,
            active: $,
            x: A[0] + P,
            y: A[1] + v,
            dx: A[0] - V[0],
            dy: A[1] - V[1],
            dispatch: L
          }),
          b
        );
      };
  }
  return f.filter = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Mn(!!x), f) : t;
  }, f.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Mn(x), f) : e;
  }, f.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Mn(x), f) : n;
  }, f.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Mn(!!x), f) : o;
  }, f.on = function() {
    var x = r.on.apply(r, arguments);
    return x === r ? f : x;
  }, f.clickDistance = function(x) {
    return arguments.length ? (u = (x = +x) * x, f) : Math.sqrt(u);
  }, f;
}
function gi(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Sr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function Sn() {
}
var pn = 0.7, Wn = 1 / pn, zt = "\\s*([+-]?\\d+)\\s*", mn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Ac = /^#([0-9a-f]{3,8})$/, $c = new RegExp(`^rgb\\(${zt},${zt},${zt}\\)$`), Ic = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`), Dc = new RegExp(`^rgba\\(${zt},${zt},${zt},${mn}\\)$`), Rc = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${mn}\\)$`), Hc = new RegExp(`^hsl\\(${mn},${Ze},${Ze}\\)$`), Fc = new RegExp(`^hsla\\(${mn},${Ze},${Ze},${mn}\\)$`), Oi = {
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
gi(Sn, yn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: zi,
  // Deprecated! Use color.formatHex.
  formatHex: zi,
  formatHex8: Oc,
  formatHsl: zc,
  formatRgb: Vi,
  toString: Vi
});
function zi() {
  return this.rgb().formatHex();
}
function Oc() {
  return this.rgb().formatHex8();
}
function zc() {
  return kr(this).formatHsl();
}
function Vi() {
  return this.rgb().formatRgb();
}
function yn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Ac.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Bi(e) : n === 3 ? new Ae(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Tn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Tn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = $c.exec(t)) ? new Ae(e[1], e[2], e[3], 1) : (e = Ic.exec(t)) ? new Ae(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Dc.exec(t)) ? Tn(e[1], e[2], e[3], e[4]) : (e = Rc.exec(t)) ? Tn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Hc.exec(t)) ? Yi(e[1], e[2] / 100, e[3] / 100, 1) : (e = Fc.exec(t)) ? Yi(e[1], e[2] / 100, e[3] / 100, e[4]) : Oi.hasOwnProperty(t) ? Bi(Oi[t]) : t === "transparent" ? new Ae(NaN, NaN, NaN, 0) : null;
}
function Bi(t) {
  return new Ae(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Tn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ae(t, e, n, o);
}
function Vc(t) {
  return t instanceof Sn || (t = yn(t)), t ? (t = t.rgb(), new Ae(t.r, t.g, t.b, t.opacity)) : new Ae();
}
function Yo(t, e, n, o) {
  return arguments.length === 1 ? Vc(t) : new Ae(t, e, n, o ?? 1);
}
function Ae(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
gi(Ae, Yo, Sr(Sn, {
  brighter(t) {
    return t = t == null ? Wn : Math.pow(Wn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? pn : Math.pow(pn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ae(St(this.r), St(this.g), St(this.b), jn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: qi,
  // Deprecated! Use color.formatHex.
  formatHex: qi,
  formatHex8: Bc,
  formatRgb: Xi,
  toString: Xi
}));
function qi() {
  return `#${Ct(this.r)}${Ct(this.g)}${Ct(this.b)}`;
}
function Bc() {
  return `#${Ct(this.r)}${Ct(this.g)}${Ct(this.b)}${Ct((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Xi() {
  const t = jn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${St(this.r)}, ${St(this.g)}, ${St(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function jn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function St(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Ct(t) {
  return t = St(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Yi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Ye(t, e, n, o);
}
function kr(t) {
  if (t instanceof Ye) return new Ye(t.h, t.s, t.l, t.opacity);
  if (t instanceof Sn || (t = yn(t)), !t) return new Ye();
  if (t instanceof Ye) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Ye(s, a, l, t.opacity);
}
function qc(t, e, n, o) {
  return arguments.length === 1 ? kr(t) : new Ye(t, e, n, o ?? 1);
}
function Ye(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
gi(Ye, qc, Sr(Sn, {
  brighter(t) {
    return t = t == null ? Wn : Math.pow(Wn, t), new Ye(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? pn : Math.pow(pn, t), new Ye(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ae(
      ko(t >= 240 ? t - 240 : t + 120, i, o),
      ko(t, i, o),
      ko(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Ye(Wi(this.h), Nn(this.s), Nn(this.l), jn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = jn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Wi(this.h)}, ${Nn(this.s) * 100}%, ${Nn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Wi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Nn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function ko(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const Lr = (t) => () => t;
function Xc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Yc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Wc(t) {
  return (t = +t) == 1 ? Pr : function(e, n) {
    return n - e ? Yc(e, n, t) : Lr(isNaN(e) ? n : e);
  };
}
function Pr(t, e) {
  var n = e - t;
  return n ? Xc(t, n) : Lr(isNaN(t) ? e : t);
}
const Wo = (function t(e) {
  var n = Wc(e);
  function o(i, r) {
    var s = n((i = Yo(i)).r, (r = Yo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = Pr(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = a(d), i.b = l(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function dt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var jo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Lo = new RegExp(jo.source, "g");
function jc(t) {
  return function() {
    return t;
  };
}
function Uc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Gc(t, e) {
  var n = jo.lastIndex = Lo.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = jo.exec(t)) && (i = Lo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: dt(o, i) })), n = Lo.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Uc(l[0].x) : jc(e) : (e = l.length, function(c) {
    for (var d = 0, u; d < e; ++d) a[(u = l[d]).i] = u.x(c);
    return a.join("");
  });
}
var ji = 180 / Math.PI, Uo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Mr(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * ji,
    skewX: Math.atan(l) * ji,
    scaleX: s,
    scaleY: a
  };
}
var An;
function Zc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Uo : Mr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Kc(t) {
  return t == null || (An || (An = document.createElementNS("http://www.w3.org/2000/svg", "g")), An.setAttribute("transform", t), !(t = An.transform.baseVal.consolidate())) ? Uo : (t = t.matrix, Mr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Tr(t, e, n, o) {
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
  function a(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: dt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function l(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push(i(h) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: dt(c, u) }, { i: g - 2, x: dt(d, f) });
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
var Jc = Tr(Zc, "px, ", "px)", "deg)"), Qc = Tr(Kc, ", ", ")", ")"), ed = 1e-12;
function Ui(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function td(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function nd(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const od = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - a, p = u - l, g = h * h + p * p, m, y;
    if (g < ed)
      y = Math.log(f / c) / e, m = function(b) {
        return [
          a + b * h,
          l + b * p,
          c * Math.exp(e * b * y)
        ];
      };
    else {
      var _ = Math.sqrt(g), k = (f * f - c * c + o * g) / (2 * c * n * _), x = (f * f - c * c - o * g) / (2 * f * n * _), C = Math.log(Math.sqrt(k * k + 1) - k), E = Math.log(Math.sqrt(x * x + 1) - x);
      y = (E - C) / e, m = function(b) {
        var T = b * y, D = Ui(C), L = c / (n * _) * (D * nd(e * T + C) - td(C));
        return [
          a + L * h,
          l + L * p,
          c * D / Ui(e * T + C)
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
var Xt = 0, ln = 0, tn = 0, Nr = 1e3, Un, cn, Gn = 0, Lt = 0, yo = 0, wn = typeof performance == "object" && performance.now ? performance : Date, Ar = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function pi() {
  return Lt || (Ar(id), Lt = wn.now() + yo);
}
function id() {
  Lt = 0;
}
function Zn() {
  this._call = this._time = this._next = null;
}
Zn.prototype = $r.prototype = {
  constructor: Zn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? pi() : +n) + (e == null ? 0 : +e), !this._next && cn !== this && (cn ? cn._next = this : Un = this, cn = this), this._call = t, this._time = n, Go();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Go());
  }
};
function $r(t, e, n) {
  var o = new Zn();
  return o.restart(t, e, n), o;
}
function sd() {
  pi(), ++Xt;
  for (var t = Un, e; t; )
    (e = Lt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Xt;
}
function Gi() {
  Lt = (Gn = wn.now()) + yo, Xt = ln = 0;
  try {
    sd();
  } finally {
    Xt = 0, ad(), Lt = 0;
  }
}
function rd() {
  var t = wn.now(), e = t - Gn;
  e > Nr && (yo -= e, Gn = t);
}
function ad() {
  for (var t, e = Un, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Un = n);
  cn = t, Go(o);
}
function Go(t) {
  if (!Xt) {
    ln && (ln = clearTimeout(ln));
    var e = t - Lt;
    e > 24 ? (t < 1 / 0 && (ln = setTimeout(Gi, t - wn.now() - yo)), tn && (tn = clearInterval(tn))) : (tn || (Gn = wn.now(), tn = setInterval(rd, Nr)), Xt = 1, Ar(Gi));
  }
}
function Zi(t, e, n) {
  var o = new Zn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var ld = po("start", "end", "cancel", "interrupt"), cd = [], Ir = 0, Ki = 1, Zo = 2, Vn = 3, Ji = 4, Ko = 5, Bn = 6;
function wo(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  dd(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: ld,
    tween: cd,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Ir
  });
}
function mi(t, e) {
  var n = je(t, e);
  if (n.state > Ir) throw new Error("too late; already scheduled");
  return n;
}
function Ke(t, e) {
  var n = je(t, e);
  if (n.state > Vn) throw new Error("too late; already running");
  return n;
}
function je(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function dd(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = $r(r, 0, n.time);
  function r(c) {
    n.state = Ki, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Ki) return l();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === Vn) return Zi(s);
        h.state === Ji ? (h.state = Bn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Bn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (Zi(function() {
      n.state === Vn && (n.state = Ji, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Zo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Zo) {
      for (n.state = Vn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Ko, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Ko && (n.on.call("end", t, t.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Bn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function qn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Zo && o.state < Ko, o.state = Bn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function ud(t) {
  return this.each(function() {
    qn(this, t);
  });
}
function fd(t, e) {
  var n, o;
  return function() {
    var i = Ke(this, t), r = i.tween;
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
function hd(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Ke(this, t), s = r.tween;
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
function gd(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = je(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? fd : hd)(n, t, e));
}
function yi(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ke(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return je(i, o).value[e];
  };
}
function Dr(t, e) {
  var n;
  return (typeof e == "number" ? dt : e instanceof yn ? Wo : (n = yn(e)) ? (e = n, Wo) : Gc)(t, e);
}
function pd(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function md(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function yd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function wd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function vd(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function _d(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function bd(t, e) {
  var n = mo(t), o = n === "transform" ? Qc : Dr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? _d : vd)(n, o, yi(this, "attr." + t, e)) : e == null ? (n.local ? md : pd)(n) : (n.local ? wd : yd)(n, o, e));
}
function xd(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function Ed(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function Cd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Ed(t, r)), n;
  }
  return i._value = e, i;
}
function Sd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && xd(t, r)), n;
  }
  return i._value = e, i;
}
function kd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = mo(t);
  return this.tween(n, (o.local ? Cd : Sd)(o, e));
}
function Ld(t, e) {
  return function() {
    mi(this, t).delay = +e.apply(this, arguments);
  };
}
function Pd(t, e) {
  return e = +e, function() {
    mi(this, t).delay = e;
  };
}
function Md(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Ld : Pd)(e, t)) : je(this.node(), e).delay;
}
function Td(t, e) {
  return function() {
    Ke(this, t).duration = +e.apply(this, arguments);
  };
}
function Nd(t, e) {
  return e = +e, function() {
    Ke(this, t).duration = e;
  };
}
function Ad(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Td : Nd)(e, t)) : je(this.node(), e).duration;
}
function $d(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ke(this, t).ease = e;
  };
}
function Id(t) {
  var e = this._id;
  return arguments.length ? this.each($d(e, t)) : je(this.node(), e).ease;
}
function Dd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ke(this, t).ease = n;
  };
}
function Rd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(Dd(this._id, t));
}
function Hd(t) {
  typeof t != "function" && (t = hr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new rt(o, this._parents, this._name, this._id);
}
function Fd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, u = s[a] = new Array(d), f, h = 0; h < d; ++h)
      (f = l[h] || c[h]) && (u[h] = f);
  for (; a < o; ++a)
    s[a] = e[a];
  return new rt(s, this._parents, this._name, this._id);
}
function Od(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function zd(t, e, n) {
  var o, i, r = Od(e) ? mi : Ke;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Vd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(t) : this.each(zd(n, t, e));
}
function Bd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function qd() {
  return this.on("end.remove", Bd(this._id));
}
function Xd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = fi(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, u, f = 0; f < l; ++f)
      (d = a[f]) && (u = t.call(d, d.__data__, f, a)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, wo(c[f], e, n, f, c, je(d, n)));
  return new rt(r, this._parents, e, n);
}
function Yd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = fr(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, u = 0; u < c; ++u)
      if (d = l[u]) {
        for (var f = t.call(d, d.__data__, u, l), h, p = je(d, n), g = 0, m = f.length; g < m; ++g)
          (h = f[g]) && wo(h, e, n, g, f, p);
        r.push(f), s.push(d);
      }
  return new rt(r, s, e, n);
}
var Wd = Cn.prototype.constructor;
function jd() {
  return new Wd(this._groups, this._parents);
}
function Ud(t, e) {
  var n, o, i;
  return function() {
    var r = qt(this, t), s = (this.style.removeProperty(t), qt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function Rr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Gd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = qt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Zd(t, e, n) {
  var o, i, r;
  return function() {
    var s = qt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), qt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function Kd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Ke(this, t), c = l.on, d = l.value[r] == null ? a || (a = Rr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function Jd(t, e, n) {
  var o = (t += "") == "transform" ? Jc : Dr;
  return e == null ? this.styleTween(t, Ud(t, o)).on("end.style." + t, Rr(t)) : typeof e == "function" ? this.styleTween(t, Zd(t, o, yi(this, "style." + t, e))).each(Kd(this._id, t)) : this.styleTween(t, Gd(t, o, e), n).on("end.style." + t, null);
}
function Qd(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function eu(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Qd(t, s, n)), o;
  }
  return r._value = e, r;
}
function tu(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, eu(t, e, n ?? ""));
}
function nu(t) {
  return function() {
    this.textContent = t;
  };
}
function ou(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function iu(t) {
  return this.tween("text", typeof t == "function" ? ou(yi(this, "text", t)) : nu(t == null ? "" : t + ""));
}
function su(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function ru(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && su(i)), e;
  }
  return o._value = t, o;
}
function au(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, ru(t));
}
function lu() {
  for (var t = this._name, e = this._id, n = Hr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, e);
        wo(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new rt(o, this._parents, t, n);
}
function cu() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Ke(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(l)), c.on = e;
    }), i === 0 && r();
  });
}
var du = 0;
function rt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function Hr() {
  return ++du;
}
var Je = Cn.prototype;
rt.prototype = {
  constructor: rt,
  select: Xd,
  selectAll: Yd,
  selectChild: Je.selectChild,
  selectChildren: Je.selectChildren,
  filter: Hd,
  merge: Fd,
  selection: jd,
  transition: lu,
  call: Je.call,
  nodes: Je.nodes,
  node: Je.node,
  size: Je.size,
  empty: Je.empty,
  each: Je.each,
  on: Vd,
  attr: bd,
  attrTween: kd,
  style: Jd,
  styleTween: tu,
  text: iu,
  textTween: au,
  remove: qd,
  tween: gd,
  delay: Md,
  duration: Ad,
  ease: Id,
  easeVarying: Rd,
  end: cu,
  [Symbol.iterator]: Je[Symbol.iterator]
};
const uu = (t) => +t;
function fu(t) {
  return t * t;
}
function hu(t) {
  return t * (2 - t);
}
function gu(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function pu(t) {
  return t * t * t;
}
function mu(t) {
  return --t * t * t + 1;
}
function Fr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Or = Math.PI, zr = Or / 2;
function yu(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * zr);
}
function wu(t) {
  return Math.sin(t * zr);
}
function vu(t) {
  return (1 - Math.cos(Or * t)) / 2;
}
function _t(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function _u(t) {
  return _t(1 - +t);
}
function bu(t) {
  return 1 - _t(t);
}
function xu(t) {
  return ((t *= 2) <= 1 ? _t(1 - t) : 2 - _t(t - 1)) / 2;
}
function Eu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function Cu(t) {
  return Math.sqrt(1 - --t * t);
}
function Su(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Jo = 4 / 11, ku = 6 / 11, Lu = 8 / 11, Pu = 3 / 4, Mu = 9 / 11, Tu = 10 / 11, Nu = 15 / 16, Au = 21 / 22, $u = 63 / 64, $n = 1 / Jo / Jo;
function Iu(t) {
  return 1 - Kn(1 - t);
}
function Kn(t) {
  return (t = +t) < Jo ? $n * t * t : t < Lu ? $n * (t -= ku) * t + Pu : t < Tu ? $n * (t -= Mu) * t + Nu : $n * (t -= Au) * t + $u;
}
function Du(t) {
  return ((t *= 2) <= 1 ? 1 - Kn(1 - t) : Kn(t - 1) + 1) / 2;
}
var wi = 1.70158, Ru = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(wi), Hu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(wi), Fu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(wi), Yt = 2 * Math.PI, vi = 1, _i = 0.3, Ou = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Yt);
  function i(r) {
    return e * _t(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Yt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(vi, _i), zu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Yt);
  function i(r) {
    return 1 - e * _t(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Yt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(vi, _i), Vu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Yt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * _t(-r) * Math.sin((o - r) / n) : 2 - e * _t(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Yt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(vi, _i), Bu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Fr
};
function qu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Xu(t) {
  var e, n;
  t instanceof rt ? (e = t._id, t = t._name) : (e = Hr(), (n = Bu).time = pi(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && wo(l, t, e, c, s, n || qu(l, e));
  return new rt(o, this._parents, t, e);
}
Cn.prototype.interrupt = ud;
Cn.prototype.transition = Xu;
const In = (t) => () => t;
function Yu(t, {
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
function et(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
et.prototype = {
  constructor: et,
  scale: function(t) {
    return t === 1 ? this : new et(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new et(this.k, this.x + this.k * t, this.y + this.k * e);
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
var Jn = new et(1, 0, 0);
et.prototype;
function Po(t) {
  t.stopImmediatePropagation();
}
function nn(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Wu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function ju() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Qi() {
  return this.__zoom || Jn;
}
function Uu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Gu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Zu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Ku() {
  var t = Wu, e = ju, n = Zu, o = Uu, i = Gu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = od, c = po("start", "zoom", "end"), d, u, f, h = 500, p = 150, g = 0, m = 10;
  function y(w) {
    w.property("__zoom", Qi).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", D).on("dblclick.zoom", L).filter(i).on("touchstart.zoom", A).on("touchmove.zoom", P).on("touchend.zoom touchcancel.zoom", v).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(w, I, M, R) {
    var z = w.selection ? w.selection() : w;
    z.property("__zoom", Qi), w !== z ? C(w, I, M, R) : z.interrupt().each(function() {
      E(this, arguments).event(R).start().zoom(null, typeof I == "function" ? I.apply(this, arguments) : I).end();
    });
  }, y.scaleBy = function(w, I, M, R) {
    y.scaleTo(w, function() {
      var z = this.__zoom.k, V = typeof I == "function" ? I.apply(this, arguments) : I;
      return z * V;
    }, M, R);
  }, y.scaleTo = function(w, I, M, R) {
    y.transform(w, function() {
      var z = e.apply(this, arguments), V = this.__zoom, $ = M == null ? x(z) : typeof M == "function" ? M.apply(this, arguments) : M, S = V.invert($), N = typeof I == "function" ? I.apply(this, arguments) : I;
      return n(k(_(V, N), $, S), z, s);
    }, M, R);
  }, y.translateBy = function(w, I, M, R) {
    y.transform(w, function() {
      return n(this.__zoom.translate(
        typeof I == "function" ? I.apply(this, arguments) : I,
        typeof M == "function" ? M.apply(this, arguments) : M
      ), e.apply(this, arguments), s);
    }, null, R);
  }, y.translateTo = function(w, I, M, R, z) {
    y.transform(w, function() {
      var V = e.apply(this, arguments), $ = this.__zoom, S = R == null ? x(V) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Jn.translate(S[0], S[1]).scale($.k).translate(
        typeof I == "function" ? -I.apply(this, arguments) : -I,
        typeof M == "function" ? -M.apply(this, arguments) : -M
      ), V, s);
    }, R, z);
  };
  function _(w, I) {
    return I = Math.max(r[0], Math.min(r[1], I)), I === w.k ? w : new et(I, w.x, w.y);
  }
  function k(w, I, M) {
    var R = I[0] - M[0] * w.k, z = I[1] - M[1] * w.k;
    return R === w.x && z === w.y ? w : new et(w.k, R, z);
  }
  function x(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function C(w, I, M, R) {
    w.on("start.zoom", function() {
      E(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var z = this, V = arguments, $ = E(z, V).event(R), S = e.apply(z, V), N = M == null ? x(S) : typeof M == "function" ? M.apply(z, V) : M, F = Math.max(S[1][0] - S[0][0], S[1][1] - S[0][1]), W = z.__zoom, Q = typeof I == "function" ? I.apply(z, V) : I, U = l(W.invert(N).concat(F / W.k), Q.invert(N).concat(F / Q.k));
      return function(G) {
        if (G === 1) G = Q;
        else {
          var Z = U(G), H = F / Z[2];
          G = new et(H, N[0] - Z[0] * H, N[1] - Z[1] * H);
        }
        $.zoom(null, G);
      };
    });
  }
  function E(w, I, M) {
    return !M && w.__zooming || new b(w, I);
  }
  function b(w, I) {
    this.that = w, this.args = I, this.active = 0, this.sourceEvent = null, this.extent = e.apply(w, I), this.taps = 0;
  }
  b.prototype = {
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
      var I = Xe(this.that).datum();
      c.call(
        w,
        this.that,
        new Yu(w, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        I
      );
    }
  };
  function T(w, ...I) {
    if (!t.apply(this, arguments)) return;
    var M = E(this, I).event(w), R = this.__zoom, z = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), V = Qe(w);
    if (M.wheel)
      (M.mouse[0][0] !== V[0] || M.mouse[0][1] !== V[1]) && (M.mouse[1] = R.invert(M.mouse[0] = V)), clearTimeout(M.wheel);
    else {
      if (R.k === z) return;
      M.mouse = [V, R.invert(V)], qn(this), M.start();
    }
    nn(w), M.wheel = setTimeout($, p), M.zoom("mouse", n(k(_(R, z), M.mouse[0], M.mouse[1]), M.extent, s));
    function $() {
      M.wheel = null, M.end();
    }
  }
  function D(w, ...I) {
    if (f || !t.apply(this, arguments)) return;
    var M = w.currentTarget, R = E(this, I, !0).event(w), z = Xe(w.view).on("mousemove.zoom", N, !0).on("mouseup.zoom", F, !0), V = Qe(w, M), $ = w.clientX, S = w.clientY;
    Er(w.view), Po(w), R.mouse = [V, this.__zoom.invert(V)], qn(this), R.start();
    function N(W) {
      if (nn(W), !R.moved) {
        var Q = W.clientX - $, U = W.clientY - S;
        R.moved = Q * Q + U * U > g;
      }
      R.event(W).zoom("mouse", n(k(R.that.__zoom, R.mouse[0] = Qe(W, M), R.mouse[1]), R.extent, s));
    }
    function F(W) {
      z.on("mousemove.zoom mouseup.zoom", null), Cr(W.view, R.moved), nn(W), R.event(W).end();
    }
  }
  function L(w, ...I) {
    if (t.apply(this, arguments)) {
      var M = this.__zoom, R = Qe(w.changedTouches ? w.changedTouches[0] : w, this), z = M.invert(R), V = M.k * (w.shiftKey ? 0.5 : 2), $ = n(k(_(M, V), R, z), e.apply(this, I), s);
      nn(w), a > 0 ? Xe(this).transition().duration(a).call(C, $, R, w) : Xe(this).call(y.transform, $, R, w);
    }
  }
  function A(w, ...I) {
    if (t.apply(this, arguments)) {
      var M = w.touches, R = M.length, z = E(this, I, w.changedTouches.length === R).event(w), V, $, S, N;
      for (Po(w), $ = 0; $ < R; ++$)
        S = M[$], N = Qe(S, this), N = [N, this.__zoom.invert(N), S.identifier], z.touch0 ? !z.touch1 && z.touch0[2] !== N[2] && (z.touch1 = N, z.taps = 0) : (z.touch0 = N, V = !0, z.taps = 1 + !!d);
      d && (d = clearTimeout(d)), V && (z.taps < 2 && (u = N[0], d = setTimeout(function() {
        d = null;
      }, h)), qn(this), z.start());
    }
  }
  function P(w, ...I) {
    if (this.__zooming) {
      var M = E(this, I).event(w), R = w.changedTouches, z = R.length, V, $, S, N;
      for (nn(w), V = 0; V < z; ++V)
        $ = R[V], S = Qe($, this), M.touch0 && M.touch0[2] === $.identifier ? M.touch0[0] = S : M.touch1 && M.touch1[2] === $.identifier && (M.touch1[0] = S);
      if ($ = M.that.__zoom, M.touch1) {
        var F = M.touch0[0], W = M.touch0[1], Q = M.touch1[0], U = M.touch1[1], G = (G = Q[0] - F[0]) * G + (G = Q[1] - F[1]) * G, Z = (Z = U[0] - W[0]) * Z + (Z = U[1] - W[1]) * Z;
        $ = _($, Math.sqrt(G / Z)), S = [(F[0] + Q[0]) / 2, (F[1] + Q[1]) / 2], N = [(W[0] + U[0]) / 2, (W[1] + U[1]) / 2];
      } else if (M.touch0) S = M.touch0[0], N = M.touch0[1];
      else return;
      M.zoom("touch", n(k($, S, N), M.extent, s));
    }
  }
  function v(w, ...I) {
    if (this.__zooming) {
      var M = E(this, I).event(w), R = w.changedTouches, z = R.length, V, $;
      for (Po(w), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), V = 0; V < z; ++V)
        $ = R[V], M.touch0 && M.touch0[2] === $.identifier ? delete M.touch0 : M.touch1 && M.touch1[2] === $.identifier && delete M.touch1;
      if (M.touch1 && !M.touch0 && (M.touch0 = M.touch1, delete M.touch1), M.touch0) M.touch0[1] = this.__zoom.invert(M.touch0[0]);
      else if (M.end(), M.taps === 2 && ($ = Qe($, this), Math.hypot(u[0] - $[0], u[1] - $[1]) < m)) {
        var S = Xe(this).on("dblclick.zoom");
        S && S.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : In(+w), y) : o;
  }, y.filter = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : In(!!w), y) : t;
  }, y.touchable = function(w) {
    return arguments.length ? (i = typeof w == "function" ? w : In(!!w), y) : i;
  }, y.extent = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : In([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), y) : e;
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
function es(t) {
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
function Ju(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = Xe(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (b) => {
    c && b.code === c && (l = !0, t.style.cursor = "grab");
  }, u = (b) => {
    c && b.code === c && (l = !1, t.style.cursor = "");
  }, f = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Ku().scaleExtent([o, i]).on("start", (b) => {
    if (!b.sourceEvent) return;
    l && (t.style.cursor = "grabbing");
    const { x: T, y: D, k: L } = b.transform;
    e.onMoveStart?.({ x: T, y: D, zoom: L });
  }).on("zoom", (b) => {
    const { x: T, y: D, k: L } = b.transform;
    n({ x: T, y: D, zoom: L }), b.sourceEvent && e.onMove?.({ x: T, y: D, zoom: L });
  }).on("end", (b) => {
    if (!b.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: T, y: D, k: L } = b.transform;
    e.onMoveEnd?.({ x: T, y: D, zoom: L });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(es({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => l,
    panOnDrag: e.panOnDrag
  })), a.call(h), e.zoomOnDoubleClick === !1 && a.on("dblclick.zoom", null);
  let p = e.panOnScroll ?? !1, g = e.panOnScrollDirection ?? "both", m = e.panOnScrollSpeed ?? 1, y = !1;
  const _ = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, k = (b) => {
    _ && b.code === _ && (y = !0);
  }, x = (b) => {
    _ && b.code === _ && (y = !1);
  }, C = () => {
    y = !1;
  };
  _ && (window.addEventListener("keydown", k), window.addEventListener("keyup", x), window.addEventListener("blur", C));
  const E = (b) => {
    if (e.isLocked?.()) return;
    const T = b.ctrlKey || b.metaKey || y;
    if (!(p ? !T : b.shiftKey)) return;
    b.preventDefault(), b.stopPropagation();
    const L = m;
    let A = 0, P = 0;
    g !== "horizontal" && (P = -b.deltaY * L), g !== "vertical" && (A = -b.deltaX * L, b.shiftKey && b.deltaX === 0 && g === "both" && (A = -b.deltaY * L, P = 0)), e.onScrollPan?.(A, P);
  };
  return t.addEventListener("wheel", E, { passive: !1, capture: !0 }), {
    setViewport(b, T) {
      const D = T?.duration ?? 0, L = Jn.translate(b.x ?? 0, b.y ?? 0).scale(b.zoom ?? 1);
      D > 0 ? a.transition().duration(D).call(h.transform, L) : a.call(h.transform, L);
    },
    getTransform() {
      return t.__zoom ?? Jn;
    },
    update(b) {
      if ((b.minZoom !== void 0 || b.maxZoom !== void 0) && h.scaleExtent([
        b.minZoom ?? o,
        b.maxZoom ?? i
      ]), b.pannable !== void 0 || b.zoomable !== void 0) {
        const T = b.pannable ?? r, D = b.zoomable ?? s;
        h.filter(es({
          pannable: T,
          zoomable: D,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => l,
          panOnDrag: e.panOnDrag
        }));
      }
      b.panOnScroll !== void 0 && (p = b.panOnScroll), b.panOnScrollDirection !== void 0 && (g = b.panOnScrollDirection), b.panOnScrollSpeed !== void 0 && (m = b.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", E, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), _ && (window.removeEventListener("keydown", k), window.removeEventListener("keyup", x), window.removeEventListener("blur", C)), a.on(".zoom", null);
    }
  };
}
function Vr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Qu(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ve = 150, be = 50;
function vo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - l / 2, y: u - c / 2, width: l, height: c };
}
function Wt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? ve, l = s.dimensions?.height ?? be, c = Kt(s, e), d = s.rotation ? vo(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function ef(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, a = r.dimensions?.height ?? be, l = Kt(r, n), c = r.rotation ? vo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function tf(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, a = r.dimensions?.height ?? be, l = Kt(r, n), c = r.rotation ? vo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Qn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + a / 2 }, p = e / 2 - h.x * f, g = n / 2 - h.y * f;
  return { x: p, y: g, zoom: f };
}
function nf(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class of {
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
function Kt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? ve, i = t.dimensions?.height ?? be;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let Br = !1;
function qr(t) {
  Br = t;
}
function B(t, e, n) {
  if (!Br) return;
  const o = `%c[AlpineFlow:${t}]`, i = sf(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function sf(t) {
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
const vn = "#64748b", bi = "#d4d4d8", Xr = "#ef4444", rf = "2", af = "6 3", ts = 1.2, Qo = 0.2, eo = 5, ns = 25;
class lf {
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
const cf = 16;
function df() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), cf),
    cancel: (t) => clearTimeout(t)
  };
}
class Yr {
  constructor() {
    this._scheduler = df(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const to = new Yr(), uf = {
  linear: uu,
  easeIn: fu,
  easeOut: hu,
  easeInOut: gu,
  easeCubicIn: pu,
  easeCubicOut: mu,
  easeCubicInOut: Fr,
  easeCircIn: Eu,
  easeCircOut: Cu,
  easeCircInOut: Su,
  easeSinIn: yu,
  easeSinOut: wu,
  easeSinInOut: vu,
  easeExpoIn: _u,
  easeExpoOut: bu,
  easeExpoInOut: xu,
  easeBounce: Kn,
  easeBounceIn: Iu,
  easeBounceInOut: Du,
  easeElastic: zu,
  easeElasticIn: Ou,
  easeElasticInOut: Vu,
  easeBack: Fu,
  easeBackIn: Ru,
  easeBackOut: Hu
};
function Wr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function no(t) {
  return typeof t == "function" ? t : uf[t ?? "easeInOut"];
}
function it(t, e, n) {
  return t + (e - t) * n;
}
function xi(t, e, n) {
  return Wo(t, e)(n);
}
function _n(t) {
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
const os = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, is = /^(#|rgb|hsl)/;
function jr(t, e, n) {
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
    const l = os.exec(s), c = os.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = it(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (is.test(s) && is.test(a)) {
      o[r] = xi(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function ff(t, e, n, o) {
  let i = it(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: it(t.x, e.x, n),
    y: it(t.y, e.y, n),
    zoom: i
  };
}
class hf {
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
class gf {
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
const on = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Ur(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? on.stiffness, i = e.damping ?? on.damping, r = e.mass ?? on.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? on.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? on.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const ss = {
  timeConstant: 350,
  restVelocity: 0.5
};
function Ei(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? ss.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < ss.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function Ci(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Gr(t, e, n, o) {
  if (n <= 0)
    return;
  Ei(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? Ci(o) : null;
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
function Zr(t, e, n, o) {
  const i = Ci(o), r = e.values.map(
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
const rs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, as = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, ls = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Kr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return rs[n] ? { ...rs[n] } : null;
    case "decay":
      return as[n] ? { ...as[n] } : null;
    case "inertia":
      return ls[n] ? { ...ls[n] } : null;
    default:
      return null;
  }
}
function cs(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function pf(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? it(t, e, n) : cs(t) && cs(e) ? xi(t, e, n) : n < 0.5 ? t : e;
}
class mf {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new hf(), this._activeTransaction = null, this._engine = e;
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
    const e = new gf();
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
    } = n, y = no(i), _ = g ? Kr(g) : void 0;
    for (const w of e) {
      const I = this._ownership.get(w.key);
      if (I && !I.stopped) {
        const M = I.currentValues.get(w.key);
        M !== void 0 && (w.from = M), I.entries = I.entries.filter((R) => R.key !== w.key), I.entries.length === 0 && this._stop(I, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const w of e)
        this._activeTransaction.captureProperty(w.key, w.from, w.apply);
    if (o <= 0) {
      const w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (const z of e)
        w.set(z.key, z.from), I.set(z.key, z.to);
      l?.();
      for (const z of e)
        z.apply(z.to);
      const M = [...u ? [u] : [], ...f ?? []], R = {
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
    const k = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
    for (const w of e)
      k.set(w.key, w.from), x.set(w.key, w.to);
    let C;
    if (_) {
      C = /* @__PURE__ */ new Map();
      for (const w of e) {
        if (typeof w.from != "number" || typeof w.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${w.key}" is non-numeric; snapping to target.`
          ), w.apply(w.to);
          continue;
        }
        let I = 0;
        if (_.type === "decay" || _.type === "inertia") {
          const M = _.velocity;
          if (typeof M == "number")
            I = M;
          else if (M && typeof M == "object") {
            const z = M, V = Ci(w.key);
            I = z[w.key] ?? (V ? z[V] ?? 0 : 0);
          }
          const R = _.power ?? 0.8;
          I *= R;
        }
        C.set(w.key, {
          value: w.from,
          velocity: I,
          target: w.to,
          settled: !1
        });
      }
      C.size === 0 && (C = void 0);
    }
    const E = s === "ping-pong" ? "reverse" : s, b = a === "end" ? "backward" : "forward";
    let T;
    const D = new Promise((w) => {
      T = w;
    }), L = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: b,
      duration: o,
      easingFn: y,
      loop: E,
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
      snapshot: k,
      target: x,
      _currentFinished: D,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: C ? _ : void 0,
      physicsStates: C,
      maxDuration: m,
      isPhysics: !!C,
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
    const A = this._engine.register((w) => this._tick(L, w), r);
    L.engineHandle = A;
    const P = [...u ? [u] : [], ...f ?? []], v = {
      _tags: P.length > 0 ? P : void 0,
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
    return this._registry.register(v), L._handle = v, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(v), v;
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
      const l = pf(a.from, a.to, s);
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
              Ur(d, e.motionConfig, i);
              break;
            case "decay":
              Ei(d, e.motionConfig, i);
              break;
            case "inertia":
              Gr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Zr(d, e.motionConfig, h, c.key);
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
const Jr = /* @__PURE__ */ new Map();
function yf(t, e) {
  Jr.set(t, e);
}
function Mo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Vt(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Bt(t, e) {
  return `${e}__${t.type}__${(t.color ?? bi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function oo(t, e) {
  const n = Mo(t.color ?? bi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = Mo(t.orient ?? "auto-start-reverse"), l = Mo(e);
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
  const c = Jr.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : oo({ ...t, type: "arrowclosed" }, e);
}
const bt = 200, xt = 150, wf = 1.2, sn = "http://www.w3.org/2000/svg";
function vf(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor, l = document.createElement("div");
  l.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(sn, "svg");
  c.setAttribute("width", String(bt)), c.setAttribute("height", String(xt));
  const d = document.createElementNS(sn, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(bt)), d.setAttribute("height", String(xt));
  const u = document.createElementNS(sn, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(sn, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), l.appendChild(c), t.appendChild(l);
  let h = { x: 0, y: 0, width: 0, height: 0 }, p = 1;
  function g() {
    const A = n();
    if (h = Wt(A.nodes.filter((P) => !P.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      p = 1;
      return;
    }
    p = Math.max(
      h.width / bt,
      h.height / xt
    ) * wf;
  }
  function m(A) {
    return typeof a == "function" ? a(A) : a;
  }
  function y() {
    const A = n();
    g(), u.innerHTML = "";
    const P = (bt - h.width / p) / 2, v = (xt - h.height / p) / 2;
    for (const w of A.nodes) {
      if (w.hidden) continue;
      const I = document.createElementNS(sn, "rect"), M = (w.dimensions?.width ?? ve) / p, R = (w.dimensions?.height ?? be) / p, z = (w.position.x - h.x) / p + P, V = (w.position.y - h.y) / p + v;
      I.setAttribute("x", String(z)), I.setAttribute("y", String(V)), I.setAttribute("width", String(M)), I.setAttribute("height", String(R)), I.setAttribute("rx", "2");
      const $ = m(w);
      $ && (I.style.fill = $), u.appendChild(I);
    }
    _();
  }
  function _() {
    const A = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const P = (bt - h.width / p) / 2, v = (xt - h.height / p) / 2, w = (-A.viewport.x / A.viewport.zoom - h.x) / p + P, I = (-A.viewport.y / A.viewport.zoom - h.y) / p + v, M = A.containerWidth / A.viewport.zoom / p, R = A.containerHeight / A.viewport.zoom / p, z = `M0,0 H${bt} V${xt} H0 Z`, V = `M${w},${I} h${M} v${R} h${-M} Z`;
    f.setAttribute("d", `${z} ${V}`);
  }
  let k = !1;
  function x(A, P) {
    const v = (bt - h.width / p) / 2, w = (xt - h.height / p) / 2, I = (A - v) * p + h.x, M = (P - w) * p + h.y;
    return { x: I, y: M };
  }
  function C(A) {
    const P = c.getBoundingClientRect(), v = A.clientX - P.left, w = A.clientY - P.top, I = n(), M = x(v, w), R = -M.x * I.viewport.zoom + I.containerWidth / 2, z = -M.y * I.viewport.zoom + I.containerHeight / 2;
    o({ x: R, y: z, zoom: I.viewport.zoom });
  }
  function E(A) {
    i.minimapPannable && (k = !0, c.setPointerCapture(A.pointerId), C(A));
  }
  function b(A) {
    k && C(A);
  }
  function T(A) {
    k && (k = !1, c.releasePointerCapture(A.pointerId));
  }
  c.addEventListener("pointerdown", E), c.addEventListener("pointermove", b), c.addEventListener("pointerup", T);
  function D(A) {
    if (!i.minimapZoomable)
      return;
    A.preventDefault();
    const P = n(), v = i.minZoom ?? 0.5, w = i.maxZoom ?? 2, I = A.deltaY > 0 ? 0.9 : 1.1, M = Math.min(Math.max(P.viewport.zoom * I, v), w);
    o({ zoom: M });
  }
  c.addEventListener("wheel", D, { passive: !1 });
  function L() {
    c.removeEventListener("pointerdown", E), c.removeEventListener("pointermove", b), c.removeEventListener("pointerup", T), c.removeEventListener("wheel", D), l.remove();
  }
  return { render: y, updateViewport: _, destroy: L };
}
const _f = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', bf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', xf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', ds = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Ef = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', Cf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', us = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', Sf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function kf(t, e) {
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
  let y = null, _ = null;
  if (i) {
    const C = At(_f, "Zoom in", c), E = At(bf, "Zoom out", d);
    g.appendChild(C), g.appendChild(E);
  }
  if (r) {
    const C = At(xf, "Fit view", u);
    g.appendChild(C);
  }
  if (s && (y = At(ds, "Toggle interactivity", f), g.appendChild(y)), a) {
    const C = At(Cf, "Reset panels", h);
    g.appendChild(C);
  }
  p && (_ = At(us, "Toggle fullscreen", p), _.classList.add("flow-controls-button-fullscreen"), g.appendChild(_)), g.addEventListener("mousedown", (C) => C.stopPropagation()), g.addEventListener("pointerdown", (C) => C.stopPropagation()), g.addEventListener("wheel", (C) => C.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function k(C) {
    if (y && typeof C.isInteractive == "boolean") {
      ei(y, C.isInteractive ? ds : Ef);
      const E = C.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      y.title = E, y.setAttribute("aria-label", E);
    }
    if (_ && typeof C.isFullscreen == "boolean") {
      ei(_, C.isFullscreen ? Sf : us);
      const E = C.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      _.title = E, _.setAttribute("aria-label", E), _.classList.toggle("flow-controls-button-fullscreen--active", C.isFullscreen);
    }
  }
  function x() {
    g.remove();
  }
  return { update: k, destroy: x };
}
function At(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", ei(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function ei(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const fs = 5;
function Lf(t) {
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
    if (h < fs && p < fs)
      return null;
    const g = Math.min(o, r), m = Math.min(i, s), y = (g - f.x) / f.zoom, _ = (m - f.y) / f.zoom, k = h / f.zoom, x = p / f.zoom;
    return { x: y, y: _, width: k, height: x };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: u };
}
const hs = 3;
function Pf(t) {
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
    h * h + p * p < hs * hs || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
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
function Si(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function Mf(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, u = a - r, f = l * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * u - p * d) / f, m = (h * c - p * l) / f;
  return g >= 0 && g <= 1 && m >= 0 && m <= 1;
}
function Tf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (Si(s, a, t)) return !0;
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
      if (Mf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, p))
        return !0;
  return !1;
}
function Qr(t) {
  const e = t.dimensions?.width ?? ve, n = t.dimensions?.height ?? be;
  return t.rotation ? vo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function Nf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Qr(n);
    return Tf(e, o);
  });
}
function Af(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Qr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => Si(r.x, r.y, e));
  });
}
function $f(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function ti(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function If(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function Df(t, e, n) {
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
function Rf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function Hf(t, e, n) {
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
function gt(t, e, n) {
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
function pt(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && Df(t.source, t.target, e));
}
const We = "_flowHandleValidate";
function Ff(t) {
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
        typeof a == "function" ? e[We] = a : (delete e[We], requestAnimationFrame(() => {
          const l = t.$data(e);
          l && typeof l[n] == "function" && (e[We] = l[n]);
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
const ut = "_flowHandleLimit";
function Of(t) {
  t.directive(
    "flow-handle-limit",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      i(() => {
        const s = Number(o(n));
        s > 0 ? e[ut] = s : delete e[ut];
      }), r(() => {
        delete e[ut];
      });
    }
  );
}
const Pt = "_flowHandleConnectableStart", st = "_flowHandleConnectableEnd";
function zf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("start"), l = o.includes("end"), c = a || !a && !l, d = l || !a && !l;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[Pt] = u), d && (e[st] = u);
      }), s(() => {
        delete e[Pt], delete e[st];
      });
    }
  );
}
function kn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function ea(t) {
  return kn(t, t.draggable);
}
function Vf(t) {
  return kn(t, t.deletable);
}
function qe(t) {
  return kn(t, t.connectable);
}
function ni(t) {
  return kn(t, t.selectable);
}
function gs(t) {
  return kn(t, t.resizable);
}
function jt(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(a * a + l * l), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), p = n - a / u * h, g = o - l / u * h, m = n + c / f * h, y = o + d / f * h;
  return `L${p},${g} Q${n},${o} ${m},${y}`;
}
function Ln({
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
function Dn(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function Bf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * Dn(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * Dn(
    n === "bottom" ? i - e : e - i,
    s
  ), u = l ? o + (r === "right" ? 1 : -1) * Dn(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = l ? i : i + (r === "bottom" ? 1 : -1) * Dn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function io(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = Bf(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = Ln({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Gy({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: a, offsetX: l, offsetY: c } = Ln({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: a },
    labelOffsetX: l,
    labelOffsetY: c
  };
}
function ps(t) {
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
function qf(t, e, n, o, i, r, s) {
  const a = ps(n), l = ps(r), c = t + a.x * s, d = e + a.y * s, u = o + l.x * s, f = i + l.y * s, h = n === "left" || n === "right";
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
function bn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: a = 10
}) {
  const l = qf(
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
      const [y, _] = p === 1 ? [t, e] : l[p - 1], [k, x] = l[p + 1];
      c += ` ${jt(y, _, g, m, k, x, s)}`;
    } else
      c += ` L${g},${m}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = Ln({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Xf(t) {
  return bn({ ...t, borderRadius: 0 });
}
function ta({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: a, offsetY: l } = Ln({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: a,
    labelOffsetY: l
  };
}
const at = 40;
function Yf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < at && s >= 0 ? i = -o * (1 - s / at) : a < at && a >= 0 && (i = o * (1 - a / at)), l < at && l >= 0 ? r = -o * (1 - l / at) : c < at && c >= 0 && (r = o * (1 - c / at)), { dx: i, dy: r };
}
function na(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Yf(r, s, c, n);
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
function Ut(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Xr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || vn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(rf),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? af
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
        p = io({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = bn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        p = Xf({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        p = ta({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
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
function xn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let a = null, l = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !qe(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
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
      if (p && !qe(p)) return;
    }
    const d = t.handleType === "target" ? st : Pt;
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
function _o(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = na({
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
function Wf(t, e, n, o) {
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
function oa(t, e) {
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
      connectableStart: l[Pt] !== !1,
      connectableEnd: l[st] !== !1,
      hasValidator: l[We] != null,
      limit: l[ut] ?? null
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
let fn = 0;
const Rn = /* @__PURE__ */ new WeakMap();
function tt(t, e) {
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
function nt(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ut] && n.filter(
      (l) => l.source === e.source && (l.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
    ).length >= s[ut])
      return !1;
  }
  const i = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (i) {
    const r = e.targetHandle ?? "target", s = i.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="target"]`
    ) ?? i.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ut] && n.filter(
      (l) => l.target === e.target && (l.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[ut])
      return !1;
  }
  return !0;
}
function En(t, e, n, o, i, r) {
  if (!r) {
    jf(t, e, n, o, i);
    return;
  }
  const s = Wf(o, e, n, i), a = r.get(e, n, "source"), l = a?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= a.limit, c = [];
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
    m && a?.hasValidator && (m = !!a.el[We](u)), m && p.hasValidator && (m = !!p.el[We](u));
    const y = m && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: y, limitHit: h && !g });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function jf(t, e, n, o, i) {
  const r = i ? o.edges.filter((a) => a.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const a of s) {
    const c = a.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = a.dataset.flowHandleId ?? "target";
    if (a[st] === !1) {
      a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && pt(u, r, { preventCycles: o._config?.preventCycles }), p = h && nt(t, u, r);
    p && tt(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (a.classList.add("flow-handle-valid"), a.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid"), h && !p ? a.classList.add("flow-handle-limit-reached") : a.classList.remove("flow-handle-limit-reached"));
  }
}
function Pe(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function kt(t, e) {
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
async function bo(t, e, n, o, i, r) {
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
async function ia(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), a = (c) => (Ne(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!pt(n, s, { preventCycles: o._config?.preventCycles }) || !gt(n, o._config?.connectionRules, o._nodeMap) || !nt(i, n, s) || !tt(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return a();
  const l = o._config?.connectValidator;
  if (l) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = xo(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await bo(
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
async function sa(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ne(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !qe(s) || !pt(e, i, { preventCycles: n._config?.preventCycles }) || !gt(e, n._config?.connectionRules, n._nodeMap) || !nt(o, e, i) || !tt(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const a = n._config?.connectValidator;
  if (a) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = xo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await bo(
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${fn++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function xo(t, e) {
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
const ft = /* @__PURE__ */ new WeakMap();
function ra(t, e, n) {
  n.preventDefault(), n.stopPropagation();
  const o = t.dataset.flowHandleId ?? "source", i = t.closest("[x-flow-node]");
  if (!e || !i || e._animationLocked) return;
  const r = i.dataset.flowNodeId;
  if (!r) return;
  const s = e.getNode(r);
  if (s && !qe(s) || t[Pt] === !1) return;
  const a = n.clientX, l = n.clientY;
  let c = !1;
  if (e.pendingConnection && e._config?.connectOnClick !== !1) {
    e._emit("connect-end", {
      connection: null,
      source: e.pendingConnection.source,
      sourceHandle: e.pendingConnection.sourceHandle,
      position: { x: 0, y: 0 }
    }), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
    const A = t.closest(".flow-container");
    A && Pe(A);
  }
  let d = null, u = null, f = null, h = null, p = null;
  const g = e._config?.connectionSnapRadius ?? 20, m = t.closest(".flow-container");
  let y = null, _ = 0, k = 0, x = !1, C = /* @__PURE__ */ new Map();
  const E = () => {
    if (c = !0, B("connection", `Connection drag started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), !m) return;
    u = Ut({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: m
    }), d = u.svg;
    const A = t.getBoundingClientRect(), P = m.getBoundingClientRect(), v = e._viewportLive ?? e.viewport, w = v?.zoom || 1, I = v?.x || 0, M = v?.y || 0;
    _ = (A.left + A.width / 2 - P.left - I) / w, k = (A.top + A.height / 2 - P.top - M) / w, u.update({ fromX: _, fromY: k, toX: _, toY: k, source: r, sourceHandle: o });
    const R = m.querySelector(".flow-viewport");
    if (R && R.appendChild(d), e.pendingConnection = {
      source: r,
      sourceHandle: o,
      position: { x: _, y: k }
    }, h = _o(m, e, a, l), y = oa(
      m,
      (z, V) => e.screenToFlowPosition(z, V)
    ), En(m, r, o, e, void 0, y), e._config?.onEdgeDrop) {
      const z = e._config.edgeDropPreview, $ = z ? z({ source: r, sourceHandle: o }) : "New Node";
      if ($ !== null) {
        p = document.createElement("div"), p.className = "flow-ghost-node";
        const S = document.createElement("div");
        if (S.className = "flow-ghost-handle", p.appendChild(S), typeof $ == "string") {
          const F = document.createElement("span");
          F.textContent = $, p.appendChild(F);
        } else
          p.appendChild($);
        p.style.left = `${_}px`, p.style.top = `${k}px`;
        const N = m.querySelector(".flow-viewport");
        N && N.appendChild(p);
      }
    }
  }, b = () => {
    const A = [...e.selectedNodes], P = [], v = m.getBoundingClientRect(), w = e._viewportLive ?? e.viewport, I = w?.zoom || 1, M = w?.x || 0, R = w?.y || 0;
    for (const z of A) {
      if (z === r) continue;
      const $ = m?.querySelector(`[data-flow-node-id="${CSS.escape(z)}"]`)?.querySelector('[data-flow-handle-type="source"]');
      if (!$) continue;
      const S = $.getBoundingClientRect();
      P.push({
        nodeId: z,
        handleId: $.dataset.flowHandleId ?? "source",
        pos: {
          x: (S.left + S.width / 2 - v.left - M) / I,
          y: (S.top + S.height / 2 - v.top - R) / I
        }
      });
    }
    return P;
  }, T = (A) => {
    x = !0, u && (C.set(r, {
      line: u,
      sourceNodeId: r,
      sourceHandleId: o,
      sourcePos: { x: _, y: k },
      valid: !0
    }), u = null);
    const P = b(), v = m.querySelector(".flow-viewport");
    for (const w of P) {
      const I = Ut({
        connectionLineType: e._config?.connectionLineType,
        connectionLineStyle: e._config?.connectionLineStyle,
        connectionLine: e._config?.connectionLine,
        containerEl: m
      });
      I.update({
        fromX: w.pos.x,
        fromY: w.pos.y,
        toX: A.x,
        toY: A.y,
        source: w.nodeId,
        sourceHandle: w.handleId
      }), v && v.appendChild(I.svg), C.set(w.nodeId, {
        line: I,
        sourceNodeId: w.nodeId,
        sourceHandleId: w.handleId,
        sourcePos: w.pos,
        valid: !0
      });
    }
  }, D = (A) => {
    if (!c) {
      const w = A.clientX - a, I = A.clientY - l;
      if (Math.abs(w) >= eo || Math.abs(I) >= eo) {
        if (E(), e._config?.multiConnect && e.selectedNodes.size > 1 && e.selectedNodes.has(r)) {
          const M = e.screenToFlowPosition(A.clientX, A.clientY);
          T(M);
        }
      } else
        return;
    }
    const P = e.screenToFlowPosition(A.clientX, A.clientY);
    if (x) {
      const w = xn({
        containerEl: m,
        handleType: "target",
        excludeNodeId: r,
        cursorFlowPos: P,
        connectionSnapRadius: g,
        getNode: (V) => e.getNode(V),
        toFlowPosition: (V, $) => e.screenToFlowPosition(V, $),
        connectionMode: e._config?.connectionMode,
        index: y ?? void 0
      });
      w.element !== f && (f?.classList.remove("flow-handle-active"), w.element?.classList.add("flow-handle-active"), f = w.element);
      const M = w.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, R = w.element?.dataset.flowHandleId ?? "target", z = e._config?.connectionLineStyle?.stroke ?? (getComputedStyle(m).getPropertyValue("--flow-edge-stroke-selected").trim() || vn);
      for (const V of C.values())
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
            targetHandle: R
          }, U = e.getNode(M)?.connectable !== !1 && V.sourceNodeId !== M && pt($, e.edges, { preventCycles: e._config?.preventCycles }) && gt($, e._config?.connectionRules, e._nodeMap) && nt(m, $, e.edges) && tt(m, $) && (!e._config?.isValidConnection || e._config.isValidConnection($));
          V.valid = U;
          const G = V.line.svg.querySelector("path");
          if (G)
            if (U)
              G.setAttribute("stroke", z);
            else {
              const Z = getComputedStyle(m).getPropertyValue("--flow-connection-line-invalid").trim() || Xr;
              G.setAttribute("stroke", Z);
            }
        } else {
          V.valid = !0;
          const $ = V.line.svg.querySelector("path");
          $ && $.setAttribute("stroke", z);
        }
      e.pendingConnection = { ...e.pendingConnection, position: w.position }, h?.updatePointer(A.clientX, A.clientY);
      return;
    }
    const v = xn({
      containerEl: m,
      handleType: "target",
      excludeNodeId: r,
      cursorFlowPos: P,
      connectionSnapRadius: g,
      getNode: (w) => e.getNode(w),
      toFlowPosition: (w, I) => e.screenToFlowPosition(w, I),
      index: y ?? void 0
    });
    v.element !== f && (f?.classList.remove("flow-handle-active"), v.element?.classList.add("flow-handle-active"), f = v.element), p ? v.element ? (p.style.display = "none", u?.update({ fromX: _, fromY: k, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o })) : (p.style.display = "", p.style.left = `${P.x}px`, p.style.top = `${P.y}px`, u?.update({ fromX: _, fromY: k, toX: P.x, toY: P.y, source: r, sourceHandle: o })) : u?.update({ fromX: _, fromY: k, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o }), e.pendingConnection = { ...e.pendingConnection, position: v.position }, h?.updatePointer(A.clientX, A.clientY);
  }, L = async (A) => {
    if (h?.stop(), h = null, document.removeEventListener("pointermove", D), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), ft.delete(t), y = null, e._connectValidating) return;
    if (x) {
      const I = e.screenToFlowPosition(A.clientX, A.clientY);
      let M = f;
      M || (M = document.elementFromPoint(A.clientX, A.clientY)?.closest('[data-flow-handle-type="target"]'));
      const z = M?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, V = M?.dataset.flowHandleId ?? "target", $ = [], S = [], N = [], F = [];
      if (M && z) {
        const W = e.getNode(z);
        for (const Q of C.values()) {
          const U = {
            source: Q.sourceNodeId,
            sourceHandle: Q.sourceHandleId,
            target: z,
            targetHandle: V
          };
          if (W?.connectable !== !1 && Q.sourceNodeId !== z && pt(U, e.edges, { preventCycles: e._config?.preventCycles }) && gt(U, e._config?.connectionRules, e._nodeMap) && nt(m, U, e.edges) && tt(m, U) && (!e._config?.isValidConnection || e._config.isValidConnection(U))) {
            const K = `e-${Q.sourceNodeId}-${z}-${Date.now()}-${fn++}`;
            $.push({ id: K, ...U }), S.push(U), F.push(Q);
          } else
            N.push(Q);
        }
      } else
        N.push(...C.values());
      for (const W of F)
        W.line.destroy();
      if ($.length > 0) {
        e.addEdges($);
        for (const W of S)
          e._emit("connect", { connection: W });
        e._emit("multi-connect", { connections: S });
      }
      N.length > 0 && setTimeout(() => {
        for (const W of N)
          W.line.destroy();
      }, 100), f?.classList.remove("flow-handle-active"), e._emit("connect-end", {
        connection: S.length > 0 ? S[0] : null,
        source: r,
        sourceHandle: o,
        position: I
      }), C.clear(), x = !1, Pe(m), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
      return;
    }
    if (!c) {
      e._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), e.pendingConnection = {
        source: r,
        sourceHandle: o,
        position: { x: 0, y: 0 }
      }, e._container?.classList.add("flow-connecting"), En(m, r, o, e, void 0, y ?? void 0));
      return;
    }
    const P = u?.svg ?? null;
    p?.remove(), p = null, f?.classList.remove("flow-handle-active"), Pe(m);
    const v = e.screenToFlowPosition(A.clientX, A.clientY), w = { source: r, sourceHandle: o, position: v };
    try {
      let I = f;
      if (I || (I = document.elementFromPoint(A.clientX, A.clientY)?.closest('[data-flow-handle-type="target"]')), I) {
        const R = I.closest("[x-flow-node]")?.dataset.flowNodeId, z = I.dataset.flowHandleId ?? "target";
        if (R) {
          if (I[st] === !1) {
            B("connection", "Connection rejected (handle not connectable end)"), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const V = e.getNode(R);
          if (V && !qe(V)) {
            B("connection", `Connection rejected (target "${R}" not connectable)`), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const $ = {
            source: r,
            sourceHandle: o,
            target: R,
            targetHandle: z
          };
          if (pt($, e.edges, { preventCycles: e._config?.preventCycles })) {
            if (!gt($, e._config?.connectionRules, e._nodeMap)) {
              B("connection", "Connection rejected (connection rules)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!nt(m, $, e.edges)) {
              B("connection", "Connection rejected (handle limit)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!tt(m, $)) {
              B("connection", "Connection rejected (per-handle validator)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (e._config?.isValidConnection && !e._config.isValidConnection($)) {
              B("connection", "Connection rejected (custom validator)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            const S = e._config?.connectValidator;
            if (S) {
              const F = e._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: W, targetEl: Q } = xo(m, $);
              e._connectValidating = !0, kt(P, !0);
              let U;
              try {
                U = await bo(
                  S,
                  $,
                  W,
                  Q,
                  m,
                  F
                );
              } finally {
                e._connectValidating = !1, kt(P, !1);
              }
              if (!U.allowed) {
                B("connection", "Connection rejected (async connectValidator)", { connection: $, reason: U.reason }), Ne(m, { ...$, reason: U.reason }), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
                return;
              }
            }
            const N = `e-${r}-${R}-${Date.now()}-${fn++}`;
            e.addEdges({ id: N, ...$ }), B("connection", `Connection created: ${r} → ${R}`, $), e._emit("connect", { connection: $ }), e._emit("connect-end", { connection: $, ...w });
          } else
            B("connection", "Connection rejected (invalid)", $), Ne(m, $), e._emit("connect-end", { connection: null, ...w });
        } else
          e._emit("connect-end", { connection: null, ...w });
      } else if (e._config?.onEdgeDrop) {
        const M = {
          x: v.x - ve / 2,
          y: v.y - be / 2
        }, R = e._config.onEdgeDrop({
          source: r,
          sourceHandle: o,
          position: M
        });
        if (R) {
          const z = {
            source: r,
            sourceHandle: o,
            target: R.id,
            targetHandle: "target"
          };
          if (!nt(m, z, e.edges))
            B("connection", "Edge drop: connection rejected (handle limit)"), e._emit("connect-end", { connection: null, ...w });
          else if (!tt(m, z))
            B("connection", "Edge drop: connection rejected (per-handle validator)"), e._emit("connect-end", { connection: null, ...w });
          else if (!e._config.isValidConnection || e._config.isValidConnection(z)) {
            e.addNodes(R);
            const V = `e-${r}-${R.id}-${Date.now()}-${fn++}`;
            e.addEdges({ id: V, ...z }), B("connection", `Edge drop: created node "${R.id}" and edge`, z), e._emit("connect", { connection: z }), e._emit("connect-end", { connection: z, ...w });
          } else
            B("connection", "Edge drop: connection rejected by validator"), e._emit("connect-end", { connection: null, ...w });
        } else
          B("connection", "Edge drop: callback returned null"), e._emit("connect-end", { connection: null, ...w });
      } else
        B("connection", "Connection cancelled (no target)"), e._emit("connect-end", { connection: null, ...w });
    } finally {
      kt(P, !1), u?.destroy(), u = null;
    }
    e.pendingConnection = null;
  };
  document.addEventListener("pointermove", D), document.addEventListener("pointerup", L), document.addEventListener("pointercancel", L), ft.set(t, () => {
    document.removeEventListener("pointermove", D), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), h?.stop(), u?.destroy(), u = null, p?.remove(), p = null;
    for (const A of C.values())
      A.line.destroy();
    C.clear(), x = !1, f?.classList.remove("flow-handle-active"), Pe(m), y = null, e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
  });
}
function aa(t, e, n) {
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
  ), y = a.sourceHandle ? `[data-flow-handle-id="${CSS.escape(a.sourceHandle)}"]` : '[data-flow-handle-type="source"]', _ = m?.querySelector(y), k = g.getBoundingClientRect(), x = e._viewportLive ?? e.viewport, C = x?.zoom || 1, E = x?.x || 0, b = x?.y || 0;
  let T, D;
  if (_) {
    const $ = _.getBoundingClientRect();
    T = ($.left + $.width / 2 - k.left - E) / C, D = ($.top + $.height / 2 - k.top - b) / C;
  } else {
    const $ = e.getNode(a.source);
    if (!$) return;
    const S = $.dimensions?.width ?? ve, N = $.dimensions?.height ?? be;
    T = $.position.x + S / 2, D = $.position.y + N;
  }
  let L = null, A = null, P = null, v = c, w = d, I = null;
  const M = () => {
    u = !0;
    const $ = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    $ && $.classList.add("flow-edge-reconnecting"), e._emit("reconnect-start", { edge: a, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${a.id}"`), A = Ut({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: g
    }), L = A.svg;
    const S = e.screenToFlowPosition(c, d);
    A.update({
      fromX: T,
      fromY: D,
      toX: S.x,
      toY: S.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    });
    const N = g.querySelector(".flow-viewport");
    N && N.appendChild(L), e.pendingConnection = {
      source: a.source,
      sourceHandle: a.sourceHandle,
      position: S
    }, e._pendingReconnection = {
      edge: a,
      draggedEnd: "target",
      anchorPosition: { x: T, y: D },
      position: S
    }, P = _o(g, e, v, w), I = oa(
      g,
      (F, W) => e.screenToFlowPosition(F, W)
    ), En(g, a.source, a.sourceHandle ?? "source", e, a.id, I);
  }, R = ($) => {
    if (v = $.clientX, w = $.clientY, !u) {
      Math.sqrt(
        ($.clientX - c) ** 2 + ($.clientY - d) ** 2
      ) >= eo && M();
      return;
    }
    const S = e.screenToFlowPosition($.clientX, $.clientY), N = xn({
      containerEl: g,
      handleType: "target",
      excludeNodeId: a.source,
      cursorFlowPos: S,
      connectionSnapRadius: p,
      getNode: (F) => e.getNode(F),
      toFlowPosition: (F, W) => e.screenToFlowPosition(F, W),
      index: I ?? void 0
    });
    N.element !== h && (h?.classList.remove("flow-handle-active"), N.element?.classList.add("flow-handle-active"), h = N.element), A?.update({
      fromX: T,
      fromY: D,
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
    }), P?.updatePointer($.clientX, $.clientY);
  }, z = () => {
    if (f) return;
    f = !0, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", V), document.removeEventListener("pointercancel", V), P?.stop(), P = null, A?.destroy(), A = null, L = null, I = null, h?.classList.remove("flow-handle-active"), ft.delete(t);
    const $ = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    $ && $.classList.remove("flow-edge-reconnecting"), Pe(g), e.pendingConnection = null, e._pendingReconnection = null;
  }, V = async ($) => {
    if (!u) {
      z();
      return;
    }
    if (e._connectValidating) return;
    let S = h;
    S || (S = document.elementFromPoint($.clientX, $.clientY)?.closest('[data-flow-handle-type="target"]'));
    let N = !1;
    if (S) {
      const W = S.closest("[x-flow-node]")?.dataset.flowNodeId, Q = S.dataset.flowHandleId;
      if (W && e.getNode(W)?.connectable !== !1) {
        const G = {
          source: a.source,
          sourceHandle: a.sourceHandle,
          target: W,
          targetHandle: Q
        }, Z = { ...a }, H = A?.svg ?? null;
        kt(H, !0);
        let q;
        try {
          q = await ia({
            edge: a,
            newConnection: G,
            canvas: e,
            containerEl: g,
            endpoint: "target"
          });
        } finally {
          kt(H, !1);
        }
        q.applied ? (N = !0, B("reconnect", `Edge "${a.id}" reconnected (target)`, G), e._emit("reconnect", { oldEdge: Z, newConnection: G })) : B("reconnect", "Reconnection rejected", { connection: G, reason: q.reason });
      }
    }
    N || B("reconnect", `Edge "${a.id}" reconnection cancelled — snapping back`), e._emit("reconnect-end", { edge: a, successful: N }), z();
  };
  document.addEventListener("pointermove", R), document.addEventListener("pointerup", V), document.addEventListener("pointercancel", V), ft.set(t, z);
}
function Uf(t, e, n) {
  t.dataset.flowHandleType === "source" ? ra(t, e, n) : aa(t, e, n);
}
function ms(t) {
  return t?._config?.delegatedHandleEvents === !1;
}
function Gf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let p;
      c && u ? p = "top-left" : c && f ? p = "top-right" : d && u ? p = "bottom-left" : d && f ? p = "bottom-right" : c ? p = "top" : f ? p = "right" : d ? p = "bottom" : u ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let g, m = !1;
      if (i) {
        const C = r(i);
        C && typeof C == "object" && !Array.isArray(C) ? (g = C.id || e.getAttribute("data-flow-handle-id") || l, C.position && (p = C.position, m = !0)) : g = C || e.getAttribute("data-flow-handle-id") || l;
      } else
        g = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), m && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const C = r(i);
        C && typeof C == "object" && !Array.isArray(C) && C.position && (e.dataset.flowHandlePosition = C.position);
      })), !h && !m) {
        const C = () => {
          const b = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!b) return;
          const T = e.closest("[x-data]");
          return T ? t.$data(T)?.getNode?.(b) : void 0;
        };
        s(() => {
          const E = C();
          if (!E) return;
          const b = l === "source" ? E.sourcePosition : E.targetPosition;
          b && (e.dataset.flowHandlePosition = b);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const y = () => {
        const C = e.closest("[x-flow-node]");
        return C ? C.getAttribute("data-flow-node-id") ?? null : null;
      }, _ = () => {
        const C = e.closest("[x-data]");
        return C ? t.$data(C) : null;
      }, k = _();
      let x = null;
      if (k?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${l} handle ${g}`);
        const C = (T) => {
          const D = T?._pendingKeyboardConnect;
          if (!D) return;
          const L = e.closest(".flow-container");
          L && L.querySelector(
            `[data-flow-node-id="${CSS.escape(D.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(D.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), T && (T._pendingKeyboardConnect = null);
        }, E = (T) => {
          if (!(T.key === "Enter" || T.key === " " || T.key === "Spacebar")) return;
          const L = _();
          if (!L || L._animationLocked) return;
          const A = y();
          if (A)
            if (l === "source") {
              const P = L.getNode?.(A);
              if (P && !qe(P) || e[Pt] === !1) return;
              T.preventDefault(), T.stopPropagation(), C(L), L._pendingKeyboardConnect = {
                sourceNodeId: A,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), L._announcer?.announce?.(`Connecting from ${l} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!L._pendingKeyboardConnect) return;
              const P = L.getNode?.(A);
              if (P && !qe(P) || e[st] === !1) return;
              T.preventDefault(), T.stopPropagation();
              const { sourceNodeId: v, sourceHandleId: w } = L._pendingKeyboardConnect, I = {
                source: v,
                sourceHandle: w,
                target: A,
                targetHandle: g
              }, M = e.closest(".flow-container");
              if (C(L), !M) return;
              sa({ connection: I, canvas: L, containerEl: M }).then((R) => {
                R.applied && L._announcer?.announce?.(`Connected ${v} to ${A}.`);
              });
            }
        };
        e.addEventListener("keydown", E);
        const b = e.closest(".flow-container");
        if (b) {
          const T = Rn.get(b);
          if (T)
            T.count += 1;
          else {
            const D = (L) => {
              if (L.key !== "Escape") return;
              const A = b.matches("[x-data]") ? b : b.closest("[x-data]") ?? b.querySelector("[x-data]");
              if (!A) return;
              const P = t.$data(A);
              P?._pendingKeyboardConnect && C(P);
            };
            b.addEventListener("keydown", D), Rn.set(b, { count: 1, handler: D });
          }
        }
        x = () => {
          if (e.removeEventListener("keydown", E), b) {
            const T = Rn.get(b);
            T && (T.count -= 1, T.count <= 0 && (b.removeEventListener("keydown", T.handler), Rn.delete(b)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (l === "source") {
        const C = (T) => {
          ra(e, _(), T);
        };
        ms(k) && e.addEventListener("pointerdown", C);
        const E = () => {
          const T = _();
          if (!T?._pendingReconnection || T._pendingReconnection.draggedEnd !== "source") return;
          const D = y();
          if (D) {
            const L = T.getNode(D);
            if (L && !qe(L)) return;
          }
          e[Pt] !== !1 && e.classList.add("flow-handle-active");
        }, b = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", E), e.addEventListener("pointerleave", b), a(() => {
          ft.get(e)?.(), ft.delete(e), x?.(), e.removeEventListener("pointerdown", C), e.removeEventListener("pointerenter", E), e.removeEventListener("pointerleave", b), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const C = () => {
          const D = _();
          if (!D?.pendingConnection) return;
          const L = y();
          if (L) {
            const A = D.getNode(L);
            if (A && !qe(A)) return;
          }
          e[st] !== !1 && e.classList.add("flow-handle-active");
        }, E = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", C), e.addEventListener("pointerleave", E);
        const b = async (D) => {
          const L = _();
          if (!L?.pendingConnection || L._config?.connectOnClick === !1 || L._connectValidating) return;
          D.preventDefault(), D.stopPropagation();
          const A = y();
          if (!A) return;
          if (e[st] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), L._emit("connect-end", { connection: null, source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
            const M = e.closest(".flow-container");
            M && Pe(M);
            return;
          }
          const P = L.getNode(A);
          if (P && !qe(P)) {
            B("connection", `Click-to-connect rejected (target "${A}" not connectable)`), L._emit("connect-end", { connection: null, source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
            const M = e.closest(".flow-container");
            M && Pe(M);
            return;
          }
          const v = {
            source: L.pendingConnection.source,
            sourceHandle: L.pendingConnection.sourceHandle,
            target: A,
            targetHandle: g
          }, w = { source: L.pendingConnection.source, sourceHandle: L.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (pt(v, L.edges, { preventCycles: L._config?.preventCycles })) {
            const M = e.closest(".flow-container");
            if (!gt(v, L._config?.connectionRules, L._nodeMap)) {
              B("connection", "Click-to-connect rejected (connection rules)", v), Ne(M, v), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Pe(M);
              return;
            }
            if (M && !nt(M, v, L.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", v), Ne(M, v), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), Pe(M);
              return;
            }
            if (M && !tt(M, v)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", v), Ne(M, v), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Pe(M);
              return;
            }
            if (L._config?.isValidConnection && !L._config.isValidConnection(v)) {
              B("connection", "Click-to-connect rejected (custom validator)", v), Ne(M, v), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), M && Pe(M);
              return;
            }
            const R = L._config?.connectValidator;
            if (R && M) {
              const V = L._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: $, targetEl: S } = xo(M, v);
              L._connectValidating = !0;
              let N;
              try {
                N = await bo(
                  R,
                  v,
                  $,
                  S,
                  M,
                  V
                );
              } finally {
                L._connectValidating = !1;
              }
              if (!N.allowed) {
                B("connection", "Click-to-connect rejected (async connectValidator)", { connection: v, reason: N.reason }), Ne(M, { ...v, reason: N.reason }), L._emit("connect-end", { connection: null, ...w }), L.pendingConnection = null, L._container?.classList.remove("flow-connecting"), Pe(M);
                return;
              }
            }
            const z = `e-${v.source}-${v.target}-${Date.now()}-${fn++}`;
            L.addEdges({ id: z, ...v }), B("connection", `Click-to-connect: ${v.source} → ${v.target}`, v), L._emit("connect", { connection: v }), L._emit("connect-end", { connection: v, ...w });
          } else {
            B("connection", "Click-to-connect rejected (invalid)", v);
            const M = e.closest(".flow-container");
            Ne(M, v), L._emit("connect-end", { connection: null, ...w });
          }
          L.pendingConnection = null, L._container?.classList.remove("flow-connecting");
          const I = e.closest(".flow-container");
          I && Pe(I);
        };
        e.addEventListener("click", b);
        const T = (D) => {
          aa(e, _(), D);
        };
        ms(k) && e.addEventListener("pointerdown", T), a(() => {
          ft.get(e)?.(), ft.delete(e), x?.(), e.removeEventListener("pointerdown", T), e.removeEventListener("pointerenter", C), e.removeEventListener("pointerleave", E), e.removeEventListener("click", b), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
function ys(t, e) {
  const n = (o) => {
    const r = o.target?.closest?.("[data-flow-handle-type]");
    r && t.contains(r) && (e?._container && r.closest(".flow-container") !== e._container || Uf(r, e, o));
  };
  return t.addEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", n, !0);
}
const ws = {
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
function Zf(t) {
  if (!t) return { ...ws };
  const e = { ...ws };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ge(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Kf(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function mt(t, e) {
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
function Jf(t, e, n = {}) {
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
const oi = 20, Hn = oi + 1, la = 1, ca = 0.5, Qf = `b${la}d${ca}`;
function vs(t) {
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
function _s(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function eh(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function da(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function ua(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function th(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const a = Array.from(r).sort((u, f) => u - f), l = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of a)
    for (const f of l) {
      let h = !1;
      for (const p of i)
        if (eh(u, f, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class nh {
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
function oh(t, e) {
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
      ua(a.x, a.y, l.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, a) => s.x - a.x);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      da(a.x, l.x, a.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  return n;
}
function ih(t, e, n, o) {
  const i = n.length, r = 2 * i, s = new Float64Array(r).fill(1 / 0), a = new Float64Array(r).fill(1 / 0), l = new Int32Array(r).fill(-1), c = new Uint8Array(r), d = oh(n, o), u = Math.min(t.x, e.x), f = Math.max(t.x, e.x), h = Math.min(t.y, e.y), p = Math.max(t.y, e.y), g = (b) => Math.max(0, u - b.x) + Math.max(0, b.x - f) + Math.max(0, h - b.y) + Math.max(0, b.y - p), m = (b, T) => s[b] < s[T] || s[b] === s[T] && a[b] < a[T], y = new nh(m);
  for (let b = 0; b < 2; b++) {
    const T = b * i + t.index;
    s[T] = 0, a[T] = 0, y.push(T);
  }
  const _ = (b) => b % i, k = (b) => b < i ? 0 : 1;
  let x = -1;
  for (; y.size > 0; ) {
    const b = y.pop();
    if (c[b]) continue;
    c[b] = 1;
    const T = _(b);
    if (T === e.index) {
      x = b;
      break;
    }
    const D = k(b), L = n[T];
    for (const A of d[T]) {
      const P = n[A], v = L.x === P.x ? 1 : 0, w = v * i + A;
      if (c[w]) continue;
      const I = Math.abs(P.x - L.x) + Math.abs(P.y - L.y), R = la * (D === v ? 0 : 1) + ca * g(P), z = s[b] + I, V = a[b] + R;
      (z < s[w] || z === s[w] && V < a[w]) && (s[w] = z, a[w] = V, l[w] = b, y.push(w));
    }
  }
  if (x === -1) {
    const b = e.index, T = i + e.index;
    if (s[b] === 1 / 0 && s[T] === 1 / 0) return null;
    x = m(b, T) ? b : T;
  }
  const C = [];
  let E = x;
  for (; E !== -1; )
    C.unshift(n[_(E)]), E = l[E];
  return C;
}
function sh(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function rh(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${jt(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ah(t) {
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
const ht = 200;
function lh(t, e, n, o, i) {
  const r = Math.min(t, n) - ht, s = Math.max(t, n) + ht, a = Math.min(e, o) - ht, l = Math.max(e, o) + ht;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < l && c.y + c.height > a
  );
}
function ch(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (ua(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && da(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function dh(t, e, n, o, i, r, s) {
  const a = vs(n), l = vs(r), c = t + a.x * Hn, d = e + a.y * Hn, u = o + l.x * Hn, f = i + l.y * Hn, h = (_) => {
    const k = _.map((D) => _s(D, oi)), x = th(c, d, u, f, k);
    x.length;
    const C = x.find((D) => D.x === c && D.y === d), E = x.find((D) => D.x === u && D.y === f);
    C || x.push({ x: c, y: d, index: x.length }), E || x.push({ x: u, y: f, index: x.length });
    const b = C ?? x[x.length - (E ? 1 : 2)], T = E ?? x[x.length - 1];
    return ih(b, T, x, k);
  }, p = lh(t, e, o, i, s), g = p.length < s.length;
  let m = h(p);
  if (g) {
    const _ = s.map((x) => _s(x, oi));
    (!(m !== null && m.length >= 2) || ch(m, _)) && (m = h(s));
  }
  if (!m || m.length < 2) return null;
  const y = [
    { x: t, y: e, index: -1 },
    ...m,
    { x: o, y: i, index: -2 }
  ];
  return sh(y);
}
const uh = 512, lt = /* @__PURE__ */ new Map();
function fh(t, e, n, o, i, r, s) {
  let a = `${Qf}|${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const l of s)
    a += `|${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.width)},${Math.round(l.height)}`;
  return a;
}
function fa(t, e, n, o, i, r, s) {
  const a = fh(t, e, n, o, i, r, s);
  if (lt.has(a)) {
    const c = lt.get(a);
    return lt.delete(a), lt.set(a, c), c;
  }
  const l = dh(t, e, n, o, i, r, s);
  return lt.set(a, l), lt.size > uh && lt.delete(lt.keys().next().value), l;
}
function hh({
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
    return bn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const l = fa(t, e, n, o, i, r, s);
  if (!l)
    return bn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const c = rh(l, a), { x: d, y: u, offsetX: f, offsetY: h } = ah(l);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
const bs = 5;
function so(t) {
  return t ? t === !0 ? bs : t.spacing ?? bs : null;
}
function xs(t, e, n, o) {
  if (e <= 1) return 0;
  const r = Math.min((e - 1) * o, Math.max(0, n)) / (e - 1);
  return (t - (e - 1) / 2) * r;
}
function Es(t, e, n) {
  return e === "left" || e === "right" ? { x: t.x, y: t.y + n } : { x: t.x + n, y: t.y };
}
const Cs = 20;
function ha(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function gh(t, e) {
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
function ii(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const a = s.nodeOrigin ?? n ?? [0, 0], l = s.dimensions?.width ?? ve, c = s.dimensions?.height ?? be;
    o += s.position.x - l * a[0], i += s.position.y - c * a[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function yt(t, e, n) {
  if (!t.parentId)
    return t;
  const o = ii(t, e, n);
  return { ...t, position: o };
}
function ro(t, e, n) {
  return t.map((o) => yt(o, e, n));
}
function wt(t, e) {
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
function Mt(t) {
  const e = ha(t), n = [], o = /* @__PURE__ */ new Set();
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
function ga(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? ga(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function pa(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function To(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Fn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ve, height: be };
  return pa(t, o, i);
}
function ph(t, e, n) {
  const o = t.x + e.width + Cs, i = t.y + e.height + Cs, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function Ss(t, e, n) {
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
function mh(t, e, n) {
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
function yh(t, e, n) {
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
function wh(t, e, n) {
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
function vh(t, e, n) {
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
function _h(t, e, n) {
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
function bh(t, e, n) {
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
function xh(t, e, n) {
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
const ma = {
  circle: { perimeterPoint: mh },
  diamond: { perimeterPoint: yh },
  hexagon: { perimeterPoint: wh },
  parallelogram: { perimeterPoint: vh },
  triangle: { perimeterPoint: _h },
  cylinder: { perimeterPoint: bh },
  stadium: { perimeterPoint: xh }
};
function ya(t, e = "light") {
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
const No = "__alpineflow_collab_store__";
function Eh() {
  return typeof globalThis < "u" ? (globalThis[No] || (globalThis[No] = /* @__PURE__ */ new WeakMap()), globalThis[No]) : /* @__PURE__ */ new WeakMap();
}
const He = Eh(), Ao = "__alpineflow_registry__";
function wa() {
  return typeof globalThis < "u" ? (globalThis[Ao] || (globalThis[Ao] = /* @__PURE__ */ new Map()), globalThis[Ao]) : /* @__PURE__ */ new Map();
}
function Ht(t) {
  return wa().get(t);
}
function Ch(t, e) {
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
const Sh = 1e3;
class kh {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Ch, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Sh);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Lh {
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
const Ph = {
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
}, Mh = {
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
}, Th = {
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
}, ks = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Nh(t, e) {
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
    const r = ks[o.style] ?? ks.info, s = o.duration ?? 1500, a = Math.floor(s * 0.6), l = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
      const u = i[d], f = i[d + 1], h = t.edges.find((p) => p.source === u && p.target === f);
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
function Ah(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const $h = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Ih = 150;
function Dh(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function Rh(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = Ah(o), s = t[r], a = (l) => {
      let c;
      typeof s == "function" && (c = s(l));
      const d = Ph[o], u = d ? d(l) : [l], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = $h.has(o) ? Dh(a, Ih) : a;
  }
}
function Hh(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(Mh)) {
    const r = e.on(o, (s) => {
      const a = t[i];
      if (typeof a != "function") return;
      const l = Th[o], c = l ? l(s) : Object.values(s);
      a.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Fh = 5;
function Oh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const a = /* @__PURE__ */ new Set();
  function l() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Fh && !o.has(c) && (o.add(c), console.warn(
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
function zh(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Vh(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function hn(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function va(t, e, n, o) {
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
function Ls(t, e, n) {
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
function Gt(t, e) {
  const n = Kt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? be
  };
}
function _a(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Bh(t, e, n = !0) {
  const o = Gt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Gt(i);
    return n ? _a(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function qh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Gt(t), i = Gt(e);
  return n ? _a(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function Xh(t, e, n, o, i = 5) {
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
function Yh(t) {
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
              ], p = va(f, d, h, u);
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
        const d = Mt(t.nodes);
        t.nodes.splice(0, t.nodes.length, ...d);
      }
      t._rebuildNodeMap();
      for (const d of o)
        if (d.childLayout) {
          const u = t._nodeMap.get(d.id);
          u && t._installChildLayoutWatchers(u);
        }
      t._emit("nodes-change", { type: "add", nodes: o });
      const a = t._container ? He.get(t._container) : void 0;
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
          (y) => y.parentId === f.parentId
        ), m = ao(p, f, g, h);
        m.valid || (o.add(u), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: p,
          child: f,
          operation: "remove",
          rule: m.rule,
          message: m.message
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
        for (const f of wt(u, t.nodes))
          n.add(f);
      B("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = Hf(n, t.nodes, t.edges));
      const a = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (a.push(u.id), !1) : !0), s.length && (t.edges.push(...s), B("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u), t._draggingNodeIds?.delete(u);
      for (const u of a)
        t._edgeDirtyTicks?.delete(u), t._edgeCorridors?.delete(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const l = t._container ? He.get(t._container) : void 0;
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
      return ti(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return If(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return $f(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return Rf(e, n, t.edges, o);
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
      return o ? Bh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : qh(i, r, o);
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
function Wh(t) {
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
      const n = t._config.defaultEdgeOptions, o = t._config.connectionRules, i = (Array.isArray(e) ? e : [e]).map((a) => n ? { ...n, ...a } : a).filter((a) => {
        if (!o) return !0;
        const l = { source: a.source, sourceHandle: a.sourceHandle, target: a.target, targetHandle: a.targetHandle };
        return gt(l, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), B("edge", `Adding ${i.length} edge(s)`, i.map((a) => a.id)), t.edges.push(...i), t._rebuildEdgeMap();
      const r = t._computeEndpointGrouping();
      r.size > 0 && t._markEdgesDirtyById(r), t._emit("edges-change", { type: "add", edges: i });
      const s = t._container ? He.get(t._container) : void 0;
      if (s?.bridge)
        for (const a of i)
          s.bridge.pushLocalEdgeAdd(a);
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
      const o = t.edges.filter((s) => n.has(s.id));
      t.edges = t.edges.filter((s) => !n.has(s.id)), t._rebuildEdgeMap();
      for (const s of n)
        t.selectedEdges.delete(s), t._edgeDirtyTicks?.delete(s), t._edgeCorridors?.delete(s);
      const i = t._computeEndpointGrouping();
      i.size > 0 && t._markEdgesDirtyById(i), o.length && t._emit("edges-change", { type: "remove", edges: o });
      const r = t._container ? He.get(t._container) : void 0;
      if (r?.bridge)
        for (const s of n)
          r.bridge.pushLocalEdgeRemove(s);
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
function jh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Vr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Qu(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Wt(ro(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = Qn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Qo
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Wt(ro(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? Qn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Qo
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * ts, o);
      B("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / ts, o);
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
let Et = null;
const Uh = 20;
function si(t) {
  return JSON.parse(JSON.stringify(t));
}
function Ps(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function ba(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return Et = {
    nodes: si(n),
    edges: si(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function Gh() {
  if (!Et || Et.nodes.length === 0) return null;
  Et.pasteCount++;
  const t = Et.pasteCount * Uh, e = /* @__PURE__ */ new Map(), n = Et.nodes.map((i) => {
    const r = Ps(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: si(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = Et.edges.map((i) => ({
    ...i,
    id: Ps(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function Zh(t, e) {
  const n = ba(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function Kh(t) {
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
        return c ? Vf(c) : !1;
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
        ), f = ao(d, l, u, c);
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
      const e = ba(t.nodes, t.edges);
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
      const e = Gh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Mt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
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
      const e = Zh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), B("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Jh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function lo(t, e, n = {}) {
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
      l === "id" || l === "__proto__" || l === "constructor" || l === "prototype" || Jh(a[l], c) || (a[l] = c);
    r.push(a);
  }
  return r;
}
function Ms(t, e, n) {
  const o = lo(t.nodes, Mt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = lo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), B("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function Qh(t) {
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
        const n = Mt(
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
      e && Ms(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && Ms(t, e, "redo");
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
function eg(t, e) {
  return t * (1 - e);
}
function tg(t, e) {
  return t * e;
}
function ng(t, e) {
  return e === "in" ? t : 1 - t;
}
function og(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? eg(o, e) : tg(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function ig(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function sg(t, e, n) {
  t.style.opacity = String(ng(e, n));
}
function rg(t) {
  t.style.removeProperty("opacity");
}
const ot = Math.PI * 2, rn = /* @__PURE__ */ new Map(), ag = 64;
function ki(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = rn.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (rn.size >= ag) {
    const r = rn.keys().next().value;
    r !== void 0 && rn.delete(r);
  }
  return rn.set(t, i), i;
}
function Zy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(ot * l * a + o * ot),
    y: n + s * Math.sin(ot * l * a + o * ot)
  });
}
function Ky(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), u = d > 0 ? l / d : 1, h = -(d > 0 ? c / d : 0), p = u;
  return (g) => {
    const m = e + l * g, y = n + c * g, _ = r * Math.sin(ot * s * g + a * ot);
    return { x: m + h * _, y: y + p * _ };
  };
}
function Jy(t, e) {
  const n = ki(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function Qy(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(ot * a + r * ot);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function ew(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * ot, f = (Math.sin(s * u) + Math.sin(a * u * 1.3)) / 2, h = (Math.sin(l * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function tw(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let Ts = !1;
function _e(t) {
  try {
    return structuredClone(t);
  } catch {
    return Ts || (Ts = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function lg(t) {
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
function cg(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function dg(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = _e(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Li {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Yr();
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
    const o = new Li(this._canvas, this._engine);
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
    return Wr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, lg(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, cg(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && dg(o, n);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = no(e.easing), a = this._makeContext(n, e.id);
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
        const D = this._subTimelines.indexOf(T);
        D >= 0 && this._subTimelines.splice(D, 1);
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
    let y = null, _ = null;
    m && this._canvas.viewport && (y = { ...this._canvas.viewport }, _ = this._resolveTargetViewport(e));
    const k = e.edgeTransition ?? "none", x = e.addEdges?.map((T) => T.id) ?? [], C = e.removeEdges?.filter((T) => this._canvas.getEdge(T)).slice() ?? [], E = {
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
      viewportTarget: _,
      transition: k,
      addEdgeIds: x,
      removeEdgeIds: C
    };
    if (i === 0)
      return this._executeInstantStep(E);
    const b = this._prepareAnimatedEdges(e, k, x);
    return b && await b, p ? this._executeFollowPathStep(E) : this._executeAnimatedStep(E);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, _n(s.style)));
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
    const n = ki(e.followPath);
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
      guidePathEl: _
    } = e, k = e.resolvedPathFn;
    return new Promise((x) => {
      const C = this._engine.register((E) => {
        if (this._state === "stopped")
          return x(), !0;
        const b = Math.min(E / i, 1), T = s(b);
        if (a) {
          const D = k(T);
          for (const L of a) {
            const A = this._canvas.getNode(L);
            A && (A.position.x = D.x, A.position.y = D.y);
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
        ), this._tickEdgeTransitions(g, m, y, T), n.onProgress?.(b, o), b >= 1 ? (this._cleanupEdgeTransitions(g, m, y), y.length && this._removeEdges(y), this._applyStepInstant(n), _ && n.guidePath?.autoRemove !== !1 && _.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), x(), !0) : !1;
      }, r);
      this._activeHandles.push(C);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, a, l, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = it(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = it(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = _n(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), p = s.get(f);
        h && p && (h.style = jr(p, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 ? f.strokeWidth = it(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = xi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = ff(c, d, n, {
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
          onProgress: (_) => {
            if (this._state === "stopped") {
              y.stop(), p();
              return;
            }
            this._tickEdgeTransitions(d, u, f, _), n.onProgress?.(_, o);
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
      r && og(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && ig(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && sg(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && rg(o);
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
    const i = Wt(o), r = e.fitViewPadding ?? 0.1;
    return Qn(
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
    const r = n.dimensions?.width ?? ve, s = n.dimensions?.height ?? be, a = n.position.x + r / 2, l = n.position.y + s / 2;
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
const xa = /* @__PURE__ */ new Map();
function Jt(t, e) {
  xa.set(t, e);
}
function ug(t) {
  return xa.get(t);
}
const Fe = "http://www.w3.org/2000/svg", fg = {
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
}, hg = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Fe, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Fe, "circle");
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
let gg = 0;
const pg = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++gg}`, e.class)
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
          const m = document.createElementNS(Fe, "defs");
          u = document.createElementNS(Fe, "linearGradient"), u.setAttribute("id", a), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const y of s) {
            const _ = document.createElementNS(Fe, "stop");
            _.setAttribute("offset", String(y.offset)), _.setAttribute("stop-color", y.color), y.opacity !== void 0 && _.setAttribute("stop-opacity", String(y.opacity)), u.appendChild(_);
          }
          m.appendChild(u), n.appendChild(m), g = `url(#${a})`, n.__gradient = u;
        }
        d = document.createElementNS(Fe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), u) {
        const g = Math.max(0, Math.min(e.pathLength, h)), m = Math.max(0, Math.min(e.pathLength, h - o)), y = e.pathEl.getPointAtLength(g), _ = e.pathEl.getPointAtLength(m);
        u.setAttribute("x1", String(_.x)), u.setAttribute("y1", String(_.y)), u.setAttribute("x2", String(y.x)), u.setAttribute("y2", String(y.y));
      }
      return;
    }
    let l = n.__fallbackRect;
    l || (l = document.createElementNS(Fe, "rect"), l.setAttribute("width", String(o)), l.setAttribute("height", String(i)), l.setAttribute("rx", String(i / 2)), l.setAttribute("fill", r), l.setAttribute("opacity", "0.8"), n.appendChild(l), n.__fallbackRect = l);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    l.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, mg = {
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
}, yg = {
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
Jt("circle", fg);
Jt("orb", hg);
Jt("beam", pg);
Jt("pulse", mg);
Jt("image", yg);
let Ns = !1;
function wg(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function As(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : wg(o);
}
function vg(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = ug(a);
    if (!l) {
      B("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    a === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !Ns && (Ns = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? vn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = As(r, h, f), g = { ...r, size: d, color: u }, m = l.create(i, g), y = o.getPointAtLength(0), _ = {
      x: y.x,
      y: y.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    l.update(m, _);
    let k;
    const x = new Promise((D) => {
      k = D;
    }), C = () => {
      typeof r.onComplete == "function" && r.onComplete(), k();
    }, E = s.wrapOnComplete ? s.wrapOnComplete(C) : C, b = {
      element: m,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: E,
      currentPosition: { x: y.x, y: y.y }
    };
    return t._activeParticles.add(b), t._particleEngineHandle || (t._particleEngineHandle = to.register((D) => t._tickParticles(D))), {
      getCurrentPosition() {
        return t._activeParticles.has(b) ? { ...b.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(b) && (b.renderer.destroy(b.element), t._activeParticles.delete(b), E());
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
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? vn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(a, c, i, {
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
        const h = Math.max(...f.map((g) => g.length)), p = As(l, h, "2s");
        for (const { id: g, length: m } of f) {
          const y = m / h, _ = p * y, k = p - _;
          if (k <= 0) {
            const x = this.sendParticle(g, { ...l, duration: _ });
            x && c.push(x);
          } else {
            const x = setTimeout(() => {
              const C = this.sendParticle(g, { ...l, duration: _ });
              C && c.push(C);
            }, k);
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
class _g {
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
const ri = 1, ai = 1 / 60;
class dn {
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
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Kr(r) ?? void 0 : void 0, a = {
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
      e._easingFn = no(e.easing);
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
      e._easingFn = no(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
      const a = e._from[s], l = this._getTargetValue(s, e.targets) ?? a, c = it(a, l, r);
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
            Ur(r, o, n);
            break;
          case "decay":
            Ei(r, o, n);
            break;
          case "inertia":
            Gr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            Zr(r, s, l, i), l >= 1 && (r.settled = !0);
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
const Ea = /* @__PURE__ */ new Map();
function Pi(t, e) {
  Ea.set(t, e);
}
function bg(t) {
  return Ea.get(t);
}
function Mi(t, e = 20) {
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
function Ca(t) {
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
const xg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Mi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += Ca(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Eg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Mi(t.nodes);
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
}, Cg = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = Mi(t.nodes);
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
    u += Ca(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, p = f.position?.y ?? 0, g = f.dimensions?.width ?? 150, m = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
Pi("faithful", xg);
Pi("outline", Eg);
Pi("activity", Cg);
function li(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function ci(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Sg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Sa(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Sa(t[e]);
  }
  return t;
}
class Ti {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Sa(_e(e.initialState)), this.events = Object.freeze(_e(e.events)), this.checkpoints = Object.freeze(_e(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
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
    if (e.version > ri)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${ri}). Please update AlpineFlow to replay this recording.`
      );
    return new Ti(e);
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
      const i = Sg(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new dn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const a = ai * 1e3;
    let l = o ? li(r, i) : ci(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = bg(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class kg {
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
      version: ri,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Ti(i);
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
class Lg {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new dn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = $o(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new dn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new dn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const a = ai * 1e3;
    let l = n ? li(r, i) : ci(r, i);
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
    const e = $o(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new dn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = ai * 1e3;
    let a = e === 0 ? ci(i, 0) : li(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = $o(), this._scheduleTick();
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
function $o() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Pg(t) {
  const e = vg(t);
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
      const n = new Li(t, to);
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
          const _ = (g._duration ?? i) === 0;
          if (g.followPath && !_) {
            let k = null;
            typeof g.followPath == "function" ? k = g.followPath : k = ki(g.followPath);
            let x = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const C = t.getEdgeSvgElement?.();
              C && (x = document.createElementNS("http://www.w3.org/2000/svg", "path"), x.setAttribute("d", g.followPath), x.classList.add("flow-guide-path"), g.guidePath.class && x.classList.add(g.guidePath.class), C.appendChild(x));
            }
            if (k) {
              const C = k, E = x, b = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${p}:followPath`,
                from: 0,
                to: 1,
                apply: (T) => {
                  const D = t._nodeMap.get(p);
                  if (!D) return;
                  const L = C(T);
                  ke().raw(D).position.x = L.x, ke().raw(D).position.y = L.y, s.add(p), T >= 1 && E && b && E.remove();
                }
              });
            }
          } else if (g.position) {
            const x = ke().raw(m).position;
            if (g.position.x !== void 0) {
              const C = g.position.x;
              if (_)
                x.x = C;
              else {
                const E = x.x;
                r.push({
                  key: `node:${p}:position.x`,
                  from: E,
                  to: C,
                  apply: (b) => {
                    const T = t._nodeMap.get(p);
                    T && (ke().raw(T).position.x = b, s.add(p));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const C = g.position.y;
              if (_)
                x.y = C;
              else {
                const E = x.y;
                r.push({
                  key: `node:${p}:position.y`,
                  from: E,
                  to: C,
                  apply: (b) => {
                    const T = t._nodeMap.get(p);
                    T && (ke().raw(T).position.y = b), s.add(p);
                  }
                });
              }
            }
            _ && s.add(p);
          }
          if (g.data !== void 0 && Object.assign(m.data, g.data), g.class !== void 0 && (m.class = g.class), g.selected !== void 0 && (m.selected = g.selected), g.zIndex !== void 0 && (m.zIndex = g.zIndex), g.style !== void 0)
            if (_)
              m.style = g.style, a.add(p);
            else {
              const k = _n(m.style || {}), x = _n(g.style), C = t._nodeElements.get(p);
              if (C) {
                const E = getComputedStyle(C);
                for (const b of Object.keys(x))
                  k[b] === void 0 && (k[b] = E.getPropertyValue(b));
              }
              r.push({
                key: `node:${p}:style`,
                from: 0,
                to: 1,
                apply: (E) => {
                  const b = t._nodeMap.get(p);
                  b && (ke().raw(b).style = jr(k, x, E), a.add(p));
                }
              });
            }
          g.dimensions && m.dimensions && (g.dimensions.width !== void 0 && (_ ? m.dimensions.width = g.dimensions.width : r.push({
            key: `node:${p}:dimensions.width`,
            from: m.dimensions.width,
            to: g.dimensions.width,
            apply: (k) => {
              m.dimensions.width = k;
            }
          })), g.dimensions.height !== void 0 && (m.fixedDimensions = !0, _ ? m.dimensions.height = g.dimensions.height : r.push({
            key: `node:${p}:dimensions.height`,
            from: m.dimensions.height,
            to: g.dimensions.height,
            apply: (k) => {
              m.dimensions.height = k;
            }
          })));
        }
      if (n.edges)
        for (const [p, g] of Object.entries(n.edges)) {
          const m = t._edgeMap.get(p);
          if (!m) continue;
          const _ = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              m.color = g.color;
            else if (_)
              m.color = g.color, l.add(p);
            else {
              const k = typeof m.color == "string" && m.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || bi;
              r.push({
                key: `edge:${p}:color`,
                from: k,
                to: g.color,
                apply: (x) => {
                  const C = t._edgeMap.get(p);
                  C && (ke().raw(C).color = x, l.add(p));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (_)
              m.strokeWidth = g.strokeWidth, l.add(p);
            else {
              const k = m.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${p}:strokeWidth`,
                from: k,
                to: g.strokeWidth,
                apply: (x) => {
                  const C = t._edgeMap.get(p);
                  C && (ke().raw(C).strokeWidth = x, l.add(p));
                }
              });
            }
          g.label !== void 0 && (m.label = g.label), g.animated !== void 0 && (m.animated = g.animated), g.class !== void 0 && (m.class = g.class);
        }
      if (n.viewport) {
        const p = n.viewport, m = (p._duration ?? i) === 0, y = t.viewport;
        p.pan?.x !== void 0 && (m ? y.x = p.pan.x : r.push({
          key: "viewport:pan.x",
          from: y.x,
          to: p.pan.x,
          apply: (_) => {
            y.x = _;
          }
        })), p.pan?.y !== void 0 && (m ? y.y = p.pan.y : r.push({
          key: "viewport:pan.y",
          from: y.y,
          to: p.pan.y,
          apply: (_) => {
            y.y = _;
          }
        })), p.zoom !== void 0 && (m ? y.zoom = p.zoom : r.push({
          key: "viewport:zoom",
          from: y.zoom,
          to: p.zoom,
          apply: (_) => {
            y.zoom = _;
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
      const h = ke().raw(t._animator).animate(r, {
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
              const y = ke().raw(m);
              (g.followPath || g.position?.x !== void 0) && (m.position.x = y.position.x), (g.followPath || g.position?.y !== void 0) && (m.position.y = y.position.y), g.style !== void 0 && (m.style = y.style);
            }
          if (n.edges)
            for (const [p, g] of Object.entries(n.edges)) {
              const m = t._edgeMap.get(p);
              if (!m) continue;
              const y = ke().raw(m);
              g.color !== void 0 && typeof g.color == "string" && (m.color = y.color), g.strokeWidth !== void 0 && (m.strokeWidth = y.strokeWidth);
            }
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), c(s), s.clear()), a.size > 0 && (t._flushNodeStyles(a), a.clear()), l.size > 0 && (t._flushEdgeStyles(l), l.clear()), o.onComplete?.();
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
      const i = Wr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const a = o.zoom, l = to.register(() => {
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
            const _ = y.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            y.dimensions && (d.x += y.dimensions.width * (0.5 - _[0]), d.y += y.dimensions.height * (0.5 - _[1]));
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
      return new _g(n, {
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
      }, h = new kg(f, o), p = async () => {
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
      return new Lg(r, n, o);
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
      Jt(n, o);
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
function $s(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return wt(t, e);
  const r = /* @__PURE__ */ new Set(), s = ti(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = ti(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function Mg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Io(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Is(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = wt(r.id, e);
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
function Do(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Tg(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const On = { width: 150, height: 50 };
function Ng(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = $s(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = Mg(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? On, d = r && s ? s : c, u = {};
        for (const [h] of l.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? On;
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
            Io(o, t.nodes, l, s), l.reroutedEdges = Do(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Io(o, t.nodes, l, s), l.reroutedEdges = Do(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Io(o, t.nodes, l, s), l.reroutedEdges = Do(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && Tg(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? On;
        Is(o, t.nodes, i, r);
        const l = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const p = h.dimensions ?? On;
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
        Is(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return $s(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return wt(e, t.nodes).size;
    }
  };
}
function Ag(t) {
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
function $g(t) {
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
const Ig = 8, Dg = 12, Rg = 2;
function Ni(t) {
  return {
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? be
  };
}
function Hg(t) {
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
function Fg(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function Ds(t, e, n) {
  const o = e.gap ?? Ig, i = e.padding ?? Dg, r = e.headerHeight ?? 0, s = Hg(e), a = Fg(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Og(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? zg(a, o, i, r, s, u, l, c) : Vg(a, o, i, r, s, e.columns ?? Rg, d, u, l, c);
}
function Og(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Ni(f));
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
function zg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Ni(f));
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
function Vg(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), u = t.map((y) => Ni(y));
  let f = 0, h = 0;
  for (const y of u)
    f = Math.max(f, y.width), h = Math.max(h, y.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (f = p);
  const g = Math.ceil(t.length / d), m = a > 0 ? (a - (g - 1) * e) / g : 0;
  m > 0 && (h = m);
  for (let y = 0; y < t.length; y++) {
    const _ = y % d, k = Math.floor(y / d), x = n + _ * (f + e), C = n + o + k * (h + e);
    l.set(t[y].id, { x, y: C }), i === "both" ? c.set(t[y].id, { width: f, height: h }) : i === "width" ? c.set(t[y].id, { width: f, height: u[y].height }) : i === "height" && c.set(t[y].id, { width: u[y].width, height: h });
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
function Bg(t) {
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
      const u = t.nodes.find((x) => x.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((x) => x.parentId === e);
      a && (f = f.filter((x) => x.id !== a)), l && !f.some((x) => x.id === l.id) && (f = [...f, l]);
      const h = new Map(f.map((x) => [x.id, x]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const x of f)
          x.childLayout && this.layoutChildren(x.id, { excludeId: s, omitFromComputation: a, shallow: !1 });
      const p = u.childLayout, g = p.headerHeight !== void 0 ? p : u.data?.label ? { ...p, headerHeight: 30 } : p, m = Ds(f, g, d);
      for (const [x, C] of m.positions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const E = h.get(x);
        E && (E.position ? (E.position.x = C.x, E.position.y = C.y) : E.position = { x: C.x, y: C.y });
      }
      for (const [x, C] of m.dimensions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const E = h.get(x);
        if (E) {
          let b = C.width, T = C.height;
          E.minDimensions && (E.minDimensions.width != null && (b = Math.max(b, E.minDimensions.width)), E.minDimensions.height != null && (T = Math.max(T, E.minDimensions.height))), E.maxDimensions && (E.maxDimensions.width != null && (b = Math.min(b, E.maxDimensions.width)), E.maxDimensions.height != null && (T = Math.min(T, E.maxDimensions.height))), E.dimensions ? (E.dimensions.width = b, E.dimensions.height = T) : E.dimensions = { width: b, height: T }, E.childLayout && !c && this.layoutChildren(x, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: E.dimensions });
        }
      }
      let y = m.parentDimensions.width, _ = m.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (y = Math.max(y, u.minDimensions.width)), u.minDimensions.height != null && (_ = Math.max(_, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (y = Math.min(y, u.maxDimensions.width)), u.maxDimensions.height != null && (_ = Math.min(_, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = y, u.dimensions.height = _, y !== m.parentDimensions.width || _ !== m.parentDimensions.height) {
        const C = Ds(f, g, { width: y, height: _ });
        for (const [E, b] of C.positions) {
          if (E === s || l && E === l.id && !t._nodeMap.has(E)) continue;
          const T = h.get(E);
          T && (T.position ? (T.position.x = b.x, T.position.y = b.y) : T.position = { x: b.x, y: b.y });
        }
        for (const [E, b] of C.dimensions) {
          if (E === s || l && E === l.id && !t._nodeMap.has(E)) continue;
          const T = h.get(E);
          if (T) {
            let D = b.width, L = b.height;
            T.minDimensions && (T.minDimensions.width != null && (D = Math.max(D, T.minDimensions.width)), T.minDimensions.height != null && (L = Math.max(L, T.minDimensions.height))), T.maxDimensions && (T.maxDimensions.width != null && (D = Math.min(D, T.maxDimensions.width)), T.maxDimensions.height != null && (L = Math.min(L, T.maxDimensions.height))), T.dimensions ? (T.dimensions.width = D, T.dimensions.height = L) : T.dimensions = { width: D, height: L }, T.childLayout && !c && this.layoutChildren(E, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: T.dimensions });
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
      const n = Ht("layout:dagre");
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
      const n = Ht("layout:force");
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
      const n = Ht("layout:hierarchy");
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
      const n = Ht("layout:elk");
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
function qg(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return hn(n, t._config.childValidationRules ?? {});
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
        const r = hn(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((l) => l.parentId === o), a = Ls(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = hn(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = Ls(n, i, o);
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = Mt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
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
      if (!r || wt(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = va(r, o, d, s);
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
      const a = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, l = t.getAbsolutePosition(n);
      if (o.position.x = a.x - l.x, o.position.y = a.y - l.y, o.parentId = n, t.nodes = Mt(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function Xg(t) {
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
function Xn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), a = Math.sin(r), l = t - n, c = e - o;
  return {
    x: n + l * s - c * a,
    y: o + l * a + c * s
  };
}
function Yg(t) {
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
const Wg = 40;
function jg(t, e = Wg) {
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
function Ug(t) {
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
function Gg({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return io({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = fa(t, e, n, o, i, r, s);
  if (!a)
    return io({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = jg(a), { x: c, y: d, offsetX: u, offsetY: f } = Ug(a);
  return {
    path: l,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Zg(t) {
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
      c = Rs(l);
      break;
    case "step":
      c = Kg(l, 0);
      break;
    case "smoothstep":
      c = Jg(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = Yg(l.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Rs(l);
  }
  const d = Qg(l), u = Ln({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Rs(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function Kg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ka(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += jt(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ka(t, e, n) {
  const o = (t.x + e.x) / 2, i = jt(t.x, t.y, o, t.y, o, e.y, n), r = jt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Jg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ka(t[0], t[1], e);
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
    o += jt(s.x, s.y, a.x, a.y, l.x, l.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function Qg(t) {
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
function Zt(t, e, n, o) {
  const i = t.dimensions?.width ?? ve, r = t.dimensions?.height ?? be, s = Kt(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? ma[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = Ss(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = Ss(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = Xn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function Hs(t) {
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
function di(t) {
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
const ep = 1.5, tp = 5 / 20;
function Ft(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = di(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const l = (i.width ?? 12.5) * ep * tp * 0.4, c = r + l, d = di(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function co(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d, u) {
  const f = r ?? Zt(e, o, c, d), h = s ?? Zt(n, i, c, d), p = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: Hs(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Hs(i)
  }, g = t.type ?? u ?? "bezier";
  if (a?.[g])
    return a[g](p, t);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return Zg({
        ...p,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Gg({ ...p, obstacles: l });
    case "orthogonal":
      return hh({ ...p, obstacles: l });
    case "smoothstep":
      return bn(p);
    case "straight":
      return ta({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return io(p);
  }
}
function Fs(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? be, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Xn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Xn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const l = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(a);
  let f;
  d / l > u / c ? f = l / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + a * f
  };
  return t.rotation ? Xn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Os(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? be, i = t.position.x + n / 2, r = t.position.y + o / 2;
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
function La(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? be, i = e.dimensions?.width ?? ve, r = e.dimensions?.height ?? be, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = Fs(t, a), c = Fs(e, s), d = Os(t, l), u = Os(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function nw(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function Pa(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function Ma(t, e) {
  return `${t}__grad__${e}`;
}
function Ta(t, e, n, o, i, r, s) {
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
function Ro(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
function Eo(t) {
  return t.endsWith("-l") ? { field: t.slice(0, -2), side: "left" } : t.endsWith("-r") ? { field: t.slice(0, -2), side: "right" } : { field: t, side: null };
}
function np(t, e) {
  if (!Array.isArray(t)) return -1;
  const n = t.findIndex((r) => r?.name === e);
  if (n >= 0) return n;
  const { field: o, side: i } = Eo(e);
  return i === null ? -1 : t.findIndex((r) => r?.name === o);
}
function zs(t, e) {
  if (!Array.isArray(t) || !e || t.some((i) => i?.name === e)) return null;
  const { field: n, side: o } = Eo(e);
  return o === null ? null : t.some((i) => i?.name === n) ? o : null;
}
function Vs(t, e, n, o, i) {
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
const op = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function ip(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const a = r.getNode(e);
  if (a && !qe(a))
    return { applied: !1 };
  const l = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await ia({
    edge: i,
    newConnection: l,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: l }), { applied: !0, newConnection: l }) : { applied: !1, reason: d.reason, newConnection: l };
}
function sp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function Bs(t, e) {
  if (!e) return t;
  const n = di(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function qs(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function uo(t, e) {
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
function fo(t, e, n, o, i, r, s) {
  const a = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (a) {
    if (n) {
      const c = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = uo(c, r);
      if (!d) {
        const u = a.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = uo(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const { field: c, side: d } = Eo(n);
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
function Xs(t, e, n, o) {
  if (!t || !e || t.hidden || t.collapsed || t.condensed || t.rotation) return -1;
  const i = t.nodeOrigin;
  if (i && (i[0] !== 0 || i[1] !== 0) || !n?.hasAttribute("data-flow-schema-node") || n.style.display === "none") return -1;
  const r = t.dimensions?.width, s = t.dimensions?.height;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s)) return -1;
  const a = t.data?.fields;
  if (!Array.isArray(a) || a.length === 0) return -1;
  const l = o.insetTop + o.headerHeight + (a.length - 1) * o.rowHeight + o.rowHeightLast + o.insetBottom;
  return Math.abs(l - s) > 0.5 ? -1 : np(a, e);
}
function Ys(t, e, n, o, i) {
  const r = t.dimensions?.width ?? ve, s = e.x + (i.insetLeft + (r - i.insetRight)) / 2;
  return n === "source" ? o >= s ? "right" : "left" : o > s ? "right" : "left";
}
function Ws(t) {
  return t.position.x + (t.dimensions?.width ?? ve) / 2;
}
function rp(t, e, n, o, i, r, s, a) {
  const l = Xs(t, i, s?.get(t.id), a);
  if (l < 0) return null;
  const c = Xs(e, r, s?.get(e.id), a);
  if (c < 0) return null;
  const d = t.data?.fields, u = e.data?.fields, f = zs(d, i) ?? Ys(t, n.position, "source", Ws(o), a), h = zs(u, r) ?? Ys(e, o.position, "target", Ws(n), a), p = Vs(t, n.position, l, f, a), g = Vs(e, o.position, c, h, a);
  if (!p || !g) return null;
  const m = { handleWidth: a.handleWidth, handleHeight: a.handleHeight };
  return {
    sourcePos: p.position,
    targetPos: g.position,
    srcMeasurement: { x: p.x, y: p.y, ...m },
    tgtMeasurement: { x: g.x, y: g.y, ...m }
  };
}
function js(t, e, n, o, i, r, s, a, l) {
  const c = l ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const g = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = uo(g, a), !d) {
      const m = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = uo(m, a);
    }
    if (!d) {
      const { field: m, side: y } = Eo(o);
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
function ap(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function ct(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function lp(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function cp(t) {
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
      function _(S, N, F, W, Q) {
        p || (p = document.createElementNS("http://www.w3.org/2000/svg", "circle"), p.classList.add("flow-edge-dot"), p.style.pointerEvents = "none", S.appendChild(p));
        const U = F.closest(".flow-container"), G = U ? getComputedStyle(U) : null, Z = W.particleSize ?? (parseFloat(G?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), H = Q || G?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        p.setAttribute("r", String(Z)), W.particleColor ? p.style.fill = W.particleColor : p.style.removeProperty("fill");
        const q = p.querySelector("animateMotion");
        q && q.remove();
        const j = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        j.setAttribute("dur", H), j.setAttribute("repeatCount", "indefinite"), j.setAttribute("path", N), p.appendChild(j);
      }
      function k() {
        p?.remove(), p = null;
      }
      let x = null, C = null, E = null, b = null;
      const T = (S) => {
        S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: S }), mt(S, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1, B("selection", `Edge "${N.id}" deselected (shift)`)) : (F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected`)), F._emitSelectionChange());
      }, D = (S) => {
        S.preventDefault(), S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = S.target;
        if (W.classList.contains("flow-edge-control-point")) {
          const Q = parseInt(W.dataset.pointIndex ?? "", 10);
          if (!isNaN(Q)) {
            F._emit("edge-control-point-context-menu", {
              edge: N,
              pointIndex: Q,
              position: { x: S.clientX, y: S.clientY },
              event: S
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: N, event: S });
      }, L = (S) => {
        S.stopPropagation(), S.preventDefault();
        const N = o(n), F = t.$data(e.closest("[x-data]"));
        if (!N || !F || (N.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const Q = S.target;
        if (Q.classList.contains("flow-edge-control-point")) {
          const U = parseInt(Q.dataset.pointIndex ?? "", 10);
          !isNaN(U) && N.controlPoints && (F._captureHistory?.(), N.controlPoints.splice(U, 1), F._emit("edge-control-point-change", { edge: N, action: "remove", index: U }));
          return;
        }
        if (Q.classList.contains("flow-edge-midpoint")) {
          const U = parseInt(Q.dataset.segmentIndex ?? "", 10);
          if (!isNaN(U)) {
            const G = F.screenToFlowPosition(S.clientX, S.clientY);
            N.controlPoints || (N.controlPoints = []), F._captureHistory?.(), N.controlPoints.splice(U, 0, { x: G.x, y: G.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: U });
          }
          return;
        }
        if (Q.closest("path")) {
          const U = F.screenToFlowPosition(S.clientX, S.clientY);
          N.controlPoints || (N.controlPoints = []);
          const G = [
            x ?? { x: 0, y: 0 },
            ...N.controlPoints,
            C ?? { x: 0, y: 0 }
          ];
          let Z = 0, H = 1 / 0;
          for (let q = 0; q < G.length - 1; q++) {
            const j = lp(U, G[q], G[q + 1]);
            j < H && (H = j, Z = q);
          }
          F._captureHistory?.(), N.controlPoints.splice(Z, 0, { x: U.x, y: U.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: Z });
        }
      }, A = (S) => {
        const N = S.target;
        if (!N.classList.contains("flow-edge-control-point") || S.button !== 0) return;
        S.stopPropagation(), S.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const W = t.$data(e.closest("[x-data]"));
        if (!W) return;
        const Q = parseInt(N.dataset.pointIndex ?? "", 10);
        if (isNaN(Q)) return;
        N.classList.add("dragging");
        let U = !1;
        const G = (H) => {
          U || (W._captureHistory?.(), U = !0);
          let q = W.screenToFlowPosition(H.clientX, H.clientY);
          const j = W._config?.snapToGrid;
          j && (q = {
            x: Math.round(q.x / j[0]) * j[0],
            y: Math.round(q.y / j[1]) * j[1]
          }), F.controlPoints[Q] = q;
        }, Z = () => {
          document.removeEventListener("pointermove", G), document.removeEventListener("pointerup", Z), N.classList.remove("dragging"), U && W._emit("edge-control-point-change", { edge: F, action: "move", index: Q });
        };
        document.addEventListener("pointermove", G), document.addEventListener("pointerup", Z);
      };
      s.addEventListener("contextmenu", D), s.addEventListener("dblclick", L), s.addEventListener("pointerdown", A, !0);
      let P = null;
      const v = (S) => {
        if (S.button !== 0) return;
        S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = F._config?.reconnectSnapRadius ?? ns, Q = F._config?.edgesReconnectable !== !1, U = N.reconnectable ?? !0;
        let G = null;
        if (Q && U !== !1 && x && C) {
          const ie = F.screenToFlowPosition(S.clientX, S.clientY), fe = ct(ie.x, ie.y, x.x, x.y, W) || E && ct(ie.x, ie.y, E.x, E.y, W);
          (ct(ie.x, ie.y, C.x, C.y, W) || b && ct(ie.x, ie.y, b.x, b.y, W)) && (U === !0 || U === "target") ? G = "target" : fe && (U === !0 || U === "source") && (G = "source");
        }
        if (!G) {
          const ie = (fe) => {
            document.removeEventListener("pointerup", ie), T(fe);
          };
          document.addEventListener("pointerup", ie, { once: !0 });
          return;
        }
        const Z = S.clientX, H = S.clientY;
        let q = !1, j = !1, K = null;
        const O = F._config?.connectionSnapRadius ?? 20;
        let J = null, ne = null, Y = null, re = Z, se = H;
        const oe = e.closest(".flow-container");
        if (!oe) return;
        const ee = G === "target" ? x : C, te = () => {
          q = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: N, handleType: G }), B("reconnect", `Reconnection drag started on edge "${N.id}" (${G} end)`), ne = Ut({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), J = ne.svg;
          const ie = F.screenToFlowPosition(Z, H);
          ne.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: ie.x,
            toY: ie.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const fe = oe.querySelector(".flow-viewport");
          fe && fe.appendChild(J), G === "target" && (F.pendingConnection = {
            source: N.source,
            sourceHandle: N.sourceHandle,
            position: ie
          }), F._pendingReconnection = {
            edge: N,
            draggedEnd: G,
            anchorPosition: { ...ee },
            position: ie
          }, Y = _o(oe, F, re, se), G === "target" && En(oe, N.source, N.sourceHandle ?? "source", F, N.id);
        }, he = (ie) => {
          if (re = ie.clientX, se = ie.clientY, !q) {
            Math.sqrt(
              (ie.clientX - Z) ** 2 + (ie.clientY - H) ** 2
            ) >= eo && te();
            return;
          }
          const fe = F.screenToFlowPosition(ie.clientX, ie.clientY), ge = xn({
            containerEl: oe,
            handleType: G === "target" ? "target" : "source",
            excludeNodeId: G === "target" ? N.source : N.target,
            cursorFlowPos: fe,
            connectionSnapRadius: O,
            getNode: (Me) => F.getNode(Me),
            toFlowPosition: (Me, Te) => F.screenToFlowPosition(Me, Te)
          });
          ge.element !== K && (K?.classList.remove("flow-handle-active"), ge.element?.classList.add("flow-handle-active"), K = ge.element), ne?.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: ge.position.x,
            toY: ge.position.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const Ie = ge.position;
          G === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: Ie
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: Ie
          }), Y?.updatePointer(ie.clientX, ie.clientY);
        }, de = () => {
          j || (j = !0, document.removeEventListener("pointermove", he), document.removeEventListener("pointerup", ae), Y?.stop(), Y = null, ne?.destroy(), ne = null, J = null, K?.classList.remove("flow-handle-active"), P = null, s.classList.remove("flow-edge-reconnecting"), Pe(oe), F.pendingConnection = null, F._pendingReconnection = null);
        }, ae = async (ie) => {
          if (!q) {
            de(), T(ie);
            return;
          }
          if (F._connectValidating) return;
          let fe = K, ge = null;
          if (!fe) {
            ge = document.elementFromPoint(ie.clientX, ie.clientY);
            const Ee = G === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            fe = ge?.closest(Ee);
          }
          const Me = (fe ? fe.closest("[data-flow-node-id]") : ge?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Te = fe?.dataset.flowHandleId, Le = ne?.svg ?? null;
          kt(Le, !0);
          let ue;
          try {
            ue = await ip({
              dropNodeId: Me,
              dropHandleId: Te,
              draggedEnd: G,
              edge: N,
              canvas: F,
              containerEl: oe
            });
          } finally {
            kt(Le, !1);
          }
          ue.applied ? B("reconnect", `Edge "${N.id}" reconnected (${G})`, ue.newConnection) : B("reconnect", `Edge "${N.id}" reconnection cancelled — snapping back`, { reason: ue.reason }), F._emit("reconnect-end", { edge: N, successful: ue.applied }), de();
        };
        document.addEventListener("pointermove", he), document.addEventListener("pointerup", ae), P = de;
      };
      s.addEventListener("pointerdown", v);
      const w = (S) => {
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const W = F._config?.edgesReconnectable !== !1, Q = N.reconnectable ?? !0;
        if (!W || Q === !1 || !x || !C) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const U = F._config?.reconnectSnapRadius ?? ns, G = F.screenToFlowPosition(S.clientX, S.clientY), Z = (ct(G.x, G.y, x.x, x.y, U) || E && ct(G.x, G.y, E.x, E.y, U)) && (Q === !0 || Q === "source"), H = (ct(G.x, G.y, C.x, C.y, U) || b && ct(G.x, G.y, b.x, b.y, U)) && (Q === !0 || Q === "target");
        Z || H ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", w);
      const I = (S) => {
        if (S.key !== "Enter" && S.key !== " ") return;
        S.preventDefault(), S.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: S }), mt(S, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1) : (F.selectedEdges.add(N.id), N.selected = !0) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0), F._emitSelectionChange());
      };
      s.addEventListener("keydown", I);
      const M = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", M), s.addEventListener("blur", R);
      const z = (S) => {
        S.stopPropagation();
      };
      s.addEventListener("mousedown", z);
      const V = () => {
        for (const S of [c, d, u])
          S && S.classList.add("flow-edge-hovered");
      }, $ = () => {
        for (const S of [c, d, u])
          S && S.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", V), s.addEventListener("mouseleave", $), i(() => {
        const S = o(n);
        if (!S || !l) return;
        s.setAttribute("data-flow-edge-id", S.id);
        const N = t.$data(e.closest("[x-data]"));
        if (!N?.nodes) return;
        const F = S.type ?? N._config?.defaultEdgeType ?? "bezier", W = N._config?.edgeLod;
        let Q = F;
        if (W) {
          const X = N._zoomLevel;
          (W.simplifyAt === "medium" && X === "medium" || X === "far") && (Q = "straight");
        }
        N._layoutAnimTick, N._edgeDirtyTicks?.get(S.id);
        const U = N.getNode(S.source), G = N.getNode(S.target);
        if (!U || !G) return;
        U.sourcePosition, G.targetPosition;
        const Z = yt(U, N._nodeMap, N._config?.nodeOrigin), H = yt(G, N._nodeMap, N._config?.nodeOrigin), q = e.closest("[x-data]");
        let j, K, O, J;
        const ne = N._schemaMetrics, Y = N._config?.nodeOrigin, re = F !== "floating" && N._config?.schemaHandleGeometry !== "dom" && ne && (!Y || Y[0] === 0 && Y[1] === 0) ? rp(
          U,
          G,
          Z,
          H,
          S.sourceHandle,
          S.targetHandle,
          N._nodeElements,
          ne
        ) : null;
        if (F === "floating") {
          const X = La(Z, H);
          j = X.sourcePos, K = X.targetPos, O = { x: X.sx, y: X.sy, handleWidth: 0, handleHeight: 0 }, J = { x: X.tx, y: X.ty, handleWidth: 0, handleHeight: 0 }, x = { x: X.sx, y: X.sy }, C = { x: X.tx, y: X.ty };
        } else if (re)
          j = re.sourcePos, K = re.targetPos, O = re.srcMeasurement, J = re.tgtMeasurement, x = { x: O.x, y: O.y }, C = { x: J.x, y: J.y };
        else {
          const X = N._nodeElements?.get(S.source) ?? q.querySelector(`[data-flow-node-id="${CSS.escape(S.source)}"]`), le = N._nodeElements?.get(S.target) ?? q.querySelector(`[data-flow-node-id="${CSS.escape(S.target)}"]`), pe = X ? qs(X.getBoundingClientRect()) : void 0, we = le ? qs(le.getBoundingClientRect()) : void 0;
          j = fo(q, S.source, S.sourceHandle, "source", U, we, X), K = fo(q, S.target, S.targetHandle, "target", G, pe, le);
          const me = t.raw(N).viewport ?? { x: 0, y: 0, zoom: 1 }, ce = me.zoom || 1, ye = U.rotation, Se = G.rotation;
          j = Bs(j, ye), K = Bs(K, Se), O = js(q, S.source, Z, S.sourceHandle, "source", ce, me, we, X), J = js(q, S.target, H, S.targetHandle, "target", ce, me, pe, le);
          const De = Zt(Z, j, N._shapeRegistry, N._config?.nodeOrigin), xe = Zt(H, K, N._shapeRegistry, N._config?.nodeOrigin);
          x = O ?? De, C = J ?? xe;
        }
        let se = Ft(O ?? x, j, O, S.markerStart), oe = Ft(J ?? C, K, J, S.markerEnd);
        if (F === "orthogonal" || F === "avoidant") {
          const X = t.raw(N._endpointSpreadGrouping);
          if (X) {
            const le = so(U.endpointSpread ?? N._config?.avoidantEndpointSpread);
            if (le !== null) {
              const we = X.get(`${S.source}|${S.sourceHandle ?? ""}`), me = we?.lanes.get(S.id);
              if (we && me !== void 0 && we.count > 1) {
                const ce = N._schemaMetrics?.rowHeight ?? O?.handleHeight ?? 0;
                se = Es(se, j, xs(me, we.count, ce, le));
              }
            }
            const pe = so(G.endpointSpread ?? N._config?.avoidantEndpointSpread);
            if (pe !== null) {
              const we = X.get(`${S.target}|${S.targetHandle ?? ""}`), me = we?.lanes.get(S.id);
              if (we && me !== void 0 && we.count > 1) {
                const ce = N._schemaMetrics?.rowHeight ?? J?.handleHeight ?? 0;
                oe = Es(oe, K, xs(me, we.count, ce, pe));
              }
            }
          }
        }
        E = se, b = oe;
        let ee;
        if (F === "orthogonal" || F === "avoidant")
          if (N._config?.avoidantSimplifyOnDrag !== !1 && (N._draggingNodeIds?.has(S.source) || N._draggingNodeIds?.has(S.target)))
            ee = void 0;
          else {
            const le = t.raw(N._obstacleSnapshot);
            if (le)
              ee = le.filter((pe) => pe.id !== S.source && pe.id !== S.target);
            else {
              const pe = t.raw(N.nodes), we = new Map(pe.map((ce) => [ce.id, ce])), me = N._config?.nodeOrigin;
              ee = pe.filter((ce) => ce.id !== S.source && ce.id !== S.target).map((ce) => {
                const ye = yt(ce, we, me);
                return {
                  x: ye.position.x,
                  y: ye.position.y,
                  width: ye.dimensions?.width ?? ve,
                  height: ye.dimensions?.height ?? be
                };
              });
            }
          }
        const te = Q === F ? S : { ...S, type: Q }, { path: he, labelPosition: de } = co(te, Z, H, j, K, se, oe, N._config?.edgeTypes, ee, N._shapeRegistry, N._config?.nodeOrigin, N._config?.defaultEdgeType);
        l.setAttribute("d", he), a.setAttribute("d", he), (F === "orthogonal" || F === "avoidant") && t.raw(N._edgeCorridors)?.set(S.id, {
          minX: Math.min(se.x, oe.x),
          minY: Math.min(se.y, oe.y),
          maxX: Math.max(se.x, oe.x),
          maxY: Math.max(se.y, oe.y)
        });
        const ae = F === "editable", ie = ae && (S.showControlPoints || S.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((X) => X.remove()), ie) {
          const X = S.controlPoints ?? [], le = N.viewport?.zoom ?? 1, pe = 6 / le, we = 5 / le, me = x ?? { x: 0, y: 0 }, ce = C ?? { x: 0, y: 0 }, ye = [me, ...X, ce], Se = ye.length - 1, De = l.getTotalLength?.() ?? 0;
          if (De > 0) {
            const xe = [0], ze = 200;
            let Tt = 1;
            for (let Ce = 1; Ce <= ze && Tt < ye.length; Ce++) {
              const Nt = Ce / ze * De, Qt = l.getPointAtLength(Nt), Ue = ye[Tt], en = Qt.x - Ue.x, Ri = Qt.y - Ue.y;
              en * en + Ri * Ri < 25 && (xe.push(Nt), Tt++);
            }
            for (; xe.length <= Se; )
              xe.push(De);
            for (let Ce = 0; Ce < Se; Ce++) {
              const Nt = (xe[Ce] + xe[Ce + 1]) / 2, Qt = l.getPointAtLength(Nt), Ue = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              Ue.classList.add("flow-edge-midpoint"), Ue.setAttribute("cx", String(Qt.x)), Ue.setAttribute("cy", String(Qt.y)), Ue.setAttribute("r", String(we)), Ue.dataset.segmentIndex = String(Ce);
              const en = document.createElementNS("http://www.w3.org/2000/svg", "title");
              en.textContent = "Double-click to add control point", Ue.appendChild(en), s.appendChild(Ue);
            }
          }
          for (let xe = 0; xe < X.length; xe++) {
            const ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ze.classList.add("flow-edge-control-point"), ze.setAttribute("cx", String(X[xe].x)), ze.setAttribute("cy", String(X[xe].y)), ze.setAttribute("r", String(pe)), ze.dataset.pointIndex = String(xe), s.appendChild(ze);
          }
        }
        if (a.style.cursor = ae ? "crosshair" : "pointer", a.style.strokeWidth = String(
          S.interactionWidth ?? N._config?.defaultInteractionWidth ?? 20
        ), S.markerStart != null) {
          const X = Vt(S.markerStart), le = Bt(X, N._id);
          l.setAttribute("marker-start", `url(#${le})`);
        } else if (S._renderDualMarker && S.markerEnd) {
          const X = Vt(S.markerEnd), le = Bt(X, N._id);
          l.setAttribute("marker-start", `url(#${le})`);
        } else
          l.removeAttribute("marker-start");
        if (S.markerEnd) {
          const X = Vt(S.markerEnd), le = Bt(X, N._id);
          l.setAttribute("marker-end", `url(#${le})`);
        } else
          l.removeAttribute("marker-end");
        const fe = S.strokeWidth ?? 1.5, ge = sp(S.animated);
        switch (ge !== g && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), g === "dot" && k(), g = ge), ge) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            _(s, he, q, S, S.animationDuration);
            break;
        }
        if (S.animationDuration && ge !== "none" ? (ge === "dash" || ge === "pulse") && (l.style.animationDuration = S.animationDuration) : (ge === "dash" || ge === "pulse") && l.style.removeProperty("animation-duration"), y && y !== S.class && s.classList.remove(...y.split(" ").filter(Boolean)), S.class) {
          const X = ge === "dash" ? " flow-edge-animated" : ge === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", S.class + X), s.classList.add(...S.class.split(" ").filter(Boolean)), y = S.class;
        } else
          y && (s.classList.remove(...y.split(" ").filter(Boolean)), y = null);
        if (s.setAttribute("aria-selected", String(!!S.selected)), S.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(fe + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + vn + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(fe);
          const X = N._markerDefsEl?.querySelector("defs") ?? null;
          if (Pa(S.color)) {
            if (X) {
              const le = Ma(N._id, S.id), pe = S.gradientDirection === "target-source", we = x.x, me = x.y, ce = C.x, ye = C.y;
              Ta(
                X,
                le,
                pe ? { from: S.color.to, to: S.color.from } : S.color,
                we,
                me,
                ce,
                ye
              ), l.style.stroke = `url(#${le})`, m = le;
            }
          } else if (S.color) {
            if (m) {
              const le = X;
              le && Ro(le, m), m = null;
            }
            l.style.stroke = S.color;
          } else {
            if (m) {
              const le = X;
              le && Ro(le, m), m = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (!S.selected && ((S.sourceHandle ? N.selectedRows?.has(S.sourceHandle.replace(/-[lr]$/, "")) : !1) || (S.targetHandle ? N.selectedRows?.has(S.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), S.selected || (l.style.strokeWidth = String(Math.max(fe + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), S.focusable ?? N._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", S.ariaRole ?? "group"), s.setAttribute("aria-label", S.ariaLabel ?? (S.label ? `Edge: ${S.label}` : `Edge from ${S.source} to ${S.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), S.domAttributes)
          for (const [X, le] of Object.entries(S.domAttributes))
            X.startsWith("on") || op.has(X.toLowerCase()) || s.setAttribute(X, le);
        const Te = (X, le, pe, we, me) => {
          if (le) {
            if (!X && we) {
              const ce = pe.includes("flow-edge-label-start"), ye = pe.includes("flow-edge-label-end");
              let Se = `[data-flow-edge-id="${me}"].flow-edge-label`;
              ce ? Se += ".flow-edge-label-start" : ye ? Se += ".flow-edge-label-end" : Se += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", X = we.querySelector(Se);
            }
            return X || (X = document.createElement("div"), X.className = pe, X.dataset.flowEdgeId = me, we && we.appendChild(X)), X.textContent = le, X;
          }
          return X && X.remove(), null;
        }, Le = e.closest(".flow-viewport"), ue = S.labelVisibility ?? "always", Ee = () => {
          const X = l.getAttribute("d") ?? "";
          return X !== f && (f = X, h = typeof l.getTotalLength == "function" && l.getTotalLength() || 0), h;
        };
        if (c = Te(c, S.label, "flow-edge-label", Le, S.id), c) {
          const X = Ee();
          if (X > 0) {
            const le = S.labelPosition ?? 0.5, pe = ap(l, le, X);
            c.style.left = `${pe.x}px`, c.style.top = `${pe.y}px`;
          } else
            c.style.left = `${de.x}px`, c.style.top = `${de.y}px`;
        }
        if (d = Te(d, S.labelStart, "flow-edge-label flow-edge-label-start", Le, S.id), d) {
          const X = Ee();
          if (X > 0) {
            const le = S.labelStartOffset ?? 30, pe = l.getPointAtLength(Math.min(le, X / 2));
            d.style.left = `${pe.x}px`, d.style.top = `${pe.y}px`;
          }
        }
        if (u = Te(u, S.labelEnd, "flow-edge-label flow-edge-label-end", Le, S.id), u) {
          const X = Ee();
          if (X > 0) {
            const le = S.labelEndOffset ?? 30, pe = l.getPointAtLength(Math.max(X - le, X / 2));
            u.style.left = `${pe.x}px`, u.style.top = `${pe.y}px`;
          }
        }
        for (const X of [c, d, u])
          X && (X.classList.toggle("flow-edge-label-hover", ue === "hover"), X.classList.toggle("flow-edge-label-on-select", ue === "selected"), X.classList.toggle("flow-edge-label-selected", !!S.selected), S.class ? X.classList.add(...S.class.split(" ").filter(Boolean)) : y && X.classList.remove(...y.split(" ").filter(Boolean)));
      }), r(() => {
        if (m) {
          const N = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          N && Ro(N, m);
        }
        P?.(), k(), s.removeEventListener("contextmenu", D), s.removeEventListener("dblclick", L), s.removeEventListener("pointerdown", A, !0), s.removeEventListener("pointerdown", v), s.removeEventListener("pointermove", w), s.removeEventListener("keydown", I), s.removeEventListener("focus", M), s.removeEventListener("blur", R), s.removeEventListener("mousedown", z), s.removeEventListener("mouseenter", V), s.removeEventListener("mouseleave", $), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function dp(t, e) {
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
        const l = typeof a == "string" ? _n(a) : a;
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
        const s = yt(i, t._nodeMap, t._config.nodeOrigin), a = yt(r, t._nodeMap, t._config.nodeOrigin);
        let l, c, d, u;
        if (o.type === "floating") {
          const h = La(s, a);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const p = Ft(d, h.sourcePos, null, o.markerStart), g = Ft(u, h.targetPos, null, o.markerEnd), m = co(o, s, a, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = m.path, c = m.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const C = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), E = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (C) {
              const b = C.getBoundingClientRect();
              p = { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 };
            }
            if (E) {
              const b = E.getBoundingClientRect();
              g = { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 };
            }
          }
          const m = h ? fo(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", y = h ? fo(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = Zt(s, m, t._shapeRegistry, t._config.nodeOrigin), u = Zt(a, y, t._shapeRegistry, t._config.nodeOrigin);
          const _ = Ft(d, m, null, o.markerStart), k = Ft(u, y, null, o.markerEnd), x = co(o, s, a, m, y, _, k, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = x.path, c = x.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", l);
          const p = f.parentElement?.querySelector("path:first-child");
          p && p !== f && p.setAttribute("d", l);
        }
        if (Pa(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = Ma(t._id, o.id), g = o.gradientDirection === "target-source";
            Ta(
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
function up(t) {
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
              qr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = ya(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let fp = 0;
function hp(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function gp(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
function pp(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++fp}`,
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
      _shapeRegistry: { ...ma, ...e.shapeTypes },
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
          d.push(hp(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${g}px ${g}px, ${g}px ${g}px`), f.push(`${l}px ${c}px, ${l}px ${c}px`)) : (u.push(`${p}px ${p}px`), f.push(`${l}px ${c}px`));
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
      _shortcuts: Zf(e.keyboardShortcuts),
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
      _computeEngine: new Lh(),
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
      _spatialGrid: new of(),
      /** Obstacle rects rebuilt once per commit. In the edge effect read it via `Alpine.raw(canvas._obstacleSnapshot)` (nested-raw) so the edge does NOT subscribe to every node's reactive state. */
      _obstacleSnapshot: null,
      /** WS-2 endpoint-spread lanes; null until first computed. Mutated in place (see _obstacleSnapshot). */
      _endpointSpreadGrouping: null,
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
        this._nodeMap = ha(this.nodes), gh(this._childrenIds, this.nodes);
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
          const m = yt(g, d, u), y = {
            id: g.id,
            x: m.position.x,
            y: m.position.y,
            width: m.dimensions?.width ?? ve,
            height: m.dimensions?.height ?? be
          };
          f.insert(g.id, y.x, y.y, y.width, y.height), !g.hidden && h.push(y);
        }
        a ? (a.length = 0, a.push(...h)) : this._obstacleSnapshot = h, this._obstacleEpoch++, this._markDirtyEdges(s, l);
        const p = this._computeEndpointGrouping();
        p.size > 0 && this._markEdgesDirtyById(p);
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
        const s = /* @__PURE__ */ new Set(), a = so(this._config?.avoidantEndpointSpread), l = t.raw(this.nodes), c = new Map(l.map((_) => [_.id, _])), d = this._config?.nodeOrigin, u = (_) => {
          const k = c.get(_);
          if (!k) return 0;
          const x = yt(k, c, d);
          return x.position.y + (x.dimensions?.height ?? 0) / 2;
        }, f = (_) => {
          const k = c.get(_)?.endpointSpread;
          return k !== void 0 ? so(k) !== null : a !== null;
        }, h = /* @__PURE__ */ new Map(), p = (_, k, x, C) => {
          if (!f(_)) return;
          const E = `${_}|${k ?? ""}`;
          let b = h.get(E);
          b || (b = [], h.set(E, b)), b.push({ edgeId: x, sortKey: u(C) });
        }, g = t.raw(this.edges);
        for (const _ of g) {
          const k = _.type ?? this._config?.defaultEdgeType;
          k !== "avoidant" && k !== "orthogonal" || (p(_.source, _.sourceHandle, _.id, _.target), p(_.target, _.targetHandle, _.id, _.source));
        }
        const m = t.raw(this._endpointSpreadGrouping), y = /* @__PURE__ */ new Map();
        for (const [_, k] of h) {
          k.sort((E, b) => E.sortKey - b.sortKey || (E.edgeId < b.edgeId ? -1 : 1));
          const x = /* @__PURE__ */ new Map();
          k.forEach((E, b) => x.set(E.edgeId, b)), y.set(_, { count: k.length, lanes: x });
          const C = m?.get(_);
          for (const [E, b] of x)
            (!C || C.count !== k.length || C.lanes.get(E) !== b) && s.add(E);
        }
        if (m) {
          for (const [_, k] of m)
            if (!y.has(_))
              for (const x of k.lanes.keys()) s.add(x);
        }
        if (m) {
          m.clear();
          for (const [_, k] of y) m.set(_, k);
        } else
          this._endpointSpreadGrouping = y;
        return s;
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
          const y = f?.find((k) => k.id === m);
          y && g.push(y);
          const _ = a?.find((k) => k.id === m);
          _ && g.push(_);
        }
        for (const m of d) {
          let y = p.has(m.source) || p.has(m.target);
          if (!y) {
            const _ = u.get(m.id);
            if (_) {
              for (const k of g)
                if (k.x < _.maxX + ht && k.x + k.width > _.minX - ht && k.y < _.maxY + ht && k.y + k.height > _.minY - ht) {
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
        const d = e.cullingBuffer ?? 100, u = nf(this.viewport, l, c, d), h = t.raw(this._spatialGrid).query(u), p = this._draggingNodeIds, g = /* @__PURE__ */ new Set(), m = (k) => {
          const x = this._nodeMap.get(k);
          if (!x || x.hidden) return;
          const C = x.dimensions?.width ?? 150, E = x.dimensions?.height ?? 50, b = x.parentId ? ii(x, this._nodeMap, this._config.nodeOrigin) : x.position;
          !(b.x + C < u.minX || b.x > u.maxX || b.y + E < u.minY || b.y > u.maxY) && g.add(k);
        };
        for (const k of h) m(k);
        if (p)
          for (const k of p)
            h.has(k) || m(k);
        for (const [k, x] of this._nodeElements) {
          const C = g.has(k) ? "" : "none";
          x.style.display !== C && (x.style.display = C);
        }
        const y = this._culledEdgeIds, _ = /* @__PURE__ */ new Set();
        for (const [k, x] of this._edgeSvgElements) {
          const C = this._edgeMap.get(k);
          if (!C) continue;
          const E = this._nodeMap.get(C.source)?.hidden, b = this._nodeMap.get(C.target)?.hidden;
          if (C.hidden || C._hiddenByCollapse || E || b)
            continue;
          const T = g.has(C.source) || g.has(C.target) || gp(this._edgeCorridors.get(k), u), D = !y.has(k);
          T !== D && (x.style.display = T ? "" : "none"), T || _.add(k);
        }
        this._visibleNodeIds = g, this._culledEdgeIds = _;
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
        return a ? ii(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && qr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new mf(to), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let a = null;
          s === "fill" ? a = "100%" : typeof s == "number" && Number.isFinite(s) ? a = `${s}px` : typeof s == "string" && s.trim() && (a = s.trim()), a !== null && this._container.style.setProperty("--flow-container-height", a);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = ya(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Mt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new lf(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new kh(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Ht("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new l(), p = new c(h), g = new d(h, this, f.provider), m = new u(p, f.user);
          if (He.set(a, { bridge: g, awareness: m, doc: h }), f.provider.connect(h, p), f.cursors !== !1) {
            let y = !1;
            const _ = f.throttle ?? 20, k = (E) => {
              if (y) return;
              y = !0;
              const b = a.getBoundingClientRect(), T = this._viewportLive ?? this.viewport, D = (E.clientX - b.left - T.x) / T.zoom, L = (E.clientY - b.top - T.y) / T.zoom;
              m.updateCursor({ x: D, y: L }), setTimeout(() => {
                y = !1;
              }, _);
            }, x = () => {
              m.updateCursor(null);
            };
            a.addEventListener("mousemove", k), a.addEventListener("mouseleave", x);
            const C = He.get(a);
            C.cursorCleanup = () => {
              a.removeEventListener("mousemove", k), a.removeEventListener("mouseleave", x);
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
        }), this._panZoom = Ju(this._container, {
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
          a && (this._handleDelegationCleanup = ys(a, this), this._handleDelegationEl = a);
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
        !a || a === s || (this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, !this._handleDelegationTornDown && (this._handleDelegationCleanup = ys(s, this), this._handleDelegationEl = s, B("init", `flowCanvas "${this._id}" re-bound its delegated handle pointerdown listener to a replaced .flow-viewport`)));
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
        if (s && (this._longPressCleanup = Jf(
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
          if (Ge(s.key, l.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Ge(s.key, l.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Pe(this._container);
            return;
          }
          if (Ge(s.key, l.delete)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (Ge(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Ge(s.key, l.moveNodes)) {
            if (a === "INPUT" || a === "TEXTAREA" || this._config?.disableKeyboardA11y || this.selectedNodes.size === 0) return;
            s.preventDefault();
            const c = mt(s, l.moveStepModifier) ? l.moveStep * l.moveStepMultiplier : l.moveStep;
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
            Kf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && ea(h)) {
                h.position.x += d, h.position.y += u;
                const p = this._container ? He.get(this._container) : void 0;
                p?.bridge && p.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Ge(s.key, l.undo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Ge(s.key, l.redo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            Ge(s.key, l.copy) ? (s.preventDefault(), this.copy()) : Ge(s.key, l.paste) ? (s.preventDefault(), this.paste()) : Ge(s.key, l.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = vf(this._container, {
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
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, a = s !== this._container;
          this._controls = kf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Qo }),
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
        this._selectionBox = Lf(this._container), this._lasso = Pf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !mt(s, this._shortcuts.selectionBox))
            return;
          const a = s.target;
          if (a !== this._container && !a.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const l = this._config.selectionMode ?? "partial", c = mt(s, this._shortcuts.selectionModeToggle);
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
          const l = ro(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Af(l, u) : Nf(l, u), h = new Set(f.map((p) => p.id));
            if (c = this.nodes.filter((p) => h.has(p.id)), this._config.lassoSelectsEdges)
              for (const p of this.edges) {
                if (p.hidden) continue;
                const g = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(p.id)}"] path`
                );
                if (!g) continue;
                const m = g.getTotalLength(), y = Math.max(10, Math.ceil(m / 20));
                let _ = 0;
                for (let x = 0; x <= y; x++) {
                  const C = g.getPointAtLength(x / y * m);
                  Si(C.x, C.y, u) && _++;
                }
                (this._selectionEffectiveMode === "full" ? _ === y + 1 : _ > 0) && d.push(p.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? tf(l, u, this._config.nodeOrigin) : ef(l, u, this._config.nodeOrigin), h = new Set(f.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!ni(u) || u.hidden) continue;
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
              const p = this._nodeMap.get(h);
              if (p)
                return p;
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
            const f = Vr(
              l.clientX,
              l.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = a(l.clientX, l.clientY), p = e.onDrop({ data: u, position: f, targetNode: h, mimeType: c });
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
            const f = l.borderBoxSize?.[0], h = f ? f.inlineSize : c.offsetWidth, p = f ? f.blockSize : c.offsetHeight;
            if (h === 0 && p === 0 || c.offsetParent === null && c.tagName !== "BODY" || u.fixedDimensions === !0) continue;
            const g = Math.round(h), m = Math.round(p), y = u.dimensions;
            if (y && Math.abs((y.width ?? 0) - g) < 1 && Math.abs((y.height ?? 0) - m) < 1)
              continue;
            const _ = Vh(
              { width: g, height: m },
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
        if (this._layoutDedup = Oh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && Rh(e, s, e.wireEvents);
          const a = Hh(this, s), l = Nh(this, s);
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
        for (const [, s] of wa().entries())
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
          c && Ht(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${l[s]})`);
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
            const f = Vt(u), h = Bt(f, this._id);
            a.has(h) || a.set(h, oo(f, h));
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
          const s = He.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), He.delete(this._container));
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
        return this._layoutDedup ? zh(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? He.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => Jm));
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
      Yh(i),
      Wh(i),
      jh(i),
      Kh(i),
      Qh(i),
      Pg(i),
      Ng(i),
      Ag(i),
      $g(i),
      Bg(i),
      qg(i),
      Xg(i),
      dp(i, t),
      up(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      yf(s, a);
    }, n;
  });
}
function Us(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function mp(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(_) {
    const k = s();
    return {
      x: (_.x - k.x) / k.zoom,
      y: (_.y - k.y) / k.zoom
    };
  }
  const m = Xe(t), y = Nc().subject(() => {
    const _ = s(), k = a();
    return {
      x: k.x * _.zoom + _.x,
      y: k.y * _.zoom + _.y
    };
  }).on("start", (_) => {
    p = g(_), o?.({ nodeId: e, position: p, sourceEvent: _.sourceEvent });
  }).on("drag", (_) => {
    let k = g(_);
    l && (k = Us(k, l));
    const x = {
      x: k.x - p.x,
      y: k.y - p.y
    };
    i?.({ nodeId: e, position: k, delta: x, sourceEvent: _.sourceEvent });
  }).on("end", (_) => {
    let k = g(_);
    l && (k = Us(k, l)), r?.({ nodeId: e, position: k, sourceEvent: _.sourceEvent });
  });
  return d && y.container(() => d), h > 0 && y.clickDistance(h), y.filter((_) => {
    if (u?.() || f && _.target?.closest?.("." + f)) return !1;
    if (c) {
      const k = t.querySelector(c);
      return k ? k.contains(_.target) : !0;
    }
    return !0;
  }), m.call(y), {
    destroy() {
      m.on(".drag", null);
    }
  };
}
function yp(t, e) {
  const n = Kt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? be
  };
}
function wp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, a = 1 / 0, l = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const p = h.x + h.width / 2, g = h.y + h.height / 2, m = h.x + h.width, y = h.y + h.height, _ = [
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
    for (const [x, C] of _) {
      const E = C - x;
      Math.abs(E) <= n && (i.add(C), Math.abs(E) < Math.abs(a) && (a = E, r = E));
    }
    const k = [
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
    for (const [x, C] of k) {
      const E = C - x;
      Math.abs(E) <= n && (o.add(C), Math.abs(E) < Math.abs(l) && (l = E, s = E));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function vp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function _p(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = vp(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const bp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let xp = 0;
function Gs(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Ho(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Ep(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function Cp(t, e, n) {
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
function Sp(t, e, n) {
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
function kp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = null, c = !1, d = null, u = null, f = null, h = null, p = null, g = null, m = !1, y = -1, _ = null, k = !1, x = [], C = "", E = [], b = null;
      i(() => {
        if (!e.isConnected) return;
        const P = o(n);
        if (!P || P.hidden) return;
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        const w = P.parentId ? v.getAbsolutePosition(P.id) : P.position ?? { x: 0, y: 0 }, I = P.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], M = P.dimensions?.width ?? 150, R = P.dimensions?.height ?? 40;
        e.style.left = w.x - M * I[0] + "px", e.style.top = w.y - R * I[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const P = o(n);
        if (!P) return;
        if (e.dataset.flowNodeId = P.id, P.type && (e.dataset.flowNodeType = P.type), !k) {
          const H = e.closest("[x-data]"), q = H ? t.$data(H) : null;
          let j = !1;
          if (q?._config?.nodeTypes) {
            const K = P.type ?? "default", O = q._config.nodeTypes[K] ?? q._config.nodeTypes.default;
            if (typeof O == "string") {
              const J = document.querySelector(O);
              J?.content && (e.appendChild(J.content.cloneNode(!0)), j = !0);
            } else typeof O == "function" && (O(P, e), j = !0);
          }
          if (!j && e.children.length === 0) {
            const K = document.createElement("div");
            K.setAttribute("x-flow-handle:target", "");
            const O = document.createElement("span");
            O.setAttribute("x-text", "node.data.label");
            const J = document.createElement("div");
            J.setAttribute("x-flow-handle:source", ""), e.appendChild(K), e.appendChild(O), e.appendChild(J), j = !0;
          }
          if (j)
            for (const K of Array.from(e.children))
              t.addScopeToNode(K, { node: P }), t.initTree(K);
          k = !0;
        }
        if (P.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), b !== P.id && (s?.destroy(), s = null, b = P.id);
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), P.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), P.dimensions) {
          const H = P.childLayout, q = P.fixedDimensions, j = (v._childrenIds?.get(P.id)?.length ?? 0) > 0;
          e.style.width = P.dimensions.width + "px", H || q || j ? e.style.height = P.dimensions.height + "px" : e.style.height = "";
        }
        v.selectedNodes.has(P.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!P.selected)), P._validationErrors && P._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const w = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], I = P.runState;
        for (const H of w)
          e.classList.remove(H);
        I && I !== "pending" && e.classList.add(`flow-node-${I}`);
        for (const H of x)
          e.classList.remove(H);
        const M = P.class ? P.class.split(/\s+/).filter(Boolean) : [];
        for (const H of M)
          e.classList.add(H);
        x = M;
        const R = P.shape ? `flow-node-${P.shape}` : "";
        C !== R && (C && e.classList.remove(C), R && e.classList.add(R), C = R);
        const z = e.closest("[data-flow-canvas]"), V = z ? t.$data(z) : null, $ = P.shape && V?._shapeRegistry?.[P.shape];
        if ($?.clipPath ? e.style.clipPath = $.clipPath : e.style.clipPath = "", P.style) {
          const H = typeof P.style == "string" ? Object.fromEntries(P.style.split(";").filter(Boolean).map((j) => j.split(":").map((K) => K.trim()))) : P.style, q = [];
          for (const [j, K] of Object.entries(H))
            j && K && (e.style.setProperty(j, K), q.push(j));
          for (const j of E)
            q.includes(j) || e.style.removeProperty(j);
          E = q;
        } else if (E.length > 0) {
          for (const H of E)
            e.style.removeProperty(H);
          E = [];
        }
        if (P.rotation ? (e.style.transform = `rotate(${P.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", P.focusable ?? v._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", P.ariaRole ?? "group"), e.setAttribute("aria-label", P.ariaLabel ?? (P.data?.label ? `Node: ${P.data.label}` : `Node ${P.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), P.domAttributes)
          for (const [H, q] of Object.entries(P.domAttributes))
            H.startsWith("on") || bp.has(H.toLowerCase()) || e.setAttribute(H, q);
        qe(P) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), P.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const N = e.classList.contains("flow-node-condensed");
        P.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!P.condensed !== N && requestAnimationFrame(() => {
          P.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${P.id}" re-measured after condense toggle`, P.dimensions);
        }), P.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const F = P.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), F !== "visible" && e.classList.add(`flow-handles-${F}`);
        let W = ga(P, v._nodeMap);
        v._config?.elevateNodesOnSelect !== !1 && v.selectedNodes.has(P.id) && (W += P.type === "group" ? Math.max(1 - W, 0) : 1e3), m && (W += 1e3);
        const U = P.type === "group" ? 0 : 2;
        if (W !== U ? e.style.zIndex = String(W) : e.style.removeProperty("z-index"), !ea(P)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const Z = e.closest(".flow-container");
        s || (s = mp(e, P.id, {
          container: Z ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => v._animationLocked,
          noDragClassName: v._config?.noDragClassName ?? "nodrag",
          dragThreshold: v._config?.nodeDragThreshold ?? 0,
          getViewport: () => v.viewport,
          getNodePosition: () => {
            const H = v.getNode(P.id);
            return H ? H.parentId ? v.getAbsolutePosition(H.id) : { x: H.position.x, y: H.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: v._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: H, position: q, sourceEvent: j }) {
            e.classList.add("flow-node-dragging"), a = !1, c = !1, d = null;
            const K = v._container ? He.get(v._container) : void 0;
            K?.bridge && K.bridge.setDragging(H, !0), h?.destroy(), h = null, p = null, g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, l = v._snapshotHistory?.() ?? null, B("drag", `Node "${H}" drag start`, q);
            const O = v.getNode(H);
            if (O) {
              if (v._config?.selectNodesOnDrag !== !1 && O.selectable !== !1 && !v.selectedNodes.has(H) && (mt(j, v._shortcuts?.multiSelect) || v.deselectAll(), v.selectedNodes.add(H), O.selected = !0, v._emitSelectionChange(), c = !0), v._emit("node-drag-start", { node: O }), v.selectedNodes.has(H) && v.selectedNodes.size > 1) {
                const J = wt(H, v.nodes);
                d = /* @__PURE__ */ new Map();
                for (const ne of v.selectedNodes) {
                  if (ne === H || J.has(ne))
                    continue;
                  const Y = v.getNode(ne);
                  Y && Y.draggable !== !1 && d.set(ne, { x: Y.position.x, y: Y.position.y });
                }
              }
              if (v._draggingNodeIds.add(H), d)
                for (const J of d.keys())
                  v._draggingNodeIds.add(J);
            }
            v._config?.autoPanOnNodeDrag !== !1 && Z && (u = na({
              container: Z,
              speed: v._config?.autoPanSpeed ?? 15,
              onPan(J, ne) {
                const Y = () => v._viewportLive ?? v.viewport, re = Y().zoom || 1, se = { x: Y().x, y: Y().y };
                v._panZoom?.setViewport({
                  x: Y().x - J,
                  y: Y().y - ne,
                  zoom: re
                });
                const oe = se.x - Y().x, ee = se.y - Y().y, te = oe === 0 && ee === 0, he = v.getNode(H);
                let de = !1;
                if (he) {
                  const ae = he.position.x, ie = he.position.y;
                  he.position.x += oe / re, he.position.y += ee / re;
                  const fe = Fn(he.position, he, v._config?.nodeExtent);
                  he.position.x = fe.x, he.position.y = fe.y, de = he.position.x === ae && he.position.y === ie;
                }
                if (d)
                  for (const [ae] of d) {
                    const ie = v.getNode(ae);
                    if (ie) {
                      ie.position.x += oe / re, ie.position.y += ee / re;
                      const fe = Fn(ie.position, ie, v._config?.nodeExtent);
                      ie.position.x = fe.x, ie.position.y = fe.y;
                    }
                  }
                return te && de;
              }
            }), j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY), u.start());
          },
          onDrag({ nodeId: H, position: q, delta: j, sourceEvent: K }) {
            a = !0;
            const O = v.getNode(H);
            if (O) {
              if (O.parentId) {
                const Y = v.getAbsolutePosition(O.parentId);
                let re = q.x - Y.x, se = q.y - Y.y;
                const oe = O.dimensions ?? { width: 150, height: 50 }, ee = v.getNode(O.parentId);
                if (ee?.childLayout) {
                  m || (e.classList.add("flow-reorder-dragging"), _ = O.parentId), m = !0;
                  const te = O.extent !== "parent";
                  if (O.position.x = q.x - Y.x, O.position.y = q.y - Y.y, !te && ee.dimensions) {
                    const ae = To({ x: O.position.x, y: O.position.y }, oe, ee.dimensions);
                    O.position.x = ae.x, O.position.y = ae.y;
                  }
                  const he = O.dimensions?.width ?? 150, de = O.dimensions?.height ?? 50;
                  if (te) {
                    const ae = ee.dimensions?.width ?? 150, ie = ee.dimensions?.height ?? 50, fe = O.position.x + he / 2, ge = O.position.y + de / 2, Ie = 12, Me = _ === O.parentId ? 0 : Ie, Te = fe >= Me && fe <= ae - Me && ge >= Me && ge <= ie - Me, Le = /* @__PURE__ */ new Set();
                    let ue = O.parentId;
                    for (; ue; )
                      Le.add(ue), ue = v.getNode(ue)?.parentId;
                    const Ee = q.x + he / 2, X = q.y + de / 2, le = wt(O.id, v.nodes);
                    let pe = null;
                    const we = v.nodes.filter(
                      (ce) => ce.id !== O.id && (ce.droppable || ce.childLayout) && !ce.hidden && !le.has(ce.id) && (Te ? !Le.has(ce.id) : ce.id !== O.parentId) && (!ce.acceptsDrop || ce.acceptsDrop(O))
                    );
                    for (const ce of we) {
                      const ye = ce.parentId ? v.getAbsolutePosition(ce.id) : ce.position, Se = ce.dimensions?.width ?? 150, De = ce.dimensions?.height ?? 50, xe = ce.id === g ? 0 : Ie;
                      Ee >= ye.x + xe && Ee <= ye.x + Se - xe && X >= ye.y + xe && X <= ye.y + De - xe && (pe = ce);
                    }
                    const me = pe?.id ?? null;
                    if (me !== g) {
                      g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), me && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(me)}"]`)?.classList.add("flow-node-drop-target"), g = me;
                      const ce = me ? v.getNode(me) : null, ye = _;
                      if (ce?.childLayout && me !== _) {
                        ye && (v.layoutChildren(ye, { omitFromComputation: H, shallow: !0 }), v.propagateLayoutUp(ye, { omitFromComputation: H })), _ = me;
                        const Se = v.nodes.filter((Ce) => Ce.parentId === me && Ce.id !== H).sort((Ce, Nt) => (Ce.order ?? 1 / 0) - (Nt.order ?? 1 / 0)), De = Se.length, xe = [...Se];
                        xe.splice(De, 0, O);
                        for (let Ce = 0; Ce < xe.length; Ce++)
                          xe[Ce].order = Ce;
                        y = De;
                        const ze = v._initialDimensions?.get(H), Tt = { ...O, dimensions: ze ? { ...ze } : void 0 };
                        v.layoutChildren(me, { excludeId: H, includeNode: Tt, shallow: !0 }), v.propagateLayoutUp(me, { includeNode: Tt });
                      } else Te && _ !== O.parentId ? (ye && ye !== O.parentId && (v.layoutChildren(ye, { omitFromComputation: H, shallow: !0 }), v.propagateLayoutUp(ye, { omitFromComputation: H })), _ = O.parentId, y = -1) : !me && !Te && (ye && (v.layoutChildren(ye, { omitFromComputation: H, shallow: !0 }), v.propagateLayoutUp(ye, { omitFromComputation: H })), _ = null, y = -1);
                    }
                  }
                  if (_) {
                    const ae = v.getNode(_), ie = ae?.childLayout ?? ee.childLayout, fe = v.nodes.filter((ue) => ue.parentId === _ && ue.id !== H).sort((ue, Ee) => (ue.order ?? 1 / 0) - (Ee.order ?? 1 / 0));
                    let ge, Ie;
                    if (_ !== O.parentId) {
                      const ue = ae?.parentId ? v.getAbsolutePosition(_) : ae?.position ?? { x: 0, y: 0 };
                      ge = q.x - ue.x, Ie = q.y - ue.y;
                    } else
                      ge = O.position.x, Ie = O.position.y;
                    const Me = ie.swapThreshold ?? 0.5;
                    if (y === -1)
                      if (_ === O.parentId) {
                        const ue = O.order ?? 0;
                        y = fe.filter((Ee) => (Ee.order ?? 0) < ue).length;
                      } else
                        y = fe.length;
                    const Te = y;
                    let Le = fe.length;
                    for (let ue = 0; ue < fe.length; ue++) {
                      const Ee = fe[ue], X = Ee.dimensions?.width ?? 150, le = Ee.dimensions?.height ?? 50, pe = ue < Te ? 1 - Me : Me, we = Ee.position.y + le * pe, me = Ee.position.x + X * pe;
                      if (ie.direction === "grid") {
                        const ce = {
                          x: ge + he / 2,
                          y: Ie + de / 2
                        }, ye = Ee.position.y + le / 2;
                        if (ce.y < Ee.position.y) {
                          Le = ue;
                          break;
                        }
                        if (Math.abs(ce.y - ye) < le / 2 && ce.x < me) {
                          Le = ue;
                          break;
                        }
                      } else if (ie.direction === "vertical") {
                        if ((ue < Te ? Ie : Ie + de) < we) {
                          Le = ue;
                          break;
                        }
                      } else if ((ue < Te ? ge : ge + he) < me) {
                        Le = ue;
                        break;
                      }
                    }
                    if (Le !== y) {
                      y = Le;
                      const ue = [...fe];
                      ue.splice(Le, 0, O);
                      for (let we = 0; we < ue.length; we++)
                        ue[we].order = we;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), v._layoutAnimFrame && cancelAnimationFrame(v._layoutAnimFrame);
                      const X = O.id, le = _, pe = le !== O.parentId;
                      v._layoutAnimFrame = requestAnimationFrame(() => {
                        if (pe && le) {
                          const ye = v.getNode(X);
                          let Se;
                          if (ye) {
                            const De = v._initialDimensions?.get(X);
                            Se = { ...ye, dimensions: De ? { ...De } : void 0 };
                          }
                          v.layoutChildren(le, {
                            excludeId: X,
                            includeNode: Se,
                            shallow: !0
                          }), v.propagateLayoutUp(le, {
                            includeNode: Se
                          });
                        } else
                          v.layoutChildren(le, X, !0);
                        const we = performance.now(), me = 300, ce = () => {
                          v._layoutAnimTick++, performance.now() - we < me ? v._layoutAnimFrame = requestAnimationFrame(ce) : v._layoutAnimFrame = 0;
                        };
                        v._layoutAnimFrame = requestAnimationFrame(ce);
                      });
                    }
                  }
                  u && K instanceof MouseEvent && u.updatePointer(K.clientX, K.clientY);
                  return;
                }
                if (O.extent === "parent" && ee?.dimensions) {
                  const te = To(
                    { x: re, y: se },
                    oe,
                    ee.dimensions
                  );
                  re = te.x, se = te.y;
                } else if (Array.isArray(O.extent)) {
                  const te = pa({ x: re, y: se }, O.extent, oe);
                  re = te.x, se = te.y;
                }
                if ((!O.extent || O.extent !== "parent") && (hn(
                  ee,
                  v._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!ee?.childLayout) && ee?.dimensions) {
                  const de = To(
                    { x: re, y: se },
                    oe,
                    ee.dimensions
                  );
                  re = de.x, se = de.y;
                }
                if (O.expandParent && ee?.dimensions) {
                  const te = ph(
                    { x: re, y: se },
                    oe,
                    ee.dimensions
                  );
                  te && (ee.dimensions.width = te.width, ee.dimensions.height = te.height);
                }
                O.position.x = re, O.position.y = se;
              } else {
                const Y = Fn(q, O, v._config?.nodeExtent);
                O.position.x = Y.x, O.position.y = Y.y;
              }
              if (v._config?.snapToGrid) {
                const Y = O.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], re = O.dimensions?.width ?? 150, se = O.dimensions?.height ?? 40, oe = O.parentId ? v.getAbsolutePosition(O.id) : O.position;
                e.style.left = oe.x - re * Y[0] + "px", e.style.top = oe.y - se * Y[1] + "px", v._layoutAnimTick++;
              }
              if (v._emit("node-drag", { node: O, position: q }), d)
                for (const [Y, re] of d) {
                  const se = v.getNode(Y);
                  if (se) {
                    let oe = re.x + j.x, ee = re.y + j.y;
                    const te = Fn({ x: oe, y: ee }, se, v._config?.nodeExtent);
                    se.position.x = te.x, se.position.y = te.y;
                  }
                }
              const ne = v._config?.helperLines;
              if (ne) {
                const Y = typeof ne == "object" ? ne.snap ?? !0 : !0, re = typeof ne == "object" ? ne.threshold ?? 5 : 5, se = (ae) => {
                  const ie = ae.parentId ? v.getAbsolutePosition(ae.id) : ae.position;
                  return yp({ ...ae, position: ie }, v._config?.nodeOrigin);
                }, ee = (v.selectedNodes.size > 1 && v.selectedNodes.has(H) ? v.nodes.filter((ae) => v.selectedNodes.has(ae.id)) : [O]).map(se), te = {
                  x: Math.min(...ee.map((ae) => ae.x)),
                  y: Math.min(...ee.map((ae) => ae.y)),
                  width: Math.max(...ee.map((ae) => ae.x + ae.width)) - Math.min(...ee.map((ae) => ae.x)),
                  height: Math.max(...ee.map((ae) => ae.y + ae.height)) - Math.min(...ee.map((ae) => ae.y))
                }, he = v.nodes.filter(
                  (ae) => !v.selectedNodes.has(ae.id) && ae.id !== H && ae.hidden !== !0 && ae.filtered !== !0
                ).map(se), de = wp(te, he, re);
                if (Y && (de.snapOffset.x !== 0 || de.snapOffset.y !== 0) && (O.position.x += de.snapOffset.x, O.position.y += de.snapOffset.y, d))
                  for (const [ae] of d) {
                    const ie = v.getNode(ae);
                    ie && (ie.position.x += de.snapOffset.x, ie.position.y += de.snapOffset.y);
                  }
                if (f?.remove(), de.horizontal.length > 0 || de.vertical.length > 0) {
                  const ae = Z?.querySelector(".flow-viewport");
                  if (ae) {
                    const ie = v.nodes.map(se);
                    f = Sp(de.horizontal, de.vertical, ie), ae.appendChild(f);
                  }
                } else
                  f = null;
                v._emit("helper-lines-change", {
                  horizontal: de.horizontal,
                  vertical: de.vertical
                });
              }
            }
            if (v._config?.preventOverlap) {
              const ne = typeof v._config.preventOverlap == "number" ? v._config.preventOverlap : 5, Y = O.dimensions?.width ?? ve, re = O.dimensions?.height ?? be, se = v.selectedNodes, oe = v.nodes.filter((te) => te.id !== O.id && !te.hidden && !se.has(te.id)).map((te) => Gt(te, v._config?.nodeOrigin)), ee = Xh(O.position, Y, re, oe, ne);
              O.position.x = ee.x, O.position.y = ee.y;
            }
            if (!O.parentId) {
              const ne = wt(O.id, v.nodes), Y = v.nodes.filter(
                (te) => te.id !== O.id && te.droppable && !te.hidden && !ne.has(te.id) && (!te.acceptsDrop || te.acceptsDrop(O))
              ), re = Gt(O, v._config?.nodeOrigin);
              let se = null;
              const oe = 12;
              for (const te of Y) {
                const he = te.parentId ? v.getAbsolutePosition(te.id) : te.position, de = te.dimensions?.width ?? ve, ae = te.dimensions?.height ?? be, ie = re.x + re.width / 2, fe = re.y + re.height / 2, ge = te.id === g ? 0 : oe;
                ie >= he.x + ge && ie <= he.x + de - ge && fe >= he.y + ge && fe <= he.y + ae - ge && (se = te);
              }
              const ee = se?.id ?? null;
              ee !== g && (g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), ee && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(ee)}"]`)?.classList.add("flow-node-drop-target"), g = ee);
            }
            if (v._config?.proximityConnect) {
              const ne = v._config.proximityConnectDistance ?? 150, Y = O.dimensions ?? { width: 150, height: 50 }, re = {
                x: O.position.x + Y.width / 2,
                y: O.position.y + Y.height / 2
              }, se = v.nodes.filter((ee) => ee.id !== O.id && !ee.hidden).map((ee) => ({
                id: ee.id,
                center: {
                  x: ee.position.x + (ee.dimensions?.width ?? 150) / 2,
                  y: ee.position.y + (ee.dimensions?.height ?? 50) / 2
                }
              })), oe = _p(O.id, re, se, ne);
              if (oe)
                if (v.edges.some(
                  (te) => te.source === oe.source && te.target === oe.target || te.source === oe.target && te.target === oe.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = oe, !h) {
                    h = Ut({
                      connectionLineType: v._config?.connectionLineType,
                      connectionLineStyle: v._config?.connectionLineStyle,
                      connectionLine: v._config?.connectionLine
                    });
                    const te = Z?.querySelector(".flow-viewport");
                    te && te.appendChild(h.svg);
                  }
                  h.update({
                    fromX: re.x,
                    fromY: re.y,
                    toX: oe.targetCenter.x,
                    toY: oe.targetCenter.y,
                    source: oe.source
                  });
                }
              else
                h?.destroy(), h = null, p = null;
            }
            const J = v._container ? He.get(v._container) : void 0;
            if (J?.bridge) {
              if (J.bridge.pushLocalNodeUpdate(H, { position: O.position }), d)
                for (const [ne] of d) {
                  const Y = v.getNode(ne);
                  Y && J.bridge.pushLocalNodeUpdate(ne, { position: Y.position });
                }
              if (J.awareness && K instanceof MouseEvent && v._container) {
                const ne = v._container.getBoundingClientRect(), Y = v._viewportLive ?? v.viewport, re = (K.clientX - ne.left - Y.x) / Y.zoom, se = (K.clientY - ne.top - Y.y) / Y.zoom;
                J.awareness.updateCursor({ x: re, y: se });
              }
            }
            u && K instanceof MouseEvent && u.updatePointer(K.clientX, K.clientY);
          },
          onDragEnd({ nodeId: H, position: q }) {
            const j = d ? [H, ...d.keys()] : [H];
            v._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), B("drag", `Node "${H}" drag end`, q);
            const K = v._container ? He.get(v._container) : void 0;
            K?.bridge && K.bridge.setDragging(H, !1), u?.stop(), u = null, f?.remove(), f = null, v._config?.helperLines && v._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const O = v.getNode(H);
            if (O && v._emit("node-drag-end", { node: O, position: q }), m && O?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const J = _;
              m = !1, y = -1, _ = null, v._layoutAnimFrame && (cancelAnimationFrame(v._layoutAnimFrame), v._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Ho(v, H, g), g = null) : J && J !== O.parentId ? (v.layoutChildren(J, { omitFromComputation: H, shallow: !0 }), v.propagateLayoutUp(J, { omitFromComputation: H }), v.layoutChildren(O.parentId), v._emit("child-reorder", {
                nodeId: H,
                parentId: O.parentId,
                order: O.order
              })) : (v.layoutChildren(O.parentId), v._emit("child-reorder", {
                nodeId: H,
                parentId: O.parentId,
                order: O.order
              })), d = null, v._layoutAnimTick++, v._commitNodeGeometry(j), Gs(v, a, l), l = null, a = !1;
              return;
            }
            if (O && g)
              Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Ho(v, H, g), g = null;
            else if (O && O.parentId && !g) {
              const J = hn(
                v.getNode(O.parentId),
                v._config?.childValidationRules ?? {}
              ), ne = v.getNode(O.parentId);
              if (!J?.preventChildEscape && !ne?.childLayout && ne?.dimensions) {
                const Y = O.position.x, re = O.position.y, se = O.dimensions?.width ?? 150, oe = O.dimensions?.height ?? 50;
                (Y + se < 0 || re + oe < 0 || Y > ne.dimensions.width || re > ne.dimensions.height) && Ho(v, H, null);
              }
              g = null;
            } else
              g && Z && Z.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (v._config?.proximityConnect && p) {
              const J = p;
              h?.destroy(), h = null, p = null;
              let ne = !0;
              if (v._config.onProximityConnect && v._config.onProximityConnect({
                source: J.source,
                target: J.target,
                distance: J.distance
              }) === !1 && (ne = !1), ne) {
                const Y = {
                  source: J.source,
                  sourceHandle: "source",
                  target: J.target,
                  targetHandle: "target"
                };
                if (pt(Y, v.edges, { preventCycles: v._config?.preventCycles }) && gt(Y, v._config?.connectionRules, v._nodeMap) && (Z ? nt(Z, Y, v.edges) : !0) && (Z ? tt(Z, Y) : !0) && (!v._config.isValidConnection || v._config.isValidConnection(Y))) {
                  if (v._config.proximityConnectConfirm) {
                    const he = Z?.querySelector(`[data-flow-node-id="${CSS.escape(J.source)}"]`), de = Z?.querySelector(`[data-flow-node-id="${CSS.escape(J.target)}"]`);
                    he?.classList.add("flow-proximity-confirm"), de?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      he?.classList.remove("flow-proximity-confirm"), de?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const te = `e-${J.source}-${J.target}-${Date.now()}-${xp++}`;
                  v.addEdges({ id: te, ...Y }), v._emit("connect", { connection: Y });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, a && (v._layoutAnimTick++, v._commitNodeGeometry(j)), Gs(v, a, l), l = null, a = !1;
          }
        }));
      });
      {
        const P = t.$data(e.closest("[x-data]"));
        if (P?._config?.easyConnect) {
          const v = P._config.easyConnectKey ?? "alt", w = (I) => {
            if (!Ep(I, v) || I.target.closest("[data-flow-handle-type]")) return;
            const M = t.$data(e.closest("[x-data]"));
            if (!M || M._animationLocked || M._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const z = M.getNode(R.id);
            if (!z || z.connectable === !1) return;
            I.preventDefault(), I.stopPropagation(), I.stopImmediatePropagation();
            const V = Cp(e, I.clientX, I.clientY), $ = V?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const S = e.closest(".flow-container");
            if (!S) return;
            const N = M._viewportLive ?? M.viewport, F = N?.zoom || 1, W = N?.x || 0, Q = N?.y || 0, U = S.getBoundingClientRect();
            let G, Z;
            if (V) {
              const Y = V.getBoundingClientRect();
              G = (Y.left + Y.width / 2 - U.left - W) / F, Z = (Y.top + Y.height / 2 - U.top - Q) / F;
            } else {
              const Y = e.getBoundingClientRect();
              G = (Y.left + Y.width / 2 - U.left - W) / F, Z = (Y.top + Y.height / 2 - U.top - Q) / F;
            }
            M._emit("connect-start", { source: R.id, sourceHandle: $ });
            const H = Ut({
              connectionLineType: M._config?.connectionLineType,
              connectionLineStyle: M._config?.connectionLineStyle,
              connectionLine: M._config?.connectionLine
            }), q = S.querySelector(".flow-viewport");
            q && q.appendChild(H.svg), H.update({ fromX: G, fromY: Z, toX: G, toY: Z, source: R.id, sourceHandle: $ }), M.pendingConnection = { source: R.id, sourceHandle: $, position: { x: G, y: Z } }, En(S, R.id, $, M);
            let j = _o(S, M, I.clientX, I.clientY), K = null;
            const O = M._config?.connectionSnapRadius ?? 20, J = (Y) => {
              const re = M.screenToFlowPosition(Y.clientX, Y.clientY), se = xn({
                containerEl: S,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: re,
                connectionSnapRadius: O,
                getNode: (oe) => M.getNode(oe),
                toFlowPosition: (oe, ee) => M.screenToFlowPosition(oe, ee)
              });
              se.element !== K && (K?.classList.remove("flow-handle-active"), se.element?.classList.add("flow-handle-active"), K = se.element), H.update({ fromX: G, fromY: Z, toX: se.position.x, toY: se.position.y, source: R.id, sourceHandle: $ }), M.pendingConnection = { ...M.pendingConnection, position: se.position }, j?.updatePointer(Y.clientX, Y.clientY);
            }, ne = async (Y) => {
              j?.stop(), j = null, document.removeEventListener("pointermove", J), document.removeEventListener("pointerup", ne), H.destroy(), K?.classList.remove("flow-handle-active"), Pe(S), e.classList.remove("flow-easy-connecting");
              const re = M.screenToFlowPosition(Y.clientX, Y.clientY), se = { source: R.id, sourceHandle: $, position: re };
              M.pendingConnection = null;
              let oe = K;
              if (oe || (oe = document.elementFromPoint(Y.clientX, Y.clientY)?.closest('[data-flow-handle-type="target"]')), !oe) {
                M._emit("connect-end", { connection: null, ...se });
                return;
              }
              const te = oe.closest("[x-flow-node]")?.dataset.flowNodeId, he = oe.dataset.flowHandleId ?? "target";
              if (!te) {
                M._emit("connect-end", { connection: null, ...se });
                return;
              }
              const de = { source: R.id, sourceHandle: $, target: te, targetHandle: he }, ae = await sa({ connection: de, canvas: M, containerEl: S });
              M._emit("connect-end", {
                connection: ae.applied ? de : null,
                ...se
              });
            };
            document.addEventListener("pointermove", J), document.addEventListener("pointerup", ne);
          };
          e.addEventListener("pointerdown", w, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", w, { capture: !0 });
          });
        }
      }
      const T = (P) => {
        if (P.key !== "Enter" && P.key !== " ") return;
        P.preventDefault();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        w && (w._animationLocked || ni(v) && (w._emit("node-click", { node: v, event: P }), P.stopPropagation(), mt(P, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1) : (w.selectedNodes.add(v.id), v.selected = !0) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0), w._emitSelectionChange()));
      };
      e.addEventListener("keydown", T);
      const D = () => {
        const P = t.$data(e.closest("[x-data]"));
        if (!P?._config?.autoPanOnNodeFocus) return;
        const v = o(n);
        if (!v) return;
        const w = v.parentId ? P.getAbsolutePosition(v.id) : v.position;
        P.setCenter(
          w.x + (v.dimensions?.width ?? 150) / 2,
          w.y + (v.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", D);
      const L = (P) => {
        if (a) return;
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w && !w._animationLocked && (w._emit("node-click", { node: v, event: P }), !!ni(v))) {
          if (P.stopPropagation(), c) {
            c = !1;
            return;
          }
          mt(P, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${v.id}" deselected (shift)`)) : (w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${v.id}" selected (shift)`)) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${v.id}" selected`)), w._emitSelectionChange();
        }
      };
      e.addEventListener("click", L);
      const A = (P) => {
        P.preventDefault(), P.stopPropagation();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w)
          if (w.selectedNodes.size > 1 && w.selectedNodes.has(v.id)) {
            const I = w.nodes.filter((M) => w.selectedNodes.has(M.id));
            w._emit("selection-context-menu", { nodes: I, event: P });
          } else
            w._emit("node-context-menu", { node: v, event: P });
      };
      e.addEventListener("contextmenu", A), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const P = o(n);
        if (!P) return;
        const v = t.$data(e.closest("[x-data]"));
        P.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${P.id}" measured`, P.dimensions), v?._nodeElements?.set(P.id, e), P.resizeObserver !== !1 && v?._resizeObserver && v._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", T), e.removeEventListener("focus", D), e.removeEventListener("click", L), e.removeEventListener("contextmenu", A);
        const P = e.dataset.flowNodeId;
        if (P) {
          const v = t.$data(e.closest("[x-data]"));
          v?._nodeElements?.delete(P), v?._resizeObserver?.unobserve(e), v?._draggingNodeIds?.delete(P);
        }
      });
    }
  );
}
const $t = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function Lp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  u ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : f && (g = o.height - e.y), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)));
  const m = p - o.width, y = g - o.height, _ = d ? n.x - m : n.x, k = f ? n.y - y : n.y;
  return {
    position: { x: _, y: k },
    dimensions: { width: p, height: g }
  };
}
const Na = ["top-left", "top-right", "bottom-left", "bottom-right"], Aa = ["top", "right", "bottom", "left"], Pp = [...Na, ...Aa], Mp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Tp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Np(o);
      let l = { ...$t };
      if (n)
        try {
          const d = i(n);
          l = { ...$t, ...d };
        } catch {
        }
      const c = [];
      for (const d of a) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Mp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), m = h.dataset.flowNodeId;
          if (!m || !g) return;
          const y = g.getNode(m);
          if (!y || !gs(y)) return;
          y.fixedDimensions = !0;
          const _ = { ...l };
          if (y.minDimensions?.width != null && l.minWidth === $t.minWidth && (_.minWidth = y.minDimensions.width), y.minDimensions?.height != null && l.minHeight === $t.minHeight && (_.minHeight = y.minDimensions.height), y.maxDimensions?.width != null && l.maxWidth === $t.maxWidth && (_.maxWidth = y.maxDimensions.width), y.maxDimensions?.height != null && l.maxHeight === $t.maxHeight && (_.maxHeight = y.maxDimensions.height), !y.dimensions) {
            const L = g.viewport?.zoom || 1, A = h.getBoundingClientRect();
            y.dimensions = { width: A.width / L, height: A.height / L };
          }
          const k = { x: y.position.x, y: y.position.y }, x = { width: y.dimensions.width, height: y.dimensions.height }, C = g.viewport?.zoom || 1, E = f.clientX, b = f.clientY;
          g._captureHistory?.(), B("resize", `Resize start on "${m}" (${d})`, x), g._emit("node-resize-start", { node: y, dimensions: { ...x } });
          const T = (L) => {
            const A = {
              x: (L.clientX - E) / C,
              y: (L.clientY - b) / C
            }, P = Lp(
              d,
              A,
              k,
              x,
              _,
              g._config?.snapToGrid ?? !1
            );
            if (y.position.x = P.position.x, y.position.y = P.position.y, y.dimensions.width = P.dimensions.width, y.dimensions.height = P.dimensions.height, y.parentId) {
              const v = g.getAbsolutePosition(y.id);
              h.style.left = `${v.x}px`, h.style.top = `${v.y}px`;
            } else
              h.style.left = `${P.position.x}px`, h.style.top = `${P.position.y}px`;
            h.style.width = `${P.dimensions.width}px`, h.style.height = `${P.dimensions.height}px`, g._layoutAnimTick++, g._emit("node-resize", { node: y, dimensions: { ...P.dimensions } });
          }, D = () => {
            document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), B("resize", `Resize end on "${m}"`, y.dimensions), g._emit("node-resize-end", { node: y, dimensions: { ...y.dimensions } });
          };
          document.addEventListener("pointermove", T), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D);
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
        const g = !gs(p);
        for (const m of c)
          m.style.display = g ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function Np(t) {
  if (t.includes("corners"))
    return Na;
  if (t.includes("edges"))
    return Aa;
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
  return Pp;
}
function Ap(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function $p(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Ip(t) {
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
        const h = t.$data(f), p = u.dataset.flowNodeId;
        if (!p || !h) return;
        const g = h.getNode(p);
        if (!g) return;
        const m = u.getBoundingClientRect(), y = m.left + m.width / 2, _ = m.top + m.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const k = (C) => {
          let E = Ap(
            C.clientX,
            C.clientY,
            y,
            _
          );
          a && (E = $p(E, l)), g.rotation = E;
        }, x = () => {
          document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", x), e.style.cursor = "grab", h._emit("node-rotate-end", { node: g, rotation: g.rotation });
        };
        document.addEventListener("pointermove", k), document.addEventListener("pointerup", x);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function Dp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const Rp = "application/alpineflow";
function Hp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(Rp, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function Fp(t) {
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
function Op(t) {
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
          const g = Fp(
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
          const y = i.getNode?.(g.source), _ = i.getNode?.(g.target), k = g.hidden || g._hiddenByCollapse || y?.hidden || _?.hidden;
          m.style.display = k ? "none" : "";
        }
        for (const g of l) {
          const m = a.get(g.id);
          if (!m) continue;
          const y = i.getNode?.(g.source), _ = i.getNode?.(g.target);
          y?.filtered || _?.filtered ? m.classList.add("flow-edge-filtered") : m.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [l, c] of a)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(l);
        a.clear(), s.remove();
      });
    }
  );
}
const zp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], Vp = "a, button, input, textarea, select, [contenteditable]", Bp = 100, qp = 60, Xp = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), Yp = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), Wp = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), jp = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function Up(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && zp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function It(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function Gp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function Zp(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (Xp.has(e) && (t.style.top = "0"), Yp.has(e) && (t.style.bottom = "0")), o && !n && (Wp.has(e) && (t.style.left = "0"), jp.has(e) && (t.style.right = "0"));
}
function Kp(t) {
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
      } = Up(n, o), f = d || u, h = !s && !a && !f, p = !s && !l && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || f) && e.classList.add("flow-panel-locked"), (l || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && Zp(e, r, d, u);
      const g = (C) => C.stopPropagation();
      e.addEventListener("mousedown", g), e.addEventListener("pointerdown", g), e.addEventListener("wheel", g);
      const m = e.parentElement, y = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, _ = `flow-panel-${r}`, k = () => {
        e.style.left = y.left, e.style.top = y.top, e.style.right = y.right, e.style.bottom = y.bottom, e.style.transform = y.transform, e.style.width = y.width, e.style.height = y.height, e.style.borderRadius = y.borderRadius, e.classList.contains(_) || e.classList.add(_);
      };
      m.addEventListener("flow-panel-reset", k), m.__flowPanels || (m.__flowPanels = /* @__PURE__ */ new Set()), m.__flowPanels.add(e);
      let x = null;
      if (h) {
        let C = !1, E = 0, b = 0, T = 0, D = 0;
        const L = () => {
          const w = e.getBoundingClientRect(), I = m.getBoundingClientRect();
          return {
            x: w.left - I.left,
            y: w.top - I.top
          };
        }, A = (w) => {
          if (!C) return;
          let I = T + (w.clientX - E), M = D + (w.clientY - b);
          if (c) {
            const R = Gp(
              I,
              M,
              e.offsetWidth,
              e.offsetHeight,
              m.clientWidth,
              m.clientHeight
            );
            I = R.left, M = R.top;
          }
          e.style.left = `${I}px`, e.style.top = `${M}px`, It(m, "panel-drag", {
            panel: e,
            position: { x: I, y: M }
          });
        }, P = () => {
          if (!C) return;
          C = !1, document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P);
          const w = L();
          It(m, "panel-drag-end", {
            panel: e,
            position: w
          });
        }, v = (w) => {
          const I = w.target;
          if (I.closest(Vp) || I.closest(".flow-panel-resize-handle"))
            return;
          C = !0, E = w.clientX, b = w.clientY;
          const M = e.getBoundingClientRect(), R = m.getBoundingClientRect();
          T = M.left - R.left, D = M.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${T}px`, e.style.top = `${D}px`, document.addEventListener("pointermove", A), document.addEventListener("pointerup", P), document.addEventListener("pointercancel", P), It(m, "panel-drag-start", {
            panel: e,
            position: { x: T, y: D }
          });
        };
        if (e.addEventListener("pointerdown", v), p) {
          x = document.createElement("div"), x.classList.add("flow-panel-resize-handle"), e.appendChild(x);
          let w = !1, I = 0, M = 0, R = 0, z = 0;
          const V = (N) => {
            if (!w) return;
            const F = Math.max(Bp, R + (N.clientX - I)), W = Math.max(qp, z + (N.clientY - M));
            e.style.width = `${F}px`, e.style.height = `${W}px`, It(m, "panel-resize", {
              panel: e,
              dimensions: { width: F, height: W }
            });
          }, $ = () => {
            w && (w = !1, document.removeEventListener("pointermove", V), document.removeEventListener("pointerup", $), document.removeEventListener("pointercancel", $), It(m, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, S = (N) => {
            N.stopPropagation(), w = !0, I = N.clientX, M = N.clientY, R = e.offsetWidth, z = e.offsetHeight, document.addEventListener("pointermove", V), document.addEventListener("pointerup", $), document.addEventListener("pointercancel", $), It(m, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: z }
            });
          };
          x.addEventListener("pointerdown", S), i(() => {
            e.removeEventListener("pointerdown", v), x?.removeEventListener("pointerdown", S), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P), document.removeEventListener("pointermove", V), document.removeEventListener("pointerup", $), document.removeEventListener("pointercancel", $), x?.remove(), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", k), m.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", k), m.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", k), m.__flowPanels?.delete(e);
        });
    }
  );
}
function Jp(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = Qp(n), a = em(o);
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
        const h = f.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, m = g ? f.getNode(g) : null, y = m?.dimensions?.width ?? d.offsetWidth, _ = m?.dimensions?.height ?? d.offsetHeight, k = p / h;
        let x, C, E, b;
        s === "top" || s === "bottom" ? (C = s === "top" ? -k : _ + k, b = s === "top" ? "-100%" : "0%", a === "start" ? (x = 0, E = "0%") : a === "end" ? (x = y, E = "-100%") : (x = y / 2, E = "-50%")) : (x = s === "left" ? -k : y + k, E = s === "left" ? "-100%" : "0%", a === "start" ? (C = 0, b = "0%") : a === "end" ? (C = _, b = "-100%") : (C = _ / 2, b = "-50%")), e.style.left = `${x}px`, e.style.top = `${C}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${E}, ${b})`;
      }), r(() => {
        e.removeEventListener("pointerdown", l), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function Qp(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function em(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function tm(t) {
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
        const E = r(o);
        u = E?.offsetX ?? 0, f = E?.offsetY ?? 0;
      }
      l.setAttribute("role", "menu"), l.setAttribute("tabindex", "-1"), l.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let p = null;
      const g = 4, m = () => {
        p = document.activeElement;
        const E = d.contextMenu.x + u, b = d.contextMenu.y + f;
        l.style.display = "", l.style.position = "fixed", l.style.left = E + "px", l.style.top = b + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((v) => {
          v.setAttribute("role", "menuitem"), v.hasAttribute("tabindex") || v.setAttribute("tabindex", "-1");
        });
        const T = l.getBoundingClientRect(), D = window.innerWidth, L = window.innerHeight;
        let A = E, P = b;
        T.right > D - g && (A = D - T.width - g), T.bottom > L - g && (P = L - T.height - g), A < g && (A = g), P < g && (P = g), l.style.left = A + "px", l.style.top = P + "px", h.style.display = "", l.focus({ preventScroll: !0 });
      }, y = () => {
        l.style.display = "none", h.style.display = "none", p && document.contains(p) && (p.focus({ preventScroll: !0 }), p = null);
      };
      i(() => {
        const E = d.contextMenu;
        E.show && E.type === a ? m() : y();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (E) => {
        E.preventDefault(), d.closeContextMenu();
      });
      const _ = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", _, !0);
      const k = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), x = (E) => Array.from(E.querySelectorAll(
        "button:not([disabled])"
      )), C = (E) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const b = document.activeElement, T = b?.closest(".flow-context-submenu"), D = T ? x(T) : k();
        if (D.length === 0) return;
        const L = D.indexOf(b);
        switch (E.key) {
          case "ArrowDown": {
            E.preventDefault();
            const A = L < D.length - 1 ? L + 1 : 0;
            D[A].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            E.preventDefault();
            const A = L > 0 ? L - 1 : D.length - 1;
            D[A].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (E.preventDefault(), E.shiftKey) {
              const A = L > 0 ? L - 1 : D.length - 1;
              D[A].focus({ preventScroll: !0 });
            } else {
              const A = L < D.length - 1 ? L + 1 : 0;
              D[A].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            E.preventDefault(), b?.click();
            break;
          }
          case "ArrowRight": {
            if (!T) {
              const A = b?.querySelector(".flow-context-submenu");
              A && (E.preventDefault(), A.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            T && (E.preventDefault(), T.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      l.addEventListener("keydown", C), s(() => {
        h.remove(), window.removeEventListener("scroll", _, !0), l.removeEventListener("keydown", C);
      });
    }
  );
}
const nm = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function om(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), u = l.has("queue"), f = n || "";
      let h = "click";
      l.has("mouseenter") ? h = "mouseenter" : l.has("click") && (h = "click");
      let p = null, g = [], m = !1, y = !1, _ = !1;
      function k() {
        const A = r(i);
        return Array.isArray(A) ? A : A && typeof A == "object" ? [A] : [];
      }
      function x() {
        const A = e.closest("[x-data]");
        return A ? t.$data(A) : null;
      }
      function C(A, P = !1) {
        const v = x();
        if (!v?.timeline) return Promise.resolve();
        const w = v.timeline();
        if (P) {
          for (let I = A.length - 1; I >= 0; I--)
            w.step(A[I]);
          w.reverse();
        } else
          for (const I of A)
            I.parallel ? w.parallel(I.parallel) : w.step(I);
        return p = w, w.play().then(() => {
          p === w && (p = null);
        });
      }
      function E(A = !1) {
        if (c && y) return;
        y = !0;
        const P = k();
        if (P.length === 0) return;
        const v = () => C(P, A);
        u ? (g.push(v), b()) : (p?.stop(), p = null, g = [], m = !1, v());
      }
      async function b() {
        if (!m) {
          for (m = !0; g.length > 0; )
            await g.shift()();
          m = !1;
        }
      }
      if (f) {
        s(() => {
          const A = k(), P = x();
          P?.registerAnimation && P.registerAnimation(f, A);
        }), a(() => {
          const A = x();
          A?.unregisterAnimation && A.unregisterAnimation(f);
        });
        return;
      }
      const T = () => {
        d && h === "click" ? (E(_), _ = !_) : E(!1);
      };
      e.addEventListener(h, T);
      let D = null, L = null;
      d && h !== "click" && (L = nm[h] ?? null, L && (D = () => E(!0), e.addEventListener(L, D))), a(() => {
        p?.stop(), e.removeEventListener(h, T), L && D && e.removeEventListener(L, D);
      });
    }
  );
}
function im(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? ve, l = t.dimensions?.height ?? be, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + a) * n.zoom + n.x, f = (s + l) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function sm(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !im(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function rm(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, a = null, l = [], c = !1, d = "idle", u = 0;
      function f() {
        const m = e.closest("[x-data]");
        return m ? t.$data(m) : null;
      }
      function h(m, y) {
        const _ = f();
        if (!_?.timeline) return Promise.resolve();
        const k = _.timeline(), x = y.speed ?? 1, C = y.autoFitView === !0, E = y.fitViewPadding ?? 0.1, b = _.viewport, T = _.getContainerDimensions?.();
        for (const D of m) {
          const L = x !== 1 ? {
            ...D,
            duration: D.duration !== void 0 ? D.duration / x : void 0,
            delay: D.delay !== void 0 ? D.delay / x : void 0
          } : D;
          if (L.parallel) {
            const A = L.parallel.map(
              (P) => x !== 1 ? {
                ...P,
                duration: P.duration !== void 0 ? P.duration / x : void 0,
                delay: P.delay !== void 0 ? P.delay / x : void 0
              } : P
            );
            k.parallel(A);
          } else if (C && b && T && sm(L, _, b, T.width, T.height)) {
            const A = {
              fitView: !0,
              fitViewPadding: E,
              duration: L.duration,
              easing: L.easing
            };
            k.parallel([L, A]);
          } else
            k.step(L);
        }
        if (y.lock && k.lock(!0), y.loop !== void 0 && y.loop !== !1) {
          const D = y.loop === !0 ? 0 : y.loop;
          k.loop(D);
        }
        return y.respectReducedMotion !== void 0 && k.respectReducedMotion(y.respectReducedMotion), a = k, d = "playing", c = !0, k.play().then(() => {
          a === k && (a = null, d = "idle", c = !1);
        });
      }
      async function p(m) {
        if (l.length === 0) return;
        if ((m.overflow ?? "queue") === "latest" && c) {
          a?.stop(), a = null, c = !1, d = "idle";
          const _ = [l[l.length - 1]];
          s += l.length, l = [], await h(_, m);
        } else {
          const _ = [...l];
          s += _.length, l = [], c && await new Promise((x) => {
            a ? (a.on("complete", () => x()), a.on("stop", () => x())) : x();
          }), await h(_, m);
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
            const y = o(n), _ = y.steps ?? [];
            if (_.length > 0)
              return l = [..._], p(y);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = g, i(() => {
        const m = o(n);
        if (!m || !m.steps) return;
        const y = m.steps, _ = m.autoplay !== !1;
        if (y.length > u) {
          const k = y.slice(Math.max(s, u));
          u = y.length, k.length > 0 && _ && (l.push(...k), p(m));
        } else
          u = y.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function am(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = o.includes("all"), l = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), u = () => {
        const f = e.closest("[data-flow-canvas]");
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
        const h = e.closest("[data-flow-canvas]");
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
function lm(t) {
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
function Fo(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ve(t, e, n) {
  const o = (Array.isArray(n) ? n : n ? [n] : []).flatMap((s) => s.split(/\s+/)).filter(Boolean), i = new Set(o), r = t.dataset[e] ? t.dataset[e].split(" ") : [];
  for (const s of r) i.has(s) || t.classList.remove(s);
  for (const s of i) t.classList.add(s);
  i.size ? t.dataset[e] = [...i].join(" ") : delete t.dataset[e];
}
function Zs(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
const Ks = [
  ["icon", ".flow-schema-row-icon"],
  ["name", ".flow-schema-row-name"],
  ["type", ".flow-schema-row-type"],
  ["target", ".flow-schema-handle--target:not(.flow-schema-handle--mirror)"],
  ["source", ".flow-schema-handle--source:not(.flow-schema-handle--mirror)"],
  ["mirrorTarget", ".flow-schema-handle--target.flow-schema-handle--mirror"],
  ["mirrorSource", ".flow-schema-handle--source.flow-schema-handle--mirror"]
];
function cm(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
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
      const E = d()?._config;
      return {
        nodeDecorator: typeof E?.schemaNodeDecorator == "function" ? E.schemaNodeDecorator : null,
        rowDecorator: typeof E?.schemaRowDecorator == "function" ? E.schemaRowDecorator : null,
        nodeClass: typeof E?.schemaNodeClass == "function" ? E.schemaNodeClass : null,
        rowClass: typeof E?.schemaRowClass == "function" ? E.schemaRowClass : null
      };
    }, f = () => {
      t.nextTick(() => {
        const E = d();
        if (!E) return;
        const b = t.raw(E);
        if (b._schemaMetrics != null) return;
        const T = s.querySelector(":scope > .flow-schema-header"), D = s.querySelector(":scope > .flow-schema-body"), L = s.querySelectorAll(".flow-schema-row");
        if (L.length < 2) return;
        const A = L[0], P = L[1], v = L[L.length - 1], w = A.querySelector(".flow-schema-handle"), I = v.querySelector(".flow-schema-handle");
        if (!T || !D || !w || !I) return;
        const M = s.closest("[data-flow-node-id]") ?? s, R = b.viewport?.zoom || 1, z = M.getBoundingClientRect(), V = T.getBoundingClientRect(), $ = D.getBoundingClientRect(), S = A.getBoundingClientRect(), N = P.getBoundingClientRect(), F = v.getBoundingClientRect(), W = w.getBoundingClientRect(), Q = I.getBoundingClientRect(), U = (N.top - S.top) / R, G = F.height / R;
        if (U <= 0 || G <= 0) return;
        const Z = {
          headerHeight: V.height / R,
          rowHeight: U,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast: G,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (W.top + W.height / 2 - S.top) / R,
          handleOffsetYLast: (Q.top + Q.height / 2 - F.top) / R,
          insetLeft: (S.left - z.left) / R,
          insetRight: (z.right - S.right) / R,
          insetTop: (V.top - z.top) / R,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (z.bottom - $.bottom) / R,
          handleWidth: W.width / R,
          handleHeight: W.height / R
        };
        b._schemaMetrics = Z;
      });
    };
    s.classList.add("flow-schema-node");
    let h = s.closest("[data-flow-node-id]"), p = !1;
    h ? h.setAttribute("data-flow-schema-node", "") : t.nextTick(() => {
      p || !s.isConnected || (h = s.closest("[data-flow-node-id]"), h?.setAttribute("data-flow-schema-node", ""));
    });
    let g = null, m = null;
    const y = /* @__PURE__ */ new Map(), _ = () => g && m ? !1 : (Fo(s), y.clear(), g = document.createElement("div"), g.className = "flow-schema-header", s.appendChild(g), m = document.createElement("div"), m.className = "flow-schema-body", s.appendChild(m), !0), k = () => {
      const E = a(), b = E?.data;
      if (!b) {
        for (const $ of y.values())
          t.destroyTree($);
        y.clear(), Fo(s), Ve(s, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub, g = null, m = null;
        return;
      }
      const T = _(), D = u(), L = typeof b.label == "string" ? b.label : "", A = Array.isArray(b.fields) ? b.fields : [], P = typeof E?.id == "string" ? E.id : "", v = ($, S, N) => {
        const F = $.dataset.flowSchemaRowSub === "1";
        if (!D.rowClass && !$.dataset.flowSchemaRowClass && !F) return;
        let W = null;
        if (D.rowClass)
          try {
            W = D.rowClass({
              field: S,
              node: E,
              nodeId: P,
              isNew: N
            });
          } catch (Q) {
            console.error("[alpineflow] schemaRowClass threw:", Q);
            return;
          }
        if (Zs(W)) {
          const Q = W;
          Ve($, "flowSchemaRowClass", Q.row);
          for (const [U, G] of Ks) {
            const Z = $.querySelector(G);
            Z && Ve(Z, "flowSchemaRowClass", Q[U]);
          }
          $.dataset.flowSchemaRowSub = "1";
        } else if (Ve($, "flowSchemaRowClass", W), F) {
          for (const [, Q] of Ks) {
            const U = $.querySelector(Q);
            U && Ve(U, "flowSchemaRowClass", null);
          }
          delete $.dataset.flowSchemaRowSub;
        }
      }, w = ($, S, N) => {
        if (!D.rowDecorator) return;
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
          D.rowDecorator({ row: $, field: S, nodeId: P, slots: F, isNew: N });
        } catch (W) {
          console.error("[alpineflow] schemaRowDecorator threw:", W);
        }
      };
      typeof b.kind == "string" && b.kind ? s.setAttribute("data-flow-schema-kind", b.kind) : s.removeAttribute("data-flow-schema-kind"), g.textContent !== L && (g.textContent = L);
      const I = l(), M = c(), R = /* @__PURE__ */ new Set();
      for (const $ of A) {
        R.add($.name);
        const S = y.get($.name);
        if (S)
          x(S, $), v(S, $, !1), w(S, $, !1);
        else {
          const N = C($, P, I, M);
          y.set($.name, N), m.appendChild(N), t.initTree(N), v(N, $, !0), w(N, $, !0);
        }
      }
      for (const [$, S] of y)
        R.has($) || (t.destroyTree(S), S.remove(), y.delete($));
      let z = m.firstChild;
      for (const $ of A) {
        const S = y.get($.name);
        S && (z === S ? z = z.nextSibling : m.insertBefore(S, z));
      }
      const V = s.dataset.flowSchemaNodeSub === "1";
      if (D.nodeClass || s.dataset.flowSchemaNodeClass || V) {
        let $ = null, S = !1;
        if (D.nodeClass)
          try {
            $ = D.nodeClass({
              node: E,
              isNew: T
            });
          } catch (N) {
            console.error("[alpineflow] schemaNodeClass threw:", N), S = !0;
          }
        if (!S)
          if (Zs($)) {
            const N = $;
            Ve(s, "flowSchemaNodeClass", N.node), Ve(g, "flowSchemaNodeClass", N.header), Ve(m, "flowSchemaNodeClass", N.body), s.dataset.flowSchemaNodeSub = "1";
          } else
            Ve(s, "flowSchemaNodeClass", $), V && (Ve(g, "flowSchemaNodeClass", null), Ve(m, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub);
      }
      if (D.nodeDecorator)
        try {
          D.nodeDecorator({
            host: s,
            header: g,
            body: m,
            node: E,
            isNew: T
          });
        } catch ($) {
          console.error("[alpineflow] schemaNodeDecorator threw:", $);
        }
      f();
    }, x = (E, b) => {
      E.dataset.flowSchemaField !== b.name && (E.dataset.flowSchemaField = b.name), E.classList.toggle("flow-schema-row--pk", b.key === "primary"), E.classList.toggle("flow-schema-row--fk", b.key === "foreign"), E.classList.toggle("flow-schema-row--required", !!b.required);
      let T = E.querySelector(".flow-schema-row-icon");
      const D = E.querySelector(".flow-schema-row-name");
      b.icon ? (T || (T = document.createElement("span"), T.className = "flow-schema-row-icon", E.insertBefore(T, D)), T.textContent !== b.icon && (T.textContent = b.icon)) : T && T.remove(), D && D.textContent !== b.name && (D.textContent = b.name);
      const L = E.querySelector(".flow-schema-row-type");
      L && L.textContent !== b.type && (L.textContent = b.type);
    }, C = (E, b, T, D) => {
      const L = document.createElement("div");
      L.className = "flow-schema-row", L.dataset.flowSchemaField = E.name, E.key === "primary" && L.classList.add("flow-schema-row--pk"), E.key === "foreign" && L.classList.add("flow-schema-row--fk"), E.required && L.classList.add("flow-schema-row--required"), b && L.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${b}.${E.name}`)
      ), T && L.setAttribute("x-schema-reorderable", ""), D && b && L.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${b}.${E.name}`)
      );
      const A = document.createElement("div");
      if (A.className = "flow-schema-handle flow-schema-handle--target", A.setAttribute("x-flow-handle:target.left", JSON.stringify(E.name)), L.appendChild(A), E.icon) {
        const R = document.createElement("span");
        R.className = "flow-schema-row-icon", R.textContent = E.icon, L.appendChild(R);
      }
      const P = document.createElement("span");
      P.className = "flow-schema-row-name", P.textContent = E.name, L.appendChild(P);
      const v = document.createElement("span");
      v.className = "flow-schema-row-type", v.textContent = E.type, L.appendChild(v);
      const w = document.createElement("div");
      w.className = "flow-schema-handle flow-schema-handle--source", w.setAttribute("x-flow-handle:source.right", JSON.stringify(E.name)), L.appendChild(w);
      const I = document.createElement("div");
      I.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", I.setAttribute("x-flow-handle:target.right", JSON.stringify(E.name)), L.appendChild(I);
      const M = document.createElement("div");
      return M.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", M.setAttribute("x-flow-handle:source.left", JSON.stringify(E.name)), L.appendChild(M), L;
    };
    i(() => {
      if (!s.isConnected) return;
      const E = a()?.data;
      E?.label, E?.kind;
      const b = E?.fields;
      if (Array.isArray(b))
        for (const T of b)
          T.name, T.type, T.key, T.required, T.icon, T.description, T.deprecated, T.tags, T.defaultValue;
      k();
    }), r(() => {
      p = !0;
      for (const E of y.values())
        t.destroyTree(E);
      y.clear(), Fo(s), g = null, m = null, s.classList.remove("flow-schema-node"), Ve(s, "flowSchemaNodeClass", null), delete s.dataset.flowSchemaNodeSub, h?.removeAttribute("data-flow-schema-node");
    });
  });
}
function dm(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Js(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function um(t) {
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
      Js(s);
      const d = a()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, p = document.createElement("div");
      if (p.className = "flow-wait-header", f) {
        const k = document.createElement("span");
        k.className = "flow-wait-icon", k.textContent = f, p.appendChild(k);
      }
      const g = document.createElement("span");
      g.className = "flow-wait-label", g.textContent = u, p.appendChild(g);
      const m = document.createElement("span");
      m.className = "flow-wait-duration", m.textContent = dm(h), p.appendChild(m), s.appendChild(p);
      const y = document.createElement("div");
      y.className = "flow-wait-handle flow-wait-handle--target", y.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(y);
      const _ = document.createElement("div");
      _.className = "flow-wait-handle flow-wait-handle--source", _.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(_), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = a()?.data;
      c?.durationMs, c?.label, c?.icon, l();
    }), r(() => {
      Js(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Qs = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function un(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(un).join(", ")}]` : String(t);
}
function fm(t) {
  const { field: e, op: n, value: o } = t;
  return n in Qs ? `${e} ${Qs[n]} ${un(o)}` : n === "in" ? `${e} in ${un(o)}` : n === "notIn" ? `${e} not in ${un(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${un(o)}`;
}
function er(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function hm(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function gm(t) {
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
      const u = a()?.data ?? {}, f = hm(l(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), er(s);
      const p = typeof u.label == "string" && u.label ? u.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? m.textContent = fm(u.condition) : typeof u.evaluate == "function" ? m.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : m.textContent = "", s.appendChild(m);
      const y = document.createElement("div");
      y.className = "flow-condition-handle-target", y.setAttribute("data-flow-handle-direction", "target"), y.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(y);
      const _ = document.createElement("div");
      _.className = "flow-condition-handle-source flow-condition-handle--true", _.setAttribute("data-flow-handle-direction", "source"), _.setAttribute("data-source-handle", "true"), _.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(_);
      const k = document.createElement("div");
      k.className = "flow-condition-handle-source flow-condition-handle--false", k.setAttribute("data-flow-handle-direction", "source"), k.setAttribute("data-source-handle", "false"), k.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(k), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = a()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      er(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function pm(t) {
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
function mm(t) {
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
          const p = i(n), g = f.viewport.zoom, m = p.min === void 0 || g >= p.min, y = p.max === void 0 || g <= p.max;
          e.style.display = m && y ? h : "none";
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
const ym = ["perf", "events", "viewport", "state", "activity"], tr = ["fps", "memory", "counts", "visible"], nr = 30;
function wm(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => ym.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function vm(t) {
  return t.perf ? t.perf === !0 ? [...tr] : t.perf.filter((e) => tr.includes(e)) : [];
}
function _m(t) {
  return t.events ? t.events === !0 ? nr : t.events.max ?? nr : 0;
}
function an(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function Be(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function bm(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = wm(a, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (H) => H.stopPropagation();
      e.addEventListener("wheel", u);
      const f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      p.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(p), f.appendChild(h), e.appendChild(f);
      const g = document.createElement("div");
      g.className = "flow-devtools-panel", g.style.display = "none", g.style.userSelect = "none", e.appendChild(g);
      let m = !1;
      const y = () => {
        m = !m, g.style.display = m ? "" : "none", f.title = m ? "Collapse" : "Devtools", m ? W() : Q();
      };
      f.addEventListener("click", y);
      const _ = vm(l);
      let k = null, x = null, C = null, E = null, b = null;
      if (_.length > 0) {
        const { wrapper: H, content: q } = an("Performance", "flow-devtools-perf");
        if (_.includes("fps")) {
          const { row: j, valueEl: K } = Be("FPS", "flow-devtools-fps");
          k = K, q.appendChild(j);
        }
        if (_.includes("memory")) {
          const { row: j, valueEl: K } = Be("Memory", "flow-devtools-memory");
          x = K, q.appendChild(j);
        }
        if (_.includes("counts")) {
          const j = Be("Nodes", "flow-devtools-counts");
          C = j.valueEl, q.appendChild(j.row);
          const K = Be("Edges", "flow-devtools-counts");
          E = K.valueEl, q.appendChild(K.row);
        }
        if (_.includes("visible")) {
          const { row: j, valueEl: K } = Be("Visible", "flow-devtools-visible");
          b = K, q.appendChild(j);
        }
        g.appendChild(H);
      }
      const T = _m(l);
      let D = null;
      if (T > 0) {
        const { wrapper: H, content: q } = an("Events", "flow-devtools-events"), j = document.createElement("button");
        j.className = "flow-devtools-clear-btn nopan", j.textContent = "Clear", j.addEventListener("click", () => {
          D && (D.textContent = ""), U.length = 0;
        }), H.querySelector(".flow-devtools-section-title").appendChild(j), D = document.createElement("div"), D.className = "flow-devtools-event-list", q.appendChild(D), g.appendChild(H);
      }
      let L = null, A = null, P = null;
      if (l.viewport) {
        const { wrapper: H, content: q } = an("Viewport", "flow-devtools-viewport"), j = Be("X", "flow-devtools-vp-x");
        L = j.valueEl, q.appendChild(j.row);
        const K = Be("Y", "flow-devtools-vp-y");
        A = K.valueEl, q.appendChild(K.row);
        const O = Be("Zoom", "flow-devtools-vp-zoom");
        P = O.valueEl, q.appendChild(O.row), g.appendChild(H);
      }
      let v = null;
      if (l.state) {
        const { wrapper: H, content: q } = an("Selection", "flow-devtools-state");
        v = document.createElement("div"), v.className = "flow-devtools-state-content", v.textContent = "No selection", q.appendChild(v), g.appendChild(H);
      }
      let w = null, I = null, M = null, R = null;
      if (l.activity) {
        const { wrapper: H, content: q } = an("Activity", "flow-devtools-activity"), j = Be("Animations", "flow-devtools-anim");
        w = j.valueEl, q.appendChild(j.row);
        const K = Be("Particles", "flow-devtools-particles");
        I = K.valueEl, q.appendChild(K.row);
        const O = Be("Follow", "flow-devtools-follow");
        M = O.valueEl, q.appendChild(O.row);
        const J = Be("Timelines", "flow-devtools-timelines");
        R = J.valueEl, q.appendChild(J.row), g.appendChild(H);
      }
      let z = null, V = !1, $ = 0, S = performance.now();
      const N = !!(k || x), F = () => {
        if (!V) return;
        $++;
        const H = performance.now();
        H - S >= 1e3 && (k && (k.textContent = String(Math.round($ * 1e3 / (H - S)))), $ = 0, S = H, x && performance.memory && (x.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), z = requestAnimationFrame(F);
      }, W = () => {
        !N || V || (V = !0, $ = 0, S = performance.now(), z = requestAnimationFrame(F));
      }, Q = () => {
        V = !1, z !== null && (cancelAnimationFrame(z), z = null);
      }, U = [], G = [
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
      let Z = null;
      if (T > 0 && D) {
        Z = (H) => {
          if (!m) return;
          const q = H, j = q.type.replace("flow-", "");
          let K = "";
          try {
            K = q.detail ? JSON.stringify(q.detail).slice(0, 80) : "";
          } catch {
            K = "[circular]";
          }
          U.unshift({ name: j, time: Date.now(), detail: K });
          const O = D, J = document.createElement("div");
          J.className = "flow-devtools-event-entry";
          const ne = document.createElement("span");
          ne.className = "flow-devtools-event-name", ne.textContent = j;
          const Y = document.createElement("span");
          Y.className = "flow-devtools-event-age", Y.textContent = "now";
          const re = document.createElement("span");
          for (re.className = "flow-devtools-event-detail", re.textContent = K, J.appendChild(ne), J.appendChild(Y), J.appendChild(re), O.prepend(J); O.children.length > T; )
            O.removeChild(O.lastChild), U.pop();
        };
        for (const H of G)
          d.addEventListener(H, Z);
      }
      r(() => {
        const H = t.$data(c);
        !H || !H.viewport || (L && (L.textContent = Math.round(H.viewport.x).toString()), A && (A.textContent = Math.round(H.viewport.y).toString()), P && (P.textContent = H.viewport.zoom.toFixed(2)));
      }), r(() => {
        const H = t.$data(c);
        if (H) {
          if (C && (C.textContent = String(H.nodes?.length ?? 0)), E && (E.textContent = String(H.edges?.length ?? 0)), b && H._getVisibleNodeIds && (b.textContent = String(H._getVisibleNodeIds().size)), v) {
            const q = H.selectedNodes, j = H.selectedEdges;
            if (!((q?.size ?? 0) > 0 || (j?.size ?? 0) > 0))
              v.textContent = "No selection";
            else {
              if (v.textContent = "", q && q.size > 0)
                for (const O of q) {
                  const J = H.getNode?.(O);
                  if (!J) continue;
                  const ne = document.createElement("pre");
                  ne.className = "flow-devtools-json", ne.textContent = JSON.stringify({ id: J.id, position: J.position, data: J.data }, null, 2), v.appendChild(ne);
                }
              if (j && j.size > 0)
                for (const O of j) {
                  const J = H.edges?.find((Y) => Y.id === O);
                  if (!J) continue;
                  const ne = document.createElement("pre");
                  ne.className = "flow-devtools-json", ne.textContent = JSON.stringify({ id: J.id, source: J.source, target: J.target, type: J.type }, null, 2), v.appendChild(ne);
                }
            }
          }
          if (w) {
            const q = H._animator?._groups?.size ?? 0;
            w.textContent = String(q);
          }
          I && (I.textContent = String(H._activeParticles?.size ?? 0)), M && (M.textContent = H._followHandle ? "Active" : "Idle"), R && (R.textContent = String(H._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (Q(), f.removeEventListener("click", y), Z)
          for (const H of G)
            d.removeEventListener(H, Z);
        e.removeEventListener("wheel", u), e.textContent = "", k = null, x = null, C = null, E = null, b = null, D = null, L = null, A = null, P = null, v = null, w = null, I = null, M = null, R = null;
      });
    }
  );
}
const xm = {
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
function Em(t) {
  return xm[t] ?? null;
}
function Cm(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Em(n);
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
function Sm(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Oo = /* @__PURE__ */ new WeakMap();
function km(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = Sm(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), Oo.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (l.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Oo.set(c, u);
        else if (l.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const h = Oo.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), a(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Lm(t) {
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
function Pm(t) {
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
        const h = i(n), p = Lm(h);
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
function Mm(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Ai = /* @__PURE__ */ new Map();
function Tm(t, e) {
  Ai.set(t, e);
}
function Nm(t) {
  return Ai.get(t) ?? null;
}
function Am(t) {
  return Ai.has(t);
}
function zo(t) {
  return `alpineflow-snapshot-${t}`;
}
function $m(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = Mm(n, i);
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
            l.persist ? localStorage.setItem(zo(f), JSON.stringify(h)) : Tm(f, h);
          } else {
            let h = null;
            if (l.persist) {
              const p = localStorage.getItem(zo(f));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = Nm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), l.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        l.persist ? h = localStorage.getItem(zo(f)) !== null : (d.nodes.length, h = Am(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Im(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function Dm(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Im(s._loadingText));
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
function Rm(t) {
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
        const m = i("edge");
        m && t.addScopeToNode(e, { edge: m });
      } catch {
      }
      u.appendChild(e), e.classList.add("flow-edge-toolbar"), e.style.position = "absolute";
      const f = (m) => {
        m.stopPropagation();
      }, h = (m) => {
        m.stopPropagation();
      };
      e.addEventListener("pointerdown", f), e.addEventListener("click", h);
      const p = o.includes("below"), g = 20;
      r(() => {
        if (!d.edges.some((D) => D.id === l)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const m = d.viewport?.zoom || 1, y = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let _ = 0.5;
        if (n) {
          const D = i(n);
          typeof D == "number" && (_ = D);
        }
        const k = a.querySelectorAll("path"), x = k.length > 1 ? k[1] : k[0];
        if (!x) return;
        const C = x.getTotalLength?.();
        if (!C) return;
        const E = x.getPointAtLength(C * Math.max(0, Math.min(1, _))), b = y / m, T = p ? b : -b;
        e.style.left = `${E.x}px`, e.style.top = `${E.y + T}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / m}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function Hm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function Fm(t) {
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
function ow(t, e, n) {
  const o = n?.defaultDimensions?.width ?? ve, i = n?.defaultDimensions?.height ?? be, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", l = t.filter((y) => !y.hidden).map((y) => ({
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
      style: typeof y.style == "string" ? y.style : Object.entries(y.style).map(([_, k]) => `${_}:${k}`).join(";")
    } : {},
    data: y.data ?? {}
  })), u = e.filter((y) => !y.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const y of u) {
    const _ = c.get(y.source), k = c.get(y.target);
    if (!_ || !k)
      continue;
    let x, C;
    try {
      const L = co(
        y,
        _,
        k,
        _.sourcePosition ?? "bottom",
        k.targetPosition ?? "top"
      );
      x = L.path, C = L.labelPosition;
    } catch {
      continue;
    }
    let E, b;
    if (y.markerStart) {
      const L = Vt(y.markerStart), A = Bt(L, s);
      h.has(A) || h.set(A, oo(L, A)), E = `url(#${A})`;
    }
    if (y.markerEnd) {
      const L = Vt(y.markerEnd), A = Bt(L, s);
      h.has(A) || h.set(A, oo(L, A)), b = `url(#${A})`;
    }
    let T, D;
    if (y.label)
      if (C)
        T = C.x, D = C.y;
      else {
        const L = _.position.x + _.dimensions.width / 2, A = _.position.y + _.dimensions.height / 2, P = k.position.x + k.dimensions.width / 2, v = k.position.y + k.dimensions.height / 2;
        T = (L + P) / 2, D = (A + v) / 2;
      }
    f.push({
      id: y.id,
      source: y.source,
      target: y.target,
      pathD: x,
      ...E ? { markerStart: E } : {},
      ...b ? { markerEnd: b } : {},
      ...y.class ? { class: y.class } : {},
      ...y.label ? { label: y.label } : {},
      ...T !== void 0 ? { labelX: T } : {},
      ...D !== void 0 ? { labelY: D } : {}
    });
  }
  const p = Array.from(h.values()).join(`
`);
  let g, m;
  if (l.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, m = { x: 0, y: 0, zoom: 1 };
  else {
    const y = Wt(l);
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
const or = /* @__PURE__ */ new WeakSet();
function iw(t) {
  or.has(t) || (or.add(t), qa(t), Fm(t), pp(t), kp(t), Gf(t), Ff(t), Of(t), zf(t), cp(t), Tp(t), Ip(t), Dp(t), Hp(t), Op(t), Kp(t), Jp(t), tm(t), om(t), rm(t), am(t), lm(t), pm(t), mm(t), bm(t), Cm(t), km(t), Pm(t), $m(t), Dm(t), Rm(t), cm(t), um(t), gm(t), Hm(t));
}
function Om(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
const zm = [
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
function Vm(t) {
  const e = t.querySelectorAll(
    "svg path, svg line, svg polyline, svg polygon, svg circle, svg ellipse, svg rect, svg text"
  ), n = [];
  for (const o of e) {
    const i = getComputedStyle(o), r = [];
    for (const s of zm) {
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
const Bm = 16384, qm = 4e7, Xm = 8;
function Ym(t, e, n) {
  if (typeof t != "number" || !Number.isFinite(t) || t <= 0) return 1;
  const o = Bm / Math.max(e, n), i = Math.sqrt(qm / Math.max(1, e * n)), r = Math.max(1, Math.min(Xm, o, i));
  return Math.min(t, r);
}
const Wm = 0.92;
function jm(t) {
  return typeof t != "number" || !Number.isFinite(t) ? Wm : Math.min(1, Math.max(0, t));
}
function Um(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function Gm(t, e) {
  const n = t.indexOf(">");
  if (n === -1) return t;
  const o = `<rect width="100%" height="100%" fill="${Um(e)}"/>`;
  return t.slice(0, n + 1) + o + t.slice(n + 1);
}
function Zm(t, e, n, o, i = 1, r = "png", s) {
  return new Promise((a, l) => {
    const c = new Image();
    c.onload = () => {
      const d = document.createElement("canvas");
      d.width = Math.round(e * i), d.height = Math.round(n * i);
      const u = d.getContext("2d");
      u.scale(i, i), u.fillStyle = o, u.fillRect(0, 0, e, n), u.drawImage(c, 0, 0, e, n), a(
        r === "jpeg" ? d.toDataURL("image/jpeg", jm(s)) : d.toDataURL("image/png")
      );
    }, c.onerror = () => {
      l(new Error("Failed to render SVG to image"));
    }, c.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t);
  });
}
async function Km(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => Uy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, m = t.style.overflow, y = [];
  let _ = null;
  try {
    if (s === "all") {
      const P = t.querySelectorAll("[data-flow-culled]");
      for (const R of P)
        R.style.display = "", y.push(R);
      const v = n.filter((R) => !R.hidden), w = Wt(v), I = i.padding ?? 0.1, M = Qn(
        w,
        l,
        c,
        0.1,
        // minZoom
        2,
        // maxZoom
        I
      );
      e.style.transform = `translate(${M.x}px, ${M.y}px) scale(${M.zoom})`, e.style.width = `${l}px`, e.style.height = `${c}px`;
    }
    t.style.width = `${l}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((P) => requestAnimationFrame(P)), _ = Vm(t);
    const k = i.includeOverlays, x = k === !0, C = typeof k == "object" ? k : {}, E = [
      ["canvas-overlay", x || (C.toolbar ?? !1)],
      ["flow-minimap", x || (C.minimap ?? !1)],
      ["flow-controls", x || (C.controls ?? !1)],
      ["flow-panel", x || (C.panels ?? !1)],
      ["flow-selection-box", !1]
    ], b = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: (P) => {
        if (P.classList) {
          for (const [v, w] of E)
            if (P.classList.contains(v) && !w) return !1;
        }
        return !0;
      }
    }), T = "data:image/svg+xml;charset=utf-8,", D = Om(decodeURIComponent(b.substring(T.length))), L = i.format ?? "png";
    let A;
    if (L === "svg")
      A = T + encodeURIComponent(Gm(D, d));
    else {
      const P = Ym(i.scale, l, c);
      A = await Zm(
        D,
        l,
        c,
        d,
        P,
        L,
        i.quality
      );
    }
    if (i.filename) {
      const P = document.createElement("a");
      P.download = i.filename, P.href = A, P.click();
    }
    return A;
  } finally {
    _?.(), e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = m;
    for (const k of y)
      k.style.display = "none";
  }
}
const Jm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: Km
}, Symbol.toStringTag, { value: "Module" }));
function Qm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const ey = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function vt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let Dt = null;
function $a(t = {}) {
  return Dt || (t.includeStyleProperties ? (Dt = t.includeStyleProperties, Dt) : (Dt = vt(window.getComputedStyle(document.documentElement)), Dt));
}
function ho(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function ty(t) {
  const e = ho(t, "border-left-width"), n = ho(t, "border-right-width");
  return t.clientWidth + e + n;
}
function ny(t) {
  const e = ho(t, "border-top-width"), n = ho(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function $i(t, e = {}) {
  const n = e.width || ty(t), o = e.height || ny(t);
  return { width: n, height: o };
}
function oy() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Re = 16384;
function iy(t) {
  (t.width > Re || t.height > Re) && (t.width > Re && t.height > Re ? t.width > t.height ? (t.height *= Re / t.width, t.width = Re) : (t.width *= Re / t.height, t.height = Re) : t.width > Re ? (t.height *= Re / t.width, t.width = Re) : (t.width *= Re / t.height, t.height = Re));
}
function sy(t, e = {}) {
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
async function ry(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function ay(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), ry(i);
}
const $e = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || $e(n, e);
};
function ly(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function cy(t, e) {
  return $a(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function dy(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? ly(n) : cy(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function ir(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = ey();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(dy(s, n, i, o)), e.appendChild(a);
}
function uy(t, e, n) {
  ir(t, e, ":before", n), ir(t, e, ":after", n);
}
const sr = "application/font-woff", rr = "image/jpeg", fy = {
  woff: sr,
  woff2: sr,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: rr,
  jpeg: rr,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function hy(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Ii(t) {
  const e = hy(t).toLowerCase();
  return fy[e] || "";
}
function gy(t) {
  return t.split(/,/)[1];
}
function ui(t) {
  return t.search(/^(data:)/) !== -1;
}
function py(t, e) {
  return `data:${e};base64,${t}`;
}
async function Ia(t, e, n) {
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
const Vo = {};
function my(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Di(t, e, n) {
  const o = my(t, e, n.includeQueryParams);
  if (Vo[o] != null)
    return Vo[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await Ia(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), gy(a)));
    i = py(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Vo[o] = i, i;
}
async function yy(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : go(e);
}
async function wy(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return go(a);
  }
  const n = t.poster, o = Ii(n), i = await Di(n, o, e);
  return go(i);
}
async function vy(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await Co(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function _y(t, e) {
  return $e(t, HTMLCanvasElement) ? yy(t) : $e(t, HTMLVideoElement) ? wy(t, e) : $e(t, HTMLIFrameElement) ? vy(t, e) : t.cloneNode(Da(t));
}
const by = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", Da = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function xy(t, e, n) {
  var o, i;
  if (Da(e))
    return e;
  let r = [];
  return by(t) && t.assignedNodes ? r = vt(t.assignedNodes()) : $e(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = vt(t.contentDocument.body.childNodes) : r = vt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || $e(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => Co(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function Ey(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : $a(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), $e(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Cy(t, e) {
  $e(t, HTMLTextAreaElement) && (e.innerHTML = t.value), $e(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Sy(t, e) {
  if ($e(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function ky(t, e, n) {
  return $e(e, Element) && (Ey(t, e, n), uy(t, e, n), Cy(t, e), Sy(t, e)), e;
}
async function Ly(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await Co(c, e, !0));
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
async function Co(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => _y(o, e)).then((o) => xy(t, o, e)).then((o) => ky(t, o, e)).then((o) => Ly(o, e));
}
const Ra = /url\((['"]?)([^'"]+?)\1\)/g, Py = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, My = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Ty(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Ny(t) {
  const e = [];
  return t.replace(Ra, (n, o, i) => (e.push(i), n)), e.filter((n) => !ui(n));
}
async function Ay(t, e, n, o, i) {
  try {
    const r = n ? Qm(e, n) : e, s = Ii(e);
    let a;
    return i || (a = await Di(r, s, o)), t.replace(Ty(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function $y(t, { preferredFontFormat: e }) {
  return e ? t.replace(My, (n) => {
    for (; ; ) {
      const [o, , i] = Py.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function Ha(t) {
  return t.search(Ra) !== -1;
}
async function Fa(t, e, n) {
  if (!Ha(t))
    return t;
  const o = $y(t, n);
  return Ny(o).reduce((r, s) => r.then((a) => Ay(a, s, e, n)), Promise.resolve(o));
}
async function Rt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Fa(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function Iy(t, e) {
  await Rt("background", t, e) || await Rt("background-image", t, e), await Rt("mask", t, e) || await Rt("-webkit-mask", t, e) || await Rt("mask-image", t, e) || await Rt("-webkit-mask-image", t, e);
}
async function Dy(t, e) {
  const n = $e(t, HTMLImageElement);
  if (!(n && !ui(t.src)) && !($e(t, SVGImageElement) && !ui(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Di(o, Ii(o), e);
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
async function Ry(t, e) {
  const o = vt(t.childNodes).map((i) => Oa(i, e));
  await Promise.all(o).then(() => t);
}
async function Oa(t, e) {
  $e(t, Element) && (await Iy(t, e), await Dy(t, e), await Ry(t, e));
}
function Hy(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const ar = {};
async function lr(t) {
  let e = ar[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, ar[t] = e, e;
}
async function cr(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Ia(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function dr(t) {
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
async function Fy(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        vt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = lr(l).then((d) => cr(d, e)).then((d) => dr(d).forEach((u) => {
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
        i.href != null && o.push(lr(i.href).then((a) => cr(a, e)).then((a) => dr(a).forEach((l) => {
          s.insertRule(l, s.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        vt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function Oy(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Ha(e.style.getPropertyValue("src")));
}
async function zy(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = vt(t.ownerDocument.styleSheets), o = await Fy(n, e);
  return Oy(o);
}
function za(t) {
  return t.trim().replace(/["']/g, "");
}
function Vy(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(za(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function Va(t, e) {
  const n = await zy(t, e), o = Vy(t);
  return (await Promise.all(n.filter((r) => o.has(za(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Fa(r.cssText, s, e);
  }))).join(`
`);
}
async function By(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Va(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function Ba(t, e = {}) {
  const { width: n, height: o } = $i(t, e), i = await Co(t, e, !0);
  return await By(i, e), await Oa(i, e), Hy(i, e), await ay(i, n, o);
}
async function Pn(t, e = {}) {
  const { width: n, height: o } = $i(t, e), i = await Ba(t, e), r = await go(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || oy(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || iy(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function qy(t, e = {}) {
  const { width: n, height: o } = $i(t, e);
  return (await Pn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function Xy(t, e = {}) {
  return (await Pn(t, e)).toDataURL();
}
async function Yy(t, e = {}) {
  return (await Pn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function Wy(t, e = {}) {
  const n = await Pn(t, e);
  return await sy(n);
}
async function jy(t, e = {}) {
  return Va(t, e);
}
const Uy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: jy,
  toBlob: Wy,
  toCanvas: Pn,
  toJpeg: Yy,
  toPixelData: qy,
  toPng: Xy,
  toSvg: Ba
}, Symbol.toStringTag, { value: "Module" }));
export {
  Lh as ComputeEngine,
  lf as FlowHistory,
  ws as SHORTCUT_DEFAULTS,
  Jy as along,
  Rf as areNodesConnected,
  ha as buildNodeMap,
  pa as clampToExtent,
  To as clampToParent,
  ow as computeRenderPlan,
  Ls as computeValidationErrors,
  ga as computeZIndex,
  iw as default,
  ew as drift,
  ph as expandParentToFitChild,
  ii as getAbsolutePosition,
  Yf as getAutoPanDelta,
  io as getBezierPath,
  $f as getConnectedEdges,
  wt as getDescendantIds,
  Os as getEdgePosition,
  La as getFloatingEdgeParams,
  If as getIncomers,
  Fs as getNodeIntersection,
  Wt as getNodesBounds,
  Af as getNodesFullyInPolygon,
  tf as getNodesFullyInRect,
  Nf as getNodesInPolygon,
  ef as getNodesInRect,
  ti as getOutgoers,
  Gy as getSimpleBezierPath,
  nw as getSimpleFloatingPosition,
  bn as getSmoothStepPath,
  Xf as getStepPath,
  ta as getStraightPath,
  Qn as getViewportForBounds,
  qe as isConnectable,
  Vf as isDeletable,
  ea as isDraggable,
  gs as isResizable,
  ni as isSelectable,
  Ge as matchesKey,
  mt as matchesModifier,
  Zy as orbit,
  Qy as pendulum,
  Si as pointInPolygon,
  Tf as polygonIntersectsAABB,
  yf as registerMarker,
  hn as resolveChildValidation,
  Zf as resolveShortcuts,
  Mt as sortNodesTopological,
  tw as stagger,
  yt as toAbsoluteNode,
  ro as toAbsoluteNodes,
  va as validateChildAdd,
  ao as validateChildRemove,
  Ky as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
