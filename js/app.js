let employeeData;
let apiUrl = `https://randomuser.me/api/?results=12&nat=US&inc=picture,name,email,location,phone,dob`;

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
const getEmployeeData = async(url) => {
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


const setModalData = (data) => {
    console.log(data);
    // let modalUserPicture = document.querySelector('.modal .picture img');
    // let modalUserName = document.querySelector('.modal .info-section1 .name');
    // let modalUserEmail = document.querySelector('.modal .info-section1 .email');
    // let modalUserCity = document.querySelector('.modal .info-section1 .city');
    // let modalUserPhone = document.querySelector('.modal .info-section1 .phone');
    // let modalUserAddress = document.querySelector('.modal .info-section1 .address');
    // let modalUserBirthday = document.querySelector('.modal .info-section1 .birthday');
    
    // for (let i = 0; i < length; i++) {
    //     document.querySelector().textContent = '';
    // }

}

const showModal = (e) => {
    // check card was clicked (not section element)
    // if !== section 
    if (e.target.tagName !== 'SECTION') {
        let modalData = employeeData[(e.target.className === 'card') ? e.target.dataset.index : e.target.closest('.card').dataset.index];
        setModalData(modalData);
    }
    // if div.card then get 
    // need to get index of what was clicked
    // need to display the info
    // need to remove hidden class
    // will need to see if we need to add event listener to close each time
}


// search function to filter images
const filterCards = ({ target: { value } }) => {
    let cards = document.querySelectorAll('.card');
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

// start app
startApp(apiUrl);