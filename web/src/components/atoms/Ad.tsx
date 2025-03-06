import { Icon } from "../atoms/Icon";
import { FC, useEffect, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import useAdVisibility from "../../hooks/useAdVisibility";
import { isAdDialogOpenAtom, isGAInitializedAtom } from "../../../src/store";
import { useAtom, useAtomValue } from "jotai";

// define type
type AdProps = {};

export const Ad: FC<AdProps> = () => {
  const [showAds, setShowAds] = useState(true);
  const [dialogOpen, setDialogOpen] = useAtom(isAdDialogOpenAtom);
  const isGAInitialized = useAtomValue(isGAInitializedAtom);
  const onAdViewable = () => {
    ReactGA.event({
      category: "AdBanner",
      action: `ad_viewable`,
    });
  };
  const adRef = useAdVisibility(onAdViewable, 1000);

  const closeAd = () => {
    console.log("close ad");
    ReactGA.event({
      category: "AdBanner",
      action: `close_click`,
    });
  };
  const clickAd = () => {
    console.log("click ad");
    ReactGA.event({
      category: "AdBanner",
      action: `banner_click`,
    });
  };

  useEffect(() => {
    if (showAds && isGAInitialized) {
      ReactGA.event({
        category: "AdBanner",
        action: `ad_impression`,
      });
    }
  }, [showAds, isGAInitialized]);
  if (!showAds) {
    return null;
  }
  return (
    <div className="mx-2 relative md:block hidden" ref={adRef}>
      <button
        onClick={() => {
          setShowAds(false);
          closeAd();
        }}
        className="absolute top-2 right-2 rounded-full bg-content-l hover:scale-105 transition-all p-1"
      >
        <Icon name="close" className="size-3 stroke-[4px] text-content-m" />
      </button>
      <button
        className="rounded-sm overflow-hidden block"
        onClick={() => {
          setDialogOpen(true);
          clickAd();
        }}
      >
        <img src="/images/ads/ad002.png" alt="" />
      </button>
    </div>
  );
};
