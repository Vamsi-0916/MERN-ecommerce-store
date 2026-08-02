import { Link } from "react-router-dom";
import moment from "moment";
import { useMemo, useState } from "react";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    if (!searchValue) return products || [];

    return (products || []).filter((product) => {
      const categoryName =
        typeof product.category === "object" ? product.category?.name : "";

      return (
        product.name?.toLowerCase().includes(searchValue) ||
        product.brand?.toLowerCase().includes(searchValue) ||
        product.description?.toLowerCase().includes(searchValue) ||
        categoryName?.toLowerCase().includes(searchValue) ||
        product.price?.toString().includes(searchValue)
      );
    });
  }, [products, searchTerm]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="container mx-[9rem]">
        <div className="flex flex-col  md:flex-row">
          <div className="p-3 w-full">
            <div className="ml-[2rem] mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-xl font-bold">
                All Products ({filteredProducts.length})
              </div>
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-black md:w-[20rem]"
              />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {filteredProducts.length === 0 ? (
                <p className="ml-[2rem] text-gray-400">No products found.</p>
              ) : (
                filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block overflow-hidden w-full"
                >
                  <div className="flex w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[10rem] h-[10rem] object-cover shrink-0"
                    />
                    <div className="p-4 flex flex-col justify-around flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h5 className="text-xl font-semibold mb-2">
                          {product?.name}
                        </h5>

                        <p className="text-gray-400 text-xs">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      <p className="text-gray-400 w-full text-sm mb-4">
                        {product?.description?.substring(0, 160)}...
                      </p>

                      <div className="flex justify-between">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p>$ {product?.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
                ))
              )}
            </div>
          </div>
        <AdminMenu />
        </div>
      </div>
    </>
  );
};

export default AllProducts;
