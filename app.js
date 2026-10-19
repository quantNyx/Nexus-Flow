/**
 * NexusFlow — Modern Productivity & Focus Studio
 * Core Application Engine & State Store
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE MANAGEMENT & STORAGE KEYS
  // =========================================================================
  const STORAGE_KEY = 'nexusflow_app_state_v1';

  const DEFAULT_STATE = {
    theme: 'dark',
    soundEnabled: true,
    ambientSound: 'none',
    activeView: 'board',
    filterPriority: 'all',
    filterTag: 'all',
    searchQuery: '',
    focusStats: {
      sessionsToday: 3,
      minutesToday: 75,
      totalFocusSeconds: 4500,
      streak: 4,
      lastActiveDate: new Date().toISOString().split('T')[0]
    },
    tasks: [
      {
        id: 'task-1',
        title: 'Architect Audio Synthesis Engine',
        desc: 'Implement native Web Audio API oscillators for ambient binaural frequencies and soothing white noise.',
        status: 'done',
        priority: 'urgent',
        due: '2026-10-19',
        tags: ['Audio', 'WebAPI', 'Core'],
        createdAt: Date.now() - 86400000 * 2
      },
      {
        id: 'task-2',
        title: 'Build Interactive Kanban Drag-and-Drop',
        desc: 'Create smooth drag physics with visual drop zones, column counters, and mobile fallback actions.',
        status: 'done',
        priority: 'high',
        due: '2026-10-20',
        tags: ['UI', 'Kanban', 'Frontend'],
        createdAt: Date.now() - 86400000
      },
      {
        id: 'task-3',
        title: 'Design Habit Discipline Matrix',
        desc: '7-day rolling matrix with streak calculations, category groupings, and instant local persistence.',
        status: 'in-progress',
        priority: 'high',
        due: '2026-10-21',
        tags: ['Habits', 'Matrix', 'State'],
        createdAt: Date.now() - 40000000
      },
      {
        id: 'task-4',
        title: 'Integrate Pomodoro Circular Gauge',
        desc: 'Smooth SVG stroke-dashoffset transition, sprint linking to Kanban cards, and chime notifications.',
        status: 'in-progress',
        priority: 'medium',
        due: '2026-10-22',
        tags: ['Focus', 'SVG', 'Timer'],
        createdAt: Date.now() - 20000000
      },
      {
        id: 'task-5',
        title: 'Git Version Control & Remote Sync',
        desc: 'Connect workspace to GitHub repository with Windows Credential Manager and publish initial release.',
        status: 'backlog',
        priority: 'urgent',
        due: '2026-10-23',
        tags: ['Git', 'DevOps'],
        createdAt: Date.now() - 10000000
      },
      {
        id: 'task-6',
        title: 'Velocity Analytics & Performance Dashboard',
        desc: 'Aggregate task completion velocity, habit adherence percentages, and focus sprint telemetry.',
        status: 'review',
        priority: 'medium',
        due: '2026-10-24',
        tags: ['Analytics', 'Telemetry'],
        createdAt: Date.now() - 5000000
      }
    ],
    habits: [
      {
        id: 'habit-1',
        title: 'Deep Coding Sprint (90m)',
        category: 'Engineering',
        icon: '💻',
        streak: 8,
        history: {}
      },
      {
        id: 'habit-2',
        title: 'Read System Architecture Docs',
        category: 'Mind & Learning',
        icon: '📚',
        streak: 5,
        history: {}
      },
      {
        id: 'habit-3',
        title: 'Hydration & Core Mobility',
        category: 'Fitness & Health',
        icon: '💧',
        streak: 12,
        history: {}
      },
      {
        id: 'habit-4',
        title: 'Review Daily Pull Requests',
        category: 'Engineering',
        icon: '⚡',
        streak: 6,
        history: {}
      }
    ]
  };

  // Seed sample history for habits over the past 7 days
  (function seedHabitHistory() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      DEFAULT_STATE.habits[0].history[dateKey] = true;
      if (i !== 3) DEFAULT_STATE.habits[1].history[dateKey] = true;
      DEFAULT_STATE.habits[2].history[dateKey] = true;
      if (i < 5) DEFAULT_STATE.habits[3].history[dateKey] = true;
    }
  })();

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.assign({}, DEFAULT_STATE, parsed);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  // =========================================================================
  // 2. AUDIO SYNTHESIS ENGINE (Web Audio API)
  // =========================================================================
  const AudioEngine = {
    ctx: null,
    ambientNode: null,
    ambientType: 'none',

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playClick() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },

    playChime() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.5);
      });
    },

    setAmbient(type) {
      this.init();
      if (!this.ctx) return;

      if (this.ambientNode) {
        try {
          this.ambientNode.stop();
          this.ambientNode.disconnect();
        } catch (e) {}
        this.ambientNode = null;
      }

      this.ambientType = type;
      state.ambientSound = type;
      saveState();

      if (type === 'none') return;

      if (type === 'rain' || type === 'brown') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'brown') {
            lastOut = (lastOut + 0.02 * white) / 1.02;
            data[i] = lastOut * 3.5;
          } else {
            // Rain simulation: band-filtered noise with low rumble
            data[i] = white * 0.15;
          }
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'brown' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'brown' ? 350 : 1200;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.14;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.ambientNode = noise;
      } else if (type === 'binaural') {
        // Binaural 40Hz Gamma Focus Frequency (left 200Hz, right 240Hz)
        const merger = this.ctx.createChannelMerger(2);

        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = 200;

        const oscR = this.ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.value = 240;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.09;

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(this.ctx.destination);

        oscL.start();
        oscR.start();

        this.ambientNode = {
          stop: () => {
            oscL.stop();
            oscR.stop();
          },
          disconnect: () => {
            merger.disconnect();
            gain.disconnect();
          }
        };
      }
    }
  };

  // =========================================================================
  // 3. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '⚡';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  // =========================================================================
  // 4. THEME & GLOBAL NAVIGATION CONTROLLER
  // =========================================================================
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        saveState();
        AudioEngine.playClick();
        showToast(`Theme switched to ${state.theme} mode`, 'info');
      });
    }

    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      updateSoundButtonUI();
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        updateSoundButtonUI();
        saveState();
        if (state.soundEnabled) AudioEngine.playClick();
        showToast(state.soundEnabled ? 'Audio effects enabled' : 'Audio muted', 'info');
      });
    }
  }

  function updateSoundButtonUI() {
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (!soundBtn) return;
    soundBtn.style.opacity = state.soundEnabled ? '1' : '0.45';
  }

  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-view');
        switchView(targetView);
        AudioEngine.playClick();
      });
    });
  }

  function switchView(viewName) {
    state.activeView = viewName;
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });
    document.querySelectorAll('.content-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    if (viewName === 'board') renderKanbanBoard();
    if (viewName === 'habits') renderHabitMatrix();
    if (viewName === 'analytics') renderAnalytics();
    if (viewName === 'focus') updateFocusTaskSelector();
  }

  // =========================================================================
  // 5. LIVE CLOCK WIDGET
  // =========================================================================
  function initClock() {
    const dateEl = document.getElementById('live-date');
    const timeEl = document.getElementById('live-time');

    function update() {
      const now = new Date();
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      }
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    }
    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // 6. KANBAN BOARD ENGINE (Drag & Drop + CRUD)
  // =========================================================================
  let draggedTaskId = null;

  function renderKanbanBoard() {
    const statuses = ['backlog', 'in-progress', 'review', 'done'];
    const columns = {
      'backlog': document.getElementById('drop-zone-backlog'),
      'in-progress': document.getElementById('drop-zone-in-progress'),
      'review': document.getElementById('drop-zone-review'),
      'done': document.getElementById('drop-zone-done')
    };

    statuses.forEach(s => {
      if (columns[s]) columns[s].innerHTML = '';
    });

    // Populate tags filter
    updateTagFilterOptions();

    // Filter tasks
    const query = (state.searchQuery || '').toLowerCase();
    const filteredTasks = state.tasks.filter(task => {
      const matchesPri = state.filterPriority === 'all' || task.priority === state.filterPriority;
      const matchesTag = state.filterTag === 'all' || (task.tags && task.tags.includes(state.filterTag));
      const matchesSearch = !query ||
        task.title.toLowerCase().includes(query) ||
        (task.desc && task.desc.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(t => t.toLowerCase().includes(query)));
      return matchesPri && matchesTag && matchesSearch;
    });

    // Count badges per column
    const counts = { backlog: 0, 'in-progress': 0, review: 0, done: 0 };

    filteredTasks.forEach(task => {
      if (counts[task.status] !== undefined) counts[task.status]++;
      const dropZone = columns[task.status];
      if (dropZone) {
        dropZone.appendChild(createTaskCardElement(task));
      }
    });

    // Update column counters in UI
    statuses.forEach(s => {
      const countEl = document.getElementById(`count-${s}`);
      if (countEl) countEl.textContent = counts[s];

      if (columns[s] && counts[s] === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-column-msg';
        emptyMsg.textContent = 'No tasks in this lane';
        columns[s].appendChild(emptyMsg);
      }
    });

    // Update global badge
    const badgeTotal = document.getElementById('badge-total-tasks');
    if (badgeTotal) badgeTotal.textContent = state.tasks.length;
  }

  function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.id = `card-${task.id}`;
    card.setAttribute('data-task-id', task.id);

    // Check overdue
    let isOverdue = false;
    let dueFormatted = 'No due date';
    if (task.due) {
      const dueDate = new Date(task.due);
      isOverdue = dueDate < new Date() && task.status !== 'done';
      dueFormatted = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const tagsHtml = (task.tags || [])
      .map(tag => `<span class="tag-pill">#${escapeHtml(tag)}</span>`)
      .join('');

    card.innerHTML = `
      <div class="card-top">
        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
        <div class="card-actions-menu">
          <button class="btn-card-action btn-edit-task" title="Edit Task" data-id="${task.id}">✏️</button>
          <button class="btn-card-action btn-delete-task" title="Delete Task" data-id="${task.id}">🗑️</button>
        </div>
      </div>
      <h4 class="card-title">${escapeHtml(task.title)}</h4>
      ${task.desc ? `<p class="card-desc">${escapeHtml(task.desc)}</p>` : ''}
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
      <div class="card-footer">
        <div class="due-indicator ${isOverdue ? 'overdue' : ''}">
          <span>📅</span>
          <span>${dueFormatted}</span>
        </div>
        <div class="task-move-quick">
          <select class="select-quick-move" data-id="${task.id}" title="Quick Move Status">
            <option value="backlog" ${task.status === 'backlog' ? 'selected' : ''}>Backlog</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
            <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
          </select>
        </div>
      </div>
    `;

    // Drag events
    card.addEventListener('dragstart', (e) => {
      draggedTaskId = task.id;
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
      AudioEngine.playClick();
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedTaskId = null;
      document.querySelectorAll('.column-drop-zone').forEach(z => z.classList.remove('drag-over'));
    });

    // Card actions
    card.querySelector('.btn-edit-task').addEventListener('click', (e) => {
      e.stopPropagation();
      openTaskModal(task);
    });

    card.querySelector('.btn-delete-task').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    card.querySelector('.select-quick-move').addEventListener('change', (e) => {
      e.stopPropagation();
      moveTask(task.id, e.target.value);
    });

    return card;
  }

  function initKanbanDragDrop() {
    const dropZones = document.querySelectorAll('.column-drop-zone');
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', (e) => {
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('drag-over');
        }
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
        const targetStatus = zone.getAttribute('data-status');
        if (taskId && targetStatus) {
          moveTask(taskId, targetStatus);
        }
      });
    });

    // Add buttons on column headers
    document.querySelectorAll('.btn-col-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const initialStatus = btn.getAttribute('data-add-status') || 'backlog';
        openTaskModal(null, initialStatus);
      });
    });

    // Priority filter chips
    document.querySelectorAll('.filter-chip[data-filter-priority]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.filterPriority = chip.getAttribute('data-filter-priority');
        renderKanbanBoard();
        AudioEngine.playClick();
      });
    });

    // Tag filter dropdown
    const tagSelect = document.getElementById('select-filter-tag');
    if (tagSelect) {
      tagSelect.addEventListener('change', (e) => {
        state.filterTag = e.target.value;
        renderKanbanBoard();
      });
    }

    // Global Search Input
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderKanbanBoard();
      });
    }
  }

  function updateTagFilterOptions() {
    const select = document.getElementById('select-filter-tag');
    if (!select) return;

    const allTags = new Set();
    state.tasks.forEach(t => (t.tags || []).forEach(tag => allTags.add(tag)));

    const currentVal = state.filterTag;
    select.innerHTML = '<option value="all">All Tags</option>';
    Array.from(allTags).sort().forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = `#${tag}`;
      if (tag === currentVal) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function moveTask(taskId, newStatus) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    task.status = newStatus;
    saveState();
    renderKanbanBoard();
    AudioEngine.playClick();

    if (newStatus === 'done') {
      AudioEngine.playChime();
      showToast(`Completed: "${task.title}" 🎉`, 'success');
    } else {
      showToast(`Moved to ${newStatus}`, 'info');
    }
  }

  function deleteTask(taskId) {
    const index = state.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;
    const [removed] = state.tasks.splice(index, 1);
    saveState();
    renderKanbanBoard();
    AudioEngine.playClick();
    showToast(`Deleted "${removed.title}"`, 'info');
  }

  // =========================================================================
  // 7. TASK MODAL (Add / Edit)
  // =========================================================================
  function initTaskModal() {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');
    const btnClose = document.getElementById('btn-close-task-modal');
    const btnCancel = document.getElementById('btn-cancel-task');
    const btnHeaderAdd = document.getElementById('btn-header-add-task');
    const btnQuickAdd = document.getElementById('btn-quick-add-task');

    [btnHeaderAdd, btnQuickAdd].forEach(btn => {
      if (btn) btn.addEventListener('click', () => openTaskModal());
    });

    [btnClose, btnCancel].forEach(btn => {
      if (btn) btn.addEventListener('click', closeTaskModal);
    });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTaskModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTaskFromModal();
      });
    }
  }

  function openTaskModal(task = null, defaultStatus = 'backlog') {
    const modal = document.getElementById('task-modal');
    const titleEl = document.getElementById('task-modal-title');
    const idInput = document.getElementById('task-input-id');
    const titleInput = document.getElementById('task-input-title');
    const descInput = document.getElementById('task-input-desc');
    const statusInput = document.getElementById('task-input-status');
    const priInput = document.getElementById('task-input-priority');
    const dueInput = document.getElementById('task-input-due');
    const tagsInput = document.getElementById('task-input-tags');

    if (task) {
      titleEl.textContent = 'Edit Task';
      idInput.value = task.id;
      titleInput.value = task.title;
      descInput.value = task.desc || '';
      statusInput.value = task.status;
      priInput.value = task.priority;
      dueInput.value = task.due || '';
      tagsInput.value = (task.tags || []).join(', ');
    } else {
      titleEl.textContent = 'Create New Task';
      idInput.value = '';
      titleInput.value = '';
      descInput.value = '';
      statusInput.value = defaultStatus;
      priInput.value = 'medium';
      dueInput.value = new Date().toISOString().split('T')[0];
      tagsInput.value = '';
    }

    modal.classList.add('open');
    titleInput.focus();
    AudioEngine.playClick();
  }

  function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('open');
  }

  function saveTaskFromModal() {
    const id = document.getElementById('task-input-id').value;
    const title = document.getElementById('task-input-title').value.trim();
    const desc = document.getElementById('task-input-desc').value.trim();
    const status = document.getElementById('task-input-status').value;
    const priority = document.getElementById('task-input-priority').value;
    const due = document.getElementById('task-input-due').value;
    const tagsRaw = document.getElementById('task-input-tags').value;
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    if (!title) return;

    if (id) {
      // Edit existing
      const existing = state.tasks.find(t => t.id === id);
      if (existing) {
        existing.title = title;
        existing.desc = desc;
        existing.status = status;
        existing.priority = priority;
        existing.due = due;
        existing.tags = tags;
        showToast(`Updated "${title}"`, 'success');
      }
    } else {
      // Create new
      const newTask = {
        id: 'task-' + Date.now(),
        title,
        desc,
        status,
        priority,
        due,
        tags,
        createdAt: Date.now()
      };
      state.tasks.unshift(newTask);
      showToast(`Created task "${title}"`, 'success');
    }

    saveState();
    closeTaskModal();
    renderKanbanBoard();
    AudioEngine.playClick();
  }

  // =========================================================================
  // 8. HABIT DISCIPLINE MATRIX ENGINE
  // =========================================================================
  function renderHabitMatrix() {
    const container = document.getElementById('habit-table-container');
    const daysHeader = document.getElementById('habit-days-header');
    if (!container || !daysHeader) return;

    // Build rolling 7 days
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({
        dateKey: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNum: d.getDate(),
        isToday: i === 0
      });
    }

    // Render Days Header
    daysHeader.innerHTML = days.map(day => `
      <div style="font-weight: ${day.isToday ? '800' : '500'}; color: ${day.isToday ? 'var(--accent-cyan)' : 'inherit'}">
        <span>${day.dayName}</span><br>
        <small style="opacity:0.7">${day.dayNum}</small>
      </div>
    `).join('');

    // Render Habit Rows
    container.innerHTML = '';
    const todayKey = today.toISOString().split('T')[0];
    let totalCompletedToday = 0;

    state.habits.forEach(habit => {
      const row = document.createElement('div');
      row.className = 'habit-row';

      if (habit.history && habit.history[todayKey]) {
        totalCompletedToday++;
      }

      const daysGridHtml = days.map(day => {
        const isDone = habit.history && habit.history[day.dateKey];
        return `
          <button class="day-check-btn ${isDone ? 'completed' : ''}" 
                  data-habit-id="${habit.id}" 
                  data-date-key="${day.dateKey}" 
                  title="${day.dateKey}">
            ✓
          </button>
        `;
      }).join('');

      row.innerHTML = `
        <div class="habit-title-box">
          <div class="habit-icon-pill">${habit.icon || '🔥'}</div>
          <span class="habit-name-text">${escapeHtml(habit.title)}</span>
        </div>
        <div>
          <span class="habit-category-badge">${escapeHtml(habit.category || 'General')}</span>
        </div>
        <div class="habit-days-grid">${daysGridHtml}</div>
        <div>
          <span class="streak-pill">🔥 ${habit.streak || 0}d</span>
        </div>
        <div>
          <button class="btn-card-action btn-delete-habit" data-id="${habit.id}" title="Remove routine">🗑️</button>
        </div>
      `;

      // Checkbox click
      row.querySelectorAll('.day-check-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const hid = btn.getAttribute('data-habit-id');
          const dkey = btn.getAttribute('data-date-key');
          toggleHabitCheck(hid, dkey);
        });
      });

      // Delete habit
      row.querySelector('.btn-delete-habit').addEventListener('click', () => {
        deleteHabit(habit.id);
      });

      container.appendChild(row);
    });

    // Update Overview Stats
    const activeCount = state.habits.length;
    const badgeHabits = document.getElementById('badge-active-habits');
    if (badgeHabits) badgeHabits.textContent = activeCount;

    const statActive = document.getElementById('stat-habits-active');
    if (statActive) statActive.textContent = activeCount;

    const maxStreak = state.habits.reduce((acc, h) => Math.max(acc, h.streak || 0), 0);
    const statStreak = document.getElementById('stat-habits-best-streak');
    if (statStreak) statStreak.textContent = `${maxStreak} Days`;

    const todayRate = activeCount ? Math.round((totalCompletedToday / activeCount) * 100) : 0;
    const statTodayRate = document.getElementById('stat-habits-today-rate');
    if (statTodayRate) statTodayRate.textContent = `${todayRate}%`;

    // Sidebar Momentum Widget
    const sideStreak = document.getElementById('sidebar-streak-count');
    if (sideStreak) sideStreak.textContent = `${maxStreak} Days`;
    const sideProgress = document.getElementById('sidebar-day-progress');
    if (sideProgress) sideProgress.style.width = `${todayRate}%`;

    // 7-day consistency calculation
    let totalChecks = 0;
    state.habits.forEach(h => {
      days.forEach(d => {
        if (h.history && h.history[d.dateKey]) totalChecks++;
      });
    });
    const possibleChecks = activeCount * 7;
    const weeklyRate = possibleChecks ? Math.round((totalChecks / possibleChecks) * 100) : 0;
    const statWeekly = document.getElementById('stat-habits-weekly-rate');
    if (statWeekly) statWeekly.textContent = `${weeklyRate}%`;
  }

  function toggleHabitCheck(habitId, dateKey) {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    if (!habit.history) habit.history = {};

    const currentlyDone = !!habit.history[dateKey];
    if (currentlyDone) {
      delete habit.history[dateKey];
      habit.streak = Math.max(0, (habit.streak || 1) - 1);
    } else {
      habit.history[dateKey] = true;
      habit.streak = (habit.streak || 0) + 1;
      AudioEngine.playChime();
    }

    saveState();
    renderHabitMatrix();
    AudioEngine.playClick();
  }

  function deleteHabit(habitId) {
    const idx = state.habits.findIndex(h => h.id === habitId);
    if (idx === -1) return;
    const [removed] = state.habits.splice(idx, 1);
    saveState();
    renderHabitMatrix();
    AudioEngine.playClick();
    showToast(`Removed routine "${removed.title}"`, 'info');
  }

  function initHabitModal() {
    const modal = document.getElementById('habit-modal');
    const form = document.getElementById('habit-form');
    const btnAdd = document.getElementById('btn-add-habit');
    const btnClose = document.getElementById('btn-close-habit-modal');
    const btnCancel = document.getElementById('btn-cancel-habit');

    if (btnAdd) btnAdd.addEventListener('click', () => {
      modal.classList.add('open');
      document.getElementById('habit-input-title').focus();
    });

    [btnClose, btnCancel].forEach(b => {
      if (b) b.addEventListener('click', () => modal.classList.remove('open'));
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('habit-input-title').value.trim();
        const category = document.getElementById('habit-input-category').value;
        const icon = document.getElementById('habit-input-icon').value.trim() || '🔥';

        if (!title) return;

        state.habits.push({
          id: 'habit-' + Date.now(),
          title,
          category,
          icon,
          streak: 1,
          history: {
            [new Date().toISOString().split('T')[0]]: true
          }
        });

        saveState();
        modal.classList.remove('open');
        form.reset();
        renderHabitMatrix();
        AudioEngine.playChime();
        showToast(`Added routine "${title}"`, 'success');
      });
    }
  }

  // =========================================================================
  // 9. FOCUS & POMODORO TIMER ENGINE
  // =========================================================================
  const FocusTimer = {
    mode: 'pomodoro', // pomodoro (25m), shortBreak (5m), longBreak (15m)
    durations: {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    },
    timeLeft: 25 * 60,
    isRunning: false,
    timerId: null,
    circumference: 2 * Math.PI * 130, // r = 130 in SVG
    linkedTaskId: null,

    init() {
      this.timeLeft = this.durations.pomodoro;
      this.updateDisplay();

      // Mode tabs
      document.querySelectorAll('.mode-tab[data-mode]').forEach(tab => {
        tab.addEventListener('click', () => {
          const newMode = tab.getAttribute('data-mode');
          this.setMode(newMode);
        });
      });

      // Controls
      const toggleBtn = document.getElementById('btn-timer-toggle');
      if (toggleBtn) toggleBtn.addEventListener('click', () => this.toggle());

      const resetBtn = document.getElementById('btn-timer-reset');
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

      const skipBtn = document.getElementById('btn-timer-skip');
      if (skipBtn) skipBtn.addEventListener('click', () => this.completeSession(true));

      // Ambient audio chips
      document.querySelectorAll('.sound-chip[data-sound]').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.sound-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const sound = chip.getAttribute('data-sound');
          AudioEngine.setAmbient(sound);
          showToast(`Ambient synthesizer: ${sound}`, 'info');
        });
      });

      // Task selector
      const taskSelect = document.getElementById('select-focus-task');
      if (taskSelect) {
        taskSelect.addEventListener('change', (e) => {
          this.linkedTaskId = e.target.value || null;
          this.updateLinkedTaskDisplay();
        });
      }

      this.updateTelemetry();
    },

    setMode(newMode) {
      this.pause();
      this.mode = newMode;
      this.timeLeft = this.durations[newMode] || 25 * 60;
      document.querySelectorAll('.mode-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-mode') === newMode);
      });
      const statusLabel = document.getElementById('timer-status-label');
      if (statusLabel) {
        statusLabel.textContent = newMode === 'pomodoro' ? 'READY TO DEEP WORK' : 'RECOVERY BREAK';
      }
      this.updateDisplay();
      AudioEngine.playClick();
    },

    toggle() {
      if (this.isRunning) {
        this.pause();
      } else {
        this.start();
      }
    },

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      AudioEngine.playClick();

      document.getElementById('icon-timer-play').style.display = 'none';
      document.getElementById('icon-timer-pause').style.display = 'block';
      document.getElementById('btn-timer-text').textContent = 'Pause Sprint';
      document.getElementById('focus-active-indicator').style.display = 'inline-block';

      this.timerId = setInterval(() => {
        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft <= 0) {
          this.completeSession();
        }
      }, 1000);
    },

    pause() {
      if (!this.isRunning) return;
      this.isRunning = false;
      clearInterval(this.timerId);
      this.timerId = null;

      document.getElementById('icon-timer-play').style.display = 'block';
      document.getElementById('icon-timer-pause').style.display = 'none';
      document.getElementById('btn-timer-text').textContent = 'Resume Sprint';
      document.getElementById('focus-active-indicator').style.display = 'none';
    },

    reset() {
      this.pause();
      this.timeLeft = this.durations[this.mode];
      document.getElementById('btn-timer-text').textContent = 'Begin Sprint';
      this.updateDisplay();
      AudioEngine.playClick();
    },

    completeSession(skipped = false) {
      this.pause();
      AudioEngine.playChime();

      if (!skipped && this.mode === 'pomodoro') {
        state.focusStats.sessionsToday = (state.focusStats.sessionsToday || 0) + 1;
        state.focusStats.minutesToday = (state.focusStats.minutesToday || 0) + 25;
        state.focusStats.totalFocusSeconds = (state.focusStats.totalFocusSeconds || 0) + 1500;
        state.focusStats.streak = (state.focusStats.streak || 0) + 1;
        saveState();

        showToast('Deep Work sprint completed! 25 minutes logged 🎯', 'success');

        // If linked to a task, offer or celebrate
        if (this.linkedTaskId) {
          const task = state.tasks.find(t => t.id === this.linkedTaskId);
          if (task) {
            showToast(`Focus logged to task: "${task.title}"`, 'info');
          }
        }
      }

      this.updateTelemetry();
      this.setMode(this.mode === 'pomodoro' ? 'shortBreak' : 'pomodoro');
    },

    updateDisplay() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      const digitsEl = document.getElementById('timer-digits');
      if (digitsEl) digitsEl.textContent = formatted;

      // Update circular SVG progress
      const totalTime = this.durations[this.mode];
      const progress = 1 - (this.timeLeft / totalTime);
      const offset = this.circumference * (1 - progress);

      const circle = document.getElementById('timer-circle-progress');
      if (circle) {
        circle.style.strokeDasharray = this.circumference;
        circle.style.strokeDashoffset = offset;
      }
    },

    updateTelemetry() {
      const sessionsEl = document.getElementById('focus-sessions-today');
      if (sessionsEl) sessionsEl.textContent = state.focusStats.sessionsToday;

      const minsEl = document.getElementById('focus-minutes-today');
      if (minsEl) minsEl.textContent = `${state.focusStats.minutesToday} mins`;

      const streakEl = document.getElementById('focus-sprint-streak');
      if (streakEl) streakEl.textContent = `${state.focusStats.streak} Sprints`;
    },

    updateLinkedTaskDisplay() {
      const textEl = document.getElementById('timer-active-task-title');
      if (!textEl) return;
      if (!this.linkedTaskId) {
        textEl.textContent = 'Select a task to link';
      } else {
        const task = state.tasks.find(t => t.id === this.linkedTaskId);
        textEl.textContent = task ? task.title : 'Select a task to link';
      }
    }
  };

  function updateFocusTaskSelector() {
    const select = document.getElementById('select-focus-task');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">-- No Task Linked --</option>';

    state.tasks.forEach(task => {
      const opt = document.createElement('option');
      opt.value = task.id;
      opt.textContent = `[${task.status}] ${task.title}`;
      if (task.id === current) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // =========================================================================
  // 10. ANALYTICS & VELOCITY CHARTS
  // =========================================================================
  function renderAnalytics() {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = state.tasks.filter(t => t.status === 'in-progress').length;
    const reviewTasks = state.tasks.filter(t => t.status === 'review').length;
    const backlogTasks = state.tasks.filter(t => t.status === 'backlog').length;

    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // KPI Cards
    const totalEl = document.getElementById('an-total-tasks');
    if (totalEl) totalEl.textContent = totalTasks;

    const rateEl = document.getElementById('an-completion-rate');
    if (rateEl) rateEl.textContent = `${completionRate}%`;

    const hours = Math.floor(state.focusStats.minutesToday / 60);
    const mins = state.focusStats.minutesToday % 60;
    const focusEl = document.getElementById('an-focus-time');
    if (focusEl) focusEl.textContent = `${hours}h ${mins}m`;

    const habitRateEl = document.getElementById('an-habit-rate');
    const habitWeeklyEl = document.getElementById('stat-habits-weekly-rate');
    if (habitRateEl && habitWeeklyEl) habitRateEl.textContent = habitWeeklyEl.textContent;

    // Distribution Bars
    const workflowBarsContainer = document.getElementById('chart-workflow-bars');
    if (workflowBarsContainer) {
      const getPercent = (count) => totalTasks ? Math.round((count / totalTasks) * 100) : 0;
      workflowBarsContainer.innerHTML = `
        <div class="distribution-item">
          <div class="dist-label-row">
            <span>Completed</span>
            <strong>${completedTasks} (${getPercent(completedTasks)}%)</strong>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${getPercent(completedTasks)}%; background: var(--status-done);"></div>
          </div>
        </div>
        <div class="distribution-item">
          <div class="dist-label-row">
            <span>In Review</span>
            <strong>${reviewTasks} (${getPercent(reviewTasks)}%)</strong>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${getPercent(reviewTasks)}%; background: var(--status-review);"></div>
          </div>
        </div>
        <div class="distribution-item">
          <div class="dist-label-row">
            <span>In Progress</span>
            <strong>${inProgressTasks} (${getPercent(inProgressTasks)}%)</strong>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${getPercent(inProgressTasks)}%; background: var(--status-progress);"></div>
          </div>
        </div>
        <div class="distribution-item">
          <div class="dist-label-row">
            <span>Backlog</span>
            <strong>${backlogTasks} (${getPercent(backlogTasks)}%)</strong>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${getPercent(backlogTasks)}%; background: var(--status-backlog);"></div>
          </div>
        </div>
      `;
    }

    // Priority breakdown
    const priContainer = document.getElementById('chart-priority-list');
    if (priContainer) {
      const priCounts = { urgent: 0, high: 0, medium: 0, low: 0 };
      state.tasks.forEach(t => {
        if (priCounts[t.priority] !== undefined) priCounts[t.priority]++;
      });
      priContainer.innerHTML = Object.entries(priCounts).map(([pri, cnt]) => `
        <div class="distribution-item">
          <div class="dist-label-row">
            <span class="priority-badge priority-${pri}">${pri.toUpperCase()}</span>
            <strong>${cnt} items</strong>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${totalTasks ? Math.round((cnt / totalTasks) * 100) : 0}%; background: var(--pri-${pri});"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // =========================================================================
  // 11. DATA BACKUP, EXPORT, IMPORT & RESET
  // =========================================================================
  function initDataSettings() {
    const btnExport = document.getElementById('btn-export-backup');
    const fileImport = document.getElementById('file-import-input');
    const btnDemo = document.getElementById('btn-load-demo-data');
    const btnClear = document.getElementById('btn-clear-all-data');

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `nexusflow-backup-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        AudioEngine.playChime();
        showToast('Exported JSON backup', 'success');
      });
    }

    if (fileImport) {
      fileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported.tasks && imported.habits) {
              state = Object.assign({}, DEFAULT_STATE, imported);
              saveState();
              renderKanbanBoard();
              renderHabitMatrix();
              renderAnalytics();
              AudioEngine.playChime();
              showToast('Backup restored successfully!', 'success');
            } else {
              showToast('Invalid backup file structure', 'error');
            }
          } catch (err) {
            showToast('Failed to parse backup JSON file', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
        renderKanbanBoard();
        renderHabitMatrix();
        renderAnalytics();
        AudioEngine.playChime();
        showToast('Loaded sample showcase data', 'success');
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks, habits, and focus metrics?')) {
          state.tasks = [];
          state.habits = [];
          state.focusStats = { sessionsToday: 0, minutesToday: 0, totalFocusSeconds: 0, streak: 0 };
          saveState();
          renderKanbanBoard();
          renderHabitMatrix();
          renderAnalytics();
          showToast('All local data cleared', 'info');
        }
      });
    }
  }

  // =========================================================================
  // 12. KEYBOARD SHORTCUTS & UTILITIES
  // =========================================================================
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in form inputs
      const tag = (e.target.tagName || '').toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (e.key === 'Escape') {
        closeTaskModal();
        const habitModal = document.getElementById('habit-modal');
        if (habitModal) habitModal.classList.remove('open');
        return;
      }

      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openTaskModal();
      } else if (e.key === '/') {
        e.preventDefault();
        const search = document.getElementById('global-search-input');
        if (search) search.focus();
      } else if (e.code === 'Space') {
        e.preventDefault();
        FocusTimer.toggle();
      } else if (e.key === '1') {
        switchView('board');
      } else if (e.key === '2') {
        switchView('habits');
      } else if (e.key === '3') {
        switchView('focus');
      } else if (e.key === '4') {
        switchView('analytics');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 13. BOOTSTRAP APPLICATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initClock();
    initKanbanDragDrop();
    initTaskModal();
    initHabitModal();
    FocusTimer.init();
    initDataSettings();
    initKeyboardShortcuts();

    // Initial view render
    renderKanbanBoard();
    renderHabitMatrix();
    renderAnalytics();
  });

})();
