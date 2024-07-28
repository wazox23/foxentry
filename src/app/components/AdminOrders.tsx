"use client";
import React, { useEffect, useState } from "react";
import { fetchOrders, Order } from "../api/api";
import Link from "next/link";

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Načtení objednávek
        const getOrders = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        getOrders();
    }, []);

    return (
        <div className="bg-gray-200 min-h-screen p-8 w-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-black">Admin Přehled</h1>
                <Link href="/admin/products">
                    <button className="bg-primary text-white px-4 py-2 rounded">
                        Správa produktů
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left align-top">
                                ID Objednávky
                            </th>
                            <th className="py-2 px-4 border-b text-left align-top">
                                Produkty
                            </th>
                            <th className="py-2 px-4 border-b text-left align-top">
                                Celkové Množství
                            </th>
                            <th className="py-2 px-4 border-b text-left align-top">
                                Celková cena
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="py-2 px-4 border-b">
                                    {order.id}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {order.items.map((item, idx) => (
                                        <div key={idx}>
                                            {item.title} (x{item.quantity})
                                        </div>
                                    ))}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {order.items.reduce(
                                        (total, item) => total + item.quantity,
                                        0
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {order.items
                                        .reduce(
                                            (total, item) =>
                                                total +
                                                item.price * item.quantity,
                                            0
                                        )
                                        .toFixed(2)}
                                    Kč
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
