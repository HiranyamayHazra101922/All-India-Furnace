import { MASTER_ITEMS } from '../data/masterData';
import { appStore } from '../state/store';
import { Category, ComponentItem } from '../types';

export class DragDropPool {
  private poolContainer = document.getElementById('master-chip-pool') as HTMLElement;
  private searchInput = document.getElementById('search-repo') as HTMLInputElement;
  private customInput = document.getElementById('custom-item-name') as HTMLInputElement;
  private customTarget = document.getElementById('custom-item-target') as HTMLSelectElement;
  private addCustomBtn = document.getElementById('btn-add-custom') as HTMLButtonElement;

  private allItems: ComponentItem[] = [...MASTER_ITEMS];
  private searchQuery: string = '';

  private zones: Record<Category, HTMLElement> = {
    material: document.getElementById('dropzone-material') as HTMLElement,
    body: document.getElementById('dropzone-body') as HTMLElement,
    panel: document.getElementById('dropzone-panel') as HTMLElement,
  };

  constructor() {
    this.renderMasterPool();
    this.bindSearch();
    this.bindCustomAdd();
    this.bindDropzones();
    this.bindClearButtons();
    appStore.subscribe(() => this.renderActiveItems());
  }

  private bindSearch() {
    this.searchInput.addEventListener('input', () => {
      this.searchQuery = this.searchInput.value.toLowerCase().trim();
      this.renderMasterPool();
    });
  }

  private bindCustomAdd() {
    const handleAdd = () => {
      const name = this.customInput.value.trim();
      if (!name) return;
      const targetCategory = this.customTarget.value as Category;

      // Add to master repository pool dynamically
      const newItem: ComponentItem = {
        id: `custom-${Date.now()}`,
        name,
        defaultCategory: targetCategory,
      };
      this.allItems.unshift(newItem);
      this.renderMasterPool();

      // Add to selected state immediately
      this.addItem(targetCategory, name);
      this.customInput.value = '';
    };

    this.addCustomBtn.addEventListener('click', handleAdd);
    this.customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAdd();
    });
  }

  private renderMasterPool() {
    this.poolContainer.innerHTML = '';
    const filtered = this.allItems.filter((item) =>
      item.name.toLowerCase().includes(this.searchQuery)
    );

    if (filtered.length === 0) {
      this.poolContainer.innerHTML = `<span class="text-[10px] text-slate-400 italic">No matching components. Use manual input below.</span>`;
      return;
    }

    filtered.forEach((item) => {
      const chip = document.createElement('div');
      chip.className =
        'draggable-chip text-[11px] bg-slate-100 hover:bg-blue-100 border border-slate-300 px-2 py-0.5 rounded shadow-sm flex items-center cursor-pointer transition';
      chip.draggable = true;
      chip.innerText = item.name;

      chip.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('application/json', JSON.stringify(item));
      });

      chip.addEventListener('click', () => {
        this.addItem(item.defaultCategory, item.name);
      });

      this.poolContainer.appendChild(chip);
    });
  }

  private bindDropzones() {
    (Object.keys(this.zones) as Category[]).forEach((cat) => {
      const zone = this.zones[cat];

      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const raw = e.dataTransfer?.getData('application/json');
        if (raw) {
          const item: ComponentItem = JSON.parse(raw);
          this.addItem(cat, item.name);
        }
      });
    });
  }

  private bindClearButtons() {
    document.getElementById('clear-material')?.addEventListener('click', () => appStore.setState({ materials: [] }));
    document.getElementById('clear-body')?.addEventListener('click', () => appStore.setState({ body: [] }));
    document.getElementById('clear-panel')?.addEventListener('click', () => appStore.setState({ panel: [] }));
  }

  private addItem(category: Category, itemName: string) {
    const current = appStore.getState();
    if (category === 'material') appStore.setState({ materials: [...current.materials, itemName] });
    if (category === 'body') appStore.setState({ body: [...current.body, itemName] });
    if (category === 'panel') appStore.setState({ panel: [...current.panel, itemName] });
  }

  private removeItem(category: Category, index: number) {
    const current = appStore.getState();
    if (category === 'material') {
      const list = [...current.materials];
      list.splice(index, 1);
      appStore.setState({ materials: list });
    } else if (category === 'body') {
      const list = [...current.body];
      list.splice(index, 1);
      appStore.setState({ body: list });
    } else if (category === 'panel') {
      const list = [...current.panel];
      list.splice(index, 1);
      appStore.setState({ panel: list });
    }
  }

  private renderActiveItems() {
    const state = appStore.getState();
    const renderList = (cat: Category, list: string[]) => {
      const zone = this.zones[cat];
      zone.innerHTML = '';
      list.forEach((name, idx) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-slate-50 border border-slate-300 text-[10px] px-2 py-0.5 rounded flex justify-between items-center';
        itemEl.innerHTML = `
          <span><b class="text-slate-400 mr-1">${String(idx + 1).padStart(2, '0')}</b> ${name}</span>
          <button class="text-red-400 hover:text-red-600 font-bold ml-1 text-xs leading-none">&times;</button>
        `;
        itemEl.querySelector('button')?.addEventListener('click', () => this.removeItem(cat, idx));
        zone.appendChild(itemEl);
      });
    };

    renderList('material', state.materials);
    renderList('body', state.body);
    renderList('panel', state.panel);
  }
}