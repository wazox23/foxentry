import React from "react";
import Modal from "react-modal";
import Link from "next/link";
import { useCart } from "../CartContext";
import Image from "next/image";

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useCart();
    // Změna množství produktu
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
    // Výpočet celkové ceny
    const getTotalPrice = () => {
        return Math.round(
            state.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            )
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Cart Modal"
            className="bg-white p-8 rounded-lg w-2/3 mx-auto mt-20 relative max-h-[80vh] overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            <h2 className="text-2xl font-bold mb-4 text-black">Košík</h2>
            <ul className="mb-4 text-black">
                {state.items.length === 0 && <li>Košík je prázdný</li>}
                {state.items.map((item, index) => (
                    <li
                        key={index}
                        className="mb-4 flex items-center justify-between border p-4 rounded-lg"
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            className="object-contain mr-4"
                            width={64}
                            height={64}
                        />
                        <div className="text-black flex-grow text-right">
                            <p className="font-bold">{item.title}</p>
                            <p className="text-gray-600">
                                {Math.round(item.price)} Kč x {item.quantity}
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
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 sm:mt-0 sm:ml-4"
                >
                    Zavřít
                </button>
                <Link href="/cart">
                    <button
                        onClick={onClose}
                        className="bg-primary text-white px-4 py-2 rounded mt-4 sm:mt-0"
                    >
                        Přejít do košíku
                    </button>
                </Link>
            </div>
        </Modal>
    );
};

export default Cart;
