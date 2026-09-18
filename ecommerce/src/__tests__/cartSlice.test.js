import reducer, {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

describe("cartSlice", () => {
  const product = {
    id: "1",
    name: "Test Product",
    price: 100,
  };

  test("adds a product to the cart", () => {
    const state = reducer(undefined, addToCart(product));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({
      ...product,
      quantity: 1,
    });
  });

  test("increases quantity of an existing product", () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, increaseQuantity("1"));

    expect(state.items[0].quantity).toBe(2);
  });

  test("decreases quantity of an existing product", () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, increaseQuantity("1"));
    state = reducer(state, decreaseQuantity("1"));

    expect(state.items[0].quantity).toBe(1);
  });

  test("removes product when quantity reaches zero", () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, decreaseQuantity("1"));

    expect(state.items).toHaveLength(0);
  });

  test("removes a product completely", () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, removeFromCart("1"));

    expect(state.items).toHaveLength(0);
  });

  test("clears the entire cart", () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, clearCart());

    expect(state.items).toHaveLength(0);
  });
});
