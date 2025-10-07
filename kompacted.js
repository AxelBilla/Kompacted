class Kompacted{

                            // USER SIDE //

    // Sets the templates (& load all Kompacts using said Templates)
    set(templates, scope=undefined){
        templates(this);
        if(!isNull(scope)) {
            this.load(scope);
        };
    }

    // Adds a new template to the list
    new(name, html, type=undefined, func=()=>{}){
        let template = new Kompacted.template(name, html, type, func);
        this.addTemplate(template);
        return template;
    }

    edit(name, html, type=undefined, func=()=>{}){
        let template = new Kompacted.template(name, html, type, func);
        this.editTemplate(name, template);
    }

    // (re)Loads all the Komps within a given scope
    load(scope=undefined){
        if(isNull(scope)) scope = document;
        this.loadKompacts(scope);
    }

    


                            // DEV SIDE //

    //// KOMPS ////
    // Gets all Kompact tags within the scope and turns them into Komps
    loadKompacts(scope){
        let kompacts = scope.getElementsByTagName("kompact");
        
        for(let i = 0; i<kompacts.length; i++){
            let name = kompacts[i].attributes['name'].value;
            let template = this.getTemplate(name);
            let komp = this.createKomp(template);
            this.setKomp(kompacts[i], komp);
        }
    }

    // Adds the node for our Komp as a children of its HTML Kompact tag
    setKomp(target, komp){
        target.replaceChildren(komp);
    }

    // Turns a template into a working Komp (node)
    createKomp(template){
        var komp = document.createElement(template.name);
        komp.innerHTML = template.html;
        if(!isNull(template.type)){
            komp.addEventListener(template.type, ()=>{template.func(komp)});
        }
        return komp;
    }


    //// TEMPLATES ////
    // Get template from template list using name
    getTemplate(name){
        if(!this.template_list.hasOwnProperty(name)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${name}') `;
        }
        return this.template_list[name];
    }

    // Adds a given template to the saved list (if it doesn't already exists)
    addTemplate(template){
        if(this.template_list.hasOwnProperty(template.name)) {
            throw Kompacted.Errors.VALUE_EXISTS+` ('${template.name}') `;
        }
        this.template_list[template.name] = template;
    }

    // Removes a given template from the saved list (if it exists)
    removeTemplate(name){
        if(!this.template_list.hasOwnProperty(name)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${name}') `;
        }
        delete this.template_list[name];
    }

    // Replace a given template in the saved list with a new one (if it exists)
    editTemplate(name, template){
        if(!this.template_list.hasOwnProperty(name)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${name}') `;
        }
        this.template_list[template.name] = template;
    }

    // Saves all templates created
    template_list = {};

    static template = class {
        constructor(name, html, type=undefined, func=()=>{}) {
            this.name = name;
            this.html = html;
            if(!isNull(type)) {
                this.type = type;
                this.func = func;
            }
        }
    }

    static Errors = class{
        static VALUE_NOT_FOUND = "[ERROR]: Value could not be found";  
        static VALUE_EXISTS = "[ERROR]: Value exists already";  
        static UNAUTHORIZED_USE = "[ERROR]: This method should not be accessed manually"
    }
}

function isNull(object){
    if(object === null || object === undefined || object === "" || (typeof(object)===typeof(0) && isNaN(object)) ) return true;
    return false;
}