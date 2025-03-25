// Exercise data
const exercises = [
    {
        id: 1,
        title: "Push-ups",
        category: "calisthenics",
        description: "A compound exercise that works the chest, shoulders, triceps, and core muscles.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Push-ups"
    },
    {
        id: 2,
        title: "Pull-ups",
        category: "calisthenics",
        description: "An upper body exercise that targets the back, biceps, and shoulders for building strength.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Pull-ups"
    },
    {
        id: 3,
        title: "Bodyweight Squats",
        category: "calisthenics",
        description: "A lower body exercise focusing on the quadriceps, hamstrings, and glutes.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Bodyweight+Squats"
    },
    {
        id: 4,
        title: "Dips",
        category: "calisthenics",
        description: "Targets the triceps, chest, and shoulders while improving upper body strength.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Dips"
    },
    {
        id: 5,
        title: "Plank",
        category: "calisthenics",
        description: "An isometric core strength exercise that involves maintaining a position similar to a push-up.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Plank"
    },
    {
        id: 6,
        title: "Hip Flexor Stretch",
        category: "mobility",
        description: "Improves hip flexibility and helps alleviate lower back pain caused by tight hip flexors.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Hip+Flexor+Stretch"
    },
    {
        id: 7,
        title: "Shoulder Dislocates",
        category: "mobility",
        description: "Enhances shoulder mobility and stability using a resistance band or stick.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Shoulder+Dislocates"
    },
    {
        id: 8,
        title: "Deep Squat Hold",
        category: "mobility",
        description: "Improves ankle, knee, and hip mobility while strengthening the lower body.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Deep+Squat+Hold"
    },
    {
        id: 9,
        title: "Thoracic Bridge",
        category: "mobility",
        description: "Enhances thoracic spine mobility and opens up the chest for better posture.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Thoracic+Bridge"
    },
    {
        id: 10,
        title: "Wrist Circles",
        category: "mobility",
        description: "Improves wrist mobility and circulation, helping to prevent wrist pain during exercises.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Wrist+Circles"
    },
    {
        id: 11,
        title: "Jumping Jacks",
        category: "cardio",
        description: "A full-body exercise that raises heart rate and improves coordination.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Jumping+Jacks"
    },
    {
        id: 12,
        title: "Mountain Climbers",
        category: "cardio",
        description: "A dynamic exercise that works the core, arms, and legs while elevating heart rate.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Mountain+Climbers"
    },
    {
        id: 13,
        title: "Burpees",
        category: "cardio",
        description: "A challenging full-body exercise that boosts cardiovascular fitness and burns calories.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Burpees"
    },
    {
        id: 14,
        title: "High Knees",
        category: "cardio",
        description: "A running-in-place exercise that increases heart rate and works the core and legs.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=High+Knees"
    },
    {
        id: 15,
        title: "Jump Rope",
        category: "cardio",
        description: "An effective cardio exercise that improves coordination, rhythm, and endurance.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Jump+Rope"
    }
];

// Function to render exercise cards
function renderExercises(category = 'all') {
    const exerciseGrid = document.getElementById('exerciseGrid');
    exerciseGrid.innerHTML = '';

    const filteredExercises = category === 'all' 
        ? exercises 
        : exercises.filter(exercise => exercise.category === category);

    filteredExercises.forEach(exercise => {
        const card = document.createElement('div');
        card.classList.add('exercise-card', exercise.category);

        // Create difficulty dots based on level
        let difficultyDots = '';
        for (let i = 1; i <= 3; i++) {
            difficultyDots += `<span class="difficulty-level ${i <= exercise.difficulty ? 'active' : ''}"></span>`;
        }

        // Map difficulty level to text
        let difficultyText = '';
        switch(exercise.difficulty) {
            case 1:
                difficultyText = 'Beginner';
                break;
            case 2:
                difficultyText = 'Intermediate';
                break;
            case 3:
                difficultyText = 'Advanced';
                break;
        }

        card.innerHTML = `
            <div class="exercise-img" style="background-image: url('${exercise.image}')">
                <span class="exercise-category">${exercise.category}</span>
            </div>
            <div class="exercise-content">
                <h3 class="exercise-title">${exercise.title}</h3>
                <p class="exercise-desc">${exercise.description}</p>
                <div class="exercise-meta">
                    <div class="difficulty">
                        ${difficultyDots}
                        <span class="difficulty-text">${difficultyText}</span>
                    </div>
                </div>
                <a href="#" class="exercise-btn">View Details</a>
            </div>
        `;

        exerciseGrid.appendChild(card);
    });
}

// Initialize with all exercises
document.addEventListener('DOMContentLoaded', () => {
    renderExercises();

    // Add filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter exercises
            const filter = button.getAttribute('data-filter');
            renderExercises(filter);
        });
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Change icon based on theme
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    });
});