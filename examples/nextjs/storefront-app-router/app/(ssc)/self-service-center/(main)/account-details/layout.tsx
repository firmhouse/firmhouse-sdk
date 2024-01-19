import React from 'react';

export default function Layout(props: {
  children: React.ReactNode;
  editDetails: React.ReactNode;
  paymentMethod: React.ReactNode;
  editAddresses: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs">
        <div className="container mx-auto max-w-2xl pt-16 pb-8 -mb-8">
          <div className="mb-5 mt-12">
            <h1 className="text-2xl font-semibold">Your account details</h1>
            <p className="text-sm opacity-75">
              Update your details & payment method
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 container max-w-5xl mx-auto p-4">
        <div className="col-span-full lg:col-span-2 order-2 lg:order-1">
          {props.editDetails}
          {props.paymentMethod}
        </div>

        <div className="col-span-full lg:col-span-2 order-1 log:order-2">
          {props.editAddresses}
        </div>
      </div>
    </>
  );
}
