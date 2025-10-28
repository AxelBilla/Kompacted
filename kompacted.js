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

    // Replace an existing template with new data
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
    
    // (re)Loads all the Komps within a given scope of all the given instances of Kompacted 
    static load(scope, deep, ...kompacted){
        if(isNull(kompacted)) kompacted = Kompacted.unnamed_list;
        for(let KMPTD of kompacted[0]) {
            KMPTD.load(scope, deep)
        }
    }
    
    // Sets a Data array to a given identifier
    set(id, data_array){
       this.setData(id, data_array); 
    }

    


                            // DEV SIDE //

    static unnamed_list = [];
    static named_list = {};
    constructor(saved=true, name="") {
        if(saved) {
            Kompacted.unnamed_list.push(this)
            if (!isNull(name)) Kompacted.named_list[name] = this;
        }
    }
    
    static getAllKompacted(){
        return Kompacted.unnamed_list;
    }
    
    static getKompacted(identifier){
        if(Kompacted.hasKompacted(identifier)){
            return Kompacted.named_list[identifier];
        }
        else if (Kompacted.unnamed_list.length > identifier){
            return Kompacted.unnamed_list[identifier];
        }
        throw "[getKompacted]: "+Kompacted.Errors.VALUE_NOT_FOUND+` (${identifier})`;
    }

    static hasKompacted(name){
        return Kompacted.named_list.hasOwnProperty(name);
    }
    
    //// KOMPS ////
    // Gets all Kompact tags within a given scope and turns them into Komps
    loadKompacts(scope, deep=false){
        let kompacts = scope.getElementsByTagName(Kompacted.DefaultValues.KOMPACT_HTML_TAG);
    
        if(!deep) {
            for (let i = 0; i < kompacts.length; i++) {
                if (!this.hasTemplate(kompacts[i].getAttribute(Kompacted.DefaultValues.KOMPACT_NAME_ATTRIBUTE))) continue;
                let komp = this.getKomp(kompacts[i]);
                this.setKomp(kompacts[i], komp, deep);
            }
        } else {
            let skips = 0;
            while (kompacts.length!==0 && skips<kompacts.length) {
                if (!this.hasTemplate(kompacts[skips].getAttribute(Kompacted.DefaultValues.KOMPACT_NAME_ATTRIBUTE))) {
                    skips++;
                    continue;
                }
                let komp = this.getKomp(kompacts[skips]);
                this.setKomp(kompacts[skips], komp, deep);
            }
        }
    }
    
    // Gets all Foreach tags within a given scope and turns them into a list of given Komps
    loadForeach(scope, deep=false){
        let foreach = scope.getElementsByTagName(Kompacted.DefaultValues.FOREACH_HTML_TAG);
        if(!deep) {
            for (let i = 0; i < foreach.length; i++) {
                if (!this.hasTemplate(foreach[i].getAttribute(Kompacted.DefaultValues.FOREACH_AS_KOMP_ATTRIBUTE))) continue;
                let hasData = foreach[i].hasAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE);
                let hasCount = foreach[i].hasAttribute(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE);
                if(!(hasData || hasCount)) throw Kompacted.Errors.INVALID_HTML_TAG+` (${target})`
                
                let data = (hasData) ? this.getData(foreach[0].getAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE)) : {[Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE]: foreach[0].getAttribute(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE)};
                this.setKomps(foreach[i], data, deep);
            }
        } else {
            let skips = 0;
            while (foreach.length!==0 && skips<foreach.length) {
                if (!this.hasTemplate(foreach[skips].getAttribute(Kompacted.DefaultValues.FOREACH_AS_KOMP_ATTRIBUTE))) {
                    skips++;
                    continue;
                }
                let hasData = foreach[skips].hasAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE);
                let hasCount = foreach[skips].hasAttribute(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE);
                if(!(hasData || hasCount)) throw Kompacted.Errors.INVALID_HTML_TAG+` (${target})`
                
                let data = (hasData) ? this.getData(foreach[skips].getAttribute(Kompacted.DefaultValues.FOREACH_SOURCE_ATTRIBUTE)) : {[Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE]: foreach[skips].getAttribute(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE)};
                this.setKomps(foreach[skips], data, deep);
            }
        }
    }

    // Adds the node for our Komp as a children of its HTML Kompact tag OR replace its HTML Kompact tag (deep)
    setKomp(target, komp, deep=false){
        if(deep) target.replaceWith(komp);
        else target.replaceChildren(komp);
    }
    
    // Adds a given amount (count/data amount) of nodes of a given Komp
    setKomps(target, data, deep=false){
        let komp_name = target.getAttribute(Kompacted.DefaultValues.FOREACH_AS_KOMP_ATTRIBUTE);
        const appendKomp = (target, komp, deep)=>{
            if(!deep) target.appendChild(komp);
            else target.parentNode.insertBefore(komp, target)
        }
        
        if(!data.hasOwnProperty(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE)){
            let start = (target.hasAttribute(Kompacted.DefaultValues.FOREACH_START_ATTRIBUTE)) ? target.getAttribute(Kompacted.DefaultValues.FOREACH_START_ATTRIBUTE) : 0;
            let end = (target.hasAttribute(Kompacted.DefaultValues.FOREACH_END_ATTRIBUTE)) ? target.getAttribute(Kompacted.DefaultValues.FOREACH_END_ATTRIBUTE) : data.length;
            let count = 0;
            for(let entry in data){
                count++;
                if(count<start) continue;
                if(count>end) break;
                let komp = this.getKomp(komp_name, data[entry], target);
                appendKomp(target, komp, deep);
            }
        } else {
            for(let i = 0; i<data[Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE]; i++){
                let komp = this.getKomp(komp_name, undefined, target);
                appendKomp(target, komp, deep);
            }
            
        }
        if(deep) target.remove();
    }

    // Generates a given Komp from a given name/HTML node
    getKomp(kompact, data_attributes=undefined, origin_kompact=undefined){
        if(typeof(kompact)!==typeof("u")){
            let name = kompact.getAttribute(Kompacted.DefaultValues.KOMPACT_NAME_ATTRIBUTE);
            let template = this.getTemplate(name);
            return this.createKomp(template, data_attributes, kompact);
        }
        else {
            let template = this.getTemplate(kompact);
            return this.createKomp(template, data_attributes, origin_kompact);
        }
    }
    
    // Turns a template into a working Komp (node)
    createKomp(template, data=undefined, origin_kompact=undefined){
        let komp = document.createElement(template.name);
        komp.innerHTML = template.html;
        
        if(!isNull(data) && !data.hasOwnProperty(Kompacted.DefaultValues.FOREACH_COUNT_ATTRIBUTE)){
            if(typeof(data)!==typeof({})){
                komp.setAttribute(Kompacted.DefaultValues.DATA_ATTRIBUTE, data);
            } else {
                for(let attribute in data){
                    let attr_data = typeof(data[attribute]) === typeof({}) ? JSON.stringify(data[attribute]) : data[attribute];
                    komp.setAttribute(attribute, attr_data);
                }
            }
        }
         
        if(origin_kompact!=null){
            let attributes = origin_kompact.attributes;
            for(let i=0; i<attributes.length; i++){
                let condition = (!Kompacted.DefaultValues.isDefault(attributes[i].name, "ATTRIBUTE") || attributes[i].name === Kompacted.DefaultValues.DATA_ATTRIBUTE) 
                if(condition) komp.setAttribute(attributes[i].name, attributes[i].value);
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
        if(!this.hasTemplate(name)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${name}') `;
        }
        this.template_list[template.name] = template;
    }
    
    // Checks if a template exists for a given name
    hasTemplate(name){
        return this.template_list.hasOwnProperty(name);
    }

    // Saves all templates created
    template_list = {};
    
    
    //// DATA ARRAYS ////
    // Sets a space in the stored Data Arrays (identifier) for a given set of Data
    setData(identifier, array){
        this.stored_data_arrays[identifier]=array;
    }
    
    // Get a Data Array by its identifier
    getData(identifier){
        if(!this.hasData(identifier)) {
            throw Kompacted.Errors.VALUE_NOT_FOUND+` ('${identifier}') `;
        }
        return this.stored_data_arrays[identifier];
    }
    
    // Checks if a Data Array exists for a given identifier
    hasData(identifier){
        return this.stored_data_arrays.hasOwnProperty(identifier);
    }

    // Saves all necessary Data Arrays
    stored_data_arrays ={};

    
    
    
    //// UTILITIES ////
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
        static INVALID_HTML_TAG = "[ERROR]: HTML Tag is improperly set";
        static UNAUTHORIZED_USE = "[ERROR]: This method should not be accessed manually";
    }
    
    static DefaultValues = class{
        static KOMPACT_HTML_TAG = "kompact";
        static FOREACH_HTML_TAG = "foreach";
        static LOAD_EVENT_NAME = "load";
        
        static KOMPACT_NAME_ATTRIBUTE = "name";
        static FOREACH_SOURCE_ATTRIBUTE = "src";
        static FOREACH_AS_KOMP_ATTRIBUTE = "as";
        static FOREACH_COUNT_ATTRIBUTE = "count";
        static FOREACH_START_ATTRIBUTE = "start";
        static FOREACH_END_ATTRIBUTE = "end";
        static DATA_ATTRIBUTE = "data";
        static edit(old_val, new_val){
            console.warn(`[DefaultValues] (edit): This method may cause unpredictable behaviours. ('${old_val}' => '${new_val}')`);
            
            let key;
            
            if(typeof(old_val) !== typeof(7)){
                for(let keys in this){
                    if(this[keys]===new_val) console.warn(Kompacted.Errors.VALUE_ALREADY_EXISTS+` (${new_val})`);
                    if(this[keys]===old_val) key = keys;
                }
                if(key==undefined) throw Kompacted.Errors.VALUE_NOT_FOUND+` (${old_val})`;
            }
            else{
                key = this.getKeyByIndex(old_val);
            }
            
            this[key] = new_val;
        }
        
        static getKeyByIndex(index){
            const values = Object.keys(this);
            if(values.length < index || 0 > index) throw Kompacted.Errors.VALUE_OUT_OF_BOUNDS+` (${old_val})`;
            return values[index];
        }
        
        static isDefault(value, snippet=""){
            const values = Object.values(this);
            const keys = Object.keys(this);
            for(let default_value in values){
                if(!keys[default_value].includes(snippet)) continue;
                if(values[default_value]===value) return true;
            }
            return false;
        }
    }
}

// Streamlined access to attribute values
HTMLElement.prototype.Values = function(omit=[]){
    let attribute_list = {};
    for(let i = 0; i<this.attributes.length; i++){
        let attr = this.attributes[i];
        if(omit.includes(attr.name)) continue;
        attribute_list[attr.name]=attr.value;
    }
    
    return attribute_list;
}



function isNull(object){
    if(object === null || object === undefined || object === "" || (typeof(object)===typeof(0) && isNaN(object)) ) return true;
    return false;
}