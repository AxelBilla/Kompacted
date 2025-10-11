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
                let index = self.getAttribute('data');
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
            <h1>forEach</h1>
            <p>name</p>
            <p>email</p>
            `,
            "load", (self)=>{
                let name = self.getAttribute('name');
                let email = self.getAttribute('email');
                let ps = self.getElementsByTagName('p');
                ps[0].innerText=name;
                ps[1].innerText=email;
            }
        );
    }, document.getElementById("twos"))  

})