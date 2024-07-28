"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Cart from "./Cart";
import { useCart } from "../CartContext";
import Image from "next/image";

const Navbar: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { state } = useCart();

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    // Celkový počet položek v košíku
    const getTotalItems = () => {
        return state.items.length;
    };

    return (
        <nav className="bg-primary p-7 flex justify-between items-center sticky top-0 w-full z-50">
            <img
                src="./imgs/fox.png"
                alt="Pan Lišák"
                className="object-contain"
                width={50}
                height={50}
            />
            <ul className="flex space-x-4 text-white items-center">
                <li className="text-xl font-bold">
                    <Link href="/">Domů</Link>
                </li>
                <li className="text-xl font-bold">
                    <Link href="/products">Produkty</Link>
                </li>
                <li className="text-xl font-bold">
                    <Link href="/admin">Admin</Link>
                </li>
                <li className="text-xl relative">
                    <button onClick={toggleCart} className="relative">
                        <FontAwesomeIcon icon={faShoppingCart} size="xl" />
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-800 rounded-full">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </li>
            </ul>
            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </nav>
    );
};

export default Navbar;
