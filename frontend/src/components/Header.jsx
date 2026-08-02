import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div className="ml-10">
        <div className="flex items-start justify-between ml-16 mr-8 mt-4">
          <div className="w-[42rem]">
            <div className="grid grid-cols-2 gap-4">
              {data.slice(0, 4).map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))}
            </div>
          </div>
          <ProductCarousel />
        </div>
      </div>
    </>
  );
};

export default Header;