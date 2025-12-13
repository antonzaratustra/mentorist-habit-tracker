// UI module for Habit Tracker

class UIManager {
  constructor() {
    this.currentView = 'week';
    this.currentWeekStart = new Date();
    this.filters = {
      status: 'active',
      tag: '',
      timeOfDay: '',
      type: ''
    };
    this.sortBy = 'strength';
    this.tagColors = {};
    
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  /**
   * Initialize DOM elements
   */
  initializeElements() {
    // Header elements
    this.currentDateEl = document.getElementById('current-date');
    
    // Navigation elements
    this.addViewBtn = document.getElementById('add-habit-btn');
    this.viewButtons = document.querySelectorAll('.view-btn');
    this.prevWeekBtn = document.getElementById('prev-week');
    this.nextWeekBtn = document.getElementById('next-week');
    this.weekRangeEl = document.getElementById('week-range');
    
    // Filter elements
    this.filterTags = document.getElementById('filter-tags');
    this.filterTime = document.getElementById('filter-time');
    this.filterType = document.getElementById('filter-type');
    this.statusFilters = document.querySelectorAll('.status-filter');
    
    // Main content
    this.habitTableContainer = document.getElementById('habit-table-container');
    this.ideasPanel = document.getElementById('ideas-panel');
    this.toggleIdeasBtn = document.getElementById('toggle-ideas');
    
    // Modals
    this.habitModal = document.getElementById('habit-modal');
    this.commentModal = document.getElementById('comment-modal');
    
    // Stats
    this.dailyStatsEl = document.getElementById('daily-stats');
    
    // Navigation (in header now)
    this.prevWeekBtn = document.getElementById('prev-week');
    this.nextWeekBtn = document.getElementById('next-week');
    this.weekRangeEl = document.getElementById('week-range');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // View switching
    this.viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });
    
    // Navigation
    if (this.addViewBtn) {
      this.addViewBtn.addEventListener('click', () => this.openHabitModal());
    }
    
    if (this.prevWeekBtn) {
      this.prevWeekBtn.addEventListener('click', () => this.navigateWeek(-1));
    }
    
    if (this.nextWeekBtn) {
      this.nextWeekBtn.addEventListener('click', () => this.navigateWeek(1));
    }
    
    // Filters
    if (this.filterTags) {
      this.filterTags.addEventListener('change', (e) => {
        this.filters.tag = e.target.value;
        this.render();
      });
    }
    
    if (this.filterTime) {
      this.filterTime.addEventListener('change', (e) => {
        this.filters.timeOfDay = e.target.value;
        this.render();
      });
    }
    
    if (this.filterType) {
      this.filterType.addEventListener('change', (e) => {
        this.filters.type = e.target.value;
        this.render();
      });
    }
    
