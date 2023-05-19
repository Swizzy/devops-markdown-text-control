import { Controller } from "./control";
import { IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "TFS/WorkItemTracking/ExtensionContracts";

var control: Controller;

var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => {
            control = new Controller();
        },
        onFieldChanged: (fieldChangedArgs: IWorkItemFieldChangedArgs) => {
            const changedValue = fieldChangedArgs.changedFields[control.getFieldName()];
            if (changedValue !== undefined) {
                control.update(changedValue);
            }
        }
    };
};

VSS.register(VSS.getContribution().id, provider);