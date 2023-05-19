import { Controller } from "./control";
import { IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "TFS/WorkItemTracking/ExtensionContracts";

var control: Controller;

var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => {
            control = new Controller();
        }
    };
};

VSS.register(VSS.getContribution().id, provider);