    // Status filter buttons
    if (this.statusFilters) {
      this.statusFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
          // Remove active class from all buttons
          this.statusFilters.forEach(b => b.classList.remove('active'));
          // Add active class to clicked button
          e.target.classList.add('active');
          // Update filter
          this.filters.status = e.target.dataset.status;
          this.updateAddButton();
          this.render();
        });
      });
    }
    
    // Ideas panel
    if (this.toggleIdeasBtn) {
      this.toggleIdeasBtn.addEventListener('click', () => {
        this.ideasPanel.classList.toggle('collapsed');
      });
    }
    
    // Habit form
    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
      console.log('Binding habit form submit event');
      habitForm.addEventListener('submit', (e) => this.handleHabitFormSubmit(e));
    } else {
      console.log('Habit form not found');
    }
    
    const cancelHabitBtn = document.getElementById('cancel-habit');
    if (cancelHabitBtn) {
      cancelHabitBtn.addEventListener('click', () => {
        this.closeHabitModal();
      });
    }
    
    const closeHabitModalBtn = document.querySelector('#habit-modal .close-button');
    if (closeHabitModalBtn) {
      closeHabitModalBtn.addEventListener('click', () => {
        this.closeHabitModal();
      });
    }
    
    // Comment form
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => this.handleCommentFormSubmit(e));
    }
    
    const cancelCommentBtn = document.getElementById('cancel-comment');
    if (cancelCommentBtn) {
      cancelCommentBtn.addEventListener('click', () => {
        this.closeCommentModal();
      });
    }
    
    const closeCommentModalBtn = document.querySelector('#comment-modal .close-button');
    if (closeCommentModalBtn) {
      closeCommentModalBtn.addEventListener('click', () => {
        this.closeCommentModal();
      });
    }
    
    // Day details modal
    const closeDayDetailsModalBtn = document.querySelector('#day-details-modal .close-button');
    if (closeDayDetailsModalBtn) {
      closeDayDetailsModalBtn.addEventListener('click', () => {
        document.getElementById('day-details-modal').classList.add('hidden');
      });
    }
    
    // Habit type change
    const habitTypeSelect = document.getElementById('habit-type');
    if (habitTypeSelect) {
      habitTypeSelect.addEventListener('change', (e) => {
        this.toggleEmojiOptions(e.target.value);
      });
    }
    
    // Tag input handling
    this.setupTagInput();
    
    // Initialize add button state
    this.updateAddButton();
    
    // Bind confirm modal close buttons
    this.bindConfirmModalEvents();
  }

  /**
   * Update add button text based on filter status
   */
  updateAddButton() {
    if (this.addViewBtn) {
      if (this.filters.status === 'idea') {
        this.addViewBtn.textContent = '➕ Добавить идею';
      } else {
        this.addViewBtn.textContent = '➕ Добавить привычку';
      }
    }
  }

  /**
   * Bind confirm modal events
   */
  bindConfirmModalEvents() {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmClose = document.getElementById('confirm-close');
    const confirmCancel = document.getElementById('confirm-cancel');
    
    if (confirmModal && confirmClose && confirmCancel) {
      const closeModal = () => {
        confirmModal.classList.add('hidden');
      };
      
      confirmClose.addEventListener('click', closeModal);
      confirmCancel.addEventListener('click', closeModal);
    }
  }

  /**
   * Setup tag input functionality
   */
  setupTagInput() {
    const tagInput = document.getElementById('habit-tags-input');
    const tagsDisplay = document.getElementById('tags-display');
    const hiddenTagsInput = document.getElementById('habit-tags');
    
    if (!tagInput || !tagsDisplay) return;
    
    // Handle key events for adding tags
    tagInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ' || e.key === ',') && tagInput.value.trim()) {
        e.preventDefault();
        const tag = tagInput.value.trim().replace(/,/g, '');
        if (tag) {
          this.addTag(tag, tagsDisplay, hiddenTagsInput);
          tagInput.value = '';
        }
      }
      
      // Handle backspace to remove last tag
      if (e.key === 'Backspace' && !tagInput.value.trim() && tagsDisplay.children.length > 0) {
        const lastTag = tagsDisplay.lastElementChild;
        if (lastTag) {
          const tagText = lastTag.querySelector('.tag-text').textContent;
          tagsDisplay.removeChild(lastTag);
          this.updateHiddenTagsInput(tagsDisplay, hiddenTagsInput);
        }
      }
    });
    
    // Handle blur event
    tagInput.addEventListener('blur', () => {
      if (tagInput.value.trim()) {
        const tag = tagInput.value.trim();
        if (tag) {
          this.addTag(tag, tagsDisplay, hiddenTagsInput);
          tagInput.value = '';
        }
      }
    });
  }

  /**
   * Add a tag to the display
   * @param {string} tag - Tag text
   * @param {HTMLElement} tagsDisplay - Tags display container
   * @param {HTMLInputElement} hiddenTagsInput - Hidden input for form submission
   */
  addTag(tag, tagsDisplay, hiddenTagsInput) {
    // Check if tag already exists
    const existingTags = Array.from(tagsDisplay.children).map(el => el.querySelector('.tag-text').textContent);
    if (existingTags.includes(tag)) return;
    
    // Create tag element
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    
    // Get or assign color for tag
    const tagColor = this.getTagColor(tag);
    
    tagElement.innerHTML = `
      <span class="tag-text">${tag}</span>
      <span class="tag-color-picker" style="background-color: ${tagColor}" data-tag="${tag}"></span>
    `;
    
    // Add click event to change color
    const colorPicker = tagElement.querySelector('.tag-color-picker');
    colorPicker.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showColorPicker(e, tag, tagElement, hiddenTagsInput);
    });
    
    // Add click event to remove tag
    tagElement.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tag-color-picker')) {
        tagsDisplay.removeChild(tagElement);
        this.updateHiddenTagsInput(tagsDisplay, hiddenTagsInput);
      }
    });
    
    tagsDisplay.appendChild(tagElement);
    this.updateHiddenTagsInput(tagsDisplay, hiddenTagsInput);
  }

  /**
   * Get color for a tag
   * @param {string} tag - Tag text
   * @returns {string} Color hex code
   */
  getTagColor(tag) {
    // Predefined colors for tags
    const colors = [
      '#FF8C42', '#6A0572', '#AB83A1', '#5BC0EB', '#9BC53D',
      '#E55934', '#FA7921', '#3CBBB1', '#FE4A49', '#4B3F72'
    ];
    
    // If we already have a color for this tag, return it
    if (this.tagColors[tag]) {
      return this.tagColors[tag];
    }
    
    // Assign a color based on tag index
    const tagKeys = Object.keys(this.tagColors);
    const index = tagKeys.length % colors.length;
    this.tagColors[tag] = colors[index];
    return this.tagColors[tag];
  }

  /**
   * Show color picker popup
   * @param {Event} e - Click event
   * @param {string} tag - Tag text
   * @param {HTMLElement} tagElement - Tag element
   * @param {HTMLInputElement} hiddenTagsInput - Hidden input for form submission
   */
  showColorPicker(e, tag, tagElement, hiddenTagsInput) {
    // Remove existing color picker if any
    const existingPicker = document.querySelector('.color-picker-popup');
    if (existingPicker) {
      existingPicker.remove();
    }
    
    // Create color picker
    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker-popup';
    
    // Position near the color picker element
    const rect = e.target.getBoundingClientRect();
    colorPicker.style.position = 'absolute';
    colorPicker.style.left = `${rect.left}px`;
    colorPicker.style.top = `${rect.bottom + 5}px`;
    
    // Predefined colors
    const colors = [
      '#FF8C42', '#6A0572', '#AB83A1', '#5BC0EB', '#9BC53D',
      '#E55934', '#FA7921', '#3CBBB1', '#FE4A49', '#4B3F72',
      '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD'
    ];
    
    // Add color options
    colors.forEach(color => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.style.backgroundColor = color;
      colorOption.addEventListener('click', () => {
        this.tagColors[tag] = color;
        const colorPickerElement = tagElement.querySelector('.tag-color-picker');
        if (colorPickerElement) {
          colorPickerElement.style.backgroundColor = color;
        }
        colorPicker.remove();
      });
      colorPicker.appendChild(colorOption);
    });
    
    // Add to document
    document.body.appendChild(colorPicker);
    
    // Remove when clicking elsewhere
    const handleClickOutside = (event) => {
      if (!colorPicker.contains(event.target) && event.target !== e.target) {
        colorPicker.remove();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  }

  /**
   * Update hidden tags input value
   * @param {HTMLElement} tagsDisplay - Tags display container
   * @param {HTMLInputElement} hiddenTagsInput - Hidden input for form submission
   */
  updateHiddenTagsInput(tagsDisplay, hiddenTagsInput) {
    const tags = Array.from(tagsDisplay.children).map(el => el.querySelector('.tag-text').textContent);
    hiddenTagsInput.value = tags.join(', ');
  }

  /**
   * Switch between views
   * @param {string} view - View to switch to
   */
  switchView(view) {
    this.currentView = view;
    
    // Update active button
    this.viewButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    this.render();
  }

  /**
   * Navigate between weeks
   * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
   */
  navigateWeek(direction) {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (direction * 7));
    this.render();
  }

  /**
   * Open habit creation/edit modal
   * @param {Object} habit - Habit to edit (optional)
   */
  openHabitModal(habit = null) {
    const modalTitle = document.getElementById('modal-title');
    const habitForm = document.getElementById('habit-form');
    
    // Show/hide archive and move to ideas buttons
    const archiveBtn = document.getElementById('archive-habit');
    const moveToIdeasBtn = document.getElementById('move-to-ideas');
    
    if (habit) {
      // Edit existing habit
      modalTitle.textContent = 'Редактировать привычку';
      document.getElementById('habit-name').value = habit.name;
      document.getElementById('habit-type').value = habit.type;
      this.toggleEmojiOptions(habit.type);
      
      if (habit.type === 'emoji' && habit.emojiOptions) {
        document.getElementById('emoji-options').value = habit.emojiOptions.join(', ');
      }
      
      // Populate tags display
      this.populateTagsDisplay(habit.tags);
      
      // Populate time of day options
      this.populateTimeOfDayOptions(habit.type, habit.timeOfDay);
      
      // Store habit ID in form data for update
      habitForm.dataset.habitId = habit.id;
      
      // Show archive and move to ideas buttons
      if (archiveBtn) archiveBtn.style.display = 'inline-block';
      if (moveToIdeasBtn) moveToIdeasBtn.style.display = 'inline-block';
      
      // Bind events for archive and move to ideas buttons
      if (archiveBtn) {
        archiveBtn.onclick = async () => {
          const confirmed = await this.showConfirm('Вы уверены, что хотите отправить эту привычку в архив?');
          if (confirmed) {
            habitManager.archiveHabit(habit.id);
            this.closeHabitModal();
            this.render();
          }
        };
      }
      
      if (moveToIdeasBtn) {
        moveToIdeasBtn.onclick = async () => {
          const confirmed = await this.showConfirm('Вы уверены, что хотите отправить эту привычку в идеи?');
          if (confirmed) {
            habitManager.moveToIdeas(habit.id);
            this.closeHabitModal();
            this.render();
          }
        };
      }
    } else {
      // Create new habit
      // Check if we're in ideas view to set default status
      const defaultStatus = this.filters.status === 'idea' ? 'idea' : 'active';
      modalTitle.textContent = defaultStatus === 'idea' ? 'Создать идею' : 'Создать привычку';
      
      habitForm.reset();
      delete habitForm.dataset.habitId;
      this.toggleEmojiOptions('checkbox');
      this.populateTimeOfDayOptions('checkbox');
      
      // Hide archive and move to ideas buttons
      if (archiveBtn) archiveBtn.style.display = 'none';
      if (moveToIdeasBtn) moveToIdeasBtn.style.display = 'none';
      
      // Store the default status in a hidden field
      let statusInput = document.getElementById('habit-status');
      if (!statusInput) {
        statusInput = document.createElement('input');
        statusInput.type = 'hidden';
        statusInput.id = 'habit-status';
        statusInput.name = 'habit-status';
        habitForm.appendChild(statusInput);
      }
      statusInput.value = defaultStatus;
    }
    
    this.habitModal.classList.remove('hidden');
    
    // Focus on the habit name input field
    setTimeout(() => {
      const habitNameInput = document.getElementById('habit-name');
      if (habitNameInput) {
        habitNameInput.focus();
      }
    }, 100);
  }

  /**
   * Populate tags display
   * @param {Array} tags - Array of tag strings
   */
  populateTagsDisplay(tags) {
    const tagsDisplay = document.getElementById('tags-display');
    const hiddenTagsInput = document.getElementById('habit-tags');
    
    if (!tagsDisplay) return;
    
    // Clear existing tags
    tagsDisplay.innerHTML = '';
    
    // Add tags
    tags.forEach(tag => {
      this.addTag(tag, tagsDisplay, hiddenTagsInput);
    });
  }

  /**
   * Populate time of day options based on habit type
   * @param {string} type - Habit type
   * @param {Object} timeOfDay - Current time of day settings
   */
  populateTimeOfDayOptions(type, timeOfDay = null) {
    const container = document.getElementById('time-of-day-options');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing options
    
    // Remove any existing classes
    container.classList.remove('multipart');
    
    if (type === 'checkbox') {
      // Single time of day selection
      container.innerHTML = `
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="morning" ${(!timeOfDay || timeOfDay.single === 'morning') ? 'checked' : ''}>
            🌅 Утро
          </label>
        </div>
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="day" ${(timeOfDay && timeOfDay.single === 'day') ? 'checked' : ''}>
            ☀️ День
          </label>
        </div>
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="evening" ${(timeOfDay && timeOfDay.single === 'evening') ? 'checked' : ''}>
            🌙 Вечер
          </label>
        </div>
      `;
    } else if (type.startsWith('checkbox_')) {
      // Multiple parts time of day selection
      const partsCount = parseInt(type.split('_')[1]);
      let html = '<p>Выберите время для каждой части:</p>';
      
      for (let i = 0; i < partsCount; i++) {
        const partTime = timeOfDay && timeOfDay.parts && timeOfDay.parts[i] ? timeOfDay.parts[i].time : 'day';
        html += `
          <div class="time-option">
            <label>Часть ${i + 1}:</label>
            <select name="time-of-day-part-${i}">
              <option value="morning" ${partTime === 'morning' ? 'selected' : ''}>🌅 Утро</option>
              <option value="day" ${partTime === 'day' ? 'selected' : ''}>☀️ День</option>
              <option value="evening" ${partTime === 'evening' ? 'selected' : ''}>🌙 Вечер</option>
            </select>
          </div>
        `;
      }
      
      container.innerHTML = html;
      // Add multipart class for vertical layout
      container.classList.add('multipart');
    } else {
      // For text and emoji types, single time selection
      container.innerHTML = `
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="morning" ${(!timeOfDay || timeOfDay.single === 'morning') ? 'checked' : ''}>
            🌅 Утро
          </label>
        </div>
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="day" ${(timeOfDay && timeOfDay.single === 'day') ? 'checked' : ''}>
            ☀️ День
          </label>
        </div>
        <div class="time-option">
          <label>
            <input type="radio" name="time-of-day-single" value="evening" ${(timeOfDay && timeOfDay.single === 'evening') ? 'checked' : ''}>
            🌙 Вечер
          </label>
        </div>
      `;
    }
  }

  /**
   * Close habit modal
   */
  closeHabitModal() {
    this.habitModal.classList.add('hidden');
    // Reset form to clear any inputs
    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
      habitForm.reset();
      delete habitForm.dataset.habitId;
    }
    
    // Reset tag display
    const tagsDisplay = document.getElementById('tags-display');
    if (tagsDisplay) {
      tagsDisplay.innerHTML = '';
    }
    
    // Reset hidden tags input
    const hiddenTagsInput = document.getElementById('habit-tags');
    if (hiddenTagsInput) {
      hiddenTagsInput.value = '';
    }
  }

  /**
   * Handle habit form submission
   * @param {Event} e - Submit event
   */
  handleHabitFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    const formData = new FormData(e.target);
    console.log('Form data:', formData);
    
    // Get values directly from form elements to avoid null issues
    const nameInput = document.getElementById('habit-name');
    const typeSelect = document.getElementById('habit-type');
    const tagsInput = document.getElementById('habit-tags');
    const emojiInput = document.getElementById('emoji-options');
    const statusInput = document.getElementById('habit-status');
    
    const habitData = {
      name: nameInput ? nameInput.value.trim() : '',
      type: typeSelect ? typeSelect.value : 'checkbox',
      tags: tagsInput && tagsInput.value ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      status: statusInput ? statusInput.value : 'active' // Use default status
    };
    
    // Validate habit name
    if (!habitData.name) {
      alert('Пожалуйста, введите название привычки');
      return;
    }
    
    console.log('Habit data before processing:', habitData);
    
    if (habitData.type === 'emoji' && emojiInput && emojiInput.value) {
      habitData.emojiOptions = emojiInput.value
        .split(',')
        .map(emoji => emoji.trim())
        .filter(emoji => emoji);
    }
    
    // Handle time of day settings
    if (habitData.type === 'checkbox' || habitData.type === 'text' || habitData.type === 'emoji') {
      const timeOfDayRadios = document.querySelectorAll('input[name="time-of-day-single"]:checked');
      const timeOfDaySingle = timeOfDayRadios.length > 0 ? timeOfDayRadios[0].value : 'day';
      habitData.timeOfDay = { single: timeOfDaySingle };
    } else if (habitData.type.startsWith('checkbox_')) {
      const partsCount = parseInt(habitData.type.split('_')[1]);
      const parts = [];
      
      for (let i = 0; i < partsCount; i++) {
        const timeSelect = document.querySelector(`select[name="time-of-day-part-${i}"]`);
        const time = timeSelect ? timeSelect.value : 'day';
        parts.push({ partIndex: i, time: time });
      }
      
      habitData.timeOfDay = { parts: parts };
    }
    
    console.log('Final habit data:', habitData);
    
    const habitId = e.target.dataset.habitId;
    
    if (habitId) {
      // Update existing habit (remove status from updates as it's managed separately)
      const { status, ...updateData } = habitData;
      console.log('Updating habit:', habitId, updateData);
      const result = habitManager.updateHabit(habitId, updateData);
      console.log('Update result:', result);
    } else {
      // Create new habit
      console.log('Creating new habit:', habitData);
      const result = habitManager.createHabit(habitData);
      console.log('Create result:', result);
    }
    
    this.closeHabitModal();
    this.render(); // Ensure UI is refreshed
  }

  /**
   * Toggle emoji options visibility
   * @param {string} type - Habit type
   */
  toggleEmojiOptions(type) {
    const emojiGroup = document.getElementById('emoji-options-group');
    if (emojiGroup) {
      emojiGroup.style.display = type === 'emoji' ? 'block' : 'none';
    }
    
    // Also update time of day options when type changes
    this.populateTimeOfDayOptions(type);
  }

  /**
   * Open comment modal
   * @param {string} habitId - Habit ID
   * @param {string} date - Date in YYYY-MM-DD format
   */
  openCommentModal(habitId, date) {
    const entry = entryManager.getEntry(habitId, date);
    const commentText = document.getElementById('comment-text');
    
    if (commentText) {
      commentText.value = entry ? entry.comment : '';
    }
    
    // Store habit ID and date in form data
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.dataset.habitId = habitId;
      commentForm.dataset.date = date;
    }
    
    this.commentModal.classList.remove('hidden');
  }

  /**
   * Close comment modal
   */
  closeCommentModal() {
    this.commentModal.classList.add('hidden');
    // Clear the comment text area
    const commentText = document.getElementById('comment-text');
    if (commentText) {
      commentText.value = '';
    }
  }

  /**
   * Show custom confirm dialog
   * @param {string} message - Confirmation message
   * @returns {Promise<boolean>} - Promise that resolves to true if confirmed, false otherwise
   */
  showConfirm(message) {
    return new Promise((resolve) => {
      const confirmModal = document.getElementById('confirm-modal');
      const confirmMessage = document.getElementById('confirm-message');
      const confirmOk = document.getElementById('confirm-ok');
      const confirmCancel = document.getElementById('confirm-cancel');
      const confirmClose = document.getElementById('confirm-close');
      
      if (!confirmModal || !confirmMessage || !confirmOk || !confirmCancel || !confirmClose) {
        // Fallback to native confirm if modal elements are not found
        resolve(confirm(message));
        return;
      }
      
      // Set message
      confirmMessage.textContent = message;
      
      // Show modal
      confirmModal.classList.remove('hidden');
      
      // Handle OK button
      const handleOk = () => {
        confirmModal.classList.add('hidden');
        resolve(true);
        cleanup();
      };
      
      // Handle Cancel button and close button
      const handleCancel = () => {
        confirmModal.classList.add('hidden');
        resolve(false);
        cleanup();
      };
      
      // Cleanup event listeners
      const cleanup = () => {
        confirmOk.removeEventListener('click', handleOk);
        confirmCancel.removeEventListener('click', handleCancel);
        confirmClose.removeEventListener('click', handleCancel);
      };
      
      // Add event listeners
      confirmOk.addEventListener('click', handleOk);
      confirmCancel.addEventListener('click', handleCancel);
      confirmClose.addEventListener('click', handleCancel);
    });
  }

  /**
   * Handle comment form submission
   * @param {Event} e - Submit event
   */
  handleCommentFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const habitId = form.dataset.habitId;
    const date = form.dataset.date;
    
    // Get comment value directly from the textarea element
    const commentTextarea = document.getElementById('comment-text');
    const comment = commentTextarea ? commentTextarea.value : '';
    
    console.log('Saving comment:', { habitId, date, comment });
    
    // Save comment
    entryManager.setComment(habitId, date, comment);
    
    this.closeCommentModal();
    this.render(); // Ensure UI is refreshed
  }

  /**
   * Render the current view
   */
  render() {
    this.updateHeader();
    this.updateFilters();
    
    switch (this.currentView) {
      case 'week':
        this.renderWeekView();
        break;
      case 'day':
        this.renderDayView();
        break;
      case 'month':
        this.renderMonthView();
        break;
    }
    
    this.renderIdeasPanel();
    this.updateStats();
  }

  /**
   * Update header information
   */
  updateHeader() {
    const now = new Date();
    this.currentDateEl.textContent = now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Update week range
    const weekDates = getWeekDates(this.currentWeekStart);
    const firstDate = new Date(weekDates[0]);
    const lastDate = new Date(weekDates[6]);
    
    this.weekRangeEl.textContent = `Неделя: ${firstDate.getDate()}-${lastDate.getDate()} ${lastDate.toLocaleDateString('ru-RU', { month: 'long' })}`;
  }

  /**
   * Update filter options
   */
  updateFilters() {
    // Update tags dropdown
    const allHabits = habitManager.getAllHabits();
    const tags = filterManager.getAllTags(allHabits);
    
    // Clear and repopulate tags dropdown
    this.filterTags.innerHTML = '<option value="">Все теги</option>';
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      this.filterTags.appendChild(option);
    });
    
    // Set selected values
    this.filterTags.value = this.filters.tag;
    this.filterTime.value = this.filters.timeOfDay;
    this.filterType.value = this.filters.type;
    
    // Update status filter buttons
    if (this.statusFilters) {
      this.statusFilters.forEach(btn => {
        if (btn.dataset.status === this.filters.status) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  /**
   * Render week view
   */
  renderWeekView() {
    const weekDates = getWeekDates(this.currentWeekStart);
    const habits = this.getFilteredAndSortedHabits();
    
    // Check which days are fully completed
    const completedDays = {};
    weekDates.forEach(date => {
      const dailyStats = statsManager.getDailyStats(date);
      // When all habits are completed -> no special class (lighter color)
      // When not all habits are completed -> apply completed-day-header class (darker color)
      completedDays[date] = dailyStats.percentage !== 100;
    });
    
    let html = `
      <table class="habit-table">
        <thead>
          <tr>
            <th>Привычка</th>
    `;
    
    // Add day headers
    weekDates.forEach(date => {
      const dayDate = new Date(date);
      const isCompleted = completedDays[date];
      const dayClass = isCompleted ? 'completed-day-header' : '';
      html += `<th class="${dayClass}">${dayDate.toLocaleDateString('ru-RU', { weekday: 'short' })}<br>${dayDate.getDate()}</th>`;
    });
    
    html += `
          </tr>
        </thead>
        <tbody>
    `;
    
    // Add habit rows
    habits.forEach((habit, index) => {
      // Check if habit is fully completed for the week
      let completedParts = 0;
      let totalParts = weekDates.length;
      
      weekDates.forEach(date => {
        const entry = entryManager.getEntry(habit.id, date);
        if (entry) {
          if (habit.type === 'checkbox' && entry.checkboxState.completed) {
            completedParts++;
          } else if (habit.type.startsWith('checkbox_')) {
            const partsCount = parseInt(habit.type.split('_')[1]);
            const filledParts = entry.checkboxState.parts ? 
              entry.checkboxState.parts.filter(Boolean).length : 0;
            if (filledParts === partsCount) {
              completedParts++;
            }
          } else if (habit.type === 'text' && entry.textValue.trim() !== '') {
            completedParts++;
          } else if (habit.type === 'emoji' && entry.emojiValue.trim() !== '') {
            completedParts++;
          }
        }
      });
      
      const isWeekCompleted = completedParts === totalParts;
      const rowClass = isWeekCompleted ? 'completed-week' : '';
      
      html += `<tr class="${rowClass} ${index % 2 === 0 ? 'even' : 'odd'}" data-habit-id="${habit.id}">`;
      html += `<td class="habit-name-cell">`;
      html += `<span class="habit-name">${habit.name}</span>`;
      html += `<span class="habit-time-info">${this.getHabitTimeInfo(habit)}</span>`;
      
      // Show different actions based on habit status
      if (habit.status === 'trash') {
        html += `<div class="habit-actions">`;
        html += `<button class="restore-habit-btn" data-habit-id="${habit.id}">Восстановить</button>`;
        html += `<button class="permanently-delete-habit-btn" data-habit-id="${habit.id}">Удалить</button>`;
        html += `</div>`;
      } else {
        html += `<div class="habit-actions">`;
        html += `<button class="edit-habit-btn" data-habit-id="${habit.id}">✏️</button>`;
        html += `<button class="delete-habit-btn" data-habit-id="${habit.id}">🗑️</button>`;
        html += `</div>`;
      }
      
      html += `</td>`;
      
      // Add cells for each day
      weekDates.forEach(date => {
        html += this.renderHabitCell(habit, date);
      });
      
      html += '</tr>';
    });
    
    html += `
        </tbody>
      </table>
    `;
    
    this.habitTableContainer.innerHTML = html;
    this.bindHabitCellEvents();
    this.bindHabitActionEvents();
  }

  /**
   * Get time info for habit
   * @param {Object} habit - Habit object
   * @returns {string} Time info string
   */
  getHabitTimeInfo(habit) {
    if (habit.timeOfDay.single) {
      const timeLabels = {
        'morning': '🌅 Утро',
        'day': '☀️ День',
        'evening': '🌙 Вечер'
      };
      return `<span class="time-tag">${timeLabels[habit.timeOfDay.single] || habit.timeOfDay.single}</span>`;
    } else if (habit.timeOfDay.parts) {
      const timeLabels = {
        'morning': '🌅 Утро',
        'day': '☀️ День',
        'evening': '🌙 Вечер'
      };
      
      const times = habit.timeOfDay.parts.map(part => timeLabels[part.time] || part.time);
      // Remove duplicates
      const uniqueTimes = [...new Set(times)];
      return `<span class="time-tag">${uniqueTimes.join(' ')}</span>`;
    }
    return '';
  }

  /**
   * Render a single habit cell
   * @param {Object} habit - Habit object
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {string} HTML for the cell
   */
  renderHabitCell(habit, date) {
    const entry = entryManager.getEntry(habit.id, date);
    let cellContent = '';
    let cellClass = 'habit-cell';
    
    switch (habit.type) {
      case 'checkbox':
        cellClass += ' checkbox-cell';
        if (entry) {
          if (entry.checkboxState.completed) {
            cellContent = '☑';
            cellClass += ' completed';
          } else if (entry.checkboxState.failed) {
            cellContent = '☒';
            cellClass += ' failed';
          } else {
            cellContent = '☐';
          }
        } else {
          cellContent = '☐';
        }
        break;
        
      case 'text':
        cellClass += ' text-cell';
        cellContent = `<input type="text" 
          value="${entry ? entry.textValue : ''}" 
          data-habit-id="${habit.id}" 
          data-date="${date}"
          placeholder="Значение">`;
        break;
        
      case 'emoji':
        cellClass += ' emoji-cell';
        if (entry && entry.emojiValue) {
          cellContent = entry.emojiValue;
        } else {
          cellContent = '🙂';
        }
        break;
        
      case 'checkbox_2':
      case 'checkbox_3':
      case 'checkbox_4':
        cellClass += ' checkbox-cell';
        if (entry) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const filledParts = entry.checkboxState.parts ? 
            entry.checkboxState.parts.filter(Boolean).length : 0;
          cellContent = `${filledParts}/${partsCount}`;
        } else {
          cellContent = `0/${habit.type.split('_')[1]}`;
        }
        break;
    }
    
    // Add comment icon if there's a comment
    if (entry && entry.comment && entry.comment.trim() !== '') {
      cellContent += `<span class="comment-icon has-comment" title="${entry.comment}">ℹ️</span>`;
    } else {
      cellContent += '<span class="comment-icon">ℹ️</span>';
    }
    
    return `<td class="${cellClass}" data-habit-id="${habit.id}" data-date="${date}">${cellContent}</td>`;
  }

  /**
   * Bind events to habit cells
   */
  bindHabitCellEvents() {
    // Bind checkbox clicks
    document.querySelectorAll('.checkbox-cell').forEach(cell => {
      // Check if event listener is already attached
      if (cell.dataset.listenerAttached === 'true') {
        return;
      }
      
      // Mark that event listener is attached
      cell.dataset.listenerAttached = 'true';
      
      cell.addEventListener('click', (e) => {
        const habitId = cell.dataset.habitId;
        const date = cell.dataset.date;
        
        // Get the habit to determine its type
        const habit = habitManager.getHabitById(habitId);
        if (!habit) return;
        
        if (habit.type === 'checkbox') {
          // Simple checkbox toggle
          entryManager.toggleCheckboxState(habitId, date);
        } else if (habit.type.startsWith('checkbox_')) {
          // Multi-part checkbox - we need to determine which part to toggle
          const entry = entryManager.getEntry(habitId, date);
          const partsCount = parseInt(habit.type.split('_')[1]);
          
          // Initialize parts array if needed
          let parts = entry && entry.checkboxState.parts && entry.checkboxState.parts.length === partsCount ? 
            [...entry.checkboxState.parts] : Array(partsCount).fill(false);
          
          // Find the first unchecked part and check it
          let partChecked = false;
          for (let i = 0; i < parts.length; i++) {
            if (!parts[i]) {
              parts[i] = true;
              partChecked = true;
              break;
            }
          }
          
          // If all parts were checked, uncheck all (reset to 0/X)
          if (!partChecked && parts.every(p => p)) {
            parts = Array(partsCount).fill(false);
          }
          
          // Create or update the entry
          if (entry) {
            // Update existing entry
            entryManager.updateEntry(habitId, date, {
              checkboxState: {
                completed: parts.every(p => p), // Completed if all parts are checked
                failed: false,
                parts: parts
              }
            });
          } else {
            // Create new entry
            entryManager.createEntry(habitId, date, {
              checkboxState: {
                completed: parts.every(p => p), // Completed if all parts are checked
                failed: false,
                parts: parts
              }
            });
          }
        }
        
        this.render();
      });
    });
    
    // Bind emoji cell clicks
    document.querySelectorAll('.emoji-cell').forEach(cell => {
      // Check if event listener is already attached
      if (cell.dataset.listenerAttached === 'true') {
        return;
      }
      
      // Mark that event listener is attached
      cell.dataset.listenerAttached = 'true';
      
      cell.addEventListener('click', (e) => {
        const habitId = cell.dataset.habitId;
        const date = cell.dataset.date;
        
        // Get the habit to determine available emojis
        const habit = habitManager.getHabitById(habitId);
        if (!habit || !habit.emojiOptions || habit.emojiOptions.length === 0) return;
        
        // Get current entry
        const entry = entryManager.getEntry(habitId, date);
        const currentEmoji = entry && entry.emojiValue ? entry.emojiValue : '';
        
        // Find next emoji in the list
        const currentIndex = habit.emojiOptions.indexOf(currentEmoji);
        const nextIndex = (currentIndex + 1) % habit.emojiOptions.length;
        const nextEmoji = habit.emojiOptions[nextIndex];
        
        // Save new emoji
        entryManager.setEmojiValue(habitId, date, nextEmoji);
        this.render();
      });
    });
    
    // Bind comment icon clicks
    document.querySelectorAll('.comment-icon').forEach(icon => {
      // Check if event listener is already attached
      if (icon.dataset.listenerAttached === 'true') {
        return;
      }
      
      // Mark that event listener is attached
      icon.dataset.listenerAttached = 'true';
      
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        const cell = icon.closest('td');
        const habitId = cell.dataset.habitId;
        const date = cell.dataset.date;
        this.openCommentModal(habitId, date);
      });
    });
    
    // Bind text input changes with debounce
    document.querySelectorAll('.text-cell input').forEach(input => {
      // Check if event listener is already attached
      if (input.dataset.listenerAttached === 'true') {
        return;
      }
      
      // Mark that event listener is attached
      input.dataset.listenerAttached = 'true';
      
      let timeoutId;
      input.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const habitId = input.dataset.habitId;
          const date = input.dataset.date;
          const value = input.value;
          entryManager.setTextValue(habitId, date, value);
        }, 500); // 500ms debounce
      });
    });
  }

  /**
   * Bind events for habit action buttons
   */
  bindHabitActionEvents() {
    // Bind edit buttons
    document.querySelectorAll('.edit-habit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.habitId;
        const habit = habitManager.getHabitById(habitId);
        if (habit) {
          this.openHabitModal(habit);
        }
      });
    });
    
    // Bind delete buttons
    document.querySelectorAll('.delete-habit-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.habitId;
        const confirmed = await this.showConfirm('Вы уверены, что хотите удалить эту привычку?');
        if (confirmed) {
          habitManager.deleteHabit(habitId);
          this.render();
        }
      });
    });
    
    // Bind restore buttons (for trashed habits)
    document.querySelectorAll('.restore-habit-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.habitId;
        const confirmed = await this.showConfirm('Вы уверены, что хотите восстановить эту привычку?');
        if (confirmed) {
          habitManager.restoreHabit(habitId, 'active');
          this.render();
        }
      });
    });
    
    // Bind permanent delete buttons (for trashed habits)
    document.querySelectorAll('.permanently-delete-habit-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.habitId;
        const confirmed = await this.showConfirm('Вы уверены, что хотите окончательно удалить эту привычку?');
        if (confirmed) {
          habitManager.permanentlyDeleteHabit(habitId);
          this.render();
        }
      });
    });
  }

  /**
   * Render day view
   */
  renderDayView() {
    const today = getCurrentDate();
    const habits = this.getFilteredAndSortedHabits();
    
    // Get current hour to determine active time period
    const currentHour = new Date().getHours();
    let activeTimePeriod = 'day';
    if (currentHour < 12) {
      activeTimePeriod = 'morning';
    } else if (currentHour >= 18) {
      activeTimePeriod = 'evening';
    }
    
    let html = '<div class="day-view">';
    
    // Group habits by time of day
    const timeGroups = {
      morning: { habits: [], label: '🌅 УТРО' },
      day: { habits: [], label: '☀️ ДЕНЬ' },
      evening: { habits: [], label: '🌙 ВЕЧЕР' }
    };
    
    habits.forEach(habit => {
      if (habit.timeOfDay.single) {
        timeGroups[habit.timeOfDay.single].habits.push(habit);
      } else if (habit.timeOfDay.parts) {
        // For multi-part habits, add to each time group
        habit.timeOfDay.parts.forEach(part => {
          if (timeGroups[part.time]) {
            timeGroups[part.time].habits.push({...habit, partIndex: part.partIndex});
          }
        });
      }
    });
    
    // Render each time group
    ['morning', 'day', 'evening'].forEach(time => {
      if (timeGroups[time].habits.length > 0) {
        const isActive = time === activeTimePeriod;
        html += `<div class="time-group ${isActive ? 'active' : ''}">`;
        html += `<h3>${timeGroups[time].label}</h3>`;
        
        // Create a table for better presentation WITHOUT headers as requested
        html += '<table class="day-habits-table">';
        html += '<tbody>';
        
        timeGroups[time].habits.forEach((habit, index) => {
          html += `<tr class="${index % 2 === 0 ? 'even' : 'odd'}">`;
          html += `<td>${habit.name}</td>`;
          html += `<td>${this.renderHabitCell(habit, today)}</td>`;
          html += '</tr>';
        });
        
        html += '</tbody></table>';
        html += '</div>';
      }
    });
    
    // Add comments report at the bottom
    const todayEntries = entryManager.getEntriesByDate(today);
    const commentsReport = todayEntries.filter(entry => entry.comment && entry.comment.trim() !== '');
    
    if (commentsReport.length > 0) {
      html += '<div class="comments-report">';
      html += '<h3>Комментарии за день</h3>';
      html += '<ul class="comments-list">';
      
      commentsReport.forEach(entry => {
        const habit = habitManager.getHabitById(entry.habitId);
        if (habit) {
          html += `<li><strong>${habit.name}:</strong> ${entry.comment}</li>`;
        }
      });
      
      html += '</ul>';
      html += '</div>';
    }
    
    html += '</div>';
    
    this.habitTableContainer.innerHTML = html;
    this.bindHabitCellEvents();
  }

  /**
   * Get label for time of day
   * @param {string} time - Time of day
   * @returns {string} Label
   */
  getTimeLabel(time) {
    switch (time) {
      case 'morning': return '🌅 УТРО';
      case 'day': return '☀️ ДЕНЬ';
      case 'evening': return '🌙 ВЕЧЕР';
      default: return time;
    }
  }

  /**
   * Render month view
   */
  renderMonthView() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get all dates in month
    const dates = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    // Group dates by week
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before first day of month
    const firstDayOfWeek = firstDay.getDay();
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust for Monday as first day
    
    for (let i = 0; i < offset; i++) {
      currentWeek.push(null);
    }
    
    dates.forEach(date => {
      currentWeek.push(date);
      
      // If we've reached the end of the week or the end of the month
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Add remaining days to complete the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    let html = `<div class="month-view">`;
    html += `<h2>${now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</h2>`;
    
    // Create calendar table
    html += `<table class="month-calendar">`;
    html += `<thead><tr>`;
    ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
      html += `<th>${day}</th>`;
    });
    html += `</tr></thead>`;
    html += `<tbody>`;
    
    weeks.forEach((week, weekIndex) => {
      html += `<tr>`;
      week.forEach(date => {
        if (date === null) {
          html += `<td class="empty-day"></td>`;
        } else {
          const dateStr = formatDate(date);
          // Apply filters to habits when calculating stats
          const habits = this.getFilteredAndSortedHabits();
          const dailyStats = statsManager.getDailyStats(dateStr, habits);
          const completionPercentage = dailyStats.percentage;
          
          // Determine cell class based on completion
          let cellClass = 'calendar-day';
          if (completionPercentage === 100) {
            cellClass += ' completed';
          } else if (completionPercentage >= 50) {
            cellClass += ' partial';
          } else if (completionPercentage > 0) {
            cellClass += ' started';
          } else {
            cellClass += ' empty';
          }
          
          // Check if it's today
          const isToday = formatDate(new Date()) === dateStr;
          if (isToday) {
            cellClass += ' today';
          }
          
          html += `<td class="${cellClass}" data-date="${dateStr}">`;
          html += `<div class="day-number">${date.getDate()}</div>`;
          html += `<div class="completion-info">${completionPercentage}%</div>`;
          html += `<div class="completion-bar" style="width: ${completionPercentage}%"></div>`;
          html += `</td>`;
        }
      });
      html += `</tr>`;
      
      // Add week summary row
      html += `<tr class="week-summary-row">`;
      week.forEach(date => {
        if (date === null) {
          html += `<td class="week-summary-cell empty"></td>`;
        } else {
          const dateStr = formatDate(date);
          // Apply filters to habits when calculating stats
          const habits = this.getFilteredAndSortedHabits();
          const dailyStats = statsManager.getDailyStats(dateStr, habits);
          
          html += `<td class="week-summary-cell">`;
          html += `<div class="habit-completion-count">${dailyStats.completed}/${dailyStats.totalHabits}</div>`;
          html += `</td>`;
        }
      });
      html += `</tr>`;
    });
    
    html += `</tbody></table>`;
    html += `</div>`;
    
    this.habitTableContainer.innerHTML = html;
    
    // Add click handlers for calendar days
    document.querySelectorAll('.calendar-day').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const date = cell.dataset.date;
        this.showDayDetails(date);
      });
    });
  }

  /**
   * Show day details in a modal
   * @param {string} date - Date in YYYY-MM-DD format
   */
  showDayDetails(date) {
    const habits = this.getFilteredAndSortedHabits();
    const dailyStats = statsManager.getDailyStats(date);
    
    let html = `<div class="day-details">`;
    html += `<h3>День: ${new Date(date).toLocaleDateString('ru-RU')}</h3>`;
    html += `<p>Выполнено: ${dailyStats.completed}/${dailyStats.totalHabits} (${dailyStats.percentage}%)</p>`;
    
    html += `<table class="day-details-table">`;
    html += `<thead><tr><th>Привычка</th><th>Статус</th></tr></thead>`;
    html += `<tbody>`;
    
    habits.forEach(habit => {
      const entry = entryManager.getEntry(habit.id, date);
      let status = 'Не выполнено';
      
      if (entry) {
        if (habit.type === 'checkbox') {
          if (entry.checkboxState.completed) {
            status = 'Выполнено';
          } else if (entry.checkboxState.failed) {
            status = 'Не выполнено';
          } else {
            status = 'В процессе';
          }
        } else if (habit.type.startsWith('checkbox_')) {
          const partsCount = parseInt(habit.type.split('_')[1]);
          const filledParts = entry.checkboxState.parts ? 
            entry.checkboxState.parts.filter(Boolean).length : 0;
          status = `${filledParts}/${partsCount}`;
        } else if (habit.type === 'text') {
          status = entry.textValue || 'Не заполнено';
        } else if (habit.type === 'emoji') {
          status = entry.emojiValue || 'Не выбрано';
        }
      }
      
      html += `<tr>`;
      html += `<td>${habit.name}</td>`;
      html += `<td>${status}</td>`;
      html += `</tr>`;
    });
    
    html += `</tbody></table>`;
    html += `</div>`;
    
    // Show in proper modal instead of alert
    const modal = document.getElementById('day-details-modal');
    const modalContent = document.getElementById('day-details-content');
    if (modal && modalContent) {
      modalContent.innerHTML = html;
      modal.classList.remove('hidden');
      
      // Add close button event
      const closeBtn = modal.querySelector('.close-button');
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.add('hidden');
        };
      }
    }
  }

  /**
   * Render ideas panel
   */
  renderIdeasPanel() {
    // Get habits based on current filter status
    let habits;
    if (this.filters.status === 'trash') {
      habits = habitManager.getHabitsByStatus('trash');
    } else if (this.filters.status === 'archived') {
      habits = habitManager.getHabitsByStatus('archived');
    } else if (this.filters.status === 'idea') {
      habits = habitManager.getHabitsByStatus('idea');
    } else {
      // For active status, show the ideas panel
      habits = habitManager.getHabitsByStatus('idea');
    }
    
    // If we're not showing active habits or we're in trash/archived/idea view, hide the ideas panel
    if (this.filters.status !== 'active' || habits.length === 0) {
      this.ideasPanel.style.display = 'none';
      return;
    }
    
    this.ideasPanel.style.display = 'block';
    
    // Check if panel should be collapsed
    const isCollapsed = this.ideasPanel.classList.contains('collapsed');
    
    let html = '<ul class="ideas-list">';
    if (!isCollapsed) {
      habits.forEach(idea => {
        html += `<li>
          ${idea.name} 
          <button class="activate-idea" data-habit-id="${idea.id}">Активировать</button>
        </li>`;
      });
    }
    html += '</ul>';
    
    const ideasContent = this.ideasPanel.querySelector('.ideas-content');
    if (ideasContent) {
      ideasContent.innerHTML = html;
    }
    
    // Bind activate buttons
    document.querySelectorAll('.activate-idea').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const habitId = e.target.dataset.habitId;
        habitManager.restoreHabit(habitId, 'active');
        this.render();
      });
    });
  }

  /**
   * Update statistics display
   */
  updateStats() {
    const today = getCurrentDate();
    const dailyStats = statsManager.getDailyStats(today);
    
    if (this.dailyStatsEl) {
      this.dailyStatsEl.textContent = `Выполнено сегодня: ${dailyStats.completed}/${dailyStats.totalHabits} (${dailyStats.percentage}%)`;
    }
    
    // Убираем дублирующую информацию об активных привычках
  }

  /**
   * Get filtered and sorted habits
   * @returns {Array} Filtered and sorted habits
   */
  getFilteredAndSortedHabits() {
    const allHabits = habitManager.getAllHabits();
    const filteredHabits = filterManager.applyFilters(allHabits, this.filters);
    return filterManager.applySorting(filteredHabits, this.sortBy);
  }
}

// Make it available globally
window.UIManager = UIManager;