import { lazy } from "react";
// import CommonDeleteDialog from "./CommonDeleteDialog";


const CommonDeleteDialog = lazy(() => import("./CommonDeleteDialog"));
const ActivityForm = lazy(() => import("./activity/ActivityForm"));

const dialogComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    // Register 
    CommonDeleteDialog: CommonDeleteDialog,
    ActivityForm: ActivityForm
};

export default dialogComponents;
