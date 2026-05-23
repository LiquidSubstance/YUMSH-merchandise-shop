window.addEventListener('load', () => {
    const bg1 = document.querySelector('.background-image-1');
    const bg2 = document.querySelector('.background-image-2');
    let i = 0;
    let image_list = [
        "../contents/background_images/background1.png",
        "../contents/background_images/background2.png",
        "../contents/background_images/background3.png",
        "../contents/background_images/background4.png",
        "../contents/background_images/serenityv2.png"
    ];
    image_list.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    let curr = 0;
    bg1.style.backgroundImage = "url(" + image_list[curr] + ")";
    let active = bg1;
    let hidden = bg2;
    setInterval(() => {
        curr = (curr + 1) % image_list.length;
        hidden.style.backgroundImage = "url(" + image_list[curr] + ")";
        hidden.style.opacity = 1;
        active.style.opacity = 0;
        [active, hidden] = [hidden, active];
    }, 3000);
})