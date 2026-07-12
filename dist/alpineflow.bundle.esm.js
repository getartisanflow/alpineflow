let $o = null;
function _a(t) {
  $o = t;
}
function Se() {
  if (!$o)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return $o;
}
var ba = { value: () => {
} };
function co() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new $n(n);
}
function $n(t) {
  this._ = t;
}
function xa(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
$n.prototype = co.prototype = {
  constructor: $n,
  on: function(t, e) {
    var n = this._, o = xa(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = Ea(n[i], t.name))) return i;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++r < s; )
      if (i = (t = o[r]).type) n[i] = Li(n[i], t.name, e);
      else if (e == null) for (i in n) n[i] = Li(n[i], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new $n(t);
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
function Ea(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Li(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = ba, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Io = "http://www.w3.org/1999/xhtml";
const Pi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Io,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function uo(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Pi.hasOwnProperty(e) ? { space: Pi[e], local: t } : t;
}
function Ca(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Io && e.documentElement.namespaceURI === Io ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Sa(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Xs(t) {
  var e = uo(t);
  return (e.local ? Sa : Ca)(e);
}
function ka() {
}
function oi(t) {
  return t == null ? ka : function() {
    return this.querySelector(t);
  };
}
function La(t) {
  typeof t != "function" && (t = oi(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new He(o, this._parents);
}
function Pa(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Ma() {
  return [];
}
function Ys(t) {
  return t == null ? Ma : function() {
    return this.querySelectorAll(t);
  };
}
function Ta(t) {
  return function() {
    return Pa(t.apply(this, arguments));
  };
}
function Aa(t) {
  typeof t == "function" ? t = Ta(t) : t = Ys(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new He(o, i);
}
function Ws(t) {
  return function() {
    return this.matches(t);
  };
}
function js(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Na = Array.prototype.find;
function $a(t) {
  return function() {
    return Na.call(this.children, t);
  };
}
function Ia() {
  return this.firstElementChild;
}
function Da(t) {
  return this.select(t == null ? Ia : $a(typeof t == "function" ? t : js(t)));
}
var Ra = Array.prototype.filter;
function Ha() {
  return Array.from(this.children);
}
function Fa(t) {
  return function() {
    return Ra.call(this.children, t);
  };
}
function Oa(t) {
  return this.selectAll(t == null ? Ha : Fa(typeof t == "function" ? t : js(t)));
}
function za(t) {
  typeof t != "function" && (t = Ws(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new He(o, this._parents);
}
function Us(t) {
  return new Array(t.length);
}
function Va() {
  return new He(this._enter || this._groups.map(Us), this._parents);
}
function On(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
On.prototype = {
  constructor: On,
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
function Ba(t) {
  return function() {
    return t;
  };
}
function qa(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new On(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function Xa(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, u = r.length, f = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (f[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < u; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new On(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(f[l]) === a && (i[l] = a);
}
function Ya(t) {
  return t.__data__;
}
function Wa(t, e) {
  if (!arguments.length) return Array.from(this, Ya);
  var n = e ? Xa : qa, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Ba(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], u = i[c], f = u.length, h = ja(t.call(d, d && d.__data__, c, o)), p = h.length, g = l[c] = new Array(p), y = s[c] = new Array(p), m = a[c] = new Array(f);
    n(d, u, g, y, m, h, e);
    for (var x = 0, M = 0, v, C; x < p; ++x)
      if (v = g[x]) {
        for (x >= M && (M = x + 1); !(C = y[M]) && ++M < p; ) ;
        v._next = C || null;
      }
  }
  return s = new He(s, o), s._enter = l, s._exit = a, s;
}
function ja(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Ua() {
  return new He(this._exit || this._groups.map(Us), this._parents);
}
function Za(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Ka(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], u = c.length, f = l[a] = new Array(u), h, p = 0; p < u; ++p)
      (h = c[p] || d[p]) && (f[p] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new He(l, this._parents);
}
function Ga() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Ja(t) {
  t || (t = Qa);
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
function Qa(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function el() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function tl() {
  return Array.from(this);
}
function nl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function ol() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function il() {
  return !this.node();
}
function sl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function rl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function al(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ll(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function cl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function dl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function ul(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function fl(t, e) {
  var n = uo(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? al : rl : typeof e == "function" ? n.local ? ul : dl : n.local ? cl : ll)(n, e));
}
function Zs(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function hl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function gl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function pl(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function ml(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? hl : typeof e == "function" ? pl : gl)(t, e, n ?? "")) : Ft(this.node(), t);
}
function Ft(t, e) {
  return t.style.getPropertyValue(e) || Zs(t).getComputedStyle(t, null).getPropertyValue(e);
}
function yl(t) {
  return function() {
    delete this[t];
  };
}
function wl(t, e) {
  return function() {
    this[t] = e;
  };
}
function vl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function _l(t, e) {
  return arguments.length > 1 ? this.each((e == null ? yl : typeof e == "function" ? vl : wl)(t, e)) : this.node()[t];
}
function Ks(t) {
  return t.trim().split(/^|\s+/);
}
function ii(t) {
  return t.classList || new Gs(t);
}
function Gs(t) {
  this._node = t, this._names = Ks(t.getAttribute("class") || "");
}
Gs.prototype = {
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
function Js(t, e) {
  for (var n = ii(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function Qs(t, e) {
  for (var n = ii(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function bl(t) {
  return function() {
    Js(this, t);
  };
}
function xl(t) {
  return function() {
    Qs(this, t);
  };
}
function El(t, e) {
  return function() {
    (e.apply(this, arguments) ? Js : Qs)(this, t);
  };
}
function Cl(t, e) {
  var n = Ks(t + "");
  if (arguments.length < 2) {
    for (var o = ii(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? El : e ? bl : xl)(n, e));
}
function Sl() {
  this.textContent = "";
}
function kl(t) {
  return function() {
    this.textContent = t;
  };
}
function Ll(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Pl(t) {
  return arguments.length ? this.each(t == null ? Sl : (typeof t == "function" ? Ll : kl)(t)) : this.node().textContent;
}
function Ml() {
  this.innerHTML = "";
}
function Tl(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Al(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Nl(t) {
  return arguments.length ? this.each(t == null ? Ml : (typeof t == "function" ? Al : Tl)(t)) : this.node().innerHTML;
}
function $l() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Il() {
  return this.each($l);
}
function Dl() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Rl() {
  return this.each(Dl);
}
function Hl(t) {
  var e = typeof t == "function" ? t : Xs(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Fl() {
  return null;
}
function Ol(t, e) {
  var n = typeof t == "function" ? t : Xs(t), o = e == null ? Fl : typeof e == "function" ? e : oi(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function zl() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Vl() {
  return this.each(zl);
}
function Bl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ql() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Xl(t) {
  return this.select(t ? ql : Bl);
}
function Yl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Wl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function jl(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function Ul(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Zl(t, e, n) {
  return function() {
    var o = this.__on, i, r = Wl(e);
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
function Kl(t, e, n) {
  var o = jl(t + ""), i, r = o.length, s;
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
  for (l = e ? Zl : Ul, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function er(t, e, n) {
  var o = Zs(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function Gl(t, e) {
  return function() {
    return er(this, t, e);
  };
}
function Jl(t, e) {
  return function() {
    return er(this, t, e.apply(this, arguments));
  };
}
function Ql(t, e) {
  return this.each((typeof e == "function" ? Jl : Gl)(t, e));
}
function* ec() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var tr = [null];
function He(t, e) {
  this._groups = t, this._parents = e;
}
function mn() {
  return new He([[document.documentElement]], tr);
}
function tc() {
  return this;
}
He.prototype = mn.prototype = {
  constructor: He,
  select: La,
  selectAll: Aa,
  selectChild: Da,
  selectChildren: Oa,
  filter: za,
  data: Wa,
  enter: Va,
  exit: Ua,
  join: Za,
  merge: Ka,
  selection: tc,
  order: Ga,
  sort: Ja,
  call: el,
  nodes: tl,
  node: nl,
  size: ol,
  empty: il,
  each: sl,
  attr: fl,
  style: ml,
  property: _l,
  classed: Cl,
  text: Pl,
  html: Nl,
  raise: Il,
  lower: Rl,
  append: Hl,
  insert: Ol,
  remove: Vl,
  clone: Xl,
  datum: Yl,
  on: Kl,
  dispatch: Ql,
  [Symbol.iterator]: ec
};
function Be(t) {
  return typeof t == "string" ? new He([[document.querySelector(t)]], [document.documentElement]) : new He([[t]], tr);
}
function nc(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ke(t, e) {
  if (t = nc(t), e === void 0 && (e = t.currentTarget), e) {
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
const oc = { passive: !1 }, ln = { capture: !0, passive: !1 };
function mo(t) {
  t.stopImmediatePropagation();
}
function Nt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function nr(t) {
  var e = t.document.documentElement, n = Be(t).on("dragstart.drag", Nt, ln);
  "onselectstart" in e ? n.on("selectstart.drag", Nt, ln) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function or(t, e) {
  var n = t.document.documentElement, o = Be(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Nt, ln), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const bn = (t) => () => t;
function Do(t, {
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
Do.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function ic(t) {
  return !t.ctrlKey && !t.button;
}
function sc() {
  return this.parentNode;
}
function rc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function ac() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function lc() {
  var t = ic, e = sc, n = rc, o = ac, i = {}, r = co("start", "drag", "end"), s = 0, l, a, c, d, u = 0;
  function f(v) {
    v.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, oc).on("touchend.drag touchcancel.drag", x).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(v, C) {
    if (!(d || !t.call(this, v, C))) {
      var S = M(this, e.call(this, v, C), v, C, "mouse");
      S && (Be(v.view).on("mousemove.drag", p, ln).on("mouseup.drag", g, ln), nr(v.view), mo(v), c = !1, l = v.clientX, a = v.clientY, S("start", v));
    }
  }
  function p(v) {
    if (Nt(v), !c) {
      var C = v.clientX - l, S = v.clientY - a;
      c = C * C + S * S > u;
    }
    i.mouse("drag", v);
  }
  function g(v) {
    Be(v.view).on("mousemove.drag mouseup.drag", null), or(v.view, c), Nt(v), i.mouse("end", v);
  }
  function y(v, C) {
    if (t.call(this, v, C)) {
      var S = v.changedTouches, k = e.call(this, v, C), $ = S.length, b, E;
      for (b = 0; b < $; ++b)
        (E = M(this, k, v, C, S[b].identifier, S[b])) && (mo(v), E("start", v, S[b]));
    }
  }
  function m(v) {
    var C = v.changedTouches, S = C.length, k, $;
    for (k = 0; k < S; ++k)
      ($ = i[C[k].identifier]) && (Nt(v), $("drag", v, C[k]));
  }
  function x(v) {
    var C = v.changedTouches, S = C.length, k, $;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), k = 0; k < S; ++k)
      ($ = i[C[k].identifier]) && (mo(v), $("end", v, C[k]));
  }
  function M(v, C, S, k, $, b) {
    var E = r.copy(), A = Ke(b || S, C), L, w, _;
    if ((_ = n.call(v, new Do("beforestart", {
      sourceEvent: S,
      target: f,
      identifier: $,
      active: s,
      x: A[0],
      y: A[1],
      dx: 0,
      dy: 0,
      dispatch: E
    }), k)) != null)
      return L = _.x - A[0] || 0, w = _.y - A[1] || 0, function I(P, R, U) {
        var te = A, Q;
        switch (P) {
          case "start":
            i[$] = I, Q = s++;
            break;
          case "end":
            delete i[$], --s;
          // falls through
          case "drag":
            A = Ke(U || R, C), Q = s;
            break;
        }
        E.call(
          P,
          v,
          new Do(P, {
            sourceEvent: R,
            subject: _,
            target: f,
            identifier: $,
            active: Q,
            x: A[0] + L,
            y: A[1] + w,
            dx: A[0] - te[0],
            dy: A[1] - te[1],
            dispatch: E
          }),
          k
        );
      };
  }
  return f.filter = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : bn(!!v), f) : t;
  }, f.container = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : bn(v), f) : e;
  }, f.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : bn(v), f) : n;
  }, f.touchable = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : bn(!!v), f) : o;
  }, f.on = function() {
    var v = r.on.apply(r, arguments);
    return v === r ? f : v;
  }, f.clickDistance = function(v) {
    return arguments.length ? (u = (v = +v) * v, f) : Math.sqrt(u);
  }, f;
}
function si(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function ir(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function yn() {
}
var cn = 0.7, zn = 1 / cn, $t = "\\s*([+-]?\\d+)\\s*", dn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", je = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", cc = /^#([0-9a-f]{3,8})$/, dc = new RegExp(`^rgb\\(${$t},${$t},${$t}\\)$`), uc = new RegExp(`^rgb\\(${je},${je},${je}\\)$`), fc = new RegExp(`^rgba\\(${$t},${$t},${$t},${dn}\\)$`), hc = new RegExp(`^rgba\\(${je},${je},${je},${dn}\\)$`), gc = new RegExp(`^hsl\\(${dn},${je},${je}\\)$`), pc = new RegExp(`^hsla\\(${dn},${je},${je},${dn}\\)$`), Mi = {
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
si(yn, un, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ti,
  // Deprecated! Use color.formatHex.
  formatHex: Ti,
  formatHex8: mc,
  formatHsl: yc,
  formatRgb: Ai,
  toString: Ai
});
function Ti() {
  return this.rgb().formatHex();
}
function mc() {
  return this.rgb().formatHex8();
}
function yc() {
  return sr(this).formatHsl();
}
function Ai() {
  return this.rgb().formatRgb();
}
function un(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = cc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Ni(e) : n === 3 ? new Ae(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? xn(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? xn(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = dc.exec(t)) ? new Ae(e[1], e[2], e[3], 1) : (e = uc.exec(t)) ? new Ae(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = fc.exec(t)) ? xn(e[1], e[2], e[3], e[4]) : (e = hc.exec(t)) ? xn(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = gc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, 1) : (e = pc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, e[4]) : Mi.hasOwnProperty(t) ? Ni(Mi[t]) : t === "transparent" ? new Ae(NaN, NaN, NaN, 0) : null;
}
function Ni(t) {
  return new Ae(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function xn(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ae(t, e, n, o);
}
function wc(t) {
  return t instanceof yn || (t = un(t)), t ? (t = t.rgb(), new Ae(t.r, t.g, t.b, t.opacity)) : new Ae();
}
function Ro(t, e, n, o) {
  return arguments.length === 1 ? wc(t) : new Ae(t, e, n, o ?? 1);
}
function Ae(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
si(Ae, Ro, ir(yn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? cn : Math.pow(cn, t), new Ae(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ae(bt(this.r), bt(this.g), bt(this.b), Vn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: $i,
  // Deprecated! Use color.formatHex.
  formatHex: $i,
  formatHex8: vc,
  formatRgb: Ii,
  toString: Ii
}));
function $i() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}`;
}
function vc() {
  return `#${_t(this.r)}${_t(this.g)}${_t(this.b)}${_t((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ii() {
  const t = Vn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${bt(this.r)}, ${bt(this.g)}, ${bt(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Vn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function bt(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function _t(t) {
  return t = bt(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Di(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new qe(t, e, n, o);
}
function sr(t) {
  if (t instanceof qe) return new qe(t.h, t.s, t.l, t.opacity);
  if (t instanceof yn || (t = un(t)), !t) return new qe();
  if (t instanceof qe) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new qe(s, l, a, t.opacity);
}
function _c(t, e, n, o) {
  return arguments.length === 1 ? sr(t) : new qe(t, e, n, o ?? 1);
}
function qe(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
si(qe, _c, ir(yn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new qe(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? cn : Math.pow(cn, t), new qe(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ae(
      yo(t >= 240 ? t - 240 : t + 120, i, o),
      yo(t, i, o),
      yo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new qe(Ri(this.h), En(this.s), En(this.l), Vn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Vn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Ri(this.h)}, ${En(this.s) * 100}%, ${En(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Ri(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function En(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function yo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const rr = (t) => () => t;
function bc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function xc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function Ec(t) {
  return (t = +t) == 1 ? ar : function(e, n) {
    return n - e ? xc(e, n, t) : rr(isNaN(e) ? n : e);
  };
}
function ar(t, e) {
  var n = e - t;
  return n ? bc(t, n) : rr(isNaN(t) ? e : t);
}
const Ho = (function t(e) {
  var n = Ec(e);
  function o(i, r) {
    var s = n((i = Ro(i)).r, (r = Ro(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = ar(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = l(d), i.b = a(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function lt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Fo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, wo = new RegExp(Fo.source, "g");
function Cc(t) {
  return function() {
    return t;
  };
}
function Sc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function kc(t, e) {
  var n = Fo.lastIndex = wo.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = Fo.exec(t)) && (i = wo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: lt(o, i) })), n = wo.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? Sc(a[0].x) : Cc(e) : (e = a.length, function(c) {
    for (var d = 0, u; d < e; ++d) l[(u = a[d]).i] = u.x(c);
    return l.join("");
  });
}
var Hi = 180 / Math.PI, Oo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function lr(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Hi,
    skewX: Math.atan(a) * Hi,
    scaleX: s,
    scaleY: l
  };
}
var Cn;
function Lc(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Oo : lr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Pc(t) {
  return t == null || (Cn || (Cn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Cn.setAttribute("transform", t), !(t = Cn.transform.baseVal.consolidate())) ? Oo : (t = t.matrix, lr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function cr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: lt(c, u) }, { i: g - 2, x: lt(d, f) });
    } else (u || f) && h.push("translate(" + u + e + f + n);
  }
  function s(c, d, u, f) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), f.push({ i: u.push(i(u) + "rotate(", null, o) - 2, x: lt(c, d) })) : d && u.push(i(u) + "rotate(" + d + o);
  }
  function l(c, d, u, f) {
    c !== d ? f.push({ i: u.push(i(u) + "skewX(", null, o) - 2, x: lt(c, d) }) : d && u.push(i(u) + "skewX(" + d + o);
  }
  function a(c, d, u, f, h, p) {
    if (c !== u || d !== f) {
      var g = h.push(i(h) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: lt(c, u) }, { i: g - 2, x: lt(d, f) });
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
var Mc = cr(Lc, "px, ", "px)", "deg)"), Tc = cr(Pc, ", ", ")", ")"), Ac = 1e-12;
function Fi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Nc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function $c(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Ic = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], u = s[1], f = s[2], h = d - l, p = u - a, g = h * h + p * p, y, m;
    if (g < Ac)
      m = Math.log(f / c) / e, y = function(k) {
        return [
          l + k * h,
          a + k * p,
          c * Math.exp(e * k * m)
        ];
      };
    else {
      var x = Math.sqrt(g), M = (f * f - c * c + o * g) / (2 * c * n * x), v = (f * f - c * c - o * g) / (2 * f * n * x), C = Math.log(Math.sqrt(M * M + 1) - M), S = Math.log(Math.sqrt(v * v + 1) - v);
      m = (S - C) / e, y = function(k) {
        var $ = k * m, b = Fi(C), E = c / (n * x) * (b * $c(e * $ + C) - Nc(C));
        return [
          l + E * h,
          a + E * p,
          c * b / Fi(e * $ + C)
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
var Ot = 0, Qt = 0, jt = 0, dr = 1e3, Bn, en, qn = 0, Et = 0, fo = 0, fn = typeof performance == "object" && performance.now ? performance : Date, ur = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ri() {
  return Et || (ur(Dc), Et = fn.now() + fo);
}
function Dc() {
  Et = 0;
}
function Xn() {
  this._call = this._time = this._next = null;
}
Xn.prototype = fr.prototype = {
  constructor: Xn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ri() : +n) + (e == null ? 0 : +e), !this._next && en !== this && (en ? en._next = this : Bn = this, en = this), this._call = t, this._time = n, zo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, zo());
  }
};
function fr(t, e, n) {
  var o = new Xn();
  return o.restart(t, e, n), o;
}
function Rc() {
  ri(), ++Ot;
  for (var t = Bn, e; t; )
    (e = Et - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --Ot;
}
function Oi() {
  Et = (qn = fn.now()) + fo, Ot = Qt = 0;
  try {
    Rc();
  } finally {
    Ot = 0, Fc(), Et = 0;
  }
}
function Hc() {
  var t = fn.now(), e = t - qn;
  e > dr && (fo -= e, qn = t);
}
function Fc() {
  for (var t, e = Bn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Bn = n);
  en = t, zo(o);
}
function zo(t) {
  if (!Ot) {
    Qt && (Qt = clearTimeout(Qt));
    var e = t - Et;
    e > 24 ? (t < 1 / 0 && (Qt = setTimeout(Oi, t - fn.now() - fo)), jt && (jt = clearInterval(jt))) : (jt || (qn = fn.now(), jt = setInterval(Hc, dr)), Ot = 1, ur(Oi));
  }
}
function zi(t, e, n) {
  var o = new Xn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Oc = co("start", "end", "cancel", "interrupt"), zc = [], hr = 0, Vi = 1, Vo = 2, In = 3, Bi = 4, Bo = 5, Dn = 6;
function ho(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Vc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Oc,
    tween: zc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: hr
  });
}
function ai(t, e) {
  var n = Ye(t, e);
  if (n.state > hr) throw new Error("too late; already scheduled");
  return n;
}
function Ue(t, e) {
  var n = Ye(t, e);
  if (n.state > In) throw new Error("too late; already running");
  return n;
}
function Ye(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Vc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = fr(r, 0, n.time);
  function r(c) {
    n.state = Vi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, u, f, h;
    if (n.state !== Vi) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === In) return zi(s);
        h.state === Bi ? (h.state = Dn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Dn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (zi(function() {
      n.state === In && (n.state = Bi, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = Vo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Vo) {
      for (n.state = In, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++u] = h);
      i.length = u + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = Bo, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(t, d);
    n.state === Bo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = Dn, n.timer.stop(), delete o[e];
    for (var c in o) return;
    delete t.__transition;
  }
}
function Rn(t, e) {
  var n = t.__transition, o, i, r = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((o = n[s]).name !== e) {
        r = !1;
        continue;
      }
      i = o.state > Vo && o.state < Bo, o.state = Dn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Bc(t) {
  return this.each(function() {
    Rn(this, t);
  });
}
function qc(t, e) {
  var n, o;
  return function() {
    var i = Ue(this, t), r = i.tween;
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
function Xc(t, e, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = Ue(this, t), s = r.tween;
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
function Yc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = Ye(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? qc : Xc)(n, t, e));
}
function li(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = Ue(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return Ye(i, o).value[e];
  };
}
function gr(t, e) {
  var n;
  return (typeof e == "number" ? lt : e instanceof un ? Ho : (n = un(e)) ? (e = n, Ho) : kc)(t, e);
}
function Wc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function jc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Uc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Zc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Kc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Gc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Jc(t, e) {
  var n = uo(t), o = n === "transform" ? Tc : gr;
  return this.attrTween(t, typeof e == "function" ? (n.local ? Gc : Kc)(n, o, li(this, "attr." + t, e)) : e == null ? (n.local ? jc : Wc)(n) : (n.local ? Zc : Uc)(n, o, e));
}
function Qc(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function ed(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function td(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && ed(t, r)), n;
  }
  return i._value = e, i;
}
function nd(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Qc(t, r)), n;
  }
  return i._value = e, i;
}
function od(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = uo(t);
  return this.tween(n, (o.local ? td : nd)(o, e));
}
function id(t, e) {
  return function() {
    ai(this, t).delay = +e.apply(this, arguments);
  };
}
function sd(t, e) {
  return e = +e, function() {
    ai(this, t).delay = e;
  };
}
function rd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? id : sd)(e, t)) : Ye(this.node(), e).delay;
}
function ad(t, e) {
  return function() {
    Ue(this, t).duration = +e.apply(this, arguments);
  };
}
function ld(t, e) {
  return e = +e, function() {
    Ue(this, t).duration = e;
  };
}
function cd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ad : ld)(e, t)) : Ye(this.node(), e).duration;
}
function dd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    Ue(this, t).ease = e;
  };
}
function ud(t) {
  var e = this._id;
  return arguments.length ? this.each(dd(e, t)) : Ye(this.node(), e).ease;
}
function fd(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    Ue(this, t).ease = n;
  };
}
function hd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(fd(this._id, t));
}
function gd(t) {
  typeof t != "function" && (t = Ws(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new ot(o, this._parents, this._name, this._id);
}
function pd(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, u = s[l] = new Array(d), f, h = 0; h < d; ++h)
      (f = a[h] || c[h]) && (u[h] = f);
  for (; l < o; ++l)
    s[l] = e[l];
  return new ot(s, this._parents, this._name, this._id);
}
function md(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function yd(t, e, n) {
  var o, i, r = md(e) ? ai : Ue;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function wd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? Ye(this.node(), n).on.on(t) : this.each(yd(n, t, e));
}
function vd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function _d() {
  return this.on("end.remove", vd(this._id));
}
function bd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = oi(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, u, f = 0; f < a; ++f)
      (d = l[f]) && (u = t.call(d, d.__data__, f, l)) && ("__data__" in d && (u.__data__ = d.__data__), c[f] = u, ho(c[f], e, n, f, c, Ye(d, n)));
  return new ot(r, this._parents, e, n);
}
function xd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Ys(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, u = 0; u < c; ++u)
      if (d = a[u]) {
        for (var f = t.call(d, d.__data__, u, a), h, p = Ye(d, n), g = 0, y = f.length; g < y; ++g)
          (h = f[g]) && ho(h, e, n, g, f, p);
        r.push(f), s.push(d);
      }
  return new ot(r, s, e, n);
}
var Ed = mn.prototype.constructor;
function Cd() {
  return new Ed(this._groups, this._parents);
}
function Sd(t, e) {
  var n, o, i;
  return function() {
    var r = Ft(this, t), s = (this.style.removeProperty(t), Ft(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function pr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function kd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Ft(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Ld(t, e, n) {
  var o, i, r;
  return function() {
    var s = Ft(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), Ft(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Pd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = Ue(this, t), c = a.on, d = a.value[r] == null ? l || (l = pr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Md(t, e, n) {
  var o = (t += "") == "transform" ? Mc : gr;
  return e == null ? this.styleTween(t, Sd(t, o)).on("end.style." + t, pr(t)) : typeof e == "function" ? this.styleTween(t, Ld(t, o, li(this, "style." + t, e))).each(Pd(this._id, t)) : this.styleTween(t, kd(t, o, e), n).on("end.style." + t, null);
}
function Td(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Ad(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && Td(t, s, n)), o;
  }
  return r._value = e, r;
}
function Nd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Ad(t, e, n ?? ""));
}
function $d(t) {
  return function() {
    this.textContent = t;
  };
}
function Id(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Dd(t) {
  return this.tween("text", typeof t == "function" ? Id(li(this, "text", t)) : $d(t == null ? "" : t + ""));
}
function Rd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Hd(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Rd(i)), e;
  }
  return o._value = t, o;
}
function Fd(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Hd(t));
}
function Od() {
  for (var t = this._name, e = this._id, n = mr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = Ye(a, e);
        ho(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new ot(o, this._parents, t, n);
}
function zd() {
  var t, e, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var l = { value: s }, a = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var c = Ue(this, o), d = c.on;
      d !== t && (e = (t = d).copy(), e._.cancel.push(l), e._.interrupt.push(l), e._.end.push(a)), c.on = e;
    }), i === 0 && r();
  });
}
var Vd = 0;
function ot(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function mr() {
  return ++Vd;
}
var Ze = mn.prototype;
ot.prototype = {
  constructor: ot,
  select: bd,
  selectAll: xd,
  selectChild: Ze.selectChild,
  selectChildren: Ze.selectChildren,
  filter: gd,
  merge: pd,
  selection: Cd,
  transition: Od,
  call: Ze.call,
  nodes: Ze.nodes,
  node: Ze.node,
  size: Ze.size,
  empty: Ze.empty,
  each: Ze.each,
  on: wd,
  attr: Jc,
  attrTween: od,
  style: Md,
  styleTween: Nd,
  text: Dd,
  textTween: Fd,
  remove: _d,
  tween: Yc,
  delay: rd,
  duration: cd,
  ease: ud,
  easeVarying: hd,
  end: zd,
  [Symbol.iterator]: Ze[Symbol.iterator]
};
const Bd = (t) => +t;
function qd(t) {
  return t * t;
}
function Xd(t) {
  return t * (2 - t);
}
function Yd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Wd(t) {
  return t * t * t;
}
function jd(t) {
  return --t * t * t + 1;
}
function yr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var wr = Math.PI, vr = wr / 2;
function Ud(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * vr);
}
function Zd(t) {
  return Math.sin(t * vr);
}
function Kd(t) {
  return (1 - Math.cos(wr * t)) / 2;
}
function pt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function Gd(t) {
  return pt(1 - +t);
}
function Jd(t) {
  return 1 - pt(t);
}
function Qd(t) {
  return ((t *= 2) <= 1 ? pt(1 - t) : 2 - pt(t - 1)) / 2;
}
function eu(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function tu(t) {
  return Math.sqrt(1 - --t * t);
}
function nu(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var qo = 4 / 11, ou = 6 / 11, iu = 8 / 11, su = 3 / 4, ru = 9 / 11, au = 10 / 11, lu = 15 / 16, cu = 21 / 22, du = 63 / 64, Sn = 1 / qo / qo;
function uu(t) {
  return 1 - Yn(1 - t);
}
function Yn(t) {
  return (t = +t) < qo ? Sn * t * t : t < iu ? Sn * (t -= ou) * t + su : t < au ? Sn * (t -= ru) * t + lu : Sn * (t -= cu) * t + du;
}
function fu(t) {
  return ((t *= 2) <= 1 ? 1 - Yn(1 - t) : Yn(t - 1) + 1) / 2;
}
var ci = 1.70158, hu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(ci), gu = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(ci), pu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ci), zt = 2 * Math.PI, di = 1, ui = 0.3, mu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return e * pt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), yu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return 1 - e * pt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), wu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= zt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * pt(-r) * Math.sin((o - r) / n) : 2 - e * pt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * zt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(di, ui), vu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: yr
};
function _u(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function bu(t) {
  var e, n;
  t instanceof ot ? (e = t._id, t = t._name) : (e = mr(), (n = vu).time = ri(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && ho(a, t, e, c, s, n || _u(a, e));
  return new ot(o, this._parents, t, e);
}
mn.prototype.interrupt = Bc;
mn.prototype.transition = bu;
const kn = (t) => () => t;
function xu(t, {
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
function Qe(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
Qe.prototype = {
  constructor: Qe,
  scale: function(t) {
    return t === 1 ? this : new Qe(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new Qe(this.k, this.x + this.k * t, this.y + this.k * e);
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
var Wn = new Qe(1, 0, 0);
Qe.prototype;
function vo(t) {
  t.stopImmediatePropagation();
}
function Ut(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Eu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function Cu() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function qi() {
  return this.__zoom || Wn;
}
function Su(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function ku() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Lu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Pu() {
  var t = Eu, e = Cu, n = Lu, o = Su, i = ku, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = Ic, c = co("start", "zoom", "end"), d, u, f, h = 500, p = 150, g = 0, y = 10;
  function m(_) {
    _.property("__zoom", qi).on("wheel.zoom", $, { passive: !1 }).on("mousedown.zoom", b).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", A).on("touchmove.zoom", L).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(_, I, P, R) {
    var U = _.selection ? _.selection() : _;
    U.property("__zoom", qi), _ !== U ? C(_, I, P, R) : U.interrupt().each(function() {
      S(this, arguments).event(R).start().zoom(null, typeof I == "function" ? I.apply(this, arguments) : I).end();
    });
  }, m.scaleBy = function(_, I, P, R) {
    m.scaleTo(_, function() {
      var U = this.__zoom.k, te = typeof I == "function" ? I.apply(this, arguments) : I;
      return U * te;
    }, P, R);
  }, m.scaleTo = function(_, I, P, R) {
    m.transform(_, function() {
      var U = e.apply(this, arguments), te = this.__zoom, Q = P == null ? v(U) : typeof P == "function" ? P.apply(this, arguments) : P, T = te.invert(Q), N = typeof I == "function" ? I.apply(this, arguments) : I;
      return n(M(x(te, N), Q, T), U, s);
    }, P, R);
  }, m.translateBy = function(_, I, P, R) {
    m.transform(_, function() {
      return n(this.__zoom.translate(
        typeof I == "function" ? I.apply(this, arguments) : I,
        typeof P == "function" ? P.apply(this, arguments) : P
      ), e.apply(this, arguments), s);
    }, null, R);
  }, m.translateTo = function(_, I, P, R, U) {
    m.transform(_, function() {
      var te = e.apply(this, arguments), Q = this.__zoom, T = R == null ? v(te) : typeof R == "function" ? R.apply(this, arguments) : R;
      return n(Wn.translate(T[0], T[1]).scale(Q.k).translate(
        typeof I == "function" ? -I.apply(this, arguments) : -I,
        typeof P == "function" ? -P.apply(this, arguments) : -P
      ), te, s);
    }, R, U);
  };
  function x(_, I) {
    return I = Math.max(r[0], Math.min(r[1], I)), I === _.k ? _ : new Qe(I, _.x, _.y);
  }
  function M(_, I, P) {
    var R = I[0] - P[0] * _.k, U = I[1] - P[1] * _.k;
    return R === _.x && U === _.y ? _ : new Qe(_.k, R, U);
  }
  function v(_) {
    return [(+_[0][0] + +_[1][0]) / 2, (+_[0][1] + +_[1][1]) / 2];
  }
  function C(_, I, P, R) {
    _.on("start.zoom", function() {
      S(this, arguments).event(R).start();
    }).on("interrupt.zoom end.zoom", function() {
      S(this, arguments).event(R).end();
    }).tween("zoom", function() {
      var U = this, te = arguments, Q = S(U, te).event(R), T = e.apply(U, te), N = P == null ? v(T) : typeof P == "function" ? P.apply(U, te) : P, F = Math.max(T[1][0] - T[0][0], T[1][1] - T[0][1]), re = U.__zoom, ce = typeof I == "function" ? I.apply(U, te) : I, ae = a(re.invert(N).concat(F / re.k), ce.invert(N).concat(F / ce.k));
      return function(X) {
        if (X === 1) X = ce;
        else {
          var V = ae(X), q = F / V[2];
          X = new Qe(q, N[0] - V[0] * q, N[1] - V[1] * q);
        }
        Q.zoom(null, X);
      };
    });
  }
  function S(_, I, P) {
    return !P && _.__zooming || new k(_, I);
  }
  function k(_, I) {
    this.that = _, this.args = I, this.active = 0, this.sourceEvent = null, this.extent = e.apply(_, I), this.taps = 0;
  }
  k.prototype = {
    event: function(_) {
      return _ && (this.sourceEvent = _), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(_, I) {
      return this.mouse && _ !== "mouse" && (this.mouse[1] = I.invert(this.mouse[0])), this.touch0 && _ !== "touch" && (this.touch0[1] = I.invert(this.touch0[0])), this.touch1 && _ !== "touch" && (this.touch1[1] = I.invert(this.touch1[0])), this.that.__zoom = I, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(_) {
      var I = Be(this.that).datum();
      c.call(
        _,
        this.that,
        new xu(_, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        I
      );
    }
  };
  function $(_, ...I) {
    if (!t.apply(this, arguments)) return;
    var P = S(this, I).event(_), R = this.__zoom, U = Math.max(r[0], Math.min(r[1], R.k * Math.pow(2, o.apply(this, arguments)))), te = Ke(_);
    if (P.wheel)
      (P.mouse[0][0] !== te[0] || P.mouse[0][1] !== te[1]) && (P.mouse[1] = R.invert(P.mouse[0] = te)), clearTimeout(P.wheel);
    else {
      if (R.k === U) return;
      P.mouse = [te, R.invert(te)], Rn(this), P.start();
    }
    Ut(_), P.wheel = setTimeout(Q, p), P.zoom("mouse", n(M(x(R, U), P.mouse[0], P.mouse[1]), P.extent, s));
    function Q() {
      P.wheel = null, P.end();
    }
  }
  function b(_, ...I) {
    if (f || !t.apply(this, arguments)) return;
    var P = _.currentTarget, R = S(this, I, !0).event(_), U = Be(_.view).on("mousemove.zoom", N, !0).on("mouseup.zoom", F, !0), te = Ke(_, P), Q = _.clientX, T = _.clientY;
    nr(_.view), vo(_), R.mouse = [te, this.__zoom.invert(te)], Rn(this), R.start();
    function N(re) {
      if (Ut(re), !R.moved) {
        var ce = re.clientX - Q, ae = re.clientY - T;
        R.moved = ce * ce + ae * ae > g;
      }
      R.event(re).zoom("mouse", n(M(R.that.__zoom, R.mouse[0] = Ke(re, P), R.mouse[1]), R.extent, s));
    }
    function F(re) {
      U.on("mousemove.zoom mouseup.zoom", null), or(re.view, R.moved), Ut(re), R.event(re).end();
    }
  }
  function E(_, ...I) {
    if (t.apply(this, arguments)) {
      var P = this.__zoom, R = Ke(_.changedTouches ? _.changedTouches[0] : _, this), U = P.invert(R), te = P.k * (_.shiftKey ? 0.5 : 2), Q = n(M(x(P, te), R, U), e.apply(this, I), s);
      Ut(_), l > 0 ? Be(this).transition().duration(l).call(C, Q, R, _) : Be(this).call(m.transform, Q, R, _);
    }
  }
  function A(_, ...I) {
    if (t.apply(this, arguments)) {
      var P = _.touches, R = P.length, U = S(this, I, _.changedTouches.length === R).event(_), te, Q, T, N;
      for (vo(_), Q = 0; Q < R; ++Q)
        T = P[Q], N = Ke(T, this), N = [N, this.__zoom.invert(N), T.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== N[2] && (U.touch1 = N, U.taps = 0) : (U.touch0 = N, te = !0, U.taps = 1 + !!d);
      d && (d = clearTimeout(d)), te && (U.taps < 2 && (u = N[0], d = setTimeout(function() {
        d = null;
      }, h)), Rn(this), U.start());
    }
  }
  function L(_, ...I) {
    if (this.__zooming) {
      var P = S(this, I).event(_), R = _.changedTouches, U = R.length, te, Q, T, N;
      for (Ut(_), te = 0; te < U; ++te)
        Q = R[te], T = Ke(Q, this), P.touch0 && P.touch0[2] === Q.identifier ? P.touch0[0] = T : P.touch1 && P.touch1[2] === Q.identifier && (P.touch1[0] = T);
      if (Q = P.that.__zoom, P.touch1) {
        var F = P.touch0[0], re = P.touch0[1], ce = P.touch1[0], ae = P.touch1[1], X = (X = ce[0] - F[0]) * X + (X = ce[1] - F[1]) * X, V = (V = ae[0] - re[0]) * V + (V = ae[1] - re[1]) * V;
        Q = x(Q, Math.sqrt(X / V)), T = [(F[0] + ce[0]) / 2, (F[1] + ce[1]) / 2], N = [(re[0] + ae[0]) / 2, (re[1] + ae[1]) / 2];
      } else if (P.touch0) T = P.touch0[0], N = P.touch0[1];
      else return;
      P.zoom("touch", n(M(Q, T, N), P.extent, s));
    }
  }
  function w(_, ...I) {
    if (this.__zooming) {
      var P = S(this, I).event(_), R = _.changedTouches, U = R.length, te, Q;
      for (vo(_), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), te = 0; te < U; ++te)
        Q = R[te], P.touch0 && P.touch0[2] === Q.identifier ? delete P.touch0 : P.touch1 && P.touch1[2] === Q.identifier && delete P.touch1;
      if (P.touch1 && !P.touch0 && (P.touch0 = P.touch1, delete P.touch1), P.touch0) P.touch0[1] = this.__zoom.invert(P.touch0[0]);
      else if (P.end(), P.taps === 2 && (Q = Ke(Q, this), Math.hypot(u[0] - Q[0], u[1] - Q[1]) < y)) {
        var T = Be(this).on("dblclick.zoom");
        T && T.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : kn(+_), m) : o;
  }, m.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : kn(!!_), m) : t;
  }, m.touchable = function(_) {
    return arguments.length ? (i = typeof _ == "function" ? _ : kn(!!_), m) : i;
  }, m.extent = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : kn([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), m) : e;
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
    return arguments.length ? (g = (_ = +_) * _, m) : Math.sqrt(g);
  }, m.tapDistance = function(_) {
    return arguments.length ? (y = +_, m) : y;
  }, m;
}
function Xi(t) {
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
function Mu(t, e) {
  const {
    onTransformChange: n,
    minZoom: o = 0.5,
    maxZoom: i = 2,
    pannable: r = !0,
    zoomable: s = !0
  } = e, l = Be(t);
  let a = !1;
  const c = e.panActivationKeyCode !== void 0 ? e.panActivationKeyCode : "Space", d = (k) => {
    c && k.code === c && (a = !0, t.style.cursor = "grab");
  }, u = (k) => {
    c && k.code === c && (a = !1, t.style.cursor = "");
  }, f = () => {
    a = !1, t.style.cursor = "";
  };
  c && (window.addEventListener("keydown", d), window.addEventListener("keyup", u), window.addEventListener("blur", f));
  const h = Pu().scaleExtent([o, i]).on("start", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grabbing");
    const { x: $, y: b, k: E } = k.transform;
    e.onMoveStart?.({ x: $, y: b, zoom: E });
  }).on("zoom", (k) => {
    const { x: $, y: b, k: E } = k.transform;
    n({ x: $, y: b, zoom: E }), k.sourceEvent && e.onMove?.({ x: $, y: b, zoom: E });
  }).on("end", (k) => {
    if (!k.sourceEvent) return;
    a && (t.style.cursor = "grab");
    const { x: $, y: b, k: E } = k.transform;
    e.onMoveEnd?.({ x: $, y: b, zoom: E });
  });
  e.translateExtent && h.translateExtent(e.translateExtent), h.filter(Xi({
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
  const x = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, M = (k) => {
    x && k.code === x && (m = !0);
  }, v = (k) => {
    x && k.code === x && (m = !1);
  }, C = () => {
    m = !1;
  };
  x && (window.addEventListener("keydown", M), window.addEventListener("keyup", v), window.addEventListener("blur", C));
  const S = (k) => {
    if (e.isLocked?.()) return;
    const $ = k.ctrlKey || k.metaKey || m;
    if (!(p ? !$ : k.shiftKey)) return;
    k.preventDefault(), k.stopPropagation();
    const E = y;
    let A = 0, L = 0;
    g !== "horizontal" && (L = -k.deltaY * E), g !== "vertical" && (A = -k.deltaX * E, k.shiftKey && k.deltaX === 0 && g === "both" && (A = -k.deltaY * E, L = 0)), e.onScrollPan?.(A, L);
  };
  return t.addEventListener("wheel", S, { passive: !1, capture: !0 }), {
    setViewport(k, $) {
      const b = $?.duration ?? 0, E = Wn.translate(k.x ?? 0, k.y ?? 0).scale(k.zoom ?? 1);
      b > 0 ? l.transition().duration(b).call(h.transform, E) : l.call(h.transform, E);
    },
    getTransform() {
      return t.__zoom ?? Wn;
    },
    update(k) {
      if ((k.minZoom !== void 0 || k.maxZoom !== void 0) && h.scaleExtent([
        k.minZoom ?? o,
        k.maxZoom ?? i
      ]), k.pannable !== void 0 || k.zoomable !== void 0) {
        const $ = k.pannable ?? r, b = k.zoomable ?? s;
        h.filter(Xi({
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
      k.panOnScroll !== void 0 && (p = k.panOnScroll), k.panOnScrollDirection !== void 0 && (g = k.panOnScrollDirection), k.panOnScrollSpeed !== void 0 && (y = k.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", S, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", u), window.removeEventListener("blur", f)), x && (window.removeEventListener("keydown", M), window.removeEventListener("keyup", v), window.removeEventListener("blur", C)), l.on(".zoom", null);
    }
  };
}
function _r(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function Tu(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const _e = 150, be = 50;
function go(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, u = e + o / 2;
  return { x: d - a / 2, y: u - c / 2, width: a, height: c };
}
function Vt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? _e, a = s.dimensions?.height ?? be, c = Yt(s, e), d = s.rotation ? go(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Au(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? be, a = Yt(r, n), c = r.rotation ? go(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, u = c.y + c.height;
    return !(d < e.x || c.x > o || u < e.y || c.y > i);
  });
}
function Nu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? _e, l = r.dimensions?.height ?? be, a = Yt(r, n), c = r.rotation ? go(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, u = n / c, f = Math.min(Math.max(Math.min(d, u), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, p = e / 2 - h.x * f, g = n / 2 - h.y * f;
  return { x: p, y: g, zoom: f };
}
function $u(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
function Yt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? _e, i = t.dimensions?.height ?? be;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let br = !1;
function xr(t) {
  br = t;
}
function B(t, e, n) {
  if (!br) return;
  const o = `%c[AlpineFlow:${t}]`, i = Iu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Iu(t) {
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
const hn = "#64748b", fi = "#d4d4d8", Er = "#ef4444", Du = "2", Ru = "6 3", Yi = 1.2, Xo = 0.2, Hn = 5, Wi = 25;
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
const Fu = 16;
function Ou() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Fu),
    cancel: (t) => clearTimeout(t)
  };
}
class Cr {
  constructor() {
    this._scheduler = Ou(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Un = new Cr(), zu = {
  linear: Bd,
  easeIn: qd,
  easeOut: Xd,
  easeInOut: Yd,
  easeCubicIn: Wd,
  easeCubicOut: jd,
  easeCubicInOut: yr,
  easeCircIn: eu,
  easeCircOut: tu,
  easeCircInOut: nu,
  easeSinIn: Ud,
  easeSinOut: Zd,
  easeSinInOut: Kd,
  easeExpoIn: Gd,
  easeExpoOut: Jd,
  easeExpoInOut: Qd,
  easeBounce: Yn,
  easeBounceIn: uu,
  easeBounceInOut: fu,
  easeElastic: yu,
  easeElasticIn: mu,
  easeElasticInOut: wu,
  easeBack: pu,
  easeBackIn: hu,
  easeBackOut: gu
};
function Sr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Zn(t) {
  return typeof t == "function" ? t : zu[t ?? "easeInOut"];
}
function nt(t, e, n) {
  return t + (e - t) * n;
}
function hi(t, e, n) {
  return Ho(t, e)(n);
}
function gn(t) {
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
const ji = /^(-?\d+\.?\d*)(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch)?$/, Ui = /^(#|rgb|hsl)/;
function kr(t, e, n) {
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
    const a = ji.exec(s), c = ji.exec(l);
    if (a && c) {
      const d = parseFloat(a[1]), u = parseFloat(c[1]), f = c[2] ?? "", h = nt(d, u, n);
      o[r] = f ? `${h}${f}` : String(h);
      continue;
    }
    if (Ui.test(s) && Ui.test(l)) {
      o[r] = hi(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function Vu(t, e, n, o) {
  let i = nt(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: nt(t.x, e.x, n),
    y: nt(t.y, e.y, n),
    zoom: i
  };
}
class Bu {
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
class qu {
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
const Zt = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Lr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Zt.stiffness, i = e.damping ?? Zt.damping, r = e.mass ?? Zt.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Zt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Zt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Zi = {
  timeConstant: 350,
  restVelocity: 0.5
};
function gi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Zi.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Zi.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function pi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Pr(t, e, n, o) {
  if (n <= 0)
    return;
  gi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? pi(o) : null;
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
function Mr(t, e, n, o) {
  const i = pi(o), r = e.values.map(
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
const Ki = {
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  wobbly: { type: "spring", stiffness: 180, damping: 12 },
  stiff: { type: "spring", stiffness: 300, damping: 30 },
  slow: { type: "spring", stiffness: 60, damping: 15 },
  molasses: { type: "spring", stiffness: 40, damping: 30 }
}, Gi = {
  smooth: { type: "decay", velocity: 0, power: 0.6, timeConstant: 400 },
  snappy: { type: "decay", velocity: 0, power: 1.2, timeConstant: 200 }
}, Ji = {
  momentum: { type: "inertia", velocity: 0, power: 0.8, timeConstant: 700 },
  rails: { type: "inertia", velocity: 0, bounceStiffness: 500, bounceDamping: 40 }
};
function Tr(t) {
  if (typeof t != "string")
    return t;
  const [e, n] = t.split(".");
  if (!n)
    return null;
  switch (e) {
    case "spring":
      return Ki[n] ? { ...Ki[n] } : null;
    case "decay":
      return Gi[n] ? { ...Gi[n] } : null;
    case "inertia":
      return Ji[n] ? { ...Ji[n] } : null;
    default:
      return null;
  }
}
function Qi(t) {
  return typeof t != "string" ? !1 : /^(#|rgb|hsl)/.test(t);
}
function Xu(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? nt(t, e, n) : Qi(t) && Qi(e) ? hi(t, e, n) : n < 0.5 ? t : e;
}
class Yu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Bu(), this._activeTransaction = null, this._engine = e;
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
    const e = new qu();
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
    } = n, m = Zn(i), x = g ? Tr(g) : void 0;
    for (const _ of e) {
      const I = this._ownership.get(_.key);
      if (I && !I.stopped) {
        const P = I.currentValues.get(_.key);
        P !== void 0 && (_.from = P), I.entries = I.entries.filter((R) => R.key !== _.key), I.entries.length === 0 && this._stop(I, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const _ of e)
        this._activeTransaction.captureProperty(_.key, _.from, _.apply);
    if (o <= 0) {
      const _ = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (const U of e)
        _.set(U.key, U.from), I.set(U.key, U.to);
      a?.();
      for (const U of e)
        U.apply(U.to);
      const P = [...u ? [u] : [], ...f ?? []], R = {
        _tags: P.length > 0 ? P : void 0,
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
          return _;
        },
        get _target() {
          return I;
        }
      };
      return this._registry.register(R), queueMicrotask(() => this._registry.unregister(R)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(R), d?.(), R;
    }
    const M = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
    for (const _ of e)
      M.set(_.key, _.from), v.set(_.key, _.to);
    let C;
    if (x) {
      C = /* @__PURE__ */ new Map();
      for (const _ of e) {
        if (typeof _.from != "number" || typeof _.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${_.key}" is non-numeric; snapping to target.`
          ), _.apply(_.to);
          continue;
        }
        let I = 0;
        if (x.type === "decay" || x.type === "inertia") {
          const P = x.velocity;
          if (typeof P == "number")
            I = P;
          else if (P && typeof P == "object") {
            const U = P, te = pi(_.key);
            I = U[_.key] ?? (te ? U[te] ?? 0 : 0);
          }
          const R = x.power ?? 0.8;
          I *= R;
        }
        C.set(_.key, {
          value: _.from,
          velocity: I,
          target: _.to,
          settled: !1
        });
      }
      C.size === 0 && (C = void 0);
    }
    const S = s === "ping-pong" ? "reverse" : s, k = l === "end" ? "backward" : "forward";
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
      direction: k,
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
      snapshot: M,
      target: v,
      _currentFinished: b,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: C ? x : void 0,
      physicsStates: C,
      maxDuration: y,
      isPhysics: !!C,
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
    const A = this._engine.register((_) => this._tick(E, _), r);
    E.engineHandle = A;
    const L = [...u ? [u] : [], ...f ?? []], w = {
      _tags: L.length > 0 ? L : void 0,
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
      const a = Xu(l.from, l.to, s);
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
              Lr(d, e.motionConfig, i);
              break;
            case "decay":
              gi(d, e.motionConfig, i);
              break;
            case "inertia":
              Pr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const u = n - e.startTime, f = e.motionConfig.duration ?? e.maxDuration, h = Math.min(u / f, 1);
              Mr(d, e.motionConfig, h, c.key);
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
const Ar = /* @__PURE__ */ new Map();
function Wu(t, e) {
  Ar.set(t, e);
}
function _o(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function It(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Dt(t, e) {
  return `${e}__${t.type}__${(t.color ?? fi).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Kn(t, e) {
  const n = _o(t.color ?? fi), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = _o(t.orient ?? "auto-start-reverse"), a = _o(e);
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
  const c = Ar.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : Kn({ ...t, type: "arrowclosed" }, e);
}
const mt = 200, yt = 150, ju = 1.2, Kt = "http://www.w3.org/2000/svg";
function Uu(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Kt, "svg");
  c.setAttribute("width", String(mt)), c.setAttribute("height", String(yt));
  const d = document.createElementNS(Kt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(mt)), d.setAttribute("height", String(yt));
  const u = document.createElementNS(Kt, "g");
  u.classList.add("flow-minimap-nodes");
  const f = document.createElementNS(Kt, "path");
  f.classList.add("flow-minimap-mask"), s && f.setAttribute("fill", s), f.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(u), c.appendChild(f), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, p = 1;
  function g() {
    const A = n();
    if (h = Vt(A.nodes.filter((L) => !L.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      p = 1;
      return;
    }
    p = Math.max(
      h.width / mt,
      h.height / yt
    ) * ju;
  }
  function y(A) {
    return typeof l == "function" ? l(A) : l;
  }
  function m() {
    const A = n();
    g(), u.innerHTML = "";
    const L = (mt - h.width / p) / 2, w = (yt - h.height / p) / 2;
    for (const _ of A.nodes) {
      if (_.hidden) continue;
      const I = document.createElementNS(Kt, "rect"), P = (_.dimensions?.width ?? _e) / p, R = (_.dimensions?.height ?? be) / p, U = (_.position.x - h.x) / p + L, te = (_.position.y - h.y) / p + w;
      I.setAttribute("x", String(U)), I.setAttribute("y", String(te)), I.setAttribute("width", String(P)), I.setAttribute("height", String(R)), I.setAttribute("rx", "2");
      const Q = y(_);
      Q && (I.style.fill = Q), u.appendChild(I);
    }
    x();
  }
  function x() {
    const A = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      f.setAttribute("d", "");
      return;
    }
    const L = (mt - h.width / p) / 2, w = (yt - h.height / p) / 2, _ = (-A.viewport.x / A.viewport.zoom - h.x) / p + L, I = (-A.viewport.y / A.viewport.zoom - h.y) / p + w, P = A.containerWidth / A.viewport.zoom / p, R = A.containerHeight / A.viewport.zoom / p, U = `M0,0 H${mt} V${yt} H0 Z`, te = `M${_},${I} h${P} v${R} h${-P} Z`;
    f.setAttribute("d", `${U} ${te}`);
  }
  let M = !1;
  function v(A, L) {
    const w = (mt - h.width / p) / 2, _ = (yt - h.height / p) / 2, I = (A - w) * p + h.x, P = (L - _) * p + h.y;
    return { x: I, y: P };
  }
  function C(A) {
    const L = c.getBoundingClientRect(), w = A.clientX - L.left, _ = A.clientY - L.top, I = n(), P = v(w, _), R = -P.x * I.viewport.zoom + I.containerWidth / 2, U = -P.y * I.viewport.zoom + I.containerHeight / 2;
    o({ x: R, y: U, zoom: I.viewport.zoom });
  }
  function S(A) {
    i.minimapPannable && (M = !0, c.setPointerCapture(A.pointerId), C(A));
  }
  function k(A) {
    M && C(A);
  }
  function $(A) {
    M && (M = !1, c.releasePointerCapture(A.pointerId));
  }
  c.addEventListener("pointerdown", S), c.addEventListener("pointermove", k), c.addEventListener("pointerup", $);
  function b(A) {
    if (!i.minimapZoomable)
      return;
    A.preventDefault();
    const L = n(), w = i.minZoom ?? 0.5, _ = i.maxZoom ?? 2, I = A.deltaY > 0 ? 0.9 : 1.1, P = Math.min(Math.max(L.viewport.zoom * I, w), _);
    o({ zoom: P });
  }
  c.addEventListener("wheel", b, { passive: !1 });
  function E() {
    c.removeEventListener("pointerdown", S), c.removeEventListener("pointermove", k), c.removeEventListener("pointerup", $), c.removeEventListener("wheel", b), a.remove();
  }
  return { render: m, updateViewport: x, destroy: E };
}
const Zu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Ku = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', Gu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', es = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Ju = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', Qu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ts = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', ef = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function tf(t, e) {
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
    const C = St(Zu, "Zoom in", c), S = St(Ku, "Zoom out", d);
    g.appendChild(C), g.appendChild(S);
  }
  if (r) {
    const C = St(Gu, "Fit view", u);
    g.appendChild(C);
  }
  if (s && (m = St(es, "Toggle interactivity", f), g.appendChild(m)), l) {
    const C = St(Qu, "Reset panels", h);
    g.appendChild(C);
  }
  p && (x = St(ts, "Toggle fullscreen", p), x.classList.add("flow-controls-button-fullscreen"), g.appendChild(x)), g.addEventListener("mousedown", (C) => C.stopPropagation()), g.addEventListener("pointerdown", (C) => C.stopPropagation()), g.addEventListener("wheel", (C) => C.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function M(C) {
    if (m && typeof C.isInteractive == "boolean") {
      Yo(m, C.isInteractive ? es : Ju);
      const S = C.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = S, m.setAttribute("aria-label", S);
    }
    if (x && typeof C.isFullscreen == "boolean") {
      Yo(x, C.isFullscreen ? ef : ts);
      const S = C.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      x.title = S, x.setAttribute("aria-label", S), x.classList.toggle("flow-controls-button-fullscreen--active", C.isFullscreen);
    }
  }
  function v() {
    g.remove();
  }
  return { update: M, destroy: v };
}
function St(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Yo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Yo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ns = 5;
function nf(t) {
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
    if (h < ns && p < ns)
      return null;
    const g = Math.min(o, r), y = Math.min(i, s), m = (g - f.x) / f.zoom, x = (y - f.y) / f.zoom, M = h / f.zoom, v = p / f.zoom;
    return { x: m, y: x, width: M, height: v };
  }
  function d() {
    return n;
  }
  function u() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: u };
}
const os = 3;
function of(t) {
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
    h * h + p * p < os * os || (i.push({ x: d, y: u }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
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
function mi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function sf(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, u = l - r, f = a * u - c * d;
  if (Math.abs(f) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * u - p * d) / f, y = (h * c - p * a) / f;
  return g >= 0 && g <= 1 && y >= 0 && y <= 1;
}
function rf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (mi(s, l, t)) return !0;
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
      if (sf(t[d].x, t[d].y, t[c].x, t[c].y, u, f, h, p))
        return !0;
  return !1;
}
function Nr(t) {
  const e = t.dimensions?.width ?? _e, n = t.dimensions?.height ?? be;
  return t.rotation ? go(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function af(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Nr(n);
    return rf(e, o);
  });
}
function lf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Nr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => mi(r.x, r.y, e));
  });
}
function cf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Wo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function df(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function uf(t, e, n) {
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
function ff(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function hf(t, e, n) {
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
function ct(t, e, n) {
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
function dt(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && uf(t.source, t.target, e));
}
const Xe = "_flowHandleValidate";
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
        typeof l == "function" ? e[Xe] = l : (delete e[Xe], requestAnimationFrame(() => {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (e[Xe] = a[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[Xe];
      });
    }
  );
}
const ut = "_flowHandleLimit";
function pf(t) {
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
const xt = "_flowHandleConnectableStart", et = "_flowHandleConnectableEnd";
function mf(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const u = n ? !!i(n) : !0;
        c && (e[xt] = u), d && (e[et] = u);
      }), s(() => {
        delete e[xt], delete e[et];
      });
    }
  );
}
function wn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function $r(t) {
  return wn(t, t.draggable);
}
function yf(t) {
  return wn(t, t.deletable);
}
function Ve(t) {
  return wn(t, t.connectable);
}
function jo(t) {
  return wn(t, t.selectable);
}
function is(t) {
  return wn(t, t.resizable);
}
function Bt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const u = Math.sqrt(l * l + a * a), f = Math.sqrt(c * c + d * d), h = Math.min(s, u / 2, f / 2), p = n - l / u * h, g = o - a / u * h, y = n + c / f * h, m = o + d / f * h;
  return `L${p},${g} Q${n},${o} ${y},${m}`;
}
function vn({
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
function Ln(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function wf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const l = n === "left" || n === "right", a = r === "left" || r === "right", c = l ? t + (n === "right" ? 1 : -1) * Ln(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = l ? e : e + (n === "bottom" ? 1 : -1) * Ln(
    n === "bottom" ? i - e : e - i,
    s
  ), u = a ? o + (r === "right" ? 1 : -1) * Ln(
    r === "right" ? t - o : o - t,
    s
  ) : o, f = a ? i : i + (r === "bottom" ? 1 : -1) * Ln(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, u, f];
}
function Gn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = wf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: u, offsetX: f, offsetY: h } = vn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function ay({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: l, offsetX: a, offsetY: c } = vn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: r,
    labelPosition: { x: s, y: l },
    labelOffsetX: a,
    labelOffsetY: c
  };
}
function ss(t) {
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
function vf(t, e, n, o, i, r, s) {
  const l = ss(n), a = ss(r), c = t + l.x * s, d = e + l.y * s, u = o + a.x * s, f = i + a.y * s, h = n === "left" || n === "right";
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
function pn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: l = 10
}) {
  const a = vf(
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
      const [m, x] = p === 1 ? [t, e] : a[p - 1], [M, v] = a[p + 1];
      c += ` ${Bt(m, x, g, y, M, v, s)}`;
    } else
      c += ` L${g},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: u, offsetX: f, offsetY: h } = vn({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function _f(t) {
  return pn({ ...t, borderRadius: 0 });
}
function Ir({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: l, offsetY: a } = vn({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: l,
    labelOffsetY: a
  };
}
const st = 40;
function bf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < st && s >= 0 ? i = -o * (1 - s / st) : l < st && l >= 0 && (i = o * (1 - l / st)), a < st && a >= 0 ? r = -o * (1 - a / st) : c < st && c >= 0 && (r = o * (1 - c / st)), { dx: i, dy: r };
}
function Dr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: u } = bf(r, s, c, n);
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
function Rt(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || Er : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || hn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Du),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Ru
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
        p = Gn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = pn({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      case "step": {
        p = _f({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
        break;
      }
      default: {
        p = Ir({ sourceX: d, sourceY: u, targetX: f, targetY: h }).path;
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
function sn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  if (t.index) {
    const s = t.connectionMode === "loose" ? t.index.all : t.index.byType(t.handleType);
    let l = null, a = t.cursorFlowPos, c = t.connectionSnapRadius;
    for (const d of s) {
      if (d.nodeId === t.excludeNodeId || t.targetNodeId && d.nodeId !== t.targetNodeId) continue;
      const u = t.getNode(d.nodeId);
      if (u && !Ve(u) || (t.handleType === "target" ? !d.connectableEnd : !d.connectableStart)) continue;
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
      if (p && !Ve(p)) return;
    }
    const d = t.handleType === "target" ? et : xt;
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
function Jn(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Dr({
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
function xf(t, e, n, o) {
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
function rs(t, e) {
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
      connectableStart: a[xt] !== !1,
      connectableEnd: a[et] !== !1,
      hasValidator: a[Xe] != null,
      limit: a[ut] ?? null
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
let tn = 0;
const Pn = /* @__PURE__ */ new WeakMap();
function Ge(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[Xe] && !r[Xe](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[Xe] && !r[Xe](e))
      return !1;
  }
  return !0;
}
function Je(t, e, n) {
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (o) {
    const r = e.sourceHandle ?? "source", s = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(r)}"][data-flow-handle-type="source"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(r)}"]`);
    if (s?.[ut] && n.filter(
      (a) => a.source === e.source && (a.sourceHandle ?? "source") === (e.sourceHandle ?? "source")
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
      (a) => a.target === e.target && (a.targetHandle ?? "target") === (e.targetHandle ?? "target")
    ).length >= s[ut])
      return !1;
  }
  return !0;
}
function rn(t, e, n, o, i, r) {
  if (!r) {
    Ef(t, e, n, o, i);
    return;
  }
  const s = xf(o, e, n, i), l = r.get(e, n, "source"), a = l?.limit != null && (s.sourceCounts.get(`${e}|${n}`) ?? 0) >= l.limit, c = [];
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
    y && l?.hasValidator && (y = !!l.el[Xe](u)), y && p.hasValidator && (y = !!p.el[Xe](u));
    const m = y && (!o._config?.isValidConnection || o._config.isValidConnection(u));
    c.push({ el: d.el, valid: m, limitHit: h && !g });
  }
  for (const d of c)
    d.el.classList.toggle("flow-handle-valid", d.valid), d.el.classList.toggle("flow-handle-invalid", !d.valid), d.el.classList.toggle("flow-handle-limit-reached", d.limitHit);
}
function Ef(t, e, n, o, i) {
  const r = i ? o.edges.filter((l) => l.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const l of s) {
    const c = l.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = l.dataset.flowHandleId ?? "target";
    if (l[et] === !1) {
      l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const u = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && dt(u, r, { preventCycles: o._config?.preventCycles }), p = h && Je(t, u, r);
    p && Ge(t, u) && (!o._config?.isValidConnection || o._config.isValidConnection(u)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !p ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
  }
}
function Le(t) {
  const e = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const n of e)
    n.classList.remove("flow-handle-valid", "flow-handle-invalid", "flow-handle-limit-reached");
}
function vt(t, e) {
  t && (e ? t.classList.add("flow-connect-line--validating") : t.classList.remove("flow-connect-line--validating"));
}
function Te(t, e) {
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
async function Qn(t, e, n, o, i, r) {
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
  const l = typeof s == "boolean" ? s : !!s?.allowed, a = typeof s == "object" && s && "reason" in s ? s.reason : void 0;
  return i.dispatchEvent(new CustomEvent("flow-connect-validated", {
    detail: { connection: e, allowed: l, reason: a },
    bubbles: !0
  })), { allowed: l, reason: a };
}
async function Rr(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), l = (c) => (Te(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!dt(n, s, { preventCycles: o._config?.preventCycles }) || !ct(n, o._config?.connectionRules, o._nodeMap) || !Je(i, n, s) || !Ge(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return l();
  const a = o._config?.connectValidator;
  if (a) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: u } = eo(i, n);
    o._connectValidating = !0;
    let f;
    try {
      f = await Qn(
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
async function Hr(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Te(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !Ve(s) || !dt(e, i, { preventCycles: n._config?.preventCycles }) || !ct(e, n._config?.connectionRules, n._nodeMap) || !Je(o, e, i) || !Ge(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const l = n._config?.connectValidator;
  if (l) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: u, targetEl: f } = eo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await Qn(
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${tn++}`, ...e };
  return n.addEdges(c), n._emit?.("connect", { connection: e }), { applied: !0, edge: c };
}
function eo(t, e) {
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
function Cf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), u = o.includes("left"), f = o.includes("right"), h = c || d || u || f;
      let p;
      c && u ? p = "top-left" : c && f ? p = "top-right" : d && u ? p = "bottom-left" : d && f ? p = "bottom-right" : c ? p = "top" : f ? p = "right" : d ? p = "bottom" : u ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let g, y = !1;
      if (i) {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) ? (g = v.id || e.getAttribute("data-flow-handle-id") || a, v.position && (p = v.position, y = !0)) : g = v || e.getAttribute("data-flow-handle-id") || a;
      } else
        g = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
        const v = r(i);
        v && typeof v == "object" && !Array.isArray(v) && v.position && (e.dataset.flowHandlePosition = v.position);
      })), !h && !y) {
        const v = () => {
          const S = e.closest("[x-flow-node]")?.dataset.flowNodeId;
          if (!S) return;
          const k = e.closest("[x-data]");
          return k ? t.$data(k)?.getNode?.(S) : void 0;
        };
        s(() => {
          const C = v();
          if (!C) return;
          const S = a === "source" ? C.sourcePosition : C.targetPosition;
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
      let M = null;
      if (x()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${g}`);
        const C = ($) => {
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
          const A = m();
          if (A)
            if (a === "source") {
              const L = E.getNode?.(A);
              if (L && !Ve(L) || e[xt] === !1) return;
              $.preventDefault(), $.stopPropagation(), C(E), E._pendingKeyboardConnect = {
                sourceNodeId: A,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), E._announcer?.announce?.(`Connecting from ${a} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!E._pendingKeyboardConnect) return;
              const L = E.getNode?.(A);
              if (L && !Ve(L) || e[et] === !1) return;
              $.preventDefault(), $.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: _ } = E._pendingKeyboardConnect, I = {
                source: w,
                sourceHandle: _,
                target: A,
                targetHandle: g
              }, P = e.closest(".flow-container");
              if (C(E), !P) return;
              Hr({ connection: I, canvas: E, containerEl: P }).then((R) => {
                R.applied && E._announcer?.announce?.(`Connected ${w} to ${A}.`);
              });
            }
        };
        e.addEventListener("keydown", S);
        const k = e.closest(".flow-container");
        if (k) {
          const $ = Pn.get(k);
          if ($)
            $.count += 1;
          else {
            const b = (E) => {
              if (E.key !== "Escape") return;
              const A = k.matches("[x-data]") ? k : k.closest("[x-data]") ?? k.querySelector("[x-data]");
              if (!A) return;
              const L = t.$data(A);
              L?._pendingKeyboardConnect && C(L);
            };
            k.addEventListener("keydown", b), Pn.set(k, { count: 1, handler: b });
          }
        }
        M = () => {
          if (e.removeEventListener("keydown", S), k) {
            const $ = Pn.get(k);
            $ && ($.count -= 1, $.count <= 0 && (k.removeEventListener("keydown", $.handler), Pn.delete(k)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let v = null;
        const C = ($) => {
          $.preventDefault(), $.stopPropagation();
          const b = x(), E = e.closest("[x-flow-node]");
          if (!b || !E || b._animationLocked) return;
          const A = E.dataset.flowNodeId;
          if (!A) return;
          const L = b.getNode(A);
          if (L && !Ve(L) || e[xt] === !1) return;
          const w = $.clientX, _ = $.clientY;
          let I = !1;
          if (b.pendingConnection && b._config?.connectOnClick !== !1) {
            b._emit("connect-end", {
              connection: null,
              source: b.pendingConnection.source,
              sourceHandle: b.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
            const J = e.closest(".flow-container");
            J && Le(J);
          }
          let P = null, R = null, U = null, te = null, Q = null;
          const T = b._config?.connectionSnapRadius ?? 20, N = e.closest(".flow-container");
          let F = null, re = 0, ce = 0, ae = !1, X = /* @__PURE__ */ new Map();
          const V = () => {
            if (I = !0, B("connection", `Connection drag started from node "${A}" handle "${g}"`), b._emit("connect-start", { source: A, sourceHandle: g }), !N) return;
            R = Rt({
              connectionLineType: b._config?.connectionLineType,
              connectionLineStyle: b._config?.connectionLineStyle,
              connectionLine: b._config?.connectionLine,
              containerEl: N
            }), P = R.svg;
            const J = e.getBoundingClientRect(), G = N.getBoundingClientRect(), W = b._viewportLive ?? b.viewport, H = W?.zoom || 1, ne = W?.x || 0, ie = W?.y || 0;
            re = (J.left + J.width / 2 - G.left - ne) / H, ce = (J.top + J.height / 2 - G.top - ie) / H, R.update({ fromX: re, fromY: ce, toX: re, toY: ce, source: A, sourceHandle: g });
            const K = N.querySelector(".flow-viewport");
            if (K && K.appendChild(P), b.pendingConnection = {
              source: A,
              sourceHandle: g,
              position: { x: re, y: ce }
            }, te = Jn(N, b, w, _), F = rs(
              N,
              (j, oe) => b.screenToFlowPosition(j, oe)
            ), rn(N, A, g, b, void 0, F), b._config?.onEdgeDrop) {
              const j = b._config.edgeDropPreview, O = j ? j({ source: A, sourceHandle: g }) : "New Node";
              if (O !== null) {
                Q = document.createElement("div"), Q.className = "flow-ghost-node";
                const ee = document.createElement("div");
                if (ee.className = "flow-ghost-handle", Q.appendChild(ee), typeof O == "string") {
                  const se = document.createElement("span");
                  se.textContent = O, Q.appendChild(se);
                } else
                  Q.appendChild(O);
                Q.style.left = `${re}px`, Q.style.top = `${ce}px`;
                const le = N.querySelector(".flow-viewport");
                le && le.appendChild(Q);
              }
            }
          }, q = () => {
            const J = [...b.selectedNodes], G = [], W = N.getBoundingClientRect(), H = b._viewportLive ?? b.viewport, ne = H?.zoom || 1, ie = H?.x || 0, K = H?.y || 0;
            for (const j of J) {
              if (j === A) continue;
              const O = N?.querySelector(`[data-flow-node-id="${CSS.escape(j)}"]`)?.querySelector('[data-flow-handle-type="source"]');
              if (!O) continue;
              const ee = O.getBoundingClientRect();
              G.push({
                nodeId: j,
                handleId: O.dataset.flowHandleId ?? "source",
                pos: {
                  x: (ee.left + ee.width / 2 - W.left - ie) / ne,
                  y: (ee.top + ee.height / 2 - W.top - K) / ne
                }
              });
            }
            return G;
          }, Z = (J) => {
            ae = !0, R && (X.set(A, {
              line: R,
              sourceNodeId: A,
              sourceHandleId: g,
              sourcePos: { x: re, y: ce },
              valid: !0
            }), R = null);
            const G = q(), W = N.querySelector(".flow-viewport");
            for (const H of G) {
              const ne = Rt({
                connectionLineType: b._config?.connectionLineType,
                connectionLineStyle: b._config?.connectionLineStyle,
                connectionLine: b._config?.connectionLine,
                containerEl: N
              });
              ne.update({
                fromX: H.pos.x,
                fromY: H.pos.y,
                toX: J.x,
                toY: J.y,
                source: H.nodeId,
                sourceHandle: H.handleId
              }), W && W.appendChild(ne.svg), X.set(H.nodeId, {
                line: ne,
                sourceNodeId: H.nodeId,
                sourceHandleId: H.handleId,
                sourcePos: H.pos,
                valid: !0
              });
            }
          }, z = (J) => {
            if (!I) {
              const H = J.clientX - w, ne = J.clientY - _;
              if (Math.abs(H) >= Hn || Math.abs(ne) >= Hn) {
                if (V(), b._config?.multiConnect && b.selectedNodes.size > 1 && b.selectedNodes.has(A)) {
                  const ie = b.screenToFlowPosition(J.clientX, J.clientY);
                  Z(ie);
                }
              } else
                return;
            }
            const G = b.screenToFlowPosition(J.clientX, J.clientY);
            if (ae) {
              const H = sn({
                containerEl: N,
                handleType: "target",
                excludeNodeId: A,
                cursorFlowPos: G,
                connectionSnapRadius: T,
                getNode: (oe) => b.getNode(oe),
                toFlowPosition: (oe, O) => b.screenToFlowPosition(oe, O),
                connectionMode: b._config?.connectionMode,
                index: F ?? void 0
              });
              H.element !== U && (U?.classList.remove("flow-handle-active"), H.element?.classList.add("flow-handle-active"), U = H.element);
              const ie = H.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, K = H.element?.dataset.flowHandleId ?? "target", j = b._config?.connectionLineStyle?.stroke ?? (getComputedStyle(N).getPropertyValue("--flow-edge-stroke-selected").trim() || hn);
              for (const oe of X.values())
                if (oe.line.update({
                  fromX: oe.sourcePos.x,
                  fromY: oe.sourcePos.y,
                  toX: H.position.x,
                  toY: H.position.y,
                  source: oe.sourceNodeId,
                  sourceHandle: oe.sourceHandleId
                }), H.element && ie) {
                  const O = {
                    source: oe.sourceNodeId,
                    sourceHandle: oe.sourceHandleId,
                    target: ie,
                    targetHandle: K
                  }, Y = b.getNode(ie)?.connectable !== !1 && oe.sourceNodeId !== ie && dt(O, b.edges, { preventCycles: b._config?.preventCycles }) && ct(O, b._config?.connectionRules, b._nodeMap) && Je(N, O, b.edges) && Ge(N, O) && (!b._config?.isValidConnection || b._config.isValidConnection(O));
                  oe.valid = Y;
                  const de = oe.line.svg.querySelector("path");
                  if (de)
                    if (Y)
                      de.setAttribute("stroke", j);
                    else {
                      const he = getComputedStyle(N).getPropertyValue("--flow-connection-line-invalid").trim() || Er;
                      de.setAttribute("stroke", he);
                    }
                } else {
                  oe.valid = !0;
                  const O = oe.line.svg.querySelector("path");
                  O && O.setAttribute("stroke", j);
                }
              b.pendingConnection = { ...b.pendingConnection, position: H.position }, te?.updatePointer(J.clientX, J.clientY);
              return;
            }
            const W = sn({
              containerEl: N,
              handleType: "target",
              excludeNodeId: A,
              cursorFlowPos: G,
              connectionSnapRadius: T,
              getNode: (H) => b.getNode(H),
              toFlowPosition: (H, ne) => b.screenToFlowPosition(H, ne),
              index: F ?? void 0
            });
            W.element !== U && (U?.classList.remove("flow-handle-active"), W.element?.classList.add("flow-handle-active"), U = W.element), Q ? W.element ? (Q.style.display = "none", R?.update({ fromX: re, fromY: ce, toX: W.position.x, toY: W.position.y, source: A, sourceHandle: g })) : (Q.style.display = "", Q.style.left = `${G.x}px`, Q.style.top = `${G.y}px`, R?.update({ fromX: re, fromY: ce, toX: G.x, toY: G.y, source: A, sourceHandle: g })) : R?.update({ fromX: re, fromY: ce, toX: W.position.x, toY: W.position.y, source: A, sourceHandle: g }), b.pendingConnection = { ...b.pendingConnection, position: W.position }, te?.updatePointer(J.clientX, J.clientY);
          }, D = async (J) => {
            if (te?.stop(), te = null, document.removeEventListener("pointermove", z), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), v = null, F = null, b._connectValidating) return;
            if (ae) {
              const ne = b.screenToFlowPosition(J.clientX, J.clientY);
              let ie = U;
              ie || (ie = document.elementFromPoint(J.clientX, J.clientY)?.closest('[data-flow-handle-type="target"]'));
              const j = ie?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, oe = ie?.dataset.flowHandleId ?? "target", O = [], ee = [], le = [], se = [];
              if (ie && j) {
                const fe = b.getNode(j);
                for (const me of X.values()) {
                  const Y = {
                    source: me.sourceNodeId,
                    sourceHandle: me.sourceHandleId,
                    target: j,
                    targetHandle: oe
                  };
                  if (fe?.connectable !== !1 && me.sourceNodeId !== j && dt(Y, b.edges, { preventCycles: b._config?.preventCycles }) && ct(Y, b._config?.connectionRules, b._nodeMap) && Je(N, Y, b.edges) && Ge(N, Y) && (!b._config?.isValidConnection || b._config.isValidConnection(Y))) {
                    const xe = `e-${me.sourceNodeId}-${j}-${Date.now()}-${tn++}`;
                    O.push({ id: xe, ...Y }), ee.push(Y), se.push(me);
                  } else
                    le.push(me);
                }
              } else
                le.push(...X.values());
              for (const fe of se)
                fe.line.destroy();
              if (O.length > 0) {
                b.addEdges(O);
                for (const fe of ee)
                  b._emit("connect", { connection: fe });
                b._emit("multi-connect", { connections: ee });
              }
              le.length > 0 && setTimeout(() => {
                for (const fe of le)
                  fe.line.destroy();
              }, 100), U?.classList.remove("flow-handle-active"), b._emit("connect-end", {
                connection: ee.length > 0 ? ee[0] : null,
                source: A,
                sourceHandle: g,
                position: ne
              }), X.clear(), ae = !1, Le(N), b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
              return;
            }
            if (!I) {
              b._config?.connectOnClick !== !1 && (B("connection", `Click-to-connect started from node "${A}" handle "${g}"`), b._emit("connect-start", { source: A, sourceHandle: g }), b.pendingConnection = {
                source: A,
                sourceHandle: g,
                position: { x: 0, y: 0 }
              }, b._container?.classList.add("flow-connecting"), rn(N, A, g, b, void 0, F ?? void 0));
              return;
            }
            const G = R?.svg ?? null;
            Q?.remove(), Q = null, U?.classList.remove("flow-handle-active"), Le(N);
            const W = b.screenToFlowPosition(J.clientX, J.clientY), H = { source: A, sourceHandle: g, position: W };
            try {
              let ne = U;
              if (ne || (ne = document.elementFromPoint(J.clientX, J.clientY)?.closest('[data-flow-handle-type="target"]')), ne) {
                const K = ne.closest("[x-flow-node]")?.dataset.flowNodeId, j = ne.dataset.flowHandleId ?? "target";
                if (K) {
                  if (ne[et] === !1) {
                    B("connection", "Connection rejected (handle not connectable end)"), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                    return;
                  }
                  const oe = b.getNode(K);
                  if (oe && !Ve(oe)) {
                    B("connection", `Connection rejected (target "${K}" not connectable)`), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                    return;
                  }
                  const O = {
                    source: A,
                    sourceHandle: g,
                    target: K,
                    targetHandle: j
                  };
                  if (dt(O, b.edges, { preventCycles: b._config?.preventCycles })) {
                    if (!ct(O, b._config?.connectionRules, b._nodeMap)) {
                      B("connection", "Connection rejected (connection rules)", O), Te(N, O), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (!Je(N, O, b.edges)) {
                      B("connection", "Connection rejected (handle limit)", O), Te(N, O), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (!Ge(N, O)) {
                      B("connection", "Connection rejected (per-handle validator)", O), Te(N, O), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    if (b._config?.isValidConnection && !b._config.isValidConnection(O)) {
                      B("connection", "Connection rejected (custom validator)", O), Te(N, O), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                      return;
                    }
                    const ee = b._config?.connectValidator;
                    if (ee) {
                      const se = b._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: fe, targetEl: me } = eo(N, O);
                      b._connectValidating = !0, vt(G, !0);
                      let Y;
                      try {
                        Y = await Qn(
                          ee,
                          O,
                          fe,
                          me,
                          N,
                          se
                        );
                      } finally {
                        b._connectValidating = !1, vt(G, !1);
                      }
                      if (!Y.allowed) {
                        B("connection", "Connection rejected (async connectValidator)", { connection: O, reason: Y.reason }), Te(N, { ...O, reason: Y.reason }), b._emit("connect-end", { connection: null, ...H }), b.pendingConnection = null;
                        return;
                      }
                    }
                    const le = `e-${A}-${K}-${Date.now()}-${tn++}`;
                    b.addEdges({ id: le, ...O }), B("connection", `Connection created: ${A} → ${K}`, O), b._emit("connect", { connection: O }), b._emit("connect-end", { connection: O, ...H });
                  } else
                    B("connection", "Connection rejected (invalid)", O), Te(N, O), b._emit("connect-end", { connection: null, ...H });
                } else
                  b._emit("connect-end", { connection: null, ...H });
              } else if (b._config?.onEdgeDrop) {
                const ie = {
                  x: W.x - _e / 2,
                  y: W.y - be / 2
                }, K = b._config.onEdgeDrop({
                  source: A,
                  sourceHandle: g,
                  position: ie
                });
                if (K) {
                  const j = {
                    source: A,
                    sourceHandle: g,
                    target: K.id,
                    targetHandle: "target"
                  };
                  if (!Je(N, j, b.edges))
                    B("connection", "Edge drop: connection rejected (handle limit)"), b._emit("connect-end", { connection: null, ...H });
                  else if (!Ge(N, j))
                    B("connection", "Edge drop: connection rejected (per-handle validator)"), b._emit("connect-end", { connection: null, ...H });
                  else if (!b._config.isValidConnection || b._config.isValidConnection(j)) {
                    b.addNodes(K);
                    const oe = `e-${A}-${K.id}-${Date.now()}-${tn++}`;
                    b.addEdges({ id: oe, ...j }), B("connection", `Edge drop: created node "${K.id}" and edge`, j), b._emit("connect", { connection: j }), b._emit("connect-end", { connection: j, ...H });
                  } else
                    B("connection", "Edge drop: connection rejected by validator"), b._emit("connect-end", { connection: null, ...H });
                } else
                  B("connection", "Edge drop: callback returned null"), b._emit("connect-end", { connection: null, ...H });
              } else
                B("connection", "Connection cancelled (no target)"), b._emit("connect-end", { connection: null, ...H });
            } finally {
              vt(G, !1), R?.destroy(), R = null;
            }
            b.pendingConnection = null;
          };
          document.addEventListener("pointermove", z), document.addEventListener("pointerup", D), document.addEventListener("pointercancel", D), v = () => {
            document.removeEventListener("pointermove", z), document.removeEventListener("pointerup", D), document.removeEventListener("pointercancel", D), te?.stop(), R?.destroy(), R = null, Q?.remove(), Q = null;
            for (const J of X.values())
              J.line.destroy();
            X.clear(), ae = !1, U?.classList.remove("flow-handle-active"), Le(N), F = null, b.pendingConnection = null, b._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", C);
        const S = () => {
          const $ = x();
          if (!$?._pendingReconnection || $._pendingReconnection.draggedEnd !== "source") return;
          const b = m();
          if (b) {
            const E = $.getNode(b);
            if (E && !Ve(E)) return;
          }
          e[xt] !== !1 && e.classList.add("flow-handle-active");
        }, k = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", S), e.addEventListener("pointerleave", k), l(() => {
          v?.(), M?.(), e.removeEventListener("pointerdown", C), e.removeEventListener("pointerenter", S), e.removeEventListener("pointerleave", k), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const v = () => {
          const b = x();
          if (!b?.pendingConnection) return;
          const E = m();
          if (E) {
            const A = b.getNode(E);
            if (A && !Ve(A)) return;
          }
          e[et] !== !1 && e.classList.add("flow-handle-active");
        }, C = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", v), e.addEventListener("pointerleave", C);
        const S = async (b) => {
          const E = x();
          if (!E?.pendingConnection || E._config?.connectOnClick === !1 || E._connectValidating) return;
          b.preventDefault(), b.stopPropagation();
          const A = m();
          if (!A) return;
          if (e[et] === !1) {
            B("connection", "Click-to-connect rejected (handle not connectable end)"), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const P = e.closest(".flow-container");
            P && Le(P);
            return;
          }
          const L = E.getNode(A);
          if (L && !Ve(L)) {
            B("connection", `Click-to-connect rejected (target "${A}" not connectable)`), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const P = e.closest(".flow-container");
            P && Le(P);
            return;
          }
          const w = {
            source: E.pendingConnection.source,
            sourceHandle: E.pendingConnection.sourceHandle,
            target: A,
            targetHandle: g
          }, _ = { source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (dt(w, E.edges, { preventCycles: E._config?.preventCycles })) {
            const P = e.closest(".flow-container");
            if (!ct(w, E._config?.connectionRules, E._nodeMap)) {
              B("connection", "Click-to-connect rejected (connection rules)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            if (P && !Je(P, w, E.edges)) {
              B("connection", "Click-to-connect rejected (handle limit)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Le(P);
              return;
            }
            if (P && !Ge(P, w)) {
              B("connection", "Click-to-connect rejected (per-handle validator)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            if (E._config?.isValidConnection && !E._config.isValidConnection(w)) {
              B("connection", "Click-to-connect rejected (custom validator)", w), Te(P, w), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), P && Le(P);
              return;
            }
            const R = E._config?.connectValidator;
            if (R && P) {
              const te = E._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: Q, targetEl: T } = eo(P, w);
              E._connectValidating = !0;
              let N;
              try {
                N = await Qn(
                  R,
                  w,
                  Q,
                  T,
                  P,
                  te
                );
              } finally {
                E._connectValidating = !1;
              }
              if (!N.allowed) {
                B("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: N.reason }), Te(P, { ...w, reason: N.reason }), E._emit("connect-end", { connection: null, ..._ }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Le(P);
                return;
              }
            }
            const U = `e-${w.source}-${w.target}-${Date.now()}-${tn++}`;
            E.addEdges({ id: U, ...w }), B("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), E._emit("connect", { connection: w }), E._emit("connect-end", { connection: w, ..._ });
          } else {
            B("connection", "Click-to-connect rejected (invalid)", w);
            const P = e.closest(".flow-container");
            Te(P, w), E._emit("connect-end", { connection: null, ..._ });
          }
          E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
          const I = e.closest(".flow-container");
          I && Le(I);
        };
        e.addEventListener("click", S);
        let k = null;
        const $ = (b) => {
          if (b.button !== 0) return;
          const E = x(), A = m();
          if (!E || !A || E._animationLocked || E._config?.edgesReconnectable === !1 || E._pendingReconnection) return;
          const L = E.edges.filter(
            (O) => O.target === A && (O.targetHandle ?? "target") === g
          );
          if (L.length === 0) return;
          const w = L.find((O) => O.selected) ?? (L.length === 1 ? L[0] : null);
          if (!w) return;
          const _ = w.reconnectable ?? !0;
          if (_ === !1 || _ === "source") return;
          b.preventDefault(), b.stopPropagation();
          const I = b.clientX, P = b.clientY;
          let R = !1, U = !1, te = null;
          const Q = E._config?.connectionSnapRadius ?? 20, T = e.closest(".flow-container");
          if (!T) return;
          const N = T.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), F = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', re = N?.querySelector(F), ce = T.getBoundingClientRect(), ae = E._viewportLive ?? E.viewport, X = ae?.zoom || 1, V = ae?.x || 0, q = ae?.y || 0;
          let Z, z;
          if (re) {
            const O = re.getBoundingClientRect();
            Z = (O.left + O.width / 2 - ce.left - V) / X, z = (O.top + O.height / 2 - ce.top - q) / X;
          } else {
            const O = E.getNode(w.source);
            if (!O) return;
            const ee = O.dimensions?.width ?? _e, le = O.dimensions?.height ?? be;
            Z = O.position.x + ee / 2, z = O.position.y + le;
          }
          let D = null, J = null, G = null, W = I, H = P, ne = null;
          const ie = () => {
            R = !0;
            const O = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            O && O.classList.add("flow-edge-reconnecting"), E._emit("reconnect-start", { edge: w, handleType: "target" }), B("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), J = Rt({
              connectionLineType: E._config?.connectionLineType,
              connectionLineStyle: E._config?.connectionLineStyle,
              connectionLine: E._config?.connectionLine,
              containerEl: T
            }), D = J.svg;
            const ee = E.screenToFlowPosition(I, P);
            J.update({
              fromX: Z,
              fromY: z,
              toX: ee.x,
              toY: ee.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            });
            const le = T.querySelector(".flow-viewport");
            le && le.appendChild(D), E.pendingConnection = {
              source: w.source,
              sourceHandle: w.sourceHandle,
              position: ee
            }, E._pendingReconnection = {
              edge: w,
              draggedEnd: "target",
              anchorPosition: { x: Z, y: z },
              position: ee
            }, G = Jn(T, E, W, H), ne = rs(
              T,
              (se, fe) => E.screenToFlowPosition(se, fe)
            ), rn(T, w.source, w.sourceHandle ?? "source", E, w.id, ne);
          }, K = (O) => {
            if (W = O.clientX, H = O.clientY, !R) {
              Math.sqrt(
                (O.clientX - I) ** 2 + (O.clientY - P) ** 2
              ) >= Hn && ie();
              return;
            }
            const ee = E.screenToFlowPosition(O.clientX, O.clientY), le = sn({
              containerEl: T,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: ee,
              connectionSnapRadius: Q,
              getNode: (se) => E.getNode(se),
              toFlowPosition: (se, fe) => E.screenToFlowPosition(se, fe),
              index: ne ?? void 0
            });
            le.element !== te && (te?.classList.remove("flow-handle-active"), le.element?.classList.add("flow-handle-active"), te = le.element), J?.update({
              fromX: Z,
              fromY: z,
              toX: le.position.x,
              toY: le.position.y,
              source: w.source,
              sourceHandle: w.sourceHandle
            }), E.pendingConnection && (E.pendingConnection = {
              ...E.pendingConnection,
              position: le.position
            }), E._pendingReconnection && (E._pendingReconnection = {
              ...E._pendingReconnection,
              position: le.position
            }), G?.updatePointer(O.clientX, O.clientY);
          }, j = () => {
            if (U) return;
            U = !0, document.removeEventListener("pointermove", K), document.removeEventListener("pointerup", oe), document.removeEventListener("pointercancel", oe), G?.stop(), G = null, J?.destroy(), J = null, D = null, ne = null, te?.classList.remove("flow-handle-active"), k = null;
            const O = T.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            O && O.classList.remove("flow-edge-reconnecting"), Le(T), E.pendingConnection = null, E._pendingReconnection = null;
          }, oe = async (O) => {
            if (!R) {
              j();
              return;
            }
            if (E._connectValidating) return;
            let ee = te;
            ee || (ee = document.elementFromPoint(O.clientX, O.clientY)?.closest('[data-flow-handle-type="target"]'));
            let le = !1;
            if (ee) {
              const fe = ee.closest("[x-flow-node]")?.dataset.flowNodeId, me = ee.dataset.flowHandleId;
              if (fe && E.getNode(fe)?.connectable !== !1) {
                const de = {
                  source: w.source,
                  sourceHandle: w.sourceHandle,
                  target: fe,
                  targetHandle: me
                }, he = { ...w }, ue = J?.svg ?? null;
                vt(ue, !0);
                let ge;
                try {
                  ge = await Rr({
                    edge: w,
                    newConnection: de,
                    canvas: E,
                    containerEl: T,
                    endpoint: "target"
                  });
                } finally {
                  vt(ue, !1);
                }
                ge.applied ? (le = !0, B("reconnect", `Edge "${w.id}" reconnected (target)`, de), E._emit("reconnect", { oldEdge: he, newConnection: de })) : B("reconnect", "Reconnection rejected", { connection: de, reason: ge.reason });
              }
            }
            le || B("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), E._emit("reconnect-end", { edge: w, successful: le }), j();
          };
          document.addEventListener("pointermove", K), document.addEventListener("pointerup", oe), document.addEventListener("pointercancel", oe), k = j;
        };
        e.addEventListener("pointerdown", $), l(() => {
          k?.(), M?.(), e.removeEventListener("pointerdown", $), e.removeEventListener("pointerenter", v), e.removeEventListener("pointerleave", C), e.removeEventListener("click", S), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const as = {
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
function Sf(t) {
  if (!t) return { ...as };
  const e = { ...as };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function We(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function kf(t, e, n, o) {
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
function Lf(t, e, n = {}) {
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
const ls = 20;
function Fr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function Pf(t, e) {
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
function Uo(t, e, n) {
  if (!t.position) return { x: 0, y: 0 };
  let o = t.position.x, i = t.position.y;
  const r = /* @__PURE__ */ new Set();
  r.add(t.id);
  let s = t.parentId ? e.get(t.parentId) : void 0;
  for (; s && !r.has(s.id); ) {
    r.add(s.id);
    const l = s.nodeOrigin ?? n ?? [0, 0], a = s.dimensions?.width ?? _e, c = s.dimensions?.height ?? be;
    o += s.position.x - a * l[0], i += s.position.y - c * l[1], s = s.parentId ? e.get(s.parentId) : void 0;
  }
  return { x: o, y: i };
}
function Ht(t, e, n) {
  if (!t.parentId)
    return t;
  const o = Uo(t, e, n);
  return { ...t, position: o };
}
function to(t, e, n) {
  return t.map((o) => Ht(o, e, n));
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
function Ct(t) {
  const e = Fr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Or(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Or(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function zr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function bo(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Mn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: _e, height: be };
  return zr(t, o, i);
}
function Mf(t, e, n) {
  const o = t.x + e.width + ls, i = t.y + e.height + ls, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function cs(t, e, n) {
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
function Tf(t, e, n) {
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
function Af(t, e, n) {
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
      return { x: t * 0.75, y: 0 };
    case "top-left":
      return { x: t * 0.25, y: 0 };
    case "bottom-right":
      return { x: t * 0.75, y: e };
    case "bottom-left":
      return { x: t * 0.25, y: e };
  }
}
function $f(t, e, n) {
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
function If(t, e, n) {
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
function Df(t, e, n) {
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
function Rf(t, e, n) {
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
const Vr = {
  circle: { perimeterPoint: Tf },
  diamond: { perimeterPoint: Af },
  hexagon: { perimeterPoint: Nf },
  parallelogram: { perimeterPoint: $f },
  triangle: { perimeterPoint: If },
  cylinder: { perimeterPoint: Df },
  stadium: { perimeterPoint: Rf }
};
function Br(t, e = "light") {
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
const xo = "__alpineflow_collab_store__";
function Hf() {
  return typeof globalThis < "u" ? (globalThis[xo] || (globalThis[xo] = /* @__PURE__ */ new WeakMap()), globalThis[xo]) : /* @__PURE__ */ new WeakMap();
}
const De = Hf(), Eo = "__alpineflow_registry__";
function qr() {
  return typeof globalThis < "u" ? (globalThis[Eo] || (globalThis[Eo] = /* @__PURE__ */ new Map()), globalThis[Eo]) : /* @__PURE__ */ new Map();
}
function Tt(t) {
  return qr().get(t);
}
function Ff(t, e) {
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
const Of = 1e3;
class zf {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Ff, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Of);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class Vf {
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
const Bf = {
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
}, qf = {
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
}, Xf = {
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
}, ds = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Yf(t, e) {
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
    const r = ds[o.style] ?? ds.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
function Wf(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const jf = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Uf = 150;
function Zf(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function Kf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = Wf(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = Bf[o], u = d ? d(a) : [a], f = e[i];
      return typeof f == "function" && f.call(e, ...u), c;
    };
    t[r] = jf.has(o) ? Zf(l, Uf) : l;
  }
}
function Gf(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(qf)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = Xf[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Jf = 5;
function Qf(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const u = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, u), u > Jf && !o.has(c) && (o.add(c), console.warn(
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
function eh(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function th(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function an(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function Xr(t, e, n, o) {
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
function us(t, e, n) {
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
function qt(t, e) {
  const n = Yt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function Yr(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function nh(t, e, n = !0) {
  const o = qt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = qt(i);
    return n ? Yr(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function oh(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = qt(t), i = qt(e);
  return n ? Yr(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function ih(t, e, n, o, i = 5) {
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
function sh(t) {
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
              ], p = Xr(f, d, h, u);
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
        const d = Ct(t.nodes);
        t.nodes.splice(0, t.nodes.length, ...d);
      }
      t._rebuildNodeMap();
      for (const d of o)
        if (d.childLayout) {
          const u = t._nodeMap.get(d.id);
          u && t._installChildLayoutWatchers(u);
        }
      t._emit("nodes-change", { type: "add", nodes: o });
      const l = t._container ? De.get(t._container) : void 0;
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
        const p = t._nodeMap.get(f.parentId);
        if (!p) continue;
        const g = t.nodes.filter(
          (m) => m.parentId === f.parentId
        ), y = no(p, f, g, h);
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
        for (const f of ht(u, t.nodes))
          n.add(f);
      B("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((u) => n.has(u.id));
      let s = [];
      t._config.reconnectOnDelete && (s = hf(n, t.nodes, t.edges));
      const l = [];
      t.edges = t.edges.filter((u) => n.has(u.source) || n.has(u.target) ? (l.push(u.id), !1) : !0), s.length && (t.edges.push(...s), B("destroy", `Created ${s.length} reconnection edge(s)`)), t._rebuildEdgeMap(), t.nodes = t.nodes.filter((u) => !n.has(u.id)), t._rebuildNodeMap();
      for (const u of n)
        t.selectedNodes.delete(u), t._initialDimensions.delete(u), t._uninstallChildLayoutWatchers(u);
      r.length && t._emit("nodes-change", { type: "remove", nodes: r }), s.length && t._emit("edges-change", { type: "add", edges: s });
      const a = t._container ? De.get(t._container) : void 0;
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
      return Wo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return df(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return cf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return ff(e, n, t.edges, o);
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
      return o ? nh(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : oh(i, r, o);
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
function rh(t) {
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
        return ct(l, o, t._nodeMap);
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
        t.selectedEdges.delete(r);
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
function ah(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return _r(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return Tu(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Vt(to(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
      const o = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, i = jn(
        e,
        o.width,
        o.height,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n?.padding ?? Xo
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Vt(to(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
    },
    /**
     * Compute the viewport (pan + zoom) that frames the given bounds
     * within the container, respecting min/max zoom and padding.
     */
    getViewportForBounds(e, n) {
      const o = t._container;
      return o ? jn(
        e,
        o.clientWidth,
        o.clientHeight,
        t._config.minZoom ?? 0.5,
        t._config.maxZoom ?? 2,
        n ?? Xo
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Yi, o);
      B("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Yi, o);
      B("viewport", "zoomOut", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Center the viewport on flow coordinate `(x, y)` at the given zoom
     * level (defaults to the current zoom).
     */
    setCenter(e, n, o, i) {
      const r = t._container;
      if (!r) return;
      const s = o ?? (t._viewportLive ?? t.viewport).zoom, l = r.clientWidth / 2 - e * s, a = r.clientHeight / 2 - n * s;
      B("viewport", "setCenter", { x: e, y: n, zoom: s }), t._panZoom?.setViewport({ x: l, y: a, zoom: s }, i);
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
let wt = null;
const lh = 20;
function Zo(t) {
  return JSON.parse(JSON.stringify(t));
}
function fs(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function Wr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return wt = {
    nodes: Zo(n),
    edges: Zo(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function ch() {
  if (!wt || wt.nodes.length === 0) return null;
  wt.pasteCount++;
  const t = wt.pasteCount * lh, e = /* @__PURE__ */ new Map(), n = wt.nodes.map((i) => {
    const r = fs(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Zo(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = wt.edges.map((i) => ({
    ...i,
    id: fs(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function dh(t, e) {
  const n = Wr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function uh(t) {
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
      const e = [...t.selectedNodes].filter((a) => {
        const c = t.getNode(a);
        return c ? yf(c) : !1;
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
        ), f = no(d, a, u, c);
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
            B("delete", "onBeforeDelete cancelled deletion");
            return;
          }
          t._captureHistory(), t._suspendHistory();
          try {
            if (a.nodes.length > 0 && (B("delete", `onBeforeDelete approved ${a.nodes.length} node(s)`), t.removeNodes(a.nodes.map((c) => c.id))), a.edges.length > 0) {
              const c = a.edges.map((d) => d.id).filter((d) => t.edges.some((u) => u.id === d));
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
          if (o.length > 0 && (B("delete", `Deleting ${o.length} selected node(s)`), t.removeNodes(o.map((a) => a.id))), n.length > 0) {
            const a = n.filter(
              (c) => t.edges.some((d) => d.id === c)
            );
            a.length > 0 && (B("delete", `Deleting ${a.length} selected edge(s)`), t.removeEdges(a));
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
      const e = Wr(t.nodes, t.edges);
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
      const e = ch();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = Ct(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
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
      const e = dh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), B("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function fh(t, e) {
  return t === e ? !0 : t === void 0 || e === void 0 ? t === e : JSON.stringify(t) === JSON.stringify(e);
}
function oo(t, e, n = {}) {
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
      a === "id" || a === "__proto__" || a === "constructor" || a === "prototype" || fh(l[a], c) || (l[a] = c);
    r.push(l);
  }
  return r;
}
function hs(t, e, n) {
  const o = oo(t.nodes, Ct(e.nodes));
  t.nodes.splice(0, t.nodes.length, ...o);
  const i = oo(t.edges, e.edges);
  t.edges.splice(0, t.edges.length, ...i), t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll();
  for (const r of t.nodes)
    r.selected && (r.selected = !1);
  for (const r of t.edges)
    r.selected && (r.selected = !1);
  t._emit("restore", { nodes: t.nodes, edges: t.edges, source: n }), requestAnimationFrame(() => {
    t._layoutAnimTick++;
  }), B("history", `${n} applied`, { nodes: e.nodes.length, edges: e.edges.length });
}
function hh(t) {
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
        const n = Ct(
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
        t._layoutAnimTick++;
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
      e && hs(t, e, "undo");
    },
    /**
     * Redo the last undone change by popping a snapshot from the
     * history future stack. Merges into existing objects and rebuilds maps.
     */
    redo() {
      if (!t._history) return;
      const e = t._history.redo({ nodes: t.nodes, edges: t.edges });
      e && hs(t, e, "redo");
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
function ph(t, e) {
  return t * e;
}
function mh(t, e) {
  return e === "in" ? t : 1 - t;
}
function yh(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? gh(o, e) : ph(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function wh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function vh(t, e, n) {
  t.style.opacity = String(mh(e, n));
}
function _h(t) {
  t.style.removeProperty("opacity");
}
const tt = Math.PI * 2, Gt = /* @__PURE__ */ new Map(), bh = 64;
function yi(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = Gt.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (Gt.size >= bh) {
    const r = Gt.keys().next().value;
    r !== void 0 && Gt.delete(r);
  }
  return Gt.set(t, i), i;
}
function ly(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(tt * a * l + o * tt),
    y: n + s * Math.sin(tt * a * l + o * tt)
  });
}
function cy(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), u = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), p = u;
  return (g) => {
    const y = e + a * g, m = n + c * g, x = r * Math.sin(tt * s * g + l * tt);
    return { x: y + h * x, y: m + p * x };
  };
}
function dy(t, e) {
  const n = yi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function uy(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(tt * l + r * tt);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function fy(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const u = d * i * tt, f = (Math.sin(s * u) + Math.sin(l * u * 1.3)) / 2, h = (Math.sin(a * u * 0.9) + Math.sin(c * u * 1.1)) / 2;
    return { x: e + f * o, y: n + h * o };
  };
}
function hy(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let gs = !1;
function we(t) {
  try {
    return structuredClone(t);
  } catch {
    return gs || (gs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function xh(t) {
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
function Eh(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function Ch(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = we(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class wi {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new Cr();
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
    const o = new wi(this._canvas, this._engine);
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
    return Sr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, xh(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, Eh(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && Ch(o, n);
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
    const o = this._isReducedMotion(), i = o ? 0 : e.duration ?? 300, r = o ? 0 : e.delay ?? 0, s = Zn(e.easing), l = this._makeContext(n, e.id);
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
    const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, a, d, u);
    const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, f, h);
    const p = this._resolveFollowPath(e), g = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, x = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, x = this._resolveTargetViewport(e));
    const M = e.edgeTransition ?? "none", v = e.addEdges?.map(($) => $.id) ?? [], C = e.removeEdges?.filter(($) => this._canvas.getEdge($)).slice() ?? [], S = {
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
      transition: M,
      addEdgeIds: v,
      removeEdgeIds: C
    };
    if (i === 0)
      return this._executeInstantStep(S);
    const k = this._prepareAnimatedEdges(e, M, v);
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
        s && (s.dimensions && e.dimensions && o.set(r, { ...s.dimensions }), e.style && s.style && i.set(r, gn(s.style)));
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
    const n = yi(e.followPath);
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
    } = e, M = e.resolvedPathFn;
    return new Promise((v) => {
      const C = this._engine.register((S) => {
        if (this._state === "stopped")
          return v(), !0;
        const k = Math.min(S / i, 1), $ = s(k);
        if (l) {
          const b = M($);
          for (const E of l) {
            const A = this._canvas.getNode(E);
            A && (A.position.x = b.x, A.position.y = b.y);
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
          p
        ), this._tickEdgeTransitions(g, y, m, $), n.onProgress?.(k, o), k >= 1 ? (this._cleanupEdgeTransitions(g, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), x && n.guidePath?.autoRemove !== !1 && x.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), v(), !0) : !1;
      }, r);
      this._activeHandles.push(C);
    });
  }
  /** Per-tick interpolation for properties during followPath animation. */
  _interpolateFollowPathTick(e, n, o, i, r, s, l, a, c, d) {
    if (o && e.dimensions)
      for (const u of o) {
        const f = this._canvas.getNode(u), h = r.get(u);
        !f || !h || !f.dimensions || (e.dimensions.width !== void 0 && (f.dimensions.width = nt(h.width, e.dimensions.width, n)), e.dimensions.height !== void 0 && (f.fixedDimensions = !0, f.dimensions.height = nt(h.height, e.dimensions.height, n)));
      }
    if (o && e.style) {
      const u = gn(e.style);
      for (const f of o) {
        const h = this._canvas.getNode(f), p = s.get(f);
        h && p && (h.style = kr(p, u, n));
      }
    }
    if (i && e.edgeStrokeWidth !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = l.get(u);
        f && (h !== void 0 ? f.strokeWidth = nt(h, e.edgeStrokeWidth, n) : f.strokeWidth = e.edgeStrokeWidth);
      }
    if (i && e.edgeColor !== void 0)
      for (const u of i) {
        const f = this._canvas.getEdge(u), h = a.get(u);
        f && (h !== void 0 && typeof h == "string" ? f.color = hi(h, e.edgeColor, n) : f.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const u = Vu(c, d, n, {
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
      r && yh(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && wh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && vh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && _h(o);
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
    const i = Vt(o), r = e.fitViewPadding ?? 0.1;
    return jn(
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
    const r = n.dimensions?.width ?? _e, s = n.dimensions?.height ?? be, l = n.position.x + r / 2, a = n.position.y + s / 2;
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
const jr = /* @__PURE__ */ new Map();
function Wt(t, e) {
  jr.set(t, e);
}
function Sh(t) {
  return jr.get(t);
}
const Re = "http://www.w3.org/2000/svg", kh = {
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
}, Lh = {
  create(t, e) {
    const n = document.createElementNS(Re, "g"), o = e.size ?? 6, i = e.color ?? "#8B5CF6", r = document.createElementNS(Re, "circle");
    r.setAttribute("r", String(o * 1.5)), r.setAttribute("fill", i), r.setAttribute("opacity", "0.3"), n.appendChild(r);
    const s = document.createElementNS(Re, "circle");
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
let Ph = 0;
const Mh = {
  create(t, e) {
    const n = document.createElementNS(Re, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++Ph}`, e.class)
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
          const y = document.createElementNS(Re, "defs");
          u = document.createElementNS(Re, "linearGradient"), u.setAttribute("id", l), u.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const x = document.createElementNS(Re, "stop");
            x.setAttribute("offset", String(m.offset)), x.setAttribute("stop-color", m.color), m.opacity !== void 0 && x.setAttribute("stop-opacity", String(m.opacity)), u.appendChild(x);
          }
          y.appendChild(u), n.appendChild(y), g = `url(#${l})`, n.__gradient = u;
        }
        d = document.createElementNS(Re, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), u) {
        const g = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(g), x = e.pathEl.getPointAtLength(y);
        u.setAttribute("x1", String(x.x)), u.setAttribute("y1", String(x.y)), u.setAttribute("x2", String(m.x)), u.setAttribute("y2", String(m.y));
      }
      return;
    }
    let a = n.__fallbackRect;
    a || (a = document.createElementNS(Re, "rect"), a.setAttribute("width", String(o)), a.setAttribute("height", String(i)), a.setAttribute("rx", String(i / 2)), a.setAttribute("fill", r), a.setAttribute("opacity", "0.8"), n.appendChild(a), n.__fallbackRect = a);
    const c = Math.atan2(e.velocity.y, e.velocity.x) * (180 / Math.PI);
    a.setAttribute(
      "transform",
      `translate(${e.x - o / 2},${e.y - i / 2}) rotate(${c},${o / 2},${i / 2})`
    );
  },
  destroy(t) {
    t.remove();
  }
}, Th = {
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
}, Ah = {
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
Wt("circle", kh);
Wt("orb", Lh);
Wt("beam", Mh);
Wt("pulse", Th);
Wt("image", Ah);
let ps = !1;
function Nh(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function ms(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Nh(o);
}
function $h(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = Sh(l);
    if (!a) {
      B("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !ps && (ps = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? hn, f = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = ms(r, h, f), g = { ...r, size: d, color: u }, y = a.create(i, g), m = o.getPointAtLength(0), x = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, x);
    let M;
    const v = new Promise((b) => {
      M = b;
    }), C = () => {
      typeof r.onComplete == "function" && r.onComplete(), M();
    }, S = s.wrapOnComplete ? s.wrapOnComplete(C) : C, k = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: S,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(k), t._particleEngineHandle || (t._particleEngineHandle = Un.register((b) => t._tickParticles(b))), {
      getCurrentPosition() {
        return t._activeParticles.has(k) ? { ...k.currentPosition } : null;
      },
      stop() {
        t._activeParticles.has(k) && (k.renderer.destroy(k.element), t._activeParticles.delete(k), S());
      },
      get finished() {
        return v;
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
    const l = e(s, r, i, {
      wrapOnComplete: (a) => () => {
        a(), s.remove();
      }
    });
    if (!l) {
      s.remove();
      return;
    }
    return B("particle", "sendParticleAlongPath", { path: o.slice(0, 40) }), l;
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
        B("particle", `sendParticle: edge "${o}" not found`);
        return;
      }
      const l = t.getEdgePathElement(o);
      if (!l) {
        B("particle", `sendParticle: no path element for edge "${o}"`);
        return;
      }
      if (!l.getAttribute("d")) {
        B("particle", `sendParticle: edge "${o}" path has no d attribute`);
        return;
      }
      const c = t.getEdgeElement(o);
      if (!c) return;
      const d = t._containerStyles, u = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? hn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(l, c, i, {
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
      const l = t.getNode(i);
      if (!l) {
        B("particle", `sendParticleBetween: target node "${i}" not found`);
        return;
      }
      const a = s.position.x + (s.dimensions?.width ?? 150) / 2, c = s.position.y + (s.dimensions?.height ?? 40) / 2, d = l.position.x + (l.dimensions?.width ?? 150) / 2, u = l.position.y + (l.dimensions?.height ?? 40) / 2, f = `M ${a} ${c} L ${d} ${u}`;
      return B("particle", `sendParticleBetween "${o}" -> "${i}"`, { path: f }), n(f, r);
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
        const h = Math.max(...f.map((g) => g.length)), p = ms(a, h, "2s");
        for (const { id: g, length: y } of f) {
          const m = y / h, x = p * m, M = p - x;
          if (M <= 0) {
            const v = this.sendParticle(g, { ...a, duration: x });
            v && c.push(v);
          } else {
            const v = setTimeout(() => {
              const C = this.sendParticle(g, { ...a, duration: x });
              C && c.push(C);
            }, M);
            d.push(v);
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
class Ih {
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
const Ko = 1, Go = 1 / 60;
class nn {
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
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Tr(r) ?? void 0 : void 0, l = {
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
    this._initAnim(l), this._inFlight.set(n, l);
  }
  _initAnim(e) {
    const n = {}, o = {};
    if (this._collectNumericProperties(e.targets, n, o, this._state), e._from = n, e.type === "eased")
      e._easingFn = Zn(e.easing);
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
      e._easingFn = Zn(e.easing), e._from = e.fromValues ? { ...e.fromValues } : { ...e.currentValues ?? {} };
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
      const l = e._from[s], a = this._getTargetValue(s, e.targets) ?? l, c = nt(l, a, r);
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
            Lr(r, o, n);
            break;
          case "decay":
            gi(r, o, n);
            break;
          case "inertia":
            Pr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            Mr(r, s, a, i), a >= 1 && (r.settled = !0);
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
const Ur = /* @__PURE__ */ new Map();
function vi(t, e) {
  Ur.set(t, e);
}
function Dh(t) {
  return Ur.get(t);
}
function _i(t, e = 20) {
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
function Zr(t) {
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
const Rh = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = _i(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += Zr(t);
    for (const d of o) {
      const u = d.position?.x ?? 0, f = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${u}" y="${f}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Hh = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = _i(t.nodes);
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
}, Fh = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = _i(t.nodes);
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
    u += Zr(t);
    for (const f of i) {
      const h = f.position?.x ?? 0, p = f.position?.y ?? 0, g = f.dimensions?.width ?? 150, y = f.dimensions?.height ?? 40;
      s.has(f.id ?? "") ? u += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : u += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return u += "</svg>", u;
  }
};
vi("faithful", Rh);
vi("outline", Hh);
vi("activity", Fh);
function Jo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function Qo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Oh(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function Kr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      Kr(t[e]);
  }
  return t;
}
class bi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = Kr(we(e.initialState)), this.events = Object.freeze(we(e.events)), this.checkpoints = Object.freeze(we(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
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
    if (e.version > Ko)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Ko}). Please update AlpineFlow to replay this recording.`
      );
    return new bi(e);
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
      const i = Oh(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new nn(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const l = Go * 1e3;
    let a = o ? Jo(r, i) : Qo(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Dh(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class zh {
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
      version: Ko,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new bi(i);
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
class Vh {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new nn(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Co(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new nn(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new nn(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const l = Go * 1e3;
    let a = n ? Jo(r, i) : Qo(r, i);
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
    const e = Co(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new nn(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = Go * 1e3;
    let l = e === 0 ? Qo(i, 0) : Jo(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Co(), this._scheduleTick();
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
function Co() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Bh(t) {
  const e = $h(t);
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
      const n = new wi(t, Un);
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
      const i = o.duration ?? 0, r = [], s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), c = n.nodes ? Object.keys(n.nodes).length : 0, d = n.edges ? Object.keys(n.edges).length : 0;
      if (B("animate", "update() called", {
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
            typeof p.followPath == "function" ? x = p.followPath : x = yi(p.followPath);
            let M = null;
            if (p.guidePath?.visible && typeof p.followPath == "string" && typeof document < "u") {
              const v = t.getEdgeSvgElement?.();
              v && (M = document.createElementNS("http://www.w3.org/2000/svg", "path"), M.setAttribute("d", p.followPath), M.classList.add("flow-guide-path"), p.guidePath.class && M.classList.add(p.guidePath.class), v.appendChild(M));
            }
            if (x) {
              const v = x, C = M, S = p.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (k) => {
                  const $ = t._nodeMap.get(h);
                  if (!$) return;
                  const b = v(k);
                  Se().raw($).position.x = b.x, Se().raw($).position.y = b.y, s.add(h), k >= 1 && C && S && C.remove();
                }
              });
            }
          } else if (p.position) {
            const M = Se().raw(g).position;
            if (p.position.x !== void 0) {
              const v = p.position.x;
              if (m)
                M.x = v;
              else {
                const C = M.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: C,
                  to: v,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (Se().raw(k).position.x = S, s.add(h));
                  }
                });
              }
            }
            if (p.position.y !== void 0) {
              const v = p.position.y;
              if (m)
                M.y = v;
              else {
                const C = M.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: C,
                  to: v,
                  apply: (S) => {
                    const k = t._nodeMap.get(h);
                    k && (Se().raw(k).position.y = S), s.add(h);
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
              const x = gn(g.style || {}), M = gn(p.style), v = t._nodeElements.get(h);
              if (v) {
                const C = getComputedStyle(v);
                for (const S of Object.keys(M))
                  x[S] === void 0 && (x[S] = C.getPropertyValue(S));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (C) => {
                  const S = t._nodeMap.get(h);
                  S && (Se().raw(S).style = kr(x, M, C), l.add(h));
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
              const x = typeof g.color == "string" && g.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || fi;
              r.push({
                key: `edge:${h}:color`,
                from: x,
                to: p.color,
                apply: (M) => {
                  const v = t._edgeMap.get(h);
                  v && (Se().raw(v).color = M, a.add(h));
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
                apply: (M) => {
                  const v = t._edgeMap.get(h);
                  v && (Se().raw(v).strokeWidth = M, a.add(h));
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
          s.size > 0 && (t._flushNodePositions(s), t._refreshEdgePaths(s), s.clear()), l.size > 0 && (t._flushNodeStyles(l), l.clear()), a.size > 0 && (t._flushEdgeStyles(a), a.clear()), n.viewport && t._flushViewport(), o.onProgress?.(h);
        },
        onComplete() {
          if (n.nodes)
            for (const [h, p] of Object.entries(n.nodes)) {
              const g = t._nodeMap.get(h);
              if (!g) continue;
              const y = Se().raw(g);
              (p.followPath || p.position?.x !== void 0) && (g.position.x = y.position.x), (p.followPath || p.position?.y !== void 0) && (g.position.y = y.position.y), p.style !== void 0 && (g.style = y.style);
            }
          if (n.edges)
            for (const [h, p] of Object.entries(n.edges)) {
              const g = t._edgeMap.get(h);
              if (!g) continue;
              const y = Se().raw(g);
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
      const i = Sr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
      const l = o.zoom, a = Un.register(() => {
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
      return new Ih(n, {
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
      }, h = new zh(f, o), p = async () => {
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
      return new Vh(r, n, o);
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
      Wt(n, o);
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
function ys(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return ht(t, e);
  const r = /* @__PURE__ */ new Set(), s = Wo(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = Wo(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function qh(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function So(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function ws(t, e, n, o = !0) {
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
function ko(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Xh(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const Tn = { width: 150, height: 50 };
function Yh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = ys(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      B("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = qh(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? Tn, d = r && s ? s : c, u = {};
        for (const [h] of a.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? Tn;
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
            So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        So(o, t.nodes, a, s), a.reroutedEdges = ko(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && Xh(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? Tn;
        ws(o, t.nodes, i, r);
        const a = {};
        for (const [u, f] of i.targetPositions) {
          const h = t._nodeMap.get(u);
          if (h && !h.hidden) {
            const p = h.dimensions ?? Tn;
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
        ws(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return ys(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return ht(e, t.nodes).size;
    }
  };
}
function Wh(t) {
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
function jh(t) {
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
const Uh = 8, Zh = 12, Kh = 2;
function xi(t) {
  return {
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function Gh(t) {
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
function Jh(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function vs(t, e, n) {
  const o = e.gap ?? Uh, i = e.padding ?? Zh, r = e.headerHeight ?? 0, s = Gh(e), l = Jh(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, u = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Qh(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? eg(l, o, i, r, s, u, a, c) : tg(l, o, i, r, s, e.columns ?? Kh, d, u, a, c);
}
function Qh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => xi(f));
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
function eg(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((f) => xi(f));
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
function tg(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), u = t.map((m) => xi(m));
  let f = 0, h = 0;
  for (const m of u)
    f = Math.max(f, m.width), h = Math.max(h, m.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (f = p);
  const g = Math.ceil(t.length / d), y = l > 0 ? (l - (g - 1) * e) / g : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const x = m % d, M = Math.floor(m / d), v = n + x * (f + e), C = n + o + M * (h + e);
    a.set(t[m].id, { x: v, y: C }), i === "both" ? c.set(t[m].id, { width: f, height: h }) : i === "width" ? c.set(t[m].id, { width: f, height: u[m].height }) : i === "height" && c.set(t[m].id, { width: u[m].width, height: h });
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
function ng(t) {
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
      const { excludeId: s, omitFromComputation: l, includeNode: a, shallow: c } = r;
      let { stretchedSize: d } = r;
      const u = t.nodes.find((v) => v.id === e);
      if (!u?.childLayout) return;
      let f = t.nodes.filter((v) => v.parentId === e);
      l && (f = f.filter((v) => v.id !== l)), a && !f.some((v) => v.id === a.id) && (f = [...f, a]);
      const h = new Map(f.map((v) => [v.id, v]));
      if (u.dimensions = void 0, !d && u.maxDimensions && u.maxDimensions.width !== void 0 && u.maxDimensions.height !== void 0 && (d = { width: u.maxDimensions.width, height: u.maxDimensions.height }), !c)
        for (const v of f)
          v.childLayout && this.layoutChildren(v.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const p = u.childLayout, g = p.headerHeight !== void 0 ? p : u.data?.label ? { ...p, headerHeight: 30 } : p, y = vs(f, g, d);
      for (const [v, C] of y.positions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        S && (S.position ? (S.position.x = C.x, S.position.y = C.y) : S.position = { x: C.x, y: C.y });
      }
      for (const [v, C] of y.dimensions) {
        if (v === s || a && v === a.id && !t._nodeMap.has(v)) continue;
        const S = h.get(v);
        if (S) {
          let k = C.width, $ = C.height;
          S.minDimensions && (S.minDimensions.width != null && (k = Math.max(k, S.minDimensions.width)), S.minDimensions.height != null && ($ = Math.max($, S.minDimensions.height))), S.maxDimensions && (S.maxDimensions.width != null && (k = Math.min(k, S.maxDimensions.width)), S.maxDimensions.height != null && ($ = Math.min($, S.maxDimensions.height))), S.dimensions ? (S.dimensions.width = k, S.dimensions.height = $) : S.dimensions = { width: k, height: $ }, S.childLayout && !c && this.layoutChildren(v, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: S.dimensions });
        }
      }
      let m = y.parentDimensions.width, x = y.parentDimensions.height;
      if (u.minDimensions && (u.minDimensions.width != null && (m = Math.max(m, u.minDimensions.width)), u.minDimensions.height != null && (x = Math.max(x, u.minDimensions.height))), u.maxDimensions && (u.maxDimensions.width != null && (m = Math.min(m, u.maxDimensions.width)), u.maxDimensions.height != null && (x = Math.min(x, u.maxDimensions.height))), u.dimensions || (u.dimensions = { width: 0, height: 0 }), u.dimensions.width = m, u.dimensions.height = x, m !== y.parentDimensions.width || x !== y.parentDimensions.height) {
        const C = vs(f, g, { width: m, height: x });
        for (const [S, k] of C.positions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const $ = h.get(S);
          $ && ($.position ? ($.position.x = k.x, $.position.y = k.y) : $.position = { x: k.x, y: k.y });
        }
        for (const [S, k] of C.dimensions) {
          if (S === s || a && S === a.id && !t._nodeMap.has(S)) continue;
          const $ = h.get(S);
          if ($) {
            let b = k.width, E = k.height;
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
      const n = Tt("layout:dagre");
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
      const n = Tt("layout:force");
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
      const n = Tt("layout:hierarchy");
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
      const n = Tt("layout:elk");
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
function og(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return an(n, t._config.childValidationRules ?? {});
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
        const r = an(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((a) => a.parentId === o), l = us(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = an(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = us(n, i, o);
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
              ), p = no(f, o, h, u);
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = Ct(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
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
        ), u = Xr(r, o, d, s);
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
      const l = i ? t.getAbsolutePosition(e) : { x: o.position.x, y: o.position.y }, a = t.getAbsolutePosition(n);
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = Ct(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function ig(t) {
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
function Fn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), l = Math.sin(r), a = t - n, c = e - o;
  return {
    x: n + a * s - c * l,
    y: o + a * l + c * s
  };
}
const ei = 20, An = ei + 1;
function _s(t) {
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
function bs(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function sg(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Gr(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function Jr(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function rg(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const u of i)
    r.add(u.x), r.add(u.x + u.width), s.add(u.y), s.add(u.y + u.height);
  const l = Array.from(r).sort((u, f) => u - f), a = Array.from(s).sort((u, f) => u - f), c = [];
  let d = 0;
  for (const u of l)
    for (const f of a) {
      let h = !1;
      for (const p of i)
        if (sg(u, f, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: u, y: f, index: d++ });
    }
  return c;
}
class ag {
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
function lg(t, e) {
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
      Jr(l.x, l.y, a.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  for (const r of i.values()) {
    r.sort((s, l) => s.x - l.x);
    for (let s = 1; s < r.length; s++) {
      const l = r[s - 1], a = r[s];
      Gr(l.x, a.x, l.y, e) || (n[l.index].push(a.index), n[a.index].push(l.index));
    }
  }
  return n;
}
function cg(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i), a = lg(n, o);
  r[t.index] = 0;
  const c = new ag(r);
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
function dg(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function ug(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${Bt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function fg(t) {
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
const Nn = 200;
function hg(t, e, n, o, i) {
  const r = Math.min(t, n) - Nn, s = Math.max(t, n) + Nn, l = Math.min(e, o) - Nn, a = Math.max(e, o) + Nn;
  return i.filter(
    (c) => c.x < s && c.x + c.width > r && c.y < a && c.y + c.height > l
  );
}
function gg(t, e) {
  for (let n = 1; n < t.length; n++) {
    const o = t[n - 1], i = t[n];
    if (o.x === i.x) {
      if (Jr(o.x, o.y, i.y, e)) return !0;
    } else if (o.y === i.y && Gr(o.x, i.x, o.y, e))
      return !0;
  }
  return !1;
}
function pg(t, e, n, o, i, r, s) {
  const l = _s(n), a = _s(r), c = t + l.x * An, d = e + l.y * An, u = o + a.x * An, f = i + a.y * An, h = (x) => {
    const M = x.map((b) => bs(b, ei)), v = rg(c, d, u, f, M);
    v.length;
    const C = v.find((b) => b.x === c && b.y === d), S = v.find((b) => b.x === u && b.y === f);
    C || v.push({ x: c, y: d, index: v.length }), S || v.push({ x: u, y: f, index: v.length });
    const k = C ?? v[v.length - (S ? 1 : 2)], $ = S ?? v[v.length - 1];
    return cg(k, $, v, M);
  }, p = hg(t, e, o, i, s), g = p.length < s.length;
  let y = h(p);
  if (g) {
    const x = s.map((v) => bs(v, ei));
    (!(y !== null && y.length >= 2) || gg(y, x)) && (y = h(s));
  }
  if (!y || y.length < 2) return null;
  const m = [
    { x: t, y: e, index: -1 },
    ...y,
    { x: o, y: i, index: -2 }
  ];
  return dg(m);
}
const mg = 512, rt = /* @__PURE__ */ new Map();
function yg(t, e, n, o, i, r, s) {
  let l = `${Math.round(t)},${Math.round(e)},${n}|${Math.round(o)},${Math.round(i)},${r}`;
  for (const a of s)
    l += `|${Math.round(a.x)},${Math.round(a.y)},${Math.round(a.width)},${Math.round(a.height)}`;
  return l;
}
function Qr(t, e, n, o, i, r, s) {
  const l = yg(t, e, n, o, i, r, s);
  if (rt.has(l)) {
    const c = rt.get(l);
    return rt.delete(l), rt.set(l, c), c;
  }
  const a = pg(t, e, n, o, i, r, s);
  return rt.set(l, a), rt.size > mg && rt.delete(rt.keys().next().value), a;
}
function wg({
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
    return pn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const a = Qr(t, e, n, o, i, r, s);
  if (!a)
    return pn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const c = ug(a, l), { x: d, y: u, offsetX: f, offsetY: h } = fg(a);
  return {
    path: c,
    labelPosition: { x: d, y: u },
    labelOffsetX: f,
    labelOffsetY: h
  };
}
function ea(t) {
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
function vg(t) {
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
function _g({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  obstacles: s
}) {
  if (!s || s.length === 0)
    return Gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const l = Qr(t, e, n, o, i, r, s);
  if (!l)
    return Gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = ea(l), { x: c, y: d, offsetX: u, offsetY: f } = vg(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: u,
    labelOffsetY: f
  };
}
function bg(t) {
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
      c = xs(a);
      break;
    case "step":
      c = xg(a, 0);
      break;
    case "smoothstep":
      c = Eg(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = ea(a.map((f, h) => ({ ...f, index: h })));
      break;
    default:
      c = xs(a);
  }
  const d = Cg(a), u = vn({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: u.offsetX,
    labelOffsetY: u.offsetY
  };
}
function xs(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function xg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ta(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += Bt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function ta(t, e, n) {
  const o = (t.x + e.x) / 2, i = Bt(t.x, t.y, o, t.y, o, e.y, n), r = Bt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function Eg(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return ta(t[0], t[1], e);
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
    o += Bt(s.x, s.y, l.x, l.y, a.x, a.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function Cg(t) {
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
function Xt(t, e, n, o) {
  const i = t.dimensions?.width ?? _e, r = t.dimensions?.height ?? be, s = Yt(t, o);
  let l;
  if (t.shape) {
    const a = n?.[t.shape] ?? Vr[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = cs(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = cs(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = Fn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function Es(t) {
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
function ti(t) {
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
const Sg = 1.5, kg = 5 / 20;
function At(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const u = ti(e);
    return { x: t.x + u.x * i.offset, y: t.y + u.y * i.offset };
  }
  const a = (i.width ?? 12.5) * Sg * kg * 0.4, c = r + a, d = ti(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function io(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, u) {
  const f = r ?? Xt(e, o, c, d), h = s ?? Xt(n, i, c, d), p = {
    sourceX: f.x,
    sourceY: f.y,
    sourcePosition: Es(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: Es(i)
  }, g = t.type ?? u ?? "bezier";
  if (l?.[g])
    return l[g](p);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return bg({
        ...p,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return _g({ ...p, obstacles: a });
    case "orthogonal":
      return wg({ ...p, obstacles: a });
    case "smoothstep":
      return pn(p);
    case "straight":
      return Ir({ sourceX: f.x, sourceY: f.y, targetX: h.x, targetY: h.y });
    default:
      return Gn(p);
  }
}
function Cs(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Fn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Fn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), u = Math.abs(l);
  let f;
  d / a > u / c ? f = a / d : f = c / u;
  const h = {
    x: i.x + s * f,
    y: i.y + l * f
  };
  return t.rotation ? Fn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function Ss(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = t.position.x + n / 2, r = t.position.y + o / 2;
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
function na(t, e) {
  const n = t.dimensions?.width ?? _e, o = t.dimensions?.height ?? be, i = e.dimensions?.width ?? _e, r = e.dimensions?.height ?? be, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = Cs(t, l), c = Cs(e, s), d = Ss(t, a), u = Ss(e, c);
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
function oa(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function ia(t, e) {
  return `${t}__grad__${e}`;
}
function sa(t, e, n, o, i, r, s) {
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
function Lo(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const Lg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function Pg(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !Ve(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await Rr({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function Mg(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function ra(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function ks(t, e) {
  if (!e) return t;
  const n = ti(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function Ls(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function so(t, e) {
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
function ro(t, e, n, o, i, r, s) {
  const l = s ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (l) {
    if (n) {
      const c = l.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let d = so(c, r);
      if (!d) {
        const u = l.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        d = so(u, r);
      }
      if (d)
        return d.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const c = ra(n);
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
function Ps(t, e, n, o, i, r, s, l, a) {
  const c = a ?? t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!c) return null;
  let d = null;
  if (o) {
    const g = c.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (d = so(g, l), !d) {
      const y = c.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      d = so(y, l);
    }
    if (!d) {
      const y = ra(o);
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
function Tg(t, e, n) {
  const o = n ?? t.getTotalLength(), i = t.getPointAtLength(o * Math.max(0, Math.min(1, e)));
  return { x: i.x, y: i.y };
}
function at(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function Ag(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function Ng(t) {
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
      function x(T, N, F, re, ce) {
        p || (p = document.createElementNS("http://www.w3.org/2000/svg", "circle"), p.classList.add("flow-edge-dot"), p.style.pointerEvents = "none", T.appendChild(p));
        const ae = F.closest(".flow-container"), X = ae ? getComputedStyle(ae) : null, V = re.particleSize ?? (parseFloat(X?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), q = ce || X?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        p.setAttribute("r", String(V)), re.particleColor ? p.style.fill = re.particleColor : p.style.removeProperty("fill");
        const Z = p.querySelector("animateMotion");
        Z && Z.remove();
        const z = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        z.setAttribute("dur", q), z.setAttribute("repeatCount", "indefinite"), z.setAttribute("path", N), p.appendChild(z);
      }
      function M() {
        p?.remove(), p = null;
      }
      let v = null, C = null, S = null, k = null;
      const $ = (T) => {
        T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: T }), ft(T, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1, B("selection", `Edge "${N.id}" deselected (shift)`)) : (F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected (shift)`)) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0, B("selection", `Edge "${N.id}" selected`)), F._emitSelectionChange());
      }, b = (T) => {
        T.preventDefault(), T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const re = T.target;
        if (re.classList.contains("flow-edge-control-point")) {
          const ce = parseInt(re.dataset.pointIndex ?? "", 10);
          if (!isNaN(ce)) {
            F._emit("edge-control-point-context-menu", {
              edge: N,
              pointIndex: ce,
              position: { x: T.clientX, y: T.clientY },
              event: T
            });
            return;
          }
        }
        F._emit("edge-context-menu", { edge: N, event: T });
      }, E = (T) => {
        T.stopPropagation(), T.preventDefault();
        const N = o(n), F = t.$data(e.closest("[x-data]"));
        if (!N || !F || (N.type ?? F._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const ce = T.target;
        if (ce.classList.contains("flow-edge-control-point")) {
          const ae = parseInt(ce.dataset.pointIndex ?? "", 10);
          !isNaN(ae) && N.controlPoints && (F._captureHistory?.(), N.controlPoints.splice(ae, 1), F._emit("edge-control-point-change", { edge: N, action: "remove", index: ae }));
          return;
        }
        if (ce.classList.contains("flow-edge-midpoint")) {
          const ae = parseInt(ce.dataset.segmentIndex ?? "", 10);
          if (!isNaN(ae)) {
            const X = F.screenToFlowPosition(T.clientX, T.clientY);
            N.controlPoints || (N.controlPoints = []), F._captureHistory?.(), N.controlPoints.splice(ae, 0, { x: X.x, y: X.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: ae });
          }
          return;
        }
        if (ce.closest("path")) {
          const ae = F.screenToFlowPosition(T.clientX, T.clientY);
          N.controlPoints || (N.controlPoints = []);
          const X = [
            v ?? { x: 0, y: 0 },
            ...N.controlPoints,
            C ?? { x: 0, y: 0 }
          ];
          let V = 0, q = 1 / 0;
          for (let Z = 0; Z < X.length - 1; Z++) {
            const z = Ag(ae, X[Z], X[Z + 1]);
            z < q && (q = z, V = Z);
          }
          F._captureHistory?.(), N.controlPoints.splice(V, 0, { x: ae.x, y: ae.y }), F._emit("edge-control-point-change", { edge: N, action: "add", index: V });
        }
      }, A = (T) => {
        const N = T.target;
        if (!N.classList.contains("flow-edge-control-point") || T.button !== 0) return;
        T.stopPropagation(), T.preventDefault();
        const F = o(n);
        if (!F?.controlPoints) return;
        const re = t.$data(e.closest("[x-data]"));
        if (!re) return;
        const ce = parseInt(N.dataset.pointIndex ?? "", 10);
        if (isNaN(ce)) return;
        N.classList.add("dragging");
        let ae = !1;
        const X = (q) => {
          ae || (re._captureHistory?.(), ae = !0);
          let Z = re.screenToFlowPosition(q.clientX, q.clientY);
          const z = re._config?.snapToGrid;
          z && (Z = {
            x: Math.round(Z.x / z[0]) * z[0],
            y: Math.round(Z.y / z[1]) * z[1]
          }), F.controlPoints[ce] = Z;
        }, V = () => {
          document.removeEventListener("pointermove", X), document.removeEventListener("pointerup", V), N.classList.remove("dragging"), ae && re._emit("edge-control-point-change", { edge: F, action: "move", index: ce });
        };
        document.addEventListener("pointermove", X), document.addEventListener("pointerup", V);
      };
      s.addEventListener("contextmenu", b), s.addEventListener("dblclick", E), s.addEventListener("pointerdown", A, !0);
      let L = null;
      const w = (T) => {
        if (T.button !== 0) return;
        T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const re = F._config?.reconnectSnapRadius ?? Wi, ce = F._config?.edgesReconnectable !== !1, ae = N.reconnectable ?? !0;
        let X = null;
        if (ce && ae !== !1 && v && C) {
          const se = F.screenToFlowPosition(T.clientX, T.clientY), fe = at(se.x, se.y, v.x, v.y, re) || S && at(se.x, se.y, S.x, S.y, re);
          (at(se.x, se.y, C.x, C.y, re) || k && at(se.x, se.y, k.x, k.y, re)) && (ae === !0 || ae === "target") ? X = "target" : fe && (ae === !0 || ae === "source") && (X = "source");
        }
        if (!X) {
          const se = (fe) => {
            document.removeEventListener("pointerup", se), $(fe);
          };
          document.addEventListener("pointerup", se, { once: !0 });
          return;
        }
        const V = T.clientX, q = T.clientY;
        let Z = !1, z = !1, D = null;
        const J = F._config?.connectionSnapRadius ?? 20;
        let G = null, W = null, H = null, ne = V, ie = q;
        const K = e.closest(".flow-container");
        if (!K) return;
        const j = X === "target" ? v : C, oe = () => {
          Z = !0, s.classList.add("flow-edge-reconnecting"), F._emit("reconnect-start", { edge: N, handleType: X }), B("reconnect", `Reconnection drag started on edge "${N.id}" (${X} end)`), W = Rt({
            connectionLineType: F._config?.connectionLineType,
            connectionLineStyle: F._config?.connectionLineStyle,
            connectionLine: F._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), G = W.svg;
          const se = F.screenToFlowPosition(V, q);
          W.update({
            fromX: j.x,
            fromY: j.y,
            toX: se.x,
            toY: se.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const fe = K.querySelector(".flow-viewport");
          fe && fe.appendChild(G), X === "target" && (F.pendingConnection = {
            source: N.source,
            sourceHandle: N.sourceHandle,
            position: se
          }), F._pendingReconnection = {
            edge: N,
            draggedEnd: X,
            anchorPosition: { ...j },
            position: se
          }, H = Jn(K, F, ne, ie), X === "target" && rn(K, N.source, N.sourceHandle ?? "source", F, N.id);
        }, O = (se) => {
          if (ne = se.clientX, ie = se.clientY, !Z) {
            Math.sqrt(
              (se.clientX - V) ** 2 + (se.clientY - q) ** 2
            ) >= Hn && oe();
            return;
          }
          const fe = F.screenToFlowPosition(se.clientX, se.clientY), me = sn({
            containerEl: K,
            handleType: X === "target" ? "target" : "source",
            excludeNodeId: X === "target" ? N.source : N.target,
            cursorFlowPos: fe,
            connectionSnapRadius: J,
            getNode: (de) => F.getNode(de),
            toFlowPosition: (de, he) => F.screenToFlowPosition(de, he)
          });
          me.element !== D && (D?.classList.remove("flow-handle-active"), me.element?.classList.add("flow-handle-active"), D = me.element), W?.update({
            fromX: j.x,
            fromY: j.y,
            toX: me.position.x,
            toY: me.position.y,
            source: N.source,
            sourceHandle: N.sourceHandle
          });
          const Y = me.position;
          X === "target" && F.pendingConnection && (F.pendingConnection = {
            ...F.pendingConnection,
            position: Y
          }), F._pendingReconnection && (F._pendingReconnection = {
            ...F._pendingReconnection,
            position: Y
          }), H?.updatePointer(se.clientX, se.clientY);
        }, ee = () => {
          z || (z = !0, document.removeEventListener("pointermove", O), document.removeEventListener("pointerup", le), H?.stop(), H = null, W?.destroy(), W = null, G = null, D?.classList.remove("flow-handle-active"), L = null, s.classList.remove("flow-edge-reconnecting"), Le(K), F.pendingConnection = null, F._pendingReconnection = null);
        }, le = async (se) => {
          if (!Z) {
            ee(), $(se);
            return;
          }
          if (F._connectValidating) return;
          let fe = D, me = null;
          if (!fe) {
            me = document.elementFromPoint(se.clientX, se.clientY);
            const Ee = X === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            fe = me?.closest(Ee);
          }
          const de = (fe ? fe.closest("[data-flow-node-id]") : me?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, he = fe?.dataset.flowHandleId, ue = W?.svg ?? null;
          vt(ue, !0);
          let ge;
          try {
            ge = await Pg({
              dropNodeId: de,
              dropHandleId: he,
              draggedEnd: X,
              edge: N,
              canvas: F,
              containerEl: K
            });
          } finally {
            vt(ue, !1);
          }
          ge.applied ? B("reconnect", `Edge "${N.id}" reconnected (${X})`, ge.newConnection) : B("reconnect", `Edge "${N.id}" reconnection cancelled — snapping back`, { reason: ge.reason }), F._emit("reconnect-end", { edge: N, successful: ge.applied }), ee();
        };
        document.addEventListener("pointermove", O), document.addEventListener("pointerup", le), L = ee;
      };
      s.addEventListener("pointerdown", w);
      const _ = (T) => {
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        if (!F) return;
        const re = F._config?.edgesReconnectable !== !1, ce = N.reconnectable ?? !0;
        if (!re || ce === !1 || !v || !C) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const ae = F._config?.reconnectSnapRadius ?? Wi, X = F.screenToFlowPosition(T.clientX, T.clientY), V = (at(X.x, X.y, v.x, v.y, ae) || S && at(X.x, X.y, S.x, S.y, ae)) && (ce === !0 || ce === "source"), q = (at(X.x, X.y, C.x, C.y, ae) || k && at(X.x, X.y, k.x, k.y, ae)) && (ce === !0 || ce === "target");
        V || q ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", _);
      const I = (T) => {
        if (T.key !== "Enter" && T.key !== " ") return;
        T.preventDefault(), T.stopPropagation();
        const N = o(n);
        if (!N) return;
        const F = t.$data(e.closest("[x-data]"));
        F && (F._emit("edge-click", { edge: N, event: T }), ft(T, F._shortcuts?.multiSelect) ? F.selectedEdges.has(N.id) ? (F.selectedEdges.delete(N.id), N.selected = !1) : (F.selectedEdges.add(N.id), N.selected = !0) : (F.deselectAll(), F.selectedEdges.add(N.id), N.selected = !0), F._emitSelectionChange());
      };
      s.addEventListener("keydown", I);
      const P = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, R = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", P), s.addEventListener("blur", R);
      const U = (T) => {
        T.stopPropagation();
      };
      s.addEventListener("mousedown", U);
      const te = () => {
        for (const T of [c, d, u])
          T && T.classList.add("flow-edge-hovered");
      }, Q = () => {
        for (const T of [c, d, u])
          T && T.classList.remove("flow-edge-hovered");
      };
      s.addEventListener("mouseenter", te), s.addEventListener("mouseleave", Q), i(() => {
        const T = o(n);
        if (!T || !a) return;
        s.setAttribute("data-flow-edge-id", T.id);
        const N = t.$data(e.closest("[x-data]"));
        if (!N?.nodes) return;
        const F = T.type ?? N._config?.defaultEdgeType ?? "bezier";
        N._layoutAnimTick;
        const re = N.getNode(T.source), ce = N.getNode(T.target);
        if (!re || !ce) return;
        re.sourcePosition, ce.targetPosition;
        const ae = Ht(re, N._nodeMap, N._config?.nodeOrigin), X = Ht(ce, N._nodeMap, N._config?.nodeOrigin), V = e.closest("[x-data]");
        let q, Z, z, D;
        if (F === "floating") {
          const Y = na(ae, X);
          q = Y.sourcePos, Z = Y.targetPos, z = { x: Y.sx, y: Y.sy, handleWidth: 0, handleHeight: 0 }, D = { x: Y.tx, y: Y.ty, handleWidth: 0, handleHeight: 0 }, v = { x: Y.sx, y: Y.sy }, C = { x: Y.tx, y: Y.ty };
        } else {
          const Y = N._nodeElements?.get(T.source) ?? V.querySelector(`[data-flow-node-id="${CSS.escape(T.source)}"]`), de = N._nodeElements?.get(T.target) ?? V.querySelector(`[data-flow-node-id="${CSS.escape(T.target)}"]`), he = Y ? Ls(Y.getBoundingClientRect()) : void 0, ue = de ? Ls(de.getBoundingClientRect()) : void 0;
          q = ro(V, T.source, T.sourceHandle, "source", re, ue, Y), Z = ro(V, T.target, T.targetHandle, "target", ce, he, de);
          const ge = t.raw(N).viewport ?? { x: 0, y: 0, zoom: 1 }, Ee = ge.zoom || 1, xe = re.rotation, ke = ce.rotation;
          q = ks(q, xe), Z = ks(Z, ke), z = Ps(V, T.source, ae, T.sourceHandle, "source", Ee, ge, ue, Y), D = Ps(V, T.target, X, T.targetHandle, "target", Ee, ge, he, de);
          const Pe = Xt(ae, q, N._shapeRegistry, N._config?.nodeOrigin), ye = Xt(X, Z, N._shapeRegistry, N._config?.nodeOrigin);
          v = z ?? Pe, C = D ?? ye;
        }
        const J = At(z ?? v, q, z, T.markerStart), G = At(D ?? C, Z, D, T.markerEnd);
        S = J, k = G;
        let W;
        if (F === "orthogonal" || F === "avoidant") {
          const Y = t.raw(N.nodes), de = new Map(Y.map((ue) => [ue.id, ue])), he = N._config?.nodeOrigin;
          W = Y.filter((ue) => ue.id !== T.source && ue.id !== T.target).map((ue) => {
            const ge = Ht(ue, de, he);
            return {
              x: ge.position.x,
              y: ge.position.y,
              width: ge.dimensions?.width ?? _e,
              height: ge.dimensions?.height ?? be
            };
          });
        }
        const { path: H, labelPosition: ne } = io(T, ae, X, q, Z, J, G, N._config?.edgeTypes, W, N._shapeRegistry, N._config?.nodeOrigin, N._config?.defaultEdgeType);
        a.setAttribute("d", H), l.setAttribute("d", H);
        const ie = F === "editable", K = ie && (T.showControlPoints || T.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((Y) => Y.remove()), K) {
          const Y = T.controlPoints ?? [], de = N.viewport?.zoom ?? 1, he = 6 / de, ue = 5 / de, ge = v ?? { x: 0, y: 0 }, Ee = C ?? { x: 0, y: 0 }, xe = [ge, ...Y, Ee], ke = xe.length - 1, Pe = a.getTotalLength?.() ?? 0;
          if (Pe > 0) {
            const ye = [0], pe = 200;
            let ve = 1;
            for (let Ce = 1; Ce <= pe && ve < xe.length; Ce++) {
              const Fe = Ce / pe * Pe, Me = a.getPointAtLength(Fe), $e = xe[ve], it = Me.x - $e.x, Oe = Me.y - $e.y;
              it * it + Oe * Oe < 25 && (ye.push(Fe), ve++);
            }
            for (; ye.length <= ke; )
              ye.push(Pe);
            for (let Ce = 0; Ce < ke; Ce++) {
              const Fe = (ye[Ce] + ye[Ce + 1]) / 2, Me = a.getPointAtLength(Fe), $e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              $e.classList.add("flow-edge-midpoint"), $e.setAttribute("cx", String(Me.x)), $e.setAttribute("cy", String(Me.y)), $e.setAttribute("r", String(ue)), $e.dataset.segmentIndex = String(Ce);
              const it = document.createElementNS("http://www.w3.org/2000/svg", "title");
              it.textContent = "Double-click to add control point", $e.appendChild(it), s.appendChild($e);
            }
          }
          for (let ye = 0; ye < Y.length; ye++) {
            const pe = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            pe.classList.add("flow-edge-control-point"), pe.setAttribute("cx", String(Y[ye].x)), pe.setAttribute("cy", String(Y[ye].y)), pe.setAttribute("r", String(he)), pe.dataset.pointIndex = String(ye), s.appendChild(pe);
          }
        }
        if (l.style.cursor = ie ? "crosshair" : "pointer", l.style.strokeWidth = String(
          T.interactionWidth ?? N._config?.defaultInteractionWidth ?? 20
        ), T.markerStart != null) {
          const Y = It(T.markerStart), de = Dt(Y, N._id);
          a.setAttribute("marker-start", `url(#${de})`);
        } else if (T._renderDualMarker && T.markerEnd) {
          const Y = It(T.markerEnd), de = Dt(Y, N._id);
          a.setAttribute("marker-start", `url(#${de})`);
        } else
          a.removeAttribute("marker-start");
        if (T.markerEnd) {
          const Y = It(T.markerEnd), de = Dt(Y, N._id);
          a.setAttribute("marker-end", `url(#${de})`);
        } else
          a.removeAttribute("marker-end");
        const j = T.strokeWidth ?? 1.5, oe = Mg(T.animated);
        switch (oe !== g && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), g === "dot" && M(), g = oe), oe) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            x(s, H, V, T, T.animationDuration);
            break;
        }
        if (T.animationDuration && oe !== "none" ? (oe === "dash" || oe === "pulse") && (a.style.animationDuration = T.animationDuration) : (oe === "dash" || oe === "pulse") && a.style.removeProperty("animation-duration"), m && m !== T.class && s.classList.remove(...m.split(" ").filter(Boolean)), T.class) {
          const Y = oe === "dash" ? " flow-edge-animated" : oe === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", T.class + Y), s.classList.add(...T.class.split(" ").filter(Boolean)), m = T.class;
        } else
          m && (s.classList.remove(...m.split(" ").filter(Boolean)), m = null);
        if (s.setAttribute("aria-selected", String(!!T.selected)), T.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(j + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + hn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(j);
          const Y = N._markerDefsEl?.querySelector("defs") ?? null;
          if (oa(T.color)) {
            if (Y) {
              const de = ia(N._id, T.id), he = T.gradientDirection === "target-source", ue = v.x, ge = v.y, Ee = C.x, xe = C.y;
              sa(
                Y,
                de,
                he ? { from: T.color.to, to: T.color.from } : T.color,
                ue,
                ge,
                Ee,
                xe
              ), a.style.stroke = `url(#${de})`, y = de;
            }
          } else if (T.color) {
            if (y) {
              const de = Y;
              de && Lo(de, y), y = null;
            }
            a.style.stroke = T.color;
          } else {
            if (y) {
              const de = Y;
              de && Lo(de, y), y = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (!T.selected && ((T.sourceHandle ? N.selectedRows?.has(T.sourceHandle.replace(/-[lr]$/, "")) : !1) || (T.targetHandle ? N.selectedRows?.has(T.targetHandle.replace(/-[lr]$/, "")) : !1)) ? (s.classList.add("flow-edge-row-highlighted"), T.selected || (a.style.strokeWidth = String(Math.max(j + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), T.focusable ?? N._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", T.ariaRole ?? "group"), s.setAttribute("aria-label", T.ariaLabel ?? (T.label ? `Edge: ${T.label}` : `Edge from ${T.source} to ${T.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), T.domAttributes)
          for (const [Y, de] of Object.entries(T.domAttributes))
            Y.startsWith("on") || Lg.has(Y.toLowerCase()) || s.setAttribute(Y, de);
        const le = (Y, de, he, ue, ge) => {
          if (de) {
            if (!Y && ue) {
              const Ee = he.includes("flow-edge-label-start"), xe = he.includes("flow-edge-label-end");
              let ke = `[data-flow-edge-id="${ge}"].flow-edge-label`;
              Ee ? ke += ".flow-edge-label-start" : xe ? ke += ".flow-edge-label-end" : ke += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", Y = ue.querySelector(ke);
            }
            return Y || (Y = document.createElement("div"), Y.className = he, Y.dataset.flowEdgeId = ge, ue && ue.appendChild(Y)), Y.textContent = de, Y;
          }
          return Y && Y.remove(), null;
        }, se = e.closest(".flow-viewport"), fe = T.labelVisibility ?? "always", me = () => {
          const Y = a.getAttribute("d") ?? "";
          return Y !== f && (f = Y, h = typeof a.getTotalLength == "function" && a.getTotalLength() || 0), h;
        };
        if (c = le(c, T.label, "flow-edge-label", se, T.id), c) {
          const Y = me();
          if (Y > 0) {
            const de = T.labelPosition ?? 0.5, he = Tg(a, de, Y);
            c.style.left = `${he.x}px`, c.style.top = `${he.y}px`;
          } else
            c.style.left = `${ne.x}px`, c.style.top = `${ne.y}px`;
        }
        if (d = le(d, T.labelStart, "flow-edge-label flow-edge-label-start", se, T.id), d) {
          const Y = me();
          if (Y > 0) {
            const de = T.labelStartOffset ?? 30, he = a.getPointAtLength(Math.min(de, Y / 2));
            d.style.left = `${he.x}px`, d.style.top = `${he.y}px`;
          }
        }
        if (u = le(u, T.labelEnd, "flow-edge-label flow-edge-label-end", se, T.id), u) {
          const Y = me();
          if (Y > 0) {
            const de = T.labelEndOffset ?? 30, he = a.getPointAtLength(Math.max(Y - de, Y / 2));
            u.style.left = `${he.x}px`, u.style.top = `${he.y}px`;
          }
        }
        for (const Y of [c, d, u])
          Y && (Y.classList.toggle("flow-edge-label-hover", fe === "hover"), Y.classList.toggle("flow-edge-label-on-select", fe === "selected"), Y.classList.toggle("flow-edge-label-selected", !!T.selected), T.class ? Y.classList.add(...T.class.split(" ").filter(Boolean)) : m && Y.classList.remove(...m.split(" ").filter(Boolean)));
      }), r(() => {
        if (y) {
          const N = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          N && Lo(N, y);
        }
        L?.(), M(), s.removeEventListener("contextmenu", b), s.removeEventListener("dblclick", E), s.removeEventListener("pointerdown", A, !0), s.removeEventListener("pointerdown", w), s.removeEventListener("pointermove", _), s.removeEventListener("keydown", I), s.removeEventListener("focus", P), s.removeEventListener("blur", R), s.removeEventListener("mousedown", U), s.removeEventListener("mouseenter", te), s.removeEventListener("mouseleave", Q), c?.remove(), d?.remove(), u?.remove();
      });
    }
  );
}
function $g(t, e) {
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
        const a = typeof l == "string" ? gn(l) : l;
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
        const s = Ht(i, t._nodeMap, t._config.nodeOrigin), l = Ht(r, t._nodeMap, t._config.nodeOrigin);
        let a, c, d, u;
        if (o.type === "floating") {
          const h = na(s, l);
          d = { x: h.sx, y: h.sy }, u = { x: h.tx, y: h.ty };
          const p = At(d, h.sourcePos, null, o.markerStart), g = At(u, h.targetPos, null, o.markerEnd), y = io(o, s, l, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const C = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), S = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (C) {
              const k = C.getBoundingClientRect();
              p = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
            if (S) {
              const k = S.getBoundingClientRect();
              g = { x: (k.left + k.right) / 2, y: (k.top + k.bottom) / 2 };
            }
          }
          const y = h ? ro(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", m = h ? ro(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = Xt(s, y, t._shapeRegistry, t._config.nodeOrigin), u = Xt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const x = At(d, y, null, o.markerStart), M = At(u, m, null, o.markerEnd), v = io(o, s, l, y, m, x, M, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = v.path, c = v.labelPosition;
        }
        const f = t.getEdgePathElement(o.id);
        if (f) {
          f.setAttribute("d", a);
          const p = f.parentElement?.querySelector("path:first-child");
          p && p !== f && p.setAttribute("d", a);
        }
        if (oa(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = ia(t._id, o.id), g = o.gradientDirection === "target-source";
            sa(
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
function Ig(t) {
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
              xr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Br(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Dg = 0;
function Rg(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Hg(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Dg}`,
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
      _shapeRegistry: { ...Vr, ...e.shapeTypes },
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
          const p = h.gap * l, g = h.variant === "cross" ? p / 2 : p;
          d.push(Rg(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (u.push(`${g}px ${g}px, ${g}px ${g}px`), f.push(`${a}px ${c}px, ${a}px ${c}px`)) : (u.push(`${p}px ${p}px`), f.push(`${a}px ${c}px`));
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
      _shortcuts: Sf(e.keyboardShortcuts),
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
      _computeEngine: new Vf(),
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
        s !== "viewport-change" && s !== "viewport-move" && B("event", s, l);
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
        this._nodeMap = Fr(this.nodes), Pf(this._childrenIds, this.nodes);
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
        const a = e.cullingBuffer ?? 100, c = $u(this.viewport, s, l, a), d = /* @__PURE__ */ new Set();
        for (const u of this.nodes) {
          if (u.hidden) continue;
          const f = u.dimensions?.width ?? 150, h = u.dimensions?.height ?? 50, p = u.parentId ? Uo(u, this._nodeMap, this._config.nodeOrigin) : u.position, g = !(p.x + f < c.minX || p.x > c.maxX || p.y + h < c.minY || p.y > c.maxY);
          g && d.add(u.id);
          const y = this._nodeElements.get(u.id);
          y && (y.style.display = g ? "" : "none");
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
        return l ? Uo(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && xr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Yu(Un), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Br(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = Ct(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
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
          this._announcer = new zf(this._container, s);
        }
      },
      /** Set up collaboration bridge via collab addon plugin. */
      _initCollab() {
        if (e.collab && this._container) {
          const s = Tt("collab");
          if (!s) {
            console.error("[AlpineFlow] Collaboration requires the collab plugin. Register it with: Alpine.plugin(AlpineFlowCollab)");
            return;
          }
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: u } = s, f = e.collab, h = new a(), p = new c(h), g = new d(h, this, f.provider), y = new u(p, f.user);
          if (De.set(l, { bridge: g, awareness: y, doc: h }), f.provider.connect(h, p), f.cursors !== !1) {
            let m = !1;
            const x = f.throttle ?? 20, M = (S) => {
              if (m) return;
              m = !0;
              const k = l.getBoundingClientRect(), $ = this._viewportLive ?? this.viewport, b = (S.clientX - k.left - $.x) / $.zoom, E = (S.clientY - k.top - $.y) / $.zoom;
              y.updateCursor({ x: b, y: E }), setTimeout(() => {
                m = !1;
              }, x);
            }, v = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", M), l.addEventListener("mouseleave", v);
            const C = De.get(l);
            C.cursorCleanup = () => {
              l.removeEventListener("mousemove", M), l.removeEventListener("mouseleave", v);
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
        }), this._panZoom = Mu(this._container, {
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
          }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container));
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
        if (s && (this._longPressCleanup = Lf(
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
          if (We(s.key, a.escape) && this.contextMenu.show) {
            this.closeContextMenu();
            return;
          }
          if (We(s.key, a.escape) && this.pendingConnection) {
            this._emit("connect-end", {
              connection: null,
              source: this.pendingConnection.source,
              sourceHandle: this.pendingConnection.sourceHandle,
              position: { x: 0, y: 0 }
            }), this.pendingConnection = null, this._container?.classList.remove("flow-connecting"), this._container && Le(this._container);
            return;
          }
          if (We(s.key, a.delete)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._deleteSelected();
          }
          if (We(s.key, this._shortcuts.selectionToolToggle) && !s.ctrlKey && !s.metaKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            this._selectionTool = this._selectionTool === "box" ? "lasso" : "box";
            return;
          }
          if (We(s.key, a.moveNodes)) {
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
                const f = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, p = f.findIndex((g) => (g.length === 1 ? g.toLowerCase() : g) === h);
                p === 0 ? u = -c : p === 1 ? u = c : p === 2 ? d = -c : p === 3 && (d = c);
              }
            }
            kf(s.repeat, this.selectedNodes.size, d, u) && this._captureHistory();
            for (const f of this.selectedNodes) {
              const h = this.getNode(f);
              if (h && $r(h)) {
                h.position.x += d, h.position.y += u;
                const p = this._container ? De.get(this._container) : void 0;
                p?.bridge && p.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
              }
            }
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey && We(s.key, a.undo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.undo();
          }
          if ((s.ctrlKey || s.metaKey) && s.shiftKey && We(s.key, a.redo)) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            s.preventDefault(), this.redo();
          }
          if ((s.ctrlKey || s.metaKey) && !s.shiftKey) {
            if (l === "INPUT" || l === "TEXTAREA") return;
            We(s.key, a.copy) ? (s.preventDefault(), this.copy()) : We(s.key, a.paste) ? (s.preventDefault(), this.paste()) : We(s.key, a.cut) && (s.preventDefault(), this.cut());
          }
        }, document.addEventListener("keydown", this._onKeyDown);
      },
      /** Create minimap if configured. */
      _initMinimap() {
        e.minimap && (this._minimap = Uu(this._container, {
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
          const s = e.controlsContainer ? document.querySelector(e.controlsContainer) ?? this._container : this._container, l = s !== this._container;
          this._controls = tf(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: Xo }),
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
        this._selectionBox = nf(this._container), this._lasso = of(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
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
          const a = to(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const u = this._lasso.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? lf(a, u) : af(a, u), h = new Set(f.map((p) => p.id));
            if (c = this.nodes.filter((p) => h.has(p.id)), this._config.lassoSelectsEdges)
              for (const p of this.edges) {
                if (p.hidden) continue;
                const g = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(p.id)}"] path`
                );
                if (!g) continue;
                const y = g.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let x = 0;
                for (let v = 0; v <= m; v++) {
                  const C = g.getPointAtLength(v / m * y);
                  mi(C.x, C.y, u) && x++;
                }
                (this._selectionEffectiveMode === "full" ? x === m + 1 : x > 0) && d.push(p.id);
              }
          } else {
            const u = this._selectionBox.end(this.viewport);
            if (!u) return;
            const f = this._selectionEffectiveMode === "full" ? Nu(a, u, this._config.nodeOrigin) : Au(a, u, this._config.nodeOrigin), h = new Set(f.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const u of c) {
            if (!jo(u) || u.hidden) continue;
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
            const f = _r(
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
          for (const l of s) {
            const a = l.target, c = a.getAttribute("data-flow-node-id");
            if (!c) continue;
            const d = this._nodeMap.get(c);
            if (!d) continue;
            const u = l.borderBoxSize?.[0], f = u ? u.inlineSize : a.offsetWidth, h = u ? u.blockSize : a.offsetHeight;
            if (f === 0 && h === 0 || a.offsetParent === null && a.tagName !== "BODY" || d.fixedDimensions === !0) continue;
            const p = Math.round(f), g = Math.round(h), y = d.dimensions;
            if (y && Math.abs((y.width ?? 0) - p) < 1 && Math.abs((y.height ?? 0) - g) < 1)
              continue;
            const m = th(
              { width: p, height: g },
              d.minDimensions,
              d.maxDimensions
            );
            d.dimensions = m, d.parentId && this._layoutDedup?.safeLayoutChildren(d.parentId);
          }
        }));
      },
      /** Run initial child layouts for all layout parents. */
      _initChildLayout() {
        if (this._layoutDedup = Qf((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && Kf(e, s, e.wireEvents);
          const l = Gf(this, s), a = Yf(this, s);
          this._wireCleanup = () => {
            l(), a();
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
        });
      },
      /** Call setup(canvas) on any addon that provides it. */
      _initAddons() {
        for (const [, s] of qr().entries())
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
          c && Tt(c) ? (this._autoLayoutReady = !0, this.$nextTick(() => this._runAutoLayout())) : c && this._warn("AUTO_LAYOUT_MISSING_DEP", `autoLayout requires the ${s} plugin. Register it with: Alpine.plugin(${a[s]})`);
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
            const f = It(u), h = Dt(f, this._id);
            l.has(h) || l.set(h, Kn(f, h));
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
        if (this._wireCleanup?.(), this._wireCleanup = null, this._longPressCleanup?.(), this._longPressCleanup = null, this._touchSelectionCleanup?.(), this._touchSelectionCleanup = null, this._emit("destroy"), B("destroy", `flowCanvas "${this._id}" destroying`), this._onCanvasClick && this._container && this._container.removeEventListener("click", this._onCanvasClick), this._onCanvasContextMenu && this._container && this._container.removeEventListener("contextmenu", this._onCanvasContextMenu), this._container)
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
          const s = De.get(this._container);
          s && (s.bridge.destroy(), s.awareness.destroy(), s.cursorCleanup && s.cursorCleanup(), De.delete(this._container));
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
        return this._layoutDedup ? eh(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? De.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => dm));
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
      sh(i),
      rh(i),
      ah(i),
      uh(i),
      hh(i),
      Bh(i),
      Yh(i),
      Wh(i),
      jh(i),
      ng(i),
      og(i),
      ig(i),
      $g(i, t),
      Ig(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      Wu(s, l);
    }, n;
  });
}
function Ms(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function Fg(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: u, noDragClassName: f, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(x) {
    const M = s();
    return {
      x: (x.x - M.x) / M.zoom,
      y: (x.y - M.y) / M.zoom
    };
  }
  const y = Be(t), m = lc().subject(() => {
    const x = s(), M = l();
    return {
      x: M.x * x.zoom + x.x,
      y: M.y * x.zoom + x.y
    };
  }).on("start", (x) => {
    p = g(x), o?.({ nodeId: e, position: p, sourceEvent: x.sourceEvent });
  }).on("drag", (x) => {
    let M = g(x);
    a && (M = Ms(M, a));
    const v = {
      x: M.x - p.x,
      y: M.y - p.y
    };
    i?.({ nodeId: e, position: M, delta: v, sourceEvent: x.sourceEvent });
  }).on("end", (x) => {
    let M = g(x);
    a && (M = Ms(M, a)), r?.({ nodeId: e, position: M, sourceEvent: x.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((x) => {
    if (u?.() || f && x.target?.closest?.("." + f)) return !1;
    if (c) {
      const M = t.querySelector(c);
      return M ? M.contains(x.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Og(t, e) {
  const n = Yt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? _e,
    height: t.dimensions?.height ?? be
  };
}
function zg(t, e, n) {
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
    for (const [v, C] of x) {
      const S = C - v;
      Math.abs(S) <= n && (i.add(C), Math.abs(S) < Math.abs(l) && (l = S, r = S));
    }
    const M = [
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
    for (const [v, C] of M) {
      const S = C - v;
      Math.abs(S) <= n && (o.add(C), Math.abs(S) < Math.abs(a) && (a = S, s = S));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Vg(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Bg(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = Vg(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const qg = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Xg = 0;
function Ts(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Po(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function Yg(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function Wg(t, e, n) {
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
function jg(t, e, n) {
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
function Ug(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, u = null, f = null, h = null, p = null, g = null, y = !1, m = -1, x = null, M = !1, v = [], C = "", S = [], k = null;
      i(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L || L.hidden) return;
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        const _ = L.parentId ? w.getAbsolutePosition(L.id) : L.position ?? { x: 0, y: 0 }, I = L.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], P = L.dimensions?.width ?? 150, R = L.dimensions?.height ?? 40;
        e.style.left = _.x - P * I[0] + "px", e.style.top = _.y - R * I[1] + "px";
      }), i(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L) return;
        if (e.dataset.flowNodeId = L.id, L.type && (e.dataset.flowNodeType = L.type), !M) {
          const V = e.closest("[x-data]"), q = V ? t.$data(V) : null;
          let Z = !1;
          if (q?._config?.nodeTypes) {
            const z = L.type ?? "default", D = q._config.nodeTypes[z] ?? q._config.nodeTypes.default;
            if (typeof D == "string") {
              const J = document.querySelector(D);
              J?.content && (e.appendChild(J.content.cloneNode(!0)), Z = !0);
            } else typeof D == "function" && (D(L, e), Z = !0);
          }
          if (!Z && e.children.length === 0) {
            const z = document.createElement("div");
            z.setAttribute("x-flow-handle:target", "");
            const D = document.createElement("span");
            D.setAttribute("x-text", "node.data.label");
            const J = document.createElement("div");
            J.setAttribute("x-flow-handle:source", ""), e.appendChild(z), e.appendChild(D), e.appendChild(J), Z = !0;
          }
          if (Z)
            for (const z of Array.from(e.children))
              t.addScopeToNode(z, { node: L }), t.initTree(z);
          M = !0;
        }
        if (L.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), k !== L.id && (s?.destroy(), s = null, k = L.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        if (e.classList.add("flow-node", "nopan"), L.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group"), L.dimensions) {
          const V = L.childLayout, q = L.fixedDimensions, Z = (w._childrenIds?.get(L.id)?.length ?? 0) > 0;
          e.style.width = L.dimensions.width + "px", V || q || Z ? e.style.height = L.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(L.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!L.selected)), L._validationErrors && L._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const _ = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], I = L.runState;
        for (const V of _)
          e.classList.remove(V);
        I && I !== "pending" && e.classList.add(`flow-node-${I}`);
        for (const V of v)
          e.classList.remove(V);
        const P = L.class ? L.class.split(/\s+/).filter(Boolean) : [];
        for (const V of P)
          e.classList.add(V);
        v = P;
        const R = L.shape ? `flow-node-${L.shape}` : "";
        C !== R && (C && e.classList.remove(C), R && e.classList.add(R), C = R);
        const U = t.$data(e.closest("[data-flow-canvas]")), te = L.shape && U?._shapeRegistry?.[L.shape];
        if (te?.clipPath ? e.style.clipPath = te.clipPath : e.style.clipPath = "", L.style) {
          const V = typeof L.style == "string" ? Object.fromEntries(L.style.split(";").filter(Boolean).map((Z) => Z.split(":").map((z) => z.trim()))) : L.style, q = [];
          for (const [Z, z] of Object.entries(V))
            Z && z && (e.style.setProperty(Z, z), q.push(Z));
          for (const Z of S)
            q.includes(Z) || e.style.removeProperty(Z);
          S = q;
        } else if (S.length > 0) {
          for (const V of S)
            e.style.removeProperty(V);
          S = [];
        }
        if (L.rotation ? (e.style.transform = `rotate(${L.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", L.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", L.ariaRole ?? "group"), e.setAttribute("aria-label", L.ariaLabel ?? (L.data?.label ? `Node: ${L.data.label}` : `Node ${L.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), L.domAttributes)
          for (const [V, q] of Object.entries(L.domAttributes))
            V.startsWith("on") || qg.has(V.toLowerCase()) || e.setAttribute(V, q);
        Ve(L) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), L.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const T = e.classList.contains("flow-node-condensed");
        L.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!L.condensed !== T && requestAnimationFrame(() => {
          L.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, B("condense", `Node "${L.id}" re-measured after condense toggle`, L.dimensions);
        }), L.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const N = L.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), N !== "visible" && e.classList.add(`flow-handles-${N}`);
        let F = Or(L, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(L.id) && (F += L.type === "group" ? Math.max(1 - F, 0) : 1e3), y && (F += 1e3);
        const ce = L.type === "group" ? 0 : 2;
        if (F !== ce ? e.style.zIndex = String(F) : e.style.removeProperty("z-index"), !$r(L)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const X = e.closest(".flow-container");
        s || (s = Fg(e, L.id, {
          container: X ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => w._animationLocked,
          noDragClassName: w._config?.noDragClassName ?? "nodrag",
          dragThreshold: w._config?.nodeDragThreshold ?? 0,
          getViewport: () => w.viewport,
          getNodePosition: () => {
            const V = w.getNode(L.id);
            return V ? V.parentId ? w.getAbsolutePosition(V.id) : { x: V.position.x, y: V.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: w._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: V, position: q, sourceEvent: Z }) {
            e.classList.add("flow-node-dragging"), l = !1, c = !1, d = null;
            const z = w._container ? De.get(w._container) : void 0;
            z?.bridge && z.bridge.setDragging(V, !0), h?.destroy(), h = null, p = null, g && X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, a = w._snapshotHistory?.() ?? null, B("drag", `Node "${V}" drag start`, q);
            const D = w.getNode(V);
            if (D && (w._config?.selectNodesOnDrag !== !1 && D.selectable !== !1 && !w.selectedNodes.has(V) && (ft(Z, w._shortcuts?.multiSelect) || w.deselectAll(), w.selectedNodes.add(V), D.selected = !0, w._emitSelectionChange(), c = !0), w._emit("node-drag-start", { node: D }), w.selectedNodes.has(V) && w.selectedNodes.size > 1)) {
              const J = ht(V, w.nodes);
              d = /* @__PURE__ */ new Map();
              for (const G of w.selectedNodes) {
                if (G === V || J.has(G))
                  continue;
                const W = w.getNode(G);
                W && W.draggable !== !1 && d.set(G, { x: W.position.x, y: W.position.y });
              }
            }
            w._config?.autoPanOnNodeDrag !== !1 && X && (u = Dr({
              container: X,
              speed: w._config?.autoPanSpeed ?? 15,
              onPan(J, G) {
                const W = () => w._viewportLive ?? w.viewport, H = W().zoom || 1, ne = { x: W().x, y: W().y };
                w._panZoom?.setViewport({
                  x: W().x - J,
                  y: W().y - G,
                  zoom: H
                });
                const ie = ne.x - W().x, K = ne.y - W().y, j = ie === 0 && K === 0, oe = w.getNode(V);
                let O = !1;
                if (oe) {
                  const ee = oe.position.x, le = oe.position.y;
                  oe.position.x += ie / H, oe.position.y += K / H;
                  const se = Mn(oe.position, oe, w._config?.nodeExtent);
                  oe.position.x = se.x, oe.position.y = se.y, O = oe.position.x === ee && oe.position.y === le;
                }
                if (d)
                  for (const [ee] of d) {
                    const le = w.getNode(ee);
                    if (le) {
                      le.position.x += ie / H, le.position.y += K / H;
                      const se = Mn(le.position, le, w._config?.nodeExtent);
                      le.position.x = se.x, le.position.y = se.y;
                    }
                  }
                return j && O;
              }
            }), Z instanceof MouseEvent && u.updatePointer(Z.clientX, Z.clientY), u.start());
          },
          onDrag({ nodeId: V, position: q, delta: Z, sourceEvent: z }) {
            l = !0;
            const D = w.getNode(V);
            if (D) {
              if (D.parentId) {
                const W = w.getAbsolutePosition(D.parentId);
                let H = q.x - W.x, ne = q.y - W.y;
                const ie = D.dimensions ?? { width: 150, height: 50 }, K = w.getNode(D.parentId);
                if (K?.childLayout) {
                  y || (e.classList.add("flow-reorder-dragging"), x = D.parentId), y = !0;
                  const j = D.extent !== "parent";
                  if (D.position.x = q.x - W.x, D.position.y = q.y - W.y, !j && K.dimensions) {
                    const ee = bo({ x: D.position.x, y: D.position.y }, ie, K.dimensions);
                    D.position.x = ee.x, D.position.y = ee.y;
                  }
                  const oe = D.dimensions?.width ?? 150, O = D.dimensions?.height ?? 50;
                  if (j) {
                    const ee = K.dimensions?.width ?? 150, le = K.dimensions?.height ?? 50, se = D.position.x + oe / 2, fe = D.position.y + O / 2, me = 12, Y = x === D.parentId ? 0 : me, de = se >= Y && se <= ee - Y && fe >= Y && fe <= le - Y, he = /* @__PURE__ */ new Set();
                    let ue = D.parentId;
                    for (; ue; )
                      he.add(ue), ue = w.getNode(ue)?.parentId;
                    const ge = q.x + oe / 2, Ee = q.y + O / 2, xe = ht(D.id, w.nodes);
                    let ke = null;
                    const Pe = w.nodes.filter(
                      (pe) => pe.id !== D.id && (pe.droppable || pe.childLayout) && !pe.hidden && !xe.has(pe.id) && (de ? !he.has(pe.id) : pe.id !== D.parentId) && (!pe.acceptsDrop || pe.acceptsDrop(D))
                    );
                    for (const pe of Pe) {
                      const ve = pe.parentId ? w.getAbsolutePosition(pe.id) : pe.position, Ce = pe.dimensions?.width ?? 150, Fe = pe.dimensions?.height ?? 50, Me = pe.id === g ? 0 : me;
                      ge >= ve.x + Me && ge <= ve.x + Ce - Me && Ee >= ve.y + Me && Ee <= ve.y + Fe - Me && (ke = pe);
                    }
                    const ye = ke?.id ?? null;
                    if (ye !== g) {
                      g && X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), ye && X && X.querySelector(`[data-flow-node-id="${CSS.escape(ye)}"]`)?.classList.add("flow-node-drop-target"), g = ye;
                      const pe = ye ? w.getNode(ye) : null, ve = x;
                      if (pe?.childLayout && ye !== x) {
                        ve && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = ye;
                        const Ce = w.nodes.filter((Oe) => Oe.parentId === ye && Oe.id !== V).sort((Oe, va) => (Oe.order ?? 1 / 0) - (va.order ?? 1 / 0)), Fe = Ce.length, Me = [...Ce];
                        Me.splice(Fe, 0, D);
                        for (let Oe = 0; Oe < Me.length; Oe++)
                          Me[Oe].order = Oe;
                        m = Fe;
                        const $e = w._initialDimensions?.get(V), it = { ...D, dimensions: $e ? { ...$e } : void 0 };
                        w.layoutChildren(ye, { excludeId: V, includeNode: it, shallow: !0 }), w.propagateLayoutUp(ye, { includeNode: it });
                      } else de && x !== D.parentId ? (ve && ve !== D.parentId && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = D.parentId, m = -1) : !ye && !de && (ve && (w.layoutChildren(ve, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(ve, { omitFromComputation: V })), x = null, m = -1);
                    }
                  }
                  if (x) {
                    const ee = w.getNode(x), le = ee?.childLayout ?? K.childLayout, se = w.nodes.filter((ue) => ue.parentId === x && ue.id !== V).sort((ue, ge) => (ue.order ?? 1 / 0) - (ge.order ?? 1 / 0));
                    let fe, me;
                    if (x !== D.parentId) {
                      const ue = ee?.parentId ? w.getAbsolutePosition(x) : ee?.position ?? { x: 0, y: 0 };
                      fe = q.x - ue.x, me = q.y - ue.y;
                    } else
                      fe = D.position.x, me = D.position.y;
                    const Y = le.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (x === D.parentId) {
                        const ue = D.order ?? 0;
                        m = se.filter((ge) => (ge.order ?? 0) < ue).length;
                      } else
                        m = se.length;
                    const de = m;
                    let he = se.length;
                    for (let ue = 0; ue < se.length; ue++) {
                      const ge = se[ue], Ee = ge.dimensions?.width ?? 150, xe = ge.dimensions?.height ?? 50, ke = ue < de ? 1 - Y : Y, Pe = ge.position.y + xe * ke, ye = ge.position.x + Ee * ke;
                      if (le.direction === "grid") {
                        const pe = {
                          x: fe + oe / 2,
                          y: me + O / 2
                        }, ve = ge.position.y + xe / 2;
                        if (pe.y < ge.position.y) {
                          he = ue;
                          break;
                        }
                        if (Math.abs(pe.y - ve) < xe / 2 && pe.x < ye) {
                          he = ue;
                          break;
                        }
                      } else if (le.direction === "vertical") {
                        if ((ue < de ? me : me + O) < Pe) {
                          he = ue;
                          break;
                        }
                      } else if ((ue < de ? fe : fe + oe) < ye) {
                        he = ue;
                        break;
                      }
                    }
                    if (he !== m) {
                      m = he;
                      const ue = [...se];
                      ue.splice(he, 0, D);
                      for (let Pe = 0; Pe < ue.length; Pe++)
                        ue[Pe].order = Pe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), w._layoutAnimFrame && cancelAnimationFrame(w._layoutAnimFrame);
                      const Ee = D.id, xe = x, ke = xe !== D.parentId;
                      w._layoutAnimFrame = requestAnimationFrame(() => {
                        if (ke && xe) {
                          const ve = w.getNode(Ee);
                          let Ce;
                          if (ve) {
                            const Fe = w._initialDimensions?.get(Ee);
                            Ce = { ...ve, dimensions: Fe ? { ...Fe } : void 0 };
                          }
                          w.layoutChildren(xe, {
                            excludeId: Ee,
                            includeNode: Ce,
                            shallow: !0
                          }), w.propagateLayoutUp(xe, {
                            includeNode: Ce
                          });
                        } else
                          w.layoutChildren(xe, Ee, !0);
                        const Pe = performance.now(), ye = 300, pe = () => {
                          w._layoutAnimTick++, performance.now() - Pe < ye ? w._layoutAnimFrame = requestAnimationFrame(pe) : w._layoutAnimFrame = 0;
                        };
                        w._layoutAnimFrame = requestAnimationFrame(pe);
                      });
                    }
                  }
                  u && z instanceof MouseEvent && u.updatePointer(z.clientX, z.clientY);
                  return;
                }
                if (D.extent === "parent" && K?.dimensions) {
                  const j = bo(
                    { x: H, y: ne },
                    ie,
                    K.dimensions
                  );
                  H = j.x, ne = j.y;
                } else if (Array.isArray(D.extent)) {
                  const j = zr({ x: H, y: ne }, D.extent, ie);
                  H = j.x, ne = j.y;
                }
                if ((!D.extent || D.extent !== "parent") && (an(
                  K,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!K?.childLayout) && K?.dimensions) {
                  const O = bo(
                    { x: H, y: ne },
                    ie,
                    K.dimensions
                  );
                  H = O.x, ne = O.y;
                }
                if (D.expandParent && K?.dimensions) {
                  const j = Mf(
                    { x: H, y: ne },
                    ie,
                    K.dimensions
                  );
                  j && (K.dimensions.width = j.width, K.dimensions.height = j.height);
                }
                D.position.x = H, D.position.y = ne;
              } else {
                const W = Mn(q, D, w._config?.nodeExtent);
                D.position.x = W.x, D.position.y = W.y;
              }
              if (w._config?.snapToGrid) {
                const W = D.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], H = D.dimensions?.width ?? 150, ne = D.dimensions?.height ?? 40, ie = D.parentId ? w.getAbsolutePosition(D.id) : D.position;
                e.style.left = ie.x - H * W[0] + "px", e.style.top = ie.y - ne * W[1] + "px", w._layoutAnimTick++;
              }
              if (w._emit("node-drag", { node: D, position: q }), d)
                for (const [W, H] of d) {
                  const ne = w.getNode(W);
                  if (ne) {
                    let ie = H.x + Z.x, K = H.y + Z.y;
                    const j = Mn({ x: ie, y: K }, ne, w._config?.nodeExtent);
                    ne.position.x = j.x, ne.position.y = j.y;
                  }
                }
              const G = w._config?.helperLines;
              if (G) {
                const W = typeof G == "object" ? G.snap ?? !0 : !0, H = typeof G == "object" ? G.threshold ?? 5 : 5, ne = (ee) => {
                  const le = ee.parentId ? w.getAbsolutePosition(ee.id) : ee.position;
                  return Og({ ...ee, position: le }, w._config?.nodeOrigin);
                }, K = (w.selectedNodes.size > 1 && w.selectedNodes.has(V) ? w.nodes.filter((ee) => w.selectedNodes.has(ee.id)) : [D]).map(ne), j = {
                  x: Math.min(...K.map((ee) => ee.x)),
                  y: Math.min(...K.map((ee) => ee.y)),
                  width: Math.max(...K.map((ee) => ee.x + ee.width)) - Math.min(...K.map((ee) => ee.x)),
                  height: Math.max(...K.map((ee) => ee.y + ee.height)) - Math.min(...K.map((ee) => ee.y))
                }, oe = w.nodes.filter(
                  (ee) => !w.selectedNodes.has(ee.id) && ee.id !== V && ee.hidden !== !0 && ee.filtered !== !0
                ).map(ne), O = zg(j, oe, H);
                if (W && (O.snapOffset.x !== 0 || O.snapOffset.y !== 0) && (D.position.x += O.snapOffset.x, D.position.y += O.snapOffset.y, d))
                  for (const [ee] of d) {
                    const le = w.getNode(ee);
                    le && (le.position.x += O.snapOffset.x, le.position.y += O.snapOffset.y);
                  }
                if (f?.remove(), O.horizontal.length > 0 || O.vertical.length > 0) {
                  const ee = X?.querySelector(".flow-viewport");
                  if (ee) {
                    const le = w.nodes.map(ne);
                    f = jg(O.horizontal, O.vertical, le), ee.appendChild(f);
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
              const G = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, W = D.dimensions?.width ?? _e, H = D.dimensions?.height ?? be, ne = w.selectedNodes, ie = w.nodes.filter((j) => j.id !== D.id && !j.hidden && !ne.has(j.id)).map((j) => qt(j, w._config?.nodeOrigin)), K = ih(D.position, W, H, ie, G);
              D.position.x = K.x, D.position.y = K.y;
            }
            if (!D.parentId) {
              const G = ht(D.id, w.nodes), W = w.nodes.filter(
                (j) => j.id !== D.id && j.droppable && !j.hidden && !G.has(j.id) && (!j.acceptsDrop || j.acceptsDrop(D))
              ), H = qt(D, w._config?.nodeOrigin);
              let ne = null;
              const ie = 12;
              for (const j of W) {
                const oe = j.parentId ? w.getAbsolutePosition(j.id) : j.position, O = j.dimensions?.width ?? _e, ee = j.dimensions?.height ?? be, le = H.x + H.width / 2, se = H.y + H.height / 2, fe = j.id === g ? 0 : ie;
                le >= oe.x + fe && le <= oe.x + O - fe && se >= oe.y + fe && se <= oe.y + ee - fe && (ne = j);
              }
              const K = ne?.id ?? null;
              K !== g && (g && X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), K && X && X.querySelector(`[data-flow-node-id="${CSS.escape(K)}"]`)?.classList.add("flow-node-drop-target"), g = K);
            }
            if (w._config?.proximityConnect) {
              const G = w._config.proximityConnectDistance ?? 150, W = D.dimensions ?? { width: 150, height: 50 }, H = {
                x: D.position.x + W.width / 2,
                y: D.position.y + W.height / 2
              }, ne = w.nodes.filter((K) => K.id !== D.id && !K.hidden).map((K) => ({
                id: K.id,
                center: {
                  x: K.position.x + (K.dimensions?.width ?? 150) / 2,
                  y: K.position.y + (K.dimensions?.height ?? 50) / 2
                }
              })), ie = Bg(D.id, H, ne, G);
              if (ie)
                if (w.edges.some(
                  (j) => j.source === ie.source && j.target === ie.target || j.source === ie.target && j.target === ie.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = ie, !h) {
                    h = Rt({
                      connectionLineType: w._config?.connectionLineType,
                      connectionLineStyle: w._config?.connectionLineStyle,
                      connectionLine: w._config?.connectionLine
                    });
                    const j = X?.querySelector(".flow-viewport");
                    j && j.appendChild(h.svg);
                  }
                  h.update({
                    fromX: H.x,
                    fromY: H.y,
                    toX: ie.targetCenter.x,
                    toY: ie.targetCenter.y,
                    source: ie.source
                  });
                }
              else
                h?.destroy(), h = null, p = null;
            }
            const J = w._container ? De.get(w._container) : void 0;
            if (J?.bridge) {
              if (J.bridge.pushLocalNodeUpdate(V, { position: D.position }), d)
                for (const [G] of d) {
                  const W = w.getNode(G);
                  W && J.bridge.pushLocalNodeUpdate(G, { position: W.position });
                }
              if (J.awareness && z instanceof MouseEvent && w._container) {
                const G = w._container.getBoundingClientRect(), W = w._viewportLive ?? w.viewport, H = (z.clientX - G.left - W.x) / W.zoom, ne = (z.clientY - G.top - W.y) / W.zoom;
                J.awareness.updateCursor({ x: H, y: ne });
              }
            }
            u && z instanceof MouseEvent && u.updatePointer(z.clientX, z.clientY);
          },
          onDragEnd({ nodeId: V, position: q }) {
            e.classList.remove("flow-node-dragging"), B("drag", `Node "${V}" drag end`, q);
            const Z = w._container ? De.get(w._container) : void 0;
            Z?.bridge && Z.bridge.setDragging(V, !1), u?.stop(), u = null, f?.remove(), f = null, w._config?.helperLines && w._emit("helper-lines-change", { horizontal: [], vertical: [] });
            const z = w.getNode(V);
            if (z && w._emit("node-drag-end", { node: z, position: q }), y && z?.parentId) {
              e.classList.remove("flow-reorder-dragging");
              const D = x;
              y = !1, m = -1, x = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Po(w, V, g), g = null) : D && D !== z.parentId ? (w.layoutChildren(D, { omitFromComputation: V, shallow: !0 }), w.propagateLayoutUp(D, { omitFromComputation: V }), w.layoutChildren(z.parentId), w._emit("child-reorder", {
                nodeId: V,
                parentId: z.parentId,
                order: z.order
              })) : (w.layoutChildren(z.parentId), w._emit("child-reorder", {
                nodeId: V,
                parentId: z.parentId,
                order: z.order
              })), d = null, w._layoutAnimTick++, Ts(w, l, a), a = null, l = !1;
              return;
            }
            if (z && g)
              X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Po(w, V, g), g = null;
            else if (z && z.parentId && !g) {
              const D = an(
                w.getNode(z.parentId),
                w._config?.childValidationRules ?? {}
              ), J = w.getNode(z.parentId);
              if (!D?.preventChildEscape && !J?.childLayout && J?.dimensions) {
                const G = z.position.x, W = z.position.y, H = z.dimensions?.width ?? 150, ne = z.dimensions?.height ?? 50;
                (G + H < 0 || W + ne < 0 || G > J.dimensions.width || W > J.dimensions.height) && Po(w, V, null);
              }
              g = null;
            } else
              g && X && X.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (w._config?.proximityConnect && p) {
              const D = p;
              h?.destroy(), h = null, p = null;
              let J = !0;
              if (w._config.onProximityConnect && w._config.onProximityConnect({
                source: D.source,
                target: D.target,
                distance: D.distance
              }) === !1 && (J = !1), J) {
                const G = {
                  source: D.source,
                  sourceHandle: "source",
                  target: D.target,
                  targetHandle: "target"
                };
                if (dt(G, w.edges, { preventCycles: w._config?.preventCycles }) && ct(G, w._config?.connectionRules, w._nodeMap) && (X ? Je(X, G, w.edges) : !0) && (X ? Ge(X, G) : !0) && (!w._config.isValidConnection || w._config.isValidConnection(G))) {
                  if (w._config.proximityConnectConfirm) {
                    const j = X?.querySelector(`[data-flow-node-id="${CSS.escape(D.source)}"]`), oe = X?.querySelector(`[data-flow-node-id="${CSS.escape(D.target)}"]`);
                    j?.classList.add("flow-proximity-confirm"), oe?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      j?.classList.remove("flow-proximity-confirm"), oe?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const K = `e-${D.source}-${D.target}-${Date.now()}-${Xg++}`;
                  w.addEdges({ id: K, ...G }), w._emit("connect", { connection: G });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, l && w._layoutAnimTick++, Ts(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const L = t.$data(e.closest("[x-data]"));
        if (L?._config?.easyConnect) {
          const w = L._config.easyConnectKey ?? "alt", _ = (I) => {
            if (!Yg(I, w) || I.target.closest("[data-flow-handle-type]")) return;
            const P = t.$data(e.closest("[x-data]"));
            if (!P || P._animationLocked || P._connectValidating) return;
            const R = o(n);
            if (!R) return;
            const U = P.getNode(R.id);
            if (!U || U.connectable === !1) return;
            I.preventDefault(), I.stopPropagation(), I.stopImmediatePropagation();
            const te = Wg(e, I.clientX, I.clientY), Q = te?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const T = e.closest(".flow-container");
            if (!T) return;
            const N = P._viewportLive ?? P.viewport, F = N?.zoom || 1, re = N?.x || 0, ce = N?.y || 0, ae = T.getBoundingClientRect();
            let X, V;
            if (te) {
              const H = te.getBoundingClientRect();
              X = (H.left + H.width / 2 - ae.left - re) / F, V = (H.top + H.height / 2 - ae.top - ce) / F;
            } else {
              const H = e.getBoundingClientRect();
              X = (H.left + H.width / 2 - ae.left - re) / F, V = (H.top + H.height / 2 - ae.top - ce) / F;
            }
            P._emit("connect-start", { source: R.id, sourceHandle: Q });
            const q = Rt({
              connectionLineType: P._config?.connectionLineType,
              connectionLineStyle: P._config?.connectionLineStyle,
              connectionLine: P._config?.connectionLine
            }), Z = T.querySelector(".flow-viewport");
            Z && Z.appendChild(q.svg), q.update({ fromX: X, fromY: V, toX: X, toY: V, source: R.id, sourceHandle: Q }), P.pendingConnection = { source: R.id, sourceHandle: Q, position: { x: X, y: V } }, rn(T, R.id, Q, P);
            let z = Jn(T, P, I.clientX, I.clientY), D = null;
            const J = P._config?.connectionSnapRadius ?? 20, G = (H) => {
              const ne = P.screenToFlowPosition(H.clientX, H.clientY), ie = sn({
                containerEl: T,
                handleType: "target",
                excludeNodeId: R.id,
                cursorFlowPos: ne,
                connectionSnapRadius: J,
                getNode: (K) => P.getNode(K),
                toFlowPosition: (K, j) => P.screenToFlowPosition(K, j)
              });
              ie.element !== D && (D?.classList.remove("flow-handle-active"), ie.element?.classList.add("flow-handle-active"), D = ie.element), q.update({ fromX: X, fromY: V, toX: ie.position.x, toY: ie.position.y, source: R.id, sourceHandle: Q }), P.pendingConnection = { ...P.pendingConnection, position: ie.position }, z?.updatePointer(H.clientX, H.clientY);
            }, W = async (H) => {
              z?.stop(), z = null, document.removeEventListener("pointermove", G), document.removeEventListener("pointerup", W), q.destroy(), D?.classList.remove("flow-handle-active"), Le(T), e.classList.remove("flow-easy-connecting");
              const ne = P.screenToFlowPosition(H.clientX, H.clientY), ie = { source: R.id, sourceHandle: Q, position: ne };
              P.pendingConnection = null;
              let K = D;
              if (K || (K = document.elementFromPoint(H.clientX, H.clientY)?.closest('[data-flow-handle-type="target"]')), !K) {
                P._emit("connect-end", { connection: null, ...ie });
                return;
              }
              const oe = K.closest("[x-flow-node]")?.dataset.flowNodeId, O = K.dataset.flowHandleId ?? "target";
              if (!oe) {
                P._emit("connect-end", { connection: null, ...ie });
                return;
              }
              const ee = { source: R.id, sourceHandle: Q, target: oe, targetHandle: O }, le = await Hr({ connection: ee, canvas: P, containerEl: T });
              P._emit("connect-end", {
                connection: le.applied ? ee : null,
                ...ie
              });
            };
            document.addEventListener("pointermove", G), document.addEventListener("pointerup", W);
          };
          e.addEventListener("pointerdown", _, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", _, { capture: !0 });
          });
        }
      }
      const $ = (L) => {
        if (L.key !== "Enter" && L.key !== " ") return;
        L.preventDefault();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        _ && (_._animationLocked || jo(w) && (_._emit("node-click", { node: w, event: L }), L.stopPropagation(), ft(L, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1) : (_.selectedNodes.add(w.id), w.selected = !0) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0), _._emitSelectionChange()));
      };
      e.addEventListener("keydown", $);
      const b = () => {
        const L = t.$data(e.closest("[x-data]"));
        if (!L?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const _ = w.parentId ? L.getAbsolutePosition(w.id) : w.position;
        L.setCenter(
          _.x + (w.dimensions?.width ?? 150) / 2,
          _.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", b);
      const E = (L) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_ && !_._animationLocked && (_._emit("node-click", { node: w, event: L }), !!jo(w))) {
          if (L.stopPropagation(), c) {
            c = !1;
            return;
          }
          ft(L, _._shortcuts?.multiSelect) ? _.selectedNodes.has(w.id) ? (_.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), B("selection", `Node "${w.id}" deselected (shift)`)) : (_.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${w.id}" selected (shift)`)) : (_.deselectAll(), _.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), B("selection", `Node "${w.id}" selected`)), _._emitSelectionChange();
        }
      };
      e.addEventListener("click", E);
      const A = (L) => {
        L.preventDefault(), L.stopPropagation();
        const w = o(n);
        if (!w) return;
        const _ = t.$data(e.closest("[x-data]"));
        if (_)
          if (_.selectedNodes.size > 1 && _.selectedNodes.has(w.id)) {
            const I = _.nodes.filter((P) => _.selectedNodes.has(P.id));
            _._emit("selection-context-menu", { nodes: I, event: L });
          } else
            _._emit("node-context-menu", { node: w, event: L });
      };
      e.addEventListener("contextmenu", A), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const L = o(n);
        if (!L) return;
        const w = t.$data(e.closest("[x-data]"));
        L.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, B("init", `Node "${L.id}" measured`, L.dimensions), w?._nodeElements?.set(L.id, e), L.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), f?.remove(), f = null, h?.destroy(), h = null, e.removeEventListener("keydown", $), e.removeEventListener("focus", b), e.removeEventListener("click", E), e.removeEventListener("contextmenu", A);
        const L = e.dataset.flowNodeId;
        if (L) {
          const w = t.$data(e.closest("[x-data]"));
          w?._nodeElements?.delete(L), w?._resizeObserver?.unobserve(e);
        }
      });
    }
  );
}
const kt = {
  minWidth: 30,
  minHeight: 30,
  maxWidth: 1 / 0,
  maxHeight: 1 / 0
};
function Zg(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), u = t.includes("right"), f = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  u ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : f && (g = o.height - e.y), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)));
  const y = p - o.width, m = g - o.height, x = d ? n.x - y : n.x, M = f ? n.y - m : n.y;
  return {
    position: { x, y: M },
    dimensions: { width: p, height: g }
  };
}
const aa = ["top-left", "top-right", "bottom-left", "bottom-right"], la = ["top", "right", "bottom", "left"], Kg = [...aa, ...la], Gg = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function Jg(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Qg(o);
      let a = { ...kt };
      if (n)
        try {
          const d = i(n);
          a = { ...kt, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const u = document.createElement("div");
        u.className = `flow-resizer-handle flow-resizer-handle-${d}`, u.style.cursor = Gg[d], u.dataset.flowResizeDirection = d, e.appendChild(u), c.push(u), u.addEventListener("pointerdown", (f) => {
          f.preventDefault(), f.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), y = h.dataset.flowNodeId;
          if (!y || !g) return;
          const m = g.getNode(y);
          if (!m || !is(m)) return;
          m.fixedDimensions = !0;
          const x = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === kt.minWidth && (x.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === kt.minHeight && (x.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === kt.maxWidth && (x.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === kt.maxHeight && (x.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const E = g.viewport?.zoom || 1, A = h.getBoundingClientRect();
            m.dimensions = { width: A.width / E, height: A.height / E };
          }
          const M = { x: m.position.x, y: m.position.y }, v = { width: m.dimensions.width, height: m.dimensions.height }, C = g.viewport?.zoom || 1, S = f.clientX, k = f.clientY;
          g._captureHistory?.(), B("resize", `Resize start on "${y}" (${d})`, v), g._emit("node-resize-start", { node: m, dimensions: { ...v } });
          const $ = (E) => {
            const A = {
              x: (E.clientX - S) / C,
              y: (E.clientY - k) / C
            }, L = Zg(
              d,
              A,
              M,
              v,
              x,
              g._config?.snapToGrid ?? !1
            );
            if (m.position.x = L.position.x, m.position.y = L.position.y, m.dimensions.width = L.dimensions.width, m.dimensions.height = L.dimensions.height, m.parentId) {
              const w = g.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${L.position.x}px`, h.style.top = `${L.position.y}px`;
            h.style.width = `${L.dimensions.width}px`, h.style.height = `${L.dimensions.height}px`, g._layoutAnimTick++, g._emit("node-resize", { node: m, dimensions: { ...L.dimensions } });
          }, b = () => {
            document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", b), document.removeEventListener("pointercancel", b), B("resize", `Resize end on "${y}"`, m.dimensions), g._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", $), document.addEventListener("pointerup", b), document.addEventListener("pointercancel", b);
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
        const g = !is(p);
        for (const y of c)
          y.style.display = g ? "none" : "";
      }), s(() => {
        for (const d of c)
          d.remove();
      });
    }
  );
}
function Qg(t) {
  if (t.includes("corners"))
    return aa;
  if (t.includes("edges"))
    return la;
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
  return Kg;
}
function ep(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function tp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function np(t) {
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
        const M = (C) => {
          let S = ep(
            C.clientX,
            C.clientY,
            m,
            x
          );
          l && (S = tp(S, a)), g.rotation = S;
        }, v = () => {
          document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", v), e.style.cursor = "grab", h._emit("node-rotate-end", { node: g, rotation: g.rotation });
        };
        document.addEventListener("pointermove", M), document.addEventListener("pointerup", v);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function op(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const ip = "application/alpineflow";
function sp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(ip, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function rp(t) {
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
function ap(t) {
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
          const g = rp(
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
          const m = i.getNode?.(g.source), x = i.getNode?.(g.target), M = g.hidden || g._hiddenByCollapse || m?.hidden || x?.hidden;
          y.style.display = M ? "none" : "";
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
const lp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], cp = "a, button, input, textarea, select, [contenteditable]", dp = 100, up = 60, fp = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), hp = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), gp = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), pp = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function mp(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && lp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function Lt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function yp(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function wp(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (fp.has(e) && (t.style.top = "0"), hp.has(e) && (t.style.bottom = "0")), o && !n && (gp.has(e) && (t.style.left = "0"), pp.has(e) && (t.style.right = "0"));
}
function vp(t) {
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
      } = mp(n, o), f = d || u, h = !s && !l && !f, p = !s && !a && !f;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || f) && e.classList.add("flow-panel-locked"), (a || f) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), u && e.classList.add("flow-panel-fill-height"), f && wp(e, r, d, u);
      const g = (C) => C.stopPropagation();
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
      }, x = `flow-panel-${r}`, M = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(x) || e.classList.add(x);
      };
      y.addEventListener("flow-panel-reset", M), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let v = null;
      if (h) {
        let C = !1, S = 0, k = 0, $ = 0, b = 0;
        const E = () => {
          const _ = e.getBoundingClientRect(), I = y.getBoundingClientRect();
          return {
            x: _.left - I.left,
            y: _.top - I.top
          };
        }, A = (_) => {
          if (!C) return;
          let I = $ + (_.clientX - S), P = b + (_.clientY - k);
          if (c) {
            const R = yp(
              I,
              P,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            I = R.left, P = R.top;
          }
          e.style.left = `${I}px`, e.style.top = `${P}px`, Lt(y, "panel-drag", {
            panel: e,
            position: { x: I, y: P }
          });
        }, L = () => {
          if (!C) return;
          C = !1, document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L);
          const _ = E();
          Lt(y, "panel-drag-end", {
            panel: e,
            position: _
          });
        }, w = (_) => {
          const I = _.target;
          if (I.closest(cp) || I.closest(".flow-panel-resize-handle"))
            return;
          C = !0, S = _.clientX, k = _.clientY;
          const P = e.getBoundingClientRect(), R = y.getBoundingClientRect();
          $ = P.left - R.left, b = P.top - R.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${$}px`, e.style.top = `${b}px`, document.addEventListener("pointermove", A), document.addEventListener("pointerup", L), document.addEventListener("pointercancel", L), Lt(y, "panel-drag-start", {
            panel: e,
            position: { x: $, y: b }
          });
        };
        if (e.addEventListener("pointerdown", w), p) {
          v = document.createElement("div"), v.classList.add("flow-panel-resize-handle"), e.appendChild(v);
          let _ = !1, I = 0, P = 0, R = 0, U = 0;
          const te = (N) => {
            if (!_) return;
            const F = Math.max(dp, R + (N.clientX - I)), re = Math.max(up, U + (N.clientY - P));
            e.style.width = `${F}px`, e.style.height = `${re}px`, Lt(y, "panel-resize", {
              panel: e,
              dimensions: { width: F, height: re }
            });
          }, Q = () => {
            _ && (_ = !1, document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", Q), document.removeEventListener("pointercancel", Q), Lt(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, T = (N) => {
            N.stopPropagation(), _ = !0, I = N.clientX, P = N.clientY, R = e.offsetWidth, U = e.offsetHeight, document.addEventListener("pointermove", te), document.addEventListener("pointerup", Q), document.addEventListener("pointercancel", Q), Lt(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: R, height: U }
            });
          };
          v.addEventListener("pointerdown", T), i(() => {
            e.removeEventListener("pointerdown", w), v?.removeEventListener("pointerdown", T), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", Q), document.removeEventListener("pointercancel", Q), v?.remove(), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", L), document.removeEventListener("pointercancel", L), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", M), y.__flowPanels?.delete(e);
        });
    }
  );
}
function _p(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = bp(n), l = xp(o);
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
        const h = f.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, y = g ? f.getNode(g) : null, m = y?.dimensions?.width ?? d.offsetWidth, x = y?.dimensions?.height ?? d.offsetHeight, M = p / h;
        let v, C, S, k;
        s === "top" || s === "bottom" ? (C = s === "top" ? -M : x + M, k = s === "top" ? "-100%" : "0%", l === "start" ? (v = 0, S = "0%") : l === "end" ? (v = m, S = "-100%") : (v = m / 2, S = "-50%")) : (v = s === "left" ? -M : m + M, S = s === "left" ? "-100%" : "0%", l === "start" ? (C = 0, k = "0%") : l === "end" ? (C = x, k = "-100%") : (C = x / 2, k = "-50%")), e.style.left = `${v}px`, e.style.top = `${C}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${S}, ${k})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function bp(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function xp(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function Ep(t) {
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
        const $ = a.getBoundingClientRect(), b = window.innerWidth, E = window.innerHeight;
        let A = S, L = k;
        $.right > b - g && (A = b - $.width - g), $.bottom > E - g && (L = E - $.height - g), A < g && (A = g), L < g && (L = g), a.style.left = A + "px", a.style.top = L + "px", h.style.display = "", a.focus({ preventScroll: !0 });
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
      const M = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), v = (S) => Array.from(S.querySelectorAll(
        "button:not([disabled])"
      )), C = (S) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const k = document.activeElement, $ = k?.closest(".flow-context-submenu"), b = $ ? v($) : M();
        if (b.length === 0) return;
        const E = b.indexOf(k);
        switch (S.key) {
          case "ArrowDown": {
            S.preventDefault();
            const A = E < b.length - 1 ? E + 1 : 0;
            b[A].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            S.preventDefault();
            const A = E > 0 ? E - 1 : b.length - 1;
            b[A].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (S.preventDefault(), S.shiftKey) {
              const A = E > 0 ? E - 1 : b.length - 1;
              b[A].focus({ preventScroll: !0 });
            } else {
              const A = E < b.length - 1 ? E + 1 : 0;
              b[A].focus({ preventScroll: !0 });
            }
            break;
          }
          case "Enter":
          case " ": {
            S.preventDefault(), k?.click();
            break;
          }
          case "ArrowRight": {
            if (!$) {
              const A = k?.querySelector(".flow-context-submenu");
              A && (S.preventDefault(), A.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            $ && (S.preventDefault(), $.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", C), s(() => {
        h.remove(), window.removeEventListener("scroll", x, !0), a.removeEventListener("keydown", C);
      });
    }
  );
}
const Cp = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function Sp(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), u = a.has("queue"), f = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let p = null, g = [], y = !1, m = !1, x = !1;
      function M() {
        const A = r(i);
        return Array.isArray(A) ? A : A && typeof A == "object" ? [A] : [];
      }
      function v() {
        const A = e.closest("[x-data]");
        return A ? t.$data(A) : null;
      }
      function C(A, L = !1) {
        const w = v();
        if (!w?.timeline) return Promise.resolve();
        const _ = w.timeline();
        if (L) {
          for (let I = A.length - 1; I >= 0; I--)
            _.step(A[I]);
          _.reverse();
        } else
          for (const I of A)
            I.parallel ? _.parallel(I.parallel) : _.step(I);
        return p = _, _.play().then(() => {
          p === _ && (p = null);
        });
      }
      function S(A = !1) {
        if (c && m) return;
        m = !0;
        const L = M();
        if (L.length === 0) return;
        const w = () => C(L, A);
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
          const A = M(), L = v();
          L?.registerAnimation && L.registerAnimation(f, A);
        }), l(() => {
          const A = v();
          A?.unregisterAnimation && A.unregisterAnimation(f);
        });
        return;
      }
      const $ = () => {
        d && h === "click" ? (S(x), x = !x) : S(!1);
      };
      e.addEventListener(h, $);
      let b = null, E = null;
      d && h !== "click" && (E = Cp[h] ?? null, E && (b = () => S(!0), e.addEventListener(E, b))), l(() => {
        p?.stop(), e.removeEventListener(h, $), E && b && e.removeEventListener(E, b);
      });
    }
  );
}
function kp(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? _e, a = t.dimensions?.height ?? be, c = r * n.zoom + n.x, d = s * n.zoom + n.y, u = (r + l) * n.zoom + n.x, f = (s + a) * n.zoom + n.y;
  return u > 0 && c < o && f > 0 && d < i;
}
function Lp(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !kp(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function Pp(t) {
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
        const M = x.timeline(), v = m.speed ?? 1, C = m.autoFitView === !0, S = m.fitViewPadding ?? 0.1, k = x.viewport, $ = x.getContainerDimensions?.();
        for (const b of y) {
          const E = v !== 1 ? {
            ...b,
            duration: b.duration !== void 0 ? b.duration / v : void 0,
            delay: b.delay !== void 0 ? b.delay / v : void 0
          } : b;
          if (E.parallel) {
            const A = E.parallel.map(
              (L) => v !== 1 ? {
                ...L,
                duration: L.duration !== void 0 ? L.duration / v : void 0,
                delay: L.delay !== void 0 ? L.delay / v : void 0
              } : L
            );
            M.parallel(A);
          } else if (C && k && $ && Lp(E, x, k, $.width, $.height)) {
            const A = {
              fitView: !0,
              fitViewPadding: S,
              duration: E.duration,
              easing: E.easing
            };
            M.parallel([E, A]);
          } else
            M.step(E);
        }
        if (m.lock && M.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const b = m.loop === !0 ? 0 : m.loop;
          M.loop(b);
        }
        return m.respectReducedMotion !== void 0 && M.respectReducedMotion(m.respectReducedMotion), l = M, d = "playing", c = !0, M.play().then(() => {
          l === M && (l = null, d = "idle", c = !1);
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
          s += x.length, a = [], c && await new Promise((v) => {
            l ? (l.on("complete", () => v()), l.on("stop", () => v())) : v();
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
          const M = m.slice(Math.max(s, u));
          u = m.length, M.length > 0 && x && (a.push(...M), p(y));
        } else
          u = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function Mp(t) {
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
function Tp(t) {
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
function Mo(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Ap(t) {
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
      d && u || (Mo(s), f.clear(), d = document.createElement("div"), d.className = "flow-schema-header", s.appendChild(d), u = document.createElement("div"), u.className = "flow-schema-body", s.appendChild(u));
    }, p = () => {
      const m = l(), x = m?.data;
      if (!x) {
        for (const E of f.values())
          t.destroyTree(E);
        f.clear(), Mo(s), d = null, u = null;
        return;
      }
      h();
      const M = typeof x.label == "string" ? x.label : "", v = Array.isArray(x.fields) ? x.fields : [], C = typeof m?.id == "string" ? m.id : "";
      typeof x.kind == "string" && x.kind ? s.setAttribute("data-flow-schema-kind", x.kind) : s.removeAttribute("data-flow-schema-kind"), d.textContent !== M && (d.textContent = M);
      const S = a(), k = c(), $ = /* @__PURE__ */ new Set();
      for (const E of v) {
        $.add(E.name);
        const A = f.get(E.name);
        if (A)
          g(A, E);
        else {
          const L = y(E, C, S, k);
          f.set(E.name, L), u.appendChild(L), t.initTree(L);
        }
      }
      for (const [E, A] of f)
        $.has(E) || (t.destroyTree(A), A.remove(), f.delete(E));
      let b = u.firstChild;
      for (const E of v) {
        const A = f.get(E.name);
        A && (b === A ? b = b.nextSibling : u.insertBefore(A, b));
      }
    }, g = (m, x) => {
      m.dataset.flowSchemaField !== x.name && (m.dataset.flowSchemaField = x.name), m.classList.toggle("flow-schema-row--pk", x.key === "primary"), m.classList.toggle("flow-schema-row--fk", x.key === "foreign"), m.classList.toggle("flow-schema-row--required", !!x.required);
      let M = m.querySelector(".flow-schema-row-icon");
      const v = m.querySelector(".flow-schema-row-name");
      x.icon ? (M || (M = document.createElement("span"), M.className = "flow-schema-row-icon", m.insertBefore(M, v)), M.textContent !== x.icon && (M.textContent = x.icon)) : M && M.remove(), v && v.textContent !== x.name && (v.textContent = x.name);
      const C = m.querySelector(".flow-schema-row-type");
      C && C.textContent !== x.type && (C.textContent = x.type);
    }, y = (m, x, M, v) => {
      const C = document.createElement("div");
      C.className = "flow-schema-row", C.dataset.flowSchemaField = m.name, m.key === "primary" && C.classList.add("flow-schema-row--pk"), m.key === "foreign" && C.classList.add("flow-schema-row--fk"), m.required && C.classList.add("flow-schema-row--required"), x && C.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${x}.${m.name}`)
      ), M && C.setAttribute("x-schema-reorderable", ""), v && x && C.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${x}.${m.name}`)
      );
      const S = document.createElement("div");
      if (S.className = "flow-schema-handle flow-schema-handle--target", S.setAttribute("x-flow-handle:target.left", JSON.stringify(m.name)), C.appendChild(S), m.icon) {
        const L = document.createElement("span");
        L.className = "flow-schema-row-icon", L.textContent = m.icon, C.appendChild(L);
      }
      const k = document.createElement("span");
      k.className = "flow-schema-row-name", k.textContent = m.name, C.appendChild(k);
      const $ = document.createElement("span");
      $.className = "flow-schema-row-type", $.textContent = m.type, C.appendChild($);
      const b = document.createElement("div");
      b.className = "flow-schema-handle flow-schema-handle--source", b.setAttribute("x-flow-handle:source.right", JSON.stringify(m.name)), C.appendChild(b);
      const E = document.createElement("div");
      E.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", E.setAttribute("x-flow-handle:target.right", JSON.stringify(m.name)), C.appendChild(E);
      const A = document.createElement("div");
      return A.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", A.setAttribute("x-flow-handle:source.left", JSON.stringify(m.name)), C.appendChild(A), C;
    };
    i(() => {
      if (!s.isConnected) return;
      const m = l()?.data;
      m?.label, m?.kind;
      const x = m?.fields;
      if (Array.isArray(x))
        for (const M of x)
          M.name, M.type, M.key, M.required, M.icon;
      p();
    }), r(() => {
      for (const m of f.values())
        t.destroyTree(m);
      f.clear(), Mo(s), d = null, u = null, s.classList.remove("flow-schema-node");
    });
  });
}
function Np(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function As(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function $p(t) {
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
      As(s);
      const d = l()?.data;
      if (!d) return;
      const u = typeof d.label == "string" && d.label ? d.label : "Wait", f = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, p = document.createElement("div");
      if (p.className = "flow-wait-header", f) {
        const M = document.createElement("span");
        M.className = "flow-wait-icon", M.textContent = f, p.appendChild(M);
      }
      const g = document.createElement("span");
      g.className = "flow-wait-label", g.textContent = u, p.appendChild(g);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = Np(h), p.appendChild(y), s.appendChild(p);
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
      As(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Ns = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function on(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(on).join(", ")}]` : String(t);
}
function Ip(t) {
  const { field: e, op: n, value: o } = t;
  return n in Ns ? `${e} ${Ns[n]} ${on(o)}` : n === "in" ? `${e} in ${on(o)}` : n === "notIn" ? `${e} not in ${on(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${on(o)}`;
}
function $s(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Dp(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Rp(t) {
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
      const u = l()?.data ?? {}, f = Dp(a(), u.direction);
      s.setAttribute("data-flow-condition-direction", f);
      const h = u._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), $s(s);
      const p = typeof u.label == "string" && u.label ? u.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const y = document.createElement("div");
      y.className = "flow-condition-body", u.condition && typeof u.condition == "object" ? y.textContent = Ip(u.condition) : typeof u.evaluate == "function" ? y.textContent = typeof u.evaluateLabel == "string" && u.evaluateLabel ? u.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const x = document.createElement("div");
      x.className = "flow-condition-handle-source flow-condition-handle--true", x.setAttribute("data-flow-handle-direction", "source"), x.setAttribute("data-source-handle", "true"), x.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(x);
      const M = document.createElement("div");
      M.className = "flow-condition-handle-source flow-condition-handle--false", M.setAttribute("data-flow-handle-direction", "source"), M.setAttribute("data-source-handle", "false"), M.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(M), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      $s(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Hp(t) {
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
function Fp(t) {
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
const Op = ["perf", "events", "viewport", "state", "activity"], Is = ["fps", "memory", "counts", "visible"], Ds = 30;
function zp(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Op.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Vp(t) {
  return t.perf ? t.perf === !0 ? [...Is] : t.perf.filter((e) => Is.includes(e)) : [];
}
function Bp(t) {
  return t.events ? t.events === !0 ? Ds : t.events.max ?? Ds : 0;
}
function Jt(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-section ${e}`;
  const o = document.createElement("div");
  o.className = "flow-devtools-section-title", o.textContent = t, n.appendChild(o);
  const i = document.createElement("div");
  return i.className = "flow-devtools-section-content", n.appendChild(i), { wrapper: n, content: i };
}
function ze(t, e) {
  const n = document.createElement("div");
  n.className = `flow-devtools-row ${e}`;
  const o = document.createElement("span");
  o.className = "flow-devtools-label", o.textContent = t;
  const i = document.createElement("span");
  return i.className = "flow-devtools-value", i.textContent = "—", n.appendChild(o), n.appendChild(i), { row: n, valueEl: i };
}
function qp(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = zp(l, o), c = e.closest("[x-data]");
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
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      p.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(p), f.appendChild(h), e.appendChild(f);
      const g = document.createElement("div");
      g.className = "flow-devtools-panel", g.style.display = "none", g.style.userSelect = "none", e.appendChild(g);
      let y = !1;
      const m = () => {
        y = !y, g.style.display = y ? "" : "none", f.title = y ? "Collapse" : "Devtools", y ? re() : ce();
      };
      f.addEventListener("click", m);
      const x = Vp(a);
      let M = null, v = null, C = null, S = null, k = null;
      if (x.length > 0) {
        const { wrapper: q, content: Z } = Jt("Performance", "flow-devtools-perf");
        if (x.includes("fps")) {
          const { row: z, valueEl: D } = ze("FPS", "flow-devtools-fps");
          M = D, Z.appendChild(z);
        }
        if (x.includes("memory")) {
          const { row: z, valueEl: D } = ze("Memory", "flow-devtools-memory");
          v = D, Z.appendChild(z);
        }
        if (x.includes("counts")) {
          const z = ze("Nodes", "flow-devtools-counts");
          C = z.valueEl, Z.appendChild(z.row);
          const D = ze("Edges", "flow-devtools-counts");
          S = D.valueEl, Z.appendChild(D.row);
        }
        if (x.includes("visible")) {
          const { row: z, valueEl: D } = ze("Visible", "flow-devtools-visible");
          k = D, Z.appendChild(z);
        }
        g.appendChild(q);
      }
      const $ = Bp(a);
      let b = null;
      if ($ > 0) {
        const { wrapper: q, content: Z } = Jt("Events", "flow-devtools-events"), z = document.createElement("button");
        z.className = "flow-devtools-clear-btn nopan", z.textContent = "Clear", z.addEventListener("click", () => {
          b && (b.textContent = ""), ae.length = 0;
        }), q.querySelector(".flow-devtools-section-title").appendChild(z), b = document.createElement("div"), b.className = "flow-devtools-event-list", Z.appendChild(b), g.appendChild(q);
      }
      let E = null, A = null, L = null;
      if (a.viewport) {
        const { wrapper: q, content: Z } = Jt("Viewport", "flow-devtools-viewport"), z = ze("X", "flow-devtools-vp-x");
        E = z.valueEl, Z.appendChild(z.row);
        const D = ze("Y", "flow-devtools-vp-y");
        A = D.valueEl, Z.appendChild(D.row);
        const J = ze("Zoom", "flow-devtools-vp-zoom");
        L = J.valueEl, Z.appendChild(J.row), g.appendChild(q);
      }
      let w = null;
      if (a.state) {
        const { wrapper: q, content: Z } = Jt("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", Z.appendChild(w), g.appendChild(q);
      }
      let _ = null, I = null, P = null, R = null;
      if (a.activity) {
        const { wrapper: q, content: Z } = Jt("Activity", "flow-devtools-activity"), z = ze("Animations", "flow-devtools-anim");
        _ = z.valueEl, Z.appendChild(z.row);
        const D = ze("Particles", "flow-devtools-particles");
        I = D.valueEl, Z.appendChild(D.row);
        const J = ze("Follow", "flow-devtools-follow");
        P = J.valueEl, Z.appendChild(J.row);
        const G = ze("Timelines", "flow-devtools-timelines");
        R = G.valueEl, Z.appendChild(G.row), g.appendChild(q);
      }
      let U = null, te = !1, Q = 0, T = performance.now();
      const N = !!(M || v), F = () => {
        if (!te) return;
        Q++;
        const q = performance.now();
        q - T >= 1e3 && (M && (M.textContent = String(Math.round(Q * 1e3 / (q - T)))), Q = 0, T = q, v && performance.memory && (v.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), U = requestAnimationFrame(F);
      }, re = () => {
        !N || te || (te = !0, Q = 0, T = performance.now(), U = requestAnimationFrame(F));
      }, ce = () => {
        te = !1, U !== null && (cancelAnimationFrame(U), U = null);
      }, ae = [], X = [
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
      let V = null;
      if ($ > 0 && b) {
        V = (q) => {
          if (!y) return;
          const Z = q, z = Z.type.replace("flow-", "");
          let D = "";
          try {
            D = Z.detail ? JSON.stringify(Z.detail).slice(0, 80) : "";
          } catch {
            D = "[circular]";
          }
          ae.unshift({ name: z, time: Date.now(), detail: D });
          const J = b, G = document.createElement("div");
          G.className = "flow-devtools-event-entry";
          const W = document.createElement("span");
          W.className = "flow-devtools-event-name", W.textContent = z;
          const H = document.createElement("span");
          H.className = "flow-devtools-event-age", H.textContent = "now";
          const ne = document.createElement("span");
          for (ne.className = "flow-devtools-event-detail", ne.textContent = D, G.appendChild(W), G.appendChild(H), G.appendChild(ne), J.prepend(G); J.children.length > $; )
            J.removeChild(J.lastChild), ae.pop();
        };
        for (const q of X)
          d.addEventListener(q, V);
      }
      r(() => {
        const q = t.$data(c);
        !q || !q.viewport || (E && (E.textContent = Math.round(q.viewport.x).toString()), A && (A.textContent = Math.round(q.viewport.y).toString()), L && (L.textContent = q.viewport.zoom.toFixed(2)));
      }), r(() => {
        const q = t.$data(c);
        if (q) {
          if (C && (C.textContent = String(q.nodes?.length ?? 0)), S && (S.textContent = String(q.edges?.length ?? 0)), k && q._getVisibleNodeIds && (k.textContent = String(q._getVisibleNodeIds().size)), w) {
            const Z = q.selectedNodes, z = q.selectedEdges;
            if (!((Z?.size ?? 0) > 0 || (z?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", Z && Z.size > 0)
                for (const J of Z) {
                  const G = q.getNode?.(J);
                  if (!G) continue;
                  const W = document.createElement("pre");
                  W.className = "flow-devtools-json", W.textContent = JSON.stringify({ id: G.id, position: G.position, data: G.data }, null, 2), w.appendChild(W);
                }
              if (z && z.size > 0)
                for (const J of z) {
                  const G = q.edges?.find((H) => H.id === J);
                  if (!G) continue;
                  const W = document.createElement("pre");
                  W.className = "flow-devtools-json", W.textContent = JSON.stringify({ id: G.id, source: G.source, target: G.target, type: G.type }, null, 2), w.appendChild(W);
                }
            }
          }
          if (_) {
            const Z = q._animator?._groups?.size ?? 0;
            _.textContent = String(Z);
          }
          I && (I.textContent = String(q._activeParticles?.size ?? 0)), P && (P.textContent = q._followHandle ? "Active" : "Idle"), R && (R.textContent = String(q._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ce(), f.removeEventListener("click", m), V)
          for (const q of X)
            d.removeEventListener(q, V);
        e.removeEventListener("wheel", u), e.textContent = "", M = null, v = null, C = null, S = null, k = null, b = null, E = null, A = null, L = null, w = null, _ = null, I = null, P = null, R = null;
      });
    }
  );
}
const Xp = {
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
function Yp(t) {
  return Xp[t] ?? null;
}
function Wp(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = Yp(n);
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
function jp(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const To = /* @__PURE__ */ new WeakMap();
function Up(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = jp(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let u = null;
      const f = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), To.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          u = r(`[${o}]`)[0], d.setNodeFilter(u), To.set(c, u);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", f), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = To.get(c) === u && u !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Zp(t) {
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
function Kp(t) {
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
        const h = i(n), p = Zp(h);
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
function Gp(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const Ei = /* @__PURE__ */ new Map();
function Jp(t, e) {
  Ei.set(t, e);
}
function Qp(t) {
  return Ei.get(t) ?? null;
}
function em(t) {
  return Ei.has(t);
}
function Ao(t) {
  return `alpineflow-snapshot-${t}`;
}
function tm(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Gp(n, i);
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
            a.persist ? localStorage.setItem(Ao(f), JSON.stringify(h)) : Jp(f, h);
          } else {
            let h = null;
            if (a.persist) {
              const p = localStorage.getItem(Ao(f));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = Qp(f);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", u), a.action === "restore" && s(() => {
        if (!o) return;
        const f = r(o);
        if (!f) return;
        let h;
        a.persist ? h = localStorage.getItem(Ao(f)) !== null : (d.nodes.length, h = em(f)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function nm(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function om(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(nm(s._loadingText));
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
function im(t) {
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
        if (!d.edges.some((b) => b.id === a)) {
          e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let x = 0.5;
        if (n) {
          const b = i(n);
          typeof b == "number" && (x = b);
        }
        const M = l.querySelectorAll("path"), v = M.length > 1 ? M[1] : M[0];
        if (!v) return;
        const C = v.getTotalLength?.();
        if (!C) return;
        const S = v.getPointAtLength(C * Math.max(0, Math.min(1, x))), k = m / y, $ = p ? k : -k;
        e.style.left = `${S.x}px`, e.style.top = `${S.y + $}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", f), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function sm(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function rm(t) {
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
function py(t, e, n) {
  const o = n?.defaultDimensions?.width ?? _e, i = n?.defaultDimensions?.height ?? be, r = n?.padding ?? 20, s = n?.flowId ?? "ssr", a = t.filter((m) => !m.hidden).map((m) => ({
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
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([x, M]) => `${x}:${M}`).join(";")
    } : {},
    data: m.data ?? {}
  })), u = e.filter((m) => !m.hidden), f = [], h = /* @__PURE__ */ new Map();
  for (const m of u) {
    const x = c.get(m.source), M = c.get(m.target);
    if (!x || !M)
      continue;
    let v, C;
    try {
      const E = io(
        m,
        x,
        M,
        x.sourcePosition ?? "bottom",
        M.targetPosition ?? "top"
      );
      v = E.path, C = E.labelPosition;
    } catch {
      continue;
    }
    let S, k;
    if (m.markerStart) {
      const E = It(m.markerStart), A = Dt(E, s);
      h.has(A) || h.set(A, Kn(E, A)), S = `url(#${A})`;
    }
    if (m.markerEnd) {
      const E = It(m.markerEnd), A = Dt(E, s);
      h.has(A) || h.set(A, Kn(E, A)), k = `url(#${A})`;
    }
    let $, b;
    if (m.label)
      if (C)
        $ = C.x, b = C.y;
      else {
        const E = x.position.x + x.dimensions.width / 2, A = x.position.y + x.dimensions.height / 2, L = M.position.x + M.dimensions.width / 2, w = M.position.y + M.dimensions.height / 2;
        $ = (E + L) / 2, b = (A + w) / 2;
      }
    f.push({
      id: m.id,
      source: m.source,
      target: m.target,
      pathD: v,
      ...S ? { markerStart: S } : {},
      ...k ? { markerEnd: k } : {},
      ...m.class ? { class: m.class } : {},
      ...m.label ? { label: m.label } : {},
      ...$ !== void 0 ? { labelX: $ } : {},
      ...b !== void 0 ? { labelY: b } : {}
    });
  }
  const p = Array.from(h.values()).join(`
`);
  let g, y;
  if (a.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = Vt(a);
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
const Rs = /* @__PURE__ */ new WeakSet();
function my(t) {
  Rs.has(t) || (Rs.add(t), _a(t), rm(t), Hg(t), Ug(t), Cf(t), gf(t), pf(t), mf(t), Ng(t), Jg(t), np(t), op(t), sp(t), ap(t), vp(t), _p(t), Ep(t), Sp(t), Pp(t), Mp(t), Tp(t), Hp(t), Fp(t), qp(t), Wp(t), Up(t), Kp(t), tm(t), om(t), im(t), Ap(t), $p(t), Rp(t), sm(t));
}
function am(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function lm(t, e, n, o) {
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
async function cm(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => ry));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), u = e.style.transform, f = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const E = t.querySelectorAll("[data-flow-culled]");
      for (const I of E)
        I.style.display = "", m.push(I);
      const A = n.filter((I) => !I.hidden), L = Vt(A), w = i.padding ?? 0.1, _ = jn(
        L,
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
    const x = i.includeOverlays, M = x === !0, v = typeof x == "object" ? x : {}, C = [
      ["canvas-overlay", M || (v.toolbar ?? !1)],
      ["flow-minimap", M || (v.minimap ?? !1)],
      ["flow-controls", M || (v.controls ?? !1)],
      ["flow-panel", M || (v.panels ?? !1)],
      ["flow-selection-box", !1]
    ], S = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (E) => {
        if (E.classList) {
          for (const [A, L] of C)
            if (E.classList.contains(A) && !L) return !1;
        }
        return !0;
      }
    }), $ = am(decodeURIComponent(S.substring("data:image/svg+xml;charset=utf-8,".length))), b = await lm($, a, c, d);
    if (i.filename) {
      const E = document.createElement("a");
      E.download = i.filename, E.href = b, E.click();
    }
    return b;
  } finally {
    e.style.transform = u, e.style.width = f, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = y;
    for (const x of m)
      x.style.display = "none";
  }
}
const dm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: cm
}, Symbol.toStringTag, { value: "Module" }));
function um(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const fm = /* @__PURE__ */ (() => {
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
let Pt = null;
function ca(t = {}) {
  return Pt || (t.includeStyleProperties ? (Pt = t.includeStyleProperties, Pt) : (Pt = gt(window.getComputedStyle(document.documentElement)), Pt));
}
function ao(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function hm(t) {
  const e = ao(t, "border-left-width"), n = ao(t, "border-right-width");
  return t.clientWidth + e + n;
}
function gm(t) {
  const e = ao(t, "border-top-width"), n = ao(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function Ci(t, e = {}) {
  const n = e.width || hm(t), o = e.height || gm(t);
  return { width: n, height: o };
}
function pm() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Ie = 16384;
function mm(t) {
  (t.width > Ie || t.height > Ie) && (t.width > Ie && t.height > Ie ? t.width > t.height ? (t.height *= Ie / t.width, t.width = Ie) : (t.width *= Ie / t.height, t.height = Ie) : t.width > Ie ? (t.height *= Ie / t.width, t.width = Ie) : (t.width *= Ie / t.height, t.height = Ie));
}
function ym(t, e = {}) {
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
async function wm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function vm(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), wm(i);
}
const Ne = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || Ne(n, e);
};
function _m(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function bm(t, e) {
  return ca(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function xm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? _m(n) : bm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Hs(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = fm();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(xm(s, n, i, o)), e.appendChild(l);
}
function Em(t, e, n) {
  Hs(t, e, ":before", n), Hs(t, e, ":after", n);
}
const Fs = "application/font-woff", Os = "image/jpeg", Cm = {
  woff: Fs,
  woff2: Fs,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Os,
  jpeg: Os,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Sm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Si(t) {
  const e = Sm(t).toLowerCase();
  return Cm[e] || "";
}
function km(t) {
  return t.split(/,/)[1];
}
function ni(t) {
  return t.search(/^(data:)/) !== -1;
}
function Lm(t, e) {
  return `data:${e};base64,${t}`;
}
async function da(t, e, n) {
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
const No = {};
function Pm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function ki(t, e, n) {
  const o = Pm(t, e, n.includeQueryParams);
  if (No[o] != null)
    return No[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await da(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), km(l)));
    i = Lm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return No[o] = i, i;
}
async function Mm(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : lo(e);
}
async function Tm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return lo(l);
  }
  const n = t.poster, o = Si(n), i = await ki(n, o, e);
  return lo(i);
}
async function Am(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await po(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function Nm(t, e) {
  return Ne(t, HTMLCanvasElement) ? Mm(t) : Ne(t, HTMLVideoElement) ? Tm(t, e) : Ne(t, HTMLIFrameElement) ? Am(t, e) : t.cloneNode(ua(t));
}
const $m = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", ua = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function Im(t, e, n) {
  var o, i;
  if (ua(e))
    return e;
  let r = [];
  return $m(t) && t.assignedNodes ? r = gt(t.assignedNodes()) : Ne(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = gt(t.contentDocument.body.childNodes) : r = gt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || Ne(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => po(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Dm(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : ca(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), Ne(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Rm(t, e) {
  Ne(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Ne(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Hm(t, e) {
  if (Ne(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function Fm(t, e, n) {
  return Ne(e, Element) && (Dm(t, e, n), Em(t, e, n), Rm(t, e), Hm(t, e)), e;
}
async function Om(t, e) {
  const n = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (n.length === 0)
    return t;
  const o = {};
  for (let r = 0; r < n.length; r++) {
    const l = n[r].getAttribute("xlink:href");
    if (l) {
      const a = t.querySelector(l), c = document.querySelector(l);
      !a && c && !o[l] && (o[l] = await po(c, e, !0));
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
async function po(t, e, n) {
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => Nm(o, e)).then((o) => Im(t, o, e)).then((o) => Fm(t, o, e)).then((o) => Om(o, e));
}
const fa = /url\((['"]?)([^'"]+?)\1\)/g, zm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Vm = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Bm(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function qm(t) {
  const e = [];
  return t.replace(fa, (n, o, i) => (e.push(i), n)), e.filter((n) => !ni(n));
}
async function Xm(t, e, n, o, i) {
  try {
    const r = n ? um(e, n) : e, s = Si(e);
    let l;
    return i || (l = await ki(r, s, o)), t.replace(Bm(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function Ym(t, { preferredFontFormat: e }) {
  return e ? t.replace(Vm, (n) => {
    for (; ; ) {
      const [o, , i] = zm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function ha(t) {
  return t.search(fa) !== -1;
}
async function ga(t, e, n) {
  if (!ha(t))
    return t;
  const o = Ym(t, n);
  return qm(o).reduce((r, s) => r.then((l) => Xm(l, s, e, n)), Promise.resolve(o));
}
async function Mt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await ga(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function Wm(t, e) {
  await Mt("background", t, e) || await Mt("background-image", t, e), await Mt("mask", t, e) || await Mt("-webkit-mask", t, e) || await Mt("mask-image", t, e) || await Mt("-webkit-mask-image", t, e);
}
async function jm(t, e) {
  const n = Ne(t, HTMLImageElement);
  if (!(n && !ni(t.src)) && !(Ne(t, SVGImageElement) && !ni(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await ki(o, Si(o), e);
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
async function Um(t, e) {
  const o = gt(t.childNodes).map((i) => pa(i, e));
  await Promise.all(o).then(() => t);
}
async function pa(t, e) {
  Ne(t, Element) && (await Wm(t, e), await jm(t, e), await Um(t, e));
}
function Zm(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const zs = {};
async function Vs(t) {
  let e = zs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, zs[t] = e, e;
}
async function Bs(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), da(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function qs(t) {
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
async function Km(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        gt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = Vs(a).then((d) => Bs(d, e)).then((d) => qs(d).forEach((u) => {
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
        i.href != null && o.push(Vs(i.href).then((l) => Bs(l, e)).then((l) => qs(l).forEach((a) => {
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
function Gm(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => ha(e.style.getPropertyValue("src")));
}
async function Jm(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = gt(t.ownerDocument.styleSheets), o = await Km(n, e);
  return Gm(o);
}
function ma(t) {
  return t.trim().replace(/["']/g, "");
}
function Qm(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(ma(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function ya(t, e) {
  const n = await Jm(t, e), o = Qm(t);
  return (await Promise.all(n.filter((r) => o.has(ma(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return ga(r.cssText, s, e);
  }))).join(`
`);
}
async function ey(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await ya(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function wa(t, e = {}) {
  const { width: n, height: o } = Ci(t, e), i = await po(t, e, !0);
  return await ey(i, e), await pa(i, e), Zm(i, e), await vm(i, n, o);
}
async function _n(t, e = {}) {
  const { width: n, height: o } = Ci(t, e), i = await wa(t, e), r = await lo(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || pm(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || mm(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function ty(t, e = {}) {
  const { width: n, height: o } = Ci(t, e);
  return (await _n(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function ny(t, e = {}) {
  return (await _n(t, e)).toDataURL();
}
async function oy(t, e = {}) {
  return (await _n(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function iy(t, e = {}) {
  const n = await _n(t, e);
  return await ym(n);
}
async function sy(t, e = {}) {
  return ya(t, e);
}
const ry = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: sy,
  toBlob: iy,
  toCanvas: _n,
  toJpeg: oy,
  toPixelData: ty,
  toPng: ny,
  toSvg: wa
}, Symbol.toStringTag, { value: "Module" }));
export {
  Vf as ComputeEngine,
  Hu as FlowHistory,
  as as SHORTCUT_DEFAULTS,
  dy as along,
  ff as areNodesConnected,
  Fr as buildNodeMap,
  zr as clampToExtent,
  bo as clampToParent,
  py as computeRenderPlan,
  us as computeValidationErrors,
  Or as computeZIndex,
  my as default,
  fy as drift,
  Mf as expandParentToFitChild,
  Uo as getAbsolutePosition,
  bf as getAutoPanDelta,
  Gn as getBezierPath,
  cf as getConnectedEdges,
  ht as getDescendantIds,
  Ss as getEdgePosition,
  na as getFloatingEdgeParams,
  df as getIncomers,
  Cs as getNodeIntersection,
  Vt as getNodesBounds,
  lf as getNodesFullyInPolygon,
  Nu as getNodesFullyInRect,
  af as getNodesInPolygon,
  Au as getNodesInRect,
  Wo as getOutgoers,
  ay as getSimpleBezierPath,
  gy as getSimpleFloatingPosition,
  pn as getSmoothStepPath,
  _f as getStepPath,
  Ir as getStraightPath,
  jn as getViewportForBounds,
  Ve as isConnectable,
  yf as isDeletable,
  $r as isDraggable,
  is as isResizable,
  jo as isSelectable,
  We as matchesKey,
  ft as matchesModifier,
  ly as orbit,
  uy as pendulum,
  mi as pointInPolygon,
  rf as polygonIntersectsAABB,
  Wu as registerMarker,
  an as resolveChildValidation,
  Sf as resolveShortcuts,
  Ct as sortNodesTopological,
  hy as stagger,
  Ht as toAbsoluteNode,
  to as toAbsoluteNodes,
  Xr as validateChildAdd,
  no as validateChildRemove,
  cy as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
