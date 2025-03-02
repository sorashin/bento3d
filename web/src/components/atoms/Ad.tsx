import { Icon } from "../atoms/Icon";
import { FC, useEffect, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import useAdVisibility from "../../hooks/useAdVisibility";
import { isAdDialogOpenAtom } from "../../../src/store";
import { useAtom } from "jotai";

// define type
type AdProps = {};

export const Ad: FC<AdProps> = () => {
  const [showAds, setShowAds] = useState(true);
  const [dialogOpen, setDialogOpen] = useAtom(isAdDialogOpenAtom);
  const onAdViewable = () => {
    ReactGA.event({
      category: "AdBanner",
      action: `ad_viewable`,
    });
  };
  const adRef = useAdVisibility(onAdViewable, 1000);

  useEffect(() => {
    if (showAds) {
      ReactGA.event({
        category: "AdBanner",
        action: `ad_impression`,
      });
    }
  }, []);
  if (!showAds) {
    return null;
  }
  return (
    <div className="mx-2 relative md:block hidden" ref={adRef}>
      <button
        onClick={() => setShowAds(false)}
        className="absolute top-2 right-2 rounded-full bg-content-l hover:scale-105 transition-all p-1"
      >
        <Icon name="close" className="size-3 stroke-[4px] text-content-m" />
      </button>
      <button
        className="rounded-sm overflow-hidden block"
        onClick={() => setDialogOpen(true)}
      >
        <img src="/images/ads/ad002.png" alt="" />
      </button>
    </div>
  );
};
