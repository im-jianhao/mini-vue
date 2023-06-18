import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

const createActiveObject = (raw, baseHandlers) => {
  return new Proxy(raw, baseHandlers);
};

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers);
};

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers);
};
