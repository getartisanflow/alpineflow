let zo = null;
function Oa(t) {
  zo = t;
}
function Ce() {
  if (!zo)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return zo;
}
var za = { value: () => {
} };
function go() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new On(n);
}
function On(t) {
  this._ = t;
}
function Va(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
On.prototype = go.prototype = {
  constructor: On,
  on: function(t, e) {
    var n = this._, o = Va(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Ba(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Di(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Di(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new On(t);
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
function Ba(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Di(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = za, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Vo = "http://www.w3.org/1999/xhtml";
const Hi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Vo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function po(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Hi.hasOwnProperty(e) ? { space: Hi[e], local: t } : t;
}
function qa(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Vo && e.documentElement.namespaceURI === Vo ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Ya(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function rr(t) {
  var e = po(t);
  return (e.local ? Ya : qa)(e);
}
function Xa() {
}
function di(t) {
  return t == null ? Xa : function() {
    return this.querySelector(t);
  };
}
function Wa(t) {
  typeof t != "function" && (t = di(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Fe(o, this._parents);
}
function ja(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Ua() {
  return [];
}
function ar(t) {
  return t == null ? Ua : function() {
    return this.querySelectorAll(t);
  };
}
function Ga(t) {
  return function() {
    return ja(t.apply(this, arguments));
  };
}
function Za(t) {
  typeof t == "function" ? t = Ga(t) : t = ar(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new Fe(o, i);
}
function lr(t) {
  return function() {
    return this.matches(t);
  };
}
function cr(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Ka = Array.prototype.find;
function Ja(t) {
  return function() {
    return Ka.call(this.children, t);
  };
}
function Qa() {
  return this.firstElementChild;
}
function el(t) {
  return this.select(t == null ? Qa : Ja(typeof t == "function" ? t : cr(t)));
}
var tl = Array.prototype.filter;
function nl() {
  return Array.from(this.children);
}
function ol(t) {
  return function() {
    return tl.call(this.children, t);
  };
}
function il(t) {
  return this.selectAll(t == null ? nl : ol(typeof t == "function" ? t : cr(t)));
}
function sl(t) {
  typeof t != "function" && (t = lr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Fe(o, this._parents);
}
function dr(t) {
  return new Array(t.length);
}
function rl() {
  return new Fe(this._enter || this._groups.map(dr), this._parents);
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
function al(t) {
  return function() {
    return t;
  };
}
function ll(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Yn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function cl(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (f[a] = h = s.call(l, l.__data__, a, e) + "", c.has(h) ? i[a] = l : c.set(h, l));
  for (a = 0; a < u; ++a)
    h = s.call(t, r[a], a, r) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = r[a], c.delete(h)) : n[a] = new Yn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(f[a]) === l && (i[a] = l);
}
function dl(t) {
  return t.__data__;
}
function ul(t, e) {
  if (!arguments.length) return Array.from(this, dl);
  var n = e ? cl : ll, o = this._parents, i = this._groups;
  typeof t != "function" && (t = al(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = fl(t.call(d, d && d.__data__, c, o)), p = h.length, g = a[c] = new Array(p), m = s[c] = new Array(p), y = l[c] = new Array(f);
    n(d, u, g, m, y, h, e);
    for (var _ = 0, S = 0, x, b; _ < p; ++_)
      if (x = g[_]) {
        for (_ >= S && (S = _ + 1); !(b = m[S]) && ++S < p; ) ;
        x._next = b || null;
      }
  }
  return s = new Fe(s, o), s._enter = a, s._exit = l, s;
}
function fl(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function hl() {
  return new Fe(this._exit || this._groups.map(dr), this._parents);
}
function gl(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function pl(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], u = c.length, f = a[l] = new Array(u), h, p = 0; p < u; ++p)
      (h = c[p] || d[p]) && (f[p] = h);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Fe(a, this._parents);
}
function ml() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function yl(t) {
  t || (t = wl);
  function e(u, f) {
    return u && f ? t(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), c, d = 0; d < a; ++d)
      (c = s[d]) && (l[d] = c);
    l.sort(e);
  }
  return new Fe(i, this._parents).order();
}
function wl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function vl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function _l() {
  return Array.from(this);
}
function bl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function xl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function El() {
  return !this.node();
}
function Cl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function Sl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function kl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Ll(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Pl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Ml(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Tl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function Al(t, e) {
  var n = po(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? kl : Sl : typeof e == "function" ? n.local ? Tl : Ml : n.local ? Pl : Ll)(n, e));
}
function ur(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Nl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function $l(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Il(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Dl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Nl : typeof e == "function" ? Il : $l)(t, e, n ?? "")) : Vt(this.node(), t);
}
function Vt(t, e) {
  return t.style.getPropertyValue(e) || ur(t).getComputedStyle(t, null).getPropertyValue(e);
}
function Hl(t) {
  return function() {
    delete this[t];
  };
}
function Rl(t, e) {
  return function() {
    this[t] = e;
  };
}
function Fl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function Ol(t, e) {
  return arguments.length > 1 ? this.each((e == null ? Hl : typeof e == "function" ? Fl : Rl)(t, e)) : this.node()[t];
}
function fr(t) {
  return t.trim().split(/^|\s+/);
}
function ui(t) {
  return t.classList || new hr(t);
}
function hr(t) {
  this._node = t, this._names = fr(t.getAttribute("class") || "");
}
hr.prototype = {
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
function gr(t, e) {
  for (var n = ui(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function pr(t, e) {
  for (var n = ui(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function zl(t) {
  return function() {
    gr(this, t);
  };
}
function Vl(t) {
  return function() {
    pr(this, t);
  };
}
function Bl(t, e) {
  return function() {
    (e.apply(this, arguments) ? gr : pr)(this, t);
  };
}
function ql(t, e) {
  var n = fr(t + "");
  if (arguments.length < 2) {
    for (var o = ui(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Bl : e ? zl : Vl)(n, e));
}
function Yl() {
  this.textContent = "";
}
function Xl(t) {
  return function() {
    this.textContent = t;
  };
}
function Wl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function jl(t) {
  return arguments.length ? this.each(t == null ? Yl : (typeof t == "function" ? Wl : Xl)(t)) : this.node().textContent;
}
function Ul() {
  this.innerHTML = "";
}
function Gl(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Zl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Kl(t) {
  return arguments.length ? this.each(t == null ? Ul : (typeof t == "function" ? Zl : Gl)(t)) : this.node().innerHTML;
}
function Jl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ql() {
  return this.each(Jl);
}
function ec() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function tc() {
  return this.each(ec);
}
function nc(t) {
  var e = typeof t == "function" ? t : rr(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function oc() {
  return null;
}
function ic(t, e) {
  var n = typeof t == "function" ? t : rr(t), o = e == null ? oc : typeof e == "function" ? e : di(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function sc() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function rc() {
  return this.each(sc);
}
function ac() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function lc() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function cc(t) {
  return this.select(t ? lc : ac);
}
function dc(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function uc(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function fc(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function hc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function gc(t, e, n) {
  return function() {
    var o = this.__on, i, r = uc(e);
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
function pc(t, e, n) {
  var o = fc(t + ""), i, r = o.length, s;
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
  for (a = e ? gc : hc, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function mr(t, e, n) {
  var o = ur(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function mc(t, e) {
  return function() {
    return mr(this, t, e);
  };
}
function yc(t, e) {
  return function() {
    return mr(this, t, e.apply(this, arguments));
  };
}
function wc(t, e) {
  return this.each((typeof e == "function" ? yc : mc)(t, e));
}
function* vc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var yr = [null];
function Fe(t, e) {
  this._groups = t, this._parents = e;
}
function xn() {
  return new Fe([[document.documentElement]], yr);
}
function _c() {
  return this;
}
Fe.prototype = xn.prototype = {
  constructor: Fe,
  select: Wa,
  selectAll: Za,
  selectChild: el,
  selectChildren: il,
  filter: sl,
  data: ul,
  enter: rl,
  exit: hl,
  join: gl,
  merge: pl,
  selection: _c,
  order: ml,
  sort: yl,
  call: vl,
  nodes: _l,
  node: bl,
  size: xl,
  empty: El,
  each: Cl,
  attr: Al,
  style: Dl,
  property: Ol,
  classed: ql,
  text: jl,
  html: Kl,
  raise: Ql,
  lower: tc,
  append: nc,
  insert: ic,
  remove: rc,
  clone: cc,
  datum: dc,
  on: pc,
  dispatch: wc,
  [Symbol.iterator]: vc
};
function Ye(t) {
  return typeof t == "string" ? new Fe([[document.querySelector(t)]], [document.documentElement]) : new Fe([[t]], yr);
}
function bc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Qe(t, e) {
  if (t = bc(t), e === void 0 && (e = t.currentTarget), e) {
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
const xc = { passive: !1 }, fn = { capture: !0, passive: !1 };
function Eo(t) {
  t.stopImmediatePropagation();
}
function Rt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function wr(t) {
  var e = t.document.documentElement, n = Ye(t).on("dragstart.drag", Rt, fn);
  "onselectstart" in e ? n.on("selectstart.drag", Rt, fn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function vr(t, e) {
  var n = t.document.documentElement, o = Ye(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Rt, fn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Pn = (t) => () => t;
function Bo(t, {
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
Bo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function Ec(t) {
  return !t.ctrlKey && !t.button;
}
function Cc() {
  return this.parentNode;
}
function Sc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function kc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Lc() {
  var t = Ec, e = Cc, n = Sc, o = kc, i = {}, r = go("start", "drag", "end"), s = 0, a, l, c, d, u = 0;
  function f(x) {
    x.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", y, xc).on("touchend.drag touchcancel.drag", _).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(x, b) {
    if (!(d || !t.call(this, x, b))) {
      var C = S(this, e.call(this, x, b), x, b, "mouse");
      C && (Ye(x.view).on("mousemove.drag", p, fn).on("mouseup.drag", g, fn), wr(x.view), Eo(x), c = !1, a = x.clientX, l = x.clientY, C("start", x));
    }
  }
  function p(x) {
    if (Rt(x), !c) {
      var b = x.clientX - a, C = x.clientY - l;
      c = b * b + C * C > u;
    }
    i.mouse("drag", x);
  }
  function g(x) {
    Ye(x.view).on("mousemove.drag mouseup.drag", null), vr(x.view, c), Rt(x), i.mouse("end", x);
  }
  function m(x, b) {
    if (t.call(this, x, b)) {
      var C = x.changedTouches, E = e.call(this, x, b), T = C.length, I, M;
      for (I = 0; I < T; ++I)
        (M = S(this, E, x, b, C[I].identifier, C[I])) && (Eo(x), M("start", x, C[I]));
    }
  }
  function y(x) {
    var b = x.changedTouches, C = b.length, E, T;
    for (E = 0; E < C; ++E)
      (T = i[b[E].identifier]) && (Rt(x), T("drag", x, b[E]));
  }
  function _(x) {
    var b = x.changedTouches, C = b.length, E, T;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), E = 0; E < C; ++E)
      (T = i[b[E].identifier]) && (Eo(x), T("end", x, b[E]));
  }
  function S(x, b, C, E, T, I) {
    var M = r.copy(), A = Qe(I || C, b), P, v, w;
    if ((w = n.call(x, new Bo("beforestart", {
      sourceEvent: C,
      target: f,
      identifier: T,
      active: s,
      x: A[0],
      y: A[1],
      dx: 0,
      dy: 0,
      dispatch: M
    }), E)) != null)
      return P = w.x - A[0] || 0, v = w.y - A[1] || 0, function N(k, R, O) {
        var q = A, D;
        switch (k) {
          case "start":
            i[T] = N, D = s++;
            break;
          case "end":
            delete i[T], --s;
          // falls through
          case "drag":
            A = Qe(O || R, b), D = s;
            break;
        }
        M.call(
          k,
          x,
          new Bo(k, {
            sourceEvent: R,
            subject: w,
            target: f,
            identifier: T,
            active: D,
            x: A[0] + P,
            y: A[1] + v,
            dx: A[0] - q[0],
            dy: A[1] - q[1],
            dispatch: M
          }),
          E
        );
      };
  }
  return f.filter = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : Pn(!!x), f) : t;
  }, f.container = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : Pn(x), f) : e;
  }, f.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : Pn(x), f) : n;
  }, f.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : Pn(!!x), f) : o;
  }, f.on = function() {
    var x = r.on.apply(r, arguments);
    return x === r ? f : x;
  }, f.clickDistance = function(x) {
    return arguments.length ? (u = (x = +x) * x, f) : Math.sqrt(u);
  }, f;
}
function fi(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function _r(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function En() {
}
var hn = 0.7, Xn = 1 / hn, Ft = "\\s*([+-]?\\d+)\\s*", gn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ze = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Pc = /^#([0-9a-f]{3,8})$/, Mc = new RegExp(`^rgb\\(${Ft},${Ft},${Ft}\\)$`), Tc = new RegExp(`^rgb\\(${Ze},${Ze},${Ze}\\)$`), Ac = new RegExp(`^rgba\\(${Ft},${Ft},${Ft},${gn}\\)$`), Nc = new RegExp(`^rgba\\(${Ze},${Ze},${Ze},${gn}\\)$`), $c = new RegExp(`^hsl\\(${gn},${Ze},${Ze}\\)$`), Ic = new RegExp(`^hsla\\(${gn},${Ze},${Ze},${gn}\\)$`), Ri = {
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
fi(En, pn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Fi,
  // Deprecated! Use color.formatHex.
  formatHex: Fi,
  formatHex8: Dc,
  formatHsl: Hc,
  formatRgb: Oi,
  toString: Oi
});
function Fi() {
  return this.rgb().formatHex();
}
function Dc() {
  return this.rgb().formatHex8();
}
function Hc() {
  return br(this).formatHsl();
}
function Oi() {
  return this.rgb().formatRgb();
}
function pn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Pc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? zi(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Mn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Mn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = Mc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = Tc.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = Ac.exec(t)) ? Mn(e[1], e[2], e[3], e[4]) : (e = Nc.exec(t)) ? Mn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = $c.exec(t)) ? qi(e[1], e[2] / 100, e[3] / 100, 1) : (e = Ic.exec(t)) ? qi(e[1], e[2] / 100, e[3] / 100, e[4]) : Ri.hasOwnProperty(t) ? zi(Ri[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function zi(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Mn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function Rc(t) {
  return t instanceof En || (t = pn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function qo(t, e, n, o) {
  return arguments.length === 1 ? Rc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
fi(Ne, qo, _r(En, {
  brighter(t) {
    return t = t == null ? Xn : Math.pow(Xn, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? hn : Math.pow(hn, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ne(St(this.r), St(this.g), St(this.b), Wn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Vi,
  // Deprecated! Use color.formatHex.
  formatHex: Vi,
  formatHex8: Fc,
  formatRgb: Bi,
  toString: Bi
}));
function Vi() {
  return `#${Ct(this.r)}${Ct(this.g)}${Ct(this.b)}`;
}
function Fc() {
  return `#${Ct(this.r)}${Ct(this.g)}${Ct(this.b)}${Ct((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Bi() {
  const t = Wn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${St(this.r)}, ${St(this.g)}, ${St(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Wn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function St(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Ct(t) {
  return t = St(t), (t < 16 ? "0" : "") + t.toString(16);
}
function qi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Xe(t, e, n, o);
}
function br(t) {
  if (t instanceof Xe) return new Xe(t.h, t.s, t.l, t.opacity);
  if (t instanceof En || (t = pn(t)), !t) return new Xe();
  if (t instanceof Xe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Xe(s, a, l, t.opacity);
}
function Oc(t, e, n, o) {
  return arguments.length === 1 ? br(t) : new Xe(t, e, n, o ?? 1);
}
function Xe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
fi(Xe, Oc, _r(En, {
  brighter(t) {
    return t = t == null ? Xn : Math.pow(Xn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? hn : Math.pow(hn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      Co(t >= 240 ? t - 240 : t + 120, i, o),
      Co(t, i, o),
      Co(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Xe(Yi(this.h), Tn(this.s), Tn(this.l), Wn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Wn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Yi(this.h)}, ${Tn(this.s) * 100}%, ${Tn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Yi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Tn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Co(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const xr = (t) => () => t;
function zc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Vc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Bc(t) {
  return (t = +t) == 1 ? Er : function(e, n) {
    return n - e ? Vc(e, n, t) : xr(isNaN(e) ? n : e);
  };
}
function Er(t, e) {
  var n = e - t;
  return n ? zc(t, n) : xr(isNaN(t) ? e : t);
}
const Yo = (function t(e) {
  var n = Bc(e);
  function o(i, r) {
    var s = n((i = qo(i)).r, (r = qo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = Er(i.opacity, r.opacity);
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
var Xo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, So = new RegExp(Xo.source, "g");
function qc(t) {
  return function() {
    return t;
  };
}
function Yc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Xc(t, e) {
  var n = Xo.lastIndex = So.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = Xo.exec(t)) && (i = So.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: dt(o, i) })), n = So.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Yc(l[0].x) : qc(e) : (e = l.length, function(c) {
    for (var d = 0, u; d < e; ++d) a[(u = l[d]).i] = u.x(c);
    return a.join("");
  });
}
var Xi = 180 / Math.PI, Wo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Cr(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Xi,
    skewX: Math.atan(l) * Xi,
    scaleX: s,
    scaleY: a
  };
}
var An;
function Wc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Wo : Cr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function jc(t) {
  return t == null || (An || (An = document.createElementNS("http://www.w3.org/2000/svg", "g")), An.setAttribute("transform", t), !(t = An.transform.baseVal.consolidate())) ? Wo : (t = t.matrix, Cr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Sr(t, e, n, o) {
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
var Uc = Sr(Wc, "px, ", "px)", "deg)"), Gc = Sr(jc, ", ", ")", ")"), Zc = 1e-12;
function Wi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Kc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Jc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Qc = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - a, p = u - l, g = h * h + p * p, m, y;
    if (g < Zc)
      y = Math.log(f / c) / e, m = function(E) {
        return [
          a + E * h,
          l + E * p,
          c * Math.exp(e * E * y)
        ];
      };
    else {
      var _ = Math.sqrt(g), S = (f * f - c * c + o * g) / (2 * c * n * _), x = (f * f - c * c - o * g) / (2 * f * n * _), b = Math.log(Math.sqrt(S * S + 1) - S), C = Math.log(Math.sqrt(x * x + 1) - x);
      y = (C - b) / e, m = function(E) {
        var T = E * y, I = Wi(b), M = c / (n * _) * (I * Jc(e * T + b) - Kc(b));
        return [
          a + M * h,
          l + M * p,
          c * I / Wi(e * T + b)
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
var Bt = 0, rn = 0, Qt = 0, kr = 1e3, jn, an, Un = 0, Lt = 0, mo = 0, mn = typeof performance == "object" && performance.now ? performance : Date, Lr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function hi() {
  return Lt || (Lr(ed), Lt = mn.now() + mo);
}
function ed() {
  Lt = 0;
}
function Gn() {
  this._call = this._time = this._next = null;
}
Gn.prototype = Pr.prototype = {
  constructor: Gn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? hi() : +n) + (e == null ? 0 : +e), !this._next && an !== this && (an ? an._next = this : jn = this, an = this), this._call = t, this._time = n, jo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, jo());
  }
};
function Pr(t, e, n) {
  var o = new Gn();
  return o.restart(t, e, n), o;
}
function td() {
  hi(), ++Bt;
  for (var t = jn, e; t; )
    (e = Lt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Bt;
}
function ji() {
  Lt = (Un = mn.now()) + mo, Bt = rn = 0;
  try {
    td();
  } finally {
    Bt = 0, od(), Lt = 0;
  }
}
function nd() {
  var t = mn.now(), e = t - Un;
  e > kr && (mo -= e, Un = t);
}
function od() {
  for (var t, e = jn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : jn = n);
  an = t, jo(o);
}
function jo(t) {
  if (!Bt) {
    rn && (rn = clearTimeout(rn));
    var e = t - Lt;
    e > 24 ? (t < 1 / 0 && (rn = setTimeout(ji, t - mn.now() - mo)), Qt && (Qt = clearInterval(Qt))) : (Qt || (Un = mn.now(), Qt = setInterval(nd, kr)), Bt = 1, Lr(ji));
  }
}
function Ui(t, e, n) {
  var o = new Gn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var id = go("start", "end", "cancel", "interrupt"), sd = [], Mr = 0, Gi = 1, Uo = 2, zn = 3, Zi = 4, Go = 5, Vn = 6;
function yo(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  rd(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: id,
    tween: sd,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Mr
  });
}
function gi(t, e) {
  var n = je(t, e);
  if (n.state > Mr) throw new Error("too late; already scheduled");
  return n;
}
function Ke(t, e) {
  var n = je(t, e);
  if (n.state > zn) throw new Error("too late; already running");
  return n;
}
function je(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function rd(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = Pr(r, 0, n.time);
  function r(c) {
    n.state = Gi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Gi) return l();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === zn) return Ui(s);
        h.state === Zi ? (h.state = Vn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Vn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (Ui(function() {
      n.state === zn && (n.state = Zi, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Uo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Uo) {
      for (n.state = zn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Go, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Go && (n.on.call("end", t, t.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Vn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Bn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Uo && o.state < Go, o.state = Vn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function ad(t) {
  return this.each(function() {
    Bn(this, t);
  });
}
function ld(t, e) {
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
function cd(t, e, n) {
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
function dd(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = je(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? ld : cd)(n, t, e));
}
function pi(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ke(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return je(i, o).value[e];
  };
}
function Tr(t, e) {
  var n;
  return (typeof e == "number" ? dt : e instanceof pn ? Yo : (n = pn(e)) ? (e = n, Yo) : Xc)(t, e);
}
function ud(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function fd(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function hd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function gd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function pd(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function md(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function yd(t, e) {
  var n = po(t), o = n === "transform" ? Gc : Tr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? md : pd)(n, o, pi(this, "attr." + t, e)) : e == null ? (n.local ? fd : ud)(n) : (n.local ? gd : hd)(n, o, e));
}
function wd(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function vd(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function _d(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && vd(t, r)), n;
  }
  return i._value = e, i;
}
function bd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && wd(t, r)), n;
  }
  return i._value = e, i;
}
function xd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = po(t);
  return this.tween(n, (o.local ? _d : bd)(o, e));
}
function Ed(t, e) {
  return function() {
    gi(this, t).delay = +e.apply(this, arguments);
  };
}
function Cd(t, e) {
  return e = +e, function() {
    gi(this, t).delay = e;
  };
}
function Sd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? Ed : Cd)(e, t)) : je(this.node(), e).delay;
}
function kd(t, e) {
  return function() {
    Ke(this, t).duration = +e.apply(this, arguments);
  };
}
function Ld(t, e) {
  return e = +e, function() {
    Ke(this, t).duration = e;
  };
}
function Pd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? kd : Ld)(e, t)) : je(this.node(), e).duration;
}
function Md(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ke(this, t).ease = e;
  };
}
function Td(t) {
  var e = this._id;
  return arguments.length ? this.each(Md(e, t)) : je(this.node(), e).ease;
}
function Ad(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ke(this, t).ease = n;
  };
}
function Nd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(Ad(this._id, t));
}
function $d(t) {
  typeof t != "function" && (t = lr(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new rt(o, this._parents, this._name, this._id);
}
function Id(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, u = s[a] = new Array(d), f, h = 0; h < d; ++h)
      (f = l[h] || c[h]) && (u[h] = f);
  for (; a < o; ++a)
    s[a] = e[a];
  return new rt(s, this._parents, this._name, this._id);
}
function Dd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Hd(t, e, n) {
  var o, i, r = Dd(e) ? gi : Ke;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Rd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(t) : this.each(Hd(n, t, e));
}
function Fd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Od() {
  return this.on("end.remove", Fd(this._id));
}
function zd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = di(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, u, f = 0; f < l; ++f)
      (d = a[f]) && (u = t.call(d, d.__data__, f, a)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, yo(c[f], e, n, f, c, je(d, n)));
  return new rt(r, this._parents, e, n);
}
function Vd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ar(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, u = 0; u < c; ++u)
      if (d = l[u]) {
        for (var f = t.call(d, d.__data__, u, l), h, p = je(d, n), g = 0, m = f.length; g < m; ++g)
          (h = f[g]) && yo(h, e, n, g, f, p);
        r.push(f), s.push(d);
      }
  return new rt(r, s, e, n);
}
var Bd = xn.prototype.constructor;
function qd() {
  return new Bd(this._groups, this._parents);
}
function Yd(t, e) {
  var n, o, i;
  return function() {
    var r = Vt(this, t), s = (this.style.removeProperty(t), Vt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function Ar(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Xd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Vt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Wd(t, e, n) {
  var o, i, r;
  return function() {
    var s = Vt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), Vt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function jd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Ke(this, t), c = l.on, d = l.value[r] == null ? a || (a = Ar(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function Ud(t, e, n) {
  var o = (t += "") == "transform" ? Uc : Tr;
  return e == null ? this.styleTween(t, Yd(t, o)).on("end.style." + t, Ar(t)) : typeof e == "function" ? this.styleTween(t, Wd(t, o, pi(this, "style." + t, e))).each(jd(this._id, t)) : this.styleTween(t, Xd(t, o, e), n).on("end.style." + t, null);
}
function Gd(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Zd(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Gd(t, s, n)), o;
  }
  return r._value = e, r;
}
function Kd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Zd(t, e, n ?? ""));
}
function Jd(t) {
  return function() {
    this.textContent = t;
  };
}
function Qd(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function eu(t) {
  return this.tween("text", typeof t == "function" ? Qd(pi(this, "text", t)) : Jd(t == null ? "" : t + ""));
}
function tu(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function nu(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && tu(i)), e;
  }
  return o._value = t, o;
}
function ou(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, nu(t));
}
function iu() {
  for (var t = this._name, e = this._id, n = Nr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, e);
        yo(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new rt(o, this._parents, t, n);
}
function su() {
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
var ru = 0;
function rt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function Nr() {
  return ++ru;
}
var Je = xn.prototype;
rt.prototype = {
  constructor: rt,
  select: zd,
  selectAll: Vd,
  selectChild: Je.selectChild,
  selectChildren: Je.selectChildren,
  filter: $d,
  merge: Id,
  selection: qd,
  transition: iu,
  call: Je.call,
  nodes: Je.nodes,
  node: Je.node,
  size: Je.size,
  empty: Je.empty,
  each: Je.each,
  on: Rd,
  attr: yd,
  attrTween: xd,
  style: Ud,
  styleTween: Kd,
  text: eu,
  textTween: ou,
  remove: Od,
  tween: dd,
  delay: Sd,
  duration: Pd,
  ease: Td,
  easeVarying: Nd,
  end: su,
  [Symbol.iterator]: Je[Symbol.iterator]
};
const au = (t) => +t;
function lu(t) {
  return t * t;
}
function cu(t) {
  return t * (2 - t);
}
function du(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function uu(t) {
  return t * t * t;
}
function fu(t) {
  return --t * t * t + 1;
}
function $r(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Ir = Math.PI, Dr = Ir / 2;
function hu(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * Dr);
}
function gu(t) {
  return Math.sin(t * Dr);
}
function pu(t) {
  return (1 - Math.cos(Ir * t)) / 2;
}
function _t(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function mu(t) {
  return _t(1 - +t);
}
function yu(t) {
  return 1 - _t(t);
}
function wu(t) {
  return ((t *= 2) <= 1 ? _t(1 - t) : 2 - _t(t - 1)) / 2;
}
function vu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function _u(t) {
  return Math.sqrt(1 - --t * t);
}
function bu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Zo = 4 / 11, xu = 6 / 11, Eu = 8 / 11, Cu = 3 / 4, Su = 9 / 11, ku = 10 / 11, Lu = 15 / 16, Pu = 21 / 22, Mu = 63 / 64, Nn = 1 / Zo / Zo;
function Tu(t) {
  return 1 - Zn(1 - t);
}
function Zn(t) {
  return (t = +t) < Zo ? Nn * t * t : t < Eu ? Nn * (t -= xu) * t + Cu : t < ku ? Nn * (t -= Su) * t + Lu : Nn * (t -= Pu) * t + Mu;
}
function Au(t) {
  return ((t *= 2) <= 1 ? 1 - Zn(1 - t) : Zn(t - 1) + 1) / 2;
}
var mi = 1.70158, Nu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(mi), $u = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(mi), Iu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(mi), qt = 2 * Math.PI, yi = 1, wi = 0.3, Du = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return e * _t(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(yi, wi), Hu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return 1 - e * _t(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(yi, wi), Ru = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * _t(-r) * Math.sin((o - r) / n) : 2 - e * _t(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(yi, wi), Fu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: $r
};
function Ou(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function zu(t) {
  var e, n;
  t instanceof rt ? (e = t._id, t = t._name) : (e = Nr(), (n = Fu).time = hi(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && yo(l, t, e, c, s, n || Ou(l, e));
  return new rt(o, this._parents, t, e);
}
xn.prototype.interrupt = ad;
xn.prototype.transition = zu;
const $n = (t) => () => t;
function Vu(t, {
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
var Kn = new et(1, 0, 0);
et.prototype;
function ko(t) {
  t.stopImmediatePropagation();
}
function en(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Bu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function qu() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Ki() {
  return this.__zoom || Kn;
}
function Yu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function Xu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Wu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function ju() {
  var t = Bu, e = qu, n = Wu, o = Yu, i = Xu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Qc, c = go("start", "zoom", "end"), d, u, f, h = 500, p = 150, g = 0, m = 10;
  function y(w) {
    w.property("__zoom", Ki).on("wheel.zoom", T, { passive: !1 }).on("mousedown.zoom", I).on("dblclick.zoom", M).filter(i).on("touchstart.zoom", A).on("touchmove.zoom", P).on("touchend.zoom touchcancel.zoom", v).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(w, N, k, R) {
    var O = w.selection ? w.selection() : w;
    O.property("__zoom", Ki), w !== O ? b(w, N, k, R) : O.interrupt().each(function() {
      C(this, arguments).event(R).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, y.scaleBy = function(w, N, k, R) {
    y.scaleTo(w, function() {
      var O = this.__zoom.k, q = typeof N == "function" ? N.apply(this, arguments) : N;
      return O * q;
    }, k, R);
  }, y.scaleTo = function(w, N, k, R) {
    y.transform(w, function() {
      var O = e.apply(this, arguments), q = this.__zoom, D = k == null ? x(O) : typeof k == "function" ? k.apply(this, arguments) : k, L = q.invert(D), $ = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(S(_(q, $), D, L), O, s);
    }, k, R);
  }, y.translateBy = function(w, N, k, R) {
    y.transform(w, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof k == "function" ? k.apply(this, arguments) : k
      ), e.apply(this, arguments), s);
    }, null, R);
  }, y.translateTo = function(w, N, k, R, O) {
    y.transform(w, function() {
      var q = e.apply(this, arguments), D = this.__zoom, L = R == null ? x(q) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Kn.translate(L[0], L[1]).scale(D.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof k == "function" ? -k.apply(this, arguments) : -k
      ), q, s);
    }, R, O);
  };
  function _(w, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === w.k ? w : new et(N, w.x, w.y);
  }
  function S(w, N, k) {
    var R = N[0] - k[0] * w.k, O = N[1] - k[1] * w.k;
    return R === w.x && O === w.y ? w : new et(w.k, R, O);
  }
  function x(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function b(w, N, k, R) {
    w.on("start.zoom", function() {
      C(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      C(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var O = this, q = arguments, D = C(O, q).event(R), L = e.apply(O, q), $ = k == null ? x(L) : typeof k == "function" ? k.apply(O, q) : k, F = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), K = O.__zoom, ne = typeof N == "function" ? N.apply(O, q) : N, G = l(K.invert($).concat(F / K.k), ne.invert($).concat(F / ne.k));
      return function(B) {
        if (B === 1) B = ne;
        else {
          var z = G(B), Y = F / z[2];
          B = new et(Y, $[0] - z[0] * Y, $[1] - z[1] * Y);
        }
        D.zoom(null, B);
      };
    });
  }
  function C(w, N, k) {
    return !k && w.__zooming || new E(w, N);
  }
  function E(w, N) {
    this.that = w, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = e.apply(w, N), this.taps = 0;
  }
  E.prototype = {
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
      var N = Ye(this.that).datum();
      c.call(
        w,
        this.that,
        new Vu(w, {
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
    var k = C(this, N).event(w), R = this.__zoom, O = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), q = Qe(w);
    if (k.wheel)
      (k.mouse[0][0] !== q[0] || k.mouse[0][1] !== q[1]) && (k.mouse[1] = R.invert(k.mouse[0] = q)), clearTimeout(k.wheel);
    else {
      if (R.k === O) return;
      k.mouse = [q, R.invert(q)], Bn(this), k.start();
    }
    en(w), k.wheel = setTimeout(D, p), k.zoom("mouse", n(S(_(R, O), k.mouse[0], k.mouse[1]), k.extent, s));
    function D() {
      k.wheel = null, k.end();
    }
  }
  function I(w, ...N) {
    if (f || !t.apply(this, arguments)) return;
    var k = w.currentTarget, R = C(this, N, !0).event(w), O = Ye(w.view).on("mousemove.zoom", $, !0).on("mouseup.zoom", F, !0), q = Qe(w, k), D = w.clientX, L = w.clientY;
    wr(w.view), ko(w), R.mouse = [q, this.__zoom.invert(q)], Bn(this), R.start();
    function $(K) {
      if (en(K), !R.moved) {
        var ne = K.clientX - D, G = K.clientY - L;
        R.moved = ne * ne + G * G > g;
      }
      R.event(K).zoom("mouse", n(S(R.that.__zoom, R.mouse[0] = Qe(K, k), R.mouse[1]), R.extent, s));
    }
    function F(K) {
      O.on("mousemove.zoom mouseup.zoom", null), vr(K.view, R.moved), en(K), R.event(K).end();
    }
  }
  function M(w, ...N) {
    if (t.apply(this, arguments)) {
      var k = this.__zoom, R = Qe(w.changedTouches ? w.changedTouches[0] : w, this), O = k.invert(R), q = k.k * (w.shiftKey ? 0.5 : 2), D = n(S(_(k, q), R, O), e.apply(this, N), s);
      en(w), a > 0 ? Ye(this).transition().duration(a).call(b, D, R, w) : Ye(this).call(y.transform, D, R, w);
    }
  }
  function A(w, ...N) {
    if (t.apply(this, arguments)) {
      var k = w.touches, R = k.length, O = C(this, N, w.changedTouches.length === R).event(w), q, D, L, $;
      for (ko(w), D = 0; D < R; ++D)
        L = k[D], $ = Qe(L, this), $ = [$, this.__zoom.invert($), L.identifier], O.touch0 ? !O.touch1 && O.touch0[2] !== $[2] && (O.touch1 = $, O.taps = 0) : (O.touch0 = $, q = !0, O.taps = 1 + !!d);
      d && (d = clearTimeout(d)), q && (O.taps < 2 && (u = $[0], d = setTimeout(function() {
        d = null;
      }, h)), Bn(this), O.start());
    }
  }
  function P(w, ...N) {
    if (this.__zooming) {
      var k = C(this, N).event(w), R = w.changedTouches, O = R.length, q, D, L, $;
      for (en(w), q = 0; q < O; ++q)
        D = R[q], L = Qe(D, this), k.touch0 && k.touch0[2] === D.identifier ? k.touch0[0] = L : k.touch1 && k.touch1[2] === D.identifier && (k.touch1[0] = L);
      if (D = k.that.__zoom, k.touch1) {
        var F = k.touch0[0], K = k.touch0[1], ne = k.touch1[0], G = k.touch1[1], B = (B = ne[0] - F[0]) * B + (B = ne[1] - F[1]) * B, z = (z = G[0] - K[0]) * z + (z = G[1] - K[1]) * z;
        D = _(D, Math.sqrt(B / z)), L = [(F[0] + ne[0]) / 2, (F[1] + ne[1]) / 2], $ = [(K[0] + G[0]) / 2, (K[1] + G[1]) / 2];
      } else if (k.touch0) L = k.touch0[0], $ = k.touch0[1];
      else return;
      k.zoom("touch", n(S(D, L, $), k.extent, s));
    }
  }
  function v(w, ...N) {
    if (this.__zooming) {
      var k = C(this, N).event(w), R = w.changedTouches, O = R.length, q, D;
      for (ko(w), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), q = 0; q < O; ++q)
        D = R[q], k.touch0 && k.touch0[2] === D.identifier ? delete k.touch0 : k.touch1 && k.touch1[2] === D.identifier && delete k.touch1;
      if (k.touch1 && !k.touch0 && (k.touch0 = k.touch1, delete k.touch1), k.touch0) k.touch0[1] = this.__zoom.invert(k.touch0[0]);
      else if (k.end(), k.taps === 2 && (D = Qe(D, this), Math.hypot(u[0] - D[0], u[1] - D[1]) < m)) {
        var L = Ye(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(w) {
    return arguments.length ? (o = typeof w == "function" ? w : $n(+w), y) : o;
  }, y.filter = function(w) {
    return arguments.length ? (t = typeof w == "function" ? w : $n(!!w), y) : t;
  }, y.touchable = function(w) {
    return arguments.length ? (i = typeof w == "function" ? w : $n(!!w), y) : i;
  }, y.extent = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : $n([[+w[0][0], +w[0][1]], [+w[1][0], +w[1][1]]]), y) : e;
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
function Ji(t) {
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
function Uu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = Ye(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (E) => {
    c && E.code === c && (l = !0, t.style.cursor = "grab");
  }, u = (E) => {
    c && E.code === c && (l = !1, t.style.cursor = "");
  }, f = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = ju().scaleExtent([o, i]).on("start", (E) => {
    if (!E.sourceEvent) return;
    l && (t.style.cursor = "grabbing");
    const { x: T, y: I, k: M } = E.transform;
    e.onMoveStart?.({ x: T, y: I, zoom: M });
  }).on("zoom", (E) => {
    const { x: T, y: I, k: M } = E.transform;
    n({ x: T, y: I, zoom: M }), E.sourceEvent && e.onMove?.({ x: T, y: I, zoom: M });
  }).on("end", (E) => {
    if (!E.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: T, y: I, k: M } = E.transform;
    e.onMoveEnd?.({ x: T, y: I, zoom: M });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Ji({
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
  const _ = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, S = (E) => {
    _ && E.code === _ && (y = !0);
  }, x = (E) => {
    _ && E.code === _ && (y = !1);
  }, b = () => {
    y = !1;
  };
  _ && (window.addEventListener("keydown", S), window.addEventListener("keyup", x), window.addEventListener("blur", b));
  const C = (E) => {
    if (e.isLocked?.()) return;
    const T = E.ctrlKey || E.metaKey || y;
    if (!(p ? !T : E.shiftKey)) return;
    E.preventDefault(), E.stopPropagation();
    const M = m;
    let A = 0, P = 0;
    g !== "horizontal" && (P = -E.deltaY * M), g !== "vertical" && (A = -E.deltaX * M, E.shiftKey && E.deltaX === 0 && g === "both" && (A = -E.deltaY * M, P = 0)), e.onScrollPan?.(A, P);
  };
  return t.addEventListener("wheel", C, { passive: !1, capture: !0 }), {
    setViewport(E, T) {
      const I = T?.duration ?? 0, M = Kn.translate(E.x ?? 0, E.y ?? 0).scale(E.zoom ?? 1);
      I > 0 ? a.transition().duration(I).call(h.transform, M) : a.call(h.transform, M);
    },
    getTransform() {
      return t.__zoom ?? Kn;
    },
    update(E) {
      if ((E.minZoom !== void 0 || E.maxZoom !== void 0) && h.scaleExtent([
        E.minZoom ?? o,
        E.maxZoom ?? i
      ]), E.pannable !== void 0 || E.zoomable !== void 0) {
        const T = E.pannable ?? r, I = E.zoomable ?? s;
        h.filter(Ji({
          pannable: T,
          zoomable: I,
          isLocked: e.isLocked,
          noPanClassName: e.noPanClassName,
          noWheelClassName: e.noWheelClassName,
          isTouchSelectionMode: e.isTouchSelectionMode,
          isPanKeyHeld: () => l,
          panOnDrag: e.panOnDrag
        }));
      }
      E.panOnScroll !== void 0 && (p = E.panOnScroll), E.panOnScrollDirection !== void 0 && (g = E.panOnScrollDirection), E.panOnScrollSpeed !== void 0 && (m = E.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", C, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), _ && (window.removeEventListener("keydown", S), window.removeEventListener("keyup", x), window.removeEventListener("blur", b)), a.on(".zoom", null);
    }
  };
}
function Hr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Gu(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const we = 150, _e = 50;
function wo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - l / 2, y: u - c / 2, width: l, height: c };
}
function Yt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? we, l = s.dimensions?.height ?? _e, c = Gt(s, e), d = s.rotation ? wo(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Zu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? _e, l = Gt(r, n), c = r.rotation ? wo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Ku(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? _e, l = Gt(r, n), c = r.rotation ? wo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + a / 2 }, p = e / 2 - h.x * f, g = n / 2 - h.y * f;
  return { x: p, y: g, zoom: f };
}
function Ju(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class Qu {
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
function Gt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? we, i = t.dimensions?.height ?? _e;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let Rr = !1;
function Fr(t) {
  Rr = t;
}
function V(t, e, n) {
  if (!Rr) return;
  const o = `%c[AlpineFlow:${t}]`, i = ef(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function ef(t) {
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
const yn = "#64748b", vi = "#d4d4d8", Or = "#ef4444", tf = "2", nf = "6 3", Qi = 1.2, Ko = 0.2, Qn = 5, es = 25;
class of {
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
const sf = 16;
function rf() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), sf),
    cancel: (t) => clearTimeout(t)
  };
}
class zr {
  constructor() {
    this._scheduler = rf(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const eo = new zr(), af = {
  linear: au,
  easeIn: lu,
  easeOut: cu,
  easeInOut: du,
  easeCubicIn: uu,
  easeCubicOut: fu,
  easeCubicInOut: $r,
  easeCircIn: vu,
  easeCircOut: _u,
  easeCircInOut: bu,
  easeSinIn: hu,
  easeSinOut: gu,
  easeSinInOut: pu,
  easeExpoIn: mu,
  easeExpoOut: yu,
  easeExpoInOut: wu,
  easeBounce: Zn,
  easeBounceIn: Tu,
  easeBounceInOut: Au,
  easeElastic: Hu,
  easeElasticIn: Du,
  easeElasticInOut: Ru,
  easeBack: Iu,
  easeBackIn: Nu,
  easeBackOut: $u
};
function Vr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function to(t) {
  return typeof t == "function" ? t : af[t ?? "easeInOut"];
}
function it(t, e, n) {
  return t + (e - t) * n;
}
function _i(t, e, n) {
  return Yo(t, e)(n);
}
function wn(t) {
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
const ts = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, ns = /^(#|rgb|hsl)/;
function Br(t, e, n) {
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
    const l = ts.exec(s), c = ts.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = it(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (ns.test(s) && ns.test(a)) {
      o[r] = _i(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function lf(t, e, n, o) {
  let i = it(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: it(t.x, e.x, n),
    y: it(t.y, e.y, n),
    zoom: i
  };
}
class cf {
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
class df {
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
const tn = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function qr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? tn.stiffness, i = e.damping ?? tn.damping, r = e.mass ?? tn.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? tn.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? tn.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const os = {
  timeConstant: 350,
  restVelocity: 0.5
};
function bi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? os.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < os.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function xi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Yr(t, e, n, o) {
  if (n <= 0)
    return;
  bi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? xi(o) : null;
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
function Xr(t, e, n, o) {
  const i = xi(o), r = e.values.map(
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
const is = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, ss = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, rs = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Wr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return is[n] ? { ...is[n] } : null;
    case "decay":
      return ss[n] ? { ...ss[n] } : null;
    case "inertia":
      return rs[n] ? { ...rs[n] } : null;
    default:
      return null;
  }
}
function as(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function uf(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? it(t, e, n) : as(t) && as(e) ? _i(t, e, n) : n < 0.5 ? t : e;
}
class ff {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new cf(), this._activeTransaction = null, this._engine = e;
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
    const e = new df();
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
    } = n, y = to(i), _ = g ? Wr(g) : void 0;
    for (const w of e) {
      const N = this._ownership.get(w.key);
      if (N && !N.stopped) {
        const k = N.currentValues.get(w.key);
        k !== void 0 && (w.from = k), N.entries = N.entries.filter((R) => R.key !== w.key), N.entries.length === 0 && this._stop(N, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const w of e)
        this._activeTransaction.captureProperty(w.key, w.from, w.apply);
    if (o <= 0) {
      const w = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
      for (const O of e)
        w.set(O.key, O.from), N.set(O.key, O.to);
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
      return this._registry.register(R), queueMicrotask(() => this._registry.unregister(R)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(R), d?.(), R;
    }
    const S = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
    for (const w of e)
      S.set(w.key, w.from), x.set(w.key, w.to);
    let b;
    if (_) {
      b = /* @__PURE__ */ new Map();
      for (const w of e) {
        if (typeof w.from != "number" || typeof w.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${w.key}" is non-numeric; snapping to target.`
          ), w.apply(w.to);
          continue;
        }
        let N = 0;
        if (_.type === "decay" || _.type === "inertia") {
          const k = _.velocity;
          if (typeof k == "number")
            N = k;
          else if (k && typeof k == "object") {
            const O = k, q = xi(w.key);
            N = O[w.key] ?? (q ? O[q] ?? 0 : 0);
          }
          const R = _.power ?? 0.8;
          N *= R;
        }
        b.set(w.key, {
          value: w.from,
          velocity: N,
          target: w.to,
          settled: !1
        });
      }
      b.size === 0 && (b = void 0);
    }
    const C = s === "ping-pong" ? "reverse" : s, E = a === "end" ? "backward" : "forward";
    let T;
    const I = new Promise((w) => {
      T = w;
    }), M = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: E,
      duration: o,
      easingFn: y,
      loop: C,
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
      _currentFinished: I,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: b ? _ : void 0,
      physicsStates: b,
      maxDuration: m,
      isPhysics: !!b,
      _prevElapsed: 0
    };
    if (a === "end")
      for (const w of M.entries)
        w.apply(w.to), M.currentValues.set(w.key, w.to);
    else
      for (const w of M.entries)
        M.currentValues.set(w.key, w.from);
    for (const w of e)
      this._ownership.set(w.key, M);
    this._groups.add(M);
    const A = this._engine.register((w) => this._tick(M, w), r);
    M.engineHandle = A;
    const P = [...u ? [u] : [], ...f ?? []], v = {
      _tags: P.length > 0 ? P : void 0,
      pause: () => this._pause(M),
      resume: () => this._resume(M),
      stop: (w) => this._stop(M, w?.mode ?? "jump-end"),
      reverse: () => this._reverse(M),
      play: () => this._play(M),
      playForward: () => this._playDirection(M, "forward"),
      playBackward: () => this._playDirection(M, "backward"),
      restart: (w) => this._restart(M, w),
      get direction() {
        return M.direction;
      },
      get isFinished() {
        return M.isFinished;
      },
      get currentValue() {
        return M.currentValues;
      },
      get finished() {
        return M._currentFinished;
      },
      get _snapshot() {
        return M.snapshot;
      },
      get _target() {
        return M.target;
      }
    };
    return this._registry.register(v), M._handle = v, this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(v), v;
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
      const l = uf(a.from, a.to, s);
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
              qr(d, e.motionConfig, i);
              break;
            case "decay":
              bi(d, e.motionConfig, i);
              break;
            case "inertia":
              Yr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Xr(d, e.motionConfig, h, c.key);
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
const jr = /* @__PURE__ */ new Map();
function hf(t, e) {
  jr.set(t, e);
}
function Lo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ot(t) {
  return typeof t == "string" ? { type: t } : t;
}
function zt(t, e) {
  return `${e}__${t.type}__${(t.color ?? vi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function no(t, e) {
  const n = Lo(t.color ?? vi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = Lo(t.orient ?? "auto-start-reverse"), l = Lo(e);
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
  const c = jr.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : no({ ...t, type: "arrowclosed" }, e);
}
const bt = 200, xt = 150, gf = 1.2, nn = "http://www.w3.org/2000/svg";
function pf(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor, l = document.createElement("div");
  l.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(nn, "svg");
  c.setAttribute("width", String(bt)), c.setAttribute("height", String(xt));
  const d = document.createElementNS(nn, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(bt)), d.setAttribute("height", String(xt));
  const u = document.createElementNS(nn, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(nn, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), l.appendChild(c), t.appendChild(l);
  let h = { x: 0, y: 0, width: 0, height: 0 }, p = 1;
  function g() {
    const A = n();
    if (h = Yt(A.nodes.filter((P) => !P.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      p = 1;
      return;
    }
    p = Math.max(
      h.width / bt,
      h.height / xt
    ) * gf;
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
      const N = document.createElementNS(nn, "rect"), k = (w.dimensions?.width ?? we) / p, R = (w.dimensions?.height ?? _e) / p, O = (w.position.x - h.x) / p + P, q = (w.position.y - h.y) / p + v;
      N.setAttribute("x", String(O)), N.setAttribute("y", String(q)), N.setAttribute("width", String(k)), N.setAttribute("height", String(R)), N.setAttribute("rx", "2");
      const D = m(w);
      D && (N.style.fill = D), u.appendChild(N);
    }
    _();
  }
  function _() {
    const A = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const P = (bt - h.width / p) / 2, v = (xt - h.height / p) / 2, w = (-A.viewport.x / A.viewport.zoom - h.x) / p + P, N = (-A.viewport.y / A.viewport.zoom - h.y) / p + v, k = A.containerWidth / A.viewport.zoom / p, R = A.containerHeight / A.viewport.zoom / p, O = `M0,0 H${bt} V${xt} H0 Z`, q = `M${w},${N} h${k} v${R} h${-k} Z`;
    f.setAttribute("d", `${O} ${q}`);
  }
  let S = !1;
  function x(A, P) {
    const v = (bt - h.width / p) / 2, w = (xt - h.height / p) / 2, N = (A - v) * p + h.x, k = (P - w) * p + h.y;
    return { x: N, y: k };
  }
  function b(A) {
    const P = c.getBoundingClientRect(), v = A.clientX - P.left, w = A.clientY - P.top, N = n(), k = x(v, w), R = -k.x * N.viewport.zoom + N.containerWidth / 2, O = -k.y * N.viewport.zoom + N.containerHeight / 2;
    o({ x: R, y: O, zoom: N.viewport.zoom });
  }
  function C(A) {
    i.minimapPannable && (S = !0, c.setPointerCapture(A.pointerId), b(A));
  }
  function E(A) {
    S && b(A);
  }
  function T(A) {
    S && (S = !1, c.releasePointerCapture(A.pointerId));
  }
  c.addEventListener("pointerdown", C), c.addEventListener("pointermove", E), c.addEventListener("pointerup", T);
  function I(A) {
    if (!i.minimapZoomable)
      return;
    A.preventDefault();
    const P = n(), v = i.minZoom ?? 0.5, w = i.maxZoom ?? 2, N = A.deltaY > 0 ? 0.9 : 1.1, k = Math.min(Math.max(P.viewport.zoom * N, v), w);
    o({ zoom: k });
  }
  c.addEventListener("wheel", I, { passive: !1 });
  function M() {
    c.removeEventListener("pointerdown", C), c.removeEventListener("pointermove", E), c.removeEventListener("pointerup", T), c.removeEventListener("wheel", I), l.remove();
  }
  return { render: y, updateViewport: _, destroy: M };
}
const mf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', yf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', wf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', ls = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', vf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', _f = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', cs = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', bf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function xf(t, e) {
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
    const b = Tt(mf, "Zoom in", c), C = Tt(yf, "Zoom out", d);
    g.appendChild(b), g.appendChild(C);
  }
  if (r) {
    const b = Tt(wf, "Fit view", u);
    g.appendChild(b);
  }
  if (s && (y = Tt(ls, "Toggle interactivity", f), g.appendChild(y)), a) {
    const b = Tt(_f, "Reset panels", h);
    g.appendChild(b);
  }
  p && (_ = Tt(cs, "Toggle fullscreen", p), _.classList.add("flow-controls-button-fullscreen"), g.appendChild(_)), g.addEventListener("mousedown", (b) => b.stopPropagation()), g.addEventListener("pointerdown", (b) => b.stopPropagation()), g.addEventListener("wheel", (b) => b.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function S(b) {
    if (y && typeof b.isInteractive == "boolean") {
      Jo(y, b.isInteractive ? ls : vf);
      const C = b.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      y.title = C, y.setAttribute("aria-label", C);
    }
    if (_ && typeof b.isFullscreen == "boolean") {
      Jo(_, b.isFullscreen ? bf : cs);
      const C = b.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      _.title = C, _.setAttribute("aria-label", C), _.classList.toggle("flow-controls-button-fullscreen--active", b.isFullscreen);
    }
  }
  function x() {
    g.remove();
  }
  return { update: S, destroy: x };
}
function Tt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Jo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Jo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ds = 5;
function Ef(t) {
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
    if (h < ds && p < ds)
      return null;
    const g = Math.min(o, r), m = Math.min(i, s), y = (g - f.x) / f.zoom, _ = (m - f.y) / f.zoom, S = h / f.zoom, x = p / f.zoom;
    return { x: y, y: _, width: S, height: x };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: u };
}
const us = 3;
function Cf(t) {
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
    h * h + p * p < us * us || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
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
function Ei(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function Sf(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, u = a - r, f = l * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * u - p * d) / f, m = (h * c - p * l) / f;
  return g >= 0 && g <= 1 && m >= 0 && m <= 1;
}
function kf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (Ei(s, a, t)) return !0;
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
      if (Sf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, p))
        return !0;
  return !1;
}
function Ur(t) {
  const e = t.dimensions?.width ?? we, n = t.dimensions?.height ?? _e;
  return t.rotation ? wo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function Lf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Ur(n);
    return kf(e, o);
  });
}
function Pf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Ur(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => Ei(r.x, r.y, e));
  });
}
function Mf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Qo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function Tf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function Af(t, e, n) {
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
function Nf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function $f(t, e, n) {
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
  ) || n?.preventCycles && Af(t.source, t.target, e));
}
const We = "_flowHandleValidate";
function If(t) {
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
function Df(t) {
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
function Hf(t) {
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
function Cn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Gr(t) {
  return Cn(t, t.draggable);
}
function Rf(t) {
  return Cn(t, t.deletable);
}
function Be(t) {
  return Cn(t, t.connectable);
}
function ei(t) {
  return Cn(t, t.selectable);
}
function fs(t) {
  return Cn(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(a * a + l * l), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), p = n - a / u * h, g = o - l / u * h, m = n + c / f * h, y = o + d / f * h;
  return `L${p},${g} Q${n},${o} ${m},${y}`;
}
function Sn({
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
function In(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function Ff({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * In(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * In(
    n === "bottom" ? i - e : e - i,
    s
  ), u = l ? o + (r === "right" ? 1 : -1) * In(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = l ? i : i + (r === "bottom" ? 1 : -1) * In(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function oo(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = Ff(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = Sn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function Dy({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: a, offsetX: l, offsetY: c } = Sn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: a },
    labelOffsetX: l,
    labelOffsetY: c
  };
}
function hs(t) {
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
function Of(t, e, n, o, i, r, s) {
  const a = hs(n), l = hs(r), c = t + a.x * s, d = e + a.y * s, u = o + l.x * s, f = i + l.y * s, h = n === "left" || n === "right";
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
function vn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: a = 10
}) {
  const l = Of(
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
      const [y, _] = p === 1 ? [t, e] : l[p - 1], [S, x] = l[p + 1];
      c += ` ${Xt(y, _, g, m, S, x, s)}`;
    } else
      c += ` L${g},${m}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = Sn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function zf(t) {
  return vn({ ...t, borderRadius: 0 });
}
function Zr({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: a, offsetY: l } = Sn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: a,
    labelOffsetY: l
  };
}
const at = 40;
function Vf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < at && s >= 0 ? i = -o * (1 - s / at) : a < at && a >= 0 && (i = o * (1 - a / at)), l < at && l >= 0 ? r = -o * (1 - l / at) : c < at && c >= 0 && (r = o * (1 - c / at)), { dx: i, dy: r };
}
function Kr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Vf(r, s, c, n);
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
function Wt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Or : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || yn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(tf),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? nf
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
        p = oo({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = vn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        p = zf({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        p = Zr({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
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
function _n(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let a = null, l = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !Be(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
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
      if (p && !Be(p)) return;
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
function vo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Kr({
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
function Bf(t, e, n, o) {
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
function Jr(t, e) {
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
let dn = 0;
const Dn = /* @__PURE__ */ new WeakMap();
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
function bn(t, e, n, o, i, r) {
  if (!r) {
    qf(t, e, n, o, i);
    return;
  }
  const s = Bf(o, e, n, i), a = r.get(e, n, "source"), l = a?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= a.limit, c = [];
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
function qf(t, e, n, o, i) {
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
function ke(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function kt(t, e) {
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
async function _o(t, e, n, o, i, r) {
  if (!t) return { allowed: !0 };
  n?.classList.add(r), o?.classList.add(r), i.dispatchEvent(new CustomEvent("flow-connect-validating", {
    detail: { connection: e },
    bubbles: !0
  }));
  let s;
  try {
    s = await t(e);
  } catch (c) {
    V("connection", "connectValidator threw", c), s = !1;
  } finally {
    n?.classList.remove(r), o?.classList.remove(r);
  }
  const a = typeof s == "boolean" ? s : !!s?.allowed, l = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: a, reason: l },
    bubbles: !0
  })), { allowed: a, reason: l };
}
async function Qr(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), a = (c) => (Ae(i, {
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
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = bo(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await _o(
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
async function ea(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ae(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Be(s) || !pt(e, i, { preventCycles: n._config?.preventCycles }) || !gt(e, n._config?.connectionRules, n._nodeMap) || !nt(o, e, i) || !tt(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const a = n._config?.connectValidator;
  if (a) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = bo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await _o(
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${dn++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function bo(t, e) {
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
function ta(t, e, n) {
  n.preventDefault(), n.stopPropagation();
  const o = t.dataset.flowHandleId ?? "source", i = t.closest("[x-flow-node]");
  if (!e || !i || e._animationLocked) return;
  const r = i.dataset.flowNodeId;
  if (!r) return;
  const s = e.getNode(r);
  if (s && !Be(s) || t[Pt] === !1) return;
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
    A && ke(A);
  }
  let d = null, u = null, f = null, h = null, p = null;
  const g = e._config?.connectionSnapRadius ?? 20, m = t.closest(".flow-container");
  let y = null, _ = 0, S = 0, x = !1, b = /* @__PURE__ */ new Map();
  const C = () => {
    if (c = !0, V("connection", `Connection drag started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), !m) return;
    u = Wt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: m
    }), d = u.svg;
    const A = t.getBoundingClientRect(), P = m.getBoundingClientRect(), v = e._viewportLive ?? e.viewport, w = v?.zoom || 1, N = v?.x || 0, k = v?.y || 0;
    _ = (A.left + A.width / 2 - P.left - N) / w, S = (A.top + A.height / 2 - P.top - k) / w, u.update({ fromX: _, fromY: S, toX: _, toY: S, source: r, sourceHandle: o });
    const R = m.querySelector(".flow-viewport");
    if (R && R.appendChild(d), e.pendingConnection = {
      source: r,
      sourceHandle: o,
      position: { x: _, y: S }
    }, h = vo(m, e, a, l), y = Jr(
      m,
      (O, q) => e.screenToFlowPosition(O, q)
    ), bn(m, r, o, e, void 0, y), e._config?.onEdgeDrop) {
      const O = e._config.edgeDropPreview, D = O ? O({ source: r, sourceHandle: o }) : "New Node";
      if (D !== null) {
        p = document.createElement("div"), p.className = "flow-ghost-node";
        const L = document.createElement("div");
        if (L.className = "flow-ghost-handle", p.appendChild(L), typeof D == "string") {
          const F = document.createElement("span");
          F.textContent = D, p.appendChild(F);
        } else
          p.appendChild(D);
        p.style.left = `${_}px`, p.style.top = `${S}px`;
        const $ = m.querySelector(".flow-viewport");
        $ && $.appendChild(p);
      }
    }
  }, E = () => {
    const A = [...e.selectedNodes], P = [], v = m.getBoundingClientRect(), w = e._viewportLive ?? e.viewport, N = w?.zoom || 1, k = w?.x || 0, R = w?.y || 0;
    for (const O of A) {
      if (O === r) continue;
      const D = m?.querySelector(`[data-flow-node-id="${CSS.escape(O)}"]`)?.querySelector('[data-flow-handle-type="source"]');
      if (!D) continue;
      const L = D.getBoundingClientRect();
      P.push({
        nodeId: O,
        handleId: D.dataset.flowHandleId ?? "source",
        pos: {
          x: (L.left + L.width / 2 - v.left - k) / N,
          y: (L.top + L.height / 2 - v.top - R) / N
        }
      });
    }
    return P;
  }, T = (A) => {
    x = !0, u && (b.set(r, {
      line: u,
      sourceNodeId: r,
      sourceHandleId: o,
      sourcePos: { x: _, y: S },
      valid: !0
    }), u = null);
    const P = E(), v = m.querySelector(".flow-viewport");
    for (const w of P) {
      const N = Wt({
        connectionLineType: e._config?.connectionLineType,
        connectionLineStyle: e._config?.connectionLineStyle,
        connectionLine: e._config?.connectionLine,
        containerEl: m
      });
      N.update({
        fromX: w.pos.x,
        fromY: w.pos.y,
        toX: A.x,
        toY: A.y,
        source: w.nodeId,
        sourceHandle: w.handleId
      }), v && v.appendChild(N.svg), b.set(w.nodeId, {
        line: N,
        sourceNodeId: w.nodeId,
        sourceHandleId: w.handleId,
        sourcePos: w.pos,
        valid: !0
      });
    }
  }, I = (A) => {
    if (!c) {
      const w = A.clientX - a, N = A.clientY - l;
      if (Math.abs(w) >= Qn || Math.abs(N) >= Qn) {
        if (C(), e._config?.multiConnect && e.selectedNodes.size > 1 && e.selectedNodes.has(r)) {
          const k = e.screenToFlowPosition(A.clientX, A.clientY);
          T(k);
        }
      } else
        return;
    }
    const P = e.screenToFlowPosition(A.clientX, A.clientY);
    if (x) {
      const w = _n({
        containerEl: m,
        handleType: "target",
        excludeNodeId: r,
        cursorFlowPos: P,
        connectionSnapRadius: g,
        getNode: (q) => e.getNode(q),
        toFlowPosition: (q, D) => e.screenToFlowPosition(q, D),
        connectionMode: e._config?.connectionMode,
        index: y ?? void 0
      });
      w.element !== f && (f?.classList.remove("flow-handle-active"), w.element?.classList.add("flow-handle-active"), f = w.element);
      const k = w.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, R = w.element?.dataset.flowHandleId ?? "target", O = e._config?.connectionLineStyle?.stroke ?? (getComputedStyle(m).getPropertyValue("--flow-edge-stroke-selected").trim() || yn);
      for (const q of b.values())
        if (q.line.update({
          fromX: q.sourcePos.x,
          fromY: q.sourcePos.y,
          toX: w.position.x,
          toY: w.position.y,
          source: q.sourceNodeId,
          sourceHandle: q.sourceHandleId
        }), w.element && k) {
          const D = {
            source: q.sourceNodeId,
            sourceHandle: q.sourceHandleId,
            target: k,
            targetHandle: R
          }, G = e.getNode(k)?.connectable !== !1 && q.sourceNodeId !== k && pt(D, e.edges, { preventCycles: e._config?.preventCycles }) && gt(D, e._config?.connectionRules, e._nodeMap) && nt(m, D, e.edges) && tt(m, D) && (!e._config?.isValidConnection || e._config.isValidConnection(D));
          q.valid = G;
          const B = q.line.svg.querySelector("path");
          if (B)
            if (G)
              B.setAttribute("stroke", O);
            else {
              const z = getComputedStyle(m).getPropertyValue("--flow-connection-line-invalid").trim() || Or;
              B.setAttribute("stroke", z);
            }
        } else {
          q.valid = !0;
          const D = q.line.svg.querySelector("path");
          D && D.setAttribute("stroke", O);
        }
      e.pendingConnection = { ...e.pendingConnection, position: w.position }, h?.updatePointer(A.clientX, A.clientY);
      return;
    }
    const v = _n({
      containerEl: m,
      handleType: "target",
      excludeNodeId: r,
      cursorFlowPos: P,
      connectionSnapRadius: g,
      getNode: (w) => e.getNode(w),
      toFlowPosition: (w, N) => e.screenToFlowPosition(w, N),
      index: y ?? void 0
    });
    v.element !== f && (f?.classList.remove("flow-handle-active"), v.element?.classList.add("flow-handle-active"), f = v.element), p ? v.element ? (p.style.display = "none", u?.update({ fromX: _, fromY: S, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o })) : (p.style.display = "", p.style.left = `${P.x}px`, p.style.top = `${P.y}px`, u?.update({ fromX: _, fromY: S, toX: P.x, toY: P.y, source: r, sourceHandle: o })) : u?.update({ fromX: _, fromY: S, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o }), e.pendingConnection = { ...e.pendingConnection, position: v.position }, h?.updatePointer(A.clientX, A.clientY);
  }, M = async (A) => {
    if (h?.stop(), h = null, document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), ft.delete(t), y = null, e._connectValidating) return;
    if (x) {
      const N = e.screenToFlowPosition(A.clientX, A.clientY);
      let k = f;
      k || (k = document.elementFromPoint(A.clientX, A.clientY)?.closest('[data-flow-handle-type="target"]'));
      const O = k?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, q = k?.dataset.flowHandleId ?? "target", D = [], L = [], $ = [], F = [];
      if (k && O) {
        const K = e.getNode(O);
        for (const ne of b.values()) {
          const G = {
            source: ne.sourceNodeId,
            sourceHandle: ne.sourceHandleId,
            target: O,
            targetHandle: q
          };
          if (K?.connectable !== !1 && ne.sourceNodeId !== O && pt(G, e.edges, { preventCycles: e._config?.preventCycles }) && gt(G, e._config?.connectionRules, e._nodeMap) && nt(m, G, e.edges) && tt(m, G) && (!e._config?.isValidConnection || e._config.isValidConnection(G))) {
            const H = `e-${ne.sourceNodeId}-${O}-${Date.now()}-${dn++}`;
            D.push({ id: H, ...G }), L.push(G), F.push(ne);
          } else
            $.push(ne);
        }
      } else
        $.push(...b.values());
      for (const K of F)
        K.line.destroy();
      if (D.length > 0) {
        e.addEdges(D);
        for (const K of L)
          e._emit("connect", { connection: K });
        e._emit("multi-connect", { connections: L });
      }
      $.length > 0 && setTimeout(() => {
        for (const K of $)
          K.line.destroy();
      }, 100), f?.classList.remove("flow-handle-active"), e._emit("connect-end", {
        connection: L.length > 0 ? L[0] : null,
        source: r,
        sourceHandle: o,
        position: N
      }), b.clear(), x = !1, ke(m), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
      return;
    }
    if (!c) {
      e._config?.connectOnClick !== !1 && (V("connection", `Click-to-connect started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), e.pendingConnection = {
        source: r,
        sourceHandle: o,
        position: { x: 0, y: 0 }
      }, e._container?.classList.add("flow-connecting"), bn(m, r, o, e, void 0, y ?? void 0));
      return;
    }
    const P = u?.svg ?? null;
    p?.remove(), p = null, f?.classList.remove("flow-handle-active"), ke(m);
    const v = e.screenToFlowPosition(A.clientX, A.clientY), w = { source: r, sourceHandle: o, position: v };
    try {
      let N = f;
      if (N || (N = document.elementFromPoint(A.clientX, A.clientY)?.closest('[data-flow-handle-type="target"]')), N) {
        const R = N.closest("[x-flow-node]")?.dataset.flowNodeId, O = N.dataset.flowHandleId ?? "target";
        if (R) {
          if (N[st] === !1) {
            V("connection", "Connection rejected (handle not connectable end)"), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const q = e.getNode(R);
          if (q && !Be(q)) {
            V("connection", `Connection rejected (target "${R}" not connectable)`), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const D = {
            source: r,
            sourceHandle: o,
            target: R,
            targetHandle: O
          };
          if (pt(D, e.edges, { preventCycles: e._config?.preventCycles })) {
            if (!gt(D, e._config?.connectionRules, e._nodeMap)) {
              V("connection", "Connection rejected (connection rules)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!nt(m, D, e.edges)) {
              V("connection", "Connection rejected (handle limit)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (!tt(m, D)) {
              V("connection", "Connection rejected (per-handle validator)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            if (e._config?.isValidConnection && !e._config.isValidConnection(D)) {
              V("connection", "Connection rejected (custom validator)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
              return;
            }
            const L = e._config?.connectValidator;
            if (L) {
              const F = e._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: K, targetEl: ne } = bo(m, D);
              e._connectValidating = !0, kt(P, !0);
              let G;
              try {
                G = await _o(
                  L,
                  D,
                  K,
                  ne,
                  m,
                  F
                );
              } finally {
                e._connectValidating = !1, kt(P, !1);
              }
              if (!G.allowed) {
                V("connection", "Connection rejected (async connectValidator)", { connection: D, reason: G.reason }), Ae(m, { ...D, reason: G.reason }), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
                return;
              }
            }
            const $ = `e-${r}-${R}-${Date.now()}-${dn++}`;
            e.addEdges({ id: $, ...D }), V("connection", `Connection created: ${r} → ${R}`, D), e._emit("connect", { connection: D }), e._emit("connect-end", { connection: D, ...w });
          } else
            V("connection", "Connection rejected (invalid)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w });
        } else
          e._emit("connect-end", { connection: null, ...w });
      } else if (e._config?.onEdgeDrop) {
        const k = {
          x: v.x - we / 2,
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
          if (!nt(m, O, e.edges))
            V("connection", "Edge drop: connection rejected (handle limit)"), e._emit("connect-end", { connection: null, ...w });
          else if (!tt(m, O))
            V("connection", "Edge drop: connection rejected (per-handle validator)"), e._emit("connect-end", { connection: null, ...w });
          else if (!e._config.isValidConnection || e._config.isValidConnection(O)) {
            e.addNodes(R);
            const q = `e-${r}-${R.id}-${Date.now()}-${dn++}`;
            e.addEdges({ id: q, ...O }), V("connection", `Edge drop: created node "${R.id}" and edge`, O), e._emit("connect", { connection: O }), e._emit("connect-end", { connection: O, ...w });
          } else
            V("connection", "Edge drop: connection rejected by validator"), e._emit("connect-end", { connection: null, ...w });
        } else
          V("connection", "Edge drop: callback returned null"), e._emit("connect-end", { connection: null, ...w });
      } else
        V("connection", "Connection cancelled (no target)"), e._emit("connect-end", { connection: null, ...w });
    } finally {
      kt(P, !1), u?.destroy(), u = null;
    }
    e.pendingConnection = null;
  };
  document.addEventListener("pointermove", I), document.addEventListener("pointerup", M), document.addEventListener("pointercancel", M), ft.set(t, () => {
    document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), h?.stop(), u?.destroy(), u = null, p?.remove(), p = null;
    for (const A of b.values())
      A.line.destroy();
    b.clear(), x = !1, f?.classList.remove("flow-handle-active"), ke(m), y = null, e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
  });
}
function na(t, e, n) {
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
  const p = e._config?.connectionSnapRadius ?? 20, g = t.closest(".flow-container");
  if (!g) return;
  const m = g.querySelector(
    `[data-flow-node-id="${CSS.escape(a.source)}"]`
  ), y = a.sourceHandle ? `[data-flow-handle-id="${CSS.escape(a.sourceHandle)}"]` : '[data-flow-handle-type="source"]', _ = m?.querySelector(y), S = g.getBoundingClientRect(), x = e._viewportLive ?? e.viewport, b = x?.zoom || 1, C = x?.x || 0, E = x?.y || 0;
  let T, I;
  if (_) {
    const D = _.getBoundingClientRect();
    T = (D.left + D.width / 2 - S.left - C) / b, I = (D.top + D.height / 2 - S.top - E) / b;
  } else {
    const D = e.getNode(a.source);
    if (!D) return;
    const L = D.dimensions?.width ?? we, $ = D.dimensions?.height ?? _e;
    T = D.position.x + L / 2, I = D.position.y + $;
  }
  let M = null, A = null, P = null, v = c, w = d, N = null;
  const k = () => {
    u = !0;
    const D = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.add("flow-edge-reconnecting"), e._emit("reconnect-start", { edge: a, handleType: "target" }), V("reconnect", `Reconnection drag started from target handle on edge "${a.id}"`), A = Wt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: g
    }), M = A.svg;
    const L = e.screenToFlowPosition(c, d);
    A.update({
      fromX: T,
      fromY: I,
      toX: L.x,
      toY: L.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    });
    const $ = g.querySelector(".flow-viewport");
    $ && $.appendChild(M), e.pendingConnection = {
      source: a.source,
      sourceHandle: a.sourceHandle,
      position: L
    }, e._pendingReconnection = {
      edge: a,
      draggedEnd: "target",
      anchorPosition: { x: T, y: I },
      position: L
    }, P = vo(g, e, v, w), N = Jr(
      g,
      (F, K) => e.screenToFlowPosition(F, K)
    ), bn(g, a.source, a.sourceHandle ?? "source", e, a.id, N);
  }, R = (D) => {
    if (v = D.clientX, w = D.clientY, !u) {
      Math.sqrt(
        (D.clientX - c) ** 2 + (D.clientY - d) ** 2
      ) >= Qn && k();
      return;
    }
    const L = e.screenToFlowPosition(D.clientX, D.clientY), $ = _n({
      containerEl: g,
      handleType: "target",
      excludeNodeId: a.source,
      cursorFlowPos: L,
      connectionSnapRadius: p,
      getNode: (F) => e.getNode(F),
      toFlowPosition: (F, K) => e.screenToFlowPosition(F, K),
      index: N ?? void 0
    });
    $.element !== h && (h?.classList.remove("flow-handle-active"), $.element?.classList.add("flow-handle-active"), h = $.element), A?.update({
      fromX: T,
      fromY: I,
      toX: $.position.x,
      toY: $.position.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    }), e.pendingConnection && (e.pendingConnection = {
      ...e.pendingConnection,
      position: $.position
    }), e._pendingReconnection && (e._pendingReconnection = {
      ...e._pendingReconnection,
      position: $.position
    }), P?.updatePointer(D.clientX, D.clientY);
  }, O = () => {
    if (f) return;
    f = !0, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", q), document.removeEventListener("pointercancel", q), P?.stop(), P = null, A?.destroy(), A = null, M = null, N = null, h?.classList.remove("flow-handle-active"), ft.delete(t);
    const D = g.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.remove("flow-edge-reconnecting"), ke(g), e.pendingConnection = null, e._pendingReconnection = null;
  }, q = async (D) => {
    if (!u) {
      O();
      return;
    }
    if (e._connectValidating) return;
    let L = h;
    L || (L = document.elementFromPoint(D.clientX, D.clientY)?.closest('[data-flow-handle-type="target"]'));
    let $ = !1;
    if (L) {
      const K = L.closest("[x-flow-node]")?.dataset.flowNodeId, ne = L.dataset.flowHandleId;
      if (K && e.getNode(K)?.connectable !== !1) {
        const B = {
          source: a.source,
          sourceHandle: a.sourceHandle,
          target: K,
          targetHandle: ne
        }, z = { ...a }, Y = A?.svg ?? null;
        kt(Y, !0);
        let W;
        try {
          W = await Qr({
            edge: a,
            newConnection: B,
            canvas: e,
            containerEl: g,
            endpoint: "target"
          });
        } finally {
          kt(Y, !1);
        }
        W.applied ? ($ = !0, V("reconnect", `Edge "${a.id}" reconnected (target)`, B), e._emit("reconnect", { oldEdge: z, newConnection: B })) : V("reconnect", "Reconnection rejected", { connection: B, reason: W.reason });
      }
    }
    $ || V("reconnect", `Edge "${a.id}" reconnection cancelled — snapping back`), e._emit("reconnect-end", { edge: a, successful: $ }), O();
  };
  document.addEventListener("pointermove", R), document.addEventListener("pointerup", q), document.addEventListener("pointercancel", q), ft.set(t, O);
}
function Yf(t, e, n) {
  t.dataset.flowHandleType === "source" ? ta(t, e, n) : na(t, e, n);
}
function gs(t) {
  return t?._config?.delegatedHandleEvents === !1;
}
function Xf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let p;
      c && u ? p = "top-left" : c && f ? p = "top-right" : d && u ? p = "bottom-left" : d && f ? p = "bottom-right" : c ? p = "top" : f ? p = "right" : d ? p = "bottom" : u ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let g, m = !1;
      if (i) {
        const b = r(i);
        b && typeof b == "object" && !Array.isArray(b) ? (g = b.id || e.getAttribute("data-flow-handle-id") || l, b.position && (p = b.position, m = !0)) : g = b || e.getAttribute("data-flow-handle-id") || l;
      } else
        g = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), m && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const b = r(i);
        b && typeof b == "object" && !Array.isArray(b) && b.position && (e.dataset.flowHandlePosition = b.position);
      })), !h && !m) {
        const b = () => {
          const E = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!E) return;
          const T = e.closest("[x-data]");
          return T ? t.$data(T)?.getNode?.(E) : void 0;
        };
        s(() => {
          const C = b();
          if (!C) return;
          const E = l === "source" ? C.sourcePosition : C.targetPosition;
          E && (e.dataset.flowHandlePosition = E);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const y = () => {
        const b = e.closest("[x-flow-node]");
        return b ? b.getAttribute("data-flow-node-id") ?? null : null;
      }, _ = () => {
        const b = e.closest("[x-data]");
        return b ? t.$data(b) : null;
      }, S = _();
      let x = null;
      if (S?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${l} handle ${g}`);
        const b = (T) => {
          const I = T?._pendingKeyboardConnect;
          if (!I) return;
          const M = e.closest(".flow-container");
          M && M.querySelector(
            `[data-flow-node-id="${CSS.escape(I.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(I.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), T && (T._pendingKeyboardConnect = null);
        }, C = (T) => {
          if (!(T.key === "Enter" || T.key === " " || T.key === "Spacebar")) return;
          const M = _();
          if (!M || M._animationLocked) return;
          const A = y();
          if (A)
            if (l === "source") {
              const P = M.getNode?.(A);
              if (P && !Be(P) || e[Pt] === !1) return;
              T.preventDefault(), T.stopPropagation(), b(M), M._pendingKeyboardConnect = {
                sourceNodeId: A,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), M._announcer?.announce?.(`Connecting from ${l} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!M._pendingKeyboardConnect) return;
              const P = M.getNode?.(A);
              if (P && !Be(P) || e[st] === !1) return;
              T.preventDefault(), T.stopPropagation();
              const { sourceNodeId: v, sourceHandleId: w } = M._pendingKeyboardConnect, N = {
                source: v,
                sourceHandle: w,
                target: A,
                targetHandle: g
              }, k = e.closest(".flow-container");
              if (b(M), !k) return;
              ea({ connection: N, canvas: M, containerEl: k }).then((R) => {
                R.applied && M._announcer?.announce?.(`Connected ${v} to ${A}.`);
              });
            }
        };
        e.addEventListener("keydown", C);
        const E = e.closest(".flow-container");
        if (E) {
          const T = Dn.get(E);
          if (T)
            T.count += 1;
          else {
            const I = (M) => {
              if (M.key !== "Escape") return;
              const A = E.matches("[x-data]") ? E : E.closest("[x-data]") ?? E.querySelector("[x-data]");
              if (!A) return;
              const P = t.$data(A);
              P?._pendingKeyboardConnect && b(P);
            };
            E.addEventListener("keydown", I), Dn.set(E, { count: 1, handler: I });
          }
        }
        x = () => {
          if (e.removeEventListener("keydown", C), E) {
            const T = Dn.get(E);
            T && (T.count -= 1, T.count <= 0 && (E.removeEventListener("keydown", T.handler), Dn.delete(E)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (l === "source") {
        const b = (T) => {
          ta(e, _(), T);
        };
        gs(S) && e.addEventListener("pointerdown", b);
        const C = () => {
          const T = _();
          if (!T?._pendingReconnection || T._pendingReconnection.draggedEnd !== "source") return;
          const I = y();
          if (I) {
            const M = T.getNode(I);
            if (M && !Be(M)) return;
          }
          e[Pt] !== !1 && e.classList.add("flow-handle-active");
        }, E = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", C), e.addEventListener("pointerleave", E), a(() => {
          ft.get(e)?.(), ft.delete(e), x?.(), e.removeEventListener("pointerdown", b), e.removeEventListener("pointerenter", C), e.removeEventListener("pointerleave", E), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const b = () => {
          const I = _();
          if (!I?.pendingConnection) return;
          const M = y();
          if (M) {
            const A = I.getNode(M);
            if (A && !Be(A)) return;
          }
          e[st] !== !1 && e.classList.add("flow-handle-active");
        }, C = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", b), e.addEventListener("pointerleave", C);
        const E = async (I) => {
          const M = _();
          if (!M?.pendingConnection || M._config?.connectOnClick === !1 || M._connectValidating) return;
          I.preventDefault(), I.stopPropagation();
          const A = y();
          if (!A) return;
          if (e[st] === !1) {
            V("connection", "Click-to-connect rejected (handle not connectable end)"), M._emit("connect-end", { connection: null, source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && ke(k);
            return;
          }
          const P = M.getNode(A);
          if (P && !Be(P)) {
            V("connection", `Click-to-connect rejected (target "${A}" not connectable)`), M._emit("connect-end", { connection: null, source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && ke(k);
            return;
          }
          const v = {
            source: M.pendingConnection.source,
            sourceHandle: M.pendingConnection.sourceHandle,
            target: A,
            targetHandle: g
          }, w = { source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (pt(v, M.edges, { preventCycles: M._config?.preventCycles })) {
            const k = e.closest(".flow-container");
            if (!gt(v, M._config?.connectionRules, M._nodeMap)) {
              V("connection", "Click-to-connect rejected (connection rules)", v), Ae(k, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), k && ke(k);
              return;
            }
            if (k && !nt(k, v, M.edges)) {
              V("connection", "Click-to-connect rejected (handle limit)", v), Ae(k, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), ke(k);
              return;
            }
            if (k && !tt(k, v)) {
              V("connection", "Click-to-connect rejected (per-handle validator)", v), Ae(k, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), k && ke(k);
              return;
            }
            if (M._config?.isValidConnection && !M._config.isValidConnection(v)) {
              V("connection", "Click-to-connect rejected (custom validator)", v), Ae(k, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), k && ke(k);
              return;
            }
            const R = M._config?.connectValidator;
            if (R && k) {
              const q = M._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: D, targetEl: L } = bo(k, v);
              M._connectValidating = !0;
              let $;
              try {
                $ = await _o(
                  R,
                  v,
                  D,
                  L,
                  k,
                  q
                );
              } finally {
                M._connectValidating = !1;
              }
              if (!$.allowed) {
                V("connection", "Click-to-connect rejected (async connectValidator)", { connection: v, reason: $.reason }), Ae(k, { ...v, reason: $.reason }), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), ke(k);
                return;
              }
            }
            const O = `e-${v.source}-${v.target}-${Date.now()}-${dn++}`;
            M.addEdges({ id: O, ...v }), V("connection", `Click-to-connect: ${v.source} → ${v.target}`, v), M._emit("connect", { connection: v }), M._emit("connect-end", { connection: v, ...w });
          } else {
            V("connection", "Click-to-connect rejected (invalid)", v);
            const k = e.closest(".flow-container");
            Ae(k, v), M._emit("connect-end", { connection: null, ...w });
          }
          M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
          const N = e.closest(".flow-container");
          N && ke(N);
        };
        e.addEventListener("click", E);
        const T = (I) => {
          na(e, _(), I);
        };
        gs(S) && e.addEventListener("pointerdown", T), a(() => {
          ft.get(e)?.(), ft.delete(e), x?.(), e.removeEventListener("pointerdown", T), e.removeEventListener("pointerenter", b), e.removeEventListener("pointerleave", C), e.removeEventListener("click", E), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
function ps(t, e) {
  const n = (o) => {
    const r = o.target?.closest?.("[data-flow-handle-type]");
    r && t.contains(r) && (e?._container && r.closest(".flow-container") !== e._container || Yf(r, e, o));
  };
  return t.addEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", n, !0);
}
const ms = {
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
function Wf(t) {
  if (!t) return { ...ms };
  const e = { ...ms };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ge(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function jf(t, e, n, o) {
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
function Uf(t, e, n = {}) {
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
const ti = 20, Hn = ti + 1, oa = 1, ia = 0.5, Gf = `b${oa}d${ia}`;
function ys(t) {
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
function ws(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Zf(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function sa(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function ra(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function Kf(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const a = Array.from(r).sort((u, f) => u - f), l = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of a)
    for (const f of l) {
      let h = !1;
      for (const p of i)
        if (Zf(u, f, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class Jf {
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
function Qf(t, e) {
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
      ra(a.x, a.y, l.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, a) => s.x - a.x);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      sa(a.x, l.x, a.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  return n;
}
function eh(t, e, n, o) {
  const i = n.length, r = 2 * i, s = new Float64Array(r).fill(1 / 0), a = new Float64Array(r).fill(1 / 0), l = new Int32Array(r).fill(-1), c = new Uint8Array(r), d = Qf(n, o), u = Math.min(t.x, e.x), f = Math.max(t.x, e.x), h = Math.min(t.y, e.y), p = Math.max(t.y, e.y), g = (E) => Math.max(0, u - E.x) + Math.max(0, E.x - f) + Math.max(0, h - E.y) + Math.max(0, E.y - p), m = (E, T) => s[E] < s[T] || s[E] === s[T] && a[E] < a[T], y = new Jf(m);
  for (let E = 0; E < 2; E++) {
    const T = E * i + t.index;
    s[T] = 0, a[T] = 0, y.push(T);
  }
  const _ = (E) => E % i, S = (E) => E < i ? 0 : 1;
  let x = -1;
  for (; y.size > 0; ) {
    const E = y.pop();
    if (c[E]) continue;
    c[E] = 1;
    const T = _(E);
    if (T === e.index) {
      x = E;
      break;
    }
    const I = S(E), M = n[T];
    for (const A of d[T]) {
      const P = n[A], v = M.x === P.x ? 1 : 0, w = v * i + A;
      if (c[w]) continue;
      const N = Math.abs(P.x - M.x) + Math.abs(P.y - M.y), R = oa * (I === v ? 0 : 1) + ia * g(P), O = s[E] + N, q = a[E] + R;
      (O < s[w] || O === s[w] && q < a[w]) && (s[w] = O, a[w] = q, l[w] = E, y.push(w));
    }
  }
  if (x === -1) {
    const E = e.index, T = i + e.index;
    if (s[E] === 1 / 0 && s[T] === 1 / 0) return null;
    x = m(E, T) ? E : T;
  }
  const b = [];
  let C = x;
  for (; C !== -1; )
    b.unshift(n[_(C)]), C = l[C];
  return b;
}
function th(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function nh(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function oh(t) {
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
function ih(t, e, n, o, i) {
  const r = Math.min(t, n) - ht, s = Math.max(t, n) + ht, a = Math.min(e, o) - ht, l = Math.max(e, o) + ht;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < l && c.y + c.height > a
  );
}
function sh(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (ra(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && sa(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function rh(t, e, n, o, i, r, s) {
  const a = ys(n), l = ys(r), c = t + a.x * Hn, d = e + a.y * Hn, u = o + l.x * Hn, f = i + l.y * Hn, h = (_) => {
    const S = _.map((I) => ws(I, ti)), x = Kf(c, d, u, f, S);
    x.length;
    const b = x.find((I) => I.x === c && I.y === d), C = x.find((I) => I.x === u && I.y === f);
    b || x.push({ x: c, y: d, index: x.length }), C || x.push({ x: u, y: f, index: x.length });
    const E = b ?? x[x.length - (C ? 1 : 2)], T = C ?? x[x.length - 1];
    return eh(E, T, x, S);
  }, p = ih(t, e, o, i, s), g = p.length < s.length;
  let m = h(p);
  if (g) {
    const _ = s.map((x) => ws(x, ti));
    (!(m !== null && m.length >= 2) || sh(m, _)) && (m = h(s));
  }
  if (!m || m.length < 2) return null;
  const y = [
    { x: t, y: e, index: -1 },
    ...m,
    { x: o, y: i, index: -2 }
  ];
  return th(y);
}
const ah = 512, lt = /* @__PURE__ */ new Map();
function lh(t, e, n, o, i, r, s) {
  let a = `${Gf}|${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const l of s)
    a += `|${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.width)},${Math.round(l.height)}`;
  return a;
}
function aa(t, e, n, o, i, r, s) {
  const a = lh(t, e, n, o, i, r, s);
  if (lt.has(a)) {
    const c = lt.get(a);
    return lt.delete(a), lt.set(a, c), c;
  }
  const l = rh(t, e, n, o, i, r, s);
  return lt.set(a, l), lt.size > ah && lt.delete(lt.keys().next().value), l;
}
function ch({
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
    return vn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const l = aa(t, e, n, o, i, r, s);
  if (!l)
    return vn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: a
    });
  const c = nh(l, a), { x: d, y: u, offsetX: f, offsetY: h } = oh(l);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
const vs = 5;
function io(t) {
  return t ? t === !0 ? vs : t.spacing ?? vs : null;
}
function _s(t, e, n, o) {
  if (e <= 1) return 0;
  const r = Math.min((e - 1) * o, Math.max(0, n)) / (e - 1);
  return (t - (e - 1) / 2) * r;
}
function bs(t, e, n) {
  return e === "left" || e === "right" ? { x: t.x, y: t.y + n } : { x: t.x + n, y: t.y };
}
const xs = 20;
function la(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function dh(t, e) {
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
function ni(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const a = s.nodeOrigin ?? n ?? [0, 0], l = s.dimensions?.width ?? we, c = s.dimensions?.height ?? _e;
    o += s.position.x - l * a[0], i += s.position.y - c * a[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function yt(t, e, n) {
  if (!t.parentId)
    return t;
  const o = ni(t, e, n);
  return { ...t, position: o };
}
function so(t, e, n) {
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
  const e = la(t), n = [], o = /* @__PURE__ */ new Set();
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
function ca(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? ca(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function da(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function Po(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Rn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: we, height: _e };
  return da(t, o, i);
}
function uh(t, e, n) {
  const o = t.x + e.width + xs, i = t.y + e.height + xs, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function Es(t, e, n) {
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
function fh(t, e, n) {
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
function hh(t, e, n) {
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
function gh(t, e, n) {
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
function ph(t, e, n) {
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
function mh(t, e, n) {
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
function yh(t, e, n) {
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
function wh(t, e, n) {
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
const ua = {
  circle: { perimeterPoint: fh },
  diamond: { perimeterPoint: hh },
  hexagon: { perimeterPoint: gh },
  parallelogram: { perimeterPoint: ph },
  triangle: { perimeterPoint: mh },
  cylinder: { perimeterPoint: yh },
  stadium: { perimeterPoint: wh }
};
function fa(t, e = "light") {
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
const Mo = "__alpineflow_collab_store__";
function vh() {
  return typeof globalThis < "u" ? (globalThis[Mo] || (globalThis[Mo] = /* @__PURE__ */ new WeakMap()), globalThis[Mo]) : /* @__PURE__ */ new WeakMap();
}
const He = vh(), To = "__alpineflow_registry__";
function ha() {
  return typeof globalThis < "u" ? (globalThis[To] || (globalThis[To] = /* @__PURE__ */ new Map()), globalThis[To]) : /* @__PURE__ */ new Map();
}
function Dt(t) {
  return ha().get(t);
}
function _h(t, e) {
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
const bh = 1e3;
class xh {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? _h, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, bh);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Eh {
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
const Ch = {
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
}, Sh = {
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
}, kh = {
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
}, Cs = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Lh(t, e) {
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
    const r = Cs[o.style] ?? Cs.info, s = o.duration ?? 1500, a = Math.floor(s * 0.6), l = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
function Ph(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const Mh = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Th = 150;
function Ah(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function Nh(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = Ph(o), s = t[r], a = (l) => {
      let c;
      typeof s == "function" && (c = s(l));
      const d = Ch[o], u = d ? d(l) : [l], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = Mh.has(o) ? Ah(a, Th) : a;
  }
}
function $h(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(Sh)) {
    const r = e.on(o, (s) => {
      const a = t[i];
      if (typeof a != "function") return;
      const l = kh[o], c = l ? l(s) : Object.values(s);
      a.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Ih = 5;
function Dh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const a = /* @__PURE__ */ new Set();
  function l() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Ih && !o.has(c) && (o.add(c), console.warn(
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
function Hh(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Rh(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function un(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function ga(t, e, n, o) {
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
function ro(t, e, n, o) {
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
function Ss(t, e, n) {
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
function jt(t, e) {
  const n = Gt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function pa(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Fh(t, e, n = !0) {
  const o = jt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = jt(i);
    return n ? pa(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function Oh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = jt(t), i = jt(e);
  return n ? pa(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function zh(t, e, n, o, i = 5) {
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
function Vh(t) {
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
      V("init", `Adding ${o.length} node(s)`, o.map((d) => d.id));
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
              ], p = ga(f, d, h, u);
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
        ), m = ro(p, f, g, h);
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
      V("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = $f(n, t.nodes, t.edges));
      const a = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (a.push(u.id), !1) : !0), s.length && (t.edges.push(...s), V("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
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
      return Qo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return Tf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return Mf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return Nf(e, n, t.edges, o);
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
      V("filter", `Node filter applied: ${o.length} visible, ${n.length} filtered`), t._emit("node-filter-change", { filtered: n, visible: o });
    },
    /**
     * Clear node filter — restore all nodes to visible.
     */
    clearNodeFilter() {
      let e = !1;
      for (const n of t.nodes)
        n.filtered && (n.filtered = !1, e = !0);
      e && (V("filter", "Node filter cleared"), t._emit("node-filter-change", { filtered: [], visible: [...t.nodes] }));
    },
    /**
     * Get nodes whose bounding rect overlaps the given node.
     * Accepts either a FlowNode object or a node ID string.
     */
    getIntersectingNodes(e, n) {
      const o = typeof e == "string" ? t.nodes.find((i) => i.id === e) : e;
      return o ? Fh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : Oh(i, r, o);
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
function Bh(t) {
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
      t._captureHistory(), V("edge", `Adding ${i.length} edge(s)`, i.map((a) => a.id)), t.edges.push(...i), t._rebuildEdgeMap();
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
      V("edge", `Removing ${n.size} edge(s)`, [...n]);
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
function qh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Hr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Gu(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Yt(so(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n?.padding ?? Ko
      );
      V("viewport", "fitBounds", { rect: e, viewport: i });
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Yt(so(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n ?? Ko
      ) : { x: 0, y: 0, zoom: 1 };
    },
    // ── Viewport Mutation ─────────────────────────────────────────────────
    /**
     * Set the viewport programmatically (pan and/or zoom).
     */
    setViewport(e, n) {
      V("viewport", "setViewport", e), t._panZoom?.setViewport(e, n);
    },
    /**
     * Zoom in by `ZOOM_STEP_FACTOR`, clamped to `maxZoom`.
     */
    zoomIn(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Qi, o);
      V("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Qi, o);
      V("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, a = r.clientWidth / 2 - e * s, l = r.clientHeight / 2 - n * s;
      V("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: a, y: l, zoom: s }, i);
    },
    /**
     * Pan the viewport by a delta `(dx, dy)`.
     */
    panBy(e, n, o) {
      const i = t._viewportLive ?? t.viewport;
      V("viewport", "panBy", { dx: e, dy: n }), t._panZoom?.setViewport(
        { x: i.x + e, y: i.y + n, zoom: i.zoom },
        o
      );
    },
    // ── Interactivity Toggle ──────────────────────────────────────────────
    /**
     * Toggle pan/zoom interactivity on and off.
     */
    toggleInteractive() {
      t.isInteractive = !t.isInteractive, V("interactive", "toggleInteractive", { isInteractive: t.isInteractive }), t._panZoom?.update({
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
      V("panel", "resetPanels"), t._container?.dispatchEvent(new CustomEvent("flow-panel-reset")), t._emit("panel-reset");
    }
  };
}
let Et = null;
const Yh = 20;
function oi(t) {
  return JSON.parse(JSON.stringify(t));
}
function ks(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function ma(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return Et = {
    nodes: oi(n),
    edges: oi(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function Xh() {
  if (!Et || Et.nodes.length === 0) return null;
  Et.pasteCount++;
  const t = Et.pasteCount * Yh, e = /* @__PURE__ */ new Map(), n = Et.nodes.map((i) => {
    const r = ks(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: oi(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = Et.edges.map((i) => ({
    ...i,
    id: ks(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function Wh(t, e) {
  const n = ma(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function jh(t) {
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
        V("selection", "Deselecting all");
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
        return c ? Rf(c) : !1;
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
        ), f = ro(d, l, u, c);
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
            V("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (l.nodes.length > 0 && (V("delete", `onBeforeDelete approved ${l.nodes.length} node(s)`), t.removeNodes(l.nodes.map((c) => c.id))), l.edges.length > 0) {
              const c = l.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
              c.length > 0 && (V("delete", `onBeforeDelete approved ${c.length} edge(s)`), t.removeEdges(c));
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
          if (o.length > 0 && (V("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((l) => l.id))), n.length > 0) {
            const l = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            l.length > 0 && (V("delete", `Deleting ${l.length} selected edge(s)`), t.removeEdges(l));
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
      const e = ma(t.nodes, t.edges);
      e.nodeCount > 0 && (V("clipboard", `Copied ${e.nodeCount} node(s) and ${e.edgeCount} edge(s)`), t._emit("copy", e));
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
      const e = Xh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Mt(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
        for (const n of e.nodes)
          t.selectedNodes.add(n.id);
        for (const n of e.edges)
          t.selectedEdges.add(n.id);
        t._emitSelectionChange(), t._emit("nodes-change", { type: "add", nodes: e.nodes }), t._emit("edges-change", { type: "add", edges: e.edges }), t._emit("paste", { nodes: e.nodes, edges: e.edges }), V("clipboard", `Pasted ${e.nodes.length} node(s) and ${e.edges.length} edge(s)`), t.$nextTick(() => {
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
      const e = Wh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), V("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Uh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function ao(t, e, n = {}) {
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
      l === "id" || l === "__proto__" || l === "constructor" || l === "prototype" || Uh(a[l], c) || (a[l] = c);
    r.push(a);
  }
  return r;
}
function Ls(t, e, n) {
  const o = ao(t.nodes, Mt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = ao(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), V("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function Gh(t) {
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
      if (V("store", "fromObject: restoring state", {
        nodes: e.nodes?.length ?? 0,
        edges: e.edges?.length ?? 0,
        viewport: !!e.viewport
      }), e.nodes) {
        const n = Mt(
          JSON.parse(JSON.stringify(e.nodes))
        ), o = ao(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = ao(t.edges, n);
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
      V("store", "$reset: restoring initial config"), this.fromObject({
        nodes: t._config.nodes ?? [],
        edges: t._config.edges ?? [],
        viewport: t._config.viewport ?? { x: 0, y: 0, zoom: 1 }
      });
    },
    /**
     * Clear all nodes and edges, resetting the viewport to origin.
     */
    $clear() {
      V("store", "$clear: emptying canvas"), this.fromObject({
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
      e && Ls(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && Ls(t, e, "redo");
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
function Zh(t, e) {
  return t * (1 - e);
}
function Kh(t, e) {
  return t * e;
}
function Jh(t, e) {
  return e === "in" ? t : 1 - t;
}
function Qh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? Zh(o, e) : Kh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function eg(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function tg(t, e, n) {
  t.style.opacity = String(Jh(e, n));
}
function ng(t) {
  t.style.removeProperty("opacity");
}
const ot = Math.PI * 2, on = /* @__PURE__ */ new Map(), og = 64;
function Ci(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = on.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (on.size >= og) {
    const r = on.keys().next().value;
    r !== void 0 && on.delete(r);
  }
  return on.set(t, i), i;
}
function Hy(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(ot * l * a + o * ot),
    y: n + s * Math.sin(ot * l * a + o * ot)
  });
}
function Ry(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), u = d > 0 ? l / d : 1, h = -(d > 0 ? c / d : 0), p = u;
  return (g) => {
    const m = e + l * g, y = n + c * g, _ = r * Math.sin(ot * s * g + a * ot);
    return { x: m + h * _, y: y + p * _ };
  };
}
function Fy(t, e) {
  const n = Ci(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function Oy(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(ot * a + r * ot);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function zy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * ot, f = (Math.sin(s * u) + Math.sin(a * u * 1.3)) / 2, h = (Math.sin(l * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function Vy(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let Ps = !1;
function ve(t) {
  try {
    return structuredClone(t);
  } catch {
    return Ps || (Ps = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function ig(t) {
  return {
    position: { ...t.position },
    class: t.class,
    style: typeof t.style == "string" ? t.style : t.style ? { ...t.style } : void 0,
    data: ve(t.data),
    dimensions: t.dimensions ? { ...t.dimensions } : void 0,
    selected: t.selected,
    zIndex: t.zIndex
  };
}
function sg(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function rg(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = ve(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Si {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new zr();
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
    const o = new Si(this._canvas, this._engine);
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
    return Vr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, ig(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, sg(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && rg(o, n);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = to(e.easing), a = this._makeContext(n, e.id);
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
        const I = this._subTimelines.indexOf(T);
        I >= 0 && this._subTimelines.splice(I, 1);
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
    const S = e.edgeTransition ?? "none", x = e.addEdges?.map((T) => T.id) ?? [], b = e.removeEdges?.filter((T) => this._canvas.getEdge(T)).slice() ?? [], C = {
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
      transition: S,
      addEdgeIds: x,
      removeEdgeIds: b
    };
    if (i === 0)
      return this._executeInstantStep(C);
    const E = this._prepareAnimatedEdges(e, S, x);
    return E && await E, p ? this._executeFollowPathStep(C) : this._executeAnimatedStep(C);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, wn(s.style)));
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
    const n = Ci(e.followPath);
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
    } = e, S = e.resolvedPathFn;
    return new Promise((x) => {
      const b = this._engine.register((C) => {
        if (this._state === "stopped")
          return x(), !0;
        const E = Math.min(C / i, 1), T = s(E);
        if (a) {
          const I = S(T);
          for (const M of a) {
            const A = this._canvas.getNode(M);
            A && (A.position.x = I.x, A.position.y = I.y);
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
        ), this._tickEdgeTransitions(g, m, y, T), n.onProgress?.(E, o), E >= 1 ? (this._cleanupEdgeTransitions(g, m, y), y.length && this._removeEdges(y), this._applyStepInstant(n), _ && n.guidePath?.autoRemove !== !1 && _.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), x(), !0) : !1;
      }, r);
      this._activeHandles.push(b);
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
      const u = wn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), p = s.get(f);
        h && p && (h.style = Br(p, u, n));
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
        f && (h !== void 0 && typeof h == "string" ? f.color = _i(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = lf(c, d, n, {
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
      r && Qh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && eg(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && tg(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && ng(o);
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
    const r = n.dimensions?.width ?? we, s = n.dimensions?.height ?? _e, a = n.position.x + r / 2, l = n.position.y + s / 2;
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
const ya = /* @__PURE__ */ new Map();
function Zt(t, e) {
  ya.set(t, e);
}
function ag(t) {
  return ya.get(t);
}
const Re = "http://www.w3.org/2000/svg", lg = {
  create(t, e) {
    const n = document.createElementNS(Re, "circle");
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
}, cg = {
  create(t, e) {
    const n = document.createElementNS(Re, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Re, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Re, "circle");
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
let dg = 0;
const ug = {
  create(t, e) {
    const n = document.createElementNS(Re, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++dg}`, e.class)
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
          const m = document.createElementNS(Re, "defs");
          u = document.createElementNS(Re, "linearGradient"), u.setAttribute("id", a), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const y of s) {
            const _ = document.createElementNS(Re, "stop");
            _.setAttribute("offset", String(y.offset)), _.setAttribute("stop-color", y.color), y.opacity !== void 0 && _.setAttribute("stop-opacity", String(y.opacity)), u.appendChild(_);
          }
          m.appendChild(u), n.appendChild(m), g = `url(#${a})`, n.__gradient = u;
        }
        d = document.createElementNS(Re, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), u) {
        const g = Math.max(0, Math.min(e.pathLength, h)), m = Math.max(0, Math.min(e.pathLength, h - o)), y = e.pathEl.getPointAtLength(g), _ = e.pathEl.getPointAtLength(m);
        u.setAttribute("x1", String(_.x)), u.setAttribute("y1", String(_.y)), u.setAttribute("x2", String(y.x)), u.setAttribute("y2", String(y.y));
      }
      return;
    }
    let l = n.__fallbackRect;
    l || (l = document.createElementNS(Re, "rect"), l.setAttribute("width", String(o)), l.setAttribute("height", String(i)), l.setAttribute("rx", String(i / 2)), l.setAttribute("fill", r), l.setAttribute("opacity", "0.8"), n.appendChild(l), n.__fallbackRect = l);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    l.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, fg = {
  create(t, e) {
    const n = document.createElementNS(Re, "circle");
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
}, hg = {
  create(t, e) {
    const n = e.size ?? 16, o = e.href ?? "";
    let i;
    if (o.startsWith("#") ? (i = document.createElementNS(Re, "use"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))) : (i = document.createElementNS(Re, "image"), i.setAttribute("href", o), i.setAttribute("width", String(n)), i.setAttribute("height", String(n))), e.class)
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
Zt("circle", lg);
Zt("orb", cg);
Zt("beam", ug);
Zt("pulse", fg);
Zt("image", hg);
let Ms = !1;
function gg(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function Ts(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : gg(o);
}
function pg(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = ag(a);
    if (!l) {
      V("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    a === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !Ms && (Ms = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? yn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = Ts(r, h, f), g = { ...r, size: d, color: u }, m = l.create(i, g), y = o.getPointAtLength(0), _ = {
      x: y.x,
      y: y.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    l.update(m, _);
    let S;
    const x = new Promise((I) => {
      S = I;
    }), b = () => {
      typeof r.onComplete == "function" && r.onComplete(), S();
    }, C = s.wrapOnComplete ? s.wrapOnComplete(b) : b, E = {
      element: m,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: C,
      currentPosition: { x: y.x, y: y.y }
    };
    return t._activeParticles.add(E), t._particleEngineHandle || (t._particleEngineHandle = eo.register((I) => t._tickParticles(I))), {
      getCurrentPosition() {
        return t._activeParticles.has(E) ? { ...E.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(E) && (E.renderer.destroy(E.element), t._activeParticles.delete(E), C());
      },
      get finished() {
        return x;
      }
    };
  }
  function n(o, i = {}) {
    const r = t.getEdgeSvgElement?.();
    if (!r) {
      V("particle", "sendParticleAlongPath: SVG layer unavailable");
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
    return V("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), a;
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
        V("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const a = t.getEdgePathElement(o);
      if (!a) {
        V("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!a.getAttribute("d")) {
        V("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? yn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(a, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return p && V("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), p;
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
        V("particle", `sendParticleBetween: source node "${o}" not found`);
        return;
      }
      const a = t.getNode(i);
      if (!a) {
        V("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const l = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = a.position.x + (a.dimensions?.width ?? 150) / 2, u = a.position.y + (a.dimensions?.height ?? 40) / 2, f = `M ${l} ${c} L ${d} ${u}`;
      return V("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
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
        const h = Math.max(...f.map((g) => g.length)), p = Ts(l, h, "2s");
        for (const { id: g, length: m } of f) {
          const y = m / h, _ = p * y, S = p - _;
          if (S <= 0) {
            const x = this.sendParticle(g, { ...l, duration: _ });
            x && c.push(x);
          } else {
            const x = setTimeout(() => {
              const b = this.sendParticle(g, { ...l, duration: _ });
              b && c.push(b);
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
class mg {
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
const ii = 1, si = 1 / 60;
class ln {
  constructor(e) {
    this._virtualTime = 0, this._inFlight = /* @__PURE__ */ new Map(), this._state = ve(e);
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
    return ve(this._state);
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
            o?.id && (this._state.nodes[o.id] = ve(o));
        else n?.id ? this._state.nodes[n.id] = ve(n) : e.args.id && e.args.node && (this._state.nodes[e.args.id] = ve(e.args.node));
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
            o?.id && (this._state.edges[o.id] = ve(o));
        else n?.id ? this._state.edges[n.id] = ve(n) : e.args.id && e.args.edge && (this._state.edges[e.args.id] = ve(e.args.edge));
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
    this._state = ve(e.canvas), this._virtualTime = e.t, this._inFlight.clear();
    for (const n of e.inFlight) {
      const o = ve(n);
      this._rehydrateAnim(o), this._inFlight.set(o.handleId, o);
    }
  }
  /** Capture the current engine state as a serializable Checkpoint payload. */
  captureCheckpointData() {
    return {
      canvas: ve(this._state),
      inFlight: [...this._inFlight.values()].map((e) => this._serializeAnim(e)),
      tagRegistry: {}
    };
  }
  // ── Private helpers ───────────────────────────────────────────────────────
  _applyAnimate(e) {
    const n = e.args.handleId ?? `virt-${this._virtualTime.toFixed(3)}-${this._inFlight.size}`;
    e.args.handleId || console.warn("[AlpineFlow VirtualEngine] animate event missing handleId — determinism not guaranteed for this event");
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Wr(r) ?? void 0 : void 0, a = {
      handleId: n,
      type: s ? s.type : "eased",
      targets: ve(o),
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
      e._easingFn = to(e.easing);
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
      e._easingFn = to(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
    return ve({
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
            qr(r, o, n);
            break;
          case "decay":
            bi(r, o, n);
            break;
          case "inertia":
            Yr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            Xr(r, s, l, i), l >= 1 && (r.settled = !0);
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
const wa = /* @__PURE__ */ new Map();
function ki(t, e) {
  wa.set(t, e);
}
function yg(t) {
  return wa.get(t);
}
function Li(t, e = 20) {
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
function va(t) {
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
const wg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Li(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += va(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, vg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = Li(t.nodes);
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
}, _g = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = Li(t.nodes);
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
    u += va(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, p = f.position?.y ?? 0, g = f.dimensions?.width ?? 150, m = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${p}" width="${g}" height="${m}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
ki("faithful", wg);
ki("outline", vg);
ki("activity", _g);
function ri(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function ai(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function bg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function _a(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      _a(t[e]);
  }
  return t;
}
class Pi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = _a(ve(e.initialState)), this.events = Object.freeze(ve(e.events)), this.checkpoints = Object.freeze(ve(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
  }
  toJSON() {
    return {
      version: this.version,
      duration: this.duration,
      initialState: ve(this.initialState),
      events: ve(this.events),
      checkpoints: ve(this.checkpoints),
      metadata: { ...this.metadata }
    };
  }
  static fromJSON(e) {
    if (e.version > ii)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${ii}). Please update AlpineFlow to replay this recording.`
      );
    return new Pi(e);
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
      const i = bg(o.canvas, e);
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
    const a = si * 1e3;
    let l = o ? ri(r, i) : ai(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = yg(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class xg {
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
      version: ii,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Pi(i);
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
      o && typeof o == "object" && "id" in o && (e[o.id] = ve(o));
    const n = {};
    for (const o of this._canvas.edges ?? [])
      o && typeof o == "object" && "id" in o && (n[o.id] = ve(o));
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
        targets: ve(n.targets),
        startTime: n.eventT,
        duration: i ? void 0 : o.duration ?? 300,
        easing: i ? void 0 : o.easing,
        motion: i ? ve(o.motion) : void 0,
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
class Eg {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Ao(), this._scheduleTick());
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
    const a = si * 1e3;
    let l = n ? ri(r, i) : ai(r, i);
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
    const e = Ao(), n = (e - this._lastWallTime) / 1e3;
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
    const s = si * 1e3;
    let a = e === 0 ? ai(i, 0) : ri(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Ao(), this._scheduleTick();
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
function Ao() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Cg(t) {
  const e = pg(t);
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
      const n = new Si(t, eo);
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
        V("animation", `Named animation "${n}" not found`);
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
      if (V("animate", "update() called", {
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
            let S = null;
            typeof g.followPath == "function" ? S = g.followPath : S = Ci(g.followPath);
            let x = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const b = t.getEdgeSvgElement?.();
              b && (x = document.createElementNS("http://www.w3.org/2000/svg", "path"), x.setAttribute("d", g.followPath), x.classList.add("flow-guide-path"), g.guidePath.class && x.classList.add(g.guidePath.class), b.appendChild(x));
            }
            if (S) {
              const b = S, C = x, E = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${p}:followPath`,
                from: 0,
                to: 1,
                apply: (T) => {
                  const I = t._nodeMap.get(p);
                  if (!I) return;
                  const M = b(T);
                  Ce().raw(I).position.x = M.x, Ce().raw(I).position.y = M.y, s.add(p), T >= 1 && C && E && C.remove();
                }
              });
            }
          } else if (g.position) {
            const x = Ce().raw(m).position;
            if (g.position.x !== void 0) {
              const b = g.position.x;
              if (_)
                x.x = b;
              else {
                const C = x.x;
                r.push({
                  key: `node:${p}:position.x`,
                  from: C,
                  to: b,
                  apply: (E) => {
                    const T = t._nodeMap.get(p);
                    T && (Ce().raw(T).position.x = E, s.add(p));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const b = g.position.y;
              if (_)
                x.y = b;
              else {
                const C = x.y;
                r.push({
                  key: `node:${p}:position.y`,
                  from: C,
                  to: b,
                  apply: (E) => {
                    const T = t._nodeMap.get(p);
                    T && (Ce().raw(T).position.y = E), s.add(p);
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
              const S = wn(m.style || {}), x = wn(g.style), b = t._nodeElements.get(p);
              if (b) {
                const C = getComputedStyle(b);
                for (const E of Object.keys(x))
                  S[E] === void 0 && (S[E] = C.getPropertyValue(E));
              }
              r.push({
                key: `node:${p}:style`,
                from: 0,
                to: 1,
                apply: (C) => {
                  const E = t._nodeMap.get(p);
                  E && (Ce().raw(E).style = Br(S, x, C), a.add(p));
                }
              });
            }
          g.dimensions && m.dimensions && (g.dimensions.width !== void 0 && (_ ? m.dimensions.width = g.dimensions.width : r.push({
            key: `node:${p}:dimensions.width`,
            from: m.dimensions.width,
            to: g.dimensions.width,
            apply: (S) => {
              m.dimensions.width = S;
            }
          })), g.dimensions.height !== void 0 && (m.fixedDimensions = !0, _ ? m.dimensions.height = g.dimensions.height : r.push({
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
          const _ = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              m.color = g.color;
            else if (_)
              m.color = g.color, l.add(p);
            else {
              const S = typeof m.color == "string" && m.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || vi;
              r.push({
                key: `edge:${p}:color`,
                from: S,
                to: g.color,
                apply: (x) => {
                  const b = t._edgeMap.get(p);
                  b && (Ce().raw(b).color = x, l.add(p));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (_)
              m.strokeWidth = g.strokeWidth, l.add(p);
            else {
              const S = m.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${p}:strokeWidth`,
                from: S,
                to: g.strokeWidth,
                apply: (x) => {
                  const b = t._edgeMap.get(p);
                  b && (Ce().raw(b).strokeWidth = x, l.add(p));
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
      const h = Ce().raw(t._animator).animate(r, {
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
              const y = Ce().raw(m);
              (g.followPath || g.position?.x !== void 0) && (m.position.x = y.position.x), (g.followPath || g.position?.y !== void 0) && (m.position.y = y.position.y), g.style !== void 0 && (m.style = y.style);
            }
          if (n.edges)
            for (const [p, g] of Object.entries(n.edges)) {
              const m = t._edgeMap.get(p);
              if (!m) continue;
              const y = Ce().raw(m);
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
      const i = Vr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const a = o.zoom, l = eo.register(() => {
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
      return Ce().raw(t._animator).registry.getHandles(n);
    },
    /**
     * Cancel all animations matching a tag filter.
     */
    cancelAll(n, o) {
      Ce().raw(t._animator).registry.cancelAll(n, o);
    },
    /**
     * Pause all animations matching a tag filter.
     */
    pauseAll(n) {
      Ce().raw(t._animator).registry.pauseAll(n);
    },
    /**
     * Resume all animations matching a tag filter.
     */
    resumeAll(n) {
      Ce().raw(t._animator).registry.resumeAll(n);
    },
    /**
     * Create a named group that auto-tags all animations made through it.
     */
    group(n) {
      const o = this;
      return new mg(n, {
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
      const o = Ce().raw(t._animator), i = o.beginTransaction();
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
      const n = structuredClone(Ce().raw(t.nodes)), o = structuredClone(Ce().raw(t.edges)), i = { ...t.viewport };
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
      }, h = new xg(f, o), p = async () => {
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
      return new Eg(r, n, o);
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
function As(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return wt(t, e);
  const r = /* @__PURE__ */ new Set(), s = Qo(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = Qo(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function Sg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function No(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Ns(t, e, n, o = !0) {
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
function $o(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function kg(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Fn = { width: 150, height: 50 };
function Lg(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = As(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      V("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = Sg(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? Fn, d = r && s ? s : c, u = {};
        for (const [h] of l.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? Fn;
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
            No(o, t.nodes, l, s), l.reroutedEdges = $o(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (No(o, t.nodes, l, s), l.reroutedEdges = $o(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        No(o, t.nodes, l, s), l.reroutedEdges = $o(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
    },
    /**
     * Expand a previously collapsed node — restore descendants/outgoers.
     */
    expandNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || !o.collapsed) return;
      const i = t._collapseState.get(e);
      if (!i) return;
      V("collapse", `Expanding node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i.targetPositions.keys()],
        animate: n?.animate !== !1,
        reroutedEdges: i.reroutedEdges.size
      }), t._captureHistory();
      const r = o.type === "group", s = n?.animate !== !1;
      if (i.reroutedEdges.size > 0 && kg(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? Fn;
        Ns(o, t.nodes, i, r);
        const l = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const p = h.dimensions ?? Fn;
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
        Ns(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
    },
    /**
     * Toggle collapse/expand state of a node.
     */
    toggleNode(e, n) {
      const o = t._nodeMap.get(e);
      o && (V("collapse", `Toggle node "${e}" → ${o.collapsed ? "expand" : "collapse"}`), o.collapsed ? this.expandNode(e, n) : this.collapseNode(e, n));
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
      return As(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return wt(e, t.nodes).size;
    }
  };
}
function Pg(t) {
  return {
    /**
     * Condense a node — switch to summary view hiding internal rows.
     */
    condenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || n.condensed || (t._captureHistory(), n.condensed = !0, V("condense", `Node "${e}" condensed`), t._emit("node-condense", { node: n }));
    },
    /**
     * Uncondense a node — restore full row view.
     */
    uncondenseNode(e) {
      const n = t._nodeMap.get(e);
      !n || !n.condensed || (t._captureHistory(), n.condensed = !1, V("condense", `Node "${e}" uncondensed`), t._emit("node-uncondense", { node: n }));
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
function Mg(t) {
  return {
    // ── Row Selection ────────────────────────────────────────────────────
    selectRow(e) {
      if (t.selectedRows.has(e)) return;
      t.selectedRows.add(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      V("selection", `Row "${e}" selected`), t._emit("row-select", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
    },
    deselectRow(e) {
      if (!t.selectedRows.has(e)) return;
      t.selectedRows.delete(e);
      const n = e.indexOf("."), o = n === -1 ? e : e.slice(0, n), i = n === -1 ? "" : e.slice(n + 1);
      V("selection", `Row "${e}" deselected`), t._emit("row-deselect", { rowId: e, nodeId: o, attrId: i }), t._emit("row-selection-change", { selectedRows: [...t.selectedRows] });
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
      t.selectedRows.size !== 0 && (V("selection", "Deselecting all rows"), t.selectedRows.clear(), t._container?.querySelectorAll(".flow-row-selected").forEach((e) => {
        e.classList.remove("flow-row-selected");
      }), t._emit("row-selection-change", { selectedRows: [] }));
    },
    // ── Row Filtering ────────────────────────────────────────────────────
    setRowFilter(e, n) {
      const o = t._nodeMap.get(e);
      o && (o.rowFilter = n, V("filter", `Node "${e}" row filter set to "${typeof n == "function" ? "predicate" : n}"`));
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
const Tg = 8, Ag = 12, Ng = 2;
function Mi(t) {
  return {
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function $g(t) {
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
function Ig(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function $s(t, e, n) {
  const o = e.gap ?? Tg, i = e.padding ?? Ag, r = e.headerHeight ?? 0, s = $g(e), a = Ig(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Dg(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? Hg(a, o, i, r, s, u, l, c) : Rg(a, o, i, r, s, e.columns ?? Ng, d, u, l, c);
}
function Dg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Mi(f));
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
function Hg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Mi(f));
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
function Rg(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), u = t.map((y) => Mi(y));
  let f = 0, h = 0;
  for (const y of u)
    f = Math.max(f, y.width), h = Math.max(h, y.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (f = p);
  const g = Math.ceil(t.length / d), m = a > 0 ? (a - (g - 1) * e) / g : 0;
  m > 0 && (h = m);
  for (let y = 0; y < t.length; y++) {
    const _ = y % d, S = Math.floor(y / d), x = n + _ * (f + e), b = n + o + S * (h + e);
    l.set(t[y].id, { x, y: b }), i === "both" ? c.set(t[y].id, { width: f, height: h }) : i === "width" ? c.set(t[y].id, { width: f, height: u[y].height }) : i === "height" && c.set(t[y].id, { width: u[y].width, height: h });
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
function Fg(t) {
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
      if (V("layout", `_applyLayout: repositioning ${e.size} node(s)`, {
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
      const p = u.childLayout, g = p.headerHeight !== void 0 ? p : u.data?.label ? { ...p, headerHeight: 30 } : p, m = $s(f, g, d);
      for (const [x, b] of m.positions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const C = h.get(x);
        C && (C.position ? (C.position.x = b.x, C.position.y = b.y) : C.position = { x: b.x, y: b.y });
      }
      for (const [x, b] of m.dimensions) {
        if (x === s || l && x === l.id && !t._nodeMap.has(x)) continue;
        const C = h.get(x);
        if (C) {
          let E = b.width, T = b.height;
          C.minDimensions && (C.minDimensions.width != null && (E = Math.max(E, C.minDimensions.width)), C.minDimensions.height != null && (T = Math.max(T, C.minDimensions.height))), C.maxDimensions && (C.maxDimensions.width != null && (E = Math.min(E, C.maxDimensions.width)), C.maxDimensions.height != null && (T = Math.min(T, C.maxDimensions.height))), C.dimensions ? (C.dimensions.width = E, C.dimensions.height = T) : C.dimensions = { width: E, height: T }, C.childLayout && !c && this.layoutChildren(x, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: C.dimensions });
        }
      }
      let y = m.parentDimensions.width, _ = m.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (y = Math.max(y, u.minDimensions.width)), u.minDimensions.height != null && (_ = Math.max(_, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (y = Math.min(y, u.maxDimensions.width)), u.maxDimensions.height != null && (_ = Math.min(_, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = y, u.dimensions.height = _, y !== m.parentDimensions.width || _ !== m.parentDimensions.height) {
        const b = $s(f, g, { width: y, height: _ });
        for (const [C, E] of b.positions) {
          if (C === s || l && C === l.id && !t._nodeMap.has(C)) continue;
          const T = h.get(C);
          T && (T.position ? (T.position.x = E.x, T.position.y = E.y) : T.position = { x: E.x, y: E.y });
        }
        for (const [C, E] of b.dimensions) {
          if (C === s || l && C === l.id && !t._nodeMap.has(C)) continue;
          const T = h.get(C);
          if (T) {
            let I = E.width, M = E.height;
            T.minDimensions && (T.minDimensions.width != null && (I = Math.max(I, T.minDimensions.width)), T.minDimensions.height != null && (M = Math.max(M, T.minDimensions.height))), T.maxDimensions && (T.maxDimensions.width != null && (I = Math.min(I, T.maxDimensions.width)), T.maxDimensions.height != null && (M = Math.min(M, T.maxDimensions.height))), T.dimensions ? (T.dimensions.width = I, T.dimensions.height = M) : T.dimensions = { width: I, height: M }, T.childLayout && !c && this.layoutChildren(C, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: T.dimensions });
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
      const n = Dt("layout:dagre");
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
      }), V("layout", "Applied dagre layout", { direction: o }), t._emit("layout", { type: "dagre", direction: o });
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
      const n = Dt("layout:force");
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
      }), V("layout", "Applied force layout", { charge: e?.charge ?? -300, distance: e?.distance ?? 150 }), t._emit("layout", { type: "force", charge: e?.charge ?? -300, distance: e?.distance ?? 150 });
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
      const n = Dt("layout:hierarchy");
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
      }), V("layout", "Applied tree layout", { layoutType: e?.layoutType ?? "tree", direction: o }), t._emit("layout", { type: "tree", layoutType: e?.layoutType ?? "tree", direction: o });
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
      const n = Dt("layout:elk");
      if (!n)
        throw new Error("elkLayout() requires the elk plugin. Register it with: Alpine.plugin(AlpineFlowElk)");
      const o = e?.direction ?? "DOWN", i = e?.includeChildren ? t.nodes : t.nodes.filter((s) => !s.parentId), r = await n(i, t.edges, {
        algorithm: e?.algorithm,
        direction: o,
        nodeSpacing: e?.nodeSpacing,
        layerSpacing: e?.layerSpacing
      });
      if (r.size === 0) {
        V("layout", "ELK layout returned no positions — skipping apply");
        return;
      }
      this._applyLayout(r, {
        adjustHandles: e?.adjustHandles,
        handleDirection: o,
        fitView: e?.fitView,
        duration: e?.duration
      }), V("layout", "Applied ELK layout", { algorithm: e?.algorithm ?? "layered", direction: o }), t._emit("layout", { type: "elk", algorithm: e?.algorithm ?? "layered", direction: o });
    }
  };
}
function Og(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return un(n, t._config.childValidationRules ?? {});
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
        const r = un(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((l) => l.parentId === o), a = Ss(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = un(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = Ss(n, i, o);
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
              ), p = ro(f, o, h, u);
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
        ), u = ga(r, o, d, s);
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
            ), h = ro(u, o, f, d);
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
function zg(t) {
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
function qn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), a = Math.sin(r), l = t - n, c = e - o;
  return {
    x: n + l * s - c * a,
    y: o + l * a + c * s
  };
}
function Vg(t) {
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
const Bg = 40;
function qg(t, e = Bg) {
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
function Yg(t) {
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
function Xg({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return oo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = aa(t, e, n, o, i, r, s);
  if (!a)
    return oo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = qg(a), { x: c, y: d, offsetX: u, offsetY: f } = Yg(a);
  return {
    path: l,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Wg(t) {
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
      c = Is(l);
      break;
    case "step":
      c = jg(l, 0);
      break;
    case "smoothstep":
      c = Ug(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = Vg(l.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Is(l);
  }
  const d = Gg(l), u = Sn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Is(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function jg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ba(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ba(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Ug(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ba(t[0], t[1], e);
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
function Gg(t) {
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
function Ut(t, e, n, o) {
  const i = t.dimensions?.width ?? we, r = t.dimensions?.height ?? _e, s = Gt(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? ua[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = Es(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = Es(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = qn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function Ds(t) {
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
function li(t) {
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
const Zg = 1.5, Kg = 5 / 20;
function Ht(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = li(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const l = (i.width ?? 12.5) * Zg * Kg * 0.4, c = r + l, d = li(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function lo(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d, u) {
  const f = r ?? Ut(e, o, c, d), h = s ?? Ut(n, i, c, d), p = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: Ds(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Ds(i)
  }, g = t.type ?? u ?? "bezier";
  if (a?.[g])
    return a[g](p);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return Wg({
        ...p,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Xg({ ...p, obstacles: l });
    case "orthogonal":
      return ch({ ...p, obstacles: l });
    case "smoothstep":
      return vn(p);
    case "straight":
      return Zr({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return oo(p);
  }
}
function Hs(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? qn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? qn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const l = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(a);
  let f;
  d / l > u / c ? f = l / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + a * f
  };
  return t.rotation ? qn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Rs(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = t.position.x + n / 2, r = t.position.y + o / 2;
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
function xa(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? we, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = Hs(t, a), c = Hs(e, s), d = Rs(t, l), u = Rs(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function By(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function Ea(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function Ca(t, e) {
  return `${t}__grad__${e}`;
}
function Sa(t, e, n, o, i, r, s) {
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
function Io(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
function Jg(t, e) {
  return Array.isArray(t) ? t.findIndex((n) => n?.name === e) : -1;
}
function Fs(t, e, n, o, i) {
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
const Qg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function ep(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const a = r.getNode(e);
  if (a && !Be(a))
    return { applied: !1 };
  const l = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Qr({
    edge: i,
    newConnection: l,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: l }), { applied: !0, newConnection: l }) : { applied: !1, reason: d.reason, newConnection: l };
}
function tp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ka(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Os(t, e) {
  if (!e) return t;
  const n = li(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function zs(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function co(t, e) {
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
function uo(t, e, n, o, i, r, s) {
  const a = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (a) {
    if (n) {
      const c = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = co(c, r);
      if (!d) {
        const u = a.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = co(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ka(n);
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
function Vs(t, e, n, o) {
  if (!t || !e || t.hidden || t.collapsed || t.condensed || t.rotation) return -1;
  const i = t.nodeOrigin;
  if (i && (i[0] !== 0 || i[1] !== 0) || !n?.hasAttribute("data-flow-schema-node") || n.style.display === "none") return -1;
  const r = t.dimensions?.width, s = t.dimensions?.height;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s)) return -1;
  const a = t.data?.fields;
  if (!Array.isArray(a) || a.length === 0) return -1;
  const l = o.insetTop + o.headerHeight + (a.length - 1) * o.rowHeight + o.rowHeightLast + o.insetBottom;
  return Math.abs(l - s) > 0.5 ? -1 : Jg(a, e);
}
function Bs(t, e, n, o, i) {
  const r = t.dimensions?.width ?? we, s = e.x + (i.insetLeft + (r - i.insetRight)) / 2;
  return n === "source" ? o >= s ? "right" : "left" : o > s ? "right" : "left";
}
function qs(t) {
  return t.position.x + (t.dimensions?.width ?? we) / 2;
}
function np(t, e, n, o, i, r, s, a) {
  const l = Vs(t, i, s?.get(t.id), a);
  if (l < 0) return null;
  const c = Vs(e, r, s?.get(e.id), a);
  if (c < 0) return null;
  const d = Bs(t, n.position, "source", qs(o), a), u = Bs(e, o.position, "target", qs(n), a), f = Fs(t, n.position, l, d, a), h = Fs(e, o.position, c, u, a);
  if (!f || !h) return null;
  const p = { handleWidth: a.handleWidth, handleHeight: a.handleHeight };
  return {
    sourcePos: f.position,
    targetPos: h.position,
    srcMeasurement: { x: f.x, y: f.y, ...p },
    tgtMeasurement: { x: h.x, y: h.y, ...p }
  };
}
function Ys(t, e, n, o, i, r, s, a, l) {
  const c = l ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const g = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = co(g, a), !d) {
      const m = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = co(m, a);
    }
    if (!d) {
      const m = ka(o);
      m && (d = c.querySelector(`[data-flow-handle-position="${m}"]`));
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
function op(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function ct(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function ip(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function sp(t) {
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
      function _(L, $, F, K, ne) {
        p || (p = document.createElementNS("http://www.w3.org/2000/svg", "circle"), p.classList.add("flow-edge-dot"), p.style.pointerEvents = "none", L.appendChild(p));
        const G = F.closest(".flow-container"), B = G ? getComputedStyle(G) : null, z = K.particleSize ?? (parseFloat(B?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), Y = ne || B?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        p.setAttribute("r", String(z)), K.particleColor ? p.style.fill = K.particleColor : p.style.removeProperty("fill");
        const W = p.querySelector("animateMotion");
        W && W.remove();
        const j = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        j.setAttribute("dur", Y), j.setAttribute("repeatCount", "indefinite"), j.setAttribute("path", $), p.appendChild(j);
      }
      function S() {
        p?.remove(), p = null;
      }
      let x = null, b = null, C = null, E = null;
      const T = (L) => {
        L.stopPropagation();
        const $ = o(n);
        if (!$) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: $, event: L }), mt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has($.id) ? (F.selectedEdges.delete($.id), $.selected = !1, V("selection", `Edge "${$.id}" deselected (shift)`)) : (F.selectedEdges.add($.id), $.selected = !0, V("selection", `Edge "${$.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add($.id), $.selected = !0, V("selection", `Edge "${$.id}" selected`)), F._emitSelectionChange());
      }, I = (L) => {
        L.preventDefault(), L.stopPropagation();
        const $ = o(n);
        if (!$) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = L.target;
        if (K.classList.contains("flow-edge-control-point")) {
          const ne = parseInt(K.dataset.pointIndex ?? "", 10);
          if (!isNaN(ne)) {
            F._emit("edge-control-point-context-menu", {
              edge: $,
              pointIndex: ne,
              position: { x: L.clientX, y: L.clientY },
              event: L
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: $, event: L });
      }, M = (L) => {
        L.stopPropagation(), L.preventDefault();
        const $ = o(n), F = t.$data(e.closest("[x-data]"));
        if (!$ || !F || ($.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const ne = L.target;
        if (ne.classList.contains("flow-edge-control-point")) {
          const G = parseInt(ne.dataset.pointIndex ?? "", 10);
          !isNaN(G) && $.controlPoints && (F._captureHistory?.(), $.controlPoints.splice(G, 1), F._emit("edge-control-point-change", { edge: $, action: "remove", index: G }));
          return;
        }
        if (ne.classList.contains("flow-edge-midpoint")) {
          const G = parseInt(ne.dataset.segmentIndex ?? "", 10);
          if (!isNaN(G)) {
            const B = F.screenToFlowPosition(L.clientX, L.clientY);
            $.controlPoints || ($.controlPoints = []), F._captureHistory?.(), $.controlPoints.splice(G, 0, { x: B.x, y: B.y }), F._emit("edge-control-point-change", { edge: $, action: "add", index: G });
          }
          return;
        }
        if (ne.closest("path")) {
          const G = F.screenToFlowPosition(L.clientX, L.clientY);
          $.controlPoints || ($.controlPoints = []);
          const B = [
            x ?? { x: 0, y: 0 },
            ...$.controlPoints,
            b ?? { x: 0, y: 0 }
          ];
          let z = 0, Y = 1 / 0;
          for (let W = 0; W < B.length - 1; W++) {
            const j = ip(G, B[W], B[W + 1]);
            j < Y && (Y = j, z = W);
          }
          F._captureHistory?.(), $.controlPoints.splice(z, 0, { x: G.x, y: G.y }), F._emit("edge-control-point-change", { edge: $, action: "add", index: z });
        }
      }, A = (L) => {
        const $ = L.target;
        if (!$.classList.contains("flow-edge-control-point") || L.button !== 0) return;
        L.stopPropagation(), L.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const K = t.$data(e.closest("[x-data]"));
        if (!K) return;
        const ne = parseInt($.dataset.pointIndex ?? "", 10);
        if (isNaN(ne)) return;
        $.classList.add("dragging");
        let G = !1;
        const B = (Y) => {
          G || (K._captureHistory?.(), G = !0);
          let W = K.screenToFlowPosition(Y.clientX, Y.clientY);
          const j = K._config?.snapToGrid;
          j && (W = {
            x: Math.round(W.x / j[0]) * j[0],
            y: Math.round(W.y / j[1]) * j[1]
          }), F.controlPoints[ne] = W;
        }, z = () => {
          document.removeEventListener("pointermove", B), document.removeEventListener("pointerup", z), $.classList.remove("dragging"), G && K._emit("edge-control-point-change", { edge: F, action: "move", index: ne });
        };
        document.addEventListener("pointermove", B), document.addEventListener("pointerup", z);
      };
      s.addEventListener("contextmenu", I), s.addEventListener("dblclick", M), s.addEventListener("pointerdown", A, !0);
      let P = null;
      const v = (L) => {
        if (L.button !== 0) return;
        L.stopPropagation();
        const $ = o(n);
        if (!$) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = F._config?.reconnectSnapRadius ?? es, ne = F._config?.edgesReconnectable !== !1, G = $.reconnectable ?? !0;
        let B = null;
        if (ne && G !== !1 && x && b) {
          const re = F.screenToFlowPosition(L.clientX, L.clientY), me = ct(re.x, re.y, x.x, x.y, K) || C && ct(re.x, re.y, C.x, C.y, K);
          (ct(re.x, re.y, b.x, b.y, K) || E && ct(re.x, re.y, E.x, E.y, K)) && (G === !0 || G === "target") ? B = "target" : me && (G === !0 || G === "source") && (B = "source");
        }
        if (!B) {
          const re = (me) => {
            document.removeEventListener("pointerup", re), T(me);
          };
          document.addEventListener("pointerup", re, { once: !0 });
          return;
        }
        const z = L.clientX, Y = L.clientY;
        let W = !1, j = !1, H = null;
        const te = F._config?.connectionSnapRadius ?? 20;
        let Q = null, U = null, J = null, se = z, oe = Y;
        const Z = e.closest(".flow-container");
        if (!Z) return;
        const ee = B === "target" ? x : b, ge = () => {
          W = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: $, handleType: B }), V("reconnect", `Reconnection drag started on edge "${$.id}" (${B} end)`), U = Wt({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), Q = U.svg;
          const re = F.screenToFlowPosition(z, Y);
          U.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: re.x,
            toY: re.y,
            source: $.source,
            sourceHandle: $.sourceHandle
          });
          const me = Z.querySelector(".flow-viewport");
          me && me.appendChild(Q), B === "target" && (F.pendingConnection = {
            source: $.source,
            sourceHandle: $.sourceHandle,
            position: re
          }), F._pendingReconnection = {
            edge: $,
            draggedEnd: B,
            anchorPosition: { ...ee },
            position: re
          }, J = vo(Z, F, se, oe), B === "target" && bn(Z, $.source, $.sourceHandle ?? "source", F, $.id);
        }, fe = (re) => {
          if (se = re.clientX, oe = re.clientY, !W) {
            Math.sqrt(
              (re.clientX - z) ** 2 + (re.clientY - Y) ** 2
            ) >= Qn && ge();
            return;
          }
          const me = F.screenToFlowPosition(re.clientX, re.clientY), ye = _n({
            containerEl: Z,
            handleType: B === "target" ? "target" : "source",
            excludeNodeId: B === "target" ? $.source : $.target,
            cursorFlowPos: me,
            connectionSnapRadius: te,
            getNode: (Pe) => F.getNode(Pe),
            toFlowPosition: (Pe, Ee) => F.screenToFlowPosition(Pe, Ee)
          });
          ye.element !== H && (H?.classList.remove("flow-handle-active"), ye.element?.classList.add("flow-handle-active"), H = ye.element), U?.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: ye.position.x,
            toY: ye.position.y,
            source: $.source,
            sourceHandle: $.sourceHandle
          });
          const Oe = ye.position;
          B === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: Oe
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: Oe
          }), J?.updatePointer(re.clientX, re.clientY);
        }, ie = () => {
          j || (j = !0, document.removeEventListener("pointermove", fe), document.removeEventListener("pointerup", pe), J?.stop(), J = null, U?.destroy(), U = null, Q = null, H?.classList.remove("flow-handle-active"), P = null, s.classList.remove("flow-edge-reconnecting"), ke(Z), F.pendingConnection = null, F._pendingReconnection = null);
        }, pe = async (re) => {
          if (!W) {
            ie(), T(re);
            return;
          }
          if (F._connectValidating) return;
          let me = H, ye = null;
          if (!me) {
            ye = document.elementFromPoint(re.clientX, re.clientY);
            const Me = B === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            me = ye?.closest(Me);
          }
          const Pe = (me ? me.closest("[data-flow-node-id]") : ye?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Ee = me?.dataset.flowHandleId, he = U?.svg ?? null;
          kt(he, !0);
          let be;
          try {
            be = await ep({
              dropNodeId: Pe,
              dropHandleId: Ee,
              draggedEnd: B,
              edge: $,
              canvas: F,
              containerEl: Z
            });
          } finally {
            kt(he, !1);
          }
          be.applied ? V("reconnect", `Edge "${$.id}" reconnected (${B})`, be.newConnection) : V("reconnect", `Edge "${$.id}" reconnection cancelled — snapping back`, { reason: be.reason }), F._emit("reconnect-end", { edge: $, successful: be.applied }), ie();
        };
        document.addEventListener("pointermove", fe), document.addEventListener("pointerup", pe), P = ie;
      };
      s.addEventListener("pointerdown", v);
      const w = (L) => {
        const $ = o(n);
        if (!$) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = F._config?.edgesReconnectable !== !1, ne = $.reconnectable ?? !0;
        if (!K || ne === !1 || !x || !b) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const G = F._config?.reconnectSnapRadius ?? es, B = F.screenToFlowPosition(L.clientX, L.clientY), z = (ct(B.x, B.y, x.x, x.y, G) || C && ct(B.x, B.y, C.x, C.y, G)) && (ne === !0 || ne === "source"), Y = (ct(B.x, B.y, b.x, b.y, G) || E && ct(B.x, B.y, E.x, E.y, G)) && (ne === !0 || ne === "target");
        z || Y ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", w);
      const N = (L) => {
        if (L.key !== "Enter" && L.key !== " ") return;
        L.preventDefault(), L.stopPropagation();
        const $ = o(n);
        if (!$) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: $, event: L }), mt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has($.id) ? (F.selectedEdges.delete($.id), $.selected = !1) : (F.selectedEdges.add($.id), $.selected = !0) : (F.deselectAll(), F.selectedEdges.add($.id), $.selected = !0), F._emitSelectionChange());
      };
      s.addEventListener("keydown", N);
      const k = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", k), s.addEventListener("blur", R);
      const O = (L) => {
        L.stopPropagation();
      };
      s.addEventListener("mousedown", O);
      const q = () => {
        for (const L of [c, d, u])
          L && L.classList.add("flow-edge-hovered");
      }, D = () => {
        for (const L of [c, d, u])
          L && L.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", q), s.addEventListener("mouseleave", D), i(() => {
        const L = o(n);
        if (!L || !l) return;
        s.setAttribute("data-flow-edge-id", L.id);
        const $ = t.$data(e.closest("[x-data]"));
        if (!$?.nodes) return;
        const F = L.type ?? $._config?.defaultEdgeType ?? "bezier", K = $._config?.edgeLod;
        let ne = F;
        if (K) {
          const X = $._zoomLevel;
          (K.simplifyAt === "medium" && X === "medium" || X === "far") && (ne = "straight");
        }
        $._layoutAnimTick, $._edgeDirtyTicks?.get(L.id);
        const G = $.getNode(L.source), B = $.getNode(L.target);
        if (!G || !B) return;
        G.sourcePosition, B.targetPosition;
        const z = yt(G, $._nodeMap, $._config?.nodeOrigin), Y = yt(B, $._nodeMap, $._config?.nodeOrigin), W = e.closest("[x-data]");
        let j, H, te, Q;
        const U = $._schemaMetrics, J = $._config?.nodeOrigin, se = F !== "floating" && $._config?.schemaHandleGeometry !== "dom" && U && (!J || J[0] === 0 && J[1] === 0) ? np(
          G,
          B,
          z,
          Y,
          L.sourceHandle,
          L.targetHandle,
          $._nodeElements,
          U
        ) : null;
        if (F === "floating") {
          const X = xa(z, Y);
          j = X.sourcePos, H = X.targetPos, te = { x: X.sx, y: X.sy, handleWidth: 0, handleHeight: 0 }, Q = { x: X.tx, y: X.ty, handleWidth: 0, handleHeight: 0 }, x = { x: X.sx, y: X.sy }, b = { x: X.tx, y: X.ty };
        } else if (se)
          j = se.sourcePos, H = se.targetPos, te = se.srcMeasurement, Q = se.tgtMeasurement, x = { x: te.x, y: te.y }, b = { x: Q.x, y: Q.y };
        else {
          const X = $._nodeElements?.get(L.source) ?? W.querySelector(`[data-flow-node-id="${CSS.escape(L.source)}"]`), ae = $._nodeElements?.get(L.target) ?? W.querySelector(`[data-flow-node-id="${CSS.escape(L.target)}"]`), ue = X ? zs(X.getBoundingClientRect()) : void 0, ce = ae ? zs(ae.getBoundingClientRect()) : void 0;
          j = uo(W, L.source, L.sourceHandle, "source", G, ce, X), H = uo(W, L.target, L.targetHandle, "target", B, ue, ae);
          const le = t.raw($).viewport ?? { x: 0, y: 0, zoom: 1 }, de = le.zoom || 1, xe = G.rotation, Se = B.rotation;
          j = Os(j, xe), H = Os(H, Se), te = Ys(W, L.source, z, L.sourceHandle, "source", de, le, ce, X), Q = Ys(W, L.target, Y, L.targetHandle, "target", de, le, ue, ae);
          const Te = Ut(z, j, $._shapeRegistry, $._config?.nodeOrigin), Le = Ut(Y, H, $._shapeRegistry, $._config?.nodeOrigin);
          x = te ?? Te, b = Q ?? Le;
        }
        let oe = Ht(te ?? x, j, te, L.markerStart), Z = Ht(Q ?? b, H, Q, L.markerEnd);
        if (F === "orthogonal" || F === "avoidant") {
          const X = t.raw($._endpointSpreadGrouping);
          if (X) {
            const ae = io(G.endpointSpread ?? $._config?.avoidantEndpointSpread);
            if (ae !== null) {
              const ce = X.get(`${L.source}|${L.sourceHandle ?? ""}`), le = ce?.lanes.get(L.id);
              if (ce && le !== void 0 && ce.count > 1) {
                const de = $._schemaMetrics?.rowHeight ?? te?.handleHeight ?? 0;
                oe = bs(oe, j, _s(le, ce.count, de, ae));
              }
            }
            const ue = io(B.endpointSpread ?? $._config?.avoidantEndpointSpread);
            if (ue !== null) {
              const ce = X.get(`${L.target}|${L.targetHandle ?? ""}`), le = ce?.lanes.get(L.id);
              if (ce && le !== void 0 && ce.count > 1) {
                const de = $._schemaMetrics?.rowHeight ?? Q?.handleHeight ?? 0;
                Z = bs(Z, H, _s(le, ce.count, de, ue));
              }
            }
          }
        }
        C = oe, E = Z;
        let ee;
        if (F === "orthogonal" || F === "avoidant")
          if ($._config?.avoidantSimplifyOnDrag !== !1 && ($._draggingNodeIds?.has(L.source) || $._draggingNodeIds?.has(L.target)))
            ee = void 0;
          else {
            const ae = t.raw($._obstacleSnapshot);
            if (ae)
              ee = ae.filter((ue) => ue.id !== L.source && ue.id !== L.target);
            else {
              const ue = t.raw($.nodes), ce = new Map(ue.map((de) => [de.id, de])), le = $._config?.nodeOrigin;
              ee = ue.filter((de) => de.id !== L.source && de.id !== L.target).map((de) => {
                const xe = yt(de, ce, le);
                return {
                  x: xe.position.x,
                  y: xe.position.y,
                  width: xe.dimensions?.width ?? we,
                  height: xe.dimensions?.height ?? _e
                };
              });
            }
          }
        const ge = ne === F ? L : { ...L, type: ne }, { path: fe, labelPosition: ie } = lo(ge, z, Y, j, H, oe, Z, $._config?.edgeTypes, ee, $._shapeRegistry, $._config?.nodeOrigin, $._config?.defaultEdgeType);
        l.setAttribute("d", fe), a.setAttribute("d", fe), (F === "orthogonal" || F === "avoidant") && t.raw($._edgeCorridors)?.set(L.id, {
          minX: Math.min(oe.x, Z.x),
          minY: Math.min(oe.y, Z.y),
          maxX: Math.max(oe.x, Z.x),
          maxY: Math.max(oe.y, Z.y)
        });
        const pe = F === "editable", re = pe && (L.showControlPoints || L.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((X) => X.remove()), re) {
          const X = L.controlPoints ?? [], ae = $.viewport?.zoom ?? 1, ue = 6 / ae, ce = 5 / ae, le = x ?? { x: 0, y: 0 }, de = b ?? { x: 0, y: 0 }, xe = [le, ...X, de], Se = xe.length - 1, Te = l.getTotalLength?.() ?? 0;
          if (Te > 0) {
            const Le = [0], ze = 200;
            let Ie = 1;
            for (let qe = 1; qe <= ze && Ie < xe.length; qe++) {
              const Ln = qe / ze * Te, Kt = l.getPointAtLength(Ln), Ue = xe[Ie], Jt = Kt.x - Ue.x, Ii = Kt.y - Ue.y;
              Jt * Jt + Ii * Ii < 25 && (Le.push(Ln), Ie++);
            }
            for (; Le.length <= Se; )
              Le.push(Te);
            for (let qe = 0; qe < Se; qe++) {
              const Ln = (Le[qe] + Le[qe + 1]) / 2, Kt = l.getPointAtLength(Ln), Ue = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              Ue.classList.add("flow-edge-midpoint"), Ue.setAttribute("cx", String(Kt.x)), Ue.setAttribute("cy", String(Kt.y)), Ue.setAttribute("r", String(ce)), Ue.dataset.segmentIndex = String(qe);
              const Jt = document.createElementNS("http://www.w3.org/2000/svg", "title");
              Jt.textContent = "Double-click to add control point", Ue.appendChild(Jt), s.appendChild(Ue);
            }
          }
          for (let Le = 0; Le < X.length; Le++) {
            const ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ze.classList.add("flow-edge-control-point"), ze.setAttribute("cx", String(X[Le].x)), ze.setAttribute("cy", String(X[Le].y)), ze.setAttribute("r", String(ue)), ze.dataset.pointIndex = String(Le), s.appendChild(ze);
          }
        }
        if (a.style.cursor = pe ? "crosshair" : "pointer", a.style.strokeWidth = String(
          L.interactionWidth ?? $._config?.defaultInteractionWidth ?? 20
        ), L.markerStart != null) {
          const X = Ot(L.markerStart), ae = zt(X, $._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else if (L._renderDualMarker && L.markerEnd) {
          const X = Ot(L.markerEnd), ae = zt(X, $._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else
          l.removeAttribute("marker-start");
        if (L.markerEnd) {
          const X = Ot(L.markerEnd), ae = zt(X, $._id);
          l.setAttribute("marker-end", `url(#${ae})`);
        } else
          l.removeAttribute("marker-end");
        const me = L.strokeWidth ?? 1.5, ye = tp(L.animated);
        switch (ye !== g && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), g === "dot" && S(), g = ye), ye) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            _(s, fe, W, L, L.animationDuration);
            break;
        }
        if (L.animationDuration && ye !== "none" ? (ye === "dash" || ye === "pulse") && (l.style.animationDuration = L.animationDuration) : (ye === "dash" || ye === "pulse") && l.style.removeProperty("animation-duration"), y && y !== L.class && s.classList.remove(...y.split(" ").filter(Boolean)), L.class) {
          const X = ye === "dash" ? " flow-edge-animated" : ye === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", L.class + X), s.classList.add(...L.class.split(" ").filter(Boolean)), y = L.class;
        } else
          y && (s.classList.remove(...y.split(" ").filter(Boolean)), y = null);
        if (s.setAttribute("aria-selected", String(!!L.selected)), L.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(me + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + yn + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(me);
          const X = $._markerDefsEl?.querySelector("defs") ?? null;
          if (Ea(L.color)) {
            if (X) {
              const ae = Ca($._id, L.id), ue = L.gradientDirection === "target-source", ce = x.x, le = x.y, de = b.x, xe = b.y;
              Sa(
                X,
                ae,
                ue ? { from: L.color.to, to: L.color.from } : L.color,
                ce,
                le,
                de,
                xe
              ), l.style.stroke = `url(#${ae})`, m = ae;
            }
          } else if (L.color) {
            if (m) {
              const ae = X;
              ae && Io(ae, m), m = null;
            }
            l.style.stroke = L.color;
          } else {
            if (m) {
              const ae = X;
              ae && Io(ae, m), m = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (!L.selected && ((L.sourceHandle ? $.selectedRows?.has(L.sourceHandle.replace(/-[lr]$/, "")) : !1) || (L.targetHandle ? $.selectedRows?.has(L.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), L.selected || (l.style.strokeWidth = String(Math.max(me + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), L.focusable ?? $._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", L.ariaRole ?? "group"), s.setAttribute("aria-label", L.ariaLabel ?? (L.label ? `Edge: ${L.label}` : `Edge from ${L.source} to ${L.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), L.domAttributes)
          for (const [X, ae] of Object.entries(L.domAttributes))
            X.startsWith("on") || Qg.has(X.toLowerCase()) || s.setAttribute(X, ae);
        const Ee = (X, ae, ue, ce, le) => {
          if (ae) {
            if (!X && ce) {
              const de = ue.includes("flow-edge-label-start"), xe = ue.includes("flow-edge-label-end");
              let Se = `[data-flow-edge-id="${le}"].flow-edge-label`;
              de ? Se += ".flow-edge-label-start" : xe ? Se += ".flow-edge-label-end" : Se += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", X = ce.querySelector(Se);
            }
            return X || (X = document.createElement("div"), X.className = ue, X.dataset.flowEdgeId = le, ce && ce.appendChild(X)), X.textContent = ae, X;
          }
          return X && X.remove(), null;
        }, he = e.closest(".flow-viewport"), be = L.labelVisibility ?? "always", Me = () => {
          const X = l.getAttribute("d") ?? "";
          return X !== f && (f = X, h = typeof l.getTotalLength == "function" && l.getTotalLength() || 0), h;
        };
        if (c = Ee(c, L.label, "flow-edge-label", he, L.id), c) {
          const X = Me();
          if (X > 0) {
            const ae = L.labelPosition ?? 0.5, ue = op(l, ae, X);
            c.style.left = `${ue.x}px`, c.style.top = `${ue.y}px`;
          } else
            c.style.left = `${ie.x}px`, c.style.top = `${ie.y}px`;
        }
        if (d = Ee(d, L.labelStart, "flow-edge-label flow-edge-label-start", he, L.id), d) {
          const X = Me();
          if (X > 0) {
            const ae = L.labelStartOffset ?? 30, ue = l.getPointAtLength(Math.min(ae, X / 2));
            d.style.left = `${ue.x}px`, d.style.top = `${ue.y}px`;
          }
        }
        if (u = Ee(u, L.labelEnd, "flow-edge-label flow-edge-label-end", he, L.id), u) {
          const X = Me();
          if (X > 0) {
            const ae = L.labelEndOffset ?? 30, ue = l.getPointAtLength(Math.max(X - ae, X / 2));
            u.style.left = `${ue.x}px`, u.style.top = `${ue.y}px`;
          }
        }
        for (const X of [c, d, u])
          X && (X.classList.toggle("flow-edge-label-hover", be === "hover"), X.classList.toggle("flow-edge-label-on-select", be === "selected"), X.classList.toggle("flow-edge-label-selected", !!L.selected), L.class ? X.classList.add(...L.class.split(" ").filter(Boolean)) : y && X.classList.remove(...y.split(" ").filter(Boolean)));
      }), r(() => {
        if (m) {
          const $ = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          $ && Io($, m);
        }
        P?.(), S(), s.removeEventListener("contextmenu", I), s.removeEventListener("dblclick", M), s.removeEventListener("pointerdown", A, !0), s.removeEventListener("pointerdown", v), s.removeEventListener("pointermove", w), s.removeEventListener("keydown", N), s.removeEventListener("focus", k), s.removeEventListener("blur", R), s.removeEventListener("mousedown", O), s.removeEventListener("mouseenter", q), s.removeEventListener("mouseleave", D), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function rp(t, e) {
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
        const l = typeof a == "string" ? wn(a) : a;
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
          const h = xa(s, a);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const p = Ht(d, h.sourcePos, null, o.markerStart), g = Ht(u, h.targetPos, null, o.markerEnd), m = lo(o, s, a, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = m.path, c = m.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const b = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), C = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (b) {
              const E = b.getBoundingClientRect();
              p = { x: (E.left + E.right) / 2, y: (E.top + E.bottom) / 2 };
            }
            if (C) {
              const E = C.getBoundingClientRect();
              g = { x: (E.left + E.right) / 2, y: (E.top + E.bottom) / 2 };
            }
          }
          const m = h ? uo(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", y = h ? uo(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = Ut(s, m, t._shapeRegistry, t._config.nodeOrigin), u = Ut(a, y, t._shapeRegistry, t._config.nodeOrigin);
          const _ = Ht(d, m, null, o.markerStart), S = Ht(u, y, null, o.markerEnd), x = lo(o, s, a, m, y, _, S, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = x.path, c = x.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", l);
          const p = f.parentElement?.querySelector("path:first-child");
          p && p !== f && p.setAttribute("d", l);
        }
        if (Ea(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = Ca(t._id, o.id), g = o.gradientDirection === "target-source";
            Sa(
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
function ap(t) {
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
              Fr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = fa(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let lp = 0;
function cp(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function dp(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
function up(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++lp}`,
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
      _shapeRegistry: { ...ua, ...e.shapeTypes },
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
          d.push(cp(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${g}px ${g}px, ${g}px ${g}px`), f.push(`${l}px ${c}px, ${l}px ${c}px`)) : (u.push(`${p}px ${p}px`), f.push(`${l}px ${c}px`));
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
      _shortcuts: Wf(e.keyboardShortcuts),
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
      _computeEngine: new Eh(),
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
      _spatialGrid: new Qu(),
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
        s !== "viewport-change" && s !== "viewport-move" && V("event", s, a);
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
        this._nodeMap = la(this.nodes), dh(this._childrenIds, this.nodes);
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
            width: m.dimensions?.width ?? we,
            height: m.dimensions?.height ?? _e
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
        const s = /* @__PURE__ */ new Set(), a = io(this._config?.avoidantEndpointSpread), l = t.raw(this.nodes), c = new Map(l.map((_) => [_.id, _])), d = this._config?.nodeOrigin, u = (_) => {
          const S = c.get(_);
          if (!S) return 0;
          const x = yt(S, c, d);
          return x.position.y + (x.dimensions?.height ?? 0) / 2;
        }, f = (_) => {
          const S = c.get(_)?.endpointSpread;
          return S !== void 0 ? io(S) !== null : a !== null;
        }, h = /* @__PURE__ */ new Map(), p = (_, S, x, b) => {
          if (!f(_)) return;
          const C = `${_}|${S ?? ""}`;
          let E = h.get(C);
          E || (E = [], h.set(C, E)), E.push({ edgeId: x, sortKey: u(b) });
        }, g = t.raw(this.edges);
        for (const _ of g) {
          const S = _.type ?? this._config?.defaultEdgeType;
          S !== "avoidant" && S !== "orthogonal" || (p(_.source, _.sourceHandle, _.id, _.target), p(_.target, _.targetHandle, _.id, _.source));
        }
        const m = t.raw(this._endpointSpreadGrouping), y = /* @__PURE__ */ new Map();
        for (const [_, S] of h) {
          S.sort((C, E) => C.sortKey - E.sortKey || (C.edgeId < E.edgeId ? -1 : 1));
          const x = /* @__PURE__ */ new Map();
          S.forEach((C, E) => x.set(C.edgeId, E)), y.set(_, { count: S.length, lanes: x });
          const b = m?.get(_);
          for (const [C, E] of x)
            (!b || b.count !== S.length || b.lanes.get(C) !== E) && s.add(C);
        }
        if (m) {
          for (const [_, S] of m)
            if (!y.has(_))
              for (const x of S.lanes.keys()) s.add(x);
        }
        if (m) {
          m.clear();
          for (const [_, S] of y) m.set(_, S);
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
          const y = f?.find((S) => S.id === m);
          y && g.push(y);
          const _ = a?.find((S) => S.id === m);
          _ && g.push(_);
        }
        for (const m of d) {
          let y = p.has(m.source) || p.has(m.target);
          if (!y) {
            const _ = u.get(m.id);
            if (_) {
              for (const S of g)
                if (S.x < _.maxX + ht && S.x + S.width > _.minX - ht && S.y < _.maxY + ht && S.y + S.height > _.minY - ht) {
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
        const d = e.cullingBuffer ?? 100, u = Ju(this.viewport, l, c, d), h = t.raw(this._spatialGrid).query(u), p = this._draggingNodeIds, g = /* @__PURE__ */ new Set(), m = (S) => {
          const x = this._nodeMap.get(S);
          if (!x || x.hidden) return;
          const b = x.dimensions?.width ?? 150, C = x.dimensions?.height ?? 50, E = x.parentId ? ni(x, this._nodeMap, this._config.nodeOrigin) : x.position;
          !(E.x + b < u.minX || E.x > u.maxX || E.y + C < u.minY || E.y > u.maxY) && g.add(S);
        };
        for (const S of h) m(S);
        if (p)
          for (const S of p)
            h.has(S) || m(S);
        for (const [S, x] of this._nodeElements) {
          const b = g.has(S) ? "" : "none";
          x.style.display !== b && (x.style.display = b);
        }
        const y = this._culledEdgeIds, _ = /* @__PURE__ */ new Set();
        for (const [S, x] of this._edgeSvgElements) {
          const b = this._edgeMap.get(S);
          if (!b) continue;
          const C = this._nodeMap.get(b.source)?.hidden, E = this._nodeMap.get(b.target)?.hidden;
          if (b.hidden || b._hiddenByCollapse || C || E)
            continue;
          const T = g.has(b.source) || g.has(b.target) || dp(this._edgeCorridors.get(S), u), I = !y.has(S);
          T !== I && (x.style.display = T ? "" : "none"), T || _.add(S);
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
        return a ? ni(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && Fr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new ff(eo), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let a = null;
          s === "fill" ? a = "100%" : typeof s == "number" && Number.isFinite(s) ? a = `${s}px` : typeof s == "string" && s.trim() && (a = s.trim()), a !== null && this._container.style.setProperty("--flow-container-height", a);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = fa(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Mt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new of(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new xh(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Dt("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new l(), p = new c(h), g = new d(h, this, f.provider), m = new u(p, f.user);
          if (He.set(a, { bridge: g, awareness: m, doc: h }), f.provider.connect(h, p), f.cursors !== !1) {
            let y = !1;
            const _ = f.throttle ?? 20, S = (C) => {
              if (y) return;
              y = !0;
              const E = a.getBoundingClientRect(), T = this._viewportLive ?? this.viewport, I = (C.clientX - E.left - T.x) / T.zoom, M = (C.clientY - E.top - T.y) / T.zoom;
              m.updateCursor({ x: I, y: M }), setTimeout(() => {
                y = !1;
              }, _);
            }, x = () => {
              m.updateCursor(null);
            };
            a.addEventListener("mousemove", S), a.addEventListener("mouseleave", x);
            const b = He.get(a);
            b.cursorCleanup = () => {
              a.removeEventListener("mousemove", S), a.removeEventListener("mouseleave", x);
            };
          }
        }
      },
      /** Create panZoom instance, viewport element fallback, apply background, register with store, setup marker defs. */
      _initPanZoom() {
        if (V("init", `flowCanvas "${this._id}" initializing`, {
          nodes: this.nodes.map((s) => ({ id: s.id, type: s.type ?? "default", position: s.position, parentId: s.parentId })),
          edges: this.edges.map((s) => ({ id: s.id, source: s.source, target: s.target, type: s.type ?? "default" })),
          config: { minZoom: e.minZoom, maxZoom: e.maxZoom, pannable: e.pannable, zoomable: e.zoomable, debug: e.debug }
        }), this._panZoom = Uu(this._container, {
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
          !s && this._container && V("init", `flowCanvas "${this._id}" has no .flow-viewport — delegating handle pointerdown on the container instead; an active whiteboard tool may not suppress handle presses`);
          const a = s ?? this._container;
          a && (this._handleDelegationCleanup = ps(a, this), this._handleDelegationEl = a);
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
        !a || a === s || (this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, !this._handleDelegationTornDown && (this._handleDelegationCleanup = ps(s, this), this._handleDelegationEl = s, V("init", `flowCanvas "${this._id}" re-bound its delegated handle pointerdown listener to a replaced .flow-viewport`)));
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
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && ke(this._container));
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
        if (s && (this._longPressCleanup = Uf(
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
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && ke(this._container);
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
            jf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && Gr(h)) {
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
        e.minimap && (this._minimap = pf(this._container, {
          getState: () => ({
            nodes: so(this.nodes, this._nodeMap, this._config.nodeOrigin),
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
          this._controls = xf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Ko }),
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
        this._selectionBox = Ef(this._container), this._lasso = Cf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
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
          const l = so(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Pf(l, u) : Lf(l, u), h = new Set(f.map((p) => p.id));
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
                  const b = g.getPointAtLength(x / y * m);
                  Ei(b.x, b.y, u) && _++;
                }
                (this._selectionEffectiveMode === "full" ? _ === y + 1 : _ > 0) && d.push(p.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Ku(l, u, this._config.nodeOrigin) : Zu(l, u, this._config.nodeOrigin), h = new Set(f.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!ei(u) || u.hidden) continue;
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
            const f = Hr(
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
            const _ = Rh(
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
        if (this._layoutDedup = Dh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && Nh(e, s, e.wireEvents);
          const a = $h(this, s), l = Lh(this, s);
          this._wireCleanup = () => {
            a(), l();
          }, V("init", `wire bridge activated for "${this._id}"`);
        }
        V("init", `flowCanvas "${this._id}" ready`), this._emit("init"), this._recomputeChildValidation();
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
        for (const [, s] of ha().entries())
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
          c && Dt(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${l[s]})`);
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
            const f = Ot(u), h = zt(f, this._id);
            a.has(h) || a.set(h, no(f, h));
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
        if (V("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
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
        return this._layoutDedup ? Hh(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? He.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => Fm));
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
      Vh(i),
      Bh(i),
      qh(i),
      jh(i),
      Gh(i),
      Cg(i),
      Lg(i),
      Pg(i),
      Mg(i),
      Fg(i),
      Og(i),
      zg(i),
      rp(i, t),
      ap(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      hf(s, a);
    }, n;
  });
}
function Xs(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function fp(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(_) {
    const S = s();
    return {
      x: (_.x - S.x) / S.zoom,
      y: (_.y - S.y) / S.zoom
    };
  }
  const m = Ye(t), y = Lc().subject(() => {
    const _ = s(), S = a();
    return {
      x: S.x * _.zoom + _.x,
      y: S.y * _.zoom + _.y
    };
  }).on("start", (_) => {
    p = g(_), o?.({ nodeId: e, position: p, sourceEvent: _.sourceEvent });
  }).on("drag", (_) => {
    let S = g(_);
    l && (S = Xs(S, l));
    const x = {
      x: S.x - p.x,
      y: S.y - p.y
    };
    i?.({ nodeId: e, position: S, delta: x, sourceEvent: _.sourceEvent });
  }).on("end", (_) => {
    let S = g(_);
    l && (S = Xs(S, l)), r?.({ nodeId: e, position: S, sourceEvent: _.sourceEvent });
  });
  return d && y.container(() => d), h > 0 && y.clickDistance(h), y.filter((_) => {
    if (u?.() || f && _.target?.closest?.("." + f)) return !1;
    if (c) {
      const S = t.querySelector(c);
      return S ? S.contains(_.target) : !0;
    }
    return !0;
  }), m.call(y), {
    destroy() {
      m.on(".drag", null);
    }
  };
}
function hp(t, e) {
  const n = Gt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function gp(t, e, n) {
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
    for (const [x, b] of _) {
      const C = b - x;
      Math.abs(C) <= n && (i.add(b), Math.abs(C) < Math.abs(a) && (a = C, r = C));
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
    for (const [x, b] of S) {
      const C = b - x;
      Math.abs(C) <= n && (o.add(b), Math.abs(C) < Math.abs(l) && (l = C, s = C));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function pp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function mp(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = pp(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const yp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let wp = 0;
function Ws(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Do(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function vp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function _p(t, e, n) {
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
function bp(t, e, n) {
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
function xp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = null, c = !1, d = null, u = null, f = null, h = null, p = null, g = null, m = !1, y = -1, _ = null, S = !1, x = [], b = "", C = [], E = null;
      i(() => {
        if (!e.isConnected) return;
        const P = o(n);
        if (!P || P.hidden) return;
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        const w = P.parentId ? v.getAbsolutePosition(P.id) : P.position ?? { x: 0, y: 0 }, N = P.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], k = P.dimensions?.width ?? 150, R = P.dimensions?.height ?? 40;
        e.style.left = w.x - k * N[0] + "px", e.style.top = w.y - R * N[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const P = o(n);
        if (!P) return;
        if (e.dataset.flowNodeId = P.id, P.type && (e.dataset.flowNodeType = P.type), !S) {
          const z = e.closest("[x-data]"), Y = z ? t.$data(z) : null;
          let W = !1;
          if (Y?._config?.nodeTypes) {
            const j = P.type ?? "default", H = Y._config.nodeTypes[j] ?? Y._config.nodeTypes.default;
            if (typeof H == "string") {
              const te = document.querySelector(H);
              te?.content && (e.appendChild(te.content.cloneNode(!0)), W = !0);
            } else typeof H == "function" && (H(P, e), W = !0);
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
              t.addScopeToNode(j, { node: P }), t.initTree(j);
          S = !0;
        }
        if (P.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), E !== P.id && (s?.destroy(), s = null, E = P.id);
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), P.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), P.dimensions) {
          const z = P.childLayout, Y = P.fixedDimensions, W = (v._childrenIds?.get(P.id)?.length ?? 0) > 0;
          e.style.width = P.dimensions.width + "px", z || Y || W ? e.style.height = P.dimensions.height + "px" : e.style.height = "";
        }
        v.selectedNodes.has(P.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!P.selected)), P._validationErrors && P._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const w = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], N = P.runState;
        for (const z of w)
          e.classList.remove(z);
        N && N !== "pending" && e.classList.add(`flow-node-${N}`);
        for (const z of x)
          e.classList.remove(z);
        const k = P.class ? P.class.split(/\s+/).filter(Boolean) : [];
        for (const z of k)
          e.classList.add(z);
        x = k;
        const R = P.shape ? `flow-node-${P.shape}` : "";
        b !== R && (b && e.classList.remove(b), R && e.classList.add(R), b = R);
        const O = t.$data(e.closest("[data-flow-canvas]")), q = P.shape && O?._shapeRegistry?.[P.shape];
        if (q?.clipPath ? e.style.clipPath = q.clipPath : e.style.clipPath = "", P.style) {
          const z = typeof P.style == "string" ? Object.fromEntries(P.style.split(";").filter(Boolean).map((W) => W.split(":").map((j) => j.trim()))) : P.style, Y = [];
          for (const [W, j] of Object.entries(z))
            W && j && (e.style.setProperty(W, j), Y.push(W));
          for (const W of C)
            Y.includes(W) || e.style.removeProperty(W);
          C = Y;
        } else if (C.length > 0) {
          for (const z of C)
            e.style.removeProperty(z);
          C = [];
        }
        if (P.rotation ? (e.style.transform = `rotate(${P.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", P.focusable ?? v._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", P.ariaRole ?? "group"), e.setAttribute("aria-label", P.ariaLabel ?? (P.data?.label ? `Node: ${P.data.label}` : `Node ${P.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), P.domAttributes)
          for (const [z, Y] of Object.entries(P.domAttributes))
            z.startsWith("on") || yp.has(z.toLowerCase()) || e.setAttribute(z, Y);
        Be(P) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), P.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const L = e.classList.contains("flow-node-condensed");
        P.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!P.condensed !== L && requestAnimationFrame(() => {
          P.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, V("condense", `Node "${P.id}" re-measured after condense toggle`, P.dimensions);
        }), P.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const $ = P.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), $ !== "visible" && e.classList.add(`flow-handles-${$}`);
        let F = ca(P, v._nodeMap);
        v._config?.elevateNodesOnSelect !== !1 && v.selectedNodes.has(P.id) && (F += P.type === "group" ? Math.max(1 - F, 0) : 1e3), m && (F += 1e3);
        const ne = P.type === "group" ? 0 : 2;
        if (F !== ne ? e.style.zIndex = String(F) : e.style.removeProperty("z-index"), !Gr(P)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const B = e.closest(".flow-container");
        s || (s = fp(e, P.id, {
          container: B ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => v._animationLocked,
          noDragClassName: v._config?.noDragClassName ?? "nodrag",
          dragThreshold: v._config?.nodeDragThreshold ?? 0,
          getViewport: () => v.viewport,
          getNodePosition: () => {
            const z = v.getNode(P.id);
            return z ? z.parentId ? v.getAbsolutePosition(z.id) : { x: z.position.x, y: z.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: v._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: z, position: Y, sourceEvent: W }) {
            e.classList.add("flow-node-dragging"), a = !1, c = !1, d = null;
            const j = v._container ? He.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !0), h?.destroy(), h = null, p = null, g && B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, l = v._snapshotHistory?.() ?? null, V("drag", `Node "${z}" drag start`, Y);
            const H = v.getNode(z);
            if (H) {
              if (v._config?.selectNodesOnDrag !== !1 && H.selectable !== !1 && !v.selectedNodes.has(z) && (mt(W, v._shortcuts?.multiSelect) || v.deselectAll(), v.selectedNodes.add(z), H.selected = !0, v._emitSelectionChange(), c = !0), v._emit("node-drag-start", { node: H }), v.selectedNodes.has(z) && v.selectedNodes.size > 1) {
                const te = wt(z, v.nodes);
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
            v._config?.autoPanOnNodeDrag !== !1 && B && (u = Kr({
              container: B,
              speed: v._config?.autoPanSpeed ?? 15,
              onPan(te, Q) {
                const U = () => v._viewportLive ?? v.viewport, J = U().zoom || 1, se = { x: U().x, y: U().y };
                v._panZoom?.setViewport({
                  x: U().x - te,
                  y: U().y - Q,
                  zoom: J
                });
                const oe = se.x - U().x, Z = se.y - U().y, ee = oe === 0 && Z === 0, ge = v.getNode(z);
                let fe = !1;
                if (ge) {
                  const ie = ge.position.x, pe = ge.position.y;
                  ge.position.x += oe / J, ge.position.y += Z / J;
                  const re = Rn(ge.position, ge, v._config?.nodeExtent);
                  ge.position.x = re.x, ge.position.y = re.y, fe = ge.position.x === ie && ge.position.y === pe;
                }
                if (d)
                  for (const [ie] of d) {
                    const pe = v.getNode(ie);
                    if (pe) {
                      pe.position.x += oe / J, pe.position.y += Z / J;
                      const re = Rn(pe.position, pe, v._config?.nodeExtent);
                      pe.position.x = re.x, pe.position.y = re.y;
                    }
                  }
                return ee && fe;
              }
            }), W instanceof MouseEvent && u.updatePointer(W.clientX, W.clientY), u.start());
          },
          onDrag({ nodeId: z, position: Y, delta: W, sourceEvent: j }) {
            a = !0;
            const H = v.getNode(z);
            if (H) {
              if (H.parentId) {
                const U = v.getAbsolutePosition(H.parentId);
                let J = Y.x - U.x, se = Y.y - U.y;
                const oe = H.dimensions ?? { width: 150, height: 50 }, Z = v.getNode(H.parentId);
                if (Z?.childLayout) {
                  m || (e.classList.add("flow-reorder-dragging"), _ = H.parentId), m = !0;
                  const ee = H.extent !== "parent";
                  if (H.position.x = Y.x - U.x, H.position.y = Y.y - U.y, !ee && Z.dimensions) {
                    const ie = Po({ x: H.position.x, y: H.position.y }, oe, Z.dimensions);
                    H.position.x = ie.x, H.position.y = ie.y;
                  }
                  const ge = H.dimensions?.width ?? 150, fe = H.dimensions?.height ?? 50;
                  if (ee) {
                    const ie = Z.dimensions?.width ?? 150, pe = Z.dimensions?.height ?? 50, re = H.position.x + ge / 2, me = H.position.y + fe / 2, ye = 12, Oe = _ === H.parentId ? 0 : ye, Pe = re >= Oe && re <= ie - Oe && me >= Oe && me <= pe - Oe, Ee = /* @__PURE__ */ new Set();
                    let he = H.parentId;
                    for (; he; )
                      Ee.add(he), he = v.getNode(he)?.parentId;
                    const be = Y.x + ge / 2, Me = Y.y + fe / 2, X = wt(H.id, v.nodes);
                    let ae = null;
                    const ue = v.nodes.filter(
                      (le) => le.id !== H.id && (le.droppable || le.childLayout) && !le.hidden && !X.has(le.id) && (Pe ? !Ee.has(le.id) : le.id !== H.parentId) && (!le.acceptsDrop || le.acceptsDrop(H))
                    );
                    for (const le of ue) {
                      const de = le.parentId ? v.getAbsolutePosition(le.id) : le.position, xe = le.dimensions?.width ?? 150, Se = le.dimensions?.height ?? 50, Te = le.id === g ? 0 : ye;
                      be >= de.x + Te && be <= de.x + xe - Te && Me >= de.y + Te && Me <= de.y + Se - Te && (ae = le);
                    }
                    const ce = ae?.id ?? null;
                    if (ce !== g) {
                      g && B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), ce && B && B.querySelector(`[data-flow-node-id="${CSS.escape(ce)}"]`)?.classList.add("flow-node-drop-target"), g = ce;
                      const le = ce ? v.getNode(ce) : null, de = _;
                      if (le?.childLayout && ce !== _) {
                        de && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), _ = ce;
                        const xe = v.nodes.filter((Ie) => Ie.parentId === ce && Ie.id !== z).sort((Ie, qe) => (Ie.order ?? 1 / 0) - (qe.order ?? 1 / 0)), Se = xe.length, Te = [...xe];
                        Te.splice(Se, 0, H);
                        for (let Ie = 0; Ie < Te.length; Ie++)
                          Te[Ie].order = Ie;
                        y = Se;
                        const Le = v._initialDimensions?.get(z), ze = { ...H, dimensions: Le ? { ...Le } : void 0 };
                        v.layoutChildren(ce, { excludeId: z, includeNode: ze, shallow: !0 }), v.propagateLayoutUp(ce, { includeNode: ze });
                      } else Pe && _ !== H.parentId ? (de && de !== H.parentId && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), _ = H.parentId, y = -1) : !ce && !Pe && (de && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), _ = null, y = -1);
                    }
                  }
                  if (_) {
                    const ie = v.getNode(_), pe = ie?.childLayout ?? Z.childLayout, re = v.nodes.filter((he) => he.parentId === _ && he.id !== z).sort((he, be) => (he.order ?? 1 / 0) - (be.order ?? 1 / 0));
                    let me, ye;
                    if (_ !== H.parentId) {
                      const he = ie?.parentId ? v.getAbsolutePosition(_) : ie?.position ?? { x: 0, y: 0 };
                      me = Y.x - he.x, ye = Y.y - he.y;
                    } else
                      me = H.position.x, ye = H.position.y;
                    const Oe = pe.swapThreshold ?? 0.5;
                    if (y === -1)
                      if (_ === H.parentId) {
                        const he = H.order ?? 0;
                        y = re.filter((be) => (be.order ?? 0) < he).length;
                      } else
                        y = re.length;
                    const Pe = y;
                    let Ee = re.length;
                    for (let he = 0; he < re.length; he++) {
                      const be = re[he], Me = be.dimensions?.width ?? 150, X = be.dimensions?.height ?? 50, ae = he < Pe ? 1 - Oe : Oe, ue = be.position.y + X * ae, ce = be.position.x + Me * ae;
                      if (pe.direction === "grid") {
                        const le = {
                          x: me + ge / 2,
                          y: ye + fe / 2
                        }, de = be.position.y + X / 2;
                        if (le.y < be.position.y) {
                          Ee = he;
                          break;
                        }
                        if (Math.abs(le.y - de) < X / 2 && le.x < ce) {
                          Ee = he;
                          break;
                        }
                      } else if (pe.direction === "vertical") {
                        if ((he < Pe ? ye : ye + fe) < ue) {
                          Ee = he;
                          break;
                        }
                      } else if ((he < Pe ? me : me + ge) < ce) {
                        Ee = he;
                        break;
                      }
                    }
                    if (Ee !== y) {
                      y = Ee;
                      const he = [...re];
                      he.splice(Ee, 0, H);
                      for (let ue = 0; ue < he.length; ue++)
                        he[ue].order = ue;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), v._layoutAnimFrame && cancelAnimationFrame(v._layoutAnimFrame);
                      const Me = H.id, X = _, ae = X !== H.parentId;
                      v._layoutAnimFrame = requestAnimationFrame(() => {
                        if (ae && X) {
                          const de = v.getNode(Me);
                          let xe;
                          if (de) {
                            const Se = v._initialDimensions?.get(Me);
                            xe = { ...de, dimensions: Se ? { ...Se } : void 0 };
                          }
                          v.layoutChildren(X, {
                            excludeId: Me,
                            includeNode: xe,
                            shallow: !0
                          }), v.propagateLayoutUp(X, {
                            includeNode: xe
                          });
                        } else
                          v.layoutChildren(X, Me, !0);
                        const ue = performance.now(), ce = 300, le = () => {
                          v._layoutAnimTick++, performance.now() - ue < ce ? v._layoutAnimFrame = requestAnimationFrame(le) : v._layoutAnimFrame = 0;
                        };
                        v._layoutAnimFrame = requestAnimationFrame(le);
                      });
                    }
                  }
                  u && j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY);
                  return;
                }
                if (H.extent === "parent" && Z?.dimensions) {
                  const ee = Po(
                    { x: J, y: se },
                    oe,
                    Z.dimensions
                  );
                  J = ee.x, se = ee.y;
                } else if (Array.isArray(H.extent)) {
                  const ee = da({ x: J, y: se }, H.extent, oe);
                  J = ee.x, se = ee.y;
                }
                if ((!H.extent || H.extent !== "parent") && (un(
                  Z,
                  v._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!Z?.childLayout) && Z?.dimensions) {
                  const fe = Po(
                    { x: J, y: se },
                    oe,
                    Z.dimensions
                  );
                  J = fe.x, se = fe.y;
                }
                if (H.expandParent && Z?.dimensions) {
                  const ee = uh(
                    { x: J, y: se },
                    oe,
                    Z.dimensions
                  );
                  ee && (Z.dimensions.width = ee.width, Z.dimensions.height = ee.height);
                }
                H.position.x = J, H.position.y = se;
              } else {
                const U = Rn(Y, H, v._config?.nodeExtent);
                H.position.x = U.x, H.position.y = U.y;
              }
              if (v._config?.snapToGrid) {
                const U = H.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], J = H.dimensions?.width ?? 150, se = H.dimensions?.height ?? 40, oe = H.parentId ? v.getAbsolutePosition(H.id) : H.position;
                e.style.left = oe.x - J * U[0] + "px", e.style.top = oe.y - se * U[1] + "px", v._layoutAnimTick++;
              }
              if (v._emit("node-drag", { node: H, position: Y }), d)
                for (const [U, J] of d) {
                  const se = v.getNode(U);
                  if (se) {
                    let oe = J.x + W.x, Z = J.y + W.y;
                    const ee = Rn({ x: oe, y: Z }, se, v._config?.nodeExtent);
                    se.position.x = ee.x, se.position.y = ee.y;
                  }
                }
              const Q = v._config?.helperLines;
              if (Q) {
                const U = typeof Q == "object" ? Q.snap ?? !0 : !0, J = typeof Q == "object" ? Q.threshold ?? 5 : 5, se = (ie) => {
                  const pe = ie.parentId ? v.getAbsolutePosition(ie.id) : ie.position;
                  return hp({ ...ie, position: pe }, v._config?.nodeOrigin);
                }, Z = (v.selectedNodes.size > 1 && v.selectedNodes.has(z) ? v.nodes.filter((ie) => v.selectedNodes.has(ie.id)) : [H]).map(se), ee = {
                  x: Math.min(...Z.map((ie) => ie.x)),
                  y: Math.min(...Z.map((ie) => ie.y)),
                  width: Math.max(...Z.map((ie) => ie.x + ie.width)) - Math.min(...Z.map((ie) => ie.x)),
                  height: Math.max(...Z.map((ie) => ie.y + ie.height)) - Math.min(...Z.map((ie) => ie.y))
                }, ge = v.nodes.filter(
                  (ie) => !v.selectedNodes.has(ie.id) && ie.id !== z && ie.hidden !== !0 && ie.filtered !== !0
                ).map(se), fe = gp(ee, ge, J);
                if (U && (fe.snapOffset.x !== 0 || fe.snapOffset.y !== 0) && (H.position.x += fe.snapOffset.x, H.position.y += fe.snapOffset.y, d))
                  for (const [ie] of d) {
                    const pe = v.getNode(ie);
                    pe && (pe.position.x += fe.snapOffset.x, pe.position.y += fe.snapOffset.y);
                  }
                if (f?.remove(), fe.horizontal.length > 0 || fe.vertical.length > 0) {
                  const ie = B?.querySelector(".flow-viewport");
                  if (ie) {
                    const pe = v.nodes.map(se);
                    f = bp(fe.horizontal, fe.vertical, pe), ie.appendChild(f);
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
              const Q = typeof v._config.preventOverlap == "number" ? v._config.preventOverlap : 5, U = H.dimensions?.width ?? we, J = H.dimensions?.height ?? _e, se = v.selectedNodes, oe = v.nodes.filter((ee) => ee.id !== H.id && !ee.hidden && !se.has(ee.id)).map((ee) => jt(ee, v._config?.nodeOrigin)), Z = zh(H.position, U, J, oe, Q);
              H.position.x = Z.x, H.position.y = Z.y;
            }
            if (!H.parentId) {
              const Q = wt(H.id, v.nodes), U = v.nodes.filter(
                (ee) => ee.id !== H.id && ee.droppable && !ee.hidden && !Q.has(ee.id) && (!ee.acceptsDrop || ee.acceptsDrop(H))
              ), J = jt(H, v._config?.nodeOrigin);
              let se = null;
              const oe = 12;
              for (const ee of U) {
                const ge = ee.parentId ? v.getAbsolutePosition(ee.id) : ee.position, fe = ee.dimensions?.width ?? we, ie = ee.dimensions?.height ?? _e, pe = J.x + J.width / 2, re = J.y + J.height / 2, me = ee.id === g ? 0 : oe;
                pe >= ge.x + me && pe <= ge.x + fe - me && re >= ge.y + me && re <= ge.y + ie - me && (se = ee);
              }
              const Z = se?.id ?? null;
              Z !== g && (g && B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Z && B && B.querySelector(`[data-flow-node-id="${CSS.escape(Z)}"]`)?.classList.add("flow-node-drop-target"), g = Z);
            }
            if (v._config?.proximityConnect) {
              const Q = v._config.proximityConnectDistance ?? 150, U = H.dimensions ?? { width: 150, height: 50 }, J = {
                x: H.position.x + U.width / 2,
                y: H.position.y + U.height / 2
              }, se = v.nodes.filter((Z) => Z.id !== H.id && !Z.hidden).map((Z) => ({
                id: Z.id,
                center: {
                  x: Z.position.x + (Z.dimensions?.width ?? 150) / 2,
                  y: Z.position.y + (Z.dimensions?.height ?? 50) / 2
                }
              })), oe = mp(H.id, J, se, Q);
              if (oe)
                if (v.edges.some(
                  (ee) => ee.source === oe.source && ee.target === oe.target || ee.source === oe.target && ee.target === oe.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = oe, !h) {
                    h = Wt({
                      connectionLineType: v._config?.connectionLineType,
                      connectionLineStyle: v._config?.connectionLineStyle,
                      connectionLine: v._config?.connectionLine
                    });
                    const ee = B?.querySelector(".flow-viewport");
                    ee && ee.appendChild(h.svg);
                  }
                  h.update({
                    fromX: J.x,
                    fromY: J.y,
                    toX: oe.targetCenter.x,
                    toY: oe.targetCenter.y,
                    source: oe.source
                  });
                }
              else
                h?.destroy(), h = null, p = null;
            }
            const te = v._container ? He.get(v._container) : void 0;
            if (te?.bridge) {
              if (te.bridge.pushLocalNodeUpdate(z, { position: H.position }), d)
                for (const [Q] of d) {
                  const U = v.getNode(Q);
                  U && te.bridge.pushLocalNodeUpdate(Q, { position: U.position });
                }
              if (te.awareness && j instanceof MouseEvent && v._container) {
                const Q = v._container.getBoundingClientRect(), U = v._viewportLive ?? v.viewport, J = (j.clientX - Q.left - U.x) / U.zoom, se = (j.clientY - Q.top - U.y) / U.zoom;
                te.awareness.updateCursor({ x: J, y: se });
              }
            }
            u && j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY);
          },
          onDragEnd({ nodeId: z, position: Y }) {
            const W = d ? [z, ...d.keys()] : [z];
            v._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), V("drag", `Node "${z}" drag end`, Y);
            const j = v._container ? He.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !1), u?.stop(), u = null, f?.remove(), f = null, v._config?.helperLines && v._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const H = v.getNode(z);
            if (H && v._emit("node-drag-end", { node: H, position: Y }), m && H?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const te = _;
              m = !1, y = -1, _ = null, v._layoutAnimFrame && (cancelAnimationFrame(v._layoutAnimFrame), v._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Do(v, z, g), g = null) : te && te !== H.parentId ? (v.layoutChildren(te, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(te, { omitFromComputation: z }), v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })) : (v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })), d = null, v._layoutAnimTick++, v._commitNodeGeometry(W), Ws(v, a, l), l = null, a = !1;
              return;
            }
            if (H && g)
              B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Do(v, z, g), g = null;
            else if (H && H.parentId && !g) {
              const te = un(
                v.getNode(H.parentId),
                v._config?.childValidationRules ?? {}
              ), Q = v.getNode(H.parentId);
              if (!te?.preventChildEscape && !Q?.childLayout && Q?.dimensions) {
                const U = H.position.x, J = H.position.y, se = H.dimensions?.width ?? 150, oe = H.dimensions?.height ?? 50;
                (U + se < 0 || J + oe < 0 || U > Q.dimensions.width || J > Q.dimensions.height) && Do(v, z, null);
              }
              g = null;
            } else
              g && B && B.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (v._config?.proximityConnect && p) {
              const te = p;
              h?.destroy(), h = null, p = null;
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
                if (pt(U, v.edges, { preventCycles: v._config?.preventCycles }) && gt(U, v._config?.connectionRules, v._nodeMap) && (B ? nt(B, U, v.edges) : !0) && (B ? tt(B, U) : !0) && (!v._config.isValidConnection || v._config.isValidConnection(U))) {
                  if (v._config.proximityConnectConfirm) {
                    const ge = B?.querySelector(`[data-flow-node-id="${CSS.escape(te.source)}"]`), fe = B?.querySelector(`[data-flow-node-id="${CSS.escape(te.target)}"]`);
                    ge?.classList.add("flow-proximity-confirm"), fe?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      ge?.classList.remove("flow-proximity-confirm"), fe?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const ee = `e-${te.source}-${te.target}-${Date.now()}-${wp++}`;
                  v.addEdges({ id: ee, ...U }), v._emit("connect", { connection: U });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, a && (v._layoutAnimTick++, v._commitNodeGeometry(W)), Ws(v, a, l), l = null, a = !1;
          }
        }));
      });
      {
        const P = t.$data(e.closest("[x-data]"));
        if (P?._config?.easyConnect) {
          const v = P._config.easyConnectKey ?? "alt", w = (N) => {
            if (!vp(N, v) || N.target.closest("[data-flow-handle-type]")) return;
            const k = t.$data(e.closest("[x-data]"));
            if (!k || k._animationLocked || k._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const O = k.getNode(R.id);
            if (!O || O.connectable === !1) return;
            N.preventDefault(), N.stopPropagation(), N.stopImmediatePropagation();
            const q = _p(e, N.clientX, N.clientY), D = q?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const L = e.closest(".flow-container");
            if (!L) return;
            const $ = k._viewportLive ?? k.viewport, F = $?.zoom || 1, K = $?.x || 0, ne = $?.y || 0, G = L.getBoundingClientRect();
            let B, z;
            if (q) {
              const J = q.getBoundingClientRect();
              B = (J.left + J.width / 2 - G.left - K) / F, z = (J.top + J.height / 2 - G.top - ne) / F;
            } else {
              const J = e.getBoundingClientRect();
              B = (J.left + J.width / 2 - G.left - K) / F, z = (J.top + J.height / 2 - G.top - ne) / F;
            }
            k._emit("connect-start", { source: R.id, sourceHandle: D });
            const Y = Wt({
              connectionLineType: k._config?.connectionLineType,
              connectionLineStyle: k._config?.connectionLineStyle,
              connectionLine: k._config?.connectionLine
            }), W = L.querySelector(".flow-viewport");
            W && W.appendChild(Y.svg), Y.update({ fromX: B, fromY: z, toX: B, toY: z, source: R.id, sourceHandle: D }), k.pendingConnection = { source: R.id, sourceHandle: D, position: { x: B, y: z } }, bn(L, R.id, D, k);
            let j = vo(L, k, N.clientX, N.clientY), H = null;
            const te = k._config?.connectionSnapRadius ?? 20, Q = (J) => {
              const se = k.screenToFlowPosition(J.clientX, J.clientY), oe = _n({
                containerEl: L,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: se,
                connectionSnapRadius: te,
                getNode: (Z) => k.getNode(Z),
                toFlowPosition: (Z, ee) => k.screenToFlowPosition(Z, ee)
              });
              oe.element !== H && (H?.classList.remove("flow-handle-active"), oe.element?.classList.add("flow-handle-active"), H = oe.element), Y.update({ fromX: B, fromY: z, toX: oe.position.x, toY: oe.position.y, source: R.id, sourceHandle: D }), k.pendingConnection = { ...k.pendingConnection, position: oe.position }, j?.updatePointer(J.clientX, J.clientY);
            }, U = async (J) => {
              j?.stop(), j = null, document.removeEventListener("pointermove", Q), document.removeEventListener("pointerup", U), Y.destroy(), H?.classList.remove("flow-handle-active"), ke(L), e.classList.remove("flow-easy-connecting");
              const se = k.screenToFlowPosition(J.clientX, J.clientY), oe = { source: R.id, sourceHandle: D, position: se };
              k.pendingConnection = null;
              let Z = H;
              if (Z || (Z = document.elementFromPoint(J.clientX, J.clientY)?.closest('[data-flow-handle-type="target"]')), !Z) {
                k._emit("connect-end", { connection: null, ...oe });
                return;
              }
              const ge = Z.closest("[x-flow-node]")?.dataset.flowNodeId, fe = Z.dataset.flowHandleId ?? "target";
              if (!ge) {
                k._emit("connect-end", { connection: null, ...oe });
                return;
              }
              const ie = { source: R.id, sourceHandle: D, target: ge, targetHandle: fe }, pe = await ea({ connection: ie, canvas: k, containerEl: L });
              k._emit("connect-end", {
                connection: pe.applied ? ie : null,
                ...oe
              });
            };
            document.addEventListener("pointermove", Q), document.addEventListener("pointerup", U);
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
        w && (w._animationLocked || ei(v) && (w._emit("node-click", { node: v, event: P }), P.stopPropagation(), mt(P, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1) : (w.selectedNodes.add(v.id), v.selected = !0) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0), w._emitSelectionChange()));
      };
      e.addEventListener("keydown", T);
      const I = () => {
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
      e.addEventListener("focus", I);
      const M = (P) => {
        if (a) return;
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w && !w._animationLocked && (w._emit("node-click", { node: v, event: P }), !!ei(v))) {
          if (P.stopPropagation(), c) {
            c = !1;
            return;
          }
          mt(P, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1, e.classList.remove("flow-node-selected"), V("selection", `Node "${v.id}" deselected (shift)`)) : (w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), V("selection", `Node "${v.id}" selected (shift)`)) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), V("selection", `Node "${v.id}" selected`)), w._emitSelectionChange();
        }
      };
      e.addEventListener("click", M);
      const A = (P) => {
        P.preventDefault(), P.stopPropagation();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w)
          if (w.selectedNodes.size > 1 && w.selectedNodes.has(v.id)) {
            const N = w.nodes.filter((k) => w.selectedNodes.has(k.id));
            w._emit("selection-context-menu", { nodes: N, event: P });
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
        }, V("init", `Node "${P.id}" measured`, P.dimensions), v?._nodeElements?.set(P.id, e), P.resizeObserver !== !1 && v?._resizeObserver && v._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", T), e.removeEventListener("focus", I), e.removeEventListener("click", M), e.removeEventListener("contextmenu", A);
        const P = e.dataset.flowNodeId;
        if (P) {
          const v = t.$data(e.closest("[x-data]"));
          v?._nodeElements?.delete(P), v?._resizeObserver?.unobserve(e), v?._draggingNodeIds?.delete(P);
        }
      });
    }
  );
}
const At = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function Ep(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  u ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : f && (g = o.height - e.y), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(l, p)), g = Math.max(a, Math.min(c, g)));
  const m = p - o.width, y = g - o.height, _ = d ? n.x - m : n.x, S = f ? n.y - y : n.y;
  return {
    position: { x: _, y: S },
    dimensions: { width: p, height: g }
  };
}
const La = ["top-left", "top-right", "bottom-left", "bottom-right"], Pa = ["top", "right", "bottom", "left"], Cp = [...La, ...Pa], Sp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function kp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Lp(o);
      let l = { ...At };
      if (n)
        try {
          const d = i(n);
          l = { ...At, ...d };
        } catch {
        }
      const c = [];
      for (const d of a) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Sp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), m = h.dataset.flowNodeId;
          if (!m || !g) return;
          const y = g.getNode(m);
          if (!y || !fs(y)) return;
          y.fixedDimensions = !0;
          const _ = { ...l };
          if (y.minDimensions?.width != null && l.minWidth === At.minWidth && (_.minWidth = y.minDimensions.width), y.minDimensions?.height != null && l.minHeight === At.minHeight && (_.minHeight = y.minDimensions.height), y.maxDimensions?.width != null && l.maxWidth === At.maxWidth && (_.maxWidth = y.maxDimensions.width), y.maxDimensions?.height != null && l.maxHeight === At.maxHeight && (_.maxHeight = y.maxDimensions.height), !y.dimensions) {
            const M = g.viewport?.zoom || 1, A = h.getBoundingClientRect();
            y.dimensions = { width: A.width / M, height: A.height / M };
          }
          const S = { x: y.position.x, y: y.position.y }, x = { width: y.dimensions.width, height: y.dimensions.height }, b = g.viewport?.zoom || 1, C = f.clientX, E = f.clientY;
          g._captureHistory?.(), V("resize", `Resize start on "${m}" (${d})`, x), g._emit("node-resize-start", { node: y, dimensions: { ...x } });
          const T = (M) => {
            const A = {
              x: (M.clientX - C) / b,
              y: (M.clientY - E) / b
            }, P = Ep(
              d,
              A,
              S,
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
          }, I = () => {
            document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", I), document.removeEventListener("pointercancel", I), V("resize", `Resize end on "${m}"`, y.dimensions), g._emit("node-resize-end", { node: y, dimensions: { ...y.dimensions } });
          };
          document.addEventListener("pointermove", T), document.addEventListener("pointerup", I), document.addEventListener("pointercancel", I);
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
        const g = !fs(p);
        for (const m of c)
          m.style.display = g ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function Lp(t) {
  if (t.includes("corners"))
    return La;
  if (t.includes("edges"))
    return Pa;
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
  return Cp;
}
function Pp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function Mp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Tp(t) {
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
        const S = (b) => {
          let C = Pp(
            b.clientX,
            b.clientY,
            y,
            _
          );
          a && (C = Mp(C, l)), g.rotation = C;
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
function Ap(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const Np = "application/alpineflow";
function $p(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(Np, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function Ip(t) {
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
function Dp(t) {
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
          const g = Ip(
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
          const y = i.getNode?.(g.source), _ = i.getNode?.(g.target), S = g.hidden || g._hiddenByCollapse || y?.hidden || _?.hidden;
          m.style.display = S ? "none" : "";
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
const Hp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], Rp = "a, button, input, textarea, select, [contenteditable]", Fp = 100, Op = 60, zp = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), Vp = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), Bp = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), qp = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function Yp(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && Hp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function Nt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function Xp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function Wp(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (zp.has(e) && (t.style.top = "0"), Vp.has(e) && (t.style.bottom = "0")), o && !n && (Bp.has(e) && (t.style.left = "0"), qp.has(e) && (t.style.right = "0"));
}
function jp(t) {
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
      } = Yp(n, o), f = d || u, h = !s && !a && !f, p = !s && !l && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || f) && e.classList.add("flow-panel-locked"), (l || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && Wp(e, r, d, u);
      const g = (b) => b.stopPropagation();
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
      }, _ = `flow-panel-${r}`, S = () => {
        e.style.left = y.left, e.style.top = y.top, e.style.right = y.right, e.style.bottom = y.bottom, e.style.transform = y.transform, e.style.width = y.width, e.style.height = y.height, e.style.borderRadius = y.borderRadius, e.classList.contains(_) || e.classList.add(_);
      };
      m.addEventListener("flow-panel-reset", S), m.__flowPanels || (m.__flowPanels = /* @__PURE__ */ new Set()), m.__flowPanels.add(e);
      let x = null;
      if (h) {
        let b = !1, C = 0, E = 0, T = 0, I = 0;
        const M = () => {
          const w = e.getBoundingClientRect(), N = m.getBoundingClientRect();
          return {
            x: w.left - N.left,
            y: w.top - N.top
          };
        }, A = (w) => {
          if (!b) return;
          let N = T + (w.clientX - C), k = I + (w.clientY - E);
          if (c) {
            const R = Xp(
              N,
              k,
              e.offsetWidth,
              e.offsetHeight,
              m.clientWidth,
              m.clientHeight
            );
            N = R.left, k = R.top;
          }
          e.style.left = `${N}px`, e.style.top = `${k}px`, Nt(m, "panel-drag", {
            panel: e,
            position: { x: N, y: k }
          });
        }, P = () => {
          if (!b) return;
          b = !1, document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P);
          const w = M();
          Nt(m, "panel-drag-end", {
            panel: e,
            position: w
          });
        }, v = (w) => {
          const N = w.target;
          if (N.closest(Rp) || N.closest(".flow-panel-resize-handle"))
            return;
          b = !0, C = w.clientX, E = w.clientY;
          const k = e.getBoundingClientRect(), R = m.getBoundingClientRect();
          T = k.left - R.left, I = k.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${T}px`, e.style.top = `${I}px`, document.addEventListener("pointermove", A), document.addEventListener("pointerup", P), document.addEventListener("pointercancel", P), Nt(m, "panel-drag-start", {
            panel: e,
            position: { x: T, y: I }
          });
        };
        if (e.addEventListener("pointerdown", v), p) {
          x = document.createElement("div"), x.classList.add("flow-panel-resize-handle"), e.appendChild(x);
          let w = !1, N = 0, k = 0, R = 0, O = 0;
          const q = ($) => {
            if (!w) return;
            const F = Math.max(Fp, R + ($.clientX - N)), K = Math.max(Op, O + ($.clientY - k));
            e.style.width = `${F}px`, e.style.height = `${K}px`, Nt(m, "panel-resize", {
              panel: e,
              dimensions: { width: F, height: K }
            });
          }, D = () => {
            w && (w = !1, document.removeEventListener("pointermove", q), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), Nt(m, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, L = ($) => {
            $.stopPropagation(), w = !0, N = $.clientX, k = $.clientY, R = e.offsetWidth, O = e.offsetHeight, document.addEventListener("pointermove", q), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), Nt(m, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: O }
            });
          };
          x.addEventListener("pointerdown", L), i(() => {
            e.removeEventListener("pointerdown", v), x?.removeEventListener("pointerdown", L), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P), document.removeEventListener("pointermove", q), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), x?.remove(), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", S), m.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P), document.removeEventListener("pointercancel", P), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", S), m.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), m.removeEventListener("flow-panel-reset", S), m.__flowPanels?.delete(e);
        });
    }
  );
}
function Up(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = Gp(n), a = Zp(o);
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
        const h = f.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, m = g ? f.getNode(g) : null, y = m?.dimensions?.width ?? d.offsetWidth, _ = m?.dimensions?.height ?? d.offsetHeight, S = p / h;
        let x, b, C, E;
        s === "top" || s === "bottom" ? (b = s === "top" ? -S : _ + S, E = s === "top" ? "-100%" : "0%", a === "start" ? (x = 0, C = "0%") : a === "end" ? (x = y, C = "-100%") : (x = y / 2, C = "-50%")) : (x = s === "left" ? -S : y + S, C = s === "left" ? "-100%" : "0%", a === "start" ? (b = 0, E = "0%") : a === "end" ? (b = _, E = "-100%") : (b = _ / 2, E = "-50%")), e.style.left = `${x}px`, e.style.top = `${b}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${C}, ${E})`;
      }), r(() => {
        e.removeEventListener("pointerdown", l), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function Gp(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Zp(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Kp(t) {
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
        const C = r(o);
        u = C?.offsetX ?? 0, f = C?.offsetY ?? 0;
      }
      l.setAttribute("role", "menu"), l.setAttribute("tabindex", "-1"), l.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let p = null;
      const g = 4, m = () => {
        p = document.activeElement;
        const C = d.contextMenu.x + u, E = d.contextMenu.y + f;
        l.style.display = "", l.style.position = "fixed", l.style.left = C + "px", l.style.top = E + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((v) => {
          v.setAttribute("role", "menuitem"), v.hasAttribute("tabindex") || v.setAttribute("tabindex", "-1");
        });
        const T = l.getBoundingClientRect(), I = window.innerWidth, M = window.innerHeight;
        let A = C, P = E;
        T.right > I - g && (A = I - T.width - g), T.bottom > M - g && (P = M - T.height - g), A < g && (A = g), P < g && (P = g), l.style.left = A + "px", l.style.top = P + "px", h.style.display = "", l.focus({ preventScroll: !0 });
      }, y = () => {
        l.style.display = "none", h.style.display = "none", p && document.contains(p) && (p.focus({ preventScroll: !0 }), p = null);
      };
      i(() => {
        const C = d.contextMenu;
        C.show && C.type === a ? m() : y();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (C) => {
        C.preventDefault(), d.closeContextMenu();
      });
      const _ = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", _, !0);
      const S = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), x = (C) => Array.from(C.querySelectorAll(
        "button:not([disabled])"
      )), b = (C) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const E = document.activeElement, T = E?.closest(".flow-context-submenu"), I = T ? x(T) : S();
        if (I.length === 0) return;
        const M = I.indexOf(E);
        switch (C.key) {
          case "ArrowDown": {
            C.preventDefault();
            const A = M < I.length - 1 ? M + 1 : 0;
            I[A].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            C.preventDefault();
            const A = M > 0 ? M - 1 : I.length - 1;
            I[A].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (C.preventDefault(), C.shiftKey) {
              const A = M > 0 ? M - 1 : I.length - 1;
              I[A].focus({ preventScroll: !0 });
            } else {
              const A = M < I.length - 1 ? M + 1 : 0;
              I[A].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            C.preventDefault(), E?.click();
            break;
          }
          case "ArrowRight": {
            if (!T) {
              const A = E?.querySelector(".flow-context-submenu");
              A && (C.preventDefault(), A.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            T && (C.preventDefault(), T.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      l.addEventListener("keydown", b), s(() => {
        h.remove(), window.removeEventListener("scroll", _, !0), l.removeEventListener("keydown", b);
      });
    }
  );
}
const Jp = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Qp(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), u = l.has("queue"), f = n || "";
      let h = "click";
      l.has("mouseenter") ? h = "mouseenter" : l.has("click") && (h = "click");
      let p = null, g = [], m = !1, y = !1, _ = !1;
      function S() {
        const A = r(i);
        return Array.isArray(A) ? A : A && typeof A == "object" ? [A] : [];
      }
      function x() {
        const A = e.closest("[x-data]");
        return A ? t.$data(A) : null;
      }
      function b(A, P = !1) {
        const v = x();
        if (!v?.timeline) return Promise.resolve();
        const w = v.timeline();
        if (P) {
          for (let N = A.length - 1; N >= 0; N--)
            w.step(A[N]);
          w.reverse();
        } else
          for (const N of A)
            N.parallel ? w.parallel(N.parallel) : w.step(N);
        return p = w, w.play().then(() => {
          p === w && (p = null);
        });
      }
      function C(A = !1) {
        if (c && y) return;
        y = !0;
        const P = S();
        if (P.length === 0) return;
        const v = () => b(P, A);
        u ? (g.push(v), E()) : (p?.stop(), p = null, g = [], m = !1, v());
      }
      async function E() {
        if (!m) {
          for (m = !0; g.length > 0; )
            await g.shift()();
          m = !1;
        }
      }
      if (f) {
        s(() => {
          const A = S(), P = x();
          P?.registerAnimation && P.registerAnimation(f, A);
        }), a(() => {
          const A = x();
          A?.unregisterAnimation && A.unregisterAnimation(f);
        });
        return;
      }
      const T = () => {
        d && h === "click" ? (C(_), _ = !_) : C(!1);
      };
      e.addEventListener(h, T);
      let I = null, M = null;
      d && h !== "click" && (M = Jp[h] ?? null, M && (I = () => C(!0), e.addEventListener(M, I))), a(() => {
        p?.stop(), e.removeEventListener(h, T), M && I && e.removeEventListener(M, I);
      });
    }
  );
}
function em(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? we, l = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + a) * n.zoom + n.x, f = (s + l) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function tm(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !em(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function nm(t) {
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
        const S = _.timeline(), x = y.speed ?? 1, b = y.autoFitView === !0, C = y.fitViewPadding ?? 0.1, E = _.viewport, T = _.getContainerDimensions?.();
        for (const I of m) {
          const M = x !== 1 ? {
            ...I,
            duration: I.duration !== void 0 ? I.duration / x : void 0,
            delay: I.delay !== void 0 ? I.delay / x : void 0
          } : I;
          if (M.parallel) {
            const A = M.parallel.map(
              (P) => x !== 1 ? {
                ...P,
                duration: P.duration !== void 0 ? P.duration / x : void 0,
                delay: P.delay !== void 0 ? P.delay / x : void 0
              } : P
            );
            S.parallel(A);
          } else if (b && E && T && tm(M, _, E, T.width, T.height)) {
            const A = {
              fitView: !0,
              fitViewPadding: C,
              duration: M.duration,
              easing: M.easing
            };
            S.parallel([M, A]);
          } else
            S.step(M);
        }
        if (y.lock && S.lock(!0), y.loop !== void 0 && y.loop !== !1) {
          const I = y.loop === !0 ? 0 : y.loop;
          S.loop(I);
        }
        return y.respectReducedMotion !== void 0 && S.respectReducedMotion(y.respectReducedMotion), a = S, d = "playing", c = !0, S.play().then(() => {
          a === S && (a = null, d = "idle", c = !1);
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
          const S = y.slice(Math.max(s, u));
          u = y.length, S.length > 0 && _ && (l.push(...S), p(m));
        } else
          u = y.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function om(t) {
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
function im(t) {
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
function Ho(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function sm(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
      try {
        const b = s.closest(".flow-container");
        return b ? !!t.$data?.(b)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const b = s.closest(".flow-container");
        return b ? !!t.$data?.(b)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    }, d = () => {
      try {
        const b = s.closest(".flow-container");
        return b ? t.$data?.(b) ?? null : null;
      } catch {
        return null;
      }
    }, u = () => {
      t.nextTick(() => {
        const b = d();
        if (!b) return;
        const C = t.raw(b);
        if (C._schemaMetrics != null) return;
        const E = s.querySelector(":scope > .flow-schema-header"), T = s.querySelector(":scope > .flow-schema-body"), I = s.querySelectorAll(".flow-schema-row");
        if (I.length < 2) return;
        const M = I[0], A = I[1], P = I[I.length - 1], v = M.querySelector(".flow-schema-handle"), w = P.querySelector(".flow-schema-handle");
        if (!E || !T || !v || !w) return;
        const N = s.closest("[data-flow-node-id]") ?? s, k = C.viewport?.zoom || 1, R = N.getBoundingClientRect(), O = E.getBoundingClientRect(), q = T.getBoundingClientRect(), D = M.getBoundingClientRect(), L = A.getBoundingClientRect(), $ = P.getBoundingClientRect(), F = v.getBoundingClientRect(), K = w.getBoundingClientRect(), ne = (L.top - D.top) / k, G = $.height / k;
        if (ne <= 0 || G <= 0) return;
        const B = {
          headerHeight: O.height / k,
          rowHeight: ne,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast: G,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (F.top + F.height / 2 - D.top) / k,
          handleOffsetYLast: (K.top + K.height / 2 - $.top) / k,
          insetLeft: (D.left - R.left) / k,
          insetRight: (R.right - D.right) / k,
          insetTop: (O.top - R.top) / k,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (R.bottom - q.bottom) / k,
          handleWidth: F.width / k,
          handleHeight: F.height / k
        };
        C._schemaMetrics = B;
      });
    };
    s.classList.add("flow-schema-node");
    let f = s.closest("[data-flow-node-id]"), h = !1;
    f ? f.setAttribute("data-flow-schema-node", "") : t.nextTick(() => {
      h || !s.isConnected || (f = s.closest("[data-flow-node-id]"), f?.setAttribute("data-flow-schema-node", ""));
    });
    let p = null, g = null;
    const m = /* @__PURE__ */ new Map(), y = () => {
      p && g || (Ho(s), m.clear(), p = document.createElement("div"), p.className = "flow-schema-header", s.appendChild(p), g = document.createElement("div"), g.className = "flow-schema-body", s.appendChild(g));
    }, _ = () => {
      const b = a(), C = b?.data;
      if (!C) {
        for (const w of m.values())
          t.destroyTree(w);
        m.clear(), Ho(s), p = null, g = null;
        return;
      }
      y();
      const E = typeof C.label == "string" ? C.label : "", T = Array.isArray(C.fields) ? C.fields : [], I = typeof b?.id == "string" ? b.id : "";
      typeof C.kind == "string" && C.kind ? s.setAttribute("data-flow-schema-kind", C.kind) : s.removeAttribute("data-flow-schema-kind"), p.textContent !== E && (p.textContent = E);
      const M = l(), A = c(), P = /* @__PURE__ */ new Set();
      for (const w of T) {
        P.add(w.name);
        const N = m.get(w.name);
        if (N)
          S(N, w);
        else {
          const k = x(w, I, M, A);
          m.set(w.name, k), g.appendChild(k), t.initTree(k);
        }
      }
      for (const [w, N] of m)
        P.has(w) || (t.destroyTree(N), N.remove(), m.delete(w));
      let v = g.firstChild;
      for (const w of T) {
        const N = m.get(w.name);
        N && (v === N ? v = v.nextSibling : g.insertBefore(N, v));
      }
      u();
    }, S = (b, C) => {
      b.dataset.flowSchemaField !== C.name && (b.dataset.flowSchemaField = C.name), b.classList.toggle("flow-schema-row--pk", C.key === "primary"), b.classList.toggle("flow-schema-row--fk", C.key === "foreign"), b.classList.toggle("flow-schema-row--required", !!C.required);
      let E = b.querySelector(".flow-schema-row-icon");
      const T = b.querySelector(".flow-schema-row-name");
      C.icon ? (E || (E = document.createElement("span"), E.className = "flow-schema-row-icon", b.insertBefore(E, T)), E.textContent !== C.icon && (E.textContent = C.icon)) : E && E.remove(), T && T.textContent !== C.name && (T.textContent = C.name);
      const I = b.querySelector(".flow-schema-row-type");
      I && I.textContent !== C.type && (I.textContent = C.type);
    }, x = (b, C, E, T) => {
      const I = document.createElement("div");
      I.className = "flow-schema-row", I.dataset.flowSchemaField = b.name, b.key === "primary" && I.classList.add("flow-schema-row--pk"), b.key === "foreign" && I.classList.add("flow-schema-row--fk"), b.required && I.classList.add("flow-schema-row--required"), C && I.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${C}.${b.name}`)
      ), E && I.setAttribute("x-schema-reorderable", ""), T && C && I.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${C}.${b.name}`)
      );
      const M = document.createElement("div");
      if (M.className = "flow-schema-handle flow-schema-handle--target", M.setAttribute("x-flow-handle:target.left", JSON.stringify(b.name)), I.appendChild(M), b.icon) {
        const k = document.createElement("span");
        k.className = "flow-schema-row-icon", k.textContent = b.icon, I.appendChild(k);
      }
      const A = document.createElement("span");
      A.className = "flow-schema-row-name", A.textContent = b.name, I.appendChild(A);
      const P = document.createElement("span");
      P.className = "flow-schema-row-type", P.textContent = b.type, I.appendChild(P);
      const v = document.createElement("div");
      v.className = "flow-schema-handle flow-schema-handle--source", v.setAttribute("x-flow-handle:source.right", JSON.stringify(b.name)), I.appendChild(v);
      const w = document.createElement("div");
      w.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", w.setAttribute("x-flow-handle:target.right", JSON.stringify(b.name)), I.appendChild(w);
      const N = document.createElement("div");
      return N.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", N.setAttribute("x-flow-handle:source.left", JSON.stringify(b.name)), I.appendChild(N), I;
    };
    i(() => {
      if (!s.isConnected) return;
      const b = a()?.data;
      b?.label, b?.kind;
      const C = b?.fields;
      if (Array.isArray(C))
        for (const E of C)
          E.name, E.type, E.key, E.required, E.icon;
      _();
    }), r(() => {
      h = !0;
      for (const b of m.values())
        t.destroyTree(b);
      m.clear(), Ho(s), p = null, g = null, s.classList.remove("flow-schema-node"), f?.removeAttribute("data-flow-schema-node");
    });
  });
}
function rm(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function js(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function am(t) {
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
      js(s);
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
      m.className = "flow-wait-duration", m.textContent = rm(h), p.appendChild(m), s.appendChild(p);
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
      js(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Us = {
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
function lm(t) {
  const { field: e, op: n, value: o } = t;
  return n in Us ? `${e} ${Us[n]} ${cn(o)}` : n === "in" ? `${e} in ${cn(o)}` : n === "notIn" ? `${e} not in ${cn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${cn(o)}`;
}
function Gs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function cm(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function dm(t) {
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
      const u = a()?.data ?? {}, f = cm(l(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Gs(s);
      const p = typeof u.label == "string" && u.label ? u.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const m = document.createElement("div");
      m.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? m.textContent = lm(u.condition) : typeof u.evaluate == "function" ? m.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : m.textContent = "", s.appendChild(m);
      const y = document.createElement("div");
      y.className = "flow-condition-handle-target", y.setAttribute("data-flow-handle-direction", "target"), y.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(y);
      const _ = document.createElement("div");
      _.className = "flow-condition-handle-source flow-condition-handle--true", _.setAttribute("data-flow-handle-direction", "source"), _.setAttribute("data-source-handle", "true"), _.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(_);
      const S = document.createElement("div");
      S.className = "flow-condition-handle-source flow-condition-handle--false", S.setAttribute("data-flow-handle-direction", "source"), S.setAttribute("data-source-handle", "false"), S.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(S), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = a()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Gs(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function um(t) {
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
function fm(t) {
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
const hm = ["perf", "events", "viewport", "state", "activity"], Zs = ["fps", "memory", "counts", "visible"], Ks = 30;
function gm(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => hm.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function pm(t) {
  return t.perf ? t.perf === !0 ? [...Zs] : t.perf.filter((e) => Zs.includes(e)) : [];
}
function mm(t) {
  return t.events ? t.events === !0 ? Ks : t.events.max ?? Ks : 0;
}
function sn(t, e) {
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
function ym(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = gm(a, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (Y) => Y.stopPropagation();
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
        m = !m, g.style.display = m ? "" : "none", f.title = m ? "Collapse" : "Devtools", m ? K() : ne();
      };
      f.addEventListener("click", y);
      const _ = pm(l);
      let S = null, x = null, b = null, C = null, E = null;
      if (_.length > 0) {
        const { wrapper: Y, content: W } = sn("Performance", "flow-devtools-perf");
        if (_.includes("fps")) {
          const { row: j, valueEl: H } = Ve("FPS", "flow-devtools-fps");
          S = H, W.appendChild(j);
        }
        if (_.includes("memory")) {
          const { row: j, valueEl: H } = Ve("Memory", "flow-devtools-memory");
          x = H, W.appendChild(j);
        }
        if (_.includes("counts")) {
          const j = Ve("Nodes", "flow-devtools-counts");
          b = j.valueEl, W.appendChild(j.row);
          const H = Ve("Edges", "flow-devtools-counts");
          C = H.valueEl, W.appendChild(H.row);
        }
        if (_.includes("visible")) {
          const { row: j, valueEl: H } = Ve("Visible", "flow-devtools-visible");
          E = H, W.appendChild(j);
        }
        g.appendChild(Y);
      }
      const T = mm(l);
      let I = null;
      if (T > 0) {
        const { wrapper: Y, content: W } = sn("Events", "flow-devtools-events"), j = document.createElement("button");
        j.className = "flow-devtools-clear-btn nopan", j.textContent = "Clear", j.addEventListener("click", () => {
          I && (I.textContent = ""), G.length = 0;
        }), Y.querySelector(".flow-devtools-section-title").appendChild(j), I = document.createElement("div"), I.className = "flow-devtools-event-list", W.appendChild(I), g.appendChild(Y);
      }
      let M = null, A = null, P = null;
      if (l.viewport) {
        const { wrapper: Y, content: W } = sn("Viewport", "flow-devtools-viewport"), j = Ve("X", "flow-devtools-vp-x");
        M = j.valueEl, W.appendChild(j.row);
        const H = Ve("Y", "flow-devtools-vp-y");
        A = H.valueEl, W.appendChild(H.row);
        const te = Ve("Zoom", "flow-devtools-vp-zoom");
        P = te.valueEl, W.appendChild(te.row), g.appendChild(Y);
      }
      let v = null;
      if (l.state) {
        const { wrapper: Y, content: W } = sn("Selection", "flow-devtools-state");
        v = document.createElement("div"), v.className = "flow-devtools-state-content", v.textContent = "No selection", W.appendChild(v), g.appendChild(Y);
      }
      let w = null, N = null, k = null, R = null;
      if (l.activity) {
        const { wrapper: Y, content: W } = sn("Activity", "flow-devtools-activity"), j = Ve("Animations", "flow-devtools-anim");
        w = j.valueEl, W.appendChild(j.row);
        const H = Ve("Particles", "flow-devtools-particles");
        N = H.valueEl, W.appendChild(H.row);
        const te = Ve("Follow", "flow-devtools-follow");
        k = te.valueEl, W.appendChild(te.row);
        const Q = Ve("Timelines", "flow-devtools-timelines");
        R = Q.valueEl, W.appendChild(Q.row), g.appendChild(Y);
      }
      let O = null, q = !1, D = 0, L = performance.now();
      const $ = !!(S || x), F = () => {
        if (!q) return;
        D++;
        const Y = performance.now();
        Y - L >= 1e3 && (S && (S.textContent = String(Math.round(D * 1e3 / (Y - L)))), D = 0, L = Y, x && performance.memory && (x.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), O = requestAnimationFrame(F);
      }, K = () => {
        !$ || q || (q = !0, D = 0, L = performance.now(), O = requestAnimationFrame(F));
      }, ne = () => {
        q = !1, O !== null && (cancelAnimationFrame(O), O = null);
      }, G = [], B = [
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
      if (T > 0 && I) {
        z = (Y) => {
          if (!m) return;
          const W = Y, j = W.type.replace("flow-", "");
          let H = "";
          try {
            H = W.detail ? JSON.stringify(W.detail).slice(0, 80) : "";
          } catch {
            H = "[circular]";
          }
          G.unshift({ name: j, time: Date.now(), detail: H });
          const te = I, Q = document.createElement("div");
          Q.className = "flow-devtools-event-entry";
          const U = document.createElement("span");
          U.className = "flow-devtools-event-name", U.textContent = j;
          const J = document.createElement("span");
          J.className = "flow-devtools-event-age", J.textContent = "now";
          const se = document.createElement("span");
          for (se.className = "flow-devtools-event-detail", se.textContent = H, Q.appendChild(U), Q.appendChild(J), Q.appendChild(se), te.prepend(Q); te.children.length > T; )
            te.removeChild(te.lastChild), G.pop();
        };
        for (const Y of B)
          d.addEventListener(Y, z);
      }
      r(() => {
        const Y = t.$data(c);
        !Y || !Y.viewport || (M && (M.textContent = Math.round(Y.viewport.x).toString()), A && (A.textContent = Math.round(Y.viewport.y).toString()), P && (P.textContent = Y.viewport.zoom.toFixed(2)));
      }), r(() => {
        const Y = t.$data(c);
        if (Y) {
          if (b && (b.textContent = String(Y.nodes?.length ?? 0)), C && (C.textContent = String(Y.edges?.length ?? 0)), E && Y._getVisibleNodeIds && (E.textContent = String(Y._getVisibleNodeIds().size)), v) {
            const W = Y.selectedNodes, j = Y.selectedEdges;
            if (!((W?.size ?? 0) > 0 || (j?.size ?? 0) > 0))
              v.textContent = "No selection";
            else {
              if (v.textContent = "", W && W.size > 0)
                for (const te of W) {
                  const Q = Y.getNode?.(te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, position: Q.position, data: Q.data }, null, 2), v.appendChild(U);
                }
              if (j && j.size > 0)
                for (const te of j) {
                  const Q = Y.edges?.find((J) => J.id === te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, source: Q.source, target: Q.target, type: Q.type }, null, 2), v.appendChild(U);
                }
            }
          }
          if (w) {
            const W = Y._animator?._groups?.size ?? 0;
            w.textContent = String(W);
          }
          N && (N.textContent = String(Y._activeParticles?.size ?? 0)), k && (k.textContent = Y._followHandle ? "Active" : "Idle"), R && (R.textContent = String(Y._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ne(), f.removeEventListener("click", y), z)
          for (const Y of B)
            d.removeEventListener(Y, z);
        e.removeEventListener("wheel", u), e.textContent = "", S = null, x = null, b = null, C = null, E = null, I = null, M = null, A = null, P = null, v = null, w = null, N = null, k = null, R = null;
      });
    }
  );
}
const wm = {
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
function vm(t) {
  return wm[t] ?? null;
}
function _m(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = vm(n);
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
function bm(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Ro = /* @__PURE__ */ new WeakMap();
function xm(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = bm(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), Ro.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (l.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Ro.set(c, u);
        else if (l.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const h = Ro.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), a(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Em(t) {
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
function Cm(t) {
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
        const h = i(n), p = Em(h);
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
function Sm(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Ti = /* @__PURE__ */ new Map();
function km(t, e) {
  Ti.set(t, e);
}
function Lm(t) {
  return Ti.get(t) ?? null;
}
function Pm(t) {
  return Ti.has(t);
}
function Fo(t) {
  return `alpineflow-snapshot-${t}`;
}
function Mm(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = Sm(n, i);
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
            l.persist ? localStorage.setItem(Fo(f), JSON.stringify(h)) : km(f, h);
          } else {
            let h = null;
            if (l.persist) {
              const p = localStorage.getItem(Fo(f));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = Lm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), l.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        l.persist ? h = localStorage.getItem(Fo(f)) !== null : (d.nodes.length, h = Pm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Tm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function Am(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Tm(s._loadingText));
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
function Nm(t) {
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
        if (!d.edges.some((I) => I.id === l)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const m = d.viewport?.zoom || 1, y = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let _ = 0.5;
        if (n) {
          const I = i(n);
          typeof I == "number" && (_ = I);
        }
        const S = a.querySelectorAll("path"), x = S.length > 1 ? S[1] : S[0];
        if (!x) return;
        const b = x.getTotalLength?.();
        if (!b) return;
        const C = x.getPointAtLength(b * Math.max(0, Math.min(1, _))), E = y / m, T = p ? E : -E;
        e.style.left = `${C.x}px`, e.style.top = `${C.y + T}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / m}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function $m(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function Im(t) {
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
function qy(t, e, n) {
  const o = n?.defaultDimensions?.width ?? we, i = n?.defaultDimensions?.height ?? _e, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", l = t.filter((y) => !y.hidden).map((y) => ({
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
      style: typeof y.style == "string" ? y.style : Object.entries(y.style).map(([_, S]) => `${_}:${S}`).join(";")
    } : {},
    data: y.data ?? {}
  })), u = e.filter((y) => !y.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const y of u) {
    const _ = c.get(y.source), S = c.get(y.target);
    if (!_ || !S)
      continue;
    let x, b;
    try {
      const M = lo(
        y,
        _,
        S,
        _.sourcePosition ?? "bottom",
        S.targetPosition ?? "top"
      );
      x = M.path, b = M.labelPosition;
    } catch {
      continue;
    }
    let C, E;
    if (y.markerStart) {
      const M = Ot(y.markerStart), A = zt(M, s);
      h.has(A) || h.set(A, no(M, A)), C = `url(#${A})`;
    }
    if (y.markerEnd) {
      const M = Ot(y.markerEnd), A = zt(M, s);
      h.has(A) || h.set(A, no(M, A)), E = `url(#${A})`;
    }
    let T, I;
    if (y.label)
      if (b)
        T = b.x, I = b.y;
      else {
        const M = _.position.x + _.dimensions.width / 2, A = _.position.y + _.dimensions.height / 2, P = S.position.x + S.dimensions.width / 2, v = S.position.y + S.dimensions.height / 2;
        T = (M + P) / 2, I = (A + v) / 2;
      }
    f.push({
      id: y.id,
      source: y.source,
      target: y.target,
      pathD: x,
      ...C ? { markerStart: C } : {},
      ...E ? { markerEnd: E } : {},
      ...y.class ? { class: y.class } : {},
      ...y.label ? { label: y.label } : {},
      ...T !== void 0 ? { labelX: T } : {},
      ...I !== void 0 ? { labelY: I } : {}
    });
  }
  const p = Array.from(h.values()).join(`
`);
  let g, m;
  if (l.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, m = { x: 0, y: 0, zoom: 1 };
  else {
    const y = Yt(l);
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
const Js = /* @__PURE__ */ new WeakSet();
function Yy(t) {
  Js.has(t) || (Js.add(t), Oa(t), Im(t), up(t), xp(t), Xf(t), If(t), Df(t), Hf(t), sp(t), kp(t), Tp(t), Ap(t), $p(t), Dp(t), jp(t), Up(t), Kp(t), Qp(t), nm(t), om(t), im(t), um(t), fm(t), ym(t), _m(t), xm(t), Cm(t), Mm(t), Am(t), Nm(t), sm(t), am(t), dm(t), $m(t));
}
function Dm(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function Hm(t, e, n, o) {
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
async function Rm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => Iy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, m = t.style.overflow, y = [];
  try {
    if (s === "all") {
      const M = t.querySelectorAll("[data-flow-culled]");
      for (const N of M)
        N.style.display = "", y.push(N);
      const A = n.filter((N) => !N.hidden), P = Yt(A), v = i.padding ?? 0.1, w = Jn(
        P,
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
    t.style.width = `${l}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((M) => requestAnimationFrame(M));
    const _ = i.includeOverlays, S = _ === !0, x = typeof _ == "object" ? _ : {}, b = [
      ["canvas-overlay", S || (x.toolbar ?? !1)],
      ["flow-minimap", S || (x.minimap ?? !1)],
      ["flow-controls", S || (x.controls ?? !1)],
      ["flow-panel", S || (x.panels ?? !1)],
      ["flow-selection-box", !1]
    ], C = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: (M) => {
        if (M.classList) {
          for (const [A, P] of b)
            if (M.classList.contains(A) && !P) return !1;
        }
        return !0;
      }
    }), T = Dm(decodeURIComponent(C.substring("data:image/svg+xml;charset=utf-8,".length))), I = await Hm(T, l, c, d);
    if (i.filename) {
      const M = document.createElement("a");
      M.download = i.filename, M.href = I, M.click();
    }
    return I;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = m;
    for (const _ of y)
      _.style.display = "none";
  }
}
const Fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: Rm
}, Symbol.toStringTag, { value: "Module" }));
function Om(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const zm = /* @__PURE__ */ (() => {
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
let $t = null;
function Ma(t = {}) {
  return $t || (t.includeStyleProperties ? ($t = t.includeStyleProperties, $t) : ($t = vt(window.getComputedStyle(document.documentElement)), $t));
}
function fo(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function Vm(t) {
  const e = fo(t, "border-left-width"), n = fo(t, "border-right-width");
  return t.clientWidth + e + n;
}
function Bm(t) {
  const e = fo(t, "border-top-width"), n = fo(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Ai(t, e = {}) {
  const n = e.width || Vm(t), o = e.height || Bm(t);
  return { width: n, height: o };
}
function qm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const De = 16384;
function Ym(t) {
  (t.width > De || t.height > De) && (t.width > De && t.height > De ? t.width > t.height ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De) : t.width > De ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De));
}
function Xm(t, e = {}) {
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
function ho(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function Wm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function jm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), Wm(i);
}
const $e = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || $e(n, e);
};
function Um(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function Gm(t, e) {
  return Ma(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function Zm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? Um(n) : Gm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Qs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = zm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(Zm(s, n, i, o)), e.appendChild(a);
}
function Km(t, e, n) {
  Qs(t, e, ":before", n), Qs(t, e, ":after", n);
}
const er = "application/font-woff", tr = "image/jpeg", Jm = {
  woff: er,
  woff2: er,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: tr,
  jpeg: tr,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Qm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Ni(t) {
  const e = Qm(t).toLowerCase();
  return Jm[e] || "";
}
function ey(t) {
  return t.split(/,/)[1];
}
function ci(t) {
  return t.search(/^(data:)/) !== -1;
}
function ty(t, e) {
  return `data:${e};base64,${t}`;
}
async function Ta(t, e, n) {
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
const Oo = {};
function ny(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function $i(t, e, n) {
  const o = ny(t, e, n.includeQueryParams);
  if (Oo[o] != null)
    return Oo[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await Ta(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), ey(a)));
    i = ty(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Oo[o] = i, i;
}
async function oy(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : ho(e);
}
async function iy(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return ho(a);
  }
  const n = t.poster, o = Ni(n), i = await $i(n, o, e);
  return ho(i);
}
async function sy(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await xo(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function ry(t, e) {
  return $e(t, HTMLCanvasElement) ? oy(t) : $e(t, HTMLVideoElement) ? iy(t, e) : $e(t, HTMLIFrameElement) ? sy(t, e) : t.cloneNode(Aa(t));
}
const ay = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", Aa = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function ly(t, e, n) {
  var o, i;
  if (Aa(e))
    return e;
  let r = [];
  return ay(t) && t.assignedNodes ? r = vt(t.assignedNodes()) : $e(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = vt(t.contentDocument.body.childNodes) : r = vt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || $e(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => xo(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function cy(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : Ma(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), $e(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function dy(t, e) {
  $e(t, HTMLTextAreaElement) && (e.innerHTML = t.value), $e(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function uy(t, e) {
  if ($e(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function fy(t, e, n) {
  return $e(e, Element) && (cy(t, e, n), Km(t, e, n), dy(t, e), uy(t, e)), e;
}
async function hy(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await xo(c, e, !0));
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
async function xo(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => ry(o, e)).then((o) => ly(t, o, e)).then((o) => fy(t, o, e)).then((o) => hy(o, e));
}
const Na = /url\((['"]?)([^'"]+?)\1\)/g, gy = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, py = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function my(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function yy(t) {
  const e = [];
  return t.replace(Na, (n, o, i) => (e.push(i), n)), e.filter((n) => !ci(n));
}
async function wy(t, e, n, o, i) {
  try {
    const r = n ? Om(e, n) : e, s = Ni(e);
    let a;
    return i || (a = await $i(r, s, o)), t.replace(my(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function vy(t, { preferredFontFormat: e }) {
  return e ? t.replace(py, (n) => {
    for (; ; ) {
      const [o, , i] = gy.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function $a(t) {
  return t.search(Na) !== -1;
}
async function Ia(t, e, n) {
  if (!$a(t))
    return t;
  const o = vy(t, n);
  return yy(o).reduce((r, s) => r.then((a) => wy(a, s, e, n)), Promise.resolve(o));
}
async function It(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Ia(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function _y(t, e) {
  await It("background", t, e) || await It("background-image", t, e), await It("mask", t, e) || await It("-webkit-mask", t, e) || await It("mask-image", t, e) || await It("-webkit-mask-image", t, e);
}
async function by(t, e) {
  const n = $e(t, HTMLImageElement);
  if (!(n && !ci(t.src)) && !($e(t, SVGImageElement) && !ci(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await $i(o, Ni(o), e);
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
async function xy(t, e) {
  const o = vt(t.childNodes).map((i) => Da(i, e));
  await Promise.all(o).then(() => t);
}
async function Da(t, e) {
  $e(t, Element) && (await _y(t, e), await by(t, e), await xy(t, e));
}
function Ey(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const nr = {};
async function or(t) {
  let e = nr[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, nr[t] = e, e;
}
async function ir(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Ta(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function sr(t) {
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
async function Cy(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        vt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = or(l).then((d) => ir(d, e)).then((d) => sr(d).forEach((u) => {
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
        i.href != null && o.push(or(i.href).then((a) => ir(a, e)).then((a) => sr(a).forEach((l) => {
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
function Sy(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => $a(e.style.getPropertyValue("src")));
}
async function ky(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = vt(t.ownerDocument.styleSheets), o = await Cy(n, e);
  return Sy(o);
}
function Ha(t) {
  return t.trim().replace(/["']/g, "");
}
function Ly(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(Ha(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function Ra(t, e) {
  const n = await ky(t, e), o = Ly(t);
  return (await Promise.all(n.filter((r) => o.has(Ha(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Ia(r.cssText, s, e);
  }))).join(`
`);
}
async function Py(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Ra(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function Fa(t, e = {}) {
  const { width: n, height: o } = Ai(t, e), i = await xo(t, e, !0);
  return await Py(i, e), await Da(i, e), Ey(i, e), await jm(i, n, o);
}
async function kn(t, e = {}) {
  const { width: n, height: o } = Ai(t, e), i = await Fa(t, e), r = await ho(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || qm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || Ym(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function My(t, e = {}) {
  const { width: n, height: o } = Ai(t, e);
  return (await kn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function Ty(t, e = {}) {
  return (await kn(t, e)).toDataURL();
}
async function Ay(t, e = {}) {
  return (await kn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function Ny(t, e = {}) {
  const n = await kn(t, e);
  return await Xm(n);
}
async function $y(t, e = {}) {
  return Ra(t, e);
}
const Iy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: $y,
  toBlob: Ny,
  toCanvas: kn,
  toJpeg: Ay,
  toPixelData: My,
  toPng: Ty,
  toSvg: Fa
}, Symbol.toStringTag, { value: "Module" }));
export {
  Eh as ComputeEngine,
  of as FlowHistory,
  ms as SHORTCUT_DEFAULTS,
  Fy as along,
  Nf as areNodesConnected,
  la as buildNodeMap,
  da as clampToExtent,
  Po as clampToParent,
  qy as computeRenderPlan,
  Ss as computeValidationErrors,
  ca as computeZIndex,
  Yy as default,
  zy as drift,
  uh as expandParentToFitChild,
  ni as getAbsolutePosition,
  Vf as getAutoPanDelta,
  oo as getBezierPath,
  Mf as getConnectedEdges,
  wt as getDescendantIds,
  Rs as getEdgePosition,
  xa as getFloatingEdgeParams,
  Tf as getIncomers,
  Hs as getNodeIntersection,
  Yt as getNodesBounds,
  Pf as getNodesFullyInPolygon,
  Ku as getNodesFullyInRect,
  Lf as getNodesInPolygon,
  Zu as getNodesInRect,
  Qo as getOutgoers,
  Dy as getSimpleBezierPath,
  By as getSimpleFloatingPosition,
  vn as getSmoothStepPath,
  zf as getStepPath,
  Zr as getStraightPath,
  Jn as getViewportForBounds,
  Be as isConnectable,
  Rf as isDeletable,
  Gr as isDraggable,
  fs as isResizable,
  ei as isSelectable,
  Ge as matchesKey,
  mt as matchesModifier,
  Hy as orbit,
  Oy as pendulum,
  Ei as pointInPolygon,
  kf as polygonIntersectsAABB,
  hf as registerMarker,
  un as resolveChildValidation,
  Wf as resolveShortcuts,
  Mt as sortNodesTopological,
  Vy as stagger,
  yt as toAbsoluteNode,
  so as toAbsoluteNodes,
  ga as validateChildAdd,
  ro as validateChildRemove,
  Ry as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
