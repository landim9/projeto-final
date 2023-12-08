const abrir = document.getElementById("abrir");
const login = document.getElementById("login");
const salvar = document.getElementById("salvar");
const sair = document.getElementById("sair");
const vendas = document.getElementById("vendas");
const boasVindas = document.getElementById("boasVindas");
const nome = document.getElementById("nome");
const item = document.getElementById("item");
const container = document.getElementById("container");
const formLogin = document.getElementById("formLogin");
const formVender = document.getElementById("formVender");
const formItem = document.getElementById("formItem");

var dados = {
    usuarios: [],
    itens: [],
    vendas: []
};

var usuario = {};

// Carregar dados de arquivo JSON
abrir.addEventListener("change", (e) => {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
        dados = JSON.parse(reader.result);
        abrir.classList.add("oculto");
        login.classList.remove("oculto");
        preencherCards();
    }
})

// Salvar os dados no arquivo JSON
function download() {
    if (dados.usuarios.length > 0) {
        let a = document.createElement("a")
        a.href = "data:," + JSON.stringify(dados)
        a.download = "bd/dados.json"
        a.click();
        alert("Dados salvos na pasta padrão de downloads como [dados.json]")
    } else {
        alert("Não há dados a serem salvos.")
    }
}

// CRUD - READALL Produtos
function preencherCards() {
    container.innerHTML = `
        <div id="model0" class="card col-lg-3 m-2 justify-content-between">
            <h2 class="card-title text-center">Nome</h2>
            <p class="card-text">Tipo e Descrição</p>
            <img src="assets/img/logo.png" alt="Imagem Padrão" class="img">
            <button class="btn" onclick="openVenderModal()">Vender</button>
            <button class="btn oculto" onclick="excluirItem()">Excluir</button>
            <h4 class="card-footer text-right">Preço</h4>
        </div>`;
    dados.itens.forEach((item, i) => {
        const model = document.getElementById('model0').cloneNode(true);
        model.setAttribute('id', 'model' + item.id);
        model.querySelector('.card-title').innerHTML = item.nome;
        model.querySelector('.card-text').innerHTML = "<B>" + item.tipo + ":</B>";
        model.querySelector('.card-text').innerHTML += "<br/>" + item.descricao;
        model.querySelector('.img').src = item.img == "" ? "../assets/noimage.jpg" : item.img;
        model.querySelector('.card-footer').innerHTML = `R$ ${parseFloat(item.preco).toFixed(2)}`;
        model.querySelector('.btn').setAttribute("onclick", `preencherTotal(${i})`);
        model.querySelector('.btn-danger').setAttribute("onclick", `excluirItem(${i})`);
        if (usuario.email == undefined) {
            model.querySelector('.btn').classList.add("oculto");
        } else if (usuario.tipo == "admin") {
            model.querySelector('.btn-danger').classList.remove("oculto");
        }
        container.appendChild(model);
    });
    document.getElementById('model0').remove();
}

// Entrar no sistema
formLogin.addEventListener("submit", e => {
    e.preventDefault();
    let encontrado = false;
    dados.usuarios.forEach(user => {
        if (user.email == formLogin.email.value && user.senha == formLogin.senha.value) {
            usuario = user;
            login.classList.add("oculto");
            salvar.classList.remove("oculto");
            sair.classList.remove("oculto");
            if (usuario.tipo == "admin") item.classList.remove("oculto");
            preencherCards();
            bemVindo();
            encontrado = true;
        }
    });
    if (!encontrado) alert('Login ou senha inválidos!');
})

function bemVindo() {
    if (usuario.email == undefined) boasVindas.classList.add("oculto");
    else {
        nome.innerHTML = `Usuário(a): ${usuario.nome}`;
        boasVindas.classList.remove("oculto");
    }
}

// Sair do sistema
function logout() {
    usuario = {};
    login.classList.remove("oculto");
    salvar.classList.add("oculto");
    item.classList.add("oculto");
    sair.classList.add("oculto");
    preencherCards();
    bemVindo();
}

// CRUD - READ
function preencherTotal(indice) {
    formVender.id.value = dados.itens[indice].id;
    formVender.preco.value = dados.itens[indice].preco;
    let quantidade = parseInt(formVender.quantidade.value);
}