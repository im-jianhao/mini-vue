let activeEffect;

class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }
}

/**
 * targetMap里面收集keyMap
 * keyMap里面收集所有的effect（一个数组）
 */
const targetMap = new Map();
// 收集依赖
export const track = (target, key) => {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
};


// 触发依赖
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
};

export const effect = (fn) => {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
};
