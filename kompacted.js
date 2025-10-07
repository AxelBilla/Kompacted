class Kompacted{
    
    static template_list = {};
    static loadKompacts(){
        let kompacts = document.getElementsByTagName("kompact");
        
        while(kompacts.length!==0){
            let name = kompacts[0].attributes['name'].value;
            let template = this.getTemplate(name);
            let komp = this.createKomp(template);
            this.setKomp(kompacts[0], komp)
        }
    }
    static setKomp(target, komp){
        target.replaceWith(komp);
    }

    static createKomp(template){
        var komp = document.createElement(template.name);
        komp.innerHTML = template.html;
        if(template.type!==undefined){
            // komp is undefinef
            console.log(komp)
            komp.addEventListener(template.type, template.func(komp));
        }
        return komp;
    }

    static getTemplate(name){
        if(!Kompacted.template_list.hasOwnProperty(name)) {
            throw KompactedErrors.VALUE_NOT_FOUND+` '${name}' `;
        }
        return Kompacted.template_list[name];
    }
    
    static set(func){
        func();
        this.loadKompacts();
    }
    
    static template = class template {
        constructor(name, html, type=KompactedValues.unknown_value, func=()=>{condole.log("hd")}) {
            this.name = name;
            this.html = html;
            if(type!==KompactedValues.unknown_value) {
                this.type = type;
                this.func = func;
            }
            Kompacted.template_list[name] = this;
        }
    }
}

class KompactedErrors{
    static VALUE_NOT_FOUND = "[ERROR]: Could not find value";  
    static UNAUTHORIZED_USE = "[ERROR]: This method should not be accessed manually"
}

class KompactedValues{
    static unknown_value = "n/A";
}