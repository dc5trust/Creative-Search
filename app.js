const PEXEL_KEY = '563492ad6f9170000100000121493e52a95d4994944fe8904822e918';
//
const galleryContainer = document.querySelector('.pexel-gallery-container');
const images = document.querySelectorAll('.images');

async function pullPhotosFromApi (){
    const result = await fetch('https://api.pexels.com/v1/curated?page=1&per_page=14',{
        headers: {
            authorization: PEXEL_KEY
        }
    })
    const photos = await result.json();
    console.log(photos);

   photos.photos.forEach((photo, index)=>{
    console.log(photo.src.original);
    const imgContainer = document.createElement('img');
    const darkBackground = document.createElement('div');
    const downloadBtn = document.createElement('i');
    // const fullScreenBtn = document.creatElement('i');
    downloadBtn.setAttribute('class', 'fa-solid fa-download');
    // fullScreenBtn.setAttribute('class', 'fa-solid fa-expand');
    imgContainer.src = photo.src.original;
    darkBackground.setAttribute('class', `dark-background image-${index}`);
    imgContainer.setAttribute('class',  `images` );
    darkBackground.append(downloadBtn);
    // darkBackground.append(fullScreenBtn);
    darkBackground.append(imgContainer);
    
    
    galleryContainer.append(darkBackground);
   });
}

pullPhotosFromApi();

// images.forEach((images)=>{
//     images.addEventListener('click', (e)=>{
//         console.log(e);
//     })
// })

galleryContainer.addEventListener('click', (e)=>{
    // const galleryContainer = document.querySelector('.pexel-gallery-container');
    console.log(e.target);
})