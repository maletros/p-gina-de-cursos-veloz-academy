/* script.js */
document.addEventListener("DOMContentLoaded", () => {
    const courses = [
        { title: "Python do Zero ao Profissional", category: "Programação", duration: "28h", modules: 9, level: "Iniciante" },
        { title: "JavaScript & React para Iniciantes", category: "Programação", duration: "28h", modules: 8, level: "Iniciante" },
        { title: "Desenvolvendo APIs com Node.js", category: "Programação", duration: "25h", modules: 6, level: "Intermediário" },
        { title: "Como Validar Sua Ideia de Negócio", category: "Empreendedorismo", duration: "10h", modules: 5, level: "Todos os níveis" },
        { title: "Captação de Investimentos para Startups", category: "Empreendedorismo", duration: "10h", modules: 7, level: "Intermediário" },
        { title: "Gestão Financeira para Pequenos Negócios", category: "Empreendedorismo", duration: "15h", modules: 6, level: "Iniciante" },
        { title: "UI/UX Design para Aplicativos", category: "Design", duration: "20h", modules: 6, level: "Intermediário" },
        { title: "Design System: Criação e Implementação", category: "Design", duration: "20h", modules: 5, level: "Avançado" },
        { title: "Marketing de Conteúdo", category: "Marketing Digital", duration: "15h", modules: 7, level: "Iniciante" },
        { title: "Estratégias de SEO Avançado", category: "Marketing Digital", duration: "22h", modules: 8, level: "Avançado" },
        { title: "Introdução ao Machine Learning", category: "Data Science", duration: "32h", modules: 8, level: "Avançado" },
        { title: "Análise de Dados com Python", category: "Data Science", duration: "30h", modules: 7, level: "Intermediário" }
    ];
    
    const coursesList = document.getElementById("courses-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.querySelector(".banner input");

    function renderCourses(filter = "Todos", search = "") {
        coursesList.innerHTML = "";
        courses.filter(course => 
            (filter === "Todos" || course.category === filter) &&
            course.title.toLowerCase().includes(search.toLowerCase())
        ).forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.classList.add("course-card");
            courseCard.innerHTML = `
                <h3>${course.title}</h3>
                <p><strong>Categoria:</strong> ${course.category}</p>
                <p><strong>Duração:</strong> ${course.duration}</p>
                <p><strong>Módulos:</strong> ${course.modules}</p>
                <p><strong>Nível:</strong> ${course.level}</p>
            `;
            coursesList.appendChild(courseCard);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active")?.classList.remove("active");
            button.classList.add("active");
            const category = button.dataset.category;
            renderCourses(category, searchInput.value);
        });
    });

    searchInput.addEventListener("input", () => {
        const activeCategory = document.querySelector(".filter-btn.active").dataset.category;
        renderCourses(activeCategory, searchInput.value);
    });

    renderCourses();

    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
});
