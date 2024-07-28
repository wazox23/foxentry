"use client";
import React, { useState } from "react";
import { fetchProducts, fetchProductsByCategory } from "../api/api";

interface ProductFilterProps {
    setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ setProducts }) => {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const categories = [
        { key: "all", name: "Všechny produkty" },
        { key: "electronics", name: "Elektronika" },
        { key: "jewelery", name: "Šperky" },
        { key: "men's clothing", name: "Pánské oblečení" },
        { key: "women's clothing", name: "Dámské oblečení" },
    ];
    // Změna kategorie produktů
    const handleCategoryChange = async (category: string) => {
        try {
            let products;
            if (category === "all") {
                products = await fetchProducts();
            } else {
                products = await fetchProductsByCategory(category);
            }
            setProducts(products);
            setActiveCategory(category);
        } catch (error) {
            console.error("Failed to fetch products by category", error);
        }
    };

    return (
        <div className="flex justify-end mb-4">
            <div className="space-x-4">
                {categories.map((category) => (
                    <button
                        key={category.key}
                        onClick={() => handleCategoryChange(category.key)}
                        className={`px-4 py-2 rounded bg-primary text-white ${
                            activeCategory === category.key
                                ? "bg-opacity-70"
                                : "bg-opacity-100"
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductFilter;
