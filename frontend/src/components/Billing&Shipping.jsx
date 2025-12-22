import React from "react";

export default function BillingShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#EAF7FC] py-12 px-5">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-[#DCE6EF] p-8">

        {/* MAIN HEADING */}
        <h2
          className="text-2xl font-bold text-white mb-8
                     bg-gradient-to-r from-[#0a4b78] to-[#2d92c8]
                     px-6 py-5 rounded-lg shadow-md text-center">
          Shipping, Delivery, Billing & Warranty Policy
        </h2>

        {/* CONTENT */}
        <div className="space-y-6 text-gray-700 leading-relaxed">

          <p className="font-medium text-[#0d3b66]">
            Divyansh Global RO
          </p>

          {/* SHIPPING DURATION */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            1. Shipping Duration
          </h2>

          <p className="font-semibold">How long will delivery take?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Most orders are dispatched within 2–3 business days.</li>
            <li>Delivery time varies depending on your location.</li>
            <li>Most packages reach customers within 10–15 days.</li>
          </ul>

          <p className="font-semibold mt-4">How can I track my order?</p>
          <p>
            Once your order is shipped, you will receive an email containing:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Courier company name</li>
            <li>AWB No. / Docket No.</li>
          </ul>
          <p>
            You can track your shipment on the courier company’s official website.
          </p>

          <p className="font-semibold mt-4">Delivery Timings</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Deliveries are made between 9:00 AM – 7:00 PM (business hours).</li>
          </ul>

          <p className="font-semibold mt-4">
            Will I receive an exact delivery time?
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Couriers deliver anytime during working hours.</li>
            <li>
              For precise timing, you may contact the courier company directly.
            </li>
          </ul>

          {/* DELIVERY POLICY */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            2. Delivery Policy
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>
              Every shipment requires an adult’s signature at the time of delivery.
            </li>
            <li>
              If you request an address change after placing the order, the shipment
              will be held at the nearest courier branch for self-pickup.
            </li>
            <li>
              You may request branch or dealer details for collection.
            </li>
          </ul>

          <p className="font-semibold mt-4">
            If you are not available at the time of delivery:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              The courier will leave a delivery card with rescheduling instructions.
            </li>
          </ul>

          <p className="font-semibold mt-4">
            Can someone else sign on my behalf?
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>A household member may sign the parcel.</li>
            <li>They may be asked for valid identification proof.</li>
          </ul>

          {/* PARTIAL SHIPMENTS */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            3. Partial Shipments
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>
              You may order multiple items from www.divyanshglobalro.com in a single order.
            </li>
            <li>
              If an item is out of stock, it will not be shipped with available items.
            </li>
            <li>This is known as a Partial Shipment.</li>
            <li>No extra shipping charges apply for remaining items.</li>
          </ul>

          {/* OUT OF STOCK */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            4. Out-of-Stock Items
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>
              Out-of-stock items will be shipped separately once available.
            </li>
            <li>No additional shipping charges will be applied.</li>
          </ul>

          {/* WARRANTY */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            5. Warranties & Guarantees
          </h2>

          <ul className="list-disc list-inside space-y-2">
            <li>
              All products sold on www.divyanshglobalro.com come with a manufacturer’s warranty.
            </li>
            <li>
              Warranty duration and coverage are mentioned on each product’s description page.
            </li>
          </ul>

          {/* OVERVIEW */}
          <h2 className="text-xl font-semibold text-[#0d3b66]">
            6. Billing & Shipping Policy Overview
          </h2>

          <p>
            At Divyansh Global RO, we maintain complete transparency to avoid confusion.
            Our Billing & Shipping Policy provides customers with clear information about:
          </p>

          <ul className="list-disc list-inside space-y-1">
            <li>Shipping and delivery timelines</li>
            <li>Order tracking process</li>
            <li>Delivery requirements and conditions</li>
            <li>Handling of partial and out-of-stock items</li>
            <li>Warranty and guarantee details</li>
          </ul>

          <p className="font-medium">
            Our goal is to ensure a smooth, reliable, and hassle-free shopping experience
            for all our customers.
          </p>

        </div>
      </div>
    </div>
  );
}