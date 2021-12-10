'use strict'
const APIKEY = "Afg6zw384mGbMR6rXUtz0gYo3bXnK5FGMM0whByZ";


/**
 * this module had all that needed to valid the form
 * include few validFuncs,
 * and Manifests Obj with all the date need to valid
 * @type {{isSolValid: ((function(*): ({isValid: boolean, message: string}))|*), validObj: {}, isDateValid: ((function(*): ({isValid: boolean, message: string}))|*), validDate: (function(*=): {isValid, message: string}), isNotEmpty: (function(*): {isValid: boolean, message: string})}}
 */
const validatorModule = (function () {

    let validObj = {}

    validObj.Manifest = class Manifest
    {
        constructor(landingDate,maxEarthDate,maxSol,rover) {
            this.landingDate = landingDate;
            this.maxSol = maxSol;
            this.maxDate = maxEarthDate;
            this.rover = rover;
        }
    }

    validObj.ValidMissionList = class
    {
        constructor() {
            this.list = [];
        }

        add(rover) {
            this.list.push(rover);
        }
        get(rover)
        {
            if(rover === 'curiosity'){
                rover = 0;
            }
            else if(rover == 'opportunity'){
                rover = 1;
            }
            else if(rover == "spirit"){
                rover = 2;
            }
            else{
                rover = 0;
            }
            return this.list[rover];
        }
    }

    /**
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const isNotEmpty = function (str) {
        return {
            isValid: (str.length !== 0), message: 'please enter input'
        };
    }
    validObj.isNotEmpty = isNotEmpty

    /**
     *
     * @param datesVec = [currentDate,landingDate ,maxDate,roverName]
     * @returns {{isValid: boolean, message: string}}
     */
    const isDateValid = function (datesVec)
    {
        let date = datesVec.date;
        let landingDate = datesVec.ld;
        let maxEarthDate = datesVec.md;

        if(datesVec.rover === ""){
            return{
                isValid: false,
                message: 'rover has not selected'
            }
        }

        //the compare work dua to the use of Date built in date in js
        if(date < landingDate)
        {
            return{
                isValid: false,
                message: `date must be after ${landingDate}`
            }
        }

        else if(date > maxEarthDate){
            return{
                isValid: false,
                message: `date must be after ${maxEarthDate}`
            }
        }
        else{
            return{
                isValid: true,
                message: ""
            }
        }
    }
    validObj.isDateValid = isDateValid

    /**
     *
     * @param str is inputText value, checking id eather date or sol, and not garbage
     * @returns {{isValid: boolean, message: string}}
     */
    const validDate = function (str) {
        return {
            isValid: /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(str) || /^[1-9][0-9]*$/.test(str),
            message: 'text must be a date or a sol'
        };
    }
    validObj.validate = validDate


    /**
     *
     * @param solVec  = [currentSol,maxSol,roverName]
     * @returns {{isValid: boolean, message: string}}
     */
    const isSolValid = function (solVec)
    {
        console.log(solVec.rover);
        if(solVec.rover === ""){
            return{
                isValid: false,
                message: 'rover has not selected'
            }
        }

        if(solVec.sol < 0 || solVec.sol > solVec.maxSol){
            return{
                isValid: false,
                message:`sol must be under max sol: ${solVec[1]}`
            }
        }
        else {
            return{
                isValid: true,
                message: ""
            }
        }
    }
    validObj.isSolValid = isSolValid

    return{
        isNotEmpty,
        isDateValid,
        isSolValid,
        validDate,
        validObj
    }
})();


/**
 * main func
 */

