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
        this._markdown = $('<div />');
        this._markdown.addClass('markdown-control');

        control.append(this._markdown);
        container.append(control);
        $("body").append(container);
        VSS.resize();
    }


    public update(markdown: string) {
        console.log('update: ' + markdown);
        markdown = $("<div/>").html(markdown.replaceAll("<br>", "\\n").replaceAll("&nbsp;", " ")).text().replaceAll("\\n", "\n");
        console.log('stripped: ' + markdown);

        var render = this._md.render(markdown);

        console.log('html: ' + render);
        
        this._markdown.html(render);

        VSS.resize();
    }
}