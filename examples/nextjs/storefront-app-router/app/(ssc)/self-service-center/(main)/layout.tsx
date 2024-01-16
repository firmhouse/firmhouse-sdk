import { TabBar } from '@firmhouse/ui-components';

export default function SSCLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-gray-900 text-center items-center text-white text-xs lg:text-sm mt-12">
        <div className="fixed w-full top-12 bg-gray-900 z-50 border-b border-gray-700 ">
          <div className="mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="text-left order-2 lg:w-1/3"></div>
              <div className="lg:hidden text-left order-1 w-1/3 lg:w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="w-6 text-white"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div className="space-x-8 hidden lg:inline-flex order-3 whitespace-nowrap max-w-2xl mx-auto">
                <TabBar
                  tabs={[
                    { href: '/self-service-center', label: 'Home' },
                    { href: '/self-service-center/orders', label: 'Orders' },
                    {
                      href: '/self-service-center/invoices',
                      label: 'Invoices',
                    },
                    {
                      href: '/self-service-center/account-details',
                      label: 'Account Details',
                    },
                  ]}
                />
              </div>

              <div className="flex items-center justify-end w-1/3 order-4">
                <form action="/self-service-center/token-login" method="delete">
                  <input
                    type="submit"
                    value="Logout"
                    className="text-white opacity-75 hover:underline hover:text-white hover:opacity-100"
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
