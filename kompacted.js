class Kompacted{

                            // USER SIDE //

    // Sets the templates (& load all Kompacts using said Templates)
    new(templates, scope=undefined, deep=false){
        templates(this);
        if(!isNull(scope)) {
            this.load(scope, deep);
        };
    }

    // Adds a new template to the list
    add(name, html, type=undefined, func=()=>{}){
        let template = new Kompacted.template(name, html, type, func);
        this.addTemplate(template);
        return template;
    }

    edit(name, html, type=undefined, func=()=>{}){
        let template = new Kompacted.template(name, html, type, func);
        this.editTemplate(name, template);
    }

    // (re)Loads all the Komps within a given scope
    load(scope=undefined, deep=false){
        if(isNull(scope)) scope = document;
        this.loadKompacts(scope, deep);
        this.loadForeach(scope, deep);
    }
    
    set(id, data_array){
       this.setData(id, data_array); 
    }

    


                            // DEV SIDE //

    //// KOMPS ////
    // Gets all Kompact tags within the scope and turns them into Komps
    loadKompacts(scope, deep=false){
        let kompacts = scope.getElementsByTagName("kompact");

        if(!deep) {
            for (let i = 0; i < kompacts.length; i++) {
                let komp = this.getKomp(kompacts[i]);
                this.setKomp(kompacts[i], komp, deep);
            }
        } else {
            while (kompacts.length !== 0) {
                let komp = this.getKomp(kompacts[0]);
                this.setKomp(kompacts[0], komp, deep);
            }
        }
    }
    
    loadForeach(scope, deep=false){
        let foreach = scope.getElementsByTagName("foreach");
        
        if(!deep) {
            for (let i = 0; i < foreach.length; i++) {
                let data = this.getData(foreach[i].getAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE));
                this.setKomps(foreach[i], data, deep);
            }
        } else {
            while (foreach.length !== 0) {
                let data = this.getData(foreach[0].getAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE));
                this.setKomps(foreach[0], data, deep);
            }
        }
    }

    // Adds the node for our Komp as a children of its HTML Kompact tag
    setKomp(target, komp, deep=false){
        if(deep) target.replaceWith(komp);
        else target.replaceChildren(komp);
    }
    
    setKomps(target, data, deep=false){
        let komp_name = target.getAttribute(Kompacted.DefaultValues.FOREACH_AS_KOMP_ATTRIBUTE);
        
        for(let entry in data){
            let komp = this.getKomp(komp_name, data[entry]);
            
            if(!deep) target.appendChild(komp);
            else target.parentNode.insertBefore(komp, target)
        }
        if(deep) target.remove();
    }

    getKomp(kompact, attributes=undefined){
        if(typeof(kompact)!==typeof("u")){
            let name = kompact.getAttribute(Kompacted.DefaultValues.KOMPACT_NAME_ATTRIBUTE);
            let template = this.getTemplate(name);
            return this.createKomp(template, attributes, kompact);
        }
        else {
            let template = this.getTemplate(kompact);
            return this.createKomp(template, attributes);
        }
    }
    
    // Turns a template into a working Komp (node)
    createKomp(template, data=undefined, origin_kompact=undefined){
        let komp = document.createElement(template.name);
        komp.innerHTML = template.html;
        
        if(!isNull(data)){
            for(let attribute in data){
                let attr_data = typeof(data[attribute]) === typeof({}) ? JSON.stringify(data[attribute]) : data[attribute];
                komp.setAttribute(attribute, attr_data);
            }
        }
         
        if(origin_kompact!=null){
            let attributes = origin_kompact.attributes;
            for(let i=0; i<attributes.length; i++){
                if(attributes[i].name!=Kompacted.DefaultValues.KOMPACT_NAME_ATTRIBUTE) komp.setAttribute(attributes[i].name, attributes[i].value);
            }
        }
        
        if(!isNull(template.type)){
            komp.addEventListener(template.type, ()=>{template.func(komp)});
            if(template.type == Kompacted.DefaultValues.LOAD_EVENT_NAME) {
                komp.dispatchEvent(new Event(Kompacted.DefaultValues.LOAD_EVENT_NAME));
            }
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
            throw Kompacted.Errors.VALUE_ALREADY_EXISTS+` ('${template.name}') `;
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
    
    
    
    setData(identifier, array){
        this.stored_data_arrays[identifier]=array;
    }
    
    getData(identifier){
        if(!this.stored_data_arrays.hasOwnProperty(identifier)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${identifier}') `;
        }
        return this.stored_data_arrays[identifier];
    }

    //
    stored_data_arrays ={};

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
        static VALUE_OUT_OF_BOUNDS = "[ERROR]: Value out of bounds";
        static VALUE_ALREADY_EXISTS = "[ERROR]: Value already exists";
        static UNAUTHORIZED_USE = "[ERROR]: This method should not be accessed manually";
    }
    
    
    static editDefaultValues(old_val, new_val){
        console.warn("(editDefaultValues): This method may cause unpredictable behaviours.");
        
        let key;
        
        if(typeof(old_val) !== typeof(7)){
            for(let keys in Kompacted.DefaultValues){
                if(Kompacted.DefaultValues[keys]===new_val) console.warn(Kompacted.Errors.VALUE_ALREADY_EXISTS+` (${new_val})`);
                if(Kompacted.DefaultValues[keys]===old_val) key = keys;
            }
            if(key==undefined) throw Kompacted.Errors.VALUE_NOT_FOUND+` (${old_val})`;
        }
        else{
            key = Kompacted.DefaultValues.getKeyByIndex(old_val);
        }
        
        Kompacted.DefaultValues[key] = new_val;
        
    }
    
    static DefaultValues = class{
        static LOAD_EVENT_NAME = "load";
        static KOMPACT_NAME_ATTRIBUTE = "name";
        static FOREACH_SOURCE_ATTRIBUTE = "src";
        static FOREACH_AS_KOMP_ATTRIBUTE = "as";
        static FOREACH_KOMP_DATA_ATTRIBUTE = "loop-data";
        
        static getKeyByIndex(index){
            const values = Object.keys(this);
            if(values.length < index || 0 > index) throw Kompacted.Errors.VALUE_OUT_OF_BOUNDS+` (${old_val})`;
            return values[index];
        }
        
    }
}

function isNull(object){
    if(object === null || object === undefined || object === "" || (typeof(object)===typeof(0) && isNaN(object)) ) return true;
    return false;
}