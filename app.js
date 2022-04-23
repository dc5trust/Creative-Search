const PEXEL_KEY = '563492ad6f9170000100000121493e52a95d4994944fe8904822e918';
//
const galleryContainer = document.querySelector('.pexel-gallery-container');
const homeBtn = document.querySelector('#home-Btn');
const previousBtn = document.querySelector('#previous-Btn');
const forwardBtn = document.querySelector('#forward-Btn');

const ImageStorage = []; 


//addEventListeners 
galleryContainer.addEventListener('click', galleryUserClick);
homeBtn.addEventListener('click', homeUserClick);
forwardBtn.addEventListener('click', forward);
previousBtn.addEventListener('click', previous);

//this keeps track of the 'next' or 'previous' image within the ARRAY IMAGESTORAGE[]
let imageCurrentIndexLocation;

function forward(){
    //find location in the array ImageStorage; imageCurrentIndexLocation has Index location of image clicked within an array
    if(imageCurrentIndexLocation < 13){
        imageCurrentIndexLocation++;
        //delete current single image and replace with the following image from the array which holds a SRC 
        const images = document.querySelector('.images').remove();
        //create new DIV to hold src from array from 'imagecurrentindexlocation'
        const newImageDiv = document.createElement('img');
        newImageDiv.classList.add('images');
        newImageDiv.classList.add(`${imageCurrentIndexLocation}`)
        newImageDiv.src = ImageStorage[imageCurrentIndexLocation];
        galleryContainer.append(newImageDiv);
    }else if(imageCurrentIndexLocation > 13){
        return 
    }
}

function previous(){
    if(imageCurrentIndexLocation <= 13 && imageCurrentIndexLocation >0){
        imageCurrentIndexLocation--;
        //delete current single image and replace with the following image from the array which holds a SRC 
        const images = document.querySelector('.images').remove();
        //create new DIV to hold src from array from 'imagecurrentindexlocation'
        const newImageDiv = document.createElement('img');
        newImageDiv.classList.add('images');
        newImageDiv.classList.add(`${imageCurrentIndexLocation}`)
        newImageDiv.src = ImageStorage[imageCurrentIndexLocation];
        galleryContainer.append(newImageDiv);
    }else if(imageCurrentIndexLocation === 0){
        return 
    }
}

function homeUserClick(e){
    console.log(homeBtn.innerText);
    if(homeBtn.innerText === 'MULTI-IMAGE VIEW'){
        console.log(e);
        //delete the one image and recall pullPhotosFromAPI 
        const images = document.querySelector('.images').remove();
        //re-add the original grid outline
        galleryContainer.classList.remove('single-grid');
        galleryContainer.classList.add('group-grid');
        //maybe pull images from 'imageStorage' rather than directly from API
        pullPhotosFromApi();
        homeBtn.innerText = 'SINGLE IMAGE VIEW';
    }else if(homeBtn.innerText === 'SINGLE IMAGE VIEW'){
        const images = document.querySelectorAll('.images');
        const ArrayImages = Array.from(images);
        ArrayImages.forEach((image, index)=>{
            image.remove();
        });
        //imagecurrentindexlocation, let's forward/previus button work with the array of images without it, it will not know where to go. We begin at ZERO, as that's the default location upon pressing single image view
        imageCurrentIndexLocation = 0;
        const newImageDiv = document.createElement('img');
        newImageDiv.classList.add('images');
        // newImageDiv.style.objectFit = 'contain';
        newImageDiv.setAttribute('style', 'object-fit: contain');
        console.log(newImageDiv.style.objectFit);
        newImageDiv.src = ImageStorage[0];
        //restructure 'grid' with one image, the one selected by the user 
        restructureGridWithOneImage(newImageDiv);
        homeBtn.innerText = 'MULTI-IMAGE VIEW';
    }
    
}

function galleryUserClick(e){
    console.log(e.target);
    const imageClickedOn = e.target;
    //remove all images
    const images = document.querySelectorAll('.images');
    const ArrayImages = Array.from(images);
    ArrayImages.forEach((image, index)=>{
        image.remove();
    });
    //remove the second class from image "image-NUMBER" which has the grid format
    imageClickedOn.classList.remove(imageClickedOn.classList[2]);
    imageCurrentIndexLocation = parseInt(imageClickedOn.classList[1]);
    console.log(imageCurrentIndexLocation);
    imageClickedOn.setAttribute('style', 'object-fit: contain');
    //restructure 'grid' with one image, the one selected by the user 
    restructureGridWithOneImage(imageClickedOn);
    homeBtn.innerHTML = 'MULTI-IMAGE VIEW';
    // console.log(ImageStorage.length);
}

function restructureGridWithOneImage(imageSelected){
    //modify grid for only one image 
    galleryContainer.classList.remove('group-grid');
    galleryContainer.classList.add('single-grid');
    galleryContainer.append(imageSelected);
}

async function pullPhotosFromApi (currentPage){
    const result = await fetch(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=14`,{
        headers: {
            authorization: PEXEL_KEY
        }
    })
    //empty array before beginning
    ImageStorage.slice(0, ImageStorage.length);
    const photos = await result.json();
    photos.photos.forEach((photo, index)=>{
    const imgContainer = document.createElement('img');
    ImageStorage.push(photo.src.portrait);
    imgContainer.src = photo.src.original;
    imgContainer.setAttribute('class',  `images ${index} image-${index}` );
    galleryContainer.classList.add('group-grid');
    galleryContainer.append(imgContainer);
   });
}

pullPhotosFromApi(2);