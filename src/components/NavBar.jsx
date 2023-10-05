import React from "react";
import { Button } from "@/chadcn/Button";
import { Icon } from "@iconify/react";

export const NavBar = () => {
  return (
    <nav className="flex fixed top-0 flex-row w-full h-20 items-center justify-end p-8 gap-8 text-gray-600 bg-white">
      <button>Career portal</button>
      <button>Explore companies</button>
      <button>Observatory</button>
      <Button> Create Buckets</Button>
      <Button variant="link" className="p-0 m-0">
        Nikola Tesla
        <Icon icon="iconamoon:arrow-down-2-duotone" height={22} />
      </Button>
    </nav>
  );
};
