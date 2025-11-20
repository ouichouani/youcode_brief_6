

const LAYER = document.getElementById('layer');
const FORM = document.querySelector('form');

let DATA = [];
FITCH_WORKERS(DATA);



function DISPLAY_TOST(color, message) {
    console.log('color : ', color, 'messahe : ', message)
    return;
}

function FITCH_WORKERS(array) {
    array = localStorage.getItem('workers') ? JSON.parse(localStorage.getItem('workers')) : [] ;
}

function CHANGE_LOCAL_STORAGE(array) {
    localStorage.setItem('workers', JSON.stringify(array))
}

function INVALID_DATA(message, invalid_input) {
    invalid_input.style.border = '3px solid red'
    DISPLAY_TOST('red', message);
    return;
}

function SUBMIT_VALID_DATA(data) {


    for (let i = 0; i < FORM.length; i++) {
        FORM[i].style.border = 'none';
    }


    DISPLAY_TOST('green', 'worker is created successfuly');

}

function HANDLESUBMIT(e) {

    e.preventDefault();

    const EXPERIENCE = VALIDATION_EXPERIENCES_DATA();
    const FORM_DATA = VALIDATION_FROM_DATA()
    if (!EXPERIENCE || !FORM_DATA) return;

    DATA.push({ ...FORM_DATA, "Experiences": EXPERIENCE });

    CREATE_WORKER({ ...FORM_DATA, "Experiences": EXPERIENCE });
    CHANGE_LOCAL_STORAGE(DATA)
}

function VALIDATION_FROM_DATA() {
    const { name, specialite, image, email, phone } = FORM

    const data = {

        data: {
            name: name.value,
            image: image.value,
            email: email.value,
            phone: phone.value,
            specialite: specialite.value
        },

        validators: {
            name: /^[a-zA-Z][a-zA-Z ]{3,20}$/,
            image: /^(?:$|[A-Za-z0-9_\-\/\.\:]+?\.(jpg|jpeg|png|gif|webp|svg))$/i,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0][5-8][0-9]{8}$/,
            specialite: /^[a-zA-Z_ é]{3,20}$/
        },

        messages: {
            name: 'name is invalude , must be between 4 and 20 character',
            image: 'img is invalid , must be ended with img extention',
            phone: 'phone number is invalid , must start with 0 and contain 10 numbers',
            email: "email musn't be empty and it should contain @ "
        }
    }

    if (!image.value) data.data.image = 'default.jpg';

    for (key in data.data) {
        const value = data.data[key]
        const validator = data.validators[key];

        if (!value || !validator.test(value)) {
            return INVALID_DATA(data.messages[key], FORM[key]);
        }
    }

    return data.data


}

function VALIDATION_EXPERIENCES_DATA() {

    const Experiences = [];

    if (FORM.querySelectorAll('#Expériences_container div > div:first-of-type').length > 1) {
        for (let i = 0; i < FORM.querySelectorAll('#Expériences_container div > div:first-of-type').length; i++) {

            const fromDate = new Date(FORM['from'][i].value);
            const toDate = new Date(FORM['to'][i].value);

            if (!(FORM['Expériences'][i].value.trim())) {
                return INVALID_DATA('Experience can not be empty', FORM['Expériences'][i]);
            }

            if (!(FORM['exp_role'][i].value.trim())) {
                return INVALID_DATA('role can not be empty', FORM['exp_role'][i]);
            }
            if (fromDate > toDate) {
                return INVALID_DATA('date is incorrect logicly', FORM['from'][i]);
            }
            //IF THERE IS NO EXEPTION , SAVE THE OBJECT
            Experiences.push({ experience: FORM['Expériences'][i].value, role: FORM['exp_role'][i].value, from: fromDate, to: toDate })
        }

    } else {
        const fromDate = new Date(FORM['from'].value);
        const toDate = new Date(FORM['to'].value);
        if (!(FORM['Expériences'].value.trim())) {
            return INVALID_DATA('Experience can not be empty', FORM['Expériences']);
        }

        if (!(FORM['exp_role'].value.trim())) {
            return INVALID_DATA('role can not be empty', FORM['exp_role']);
        }

        if (fromDate > toDate) {
            return INVALID_DATA('date is incorrect logicly', FORM['from']);
        }

        //IF THERE IS NO EXEPTION , SAVE THE OBJECT
        Experiences.push({ experience: FORM['Expériences'].value , role: FORM['exp_role'].value, from: fromDate, to: toDate })
    }



    return Experiences;
}

function CREATE_WORKER(data) {
    console.log(data);
}

FORM.addEventListener('submit', (e) => HANDLESUBMIT(e));
