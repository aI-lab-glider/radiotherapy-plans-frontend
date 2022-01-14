import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setRegionTypes, setUploadedFiels } from "../../actions/uploadActions";
import { DicomSelector } from "./DicomSelector";
import { ModeSelector } from "./ModeSelector";
import { CenteredDiv, CenteredTypography } from "./styles";
import Upload from "./Upload";

export enum MeshWizardMode {
  Upload = "upload",
  Selection = "select existing",
}

interface RegionsEndopintResponse {
  roiNames: string[];
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
  }, [mode, componentsMap]);

  return [setMode, () => component];
}

export function MeshWizard() {
  const dispatch = useDispatch();

  const compnentsMap = useMemo(() => {
    const setMeshUrl = (meshName?: string) => {
      dispatch(
        setUploadedFiels({
          isSuccess: true,
          meshName: meshName,
        })
      );
    };

    const getRegions = async (meshName: string) => {
      const regionsUrl = `${process.env.REACT_APP_API_URL}/UploadedDicoms/${meshName}/regions`;
      const response = await axios.get<string>(regionsUrl);
      if (response.status === 200) {
        const payload: RegionsEndopintResponse = JSON.parse(response.data);
        dispatch(setRegionTypes(payload.roiNames));
      }
    };

    const onChange = async (meshName: string) => {
      await getRegions(meshName);
      setMeshUrl(meshName);
    };

    return {
      componentsMap: {
        [MeshWizardMode.Selection]: <DicomSelector onChange={onChange} />,
        [MeshWizardMode.Upload]: <Upload onUpload={onChange} />,
      },
    };
  }, [dispatch]);

  const [setMode, ModeComponent] = useMeshWizard(compnentsMap);
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
