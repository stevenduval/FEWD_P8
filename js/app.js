// global variables
let employeeData;
const apiUrl = `https://randomuser.me/api/?results=12&nat=US&inc=picture,name,email,location,phone,dob`;

let states = {
    'Alabama':'AL',
    'Alaska':'AK',
    'Arizona':'AZ',
    'Arkansas':'AR',
    'California':'CA',
    'Colorado':'CO',
    'Connecticut':'CT',
    'Delaware':'DE',
    'Florida':'FL',
    'Georgia':'GA',
    'Hawaii':'HI',
    'Idaho':'ID',
    'Illinois':'IL',
    'Indiana':'IN',
    'Iowa':'IA',
    'Kansas':'KS',
    'Kentucky':'KY',
    'Louisiana':'LA',
    'Maine':'ME',
    'Maryland':'MD',
    'Massachusetts':'MA',
    'Michigan':'MI',
    'Minnesota':'MN',
    'Mississippi':'MS',
    'Missouri':'MO',
    'Montana':'MT',
    'Nebraska':'NE',
    'Nevada':'NV',
    'New Hampshire':'NH',
    'New Jersey':'NJ',
    'New Mexico':'NM',
    'New York':'NY',
    'North Carolina':'NC',
    'North Dakota':'ND',
    'Ohio':'OH',
    'Oklahoma':'OK',
    'Oregon':'OR',
    'Pennsylvania':'PA',
    'Rhode Island':'RI',
    'South Carolina':'SC',
    'South Dakota':'SD',
    'Tennessee':'TN',
    'Texas':'TX',
    'Utah':'UT',
    'Vermont':'VT',
    'Virginia':'VA',
    'Washington':'WA',
    'West Virginia':'WV',
    'Wisconsin':'WI',
    'Wyoming':'WY'
};

// display employee cards
const displayEmployees = (data) => {
    // get employee section element and create document fragment to store cards in
    let employeeSection = document.querySelector('.employees');
    let contentHolder = document.createDocumentFragment();
    // loop through employee data
    for (let i = 0; i < data.length; i++) {
        // set current employee
        let currEmp = data[i];
        // create card div that we can append to doc frag
        // set class and data-index attribute
        let div = document.createElement('div');
        div.setAttribute('class', 'card');
        div.setAttribute('data-index', i);
        // set card contents via interpolation and template literals
        let cardContents = `
                <div class="picture">
                    <img src="${currEmp.picture.large}" alt="profile picture" />
                </div>
                <div class="info-section1">
                    <h2>${currEmp.name.first} ${currEmp.name.last}</h2>
                    <p>${currEmp.email}</p>
                    <p>${currEmp.location.city}</p>
                </div>
        `;
        // add card contents into card div
        div.insertAdjacentHTML('afterbegin', cardContents);
        // append card into document fragment
        contentHolder.appendChild(div);
    }
    // append card document fragment to employee section
    employeeSection.appendChild(contentHolder);
}

// fetch employee data from api
const getEmployeeData = async (url) => {
    return fetch(url)
        .then(response => response.json())
        .then(data => data.results)
        .catch(error => console.log('the api has a problem:', error));
}

// await employee data, send employee data to display employees
const startApp = async (url) => {
    employeeData = await getEmployeeData(url);
    displayEmployees(employeeData);
}

// toggle the hidden class on the modal div
const displayModal = () => document.querySelector('.modal').classList.toggle('hidden');

