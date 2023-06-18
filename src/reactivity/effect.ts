import { extend } from "../shared";

class ReactiveEffect {
  private readonly _fn: any;
  scheduler: Function | undefined;
  deps: any[] = [];
  active = true;
  onStop: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

// 清空当前effect
const cleanupEffect = (effect) => {
  effect.deps.forEach((dep: Set<any>) => {
    dep.delete(effect);
  });
};

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

  if (!activeEffect) return;

  // TODO 需要加一个去重的判断，Set中存在effect的时候不需要再一次收集
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

// 触发依赖
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = (runner) => {
  runner.effect.stop();
};
