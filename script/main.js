

const LAYER = document.getElementById('layer');
const FORM = document.querySelector('form');



function INVALID_DATA (data){
    return ;
}

function SUBMIT_VALIDATION (data){
    return ;
}

function HANDLESUBMIT(e) {

    e.preventDefault();
    const { name, specialite, image, email, phone } = FORM

    const data = {
        
        data : {
            name: name.value,
            image: image.value,
            email: email.value,
            phone: phone.value,
            specialite: specialite.value
        },

        validators : {
            name: /^[a-zA-Z][a-zA-Z ]{3,20}$/,
            image : /^.*\.(jpg|jpeg|png|gif|webp|svg)$/i,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0][5-8][0-9]{8}$/ ,
            specialite : /^[a-zA-Z_ é]{3,20}$/
        },

        messages : {
            name: 'name is invalude , must be between 4 and 20 character',
            image:'img is invalid , must be ended with img extention' ,
            phone: 'phone number is invalid , must start with 0 and contain 10 numbers',
        }
    }

    //VALIDATION
    for( key in data.data ){
        if(!data.data[key] && !data.validators[key].test(data.data[key])){
            return INVALID_DATA()
        }
    }

    SUBMIT_VALIDATION(data) ;
}


FORM.addEventListener('submit', (e) => HANDLESUBMIT(e));
