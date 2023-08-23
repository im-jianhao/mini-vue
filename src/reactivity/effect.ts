import { extend } from "../shared";

let activeEffect;
let shouldTrack;

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
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();

    shouldTrack = false;

    return result;
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
  effect.deps.length = 0;
};

/**
 * targetMap里面收集keyMap
 * keyMap里面收集所有的effect（一个数组）
 */
const targetMap = new Map();
// 收集依赖
export const track = (target, key) => {
  if (!isTracking()) return;

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
  trackEffects(dep);
};

export const trackEffects = (dep) => {
  // 去重
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

export const isTracking = () => {
  return shouldTrack && activeEffect !== undefined;
};

// 触发依赖
export const trigger = (target, key) => {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
};

export const triggerEffects = (dep) => {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

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
