import { Markdown } from './markdown';
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { Model } from "./model";
import * as MarkdownIt from "markdown-it";
import { WorkItemField } from 'TFS/WorkItemTracking/Contracts';

export class View {
    private _md: Markdown;

    private currentValue = "";

    private _combo: JQuery<HTMLElement>;
    private _markdown: JQuery<HTMLElement>;

    constructor(private model: Model, private script: string, private onInputChanged: Function) {
        this._md = new Markdown(script);

        this._init();
    }

    private _init(): void {
        $(".container").remove();

        var container = $("<div />");
        container.addClass("container");

        var control = $('<div />');
        control.addClass('control');

        var workItemControl = $('<div />');
        workItemControl.addClass('work-item-control');

        this.currentValue = String(this.model.getCurrentValue());

        this._markdown = $('<div />');
        this._markdown.addClass('markdown-control');

        control.append(workItemControl);
        control.append(this._markdown);
        container.append(control);
        $("body").append(container);

        VSS.resize(container.width(), container.height());
    }

    private _inputChanged(): void {
        let newValue = $("input").val();
        if (this.onInputChanged) {
            this.onInputChanged(newValue);
        }
    }

    private _gotFocus(): void {
        this._combo.addClass('focus');
    }

    private _lostFocus(): void {
        this._combo.removeClass('focus');
    }

    public update(value: string, markdown: string) {
        this.currentValue = String(value);
        $("input").val(this.currentValue);

        this._md.markdown(markdown).then(x => { 
            
            var formatted = $(x);
            $('a', formatted).attr('target', '_blank');

            this._markdown.html(formatted.html());
        });
    }
}