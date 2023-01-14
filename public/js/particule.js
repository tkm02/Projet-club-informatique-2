let canvas = document.querySelector('#canvas1');
let ctx    = canvas.getContext('2d');
let particuleTab = [];
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

class Particule{
    constructor(x,y,directionX,directionY,taille,couleur){
        this.x          = x;
        this.y          = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.taille     = taille;
        this.couleur    = couleur; 
    }

    dessine(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.taille,0,Math.PI * 2,false);
        ctx.fillStyle = this.couleur;
        ctx.fill();
    }

    MAJ(){
        if (this.x + this.taille > canvas.width || this.x - this.taille < 0) {
            this.directionX = -this.directionY;
        }
        if (this.y + this.taille > canvas.height || this.y - this.taille < 0) {
            this.directionY = -this.directionX;
        }
        this.x+= this.directionX;
        this.y+= this.directionY;
        this.dessine();
    }

}

function intialisation(){
    for (let i = 0; i < 150; i++) {
        let taille = (Math.random() + 0.01) *20;
        let x      = Math.random()*(window.innerWidth -taille*2);
        let y      = Math.random()*(window.innerHeight -taille*2);
        let directionX = (Math.random()*0.8)-0.4;
        let directionY = (Math.random()*0.8)-0.4;
        let couleur    = "#fff"; 
        particuleTab.push(new Particule(x,y,directionX,directionY,taille,couleur));
    }

}
intialisation();
animation();
console.log(particuleTab);

function animation(){
    requestAnimationFrame(animation);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

    for (let i = 0; i < particuleTab.length; i++) {
       particuleTab[i].MAJ()
        
    }
}


function resize(){
    intialisation();
    animation();
}
let doit;

window.addEventListener('resize',()=>{
    clearTimeout(doit);
    doit = setTimeout(resize,100);
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
})
const obj1 = new Particule(300,300,50,50,40,'white');
obj1.dessine();