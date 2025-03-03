// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import { atom } from "jotai";

export type BoxConfig = {
  totalWidth: number;
  totalDepth: number;
  height: number;
  padding: number;
  colorMode: number;
  viewMode: number;
  partitionThickness: number;
  mm2pixel: number;
  fillet: number;
  isStack: boolean;
  isOuterCase: boolean;
};

export const boxConfigAtom = atom<BoxConfig>({
  totalWidth: 100,
  totalDepth: 100,
  height: 100,
  padding: 3,
  colorMode: 0,
  viewMode: 0,
  partitionThickness: 2,
  mm2pixel: 3,
  fillet: 2,
  isStack: false,
  isOuterCase: true,
});

export type Grid = {
  index: number;
  label: string;
  width: number;
  depth: number;
  wFixed: boolean;
  division: number;
};

export const gridAtoms = atom<Grid[]>([
  {
    index: 0,
    label: "",
    width: 100,
    depth: 100,
    wFixed: false,
    division: 1,
  },
]);

export type PhantomSize = {
  width: number;
  height: number;
  depth: number;
  hover: {
    w: boolean;
    h: boolean;
    d: boolean;
  };
};
export const phantomSizeAtom = atom<PhantomSize>({
  width: 100,
  height: 60,
  depth: 100,
  hover: {
    w: false,
    h: false,
    d: false,
  },
});

export type ButtonElements = {
  jsx: JSX.Element;
  label: string;
  path: string;
  visible: boolean;
};
export const DLButtonElementsAtom = atom<ButtonElements[]>([]);

export const openAIAPIKeyAtom = atom<string>("");
export const selectedColorAtom = atom<string>("");
export const screenModeAtom = atom<number>(0);
export const isDebugAtom = atom<boolean>(false);
export const isDownloadDialogOpenAtom = atom<boolean>(false);
export const isSettingDialogOpenAtom = atom<boolean>(false);
export const isFeedbackDialogOpenAtom = atom<boolean>(false);
export const isUpdatesDrawerOpenAtom = atom<boolean>(false);
export const isAdDialogOpenAtom = atom<boolean>(false);
export type Toast = {
  isOpen: boolean;
  content: string;
  type: "default" | "error" | "warn";
  persistent?: boolean;
};
export const toastAtom = atom<Toast[]>([
  {
    isOpen: false,
    content: "",
    type: "default",
  },
]);

export const cameraModeAtom = atom<number>(0);

// 0:default
// 1:Front View/高さ
// 2:Top View/奥行き

export const bomAtom = atom<number>(0);
export const stepAtom = atom<number>(0);
//set same value as stepAtom to boxconfig.viewMode when stepAtom changes
// stepAtomの値が変更されたときにboxConfig.viewModeを更新するatom
export const syncViewModeWithStep = atom(
  null, // このatomはgetを使用しません。
  (get, set, update: number) => {
    // stepAtomが更新されるたびにこの関数がトリガーされます。
    const currentBoxConfig = get(boxConfigAtom);
    set(boxConfigAtom, {
      ...currentBoxConfig,
      viewMode: update, // stepAtomの最新値でviewModeを更新
    });
  },
);

// stepAtomが更新されるたびにsyncViewModeWithStepを更新するatom
export const stepSyncAtom = atom(
  (get) => get(stepAtom),
  (get, set, update: number) => {
    set(stepAtom, update); // stepAtomを更新
    set(syncViewModeWithStep, update); // syncViewModeWithStepをトリガーしてboxConfigAtomを更新
  },
);

export type ColorPalette = {
  label: string;
  primary: string;
  secondary: string;
};
export const colorPaletteAtom = atom<ColorPalette[]>([
  {
    label: "ネイビー",
    primary: "#606D84",
    secondary: "#606D84",
  },
  {
    label: "テラコッタ",
    primary: "#A06351",
    secondary: "#915646",
  },
  {
    label: "しらたま",
    primary: "#F4EFE4",
    secondary: "#B4AFA2",
  },
]);

//update totalwidth along with length of gridAtoms

export const updateBoxConfigAtomsAction = atom(
  //グリッドを変更したときに全体サイズを更新する
  // 同じコンポーネント内でデータも扱うなら一緒にした方がimportを減らせます
  (get) => get(boxConfigAtom),
  // 非同期もOK

  async (get, set, pixelSizeW: number, pixelSizeD: number) => {
    const sumOfWidth = get(gridAtoms).reduce(
      (acc, grid) => acc + grid.width,
      0,
    );
    const w =
      sumOfWidth +
      get(boxConfigAtom).partitionThickness * (get(gridAtoms).length + 1);
    //get the max value from gridAtoms.height
    const d =
      Math.max(...get(gridAtoms).map((grid) => grid.depth)) +
      get(boxConfigAtom).partitionThickness * 2;

    set(boxConfigAtom, {
      ...get(boxConfigAtom),
      totalWidth: w,
      totalDepth: d,
      mm2pixel: w - d > 0 ? pixelSizeW / w : pixelSizeD / d,
    });
  },
);

export const updateGridAtomsAction = atom(
  //全体サイズを変更した際にグリッドを更新する
  (get) => get(gridAtoms),
  async (get, set, boxConfig: BoxConfig) => {
    const sum = get(gridAtoms).reduce(
      (acc, grid) => (!grid.wFixed ? acc : acc + grid.width),
      0,
    );
    let newAutoWidth = 0;
    if (boxConfig.totalWidth - sum > 0) {
      console.log(
        "  0以上です",
        "boxConfig.totalWidth",
        boxConfig.totalWidth,
        "sum",
        sum,
      );
      newAutoWidth =
        (boxConfig.totalWidth -
          sum -
          boxConfig.partitionThickness * (get(gridAtoms).length + 1)) /
        get(gridAtoms).filter((grid) => !grid.wFixed).length;
      set(
        gridAtoms,
        get(gridAtoms).map((grid) =>
          grid.wFixed
            ? grid
            : {
                ...grid,
                width: newAutoWidth,
              },
        ),
      );
    } else if (boxConfig.totalWidth - sum === 0) {
      return;
    } else {
      console.log("0以下になるので全てのグリッドを同じ幅にします");
      newAutoWidth =
        (boxConfig.totalWidth -
          boxConfig.partitionThickness * (get(gridAtoms).length + 1)) /
        get(gridAtoms).length;
      // set newAutoWidth to all gridAtoms.width
      set(
        gridAtoms,
        get(gridAtoms).map((grid) => ({
          ...grid,
          width: newAutoWidth,
        })),
      );
    }
  },
);
//showCaseAtomが更新されたときにtrueであれば、isStackをfalseにする
export const updateIsStackAtom = atom(
  (get) => get(boxConfigAtom).isOuterCase,
  (get, set, update: BoxConfig) => {
    set(boxConfigAtom, update);
    if (update) {
      set(boxConfigAtom, { ...get(boxConfigAtom), isStack: false });
    }
  },
);

//toastの更新時、persistentがfalseの場合、5秒後にtoastを空にする
export const updateToastAtom = atom(
  (get) => get(toastAtom),
  (get, set, update: Toast[]) => {
    set(toastAtom, update);
    if (!update[update.length - 1].persistent) {
      setTimeout(() => {
        //新たに追加されたtoastを削除する
        set(
          toastAtom,
          get(toastAtom).filter((toast, i) => i !== get(toastAtom).length - 1),
        );
      }, 5000);
    }
  },
);
