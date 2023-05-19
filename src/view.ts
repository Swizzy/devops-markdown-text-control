import * as MarkdownIt from "markdown-it";

export class View {
    private _md;
    private _markdown: JQuery<HTMLElement>;
    private _input: JQuery<HTMLElement>;

    constructor() {
        this._md = new MarkdownIt({ html: true, breaks: true });

        $(".mdcontainer").remove();

        var container = $("<div />");
        container.addClass("mdcontainer");

        this._input = $('<textarea rows="10" />');
        this._input.on('input', this._oninput)
        
        container.append(this._input);

        var control = $('<div />');
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
    }

    public update(markdown: string) { 
        this._input.val(markdown);
        this._update(markdown);
    }

    private _update(markdown: string) {
        console.log('update: ' + markdown);
        markdown = $("<div/>").html(markdown.replaceAll("<br>", "\\n").replaceAll("&nbsp;", " ")).text().replaceAll("\\n", "\n");
        console.log('stripped: ' + markdown);

        var render = this._md.render(markdown);

        render = render.replaceAll("<table", "<table class=\"table table-striped table-hover table-sm table-responsive table-bordered\"")

        console.log('html: ' + render);       
        
        this._markdown.html(render);

        VSS.resize();
    }
}