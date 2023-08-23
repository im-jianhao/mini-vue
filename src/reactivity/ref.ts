import { hasChanged, isObject } from "../shared";
import { trackEffects, triggerEffects, isTracking } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) return;
    this._rawValue = newValue;
    this._value = convert(newValue);
    triggerEffects(this.dep);
  }
}

export const convert = (value) => {
  return isObject(value) ? reactive(value) : value;
};

export const trackRefValue = (ref) => {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
};

export const ref = (value) => {
  return new RefImpl(value);
};

export const isRef = (ref) => {
  return !!ref.__v_isRef;
};

export const unRef = (ref) => {
  return isRef(ref) ? ref.value : ref;
};

export const proxyRefs = (objectWithRefs) => {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
};
