import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import Product from "./Products/Product.jsx";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="ml-20 px-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="bg-pink-600 px-10 py-3 rounded-full font-bold hover:bg-pink-700 transition"
              >
                Shop
              </Link>
            </div>

            <div>
              <div className="grid grid-cols-4 gap-6 mt-8">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;