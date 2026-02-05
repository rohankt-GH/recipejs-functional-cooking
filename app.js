const RecipeApp = (() => {
    'use strict';

    /* ================= DATA ================= */
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Classic creamy Italian pasta.",
            ingredients: ["Spaghetti", "Eggs", "Cheese", "Pancetta"],
            steps: ["Boil pasta", "Cook pancetta", "Mix eggs & cheese", "Combine"]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Rich Indian curry.",
            ingredients: ["Chicken", "Yogurt", "Spices", "Tomato"],
            steps: ["Marinate chicken", "Cook sauce", "Combine"]
        },
        {
            id: 3,
            title: "Avocado Toast",
            time: 10,
            difficulty: "easy",
            description: "Quick healthy breakfast.",
            ingredients: ["Bread", "Avocado", "Salt", "Pepper"],
            steps: ["Toast bread", "Mash avocado", "Assemble"]
        },
        {
            id: 4,
            title: "Beef Stir Fry",
            time: 30,
            difficulty: "medium",
            description: "Fast Asian-inspired meal.",
            ingredients: ["Beef", "Soy Sauce", "Vegetables"],
            steps: ["Slice beef", "Stir fry veggies", "Add beef"]
        },
        {
            id: 5,
            title: "Vegetable Curry",
            time: 40,
            difficulty: "medium",
            description: "Comforting vegetarian curry.",
            ingredients: ["Potatoes", "Carrots", "Coconut Milk"],
            steps: ["Chop vegetables", "Simmer curry"]
        },
        {
            id: 6,
            title: "Grilled Salmon",
            time: 20,
            difficulty: "easy",
            description: "Simple and healthy fish dish.",
            ingredients: ["Salmon", "Lemon", "Garlic"],
            steps: ["Season fish", "Grill"]
        },
        {
            id: 7,
            title: "Lasagna",
            time: 90,
            difficulty: "hard",
            description: "Layered Italian classic.",
            ingredients: ["Pasta", "Meat Sauce", "Cheese"],
            steps: ["Prepare sauce", "Layer", "Bake"]
        },
        {
            id: 8,
            title: "Pancakes",
            time: 15,
            difficulty: "easy",
            description: "Fluffy breakfast favorite.",
            ingredients: ["Flour", "Milk", "Eggs"],
            steps: ["Mix batter", "Cook pancakes"]
        }
    ];

    /* ================= STATE ================= */
    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    let debounceTimer;

    /* ================= DOM ================= */
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const clearSearchBtn = document.querySelector('#clear-search');
    const recipeCount = document.querySelector('#recipe-count');

    /* ================= HELPERS ================= */
    const filterBySearch = (list, query) =>
        query
            ? list.filter(r =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                r.ingredients.some(i => i.toLowerCase().includes(query))
            )
            : list;

    const updateDisplay = () => {
        let result = filterBySearch(recipes, searchQuery);

        if (currentFilter === 'favorites') {
            result = result.filter(r => favorites.includes(r.id));
        } else if (currentFilter === 'quick') {
            result = result.filter(r => r.time < 30);
        } else if (currentFilter !== 'all') {
            result = result.filter(r => r.difficulty === currentFilter);
        }

        if (currentSort === 'name') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (currentSort === 'time') {
            result.sort((a, b) => a.time - b.time);
        }

        recipeCount.textContent = `Showing ${result.length} of ${recipes.length} recipes`;
        recipeContainer.innerHTML = result.map(createCard).join('');
    };

    const createCard = r => `
        <div class="recipe-card">
            <button class="favorite-btn" data-id="${r.id}">
                ${favorites.includes(r.id) ? '❤️' : '🤍'}
            </button>
            <h3>${r.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${r.time} min</span>
                <span>${r.difficulty}</span>
            </div>
            <p>${r.description}</p>

            <div class="card-actions">
                <button class="toggle-btn" data-type="ingredients" data-id="${r.id}">Ingredients</button>
                <button class="toggle-btn" data-type="steps" data-id="${r.id}">Steps</button>
            </div>

            <div class="ingredients-container" data-id="${r.id}">
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>

            <div class="steps-container" data-id="${r.id}">
                <ul>${r.steps.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
        </div>
    `;

    /* ================= EVENTS ================= */
    recipeContainer.addEventListener('click', e => {
        if (e.target.classList.contains('favorite-btn')) {
            const id = +e.target.dataset.id;
            favorites = favorites.includes(id)
                ? favorites.filter(f => f !== id)
                : [...favorites, id];
            localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
            updateDisplay();
        }

        if (e.target.classList.contains('toggle-btn')) {
            const type = e.target.dataset.type;
            const id = e.target.dataset.id;
            document
                .querySelector(`.${type}-container[data-id="${id}"]`)
                .classList.toggle('visible');
        }
    });

    searchInput.addEventListener('input', e => {
        clearTimeout(debounceTimer);
        clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
        debounceTimer = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase();
            updateDisplay();
        }, 300);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        updateDisplay();
    });

    filterButtons.forEach(btn =>
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            updateDisplay();
        })
    );

    sortButtons.forEach(btn =>
        btn.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            updateDisplay();
        })
    );

    /* ================= INIT ================= */
    const init = () => {
        updateDisplay();
        console.log('🍳 RecipeJS fully loaded');
    };

    return { init };
})();

RecipeApp.init();
