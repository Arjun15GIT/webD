document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Perform login logic here
            // For now, simulate successful login
            window.location.href = 'index.html'; // Redirect to recipe page
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Perform signup logic here
            // For now, simulate successful signup
            window.location.href = 'index.html'; // Redirect to recipe page
        });
    }

    // Recipe page script
    const searchBtn = document.querySelector('.searchBtn');
    const searchBox = document.querySelector('.searchBox');
    const recipecontainer = document.querySelector('.recipe-container');
    const recipeDetailsContent = document.querySelector('.recipe-details-content');
    const recipeCloseBtn = document.querySelector('.recipe-close-btn');

    // Function to fetch recipes
    const fetchRecipes = async (query) => {
        try {
            recipecontainer.innerHTML = "<h2>Fetching Recipes...</h2>";
            const response = await fetch(`http://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();

            recipecontainer.innerHTML = "";

            if (data.meals && Array.isArray(data.meals)) {
                data.meals.forEach(meal => {
                    const recipeDiv = document.createElement('div');
                    recipeDiv.classList.add('recipe');
                    recipeDiv.innerHTML = `
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                      <h3><p>${meal.strMeal}</p></h3>
                      <p><span>${meal.strArea}</span> Dish</p>
                      <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                    `;
                    const button = document.createElement('button');
                    button.textContent = "View Recipe";
                    recipeDiv.appendChild(button);

                    button.addEventListener('click', () => {
                        openRecipePopup(meal);
                    });

                    recipecontainer.appendChild(recipeDiv);
                });
            } else {
                console.error('No meals found or meals is not an array');
            }
        } catch (error) {
            recipecontainer.innerHTML = "<h2>Error in fetching recipes...</h2>";
        }
    };

    const fetchIngredients = (meal) => {
        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                const measure = meal[`strMeasure${i}`];
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            } else {
                break;
            }
        }
        return ingredientsList;
    };

    const openRecipePopup = (meal) => {
        recipeDetailsContent.innerHTML = `
          <h2 class="recipeName">${meal.strMeal}</h2>
          <h2>Ingredients: </h2>
          <ul class="IngredientsList">${fetchIngredients(meal)}</ul>
          <div class="recipeinstructions">
            <h3>Instructions: </h3>
            <p>${meal.strInstructions}</p>
          </div>
        `;
        document.querySelector('.recipe-details').style.display = 'block';
    };

    recipeCloseBtn.addEventListener('click', () => {
        document.querySelector('.recipe-details').style.display = 'none';
    });

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = searchBox.value.trim();
        if (!searchInput) {
            recipecontainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
            return;
        }
        fetchRecipes(searchInput);
    });
});
