//SHOW_PROFAILE



//FETCH DATA FROM LOCAL STORAGE
const BASE_DATA = localStorage.getItem('workers') ? JSON.parse(localStorage.getItem('workers')) : { workers: [], Reception: [], salle_conference: [], salle_serveurs: [], salle_securite: [], salle_personnel: [], salle_archives: [] };
const TOAST_CONTAINER = document.getElementById('toast_container') ;
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

let DATA = BASE_DATA.workers;



function EVENT_LISTINERS() {

    document.getElementById('display_form').addEventListener('click', () => DISPLAY_ITEM(FORM));
    document.getElementById('close_form').addEventListener('click', () => DISPLAY_ITEM(FORM));
    document.getElementById('close_zone_workers_list').addEventListener('click', () => DISPLAY_ITEM(ZONE_WORKER_LIST.parentElement));

    FORM.addEventListener('submit', (e) => HANDLESUBMIT(e));
    console.log(FORM.querySelector('#Expériences_container button.add_button'))
    FORM.querySelector('#Expériences_container button.add_button').addEventListener('click', (e) =>ADD_EXPERIENCE_INPUTS_EVENT(e.currentTarget));

    function ADD_EXPERIENCE_INPUTS_EVENT(item) {
        const CLONED_INPUTS = item.closest(".Experience").cloneNode(true);
        CLONED_INPUTS.querySelector('button.delete_button').classList.remove('hidden');
        CLONED_INPUTS.querySelector('button.add_button').addEventListener('click', (e) => ADD_EXPERIENCE_INPUTS_EVENT(e.currentTarget))
        CLONED_INPUTS.querySelector('button.delete_button').addEventListener('click', (e) => { e.currentTarget.closest(".Experience").remove() })
        FORM.querySelector('#Expériences_container').appendChild(CLONED_INPUTS);
    }

    LAYER.addEventListener('click', () => {

        // CONTROLE FORM , ZONE_WORKER_LIST & WORKER PROFILE
        FORM.classList.contains('active') && DISPLAY_ITEM(FORM);
        ZONE_WORKER_LIST.parentElement.classList.contains('active') && DISPLAY_ITEM(ZONE_WORKER_LIST.parentElement);

        if (document.querySelector('.profaile')) {
            LAYER.classList.add('hidden');
            document.querySelector('.profaile').remove();
        }

    });

    //ADD EVENT LISTINER TO EACH BUTTON IN AREA
    SALLES.querySelectorAll('section button').forEach(item => {
        item.addEventListener('click', () => {
            if (!WORKERS_LIST.childElementCount) return DISPLAY_TOST('red', 'there is no disponible worker')
            SHOW_SALL_WORKERS(item.parentElement);
        })
    });

}

