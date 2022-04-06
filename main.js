'use strict';

const obsidian = require("obsidian");

class FormattedLink extends obsidian.MarkdownRenderChild {
  
  constructor(containerEl, url, text) {
    super(containerEl);
    
    this.url = url;
    this.text = text;
    console.log("created");
  }

  onload() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://noembed.com/embed?url="+this.url, false ); // false for synchronous request
    xmlHttp.send( null );
    const data = JSON.parse(xmlHttp.responseText);
    
    const link_format = {
        "YouTube": data.title,
        "Twitter": "Tweet from @"+data.author_name,
        "default": data.title ?? (this.text.length>0 ? this.text : this.url),
    };
    
    const linkEl = this.containerEl.createEl("a", {
        text: link_format[data.provider_name] ?? link_format["default"],
        href: this.url,
    });
    this.containerEl.replaceWith(linkEl);
  }
}

class LinkFormatter extends obsidian.Plugin {
  
    async onload() {
        console.log("started onload");
        this.registerMarkdownPostProcessor((element, context) => {
            const external_links = element.querySelectorAll("a.external-link");
            for (let index = 0; index < external_links.length; index++) {
                const link = external_links.item(index);
                const url = link.href;
                const text = link.innerText.trim();
                context.addChild(new FormattedLink(link, url, text));
            }
        });
        console.log("ended onload");
    }

	onunload() {
	    //console.log("unloaded");
	}
}

module.exports = LinkFormatter;
