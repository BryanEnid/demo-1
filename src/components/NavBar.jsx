import React from "react";
import { Button } from "@/chadcn/Button";
import { Icon } from "@iconify/react";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/chadcn/DropDown";
import { Typography } from "@/chadcn/Typography";
import { Input } from "@/chadcn/Input";
import { MediaSelector } from "./MediaSelector";
import { Textarea } from "@/chadcn/TextArea";

export const NavBar = () => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [bucketName, setBucketName] = React.useState("");
  const [bucketDescription, setBucketDescription] = React.useState("");

  const inputRef = React.useRef();

  const handleCreateBucket = () => {
    navigate("/profile/buckets");
    setShow(true);
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <DropdownMenu>
      <div className="h-20 w-full" />
      <nav className=" flex fixed top-0 left-0 flex-row w-full h-20 items-center justify-end p-8 gap-8 text-gray-600 bg-white">
        <button>Career portal</button>
        <button>Explore companies</button>
        <button>Observatory</button>

        <Button onClick={handleCreateBucket}>Create Buckets</Button>

        <DropdownMenuTrigger>
          <Button variant="link" className="p-0 m-0">
            Nikola Tesla
            <Icon icon="iconamoon:arrow-down-2-duotone" height={22} />
          </Button>
        </DropdownMenuTrigger>
      </nav>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Modal
        show={show}
        title="Create a bucket"
        onClose={handleCancel}
        initialFocus={inputRef}
        disabled={![bucketName.length, bucketDescription.length].every(Boolean)}
        onChange={() => {}}
      >
        <div style={{ width: 600 }} />

        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col text-center gap-4 text-white">
            <div className="flex justify-center items-center aspect-square w-36 rounded-full p-1 overflow-hidden bg-white shadow-sm">
              <Icon icon="entypo:video" className="text-6xl" />
            </div>
            <Typography variant="large">{bucketName || "Title"}</Typography>
          </div>

          <Input
            className="bg-white"
            ref={inputRef}
            value={bucketName}
            placeholder="Bucket name"
            onChange={({ target }) => setBucketName(target.value)}
          />

          <Textarea
            className="bg-white"
            value={bucketDescription}
            placeholder="Description"
            onChange={({ target }) => setBucketDescription(target.value)}
          />

          {/* {false && <MediaSelector onChange={() => {}} />} */}
        </div>
      </Modal>
    </DropdownMenu>
  );
};
