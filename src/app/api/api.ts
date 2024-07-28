const API_BASE_URL = "https://fakestoreapi.com";
const MOCK_API_BASE_URL = "https://66a508aa5dc27a3c190a79f1.mockapi.io";
const PRICE_STORAGE_KEY = "product_prices";
const HIDDEN_STORAGE_KEY = "product_hidden";

const EXCHANGE_RATE_USD_TO_CZK = 23;

export interface OrderItem {
    productId: number;
    quantity: number;
    title: string;
    price: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        count: number;
    };
    hidden?: boolean;
}

export const convertUsdToCzk = (priceInUsd: number): number => {
    return Math.round(priceInUsd * EXCHANGE_RATE_USD_TO_CZK);
};

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const products: Product[] = await response.json();

    const storedPrices = JSON.parse(
        localStorage.getItem(PRICE_STORAGE_KEY) || "{}"
    );

    const storedHidden = JSON.parse(
        localStorage.getItem(HIDDEN_STORAGE_KEY) || "{}"
    );

    return products.map((product) => ({
        ...product,
        price: storedPrices[product.id] || convertUsdToCzk(product.price),
        hidden: storedHidden[product.id] || false,
    }));
};

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${MOCK_API_BASE_URL}/cartItem`);
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    const products = await fetchProducts();

    return data.map((order: any) => ({
        ...order,
        items: order.items.map((item: any) => ({
            ...item,
            ...products.find((product: any) => product.id === item.productId),
        })),
    }));
};

export const createOrder = async (order: any): Promise<Order> => {
    const response = await fetch(`${MOCK_API_BASE_URL}/cartItem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error("Failed to create order");
    }
    return response.json();
};

export const updateOrder = async (
    orderId: string,
    order: any
): Promise<Order> => {
    const response = await fetch(`${MOCK_API_BASE_URL}/cartItem/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error("Failed to update order");
    }
    return response.json();
};

export const fetchProductsByCategory = async (
    category: string
): Promise<Product[]> => {
    const response = await fetch(
        `${API_BASE_URL}/products/category/${category}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch products for category: ${category}`);
    }
    return response.json();
};

export const updateProduct = async (
    productId: number,
    updatedProduct: Product
): Promise<Product> => {
    saveProductPrice(productId, updatedProduct.price);
    saveProductHiddenStatus(productId, updatedProduct.hidden);

    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            rating: { count: updatedProduct.rating.count },
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to update product count");
    }
    return response.json();
};

export const saveProductPrice = (productId: number, price: number): void => {
    const storedPrices = JSON.parse(
        localStorage.getItem(PRICE_STORAGE_KEY) || "{}"
    );
    storedPrices[productId] = price; // Store the price as it is
    localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(storedPrices));
};

export const saveProductHiddenStatus = (
    productId: number,
    hidden?: boolean
): void => {
    const storedHidden = JSON.parse(
        localStorage.getItem(HIDDEN_STORAGE_KEY) || "{}"
    );
    storedHidden[productId] = hidden;
    localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(storedHidden));
};

export const clearCart = async (): Promise<void> => {
    const response = await fetch(`${MOCK_API_BASE_URL}/cartItem`);
    if (!response.ok) {
        throw new Error("Failed to fetch cart items");
    }
    const cartItems = await response.json();
    const deletePromises = cartItems.map((item: any) =>
        fetch(`${MOCK_API_BASE_URL}/cartItem/${item.id}`, {
            method: "DELETE",
        })
    );
    await Promise.all(deletePromises);
};
