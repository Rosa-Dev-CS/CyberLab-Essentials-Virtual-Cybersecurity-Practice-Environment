// CyberLab Essentials Global JS

// Global API call to toggle progress items
async function toggleProgressItem(itemKey, completed) {
    try {
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_key: itemKey,
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update progress on backend.');
        }

        const data = await response.json();
        if (data.success && data.stats) {
            updateHeaderProgress(data.stats);
            showToast(`Progress saved! (${data.stats.completed_items}/${data.stats.total_items} items)`);
            
            // Dispatch custom event for pages to update internal components
            const event = new CustomEvent('progressUpdated', { detail: { stats: data.stats, key: itemKey, completed: completed } });
            window.dispatchEvent(event);
        }
    } catch (error) {
        console.error('Error syncing progress:', error);
        showToast('Error syncing with database!', 'error');
    }
}

// Update DOM elements in base template
function updateHeaderProgress(stats) {
    const textElem = document.getElementById('header-progress-text');
    const barElem = document.getElementById('header-progress-bar');
    const countElem = document.getElementById('header-progress-count');

    if (textElem) textElem.textContent = `${stats.progress_percent}%`;
    if (barElem) barElem.style.width = `${stats.progress_percent}%`;
    if (countElem) countElem.textContent = `(${stats.completed_items}/${stats.total_items})`;
}

// Copy to clipboard helper
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = 'Copied!';
        btnElement.style.borderColor = 'var(--accent-green)';
        btnElement.style.color = 'var(--accent-green)';
        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.borderColor = '';
            btnElement.style.color = '';
        }, 1500);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Toast notification engine
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'glass-panel';
    toast.style.padding = '0.75rem 1.25rem';
    toast.style.borderRadius = '8px';
    toast.style.color = 'var(--text-primary)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.borderLeft = type === 'success' ? '4px solid var(--accent-cyan)' : '4px solid var(--accent-red)';
    toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    toast.style.animation = 'slideIn 0.3s ease-out forwards';
    toast.style.background = 'rgba(15, 18, 30, 0.95)';
    toast.textContent = message;

    container.appendChild(toast);

    // Slide in animation keyframe inject if not present
    if (!document.getElementById('toast-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-animation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-remove toast
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.4s ease-in forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Universal Tabs System
document.addEventListener('DOMContentLoaded', () => {
    const tabHeaders = document.querySelectorAll('.tabs-header');
    
    tabHeaders.forEach(header => {
        const btns = header.querySelectorAll('.tab-btn');
        const parent = header.parentElement;
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                
                // Deactivate all buttons in header
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Hide all panes
                const panes = parent.querySelectorAll('.tab-pane');
                panes.forEach(pane => pane.classList.remove('active'));
                
                // Show selected pane
                const activePane = parent.querySelector(targetId);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    });

    // Accordions System
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isOpen = item.classList.contains('open');
            
            // Close other items if in exclusive accordion
            const parent = item.parentElement;
            if (parent && parent.classList.contains('accordion-exclusive')) {
                parent.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
            }
            
            if (isOpen) {
                item.classList.remove('open');
            } else {
                item.classList.add('open');
            }
        });
    });
});
