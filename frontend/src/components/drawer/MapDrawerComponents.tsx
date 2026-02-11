import { lazy } from "react";

const AddEditNGOActivity = lazy(() => import("./activity/AddEditNGOActivity"));
const FloodReportForm = lazy(() => import("./flood-relief/FloodReportForm"));

// const viewDocumentdownloadLink = lazy(() => import("../dialog/flood-condition/ViewDocument"));
const FloodReliefAuditLog = lazy(() => import("./flood-relief/FloodReliefLogs"));

const MapDrawerComponents: Record<string, React.LazyExoticComponent<React.FC <any>>> = {
     AddEditNGOActivity: AddEditNGOActivity,
    //  viewDocumentdownloadLink: viewDocumentdownloadLink,


     FloodReportForm: FloodReportForm,

    FloodReliefAuditLog: FloodReliefAuditLog,
};

export default MapDrawerComponents;