SALLES.querySelectorAll('section[id]').forEach((container) => {

    BASE_DATA[container.id].forEach(item => {
        const WORKER = document.createElement('div');
        WORKER.setAttribute('draggable', true);
        WORKER.setAttribute('id', item.id);

        WORKER.className = 'area_worker worker relative flex gap-[15px] md:flex-col lg:flex-row items-center w-full lg:w-full md:w-fit min-w-[180px] h-fit bg-red-200 rounded-[5px] p-[10px]'
        WORKER.innerHTML = `
                <img src="${item.image}" alt="" class="w-[45px] aspect-[1/1] bg-red-200  object-cover rounded-full">
                <div>
                    <p class="name md:text-start text-center">${item.name}</p>
                    <p class="post md:text-start text-center">${item.specialite}</p>
                </div>
                <button class="hidden">&times;</button>
                    ` ;

        container.querySelector('section').appendChild(WORKER);
        WORKER.addEventListener('click', () => SHOW_PROFILE(container, WORKER));


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

    //SHOW LIST AFTER FILL IT 
    if (ZONE_WORKER_LIST.childElementCount) {

        ZONE_WORKER_LIST.parentElement.classList.add('active');
        LAYER.classList.remove('hidden')

        Array.from(ZONE_WORKER_LIST.children).forEach(item => {
            item.addEventListener('click', () => {
                if (sall.querySelector('.worker_container').childElementCount < ROOLES[sall.id].limits && item.classList.contains('disponible')) {
                    ADD_WORKER_TO_AREA(sall, item);
                    if (!ZONE_WORKER_LIST.childElementCount) {
                        DISPLAY_ITEM(ZONE_WORKER_LIST.parentElement)
                    }
                }
            })
        });
    }
}

function SHOW_PROFILE(sall, worker) {

    LAYER.classList.remove('hidden');

    function HIDE_PROFILE() {
        LAYER.classList.add('hidden');
        DIV.remove();
    }
    
    const WORKER_INFO = BASE_DATA[sall.id].find(item => item.id == worker.id);
    const DIV = document.createElement('div');
    DIV.className = 'profaile active absolute bg-green-500 w-[30vw] max-w-[350px] max-h-[80vh] min-w-fit top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] px-[5px] py-[10px] rounded-[10px] flex justify-center z-10';
    DIV.innerHTML = ` 
        <button  class="absolute top-0 right-[5px] cursor-pointer">&times;</button>
        <div class="flex flex-col items-center gap-[5px] w-[50%] py-[5%] ">
            <img src = '${WORKER_INFO.image}' class="w-[40%] object-cover rounded-full bg-center " alt = 'worker profail image' >
            <p class="w-fit bg-red-300"> ${WORKER_INFO.name} </p>
            <p class="w-fit bg-red-300"> ${WORKER_INFO.specialite} </p>
            <p class="w-fit bg-red-300"> ${WORKER_INFO.email} </p>
            <p class="w-fit bg-red-300"> ${WORKER_INFO.phone} </p>
            <p class="w-fit bg-red-300"> ${sall.id} </p>
            ${worker.classList.contains('area_worker') ? '<button class="bg-red-500 rounded-[10px] p-[10px]" title="remove this worker from this area back to list">remove</button>' : ''}

        </div>
        
        <div class="flex flex-col bg-green-200 w-[50%] overflow-auto"> 
        ${WORKER_INFO.Experiences.map(item =>
        `<div class="Experience flex flex-col bg-green-100 w-full p-[10px] rounded-[10px] items-center">
                <p>${item.experience}</p>
                <p>${item.role}</p>
                <p>from ${new Date(item.from).toDateString()}</p>
                <p>to ${new Date(item.to).toDateString()}</p>
            </div>`).join("</br>")}
        </div>

         ` ;
    DIV.querySelector('button:first-child').addEventListener('click', HIDE_PROFILE);
    if (DIV.querySelector('button:last-child')) {
        DIV.querySelector('button:last-child').addEventListener('click', () => {
            HIDE_PROFILE();
            REMOVE_WORKER_FROM_AREA(sall ,worker);
        });
    }
    document.body.appendChild(DIV);
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
    WORKER.addEventListener('click', () => SHOW_PROFILE({ id: 'workers' }, WORKER));

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

        WORKER.addEventListener('click', () => SHOW_PROFILE({ id: 'workers' }, WORKER));
        WORKERS_LIST.appendChild(WORKER);


    }

}

function DISPLAY_TOST(color, message) {
    const TOAST = document.createElement('div') ;
    TOAST.className = `w-fill h-[50px] flex items-center rounded-[5px] p-[5px] text-white flex-shrink-0 bg-[${color}]`
    TOAST.textContent = message ;
    TOAST_CONTAINER.appendChild(TOAST) ;
    setTimeout(()=>{
        TOAST.remove() ;
    } , 2000)
    // console.log('color : ', color, 'messahe : ', message)
}

function CHANGE_LOCAL_STORAGE(key, array) {
    // const x = {...BASE_DATA , [BASE_DATA[key]] : array}
    // localStorage.setItem('workers', JSON.stringify(array))
    BASE_DATA[key] = array;
    console.log(BASE_DATA);
    localStorage.setItem('workers', JSON.stringify(BASE_DATA));
}

function DISPLAY_ITEM(item) {
    //FUNCTION THAT SHOW OR REMOVE A MODAL LIKE FORM , PROFAIL  
    item.classList.toggle('active');
    item.classList.toggle('hidden');
    LAYER.classList.toggle('hidden');
}

//INDICATE THAT FORM DATA IS INVALIDE
function INVALID_DATA(message, invalid_input) {
    invalid_input.style.border = '3px solid red'
    DISPLAY_TOST('red', message);
}

function HANDLESUBMIT(e) {

    e.preventDefault();

    const EXPERIENCE = VALIDATION_EXPERIENCES_DATA();
    const FORM_DATA = VALIDATION_FROM_DATA()
    if (!EXPERIENCE || !FORM_DATA) return;

    DATA.push({ ...FORM_DATA, "Experiences": EXPERIENCE });

    CREATE_WORKER({ ...FORM_DATA, "Experiences": EXPERIENCE });
    CHANGE_LOCAL_STORAGE('workers', DATA);
    FORM.reset() ;

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

function ADD_WORKER_TO_AREA(sall, worker) {

    //DISPLAY WORKER PROFILE EVENT
    worker.addEventListener('click', () => SHOW_PROFILE(sall, worker));

    //ADD WORKER TO AREA
    sall.querySelector('.worker_container').appendChild(worker);
    worker.classList.add('area_worker')
    worker.classList.remove('disponible')

    //REMOVE WORKER FROM WORKER LIST
    DATA = DATA.filter(item => item.id != worker.id);

    //SAVE WORKERS LIST AND SALL WORKERS IN LOCAL STORAGE 
    CHANGE_LOCAL_STORAGE(sall.id, [...BASE_DATA[sall.id], BASE_DATA['workers'].find(item => item.id == worker.id)]);
    CHANGE_LOCAL_STORAGE('workers', DATA)

    DISPLAY_WORKERS(DATA);

}

function REMOVE_WORKER_FROM_AREA(sall, worker) {
    DATA.push(BASE_DATA[sall.id].find(item => item.id == worker.id));
    worker.classList.add('disponible');
    worker.classList.remove('area_worker');
    WORKERS_LIST.appendChild(worker);

    CHANGE_LOCAL_STORAGE(sall.id, [...BASE_DATA[sall.id].filter(item => item.id != worker.id)]);
    CHANGE_LOCAL_STORAGE('workers', DATA)

}

EVENT_LISTINERS()
DISPLAY_WORKERS(BASE_DATA.workers)