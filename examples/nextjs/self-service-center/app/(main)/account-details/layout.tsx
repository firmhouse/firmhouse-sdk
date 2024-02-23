import React from 'react';
import { Header } from '../Header';

export default function Layout(props: {
  children: React.ReactNode;
  editDetails: React.ReactNode;
  paymentMethod: React.ReactNode;
  editAddresses: React.ReactNode;
}) {
  return (
    <>
      <Header
        title="Your account details"
        byline="Update your details & payment method"
      />

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
