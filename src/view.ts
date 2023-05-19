import * as WitService from "TFS/WorkItemTracking/Services";
import * as MarkdownIt from "markdown-it";
import { ErrorView } from "./errorView";

export class View {
    private _md;
    private _markdown: JQuery<HTMLElement>;
    private _input: JQuery<HTMLElement>;
    private _fieldName: string;
    
    constructor(fieldName:string) {
        this._fieldName = fieldName;
        this._md = new MarkdownIt({ html: true, breaks: true });

        $(".mdcontainer").remove();

        const container = $("<div />");
        container.addClass("mdcontainer");

        this._input = $('<textarea rows="10" />');
        this._input.on('input', this._oninput.bind(this));
        
        container.append(this._input);

        const control = $('<div />');
        control.addClass('control');

        this._markdown = $('<div />');
        this._markdown.addClass('markdown-control');

        control.append(this._markdown);
        container.append(control);
        $("body").append(container);
        VSS.resize();
    }

    public _oninput(e:Event) {
        this._update(this._input.val().toString());

        // Update the field value in DevOps
        WitService.WorkItemFormService.getService().then((service) => {
            service.setFieldValue(this._fieldName, this._input.val());
        }, (reason:string) => this._handleError("setFieldValue error: " + reason));
    }

    private _handleError(error: string): void { 
        new ErrorView(error);
    }

    public update(markdown: string) { 
        this._input.val(markdown);
        this._update(markdown);
    }

    private _update(markdown: string) {
        let render = this._md.render(markdown);

        // Change the table to have all the classes we want it to have
        render = render.replaceAll("<table", "<table class=\"table table-striped table-hover table-sm table-responsive table-bordered\"");

        this._markdown.html(render);

        VSS.resize();
    }
}