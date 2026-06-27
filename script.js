// =========================
// PRODUTOS
// =========================

let produtos = JSON.parse(localStorage.getItem("produtos")) || [
  { nome: "Legging Fitness", preco: "R$ 79,90", img: "img/leg.jpg", cat: "legging" },
  { nome: "Top Fitness", preco: "R$ 49,90", img: "img/top.jpg", cat: "top" },
  { nome: "Conjunto Fitness", preco: "R$ 119,90", img: "img/conjunto.jpg", cat: "conjunto" }
];

function salvar() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// =========================
// CARRINHO
// =========================

// {nome, preco, img, cat, qtd}
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = carrinho.reduce((t, i) => t + i.qtd, 0);
}

// =========================
// ADICIONAR AO CARRINHO
// =========================

function adicionarCarrinho(index) {
  let produto = produtos[index];

  let item = carrinho.find(p => p.nome === produto.nome);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }

  salvarCarrinho();
  alert("Produto adicionado 🛒");
}

// =========================
// ABRIR CARRINHO
// =========================

function abrirCarrinho() {
  const modal = document.getElementById("cart-modal");
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  container.innerHTML = "";
  let total = 0;

  carrinho.forEach((p, index) => {

    let preco = parseFloat(
      p.preco.replace("R$", "").replace(".", "").replace(",", ".")
    );

    let subtotal = preco * p.qtd;
    total += subtotal;

    container.innerHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:10px;">

        <div style="flex:1;">
          🛍️ ${p.nome}<br>
          <small>${p.preco}</small><br>

          <button onclick="diminuirQtd(${index})">-</button>
          <span style="margin:0 8px;">${p.qtd}</span>
          <button onclick="aumentarQtd(${index})">+</button>
        </div>

        <button onclick="removerItemCarrinho(${index})"
        style="
          background:#e11d48;
          color:white;
          border:none;
          padding:5px 8px;
          border-radius:6px;
          cursor:pointer;
        ">
          ❌
        </button>

      </div>
    `;
  });

  totalEl.innerHTML = `
    <strong>Total: R$ ${total.toFixed(2)}</strong>

    <br><br>

    <button onclick="fecharCarrinho()"
    style="
      background:#555;
      color:white;
      border:none;
      padding:10px;
      border-radius:8px;
      cursor:pointer;
      width:100%;
      margin-bottom:8px;
    ">
      👈 Continuar comprando
    </button>

    <button onclick="limparCarrinho()"
    style="
      background:#111;
      color:white;
      border:none;
      padding:10px;
      border-radius:8px;
      cursor:pointer;
      width:100%;
    ">
      🗑️ Limpar carrinho
    </button>
  `;

  modal.style.display = "flex";
}

function fecharCarrinho() {
  document.getElementById("cart-modal").style.display = "none";
}

// =========================
// QUANTIDADE
// =========================

function aumentarQtd(index) {
  carrinho[index].qtd++;
  salvarCarrinho();
  abrirCarrinho();
}

function diminuirQtd(index) {
  carrinho[index].qtd--;

  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }

  salvarCarrinho();
  abrirCarrinho();
}

// =========================
// REMOVER / LIMPAR
// =========================

function removerItemCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  abrirCarrinho();
}

function limparCarrinho() {
  if (!confirm("Deseja limpar o carrinho?")) return;

  carrinho = [];
  salvarCarrinho();
  abrirCarrinho();
}

// =========================
// FINALIZAR COMPRA (WHATSAPP - ÚNICO BOTÃO)
// =========================

function finalizarCompra() {
  let mensagem = "Olá! Quero comprar:%0A%0A";
  let total = 0;

  carrinho.forEach(p => {

    let preco = parseFloat(
      p.preco.replace("R$", "").replace(".", "").replace(",", ".")
    );

    let subtotal = preco * p.qtd;

    mensagem += `- ${p.nome} x${p.qtd} = R$ ${subtotal.toFixed(2)}%0A`;

    total += subtotal;
  });

  mensagem += `%0A💰 Total: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/5585985713477?text=${mensagem}`;
  window.open(url, "_blank");
}

// =========================
// RENDER PRODUTOS
// =========================

function render(lista) {
  const container = document.getElementById("produtos");
  if (!container) return;

  container.innerHTML = "";

  lista.forEach((p, index) => {
    container.innerHTML += `
      <div class="card">

        <img src="${p.img}" alt="${p.nome}">

        <h3 class="produto-nome">${p.nome}</h3>

        <p class="produto-preco">${p.preco}</p>

        <button onclick="adicionarCarrinho(${index})"
        style="
          background:#111;
          color:white;
          border:none;
          padding:10px;
          border-radius:8px;
          cursor:pointer;
          width:100%;
          margin-top:8px;
        ">
          🛒 Adicionar ao carrinho
        </button>

        <a class="btn-comprar"
        href="https://wa.me/5585985713477?text=Olá!%20Tenho%20interesse%20no%20produto:%20${encodeURIComponent(p.nome)}"
        target="_blank">
          Comprar direto
        </a>

        <div class="admin-controls" style="margin-top:10px; display:none;">
          
          <button onclick="editarProduto(${index})"
          style="background:#2563eb;color:white;border:none;padding:6px;border-radius:6px;width:48%;">
            Editar
          </button>

          <button onclick="excluirProduto(${index})"
          style="background:#e11d48;color:white;border:none;padding:6px;border-radius:6px;width:48%;">
            Excluir
          </button>

        </div>

      </div>
    `;
  });

  ativarAdmin();
}

// =========================
// ADMIN
// =========================

function abrirLogin() {
  const senha = prompt("Digite a senha do Admin:");

  if (senha === "1234") {
    sessionStorage.setItem("admin", "ok");
    document.querySelector(".admin").style.display = "block";
    render(produtos);
  }
}

function fecharAdmin() {
  document.querySelector(".admin").style.display = "none";
  sessionStorage.removeItem("admin");
  ativarAdmin();
}

function ativarAdmin() {
  const admin = sessionStorage.getItem("admin");

  document.querySelectorAll(".admin-controls").forEach(el => {
    el.style.display = admin === "ok" ? "flex" : "none";
  });
}

// =========================
// CRUD
// =========================

function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const img = document.getElementById("img").value;
  const cat = document.getElementById("cat").value;

  produtos.push({ nome, preco, img, cat });

  salvar();
  render(produtos);
}

function excluirProduto(index) {
  produtos.splice(index, 1);
  salvar();
  render(produtos);
}

function editarProduto(index) {
  const p = produtos[index];

  const nome = prompt("Nome:", p.nome);
  const preco = prompt("Preço:", p.preco);
  const img = prompt("Imagem:", p.img);

  if (nome && preco && img) {
    produtos[index] = { ...p, nome, preco, img };
    salvar();
    render(produtos);
  }
}

// =========================
// FILTRO
// =========================

function filtrar(cat) {
  if (cat === "todos") render(produtos);
  else render(produtos.filter(p => p.cat === cat));
}

// =========================
// INIT
// =========================

render(produtos);
atualizarCarrinho();

