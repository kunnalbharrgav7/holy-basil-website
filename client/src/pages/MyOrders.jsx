import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ArrowRight, RotateCcw } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getMyOrders } from "../services/orderService";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading)
    return (
      <main className="min-h-screen py-20 bg-[#080D0A]">
        <div className="container-hba text-center text-[#F5F2EB]/50">
          Loading your orders...
        </div>
      </main>
    );
  if (error)
    return (
      <main className="min-h-screen py-20 bg-[#080D0A]">
        <div className="container-hba text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </main>
    );

  const handleReorder = (orderItems) => {
    orderItems.forEach((item) => {
      const productObj = {
        _id: item.product?._id || item.product,
        name: item.name,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        wholesalePrice: item.wholesalePrice,
        images: item.product?.images || [],
        category: item.product?.category || "",
      };
      addToCart(productObj, item.quantity || 1);
    });
    navigate("/cart");
  };

  return (
    <main className="min-h-screen py-16 md:py-24 bg-[#080D0A] text-[#F5F2EB]">
      <div className="container-hba max-w-5xl mx-auto px-4">
        <span className="eyebrow text-emerald-400/80">Your account</span>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-white">
          My orders.
        </h1>

        {!orders.length ? (
          <div className="mt-10 p-12 text-center rounded-[2.5rem] bg-[#121E1A] border border-emerald-900/30 shadow-lg">
            <Package size={48} className="mx-auto text-emerald-500/30" />
            <h2 className="mt-6 font-serif text-3xl text-white">
              No orders yet.
            </h2>
            <p className="mt-3 text-sm text-[#F5F2EB]/50">
              Your Ayurvedic journey starts with your first order.
            </p>
            <Link
              to="/products"
              className="btn-primary mt-8 inline-flex px-8 py-3.5"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-[2.5rem] bg-[#121E1A] p-6 md:p-8 border border-emerald-900/30 shadow-md hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.16em] text-emerald-400/60">
                      Order
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="mt-1.5 text-xs text-[#F5F2EB]/40">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-[10px] font-bold tracking-wider uppercase border ${order.orderStatus === "Delivered" ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/30" : "bg-[#080D0A] text-white border-emerald-900/50"}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`rounded-full px-4 py-2 text-[10px] font-bold tracking-wider uppercase border ${order.paymentStatus === "Paid" ? "bg-emerald-900/40 text-emerald-400 border-emerald-500/30" : "bg-amber-900/30 text-amber-400 border-amber-500/30"}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-emerald-900/30 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-xs text-[#F5F2EB]/50">
                        {order.items?.length || 0} product
                        {(order.items?.length || 0) !== 1 ? "s" : ""}
                      </p>
                      <p className="mt-1 font-serif text-2xl font-bold text-emerald-300">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => handleReorder(order.items)}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-900/20 px-5 py-2.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-500"
                      >
                        <RotateCcw size={14} /> Reorder
                      </button>
                      <Link
                        to={`/order-success/${order._id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        View order <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
