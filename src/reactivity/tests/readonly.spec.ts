import { readonly } from "../reactive";

/**
 * readonly 数据不可被set
 */
describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);

    expect(wrapped.foo).toBe(1);
  });
});
