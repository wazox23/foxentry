"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts, updateProduct, Product } from "../api/api";
import Link from "next/link";

const AdminProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editedPrice, setEditedPrice] = useState<number | null>(null);
    const [editedCount, setEditedCount] = useState<number | null>(null);
    const [editedHidden, setEditedHidden] = useState<boolean | null>(null);

    useEffect(() => {
        //Načtení produktů
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        getProducts();
    }, []);
    //Editace produktu
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setEditedPrice(product.price);
        setEditedCount(product.rating.count);
        setEditedHidden(product.hidden ?? false);
    };
    //Uložení upraveného produktu
    const handleSave = async (productId: number) => {
        if (editingProduct) {
            try {
                const updatedProduct = {
                    ...editingProduct,
                    price: editedPrice ?? editingProduct.price,
                    rating: {
                        count: editedCount ?? editingProduct.rating.count,
                    },
                    hidden: editedHidden ?? editingProduct.hidden,
                };

                await updateProduct(productId, updatedProduct);

                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === productId ? updatedProduct : product
                    )
                );

                setEditingProduct(null);
                setEditedPrice(null);
                setEditedCount(null);
                setEditedHidden(null);
            } catch (error) {
                console.error("Failed to update product", error);
            }
        }
    };

    return (
        <div className="bg-gray-200 min-h-screen p-8 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-bold text-black">
                    Evidence produktů
                </h2>
                <Link href="/admin">
                    <button className="bg-primary text-white px-4 py-2 rounded">
                        Zpět
                    </button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 text-black">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">
                                Název
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                                Cena
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                                Skladem
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                                Skryté
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                                Akce
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="py-2 px-4 border-b">
                                    {product.id}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {product.title}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editingProduct?.id === product.id ? (
                                        <input
                                            type="number"
                                            value={editedPrice ?? ""}
                                            onChange={(e) =>
                                                setEditedPrice(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        `${Math.round(product.price)} Kč`
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editingProduct?.id === product.id ? (
                                        <input
                                            type="number"
                                            value={editedCount ?? ""}
                                            onChange={(e) =>
                                                setEditedCount(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        product.rating.count
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editingProduct?.id === product.id ? (
                                        <input
                                            type="checkbox"
                                            checked={editedHidden ?? false}
                                            onChange={(e) =>
                                                setEditedHidden(
                                                    e.target.checked
                                                )
                                            }
                                            className="border rounded"
                                        />
                                    ) : product.hidden ? (
                                        "Ano"
                                    ) : (
                                        "Ne"
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editingProduct?.id === product.id ? (
                                        <button
                                            onClick={() =>
                                                handleSave(product.id)
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded"
                                        >
                                            Uložit
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="bg-primary text-white px-4 py-2 rounded"
                                        >
                                            Upravit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
