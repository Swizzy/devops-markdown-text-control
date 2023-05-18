/** The class control.ts will orchestrate the classes of InputParser, Model and View
 *  in order to perform the required actions of the extensions. 
 */

import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./model";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _fieldName = "";

    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
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
                        service.setFieldValue(this._fieldName, currentValue);
                        
                        // dependent on view, model, and inputParser refactoring
                        this._model = new Model(currentValue);
                        this._view = new View(this._model, "", (val) => {
                            this._updateInternal(val);
                        });
                        
                        //Force update markdown after view is created.
                        this._view.update(currentValue, markdown);

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

    private _updateInternal(value: string): void {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(this._fieldName, value).then(
                    () => {
                        this._update(value);
                    }, this._handleError);
            },
            this._handleError
        );
    }

    private async _update(value: string): Promise<void> {
        this._model.setCurrentValue(value);
        this._view.update(value, await this.getFieldValue(this._fieldName));
    }

    public updateExternal(value: string): void {
        this._update(value);
    }

    public getFieldName(): string {
        return this._fieldName;
    }
}