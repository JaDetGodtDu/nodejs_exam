const petImages = {
    1: '/petimgs/bat.png',
    2: '/petimgs/frog.png',
    3: '/petimgs/jelly.png',
    4: '/petimgs/kitt.png',
    5: '/petimgs/owl.png',
    6: '/petimgs/racoon.png',
    7: '/petimgs/shib.png',
    8: '/petimgs/shroom.png',
    9: '/petimgs/snail.png',
    10: '/petimgs/kitkat.png',
}

export function getPetImg(type) {
    return petImages[type] || '/shiba.gif';
}