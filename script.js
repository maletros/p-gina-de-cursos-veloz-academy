document.addEventListener("DOMContentLoaded", () => {
    // Dados dos cursos com propriedade durationHours adicionada para facilitar a ordenação
    const courses = [
        { title: "Python do Zero ao Profissional", category: "Programação", duration: "28h", modules: 9, level: "Iniciante", durationHours: 28 },
        { title: "JavaScript & React para Iniciantes", category: "Programação", duration: "28h", modules: 8, level: "Iniciante", durationHours: 28 },
        { title: "Desenvolvendo APIs com Node.js", category: "Programação", duration: "25h", modules: 6, level: "Intermediário", durationHours: 25 },
        { title: "Como Validar Sua Ideia de Negócio", category: "Empreendedorismo", duration: "10h", modules: 5, level: "Todos os níveis", durationHours: 10 },
        { title: "Captação de Investimentos para Startups", category: "Empreendedorismo", duration: "10h", modules: 7, level: "Intermediário", durationHours: 10 },
        { title: "Gestão Financeira para Pequenos Negócios", category: "Empreendedorismo", duration: "15h", modules: 6, level: "Iniciante", durationHours: 15 },
        { title: "UI/UX Design para Aplicativos", category: "Design", duration: "20h", modules: 6, level: "Intermediário", durationHours: 20 },
        { title: "Design System: Criação e Implementação", category: "Design", duration: "20h", modules: 5, level: "Avançado", durationHours: 20 },
        { title: "Marketing de Conteúdo", category: "Marketing Digital", duration: "15h", modules: 7, level: "Iniciante", durationHours: 15 },
        { title: "Estratégias de SEO Avançado", category: "Marketing Digital", duration: "22h", modules: 8, level: "Avançado", durationHours: 22 },
        { title: "Introdução ao Machine Learning", category: "Data Science", duration: "32h", modules: 8, level: "Avançado", durationHours: 32 },
        { title: "Análise de Dados com Python", category: "Data Science", duration: "30h", modules: 7, level: "Intermediário", durationHours: 30 }
    ];
    
    // Elementos do DOM
    const coursesList = document.getElementById("courses-list");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const levelFilterButtons = document.querySelectorAll(".level-filter-btn");
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const courseCount = document.getElementById("course-count");
    const loadingIndicator = document.getElementById("loading-indicator");
    const noResults = document.getElementById("no-results");
    const resetFilters = document.getElementById("reset-filters");
    const backToTop = document.getElementById("back-to-top");
    const themeToggle = document.getElementById("theme-toggle");
    
    // Estado da aplicação
    const state = {
        category: "Todos",
        level: "Todos",
        search: "",
        sort: "title",
        sortDirection: "asc"
    };
    
    // Cache para resultados
    const resultsCache = new Map();
    
    // Função para gerar chave de cache
    function getCacheKey() {
        return `${state.category}-${state.level}-${state.search}-${state.sort}-${state.sortDirection}`;
    }
    
    // Debounce para otimizar a busca
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // Filtrar cursos com base no estado atual
    function filterCourses() {
        return courses.filter(course => 
            (state.category === "Todos" || course.category === state.category) &&
            (state.level === "Todos" || course.level === state.level) &&
            course.title.toLowerCase().includes(state.search.toLowerCase())
        );
    }
    
    // Ordenar cursos
    function sortCourses(filteredCourses) {
        return [...filteredCourses].sort((a, b) => {
            let valueA, valueB;
            
            switch(state.sort) {
                case "duration":
                    valueA = a.durationHours;
                    valueB = b.durationHours;
                    break;
                case "level":
                    // Ordem personalizada para níveis
                    const levelOrder = { "Iniciante": 1, "Intermediário": 2, "Avançado": 3, "Todos os níveis": 4 };
                    valueA = levelOrder[a.level] || 999;
                    valueB = levelOrder[b.level] || 999;
                    break;
                default: // title
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
            }
            
            // Determinar a direção da ordenação
            if (state.sortDirection === "asc") {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });
    }
    
    // Renderizar cursos
    function renderCourses() {
        // Verificar se temos resultados em cache
        const cacheKey = getCacheKey();
        let filteredAndSortedCourses;
        
        if (resultsCache.has(cacheKey)) {
            filteredAndSortedCourses = resultsCache.get(cacheKey);
        } else {
            // Filtrar e ordenar os cursos
            const filteredCourses = filterCourses();
            filteredAndSortedCourses = sortCourses(filteredCourses);
            
            // Armazenar em cache
            resultsCache.set(cacheKey, filteredAndSortedCourses);
        }
        
        // Simular carregamento para melhor experiência do usuário
        loadingIndicator.classList.remove("d-none");
        coursesList.querySelectorAll(".course-card").forEach(card => card.remove());
        
        setTimeout(() => {
            loadingIndicator.classList.add("d-none");
            
            // Verificar se há resultados
            if (filteredAndSortedCourses.length === 0) {
                noResults.classList.remove("d-none");
                courseCount.textContent = "Nenhum curso encontrado";
            } else {
                noResults.classList.add("d-none");
                courseCount.textContent = `Mostrando ${filteredAndSortedCourses.length} ${filteredAndSortedCourses.length === 1 ? 'curso' : 'cursos'}`;
                
                // Renderizar cada curso
                filteredAndSortedCourses.forEach(course => {
                    const courseCard = document.createElement("div");
                    courseCard.classList.add("col-md-6", "col-lg-4", "mb-4", "course-card", "animate-fade-in");
                    
                    // Determinar a classe de cor para o nível
                    let levelClass;
                    switch(course.level) {
                        case "Iniciante":
                            levelClass = "bg-success";
                            break;
                        case "Intermediário":
                            levelClass = "bg-warning";
                            break;
                        case "Avançado":
                            levelClass = "bg-danger";
                            break;
                        default:
                            levelClass = "bg-info";
                    }
                    
                    courseCard.innerHTML = `
                        <div class="card h-100 shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="badge ${levelClass} text-white">${course.level}</span>
                                <span class="badge bg-secondary">${course.category}</span>
                            </div>
                            <div class="card-body">
                                <h3 class="card-title h5">${course.title}</h3>
                                <div class="card-text">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><i class="bi bi-clock me-2"></i> <strong>Duração:</strong> ${course.duration}</li>
                                        <li><i class="bi bi-collection me-2"></i> <strong>Módulos:</strong> ${course.modules}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-footer bg-transparent border-top">
                                <button class="btn btn-primary btn-sm w-100">Ver detalhes</button>
                            </div>
                        </div>
                    `;
                    coursesList.appendChild(courseCard);
                });
            }
        }, 300); // Pequeno atraso para simulação de carregamento
    }
    
    // Manipuladores de eventos
    
    // Filtrar por categoria
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");
            state.category = button.dataset.category;
            renderCourses();
        });
    });
    
    // Filtrar por nível
    levelFilterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".level-filter-btn.active").classList.remove("active");
            button.classList.add("active");
            state.level = button.dataset.level;
            renderCourses();
        });
    });
    
    // Busca com debounce
    searchInput.addEventListener("input", debounce(() => {
        state.search = searchInput.value;
        renderCourses();
    }, 300));
    
    // Ordenação
    sortSelect.addEventListener("change", () => {
        state.sort = sortSelect.value;
        renderCourses();
    });
    
    // Botão para inverter a ordem
    document.querySelector(".sort-container").addEventListener("click", (e) => {
        if (e.target.classList.contains("sort-direction")) {
            e.target.classList.toggle("asc");
            e.target.classList.toggle("desc");
            state.sortDirection = e.target.classList.contains("asc") ? "asc" : "desc";
            renderCourses();
        }
    });
    
    // Botão para resetar filtros
    resetFilters.addEventListener("click", () => {
        state.category = "Todos";
        state.level = "Todos";
        state.search = "";
        state.sort = "title";
        state.sortDirection = "asc";
        
        // Resetar UI
        document.querySelector(".filter-btn.active").classList.remove("active");
        document.querySelector(".filter-btn[data-category='Todos']").classList.add("active");
        
        document.querySelector(".level-filter-btn.active").classList.remove("active");
        document.querySelector(".level-filter-btn[data-level='Todos']").classList.add("active");
        
        searchInput.value = "";
        sortSelect.value = "title";
        
        renderCourses();
    });
    
    // Botão de volta ao topo
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.remove("d-none");
        } else {
            backToTop.classList.add("d-none");
        }
    });
    
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
    
    // Tema escuro
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    }
    
    // Verificar se há uma preferência salva
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme === "dark");
    } else {
        // Verificar preferência do sistema
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark);
    }
    
    themeToggle.addEventListener("click", () => {
        setTheme(!document.body.classList.contains("dark-mode"));
    });
    
    // Iniciar a aplicação
    renderCourses();
    
    // Adicionar eventos de erro
    window.addEventListener("error", (event) => {
        console.error("Erro detectado:", event.error);
        // Implementar alguma forma de notificação ao usuário
    });
});