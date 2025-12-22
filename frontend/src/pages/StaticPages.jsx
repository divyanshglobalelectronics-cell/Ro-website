import React from "react";

function Wrapper({ title, children }) {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="prose max-w-none">{children || <p>Content coming soon.</p>}</div>
      </div>
    </div>
  );
}

export function RoUninstallation() {
  return <Wrapper title="RO Uninstallation" />;
}

export function AMCPlans() {
  return <Wrapper title="AMC Plans" />;
}

export function RoRepairMaintenance() {
  return <Wrapper title="RO Repair & Maintenance" />;
}

export function OurTechnicians() {
  return <Wrapper title="Our Technicians" />;
}

export function ServiceNetworkPage() {
  return <Wrapper title="Service Network" />;
}

export function BlogsPage() {
  return <Wrapper title="Blogs" />;
}

export function ProfessionalsPage() {
  return <Wrapper title="For Professionals" />;
}

export function StoreLocatorPage() {
  return <Wrapper title="Store Locator" />;
}

export function BusinessPage() {
  return <Wrapper title="Business" />;
}

export function TechnologyPage() {
  return <Wrapper title="Technology" />;
}

export function TrackOrderPage() {
  return <Wrapper title="Track Your Order" />;
}

export function RegisterWarrantyPage() {
  return <Wrapper title="Register Warranty Card" />;
}

export function VendorPolicyPage() {
  return <Wrapper title="Vendor Grievance Policy" />;
}

export function PurchaseOrderPage() {
  return <Wrapper title="Purchase Order Conditions" />;
}

export function ProcurementSOPPage() {
  return <Wrapper title="Procurement SOP" />;
}

export function InvestorRelationsPage() {
  return <Wrapper title="Investor Relations" />;
}

export function CodeOfConductPage() {
  return <Wrapper title="Code of Conduct" />;
}

export function ReturnRefundPolicyPage() {
  return <Wrapper title="Return & Refund Policy" />;
}
