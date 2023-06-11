import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DropdownProps {
  languages: string[];
  setSelectedLanguage: (language: string) => void;
  selectedLanguage: string | null;
}

export default function Dropdown({
  languages,
  setSelectedLanguage,
  selectedLanguage,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left font-mono">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm">
          {selectedLanguage || "Select Language"}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md gradient_bg shadow-lg focus:outline-none">
          <div className="">
            {languages.map((language) => (
              <Menu.Item key={language}>
                {({ active }) => (
                  <div
                    onClick={() => setSelectedLanguage(language)}
                    className={classNames(
                      active ? "bg-gray-100 text-black" : "text-white",
                      "block px-4 py-2 text-sm rounded-md"
                    )}
                  >
                    {language}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
