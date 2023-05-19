import * as WitService from "TFS/WorkItemTracking/Services";
import * as MarkdownIt from "markdown-it";
import { ErrorView } from "./errorView";
import SimpleMDE = require("simplemde");

export class View {
    private _md;
    private _markdown: JQuery<HTMLElement>;
    private _fieldName: string;
    private _simplemde: SimpleMDE;
    
    constructor(fieldName:string) {
        this._fieldName = fieldName;
        this._md = new MarkdownIt({ html: true, breaks: true });

        $(".mdcontainer").remove();

        const container = $("<div />");
        container.addClass("mdcontainer");

        const input = $('<textarea rows="10" />');
        container.append(input);

        const control = $('<div />');
        control.addClass('control');

        this._markdown = $('<div />');
        this._markdown.addClass('markdown-control');

        control.append(this._markdown);
        container.append(control);
        $("body").append(container);

        this._simplemde = new SimpleMDE({
            element: input[0],
            toolbar: ["bold", "italic", "strikethrough", "|", "heading", "heading-smaller", "heading-bigger", "|", "quote", "unordered-list", "ordered-list", "code", "clean-block", "|", "link", "image", "table", "horizontal-rule", "|", "guide"],
            status: false,
            spellChecker: false
        });
        this._simplemde.codemirror.on('change', this._oninput.bind(this));
        VSS.resize();
    }

    public _oninput(e:Event) {
        const val = this._simplemde.value().toString();
        this._update(val);

        // Update the field value in DevOps
        WitService.WorkItemFormService.getService().then((service) => {
            service.setFieldValue(this._fieldName, val);
        }, (reason:string) => this._handleError("setFieldValue error: " + reason));
    }

    private _handleError(error: string): void { 
        new ErrorView(error);
    }

    public update(markdown: string) { 
        this._simplemde.value(markdown);
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