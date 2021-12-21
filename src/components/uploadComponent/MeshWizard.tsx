import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUploadedFiels } from "../../actions/uploadActions";
import { DicomSelector } from "./DicomSelector";
import { ModeSelector } from "./ModeSelector";
import { CenteredDiv, CenteredTypography } from "./styles";
import Upload from "./Upload";

export enum MeshWizardMode {
    Upload = "upload",
    Selection = "select existing",
}

interface UseMeshWizardProps {
    componentsMap: Record<MeshWizardMode, JSX.Element>;
}
function useMeshWizard({
    componentsMap,
}: UseMeshWizardProps): [(mode: MeshWizardMode) => void, () => JSX.Element] {
    const [mode, setMode] = useState(MeshWizardMode.Selection);
    const [component, setComponent] = useState(componentsMap[mode]);

    useEffect(() => {
        const component = componentsMap[mode];
        setComponent(component);
    }, [mode]);

    return [setMode, () => component];
}

export function MeshWizard() {
    const dispatch = useDispatch();

    const setMeshUrl = (meshName?: string) => {
        const uplaodUrl = `${process.env.REACT_APP_API_URL}/Upload`;
        dispatch(
            setUploadedFiels({
                isSuccess: true,
                meshFileUrl: `${uplaodUrl}?meshName=${meshName}`,
            })
        );
    };

    const [setMode, ModeComponent] = useMeshWizard({
        componentsMap: {
            [MeshWizardMode.Selection]: <DicomSelector onChange={setMeshUrl} />,
            [MeshWizardMode.Upload]: <Upload onUpload={setMeshUrl} />,
        },
    });
    return (
        <>
            <CenteredTypography variant="h5">Mesh wizard</CenteredTypography>
            <CenteredDiv>
                <ModeSelector onChange={setMode} />
                <ModeComponent />
            </CenteredDiv>
        </>
    );
}
