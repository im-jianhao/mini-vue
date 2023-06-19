import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

// 创建Getter
const createGetter = (isReadonly = false) => {
  return (target, key) => {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    return res;
  };
};

// 创建Setter
const createSetter = () => {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    trigger(target, key);
    return res;
  };
};

// 缓存机制，只初始化一次 get set
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`readonly不可被set! key: ${key} target: ${target}`);
    return true;
  },
};
