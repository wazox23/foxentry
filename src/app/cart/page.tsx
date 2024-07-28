"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "../CartContext";
import { SnackbarProvider, useSnackbar } from "notistack";

const CartPageContent: React.FC = () => {
    const { state, dispatch, clearCartItems } = useCart();
    const { enqueueSnackbar } = useSnackbar();
    // Změna množství produktu v košíku
    const changeQuantity = (id: number, delta: number) => {
        const product = state.items.find((item) => item.id === id);
        if (product) {
            if (product.quantity + delta <= 0) {
                dispatch({ type: "REMOVE_FROM_CART", payload: product });
            } else {
                dispatch({
                    type: "UPDATE_QUANTITY",
                    payload: { ...product, quantity: product.quantity + delta },
                });
            }
        }
    };
    // Zpracování platby = vyčištění košíku
    const handleCheckout = async () => {
        await clearCartItems();
        dispatch({ type: "CLEAR_CART" });
        enqueueSnackbar("Platba proběhla úspěšně!", { variant: "success" });
    };
    // Výpočet celkové ceny
    const getTotalPrice = () => {
        return state.items
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2);
    };

    return (
        <div className="bg-white min-h-screen p-8 w-full">
            <h2 className="text-2xl font-bold mb-4 text-black">Košík</h2>
            <ul className="mb-4">
                {state.items.length === 0 && <li>Košík je prázdný</li>}
                {state.items.map((item, index) => (
                    <li
                        key={index}
                        className="mb-4 flex items-center justify-between border p-4 rounded-lg"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-contain mr-4"
                        />
                        <div className="text-black flex-grow text-right">
                            <p className="font-bold">{item.title}</p>
                            <p className="text-gray-600">
                                {item.price}Kč x {item.quantity}
                            </p>
                            <div className="flex items-center justify-end">
                                <button
                                    onClick={() => changeQuantity(item.id, 1)}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => changeQuantity(item.id, -1)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="text-black font-bold mb-4 text-right">
                Celková cena: {getTotalPrice()} Kč
            </div>
            <div className="flex justify-between">
                <Link href="/">
                    <button className="bg-primary text-white px-4 py-2 rounded mt-4">
                        Zpět na hlavní stránku
                    </button>
                </Link>
                <button
                    onClick={handleCheckout}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                    Zaplatit
                </button>
            </div>
        </div>
    );
};

const CartPage: React.FC = () => (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <CartPageContent />
    </SnackbarProvider>
);

export default CartPage;
