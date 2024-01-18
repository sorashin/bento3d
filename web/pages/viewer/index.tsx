import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as Box3 from 'three';
import * as  Graph  from '@nodi/core';
// import SvgLogoWhiteIconOnlyMask from '@/assets/images/logo/logo-white-icon-only-mask.svg?raw';

// import Spinner from '~/components/misc/Spinner.vue';

// import ViewerComponent from '~/components/viewer/Viewer.vue';
// import LogoFooter from '~/components/common/LogoFooter.vue';
import Project from '../..//assets/scripts/service/Project';
import { getProject } from '../../firebase/firebase';
import { userStateAtom} from '../../store/user';

export const ViewerPage: React.FC = () => {
    
    
    const [height, setHeight] = useState(window.innerHeight - 30);
    const [footerHeight, setFooterHeight] = useState(30);
    const [path, setPath] = useState(''); 

    
    const onResizeWindow = () => {
        setHeight(window.innerHeight - footerHeight);
    };

    

    useEffect(() => {
        window.addEventListener('resize', onResizeWindow);
        return () => {
            window.removeEventListener('resize', onResizeWindow);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);
        // TODO: Add authentication state change listener
        initializeProject();
    }, []);

    const initializeProject = async () => {
        const pathMatch = window.location.pathname.match(/^\/viewer\/(.+)/);
        // const { pathMatch } = useParams();
        setPath(pathMatch![0]);
        
        if (path.length > 0) {
            try {
                //call getProject function from firebase/firebase.ts
                const { project, doc } = await getProject(path);
                if (project && doc) {
                    // Your code here
                }
                await loadProject(project, doc);
            } catch (e) {
                window.alert(e);
            }
        }
        
    };

    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadProject = async (project: Project, doc: any) => {
        if (project.canView(user.uid ?? '')) {
            const graph = new Graph();
            graph.onStartProcess.on(() => {
                setIsProcessing(true);
            });
            graph.onFinishProcess.on(() => {
                setIsProcessing(false);
            });
            graph.onConstructed.on((e) => {
                viewerRef.current?.update(e.nodes);
            });

            const { jsonUrl } = project;
            if (jsonUrl !== undefined) {
                const { data } = await axios.get(jsonUrl);
                graph.fromJSON(data);
            } else {
                graph.fromJSON(doc.json ?? {});
            }

            return Promise.resolve();
        }
        return Promise.reject(new Error('You do not have read access to this project'));
    };

    return (
        <div>
            <div className="d-flex" style={{ height: height + 'px' }}>
                {/* <ViewerComponent
                    ref={viewerRef}
                    width="100%"
                    editor={false}
                    onBoundingBoxChanged={onBoundingBoxChanged}

                    /> */}
                    <p>{path}</p>
            </div>
            {/* <LogoFooter /> */}
        </div>
    )

}