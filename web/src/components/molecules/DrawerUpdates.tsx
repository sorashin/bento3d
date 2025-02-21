import React, { FC } from "react";
import { useAtom } from "jotai";
import { isUpdatesDrawerOpenAtom } from "../../store/index";
import { Drawer } from "../atoms/Drawer";
import updates from "../../assets/jsons/updates.json";
import { Icon } from "../atoms/Icon";

interface DrawerUpdatesProps {}

interface Update {
  title: string;
  image: string;
  date: string;
  style?: string;
}

export const DialogFeedback: FC<DrawerUpdatesProps> = ({}) => {
  const [isOpen, setIsOpen] = useAtom(isUpdatesDrawerOpenAtom);
  const sortedUpdates = updates.sort((a: Update, b: Update) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const groupedUpdates = sortedUpdates.reduce(
    (acc: { [key: string]: Update[] }, update: Update) => {
      const month = new Date(update.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(update);
      return acc;
    },
    {},
  );

  const renderMedia = (image: string, title: string) => {
    const extension = image.split(".").pop() || "";
    if (extension === "mp4") {
      return (
        <video src={image} className="w-full h-auto" loop autoPlay muted />
      );
    } else if (["gif", "png", "jpg"].includes(extension)) {
      return <img src={image} alt={title} className="w-full h-auto" />;
    }
    return null;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="max-w-sm bg-transparent overflow-y-auto"
    >
      <div className="w-full h-full p-8">
        <h3 className="text-center mb-6 font-display text-xl">UPDATEs</h3>
        <p className="mb-8 text-content-m-a text-center text-sm">
          Bento3D keeps evolving, <br />
          making your 3D printing life even better.
        </p>

        <div className="flex flex-col gap-4">
          {Object.entries(groupedUpdates).map(([month, updates], index) => (
            <div key={index} className="grid grid-cols-[auto_1fr] gap-2">
              <div className="grid grid-rows-[auto_1fr] gap-1 h-full justify-items-center">
                <span className="size-1 rounded-full bg-content-h-a my-[10px] relative">
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[1px] border-content-m size-3 rounded-full"></span>
                </span>
                <span className="h-full w-[1px] bg-gradient-to-b from-content-m-a to-content-xxl-a"></span>
              </div>
              <div>
                <h4 className="font-bold text-content-h text-left mb-2 h-6">
                  {month}
                </h4>
                <ul>
                  {updates.map((update: Update, idx: number) => (
                    <li
                      key={idx}
                      className={`mb-4 bg-content-h rounded-sm shadow-md relative ${update.image ? "p-0" : "p-4"} overflow-hidden`}
                    >
                      <h5
                        className={`font-bold ${update.image ? "absolute" : "relative"} ${update.style ? update.style : "left-4 bottom-4 text-white"}`}
                      >
                        {update.title}
                      </h5>
                      {update.image && renderMedia(update.image, update.title)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div
          className="size-8 flex items-center justify-center absolute top-4 right-4 cursor-pointer bg-content-xl-a rounded-full hover:scale-110"
          onClick={() => setIsOpen(false)}
        >
          <Icon name="close" />
        </div>
      </div>
    </Drawer>
  );
};

export default DialogFeedback;
