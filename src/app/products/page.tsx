// /app/products/page.tsx
import React from "react";
import ProductList from "../components/ProductList";

const ProductsPage: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            <main className="p-4">
                <ProductList />
            </main>
        </div>
    );
};

export default ProductsPage;
