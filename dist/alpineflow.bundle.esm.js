let Oo = null;
function $a(t) {
  Oo = t;
}
function Ce() {
  if (!Oo)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return Oo;
}
var Da = { value: () => {
} };
function ho() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new On(n);
}
function On(t) {
  this._ = t;
}
function Ha(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
On.prototype = ho.prototype = {
  constructor: On,
  on: function(t, e) {
    var n = this._, o = Ha(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Ra(n[i], t.name))) return i;
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
function Ra(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function $i(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = Da, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var zo = "http://www.w3.org/1999/xhtml";
const Di = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: zo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function go(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Di.hasOwnProperty(e) ? { space: Di[e], local: t } : t;
}
function Fa(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === zo && e.documentElement.namespaceURI === zo ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Oa(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function nr(t) {
  var e = go(t);
  return (e.local ? Oa : Fa)(e);
}
function za() {
}
function ci(t) {
  return t == null ? za : function() {
    return this.querySelector(t);
  };
}
function Va(t) {
  typeof t != "function" && (t = ci(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = new Array(s), l, c, d = 0; d < s; ++d)
      (l = r[d]) && (c = t.call(l, l.__data__, d, r)) && ("__data__" in l && (c.__data__ = l.__data__), a[d] = c);
  return new Fe(o, this._parents);
}
function Ba(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function qa() {
  return [];
}
function or(t) {
  return t == null ? qa : function() {
    return this.querySelectorAll(t);
  };
}
function Ya(t) {
  return function() {
    return Ba(t.apply(this, arguments));
  };
}
function Xa(t) {
  typeof t == "function" ? t = Ya(t) : t = or(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && (o.push(t.call(l, l.__data__, c, s)), i.push(l));
  return new Fe(o, i);
}
function ir(t) {
  return function() {
    return this.matches(t);
  };
}
function sr(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Wa = Array.prototype.find;
function ja(t) {
  return function() {
    return Wa.call(this.children, t);
  };
}
function Ua() {
  return this.firstElementChild;
}
function Za(t) {
  return this.select(t == null ? Ua : ja(typeof t == "function" ? t : sr(t)));
}
var Ga = Array.prototype.filter;
function Ka() {
  return Array.from(this.children);
}
function Ja(t) {
  return function() {
    return Ga.call(this.children, t);
  };
}
function Qa(t) {
  return this.selectAll(t == null ? Ka : Ja(typeof t == "function" ? t : sr(t)));
}
function el(t) {
  typeof t != "function" && (t = ir(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new Fe(o, this._parents);
}
function rr(t) {
  return new Array(t.length);
}
function tl() {
  return new Fe(this._enter || this._groups.map(rr), this._parents);
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
function nl(t) {
  return function() {
    return t;
  };
}
function ol(t, e, n, o, i, r) {
  for (var s = 0, a, l = e.length, c = r.length; s < c; ++s)
    (a = e[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new Yn(t, r[s]);
  for (; s < l; ++s)
    (a = e[s]) && (i[s] = a);
}
function il(t, e, n, o, i, r, s) {
  var a, l, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (a = 0; a < d; ++a)
    (l = e[a]) && (f[a] = h = s.call(l, l.__data__, a, e) + "", c.has(h) ? i[a] = l : c.set(h, l));
  for (a = 0; a < u; ++a)
    h = s.call(t, r[a], a, r) + "", (l = c.get(h)) ? (o[a] = l, l.__data__ = r[a], c.delete(h)) : n[a] = new Yn(t, r[a]);
  for (a = 0; a < d; ++a)
    (l = e[a]) && c.get(f[a]) === l && (i[a] = l);
}
function sl(t) {
  return t.__data__;
}
function rl(t, e) {
  if (!arguments.length) return Array.from(this, sl);
  var n = e ? il : ol, o = this._parents, i = this._groups;
  typeof t != "function" && (t = nl(t));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = al(t.call(d, d && d.__data__, c, o)), g = h.length, p = a[c] = new Array(g), m = s[c] = new Array(g), y = l[c] = new Array(f);
    n(d, u, p, m, y, h, e);
    for (var x = 0, P = 0, b, _; x < g; ++x)
      if (b = p[x]) {
        for (x >= P && (P = x + 1); !(_ = m[P]) && ++P < g; ) ;
        b._next = _ || null;
      }
  }
  return s = new Fe(s, o), s._enter = a, s._exit = l, s;
}
function al(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ll() {
  return new Fe(this._exit || this._groups.map(rr), this._parents);
}
function cl(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function dl(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var c = n[l], d = o[l], u = c.length, f = a[l] = new Array(u), h, g = 0; g < u; ++g)
      (h = c[g] || d[g]) && (f[g] = h);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Fe(a, this._parents);
}
function ul() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function fl(t) {
  t || (t = hl);
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
function hl(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function gl() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function pl() {
  return Array.from(this);
}
function ml() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function yl() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function wl() {
  return !this.node();
}
function vl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && t.call(a, a.__data__, r, i);
  return this;
}
function _l(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function bl(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function xl(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function El(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function Cl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Sl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function kl(t, e) {
  var n = go(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? bl : _l : typeof e == "function" ? n.local ? Sl : Cl : n.local ? El : xl)(n, e));
}
function ar(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Ll(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Pl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Ml(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function Tl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Ll : typeof e == "function" ? Ml : Pl)(t, e, n ?? "")) : Vt(this.node(), t);
}
function Vt(t, e) {
  return t.style.getPropertyValue(e) || ar(t).getComputedStyle(t, null).getPropertyValue(e);
}
function Al(t) {
  return function() {
    delete this[t];
  };
}
function Nl(t, e) {
  return function() {
    this[t] = e;
  };
}
function Il(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function $l(t, e) {
  return arguments.length > 1 ? this.each((e == null ? Al : typeof e == "function" ? Il : Nl)(t, e)) : this.node()[t];
}
function lr(t) {
  return t.trim().split(/^|\s+/);
}
function di(t) {
  return t.classList || new cr(t);
}
function cr(t) {
  this._node = t, this._names = lr(t.getAttribute("class") || "");
}
cr.prototype = {
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
function dr(t, e) {
  for (var n = di(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function ur(t, e) {
  for (var n = di(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function Dl(t) {
  return function() {
    dr(this, t);
  };
}
function Hl(t) {
  return function() {
    ur(this, t);
  };
}
function Rl(t, e) {
  return function() {
    (e.apply(this, arguments) ? dr : ur)(this, t);
  };
}
function Fl(t, e) {
  var n = lr(t + "");
  if (arguments.length < 2) {
    for (var o = di(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Rl : e ? Dl : Hl)(n, e));
}
function Ol() {
  this.textContent = "";
}
function zl(t) {
  return function() {
    this.textContent = t;
  };
}
function Vl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Bl(t) {
  return arguments.length ? this.each(t == null ? Ol : (typeof t == "function" ? Vl : zl)(t)) : this.node().textContent;
}
function ql() {
  this.innerHTML = "";
}
function Yl(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Xl(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Wl(t) {
  return arguments.length ? this.each(t == null ? ql : (typeof t == "function" ? Xl : Yl)(t)) : this.node().innerHTML;
}
function jl() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ul() {
  return this.each(jl);
}
function Zl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Gl() {
  return this.each(Zl);
}
function Kl(t) {
  var e = typeof t == "function" ? t : nr(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Jl() {
  return null;
}
function Ql(t, e) {
  var n = typeof t == "function" ? t : nr(t), o = e == null ? Jl : typeof e == "function" ? e : ci(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function ec() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function tc() {
  return this.each(ec);
}
function nc() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function oc() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ic(t) {
  return this.select(t ? oc : nc);
}
function sc(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function rc(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function ac(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function lc(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function cc(t, e, n) {
  return function() {
    var o = this.__on, i, r = rc(e);
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
function dc(t, e, n) {
  var o = ac(t + ""), i, r = o.length, s;
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
  for (a = e ? cc : lc, i = 0; i < r; ++i) this.each(a(o[i], e, n));
  return this;
}
function fr(t, e, n) {
  var o = ar(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function uc(t, e) {
  return function() {
    return fr(this, t, e);
  };
}
function fc(t, e) {
  return function() {
    return fr(this, t, e.apply(this, arguments));
  };
}
function hc(t, e) {
  return this.each((typeof e == "function" ? fc : uc)(t, e));
}
function* gc() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var hr = [null];
function Fe(t, e) {
  this._groups = t, this._parents = e;
}
function xn() {
  return new Fe([[document.documentElement]], hr);
}
function pc() {
  return this;
}
Fe.prototype = xn.prototype = {
  constructor: Fe,
  select: Va,
  selectAll: Xa,
  selectChild: Za,
  selectChildren: Qa,
  filter: el,
  data: rl,
  enter: tl,
  exit: ll,
  join: cl,
  merge: dl,
  selection: pc,
  order: ul,
  sort: fl,
  call: gl,
  nodes: pl,
  node: ml,
  size: yl,
  empty: wl,
  each: vl,
  attr: kl,
  style: Tl,
  property: $l,
  classed: Fl,
  text: Bl,
  html: Wl,
  raise: Ul,
  lower: Gl,
  append: Kl,
  insert: Ql,
  remove: tc,
  clone: ic,
  datum: sc,
  on: dc,
  dispatch: hc,
  [Symbol.iterator]: gc
};
function Ye(t) {
  return typeof t == "string" ? new Fe([[document.querySelector(t)]], [document.documentElement]) : new Fe([[t]], hr);
}
function mc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Qe(t, e) {
  if (t = mc(t), e === void 0 && (e = t.currentTarget), e) {
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
const yc = { passive: !1 }, fn = { capture: !0, passive: !1 };
function xo(t) {
  t.stopImmediatePropagation();
}
function Rt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function gr(t) {
  var e = t.document.documentElement, n = Ye(t).on("dragstart.drag", Rt, fn);
  "onselectstart" in e ? n.on("selectstart.drag", Rt, fn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function pr(t, e) {
  var n = t.document.documentElement, o = Ye(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Rt, fn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Pn = (t) => () => t;
function Vo(t, {
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
Vo.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function wc(t) {
  return !t.ctrlKey && !t.button;
}
function vc() {
  return this.parentNode;
}
function _c(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function bc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function xc() {
  var t = wc, e = vc, n = _c, o = bc, i = {}, r = ho("start", "drag", "end"), s = 0, a, l, c, d, u = 0;
  function f(b) {
    b.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", y, yc).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, _) {
    if (!(d || !t.call(this, b, _))) {
      var E = P(this, e.call(this, b, _), b, _, "mouse");
      E && (Ye(b.view).on("mousemove.drag", g, fn).on("mouseup.drag", p, fn), gr(b.view), xo(b), c = !1, a = b.clientX, l = b.clientY, E("start", b));
    }
  }
  function g(b) {
    if (Rt(b), !c) {
      var _ = b.clientX - a, E = b.clientY - l;
      c = _ * _ + E * E > u;
    }
    i.mouse("drag", b);
  }
  function p(b) {
    Ye(b.view).on("mousemove.drag mouseup.drag", null), pr(b.view, c), Rt(b), i.mouse("end", b);
  }
  function m(b, _) {
    if (t.call(this, b, _)) {
      var E = b.changedTouches, S = e.call(this, b, _), A = E.length, $, M;
      for ($ = 0; $ < A; ++$)
        (M = P(this, S, b, _, E[$].identifier, E[$])) && (xo(b), M("start", b, E[$]));
    }
  }
  function y(b) {
    var _ = b.changedTouches, E = _.length, S, A;
    for (S = 0; S < E; ++S)
      (A = i[_[S].identifier]) && (Rt(b), A("drag", b, _[S]));
  }
  function x(b) {
    var _ = b.changedTouches, E = _.length, S, A;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), S = 0; S < E; ++S)
      (A = i[_[S].identifier]) && (xo(b), A("end", b, _[S]));
  }
  function P(b, _, E, S, A, $) {
    var M = r.copy(), T = Qe($ || E, _), k, v, w;
    if ((w = n.call(b, new Vo("beforestart", {
      sourceEvent: E,
      target: f,
      identifier: A,
      active: s,
      x: T[0],
      y: T[1],
      dx: 0,
      dy: 0,
      dispatch: M
    }), S)) != null)
      return k = w.x - T[0] || 0, v = w.y - T[1] || 0, function N(C, R, O) {
        var Y = T, D;
        switch (C) {
          case "start":
            i[A] = N, D = s++;
            break;
          case "end":
            delete i[A], --s;
          // falls through
          case "drag":
            T = Qe(O || R, _), D = s;
            break;
        }
        M.call(
          C,
          b,
          new Vo(C, {
            sourceEvent: R,
            subject: w,
            target: f,
            identifier: A,
            active: D,
            x: T[0] + k,
            y: T[1] + v,
            dx: T[0] - Y[0],
            dy: T[1] - Y[1],
            dispatch: M
          }),
          S
        );
      };
  }
  return f.filter = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : Pn(!!b), f) : t;
  }, f.container = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : Pn(b), f) : e;
  }, f.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : Pn(b), f) : n;
  }, f.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : Pn(!!b), f) : o;
  }, f.on = function() {
    var b = r.on.apply(r, arguments);
    return b === r ? f : b;
  }, f.clickDistance = function(b) {
    return arguments.length ? (u = (b = +b) * b, f) : Math.sqrt(u);
  }, f;
}
function ui(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function mr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function En() {
}
var hn = 0.7, Xn = 1 / hn, Ft = "\\s*([+-]?\\d+)\\s*", gn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ge = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Ec = /^#([0-9a-f]{3,8})$/, Cc = new RegExp(`^rgb\\(${Ft},${Ft},${Ft}\\)$`), Sc = new RegExp(`^rgb\\(${Ge},${Ge},${Ge}\\)$`), kc = new RegExp(`^rgba\\(${Ft},${Ft},${Ft},${gn}\\)$`), Lc = new RegExp(`^rgba\\(${Ge},${Ge},${Ge},${gn}\\)$`), Pc = new RegExp(`^hsl\\(${gn},${Ge},${Ge}\\)$`), Mc = new RegExp(`^hsla\\(${gn},${Ge},${Ge},${gn}\\)$`), Hi = {
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
ui(En, pn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ri,
  // Deprecated! Use color.formatHex.
  formatHex: Ri,
  formatHex8: Tc,
  formatHsl: Ac,
  formatRgb: Fi,
  toString: Fi
});
function Ri() {
  return this.rgb().formatHex();
}
function Tc() {
  return this.rgb().formatHex8();
}
function Ac() {
  return yr(this).formatHsl();
}
function Fi() {
  return this.rgb().formatRgb();
}
function pn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = Ec.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Oi(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? Mn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? Mn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = Cc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = Sc.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = kc.exec(t)) ? Mn(e[1], e[2], e[3], e[4]) : (e = Lc.exec(t)) ? Mn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = Pc.exec(t)) ? Bi(e[1], e[2] / 100, e[3] / 100, 1) : (e = Mc.exec(t)) ? Bi(e[1], e[2] / 100, e[3] / 100, e[4]) : Hi.hasOwnProperty(t) ? Oi(Hi[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function Oi(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function Mn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function Nc(t) {
  return t instanceof En || (t = pn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function Bo(t, e, n, o) {
  return arguments.length === 1 ? Nc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
ui(Ne, Bo, mr(En, {
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
    return new Ne(Ct(this.r), Ct(this.g), Ct(this.b), Wn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: zi,
  // Deprecated! Use color.formatHex.
  formatHex: zi,
  formatHex8: Ic,
  formatRgb: Vi,
  toString: Vi
}));
function zi() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}`;
}
function Ic() {
  return `#${Et(this.r)}${Et(this.g)}${Et(this.b)}${Et((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Vi() {
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
function Bi(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Xe(t, e, n, o);
}
function yr(t) {
  if (t instanceof Xe) return new Xe(t.h, t.s, t.l, t.opacity);
  if (t instanceof En || (t = pn(t)), !t) return new Xe();
  if (t instanceof Xe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (e === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - e) / a + 2 : s = (e - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new Xe(s, a, l, t.opacity);
}
function $c(t, e, n, o) {
  return arguments.length === 1 ? yr(t) : new Xe(t, e, n, o ?? 1);
}
function Xe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
ui(Xe, $c, mr(En, {
  brighter(t) {
    return t = t == null ? Xn : Math.pow(Xn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? hn : Math.pow(hn, t), new Xe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      Eo(t >= 240 ? t - 240 : t + 120, i, o),
      Eo(t, i, o),
      Eo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Xe(qi(this.h), Tn(this.s), Tn(this.l), Wn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Wn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${qi(this.h)}, ${Tn(this.s) * 100}%, ${Tn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function qi(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Tn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Eo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const wr = (t) => () => t;
function Dc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Hc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Rc(t) {
  return (t = +t) == 1 ? vr : function(e, n) {
    return n - e ? Hc(e, n, t) : wr(isNaN(e) ? n : e);
  };
}
function vr(t, e) {
  var n = e - t;
  return n ? Dc(t, n) : wr(isNaN(t) ? e : t);
}
const qo = (function t(e) {
  var n = Rc(e);
  function o(i, r) {
    var s = n((i = Bo(i)).r, (r = Bo(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), c = vr(i.opacity, r.opacity);
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
var Yo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Co = new RegExp(Yo.source, "g");
function Fc(t) {
  return function() {
    return t;
  };
}
function Oc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function zc(t, e) {
  var n = Yo.lastIndex = Co.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (t = t + "", e = e + ""; (o = Yo.exec(t)) && (i = Co.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: dt(o, i) })), n = Co.lastIndex;
  return n < e.length && (r = e.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Oc(l[0].x) : Fc(e) : (e = l.length, function(c) {
    for (var d = 0, u; d < e; ++d) a[(u = l[d]).i] = u.x(c);
    return a.join("");
  });
}
var Yi = 180 / Math.PI, Xo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function _r(t, e, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (l = t * n + e * o) && (n -= t * l, o -= e * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), t * o < e * n && (t = -t, e = -e, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Yi,
    skewX: Math.atan(l) * Yi,
    scaleX: s,
    scaleY: a
  };
}
var An;
function Vc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Xo : _r(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Bc(t) {
  return t == null || (An || (An = document.createElementNS("http://www.w3.org/2000/svg", "g")), An.setAttribute("transform", t), !(t = An.transform.baseVal.consolidate())) ? Xo : (t = t.matrix, _r(t.a, t.b, t.c, t.d, t.e, t.f));
}
function br(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push("translate(", null, e, null, n);
      g.push({ i: p - 4, x: dt(c, u) }, { i: p - 2, x: dt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: dt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function a(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: dt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function l(c, d, u, f, h, g) {
    if (c !== u || d !== f) {
      var p = h.push(i(h) + "scale(", null, ",", null, ")");
      g.push({ i: p - 4, x: dt(c, u) }, { i: p - 2, x: dt(d, f) });
    } else (u !== 1 || f !== 1) && h.push(i(h) + "scale(" + u + "," + f + ")");
  }
  return function(c, d) {
    var u = [], f = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, u, f), s(c.rotate, d.rotate, u, f), a(c.skewX, d.skewX, u, f), l(c.scaleX, c.scaleY, d.scaleX, d.scaleY, u, f), c = d = null, function(h) {
      for (var g = -1, p = f.length, m; ++g < p; ) u[(m = f[g]).i] = m.x(h);
      return u.join("");
    };
  };
}
var qc = br(Vc, "px, ", "px)", "deg)"), Yc = br(Bc, ", ", ")", ")"), Xc = 1e-12;
function Xi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Wc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function jc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Uc = (function t(e, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - a, g = u - l, p = h * h + g * g, m, y;
    if (p < Xc)
      y = Math.log(f / c) / e, m = function(S) {
        return [
          a + S * h,
          l + S * g,
          c * Math.exp(e * S * y)
        ];
      };
    else {
      var x = Math.sqrt(p), P = (f * f - c * c + o * p) / (2 * c * n * x), b = (f * f - c * c - o * p) / (2 * f * n * x), _ = Math.log(Math.sqrt(P * P + 1) - P), E = Math.log(Math.sqrt(b * b + 1) - b);
      y = (E - _) / e, m = function(S) {
        var A = S * y, $ = Xi(_), M = c / (n * x) * ($ * jc(e * A + _) - Wc(_));
        return [
          a + M * h,
          l + M * g,
          c * $ / Xi(e * A + _)
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
var Bt = 0, rn = 0, Qt = 0, xr = 1e3, jn, an, Un = 0, Lt = 0, po = 0, mn = typeof performance == "object" && performance.now ? performance : Date, Er = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function fi() {
  return Lt || (Er(Zc), Lt = mn.now() + po);
}
function Zc() {
  Lt = 0;
}
function Zn() {
  this._call = this._time = this._next = null;
}
Zn.prototype = Cr.prototype = {
  constructor: Zn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? fi() : +n) + (e == null ? 0 : +e), !this._next && an !== this && (an ? an._next = this : jn = this, an = this), this._call = t, this._time = n, Wo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Wo());
  }
};
function Cr(t, e, n) {
  var o = new Zn();
  return o.restart(t, e, n), o;
}
function Gc() {
  fi(), ++Bt;
  for (var t = jn, e; t; )
    (e = Lt - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Bt;
}
function Wi() {
  Lt = (Un = mn.now()) + po, Bt = rn = 0;
  try {
    Gc();
  } finally {
    Bt = 0, Jc(), Lt = 0;
  }
}
function Kc() {
  var t = mn.now(), e = t - Un;
  e > xr && (po -= e, Un = t);
}
function Jc() {
  for (var t, e = jn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : jn = n);
  an = t, Wo(o);
}
function Wo(t) {
  if (!Bt) {
    rn && (rn = clearTimeout(rn));
    var e = t - Lt;
    e > 24 ? (t < 1 / 0 && (rn = setTimeout(Wi, t - mn.now() - po)), Qt && (Qt = clearInterval(Qt))) : (Qt || (Un = mn.now(), Qt = setInterval(Kc, xr)), Bt = 1, Er(Wi));
  }
}
function ji(t, e, n) {
  var o = new Zn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Qc = ho("start", "end", "cancel", "interrupt"), ed = [], Sr = 0, Ui = 1, jo = 2, zn = 3, Zi = 4, Uo = 5, Vn = 6;
function mo(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  td(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Qc,
    tween: ed,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Sr
  });
}
function hi(t, e) {
  var n = je(t, e);
  if (n.state > Sr) throw new Error("too late; already scheduled");
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
function td(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = Cr(r, 0, n.time);
  function r(c) {
    n.state = Ui, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Ui) return l();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === zn) return ji(s);
        h.state === Zi ? (h.state = Vn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Vn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (ji(function() {
      n.state === zn && (n.state = Zi, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = jo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === jo) {
      for (n.state = zn, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function a(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(l), n.state = Uo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Uo && (n.on.call("end", t, t.__data__, n.index, n.group), l());
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
      i = o.state > jo && o.state < Uo, o.state = Vn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function nd(t) {
  return this.each(function() {
    Bn(this, t);
  });
}
function od(t, e) {
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
function id(t, e, n) {
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
function sd(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = je(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? od : id)(n, t, e));
}
function gi(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ke(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return je(i, o).value[e];
  };
}
function kr(t, e) {
  var n;
  return (typeof e == "number" ? dt : e instanceof pn ? qo : (n = pn(e)) ? (e = n, qo) : zc)(t, e);
}
function rd(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ad(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ld(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function cd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function dd(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function ud(t, e, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a)));
  };
}
function fd(t, e) {
  var n = go(t), o = n === "transform" ? Yc : kr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? ud : dd)(n, o, gi(this, "attr." + t, e)) : e == null ? (n.local ? ad : rd)(n) : (n.local ? cd : ld)(n, o, e));
}
function hd(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function gd(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function pd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && gd(t, r)), n;
  }
  return i._value = e, i;
}
function md(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && hd(t, r)), n;
  }
  return i._value = e, i;
}
function yd(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = go(t);
  return this.tween(n, (o.local ? pd : md)(o, e));
}
function wd(t, e) {
  return function() {
    hi(this, t).delay = +e.apply(this, arguments);
  };
}
function vd(t, e) {
  return e = +e, function() {
    hi(this, t).delay = e;
  };
}
function _d(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? wd : vd)(e, t)) : je(this.node(), e).delay;
}
function bd(t, e) {
  return function() {
    Ke(this, t).duration = +e.apply(this, arguments);
  };
}
function xd(t, e) {
  return e = +e, function() {
    Ke(this, t).duration = e;
  };
}
function Ed(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? bd : xd)(e, t)) : je(this.node(), e).duration;
}
function Cd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ke(this, t).ease = e;
  };
}
function Sd(t) {
  var e = this._id;
  return arguments.length ? this.each(Cd(e, t)) : je(this.node(), e).ease;
}
function kd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ke(this, t).ease = n;
  };
}
function Ld(t) {
  if (typeof t != "function") throw new Error();
  return this.each(kd(this._id, t));
}
function Pd(t) {
  typeof t != "function" && (t = ir(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, a = o[i] = [], l, c = 0; c < s; ++c)
      (l = r[c]) && t.call(l, l.__data__, c, r) && a.push(l);
  return new rt(o, this._parents, this._name, this._id);
}
function Md(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = e[a], c = n[a], d = l.length, u = s[a] = new Array(d), f, h = 0; h < d; ++h)
      (f = l[h] || c[h]) && (u[h] = f);
  for (; a < o; ++a)
    s[a] = e[a];
  return new rt(s, this._parents, this._name, this._id);
}
function Td(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Ad(t, e, n) {
  var o, i, r = Td(e) ? hi : Ke;
  return function() {
    var s = r(this, t), a = s.on;
    a !== o && (i = (o = a).copy()).on(e, n), s.on = i;
  };
}
function Nd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? je(this.node(), n).on.on(t) : this.each(Ad(n, t, e));
}
function Id(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function $d() {
  return this.on("end.remove", Id(this._id));
}
function Dd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ci(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, c = r[s] = new Array(l), d, u, f = 0; f < l; ++f)
      (d = a[f]) && (u = t.call(d, d.__data__, f, a)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, mo(c[f], e, n, f, c, je(d, n)));
  return new rt(r, this._parents, e, n);
}
function Hd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = or(t));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], c = l.length, d, u = 0; u < c; ++u)
      if (d = l[u]) {
        for (var f = t.call(d, d.__data__, u, l), h, g = je(d, n), p = 0, m = f.length; p < m; ++p)
          (h = f[p]) && mo(h, e, n, p, f, g);
        r.push(f), s.push(d);
      }
  return new rt(r, s, e, n);
}
var Rd = xn.prototype.constructor;
function Fd() {
  return new Rd(this._groups, this._parents);
}
function Od(t, e) {
  var n, o, i;
  return function() {
    var r = Vt(this, t), s = (this.style.removeProperty(t), Vt(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function Lr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function zd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Vt(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Vd(t, e, n) {
  var o, i, r;
  return function() {
    var s = Vt(this, t), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(t), Vt(this, t))), s === l ? null : s === o && l === i ? r : (i = l, r = e(o = s, a));
  };
}
function Bd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, a;
  return function() {
    var l = Ke(this, t), c = l.on, d = l.value[r] == null ? a || (a = Lr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), l.on = o;
  };
}
function qd(t, e, n) {
  var o = (t += "") == "transform" ? qc : kr;
  return e == null ? this.styleTween(t, Od(t, o)).on("end.style." + t, Lr(t)) : typeof e == "function" ? this.styleTween(t, Vd(t, o, gi(this, "style." + t, e))).each(Bd(this._id, t)) : this.styleTween(t, zd(t, o, e), n).on("end.style." + t, null);
}
function Yd(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Xd(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Yd(t, s, n)), o;
  }
  return r._value = e, r;
}
function Wd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Xd(t, e, n ?? ""));
}
function jd(t) {
  return function() {
    this.textContent = t;
  };
}
function Ud(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Zd(t) {
  return this.tween("text", typeof t == "function" ? Ud(gi(this, "text", t)) : jd(t == null ? "" : t + ""));
}
function Gd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Kd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Gd(i)), e;
  }
  return o._value = t, o;
}
function Jd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Kd(t));
}
function Qd() {
  for (var t = this._name, e = this._id, n = Pr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      if (l = s[c]) {
        var d = je(l, e);
        mo(l, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new rt(o, this._parents, t, n);
}
function eu() {
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
var tu = 0;
function rt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function Pr() {
  return ++tu;
}
var Je = xn.prototype;
rt.prototype = {
  constructor: rt,
  select: Dd,
  selectAll: Hd,
  selectChild: Je.selectChild,
  selectChildren: Je.selectChildren,
  filter: Pd,
  merge: Md,
  selection: Fd,
  transition: Qd,
  call: Je.call,
  nodes: Je.nodes,
  node: Je.node,
  size: Je.size,
  empty: Je.empty,
  each: Je.each,
  on: Nd,
  attr: fd,
  attrTween: yd,
  style: qd,
  styleTween: Wd,
  text: Zd,
  textTween: Jd,
  remove: $d,
  tween: sd,
  delay: _d,
  duration: Ed,
  ease: Sd,
  easeVarying: Ld,
  end: eu,
  [Symbol.iterator]: Je[Symbol.iterator]
};
const nu = (t) => +t;
function ou(t) {
  return t * t;
}
function iu(t) {
  return t * (2 - t);
}
function su(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function ru(t) {
  return t * t * t;
}
function au(t) {
  return --t * t * t + 1;
}
function Mr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Tr = Math.PI, Ar = Tr / 2;
function lu(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * Ar);
}
function cu(t) {
  return Math.sin(t * Ar);
}
function du(t) {
  return (1 - Math.cos(Tr * t)) / 2;
}
function vt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function uu(t) {
  return vt(1 - +t);
}
function fu(t) {
  return 1 - vt(t);
}
function hu(t) {
  return ((t *= 2) <= 1 ? vt(1 - t) : 2 - vt(t - 1)) / 2;
}
function gu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function pu(t) {
  return Math.sqrt(1 - --t * t);
}
function mu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Zo = 4 / 11, yu = 6 / 11, wu = 8 / 11, vu = 3 / 4, _u = 9 / 11, bu = 10 / 11, xu = 15 / 16, Eu = 21 / 22, Cu = 63 / 64, Nn = 1 / Zo / Zo;
function Su(t) {
  return 1 - Gn(1 - t);
}
function Gn(t) {
  return (t = +t) < Zo ? Nn * t * t : t < wu ? Nn * (t -= yu) * t + vu : t < bu ? Nn * (t -= _u) * t + xu : Nn * (t -= Eu) * t + Cu;
}
function ku(t) {
  return ((t *= 2) <= 1 ? 1 - Gn(1 - t) : Gn(t - 1) + 1) / 2;
}
var pi = 1.70158, Lu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(pi), Pu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(pi), Mu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(pi), qt = 2 * Math.PI, mi = 1, yi = 0.3, Tu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return e * vt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(mi, yi), Au = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return 1 - e * vt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(mi, yi), Nu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= qt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * vt(-r) * Math.sin((o - r) / n) : 2 - e * vt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * qt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(mi, yi), Iu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Mr
};
function $u(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Du(t) {
  var e, n;
  t instanceof rt ? (e = t._id, t = t._name) : (e = Pr(), (n = Iu).time = fi(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, c = 0; c < a; ++c)
      (l = s[c]) && mo(l, t, e, c, s, n || $u(l, e));
  return new rt(o, this._parents, t, e);
}
xn.prototype.interrupt = nd;
xn.prototype.transition = Du;
const In = (t) => () => t;
function Hu(t, {
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
function So(t) {
  t.stopImmediatePropagation();
}
function en(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Ru(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Fu() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function Gi() {
  return this.__zoom || Kn;
}
function Ou(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function zu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Vu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Bu() {
  var t = Ru, e = Fu, n = Vu, o = Ou, i = zu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Uc, c = ho("start", "zoom", "end"), d, u, f, h = 500, g = 150, p = 0, m = 10;
  function y(w) {
    w.property("__zoom", Gi).on("wheel.zoom", A, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", M).filter(i).on("touchstart.zoom", T).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", v).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(w, N, C, R) {
    var O = w.selection ? w.selection() : w;
    O.property("__zoom", Gi), w !== O ? _(w, N, C, R) : O.interrupt().each(function() {
      E(this, arguments).event(R).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, y.scaleBy = function(w, N, C, R) {
    y.scaleTo(w, function() {
      var O = this.__zoom.k, Y = typeof N == "function" ? N.apply(this, arguments) : N;
      return O * Y;
    }, C, R);
  }, y.scaleTo = function(w, N, C, R) {
    y.transform(w, function() {
      var O = e.apply(this, arguments), Y = this.__zoom, D = C == null ? b(O) : typeof C == "function" ? C.apply(this, arguments) : C, L = Y.invert(D), I = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(P(x(Y, I), D, L), O, s);
    }, C, R);
  }, y.translateBy = function(w, N, C, R) {
    y.transform(w, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof C == "function" ? C.apply(this, arguments) : C
      ), e.apply(this, arguments), s);
    }, null, R);
  }, y.translateTo = function(w, N, C, R, O) {
    y.transform(w, function() {
      var Y = e.apply(this, arguments), D = this.__zoom, L = R == null ? b(Y) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Kn.translate(L[0], L[1]).scale(D.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof C == "function" ? -C.apply(this, arguments) : -C
      ), Y, s);
    }, R, O);
  };
  function x(w, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === w.k ? w : new et(N, w.x, w.y);
  }
  function P(w, N, C) {
    var R = N[0] - C[0] * w.k, O = N[1] - C[1] * w.k;
    return R === w.x && O === w.y ? w : new et(w.k, R, O);
  }
  function b(w) {
    return [(+w[0][0] + +w[1][0]) / 2, (+w[0][1] + +w[1][1]) / 2];
  }
  function _(w, N, C, R) {
    w.on("start.zoom", function() {
      E(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      E(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var O = this, Y = arguments, D = E(O, Y).event(R), L = e.apply(O, Y), I = C == null ? b(L) : typeof C == "function" ? C.apply(O, Y) : C, F = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), K = O.__zoom, ne = typeof N == "function" ? N.apply(O, Y) : N, Z = l(K.invert(I).concat(F / K.k), ne.invert(I).concat(F / ne.k));
      return function(B) {
        if (B === 1) B = ne;
        else {
          var z = Z(B), q = F / z[2];
          B = new et(q, I[0] - z[0] * q, I[1] - z[1] * q);
        }
        D.zoom(null, B);
      };
    });
  }
  function E(w, N, C) {
    return !C && w.__zooming || new S(w, N);
  }
  function S(w, N) {
    this.that = w, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = e.apply(w, N), this.taps = 0;
  }
  S.prototype = {
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
        new Hu(w, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: c
        }),
        N
      );
    }
  };
  function A(w, ...N) {
    if (!t.apply(this, arguments)) return;
    var C = E(this, N).event(w), R = this.__zoom, O = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), Y = Qe(w);
    if (C.wheel)
      (C.mouse[0][0] !== Y[0] || C.mouse[0][1] !== Y[1]) && (C.mouse[1] = R.invert(C.mouse[0] = Y)), clearTimeout(C.wheel);
    else {
      if (R.k === O) return;
      C.mouse = [Y, R.invert(Y)], Bn(this), C.start();
    }
    en(w), C.wheel = setTimeout(D, g), C.zoom("mouse", n(P(x(R, O), C.mouse[0], C.mouse[1]), C.extent, s));
    function D() {
      C.wheel = null, C.end();
    }
  }
  function $(w, ...N) {
    if (f || !t.apply(this, arguments)) return;
    var C = w.currentTarget, R = E(this, N, !0).event(w), O = Ye(w.view).on("mousemove.zoom", I, !0).on("mouseup.zoom", F, !0), Y = Qe(w, C), D = w.clientX, L = w.clientY;
    gr(w.view), So(w), R.mouse = [Y, this.__zoom.invert(Y)], Bn(this), R.start();
    function I(K) {
      if (en(K), !R.moved) {
        var ne = K.clientX - D, Z = K.clientY - L;
        R.moved = ne * ne + Z * Z > p;
      }
      R.event(K).zoom("mouse", n(P(R.that.__zoom, R.mouse[0] = Qe(K, C), R.mouse[1]), R.extent, s));
    }
    function F(K) {
      O.on("mousemove.zoom mouseup.zoom", null), pr(K.view, R.moved), en(K), R.event(K).end();
    }
  }
  function M(w, ...N) {
    if (t.apply(this, arguments)) {
      var C = this.__zoom, R = Qe(w.changedTouches ? w.changedTouches[0] : w, this), O = C.invert(R), Y = C.k * (w.shiftKey ? 0.5 : 2), D = n(P(x(C, Y), R, O), e.apply(this, N), s);
      en(w), a > 0 ? Ye(this).transition().duration(a).call(_, D, R, w) : Ye(this).call(y.transform, D, R, w);
    }
  }
  function T(w, ...N) {
    if (t.apply(this, arguments)) {
      var C = w.touches, R = C.length, O = E(this, N, w.changedTouches.length === R).event(w), Y, D, L, I;
      for (So(w), D = 0; D < R; ++D)
        L = C[D], I = Qe(L, this), I = [I, this.__zoom.invert(I), L.identifier], O.touch0 ? !O.touch1 && O.touch0[2] !== I[2] && (O.touch1 = I, O.taps = 0) : (O.touch0 = I, Y = !0, O.taps = 1 + !!d);
      d && (d = clearTimeout(d)), Y && (O.taps < 2 && (u = I[0], d = setTimeout(function() {
        d = null;
      }, h)), Bn(this), O.start());
    }
  }
  function k(w, ...N) {
    if (this.__zooming) {
      var C = E(this, N).event(w), R = w.changedTouches, O = R.length, Y, D, L, I;
      for (en(w), Y = 0; Y < O; ++Y)
        D = R[Y], L = Qe(D, this), C.touch0 && C.touch0[2] === D.identifier ? C.touch0[0] = L : C.touch1 && C.touch1[2] === D.identifier && (C.touch1[0] = L);
      if (D = C.that.__zoom, C.touch1) {
        var F = C.touch0[0], K = C.touch0[1], ne = C.touch1[0], Z = C.touch1[1], B = (B = ne[0] - F[0]) * B + (B = ne[1] - F[1]) * B, z = (z = Z[0] - K[0]) * z + (z = Z[1] - K[1]) * z;
        D = x(D, Math.sqrt(B / z)), L = [(F[0] + ne[0]) / 2, (F[1] + ne[1]) / 2], I = [(K[0] + Z[0]) / 2, (K[1] + Z[1]) / 2];
      } else if (C.touch0) L = C.touch0[0], I = C.touch0[1];
      else return;
      C.zoom("touch", n(P(D, L, I), C.extent, s));
    }
  }
  function v(w, ...N) {
    if (this.__zooming) {
      var C = E(this, N).event(w), R = w.changedTouches, O = R.length, Y, D;
      for (So(w), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), Y = 0; Y < O; ++Y)
        D = R[Y], C.touch0 && C.touch0[2] === D.identifier ? delete C.touch0 : C.touch1 && C.touch1[2] === D.identifier && delete C.touch1;
      if (C.touch1 && !C.touch0 && (C.touch0 = C.touch1, delete C.touch1), C.touch0) C.touch0[1] = this.__zoom.invert(C.touch0[0]);
      else if (C.end(), C.taps === 2 && (D = Qe(D, this), Math.hypot(u[0] - D[0], u[1] - D[1]) < m)) {
        var L = Ye(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
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
    return arguments.length ? (p = (w = +w) * w, y) : Math.sqrt(p);
  }, y.tapDistance = function(w) {
    return arguments.length ? (m = +w, y) : m;
  }, y;
}
function Ki(t) {
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
function qu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, a = Ye(t);
  let l = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (S) => {
    c && S.code === c && (l = !0, t.style.cursor = "grab");
  }, u = (S) => {
    c && S.code === c && (l = !1, t.style.cursor = "");
  }, f = () => {
    l = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Bu().scaleExtent([o, i]).on("start", (S) => {
    if (!S.sourceEvent) return;
    l && (t.style.cursor = "grabbing");
    const { x: A, y: $, k: M } = S.transform;
    e.onMoveStart?.({ x: A, y: $, zoom: M });
  }).on("zoom", (S) => {
    const { x: A, y: $, k: M } = S.transform;
    n({ x: A, y: $, zoom: M }), S.sourceEvent && e.onMove?.({ x: A, y: $, zoom: M });
  }).on("end", (S) => {
    if (!S.sourceEvent) return;
    l && (t.style.cursor = "grab");
    const { x: A, y: $, k: M } = S.transform;
    e.onMoveEnd?.({ x: A, y: $, zoom: M });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Ki({
    pannable: r,
    zoomable: s,
    isLocked: e.isLocked,
    noPanClassName: e.noPanClassName,
    noWheelClassName: e.noWheelClassName,
    isTouchSelectionMode: e.isTouchSelectionMode,
    isPanKeyHeld: () => l,
    panOnDrag: e.panOnDrag
  })), a.call(h), e.zoomOnDoubleClick === !1 && a.on("dblclick.zoom", null);
  let g = e.panOnScroll ?? !1, p = e.panOnScrollDirection ?? "both", m = e.panOnScrollSpeed ?? 1, y = !1;
  const x = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, P = (S) => {
    x && S.code === x && (y = !0);
  }, b = (S) => {
    x && S.code === x && (y = !1);
  }, _ = () => {
    y = !1;
  };
  x && (window.addEventListener("keydown", P), window.addEventListener("keyup", b), window.addEventListener("blur", _));
  const E = (S) => {
    if (e.isLocked?.()) return;
    const A = S.ctrlKey || S.metaKey || y;
    if (!(g ? !A : S.shiftKey)) return;
    S.preventDefault(), S.stopPropagation();
    const M = m;
    let T = 0, k = 0;
    p !== "horizontal" && (k = -S.deltaY * M), p !== "vertical" && (T = -S.deltaX * M, S.shiftKey && S.deltaX === 0 && p === "both" && (T = -S.deltaY * M, k = 0)), e.onScrollPan?.(T, k);
  };
  return t.addEventListener("wheel", E, { passive: !1, capture: !0 }), {
    setViewport(S, A) {
      const $ = A?.duration ?? 0, M = Kn.translate(S.x ?? 0, S.y ?? 0).scale(S.zoom ?? 1);
      $ > 0 ? a.transition().duration($).call(h.transform, M) : a.call(h.transform, M);
    },
    getTransform() {
      return t.__zoom ?? Kn;
    },
    update(S) {
      if ((S.minZoom !== void 0 || S.maxZoom !== void 0) && h.scaleExtent([
        S.minZoom ?? o,
        S.maxZoom ?? i
      ]), S.pannable !== void 0 || S.zoomable !== void 0) {
        const A = S.pannable ?? r, $ = S.zoomable ?? s;
        h.filter(Ki({
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
      S.panOnScroll !== void 0 && (g = S.panOnScroll), S.panOnScrollDirection !== void 0 && (p = S.panOnScrollDirection), S.panOnScrollSpeed !== void 0 && (m = S.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", E, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), x && (window.removeEventListener("keydown", P), window.removeEventListener("keyup", b), window.removeEventListener("blur", _)), a.on(".zoom", null);
    }
  };
}
function Nr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Yu(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const we = 150, _e = 50;
function yo(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), a = Math.abs(Math.sin(r)), l = n * s + o * a, c = n * a + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - l / 2, y: u - c / 2, width: l, height: c };
}
function Yt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const a = s.dimensions?.width ?? we, l = s.dimensions?.height ?? _e, c = Zt(s, e), d = s.rotation ? yo(c.x, c.y, a, l, s.rotation) : { x: c.x, y: c.y, width: a, height: l };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Xu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? _e, l = Zt(r, n), c = r.rotation ? yo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Wu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? we, a = r.dimensions?.height ?? _e, l = Zt(r, n), c = r.rotation ? yo(l.x, l.y, s, a, r.rotation) : { x: l.x, y: l.y, width: s, height: a };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function Jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), a = Math.max(t.height, 1), l = s * (1 + r), c = a * (1 + r), d = e / l, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + a / 2 }, g = e / 2 - h.x * f, p = n / 2 - h.y * f;
  return { x: g, y: p, zoom: f };
}
function ju(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
class Uu {
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
function Zt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? we, i = t.dimensions?.height ?? _e;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let Ir = !1;
function $r(t) {
  Ir = t;
}
function V(t, e, n) {
  if (!Ir) return;
  const o = `%c[AlpineFlow:${t}]`, i = Zu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Zu(t) {
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
const yn = "#64748b", wi = "#d4d4d8", Dr = "#ef4444", Gu = "2", Ku = "6 3", Ji = 1.2, Go = 0.2, Qn = 5, Qi = 25;
class Ju {
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
const Qu = 16;
function ef() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Qu),
    cancel: (t) => clearTimeout(t)
  };
}
class Hr {
  constructor() {
    this._scheduler = ef(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const eo = new Hr(), tf = {
  linear: nu,
  easeIn: ou,
  easeOut: iu,
  easeInOut: su,
  easeCubicIn: ru,
  easeCubicOut: au,
  easeCubicInOut: Mr,
  easeCircIn: gu,
  easeCircOut: pu,
  easeCircInOut: mu,
  easeSinIn: lu,
  easeSinOut: cu,
  easeSinInOut: du,
  easeExpoIn: uu,
  easeExpoOut: fu,
  easeExpoInOut: hu,
  easeBounce: Gn,
  easeBounceIn: Su,
  easeBounceInOut: ku,
  easeElastic: Au,
  easeElasticIn: Tu,
  easeElasticInOut: Nu,
  easeBack: Mu,
  easeBackIn: Lu,
  easeBackOut: Pu
};
function Rr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function to(t) {
  return typeof t == "function" ? t : tf[t ?? "easeInOut"];
}
function it(t, e, n) {
  return t + (e - t) * n;
}
function vi(t, e, n) {
  return qo(t, e)(n);
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
const es = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, ts = /^(#|rgb|hsl)/;
function Fr(t, e, n) {
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
    const l = es.exec(s), c = es.exec(a);
    if (l && c) {
      const d = parseFloat(l[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = it(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (ts.test(s) && ts.test(a)) {
      o[r] = vi(s, a, n);
      continue;
    }
    o[r] = n < 0.5 ? s : a;
  }
  return o;
}
function nf(t, e, n, o) {
  let i = it(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: it(t.x, e.x, n),
    y: it(t.y, e.y, n),
    zoom: i
  };
}
class of {
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
class sf {
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
function Or(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? tn.stiffness, i = e.damping ?? tn.damping, r = e.mass ?? tn.mass, s = t.value - t.target, a = (-o * s - i * t.velocity) / r;
  t.velocity += a * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? tn.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? tn.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const ns = {
  timeConstant: 350,
  restVelocity: 0.5
};
function _i(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? ns.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < ns.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function bi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function zr(t, e, n, o) {
  if (n <= 0)
    return;
  _i(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? bi(o) : null;
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
function Vr(t, e, n, o) {
  const i = bi(o), r = e.values.map(
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
const os = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, is = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, ss = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Br(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return os[n] ? { ...os[n] } : null;
    case "decay":
      return is[n] ? { ...is[n] } : null;
    case "inertia":
      return ss[n] ? { ...ss[n] } : null;
    default:
      return null;
  }
}
function rs(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function rf(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? it(t, e, n) : rs(t) && rs(e) ? vi(t, e, n) : n < 0.5 ? t : e;
}
class af {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new of(), this._activeTransaction = null, this._engine = e;
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
    const e = new sf();
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
      maxDuration: m = 5e3
    } = n, y = to(i), x = p ? Br(p) : void 0;
    for (const w of e) {
      const N = this._ownership.get(w.key);
      if (N && !N.stopped) {
        const C = N.currentValues.get(w.key);
        C !== void 0 && (w.from = C), N.entries = N.entries.filter((R) => R.key !== w.key), N.entries.length === 0 && this._stop(N, "superseded");
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
      const C = [...u ? [u] : [], ...f ?? []], R = {
        _tags: C.length > 0 ? C : void 0,
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
    const P = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
    for (const w of e)
      P.set(w.key, w.from), b.set(w.key, w.to);
    let _;
    if (x) {
      _ = /* @__PURE__ */ new Map();
      for (const w of e) {
        if (typeof w.from != "number" || typeof w.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${w.key}" is non-numeric; snapping to target.`
          ), w.apply(w.to);
          continue;
        }
        let N = 0;
        if (x.type === "decay" || x.type === "inertia") {
          const C = x.velocity;
          if (typeof C == "number")
            N = C;
          else if (C && typeof C == "object") {
            const O = C, Y = bi(w.key);
            N = O[w.key] ?? (Y ? O[Y] ?? 0 : 0);
          }
          const R = x.power ?? 0.8;
          N *= R;
        }
        _.set(w.key, {
          value: w.from,
          velocity: N,
          target: w.to,
          settled: !1
        });
      }
      _.size === 0 && (_ = void 0);
    }
    const E = s === "ping-pong" ? "reverse" : s, S = a === "end" ? "backward" : "forward";
    let A;
    const $ = new Promise((w) => {
      A = w;
    }), M = {
      _id: this._nextGroupId++,
      entries: [...e],
      engineHandle: null,
      startTime: 0,
      pausedElapsed: null,
      _resumeNeeded: !1,
      direction: S,
      duration: o,
      easingFn: y,
      loop: E,
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
      snapshot: P,
      target: b,
      _currentFinished: $,
      whilePredicate: h,
      whileStopMode: g,
      motionConfig: _ ? x : void 0,
      physicsStates: _,
      maxDuration: m,
      isPhysics: !!_,
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
    const T = this._engine.register((w) => this._tick(M, w), r);
    M.engineHandle = T;
    const k = [...u ? [u] : [], ...f ?? []], v = {
      _tags: k.length > 0 ? k : void 0,
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
      const l = rf(a.from, a.to, s);
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
              Or(d, e.motionConfig, i);
              break;
            case "decay":
              _i(d, e.motionConfig, i);
              break;
            case "inertia":
              zr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Vr(d, e.motionConfig, h, c.key);
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
const qr = /* @__PURE__ */ new Map();
function lf(t, e) {
  qr.set(t, e);
}
function ko(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ot(t) {
  return typeof t == "string" ? { type: t } : t;
}
function zt(t, e) {
  return `${e}__${t.type}__${(t.color ?? wi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function no(t, e) {
  const n = ko(t.color ?? wi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, a = ko(t.orient ?? "auto-start-reverse"), l = ko(e);
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
  const c = qr.get(t.type);
  return c ? c({ id: l, color: n, width: r, height: s, orient: a }) : no({ ...t, type: "arrowclosed" }, e);
}
const _t = 200, bt = 150, cf = 1.2, nn = "http://www.w3.org/2000/svg";
function df(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, a = i.minimapNodeColor, l = document.createElement("div");
  l.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(nn, "svg");
  c.setAttribute("width", String(_t)), c.setAttribute("height", String(bt));
  const d = document.createElementNS(nn, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(_t)), d.setAttribute("height", String(bt));
  const u = document.createElementNS(nn, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(nn, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), l.appendChild(c), t.appendChild(l);
  let h = { x: 0, y: 0, width: 0, height: 0 }, g = 1;
  function p() {
    const T = n();
    if (h = Yt(T.nodes.filter((k) => !k.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      g = 1;
      return;
    }
    g = Math.max(
      h.width / _t,
      h.height / bt
    ) * cf;
  }
  function m(T) {
    return typeof a == "function" ? a(T) : a;
  }
  function y() {
    const T = n();
    p(), u.innerHTML = "";
    const k = (_t - h.width / g) / 2, v = (bt - h.height / g) / 2;
    for (const w of T.nodes) {
      if (w.hidden) continue;
      const N = document.createElementNS(nn, "rect"), C = (w.dimensions?.width ?? we) / g, R = (w.dimensions?.height ?? _e) / g, O = (w.position.x - h.x) / g + k, Y = (w.position.y - h.y) / g + v;
      N.setAttribute("x", String(O)), N.setAttribute("y", String(Y)), N.setAttribute("width", String(C)), N.setAttribute("height", String(R)), N.setAttribute("rx", "2");
      const D = m(w);
      D && (N.style.fill = D), u.appendChild(N);
    }
    x();
  }
  function x() {
    const T = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const k = (_t - h.width / g) / 2, v = (bt - h.height / g) / 2, w = (-T.viewport.x / T.viewport.zoom - h.x) / g + k, N = (-T.viewport.y / T.viewport.zoom - h.y) / g + v, C = T.containerWidth / T.viewport.zoom / g, R = T.containerHeight / T.viewport.zoom / g, O = `M0,0 H${_t} V${bt} H0 Z`, Y = `M${w},${N} h${C} v${R} h${-C} Z`;
    f.setAttribute("d", `${O} ${Y}`);
  }
  let P = !1;
  function b(T, k) {
    const v = (_t - h.width / g) / 2, w = (bt - h.height / g) / 2, N = (T - v) * g + h.x, C = (k - w) * g + h.y;
    return { x: N, y: C };
  }
  function _(T) {
    const k = c.getBoundingClientRect(), v = T.clientX - k.left, w = T.clientY - k.top, N = n(), C = b(v, w), R = -C.x * N.viewport.zoom + N.containerWidth / 2, O = -C.y * N.viewport.zoom + N.containerHeight / 2;
    o({ x: R, y: O, zoom: N.viewport.zoom });
  }
  function E(T) {
    i.minimapPannable && (P = !0, c.setPointerCapture(T.pointerId), _(T));
  }
  function S(T) {
    P && _(T);
  }
  function A(T) {
    P && (P = !1, c.releasePointerCapture(T.pointerId));
  }
  c.addEventListener("pointerdown", E), c.addEventListener("pointermove", S), c.addEventListener("pointerup", A);
  function $(T) {
    if (!i.minimapZoomable)
      return;
    T.preventDefault();
    const k = n(), v = i.minZoom ?? 0.5, w = i.maxZoom ?? 2, N = T.deltaY > 0 ? 0.9 : 1.1, C = Math.min(Math.max(k.viewport.zoom * N, v), w);
    o({ zoom: C });
  }
  c.addEventListener("wheel", $, { passive: !1 });
  function M() {
    c.removeEventListener("pointerdown", E), c.removeEventListener("pointermove", S), c.removeEventListener("pointerup", A), c.removeEventListener("wheel", $), l.remove();
  }
  return { render: y, updateViewport: x, destroy: M };
}
const uf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', ff = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', hf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', as = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', gf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', pf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ls = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', mf = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function yf(t, e) {
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
  } = e, p = document.createElement("div"), m = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  l ? m.push("flow-controls-external") : m.push(`flow-controls-${n}`), p.className = m.join(" "), p.setAttribute("role", "toolbar"), p.setAttribute("aria-label", "Flow controls");
  let y = null, x = null;
  if (i) {
    const _ = Tt(uf, "Zoom in", c), E = Tt(ff, "Zoom out", d);
    p.appendChild(_), p.appendChild(E);
  }
  if (r) {
    const _ = Tt(hf, "Fit view", u);
    p.appendChild(_);
  }
  if (s && (y = Tt(as, "Toggle interactivity", f), p.appendChild(y)), a) {
    const _ = Tt(pf, "Reset panels", h);
    p.appendChild(_);
  }
  g && (x = Tt(ls, "Toggle fullscreen", g), x.classList.add("flow-controls-button-fullscreen"), p.appendChild(x)), p.addEventListener("mousedown", (_) => _.stopPropagation()), p.addEventListener("pointerdown", (_) => _.stopPropagation()), p.addEventListener("wheel", (_) => _.stopPropagation(), { passive: !1 }), t.appendChild(p);
  function P(_) {
    if (y && typeof _.isInteractive == "boolean") {
      Ko(y, _.isInteractive ? as : gf);
      const E = _.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      y.title = E, y.setAttribute("aria-label", E);
    }
    if (x && typeof _.isFullscreen == "boolean") {
      Ko(x, _.isFullscreen ? mf : ls);
      const E = _.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      x.title = E, x.setAttribute("aria-label", E), x.classList.toggle("flow-controls-button-fullscreen--active", _.isFullscreen);
    }
  }
  function b() {
    p.remove();
  }
  return { update: P, destroy: b };
}
function Tt(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Ko(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Ko(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const cs = 5;
function wf(t) {
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
    const g = Math.min(o, r), p = Math.min(i, s), m = Math.abs(r - o), y = Math.abs(s - i);
    e.style.left = `${g}px`, e.style.top = `${p}px`, e.style.width = `${m}px`, e.style.height = `${y}px`;
  }
  function c(f) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), g = Math.abs(s - i);
    if (h < cs && g < cs)
      return null;
    const p = Math.min(o, r), m = Math.min(i, s), y = (p - f.x) / f.zoom, x = (m - f.y) / f.zoom, P = h / f.zoom, b = g / f.zoom;
    return { x: y, y: x, width: P, height: b };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: a, update: l, end: c, isActive: d, destroy: u };
}
const ds = 3;
function vf(t) {
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
    h * h + g * g < ds * ds || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((p) => `${p.x},${p.y}`).join(" ")));
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
function xi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, a = n[i].y, l = n[r].x, c = n[r].y;
    a > e != c > e && t < (l - s) * (e - a) / (c - a) + s && (o = !o);
  }
  return o;
}
function _f(t, e, n, o, i, r, s, a) {
  const l = n - t, c = o - e, d = s - i, u = a - r, f = l * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, g = r - e, p = (h * u - g * d) / f, m = (h * c - g * l) / f;
  return p >= 0 && p <= 1 && m >= 0 && m <= 1;
}
function bf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, a = o + e.height / 2;
  if (xi(s, a, t)) return !0;
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
      if (_f(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, g))
        return !0;
  return !1;
}
function Yr(t) {
  const e = t.dimensions?.width ?? we, n = t.dimensions?.height ?? _e;
  return t.rotation ? yo(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function xf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Yr(n);
    return bf(e, o);
  });
}
function Ef(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Yr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => xi(r.x, r.y, e));
  });
}
function Cf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Jo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function Sf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function kf(t, e, n) {
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
function Lf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function Pf(t, e, n) {
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
  ) || n?.preventCycles && kf(t.source, t.target, e));
}
const We = "_flowHandleValidate";
function Mf(t) {
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
function Tf(t) {
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
function Af(t) {
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
function Xr(t) {
  return Cn(t, t.draggable);
}
function Nf(t) {
  return Cn(t, t.deletable);
}
function Be(t) {
  return Cn(t, t.connectable);
}
function Qo(t) {
  return Cn(t, t.selectable);
}
function us(t) {
  return Cn(t, t.resizable);
}
function Xt(t, e, n, o, i, r, s) {
  const a = n - t, l = o - e, c = i - n, d = r - o;
  if (a === 0 && c === 0 || l === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(a * a + l * l), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), g = n - a / u * h, p = o - l / u * h, m = n + c / f * h, y = o + d / f * h;
  return `L${g},${p} Q${n},${o} ${m},${y}`;
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
function $n(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function If({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const a = n === "left" || n === "right", l = r === "left" || r === "right", c = a ? t + (n === "right" ? 1 : -1) * $n(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = a ? e : e + (n === "bottom" ? 1 : -1) * $n(
    n === "bottom" ? i - e : e - i,
    s
  ), u = l ? o + (r === "right" ? 1 : -1) * $n(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = l ? i : i + (r === "bottom" ? 1 : -1) * $n(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function oo(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, a, l] = If(t), c = `M${e},${n} C${r},${s} ${a},${l} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = Sn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function ky({
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
function fs(t) {
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
function $f(t, e, n, o, i, r, s) {
  const a = fs(n), l = fs(r), c = t + a.x * s, d = e + a.y * s, u = o + l.x * s, f = i + l.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const p = (c + u) / 2, m = (d + f) / 2;
    return h ? [
      [c, e],
      [p, e],
      [p, i],
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
  const l = $f(
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
    const [p, m] = l[g];
    if (s > 0 && g > 0 && g < l.length - 1) {
      const [y, x] = g === 1 ? [t, e] : l[g - 1], [P, b] = l[g + 1];
      c += ` ${Xt(y, x, p, m, P, b, s)}`;
    } else
      c += ` L${p},${m}`;
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
function Df(t) {
  return vn({ ...t, borderRadius: 0 });
}
function Wr({
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
function Hf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, a = n.right - t, l = e - n.top, c = n.bottom - e;
  return s < at && s >= 0 ? i = -o * (1 - s / at) : a < at && a >= 0 && (i = o * (1 - a / at)), l < at && l >= 0 ? r = -o * (1 - l / at) : c < at && c >= 0 && (r = o * (1 - c / at)), { dx: i, dy: r };
}
function jr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, a = !1;
  function l() {
    if (!a)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = Hf(r, s, c, n);
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
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Dr : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || yn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Gu),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Ku
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
        g = oo({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        g = vn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        g = Df({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        g = Wr({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
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
function wo(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = jr({
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
function Rf(t, e, n, o) {
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
function Ur(t, e) {
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
      connectableStart: l[Pt] !== !1,
      connectableEnd: l[st] !== !1,
      hasValidator: l[We] != null,
      limit: l[ut] ?? null
    };
    n.push(g);
    const p = `${d}|${g.handleId}|${f}`, m = o.get(p);
    (!m || m.isMirror && !g.isMirror) && o.set(p, g);
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
    Ff(t, e, n, o, i);
    return;
  }
  const s = Rf(o, e, n, i), a = r.get(e, n, "source"), l = a?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= a.limit, c = [];
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
    let m = p;
    m && a?.hasValidator && (m = !!a.el[We](u)), m && g.hasValidator && (m = !!g.el[We](u));
    const y = m && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: y, limitHit: h && !p });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function Ff(t, e, n, o, i) {
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
    }, h = o.getNode(c)?.connectable !== !1 && pt(u, r, { preventCycles: o._config?.preventCycles }), g = h && nt(t, u, r);
    g && tt(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (a.classList.add("flow-handle-valid"), a.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (a.classList.add("flow-handle-invalid"), a.classList.remove("flow-handle-valid"), h && !g ? a.classList.add("flow-handle-limit-reached") : a.classList.remove("flow-handle-limit-reached"));
  }
}
function ke(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function St(t, e) {
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
async function vo(t, e, n, o, i, r) {
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
async function Zr(t) {
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
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = _o(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await vo(
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
async function Gr(t) {
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
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = _o(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await vo(
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
function _o(t, e) {
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
function Kr(t, e, n) {
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
    const T = t.closest(".flow-container");
    T && ke(T);
  }
  let d = null, u = null, f = null, h = null, g = null;
  const p = e._config?.connectionSnapRadius ?? 20, m = t.closest(".flow-container");
  let y = null, x = 0, P = 0, b = !1, _ = /* @__PURE__ */ new Map();
  const E = () => {
    if (c = !0, V("connection", `Connection drag started from node "${r}" handle "${o}"`), e._emit("connect-start", { source: r, sourceHandle: o }), !m) return;
    u = Wt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: m
    }), d = u.svg;
    const T = t.getBoundingClientRect(), k = m.getBoundingClientRect(), v = e._viewportLive ?? e.viewport, w = v?.zoom || 1, N = v?.x || 0, C = v?.y || 0;
    x = (T.left + T.width / 2 - k.left - N) / w, P = (T.top + T.height / 2 - k.top - C) / w, u.update({ fromX: x, fromY: P, toX: x, toY: P, source: r, sourceHandle: o });
    const R = m.querySelector(".flow-viewport");
    if (R && R.appendChild(d), e.pendingConnection = {
      source: r,
      sourceHandle: o,
      position: { x, y: P }
    }, h = wo(m, e, a, l), y = Ur(
      m,
      (O, Y) => e.screenToFlowPosition(O, Y)
    ), bn(m, r, o, e, void 0, y), e._config?.onEdgeDrop) {
      const O = e._config.edgeDropPreview, D = O ? O({ source: r, sourceHandle: o }) : "New Node";
      if (D !== null) {
        g = document.createElement("div"), g.className = "flow-ghost-node";
        const L = document.createElement("div");
        if (L.className = "flow-ghost-handle", g.appendChild(L), typeof D == "string") {
          const F = document.createElement("span");
          F.textContent = D, g.appendChild(F);
        } else
          g.appendChild(D);
        g.style.left = `${x}px`, g.style.top = `${P}px`;
        const I = m.querySelector(".flow-viewport");
        I && I.appendChild(g);
      }
    }
  }, S = () => {
    const T = [...e.selectedNodes], k = [], v = m.getBoundingClientRect(), w = e._viewportLive ?? e.viewport, N = w?.zoom || 1, C = w?.x || 0, R = w?.y || 0;
    for (const O of T) {
      if (O === r) continue;
      const D = m?.querySelector(`[data-flow-node-id="${CSS.escape(O)}"]`)?.querySelector('[data-flow-handle-type="source"]');
      if (!D) continue;
      const L = D.getBoundingClientRect();
      k.push({
        nodeId: O,
        handleId: D.dataset.flowHandleId ?? "source",
        pos: {
          x: (L.left + L.width / 2 - v.left - C) / N,
          y: (L.top + L.height / 2 - v.top - R) / N
        }
      });
    }
    return k;
  }, A = (T) => {
    b = !0, u && (_.set(r, {
      line: u,
      sourceNodeId: r,
      sourceHandleId: o,
      sourcePos: { x, y: P },
      valid: !0
    }), u = null);
    const k = S(), v = m.querySelector(".flow-viewport");
    for (const w of k) {
      const N = Wt({
        connectionLineType: e._config?.connectionLineType,
        connectionLineStyle: e._config?.connectionLineStyle,
        connectionLine: e._config?.connectionLine,
        containerEl: m
      });
      N.update({
        fromX: w.pos.x,
        fromY: w.pos.y,
        toX: T.x,
        toY: T.y,
        source: w.nodeId,
        sourceHandle: w.handleId
      }), v && v.appendChild(N.svg), _.set(w.nodeId, {
        line: N,
        sourceNodeId: w.nodeId,
        sourceHandleId: w.handleId,
        sourcePos: w.pos,
        valid: !0
      });
    }
  }, $ = (T) => {
    if (!c) {
      const w = T.clientX - a, N = T.clientY - l;
      if (Math.abs(w) >= Qn || Math.abs(N) >= Qn) {
        if (E(), e._config?.multiConnect && e.selectedNodes.size > 1 && e.selectedNodes.has(r)) {
          const C = e.screenToFlowPosition(T.clientX, T.clientY);
          A(C);
        }
      } else
        return;
    }
    const k = e.screenToFlowPosition(T.clientX, T.clientY);
    if (b) {
      const w = _n({
        containerEl: m,
        handleType: "target",
        excludeNodeId: r,
        cursorFlowPos: k,
        connectionSnapRadius: p,
        getNode: (Y) => e.getNode(Y),
        toFlowPosition: (Y, D) => e.screenToFlowPosition(Y, D),
        connectionMode: e._config?.connectionMode,
        index: y ?? void 0
      });
      w.element !== f && (f?.classList.remove("flow-handle-active"), w.element?.classList.add("flow-handle-active"), f = w.element);
      const C = w.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, R = w.element?.dataset.flowHandleId ?? "target", O = e._config?.connectionLineStyle?.stroke ?? (getComputedStyle(m).getPropertyValue("--flow-edge-stroke-selected").trim() || yn);
      for (const Y of _.values())
        if (Y.line.update({
          fromX: Y.sourcePos.x,
          fromY: Y.sourcePos.y,
          toX: w.position.x,
          toY: w.position.y,
          source: Y.sourceNodeId,
          sourceHandle: Y.sourceHandleId
        }), w.element && C) {
          const D = {
            source: Y.sourceNodeId,
            sourceHandle: Y.sourceHandleId,
            target: C,
            targetHandle: R
          }, Z = e.getNode(C)?.connectable !== !1 && Y.sourceNodeId !== C && pt(D, e.edges, { preventCycles: e._config?.preventCycles }) && gt(D, e._config?.connectionRules, e._nodeMap) && nt(m, D, e.edges) && tt(m, D) && (!e._config?.isValidConnection || e._config.isValidConnection(D));
          Y.valid = Z;
          const B = Y.line.svg.querySelector("path");
          if (B)
            if (Z)
              B.setAttribute("stroke", O);
            else {
              const z = getComputedStyle(m).getPropertyValue("--flow-connection-line-invalid").trim() || Dr;
              B.setAttribute("stroke", z);
            }
        } else {
          Y.valid = !0;
          const D = Y.line.svg.querySelector("path");
          D && D.setAttribute("stroke", O);
        }
      e.pendingConnection = { ...e.pendingConnection, position: w.position }, h?.updatePointer(T.clientX, T.clientY);
      return;
    }
    const v = _n({
      containerEl: m,
      handleType: "target",
      excludeNodeId: r,
      cursorFlowPos: k,
      connectionSnapRadius: p,
      getNode: (w) => e.getNode(w),
      toFlowPosition: (w, N) => e.screenToFlowPosition(w, N),
      index: y ?? void 0
    });
    v.element !== f && (f?.classList.remove("flow-handle-active"), v.element?.classList.add("flow-handle-active"), f = v.element), g ? v.element ? (g.style.display = "none", u?.update({ fromX: x, fromY: P, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o })) : (g.style.display = "", g.style.left = `${k.x}px`, g.style.top = `${k.y}px`, u?.update({ fromX: x, fromY: P, toX: k.x, toY: k.y, source: r, sourceHandle: o })) : u?.update({ fromX: x, fromY: P, toX: v.position.x, toY: v.position.y, source: r, sourceHandle: o }), e.pendingConnection = { ...e.pendingConnection, position: v.position }, h?.updatePointer(T.clientX, T.clientY);
  }, M = async (T) => {
    if (h?.stop(), h = null, document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), ft.delete(t), y = null, e._connectValidating) return;
    if (b) {
      const N = e.screenToFlowPosition(T.clientX, T.clientY);
      let C = f;
      C || (C = document.elementFromPoint(T.clientX, T.clientY)?.closest('[data-flow-handle-type="target"]'));
      const O = C?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, Y = C?.dataset.flowHandleId ?? "target", D = [], L = [], I = [], F = [];
      if (C && O) {
        const K = e.getNode(O);
        for (const ne of _.values()) {
          const Z = {
            source: ne.sourceNodeId,
            sourceHandle: ne.sourceHandleId,
            target: O,
            targetHandle: Y
          };
          if (K?.connectable !== !1 && ne.sourceNodeId !== O && pt(Z, e.edges, { preventCycles: e._config?.preventCycles }) && gt(Z, e._config?.connectionRules, e._nodeMap) && nt(m, Z, e.edges) && tt(m, Z) && (!e._config?.isValidConnection || e._config.isValidConnection(Z))) {
            const H = `e-${ne.sourceNodeId}-${O}-${Date.now()}-${dn++}`;
            D.push({ id: H, ...Z }), L.push(Z), F.push(ne);
          } else
            I.push(ne);
        }
      } else
        I.push(..._.values());
      for (const K of F)
        K.line.destroy();
      if (D.length > 0) {
        e.addEdges(D);
        for (const K of L)
          e._emit("connect", { connection: K });
        e._emit("multi-connect", { connections: L });
      }
      I.length > 0 && setTimeout(() => {
        for (const K of I)
          K.line.destroy();
      }, 100), f?.classList.remove("flow-handle-active"), e._emit("connect-end", {
        connection: L.length > 0 ? L[0] : null,
        source: r,
        sourceHandle: o,
        position: N
      }), _.clear(), b = !1, ke(m), e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
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
    const k = u?.svg ?? null;
    g?.remove(), g = null, f?.classList.remove("flow-handle-active"), ke(m);
    const v = e.screenToFlowPosition(T.clientX, T.clientY), w = { source: r, sourceHandle: o, position: v };
    try {
      let N = f;
      if (N || (N = document.elementFromPoint(T.clientX, T.clientY)?.closest('[data-flow-handle-type="target"]')), N) {
        const R = N.closest("[x-flow-node]")?.dataset.flowNodeId, O = N.dataset.flowHandleId ?? "target";
        if (R) {
          if (N[st] === !1) {
            V("connection", "Connection rejected (handle not connectable end)"), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
            return;
          }
          const Y = e.getNode(R);
          if (Y && !Be(Y)) {
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
              const F = e._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: K, targetEl: ne } = _o(m, D);
              e._connectValidating = !0, St(k, !0);
              let Z;
              try {
                Z = await vo(
                  L,
                  D,
                  K,
                  ne,
                  m,
                  F
                );
              } finally {
                e._connectValidating = !1, St(k, !1);
              }
              if (!Z.allowed) {
                V("connection", "Connection rejected (async connectValidator)", { connection: D, reason: Z.reason }), Ae(m, { ...D, reason: Z.reason }), e._emit("connect-end", { connection: null, ...w }), e.pendingConnection = null;
                return;
              }
            }
            const I = `e-${r}-${R}-${Date.now()}-${dn++}`;
            e.addEdges({ id: I, ...D }), V("connection", `Connection created: ${r} → ${R}`, D), e._emit("connect", { connection: D }), e._emit("connect-end", { connection: D, ...w });
          } else
            V("connection", "Connection rejected (invalid)", D), Ae(m, D), e._emit("connect-end", { connection: null, ...w });
        } else
          e._emit("connect-end", { connection: null, ...w });
      } else if (e._config?.onEdgeDrop) {
        const C = {
          x: v.x - we / 2,
          y: v.y - _e / 2
        }, R = e._config.onEdgeDrop({
          source: r,
          sourceHandle: o,
          position: C
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
            const Y = `e-${r}-${R.id}-${Date.now()}-${dn++}`;
            e.addEdges({ id: Y, ...O }), V("connection", `Edge drop: created node "${R.id}" and edge`, O), e._emit("connect", { connection: O }), e._emit("connect-end", { connection: O, ...w });
          } else
            V("connection", "Edge drop: connection rejected by validator"), e._emit("connect-end", { connection: null, ...w });
        } else
          V("connection", "Edge drop: callback returned null"), e._emit("connect-end", { connection: null, ...w });
      } else
        V("connection", "Connection cancelled (no target)"), e._emit("connect-end", { connection: null, ...w });
    } finally {
      St(k, !1), u?.destroy(), u = null;
    }
    e.pendingConnection = null;
  };
  document.addEventListener("pointermove", $), document.addEventListener("pointerup", M), document.addEventListener("pointercancel", M), ft.set(t, () => {
    document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", M), document.removeEventListener("pointercancel", M), h?.stop(), u?.destroy(), u = null, g?.remove(), g = null;
    for (const T of _.values())
      T.line.destroy();
    _.clear(), b = !1, f?.classList.remove("flow-handle-active"), ke(m), y = null, e.pendingConnection = null, e._container?.classList.remove("flow-connecting");
  });
}
function Jr(t, e, n) {
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
  const m = p.querySelector(
    `[data-flow-node-id="${CSS.escape(a.source)}"]`
  ), y = a.sourceHandle ? `[data-flow-handle-id="${CSS.escape(a.sourceHandle)}"]` : '[data-flow-handle-type="source"]', x = m?.querySelector(y), P = p.getBoundingClientRect(), b = e._viewportLive ?? e.viewport, _ = b?.zoom || 1, E = b?.x || 0, S = b?.y || 0;
  let A, $;
  if (x) {
    const D = x.getBoundingClientRect();
    A = (D.left + D.width / 2 - P.left - E) / _, $ = (D.top + D.height / 2 - P.top - S) / _;
  } else {
    const D = e.getNode(a.source);
    if (!D) return;
    const L = D.dimensions?.width ?? we, I = D.dimensions?.height ?? _e;
    A = D.position.x + L / 2, $ = D.position.y + I;
  }
  let M = null, T = null, k = null, v = c, w = d, N = null;
  const C = () => {
    u = !0;
    const D = p.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.add("flow-edge-reconnecting"), e._emit("reconnect-start", { edge: a, handleType: "target" }), V("reconnect", `Reconnection drag started from target handle on edge "${a.id}"`), T = Wt({
      connectionLineType: e._config?.connectionLineType,
      connectionLineStyle: e._config?.connectionLineStyle,
      connectionLine: e._config?.connectionLine,
      containerEl: p
    }), M = T.svg;
    const L = e.screenToFlowPosition(c, d);
    T.update({
      fromX: A,
      fromY: $,
      toX: L.x,
      toY: L.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    });
    const I = p.querySelector(".flow-viewport");
    I && I.appendChild(M), e.pendingConnection = {
      source: a.source,
      sourceHandle: a.sourceHandle,
      position: L
    }, e._pendingReconnection = {
      edge: a,
      draggedEnd: "target",
      anchorPosition: { x: A, y: $ },
      position: L
    }, k = wo(p, e, v, w), N = Ur(
      p,
      (F, K) => e.screenToFlowPosition(F, K)
    ), bn(p, a.source, a.sourceHandle ?? "source", e, a.id, N);
  }, R = (D) => {
    if (v = D.clientX, w = D.clientY, !u) {
      Math.sqrt(
        (D.clientX - c) ** 2 + (D.clientY - d) ** 2
      ) >= Qn && C();
      return;
    }
    const L = e.screenToFlowPosition(D.clientX, D.clientY), I = _n({
      containerEl: p,
      handleType: "target",
      excludeNodeId: a.source,
      cursorFlowPos: L,
      connectionSnapRadius: g,
      getNode: (F) => e.getNode(F),
      toFlowPosition: (F, K) => e.screenToFlowPosition(F, K),
      index: N ?? void 0
    });
    I.element !== h && (h?.classList.remove("flow-handle-active"), I.element?.classList.add("flow-handle-active"), h = I.element), T?.update({
      fromX: A,
      fromY: $,
      toX: I.position.x,
      toY: I.position.y,
      source: a.source,
      sourceHandle: a.sourceHandle
    }), e.pendingConnection && (e.pendingConnection = {
      ...e.pendingConnection,
      position: I.position
    }), e._pendingReconnection && (e._pendingReconnection = {
      ...e._pendingReconnection,
      position: I.position
    }), k?.updatePointer(D.clientX, D.clientY);
  }, O = () => {
    if (f) return;
    f = !0, document.removeEventListener("pointermove", R), document.removeEventListener("pointerup", Y), document.removeEventListener("pointercancel", Y), k?.stop(), k = null, T?.destroy(), T = null, M = null, N = null, h?.classList.remove("flow-handle-active"), ft.delete(t);
    const D = p.querySelector(
      `[data-flow-edge-id="${a.id}"]`
    );
    D && D.classList.remove("flow-edge-reconnecting"), ke(p), e.pendingConnection = null, e._pendingReconnection = null;
  }, Y = async (D) => {
    if (!u) {
      O();
      return;
    }
    if (e._connectValidating) return;
    let L = h;
    L || (L = document.elementFromPoint(D.clientX, D.clientY)?.closest('[data-flow-handle-type="target"]'));
    let I = !1;
    if (L) {
      const K = L.closest("[x-flow-node]")?.dataset.flowNodeId, ne = L.dataset.flowHandleId;
      if (K && e.getNode(K)?.connectable !== !1) {
        const B = {
          source: a.source,
          sourceHandle: a.sourceHandle,
          target: K,
          targetHandle: ne
        }, z = { ...a }, q = T?.svg ?? null;
        St(q, !0);
        let X;
        try {
          X = await Zr({
            edge: a,
            newConnection: B,
            canvas: e,
            containerEl: p,
            endpoint: "target"
          });
        } finally {
          St(q, !1);
        }
        X.applied ? (I = !0, V("reconnect", `Edge "${a.id}" reconnected (target)`, B), e._emit("reconnect", { oldEdge: z, newConnection: B })) : V("reconnect", "Reconnection rejected", { connection: B, reason: X.reason });
      }
    }
    I || V("reconnect", `Edge "${a.id}" reconnection cancelled — snapping back`), e._emit("reconnect-end", { edge: a, successful: I }), O();
  };
  document.addEventListener("pointermove", R), document.addEventListener("pointerup", Y), document.addEventListener("pointercancel", Y), ft.set(t, O);
}
function Of(t, e, n) {
  t.dataset.flowHandleType === "source" ? Kr(t, e, n) : Jr(t, e, n);
}
function hs(t) {
  return t?._config?.delegatedHandleEvents === !1;
}
function zf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let g;
      c && u ? g = "top-left" : c && f ? g = "top-right" : d && u ? g = "bottom-left" : d && f ? g = "bottom-right" : c ? g = "top" : f ? g = "right" : d ? g = "bottom" : u ? g = "left" : g = e.getAttribute("data-flow-handle-position") ?? (l === "source" ? "bottom" : "top");
      let p, m = !1;
      if (i) {
        const _ = r(i);
        _ && typeof _ == "object" && !Array.isArray(_) ? (p = _.id || e.getAttribute("data-flow-handle-id") || l, _.position && (g = _.position, m = !0)) : p = _ || e.getAttribute("data-flow-handle-id") || l;
      } else
        p = e.getAttribute("data-flow-handle-id") || l;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = l, e.dataset.flowHandlePosition = g, e.dataset.flowHandleId = p, h && (e.dataset.flowHandleExplicit = "true"), m && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const _ = r(i);
        _ && typeof _ == "object" && !Array.isArray(_) && _.position && (e.dataset.flowHandlePosition = _.position);
      })), !h && !m) {
        const _ = () => {
          const S = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!S) return;
          const A = e.closest("[x-data]");
          return A ? t.$data(A)?.getNode?.(S) : void 0;
        };
        s(() => {
          const E = _();
          if (!E) return;
          const S = l === "source" ? E.sourcePosition : E.targetPosition;
          S && (e.dataset.flowHandlePosition = S);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${l}`);
      const y = () => {
        const _ = e.closest("[x-flow-node]");
        return _ ? _.getAttribute("data-flow-node-id") ?? null : null;
      }, x = () => {
        const _ = e.closest("[x-data]");
        return _ ? t.$data(_) : null;
      }, P = x();
      let b = null;
      if (P?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${l} handle ${p}`);
        const _ = (A) => {
          const $ = A?._pendingKeyboardConnect;
          if (!$) return;
          const M = e.closest(".flow-container");
          M && M.querySelector(
            `[data-flow-node-id="${CSS.escape($.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape($.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), A && (A._pendingKeyboardConnect = null);
        }, E = (A) => {
          if (!(A.key === "Enter" || A.key === " " || A.key === "Spacebar")) return;
          const M = x();
          if (!M || M._animationLocked) return;
          const T = y();
          if (T)
            if (l === "source") {
              const k = M.getNode?.(T);
              if (k && !Be(k) || e[Pt] === !1) return;
              A.preventDefault(), A.stopPropagation(), _(M), M._pendingKeyboardConnect = {
                sourceNodeId: T,
                sourceHandleId: p
              }, e.classList.add("flow-handle-connect-pending"), M._announcer?.announce?.(`Connecting from ${l} handle ${p}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!M._pendingKeyboardConnect) return;
              const k = M.getNode?.(T);
              if (k && !Be(k) || e[st] === !1) return;
              A.preventDefault(), A.stopPropagation();
              const { sourceNodeId: v, sourceHandleId: w } = M._pendingKeyboardConnect, N = {
                source: v,
                sourceHandle: w,
                target: T,
                targetHandle: p
              }, C = e.closest(".flow-container");
              if (_(M), !C) return;
              Gr({ connection: N, canvas: M, containerEl: C }).then((R) => {
                R.applied && M._announcer?.announce?.(`Connected ${v} to ${T}.`);
              });
            }
        };
        e.addEventListener("keydown", E);
        const S = e.closest(".flow-container");
        if (S) {
          const A = Dn.get(S);
          if (A)
            A.count += 1;
          else {
            const $ = (M) => {
              if (M.key !== "Escape") return;
              const T = S.matches("[x-data]") ? S : S.closest("[x-data]") ?? S.querySelector("[x-data]");
              if (!T) return;
              const k = t.$data(T);
              k?._pendingKeyboardConnect && _(k);
            };
            S.addEventListener("keydown", $), Dn.set(S, { count: 1, handler: $ });
          }
        }
        b = () => {
          if (e.removeEventListener("keydown", E), S) {
            const A = Dn.get(S);
            A && (A.count -= 1, A.count <= 0 && (S.removeEventListener("keydown", A.handler), Dn.delete(S)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (l === "source") {
        const _ = (A) => {
          Kr(e, x(), A);
        };
        hs(P) && e.addEventListener("pointerdown", _);
        const E = () => {
          const A = x();
          if (!A?._pendingReconnection || A._pendingReconnection.draggedEnd !== "source") return;
          const $ = y();
          if ($) {
            const M = A.getNode($);
            if (M && !Be(M)) return;
          }
          e[Pt] !== !1 && e.classList.add("flow-handle-active");
        }, S = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", E), e.addEventListener("pointerleave", S), a(() => {
          ft.get(e)?.(), ft.delete(e), b?.(), e.removeEventListener("pointerdown", _), e.removeEventListener("pointerenter", E), e.removeEventListener("pointerleave", S), e.classList.remove("flow-handle", `flow-handle-${l}`);
        });
      } else {
        const _ = () => {
          const $ = x();
          if (!$?.pendingConnection) return;
          const M = y();
          if (M) {
            const T = $.getNode(M);
            if (T && !Be(T)) return;
          }
          e[st] !== !1 && e.classList.add("flow-handle-active");
        }, E = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", _), e.addEventListener("pointerleave", E);
        const S = async ($) => {
          const M = x();
          if (!M?.pendingConnection || M._config?.connectOnClick === !1 || M._connectValidating) return;
          $.preventDefault(), $.stopPropagation();
          const T = y();
          if (!T) return;
          if (e[st] === !1) {
            V("connection", "Click-to-connect rejected (handle not connectable end)"), M._emit("connect-end", { connection: null, source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
            const C = e.closest(".flow-container");
            C && ke(C);
            return;
          }
          const k = M.getNode(T);
          if (k && !Be(k)) {
            V("connection", `Click-to-connect rejected (target "${T}" not connectable)`), M._emit("connect-end", { connection: null, source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
            const C = e.closest(".flow-container");
            C && ke(C);
            return;
          }
          const v = {
            source: M.pendingConnection.source,
            sourceHandle: M.pendingConnection.sourceHandle,
            target: T,
            targetHandle: p
          }, w = { source: M.pendingConnection.source, sourceHandle: M.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (pt(v, M.edges, { preventCycles: M._config?.preventCycles })) {
            const C = e.closest(".flow-container");
            if (!gt(v, M._config?.connectionRules, M._nodeMap)) {
              V("connection", "Click-to-connect rejected (connection rules)", v), Ae(C, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), C && ke(C);
              return;
            }
            if (C && !nt(C, v, M.edges)) {
              V("connection", "Click-to-connect rejected (handle limit)", v), Ae(C, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), ke(C);
              return;
            }
            if (C && !tt(C, v)) {
              V("connection", "Click-to-connect rejected (per-handle validator)", v), Ae(C, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), C && ke(C);
              return;
            }
            if (M._config?.isValidConnection && !M._config.isValidConnection(v)) {
              V("connection", "Click-to-connect rejected (custom validator)", v), Ae(C, v), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), C && ke(C);
              return;
            }
            const R = M._config?.connectValidator;
            if (R && C) {
              const Y = M._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: D, targetEl: L } = _o(C, v);
              M._connectValidating = !0;
              let I;
              try {
                I = await vo(
                  R,
                  v,
                  D,
                  L,
                  C,
                  Y
                );
              } finally {
                M._connectValidating = !1;
              }
              if (!I.allowed) {
                V("connection", "Click-to-connect rejected (async connectValidator)", { connection: v, reason: I.reason }), Ae(C, { ...v, reason: I.reason }), M._emit("connect-end", { connection: null, ...w }), M.pendingConnection = null, M._container?.classList.remove("flow-connecting"), ke(C);
                return;
              }
            }
            const O = `e-${v.source}-${v.target}-${Date.now()}-${dn++}`;
            M.addEdges({ id: O, ...v }), V("connection", `Click-to-connect: ${v.source} → ${v.target}`, v), M._emit("connect", { connection: v }), M._emit("connect-end", { connection: v, ...w });
          } else {
            V("connection", "Click-to-connect rejected (invalid)", v);
            const C = e.closest(".flow-container");
            Ae(C, v), M._emit("connect-end", { connection: null, ...w });
          }
          M.pendingConnection = null, M._container?.classList.remove("flow-connecting");
          const N = e.closest(".flow-container");
          N && ke(N);
        };
        e.addEventListener("click", S);
        const A = ($) => {
          Jr(e, x(), $);
        };
        hs(P) && e.addEventListener("pointerdown", A), a(() => {
          ft.get(e)?.(), ft.delete(e), b?.(), e.removeEventListener("pointerdown", A), e.removeEventListener("pointerenter", _), e.removeEventListener("pointerleave", E), e.removeEventListener("click", S), e.classList.remove("flow-handle", `flow-handle-${l}`, "flow-handle-active");
        });
      }
    }
  );
}
function gs(t, e) {
  const n = (o) => {
    const r = o.target?.closest?.("[data-flow-handle-type]");
    r && t.contains(r) && (e?._container && r.closest(".flow-container") !== e._container || Of(r, e, o));
  };
  return t.addEventListener("pointerdown", n, !0), () => t.removeEventListener("pointerdown", n, !0);
}
const ps = {
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
function Vf(t) {
  if (!t) return { ...ps };
  const e = { ...ps };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Ze(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function Bf(t, e, n, o) {
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
function qf(t, e, n = {}) {
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
const ei = 20, Hn = ei + 1;
function ms(t) {
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
function ys(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Yf(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Qr(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > a && i < l)
      return !0;
  }
  return !1;
}
function ea(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const a = s.x, l = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > a && t < l && r > c && i < d)
      return !0;
  }
  return !1;
}
function Xf(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const a = Array.from(r).sort((u, f) => u - f), l = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of a)
    for (const f of l) {
      let h = !1;
      for (const g of i)
        if (Yf(u, f, g)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class Wf {
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
function jf(t, e) {
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
      ea(a.x, a.y, l.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, a) => s.x - a.x);
    for (let s = 1; s < r.length; s++) {
      const a = r[s - 1], l = r[s];
      Qr(a.x, l.x, a.y, e) || (n[a.index].push(l.index), n[l.index].push(a.index));
    }
  }
  return n;
}
function Uf(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), a = new Uint8Array(i), l = jf(n, o);
  r[t.index] = 0;
  const c = new Wf(r);
  for (c.push(t.index); c.size > 0; ) {
    const f = c.pop();
    if (a[f]) continue;
    if (a[f] = 1, f === e.index) break;
    const h = n[f], g = r[f];
    for (const p of l[f]) {
      if (a[p]) continue;
      const m = n[p], y = Math.abs(m.x - h.x) + Math.abs(m.y - h.y), x = g + y;
      x < r[p] && (r[p] = x, s[p] = f, c.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const d = [];
  let u = e.index;
  for (; u !== -1; )
    d.unshift(n[u]), u = s[u];
  return d;
}
function Zf(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, a = o.y === r.y && r.y === i.y;
    !s && !a && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function Gf(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    e > 0 ? n += ` ${Xt(r.x, r.y, s.x, s.y, a.x, a.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function Kf(t) {
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
function Jf(t, e, n, o, i) {
  const r = Math.min(t, n) - ht, s = Math.max(t, n) + ht, a = Math.min(e, o) - ht, l = Math.max(e, o) + ht;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < l && c.y + c.height > a
  );
}
function Qf(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (ea(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Qr(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function eh(t, e, n, o, i, r, s) {
  const a = ms(n), l = ms(r), c = t + a.x * Hn, d = e + a.y * Hn, u = o + l.x * Hn, f = i + l.y * Hn, h = (x) => {
    const P = x.map(($) => ys($, ei)), b = Xf(c, d, u, f, P);
    b.length;
    const _ = b.find(($) => $.x === c && $.y === d), E = b.find(($) => $.x === u && $.y === f);
    _ || b.push({ x: c, y: d, index: b.length }), E || b.push({ x: u, y: f, index: b.length });
    const S = _ ?? b[b.length - (E ? 1 : 2)], A = E ?? b[b.length - 1];
    return Uf(S, A, b, P);
  }, g = Jf(t, e, o, i, s), p = g.length < s.length;
  let m = h(g);
  if (p) {
    const x = s.map((b) => ys(b, ei));
    (!(m !== null && m.length >= 2) || Qf(m, x)) && (m = h(s));
  }
  if (!m || m.length < 2) return null;
  const y = [
    { x: t, y: e, index: -1 },
    ...m,
    { x: o, y: i, index: -2 }
  ];
  return Zf(y);
}
const th = 512, lt = /* @__PURE__ */ new Map();
function nh(t, e, n, o, i, r, s) {
  let a = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const l of s)
    a += `|${Math.round(l.x)},${Math.round(l.y)},${Math.round(l.width)},${Math.round(l.height)}`;
  return a;
}
function ta(t, e, n, o, i, r, s) {
  const a = nh(t, e, n, o, i, r, s);
  if (lt.has(a)) {
    const c = lt.get(a);
    return lt.delete(a), lt.set(a, c), c;
  }
  const l = eh(t, e, n, o, i, r, s);
  return lt.set(a, l), lt.size > th && lt.delete(lt.keys().next().value), l;
}
function oh({
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
  const l = ta(t, e, n, o, i, r, s);
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
  const c = Gf(l, a), { x: d, y: u, offsetX: f, offsetY: h } = Kf(l);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
const ws = 20;
function na(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function ih(t, e) {
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
function ti(t, e, n) {
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
function kt(t, e, n) {
  if (!t.parentId)
    return t;
  const o = ti(t, e, n);
  return { ...t, position: o };
}
function io(t, e, n) {
  return t.map((o) => kt(o, e, n));
}
function yt(t, e) {
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
  const e = na(t), n = [], o = /* @__PURE__ */ new Set();
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
function oa(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? oa(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function ia(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function Lo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Rn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: we, height: _e };
  return ia(t, o, i);
}
function sh(t, e, n) {
  const o = t.x + e.width + ws, i = t.y + e.height + ws, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function vs(t, e, n) {
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
function rh(t, e, n) {
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
function ah(t, e, n) {
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
function lh(t, e, n) {
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
function ch(t, e, n) {
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
function dh(t, e, n) {
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
function uh(t, e, n) {
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
function fh(t, e, n) {
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
const sa = {
  circle: { perimeterPoint: rh },
  diamond: { perimeterPoint: ah },
  hexagon: { perimeterPoint: lh },
  parallelogram: { perimeterPoint: ch },
  triangle: { perimeterPoint: dh },
  cylinder: { perimeterPoint: uh },
  stadium: { perimeterPoint: fh }
};
function ra(t, e = "light") {
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
const Po = "__alpineflow_collab_store__";
function hh() {
  return typeof globalThis < "u" ? (globalThis[Po] || (globalThis[Po] = /* @__PURE__ */ new WeakMap()), globalThis[Po]) : /* @__PURE__ */ new WeakMap();
}
const He = hh(), Mo = "__alpineflow_registry__";
function aa() {
  return typeof globalThis < "u" ? (globalThis[Mo] || (globalThis[Mo] = /* @__PURE__ */ new Map()), globalThis[Mo]) : /* @__PURE__ */ new Map();
}
function Dt(t) {
  return aa().get(t);
}
function gh(t, e) {
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
const ph = 1e3;
class mh {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? gh, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, ph);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class yh {
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
        const p = h.sourceHandle ?? "default", m = h.targetHandle ?? "default";
        p in g && (d[m] = g[p]);
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
const wh = {
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
}, vh = {
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
}, _h = {
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
}, _s = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function bh(t, e) {
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
    const r = _s[o.style] ?? _s.info, s = o.duration ?? 1500, a = Math.floor(s * 0.6), l = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
function xh(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const Eh = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Ch = 150;
function Sh(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function kh(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = xh(o), s = t[r], a = (l) => {
      let c;
      typeof s == "function" && (c = s(l));
      const d = wh[o], u = d ? d(l) : [l], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = Eh.has(o) ? Sh(a, Ch) : a;
  }
}
function Lh(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(vh)) {
    const r = e.on(o, (s) => {
      const a = t[i];
      if (typeof a != "function") return;
      const l = _h[o], c = l ? l(s) : Object.values(s);
      a.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Ph = 5;
function Mh(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const a = /* @__PURE__ */ new Set();
  function l() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Ph && !o.has(c) && (o.add(c), console.warn(
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
function Th(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Ah(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function un(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function la(t, e, n, o) {
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
function so(t, e, n, o) {
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
function bs(t, e, n) {
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
  const n = Zt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function ca(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Nh(t, e, n = !0) {
  const o = jt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = jt(i);
    return n ? ca(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function Ih(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = jt(t), i = jt(e);
  return n ? ca(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function $h(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const a of o) {
    const l = r + e, c = s + n, d = a.x + a.width, u = a.y + a.height;
    if (r < d + i && l > a.x - i && s < u + i && c > a.y - i) {
      const f = l - (a.x - i), h = d + i - r, g = c - (a.y - i), p = u + i - s, m = Math.min(f, h, g, p);
      m === f ? r -= f : m === h ? r += h : m === g ? s -= g : s += p;
    }
  }
  return { x: r, y: s };
}
function Dh(t) {
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
                  (p) => p.parentId === d.parentId
                ),
                ...r.filter(
                  (p) => p.parentId === d.parentId
                )
              ], g = la(f, d, h, u);
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
          (y) => y.parentId === f.parentId
        ), m = so(g, f, p, h);
        m.valid || (o.add(u), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: g,
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
        for (const f of yt(u, t.nodes))
          n.add(f);
      V("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = Pf(n, t.nodes, t.edges));
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
      return Jo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return Sf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return Cf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return Lf(e, n, t.edges, o);
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
      return o ? Nh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : Ih(i, r, o);
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
function Hh(t) {
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
        return gt(a, o, t._nodeMap);
      });
      if (i.length === 0) return;
      t._captureHistory(), V("edge", `Adding ${i.length} edge(s)`, i.map((s) => s.id)), t.edges.push(...i), t._rebuildEdgeMap(), t._emit("edges-change", { type: "add", edges: i });
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
      V("edge", `Removing ${n.size} edge(s)`, [...n]);
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
function Rh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Nr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Yu(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Yt(io(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n?.padding ?? Go
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Yt(io(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n ?? Go
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Ji, o);
      V("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Ji, o);
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
let xt = null;
const Fh = 20;
function ni(t) {
  return JSON.parse(JSON.stringify(t));
}
function xs(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function da(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return xt = {
    nodes: ni(n),
    edges: ni(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function Oh() {
  if (!xt || xt.nodes.length === 0) return null;
  xt.pasteCount++;
  const t = xt.pasteCount * Fh, e = /* @__PURE__ */ new Map(), n = xt.nodes.map((i) => {
    const r = xs(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: ni(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = xt.edges.map((i) => ({
    ...i,
    id: xs(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function zh(t, e) {
  const n = da(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function Vh(t) {
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
        return c ? Nf(c) : !1;
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
        ), f = so(d, l, u, c);
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
      const e = da(t.nodes, t.edges);
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
      const e = Oh();
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
      const e = zh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), V("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function Bh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function ro(t, e, n = {}) {
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
      l === "id" || l === "__proto__" || l === "constructor" || l === "prototype" || Bh(a[l], c) || (a[l] = c);
    r.push(a);
  }
  return r;
}
function Es(t, e, n) {
  const o = ro(t.nodes, Mt(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = ro(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++, t._commitNodeGeometry?.();
  }), V("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function qh(t) {
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
        ), o = ro(t.nodes, n);
        t.nodes.splice(0, t.nodes.length, ...o);
      }
      if (e.edges) {
        const n = JSON.parse(JSON.stringify(e.edges)), o = ro(t.edges, n);
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
      e && Es(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && Es(t, e, "redo");
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
function Yh(t, e) {
  return t * (1 - e);
}
function Xh(t, e) {
  return t * e;
}
function Wh(t, e) {
  return e === "in" ? t : 1 - t;
}
function jh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? Yh(o, e) : Xh(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function Uh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function Zh(t, e, n) {
  t.style.opacity = String(Wh(e, n));
}
function Gh(t) {
  t.style.removeProperty("opacity");
}
const ot = Math.PI * 2, on = /* @__PURE__ */ new Map(), Kh = 64;
function Ei(t) {
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
  if (on.size >= Kh) {
    const r = on.keys().next().value;
    r !== void 0 && on.delete(r);
  }
  return on.set(t, i), i;
}
function Ly(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, a = i ? 1 : -1;
  return (l) => ({
    x: e + r * Math.cos(ot * l * a + o * ot),
    y: n + s * Math.sin(ot * l * a + o * ot)
  });
}
function Py(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: a = 0 } = t, l = o - e, c = i - n, d = Math.sqrt(l * l + c * c), u = d > 0 ? l / d : 1, h = -(d > 0 ? c / d : 0), g = u;
  return (p) => {
    const m = e + l * p, y = n + c * p, x = r * Math.sin(ot * s * p + a * ot);
    return { x: m + h * x, y: y + g * x };
  };
}
function My(t, e) {
  const n = Ei(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (a) => {
    let l = i + a * s;
    return o && (l = r - a * s), n(l);
  };
}
function Ty(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (a) => {
    const l = s * Math.sin(ot * a + r * ot);
    return {
      x: e + o * Math.sin(l),
      y: n + o * Math.cos(l)
    };
  };
}
function Ay(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, a = 1.3 + r % 11 * 0.2, l = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * ot, f = (Math.sin(s * u) + Math.sin(a * u * 1.3)) / 2, h = (Math.sin(l * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function Ny(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let Cs = !1;
function ve(t) {
  try {
    return structuredClone(t);
  } catch {
    return Cs || (Cs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function Jh(t) {
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
function Qh(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function eg(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = ve(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class Ci {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Hr();
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
    const o = new Ci(this._canvas, this._engine);
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
    return Rr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, Jh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, Qh(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && eg(o, n);
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
    const g = this._resolveFollowPath(e), p = this._createGuidePath(e), m = !!(e.viewport || e.fitView || e.panTo);
    let y = null, x = null;
    m && this._canvas.viewport && (y = { ...this._canvas.viewport }, x = this._resolveTargetViewport(e));
    const P = e.edgeTransition ?? "none", b = e.addEdges?.map((A) => A.id) ?? [], _ = e.removeEdges?.filter((A) => this._canvas.getEdge(A)).slice() ?? [], E = {
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
      viewportFrom: y,
      viewportTarget: x,
      transition: P,
      addEdgeIds: b,
      removeEdgeIds: _
    };
    if (i === 0)
      return this._executeInstantStep(E);
    const S = this._prepareAnimatedEdges(e, P, b);
    return S && await S, g ? this._executeFollowPathStep(E) : this._executeAnimatedStep(E);
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
    const n = Ei(e.followPath);
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
      addEdgeIds: m,
      removeEdgeIds: y,
      guidePathEl: x
    } = e, P = e.resolvedPathFn;
    return new Promise((b) => {
      const _ = this._engine.register((E) => {
        if (this._state === "stopped")
          return b(), !0;
        const S = Math.min(E / i, 1), A = s(S);
        if (a) {
          const $ = P(A);
          for (const M of a) {
            const T = this._canvas.getNode(M);
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
        ), this._tickEdgeTransitions(p, m, y, A), n.onProgress?.(S, o), S >= 1 ? (this._cleanupEdgeTransitions(p, m, y), y.length && this._removeEdges(y), this._applyStepInstant(n), x && n.guidePath?.autoRemove !== !1 && x.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), b(), !0) : !1;
      }, r);
      this._activeHandles.push(_);
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
        const h = this._canvas.getNode(f), g = s.get(f);
        h && g && (h.style = Fr(g, u, n));
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
        f && (h !== void 0 && typeof h == "string" ? f.color = vi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = nf(c, d, n, {
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
      ), m = Object.keys(p.nodes || {}).length > 0 || Object.keys(p.edges || {}).length > 0 || p.viewport;
      if (!m && !u.length && !f.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
        return;
      }
      if (m) {
        const y = this._canvas.animate(p, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (x) => {
            if (this._state === "stopped") {
              y.stop(), g();
              return;
            }
            this._tickEdgeTransitions(d, u, f, x), n.onProgress?.(x, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, u, f), f.length && this._removeEdges(f), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), g();
          }
        });
        this._activeHandles.push({ stop: () => y.stop() });
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
      r && jh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && Uh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && Zh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && Gh(o);
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
const ua = /* @__PURE__ */ new Map();
function Gt(t, e) {
  ua.set(t, e);
}
function tg(t) {
  return ua.get(t);
}
const Re = "http://www.w3.org/2000/svg", ng = {
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
}, og = {
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
let ig = 0;
const sg = {
  create(t, e) {
    const n = document.createElementNS(Re, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++ig}`, e.class)
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
          const m = document.createElementNS(Re, "defs");
          u = document.createElementNS(Re, "linearGradient"), u.setAttribute("id", a), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const y of s) {
            const x = document.createElementNS(Re, "stop");
            x.setAttribute("offset", String(y.offset)), x.setAttribute("stop-color", y.color), y.opacity !== void 0 && x.setAttribute("stop-opacity", String(y.opacity)), u.appendChild(x);
          }
          m.appendChild(u), n.appendChild(m), p = `url(#${a})`, n.__gradient = u;
        }
        d = document.createElementNS(Re, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = p, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, g = o - h;
      if (d.setAttribute("stroke-dashoffset", String(g)), u) {
        const p = Math.max(0, Math.min(e.pathLength, h)), m = Math.max(0, Math.min(e.pathLength, h - o)), y = e.pathEl.getPointAtLength(p), x = e.pathEl.getPointAtLength(m);
        u.setAttribute("x1", String(x.x)), u.setAttribute("y1", String(x.y)), u.setAttribute("x2", String(y.x)), u.setAttribute("y2", String(y.y));
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
}, rg = {
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
}, ag = {
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
Gt("circle", ng);
Gt("orb", og);
Gt("beam", sg);
Gt("pulse", rg);
Gt("image", ag);
let Ss = !1;
function lg(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function ks(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : lg(o);
}
function cg(t) {
  function e(o, i, r = {}, s = {}) {
    const a = r.renderer ?? "circle", l = tg(a);
    if (!l) {
      V("particle", `_fireParticleOnPath: unknown renderer "${a}"`);
      return;
    }
    a === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !Ss && (Ss = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? yn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), g = ks(r, h, f), p = { ...r, size: d, color: u }, m = l.create(i, p), y = o.getPointAtLength(0), x = {
      x: y.x,
      y: y.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    l.update(m, x);
    let P;
    const b = new Promise(($) => {
      P = $;
    }), _ = () => {
      typeof r.onComplete == "function" && r.onComplete(), P();
    }, E = s.wrapOnComplete ? s.wrapOnComplete(_) : _, S = {
      element: m,
      renderer: l,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: g,
      onComplete: E,
      currentPosition: { x: y.x, y: y.y }
    };
    return t._activeParticles.add(S), t._particleEngineHandle || (t._particleEngineHandle = eo.register(($) => t._tickParticles($))), {
      getCurrentPosition() {
        return t._activeParticles.has(S) ? { ...S.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(S) && (S.renderer.destroy(S.element), t._activeParticles.delete(S), E());
      },
      get finished() {
        return b;
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
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? yn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", g = e(a, c, i, {
        size: u,
        color: f,
        durationFallback: h
      });
      return g && V("particle", `sendParticle on edge "${o}"`, { size: u, color: f, duration: i.duration }), g;
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
          const y = t.getEdgePathElement(p)?.getTotalLength() ?? 0;
          return { id: p, length: y };
        }).filter((p) => p.length > 0);
        if (f.length === 0) {
          const p = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: p, stopAll() {
          } };
        }
        const h = Math.max(...f.map((p) => p.length)), g = ks(l, h, "2s");
        for (const { id: p, length: m } of f) {
          const y = m / h, x = g * y, P = g - x;
          if (P <= 0) {
            const b = this.sendParticle(p, { ...l, duration: x });
            b && c.push(b);
          } else {
            const b = setTimeout(() => {
              const _ = this.sendParticle(p, { ...l, duration: x });
              _ && c.push(_);
            }, P);
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
class dg {
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
const oi = 1, ii = 1 / 60;
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
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Br(r) ?? void 0 : void 0, a = {
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
            Or(r, o, n);
            break;
          case "decay":
            _i(r, o, n);
            break;
          case "inertia":
            zr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, a = s.duration ?? 5e3, l = a > 0 ? Math.min((this._virtualTime - e.startTime) / a, 1) : 1;
            Vr(r, s, l, i), l >= 1 && (r.settled = !0);
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
const fa = /* @__PURE__ */ new Map();
function Si(t, e) {
  fa.set(t, e);
}
function ug(t) {
  return fa.get(t);
}
function ki(t, e = 20) {
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
function ha(t) {
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
const fg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = ki(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    c += ha(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, hg = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = ki(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: a, vbHeight: l } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${a} ${l}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const u = t.nodes[d.source], f = t.nodes[d.target];
      if (!u || !f)
        continue;
      const h = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, g = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2, p = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, m = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${g}" x2="${p}" y2="${m}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, g = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${g}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, gg = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = ki(t.nodes);
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
    u += ha(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, g = f.position?.y ?? 0, p = f.dimensions?.width ?? 150, m = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${g}" width="${p}" height="${m}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${g}" width="${p}" height="${m}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
Si("faithful", fg);
Si("outline", hg);
Si("activity", gg);
function si(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function ri(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function pg(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function ga(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      ga(t[e]);
  }
  return t;
}
class Li {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = ga(ve(e.initialState)), this.events = Object.freeze(ve(e.events)), this.checkpoints = Object.freeze(ve(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
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
    if (e.version > oi)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${oi}). Please update AlpineFlow to replay this recording.`
      );
    return new Li(e);
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
      const i = pg(o.canvas, e);
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
    const a = ii * 1e3;
    let l = o ? si(r, i) : ri(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = ug(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class mg {
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
      version: oi,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new Li(i);
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
class yg {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = To(), this._scheduleTick());
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
    const a = ii * 1e3;
    let l = n ? si(r, i) : ri(r, i);
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
    const e = To(), n = (e - this._lastWallTime) / 1e3;
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
    const s = ii * 1e3;
    let a = e === 0 ? ri(i, 0) : si(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = To(), this._scheduleTick();
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
function To() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function wg(t) {
  const e = cg(t);
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
      const n = new Ci(t, eo);
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
      if (V("animate", "update() called", {
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
          const y = (g._duration ?? i) === 0;
          if (g.followPath && !y) {
            let x = null;
            typeof g.followPath == "function" ? x = g.followPath : x = Ei(g.followPath);
            let P = null;
            if (g.guidePath?.visible && typeof g.followPath == "string" && typeof document < "u") {
              const b = t.getEdgeSvgElement?.();
              b && (P = document.createElementNS("http://www.w3.org/2000/svg", "path"), P.setAttribute("d", g.followPath), P.classList.add("flow-guide-path"), g.guidePath.class && P.classList.add(g.guidePath.class), b.appendChild(P));
            }
            if (x) {
              const b = x, _ = P, E = g.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (S) => {
                  const A = t._nodeMap.get(h);
                  if (!A) return;
                  const $ = b(S);
                  Ce().raw(A).position.x = $.x, Ce().raw(A).position.y = $.y, s.add(h), S >= 1 && _ && E && _.remove();
                }
              });
            }
          } else if (g.position) {
            const P = Ce().raw(p).position;
            if (g.position.x !== void 0) {
              const b = g.position.x;
              if (y)
                P.x = b;
              else {
                const _ = P.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: _,
                  to: b,
                  apply: (E) => {
                    const S = t._nodeMap.get(h);
                    S && (Ce().raw(S).position.x = E, s.add(h));
                  }
                });
              }
            }
            if (g.position.y !== void 0) {
              const b = g.position.y;
              if (y)
                P.y = b;
              else {
                const _ = P.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: _,
                  to: b,
                  apply: (E) => {
                    const S = t._nodeMap.get(h);
                    S && (Ce().raw(S).position.y = E), s.add(h);
                  }
                });
              }
            }
            y && s.add(h);
          }
          if (g.data !== void 0 && Object.assign(p.data, g.data), g.class !== void 0 && (p.class = g.class), g.selected !== void 0 && (p.selected = g.selected), g.zIndex !== void 0 && (p.zIndex = g.zIndex), g.style !== void 0)
            if (y)
              p.style = g.style, a.add(h);
            else {
              const x = wn(p.style || {}), P = wn(g.style), b = t._nodeElements.get(h);
              if (b) {
                const _ = getComputedStyle(b);
                for (const E of Object.keys(P))
                  x[E] === void 0 && (x[E] = _.getPropertyValue(E));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (_) => {
                  const E = t._nodeMap.get(h);
                  E && (Ce().raw(E).style = Fr(x, P, _), a.add(h));
                }
              });
            }
          g.dimensions && p.dimensions && (g.dimensions.width !== void 0 && (y ? p.dimensions.width = g.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: p.dimensions.width,
            to: g.dimensions.width,
            apply: (x) => {
              p.dimensions.width = x;
            }
          })), g.dimensions.height !== void 0 && (p.fixedDimensions = !0, y ? p.dimensions.height = g.dimensions.height : r.push({
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
          const y = (g._duration ?? i) === 0;
          if (g.color !== void 0)
            if (typeof g.color == "object")
              p.color = g.color;
            else if (y)
              p.color = g.color, l.add(h);
            else {
              const x = typeof p.color == "string" && p.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || wi;
              r.push({
                key: `edge:${h}:color`,
                from: x,
                to: g.color,
                apply: (P) => {
                  const b = t._edgeMap.get(h);
                  b && (Ce().raw(b).color = P, l.add(h));
                }
              });
            }
          if (g.strokeWidth !== void 0)
            if (y)
              p.strokeWidth = g.strokeWidth, l.add(h);
            else {
              const x = p.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: x,
                to: g.strokeWidth,
                apply: (P) => {
                  const b = t._edgeMap.get(h);
                  b && (Ce().raw(b).strokeWidth = P, l.add(h));
                }
              });
            }
          g.label !== void 0 && (p.label = g.label), g.animated !== void 0 && (p.animated = g.animated), g.class !== void 0 && (p.class = g.class);
        }
      if (n.viewport) {
        const h = n.viewport, p = (h._duration ?? i) === 0, m = t.viewport;
        h.pan?.x !== void 0 && (p ? m.x = h.pan.x : r.push({
          key: "viewport:pan.x",
          from: m.x,
          to: h.pan.x,
          apply: (y) => {
            m.x = y;
          }
        })), h.pan?.y !== void 0 && (p ? m.y = h.pan.y : r.push({
          key: "viewport:pan.y",
          from: m.y,
          to: h.pan.y,
          apply: (y) => {
            m.y = y;
          }
        })), h.zoom !== void 0 && (p ? m.zoom = h.zoom : r.push({
          key: "viewport:zoom",
          from: m.zoom,
          to: h.zoom,
          apply: (y) => {
            m.zoom = y;
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
      const f = Ce().raw(t._animator).animate(r, {
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
              const m = Ce().raw(p);
              (g.followPath || g.position?.x !== void 0) && (p.position.x = m.position.x), (g.followPath || g.position?.y !== void 0) && (p.position.y = m.position.y), g.style !== void 0 && (p.style = m.style);
            }
          if (n.edges)
            for (const [h, g] of Object.entries(n.edges)) {
              const p = t._edgeMap.get(h);
              if (!p) continue;
              const m = Ce().raw(p);
              g.color !== void 0 && typeof g.color == "string" && (p.color = m.color), g.strokeWidth !== void 0 && (p.strokeWidth = m.strokeWidth);
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
      const i = Rr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
            const x = y.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            y.dimensions && (d.x += y.dimensions.width * (0.5 - x[0]), d.y += y.dimensions.height * (0.5 - x[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const m = n.getCurrentPosition();
          if (m)
            d = m;
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
      return new dg(n, {
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
        animate: (p, m) => {
          const y = i.update;
          i.update = s;
          try {
            return r.call(i, p, m);
          } finally {
            i.update = y;
          }
        },
        update: (p, m) => s.call(i, p, m),
        sendParticle: (p, m) => a.call(i, p, m),
        sendParticleAlongPath: (p, m) => l.call(i, p, m),
        sendParticleBetween: (p, m, y) => c.call(i, p, m, y),
        sendParticleBurst: (p, m) => d.call(i, p, m),
        sendConverging: (p, m) => u.call(i, p, m),
        addNodes: (p) => t.addNodes(p),
        removeNodes: (p) => t.removeNodes(p),
        addEdges: (p) => t.addEdges(p),
        removeEdges: (p) => t.removeEdges(p)
      }, h = new mg(f, o), g = async () => {
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
      return new yg(r, n, o);
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
      Gt(n, o);
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
function Ls(t, e, n, o) {
  const i = e.find((a) => a.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return yt(t, e);
  const r = /* @__PURE__ */ new Set(), s = Jo(t, e, n);
  for (const a of s)
    r.add(a.id);
  if (o?.recursive) {
    const a = s.map((l) => l.id);
    for (; a.length > 0; ) {
      const l = a.shift(), c = Jo(l, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), a.push(d.id));
    }
  }
  return r;
}
function vg(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Ao(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function Ps(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = yt(r.id, e);
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
function No(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), a = i.source === t, l = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || a && s || r && l ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function _g(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Fn = { width: 150, height: 50 };
function bg(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = Ls(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      V("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, a = n?.animate !== !1, l = vg(o, t.nodes, i);
      if (a) {
        t._suspendHistory();
        const c = o.dimensions ?? Fn, d = r && s ? s : c, u = {};
        for (const [h] of l.targetPositions) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const p = g.dimensions ?? Fn;
          let m, y;
          g.parentId === e ? (m = (d.width - p.width) / 2, y = (d.height - p.height) / 2) : (m = o.position.x + (d.width - p.width) / 2, y = o.position.y + (d.height - p.height) / 2), u[h] = {
            position: { x: m, y },
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
            Ao(o, t.nodes, l, s), l.reroutedEdges = No(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Ao(o, t.nodes, l, s), l.reroutedEdges = No(e, t.edges, i), t._collapseState.set(e, l), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Ao(o, t.nodes, l, s), l.reroutedEdges = No(e, t.edges, i), t._collapseState.set(e, l), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && _g(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const a = o.dimensions ?? Fn;
        Ps(o, t.nodes, i, r);
        const l = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const g = h.dimensions ?? Fn;
            let p, m;
            h.parentId === e ? (p = (a.width - g.width) / 2, m = (a.height - g.height) / 2) : (p = o.position.x + (a.width - g.width) / 2, m = o.position.y + (a.height - g.height) / 2), h.position = { x: p, y: m }, h.style = { ...h.style || {}, opacity: "0" }, l[u] = {
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
        Ps(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return Ls(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return yt(e, t.nodes).size;
    }
  };
}
function xg(t) {
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
function Eg(t) {
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
const Cg = 8, Sg = 12, kg = 2;
function Pi(t) {
  return {
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function Lg(t) {
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
function Pg(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function Ms(t, e, n) {
  const o = e.gap ?? Cg, i = e.padding ?? Sg, r = e.headerHeight ?? 0, s = Lg(e), a = Pg(t), l = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (a.length === 0)
    return {
      positions: l,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Mg(a, o, i, r, s, d, l, c) : e.direction === "horizontal" ? Tg(a, o, i, r, s, u, l, c) : Ag(a, o, i, r, s, e.columns ?? kg, d, u, l, c);
}
function Mg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Pi(f));
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
function Tg(t, e, n, o, i, r, s, a) {
  let l = 0;
  const c = t.map((f) => Pi(f));
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
function Ag(t, e, n, o, i, r, s, a, l, c) {
  const d = Math.min(r, t.length), u = t.map((y) => Pi(y));
  let f = 0, h = 0;
  for (const y of u)
    f = Math.max(f, y.width), h = Math.max(h, y.height);
  const g = s > 0 ? (s - (d - 1) * e) / d : 0;
  g > 0 && (f = g);
  const p = Math.ceil(t.length / d), m = a > 0 ? (a - (p - 1) * e) / p : 0;
  m > 0 && (h = m);
  for (let y = 0; y < t.length; y++) {
    const x = y % d, P = Math.floor(y / d), b = n + x * (f + e), _ = n + o + P * (h + e);
    l.set(t[y].id, { x: b, y: _ }), i === "both" ? c.set(t[y].id, { width: f, height: h }) : i === "width" ? c.set(t[y].id, { width: f, height: u[y].height }) : i === "height" && c.set(t[y].id, { width: u[y].width, height: h });
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
function Ng(t) {
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
      const u = t.nodes.find((b) => b.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((b) => b.parentId === e);
      a && (f = f.filter((b) => b.id !== a)), l && !f.some((b) => b.id === l.id) && (f = [...f, l]);
      const h = new Map(f.map((b) => [b.id, b]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const b of f)
          b.childLayout && this.layoutChildren(b.id, { excludeId: s, omitFromComputation: a, shallow: !1 });
      const g = u.childLayout, p = g.headerHeight !== void 0 ? g : u.data?.label ? { ...g, headerHeight: 30 } : g, m = Ms(f, p, d);
      for (const [b, _] of m.positions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const E = h.get(b);
        E && (E.position ? (E.position.x = _.x, E.position.y = _.y) : E.position = { x: _.x, y: _.y });
      }
      for (const [b, _] of m.dimensions) {
        if (b === s || l && b === l.id && !t._nodeMap.has(b)) continue;
        const E = h.get(b);
        if (E) {
          let S = _.width, A = _.height;
          E.minDimensions && (E.minDimensions.width != null && (S = Math.max(S, E.minDimensions.width)), E.minDimensions.height != null && (A = Math.max(A, E.minDimensions.height))), E.maxDimensions && (E.maxDimensions.width != null && (S = Math.min(S, E.maxDimensions.width)), E.maxDimensions.height != null && (A = Math.min(A, E.maxDimensions.height))), E.dimensions ? (E.dimensions.width = S, E.dimensions.height = A) : E.dimensions = { width: S, height: A }, E.childLayout && !c && this.layoutChildren(b, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: E.dimensions });
        }
      }
      let y = m.parentDimensions.width, x = m.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (y = Math.max(y, u.minDimensions.width)), u.minDimensions.height != null && (x = Math.max(x, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (y = Math.min(y, u.maxDimensions.width)), u.maxDimensions.height != null && (x = Math.min(x, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = y, u.dimensions.height = x, y !== m.parentDimensions.width || x !== m.parentDimensions.height) {
        const _ = Ms(f, p, { width: y, height: x });
        for (const [E, S] of _.positions) {
          if (E === s || l && E === l.id && !t._nodeMap.has(E)) continue;
          const A = h.get(E);
          A && (A.position ? (A.position.x = S.x, A.position.y = S.y) : A.position = { x: S.x, y: S.y });
        }
        for (const [E, S] of _.dimensions) {
          if (E === s || l && E === l.id && !t._nodeMap.has(E)) continue;
          const A = h.get(E);
          if (A) {
            let $ = S.width, M = S.height;
            A.minDimensions && (A.minDimensions.width != null && ($ = Math.max($, A.minDimensions.width)), A.minDimensions.height != null && (M = Math.max(M, A.minDimensions.height))), A.maxDimensions && (A.maxDimensions.width != null && ($ = Math.min($, A.maxDimensions.width)), A.maxDimensions.height != null && (M = Math.min(M, A.maxDimensions.height))), A.dimensions ? (A.dimensions.width = $, A.dimensions.height = M) : A.dimensions = { width: $, height: M }, A.childLayout && !c && this.layoutChildren(E, { excludeId: s, omitFromComputation: a, shallow: !1, stretchedSize: A.dimensions });
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
function Ig(t) {
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
        const s = t.nodes.filter((l) => l.parentId === o), a = bs(i, s, r);
        a.length > 0 ? t._validationErrorCache.set(o, a) : t._validationErrorCache.delete(o), i._validationErrors = a;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = un(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = bs(n, i, o);
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
              ), g = so(f, o, h, u);
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
      if (!r || yt(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (f) => f.parentId === n && f.id !== e
        ), u = la(r, o, d, s);
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
            ), h = so(u, o, f, d);
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
function $g(t) {
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
function pa(t) {
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
function Dg(t) {
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
function Hg({
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
  const a = ta(t, e, n, o, i, r, s);
  if (!a)
    return oo({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = pa(a), { x: c, y: d, offsetX: u, offsetY: f } = Dg(a);
  return {
    path: l,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function Rg(t) {
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
      c = Ts(l);
      break;
    case "step":
      c = Fg(l, 0);
      break;
    case "smoothstep":
      c = Og(l, a);
      break;
    case "catmull-rom":
    case "bezier":
      c = pa(l.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = Ts(l);
  }
  const d = zg(l), u = Sn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function Ts(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function Fg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ma(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], a = t[i + 1];
    n += Xt(r.x, r.y, s.x, s.y, a.x, a.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ma(t, e, n) {
  const o = (t.x + e.x) / 2, i = Xt(t.x, t.y, o, t.y, o, e.y, n), r = Xt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Og(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ma(t[0], t[1], e);
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
function zg(t) {
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
  const i = t.dimensions?.width ?? we, r = t.dimensions?.height ?? _e, s = Zt(t, o);
  let a;
  if (t.shape) {
    const l = n?.[t.shape] ?? sa[t.shape];
    if (l) {
      const c = l.perimeterPoint(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = vs(i, r, e);
      a = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const l = vs(i, r, e);
    a = { x: s.x + l.x, y: s.y + l.y };
  }
  if (t.rotation) {
    const l = s.x + i / 2, c = s.y + r / 2;
    a = qn(a.x, a.y, l, c, t.rotation);
  }
  return a;
}
function As(t) {
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
function ai(t) {
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
const Vg = 1.5, Bg = 5 / 20;
function Ht(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = ai(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const l = (i.width ?? 12.5) * Vg * Bg * 0.4, c = r + l, d = ai(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function ao(t, e, n, o = "bottom", i = "top", r, s, a, l, c, d, u) {
  const f = r ?? Ut(e, o, c, d), h = s ?? Ut(n, i, c, d), g = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: As(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: As(i)
  }, p = t.type ?? u ?? "bezier";
  if (a?.[p])
    return a[p](g);
  switch (p === "floating" ? t.pathType ?? "bezier" : p) {
    case "editable":
      return Rg({
        ...g,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return Hg({ ...g, obstacles: l });
    case "orthogonal":
      return oh({ ...g, obstacles: l });
    case "smoothstep":
      return vn(g);
    case "straight":
      return Wr({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return oo(g);
  }
}
function Ns(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? qn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, a = r.y - i.y;
  if (s === 0 && a === 0) {
    const g = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? qn(g.x, g.y, i.x, i.y, t.rotation) : g;
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
function Is(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = t.position.x + n / 2, r = t.position.y + o / 2;
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
function ya(t, e) {
  const n = t.dimensions?.width ?? we, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? we, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, a = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, l = Ns(t, a), c = Ns(e, s), d = Is(t, l), u = Is(e, c);
  return {
    sx: l.x,
    sy: l.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: u
  };
}
function Iy(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function wa(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function va(t, e) {
  return `${t}__grad__${e}`;
}
function _a(t, e, n, o, i, r, s) {
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
function qg(t, e) {
  return Array.isArray(t) ? t.findIndex((n) => n?.name === e) : -1;
}
function $s(t, e, n, o, i) {
  const r = t.data?.fields;
  if (!Array.isArray(r) || !Number.isInteger(n) || n < 0 || n >= r.length) return null;
  const { width: s, height: a } = t.dimensions ?? {};
  if (typeof s != "number" || !Number.isFinite(s) || typeof a != "number" || !Number.isFinite(a)) return null;
  const { headerHeight: l, rowHeight: c, handleOffsetY: d, handleOffsetYLast: u, insetLeft: f, insetRight: h, insetTop: g } = i;
  if (!Number.isFinite(l) || !Number.isFinite(c) || !Number.isFinite(d) || !Number.isFinite(u) || !Number.isFinite(f) || !Number.isFinite(h) || !Number.isFinite(g))
    return null;
  const p = n === r.length - 1 ? u : d, m = e.y + g + l + n * c + p;
  return { x: o === "left" ? e.x + f : e.x + s - h, y: m, position: o };
}
const Yg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Xg(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const a = r.getNode(e);
  if (a && !Be(a))
    return { applied: !1 };
  const l = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Zr({
    edge: i,
    newConnection: l,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: l }), { applied: !0, newConnection: l }) : { applied: !1, reason: d.reason, newConnection: l };
}
function Wg(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ba(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Ds(t, e) {
  if (!e) return t;
  const n = ai(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, a = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(a) ? s > 0 ? "right" : "left" : a > 0 ? "bottom" : "top";
}
function Hs(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function lo(t, e) {
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
function co(t, e, n, o, i, r, s) {
  const a = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (a) {
    if (n) {
      const c = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = lo(c, r);
      if (!d) {
        const u = a.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = lo(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ba(n);
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
function Rs(t, e, n, o) {
  if (!t || !e || t.hidden || t.collapsed || t.condensed || t.rotation) return -1;
  const i = t.nodeOrigin;
  if (i && (i[0] !== 0 || i[1] !== 0) || !n?.hasAttribute("data-flow-schema-node") || n.style.display === "none") return -1;
  const r = t.dimensions?.width, s = t.dimensions?.height;
  if (typeof r != "number" || !Number.isFinite(r) || typeof s != "number" || !Number.isFinite(s)) return -1;
  const a = t.data?.fields;
  if (!Array.isArray(a) || a.length === 0) return -1;
  const l = o.insetTop + o.headerHeight + (a.length - 1) * o.rowHeight + o.rowHeightLast + o.insetBottom;
  return Math.abs(l - s) > 0.5 ? -1 : qg(a, e);
}
function Fs(t, e, n, o, i) {
  const r = t.dimensions?.width ?? we, s = e.x + (i.insetLeft + (r - i.insetRight)) / 2;
  return n === "source" ? o >= s ? "right" : "left" : o > s ? "right" : "left";
}
function Os(t) {
  return t.position.x + (t.dimensions?.width ?? we) / 2;
}
function jg(t, e, n, o, i, r, s, a) {
  const l = Rs(t, i, s?.get(t.id), a);
  if (l < 0) return null;
  const c = Rs(e, r, s?.get(e.id), a);
  if (c < 0) return null;
  const d = Fs(t, n.position, "source", Os(o), a), u = Fs(e, o.position, "target", Os(n), a), f = $s(t, n.position, l, d, a), h = $s(e, o.position, c, u, a);
  if (!f || !h) return null;
  const g = { handleWidth: a.handleWidth, handleHeight: a.handleHeight };
  return {
    sourcePos: f.position,
    targetPos: h.position,
    srcMeasurement: { x: f.x, y: f.y, ...g },
    tgtMeasurement: { x: h.x, y: h.y, ...g }
  };
}
function zs(t, e, n, o, i, r, s, a, l) {
  const c = l ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const p = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = lo(p, a), !d) {
      const m = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = lo(m, a);
    }
    if (!d) {
      const m = ba(o);
      m && (d = c.querySelector(`[data-flow-handle-position="${m}"]`));
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
function Ug(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function ct(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Zg(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const a = e.x + s * o, l = e.y + s * i;
  return Math.sqrt((t.x - a) ** 2 + (t.y - l) ** 2);
}
function Gg(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
      a.setAttribute("fill", "none"), a.style.stroke = "transparent", a.style.strokeWidth = "20", a.style.pointerEvents = "stroke", a.style.cursor = "pointer", s.appendChild(a);
      let l = e.querySelector("path:not(:first-child)");
      l || (l = document.createElementNS("http://www.w3.org/2000/svg", "path"), l.setAttribute("fill", "none"), l.setAttribute("stroke-width", "1.5"), l.style.pointerEvents = "none", s.appendChild(l));
      let c = null, d = null, u = null, f = null, h = 0, g = null, p = "none", m = null, y = null;
      function x(L, I, F, K, ne) {
        g || (g = document.createElementNS("http://www.w3.org/2000/svg", "circle"), g.classList.add("flow-edge-dot"), g.style.pointerEvents = "none", L.appendChild(g));
        const Z = F.closest(".flow-container"), B = Z ? getComputedStyle(Z) : null, z = K.particleSize ?? (parseFloat(B?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), q = ne || B?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        g.setAttribute("r", String(z)), K.particleColor ? g.style.fill = K.particleColor : g.style.removeProperty("fill");
        const X = g.querySelector("animateMotion");
        X && X.remove();
        const j = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        j.setAttribute("dur", q), j.setAttribute("repeatCount", "indefinite"), j.setAttribute("path", I), g.appendChild(j);
      }
      function P() {
        g?.remove(), g = null;
      }
      let b = null, _ = null, E = null, S = null;
      const A = (L) => {
        L.stopPropagation();
        const I = o(n);
        if (!I) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: I, event: L }), mt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has(I.id) ? (F.selectedEdges.delete(I.id), I.selected = !1, V("selection", `Edge "${I.id}" deselected (shift)`)) : (F.selectedEdges.add(I.id), I.selected = !0, V("selection", `Edge "${I.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add(I.id), I.selected = !0, V("selection", `Edge "${I.id}" selected`)), F._emitSelectionChange());
      }, $ = (L) => {
        L.preventDefault(), L.stopPropagation();
        const I = o(n);
        if (!I) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = L.target;
        if (K.classList.contains("flow-edge-control-point")) {
          const ne = parseInt(K.dataset.pointIndex ?? "", 10);
          if (!isNaN(ne)) {
            F._emit("edge-control-point-context-menu", {
              edge: I,
              pointIndex: ne,
              position: { x: L.clientX, y: L.clientY },
              event: L
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: I, event: L });
      }, M = (L) => {
        L.stopPropagation(), L.preventDefault();
        const I = o(n), F = t.$data(e.closest("[x-data]"));
        if (!I || !F || (I.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const ne = L.target;
        if (ne.classList.contains("flow-edge-control-point")) {
          const Z = parseInt(ne.dataset.pointIndex ?? "", 10);
          !isNaN(Z) && I.controlPoints && (F._captureHistory?.(), I.controlPoints.splice(Z, 1), F._emit("edge-control-point-change", { edge: I, action: "remove", index: Z }));
          return;
        }
        if (ne.classList.contains("flow-edge-midpoint")) {
          const Z = parseInt(ne.dataset.segmentIndex ?? "", 10);
          if (!isNaN(Z)) {
            const B = F.screenToFlowPosition(L.clientX, L.clientY);
            I.controlPoints || (I.controlPoints = []), F._captureHistory?.(), I.controlPoints.splice(Z, 0, { x: B.x, y: B.y }), F._emit("edge-control-point-change", { edge: I, action: "add", index: Z });
          }
          return;
        }
        if (ne.closest("path")) {
          const Z = F.screenToFlowPosition(L.clientX, L.clientY);
          I.controlPoints || (I.controlPoints = []);
          const B = [
            b ?? { x: 0, y: 0 },
            ...I.controlPoints,
            _ ?? { x: 0, y: 0 }
          ];
          let z = 0, q = 1 / 0;
          for (let X = 0; X < B.length - 1; X++) {
            const j = Zg(Z, B[X], B[X + 1]);
            j < q && (q = j, z = X);
          }
          F._captureHistory?.(), I.controlPoints.splice(z, 0, { x: Z.x, y: Z.y }), F._emit("edge-control-point-change", { edge: I, action: "add", index: z });
        }
      }, T = (L) => {
        const I = L.target;
        if (!I.classList.contains("flow-edge-control-point") || L.button !== 0) return;
        L.stopPropagation(), L.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const K = t.$data(e.closest("[x-data]"));
        if (!K) return;
        const ne = parseInt(I.dataset.pointIndex ?? "", 10);
        if (isNaN(ne)) return;
        I.classList.add("dragging");
        let Z = !1;
        const B = (q) => {
          Z || (K._captureHistory?.(), Z = !0);
          let X = K.screenToFlowPosition(q.clientX, q.clientY);
          const j = K._config?.snapToGrid;
          j && (X = {
            x: Math.round(X.x / j[0]) * j[0],
            y: Math.round(X.y / j[1]) * j[1]
          }), F.controlPoints[ne] = X;
        }, z = () => {
          document.removeEventListener("pointermove", B), document.removeEventListener("pointerup", z), I.classList.remove("dragging"), Z && K._emit("edge-control-point-change", { edge: F, action: "move", index: ne });
        };
        document.addEventListener("pointermove", B), document.addEventListener("pointerup", z);
      };
      s.addEventListener("contextmenu", $), s.addEventListener("dblclick", M), s.addEventListener("pointerdown", T, !0);
      let k = null;
      const v = (L) => {
        if (L.button !== 0) return;
        L.stopPropagation();
        const I = o(n);
        if (!I) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = F._config?.reconnectSnapRadius ?? Qi, ne = F._config?.edgesReconnectable !== !1, Z = I.reconnectable ?? !0;
        let B = null;
        if (ne && Z !== !1 && b && _) {
          const re = F.screenToFlowPosition(L.clientX, L.clientY), pe = ct(re.x, re.y, b.x, b.y, K) || E && ct(re.x, re.y, E.x, E.y, K);
          (ct(re.x, re.y, _.x, _.y, K) || S && ct(re.x, re.y, S.x, S.y, K)) && (Z === !0 || Z === "target") ? B = "target" : pe && (Z === !0 || Z === "source") && (B = "source");
        }
        if (!B) {
          const re = (pe) => {
            document.removeEventListener("pointerup", re), A(pe);
          };
          document.addEventListener("pointerup", re, { once: !0 });
          return;
        }
        const z = L.clientX, q = L.clientY;
        let X = !1, j = !1, H = null;
        const te = F._config?.connectionSnapRadius ?? 20;
        let Q = null, U = null, J = null, se = z, ie = q;
        const G = e.closest(".flow-container");
        if (!G) return;
        const ee = B === "target" ? b : _, he = () => {
          X = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: I, handleType: B }), V("reconnect", `Reconnection drag started on edge "${I.id}" (${B} end)`), U = Wt({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), Q = U.svg;
          const re = F.screenToFlowPosition(z, q);
          U.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: re.x,
            toY: re.y,
            source: I.source,
            sourceHandle: I.sourceHandle
          });
          const pe = G.querySelector(".flow-viewport");
          pe && pe.appendChild(Q), B === "target" && (F.pendingConnection = {
            source: I.source,
            sourceHandle: I.sourceHandle,
            position: re
          }), F._pendingReconnection = {
            edge: I,
            draggedEnd: B,
            anchorPosition: { ...ee },
            position: re
          }, J = wo(G, F, se, ie), B === "target" && bn(G, I.source, I.sourceHandle ?? "source", F, I.id);
        }, ce = (re) => {
          if (se = re.clientX, ie = re.clientY, !X) {
            Math.sqrt(
              (re.clientX - z) ** 2 + (re.clientY - q) ** 2
            ) >= Qn && he();
            return;
          }
          const pe = F.screenToFlowPosition(re.clientX, re.clientY), me = _n({
            containerEl: G,
            handleType: B === "target" ? "target" : "source",
            excludeNodeId: B === "target" ? I.source : I.target,
            cursorFlowPos: pe,
            connectionSnapRadius: te,
            getNode: (Pe) => F.getNode(Pe),
            toFlowPosition: (Pe, Ee) => F.screenToFlowPosition(Pe, Ee)
          });
          me.element !== H && (H?.classList.remove("flow-handle-active"), me.element?.classList.add("flow-handle-active"), H = me.element), U?.update({
            fromX: ee.x,
            fromY: ee.y,
            toX: me.position.x,
            toY: me.position.y,
            source: I.source,
            sourceHandle: I.sourceHandle
          });
          const Oe = me.position;
          B === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: Oe
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: Oe
          }), J?.updatePointer(re.clientX, re.clientY);
        }, oe = () => {
          j || (j = !0, document.removeEventListener("pointermove", ce), document.removeEventListener("pointerup", ge), J?.stop(), J = null, U?.destroy(), U = null, Q = null, H?.classList.remove("flow-handle-active"), k = null, s.classList.remove("flow-edge-reconnecting"), ke(G), F.pendingConnection = null, F._pendingReconnection = null);
        }, ge = async (re) => {
          if (!X) {
            oe(), A(re);
            return;
          }
          if (F._connectValidating) return;
          let pe = H, me = null;
          if (!pe) {
            me = document.elementFromPoint(re.clientX, re.clientY);
            const Me = B === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            pe = me?.closest(Me);
          }
          const Pe = (pe ? pe.closest("[data-flow-node-id]") : me?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, Ee = pe?.dataset.flowHandleId, ue = U?.svg ?? null;
          St(ue, !0);
          let be;
          try {
            be = await Xg({
              dropNodeId: Pe,
              dropHandleId: Ee,
              draggedEnd: B,
              edge: I,
              canvas: F,
              containerEl: G
            });
          } finally {
            St(ue, !1);
          }
          be.applied ? V("reconnect", `Edge "${I.id}" reconnected (${B})`, be.newConnection) : V("reconnect", `Edge "${I.id}" reconnection cancelled — snapping back`, { reason: be.reason }), F._emit("reconnect-end", { edge: I, successful: be.applied }), oe();
        };
        document.addEventListener("pointermove", ce), document.addEventListener("pointerup", ge), k = oe;
      };
      s.addEventListener("pointerdown", v);
      const w = (L) => {
        const I = o(n);
        if (!I) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const K = F._config?.edgesReconnectable !== !1, ne = I.reconnectable ?? !0;
        if (!K || ne === !1 || !b || !_) {
          s.style.removeProperty("cursor"), a.style.cursor = "pointer";
          return;
        }
        const Z = F._config?.reconnectSnapRadius ?? Qi, B = F.screenToFlowPosition(L.clientX, L.clientY), z = (ct(B.x, B.y, b.x, b.y, Z) || E && ct(B.x, B.y, E.x, E.y, Z)) && (ne === !0 || ne === "source"), q = (ct(B.x, B.y, _.x, _.y, Z) || S && ct(B.x, B.y, S.x, S.y, Z)) && (ne === !0 || ne === "target");
        z || q ? (s.style.cursor = "grab", a.style.cursor = "grab") : (s.style.removeProperty("cursor"), a.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", w);
      const N = (L) => {
        if (L.key !== "Enter" && L.key !== " ") return;
        L.preventDefault(), L.stopPropagation();
        const I = o(n);
        if (!I) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: I, event: L }), mt(L, F._shortcuts?.multiSelect) ? F.selectedEdges.has(I.id) ? (F.selectedEdges.delete(I.id), I.selected = !1) : (F.selectedEdges.add(I.id), I.selected = !0) : (F.deselectAll(), F.selectedEdges.add(I.id), I.selected = !0), F._emitSelectionChange());
      };
      s.addEventListener("keydown", N);
      const C = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", C), s.addEventListener("blur", R);
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
        const I = t.$data(e.closest("[x-data]"));
        if (!I?.nodes) return;
        const F = L.type ?? I._config?.defaultEdgeType ?? "bezier", K = I._config?.edgeLod;
        let ne = F;
        if (K) {
          const W = I._zoomLevel;
          (K.simplifyAt === "medium" && W === "medium" || W === "far") && (ne = "straight");
        }
        I._layoutAnimTick, I._edgeDirtyTicks?.get(L.id);
        const Z = I.getNode(L.source), B = I.getNode(L.target);
        if (!Z || !B) return;
        Z.sourcePosition, B.targetPosition;
        const z = kt(Z, I._nodeMap, I._config?.nodeOrigin), q = kt(B, I._nodeMap, I._config?.nodeOrigin), X = e.closest("[x-data]");
        let j, H, te, Q;
        const U = I._schemaMetrics, J = I._config?.nodeOrigin, se = F !== "floating" && I._config?.schemaHandleGeometry !== "dom" && U && (!J || J[0] === 0 && J[1] === 0) ? jg(
          Z,
          B,
          z,
          q,
          L.sourceHandle,
          L.targetHandle,
          I._nodeElements,
          U
        ) : null;
        if (F === "floating") {
          const W = ya(z, q);
          j = W.sourcePos, H = W.targetPos, te = { x: W.sx, y: W.sy, handleWidth: 0, handleHeight: 0 }, Q = { x: W.tx, y: W.ty, handleWidth: 0, handleHeight: 0 }, b = { x: W.sx, y: W.sy }, _ = { x: W.tx, y: W.ty };
        } else if (se)
          j = se.sourcePos, H = se.targetPos, te = se.srcMeasurement, Q = se.tgtMeasurement, b = { x: te.x, y: te.y }, _ = { x: Q.x, y: Q.y };
        else {
          const W = I._nodeElements?.get(L.source) ?? X.querySelector(`[data-flow-node-id="${CSS.escape(L.source)}"]`), ae = I._nodeElements?.get(L.target) ?? X.querySelector(`[data-flow-node-id="${CSS.escape(L.target)}"]`), fe = W ? Hs(W.getBoundingClientRect()) : void 0, ye = ae ? Hs(ae.getBoundingClientRect()) : void 0;
          j = co(X, L.source, L.sourceHandle, "source", Z, ye, W), H = co(X, L.target, L.targetHandle, "target", B, fe, ae);
          const le = t.raw(I).viewport ?? { x: 0, y: 0, zoom: 1 }, de = le.zoom || 1, xe = Z.rotation, Se = B.rotation;
          j = Ds(j, xe), H = Ds(H, Se), te = zs(X, L.source, z, L.sourceHandle, "source", de, le, ye, W), Q = zs(X, L.target, q, L.targetHandle, "target", de, le, fe, ae);
          const Te = Ut(z, j, I._shapeRegistry, I._config?.nodeOrigin), Le = Ut(q, H, I._shapeRegistry, I._config?.nodeOrigin);
          b = te ?? Te, _ = Q ?? Le;
        }
        const ie = Ht(te ?? b, j, te, L.markerStart), G = Ht(Q ?? _, H, Q, L.markerEnd);
        E = ie, S = G;
        let ee;
        if (F === "orthogonal" || F === "avoidant")
          if (I._config?.avoidantSimplifyOnDrag !== !1 && (I._draggingNodeIds?.has(L.source) || I._draggingNodeIds?.has(L.target)))
            ee = void 0;
          else {
            const ae = t.raw(I._obstacleSnapshot);
            if (ae)
              ee = ae.filter((fe) => fe.id !== L.source && fe.id !== L.target);
            else {
              const fe = t.raw(I.nodes), ye = new Map(fe.map((de) => [de.id, de])), le = I._config?.nodeOrigin;
              ee = fe.filter((de) => de.id !== L.source && de.id !== L.target).map((de) => {
                const xe = kt(de, ye, le);
                return {
                  x: xe.position.x,
                  y: xe.position.y,
                  width: xe.dimensions?.width ?? we,
                  height: xe.dimensions?.height ?? _e
                };
              });
            }
          }
        const he = ne === F ? L : { ...L, type: ne }, { path: ce, labelPosition: oe } = ao(he, z, q, j, H, ie, G, I._config?.edgeTypes, ee, I._shapeRegistry, I._config?.nodeOrigin, I._config?.defaultEdgeType);
        l.setAttribute("d", ce), a.setAttribute("d", ce), (F === "orthogonal" || F === "avoidant") && t.raw(I._edgeCorridors)?.set(L.id, {
          minX: Math.min(ie.x, G.x),
          minY: Math.min(ie.y, G.y),
          maxX: Math.max(ie.x, G.x),
          maxY: Math.max(ie.y, G.y)
        });
        const ge = F === "editable", re = ge && (L.showControlPoints || L.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((W) => W.remove()), re) {
          const W = L.controlPoints ?? [], ae = I.viewport?.zoom ?? 1, fe = 6 / ae, ye = 5 / ae, le = b ?? { x: 0, y: 0 }, de = _ ?? { x: 0, y: 0 }, xe = [le, ...W, de], Se = xe.length - 1, Te = l.getTotalLength?.() ?? 0;
          if (Te > 0) {
            const Le = [0], ze = 200;
            let $e = 1;
            for (let qe = 1; qe <= ze && $e < xe.length; qe++) {
              const Ln = qe / ze * Te, Kt = l.getPointAtLength(Ln), Ue = xe[$e], Jt = Kt.x - Ue.x, Ii = Kt.y - Ue.y;
              Jt * Jt + Ii * Ii < 25 && (Le.push(Ln), $e++);
            }
            for (; Le.length <= Se; )
              Le.push(Te);
            for (let qe = 0; qe < Se; qe++) {
              const Ln = (Le[qe] + Le[qe + 1]) / 2, Kt = l.getPointAtLength(Ln), Ue = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              Ue.classList.add("flow-edge-midpoint"), Ue.setAttribute("cx", String(Kt.x)), Ue.setAttribute("cy", String(Kt.y)), Ue.setAttribute("r", String(ye)), Ue.dataset.segmentIndex = String(qe);
              const Jt = document.createElementNS("http://www.w3.org/2000/svg", "title");
              Jt.textContent = "Double-click to add control point", Ue.appendChild(Jt), s.appendChild(Ue);
            }
          }
          for (let Le = 0; Le < W.length; Le++) {
            const ze = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ze.classList.add("flow-edge-control-point"), ze.setAttribute("cx", String(W[Le].x)), ze.setAttribute("cy", String(W[Le].y)), ze.setAttribute("r", String(fe)), ze.dataset.pointIndex = String(Le), s.appendChild(ze);
          }
        }
        if (a.style.cursor = ge ? "crosshair" : "pointer", a.style.strokeWidth = String(
          L.interactionWidth ?? I._config?.defaultInteractionWidth ?? 20
        ), L.markerStart != null) {
          const W = Ot(L.markerStart), ae = zt(W, I._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else if (L._renderDualMarker && L.markerEnd) {
          const W = Ot(L.markerEnd), ae = zt(W, I._id);
          l.setAttribute("marker-start", `url(#${ae})`);
        } else
          l.removeAttribute("marker-start");
        if (L.markerEnd) {
          const W = Ot(L.markerEnd), ae = zt(W, I._id);
          l.setAttribute("marker-end", `url(#${ae})`);
        } else
          l.removeAttribute("marker-end");
        const pe = L.strokeWidth ?? 1.5, me = Wg(L.animated);
        switch (me !== p && (l.classList.remove("flow-edge-animated", "flow-edge-pulse"), p === "dot" && P(), p = me), me) {
          case "dash":
            l.classList.add("flow-edge-animated");
            break;
          case "pulse":
            l.classList.add("flow-edge-pulse");
            break;
          case "dot":
            x(s, ce, X, L, L.animationDuration);
            break;
        }
        if (L.animationDuration && me !== "none" ? (me === "dash" || me === "pulse") && (l.style.animationDuration = L.animationDuration) : (me === "dash" || me === "pulse") && l.style.removeProperty("animation-duration"), y && y !== L.class && s.classList.remove(...y.split(" ").filter(Boolean)), L.class) {
          const W = me === "dash" ? " flow-edge-animated" : me === "pulse" ? " flow-edge-pulse" : "";
          l.setAttribute("class", L.class + W), s.classList.add(...L.class.split(" ").filter(Boolean)), y = L.class;
        } else
          y && (s.classList.remove(...y.split(" ").filter(Boolean)), y = null);
        if (s.setAttribute("aria-selected", String(!!L.selected)), L.selected)
          s.classList.add("flow-edge-selected"), l.style.strokeWidth = String(Math.max(pe + 1, 2.5)), l.style.stroke = "var(--flow-edge-stroke-selected, " + yn + ")";
        else {
          s.classList.remove("flow-edge-selected"), l.style.strokeWidth = String(pe);
          const W = I._markerDefsEl?.querySelector("defs") ?? null;
          if (wa(L.color)) {
            if (W) {
              const ae = va(I._id, L.id), fe = L.gradientDirection === "target-source", ye = b.x, le = b.y, de = _.x, xe = _.y;
              _a(
                W,
                ae,
                fe ? { from: L.color.to, to: L.color.from } : L.color,
                ye,
                le,
                de,
                xe
              ), l.style.stroke = `url(#${ae})`, m = ae;
            }
          } else if (L.color) {
            if (m) {
              const ae = W;
              ae && Io(ae, m), m = null;
            }
            l.style.stroke = L.color;
          } else {
            if (m) {
              const ae = W;
              ae && Io(ae, m), m = null;
            }
            l.style.removeProperty("stroke");
          }
        }
        if (!L.selected && ((L.sourceHandle ? I.selectedRows?.has(L.sourceHandle.replace(/-[lr]$/, "")) : !1) || (L.targetHandle ? I.selectedRows?.has(L.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), L.selected || (l.style.strokeWidth = String(Math.max(pe + 0.5, 2)), l.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), L.focusable ?? I._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", L.ariaRole ?? "group"), s.setAttribute("aria-label", L.ariaLabel ?? (L.label ? `Edge: ${L.label}` : `Edge from ${L.source} to ${L.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), L.domAttributes)
          for (const [W, ae] of Object.entries(L.domAttributes))
            W.startsWith("on") || Yg.has(W.toLowerCase()) || s.setAttribute(W, ae);
        const Ee = (W, ae, fe, ye, le) => {
          if (ae) {
            if (!W && ye) {
              const de = fe.includes("flow-edge-label-start"), xe = fe.includes("flow-edge-label-end");
              let Se = `[data-flow-edge-id="${le}"].flow-edge-label`;
              de ? Se += ".flow-edge-label-start" : xe ? Se += ".flow-edge-label-end" : Se += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", W = ye.querySelector(Se);
            }
            return W || (W = document.createElement("div"), W.className = fe, W.dataset.flowEdgeId = le, ye && ye.appendChild(W)), W.textContent = ae, W;
          }
          return W && W.remove(), null;
        }, ue = e.closest(".flow-viewport"), be = L.labelVisibility ?? "always", Me = () => {
          const W = l.getAttribute("d") ?? "";
          return W !== f && (f = W, h = typeof l.getTotalLength == "function" && l.getTotalLength() || 0), h;
        };
        if (c = Ee(c, L.label, "flow-edge-label", ue, L.id), c) {
          const W = Me();
          if (W > 0) {
            const ae = L.labelPosition ?? 0.5, fe = Ug(l, ae, W);
            c.style.left = `${fe.x}px`, c.style.top = `${fe.y}px`;
          } else
            c.style.left = `${oe.x}px`, c.style.top = `${oe.y}px`;
        }
        if (d = Ee(d, L.labelStart, "flow-edge-label flow-edge-label-start", ue, L.id), d) {
          const W = Me();
          if (W > 0) {
            const ae = L.labelStartOffset ?? 30, fe = l.getPointAtLength(Math.min(ae, W / 2));
            d.style.left = `${fe.x}px`, d.style.top = `${fe.y}px`;
          }
        }
        if (u = Ee(u, L.labelEnd, "flow-edge-label flow-edge-label-end", ue, L.id), u) {
          const W = Me();
          if (W > 0) {
            const ae = L.labelEndOffset ?? 30, fe = l.getPointAtLength(Math.max(W - ae, W / 2));
            u.style.left = `${fe.x}px`, u.style.top = `${fe.y}px`;
          }
        }
        for (const W of [c, d, u])
          W && (W.classList.toggle("flow-edge-label-hover", be === "hover"), W.classList.toggle("flow-edge-label-on-select", be === "selected"), W.classList.toggle("flow-edge-label-selected", !!L.selected), L.class ? W.classList.add(...L.class.split(" ").filter(Boolean)) : y && W.classList.remove(...y.split(" ").filter(Boolean)));
      }), r(() => {
        if (m) {
          const I = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          I && Io(I, m);
        }
        k?.(), P(), s.removeEventListener("contextmenu", $), s.removeEventListener("dblclick", M), s.removeEventListener("pointerdown", T, !0), s.removeEventListener("pointerdown", v), s.removeEventListener("pointermove", w), s.removeEventListener("keydown", N), s.removeEventListener("focus", C), s.removeEventListener("blur", R), s.removeEventListener("mousedown", O), s.removeEventListener("mouseenter", Y), s.removeEventListener("mouseleave", D), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function Kg(t, e) {
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
        const s = kt(i, t._nodeMap, t._config.nodeOrigin), a = kt(r, t._nodeMap, t._config.nodeOrigin);
        let l, c, d, u;
        if (o.type === "floating") {
          const h = ya(s, a);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const g = Ht(d, h.sourcePos, null, o.markerStart), p = Ht(u, h.targetPos, null, o.markerEnd), m = ao(o, s, a, h.sourcePos, h.targetPos, g, p, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = m.path, c = m.labelPosition;
        } else {
          const h = t._container;
          let g, p;
          if (h) {
            const _ = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), E = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (_) {
              const S = _.getBoundingClientRect();
              g = { x: (S.left + S.right) / 2, y: (S.top + S.bottom) / 2 };
            }
            if (E) {
              const S = E.getBoundingClientRect();
              p = { x: (S.left + S.right) / 2, y: (S.top + S.bottom) / 2 };
            }
          }
          const m = h ? co(h, o.source, o.sourceHandle, "source", i, p) : i?.sourcePosition ?? "bottom", y = h ? co(h, o.target, o.targetHandle, "target", r, g) : r?.targetPosition ?? "top";
          d = Ut(s, m, t._shapeRegistry, t._config.nodeOrigin), u = Ut(a, y, t._shapeRegistry, t._config.nodeOrigin);
          const x = Ht(d, m, null, o.markerStart), P = Ht(u, y, null, o.markerEnd), b = ao(o, s, a, m, y, x, P, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          l = b.path, c = b.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", l);
          const g = f.parentElement?.querySelector("path:first-child");
          g && g !== f && g.setAttribute("d", l);
        }
        if (wa(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const g = va(t._id, o.id), p = o.gradientDirection === "target-source";
            _a(
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
              const g = f.getTotalLength(), p = o.labelStartOffset ?? 30, m = f.getPointAtLength(Math.min(p, g / 2));
              h.style.left = `${m.x}px`, h.style.top = `${m.y}px`;
            }
          }
          if (o.labelEnd && f) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const g = f.getTotalLength(), p = o.labelEndOffset ?? 30, m = f.getPointAtLength(Math.max(g - p, g / 2));
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
function Jg(t) {
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
              $r(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = ra(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Qg = 0;
function ep(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function tp(t, e) {
  return t ? !(t.maxX < e.minX || t.minX > e.maxX || t.maxY < e.minY || t.minY > e.maxY) : !0;
}
function np(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Qg}`,
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
      _shapeRegistry: { ...sa, ...e.shapeTypes },
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
          const g = h.gap * a, p = h.variant === "cross" ? g / 2 : g;
          d.push(ep(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${p}px ${p}px, ${p}px ${p}px`), f.push(`${l}px ${c}px, ${l}px ${c}px`)) : (u.push(`${g}px ${g}px`), f.push(`${l}px ${c}px`));
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
      _shortcuts: Vf(e.keyboardShortcuts),
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
      _computeEngine: new yh(),
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
      _spatialGrid: new Uu(),
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
        this._nodeMap = na(this.nodes), ih(this._childrenIds, this.nodes);
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
          const p = kt(g, d, u), m = {
            id: g.id,
            x: p.position.x,
            y: p.position.y,
            width: p.dimensions?.width ?? we,
            height: p.dimensions?.height ?? _e
          };
          f.insert(g.id, m.x, m.y, m.width, m.height), !g.hidden && h.push(m);
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
        const g = new Set(s), p = [];
        for (const m of g) {
          const y = f?.find((P) => P.id === m);
          y && p.push(y);
          const x = a?.find((P) => P.id === m);
          x && p.push(x);
        }
        for (const m of d) {
          let y = g.has(m.source) || g.has(m.target);
          if (!y) {
            const x = u.get(m.id);
            if (x) {
              for (const P of p)
                if (P.x < x.maxX + ht && P.x + P.width > x.minX - ht && P.y < x.maxY + ht && P.y + P.height > x.minY - ht) {
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
        const d = e.cullingBuffer ?? 100, u = ju(this.viewport, l, c, d), h = t.raw(this._spatialGrid).query(u), g = this._draggingNodeIds, p = /* @__PURE__ */ new Set(), m = (P) => {
          const b = this._nodeMap.get(P);
          if (!b || b.hidden) return;
          const _ = b.dimensions?.width ?? 150, E = b.dimensions?.height ?? 50, S = b.parentId ? ti(b, this._nodeMap, this._config.nodeOrigin) : b.position;
          !(S.x + _ < u.minX || S.x > u.maxX || S.y + E < u.minY || S.y > u.maxY) && p.add(P);
        };
        for (const P of h) m(P);
        if (g)
          for (const P of g)
            h.has(P) || m(P);
        for (const [P, b] of this._nodeElements) {
          const _ = p.has(P) ? "" : "none";
          b.style.display !== _ && (b.style.display = _);
        }
        const y = this._culledEdgeIds, x = /* @__PURE__ */ new Set();
        for (const [P, b] of this._edgeSvgElements) {
          const _ = this._edgeMap.get(P);
          if (!_) continue;
          const E = this._nodeMap.get(_.source)?.hidden, S = this._nodeMap.get(_.target)?.hidden;
          if (_.hidden || _._hiddenByCollapse || E || S)
            continue;
          const A = p.has(_.source) || p.has(_.target) || tp(this._edgeCorridors.get(P), u), $ = !y.has(P);
          A !== $ && (b.style.display = A ? "" : "none"), A || x.add(P);
        }
        this._visibleNodeIds = p, this._culledEdgeIds = x;
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
        return a ? ti(a, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && $r(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new af(eo), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let a = null;
          s === "fill" ? a = "100%" : typeof s == "number" && Number.isFinite(s) ? a = `${s}px` : typeof s == "string" && s.trim() && (a = s.trim()), a !== null && this._container.style.setProperty("--flow-container-height", a);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = ra(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Mt(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new Ju(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new mh(this._container, s);
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
          const a = this._container, { Doc: l, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new l(), g = new c(h), p = new d(h, this, f.provider), m = new u(g, f.user);
          if (He.set(a, { bridge: p, awareness: m, doc: h }), f.provider.connect(h, g), f.cursors !== !1) {
            let y = !1;
            const x = f.throttle ?? 20, P = (E) => {
              if (y) return;
              y = !0;
              const S = a.getBoundingClientRect(), A = this._viewportLive ?? this.viewport, $ = (E.clientX - S.left - A.x) / A.zoom, M = (E.clientY - S.top - A.y) / A.zoom;
              m.updateCursor({ x: $, y: M }), setTimeout(() => {
                y = !1;
              }, x);
            }, b = () => {
              m.updateCursor(null);
            };
            a.addEventListener("mousemove", P), a.addEventListener("mouseleave", b);
            const _ = He.get(a);
            _.cursorCleanup = () => {
              a.removeEventListener("mousemove", P), a.removeEventListener("mouseleave", b);
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
        }), this._panZoom = qu(this._container, {
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
          a && (this._handleDelegationCleanup = gs(a, this), this._handleDelegationEl = a);
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
        !a || a === s || (this._handleDelegationCleanup?.(), this._handleDelegationCleanup = null, this._handleDelegationEl = null, !this._handleDelegationTornDown && (this._handleDelegationCleanup = gs(s, this), this._handleDelegationEl = s, V("init", `flowCanvas "${this._id}" re-bound its delegated handle pointerdown listener to a replaced .flow-viewport`)));
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
        if (s && (this._longPressCleanup = qf(
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
          if (Ze(s.key, l.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (Ze(s.key, l.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && ke(this._container);
            return;
          }
          if (Ze(s.key, l.delete)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (Ze(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (Ze(s.key, l.moveNodes)) {
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
                const f = Array.isArray(l.moveNodes) ? l.moveNodes : [l.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, g = f.findIndex((p) => (p.length === 1 ? p.toLowerCase() : p) === h);
                g === 0 ? u = -c : g === 1 ? u = c : g === 2 ? d = -c : g === 3 && (d = c);
              }
            }
            Bf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && Xr(h)) {
                h.position.x += d, h.position.y += u;
                const g = this._container ? He.get(this._container) : void 0;
                g?.bridge && g.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && Ze(s.key, l.undo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && Ze(s.key, l.redo)) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (a === "INPUT" || a === "TEXTAREA") return;
            Ze(s.key, l.copy) ? (s.preventDefault(), this.copy()) : Ze(s.key, l.paste) ? (s.preventDefault(), this.paste()) : Ze(s.key, l.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = df(this._container, {
          getState: () => ({
            nodes: io(this.nodes, this._nodeMap, this._config.nodeOrigin),
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
          this._controls = yf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: a,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Go }),
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
        this._selectionBox = wf(this._container), this._lasso = vf(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
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
          const l = io(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Ef(l, u) : xf(l, u), h = new Set(f.map((g) => g.id));
            if (c = this.nodes.filter((g) => h.has(g.id)), this._config.lassoSelectsEdges)
              for (const g of this.edges) {
                if (g.hidden) continue;
                const p = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(g.id)}"] path`
                );
                if (!p) continue;
                const m = p.getTotalLength(), y = Math.max(10, Math.ceil(m / 20));
                let x = 0;
                for (let b = 0; b <= y; b++) {
                  const _ = p.getPointAtLength(b / y * m);
                  xi(_.x, _.y, u) && x++;
                }
                (this._selectionEffectiveMode === "full" ? x === y + 1 : x > 0) && d.push(g.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Wu(l, u, this._config.nodeOrigin) : Xu(l, u, this._config.nodeOrigin), h = new Set(f.map((g) => g.id));
            c = this.nodes.filter((g) => h.has(g.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!Qo(u) || u.hidden) continue;
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
              const m = l.dataTransfer.getData(p);
              if (m) {
                c = p, d = m;
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
            const f = Nr(
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
            const p = Math.round(h), m = Math.round(g), y = u.dimensions;
            if (y && Math.abs((y.width ?? 0) - p) < 1 && Math.abs((y.height ?? 0) - m) < 1)
              continue;
            const x = Ah(
              { width: p, height: m },
              u.minDimensions,
              u.maxDimensions
            );
            u.dimensions = x, a.add(d), u.parentId && this._layoutDedup?.safeLayoutChildren(u.parentId);
          }
          a.size > 0 && this._commitNodeGeometry([...a]);
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = Mh((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && kh(e, s, e.wireEvents);
          const a = Lh(this, s), l = bh(this, s);
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
        for (const [, s] of aa().entries())
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
        return this._layoutDedup ? Th(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? He.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let a;
        try {
          ({ captureFlowImage: a } = await Promise.resolve().then(() => Mm));
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
      Dh(i),
      Hh(i),
      Rh(i),
      Vh(i),
      qh(i),
      wg(i),
      bg(i),
      xg(i),
      Eg(i),
      Ng(i),
      Ig(i),
      $g(i),
      Kg(i, t),
      Jg(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, a) => {
      lf(s, a);
    }, n;
  });
}
function Vs(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function op(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: a, snapToGrid: l = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let g = { x: 0, y: 0 };
  function p(x) {
    const P = s();
    return {
      x: (x.x - P.x) / P.zoom,
      y: (x.y - P.y) / P.zoom
    };
  }
  const m = Ye(t), y = xc().subject(() => {
    const x = s(), P = a();
    return {
      x: P.x * x.zoom + x.x,
      y: P.y * x.zoom + x.y
    };
  }).on("start", (x) => {
    g = p(x), o?.({ nodeId: e, position: g, sourceEvent: x.sourceEvent });
  }).on("drag", (x) => {
    let P = p(x);
    l && (P = Vs(P, l));
    const b = {
      x: P.x - g.x,
      y: P.y - g.y
    };
    i?.({ nodeId: e, position: P, delta: b, sourceEvent: x.sourceEvent });
  }).on("end", (x) => {
    let P = p(x);
    l && (P = Vs(P, l)), r?.({ nodeId: e, position: P, sourceEvent: x.sourceEvent });
  });
  return d && y.container(() => d), h > 0 && y.clickDistance(h), y.filter((x) => {
    if (u?.() || f && x.target?.closest?.("." + f)) return !1;
    if (c) {
      const P = t.querySelector(c);
      return P ? P.contains(x.target) : !0;
    }
    return !0;
  }), m.call(y), {
    destroy() {
      m.on(".drag", null);
    }
  };
}
function ip(t, e) {
  const n = Zt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? we,
    height: t.dimensions?.height ?? _e
  };
}
function sp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, a = 1 / 0, l = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, u = t.x + t.width, f = t.y + t.height;
  for (const h of e) {
    const g = h.x + h.width / 2, p = h.y + h.height / 2, m = h.x + h.width, y = h.y + h.height, x = [
      [t.x, h.x],
      // left-left
      [u, m],
      // right-right
      [c, g],
      // center-center
      [t.x, m],
      // left-right
      [u, h.x]
      // right-left
    ];
    for (const [b, _] of x) {
      const E = _ - b;
      Math.abs(E) <= n && (i.add(_), Math.abs(E) < Math.abs(a) && (a = E, r = E));
    }
    const P = [
      [t.y, h.y],
      // top-top
      [f, y],
      // bottom-bottom
      [d, p],
      // center-center
      [t.y, y],
      // top-bottom
      [f, h.y]
      // bottom-top
    ];
    for (const [b, _] of P) {
      const E = _ - b;
      Math.abs(E) <= n && (o.add(_), Math.abs(E) < Math.abs(l) && (l = E, s = E));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function rp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function ap(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const a = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (a < r) {
      r = a;
      const { source: l, target: c } = rp(e, s.center, t, s.id);
      i = { source: l, target: c, targetId: s.id, distance: a, targetCenter: s.center };
    }
  }
  return i;
}
const lp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let cp = 0;
function Bs(t, e, n) {
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
function dp(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function up(t, e, n) {
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
function fp(t, e, n) {
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
function hp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, a = !1, l = null, c = !1, d = null, u = null, f = null, h = null, g = null, p = null, m = !1, y = -1, x = null, P = !1, b = [], _ = "", E = [], S = null;
      i(() => {
        if (!e.isConnected) return;
        const k = o(n);
        if (!k || k.hidden) return;
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        const w = k.parentId ? v.getAbsolutePosition(k.id) : k.position ?? { x: 0, y: 0 }, N = k.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], C = k.dimensions?.width ?? 150, R = k.dimensions?.height ?? 40;
        e.style.left = w.x - C * N[0] + "px", e.style.top = w.y - R * N[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const k = o(n);
        if (!k) return;
        if (e.dataset.flowNodeId = k.id, k.type && (e.dataset.flowNodeType = k.type), !P) {
          const z = e.closest("[x-data]"), q = z ? t.$data(z) : null;
          let X = !1;
          if (q?._config?.nodeTypes) {
            const j = k.type ?? "default", H = q._config.nodeTypes[j] ?? q._config.nodeTypes.default;
            if (typeof H == "string") {
              const te = document.querySelector(H);
              te?.content && (e.appendChild(te.content.cloneNode(!0)), X = !0);
            } else typeof H == "function" && (H(k, e), X = !0);
          }
          if (!X && e.children.length === 0) {
            const j = document.createElement("div");
            j.setAttribute("x-flow-handle:target", "");
            const H = document.createElement("span");
            H.setAttribute("x-text", "node.data.label");
            const te = document.createElement("div");
            te.setAttribute("x-flow-handle:source", ""), e.appendChild(j), e.appendChild(H), e.appendChild(te), X = !0;
          }
          if (X)
            for (const j of Array.from(e.children))
              t.addScopeToNode(j, { node: k }), t.initTree(j);
          P = !0;
        }
        if (k.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), S !== k.id && (s?.destroy(), s = null, S = k.id);
        const v = t.$data(e.closest("[x-data]"));
        if (!v?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), k.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), k.dimensions) {
          const z = k.childLayout, q = k.fixedDimensions, X = (v._childrenIds?.get(k.id)?.length ?? 0) > 0;
          e.style.width = k.dimensions.width + "px", z || q || X ? e.style.height = k.dimensions.height + "px" : e.style.height = "";
        }
        v.selectedNodes.has(k.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!k.selected)), k._validationErrors && k._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const w = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], N = k.runState;
        for (const z of w)
          e.classList.remove(z);
        N && N !== "pending" && e.classList.add(`flow-node-${N}`);
        for (const z of b)
          e.classList.remove(z);
        const C = k.class ? k.class.split(/\s+/).filter(Boolean) : [];
        for (const z of C)
          e.classList.add(z);
        b = C;
        const R = k.shape ? `flow-node-${k.shape}` : "";
        _ !== R && (_ && e.classList.remove(_), R && e.classList.add(R), _ = R);
        const O = t.$data(e.closest("[data-flow-canvas]")), Y = k.shape && O?._shapeRegistry?.[k.shape];
        if (Y?.clipPath ? e.style.clipPath = Y.clipPath : e.style.clipPath = "", k.style) {
          const z = typeof k.style == "string" ? Object.fromEntries(k.style.split(";").filter(Boolean).map((X) => X.split(":").map((j) => j.trim()))) : k.style, q = [];
          for (const [X, j] of Object.entries(z))
            X && j && (e.style.setProperty(X, j), q.push(X));
          for (const X of E)
            q.includes(X) || e.style.removeProperty(X);
          E = q;
        } else if (E.length > 0) {
          for (const z of E)
            e.style.removeProperty(z);
          E = [];
        }
        if (k.rotation ? (e.style.transform = `rotate(${k.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", k.focusable ?? v._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", k.ariaRole ?? "group"), e.setAttribute("aria-label", k.ariaLabel ?? (k.data?.label ? `Node: ${k.data.label}` : `Node ${k.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), k.domAttributes)
          for (const [z, q] of Object.entries(k.domAttributes))
            z.startsWith("on") || lp.has(z.toLowerCase()) || e.setAttribute(z, q);
        Be(k) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), k.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const L = e.classList.contains("flow-node-condensed");
        k.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!k.condensed !== L && requestAnimationFrame(() => {
          k.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, V("condense", `Node "${k.id}" re-measured after condense toggle`, k.dimensions);
        }), k.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const I = k.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), I !== "visible" && e.classList.add(`flow-handles-${I}`);
        let F = oa(k, v._nodeMap);
        v._config?.elevateNodesOnSelect !== !1 && v.selectedNodes.has(k.id) && (F += k.type === "group" ? Math.max(1 - F, 0) : 1e3), m && (F += 1e3);
        const ne = k.type === "group" ? 0 : 2;
        if (F !== ne ? e.style.zIndex = String(F) : e.style.removeProperty("z-index"), !Xr(k)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const B = e.closest(".flow-container");
        s || (s = op(e, k.id, {
          container: B ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => v._animationLocked,
          noDragClassName: v._config?.noDragClassName ?? "nodrag",
          dragThreshold: v._config?.nodeDragThreshold ?? 0,
          getViewport: () => v.viewport,
          getNodePosition: () => {
            const z = v.getNode(k.id);
            return z ? z.parentId ? v.getAbsolutePosition(z.id) : { x: z.position.x, y: z.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: v._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: z, position: q, sourceEvent: X }) {
            e.classList.add("flow-node-dragging"), a = !1, c = !1, d = null;
            const j = v._container ? He.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !0), h?.destroy(), h = null, g = null, p && B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null, l = v._snapshotHistory?.() ?? null, V("drag", `Node "${z}" drag start`, q);
            const H = v.getNode(z);
            if (H) {
              if (v._config?.selectNodesOnDrag !== !1 && H.selectable !== !1 && !v.selectedNodes.has(z) && (mt(X, v._shortcuts?.multiSelect) || v.deselectAll(), v.selectedNodes.add(z), H.selected = !0, v._emitSelectionChange(), c = !0), v._emit("node-drag-start", { node: H }), v.selectedNodes.has(z) && v.selectedNodes.size > 1) {
                const te = yt(z, v.nodes);
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
            v._config?.autoPanOnNodeDrag !== !1 && B && (u = jr({
              container: B,
              speed: v._config?.autoPanSpeed ?? 15,
              onPan(te, Q) {
                const U = () => v._viewportLive ?? v.viewport, J = U().zoom || 1, se = { x: U().x, y: U().y };
                v._panZoom?.setViewport({
                  x: U().x - te,
                  y: U().y - Q,
                  zoom: J
                });
                const ie = se.x - U().x, G = se.y - U().y, ee = ie === 0 && G === 0, he = v.getNode(z);
                let ce = !1;
                if (he) {
                  const oe = he.position.x, ge = he.position.y;
                  he.position.x += ie / J, he.position.y += G / J;
                  const re = Rn(he.position, he, v._config?.nodeExtent);
                  he.position.x = re.x, he.position.y = re.y, ce = he.position.x === oe && he.position.y === ge;
                }
                if (d)
                  for (const [oe] of d) {
                    const ge = v.getNode(oe);
                    if (ge) {
                      ge.position.x += ie / J, ge.position.y += G / J;
                      const re = Rn(ge.position, ge, v._config?.nodeExtent);
                      ge.position.x = re.x, ge.position.y = re.y;
                    }
                  }
                return ee && ce;
              }
            }), X instanceof MouseEvent && u.updatePointer(X.clientX, X.clientY), u.start());
          },
          onDrag({ nodeId: z, position: q, delta: X, sourceEvent: j }) {
            a = !0;
            const H = v.getNode(z);
            if (H) {
              if (H.parentId) {
                const U = v.getAbsolutePosition(H.parentId);
                let J = q.x - U.x, se = q.y - U.y;
                const ie = H.dimensions ?? { width: 150, height: 50 }, G = v.getNode(H.parentId);
                if (G?.childLayout) {
                  m || (e.classList.add("flow-reorder-dragging"), x = H.parentId), m = !0;
                  const ee = H.extent !== "parent";
                  if (H.position.x = q.x - U.x, H.position.y = q.y - U.y, !ee && G.dimensions) {
                    const oe = Lo({ x: H.position.x, y: H.position.y }, ie, G.dimensions);
                    H.position.x = oe.x, H.position.y = oe.y;
                  }
                  const he = H.dimensions?.width ?? 150, ce = H.dimensions?.height ?? 50;
                  if (ee) {
                    const oe = G.dimensions?.width ?? 150, ge = G.dimensions?.height ?? 50, re = H.position.x + he / 2, pe = H.position.y + ce / 2, me = 12, Oe = x === H.parentId ? 0 : me, Pe = re >= Oe && re <= oe - Oe && pe >= Oe && pe <= ge - Oe, Ee = /* @__PURE__ */ new Set();
                    let ue = H.parentId;
                    for (; ue; )
                      Ee.add(ue), ue = v.getNode(ue)?.parentId;
                    const be = q.x + he / 2, Me = q.y + ce / 2, W = yt(H.id, v.nodes);
                    let ae = null;
                    const fe = v.nodes.filter(
                      (le) => le.id !== H.id && (le.droppable || le.childLayout) && !le.hidden && !W.has(le.id) && (Pe ? !Ee.has(le.id) : le.id !== H.parentId) && (!le.acceptsDrop || le.acceptsDrop(H))
                    );
                    for (const le of fe) {
                      const de = le.parentId ? v.getAbsolutePosition(le.id) : le.position, xe = le.dimensions?.width ?? 150, Se = le.dimensions?.height ?? 50, Te = le.id === p ? 0 : me;
                      be >= de.x + Te && be <= de.x + xe - Te && Me >= de.y + Te && Me <= de.y + Se - Te && (ae = le);
                    }
                    const ye = ae?.id ?? null;
                    if (ye !== p) {
                      p && B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), ye && B && B.querySelector(`[data-flow-node-id="${CSS.escape(ye)}"]`)?.classList.add("flow-node-drop-target"), p = ye;
                      const le = ye ? v.getNode(ye) : null, de = x;
                      if (le?.childLayout && ye !== x) {
                        de && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), x = ye;
                        const xe = v.nodes.filter(($e) => $e.parentId === ye && $e.id !== z).sort(($e, qe) => ($e.order ?? 1 / 0) - (qe.order ?? 1 / 0)), Se = xe.length, Te = [...xe];
                        Te.splice(Se, 0, H);
                        for (let $e = 0; $e < Te.length; $e++)
                          Te[$e].order = $e;
                        y = Se;
                        const Le = v._initialDimensions?.get(z), ze = { ...H, dimensions: Le ? { ...Le } : void 0 };
                        v.layoutChildren(ye, { excludeId: z, includeNode: ze, shallow: !0 }), v.propagateLayoutUp(ye, { includeNode: ze });
                      } else Pe && x !== H.parentId ? (de && de !== H.parentId && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), x = H.parentId, y = -1) : !ye && !Pe && (de && (v.layoutChildren(de, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(de, { omitFromComputation: z })), x = null, y = -1);
                    }
                  }
                  if (x) {
                    const oe = v.getNode(x), ge = oe?.childLayout ?? G.childLayout, re = v.nodes.filter((ue) => ue.parentId === x && ue.id !== z).sort((ue, be) => (ue.order ?? 1 / 0) - (be.order ?? 1 / 0));
                    let pe, me;
                    if (x !== H.parentId) {
                      const ue = oe?.parentId ? v.getAbsolutePosition(x) : oe?.position ?? { x: 0, y: 0 };
                      pe = q.x - ue.x, me = q.y - ue.y;
                    } else
                      pe = H.position.x, me = H.position.y;
                    const Oe = ge.swapThreshold ?? 0.5;
                    if (y === -1)
                      if (x === H.parentId) {
                        const ue = H.order ?? 0;
                        y = re.filter((be) => (be.order ?? 0) < ue).length;
                      } else
                        y = re.length;
                    const Pe = y;
                    let Ee = re.length;
                    for (let ue = 0; ue < re.length; ue++) {
                      const be = re[ue], Me = be.dimensions?.width ?? 150, W = be.dimensions?.height ?? 50, ae = ue < Pe ? 1 - Oe : Oe, fe = be.position.y + W * ae, ye = be.position.x + Me * ae;
                      if (ge.direction === "grid") {
                        const le = {
                          x: pe + he / 2,
                          y: me + ce / 2
                        }, de = be.position.y + W / 2;
                        if (le.y < be.position.y) {
                          Ee = ue;
                          break;
                        }
                        if (Math.abs(le.y - de) < W / 2 && le.x < ye) {
                          Ee = ue;
                          break;
                        }
                      } else if (ge.direction === "vertical") {
                        if ((ue < Pe ? me : me + ce) < fe) {
                          Ee = ue;
                          break;
                        }
                      } else if ((ue < Pe ? pe : pe + he) < ye) {
                        Ee = ue;
                        break;
                      }
                    }
                    if (Ee !== y) {
                      y = Ee;
                      const ue = [...re];
                      ue.splice(Ee, 0, H);
                      for (let fe = 0; fe < ue.length; fe++)
                        ue[fe].order = fe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), v._layoutAnimFrame && cancelAnimationFrame(v._layoutAnimFrame);
                      const Me = H.id, W = x, ae = W !== H.parentId;
                      v._layoutAnimFrame = requestAnimationFrame(() => {
                        if (ae && W) {
                          const de = v.getNode(Me);
                          let xe;
                          if (de) {
                            const Se = v._initialDimensions?.get(Me);
                            xe = { ...de, dimensions: Se ? { ...Se } : void 0 };
                          }
                          v.layoutChildren(W, {
                            excludeId: Me,
                            includeNode: xe,
                            shallow: !0
                          }), v.propagateLayoutUp(W, {
                            includeNode: xe
                          });
                        } else
                          v.layoutChildren(W, Me, !0);
                        const fe = performance.now(), ye = 300, le = () => {
                          v._layoutAnimTick++, performance.now() - fe < ye ? v._layoutAnimFrame = requestAnimationFrame(le) : v._layoutAnimFrame = 0;
                        };
                        v._layoutAnimFrame = requestAnimationFrame(le);
                      });
                    }
                  }
                  u && j instanceof MouseEvent && u.updatePointer(j.clientX, j.clientY);
                  return;
                }
                if (H.extent === "parent" && G?.dimensions) {
                  const ee = Lo(
                    { x: J, y: se },
                    ie,
                    G.dimensions
                  );
                  J = ee.x, se = ee.y;
                } else if (Array.isArray(H.extent)) {
                  const ee = ia({ x: J, y: se }, H.extent, ie);
                  J = ee.x, se = ee.y;
                }
                if ((!H.extent || H.extent !== "parent") && (un(
                  G,
                  v._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!G?.childLayout) && G?.dimensions) {
                  const ce = Lo(
                    { x: J, y: se },
                    ie,
                    G.dimensions
                  );
                  J = ce.x, se = ce.y;
                }
                if (H.expandParent && G?.dimensions) {
                  const ee = sh(
                    { x: J, y: se },
                    ie,
                    G.dimensions
                  );
                  ee && (G.dimensions.width = ee.width, G.dimensions.height = ee.height);
                }
                H.position.x = J, H.position.y = se;
              } else {
                const U = Rn(q, H, v._config?.nodeExtent);
                H.position.x = U.x, H.position.y = U.y;
              }
              if (v._config?.snapToGrid) {
                const U = H.nodeOrigin ?? v._config?.nodeOrigin ?? [0, 0], J = H.dimensions?.width ?? 150, se = H.dimensions?.height ?? 40, ie = H.parentId ? v.getAbsolutePosition(H.id) : H.position;
                e.style.left = ie.x - J * U[0] + "px", e.style.top = ie.y - se * U[1] + "px", v._layoutAnimTick++;
              }
              if (v._emit("node-drag", { node: H, position: q }), d)
                for (const [U, J] of d) {
                  const se = v.getNode(U);
                  if (se) {
                    let ie = J.x + X.x, G = J.y + X.y;
                    const ee = Rn({ x: ie, y: G }, se, v._config?.nodeExtent);
                    se.position.x = ee.x, se.position.y = ee.y;
                  }
                }
              const Q = v._config?.helperLines;
              if (Q) {
                const U = typeof Q == "object" ? Q.snap ?? !0 : !0, J = typeof Q == "object" ? Q.threshold ?? 5 : 5, se = (oe) => {
                  const ge = oe.parentId ? v.getAbsolutePosition(oe.id) : oe.position;
                  return ip({ ...oe, position: ge }, v._config?.nodeOrigin);
                }, G = (v.selectedNodes.size > 1 && v.selectedNodes.has(z) ? v.nodes.filter((oe) => v.selectedNodes.has(oe.id)) : [H]).map(se), ee = {
                  x: Math.min(...G.map((oe) => oe.x)),
                  y: Math.min(...G.map((oe) => oe.y)),
                  width: Math.max(...G.map((oe) => oe.x + oe.width)) - Math.min(...G.map((oe) => oe.x)),
                  height: Math.max(...G.map((oe) => oe.y + oe.height)) - Math.min(...G.map((oe) => oe.y))
                }, he = v.nodes.filter(
                  (oe) => !v.selectedNodes.has(oe.id) && oe.id !== z && oe.hidden !== !0 && oe.filtered !== !0
                ).map(se), ce = sp(ee, he, J);
                if (U && (ce.snapOffset.x !== 0 || ce.snapOffset.y !== 0) && (H.position.x += ce.snapOffset.x, H.position.y += ce.snapOffset.y, d))
                  for (const [oe] of d) {
                    const ge = v.getNode(oe);
                    ge && (ge.position.x += ce.snapOffset.x, ge.position.y += ce.snapOffset.y);
                  }
                if (f?.remove(), ce.horizontal.length > 0 || ce.vertical.length > 0) {
                  const oe = B?.querySelector(".flow-viewport");
                  if (oe) {
                    const ge = v.nodes.map(se);
                    f = fp(ce.horizontal, ce.vertical, ge), oe.appendChild(f);
                  }
                } else
                  f = null;
                v._emit("helper-lines-change", {
                  horizontal: ce.horizontal,
                  vertical: ce.vertical
                });
              }
            }
            if (v._config?.preventOverlap) {
              const Q = typeof v._config.preventOverlap == "number" ? v._config.preventOverlap : 5, U = H.dimensions?.width ?? we, J = H.dimensions?.height ?? _e, se = v.selectedNodes, ie = v.nodes.filter((ee) => ee.id !== H.id && !ee.hidden && !se.has(ee.id)).map((ee) => jt(ee, v._config?.nodeOrigin)), G = $h(H.position, U, J, ie, Q);
              H.position.x = G.x, H.position.y = G.y;
            }
            if (!H.parentId) {
              const Q = yt(H.id, v.nodes), U = v.nodes.filter(
                (ee) => ee.id !== H.id && ee.droppable && !ee.hidden && !Q.has(ee.id) && (!ee.acceptsDrop || ee.acceptsDrop(H))
              ), J = jt(H, v._config?.nodeOrigin);
              let se = null;
              const ie = 12;
              for (const ee of U) {
                const he = ee.parentId ? v.getAbsolutePosition(ee.id) : ee.position, ce = ee.dimensions?.width ?? we, oe = ee.dimensions?.height ?? _e, ge = J.x + J.width / 2, re = J.y + J.height / 2, pe = ee.id === p ? 0 : ie;
                ge >= he.x + pe && ge <= he.x + ce - pe && re >= he.y + pe && re <= he.y + oe - pe && (se = ee);
              }
              const G = se?.id ?? null;
              G !== p && (p && B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), G && B && B.querySelector(`[data-flow-node-id="${CSS.escape(G)}"]`)?.classList.add("flow-node-drop-target"), p = G);
            }
            if (v._config?.proximityConnect) {
              const Q = v._config.proximityConnectDistance ?? 150, U = H.dimensions ?? { width: 150, height: 50 }, J = {
                x: H.position.x + U.width / 2,
                y: H.position.y + U.height / 2
              }, se = v.nodes.filter((G) => G.id !== H.id && !G.hidden).map((G) => ({
                id: G.id,
                center: {
                  x: G.position.x + (G.dimensions?.width ?? 150) / 2,
                  y: G.position.y + (G.dimensions?.height ?? 50) / 2
                }
              })), ie = ap(H.id, J, se, Q);
              if (ie)
                if (v.edges.some(
                  (ee) => ee.source === ie.source && ee.target === ie.target || ee.source === ie.target && ee.target === ie.source
                ))
                  h?.destroy(), h = null, g = null;
                else {
                  if (g = ie, !h) {
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
                    toX: ie.targetCenter.x,
                    toY: ie.targetCenter.y,
                    source: ie.source
                  });
                }
              else
                h?.destroy(), h = null, g = null;
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
          onDragEnd({ nodeId: z, position: q }) {
            const X = d ? [z, ...d.keys()] : [z];
            v._draggingNodeIds.clear(), e.classList.remove("flow-node-dragging"), V("drag", `Node "${z}" drag end`, q);
            const j = v._container ? He.get(v._container) : void 0;
            j?.bridge && j.bridge.setDragging(z, !1), u?.stop(), u = null, f?.remove(), f = null, v._config?.helperLines && v._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const H = v.getNode(z);
            if (H && v._emit("node-drag-end", { node: H, position: q }), m && H?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const te = x;
              m = !1, y = -1, x = null, v._layoutAnimFrame && (cancelAnimationFrame(v._layoutAnimFrame), v._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), p ? (B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), $o(v, z, p), p = null) : te && te !== H.parentId ? (v.layoutChildren(te, { omitFromComputation: z, shallow: !0 }), v.propagateLayoutUp(te, { omitFromComputation: z }), v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })) : (v.layoutChildren(H.parentId), v._emit("child-reorder", {
                nodeId: z,
                parentId: H.parentId,
                order: H.order
              })), d = null, v._layoutAnimTick++, v._commitNodeGeometry(X), Bs(v, a, l), l = null, a = !1;
              return;
            }
            if (H && p)
              B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), $o(v, z, p), p = null;
            else if (H && H.parentId && !p) {
              const te = un(
                v.getNode(H.parentId),
                v._config?.childValidationRules ?? {}
              ), Q = v.getNode(H.parentId);
              if (!te?.preventChildEscape && !Q?.childLayout && Q?.dimensions) {
                const U = H.position.x, J = H.position.y, se = H.dimensions?.width ?? 150, ie = H.dimensions?.height ?? 50;
                (U + se < 0 || J + ie < 0 || U > Q.dimensions.width || J > Q.dimensions.height) && $o(v, z, null);
              }
              p = null;
            } else
              p && B && B.querySelector(`[data-flow-node-id="${CSS.escape(p)}"]`)?.classList.remove("flow-node-drop-target"), p = null;
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
                if (pt(U, v.edges, { preventCycles: v._config?.preventCycles }) && gt(U, v._config?.connectionRules, v._nodeMap) && (B ? nt(B, U, v.edges) : !0) && (B ? tt(B, U) : !0) && (!v._config.isValidConnection || v._config.isValidConnection(U))) {
                  if (v._config.proximityConnectConfirm) {
                    const he = B?.querySelector(`[data-flow-node-id="${CSS.escape(te.source)}"]`), ce = B?.querySelector(`[data-flow-node-id="${CSS.escape(te.target)}"]`);
                    he?.classList.add("flow-proximity-confirm"), ce?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      he?.classList.remove("flow-proximity-confirm"), ce?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const ee = `e-${te.source}-${te.target}-${Date.now()}-${cp++}`;
                  v.addEdges({ id: ee, ...U }), v._emit("connect", { connection: U });
                }
              }
            } else
              h?.destroy(), h = null, g = null;
            d = null, a && (v._layoutAnimTick++, v._commitNodeGeometry(X)), Bs(v, a, l), l = null, a = !1;
          }
        }));
      });
      {
        const k = t.$data(e.closest("[x-data]"));
        if (k?._config?.easyConnect) {
          const v = k._config.easyConnectKey ?? "alt", w = (N) => {
            if (!dp(N, v) || N.target.closest("[data-flow-handle-type]")) return;
            const C = t.$data(e.closest("[x-data]"));
            if (!C || C._animationLocked || C._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const O = C.getNode(R.id);
            if (!O || O.connectable === !1) return;
            N.preventDefault(), N.stopPropagation(), N.stopImmediatePropagation();
            const Y = up(e, N.clientX, N.clientY), D = Y?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const L = e.closest(".flow-container");
            if (!L) return;
            const I = C._viewportLive ?? C.viewport, F = I?.zoom || 1, K = I?.x || 0, ne = I?.y || 0, Z = L.getBoundingClientRect();
            let B, z;
            if (Y) {
              const J = Y.getBoundingClientRect();
              B = (J.left + J.width / 2 - Z.left - K) / F, z = (J.top + J.height / 2 - Z.top - ne) / F;
            } else {
              const J = e.getBoundingClientRect();
              B = (J.left + J.width / 2 - Z.left - K) / F, z = (J.top + J.height / 2 - Z.top - ne) / F;
            }
            C._emit("connect-start", { source: R.id, sourceHandle: D });
            const q = Wt({
              connectionLineType: C._config?.connectionLineType,
              connectionLineStyle: C._config?.connectionLineStyle,
              connectionLine: C._config?.connectionLine
            }), X = L.querySelector(".flow-viewport");
            X && X.appendChild(q.svg), q.update({ fromX: B, fromY: z, toX: B, toY: z, source: R.id, sourceHandle: D }), C.pendingConnection = { source: R.id, sourceHandle: D, position: { x: B, y: z } }, bn(L, R.id, D, C);
            let j = wo(L, C, N.clientX, N.clientY), H = null;
            const te = C._config?.connectionSnapRadius ?? 20, Q = (J) => {
              const se = C.screenToFlowPosition(J.clientX, J.clientY), ie = _n({
                containerEl: L,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: se,
                connectionSnapRadius: te,
                getNode: (G) => C.getNode(G),
                toFlowPosition: (G, ee) => C.screenToFlowPosition(G, ee)
              });
              ie.element !== H && (H?.classList.remove("flow-handle-active"), ie.element?.classList.add("flow-handle-active"), H = ie.element), q.update({ fromX: B, fromY: z, toX: ie.position.x, toY: ie.position.y, source: R.id, sourceHandle: D }), C.pendingConnection = { ...C.pendingConnection, position: ie.position }, j?.updatePointer(J.clientX, J.clientY);
            }, U = async (J) => {
              j?.stop(), j = null, document.removeEventListener("pointermove", Q), document.removeEventListener("pointerup", U), q.destroy(), H?.classList.remove("flow-handle-active"), ke(L), e.classList.remove("flow-easy-connecting");
              const se = C.screenToFlowPosition(J.clientX, J.clientY), ie = { source: R.id, sourceHandle: D, position: se };
              C.pendingConnection = null;
              let G = H;
              if (G || (G = document.elementFromPoint(J.clientX, J.clientY)?.closest('[data-flow-handle-type="target"]')), !G) {
                C._emit("connect-end", { connection: null, ...ie });
                return;
              }
              const he = G.closest("[x-flow-node]")?.dataset.flowNodeId, ce = G.dataset.flowHandleId ?? "target";
              if (!he) {
                C._emit("connect-end", { connection: null, ...ie });
                return;
              }
              const oe = { source: R.id, sourceHandle: D, target: he, targetHandle: ce }, ge = await Gr({ connection: oe, canvas: C, containerEl: L });
              C._emit("connect-end", {
                connection: ge.applied ? oe : null,
                ...ie
              });
            };
            document.addEventListener("pointermove", Q), document.addEventListener("pointerup", U);
          };
          e.addEventListener("pointerdown", w, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", w, { capture: !0 });
          });
        }
      }
      const A = (k) => {
        if (k.key !== "Enter" && k.key !== " ") return;
        k.preventDefault();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        w && (w._animationLocked || Qo(v) && (w._emit("node-click", { node: v, event: k }), k.stopPropagation(), mt(k, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1) : (w.selectedNodes.add(v.id), v.selected = !0) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0), w._emitSelectionChange()));
      };
      e.addEventListener("keydown", A);
      const $ = () => {
        const k = t.$data(e.closest("[x-data]"));
        if (!k?._config?.autoPanOnNodeFocus) return;
        const v = o(n);
        if (!v) return;
        const w = v.parentId ? k.getAbsolutePosition(v.id) : v.position;
        k.setCenter(
          w.x + (v.dimensions?.width ?? 150) / 2,
          w.y + (v.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", $);
      const M = (k) => {
        if (a) return;
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w && !w._animationLocked && (w._emit("node-click", { node: v, event: k }), !!Qo(v))) {
          if (k.stopPropagation(), c) {
            c = !1;
            return;
          }
          mt(k, w._shortcuts?.multiSelect) ? w.selectedNodes.has(v.id) ? (w.selectedNodes.delete(v.id), v.selected = !1, e.classList.remove("flow-node-selected"), V("selection", `Node "${v.id}" deselected (shift)`)) : (w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), V("selection", `Node "${v.id}" selected (shift)`)) : (w.deselectAll(), w.selectedNodes.add(v.id), v.selected = !0, e.classList.add("flow-node-selected"), V("selection", `Node "${v.id}" selected`)), w._emitSelectionChange();
        }
      };
      e.addEventListener("click", M);
      const T = (k) => {
        k.preventDefault(), k.stopPropagation();
        const v = o(n);
        if (!v) return;
        const w = t.$data(e.closest("[x-data]"));
        if (w)
          if (w.selectedNodes.size > 1 && w.selectedNodes.has(v.id)) {
            const N = w.nodes.filter((C) => w.selectedNodes.has(C.id));
            w._emit("selection-context-menu", { nodes: N, event: k });
          } else
            w._emit("node-context-menu", { node: v, event: k });
      };
      e.addEventListener("contextmenu", T), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const k = o(n);
        if (!k) return;
        const v = t.$data(e.closest("[x-data]"));
        k.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, V("init", `Node "${k.id}" measured`, k.dimensions), v?._nodeElements?.set(k.id, e), k.resizeObserver !== !1 && v?._resizeObserver && v._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", A), e.removeEventListener("focus", $), e.removeEventListener("click", M), e.removeEventListener("contextmenu", T);
        const k = e.dataset.flowNodeId;
        if (k) {
          const v = t.$data(e.closest("[x-data]"));
          v?._nodeElements?.delete(k), v?._resizeObserver?.unobserve(e), v?._draggingNodeIds?.delete(k);
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
function gp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: a, maxWidth: l, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let g = o.width;
  u ? g = o.width + e.x : d && (g = o.width - e.x);
  let p = o.height;
  h ? p = o.height + e.y : f && (p = o.height - e.y), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)), r && (g = r[0] * Math.round(g / r[0]), p = r[1] * Math.round(p / r[1]), g = Math.max(s, Math.min(l, g)), p = Math.max(a, Math.min(c, p)));
  const m = g - o.width, y = p - o.height, x = d ? n.x - m : n.x, P = f ? n.y - y : n.y;
  return {
    position: { x, y: P },
    dimensions: { width: g, height: p }
  };
}
const xa = ["top-left", "top-right", "bottom-left", "bottom-right"], Ea = ["top", "right", "bottom", "left"], pp = [...xa, ...Ea], mp = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function yp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = wp(o);
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
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = mp[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const g = e.closest("[x-data]");
          if (!g) return;
          const p = t.$data(g), m = h.dataset.flowNodeId;
          if (!m || !p) return;
          const y = p.getNode(m);
          if (!y || !us(y)) return;
          y.fixedDimensions = !0;
          const x = { ...l };
          if (y.minDimensions?.width != null && l.minWidth === At.minWidth && (x.minWidth = y.minDimensions.width), y.minDimensions?.height != null && l.minHeight === At.minHeight && (x.minHeight = y.minDimensions.height), y.maxDimensions?.width != null && l.maxWidth === At.maxWidth && (x.maxWidth = y.maxDimensions.width), y.maxDimensions?.height != null && l.maxHeight === At.maxHeight && (x.maxHeight = y.maxDimensions.height), !y.dimensions) {
            const M = p.viewport?.zoom || 1, T = h.getBoundingClientRect();
            y.dimensions = { width: T.width / M, height: T.height / M };
          }
          const P = { x: y.position.x, y: y.position.y }, b = { width: y.dimensions.width, height: y.dimensions.height }, _ = p.viewport?.zoom || 1, E = f.clientX, S = f.clientY;
          p._captureHistory?.(), V("resize", `Resize start on "${m}" (${d})`, b), p._emit("node-resize-start", { node: y, dimensions: { ...b } });
          const A = (M) => {
            const T = {
              x: (M.clientX - E) / _,
              y: (M.clientY - S) / _
            }, k = gp(
              d,
              T,
              P,
              b,
              x,
              p._config?.snapToGrid ?? !1
            );
            if (y.position.x = k.position.x, y.position.y = k.position.y, y.dimensions.width = k.dimensions.width, y.dimensions.height = k.dimensions.height, y.parentId) {
              const v = p.getAbsolutePosition(y.id);
              h.style.left = `${v.x}px`, h.style.top = `${v.y}px`;
            } else
              h.style.left = `${k.position.x}px`, h.style.top = `${k.position.y}px`;
            h.style.width = `${k.dimensions.width}px`, h.style.height = `${k.dimensions.height}px`, p._layoutAnimTick++, p._emit("node-resize", { node: y, dimensions: { ...k.dimensions } });
          }, $ = () => {
            document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", $), document.removeEventListener("pointercancel", $), V("resize", `Resize end on "${m}"`, y.dimensions), p._emit("node-resize-end", { node: y, dimensions: { ...y.dimensions } });
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
        const p = !us(g);
        for (const m of c)
          m.style.display = p ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function wp(t) {
  if (t.includes("corners"))
    return xa;
  if (t.includes("edges"))
    return Ea;
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
  return pp;
}
function vp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function _p(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function bp(t) {
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
        const m = u.getBoundingClientRect(), y = m.left + m.width / 2, x = m.top + m.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const P = (_) => {
          let E = vp(
            _.clientX,
            _.clientY,
            y,
            x
          );
          a && (E = _p(E, l)), p.rotation = E;
        }, b = () => {
          document.removeEventListener("pointermove", P), document.removeEventListener("pointerup", b), e.style.cursor = "grab", h._emit("node-rotate-end", { node: p, rotation: p.rotation });
        };
        document.addEventListener("pointermove", P), document.addEventListener("pointerup", b);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function xp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const Ep = "application/alpineflow";
function Cp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(Ep, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function Sp(t) {
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
function kp(t) {
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
        for (const [p, m] of a)
          c.has(p) || (t.destroyTree(m), m.remove(), a.delete(p), i._edgeSvgElements?.delete(p));
        for (const p of l) {
          if (a.has(p.id)) continue;
          const m = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          m.setAttribute("class", "flow-edge-svg");
          const y = document.createElementNS("http://www.w3.org/2000/svg", "g");
          m.appendChild(y), t.addScopeToNode(y, { edge: p }), y.setAttribute("x-flow-edge", "edge"), t.mutateDom(() => {
            s.appendChild(m);
          }), a.set(p.id, m), i._edgeSvgElements?.set(p.id, m), t.initTree(y);
        }
        const u = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        u && u.remove();
        const f = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set();
        if (f) {
          const p = Sp(
            l
          );
          for (const m of p)
            h.add(m.primaryId), g.add(m.mirrorId);
        }
        for (const p of l) {
          const m = h.has(p.id), y = g.has(p.id);
          !!p._renderDualMarker !== m && (p._renderDualMarker = m ? !0 : void 0), !!p._hiddenByCollapse !== y && (p._hiddenByCollapse = y ? !0 : void 0);
        }
        for (const p of l) {
          const m = a.get(p.id);
          if (!m) continue;
          const y = i.getNode?.(p.source), x = i.getNode?.(p.target), P = p.hidden || p._hiddenByCollapse || y?.hidden || x?.hidden;
          m.style.display = P ? "none" : "";
        }
        for (const p of l) {
          const m = a.get(p.id);
          if (!m) continue;
          const y = i.getNode?.(p.source), x = i.getNode?.(p.target);
          y?.filtered || x?.filtered ? m.classList.add("flow-edge-filtered") : m.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [l, c] of a)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(l);
        a.clear(), s.remove();
      });
    }
  );
}
const Lp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], Pp = "a, button, input, textarea, select, [contenteditable]", Mp = 100, Tp = 60, Ap = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), Np = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), Ip = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), $p = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function Dp(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let a = n.has("fill-width") || n.has("fill"), l = n.has("fill-height") || n.has("fill");
  return { position: t && Lp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: a, fillHeight: l };
}
function Nt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function Hp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function Rp(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (Ap.has(e) && (t.style.top = "0"), Np.has(e) && (t.style.bottom = "0")), o && !n && (Ip.has(e) && (t.style.left = "0"), $p.has(e) && (t.style.right = "0"));
}
function Fp(t) {
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
      } = Dp(n, o), f = d || u, h = !s && !a && !f, g = !s && !l && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (a || f) && e.classList.add("flow-panel-locked"), (l || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && Rp(e, r, d, u);
      const p = (_) => _.stopPropagation();
      e.addEventListener("mousedown", p), e.addEventListener("pointerdown", p), e.addEventListener("wheel", p);
      const m = e.parentElement, y = {
        left: e.style.left,
        top: e.style.top,
        right: e.style.right,
        bottom: e.style.bottom,
        transform: e.style.transform,
        width: e.style.width,
        height: e.style.height,
        borderRadius: e.style.borderRadius
      }, x = `flow-panel-${r}`, P = () => {
        e.style.left = y.left, e.style.top = y.top, e.style.right = y.right, e.style.bottom = y.bottom, e.style.transform = y.transform, e.style.width = y.width, e.style.height = y.height, e.style.borderRadius = y.borderRadius, e.classList.contains(x) || e.classList.add(x);
      };
      m.addEventListener("flow-panel-reset", P), m.__flowPanels || (m.__flowPanels = /* @__PURE__ */ new Set()), m.__flowPanels.add(e);
      let b = null;
      if (h) {
        let _ = !1, E = 0, S = 0, A = 0, $ = 0;
        const M = () => {
          const w = e.getBoundingClientRect(), N = m.getBoundingClientRect();
          return {
            x: w.left - N.left,
            y: w.top - N.top
          };
        }, T = (w) => {
          if (!_) return;
          let N = A + (w.clientX - E), C = $ + (w.clientY - S);
          if (c) {
            const R = Hp(
              N,
              C,
              e.offsetWidth,
              e.offsetHeight,
              m.clientWidth,
              m.clientHeight
            );
            N = R.left, C = R.top;
          }
          e.style.left = `${N}px`, e.style.top = `${C}px`, Nt(m, "panel-drag", {
            panel: e,
            position: { x: N, y: C }
          });
        }, k = () => {
          if (!_) return;
          _ = !1, document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", k), document.removeEventListener("pointercancel", k);
          const w = M();
          Nt(m, "panel-drag-end", {
            panel: e,
            position: w
          });
        }, v = (w) => {
          const N = w.target;
          if (N.closest(Pp) || N.closest(".flow-panel-resize-handle"))
            return;
          _ = !0, E = w.clientX, S = w.clientY;
          const C = e.getBoundingClientRect(), R = m.getBoundingClientRect();
          A = C.left - R.left, $ = C.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${A}px`, e.style.top = `${$}px`, document.addEventListener("pointermove", T), document.addEventListener("pointerup", k), document.addEventListener("pointercancel", k), Nt(m, "panel-drag-start", {
            panel: e,
            position: { x: A, y: $ }
          });
        };
        if (e.addEventListener("pointerdown", v), g) {
          b = document.createElement("div"), b.classList.add("flow-panel-resize-handle"), e.appendChild(b);
          let w = !1, N = 0, C = 0, R = 0, O = 0;
          const Y = (I) => {
            if (!w) return;
            const F = Math.max(Mp, R + (I.clientX - N)), K = Math.max(Tp, O + (I.clientY - C));
            e.style.width = `${F}px`, e.style.height = `${K}px`, Nt(m, "panel-resize", {
              panel: e,
              dimensions: { width: F, height: K }
            });
          }, D = () => {
            w && (w = !1, document.removeEventListener("pointermove", Y), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), Nt(m, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, L = (I) => {
            I.stopPropagation(), w = !0, N = I.clientX, C = I.clientY, R = e.offsetWidth, O = e.offsetHeight, document.addEventListener("pointermove", Y), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), Nt(m, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: O }
            });
          };
          b.addEventListener("pointerdown", L), i(() => {
            e.removeEventListener("pointerdown", v), b?.removeEventListener("pointerdown", L), document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", k), document.removeEventListener("pointercancel", k), document.removeEventListener("pointermove", Y), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), b?.remove(), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), m.removeEventListener("flow-panel-reset", P), m.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", v), document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", k), document.removeEventListener("pointercancel", k), e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), m.removeEventListener("flow-panel-reset", P), m.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", p), e.removeEventListener("pointerdown", p), e.removeEventListener("wheel", p), m.removeEventListener("flow-panel-reset", P), m.__flowPanels?.delete(e);
        });
    }
  );
}
function Op(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = zp(n), a = Vp(o);
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
        const h = f.viewport.zoom || 1, g = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), p = d.dataset.flowNodeId, m = p ? f.getNode(p) : null, y = m?.dimensions?.width ?? d.offsetWidth, x = m?.dimensions?.height ?? d.offsetHeight, P = g / h;
        let b, _, E, S;
        s === "top" || s === "bottom" ? (_ = s === "top" ? -P : x + P, S = s === "top" ? "-100%" : "0%", a === "start" ? (b = 0, E = "0%") : a === "end" ? (b = y, E = "-100%") : (b = y / 2, E = "-50%")) : (b = s === "left" ? -P : y + P, E = s === "left" ? "-100%" : "0%", a === "start" ? (_ = 0, S = "0%") : a === "end" ? (_ = x, S = "-100%") : (_ = x / 2, S = "-50%")), e.style.left = `${b}px`, e.style.top = `${_}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${E}, ${S})`;
      }), r(() => {
        e.removeEventListener("pointerdown", l), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function zp(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function Vp(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Bp(t) {
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
      let g = null;
      const p = 4, m = () => {
        g = document.activeElement;
        const E = d.contextMenu.x + u, S = d.contextMenu.y + f;
        l.style.display = "", l.style.position = "fixed", l.style.left = E + "px", l.style.top = S + "px", l.style.zIndex = "5000", l.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((v) => {
          v.setAttribute("role", "menuitem"), v.hasAttribute("tabindex") || v.setAttribute("tabindex", "-1");
        });
        const A = l.getBoundingClientRect(), $ = window.innerWidth, M = window.innerHeight;
        let T = E, k = S;
        A.right > $ - p && (T = $ - A.width - p), A.bottom > M - p && (k = M - A.height - p), T < p && (T = p), k < p && (k = p), l.style.left = T + "px", l.style.top = k + "px", h.style.display = "", l.focus({ preventScroll: !0 });
      }, y = () => {
        l.style.display = "none", h.style.display = "none", g && document.contains(g) && (g.focus({ preventScroll: !0 }), g = null);
      };
      i(() => {
        const E = d.contextMenu;
        E.show && E.type === a ? m() : y();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (E) => {
        E.preventDefault(), d.closeContextMenu();
      });
      const x = () => {
        d.contextMenu.show && d.contextMenu.type === a && d.closeContextMenu();
      };
      window.addEventListener("scroll", x, !0);
      const P = () => Array.from(l.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), b = (E) => Array.from(E.querySelectorAll(
        "button:not([disabled])"
      )), _ = (E) => {
        if (!d.contextMenu.show || d.contextMenu.type !== a || l.style.display === "none") return;
        const S = document.activeElement, A = S?.closest(".flow-context-submenu"), $ = A ? b(A) : P();
        if ($.length === 0) return;
        const M = $.indexOf(S);
        switch (E.key) {
          case "ArrowDown": {
            E.preventDefault();
            const T = M < $.length - 1 ? M + 1 : 0;
            $[T].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            E.preventDefault();
            const T = M > 0 ? M - 1 : $.length - 1;
            $[T].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (E.preventDefault(), E.shiftKey) {
              const T = M > 0 ? M - 1 : $.length - 1;
              $[T].focus({ preventScroll: !0 });
            } else {
              const T = M < $.length - 1 ? M + 1 : 0;
              $[T].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            E.preventDefault(), S?.click();
            break;
          }
          case "ArrowRight": {
            if (!A) {
              const T = S?.querySelector(".flow-context-submenu");
              T && (E.preventDefault(), T.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            A && (E.preventDefault(), A.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      l.addEventListener("keydown", _), s(() => {
        h.remove(), window.removeEventListener("scroll", x, !0), l.removeEventListener("keydown", _);
      });
    }
  );
}
const qp = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Yp(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = new Set(o), c = l.has("once"), d = l.has("reverse"), u = l.has("queue"), f = n || "";
      let h = "click";
      l.has("mouseenter") ? h = "mouseenter" : l.has("click") && (h = "click");
      let g = null, p = [], m = !1, y = !1, x = !1;
      function P() {
        const T = r(i);
        return Array.isArray(T) ? T : T && typeof T == "object" ? [T] : [];
      }
      function b() {
        const T = e.closest("[x-data]");
        return T ? t.$data(T) : null;
      }
      function _(T, k = !1) {
        const v = b();
        if (!v?.timeline) return Promise.resolve();
        const w = v.timeline();
        if (k) {
          for (let N = T.length - 1; N >= 0; N--)
            w.step(T[N]);
          w.reverse();
        } else
          for (const N of T)
            N.parallel ? w.parallel(N.parallel) : w.step(N);
        return g = w, w.play().then(() => {
          g === w && (g = null);
        });
      }
      function E(T = !1) {
        if (c && y) return;
        y = !0;
        const k = P();
        if (k.length === 0) return;
        const v = () => _(k, T);
        u ? (p.push(v), S()) : (g?.stop(), g = null, p = [], m = !1, v());
      }
      async function S() {
        if (!m) {
          for (m = !0; p.length > 0; )
            await p.shift()();
          m = !1;
        }
      }
      if (f) {
        s(() => {
          const T = P(), k = b();
          k?.registerAnimation && k.registerAnimation(f, T);
        }), a(() => {
          const T = b();
          T?.unregisterAnimation && T.unregisterAnimation(f);
        });
        return;
      }
      const A = () => {
        d && h === "click" ? (E(x), x = !x) : E(!1);
      };
      e.addEventListener(h, A);
      let $ = null, M = null;
      d && h !== "click" && (M = qp[h] ?? null, M && ($ = () => E(!0), e.addEventListener(M, $))), a(() => {
        g?.stop(), e.removeEventListener(h, A), M && $ && e.removeEventListener(M, $);
      });
    }
  );
}
function Xp(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, a = t.dimensions?.width ?? we, l = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + a) * n.zoom + n.x, f = (s + l) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function Wp(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const a = e.getNode?.(s) ?? e.nodes?.find((l) => l.id === s);
    if (a && !Xp(a, t, n, o, i))
      return !0;
  }
  return !1;
}
function jp(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, a = null, l = [], c = !1, d = "idle", u = 0;
      function f() {
        const m = e.closest("[x-data]");
        return m ? t.$data(m) : null;
      }
      function h(m, y) {
        const x = f();
        if (!x?.timeline) return Promise.resolve();
        const P = x.timeline(), b = y.speed ?? 1, _ = y.autoFitView === !0, E = y.fitViewPadding ?? 0.1, S = x.viewport, A = x.getContainerDimensions?.();
        for (const $ of m) {
          const M = b !== 1 ? {
            ...$,
            duration: $.duration !== void 0 ? $.duration / b : void 0,
            delay: $.delay !== void 0 ? $.delay / b : void 0
          } : $;
          if (M.parallel) {
            const T = M.parallel.map(
              (k) => b !== 1 ? {
                ...k,
                duration: k.duration !== void 0 ? k.duration / b : void 0,
                delay: k.delay !== void 0 ? k.delay / b : void 0
              } : k
            );
            P.parallel(T);
          } else if (_ && S && A && Wp(M, x, S, A.width, A.height)) {
            const T = {
              fitView: !0,
              fitViewPadding: E,
              duration: M.duration,
              easing: M.easing
            };
            P.parallel([M, T]);
          } else
            P.step(M);
        }
        if (y.lock && P.lock(!0), y.loop !== void 0 && y.loop !== !1) {
          const $ = y.loop === !0 ? 0 : y.loop;
          P.loop($);
        }
        return y.respectReducedMotion !== void 0 && P.respectReducedMotion(y.respectReducedMotion), a = P, d = "playing", c = !0, P.play().then(() => {
          a === P && (a = null, d = "idle", c = !1);
        });
      }
      async function g(m) {
        if (l.length === 0) return;
        if ((m.overflow ?? "queue") === "latest" && c) {
          a?.stop(), a = null, c = !1, d = "idle";
          const x = [l[l.length - 1]];
          s += l.length, l = [], await h(x, m);
        } else {
          const x = [...l];
          s += x.length, l = [], c && await new Promise((b) => {
            a ? (a.on("complete", () => b()), a.on("stop", () => b())) : b();
          }), await h(x, m);
        }
      }
      const p = {
        async play() {
          const m = o(n), y = m.steps ?? [];
          s < y.length && (l = y.slice(s), await g(m));
        },
        stop() {
          a?.stop(), a = null, c = !1, d = "stopped", l = [];
        },
        reset(m) {
          if (a?.stop(), a = null, c = !1, d = "idle", s = 0, l = [], u = 0, m) {
            const y = o(n), x = y.steps ?? [];
            if (x.length > 0)
              return l = [...x], g(y);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = p, i(() => {
        const m = o(n);
        if (!m || !m.steps) return;
        const y = m.steps, x = m.autoplay !== !1;
        if (y.length > u) {
          const P = y.slice(Math.max(s, u));
          u = y.length, P.length > 0 && x && (l.push(...P), g(m));
        } else
          u = y.length;
      }), r(() => {
        a?.stop(), delete e.__timeline;
      });
    }
  );
}
function Up(t) {
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
          for (const m of h.nodes)
            m.parentId === p && (l ? h.expandNode?.(m.id, { animate: !d }) : h.collapseNode?.(m.id, { animate: !d }));
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
        const m = e.closest("[x-flow-node]");
        m && e.setAttribute("aria-controls", m.id || f);
      }), s(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Zp(t) {
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
function Do(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Gp(t) {
  t.directive("flow-schema", (e, n, { evaluate: o, effect: i, cleanup: r }) => {
    const s = e, a = () => {
      try {
        return o("typeof node !== 'undefined' ? node : null") ?? null;
      } catch {
        return null;
      }
    }, l = () => {
      try {
        const _ = s.closest(".flow-container");
        return _ ? !!t.$data?.(_)?._config?.rowsReorderable : !1;
      } catch {
        return !1;
      }
    }, c = () => {
      try {
        const _ = s.closest(".flow-container");
        return _ ? !!t.$data?.(_)?._config?.keyboardConnect : !1;
      } catch {
        return !1;
      }
    }, d = () => {
      try {
        const _ = s.closest(".flow-container");
        return _ ? t.$data?.(_) ?? null : null;
      } catch {
        return null;
      }
    }, u = () => {
      t.nextTick(() => {
        const _ = d();
        if (!_) return;
        const E = t.raw(_);
        if (E._schemaMetrics != null) return;
        const S = s.querySelector(":scope > .flow-schema-header"), A = s.querySelector(":scope > .flow-schema-body"), $ = s.querySelectorAll(".flow-schema-row");
        if ($.length < 2) return;
        const M = $[0], T = $[1], k = $[$.length - 1], v = M.querySelector(".flow-schema-handle"), w = k.querySelector(".flow-schema-handle");
        if (!S || !A || !v || !w) return;
        const N = s.closest("[data-flow-node-id]") ?? s, C = E.viewport?.zoom || 1, R = N.getBoundingClientRect(), O = S.getBoundingClientRect(), Y = A.getBoundingClientRect(), D = M.getBoundingClientRect(), L = T.getBoundingClientRect(), I = k.getBoundingClientRect(), F = v.getBoundingClientRect(), K = w.getBoundingClientRect(), ne = (L.top - D.top) / C, Z = I.height / C;
        if (ne <= 0 || Z <= 0) return;
        const B = {
          headerHeight: O.height / C,
          rowHeight: ne,
          // NOT the same as `rowHeight` under the shipped theme — the last row loses
          // its border-bottom. See SchemaMetrics.rowHeightLast.
          rowHeightLast: Z,
          // Where the handle actually sits inside its row. MEASURED, not `rowHeight / 2`:
          // `top: 50%` resolves against the row's PADDING box, which the theme's
          // border-bottom shrinks. See SchemaMetrics.handleOffsetY.
          handleOffsetY: (F.top + F.height / 2 - D.top) / C,
          handleOffsetYLast: (K.top + K.height / 2 - I.top) / C,
          insetLeft: (D.left - R.left) / C,
          insetRight: (R.right - D.right) / C,
          insetTop: (O.top - R.top) / C,
          // Closes the row model: with insetBottom, a consumer can reconstruct the
          // node's expected border-box height and so DETECT non-uniform rows (a
          // wrapped field name — nothing in the CSS forces `white-space: nowrap`)
          // instead of assuming uniformity. See `flow-edge.ts`'s eligibility check.
          insetBottom: (R.bottom - Y.bottom) / C,
          handleWidth: F.width / C,
          handleHeight: F.height / C
        };
        E._schemaMetrics = B;
      });
    };
    s.classList.add("flow-schema-node");
    let f = s.closest("[data-flow-node-id]"), h = !1;
    f ? f.setAttribute("data-flow-schema-node", "") : t.nextTick(() => {
      h || !s.isConnected || (f = s.closest("[data-flow-node-id]"), f?.setAttribute("data-flow-schema-node", ""));
    });
    let g = null, p = null;
    const m = /* @__PURE__ */ new Map(), y = () => {
      g && p || (Do(s), m.clear(), g = document.createElement("div"), g.className = "flow-schema-header", s.appendChild(g), p = document.createElement("div"), p.className = "flow-schema-body", s.appendChild(p));
    }, x = () => {
      const _ = a(), E = _?.data;
      if (!E) {
        for (const w of m.values())
          t.destroyTree(w);
        m.clear(), Do(s), g = null, p = null;
        return;
      }
      y();
      const S = typeof E.label == "string" ? E.label : "", A = Array.isArray(E.fields) ? E.fields : [], $ = typeof _?.id == "string" ? _.id : "";
      typeof E.kind == "string" && E.kind ? s.setAttribute("data-flow-schema-kind", E.kind) : s.removeAttribute("data-flow-schema-kind"), g.textContent !== S && (g.textContent = S);
      const M = l(), T = c(), k = /* @__PURE__ */ new Set();
      for (const w of A) {
        k.add(w.name);
        const N = m.get(w.name);
        if (N)
          P(N, w);
        else {
          const C = b(w, $, M, T);
          m.set(w.name, C), p.appendChild(C), t.initTree(C);
        }
      }
      for (const [w, N] of m)
        k.has(w) || (t.destroyTree(N), N.remove(), m.delete(w));
      let v = p.firstChild;
      for (const w of A) {
        const N = m.get(w.name);
        N && (v === N ? v = v.nextSibling : p.insertBefore(N, v));
      }
      u();
    }, P = (_, E) => {
      _.dataset.flowSchemaField !== E.name && (_.dataset.flowSchemaField = E.name), _.classList.toggle("flow-schema-row--pk", E.key === "primary"), _.classList.toggle("flow-schema-row--fk", E.key === "foreign"), _.classList.toggle("flow-schema-row--required", !!E.required);
      let S = _.querySelector(".flow-schema-row-icon");
      const A = _.querySelector(".flow-schema-row-name");
      E.icon ? (S || (S = document.createElement("span"), S.className = "flow-schema-row-icon", _.insertBefore(S, A)), S.textContent !== E.icon && (S.textContent = E.icon)) : S && S.remove(), A && A.textContent !== E.name && (A.textContent = E.name);
      const $ = _.querySelector(".flow-schema-row-type");
      $ && $.textContent !== E.type && ($.textContent = E.type);
    }, b = (_, E, S, A) => {
      const $ = document.createElement("div");
      $.className = "flow-schema-row", $.dataset.flowSchemaField = _.name, _.key === "primary" && $.classList.add("flow-schema-row--pk"), _.key === "foreign" && $.classList.add("flow-schema-row--fk"), _.required && $.classList.add("flow-schema-row--required"), E && $.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${E}.${_.name}`)
      ), S && $.setAttribute("x-schema-reorderable", ""), A && E && $.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${E}.${_.name}`)
      );
      const M = document.createElement("div");
      if (M.className = "flow-schema-handle flow-schema-handle--target", M.setAttribute("x-flow-handle:target.left", JSON.stringify(_.name)), $.appendChild(M), _.icon) {
        const C = document.createElement("span");
        C.className = "flow-schema-row-icon", C.textContent = _.icon, $.appendChild(C);
      }
      const T = document.createElement("span");
      T.className = "flow-schema-row-name", T.textContent = _.name, $.appendChild(T);
      const k = document.createElement("span");
      k.className = "flow-schema-row-type", k.textContent = _.type, $.appendChild(k);
      const v = document.createElement("div");
      v.className = "flow-schema-handle flow-schema-handle--source", v.setAttribute("x-flow-handle:source.right", JSON.stringify(_.name)), $.appendChild(v);
      const w = document.createElement("div");
      w.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", w.setAttribute("x-flow-handle:target.right", JSON.stringify(_.name)), $.appendChild(w);
      const N = document.createElement("div");
      return N.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", N.setAttribute("x-flow-handle:source.left", JSON.stringify(_.name)), $.appendChild(N), $;
    };
    i(() => {
      if (!s.isConnected) return;
      const _ = a()?.data;
      _?.label, _?.kind;
      const E = _?.fields;
      if (Array.isArray(E))
        for (const S of E)
          S.name, S.type, S.key, S.required, S.icon;
      x();
    }), r(() => {
      h = !0;
      for (const _ of m.values())
        t.destroyTree(_);
      m.clear(), Do(s), g = null, p = null, s.classList.remove("flow-schema-node"), f?.removeAttribute("data-flow-schema-node");
    });
  });
}
function Kp(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function qs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Jp(t) {
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
      qs(s);
      const d = a()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, g = document.createElement("div");
      if (g.className = "flow-wait-header", f) {
        const P = document.createElement("span");
        P.className = "flow-wait-icon", P.textContent = f, g.appendChild(P);
      }
      const p = document.createElement("span");
      p.className = "flow-wait-label", p.textContent = u, g.appendChild(p);
      const m = document.createElement("span");
      m.className = "flow-wait-duration", m.textContent = Kp(h), g.appendChild(m), s.appendChild(g);
      const y = document.createElement("div");
      y.className = "flow-wait-handle flow-wait-handle--target", y.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(y);
      const x = document.createElement("div");
      x.className = "flow-wait-handle flow-wait-handle--source", x.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(x), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = a()?.data;
      c?.durationMs, c?.label, c?.icon, l();
    }), r(() => {
      qs(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Ys = {
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
function Qp(t) {
  const { field: e, op: n, value: o } = t;
  return n in Ys ? `${e} ${Ys[n]} ${cn(o)}` : n === "in" ? `${e} in ${cn(o)}` : n === "notIn" ? `${e} not in ${cn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${cn(o)}`;
}
function Xs(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function em(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function tm(t) {
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
      const u = a()?.data ?? {}, f = em(l(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Xs(s);
      const g = typeof u.label == "string" && u.label ? u.label : "Condition", p = document.createElement("div");
      p.className = "flow-condition-header", p.textContent = g, s.appendChild(p);
      const m = document.createElement("div");
      m.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? m.textContent = Qp(u.condition) : typeof u.evaluate == "function" ? m.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : m.textContent = "", s.appendChild(m);
      const y = document.createElement("div");
      y.className = "flow-condition-handle-target", y.setAttribute("data-flow-handle-direction", "target"), y.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(y);
      const x = document.createElement("div");
      x.className = "flow-condition-handle-source flow-condition-handle--true", x.setAttribute("data-flow-handle-direction", "source"), x.setAttribute("data-source-handle", "true"), x.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(x);
      const P = document.createElement("div");
      P.className = "flow-condition-handle-source flow-condition-handle--false", P.setAttribute("data-flow-handle-direction", "source"), P.setAttribute("data-source-handle", "false"), P.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(P), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = a()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Xs(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function nm(t) {
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
function om(t) {
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
          const g = i(n), p = f.viewport.zoom, m = g.min === void 0 || p >= g.min, y = g.max === void 0 || p <= g.max;
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
const im = ["perf", "events", "viewport", "state", "activity"], Ws = ["fps", "memory", "counts", "visible"], js = 30;
function sm(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => im.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function rm(t) {
  return t.perf ? t.perf === !0 ? [...Ws] : t.perf.filter((e) => Ws.includes(e)) : [];
}
function am(t) {
  return t.events ? t.events === !0 ? js : t.events.max ?? js : 0;
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
function lm(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let a = null;
      if (n)
        try {
          a = i(n);
        } catch {
        }
      const l = sm(a, o), c = e.closest("[x-data]");
      if (!c) return;
      const d = e.closest(".flow-container");
      if (!d) return;
      e.classList.add("flow-devtools", "canvas-overlay"), e.setAttribute("data-flow-devtools", "");
      const u = (q) => q.stopPropagation();
      e.addEventListener("wheel", u);
      const f = document.createElement("button");
      f.className = "flow-devtools-toggle nopan", f.title = "Devtools";
      const h = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      h.setAttribute("width", "14"), h.setAttribute("height", "14"), h.setAttribute("viewBox", "0 0 24 24"), h.setAttribute("fill", "none"), h.setAttribute("stroke", "currentColor"), h.setAttribute("stroke-width", "2"), h.setAttribute("stroke-linecap", "round"), h.setAttribute("stroke-linejoin", "round");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      g.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(g), f.appendChild(h), e.appendChild(f);
      const p = document.createElement("div");
      p.className = "flow-devtools-panel", p.style.display = "none", p.style.userSelect = "none", e.appendChild(p);
      let m = !1;
      const y = () => {
        m = !m, p.style.display = m ? "" : "none", f.title = m ? "Collapse" : "Devtools", m ? K() : ne();
      };
      f.addEventListener("click", y);
      const x = rm(l);
      let P = null, b = null, _ = null, E = null, S = null;
      if (x.length > 0) {
        const { wrapper: q, content: X } = sn("Performance", "flow-devtools-perf");
        if (x.includes("fps")) {
          const { row: j, valueEl: H } = Ve("FPS", "flow-devtools-fps");
          P = H, X.appendChild(j);
        }
        if (x.includes("memory")) {
          const { row: j, valueEl: H } = Ve("Memory", "flow-devtools-memory");
          b = H, X.appendChild(j);
        }
        if (x.includes("counts")) {
          const j = Ve("Nodes", "flow-devtools-counts");
          _ = j.valueEl, X.appendChild(j.row);
          const H = Ve("Edges", "flow-devtools-counts");
          E = H.valueEl, X.appendChild(H.row);
        }
        if (x.includes("visible")) {
          const { row: j, valueEl: H } = Ve("Visible", "flow-devtools-visible");
          S = H, X.appendChild(j);
        }
        p.appendChild(q);
      }
      const A = am(l);
      let $ = null;
      if (A > 0) {
        const { wrapper: q, content: X } = sn("Events", "flow-devtools-events"), j = document.createElement("button");
        j.className = "flow-devtools-clear-btn nopan", j.textContent = "Clear", j.addEventListener("click", () => {
          $ && ($.textContent = ""), Z.length = 0;
        }), q.querySelector(".flow-devtools-section-title").appendChild(j), $ = document.createElement("div"), $.className = "flow-devtools-event-list", X.appendChild($), p.appendChild(q);
      }
      let M = null, T = null, k = null;
      if (l.viewport) {
        const { wrapper: q, content: X } = sn("Viewport", "flow-devtools-viewport"), j = Ve("X", "flow-devtools-vp-x");
        M = j.valueEl, X.appendChild(j.row);
        const H = Ve("Y", "flow-devtools-vp-y");
        T = H.valueEl, X.appendChild(H.row);
        const te = Ve("Zoom", "flow-devtools-vp-zoom");
        k = te.valueEl, X.appendChild(te.row), p.appendChild(q);
      }
      let v = null;
      if (l.state) {
        const { wrapper: q, content: X } = sn("Selection", "flow-devtools-state");
        v = document.createElement("div"), v.className = "flow-devtools-state-content", v.textContent = "No selection", X.appendChild(v), p.appendChild(q);
      }
      let w = null, N = null, C = null, R = null;
      if (l.activity) {
        const { wrapper: q, content: X } = sn("Activity", "flow-devtools-activity"), j = Ve("Animations", "flow-devtools-anim");
        w = j.valueEl, X.appendChild(j.row);
        const H = Ve("Particles", "flow-devtools-particles");
        N = H.valueEl, X.appendChild(H.row);
        const te = Ve("Follow", "flow-devtools-follow");
        C = te.valueEl, X.appendChild(te.row);
        const Q = Ve("Timelines", "flow-devtools-timelines");
        R = Q.valueEl, X.appendChild(Q.row), p.appendChild(q);
      }
      let O = null, Y = !1, D = 0, L = performance.now();
      const I = !!(P || b), F = () => {
        if (!Y) return;
        D++;
        const q = performance.now();
        q - L >= 1e3 && (P && (P.textContent = String(Math.round(D * 1e3 / (q - L)))), D = 0, L = q, b && performance.memory && (b.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), O = requestAnimationFrame(F);
      }, K = () => {
        !I || Y || (Y = !0, D = 0, L = performance.now(), O = requestAnimationFrame(F));
      }, ne = () => {
        Y = !1, O !== null && (cancelAnimationFrame(O), O = null);
      }, Z = [], B = [
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
        z = (q) => {
          if (!m) return;
          const X = q, j = X.type.replace("flow-", "");
          let H = "";
          try {
            H = X.detail ? JSON.stringify(X.detail).slice(0, 80) : "";
          } catch {
            H = "[circular]";
          }
          Z.unshift({ name: j, time: Date.now(), detail: H });
          const te = $, Q = document.createElement("div");
          Q.className = "flow-devtools-event-entry";
          const U = document.createElement("span");
          U.className = "flow-devtools-event-name", U.textContent = j;
          const J = document.createElement("span");
          J.className = "flow-devtools-event-age", J.textContent = "now";
          const se = document.createElement("span");
          for (se.className = "flow-devtools-event-detail", se.textContent = H, Q.appendChild(U), Q.appendChild(J), Q.appendChild(se), te.prepend(Q); te.children.length > A; )
            te.removeChild(te.lastChild), Z.pop();
        };
        for (const q of B)
          d.addEventListener(q, z);
      }
      r(() => {
        const q = t.$data(c);
        !q || !q.viewport || (M && (M.textContent = Math.round(q.viewport.x).toString()), T && (T.textContent = Math.round(q.viewport.y).toString()), k && (k.textContent = q.viewport.zoom.toFixed(2)));
      }), r(() => {
        const q = t.$data(c);
        if (q) {
          if (_ && (_.textContent = String(q.nodes?.length ?? 0)), E && (E.textContent = String(q.edges?.length ?? 0)), S && q._getVisibleNodeIds && (S.textContent = String(q._getVisibleNodeIds().size)), v) {
            const X = q.selectedNodes, j = q.selectedEdges;
            if (!((X?.size ?? 0) > 0 || (j?.size ?? 0) > 0))
              v.textContent = "No selection";
            else {
              if (v.textContent = "", X && X.size > 0)
                for (const te of X) {
                  const Q = q.getNode?.(te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, position: Q.position, data: Q.data }, null, 2), v.appendChild(U);
                }
              if (j && j.size > 0)
                for (const te of j) {
                  const Q = q.edges?.find((J) => J.id === te);
                  if (!Q) continue;
                  const U = document.createElement("pre");
                  U.className = "flow-devtools-json", U.textContent = JSON.stringify({ id: Q.id, source: Q.source, target: Q.target, type: Q.type }, null, 2), v.appendChild(U);
                }
            }
          }
          if (w) {
            const X = q._animator?._groups?.size ?? 0;
            w.textContent = String(X);
          }
          N && (N.textContent = String(q._activeParticles?.size ?? 0)), C && (C.textContent = q._followHandle ? "Active" : "Idle"), R && (R.textContent = String(q._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ne(), f.removeEventListener("click", y), z)
          for (const q of B)
            d.removeEventListener(q, z);
        e.removeEventListener("wheel", u), e.textContent = "", P = null, b = null, _ = null, E = null, S = null, $ = null, M = null, T = null, k = null, v = null, w = null, N = null, C = null, R = null;
      });
    }
  );
}
const cm = {
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
function dm(t) {
  return cm[t] ?? null;
}
function um(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = dm(n);
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
function fm(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Ho = /* @__PURE__ */ new WeakMap();
function hm(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = fm(n, i);
      if (!l) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (l.isClear) {
          if (l.type === "node")
            d.clearNodeFilter(), Ho.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (l.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), Ho.set(c, u);
        else if (l.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", l.type === "node" && !l.isClear && s(() => {
        d.nodes.length;
        const h = Ho.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), a(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function gm(t) {
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
function pm(t) {
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
        const h = i(n), g = gm(h);
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
function mm(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Mi = /* @__PURE__ */ new Map();
function ym(t, e) {
  Mi.set(t, e);
}
function wm(t) {
  return Mi.get(t) ?? null;
}
function vm(t) {
  return Mi.has(t);
}
function Ro(t) {
  return `alpineflow-snapshot-${t}`;
}
function _m(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: a }) => {
      const l = mm(n, i);
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
            l.persist ? localStorage.setItem(Ro(f), JSON.stringify(h)) : ym(f, h);
          } else {
            let h = null;
            if (l.persist) {
              const g = localStorage.getItem(Ro(f));
              if (g)
                try {
                  h = JSON.parse(g);
                } catch {
                }
            } else
              h = wm(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), l.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        l.persist ? h = localStorage.getItem(Ro(f)) !== null : (d.nodes.length, h = vm(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), a(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function bm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function xm(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(bm(s._loadingText));
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
function Em(t) {
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
      const g = o.includes("below"), p = 20;
      r(() => {
        if (!d.edges.some(($) => $.id === l)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const m = d.viewport?.zoom || 1, y = parseInt(e.getAttribute("data-flow-offset") ?? String(p), 10);
        let x = 0.5;
        if (n) {
          const $ = i(n);
          typeof $ == "number" && (x = $);
        }
        const P = a.querySelectorAll("path"), b = P.length > 1 ? P[1] : P[0];
        if (!b) return;
        const _ = b.getTotalLength?.();
        if (!_) return;
        const E = b.getPointAtLength(_ * Math.max(0, Math.min(1, x))), S = y / m, A = g ? S : -S;
        e.style.left = `${E.x}px`, e.style.top = `${E.y + A}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / m}) translate(-50%, ${g ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function Cm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function Sm(t) {
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
function $y(t, e, n) {
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
      style: typeof y.style == "string" ? y.style : Object.entries(y.style).map(([x, P]) => `${x}:${P}`).join(";")
    } : {},
    data: y.data ?? {}
  })), u = e.filter((y) => !y.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const y of u) {
    const x = c.get(y.source), P = c.get(y.target);
    if (!x || !P)
      continue;
    let b, _;
    try {
      const M = ao(
        y,
        x,
        P,
        x.sourcePosition ?? "bottom",
        P.targetPosition ?? "top"
      );
      b = M.path, _ = M.labelPosition;
    } catch {
      continue;
    }
    let E, S;
    if (y.markerStart) {
      const M = Ot(y.markerStart), T = zt(M, s);
      h.has(T) || h.set(T, no(M, T)), E = `url(#${T})`;
    }
    if (y.markerEnd) {
      const M = Ot(y.markerEnd), T = zt(M, s);
      h.has(T) || h.set(T, no(M, T)), S = `url(#${T})`;
    }
    let A, $;
    if (y.label)
      if (_)
        A = _.x, $ = _.y;
      else {
        const M = x.position.x + x.dimensions.width / 2, T = x.position.y + x.dimensions.height / 2, k = P.position.x + P.dimensions.width / 2, v = P.position.y + P.dimensions.height / 2;
        A = (M + k) / 2, $ = (T + v) / 2;
      }
    f.push({
      id: y.id,
      source: y.source,
      target: y.target,
      pathD: b,
      ...E ? { markerStart: E } : {},
      ...S ? { markerEnd: S } : {},
      ...y.class ? { class: y.class } : {},
      ...y.label ? { label: y.label } : {},
      ...A !== void 0 ? { labelX: A } : {},
      ...$ !== void 0 ? { labelY: $ } : {}
    });
  }
  const g = Array.from(h.values()).join(`
`);
  let p, m;
  if (l.length === 0)
    p = { x: 0, y: 0, width: 0, height: 0 }, m = { x: 0, y: 0, zoom: 1 };
  else {
    const y = Yt(l);
    p = {
      x: y.x - r,
      y: y.y - r,
      width: y.width + r * 2,
      height: y.height + r * 2
    }, m = {
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
    viewport: m
  };
}
const Us = /* @__PURE__ */ new WeakSet();
function Dy(t) {
  Us.has(t) || (Us.add(t), $a(t), Sm(t), np(t), hp(t), zf(t), Mf(t), Tf(t), Af(t), Gg(t), yp(t), bp(t), xp(t), Cp(t), kp(t), Fp(t), Op(t), Bp(t), Yp(t), jp(t), Up(t), Zp(t), nm(t), om(t), lm(t), um(t), hm(t), pm(t), _m(t), xm(t), Em(t), Gp(t), Jp(t), tm(t), Cm(t));
}
function km(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function Lm(t, e, n, o) {
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
async function Pm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => Sy));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", a = t.getBoundingClientRect(), l = s === "viewport" ? a.width : i.width ?? 1920, c = s === "viewport" ? a.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, g = t.style.width, p = t.style.height, m = t.style.overflow, y = [];
  try {
    if (s === "all") {
      const M = t.querySelectorAll("[data-flow-culled]");
      for (const N of M)
        N.style.display = "", y.push(N);
      const T = n.filter((N) => !N.hidden), k = Yt(T), v = i.padding ?? 0.1, w = Jn(
        k,
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
    const x = i.includeOverlays, P = x === !0, b = typeof x == "object" ? x : {}, _ = [
      ["canvas-overlay", P || (b.toolbar ?? !1)],
      ["flow-minimap", P || (b.minimap ?? !1)],
      ["flow-controls", P || (b.controls ?? !1)],
      ["flow-panel", P || (b.panels ?? !1)],
      ["flow-selection-box", !1]
    ], E = await r(t, {
      width: l,
      height: c,
      skipFonts: !0,
      filter: (M) => {
        if (M.classList) {
          for (const [T, k] of _)
            if (M.classList.contains(T) && !k) return !1;
        }
        return !0;
      }
    }), A = km(decodeURIComponent(E.substring("data:image/svg+xml;charset=utf-8,".length))), $ = await Lm(A, l, c, d);
    if (i.filename) {
      const M = document.createElement("a");
      M.download = i.filename, M.href = $, M.click();
    }
    return $;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = g, t.style.height = p, t.style.overflow = m;
    for (const x of y)
      x.style.display = "none";
  }
}
const Mm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: Pm
}, Symbol.toStringTag, { value: "Module" }));
function Tm(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const Am = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function wt(t) {
  const e = [];
  for (let n = 0, o = t.length; n < o; n++)
    e.push(t[n]);
  return e;
}
let It = null;
function Ca(t = {}) {
  return It || (t.includeStyleProperties ? (It = t.includeStyleProperties, It) : (It = wt(window.getComputedStyle(document.documentElement)), It));
}
function uo(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function Nm(t) {
  const e = uo(t, "border-left-width"), n = uo(t, "border-right-width");
  return t.clientWidth + e + n;
}
function Im(t) {
  const e = uo(t, "border-top-width"), n = uo(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Ti(t, e = {}) {
  const n = e.width || Nm(t), o = e.height || Im(t);
  return { width: n, height: o };
}
function $m() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const De = 16384;
function Dm(t) {
  (t.width > De || t.height > De) && (t.width > De && t.height > De ? t.width > t.height ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De) : t.width > De ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De));
}
function Hm(t, e = {}) {
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
function fo(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function Rm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Fm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), Rm(i);
}
const Ie = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ie(n, e);
};
function Om(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function zm(t, e) {
  return Ca(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function Vm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? Om(n) : zm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Zs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = Am();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(Vm(s, n, i, o)), e.appendChild(a);
}
function Bm(t, e, n) {
  Zs(t, e, ":before", n), Zs(t, e, ":after", n);
}
const Gs = "application/font-woff", Ks = "image/jpeg", qm = {
  woff: Gs,
  woff2: Gs,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Ks,
  jpeg: Ks,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Ym(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Ai(t) {
  const e = Ym(t).toLowerCase();
  return qm[e] || "";
}
function Xm(t) {
  return t.split(/,/)[1];
}
function li(t) {
  return t.search(/^(data:)/) !== -1;
}
function Wm(t, e) {
  return `data:${e};base64,${t}`;
}
async function Sa(t, e, n) {
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
const Fo = {};
function jm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Ni(t, e, n) {
  const o = jm(t, e, n.includeQueryParams);
  if (Fo[o] != null)
    return Fo[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await Sa(t, n.fetchRequestInit, ({ res: s, result: a }) => (e || (e = s.headers.get("Content-Type") || ""), Xm(a)));
    i = Wm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Fo[o] = i, i;
}
async function Um(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : fo(e);
}
async function Zm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const a = r.toDataURL();
    return fo(a);
  }
  const n = t.poster, o = Ai(n), i = await Ni(n, o, e);
  return fo(i);
}
async function Gm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await bo(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Km(t, e) {
  return Ie(t, HTMLCanvasElement) ? Um(t) : Ie(t, HTMLVideoElement) ? Zm(t, e) : Ie(t, HTMLIFrameElement) ? Gm(t, e) : t.cloneNode(ka(t));
}
const Jm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", ka = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Qm(t, e, n) {
  var o, i;
  if (ka(e))
    return e;
  let r = [];
  return Jm(t) && t.assignedNodes ? r = wt(t.assignedNodes()) : Ie(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = wt(t.contentDocument.body.childNodes) : r = wt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ie(t, HTMLVideoElement) || await r.reduce((s, a) => s.then(() => bo(a, n)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function ey(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : Ca(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ie(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function ty(t, e) {
  Ie(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ie(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function ny(t, e) {
  if (Ie(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function oy(t, e, n) {
  return Ie(e, Element) && (ey(t, e, n), Bm(t, e, n), ty(t, e), ny(t, e)), e;
}
async function iy(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const a = n[r].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !o[a] && (o[a] = await bo(c, e, !0));
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
async function bo(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Km(o, e)).then((o) => Qm(t, o, e)).then((o) => oy(t, o, e)).then((o) => iy(o, e));
}
const La = /url\((['"]?)([^'"]+?)\1\)/g, sy = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, ry = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function ay(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function ly(t) {
  const e = [];
  return t.replace(La, (n, o, i) => (e.push(i), n)), e.filter((n) => !li(n));
}
async function cy(t, e, n, o, i) {
  try {
    const r = n ? Tm(e, n) : e, s = Ai(e);
    let a;
    return i || (a = await Ni(r, s, o)), t.replace(ay(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function dy(t, { preferredFontFormat: e }) {
  return e ? t.replace(ry, (n) => {
    for (; ; ) {
      const [o, , i] = sy.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function Pa(t) {
  return t.search(La) !== -1;
}
async function Ma(t, e, n) {
  if (!Pa(t))
    return t;
  const o = dy(t, n);
  return ly(o).reduce((r, s) => r.then((a) => cy(a, s, e, n)), Promise.resolve(o));
}
async function $t(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await Ma(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function uy(t, e) {
  await $t("background", t, e) || await $t("background-image", t, e), await $t("mask", t, e) || await $t("-webkit-mask", t, e) || await $t("mask-image", t, e) || await $t("-webkit-mask-image", t, e);
}
async function fy(t, e) {
  const n = Ie(t, HTMLImageElement);
  if (!(n && !li(t.src)) && !(Ie(t, SVGImageElement) && !li(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Ni(o, Ai(o), e);
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
async function hy(t, e) {
  const o = wt(t.childNodes).map((i) => Ta(i, e));
  await Promise.all(o).then(() => t);
}
async function Ta(t, e) {
  Ie(t, Element) && (await uy(t, e), await fy(t, e), await hy(t, e));
}
function gy(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Js = {};
async function Qs(t) {
  let e = Js[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Js[t] = e, e;
}
async function er(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let a = s.replace(o, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Sa(a, e.fetchRequestInit, ({ result: l }) => (n = n.replace(s, `url(${l})`), [s, l]));
  });
  return Promise.all(r).then(() => n);
}
function tr(t) {
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
async function py(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        wt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let a = s + 1;
            const l = r.href, c = Qs(l).then((d) => er(d, e)).then((d) => tr(d).forEach((u) => {
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
        i.href != null && o.push(Qs(i.href).then((a) => er(a, e)).then((a) => tr(a).forEach((l) => {
          s.insertRule(l, s.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", r);
      }
  }), Promise.all(o).then(() => (t.forEach((i) => {
    if ("cssRules" in i)
      try {
        wt(i.cssRules || []).forEach((r) => {
          n.push(r);
        });
      } catch (r) {
        console.error(`Error while reading CSS rules from ${i.href}`, r);
      }
  }), n));
}
function my(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Pa(e.style.getPropertyValue("src")));
}
async function yy(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = wt(t.ownerDocument.styleSheets), o = await py(n, e);
  return my(o);
}
function Aa(t) {
  return t.trim().replace(/["']/g, "");
}
function wy(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(Aa(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function Na(t, e) {
  const n = await yy(t, e), o = wy(t);
  return (await Promise.all(n.filter((r) => o.has(Aa(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return Ma(r.cssText, s, e);
  }))).join(`
`);
}
async function vy(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Na(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function Ia(t, e = {}) {
  const { width: n, height: o } = Ti(t, e), i = await bo(t, e, !0);
  return await vy(i, e), await Ta(i, e), gy(i, e), await Fm(i, n, o);
}
async function kn(t, e = {}) {
  const { width: n, height: o } = Ti(t, e), i = await Ia(t, e), r = await fo(i), s = document.createElement("canvas"), a = s.getContext("2d"), l = e.pixelRatio || $m(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * l, s.height = d * l, e.skipAutoScale || Dm(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, s.width, s.height)), a.drawImage(r, 0, 0, s.width, s.height), s;
}
async function _y(t, e = {}) {
  const { width: n, height: o } = Ti(t, e);
  return (await kn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function by(t, e = {}) {
  return (await kn(t, e)).toDataURL();
}
async function xy(t, e = {}) {
  return (await kn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function Ey(t, e = {}) {
  const n = await kn(t, e);
  return await Hm(n);
}
async function Cy(t, e = {}) {
  return Na(t, e);
}
const Sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: Cy,
  toBlob: Ey,
  toCanvas: kn,
  toJpeg: xy,
  toPixelData: _y,
  toPng: by,
  toSvg: Ia
}, Symbol.toStringTag, { value: "Module" }));
export {
  yh as ComputeEngine,
  Ju as FlowHistory,
  ps as SHORTCUT_DEFAULTS,
  My as along,
  Lf as areNodesConnected,
  na as buildNodeMap,
  ia as clampToExtent,
  Lo as clampToParent,
  $y as computeRenderPlan,
  bs as computeValidationErrors,
  oa as computeZIndex,
  Dy as default,
  Ay as drift,
  sh as expandParentToFitChild,
  ti as getAbsolutePosition,
  Hf as getAutoPanDelta,
  oo as getBezierPath,
  Cf as getConnectedEdges,
  yt as getDescendantIds,
  Is as getEdgePosition,
  ya as getFloatingEdgeParams,
  Sf as getIncomers,
  Ns as getNodeIntersection,
  Yt as getNodesBounds,
  Ef as getNodesFullyInPolygon,
  Wu as getNodesFullyInRect,
  xf as getNodesInPolygon,
  Xu as getNodesInRect,
  Jo as getOutgoers,
  ky as getSimpleBezierPath,
  Iy as getSimpleFloatingPosition,
  vn as getSmoothStepPath,
  Df as getStepPath,
  Wr as getStraightPath,
  Jn as getViewportForBounds,
  Be as isConnectable,
  Nf as isDeletable,
  Xr as isDraggable,
  us as isResizable,
  Qo as isSelectable,
  Ze as matchesKey,
  mt as matchesModifier,
  Ly as orbit,
  Ty as pendulum,
  xi as pointInPolygon,
  bf as polygonIntersectsAABB,
  lf as registerMarker,
  un as resolveChildValidation,
  Vf as resolveShortcuts,
  Mt as sortNodesTopological,
  Ny as stagger,
  kt as toAbsoluteNode,
  io as toAbsoluteNodes,
  la as validateChildAdd,
  so as validateChildRemove,
  Py as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
