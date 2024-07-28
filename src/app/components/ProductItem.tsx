import React from "react";
import { useCart } from "../CartContext";
import { SnackbarProvider, useSnackbar } from "notistack";

interface ProductItemProps {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

const ProductItemContent: React.FC<ProductItemProps> = ({
    id,
    title,
    price,
    description,
    category,
    image,
}) => {
    const { dispatch } = useCart();
    const { enqueueSnackbar } = useSnackbar();

    const addToCart = () => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {
                id,
                title,
                price,
                description,
                category,
                image,
                quantity: 1,
            },
        });
        enqueueSnackbar("Produkt byl úspěšně přidán do košíku!", {
            variant: "success",
        });
    };

    return (
        <div className="bg-white border rounded-lg p-4 flex flex-col items-center h-full shadow-md">
            <img
                src={image}
                alt={title}
                className="w-48 h-48 object-contain mb-4"
            />
            <div className="flex flex-col flex-grow justify-between text-center">
                <h2 className="text-xl font-bold mb-2 text-black">{title}</h2>
                <p className="text-gray-700 mb-2 text-start">{description}</p>
                <p className="text-green-500 text-lg font-bold mb-4">
                    {Math.round(price)} Kč
                </p>
            </div>
            <button
                onClick={addToCart}
                className="bg-primary text-white px-4 py-2 rounded mt-auto"
            >
                Přidat do košíku
            </button>
        </div>
    );
};

const ProductItem: React.FC<ProductItemProps> = (props) => (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <ProductItemContent {...props} />
    </SnackbarProvider>
);

export default ProductItem;
