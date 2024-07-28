"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
} from "react";
import { fetchOrders, createOrder, updateOrder, clearCart } from "./api/api";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    quantity: number;
}

interface CartState {
    items: Product[];
    orderId: string | null;
}

interface CartAction {
    type:
        | "ADD_TO_CART"
        | "REMOVE_FROM_CART"
        | "UPDATE_QUANTITY"
        | "SET_CART"
        | "SET_ORDER_ID"
        | "CLEAR_CART";
    payload?: Product | Product[] | string;
}

const CartContext = createContext<
    | {
          state: CartState;
          dispatch: React.Dispatch<CartAction>;
          clearCartItems: () => void;
      }
    | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_TO_CART":
            const existingProduct = state.items.find(
                (item) => item.id === (action.payload as Product).id
            );
            if (existingProduct) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === (action.payload as Product).id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    items: [
                        ...state.items,
                        { ...(action.payload as Product), quantity: 1 },
                    ],
                };
            }
        case "REMOVE_FROM_CART":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.id !== (action.payload as Product).id
                ),
            };
        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === (action.payload as Product).id
                        ? {
                              ...item,
                              quantity: (action.payload as Product).quantity,
                          }
                        : item
                ),
            };
        case "SET_CART":
            return {
                ...state,
                items: action.payload as Product[],
            };
        case "SET_ORDER_ID":
            return {
                ...state,
                orderId: action.payload as string,
            };
        case "CLEAR_CART":
            return {
                ...state,
                items: [],
                orderId: null,
            };
        default:
            return state;
    }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        orderId: null,
    });

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const orders = await fetchOrders();
                if (orders.length > 0) {
                    dispatch({
                        type: "SET_CART",
                        payload: orders[0].items.map((item) => ({
                            ...item,
                            id: item.productId,
                            description: "",
                            category: "",
                            image: "",
                        })),
                    });
                    dispatch({ type: "SET_ORDER_ID", payload: orders[0].id });
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        loadOrders();
    }, []);

    useEffect(() => {
        const saveOrder = async () => {
            try {
                if (state.orderId) {
                    await updateOrder(state.orderId, { items: state.items });
                } else {
                    const newOrder = await createOrder({ items: state.items });
                    dispatch({ type: "SET_ORDER_ID", payload: newOrder.id });
                }
            } catch (error) {
                console.error("Failed to save order:", error);
            }
        };

        if (state.items.length > 0) {
            saveOrder();
        }
    }, [state.items, state.orderId]);

    const clearCartItems = async () => {
        try {
            await clearCart();
            dispatch({ type: "CLEAR_CART" });
        } catch (error) {
            console.error("Failed to clear cart items:", error);
        }
    };

    return (
        <CartContext.Provider value={{ state, dispatch, clearCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
