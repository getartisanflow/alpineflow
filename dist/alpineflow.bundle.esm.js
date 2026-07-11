let No = null;
function ma(t) {
  No = t;
}
function Le() {
  if (!No)
    throw new Error("[AlpineFlow] Alpine not initialized. Ensure Alpine.plugin(AlpineFlow) was called.");
  return No;
}
var ya = { value: () => {
} };
function lo() {
  for (var t = 0, e = arguments.length, n = {}, o; t < e; ++t) {
    if (!(o = arguments[t] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new $n(n);
}
function $n(t) {
  this._ = t;
}
function wa(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
$n.prototype = lo.prototype = {
  constructor: $n,
  on: function(t, e) {
    var n = this._, o = wa(t + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (t = o[r]).type) && (i = va(n[i], t.name))) return i;
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
function va(t, e) {
  for (var n = 0, o = t.length, i; n < o; ++n)
    if ((i = t[n]).name === e)
      return i.value;
}
function Li(t, e, n) {
  for (var o = 0, i = t.length; o < i; ++o)
    if (t[o].name === e) {
      t[o] = ya, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var $o = "http://www.w3.org/1999/xhtml";
const Pi = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: $o,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function co(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), Pi.hasOwnProperty(e) ? { space: Pi[e], local: t } : t;
}
function _a(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === $o && e.documentElement.namespaceURI === $o ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function ba(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Vs(t) {
  var e = co(t);
  return (e.local ? ba : _a)(e);
}
function xa() {
}
function ti(t) {
  return t == null ? xa : function() {
    return this.querySelector(t);
  };
}
function Ea(t) {
  typeof t != "function" && (t = ti(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = new Array(s), a, c, d = 0; d < s; ++d)
      (a = r[d]) && (c = t.call(a, a.__data__, d, r)) && ("__data__" in a && (c.__data__ = a.__data__), l[d] = c);
  return new He(o, this._parents);
}
function Ca(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Sa() {
  return [];
}
function Bs(t) {
  return t == null ? Sa : function() {
    return this.querySelectorAll(t);
  };
}
function ka(t) {
  return function() {
    return Ca(t.apply(this, arguments));
  };
}
function La(t) {
  typeof t == "function" ? t = ka(t) : t = Bs(t);
  for (var e = this._groups, n = e.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = e[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && (o.push(t.call(a, a.__data__, c, s)), i.push(a));
  return new He(o, i);
}
function qs(t) {
  return function() {
    return this.matches(t);
  };
}
function Xs(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Pa = Array.prototype.find;
function Ma(t) {
  return function() {
    return Pa.call(this.children, t);
  };
}
function Ta() {
  return this.firstElementChild;
}
function Aa(t) {
  return this.select(t == null ? Ta : Ma(typeof t == "function" ? t : Xs(t)));
}
var Na = Array.prototype.filter;
function $a() {
  return Array.from(this.children);
}
function Ia(t) {
  return function() {
    return Na.call(this.children, t);
  };
}
function Da(t) {
  return this.selectAll(t == null ? $a : Ia(typeof t == "function" ? t : Xs(t)));
}
function Ra(t) {
  typeof t != "function" && (t = qs(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new He(o, this._parents);
}
function Ys(t) {
  return new Array(t.length);
}
function Fa() {
  return new He(this._enter || this._groups.map(Ys), this._parents);
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
function Ha(t) {
  return function() {
    return t;
  };
}
function Oa(t, e, n, o, i, r) {
  for (var s = 0, l, a = e.length, c = r.length; s < c; ++s)
    (l = e[s]) ? (l.__data__ = r[s], o[s] = l) : n[s] = new On(t, r[s]);
  for (; s < a; ++s)
    (l = e[s]) && (i[s] = l);
}
function za(t, e, n, o, i, r, s) {
  var l, a, c = /* @__PURE__ */ new Map(), d = e.length, f = r.length, u = new Array(d), h;
  for (l = 0; l < d; ++l)
    (a = e[l]) && (u[l] = h = s.call(a, a.__data__, l, e) + "", c.has(h) ? i[l] = a : c.set(h, a));
  for (l = 0; l < f; ++l)
    h = s.call(t, r[l], l, r) + "", (a = c.get(h)) ? (o[l] = a, a.__data__ = r[l], c.delete(h)) : n[l] = new On(t, r[l]);
  for (l = 0; l < d; ++l)
    (a = e[l]) && c.get(u[l]) === a && (i[l] = a);
}
function Va(t) {
  return t.__data__;
}
function Ba(t, e) {
  if (!arguments.length) return Array.from(this, Va);
  var n = e ? za : Oa, o = this._parents, i = this._groups;
  typeof t != "function" && (t = Ha(t));
  for (var r = i.length, s = new Array(r), l = new Array(r), a = new Array(r), c = 0; c < r; ++c) {
    var d = o[c], f = i[c], u = f.length, h = qa(t.call(d, d && d.__data__, c, o)), p = h.length, g = l[c] = new Array(p), y = s[c] = new Array(p), m = a[c] = new Array(u);
    n(d, f, g, y, m, h, e);
    for (var b = 0, S = 0, _, M; b < p; ++b)
      if (_ = g[b]) {
        for (b >= S && (S = b + 1); !(M = y[S]) && ++S < p; ) ;
        _._next = M || null;
      }
  }
  return s = new He(s, o), s._enter = l, s._exit = a, s;
}
function qa(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function Xa() {
  return new He(this._exit || this._groups.map(Ys), this._parents);
}
function Ya(t, e, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof t == "function" ? (o = t(o), o && (o = o.selection())) : o = o.append(t + ""), e != null && (i = e(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Wa(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, o = e._groups, i = n.length, r = o.length, s = Math.min(i, r), l = new Array(i), a = 0; a < s; ++a)
    for (var c = n[a], d = o[a], f = c.length, u = l[a] = new Array(f), h, p = 0; p < f; ++p)
      (h = c[p] || d[p]) && (u[p] = h);
  for (; a < i; ++a)
    l[a] = n[a];
  return new He(l, this._parents);
}
function ja() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var o = t[e], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Ua(t) {
  t || (t = Za);
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
function Za(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Ka() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function Ga() {
  return Array.from(this);
}
function Ja() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function Qa() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function el() {
  return !this.node();
}
function tl(t) {
  for (var e = this._groups, n = 0, o = e.length; n < o; ++n)
    for (var i = e[n], r = 0, s = i.length, l; r < s; ++r)
      (l = i[r]) && t.call(l, l.__data__, r, i);
  return this;
}
function nl(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function ol(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function il(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function sl(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function rl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function al(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function ll(t, e) {
  var n = co(t);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((e == null ? n.local ? ol : nl : typeof e == "function" ? n.local ? al : rl : n.local ? sl : il)(n, e));
}
function Ws(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function cl(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function dl(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function ul(t, e, n) {
  return function() {
    var o = e.apply(this, arguments);
    o == null ? this.style.removeProperty(t) : this.style.setProperty(t, o, n);
  };
}
function fl(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? cl : typeof e == "function" ? ul : dl)(t, e, n ?? "")) : Ot(this.node(), t);
}
function Ot(t, e) {
  return t.style.getPropertyValue(e) || Ws(t).getComputedStyle(t, null).getPropertyValue(e);
}
function hl(t) {
  return function() {
    delete this[t];
  };
}
function pl(t, e) {
  return function() {
    this[t] = e;
  };
}
function gl(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function ml(t, e) {
  return arguments.length > 1 ? this.each((e == null ? hl : typeof e == "function" ? gl : pl)(t, e)) : this.node()[t];
}
function js(t) {
  return t.trim().split(/^|\s+/);
}
function ni(t) {
  return t.classList || new Us(t);
}
function Us(t) {
  this._node = t, this._names = js(t.getAttribute("class") || "");
}
Us.prototype = {
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
function Zs(t, e) {
  for (var n = ni(t), o = -1, i = e.length; ++o < i; ) n.add(e[o]);
}
function Ks(t, e) {
  for (var n = ni(t), o = -1, i = e.length; ++o < i; ) n.remove(e[o]);
}
function yl(t) {
  return function() {
    Zs(this, t);
  };
}
function wl(t) {
  return function() {
    Ks(this, t);
  };
}
function vl(t, e) {
  return function() {
    (e.apply(this, arguments) ? Zs : Ks)(this, t);
  };
}
function _l(t, e) {
  var n = js(t + "");
  if (arguments.length < 2) {
    for (var o = ni(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? vl : e ? yl : wl)(n, e));
}
function bl() {
  this.textContent = "";
}
function xl(t) {
  return function() {
    this.textContent = t;
  };
}
function El(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Cl(t) {
  return arguments.length ? this.each(t == null ? bl : (typeof t == "function" ? El : xl)(t)) : this.node().textContent;
}
function Sl() {
  this.innerHTML = "";
}
function kl(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Ll(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Pl(t) {
  return arguments.length ? this.each(t == null ? Sl : (typeof t == "function" ? Ll : kl)(t)) : this.node().innerHTML;
}
function Ml() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Tl() {
  return this.each(Ml);
}
function Al() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Nl() {
  return this.each(Al);
}
function $l(t) {
  var e = typeof t == "function" ? t : Vs(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Il() {
  return null;
}
function Dl(t, e) {
  var n = typeof t == "function" ? t : Vs(t), o = e == null ? Il : typeof e == "function" ? e : ti(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Rl() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Fl() {
  return this.each(Rl);
}
function Hl() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Ol() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function zl(t) {
  return this.select(t ? Ol : Hl);
}
function Vl(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function Bl(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function ql(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", o = e.indexOf(".");
    return o >= 0 && (n = e.slice(o + 1), e = e.slice(0, o)), { type: e, name: n };
  });
}
function Xl(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, o = -1, i = e.length, r; n < i; ++n)
        r = e[n], (!t.type || r.type === t.type) && r.name === t.name ? this.removeEventListener(r.type, r.listener, r.options) : e[++o] = r;
      ++o ? e.length = o : delete this.__on;
    }
  };
}
function Yl(t, e, n) {
  return function() {
    var o = this.__on, i, r = Bl(e);
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
function Wl(t, e, n) {
  var o = ql(t + ""), i, r = o.length, s;
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
  for (l = e ? Yl : Xl, i = 0; i < r; ++i) this.each(l(o[i], e, n));
  return this;
}
function Gs(t, e, n) {
  var o = Ws(t), i = o.CustomEvent;
  typeof i == "function" ? i = new i(e, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(e, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(e, !1, !1)), t.dispatchEvent(i);
}
function jl(t, e) {
  return function() {
    return Gs(this, t, e);
  };
}
function Ul(t, e) {
  return function() {
    return Gs(this, t, e.apply(this, arguments));
  };
}
function Zl(t, e) {
  return this.each((typeof e == "function" ? Ul : jl)(t, e));
}
function* Kl() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var o = t[e], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Js = [null];
function He(t, e) {
  this._groups = t, this._parents = e;
}
function yn() {
  return new He([[document.documentElement]], Js);
}
function Gl() {
  return this;
}
He.prototype = yn.prototype = {
  constructor: He,
  select: Ea,
  selectAll: La,
  selectChild: Aa,
  selectChildren: Da,
  filter: Ra,
  data: Ba,
  enter: Fa,
  exit: Xa,
  join: Ya,
  merge: Wa,
  selection: Gl,
  order: ja,
  sort: Ua,
  call: Ka,
  nodes: Ga,
  node: Ja,
  size: Qa,
  empty: el,
  each: tl,
  attr: ll,
  style: fl,
  property: ml,
  classed: _l,
  text: Cl,
  html: Pl,
  raise: Tl,
  lower: Nl,
  append: $l,
  insert: Dl,
  remove: Fl,
  clone: zl,
  datum: Vl,
  on: Wl,
  dispatch: Zl,
  [Symbol.iterator]: Kl
};
function Ve(t) {
  return typeof t == "string" ? new He([[document.querySelector(t)]], [document.documentElement]) : new He([[t]], Js);
}
function Jl(t) {
  let e;
  for (; e = t.sourceEvent; ) t = e;
  return t;
}
function Ze(t, e) {
  if (t = Jl(t), e === void 0 && (e = t.currentTarget), e) {
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
const Ql = { passive: !1 }, cn = { capture: !0, passive: !1 };
function go(t) {
  t.stopImmediatePropagation();
}
function Nt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function Qs(t) {
  var e = t.document.documentElement, n = Ve(t).on("dragstart.drag", Nt, cn);
  "onselectstart" in e ? n.on("selectstart.drag", Nt, cn) : (e.__noselect = e.style.MozUserSelect, e.style.MozUserSelect = "none");
}
function er(t, e) {
  var n = t.document.documentElement, o = Ve(t).on("dragstart.drag", null);
  e && (o.on("click.drag", Nt, cn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const xn = (t) => () => t;
function Io(t, {
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
Io.prototype.on = function() {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
function ec(t) {
  return !t.ctrlKey && !t.button;
}
function tc() {
  return this.parentNode;
}
function nc(t, e) {
  return e ?? { x: t.x, y: t.y };
}
function oc() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function ic() {
  var t = ec, e = tc, n = nc, o = oc, i = {}, r = lo("start", "drag", "end"), s = 0, l, a, c, d, f = 0;
  function u(_) {
    _.on("mousedown.drag", h).filter(o).on("touchstart.drag", y).on("touchmove.drag", m, Ql).on("touchend.drag touchcancel.drag", b).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(_, M) {
    if (!(d || !t.call(this, _, M))) {
      var L = S(this, e.call(this, _, M), _, M, "mouse");
      L && (Ve(_.view).on("mousemove.drag", p, cn).on("mouseup.drag", g, cn), Qs(_.view), go(_), c = !1, l = _.clientX, a = _.clientY, L("start", _));
    }
  }
  function p(_) {
    if (Nt(_), !c) {
      var M = _.clientX - l, L = _.clientY - a;
      c = M * M + L * L > f;
    }
    i.mouse("drag", _);
  }
  function g(_) {
    Ve(_.view).on("mousemove.drag mouseup.drag", null), er(_.view, c), Nt(_), i.mouse("end", _);
  }
  function y(_, M) {
    if (t.call(this, _, M)) {
      var L = _.changedTouches, P = e.call(this, _, M), $ = L.length, x, E;
      for (x = 0; x < $; ++x)
        (E = S(this, P, _, M, L[x].identifier, L[x])) && (go(_), E("start", _, L[x]));
    }
  }
  function m(_) {
    var M = _.changedTouches, L = M.length, P, $;
    for (P = 0; P < L; ++P)
      ($ = i[M[P].identifier]) && (Nt(_), $("drag", _, M[P]));
  }
  function b(_) {
    var M = _.changedTouches, L = M.length, P, $;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), P = 0; P < L; ++P)
      ($ = i[M[P].identifier]) && (go(_), $("end", _, M[P]));
  }
  function S(_, M, L, P, $, x) {
    var E = r.copy(), N = Ze(x || L, M), T, w, v;
    if ((v = n.call(_, new Io("beforestart", {
      sourceEvent: L,
      target: u,
      identifier: $,
      active: s,
      x: N[0],
      y: N[1],
      dx: 0,
      dy: 0,
      dispatch: E
    }), P)) != null)
      return T = v.x - N[0] || 0, w = v.y - N[1] || 0, function D(k, O, W) {
        var C = N, A;
        switch (k) {
          case "start":
            i[$] = D, A = s++;
            break;
          case "end":
            delete i[$], --s;
          // falls through
          case "drag":
            N = Ze(W || O, M), A = s;
            break;
        }
        E.call(
          k,
          _,
          new Io(k, {
            sourceEvent: O,
            subject: v,
            target: u,
            identifier: $,
            active: A,
            x: N[0] + T,
            y: N[1] + w,
            dx: N[0] - C[0],
            dy: N[1] - C[1],
            dispatch: E
          }),
          P
        );
      };
  }
  return u.filter = function(_) {
    return arguments.length ? (t = typeof _ == "function" ? _ : xn(!!_), u) : t;
  }, u.container = function(_) {
    return arguments.length ? (e = typeof _ == "function" ? _ : xn(_), u) : e;
  }, u.subject = function(_) {
    return arguments.length ? (n = typeof _ == "function" ? _ : xn(_), u) : n;
  }, u.touchable = function(_) {
    return arguments.length ? (o = typeof _ == "function" ? _ : xn(!!_), u) : o;
  }, u.on = function() {
    var _ = r.on.apply(r, arguments);
    return _ === r ? u : _;
  }, u.clickDistance = function(_) {
    return arguments.length ? (f = (_ = +_) * _, u) : Math.sqrt(f);
  }, u;
}
function oi(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function tr(t, e) {
  var n = Object.create(t.prototype);
  for (var o in e) n[o] = e[o];
  return n;
}
function wn() {
}
var dn = 0.7, zn = 1 / dn, $t = "\\s*([+-]?\\d+)\\s*", un = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", sc = /^#([0-9a-f]{3,8})$/, rc = new RegExp(`^rgb\\(${$t},${$t},${$t}\\)$`), ac = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`), lc = new RegExp(`^rgba\\(${$t},${$t},${$t},${un}\\)$`), cc = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${un}\\)$`), dc = new RegExp(`^hsl\\(${un},${Ye},${Ye}\\)$`), uc = new RegExp(`^hsla\\(${un},${Ye},${Ye},${un}\\)$`), Mi = {
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
oi(wn, fn, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ti,
  // Deprecated! Use color.formatHex.
  formatHex: Ti,
  formatHex8: fc,
  formatHsl: hc,
  formatRgb: Ai,
  toString: Ai
});
function Ti() {
  return this.rgb().formatHex();
}
function fc() {
  return this.rgb().formatHex8();
}
function hc() {
  return nr(this).formatHsl();
}
function Ai() {
  return this.rgb().formatRgb();
}
function fn(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = sc.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? Ni(e) : n === 3 ? new Ne(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? En(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? En(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = rc.exec(t)) ? new Ne(e[1], e[2], e[3], 1) : (e = ac.exec(t)) ? new Ne(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = lc.exec(t)) ? En(e[1], e[2], e[3], e[4]) : (e = cc.exec(t)) ? En(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = dc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, 1) : (e = uc.exec(t)) ? Di(e[1], e[2] / 100, e[3] / 100, e[4]) : Mi.hasOwnProperty(t) ? Ni(Mi[t]) : t === "transparent" ? new Ne(NaN, NaN, NaN, 0) : null;
}
function Ni(t) {
  return new Ne(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function En(t, e, n, o) {
  return o <= 0 && (t = e = n = NaN), new Ne(t, e, n, o);
}
function pc(t) {
  return t instanceof wn || (t = fn(t)), t ? (t = t.rgb(), new Ne(t.r, t.g, t.b, t.opacity)) : new Ne();
}
function Do(t, e, n, o) {
  return arguments.length === 1 ? pc(t) : new Ne(t, e, n, o ?? 1);
}
function Ne(t, e, n, o) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +o;
}
oi(Ne, Do, tr(wn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? dn : Math.pow(dn, t), new Ne(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ne(Et(this.r), Et(this.g), Et(this.b), Vn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: $i,
  // Deprecated! Use color.formatHex.
  formatHex: $i,
  formatHex8: gc,
  formatRgb: Ii,
  toString: Ii
}));
function $i() {
  return `#${bt(this.r)}${bt(this.g)}${bt(this.b)}`;
}
function gc() {
  return `#${bt(this.r)}${bt(this.g)}${bt(this.b)}${bt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ii() {
  const t = Vn(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${Et(this.r)}, ${Et(this.g)}, ${Et(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function Vn(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Et(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function bt(t) {
  return t = Et(t), (t < 16 ? "0" : "") + t.toString(16);
}
function Di(t, e, n, o) {
  return o <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new Be(t, e, n, o);
}
function nr(t) {
  if (t instanceof Be) return new Be(t.h, t.s, t.l, t.opacity);
  if (t instanceof wn || (t = fn(t)), !t) return new Be();
  if (t instanceof Be) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, o = t.b / 255, i = Math.min(e, n, o), r = Math.max(e, n, o), s = NaN, l = r - i, a = (r + i) / 2;
  return l ? (e === r ? s = (n - o) / l + (n < o) * 6 : n === r ? s = (o - e) / l + 2 : s = (e - n) / l + 4, l /= a < 0.5 ? r + i : 2 - r - i, s *= 60) : l = a > 0 && a < 1 ? 0 : s, new Be(s, l, a, t.opacity);
}
function mc(t, e, n, o) {
  return arguments.length === 1 ? nr(t) : new Be(t, e, n, o ?? 1);
}
function Be(t, e, n, o) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +o;
}
oi(Be, mc, tr(wn, {
  brighter(t) {
    return t = t == null ? zn : Math.pow(zn, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? dn : Math.pow(dn, t), new Be(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * e, i = 2 * n - o;
    return new Ne(
      mo(t >= 240 ? t - 240 : t + 120, i, o),
      mo(t, i, o),
      mo(t < 120 ? t + 240 : t - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new Be(Ri(this.h), Cn(this.s), Cn(this.l), Vn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = Vn(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${Ri(this.h)}, ${Cn(this.s) * 100}%, ${Cn(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function Ri(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function Cn(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function mo(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const or = (t) => () => t;
function yc(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function wc(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(o) {
    return Math.pow(t + o * e, n);
  };
}
function vc(t) {
  return (t = +t) == 1 ? ir : function(e, n) {
    return n - e ? wc(e, n, t) : or(isNaN(e) ? n : e);
  };
}
function ir(t, e) {
  var n = e - t;
  return n ? yc(t, n) : or(isNaN(t) ? e : t);
}
const Ro = (function t(e) {
  var n = vc(e);
  function o(i, r) {
    var s = n((i = Do(i)).r, (r = Do(r)).r), l = n(i.g, r.g), a = n(i.b, r.b), c = ir(i.opacity, r.opacity);
    return function(d) {
      return i.r = s(d), i.g = l(d), i.b = a(d), i.opacity = c(d), i + "";
    };
  }
  return o.gamma = t, o;
})(1);
function rt(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
var Fo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, yo = new RegExp(Fo.source, "g");
function _c(t) {
  return function() {
    return t;
  };
}
function bc(t) {
  return function(e) {
    return t(e) + "";
  };
}
function xc(t, e) {
  var n = Fo.lastIndex = yo.lastIndex = 0, o, i, r, s = -1, l = [], a = [];
  for (t = t + "", e = e + ""; (o = Fo.exec(t)) && (i = yo.exec(e)); )
    (r = i.index) > n && (r = e.slice(n, r), l[s] ? l[s] += r : l[++s] = r), (o = o[0]) === (i = i[0]) ? l[s] ? l[s] += i : l[++s] = i : (l[++s] = null, a.push({ i: s, x: rt(o, i) })), n = yo.lastIndex;
  return n < e.length && (r = e.slice(n), l[s] ? l[s] += r : l[++s] = r), l.length < 2 ? a[0] ? bc(a[0].x) : _c(e) : (e = a.length, function(c) {
    for (var d = 0, f; d < e; ++d) l[(f = a[d]).i] = f.x(c);
    return l.join("");
  });
}
var Fi = 180 / Math.PI, Ho = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function sr(t, e, n, o, i, r) {
  var s, l, a;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (a = t * n + e * o) && (n -= t * a, o -= e * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), t * o < e * n && (t = -t, e = -e, a = -a, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(e, t) * Fi,
    skewX: Math.atan(a) * Fi,
    scaleX: s,
    scaleY: l
  };
}
var Sn;
function Ec(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Ho : sr(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Cc(t) {
  return t == null || (Sn || (Sn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Sn.setAttribute("transform", t), !(t = Sn.transform.baseVal.consolidate())) ? Ho : (t = t.matrix, sr(t.a, t.b, t.c, t.d, t.e, t.f));
}
function rr(t, e, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function r(c, d, f, u, h, p) {
    if (c !== f || d !== u) {
      var g = h.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: rt(c, f) }, { i: g - 2, x: rt(d, u) });
    } else (f || u) && h.push("translate(" + f + e + u + n);
  }
  function s(c, d, f, u) {
    c !== d ? (c - d > 180 ? d += 360 : d - c > 180 && (c += 360), u.push({ i: f.push(i(f) + "rotate(", null, o) - 2, x: rt(c, d) })) : d && f.push(i(f) + "rotate(" + d + o);
  }
  function l(c, d, f, u) {
    c !== d ? u.push({ i: f.push(i(f) + "skewX(", null, o) - 2, x: rt(c, d) }) : d && f.push(i(f) + "skewX(" + d + o);
  }
  function a(c, d, f, u, h, p) {
    if (c !== f || d !== u) {
      var g = h.push(i(h) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: rt(c, f) }, { i: g - 2, x: rt(d, u) });
    } else (f !== 1 || u !== 1) && h.push(i(h) + "scale(" + f + "," + u + ")");
  }
  return function(c, d) {
    var f = [], u = [];
    return c = t(c), d = t(d), r(c.translateX, c.translateY, d.translateX, d.translateY, f, u), s(c.rotate, d.rotate, f, u), l(c.skewX, d.skewX, f, u), a(c.scaleX, c.scaleY, d.scaleX, d.scaleY, f, u), c = d = null, function(h) {
      for (var p = -1, g = u.length, y; ++p < g; ) f[(y = u[p]).i] = y.x(h);
      return f.join("");
    };
  };
}
var Sc = rr(Ec, "px, ", "px)", "deg)"), kc = rr(Cc, ", ", ")", ")"), Lc = 1e-12;
function Hi(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
function Pc(t) {
  return ((t = Math.exp(t)) - 1 / t) / 2;
}
function Mc(t) {
  return ((t = Math.exp(2 * t)) - 1) / (t + 1);
}
const Tc = (function t(e, n, o) {
  function i(r, s) {
    var l = r[0], a = r[1], c = r[2], d = s[0], f = s[1], u = s[2], h = d - l, p = f - a, g = h * h + p * p, y, m;
    if (g < Lc)
      m = Math.log(u / c) / e, y = function(P) {
        return [
          l + P * h,
          a + P * p,
          c * Math.exp(e * P * m)
        ];
      };
    else {
      var b = Math.sqrt(g), S = (u * u - c * c + o * g) / (2 * c * n * b), _ = (u * u - c * c - o * g) / (2 * u * n * b), M = Math.log(Math.sqrt(S * S + 1) - S), L = Math.log(Math.sqrt(_ * _ + 1) - _);
      m = (L - M) / e, y = function(P) {
        var $ = P * m, x = Hi(M), E = c / (n * b) * (x * Mc(e * $ + M) - Pc(M));
        return [
          l + E * h,
          a + E * p,
          c * x / Hi(e * $ + M)
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
var zt = 0, en = 0, Ut = 0, ar = 1e3, Bn, tn, qn = 0, Ct = 0, uo = 0, hn = typeof performance == "object" && performance.now ? performance : Date, lr = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ii() {
  return Ct || (lr(Ac), Ct = hn.now() + uo);
}
function Ac() {
  Ct = 0;
}
function Xn() {
  this._call = this._time = this._next = null;
}
Xn.prototype = cr.prototype = {
  constructor: Xn,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ii() : +n) + (e == null ? 0 : +e), !this._next && tn !== this && (tn ? tn._next = this : Bn = this, tn = this), this._call = t, this._time = n, Oo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Oo());
  }
};
function cr(t, e, n) {
  var o = new Xn();
  return o.restart(t, e, n), o;
}
function Nc() {
  ii(), ++zt;
  for (var t = Bn, e; t; )
    (e = Ct - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --zt;
}
function Oi() {
  Ct = (qn = hn.now()) + uo, zt = en = 0;
  try {
    Nc();
  } finally {
    zt = 0, Ic(), Ct = 0;
  }
}
function $c() {
  var t = hn.now(), e = t - qn;
  e > ar && (uo -= e, qn = t);
}
function Ic() {
  for (var t, e = Bn, n, o = 1 / 0; e; )
    e._call ? (o > e._time && (o = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Bn = n);
  tn = t, Oo(o);
}
function Oo(t) {
  if (!zt) {
    en && (en = clearTimeout(en));
    var e = t - Ct;
    e > 24 ? (t < 1 / 0 && (en = setTimeout(Oi, t - hn.now() - uo)), Ut && (Ut = clearInterval(Ut))) : (Ut || (qn = hn.now(), Ut = setInterval($c, ar)), zt = 1, lr(Oi));
  }
}
function zi(t, e, n) {
  var o = new Xn();
  return e = e == null ? 0 : +e, o.restart((i) => {
    o.stop(), t(i + e);
  }, e, n), o;
}
var Dc = lo("start", "end", "cancel", "interrupt"), Rc = [], dr = 0, Vi = 1, zo = 2, In = 3, Bi = 4, Vo = 5, Dn = 6;
function fo(t, e, n, o, i, r) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Fc(t, n, {
    name: e,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Dc,
    tween: Rc,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: dr
  });
}
function si(t, e) {
  var n = qe(t, e);
  if (n.state > dr) throw new Error("too late; already scheduled");
  return n;
}
function We(t, e) {
  var n = qe(t, e);
  if (n.state > In) throw new Error("too late; already running");
  return n;
}
function qe(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Fc(t, e, n) {
  var o = t.__transition, i;
  o[e] = n, n.timer = cr(r, 0, n.time);
  function r(c) {
    n.state = Vi, n.timer.restart(s, n.delay, n.time), n.delay <= c && s(c - n.delay);
  }
  function s(c) {
    var d, f, u, h;
    if (n.state !== Vi) return a();
    for (d in o)
      if (h = o[d], h.name === n.name) {
        if (h.state === In) return zi(s);
        h.state === Bi ? (h.state = Dn, h.timer.stop(), h.on.call("interrupt", t, t.__data__, h.index, h.group), delete o[d]) : +d < e && (h.state = Dn, h.timer.stop(), h.on.call("cancel", t, t.__data__, h.index, h.group), delete o[d]);
      }
    if (zi(function() {
      n.state === In && (n.state = Bi, n.timer.restart(l, n.delay, n.time), l(c));
    }), n.state = zo, n.on.call("start", t, t.__data__, n.index, n.group), n.state === zo) {
      for (n.state = In, i = new Array(u = n.tween.length), d = 0, f = -1; d < u; ++d)
        (h = n.tween[d].value.call(t, t.__data__, n.index, n.group)) && (i[++f] = h);
      i.length = f + 1;
    }
  }
  function l(c) {
    for (var d = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(a), n.state = Vo, 1), f = -1, u = i.length; ++f < u; )
      i[f].call(t, d);
    n.state === Vo && (n.on.call("end", t, t.__data__, n.index, n.group), a());
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
      i = o.state > zo && o.state < Vo, o.state = Dn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", t, t.__data__, o.index, o.group), delete n[s];
    }
    r && delete t.__transition;
  }
}
function Hc(t) {
  return this.each(function() {
    Rn(this, t);
  });
}
function Oc(t, e) {
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
function zc(t, e, n) {
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
function Vc(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var o = qe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Oc : zc)(n, t, e));
}
function ri(t, e, n) {
  var o = t._id;
  return t.each(function() {
    var i = We(this, o);
    (i.value || (i.value = {}))[e] = n.apply(this, arguments);
  }), function(i) {
    return qe(i, o).value[e];
  };
}
function ur(t, e) {
  var n;
  return (typeof e == "number" ? rt : e instanceof fn ? Ro : (n = fn(e)) ? (e = n, Ro) : xc)(t, e);
}
function Bc(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function qc(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Xc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Yc(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Wc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function jc(t, e, n) {
  var o, i, r;
  return function() {
    var s, l = n(this), a;
    return l == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), a = l + "", s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l)));
  };
}
function Uc(t, e) {
  var n = co(t), o = n === "transform" ? kc : ur;
  return this.attrTween(t, typeof e == "function" ? (n.local ? jc : Wc)(n, o, ri(this, "attr." + t, e)) : e == null ? (n.local ? qc : Bc)(n) : (n.local ? Yc : Xc)(n, o, e));
}
function Zc(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function Kc(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function Gc(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Kc(t, r)), n;
  }
  return i._value = e, i;
}
function Jc(t, e) {
  var n, o;
  function i() {
    var r = e.apply(this, arguments);
    return r !== o && (n = (o = r) && Zc(t, r)), n;
  }
  return i._value = e, i;
}
function Qc(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var o = co(t);
  return this.tween(n, (o.local ? Gc : Jc)(o, e));
}
function ed(t, e) {
  return function() {
    si(this, t).delay = +e.apply(this, arguments);
  };
}
function td(t, e) {
  return e = +e, function() {
    si(this, t).delay = e;
  };
}
function nd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ed : td)(e, t)) : qe(this.node(), e).delay;
}
function od(t, e) {
  return function() {
    We(this, t).duration = +e.apply(this, arguments);
  };
}
function id(t, e) {
  return e = +e, function() {
    We(this, t).duration = e;
  };
}
function sd(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? od : id)(e, t)) : qe(this.node(), e).duration;
}
function rd(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    We(this, t).ease = e;
  };
}
function ad(t) {
  var e = this._id;
  return arguments.length ? this.each(rd(e, t)) : qe(this.node(), e).ease;
}
function ld(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    We(this, t).ease = n;
  };
}
function cd(t) {
  if (typeof t != "function") throw new Error();
  return this.each(ld(this._id, t));
}
function dd(t) {
  typeof t != "function" && (t = qs(t));
  for (var e = this._groups, n = e.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = e[i], s = r.length, l = o[i] = [], a, c = 0; c < s; ++c)
      (a = r[c]) && t.call(a, a.__data__, c, r) && l.push(a);
  return new tt(o, this._parents, this._name, this._id);
}
function ud(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, o = e.length, i = n.length, r = Math.min(o, i), s = new Array(o), l = 0; l < r; ++l)
    for (var a = e[l], c = n[l], d = a.length, f = s[l] = new Array(d), u, h = 0; h < d; ++h)
      (u = a[h] || c[h]) && (f[h] = u);
  for (; l < o; ++l)
    s[l] = e[l];
  return new tt(s, this._parents, this._name, this._id);
}
function fd(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function hd(t, e, n) {
  var o, i, r = fd(e) ? si : We;
  return function() {
    var s = r(this, t), l = s.on;
    l !== o && (i = (o = l).copy()).on(e, n), s.on = i;
  };
}
function pd(t, e) {
  var n = this._id;
  return arguments.length < 2 ? qe(this.node(), n).on.on(t) : this.each(hd(n, t, e));
}
function gd(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function md() {
  return this.on("end.remove", gd(this._id));
}
function yd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = ti(t));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var l = o[s], a = l.length, c = r[s] = new Array(a), d, f, u = 0; u < a; ++u)
      (d = l[u]) && (f = t.call(d, d.__data__, u, l)) && ("__data__" in d && (f.__data__ = d.__data__), c[u] = f, fo(c[u], e, n, u, c, qe(d, n)));
  return new tt(r, this._parents, e, n);
}
function wd(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Bs(t));
  for (var o = this._groups, i = o.length, r = [], s = [], l = 0; l < i; ++l)
    for (var a = o[l], c = a.length, d, f = 0; f < c; ++f)
      if (d = a[f]) {
        for (var u = t.call(d, d.__data__, f, a), h, p = qe(d, n), g = 0, y = u.length; g < y; ++g)
          (h = u[g]) && fo(h, e, n, g, u, p);
        r.push(u), s.push(d);
      }
  return new tt(r, s, e, n);
}
var vd = yn.prototype.constructor;
function _d() {
  return new vd(this._groups, this._parents);
}
function bd(t, e) {
  var n, o, i;
  return function() {
    var r = Ot(this, t), s = (this.style.removeProperty(t), Ot(this, t));
    return r === s ? null : r === n && s === o ? i : i = e(n = r, o = s);
  };
}
function fr(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function xd(t, e, n) {
  var o, i = n + "", r;
  return function() {
    var s = Ot(this, t);
    return s === i ? null : s === o ? r : r = e(o = s, n);
  };
}
function Ed(t, e, n) {
  var o, i, r;
  return function() {
    var s = Ot(this, t), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(t), Ot(this, t))), s === a ? null : s === o && a === i ? r : (i = a, r = e(o = s, l));
  };
}
function Cd(t, e) {
  var n, o, i, r = "style." + e, s = "end." + r, l;
  return function() {
    var a = We(this, t), c = a.on, d = a.value[r] == null ? l || (l = fr(e)) : void 0;
    (c !== n || i !== d) && (o = (n = c).copy()).on(s, i = d), a.on = o;
  };
}
function Sd(t, e, n) {
  var o = (t += "") == "transform" ? Sc : ur;
  return e == null ? this.styleTween(t, bd(t, o)).on("end.style." + t, fr(t)) : typeof e == "function" ? this.styleTween(t, Ed(t, o, ri(this, "style." + t, e))).each(Cd(this._id, t)) : this.styleTween(t, xd(t, o, e), n).on("end.style." + t, null);
}
function kd(t, e, n) {
  return function(o) {
    this.style.setProperty(t, e.call(this, o), n);
  };
}
function Ld(t, e, n) {
  var o, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (o = (i = s) && kd(t, s, n)), o;
  }
  return r._value = e, r;
}
function Pd(t, e, n) {
  var o = "style." + (t += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (e == null) return this.tween(o, null);
  if (typeof e != "function") throw new Error();
  return this.tween(o, Ld(t, e, n ?? ""));
}
function Md(t) {
  return function() {
    this.textContent = t;
  };
}
function Td(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Ad(t) {
  return this.tween("text", typeof t == "function" ? Td(ri(this, "text", t)) : Md(t == null ? "" : t + ""));
}
function Nd(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function $d(t) {
  var e, n;
  function o() {
    var i = t.apply(this, arguments);
    return i !== n && (e = (n = i) && Nd(i)), e;
  }
  return o._value = t, o;
}
function Id(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, $d(t));
}
function Dd() {
  for (var t = this._name, e = this._id, n = hr(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      if (a = s[c]) {
        var d = qe(a, e);
        fo(a, t, n, c, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new tt(o, this._parents, t, n);
}
function Rd() {
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
var Fd = 0;
function tt(t, e, n, o) {
  this._groups = t, this._parents = e, this._name = n, this._id = o;
}
function hr() {
  return ++Fd;
}
var Ue = yn.prototype;
tt.prototype = {
  constructor: tt,
  select: yd,
  selectAll: wd,
  selectChild: Ue.selectChild,
  selectChildren: Ue.selectChildren,
  filter: dd,
  merge: ud,
  selection: _d,
  transition: Dd,
  call: Ue.call,
  nodes: Ue.nodes,
  node: Ue.node,
  size: Ue.size,
  empty: Ue.empty,
  each: Ue.each,
  on: pd,
  attr: Uc,
  attrTween: Qc,
  style: Sd,
  styleTween: Pd,
  text: Ad,
  textTween: Id,
  remove: md,
  tween: Vc,
  delay: nd,
  duration: sd,
  ease: ad,
  easeVarying: cd,
  end: Rd,
  [Symbol.iterator]: Ue[Symbol.iterator]
};
const Hd = (t) => +t;
function Od(t) {
  return t * t;
}
function zd(t) {
  return t * (2 - t);
}
function Vd(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
function Bd(t) {
  return t * t * t;
}
function qd(t) {
  return --t * t * t + 1;
}
function pr(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var gr = Math.PI, mr = gr / 2;
function Xd(t) {
  return +t == 1 ? 1 : 1 - Math.cos(t * mr);
}
function Yd(t) {
  return Math.sin(t * mr);
}
function Wd(t) {
  return (1 - Math.cos(gr * t)) / 2;
}
function gt(t) {
  return (Math.pow(2, -10 * t) - 9765625e-10) * 1.0009775171065494;
}
function jd(t) {
  return gt(1 - +t);
}
function Ud(t) {
  return 1 - gt(t);
}
function Zd(t) {
  return ((t *= 2) <= 1 ? gt(1 - t) : 2 - gt(t - 1)) / 2;
}
function Kd(t) {
  return 1 - Math.sqrt(1 - t * t);
}
function Gd(t) {
  return Math.sqrt(1 - --t * t);
}
function Jd(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
var Bo = 4 / 11, Qd = 6 / 11, eu = 8 / 11, tu = 3 / 4, nu = 9 / 11, ou = 10 / 11, iu = 15 / 16, su = 21 / 22, ru = 63 / 64, kn = 1 / Bo / Bo;
function au(t) {
  return 1 - Yn(1 - t);
}
function Yn(t) {
  return (t = +t) < Bo ? kn * t * t : t < eu ? kn * (t -= Qd) * t + tu : t < ou ? kn * (t -= nu) * t + iu : kn * (t -= su) * t + ru;
}
function lu(t) {
  return ((t *= 2) <= 1 ? 1 - Yn(1 - t) : Yn(t - 1) + 1) / 2;
}
var ai = 1.70158, cu = (function t(e) {
  e = +e;
  function n(o) {
    return (o = +o) * o * (e * (o - 1) + o);
  }
  return n.overshoot = t, n;
})(ai), du = (function t(e) {
  e = +e;
  function n(o) {
    return --o * o * ((o + 1) * e + o) + 1;
  }
  return n.overshoot = t, n;
})(ai), uu = (function t(e) {
  e = +e;
  function n(o) {
    return ((o *= 2) < 1 ? o * o * ((e + 1) * o - e) : (o -= 2) * o * ((e + 1) * o + e) + 2) / 2;
  }
  return n.overshoot = t, n;
})(ai), Vt = 2 * Math.PI, li = 1, ci = 0.3, fu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Vt);
  function i(r) {
    return e * gt(- --r) * Math.sin((o - r) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Vt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(li, ci), hu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Vt);
  function i(r) {
    return 1 - e * gt(r = +r) * Math.sin((r + o) / n);
  }
  return i.amplitude = function(r) {
    return t(r, n * Vt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(li, ci), pu = (function t(e, n) {
  var o = Math.asin(1 / (e = Math.max(1, e))) * (n /= Vt);
  function i(r) {
    return ((r = r * 2 - 1) < 0 ? e * gt(-r) * Math.sin((o - r) / n) : 2 - e * gt(r) * Math.sin((o + r) / n)) / 2;
  }
  return i.amplitude = function(r) {
    return t(r, n * Vt);
  }, i.period = function(r) {
    return t(e, r);
  }, i;
})(li, ci), gu = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: pr
};
function mu(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function yu(t) {
  var e, n;
  t instanceof tt ? (e = t._id, t = t._name) : (e = hr(), (n = gu).time = ii(), t = t == null ? null : t + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], l = s.length, a, c = 0; c < l; ++c)
      (a = s[c]) && fo(a, t, e, c, s, n || mu(a, e));
  return new tt(o, this._parents, t, e);
}
yn.prototype.interrupt = Hc;
yn.prototype.transition = yu;
const Ln = (t) => () => t;
function wu(t, {
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
var Wn = new Je(1, 0, 0);
Je.prototype;
function wo(t) {
  t.stopImmediatePropagation();
}
function Zt(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function vu(t) {
  return (!t.ctrlKey || t.type === "wheel") && !t.button;
}
function _u() {
  var t = this;
  return t instanceof SVGElement ? (t = t.ownerSVGElement || t, t.hasAttribute("viewBox") ? (t = t.viewBox.baseVal, [[t.x, t.y], [t.x + t.width, t.y + t.height]]) : [[0, 0], [t.width.baseVal.value, t.height.baseVal.value]]) : [[0, 0], [t.clientWidth, t.clientHeight]];
}
function qi() {
  return this.__zoom || Wn;
}
function bu(t) {
  return -t.deltaY * (t.deltaMode === 1 ? 0.05 : t.deltaMode ? 1 : 2e-3) * (t.ctrlKey ? 10 : 1);
}
function xu() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Eu(t, e, n) {
  var o = t.invertX(e[0][0]) - n[0][0], i = t.invertX(e[1][0]) - n[1][0], r = t.invertY(e[0][1]) - n[0][1], s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Cu() {
  var t = vu, e = _u, n = Eu, o = bu, i = xu, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = Tc, c = lo("start", "zoom", "end"), d, f, u, h = 500, p = 150, g = 0, y = 10;
  function m(v) {
    v.property("__zoom", qi).on("wheel.zoom", $, { passive: !1 }).on("mousedown.zoom", x).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", N).on("touchmove.zoom", T).on("touchend.zoom touchcancel.zoom", w).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  m.transform = function(v, D, k, O) {
    var W = v.selection ? v.selection() : v;
    W.property("__zoom", qi), v !== W ? M(v, D, k, O) : W.interrupt().each(function() {
      L(this, arguments).event(O).start().zoom(null, typeof D == "function" ? D.apply(this, arguments) : D).end();
    });
  }, m.scaleBy = function(v, D, k, O) {
    m.scaleTo(v, function() {
      var W = this.__zoom.k, C = typeof D == "function" ? D.apply(this, arguments) : D;
      return W * C;
    }, k, O);
  }, m.scaleTo = function(v, D, k, O) {
    m.transform(v, function() {
      var W = e.apply(this, arguments), C = this.__zoom, A = k == null ? _(W) : typeof k == "function" ? k.apply(this, arguments) : k, R = C.invert(A), X = typeof D == "function" ? D.apply(this, arguments) : D;
      return n(S(b(C, X), A, R), W, s);
    }, k, O);
  }, m.translateBy = function(v, D, k, O) {
    m.transform(v, function() {
      return n(this.__zoom.translate(
        typeof D == "function" ? D.apply(this, arguments) : D,
        typeof k == "function" ? k.apply(this, arguments) : k
      ), e.apply(this, arguments), s);
    }, null, O);
  }, m.translateTo = function(v, D, k, O, W) {
    m.transform(v, function() {
      var C = e.apply(this, arguments), A = this.__zoom, R = O == null ? _(C) : typeof O == "function" ? O.apply(this, arguments) : O;
      return n(Wn.translate(R[0], R[1]).scale(A.k).translate(
        typeof D == "function" ? -D.apply(this, arguments) : -D,
        typeof k == "function" ? -k.apply(this, arguments) : -k
      ), C, s);
    }, O, W);
  };
  function b(v, D) {
    return D = Math.max(r[0], Math.min(r[1], D)), D === v.k ? v : new Je(D, v.x, v.y);
  }
  function S(v, D, k) {
    var O = D[0] - k[0] * v.k, W = D[1] - k[1] * v.k;
    return O === v.x && W === v.y ? v : new Je(v.k, O, W);
  }
  function _(v) {
    return [(+v[0][0] + +v[1][0]) / 2, (+v[0][1] + +v[1][1]) / 2];
  }
  function M(v, D, k, O) {
    v.on("start.zoom", function() {
      L(this, arguments).event(O).start();
    }).on("interrupt.zoom end.zoom", function() {
      L(this, arguments).event(O).end();
    }).tween("zoom", function() {
      var W = this, C = arguments, A = L(W, C).event(O), R = e.apply(W, C), X = k == null ? _(R) : typeof k == "function" ? k.apply(W, C) : k, se = Math.max(R[1][0] - R[0][0], R[1][1] - R[0][1]), ne = W.__zoom, ie = typeof D == "function" ? D.apply(W, C) : D, ae = a(ne.invert(X).concat(se / ne.k), ie.invert(X).concat(se / ie.k));
      return function(ce) {
        if (ce === 1) ce = ie;
        else {
          var de = ae(ce), J = se / de[2];
          ce = new Je(J, X[0] - de[0] * J, X[1] - de[1] * J);
        }
        A.zoom(null, ce);
      };
    });
  }
  function L(v, D, k) {
    return !k && v.__zooming || new P(v, D);
  }
  function P(v, D) {
    this.that = v, this.args = D, this.active = 0, this.sourceEvent = null, this.extent = e.apply(v, D), this.taps = 0;
  }
  P.prototype = {
    event: function(v) {
      return v && (this.sourceEvent = v), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(v, D) {
      return this.mouse && v !== "mouse" && (this.mouse[1] = D.invert(this.mouse[0])), this.touch0 && v !== "touch" && (this.touch0[1] = D.invert(this.touch0[0])), this.touch1 && v !== "touch" && (this.touch1[1] = D.invert(this.touch1[0])), this.that.__zoom = D, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(v) {
      var D = Ve(this.that).datum();
      c.call(
        v,
        this.that,
        new wu(v, {
          sourceEvent: this.sourceEvent,
          target: m,
          transform: this.that.__zoom,
          dispatch: c
        }),
        D
      );
    }
  };
  function $(v, ...D) {
    if (!t.apply(this, arguments)) return;
    var k = L(this, D).event(v), O = this.__zoom, W = Math.max(r[0], Math.min(r[1], O.k * Math.pow(2, o.apply(this, arguments)))), C = Ze(v);
    if (k.wheel)
      (k.mouse[0][0] !== C[0] || k.mouse[0][1] !== C[1]) && (k.mouse[1] = O.invert(k.mouse[0] = C)), clearTimeout(k.wheel);
    else {
      if (O.k === W) return;
      k.mouse = [C, O.invert(C)], Rn(this), k.start();
    }
    Zt(v), k.wheel = setTimeout(A, p), k.zoom("mouse", n(S(b(O, W), k.mouse[0], k.mouse[1]), k.extent, s));
    function A() {
      k.wheel = null, k.end();
    }
  }
  function x(v, ...D) {
    if (u || !t.apply(this, arguments)) return;
    var k = v.currentTarget, O = L(this, D, !0).event(v), W = Ve(v.view).on("mousemove.zoom", X, !0).on("mouseup.zoom", se, !0), C = Ze(v, k), A = v.clientX, R = v.clientY;
    Qs(v.view), wo(v), O.mouse = [C, this.__zoom.invert(C)], Rn(this), O.start();
    function X(ne) {
      if (Zt(ne), !O.moved) {
        var ie = ne.clientX - A, ae = ne.clientY - R;
        O.moved = ie * ie + ae * ae > g;
      }
      O.event(ne).zoom("mouse", n(S(O.that.__zoom, O.mouse[0] = Ze(ne, k), O.mouse[1]), O.extent, s));
    }
    function se(ne) {
      W.on("mousemove.zoom mouseup.zoom", null), er(ne.view, O.moved), Zt(ne), O.event(ne).end();
    }
  }
  function E(v, ...D) {
    if (t.apply(this, arguments)) {
      var k = this.__zoom, O = Ze(v.changedTouches ? v.changedTouches[0] : v, this), W = k.invert(O), C = k.k * (v.shiftKey ? 0.5 : 2), A = n(S(b(k, C), O, W), e.apply(this, D), s);
      Zt(v), l > 0 ? Ve(this).transition().duration(l).call(M, A, O, v) : Ve(this).call(m.transform, A, O, v);
    }
  }
  function N(v, ...D) {
    if (t.apply(this, arguments)) {
      var k = v.touches, O = k.length, W = L(this, D, v.changedTouches.length === O).event(v), C, A, R, X;
      for (wo(v), A = 0; A < O; ++A)
        R = k[A], X = Ze(R, this), X = [X, this.__zoom.invert(X), R.identifier], W.touch0 ? !W.touch1 && W.touch0[2] !== X[2] && (W.touch1 = X, W.taps = 0) : (W.touch0 = X, C = !0, W.taps = 1 + !!d);
      d && (d = clearTimeout(d)), C && (W.taps < 2 && (f = X[0], d = setTimeout(function() {
        d = null;
      }, h)), Rn(this), W.start());
    }
  }
  function T(v, ...D) {
    if (this.__zooming) {
      var k = L(this, D).event(v), O = v.changedTouches, W = O.length, C, A, R, X;
      for (Zt(v), C = 0; C < W; ++C)
        A = O[C], R = Ze(A, this), k.touch0 && k.touch0[2] === A.identifier ? k.touch0[0] = R : k.touch1 && k.touch1[2] === A.identifier && (k.touch1[0] = R);
      if (A = k.that.__zoom, k.touch1) {
        var se = k.touch0[0], ne = k.touch0[1], ie = k.touch1[0], ae = k.touch1[1], ce = (ce = ie[0] - se[0]) * ce + (ce = ie[1] - se[1]) * ce, de = (de = ae[0] - ne[0]) * de + (de = ae[1] - ne[1]) * de;
        A = b(A, Math.sqrt(ce / de)), R = [(se[0] + ie[0]) / 2, (se[1] + ie[1]) / 2], X = [(ne[0] + ae[0]) / 2, (ne[1] + ae[1]) / 2];
      } else if (k.touch0) R = k.touch0[0], X = k.touch0[1];
      else return;
      k.zoom("touch", n(S(A, R, X), k.extent, s));
    }
  }
  function w(v, ...D) {
    if (this.__zooming) {
      var k = L(this, D).event(v), O = v.changedTouches, W = O.length, C, A;
      for (wo(v), u && clearTimeout(u), u = setTimeout(function() {
        u = null;
      }, h), C = 0; C < W; ++C)
        A = O[C], k.touch0 && k.touch0[2] === A.identifier ? delete k.touch0 : k.touch1 && k.touch1[2] === A.identifier && delete k.touch1;
      if (k.touch1 && !k.touch0 && (k.touch0 = k.touch1, delete k.touch1), k.touch0) k.touch0[1] = this.__zoom.invert(k.touch0[0]);
      else if (k.end(), k.taps === 2 && (A = Ze(A, this), Math.hypot(f[0] - A[0], f[1] - A[1]) < y)) {
        var R = Ve(this).on("dblclick.zoom");
        R && R.apply(this, arguments);
      }
    }
  }
  return m.wheelDelta = function(v) {
    return arguments.length ? (o = typeof v == "function" ? v : Ln(+v), m) : o;
  }, m.filter = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : Ln(!!v), m) : t;
  }, m.touchable = function(v) {
    return arguments.length ? (i = typeof v == "function" ? v : Ln(!!v), m) : i;
  }, m.extent = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : Ln([[+v[0][0], +v[0][1]], [+v[1][0], +v[1][1]]]), m) : e;
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
function Su(t, e) {
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
  const h = Cu().scaleExtent([o, i]).on("start", (P) => {
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
  const b = e.zoomActivationKeyCode !== void 0 ? e.zoomActivationKeyCode : null, S = (P) => {
    b && P.code === b && (m = !0);
  }, _ = (P) => {
    b && P.code === b && (m = !1);
  }, M = () => {
    m = !1;
  };
  b && (window.addEventListener("keydown", S), window.addEventListener("keyup", _), window.addEventListener("blur", M));
  const L = (P) => {
    if (e.isLocked?.()) return;
    const $ = P.ctrlKey || P.metaKey || m;
    if (!(p ? !$ : P.shiftKey)) return;
    P.preventDefault(), P.stopPropagation();
    const E = y;
    let N = 0, T = 0;
    g !== "horizontal" && (T = -P.deltaY * E), g !== "vertical" && (N = -P.deltaX * E, P.shiftKey && P.deltaX === 0 && g === "both" && (N = -P.deltaY * E, T = 0)), e.onScrollPan?.(N, T);
  };
  return t.addEventListener("wheel", L, { passive: !1, capture: !0 }), {
    setViewport(P, $) {
      const x = $?.duration ?? 0, E = Wn.translate(P.x ?? 0, P.y ?? 0).scale(P.zoom ?? 1);
      x > 0 ? l.transition().duration(x).call(h.transform, E) : l.call(h.transform, E);
    },
    getTransform() {
      return t.__zoom ?? Wn;
    },
    update(P) {
      if ((P.minZoom !== void 0 || P.maxZoom !== void 0) && h.scaleExtent([
        P.minZoom ?? o,
        P.maxZoom ?? i
      ]), P.pannable !== void 0 || P.zoomable !== void 0) {
        const $ = P.pannable ?? r, x = P.zoomable ?? s;
        h.filter(Xi({
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
      P.panOnScroll !== void 0 && (p = P.panOnScroll), P.panOnScrollDirection !== void 0 && (g = P.panOnScrollDirection), P.panOnScrollSpeed !== void 0 && (y = P.panOnScrollSpeed);
    },
    destroy() {
      t.removeEventListener("wheel", L, { capture: !0 }), c && (window.removeEventListener("keydown", d), window.removeEventListener("keyup", f), window.removeEventListener("blur", u)), b && (window.removeEventListener("keydown", S), window.removeEventListener("keyup", _), window.removeEventListener("blur", M)), l.on(".zoom", null);
    }
  };
}
function yr(t, e, n, o) {
  return {
    x: (t - o.left - n.x) / n.zoom,
    y: (e - o.top - n.y) / n.zoom
  };
}
function ku(t, e, n, o) {
  return {
    x: t * n.zoom + n.x + o.left,
    y: e * n.zoom + n.y + o.top
  };
}
const ve = 150, _e = 50;
function ho(t, e, n, o, i) {
  if (i % 360 === 0) return { x: t, y: e, width: n, height: o };
  const r = i * Math.PI / 180, s = Math.abs(Math.cos(r)), l = Math.abs(Math.sin(r)), a = n * s + o * l, c = n * l + o * s, d = t + n / 2, f = e + o / 2;
  return { x: d - a / 2, y: f - c / 2, width: a, height: c };
}
function Bt(t, e) {
  if (t.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  let n = 1 / 0, o = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const s of t) {
    const l = s.dimensions?.width ?? ve, a = s.dimensions?.height ?? _e, c = Wt(s, e), d = s.rotation ? ho(c.x, c.y, l, a, s.rotation) : { x: c.x, y: c.y, width: l, height: a };
    n = Math.min(n, d.x), o = Math.min(o, d.y), i = Math.max(i, d.x + d.width), r = Math.max(r, d.y + d.height);
  }
  return {
    x: n,
    y: o,
    width: i - n,
    height: r - o
  };
}
function Lu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = Wt(r, n), c = r.rotation ? ho(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l }, d = c.x + c.width, f = c.y + c.height;
    return !(d < e.x || c.x > o || f < e.y || c.y > i);
  });
}
function Pu(t, e, n) {
  const o = e.x + e.width, i = e.y + e.height;
  return t.filter((r) => {
    const s = r.dimensions?.width ?? ve, l = r.dimensions?.height ?? _e, a = Wt(r, n), c = r.rotation ? ho(a.x, a.y, s, l, r.rotation) : { x: a.x, y: a.y, width: s, height: l };
    return c.x >= e.x && c.y >= e.y && c.x + c.width <= o && c.y + c.height <= i;
  });
}
function jn(t, e, n, o, i, r = 0.1) {
  const s = Math.max(t.width, 1), l = Math.max(t.height, 1), a = s * (1 + r), c = l * (1 + r), d = e / a, f = n / c, u = Math.min(Math.max(Math.min(d, f), o), i), h = { x: t.x + s / 2, y: t.y + l / 2 }, p = e / 2 - h.x * u, g = n / 2 - h.y * u;
  return { x: p, y: g, zoom: u };
}
function Mu(t, e, n, o) {
  const i = 1 / t.zoom;
  return {
    minX: (0 - t.x) * i - o,
    minY: (0 - t.y) * i - o,
    maxX: (e - t.x) * i + o,
    maxY: (n - t.y) * i + o
  };
}
function Wt(t, e) {
  if (!t.position) return { x: 0, y: 0 };
  const n = t.nodeOrigin ?? e ?? [0, 0], o = t.dimensions?.width ?? ve, i = t.dimensions?.height ?? _e;
  return {
    x: t.position.x - o * n[0],
    y: t.position.y - i * n[1]
  };
}
let wr = !1;
function vr(t) {
  wr = t;
}
function q(t, e, n) {
  if (!wr) return;
  const o = `%c[AlpineFlow:${t}]`, i = Tu(t);
  n !== void 0 ? console.log(o, i, e, n) : console.log(o, i, e);
}
function Tu(t) {
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
const pn = "#64748b", di = "#d4d4d8", _r = "#ef4444", Au = "2", Nu = "6 3", Yi = 1.2, qo = 0.2, Fn = 5, Wi = 25;
class $u {
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
const Iu = 16;
function Du() {
  return typeof requestAnimationFrame == "function" ? {
    request: (t) => requestAnimationFrame(t),
    cancel: (t) => cancelAnimationFrame(t)
  } : {
    request: (t) => setTimeout(() => t(performance.now()), Iu),
    cancel: (t) => clearTimeout(t)
  };
}
class br {
  constructor() {
    this._scheduler = Du(), this._entries = [], this._postTickCallbacks = [], this._frameId = null, this._running = !1;
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
const Un = new br(), Ru = {
  linear: Hd,
  easeIn: Od,
  easeOut: zd,
  easeInOut: Vd,
  easeCubicIn: Bd,
  easeCubicOut: qd,
  easeCubicInOut: pr,
  easeCircIn: Kd,
  easeCircOut: Gd,
  easeCircInOut: Jd,
  easeSinIn: Xd,
  easeSinOut: Yd,
  easeSinInOut: Wd,
  easeExpoIn: jd,
  easeExpoOut: Ud,
  easeExpoInOut: Zd,
  easeBounce: Yn,
  easeBounceIn: au,
  easeBounceInOut: lu,
  easeElastic: hu,
  easeElasticIn: fu,
  easeElasticInOut: pu,
  easeBack: uu,
  easeBackIn: cu,
  easeBackOut: du
};
function xr(t) {
  const e = t ?? "auto";
  return e === !1 ? !1 : e === !0 ? !0 : typeof globalThis < "u" && globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === !0;
}
function Zn(t) {
  return typeof t == "function" ? t : Ru[t ?? "easeInOut"];
}
function et(t, e, n) {
  return t + (e - t) * n;
}
function ui(t, e, n) {
  return Ro(t, e)(n);
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
function Er(t, e, n) {
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
      const d = parseFloat(a[1]), f = parseFloat(c[1]), u = c[2] ?? "", h = et(d, f, n);
      o[r] = u ? `${h}${u}` : String(h);
      continue;
    }
    if (Ui.test(s) && Ui.test(l)) {
      o[r] = ui(s, l, n);
      continue;
    }
    o[r] = n < 0.5 ? s : l;
  }
  return o;
}
function Fu(t, e, n, o) {
  let i = et(t.zoom, e.zoom, n);
  return o?.minZoom !== void 0 && (i = Math.max(i, o.minZoom)), o?.maxZoom !== void 0 && (i = Math.min(i, o.maxZoom)), {
    x: et(t.x, e.x, n),
    y: et(t.y, e.y, n),
    zoom: i
  };
}
class Hu {
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
class Ou {
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
const Kt = {
  stiffness: 180,
  damping: 12,
  mass: 1,
  restVelocity: 0.01,
  restDisplacement: 0.01
};
function Cr(t, e, n) {
  if (n <= 0)
    return;
  const o = e.stiffness ?? Kt.stiffness, i = e.damping ?? Kt.damping, r = e.mass ?? Kt.mass, s = t.value - t.target, l = (-o * s - i * t.velocity) / r;
  t.velocity += l * n, t.value += t.velocity * n, Math.abs(t.velocity) < (e.restVelocity ?? Kt.restVelocity) && Math.abs(t.value - t.target) < (e.restDisplacement ?? Kt.restDisplacement) && (t.value = t.target, t.velocity = 0, t.settled = !0);
}
const Zi = {
  timeConstant: 350,
  restVelocity: 0.5
};
function fi(t, e, n) {
  if (n <= 0)
    return;
  const o = e.timeConstant ?? Zi.timeConstant, i = Math.exp(-n * 1e3 / o);
  t.velocity *= i, t.value += t.velocity * n, Math.abs(t.velocity) < Zi.restVelocity && (t.velocity = 0, t.settled = !0, t.target = t.value);
}
function hi(t) {
  const e = t.lastIndexOf("."), n = t.lastIndexOf(":"), o = Math.max(e, n);
  if (o < 0) return null;
  const i = t.slice(o + 1);
  return i.length === 0 || i.length > 6 ? null : i;
}
function Sr(t, e, n, o) {
  if (n <= 0)
    return;
  fi(t, {
    velocity: t.velocity,
    power: e.power,
    timeConstant: e.timeConstant
  }, n);
  const i = o ? hi(o) : null;
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
function kr(t, e, n, o) {
  const i = hi(o), r = e.values.map(
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
  const c = s[a], d = s[a + 1] ?? 1, f = d > c ? (l - c) / (d - c) : 1, u = r[a], h = r[a + 1] ?? r[a];
  t.value = u + (h - u) * Math.max(0, Math.min(1, f)), l >= 1 && (t.value = r[r.length - 1], t.settled = !0);
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
function Lr(t) {
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
function zu(t, e, n) {
  return typeof t == "number" && typeof e == "number" ? et(t, e, n) : Qi(t) && Qi(e) ? ui(t, e, n) : n < 0.5 ? t : e;
}
class Vu {
  constructor(e) {
    this._ownership = /* @__PURE__ */ new Map(), this._groups = /* @__PURE__ */ new Set(), this._nextGroupId = 0, this._registry = new Hu(), this._activeTransaction = null, this._engine = e;
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
    const e = new Ou();
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
      whileStopMode: p = "jump-end",
      motion: g,
      maxDuration: y = 5e3
    } = n, m = Zn(i), b = g ? Lr(g) : void 0;
    for (const v of e) {
      const D = this._ownership.get(v.key);
      if (D && !D.stopped) {
        const k = D.currentValues.get(v.key);
        k !== void 0 && (v.from = k), D.entries = D.entries.filter((O) => O.key !== v.key), D.entries.length === 0 && this._stop(D, "superseded");
      }
    }
    if (this._activeTransaction && this._activeTransaction.state === "active")
      for (const v of e)
        this._activeTransaction.captureProperty(v.key, v.from, v.apply);
    if (o <= 0) {
      const v = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
      for (const W of e)
        v.set(W.key, W.from), D.set(W.key, W.to);
      a?.();
      for (const W of e)
        W.apply(W.to);
      const k = [...f ? [f] : [], ...u ?? []], O = {
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
          return D;
        },
        finished: Promise.resolve(),
        get _snapshot() {
          return v;
        },
        get _target() {
          return D;
        }
      };
      return this._registry.register(O), queueMicrotask(() => this._registry.unregister(O)), this._activeTransaction && this._activeTransaction.state === "active" && this._activeTransaction.trackHandle(O), d?.(), O;
    }
    const S = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
    for (const v of e)
      S.set(v.key, v.from), _.set(v.key, v.to);
    let M;
    if (b) {
      M = /* @__PURE__ */ new Map();
      for (const v of e) {
        if (typeof v.from != "number" || typeof v.to != "number") {
          console.warn(
            `[AlpineFlow] motion: requires numeric properties. "${v.key}" is non-numeric; snapping to target.`
          ), v.apply(v.to);
          continue;
        }
        let D = 0;
        if (b.type === "decay" || b.type === "inertia") {
          const k = b.velocity;
          if (typeof k == "number")
            D = k;
          else if (k && typeof k == "object") {
            const W = k, C = hi(v.key);
            D = W[v.key] ?? (C ? W[C] ?? 0 : 0);
          }
          const O = b.power ?? 0.8;
          D *= O;
        }
        M.set(v.key, {
          value: v.from,
          velocity: D,
          target: v.to,
          settled: !1
        });
      }
      M.size === 0 && (M = void 0);
    }
    const L = s === "ping-pong" ? "reverse" : s, P = l === "end" ? "backward" : "forward";
    let $;
    const x = new Promise((v) => {
      $ = v;
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
      snapshot: S,
      target: _,
      _currentFinished: x,
      whilePredicate: h,
      whileStopMode: p,
      motionConfig: M ? b : void 0,
      physicsStates: M,
      maxDuration: y,
      isPhysics: !!M,
      _prevElapsed: 0
    };
    if (l === "end")
      for (const v of E.entries)
        v.apply(v.to), E.currentValues.set(v.key, v.to);
    else
      for (const v of E.entries)
        E.currentValues.set(v.key, v.from);
    for (const v of e)
      this._ownership.set(v.key, E);
    this._groups.add(E);
    const N = this._engine.register((v) => this._tick(E, v), r);
    E.engineHandle = N;
    const T = [...f ? [f] : [], ...u ?? []], w = {
      _tags: T.length > 0 ? T : void 0,
      pause: () => this._pause(E),
      resume: () => this._resume(E),
      stop: (v) => this._stop(E, v?.mode ?? "jump-end"),
      reverse: () => this._reverse(E),
      play: () => this._play(E),
      playForward: () => this._playDirection(E, "forward"),
      playBackward: () => this._playDirection(E, "backward"),
      restart: (v) => this._restart(E, v),
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
      const a = zu(l.from, l.to, s);
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
              Cr(d, e.motionConfig, i);
              break;
            case "decay":
              fi(d, e.motionConfig, i);
              break;
            case "inertia":
              Sr(d, e.motionConfig, i, c.key);
              break;
            case "keyframes": {
              const f = n - e.startTime, u = e.motionConfig.duration ?? e.maxDuration, h = Math.min(f / u, 1);
              kr(d, e.motionConfig, h, c.key);
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
const Pr = /* @__PURE__ */ new Map();
function Bu(t, e) {
  Pr.set(t, e);
}
function vo(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function It(t) {
  return typeof t == "string" ? { type: t } : t;
}
function Dt(t, e) {
  return `${e}__${t.type}__${(t.color ?? di).replace(/[^a-zA-Z0-9]/g, "_")}`;
}
function Kn(t, e) {
  const n = vo(t.color ?? di), o = Number(t.width ?? 12.5), i = Number(t.height ?? 12.5), r = Number.isFinite(o) && o > 0 ? o : 12.5, s = Number.isFinite(i) && i > 0 ? i : 12.5, l = vo(t.orient ?? "auto-start-reverse"), a = vo(e);
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
  const c = Pr.get(t.type);
  return c ? c({ id: a, color: n, width: r, height: s, orient: l }) : Kn({ ...t, type: "arrowclosed" }, e);
}
const yt = 200, wt = 150, qu = 1.2, Gt = "http://www.w3.org/2000/svg";
function Xu(t, e) {
  const { getState: n, setViewport: o, config: i } = e, r = i.minimapPosition ?? "bottom-right", s = i.minimapMaskColor, l = i.minimapNodeColor, a = document.createElement("div");
  a.className = `flow-minimap flow-minimap-${r}`;
  const c = document.createElementNS(Gt, "svg");
  c.setAttribute("width", String(yt)), c.setAttribute("height", String(wt));
  const d = document.createElementNS(Gt, "rect");
  d.classList.add("flow-minimap-bg"), d.setAttribute("width", String(yt)), d.setAttribute("height", String(wt));
  const f = document.createElementNS(Gt, "g");
  f.classList.add("flow-minimap-nodes");
  const u = document.createElementNS(Gt, "path");
  u.classList.add("flow-minimap-mask"), s && u.setAttribute("fill", s), u.setAttribute("fill-rule", "evenodd"), c.appendChild(d), c.appendChild(f), c.appendChild(u), a.appendChild(c), t.appendChild(a);
  let h = { x: 0, y: 0, width: 0, height: 0 }, p = 1;
  function g() {
    const N = n();
    if (h = Bt(N.nodes.filter((T) => !T.hidden), i.nodeOrigin), h.width === 0 && h.height === 0) {
      p = 1;
      return;
    }
    p = Math.max(
      h.width / yt,
      h.height / wt
    ) * qu;
  }
  function y(N) {
    return typeof l == "function" ? l(N) : l;
  }
  function m() {
    const N = n();
    g(), f.innerHTML = "";
    const T = (yt - h.width / p) / 2, w = (wt - h.height / p) / 2;
    for (const v of N.nodes) {
      if (v.hidden) continue;
      const D = document.createElementNS(Gt, "rect"), k = (v.dimensions?.width ?? ve) / p, O = (v.dimensions?.height ?? _e) / p, W = (v.position.x - h.x) / p + T, C = (v.position.y - h.y) / p + w;
      D.setAttribute("x", String(W)), D.setAttribute("y", String(C)), D.setAttribute("width", String(k)), D.setAttribute("height", String(O)), D.setAttribute("rx", "2");
      const A = y(v);
      A && (D.style.fill = A), f.appendChild(D);
    }
    b();
  }
  function b() {
    const N = e.getViewportState ? e.getViewportState() : n();
    if (h.width === 0 && h.height === 0) {
      u.setAttribute("d", "");
      return;
    }
    const T = (yt - h.width / p) / 2, w = (wt - h.height / p) / 2, v = (-N.viewport.x / N.viewport.zoom - h.x) / p + T, D = (-N.viewport.y / N.viewport.zoom - h.y) / p + w, k = N.containerWidth / N.viewport.zoom / p, O = N.containerHeight / N.viewport.zoom / p, W = `M0,0 H${yt} V${wt} H0 Z`, C = `M${v},${D} h${k} v${O} h${-k} Z`;
    u.setAttribute("d", `${W} ${C}`);
  }
  let S = !1;
  function _(N, T) {
    const w = (yt - h.width / p) / 2, v = (wt - h.height / p) / 2, D = (N - w) * p + h.x, k = (T - v) * p + h.y;
    return { x: D, y: k };
  }
  function M(N) {
    const T = c.getBoundingClientRect(), w = N.clientX - T.left, v = N.clientY - T.top, D = n(), k = _(w, v), O = -k.x * D.viewport.zoom + D.containerWidth / 2, W = -k.y * D.viewport.zoom + D.containerHeight / 2;
    o({ x: O, y: W, zoom: D.viewport.zoom });
  }
  function L(N) {
    i.minimapPannable && (S = !0, c.setPointerCapture(N.pointerId), M(N));
  }
  function P(N) {
    S && M(N);
  }
  function $(N) {
    S && (S = !1, c.releasePointerCapture(N.pointerId));
  }
  c.addEventListener("pointerdown", L), c.addEventListener("pointermove", P), c.addEventListener("pointerup", $);
  function x(N) {
    if (!i.minimapZoomable)
      return;
    N.preventDefault();
    const T = n(), w = i.minZoom ?? 0.5, v = i.maxZoom ?? 2, D = N.deltaY > 0 ? 0.9 : 1.1, k = Math.min(Math.max(T.viewport.zoom * D, w), v);
    o({ zoom: k });
  }
  c.addEventListener("wheel", x, { passive: !1 });
  function E() {
    c.removeEventListener("pointerdown", L), c.removeEventListener("pointermove", P), c.removeEventListener("pointerup", $), c.removeEventListener("wheel", x), a.remove();
  }
  return { render: m, updateViewport: b, destroy: E };
}
const Yu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>', Wu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>', ju = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>', es = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', Uu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', Zu = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>', ts = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V3h6"/><path d="M21 9V3h-6"/><path d="M3 15v6h6"/><path d="M21 15v6h-6"/></svg>', Ku = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6H3"/><path d="M15 3v6h6"/><path d="M9 21v-6H3"/><path d="M15 21v-6h6"/></svg>';
function Gu(t, e) {
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
    onToggleFullscreen: p
  } = e, g = document.createElement("div"), y = [
    "flow-controls",
    `flow-controls-${o}`
  ];
  a ? y.push("flow-controls-external") : y.push(`flow-controls-${n}`), g.className = y.join(" "), g.setAttribute("role", "toolbar"), g.setAttribute("aria-label", "Flow controls");
  let m = null, b = null;
  if (i) {
    const M = St(Yu, "Zoom in", c), L = St(Wu, "Zoom out", d);
    g.appendChild(M), g.appendChild(L);
  }
  if (r) {
    const M = St(ju, "Fit view", f);
    g.appendChild(M);
  }
  if (s && (m = St(es, "Toggle interactivity", u), g.appendChild(m)), l) {
    const M = St(Zu, "Reset panels", h);
    g.appendChild(M);
  }
  p && (b = St(ts, "Toggle fullscreen", p), b.classList.add("flow-controls-button-fullscreen"), g.appendChild(b)), g.addEventListener("mousedown", (M) => M.stopPropagation()), g.addEventListener("pointerdown", (M) => M.stopPropagation()), g.addEventListener("wheel", (M) => M.stopPropagation(), { passive: !1 }), t.appendChild(g);
  function S(M) {
    if (m && typeof M.isInteractive == "boolean") {
      Xo(m, M.isInteractive ? es : Uu);
      const L = M.isInteractive ? "Lock interactivity" : "Unlock interactivity";
      m.title = L, m.setAttribute("aria-label", L);
    }
    if (b && typeof M.isFullscreen == "boolean") {
      Xo(b, M.isFullscreen ? Ku : ts);
      const L = M.isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
      b.title = L, b.setAttribute("aria-label", L), b.classList.toggle("flow-controls-button-fullscreen--active", M.isFullscreen);
    }
  }
  function _() {
    g.remove();
  }
  return { update: S, destroy: _ };
}
function St(t, e, n) {
  const o = document.createElement("button");
  return o.type = "button", Xo(o, t), o.title = e, o.setAttribute("aria-label", e), o.addEventListener("click", n), o;
}
function Xo(t, e) {
  const o = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
  t.replaceChildren(o);
}
const ns = 5;
function Ju(t) {
  const e = document.createElement("div");
  e.className = "flow-selection-box", t.appendChild(e);
  let n = !1, o = 0, i = 0, r = 0, s = 0;
  function l(u, h, p = "partial") {
    o = u, i = h, r = u, s = h, n = !0, e.style.left = `${u}px`, e.style.top = `${h}px`, e.style.width = "0px", e.style.height = "0px", e.classList.remove("flow-selection-partial", "flow-selection-full"), e.classList.add("flow-selection-box-active", `flow-selection-${p}`);
  }
  function a(u, h) {
    if (!n)
      return;
    r = u, s = h;
    const p = Math.min(o, r), g = Math.min(i, s), y = Math.abs(r - o), m = Math.abs(s - i);
    e.style.left = `${p}px`, e.style.top = `${g}px`, e.style.width = `${y}px`, e.style.height = `${m}px`;
  }
  function c(u) {
    if (!n)
      return null;
    n = !1, e.classList.remove("flow-selection-box-active"), e.classList.remove("flow-selection-partial", "flow-selection-full");
    const h = Math.abs(r - o), p = Math.abs(s - i);
    if (h < ns && p < ns)
      return null;
    const g = Math.min(o, r), y = Math.min(i, s), m = (g - u.x) / u.zoom, b = (y - u.y) / u.zoom, S = h / u.zoom, _ = p / u.zoom;
    return { x: m, y: b, width: S, height: _ };
  }
  function d() {
    return n;
  }
  function f() {
    e.remove();
  }
  return { start: l, update: a, end: c, isActive: d, destroy: f };
}
const os = 3;
function Qu(t) {
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
    const u = i[i.length - 1], h = d - u.x, p = f - u.y;
    h * h + p * p < os * os || (i.push({ x: d, y: f }), n.setAttribute("points", i.map((g) => `${g.x},${g.y}`).join(" ")));
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
function pi(t, e, n) {
  if (n.length < 3) return !1;
  let o = !1;
  for (let i = 0, r = n.length - 1; i < n.length; r = i++) {
    const s = n[i].x, l = n[i].y, a = n[r].x, c = n[r].y;
    l > e != c > e && t < (a - s) * (e - l) / (c - l) + s && (o = !o);
  }
  return o;
}
function ef(t, e, n, o, i, r, s, l) {
  const a = n - t, c = o - e, d = s - i, f = l - r, u = a * f - c * d;
  if (Math.abs(u) < 1e-10) return !1;
  const h = i - t, p = r - e, g = (h * f - p * d) / u, y = (h * c - p * a) / u;
  return g >= 0 && g <= 1 && y >= 0 && y <= 1;
}
function tf(t, e) {
  const n = e.x, o = e.y, i = e.x + e.width, r = e.y + e.height, s = n + e.width / 2, l = o + e.height / 2;
  if (pi(s, l, t)) return !0;
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
    for (const [f, u, h, p] of a)
      if (ef(t[d].x, t[d].y, t[c].x, t[c].y, f, u, h, p))
        return !0;
  return !1;
}
function Mr(t) {
  const e = t.dimensions?.width ?? ve, n = t.dimensions?.height ?? _e;
  return t.rotation ? ho(t.position.x, t.position.y, e, n, t.rotation) : { x: t.position.x, y: t.position.y, width: e, height: n };
}
function nf(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Mr(n);
    return tf(e, o);
  });
}
function of(t, e) {
  return e.length < 3 ? [] : t.filter((n) => {
    if (n.hidden || n.selectable === !1) return !1;
    const o = Mr(n);
    return [
      { x: o.x, y: o.y },
      { x: o.x + o.width, y: o.y },
      { x: o.x + o.width, y: o.y + o.height },
      { x: o.x, y: o.y + o.height }
    ].every((r) => pi(r.x, r.y, e));
  });
}
function sf(t, e) {
  return e.filter((n) => n.source === t || n.target === t);
}
function Yo(t, e, n) {
  const o = new Set(
    n.filter((i) => i.source === t).map((i) => i.target)
  );
  return e.filter((i) => o.has(i.id));
}
function rf(t, e, n) {
  const o = new Set(
    n.filter((i) => i.target === t).map((i) => i.source)
  );
  return e.filter((i) => o.has(i.id));
}
function af(t, e, n) {
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
function lf(t, e, n, o = !1) {
  return n.some((i) => o ? i.source === t && i.target === e : i.source === t && i.target === e || i.source === e && i.target === t);
}
function cf(t, e, n) {
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
          const p = `${u.source}|${h.target}|${u.sourceHandle ?? ""}|${h.targetHandle ?? ""}`;
          if (i.has(p) || s.has(p)) continue;
          const g = {
            id: `reconnect-${u.source}-${h.target}-${l++}`,
            source: u.source,
            target: h.target,
            sourceHandle: u.sourceHandle,
            targetHandle: h.targetHandle
          };
          u.type && (g.type = u.type), u.animated !== void 0 && (g.animated = u.animated), u.style && (g.style = u.style), u.class && (g.class = u.class), u.markerEnd && (g.markerEnd = u.markerEnd), u.markerStart && (g.markerStart = u.markerStart), u.label && (g.label = u.label), s.add(p), r.push(g);
        }
  }
  return r;
}
function at(t, e, n) {
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
function lt(t, e, n) {
  return !(t.source === t.target || e.some(
    (i) => i.source === t.source && i.target === t.target && i.sourceHandle === t.sourceHandle && i.targetHandle === t.targetHandle
  ) || n?.preventCycles && af(t.source, t.target, e));
}
const ct = "_flowHandleValidate";
function df(t) {
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
        typeof l == "function" ? e[ct] = l : (delete e[ct], requestAnimationFrame(() => {
          const a = t.$data(e);
          a && typeof a[n] == "function" && (e[ct] = a[n]);
        }));
      }
      i(() => {
        s();
      }), r(() => {
        delete e[ct];
      });
    }
  );
}
const xt = "_flowHandleLimit";
function uf(t) {
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
const Rt = "_flowHandleConnectableStart", dt = "_flowHandleConnectableEnd";
function ff(t) {
  t.directive(
    "flow-handle-connectable",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("start"), a = o.includes("end"), c = l || !l && !a, d = a || !l && !a;
      r(() => {
        const f = n ? !!i(n) : !0;
        c && (e[Rt] = f), d && (e[dt] = f);
      }), s(() => {
        delete e[Rt], delete e[dt];
      });
    }
  );
}
function vn(t, e, n = !0) {
  return e !== void 0 ? e : t.locked ? !1 : n;
}
function Tr(t) {
  return vn(t, t.draggable);
}
function hf(t) {
  return vn(t, t.deletable);
}
function ze(t) {
  return vn(t, t.connectable);
}
function Wo(t) {
  return vn(t, t.selectable);
}
function is(t) {
  return vn(t, t.resizable);
}
function qt(t, e, n, o, i, r, s) {
  const l = n - t, a = o - e, c = i - n, d = r - o;
  if (l === 0 && c === 0 || a === 0 && d === 0)
    return `L${n},${o}`;
  const f = Math.sqrt(l * l + a * a), u = Math.sqrt(c * c + d * d), h = Math.min(s, f / 2, u / 2), p = n - l / f * h, g = o - a / f * h, y = n + c / u * h, m = o + d / u * h;
  return `L${p},${g} Q${n},${o} ${y},${m}`;
}
function _n({
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
function Pn(t, e) {
  return t >= 0 ? 0.5 * t : e * 25 * Math.sqrt(-t);
}
function pf({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  curvature: s = 0.25
}) {
  const l = n === "left" || n === "right", a = r === "left" || r === "right", c = l ? t + (n === "right" ? 1 : -1) * Pn(
    n === "right" ? o - t : t - o,
    s
  ) : t, d = l ? e : e + (n === "bottom" ? 1 : -1) * Pn(
    n === "bottom" ? i - e : e - i,
    s
  ), f = a ? o + (r === "right" ? 1 : -1) * Pn(
    r === "right" ? t - o : o - t,
    s
  ) : o, u = a ? i : i + (r === "bottom" ? 1 : -1) * Pn(
    r === "bottom" ? e - i : i - e,
    s
  );
  return [c, d, f, u];
}
function Gn(t) {
  const { sourceX: e, sourceY: n, targetX: o, targetY: i } = t, [r, s, l, a] = pf(t), c = `M${e},${n} C${r},${s} ${l},${a} ${o},${i}`, { x: d, y: f, offsetX: u, offsetY: h } = _n({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function Zm({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = (t + n) / 2, r = `M${t},${e} C${i},${e} ${i},${o} ${n},${o}`, { x: s, y: l, offsetX: a, offsetY: c } = _n({ sourceX: t, sourceY: e, targetX: n, targetY: o });
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
function gf(t, e, n, o, i, r, s) {
  const l = ss(n), a = ss(r), c = t + l.x * s, d = e + l.y * s, f = o + a.x * s, u = i + a.y * s, h = n === "left" || n === "right";
  if (h === (r === "left" || r === "right")) {
    const g = (c + f) / 2, y = (d + u) / 2;
    return h ? [
      [c, e],
      [g, e],
      [g, i],
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
function mn({
  sourceX: t,
  sourceY: e,
  sourcePosition: n = "bottom",
  targetX: o,
  targetY: i,
  targetPosition: r = "top",
  borderRadius: s = 5,
  offset: l = 10
}) {
  const a = gf(
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
      const [m, b] = p === 1 ? [t, e] : a[p - 1], [S, _] = a[p + 1];
      c += ` ${qt(m, b, g, y, S, _, s)}`;
    } else
      c += ` L${g},${y}`;
  }
  c += ` L${o},${i}`;
  const { x: d, y: f, offsetX: u, offsetY: h } = _n({ sourceX: t, sourceY: e, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function mf(t) {
  return mn({ ...t, borderRadius: 0 });
}
function Ar({
  sourceX: t,
  sourceY: e,
  targetX: n,
  targetY: o
}) {
  const i = `M${t},${e} L${n},${o}`, { x: r, y: s, offsetX: l, offsetY: a } = _n({ sourceX: t, sourceY: e, targetX: n, targetY: o });
  return {
    path: i,
    labelPosition: { x: r, y: s },
    labelOffsetX: l,
    labelOffsetY: a
  };
}
const it = 40;
function yf(t, e, n, o) {
  let i = 0, r = 0;
  const s = t - n.left, l = n.right - t, a = e - n.top, c = n.bottom - e;
  return s < it && s >= 0 ? i = -o * (1 - s / it) : l < it && l >= 0 && (i = o * (1 - l / it)), a < it && a >= 0 ? r = -o * (1 - a / it) : c < it && c >= 0 && (r = o * (1 - c / it)), { dx: i, dy: r };
}
function Nr(t) {
  const { container: e, speed: n, onPan: o } = t;
  let i = null, r = 0, s = 0, l = !1;
  function a() {
    if (!l)
      return;
    const c = e.getBoundingClientRect(), { dx: d, dy: f } = yf(r, s, c, n);
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
function Ft(t) {
  const e = t.connectionLineType ?? "straight", o = {
    stroke: (t.invalid ? (t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-connection-line-invalid").trim() : "") || _r : null) ?? t.connectionLineStyle?.stroke ?? ((t.containerEl ? getComputedStyle(t.containerEl).getPropertyValue("--flow-edge-stroke-selected").trim() : "") || pn),
    strokeWidth: t.connectionLineStyle?.strokeWidth ?? Number(Au),
    strokeDasharray: t.connectionLineStyle?.strokeDasharray ?? Nu
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
    let p;
    switch (e) {
      case "bezier": {
        p = Gn({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      case "smoothstep": {
        p = mn({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      case "step": {
        p = mf({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
        break;
      }
      default: {
        p = Ar({ sourceX: d, sourceY: f, targetX: u, targetY: h }).path;
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
function rn(t) {
  if (t.connectionSnapRadius <= 0)
    return { element: null, position: t.cursorFlowPos };
  const e = t.connectionMode === "loose" ? "[data-flow-handle-type]" : `[data-flow-handle-type="${t.handleType}"]`, n = t.containerEl.querySelectorAll(e);
  let o = null, i = t.cursorFlowPos, r = t.connectionSnapRadius;
  return n.forEach((s) => {
    const l = s, a = l.closest("[x-flow-node]");
    if (!a || a.dataset.flowNodeId === t.excludeNodeId || t.targetNodeId && a.dataset.flowNodeId !== t.targetNodeId) return;
    const c = a.dataset.flowNodeId;
    if (c) {
      const p = t.getNode(c);
      if (p && !ze(p)) return;
    }
    const d = t.handleType === "target" ? dt : Rt;
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
function Jn(t, e, n, o) {
  if (e._config?.autoPanOnConnect === !1) return null;
  const i = Nr({
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
let nn = 0;
const Mn = /* @__PURE__ */ new WeakMap();
function Ke(t, e) {
  const n = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.source)}"]`
  );
  if (n) {
    const i = e.sourceHandle ?? "source", r = n.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="source"]`
    ) ?? n.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[ct] && !r[ct](e))
      return !1;
  }
  const o = t.querySelector(
    `[data-flow-node-id="${CSS.escape(e.target)}"]`
  );
  if (o) {
    const i = e.targetHandle ?? "target", r = o.querySelector(
      `[data-flow-handle-id="${CSS.escape(i)}"][data-flow-handle-type="target"]`
    ) ?? o.querySelector(`[data-flow-handle-id="${CSS.escape(i)}"]`);
    if (r?.[ct] && !r[ct](e))
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
function an(t, e, n, o, i) {
  const r = i ? o.edges.filter((l) => l.id !== i) : o.edges, s = t.querySelectorAll('[data-flow-handle-type="target"]');
  for (const l of s) {
    const c = l.closest("[x-flow-node]")?.dataset.flowNodeId;
    if (!c) continue;
    const d = l.dataset.flowHandleId ?? "target";
    if (l[dt] === !1) {
      l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid", "flow-handle-limit-reached");
      continue;
    }
    const f = {
      source: e,
      sourceHandle: n,
      target: c,
      targetHandle: d
    }, h = o.getNode(c)?.connectable !== !1 && lt(f, r, { preventCycles: o._config?.preventCycles }), p = h && Ge(t, f, r);
    p && Ke(t, f) && (!o._config?.isValidConnection || o._config.isValidConnection(f)) ? (l.classList.add("flow-handle-valid"), l.classList.remove("flow-handle-invalid", "flow-handle-limit-reached")) : (l.classList.add("flow-handle-invalid"), l.classList.remove("flow-handle-valid"), h && !p ? l.classList.add("flow-handle-limit-reached") : l.classList.remove("flow-handle-limit-reached"));
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
async function $r(t) {
  const { edge: e, newConnection: n, canvas: o, containerEl: i } = t, r = t.endpoint ?? "target", s = o.edges.filter(
    (c) => c.id !== e.id
  ), l = (c) => (Ae(i, {
    source: n.source,
    target: n.target,
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle,
    reason: c
  }), { applied: !1, reason: c });
  if (!lt(n, s, { preventCycles: o._config?.preventCycles }) || !at(n, o._config?.connectionRules, o._nodeMap) || !Ge(i, n, s) || !Ke(i, n) || o._config?.isValidConnection && !o._config.isValidConnection(n))
    return l();
  const a = o._config?.connectValidator;
  if (a) {
    const c = o._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: d, targetEl: f } = eo(i, n);
    o._connectValidating = !0;
    let u;
    try {
      u = await Qn(
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
async function Ir(t) {
  const { connection: e, canvas: n, containerEl: o } = t, i = n.edges, r = (d) => (Ae(o, {
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    reason: d
  }), { applied: !1, reason: d }), s = n.getNode?.(e.target);
  if (s && !ze(s) || !lt(e, i, { preventCycles: n._config?.preventCycles }) || !at(e, n._config?.connectionRules, n._nodeMap) || !Ge(o, e, i) || !Ke(o, e) || n._config?.isValidConnection && !n._config.isValidConnection(e))
    return r();
  const l = n._config?.connectValidator;
  if (l) {
    const d = n._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: f, targetEl: u } = eo(o, e);
    n._connectValidating = !0;
    let h;
    try {
      h = await Qn(
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
  const c = { id: `e-${e.source}-${e.target}-${Date.now()}-${nn++}`, ...e };
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
function wf(t) {
  t.directive(
    "flow-handle",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = n === "source" ? "source" : "target", c = o.includes("top"), d = o.includes("bottom"), f = o.includes("left"), u = o.includes("right"), h = c || d || f || u;
      let p;
      c && f ? p = "top-left" : c && u ? p = "top-right" : d && f ? p = "bottom-left" : d && u ? p = "bottom-right" : c ? p = "top" : u ? p = "right" : d ? p = "bottom" : f ? p = "left" : p = e.getAttribute("data-flow-handle-position") ?? (a === "source" ? "bottom" : "top");
      let g, y = !1;
      if (i) {
        const _ = r(i);
        _ && typeof _ == "object" && !Array.isArray(_) ? (g = _.id || e.getAttribute("data-flow-handle-id") || a, _.position && (p = _.position, y = !0)) : g = _ || e.getAttribute("data-flow-handle-id") || a;
      } else
        g = e.getAttribute("data-flow-handle-id") || a;
      if (o.includes("hidden") && (e.style.display = "none"), e.dataset.flowHandleType = a, e.dataset.flowHandlePosition = p, e.dataset.flowHandleId = g, h && (e.dataset.flowHandleExplicit = "true"), y && i && (e.dataset.flowHandleExplicit = "true", s(() => {
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
          const M = _();
          if (!M) return;
          const L = a === "source" ? M.sourcePosition : M.targetPosition;
          L && (e.dataset.flowHandlePosition = L);
        });
      }
      e.classList.add("flow-handle", `flow-handle-${a}`);
      const m = () => {
        const _ = e.closest("[x-flow-node]");
        return _ ? _.getAttribute("data-flow-node-id") ?? null : null;
      }, b = () => {
        const _ = e.closest("[x-data]");
        return _ ? t.$data(_) : null;
      };
      let S = null;
      if (b()?._config?.keyboardConnect) {
        e.setAttribute("tabindex", "0"), e.setAttribute("role", "button"), e.setAttribute("aria-label", `${a} handle ${g}`);
        const M = ($) => {
          const x = $?._pendingKeyboardConnect;
          if (!x) return;
          const E = e.closest(".flow-container");
          E && E.querySelector(
            `[data-flow-node-id="${CSS.escape(x.sourceNodeId)}"] [data-flow-handle-id="${CSS.escape(x.sourceHandleId)}"][data-flow-handle-type="source"]`
          )?.classList.remove("flow-handle-connect-pending"), $ && ($._pendingKeyboardConnect = null);
        }, L = ($) => {
          if (!($.key === "Enter" || $.key === " " || $.key === "Spacebar")) return;
          const E = b();
          if (!E || E._animationLocked) return;
          const N = m();
          if (N)
            if (a === "source") {
              const T = E.getNode?.(N);
              if (T && !ze(T) || e[Rt] === !1) return;
              $.preventDefault(), $.stopPropagation(), M(E), E._pendingKeyboardConnect = {
                sourceNodeId: N,
                sourceHandleId: g
              }, e.classList.add("flow-handle-connect-pending"), E._announcer?.announce?.(`Connecting from ${a} handle ${g}. Focus a target handle and press Enter to connect.`);
            } else {
              if (!E._pendingKeyboardConnect) return;
              const T = E.getNode?.(N);
              if (T && !ze(T) || e[dt] === !1) return;
              $.preventDefault(), $.stopPropagation();
              const { sourceNodeId: w, sourceHandleId: v } = E._pendingKeyboardConnect, D = {
                source: w,
                sourceHandle: v,
                target: N,
                targetHandle: g
              }, k = e.closest(".flow-container");
              if (M(E), !k) return;
              Ir({ connection: D, canvas: E, containerEl: k }).then((O) => {
                O.applied && E._announcer?.announce?.(`Connected ${w} to ${N}.`);
              });
            }
        };
        e.addEventListener("keydown", L);
        const P = e.closest(".flow-container");
        if (P) {
          const $ = Mn.get(P);
          if ($)
            $.count += 1;
          else {
            const x = (E) => {
              if (E.key !== "Escape") return;
              const N = P.matches("[x-data]") ? P : P.closest("[x-data]") ?? P.querySelector("[x-data]");
              if (!N) return;
              const T = t.$data(N);
              T?._pendingKeyboardConnect && M(T);
            };
            P.addEventListener("keydown", x), Mn.set(P, { count: 1, handler: x });
          }
        }
        S = () => {
          if (e.removeEventListener("keydown", L), P) {
            const $ = Mn.get(P);
            $ && ($.count -= 1, $.count <= 0 && (P.removeEventListener("keydown", $.handler), Mn.delete(P)));
          }
          e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), e.classList.remove("flow-handle-connect-pending");
        };
      }
      if (a === "source") {
        let _ = null;
        const M = ($) => {
          $.preventDefault(), $.stopPropagation();
          const x = b(), E = e.closest("[x-flow-node]");
          if (!x || !E || x._animationLocked) return;
          const N = E.dataset.flowNodeId;
          if (!N) return;
          const T = x.getNode(N);
          if (T && !ze(T) || e[Rt] === !1) return;
          const w = $.clientX, v = $.clientY;
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
          let k = null, O = null, W = null, C = null, A = null;
          const R = x._config?.connectionSnapRadius ?? 20, X = e.closest(".flow-container");
          let se = 0, ne = 0, ie = !1, ae = /* @__PURE__ */ new Map();
          const ce = () => {
            if (D = !0, q("connection", `Connection drag started from node "${N}" handle "${g}"`), x._emit("connect-start", { source: N, sourceHandle: g }), !X) return;
            O = Ft({
              connectionLineType: x._config?.connectionLineType,
              connectionLineStyle: x._config?.connectionLineStyle,
              connectionLine: x._config?.connectionLine,
              containerEl: X
            }), k = O.svg;
            const F = e.getBoundingClientRect(), K = X.getBoundingClientRect(), U = x._viewportLive ?? x.viewport, V = U?.zoom || 1, I = U?.x || 0, re = U?.y || 0;
            se = (F.left + F.width / 2 - K.left - I) / V, ne = (F.top + F.height / 2 - K.top - re) / V, O.update({ fromX: se, fromY: ne, toX: se, toY: ne, source: N, sourceHandle: g });
            const G = X.querySelector(".flow-viewport");
            if (G && G.appendChild(k), x.pendingConnection = {
              source: N,
              sourceHandle: g,
              position: { x: se, y: ne }
            }, C = Jn(X, x, w, v), an(X, N, g, x), x._config?.onEdgeDrop) {
              const Y = x._config.edgeDropPreview, z = Y ? Y({ source: N, sourceHandle: g }) : "New Node";
              if (z !== null) {
                A = document.createElement("div"), A.className = "flow-ghost-node";
                const oe = document.createElement("div");
                if (oe.className = "flow-ghost-handle", A.appendChild(oe), typeof z == "string") {
                  const j = document.createElement("span");
                  j.textContent = z, A.appendChild(j);
                } else
                  A.appendChild(z);
                A.style.left = `${se}px`, A.style.top = `${ne}px`;
                const B = X.querySelector(".flow-viewport");
                B && B.appendChild(A);
              }
            }
          }, de = () => {
            const F = [...x.selectedNodes], K = [], U = X.getBoundingClientRect(), V = x._viewportLive ?? x.viewport, I = V?.zoom || 1, re = V?.x || 0, G = V?.y || 0;
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
            ie = !0, O && (ae.set(N, {
              line: O,
              sourceNodeId: N,
              sourceHandleId: g,
              sourcePos: { x: se, y: ne },
              valid: !0
            }), O = null);
            const K = de(), U = X.querySelector(".flow-viewport");
            for (const V of K) {
              const I = Ft({
                connectionLineType: x._config?.connectionLineType,
                connectionLineStyle: x._config?.connectionLineStyle,
                connectionLine: x._config?.connectionLine,
                containerEl: X
              });
              I.update({
                fromX: V.pos.x,
                fromY: V.pos.y,
                toX: F.x,
                toY: F.y,
                source: V.nodeId,
                sourceHandle: V.handleId
              }), U && U.appendChild(I.svg), ae.set(V.nodeId, {
                line: I,
                sourceNodeId: V.nodeId,
                sourceHandleId: V.handleId,
                sourcePos: V.pos,
                valid: !0
              });
            }
          }, le = (F) => {
            if (!D) {
              const V = F.clientX - w, I = F.clientY - v;
              if (Math.abs(V) >= Fn || Math.abs(I) >= Fn) {
                if (ce(), x._config?.multiConnect && x.selectedNodes.size > 1 && x.selectedNodes.has(N)) {
                  const re = x.screenToFlowPosition(F.clientX, F.clientY);
                  J(re);
                }
              } else
                return;
            }
            const K = x.screenToFlowPosition(F.clientX, F.clientY);
            if (ie) {
              const V = rn({
                containerEl: X,
                handleType: "target",
                excludeNodeId: N,
                cursorFlowPos: K,
                connectionSnapRadius: R,
                getNode: (te) => x.getNode(te),
                toFlowPosition: (te, z) => x.screenToFlowPosition(te, z),
                connectionMode: x._config?.connectionMode
              });
              V.element !== W && (W?.classList.remove("flow-handle-active"), V.element?.classList.add("flow-handle-active"), W = V.element);
              const re = V.element?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, G = V.element?.dataset.flowHandleId ?? "target", Y = x._config?.connectionLineStyle?.stroke ?? (getComputedStyle(X).getPropertyValue("--flow-edge-stroke-selected").trim() || pn);
              for (const te of ae.values())
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
                  }, Z = x.getNode(re)?.connectable !== !1 && te.sourceNodeId !== re && lt(z, x.edges, { preventCycles: x._config?.preventCycles }) && at(z, x._config?.connectionRules, x._nodeMap) && Ge(X, z, x.edges) && Ke(X, z) && (!x._config?.isValidConnection || x._config.isValidConnection(z));
                  te.valid = Z;
                  const ue = te.line.svg.querySelector("path");
                  if (ue)
                    if (Z)
                      ue.setAttribute("stroke", Y);
                    else {
                      const he = getComputedStyle(X).getPropertyValue("--flow-connection-line-invalid").trim() || _r;
                      ue.setAttribute("stroke", he);
                    }
                } else {
                  te.valid = !0;
                  const z = te.line.svg.querySelector("path");
                  z && z.setAttribute("stroke", Y);
                }
              x.pendingConnection = { ...x.pendingConnection, position: V.position }, C?.updatePointer(F.clientX, F.clientY);
              return;
            }
            const U = rn({
              containerEl: X,
              handleType: "target",
              excludeNodeId: N,
              cursorFlowPos: K,
              connectionSnapRadius: R,
              getNode: (V) => x.getNode(V),
              toFlowPosition: (V, I) => x.screenToFlowPosition(V, I)
            });
            U.element !== W && (W?.classList.remove("flow-handle-active"), U.element?.classList.add("flow-handle-active"), W = U.element), A ? U.element ? (A.style.display = "none", O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: N, sourceHandle: g })) : (A.style.display = "", A.style.left = `${K.x}px`, A.style.top = `${K.y}px`, O?.update({ fromX: se, fromY: ne, toX: K.x, toY: K.y, source: N, sourceHandle: g })) : O?.update({ fromX: se, fromY: ne, toX: U.position.x, toY: U.position.y, source: N, sourceHandle: g }), x.pendingConnection = { ...x.pendingConnection, position: U.position }, C?.updatePointer(F.clientX, F.clientY);
          }, ee = async (F) => {
            if (C?.stop(), C = null, document.removeEventListener("pointermove", le), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), _ = null, x._connectValidating) return;
            if (ie) {
              const I = x.screenToFlowPosition(F.clientX, F.clientY);
              let re = W;
              re || (re = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]'));
              const Y = re?.closest("[x-flow-node]")?.dataset.flowNodeId ?? null, te = re?.dataset.flowHandleId ?? "target", z = [], oe = [], B = [], j = [];
              if (re && Y) {
                const H = x.getNode(Y);
                for (const Q of ae.values()) {
                  const Z = {
                    source: Q.sourceNodeId,
                    sourceHandle: Q.sourceHandleId,
                    target: Y,
                    targetHandle: te
                  };
                  if (H?.connectable !== !1 && Q.sourceNodeId !== Y && lt(Z, x.edges, { preventCycles: x._config?.preventCycles }) && at(Z, x._config?.connectionRules, x._nodeMap) && Ge(X, Z, x.edges) && Ke(X, Z) && (!x._config?.isValidConnection || x._config.isValidConnection(Z))) {
                    const Te = `e-${Q.sourceNodeId}-${Y}-${Date.now()}-${nn++}`;
                    z.push({ id: Te, ...Z }), oe.push(Z), j.push(Q);
                  } else
                    B.push(Q);
                }
              } else
                B.push(...ae.values());
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
                source: N,
                sourceHandle: g,
                position: I
              }), ae.clear(), ie = !1, Pe(X), x.pendingConnection = null, x._container?.classList.remove("flow-connecting");
              return;
            }
            if (!D) {
              x._config?.connectOnClick !== !1 && (q("connection", `Click-to-connect started from node "${N}" handle "${g}"`), x._emit("connect-start", { source: N, sourceHandle: g }), x.pendingConnection = {
                source: N,
                sourceHandle: g,
                position: { x: 0, y: 0 }
              }, x._container?.classList.add("flow-connecting"), an(X, N, g, x));
              return;
            }
            const K = O?.svg ?? null;
            A?.remove(), A = null, W?.classList.remove("flow-handle-active"), Pe(X);
            const U = x.screenToFlowPosition(F.clientX, F.clientY), V = { source: N, sourceHandle: g, position: U };
            try {
              let I = W;
              if (I || (I = document.elementFromPoint(F.clientX, F.clientY)?.closest('[data-flow-handle-type="target"]')), I) {
                const G = I.closest("[x-flow-node]")?.dataset.flowNodeId, Y = I.dataset.flowHandleId ?? "target";
                if (G) {
                  if (I[dt] === !1) {
                    q("connection", "Connection rejected (handle not connectable end)"), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                    return;
                  }
                  const te = x.getNode(G);
                  if (te && !ze(te)) {
                    q("connection", `Connection rejected (target "${G}" not connectable)`), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                    return;
                  }
                  const z = {
                    source: N,
                    sourceHandle: g,
                    target: G,
                    targetHandle: Y
                  };
                  if (lt(z, x.edges, { preventCycles: x._config?.preventCycles })) {
                    if (!at(z, x._config?.connectionRules, x._nodeMap)) {
                      q("connection", "Connection rejected (connection rules)", z), Ae(X, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (!Ge(X, z, x.edges)) {
                      q("connection", "Connection rejected (handle limit)", z), Ae(X, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (!Ke(X, z)) {
                      q("connection", "Connection rejected (per-handle validator)", z), Ae(X, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    if (x._config?.isValidConnection && !x._config.isValidConnection(z)) {
                      q("connection", "Connection rejected (custom validator)", z), Ae(X, z), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                      return;
                    }
                    const oe = x._config?.connectValidator;
                    if (oe) {
                      const j = x._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: H, targetEl: Q } = eo(X, z);
                      x._connectValidating = !0, _t(K, !0);
                      let Z;
                      try {
                        Z = await Qn(
                          oe,
                          z,
                          H,
                          Q,
                          X,
                          j
                        );
                      } finally {
                        x._connectValidating = !1, _t(K, !1);
                      }
                      if (!Z.allowed) {
                        q("connection", "Connection rejected (async connectValidator)", { connection: z, reason: Z.reason }), Ae(X, { ...z, reason: Z.reason }), x._emit("connect-end", { connection: null, ...V }), x.pendingConnection = null;
                        return;
                      }
                    }
                    const B = `e-${N}-${G}-${Date.now()}-${nn++}`;
                    x.addEdges({ id: B, ...z }), q("connection", `Connection created: ${N} → ${G}`, z), x._emit("connect", { connection: z }), x._emit("connect-end", { connection: z, ...V });
                  } else
                    q("connection", "Connection rejected (invalid)", z), Ae(X, z), x._emit("connect-end", { connection: null, ...V });
                } else
                  x._emit("connect-end", { connection: null, ...V });
              } else if (x._config?.onEdgeDrop) {
                const re = {
                  x: U.x - ve / 2,
                  y: U.y - _e / 2
                }, G = x._config.onEdgeDrop({
                  source: N,
                  sourceHandle: g,
                  position: re
                });
                if (G) {
                  const Y = {
                    source: N,
                    sourceHandle: g,
                    target: G.id,
                    targetHandle: "target"
                  };
                  if (!Ge(X, Y, x.edges))
                    q("connection", "Edge drop: connection rejected (handle limit)"), x._emit("connect-end", { connection: null, ...V });
                  else if (!Ke(X, Y))
                    q("connection", "Edge drop: connection rejected (per-handle validator)"), x._emit("connect-end", { connection: null, ...V });
                  else if (!x._config.isValidConnection || x._config.isValidConnection(Y)) {
                    x.addNodes(G);
                    const te = `e-${N}-${G.id}-${Date.now()}-${nn++}`;
                    x.addEdges({ id: te, ...Y }), q("connection", `Edge drop: created node "${G.id}" and edge`, Y), x._emit("connect", { connection: Y }), x._emit("connect-end", { connection: Y, ...V });
                  } else
                    q("connection", "Edge drop: connection rejected by validator"), x._emit("connect-end", { connection: null, ...V });
                } else
                  q("connection", "Edge drop: callback returned null"), x._emit("connect-end", { connection: null, ...V });
              } else
                q("connection", "Connection cancelled (no target)"), x._emit("connect-end", { connection: null, ...V });
            } finally {
              _t(K, !1), O?.destroy(), O = null;
            }
            x.pendingConnection = null;
          };
          document.addEventListener("pointermove", le), document.addEventListener("pointerup", ee), document.addEventListener("pointercancel", ee), _ = () => {
            document.removeEventListener("pointermove", le), document.removeEventListener("pointerup", ee), document.removeEventListener("pointercancel", ee), C?.stop(), O?.destroy(), O = null, A?.remove(), A = null;
            for (const F of ae.values())
              F.line.destroy();
            ae.clear(), ie = !1, W?.classList.remove("flow-handle-active"), Pe(X), x.pendingConnection = null, x._container?.classList.remove("flow-connecting");
          };
        };
        e.addEventListener("pointerdown", M);
        const L = () => {
          const $ = b();
          if (!$?._pendingReconnection || $._pendingReconnection.draggedEnd !== "source") return;
          const x = m();
          if (x) {
            const E = $.getNode(x);
            if (E && !ze(E)) return;
          }
          e[Rt] !== !1 && e.classList.add("flow-handle-active");
        }, P = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", L), e.addEventListener("pointerleave", P), l(() => {
          _?.(), S?.(), e.removeEventListener("pointerdown", M), e.removeEventListener("pointerenter", L), e.removeEventListener("pointerleave", P), e.classList.remove("flow-handle", `flow-handle-${a}`);
        });
      } else {
        const _ = () => {
          const x = b();
          if (!x?.pendingConnection) return;
          const E = m();
          if (E) {
            const N = x.getNode(E);
            if (N && !ze(N)) return;
          }
          e[dt] !== !1 && e.classList.add("flow-handle-active");
        }, M = () => {
          e.classList.remove("flow-handle-active");
        };
        e.addEventListener("pointerenter", _), e.addEventListener("pointerleave", M);
        const L = async (x) => {
          const E = b();
          if (!E?.pendingConnection || E._config?.connectOnClick === !1 || E._connectValidating) return;
          x.preventDefault(), x.stopPropagation();
          const N = m();
          if (!N) return;
          if (e[dt] === !1) {
            q("connection", "Click-to-connect rejected (handle not connectable end)"), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && Pe(k);
            return;
          }
          const T = E.getNode(N);
          if (T && !ze(T)) {
            q("connection", `Click-to-connect rejected (target "${N}" not connectable)`), E._emit("connect-end", { connection: null, source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
            const k = e.closest(".flow-container");
            k && Pe(k);
            return;
          }
          const w = {
            source: E.pendingConnection.source,
            sourceHandle: E.pendingConnection.sourceHandle,
            target: N,
            targetHandle: g
          }, v = { source: E.pendingConnection.source, sourceHandle: E.pendingConnection.sourceHandle, position: { x: 0, y: 0 } };
          if (lt(w, E.edges, { preventCycles: E._config?.preventCycles })) {
            const k = e.closest(".flow-container");
            if (!at(w, E._config?.connectionRules, E._nodeMap)) {
              q("connection", "Click-to-connect rejected (connection rules)", w), Ae(k, w), E._emit("connect-end", { connection: null, ...v }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            if (k && !Ge(k, w, E.edges)) {
              q("connection", "Click-to-connect rejected (handle limit)", w), Ae(k, w), E._emit("connect-end", { connection: null, ...v }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(k);
              return;
            }
            if (k && !Ke(k, w)) {
              q("connection", "Click-to-connect rejected (per-handle validator)", w), Ae(k, w), E._emit("connect-end", { connection: null, ...v }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            if (E._config?.isValidConnection && !E._config.isValidConnection(w)) {
              q("connection", "Click-to-connect rejected (custom validator)", w), Ae(k, w), E._emit("connect-end", { connection: null, ...v }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), k && Pe(k);
              return;
            }
            const O = E._config?.connectValidator;
            if (O && k) {
              const C = E._config?.validatingHandleClass ?? "flow-handle-validating", { sourceEl: A, targetEl: R } = eo(k, w);
              E._connectValidating = !0;
              let X;
              try {
                X = await Qn(
                  O,
                  w,
                  A,
                  R,
                  k,
                  C
                );
              } finally {
                E._connectValidating = !1;
              }
              if (!X.allowed) {
                q("connection", "Click-to-connect rejected (async connectValidator)", { connection: w, reason: X.reason }), Ae(k, { ...w, reason: X.reason }), E._emit("connect-end", { connection: null, ...v }), E.pendingConnection = null, E._container?.classList.remove("flow-connecting"), Pe(k);
                return;
              }
            }
            const W = `e-${w.source}-${w.target}-${Date.now()}-${nn++}`;
            E.addEdges({ id: W, ...w }), q("connection", `Click-to-connect: ${w.source} → ${w.target}`, w), E._emit("connect", { connection: w }), E._emit("connect-end", { connection: w, ...v });
          } else {
            q("connection", "Click-to-connect rejected (invalid)", w);
            const k = e.closest(".flow-container");
            Ae(k, w), E._emit("connect-end", { connection: null, ...v });
          }
          E.pendingConnection = null, E._container?.classList.remove("flow-connecting");
          const D = e.closest(".flow-container");
          D && Pe(D);
        };
        e.addEventListener("click", L);
        let P = null;
        const $ = (x) => {
          if (x.button !== 0) return;
          const E = b(), N = m();
          if (!E || !N || E._animationLocked || E._config?.edgesReconnectable === !1 || E._pendingReconnection) return;
          const T = E.edges.filter(
            (z) => z.target === N && (z.targetHandle ?? "target") === g
          );
          if (T.length === 0) return;
          const w = T.find((z) => z.selected) ?? (T.length === 1 ? T[0] : null);
          if (!w) return;
          const v = w.reconnectable ?? !0;
          if (v === !1 || v === "source") return;
          x.preventDefault(), x.stopPropagation();
          const D = x.clientX, k = x.clientY;
          let O = !1, W = !1, C = null;
          const A = E._config?.connectionSnapRadius ?? 20, R = e.closest(".flow-container");
          if (!R) return;
          const X = R.querySelector(
            `[data-flow-node-id="${CSS.escape(w.source)}"]`
          ), se = w.sourceHandle ? `[data-flow-handle-id="${CSS.escape(w.sourceHandle)}"]` : '[data-flow-handle-type="source"]', ne = X?.querySelector(se), ie = R.getBoundingClientRect(), ae = E._viewportLive ?? E.viewport, ce = ae?.zoom || 1, de = ae?.x || 0, J = ae?.y || 0;
          let le, ee;
          if (ne) {
            const z = ne.getBoundingClientRect();
            le = (z.left + z.width / 2 - ie.left - de) / ce, ee = (z.top + z.height / 2 - ie.top - J) / ce;
          } else {
            const z = E.getNode(w.source);
            if (!z) return;
            const oe = z.dimensions?.width ?? ve, B = z.dimensions?.height ?? _e;
            le = z.position.x + oe / 2, ee = z.position.y + B;
          }
          let F = null, K = null, U = null, V = D, I = k;
          const re = () => {
            O = !0;
            const z = R.querySelector(
              `[data-flow-edge-id="${w.id}"]`
            );
            z && z.classList.add("flow-edge-reconnecting"), E._emit("reconnect-start", { edge: w, handleType: "target" }), q("reconnect", `Reconnection drag started from target handle on edge "${w.id}"`), K = Ft({
              connectionLineType: E._config?.connectionLineType,
              connectionLineStyle: E._config?.connectionLineStyle,
              connectionLine: E._config?.connectionLine,
              containerEl: R
            }), F = K.svg;
            const oe = E.screenToFlowPosition(D, k);
            K.update({
              fromX: le,
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
              anchorPosition: { x: le, y: ee },
              position: oe
            }, U = Jn(R, E, V, I), an(R, w.source, w.sourceHandle ?? "source", E, w.id);
          }, G = (z) => {
            if (V = z.clientX, I = z.clientY, !O) {
              Math.sqrt(
                (z.clientX - D) ** 2 + (z.clientY - k) ** 2
              ) >= Fn && re();
              return;
            }
            const oe = E.screenToFlowPosition(z.clientX, z.clientY), B = rn({
              containerEl: R,
              handleType: "target",
              excludeNodeId: w.source,
              cursorFlowPos: oe,
              connectionSnapRadius: A,
              getNode: (j) => E.getNode(j),
              toFlowPosition: (j, H) => E.screenToFlowPosition(j, H)
            });
            B.element !== C && (C?.classList.remove("flow-handle-active"), B.element?.classList.add("flow-handle-active"), C = B.element), K?.update({
              fromX: le,
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
                const ue = {
                  source: w.source,
                  sourceHandle: w.sourceHandle,
                  target: H,
                  targetHandle: Q
                }, he = { ...w }, pe = K?.svg ?? null;
                _t(pe, !0);
                let me;
                try {
                  me = await $r({
                    edge: w,
                    newConnection: ue,
                    canvas: E,
                    containerEl: R,
                    endpoint: "target"
                  });
                } finally {
                  _t(pe, !1);
                }
                me.applied ? (B = !0, q("reconnect", `Edge "${w.id}" reconnected (target)`, ue), E._emit("reconnect", { oldEdge: he, newConnection: ue })) : q("reconnect", "Reconnection rejected", { connection: ue, reason: me.reason });
              }
            }
            B || q("reconnect", `Edge "${w.id}" reconnection cancelled — snapping back`), E._emit("reconnect-end", { edge: w, successful: B }), Y();
          };
          document.addEventListener("pointermove", G), document.addEventListener("pointerup", te), document.addEventListener("pointercancel", te), P = Y;
        };
        e.addEventListener("pointerdown", $), l(() => {
          P?.(), S?.(), e.removeEventListener("pointerdown", $), e.removeEventListener("pointerenter", _), e.removeEventListener("pointerleave", M), e.removeEventListener("click", L), e.classList.remove("flow-handle", `flow-handle-${a}`, "flow-handle-active");
        });
      }
    }
  );
}
const rs = {
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
function vf(t) {
  if (!t) return { ...rs };
  const e = { ...rs };
  for (const n of Object.keys(t))
    n in t && (e[n] = t[n]);
  return e;
}
function Xe(t, e) {
  if (e == null) return !1;
  const n = t.length === 1 ? t.toLowerCase() : t;
  return Array.isArray(e) ? e.some((o) => (o.length === 1 ? o.toLowerCase() : o) === n) : (e.length === 1 ? e.toLowerCase() : e) === n;
}
function _f(t, e, n, o) {
  return !t && e > 0 && (n !== 0 || o !== 0);
}
function ut(t, e) {
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
function bf(t, e, n = {}) {
  const o = n.duration ?? 500, i = n.moveThreshold ?? 10;
  let r = null, s = 0, l = 0, a = null;
  function c() {
    r !== null && (clearTimeout(r), r = null), a = null, document.removeEventListener("pointermove", d), document.removeEventListener("pointerup", c), document.removeEventListener("pointercancel", c);
  }
  function d(u) {
    const h = u.clientX - s, p = u.clientY - l;
    h * h + p * p > i * i && c();
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
const as = 20;
function Dr(t) {
  return new Map(t.map((e) => [e.id, e]));
}
function jo(t, e, n) {
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
function Ht(t, e, n) {
  if (!t.parentId)
    return t;
  const o = jo(t, e, n);
  return { ...t, position: o };
}
function to(t, e, n) {
  return t.map((o) => Ht(o, e, n));
}
function ft(t, e) {
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
function ht(t) {
  const e = Dr(t), n = [], o = /* @__PURE__ */ new Set();
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
function Rr(t, e, n = /* @__PURE__ */ new Set()) {
  if (n.has(t.id))
    return t.zIndex ?? 2;
  if (n.add(t.id), !t.parentId)
    return t.zIndex !== void 0 ? t.zIndex : t.type === "group" ? 0 : 2;
  const o = e.get(t.parentId);
  return o ? Rr(o, e, n) + 2 + (t.zIndex ?? 0) : (t.zIndex ?? 0) + 2;
}
function Fr(t, e, n) {
  return {
    x: Math.max(e[0][0], Math.min(t.x, e[1][0] - (n?.width ?? 0))),
    y: Math.max(e[0][1], Math.min(t.y, e[1][1] - (n?.height ?? 0)))
  };
}
function _o(t, e, n) {
  return {
    x: Math.max(0, Math.min(t.x, n.width - e.width)),
    y: Math.max(0, Math.min(t.y, n.height - e.height))
  };
}
function Tn(t, e, n) {
  const o = e.extent ?? n;
  if (!o || o === "parent" || e.parentId) return t;
  const i = e.dimensions ?? { width: ve, height: _e };
  return Fr(t, o, i);
}
function xf(t, e, n) {
  const o = t.x + e.width + as, i = t.y + e.height + as, r = Math.max(n.width, o), s = Math.max(n.height, i);
  return r === n.width && s === n.height ? null : { width: r, height: s };
}
function ls(t, e, n) {
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
function Ef(t, e, n) {
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
function Cf(t, e, n) {
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
function Sf(t, e, n) {
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
function kf(t, e, n) {
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
function Lf(t, e, n) {
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
function Pf(t, e, n) {
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
function Mf(t, e, n) {
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
const Hr = {
  circle: { perimeterPoint: Ef },
  diamond: { perimeterPoint: Cf },
  hexagon: { perimeterPoint: Sf },
  parallelogram: { perimeterPoint: kf },
  triangle: { perimeterPoint: Lf },
  cylinder: { perimeterPoint: Pf },
  stadium: { perimeterPoint: Mf }
};
function Or(t, e = "light") {
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
const bo = "__alpineflow_collab_store__";
function Tf() {
  return typeof globalThis < "u" ? (globalThis[bo] || (globalThis[bo] = /* @__PURE__ */ new WeakMap()), globalThis[bo]) : /* @__PURE__ */ new WeakMap();
}
const Re = Tf(), xo = "__alpineflow_registry__";
function zr() {
  return typeof globalThis < "u" ? (globalThis[xo] || (globalThis[xo] = /* @__PURE__ */ new Map()), globalThis[xo]) : /* @__PURE__ */ new Map();
}
function Tt(t) {
  return zr().get(t);
}
function Af(t, e) {
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
const Nf = 1e3;
class $f {
  constructor(e, n) {
    this._clearTimer = null, this._formatMessage = n ?? Af, this._el = document.createElement("div"), this._el.setAttribute("aria-live", "polite"), this._el.setAttribute("aria-atomic", "true"), this._el.setAttribute("role", "status");
    const o = this._el.style;
    o.position = "absolute", o.width = "1px", o.height = "1px", o.padding = "0", o.margin = "-1px", o.overflow = "hidden", o.clip = "rect(0,0,0,0)", o.whiteSpace = "nowrap", o.border = "0", e.appendChild(this._el);
  }
  announce(e) {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.textContent = e, this._clearTimer = setTimeout(() => {
      this._el.textContent = "", this._clearTimer = null;
    }, Nf);
  }
  handleEvent(e, n) {
    const o = this._formatMessage(e, n);
    o && this.announce(o);
  }
  destroy() {
    this._clearTimer && clearTimeout(this._clearTimer), this._el.remove();
  }
}
class If {
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
        const p = r.get(h.source);
        if (!p) continue;
        const g = h.sourceHandle ?? "default", y = h.targetHandle ?? "default";
        g in p && (d[y] = p[g]);
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
const Df = {
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
}, Rf = {
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
}, Ff = {
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
}, cs = {
  success: { borderColor: "#22c55e", shadow: "0 0 0 2px rgba(34,197,94,0.3)" },
  error: { borderColor: "#ef4444", shadow: "0 0 0 2px rgba(239,68,68,0.3)" },
  warning: { borderColor: "#f59e0b", shadow: "0 0 0 2px rgba(245,158,11,0.3)" },
  info: { borderColor: "#3b82f6", shadow: "0 0 0 2px rgba(59,130,246,0.3)" }
};
function Hf(t, e) {
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
    const r = cs[o.style] ?? cs.info, s = o.duration ?? 1500, l = Math.floor(s * 0.6), a = Math.floor(s * 0.4), c = i.style?.borderColor ?? null, d = i.style?.boxShadow ?? null;
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
      const f = i[d], u = i[d + 1], h = t.edges.find((p) => p.source === f && p.target === u);
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
function Of(t) {
  return "on" + t.split("-").map(
    (e) => e.charAt(0).toUpperCase() + e.slice(1)
  ).join("");
}
const zf = /* @__PURE__ */ new Set(["viewport-change", "viewport-move"]), Vf = 150;
function Bf(t, e) {
  let n = null, o = null;
  return ((...i) => {
    o = i, n === null && (n = setTimeout(() => {
      n = null;
      const r = o;
      o = null, t(...r);
    }, e));
  });
}
function qf(t, e, n) {
  for (const [o, i] of Object.entries(n)) {
    const r = Of(o), s = t[r], l = (a) => {
      let c;
      typeof s == "function" && (c = s(a));
      const d = Df[o], f = d ? d(a) : [a], u = e[i];
      return typeof u == "function" && u.call(e, ...f), c;
    };
    t[r] = zf.has(o) ? Bf(l, Vf) : l;
  }
}
function Xf(t, e) {
  const n = [];
  for (const [o, i] of Object.entries(Rf)) {
    const r = e.on(o, (s) => {
      const l = t[i];
      if (typeof l != "function") return;
      const a = Ff[o], c = a ? a(s) : Object.values(s);
      l.call(t, ...c);
    });
    n.push(r);
  }
  return () => {
    for (const o of n)
      typeof o == "function" && o();
  };
}
const Yf = 5;
function Wf(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let i = null, r = /* @__PURE__ */ new Set(), s = 0;
  const l = /* @__PURE__ */ new Set();
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null;
      for (const c of e) {
        const f = (r.has(c) ? n.get(c) ?? 0 : 0) + 1;
        n.set(c, f), f > Yf && !o.has(c) && (o.add(c), console.warn(
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
function jf(t) {
  return function(n) {
    t.suspend();
    try {
      return n();
    } finally {
      t.resume();
    }
  };
}
function Uf(t, e, n) {
  let { width: o, height: i } = t;
  return e?.width !== void 0 && (o = Math.max(o, e.width)), e?.height !== void 0 && (i = Math.max(i, e.height)), n?.width !== void 0 && (o = Math.min(o, n.width)), n?.height !== void 0 && (i = Math.min(i, n.height)), { width: o, height: i };
}
function ln(t, e) {
  const n = t.type ?? "default", o = e[n], i = t.data?.childValidation;
  if (!(!o && !i))
    return o ? i ? { ...o, ...i } : o : i;
}
function Vr(t, e, n, o) {
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
function ds(t, e, n) {
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
function Xt(t, e) {
  const n = Wt(t, e);
  return {
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Br(t, e) {
  return t.x < e.x + e.width && t.x + t.width > e.x && t.y < e.y + e.height && t.y + t.height > e.y;
}
function Zf(t, e, n = !0) {
  const o = Xt(t);
  return e.filter((i) => {
    if (i.id === t.id) return !1;
    const r = Xt(i);
    return n ? Br(o, r) : o.x <= r.x && o.y <= r.y && o.x + o.width >= r.x + r.width && o.y + o.height >= r.y + r.height;
  });
}
function Kf(t, e, n = !0) {
  if (t.id === e.id) return !1;
  const o = Xt(t), i = Xt(e);
  return n ? Br(o, i) : o.x <= i.x && o.y <= i.y && o.x + o.width >= i.x + i.width && o.y + o.height >= i.y + i.height;
}
function Gf(t, e, n, o, i = 5) {
  let { x: r, y: s } = t;
  for (const l of o) {
    const a = r + e, c = s + n, d = l.x + l.width, f = l.y + l.height;
    if (r < d + i && a > l.x - i && s < f + i && c > l.y - i) {
      const u = a - (l.x - i), h = d + i - r, p = c - (l.y - i), g = f + i - s, y = Math.min(u, h, p, g);
      y === u ? r -= u : y === h ? r += h : y === p ? s -= p : s += g;
    }
  }
  return { x: r, y: s };
}
function Jf(t) {
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
                  (p) => p.parentId === c.parentId
                ),
                ...r.filter(
                  (p) => p.parentId === c.parentId
                )
              ], h = Vr(f, c, u, d);
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
      t.nodes = ht(t.nodes), t._rebuildNodeMap();
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
            const f = t.nodes.find((p) => p.id === c);
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
        const p = t._nodeMap.get(u.parentId);
        if (!p) continue;
        const g = t.nodes.filter(
          (m) => m.parentId === u.parentId
        ), y = no(p, u, g, h);
        y.valid || (o.add(f), t._config.onChildValidationFail && t._config.onChildValidationFail({
          parent: p,
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
        for (const u of ft(f, t.nodes))
          n.add(u);
      q("destroy", `Removing ${n.size} node(s)`, [...n]);
      const r = t.nodes.filter((f) => n.has(f.id));
      let s = [];
      t._config.reconnectOnDelete && (s = cf(n, t.nodes, t.edges));
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
          const p = t._nodeMap.get(h);
          p?.childLayout && (u = h), h = p?.parentId;
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
      return Yo(e, t.nodes, t.edges);
    },
    /**
     * Get all nodes connected via incoming edges to the given node.
     */
    getIncomers(e) {
      return rf(e, t.nodes, t.edges);
    },
    /**
     * Get all edges connected to a node (both incoming and outgoing).
     */
    getConnectedEdges(e) {
      return sf(e, t.edges);
    },
    /**
     * Check if two nodes are connected by an edge.
     * When `directed` is true, only checks source→target direction.
     */
    areNodesConnected(e, n, o = !1) {
      return lf(e, n, t.edges, o);
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
      return o ? Zf(o, t.nodes, n) : [];
    },
    /**
     * Check if two nodes' bounding rects overlap.
     * Accepts either FlowNode objects or node ID strings.
     */
    isNodeIntersecting(e, n, o) {
      const i = typeof e == "string" ? t.nodes.find((s) => s.id === e) : e, r = typeof n == "string" ? t.nodes.find((s) => s.id === n) : n;
      return !i || !r ? !1 : Kf(i, r, o);
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
function Qf(t) {
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
        return at(l, o, t._nodeMap);
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
function eh(t) {
  return {
    // ── Coordinate Transforms ─────────────────────────────────────────────
    /**
     * Convert screen coordinates (e.g. from a pointer event) to flow
     * coordinates, accounting for the current viewport pan and zoom.
     */
    screenToFlowPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return yr(e, n, t._viewportLive ?? t.viewport, o);
    },
    /**
     * Convert flow coordinates to screen coordinates, accounting for the
     * current viewport pan and zoom.
     */
    flowToScreenPosition(e, n) {
      if (!t._container) return { x: e, y: n };
      const o = t._container.getBoundingClientRect();
      return ku(e, n, t._viewportLive ?? t.viewport, o);
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
      const o = t.nodes.filter((r) => !r.hidden), i = Bt(to(o, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n?.padding ?? qo
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
      return e ? n = e.map((o) => t.getNode(o)).filter((o) => !!o) : n = t.nodes.filter((o) => !o.hidden), Bt(to(n, t._nodeMap, t._config.nodeOrigin), t._config.nodeOrigin);
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
        n ?? qo
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
      const n = t._viewportLive ?? t.viewport, o = t._config.maxZoom ?? 2, i = Math.min(n.zoom * Yi, o);
      q("viewport", "zoomIn", { from: n.zoom, to: i }), t._panZoom?.setViewport({ ...n, zoom: i }, e);
    },
    /**
     * Zoom out by `ZOOM_STEP_FACTOR`, clamped to `minZoom`.
     */
    zoomOut(e) {
      const n = t._viewportLive ?? t.viewport, o = t._config.minZoom ?? 0.5, i = Math.max(n.zoom / Yi, o);
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
let vt = null;
const th = 20;
function Uo(t) {
  return JSON.parse(JSON.stringify(t));
}
function us(t) {
  return `${t}-copy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function qr(t, e) {
  const n = t.filter((r) => r.selected), o = new Set(n.map((r) => r.id)), i = e.filter(
    (r) => r.selected || o.has(r.source) && o.has(r.target)
  );
  return vt = {
    nodes: Uo(n),
    edges: Uo(i),
    pasteCount: 0
  }, { nodeCount: n.length, edgeCount: i.length };
}
function nh() {
  if (!vt || vt.nodes.length === 0) return null;
  vt.pasteCount++;
  const t = vt.pasteCount * th, e = /* @__PURE__ */ new Map(), n = vt.nodes.map((i) => {
    const r = us(i.id);
    return e.set(i.id, r), {
      ...i,
      id: r,
      data: Uo(i.data),
      position: { x: i.position.x + t, y: i.position.y + t },
      selected: !0
    };
  }), o = vt.edges.map((i) => ({
    ...i,
    id: us(i.id),
    source: e.get(i.source),
    target: e.get(i.target),
    selected: !0
  }));
  return { nodes: n, edges: o };
}
function oh(t, e) {
  const n = qr(t, e);
  return { nodeIds: t.filter((i) => i.selected).map((i) => i.id), ...n };
}
function ih(t) {
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
        return c ? hf(c) : !1;
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
        ), u = no(d, a, f, c);
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
      const e = qr(t.nodes, t.edges);
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
      const e = nh();
      if (e) {
        t._captureHistory(), t.deselectAll(), t.nodes.push(...e.nodes), t.nodes = ht(t.nodes), t._rebuildNodeMap(), t.edges.push(...e.edges), t._rebuildEdgeMap();
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
      const e = oh(t.nodes, t.edges);
      e.nodeCount !== 0 && (await t._deleteSelected(), t._emit("cut", { nodeCount: e.nodeCount, edgeCount: e.edgeCount }), q("clipboard", `Cut ${e.nodeCount} node(s)`));
    }
  };
}
function sh(t) {
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
      }), e.nodes && (t.nodes = ht(JSON.parse(JSON.stringify(e.nodes)))), e.edges) {
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
      e && (t.nodes = ht(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
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
      e && (t.nodes = ht(e.nodes), t.edges = e.edges, t._rebuildNodeMap(), t._rebuildEdgeMap(), t.deselectAll(), requestAnimationFrame(() => {
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
function rh(t, e) {
  return t * (1 - e);
}
function ah(t, e) {
  return t * e;
}
function lh(t, e) {
  return e === "in" ? t : 1 - t;
}
function ch(t, e, n) {
  const o = t.getTotalLength();
  t.style.strokeDasharray = String(o);
  const i = n === "in" ? rh(o, e) : ah(o, e);
  t.style.strokeDashoffset = String(i), (n === "in" && e < 1 || n === "out") && (t.style.setProperty("marker-start", "none"), t.style.setProperty("marker-end", "none"));
}
function dh(t) {
  t.style.removeProperty("stroke-dasharray"), t.style.removeProperty("stroke-dashoffset"), t.style.removeProperty("marker-start"), t.style.removeProperty("marker-end");
}
function uh(t, e, n) {
  t.style.opacity = String(lh(e, n));
}
function fh(t) {
  t.style.removeProperty("opacity");
}
const Qe = Math.PI * 2, Jt = /* @__PURE__ */ new Map(), hh = 64;
function gi(t) {
  if (typeof document > "u" || typeof document.createElementNS != "function")
    return null;
  const e = Jt.get(t);
  if (e) return e;
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  n.setAttribute("d", t);
  const o = n.getTotalLength(), i = (r) => {
    const s = n.getPointAtLength(r * o);
    return { x: s.x, y: s.y };
  };
  if (Jt.size >= hh) {
    const r = Jt.keys().next().value;
    r !== void 0 && Jt.delete(r);
  }
  return Jt.set(t, i), i;
}
function Km(t) {
  const { cx: e, cy: n, offset: o = 0, clockwise: i = !0 } = t, r = t.rx ?? t.radius ?? 100, s = t.ry ?? t.radius ?? 100, l = i ? 1 : -1;
  return (a) => ({
    x: e + r * Math.cos(Qe * a * l + o * Qe),
    y: n + s * Math.sin(Qe * a * l + o * Qe)
  });
}
function Gm(t) {
  const { startX: e, startY: n, endX: o, endY: i, amplitude: r = 30, frequency: s = 1, offset: l = 0 } = t, a = o - e, c = i - n, d = Math.sqrt(a * a + c * c), f = d > 0 ? a / d : 1, h = -(d > 0 ? c / d : 0), p = f;
  return (g) => {
    const y = e + a * g, m = n + c * g, b = r * Math.sin(Qe * s * g + l * Qe);
    return { x: y + h * b, y: m + p * b };
  };
}
function Jm(t, e) {
  const n = gi(t);
  if (!n) return null;
  const { reverse: o = !1, startAt: i = 0, endAt: r = 1 } = e ?? {}, s = r - i;
  return (l) => {
    let a = i + l * s;
    return o && (a = r - l * s), n(a);
  };
}
function Qm(t) {
  const { cx: e, cy: n, radius: o, angle: i = 60, offset: r = 0 } = t, s = i * Math.PI / 180;
  return (l) => {
    const a = s * Math.sin(Qe * l + r * Qe);
    return {
      x: e + o * Math.sin(a),
      y: n + o * Math.cos(a)
    };
  };
}
function ey(t) {
  const { originX: e, originY: n, range: o = 20, speed: i = 1, seed: r = 0 } = t, s = 1 + r % 7 * 0.3, l = 1.3 + r % 11 * 0.2, a = 0.7 + r % 13 * 0.25, c = 1.1 + r % 17 * 0.15;
  return (d) => {
    const f = d * i * Qe, u = (Math.sin(s * f) + Math.sin(l * f * 1.3)) / 2, h = (Math.sin(a * f * 0.9) + Math.sin(c * f * 1.1)) / 2;
    return { x: e + u * o, y: n + h * o };
  };
}
function ty(t, e) {
  const n = e?.from ?? 0;
  return (o, i) => n + o * t;
}
let fs = !1;
function ye(t) {
  try {
    return structuredClone(t);
  } catch {
    return fs || (fs = !0, typeof console < "u" && console.warn(
      "[AlpineFlow] Cloning fell back to JSON roundtrip because structuredClone could not clone the input (likely a reactive proxy or an object with functions). Non-JSON values (functions, Symbols, Dates) will be stripped. This warning fires once per session."
    )), JSON.parse(JSON.stringify(t));
  }
}
function ph(t) {
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
function gh(t) {
  return {
    animated: t.animated,
    color: t.color,
    class: t.class,
    label: t.label,
    strokeWidth: t.strokeWidth
  };
}
function mh(t, e) {
  t.position.x = e.position.x, t.position.y = e.position.y, t.class = e.class, t.style = e.style, t.data = ye(e.data), t.dimensions = e.dimensions ? { ...e.dimensions } : t.dimensions, t.selected = e.selected, t.zIndex = e.zIndex;
}
class mi {
  constructor(e, n) {
    this._entries = [], this._state = "idle", this._reversed = !1, this._loopCount = -1, this._lockEnabled = !1, this._locked = !1, this._respectReducedMotion = void 0, this._listeners = /* @__PURE__ */ new Map(), this._context = {}, this._activeHandles = [], this._subTimelines = [], this._initialSnapshot = /* @__PURE__ */ new Map(), this._initialEdgeSnapshot = /* @__PURE__ */ new Map(), this._playResolve = null, this._pauseWaiters = /* @__PURE__ */ new Set(), this._canvas = e, this._engine = n ?? new br();
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
    const o = new mi(this._canvas, this._engine);
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
    return xr(this._respectReducedMotion);
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
          o && this._initialSnapshot.set(n, ph(o));
        }
    }
    if (e.edges) {
      for (const n of e.edges)
        if (!this._initialEdgeSnapshot.has(n)) {
          const o = this._canvas.getEdge(n);
          o && this._initialEdgeSnapshot.set(n, gh(o));
        }
    }
  }
  _restoreInitialSnapshot() {
    for (const [e, n] of this._initialSnapshot) {
      const o = this._canvas.getNode(e);
      o && mh(o, n);
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
    const d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
    this._captureNodeFromValues(e, a, d, f);
    const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    this._captureEdgeFromValues(e, c, u, h);
    const p = this._resolveFollowPath(e), g = this._createGuidePath(e), y = !!(e.viewport || e.fitView || e.panTo);
    let m = null, b = null;
    y && this._canvas.viewport && (m = { ...this._canvas.viewport }, b = this._resolveTargetViewport(e));
    const S = e.edgeTransition ?? "none", _ = e.addEdges?.map(($) => $.id) ?? [], M = e.removeEdges?.filter(($) => this._canvas.getEdge($)).slice() ?? [], L = {
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
      nodeFromStyles: f,
      edgeFromStrokeWidth: u,
      edgeFromColor: h,
      viewportFrom: m,
      viewportTarget: b,
      transition: S,
      addEdgeIds: _,
      removeEdgeIds: M
    };
    if (i === 0)
      return this._executeInstantStep(L);
    const P = this._prepareAnimatedEdges(e, S, _);
    return P && await P, p ? this._executeFollowPathStep(L) : this._executeAnimatedStep(L);
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
    const n = gi(e.followPath);
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
      viewportTarget: p,
      transition: g,
      addEdgeIds: y,
      removeEdgeIds: m,
      guidePathEl: b
    } = e, S = e.resolvedPathFn;
    return new Promise((_) => {
      const M = this._engine.register((L) => {
        if (this._state === "stopped")
          return _(), !0;
        const P = Math.min(L / i, 1), $ = s(P);
        if (l) {
          const x = S($);
          for (const E of l) {
            const N = this._canvas.getNode(E);
            N && (N.position.x = x.x, N.position.y = x.y);
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
          p
        ), this._tickEdgeTransitions(g, y, m, $), n.onProgress?.(P, o), P >= 1 ? (this._cleanupEdgeTransitions(g, y, m), m.length && this._removeEdges(m), this._applyStepInstant(n), b && n.guidePath?.autoRemove !== !1 && b.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), _(), !0) : !1;
      }, r);
      this._activeHandles.push(M);
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
      const f = gn(e.style);
      for (const u of o) {
        const h = this._canvas.getNode(u), p = s.get(u);
        h && p && (h.style = Er(p, f, n));
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
        u && (h !== void 0 && typeof h == "string" ? u.color = ui(h, e.edgeColor, n) : u.color = e.edgeColor);
      }
    if (c && d && this._canvas.viewport) {
      const f = Fu(c, d, n, {
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
    return new Promise((p) => {
      const g = this._buildAnimateTargets(
        n,
        s,
        l,
        a,
        c
      ), y = Object.keys(g.nodes || {}).length > 0 || Object.keys(g.edges || {}).length > 0 || g.viewport;
      if (!y && !f.length && !u.length) {
        n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
        return;
      }
      if (y) {
        const m = this._canvas.animate(g, {
          duration: i,
          easing: n.easing,
          delay: r,
          onProgress: (b) => {
            if (this._state === "stopped") {
              m.stop(), p();
              return;
            }
            this._tickEdgeTransitions(d, f, u, b), n.onProgress?.(b, o);
          },
          onComplete: () => {
            this._cleanupEdgeTransitions(d, f, u), u.length && this._removeEdges(u), this._applyStepInstant(n), h && n.guidePath?.autoRemove !== !1 && h.remove(), n.onProgress?.(1, o), n.onComplete?.(o), this._emit("step-complete"), p();
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
      r && ch(r, n, o);
    }
  }
  /** Clean up draw transition styles. */
  _cleanupEdgeDrawTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgePathElement?.(n);
      o && dh(o);
    }
  }
  /** Apply fade transition on each tick for added/removed edges. */
  _applyEdgeFadeTransition(e, n, o) {
    for (const i of e) {
      const r = this._canvas.getEdgeElement?.(i);
      r && uh(r, n, o);
    }
  }
  /** Clean up fade transition styles. */
  _cleanupEdgeFadeTransition(e) {
    for (const n of e) {
      const o = this._canvas.getEdgeElement?.(n);
      o && fh(o);
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
    const i = Bt(o), r = e.fitViewPadding ?? 0.1;
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
const Xr = /* @__PURE__ */ new Map();
function jt(t, e) {
  Xr.set(t, e);
}
function yh(t) {
  return Xr.get(t);
}
const Fe = "http://www.w3.org/2000/svg", wh = {
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
}, vh = {
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
let _h = 0;
const bh = {
  create(t, e) {
    const n = document.createElementNS(Fe, "g");
    if (n.__beamLength = e.length ?? 30, n.__beamWidth = e.width ?? 4, n.__beamColor = e.color ?? "#8B5CF6", n.__beamGradient = e.gradient, n.__beamFollowThrough = e.followThrough ?? !0, n.__beamUid = `afbeam-${++_h}`, e.class)
      for (const o of e.class.split(" "))
        o && n.classList.add(o);
    return t.appendChild(n), n;
  },
  update(t, e) {
    const n = t, o = n.__beamLength, i = n.__beamWidth, r = n.__beamColor, s = n.__beamGradient, l = n.__beamUid;
    if (e.pathEl) {
      let d = n.__pathClone, f = n.__gradient;
      if (!d) {
        let g = r;
        if (s && s.length > 0) {
          const y = document.createElementNS(Fe, "defs");
          f = document.createElementNS(Fe, "linearGradient"), f.setAttribute("id", l), f.setAttribute("gradientUnits", "userSpaceOnUse");
          for (const m of s) {
            const b = document.createElementNS(Fe, "stop");
            b.setAttribute("offset", String(m.offset)), b.setAttribute("stop-color", m.color), m.opacity !== void 0 && b.setAttribute("stop-opacity", String(m.opacity)), f.appendChild(b);
          }
          y.appendChild(f), n.appendChild(y), g = `url(#${l})`, n.__gradient = f;
        }
        d = document.createElementNS(Fe, "path"), d.setAttribute("d", e.pathEl.getAttribute("d") ?? ""), d.setAttribute("fill", "none"), d.style.stroke = g, d.style.strokeWidth = String(i), d.style.strokeLinecap = "round", d.style.fill = "none", s || (d.style.opacity = "0.85"), d.setAttribute("stroke-dasharray", `${o} ${e.pathLength}`), n.appendChild(d), n.__pathClone = d;
      }
      const h = n.__beamFollowThrough ? e.progress * (e.pathLength + o) : e.progress * e.pathLength, p = o - h;
      if (d.setAttribute("stroke-dashoffset", String(p)), f) {
        const g = Math.max(0, Math.min(e.pathLength, h)), y = Math.max(0, Math.min(e.pathLength, h - o)), m = e.pathEl.getPointAtLength(g), b = e.pathEl.getPointAtLength(y);
        f.setAttribute("x1", String(b.x)), f.setAttribute("y1", String(b.y)), f.setAttribute("x2", String(m.x)), f.setAttribute("y2", String(m.y));
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
}, xh = {
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
}, Eh = {
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
jt("circle", wh);
jt("orb", vh);
jt("beam", bh);
jt("pulse", xh);
jt("image", Eh);
let hs = !1;
function Ch(t) {
  const e = t.match(/^([\d.]+)(ms|s)?$/);
  if (!e) return 2e3;
  const n = parseFloat(e[1]);
  return e[2] === "ms" ? n : n * 1e3;
}
function ps(t, e, n) {
  if (t.speed !== void 0 && t.speed > 0)
    return t.duration !== void 0 && console.warn("[AlpineFlow] Both speed and duration provided for particle; speed takes precedence."), e / t.speed * 1e3;
  const o = t.duration ?? n;
  return typeof o == "number" ? o : Ch(o);
}
function Sh(t) {
  function e(o, i, r = {}, s = {}) {
    const l = r.renderer ?? "circle", a = yh(l);
    if (!a) {
      q("particle", `_fireParticleOnPath: unknown renderer "${l}"`);
      return;
    }
    l === "beam" && typeof r.onComplete == "function" && r.followThrough === void 0 && !hs && (hs = !0, console.warn(
      "[AlpineFlow] beam `onComplete` fires after the tail exits the path (follow-through is on by default). Pass `followThrough: false` if you want `onComplete` to fire when the head reaches the target."
    ));
    const c = t._containerStyles, d = r.size ?? s.size ?? (parseFloat(c?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), f = r.color ?? s.color ?? c?.getPropertyValue("--flow-edge-dot-fill").trim() ?? pn, u = s.durationFallback ?? c?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", h = o.getTotalLength(), p = ps(r, h, u), g = { ...r, size: d, color: f }, y = a.create(i, g), m = o.getPointAtLength(0), b = {
      x: m.x,
      y: m.y,
      progress: 0,
      velocity: { x: 0, y: 0 },
      pathLength: h,
      elapsed: 0,
      pathEl: o
    };
    a.update(y, b);
    let S;
    const _ = new Promise((x) => {
      S = x;
    }), M = () => {
      typeof r.onComplete == "function" && r.onComplete(), S();
    }, L = s.wrapOnComplete ? s.wrapOnComplete(M) : M, P = {
      element: y,
      renderer: a,
      pathEl: o,
      startElapsed: -1,
      // set on first engine tick
      ms: p,
      onComplete: L,
      currentPosition: { x: m.x, y: m.y }
    };
    return t._activeParticles.add(P), t._particleEngineHandle || (t._particleEngineHandle = Un.register((x) => t._tickParticles(x))), {
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
      const d = t._containerStyles, f = i.size ?? s.particleSize ?? (parseFloat(d?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), u = i.color ?? s.particleColor ?? d?.getPropertyValue("--flow-edge-dot-fill").trim() ?? pn, h = s.animationDuration ?? d?.getPropertyValue("--flow-edge-dot-duration").trim() ?? "2s", p = e(l, c, i, {
        size: f,
        color: u,
        durationFallback: h
      });
      return p && q("particle", `sendParticle on edge "${o}"`, { size: f, color: u, duration: i.duration }), p;
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
          const p = setTimeout(() => {
            c.push(this.sendParticle(o, h));
          }, u * s);
          d.push(p);
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
        const u = o.map((g) => {
          const m = t.getEdgePathElement(g)?.getTotalLength() ?? 0;
          return { id: g, length: m };
        }).filter((g) => g.length > 0);
        if (u.length === 0) {
          const g = Promise.resolve();
          return { get handles() {
            return [];
          }, finished: g, stopAll() {
          } };
        }
        const h = Math.max(...u.map((g) => g.length)), p = ps(a, h, "2s");
        for (const { id: g, length: y } of u) {
          const m = y / h, b = p * m, S = p - b;
          if (S <= 0) {
            const _ = this.sendParticle(g, { ...a, duration: b });
            _ && c.push(_);
          } else {
            const _ = setTimeout(() => {
              const M = this.sendParticle(g, { ...a, duration: b });
              M && c.push(M);
            }, S);
            d.push(_);
          }
        }
      } else
        for (const u of o) {
          const h = this.sendParticle(u, a);
          h && c.push(h);
        }
      const f = new Promise((u) => {
        setTimeout(() => {
          Promise.all(c.map((p) => p.finished)).then(() => {
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
class kh {
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
const Zo = 1, Ko = 1 / 60;
class on {
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
    const o = e.args.targets ?? {}, i = e.args.options ?? {}, r = i.motion, s = r ? Lr(r) ?? void 0 : void 0, l = {
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
            Cr(r, o, n);
            break;
          case "decay":
            fi(r, o, n);
            break;
          case "inertia":
            Sr(r, o, n, i);
            break;
          case "keyframes": {
            const s = o, l = s.duration ?? 5e3, a = l > 0 ? Math.min((this._virtualTime - e.startTime) / l, 1) : 1;
            kr(r, s, a, i), a >= 1 && (r.settled = !0);
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
const Yr = /* @__PURE__ */ new Map();
function yi(t, e) {
  Yr.set(t, e);
}
function Lh(t) {
  return Yr.get(t);
}
function wi(t, e = 20) {
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
function Wr(t) {
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
const Ph = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = wi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    c += Wr(t);
    for (const d of o) {
      const f = d.position?.x ?? 0, u = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${f}" y="${u}" width="${h}" height="${p}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Mh = {
  render(t, { width: e, height: n }) {
    const o = Object.values(t.nodes);
    if (o.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const i = wi(t.nodes);
    if (!i)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const { minX: r, minY: s, vbWidth: l, vbHeight: a } = i;
    let c = `<svg width="${e}" height="${n}" viewBox="${r} ${s} ${l} ${a}" xmlns="http://www.w3.org/2000/svg">`;
    for (const d of Object.values(t.edges)) {
      const f = t.nodes[d.source], u = t.nodes[d.target];
      if (!f || !u)
        continue;
      const h = (f.position?.x ?? 0) + (f.dimensions?.width ?? 150) / 2, p = (f.position?.y ?? 0) + (f.dimensions?.height ?? 40) / 2, g = (u.position?.x ?? 0) + (u.dimensions?.width ?? 150) / 2, y = (u.position?.y ?? 0) + (u.dimensions?.height ?? 40) / 2;
      c += `<line x1="${h}" y1="${p}" x2="${g}" y2="${y}" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`;
    }
    for (const d of o) {
      const f = d.position?.x ?? 0, u = d.position?.y ?? 0, h = d.dimensions?.width ?? 150, p = d.dimensions?.height ?? 40;
      c += `<rect x="${f}" y="${u}" width="${h}" height="${p}" fill="none" stroke="currentColor" stroke-width="1.5" rx="4"/>`;
    }
    return c += "</svg>", c;
  }
}, Th = {
  render(t, { width: e, height: n, inFlight: o }) {
    const i = Object.values(t.nodes);
    if (i.length === 0)
      return `<svg width="${e}" height="${n}" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const r = wi(t.nodes);
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
    f += Wr(t);
    for (const u of i) {
      const h = u.position?.x ?? 0, p = u.position?.y ?? 0, g = u.dimensions?.width ?? 150, y = u.dimensions?.height ?? 40;
      s.has(u.id ?? "") ? f += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="2" rx="4"/>` : f += `<rect x="${h}" y="${p}" width="${g}" height="${y}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1" rx="4" opacity="0.3"/>`;
    }
    return f += "</svg>", f;
  }
};
yi("faithful", Ph);
yi("outline", Mh);
yi("activity", Th);
function Go(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t > e ? o = i : n = i + 1;
  }
  return n;
}
function Jo(t, e) {
  let n = 0, o = t.length;
  for (; n < o; ) {
    const i = n + o >>> 1;
    t[i].t >= e ? o = i : n = i + 1;
  }
  return n;
}
function Ah(t, e) {
  return e.split(".").reduce((n, o) => n?.[o], t);
}
function jr(t) {
  if (t !== null && typeof t == "object") {
    Object.freeze(t);
    for (const e of Object.keys(t))
      jr(t[e]);
  }
  return t;
}
class vi {
  constructor(e) {
    this.version = e.version, this.duration = e.duration, this.initialState = jr(ye(e.initialState)), this.events = Object.freeze(ye(e.events)), this.checkpoints = Object.freeze(ye(e.checkpoints)), this.metadata = Object.freeze({ ...e.metadata ?? {} }), Object.freeze(this);
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
    if (e.version > Zo)
      throw new Error(
        `[AlpineFlow] Recording version ${e.version} is newer than supported (${Zo}). Please update AlpineFlow to replay this recording.`
      );
    return new vi(e);
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
      const i = Ah(o.canvas, e);
      i !== void 0 && n.push({ t: o.t, v: i });
    }
    return n;
  }
  /**
   * Returns the canvas state at virtual time `t` by running the VirtualEngine
   * up to that point from the nearest prior checkpoint.
   */
  getStateAt(e) {
    const n = new on(this.initialState);
    let o = null;
    for (const c of this.checkpoints)
      c.t <= e && (!o || c.t > o.t) && (o = c);
    o && n.restoreCheckpoint(o);
    const i = o?.t ?? 0, r = this.events;
    let s = i;
    const l = Ko * 1e3;
    let a = o ? Go(r, i) : Jo(r, i);
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
    const o = this.getStateAt(e), i = n.renderer ?? "faithful", r = Lh(i);
    if (!r)
      throw new Error(`[AlpineFlow] Unknown thumbnail renderer "${i}"`);
    return r.render(o, { width: n.width, height: n.height });
  }
}
class Nh {
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
      version: Zo,
      duration: this._virtualNow(),
      initialState: o,
      events: this._events,
      checkpoints: this._checkpoints,
      metadata: n
    };
    return new vi(i);
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
class $h {
  constructor(e, n, o = {}) {
    this._currentTime = 0, this._state = "idle", this._direction = "forward", this._speed = 1, this._rafHandle = null, this._lastWallTime = 0, this._resolveFinished = () => {
    }, this.recording = n, this._canvas = e, this._virtualEngine = new on(n.initialState), this._speed = o.speed ?? 1, this._direction = this._speed < 0 ? "backward" : "forward", this._from = o.from ?? 0, this._to = o.to ?? n.duration, this._loop = o.loop ?? !1, this._currentTime = this._from, this._from > 0 && this._seekEngineTo(this._from), o.skipInitialState || this._applyStateToCanvas(this._virtualEngine.getState()), this.finished = new Promise((i) => {
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
    this._state !== "playing" && (this._state === "ended" && (this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState())), this._state = "playing", this._lastWallTime = Eo(), this._scheduleTick());
  }
  pause() {
    this._state === "playing" && (this._state = "paused", this._cancelTick());
  }
  stop() {
    this._cancelTick(), this._currentTime = this._from, this._virtualEngine = new on(this.recording.initialState), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "idle";
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
    const n = this._findNearestCheckpoint(e), o = new on(this.recording.initialState);
    n && o.restoreCheckpoint(n);
    const i = n?.t ?? 0, r = this.recording.events;
    let s = i;
    const l = Ko * 1e3;
    let a = n ? Go(r, i) : Jo(r, i);
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
    const e = Eo(), n = (e - this._lastWallTime) / 1e3;
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
    n ? this._virtualEngine.restoreCheckpoint(n) : this._virtualEngine = new on(this.recording.initialState), this._walkTo(n?.t ?? 0, e);
  }
  _walkTo(e, n, o = !1) {
    if (n <= e)
      return;
    const i = this.recording.events;
    let r = e;
    const s = Ko * 1e3;
    let l = e === 0 ? Jo(i, 0) : Go(i, e);
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
        this._loop = typeof this._loop == "number" ? e : !0, this._currentTime = this._from, this._seekEngineTo(this._from), this._applyStateToCanvas(this._virtualEngine.getState()), this._state = "playing", this._lastWallTime = Eo(), this._scheduleTick();
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
function Eo() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
function Ih(t) {
  const e = Sh(t);
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
      const n = new mi(t, Un);
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
        for (const [h, p] of Object.entries(n.nodes)) {
          const g = t._nodeMap.get(h);
          if (!g) continue;
          const m = (p._duration ?? i) === 0;
          if (p.followPath && !m) {
            let b = null;
            typeof p.followPath == "function" ? b = p.followPath : b = gi(p.followPath);
            let S = null;
            if (p.guidePath?.visible && typeof p.followPath == "string" && typeof document < "u") {
              const _ = t.getEdgeSvgElement?.();
              _ && (S = document.createElementNS("http://www.w3.org/2000/svg", "path"), S.setAttribute("d", p.followPath), S.classList.add("flow-guide-path"), p.guidePath.class && S.classList.add(p.guidePath.class), _.appendChild(S));
            }
            if (b) {
              const _ = b, M = S, L = p.guidePath?.autoRemove !== !1;
              r.push({
                key: `node:${h}:followPath`,
                from: 0,
                to: 1,
                apply: (P) => {
                  const $ = t._nodeMap.get(h);
                  if (!$) return;
                  const x = _(P);
                  Le().raw($).position.x = x.x, Le().raw($).position.y = x.y, s.add(h), P >= 1 && M && L && M.remove();
                }
              });
            }
          } else if (p.position) {
            const S = Le().raw(g).position;
            if (p.position.x !== void 0) {
              const _ = p.position.x;
              if (m)
                S.x = _;
              else {
                const M = S.x;
                r.push({
                  key: `node:${h}:position.x`,
                  from: M,
                  to: _,
                  apply: (L) => {
                    const P = t._nodeMap.get(h);
                    P && (Le().raw(P).position.x = L, s.add(h));
                  }
                });
              }
            }
            if (p.position.y !== void 0) {
              const _ = p.position.y;
              if (m)
                S.y = _;
              else {
                const M = S.y;
                r.push({
                  key: `node:${h}:position.y`,
                  from: M,
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
          if (p.data !== void 0 && Object.assign(g.data, p.data), p.class !== void 0 && (g.class = p.class), p.selected !== void 0 && (g.selected = p.selected), p.zIndex !== void 0 && (g.zIndex = p.zIndex), p.style !== void 0)
            if (m)
              g.style = p.style, l.add(h);
            else {
              const b = gn(g.style || {}), S = gn(p.style), _ = t._nodeElements.get(h);
              if (_) {
                const M = getComputedStyle(_);
                for (const L of Object.keys(S))
                  b[L] === void 0 && (b[L] = M.getPropertyValue(L));
              }
              r.push({
                key: `node:${h}:style`,
                from: 0,
                to: 1,
                apply: (M) => {
                  const L = t._nodeMap.get(h);
                  L && (Le().raw(L).style = Er(b, S, M), l.add(h));
                }
              });
            }
          p.dimensions && g.dimensions && (p.dimensions.width !== void 0 && (m ? g.dimensions.width = p.dimensions.width : r.push({
            key: `node:${h}:dimensions.width`,
            from: g.dimensions.width,
            to: p.dimensions.width,
            apply: (b) => {
              g.dimensions.width = b;
            }
          })), p.dimensions.height !== void 0 && (g.fixedDimensions = !0, m ? g.dimensions.height = p.dimensions.height : r.push({
            key: `node:${h}:dimensions.height`,
            from: g.dimensions.height,
            to: p.dimensions.height,
            apply: (b) => {
              g.dimensions.height = b;
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
              const b = typeof g.color == "string" && g.color || getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke").trim() || di;
              r.push({
                key: `edge:${h}:color`,
                from: b,
                to: p.color,
                apply: (S) => {
                  const _ = t._edgeMap.get(h);
                  _ && (Le().raw(_).color = S, a.add(h));
                }
              });
            }
          if (p.strokeWidth !== void 0)
            if (m)
              g.strokeWidth = p.strokeWidth, a.add(h);
            else {
              const b = g.strokeWidth ?? (parseFloat(getComputedStyle(t._container).getPropertyValue("--flow-edge-stroke-width").trim() || "1") || 1);
              r.push({
                key: `edge:${h}:strokeWidth`,
                from: b,
                to: p.strokeWidth,
                apply: (S) => {
                  const _ = t._edgeMap.get(h);
                  _ && (Le().raw(_).strokeWidth = S, a.add(h));
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
            for (const [h, p] of Object.entries(n.nodes)) {
              const g = t._nodeMap.get(h);
              if (!g) continue;
              const y = Le().raw(g);
              (p.followPath || p.position?.x !== void 0) && (g.position.x = y.position.x), (p.followPath || p.position?.y !== void 0) && (g.position.y = y.position.y), p.style !== void 0 && (g.style = y.style);
            }
          if (n.edges)
            for (const [h, p] of Object.entries(n.edges)) {
              const g = t._edgeMap.get(h);
              if (!g) continue;
              const y = Le().raw(g);
              p.color !== void 0 && typeof p.color == "string" && (g.color = y.color), p.strokeWidth !== void 0 && (g.strokeWidth = y.strokeWidth);
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
      const i = xr(t._config?.respectReducedMotion) ? 0 : o.duration ?? 300;
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
            const b = m.nodeOrigin ?? t._config.nodeOrigin ?? [0, 0];
            m.dimensions && (d.x += m.dimensions.width * (0.5 - b[0]), d.y += m.dimensions.height * (0.5 - b[1]));
          }
        } else if ("getCurrentPosition" in n && typeof n.getCurrentPosition == "function") {
          const y = n.getCurrentPosition();
          if (y)
            d = y;
          else
            return s = !0, a.stop(), t._followHandle = null, i(), !0;
        } else "x" in n && "y" in n && (d = n);
        if (!d) return !1;
        const f = t._container ? { width: t._container.clientWidth, height: t._container.clientHeight } : { width: 800, height: 600 }, u = l ?? t.viewport.zoom, h = f.width / 2 - d.x * u, p = f.height / 2 - d.y * u, g = 0.08;
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
      return new kh(n, {
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
        sendConverging: (g, y) => f.call(i, g, y),
        addNodes: (g) => t.addNodes(g),
        removeNodes: (g) => t.removeNodes(g),
        addEdges: (g) => t.addEdges(g),
        removeEdges: (g) => t.removeEdges(g)
      }, h = new Nh(u, o), p = async () => {
        i.animate = (...g) => u.animate(...g), i.update = (...g) => u.update(...g), i.sendParticle = (...g) => u.sendParticle(...g), i.sendParticleAlongPath = (...g) => u.sendParticleAlongPath(...g), i.sendParticleBetween = (...g) => u.sendParticleBetween(...g), i.sendParticleBurst = (...g) => u.sendParticleBurst(...g), i.sendConverging = (...g) => u.sendConverging(...g);
        try {
          const g = n();
          g instanceof Promise && await g;
        } finally {
          i.animate = r, i.update = s, i.sendParticle = l, i.sendParticleAlongPath = a, i.sendParticleBetween = c, i.sendParticleBurst = d, i.sendConverging = f;
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
      return new $h(r, n, o);
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
      jt(n, o);
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
function gs(t, e, n, o) {
  const i = e.find((l) => l.id === t);
  if (!i) return /* @__PURE__ */ new Set();
  if (i.type === "group")
    return ft(t, e);
  const r = /* @__PURE__ */ new Set(), s = Yo(t, e, n);
  for (const l of s)
    r.add(l.id);
  if (o?.recursive) {
    const l = s.map((a) => a.id);
    for (; l.length > 0; ) {
      const a = l.shift(), c = Yo(a, e, n);
      for (const d of c)
        !r.has(d.id) && d.id !== t && (r.add(d.id), l.push(d.id));
    }
  }
  return r;
}
function Dh(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e)
    n.has(i.id) && o.set(i.id, { ...i.position });
  return {
    targetPositions: o,
    originalDimensions: t.type === "group" ? { ...t.dimensions ?? { width: 400, height: 300 } } : void 0,
    reroutedEdges: /* @__PURE__ */ new Map()
  };
}
function Co(t, e, n, o) {
  t.collapsed = !0, o && (t.dimensions = { ...o });
  for (const i of e)
    n.targetPositions.has(i.id) && (i.hidden = !0);
}
function ms(t, e, n, o = !0) {
  t.collapsed = !1, o && n.originalDimensions && (t.dimensions = { ...n.originalDimensions });
  const i = /* @__PURE__ */ new Set();
  if (t.type === "group") {
    for (const r of e)
      if (r.collapsed && r.id !== t.id && n.targetPositions.has(r.id)) {
        const s = ft(r.id, e);
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
function So(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = n.has(i.source), s = n.has(i.target), l = i.source === t, a = i.target === t;
    !r && !s || (o.set(i.id, { source: i.source, target: i.target, hidden: i.hidden }), r && s || l && s || r && a ? i.hidden = !0 : r ? i.source = t : i.target = t);
  }
  return o;
}
function Rh(t, e) {
  for (const n of t) {
    const o = e.get(n.id);
    o && (n.source = o.source, n.target = o.target, o.hidden !== void 0 ? n.hidden = o.hidden : delete n.hidden);
  }
}
const An = { width: 150, height: 50 };
function Fh(t) {
  return {
    /**
     * Collapse a node — hide its descendants/outgoers and optionally animate.
     */
    collapseNode(e, n) {
      const o = t._nodeMap.get(e);
      if (!o || o.collapsed) return;
      const i = gs(e, t.nodes, t.edges, { recursive: n?.recursive });
      if (i.size === 0) return;
      q("collapse", `Collapsing node "${e}"`, {
        type: o.type ?? "default",
        descendants: [...i],
        animate: n?.animate !== !1,
        recursive: n?.recursive ?? !1
      }), t._captureHistory();
      const r = o.type === "group", s = r ? o.collapsedDimensions ?? { width: 150, height: 60 } : void 0, l = n?.animate !== !1, a = Dh(o, t.nodes, i);
      if (l) {
        t._suspendHistory();
        const c = o.dimensions ?? An, d = r && s ? s : c, f = {};
        for (const [h] of a.targetPositions) {
          const p = t._nodeMap.get(h);
          if (!p) continue;
          const g = p.dimensions ?? An;
          let y, m;
          p.parentId === e ? (y = (d.width - g.width) / 2, m = (d.height - g.height) / 2) : (y = o.position.x + (d.width - g.width) / 2, m = o.position.y + (d.height - g.height) / 2), f[h] = {
            position: { x: y, y: m },
            style: { opacity: "0" }
          };
        }
        r && s && (f[e] = { dimensions: s });
        const u = [];
        for (const h of t.edges)
          if (i.has(h.source) || i.has(h.target)) {
            const p = t.getEdgeElement?.(h.id)?.closest("svg");
            p && u.push(p);
          }
        t.animate ? t.animate({ nodes: f }, {
          duration: 300,
          easing: "easeInOut",
          onProgress: (h) => {
            const p = String(1 - h);
            for (const g of u) g.style.opacity = p;
          },
          onComplete: () => {
            for (const h of u) h.style.opacity = "";
            Co(o, t.nodes, a, s), a.reroutedEdges = So(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] });
          }
        }) : (Co(o, t.nodes, a, s), a.reroutedEdges = So(e, t.edges, i), t._collapseState.set(e, a), t._resumeHistory(), t._emit("node-collapse", { node: o, descendants: [...i] }));
      } else
        Co(o, t.nodes, a, s), a.reroutedEdges = So(e, t.edges, i), t._collapseState.set(e, a), t._emit("node-collapse", { node: o, descendants: [...i] });
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
      if (i.reroutedEdges.size > 0 && Rh(t.edges, i.reroutedEdges), s) {
        t._suspendHistory(), r && i.originalDimensions && (o.dimensions = { ...i.originalDimensions });
        const l = o.dimensions ?? An;
        ms(o, t.nodes, i, r);
        const a = {};
        for (const [f, u] of i.targetPositions) {
          const h = t._nodeMap.get(f);
          if (h && !h.hidden) {
            const p = h.dimensions ?? An;
            let g, y;
            h.parentId === e ? (g = (l.width - p.width) / 2, y = (l.height - p.height) / 2) : (g = o.position.x + (l.width - p.width) / 2, y = o.position.y + (l.height - p.height) / 2), h.position = { x: g, y }, h.style = { ...h.style || {}, opacity: "0" }, a[f] = {
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
        ms(o, t.nodes, i, r), t._collapseState.delete(e), t._emit("node-expand", { node: o, descendants: [...i.targetPositions.keys()] });
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
      return gs(e, t.nodes, t.edges).size;
    },
    /**
     * Get the number of descendants (via parentId hierarchy) of a node.
     */
    getDescendantCount(e) {
      return ft(e, t.nodes).size;
    }
  };
}
function Hh(t) {
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
function Oh(t) {
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
const zh = 8, Vh = 12, Bh = 2;
function _i(t) {
  return {
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function qh(t) {
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
function Xh(t) {
  return [...t].sort((e, n) => {
    const o = e.order ?? 1 / 0, i = n.order ?? 1 / 0;
    return o !== i ? o - i : 0;
  });
}
function ys(t, e, n) {
  const o = e.gap ?? zh, i = e.padding ?? Vh, r = e.headerHeight ?? 0, s = qh(e), l = Xh(t), a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return {
      positions: a,
      dimensions: c,
      parentDimensions: n ? { width: n.width, height: n.height } : { width: i * 2, height: i * 2 + r }
    };
  const d = n ? n.width - i * 2 : 0, f = n ? n.height - i * 2 - r : 0;
  return e.direction === "vertical" ? Yh(l, o, i, r, s, d, a, c) : e.direction === "horizontal" ? Wh(l, o, i, r, s, f, a, c) : jh(l, o, i, r, s, e.columns ?? Bh, d, f, a, c);
}
function Yh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((u) => _i(u));
  for (const u of c) a = Math.max(a, u.width);
  const d = r > 0 ? r : a;
  let f = n + o;
  for (let u = 0; u < t.length; u++) {
    const h = t[u], p = c[u];
    s.set(h.id, { x: n, y: f }), (i === "width" || i === "both") && l.set(h.id, { width: d, height: p.height }), f += p.height + e;
  }
  return f -= e, f += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: d + n * 2, height: f }
  };
}
function Wh(t, e, n, o, i, r, s, l) {
  let a = 0;
  const c = t.map((u) => _i(u));
  for (const u of c) a = Math.max(a, u.height);
  const d = r > 0 ? r : a;
  let f = n;
  for (let u = 0; u < t.length; u++) {
    const h = t[u], p = c[u];
    s.set(h.id, { x: f, y: n + o }), (i === "height" || i === "both") && l.set(h.id, { width: p.width, height: d }), f += p.width + e;
  }
  return f -= e, f += n, {
    positions: s,
    dimensions: l,
    parentDimensions: { width: f, height: d + n * 2 + o }
  };
}
function jh(t, e, n, o, i, r, s, l, a, c) {
  const d = Math.min(r, t.length), f = t.map((m) => _i(m));
  let u = 0, h = 0;
  for (const m of f)
    u = Math.max(u, m.width), h = Math.max(h, m.height);
  const p = s > 0 ? (s - (d - 1) * e) / d : 0;
  p > 0 && (u = p);
  const g = Math.ceil(t.length / d), y = l > 0 ? (l - (g - 1) * e) / g : 0;
  y > 0 && (h = y);
  for (let m = 0; m < t.length; m++) {
    const b = m % d, S = Math.floor(m / d), _ = n + b * (u + e), M = n + o + S * (h + e);
    a.set(t[m].id, { x: _, y: M }), i === "both" ? c.set(t[m].id, { width: u, height: h }) : i === "width" ? c.set(t[m].id, { width: u, height: f[m].height }) : i === "height" && c.set(t[m].id, { width: f[m].width, height: h });
  }
  return {
    positions: a,
    dimensions: c,
    parentDimensions: {
      width: d * u + (d - 1) * e + n * 2,
      height: g * h + (g - 1) * e + n * 2 + o
    }
  };
}
function Uh(t) {
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
      const f = t.nodes.find((_) => _.id === e);
      if (!f?.childLayout) return;
      let u = t.nodes.filter((_) => _.parentId === e);
      l && (u = u.filter((_) => _.id !== l)), a && !u.some((_) => _.id === a.id) && (u = [...u, a]);
      const h = new Map(u.map((_) => [_.id, _]));
      if (f.dimensions = void 0, !d && f.maxDimensions && f.maxDimensions.width !== void 0 && f.maxDimensions.height !== void 0 && (d = { width: f.maxDimensions.width, height: f.maxDimensions.height }), !c)
        for (const _ of u)
          _.childLayout && this.layoutChildren(_.id, { excludeId: s, omitFromComputation: l, shallow: !1 });
      const p = f.childLayout, g = p.headerHeight !== void 0 ? p : f.data?.label ? { ...p, headerHeight: 30 } : p, y = ys(u, g, d);
      for (const [_, M] of y.positions) {
        if (_ === s || a && _ === a.id && !t._nodeMap.has(_)) continue;
        const L = h.get(_);
        L && (L.position ? (L.position.x = M.x, L.position.y = M.y) : L.position = { x: M.x, y: M.y });
      }
      for (const [_, M] of y.dimensions) {
        if (_ === s || a && _ === a.id && !t._nodeMap.has(_)) continue;
        const L = h.get(_);
        if (L) {
          let P = M.width, $ = M.height;
          L.minDimensions && (L.minDimensions.width != null && (P = Math.max(P, L.minDimensions.width)), L.minDimensions.height != null && ($ = Math.max($, L.minDimensions.height))), L.maxDimensions && (L.maxDimensions.width != null && (P = Math.min(P, L.maxDimensions.width)), L.maxDimensions.height != null && ($ = Math.min($, L.maxDimensions.height))), L.dimensions ? (L.dimensions.width = P, L.dimensions.height = $) : L.dimensions = { width: P, height: $ }, L.childLayout && !c && this.layoutChildren(_, { excludeId: s, omitFromComputation: l, shallow: !1, stretchedSize: L.dimensions });
        }
      }
      let m = y.parentDimensions.width, b = y.parentDimensions.height;
      if (f.minDimensions && (f.minDimensions.width != null && (m = Math.max(m, f.minDimensions.width)), f.minDimensions.height != null && (b = Math.max(b, f.minDimensions.height))), f.maxDimensions && (f.maxDimensions.width != null && (m = Math.min(m, f.maxDimensions.width)), f.maxDimensions.height != null && (b = Math.min(b, f.maxDimensions.height))), f.dimensions || (f.dimensions = { width: 0, height: 0 }), f.dimensions.width = m, f.dimensions.height = b, m !== y.parentDimensions.width || b !== y.parentDimensions.height) {
        const M = ys(u, g, { width: m, height: b });
        for (const [L, P] of M.positions) {
          if (L === s || a && L === a.id && !t._nodeMap.has(L)) continue;
          const $ = h.get(L);
          $ && ($.position ? ($.position.x = P.x, $.position.y = P.y) : $.position = { x: P.x, y: P.y });
        }
        for (const [L, P] of M.dimensions) {
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
function Zh(t) {
  return {
    // ── Internal helpers ──────────────────────────────────────────────────
    _getChildValidation(e) {
      const n = t.getNode(e);
      if (n)
        return ln(n, t._config.childValidationRules ?? {});
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
        const r = ln(i, t._config.childValidationRules ?? {});
        if (!r) {
          t._validationErrorCache.delete(o);
          continue;
        }
        const s = t.nodes.filter((a) => a.parentId === o), l = ds(i, s, r);
        l.length > 0 ? t._validationErrorCache.set(o, l) : t._validationErrorCache.delete(o), i._validationErrors = l;
      }
    },
    // ── Child Validation API ─────────────────────────────────────────────
    validateParent(e) {
      const n = t.getNode(e);
      if (!n) return { valid: !0, errors: [] };
      const o = ln(n, t._config.childValidationRules ?? {});
      if (!o) return { valid: !0, errors: [] };
      const i = t.nodes.filter((s) => s.parentId === e), r = ds(n, i, o);
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
                (g) => g.parentId === i
              ), p = no(u, o, h, f);
              if (!p.valid)
                return t._config.onChildValidationFail && t._config.onChildValidationFail({
                  parent: u,
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
        if (o.position.x = d.x, o.position.y = d.y, o.parentId = void 0, o.extent = void 0, t.nodes = ht(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), i) {
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
      if (!r || ft(e, t.nodes).has(n)) return !1;
      const s = this._getChildValidation(n);
      if (s) {
        const d = t.nodes.filter(
          (u) => u.parentId === n && u.id !== e
        ), f = Vr(r, o, d, s);
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
              (p) => p.parentId === i
            ), h = no(f, o, u, d);
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
      if (o.position.x = l.x - a.x, o.position.y = l.y - a.y, o.parentId = n, t.nodes = ht(t.nodes), t._rebuildNodeMap(), this._recomputeChildValidation(), n && t._nodeMap.get(n)?.childLayout) {
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
function Kh(t) {
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
function Hn(t, e, n, o, i) {
  const r = i * Math.PI / 180, s = Math.cos(r), l = Math.sin(r), a = t - n, c = e - o;
  return {
    x: n + a * s - c * l,
    y: o + a * l + c * s
  };
}
const Ur = 20, Nn = Ur + 1;
function ws(t) {
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
function Gh(t, e) {
  return {
    x: t.x - e,
    y: t.y - e,
    width: t.width + e * 2,
    height: t.height + e * 2
  };
}
function Jh(t, e, n) {
  return t > n.x && t < n.x + n.width && e > n.y && e < n.y + n.height;
}
function Qh(t, e, n, o) {
  const i = Math.min(t, e), r = Math.max(t, e);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (n > c && n < d && r > l && i < a)
      return !0;
  }
  return !1;
}
function ep(t, e, n, o) {
  const i = Math.min(e, n), r = Math.max(e, n);
  for (const s of o) {
    const l = s.x, a = s.x + s.width, c = s.y, d = s.y + s.height;
    if (t > l && t < a && r > c && i < d)
      return !0;
  }
  return !1;
}
function tp(t, e, n, o, i) {
  const r = /* @__PURE__ */ new Set([t, n]), s = /* @__PURE__ */ new Set([e, o]);
  for (const f of i)
    r.add(f.x), r.add(f.x + f.width), s.add(f.y), s.add(f.y + f.height);
  const l = Array.from(r).sort((f, u) => f - u), a = Array.from(s).sort((f, u) => f - u), c = [];
  let d = 0;
  for (const f of l)
    for (const u of a) {
      let h = !1;
      for (const p of i)
        if (Jh(f, u, p)) {
          h = !0;
          break;
        }
      h || c.push({ x: f, y: u, index: d++ });
    }
  return c;
}
function np(t, e, n, o) {
  const i = n.length, r = new Float64Array(i).fill(1 / 0), s = new Int32Array(i).fill(-1), l = new Uint8Array(i);
  r[t.index] = 0;
  const a = [t.index];
  for (; a.length > 0; ) {
    let f = 0;
    for (let p = 1; p < a.length; p++)
      r[a[p]] < r[a[f]] && (f = p);
    const u = a[f];
    if (a.splice(f, 1), l[u]) continue;
    if (l[u] = 1, u === e.index) break;
    const h = n[u];
    for (let p = 0; p < i; p++) {
      if (l[p]) continue;
      const g = n[p];
      if (h.x !== g.x && h.y !== g.y) continue;
      let y = !1;
      if (h.x === g.x ? y = ep(h.x, h.y, g.y, o) : y = Qh(h.x, g.x, h.y, o), y) continue;
      const m = Math.abs(g.x - h.x) + Math.abs(g.y - h.y), b = r[u] + m;
      b < r[p] && (r[p] = b, s[p] = u, a.push(p));
    }
  }
  if (r[e.index] === 1 / 0) return null;
  const c = [];
  let d = e.index;
  for (; d !== -1; )
    c.unshift(n[d]), d = s[d];
  return c;
}
function op(t) {
  if (t.length <= 2) return t;
  const e = [t[0]];
  for (let n = 1; n < t.length - 1; n++) {
    const o = e[e.length - 1], i = t[n + 1], r = t[n], s = o.x === r.x && r.x === i.x, l = o.y === r.y && r.y === i.y;
    !s && !l && e.push(r);
  }
  return e.push(t[t.length - 1]), e;
}
function ip(t, e) {
  if (t.length < 2) return "";
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    e > 0 ? n += ` ${qt(r.x, r.y, s.x, s.y, l.x, l.y, e)}` : n += ` L${s.x},${s.y}`;
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function sp(t) {
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
function Zr(t, e, n, o, i, r, s) {
  const l = ws(n), a = ws(r), c = t + l.x * Nn, d = e + l.y * Nn, f = o + a.x * Nn, u = i + a.y * Nn, h = s.map((M) => Gh(M, Ur)), p = tp(
    c,
    d,
    f,
    u,
    h
  ), g = p.find((M) => M.x === c && M.y === d), y = p.find((M) => M.x === f && M.y === u);
  g || p.push({ x: c, y: d, index: p.length }), y || p.push({ x: f, y: u, index: p.length });
  const m = g ?? p[p.length - (y ? 1 : 2)], b = y ?? p[p.length - 1], S = np(m, b, p, h);
  if (!S || S.length < 2) return null;
  const _ = [
    { x: t, y: e, index: -1 },
    ...S,
    { x: o, y: i, index: -2 }
  ];
  return op(_);
}
function rp({
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
    return mn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const a = Zr(t, e, n, o, i, r, s);
  if (!a)
    return mn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r,
      borderRadius: l
    });
  const c = ip(a, l), { x: d, y: f, offsetX: u, offsetY: h } = sp(a);
  return {
    path: c,
    labelPosition: { x: d, y: f },
    labelOffsetX: u,
    labelOffsetY: h
  };
}
function Kr(t) {
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
function ap(t) {
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
function lp({
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
  const l = Zr(t, e, n, o, i, r, s);
  if (!l)
    return Gn({
      sourceX: t,
      sourceY: e,
      sourcePosition: n,
      targetX: o,
      targetY: i,
      targetPosition: r
    });
  const a = Kr(l), { x: c, y: d, offsetX: f, offsetY: u } = ap(l);
  return {
    path: a,
    labelPosition: { x: c, y: d },
    labelOffsetX: f,
    labelOffsetY: u
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
    borderRadius: l = 5
  } = t, a = [
    { x: e, y: n },
    ...r,
    { x: o, y: i }
  ];
  let c;
  switch (s) {
    case "linear":
      c = vs(a);
      break;
    case "step":
      c = dp(a, 0);
      break;
    case "smoothstep":
      c = up(a, l);
      break;
    case "catmull-rom":
    case "bezier":
      c = Kr(a.map((u, h) => ({ ...u, index: h })));
      break;
    default:
      c = vs(a);
  }
  const d = fp(a), f = _n({ sourceX: e, sourceY: n, targetX: o, targetY: i });
  return {
    path: c,
    labelPosition: d,
    labelOffsetX: f.offsetX,
    labelOffsetY: f.offsetY
  };
}
function vs(t) {
  if (t.length < 2) return "";
  let e = `M${t[0].x},${t[0].y}`;
  for (let n = 1; n < t.length; n++)
    e += ` L${t[n].x},${t[n].y}`;
  return e;
}
function dp(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return Gr(t[0], t[1], e);
  let n = `M${t[0].x},${t[0].y}`;
  for (let i = 1; i < t.length - 1; i++) {
    const r = t[i - 1], s = t[i], l = t[i + 1];
    n += qt(r.x, r.y, s.x, s.y, l.x, l.y, e);
  }
  const o = t[t.length - 1];
  return n += ` L${o.x},${o.y}`, n;
}
function Gr(t, e, n) {
  const o = (t.x + e.x) / 2, i = qt(t.x, t.y, o, t.y, o, e.y, n), r = qt(o, t.y, o, e.y, e.x, e.y, n);
  return `M${t.x},${t.y}${i}${r} L${e.x},${e.y}`;
}
function up(t, e) {
  if (t.length < 2) return "";
  if (t.length === 2)
    return Gr(t[0], t[1], e);
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
    o += qt(s.x, s.y, l.x, l.y, a.x, a.y, e);
  }
  const i = n[n.length - 1];
  return o += ` L${i.x},${i.y}`, o;
}
function fp(t) {
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
function Yt(t, e, n, o) {
  const i = t.dimensions?.width ?? ve, r = t.dimensions?.height ?? _e, s = Wt(t, o);
  let l;
  if (t.shape) {
    const a = n?.[t.shape] ?? Hr[t.shape];
    if (a) {
      const c = a.perimeterPoint(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    } else {
      const c = ls(i, r, e);
      l = { x: s.x + c.x, y: s.y + c.y };
    }
  } else {
    const a = ls(i, r, e);
    l = { x: s.x + a.x, y: s.y + a.y };
  }
  if (t.rotation) {
    const a = s.x + i / 2, c = s.y + r / 2;
    l = Hn(l.x, l.y, a, c, t.rotation);
  }
  return l;
}
function _s(t) {
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
function Qo(t) {
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
const hp = 1.5, pp = 5 / 20;
function At(t, e, n, o) {
  if (!o) return t;
  const i = typeof o == "string" ? {} : o, r = n ? Math.min(n.handleWidth, n.handleHeight) / 2 : 5;
  if (i.offset !== void 0) {
    const f = Qo(e);
    return { x: t.x + f.x * i.offset, y: t.y + f.y * i.offset };
  }
  const a = (i.width ?? 12.5) * hp * pp * 0.4, c = r + a, d = Qo(e);
  return { x: t.x + d.x * c, y: t.y + d.y * c };
}
function oo(t, e, n, o = "bottom", i = "top", r, s, l, a, c, d, f) {
  const u = r ?? Yt(e, o, c, d), h = s ?? Yt(n, i, c, d), p = {
    sourceX: u.x,
    sourceY: u.y,
    sourcePosition: _s(o),
    targetX: h.x,
    targetY: h.y,
    targetPosition: _s(i)
  }, g = t.type ?? f ?? "bezier";
  if (l?.[g])
    return l[g](p);
  switch (g === "floating" ? t.pathType ?? "bezier" : g) {
    case "editable":
      return cp({
        ...p,
        controlPoints: t.controlPoints,
        pathStyle: t.pathStyle
      });
    case "avoidant":
      return lp({ ...p, obstacles: a });
    case "orthogonal":
      return rp({ ...p, obstacles: a });
    case "smoothstep":
      return mn(p);
    case "straight":
      return Ar({ sourceX: u.x, sourceY: u.y, targetX: h.x, targetY: h.y });
    default:
      return Gn(p);
  }
}
function bs(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, r = t.rotation ? Hn(e.x, e.y, i.x, i.y, -t.rotation) : e, s = r.x - i.x, l = r.y - i.y;
  if (s === 0 && l === 0) {
    const p = { x: i.x, y: i.y - o / 2 };
    return t.rotation ? Hn(p.x, p.y, i.x, i.y, t.rotation) : p;
  }
  const a = n / 2, c = o / 2, d = Math.abs(s), f = Math.abs(l);
  let u;
  d / a > f / c ? u = a / d : u = c / f;
  const h = {
    x: i.x + s * u,
    y: i.y + l * u
  };
  return t.rotation ? Hn(h.x, h.y, i.x, i.y, t.rotation) : h;
}
function xs(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = t.position.x + n / 2, r = t.position.y + o / 2;
  if (t.rotation) {
    const h = e.x - i, p = e.y - r;
    return Math.abs(h) > Math.abs(p) ? h > 0 ? "right" : "left" : p > 0 ? "bottom" : "top";
  }
  const s = 1, l = t.position.x, a = t.position.x + n, c = t.position.y, d = t.position.y + o;
  if (Math.abs(e.x - l) <= s) return "left";
  if (Math.abs(e.x - a) <= s) return "right";
  if (Math.abs(e.y - c) <= s) return "top";
  if (Math.abs(e.y - d) <= s) return "bottom";
  const f = e.x - i, u = e.y - r;
  return Math.abs(f) > Math.abs(u) ? f > 0 ? "right" : "left" : u > 0 ? "bottom" : "top";
}
function Jr(t, e) {
  const n = t.dimensions?.width ?? ve, o = t.dimensions?.height ?? _e, i = e.dimensions?.width ?? ve, r = e.dimensions?.height ?? _e, s = {
    x: t.position.x + n / 2,
    y: t.position.y + o / 2
  }, l = {
    x: e.position.x + i / 2,
    y: e.position.y + r / 2
  }, a = bs(t, l), c = bs(e, s), d = xs(t, a), f = xs(e, c);
  return {
    sx: a.x,
    sy: a.y,
    tx: c.x,
    ty: c.y,
    sourcePos: d,
    targetPos: f
  };
}
function ny(t, e) {
  const n = e.x - t.x, o = e.y - t.y;
  let i, r;
  return Math.abs(n) > Math.abs(o) ? (i = n > 0 ? "right" : "left", r = n > 0 ? "left" : "right") : (i = o > 0 ? "bottom" : "top", r = o > 0 ? "top" : "bottom"), { sourcePos: i, targetPos: r };
}
function Qr(t) {
  return typeof t == "object" && t !== null && "from" in t && "to" in t;
}
function ea(t, e) {
  return `${t}__grad__${e}`;
}
function ta(t, e, n, o, i, r, s) {
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
function ko(t, e) {
  t.querySelector(`#${CSS.escape(e)}`)?.remove();
}
const gp = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
async function mp(t) {
  const { dropNodeId: e, dropHandleId: n, draggedEnd: o, edge: i, canvas: r, containerEl: s } = t;
  if (!e)
    return { applied: !1 };
  const l = r.getNode(e);
  if (l && !ze(l))
    return { applied: !1 };
  const a = o === "target" ? { source: i.source, sourceHandle: i.sourceHandle, target: e, targetHandle: n } : { source: e, sourceHandle: n, target: i.target, targetHandle: i.targetHandle }, c = { ...i }, d = await $r({
    edge: i,
    newConnection: a,
    canvas: r,
    containerEl: s,
    endpoint: o
  });
  return d.applied ? (r._emit?.("reconnect", { oldEdge: c, newConnection: a }), { applied: !0, newConnection: a }) : { applied: !1, reason: d.reason, newConnection: a };
}
function yp(t) {
  return t === !0 || t === "dash" ? "dash" : t === "pulse" ? "pulse" : t === "dot" ? "dot" : "none";
}
function na(t) {
  return t.endsWith("-l") ? "left" : t.endsWith("-r") ? "right" : null;
}
function Es(t, e) {
  if (!e) return t;
  const n = Qo(t), o = e * Math.PI / 180, i = Math.cos(o), r = Math.sin(o), s = n.x * i - n.y * r, l = n.x * r + n.y * i;
  return Math.abs(s) > Math.abs(l) ? s > 0 ? "right" : "left" : l > 0 ? "bottom" : "top";
}
function Cs(t) {
  return { x: (t.left + t.right) / 2, y: (t.top + t.bottom) / 2 };
}
function io(t, e) {
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
function so(t, e, n, o, i, r) {
  const s = t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (s) {
    if (n) {
      const a = s.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(n)}"][data-flow-handle-type="${o}"]`
      );
      let c = io(a, r);
      if (!c) {
        const d = s.querySelectorAll(
          `[data-flow-handle-id="${CSS.escape(n)}"]`
        );
        c = io(d, r);
      }
      if (c)
        return c.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
    }
    if (n) {
      const a = na(n);
      if (a && s.querySelector(`[data-flow-handle-position="${a}"]`))
        return a;
    }
    const l = s.querySelector(`[data-flow-handle-type="${o}"]`);
    if (l)
      return l.getAttribute("data-flow-handle-position") ?? (o === "source" ? "bottom" : "top");
  }
  if (i) {
    const l = o === "source" ? i.sourcePosition : i.targetPosition;
    if (l) return l;
  }
  return o === "source" ? "bottom" : "top";
}
function Ss(t, e, n, o, i, r, s, l) {
  const a = t.querySelector(`[data-flow-node-id="${CSS.escape(e)}"]`);
  if (!a) return null;
  let c = null;
  if (o) {
    const p = a.querySelectorAll(
      `[data-flow-handle-id="${CSS.escape(o)}"][data-flow-handle-type="${i}"]`
    );
    if (c = io(p, l), !c) {
      const g = a.querySelectorAll(
        `[data-flow-handle-id="${CSS.escape(o)}"]`
      );
      c = io(g, l);
    }
    if (!c) {
      const g = na(o);
      g && (c = a.querySelector(`[data-flow-handle-position="${g}"]`));
    }
  } else
    c = a.querySelector(`[data-flow-handle-type="${i}"]`);
  if (!c) return null;
  const d = c.getBoundingClientRect();
  if (d.width === 0 && d.height === 0) return null;
  const f = t.getBoundingClientRect(), u = d.left + d.width / 2, h = d.top + d.height / 2;
  return {
    x: (u - f.left - s.x) / r,
    y: (h - f.top - s.y) / r,
    handleWidth: d.width / r,
    handleHeight: d.height / r
  };
}
function wp(t, e) {
  const n = t.getTotalLength(), o = t.getPointAtLength(n * Math.max(0, Math.min(1, e)));
  return { x: o.x, y: o.y };
}
function st(t, e, n, o, i) {
  const r = t - n, s = e - o;
  return Math.sqrt(r * r + s * s) <= i;
}
function vp(t, e, n) {
  const o = n.x - e.x, i = n.y - e.y, r = o * o + i * i;
  if (r === 0) return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
  let s = ((t.x - e.x) * o + (t.y - e.y) * i) / r;
  s = Math.max(0, Math.min(1, s));
  const l = e.x + s * o, a = e.y + s * i;
  return Math.sqrt((t.x - l) ** 2 + (t.y - a) ** 2);
}
function _p(t) {
  t.directive(
    "flow-edge",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      const s = e;
      s.style.pointerEvents = "auto";
      const l = document.createElementNS("http://www.w3.org/2000/svg", "path");
      l.setAttribute("fill", "none"), l.style.stroke = "transparent", l.style.strokeWidth = "20", l.style.pointerEvents = "stroke", l.style.cursor = "pointer", s.appendChild(l);
      let a = e.querySelector("path:not(:first-child)");
      a || (a = document.createElementNS("http://www.w3.org/2000/svg", "path"), a.setAttribute("fill", "none"), a.setAttribute("stroke-width", "1.5"), a.style.pointerEvents = "none", s.appendChild(a));
      let c = null, d = null, f = null, u = null, h = "none", p = null, g = null;
      function y(C, A, R, X, se) {
        u || (u = document.createElementNS("http://www.w3.org/2000/svg", "circle"), u.classList.add("flow-edge-dot"), u.style.pointerEvents = "none", C.appendChild(u));
        const ne = R.closest(".flow-container"), ie = ne ? getComputedStyle(ne) : null, ae = X.particleSize ?? (parseFloat(ie?.getPropertyValue("--flow-edge-dot-size").trim() ?? "4") || 4), ce = se || ie?.getPropertyValue("--flow-edge-dot-duration").trim() || "2s";
        u.setAttribute("r", String(ae)), X.particleColor ? u.style.fill = X.particleColor : u.style.removeProperty("fill");
        const de = u.querySelector("animateMotion");
        de && de.remove();
        const J = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        J.setAttribute("dur", ce), J.setAttribute("repeatCount", "indefinite"), J.setAttribute("path", A), u.appendChild(J);
      }
      function m() {
        u?.remove(), u = null;
      }
      let b = null, S = null, _ = null, M = null;
      const L = (C) => {
        C.stopPropagation();
        const A = o(n);
        if (!A) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: A, event: C }), ut(C, R._shortcuts?.multiSelect) ? R.selectedEdges.has(A.id) ? (R.selectedEdges.delete(A.id), A.selected = !1, q("selection", `Edge "${A.id}" deselected (shift)`)) : (R.selectedEdges.add(A.id), A.selected = !0, q("selection", `Edge "${A.id}" selected (shift)`)) : (R.deselectAll(), R.selectedEdges.add(A.id), A.selected = !0, q("selection", `Edge "${A.id}" selected`)), R._emitSelectionChange());
      }, P = (C) => {
        C.preventDefault(), C.stopPropagation();
        const A = o(n);
        if (!A) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = C.target;
        if (X.classList.contains("flow-edge-control-point")) {
          const se = parseInt(X.dataset.pointIndex ?? "", 10);
          if (!isNaN(se)) {
            R._emit("edge-control-point-context-menu", {
              edge: A,
              pointIndex: se,
              position: { x: C.clientX, y: C.clientY },
              event: C
            });
            return;
          }
        }
        R._emit("edge-context-menu", { edge: A, event: C });
      }, $ = (C) => {
        C.stopPropagation(), C.preventDefault();
        const A = o(n), R = t.$data(e.closest("[x-data]"));
        if (!A || !R || (A.type ?? R._config?.defaultEdgeType ?? "bezier") !== "editable") return;
        const se = C.target;
        if (se.classList.contains("flow-edge-control-point")) {
          const ne = parseInt(se.dataset.pointIndex ?? "", 10);
          !isNaN(ne) && A.controlPoints && (R._captureHistory?.(), A.controlPoints.splice(ne, 1), R._emit("edge-control-point-change", { edge: A, action: "remove", index: ne }));
          return;
        }
        if (se.classList.contains("flow-edge-midpoint")) {
          const ne = parseInt(se.dataset.segmentIndex ?? "", 10);
          if (!isNaN(ne)) {
            const ie = R.screenToFlowPosition(C.clientX, C.clientY);
            A.controlPoints || (A.controlPoints = []), R._captureHistory?.(), A.controlPoints.splice(ne, 0, { x: ie.x, y: ie.y }), R._emit("edge-control-point-change", { edge: A, action: "add", index: ne });
          }
          return;
        }
        if (se.closest("path")) {
          const ne = R.screenToFlowPosition(C.clientX, C.clientY);
          A.controlPoints || (A.controlPoints = []);
          const ie = [
            b ?? { x: 0, y: 0 },
            ...A.controlPoints,
            S ?? { x: 0, y: 0 }
          ];
          let ae = 0, ce = 1 / 0;
          for (let de = 0; de < ie.length - 1; de++) {
            const J = vp(ne, ie[de], ie[de + 1]);
            J < ce && (ce = J, ae = de);
          }
          R._captureHistory?.(), A.controlPoints.splice(ae, 0, { x: ne.x, y: ne.y }), R._emit("edge-control-point-change", { edge: A, action: "add", index: ae });
        }
      }, x = (C) => {
        const A = C.target;
        if (!A.classList.contains("flow-edge-control-point") || C.button !== 0) return;
        C.stopPropagation(), C.preventDefault();
        const R = o(n);
        if (!R?.controlPoints) return;
        const X = t.$data(e.closest("[x-data]"));
        if (!X) return;
        const se = parseInt(A.dataset.pointIndex ?? "", 10);
        if (isNaN(se)) return;
        A.classList.add("dragging");
        let ne = !1;
        const ie = (ce) => {
          ne || (X._captureHistory?.(), ne = !0);
          let de = X.screenToFlowPosition(ce.clientX, ce.clientY);
          const J = X._config?.snapToGrid;
          J && (de = {
            x: Math.round(de.x / J[0]) * J[0],
            y: Math.round(de.y / J[1]) * J[1]
          }), R.controlPoints[se] = de;
        }, ae = () => {
          document.removeEventListener("pointermove", ie), document.removeEventListener("pointerup", ae), A.classList.remove("dragging"), ne && X._emit("edge-control-point-change", { edge: R, action: "move", index: se });
        };
        document.addEventListener("pointermove", ie), document.addEventListener("pointerup", ae);
      };
      s.addEventListener("contextmenu", P), s.addEventListener("dblclick", $), s.addEventListener("pointerdown", x, !0);
      let E = null;
      const N = (C) => {
        if (C.button !== 0) return;
        C.stopPropagation();
        const A = o(n);
        if (!A) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = R._config?.reconnectSnapRadius ?? Wi, se = R._config?.edgesReconnectable !== !1, ne = A.reconnectable ?? !0;
        let ie = null;
        if (se && ne !== !1 && b && S) {
          const B = R.screenToFlowPosition(C.clientX, C.clientY), j = st(B.x, B.y, b.x, b.y, X) || _ && st(B.x, B.y, _.x, _.y, X);
          (st(B.x, B.y, S.x, S.y, X) || M && st(B.x, B.y, M.x, M.y, X)) && (ne === !0 || ne === "target") ? ie = "target" : j && (ne === !0 || ne === "source") && (ie = "source");
        }
        if (!ie) {
          const B = (j) => {
            document.removeEventListener("pointerup", B), L(j);
          };
          document.addEventListener("pointerup", B, { once: !0 });
          return;
        }
        const ae = C.clientX, ce = C.clientY;
        let de = !1, J = !1, le = null;
        const ee = R._config?.connectionSnapRadius ?? 20;
        let F = null, K = null, U = null, V = ae, I = ce;
        const re = e.closest(".flow-container");
        if (!re) return;
        const G = ie === "target" ? b : S, Y = () => {
          de = !0, s.classList.add("flow-edge-reconnecting"), R._emit("reconnect-start", { edge: A, handleType: ie }), q("reconnect", `Reconnection drag started on edge "${A.id}" (${ie} end)`), K = Ft({
            connectionLineType: R._config?.connectionLineType,
            connectionLineStyle: R._config?.connectionLineStyle,
            connectionLine: R._config?.connectionLine,
            containerEl: s.closest(".flow-container") ?? void 0
          }), F = K.svg;
          const B = R.screenToFlowPosition(ae, ce);
          K.update({
            fromX: G.x,
            fromY: G.y,
            toX: B.x,
            toY: B.y,
            source: A.source,
            sourceHandle: A.sourceHandle
          });
          const j = re.querySelector(".flow-viewport");
          j && j.appendChild(F), ie === "target" && (R.pendingConnection = {
            source: A.source,
            sourceHandle: A.sourceHandle,
            position: B
          }), R._pendingReconnection = {
            edge: A,
            draggedEnd: ie,
            anchorPosition: { ...G },
            position: B
          }, U = Jn(re, R, V, I), ie === "target" && an(re, A.source, A.sourceHandle ?? "source", R, A.id);
        }, te = (B) => {
          if (V = B.clientX, I = B.clientY, !de) {
            Math.sqrt(
              (B.clientX - ae) ** 2 + (B.clientY - ce) ** 2
            ) >= Fn && Y();
            return;
          }
          const j = R.screenToFlowPosition(B.clientX, B.clientY), H = rn({
            containerEl: re,
            handleType: ie === "target" ? "target" : "source",
            excludeNodeId: ie === "target" ? A.source : A.target,
            cursorFlowPos: j,
            connectionSnapRadius: ee,
            getNode: (Z) => R.getNode(Z),
            toFlowPosition: (Z, ue) => R.screenToFlowPosition(Z, ue)
          });
          H.element !== le && (le?.classList.remove("flow-handle-active"), H.element?.classList.add("flow-handle-active"), le = H.element), K?.update({
            fromX: G.x,
            fromY: G.y,
            toX: H.position.x,
            toY: H.position.y,
            source: A.source,
            sourceHandle: A.sourceHandle
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
          J || (J = !0, document.removeEventListener("pointermove", te), document.removeEventListener("pointerup", oe), U?.stop(), U = null, K?.destroy(), K = null, F = null, le?.classList.remove("flow-handle-active"), E = null, s.classList.remove("flow-edge-reconnecting"), Pe(re), R.pendingConnection = null, R._pendingReconnection = null);
        }, oe = async (B) => {
          if (!de) {
            z(), L(B);
            return;
          }
          if (R._connectValidating) return;
          let j = le, H = null;
          if (!j) {
            H = document.elementFromPoint(B.clientX, B.clientY);
            const me = ie === "target" ? '[data-flow-handle-type="target"]' : '[data-flow-handle-type="source"]';
            j = H?.closest(me);
          }
          const Z = (j ? j.closest("[data-flow-node-id]") : H?.closest("[data-flow-node-id]"))?.dataset.flowNodeId, ue = j?.dataset.flowHandleId, he = K?.svg ?? null;
          _t(he, !0);
          let pe;
          try {
            pe = await mp({
              dropNodeId: Z,
              dropHandleId: ue,
              draggedEnd: ie,
              edge: A,
              canvas: R,
              containerEl: re
            });
          } finally {
            _t(he, !1);
          }
          pe.applied ? q("reconnect", `Edge "${A.id}" reconnected (${ie})`, pe.newConnection) : q("reconnect", `Edge "${A.id}" reconnection cancelled — snapping back`, { reason: pe.reason }), R._emit("reconnect-end", { edge: A, successful: pe.applied }), z();
        };
        document.addEventListener("pointermove", te), document.addEventListener("pointerup", oe), E = z;
      };
      s.addEventListener("pointerdown", N);
      const T = (C) => {
        const A = o(n);
        if (!A) return;
        const R = t.$data(e.closest("[x-data]"));
        if (!R) return;
        const X = R._config?.edgesReconnectable !== !1, se = A.reconnectable ?? !0;
        if (!X || se === !1 || !b || !S) {
          s.style.removeProperty("cursor"), l.style.cursor = "pointer";
          return;
        }
        const ne = R._config?.reconnectSnapRadius ?? Wi, ie = R.screenToFlowPosition(C.clientX, C.clientY), ae = (st(ie.x, ie.y, b.x, b.y, ne) || _ && st(ie.x, ie.y, _.x, _.y, ne)) && (se === !0 || se === "source"), ce = (st(ie.x, ie.y, S.x, S.y, ne) || M && st(ie.x, ie.y, M.x, M.y, ne)) && (se === !0 || se === "target");
        ae || ce ? (s.style.cursor = "grab", l.style.cursor = "grab") : (s.style.removeProperty("cursor"), l.style.cursor = "pointer");
      };
      s.addEventListener("pointermove", T);
      const w = (C) => {
        if (C.key !== "Enter" && C.key !== " ") return;
        C.preventDefault(), C.stopPropagation();
        const A = o(n);
        if (!A) return;
        const R = t.$data(e.closest("[x-data]"));
        R && (R._emit("edge-click", { edge: A, event: C }), ut(C, R._shortcuts?.multiSelect) ? R.selectedEdges.has(A.id) ? (R.selectedEdges.delete(A.id), A.selected = !1) : (R.selectedEdges.add(A.id), A.selected = !0) : (R.deselectAll(), R.selectedEdges.add(A.id), A.selected = !0), R._emitSelectionChange());
      };
      s.addEventListener("keydown", w);
      const v = () => {
        s.matches(":focus-visible") && s.classList.add("flow-edge-focused");
      }, D = () => s.classList.remove("flow-edge-focused");
      s.addEventListener("focus", v), s.addEventListener("blur", D);
      const k = (C) => {
        C.stopPropagation();
      };
      s.addEventListener("mousedown", k);
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
        const A = t.$data(e.closest("[x-data]"));
        if (!A?.nodes) return;
        const R = C.type ?? A._config?.defaultEdgeType ?? "bezier";
        A._layoutAnimTick;
        const X = A.getNode(C.source), se = A.getNode(C.target);
        if (!X || !se) return;
        X.sourcePosition, se.targetPosition;
        const ne = Ht(X, A._nodeMap, A._config?.nodeOrigin), ie = Ht(se, A._nodeMap, A._config?.nodeOrigin), ae = e.closest("[x-data]");
        let ce, de, J, le;
        if (R === "floating") {
          const H = Jr(ne, ie);
          ce = H.sourcePos, de = H.targetPos, J = { x: H.sx, y: H.sy, handleWidth: 0, handleHeight: 0 }, le = { x: H.tx, y: H.ty, handleWidth: 0, handleHeight: 0 }, b = { x: H.sx, y: H.sy }, S = { x: H.tx, y: H.ty };
        } else {
          const H = ae.querySelector(
            `[data-flow-node-id="${CSS.escape(C.source)}"]`
          ), Q = ae.querySelector(
            `[data-flow-node-id="${CSS.escape(C.target)}"]`
          ), Z = H ? Cs(H.getBoundingClientRect()) : void 0, ue = Q ? Cs(Q.getBoundingClientRect()) : void 0;
          ce = so(ae, C.source, C.sourceHandle, "source", X, ue), de = so(ae, C.target, C.targetHandle, "target", se, Z);
          const he = t.raw(A).viewport ?? { x: 0, y: 0, zoom: 1 }, pe = he.zoom || 1, me = X.rotation, Se = se.rotation;
          ce = Es(ce, me), de = Es(de, Se), J = Ss(ae, C.source, ne, C.sourceHandle, "source", pe, he, ue), le = Ss(ae, C.target, ie, C.targetHandle, "target", pe, he, Z);
          const Te = Yt(ne, ce, A._shapeRegistry, A._config?.nodeOrigin), we = Yt(ie, de, A._shapeRegistry, A._config?.nodeOrigin);
          b = J ?? Te, S = le ?? we;
        }
        const ee = At(J ?? b, ce, J, C.markerStart), F = At(le ?? S, de, le, C.markerEnd);
        _ = ee, M = F;
        let K;
        (R === "orthogonal" || R === "avoidant") && (K = A.nodes.filter((H) => H.id !== C.source && H.id !== C.target).map((H) => {
          const Q = Ht(H, A._nodeMap, A._config?.nodeOrigin);
          return {
            x: Q.position.x,
            y: Q.position.y,
            width: Q.dimensions?.width ?? ve,
            height: Q.dimensions?.height ?? _e
          };
        }));
        const { path: U, labelPosition: V } = oo(C, ne, ie, ce, de, ee, F, A._config?.edgeTypes, K, A._shapeRegistry, A._config?.nodeOrigin, A._config?.defaultEdgeType);
        a.setAttribute("d", U), l.setAttribute("d", U);
        const I = R === "editable", re = I && (C.showControlPoints || C.selected);
        if (s.querySelectorAll(".flow-edge-control-point, .flow-edge-midpoint").forEach((H) => H.remove()), re) {
          const H = C.controlPoints ?? [], Q = A.viewport?.zoom ?? 1, Z = 6 / Q, ue = 5 / Q, he = b ?? { x: 0, y: 0 }, pe = S ?? { x: 0, y: 0 }, me = [he, ...H, pe], Se = me.length - 1, Te = a.getTotalLength?.() ?? 0;
          if (Te > 0) {
            const we = [0], fe = 200;
            let ke = 1;
            for (let Ce = 1; Ce <= fe && ke < me.length; Ce++) {
              const Me = Ce / fe * Te, Ie = a.getPointAtLength(Me), xe = me[ke], be = Ie.x - xe.x, ge = Ie.y - xe.y;
              be * be + ge * ge < 25 && (we.push(Me), ke++);
            }
            for (; we.length <= Se; )
              we.push(Te);
            for (let Ce = 0; Ce < Se; Ce++) {
              const Me = (we[Ce] + we[Ce + 1]) / 2, Ie = a.getPointAtLength(Me), xe = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              xe.classList.add("flow-edge-midpoint"), xe.setAttribute("cx", String(Ie.x)), xe.setAttribute("cy", String(Ie.y)), xe.setAttribute("r", String(ue)), xe.dataset.segmentIndex = String(Ce);
              const be = document.createElementNS("http://www.w3.org/2000/svg", "title");
              be.textContent = "Double-click to add control point", xe.appendChild(be), s.appendChild(xe);
            }
          }
          for (let we = 0; we < H.length; we++) {
            const fe = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            fe.classList.add("flow-edge-control-point"), fe.setAttribute("cx", String(H[we].x)), fe.setAttribute("cy", String(H[we].y)), fe.setAttribute("r", String(Z)), fe.dataset.pointIndex = String(we), s.appendChild(fe);
          }
        }
        if (l.style.cursor = I ? "crosshair" : "pointer", l.style.strokeWidth = String(
          C.interactionWidth ?? A._config?.defaultInteractionWidth ?? 20
        ), C.markerStart != null) {
          const H = It(C.markerStart), Q = Dt(H, A._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else if (C._renderDualMarker && C.markerEnd) {
          const H = It(C.markerEnd), Q = Dt(H, A._id);
          a.setAttribute("marker-start", `url(#${Q})`);
        } else
          a.removeAttribute("marker-start");
        if (C.markerEnd) {
          const H = It(C.markerEnd), Q = Dt(H, A._id);
          a.setAttribute("marker-end", `url(#${Q})`);
        } else
          a.removeAttribute("marker-end");
        const G = C.strokeWidth ?? 1.5, Y = yp(C.animated);
        switch (Y !== h && (a.classList.remove("flow-edge-animated", "flow-edge-pulse"), h === "dot" && m(), h = Y), Y) {
          case "dash":
            a.classList.add("flow-edge-animated");
            break;
          case "pulse":
            a.classList.add("flow-edge-pulse");
            break;
          case "dot":
            y(s, U, ae, C, C.animationDuration);
            break;
        }
        if (C.animationDuration && Y !== "none" ? (Y === "dash" || Y === "pulse") && (a.style.animationDuration = C.animationDuration) : (Y === "dash" || Y === "pulse") && a.style.removeProperty("animation-duration"), g && g !== C.class && s.classList.remove(...g.split(" ").filter(Boolean)), C.class) {
          const H = Y === "dash" ? " flow-edge-animated" : Y === "pulse" ? " flow-edge-pulse" : "";
          a.setAttribute("class", C.class + H), s.classList.add(...C.class.split(" ").filter(Boolean)), g = C.class;
        } else
          g && (s.classList.remove(...g.split(" ").filter(Boolean)), g = null);
        if (s.setAttribute("aria-selected", String(!!C.selected)), C.selected)
          s.classList.add("flow-edge-selected"), a.style.strokeWidth = String(Math.max(G + 1, 2.5)), a.style.stroke = "var(--flow-edge-stroke-selected, " + pn + ")";
        else {
          s.classList.remove("flow-edge-selected"), a.style.strokeWidth = String(G);
          const H = A._markerDefsEl?.querySelector("defs") ?? null;
          if (Qr(C.color)) {
            if (H) {
              const Q = ea(A._id, C.id), Z = C.gradientDirection === "target-source", ue = b.x, he = b.y, pe = S.x, me = S.y;
              ta(
                H,
                Q,
                Z ? { from: C.color.to, to: C.color.from } : C.color,
                ue,
                he,
                pe,
                me
              ), a.style.stroke = `url(#${Q})`, p = Q;
            }
          } else if (C.color) {
            if (p) {
              const Q = H;
              Q && ko(Q, p), p = null;
            }
            a.style.stroke = C.color;
          } else {
            if (p) {
              const Q = H;
              Q && ko(Q, p), p = null;
            }
            a.style.removeProperty("stroke");
          }
        }
        if (A.selectedRows?.size > 0 && !C.selected && (C.sourceHandle && A.selectedRows.has(C.sourceHandle.replace(/-[lr]$/, "")) || C.targetHandle && A.selectedRows.has(C.targetHandle.replace(/-[lr]$/, ""))) ? (s.classList.add("flow-edge-row-highlighted"), C.selected || (a.style.strokeWidth = String(Math.max(G + 0.5, 2)), a.style.stroke = getComputedStyle(s.closest(".flow-container")).getPropertyValue("--flow-edge-row-highlight-color").trim() || "#3b82f6")) : s.classList.remove("flow-edge-row-highlighted"), C.focusable ?? A._config?.edgesFocusable !== !1 ? (s.setAttribute("tabindex", "0"), s.setAttribute("role", C.ariaRole ?? "group"), s.setAttribute("aria-label", C.ariaLabel ?? (C.label ? `Edge: ${C.label}` : `Edge from ${C.source} to ${C.target}`))) : (s.removeAttribute("tabindex"), s.removeAttribute("role"), s.removeAttribute("aria-label")), C.domAttributes)
          for (const [H, Q] of Object.entries(C.domAttributes))
            H.startsWith("on") || gp.has(H.toLowerCase()) || s.setAttribute(H, Q);
        const oe = (H, Q, Z, ue, he) => {
          if (Q) {
            if (!H && ue) {
              const pe = Z.includes("flow-edge-label-start"), me = Z.includes("flow-edge-label-end");
              let Se = `[data-flow-edge-id="${he}"].flow-edge-label`;
              pe ? Se += ".flow-edge-label-start" : me ? Se += ".flow-edge-label-end" : Se += ":not(.flow-edge-label-start):not(.flow-edge-label-end)", H = ue.querySelector(Se);
            }
            return H || (H = document.createElement("div"), H.className = Z, H.dataset.flowEdgeId = he, ue && ue.appendChild(H)), H.textContent = Q, H;
          }
          return H && H.remove(), null;
        }, B = e.closest(".flow-viewport"), j = C.labelVisibility ?? "always";
        if (c = oe(c, C.label, "flow-edge-label", B, C.id), c)
          if (a.getTotalLength?.()) {
            const H = C.labelPosition ?? 0.5, Q = wp(a, H);
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
          H && (H.classList.toggle("flow-edge-label-hover", j === "hover"), H.classList.toggle("flow-edge-label-on-select", j === "selected"), H.classList.toggle("flow-edge-label-selected", !!C.selected), C.class ? H.classList.add(...C.class.split(" ").filter(Boolean)) : g && H.classList.remove(...g.split(" ").filter(Boolean)));
      }), r(() => {
        if (p) {
          const A = t.$data(e.closest("[x-data]"))?._markerDefsEl?.querySelector("defs");
          A && ko(A, p);
        }
        E?.(), m(), s.removeEventListener("contextmenu", P), s.removeEventListener("dblclick", $), s.removeEventListener("pointerdown", x, !0), s.removeEventListener("pointerdown", N), s.removeEventListener("pointermove", T), s.removeEventListener("keydown", w), s.removeEventListener("focus", v), s.removeEventListener("blur", D), s.removeEventListener("mousedown", k), s.removeEventListener("mouseenter", O), s.removeEventListener("mouseleave", W), c?.remove(), d?.remove(), f?.remove();
      });
    }
  );
}
function bp(t, e) {
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
        let a, c, d, f;
        if (o.type === "floating") {
          const h = Jr(s, l);
          d = { x: h.sx, y: h.sy }, f = { x: h.tx, y: h.ty };
          const p = At(d, h.sourcePos, null, o.markerStart), g = At(f, h.targetPos, null, o.markerEnd), y = oo(o, s, l, h.sourcePos, h.targetPos, p, g, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = y.path, c = y.labelPosition;
        } else {
          const h = t._container;
          let p, g;
          if (h) {
            const M = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.source)}"]`
            ), L = h.querySelector(
              `[data-flow-node-id="${CSS.escape(o.target)}"]`
            );
            if (M) {
              const P = M.getBoundingClientRect();
              p = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
            if (L) {
              const P = L.getBoundingClientRect();
              g = { x: (P.left + P.right) / 2, y: (P.top + P.bottom) / 2 };
            }
          }
          const y = h ? so(h, o.source, o.sourceHandle, "source", i, g) : i?.sourcePosition ?? "bottom", m = h ? so(h, o.target, o.targetHandle, "target", r, p) : r?.targetPosition ?? "top";
          d = Yt(s, y, t._shapeRegistry, t._config.nodeOrigin), f = Yt(l, m, t._shapeRegistry, t._config.nodeOrigin);
          const b = At(d, y, null, o.markerStart), S = At(f, m, null, o.markerEnd), _ = oo(o, s, l, y, m, b, S, void 0, void 0, t._shapeRegistry, t._config.nodeOrigin);
          a = _.path, c = _.labelPosition;
        }
        const u = t.getEdgePathElement(o.id);
        if (u) {
          u.setAttribute("d", a);
          const p = u.parentElement?.querySelector("path:first-child");
          p && p !== u && p.setAttribute("d", a);
        }
        if (Qr(o.color)) {
          const h = t._markerDefsEl?.querySelector("defs");
          if (h) {
            const p = ea(t._id, o.id), g = o.gradientDirection === "target-source";
            ta(
              h,
              p,
              g ? { from: o.color.to, to: o.color.from } : o.color,
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
              const p = u.getTotalLength(), g = o.labelStartOffset ?? 30, y = u.getPointAtLength(Math.min(g, p / 2));
              h.style.left = `${y.x}px`, h.style.top = `${y.y}px`;
            }
          }
          if (o.labelEnd && u) {
            const h = t._viewportEl.querySelector(
              `[data-flow-edge-id="${o.id}"].flow-edge-label-end`
            );
            if (h) {
              const p = u.getTotalLength(), g = o.labelEndOffset ?? 30, y = u.getPointAtLength(Math.max(p - g, p / 2));
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
function xp(t) {
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
              vr(!!i);
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
              t._config.colorMode = i, i && t._container ? t._colorModeHandle ? t._colorModeHandle.update(i) : t._colorModeHandle = Or(t._container, i) : !i && t._colorModeHandle && (t._colorModeHandle.destroy(), t._colorModeHandle = null);
              break;
            case "autoLayout":
              n.autoLayout = i || void 0, t._autoLayoutFailed = !1, i ? (t._autoLayoutReady = !0, t._scheduleAutoLayout()) : (t._autoLayoutReady = !1, t._autoLayoutTimer && (clearTimeout(t._autoLayoutTimer), t._autoLayoutTimer = null));
              break;
          }
    }
  };
}
let Ep = 0;
function Cp(t, e) {
  switch (t) {
    case "lines":
    case "cross":
      return `linear-gradient(0deg, ${e} 1px, transparent 1px), linear-gradient(90deg, ${e} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${e} 1px, transparent 1px)`;
  }
}
function Sp(t) {
  t.data("flowCanvas", (e = {}) => {
    const n = {
      // ── Reactive State ────────────────────────────────────────────────
      /** Unique instance ID for SVG marker dedup, etc. */
      _id: `flow-${++Ep}`,
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
      _shapeRegistry: { ...Hr, ...e.shapeTypes },
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
          const p = h.gap * l, g = h.variant === "cross" ? p / 2 : p;
          d.push(Cp(h.variant, h.color)), h.variant === "lines" || h.variant === "cross" ? (f.push(`${g}px ${g}px, ${g}px ${g}px`), u.push(`${a}px ${c}px, ${a}px ${c}px`)) : (f.push(`${p}px ${p}px`), u.push(`${a}px ${c}px`));
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
      _shortcuts: vf(e.keyboardShortcuts),
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
      _computeEngine: new If(),
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
        this._nodeMap = Dr(this.nodes);
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
        const a = e.cullingBuffer ?? 100, c = Mu(this.viewport, s, l, a), d = /* @__PURE__ */ new Set();
        for (const f of this.nodes) {
          if (f.hidden) continue;
          const u = f.dimensions?.width ?? 150, h = f.dimensions?.height ?? 50, p = f.parentId ? jo(f, this._nodeMap, this._config.nodeOrigin) : f.position, g = !(p.x + u < c.minX || p.x > c.maxX || p.y + h < c.minY || p.y > c.maxY);
          g && d.add(f.id);
          const y = this._nodeElements.get(f.id);
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
        return l ? jo(l, this._nodeMap, this._config.nodeOrigin) : { x: 0, y: 0 };
      },
      // ── Init Helpers ─────────────────────────────────────────────────
      /** Enable debug logging if configured. */
      _initDebug() {
        e.debug && vr(!0);
      },
      /** Set up container element, attributes, CSS custom properties, animator. */
      _initContainer() {
        this._container = this.$el, this._container.setAttribute("data-flow-canvas", ""), e.fitViewOnInit && this._container.setAttribute("data-fit-view", ""), this._container.setAttribute("role", "application"), this._container.setAttribute("aria-label", e.ariaLabel ?? "Flow diagram"), this._containerStyles = getComputedStyle(this._container), this._animator = new Vu(Un), e.patternColor && this._container.style.setProperty("--flow-bg-pattern-color", e.patternColor), e.backgroundGap && this._container.style.setProperty("--flow-bg-pattern-gap", String(e.backgroundGap));
        const s = e.containerHeight;
        if (s !== void 0 && s !== "auto") {
          let l = null;
          s === "fill" ? l = "100%" : typeof s == "number" && Number.isFinite(s) ? l = `${s}px` : typeof s == "string" && s.trim() && (l = s.trim()), l !== null && this._container.style.setProperty("--flow-container-height", l);
        }
        this._applyZoomLevel(this.viewport.zoom);
      },
      /** Create color mode handle if configured. */
      _initColorMode() {
        e.colorMode && (this._colorModeHandle = Or(this._container, e.colorMode));
      },
      /** Hydrate from static HTML, sort nodes, rebuild maps, capture initial dimensions. */
      _initHydration() {
        this._container.hasAttribute("data-flow-static") && this._hydrateFromStatic(), this.nodes = ht(this.nodes), this._rebuildNodeMap(), this._rebuildEdgeMap();
        for (const s of this.nodes)
          s.dimensions && this._initialDimensions.set(s.id, { ...s.dimensions });
      },
      /** Create FlowHistory if configured. */
      _initHistory() {
        e.history && (this._history = new $u(e.historyMaxSize ?? 50));
      },
      /** Create screen reader announcer. */
      _initAnnouncer() {
        if (e.announcements !== !1 && this._container) {
          const s = typeof e.announcements == "object" ? e.announcements.formatMessage : void 0;
          this._announcer = new $f(this._container, s);
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
          const l = this._container, { Doc: a, Awareness: c, CollabBridge: d, CollabAwareness: f } = s, u = e.collab, h = new a(), p = new c(h), g = new d(h, this, u.provider), y = new f(p, u.user);
          if (Re.set(l, { bridge: g, awareness: y, doc: h }), u.provider.connect(h, p), u.cursors !== !1) {
            let m = !1;
            const b = u.throttle ?? 20, S = (L) => {
              if (m) return;
              m = !0;
              const P = l.getBoundingClientRect(), $ = this._viewportLive ?? this.viewport, x = (L.clientX - P.left - $.x) / $.zoom, E = (L.clientY - P.top - $.y) / $.zoom;
              y.updateCursor({ x, y: E }), setTimeout(() => {
                m = !1;
              }, b);
            }, _ = () => {
              y.updateCursor(null);
            };
            l.addEventListener("mousemove", S), l.addEventListener("mouseleave", _);
            const M = Re.get(l);
            M.cursorCleanup = () => {
              l.removeEventListener("mousemove", S), l.removeEventListener("mouseleave", _);
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
        }), this._panZoom = Su(this._container, {
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
        if (s && (this._longPressCleanup = bf(
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
          const d = (g) => {
            g.pointerType === "touch" && (c++, c === 2 && Date.now() - a < 300 && (this._touchSelectionMode = !this._touchSelectionMode, this._container?.classList.toggle("flow-touch-selection-mode", this._touchSelectionMode)), a = Date.now());
          }, f = (g) => {
            g.pointerType === "touch" && (c = Math.max(0, c - 1), c === 0 && (a = 0));
          }, u = this._container;
          if (!u) return;
          u.addEventListener("pointerdown", d), u.addEventListener("pointerup", f), u.addEventListener("pointercancel", f);
          const h = () => {
            document.hidden && (c = 0);
          };
          document.addEventListener("visibilitychange", h);
          const p = document.createElement("div");
          p.className = "flow-touch-selection-mode-indicator", p.textContent = "Selection Mode — tap with two fingers to exit", u.appendChild(p), this._touchSelectionCleanup = () => {
            u.removeEventListener("pointerdown", d), u.removeEventListener("pointerup", f), u.removeEventListener("pointercancel", f), document.removeEventListener("visibilitychange", h), p.remove();
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
            const c = ut(s, a.moveStepModifier) ? a.moveStep * a.moveStepMultiplier : a.moveStep;
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
                const u = Array.isArray(a.moveNodes) ? a.moveNodes : [a.moveNodes], h = s.key.length === 1 ? s.key.toLowerCase() : s.key, p = u.findIndex((g) => (g.length === 1 ? g.toLowerCase() : g) === h);
                p === 0 ? f = -c : p === 1 ? f = c : p === 2 ? d = -c : p === 3 && (d = c);
              }
            }
            _f(s.repeat, this.selectedNodes.size, d, f) && this._captureHistory();
            for (const u of this.selectedNodes) {
              const h = this.getNode(u);
              if (h && Tr(h)) {
                h.position.x += d, h.position.y += f;
                const p = this._container ? Re.get(this._container) : void 0;
                p?.bridge && p.bridge.pushLocalNodeUpdate(h.id, { position: h.position });
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
        e.minimap && (this._minimap = Xu(this._container, {
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
          this._controls = Gu(s, {
            position: e.controlsPosition ?? "bottom-left",
            orientation: e.controlsOrientation ?? "vertical",
            external: l,
            showZoom: e.controlsShowZoom ?? !0,
            showFitView: e.controlsShowFitView ?? !0,
            showInteractive: e.controlsShowInteractive ?? !0,
            showResetPanels: e.controlsShowResetPanels ?? !1,
            onZoomIn: () => this.zoomIn(),
            onZoomOut: () => this.zoomOut(),
            onFitView: () => this.fitView({ padding: qo }),
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
        this._selectionBox = Ju(this._container), this._lasso = Qu(this._container), this._selectionTool = e.selectionTool ?? "box", this._onSelectionPointerDown = (s) => {
          if (!this._config.selectionOnDrag && !this._touchSelectionMode && !ut(s, this._shortcuts.selectionBox))
            return;
          const l = s.target;
          if (l !== this._container && !l.classList.contains("flow-viewport"))
            return;
          s.stopPropagation(), s.preventDefault(), this._selectionShiftHeld = !0;
          const a = this._config.selectionMode ?? "partial", c = ut(s, this._shortcuts.selectionModeToggle);
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
          const a = to(this.nodes, this._nodeMap, this._config.nodeOrigin);
          let c, d = [];
          if (this._selectionTool === "lasso") {
            const f = this._lasso.end(this.viewport);
            if (!f) return;
            const u = this._selectionEffectiveMode === "full" ? of(a, f) : nf(a, f), h = new Set(u.map((p) => p.id));
            if (c = this.nodes.filter((p) => h.has(p.id)), this._config.lassoSelectsEdges)
              for (const p of this.edges) {
                if (p.hidden) continue;
                const g = this._container?.querySelector(
                  `[data-flow-edge-id="${CSS.escape(p.id)}"] path`
                );
                if (!g) continue;
                const y = g.getTotalLength(), m = Math.max(10, Math.ceil(y / 20));
                let b = 0;
                for (let _ = 0; _ <= m; _++) {
                  const M = g.getPointAtLength(_ / m * y);
                  pi(M.x, M.y, f) && b++;
                }
                (this._selectionEffectiveMode === "full" ? b === m + 1 : b > 0) && d.push(p.id);
              }
          } else {
            const f = this._selectionBox.end(this.viewport);
            if (!f) return;
            const u = this._selectionEffectiveMode === "full" ? Pu(a, f, this._config.nodeOrigin) : Lu(a, f, this._config.nodeOrigin), h = new Set(u.map((p) => p.id));
            c = this.nodes.filter((p) => h.has(p.id));
          }
          this._selectionShiftHeld || this.deselectAll();
          for (const f of c) {
            if (!Wo(f) || f.hidden) continue;
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
            let f;
            try {
              f = JSON.parse(d);
            } catch {
              f = d;
            }
            if (!this._container)
              return;
            const u = yr(
              a.clientX,
              a.clientY,
              this.viewport,
              this._container.getBoundingClientRect()
            ), h = l(a.clientX, a.clientY), p = e.onDrop({ data: f, position: u, targetNode: h, mimeType: c });
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
            const p = Math.round(u), g = Math.round(h), y = d.dimensions;
            if (y && Math.abs((y.width ?? 0) - p) < 1 && Math.abs((y.height ?? 0) - g) < 1)
              continue;
            const m = Uf(
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
        if (this._layoutDedup = Wf((s) => {
          this.layoutChildren(s);
        }), this._resizeObserverInit(), this.$wire) {
          const s = this.$wire;
          e.wireEvents && qf(e, s, e.wireEvents);
          const l = Xf(this, s), a = Hf(this, s);
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
        for (const [, s] of zr().entries())
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
            const u = It(f), h = Dt(u, this._id);
            l.has(h) || l.set(h, Kn(u, h));
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
        return this._layoutDedup ? jf(this._layoutDedup)(s) : s();
      },
      get collab() {
        return this._container ? Re.get(this._container)?.awareness : void 0;
      },
      async toImage(s) {
        let l;
        try {
          ({ captureFlowImage: l } = await Promise.resolve().then(() => Jg));
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
      Jf(i),
      Qf(i),
      eh(i),
      ih(i),
      sh(i),
      Ih(i),
      Fh(i),
      Hh(i),
      Oh(i),
      Uh(i),
      Zh(i),
      Kh(i),
      bp(i, t),
      xp(i)
    ];
    for (const s of r)
      Object.defineProperties(n, Object.getOwnPropertyDescriptors(s));
    return n.registerMarker = (s, l) => {
      Bu(s, l);
    }, n;
  });
}
function ks(t, e) {
  return {
    x: e[0] * Math.round(t.x / e[0]),
    y: e[1] * Math.round(t.y / e[1])
  };
}
function kp(t, e, n) {
  const { onDragStart: o, onDrag: i, onDragEnd: r, getViewport: s, getNodePosition: l, snapToGrid: a = !1, filterSelector: c, container: d, isLocked: f, noDragClassName: u, dragThreshold: h = 0 } = n;
  let p = { x: 0, y: 0 };
  function g(b) {
    const S = s();
    return {
      x: (b.x - S.x) / S.zoom,
      y: (b.y - S.y) / S.zoom
    };
  }
  const y = Ve(t), m = ic().subject(() => {
    const b = s(), S = l();
    return {
      x: S.x * b.zoom + b.x,
      y: S.y * b.zoom + b.y
    };
  }).on("start", (b) => {
    p = g(b), o?.({ nodeId: e, position: p, sourceEvent: b.sourceEvent });
  }).on("drag", (b) => {
    let S = g(b);
    a && (S = ks(S, a));
    const _ = {
      x: S.x - p.x,
      y: S.y - p.y
    };
    i?.({ nodeId: e, position: S, delta: _, sourceEvent: b.sourceEvent });
  }).on("end", (b) => {
    let S = g(b);
    a && (S = ks(S, a)), r?.({ nodeId: e, position: S, sourceEvent: b.sourceEvent });
  });
  return d && m.container(() => d), h > 0 && m.clickDistance(h), m.filter((b) => {
    if (f?.() || u && b.target?.closest?.("." + u)) return !1;
    if (c) {
      const S = t.querySelector(c);
      return S ? S.contains(b.target) : !0;
    }
    return !0;
  }), y.call(m), {
    destroy() {
      y.on(".drag", null);
    }
  };
}
function Lp(t, e) {
  const n = Wt(t, e);
  return {
    id: t.id,
    x: n.x,
    y: n.y,
    width: t.dimensions?.width ?? ve,
    height: t.dimensions?.height ?? _e
  };
}
function Pp(t, e, n) {
  const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  let r = 0, s = 0, l = 1 / 0, a = 1 / 0;
  const c = t.x + t.width / 2, d = t.y + t.height / 2, f = t.x + t.width, u = t.y + t.height;
  for (const h of e) {
    const p = h.x + h.width / 2, g = h.y + h.height / 2, y = h.x + h.width, m = h.y + h.height, b = [
      [t.x, h.x],
      // left-left
      [f, y],
      // right-right
      [c, p],
      // center-center
      [t.x, y],
      // left-right
      [f, h.x]
      // right-left
    ];
    for (const [_, M] of b) {
      const L = M - _;
      Math.abs(L) <= n && (i.add(M), Math.abs(L) < Math.abs(l) && (l = L, r = L));
    }
    const S = [
      [t.y, h.y],
      // top-top
      [u, m],
      // bottom-bottom
      [d, g],
      // center-center
      [t.y, m],
      // top-bottom
      [u, h.y]
      // bottom-top
    ];
    for (const [_, M] of S) {
      const L = M - _;
      Math.abs(L) <= n && (o.add(M), Math.abs(L) < Math.abs(a) && (a = L, s = L));
    }
  }
  return {
    horizontal: [...o],
    vertical: [...i],
    snapOffset: { x: r, y: s }
  };
}
function Mp(t, e, n, o) {
  return Math.abs(t.x - e.x) > 30 ? t.x < e.x ? { source: n, target: o } : { source: o, target: n } : t.y < e.y ? { source: n, target: o } : { source: o, target: n };
}
function Tp(t, e, n, o) {
  let i = null, r = o;
  for (const s of n) {
    if (s.id === t) continue;
    const l = Math.sqrt(
      (e.x - s.center.x) ** 2 + (e.y - s.center.y) ** 2
    );
    if (l < r) {
      r = l;
      const { source: a, target: c } = Mp(e, s.center, t, s.id);
      i = { source: a, target: c, targetId: s.id, distance: l, targetCenter: s.center };
    }
  }
  return i;
}
const Ap = /* @__PURE__ */ new Set(["x-data", "x-init", "x-bind", "href", "src", "action", "formaction", "srcdoc"]);
let Np = 0;
function Ls(t, e, n) {
  e && n !== null && t._commitHistory?.(n);
}
function Lo(t, e, n) {
  t._suspendHistory?.();
  try {
    t.reparentNode?.(e, n);
  } finally {
    t._resumeHistory?.();
  }
}
function $p(t, e) {
  switch (e) {
    case "alt":
      return t.altKey;
    case "meta":
      return t.metaKey;
    case "shift":
      return t.shiftKey;
  }
}
function Ip(t, e, n) {
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
function Dp(t, e, n) {
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
function Rp(t) {
  t.directive(
    "flow-node",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = null, l = !1, a = null, c = !1, d = null, f = null, u = null, h = null, p = null, g = null, y = !1, m = -1, b = null, S = !1, _ = [], M = "", L = [], P = null;
      i(() => {
        if (!e.isConnected) return;
        const T = o(n);
        if (!T) return;
        if (e.dataset.flowNodeId = T.id, T.type && (e.dataset.flowNodeType = T.type), !S) {
          const F = e.closest("[x-data]"), K = F ? t.$data(F) : null;
          let U = !1;
          if (K?._config?.nodeTypes) {
            const V = T.type ?? "default", I = K._config.nodeTypes[V] ?? K._config.nodeTypes.default;
            if (typeof I == "string") {
              const re = document.querySelector(I);
              re?.content && (e.appendChild(re.content.cloneNode(!0)), U = !0);
            } else typeof I == "function" && (I(T, e), U = !0);
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
              t.addScopeToNode(V, { node: T }), t.initTree(V);
          S = !0;
        }
        if (T.hidden) {
          e.classList.add("flow-node-hidden"), e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-hidden"), P !== T.id && (s?.destroy(), s = null, P = T.id);
        const w = t.$data(e.closest("[x-data]"));
        if (!w?.viewport) return;
        e.classList.add("flow-node", "nopan"), T.type === "group" ? e.classList.add("flow-node-group") : e.classList.remove("flow-node-group");
        const v = T.parentId ? w.getAbsolutePosition(T.id) : T.position ?? { x: 0, y: 0 }, D = T.nodeOrigin ?? w._config?.nodeOrigin ?? [0, 0], k = T.dimensions?.width ?? 150, O = T.dimensions?.height ?? 40;
        if (e.style.left = v.x - k * D[0] + "px", e.style.top = v.y - O * D[1] + "px", T.dimensions) {
          const F = T.childLayout, K = T.fixedDimensions, U = w.nodes.some(
            (V) => V.parentId === T.id
          );
          e.style.width = T.dimensions.width + "px", F || K || U ? e.style.height = T.dimensions.height + "px" : e.style.height = "";
        }
        w.selectedNodes.has(T.id) ? e.classList.add("flow-node-selected") : e.classList.remove("flow-node-selected"), e.setAttribute("aria-selected", String(!!T.selected)), T._validationErrors && T._validationErrors.length > 0 ? e.classList.add("flow-node-invalid") : e.classList.remove("flow-node-invalid");
        const W = ["flow-node-running", "flow-node-completed", "flow-node-failed", "flow-node-skipped"], C = T.runState;
        for (const F of W)
          e.classList.remove(F);
        C && C !== "pending" && e.classList.add(`flow-node-${C}`);
        for (const F of _)
          e.classList.remove(F);
        const A = T.class ? T.class.split(/\s+/).filter(Boolean) : [];
        for (const F of A)
          e.classList.add(F);
        _ = A;
        const R = T.shape ? `flow-node-${T.shape}` : "";
        M !== R && (M && e.classList.remove(M), R && e.classList.add(R), M = R);
        const X = t.$data(e.closest("[data-flow-canvas]")), se = T.shape && X?._shapeRegistry?.[T.shape];
        if (se?.clipPath ? e.style.clipPath = se.clipPath : e.style.clipPath = "", T.style) {
          const F = typeof T.style == "string" ? Object.fromEntries(T.style.split(";").filter(Boolean).map((U) => U.split(":").map((V) => V.trim()))) : T.style, K = [];
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
        if (T.rotation ? (e.style.transform = `rotate(${T.rotation}deg)`, e.style.transformOrigin = "center") : e.style.transform = "", T.focusable ?? w._config?.nodesFocusable !== !1 ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", T.ariaRole ?? "group"), e.setAttribute("aria-label", T.ariaLabel ?? (T.data?.label ? `Node: ${T.data.label}` : `Node ${T.id}`))) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label")), T.domAttributes)
          for (const [F, K] of Object.entries(T.domAttributes))
            F.startsWith("on") || Ap.has(F.toLowerCase()) || e.setAttribute(F, K);
        ze(T) ? e.classList.remove("flow-node-no-connect") : e.classList.add("flow-node-no-connect"), T.collapsed ? e.classList.add("flow-node-collapsed") : e.classList.remove("flow-node-collapsed");
        const ie = e.classList.contains("flow-node-condensed");
        T.condensed ? e.classList.add("flow-node-condensed") : e.classList.remove("flow-node-condensed"), !!T.condensed !== ie && requestAnimationFrame(() => {
          T.dimensions = {
            width: e.offsetWidth,
            height: e.offsetHeight
          }, q("condense", `Node "${T.id}" re-measured after condense toggle`, T.dimensions);
        }), T.filtered ? e.classList.add("flow-node-filtered") : e.classList.remove("flow-node-filtered");
        const ae = T.handles ?? "visible";
        e.classList.remove("flow-handles-hidden", "flow-handles-hover", "flow-handles-select"), ae !== "visible" && e.classList.add(`flow-handles-${ae}`);
        let ce = Rr(T, w._nodeMap);
        w._config?.elevateNodesOnSelect !== !1 && w.selectedNodes.has(T.id) && (ce += T.type === "group" ? Math.max(1 - ce, 0) : 1e3), y && (ce += 1e3);
        const J = T.type === "group" ? 0 : 2;
        if (ce !== J ? e.style.zIndex = String(ce) : e.style.removeProperty("z-index"), !Tr(T)) {
          e.classList.add("flow-node-locked"), s?.destroy(), s = null;
          return;
        }
        e.classList.remove("flow-node-locked"), e.querySelector("[data-flow-drag-handle]") ? e.classList.add("flow-node-has-handle") : e.classList.remove("flow-node-has-handle");
        const ee = e.closest(".flow-container");
        s || (s = kp(e, T.id, {
          container: ee ?? void 0,
          filterSelector: "[data-flow-drag-handle]",
          isLocked: () => w._animationLocked,
          noDragClassName: w._config?.noDragClassName ?? "nodrag",
          dragThreshold: w._config?.nodeDragThreshold ?? 0,
          getViewport: () => w.viewport,
          getNodePosition: () => {
            const F = w.getNode(T.id);
            return F ? F.parentId ? w.getAbsolutePosition(F.id) : { x: F.position.x, y: F.position.y } : { x: 0, y: 0 };
          },
          snapToGrid: w._config?.snapToGrid ?? !1,
          onDragStart({ nodeId: F, position: K, sourceEvent: U }) {
            e.classList.add("flow-node-dragging"), l = !1, c = !1, d = null;
            const V = w._container ? Re.get(w._container) : void 0;
            V?.bridge && V.bridge.setDragging(F, !0), h?.destroy(), h = null, p = null, g && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null, a = w._snapshotHistory?.() ?? null, q("drag", `Node "${F}" drag start`, K);
            const I = w.getNode(F);
            if (I && (w._config?.selectNodesOnDrag !== !1 && I.selectable !== !1 && !w.selectedNodes.has(F) && (ut(U, w._shortcuts?.multiSelect) || w.deselectAll(), w.selectedNodes.add(F), I.selected = !0, w._emitSelectionChange(), c = !0), w._emit("node-drag-start", { node: I }), w.selectedNodes.has(F) && w.selectedNodes.size > 1)) {
              const re = ft(F, w.nodes);
              d = /* @__PURE__ */ new Map();
              for (const G of w.selectedNodes) {
                if (G === F || re.has(G))
                  continue;
                const Y = w.getNode(G);
                Y && Y.draggable !== !1 && d.set(G, { x: Y.position.x, y: Y.position.y });
              }
            }
            w._config?.autoPanOnNodeDrag !== !1 && ee && (f = Nr({
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
                  const Z = H.position.x, ue = H.position.y;
                  H.position.x += oe / te, H.position.y += B / te;
                  const he = Tn(H.position, H, w._config?.nodeExtent);
                  H.position.x = he.x, H.position.y = he.y, Q = H.position.x === Z && H.position.y === ue;
                }
                if (d)
                  for (const [Z] of d) {
                    const ue = w.getNode(Z);
                    if (ue) {
                      ue.position.x += oe / te, ue.position.y += B / te;
                      const he = Tn(ue.position, ue, w._config?.nodeExtent);
                      ue.position.x = he.x, ue.position.y = he.y;
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
                  y || (e.classList.add("flow-reorder-dragging"), b = I.parentId), y = !0;
                  const j = I.extent !== "parent";
                  if (I.position.x = K.x - Y.x, I.position.y = K.y - Y.y, !j && B.dimensions) {
                    const Z = _o({ x: I.position.x, y: I.position.y }, oe, B.dimensions);
                    I.position.x = Z.x, I.position.y = Z.y;
                  }
                  const H = I.dimensions?.width ?? 150, Q = I.dimensions?.height ?? 50;
                  if (j) {
                    const Z = B.dimensions?.width ?? 150, ue = B.dimensions?.height ?? 50, he = I.position.x + H / 2, pe = I.position.y + Q / 2, me = 12, Se = b === I.parentId ? 0 : me, Te = he >= Se && he <= Z - Se && pe >= Se && pe <= ue - Se, we = /* @__PURE__ */ new Set();
                    let fe = I.parentId;
                    for (; fe; )
                      we.add(fe), fe = w.getNode(fe)?.parentId;
                    const ke = K.x + H / 2, Ce = K.y + Q / 2, Me = ft(I.id, w.nodes);
                    let Ie = null;
                    const xe = w.nodes.filter(
                      (ge) => ge.id !== I.id && (ge.droppable || ge.childLayout) && !ge.hidden && !Me.has(ge.id) && (Te ? !we.has(ge.id) : ge.id !== I.parentId) && (!ge.acceptsDrop || ge.acceptsDrop(I))
                    );
                    for (const ge of xe) {
                      const Ee = ge.parentId ? w.getAbsolutePosition(ge.id) : ge.position, nt = ge.dimensions?.width ?? 150, mt = ge.dimensions?.height ?? 50, ot = ge.id === g ? 0 : me;
                      ke >= Ee.x + ot && ke <= Ee.x + nt - ot && Ce >= Ee.y + ot && Ce <= Ee.y + mt - ot && (Ie = ge);
                    }
                    const be = Ie?.id ?? null;
                    if (be !== g) {
                      g && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), be && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(be)}"]`)?.classList.add("flow-node-drop-target"), g = be;
                      const ge = be ? w.getNode(be) : null, Ee = b;
                      if (ge?.childLayout && be !== b) {
                        Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), b = be;
                        const nt = w.nodes.filter((je) => je.parentId === be && je.id !== F).sort((je, ga) => (je.order ?? 1 / 0) - (ga.order ?? 1 / 0)), mt = nt.length, ot = [...nt];
                        ot.splice(mt, 0, I);
                        for (let je = 0; je < ot.length; je++)
                          ot[je].order = je;
                        m = mt;
                        const Si = w._initialDimensions?.get(F), ki = { ...I, dimensions: Si ? { ...Si } : void 0 };
                        w.layoutChildren(be, { excludeId: F, includeNode: ki, shallow: !0 }), w.propagateLayoutUp(be, { includeNode: ki });
                      } else Te && b !== I.parentId ? (Ee && Ee !== I.parentId && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), b = I.parentId, m = -1) : !be && !Te && (Ee && (w.layoutChildren(Ee, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(Ee, { omitFromComputation: F })), b = null, m = -1);
                    }
                  }
                  if (b) {
                    const Z = w.getNode(b), ue = Z?.childLayout ?? B.childLayout, he = w.nodes.filter((fe) => fe.parentId === b && fe.id !== F).sort((fe, ke) => (fe.order ?? 1 / 0) - (ke.order ?? 1 / 0));
                    let pe, me;
                    if (b !== I.parentId) {
                      const fe = Z?.parentId ? w.getAbsolutePosition(b) : Z?.position ?? { x: 0, y: 0 };
                      pe = K.x - fe.x, me = K.y - fe.y;
                    } else
                      pe = I.position.x, me = I.position.y;
                    const Se = ue.swapThreshold ?? 0.5;
                    if (m === -1)
                      if (b === I.parentId) {
                        const fe = I.order ?? 0;
                        m = he.filter((ke) => (ke.order ?? 0) < fe).length;
                      } else
                        m = he.length;
                    const Te = m;
                    let we = he.length;
                    for (let fe = 0; fe < he.length; fe++) {
                      const ke = he[fe], Ce = ke.dimensions?.width ?? 150, Me = ke.dimensions?.height ?? 50, Ie = fe < Te ? 1 - Se : Se, xe = ke.position.y + Me * Ie, be = ke.position.x + Ce * Ie;
                      if (ue.direction === "grid") {
                        const ge = {
                          x: pe + H / 2,
                          y: me + Q / 2
                        }, Ee = ke.position.y + Me / 2;
                        if (ge.y < ke.position.y) {
                          we = fe;
                          break;
                        }
                        if (Math.abs(ge.y - Ee) < Me / 2 && ge.x < be) {
                          we = fe;
                          break;
                        }
                      } else if (ue.direction === "vertical") {
                        if ((fe < Te ? me : me + Q) < xe) {
                          we = fe;
                          break;
                        }
                      } else if ((fe < Te ? pe : pe + H) < be) {
                        we = fe;
                        break;
                      }
                    }
                    if (we !== m) {
                      m = we;
                      const fe = [...he];
                      fe.splice(we, 0, I);
                      for (let xe = 0; xe < fe.length; xe++)
                        fe[xe].order = xe;
                      e.closest(".flow-container")?.classList.add("flow-layout-animating"), w._layoutAnimFrame && cancelAnimationFrame(w._layoutAnimFrame);
                      const Ce = I.id, Me = b, Ie = Me !== I.parentId;
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
                  f && V instanceof MouseEvent && f.updatePointer(V.clientX, V.clientY);
                  return;
                }
                if (I.extent === "parent" && B?.dimensions) {
                  const j = _o(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = j.x, z = j.y;
                } else if (Array.isArray(I.extent)) {
                  const j = Fr({ x: te, y: z }, I.extent, oe);
                  te = j.x, z = j.y;
                }
                if ((!I.extent || I.extent !== "parent") && (ln(
                  B,
                  w._config?.childValidationRules ?? {}
                )?.preventChildEscape || !!B?.childLayout) && B?.dimensions) {
                  const Q = _o(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  te = Q.x, z = Q.y;
                }
                if (I.expandParent && B?.dimensions) {
                  const j = xf(
                    { x: te, y: z },
                    oe,
                    B.dimensions
                  );
                  j && (B.dimensions.width = j.width, B.dimensions.height = j.height);
                }
                I.position.x = te, I.position.y = z;
              } else {
                const Y = Tn(K, I, w._config?.nodeExtent);
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
                    const j = Tn({ x: oe, y: B }, z, w._config?.nodeExtent);
                    z.position.x = j.x, z.position.y = j.y;
                  }
                }
              const G = w._config?.helperLines;
              if (G) {
                const Y = typeof G == "object" ? G.snap ?? !0 : !0, te = typeof G == "object" ? G.threshold ?? 5 : 5, z = (Z) => {
                  const ue = Z.parentId ? w.getAbsolutePosition(Z.id) : Z.position;
                  return Lp({ ...Z, position: ue }, w._config?.nodeOrigin);
                }, B = (w.selectedNodes.size > 1 && w.selectedNodes.has(F) ? w.nodes.filter((Z) => w.selectedNodes.has(Z.id)) : [I]).map(z), j = {
                  x: Math.min(...B.map((Z) => Z.x)),
                  y: Math.min(...B.map((Z) => Z.y)),
                  width: Math.max(...B.map((Z) => Z.x + Z.width)) - Math.min(...B.map((Z) => Z.x)),
                  height: Math.max(...B.map((Z) => Z.y + Z.height)) - Math.min(...B.map((Z) => Z.y))
                }, H = w.nodes.filter(
                  (Z) => !w.selectedNodes.has(Z.id) && Z.id !== F && Z.hidden !== !0 && Z.filtered !== !0
                ).map(z), Q = Pp(j, H, te);
                if (Y && (Q.snapOffset.x !== 0 || Q.snapOffset.y !== 0) && (I.position.x += Q.snapOffset.x, I.position.y += Q.snapOffset.y, d))
                  for (const [Z] of d) {
                    const ue = w.getNode(Z);
                    ue && (ue.position.x += Q.snapOffset.x, ue.position.y += Q.snapOffset.y);
                  }
                if (u?.remove(), Q.horizontal.length > 0 || Q.vertical.length > 0) {
                  const Z = ee?.querySelector(".flow-viewport");
                  if (Z) {
                    const ue = w.nodes.map(z);
                    u = Dp(Q.horizontal, Q.vertical, ue), Z.appendChild(u);
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
              const G = typeof w._config.preventOverlap == "number" ? w._config.preventOverlap : 5, Y = I.dimensions?.width ?? ve, te = I.dimensions?.height ?? _e, z = w.selectedNodes, oe = w.nodes.filter((j) => j.id !== I.id && !j.hidden && !z.has(j.id)).map((j) => Xt(j, w._config?.nodeOrigin)), B = Gf(I.position, Y, te, oe, G);
              I.position.x = B.x, I.position.y = B.y;
            }
            if (!I.parentId) {
              const G = ft(I.id, w.nodes), Y = w.nodes.filter(
                (j) => j.id !== I.id && j.droppable && !j.hidden && !G.has(j.id) && (!j.acceptsDrop || j.acceptsDrop(I))
              ), te = Xt(I, w._config?.nodeOrigin);
              let z = null;
              const oe = 12;
              for (const j of Y) {
                const H = j.parentId ? w.getAbsolutePosition(j.id) : j.position, Q = j.dimensions?.width ?? ve, Z = j.dimensions?.height ?? _e, ue = te.x + te.width / 2, he = te.y + te.height / 2, pe = j.id === g ? 0 : oe;
                ue >= H.x + pe && ue <= H.x + Q - pe && he >= H.y + pe && he <= H.y + Z - pe && (z = j);
              }
              const B = z?.id ?? null;
              B !== g && (g && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), B && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(B)}"]`)?.classList.add("flow-node-drop-target"), g = B);
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
              })), oe = Tp(I.id, te, z, G);
              if (oe)
                if (w.edges.some(
                  (j) => j.source === oe.source && j.target === oe.target || j.source === oe.target && j.target === oe.source
                ))
                  h?.destroy(), h = null, p = null;
                else {
                  if (p = oe, !h) {
                    h = Ft({
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
                h?.destroy(), h = null, p = null;
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
              const I = b;
              y = !1, m = -1, b = null, w._layoutAnimFrame && (cancelAnimationFrame(w._layoutAnimFrame), w._layoutAnimFrame = 0), e.closest(".flow-container")?.classList.remove("flow-layout-animating"), g ? (ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Lo(w, F, g), g = null) : I && I !== V.parentId ? (w.layoutChildren(I, { omitFromComputation: F, shallow: !0 }), w.propagateLayoutUp(I, { omitFromComputation: F }), w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })) : (w.layoutChildren(V.parentId), w._emit("child-reorder", {
                nodeId: F,
                parentId: V.parentId,
                order: V.order
              })), d = null, Ls(w, l, a), a = null, l = !1;
              return;
            }
            if (V && g)
              ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), Lo(w, F, g), g = null;
            else if (V && V.parentId && !g) {
              const I = ln(
                w.getNode(V.parentId),
                w._config?.childValidationRules ?? {}
              ), re = w.getNode(V.parentId);
              if (!I?.preventChildEscape && !re?.childLayout && re?.dimensions) {
                const G = V.position.x, Y = V.position.y, te = V.dimensions?.width ?? 150, z = V.dimensions?.height ?? 50;
                (G + te < 0 || Y + z < 0 || G > re.dimensions.width || Y > re.dimensions.height) && Lo(w, F, null);
              }
              g = null;
            } else
              g && ee && ee.querySelector(`[data-flow-node-id="${CSS.escape(g)}"]`)?.classList.remove("flow-node-drop-target"), g = null;
            if (w._config?.proximityConnect && p) {
              const I = p;
              h?.destroy(), h = null, p = null;
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
                if (lt(G, w.edges, { preventCycles: w._config?.preventCycles }) && at(G, w._config?.connectionRules, w._nodeMap) && (ee ? Ge(ee, G, w.edges) : !0) && (ee ? Ke(ee, G) : !0) && (!w._config.isValidConnection || w._config.isValidConnection(G))) {
                  if (w._config.proximityConnectConfirm) {
                    const j = ee?.querySelector(`[data-flow-node-id="${CSS.escape(I.source)}"]`), H = ee?.querySelector(`[data-flow-node-id="${CSS.escape(I.target)}"]`);
                    j?.classList.add("flow-proximity-confirm"), H?.classList.add("flow-proximity-confirm"), setTimeout(() => {
                      j?.classList.remove("flow-proximity-confirm"), H?.classList.remove("flow-proximity-confirm");
                    }, 400);
                  }
                  const B = `e-${I.source}-${I.target}-${Date.now()}-${Np++}`;
                  w.addEdges({ id: B, ...G }), w._emit("connect", { connection: G });
                }
              }
            } else
              h?.destroy(), h = null, p = null;
            d = null, Ls(w, l, a), a = null, l = !1;
          }
        }));
      });
      {
        const T = t.$data(e.closest("[x-data]"));
        if (T?._config?.easyConnect) {
          const w = T._config.easyConnectKey ?? "alt", v = (D) => {
            if (!$p(D, w) || D.target.closest("[data-flow-handle-type]")) return;
            const k = t.$data(e.closest("[x-data]"));
            if (!k || k._animationLocked || k._connectValidating) return;
            const O = o(n);
            if (!O) return;
            const W = k.getNode(O.id);
            if (!W || W.connectable === !1) return;
            D.preventDefault(), D.stopPropagation(), D.stopImmediatePropagation();
            const C = Ip(e, D.clientX, D.clientY), A = C?.dataset.flowHandleId ?? "source";
            e.classList.add("flow-easy-connecting");
            const R = e.closest(".flow-container");
            if (!R) return;
            const X = k._viewportLive ?? k.viewport, se = X?.zoom || 1, ne = X?.x || 0, ie = X?.y || 0, ae = R.getBoundingClientRect();
            let ce, de;
            if (C) {
              const I = C.getBoundingClientRect();
              ce = (I.left + I.width / 2 - ae.left - ne) / se, de = (I.top + I.height / 2 - ae.top - ie) / se;
            } else {
              const I = e.getBoundingClientRect();
              ce = (I.left + I.width / 2 - ae.left - ne) / se, de = (I.top + I.height / 2 - ae.top - ie) / se;
            }
            k._emit("connect-start", { source: O.id, sourceHandle: A });
            const J = Ft({
              connectionLineType: k._config?.connectionLineType,
              connectionLineStyle: k._config?.connectionLineStyle,
              connectionLine: k._config?.connectionLine
            }), le = R.querySelector(".flow-viewport");
            le && le.appendChild(J.svg), J.update({ fromX: ce, fromY: de, toX: ce, toY: de, source: O.id, sourceHandle: A }), k.pendingConnection = { source: O.id, sourceHandle: A, position: { x: ce, y: de } }, an(R, O.id, A, k);
            let ee = Jn(R, k, D.clientX, D.clientY), F = null;
            const K = k._config?.connectionSnapRadius ?? 20, U = (I) => {
              const re = k.screenToFlowPosition(I.clientX, I.clientY), G = rn({
                containerEl: R,
                handleType: "target",
                excludeNodeId: O.id,
                cursorFlowPos: re,
                connectionSnapRadius: K,
                getNode: (Y) => k.getNode(Y),
                toFlowPosition: (Y, te) => k.screenToFlowPosition(Y, te)
              });
              G.element !== F && (F?.classList.remove("flow-handle-active"), G.element?.classList.add("flow-handle-active"), F = G.element), J.update({ fromX: ce, fromY: de, toX: G.position.x, toY: G.position.y, source: O.id, sourceHandle: A }), k.pendingConnection = { ...k.pendingConnection, position: G.position }, ee?.updatePointer(I.clientX, I.clientY);
            }, V = async (I) => {
              ee?.stop(), ee = null, document.removeEventListener("pointermove", U), document.removeEventListener("pointerup", V), J.destroy(), F?.classList.remove("flow-handle-active"), Pe(R), e.classList.remove("flow-easy-connecting");
              const re = k.screenToFlowPosition(I.clientX, I.clientY), G = { source: O.id, sourceHandle: A, position: re };
              k.pendingConnection = null;
              let Y = F;
              if (Y || (Y = document.elementFromPoint(I.clientX, I.clientY)?.closest('[data-flow-handle-type="target"]')), !Y) {
                k._emit("connect-end", { connection: null, ...G });
                return;
              }
              const z = Y.closest("[x-flow-node]")?.dataset.flowNodeId, oe = Y.dataset.flowHandleId ?? "target";
              if (!z) {
                k._emit("connect-end", { connection: null, ...G });
                return;
              }
              const B = { source: O.id, sourceHandle: A, target: z, targetHandle: oe }, j = await Ir({ connection: B, canvas: k, containerEl: R });
              k._emit("connect-end", {
                connection: j.applied ? B : null,
                ...G
              });
            };
            document.addEventListener("pointermove", U), document.addEventListener("pointerup", V);
          };
          e.addEventListener("pointerdown", v, { capture: !0 }), r(() => {
            e.removeEventListener("pointerdown", v, { capture: !0 });
          });
        }
      }
      const $ = (T) => {
        if (T.key !== "Enter" && T.key !== " ") return;
        T.preventDefault();
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        v && (v._animationLocked || Wo(w) && (v._emit("node-click", { node: w, event: T }), T.stopPropagation(), ut(T, v._shortcuts?.multiSelect) ? v.selectedNodes.has(w.id) ? (v.selectedNodes.delete(w.id), w.selected = !1) : (v.selectedNodes.add(w.id), w.selected = !0) : (v.deselectAll(), v.selectedNodes.add(w.id), w.selected = !0), v._emitSelectionChange()));
      };
      e.addEventListener("keydown", $);
      const x = () => {
        const T = t.$data(e.closest("[x-data]"));
        if (!T?._config?.autoPanOnNodeFocus) return;
        const w = o(n);
        if (!w) return;
        const v = w.parentId ? T.getAbsolutePosition(w.id) : w.position;
        T.setCenter(
          v.x + (w.dimensions?.width ?? 150) / 2,
          v.y + (w.dimensions?.height ?? 40) / 2
        );
      };
      e.addEventListener("focus", x);
      const E = (T) => {
        if (l) return;
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        if (v && !v._animationLocked && (v._emit("node-click", { node: w, event: T }), !!Wo(w))) {
          if (T.stopPropagation(), c) {
            c = !1;
            return;
          }
          ut(T, v._shortcuts?.multiSelect) ? v.selectedNodes.has(w.id) ? (v.selectedNodes.delete(w.id), w.selected = !1, e.classList.remove("flow-node-selected"), q("selection", `Node "${w.id}" deselected (shift)`)) : (v.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), q("selection", `Node "${w.id}" selected (shift)`)) : (v.deselectAll(), v.selectedNodes.add(w.id), w.selected = !0, e.classList.add("flow-node-selected"), q("selection", `Node "${w.id}" selected`)), v._emitSelectionChange();
        }
      };
      e.addEventListener("click", E);
      const N = (T) => {
        T.preventDefault(), T.stopPropagation();
        const w = o(n);
        if (!w) return;
        const v = t.$data(e.closest("[x-data]"));
        if (v)
          if (v.selectedNodes.size > 1 && v.selectedNodes.has(w.id)) {
            const D = v.nodes.filter((k) => v.selectedNodes.has(k.id));
            v._emit("selection-context-menu", { nodes: D, event: T });
          } else
            v._emit("node-context-menu", { node: w, event: T });
      };
      e.addEventListener("contextmenu", N), requestAnimationFrame(() => {
        if (!e.isConnected) return;
        const T = o(n);
        if (!T) return;
        const w = t.$data(e.closest("[x-data]"));
        T.dimensions = {
          width: e.offsetWidth,
          height: e.offsetHeight
        }, q("init", `Node "${T.id}" measured`, T.dimensions), w?._nodeElements?.set(T.id, e), T.resizeObserver !== !1 && w?._resizeObserver && w._resizeObserver.observe(e);
      }), r(() => {
        s?.destroy(), u?.remove(), u = null, h?.destroy(), h = null, e.removeEventListener("keydown", $), e.removeEventListener("focus", x), e.removeEventListener("click", E), e.removeEventListener("contextmenu", N);
        const T = e.dataset.flowNodeId;
        if (T) {
          const w = t.$data(e.closest("[x-data]"));
          w?._nodeElements?.delete(T), w?._resizeObserver?.unobserve(e);
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
function Fp(t, e, n, o, i, r) {
  const { minWidth: s, minHeight: l, maxWidth: a, maxHeight: c } = i, d = t.includes("left"), f = t.includes("right"), u = t.includes("top"), h = t.includes("bottom");
  let p = o.width;
  f ? p = o.width + e.x : d && (p = o.width - e.x);
  let g = o.height;
  h ? g = o.height + e.y : u && (g = o.height - e.y), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)), r && (p = r[0] * Math.round(p / r[0]), g = r[1] * Math.round(g / r[1]), p = Math.max(s, Math.min(a, p)), g = Math.max(l, Math.min(c, g)));
  const y = p - o.width, m = g - o.height, b = d ? n.x - y : n.x, S = u ? n.y - m : n.y;
  return {
    position: { x: b, y: S },
    dimensions: { width: p, height: g }
  };
}
const oa = ["top-left", "top-right", "bottom-left", "bottom-right"], ia = ["top", "right", "bottom", "left"], Hp = [...oa, ...ia], Op = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize"
};
function zp(t) {
  t.directive(
    "flow-resizer",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = Vp(o);
      let a = { ...kt };
      if (n)
        try {
          const d = i(n);
          a = { ...kt, ...d };
        } catch {
        }
      const c = [];
      for (const d of l) {
        const f = document.createElement("div");
        f.className = `flow-resizer-handle flow-resizer-handle-${d}`, f.style.cursor = Op[d], f.dataset.flowResizeDirection = d, e.appendChild(f), c.push(f), f.addEventListener("pointerdown", (u) => {
          u.preventDefault(), u.stopPropagation();
          const h = e.closest("[x-flow-node]");
          if (!h) return;
          const p = e.closest("[x-data]");
          if (!p) return;
          const g = t.$data(p), y = h.dataset.flowNodeId;
          if (!y || !g) return;
          const m = g.getNode(y);
          if (!m || !is(m)) return;
          m.fixedDimensions = !0;
          const b = { ...a };
          if (m.minDimensions?.width != null && a.minWidth === kt.minWidth && (b.minWidth = m.minDimensions.width), m.minDimensions?.height != null && a.minHeight === kt.minHeight && (b.minHeight = m.minDimensions.height), m.maxDimensions?.width != null && a.maxWidth === kt.maxWidth && (b.maxWidth = m.maxDimensions.width), m.maxDimensions?.height != null && a.maxHeight === kt.maxHeight && (b.maxHeight = m.maxDimensions.height), !m.dimensions) {
            const E = g.viewport?.zoom || 1, N = h.getBoundingClientRect();
            m.dimensions = { width: N.width / E, height: N.height / E };
          }
          const S = { x: m.position.x, y: m.position.y }, _ = { width: m.dimensions.width, height: m.dimensions.height }, M = g.viewport?.zoom || 1, L = u.clientX, P = u.clientY;
          g._captureHistory?.(), q("resize", `Resize start on "${y}" (${d})`, _), g._emit("node-resize-start", { node: m, dimensions: { ..._ } });
          const $ = (E) => {
            const N = {
              x: (E.clientX - L) / M,
              y: (E.clientY - P) / M
            }, T = Fp(
              d,
              N,
              S,
              _,
              b,
              g._config?.snapToGrid ?? !1
            );
            if (m.position.x = T.position.x, m.position.y = T.position.y, m.dimensions.width = T.dimensions.width, m.dimensions.height = T.dimensions.height, m.parentId) {
              const w = g.getAbsolutePosition(m.id);
              h.style.left = `${w.x}px`, h.style.top = `${w.y}px`;
            } else
              h.style.left = `${T.position.x}px`, h.style.top = `${T.position.y}px`;
            h.style.width = `${T.dimensions.width}px`, h.style.height = `${T.dimensions.height}px`, g._emit("node-resize", { node: m, dimensions: { ...T.dimensions } });
          }, x = () => {
            document.removeEventListener("pointermove", $), document.removeEventListener("pointerup", x), document.removeEventListener("pointercancel", x), q("resize", `Resize end on "${y}"`, m.dimensions), g._emit("node-resize-end", { node: m, dimensions: { ...m.dimensions } });
          };
          document.addEventListener("pointermove", $), document.addEventListener("pointerup", x), document.addEventListener("pointercancel", x);
        });
      }
      r(() => {
        const d = e.closest("[x-flow-node]");
        if (!d) return;
        const f = e.closest("[x-data]");
        if (!f) return;
        const u = t.$data(f), h = d.dataset.flowNodeId;
        if (!h || !u) return;
        const p = u.getNode(h);
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
function Vp(t) {
  if (t.includes("corners"))
    return oa;
  if (t.includes("edges"))
    return ia;
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
  return Hp;
}
function Bp(t, e, n, o) {
  return (Math.atan2(t - n, -(e - o)) * 180 / Math.PI % 360 + 360) % 360;
}
function qp(t, e) {
  return (Math.round(t / e) * e % 360 + 360) % 360;
}
function Xp(t) {
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
        const h = t.$data(u), p = f.dataset.flowNodeId;
        if (!p || !h) return;
        const g = h.getNode(p);
        if (!g) return;
        const y = f.getBoundingClientRect(), m = y.left + y.width / 2, b = y.top + y.height / 2;
        h._captureHistory(), e.style.cursor = "grabbing";
        const S = (M) => {
          let L = Bp(
            M.clientX,
            M.clientY,
            m,
            b
          );
          l && (L = qp(L, a)), g.rotation = L;
        }, _ = () => {
          document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", _), e.style.cursor = "grab", h._emit("node-rotate-end", { node: g, rotation: g.rotation });
        };
        document.addEventListener("pointermove", S), document.addEventListener("pointerup", _);
      };
      e.addEventListener("pointerdown", c), s(() => {
        e.removeEventListener("pointerdown", c), e.classList.remove("flow-rotate-handle");
      });
    }
  );
}
function Yp(t) {
  t.directive(
    "flow-drag-handle",
    (e) => {
      e.setAttribute("data-flow-drag-handle", ""), e.classList.add("flow-drag-handle");
      const n = e.closest("[x-flow-node]");
      n && n.classList.add("flow-node-has-handle");
    }
  );
}
const Wp = "application/alpineflow";
function jp(t) {
  t.directive(
    "flow-draggable",
    (e, { expression: n }, { evaluate: o }) => {
      e.setAttribute("draggable", "true"), e.style.cursor = "grab", e.addEventListener("dragstart", (i) => {
        if (!i.dataTransfer) return;
        const r = o(n), s = typeof r == "string" ? r : JSON.stringify(r);
        i.dataTransfer.setData(Wp, s), i.dataTransfer.effectAllowed = "move";
      });
    }
  );
}
function Up(t) {
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
function Zp(t) {
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
        const f = (e.closest("[data-flow-canvas]") ?? e).querySelector(".flow-edges-static");
        f && f.remove();
        const u = !!i._config?.collapseBidirectionalEdges, h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
        if (u) {
          const g = Up(
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
          const m = i.getNode?.(g.source), b = i.getNode?.(g.target), S = g.hidden || g._hiddenByCollapse || m?.hidden || b?.hidden;
          y.style.display = S ? "none" : "";
        }
        for (const g of a) {
          const y = l.get(g.id);
          if (!y) continue;
          const m = i.getNode?.(g.source), b = i.getNode?.(g.target);
          m?.filtered || b?.filtered ? y.classList.add("flow-edge-filtered") : y.classList.remove("flow-edge-filtered");
        }
      }), o(() => {
        for (const [a, c] of l)
          t.destroyTree(c), c.remove(), i._edgeSvgElements?.delete(a);
        l.clear(), s.remove();
      });
    }
  );
}
const Kp = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right"
], Gp = "a, button, input, textarea, select, [contenteditable]", Jp = 100, Qp = 60, eg = /* @__PURE__ */ new Set(["top", "top-left", "top-right"]), tg = /* @__PURE__ */ new Set(["bottom", "bottom-left", "bottom-right"]), ng = /* @__PURE__ */ new Set(["left", "top-left", "bottom-left"]), og = /* @__PURE__ */ new Set(["right", "top-right", "bottom-right"]);
function ig(t, e) {
  const n = new Set(e), o = n.has("static"), i = n.has("no-resize") || n.has("noresize"), r = n.has("locked"), s = n.has("constrained");
  let l = n.has("fill-width") || n.has("fill"), a = n.has("fill-height") || n.has("fill");
  return { position: t && Kp.includes(t) ? t : "top-right", isStatic: o, isFixed: r, noResize: i, constrained: s, fillWidth: l, fillHeight: a };
}
function Lt(t, e, n) {
  t.dispatchEvent(new CustomEvent(`flow-${e}`, {
    bubbles: !0,
    detail: n
  }));
}
function sg(t, e, n, o, i, r) {
  return {
    left: Math.max(0, Math.min(t, i - n)),
    top: Math.max(0, Math.min(e, r - o))
  };
}
function rg(t, e, n, o) {
  t.style.transform = "none", t.style.borderRadius = "0", n && (t.style.left = "0", t.style.right = "0", t.style.width = "auto"), o && (t.style.top = "0", t.style.bottom = "0", t.style.height = "auto"), n && !o && (eg.has(e) && (t.style.top = "0"), tg.has(e) && (t.style.bottom = "0")), o && !n && (ng.has(e) && (t.style.left = "0"), og.has(e) && (t.style.right = "0"));
}
function ag(t) {
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
      } = ig(n, o), u = d || f, h = !s && !l && !u, p = !s && !a && !u;
      e.classList.add("flow-panel", `flow-panel-${r}`), s && e.classList.add("flow-panel-static"), (l || u) && e.classList.add("flow-panel-locked"), (a || u) && e.classList.add("flow-panel-no-resize"), d && e.classList.add("flow-panel-fill-width"), f && e.classList.add("flow-panel-fill-height"), u && rg(e, r, d, f);
      const g = (M) => M.stopPropagation();
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
      }, b = `flow-panel-${r}`, S = () => {
        e.style.left = m.left, e.style.top = m.top, e.style.right = m.right, e.style.bottom = m.bottom, e.style.transform = m.transform, e.style.width = m.width, e.style.height = m.height, e.style.borderRadius = m.borderRadius, e.classList.contains(b) || e.classList.add(b);
      };
      y.addEventListener("flow-panel-reset", S), y.__flowPanels || (y.__flowPanels = /* @__PURE__ */ new Set()), y.__flowPanels.add(e);
      let _ = null;
      if (h) {
        let M = !1, L = 0, P = 0, $ = 0, x = 0;
        const E = () => {
          const v = e.getBoundingClientRect(), D = y.getBoundingClientRect();
          return {
            x: v.left - D.left,
            y: v.top - D.top
          };
        }, N = (v) => {
          if (!M) return;
          let D = $ + (v.clientX - L), k = x + (v.clientY - P);
          if (c) {
            const O = sg(
              D,
              k,
              e.offsetWidth,
              e.offsetHeight,
              y.clientWidth,
              y.clientHeight
            );
            D = O.left, k = O.top;
          }
          e.style.left = `${D}px`, e.style.top = `${k}px`, Lt(y, "panel-drag", {
            panel: e,
            position: { x: D, y: k }
          });
        }, T = () => {
          if (!M) return;
          M = !1, document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", T), document.removeEventListener("pointercancel", T);
          const v = E();
          Lt(y, "panel-drag-end", {
            panel: e,
            position: v
          });
        }, w = (v) => {
          const D = v.target;
          if (D.closest(Gp) || D.closest(".flow-panel-resize-handle"))
            return;
          M = !0, L = v.clientX, P = v.clientY;
          const k = e.getBoundingClientRect(), O = y.getBoundingClientRect();
          $ = k.left - O.left, x = k.top - O.top, e.style.bottom = "auto", e.style.right = "auto", e.style.transform = "none", e.style.left = `${$}px`, e.style.top = `${x}px`, document.addEventListener("pointermove", N), document.addEventListener("pointerup", T), document.addEventListener("pointercancel", T), Lt(y, "panel-drag-start", {
            panel: e,
            position: { x: $, y: x }
          });
        };
        if (e.addEventListener("pointerdown", w), p) {
          _ = document.createElement("div"), _.classList.add("flow-panel-resize-handle"), e.appendChild(_);
          let v = !1, D = 0, k = 0, O = 0, W = 0;
          const C = (X) => {
            if (!v) return;
            const se = Math.max(Jp, O + (X.clientX - D)), ne = Math.max(Qp, W + (X.clientY - k));
            e.style.width = `${se}px`, e.style.height = `${ne}px`, Lt(y, "panel-resize", {
              panel: e,
              dimensions: { width: se, height: ne }
            });
          }, A = () => {
            v && (v = !1, document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", A), document.removeEventListener("pointercancel", A), Lt(y, "panel-resize-end", {
              panel: e,
              dimensions: { width: e.offsetWidth, height: e.offsetHeight }
            }));
          }, R = (X) => {
            X.stopPropagation(), v = !0, D = X.clientX, k = X.clientY, O = e.offsetWidth, W = e.offsetHeight, document.addEventListener("pointermove", C), document.addEventListener("pointerup", A), document.addEventListener("pointercancel", A), Lt(y, "panel-resize-start", {
              panel: e,
              dimensions: { width: O, height: W }
            });
          };
          _.addEventListener("pointerdown", R), i(() => {
            e.removeEventListener("pointerdown", w), _?.removeEventListener("pointerdown", R), document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", T), document.removeEventListener("pointercancel", T), document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", A), document.removeEventListener("pointercancel", A), _?.remove(), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", S), y.__flowPanels?.delete(e);
          });
        } else
          i(() => {
            e.removeEventListener("pointerdown", w), document.removeEventListener("pointermove", N), document.removeEventListener("pointerup", T), document.removeEventListener("pointercancel", T), e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", S), y.__flowPanels?.delete(e);
          });
      } else
        i(() => {
          e.removeEventListener("mousedown", g), e.removeEventListener("pointerdown", g), e.removeEventListener("wheel", g), y.removeEventListener("flow-panel-reset", S), y.__flowPanels?.delete(e);
        });
    }
  );
}
function lg(t) {
  t.directive(
    "flow-node-toolbar",
    (e, { value: n, modifiers: o }, { effect: i, cleanup: r }) => {
      const s = cg(n), l = dg(o);
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
        const h = u.viewport.zoom || 1, p = parseInt(e.getAttribute("data-flow-offset") ?? "10", 10), g = d.dataset.flowNodeId, y = g ? u.getNode(g) : null, m = y?.dimensions?.width ?? d.offsetWidth, b = y?.dimensions?.height ?? d.offsetHeight, S = p / h;
        let _, M, L, P;
        s === "top" || s === "bottom" ? (M = s === "top" ? -S : b + S, P = s === "top" ? "-100%" : "0%", l === "start" ? (_ = 0, L = "0%") : l === "end" ? (_ = m, L = "-100%") : (_ = m / 2, L = "-50%")) : (_ = s === "left" ? -S : m + S, L = s === "left" ? "-100%" : "0%", l === "start" ? (M = 0, P = "0%") : l === "end" ? (M = b, P = "-100%") : (M = b / 2, P = "-50%")), e.style.left = `${_}px`, e.style.top = `${M}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / h}) translate(${L}, ${P})`;
      }), r(() => {
        e.removeEventListener("pointerdown", a), e.removeEventListener("click", c), e.classList.remove("flow-node-toolbar");
      });
    }
  );
}
function cg(t) {
  return t === "bottom" ? "bottom" : t === "left" ? "left" : t === "right" ? "right" : "top";
}
function dg(t) {
  return t.includes("start") ? "start" : t.includes("end") ? "end" : "center";
}
function ug(t) {
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
        const L = r(o);
        f = L?.offsetX ?? 0, u = L?.offsetY ?? 0;
      }
      a.setAttribute("role", "menu"), a.setAttribute("tabindex", "-1"), a.style.display = "none";
      const h = document.createElement("div");
      h.style.cssText = "position:fixed;inset:0;z-index:4999;display:none;", c.appendChild(h);
      let p = null;
      const g = 4, y = () => {
        p = document.activeElement;
        const L = d.contextMenu.x + f, P = d.contextMenu.y + u;
        a.style.display = "", a.style.position = "fixed", a.style.left = L + "px", a.style.top = P + "px", a.style.zIndex = "5000", a.querySelectorAll(':scope > button, :scope > [role="menuitem"]').forEach((w) => {
          w.setAttribute("role", "menuitem"), w.hasAttribute("tabindex") || w.setAttribute("tabindex", "-1");
        });
        const $ = a.getBoundingClientRect(), x = window.innerWidth, E = window.innerHeight;
        let N = L, T = P;
        $.right > x - g && (N = x - $.width - g), $.bottom > E - g && (T = E - $.height - g), N < g && (N = g), T < g && (T = g), a.style.left = N + "px", a.style.top = T + "px", h.style.display = "", a.focus({ preventScroll: !0 });
      }, m = () => {
        a.style.display = "none", h.style.display = "none", p && document.contains(p) && (p.focus({ preventScroll: !0 }), p = null);
      };
      i(() => {
        const L = d.contextMenu;
        L.show && L.type === l ? y() : m();
      }), h.addEventListener("click", () => d.closeContextMenu()), h.addEventListener("contextmenu", (L) => {
        L.preventDefault(), d.closeContextMenu();
      });
      const b = () => {
        d.contextMenu.show && d.contextMenu.type === l && d.closeContextMenu();
      };
      window.addEventListener("scroll", b, !0);
      const S = () => Array.from(a.querySelectorAll(
        ':scope > button:not([disabled]), :scope > [role="menuitem"]:not([disabled])'
      )), _ = (L) => Array.from(L.querySelectorAll(
        "button:not([disabled])"
      )), M = (L) => {
        if (!d.contextMenu.show || d.contextMenu.type !== l || a.style.display === "none") return;
        const P = document.activeElement, $ = P?.closest(".flow-context-submenu"), x = $ ? _($) : S();
        if (x.length === 0) return;
        const E = x.indexOf(P);
        switch (L.key) {
          case "ArrowDown": {
            L.preventDefault();
            const N = E < x.length - 1 ? E + 1 : 0;
            x[N].focus({ preventScroll: !0 });
            break;
          }
          case "ArrowUp": {
            L.preventDefault();
            const N = E > 0 ? E - 1 : x.length - 1;
            x[N].focus({ preventScroll: !0 });
            break;
          }
          case "Tab": {
            if (L.preventDefault(), L.shiftKey) {
              const N = E > 0 ? E - 1 : x.length - 1;
              x[N].focus({ preventScroll: !0 });
            } else {
              const N = E < x.length - 1 ? E + 1 : 0;
              x[N].focus({ preventScroll: !0 });
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
              const N = P?.querySelector(".flow-context-submenu");
              N && (L.preventDefault(), N.querySelector("button:not([disabled])")?.focus({ preventScroll: !0 }));
            }
            break;
          }
          case "ArrowLeft": {
            $ && (L.preventDefault(), $.closest(".flow-context-submenu-trigger")?.focus({ preventScroll: !0 }));
            break;
          }
        }
      };
      a.addEventListener("keydown", M), s(() => {
        h.remove(), window.removeEventListener("scroll", b, !0), a.removeEventListener("keydown", M);
      });
    }
  );
}
const fg = {
  mouseenter: "mouseleave",
  click: "click"
  // toggle behavior
};
function hg(t) {
  t.directive(
    "flow-animate",
    (e, { value: n, modifiers: o, expression: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = new Set(o), c = a.has("once"), d = a.has("reverse"), f = a.has("queue"), u = n || "";
      let h = "click";
      a.has("mouseenter") ? h = "mouseenter" : a.has("click") && (h = "click");
      let p = null, g = [], y = !1, m = !1, b = !1;
      function S() {
        const N = r(i);
        return Array.isArray(N) ? N : N && typeof N == "object" ? [N] : [];
      }
      function _() {
        const N = e.closest("[x-data]");
        return N ? t.$data(N) : null;
      }
      function M(N, T = !1) {
        const w = _();
        if (!w?.timeline) return Promise.resolve();
        const v = w.timeline();
        if (T) {
          for (let D = N.length - 1; D >= 0; D--)
            v.step(N[D]);
          v.reverse();
        } else
          for (const D of N)
            D.parallel ? v.parallel(D.parallel) : v.step(D);
        return p = v, v.play().then(() => {
          p === v && (p = null);
        });
      }
      function L(N = !1) {
        if (c && m) return;
        m = !0;
        const T = S();
        if (T.length === 0) return;
        const w = () => M(T, N);
        f ? (g.push(w), P()) : (p?.stop(), p = null, g = [], y = !1, w());
      }
      async function P() {
        if (!y) {
          for (y = !0; g.length > 0; )
            await g.shift()();
          y = !1;
        }
      }
      if (u) {
        s(() => {
          const N = S(), T = _();
          T?.registerAnimation && T.registerAnimation(u, N);
        }), l(() => {
          const N = _();
          N?.unregisterAnimation && N.unregisterAnimation(u);
        });
        return;
      }
      const $ = () => {
        d && h === "click" ? (L(b), b = !b) : L(!1);
      };
      e.addEventListener(h, $);
      let x = null, E = null;
      d && h !== "click" && (E = fg[h] ?? null, E && (x = () => L(!0), e.addEventListener(E, x))), l(() => {
        p?.stop(), e.removeEventListener(h, $), E && x && e.removeEventListener(E, x);
      });
    }
  );
}
function pg(t, e, n, o, i) {
  const r = e.position?.x ?? t.position.x, s = e.position?.y ?? t.position.y, l = t.dimensions?.width ?? ve, a = t.dimensions?.height ?? _e, c = r * n.zoom + n.x, d = s * n.zoom + n.y, f = (r + l) * n.zoom + n.x, u = (s + a) * n.zoom + n.y;
  return f > 0 && c < o && u > 0 && d < i;
}
function gg(t, e, n, o, i) {
  const r = t.nodes;
  if (!r || r.length === 0) return !1;
  for (const s of r) {
    const l = e.getNode?.(s) ?? e.nodes?.find((a) => a.id === s);
    if (l && !pg(l, t, n, o, i))
      return !0;
  }
  return !1;
}
function mg(t) {
  t.directive(
    "flow-timeline",
    (e, { expression: n }, { evaluate: o, effect: i, cleanup: r }) => {
      let s = 0, l = null, a = [], c = !1, d = "idle", f = 0;
      function u() {
        const y = e.closest("[x-data]");
        return y ? t.$data(y) : null;
      }
      function h(y, m) {
        const b = u();
        if (!b?.timeline) return Promise.resolve();
        const S = b.timeline(), _ = m.speed ?? 1, M = m.autoFitView === !0, L = m.fitViewPadding ?? 0.1, P = b.viewport, $ = b.getContainerDimensions?.();
        for (const x of y) {
          const E = _ !== 1 ? {
            ...x,
            duration: x.duration !== void 0 ? x.duration / _ : void 0,
            delay: x.delay !== void 0 ? x.delay / _ : void 0
          } : x;
          if (E.parallel) {
            const N = E.parallel.map(
              (T) => _ !== 1 ? {
                ...T,
                duration: T.duration !== void 0 ? T.duration / _ : void 0,
                delay: T.delay !== void 0 ? T.delay / _ : void 0
              } : T
            );
            S.parallel(N);
          } else if (M && P && $ && gg(E, b, P, $.width, $.height)) {
            const N = {
              fitView: !0,
              fitViewPadding: L,
              duration: E.duration,
              easing: E.easing
            };
            S.parallel([E, N]);
          } else
            S.step(E);
        }
        if (m.lock && S.lock(!0), m.loop !== void 0 && m.loop !== !1) {
          const x = m.loop === !0 ? 0 : m.loop;
          S.loop(x);
        }
        return m.respectReducedMotion !== void 0 && S.respectReducedMotion(m.respectReducedMotion), l = S, d = "playing", c = !0, S.play().then(() => {
          l === S && (l = null, d = "idle", c = !1);
        });
      }
      async function p(y) {
        if (a.length === 0) return;
        if ((y.overflow ?? "queue") === "latest" && c) {
          l?.stop(), l = null, c = !1, d = "idle";
          const b = [a[a.length - 1]];
          s += a.length, a = [], await h(b, y);
        } else {
          const b = [...a];
          s += b.length, a = [], c && await new Promise((_) => {
            l ? (l.on("complete", () => _()), l.on("stop", () => _())) : _();
          }), await h(b, y);
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
          if (l?.stop(), l = null, c = !1, d = "idle", s = 0, a = [], f = 0, y) {
            const m = o(n), b = m.steps ?? [];
            if (b.length > 0)
              return a = [...b], p(m);
          }
        },
        get state() {
          return d;
        }
      };
      e.__timeline = g, i(() => {
        const y = o(n);
        if (!y || !y.steps) return;
        const m = y.steps, b = y.autoplay !== !1;
        if (m.length > f) {
          const S = m.slice(Math.max(s, f));
          f = m.length, S.length > 0 && b && (a.push(...S), p(y));
        } else
          f = m.length;
      }), r(() => {
        l?.stop(), delete e.__timeline;
      });
    }
  );
}
function yg(t) {
  t.directive(
    "flow-collapse",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const l = o.includes("all"), a = o.includes("expand"), c = o.includes("children"), d = o.includes("instant"), f = () => {
        const u = e.closest("[data-flow-canvas]");
        if (!u) return;
        const h = t.$data(u);
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
      e.addEventListener("click", f), e.setAttribute("data-flow-collapse", ""), e.style.cursor = "pointer", !l && !c && r(() => {
        const u = i(n);
        if (!u) return;
        const h = e.closest("[data-flow-canvas]");
        if (!h) return;
        const p = t.$data(h);
        if (!p?.isCollapsed) return;
        const g = p.isCollapsed(u);
        e.setAttribute("aria-expanded", String(!g));
        const y = e.closest("[x-flow-node]");
        y && e.setAttribute("aria-controls", y.id || u);
      }), s(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function wg(t) {
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
function Po(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function vg(t) {
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
        Po(s);
        return;
      }
      const p = typeof h.label == "string" ? h.label : "", g = Array.isArray(h.fields) ? h.fields : [], y = typeof u?.id == "string" ? u.id : "";
      typeof h.kind == "string" && h.kind ? s.setAttribute("data-flow-schema-kind", h.kind) : s.removeAttribute("data-flow-schema-kind"), Po(s);
      const m = a(), b = c(), S = document.createElement("div");
      S.className = "flow-schema-header", S.textContent = p, s.appendChild(S);
      const _ = document.createElement("div");
      _.className = "flow-schema-body";
      for (const M of g)
        _.appendChild(f(M, y, m, b));
      s.appendChild(_), t.initTree(_);
    }, f = (u, h, p, g) => {
      const y = document.createElement("div");
      y.className = "flow-schema-row", y.dataset.flowSchemaField = u.name, u.key === "primary" && y.classList.add("flow-schema-row--pk"), u.key === "foreign" && y.classList.add("flow-schema-row--fk"), u.required && y.classList.add("flow-schema-row--required"), h && y.setAttribute(
        "x-flow-row-select",
        JSON.stringify(`${h}.${u.name}`)
      ), p && y.setAttribute("x-schema-reorderable", ""), g && h && y.setAttribute(
        "x-schema-keyboard-nav",
        JSON.stringify(`${h}.${u.name}`)
      );
      const m = document.createElement("div");
      if (m.className = "flow-schema-handle flow-schema-handle--target", m.setAttribute("x-flow-handle:target.left", JSON.stringify(u.name)), y.appendChild(m), u.icon) {
        const P = document.createElement("span");
        P.className = "flow-schema-row-icon", P.textContent = u.icon, y.appendChild(P);
      }
      const b = document.createElement("span");
      b.className = "flow-schema-row-name", b.textContent = u.name, y.appendChild(b);
      const S = document.createElement("span");
      S.className = "flow-schema-row-type", S.textContent = u.type, y.appendChild(S);
      const _ = document.createElement("div");
      _.className = "flow-schema-handle flow-schema-handle--source", _.setAttribute("x-flow-handle:source.right", JSON.stringify(u.name)), y.appendChild(_);
      const M = document.createElement("div");
      M.className = "flow-schema-handle flow-schema-handle--target flow-schema-handle--mirror", M.setAttribute("x-flow-handle:target.right", JSON.stringify(u.name)), y.appendChild(M);
      const L = document.createElement("div");
      return L.className = "flow-schema-handle flow-schema-handle--source flow-schema-handle--mirror", L.setAttribute("x-flow-handle:source.left", JSON.stringify(u.name)), y.appendChild(L), y;
    };
    i(() => {
      if (!s.isConnected) return;
      const u = l()?.data;
      u?.label, u?.kind;
      const h = u?.fields;
      if (Array.isArray(h))
        for (const p of h)
          p.name, p.type, p.key, p.required, p.icon;
      d();
    }), r(() => {
      Po(s), s.classList.remove("flow-schema-node");
    });
  });
}
function _g(t) {
  if (!Number.isFinite(t) || t < 0) return "";
  if (t < 1e3) return `${t}ms`;
  if (t < 6e4) {
    const o = t / 1e3;
    return t % 1e3 === 0 ? `${o}s` : `${o.toFixed(1)}s`;
  }
  const e = Math.floor(t / 6e4), n = Math.floor(t % 6e4 / 1e3);
  return n === 0 ? `${e}m` : `${e}m ${n}s`;
}
function Ps(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function bg(t) {
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
      Ps(s);
      const d = l()?.data;
      if (!d) return;
      const f = typeof d.label == "string" && d.label ? d.label : "Wait", u = typeof d.icon == "string" && d.icon ? d.icon : "", h = typeof d.durationMs == "number" ? d.durationMs : NaN, p = document.createElement("div");
      if (p.className = "flow-wait-header", u) {
        const S = document.createElement("span");
        S.className = "flow-wait-icon", S.textContent = u, p.appendChild(S);
      }
      const g = document.createElement("span");
      g.className = "flow-wait-label", g.textContent = f, p.appendChild(g);
      const y = document.createElement("span");
      y.className = "flow-wait-duration", y.textContent = _g(h), p.appendChild(y), s.appendChild(p);
      const m = document.createElement("div");
      m.className = "flow-wait-handle flow-wait-handle--target", m.setAttribute("x-flow-handle:target.top", JSON.stringify("in")), s.appendChild(m);
      const b = document.createElement("div");
      b.className = "flow-wait-handle flow-wait-handle--source", b.setAttribute("x-flow-handle:source.bottom", JSON.stringify("out")), s.appendChild(b), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const c = l()?.data;
      c?.durationMs, c?.label, c?.icon, a();
    }), r(() => {
      Ps(s), s.classList.remove("flow-wait-node"), s.removeAttribute("data-flow-wait");
    });
  });
}
const Ms = {
  equals: "==",
  notEquals: "!=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<="
};
function sn(t) {
  return t === null || t === void 0 ? "null" : typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map(sn).join(", ")}]` : String(t);
}
function xg(t) {
  const { field: e, op: n, value: o } = t;
  return n in Ms ? `${e} ${Ms[n]} ${sn(o)}` : n === "in" ? `${e} in ${sn(o)}` : n === "notIn" ? `${e} not in ${sn(o)}` : n === "exists" ? `${e} exists` : n === "matches" ? `${e} ~ /${String(o)}/` : `${e} ${n} ${sn(o)}`;
}
function Ts(t) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
}
function Eg(t, e) {
  return t === "vertical" || t === "horizontal" ? t : e === "vertical" || e === "horizontal" ? e : "horizontal";
}
function Cg(t) {
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
      const f = l()?.data ?? {}, u = Eg(a(), f.direction);
      s.setAttribute("data-flow-condition-direction", u);
      const h = f._branchTaken;
      h === "true" || h === "false" ? s.setAttribute("data-flow-condition-branch-taken", h) : s.removeAttribute("data-flow-condition-branch-taken"), Ts(s);
      const p = typeof f.label == "string" && f.label ? f.label : "Condition", g = document.createElement("div");
      g.className = "flow-condition-header", g.textContent = p, s.appendChild(g);
      const y = document.createElement("div");
      y.className = "flow-condition-body", f.condition && typeof f.condition == "object" ? y.textContent = xg(f.condition) : typeof f.evaluate == "function" ? y.textContent = typeof f.evaluateLabel == "string" && f.evaluateLabel ? f.evaluateLabel : "[custom evaluator]" : y.textContent = "", s.appendChild(y);
      const m = document.createElement("div");
      m.className = "flow-condition-handle-target", m.setAttribute("data-flow-handle-direction", "target"), m.setAttribute("x-flow-handle:target", JSON.stringify("in")), s.appendChild(m);
      const b = document.createElement("div");
      b.className = "flow-condition-handle-source flow-condition-handle--true", b.setAttribute("data-flow-handle-direction", "source"), b.setAttribute("data-source-handle", "true"), b.setAttribute("x-flow-handle:source", JSON.stringify("true")), s.appendChild(b);
      const S = document.createElement("div");
      S.className = "flow-condition-handle-source flow-condition-handle--false", S.setAttribute("data-flow-handle-direction", "source"), S.setAttribute("data-source-handle", "false"), S.setAttribute("x-flow-handle:source", JSON.stringify("false")), s.appendChild(S), t.initTree(s);
    };
    i(() => {
      if (!s.isConnected) return;
      const d = l()?.data;
      d?.label, d?.condition, d?.condition?.field, d?.condition?.op, d?.condition?.value, d?.evaluate, d?.evaluateLabel, d?.direction, d?._branchTaken, c();
    }), r(() => {
      Ts(s), s.classList.remove("flow-condition-node"), s.removeAttribute("data-flow-condition-direction"), s.removeAttribute("data-flow-condition-branch-taken");
    });
  });
}
function Sg(t) {
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
function kg(t) {
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
          const p = i(n), g = u.viewport.zoom, y = p.min === void 0 || g >= p.min, m = p.max === void 0 || g <= p.max;
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
const Lg = ["perf", "events", "viewport", "state", "activity"], As = ["fps", "memory", "counts", "visible"], Ns = 30;
function Pg(t, e) {
  if (t && typeof t == "object" && Object.keys(t).length > 0)
    return t;
  const n = e.filter((i) => Lg.includes(i));
  if (n.length === 0)
    return { perf: !0, events: !0, viewport: !0, state: !0, activity: !0 };
  const o = {};
  for (const i of n)
    o[i] = !0;
  return o;
}
function Mg(t) {
  return t.perf ? t.perf === !0 ? [...As] : t.perf.filter((e) => As.includes(e)) : [];
}
function Tg(t) {
  return t.events ? t.events === !0 ? Ns : t.events.max ?? Ns : 0;
}
function Qt(t, e) {
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
function Ag(t) {
  t.directive(
    "flow-devtools",
    (e, { expression: n, modifiers: o }, { evaluate: i, effect: r, cleanup: s }) => {
      let l = null;
      if (n)
        try {
          l = i(n);
        } catch {
        }
      const a = Pg(l, o), c = e.closest("[x-data]");
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
      const p = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      p.setAttribute("points", "22 12 18 12 15 21 9 3 6 12 2 12"), h.appendChild(p), u.appendChild(h), e.appendChild(u);
      const g = document.createElement("div");
      g.className = "flow-devtools-panel", g.style.display = "none", g.style.userSelect = "none", e.appendChild(g);
      let y = !1;
      const m = () => {
        y = !y, g.style.display = y ? "" : "none", u.title = y ? "Collapse" : "Devtools", y ? ne() : ie();
      };
      u.addEventListener("click", m);
      const b = Mg(a);
      let S = null, _ = null, M = null, L = null, P = null;
      if (b.length > 0) {
        const { wrapper: J, content: le } = Qt("Performance", "flow-devtools-perf");
        if (b.includes("fps")) {
          const { row: ee, valueEl: F } = Oe("FPS", "flow-devtools-fps");
          S = F, le.appendChild(ee);
        }
        if (b.includes("memory")) {
          const { row: ee, valueEl: F } = Oe("Memory", "flow-devtools-memory");
          _ = F, le.appendChild(ee);
        }
        if (b.includes("counts")) {
          const ee = Oe("Nodes", "flow-devtools-counts");
          M = ee.valueEl, le.appendChild(ee.row);
          const F = Oe("Edges", "flow-devtools-counts");
          L = F.valueEl, le.appendChild(F.row);
        }
        if (b.includes("visible")) {
          const { row: ee, valueEl: F } = Oe("Visible", "flow-devtools-visible");
          P = F, le.appendChild(ee);
        }
        g.appendChild(J);
      }
      const $ = Tg(a);
      let x = null;
      if ($ > 0) {
        const { wrapper: J, content: le } = Qt("Events", "flow-devtools-events"), ee = document.createElement("button");
        ee.className = "flow-devtools-clear-btn nopan", ee.textContent = "Clear", ee.addEventListener("click", () => {
          x && (x.textContent = ""), ae.length = 0;
        }), J.querySelector(".flow-devtools-section-title").appendChild(ee), x = document.createElement("div"), x.className = "flow-devtools-event-list", le.appendChild(x), g.appendChild(J);
      }
      let E = null, N = null, T = null;
      if (a.viewport) {
        const { wrapper: J, content: le } = Qt("Viewport", "flow-devtools-viewport"), ee = Oe("X", "flow-devtools-vp-x");
        E = ee.valueEl, le.appendChild(ee.row);
        const F = Oe("Y", "flow-devtools-vp-y");
        N = F.valueEl, le.appendChild(F.row);
        const K = Oe("Zoom", "flow-devtools-vp-zoom");
        T = K.valueEl, le.appendChild(K.row), g.appendChild(J);
      }
      let w = null;
      if (a.state) {
        const { wrapper: J, content: le } = Qt("Selection", "flow-devtools-state");
        w = document.createElement("div"), w.className = "flow-devtools-state-content", w.textContent = "No selection", le.appendChild(w), g.appendChild(J);
      }
      let v = null, D = null, k = null, O = null;
      if (a.activity) {
        const { wrapper: J, content: le } = Qt("Activity", "flow-devtools-activity"), ee = Oe("Animations", "flow-devtools-anim");
        v = ee.valueEl, le.appendChild(ee.row);
        const F = Oe("Particles", "flow-devtools-particles");
        D = F.valueEl, le.appendChild(F.row);
        const K = Oe("Follow", "flow-devtools-follow");
        k = K.valueEl, le.appendChild(K.row);
        const U = Oe("Timelines", "flow-devtools-timelines");
        O = U.valueEl, le.appendChild(U.row), g.appendChild(J);
      }
      let W = null, C = !1, A = 0, R = performance.now();
      const X = !!(S || _), se = () => {
        if (!C) return;
        A++;
        const J = performance.now();
        J - R >= 1e3 && (S && (S.textContent = String(Math.round(A * 1e3 / (J - R)))), A = 0, R = J, _ && performance.memory && (_.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB")), W = requestAnimationFrame(se);
      }, ne = () => {
        !X || C || (C = !0, A = 0, R = performance.now(), W = requestAnimationFrame(se));
      }, ie = () => {
        C = !1, W !== null && (cancelAnimationFrame(W), W = null);
      }, ae = [], ce = [
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
      let de = null;
      if ($ > 0 && x) {
        de = (J) => {
          if (!y) return;
          const le = J, ee = le.type.replace("flow-", "");
          let F = "";
          try {
            F = le.detail ? JSON.stringify(le.detail).slice(0, 80) : "";
          } catch {
            F = "[circular]";
          }
          ae.unshift({ name: ee, time: Date.now(), detail: F });
          const K = x, U = document.createElement("div");
          U.className = "flow-devtools-event-entry";
          const V = document.createElement("span");
          V.className = "flow-devtools-event-name", V.textContent = ee;
          const I = document.createElement("span");
          I.className = "flow-devtools-event-age", I.textContent = "now";
          const re = document.createElement("span");
          for (re.className = "flow-devtools-event-detail", re.textContent = F, U.appendChild(V), U.appendChild(I), U.appendChild(re), K.prepend(U); K.children.length > $; )
            K.removeChild(K.lastChild), ae.pop();
        };
        for (const J of ce)
          d.addEventListener(J, de);
      }
      r(() => {
        const J = t.$data(c);
        !J || !J.viewport || (E && (E.textContent = Math.round(J.viewport.x).toString()), N && (N.textContent = Math.round(J.viewport.y).toString()), T && (T.textContent = J.viewport.zoom.toFixed(2)));
      }), r(() => {
        const J = t.$data(c);
        if (J) {
          if (M && (M.textContent = String(J.nodes?.length ?? 0)), L && (L.textContent = String(J.edges?.length ?? 0)), P && J._getVisibleNodeIds && (P.textContent = String(J._getVisibleNodeIds().size)), w) {
            const le = J.selectedNodes, ee = J.selectedEdges;
            if (!((le?.size ?? 0) > 0 || (ee?.size ?? 0) > 0))
              w.textContent = "No selection";
            else {
              if (w.textContent = "", le && le.size > 0)
                for (const K of le) {
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
          if (v) {
            const le = J._animator?._groups?.size ?? 0;
            v.textContent = String(le);
          }
          D && (D.textContent = String(J._activeParticles?.size ?? 0)), k && (k.textContent = J._followHandle ? "Active" : "Idle"), O && (O.textContent = String(J._activeTimelines?.size ?? 0));
        }
      }), s(() => {
        if (ie(), u.removeEventListener("click", m), de)
          for (const J of ce)
            d.removeEventListener(J, de);
        e.removeEventListener("wheel", f), e.textContent = "", S = null, _ = null, M = null, L = null, P = null, x = null, E = null, N = null, T = null, w = null, v = null, D = null, k = null, O = null;
      });
    }
  );
}
const Ng = {
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
function $g(t) {
  return Ng[t] ?? null;
}
function Ig(t) {
  t.directive(
    "flow-action",
    (e, { value: n, expression: o }, { evaluate: i, effect: r, cleanup: s }) => {
      const a = $g(n);
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
function Dg(t, e) {
  if (t !== "node" && t !== "row") return null;
  const n = e.includes("clear");
  return { type: t, isClear: n };
}
const Mo = /* @__PURE__ */ new WeakMap();
function Rg(t) {
  t.directive(
    "flow-filter",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Dg(n, i);
      if (!a) return;
      const c = e.closest("[data-flow-canvas]");
      if (!c) return;
      const d = t.$data(c);
      if (!d) return;
      let f = null;
      const u = () => {
        if (a.isClear) {
          if (a.type === "node")
            d.clearNodeFilter(), Mo.set(c, null);
          else
            for (const h of d.nodes)
              h.rowFilter && h.rowFilter !== "all" && d.setRowFilter(h.id, "all");
          return;
        }
        if (a.type === "node" && o)
          f = r(`[${o}]`)[0], d.setNodeFilter(f), Mo.set(c, f);
        else if (a.type === "row" && o) {
          const h = r(o);
          d.setRowFilter(h.node, h.predicate);
        }
      };
      e.addEventListener("click", u), e.style.cursor = "pointer", a.type === "node" && !a.isClear && s(() => {
        d.nodes.length;
        const h = Mo.get(c) === f && f !== null;
        e.classList.toggle("flow-filter-active", h), e.setAttribute("aria-pressed", String(h));
      }), l(() => {
        e.removeEventListener("click", u);
      });
    }
  );
}
function Fg(t) {
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
function Hg(t) {
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
        const h = i(n), p = Fg(h);
        if (!p) return;
        if (l && d) {
          d.stop(), d = null, f(!1);
          return;
        }
        d && d.stop();
        const g = {};
        p.zoom !== void 0 && (g.zoom = p.zoom), p.speed !== void 0 && (g.speed = p.speed), d = c.follow(p.target, g), f(!0), d?.finished && d.finished.then(() => {
          d = null, f(!1);
        });
      };
      e.addEventListener("click", u), s(() => {
        e.removeEventListener("click", u), d && (d.stop(), d = null);
      });
    }
  );
}
function Og(t, e) {
  return t !== "save" && t !== "restore" ? null : { action: t, persist: e.includes("persist") };
}
const bi = /* @__PURE__ */ new Map();
function zg(t, e) {
  bi.set(t, e);
}
function Vg(t) {
  return bi.get(t) ?? null;
}
function Bg(t) {
  return bi.has(t);
}
function To(t) {
  return `alpineflow-snapshot-${t}`;
}
function qg(t) {
  t.directive(
    "flow-snapshot",
    (e, { value: n, expression: o, modifiers: i }, { evaluate: r, effect: s, cleanup: l }) => {
      const a = Og(n, i);
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
            a.persist ? localStorage.setItem(To(u), JSON.stringify(h)) : zg(u, h);
          } else {
            let h = null;
            if (a.persist) {
              const p = localStorage.getItem(To(u));
              if (p)
                try {
                  h = JSON.parse(p);
                } catch {
                }
            } else
              h = Vg(u);
            h && d.fromObject(h);
          }
      };
      e.addEventListener("click", f), a.action === "restore" && s(() => {
        if (!o) return;
        const u = r(o);
        if (!u) return;
        let h;
        a.persist ? h = localStorage.getItem(To(u)) !== null : (d.nodes.length, h = Bg(u)), e.disabled = !h, e.setAttribute("aria-disabled", String(!h));
      }), l(() => {
        e.removeEventListener("click", f);
      });
    }
  );
}
function Xg(t) {
  const e = document.createElement("div");
  e.className = "flow-loading-indicator";
  const n = document.createElement("div");
  n.className = "flow-loading-indicator-node";
  const o = document.createElement("div");
  return o.className = "flow-loading-indicator-text", o.textContent = t ?? "Loading…", e.appendChild(n), e.appendChild(o), e;
}
function Yg(t) {
  t.directive(
    "flow-loading",
    (e, { modifiers: n }, { effect: o, cleanup: i }) => {
      const r = e.closest("[data-flow-canvas]");
      if (!r) return;
      const s = t.$data(r);
      if (!s) return;
      e.classList.add("flow-loading-overlay"), e.childElementCount > 0 || e.textContent.trim().length > 0 || e.appendChild(Xg(s._loadingText));
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
function Wg(t) {
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
      const p = o.includes("below"), g = 20;
      r(() => {
        if (!d.edges.some((x) => x.id === a)) {
          e.removeEventListener("pointerdown", u), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
          return;
        }
        const y = d.viewport?.zoom || 1, m = parseInt(e.getAttribute("data-flow-offset") ?? String(g), 10);
        let b = 0.5;
        if (n) {
          const x = i(n);
          typeof x == "number" && (b = x);
        }
        const S = l.querySelectorAll("path"), _ = S.length > 1 ? S[1] : S[0];
        if (!_) return;
        const M = _.getTotalLength?.();
        if (!M) return;
        const L = _.getPointAtLength(M * Math.max(0, Math.min(1, b))), P = m / y, $ = p ? P : -P;
        e.style.left = `${L.x}px`, e.style.top = `${L.y + $}px`, e.style.transformOrigin = "0 0", e.style.transform = `scale(${1 / y}) translate(-50%, ${p ? "0%" : "-100%"})`;
      }), s(() => {
        e.removeEventListener("pointerdown", u), e.removeEventListener("click", h), e.classList.remove("flow-edge-toolbar"), e.remove();
      });
    }
  );
}
function jg(t) {
  t.magic("flow", (e) => {
    const n = e.closest("[data-flow-canvas]");
    return n ? t.$data(n) : (console.warn("[alpinejs-flow] $flow used outside of a flowCanvas context"), {});
  });
}
function Ug(t) {
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
function oy(t, e, n) {
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
      style: typeof m.style == "string" ? m.style : Object.entries(m.style).map(([b, S]) => `${b}:${S}`).join(";")
    } : {},
    data: m.data ?? {}
  })), f = e.filter((m) => !m.hidden), u = [], h = /* @__PURE__ */ new Map();
  for (const m of f) {
    const b = c.get(m.source), S = c.get(m.target);
    if (!b || !S)
      continue;
    let _, M;
    try {
      const E = oo(
        m,
        b,
        S,
        b.sourcePosition ?? "bottom",
        S.targetPosition ?? "top"
      );
      _ = E.path, M = E.labelPosition;
    } catch {
      continue;
    }
    let L, P;
    if (m.markerStart) {
      const E = It(m.markerStart), N = Dt(E, s);
      h.has(N) || h.set(N, Kn(E, N)), L = `url(#${N})`;
    }
    if (m.markerEnd) {
      const E = It(m.markerEnd), N = Dt(E, s);
      h.has(N) || h.set(N, Kn(E, N)), P = `url(#${N})`;
    }
    let $, x;
    if (m.label)
      if (M)
        $ = M.x, x = M.y;
      else {
        const E = b.position.x + b.dimensions.width / 2, N = b.position.y + b.dimensions.height / 2, T = S.position.x + S.dimensions.width / 2, w = S.position.y + S.dimensions.height / 2;
        $ = (E + T) / 2, x = (N + w) / 2;
      }
    u.push({
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
  const p = Array.from(h.values()).join(`
`);
  let g, y;
  if (a.length === 0)
    g = { x: 0, y: 0, width: 0, height: 0 }, y = { x: 0, y: 0, zoom: 1 };
  else {
    const m = Bt(a);
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
    edges: u,
    markers: p,
    viewBox: g,
    viewport: y
  };
}
const $s = /* @__PURE__ */ new WeakSet();
function iy(t) {
  $s.has(t) || ($s.add(t), ma(t), Ug(t), Sp(t), Rp(t), wf(t), df(t), uf(t), ff(t), _p(t), zp(t), Xp(t), Yp(t), jp(t), Zp(t), ag(t), lg(t), ug(t), hg(t), mg(t), yg(t), wg(t), Sg(t), kg(t), Ag(t), Ig(t), Rg(t), Hg(t), qg(t), Yg(t), Wg(t), vg(t), bg(t), Cg(t), jg(t));
}
function Zg(t) {
  return t.replace(/\s+(?:@|:|x-)[\w.:-]*="[^"]*"/g, "").replace(/\s+externalResourcesRequired="[^"]*"/g, "");
}
function Kg(t, e, n, o) {
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
async function Gg(t, e, n, o, i = {}) {
  let r;
  try {
    ({ toSvg: r } = await Promise.resolve().then(() => Um));
  } catch {
    throw new Error("toImage() requires html-to-image. Install it with: npm install html-to-image");
  }
  const s = i.scope ?? "all", l = t.getBoundingClientRect(), a = s === "viewport" ? l.width : i.width ?? 1920, c = s === "viewport" ? l.height : i.height ?? 1080, d = i.background ?? (getComputedStyle(t).getPropertyValue("--flow-bg-color").trim() || "#ffffff"), f = e.style.transform, u = e.style.width, h = e.style.height, p = t.style.width, g = t.style.height, y = t.style.overflow, m = [];
  try {
    if (s === "all") {
      const E = t.querySelectorAll("[data-flow-culled]");
      for (const D of E)
        D.style.display = "", m.push(D);
      const N = n.filter((D) => !D.hidden), T = Bt(N), w = i.padding ?? 0.1, v = jn(
        T,
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
    t.style.width = `${a}px`, t.style.height = `${c}px`, t.style.overflow = "hidden", await new Promise((E) => requestAnimationFrame(E));
    const b = i.includeOverlays, S = b === !0, _ = typeof b == "object" ? b : {}, M = [
      ["canvas-overlay", S || (_.toolbar ?? !1)],
      ["flow-minimap", S || (_.minimap ?? !1)],
      ["flow-controls", S || (_.controls ?? !1)],
      ["flow-panel", S || (_.panels ?? !1)],
      ["flow-selection-box", !1]
    ], L = await r(t, {
      width: a,
      height: c,
      skipFonts: !0,
      filter: (E) => {
        if (E.classList) {
          for (const [N, T] of M)
            if (E.classList.contains(N) && !T) return !1;
        }
        return !0;
      }
    }), $ = Zg(decodeURIComponent(L.substring("data:image/svg+xml;charset=utf-8,".length))), x = await Kg($, a, c, d);
    if (i.filename) {
      const E = document.createElement("a");
      E.download = i.filename, E.href = x, E.click();
    }
    return x;
  } finally {
    e.style.transform = f, e.style.width = u, e.style.height = h, t.style.width = p, t.style.height = g, t.style.overflow = y;
    for (const b of m)
      b.style.display = "none";
  }
}
const Jg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  captureFlowImage: Gg
}, Symbol.toStringTag, { value: "Module" }));
function Qg(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const n = document.implementation.createHTMLDocument(), o = n.createElement("base"), i = n.createElement("a");
  return n.head.appendChild(o), n.body.appendChild(i), e && (o.href = e), i.href = t, i.href;
}
const em = /* @__PURE__ */ (() => {
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
let Pt = null;
function sa(t = {}) {
  return Pt || (t.includeStyleProperties ? (Pt = t.includeStyleProperties, Pt) : (Pt = pt(window.getComputedStyle(document.documentElement)), Pt));
}
function ro(t, e) {
  const o = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return o ? parseFloat(o.replace("px", "")) : 0;
}
function tm(t) {
  const e = ro(t, "border-left-width"), n = ro(t, "border-right-width");
  return t.clientWidth + e + n;
}
function nm(t) {
  const e = ro(t, "border-top-width"), n = ro(t, "border-bottom-width");
  return t.clientHeight + e + n;
}
function xi(t, e = {}) {
  const n = e.width || tm(t), o = e.height || nm(t);
  return { width: n, height: o };
}
function om() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const n = e && e.env ? e.env.devicePixelRatio : null;
  return n && (t = parseInt(n, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const De = 16384;
function im(t) {
  (t.width > De || t.height > De) && (t.width > De && t.height > De ? t.width > t.height ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De) : t.width > De ? (t.height *= De / t.width, t.width = De) : (t.width *= De / t.height, t.height = De));
}
function sm(t, e = {}) {
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
function ao(t) {
  return new Promise((e, n) => {
    const o = new Image();
    o.onload = () => {
      o.decode().then(() => {
        requestAnimationFrame(() => e(o));
      });
    }, o.onerror = n, o.crossOrigin = "anonymous", o.decoding = "async", o.src = t;
  });
}
async function rm(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function am(t, e, n) {
  const o = "http://www.w3.org/2000/svg", i = document.createElementNS(o, "svg"), r = document.createElementNS(o, "foreignObject");
  return i.setAttribute("width", `${e}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${e} ${n}`), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("externalResourcesRequired", "true"), i.appendChild(r), r.appendChild(t), rm(i);
}
const $e = (t, e) => {
  if (t instanceof e)
    return !0;
  const n = Object.getPrototypeOf(t);
  return n === null ? !1 : n.constructor.name === e.name || $e(n, e);
};
function lm(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function cm(t, e) {
  return sa(e).map((n) => {
    const o = t.getPropertyValue(n), i = t.getPropertyPriority(n);
    return `${n}: ${o}${i ? " !important" : ""};`;
  }).join(" ");
}
function dm(t, e, n, o) {
  const i = `.${t}:${e}`, r = n.cssText ? lm(n) : cm(n, o);
  return document.createTextNode(`${i}{${r}}`);
}
function Is(t, e, n, o) {
  const i = window.getComputedStyle(t, n), r = i.getPropertyValue("content");
  if (r === "" || r === "none")
    return;
  const s = em();
  try {
    e.className = `${e.className} ${s}`;
  } catch {
    return;
  }
  const l = document.createElement("style");
  l.appendChild(dm(s, n, i, o)), e.appendChild(l);
}
function um(t, e, n) {
  Is(t, e, ":before", n), Is(t, e, ":after", n);
}
const Ds = "application/font-woff", Rs = "image/jpeg", fm = {
  woff: Ds,
  woff2: Ds,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: Rs,
  jpeg: Rs,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function hm(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function Ei(t) {
  const e = hm(t).toLowerCase();
  return fm[e] || "";
}
function pm(t) {
  return t.split(/,/)[1];
}
function ei(t) {
  return t.search(/^(data:)/) !== -1;
}
function gm(t, e) {
  return `data:${e};base64,${t}`;
}
async function ra(t, e, n) {
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
const Ao = {};
function mm(t, e, n) {
  let o = t.replace(/\?.*/, "");
  return n && (o = t), /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")), e ? `[${e}]${o}` : o;
}
async function Ci(t, e, n) {
  const o = mm(t, e, n.includeQueryParams);
  if (Ao[o] != null)
    return Ao[o];
  n.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let i;
  try {
    const r = await ra(t, n.fetchRequestInit, ({ res: s, result: l }) => (e || (e = s.headers.get("Content-Type") || ""), pm(l)));
    i = gm(r, e);
  } catch (r) {
    i = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${t}`;
    r && (s = typeof r == "string" ? r : r.message), s && console.warn(s);
  }
  return Ao[o] = i, i;
}
async function ym(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : ao(e);
}
async function wm(t, e) {
  if (t.currentSrc) {
    const r = document.createElement("canvas"), s = r.getContext("2d");
    r.width = t.clientWidth, r.height = t.clientHeight, s?.drawImage(t, 0, 0, r.width, r.height);
    const l = r.toDataURL();
    return ao(l);
  }
  const n = t.poster, o = Ei(n), i = await Ci(n, o, e);
  return ao(i);
}
async function vm(t, e) {
  var n;
  try {
    if (!((n = t?.contentDocument) === null || n === void 0) && n.body)
      return await po(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function _m(t, e) {
  return $e(t, HTMLCanvasElement) ? ym(t) : $e(t, HTMLVideoElement) ? wm(t, e) : $e(t, HTMLIFrameElement) ? vm(t, e) : t.cloneNode(aa(t));
}
const bm = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", aa = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function xm(t, e, n) {
  var o, i;
  if (aa(e))
    return e;
  let r = [];
  return bm(t) && t.assignedNodes ? r = pt(t.assignedNodes()) : $e(t, HTMLIFrameElement) && (!((o = t.contentDocument) === null || o === void 0) && o.body) ? r = pt(t.contentDocument.body.childNodes) : r = pt(((i = t.shadowRoot) !== null && i !== void 0 ? i : t).childNodes), r.length === 0 || $e(t, HTMLVideoElement) || await r.reduce((s, l) => s.then(() => po(l, n)).then((a) => {
    a && e.appendChild(a);
  }), Promise.resolve()), e;
}
function Em(t, e, n) {
  const o = e.style;
  if (!o)
    return;
  const i = window.getComputedStyle(t);
  i.cssText ? (o.cssText = i.cssText, o.transformOrigin = i.transformOrigin) : sa(n).forEach((r) => {
    let s = i.getPropertyValue(r);
    r === "font-size" && s.endsWith("px") && (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`), $e(t, HTMLIFrameElement) && r === "display" && s === "inline" && (s = "block"), r === "d" && e.getAttribute("d") && (s = `path(${e.getAttribute("d")})`), o.setProperty(r, s, i.getPropertyPriority(r));
  });
}
function Cm(t, e) {
  $e(t, HTMLTextAreaElement) && (e.innerHTML = t.value), $e(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function Sm(t, e) {
  if ($e(t, HTMLSelectElement)) {
    const o = Array.from(e.children).find((i) => t.value === i.getAttribute("value"));
    o && o.setAttribute("selected", "");
  }
}
function km(t, e, n) {
  return $e(e, Element) && (Em(t, e, n), um(t, e, n), Cm(t, e), Sm(t, e)), e;
}
async function Lm(t, e) {
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
  return !n && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((o) => _m(o, e)).then((o) => xm(t, o, e)).then((o) => km(t, o, e)).then((o) => Lm(o, e));
}
const la = /url\((['"]?)([^'"]+?)\1\)/g, Pm = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Mm = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function Tm(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function Am(t) {
  const e = [];
  return t.replace(la, (n, o, i) => (e.push(i), n)), e.filter((n) => !ei(n));
}
async function Nm(t, e, n, o, i) {
  try {
    const r = n ? Qg(e, n) : e, s = Ei(e);
    let l;
    return i || (l = await Ci(r, s, o)), t.replace(Tm(e), `$1${l}$3`);
  } catch {
  }
  return t;
}
function $m(t, { preferredFontFormat: e }) {
  return e ? t.replace(Mm, (n) => {
    for (; ; ) {
      const [o, , i] = Pm.exec(n) || [];
      if (!i)
        return "";
      if (i === e)
        return `src: ${o};`;
    }
  }) : t;
}
function ca(t) {
  return t.search(la) !== -1;
}
async function da(t, e, n) {
  if (!ca(t))
    return t;
  const o = $m(t, n);
  return Am(o).reduce((r, s) => r.then((l) => Nm(l, s, e, n)), Promise.resolve(o));
}
async function Mt(t, e, n) {
  var o;
  const i = (o = e.style) === null || o === void 0 ? void 0 : o.getPropertyValue(t);
  if (i) {
    const r = await da(i, null, n);
    return e.style.setProperty(t, r, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function Im(t, e) {
  await Mt("background", t, e) || await Mt("background-image", t, e), await Mt("mask", t, e) || await Mt("-webkit-mask", t, e) || await Mt("mask-image", t, e) || await Mt("-webkit-mask-image", t, e);
}
async function Dm(t, e) {
  const n = $e(t, HTMLImageElement);
  if (!(n && !ei(t.src)) && !($e(t, SVGImageElement) && !ei(t.href.baseVal)))
    return;
  const o = n ? t.src : t.href.baseVal, i = await Ci(o, Ei(o), e);
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
async function Rm(t, e) {
  const o = pt(t.childNodes).map((i) => ua(i, e));
  await Promise.all(o).then(() => t);
}
async function ua(t, e) {
  $e(t, Element) && (await Im(t, e), await Dm(t, e), await Rm(t, e));
}
function Fm(t, e) {
  const { style: n } = t;
  e.backgroundColor && (n.backgroundColor = e.backgroundColor), e.width && (n.width = `${e.width}px`), e.height && (n.height = `${e.height}px`);
  const o = e.style;
  return o != null && Object.keys(o).forEach((i) => {
    n[i] = o[i];
  }), t;
}
const Fs = {};
async function Hs(t) {
  let e = Fs[t];
  if (e != null)
    return e;
  const o = await (await fetch(t)).text();
  return e = { url: t, cssText: o }, Fs[t] = e, e;
}
async function Os(t, e) {
  let n = t.cssText;
  const o = /url\(["']?([^"')]+)["']?\)/g, r = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
    let l = s.replace(o, "$1");
    return l.startsWith("https://") || (l = new URL(l, t.url).href), ra(l, e.fetchRequestInit, ({ result: a }) => (n = n.replace(s, `url(${a})`), [s, a]));
  });
  return Promise.all(r).then(() => n);
}
function zs(t) {
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
async function Hm(t, e) {
  const n = [], o = [];
  return t.forEach((i) => {
    if ("cssRules" in i)
      try {
        pt(i.cssRules || []).forEach((r, s) => {
          if (r.type === CSSRule.IMPORT_RULE) {
            let l = s + 1;
            const a = r.href, c = Hs(a).then((d) => Os(d, e)).then((d) => zs(d).forEach((f) => {
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
        i.href != null && o.push(Hs(i.href).then((l) => Os(l, e)).then((l) => zs(l).forEach((a) => {
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
function Om(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => ca(e.style.getPropertyValue("src")));
}
async function zm(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = pt(t.ownerDocument.styleSheets), o = await Hm(n, e);
  return Om(o);
}
function fa(t) {
  return t.trim().replace(/["']/g, "");
}
function Vm(t) {
  const e = /* @__PURE__ */ new Set();
  function n(o) {
    (o.style.fontFamily || getComputedStyle(o).fontFamily).split(",").forEach((r) => {
      e.add(fa(r));
    }), Array.from(o.children).forEach((r) => {
      r instanceof HTMLElement && n(r);
    });
  }
  return n(t), e;
}
async function ha(t, e) {
  const n = await zm(t, e), o = Vm(t);
  return (await Promise.all(n.filter((r) => o.has(fa(r.style.fontFamily))).map((r) => {
    const s = r.parentStyleSheet ? r.parentStyleSheet.href : null;
    return da(r.cssText, s, e);
  }))).join(`
`);
}
async function Bm(t, e) {
  const n = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await ha(t, e);
  if (n) {
    const o = document.createElement("style"), i = document.createTextNode(n);
    o.appendChild(i), t.firstChild ? t.insertBefore(o, t.firstChild) : t.appendChild(o);
  }
}
async function pa(t, e = {}) {
  const { width: n, height: o } = xi(t, e), i = await po(t, e, !0);
  return await Bm(i, e), await ua(i, e), Fm(i, e), await am(i, n, o);
}
async function bn(t, e = {}) {
  const { width: n, height: o } = xi(t, e), i = await pa(t, e), r = await ao(i), s = document.createElement("canvas"), l = s.getContext("2d"), a = e.pixelRatio || om(), c = e.canvasWidth || n, d = e.canvasHeight || o;
  return s.width = c * a, s.height = d * a, e.skipAutoScale || im(s), s.style.width = `${c}`, s.style.height = `${d}`, e.backgroundColor && (l.fillStyle = e.backgroundColor, l.fillRect(0, 0, s.width, s.height)), l.drawImage(r, 0, 0, s.width, s.height), s;
}
async function qm(t, e = {}) {
  const { width: n, height: o } = xi(t, e);
  return (await bn(t, e)).getContext("2d").getImageData(0, 0, n, o).data;
}
async function Xm(t, e = {}) {
  return (await bn(t, e)).toDataURL();
}
async function Ym(t, e = {}) {
  return (await bn(t, e)).toDataURL("image/jpeg", e.quality || 1);
}
async function Wm(t, e = {}) {
  const n = await bn(t, e);
  return await sm(n);
}
async function jm(t, e = {}) {
  return ha(t, e);
}
const Um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontEmbedCSS: jm,
  toBlob: Wm,
  toCanvas: bn,
  toJpeg: Ym,
  toPixelData: qm,
  toPng: Xm,
  toSvg: pa
}, Symbol.toStringTag, { value: "Module" }));
export {
  If as ComputeEngine,
  $u as FlowHistory,
  rs as SHORTCUT_DEFAULTS,
  Jm as along,
  lf as areNodesConnected,
  Dr as buildNodeMap,
  Fr as clampToExtent,
  _o as clampToParent,
  oy as computeRenderPlan,
  ds as computeValidationErrors,
  Rr as computeZIndex,
  iy as default,
  ey as drift,
  xf as expandParentToFitChild,
  jo as getAbsolutePosition,
  yf as getAutoPanDelta,
  Gn as getBezierPath,
  sf as getConnectedEdges,
  ft as getDescendantIds,
  xs as getEdgePosition,
  Jr as getFloatingEdgeParams,
  rf as getIncomers,
  bs as getNodeIntersection,
  Bt as getNodesBounds,
  of as getNodesFullyInPolygon,
  Pu as getNodesFullyInRect,
  nf as getNodesInPolygon,
  Lu as getNodesInRect,
  Yo as getOutgoers,
  Zm as getSimpleBezierPath,
  ny as getSimpleFloatingPosition,
  mn as getSmoothStepPath,
  mf as getStepPath,
  Ar as getStraightPath,
  jn as getViewportForBounds,
  ze as isConnectable,
  hf as isDeletable,
  Tr as isDraggable,
  is as isResizable,
  Wo as isSelectable,
  Xe as matchesKey,
  ut as matchesModifier,
  Km as orbit,
  Qm as pendulum,
  pi as pointInPolygon,
  tf as polygonIntersectsAABB,
  Bu as registerMarker,
  ln as resolveChildValidation,
  vf as resolveShortcuts,
  ht as sortNodesTopological,
  ty as stagger,
  Ht as toAbsoluteNode,
  to as toAbsoluteNodes,
  Vr as validateChildAdd,
  no as validateChildRemove,
  Gm as wave
};
//# sourceMappingURL=alpineflow.bundle.esm.js.map
