class User{
    constructor(name, email){
        this.name=name;
        this.email=email;
    }
}

const users = [
    new User("john", "notwit@gmail.com"),
    new User("remie", "baba@nihon.jp"),
    new User("bella", "kanougo.deria@free.fr")
]

window.addEventListener("load", ()=>{
    const KOMPACTED = new Kompacted();
    
    KOMPACTED.set((kmptd)=>{
        kmptd.new("test_comp_one",
            `
            <div onmouseover="console.log('hey')">
                <p>to_be_replaced</p>
                <p>to_be_replaced</p>
            </div>
            `,
            "load", (self)=>{
                let index = self.getAttribute('data');
                let info = self.getAttribute('info');
                let ps = self.getElementsByTagName('p');
                let user = users[index];
                
                ps[0].innerText=user.name;
                if(info!=null) ps[0].innerText+=` (${info})`;
                ps[1].innerText=user.email;
            }
        );
        
        KOMPACTED.new("test_comp_two",
            `
            <p>test_comp_two</p>
            `,
            "click", ()=>{
                KOMPACTED.edit("test_comp_two",
                        `
                        <div>
                            <p>Changed!</p>
                        </div>
                        `
                    ); 
                
                KOMPACTED.load(document, true);
            }
        );
    }, document.getElementById("twos"))  

})