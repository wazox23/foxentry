"use client";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/api";
import ProductItem from "./ProductItem";
import ProductFilter from "./ProductFilter";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    hidden?: boolean;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    // Načtení produktů
    useEffect(() => {
        const getProducts = async () => {
            try {
                const data: Product[] = await fetchProducts();
                const visibleProducts = data.filter(
                    (product: Product) => !product.hidden
                );
                setProducts(visibleProducts);
            } catch (error) {
                console.error(error);
            }
        };

        getProducts();
    }, []);

    return (
        <div className="bg-gray-100 p-4 rounded-lg w-full">
            <ProductFilter setProducts={setProducts} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        description={product.description}
                        category={product.category}
                        image={product.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
