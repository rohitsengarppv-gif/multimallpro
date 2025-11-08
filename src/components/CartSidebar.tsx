"use client";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../contexts/CartContext";

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <button 
              onClick={onClose}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Free Shipping Banner */}
            {subtotal < 100 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 text-center text-sm">
                <span className="font-semibold">
                  Add ${(100 - subtotal).toFixed(2)} more for FREE shipping! 🚚
                </span>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      {item.discount && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{item.brand}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex text-black items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* Promo Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You saved</span>
                    <span className="font-medium">-${savings.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-3">
                <button className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}
