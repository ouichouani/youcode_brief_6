
const LAYER = document.getElementById('layer');
const FORM = document.querySelector('form');
const WORKERS_LIST = document.querySelector('#workers_list');
const SALLES = document.getElementById('salles');
const ZONE_WORKER_LIST = document.querySelector('#zone_workers_list');

const ROOLES = {
    Reception: { employees: ['Réceptionnistes', 'Manager', 'Nettoyage'], limits: 5 },
    salle_serveurs: { employees: ['Techniciens_IT', 'Manager', 'Nettoyage'], limits: 5 },
    salle_securite: { employees: ['sécurité', 'Manager', 'Nettoyage'], limits: 3 },
    salle_conference: { employees: ['Techniciens_IT', 'sécurité', 'Réceptionnistes', 'Manager', 'Nettoyage', 'autre'], limits: 6 },
    salle_personnel: { employees: ['Techniciens_IT', 'sécurité', 'Réceptionnistes', 'Manager', 'Nettoyage', 'autre'], limits: 4 },
    salle_archives: { employees: ['Techniciens_IT', 'sécurité', 'Réceptionnistes', 'Manager'], limits: 2 },
}

//FETCH DATA FROM LOCAL STORAGE
const BASE_DATA = localStorage.getItem('workers') ? JSON.parse(localStorage.getItem('workers')) : [];
let DATA = [...BASE_DATA];

function ADD_EXPERIENCE_INPUTS_EVENT(item) {
    const CLONED_INPUTS = item.closest(".Experience").cloneNode(true);
    CLONED_INPUTS.querySelector('button.delete_button').classList.remove('hidden');
    CLONED_INPUTS.querySelector('button.add_button').addEventListener('click', (e) => ADD_EXPERIENCE_INPUTS_EVENT(e.currentTarget))
    CLONED_INPUTS.querySelector('button.delete_button').addEventListener('click', (e) => { e.currentTarget.closest(".Experience").remove() })
    FORM.querySelector('#Expériences_container').appendChild(CLONED_INPUTS);
}
FORM.addEventListener('submit', (e) => HANDLESUBMIT(e));
FORM.querySelector('#Expériences_container button.add_button').addEventListener('click', (e) => ADD_EXPERIENCE_INPUTS_EVENT(e.currentTarget));

LAYER.addEventListener('click', DISPLAY_FORM);
document.getElementById('display_form').addEventListener('click', DISPLAY_FORM);
document.getElementById('close_form').addEventListener('click', DISPLAY_FORM);
document.getElementById('close_zone_workers_list').addEventListener('click', () => document.getElementById('close_zone_workers_list').parentElement.classList.toggle('hidden'));

//ADD EVENT LISTINER TO EACH BUTTON IN AREA
SALLES.querySelectorAll('section button').forEach(item => {
    item.addEventListener('click', () => {
        if (!WORKERS_LIST.childElementCount) return DISPLAY_TOST('red', 'there is no disponible worker')
        SHOW_SALL_WORKERS(item.parentElement);
    })
});

//SHOW A LIST THAT SHOW ALL DISPO WORKERS FOR A SPECIFIC SALL
function SHOW_SALL_WORKERS(sall) {

    ZONE_WORKER_LIST.innerHTML = '';
    const WORKERS_LIST_ITEMS = Array.from(WORKERS_LIST.querySelectorAll('div[id]'));

    const FILTRED_ARRAY = WORKERS_LIST_ITEMS.filter((item) => ROOLES[sall.id].employees.includes(DATA.find(obj => obj.id == item.id).specialite));
    if (!FILTRED_ARRAY.length) return DISPLAY_TOST('red', 'there is no disponible worker for this area');
    document.getElementById('close_zone_workers_list').parentElement.classList.remove('hidden');

    //FILL THE ZONE_WORKER_LIST
    FILTRED_ARRAY.forEach(item => {
        const CLONE = item.cloneNode(true);
        ZONE_WORKER_LIST.appendChild(CLONE);
    });

    //I USE THIS METHOD TO DELETE EVENT LATER
    function ADD_WORKER_VERIFICATOR_EVENT(event) {
        if (sall.querySelector('.worker_container').childElementCount < ROOLES[sall.id].limits && event.currentTarget.classList.contains('disponible')) {
            ADD_WORKER_TO_AREA(sall, event.currentTarget);
        }
    }

    Array.from(ZONE_WORKER_LIST.children).forEach(item => {
        item.addEventListener('click', ADD_WORKER_VERIFICATOR_EVENT)
    })
}

