// ValYou - Asset Portfolio Tracker

// Sample Data (will be replaced with localStorage)
let assets = [];

// DOM Elements
const totalValueEl = document.getElementById('totalValue');
const totalChangeEl = document.getElementById('totalChange');
const assetListEl = document.getElementById('assetList');
const modalOverlay = document.getElementById('modalOverlay');
const addAssetBtn = document.getElementById('addAssetBtn');
const cancelBtn = document.getElementById('cancelBtn');
const assetForm = document.getElementById('assetForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAssets();
    renderAssets();
    updateTotal();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addAssetBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    assetForm.addEventListener('submit', handleAddAsset);
}

// Modal Controls
function openModal() {
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    assetForm.reset();
}

// Add Asset
function handleAddAsset(e) {
    e.preventDefault();

    const type = document.getElementById('assetType').value;
    const name = document.getElementById('assetName').value;
    const quantity = parseFloat(document.getElementById('assetQuantity').value);
    const price = parseFloat(document.getElementById('assetPrice').value);

    const asset = {
        id: Date.now(),
        type,
        name,
        quantity,
        purchasePrice: price,
        currentPrice: price, // Will be updated with real data later
    };

    assets.push(asset);
    saveAssets();
    renderAssets();
    updateTotal();
    closeModal();
}

// Render Assets
function renderAssets() {
    if (assets.length === 0) {
        assetListEl.innerHTML = '<p class="empty-state">자산을 추가해 보세요</p>';
        return;
    }

    assetListEl.innerHTML = assets.map(asset => {
        const totalValue = asset.quantity * asset.currentPrice;
        const purchaseValue = asset.quantity * asset.purchasePrice;
        const change = totalValue - purchaseValue;
        const changePercent = purchaseValue > 0 ? ((change / purchaseValue) * 100).toFixed(2) : 0;
        const isPositive = change >= 0;

        return `
            <div class="asset-item" data-id="${asset.id}">
                <div class="asset-info">
                    <span class="asset-name">${asset.name}</span>
                    <span class="asset-meta">${getTypeLabel(asset.type)} · ${asset.quantity.toLocaleString()}개</span>
                </div>
                <div class="asset-value">
                    <div class="asset-current">${formatCurrency(totalValue)}</div>
                    <div class="asset-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${formatCurrency(change)} (${isPositive ? '+' : ''}${changePercent}%)
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update Total
function updateTotal() {
    const total = assets.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    const purchaseTotal = assets.reduce((sum, asset) => sum + (asset.quantity * asset.purchasePrice), 0);
    const change = total - purchaseTotal;
    const changePercent = purchaseTotal > 0 ? ((change / purchaseTotal) * 100).toFixed(2) : 0;
    const isPositive = change >= 0;

    totalValueEl.textContent = formatCurrency(total);
    totalChangeEl.textContent = `${isPositive ? '+' : ''}${formatCurrency(change)} (${isPositive ? '+' : ''}${changePercent}%)`;
    totalChangeEl.className = `total-change ${isPositive ? 'positive' : 'negative'}`;
}

// Helper Functions
function formatCurrency(value) {
    return '₩' + Math.round(value).toLocaleString();
}

function getTypeLabel(type) {
    const labels = {
        stock: '주식',
        crypto: '암호화폐',
        cash: '현금',
        realestate: '부동산',
        other: '기타'
    };
    return labels[type] || type;
}

// LocalStorage
function saveAssets() {
    localStorage.setItem('valyou_assets', JSON.stringify(assets));
}

function loadAssets() {
    const saved = localStorage.getItem('valyou_assets');
    if (saved) {
        assets = JSON.parse(saved);
    }
}
