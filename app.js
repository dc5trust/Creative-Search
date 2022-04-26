const PEXEL_KEY = '563492ad6f9170000100000121493e52a95d4994944fe8904822e918';
//search  
const searchBarText = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-btn');
//elements 
const galleryContainer = document.querySelector('.pexel-gallery-container');
const homeBtn = document.querySelector('.home');
//next image Buttons
const imageViewBtn = document.querySelector('#image-view');
const previousBtn = document.querySelector('#previous-Btn');
const forwardBtn = document.querySelector('#forward-Btn');

//NEXT PAGE BUTTONS
const nextPageContainer = document.querySelector('.next-page-container');
const pageNextBtn = document.querySelector('.fa-angle-right');
const pagePreviousBtn = document.querySelector('.fa-angle-left');
const pageNum = document.querySelector('#page-number');

const ImageStorage = []; 
//global variables 
let currentPageNum = 1; 
//this will be used to determine which 'next page' will be used, either from trending or search results if user used the search bar 
let isSearchActive = false;
let query;
//addEventListeners 
galleryContainer.addEventListener('click', galleryUserClick);
imageViewBtn.addEventListener('click', homeUserClick);
forwardBtn.addEventListener('click', forward);
previousBtn.addEventListener('click', previous);
pageNextBtn.addEventListener('click', nextPage);
pagePreviousBtn.addEventListener('click', previousPage);
searchBtn.addEventListener('click', search);
// homeBtn.addEventListener('click', pullPhotosFromApi)
//this keeps track of the 'next' or 'previous' image within the ARRAY IMAGESTORAGE[]
let imageCurrentIndexLocation;

async function search(currentPage = 1){
    isSearchActive = true;
    //this keeps the same search query 'word' for each iterating page that follows
    if(searchBarText.value !== ''){
        query = searchBarText.value;
        searchBarText.value = ''; 
        currentPageNum = 1;
        pageNum.innerText = currentPageNum;
    }
    console.log(query);
    console.log(currentPage)
    const result = await fetch(`https://api.pexels.com/v1/search/?query=${query}&page=${currentPage}&per_page=12`,{
        headers: {
            authorization: PEXEL_KEY
        }
    })
     //remove items before we switch to the next page.
     const images = document.querySelectorAll('.images');
     const ArrayImages = Array.from(images);
     ArrayImages.forEach((image, index)=>{
         image.remove();
     });
     //empty array before beginning
     ImageStorage.splice(0, ImageStorage.length);
     console.log(ImageStorage.length, 'image storage')
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

function forward(){
    //find location in the array ImageStorage; imageCurrentIndexLocation has Index location of image clicked within an array
    if(imageCurrentIndexLocation < 13){
        imageCurrentIndexLocation++;
        //delete current single image and replace with the following image from the array which holds a SRC 
        const images = document.querySelector('.images').remove();
        //create new DIV to hold src from array from 'imagecurrentindexlocation'
        const newImageDiv = document.createElement('img');
        newImageDiv.classList.add('images');
        newImageDiv.setAttribute('style', 'object-fit: contain');
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
        newImageDiv.setAttribute('style', 'object-fit: contain');
        newImageDiv.classList.add(`${imageCurrentIndexLocation}`)
        newImageDiv.src = ImageStorage[imageCurrentIndexLocation];
        galleryContainer.append(newImageDiv);
    }else if(imageCurrentIndexLocation === 0){
        return 
    }
}

function homeUserClick(e){
    console.log(imageViewBtn.innerText);
    if(imageViewBtn.innerText === 'MULTI-IMAGE VIEW'){
        console.log(e);
        //delete the one image and recall pullPhotosFromAPI 
        const images = document.querySelector('.images').remove();
        //re-add the original grid outline
        galleryContainer.classList.remove('single-grid');
        galleryContainer.classList.add('group-grid');
        nextPageContainer.setAttribute('style', 'opacity: 1');
        //reveal Previous & forward Button for single page view
        previousBtn.setAttribute('style', 'opacity: 0');
        forwardBtn.setAttribute('style', 'opacity: 0');
        //maybe pull images from 'imageStorage' rather than directly from API
        if(isSearchActive === false){
            pullPhotosFromApi(currentPageNum);
        }else if(isSearchActive){
            search(currentPageNum);
        }
        
        imageViewBtn.innerText = 'SINGLE IMAGE VIEW';
    }else if(imageViewBtn.innerText === 'SINGLE IMAGE VIEW'){
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
        // newImageDiv.setAttribute('style', 'object-fit: contain');
        nextPageContainer.setAttribute('style', 'opacity: 0');
        console.log(newImageDiv.style.objectFit);
        newImageDiv.src = ImageStorage[0];
        //hide previous & forward buttons 
        previousBtn.setAttribute('style', 'opacity: 1');
        forwardBtn.setAttribute('style', 'opacity: 1');

        //restructure 'grid' with one image, the one selected by the user 
        restructureGridWithOneImage(newImageDiv);
        imageViewBtn.innerText = 'MULTI-IMAGE VIEW';
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
    //hide previous & forward buttons 
    previousBtn.setAttribute('style', 'opacity: 1');
    forwardBtn.setAttribute('style', 'opacity: 1');
    //hide the next page & previous page buttons ( container )
    nextPageContainer.setAttribute('style', 'opacity: 0');
    //remove the second class from image "image-NUMBER" which has the grid format
    imageClickedOn.classList.remove(imageClickedOn.classList[2]);
    imageCurrentIndexLocation = parseInt(imageClickedOn.classList[1]);
    console.log(imageCurrentIndexLocation);
    imageClickedOn.setAttribute('style', 'object-fit: contain');
    //restructure 'grid' with one image, the one selected by the user 
    restructureGridWithOneImage(imageClickedOn);
    imageViewBtn.innerHTML = 'MULTI-IMAGE VIEW';
    // console.log(ImageStorage.length);
}

function restructureGridWithOneImage(imageSelected){
    //modify grid for only one image 
    galleryContainer.classList.remove('group-grid');
    galleryContainer.classList.add('single-grid');
    galleryContainer.append(imageSelected);
}

async function pullPhotosFromApi (currentPage = 1){
    const result = await fetch(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=12`,{
        headers: {
            authorization: PEXEL_KEY
        }
    })
    //remove items before we switch to the next page.
    const images = document.querySelectorAll('.images');
    const ArrayImages = Array.from(images);
    ArrayImages.forEach((image, index)=>{
        image.remove();
    });
    //empty array before beginning
    ImageStorage.splice(0, ImageStorage.length);
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

pullPhotosFromApi(1);

function nextPage(e){
    if(imageViewBtn.innerText === 'MULTI-IMAGE VIEW') return
    currentPageNum++;
    //update current page on website
    if(isSearchActive === false){
        pageNum.innerText = currentPageNum;
        pullPhotosFromApi(currentPageNum);
    }else if(isSearchActive === true){
        pageNum.innerText = currentPageNum;
        search(currentPageNum);
    }
    
}

function previousPage(e){
    if(imageViewBtn.innerText === 'MULTI-IMAGE VIEW') return
    
    if(currentPageNum === 1){
        return
    }else if (currentPageNum > 1){
        currentPageNum--;
    }
    pageNum.innerText = currentPageNum;
    pullPhotosFromApi(currentPageNum);
    console.log(e);
}   