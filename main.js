const container = document.querySelector('.third');
const objects = [];


container.addEventListener('click', (e)=>{

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('Координаты клика:', x, y);

    createParticles(x,y);
    
})

function createParticles(x,y){

    const particles = [
        { type: 'stone', x,y, dx: -1, dy: 0, speed: 2},
        { type: 'paper', x,y, dx: 1, dy: 0, speed: 2},
        { type: 'scissor', x,y, dx: 0, dy: 1, speed: 2}
    ];


    for(let i = 0; i < 10; i++){
        particles.forEach((particle) => {

        
    //     const types = ['rock', 'paper', 'scissor'];
    // const type = types[Math.floor(Math.random() * 3)];

    const div = document.createElement('div');
    div.className = `particle ${particle.type}`;
    div.style.position = 'absolute';

    div.style.left = `${particle.x}px`;
    div.style.top = `${particle.y}px`;
    div.style.height = '30px'
    div.style.width = '30px'

    const img = document.createElement('img');
    img.src = `images/${particle.type}.png`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.pointerEvents = 'none'

    div.appendChild(img);
    container.appendChild(div);

    objects.push({
        element: div,
        type: particle.type,
        x: particle.x,
        y: particle.y,
        dx: particle.dx,
        dy: particle.dy,
        speed: particle.speed,
    })
})    

}
animateParticles();
}

function animateParticles(){
    objects.forEach((object)=>{
        object.x += object.dx * object.speed;
        object.y += object.dy * object.speed;


        if(object.x <= 0 || object.x >= container.offsetWidth - 30){
            object.dx = -object.dx;
        }

        if(object.y <= 0 || object.y >= container.offsetHeight - 30){
            object.dy = -object.dy;
        }


        object.element.style.left = `${object.x}px`;
        object.element.style.top = `${object.y}px`;

        objects.forEach((otherObject) =>{
            if(otherObject !== object && isCollision(object, otherObject)){
                handleCollision(object, otherObject)
            }
        })
    })
    //повторяем анимацию
    requestAnimationFrame(animateParticles)
}



//ф-я  дял проверки столкнавения

function isCollision(obj1, obj2) {
    return !(
        obj1.x + 30 < obj2.x ||
        obj1.x > obj2.x + 30 ||
        obj1.y + 30 < obj2.y ||
        obj1.y > obj2.y + 30
    );
}

function handleCollision(obj1, obj2) {
    if(obj1.type === 'stone' && obj2.type === 'scissor'){
        obj2.type = 'stone';
        updateParticleType(obj2)
    } else if(
        obj1.type === 'paper' && obj2.type === 'stone'){
            obj2.type = 'paper';
            updateParticleType(obj2)
        } else if(obj1.type === 'scissor' && obj2.type === 'paper'){

            updateParticleType(obj2)
        }
}

function updateParticleType(particle) {
    const img = particle.element.querySelector('img');
    img.src = `images/${particle.type}.png`;
}
