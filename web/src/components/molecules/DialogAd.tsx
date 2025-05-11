import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "../atoms/Dialog";
import { useAtom } from "jotai";
import { isAdDialogOpenAtom } from "../../store/index";
import { Icon, IconName } from "../atoms/Icon";

interface DialogAdProps {}

export const DialogAd: FC<DialogAdProps> = ({}) => {
  const [isOpen, setIsOpen] = useAtom(isAdDialogOpenAtom);
  const contents: { title: string; description: string; icon: IconName }[] = [
    {
      title: "High Impressions",
      description: "Get access to 7000+ 3d printer users per month.",
      icon: "analytics",
    },
    {
      title: "Niche but Right Audience",
      description: "Only 3d printer enthusiasts will look your Ads.",
      icon: "nozzle",
    },
    {
      title: "Hand Crafted Ads",
      description: "We create perfect looking Ads. You only provide assets.",
      icon: "pen",
    },
  ];
  const handleMailClick = () => {
    window.location.href =
      "mailto:info@bento3d.com?subject=Advertise on Bento3D";
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="max-w-sm"
    >
      <div className=" relative overflow-hidden rounded-md px-8 py-12 flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-center bg-[linear-gradient(90.95deg,#FFFFFF_26.2%,#C0C0C0_63.92%,#EFEFEF_85.84%)] bg-clip-text text-transparent">
          Advertise on Bento3D
        </h2>
        {contents.map((content) => (
          <div
            className="flex gap-2 items-center text-content-dark-h-a"
            key={content.title}
          >
            <Icon name={content.icon} className="size-8" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <p className="text-content-dark-m-a text-sm">
                {content.description}
              </p>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <button
            className="b-button flex gap-2 items-center justify-center bg-content-dark-h-a w-fit mx-auto px-4 hover:bg-[rgba(255,255,255,1)]"
            onClick={handleMailClick}
          >
            <Icon name="mail" className="size-6" />
            <span>Get in touch</span>
          </button>
          <p className="text-sm text-content-dark-m-a text-center">
            You can reach us at{" "}
            <a
              href="mailto:inbox.toaster@gmail.com?subject=Advertise on Bento3D"
              className="font-semibold underline hover:text-content-dark-h-a"
            >
              inbox.toaster@gmail.com
            </a>
          </p>
        </div>
        <div
          className="size-8 flex items-center justify-center absolute top-4 right-4 cursor-pointer bg-content-dark-xl-a rounded-full hover:scale-110"
          onClick={() => setIsOpen(false)}
        >
          <Icon name="close" className="text-content-dark-h-a" />
        </div>
        <img
          src="/images/bg-ad.png"
          alt=""
          className="absolute inset-0 -z-10 h-full object-fill"
        />
      </div>
    </Dialog>
  );
};

export default DialogAd;
