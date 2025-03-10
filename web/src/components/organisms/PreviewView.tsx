import React, { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import {
  FrepRenderingQuality,
  Graph,
  IElementable,
  NodeBase,
  RenderingMode,
  UINodeBase,
  UIText,
  UINumber,
} from "@nodi/core";
import Project from "../../assets/scripts/service/Project";
import axios from "axios";
import { useAtom, useAtomValue } from "jotai";
import { userStateAtom } from "../../store/user";
import { getProject } from "../../firebase/firebase";
import Viewer from "../../assets/scripts/viewer/Viewer";
import {
  BoxConfig,
  ButtonElements,
  Grid,
  boxConfigAtom,
  gridAtoms,
  isDebugAtom,
} from "../../store";
import {
  UIsAtom,
  elementsAtom,
  groupAtom,
  nodesAtom,
  projectPathAtom,
} from "../../store/scene";
import Editor from "../../assets/scripts/editor/Editor";
import { ConfigView } from "./ConfigView";

import { DialogDownload } from "../molecules/DialogDownload";

export const PreviewView = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDebug = useAtomValue(isDebugAtom);
  const path = useAtomValue(projectPathAtom);
  //get useStateAtom from /store
  const [user, setuser] = useAtom(userStateAtom);
  const [group, setGroup] = useAtom(groupAtom); //elements for viewer
  const [elements, setElements] = useAtom(elementsAtom); //elements for viewer
  const [UIs, setUIs] = useAtom(UIsAtom); //elements for viewer
  const [nodes, setNodes] = useAtom(nodesAtom); //elements for viewer
  const [boxConfig, setBoxConfig] = useAtom(boxConfigAtom);
  const [grid, setGrid] = useAtom(gridAtoms);
  const SceneComponent = React.lazy(() => import(`../three/SceneClassic`));

  let viewer: Viewer;
  const initializeProject = async () => {
    //get current path
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)$/);
    if (path.length > 0) {
      try {
        const { project, doc } = await getProject(path);
        console.log(project);
        await loadProject(project, doc);
      } catch (e) {
        window.alert(e);
      }
    }
    setIsLoading(false);
  };

  const loadProject = async (project: Project, doc: any) => {
    const { jsonUrl } = project;
    if (project.canView(user.uid ?? "")) {
      const graph = new Graph();
      graph.onStartProcess.on(() => {
        setIsProcessing(true);
      });
      graph.onFinishProcess.on(() => {
        setIsProcessing(false);
      });
      graph.onConstructed.on((e) => {
        //TODO
        viewer.update(e.nodes);
        update(e.nodes);
        console.log("VIEWER", viewer);
        console.log("NODES", e.nodes);
        console.log("ELEMENTS", viewer.elements);
        setNodes(e.nodes);
        setGroup(viewer.container);
        setElements(viewer.elements);
      });

      if (jsonUrl !== undefined) {
        const { data } = await axios.get(jsonUrl);
        graph.fromJSON(data);
      } else {
        graph.fromJSON(doc.json ?? {});
      }

      return Promise.resolve();
    }
    return Promise.reject(
      new Error("You do not have read access to this project"),
    );
  };

  const update = (nodes: NodeBase[]) => {
    const uis: UINodeBase[] = nodes.filter(
      (node) => node instanceof UINodeBase && node.enabled && node.processed,
    ) as UINodeBase[];
    setUIs(uis);
    console.log("UIS", UIs);
  };

  const UIListItem = ({
    uuid,
    editor,
    order,
    length,
    onOrderChange,
    onUp,
    onDown,
    children,
  }: {
    uuid: string;
    editor: boolean;
    order: number;
    length: number;
    onOrderChange?: void;
    onUp?: void;
    onDown?: void;
    children?: HTMLDivElement;
  }) => {
    // setup関数のロジックをここに書く
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (divRef.current) {
        // append child to divRef
        divRef.current.appendChild(children!);
      }
    }, [children]);

    return (
      //append child(HTMLDivElement)to div
      <div ref={divRef}></div>
    );
  };
  // UIListItemインスタンスを作成します
  const createUIListItem = (ui: UINodeBase, order: number, length: number) => {
    const div = document.createElement("div");
    ui.setupGUIElement(div);
    const instance = (
      <UIListItem
        key={ui.uuid}
        uuid={ui.uuid}
        editor={false}
        order={order}
        length={length}
      >
        {div}
      </UIListItem>
    );
    return instance;
  };

  //create react FC for UI
  const UIButtonElements = (uis: UINodeBase[]) => {
    // uisの中から、labelが"Download BOX.stl"の要素を取り出し、JSXとしてreturnする

    const buttonUis = uis.filter(
      (ui) =>
        ui.label === "本体" ||
        ui.label === "フタ" ||
        ui.label === "留め具" ||
        ui.label === "仕切り",
    );

    let buttonElements: ButtonElements[] = [];
    buttonUis.forEach((ui, index) => {
      const pname =
        ui.label === "本体"
          ? "box"
          : ui.label === "フタ"
            ? "lid"
            : ui.label === "留め具"
              ? "latch"
              : "partition";
      const path = "/images/parts/" + pname + ".png";
      const b: ButtonElements = {
        jsx: createUIListItem(ui, index, uis.length),
        label: ui.label,
        path: path,
        visible: true,
      };
      buttonElements.push(b);
    });
    return buttonElements;
  };

  const UISlider: React.FC<{ uis: UINodeBase[] }> = React.memo(({ uis }) => {
    const sliderUiNodes = uis.filter(
      (ui) =>
        ui.label === "width" ||
        ui.label === "height" ||
        ui.label === "dimension",
    );
    let sliderJSXs: JSX.Element[] = [];
    sliderUiNodes.forEach((ui, index) => {
      const slider = createUIListItem(ui, index, uis.length);
      sliderJSXs.push(slider);
    });
    return (
      <>
        {sliderJSXs.map((ui, index) => (
          <span
            key={index}
            className="block mb-4 [&>div>div]:inline-flex [&>div>div]:items-center [&>div>div>input]:range [&>div>div>input]:range-accent [&>div>div>span]:text-content-h [&>div>div>input]:text-lg"
          >
            {ui}
          </span>
        ))}
      </>
    );
  });

  const UIGraph: React.FC<{ uis: UINodeBase[] }> = React.memo(({ uis }) => {
    const sliderUiNodes = uis.filter((ui) => ui.label === "baseShape");
    let sliderJSXs: JSX.Element[] = [];
    sliderUiNodes.forEach((ui, index) => {
      const slider = createUIListItem(ui, index, uis.length);
      sliderJSXs.push(slider);
    });
    return (
      <>
        {sliderJSXs.map((ui, index) => (
          <span
            key={index}
            className="block w-fit [&>div]:w-fit [&>div>div]:w-fit [&>div>div>span]:hidden"
          >
            {ui}
          </span>
        ))}
      </>
    );
  });
  const UIText: React.FC<{
    uis: UINodeBase[];
    label: string;
    object: BoxConfig | Grid[];
  }> = React.memo(({ uis, label, object }) => {
    // nodesの中から、labelが"XX"の要素を取り出し、JSXとしてreturnする
    const textUiNodes = uis.filter((ui) => ui.label === label);
    let textJSXs: JSX.Element[] = [];
    textUiNodes.forEach((ui, index) => {
      const slider = createUIListItem(ui, index, uis.length);
      const textUI = ui as UIText;

      textUI.setTextValue(JSON.stringify(object!));
      textJSXs.push(slider);
    });
    return (
      <>
        {textJSXs.map((ui, index) => (
          <span
            key={index}
            className={`${!isDebug && "hidden"} block w-fit [&>div]:w-fit [&>div>div]:w-fit [&>div>div>span]:hidden`}
          >
            {ui}
          </span>
        ))}
      </>
    );
  });
  const UINumber: React.FC<{ uis: UINodeBase[]; label: string }> = React.memo(
    ({ uis, label }) => {
      // nodesの中から、labelが"XX"の要素を取り出し、JSXとしてreturnする
      const numberUiNodes = uis.filter((ui) => ui.label === label);
      let numberJSXs: JSX.Element[] = [];
      numberUiNodes.forEach((ui, index) => {
        const number = createUIListItem(ui, index, uis.length);
        const numberUI = ui as UINumber;

        // numberUI.setNumberValue(100);
        numberJSXs.push(number);
      });
      return (
        <>
          {numberJSXs.map((ui, index) => (
            <span
              key={index}
              className={`${!isDebug && "hidden"} block w-fit [&>div]:w-fit [&>div>div]:w-fit [&>div>div>span]:hidden`}
            >
              {ui}
            </span>
          ))}
        </>
      );
    },
  );

  useEffect(() => {
    // Append Viewer
    const root: HTMLElement | null = document.getElementById("preview");
    const editorRoot: HTMLElement | null = document.getElementById("editor");
    viewer = new Viewer(root!);
    // viewer.setRenderingMode(operators.rendering);

    initializeProject();
  }, []);

  useEffect(() => {
    update(nodes);
  }, []);

  useEffect(() => {
    console.log("GRID", grid);
    console.log("boxConfig", boxConfig);
  }, [grid, boxConfig]);

  return (
    <>
      <div id="preview" className="hidden"></div>
      <div id="editor" className="hidden"></div>
      <Suspense fallback={"loading..."}>
        <SceneComponent group={group!}></SceneComponent>
      </Suspense>
      <ConfigView />
      <DialogDownload elements={UIButtonElements(UIs)} />
      <div className="fixed bottom-8 flex flex-cols gap-4">
        <UISlider uis={UIs} />
        <UIGraph uis={UIs} />
        <UIText uis={UIs} label={"config"} object={boxConfig} />
        <UIText uis={UIs} label={"gridConfig"} object={grid} />
        {/* <UINumber uis={UIs} label={'fillet'}/> */}
        <UINumber uis={UIs} label={"depth"} />
      </div>
    </>
  );
};
