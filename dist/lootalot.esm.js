function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/**
 * Inverse error function
 */
function erf_inv(x) {
  var a = 0.1400122886866665;
  var b = Math.log(1 - Math.pow(x, 2)) / a;
  var c = 2 / Math.PI / a + Math.log(1 - Math.pow(x, 2)) / 2;
  return Math.sign(x) * Math.sqrt(Math.sqrt(Math.pow(c, 2) - b) - c);
}
/**
 * Probit function, or normal distribution quantile function if `μ` and `σ` is set
 */
function probit(p) {
  var μ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var σ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var sqrt2 = 1.4142135623730951;
  return erf_inv(2 * p - 1) * sqrt2 * σ + μ;
}
/**
 * Flip `n` weighted coins, with `p` chance of landing on heads, and returns the number of heads.
 * @argument {number} p - Probabilty of landing on heads.
 * @argument {number} n - Amount of coins to flip.
 */
function coin_flip(n, p) {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  if (n <= prefs.MAX_REPEAT) {
    var successes = 0;
    for (var i = 0; i < n; i++) successes += +(Math.random() < p);
    return successes;
  } else {
    var μ = n * p;
    var σ = Math.sqrt(μ * (1 - p));
    return Math.round(clamp(probit(Math.random(), μ, σ), 0, n));
  }
}
/**
 * Roll `n` dice, with face values ranging from `min` to `max`, and returns the sum of the roll dice's face values.
 * @argument {number} min - The minimum dice value. (inclusive)
 * @argument {number} max - The minimum dice value. (inclusive)
 * @argument {number} n - Amount of dice to roll.
 */
function dice_roll(n, min, max) {
  if (min == max) return min * n;
  if (n <= prefs.MAX_REPEAT) {
    var value = 0;
    for (var i = 0; i < n; i++) value += Math.floor(Math.random() * (max - min + 1) + min);
    return value;
  } else {
    var μ = (max + min) / 2 * n;
    var σ = Math.sqrt((Math.pow(max - min, 2) - 1) / 12 * n);
    return Math.round(clamp(probit(Math.random(), μ, σ), min * n, max * n));
  }
}
function clamp(x, min, max) {
  return Math.max(Math.min(x, max), min);
}

