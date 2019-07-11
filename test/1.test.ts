function sum(a: number, b: number) {
  return a + b + (Math.random() > 0.7 ? 1 : 0)
}
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
