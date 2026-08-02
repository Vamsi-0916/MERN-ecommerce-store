import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState([]);
  const [page, setPage] = useState(1);

  const {
    data: paginatedData,
    isLoading: pageLoading,
  } = useGetProductsQuery({
    pageNumber: page,
  });

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio: priceRange,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const searchValue = searchTerm.trim().toLowerCase();
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        const matchesSearch =
          !searchValue ||
          product.name?.toLowerCase().includes(searchValue) ||
          product.brand?.toLowerCase().includes(searchValue) ||
          product.description?.toLowerCase().includes(searchValue);

        const matchesBrand = !selectedBrand || product.brand === selectedBrand;

        return matchesSearch && matchesBrand;
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [
    dispatch,
    filteredProductsQuery.data,
    filteredProductsQuery.isLoading,
    searchTerm,
    selectedBrand,
  ]);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const applyPriceFilter = () => {
    const fromPrice = minPrice === "" ? 0 : Number(minPrice);
    const toPrice = maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

    setPriceRange([fromPrice, toPrice]);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setPriceRange([]);
    dispatch(setChecked([]));
  };

  return (
    <>
      <div className="ml-16 mr-4">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Search
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex ietms-center mr-4">
                    <input
                      type="checkbox"
                      id={c._id}
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor={c._id}
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand}>
                  <div className="flex items-enter mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      checked={selectedBrand === brand}
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />

                    <label
                      htmlFor={brand}
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem] space-y-3">
              <input
                type="number"
                min="0"
                placeholder="From price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
              <input
                type="number"
                min="0"
                placeholder="To price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white"
                onClick={applyPriceFilter}
              >
                Apply
              </button>
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProductsQuery.isLoading ? (
                <Loader />
              ) : products.length === 0 ? (
                <p className="p-3 text-gray-400">No products found.</p>
              ) : (
                products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