// set employee data in the modal
const setModalData = (data, index) => {
    let modalCardContainer = document.querySelector('.modal .container .card');
    // content that we will set each time
    let modalCardContent = `
            <div class="picture">
                <img src="${data.picture.large}" alt="profile picture" />
            </div>
            <div class="info-section1">
                <h2>${data.name.first} ${data.name.last}</h2>
                <p>${data.email}</p>
                <p>${data.location.city}</p>
            </div>
            <div class="info-section2">
                <p>${data.phone}</p>
                <p>${data.location.street.number} ${data.location.street.name} ${data.location.city}, ${states[data.location.state]} ${data.location.postcode}</p>
                <p>Birthday: ${new Date(data.dob.date).toLocaleDateString()}</p>
            </div>
    `;
    // only keep the first child
    modalCardContainer.replaceChildren(modalCardContainer.firstElementChild);
    // insert new content from above
    modalCardContainer.insertAdjacentHTML('beforeend', modalCardContent);
    // set data-index so we know which employee we are on
    modalCardContainer.setAttribute('data-index', index);
}

// change employee when prev or next arrows are clicked
const changeEmployee = ({ target: { className: elemClicked } }) => {
    // get index of currentModal and initialize index variable to use
    let currentModalDataIndex = +document.querySelector('.modal .container .card').dataset.index;
    let index;
    // find all cards that are not hidden and return the data-index value as an array
    let activeCardDataIndexes = [...document.querySelectorAll('.employees .card')].filter(card => {
                                    return window.getComputedStyle(card).getPropertyValue('display') != 'none';
                                }).map(card => {
                                    return +card.dataset.index;
    });
    // if prev is clicked
    if (elemClicked === 'prev') { 
        // if data-index of currently open modal is the same as the index of the first item in the activeCardDataIndexes array
        if ( currentModalDataIndex === activeCardDataIndexes[0] ) {
            // then we know that we need to use the last item from the activeCardDataIndexes array
            index = activeCardDataIndexes[activeCardDataIndexes.length - 1];
        } else {
            // otherwise we need to find where the current open modal is in the activeCardDataIndexes array
            // and then get the item that comes before it to use as the next data for the modal
            index = activeCardDataIndexes[activeCardDataIndexes.indexOf(currentModalDataIndex) - 1];
        }
    }
    // if next is clicked
    if (elemClicked === 'next') { 
        // if data-index of currently open modal is the same as the index of the last item in the activeCardDataIndexes array
        if ( currentModalDataIndex === activeCardDataIndexes[activeCardDataIndexes.length - 1] ) {
             // then we know that we need to use the first item from the activeCardDataIndexes array
            index = activeCardDataIndexes[0];
        } else {
            // otherwise we need to find where the current open modal is in the activeCardDataIndexes array
            // and then get the item that comes after it to use as the next data for the modal
            index = activeCardDataIndexes[activeCardDataIndexes.indexOf(currentModalDataIndex) + 1];
        }
    }
    // if index of item we are going to use next is the same as whats there already then exit the function
    if ( index === currentModalDataIndex ) { return false; }
    // send data to setModalData
    setModalData(employeeData[index], index);
};

// show modal when card is clicked
const showModal = (e) => {
    // if click is not from section and on a div in the employees section
    if (e.target.tagName !== 'SECTION') {
        // if a card was clicked grab index off of it, if not find closest card and get index
        let index = (e.target.className === 'card') ? e.target.dataset.index : e.target.closest('.card').dataset.index;
        // send data to setModalData
        setModalData(employeeData[index], index);
        // toggle the hidden class
        displayModal();
    }
}

// search function to filter employees
const filterCards = ({ target: { value } }) => {
    let cards = document.querySelectorAll('.employees .card');
    // loop through all images
    cards.forEach(card => {
        // get caption of image
        let name = card.querySelector('h2').textContent.toLocaleLowerCase();
        // set display to none by default
        card.style.display = 'none';
        // if match then set the display
        if (name.includes(value.toLocaleLowerCase())) { card.style.display = 'flex'; }
    });
};

// event listeners
document.getElementById('search').addEventListener('keyup', filterCards);
document.querySelector('.employees').addEventListener('click', showModal);
document.querySelector('span.close').addEventListener('click', displayModal);
document.querySelector('.modal .prev').addEventListener('click', changeEmployee);
document.querySelector('.modal .next').addEventListener('click', changeEmployee);

// start app
startApp(apiUrl);