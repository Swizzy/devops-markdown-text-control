import * as MarkdownIt from "markdown-it";

export class View {
    private _md: MarkdownIt;
    private _markdown: JQuery<HTMLElement>;

    constructor() {
        this._md = new MarkdownIt();
        
        $(".container").remove();

        var container = $("<div />");
        container.addClass("container");

        var control = $('<div />');
        control.addClass('control');

        var workItemControl = $('<div />');
        workItemControl.addClass('work-item-control');

        this._markdown = $('<div />');
        this._markdown.addClass('markdown-control');

        control.append(workItemControl);
        control.append(this._markdown);
        container.append(control);
        $("body").append(container);

        VSS.resize(container.width(), container.height());
    }


    public update(markdown: string) {
        this._md.render(markdown).then(x => {             
            var formatted = $(x);
            $('a', formatted).attr('target', '_blank');

            this._markdown.html(formatted.html());
        });
    }
}