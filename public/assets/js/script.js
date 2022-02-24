const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;
  
  
  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
    
    if (diet === undefined) {
      diet = '';
    }
    
    const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
    const personalityTraits = [];
    for (let i = 0; i < selectedTraits.length; i += 1) {
      personalityTraits.push(selectedTraits[i].value);
    }
    const animalObject = { name, species, diet, personalityTraits };
    //Url is simply /api/animals becuase the request is coming from the server, so we dont have to specify full url
    fetch('./data/animals', {       
      method: 'POST',
      headers: {
        Accept: 'application/json',       //telling the server it is JSON data 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(animalObject)   //add stringified JSON data for animalObject to body property. Without it, cannot recieve req.body on server
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        alert('Error: ' + response.statusText);
      } 
    })
    .then(postResponse => {
      //console.log(postResponse);
      alert('Thank you for adding an animal!');
    });
    break;
  }

};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
