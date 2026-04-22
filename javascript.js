// =====================================================================
// DADOS — adiciona mais entradas aqui conforme adicionares imagens
// =====================================================================

const ALL_AVATARS = [
    { id: "hutao",   src: "images/hutao.png",   name: "Hu Tao" },
    { id: "raiden",  src: "images/raiden.png",  name: "Raiden" },
    { id: "nahida",  src: "images/nahida.png",  name: "Nahida" },
    { id: "zhongli", src: "images/zhongli.png", name: "Zhongli" },
];

const ALL_NAMECARDS = [
    { id: "card1", src: "images/card1.png", name: "Inazuma", theme: "inazuma" },
    { id: "card2", src: "images/card2.png", name: "Sumeru",  theme: "sumeru"  },
    { id: "card3", src: "images/card3.png", name: "Liyue",   theme: "liyue"   },
];

const TEAM_MAX = 12;
const NC_MAX   = 9;

// Estado
let selectedAvatarId   = null;
let selectedNamecardId = null;
let team       = [];  // lista de charIds na equipa (ordem de adição)
let collection = [];  // lista de cardIds na coleção (ordem de adição)

// =====================================================================
// INIT
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
    renderTeamSlots();
    renderNcSlots();

    document.getElementById("avatarModal").addEventListener("click", function(e) {
        if (e.target === this) closeAvatarModal();
    });
    document.getElementById("namecardBgModal").addEventListener("click", function(e) {
        if (e.target === this) closeNamecardBgModal();
    });
});

// =====================================================================
// NAV
// =====================================================================

function showCharacters() {
    document.getElementById("charactersSection").classList.remove("hidden");
    document.getElementById("namecardsSection").classList.add("hidden");
    document.getElementById("btnChars").classList.add("active");
    document.getElementById("btnCards").classList.remove("active");
}

function showNamecards() {
    document.getElementById("charactersSection").classList.add("hidden");
    document.getElementById("namecardsSection").classList.remove("hidden");
    document.getElementById("btnChars").classList.remove("active");
    document.getElementById("btnCards").classList.add("active");
}

// =====================================================================
// MODAL: FOTO DE PERFIL
// =====================================================================

function openAvatarModal() {
    const grid = document.getElementById("avatarGrid");
    grid.innerHTML = "";
    ALL_AVATARS.forEach(avatar => {
        const btn = document.createElement("button");
        btn.className = "modal-avatar-btn" + (avatar.id === selectedAvatarId ? " selected" : "");
        btn.innerHTML = `<img src="${avatar.src}" alt="${avatar.name}"><span>${avatar.name}</span>`;
        btn.onclick = () => applyAvatar(avatar, btn);
        grid.appendChild(btn);
    });
    document.getElementById("avatarModal").classList.remove("hidden");
}

