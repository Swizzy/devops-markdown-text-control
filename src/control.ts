import * as WitService from "TFS/WorkItemTracking/Services";
import { WorkItemOptions } from "TFS/WorkItemTracking/UIContracts"
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _fieldName = "";

    private _inputs: IDictionaryStringTo<string>;
    private _view: View;
    private _options:WorkItemOptions;

    constructor() {
        this._initialize();
    }

    private async _initialize(): Promise<void> {
        this._inputs = VSS.getConfiguration().witInputs;
        this._fieldName = this._inputs["FieldName"];
        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [service.getFieldValue(this._fieldName, this._options)],
                    (currentValue: string) => {
                        this._view = new View();
                        this._view.update(currentValue);

                    }, (reason:string) => this._handleError("Q.spread inner error: " + reason)
                );
            }, (reason:string) => this._handleError("Q.spread outer error: " + reason));        
    }

    private _handleError(error: string): void { 
        new ErrorView(error);
    }

    public getFieldName(): string {
        return this._fieldName;
    }

    public update(changedValue: any) {
        this._view.update(changedValue.toString());
    }
}