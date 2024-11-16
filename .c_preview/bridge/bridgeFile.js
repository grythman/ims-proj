import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/Admin/ims-proj",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "frontend/src/pages/dashboard/StudentDashboard.jsx",
    "mapFileRelPath": "frontend/src/pages/dashboard/StudentDashboard.jsx",
    "presetName": "react",
    "workspaceFolderName": "ims-proj"
};
export const preview = () => render(getMod);
const getMod = () => import("../../frontend/src/pages/dashboard/StudentDashboard.jsx");