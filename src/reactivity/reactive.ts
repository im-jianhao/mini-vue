import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

const createActiveObject = (raw, baseHandlers) => {
  return new Proxy(raw, baseHandlers);
};

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers);
};

export const isReactive = (row: any) => {
  return !!row[ReactiveFlags.IS_REACTIVE];
};

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers);
};

export const isReadonly = (row: any) => {
  return !!row[ReactiveFlags.IS_READONLY];
};
