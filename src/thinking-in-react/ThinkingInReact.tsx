import React from "react";

const ProductCategoryRow: React.FC<{ category: string }> = ({ category }) => {
    return (
        <tr>
            <th colSpan={2}>{category}</th>
        </tr>
    );
};

type Product = {
    category: string;
    price: number;
    stock: number;
    name: string;
};

const ProductRow: React.FC<{ product: Product }> = ({
    product: { name, price, stock },
}) => {
    const inStock = stock > 0;
    const productName = inStock ? (
        name
    ) : (
        <span style={{ color: "red" }}>{name}</span>
    );

    return (
        <tr>
            <td>{productName}</td>
            <td>${price}</td>
        </tr>
    );
};

const ProductTable: React.FC<{
    products: Product[];
    searchText: string;
    inStockOnly: boolean;
}> = ({ products, searchText, inStockOnly }) => {
    const rows: React.ReactElement[] = [];
    let lastCategory: string | null = null;

    products.forEach((product: Product) => {
        // filter out product that don't contain the search text
        if (!product.name.toLowerCase().includes(searchText.toLowerCase())) {
            return;
        }

        // filter out products that are not in stock
        if (inStockOnly && product.stock === 0) {
            return;
        }

        if (product.category !== lastCategory) {
            rows.push(
                <ProductCategoryRow
                    category={product.category}
                    key={product.category}
                />,
            );
        }
        rows.push(<ProductRow product={product} key={product.name} />);
        lastCategory = product.category;
    });

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};

const SearchBar: React.FC<{
    searchText: string;
    inStockOnly: boolean;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setInStockOnly: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ searchText, inStockOnly, setSearchText, setInStockOnly }) => {
    return (
        <form>
            <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <label>
                <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                />{" "}
                Only show products in stock
            </label>
        </form>
    );
};

const FilterableProductTable: React.FC<{ products: Product[] }> = ({
    products,
}) => {
    const [searchText, setSearchText] = React.useState<string>("");
    const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);

    return (
        <div>
            <SearchBar
                searchText={searchText}
                inStockOnly={inStockOnly}
                setSearchText={setSearchText}
                setInStockOnly={setInStockOnly}
            />
            <ProductTable
                products={products}
                searchText={searchText}
                inStockOnly={inStockOnly}
            />
        </div>
    );
};

const PRODUCTS: Product[] = [
    { category: "Fruits", price: 1, stock: 1, name: "Apple" },
    { category: "Fruits", price: 1, stock: 5, name: "Dragonfruit" },
    { category: "Fruits", price: 2, stock: 0, name: "Passionfruit" },
    { category: "Vegetables", price: 2, stock: 12, name: "Spinach" },
    { category: "Vegetables", price: 4, stock: 3, name: "Pumpkin" },
    { category: "Vegetables", price: 1, stock: 0, name: "Peas" },
];

export default function ThinkingInReact() {
    return <FilterableProductTable products={PRODUCTS} />;
}
