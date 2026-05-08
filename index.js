// URL endpoint
const url_api = "https://rickandmortyapi.com/api/character";

// ESTADO GLOBAL
let currentPage = 1;
let totalPages = 0;
let originalResults = [];
let isLoading = false;


/* requestData
Send request to Endpoint
@param {string} url_api */


async function requestData(url_api) {
    // Evita múltiples requests
    if (isLoading) return;
    isLoading = true; //control de clic
    showLoading(true);
    disableButtons(true);
    try {
        // AXIOS
        const response = await axios.get(url_api);
        let data = response.data;
        // guardar total páginas
        totalPages = data.info.pages;
        // guardar data original
        originalResults = [...data.results];
        // reset filtro al cambiar página
        document.getElementById("filterGender").value = "all";
        // guardar next y prev
        getElementButton(document, "set", data.info);
        // renderizar
        renderHtml(data.results);
        // actualizar página
        updatePageIndicator();

    } catch (error) {
        console.log(error);
    } finally {
        isLoading = false;
        showLoading(false);
        // habilitar según contexto
        updateButtons();
    }
}

/**
loadMore
Call @Function getElementButton
@param {string} type
*/

function loadMore(type = "next") {
    getElementButton(document, "get", null, type);
}

/**
getElementButton
@param {object} elementButton
@param {string} operation
@param {object} info
@param {string} type
*/

function getElementButton(
    elementButton,
    operation = "get",
    info = null,
    type = "next"
) {
    const nextButton = elementButton.getElementById("loadMore");
    const prevButton = elementButton.getElementById("prevPage");
    if (operation == "get") {
        let url = "";
        // siguiente
        if (type == "next") {
            url = nextButton.getAttribute("data-next");
            if (url != "" && url != null) {
                currentPage++;
            }

        } else {
            // anterior
            url = prevButton.getAttribute("data-prev");
            if (url != "" && url != null) {
                currentPage--;
            }
        }
        if (url == "" || url == null) {
            console.log("No hay url");
        } else {
            requestData(url);
        }

    } else {
        // guardar next
        nextButton.setAttribute(
            "data-next",
            info.next == null ? "" : info.next
        );

        // guardar prev
        prevButton.setAttribute(
            "data-prev",
            info.prev == null ? "" : info.prev
        );

    }

}

/**
renderHtml
@param {array} results
*/

function renderHtml(results) {
    let element = document.getElementById("character");
    // reemplaza contenido
    element.innerHTML = "";
    let resultCount = results.length;
    for (let index = 0; index < resultCount; index++) {
        let character = results[index];
        // NO innerHTML +=
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <span>${character.gender}</span>`;
        element.appendChild(li);

    }

}

// FILTRO POR GÉNERO

function filterGender(value) {
    let filteredResults = [];
    // restaurar originales
    if (value == "all") {
        filteredResults = originalResults;
    } else {
        filteredResults = originalResults.filter(character => {
            return character.gender == value;
        });
    }

    // renderizar filtrados
    renderHtml(filteredResults);

}

// CONTROL BOTONES
function updateButtons() {
    const nextButton = document.getElementById("loadMore");
    const prevButton = document.getElementById("prevPage");
    const next = nextButton.getAttribute("data-next");
    const prev = prevButton.getAttribute("data-prev");
    // primera página
    prevButton.disabled = prev == "" || prev == null;
    // última página
    nextButton.disabled = next == "" || next == null;

}

// BLOQUEAR BOTONES
function disableButtons(status) {
    document.getElementById("loadMore").disabled = status;
    document.getElementById("prevPage").disabled = status;

}
// LOADING
function showLoading(status) {
    const loading = document.getElementById("loading");
    loading.style.display = status ? "block" : "none";

}

// INDICADOR DE PÁGINA
function updatePageIndicator() {
    const indicator = document.getElementById("pageIndicator");
    indicator.textContent =
        `Página ${currentPage} de ${totalPages}`;

}

requestData(url_api);