import { lazy } from "react";
// import CommonDeleteDialog from "./CommonDeleteDialog";


const CommonDeleteDialog = lazy(() => import("./CommonDeleteDialog"));

const dialogComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
    // Register 


    CommonDeleteDialog : CommonDeleteDialog
    
};

export default dialogComponents;
