const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


  

// primire comanda prin click
searchBtn.addEventListener('click', getMealList);


//primire comanda de pe Enter
var input = document.getElementById('search-input');
input.addEventListener("keyup", function(event){
    if(event.keyCode === 13){ 
        event.preventDefault();
        document.getElementById('search-btn').click();
    }
});

// incepere gasire reteta
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
  
});

   
// gasesc reteta cu ajutorul ingredientelor introduse
function getMealList(){

    let searchInputTxt = document.getElementById('search-input').value.trim();

    const nume = `https://api-free.deepl.com/v2/translate?auth_key=b203a708-5195-2715-eb8d-689b407d5e88%3Afx&text=${meal.strMeal}&target_lang=RO&source_lang=en`;
       
fetch(nume).then(response => response.json())
.then(data => {
    meal.strMeal= data.translations[0].text;


    // incep sa traduc inputul din ro in eng
    const translatedInput = `https://api-free.deepl.com/v2/translate?auth_key=b203a708-5195-2715-eb8d-689b407d5e88%3Afx&text=${searchInputTxt}&target_lang=en-US&source_lang=RO`;
    fetch(translatedInput).then(response => response.json())
    .then(data => {
        const deCautat = data.translations[0].text;
        //console.log(deCautat);    // verificare
       
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${deCautat}`)
    .then(response => response.json())
    .then(data => {

        
      

        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Vizualizare rețetă</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Ne pare rău, nu s-a găsit nici o rețetă care să conțină acest ingredient !";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
   });
});

}


//  reteta preparatului
function getMealRecipe(e){
    e.preventDefault();
  
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
        console.log(mealItem);
    
    }
}
 

// creez o 'cale'
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
     const nume = `https://api-free.deepl.com/v2/translate?auth_key=b203a708-5195-2715-eb8d-689b407d5e88%3Afx&text=${meal.strMeal}&target_lang=RO&source_lang=en`;
    const categorie = `https://api-free.deepl.com/v2/translate?auth_key=b203a708-5195-2715-eb8d-689b407d5e88%3Afx&text=${meal.strCategory}&target_lang=RO&source_lang=en`;
    const instructiuni = `https://api-free.deepl.com/v2/translate?auth_key=b203a708-5195-2715-eb8d-689b407d5e88%3Afx&text=${meal.strInstructions}&target_lang=RO&source_lang=en`;
    fetch(nume).then(response => response.json())
    .then(data => {
       meal.strMeal= data.translations[0].text;

    fetch(categorie).then(response => response.json())
    .then(data => {
        meal.strCategory= data.translations[0].text;
           
        fetch(instructiuni).then(response => response.json())
        .then(data => {
            meal.strInstructions= data.translations[0].text;



    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instrucțiuni:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank" style="text-decoration: none;">Urmărește videoclipul</a>
        </div>
    `;
    console.log(categorie);
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
        });
    });
  });
}

