/** The class control.ts will orchestrate the classes of InputParser, Model and View
 *  in order to perform the required actions of the extensions. 
 */

import * as WitService from "TFS/WorkItemTracking/Services";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _fieldName = "";

    private _inputs: IDictionaryStringTo<string>;
    private _view: View;

    constructor() {
        this._initialize();
    }

    private async _initialize(): Promise<void> {
        this._inputs = VSS.getConfiguration().witInputs;
        this._fieldName = this._inputs["FieldName"];
        var markdown = await this.getFieldValue(this._fieldName);

        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [service.getFieldValue(this._fieldName)],
                    (currentValue: string) => {
                        this._view = new View();
                        
                        //Force update markdown after view is created.
                        this._view.update(markdown);

                    }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError);
        
    }

    private async getFieldValue(fieldName: string): Promise<string> {
        const formService = await WitService.WorkItemFormService.getService();
        fieldName = fieldName.toLowerCase()

        if (fieldName == "id") {
            return (await formService.getId()).toString();
        }

        try {
            const fields = await formService.getFields();
            const field = fields.filter(x => x.name.toLowerCase() == fieldName)[0];

            if (field) {
                return await formService.getFieldValue(field.referenceName).toString();
            } else {
                return null;
            }
        } catch {
            return null;
        }
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