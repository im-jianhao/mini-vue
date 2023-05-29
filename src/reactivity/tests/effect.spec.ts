describe("effect", () => {
  it.skip("happy path", () => {
    const user = reactive({
      age: 1,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age = 2;

    expect(nextAge).toBe(12);
  });
});