function applyAvatar(avatar, btn) {
    selectedAvatarId = avatar.id;
    document.getElementById("profilePic").style.backgroundImage = `url('${avatar.src}')`;
    document.querySelectorAll(".modal-avatar-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    closeAvatarModal();
}

function closeAvatarModal() {
    document.getElementById("avatarModal").classList.add("hidden");
}

// =====================================================================
// MODAL: NAMECARD DE FUNDO
// =====================================================================

function openNamecardBgModal() {
    const grid = document.getElementById("namecardBgGrid");
    grid.innerHTML = "";
    ALL_NAMECARDS.forEach(card => {
        const btn = document.createElement("button");
        btn.className = "modal-card-btn" + (card.id === selectedNamecardId ? " selected" : "");
        btn.innerHTML = `
            <div class="modal-card-preview ${card.theme}">
                <img src="${card.src}" alt="${card.name}" onerror="this.style.display='none'">
            </div>
            <div class="modal-card-label">${card.name}</div>
        `;
        btn.onclick = () => applyNamecardBg(card, btn);
        grid.appendChild(btn);
    });
    document.getElementById("namecardBgModal").classList.remove("hidden");
}

function applyNamecardBg(card, btn) {
    selectedNamecardId = card.id;
    const wallpaper = document.getElementById("wallpaper");
    wallpaper.style.backgroundImage    = `url('${card.src}')`;
    wallpaper.style.backgroundSize     = "cover";
    wallpaper.style.backgroundPosition = "center";
    document.querySelectorAll(".modal-card-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    closeNamecardBgModal();
}

function closeNamecardBgModal() {
    document.getElementById("namecardBgModal").classList.add("hidden");
}

// =====================================================================
// EQUIPA — 12 slots
// =====================================================================

function toggleCharacter(charId, btn) {
    const idx = team.indexOf(charId);

    if (idx !== -1) {
        // remover da equipa
        team.splice(idx, 1);
        btn.classList.remove("in-team");
        btn.querySelector(".char-check").classList.add("hidden");
    } else {
        // adicionar se ainda há espaço
        if (team.length >= TEAM_MAX) return;
        team.push(charId);
        btn.classList.add("in-team");
        btn.querySelector(".char-check").classList.remove("hidden");
    }

    renderTeamSlots();
}

function renderTeamSlots() {
    const container = document.getElementById("teamSlots");
    container.innerHTML = "";

    // preenche os slots com os personagens adicionados
    for (let i = 0; i < TEAM_MAX; i++) {
        const slot = document.createElement("div");
        const charId = team[i] || null;

        if (charId) {
            const avatar = ALL_AVATARS.find(a => a.id === charId);
            slot.className = "team-slot filled";
            slot.innerHTML = `
                <img src="${avatar.src}" alt="${avatar.name}">
                <div class="slot-remove" onclick="removeCharFromSlot(${i})">✕</div>
            `;
        } else {
            slot.className = "team-slot empty";
            slot.textContent = "＋";
        }

        container.appendChild(slot);
    }

    document.getElementById("teamCount").textContent = `${team.length}/${TEAM_MAX}`;
}

function removeCharFromSlot(slotIndex) {
    const charId = team[slotIndex];
    if (!charId) return;
    team.splice(slotIndex, 1);

    // desmarcar card no painel direito
    const card = document.querySelector(`.char-card[data-char="${charId}"]`);
    if (card) {
        card.classList.remove("in-team");
        card.querySelector(".char-check").classList.add("hidden");
    }

    renderTeamSlots();
}

// =====================================================================
// COLEÇÃO DE NAMECARDS — 9 slots
// =====================================================================

function toggleNamecard(cardId, btn) {
    const idx = collection.indexOf(cardId);

    if (idx !== -1) {
        // remover da coleção
        collection.splice(idx, 1);
        btn.classList.remove("in-collection");
        btn.querySelector(".card-check").classList.add("hidden");
    } else {
        // adicionar se ainda há espaço
        if (collection.length >= NC_MAX) return;
        collection.push(cardId);
        btn.classList.add("in-collection");
        btn.querySelector(".card-check").classList.remove("hidden");
    }

    renderNcSlots();
}

function renderNcSlots() {
    const container = document.getElementById("ncSlots");
    container.innerHTML = "";

    for (let i = 0; i < NC_MAX; i++) {
        const slot = document.createElement("div");
        const cardId = collection[i] || null;

        if (cardId) {
            const card = ALL_NAMECARDS.find(c => c.id === cardId);
            slot.className = `nc-slot filled ${card.theme}`;
            slot.innerHTML = `
                <img src="${card.src}" alt="${card.name}" onerror="this.style.display='none'; this.parentElement.querySelector('.nc-slot-bg').style.display='block'">
                <div class="nc-slot-bg" style="display:none"></div>
                <div class="slot-remove" onclick="removeNcFromSlot(${i})">✕</div>
            `;
        } else {
            slot.className = "nc-slot empty";
            slot.textContent = "＋";
        }

        container.appendChild(slot);
    }

    document.getElementById("ncCount").textContent = `${collection.length}/${NC_MAX}`;
}

function removeNcFromSlot(slotIndex) {
    const cardId = collection[slotIndex];
    if (!cardId) return;
    collection.splice(slotIndex, 1);

    // desmarcar card no painel direito
    const card = document.querySelector(`.card-item[data-card="${cardId}"]`);
    if (card) {
        card.classList.remove("in-collection");
        card.querySelector(".card-check").classList.add("hidden");
    }

    renderNcSlots();
}