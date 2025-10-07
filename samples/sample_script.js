window.addEventListener("load", ()=>{
    const KOMPACTED = new Kompacted();
    
    KOMPACTED.set((kmptd)=>{
        kmptd.new("test_comp_one",
            `
            <div onmouseover="console.log('hey')">
                <p>test_comp_one</p>
            </div>
            `
        );
        
        KOMPACTED.new("test_comp_two",
            `
            <p>test_comp_two</p>
            `,
            "click", ()=>{
                KOMPACTED.edit("test_comp_two",
                        `
                        <div>
                            <p>defe</p>
                        </div>
                        `
                    ); 
                
                KOMPACTED.load(document.getElementById("twos"));
            }
        );
    }, document)  

})