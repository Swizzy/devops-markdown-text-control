import * as MarkdownIt from "markdown-it";

export class View {
    private _md;
    private _markdown: JQuery<HTMLElement>;

    constructor() {
        this._md = new MarkdownIt({ html: true, breaks: true });
        
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
        VSS.resize();
    }


    public update(markdown: string) {
        console.log('update: ' + markdown);
        var render = this._md.render(markdown);

        console.log('update: ' + markdown);
        var formatted = $(render);
        $('a', formatted).attr('target', '_blank');

        var html = formatted.html();

        console.log('html: ' + html);
        
        this._markdown.html(html);

        VSS.resize();
    }
}