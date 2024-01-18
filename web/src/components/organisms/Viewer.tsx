import React, { useRef, useEffect, useState } from 'react';
import Axis from './Axis';
import Viewer from 'assets/scripts/viewer/Viewer';

const ViewerComponent = ({ width }: { width: number }, editor) => {
  const rootRef = useRef(null);
  const axisRef = useRef(null);
  const guiListRef = useRef(null);
  const [openGUI, setOpenGUI] = useState(false);
  const [boundingBox, setBoundingBox] = useState({ x: 0, y: 0, z: 0 });
  const [hasFrep, setHasFrep] = useState(false);
  const [operators, setOperators] = useState({
    quality: 'Normal',
    rendering: 'Standard',
    grid: true,
    boundingBox: false,
    fullscreen: false
  });
  const [uiItems, setUIItems] = useState([]);
  const [uiItemsSize, setUIItemsSize] = useState(0);

  const svg = {
    squareGrid: '<svg>...</svg>',
    threed: '<svg>...</svg>',
    pin: '<svg>...</svg>',
    fullscreen: '<svg>...</svg>',
    triangleOpen: '<svg>...</svg>',
    triangleClose: '<svg>...</svg>'
  };

  useEffect(() => {
    const viewer = new Viewer(rootRef.current!);
    viewer.onViewChanged.on((camera) => {
      axisRef.current!.update(camera);
    });
    viewer.onBoundingBoxChanged.on(({ size, box }) => {
      setBoundingBox(size);
      // emit boundingboxchanged event
    });
    viewer.onFrepChanged.on((hasFrep) => {
      setHasFrep(hasFrep);
    });
    viewer.setRenderingMode(operators.rendering);
    viewer.setGrid(operators.grid);
    viewer.setBoundingBox(operators.boundingBox);
    axisRef.current.update(viewer.camera);

    return () => {
      // cleanup code
    };
  }, []);

  const clear = () => {
    // clear code
  };

  const update = (nodes) => {
    // update code
  };

  const updateUI = (UIs) => {
    // updateUI code
  };

  const sortUIItems = (items) => {
    // sortUIItems code
  };

  const onRenderingQuality = () => {
    // onRenderingQuality code
  };

  const onRenderingMode = () => {
    // onRenderingMode code
  };

  const toggleGrid = () => {
    // toggleGrid code
  };

  const toggleBoundingBox = () => {
    // toggleBoundingBox code
  };

  const toggleFullscreen = () => {
    // toggleFullscreen code
  };

  const resetViewerCamera = () => {
    // resetViewerCamera code
  };

  const onViewDirection = (direction) => {
    // onViewDirection code
  };

  const capture = () => {
    // capture code
  };

  return (
    <div ref={rootRef} className="nodi-viewer" style={{ width }}>
      <Axis ref={axisRef} onClick={onViewDirection} />
      <ul className="ui dark-theme-color no-select" style={{ display: uiItemsSize > 0 ? 'block' : 'none' }}>
        <li className="toggle--open-close px-2 py-2 d-flex flex-items-center" onClick={() => setOpenGUI(!openGUI)}>
          <i style={{ display: !openGUI ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: svg.triangleOpen }} />
          <i style={{ display: openGUI ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: svg.triangleClose }} />
          <span className="ml-2 pr-8 user-select-none">{openGUI ? 'Close' : 'Open'}</span>
        </li>
        {openGUI && (
          <li>
            <ul ref={guiListRef} className="py-1" />
          </li>
        )}
      </ul>
      <ul className="information position-absolute p-3 no-select" style={{ display: viewable ? 'block' : 'none' }}>
        <li>
          <ul>
            <li>
              <span className="text-mono f5 mr-1">X</span>
              <span className="text-mono f5">{boundingBox.x}</span>
            </li>
            <li>
              <span className="text-mono f5 mr-1">Y</span>
              <span className="text-mono f5">{boundingBox.y}</span>
            </li>
            <li>
              <span className="text-mono f5 mr-1">Z</span>
              <span className="text-mono f5">{boundingBox.z}</span>
            </li>
          </ul>
        </li>
      </ul>
      <ul className="operators position-absolute p-3 no-select" style={{ display: viewable ? 'block' : 'none' }}>
        {hasFrep && (
          <li className="rendering ml-2">
            <select
              value={operators.quality}
              className="form-select"
              title="frep rendering quality"
              onChange={onRenderingQuality}
            >
              {/* options */}
            </select>
          </li>
        )}
        <li className="rendering ml-2">
          <select
            value={operators.rendering}
            className="form-select"
            title="switch rendering mode"
            onChange={onRenderingMode}
          >
            {/* options */}
          </select>
        </li>
        <li className="ml-2">
          <a
            title="toggle grid"
            className={operators.grid ? 'active' : ''}
            onClick={toggleGrid}
            dangerouslySetInnerHTML={{ __html: svg.squareGrid }}
          />
        </li>
        <li className="ml-1">
          <a
            title="toggle bounding box"
            className={operators.boundingBox ? 'active' : ''}
            onClick={toggleBoundingBox}
            dangerouslySetInnerHTML={{ __html: svg.threed }}
          />
        </li>
        <li className="ml-2">
          <a
            title="reset viewer camera"
            className="fixed-indicator"
            onClick={resetViewerCamera}
            dangerouslySetInnerHTML={{ __html: svg.pin }}
          />
        </li>
        <li className="ml-2">
          <a
            title="toggle fullscreen"
            className={operators.fullscreen ? 'active' : ''}
            onClick={toggleFullscreen}
            dangerouslySetInnerHTML={{ __html: svg.fullscreen }}
          />
        </li>
      </ul>
    </div>
  );
};

export default ViewerComponent;
