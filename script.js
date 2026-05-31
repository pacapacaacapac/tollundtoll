const cursor = document.getElementById('cursor');
const svg = document.querySelector('svg');
const projekteOverlay = document.getElementById('projekte-overlay');
const impressumOverlay = document.getElementById('impressum-overlay');
const ueberOverlay = document.getElementById('ueber-overlay');
const pillGroup = document.querySelector('.pill-group');
const pillOrange = document.querySelector('.pill--orange');

const kontaktOverlay = document.getElementById('kontakt-overlay');
const allOverlays = [projekteOverlay, impressumOverlay, ueberOverlay, kontaktOverlay];

function positionOverlay(overlay) {
	if (window.innerWidth <= 768) {
		overlay.style.left = '1.25rem';
		overlay.style.right = '1.25rem';
	} else {
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const leftEdge = pillGroup.getBoundingClientRect().right + 1.5 * rem;
		const rightEdge = window.innerWidth - pillOrange.getBoundingClientRect().left + 1.5 * rem;
		overlay.style.left = leftEdge + 'px';
		overlay.style.right = rightEdge + 'px';
	}
}

function openOverlay(overlay) {
	allOverlays.forEach(o => { o.hidden = true; });
	positionOverlay(overlay);
	overlay.hidden = false;
	const scrollable = overlay.querySelector('.ueber-content, .impressum-content, .projekte-list');
	if (scrollable) scrollable.scrollTop = 0;
}

document.getElementById('btn-projekte').addEventListener('click', () => openOverlay(projekteOverlay));
document.getElementById('projekte-close').addEventListener('click', () => { projekteOverlay.hidden = true; });

document.getElementById('impressum').addEventListener('click', () => openOverlay(impressumOverlay));
document.getElementById('impressum-close').addEventListener('click', () => { impressumOverlay.hidden = true; });

document.getElementById('btn-ueber').addEventListener('click', () => openOverlay(ueberOverlay));
document.getElementById('ueber-close').addEventListener('click', () => { ueberOverlay.hidden = true; });

const kontaktGruppe = document.getElementById('kontakt-gruppe');

document.getElementById('btn-kontakt').addEventListener('click', () => {
	allOverlays.forEach(o => { o.hidden = true; });
	kontaktGruppe.classList.remove('open');
	kontaktOverlay.hidden = false;
});

kontaktGruppe.addEventListener('click', () => {
	if (kontaktGruppe.classList.contains('open')) {
		kontaktGruppe.classList.remove('open');
		kontaktGruppe.style.transform = '';
	} else {
		const groupRect = kontaktGruppe.getBoundingClientRect();
		const fontSize = parseFloat(getComputedStyle(document.getElementById('kontakt-mail')).fontSize);
		const emailBottom = groupRect.top + 0.62 * groupRect.height + fontSize * 1.5;
		const padding = 32;
		const overflow = emailBottom + padding - window.innerHeight;
		const translateY = overflow > 0
			? -overflow
			: -0.26 * groupRect.height;
		kontaktGruppe.style.transform = `translateY(${translateY}px)`;
		kontaktGruppe.classList.add('open');
	}
});

document.getElementById('kontakt-close').addEventListener('click', () => { kontaktOverlay.hidden = true; });

document.addEventListener('mousemove', e => {
	cursor.style.left = e.clientX + 'px';
	cursor.style.top = e.clientY + 'px';
});

document.addEventListener('selectionchange', () => {
	document.querySelectorAll('.selection-rect').forEach(el => el.remove());
	const sel = window.getSelection();
	if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
	const rects = sel.getRangeAt(0).getClientRects();
	for (const rect of rects) {
		const div = document.createElement('div');
		div.className = 'selection-rect';
		div.style.left = rect.left + 'px';
		div.style.top = rect.top + 'px';
		div.style.width = rect.width + 'px';
		div.style.height = rect.height + 'px';
		document.body.appendChild(div);
	}
});

const mainSvg = document.querySelector('svg:not(#grid)');
const motionPath = document.getElementById('motionPath');
const desktopD = motionPath.getAttribute('d');
const desktopTransform = motionPath.getAttribute('transform') || '';
const mobileD = 'M-118.765,303.66C-73.272,209.503 84.601,152.817 142.899,151.191C200.419,149.586 278.257,189.147 263.27,292.425C251.541,373.247 193.384,408.775 120.074,406.1C8.857,402.042 -112.016,447.297 -72.163,553.018C-18.658,694.954 118.077,517.554 174.197,618.427C204.651,673.167 85.088,741.212 152.529,815.635C343.02,1025.849 552.034,700.689 327.467,590.944C238.884,547.653 286.056,383 423.763,390.326C465.085,392.525 533.834,432.57 568.208,452.593';

function updatePathForViewport() {
	if (window.innerWidth <= 768) {
		motionPath.setAttribute('d', mobileD);
		motionPath.removeAttribute('transform');
		mainSvg.setAttribute('viewBox', '-89 188 627 800');
		mainSvg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
	} else {
		motionPath.setAttribute('d', desktopD);
		if (desktopTransform) motionPath.setAttribute('transform', desktopTransform);
		mainSvg.setAttribute('viewBox', '-43.635 -3 1115.401 506');
		mainSvg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
	}
}

updatePathForViewport();
window.addEventListener('resize', updatePathForViewport);

const textEl = document.querySelector('svg text');
const textPath = textEl.querySelector('textPath');
const originalText = textPath.firstChild.textContent;
const hoverText = 'Verein, der Raum für Ideen schafft • '.repeat(40);

let leaveTimer = null;

textEl.addEventListener('mouseenter', () => {
	if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
	textPath.firstChild.textContent = hoverText;
});

textEl.addEventListener('mouseleave', () => {
	leaveTimer = setTimeout(() => {
		textPath.firstChild.textContent = originalText;
		leaveTimer = null;
	}, 80);
});

let textIsHover = false;

function toggleTextStateOnMobile() {
	if (window.innerWidth > 768) return;
	textIsHover = !textIsHover;
	if (textIsHover) {
		textEl.style.fill = '#f5f5f5';
		textEl.style.fontWeight = '300';
		textEl.style.letterSpacing = '0.01em';
		textPath.firstChild.textContent = hoverText;
	} else {
		textEl.style.fill = '#225107';
		textEl.style.fontWeight = 'normal';
		textEl.style.letterSpacing = '-0.01em';
		textPath.firstChild.textContent = originalText;
	}
}

['projekte-close', 'impressum-close', 'ueber-close', 'kontakt-close'].forEach(id => {
	document.getElementById(id).addEventListener('click', toggleTextStateOnMobile);
});