(function (){

    //hold cards for display
    let cardsList = [];

    //card to display after fetch
    class Card {
        constructor(earthDte,solDate,img_src,img_id,camera_mame,rover_name)
        {
            this.earthDate = earthDte;
            this.solDate = solDate;
            this.imgSrc = img_src;
            this.imgId = img_id;
            this.cameraName = camera_mame;
            this.roverName = rover_name;
        }

        getCardImgSrc()
        {
            return this.imgSrc;
        }
        getCardEd()
        {
            return this.earthDate;
        }
        getCardSol()
        {
            return this.solDate;
        }
        getCardImgId()
        {
            return this.imgId;
        }
        getCameraName()
        {
            return this.cameraName;
        }
        getRoverName()
        {
            return this.roverName;
        }
    }

    //---  getting the json and create cards with the data ----
    function createCards(json)
    {
        for(let i = 0; i < json.photos.length; i++)
        {
            let earthDate = json.photos[i].earth_date;
            let solDate = json.photos[i].sol;
            let img_src = json.photos[i].img_src;
            let img_id = json.photos[i].id;
            let camera_name = json.photos[i].camera.name;
            let rover_name = json.photos[i].rover.name;
            let c = new Card(earthDate,solDate,img_src,img_id,camera_name,rover_name);
            cardsList.push(c);
        }

    }

    // --- create dom element cards from the cards -----
    function cardToHtml()
    {
        let returnString = `<div class="container-fluid" id="cards">
                                <div class="row row-cols-1 row-cols-md-3 g-4">`;
        let s = "";
        for (const card of cardsList)
        {
            s+=  `<div className="col">
                                <div class="card" style="width: 18rem;">
                                     <img src="${card.getCardImgSrc()}" class="card-img-top" alt="...">
                                           <div class="card-body">
                                                <h5 class="card-title">img card</h5>
                                                 <p class="card-text">
                                                 <div id="card-img-id" hidden>${card.getCardImgId()}</div>
                                                 <div id="card-earth-date">earth date : ${card.getCardEd()}</div>
                                                 <div id="card-sol">sol : ${card.getCardSol()} </div>
                                                 <div id="card-camera">camera : ${card.getCameraName()}</div>
                                                 <div id="card-rover-name">misiion : ${card.getRoverName()}</div>
                                                  </p>
                                                 <button  class="btn btn-primary card-save-img-btn">save img</button>
                                                 <button  class="btn btn-primary card-full-size-btn">full-size</button>
                                      </div> 
                                </div>
                           </div>`

            returnString+=s;
        }
        returnString+= `</div>
                            </div>`
        return returnString;
    }



    function clearList()
    {
        let i = cardsList.length;
        while(i > 0){
            cardsList.pop();
            i--;
        }
    }


    //will be initial in DOM
    let dateTextInput = null;
    let roverSelectInput = null;
    let cameraSelectInput = null;
    let divDisplayImgResult = null;
    let saveImgList = null;
    let validList = new validatorModule.validObj.ValidMissionList();
    let savedImagesId = [];


    //check status of fetch response
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }

    //fetch a manifest
    function fetchManifest(rover)
    {
        fetchData()
            .catch(msg => {
                console.error(msg);
            })
        async function fetchData()
        {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${APIKEY}`);
            await status(response);
            const json = await response.json();
            const manifest = json.photo_manifest;
            validList.add(new validatorModule.validObj.Manifest(new Date(manifest.landing_date),
                new Date(manifest.max_date),
                manifest.max_sol,
                rover));
        }
    }

    //fetch all 3 manifests
    function fetchManifests()
    {
        fetchManifest('Curiosity');
        fetchManifest('Opportunity');
        fetchManifest('Spirit');
    }

    //this are the properties for isDateValid func
    const buildDateVec = (date,landing_date,max_date) =>{

        let dateVec = {};
        dateVec.date = new Date(date);
        dateVec.ld = (landing_date);
        dateVec.md = (max_date);
        dateVec.rover  = roverSelectInput.value.trim();
        return dateVec;
    }

    //this are the properties for isSolValid func
    function buildSolVec(sol,maxSol){
        let solVec = {};
        solVec.sol = (sol);
        solVec.maxSol = (maxSol);
        solVec.rover = roverSelectInput.value.trim();
        return solVec;
    }

    //generic validInout
    /**
     *
     * @param inputElement
     * @param validateFunc
     * @param value
     * @returns {boolean|*}
     */
    const validateInput = (inputElement,validateFunc,value)=>
    {
        let errorElement = inputElement.nextElementSibling; // the error message div
        let v = validateFunc(value); // call the validation function
        errorElement.innerHTML = v.isValid ? '' : v.message; // display the error message
        v.isValid ? inputElement.classList.remove("is-invalid") : inputElement.classList.add("is-invalid");
        return v.isValid;
    }

    /**
     *
     * @param dateTextInput
     * @param roverSelectInput
     * @param cameraSelectInput
     * @returns {*}
     */
    const validateForm = (dateTextInput, roverSelectInput, cameraSelectInput) => {
        let v1 = validateInput(dateTextInput,validatorModule.isNotEmpty,dateTextInput.value.trim()) &&validateInput(dateTextInput,validatorModule.validDate,dateTextInput.value.trim())
            && ((checkIfDateOrSol(dateTextInput.value) === "date"  ) ?
                validateInput(dateTextInput,validatorModule.isDateValid,buildDateVec(dateTextInput.value,
                        validList.get(roverSelectInput.value).landingDate,
                        validList.get(roverSelectInput.value).maxDate)) :
                validateInput(dateTextInput,validatorModule.isSolValid,buildSolVec(dateTextInput.value,
                                                                                    validList.get(roverSelectInput.value).maxSol)));
        let v3 = validateInput(roverSelectInput,validatorModule.isNotEmpty,roverSelectInput.value);
        let v4 = validateInput(cameraSelectInput,validatorModule.isNotEmpty,cameraSelectInput.value);
        let v = v1 && v3 && v4;
        return v;
    }


    /**
     * check if date input is a sol or a earthdate
     * @param date = string in a form of (YYYY-MM-DD) or a sol number
     * @returns {string}
     */
    function checkIfDateOrSol(date)
    {
        date = date.split("-");
        if(date.length>2){
            return "date";
        }
        else{
            return "sol";
        }
    }

    /**
     * first hide search gif
     * then display fetch img results
     */
    function displayImages()
    {
        document.querySelector("#data").innerHTML = "";
        divDisplayImgResult.innerHTML = cardToHtml();
        attachListeners();
    }

    /**
     *
     * @param event = saveImg button pressed
     */
    const saveImg = (event) =>
    {

        let newImgId = event.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling.textContent;
        if(!savedImagesId.includes(newImgId)){
            savedImagesId.push(newImgId);
            let newLi = document.createElement('li');
            let linkUrl = document.createElement('a');
            let imgUrl = event.target.parentElement.parentElement.firstElementChild.src;
            linkUrl.setAttribute('target', "_blank");
            linkUrl.setAttribute('href', imgUrl)
            let imgIdTxt = "id:" + newImgId;
            linkUrl.append(imgIdTxt);
            newLi.append(linkUrl);
            saveImgList.append(newLi);
            let cardData = "";
            let camera = event.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
            let ed = event.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
            let sol = event.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
            cardData += camera + " ";
            cardData += ed + " ";
            cardData += sol + " ";
            saveImgList.append(document.createElement('div').innerText = cardData);
        }
        else{
            alert("alredy there")
        }
    }

    /**
     * set params
     * fetch
     * check status
     * call createCards func and send the json
     * display result
     * if no picture found display a meesege to user
     */
    function fetchAndDisplayImg()
    {
        let dateOrSOL = "";
        const param = new URLSearchParams();
        dateOrSOL = checkIfDateOrSol(dateTextInput.value.trim());
        dateOrSOL === "date" ? param.append('earth_date', dateTextInput.value.trim()) : param.append('sol', dateTextInput.value.trim());
        param.append('camera', cameraSelectInput.value.trim())
        param.append('api_key', APIKEY);
        const roverName = roverSelectInput.value.trim();
        let value = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverName + '/photos?'
        fetchData()
            .catch(msg => {
                console.error(msg);
            })

        async function fetchData()
        {
            const response = await fetch(value + param.toString());
            await status(response);
            const json = await response.json();
            if(json.photos.length !== 0 ) {
                createCards(json);
                displayImages();
            }
            else {
                document.querySelector("#data").innerHTML = "";
                divDisplayImgResult.innerHTML = `<div class="bg-danger bg-opacity-25 p-3 m-3 text-center"><h4>
               try a different combination
               </h4></div>`
            }
        }
    }

    // reset all div errors
    const resetErrors = function() {
        document.querySelectorAll(".is-invalid").forEach((e) => e.classList.remove("is-invalid"));
        document.querySelectorAll(".errormessage").forEach((e) => e.innerHTML = "");
    }

    //clear form = event clear button pressed
    function clearForm(){
        divDisplayImgResult.innerHTML = "";
        clearList();
        saveImgList.innerHTML = "";
        resetErrors();
    }

    /**
     *
     * @param event = card full size button pressed
     */
    const fullSize = (event) => {
        let imgUrl = event.target.parentElement.parentElement.firstElementChild.src;
        window.open(imgUrl, "_blank");
    }


    function attachListeners() {
        for (const b1 of document.getElementsByClassName("card-save-img-btn"))
            b1.addEventListener('click', saveImg);
        for (const b2 of document.getElementsByClassName("card-full-size-btn"))
            b2.addEventListener('click', fullSize);
    }


    //main DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', function ()
    {
        //initial all dom users = cache
        dateTextInput = document.getElementById("date-text-input");
        roverSelectInput = document.getElementById("rover-select-input");
        cameraSelectInput = document.getElementById("camera-select-input");
        divDisplayImgResult = document.getElementById("imgResult");
        saveImgList = document.getElementById("saved-img-list");
        //call manifests fetches
        fetchManifests();
        //submit pressed
        document.getElementById("button-submit").addEventListener('click', event =>
        {
            clearForm();
            if (validateForm(dateTextInput, roverSelectInput, cameraSelectInput)) {
                document.querySelector("#data").innerHTML = "<img src='/images/loading-buffering.gif'>";
                fetchAndDisplayImg();
            }
        });
        document.getElementById("clear-button").addEventListener('click', clearForm);
    })

})();