function ADD_WORKER_TO_AREA(sall, worker) {

    //ADD WORKER TO AREA

    sall.querySelector('.worker_container').appendChild(worker);
    worker.classList.add('area_worker')
    worker.classList.remove('disponible')

    //REMOVE WORKER FROM WORKER LIST
    DATA = DATA.filter(item => item.id != worker.id);
    DISPLAY_WORKERS(DATA);

}

function DISPLAY_FORM() {
    FORM.classList.toggle('hidden');
    LAYER.classList.toggle('hidden');
}

function DISPLAY_TOST(color, message) {
    console.log('color : ', color, 'messahe : ', message)
}

function CHANGE_LOCAL_STORAGE(array) {
    localStorage.setItem('workers', JSON.stringify(array))
}

//INDICATE THAT FORM DATA IS INVALIDE
function INVALID_DATA(message, invalid_input) {
    invalid_input.style.border = '3px solid red'
    DISPLAY_TOST('red', message);
    return;
}

//INDICATE THAT FORM DATA IS VALID
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
    CHANGE_LOCAL_STORAGE(DATA);
}

//VALIDATE SUBMITED DATA
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

    if (!image.value) data.data.image = 'img/default.jpg';


    for (key in data.data) {
        const value = data.data[key]
        const validator = data.validators[key];

        if (!value || !validator.test(value)) {
            return INVALID_DATA(data.messages[key], FORM[key]);
        }
    }

    data.data.id = Date.now();
    return data.data


}

//VALIDATE SUBMITED EXPERIENCE DATA
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
        Experiences.push({ experience: FORM['Expériences'].value, role: FORM['exp_role'].value, from: fromDate, to: toDate })
    }



    return Experiences;
}

function CREATE_WORKER(data) {

    const WORKER = document.createElement('div');
    WORKER.setAttribute('draggable', true);
    WORKER.setAttribute('id', data.id);
    console.log(DATA);

    WORKER.className = 'disponible worker relative flex gap-[15px] md:flex-col lg:flex-row items-center w-full lg:w-full md:w-fit min-w-[180px] h-fit bg-red-200 rounded-[5px] p-[10px]'
    WORKER.innerHTML = `
                <img src="${data.image}" alt="" class="w-[45px] aspect-[1/1] bg-red-200  object-cover rounded-full">
                <div>
                    <p class="name md:text-start text-center">${data.name}</p>
                    <p class="post md:text-start text-center">${data.specialite}</p>
                </div>
                <button class="hidden">&times;</button>
                    ` ;

    // <button class="hidden absolute sm:static md:absolute right-[15px]">&times;</button>

    WORKERS_LIST.appendChild(WORKER);

    DISPLAY_TOST('green', 'worker addes with success');
    WORKER.addEventListener('click', () => SHOW_WORKER_DATA(data));

}

function DISPLAY_WORKERS(array) {

    WORKERS_LIST.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        const WORKER = document.createElement('div');
        WORKER.setAttribute('draggable', true);
        WORKER.setAttribute('id', array[i].id);
        WORKER.className = 'disponible worker relative flex gap-[15px] md:flex-col lg:flex-row items-center w-full lg:w-full md:w-fit min-w-[180px] h-fit bg-red-200 rounded-[5px] p-[10px]'

        WORKER.innerHTML = `
                <img src="${array[i].image}" alt="" class="w-[45px] aspect-[1/1] bg-red-200  object-cover rounded-full">
                <div>
                    <p class="name md:text-start text-center">${array[i].name}</p>
                    <p class="post md:text-start text-center">${array[i].specialite}</p>
                </div>
                <button class="hidden absolute sm:static md:absolute right-[15px]">&times;</button>

                    ` ;

        WORKERS_LIST.appendChild(WORKER);

    }

}

function SHOW_WORKER_DATA(data) {
    return;
}




DISPLAY_WORKERS(BASE_DATA)

// const data = {
//     workers: [],
//     Reception: [],
//     salle_serveurs: [],
//     salle_securite: [],
//     salle_conference: [],
//     salle_personnel: [],
//     salle_archives: []
// } 