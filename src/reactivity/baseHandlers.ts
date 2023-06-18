import { track, trigger } from "./effect";

// 创建Getter
const createGetter = (isReadonly = false) => {
  return (target, key) => {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      // 收集依赖
      track(target, key);
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
const readonlyGet = createGetter();

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    return true;
  },
};
