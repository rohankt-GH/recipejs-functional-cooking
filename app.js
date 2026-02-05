const RecipeApp = (() => {

    /* =======================
       DATA
    ======================= */
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta with eggs and cheese.",
            ingredients: ["Spaghetti", "Eggs", "Pecorino", "Pancetta", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Make sauce",
                    substeps: [
                        "Beat eggs",
                        "Add cheese",
                        "Add pepper"
                    ]
                },
                "Combine and serve"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced creamy curry.",
            ingredients: ["Chicken", "Yogurt", "Spices", "Tomato"],
            steps: [
                "Marinate chicken",
                {
                    text: "Cook sauce",
                    substeps: [
                        "Fry spices",
                        "Add tomato",
                        {
                            text: "Finish sauce",
                            substeps: ["Add cream", "Simmer"]
                        }
                    ]
                },
                "Combine chicken and sauce"
            ]
        }
        // Add remaining recipes same pattern
    ];

    /* =======================
       STATE
    ======================= */
    let currentFilter = 'all';
    let currentSort = 'none';

    /* =======================
       DOM
    ======================= */
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');

    /* =======================
       HELPERS
    ======================= */
    const renderSteps = (steps, level = 0) => {
        const className = level === 0 ? 'steps-list' : 'substeps-list';
        let html = `<ul class="${className}">`;

        steps.forEach(step => {
            if (typeof step === 'string') {
                html += `<li>${step}</li>`;
            } else {
                html += `<li>${step.text}`;
                html += renderSteps(step.substeps, level + 1);
                html += `</li>`;
            }
        });

        html += `</ul>`;
        return html;
    };

    const createRecipeCard = recipe => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>

            <div class="card-actions">
                <button class="toggle-btn" data-toggle="steps" data-id="${recipe.id}">📋 Show Steps</button>
                <button class="toggle-btn" data-toggle="ingredients" data-id="${recipe.id}">🥗 Show Ingredients</button>
            </div>

            <div class="ingredients-container" data-id="${recipe.id}">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>

            <div class="steps-container" data-id="${recipe.id}">
                ${renderSteps(recipe.steps)}
            </div>
        </div>
    `;

    const updateDisplay = () => {
        let filtered = [...recipes];

        if (currentFilter === 'quick') {
            filtered = filtered.filter(r => r.time < 30);
        } else if (currentFilter !== 'all') {
            filtered = filtered.filter(r => r.difficulty === currentFilter);
        }

        if (currentSort === 'name') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (currentSort === 'time') {
            filtered.sort((a, b) => a.time - b.time);
        }

        recipeContainer.innerHTML = filtered.map(createRecipeCard).join('');
    };

    /* =======================
       EVENTS
    ======================= */
    const handleToggleClick = e => {
        if (!e.target.classList.contains('toggle-btn')) return;

        const id = e.target.dataset.id;
        const type = e.target.dataset.toggle;
        const container = document.querySelector(`.${type}-container[data-id="${id}"]`);

        container.classList.toggle('visible');
        e.target.textContent = container.classList.contains('visible')
            ? `Hide ${type}`
            : `Show ${type}`;
    };

    /* =======================
       INIT
    ======================= */
    const init = () => {
        filterButtons.forEach(btn =>
            btn.addEventListener('click', e => {
                currentFilter = e.target.dataset.filter;
                updateDisplay();
            })
        );

        sortButtons.forEach(btn =>
            btn.addEventListener('click', e => {
                currentSort = e.target.dataset.sort;
                updateDisplay();
            })
        );

        recipeContainer.addEventListener('click', handleToggleClick);

        updateDisplay();
        console.log('RecipeApp ready!');
    };

    return { init };

})();

RecipeApp.init();
