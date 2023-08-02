import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { UserLogout } from "../../../Redux/userState";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Services", href: "#", current: false },
  { name: "Contact", href: "#", current: false },
];

function classNames(...classNamees) {
  return classNamees.filter(Boolean).join(" ");
}

export default function Example() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.UserName);
  const logout = () => {
    if(username){
      dispatch(UserLogout());
      navigate("/");
    }else{
      navigate('/login')
    }
    
  };
  const updatedNavigation = navigation.map((item, index) => ({
    ...item,
    current: index === activeIndex,
  }));
  const handleClick = (index, href) => {
    setActiveIndex(index);
    navigate(href);
  };
  return (
    <Disclosure as="nav" className="bg-gray-100">
      {({ open }) => (
        <>
          <div className="mx-4 sm:mx-8 max-w-full h-16  sm:px-10 lg:px-10">
            <div className="relative flex items-center  justify-between h-16">
              {/* NavBar Button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo (centered on small screens) */}
              <img
                className="h-10 w-auto sm:hidden"
                src="/loginpage/logo2.png"
                alt="My Company"
              />

              {/* Show the second logo for screens md and larger */}
              <img
                className="h-10 w-auto hidden sm:block"
                src="/loginpage/logo2.png"
                alt="My Company"
              />

              {/* Navigation (hidden on small screens) */}
              <div className="hidden md:block sm:ml-6">
                <div className="flex space-x-4">
                  {updatedNavigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(index, item.href);
                        if (item.name === "Home") {
                          navigate("/");
                        } else if (item.name === "Services") {
                          navigate("/Services");
                        } else if (item.name === "Contact") {
                            ("/"); //no contact page now
                        }
                      }}
                      className={classNames(
                        item.current
                          ? "bg-white-600 text-blue-600"
                          : "text-blue-600 hover:bg-gray-700 hover:text-red-700",
                        "rounded-md px-5 py-3 text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Notification and Profile */}
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  {/* ... Profile dropdown content ... */}
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="sm:h-9 w-9 rounded-full "
                        src="/loginpage/man.png"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href=""
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {username ? "Sign out" : "sign In"}
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {/* end of profile dropdown */}
                {/* <button
              type="button"
              className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button> */}
                {username ? (
                  <div>
                    <h3 className="text-gray-70000 ms-3 hidden sm:block text-xs sm:text-base md:text-base">
                      {username}
                    </h3>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-white ms-3 hidden sm:block text-base md:text-base">
                      UserName
                    </h3>
                  </div>
                )}

                <div className="hidden  sm:ml-6 sm:flex">
                  {/* Login button */}
                  {/* <button
    type="button" onClick={logout}
    className="border border-indigo-500 md:w-15 bg-indigo-500 text-white rounded-md px-4 py-1 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
  >
    Login
  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu content (hidden on large screens) */}
          <Disclosure.Panel className="md:hidden">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