/** Preferences object. */
var prefs = {
  /** The maximum allowed precision error of thresholds such as the sum of probabilty values error. */
  ARITHMETIC_ERROR: 1e-8,
  /** The maximum amount of times can we roll the RNG manually (for accuracy)
   *  before it's better to approxmiate the rolling using math (for performance) instead. */
  MAX_REPEAT: 20,
  /** The default value of new loot tables' preferences object  */
  DEFAULT_TABLE_PREFS: {
    duplicateSearchMode: "equal"
  }
};
/** The algorithm used to determine if two item entries are equal, used to merge loot results. */
var DuplicateSearchMode;
(function (DuplicateSearchMode) {
  /** Items are compared using the loose equal operator (`==`). */
  DuplicateSearchMode["equal"] = "equal";
  /** Items are compared using the strict equal operator (`===`). */
  DuplicateSearchMode["strict_equal"] = "strict_equal";
  /** Items are converted to JSON strings and then compared using the strict equal operator (`===`). */
  DuplicateSearchMode["json"] = "json";
})(DuplicateSearchMode || (DuplicateSearchMode = {}));
/** A loot table, containing the rules used to determine loot drops. */
var LootTable = /*#__PURE__*/function () {
  function LootTable() {
    _classCallCheck(this, LootTable);
    var _a, _b, _c, _d, _e, _f, _g;
    this.pools = [];
    this.prefs = Object.assign({}, prefs.DEFAULT_TABLE_PREFS);
    this.prefs = Object.assign({}, prefs.DEFAULT_TABLE_PREFS);
    for (var _len = arguments.length, pools = new Array(_len), _key = 0; _key < _len; _key++) {
      pools[_key] = arguments[_key];
    }
    for (var _i = 0, _pools = pools; _i < _pools.length; _i++) {
      var pool = _pools[_i];
      var newPool = [];
      this.pools.push(newPool);
      var wExists = false,
        pExists = false,
        pSum = 0,
        wSum = 0;
      var _iterator = _createForOfIteratorHelper(pool),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _def = _step.value;
          wExists || (wExists = _def.w !== undefined || _def.p === undefined);
          pExists || (pExists = _def.p !== undefined);
          pSum += (_a = _def.p) !== null && _a !== void 0 ? _a : 0;
          wSum += (_b = _def.w) !== null && _b !== void 0 ? _b : 1;
          if (wExists && pExists) throw Error("All loot definitions in a pool must either use `p` for probability or `w` for weight");
          if (((_c = _def.w) !== null && _c !== void 0 ? _c : 1) < 0) throw Error("Weight can not be negative");
          if (((_d = _def.p) !== null && _d !== void 0 ? _d : 0) < 0) throw Error("Probabilty can not be negative");
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (pSum > 1 + prefs.ARITHMETIC_ERROR) throw Error("All loot definitions in a pool must have their `p` values sum to 1 or less (sum = " + pSum + ")");
      if (pExists) wSum = 1;
      var _iterator2 = _createForOfIteratorHelper(pool),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _def2 = _step2.value;
          // @ts-expect-error
          newPool.push({
            w: (_f = (_e = _def2.w) !== null && _e !== void 0 ? _e : _def2.p) !== null && _f !== void 0 ? _f : 1,
            cascadeP: 0,
            item: _def2.item,
            table: _def2.table,
            count: (_g = _def2.count) !== null && _g !== void 0 ? _g : 1
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (pExists && pSum < 1 - prefs.ARITHMETIC_ERROR) {
        newPool.push({
          w: 1 - pSum,
          cascadeP: 0,
          count: 1
        });
      }
      // Sort our item list by most common first
      newPool.sort(function (x, y) {
        return y.w - x.w;
      });
      // Calculate cascading probability
      for (var _i2 = 0, _newPool = newPool; _i2 < _newPool.length; _i2++) {
        var def = _newPool[_i2];
        def.cascadeP = def.w / wSum;
        wSum -= def.w;
      }
      newPool[newPool.length - 1].cascadeP = 1;
    }
  }
  /** Loot this loot table.
   * @argument {number} trials - The amount of times will this function loot
  */
  return _createClass(LootTable, [{
    key: "loot",
    value: function loot(trials) {
      var _this = this;
      var result = [];
      var dupFunc = function dupFunc(a, b) {
        return _this.isDuplicate.call(_this, a, b);
      };
      function addItem(item, count) {
        var entry = result.find(function (x) {
          return dupFunc(x.item, item);
        });
        if (entry) entry.count += count;else result.push({
          item: item,
          count: count
        });
      }
      var _iterator3 = _createForOfIteratorHelper(this.pools),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var pool = _step3.value;
          var t = trials;
          var _iterator4 = _createForOfIteratorHelper(pool),
            _step4;
          try {
            var _loop = function _loop() {
                var item = _step4.value;
                var times = coin_flip(t, item.cascadeP);
                if (times <= 0) return 0; // continue
                t -= times;
                var amount = 0;
                if (typeof item.count == "number") amount = times * item.count;else amount = dice_roll(times, item.count[0], item.count[1]);
                if (item.table !== undefined) {
                  var childLoot = item.table.loot(amount);
                  if (item.item !== undefined) childLoot = childLoot.map(function (x) {
                    return Object.assign(Object.assign({}, x), {
                      item: Object.assign(Object.assign({}, item.item), x.item)
                    });
                  });
                  var _iterator5 = _createForOfIteratorHelper(childLoot),
                    _step5;
                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      var _loot = _step5.value;
                      addItem(_loot.item, _loot.count);
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                } else if (item.item !== undefined) {
                  addItem(item.item, amount);
                }
                if (t <= 0) return 1; // break
              },
              _ret;
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              _ret = _loop();
              if (_ret === 0) continue;
              if (_ret === 1) break;
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return result;
    }
  }, {
    key: "isDuplicate",
    value: function isDuplicate(a, b) {
      var pref = this.prefs.duplicateSearchMode;
      switch (pref) {
        case "equal":
          return a == b;
        case "strict_equal":
          return a === b;
        case "json":
          return JSON.stringify(a) == JSON.stringify(b);
      }
    }
  }]);
}();

export { LootTable, prefs };
