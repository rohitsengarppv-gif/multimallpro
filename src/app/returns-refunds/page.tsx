"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { RotateCcw, Clock, CheckCircle, XCircle, Package, CreditCard, Truck, AlertCircle } from "lucide-react";

export default function ReturnsRefundsPage() {
  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Log into your account and select the item you want to return",
      icon: Package
    },
    {
      step: 2,
      title: "Print Label",
      description: "Download and print the prepaid return shipping label",
      icon: Truck
    },
    {
      step: 3,
      title: "Pack & Ship",
      description: "Package the item securely and drop it off at any shipping location",
      icon: RotateCcw
    },
    {
      step: 4,
      title: "Get Refund",
      description: "Receive your refund within 3-5 business days after we receive the item",
      icon: CreditCard
    }
  ];

  const returnPolicies = [
    {
      category: "Electronics",
      timeLimit: "30 days",
      conditions: "Must be in original packaging with all accessories",
      restockingFee: "15%",
      icon: "📱"
    },
    {
      category: "Clothing & Accessories",
      timeLimit: "60 days",
      conditions: "Must have original tags and be unworn",
      restockingFee: "None",
      icon: "👕"
    },
    {
      category: "Home & Garden",
      timeLimit: "45 days",
      conditions: "Must be unused and in original condition",
      restockingFee: "10%",
      icon: "🏠"
    },
    {
      category: "Books & Media",
      timeLimit: "30 days",
      conditions: "Must be in original condition",
      restockingFee: "None",
      icon: "📚"
    }
  ];

  const refundMethods = [
    {
      method: "Original Payment Method",
      timeframe: "3-5 business days",
      description: "Refund will be processed back to your original payment method",
      icon: CreditCard
    },
    {
      method: "Store Credit",
      timeframe: "Instant",
      description: "Receive store credit that can be used for future purchases",
      icon: Package
    },
    {
      method: "Exchange",
      timeframe: "5-7 business days",
      description: "Exchange for a different size, color, or similar item",
      icon: RotateCcw
    }
  ];

  const nonReturnableItems = [
    "Personalized or customized items",
    "Perishable goods (food, flowers, etc.)",
    "Intimate or sanitary goods",
    "Hazardous materials",
    "Digital downloads",
    "Gift cards",
    "Items damaged by misuse"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="h-10 w-10 text-rose-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Returns & Refunds</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to be completely satisfied with your purchase. If you're not happy, 
            we'll make it right with our hassle-free return policy.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">60</div>
            <div className="text-gray-600">Days to Return</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">Free</div>
            <div className="text-gray-600">Return Shipping</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">3-5</div>
            <div className="text-gray-600">Days for Refund</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-rose-600 mb-2">100%</div>
            <div className="text-gray-600">Money Back</div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How to Return an Item</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-rose-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-rose-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Policies by Category */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Return Policies by Category</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {returnPolicies.map((policy, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{policy.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{policy.category}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Window:</span>
                    <span className="font-semibold text-gray-900">{policy.timeLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restocking Fee:</span>
                    <span className="font-semibold text-gray-900">{policy.restockingFee}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Conditions:</span>
                    <p className="text-sm text-gray-700 mt-1">{policy.conditions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Methods */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Refund Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {refundMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="text-center p-6 border border-gray-200 rounded-xl">
                  <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.method}</h3>
                  <div className="text-rose-600 font-semibold mb-3">{method.timeframe}</div>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Non-Returnable Items */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Non-Returnable Items</h2>
            </div>
            <p className="text-gray-600 mb-6">
              For health, safety, and quality reasons, the following items cannot be returned:
            </p>
            <ul className="space-y-3">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="h-8 w-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">Important Notes</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Free Return Shipping</h3>
                  <p className="text-gray-600 text-sm">We provide prepaid return labels for all eligible returns.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Original Packaging</h3>
                  <p className="text-gray-600 text-sm">Items should be returned in their original packaging when possible.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Inspection Process</h3>
                  <p className="text-gray-600 text-sm">All returned items are inspected before refunds are processed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Processing Time</h3>
                  <p className="text-gray-600 text-sm">Refunds are processed within 3-5 business days after we receive your return.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I return an item without the original packaging?</h3>
                <p className="text-gray-600">While we prefer items to be returned in original packaging, we understand this isn't always possible. Contact our customer service team for assistance.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I received a damaged item?</h3>
                <p className="text-gray-600">If you received a damaged item, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I exchange an item for a different size or color?</h3>
                <p className="text-gray-600">Yes! You can exchange items for different sizes or colors. Simply initiate a return and place a new order, or contact customer service for assistance.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does it take to process a refund?</h3>
                <p className="text-gray-600">Once we receive your returned item, refunds are typically processed within 3-5 business days. The time for the refund to appear in your account depends on your payment method.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need to pay for return shipping?</h3>
                <p className="text-gray-600">No, we provide free return shipping labels for all eligible returns. Simply print the label and drop off your package at any shipping location.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I return items purchased with a discount or coupon?</h3>
                <p className="text-gray-600">Yes, you can return items purchased with discounts or coupons. The refund will be for the amount you actually paid after the discount was applied.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with a Return?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer service team is here to help you with any return or refund questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start a Return
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
