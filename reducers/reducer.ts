import { CartItem, Guitar } from "../src/types";
import { db } from "../src/data/db";
// Según las acciones que existan para el reducer, debemos crear un type (tipos de unión etiquetados) que las representen.
export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decreace-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

// Creamos un tipo para el estado inicial.
export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

//Revisamos el localStorage.
const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

// inicializamos el estado inicial del reducer.
export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

// Definimos el reducer.
export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  switch (action.type) {
    case "add-to-cart":
      const isInCart = state.cart.some(
        (cartItem) => cartItem.id === action.payload.item.id
      );

      if (!isInCart) {
        const newItem = { ...action.payload.item, quantity: 1 };
        return { ...state, cart: [...state.cart, newItem] };
      } else {
        const updatedCart: CartItem[] = state.cart.map((cartItem) => {
          if (
            cartItem.id === action.payload.item.id &&
            cartItem.quantity < MAX_ITEMS
          ) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          } else {
            return cartItem;
          }
        });
        return { ...state, cart: updatedCart };
      }

    case "remove-from-cart": {
      const updatedCart = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      return { ...state, cart: updatedCart };
    }

    case "increase-quantity": {
      const updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      return { ...state, cart: updatedCart };
    }

    case "decreace-quantity": {
      const updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return item;
      });
      return { ...state, cart: updatedCart };
    }

    case "clear-cart":
      return { ...state, cart: [] };

    default:
      return state;
  }
};
