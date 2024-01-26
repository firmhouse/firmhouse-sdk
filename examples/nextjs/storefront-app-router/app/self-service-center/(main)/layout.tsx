import { TabBar } from '@firmhouse/ui-components';
import { GoBackLink } from './GoBackLink';

export default function SSCLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs lg:text-sm mt-12">
        <div className="fixed w-full top-12 bg-gray-900 z-50 border-b border-gray-700 ">
          <div className="mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="text-left order-2 lg:w-1/3">
                Self Service Center
              </div>
              <GoBackLink className="lg:hidden text-left order-1 w-1/3 lg:w-0" />
              <div className="space-x-8 hidden lg:inline-flex order-3 whitespace-nowrap max-w-2xl mx-auto">
                <TabBar
                  tabs={[
                    { href: '/self-service-center', label: 'Subscription' },
                    { href: '/self-service-center/orders', label: 'Orders' },
                    {
                      href: '/self-service-center/invoices',
                      label: 'Invoices',
                    },
                    {
                      href: '/self-service-center/account-details',
                      label: 'Account details',
                    },
                  ]}
                />
              </div>
              <div className="flex items-center justify-end w-1/3 order-4">
                <form action="/self-service-center/token-login" method="delete">
                  <input
                    type="submit"
                    value="Logout"
                    className="text-white opacity-75 cursor-pointer hover:underline hover:text-white hover:opacity-100"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
