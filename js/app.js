console.log('im loading');


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