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
    
    KOMPACTED.new((kmptd)=>{
        kmptd.add("test_comp_one",
            `
            <div onmouseover="console.log('hey')">
                <p>to_be_replaced</p>
                <p>to_be_replaced</p>
            </div>
            `,
            "load", (self)=>{
                let index = self.Values().data;
                let info = self.getAttribute('info');
                let ps = self.getElementsByTagName('p');
                let user = users[index];
                
                ps[0].innerText=user.name;
                if(info!=null) ps[0].innerText+=` (${info})`;
                ps[1].innerText=user.email;
            }
        );
        
        KOMPACTED.add("test_comp_two",
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
        
        kmptd.set("users", users);
        
        kmptd.add("test_comp_three",
            `
            <h1>forEach (users)</h1>
            <p>name</p>
            <p>email</p>
            `,
            "load", (self)=>{
                let name = self.Values().name;
                let email = self.Values().email;
                let ps = self.getElementsByTagName('p');
                ps[0].innerText=name;
                ps[1].innerText=email;
            }
        );
        
        kmptd.set("arr", [643, 864, 455])
        
        kmptd.add("test_comp_four",
            `
            <h1>forEach (num)</h1>
            <p>Number: <span>x</span></p>
            `,
            "load", (self)=>{
                let num = self.Values().data;
                let spn = self.getElementsByTagName('span');
                spn[0].innerText=num;
            }
        );
        
    }, document.getElementById("twos"))  

})